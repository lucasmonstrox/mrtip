---
id: MOD-008
titulo: Desgaste por sequência de jogos difíceis — dureza dos últimos 5 como evidência qualitativa no prompt vivo
modulo: modelos
status: em-andamento # ia implementada e provada nos golden; falta E2E de LLM (opcional) e backtest antes de qualquer peso
prioridade: P2
facetas:
  ia: verificado # implementado 2026-07-03; prova: linha 'Dureza da janela (últ.5)' com top-6/duelos/faltas/cartões + rótulo direcional nos 3 golden (77a4255a, f0c7743f, 60a3d183); baseline anti-leak; typecheck ok
testada: nao
testes: []
depende_de: [MOD-004]
impacta: [MOD-004]
ancoras:
  settings: []
  tabelas: [match_team_stats, lineup_player, card]
  tools: []
  funcoes: [durezaUltimos5 (proposta), contextoUltimos5]
docs:
  - docs/wishlist.md
  - docs/regras/calendario-fadiga.md
  - docs/regras/catalogo-de-cruzamentos.md
  - docs/planos/MOD-008-desgaste-sequencia-jogos-dificeis.md
verificado_em: null
atualizado: 2026-07-03
---

# Desgaste por sequência de jogos difíceis — dureza dos últimos 5 como evidência qualitativa no prompt vivo

## Descrição

O bloco de descanso do prompt vivo hoje só conta **intervalo** (dias desde o último jogo, liga+copa). Esta feature adiciona a camada de **intensidade** (origem: wishlist **W-047**): computar em código a **DUREZA dos últimos 5 jogos** de cada time — quantos foram contra **top-6** (tabela recomputada pré-jogo), **duelos totais** do jogo, **faltas** (cometidas+sofridas, somadas de `lineup_player.fouls`/`fouls_drawn`) e **cartões** (tabela `card`) — comparada ao baseline da liga, e injetá-la no bloco `## Contexto` ao lado da linha de Descanso, como **evidência qualitativa** pro LLM. Três jogos duros contra o top-6 cansam mais que três contra a parte de baixo no MESMO intervalo; o espelho (calendário recente leve) também informa.

**Trava herdada do SIN-008/MOD-004 (quant-first, medir antes de calibrar):** a dureza **NUNCA** entra como peso automático no λ — `docs/regras/calendario-fadiga.md` prova que fadiga crua é majoritariamente o efeito casa/fora que o mercado já precifica; o sinal só vale como leitura qualitativa (e o que importa é a **assimetria** entre os dois lados). Zero schema/migração: todas as colunas já existem e estão ingeridas.

## Tarefas

- [ ] P1 ia — `durezaUltimos5(teamId)`: top-6 count + duelos/j via dados já em memória; linha "Dureza" no Contexto
- [ ] P2 ia — faltas por time (extender a query agregada de `lineup_player`) na linha de dureza
- [ ] P3 ia — cartões (tabela `card`) + baselines da liga pré-cutoff + rótulo DURO/NEUTRO/LEVE
- [ ] P4 ia — bullet de instrução de leitura (assimetria, qualitativo, anti-double-counting) + não-regressão nos jogos de referência

## Plano (2026-07-03)

Dossiê: [docs/planos/MOD-008-desgaste-sequencia-jogos-dificeis.md](../../planos/MOD-008-desgaste-sequencia-jogos-dificeis.md)

### Objetivo, aceite e non-goals

Pronto = o prompt gerado por `bun run scripts/prognosis-prompt.ts <matchId>` traz, no `## Contexto`, uma linha de **dureza dos últimos 5** por time (top-6, duelos, faltas, cartões vs baseline da liga, rótulo) + um bullet dizendo COMO ler (qualitativo, assimetria), sem tocar em λ/probabilidades.
Non-goals: **NÃO** ajustar λ/Poisson/probabilidade por dureza (trava SIN-008/MOD-004); **NÃO** criar schema/migração (gate duro — só colunas existentes); **NÃO** tocar em UI, rotas, `run-deepseek.ts` nem `super-prognosis.ts` (o super reusa a PARTE 2 do prompt vivo); **NÃO** refinar por prorrogação/lesões-em-jogo (fica no dossiê §Fora de escopo).
Aceite:
- A1 [ia] prompt de um jogo com dado traz `- Dureza últ.5:` com os 2 times, cada um com `X/5 vs top-6`, duelos/j, faltas/j, cartões/j e rótulo — coberto por P1-P3
- A2 [ia] o prompt traz o bullet de leitura com a trava qualitativa ("evidência qualitativa", "assimetria") — coberto por P4
- A3 [ia] nenhuma outra seção do prompt muda (diff antes/depois restrito ao `## Contexto`) e nenhum número de λ/prob muda — coberto por P4

### Premissas

- `match_team_stats.duelsWon/tackles/interceptions` existem e `teamStatsByMatch` já carrega TODAS as linhas em memória (`prognosis-prompt.ts:399-408`); faltas de TIME **não** existem em `match_team_stats` — vêm da soma de `lineup_player.fouls` (`leagues.ts:289`).
- `standingsAsOf(date)` (`prognosis-prompt.ts:1258`) dá a posição do adversário AO ENTRAR em cada jogo (anti-leak) — top-6 sai daí; adversário de copa fora da PL não tem pos (não conta como top-6).
- A janela "últimos 5 liga+copa" é a mesma do `contextoUltimos5` (`prognosis-prompt.ts:1328-1330`).
- O super-prognosis reusa a PARTE 2 do prompt vivo — mudar só `prognosis-prompt.ts` cobre as duas superfícies (dono, nesta conversa).
- Se uma premissa cair no `/i`: PARAR e atualizar este Plano com a divergência datada.

### Decisões

- D1: proxy de dureza = **top-6 (tabela as-of) + duelos totais do jogo + faltas + cartões** — driver: só colunas ingeridas, zero query nova pesada; descartado: Elo/xG de força (não existe no banco) e "intensidade por placar apertado" (mais caro, sinal duvidoso); pagamos: proxy grosseiro que mistura "pegado" com "faltoso".
- D2: **saída qualitativa** (números + rótulo DURO/NEUTRO/LEVE vs baseline), nunca multiplicador no λ — driver: trava SIN-008/MOD-004 "medir antes de calibrar"; descartado: desconto automático no λ; pagamos: o sinal depende do LLM ponderar.
- D3: duelos do jogo = `duelsWon(A) + duelsWon(B)` do `match_team_stats` (a soma dos ganhos dos 2 lados ≈ duelos disputados) — driver: dado de time já em memória; descartado: somar `lineup_player.duelsTotal` (exigiria mexer na query por jogador e dupla-contaria A+B); pagamos: aproximação (duelos sem vencedor ficam de fora).
- Adiadas de propósito pro `/i`: thresholds exatos do rótulo (sugestão no dossiê §Detalhes), micro-copy da linha e do bullet.

### Passos

**P1 [ia] esqueleto** — `apps/api/scripts/prognosis-prompt.ts`: criar `durezaUltimos5(teamId)` perto de `restDays` (`:812`): pega os últimos 5 (liga+copa, mesmo merge do `contextoUltimos5:1328`), conta adversários com pos ≤ 6 via `standingsAsOf(p.date)` e tira a média de duelos do jogo via `teamStatsByMatch` (D3, null-safe). Renderizar `- Dureza últ.5: <home> ... · <away> ...` logo abaixo da linha de Descanso (`:1666`). Prova: `cd apps/api && bun run scripts/prognosis-prompt.ts 77a4255a-3e44-4fd9-a133-b13ca0898a91 | grep "Dureza últ.5"` → 1 linha com os 2 times, `X/5 vs top-6` e duelos/j; exit 0.
**P2 [ia] faltas (depende: P1)** — mesma file: a query agregada por (matchId, teamId) (`statRows:95-104`) ganha `fouls: sum(lineupPlayer.fouls)` (e `foulsDrawn`, o lado sofrido); `durezaUltimos5` soma cometidas+sofridas = faltas do JOGO. Falha provável: jogo sem lineup ingerido → tratar ausência como "sem dado" (padrão `hasSot:395`), não como 0. Prova: mesmo comando do P1 → a linha traz `faltas <n>/j` com n plausível (PL ≈ 20-24/jogo); exit 0.
**P3 [ia] cartões + baseline + rótulo (depende: P1)** — query em `card` (`leagues.ts:529`) pelos matchIds da janela dos 2 times (padrão `possMatchIds:1301`) → cartões do jogo (2 lados); baselines da liga = média de duelos/faltas/cartões sobre `played` (pré-cutoff, anti-leak; cartões via 1 aggregate `count(*) group by match_id`); rótulo DURO/NEUTRO/LEVE comparando componentes vs baseline (thresholds: dossiê §Detalhes). Prova: mesmo comando → linha completa com `cartões <n>/j` e o rótulo entre parênteses citando o motivo (ex.: `(DURO: 3/5 top-6, duelos +9% vs liga)`); exit 0.
**P4 [ia] instrução + não-regressão (depende: P1-P3)** — bullet novo colado ao de Descanso/fadiga (`:1667`): dureza é **evidência qualitativa** (herda SIN-008: fadiga crua já meio precificada — só mexa na leitura com assimetria REAL entre os lados e NUNCA como desconto mecânico; não dupla-contar com o próprio bullet de descanso). Não-regressão: gerar o prompt de 2 jogos de referência antes/depois e diffar. Prova: `bun run scripts/prognosis-prompt.ts 77a4255a-… > /tmp/dep.md` + diff contra a versão pré-mudança → hunks só no `## Contexto`; `grep -c "evidência qualitativa"` ≥ 1.

### Verificação final

- `cd apps/api && bun run typecheck` limpo (diff desta feature; falha pré-existente de W-057 em `sync-sportmonks.ts`, se ainda houver, é externa)
- Provas P1-P4 nos ids `77a4255a-3e44-4fd9-a133-b13ca0898a91` e `f0c7743f-3eaf-42ed-805b-d745dc4c4fb9`
- diff do prompt antes/depois restrito ao `## Contexto` (A3)
- re-teste MOD-004 (motor/prompt compartilhado): prompt inteiro gera sem erro e as probabilidades Poisson não mudam de valor
- último passo: subagent em contexto fresco revisa o diff contra A1-A3 — diff fora de `apps/api/scripts/prognosis-prompt.ts` = achado

### Pré-mortem e rollback

- C1: **double-counting com o descanso** (LLM desconta duas vezes a mesma fadiga) — sintoma: unders sistemáticos em time com copa no meio de semana; mitigação: o bullet do P4 proíbe explicitamente e manda ler a ASSIMETRIA.
- C2: **proxy sujo** (time faltoso ≠ jogo duro; goleada tranquila vs top-6 conta como "duro") — sintoma: rótulo DURO em sequência tranquila; mitigação: rótulo só quando ≥2 componentes concordam (dossiê §Detalhes) + refino por placar fica em Fora de escopo.
- C3: **jogo de copa sem stats** (lineup/match_team_stats não ingeridos p/ copa) — sintoma: `?/j` na linha; mitigação: null-safe por componente (média só dos jogos com dado, contagem de amostra exposta).
Rollback: `git revert` basta (mudança é 100% texto do prompt, sem schema, sem setting). O rollback NÃO desfaz prognósticos já gerados/persistidos com a linha de dureza.

### Fora de escopo

- Refino da dureza por placar/intensidade (jogo 1×1 disputado vs goleada) e por prorrogação de mata-mata → fica anotado no dossiê; virar feature própria se o sinal provar valor.
- Peso quantitativo no λ → só após backtest (gate MOD-004/`backtest-prognosis.ts`), feature futura com `depende_de: [MOD-008]`.
- Dureza por JOGADOR (quem foi poupado nos jogos duros) → família W-050.

## Evidências

- [doc] `docs/wishlist.md` §W-047 — origem: dureza dos adversários como camada de intensidade que falta ao modelo de fadiga; gotchas (proxy, double-counting, copa, rodízio).
- [doc] `docs/regras/calendario-fadiga.md` §1 — veredito SIN-008: fadiga crua ≈ efeito casa/fora já precificado → dureza só como evidência qualitativa, provar incremento antes de pesar.
- [doc] `docs/regras/catalogo-de-cruzamentos.md` §2 — linha "❌ Dureza dos jogos anteriores (fadiga qualitativa — W-047)": este plano move o condicionador de ❌ pra 🔶.
- [código] `apps/api/scripts/prognosis-prompt.ts:1258` — `standingsAsOf` dá posição do adversário pré-jogo (anti-leak), base do top-6.
- [código] `apps/api/scripts/prognosis-prompt.ts:399-408` — `match_team_stats` inteiro já em memória (duelsWon por time/jogo, D3).
- [código] `apps/api/src/db/schemas/leagues.ts:289,296,529` — `lineup_player.fouls`/`duels_total` e tabela `card` ingeridos; faltas de TIME não existem em `match_team_stats` (soma-se por jogador).

## Verificação

_(preencher quando status=verificado)_
