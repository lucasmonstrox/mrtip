# MOD-011 — Prognóstico completo na página (reasoning, CoVe e prompt auditáveis) · dossiê de planejamento (2026-07-19)

Feature: [docs/features/modelos/MOD-011-prognostico-completo-auditavel.md](../features/modelos/MOD-011-prognostico-completo-auditavel.md)
Base: commit `840566f` (2026-07-03) — todo file:line deste doc vale neste commit.

> **Planejado sem `/rs`.** O dono mandou promover a wishlist direto pro `/pl` (2026-07-19). O terreno é raso e conhecido (o dado já está persistido e a superfície é 1 rota + 1 abertura de UI), então o custo foi baixo. O que o `/rs` acrescentaria de único é pesquisa externa (como o mercado audita motor de prognóstico) — baixo valor pra uma superfície interna de depuração, que a própria wishlist chama de "infra de depuração do motor". Registrado pra não ser re-proposto.
>
> **Atualizado 2026-07-19 (reconciliação):** as três decisões de produto que estavam como `[PENDENTE-DONO-1..3]` foram **respondidas pelo dono** e viraram **D4/D5/D6** na seção `## Plano` da feature. Não há mais pendência bloqueando o `/i`. O passo P4, que era o gating bloqueado, foi substituído pelo tratamento dos campos nullable (achado novo desta rodada). Ver §Decisões do dono.

## TL;DR

Expor, sob demanda, o dossiê completo de uma run do motor de prognóstico na aba Prognóstico da página da partida: raciocínio do modelo, prompt de evidências que ele recebeu e saída crua. **Nada de schema novo** — `match_prognosis` já persiste `reasoning`, `prompt_text` e `raw_output` a cada run. A decisão central é de **arquitetura de payload**: o dossiê pesa ~100KB por run e por isso NÃO pode entrar no `/matches/:id/prognosis` (que a aba carrega em toda visita) — nasce como rota irmã dedicada, consumida só quando o usuário abre o painel.

## Briefing — o que já foi falado e decidido

- **A exclusão da auditoria do payload atual foi DELIBERADA, não esquecimento** — `apps/api/src/modules/leagues/get-prognosis/get-prognosis.service.ts:10` diz literalmente "A auditoria pesada (reasoning," e a linha seguinte fecha com "prompt, saída crua) NÃO entra no payload". MOD-011 é a rota complementar; **não** é pra "consertar" o `getPrognosis` inchando a resposta dele.
- **A persistência da auditoria também foi deliberada** — `apps/api/scripts/persist-prognosis.ts:2` descreve a tabela como "métricas + textos +" e segue na linha 3 com "auditoria (reasoning/prompt/saída crua)". O dado já foi gravado esperando por esta feature.
- **Motivação concreta (dono, 2026-07-19)**: o bug de zona CONMEBOL ficou invisível porque não dava pra ler o prompt pela UI. O modelo cravou *under 2.5 @ 0,75* no Sport×Grêmio (real 0-4) porque o briefing dizia "Grêmio sem alvo continental" — leitura correta de um input errado. O valor da feature é **separar "o modelo errou" de "o dado que dei pra ele estava errado"**.
- **O uso primário é auditoria do dono, não leitura do apostador** (dono, 2026-07-19: "algo q precisa ser aberto") — reasoning cru é ferramenta de diagnóstico, e por isso fica atrás de uma **abertura explícita** (o painel), nunca renderizado por padrão na aba. Isso é sobre ergonomia e peso, **não** sobre permissão: quem pode ver ficou decidido em **D5** (sem gating — ver §Decisões).
- **Cobertura de competições é parcial pra time brasileiro** — a assinatura SportMonks não inclui Conmebol/Copa do Brasil, então `descanso`/densidade contam só Serie A. O dono decidiu **deixar o prompt como está por ora** (2026-07-19). Consequência pra esta feature: o painel vai exibir números que o dono SABE que são parciais — não inventar aviso de cobertura aqui sem decisão dele (seria contradizer a decisão acima).
- **Código/dado em inglês, só string de UI em português** (CLAUDE.md) — vale pros campos da rota nova.
- **`type`, nunca `interface`** (preferência explícita do dono).

## Estado do terreno

**dados — pronto, zero migração.** `apps/api/src/db/schemas/leagues.ts:575` define `match_prognosis`; as colunas de auditoria existem e estão populadas: `reasoning` (text, `leagues.ts:630`), `prompt_text` (text), `raw_output` (jsonb), mais `reasoning_tokens`/`total_tokens`/`latency_ms`. Verificado ao vivo (ver Evidências `[banco]`): 17.282 e 26.035 caracteres de `reasoning`; 75.242 e 69.120 de `prompt_text`.

**api — a rota irmã não existe.** `apps/api/src/modules/leagues/matches.routes.ts:70` registra `/:id/prognosis` → `getPrognosis`. O módulo é pasta-por-endpoint com um único `get-prognosis.service.ts` (não há `.schema.ts` — este endpoint não tem query params). O service pega a run **mais recente** (`orderBy(desc(matchPrognosis.runAt)).limit(1)`) e devolve `null` quando não há prognóstico, 404 quando o match não existe.

**ui — a aba existe, a abertura não.** `apps/web/features/leagues/components/match-detail/prognosis.tsx` renderiza a aba inteira e deriva o tipo do próprio hook (`type Prognosis = NonNullable<ReturnType<typeof useMatchPrognosisQuery>["data"]>`, linha 14) — padrão a repetir na query nova. O hook vive em `apps/web/features/leagues/hooks/data/queries/use-match-prognosis-query.ts` e chama via Eden (`api.v1.matches({ id }).prognosis.get()`).

**design system — o container já existe.** `packages/ui/src/components/sheet.tsx` (drawer lateral Radix). O `exports` do pacote é glob (`"./src/components/*.tsx"`, `packages/ui/package.json:41`), então importa direto sem mexer no mapa.

**runs múltiplas por partida são a norma, não exceção.** `apps/api/scripts/_batch-round.ts` roda N passes por jogo, cada um virando uma linha. E as runs **divergem de verdade**: ver Evidências `[banco]`.

## Mapa de dependências

**Features:**
- `MOD-004` ← dono do prompt vivo e de quem grava `match_prognosis`; qualquer mudança no schema de saída do motor muda o que este painel exibe.
- `MOD-006`, `MOD-010` ← compartilham a âncora `match_prognosis` (o INDEX.md marca a tabela como ⚠️ compartilhada); leem/escrevem a mesma linha.

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `apps/api/src/modules/leagues/matches.routes.ts` (rota nova, aditiva) | `apps/api/src/app.ts` (via `matchesRoutes`) | subir a API e bater nas rotas irmãs — a nova não pode alterar as existentes |
| `match_prognosis` (leitura nova, sem escrita) | `get-prognosis.service.ts`, `persist-prognosis.ts`, `run-deepseek.ts`, `backtest-prognosis.ts` | nenhum — leitura pura não muda o contrato de escrita |
| `prognosis.tsx` (componente alterado) | `match-detail.tsx` (aba Prognóstico) | aba Prognóstico continua renderizando sem o painel aberto |

Nenhum símbolo existente muda de assinatura: a feature é **aditiva** (rota nova + hook novo + componente novo, mais um gatilho dentro de `prognosis.tsx`). Por isso `codebase_impact` não tem alvo alterado relevante — o risco real está no peso do payload, não em callers.

## Blast radius e cuidados

- **Inchar o payload da aba por engano** — se o `/i` adicionar os campos de auditoria ao `getPrognosis` existente em vez de criar a rota irmã, TODA visita à aba passa a baixar ~100KB. Sintoma: aba Prognóstico lenta, `list_network_requests` mostrando resposta enorme em `/prognosis`. Detectar: medir o tamanho da resposta de `/prognosis` antes e depois (deve ficar igual).
- **`match_prognosis` é âncora compartilhada** (MOD-004/006/010) — esta feature só LÊ, mas se o `/i` for tentado a normalizar/reescrever colunas pra facilitar a exibição, quebra a escrita do `run-deepseek.ts`. Sintoma: run nova falhando ao persistir. Detectar: rodar `bun run scripts/run-deepseek.ts <matchId>` e conferir o "[ok] persistido".
- ~~Vazar reasoning pra usuário final~~ — **deixou de ser risco**: o dono decidiu público (2026-07-19). Fica como nota de produto, não como cuidado técnico.
- **XSS/markdown** — `reasoning` e `prompt_text` são texto gerado por LLM com muito markdown. Renderizar como HTML sem sanitizar é injeção. Cuidado: renderizar como **texto puro** (`<pre>`/`whitespace-pre-wrap`), não via `dangerouslySetInnerHTML`.

## Evidências

- [código] `apps/api/src/modules/leagues/get-prognosis/get-prognosis.service.ts:10` — "A auditoria pesada (reasoning, prompt, saída crua) NÃO entra no payload": prova que a exclusão é decisão consciente e que a rota nova é o caminho certo.
- [código] `apps/api/src/db/schemas/leagues.ts:630` — coluna `reasoning` já existe no schema: sem migração.
- [código] `apps/api/src/modules/leagues/matches.routes.ts:70` — ponto exato de registro da rota irmã, no mesmo padrão fino (1 rota → 1 service).
- [código] `apps/web/features/leagues/components/match-detail/prognosis.tsx:14` — o tipo é derivado do hook (`z.infer`-like via `ReturnType`); a query nova deve seguir o mesmo padrão em vez de declarar tipo à mão.
- [código] `packages/ui/src/components/sheet.tsx` — drawer já disponível no design system; não criar componente novo de overlay.
- [banco] query dev 2026-07-19 (`select length(reasoning), length(prompt_text), raw_output is not null from match_prognosis where match_id in (...)`) → 17.282/75.242 e 26.035/69.120, `raw_output` não-nulo — o dado existe e é grande; dimensiona o problema de payload. Re-seed gira uuids.
- [banco] query dev 2026-07-19 — Mirassol×Grêmio (`caa9ca04`) tem **2 runs** com apostas divergentes: `team_total over 1.5 @ 0.49` e `double_chance 1X @ 0.85`. Prova que "qual run mostrar" é decisão de produto real, não detalhe — decidida em **D6** (mais recente) com o custo aceito de a divergência não aparecer na UI.

## Pendências do dono — TODAS RESOLVIDAS (2026-07-19)

As três viraram decisões registradas no `## Plano` da feature (D4/D5/D6). Resumo, pra este doc não contradizer o plano:

- **CoVe: `reasoning` verbatim, sem parsing** (D4). As runs já gravadas não têm CoVe estruturada — o schema de saída do `run-deepseek.ts` exige só `[home, away, general, best_bet, drivers]` —, então a CoVe existe só como prosa dentro do `reasoning`. Estender o motor pra emitir `verificacao` tipada (molde do `super-prognosis.ts`) só valeria pra runs NOVAS. Fica fora de escopo.
- **Sem gating: painel na própria aba** (D5). O app inteiro já está atrás de login Clerk e **não existe sistema de papéis**, então "esconder do apostador" significaria construir papéis do zero — feature separada. Pagamos: qualquer usuário logado abre o painel e vê o prompt do motor.
- **Sempre a run mais recente** (D6), espelhando o `getPrognosis`. A rota já nasce com `?runId=` pra um seletor futuro não exigir refazer o contrato. Pagamos: com N passes por jogo, a divergência entre runs (ver Evidências `[banco]`) não aparece na UI.

**Nota de procedência**: o `## Plano` da feature foi editado fora desta sessão depois que eu o gravei — ganhou as decisões D4/D5/D6 e um passo P4 (estados vazios pras colunas nullable) que a minha versão não tinha. Verifiquei os claims novos antes de aceitar: as três colunas de auditoria são mesmo nullable (`leagues.ts:630-632`, nenhuma com `.notNull()`) e o backfill mesmo engole prompt ausente (`persist-prognosis.ts:81`). **Ressalva pro `/i`**: no banco de dev de 2026-07-19 as 295 linhas têm `prompt_text` e `reasoning` preenchidos — nenhum nulo natural existe hoje, o que confirma que o T5 precisa FABRICAR o nulo via `UPDATE` (não há caso real pra observar).

## Detalhes por passo

### §Contrato — shape da rota de auditoria

`GET /v1/matches/:id/prognosis/audit` (uuid no param, mesmo `paramId` já usado nas sub-rotas). Sem `runId` → run mais recente (mesmo critério do `getPrognosis`: `orderBy(desc(runAt)).limit(1)`). Com `?runId=<uuid>` → aquela run.

```
{ runId, model, reasoningEffort, runAt, reasoning, promptText, rawOutput,
  reasoningTokens, totalTokens, latencyMs }
```

`null` quando não há nenhuma run; 404 quando o match não existe (mesma semântica do irmão). Campos em inglês (regra do repo). Elysia no Workers: TypeBox (`t.Object`), **sem response schema**, `aot: false` — response schema aqui estoura 1101 no Workers.

### §Testes — roteiro chrome-devtools (cenários T1..T5)

Escada: erro/vazio primeiro, golden path por último.

- **T1 (vazio)** — partida SEM prognóstico. `navigate_page` numa partida sem run → `take_snapshot` na aba Prognóstico → assert: o gatilho do painel **não** aparece (ou aparece desabilitado com texto explicando), e nenhuma request pra `/audit` é disparada (`list_network_requests`).
- **T2 (aba intacta)** — partida COM prognóstico, painel FECHADO. `take_snapshot` → assert: aba renderiza como hoje; `list_network_requests` mostra `/prognosis` mas **nenhuma** chamada a `/audit` (prova que o payload pesado é sob demanda — o critério A2).
- **T3 (abertura)** — clicar o gatilho → `wait_for` o conteúdo → assert: o texto do prompt aparece (procurar uma âncora estável do prompt, ex. "Tabela e motivação"); `list_network_requests` agora mostra `/audit` com 200.
- **T4 (golden path)** — abrir na partida `2de0a06e` (Sport×Grêmio) e localizar no prompt a linha de motivação do Grêmio — é o caso que originou a feature; provar que dá pra auditar o briefing pela UI. Fechar com `list_console_messages` sem erro novo.
- **T5 (colunas nulas — cobre A4/P4)** — o nulo é caminho de código REAL (`persist-prognosis.ts:81` engole prompt ausente) mas **não existe dado que o exercite**: verificado em 2026-07-19, as 295 linhas de `match_prognosis` têm `prompt_text` e `reasoning` preenchidos. Por isso o cenário FABRICA o estado, em banco de dev:
  1. `docker exec mrtip_db psql -U mrtip -d mrtip_dev -c "update match_prognosis set prompt_text = null where match_id = '2de0a06e-4498-4a5e-8862-cd65642f9ff7'"`
  2. abrir o painel → assert: aparece a frase explicando que a run não guardou o prompt, **e o bloco de reasoning continua renderizando** (a ausência de um campo não derruba o outro — é o don't do P4)
  3. repetir zerando `reasoning` em vez de `prompt_text` → assert simétrico
  4. **reverter**: `bun run scripts/persist-prognosis.ts 2de0a06e-4498-4a5e-8862-cd65642f9ff7` (re-persiste do dump em `scripts/output/<matchId>/<stamp>/`, que continua no disco) — ou restaurar via nova run
  Assert negativo em todos: a string `null` **não** aparece na página e não há tela branca.

**Caveat obrigatório**: o chrome-devtools MCP não atacha quando o Chrome do dono está aberto. Se não atachar, **declarar** em vez de afirmar que a UI funciona.

## Plano executável

Ver seção `## Plano` de [docs/features/modelos/MOD-011-prognostico-completo-auditavel.md](../features/modelos/MOD-011-prognostico-completo-auditavel.md) — os passos NÃO são duplicados aqui.
