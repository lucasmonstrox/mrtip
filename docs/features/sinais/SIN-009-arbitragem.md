---
id: SIN-009
titulo: Sinal de arbitragem (árbitro escalado)
modulo: sinais
status: verificado
prioridade: P1
facetas:
  dados: feito # tabela referee + match.refereeId; 6 seasons backfilled — provado por script no banco
  api: feito # getMatch devolve referee sem perder campo antigo — provado por script chamando o service
  ui: feito # card na aba Fatos, 3 cenários no Chrome real (vazio, variante BRA, golden path PL)
  ia: investigado # deferida: injeção no prompt cortada pelo dono (2026-07-20); design no dossiê §Quant
testada: sim
testes:
  - "_check-referee.ts 6/6 no banco dev (2026-07-20): T1 1536 jogos com árbitro · T2 idempotência 1→1/126→126 · T3 0 árbitros órfãos · T4 cobertura BRA 562/562, CARA 91/91, FAC 123/123, PL 760/760 (100%) · T5 getMatch com referee e 6/6 campos antigos · T6 jogo futuro → referee null"
  - "T4 exclui 749 jogos que o pipeline rico NUNCA enriquece (classificatória FA Cup/Carabao, stage_type_id 225 — limite do CUP-001, não regressão); número impresso pelo próprio teste, não escondido"
  - "Chrome real via chrome-devtools MCP (2026-07-20): T8 jogo futuro → 'Árbitro ainda não designado' · T9 Série A → 'Rodrigo José Pereira de Lima · Árbitro principal · Brazil' (acento e país ok) · T10 PL → 'Craig Pawson' com foto, 4 cards antigos da aba Fatos intactos"
  - "console sem erro novo (só o warn pré-existente de dev keys do Clerk); network 5/5 em 200"
  - "typecheck 3/3 verde (o web re-infere o tipo da API via Eden — é o teste de contrato); lint 0 errors"
  - "PROD (2026-07-20): migração 0037 aplicada no Neon (tabela referee + match.referee_id); backfill-referees.ts escreveu 1590 designações, catálogo 152 — números idênticos aos de dev"
  - "_check-referee.ts 6/6 contra o BANCO DE PROD (2026-07-20), mesma cobertura 100% em BRA/CARA/FAC/PL"
  - "deploy: mrtip-api version bfbbc350 · mrtip-web version b08dea53; ambos no ar e fail-closed sem token (api 401 no_token, web 307 pro sign-in)"
  - "golden path da UI EM PRODUÇÃO confirmado pelo DONO (2026-07-20): card apareceu na partida em prod. O agente não conseguiu verificar sozinho — a página exige sessão Clerk."
  - "revisor em contexto fresco: nenhum gap em A2/A3/A4; 3 achados de doc desatualizado (A1 sem a exclusão, dossiê citando tabelas revertidas, C3 apontando tabela dropada) — todos corrigidos"
depende_de: []
impacta: [DOS-001, MOD-001]
ancoras:
  settings: []
  tabelas: [referee, match]
  tools: []
  funcoes: [getMatch, loadMatchReferee]
  rotas: ["GET /v1/matches/:key"]
docs: [docs/regras/arbitragem.md, docs/investigacoes/sportmonks-inventario-completo.md, docs/planos/SIN-009-arbitragem.md]
verificado_em: 2026-07-20 # dono confirmou o card em produção
atualizado: 2026-07-20
---

# Sinal de arbitragem (árbitro escalado)

## Descrição

O árbitro escalado é o maior driver isolado do mercado de cartões (~2× entre rígido e brando), estável e subprecificado fora das grandes ligas. Melhor candidato a edge real do conjunto de sinais.

## Tarefas

- [x] P1 dados — tabela `referee` + coluna `match.refereeId` (D8) + `;referees.referee` no `richInclude` + `ingestReferees` ligado aos 2 sítios de sync
- [ ] ~~P2 dados — perfil por temporada~~ **CORTADO pelo dono (2026-07-20): "eu só quero o referee"**. Ver D7
- [x] P3 dados — backfill das 6 seasons (dev e prod); `backfill-referees.ts` pega 54 jogos a mais que o sync (classificatória de copa tem árbitro sem precisar do include rico)
- [x] P4 api — `loadMatchReferee` + campo `referee` no `getMatch`
- [x] P5 ui — card de arbitragem na aba Fatos, com estado vazio de "ainda não designado" como caso primário
- [x] P6 deploy — migração 0037 no Neon de prod + backfill (1590 jogos) + deploy api/web; falta só o dono confirmar a UI logada em prod
- [ ] ia — injeção no prompt: **deferida** por decisão do dono (2026-07-20); design pronto no dossiê §Quant

## Plano (2026-07-20)

Dossiê: [docs/planos/SIN-009-arbitragem.md](../../planos/SIN-009-arbitragem.md)

### Objetivo, aceite e non-goals

Pronto = o árbitro principal de cada jogo está no banco e a **aba Fatos da página da partida** mostra um card com quem apita.

**Iteração de dados + exibição, não de modelo** — o dono cortou a injeção no prompt (2026-07-20). O cálculo multiplicativo está desenhado e **deferido** (dossiê §Quant); a faceta `ia` segue `investigado`.

Non-goals: qualquer mudança no prompt de prognóstico ou no `best_bet`; **estatística do árbitro** (D7); página/rota própria de árbitro (feature futura); backtest e calibração; booking points; assistentes e quarto árbitro (nem ingeridos — D8).

Aceite:
- A1 [dados] todo jogo encerrado que o **pipeline rico enriquece** tem árbitro principal em `match.refereeId` → coberto por P3. Exclusão explícita: a classificatória da FA Cup/Carabao (`stage_type_id` 225, 749 jogos) nunca recebe o include rico — limite pré-existente do CUP-001, não desta feature. Sem esse recorte o critério seria falso.
- A2 [dados] o re-sync é idempotente (não duplica árbitro no catálogo nem re-designa) → coberto por P1
- A3 [api] `GET /v1/matches/:key` devolve `referee` em jogo encerrado e `null` em jogo sem designação, sem perder nenhum campo existente → coberto por P4
- A4 [ui] na aba Fatos, jogo com árbitro mostra quem apita; jogo sem designação mostra o estado vazio explícito → coberto por P5

### Premissas

Verificadas no mapeamento (dossiê §Estado do terreno). **Se uma cair durante o /i: PARAR e atualizar este Plano com a divergência datada** — não forçar o passo.

- `include=referees` responde 200 no plano atual e traz 4 árbitros por fixture (types 6/7/8/9).
- Cobertura de 12/12 em jogos encerrados nas 4 competições (`apps/api/scripts/_probe-ref.ts`); jogo FUTURO normalmente não tem árbitro designado.
- `ingestTvStations` (`apps/api/src/db/sync-ingest.ts:128-166`) é o precedente estrutural a copiar, chamado de 2 sítios (`sync-sportmonks.ts:511` e `sync-ingest.ts:440`).

### Decisões

- **D5: só página do jogo nesta iteração; prompt fica de fora** — driver: decisão do dono (2026-07-20) respondendo à pergunta de escopo do `/pl`; descartado: injetar o bloco no prompt junto, e descartado também criar mercado de cartões no `best_bet`; pagamos: o sinal fica visível mas não acionável pelo motor até a próxima iteração — em troca, dá pra olhar o dado antes de apostar nele.
- **D8: `match.refereeId`, coluna direta — sem tabela de vínculo** — driver: pergunta do dono durante a execução ("não era só pôr o refereeId no match?", 2026-07-20). Com o escopo cortado pra só-identidade e só o principal exibido, os outros 3 papéis (assistentes + quarto árbitro) viravam **75% de linhas mortas** — 1520 vínculos na PL pra 380 que alguém lê. E o precedente do repo é a coluna: `match.venueId` (LIG-004) tem exatamente esta forma, FK nullable direto no `match`. Descartado: `match_referee` com `typeId` (era a D2), que só se pagaria se exibíssemos assistentes/VAR; pagamos: se um dia quisermos os assistentes, precisa da tabela de volta (migração nova). Custo da troca foi ~zero porque a migração 0037 ainda não tinha sido commitada nem deployada. Meu argumento original de blast radius era fraco — coluna nullable aditiva é o que o `venueId` já fez sem quebrar nada.
- **D7: só a IDENTIDADE do árbitro; nada de estatística dele** — driver: o dono cortou explicitamente durante a execução ("eu só quero o referee, pq vc colocou um montão de estatística do referee?", 2026-07-20) depois que o P1/P2 já tinham sido implementados; descartado: `referee_season_stats` (20 colunas) + `ingestRefereeStats`, que chegaram a rodar em dev e foram REMOVIDOS (tabela dropada, migração 0037 regenerada limpa antes de qualquer commit ou deploy); pagamos: o card mostra quem apita mas não o quão cartoteiro ele é — que era o valor de aposta do sinal. Quando a faceta `ia` voltar, o perfil por temporada volta junto (dossiê §Quant tem o shape e os type_ids sondados: 47 pênaltis, 56 faltas, 83 vermelhos, 84 amarelos, 85 amarelo-vermelho, 188 jogos, 314 VAR).
- **D4: nada de shrink ou média ponderada nesta iteração** — driver: o card **exibe** o que a SportMonks reporta, não prevê; shrink é ferramenta de estimador e entra junto com o cálculo deferido (dossiê §Quant, K = 10 como default declarado); descartado: já shrinkar o número exibido, o que faria o card mostrar um valor que não bate com nenhuma fonte; pagamos: média de amostra pequena aparece crua — mitigado por imprimir a amostra ao lado, sempre.
- Adiadas de propósito pro /i: nomes exatos das funções e colunas, copy em português do card e do estado vazio, ordem das métricas secundárias dentro do card.

### Passos

**P1 [dados] esqueleto — árbitro do jogo no banco** — `apps/api/src/db/schemas/leagues.ts` (3 tabelas novas: `referee`, `match_referee`, `referee_season_stats` — shape completo no dossiê §Schema), migração drizzle **só-expand**, `;referees` em `richInclude` (`apps/api/src/db/sync-ingest.ts:35`) e `ingestReferees` novo em `sync-ingest.ts` espelhando `ingestTvStations:128-166` (dedupe por `referee_id` → upsert do catálogo → `imgKey`/`uploadImagem` pro R2 → upsert do vínculo), chamado dos 2 sítios (`sync-sportmonks.ts:511`, `sync-ingest.ts:440`). Regras: código e dado em **inglês** (tabela `referee`, não `arbitros`); `type`, nunca `interface` (`interface SmReferee {}` → `type SmReferee = {}`); imagem vai pro R2 bucket `mrtip` como toda entidade com logo, nunca guardar a URL do CDN da SportMonks. Don't: **não** carimbar `// @feature SIN-009` na linha do `richInclude` nem em `ingestFixtures` — é pipeline compartilhado por 4 competições, o carimbo só vai nas tabelas novas; **não** adicionar coluna em `match` (D2); **não** buscar stats do árbitro aqui (é o P2 — este passo só grava identidade e vínculo); **não** assumir que todo fixture traz árbitro (jogo futuro não traz → `continue`, não `throw`); **não** re-upar imagem já existente no R2 (o `uploadImagem` já faz skip por HEAD). Prova: `bun run db:sync --league 8 --season 25583` termina sem erro **e** script `apps/api/scripts/_check-referee.ts` casos T1/T2 (dossiê §Testes) → 2/2 OK.

**P2 [dados] perfil do árbitro por temporada (depende: P1)** — `apps/api/src/db/sync-ingest.ts`: buscar `/referees/{id}?include=statistics.details` **1× por árbitro** (dedupe antes do fetch) e popular `referee_season_stats`, uma linha por (árbitro, season da SportMonks). Regras: `type`, não `interface`; nomes de coluna em inglês. Don't: **não** buscar por jogo (são dezenas de árbitros vs milhares de jogos — estoura o rate limit de 2000/h à toa); **não** gravar `percentage` de home/away (é derivável de `home/away avg` na leitura — D3); **não** filtrar as seasons pelas que ingerimos (a season antiga do árbitro é sinal de graça); **não** deixar `seasonMatches` nulo — é o denominador do shrink e sem ele o P4 não roda. Falha provável: a API omite o detail quando o valor é 0 (mesmo gotcha do `lineups.details`) → tratar ausente como 0, não como desconhecido, quando `seasonMatches > 0`. Prova: `apps/api/scripts/_check-referee.ts` caso T3 → OK, com `seasonMatches > 0` e `yellowAvg` não nulo.

**P3 [dados] backfill das 6 seasons (depende: P2)** — re-sync das 4 competições já ingeridas (PL 24/25 + 25/26, BRA 2025 + 2026, FAC, CARA) pra preencher árbitro e perfil nos 2.484 jogos existentes. Don't: **não** rodar um re-sync que reescreva o resto (é idempotente por upsert, mas rodar liga por liga e conferir as contagens antes/depois evita descobrir estrago depois); **não** tratar jogo futuro sem árbitro como falha do backfill. Prova: `apps/api/scripts/_check-referee.ts` caso T4 → cobertura ≥95% dos jogos com `ft_home is not null`, e a lista dos faltantes impressa.

**P4 [api] `getMatch` devolve o árbitro (depende: P3)** — loader novo `loadMatchReferee` em `apps/api/src/modules/leagues/shared/shared.ts` (espelhando `loadMatchTvStations`) + 1 campo no retorno de `getMatch` (`apps/api/src/modules/leagues/get-match/get-match.service.ts:33-67`, mesma forma das linhas `:41` e `:65`). Payload enxuto por D7: `{ name, commonName, imageUrl, countryName } | null` — só o principal (`typeId = 6`), **sem bloco de estatística**. Regras: pasta-por-endpoint — o loader é transversal, então vai em `shared/`, não numa pasta de operação nova; `matches.routes.ts` continua **fino**, zero regra de negócio; Elysia no Workers usa **TypeBox (não zod) e sem response schemas**; `type`, nunca `interface`; nomes de campo em **inglês** (só a copy da UI é PT). Don't: **não** criar módulo/rota nova — é um campo no `getMatch` que já existe; **não** remover nem renomear campo existente do payload (a web infere o tipo via Eden Treaty — some a aba inteira); **não** fazer query por árbitro dentro de loop de jogos (é 1 leitura por partida, o detail é de 1 jogo só); **não** lançar quando não há designação — devolve `null`, que é o caso comum em jogo futuro; **não** devolver assistentes/quarto árbitro no payload (ingeridos no P1, fora do card por decisão de escopo). Prova: `apps/api/scripts/_check-referee.ts` casos T5/T6/T7 → 3/3, com os campos antigos (`rest`, `standings`, `tvStations`, `goals`, `cards`) presentes no mesmo payload.

**P5 [ui] card de arbitragem na aba Fatos (depende: P4)** — `apps/web/features/leagues/components/match-detail/match-detail.tsx`: card novo na pilha da aba Fatos, no molde do "Onde assistir" (`:307-330`) e do descanso (`:295-305`) — `rounded-lg border bg-card p-4`, rótulo em `text-xs uppercase tracking-wide text-muted-foreground`. Mostra quem apita: nome + foto (com fallback sem foto) + país. **Sem estatística** (D7). Regras: folder-by-feature — o componente fica dentro de `features/leagues/components/match-detail/`, kebab-case, **proibido importar de outra feature**; `app/**/page.tsx` continua fino; `type`, nunca `interface` (`interface Props {}` → `type Props = {}`); **strings visíveis em português**, campos e props em inglês. Don't: **não** tratar "sem árbitro designado" como borda — é o caso primário em jogo futuro, tem estado próprio e testado (T8); **não** imprimir média sem a amostra ao lado (2 jogos com cara de fato é como o card vira ruído); **não** omitir de qual temporada veio o número quando o `scope` é `fallback`; **não** dar veredito de aposta no card ("tende a over cartões") — esta iteração exibe dado, o juízo é do prompt e ficou de fora (D5); **não** criar service/fetch novo no front (o dado vem no payload do `getMatch` que a página já busca). Prova: roteiro chrome-devtools T8/T9/T10 (dossiê §Testes) → 3/3, com `list_console_messages` e `list_network_requests` limpos. MCP não atachando (precedente LIG-006) → declarar o bloqueio e pedir validação do dono, nunca afirmar que renderiza.

### Verificação final

- `bun run typecheck` limpo (raiz — o web re-infere o tipo da API via Eden Treaty, então é o teste de contrato) e `bun run lint` sem erro novo
- **API/dados**: `bun run apps/api/scripts/_check-referee.ts` → 7/7 (T1..T7, dossiê §Testes) — happy (T1/T3/T5), borda (T2 idempotência, T4 cobertura, T7 fallback de season) e erro (T6 sem designação). Assert direto no banco onde o efeito não aparece no HTTP. (Não existe runner de unidade no repo — não inventar `bun test`.)
- **Browser real (chrome-devtools MCP — teste PRIMÁRIO da faceta `ui`)**: roteiro completo no dossiê §Testes, cenários **T8 (estado vazio, o caso primário) → T9 (amostra pequena / fallback) → T10 (golden path)**, fechando com `list_console_messages` sem erro novo e `list_network_requests` sem falha. **Precedente do LIG-006: o MCP não atacha com o Chrome do dono aberto** — se acontecer, declarar explicitamente e pedir o golden path ao dono; nunca afirmar que a UI funciona.
- **E2E Playwright**: não justifica — card estático dentro de uma aba já coberta; o roteiro de browser cobre os 3 estados.
- re-teste do `features impact` (escopo desta iteração): DOS-001 + vizinhos de aba LIG-004/LIG-005/LIG-006/W-059 — abrir a aba Fatos e conferir que os 4 cards antigos seguem lá. MOD-001 e SIN-007 ficam fora: sem prompt, não há o que dupla-contar.
- `bun run features check && bun run features build`
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra A1..A4 — reporta só gap de requisito/correção (não estilo); diff fora dos paths deste plano = achado

### Pré-mortem e rollback

3 semanas depois do merge, quebrou. Causas mais prováveis:
- **C1: card vazio na maioria dos jogos** — a designação do árbitro sai tarde e a página da partida é vista sobretudo ANTES do jogo. Sintoma que o dono veria: abre a aba Fatos de um jogo do fim de semana e o card não diz nada. Mitigação: T8 é o primeiro cenário do roteiro, não o último; **e o `/i` confirma a antecedência real da designação** antes do merge, pra a expectativa estar alinhada.
- **C2: amostra pequena virando convicção** — árbitro com 2-3 jogos na competição exibe média extrema com cara de fato. Sintoma: dois jogos seguidos do mesmo árbitro mostrando números muito diferentes. Mitigação: amostra sempre impressa ao lado (D4) + `scope` visível quando é fallback (D6).
- **C3: contrato da SportMonks mudando** — o include some ou o shape de `statistics.details` muda. Sintoma: sync verde mas o fill-rate de `match.referee_id` parando de crescer (ou a tabela `referee` estagnada). Mitigação: T4 (cobertura) rodando no re-sync.
- **C4: payload do `getMatch` quebrando a aba inteira** — campo removido/renomeado por engano derruba o tipo inferido no web. Sintoma: aba Fatos em branco, não só o card novo. Mitigação: `bun run typecheck` na raiz + T5 assevera que os campos antigos seguem no payload.

Rollback por classe: ui → `git revert` basta; api → idem (campo aditivo, nenhum consumidor legado depende dele); schema → só-expand, reverte com drop das 3 tabelas novas (nenhuma coluna existente muda, então não há janela de transição); ingestão → remover `;referees` do `richInclude` e a chamada. O rollback NÃO desfaz: nada — esta iteração não publica pick nem grava histórico imutável (o prompt ficou de fora por D5). Quando o §Quant voltar, aí sim o prognóstico persistido em `match_prognosis` é imutável e o revert não o apaga.

### Fora de escopo

- **Injeção do sinal no prompt** (bloco Arbitragem no `## Contexto`, cálculo multiplicativo com shrink) → é a **próxima iteração desta mesma feature**, faceta `ia`, que segue `investigado`. Design pronto no dossiê §Quant — não re-derivar. Cortado por D5 (dono, 2026-07-20).
- Página/rota própria de árbitro (perfil, histórico, ranking de rigor da liga) → criar `docs/features/ligas/LIG-016-pagina-do-arbitro.md` (status: ideia, depende_de: [SIN-009]); critério: `/referees/:slug` mostra perfil com média de cartões por season e os jogos apitados.
- Backtest e calibração do K do shrink contra resultado real de cartões → depende da faceta `ia` estar feita; critério: K escolhido por erro medido, não por default.
- Mercado de cartões / booking points na saída `best_bet` → depende de tudo acima.

## Evidências

- [doc] docs/regras/arbitragem.md — regra completa (anti-dupla-contagem, fontes, limitações).
- [probe 2026-07-20] **A fonte é nativa da SportMonks, não externa.** A tarefa `dados` citava API-Football/football-data.co.uk/FootyStats — fontes descartadas quando a SportMonks virou fonte única (2026-06-28). O dado já está no plano atual (200 OK, sem add-on):
  - `include=referees` devolve **4 árbitros por fixture** (type 6 principal, 7/8 assistentes, 9 quarto).
  - **Cobertura 12/12 em jogos encerrados nas 4 competições ingeridas** (PL, BRA, FAC, CARA) — `apps/api/scripts/_probe-ref.ts`. Um probe sem filtro de estado dá 0/25 em BRA/FAC: são fixtures FUTUROS, onde o árbitro ainda não foi escalado. Falso negativo, não falta de cobertura.
  - `/referees/{id}?include=statistics.details` dá **7 métricas por (árbitro, season)**: Yellowcards, Redcards, Yellowred Cards, Penalties, Fouls, VAR Moments, Season Matches — com split **casa/fora** e, nos cartões, quebra `on_pitch`/`on_bench`/`for_coach`.
  - **O spread existe e é grande na Série A:** Candançan 2.75 amarelos/jogo · Rodrigo J. P. de Lima 5.27 · Bruno Arleu 6.18 (**2.2×**) — season 26763. Confirma a tese "maior driver isolado do mercado de cartões".
  - Stats são **por (árbitro, season)** e o mesmo árbitro tem seasons separadas por competição (A. Taylor: PL 23614/25583 + FA Cup 25919, esta com só 2 jogos) → decidir baseline (season corrente vs blend com anterior) e piso de amostra.
