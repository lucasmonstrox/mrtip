# MOD-009 — Espaçamento dos jogos na janela de forma (densidade do calendário) · dossiê de planejamento (2026-07-03)

Feature: [docs/features/modelos/MOD-009-densidade-do-calendario-na-forma.md](../features/modelos/MOD-009-densidade-do-calendario-na-forma.md)
Base: commit `d589ef6` (2026-07-03) — todo file:line deste doc vale neste commit.

## TL;DR

Computar o **espaçamento real da janela de forma** (datas dos últimos 5 jogos liga+copa → intervalos entre jogos, span total em dias, contagem de meio de semana e de copa) e injetar no prompt vivo: (a) um resumo de densidade tipo **"5 jogos em 14 dias (intervalos 3-4-3-4 · 2 de copa · 2 no meio de semana)"** no bloco de forma e uma linha comparada no bloco Descanso do `## Contexto`; (b) as **datas** em cada item do `contextoUltimos5`. Hoje o prompt só mede o **último** intervalo (`restDays`) — a densidade da janela inteira some, e 3 dias de folga após um mês leve ≠ 3 dias no fim de uma maratona. Decisão central herdada: **evidência qualitativa pro ajuste do LLM, NUNCA peso automático no λ** (trava SIN-008). Zero schema, superfície única: `apps/api/scripts/prognosis-prompt.ts`.

## Briefing — o que já foi falado e decidido

- **Origem:** wishlist **W-065** (`docs/wishlist.md:258-267`, adicionada 2026-07-03) — pedido do João ("interessante também pôr o espaçamento de jogos da forma, imagina que fez 5 jogos em 2 semanas"). Esforço P declarado ("uma linha a mais no bloco de forma"), tag `ia`. Já slotada pro lote 2 do prompt junto com W-047.
- **VETO herdado (SIN-008):** `docs/regras/calendario-fadiga.md` — fadiga crua é em grande parte o efeito casa/fora que o mercado já precifica (§1); efeito real sobre gols só com descanso ≤3 dias (Scoppa 2013, §2); até haver backtest, calendário entra como **sinal qualitativo de baixíssimo peso, nunca driver de pick** (§6 item 3). W-065 herda esse ceticismo explicitamente (`docs/wishlist.md:265`) → a densidade instrui o LLM, não mexe em `lambdaHome/Away` nem em `marketProbs`.
- **Posição no triângulo da fadiga** (`docs/wishlist.md:263`): SIN-008/W-019 = último intervalo · **W-065 = quantos jogos por tempo (densidade)** · W-047 = quão pesados foram (dureza) · W-050 = quem jogou (per-player). Condicionador do §2 do `docs/regras/catalogo-de-cruzamentos.md` ("Descanso/congestionamento ✅ — `match.date` liga+copa — liga/desliga intensidade geral, reta final").
- **Cruzamento a instruir no prompt** (`docs/wishlist.md:267`): **densidade ALTA + jogo sem stake = rodízio provável** — liga com o delta "banco quente / VIVOS fora do XI" que o prompt já tem (catálogo §4, ✅) e antecipa W-050.
- **Arquitetura cravada (não re-litigar):** quant-first — LLM nunca emite número, código computa e o LLM explica (`docs/arquitetura/arquitetura-agente-prognostico.md`, via briefing do MOD-004). Aqui é trivialmente satisfeito: os números (span, gaps) são computados em código e entram como texto.
- **Escopo do orquestrador (dono nesta conversa, 2026-07-03):** só `prognosis-prompt.ts`; zero schema; NÃO implementar agora (só feature + plano).

## Estado do terreno

Tudo em `apps/api/scripts/prognosis-prompt.ts` (script que monta o prompt do prognóstico e persiste via pipeline `run-deepseek.ts`/`persist-prognosis.ts`):

- **Jogos com data JÁ carregados:** `teamMatches` (`apps/api/scripts/prognosis-prompt.ts:66-67`) — jogos de liga do time, pré-`CUTOFF`, ordenados por `date` (string `YYYY-MM-DD`, `apps/api/src/db/schemas/leagues.ts:104` `date(..., { mode: "string" })`). `cupMatchesOf` (`:88-89`) — jogos de copa do time na janela da season (`cupPlayed`, `:79-86`). **Nenhuma query nova é necessária.**
- **O que existe de fadiga hoje mede só o ÚLTIMO intervalo:** `lastMatchAnyComp` (`:803-808`) pega o jogo mais recente cruzando liga+copa; `restDays` (`:812-816`) = dias entre ele e o `CUTOFF` (aritmética `Date.parse`/86_400_000); `lastMatchNote` (`:819-825`) diz a competição/data desse último jogo. É o LIG-005 — a densidade da janela inteira não existe em lugar nenhum.
- **Bloco de forma:** `contextoUltimos5` (`:1325-1370`) — merge liga+copa (`:1328-1330`), últimos 5 cronológicos, 1 linha por jogo com resultado/HT/arco/SoT/posse/contexto de tabela. **As linhas NÃO têm data** — o leitor do prompt não vê o espaçamento. Chamado 2× no template (`:1704` home, `:1740` away).
- **Precedente de formato com data:** `h2hLine` (`:1408-1426`, MOD-006) prefixa cada confronto com `- ${p.date} · ` — o mesmo prefixo serve pros itens da forma.
- **Bloco Descanso no `## Contexto`:** linha de dados (`:1666`, `restDays` + `lastMatchNote` + viagem) e a doutrina em negrito (`:1667`) que já manda cruzar descanso com intenção ("cansado SEM stake real administra/poupa"). É AQUI que a linha de densidade comparada e a instrução do cruzamento rodízio entram.
- **Herança no super prompt:** `super-prognosis.ts:380-385` fatia `## Contexto` → `**PARTE 3` do `prompt_text` persistido (evidência do MOD-006) — tanto o `## Contexto` (`:1662`) quanto os blocos de forma (`:1704`/`:1740`) estão dentro da fatia → **1 edição cobre as 2 superfícies**, nada a fazer no super prompt.
- **Downstream não parseia o texto:** `run-deepseek.ts`/`persist-prognosis.ts`/UI tratam o prompt como opaco (validação é do JSON de saída) — texto novo no prompt não quebra contrato nenhum.

## Mapa de dependências

**Features** (grafo `depende_de`/`impacta`; `features impact` formal fica pro fechamento — INDEX não deve ser editado nesta sessão):

- **MOD-004** ← dona do prompt vivo (`buildPrompt`, âncora `funcoes` compartilhada) — qualquer mudança no template é re-teste do golden prompt dela.
- **LIG-005** ← `restDays`/`lastMatchNote` ficam intocados, mas a linha nova coabita o bloco Descanso — a instrução tem que dizer "não dupla-contar" com o número deles.
- **LIG-011** ← a janela liga+copa do `contextoUltimos5` é a definição de forma cross-competition; a densidade REUSA a mesma janela (não cria uma segunda).
- **MOD-006** ← `h2hLine` é só inspiração de formato (função separada) — não é tocada; o `## H2H` continua dentro da fatia herdada.
- **W-047 / W-050** (wishlist, futuras) ← consomem o mesmo bloco quando virarem feature; a linha de densidade é o gancho onde a dureza (W-047) se pendura.

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `prognosis-prompt.ts#contextoUltimos5` (alterada) | template do prompt (`:1704`, `:1740`) → `prompt_text` persistido → fatia do super prompt | gerar prompt de jogo real: bloco de forma renderiza com datas + resumo; `## Contexto`…`**PARTE 3` íntegros |
| `prognosis-prompt.ts#densidadeJanela` (nova) | `contextoUltimos5` + linha do `## Contexto` (`:1666-1667`) | casos: 5 jogos, <2 jogos (early season), janela com copa |
| bloco `## Contexto` (template, `:1666-1667`) | LLM (doutrina) + fatia do super prompt | grep estrutural: `## Contexto` antes de `**PARTE 3` no output |

## Blast radius e cuidados

- **Prompt vivo inteiro (MOD-004):** o template muda → o prompt de TODOS os jogos muda. Sintoma se quebrar: exceção na geração (data null/`NaN` no `Date.parse`) ou bloco de forma ilegível. Detectar: rodar `bun run scripts/prognosis-prompt.ts` nos 3 jogos-golden (exit 0 + inspeção do output).
- **Herança no super prompt (MOD-006/MOD-004 P9):** se a edição do `## Contexto` quebrar os marcadores da fatia (`## Contexto`/`**PARTE 3`), o super prompt herda lixo silenciosamente. Detectar: grep estrutural no output (as duas âncoras presentes, densidade entre elas).
- **Dupla contagem de fadiga:** o LLM já recebe `restDays` + doutrina de descanso (`:1667`); densidade sem a instrução "o último intervalo já está acima" pode fazer o modelo descontar 2× o mesmo cansaço. Sintoma: prognósticos puxando under/rotação além do razoável. Detectar: leitura do reasoning num E2E (fica pro `/i` como opcional — custa chamada de API).
- **Não-risco declarado:** zero schema, zero rota, zero UI; `run-deepseek`/`persist`/Eden não parseiam o texto do prompt.

## Evidências

- [código] `apps/api/scripts/prognosis-prompt.ts:812-816` — `restDays` mede SÓ o último intervalo (prev = `lastMatchAnyComp`): o gap que a feature preenche.
- [código] `apps/api/scripts/prognosis-prompt.ts:1328-1330` — `contextoUltimos5` já monta a janela últ.5 liga+copa ordenada por data: a matéria-prima da densidade está em memória, zero query nova.
- [código] `apps/api/scripts/prognosis-prompt.ts:1666-1667` — bloco Descanso do `## Contexto`: ponto de inserção da linha comparada + doutrina que já cruza descanso×stake (o cruzamento rodízio se pendura aqui).
- [código] `apps/api/scripts/prognosis-prompt.ts:1426` — `h2hLine` prefixa `- ${p.date} · `: precedente de formato pros itens da forma.
- [código] `apps/api/scripts/super-prognosis.ts:380-385` — fatia `## Contexto`→`**PARTE 3` do `prompt_text`: herança automática, 1 edição cobre prompt vivo e super prompt.
- [código] `apps/api/src/db/schemas/leagues.ts:104` — `match.date` é `date mode:"string"` (`YYYY-MM-DD`): diffs de dias inteiros, sem hora/fuso envolvido.
- [doc] `docs/wishlist.md:258-267` — W-065: o quê/por quê/cruzamento rodízio/"zero schema"/herança do ceticismo SIN-008.
- [doc] `docs/regras/calendario-fadiga.md` §1/§2/§6 — veredito: fadiga crua ~precificada; efeito real só ≤3 dias; até backtest, sinal qualitativo de baixíssimo peso — a TRAVA da feature.
- [doc] `docs/regras/catalogo-de-cruzamentos.md` §2 (linha "Descanso/congestionamento") e §4 (linha "Banco quente") — a densidade é condicionador; o rodízio cruza com o banco.

## Detalhes por passo (referenciados pelo ## Plano)

### §Shape do helper (P1)

`densidadeJanela(teamId)` vive ao lado de `contextoUltimos5` e computa sobre a **mesma janela** (merge `teamMatches`+`cupMatchesOf`, sort por date, `slice(-5)` — extrair a construção da janela pra não divergir das linhas):

- `n` (jogos na janela), `spanDias` (`Date.parse(último) − Date.parse(primeiro)` / 86_400_000 — padrão do `restDays:815`), `gaps: number[]` (n−1 diffs consecutivos), `copas` (count de `cup: true`), `meioSemana` (count com dia-da-semana UTC ∈ {ter, qua, qui} — `new Date(Date.parse(date)).getUTCDay()` ∈ {2,3,4}).
- `resumo`: string tipo `5 jogos em 14 dias (intervalos 3-4-3-4 · 2 de copa · 2 no meio de semana)`; **degradação honesta**: `n < 2` → `janela curta (N jogo[s]) — sem leitura de densidade` (early season / promovido sem copa).
- O gap entre o último jogo da janela e o jogo ATUAL **não entra** no span — ele já é o `restDays` da linha de cima (anti-dupla-contagem por construção).

### §Copy da instrução (P3, forma exata é contrato de doutrina — ajuste fino adiado pro /i)

Na doutrina do Descanso (`:1667`), acrescentar a leitura de densidade com as 3 travas:
1. **Qualitativo**: "a densidade NÃO recalcula λ/probabilidades — é evidência pro seu ajuste de cenário" (SIN-008: sem backtest, baixíssimo peso).
2. **Assimetria**: como no descanso, o sinal é um lado em maratona e o outro em semana cheia — densidade igual dos dois lados ≈ ruído.
3. **Cruzamento rodízio**: "densidade ALTA + este jogo SEM stake real pro lado cansado → rodízio provável: cruze com o XI provável/minutagem e o banco antes de confiar no time-base"; densidade BAIXA não é sinal por si (pausa de calendário ≠ frescor garantido).

## Plano executável

Ver seção `## Plano` de [docs/features/modelos/MOD-009-densidade-do-calendario-na-forma.md](../features/modelos/MOD-009-densidade-do-calendario-na-forma.md) — os passos NÃO são duplicados aqui.
