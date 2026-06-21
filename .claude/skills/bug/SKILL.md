---
name: bug
description: Caça forense de causa-raiz — triagem, features, git history, bisect, dependências, método científico. Use quando o usuário reportar um bug, erro ou comportamento errado e pedir investigação.
argument-hint: <descrição do bug ou ID da feature> [--fix]
allowed-tools: Bash(git log:*), Bash(git status:*), Bash(git blame:*), Bash(git show:*), Bash(git bisect:*), Bash(git diff:*), Bash(bun run features:*), Bash(bun test:*), Bash(bun why:*)
---

Investigue o bug: `$ARGUMENTS`

Regra de ouro: **evidência antes de teoria, reprodução antes de conserto, causa-raiz antes de patch.** Um sintoma conhecido pode ter causa nova — nunca conclua por pattern-match.

## Citação interna (vale pro relatório, diário e tudo que for persistido)

Achado interno cita fonte igual achado web cita URL — na **primeira menção** do fato:

- **Código**: `packages/core/src/money/index.ts:142` (path completo na 1ª menção; repetições podem encurtar). Em doc persistido, ancore com hash: `index.ts:142 @ 16a5030`.
- **Git**: hash curto + 1 frase do que prova. Commit culpado SEMPRE com hash, nunca "um refactor recente".
- **Banco/schema**: `tabela.coluna` + onde é definida (schema/migração). Bug de dado: cole a query que provou.
- **Doc interno**: path + seção.

Afirmação sobre o código sem uma dessas fontes = teoria, não achado.

## Estado do repo (injetado)

- Últimos commits: !`git log --oneline -15`
- Mudanças não commitadas: !`git status --short`
- Últimos bumps de deps: !`git log --oneline -5 -- bun.lock`

Isso já responde "o que mudou recentemente?" — a pergunta nº1 de toda regressão.

## 0. Triagem (responda ANTES de seguir — vá direto à rota indicada)

| Sinal | Rota |
|---|---|
| "funcionava antes" / pós-merge | §4 git timeline → bisect |
| visual / console / network no navegador | §3 + leia `.claude/skills/bug/devtools.md` antes de abrir o Chrome |
| HTTP 4xx/5xx, shape errado da API | §3 repro in-process + leia `.claude/skills/bug/bun.md` |
| assistente de IA responde errado (pick errado, sem fonte, alucinação) | §3 eval do motor (e §1: cheque o fluxo do dossiê→motor primeiro) |
| stack aponta `node_modules` / começou após bump | §5 dependência |
| dado de 1 registro/jogo só | §3 dado real (`row_to_json`) |
| log sumido, cache, HMR fantasma (web) | leia `.claude/skills/bug/web-next.md` |
| nada disso / intermitente | §6 método científico |

Não leia as seções nem os arquivos de apoio que a triagem descartou.

## 1. Colete o fato (antes de tocar em código)

- Erro/comportamento EXATO (mensagem literal, stack, screenshot do estado).
- **Quando começou?** Se já funcionou antes, é REGRESSÃO → a seção 4 (git) vira o caminho principal.
- Onde: qual página/rota/tool do assistente de IA, qual usuário/sessão, dado específico (jogo/liga) ou todos?
- **Checklist de premissas (30s, antes de qualquer hipótese):** (a) o arquivo que você edita é o que EXECUTA? — prove com `console.log("CANARY-"+Date.now())` na linha suspeita; não apareceu = bug de build/cache/porta, não de lógica; (b) porta certa? confira o banner do `bun run dev` (turbo TUI) — não chute 3000; (c) cache velho? `Remove-Item -Recurse -Force apps/web/.next` + restart e re-teste; (d) dado certo? re-seed gira os uuids da demo — id hardcoded inválido é classe "dado"; (e) env carregada? logue `process.env.X` no boot.
- **Passo zero — banco de padrões (30s):** grep do sintoma em `docs/investigacoes/`. Gotchas já pagos com sangue: HTTP 431 em localhost = cookie bloat do navegador (não é bug do app); chrome-devtools "browser already running" = matar o Chrome do profile; SocratiCode "travado" = instâncias MCP órfãs no Ollama — ferramenta quebrada se conserta ANTES de teorizar; divergência git com `.mcp.json` = quirk do rtk (use git.exe absoluto). Achou o padrão? Vira a hipótese nº1, a ser CONFIRMADA pela repro — nunca assumida.

## 2. Delimite o raio com o sistema de features

- Com ID: leia `docs/features/<modulo>/<ID>-*.md` → `ancoras:`; `bun run features lines <ID>` lista os commits e arquivos da feature.
- Sem ID: ache a(s) suspeita(s) pelo índice de âncoras do `docs/features/INDEX.md` (bug em value bet → quem toca `calcularEV`; bug em probabilidade → quem toca a função de calibração).
- Código movido/refatorado após o registro = pista de regressão por refactor: `bun run features lines <ID>` dá os arquivos que a feature tocou e `git log --follow <path>` rastreia o rename/move.
- SocratiCode: `codebase_symbols`/`codebase_search` → `codebase_flow` a partir do entrypoint canônico da superfície: web → o `page.tsx` da rota (fino, só importa a feature) em `apps/web`; api → o handler da rota backend; ia → a função de entrada do motor (consolidação do dossiê → quant/LLM → saída). Sintoma vago → `codebase_search` com `minScore` reduzido; app culpado já delimitado → repita com `fileFilter: "apps/web"` (etc.). Bug com cheiro de contrato/dado (coluna errada, shape divergente do dossiê) → confirme com `codebase_context_search` (schema do banco / specs).
- **É bug ou spec?** `codebase_context_search` com o sintoma — `./docs` INTEIRO está indexado. Comportamento que aparece como decisão documentada (gate, regra de negócio, regulação, faseamento do roadmap) não é bug: reporte como spec e aponte o doc (`docs/visao-geral.md`, `docs/arquitetura/`, investigações). Bug de resposta do assistente → cheque antes a investigação da feature de IA: hipóteses já testadas com veredito não se re-testam sem evidência nova.

## 3. Reproduza ANTES de teorizar

- Construa a **menor reprodução determinística** possível — um script/teste que sai 0 (bom) / 1 (ruim). Base pronta: copie `.claude/skills/bug/repro-template.ts` — já no formato que o `git bisect run` espera. Ela é seu detector pro resto da investigação (e vira o teste de regressão no final).
- **UI** → Chrome via `chrome-devtools` MCP seguindo a receita de `.claude/skills/bug/devtools.md` (snapshot → console → network → evaluate, nessa ordem).
- **API → repro in-process, não curl cego**: escreva a repro como teste que bate na rota/handler de verdade (quando existir uma camada de API com harness próprio, use-o; senão, importe o handler e invoque-o, ou `fetch` contra o dev server de pé). Asserte o shape E o efeito da resposta. Efeito que dispara DEPOIS da resposta (fire-and-forget) → assert com polling/espera, que curl não pega.
- **IA (assistente / motor quant/LLM)**: bug que você ainda não sabe scriptar → reproduza à mão pelo caminho real (UI do assistente ou um runner CLI do motor). Depois congele: clone o eval/caso mais próximo e mude só a variável do bug (o jogo, a fonte ausente, a odd). Separe a falha: o **dado do dossiê** já chega errado, o **quant** calibrou mal, ou o **LLM** explicou/citou errado? Cada um tem detector diferente.
- **Assistente "ignora" a correção / responde diferente entre 1ª e 2ª pergunta** → estado conversacional persistido (histórico/cache de contexto): limpe o estado antes de re-testar ou use uma sessão/thread nova por tentativa — senão você testa o cache, não o código.
- **Bug seletivo (1 jogo/registro sim, outros não) = provável bug de DADO**: capture a row REAL — `select row_to_json(t) from <tabela> t where id='<uuid>'` — e alimente a repro com ESSE json, nunca fixture bonita (falso-verde). Compare a row que quebra com uma que funciona: o campo divergente é a pista principal. Quando existir `packages/db`, olhe o dado ao vivo via `bun run db:studio` e relacionamentos via `bun run db:erd`.
- **Repro grande demais? Minimize por ddmin**: corte METADE (campos do JSON, turnos da conversa, rows do seed) e re-rode o detector 0/1. Ainda falha → descarte a metade removida; passou → devolva e corte a outra. Pare quando remover qualquer pedaço fizer o bug sumir — o resíduo é a assinatura da causa. Conversa com o assistente: minimize TURNOS primeiro, depois o texto.
- **Não reproduziu? Não conclua.** Reporte hipóteses ranqueadas com o que falta pra confirmar cada uma.

## 4. Linha do tempo no git (a arma principal em regressão)

- `git log --grep "\[<ID>\]" --oneline` — commits da feature suspeita (convenção do repo).
- **Pickaxe**: `git log -S "trecho do código" -p --reverse` — todo commit que adicionou/removeu o trecho, do mais antigo pro mais novo. Regex ou trecho que só se moveu dentro do arquivo → `-G "regex"`.
- `git blame -w -C -C -C <arquivo>` nas linhas suspeitas. Caiu num refactor? Blame de novo a partir do pai: `git blame <commit>^ -- <arquivo>`.
- Janela da regressão: `git log --oneline --since="<última vez que funcionou>" -- <paths suspeitos>`.
- Janela grande demais pra ler? **`git bisect`**: `git bisect start && git bisect bad && git bisect good <commit-bom>`, depois `git bisect run <script-de-repro>` (exit 0 = bom, 1 = ruim, 125 = pula commit). Termine com `git bisect reset`.
- Bug intermitente como detector do bisect: `bun test ./arquivo.test.ts --rerun-each 50` roda o arquivo 50× na mesma invocação — flaky de verdade falha em poucas iterações e sai com exit != 0, servindo direto de script pro `git bisect run`.
- Commit culpado achado → leia o diff INTEIRO dele (`git show <hash>`) e entenda POR QUE quebrou, não só o quê.

## 5. Bug de dependência (stack aponta node_modules, ou começou após bump)

- **Prior antes de tudo**: ranqueie hipóteses na ordem nosso código > nosso dado > nossa config (env/porta/cache) > dependência > runtime (Bun)/framework (Next) > ferramenta — e teste as baratas primeiro. Bun/Next 16 são jovens, então a exceção existe — mas exige repro isolada + a mensagem exata nas issues, nunca palpite.

1. `git log -p -- bun.lock | grep -B5 -A5 <pacote>` — quem subiu o quê, quando. Cruze com o início do sintoma.
2. `bun why <pacote>` — a cadeia inteira (quem pediu, range, dev/peer/prod, por workspace); versão duplicada/conflitante aparece aqui antes de ler o lockfile na mão. Aceita glob (`bun why "@elysiajs/*"`) e `--top`.
3. Confirme a culpa: downgrade pontual da versão anterior e re-rode a repro.
4. Leia o **changelog/releases** do pacote entre as duas versões (breaking change anunciado?).
5. Pacote alega "works on Node"? Cheque o mapa de compat Bun×Node (https://bun.com/docs/runtime/nodejs-apis) — suspeitos clássicos: `node:http` bufferiza request body (streaming/proxy quebram sutil), worker_threads incompleto, child_process sem socket por IPC. Confirme com a mesma repro em `bun x.ts` vs `node x.js` — divergiu = gap de runtime.
6. **Busque nas issues do GitHub do pacote**: a mensagem de erro exata entre aspas + nome do pacote (WebSearch). Issues abertas E fechadas + discussions. **Guarde o link de cada issue/comentário/PR que de fato ajudou** — entram no relatório e no registro da feature.
7. Repro mínima FORA do app (script isolado só com o pacote) separa "bug nosso de uso" × "bug deles".
8. Docs atuais via context7 (`resolve-library-id` → `query-docs`) — a API pode ter mudado de contrato sem ser bug.
9. Saídas, em ordem de preferência: corrigir nosso uso > fixar versão/`overrides` na raiz (com comentário do porquê + link da issue) > workaround local. Bug inédito deles → propor reportar upstream.

## 6. Método pro caso difícil (nada óbvio apareceu)

- **Diário de investigação obrigatório**: tabela viva `hipótese | experimento | resultado | veredito`. Hipótese REFUTADA fica registrada com a evidência que a matou — no formato de citação interna (`arquivo:linha`, hash ou `tabela.coluna`+query), nunca só "testei e não era"; proibido re-testá-la sem evidência nova. Releia a tabela antes de cada experimento; ela entra no relatório como trilha de auditoria.
- **Cada experimento responde UMA pergunta binária**, escrita ANTES de rodar ("o cents já chega errado no service? S/N"). Se você não sabe de antemão o que cada resultado possível PROVA, o experimento está mal desenhado. Proibido "rodar e ver" com 15 logs.
- **Wolf Fence (busca binária no ESPAÇO)**: bug de valor errado sem stack → desenhe o fluxo (ex.: ingestão da fonte → consolidação do dossiê → motor quant/LLM → resposta na UI), ponha UM detector no ponto médio (`console.log(JSON.stringify(valor))` ou `if (!cond) throw new Error("FENCE")`), rode a repro 1× e pergunte: o dado JÁ está errado aqui? Sim → a montante; não → a jusante. Mova a cerca pro meio da metade culpada — log₂(n) iterações localizam o estágio. Um detector por rodada.
- **Onde o erro APARECE ≠ onde NASCE**: a linha que explodiu costuma ser a primeira VÍTIMA de um dado podre (NaN, null, cents com vírgula, odd/probabilidade malformada, uuid de jogo de outra liga). Não conserte ali: ande pra trás escritor por escritor (`codebase_symbol` em quem produz o campo + Wolf Fence sobre o DADO) até o último ponto onde o valor estava CERTO. O patch vai no primeiro escritor errado; guard na cena do crime é defesa-em-profundidade, nunca o fix. No relatório: linha do sintoma e linha da origem são dois `arquivo:linha` distintos.
- **Heisenbug**: o bug sumiu quando você adicionou um log/await? NÃO declare vitória — reclassifique como timing/race. Observe sem deformar: acumule eventos num array (`trace.push({t: performance.now(), tag, valor})`) e despeje TUDO num log só no fim. Caça dirigida: promise sem await no caminho (`.then(` solto) e dois consumidores do mesmo evento (webhook duplicado, listener 2×). Prova: a repro precisa falhar/passar deterministicamente DEPOIS do fix, com e sem os logs. (Race de rede no browser: ver `.claude/skills/bug/devtools.md` — throttling alarga a janela até virar determinística.)
- **Timebox**: 15 min na mesma hipótese sem evidência NOVA → pare e escreva o "pedido de ajuda" no diário (sintoma literal, repro, o que cada teste provou, a pergunta aberta). Esse texto vira a query do WebSearch com o erro entre aspas, ou o relatório parcial com hipóteses ranqueadas.
- **Hipóteses independentes (≥2)** → dispare um subagente Explore POR HIPÓTESE em paralelo, cada um com o experimento que pode REFUTÁ-LA, devolvendo só: veredito (refutada/sobreviveu) + evidência `arquivo:linha` + commit. Arqueologia pesada (ler N diffs candidatos) também vai pra subagente — o contexto principal recebe só o hash culpado.
- Mude **uma variável por vez**; instrumentação temporária é legítima — e é REMOVIDA antes de entregar.

## 7. Diagnóstico (formato fixo do relatório)

Abra com 3 linhas: **CAUSA** (`arquivo:linha`) · **COMMIT culpado** (hash + 1 frase do porquê) · **CONSERTO** proposto (1 frase) — quem lê decide em 10 segundos se aprova o `--fix`. Depois:

1. **Causa-raiz** com evidência: `arquivo:linha` (sintoma E origem, se distintos), e em regressão o **commit que introduziu**.
2. **Por que foi possível** (1 nível de "por quê?" acima do patch — falta de teste? contrato implícito? gap de schema?).
3. **Reprodução**: como disparar, como provar que sumiu. **Prova por toggle (pré-requisito pra declarar causa-raiz)**: repro com o patch → passa; `git stash` → DEVE voltar a falhar; `git stash pop`. Não voltou a falhar sem o patch = você não provou a causa. Bug que "sumiu sozinho" NUNCA é encerrado como consertado: classifique como heisenbug/dado e registre o que falta pra reproduzir.
4. **Raio de impacto**: `bun run features impact <ID>` + `codebase_impact` no símbolo → o que re-testar.
5. **Patch mínimo proposto** + teste de regressão.
6. Classificação: regressão | latente | dado | config | dependência.
7. **Evidências** (duas listas, só o que SUSTENTOU o diagnóstico, 1 linha cada):
   - **Internas**: `arquivo:linha` (sintoma e origem), hash do commit culpado e dos lidos na arqueologia, `tabela.coluna`/query de bug de dado, doc+seção quando o veredito foi "spec, não bug".
   - **Externas**: links (issue/PR/changelog/doc).

## 8. Conserto

- Por padrão **reporte e proponha** — não aplique. Aplique apenas com `--fix` em `$ARGUMENTS` (ou pedido em seguida).
- Ao corrigir: escreva o teste de regressão PRIMEIRO (vermelho) → patch mínimo → verde; re-rode a repro original e a lista do `impact`; atualize o arquivo da feature (`testes:` referencia a repro com path E o hash do commit do fix; a seção **Evidências** ganha as DUAS listas do relatório — internas (`arquivo:linha @ hash`, commit culpado, `tabela.coluna`) e externas (links) — com 1 linha do que cada uma prova; `atualizado:`); workaround de dependência leva comentário com o link da issue no código; `bun run features check && build`; proponha commit `fix(<modulo>): <causa, não sintoma> [<ID>]`.
- Após repro verde + lista do `impact`: invoque a skill `verify` (Skill tool) pra validar o fluxo completo no app real (browser → API → dado → resposta), não só o corte da repro. Skill indisponível na sessão → diga isso explicitamente.
- Fechou bug com gotcha não-óbvio? Alimente o banco de padrões: 3 linhas em `docs/investigacoes/` ou no arquivo da feature — a próxima caçada começa do passo zero. Das 3 linhas, pelo menos 1 é fonte interna no formato de citação (`arquivo:linha @ hash`, hash do fix, ou `tabela.coluna`); gotcha sem fonte não entra no banco.
