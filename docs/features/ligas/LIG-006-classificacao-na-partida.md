---
id: LIG-006
titulo: Snapshot da classificação na página da partida
modulo: ligas
status: em-andamento
prioridade: P2
facetas:
  api: feito
  ui: em-andamento
testada: parcial
testes:
  - "api: GET /v1/matches/:id → standings.home/away (TeamStanding real) via curl numa instância one-off :3009 — Liverpool 5º/60pts/+10/champions, Bournemouth 6º/57pts/+4/europa (2026-06-29)"
  - "typecheck 3/3 FULL TURBO (api+web re-inferidos com o standings novo)"
  - "revisor em contexto fresco (Agent): nenhum gap — A1+A2 ok, só os 2 arquivos do escopo tocados"
  - "ui: typecheck + preview estático fiel; golden path no Chrome PENDENTE (chrome-devtools não anexa + api da sessão serve código velho que esconde o card) → verificação visual ao vivo após reiniciar a api"
depende_de: []
impacta: []
ancoras:
  settings: []
  tabelas: [standing]
  tools: []
  funcoes: [getMatch, loadTeamStanding]
  rotas: ["GET /v1/matches/:id"]
docs: []
verificado_em: null
atualizado: 2026-06-29
---

# Snapshot da classificação na página da partida

## Descrição

Na aba **Fatos** da página da partida, um card com a posição na tabela de mandante e visitante lado a lado — posição, pontos, saldo de gols e V-E-D de cada um na season. Dá ao apostador o enquadramento de força/momento dos dois (favoritismo, pressão por zona) antes dos outros números, ancorando a leitura de 1X2 e over/under. Irmão dos cards de estádio (LIG-004) e descanso (LIG-005) que já vivem na aba Fatos. Promovida da wishlist W-027.

## Tarefas

- [x] P1 api — `getMatch` devolve `standings: { home, away }` via `loadTeamStanding` (×2)
- [x] P2 ui — card compacto de classificação lado-a-lado na aba Fatos do `match-detail.tsx`

## Plano (2026-06-29)

Plano-mini (2 arquivos, zero schema, decisão técnica já cravada — sem dossiê, proporcionalidade do `/pl`).

### Objetivo, aceite e non-goals

"Pronto" = na aba **Fatos** da página da partida, a classificação oficial dos dois times aparece lado a lado (posição, pontos, V-E-D, saldo), reusando o `standing` já ingerido.
Non-goals: não recalcular standings (usa o `standing` oficial via `loadTeamStanding`, não o `computeStandings`); não reusar o card verboso do team-page (`team-standing.tsx`); zona colorida é nice-to-have, não bloqueia; zero schema; não tocar outras abas.
Aceite:
- A1 [api] `GET /v1/matches/:id` devolve `standings.home` e `standings.away` (cada um `TeamStanding` ou null) → coberto por P1.
- A2 [ui] na aba Fatos vejo posição/pontos/V-E-D/saldo dos dois times lado a lado → coberto por P2.

### Passos

**P1 [api] esqueleto** — `apps/api/src/modules/leagues/get-match/get-match.service.ts`: `getMatch` passa a devolver `standings: { home, away }` chamando `loadTeamStanding(row.m.homeTeamId)` + `loadTeamStanding(row.m.awayTeamId)` (paralelizar num `Promise.all`, padrão de `get-team.service.ts:15`). `loadTeamStanding` (`shared/shared.ts:694`) e o tipo `TeamStanding` (`shared/shared.ts:54`) já existem — só compor no retorno (hoje `{ ...serializeMatch(row), league, goals, cards, rest }`). Prova: `curl -s localhost:3001/v1/matches/<MID> | jq -e '.standings.home.position|numbers'` → exit 0 (MID = qualquer partida da PL com standing).

**P2 [ui] (depende: P1)** — `apps/web/features/leagues/components/match-detail/match-detail.tsx`: **reler o arquivo primeiro (edição concorrente de outra sessão).** Novo componente local compacto (espelha o `RestSide`, `match-detail.tsx:28`, layout 2-colunas mandante/visitante) renderizado dentro do `TabsContent value="fatos"`, irmão dos cards de estádio (LIG-004) e descanso (LIG-005). Cada lado lê `match.standings.home/away` (tipo `TeamStanding`, já flui via Eden; o barrel web já exporta `TeamStanding`): posição (Nº), pontos, `V·E·D`, saldo (`+N`/`-N`); null → "—". Zona colorida opcional via mapa `ZONE` (`team-standing.tsx:6`). Prova: chrome-devtools → página de uma partida → aba Fatos → os dois blocos mostram Nº/pts/SG; **se o profile do chrome-devtools travar (ver memória [[chrome-devtools-profile-travado]]), cair pra verificação ao vivo com o João** + `bun run typecheck` limpo como rede.

### Verificação final

- `bun run typecheck` limpo (3/3).
- P1: `curl` do `/v1/matches/:id` mostra `standings.home`/`.away` populados (ou null tratado).
- Golden path Chrome: navegar a uma partida → aba **Fatos** → observar a classificação dos dois times lado a lado (fallback: verificação ao vivo do João se o chrome-devtools não anexar).
- Re-teste do consumidor: `getMatch` só alimenta `useMatchQuery` → a própria página da partida; conferir que estádio/descanso/eventos não regrediram.
- Último passo: subagent em contexto fresco revisa o diff contra A1/A2; diff fora de `get-match.service.ts` + `match-detail.tsx` = achado.

### Pré-mortem e rollback

- C1: `loadTeamStanding` devolve null (time sem linha em `standing`) → bloco vazio. Mitigação: tratar null no componente ("—"), já no P2.
- C2: edição concorrente do `match-detail.tsx` → clobber/conflito. Mitigação: reler o arquivo no início do P2 (já declarado).
Rollback: ui/api pura → `git revert` basta; nada persiste.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:694` — `loadTeamStanding(teamId)` já devolve o `TeamStanding` (position/points/W-D-L/goalsFor/goalsAgainst/zone + split casa/fora) da tabela `standing`; basta chamar p/ os dois times, sem migração.
- [código] `apps/api/src/modules/leagues/get-team/get-team.service.ts:15` — padrão de uso do `loadTeamStanding` (página do time) a copiar.
- [código] `apps/api/src/modules/leagues/get-match/get-match.service.ts:28` — `getMatch`, ponto de inserção do `standings: { home, away }` (já devolve `rest` no mesmo shape, do LIG-005).
- [código] `apps/web/features/leagues/components/match-detail/match-detail.tsx:28` — `RestSide` (LIG-005), molde de card lado-a-lado mandante/visitante na aba Fatos.
- [código] `apps/web/features/leagues/components/team-detail/team-standing.tsx` — render de um `TeamStanding`, UI a espelhar.

## Verificação

- **api (A1) — provado.** Instância one-off `PORT=3009 bun src/index.ts` (mesmo source) → `curl /v1/matches/<id>` devolve `standings.home`/`.away` como `TeamStanding` real: Liverpool 5º/60pts/SG+10/champions, AFC Bournemouth 6º/57pts/SG+4/europa. O servidor da sessão (:3001) não recarregou (`bun --watch` travado no Windows) — por isso a prova foi numa instância paralela, morta após o teste.
- **typecheck** `bun run typecheck` 3/3 (FULL TURBO; api+web re-inferidos com o `standings` novo). Diagnostics do language server deram falsos positivos (`TeamRest`/`venue` "não exportados") pela edição concorrente — o `tsc`, autoritativo, provou limpo.
- **revisor em contexto fresco** (Agent): nenhum gap — A1 e A2 implementados e corretos (`Promise.all` + spread no api; optional chaining + `?? null` + degradação "—" no ui), só os 2 arquivos do escopo tocados.
- **ui (A2) — golden path no Chrome PENDENTE.** O `chrome-devtools` não anexa (profile travado, [[chrome-devtools-profile-travado]]) E a api da sessão serve código velho (sem `standings`), então o gate esconde o card ao vivo. Prova substituta: preview `.html` estático fiel (classes/tokens/valores reais) + typecheck. Fecha quando reiniciar a api e olhar a aba Fatos ao vivo.
- **regressão** (re-teste do `features impact` → LIG-002, LIG-005): o diff não toca `RestSide` (LIG-005), `team-standing.tsx`/`get-team` (LIG-002) nem `loadTeamStanding` — só ADICIONA `standings` ao `getMatch`; typecheck + revisor confirmam zero vazamento.
