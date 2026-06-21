# Matriz de verificação por superfície (apoio do §4 da skill /i)

A prova é tipada pela superfície que o diff tocou. Identifique as superfícies (frontmatter `facetas` + paths do diff) e execute a linha de cada uma. Typecheck/lint verde não fecha faceta nenhuma sozinho.

Nem toda camada existe ainda no repo (hoje há `apps/web` + `packages/{ui,...}`; `apps/api`, camada de IA e persistência crescem conforme as features). Faceta cuja infra ainda não existe → a feature que a CRIA traz a forma de prova junto; até lá, prove pela superfície que de fato roda. Confirme a **porta real** no banner do `bun run dev` (turbo TUI) antes de qualquer navegação.

| Superfície | Prova obrigatória (comando literal) |
|---|---|
| **ui** | Chrome via `chrome-devtools` MCP (receita detalhada: `.claude/skills/bug/devtools.md` — snapshot → console → network → evaluate): `navigate_page` → `take_snapshot` → interagir **como um usuário humano faria** (click/fill no golden path inteiro) → `list_console_messages` (zero error/warn novos) → `list_network_requests` (zero fetch/xhr falhando). Porta REAL no banner do `bun run dev`. MCP indisponível? Diga isso explicitamente — não afirme que funciona. |
| **api** | Exercite a rota/handler de verdade, não só o tipo: teste in-process (ou `fetch`/script bun contra o dev server de pé) que bate na rota e assevera o shape e o efeito da resposta. **Teste que só assevera sobre mock NÃO conta como prova.** Efeito disparado DEPOIS da resposta (fire-and-forget) → assert com polling/espera, que uma checagem síncrona não pega. (Quando existir uma camada de API dedicada com harness próprio, esta linha aponta pra ele.) |
| **dados** | Assert no banco real, nunca "olhei no studio": script bun ad-hoc com query explícita e assert com exit 0/1, restaurando o estado alterado no `finally`. **Fato sobre dado de pick/odds/histórico** → cole a query + a data (re-seed gira os uuids da demo; não asserte sobre id hardcoded antigo). Schema novo → prove cada fase: expand com `SELECT` da coluna; migrate com query de backfill verificada ANTES do contract. (Camada de persistência ainda não existe? A feature que a introduz define o comando exato aqui.) |
| **ia** | O assistente/motor é provado pela SAÍDA, não pelo "rodou": script/eval que exercita o motor com um caso real e assevera o contrato do produto — **todo pick/insight traz justificativa + as fontes que o sustentam** (princípio "sempre mostra o porquê", `docs/visao-geral.md` §5). Separe as duas camadas: **quant** (probabilidade) verifica-se por **calibração/sanidade numérica** (a prob. soma 1, fica em faixa plausível, bate com o resultado em backtest); **LLM** (explicação) verifica-se por aderência às fontes do dossiê — não por "soou confiante". Resposta que cita fonte inexistente ou inventa número = falha, não detalhe. |
| **core** | `cd packages/core && bun test` (não existe task `test` no turbo raiz). Lógica pura nova (dinheiro/odds/EV, datas, cálculo de calibração) entrou SEM `*.test.ts` ao lado = §3 foi violado — volte e escreva. Dinheiro sempre via `@workspace/core/money` (centavos). |

## Escada de cenários até o golden path

Distinção que importa: **happy path** = qualquer fluxo sem erro (uma feature tem vários); **golden path** = O fluxo canônico pelo qual a feature existe — o que se demonstra pro dono e não pode quebrar nunca. Todo golden path é happy path; o inverso não.

A verificação sobe em escada, na ordem:

1. **Cenários de erro/validação** que a feature introduziu (input inválido, gate negando, estado proibido) — prove que o sistema RECUSA certo, com a mensagem/efeito esperado.
2. **Variantes e bordas** (caminhos alternativos: com/sem campo opcional, jogo sem odds ainda, time sem dados de lesão, toggle off) — os happy paths secundários que o diff tocou.
3. **Golden path E2E por último**, como prova de fechamento: o fluxo principal inteiro, na superfície real (Chrome pra ui, pergunta real ao assistente pra ia, request→banco pra api) — é ele que fecha a faceta.

Com `## Plano`, mapeie cada degrau aos critérios A1..An; sem Plano, derive os degraus da Descrição+Tarefas. Pular os degraus 1-2 e ir direto ao golden path = prova incompleta: passou no caminho feliz e ninguém viu os erros. Rodar só os degraus 1-2 = nunca provou que a feature serve pro fluxo que importa.

## Sempre, por cima da matriz

- `bun run typecheck` (+ `bun run lint` se a mudança foi larga) — cole o exit/resumo no relato.
- Re-teste a lista do `bun run features impact <ID>` (guardada no Pré-voo) + callers do `codebase_impact` dos símbolos ALTERADOS.
- Red flags que invalidam o relato: "deve funcionar", "provavelmente", "parece que", "testei mentalmente". Prova é output colado, contagem, screenshot, saída exata do assistente — nunca adjetivo.

## Último passo SEMPRE: revisor em contexto fresco

Dispare um subagent (Agent tool, contexto limpo de propósito — quem fez o trabalho não é quem dá a nota) com:

- **Insumos**: o diff completo (`git diff` + arquivos novos), os critérios A1..An do `## Plano` (sem Plano: Descrição + Tarefas do arquivo da feature), e os paths que o Plano declarou.
- **Pergunta**: cada An está implementado e provado? Há requisito do arquivo da feature sem cobertura no diff?
- **Contrato de saída**: reporta SÓ gap de requisito/corretude — não estilo. Diff tocando path fora dos declarados no Plano = achado. Nenhum gap = dizer "nenhum gap" explicitamente.
- Achado do revisor → ou corrige agora, ou vira tarefa aberta declarada no arquivo da feature — nunca silêncio.
