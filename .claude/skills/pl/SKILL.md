---
name: pl
description: Cria o plano de codificação de uma feature do docs/features — briefing + dossiê (evidências, dependências, blast radius) em docs/planos + seção ## Plano executável → status planejado. Use quando o usuário pedir pra planejar uma feature, montar o plano de codificação, ou disser "/pl <ID>".
argument-hint: <ID da feature> [restrições/observações]
---

Monte o **plano de codificação** da feature: `$ARGUMENTS`

O `/pl` é a ponte entre `/rs` (o que fazer e por quê) e `/i` (fazer). **Não implementa nada** — os entregáveis são DOIS, em altitudes diferentes:

1. **Dossiê** em `docs/planos/<ID>-<slug>.md` — TUDO que o planejamento encontrou: briefing, evidências, mapa de dependências, blast radius, cuidados. É o documento de consulta. Esqueleto em [templates/dossie.md](templates/dossie.md).
2. **Seção `## Plano`** no arquivo da feature — o outline executável (passos + Provas) que o `/i` segue. Curto por design; referencia §§ do dossiê pra detalhe. Template literal em [templates/plano.md](templates/plano.md).

O teste de qualidade: **um `/i` rodando em sessão NOVA, sem nenhum contexto desta conversa, executa sem re-decidir nada**. Isso implica: tudo por path+símbolo no `## Plano` e nos passos (número de linha apodrece como INSTRUÇÃO); no dossiê, achado interno é EVIDÊNCIA e segue as Regras de citação interna do §4 — file:line, pinado pelo commit do cabeçalho; shapes/assinaturas relevantes colados, gotchas da área repetidos inline (não só linkados).

## 1. Gate e proporcionalidade

- Leia `docs/features/<modulo>/<ID>-*.md` + TODOS os `docs:` vinculados. Recomendação cravada em investigação/arquitetura **manda** — o plano detalha, não re-decide.
- `feito`/`verificado` com tarefas fechadas → não planeje por cima: reporte o estado e pergunte (mesmo gate do `/i`).
- `status: planejado` SEM seção `## Plano` (estado comum — o status veio de "arquitetura cravada") → **alvo legítimo**: a arquitetura é insumo, o `/pl` adiciona os passos executáveis.
- Sem investigação e com decisão de produto em aberto → sugira `/rs <ID>` primeiro. Se o dono mandar seguir mesmo assim: registre o bloqueio no topo do dossiê e enumere `[PENDENTE-DONO-N]` (um por decisão que o `/rs` teria resolvido) — nunca escolha silenciosa. Planejar sem `/rs` custa caro: boa parte do esforço vira investigação improvisada dentro do plano.
- **ID de wishlist (`W-NNN`) sem arquivo em `docs/features/`** → não assuma inexistente nem crie do zero: `grep -rln "W-NNN" docs/planos docs/investigacoes docs/features` + busca por título similar — entrada órfã já promovida sob outro ID é comum. Achou o ID real → o gate roda sobre ELE, e a wishlist ganha pendência de `promovido:`.
- `depende_de` abaixo de `feito` → o plano abre declarando o bloqueio. Se der pra planejar por cima com stub, o stub vira **passo P0 explícito** ("P0: stub de X porque DOS-001 não está feito") + nota no topo do Plano liberando o gate do `/i` ("bloqueio de <ID> tratado por design via P0") — senão o hard-stop do `/i` rejeita o plano.
- **Proporcionalidade** (planejar é overhead): diff descrevível em 1 frase, ≤2 arquivos, sem decisão técnica real nem schema → **plano-mini**: Objetivo + 1-3 passos com Prova + Verificação; demais seções viram `n/a` em 1 linha; dispensa dossiê. O formato completo é teto, não piso — não infle seção vazia.

## 2. Briefing — o que JÁ foi falado e decidido (antes de qualquer mapeamento)

A feature raramente nasce no `/pl`: quase sempre há decisões anteriores espalhadas. Colete-as PRIMEIRO — decisão já tomada que o plano contradiz por ignorância é o pior modo de falha do `/pl`. Fontes, na ordem:

- **Esta conversa**: o que o dono pediu/restringiu/vetou em turnos anteriores (inclusive o texto livre depois do ID em `$ARGUMENTS`).
- **Memória do projeto**: memórias recuperadas sobre o tema — decisões do dono ("decisão de tooling = protótipo comparativo", vetos de copy), gotchas conhecidos da área, futureScopes relacionados. Memória cita arquivo/flag → confirme que ainda existe antes de usar.
- **Arquivo da feature**: Descrição, Evidências, Tarefas já escritas e `docs:` vinculados.
- **Docs da área**: índice doc→features do INDEX.md (investigações vizinhas), `docs/arquitetura/` que cravou direção, `ROADMAP.md`/backlogs citados.
- **Git**: `git log --grep "\[<ID e IDs vizinhos>\]" --oneline` — o que já foi feito na área e as decisões que moram nos commits.

Tudo que entrar no briefing leva fonte (path, memória, commit, "dono nesta conversa") — vai pra seção Briefing do dossiê. Conflito entre fontes (doc diz X, dono falou Y depois) → vira `[PENDENTE-DONO]`, não escolha silenciosa.

## 3. Mapeie o terreno (reusar antes de re-descobrir)

- **PRIMEIRO extraia do doc do `/rs`/arquitetura** o que ele já entrega: plano por faceta, modelo de dados, paths, riscos, gotchas. SocratiCode entra só pra (a) **validar que paths/símbolos citados ainda existem** (docs envelhecem) e (b) cobrir o que o doc não mapeou.
- Nos gaps: `codebase_search`/`codebase_symbols` pros pontos de inserção → `codebase_graph_query` nos arquivos-alvo → **`codebase_impact` em cada símbolo que será ALTERADO** (callers = re-teste obrigatório).
- **Greenfield (nenhum símbolo existente a alterar)**: a cadeia muda de alvo — `codebase_search` pelo PRECEDENTE (feature verificada com a mesma forma, pra copiar a estrutura em vez de inventá-la) em vez de impacto; `codebase_impact` não se aplica e não deve ser forçado.
- **Desconfie do oráculo no silêncio**: `codebase_impact` devolvendo "sem consumidores" pra símbolo plausivelmente usado é suspeito (falso negativo por barrel export) — confirme por leitura direta/grep antes de gravar. SocratiCode fora do ar → degrau declarado no dossiê (LSP → grep multi-variante), nunca cobertura fingida.
- **Todo path/símbolo citado no INSUMO (wishlist, pedido, memória) é hipótese, não fato** — valide contra o repo antes de citar. Doc e memória envelhecem, e path que "obviamente existe" às vezes não existe.
- `codebase_context_search`: o schema atual suporta ou precisa de migração? Colunas/tabelas exatas.
- `bun run features impact <ID>` + índice de âncoras do INDEX.md: âncora compartilhada alterada → consumidores entram na Verificação.
- `git log --oneline -10 -- <paths da área>`: trabalho recente que o plano precisa respeitar. Plano antigo sendo refeito → reconcilie com os commits desde `atualizado:` antes de reescrever.

## 4. Escreva o dossiê — `docs/planos/<ID>-<slug>.md`

Leia [templates/dossie.md](templates/dossie.md) e preencha. Regras de conteúdo:

- **Referencie código por path+símbolo, nunca re-descreva a lógica em prosa** — prosa duplicada apodrece e o `/i` reimplementa o que já existe.
- **Regras de citação interna** (achado sobre o próprio repo é evidência igual a URL na web):
  - **Pino temporal**: abaixo do título do dossiê, 1 linha `Base: commit \`abc1234\` (AAAA-MM-DD)` (`git rev-parse --short HEAD`). Todo file:line do doc vale NESSE commit.
  - **Código**: na PRIMEIRA menção de cada fato, `path/desde-a-raiz.ts:linha` (faixa `:42-58` ok); repetições usam `path#símbolo`. Afirmação de comportamento ("X valida Y", "Z é stub") SEM âncora é proibida no Estado do terreno e no Blast radius.
  - **Git/arqueologia**: decisão herdada de commit leva o hash curto; hashes minerados nos `git log` (§2/§3) que sustentarem decisão aparecem no Briefing/Evidências.
  - **Schema/banco**: `tabela.coluna` + âncora no fonte (schema Drizzle ou migração). Fato sobre DADOS leva `[banco]` + query + data — dado de dev gira no re-seed.
  - **Custo controlado**: citação só na primeira menção; Evidências lista as 3-8 decisivas, tipadas (`[código]`/`[commit]`/`[banco]`/`[doc]`), 1 linha do que cada uma prova.
- Mapa de dependências em dois níveis: features (`features impact` + grafos) e código (imports/dependentes via `graph_query`, callers via `codebase_impact`), em tabela alvo → consumidores → o que re-testar.
- Blast radius: pra cada item, sintoma se quebrar + como detectar. Superfícies que leem o mesmo dado (web × scripts de prognóstico × ingestão leem o MESMO banco) entram aqui.
- Decisão de arquitetura de verdade (cross-feature, vale além deste plano) continua indo pra `docs/arquitetura/<slug>.md` — o dossiê linka, não absorve.
- Não duplique os passos executáveis aqui; detalhe pesado de um passo específico (SQL completo, shape JSON grande, cenário de teste) vive em §§ que o passo referencia.

## 5. Escreva a seção `## Plano` (template literal — preencha, não reinvente)

A seção entra **entre Tarefas e Evidências** no arquivo da feature. Leia [templates/plano.md](templates/plano.md) e preencha exatamente aquele shape (o `/i` parseia).

**Regras de forma**:

- **Injete as regras de estrutura do CLAUDE.md nos passos que as tocam** (regra longe da ação não é obedecida — o texto vai COLADO, condensado, não linkado). Por superfície:
  - Passo `api` → cola: pasta-por-endpoint (`apps/api/src/modules/<módulo>/<verbo>-<substantivo>/` com `*.service.ts` + `*.schema.ts`; `<módulo>.routes.ts` FINO, zero regra de negócio; `<módulo>/shared/` só pro transversal a 2+ operações); Elysia no Workers = TypeBox (não zod), sem response schemas, `aot: false`.
  - Passo `ui` → cola: folder-by-feature em `apps/web/features/<feature>/` (`components/`, `hooks/data/queries|mutations`, `hooks/ui/`, `schemas/`, `services/` único lugar com fetch, `types/` via `z.infer`, `utils/` puros); `app/**/page.tsx` fino; kebab-case sem sufixo redundante; proibido importar entre features (2+ usam → `lib/`/`shared/`).
  - Todo passo → `type`, nunca `interface`; dinheiro em centavos via `@workspace/core/money`; datas via `date-fns`/`-tz` com fuso `America/Sao_Paulo`; código/dado em inglês, só string de UI em português.
  - Cole SÓ o subconjunto que o passo toca — a lista acima é o menu, não um bloco a despejar inteiro em cada passo.
- **Toda Prova é mecânica**: comando copiável + saída esperada (exit 0, string, contagem, fala exata do agente). "UI fica boa" sem screenshot/passo de Chrome associado é proibido.
- **Testes em camadas por superfície tocada** (o `## Plano` NÃO fica pronto sem elas — cada faceta gera sua Prova/Verificação na camada certa, com paths reais, nunca "adicionar testes"):
  - `dados`/`api` → **não existe harness nem runner de unidade no repo**: a Prova é script bun ad-hoc (ou `fetch` contra o dev server de pé) que bate na rota real e assevera shape + efeito, com assert no banco quando o efeito não aparece na resposta HTTP. Nomeie o script e os casos (happy + borda + erro). Não invente `bun test <path>` pra um runner que não existe.
  - `ui` → o teste PRIMÁRIO é o **browser real via `chrome-devtools` MCP** (mandato do CLAUDE.md): o `/pl` escreve um **roteiro de navegação completo** no dossiê (§Testes), seguindo a mesma escada do `/i` (erro/validação → variantes/bordas → golden path por último), cada cenário no formato caso → passos (`navigate_page`/`take_snapshot`/`click`/`fill`) → assert observável → `list_console_messages` + `list_network_requests` limpos ao final. Typecheck e e2e mockado NÃO pegam erro de runtime/hidratação/rede/CORS — só o browser real pega. **MCP indisponível (não atacha com o Chrome do dono aberto) → declare explicitamente**, nunca afirme que a UI funciona.
  - `ui` complementar → **Playwright existe** (`cd apps/web && bun run test:e2e`, `testDir: e2e/`, dev em :3211, auth Clerk exigindo `.env.e2e` — sem as chaves os specs de login dão skip). Planeje spec de regressão headless quando o fluxo justificar; declare a dependência de env em vez de fingir que roda limpo.
  - Faceta sem teste possível (mudança só-visual sem golden observável, throwaway) declara explicitamente por quê — silêncio não vale.
  - Cenário de teste pesado (dados de seed, sequência de asserts) vai pra um § do dossiê e o passo/Verificação o referencia ("cenários: dossiê §Testes").
- **1 passo = 1 mudança coesa + 1 Prova**. Passo com "e também" é cheiro de split. Sem código órfão: todo passo termina com o código novo LIGADO a algo que roda (rota registrada em `apps/api/src/app.ts`, componente renderizado, tool plugada).
- **P1 = walking skeleton**: o caminho feliz mínimo atravessando todas as facetas da feature, validável com 1 comando/conversa — risco de integração falha no P1 com diff pequeno, não no P6. Os passos seguintes engordam o esqueleto.
- **Don'ts por função inserida**: todo passo que cria/altera função declara, junto da intenção, a lista de "Don't:" — TUDO que a função NÃO deve fazer (efeitos colaterais proibidos, responsabilidades que pertencem a outros símbolos, atalhos tentadores que violam convenção do repo, casos que ela NÃO trata de propósito). Não é cota — é entender o espaço de erro do passo e enumerá-lo; restrição negativa explícita guia o `/i` muito melhor que só a descrição positiva. Don't genérico ("não quebrar nada") não vale — cada um nomeia um erro concreto e plausível daquele passo. E o texto do don't vai **colado no passo**, nunca só um link/ID de regra. Formato: **par de contraste SEM explicação** quando couber — mostre o errado→certo mínimo (`interface Props {}` → `type Props = {}`), sem racional.
- **Antipadrões desta skill**: `regra-longe-da-acao` · `prova-de-prosa` (passo fechando com "deve funcionar" em vez de comando+saída) · `passo-com-e-tambem` · `como-por-completude` (passo-a-passo escrito pra parecer completo — procedimento errado é PIOR que nenhum; só escreva COMO quando souber que está certo) · `rename-atomico` · `alternativa-nao-gravada` (opção rejeitada sem registro → o agente re-propõe 3 sessões depois; grave em Decisões) · `sizing-sem-consequencia` · `plano-fila-quando-e-grafo` (serializar passos sem dependência real — declare `(depende: Pn)` só onde existe).
- **Passos expressam intenção** (o que muda, em qual path, por quê) — não código pronto; snippet só quando a forma exata é o contrato (SQL do expand, shape de settings). Decisões adiadas de propósito pro `/i` são listadas como adiadas, pra não parecer esquecimento.
- **Schema = passos separados** expand → migrate → contract, cada um com critério de avanço ("backfill verificado por query X antes do contract"). Contract fora do escopo → checkbox/feature futura com ID, nunca implícito. Mudança só-aditiva → declare "só expand" e siga.
- **Orçamento**: seção `## Plano` ≤ ~150 linhas, ≤ ~10 passos, ≤ 2 níveis. Estourou → divida em fases, ou o pedaço G vira feature separada com `depende_de`. Detalhe pesado de passo → §§ do dossiê, referenciado pelo passo ("detalhe: dossiê §Schema").
- **Esforço G em qualquer faceta** → ou se divide em passos menores ou vira feature separada — o plano não segue com um passo G opaco. (P/M não precisam de justificativa; sizing sem consequência é teatro.) **Nomeie o eixo do corte** e registre por quê, nesta ordem de preferência: 1º dependência dura ausente (a parte bloqueada vira feature `depende_de`), 2º fase de valor (computar antes de exibir), 3º faceta — sem o eixo escrito, cada sessão corta a mesma feature de um jeito diferente.
- **Releitura final**: quebre qualquer passo que toque >3 arquivos ou cuja Prova não caiba em 1 comando.

## 6. Grave e feche

1. Dossiê em `docs/planos/<ID>-<slug>.md` + seção `## Plano` no arquivo da feature (posição: entre Tarefas e Evidências). Crie os arquivos das features de fora-de-escopo.
2. **Tarefas = fonte única de status**: reescreva os checkboxes como espelho 1:1 dos passos — `- [ ] P3 api — <resumo>` (tarefas grossas pré-existentes viram sub-itens ou são substituídas explicitamente). O `/i` marca AQUI, o Plano detalha sem checkbox próprio.
3. Frontmatter: `status: planejado`; **facetas: toda superfície coberta por passo → `planejado`**, as demais ficam como estão (faceta que não se aplica à feature: **omita a chave** — valor `n/a` reprova no `features check`, que só aceita status válido); `docs:` += o dossiê; `atualizado:` = hoje. Âncora ainda inexistente → sufixo ` (proposta)`. Fontes decisivas → seção **Evidências** da feature, no MESMO formato citável das Regras de citação interna (`path:linha` / hash / `tabela.coluna` — não afirmação solta).
4. `bun run features check && bun run features build`.
5. **`node scripts/verify-citations.mjs docs/planos/<ID>-<slug>.md --repo .`** — o checker resolve cada `path:linha` no commit do pino (detecta o `Base: commit` sozinho), confere trecho verbatim entre aspas na mesma linha contra o arquivo real, e resolve URLs. Exit ≠ 0 = citação quebrada; conserte antes de responder. Citou doc/arquivo criado DEPOIS do pino → atualize o pino ou anote "(posterior ao pino)".
6. Responda com: passos em 1 linha cada, blast radius em 1-3 linhas (o que mais pode quebrar), riscos principais (C1..Cn), a **cobertura de teste por camada** (script/fetch pra api-dados · roteiro chrome-devtools pra ui · spec Playwright quando justificar — quais existem, quais o `/i` cria), e os `[PENDENTE-DONO]` **antes** de sugerir `/i <ID>` — pergunta cuja resposta errada joga trabalho fora se resolve agora, não durante o `/i`.
