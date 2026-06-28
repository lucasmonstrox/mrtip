# LIG-002 — Página do time (perfil de performance) · dossiê de planejamento (2026-06-28)

Feature: [docs/features/ligas/LIG-002-pagina-do-time.md](../features/ligas/LIG-002-pagina-do-time.md)
Base: commit `6228ca1` (2026-06-28) — todo file:line deste doc vale neste commit.

## TL;DR

Transformar a página do time de stub (header + form chips + lista de jogos) num perfil útil pra aposta, **reusando o que já existe e sem novo pipeline de fixtures**. O MVP (P1–P4) entrega: a linha **oficial** de `standing` (já ingerida, 20 linhas, hoje ociosa em `/teams/:slug`) no header com logo+shortCode; os **splits casa/fora oficiais** via uma **micro-migração aditiva** (colunas em `standing`, populadas do `details` que o sync já fetcha e descarta); e **tendências de aposta** (over 2.5, BTTS, clean sheet, gols/jogo) **derivadas das partidas** com **gate de amostra (n≥10) + banda de incerteza (Wilson 95%)** — nunca % de certeza (Lei 14.790). Fica de fora deste plano (fase 2, com gates duros): stats de time **por partida** (custo de tier INDETERMINADO), técnico/desfalques (`injury`=0 no banco), e add-ons pagos (xG, Predictions).

## Briefing — o que já foi falado e decidido

- Escopo desta rodada = **só a página do time** (treinador/liga/partida ficam fora) — fonte: dono nesta conversa (2026-06-28, AskUserQuestion "Só o Time").
- A investigação `/rs` (workflow) **manda** sobre o quê/porquê; o `/pl` detalha, não re-decide — fonte: [docs/investigacoes/pagina-do-time.md](../investigacoes/pagina-do-time.md).
- **Achado central (inverte o precedente do jogador):** no nível de time **não há unlock barato de filtro** — o include de fixtures do sync **não pede** `;statistics` (`sync-sportmonks.ts:265-266`); stats de time por partida nem chegam. O barato real é o agregado oficial de `standing`, já no banco — fonte: investigação §Estado real + Refutado #1.
- **Splits casa/fora = fonte oficial, não derivada** (correção do counter-review): os splits HOME/AWAY já vêm no `details` da chamada de standings (`sync:204-205`) e são descartados; capturá-los é micro-migração, mais confiável que derivar de n≈19 — fonte: investigação §Refutado #1.
- **Tendências % sempre com gate de amostra + banda**, nunca ponto seco (regulação + n≈19 instável) — fonte: investigação §Refutado #2.
- **xG VETADO pelo dono (2026-06-28)** — não buscar, mesmo se virar grátis. **Predictions é add-on PAGO** — não entra como fonte default; bloco próxima-partida resolve de graça por Poisson interno (fase 2/IA) — fonte: dono nesta conversa + investigação §Refutado #3, §Capacidades.
- Código/dados/URLs em inglês; só UI visível em PT — fonte: memória [[codigo-em-ingles-ui-em-pt]].
- Eden Treaty infere o tipo do retorno de `getTeam` no front (e revive datas em `Date`) → crescer o payload propaga sozinho, sem duplicar tipo — fonte: memória [[eden-revive-datas-em-date]].
- `[PENDENTE-DONO]` (fase 2, NÃO bloqueia o MVP): (a) custo de tier do include `statistics` de fixture é INDETERMINADO até 1 chamada real com o token; (b) comprar add-on de xG/Predictions é decisão do dono.

## Estado do terreno

Por faceta, no commit `6228ca1` (real × ocioso × fantasma):

- **UI — stub.** `apps/web/features/leagues/components/team-detail/team-detail.tsx:18-56`: header (`{team.name}` + `<FormChips recent={team.form.recent} team={team.form.team} />`) e uma lista de jogos com placar linkando `/matches/[id]`. Nenhum stat, classificação, logo, shortCode ou split. O logo (`team.logoUrl`) já trafega no payload e **não é renderizado**.
- **Query — fina, auto-tipada.** `apps/web/.../hooks/data/queries/use-team-query.ts:6-16` chama `api.v1.teams({slug}).get()` (Eden) — cresce com o payload sem edição de tipo.
- **API — stub.** `apps/api/src/modules/leagues/get-team/get-team.service.ts:5-9`: `getTeam` retorna `{...team, form: computeForm(matches, team), matches}`. **Não** junta `standing` nem agrega nada.
- **`getTeamBySlug`** (`apps/api/src/modules/leagues/shared/shared.ts:456-464`): seleciona só `id/name/slug/logoUrl`, retorna `Promise<TeamRef>`. **Único caller = `getTeam`** (verificado por grep) → ampliar o retorno é seguro.
- **`loadTeamMatches`** (`shared.ts:468-473`): todos os jogos do time (casa OU fora), mais recente primeiro, já com `score.ft=[ftHome,ftAway]` → **base das tendências**, sem nova query.
- **`computeForm`** (`shared.ts:849-876`): **já aceita `{before?, n?, side?: "all"|"home"|"away"}`** e devolve `{team, recent, summary:{w,d,l}}` → splits derivados (cross-check) saem de graça.
- **`computeStandings`** (`shared.ts:770-824`): monta a tabela inteira a partir de `Match[]` (cross-check do agregado oficial).
- **Padrão de reuso do agregado oficial** (`apps/api/src/modules/leagues/standings/standings.service.ts:20-26`): lê `standing` por `teamId` e faz merge — **mesmo padrão** que o `getTeam` vai usar.
- **Schema `standing`** (`apps/api/src/db/schemas/leagues.ts:68-92`): `position/points/played/won/drawn/lost/goalsFor/goalsAgainst/goalDifference/zone`, `unique(leagueCode, teamId)`. **Sem colunas home/away** → micro-migração.
- **Schema `team`** (`leagues.ts:21-...`): tem `short_code` (`leagues.ts:27`) — já ingerido (`sync:218`), só não é selecionado/exibido.
- **Sync de standings** (`sync-sportmonks.ts:204-249`): fetcha `/standings/seasons/${SEASON_ID}?include=participant;details;rule.type`; `DET` (`sync` const) mapeia só os **totais** (`played:129,won:130,drawn:131,lost:132,goalsFor:133,goalsAgainst:134,goalDifference:179`); `detVal(row.details, ...)` extrai e o upsert (`:245-248`) grava só totais → **home/away são fantasma (chegam no `details`, descartados)**.
- **`FormGuide`** (`apps/web/.../match-detail/form-guide.tsx:92-101`): chips + resumo `wVeD·dE·lD`, recebe `{form}` (que já tem `form.team`) → upgrade direto do `FormChips`.
- **Banco** (`[banco]` 2026-06-28, docker `mrtip_db` porta 5434): `standing`=20 linhas (populado), `injury`=0 (vazio → bloqueia desfalques). Comentários `shared.ts:131,296,654` ("from injury, which is complete") são **enganosos**.

## Mapa de dependências

**Features** (`bun run features impact LIG-002`):
- Compartilham a âncora `match` com LIG-002: **DOS-001, LIG-001, MOD-001, SIN-020** → re-testar se a serialização de `match` mudar. Este plano só **lê** `match` (não altera schema/serialização) → risco baixo, listados por completude.
- `depende_de`: nenhum (MVP não bloqueia em ninguém).

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `get-team.service.ts#getTeam` | `use-team-query.ts` → `team-detail.tsx` | página `/teams/:slug` no Chrome |
| `shared.ts#getTeamBySlug` (retorno ampliado p/ `+shortCode`) | só `getTeam` | nada além do getTeam |
| `leagues.ts#standing` (colunas aditivas home/away) | `standings.service.ts:22` (lê `teamId,zone`) | página de standings da liga (não deve mudar) |
| `sync-sportmonks.ts` (DET + upsert de standing) | `db:sync` | re-sync popula colunas novas |
| reuso `computeForm(side)` / `computeStandings` (inalterados) | `standings.service`, `form.service` | sem mudança → sem re-teste |

## Blast radius e cuidados

- **Payload de `getTeam` cresce** — sintoma se quebrar: front quebra na inferência Eden; como detectar: `bun run typecheck` + página carrega. Aditivo → baixo risco.
- **`standing` ganha colunas (janela de transição)** — sintoma: linhas antigas com home/away `null` até o re-sync; como detectar: `select home_won from standing` retorna null antes do `db:sync`. Mitigação: colunas **nullable** (só expand) + re-sync como critério de avanço do P2; UI trata null como "sem dado" (não 0).
- **`standings.service.ts` lê `standing`** — só seleciona `teamId,zone`; colunas novas não afetam. Confirmar que a página de standings da liga segue idêntica (re-teste no Chrome).
- **Tendência % sobre n pequeno** — sintoma: % "certeira" enganosa sobre ~19 jogos; mitigação É requisito: esconder/marcar até n≥10 por recorte e **sempre** exibir banda Wilson (vira passo P3, não polish).

## Evidências

- [código] `apps/api/src/modules/leagues/get-team/get-team.service.ts:5-9` — `getTeam` é stub: não junta `standing` nem agrega.
- [código] `apps/api/src/modules/leagues/standings/standings.service.ts:20-26` — padrão de merge do agregado oficial `standing` por `teamId` (a reusar no P1).
- [código] `apps/api/src/db/schemas/leagues.ts:68-92` — `standing` sem colunas home/away (define a micro-migração do P2).
- [código] `apps/api/src/db/sync-sportmonks.ts:204-249` — sync fetcha `include=...;details` e `DET`/`detVal` extraem só totais; home/away descartados.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:849-876` — `computeForm` já suporta `side:"home"|"away"` (splits derivados = cross-check grátis).
- [código] `apps/api/src/modules/leagues/shared/shared.ts:468-473` — `loadTeamMatches` traz `Match[]` com `score.ft` (base das tendências, sem nova query).
- [código] `apps/web/features/leagues/components/match-detail/form-guide.tsx:92-101` — `FormGuide({form})` = upgrade direto do header.
- [banco] 2026-06-28 (`select count(*)`): `standing`=20, `injury`=0 — standing pronto pro MVP; desfalques bloqueados (fase 2).
- [doc] [docs/investigacoes/pagina-do-time.md](../investigacoes/pagina-do-time.md) §Refutado — splits oficiais > derivados; tendências gateadas; add-ons pagos.

## Detalhes por passo (referenciados pelo ## Plano)

### §Schema (P2) — colunas aditivas em `standing`
Só-expand (aditivo, nullable; sem contract). Adicionar a `standing` (`leagues.ts:68-92`):
`home_played, home_won, home_drawn, home_lost, home_goals_for, home_goals_against` e os 6 `away_*` análogos — todos `integer(...)` **nullable**. Gerar migração com o gerador do Drizzle do projeto (mesmo fluxo das migrações em `apps/api/src/db/migrations/`). No sync (`sync-sportmonks.ts`), estender o `DET` com os type_ids HOME/AWAY e gravá-los no upsert (`:231-248`). **Critério de avanço:** os type_ids HOME/AWAY são lidos do `details` real (a investigação aponta a faixa 135-146, mas o `/i` deve **confirmar** imprimindo `row.details` de 1 standing antes de fixar o mapa) → re-sync → `select home_won, away_won from standing limit 3` não-nulo.

### §Trends (P3) — tendências derivadas + incerteza
Novo util puro `computeTeamTrends(matches: Match[], teamId: string)` (em `apps/api/src/modules/leagues/shared/` ou `get-team/`), derivado só de `m.score.ft`:
- `over25` = share de jogos com `ftHome+ftAway > 2.5`; `btts` = share com `ftHome>0 && ftAway>0`; `cleanSheet` = share em que o adversário fez 0; `goalsFor/goalsAgainst` por jogo (médias). Cada um nos recortes `all|home|away`.
- Cada métrica de proporção retorna `{ pct, n, lo, hi }` com **intervalo de Wilson 95%** (não normal — n pequeno). Recorte com `n < 10` → `lowSample: true` (a UI esconde ou marca como "amostra baixa").
- "Porquê + fonte" carimbado: cada número expõe `n` e a janela ("derivado de N jogos da PL 2025/26").

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-002-pagina-do-time.md](../features/ligas/LIG-002-pagina-do-time.md) — os passos NÃO são duplicados aqui.
