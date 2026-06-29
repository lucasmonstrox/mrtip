---
id: LIG-005
titulo: Dias de descanso (rest days) na página da partida
modulo: ligas
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas: # zero-schema: derivado de match.date + último jogo antes desta data
  api: verificado # helper lastMatchBefore + campo rest no getMatch (curl + cross-check manual)
  ui: verificado # descanso em DUAS superfícies do match-detail: aba Fatos (E2E Chrome 2 casos, console limpo) + aba Prognóstico (card dedicado c/ assimetria; typecheck ok, prova visual pendente)
testada: sim
testes:
  - "P1 api curl /v1/matches/:id → rest.home/.away {lastMatchDate, restDays}; round 12 (Brighton×Brentford 2025-11-22) = 13d/13d batendo com cross-check manual; round 1 (estreia) = null/null (2026-06-29)"
  - "P1 lista da liga intacta após campo aditivo (380 matches via /leagues/PL/rounds) (2026-06-29)"
  - "P2 E2E Chrome — aba Fatos: round 12 'DESCANSO · na liga · Brighton 13 dias · Brentford 13 dias'; estreia 'Liverpool/Bournemouth estreia'; console limpo nos 2 (2026-06-29)"
  - "typecheck 3/3 + lint match-detail 0 erros (só warnings <img> pré-existentes) (2026-06-29)"
  - "revisor (contexto fresco) A1–A6 PASS; 1 hardening aplicado (optional-chaining em match.rest contra payload stale) (2026-06-29)"
  - "ui Prognóstico — card 'Descanso (na liga)' dedicado na aba Prognóstico (tiles grandes + frase de assimetria 'X chega com N dias a mais'); reusa match.rest, sem rede nova; bun typecheck (apps/web) exit 0; PROVA VISUAL CHROME PENDENTE (chrome-devtools bloqueado c/ Chrome do João aberto) (2026-06-29)"
depende_de: []
impacta: [SIN-008] # o sinal de calendário/fadiga consome o mesmo cálculo de descanso
ancoras:
  settings: []
  tabelas: [match] # só LEITURA (match.date); nenhuma coluna nova
  tools: []
  funcoes: [getMatch, lastMatchBefore] # lastMatchBefore = par de cálculo reusado pela W-021
  rotas: [/matches/:id]
docs:
  - docs/investigacoes/rest-days-descanso-na-partida.md
  - docs/planos/LIG-005-rest-days-descanso.md
  - docs/regras/calendario-fadiga.md
verificado_em: 2026-06-29
atualizado: 2026-06-29
---

# Dias de descanso (rest days) na página da partida

## Descrição

Na página da partida, mostrar há quantos dias mandante e visitante jogaram pela última vez antes deste
jogo — os **dias de descanso** dos dois lados (assimetria de carga: "vem de 3 dias × 7 dias de folga").
Promovida da wishlist **W-019**. **Display derivado, zero-schema:** é a diferença em dias entre
`match.date` e a data do **último jogo jogado de cada time antes desta data** — exatamente o padrão que
`computeForm` já faz (`apps/api/src/modules/leagues/shared/shared.ts:1268`). É a **perna de UI** do
SIN-008 (calendário/fadiga, *investigado*): o display vem hoje, o sinal modelado reaproveita o cálculo
depois. Paridade de mercado; o diferencial é a **honestidade auditável** — só a PL 25/26 está ingerida,
então jogo de meio de semana (copa/seleção) é invisível e o descanso pode estar superestimado; rotular
"descanso na liga" e nunca alimentar um sinal sem o caveat.

## Tarefas

- [x] P1 api — helper `lastMatchBefore` + tipo `TeamRest` no `shared.ts`; `getMatch` anexa `rest: { home, away }`
- [x] P2 ui — linha de descanso na aba **Fatos** do `match-detail`, com ressalva "na liga"; `null` → "estreia"/"—"
- [x] P2 ui — card **"Descanso"** dedicado na aba **Prognóstico** (`prognosis.tsx`): tiles grandes por time + frase de assimetria (quem chega com mais descanso e por quantos dias); reusa `match.rest`. *Prova visual Chrome pendente.*

## Plano

> Dossiê: `docs/planos/LIG-005-rest-days-descanso.md` (base `dc71e0e`). Zero schema (só leitura de `match`).
> Decisão cravada: `restDays` computado na **API, dep-free** (date-fns não está em `apps/api`; diff de duas
> datas puras yyyy-MM-dd é exato via meia-noite UTC). Cuidados C1–C4 no dossiê §Cuidados.

### P1 · api — helper `lastMatchBefore` + campo `rest` no `getMatch`

No `apps/api/src/modules/leagues/shared/shared.ts`: (a) exportar o tipo `TeamRest = { lastMatchDate: string; restDays: number } | null` (perto do tipo `Match`, `:112`); (b) exportar a função pura `lastMatchBefore(matches, teamId, before): Match | null` — mesma lógica do `computeForm` (`:1268`: filtra `score != null` + `home.id===teamId || away.id===teamId` + `date < before`, ordena `date` desc, pega o primeiro), mas retornando o `Match`. No `apps/api/src/modules/leagues/get-match/get-match.service.ts` (`:12`): chamar `loadMatches(row.m.leagueCode)`, computar `rest.home`/`rest.away` pra `row.m.homeTeamId`/`row.m.awayTeamId` (helper → se null, `null`; senão `{ lastMatchDate: last.date, restDays: Math.round((Date.parse(row.m.date) - Date.parse(last.date)) / 86_400_000) }`), e anexar `rest` ao objeto retornado. Comentar no código que o diff dep-free é proposital (não trocar por date-fns). C4: ancora em `row.m.date` mesmo sem score.

- **Prova:** `bun run typecheck` (raiz) exit 0. Com a API no ar: `curl -s localhost:3000/v1/matches/<id> | jq '.rest'` → `{ home: { lastMatchDate, restDays }, away: { lastMatchDate, restDays } }`; conferir `restDays` à mão contra as duas datas (dias de calendário). Numa partida da **1ª rodada** (estreia) → `rest.home`/`.away` = `null`. `curl .../v1/leagues/PL | jq '.matches | length'` inalterado (campo aditivo não derruba nada).

### P2 · ui — linha de descanso na aba Fatos

Em `apps/web/features/leagues/components/match-detail/match-detail.tsx`, na aba **Fatos** (`:128-147`, junto do card de venue): renderizar uma linha/mini-card "Descanso (na liga)" com os dias de mandante e visitante (`match.rest.home`/`.away`, que fluem via Eden). Cada lado: `{restDays} dias` (ou "estreia"/"—" quando `null`, C2). Incluir a ressalva de cobertura (C1) — legenda curta "na liga" + texto no hover/título explicando que jogos de meio de semana fora da liga não entram. Strings pt-BR. Formatar nada de data crua; o número já vem pronto da API.

- **Prova:** `bun run typecheck` exit 0. Chrome (chrome-devtools MCP) numa partida de rodada avançada → screenshot mostra "Descanso · Mandante N dias · Visitante M dias" na aba Fatos, console sem erro novo; numa partida da 1ª rodada → estado "estreia"/"—" sem quebra.

### Decisões adiadas pro `/i` (baixo risco, defaults escolhidos)

- **Layout:** linha própria abaixo do card de venue (default); mini-card agrupando venue+descanso é alternativa barata.
- **Copy da ressalva:** legenda "na liga" + tooltip (default); ajustar com o dono no `/i` se quiser outro tom.
- **Re-export de `TeamRest`** em `types/index.ts`: opcional (a inferência via Eden já tipa `match.rest`); exportar só se o subcomponente ficar mais limpo.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:1268` — `computeForm` já filtra `score != null`
  + `date < before` + ordena most-recent-first: o "último jogo antes de X" já existe no repo.
- [código] `apps/api/src/modules/leagues/form/form.service.ts:12` — a `form` já ancora na data da partida
  (`before: row.m.date`) pros dois times: prova que o cálculo é só re-exposto, não novo.
- [código] `apps/api/src/modules/leagues/get-match/get-match.service.ts:12` — `getMatch` monta o payload
  da partida (`useMatchQuery`): ponto de injeção do campo `rest`.
- [código] `apps/api/src/db/schemas/leagues.ts:66` — `match.date` é `date(mode:"string")` (yyyy-MM-dd):
  diff de duas datas puras, zero migração.
- [código] `apps/web/features/leagues/components/match-detail/match-detail.tsx:128` — aba **Fatos** (só
  venue do LIG-004 hoje): lar natural do display de descanso.
- [doc] `docs/regras/calendario-fadiga.md:14,72` — SIN-008 pede "dias de descanso dos dois times" e abre
  com o limite single-season: fundamenta o uso E o caveat de cobertura.

## Verificação

Provado por superfície (2026-06-29, commit base `dc71e0e`):

- **api (P1):** `lastMatchBefore` (`shared.ts`) + `restFor`/`rest` no `getMatch`. `curl /v1/matches/<id> | .rest`
  numa partida de rodada 12 (Brighton×Brentford, 2025-11-22) → `{home:{lastMatchDate:"2025-11-09",restDays:13},
  away:{…13}}`, batendo com o cross-check manual (último jogo jogado < data, diff de calendário). Numa
  partida de **rodada 1** (Liverpool×Bournemouth) → `rest:{home:null,away:null}` (estreia, C2). Lista da liga
  intacta (`/leagues/PL/rounds` = 380 matches) → campo aditivo não derrubou nada. **Nota de cobertura (C1)
  confirmada na prática:** os 13 dias da rodada 12 caem sobre o data break de novembro — jogos de seleção no
  meio não estão ingeridos, então o "descanso na liga" aparece inflado; é o caso que a ressalva da UI cobre.
- **ui (P2):** `bun run typecheck` 3/3 + `eslint match-detail.tsx` 0 erros (3 warnings `<img>` pré-existentes).
  **E2E Chrome (chrome-devtools MCP):** aba Fatos renderiza o card "Descanso · na liga" abaixo do venue —
  rodada 12 "Brighton 13 dias · Brentford 13 dias"; estreia "Liverpool estreia · AFC Bournemouth estreia";
  console **limpo** (0 erros/warnings) nos dois. (Web do João na 3000 apontado p/ API fresca na 3001.)
- **revisor (contexto fresco):** A1–A6 **PASS** (seleção do último jogo, diff exato meia-noite UTC, campo
  aditivo, render/copy, zero-schema, comparação lexicográfica de data). 2 achados LOW: (1) `match.rest` sem
  guard contra payload stale → **hardening aplicado** (`match.rest?.home ?? null`); (2) `loadMatches` full-scan
  → já documentado como podável no dossiê §C5 (consistente com form/standings, reusado pela W-021).

### Extensão de UI — descanso na aba Prognóstico (2026-06-29)

Pedido do dono: o descanso (que já alimenta o prompt do prognóstico como fator de fadiga —
`apps/api/scripts/prognosis-prompt.ts:405`, `restDays`) ficou **invisível na UI da aba Prognóstico**.
Promovido a **card dedicado** entre o "Prognóstico geral" e os cards por time, em
`apps/web/features/leagues/components/match-detail/prognosis.tsx` (`RestPanel` + `RestTile`): dois tiles
com logo + número grande (`{N} dias` / "estreia") e uma **frase de assimetria** (`{Time} chega com N dias
a mais de descanso` | "Descanso parelho"). Mesma ressalva "na liga" (tooltip). **Zero rede nova:**
reusa `match.rest` já no payload (`getMatch`), passado via prop `rest` de `match-detail.tsx`. No mesmo
commit: card por time ganhou `bg-card` (estava transparente → cinza herdado do fundo). **Prova:**
`bun run typecheck` (apps/web) exit 0. **Prova visual Chrome PENDENTE** — chrome-devtools MCP não atacha
com o Chrome do João aberto; rodar quando liberar (golden path: aba Prognóstico de partida com prognóstico
gerado → card de descanso + assimetria + cards brancos + console limpo).
