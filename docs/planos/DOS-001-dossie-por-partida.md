# DOS-001 — Dossiê por partida · dossiê de planejamento (2026-06-18)

Feature: [docs/features/dossie/DOS-001-dossie-por-partida.md](../features/dossie/DOS-001-dossie-por-partida.md)
Base: commit `2a5879b` (2026-06-18) — todo file:line deste doc vale neste commit.

## TL;DR

Construir a primeira camada de dados do projeto: `packages/db` (Postgres) com o modelo do dossiê — esqueleto canônico relacional (`league`/`season`/`round`/`team`/`player`/`match`), fatos multi-fonte append-only com proveniência (`observation`), reconciliação de IDs entre fontes (`entity_xref`), odds em centavos (`match_odds`), e o **snapshot imutável** (`dossier_snapshot` com `content_hash`) que congela o dossiê no instante do pick. P1 é o walking skeleton agnóstico de liga (schema + consolidação + leitura); a ingestão SportMonks e o spike de odds das casas BR vêm depois. Decisão cravada na investigação ([docs/investigacoes/dossie-por-partida-fontes-de-dados.md](../investigacoes/dossie-por-partida-fontes-de-dados.md)): Postgres+JSONB híbrido, SportMonks como backbone, odds = protótipo.

## Briefing — o que já foi falado e decidido

- **Postgres + JSONB híbrido; snapshot imutável (hash); observation append-only; entity_xref crosswalk; odds em centavos** — fonte: investigação §"Modelo de dados" + §"Estado da arte". Recomendação cravada, o plano detalha.
- **SportMonks = espinha dorsal** (licença comercial permite derivar/monetizar) — fonte: investigação §"Espinha dorsal de dados".
- **Odds = decisão de protótipo**, The Odds API não cobre casas .bet.br → spike de validação separado, não fonte fechada — fonte: investigação §"Odds" + counter-review.
- **P1 = walking skeleton do modelo agnóstico de liga; odds em passo separado** — fonte: dono nesta conversa (args do `/pl`).
- **ORM = Drizzle** (dono nesta conversa, 2026-06-18) — a regra tooling=protótipo foi dispensada pelo dono p/ a camada de dados inicial (escolha reversível). Ver D1.
- **Transversais do CLAUDE.md** (não re-decididos aqui): dinheiro/odds em centavos via `@workspace/core/money`; datas `date-fns`/`-tz` fuso `America/Sao_Paulo`; folder-by-feature; sem import entre features; lógica pura em `packages/core` testada primeiro.
- **Liga-foco nº1 = Premier League** (dono nesta conversa, 2026-06-18; visão §15.2) — melhor cobertura SportMonks; P3 ingere uma partida da PL.

## Estado do terreno

Greenfield total (confirmado nesta sessão):

- `packages/` só tem `eslint-config`, `typescript-config`, `ui` (`lido-no-código`, `ls packages`). **Não existe** `packages/db` nem `packages/core`.
- Padrão de workspace: `packages/ui/package.json:2` → `@workspace/ui`, `type: module`, `exports` map por arquivo, scripts `lint`/`format`/`typecheck`; `zod ^4.4.3` já é dep (`packages/ui/package.json:22`). Novo pacote deve seguir esse shape.
- App só tem scaffold Next: `apps/web/app/page.tsx`, `apps/web/app/layout.tsx` (`lido-no-código`, Glob). **Não há** `apps/api`, coletor, nem schema de banco.
- Sem `docker-compose`/Postgres local (`lido-no-código`, `ls`). P1 precisa subir um Postgres de dev.
- `@workspace/core/money` é mandado pelo CLAUDE.md mas **não existe** → criar é pré-requisito do passo de odds (ver Fora de escopo: CORE-001).

## Mapa de dependências

**Features** (`bun run features impact DOS-001`):

| ID | Relação | Por quê |
|---|---|---|
| MOD-001 | dependente (`depende_de: DOS-001`) | o motor quant lê o dossiê; mudança no shape do snapshot re-testa MOD-001 (hoje `ideia`, sem código — re-teste é nota até existir) |

**Código:** nenhum consumidor existente (greenfield) — `codebase_impact` não aplicável. Os novos símbolos (`@workspace/db`, `buildDossierSnapshot`) nascem nesta feature.

## Blast radius e cuidados

- **`dossier_snapshot.content_jsonb` + `content_hash`** — é o contrato que MOD-001 vai consumir. Mudar o shape depois quebra o motor. Sintoma se quebrar: motor lê campo inexistente; detectar: teste de contrato do snapshot. Por isso o shape entra no plano como decisão (D2), não improviso.
- **`match_odds.odds_cents`** — inteiro (centavos). Gravar odd como float aqui é o erro clássico de ponto flutuante; detectar: assert de tipo `int` + conversão só via `@workspace/core/money`.
- **Invariante `pick.created_at < match.kickoff_at`** — é o que torna o histórico de acerto auditável (visão §13). Sem isso, look-ahead bias. Detectar: constraint/check no insert do pick.
- **Schema aditivo (greenfield)** — tudo é expand; sem contract. Rollback de schema = drop (pré-migrate).

## Evidências

- [doc] [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](../investigacoes/dossie-por-partida-fontes-de-dados.md) — modelo de dados, fontes por dimensão, regulação; manda no plano.
- [código] `packages/ui/package.json:2-42` — padrão de workspace `@workspace/*` + exports a seguir no `packages/db`.
- [código] `apps/web/app/page.tsx` — confirma greenfield (sem camada de dados).
- [web] postgresql.org/docs/datatype-json — JSONB/GIN sustenta o híbrido.
- [web] orm.drizzle.team/docs/get-started/bun-sql-new — Drizzle + Bun SQL nativo (D1).

## Detalhes por passo (referenciados pelo ## Plano)

### §Schema (P1/P2) — shape canônico (aditivo, só expand)

```
-- P1 (esqueleto mínimo p/ o ciclo observation → snapshot → leitura)
match(id uuid pk, season_id uuid null, home_team_id uuid null, away_team_id uuid null, kickoff_at timestamptz, status text)
observation(id uuid pk, match_id uuid fk, dimension text, metric text, value_jsonb jsonb, source text, observed_at timestamptz, ingested_at timestamptz)
dossier_snapshot(id uuid pk, match_id uuid fk, captured_at timestamptz, content_jsonb jsonb, content_hash text)
pick(id uuid pk, match_id uuid fk, snapshot_id uuid fk, selection text, model_version text, created_at timestamptz, CHECK created_at < (SELECT kickoff_at ...)) -- invariante via trigger/check na app

-- P2 (completa o esqueleto canônico + crosswalk + odds)
league(id, name, country)  season(id, league_id, label, start_date, end_date)  round(id, season_id, number, name)
team(id, canonical_name)  player(id, canonical_name, primary_position)
entity_xref(entity_type text, canonical_id uuid, source text, source_id text, confidence real, matched_at timestamptz)
match_odds(id uuid pk, match_id uuid fk, bookmaker text, market text, odds_cents int, captured_at timestamptz, source text)
```

GIN só nos campos de `value_jsonb`/`content_jsonb` que forem efetivamente consultados (não index blanket). `timestamptz` interpretado em `America/Sao_Paulo` na borda.

### §Consolidação (P1) — `buildDossierSnapshot(matchId)`

Lê todas as `observation` da partida, monta o `content_jsonb` agregado **com proveniência por campo** (`{value, source, observed_at}`), calcula `content_hash` (hash estável do conteúdo canônico ordenado), grava `dossier_snapshot` imutável. Re-rodar com os mesmos inputs → mesmo hash (determinístico).

### §Odds-spike (P5) — protótipo de fonte BR

Exploratório: validar se OddsPapi/odds-api.io ou API-Football entregam odds reais de casas .bet.br (Betano/Superbet/KTO). Grava em `match_odds.odds_cents` via `@workspace/core/money`. Pode concluir **inviabilidade documentada** (resultado válido). Depende de CORE-001 (money port).

## Plano executável

Ver seção `## Plano` de [docs/features/dossie/DOS-001-dossie-por-partida.md](../features/dossie/DOS-001-dossie-por-partida.md) — os passos NÃO são duplicados aqui.
