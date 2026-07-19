---
id: MOD-011
titulo: Prognóstico completo na página — reasoning, verificação (CoVe) e prompt de evidências auditáveis
modulo: modelos
status: em-andamento # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1 # P1 | P2 | P3
facetas: # só as superfícies que se aplicam; mesma escala do status
  api: planejado # rota dedicada que devolve o payload pesado de auditoria
  ui: planejado # abertura (drawer/modal) na aba Prognóstico
testada: nao # nao | parcial | sim
testes: [] # evidências: "E2E Chrome 8/8 (2026-06-18)", scripts, asserts no banco
depende_de: [MOD-004] # o prompt vivo e a match_prognosis que ele persiste
impacta: [MOD-004, MOD-006, MOD-010]
ancoras: # pontos compartilhados que ESTA feature toca
  settings: []
  tabelas: [match_prognosis] # ⚠️ compartilhada com MOD-004/MOD-006/MOD-010
  tools: [] # ferramentas do assistente de IA
  funcoes: []
  rotas: ["/matches/:id/prognosis"] # a rota de auditoria nasce ao lado desta
docs: [docs/planos/MOD-011-prognostico-completo-auditavel.md]
verificado_em: null # data, obrigatório quando status: verificado
atualizado: 2026-07-19
---

# Prognóstico completo na página — reasoning, verificação (CoVe) e prompt de evidências auditáveis

## Descrição

Hoje a aba Prognóstico mostra só o **produto final** do motor: best bet, xG total e por faixa de 15', 1x2 do jogo/1ºT/2ºT, BTTS, drivers e impacto de desfalques. Fica invisível **como o modelo chegou lá** — o raciocínio (17k–26k caracteres por jogo), as perguntas de verificação adversariais (CoVe) com os vereditos ✓/~/✗ e o que elas fizeram ele revisar, e o **prompt de evidências inteiro** (~70–75KB: tabela pré-jogo, motivação de zona, forma qualificada, consistência, desfalques, clima, viagem, base rate Poisson/Dixon-Coles).

Pra quem: o **dono do motor** (auditoria/depuração) — reasoning cru é ferramenta de diagnóstico, não leitura de apostador. Isso define a ergonomia, **não** a permissão: o painel fica atrás de uma abertura explícita (não pesa nem polui a aba), mas sem gating por papel — ver D5. Comportamento esperado: na aba Prognóstico, uma abertura (drawer) que carrega sob demanda e mostra o dossiê completo daquela run, permitindo responder "por que ele cravou essa aposta?" e "o briefing que ele recebeu estava certo?".

Motivação concreta (o caso que originou a feature, 2026-07-19): no **Sport 0-4 Grêmio** (rodada 38 do BRA 2025) o motor cravou *under 2.5 a 75%* e o jogo teve 4 gols, 0-3 já no intervalo. Pela saída estruturada parecia erro de leitura do modelo; abrindo o prompt, o briefing afirmava "Grêmio salvo e **sem alvo continental alcançável** → motivação baixa", quando o Grêmio entrou 11º **dentro da zona de Sudamericana, precisando vencer**, com 4 concorrentes a ≤2 pontos. O modelo leu certo um input errado. **Sem ver o prompt, o bug era invisível** — e contaminava toda avaliação de acerto/erro do motor.

## Tarefas

- [x] P1 api — service + rota `/matches/:id/prognosis/audit` registrada
- [ ] P2 ui — hook de query sob demanda (não dispara sem abrir)
- [ ] P3 ui — painel (Sheet) com prompt + reasoning em texto puro
- [ ] P4 ui — estados vazios: run sem `reasoning`/`promptText` (colunas nullable)

## Plano (2026-07-19)

Dossiê: [docs/planos/MOD-011-prognostico-completo-auditavel.md](../../planos/MOD-011-prognostico-completo-auditavel.md)

### Objetivo, aceite e non-goals

"Pronto" = numa partida com prognóstico, consigo abrir um painel na aba Prognóstico e ler o **prompt de evidências** e o **raciocínio** daquela run, sem que isso pese na visita normal à aba.

Non-goals (todos decididos pelo dono em 2026-07-19 — ver §Decisões D4/D5/D6, não são pendências): parsing de CoVe em lista ✓/~/✗ — o painel mostra o `reasoning` **verbatim** e ponto; comparador de runs lado a lado — mostra sempre a mais recente, e a rota já aceita `?runId=` pra não travar depois; gating por papel/flag — não existe sistema de papéis e o app inteiro já exige login; reformatar/embelezar o prompt (é texto de diagnóstico, fidelidade > estética); qualquer aviso de cobertura parcial de competições (o dono decidiu manter o prompt como está em 2026-07-19).

Aceite:
- A1 [api] `GET /v1/matches/:id/prognosis/audit` devolve `reasoning`/`promptText`/`rawOutput` da run mais recente; `null` sem run; 404 em match inexistente → coberto por P1
- A2 [ui] com o painel FECHADO, nenhuma request a `/audit` é disparada (o peso é sob demanda) → coberto por P2, provado em T2
- A3 [ui] abrindo o painel na partida `2de0a06e`, encontro no prompt a linha de motivação do Grêmio — o caso que originou a feature → coberto por P3, provado em T4
- A4 [ui] run com `reasoning`/`prompt_text` nulos (colunas são nullable) mostra estado vazio explícito, não tela branca nem "null" na página → coberto por P4, provado em T5

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
- Adiadas de propósito pro `/i`: nome exato do gatilho do painel, largura do Sheet, copy dos rótulos.

### Passos

**P1 [api] esqueleto** — criar `apps/api/src/modules/leagues/get-prognosis-audit/get-prognosis-audit.service.ts` + `.schema.ts` (query `runId` opcional) e registrar a rota em `apps/api/src/modules/leagues/matches.routes.ts` (ao lado da linha 70). Shape e semântica: dossiê §Contrato. Regras: pasta-por-endpoint (`<verbo>-<substantivo>/` com `*.service.ts` + `*.schema.ts`); `matches.routes.ts` fica FINO (1 rota → 1 service, zero regra de negócio); Elysia no Workers = **TypeBox** (`t.Object`), **sem response schema**, `aot: false`; `type`, nunca `interface`; campos em inglês. Don't: não tocar em `get-prognosis.service.ts` (a exclusão da auditoria lá é intencional); não fazer `select *` da tabela e devolver cru (expõe colunas que o front não usa e acopla ao schema); não escrever nada em `match_prognosis` (âncora compartilhada com MOD-004/006/010 — esta rota é leitura pura); não repetir a resolução de match (reusar `getMatchRow` do `../shared/shared`, como o irmão faz). Prova: `cd apps/api && bun run dev` e `curl -s localhost:3001/v1/matches/2de0a06e-4498-4a5e-8862-cd65642f9ff7/prognosis/audit | head -c 200` → JSON com `promptText` não vazio; `curl -s -o /dev/null -w "%{http_code}" .../00000000-0000-0000-0000-000000000000/prognosis/audit` → `404`.

**P2 [ui] query sob demanda (depende: P1)** — criar `apps/web/features/leagues/hooks/data/queries/use-match-prognosis-audit-query.ts` no molde do `use-match-prognosis-query.ts`, com `enabled` amarrado ao estado de aberto (não só ao `id`). Regras: folder-by-feature (`hooks/data/queries/`), kebab-case sem sufixo redundante, `services/` é o único lugar com fetch — aqui o fetch é via Eden como o irmão; tipo derivado do hook (`ReturnType`), não declarado à mão; proibido importar de outra feature. Don't: não deixar `enabled: id.length > 0` (dispara sozinho e mata o A2 — o ponto inteiro da feature é ser sob demanda); não usar o mesmo `queryKey` do prognóstico normal (colide no cache); não fazer `prefetch` "pra ficar rápido". Prova: com o painel fechado, `list_network_requests` no Chrome sem nenhuma chamada a `/audit` (cenário T2 do dossiê §Testes).

**P3 [ui] painel (depende: P2)** — novo `apps/web/features/leagues/components/match-detail/prognosis-audit.tsx` usando `Sheet` de `@workspace/ui/components/sheet`, acionado por um gatilho dentro de `prognosis.tsx`; mostra `promptText` e `reasoning` em blocos de **texto puro** com `whitespace-pre-wrap` e rolagem própria. Regras: componente vira pasta só quando tiver subcomponentes (por ora arquivo solto); `type` não `interface`; strings de UI em português. Don't: **não** usar `dangerouslySetInnerHTML` nem passar o texto por markdown-to-HTML (D2 — é texto de LLM, vetor de injeção); não truncar/reformatar o prompt (o valor é auditar o que o modelo REALMENTE recebeu); não renderizar os ~100KB sem container rolável próprio (trava a página); não montar o conteúdo quando o Sheet está fechado. Prova: cenários T3 e T4 do dossiê §Testes → o prompt aparece e a linha de motivação do Grêmio é localizável na partida `2de0a06e`.

**P4 [ui] estados vazios (depende: P3)** — em `prognosis-audit.tsx`, tratar os três nulos possíveis da run: sem `reasoning`, sem `promptText`, e run inexistente (payload `null`). Cada bloco ausente vira uma linha explicando o porquê em português ("esta run não guardou o prompt"), não um bloco em branco. Regras: strings de UI em português, campos em inglês; `type`, nunca `interface`. Don't: não usar `?? ""` e renderizar bloco vazio (o dono não distingue "não guardou" de "guardou vazio" — é exatamente o tipo de ambiguidade que a feature existe pra matar); não jogar o painel inteiro fora quando só um dos dois campos é nulo (se tem prompt e não tem reasoning, mostra o prompt); não tratar nulo como erro de rede (não é falha — é run antiga); não usar `!` pra calar o TypeScript nas colunas nullable. Prova: cenário T5 do dossiê §Testes → `UPDATE match_prognosis SET prompt_text = NULL WHERE id = '<run de teste>'` num banco de dev, abrir o painel → a mensagem aparece e o bloco de reasoning continua renderizando; reverter o UPDATE depois.

### Verificação final

- `bun run typecheck` limpo (raiz) e `bun run lint` sem erros
- **API** (P1): script/`curl` contra o dev server — casos: run existente (200 + `promptText` não vazio), match sem prognóstico (`null`), match inexistente (404), `?runId=` inválido (não derruba a rota), run com `prompt_text` nulo (200 com campo `null`, não 500). Não existe runner de unidade no repo — não inventar `bun test`.
- **Browser real (chrome-devtools MCP)** — teste PRIMÁRIO: roteiro completo no dossiê §Testes, cenários **T1..T5** (vazio → aba intacta → abertura → golden path → run sem prompt), fechando com `list_console_messages` sem erro novo e `list_network_requests` sem falha. **MCP não atacha com o Chrome do dono aberto → declarar explicitamente**, nunca afirmar que a UI funciona.
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

_(preencher quando status=verificado: como foi provado — E2E no Chrome, chamada ao motor de IA, assert no banco, request à API)_

## Gotchas que sobrevivem ao plano

Os gotchas de produto da wishlist (CoVe, público, múltiplas runs) viraram **D4/D5/D6** e não são mais questão aberta. O que continua valendo pro `/i`:

1. **Volume**: 75KB de prompt + 26KB de reasoning não cabem no payload padrão — peso em toda visita. É a razão da rota separada + carga sob demanda (D1); não "simplifique" juntando as rotas.
2. **Colunas nullable**: `reasoning`, `prompt_text` e `raw_output` não têm `.notNull()` (`apps/api/src/db/schemas/leagues.ts:630-632`) e o backfill engole prompt ausente (`persist-prognosis.ts:81`). Nulo é estado normal, não erro — é o P4.
3. **Texto de LLM não vira HTML**: `reasoning`/`prompt_text` são markdown gerado por modelo; renderizar via `dangerouslySetInnerHTML` é injeção (D2).
4. Rótulos em PT, campos/enums em inglês (regra do schema do prognóstico).
