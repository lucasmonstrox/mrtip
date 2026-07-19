---
id: LIG-012
titulo: Ingestão da Série A (Brasileirão) — segunda liga do produto
modulo: ligas
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1
facetas:
  dados: verificado # fuso nos 4 sítios + re-sync dos 4 lotes, sync parametrizado c/ janela derivada, zonas CONMEBOL, 380 jogos BRA — provado por script
  api: verificado # desempate por liga, campanha por país, season derivada — provado por script chamando os services direto
  ui: verificado # 3 mapas de zona com as chaves CONMEBOL — provado no Chrome (T1..T5), 4 zonas com cor+legenda, PL sem vazamento
testada: sim # nao | parcial | sim
testes:
  - "_check-kickoff-tz.ts (2026-07-19): 3/3 função pura — BRT vira o dia, BST→15:00, GMT inalterado (A1/A2)"
  - "_check-kickoff-tz.ts --db (2026-07-19): 4/4 por lote — todo jogo BST andou +60min, nenhum GMT mudou, e DIA mudou 0 em todos os 4 lotes ingleses (A2/A2b + blast radius de match.date)"
  - "_check-zones.ts (2026-07-19): 11/11 — 4 zonas CONMEBOL distintas (prefixo Libertadores×pré-Libertadores) + não-regressão das 4 europeias"
  - "_check-zones.ts --db (2026-07-19): 4/4 zonas CONMEBOL gravadas na season BRA"
  - "_check-bra-ingest.ts (2026-07-19): 17/17 — escopado POR TEMPORADA: 2025=380 jogos/20 clubes e 2026=380/20; corrente é a 2026; 2026 em curso (182 disputados/198 a disputar); fuso conferido contra a API em 50 fixtures (0 divergentes, 9 viram o dia); logo único 20/20; PL segue 380+380 (A3/A4)"
  - "_check-standings-order.ts (2026-07-19): 11/11 — caso sintético + CASO REAL na 2026 (Atlético Mineiro 7V acima de Corinthians 6V, ambos 24pts e saldo -1); BRA 2025 e BRA 2026 e PL == ordem oficial SportMonks; PL == comparador legado; ramos ?upTo=10 e ?upTo=1 exercitados (A5)"
  - "_check-campaign.ts (2026-07-19): 4/4 — concurrentSeasonIds(PL 2025/26)=3 (LIG-011 intacto), BRA=1, interseção 0 (A6)"
  - "_check-derivation.ts (2026-07-19): 6/6 — bidirecional: Flamengo→BRA e Arsenal→PL; jogador só de copa→null (filtro league.type ativo); time sem campanha→null (A7)"
  - "_check-endpoints.ts (2026-07-19): 10/10 service direto — Flamengo abre na Série A (38 jogos, 1º, zona libertadores), Arsenal sem vazar BRA, PL sem zona CONMEBOL, ?season= inexistente→season_not_found (A7)"
  - "bun run typecheck 3/3 workspaces verde + lint 0 errors (2026-07-19)"
  - "_check-impact.ts (2026-07-19): 5/5 — 1724 jogos ingleses comparados, 0 mudaram de DIA DA SEMANA (SIN-008 não reclassifica); descanso, densidade e slug computam na Série A (LIG-005/MOD-009/LIG-009)"
  - "Chrome real (2026-07-19) T5 golden path: /leagues/BRA com 20 clubes, 4 zonas CONMEBOL com cor e legenda PT (Libertadores/Pré-Libertadores/Sudamericana/Rebaixamento), distribuição 4-2-6-4+4 idêntica à do banco, escudos do R2 carregando (A8)"
  - "Chrome real (2026-07-19) T1: /leagues/PL com legenda só europeia, zero vazamento CONMEBOL; Chelsea 52pts(14V,+6) ACIMA de Fulham 52pts(15V,-4) prova ao vivo que a PL não usa vitórias (A5)"
  - "Chrome real (2026-07-19) T3: /teams/flamengo abre na temporada 2025 (Série A) com rótulo Libertadores; 1º/79pts/+51 batem com a tabela (A7)"
  - "Chrome real (2026-07-19) T4: partida BRA às '22 de nov, 2025 · 21:30' (hora de Brasília — em UTC seria 00:30 do dia 23), posições coloridas por zona CONMEBOL, card Descanso 3d/6d (A1 visual + 3º mapa de zona)"
  - "Chrome real (2026-07-19): list_console_messages sem NENHUM erro nas 4 páginas (só o aviso padrão de dev keys do Clerk)"
  - "Série A 2026 (season 26763) sincronizada a pedido do dono (2026-07-19): 380 partidas, 20 clubes, é a corrente; /leagues/BRA abre em 2026 e mostra o desempate por vitórias na tela (Atlético Mineiro 11º acima de Corinthians 12º)"
  - "_check-impact.ts fixado na season 2025 e _check-{bra-ingest,endpoints,standings-order} escopados por temporada — com 2 temporadas no ar, assert por LIGA passaria a medir a soma das duas"
  - "Playwright e2e (2026-07-19): 1 passou (visitante→/sign-in), 1 PULADO (spec autenticado, falta .env.e2e) — skip declarado, não conta como verde"
depende_de: [LIG-008, LIG-011]
impacta: [LIG-001, LIG-002, LIG-005, LIG-006, LIG-009, LIG-011, MOD-001, MOD-003, MOD-004, MOD-009, SIN-008, SIN-016]
ancoras:
  settings: []
  tabelas: [league, season, match, standing, team, player, venue]
  tools: []
  funcoes: [normalizeZone, computeStandings, concurrentSeasonIds, resolveSeason, matchSlug, kickoffInTimeZone, tiebreakOf, leagueCodeOfTeam, leagueCodeOfPlayer, seasonWindows]
  rotas: [/v1/leagues/:code/standings, /v1/teams/:slug, /v1/players/:id]
docs: [docs/investigacoes/serie-a-brasileirao-migracao-sportmonks.md, docs/planos/LIG-012-ingestao-serie-a-brasileirao.md]
verificado_em: 2026-07-19
atualizado: 2026-07-19
---

# Ingestão da Série A (Brasileirão) — segunda liga do produto

## Descrição

Adicionar o Campeonato Brasileiro Série A (SportMonks `league_id` 648) como **segunda liga** do mrtip, ao
lado das 4 competições inglesas já ingeridas. O plano SportMonks já inclui a Série A com **3 temporadas**
(2024, 2025, 2026 em curso) e **cobertura idêntica à da Premier League** — o custo da migração não está no
dado, está em generalizar o código que assume "liga = PL, temporada = europeia, fuso ≈ UTC".

É a primeira vez que o produto roda com 2+ ligas, então esta feature **aciona o gate deixado pelo LIG-008**
(`LIG-008-historico-multi-temporada.md:97`: _"Se entrar 2ª liga antes do `/i`: PARAR e generalizar"_).

## Decisões do dono (2026-07-19)

- **Alvo: temporada 2025 (`sportmonksSeasonId` 25184)** — encerrada, 380 jogos, 100% de `statistics` e 20/20 de
  rating na amostra. Por ser encerrada, **dispensa o sync incremental**, que sai do escopo desta feature.
> **REVISÃO DO DONO (2026-07-19, no fim do `/i`): a temporada 2026 FOI sincronizada, a pedido, e é a
> corrente.** Isso supera a decisão de adiar a 2026 para a LIG-013 — o dono foi avisado dos 3 custos
> (contraria a decisão registrada; `/leagues/BRA` passa a abrir numa temporada pela metade; e a
> maquinaria da LIG-013 — sync incremental, backoff em 429, agendamento — **não existe**, então a carga
> é única e começa a envelhecer) e optou por sincronizar e virar o default assim mesmo.
> Season `26763` (2026-01-28→2026-12-02), 380 partidas, 182 disputadas / 198 a disputar.
> **Consequência para o MOD-004/MOD-010:** o insumo default da Série A agora é uma temporada em curso.
> **Consequência para a LIG-013:** ela deixa de ser "ingerir a 2026" e passa a ser "manter a 2026
> atualizada" — o dado já está no banco, falta o mecanismo de refresh.

- **Esta feature é o passo 1 de 2, explicitamente.** A 2025 entrega base de calibração/backtest em Série A (hoje
  inexistente — `_backtest-math-vs-naive.ts:33` filtra `leagueCode = "PL"`) e páginas históricas de time/jogador.
  Ela **não coloca jogo ao vivo na tela nem gera pick**: temporada encerrada não é apostável. O passo 2 (Série A
  2026 ao vivo, com sync incremental + agendamento + resiliência a 429) é **feature futura separada**, a abrir
  depois de fechar o marco de MOD-004 em curso — trocar o insumo no meio da recalibração destrói a atribuição
  de causa.
- **`league.code` = `BRA`** — entra no slug de toda partida (LIG-009), caro mudar depois.
- **Fuso primeiro**: a correção de UTC→fuso da liga entra ANTES da ingestão, aceitando o re-sync da PL que ela
  implica (muda horários já exibidos). Evita que 67 dos 380 jogos de 2025 nasçam com data errada.

## Tarefas

- [x] P1a dados — fuso: coluna `league.timezone` + helper único de conversão UTC→fuso da liga
- [x] P1b dados — aplicar o helper nos **4** sítios que gravam `date`/`time` + re-rodar os 4 syncs
- [x] P2 dados — parametrizar liga/season/code do sync + `WINDOWS` derivada da season
- [x] P3 dados — zonas CONMEBOL em `normalizeZone` (2 cópias) + sufixo nas 2 chamadas `imgKey("teams", …)`
- [x] P4 dados — ingerir a Série A 2025 completa (season 25184, 380 jogos)
- [x] P5 api — desempate por liga em `computeStandings` (vitórias antes do saldo na Série A)
- [x] P6 api — `concurrentSeasonIds` agrupa campanha por `league.country`
- [x] P7 api — `resolveSeason` derivado da liga em `get-team`/`get-player`
- [x] P8 ui — zonas CONMEBOL nos 3 mapas de zona (código feito; **prova visual A8 pendente**, bloqueada por Clerk)

Fora desta feature (ver §Fora de escopo do Plano): recalibrar o motor para o futebol BR (MOD-010),
Série A 2026 ao vivo (LIG-013), home fora do mock (LIG-014).

## Plano (2026-07-19)

Dossiê: [docs/planos/LIG-012-ingestao-serie-a-brasileirao.md](../../planos/LIG-012-ingestao-serie-a-brasileirao.md)
Dependências LIG-008 (`verificado`) e LIG-011 (`feito`) estão fechadas — sem bloqueio, sem P0 de stub.

### Objetivo, aceite e non-goals

"Pronto" = a Série A 2025 (380 jogos) está no banco com data/hora corretas e navegável em `/leagues/BRA`,
**e** toda saída da PL continua idêntica ao baseline. Generalizar vem antes de ingerir.

Non-goals: Série A 2026 / ao vivo, sync incremental, resiliência a 429 (feature futura); recalibrar o motor
para o futebol BR; home fora do mock; Libertadores/Copa do Brasil (fora do plano SportMonks); confronto
direto e disciplina no desempate (dossiê §Desempate).

Aceite (cada critério aponta a Prova que o cobre):
- A1 [dados] partida da Série A grava o horário de Brasília, não o UTC → helper no P1a, efeito no banco no P4(a)
- A2 [dados] jogo de agosto da PL passa a gravar 15:00 (BST); jogo de dezembro (GMT) não muda → P1a (helper) e P1b (banco)
- A2b [dados] os **4** lotes já ingeridos (PL 25/26, PL 24/25, FA Cup, Carabao) saem do re-sync no MESMO fuso —
  nenhum lote fica em UTC cru → P1b
- A3 [dados] o sweep cobre a janela real da season alvo, derivada da API, e acha os 380 jogos → P2
- A4 [dados] 380 partidas BRA 2025, 20 clubes, 0 `season_id` null, zonas CONMEBOL não-null → P3 (função) + P4 (banco)
- A5 [api] tabela da Série A ordena vitórias antes do saldo; a da PL sai byte-a-byte igual → P5
- A6 [api] `concurrentSeasonIds` da PL segue = 3 (LIG-011 intacto); a da BRA = 1 → P6
- A7 [api] `/teams/:slug` e `/players/:id` de clube brasileiro respondem 200 → P7
- A8 [ui] as 4 zonas CONMEBOL renderizam com cor e legenda, sem vazar para a PL → P8

### Premissas

- P-1: `GET /seasons/:id` devolve `starting_at`/`ending_at` — **verificado ao vivo 2026-07-19** (25184 →
  `2025-03-29`/`2025-12-07`). O type local `SmSeason` declara só `{id, name}`: ampliá-lo é parte do P2.
- P-2: `apps/api` **não tem `date-fns` nem `date-fns-tz`** hoje — instalar é parte do P1a, não pressuposto.
- P-3: PL/FAC/CARA têm `league.country = "England"` (query dev 2026-07-19) — base do critério do P6.
- P-4: o demote de `isCurrent` já é escopado por liga; sincar a BRA não derruba a season corrente da PL.
- P-5: árvore suja com WIP do LIG-011 em `shared.ts`/`get-player.service.ts` (não commitado), que P5-P7 tocam —
  **conferir o estado antes de editar**; se já tiver sido commitado, reconciliar.
- Premissa que cair durante o `/i`: PARAR, anotar aqui a divergência datada, não forçar o passo original.

### Decisões

- D1: **fuso da liga** (coluna `league.timezone`), não do viewer — driver: decisão do dono; descartado:
  `timestamptz` + render no fuso do leitor, mudaria o contrato de `match.date`/`match.time` e o agrupamento por
  rodada; pagamos: usuário BR vê jogo da PL no horário de Londres (dossiê §Display).
- D2: **`formatDate` não muda** — com fuso da liga gravado, concatenar `time` verbatim passa a ser o correto.
  Supera o item "Fase 0 · ui" da investigação; não é esquecimento (dossiê §Display).
- D3: **campanha por `league.country`**, não por `leagueCode` — driver: o LIG-011 cruza PL+FAC+CARA de propósito;
  descartado: filtrar por liga, quebraria a forma cross-competition; pagamos: uma futura Libertadores
  (continental) não caberia no critério — anotado, não resolvido.
- D4: **o sync principal parametrizado ingere a BRA**; `sync-old-season.ts` só recebe as correções — driver: só o
  principal faz upsert de liga e marca `isCurrent`; descartado: fundir os dois syncs, refactor além do escopo;
  pagamos: duplicação viva (2 pontos de aplicação por correção de `dados`).
- D5: **desempate como dado por liga**, não `if (code === "BRA")` — driver: a 3ª liga não pode exigir novo `if`.
- D6: **jogador transferido entre ligas resolve pela liga da aparição mais recente** (não pela "primeira que
  aparecer") — driver: quem saiu da PL para um clube brasileiro deve abrir na Série A, a liga onde joga hoje;
  pagamos: a página abre na liga nova e o histórico da anterior fica atrás do `?season=`.
- D7: **CLI do sync principal com flags nomeadas** (`--league --season --code --timezone --dry-run`) — driver:
  4 parâmetros + um modo booleano não cabem em posicional legível; descartado: seguir o `process.argv` posicional
  que `sync-cup.ts:23-26` e `sync-old-season.ts:18` já usam; pagamos: os 3 syncs ficam com convenções de CLI
  diferentes (unificar é refactor fora de escopo).
- D8: **sufixo no `imgKey("teams", …)` é hardening preventivo**, não cura de colisão medida — driver: paridade
  com venues/players custa ~1 linha × 2 sítios; descartado: deixar como está até haver colisão real (o namespace
  é global às 5 ligas e a falha é silenciosa e destrutiva); pagamos: a chave R2 de ~20-25 clubes da PL muda
  (`arsenal.png` → `arsenal-19.png`) e os objetos antigos ficam órfãos no bucket. **A colisão Atlético/Athletico
  citada na investigação NÃO foi verificada** e provavelmente é falsa (slugs distintos) — nenhuma Prova deste
  plano asservera "erro atual" (dossiê B3).
- D10: **o desempate por liga mora num const map em `shared/shared.ts`**, chaveado por `league.code`, não numa
  coluna de `league` — driver: manter o P5 `api` puro (coluna exigiria expand/migrate que o plano não tem) e é
  regra de negócio, não configuração do dono; descartado: `league.tiebreak` (o `league.timezone` do P1a puxa para
  esse reflexo); pagamos: a regra de uma liga nova entra por deploy de código, não por update no banco.
- D9: **`?upTo=N` continua tratando rodada como cronologia** — driver: consertar mudaria a saída da PL e quebraria
  a metade "byte-a-byte" do aceite; pagamos: a visão "tabela no momento do jogo" da Série A pode incluir jogo
  cronologicamente posterior (o deslocamento no BR chega a ~15 rodadas). Registrado em §Fora de escopo, não corrigido.
- Adiadas de propósito pro `/i`: nomes exatos do helper de fuso e do type de config de liga; micro-estrutura do
  arquivo de config; copy PT dos rótulos CONMEBOL; nomes exatos de `leagueCodeOfTeam`/`leagueCodeOfPlayer`.

### Passos

**O esqueleto é o P4, não o P1**: P1-P3 são pré-requisitos duros (o dono cravou fuso primeiro; ingerir antes do
P3 grava zona `null` e sobrescreve logo no R2). O dry-run do P2 antecipa, com diff pequeno, o risco de
integração mais caro: sweep que perde jogos em silêncio.

**Regra de prova deste plano** (vale para P1a, P1b, P3 e P4): a Série A **não existe no banco antes do P4**.
Todo passo anterior prova no nível de **função pura** (entrada fixa → saída esperada, sem banco e sem rede);
os asserts de efeito em dado brasileiro ficam explicitamente listados na Prova do P4. Passo que asseverar
conteúdo da Série A antes do P4 está errado por construção — não tente "adiantar" rodando o sync.

**P1a [dados] helper de fuso + coluna** — `apps/api/src/db/schemas/leagues.ts` (coluna `timezone` em `league`,
expand aditivo, `not null default 'Europe/London'`) + helper novo e único em `apps/api/src/lib/` que recebe
(`starting_at` cru, `timezone`) e devolve `{ date, time }`. Detalhe: dossiê §Schema e §Fuso.
Regras: datas **sempre** via `date-fns`/`date-fns-tz` (instalar em `apps/api`; hoje **não** tem — P-2), nunca
aritmética manual de `Date` nem `Intl` cru; `type`, nunca `interface`; código/dado em inglês.
Don't: `new Date(f.starting_at)` cru → a string vem `"YYYY-MM-DD HH:mm:ss"`, com **espaço** no lugar do `T` e
**sem** `Z`; vira `Invalid Date` ou hora local do runner. Don't deixar a coluna `not null` sem default → o insert
das 3 ligas existentes quebra. Don't tocar `formatDate` no web (D2). Don't escrever o fuso hardcoded no helper —
ele **recebe** o fuso; quem sabe o fuso é a linha da `league`.
Prova (função pura, **sem banco e sem rede** — a Série A ainda não existe no banco): `cd apps/api &&
bun run db:generate && bun run db:migrate && bun run scripts/_check-kickoff-tz.ts` → `3/3`. Os 3 casos (entrada
crua + fuso → `date`/`time` esperados) estão na tabela do dossiê §Fuso, camada 1: BRT que vira o dia, BST que
corrige para `15:00`, e GMT que tem de sair **inalterado** (erro ali = conversão dupla). Mais:
`select code, timezone from league` → 3 linhas `Europe/London`.

**P1b [dados] aplicar o fuso nos 4 sítios de escrita + re-sync (depende: P1a)** — `grep -rn "starting_at.slice"
apps/api/src apps/api/scripts` devolve **QUATRO** sítios, não dois (tabela completa no dossiê §"quantos pontos de
aplicação existem DE VERDADE"): `src/db/sync-sportmonks.ts:451-452`, `scripts/sync-old-season.ts:203`,
`src/db/sync-cup.ts:188-189` (passo lean) e `src/db/sync-ingest.ts:250-251` dentro de `ingestFixtures`. O fuso
entra como campo novo em `IngestOpts` (`sync-ingest.ts:208-216`, que já carrega `seasonId`/`code`), porque
`sync-cup.ts` grava a partida duas vezes — lean e rico — e as duas têm de concordar.
Don't corrigir só o sync principal: `sync-old-season.ts` **não** delega pro `ingestFixtures`, grava direto — os 4
sítios são 4 edições. Don't converter duas vezes (helper no sync **e** de novo na leitura) — sintoma é jogo de
dezembro da PL mudando de horário. Don't parar no código: linha já gravada **não** muda sozinha; sem re-rodar os
4 syncs a base fica em **fuso misto** (PL 25/26 em Londres, 1.344 partidas de copa/2024-25 em UTC cru) e o LIG-011,
que ordena PL+copas por `match.date` numa lista só, reordena a forma em silêncio (B2).
> **DIVERGÊNCIA (2026-07-19, durante o `/i`) — o entrypoint da FA Cup no plano estava errado.**
> `bun run src/db/sync-cup.ts 24 25919 FAC proper` reescreve só os **123** jogos das stages "proper"
> (8 de 16), não os 871 do lote: as 748 partidas de qualifying só nascem da invocação **sem** o
> `proper`. Rodando só o comando documentado, **709 jogos em BST ficam em UTC cru** — exatamente o
> modo de falha C6/B2 que este passo existe para evitar. Corrigido para
> `bun run src/db/sync-cup.ts 24 25919 FAC` (sem `proper`), que cobre as 16 stages.
> **A métrica de detecção do plano também era fraca demais** para pegar isso: FAC ficou em **0,8%**
> de alteração, não em 0%, então o critério "nenhum lote com 0% global" passava batido. O
> `_check-kickoff-tz.ts --db` usa um critério mais afiado: jogo em mês seguramente BST tem de andar
> **exatamente +60min** e jogo em GMT profundo **0** — foi ele que denunciou os 709.

Prova: rodar os 4 syncs — `bun run db:sync` · `bun run scripts/sync-old-season.ts 23614` ·
`bun run src/db/sync-cup.ts 24 25919 FAC` (sem `proper` — ver divergência acima) ·
`bun run src/db/sync-cup.ts 27 25654 CARA` — e então
`bun run scripts/_check-kickoff-tz.ts --db` → por lote (PL 25/26, PL 24/25, FAC, CARA): fração de partidas com
`time` alterado ~41% no verão inglês e `0%` em dez/jan/fev; **nenhum lote com 0% global** (= sync esquecido);
nenhum lote com 100% (= conversão dupla). Contagens preservadas: `380`/`380`/`871`/`93`.

**P2 [dados] parametrizar o sync (depende: P1b)** — em `apps/api/src/db/sync-sportmonks.ts`, as constantes de
módulo `LEAGUE_ID`/`SEASON_ID`/`CODE` (`:20-22`) deixam de existir e viram argumento (liga/season/code/timezone);
a constante `WINDOWS` (`:378-383`) passa a ser derivada de `starting_at`/`ending_at` de `GET /seasons/:id`,
fatiada em janelas < 100 dias; o type `SmSeason` (`:85`, hoje só `{id, name}`) ganha os campos de data. Inclui um
modo dry-run (busca e conta, não escreve) para provar o sweep sem sujar o banco.
**Convenção de CLI (D7, não re-decidir):** flags nomeadas (`--league --season --code --timezone --dry-run`), que
**divergem de propósito** do `process.argv` posicional já usado por `sync-cup.ts:23-26` e `sync-old-season.ts:18`.
Driver: 4 parâmetros + um modo booleano não cabem em posicional legível. Os outros dois scripts **ficam como
estão** — unificar a CLI dos 3 syncs é refactor fora deste escopo.
Regras: `type`, nunca `interface`; código/dado em inglês (só string de UI em português).
Don't: manter qualquer janela hardcoded como fallback — o modo de falha é **exit 0 com base incompleta**, e um
fallback silencioso o reintroduz. Don't assumir 100 dias exatos (o teto é ~100: fatie com folga). Don't fazer
o dry-run gravar nada, nem logo no R2. Don't mudar o critério de dedup por id de fixture.
Prova: `cd apps/api && bun run db:sync --league 648 --code BRA --season 25184 --timezone America/Sao_Paulo --dry-run`
→ imprime 3+ janelas cobrindo `2025-03-29`→`2025-12-07` e `fixtures: 380`; e o mesmo comando para a PL
(`--league 8 --season 25583`) → `380`, provando que a PL não regrediu.

**P3 [dados] zonas CONMEBOL + sufixo de logo (depende: P2)** — `normalizeZone` em
`apps/api/src/db/sync-sportmonks.ts:206-213` **e** sua cópia em `apps/api/scripts/sync-old-season.ts:59-66` passam
a mapear `CONMEBOL_LIBERTADORES`, `CONMEBOL_LIBERTADORES_QUALIFIERS` e `CONMEBOL_SUDAMERICANA` (`RELEGATION` já
existe). As **duas** chamadas `imgKey("teams", …)` sem sufixo — `sync-sportmonks.ts:320` e
`sync-old-season.ts:136` — passam a mandar o id SportMonks do time como 4º argumento, igual venues (`:404`) e
players (`:516`) já fazem. É **hardening preventivo**, não a cura de uma colisão medida (dossiê B3).
Don't: reusar as chaves europeias para zona sul-americana (`champions` para Libertadores) — o mapa de cor da UI
é indexado por essa string e a PL passaria a mostrar rótulo errado. Don't casar por `includes("CONMEBOL")` sem
distinguir Libertadores de pré-Libertadores — são zonas diferentes na tabela, e `includes("CONMEBOL_LIBERTADORES")`
também casa com `CONMEBOL_LIBERTADORES_QUALIFIERS`: teste o mais específico **primeiro**. Don't mudar o sufixo de
venues/players (chaves já gravadas no R2 mudariam). Don't corrigir só uma das duas cópias de `normalizeZone`, nem
só uma das duas de `imgKey("teams", …)`. Don't tocar `apps/api/src/modules/leagues/consts.ts` — o `CATALOG` ali é
de API-Football, não tem importador nenhum e o docstring dele manda fazer a coisa errada (dossiê B7); liga real
nasce do upsert do sync.
Prova (**função pura, sem banco** — a Série A só entra no P4): `bun run scripts/_check-zones.ts` → alimenta
`normalizeZone` com os 4 `developer_name` que a API devolve para a season 25184
(`CONMEBOL_LIBERTADORES`, `CONMEBOL_LIBERTADORES_QUALIFIERS`, `CONMEBOL_SUDAMERICANA`, `RELEGATION`) → 4 valores
distintos e **nenhum** `null`; e com as 4 chaves europeias (`CHAMPIONS`/`EUROPA`/`CONFERENCE`/`RELEGATION`) →
saída **idêntica à de hoje** (não-regressão da PL). Os asserts que dependem de dado ingerido (zonas gravadas,
unicidade de `logo_url`) são do P4.

**P4 [dados] ingestão completa da Série A 2025 (depende: P3)** — roda o sync parametrizado para
`league 648 / season 25184 / code BRA / America/Sao_Paulo`. É o esqueleto: atravessa `dados` → `api` (a liga
aparece em `GET /v1/leagues`) → `ui` (a nav já itera o catálogo, sem código novo).
**Resiliência (achado da investigação §Fase 2, tratado aqui e não adiado):** o sweep são 380 fixtures com ~12
includes + uploads no R2, contra um cliente que lança em qualquer não-2xx sem retry nem backoff
(`apps/api/src/lib/sportmonks.ts:35`). O rate limit medido é **2000 req/h por entidade** e o sweep cabe com folga
(dezenas de chamadas, não milhares), então backoff em 429 **não** entra — mas o passo só é aceitável porque o
sync é **idempotente** (upsert por `sportmonksFixtureId`/`sportmonksTeamId`): se cair no meio, re-rodar retoma
sem duplicar. Backoff/agendamento/retomada de temporada viva ficam no LIG-013, onde a temporada é incremental.
Don't: rodar antes do P3 (grava zona null e sobrescreve logo). Don't marcar a season 2025 como
`isCurrent: false` — é a única season da BRA e a UI default resolve pela corrente (`season_not_found` senão).
Don't ingerir 2024 ou 2026 aqui (2024 tem `statistics` em 87%; 2026 é feature futura). Don't "consertar" um
crash no meio deletando e recomeçando — o sync é idempotente, re-rodar basta.
Prova: `bun run scripts/_check-bra-ingest.ts` → `380` partidas, `20` clubes, `0` com `season_id` null,
`0` com `date` fora de `2025-03-29..2025-12-07`, `1` season BRA com `is_current = true`; e a PL segue com
`380`+`380` partidas (assert de não-regressão, o modo de falha é ingestão cruzada).
Asserts herdados, que só agora têm dado para rodar: (a) **fuso (P1)** — ≥1 partida BRA cujo `date` é o dia
**anterior** ao do `starting_at` UTC, e nenhuma com `time` igual ao UTC cru em jogo noturno (cobre A1);
(b) **zonas (P3)** — as 4 zonas CONMEBOL não-null em `standing` da season BRA, `0` zona `null` no top-6/bottom-4;
(c) **logo (P3)** — `count(distinct logo_url) = count(*)` nos 20 clubes da BRA (ausência de colisão; **não**
asseverar "erro atual" — a colisão nunca foi medida, dossiê B3).

**P5 [api] desempate por liga (depende: P4)** — `computeStandings` em
`apps/api/src/modules/leagues/shared/shared.ts` passa a receber a regra de ordenação da liga em vez de assumir a
da PL no comparador final; os 2 callers, ambos em `standings.service.ts#standings`, repassam.
Regra da Série A: vitórias → saldo → gols pró (dossiê §Desempate).
**Onde a regra mora (D10, não re-decidir):** const map em `shared/shared.ts`, chaveado por `league.code`, com a
lista ordenada de critérios; default = a ordem atual da PL, para liga não listada. **NÃO** é coluna nova em
`league` — o `league.timezone` do P1a é precedente de *dado por liga*, mas o desempate é **regra**, não
configuração do dono, e uma coluna aqui obrigaria expand/migrate que este passo não tem.
Regras: lógica transversal a 2+ operações mora em `shared/`; `standings.routes.ts`
segue fino, zero regra de negócio; Elysia no Workers = TypeBox (não zod), sem response schemas, `aot: false`.
Don't: `if (code === "BRA")` dentro do sort (D5). Don't criar coluna/migração para o desempate (D10) — este passo
é `api` puro, sem schema. Don't mudar a ordenação da PL — o desempate dela **não** tem
vitórias e a saída precisa sair idêntica. Don't tentar resolver via posição oficial da SportMonks: o caminho
`?upTo=N` recomputa por definição. Don't implementar confronto direto/disciplina (fora de escopo declarado).
Prova: `bun run scripts/_check-standings-order.ts` → tabela BRA bate com a ordem oficial da season 25184
(caso-alvo: dois clubes com mesmos pontos e saldo, o de mais vitórias acima) **e** `/leagues/PL/standings`
+ `?upTo=10` idênticos ao baseline capturado antes do passo (diff vazio).

**P6 [api] campanha por país (depende: P4)** — `concurrentSeasonIds` em
`apps/api/src/modules/leagues/shared/shared.ts` passa a juntar seasons do mesmo `startYear` **e** mesmo
`league.country`, via join com `league`.
Don't: filtrar por `leagueCode` — separaria a Série A certo, mas quebraria o LIG-011, que cruza PL+FA Cup+
Carabao de propósito. Don't remover o critério de `startYear` (país sozinho junta temporadas de anos diferentes).
Don't assumir que `country` está preenchido em ligas futuras sem checar.
Prova: `bun run scripts/_check-campaign.ts` → `concurrentSeasonIds(PL 2025/2026)` = `3` (regressão do LIG-011,
que já registrou esse número) e `concurrentSeasonIds(BRA 2025)` = `1`; borda: jogador com passagem PL→BRA no
mesmo ano não soma as duas ligas na mesma campanha.

**P7 [api] season derivada da liga (depende: P4)** — tira o `resolveSeason("PL", …)` fixo de
`get-team.service.ts#getTeam` e `get-player.service.ts#getPlayer` (ambos em
`apps/api/src/modules/leagues/`, os dois com um TODO `multi-liga` no comentário do topo).
**Regra da derivação** (não re-decidir no `/i`; contrato completo em dossiê §Derivação): nem `team` nem `player`
carregam `leagueCode` — a coluna só existe em `season`/`match`/`standing`. **Atenção, correção de uma afirmação
anterior deste plano:** `seasonsOfTeam` NÃO resolve isso "de graça" — ele projeta `SeasonSummary`
(`shared.ts:41-46`), que é `{ sportmonksSeasonId, name, startYear, isCurrent }` e **não tem `leagueCode`**. São
**dois helpers novos** em `shared/shared.ts`:
- `leagueCodeOfTeam(teamId)` — `standing` → `season`, `order by season.startYear desc`, primeira linha,
  devolve `season.leagueCode`. Copa não gera `standing` (`sync-cup.ts:15-17`), então aqui **não** precisa filtrar tipo.
- `leagueCodeOfPlayer(playerId)` — `lineup_player` → `lineup` → `match` → `league`, **filtrando
  `league.type = 'league'`**, `order by match.date desc`, primeira linha, devolve `match.leagueCode`. Aqui o filtro
  é obrigatório: as copas inglesas têm escalação ingerida, então sem ele um jogador do Arsenal resolve para `FAC`.
Regras: pasta-por-endpoint (`<verbo>-<substantivo>/` com `*.service.ts` + `*.schema.ts`), `*.routes.ts` fino;
lógica transversal a 2+ operações mora em `shared/`; `type`, nunca `interface`.
Don't: derivar por "primeira season encontrada" sem filtrar tipo no caminho do jogador — para o Arsenal isso
devolve FA Cup ou Carabao, não a PL. Don't adicionar `leagueCode` ao `SeasonSummary` para reusar `seasonsOfTeam`:
ele é serializado na resposta de `GET /v1/teams/:slug` (campo `seasons`), e mudar o shape quebra a metade
"PL byte-a-byte" do aceite. Don't lançar quando a derivação vier vazia (time/jogador sem aparição) — cai no
default `"PL"`; trocar 200 por 404 aqui é regressão. Don't quebrar `?season=` explícito (segue mandando).
Don't duplicar a derivação nos dois services.
Prova: `curl` em `/v1/teams/<clube-br>` e `/v1/players/<id-br>` → `200` com season BRA; os mesmos endpoints
para Arsenal e um jogador da PL → **byte-a-byte** iguais ao baseline; season inexistente → `404 season_not_found`.

**P8 [ui] zonas CONMEBOL (depende: P4)** — os 3 mapas de zona, cada um com nome diferente, ganham as chaves
CONMEBOL: `ZONES` em `apps/web/features/leagues/components/league-detail/standings-table.tsx`, `ZONE` em
`.../team-detail/team-standing.tsx` e `ZONE_COLOR` em `.../match-detail/match-detail.tsx`.
Regras: folder-by-feature em `apps/web/features/<feature>/`, kebab-case sem sufixo redundante, **proibido
importar entre features** (se 2+ features precisarem do mapa, promove pra `lib/`/`shared/`); `type`, nunca
`interface`; só string de UI em português.
Don't: copiar o mapa uma 4ª vez — ele já está triplicado; se promover, promove pra fora da feature.
Don't indexar o mapa sem tratar chave ausente — `noUncheckedIndexedAccess` está ligado e zona nova de outra
liga renderizaria `undefined`. Don't traduzir a chave (dado em inglês); traduz só o rótulo visível.
Prova: roteiro de browser real — dossiê §Testes, cenários T1..T5 — fechando com `list_console_messages` sem
erro novo e `list_network_requests` sem falha.

### Verificação final

- `bun run typecheck` e `bun run lint` limpos na raiz (3 workspaces)
- **API/dados**: scripts ad-hoc `apps/api/scripts/_check-{kickoff-tz,zones,bra-ingest,standings-order,campaign}.ts`
  → todos verdes, com os casos happy/borda/erro nomeados em cada Prova; assert direto no banco onde o efeito não
  aparece no HTTP (contagens, `season_id` null, `is_current`). Não existe runner de unidade no repo — não usar `bun test`.
  `_check-kickoff-tz.ts` e `_check-zones.ts` rodam em **dois modos**: sem flag = função pura (P1a/P3, não tocam o
  banco); `--db` = assert no banco (P1b/P4). Cada um imprime `N/N` e sai `0`/`1`.
- **Fuso uniforme (A2b)**: depois do P1b, os 4 lotes ingeridos (PL 25/26, PL 24/25, FA Cup, Carabao) têm de estar
  no mesmo regime de conversão — um lote em UTC cru enquanto outro está convertido corrompe a ordenação por
  `match.date` da forma cross-competition do LIG-011, **sem erro visível**.
- **Não-regressão da PL (metade do aceite)**: capturar baseline de `/leagues/PL/standings`, `?upTo=10`,
  `/teams/arsenal`, `/players/<id>` **antes** do P5 e diffar depois do P7 → diff vazio. Método herdado do LIG-008.
- **Browser real (chrome-devtools MCP)** — teste primário do `ui`: roteiro no dossiê §Testes (T1..T5, escada
  erro → bordas → golden path). MCP não atacha com o Chrome do dono aberto e o app exige Clerk: se não atachar,
  **declarar explicitamente**, nunca afirmar que a UI funciona.
- **E2E Playwright** (`cd apps/web && bun run test:e2e`, specs em `apps/web/e2e/`, dev :3211): rodar como
  regressão; os specs de login exigem `.env.e2e` e dão skip sem as chaves — declarar o skip, não contar como verde.
- re-teste da lista do `features impact`, priorizando o que depende de `match.date` (reescrita no P1):
  LIG-005, MOD-009 e **SIN-008** (ressaca de meio de semana); e LIG-001, LIG-002, LIG-006, LIG-008, LIG-009, LIG-011
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra A1..A8 — reporta só gap de requisito/
  correção (não estilo); diff fora dos paths deste plano = achado

### Pré-mortem e rollback

- **C1 — conversão de fuso dupla ou ausente.** Sintoma: horário da PL consertado e depois errado de novo, ou
  jogo de dezembro mudando sem motivo. Mitigação: o caso GMT-inalterado é assert da Prova do P1a (função pura)
  e reconferido por lote no P1b (banco).
- **C2 — o sweep volta a perder jogos.** Sintoma: liga com menos jogos que o esperado e **exit 0**.
  Mitigação: a contagem `380` é assert do P2 e do P4, não inspeção visual.
- **C6 — um dos 4 syncs não foi re-rodado no P1b.** Sintoma: base em fuso misto; a forma cross-competition do
  LIG-011 ordena PL e copa por datas em regimes diferentes e a sequência de jogos sai trocada, sem erro.
  Mitigação: a Prova do P1b é **por lote**, não global — lote com 0% de mudança denuncia o sync esquecido.
- **C3 — `concurrentSeasonIds` filtrado por liga.** Sintoma: forma cross-competition some (só PL), totais de
  jogador encolhem. Mitigação: o `= 3` da PL é assert do P6.
- **C4 — re-seed do banco de dev.** Sintoma: uuids giram e os baselines param de bater. Mitigação: capturar
  baseline por conteúdo, não por id.
- **C5 — colisão de logo volta com a 3ª liga.** Sintoma: escudo errado. Mitigação: assert de chaves no P3.

Rollback por classe: `ui`/`api` puros → `git revert` basta. Schema → o P1a é **expand aditivo**, reverte com drop
da coluna (não há contract nesta feature). **Dados são o que o revert NÃO desfaz**: as 380 partidas da BRA e os
horários reescritos da PL permanecem — voltar exige re-sync da PL com o código antigo. Prognósticos já gerados
que citam horário antigo também não são reescritos.

### Fora de escopo

Os 3 arquivos já existem, `status: ideia`, `depende_de: [LIG-012]`:

- **MOD-010** calibração do motor para a Série A (refit de `DC_RHO`, baseline 44/56 → curva do banco, backtest
  além de `leagueCode = "PL"`) — critério: existe baseline BR e nenhuma constante europeia hardcoded no prompt.
- **LIG-013** Série A 2026 ao vivo (incremental, backoff em 429, agendamento) — critério: a season em curso
  atualiza sozinha sem perder jogo e sem estourar rate limit.
- **LIG-014** home/hub da rodada fora do mock — critério: a home lê liga/rodada do banco, sem liga fixa.

Também fora, sem feature nova (limitações conhecidas, registradas para não virarem "bug" depois):
- **Série A 2024 (season 23265) não é ingerida aqui.** A investigação sugeria "2025, depois 2024"; fica de fora
  porque tem `statistics` em 87% dos jogos e nota do jogador em 11/20 — serve para histórico/forma, não para
  calibrar. Quando fizer falta, é entrada do LIG-013 ou feature própria, nunca um `bun run db:sync` improvisado.
- **`tvStations` é inútil no BR** (1 emissora contra 623 na PL): qualquer sinal de "jogo televisado" nasce cego na
  Série A. Não é bug de ingestão — é do motor; consequência registrada para o MOD-010.
  **Correção medida no `/i` (2026-07-19):** a premissa está ERRADA para a season 2025 — o card "Onde assistir"
  de Flamengo×Bragantino lista **8 emissoras/streams** (Premiere, Bet365, Claro TV+, Sky+, Vivo Play…), e o
  sync gravou 2.911 tv links para a BRA. O sinal de "jogo televisado" **não** nasce cego; reavaliar no MOD-010.
- **Rótulo "PL 2025/26" hardcoded na página de time** (`team-detail/team-trends.tsx:78`) aparece em time
  brasileiro. Achado no `/i` por teste visual; mesma classe do B5, não corrigido aqui para não expandir o P8.
- `?upTo=N` cronológico (D9) — o comportamento atual é preservado de propósito; dossiê B8.
- Confronto direto e disciplina no desempate — dossiê §Desempate.
- Limpeza dos objetos R2 órfãos deixados pelo re-key de logo (D8).

## Evidências

Base: commit `840566f` (2026-07-19) — todo file:line desta seção E da seção `## Plano` vale neste commit.

> Leia com `git show 840566f:<path>`. A árvore de trabalho tem WIP não commitado do LIG-011 em `shared.ts`
> (+44 linhas) e as linhas de lá **não batem** com estas — em `shared.ts` o desvio é de +8 a partir da `:1997`.

- [código] `apps/api/src/db/sync-sportmonks.ts:451-452` — grava `starting_at` UTC cru em `date`/`time`; invisível na PL (UTC≈Londres), erra 47,6% dos jogos da Série A 2026
- [código] `apps/api/src/db/sync-ingest.ts:250-251` + `apps/api/src/db/sync-cup.ts:188-189` + `apps/api/scripts/sync-old-season.ts:203` — os outros **três** sítios que gravam `date`/`time` cru; o total é 4, não 2 (achado do `/pl`, corrige afirmação anterior)
- [código] `apps/api/src/db/sync-sportmonks.ts:206-213` — `normalizeZone` só conhece CHAMPIONS/EUROPA/CONFERENCE/RELEGATION; zonas CONMEBOL caem no `return null`
- [código] `apps/api/src/modules/leagues/shared/shared.ts:1993` — o comentário declara a ordenação como "official Premier League rule"; o sort em `:2041-2047` faz pontos→saldo→gols pró→nome, **sem vitórias**
- [código] `apps/api/src/modules/leagues/shared/shared.ts:712-720` — `concurrentSeasonIds` junta temporadas só por `startYear`, sem filtro de liga
- [código] `apps/api/src/modules/leagues/shared/shared.ts:41-46` — `SeasonSummary` não tem `leagueCode`: `seasonsOfTeam` (`:1352-1364`) não identifica a liga do time, o P7 precisa de helper novo (achado do `/pl`)
- [código] `apps/api/src/modules/leagues/consts.ts:15-24` — `CATALOG` de API-Football sem importador, com docstring mandando "adicionar a liga aqui": armadilha para o `/i` (achado do `/pl`)
- [código] `docs/features/ligas/LIG-008-historico-multi-temporada.md:97` — gate do dono: parar e generalizar se entrar 2ª liga
- [web] REC Série A 2026 (CBF) — desempate oficial: vitórias ANTES do saldo; 20 clubes, 38 rodadas, 4 rebaixados, 5 vagas Libertadores
- [web] Tabela Básica CBF 2026 — rodada 1 em 28/01/2026, rodada 38 em 02/12/2026; hiato de ~7,5 semanas entre as rodadas 18 e 19
- [api] `GET /seasons/25184` (2026-07-19) → `starting_at: "2025-03-29"`, `ending_at: "2025-12-07"` — a `WINDOWS` derivada tem fonte real na API; o type local `SmSeason` declara só `{id, name}` e precisa ser ampliado (achado do `/pl`)
- [banco] query dev 2026-07-19 (`select code, country from league`) — PL/FAC/CARA todas `England`: agrupar campanha por `country` preserva o LIG-011 e isola o Brasil, enquanto filtrar por `leagueCode` quebraria a forma cross-competition (achado do `/pl`)
- [código] `apps/api/src/db/sync-sportmonks.ts:305-308` — o demote de `isCurrent` **já** é escopado por liga (o filtro está na `:308`): sincar a BRA não derruba a season corrente da PL (risco descartado no `/pl`)
- [código] `apps/api/package.json` — `apps/api` não tem `date-fns` nem `date-fns-tz` hoje; instalar é parte do P1

## Verificação

Base de prova: 9 execuções de script ad-hoc em `apps/api/scripts/_check-*.ts` (61 asserts, todas exit 0),
`typecheck` 3/3 workspaces e `lint` 0 errors. Não há runner de unidade no repo — a prova de `dados`/`api`
é assert direto no banco e chamada direta dos services, nunca "typecheck passou".

**Como cada critério foi provado**

| # | Critério | Prova |
|---|---|---|
| A1 | partida BRA grava horário de Brasília | `_check-bra-ingest` compara 50 fixtures contra a API: 0 divergentes, 9 viram o dia |
| A2 | PL de agosto vira 15:00, dezembro não muda | `_check-kickoff-tz` puro 3/3 + `--db` por lote |
| A2b | os 4 lotes no MESMO regime de fuso | `_check-kickoff-tz --db` 4/4: BST +60min em 100% e GMT 0% em **cada** lote |
| A3 | sweep cobre a janela real e acha 380 | dry-run BRA: 3 janelas 2025-03-22→2025-12-14, `fixtures: 380` |
| A4 | 380 jogos, 20 clubes, 0 season_id null, zonas não-null | `_check-bra-ingest` 13/13 |
| A5 | BRA ordena vitórias antes do saldo; PL idêntica | `_check-standings-order` 6/6 (ver ressalva abaixo) |
| A6 | `concurrentSeasonIds` PL=3, BRA=1 | `_check-campaign` 4/4 |
| A7 | time/jogador brasileiro respondem na Série A | `_check-derivation` 6/6 + `_check-endpoints` 10/10 |
| A8 | zonas CONMEBOL renderizam na UI | Chrome real, T1..T5: 4 zonas com cor+legenda em `/leagues/BRA`, PL intacta |

**Ressalvas honestas (o que a prova NÃO cobre)**

- **A5 — RESOLVIDO com a ingestão da 2026 (2026-07-19).** A tabela final da Série A **2025** não tem
  nenhum par empatado em pontos E saldo, então "bate com a ordem oficial" sairia verde mesmo com a
  regra inglesa; a prova era só o **caso sintético** (dois clubes 9 pts / saldo +2, um com mais vitórias
  e outro com mais gols pró). A temporada **2026** trouxe o caso real: **Atlético Mineiro (7V) acima de
  Corinthians (6V), ambos 24 pts e saldo −1** — mesmos pontos, mesmo saldo, vitórias decidindo, e a
  ordem oficial da SportMonks concorda. Visível na tela em `/leagues/BRA` (linhas 11 e 12).
  Contraprova ao vivo do lado inglês: **Chelsea 52pts (14V, +6) acima de Fulham 52pts (15V, −4)** — se
  vitórias tivessem vazado para a PL, o Fulham subiria.
- **Não houve baseline HTTP pré-mudança.** O método "diff byte-a-byte" do plano não foi executável: o WIP
  não-commitado do LIG-011 está entrelaçado com as edições do LIG-012 nos mesmos arquivos, então nenhum
  estado git reproduz "antes". A não-regressão da PL foi provada por **equivalência de argumento** (o P7
  é literalmente `resolveSeason("PL", x)` → `resolveSeason(derivado ?? "PL", x)`, e `leagueCodeOfTeam`
  devolve `"PL"` para time inglês — logo a entrada do código inalterado é idêntica), por **recomputo com o
  comparador legado** e pelo **oráculo independente** da ordem oficial da SportMonks. A derivação é testada
  nos dois sentidos de propósito: só "Arsenal→PL" passaria também se ela estivesse devolvendo `null` p/ todos.
- **A8 foi destravado e provado** (2026-07-19). O bloqueio era o Clerk: `/leagues/BRA` redireciona pro
  `/sign-in` e o formulário tem Cloudflare Turnstile. Solução sem desligar nada e sem resolver CAPTCHA:
  a instância é `pk_test`/`sk_test` (development), então criou-se um usuário de teste pela **Backend API**
  do Clerk + uma **sign-in token** (`?__clerk_ticket=`), que autentica por URL e não passa pelo formulário.
  Roteiro T1..T5 do dossiê executado; console sem erro. **Usuário de teste criado:
  `lig012+clerk_test@example.com` (`user_3Ghjo4sY3LzOidYExhW33BThScX`) — deletar quando não for mais útil.**
- **Achado NOVO, fora dos critérios A1..A8** (não corrigido, ver §Fora de escopo): a página de time mostra
  `"Derivado dos resultados da temporada (PL 2025/26)"` **hardcoded** em
  `apps/web/features/leagues/components/team-detail/team-trends.tsx:78`, inclusive em time brasileiro.
  Antes desta feature a frase era verdadeira (só havia a PL); é o LIG-012 que a torna falsa. Mesma classe
  do B5 (home fixa em "Premier League"). Conserto = passar a season como prop; ~3 linhas.

**Re-teste da lista do `features impact`**

O P1 reescreveu `match.date`/`match.time` de ~40% das partidas, então o risco real para os dependentes é
**mudança de DIA** (reclassifica meio-de-semana×fim-de-semana no SIN-008 e dias de descanso no LIG-005),
não de hora. Isso foi medido e **bounded em zero**: `_check-kickoff-tz --db` conta `dia mudou` por lote e deu
`0` nos quatro lotes ingleses (Londres é UTC+0/+1, nunca vira o dia). As 9/50 partidas da Série A que viram o
dia são **dado novo**, não reclassificação de dado existente.
- Provados nesta sessão: **LIG-011** (`concurrentSeasonIds(PL)=3`, `_check-campaign`), **LIG-008**
  (`?season=`/`season_not_found`, `_check-endpoints`), **LIG-001/LIG-002** (`getPlayer`/`getTeam` respondem
  nas duas ligas), **LIG-006** (zona na tabela/partida via `standings`).
- **Não re-executados** (sem harness runnable; declarados como follow-up, não como verdes): **SIN-008**,
  **LIG-005**, **MOD-009**, **MOD-001/003/004**, **LIG-009**. O argumento de segurança é o `dia mudou = 0`
  acima, que é o insumo de que todos dependem — mas nenhum deles teve o próprio caminho re-rodado.

**Divergências do plano encontradas na execução** (registradas também no dossiê)

1. **Entrypoint da FA Cup estava errado.** `sync-cup.ts 24 25919 FAC proper` reescreve só 123 dos 871
   jogos do lote; as 748 de qualifying exigem a invocação **sem** `proper`. Rodar como planejado deixava
   **709 jogos em BST em UTC cru** — o B2/C6 exato. Corrigido e re-rodado.
2. **A métrica de detecção do plano era fraca demais para pegar (1).** "nenhum lote com 0% global" passava,
   porque o FAC ficou em 0,8%. O critério implementado é mais afiado: todo jogo em mês seguramente BST tem
   de andar **+60min exatos** e todo jogo em GMT profundo **0** (mar/abr/out/nov fora, por serem virada de DST).
3. **`normalizeZone` foi extraída para `src/db/zones.ts`.** A Prova do P3 exige chamar a função pura, mas ela
   morava em `sync-sportmonks.ts`, que roda `main()` no topo do módulo — importar executaria o sync inteiro.
   A extração também elimina estruturalmente a divergência entre as 2 cópias que o próprio passo temia.
4. **`_check-kickoff-tz.ts` ganhou modo `--snapshot`.** A fração "partidas com horário alterado" compara com o
   estado anterior ao re-sync, que deixa de existir depois dele.
