---
name: i
description: Implementa uma feature do docs/features — gate de pré-existência, Plano do /pl como roteiro, verificação real tipada por superfície (Chrome p/ UI, endpoint p/ API, assert no banco p/ dados) e registro atualizado. Use quando o usuário pedir pra implementar, construir ou codar uma feature que tem ID no docs/features (ou disser "/i").
argument-hint: <ID da feature> [escopo/observações]
allowed-tools: Bash(bun run features:*), Bash(bun run typecheck:*), Bash(bun run lint:*), Bash(bun test:*), Bash(git log:*), Bash(git status:*), Bash(git diff:*)
---

Implemente a feature: `$ARGUMENTS`

## Estado do repo (injetado)

- Mudanças não commitadas: !`git status --short`
- Últimos commits: !`git log --oneline -10`

Isso já responde "alguém mexeu nessa área agora?" — não colida nem regrida o que acabou de mudar.

## 1. Gate de pré-existência (PRIMEIRA coisa — não pule)

Leia `docs/features/<modulo>/<ID>-*.md` e decida o modo ANTES de tocar em qualquer código:

- **Já existe** (`status: feito|verificado` e tarefas fechadas) → **NÃO implemente.** Em vez disso, reporte:
  1. O que existe e a prova (seção Verificação + `testes:`).
  2. O raio de quem seria afetado por mexer: `bun run features impact <ID>` + âncoras compartilhadas do INDEX.md (quem mais toca as mesmas tabelas/settings/tools) + `codebase_impact` nos símbolos centrais.
  3. **O que pode quebrar** se mexer ali (dependentes transitivos, contratos compartilhados, testes que cobrem o caminho).
  4. Pergunte o que o usuário quer de fato: estender (→ nova tarefa ou nova feature com `depende_de` desta), reabrir (regressão? então é `/bug`), ou nada.
- **Parcial** (`em-andamento`/`feito` com tarefas abertas) → implemente **só os checkboxes abertos**. Antes, confirme via SocratiCode o que o código JÁ faz — não reescreva nem duplique o que está pronto.
- **Verde** (`ideia|investigado|planejado`) → caminho completo abaixo. Se o escopo está ambíguo (sem investigação/arquitetura), sugira `/rs <ID>` primeiro em vez de chutar decisões de produto.

## 2. Pré-voo

- Leia TODOS os `docs:` vinculados — investigação/arquitetura **mandam**; recomendação cravada não se re-decide. Existe dossiê do `/pl` em `docs/planos/<ID>-*.md`? Ele é a memória do planejamento (briefing, blast radius, §§ de detalhe que os passos referenciam) — leia antes dos passos.
- Se o arquivo da feature tem seção **## Plano** (gerada pelo `/pl`), ela é o roteiro: siga os passos na ordem das dependências declaradas, marcando o checkbox da Tarefa espelho (`- [ ] Pn …`) **imediatamente** ao fechar cada Prova (não no fim da sessão) — é isso que torna o trabalho retomável. Antes de executar, confira que cada Pn tem checkbox espelho em Tarefas e vice-versa — divergiu = plano stale: reconcilie primeiro ou mande de volta pro `/pl`. Passo com `[PENDENTE-DONO: …]` → pule SÓ ele e siga os desbloqueados. Premissa do Plano caiu durante a execução → PARE o passo, registre a divergência datada na própria seção **e no dossiê** (`docs/planos/`), e re-planeje — nunca force o passo original.
- Feature `planejado`/escopo grande **sem** seção `## Plano` → **pare e rode `/pl <ID>` primeiro** — é o caso dominante, não exceção. Só siga direto se for gap trivial descrevível em 1 frase, ≤2 arquivos, sem decisão técnica nem schema (mesmo escape do plano-mini do `/pl`).
- `depende_de`: pré-requisito abaixo de `feito` → PARE e reporte o bloqueio (não improvise por cima) — **EXCETO** se o topo do Plano declara "bloqueio de <ID> tratado por design via P0": execute o passo P0 (stub) primeiro e siga.
- `bun run features impact <ID>` → guarde a saída: ela é a lista de re-teste do §4 (com Plano, confira contra o Mapa de dependências do dossiê — divergiu, vale a união).
- `git log --oneline -10 -- <paths da área>` → trabalho recente na área.
- Âncora compartilhada que você vai ALTERAR (não só usar) — tabela, setting, tool: leia os consumidores listados no índice de âncoras ANTES de mudar o contrato; mudança de schema é **aditiva primeiro** (expand → migrate → contract).

## 3. Implementar (dados → api → ia → ui, em fatias verticais)

- **Antes do primeiro edit**: frontmatter da feature → `status: em-andamento` + `atualizado:` = hoje — sessão interrompida fica retomável pelo estado, não só pelos checkboxes.
- Fatia fina que compila e roda > camada inteira de uma vez. `bun run typecheck` cedo e frequente, não só no final.
- Regras transversais (SocratiCode antes de explorar, dinheiro via `@workspace/core/money`, datas via `date-fns`/-tz, folder-by-feature, sem import entre features, shadcn add da raiz): **o CLAUDE.md manda** — não re-decida nem relaxe aqui.
- Lógica pura nova em `packages/core` → **teste primeiro** (o padrão do pacote: todo `*.ts` tem seu `*.test.ts`).
- Carimbe `// @feature <ID>` SÓ em pontos de posse única (coluna de schema nova, tool do assistente de IA, topo da pasta da feature) — nunca em código compartilhado.
- Vá marcando os checkboxes de **Tarefas** no arquivo da feature conforme conclui.

## 4. Verificar de verdade (não "deve funcionar")

Leia `.claude/skills/i/verificacao.md` — a matriz de prova por superfície (ui/api/dados/ia/core), os comandos literais e o protocolo do revisor.

Regras que não se negociam:

- **Com `## Plano`**: a subseção **Verificação final** do Plano é o PISO — execute cada entrada nominal e confira todos os critérios A1..An. Sem Plano: monte a verificação pela matriz.
- A prova é **tipada pela superfície tocada** — typecheck/lint verde NÃO fecha faceta nenhuma sozinho. Mexeu em dados e só olhou o Chrome = prova indireta, não conta.
- Os cenários sobem em **escada até o golden path**: primeiro validações/erros/variantes que a feature introduziu, por último o golden path E2E como prova de fechamento (definição e ordem em `verificacao.md`). Só golden path = não viu os erros; só erros = não provou que a feature serve pro que existe.
- **Último passo SEMPRE**: subagent em contexto fresco revisa o diff contra os critérios A1..An (sem Plano: contra Descrição+Tarefas) — protocolo em `verificacao.md`.
- Re-teste a lista do `features impact` (guardada no Pré-voo) + callers do `codebase_impact`.
- Reporte com EVIDÊNCIA colada (output do comando, screenshot) — nunca afirmação. Teste falhou = dizer com o output; passo pulado = dizer qual e por quê.

## 5. Atualizar o registro e fechar

1. Frontmatter: `facetas` por superfície, `status` (só `verificado` com prova real — exige `testada: sim` + `verificado_em`), `testada`/`testes` com a evidência, `ancoras` novas, `atualizado:` = hoje. Seção **Verificação** = COMO foi provado.
   - **Com Plano**: `testes:` recebe as entradas nominais da Verificação final EXECUTADAS; `status: verificado` só com todos os A1..An provados — An sem prova = tarefa aberta declarada, nunca silêncio.
   - Sobrou passo `[PENDENTE-DONO]` pulado → `status: em-andamento` (nunca `feito`/`verificado`), o checkbox espelho fica aberto com a pergunta, e o resumo final lista o que destrava.
2. `bun run features check && bun run features build`.
3. `codebase_update` (reindex incremental) — o índice está atrás da sessão.
4. Proponha o commit (não commite sem confirmação): `feat(<modulo>): <resumo> [<ID>]` — o `[<ID>]` liga linha↔feature pra sempre.
5. Resuma por faceta: o que foi feito, o que ficou de fora (e onde está registrado), resultado da verificação, achados do revisor.
