---
id: MOD-011
titulo: Raciocínio do prognóstico auditável na página (o prompt de evidências não é exposto — D7)
modulo: modelos
status: feito # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1 # P1 | P2 | P3
facetas: # só as superfícies que se aplicam; mesma escala do status
  api: feito # rota dedicada; devolve só o reasoning (D7), provada por curl
  ui: feito # Sheet 60%, só reasoning; golden path validado pelo dono (T5 pendente)
testada: parcial # nao | parcial | sim
testes:
  - "API /prognosis/audit via curl em instância isolada: 5/5 casos (run existente, sem run, 404, runId alheio, 422) (2026-07-19)"
  - "A5 prompt não vaza: campos do payload sem promptText/rawOutput; 106,9KB→25,6KB (2026-07-19)"
  - "typecheck 3/3 verde; lint sem erro novo (2026-07-19)"
  - "UI golden path validado pelo DONO no browser dele (2026-07-19); agente sem sessão Clerk não dirigiu o Chrome"
  - "A2 (sem request com painel fechado) provado por código pelo revisor (enabled + Radix não monta); falta confirmar em Network"
  - "T5 (run com reasoning nulo) NUNCA exercitado — nulo não existe no dev, exige UPDATE fabricado"
depende_de: [MOD-004] # o prompt vivo e a match_prognosis que ele persiste
impacta: [MOD-004, MOD-006, MOD-010]
ancoras: # pontos compartilhados que ESTA feature toca
  settings: []
  tabelas: [match_prognosis] # ⚠️ compartilhada com MOD-004/MOD-006/MOD-010
  tools: [] # ferramentas do assistente de IA
  funcoes: []
  rotas: ["/matches/:id/prognosis", "/matches/:id/prognosis/audit"]
docs: [docs/planos/MOD-011-prognostico-completo-auditavel.md]
verificado_em: null # data, obrigatório quando status: verificado
atualizado: 2026-07-19
---

# Raciocínio do prognóstico auditável na página (o prompt de evidências não é exposto — D7)

## Descrição

Hoje a aba Prognóstico mostra só o **produto final** do motor: best bet, xG total e por faixa de 15', 1x2 do jogo/1ºT/2ºT, BTTS, drivers e impacto de desfalques. Fica invisível **como o modelo chegou lá** — a cadeia de raciocínio (17k–41k caracteres por jogo), onde moram as perguntas de verificação adversariais (CoVe) e as revisões que ele fez antes de cravar.

Pra quem: o **dono do motor** (auditoria/depuração) — reasoning cru é ferramenta de diagnóstico, não leitura de apostador. Isso define a ergonomia, **não** a permissão: o painel fica atrás de uma abertura explícita (não pesa nem polui a aba), mas sem gating por papel — ver D5. Comportamento esperado: na aba Prognóstico, um painel lateral a 60% da tela que carrega sob demanda e mostra o raciocínio daquela run, respondendo "por que ele cravou essa aposta?".

**Fronteira dura (D7):** o **prompt de evidências não entra** — nem na UI, nem no payload da API. É o IP do motor. Consequência assumida: dá pra auditar como o modelo *raciocinou*, não qual *briefing* ele recebeu; pra essa segunda pergunta o caminho continua sendo o `report.html` local de cada run.

Motivação concreta (o caso que originou a feature, 2026-07-19): no **Sport 0-4 Grêmio** (rodada 38 do BRA 2025) o motor cravou *under 2.5 a 75%* e o jogo teve 4 gols, 0-3 já no intervalo. Pela saída estruturada parecia erro de leitura do modelo; abrindo o prompt, o briefing afirmava "Grêmio salvo e **sem alvo continental alcançável** → motivação baixa", quando o Grêmio entrou 11º **dentro da zona de Sudamericana, precisando vencer**, com 4 concorrentes a ≤2 pontos. O modelo leu certo um input errado. **Sem ver o prompt, o bug era invisível** — e contaminava toda avaliação de acerto/erro do motor.

## Tarefas

- [x] P1 api — service + rota `/matches/:id/prognosis/audit` registrada (só `reasoning`, sem prompt — D7)
- [x] P2 ui — hook de query sob demanda (`enabled` amarrado ao painel aberto)
- [x] P3 ui — painel (Sheet 60%) com o reasoning em texto puro
- [x] P4 ui — estados vazios: run sem `reasoning` (coluna nullable) — código escrito; **T5 (nulo fabricado) nunca exercitado**

## Plano (2026-07-19)

Dossiê: [docs/planos/MOD-011-prognostico-completo-auditavel.md](../../planos/MOD-011-prognostico-completo-auditavel.md)

### Objetivo, aceite e non-goals

"Pronto" = numa partida com prognóstico, consigo abrir um painel na aba Prognóstico e ler o **raciocínio** daquela run, sem que isso pese na visita normal à aba.

Non-goals (todos decididos pelo dono em 2026-07-19 — ver §Decisões, não são pendências): **expor o prompt de evidências** — D7, nem na UI nem na API; parsing de CoVe em lista ✓/~/✗ — D4, o painel mostra o `reasoning` **verbatim** e ponto; comparador de runs lado a lado — D6, mostra sempre a mais recente, e a rota já aceita `?runId=` pra não travar depois; gating por papel/flag — D5, não existe sistema de papéis e o app inteiro já exige login; cabeçalho de metadados da run — D8; reformatar/embelezar o texto (é diagnóstico, fidelidade > estética).

Aceite:
- A1 [api] `GET /v1/matches/:id/prognosis/audit` devolve o `reasoning` da run mais recente e **nunca** `promptText`/`rawOutput` (D7); `null` sem run; 404 em match inexistente → coberto por P1
- A2 [ui] com o painel FECHADO, nenhuma request a `/audit` é disparada (o peso é sob demanda) → coberto por P2, provado em T2
- A3 [ui] abrindo o painel na partida `2de0a06e`, leio a cadeia de raciocínio da run e consigo ver como o modelo interpretou a motivação do Grêmio → coberto por P3, provado em T4
- A4 [ui] run com `reasoning` nulo (coluna é nullable) mostra estado vazio explícito, não tela branca nem "null" na página → coberto por P4, provado em T5
- A5 [api] o payload de `/audit` **não contém** a string do prompt de evidências, em nenhuma circunstância — a garantia é a coluna ausente do `select`, não um filtro de UI → coberto por P1, provado por inspeção dos campos do payload

### Premissas

- `match_prognosis` já tem `reasoning`/`prompt_text`/`raw_output` populados (`apps/api/src/db/schemas/leagues.ts:630`) — **zero migração**.
- **As três colunas de auditoria são NULLABLE** (`leagues.ts:630-632` — nenhuma tem `.notNull()`) e o backfill engole prompt ausente sem erro (`apps/api/scripts/persist-prognosis.ts:81`, `catch { /* sem prompt salvo */ }`) — o nulo é caminho de código real. **Mas hoje não há nenhum**: verificado em 2026-07-19, as 295 linhas de `match_prognosis` no dev têm `reasoning` e `prompt_text` preenchidos. Consequência dupla: rota e painel tratam nulo como estado normal (não erro), **e** o T5 tem que FABRICAR o nulo por `UPDATE` — não existe caso natural pra observar.
- `packages/ui/src/components/sheet.tsx` existe e é importável pelo glob de exports (`packages/ui/package.json:41`).
- O `getPrognosis` atual NÃO deve ser alterado (`get-prognosis.service.ts:10` exclui a auditoria de propósito).
- O app inteiro já está atrás de login Clerk (`apps/web/proxy.ts`, CORE-003) e **não existe sistema de papéis** (CORE-003 tem `dados: ideia`) — por isso D5 dispensa gating.

Se uma premissa cair durante o `/i`: PARAR e atualizar este Plano com a divergência datada.

### Decisões

- **D1: rota irmã dedicada, não campo novo no payload existente** — driver: o dossiê pesa ~100KB/run (medido: prompt 75KB + reasoning 26KB) e a aba é visitada sempre; descartado: incluir no `getPrognosis` porque penaliza toda visita; pagamos: um endpoint a mais pra manter.
- **D2: texto puro, não HTML renderizado** — driver: `reasoning`/`promptText` são markdown gerado por LLM; renderizar como HTML é vetor de injeção; descartado: markdown-to-HTML bonito; pagamos: leitura mais crua.
- **D3: `?runId=` opcional já no P1** — driver: D6 pode virar "listar runs" depois; incluir o param agora custa ~nada e evita refazer o contrato; pagamos: um param que talvez não seja usado.
- **D4: `reasoning` verbatim, sem extrair ✓/~/✗** (dono, 2026-07-19) — driver: as runs persistidas **não** têm CoVe estruturada (o schema de saída do `run-deepseek.ts:134` exige só `[home, away, general, best_bet, drivers]`), então a CoVe só existe como prosa dentro do `reasoning`; descartado: (a) parsear o texto — frágil, o formato não é contrato e muda junto com o prompt; (b) estender o motor pra emitir `verificacao` tipada como o `super-prognosis.ts:110` já faz — funcionaria só em runs NOVAS, as linhas já gravadas nunca teriam, e adiciona perna `ia`; pagamos: sem tabela bonita de vereditos — quem audita lê o texto e acha a CoVe no meio dele.
- **D5: painel na própria aba, sem gating** (dono, 2026-07-19) — driver: o app já exige login Clerk em toda rota (`apps/web/proxy.ts`) e não existe papel "dono", então "esconder do apostador" custaria construir papéis do zero — feature separada, não detalhe deste plano; descartado: flag de env (some pro dono em produção se esquecer de ligar) e rota `/jogo/[id]/auditoria` separada (pulo de navegação pra auditar); pagamos: qualquer usuário logado consegue abrir o painel e ver o prompt do motor.
- **D6: sempre a run mais recente** (default assumido, dono não objetou) — driver: espelha o `getPrognosis` (`orderBy(desc(runAt)).limit(1)`), zero superfície nova; descartado: seletor de runs no P1 — as runs divergem de verdade (ver dossiê §Evidências `[banco]`), mas escolher run é feature própria; pagamos: com N passes por jogo, o painel mostra um só e o dono não vê a divergência pela UI.
- **D7: o prompt de evidências NUNCA sai da API** (dono, 2026-07-19, durante o `/i`: *"é só pra retornar o reasoning, o prompt nunca, isso vale ouro"*) — driver: o prompt é o IP do motor (quais evidências entram e como são mastigadas) e o app é visto por assinante, não só pelo dono; a proteção é a **coluna ausente do `select`** no service, não um filtro na UI — filtro de UI vaza pelo DevTools. Descartado: expor com gating (não existe sistema de papéis, ver D5). Pagamos: **o caso que originou a feature — ler o briefing e achar o bug da zona CONMEBOL — não é mais auditável pela UI**; segue possível pelo `report.html` em `apps/api/scripts/output/<matchId>/<stamp>/`, que é local do dono. Consequência de escopo: `rawOutput` também saiu (não pedido, e o produto dele já aparece na aba).
- **D8: sem cabeçalho de metadados no painel** (dono, 2026-07-19, durante o `/i`) — modelo/esforço/tokens/latência são ruído pra quem quer ler o raciocínio; o painel é só o texto. Os campos seguem no payload (escalares baratos) pra um futuro seletor de runs.
- Adiadas de propósito pro `/i`: copy exata dos rótulos.

### Passos

**P1 [api] esqueleto** — criar `apps/api/src/modules/leagues/get-prognosis-audit/get-prognosis-audit.service.ts` + `.schema.ts` (query `runId` opcional) e registrar a rota em `apps/api/src/modules/leagues/matches.routes.ts` (ao lado da linha 70). Shape e semântica: dossiê §Contrato. Regras: pasta-por-endpoint (`<verbo>-<substantivo>/` com `*.service.ts` + `*.schema.ts`); `matches.routes.ts` fica FINO (1 rota → 1 service, zero regra de negócio); Elysia no Workers = **TypeBox** (`t.Object`), **sem response schema**, `aot: false`; `type`, nunca `interface`; campos em inglês. Don't: não tocar em `get-prognosis.service.ts` (a exclusão da auditoria lá é intencional); não fazer `select *` da tabela e devolver cru (expõe colunas que o front não usa e acopla ao schema); não escrever nada em `match_prognosis` (âncora compartilhada com MOD-004/006/010 — esta rota é leitura pura); não repetir a resolução de match (reusar `getMatchRow` do `../shared/shared`, como o irmão faz). Prova: `cd apps/api && bun run dev` e `curl -s localhost:3001/v1/matches/2de0a06e-4498-4a5e-8862-cd65642f9ff7/prognosis/audit | head -c 200` → JSON com `promptText` não vazio; `curl -s -o /dev/null -w "%{http_code}" .../00000000-0000-0000-0000-000000000000/prognosis/audit` → `404`.

**P2 [ui] query sob demanda (depende: P1)** — criar `apps/web/features/leagues/hooks/data/queries/use-match-prognosis-audit-query.ts` no molde do `use-match-prognosis-query.ts`, com `enabled` amarrado ao estado de aberto (não só ao `id`). Regras: folder-by-feature (`hooks/data/queries/`), kebab-case sem sufixo redundante, `services/` é o único lugar com fetch — aqui o fetch é via Eden como o irmão; tipo derivado do hook (`ReturnType`), não declarado à mão; proibido importar de outra feature. Don't: não deixar `enabled: id.length > 0` (dispara sozinho e mata o A2 — o ponto inteiro da feature é ser sob demanda); não usar o mesmo `queryKey` do prognóstico normal (colide no cache); não fazer `prefetch` "pra ficar rápido". Prova: com o painel fechado, `list_network_requests` no Chrome sem nenhuma chamada a `/audit` (cenário T2 do dossiê §Testes).

**P3 [ui] painel (depende: P2)** — novo `apps/web/features/leagues/components/match-detail/prognosis-audit.tsx` usando `Sheet` de `@workspace/ui/components/sheet` a **60% da viewport**, acionado por um gatilho dentro de `prognosis.tsx`; mostra **só o `reasoning`** (D7) em bloco de **texto puro** com `whitespace-pre-wrap` e rolagem própria, sem cabeçalho de metadados (D8). Regras: componente vira pasta só quando tiver subcomponentes (por ora arquivo solto); `type` não `interface`; strings de UI em português. Don't: **não** usar `dangerouslySetInnerHTML` nem passar o texto por markdown-to-HTML (D2 — é texto de LLM, vetor de injeção); não truncar/reformatar o raciocínio (o valor é auditar o que o modelo REALMENTE pensou); não renderizar os 20k-41k chars sem container rolável próprio (trava a página); não montar o conteúdo quando o Sheet está fechado; **não** buscar nem exibir `promptText` (D7). Prova: cenários T3 e T4 do dossiê §Testes → o raciocínio aparece na partida `2de0a06e` e o painel ocupa 60% da viewport.

**P4 [ui] estados vazios (depende: P3)** — em `prognosis-audit.tsx`, tratar os dois vazios possíveis: run existente com `reasoning` nulo, e partida sem nenhuma run (payload `null`). Cada um vira uma frase explicando o porquê em português ("esta run não guardou o raciocínio do modelo"), não um bloco em branco. Regras: strings de UI em português, campos em inglês; `type`, nunca `interface`. Don't: não usar `?? ""` e renderizar bloco vazio (o dono não distingue "não guardou" de "guardou vazio" — é exatamente o tipo de ambiguidade que a feature existe pra matar); não confundir os dois vazios (sem run ≠ run sem reasoning — a mensagem tem que dizer qual é); não tratar nulo como erro de rede (não é falha — é run antiga); não usar `!` pra calar o TypeScript na coluna nullable. Prova: cenário T5 do dossiê §Testes → `UPDATE match_prognosis SET reasoning = NULL WHERE id = '<run de teste>'` num banco de dev, abrir o painel → a mensagem aparece em vez de tela branca; reverter o UPDATE depois.

### Verificação final

- `bun run typecheck` limpo (raiz) e `bun run lint` sem erros
- **API** (P1): `curl` contra instância isolada (`CLERK_SECRET_KEY="" PORT=<livre> bun src/index.ts` — o guard tem escape hatch de dev; sem isso tudo dá 401) — casos: run existente (200 + `reasoning` não vazio), match sem prognóstico (`null`), match inexistente (404), `?runId=` de outra partida (`null`, não 500), `?runId=` malformado (422). Não existe runner de unidade no repo — não inventar `bun test`.
- **A5 (D7)**: inspecionar os campos do payload — `promptText` e `rawOutput` **ausentes**; + `grep` em `apps/api/src`/`apps/web` sem referência a `prompt_text` fora de migrações.
- **Browser real (chrome-devtools MCP)** — teste PRIMÁRIO: roteiro no dossiê §Testes, cenários **T1..T5**, fechando com `list_console_messages` sem erro novo e `list_network_requests` sem falha. **Bloqueio conhecido**: o MCP atacha numa instância limpa **sem sessão Clerk**, e o app inteiro exige login (`proxy.ts` → 307 `/sign-in`); sem `.env.e2e` não há como logar. Nesse caso **declarar explicitamente**, nunca afirmar que a UI funciona.
- E2E Playwright: não justifica aqui (fluxo de leitura, sem mutação; o login já é coberto pelos specs do CORE-003).
- re-teste: `bun run features impact MOD-011` + conferir que a aba Prognóstico segue idêntica com o painel fechado (regressão do A2)
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra A1..A4 — reporta só gap de requisito/correção; diff fora dos paths deste plano = achado

### Pré-mortem e rollback

- **C1: o payload pesado vaza pro caminho quente** — alguém "simplifica" juntando as duas rotas. Sintoma: aba Prognóstico lenta pra todo mundo. Mitigação: A2 é critério de aceite com prova de rede (T2), não só intenção.
- **C2: o schema de saída do motor muda (MOD-004 é `em-andamento`)** e `raw_output` deixa de bater com o que o painel espera. Sintoma: painel quebrado só em runs novas. Mitigação: tratar `rawOutput` como opaco (exibir, não desestruturar campo a campo).
- **C3: re-seed do banco** gira os uuids e a partida `2de0a06e` do T4 some. Sintoma: prova do golden path irreprodutível. Mitigação: o roteiro do T4 diz como reachar por slug (`serie-a-2025-sport-recife-vs-gremio`), não só por uuid.

Rollback: ui/api pura → `git revert` basta (nada de schema, nada de escrita). O rollback não desfaz nada — a feature é leitura pura.

### Fora de escopo

- Painel de CoVe estruturado (✓/~/✗ como lista) → fora por D4. Vira trabalho real só se o motor passar a emitir `verificacao` tipada (molde: `apps/api/scripts/super-prognosis.ts:110`); nesse dia, criar `docs/features/modelos/MOD-012-cove-estruturado.md` (status: ideia, `depende_de: [MOD-011, MOD-004]`), critério: a verificação sai tipada do motor e o painel a lista sem parsing. **Só vale pra runs novas** — as linhas já gravadas nunca terão.
- Comparador/seletor de runs lado a lado → fora por D6; a rota já aceita `?runId=`, então é aditivo. Criar `docs/features/modelos/MOD-013-seletor-de-runs.md` (status: ideia, `depende_de: [MOD-011]`), critério: o painel lista as runs da partida e deixa abrir qualquer uma.
- Papéis/permissões (dono × assinante) → fora por D5; é `CORE-003` (`dados: ideia`), não esta feature.

## Evidências

- [código] `apps/api/scripts/persist-prognosis.ts:1` — o cabeçalho diz "métricas + textos + **auditoria (reasoning/prompt/saída crua)**": a persistência do dossiê é intencional, já existe.
- [banco] `match_prognosis` tem `reasoning` (text), `prompt_text` (text) e `raw_output` (jsonb) — **zero migração necessária**. Verificado em 2026-07-19: 17.282 e 26.035 caracteres de `reasoning` nos dois jogos da rodada 38 do BRA, `prompt_text` 75.242 e 69.120, `raw_output` não-nulo.
- [código] `apps/api/scripts/run-deepseek.ts:1` — cada run grava `report.html` + `dump.json` em `scripts/output/<matchId>/<stamp>/`: o relatório consolidado **já existe**, mas como artefato solto de script, fora do produto. Esta feature é trazer isso pra dentro.
- [código] `apps/api/scripts/run-deepseek.ts:134` — o schema de saída que **de fato grava no banco** exige só `["home", "away", "general", "best_bet", "drivers"]`: prova que a CoVe não é campo persistido e sustenta D4.
- [código] `apps/api/scripts/super-prognosis.ts:110` — emite `verificacao` como campo **tipado** e renderiza a tabela de vereditos (`:827-829`), mas **não chama `persistPrognosis`** (só `run-deepseek.ts:417` e o CLI de backfill chamam): é o molde pra um dia estruturar a CoVe, não uma fonte de dados existente.
- [wishlist] `docs/wishlist.md` → `W-066` — entrada de origem, promovida em 2026-07-19.

## Verificação

**API (P1) — provado 2026-07-19.** Instância isolada (`CLERK_SECRET_KEY="" PORT=3097 bun src/index.ts`, o guard tem escape hatch de dev) + `curl`. 5 casos:

| caso | esperado | obtido |
|---|---|---|
| run existente (Sport×Grêmio) | 200 + reasoning | 200, `reasoning` 25.049 chars |
| partida sem run (Mirassol×Flamengo) | `null` | `null` |
| match inexistente (uuid zerado) | 404 | 404 |
| `runId` de outra partida | `null`, não 500 | 200 + `null` |
| `runId` malformado | 422 | 422 |

**A5 (prompt não vaza) — provado 2026-07-19.** Campos do payload: `runId, model, reasoningEffort, runAt, reasoning, reasoningTokens, totalTokens, latencyMs`. `promptText` presente? **false**. `rawOutput` presente? **false**. Payload caiu de **106,9KB → 25,6KB** ao remover os dois. Grep em `apps/api/src` + `apps/web`: nenhuma referência a `prompt_text` fora de migrações/schema.

**Typecheck/lint — 2026-07-19.** `bun run typecheck` 3/3 verde após cada passo. `bun run lint` sem erros novos nos arquivos desta feature (warnings pré-existentes em `packages/ui` e `apps/api/scripts`).

**UI (P3/P4) — verificada pelo DONO, não pelo agente (2026-07-19).** O chrome-devtools MCP atacha numa instância limpa sem sessão Clerk; o app exige login (`proxy.ts` → 307 `/sign-in`) e não há `.env.e2e`, então o agente **não** conseguiu dirigir o browser. Quem validou foi o dono, no browser dele:

- **T3/T4 (golden path) — OK pelo dono** ("aqui deu certo", 2026-07-19), na versão final (Sheet 60%, só reasoning, sem cabeçalho de metadados). Cobre A3.
- **T2 (A2 — nenhuma request a `/audit` com o painel fechado) — provado por CÓDIGO, não observado em rede.** O revisor em contexto fresco confirmou dois níveis de garantia: `enabled: id.length > 0 && open` com `open` iniciando `false`, e o `SheetContent` do Radix nem monta o filho enquanto fechado (então a leitura de `data` sequer é avaliada). Sem prefetch em `apps/web/features/leagues`. **Falta a confirmação em Network.**
- **T5 (A4 — run com `reasoning` nulo) — NUNCA exercitado.** O nulo não existe naturalmente no dev (as 295 linhas têm `reasoning` preenchido), e o cenário exige fabricar por `UPDATE`. O código tem o branch; ninguém viu ele rodar.

## Gotchas que sobrevivem ao plano

Os gotchas de produto da wishlist (CoVe, público, múltiplas runs) viraram **D4/D5/D6** e não são mais questão aberta. O que continua valendo pro `/i`:

1. **Volume**: 75KB de prompt + 26KB de reasoning não cabem no payload padrão — peso em toda visita. É a razão da rota separada + carga sob demanda (D1); não "simplifique" juntando as rotas.
2. **Colunas nullable**: `reasoning`, `prompt_text` e `raw_output` não têm `.notNull()` (`apps/api/src/db/schemas/leagues.ts:630-632`) e o backfill engole prompt ausente (`persist-prognosis.ts:81`). Nulo é estado normal, não erro — é o P4.
3. **Texto de LLM não vira HTML**: `reasoning`/`prompt_text` são markdown gerado por modelo; renderizar via `dangerouslySetInnerHTML` é injeção (D2).
4. Rótulos em PT, campos/enums em inglês (regra do schema do prognóstico).
