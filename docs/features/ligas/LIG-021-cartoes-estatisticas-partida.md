---
id: LIG-021
titulo: Cartões amarelos e vermelhos na aba Estatísticas da partida
modulo: ligas
status: verificado
prioridade: P2
facetas:
  api: feito
  ui: feito
testada: sim
testes:
  - "A1 api 2026-07-23: GET /v1/matches/3dc11ca2-…/statistics → home/away yellowCards=2 redCards=0 (oráculo corrigido vs plano 4/0; SELECT card = 2Y+2Y); posse+shotsInside/Outside preservados; UUID fake → 404"
  - "A2 api 2026-07-23: GET /v1/matches/8aeca44f-…/statistics → home yellowCards=4 redCards=2 (yellowred dual-count FIFA); away 3Y/1R"
  - "A3/A4 ui 2026-07-23: agent-browser skills get core + sessão Clerk — T1 /matches/premier-league-2024-2025-crystal-palace-vs-arsenal aba Estatísticas: CARTÕES AMARELOS 2|2 + VERMELHOS 0|0 (+ POSSE/CHUTES/REMATES); T2 Palace×Brighton CARTÕES AMARELOS 4|3 VERMELHOS 2|1; T3 NS brasileirao-2026-internacional-vs-flamengo 'Sem estatísticas para esta partida.'; network GET …/statistics 200; chrome-devtools MCP indisponível (prova via agent-browser)"
  - "typecheck 2026-07-23: bun run typecheck exit 0 (api+web+ui)"
depende_de: []
impacta: []
ancoras:
  settings: []
  tabelas: [card]
  tools: []
  funcoes:
    - "apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts#matchStatistics"
    - "apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats"
    - "apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics"
  rotas:
    - "GET /v1/matches/:id/statistics"
docs: []
verificado_em: 2026-07-23
atualizado: 2026-07-23
---

# Cartões amarelos e vermelhos na aba Estatísticas da partida

## Descrição

Na aba **Estatísticas** do match-detail, mostrar o placar disciplinar casa×fora: **cartões amarelos** e **cartões vermelhos** (expulsões = vermelho direto + segundo amarelo). Fecha o bloco disciplina junto com faltas (W-087). Fonte: tabela `card` já ingerida — zero schema/migração. Uma query agrega as duas linhas.

Origem: wishlist **W-089** (amarelos) + **W-090** (vermelhos), empacotadas de propósito (mesma query, gotcha `yellowred` compartilhado).

## Tarefas

- [x] P1 api — contar `yellowCards`/`redCards` por time a partir de `card` e expor em `TeamMatchStats` + `matchStatistics`
- [x] P2 ui — duas `StatRow` ("Cartões amarelos" / "Cartões vermelhos") + `hasStats` não abre o card só com 0/0

## Plano (2026-07-23)

Dossiê: n/a (plano-mini — ≤3 arquivos, zero schema, decisão de contagem já cravada na wishlist).

### Objetivo, aceite e non-goals

"Pronto" = `GET /v1/matches/:id/statistics` devolve `yellowCards` e `redCards` (`number`) por lado, e a aba Estatísticas mostra duas linhas com esses totais (0 honesto quando não houve cartão daquele tipo; "—" só se o campo for null — não é o caso deste plano).

Non-goals: ingestão/migração; types 83/84/85 de `match_team_stats`; mudar `loadMatchCards` / aba Eventos; booking points / mercado de cartões; faltas (W-087); alterar a contagem da página do jogador (lá `yellowred` só incrementa vermelho).

Aceite:
- A1 [api] payload tem `home|away.yellowCards` e `home|away.redCards` numéricos → coberto por P1
- A2 [api] `yellowred` entra nas **duas** contagens (FIFA súmula) → coberto por P1 (caso Palace×Brighton)
- A3 [ui] linhas "Cartões amarelos" e "Cartões vermelhos" visíveis com números; partida sem expulsão mostra **0** no vermelho (não "—") → coberto por P2
- A4 [ui] não-regressão: posse (e LIG-019/020 se já no branch) continua; partida NS sem stats ainda "Sem estatísticas…" → coberto por P2

### Premissas

- `card.type` ∈ `"yellow" | "red" | "yellowred"` (`CardItem` / schema) — já validado no banco (6719 rows; 95 yellowred).
- Todo jogo com pelo menos 1 `card` também tem `match_team_stats` ([banco] 2026-07-23: `cards_no_stats = 0`) → `hasStats` pode continuar ancorado em métricas nullable de `match_team_stats`; cartões com 0/0 não precisam abrir o card sozinhos.
- `loadMatchCards` já lista eventos; **não** reusar pro aggregate (join player desnecessário).

### Decisões

- D1: **`yellowred` conta em amarelo E vermelho** — driver: súmula FIFA / notas W-089+W-090; descartado: só vermelho (padrão da página do jogador em `shared.ts:1090-1091`) porque a aba Estatísticas é placar do jogo, não timeline de expulsão do atleta; pagamos: totais ≠ soma simples yellow+red das rows brutas.
- D2: campos `yellowCards` / `redCards` como `number` (COUNT, default 0) — driver: "sem expulsão → 0, não —"; descartado: `null` quando zero rows de `card` (confundiria jogo limpo FT com NS); pagamos: NS com 0/0 se `hasStats` errar — mitigado em P2 (não OR `!= null` nesses campos).
- D3: **W-089 + W-090 num único ID** — driver: uma query, gotcha compartilhado; descartado: LIG-021 só vermelhos + LIG-022 amarelos (padrão LIG-019/020) porque aqui a semântica acopla as duas linhas.
- Adiadas pro /i: ordem exata das StatRow vs posse/LIG-019 (sugestão: depois da posse; amarelos antes de vermelhos); copy exata se preferir "Amarelos"/"Vermelhos" sem "Cartões".

### Passos

**P1 [api]** — em `apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats`, adicionar `yellowCards: number` e `redCards: number` (comentário: derivados de `card`, não de `match_team_stats`). Em `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts#matchStatistics`: o select de `matchTeamStats` **já** traz posse + `shotsInsidebox`/`shotsOutsidebox` (LIG-019/020) — **preserve**; acrescente um segundo `select` de `card.teamId` + `card.type` com `where eq(card.matchId, m.id)`; agregar por time — amarelo = `type IN ('yellow','yellowred')`, vermelho = `type IN ('red','yellowred')`; no `side()` preencher os dois campos com o count do time (0 se ausente). Atualizar `detail.summary` em `matches.routes.ts` se ainda omitir cartões. Regras: pasta-por-endpoint já existe (`get-statistics/`); routes fino; `type`, nunca `interface`; campos em inglês. Don't: **não** altere `loadMatchCards` nem o contador da página do jogador (`yellow` só / `red|yellowred`); **não** invente coluna em `match_team_stats` nem types 83–85; **não** trate ausência de rows como `null` neste passo (use 0); **não** some `lineup_player`; **não** remova os campos LIG-019/020 do tipo/select. Prova: com API de pé — (1) `GET /v1/matches/3dc11ca2-5593-4997-9be8-44f3cc8643e4/statistics` → `home.yellowCards=2`, `home.redCards=0`, `away.yellowCards=2`, `away.redCards=0` (**oráculo corrigido 2026-07-23 no /i**: wishlist/plano citavam 4/0×4/0, mas `SELECT` em `card` tem exatamente 4 rows yellow — 2 home + 2 away; API bate o banco); (2) `GET /v1/matches/8aeca44f-0745-4e6c-9b6c-d5046435c67a/statistics` → `home.yellowCards=4`, `home.redCards=2` (inclui 2 yellowred no amarelo e no vermelho); `bun run typecheck` exit 0. **Prova fechada 2026-07-23:** (1) OK 2/0×2/0 + posse/shots preservados; (2) OK 4/2 home; 404 id inexistente; typecheck exit 0.

**P2 [ui] (depende: P1)** — em `apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics`: o arquivo **já** tem posse + "Chutes na área" + "Remates fora da área" e `hasStats` OR nesses três — **preserve**. Acrescente duas `<StatRow>` depois delas — labels **"Cartões amarelos"** e **"Cartões vermelhos"** (`home`/`away` = `data.*.yellowCards` / `redCards`, sem `suffix`). **Não** faça `hasStats` com `yellowCards != null` / `redCards != null` (sempre number → abriria NS). Opcional defensivo: `|| yellowCards+redCards > 0` em qualquer lado (cobre cards-sem-stats futuro; hoje 0 ocorrências). Regras: folder-by-feature; tipos via `@workspace/api`; string de UI em português; `type` nos props. Don't: **não** recrie `StatRow`; **não** mostre "—" no lugar de 0; **não** importe de outra feature; **não** apague as StatRows de LIG-019/020. Prova: agent-browser (chrome-devtools MCP indisponível) — abrir `/matches/premier-league-2024-2025-crystal-palace-vs-arsenal` → aba Estatísticas → snapshot com "Cartões amarelos" 2|2 e "Cartões vermelhos" 0|0; abrir Palace×Brighton → vermelhos home=2; NS Inter×Fla → "Sem estatísticas…"; `network requests` GET `/statistics` 200. **Prova fechada 2026-07-23.**

### Verificação final

- `bun run typecheck` limpo (raiz) — **OK 2026-07-23**
- **API/dados:** `fetch` contra dev server → casos: (happy) Palace×Arsenal 2/0 × 2/0; (borda yellowred) Palace×Brighton home 4Y/2R; (borda) match NS / sem `match_team_stats` → UI empty state, payload ainda 0/0; (erro) id inexistente → 404. Sem runner de unidade. **OK**
- **Browser real:** chrome-devtools MCP **indisponível** nesta sessão — prova via **agent-browser** (sessão Clerk). T1 Arsenal/Palace — amarelos 2-2, vermelhos 0-0; T2 Palace/Brighton — vermelhos home=2; T3 Inter×Fla NS → "Sem estatísticas…"; network GET `/statistics` 200. **OK (declarado)**
- **E2E Playwright:** n/a (duas StatRow; browser basta).
- re-teste: posse intacta; callers de `matchStatistics` = só `matches.routes.ts`; não-regressão aba Eventos (`loadMatchCards` intocado). **OK**
- último: subagent em contexto fresco revisa o diff contra A1..A4.

### Pré-mortem e rollback

- C1: `hasStats` usa `yellowCards != null` → toda partida NS ganha card vazio com 0/0 — mitigação: Don't do P2 + critério A4.
- C2: `/i` copia a regra do jogador (`yellowred` só vermelho) → amarelos subcontam — mitigação: D1 + prova P1 caso Brighton.
- C3: alguém grava types 83/85 em `match_team_stats` e abandona `card` → divergência de fonte — mitigação: Don't do P1; inventário já marca 84 como redundante.
- Rollback: `git revert` (api/ui pura; sem schema).

### Fora de escopo

- W-087 faltas na aba → wishlist (possível `TEAM_STAT` 56 ou soma `lineup_player.fouls`)
- W-082..W-088 / W-091 / W-094 demais métricas da aba → wishlist / LIG-019/020
- Contagem de cartões na página do jogador (LIG-001 P6) → não mudar a regra `yellow` vs `red|yellowred`

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:594-610` — `card.type` = yellow | red | yellowred; `matchId`+`teamId`
- [código] `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts` — `matchStatistics` agrega `card` (LIG-021) + posse/shots (LIG-019/020)
- [código] `apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats` — `yellowCards`/`redCards` number (COUNT, default 0)
- [código] `apps/api/src/modules/leagues/shared/shared.ts` — na página do jogador `yellowred` só incrementa vermelho (contraste com D1; intocado)
- [código] `apps/web/features/leagues/components/match-detail/statistics.tsx` — StatRows cartões após LIG-019/020; `hasStats` sem `!= null` em cartões (opcional `sum>0`)
- [banco] 2026-07-23 — amostra `3dc11ca2-…` = 2Y/0R × 2Y/0R; `8aeca44f-…` yellowred dual (home 4Y/2R)
- [wishlist] W-089 + W-090 (2026-07-23) — brief + gotcha yellowred + empacotar no mesmo PR
- [ui] dumps agent-browser em `apps/api/scripts/output/lig021-ui/` (snapshots/eval/network)

## Verificação

- **API (2026-07-23):** `curl localhost:3001` — Palace×Arsenal `2/0×2/0` + posse 42 + shots 10/5; Palace×Brighton `home 4Y/2R` away `3Y/1R`; NS Inter×Fla payload `0/0` com posse/shots null; UUID fake → 404; typecheck exit 0.
- **UI (2026-07-23):** agent-browser após `skills get core` (chrome-devtools MCP ausente) — T1 Palace×Arsenal snapshot: CARTÕES AMARELOS 2|2 + VERMELHOS 0|0 + POSSE/CHUTES/REMATES; T2 Palace×Brighton AMARELOS 4|3 VERMELHOS 2|1; T3 Inter×Fla NS "Sem estatísticas para esta partida."; `network requests` GET `/statistics` 200.
- **Oráculo:** plano/wishlist citavam Palace×Arsenal 4|4; banco+API+UI concordam em **2|2** (4 rows yellow). Dual-count yellowred validado em Brighton.
- **Revisor fresco:** A1–A4 OK — nenhum gap. Spill (WIP paralelo, fora do LIG-021): `matches.routes.ts` `GET /:id/news` + `types/index.ts` MatchNews*.
