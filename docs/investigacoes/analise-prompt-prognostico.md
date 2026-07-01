# Análise do prompt de prognóstico

**Data:** 2026-06-30 · **Alvo:** [`apps/api/scripts/prognosis-prompt.ts`](../../apps/api/scripts/prognosis-prompt.ts) (construtor do prompt) · runs auditadas em `apps/api/scripts/output/**`
**Natureza:** avaliação crítica do prompt (não é saída de `/rs`; sem pesquisa externa). Relacionado: [[MOD-001]] motor de prognóstico, [[AGT-002]] seleção de melhor mercado, [[SIN-017]] game-state/timing.

## TL;DR

A arquitetura está certa — **código calcula a âncora determinística (Poisson), LLM faz só o ajuste qualitativo**, com anti-vazamento cirúrgico por `CUTOFF`. O que derruba qualidade hoje não é o desenho, é que **alguns números injetados são ruído vestido de sinal** e há **contradições entre a persona pedida ("sharp") e o mandato de saída ("nunca passa")**. Abaixo, tudo classificado ✅ legal / 🟡 médio / 🔴 ruim, com evidência em `path:linha` e exemplo de run real.

## Atualização — 2026-06-30 (evolução + calibração)

**Adicionado desde a análise:** Graph-of-Thoughts no thinking (nós→arestas→síntese), leitura de **intenção** (joga pra ganhar / contenta-se com empate / não tá nem aí — `stakesFor` calcula o "empate basta" anti-Z), **estilo feito/sofrido** (ataques perigosos, off-target, bloqueados, fora-da-área · season + últimos 5), **clima** neutralizado (dado sim, viés "→under" não — chuva NÃO reduz gols: 2.9 vs 2.84 g/j), e a regra "cruze feito×sofrido".

**Corrigido nesta leva:**
- 🔴→✅ **#2 with/without**: `LOW_SAMPLE` 6→**12** + flag de **sinal implausível** (`dropPct < -20`: ataque que "melhora" sem o jogador = confound). Antes Anton Stach (+94% sem ele) passava limpo; agora pega ⚠️.
- 🔴→✅ **#4 1x2 por tempo**: as probabilidades 1ºT/2ºT agora são **calculadas no código** (λ da Rota B × proporção de gols por tempo) e injetadas como âncora — o modelo não "inventa" mais.
- 🟡→✅ **aritmética de `xg_bands`**: instrução "não confira a soma" + **normalização no `run-deepseek`**. Efeito medido: o reasoning caiu de **17.763 → 9.737 tokens** (menos desperdício).

**Calibração do viés (parcial):** instrução de **magnitude** — stake assimétrico forte → jogo unilateral, "não ancore tímido na média". **Efeito no número: marginal** (West Ham xG 1.29→1.20, ainda under). O modelo ancora forte na base rate, e está sendo *coerente* (xG 2.2 → under 62% é Poisson correto). O "erro" não é a conversão, é a **estimativa do xG** — e dar 1.2 a um time que marca 1.16/j (0.6 nos últimos 5) é defensável; o 3-0 foi **cauda**, não viés provado.

**⚠️ Não calibrar mais sem MEDIR.** 2 jogos under→over é amostra insuficiente — forçar mais extrapolação trocaria viés-under por viés-over. Rodar o **lote de 10-15 jogos** e medir o acerto do `best_bet` é o pré-requisito pra qualquer ajuste fino de calibração.

**Ainda pendente:** 🟡 divergência entre rotas → confiança · 🟡 mando agora *tripla-contado* (λ + instrução qualitativa + intenção) · 🟡 desfalques diluídos · 🟡 conversão cross-source · 🔴 "nunca passa" + sem odds (decisão de produto — e é o que mais alimenta o viés-under).

## Placar

| Status | Item | Onde |
|---|---|---|
| ✅ | Anti-vazamento (cutoff + recompute de tabela + escopo de season) | [:36-58](../../apps/api/scripts/prognosis-prompt.ts#L36-L58), [:415-449](../../apps/api/scripts/prognosis-prompt.ts#L415-L449) |
| ✅ | Duas rotas (gols puro × SoT×conv) + âncora Poisson determinística | [:306-331](../../apps/api/scripts/prognosis-prompt.ts#L306-L331), [:766-774](../../apps/api/scripts/prognosis-prompt.ts#L766-L774) |
| ✅ | Motivação com alcance matemático (garantido/eliminado, concorrente nomeado, saldo) | [:541-637](../../apps/api/scripts/prognosis-prompt.ts#L541-L637) |
| ✅ | Conversão exclui pênaltis (jogada aberta) | [:375-382](../../apps/api/scripts/prognosis-prompt.ts#L375-L382) |
| 🟡 | Bloco de desfalques com baixo sinal:ruído (maioria já não jogava) | [:664-677](../../apps/api/scripts/prognosis-prompt.ts#L664-L677) |
| 🟡 | Possível dupla-contagem do mando no 1x2 | [:717](../../apps/api/scripts/prognosis-prompt.ts#L717) |
| 🟡 | Divergência entre rotas não rebaixa a confiança | [:764](../../apps/api/scripts/prognosis-prompt.ts#L764) |
| 🟡 | Cruzamento por faixa de 15 min é de **gols** → ruidoso (amostra pequena) | [:748-753](../../apps/api/scripts/prognosis-prompt.ts#L748-L753) |
| 🟡 | Coerência aritmética de `xg_bands` exigida do modelo | [:778](../../apps/api/scripts/prognosis-prompt.ts#L778) |
| 🟡 | Conversão cruza fontes (gols de todos os jogos ÷ SoT só dos jogos com lineup) | [:379](../../apps/api/scripts/prognosis-prompt.ts#L379) |
| 🔴 | `with/without` de gols entrega ruído como sinal direcional (guard fraco) | [:279](../../apps/api/scripts/prognosis-prompt.ts#L279) |
| 🔴 | "Nunca passa" contradiz a persona sharp **e** a tese do projeto | [:789](../../apps/api/scripts/prognosis-prompt.ts#L789), [:794](../../apps/api/scripts/prognosis-prompt.ts#L794) |
| 🔴 | Fala em "valor" mas o prompt não tem **nenhuma odd** | conceitual |
| 🔴 | `one_x_two_1t`/`_2t` pede "derive do Poisson" sem fornecer os λ por tempo | [:783](../../apps/api/scripts/prognosis-prompt.ts#L783) |

---

## ✅ Legal (manter)

1. **Anti-vazamento.** `CUTOFF = match.date`; tabela recomputada só com `played < CUTOFF`; da `standing` oficial lê-se apenas a *contagem* de vagas por zona (regra, não resultado). O prompt é exatamente a foto pré-jogo. É o ponto mais forte.
2. **Âncora Poisson + duas rotas.** Dar probabilidades já calculadas ataca a tendência da LLM de comprimir tudo pra ~40%. Rota B (SoT×conversão) como principal é a escolha certa — SoT é 3× mais denso que gols.
3. **Motivação matemática.** `canFinishAbove`/`guaranteedAbove` + `contestersFor` + distância de saldo ("Brighton precisa virar −5 em 1 jogo") é genuinamente on-thesis com [[projeto-aposta-precisa-de-evidencia]]. Sofisticado e auditável.
4. **Pênaltis fora da conversão.** Pênalti (~76%) não é finalização de jogada aberta; tirá-lo evita inflar a eficiência.

## 🟡 Médio (funciona, tem ressalva)

1. **Desfalques diluídos.** Quase todo desfalque listado tem `recentPctInvolve = 0%` ("participou de 0/15 gols") — ou seja, já não jogava, e pela própria regra anti-double-count [:708](../../apps/api/scripts/prognosis-prompt.ts#L708) o impacto é ~zero. O maior bloco do prompt é majoritariamente não-acionável. **Fix:** colapsar os não-acionáveis (já fora há tempo / zero contribuição) numa linha-resumo, destacar só os 1-2 que pesam.
2. **Mando no 1x2.** Os λ já são por-mando; somar a instrução qualitativa "não dê o visitante como favorito" [:717](../../apps/api/scripts/prognosis-prompt.ts#L717) + a motivação pode empilhar 3 forças pró-mandante sobre um λ que já tem mando. **Fix:** suavizar a instrução qualitativa.
3. **Divergência entre rotas é informação descartada.** Em Tottenham×Everton o 1x2 foi **Rota A 21/25/54** (visitante) vs **Rota B 39/28/33** (mandante) — inversão total. O prompt só diz "prefira B". **Fix:** atar `confidence` ao gap A↔B (gap grande → confiança baixa).
4. **Faixa de 15 min é de gols.** Ver pergunta (b) abaixo — granularidade alta + evento raro = ruído. Componente provavelmente mais fraco do prompt hoje.
5. **Aritmética no modelo.** Exigir que 6 `xg_bands` somem exatamente `xg` é coisa que LLM erra. **Fix:** normalizar no `persist`, não pedir ao modelo.
6. **Conversão cruza fontes.** Numerador = gols de *todos* os jogos; denominador = SoT só dos jogos *com lineup* [:379](../../apps/api/scripts/prognosis-prompt.ts#L379). Na PL completa coincide; em season parcial infla. O `Math.max(0, …)` mascara o gap em vez de sinalizar.

## 🔴 Ruim (corrigir — degrada a decisão)

1. **`with/without` de gols = ruído como sinal.** Run real (Forest, [prompt.md:59](../../apps/api/scripts/output/21b6ffa6-4ba8-42e1-b584-f92a01148c90/2026-06-29T12-16-56/prompt.md)): **Callum Hudson-Odoi** (desfalque) → *"com ele 0.93 g/j (30j) vs sem ele 2.71 g/j (7j) = +191%"* — o time marca 191% **mais** sem um jogador que está fora por lesão. É confound temporal (jogou no começo ruim, lesionou na fase boa). O guard `confound` [:279](../../apps/api/scripts/prognosis-prompt.ts#L279) só pega `G+A==0` ou amostra `< 6`; com 7 G+A e 7/30 jogos, **passa sem ⚠️**. A LLM pode concluir "tirar ele melhora o ataque". **Fix:** subir `LOW_SAMPLE` (7 jogos é variância demais p/ média de gols → ~12-15) **e** flaggar sinal implausível (ausência que "melhora" muito o ataque vira ⚠️, não número solto); ou encolher o with/without de gols para a média (shrinkage).
2. **"Nunca passa" contradiz persona e tese.** O prompt pede um **sharp** ("busca valor, não certeza") mas manda "escolha SEMPRE um… não há opção de passar" [:789](../../apps/api/scripts/prognosis-prompt.ts#L789). Sharp real passa na maioria dos jogos. Em Forest×Bournemouth **os dois lados têm motivação "baixa"** — o "jogo sem história" que [[projeto-aposta-precisa-de-evidencia]] diz pra **não** apostar; o prompt força aposta. **Achado concreto:** o schema **já tem `"none"`** em `best_bet_market`/`best_bet_selection` ([leagues.ts:416-417](../../apps/api/src/db/schemas/leagues.ts#L416-L417)) — "não apostar" foi modelado no banco e depois bloqueado no texto. **Fix (decisão de produto):** reabilitar "none" com critério (ex.: edge < X, ou jogo sem stake dos dois lados).
3. **"Valor" sem odds.** O prompt fala em valor/EV o tempo todo mas não fornece **nenhuma odd**. Valor = probabilidade própria vs preço implícito da odd; sem odds o modelo confunde *maior probabilidade* com *maior valor*. Gap conceitual mais fundo do `best_bet`. **Fix (decisão de produto):** injetar odds de mercado (ver [[SIN-012]] mercado-odds) ou assumir explicitamente que o `best_bet` é "probabilidade pura", não valor.
4. **1x2 por tempo sem âncora.** [:783](../../apps/api/scripts/prognosis-prompt.ts#L783) pede "derive do Poisson com os λ do respectivo tempo", mas os **λ por tempo nunca são calculados** — só `halfSplit` (gols por tempo). Justo nos 2 campos onde se pede Poisson, o modelo tem que inventar — o oposto do "ancore, não invente". **Fix:** calcular `marketProbs` por tempo no código e injetar (já há os ingredientes em [:157](../../apps/api/scripts/prognosis-prompt.ts#L157)).

---

## Propostas em avaliação (perguntas do João, 2026-06-30)

### (a) Review dos últimos 5 jogos ("mês atual") no input e no output
**Recomendação: sim, mas como camada de AJUSTE, não como 2ª base rate, e com guarda de amostra.**
- O dado de input **já existe** — `recentForm(5)` e `recentForm(10)` injetados via `formLines` ([:288-304](../../apps/api/scripts/prognosis-prompt.ts#L288-L304), [:680-685](../../apps/api/scripts/prognosis-prompt.ts#L680-L685)): seq V/E/D, pts, gf/ga, SoT feito/sofrido + setas ↑↓ vs season.
- Risco: 5 jogos = amostra pequena = **mesmo problema do with/without (#1)**. Métricas finas dos últimos 5 (conversão, big chances) seriam ruído. E forçar uma "review do recente" induz **recency bias** — o viés que separa amador de sharp.
- Como fazer bem: (1) no input, enriquecer só com métricas robustas em n=5 (sequência, SoT — denso) e o **delta** vs jogos anteriores (a direção é o sinal); (2) no output, **1 frase de momento no `summary` por time** ou um campo curto `momentum` — não duplicar a análise inteira; (3) instruir o **peso**: recente ajusta a base estável, não a substitui, salvo causa nomeada (técnico novo, onda de lesões). Alinha com [[teoria-ressaca-meio-de-semana]].

### (b) Análise estatística por faixa de 15 min (remates/chances criadas)
**O que temos HOJE no banco, com minuto:** só **gols** (`goal.minute`) e **cartões** (`card.minute`), e o texto do **commentary** (`commentary.minute`, narração livre). **Remates / SoT / big chances / key passes estão ingeridos só como total do jogo, SEM timestamp** (`lineup_player` e `match_team_stats` — [leagues.ts:236-274](../../apps/api/src/db/schemas/leagues.ts#L236-L274)). O cruzamento por faixa que já existe no prompt é de **gols**.

**O que a SportMonks OFERECE e ainda não ingerimos** (doc consultada nesta sessão, 2026-06-30): o include **`trends`** = série temporal por minuto. Entidade `Trend`: `{ fixture_id, participant_id, type_id, minute, value, period_id }`, filtrável por `&include=trends&filters=trendTypes:<ids>`. Cobre **shots-total (42), shots-on-target (86), big-chances-created (580), xG (5304)** etc. por minuto e por time. A doc afirma estar **incluído em todos os planos base, sem custo extra** ([Trends](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/trends), [entidade Trend](https://docs.sportmonks.com/v3/endpoints-and-entities/entities/statistic)). Nosso `sync-sportmonks.ts` hoje só puxa `events`, `statistics` (agregado) e `lineups.details` — **não** `trends`.

**Recomendação: a intuição é boa — e tem caminho de dado real, melhor do que gols.** Com **gols** o "a cada 15 min" é ruído (~47 gols ÷ 6 faixas ≈ 8/janela em 37 jogos; a diferença 0.22 vs 0.05 da run do Forest é variância, não padrão → a LLM faz **apofenia**, lê história em ruído). Mas com **SoT/shots por minuto** (3× mais denso) a janela ganha amostra e deixa de ser ruído. Caminhos, em ordem:
- **Anti-apofenia no prompt (barato, já):** "trate faixas de 15 min como sugestão fraca (amostra pequena); não construa narrativa de timing sobre diferença pequena entre janelas."
- **Robusto sem ingestão nova:** agregar para **1ºT vs 2ºT** (já temos `halfSplit`) ou terços (0-30/30-60/60-90).
- **A jogada de verdade (ingestão nova):** ingerir `trends` (SoT/shots/big chances/xG por minuto) → tabela `match_trend` + 1 include no sync + backfill. Aí o prompt ganha um perfil de **pressão temporal real**, não gols ruidosos. **A validar empiricamente (não dá p/ testar a API daqui):** cobertura real da PL, granularidade (de quantos em quantos minutos) e se `value` é cumulativo ou incremental. Encosta em [[SIN-017]] (game-state/timing) e [[MOD-002]] (xG).

---

## Próximos passos (prioridade)

| # | Ação | Esforço | Tipo |
|---|---|---|---|
| 1 | Guard do `with/without` (LOW_SAMPLE↑ + flag de sinal implausível) | baixo | bug de sinal |
| 2 | λ + probs 1T/2T no código (tira "invente" do 1x2 por tempo) | médio | correção |
| 3 | `confidence` atada ao gap entre rotas A↔B | baixo | melhoria |
| 4 | Enxugar desfalques não-acionáveis + nota anti-apofenia nas faixas | baixo | sinal:ruído |
| 5 | Momento dos últimos 5 no output (1 frase) + regra de peso | baixo | proposta (a) |
| 6 | Reabilitar `best_bet = "none"` em jogo sem stake | — | **decisão de produto** |
| 7 | Injetar odds (ou assumir "probabilidade pura") | — | **decisão de produto** |
