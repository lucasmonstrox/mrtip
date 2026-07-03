---
id: MOD-009
titulo: Espaçamento dos jogos na janela de forma — densidade do calendário ("5 jogos em 14 dias") no prognóstico
modulo: modelos
status: em-andamento # ia implementada e provada nos golden; falta E2E de LLM (opcional) e backtest antes de qualquer peso
prioridade: P2
facetas:
  ia: verificado # implementado 2026-07-03; prova: densidade '5 jogos em 31 dias (7-8-8-8)' + datas/gaps (+Nd) nos itens da forma; soma dos gaps = span conferida; fatia ## Contexto→PARTE 3 íntegra; 3 golden ok
testada: nao
testes: []
depende_de: [MOD-004, LIG-005, LIG-011]
impacta: [MOD-004]
ancoras:
  settings: []
  tabelas: [match]
  tools: []
  funcoes: [contextoUltimos5, restDays, buildPrompt, "densidadeJanela (proposta)"]
  rotas: []
docs:
  - docs/wishlist.md
  - docs/regras/calendario-fadiga.md
  - docs/planos/MOD-009-densidade-do-calendario-na-forma.md
verificado_em: null
atualizado: 2026-07-03
---

# Espaçamento dos jogos na janela de forma — densidade do calendário ("5 jogos em 14 dias") no prognóstico

## Descrição

O prompt vivo (`prognosis-prompt.ts`) hoje só mede o **último** intervalo de descanso (`restDays`, LIG-005) — a densidade da JANELA de forma inteira some: 3 dias de folga após um mês leve ≠ 3 dias no fim de uma maratona, e o mesmo V-V-E-D-V significa outra coisa físico. Esta feature computa o **espaçamento real dos últimos 5 jogos liga+copa** (intervalos entre jogos, span total em dias, contagem de copa e de meio de semana) e injeta: (a) um **resumo de densidade** — "5 jogos em 14 dias (intervalos 3-4-3-4 · 2 de copa · 2 no meio de semana)" — no bloco de forma e no bloco Descanso do `## Contexto`; (b) as **datas** em cada item do `contextoUltimos5`. Entra como **evidência qualitativa** pro ajuste do LLM — **NUNCA peso automático no λ** (trava herdada do SIN-008: fadiga crua é meio precificada pelo mercado; efeito real sobre gols só ≤3 dias). Cruzamento instruído: densidade ALTA + jogo sem stake = **rodízio provável** (cruzar com XI provável/banco). Zero schema (`match.date` já carregado); superfície única. Origem: wishlist W-065; completa o triângulo da fadiga (SIN-008 = último intervalo · **W-065 = densidade** · W-047 = dureza · W-050 = per-player).

## Tarefas

- [ ] P1 ia — `densidadeJanela(teamId)` (mesma janela do `contextoUltimos5`) + resumo de densidade abrindo o bloco de forma dos 2 times
- [ ] P2 ia — datas nos itens do `contextoUltimos5` (prefixo `- YYYY-MM-DD · `, formato do `h2hLine`) + gap `(+Nd)` por item
- [ ] P3 ia — linha de densidade comparada no bloco Descanso do `## Contexto` + doutrina (qualitativo/assimetria/rodízio), herança no super prompt preservada
- [ ] P4 ia — validação em 3 jogos-golden com conferência manual das datas no banco + typecheck

## Plano (2026-07-03)

Dossiê: [docs/planos/MOD-009-densidade-do-calendario-na-forma.md](../../planos/MOD-009-densidade-do-calendario-na-forma.md)

### Objetivo, aceite e non-goals

Pronto = o prompt gerado de qualquer jogo mostra, pros 2 times, o espaçamento da janela de forma (resumo de densidade + datas por item) e instrui o LLM a usá-lo como evidência qualitativa com o cruzamento de rodízio.
Non-goals: NENHUM número do motor muda (λ, `marketProbs`, Poisson/DC intocados — trava SIN-008); sem schema/rota/UI; dureza dos jogos (W-047) e fadiga per-player (W-050) ficam fora; sem E2E de LLM obrigatório (custa API — opcional no /i).
Aceite:
- A1 [ia] prompt de jogo real traz, nas 2 seções "Forma & contexto", o resumo "N jogos em X dias (intervalos … · N de copa · N no meio de semana)" e itens datados em ordem cronológica → coberto por P1+P2
- A2 [ia] o `## Contexto` traz a linha de densidade comparada dos 2 lados + instrução: qualitativo (não recalcular λ), assimetria, densidade alta + sem stake → rodízio provável (cruzar com XI/banco), sem dupla-contar o `restDays` → coberto por P3
- A3 [ia] janela curta (<2 jogos) degrada honesto ("janela curta — sem leitura de densidade") e a fatia `## Contexto`→`**PARTE 3` que o super prompt herda continua íntegra → coberto por P1+P3+P4

### Premissas

- `teamMatches`/`cupMatchesOf` (`prognosis-prompt.ts:66-89`) já entregam os jogos com `date` string `YYYY-MM-DD` pré-CUTOFF — zero query nova (`leagues.ts:104`).
- `contextoUltimos5` (`:1325-1370`) monta a janela últ.5 liga+copa; itens hoje SEM data. Bloco Descanso em `:1666-1667`.
- `super-prognosis.ts:380-385` fatia `## Contexto`→`**PARTE 3` do `prompt_text` → a edição herda no super prompt sem passo próprio.
- Se uma premissa cair no /i: PARAR e atualizar este Plano com a divergência datada.

### Decisões

- D1: aritmética de dias via `Date.parse`/86_400_000 sobre a string `YYYY-MM-DD` — driver: padrão já usado no MESMO arquivo (`restDays:815`) e coluna sem hora/fuso; descartado: `date-fns` porque não é dependência do `apps/api` (verificado no package.json) e seria dep nova pra diff de dia inteiro; pagamos: exceção pontual à regra date-fns do CLAUDE.md, restrita a diffs de dias em datas puras.
- D2: densidade = TEXTO (evidência qualitativa), nunca fator no λ — driver: veto SIN-008 (`calendario-fadiga.md` §1/§6, sem backtest = baixíssimo peso); descartado: multiplicador no `lambda*` porque é exatamente o que a regra proíbe antes de medir; pagamos: o efeito depende do LLM ler a instrução.
- D3: a janela da densidade é a MESMA do `contextoUltimos5` (últ.5 liga+copa) e o span vai do 1º ao último jogo DELA — o gap até o jogo atual fica de fora porque já é o `restDays` (anti-dupla-contagem por construção); "meio de semana" = dia UTC ∈ {ter, qua, qui}.
- Adiadas de propósito pro /i: copy/emoji exatos do resumo e da doutrina (esqueleto no dossiê §Copy da instrução), formato fino do `(+Nd)`.

### Passos

**P1 [ia] esqueleto** — `apps/api/scripts/prognosis-prompt.ts`: criar `densidadeJanela(teamId)` ao lado de `contextoUltimos5`, computando sobre a MESMA janela (extrair a construção merge+sort+slice(-5) pra função compartilhada, não duplicar): `{n, spanDias, gaps[], copas, meioSemana, resumo}` com degradação `n<2`; prepender o `resumo` como linha de abertura do bloco retornado por `contextoUltimos5`. Detalhe: dossiê §Shape do helper. Prova: `cd apps/api && bun run scripts/prognosis-prompt.ts f0c7743f-3eaf-42ed-805b-d745dc4c4fb9` → exit 0 e o output contém 2 ocorrências de "jogos em " + " dias" (uma por time) nas seções "Forma & contexto".

**P2 [ia] (depende: P1)** — datas nos itens do `contextoUltimos5`: prefixo `- ${p.date} · ` (formato do `h2hLine:1426`) + gap desde o jogo anterior da janela como `(+Nd)` (1º item sem gap). Falha provável: template literal da linha já é denso — quebrar a montagem em variáveis, não inflar o ternário. Prova: mesmo comando do P1 → cada item da forma começa com `20\d\d-\d\d-\d\d` em ordem crescente, e a soma dos `(+Nd)` de um time bate com o `spanDias` do resumo (conferência no output).

**P3 [ia] (depende: P1)** — bloco Descanso do `## Contexto` (`:1666-1667`): nova linha `- Densidade da janela de forma: {home} {resumo} · {away} {resumo}` logo após a linha de Descanso, e a doutrina (`:1667`) ganha a leitura com as 3 travas — qualitativo (não recalcular λ), assimetria entre os lados, e o cruzamento "densidade ALTA + sem stake real → rodízio provável: cruze com XI provável/minutagem e banco"; dizer explicitamente que o último intervalo já está na linha Descanso (não dupla-contar). Copy: dossiê §Copy da instrução. Prova: mesmo comando → output contém "Densidade da janela de forma" ENTRE `## Contexto` e `**PARTE 3` (as 2 âncoras presentes — fatia do super prompt íntegra).

**P4 [ia] (depende: P2, P3) validação** — rodar os 3 jogos-golden: `f0c7743f` (Tottenham×Everton), `77a4255a` (West Ham×Leeds — copa na janela, 🏆 com data e contagem "de copa" > 0), `60a3d183` (Sunderland×Chelsea); conferir os spans/gaps à mão contra as datas do banco (`SELECT date FROM match WHERE …` dos jogos da janela de 1 time) e registrar nos `testes:` do frontmatter. Prova: 3 runs exit 0 + `bun run typecheck` verde no workspace api + conferência manual anotada.

### Verificação final

- `bun run typecheck` limpo (workspace api)
- `bun run scripts/prognosis-prompt.ts` nos 3 golden ids acima → densidade + datas + doutrina presentes; grep estrutural `## Contexto`…`**PARTE 3`
- conferência manual dos números de 1 janela contra `match.date` no banco (P4)
- re-teste dos vizinhos de âncora: golden prompt do MOD-004 (mesmo comando cobre) e herança MOD-006 (grep estrutural cobre)
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra A1..A3 — diff fora de `apps/api/scripts/prognosis-prompt.ts` = achado

### Pré-mortem e rollback

3 semanas depois, quebrou. Causas prováveis:
- C1: LLM dupla-conta fadiga (densidade + restDays) e puxa under/rotação demais — sintoma: prognósticos sistematicamente under/rotação; mitigação: a frase anti-dupla-contagem do P3 é obrigatória + leitura do reasoning num E2E quando houver run.
- C2: janela early-season (<2 jogos ou span minúsculo) imprime absurdo ("1 jogo em 0 dias") — sintoma: bloco de forma sem sentido na rodada 2; mitigação: degradação honesta do P1 é requisito de aceite (A3).
- C3: pausa de calendário (data FIFA/inverno) infla o span e o LLM lê "35 dias = time fresco" — sintoma: reasoning citando frescor irreal; mitigação: doutrina do P3 diz que densidade BAIXA não é sinal por si.
Rollback: texto de prompt puro, sem schema → `git revert` basta. O rollback NÃO desfaz: prognósticos já persistidos em `match_prognosis` (o `prompt_text` gravado é imutável — histórico de acerto não se apaga).

### Fora de escopo

- Dureza dos jogos da janela (duelos/faltas — W-047) → segue na wishlist, mesmo bloco quando promovida
- Fadiga per-player / rodízio detectado por lineup diff (W-050) → segue na wishlist; aqui o rodízio é só instrução ao LLM
- E2E do LLM (run-deepseek lendo a densidade no reasoning) → opcional no /i, custa chamada de API

## Evidências

- [código] `apps/api/scripts/prognosis-prompt.ts:812-816` — `restDays` mede só o ÚLTIMO intervalo (via `lastMatchAnyComp:803-808`): o gap que esta feature preenche.
- [código] `apps/api/scripts/prognosis-prompt.ts:1328-1330` — `contextoUltimos5` já monta a janela últ.5 liga+copa ordenada por data: matéria-prima em memória, zero query nova.
- [código] `apps/api/scripts/prognosis-prompt.ts:1666-1667` — bloco Descanso do `## Contexto`: ponto de inserção da linha comparada e da doutrina do cruzamento.
- [código] `apps/api/scripts/super-prognosis.ts:380-385` — fatia `## Contexto`→`**PARTE 3` do `prompt_text`: a edição herda automática no super prompt.
- [código] `apps/api/src/db/schemas/leagues.ts:104` — `match.date` é `date mode:"string"` (`YYYY-MM-DD`): zero schema, diffs de dias inteiros.
- [doc] `docs/wishlist.md:258-267` — origem W-065 (pedido do João 2026-07-03), cruzamento rodízio e herança do ceticismo SIN-008.
- [doc] `docs/regras/calendario-fadiga.md` §1/§2/§6 — a trava: fadiga crua ~precificada, efeito real só ≤3 dias, qualitativo até backtest.

## Verificação

_(preencher quando status=feito/verificado: as Provas P1-P4 executadas + revisor subagent)_
