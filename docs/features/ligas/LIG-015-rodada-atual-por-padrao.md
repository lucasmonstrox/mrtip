---
id: LIG-015
titulo: Rodada atual por padrão na aba Rodadas (com a escolha do usuário preservada)
modulo: ligas
status: em-andamento
prioridade: P2
facetas:
  ui: em-andamento
testada: parcial
testes:
  - "Script da regra pura: apps/web/scripts/check-current-round.ts — 7/7 ok (2026-07-19), inclui o discriminador do jogo adiado e a não-regressão de season encerrada"
  - "typecheck (raiz) exit 0 + lint 0 erros (2026-07-19)"
  - "E2E apps/web/e2e/rounds-tab.spec.ts (T2/T3): ESCRITA e coletada por --list, NUNCA EXECUTADA — bloqueada por falta de .env.e2e (ver §Divergência 2026-07-19)"
depende_de: []
impacta: [LIG-008, LIG-014]
ancoras:
  settings: []
  tabelas: []
  tools: []
  funcoes:
    - "apps/web/features/leagues/utils/rounds.ts#pickCurrentRound"
    - "apps/web/features/leagues/hooks/ui/use-round-param.ts#useRoundParam"
    - "apps/web/features/leagues/hooks/ui/use-season-param.ts#useSeasonParam"
  rotas: []
docs: [docs/planos/LIG-015-rodada-atual-por-padrao.md]
verificado_em: null
atualizado: 2026-07-19
---

# Rodada atual por padrão na aba Rodadas (com a escolha do usuário preservada)

## Descrição

A aba **Rodadas** da página da liga abre na **última rodada da temporada** em vez da rodada em curso — numa liga no meio da season (Série A 2026) o usuário cai na rodada 38, vazia, e tem que caçar a atual no select toda vez. Esta feature troca o default pela **rodada atual** (a rodada em curso; se ela já terminou, a próxima) e passa a **preservar a escolha do usuário** quando ele mexe no select: sair pra outra aba e voltar, ou dar refresh, mantém a rodada onde ele deixou. Primeiro load sem escolha = rodada atual; depois de escolher, manda a escolha.

## Tarefas

- [x] P1 ui — `pickCurrentRound` (função pura, regra por data) virando o default do `RoundsList`
- [ ] P2 ui — `useRoundParam` (`?round=N`) substituindo o `useState` que morre na troca de aba — **código pronto, prova bloqueada** (T2/T3 exigem browser autenticado; ver §Divergência 2026-07-19)
- [ ] P3 ui — trocar de temporada limpa o `?round=` pendente — **código pronto, prova bloqueada** (T4, idem)

### Divergência 2026-07-19 (execução do `/i`)

**Premissa caída, corrigida inline na Verificação final**: o Plano afirmava que a página de liga é pública ("não há `middleware.ts` no `apps/web`"). É falso — o gate mora em `apps/web/proxy.ts` (rename do Next 16), e só `/sign-in|/sign-up` são públicas. Nenhuma premissa de *implementação* (as 4 do §Premissas) caiu: o código de P1/P2/P3 não é afetado por auth e está escrito, com typecheck e lint verdes.

**O que isso bloqueia**: as duas rotas de prova de UI do Plano assumiam acesso sem sessão e caíram juntas.
- chrome-devtools MCP: atacha, mas num Chrome limpo sem sessão → `/leagues` redireciona pra `/sign-in`. (O motivo é este, não o `chrome-devtools-profile-travado` da memória.)
- Playwright: `.env.e2e` não existe (sem usuário `+clerk_test`) → os testes dão skip. Além disso o `webServer` não sobe enquanto houver outro `next dev` do mesmo diretório rodando (Next 16 permite um só).

**Não feito de propósito**: criar usuário no Clerk do dono via Backend API, e afrouxar o `proxy.ts` pra tornar `/leagues` pública "só pra testar" — as duas são ações fora do escopo desta feature, uma delas mexendo em auth de produção.

**O que destrava** (qualquer uma): (a) `.env.e2e` com um usuário `+clerk_test` → `bun run test:e2e` fecha T2/T3; (b) autorização pra criar esse usuário via Backend API; (c) um Chrome logado que o MCP possa dirigir → roteiro T1..T5 completo.

## Plano (2026-07-19)

Dossiê: [docs/planos/LIG-015-rodada-atual-por-padrao.md](../../planos/LIG-015-rodada-atual-por-padrao.md)

### Objetivo, aceite e non-goals

"Pronto" = a aba Rodadas abre na rodada atual quando o usuário nunca escolheu, e obedece a escolha dele quando escolheu — sem tocar API, schema ou ingestão.

Non-goals: agrupar os jogos por data dentro da rodada (W-010, wishlist); servir a rodada corrente pela API (LIG-014); `is_current` vindo da SportMonks (exige entidade de rodada, hoje inexistente — D4); qualquer mudança no dropdown, na busca de time ou no layout do card.

Aceite (cada critério aponta a Prova que o cobre):
- A1 [ui] abrindo `/leagues/<code>` **sem query string** numa liga com season em curso → a aba Rodadas mostra a rodada em curso (ou a próxima, se a última já terminou), e a URL **não** ganha `?round=` sozinha → coberto por P1 (regra) + T5
- A2 [ui] escolhi a rodada X → fui pra aba Classificação → voltei pra Rodadas → **continua em X** → coberto por P2 / T2
- A3 [ui] com `?round=X` na URL, refresh → abre em X → coberto por P2 / T3
- A4 [ui] **não-regressão**: numa season encerrada (PL 25/26) o default continua sendo a **última** rodada → coberto por P1 (caso 2 do script) + T1
- A5 [ui] trocar de temporada no switcher → o `round` sai da URL e a lista abre na rodada atual daquela season → coberto por P3 / T4

### Premissas

Verificadas no mapeamento (commit `9ff0cf3`); se alguma cair durante o `/i`: PARAR e atualizar este Plano com a divergência datada.

- `RoundsList` tem **um único** consumidor: `league-detail.tsx:120`, dentro de `TabsContent value="rounds"` — o Radix desmonta a aba inativa, por isso estado local não sobrevive.
- `useLeagueRoundsQuery(code)` já traz **todas** as rodadas da season; o arg opcional `round` filtra UMA no servidor e **não** deve ser usado aqui.
- Cada `Match` tem `date` (`yyyy-MM-dd`) e `score: Score | null`; `groupByRound` devolve ordenado por número de rodada.
- `apps/web` tem `date-fns` e **não** tem `date-fns-tz` (`apps/web/package.json:28`).

### Decisões

- D1: **rodada atual = progressão do número de rodada** — maior rodada que já teve jogo (`dia <= hoje`); se ela ainda tem jogo pendente, é ela; se acabou, a próxima do array; nada jogado → primeira; sem próxima → última. Driver: é a única forma testada que sobrevive a **jogo adiado**; descartado: "primeira rodada com jogo sem placar" (o remarcado nunca tem placar → ressuscita a rodada velha) **e** "jogo mais próximo com `date >= hoje`" (o remarcado costuma cair num meio de semana **mais perto** que a próxima rodada → devolve a rodada velha do mesmo jeito — contraexemplo numérico no dossiê); pagamos: com um atrasado da rodada 18 pendente, a aba abre na 20 e o atrasado só aparece pelo select. Especificação em 5 passos: dossiê §Por que progressão de rodada.
- D2: **"hoje" = data local do browser** (`date-fns`), sem `date-fns-tz` — driver: `format.ts:21` já usa `new Date()` local nesta mesma pasta e `apps/web` não tem a dep; descartado: `formatInTimeZone(..., "America/Sao_Paulo")` porque é dependência nova pra um polimento de UI; pagamos: usuário fora do Brasil perto da meia-noite pode ver a rodada vizinha (recuperável no select em 1 clique). Escape hatch: a troca fica isolada num helper `today` de 1 linha.
- D3: no intervalo entre rodadas (a corrente acabou, a próxima não começou), mostra a que **vem**, não a recém-encerrada — driver: produto de aposta olha pra frente; mora **isolado no passo 5** da regra (o "avança pra próxima"), então inverter é apagar um branch, não redesenhar a função. Pergunta feita ao dono; ele respondeu "segue" (2026-07-19), então está decidido — não re-perguntar, mas vale confirmar quando ele vir rodando.
- D4: rodada corrente **computada no client**, não na API — driver: não existe entidade de rodada (`round` é coluna inteira em `match`), então `is_current` significaria schema + ingestão novos; deferido pra **LIG-014** ("api — servir a rodada corrente por liga"), que deve reusar esta regra.
- D5: persistência em **`?round=N`**, espelhando `?season=` — driver: é o único jeito de sobreviver ao desmonte do `TabsContent`, e ganha refresh + link compartilhável de brinde; descartado: içar o estado pro `LeagueDetail` (morre no refresh) e `forceMount` no `TabsContent` (mantém as 3 abas montadas por um problema de estado).
- Adiadas de propósito pro `/i` (não é esquecimento): nome exato do helper de "hoje"; se `rounds.ts` duplica as 4 linhas de normalização `string | Date` do `format.ts` ou as extrai (duplicar é aceitável — extrair mexe em 3 funções já verificadas).

### Passos

**P1 [ui] esqueleto — o default vira a rodada atual** — criar `apps/web/features/leagues/utils/rounds.ts` com `pickCurrentRound(rounds, today): number | null` **seguindo os 5 passos do dossiê §Por que progressão de rodada** (é a especificação; não improvise variante) e ligá-la em `rounds-list.tsx` **no lugar do `?? rounds.at(-1)`**. Regras: util puro em `utils/` da própria feature (sem hook, sem JSX, sem fetch); `type`, nunca `interface`; datas via `date-fns`, nada de `Intl` cru; código em inglês, só string de UI em português. Don't: **não** decida por placar (`score == null`) e **não** decida pelo jogo futuro mais próximo (`argmin(date)`) — as duas ressuscitam a rodada de um jogo adiado; a chave é o **maior número de rodada já iniciada**. **Não** avance com `base + 1` aritmético → use a **próxima do array ordenado** (número de rodada pode ter buraco). **Não** assuma `date` como `string`: o Eden revive ISO em `Date`, então normalize como `format.ts:12` (`typeof d === "string" ? d : d.toISOString()`).slice(0,10) — `date.slice(...)` direto passa no typecheck e explode só no browser. **Não** converta as datas pra outro formato antes de comparar — a comparação lexicográfica só é válida com `yyyy-MM-dd` zero-padded. **Não** chame `new Date()` em escopo de módulo nem antes do guard de `isPending` (hydration mismatch); **não** leia o relógio dentro da função — `today` entra por parâmetro, senão o script não testa nada. **Não** passe o round pro `useLeagueRoundsQuery(code, round)` — esse arg filtra UMA rodada no servidor e mata o dropdown. Prova: `cd apps/web && bun run scripts/check-current-round.ts && cd ../.. && bun run typecheck` → 7 linhas `ok` (casos em dossiê §Testes — script; o **caso 3** é o discriminador: straggler mais próximo que a rodada corrente → devolve `20`, nunca `18`) e typecheck exit 0.

**P2 [ui] (depende: P1) a escolha passa a sobreviver** — criar `apps/web/features/leagues/hooks/ui/use-round-param.ts` espelhando `use-season-param.ts` (`?round=N`, `router.replace` com `scroll: false`) e trocar o `useState<number | null>` de `rounds-list.tsx:65` por ele. Regras: hook de `ui/` (estado/URL, zero rede — query fica em `hooks/data/`); kebab-case sem sufixo redundante; `type`, nunca `interface`. Don't: **não** escreva o param no primeiro load — ausente = rodada atual, igual ao `?season=`; escolher a rodada que já é a atual **limpa** o param (`setRound(v === atual ? undefined : v)`) em vez de escrevê-lo. **Não** use `router.push` (polui o back stack — o `?season=` usa `replace` de propósito). **Não** deixe o `?? rounds.at(-1)` como fallback de round inexistente: rodada da URL que não existe na season atual cai em `pickCurrentRound`, não na última. Prova: roteiro de browser T2 + T3 (dossiê §Testes) — escolher rodada ≠ default, ir pra Classificação, voltar → **continua** na escolhida; refresh na URL com `?round=` → abre nela; `list_console_messages` sem erro novo.

**P3 [ui] (depende: P2) trocar temporada limpa a rodada** — em `use-season-param.ts#setSeason`, remover também o `round` da query string ao trocar de season. Regras: o hook é compartilhado por liga/time/jogador (LIG-008) — a remoção é no-op onde `round` não existe. Don't: **não** monte a URL por concatenação de string; continue no `URLSearchParams` já usado ali, senão outros params se perdem. **Não** limpe o `round` em qualquer navegação — só na **troca de season**; limpar no `pathname` mataria o A3. Prova: roteiro de browser T4 (dossiê §Testes) — com `?round=N`, trocar temporada → `round` some da query string e a lista abre na rodada atual da season nova; repetir o switch em `/teams/<slug>` → sem quebra, `list_network_requests` sem falha.

### Verificação final

- `bun run typecheck` limpo (raiz) e `bun run lint` limpo
- **Função pura**: `cd apps/web && bun run scripts/check-current-round.ts` → 7/7 `ok` — casos: rodada em curso (fim de semana partido) · entre rodadas (avança) · **straggler mais próximo que a corrente** (o discriminador) · season encerrada (última, A4) · season não começou (primeira) · lista vazia · `date` revivido como `Date`. Detalhe: dossiê §Testes — script. (Não existe runner de unidade no repo — o script ad-hoc É o teste.)
- **Browser real (chrome-devtools MCP)** — teste PRIMÁRIO: roteiro completo em dossiê §Testes, cenários **T1..T5** (escada: não-regressão de season encerrada → persistência entre abas → refresh → troca de season → golden path do primeiro load por último). Fechamento com `list_console_messages` sem erro/warning novo (inclusive hidratação) e `list_network_requests` sem falha. **MCP não atacha com o Chrome do dono aberto** (memória `chrome-devtools-profile-travado`) → declarar explicitamente e cair no Playwright abaixo; nunca afirmar que a UI funciona sem uma das duas provas.
- **E2E Playwright complementar** (fallback se o MCP não atachar): spec nova `apps/web/e2e/rounds-tab.spec.ts` cobrindo T2 (persistência na troca de aba) e T3 (refresh) — `cd apps/web && bun run test:e2e`, dev em :3211. ⚠️ **CORRIGIDO 2026-07-19 (divergência achada no `/i`)**: a página de liga **NÃO é pública**. O gate existe em `apps/web/proxy.ts` — o Next 16 renomeou `middleware.ts` → `proxy.ts`, e o planejamento procurou pelo nome antigo e concluiu errado. `createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])`: **toda** outra rota exige sessão Clerk. Consequência: esta spec **depende sim** de `.env.e2e` (chaves + `CLERK_E2E_EMAIL`/`CLERK_E2E_PASSWORD` de um usuário `+clerk_test`), exatamente como `auth.spec.ts`; sem isso ela dá **skip**, e skip não é verde.
- re-teste do blast radius de LIG-008: trocar temporada em `/leagues/<code>`, `/teams/<slug>` e `/players/<slug>` continua funcionando (o P3 mexe no hook das três)
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra A1..A5 — reporta só gap de requisito/correção (não estilo); diff fora de `apps/web/features/leagues/**` + `apps/web/scripts/` + `apps/web/e2e/` = achado

### Pré-mortem e rollback

3 semanas depois do merge, quebrou. Causas mais prováveis:
- C1: **jogo adiado/remarcado** faz a aba abrir numa rodada velha — sintoma que o dono veria: "abriu na rodada 18 e a liga está na 20"; mitigação: é exatamente o caso 3 do script da P1, que precisa continuar verde (não é caso opcional — foi a falha que derrubou duas regras candidatas no planejamento).
- C2: **fuso** — dono viajando, ou máquina em UTC perto da meia-noite, vê a rodada vizinha — sintoma: off-by-one no default só à noite; mitigação: D2 documenta o escape hatch (trocar o helper `today` por `formatInTimeZone` + a dep `date-fns-tz`); custo baixo, não vale antecipar.
- C3: **re-seed/ingestão** muda as datas ou a season corrente (LIG-013 sync ao vivo) e o default pula — sintoma: rodada default oscila entre loads; mitigação: a regra é pura sobre o dado servido, então o diagnóstico é no banco (`match.date`), não na UI.
- C4: `params.delete("round")` no hook compartilhado mexe com time/jogador — sintoma: switcher de temporada estranho fora da liga; mitigação: item de re-teste do blast radius acima.

Rollback: `git revert` basta (ui pura, sem schema, sem migração, sem contrato de API). O rollback **não** desfaz: nada — nenhum dado é gravado por esta feature.

### Fora de escopo

- Agrupar os jogos por data dentro da rodada (W-010 da wishlist, mesmo componente) → promover a feature própria quando sair da wishlist; critério: dentro da rodada, os jogos aparecem sob subtítulos por dia.
- Rodada corrente servida pela API / `is_current` da SportMonks → já é tarefa de **LIG-014**; critério: a home lê a rodada corrente do banco e reusa (ou substitui) a regra do `pickCurrentRound`.

## Evidências

- [código] `apps/web/features/leagues/components/league-detail/rounds-list.tsx:74` — `?? rounds.at(-1)`: o default é a última rodada da season, origem do incômodo
- [código] `apps/web/features/leagues/components/league-detail/league-detail.tsx:120` — `RoundsList` dentro de `TabsContent`, que o Radix desmonta ⇒ `useState` não sobrevive à troca de aba
- [código] `apps/web/features/leagues/hooks/ui/use-season-param.ts:25` — precedente de persistência em URL a espelhar (`router.replace`, `scroll: false`)
- [código] `apps/web/features/leagues/utils/format.ts:12` — normalização `string | Date` exigida pelo Eden; `format.ts:21` — precedente de "hoje" local nesta pasta
- [código] `apps/web/features/leagues/hooks/data/queries/use-league-rounds-query.ts:7` — o arg `round?` filtra UMA rodada no servidor (não usar aqui)
- [código] `apps/web/package.json:28` — `date-fns` presente, `date-fns-tz` ausente em `apps/web` (sustenta D2)
- [código] `apps/web/playwright.config.ts:26` — e2e já roda em `America/Sao_Paulo`

## Verificação

Estado: **parcial**. A regra está provada; o comportamento de UI **não** — ver §Divergência 2026-07-19.

**Provado (evidência executada)**

| Critério | Prova | Resultado |
|---|---|---|
| A4 (não-regressão: season encerrada abre na última rodada) | `cd apps/web && bun run scripts/check-current-round.ts`, caso 4 | ok |
| Regra imune a jogo adiado (o discriminador que derrubou 2 regras candidatas no planejamento) | idem, caso 3 — straggler da r18 em `07-22`, mais perto que a r20 em `07-25` | `20`, nunca `18` |
| Regra completa (7 casos do dossiê §Testes) | idem | **7/7 ok**, exit 0 |
| Compila e passa no linter | `bun run typecheck` (raiz) · `bun run lint` | exit 0 · 0 erros (os 2 warnings nos arquivos tocados são `<img>` pré-existentes, em linhas não alteradas) |
| A spec E2E compila e é coletada | `cd apps/web && bun run test:e2e:list` | 4 testes em 2 arquivos, incluindo T2 e T3 |

**NÃO provado (bloqueado, não esquecido)** — A1, A2, A3, A5 e o cenário T1. Todos exigem browser autenticado. Note que o caso 7 do script cobre a *função* recebendo `Date` (revival do Eden), mas **não** prova a forma do dado em runtime — isso só o browser pega.

Nada aqui foi verificado no navegador: **não afirmo que a UI funciona.** O que existe é a regra provada em isolamento e o código ligado a ela com typecheck/lint verdes.
