---
id: SIN-021
titulo: Sinal — attack momentum / pressão da partida
modulo: sinais
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2
facetas: # só as superfícies que se aplicam
  dados: feito # match_trend + ingestão dos trends por minuto (include=trends) — P1,P2
  api: feito # util momentum.ts (delta+pesos+EMA) + rota GET /v1/matches/:id/momentum — P3
  ui: feito # gráfico de gangorra (ECharts) na aba Momentum do dossiê — P4
  ia: ideia # EXPLICAR: narrar surtos de pressão — peso ZERO no quant; fase 2, fora deste plano
testada: sim
testes:
  - "P2 dados — db:sync populou match_trend: 123.758 linhas, só os 10 trendTypes filtrados; fixture 19427245 = 388 linhas batendo o probe (2026-06-30)"
  - "P3 api — matchMomentum(77a4255a-…) devolve 90 pontos; pico West Ham min 46 (11.56), Leeds min 36 (9.44); jogo com overlap de acréscimo (00979e2b) vira 2 pontos distintos no min 46, sem spike (2026-06-30)"
  - "P4 ui — E2E Chrome: aba Momentum renderiza a gangorra (West Ham azul ↑ / Leeds laranja ↓), pico pós-intervalo visível, console limpo (2026-06-30)"
  - "Revisão em contexto fresco achou bug ALTA (period_id descartado → spike falso no overlap de acréscimo); corrigido com derivação period-aware (chave composta período+minuto) e re-verificado (2026-06-30)"
depende_de: [] # fonte nova (trends por minuto); refinar no /rs
impacta: [DOS-001, SIN-017] # vive no dossiê da partida; complementa o sinal de game-state/timing
ancoras:
  settings: []
  tabelas: [match_trend (proposta)] # trend por (match, time, type_id, period_id, minuto, value) ACUMULADO; grão por-minuto (~1300 linhas/jogo)
  tools: []
  funcoes: []
  rotas: [GET /v1/matches/:id/momentum (proposta)] # momentum derivado em leitura (sub-recurso self-fetching)
docs: [docs/investigacoes/attack-momentum-pressao-da-partida.md, docs/planos/SIN-021-attack-momentum-pressao-da-partida.md]
verificado_em: 2026-06-30
atualizado: 2026-06-30
---

# Sinal — attack momentum / pressão da partida

## Descrição

O "attack momentum" do Sofascore (curva de gangorra mostrando qual time está pressionando minuto a minuto). Útil pra leitura de jogo retroativa e, eventualmente, ao vivo: identificar surtos de pressão, fases de domínio e viradas de momentum — entrada pra narrativa de game-state e mercados ao vivo/2º tempo. É dado **in-play/pós-jogo**, NÃO pré-jogo: não entra no prognóstico atual, vira feature de fluxo da partida.

O índice pronto da SportMonks (`include=pressure`, o equivalente direto) **está fora do plano atual (403)**. Decisão: **reconstruir** o momentum a partir do `include=trends` (que o plano libera, ~1333 pontos/jogo) — os 5 ingredientes da fórmula oficial (shots on target, posse %, attacks/dangerous attacks, ações defensivas) estão todos nos trends, mais ~35 outros tipos por minuto. Fórmula nossa = controle dos pesos e sem caixa-preta.

## Tarefas

- [x] P1 dados — tabela `match_trend` (grão por-minuto) + migração expand-only (0016)
- [x] P2 dados — `trends` no include do sync + `SmTrend` + bulk upsert por fixture; re-sync (123.758 linhas, filtro OK)
- [x] P3 api — util `momentum.ts` (delta+pesos+EMA) + rota `GET /v1/matches/:id/momentum` (88 pts, gangorra coerente)
- [x] P4 ui — `<MatchMomentum id>` self-fetching + `<MomentumChart>` (ECharts gangorra) + aba "Momentum" (Chrome OK, console limpo)
- [ ] ia — (fase 2, fora deste plano) narrar surtos ancorado na curva; EXPLICATIVO-NÃO-PREDITIVO

## Plano (2026-06-30)

Dossiê: [docs/planos/SIN-021-attack-momentum-pressao-da-partida.md](../../planos/SIN-021-attack-momentum-pressao-da-partida.md)

### Objetivo, aceite e non-goals

"Pronto" = abrir o dossiê de uma partida da PL e ver a gangorra de momentum minuto a minuto, reconstruída dos `trends` ingeridos.
Non-goals: índice pago `pressure`; momentum ao vivo (in-play polling); consumo no prognóstico pré-jogo; narrativa por IA (fase 2); ligas além da PL.
Aceite (cada critério aponta a Prova):
- A1 [dados] `match_trend` populada com ~1300 linhas pro fixture West Ham×Leeds → coberto por P2
- A2 [api] `GET /v1/matches/<id>/momentum` devolve `{minute,home,away}[]` não-vazio → coberto por P3
- A3 [ui] na aba "Momentum" observo a gangorra (casa/fora) com o pico do West Ham no fim do jogo → coberto por P4

### Premissas

- `trends` retorna ~1300 pts/jogo, 40 tipos, `value` ACUMULADO, `period_id` por tempo (validado na POC `_momentum.ts`, fixture 19427245).
- `matchIdByFixture`/`teamIdBySm` existem no escopo do loop de sync (`sync-sportmonks.ts:567-611`).
- Front consome sub-recursos por uuid via Eden query hooks (molde `<GoalTiming id>`).
- _Se cair durante o /i: PARAR, atualizar este Plano com a divergência datada._

### Decisões

- D1: **derivar momentum em LEITURA** (na rota), não materializar coluna — driver: fórmula/pesos iteráveis sem re-sync; descartado: tabela `match_momentum` materializada porque trava a calibração; pagamos: derivação roda por request (mitigado: só quando a aba abre, dado de 1 jogo é pequeno). Materializar fica como fora-de-escopo se a query pesar.
- D2: **bulk insert por fixture** (`.values(rows).onConflictDoNothing()`), não insert por-linha — driver: ~500k linhas/season; pagamos: nada (é estritamente mais rápido).
- D3: **aba dedicada "Momentum"** no `match-detail.tsx` — RESOLVIDO pelo dono (2026-06-30): aba dedicada (não card/Eventos), pra o gráfico ter largura total.
- D4: **pesos v1 = os da POC** (`SoT 5, big-chance 6, dangerous-attack 3, shots 2, shots-insidebox 2, attack 1, corners 1, posse 0`) — calibrar por face-validity depois; posse com peso 0 (posse crua infla pressão falsa, investigação §Riscos).
- Adiadas de propósito pro /i: cores/escala exata do ECharts, copy da legenda, empty-state quando `computable:false`.

### Passos

**P1 [dados] schema** — `apps/api/src/db/schemas/leagues.ts`: criar tabela `matchTrend` (shape exato no dossiê §Schema; somar `index` ao import de `drizzle-orm/pg-core`); `bun run db:generate && bun run db:migrate`. Prova: `psql "$DATABASE_URL" -c "\d match_trend"` lista `type_id/period_id/minute/value` e o `unique(match_id,team_id,type_id,period_id,minute)`.

**P2 [dados] ingestão (depende: P1)** — `apps/api/src/db/sync-sportmonks.ts`: `SmTrend` type + `trends` no tipo do fixture; `trends` no include (`:369`) + `&filters=trendTypes:86,580,44,42,43,49,34,78,100,45`; loop novo após `:611` com **bulk** `db.insert(matchTrend).values(rows).onConflictDoNothing()` por fixture (detalhe: dossiê §Ingestão). Falha provável: filtro `trendTypes` ignorado (C2) → filtrar `type_id` no código antes do insert. `bun run db:sync`. Prova: `psql … -c "SELECT count(*) FROM match_trend"` > 100k e a contagem do fixture 19427245 ≈ 1300.

**P3 [api] derivação + rota (depende: P2)** — novo util `momentum.ts` no módulo `leagues` portando `_momentum.ts:11-47` (delta resetando por `period_id`, pesos, EMA; pure function); novo módulo de rota `get-match-momentum` (molde de um sub-recurso existente como `get-goal-timing`) servindo `GET /v1/matches/:id/momentum` → `{minute,home,away}[]`; registrar a rota no index do módulo `leagues`. Prova: `curl -s localhost:3001/v1/matches/<uuid West Ham×Leeds>/momentum | jq 'length'` > 0 e o array tem `home`/`away` numéricos.

**P4 [ui] gráfico + aba (depende: P3)** — `apps/web/features/leagues/`: query hook `use-match-momentum-query.ts` (Eden, por id); `<MomentumChart>` (ECharts, molde `rating-chart.tsx`: gangorra com 2 series casa/fora, eixo X = minuto); `<MatchMomentum id>` self-fetching (molde `<GoalTiming>`); nova `<TabsTrigger value="momentum">` + `<TabsContent>` em `match-detail.tsx:154-164`. Prova: Chrome MCP — navegar pro jogo West Ham×Leeds, clicar aba "Momentum", `take_screenshot` mostra a gangorra; `list_console_messages` limpo.

### Verificação final

- `bun run typecheck` limpo (api + web; contrato Eden da rota nova fecha)
- `bun run lint` limpo nos arquivos tocados
- assert no banco: `SELECT count(*) FROM match_trend` > 100k (P2)
- teste da pure function de derivação (se houver runner; senão, prova via curl do P3)
- golden path no Chrome: 1. navegar pro dossiê do West Ham×Leeds 2. clicar aba "Momentum" 3. observar a gangorra com pico do West Ham no fim + console limpo
- re-teste do `features impact SIN-021` (DOS-001/SIN-017 só leem; sem regressão) + `bun run db:sync` completa populando `match_team_stats`/`weather`/`goal` como antes
- último passo: subagent em contexto fresco revisa o diff contra A1..A3 — reporta só gap de requisito; diff fora dos paths deste plano = achado

### Pré-mortem e rollback

3 semanas depois, quebrou. Causas mais prováveis:
- C1: **sync estoura/trava** por insert por-linha de ~500k linhas — sintoma: `db:sync` nunca termina; mitigação: bulk insert por fixture (D2, é o P2), não loop de awaits.
- C2: **`trendTypes` ignorado** pela API — sintoma: `match_trend` com 40 type_ids e 3× o volume; mitigação: filtrar no código (item do P2).
- C3: **momentum serrilhado/errado** por delta não resetar no `period_id` — sintoma: pico falso no minuto 46; mitigação: reset por período na derivação (dossiê §Derivação) + face-validity no P4.
- C4: **pressão falsa por posse** — sintoma: time de posse estéril parece dominar; mitigação: posse peso 0 (D4).
- C5: **jogo sem trends** (`computable:false`/liga sem cobertura) — sintoma: aba vazia/erro; mitigação: empty-state guardado (adiado pro /i, listado).
Rollback por classe: ui/api → `git revert`; schema → expand reverte com `drop table match_trend` (nada lê). NÃO desfaz: nada (sem picks/cobranças; momentum é descritivo).

### Fora de escopo

- **Perfil de momentum como sinal PRÉ-JOGO no prognóstico** (agregar o momentum dos jogos PASSADOS de cada time — finaliza forte? apaga após 70'? — cortado em `match.date`, injetado no `prognosis-prompt.ts` no padrão de `statByMatchTeam`) → **feature nova**, `depende_de: SIN-021` (precisa de `match_trend` ingerido) e overlap forte com SIN-017 (λ(t)/timing). NÃO é o momentum DESTE jogo (isso é o resultado → vazamento).
- Momentum ao vivo (in-play polling 1×/min) → feature futura.
- Narrativa por IA dos surtos (faceta `ia`) → fase 2 desta feature.
- Materializar `match_momentum` se a derivação em leitura pesar → otimização futura.
- Cobertura multi-liga → segue o unlock geral de ligas.

## Evidências

- [código] `apps/api/scripts/_momentum.ts` — POC da reconstrução: lê `trends.type`, deriva delta por minuto, pondera (SoT×5, big chance×6, dangerous attack×3, shots×2…), suaviza com EMA e plota a gangorra. Rodou no fixture 19427245 (West Ham 3-0 Leeds) e a curva bate com o resultado.
- [código] `apps/api/src/lib/sportmonks.ts` — client `sm()` usado na POC; include `pressure` retorna 403, `trends`/`trends.type` retornam OK.
- [doc] https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/pressure-index — fórmula oficial lista os 5 inputs (todos nos trends); o `pressure` exige **add-on €9–29/mês** (causa do 403) e é **soma-zero** (zera o time dominado) — pior que reconstruir simétrico. Decide build-vs-buy.
- [web] https://karun.in/blog/expected-threat.html + https://www.predictology.co/blog/pressure-index-matters… — base da hierarquia de perigo (SoT>chute>dangerous attack>attack>posse) e janela móvel ~10 min; posse crua infla pressão falsa.
- [doc] https://docs.sportmonks.com/v3/welcome/best-practices — trends são gravados logo após cada minuto; buscar em request separado ~1×/min (30s após a virada do minuto), não no poll de livescores.
- [doc] https://docs.sportmonks.com/v3/welcome/differences-between-api-2-and-api-3/api-changes — v3 separa períodos (period_id + minuto); injury time soma extra no minuto (evita sobreposição 45+ vs início do 2º tempo).

## Verificação

Provada ponta-a-ponta no fixture West Ham 3-0 Leeds (19427245 / match `77a4255a-…`):

- **dados (P1/P2):** migração `0016` aplicada; `match_trend` com **123.758 linhas**, `DISTINCT type_id` = exatamente os 10 filtrados `[34,42,43,44,45,49,78,86,100,580]` (o filtro `trendTypes` funcionou — C2 não se materializou); o jogo de prova tem 388 linhas batendo os counts do probe (attacks=102, dangerous-attacks=64, posse=98, SoT=12).
- **api (P3):** `matchMomentum()` chamado direto devolve 90 pontos; pico do West Ham no min 46 (home 11.56), pico do Leeds no min 36 (away 9.44). **Bug corrigido (achado da revisão fresca):** a 1ª versão descartava `period_id` e colapsava minutos sobrepostos (acréscimo do 1ºT vs início do 2ºT) — inflava o pico (era 19.71). Empiricamente o `value` é **cumulativo no jogo** (não reseta por período: P1-min46=31 → P2-min47=32), então a derivação foi feita **period-aware** (chave composta `rank(período)×1000+minuto`, delta carregando entre períodos). Validado num jogo COM overlap (00979e2b): o min 46 vira 2 pontos distintos, sem spike. C3 de fato mitigado.
- **ui (P4):** E2E no Chrome (sessão real logada) — aba "Momentum" renderiza a gangorra estilo Sofascore (West Ham azul ↑ / Leeds laranja ↓), pico do West Ham ~47' nítido, **console limpo** (0 erros/warnings).

**Caveat de typecheck (externo):** `bun run typecheck` do pacote `web` falha em `prognosis.tsx:200,218` (`bet.probability` nullable não-guardado) — provado **pré-existente** (persiste com os arquivos da SIN-021 stashados), de trabalho paralelo no prognóstico (arquivos M no working tree), **fora do escopo desta feature**. `@workspace/api` typecheck limpo (inclui a rota nova); os 4 arquivos web da SIN-021 têm 0 erros.
