---
id: DOS-001
titulo: Dossiê por partida
modulo: dossie
status: planejado
prioridade: P1
facetas:
  dados: planejado
  api: planejado
  ia: ideia
testada: nao
testes: []
depende_de: []
impacta: []
ancoras:
  tabelas: [match, observation, dossier_snapshot, pick, entity_xref, match_odds]
  funcoes: [buildDossierSnapshot]
docs: [docs/investigacoes/dossie-por-partida-fontes-de-dados.md, docs/planos/DOS-001-dossie-por-partida.md, docs/arquitetura/taxonomia-sinais.md]
verificado_em: null
atualizado: 2026-06-18
---

# Dossiê por partida

## Descrição

Camada de consolidação que reúne as 5 dimensões de uma partida (forma/xG, H2H, lesões/escalações, contexto social, odds de mercado) num pacote estruturado por jogo — o "dossiê do jogo" (visao-geral §6, estágio 2 da pipeline). É o insumo único dos motores de IA (picks, insights, value bets) e do assistente. Todo dado carrega rastro da fonte (princípio "sempre mostra o porquê", §5).

## Tarefas

- [ ] P1 dados — esqueleto packages/db + buildDossierSnapshot
- [ ] P2 dados — schema canônico completo + entity_xref + match_odds
- [ ] P3 dados — ingestão SportMonks (1 dimensão)
- [ ] P4 api — GET dossiê por partida (route handler Next)
- [ ] P5 dados — spike odds casas BR (depende CORE-001)

## Plano (2026-06-18)

Dossiê: [docs/planos/DOS-001-dossie-por-partida.md](../../planos/DOS-001-dossie-por-partida.md)

### Objetivo, aceite e non-goals

Primeira camada de dados do projeto: o modelo do dossiê por partida em `packages/db`, do esqueleto à ingestão SportMonks, com snapshot imutável e proveniência por campo.
Non-goals: motor de IA (MOD-001), UI do dossiê, ingestão social em escala, fonte de odds de produção (P5 é só spike), contract de schema (tudo aditivo).
Aceite (cada critério aponta a Prova):
- A1 [dados] dadas observations de uma partida, `buildDossierSnapshot` grava snapshot imutável com `content_hash` determinístico e proveniência por campo → P1
- A2 [dados] schema suporta as 5 dimensões + crosswalk de IDs + odds em centavos (int) → P2
- A3 [dados] ingestão SportMonks normaliza ≥1 partida real em observations rastreáveis (source/observed_at) → P3
- A4 [api] GET do dossiê devolve o snapshot com proveniência por campo (o "porquê") → P4
- A5 [dados] spike grava odds_cents de ≥1 casa BR, OU conclui inviabilidade documentada → P5

### Premissas

- Padrão de workspace `@workspace/*` + exports map (`packages/ui/package.json:2`) vale pro novo `packages/db`; `zod` já disponível.
- Greenfield: sem schema legado, sem migração de dados — tudo só-expand.
- Postgres local sobe via docker-compose criado no P1 (não existe hoje).

### Decisões

- D1: ORM = **Drizzle + Bun SQL nativo** pro esqueleto (cravado pelo dono nesta conversa, 2026-06-18) — driver: SQL-first, Bun-native, ergonomia com JSONB, CLAUDE.md já referencia `packages/db`; descartado Prisma (camada mais pesada, tração Bun recente); pagamos: se Prisma provar melhor DX, migramos. Driver `pg` maduro no caminho transacional do snapshot (counter-review).
- D2: `dossier_snapshot.content_jsonb` = mapa por dimensão com proveniência por campo (`{value, source, observed_at}`) — é o contrato que MOD-001 consome.
- Adiadas pro /i: nomes exatos de colunas extras, micro-estrutura do content_jsonb por dimensão, algoritmo de hash.

### Passos

**P1 [dados] esqueleto** — `packages/db` (novo, `@workspace/db`, Drizzle + Bun SQL + docker-compose Postgres dev): schema mínimo (detalhe: dossiê §Schema-P1 — `match`, `observation`, `dossier_snapshot`, `pick`) + `buildDossierSnapshot(matchId)` (detalhe: dossiê §Consolidação). Prova: `cd packages/db && bun run db:migrate` exit 0 + script smoke insere observations fake → roda `buildDossierSnapshot` → relê snapshot com hash estável → exit 0.
**P2 [dados] schema canônico (depende: P1)** — adicionar `league`/`season`/`round`/`team`/`player` + `entity_xref` + `match_odds(odds_cents int)` (detalhe: dossiê §Schema-P2, aditivo só-expand). Prova: `bun run db:migrate` aplica + query confirma `match_odds.odds_cents` tipo `integer` → exit 0.
**P3 [dados] ingestão SportMonks (depende: P2)** — liga-foco: **Premier League** (cravado pelo dono, 2026-06-18; visão §15.2). Conector p/ 1 dimensão (fixtures + stats/xG) de uma partida da PL → normaliza em `observation` (source='sportmonks', observed_at) + popula `entity_xref`. PL tem a melhor cobertura SportMonks (xG + accuracy de escalação publicada). Prova: com `SPORTMONKS_TOKEN` no `.env`, script de ingestão grava N>0 observations reais de 1 partida da PL; sem token, fixture mock do payload SportMonks normaliza certo (teste).
**P4 [api] servir dossiê (depende: P1)** — route handler Next `apps/web/app/api/dossie/[matchId]/route.ts` que lê o snapshot e devolve o dossiê com proveniência por campo. Prova: `bun run dev` + `curl localhost:<porta>/api/dossie/<matchId>` → 200 + JSON com `{value, source, observed_at}` por campo.
**P5 [dados] spike odds BR (depende: P2 + CORE-001)** — protótipo (detalhe: dossiê §Odds-spike): validar 1 fonte de casas .bet.br (OddsPapi vs API-Football) gravando `match_odds.odds_cents` via `@workspace/core/money`. Prova: script grava odds_cents de ≥1 casa BR (Betano/Superbet) p/ 1 partida → contagem>0, OU doc de inviabilidade em `docs/investigacoes/` com o que cada fonte cobriu.

### Verificação final

- `bun run typecheck` limpo
- P1 smoke → exit 0 · P2 migrate + query tipo `int` · P3 ingestão real N>0 (ou mock) · P4 curl 200 com proveniência · P5 odds_cents>0 ou doc de inviabilidade
- re-teste do `bun run features impact DOS-001` → MOD-001 (hoje `ideia`/sem código: conferir que o shape do snapshot bate com o que MOD-001 espera quando existir)
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra A1..A5 — só gap de requisito/correção; diff fora dos paths deste plano = achado

### Pré-mortem e rollback

3 semanas depois, quebrou. Causas prováveis:
- C1: SportMonks Brasileirão sem xG/escalação na profundidade → snapshot raso; mitigação: P3 valida com dado real antes de prometer.
- C2: nenhuma fonte cobre casas BR a custo viável → value bet inválido; mitigação: P5 é spike, pode concluir inviabilidade → vira decisão de produto.
- C3: regulação Lei 14.790 exige gate +18/disclaimer não previstos → mitigação: snapshot já guarda proveniência; gate é camada de produto (feature futura), schema preparado.
- C4: JSONB bloat / snapshot duplicado → mitigação: hash + payload, GIN só nos campos consultados (D1).
Rollback: schema aditivo reverte com drop (pré-migrate); `observation` append-only não desfaz. Nenhum pick publicado/mensagem enviada nesta feature ainda.

### Fora de escopo

- Porta de dinheiro → `docs/features/core/CORE-001-money-port.md` (ideia); **P5 depende dela**.
- API dedicada `apps/api` (escolha de framework) → decisão de arquitetura futura; P4 usa route handler Next.
- UI do dossiê → feature futura.
- Ingestão social em escala → fase posterior (investigação: adiar).
- Consumo pelo motor quant → MOD-001 (já existe).

## Evidências

- [doc] [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](../../investigacoes/dossie-por-partida-fontes-de-dados.md) — investigação completa: fontes por dimensão + modelo de dados + regulação.
- [web] sportmonks.com/terms-of-service + /faq — licença comercial permite armazenar/derivar/monetizar (revenda de dado bruto proibida); base recomendada p/ stats/xG/H2H + lesões/escalações.
- [web] the-odds-api.com/bookmaker-apis — regiões us/uk/eu/fr/se/au, **sem casas .bet.br**: value bet contra mercado BR não fecha com The Odds API sozinho.
- [web] baptistaluz.com.br/...portaria-spa-mf-1231-2024 — Lei 14.790 + Portaria 1.231 em vigor: gate +18, jogo responsável, advertências → vira campo no schema + gate no produto.
- [web] github.com/statsbomb/open-data LICENSE.pdf (1.2.2) + awfulannouncing (FBref perdeu xG jan/2026) — por que as fontes grátis de xG foram descartadas.
- [web] postgresql.org/docs/datatype-json — JSONB binário/GIN sustenta o modelo híbrido proposto.

## Verificação

_(preencher quando status=verificado)_
