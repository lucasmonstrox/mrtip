# Dossiê — Motor de Prognóstico mrtip: mercados, fases do jogo, contexto e temas transversais

> Insumo consolidado para investigação (`/rs`) e plano de melhoria do prompt (`apps/api/scripts/prognosis-prompt.ts`).
> Escopo: (A) gap por mercado, (B) pesquisa de fases temporais, (C) contexto não-estatístico, (D) temas transversais.
> Ênfase pedida: **o cruzamento fases-do-jogo × muitos/poucos gols**.

## Como ler este dossiê

O prompt de hoje já opera a filosofia certa: **Poisson é o PRIOR (âncora `marketProbs` em duas rotas — gols puros e SoT×conversão), o roteiro do jogo é a ATUALIZAÇÃO**, a intenção/stakes move o número, e há disciplina de variância na escolha do mercado. As três alavancas de melhoria, por ordem de retorno:

1. **Correção estrutural do motor** (barata, sem dado novo, alto impacto): Dixon-Coles no grid; decaimento temporal no λ; materializar o grid de placar (hoje é computado e descartado) para abrir placar exato, margem/handicap, paridade, multigoals, HT/FT, tempo-com-mais-gols, first-to-score — **todos derivam de uma única matriz de placar conjunta**, o que garante coerência entre mercados.
2. **Baseline de liga por fase** (barata): hoje o prompt mostra o número absoluto do time por faixa de 15min mas **não tem contra o que comparar** — falta o prior de liga (~44/56 1ºT/2ºT, curva crescente com pico em 76-90) para o LLM saber se um time é anômalo.
3. **Ingestão de odds** (cara, `needs_new_data`): sem preço, o motor produz probabilidade justa, não valor/EV/CLV. É o maior buraco conceitual, mas fora de escopo imediato.

**Princípio-mãe transversal (D):** todo mercado novo deve nascer do MESMO grid Poisson corrigido por Dixon-Coles — nunca de modelos marginais separados por mercado. Isso evita "mercados fantasma" que parecem se confirmar mutuamente só porque vieram de pipelines diferentes, e é exatamente o erro de correlação que as casas exploram no same-game parlay.

---

# PARTE 1 — POR MERCADO

## 1.1 Match Result / 1X2

**Como o sharp pensa.** O 1X2 de ligas grandes é o mercado mais eficiente que existe — probabilidade própria só vira edge quando bate contra a odd de fechamento devigada (Pinnacle, margem ~2-4%). O edge estrutural do 1X2 vive em: (a) **empate subprecificado** em jogos equilibrados de poucos gols (o erro mais persistente do público); (b) **dead-rubber / stake assimétrico**; (c) **fade de time de marca** fora de forma (volume emocional infla o favorito popular); (d) **favorite-longshot bias** (favoritos rendem ~-1 a -2%, azarões -10 a -15% — ceticismo extra quando o Poisson aponta valor no underdog).

**O que o prompt já cobre.** Prob própria home/draw/away em 2 rotas + por tempo; vantagem de casa embutida no λ (split casa/fora, sem double-count); forma qualificada pela posição do adversário; motivação/dead-rubber com alcance matemático; fadiga cross-competição; desfalque ponderado por importância; AH e O/U saindo do mesmo prior (coerência parcial).

**O que falta.**
- **Empate como aposta de valor nunca é sugerido** — a filosofia anti-timidez ("nunca regride pro meio", "sempre crave gol/lado") empurra sistematicamente CONTRA cravar o X, justo o resultado que o mercado mais erra.
- **`double_chance` e `draw_no_bet` não existem no enum** de `best_bet.market`, embora o próprio veredito de intenção ("trava") MANDE preferir dupla chance em prosa — contradição interna que força o modelo pra 1x2/team_total.
- **Fade de reputação vs forma** não é um nó do raciocínio (o bloco de notas existe pra NÃO rebaixar elenco forte — o oposto).
- **Sem H2H**; **sem desconto de regressão de sequência** (streak ≥4V/4D é parcialmente variância); **mando por-time** (delta vs liga) não é surfaceado; **sem fair odds no-vig** na saída.

**Mudança concreta no prompt.**
1. Adicionar `"double_chance"` (selection `1X`/`12`/`X2`) e `"draw_no_bet"` (selection `home`/`away`) ao enum de `best_bet.market` (linha ~1255) e ao mapa de `selection` (linha ~1261).
2. Nova regra no bloco de disciplina de variância: **quando as duas rotas dão draw ≥ ~30% E o veredito de intenção é "trava"/"empate basta" E o xG total do prior < ~2.3, o EMPATE (ou DC X2/1X) é pick de VALOR legítimo — não rebaixar por covardia.** Setar `general.draw_value_flag`.
3. Emitir `general.fair_odds_1x2 = {home, draw, away}` (no-vig, `1/prob` normalizado) — ponte barata para CLV futuro.
4. Nó de raciocínio "reputação vs forma atual": nota de season de time grande contradizendo a forma recente qualificada → candidato a sobrevalorização, não dar favorito "óbvio" pela camisa.
5. Regra de regressão de streak: sequência ≥4V/4D é parcialmente variância; regredir em direção à base rate a menos que o volume (SoT/xG-proxy) sustente.

**Vínculos wishlist:** W-034 (postura lida da forma) alimenta o nó reputação-vs-forma; W-051 (motivação interdependente) reforça o gatilho de empate/dupla-chance em resignação do perseguidor.

---

## 1.2 Over/Under (total de gols) — MERCADO CENTRAL

**Como o sharp pensa.** Poisson/Dixon-Coles como prior, roteiro como update. Público empilha no Over (torcedor gosta de gol) → valor costuma estar no Under quando a linha está inflada. **Duas defesas vazando é sinal MAIS forte de Over do que dois ataques fortes.** xGA dos dois lados > xG dos dois lados. xG/criação preditivos > gols crus (filtra sorte de finalização; regride à média). Opponent-adjusted obrigatório.

**O que o prompt já cobre.** Base rate Poisson ataque×defesa por mando + rota SoT×conv; split casa/fora; desfalque muda distribuição (volume próprio + ausência defensiva sobe λ adversário); motivação/veredito de intenção; fadiga + viagem; **clima já calibrado localmente** (chuva/vento NÃO correlacionou nesta liga — melhor que o prior genérico); timing por faixa; disciplina de escolha da linha (1.5–3.5, não preso ao 2.5); estilo feito/sofrido; momentum.

**O que falta (prioridade alta).**
- **Sem correção Dixon-Coles:** `marketProbs()` usa Poisson INDEPENDENTE (`ph[h]*pa[a]`), que subestima 0-0/1-0/0-1/1-1 e **SUPERESTIMA Over e BTTS** — o viés nº1 do mercado de total. Como `over25_prob`/`btts_prob` partem desse prior, o viés contamina toda a saída.
- **Sem decaimento temporal** no λ: um jogo de agosto pesa igual a um de dezembro; forma vive só num bloco separado, no olho.
- **Falta a regra de síntese "as duas defesas cedem"** hierarquizada acima de "os dois atacam bem".
- **Divergência resultado vs volume** (SoT recente) não vira sinal de regressão explícito.
- **Sem H2H**; **médias de gols não ajustadas por força de calendário (SOS)**; **sem cautela de mata-mata/derby** (jogo de decisão fecha por cautela tática).

**Mudança concreta.**
1. **Aplicar fator τ de Dixon-Coles** (ρ ≈ −0.03 a −0.15, calibrado por MLE, não chutado) sobre `p(0,0),p(1,0),p(0,1),p(1,1)` dentro de `marketProbs()`; recalcular over15/25/35 e btts a partir da matriz corrigida. Nota no bloco: "Prior já corrige a correlação de placar baixo — não inflar Over/BTTS por cima disto."
2. Ponderar `avg()`/`sotAvg()` do λ por `exp(-ξ·dias_até_cutoff)`; ξ calibrado por backtest out-of-sample (log-loss/RPS), meia-vida 3-6 meses para responsividade. Alternativa barata sem novo dado: expor `lambda_recente` (últimos ~8 com peso) ao lado do λ season para o modelo ver a divergência. **Atenção:** com 1 season só de dados, ξ tende a 0 — só compensa com múltiplas temporadas (relevante quando LIG-011 trouxer cross-competition/cross-season).
3. Bullet no método: **"Para Over, PESE MAIS a fragilidade das DUAS defesas (SoT sofrido + conv_def + big chances concedidas dos dois lados) do que dois ataques fortes isolados."**
4. Linha derivada de forma por time: `delta forma = pontos ult.5 vs SoT feito/sofrido ult.5 → resultado ACIMA/ABAIXO do volume (sorte de finalização a regredir)`; instrução "quando resultado e volume divergem, confie no volume".
5. `gf/ga ajustado por SOS` ao lado da média crua ("marca X/j · ajustado por adversário Y").

**Novos campos de saída:** `over_under_ladder` (probs de Over em 1.5/2.5/3.5), `game_openness` (0-100, result-agnostic — separa a tese de O/U da convicção de 1x2), `regression_flag` por time.

---

## 1.3 BTTS (ambas marcam)

**Como o sharp pensa.** Cruza P(mandante marca) × P(visitante marca) por **duas vias**: Poisson (volume) e **frequência** (quantas vezes de fato aconteceu — método Academia). Convergência = confiança, divergência = investiga o elo instável. **Clean sheet % é o TETO do BTTS.** Sinal mais forte: **defesa sortuda** (poucos gols sofridos + alto volume de chances concedidas = xGA mascarado prestes a regredir → pró-BTTS-Yes). Desfalque de CB/volante destrava BTTS mais que ausência de atacante.

**O que o prompt já cobre.** BTTS como produto de duas probs quase-independentes em 2 rotas; `btts_prob` partindo do prior; consistência season (marcou X/Y, clean sheet, BTTS X/Y); convDef + SoT sofrido + estilo; desfalque defensivo → +λ adversário; efeito 1-0/administração; anti-BTTS quando um lado desengajado.

**O que falta.**
- **Âncora de BTTS por frequência** cruzando os dois times (os ingredientes existem soltos, nunca são cruzados).
- **Big chances e chutes-na-área CONCEDIDOS** não são surfaceados (só os FEITOS) → "clean sheet enganoso" invisível.
- **BTTS streak recente** por time (marcou/sofreu em X/5) — hoje só há BTTS season-wide.
- **Dixon-Coles** (superestima BTTS em λ baixo).
- **BTTS-Yes tratado sempre como o mercado mais arriscado** — mas 1-1 GANHA BTTS e PERDE Over 2.5; em jogo de ritmo baixo-médio BTTS-Yes é MAIS seguro.
- **Ponto de valor "favorito vence mas não fecha" (2-1/3-1)** não é nomeado.

**Mudança concreta.**
1. Computar `bttsFreq = P(home marca) × P(away marca)`, com `P(home marca)=média(freq home marcou, 1-cleanSheet%_away)`; adicionar linha na tabela de probabilidades: "BTTS via frequência: X% (P(mand.) Y% × P(vis.) Z%)". Emitir `home.scores_prob`/`away.scores_prob`.
2. Linha defensiva-concedida por time ("Concede: A big chances/j · B chutes-na-área/j · convDef C%") + regra "clean sheet pode ser SORTE — cruze com o volume concedido".
3. `BTTS recente: marcou em X/5 · sofreu em Y/5 · ambos em Z/5`.
4. Refinar a escala de variância: "btts não é idêntico a over — 1-1 GANHA BTTS e PERDE over 2.5. Em jogo de total baixo-médio com ambos marcando sem estourar, BTTS-Yes é MAIS seguro que over 2.5."
5. Ramo no roteiro: "Favorito que VENCE mas historicamente NÃO fecha (clean-sheet% baixo, convDef alto) → roteiro 2-1/3-1 → BTTS-Yes convive com vitória."
6. Enquadrar `clean_sheet%` como teto: "não emita btts_prob acima do menor (1 − clean_sheet%) dos dois times sem roteiro que justifique."

**Novos campos:** `home/away.clean_sheet_prob`, `general.btts_prob_freq`.

---

## 1.4 Handicap Asiático

**Como o sharp pensa.** AH é mercado de **margem de gols esperada**, não de vencedor. **Sem viés estrutural de favorito** (ao contrário do 1x2) — o edge vem da leitura de margem, não de bancar o forte por reflexo. Precificação fina vive nos quartos de gol (−0.25/−0.75/−1.25). Quando a margem justa cola num inteiro, a linha COM push (−0.75/−1) tem perda esperada menor que a de meio gol adjacente (edge de variância, Hegarty & Whelan 2023).

**O que o prompt já cobre.** `handicap` é mercado de saída (−1/−1.5/+1); o joint Poisson já é computado; λ por mando; intenção/roteiro que desloca a margem; escada de variância; anti-timidez na magnitude do xG.

**O que falta.**
- **Nenhuma distribuição de diferença de gols é emitida** — o joint é jogado fora; `P(por 2+)`, `P(por 1)`, `P(empate)` descartados. O modelo escolhe handicap sem âncora de margem.
- **Vocabulário travado em −1/−1.5/+1** — sem quartos, sem push/meia-vitória.
- **Sem perfil de margem por time** (blowout team vs narrow winner).
- **Sem push accounting**, **sem AH 0 / DNB**, **sem aviso de ausência de viés favorito**.

**Mudança concreta.**
1. Estender `marketProbs` para acumular `P(diff=k)` do joint: `home_by_2plus, home_by_1, draw, away_by_1, away_by_2plus`; derivar prob de cobrir cada linha do grid (0, ±0.25, ±0.5, ±0.75, ±1, ±1.25, ±1.5). Bloco "## Handicap asiático (linha justa)" logo após "Probabilidades de mercado".
2. Trocar `best_bet.line` de "(−1,−1.5,+1)" pela grade completa de quartos + 2-3 linhas explicando split stake.
3. `marginHistogram(id)` sobre placares: "Quando vence: 55% por 1, 30% por 2, 15% por 3+ → mau candidato a −1.5".
4. Regra na disciplina de variância: "quando a margem justa fica perto de INTEIRO, prefira a linha COM push". Emitir `best_bet.push_prob`.
5. Frase: "handicap NÃO tem viés estrutural de favorito — o valor sai da leitura de margem, não de 'o forte é forte'".

**Novos campos:** `general.ah_fair` (linha justa, incremento 0.25), distribuição de margem, `best_bet.push_prob`.

---

## 1.5 Handicap Europeu (3-way)

**Como o sharp pensa.** Payoff diferente do AH: favorito −1 vencendo por exatamente 1 é **APOSTA PERDIDA** (empate-de-handicap), não push. A variância do diferencial (λ soma) dita a chance de empate-de-handicap. Game-state importa: favorito que administra cobre −2 MENOS que o Poisson ingênuo sugere.

**O que falta.** O mercado não existe na saída (só AH). O motor não distingue a semântica perda vs push — **risco real de recomendação enganosa** se o front rotular "handicap" ambiguamente.

**Mudança concreta.**
1. `general.euro_handicap = {line, selection}` + `"euro_handicap"` no enum, com nota explícita da diferença perda-vs-push. Posicionar acima do AH em risco (não tem a rede do push).
2. Mesma extensão de `marketProbs` da 1.4 (buckets de margem) alimenta a distribuição prior.
3. `marginHistogram` distingue "fecha por 1 gol → empate-de-handicap provável → NÃO banque −2" de "atropelador".
4. Amarrar game-state à margem: "se o favorito ADMINISTRA, a prob de cobrir −2 fica ABAIXO do Poisson; se 🔥 os dois vão pra cima, a margem ABRE".
5. Exibir `general.expected_supremacy = λ_home − λ_away` + variância (λ soma).

**Vínculo wishlist:** W-053 (H2H treinador×treinador) refina a leitura de margem quando o duelo de estilos historicamente trava/abre.

---

## 1.6 Double Chance & 1.7 Draw No Bet

**Como o sharp pensa.** Hierarquia de proteção: **Vitória Seca > DNB > Dupla Chance** (DC embute o vig duas vezes; casa cobra MAIS margem na DC porque o público a compra por "segurança"). DNB ≡ AH 0 ≡ lay do empate. Usar DC quando o EMPATE em si é resultado de sucesso (azarão sólido, mata-mata); DNB quando a convicção é vitória de um lado e o empate é o único risco a neutralizar. **"Falso favorito"** (vence/pontua acima do que SoT×conv sustenta) → DC no azarão monetiza a regressão sem precisar o azarão vencer.

**O que o prompt já cobre.** Prob de empate nas 2 rotas (matéria-prima do preço sintético da DC); divergência Rota A>B lida como "sorte de finalização que regride"; solidez do azarão (convDef, clean sheet, estilo sofrido); "empate basta"; veredito assimétrico sugere DC em prosa; congestionamento; mata-mata detectável (`league.type='cup'`).

**O que falta.** DC e DNB **não são selecionáveis** (contradição com o próprio prompt que manda preferir DC); sem linha de prior de DC na tabela; "falso favorito" não vira veredito acionável; **sem baseline estrutural de empate** (taxa da liga + H2H — o Poisson independente subestima empates); regra de liquidação em mata-mata (DC/empate liquida nos 90min) não explorada; sem distinção DC vs DNB; sem guardrail de que DC é menor-variância, não valor.

**Mudança concreta.**
1. Adicionar `"double_chance"` (1X/X2/12) e `"draw_no_bet"` (home/away) ao enum; encaixar DC na escada de variância ENTRE handicap-de-favorito e over_under, e DNB no degrau (3.5) entre handicap e 1x2 seco.
2. Em `marketProbs`: `dc1X=home+draw`, `dcX2=draw+away`, `dc12=home+away`; 3 linhas de prior + linha `DNB derivada = home/(home+away)`.
3. Gatilho "FALSO FAVORITO" no método (após linha ~1126): "se o favorito marca/vence acima do que λ_SoT×conv sustenta (conversão insustentável, goleiro/artilheiro em pico), considere DC no AZARÃO — captura o tropeço sem depender do azarão vencer".
4. `leagueDrawRate = empates/played.length` + `h2hDrawRate`; instrução: "se baseline > Poisson, puxe a fatia de empate (e da DC) pra cima".
5. Nota de mata-mata: "DC/empate LIQUIDA nos 90min (ignora prorrogação); empate em tempo normal é frequente (times seguram pra prorrogação) → 1X/X2 ganham valor de regra".
6. Regra de decisão DNB vs DC: "DNB quando a convicção na vitória é alta e o empate é o único risco; DC quando a tese é NÃO-DERROTA com empate provável (o empate PAGA)".
7. Guardrail: "DC é escolha de MENOR VARIÂNCIA por PROBABILIDADE, não alegação de VALOR — casas embutem margem MAIOR na DC. Só recomende quando a prob real da dupla está claramente subestimada pelo roteiro."
8. Flag/nota "FAVORITO INSTÁVEL / empate subvalorizado": índice de empate = (empate Poisson ≥ ~28%) AND (favorito moderado, vitória ~45-62%) AND (≥2 empates nos últimos 5 OR desfalque ofensivo OR fadiga assimétrica) → "considere DNB no adversário, DNB defensivo, ou o EMPATE puro".

**Vínculo wishlist:** W-051 (resignação do perseguidor) é o gatilho natural do "empate basta"/DC.

---

## 1.8 Correct Score / Placar Exato

**Como o sharp pensa.** Parte do **grid completo**, nunca de um placar isolado; aposta em cluster de 3-4 placares do mesmo roteiro (o modal raramente passa de ~12%); staking fracionário; só crava onde a odd oferecida > odd justa devigada (overround do mercado exótico é 20-40%).

**O que falta.** O grid `ph[h]*pa[a]` é computado em `marketProbs` e **descartado** — o modelo nunca vê nem devolve placar. Sem Dixon-Coles (subestima 0-0/1-0/1-1, as células mais líquidas). Sem disciplina específica de placar (o `best_bet` único força "nunca passar").

**Mudança concreta.**
1. Em `marketProbs`, coletar as células h,a≤5 num array ordenado (`topScores`); bloco "## Grid de placar exato (seu PRIOR)" com ~8 placares + %.
2. `general.correct_score` = 3-4 placares ranqueados {score, probability} movidos pelo roteiro + `general.score_scenario` ("jogo travado 0-0/1-0/1-1" vs "aberto 2-1/2-2/3-1") — a ponte entre o veredito de intenção e o grid.
3. Dixon-Coles nas 4 células baixas + instrução: "em veredito TRAVA, desloque massa pra 0-0/1-0/0-1/1-1 além do Poisson; em os-dois-pra-cima, o contrário".
4. Spec: "3-4 placares do MESMO roteiro, nunca um só; se for best_bet, confidence ≤ medium".
5. Checagem de coerência interna: "a massa dos placares de vitória bate com `one_x_two`; a dos placares 3+ bate com `over25_prob`".

---

## 1.9 HT/FT (intervalo/final) — 9 combinações

**Como o sharp pensa.** É aposta **condicional composta**, NÃO um 1x2 dobrado. O público superestima 1/1 e 2/2 e ignora **X/1 e X/2** (favorito que empata o 1ºT e decide no 2ºT) — o spot de valor mais consistente, porque o 2ºT abre e o favorito assume. Margem da casa na grade é a MAIOR (15-20%). Viradas (1/2, 2/1) são raras e já precificadas — não perseguir pela odd.

**O que o prompt já cobre.** Split de xG/gols por tempo; `one_x_two_1t`/`_2t` isolados; timing por faixa; fadiga assimétrica favorecendo o lado fresco no 2ºT; momentum com marcador `‖INTERVALO‖`; intenção/stakes.

**O que falta.** HT/FT não existe como mercado composto — o prompt trata os dois tempos como 1x2 ISOLADOS e nunca os combina. Falta a **matriz condicional 3×3** ancorada no código.

**Mudança concreta.**
1. `htftMatrix()`: combinar a distribuição Poisson do 1ºT (`lamH*hShare1`, `lamA*aShare1`) com o incremento do 2ºT; imprimir as 9 probabilidades como PRIOR.
2. `general.ht_ft` (9 células ou top-3) + `"ht_ft"` no enum; selection formato `X/1`, `1/1`, `X/2`.
3. Instrução: "o valor tende a estar em X/1 e X/2, não em 1/1 puro"; ramo no roteiro "se um lado CEDE mais no 2ºT (half-split sofrido) e/ou chega mais cansado, e o outro é superior mas encontra bloco baixo no 1ºT → X/1 ou X/2".
4. Anti-romance: "viradas (1/2, 2/1) são raras e já precificadas — NÃO as banque pela odd".
5. Ajustar `hShare1` pela vulnerabilidade de 2ºT do adversário, não assumir 45/55 cego.

**Vínculo wishlist:** W-033 (game script quem marca primeiro) alimenta a cascata que produz X/1 e X/2.

---

## 1.10 Team Totals (total individual)

**Como o sharp pensa.** Mercado DERIVADO (precificado por fórmula, linhas lentas). **Viés de blowout:** favorito que abre vantagem grande desacelera → team-total-over ALTO dele é armadilha; valor no UNDER do total do favorito. Under do team-total = clean sheet do adversário (público infla o over). SOS obrigatório. Coerência: soma dos dois team totals = total do jogo.

**O que o prompt já cobre.** Split casa/fora no λ; motivação wired especificamente no team_total (over 1.5 só pra quem PRECISA; over 0.5 pra time satisfeito); desfalque de um lado; SoT×conv; estilo/pace; disciplina elege team_total como menor risco; fadiga/viagem/clima.

**O que falta.** **Nenhum prior numérico de total individual** — o mercado que a própria filosofia mais recomenda é o único sem número calibrado (crava no olho). Sem viés de blowout; sem SOS no λ; sem flag de over/under-performance de finalização; sem prior de under via clean sheet.

**Mudança concreta.**
1. `ttProbs(λ)`: `tt_over05=1−e^−λ`, `tt_over15=1−e^−λ(1+λ)`, `tt_over25` nas duas rotas. Tabela "Total individual (Poisson por time)" com over0.5/1.5/2.5 por lado + coluna espelho "under 0.5 = clean sheet contra (=e^−λ)". Fechar com "a soma dos dois totais individuais deve bater o total do jogo (coerência interna)".
2. Bullet viés de blowout: "quando λ_favorito ≥ 2× λ_adversário, NÃO extrapole o team_total over ALTO do favorito — com 2-0 ele reduz risco; over 2.5 costuma ser armadilha. Confira a distribuição por faixa: favorito que marca pouco em 61-90 confirma a desaceleração."
3. `λ_sos_adj` (gols normalizados pela qualidade das defesas enfrentadas) ao lado do λ cru.
4. `finishing_regression` {super|sub|neutro} comparando conversão do time vs liga.

**Novos campos:** `home/away.tt_over05/15/25_prob`, `home/away.clean_sheet_prob`, `home/away.lambda_sos_adj`.

---

## 1.11 Escanteios (total / handicap / race)

**Como o sharp pensa.** Mercado de **pressão ofensiva**, separado do placar, soft/mal-precificado fora das ligas grandes. Nunca blendar casa+fora (o erro nº1 — um time pode bater a linha em 2/19 em casa e 10/19 fora). Driver central é **cruzamento** (entrada larga + cross defendido), não posse. Corners chegam em **rajadas correlacionadas** (Poisson simples mis-precifica caudas). Game-state: time que persegue dispara corners nos 15-20min finais. Jogo faltoso/truncado REDUZ corners (contraintuitivo).

**O que o prompt já cobre... como dado ingerido mas nunca lido.** `matchTeamStats.corners` (type 34), `matchTrend` type 34 (corners/min), `crossesTotal`/`crossesAccurate` (98/99), `freeKicks` — **todos no schema, nenhum consultado pelo prompt**. Splits casa/fora e veredito de intenção já são maquinaria reutilizável.

**Mudança concreta.**
1. `general.corners {total, home, away, line, pick, over_prob, confidence}` + `"corners"|"corners_handicap"|"team_corners"` no enum. Bloco "## Escanteios (base rate + splits)".
2. Clonar `lambdaHome/Away` com corners: `expectedCornersHome = corners_casa(mand) × (corners_concedidos_fora(vis)/média_corner_casa_liga)`. Adicionar `corners` ao `TeamStatField`.
3. Splits casa/fora feito/concedido (nunca blendar) + média de corner casa/fora da liga.
4. Estender `styleLine` com cruzamentos feito/sofrido; bloco "como ler" (cruzador vs bloco baixo = alto corner; press mútuo alto = baixo; posse NÃO é proxy).
5. Game-state via veredito de intenção (perseguidor + placar adverso = rajada final; administrado = under) e via `matchTrend` type 34 × minuto dos gols.
6. Cautela de variância/cauda ("rajadas correlacionadas, base rate é prior FROUXO, exija margem grande"); nota "favorito no 1x2 ≠ favorito em corners"; `freeKicks` alto → desconta corners.

---

## 1.12 Cartões / Faltas / Disciplina

**Como o sharp pensa.** **Árbitro é a variável DOMINANTE** (pode deslocar 20%+ sozinho; valor no árbitro rígido escalado pra jogo de meio de tabela que o público ignora). Stakes multiplica intensidade (+1M de prêmio = +0.07 falta/jogo; derby PL bate over 3.5 cartões 70-78% vs 48% da liga). Time já rebaixado RELAXA. xB (expected booking) mais estável que média bruta.

**O que o prompt já cobre... como dado ingerido não lido.** `stakesFor()` com alcance matemático já é o multiplicador de intensidade; `timing()`/`BANDS` já servem para cartões (`card.minute` tem o mesmo shape); `freeKicks`/`tackles`/`duelsWon` ingeridos; tabela `card` populada no ingest — **nunca consultada pelo prognosis-prompt**. **Árbitro não é ingerido em lugar nenhum.**

**Mudança concreta.**
1. `"cards"` no enum + `general.cards_total`, `cards_line`, `cards_1t/2t`, `home/away.cards`, `red_card_prob`.
2. Blocos "### Disciplina" por time: cartões recebidos/provocados/j (splits casa/fora), % vermelho, faltas via `freeKicks` concedidos. `cardAvg()` espelhando `avg()`; `cardTiming()` clonando `timing()` (60-70% dos amarelos no 2ºT — cruza com fadiga).
3. Ligação stakes→disciplina: "stake alto e simétrico → +cartões; lado JÁ REBAIXADO → −cartões".
4. **Árbitro (`needs_new_data`):** bloco "## Árbitro" com YCPG, minuto do 1º cartão, % vermelho, arquétipo (rígido/deixa-jogar/gestor); regra "árbitro rígido × confronto truncado é a INTERSEÇÃO onde nasce o valor".

**Vínculo wishlist:** W-039 (rivalidade/derby) como multiplicador de cartões — só com árbitro rígido confirmado (público já precifica o clássico óbvio).

---

## 1.13 Clean Sheet & Win to Nil

**Como o sharp pensa.** Dos mercados mais mal precificados (baixa atenção do público). WTN = P(vitória) × P(clean sheet | vitória) — **não multiplicar as marginais cegamente** (correlação positiva: quem vence tem mais a bola e concede menos). PSxG/xGOT isola o goleiro (~8 gols/temporada entre melhor e pior). CS forte exige adversário com CRIAÇÃO baixa, não só poucos gols. WTN falha em blowout (gol de honra tardio).

**O que o prompt já cobre.** Freq de clean sheet; convDef; SoT sofrido + estilo; gols sofridos split e por faixa (76-90); `ph[0]`/`pa[0]` latentes; desfalque defensivo; BTTS:no.

**Mudança concreta.**
1. Expor `cleanSheetHome=100−ph_adversário` e `winToNil`; linha na tabela + `"clean_sheet"`/`"win_to_nil"` no enum. Atalho: "team_total UNDER 0.5 do adversário JÁ é o clean sheet em mercado existente — versão de menor-variância".
2. Decompor WTN: "P(vitória) × P(não sofrer | vence); ajuste PRA CIMA a partir do produto ingênuo; só crave se P(vitória) ≥ ~60%".
3. Dixon-Coles / flag cagey (0-0/1-0 subestimados).
4. Filtro ataque fraco vs tóxico: "se o adversário CRIA (SoT/big chances alto) mas marcou pouco, é underperformance a reverter → REBAIXE o CS".
5. Goleiro isolado (interim): nota (rating 118) do GK titular season vs forma; PSxG real é `needs_new_data`.
6. Guard WTN blowout: "cheque timing de gols sofridos 76-90 do favorito e a curva pós-vantagem".

---

## 1.14 Odd/Even & Multigoals

**Como o sharp pensa.** Par/ímpar NÃO é coin-flip: `P(par)=(1+e^(−2λ_total))/2`, com viés-PAR crescente quando λ_total é baixo (jogo travado/mata-mata), convergindo a 50/50 quando sobe; empates caem em totais pares. Multigoals = "Asian total empacotado" (soma de células adjacentes da mesma matriz) — wrapper de redução de variância quando a DIREÇÃO under/over é incerta. Overround do nicho é 108-120%.

**Mudança concreta.**
1. Somar a matriz por paridade (`even = Σ p[h][a]` com h+a par) → `pEven`; linha "Par (even) X%/Y%"; `general.odd_even_prob` + `"odd_even"` (selection even/odd). Gate: "só crave odd_even com λ_total OUTLIER de baixo E roteiro de under confirmado — senão é coin-flip de alta variância".
2. Somar a matriz em faixas (0-1, 1-2, 2-3, 1-3, 2-4, 1-4, 4+) → `general.multigoals` + `"multigoals"` (line = faixa). "Use como REDUÇÃO DE VARIÂNCIA quando a direção é incerta; nunca banda estreita colada no xG sem folga".
3. Dixon-Coles / instrução qualitativa: "em veredito TRAVA + λ_total abaixo da liga, empurre P(par) e banda 2-3 PRA CIMA".
4. Guard anti-pattern-chasing: "IGNORE 'fechou par em X dos últimos Y' — é ruído; paridade é função de λ_total".
5. Escada de variância: multigoals como alternativa de MENOR variância ao O/U cru; odd_even no TOPO da variância (coin-flip, vig alto).

---

## 1.15 First/Last to Score & minuto do 1º gol

**Como o sharp pensa.** Análise de **sobrevivência** (censurar 0-0), não a marginal de gols por faixa. Mediana do 1º gol ~28-34min; gols raros nos 1os 15min. Mandante abre o placar ~57.8% (PL). Marcar 1º em casa → ~72-74% de vitória. `first_to_score` é three-way (home/away/none, soma 1).

**O que o prompt já cobre.** Distribuição por faixa (marcados/sofridos); crossTable; momentum com minuto real; "Quem marca primeiro?" qualitativo no roteiro; split 1ºT/2ºT.

**O que falta.** Nenhum campo de first-to-score nem do minuto do 1º gol. O bloco de timing **mistura marginal de gols com o 1º gol** (double-conta goleadas). Sem baseline de liga de mandante-abre.

**Mudança concreta.**
1. Bloco "### Quem marca primeiro" por time: `openScoredPct` (% de jogos em que fez o 1º gol, split casa/fora), `openConcededPct`, `noGoalPct` (censura correta). `general.first_to_score={home,away,none}` + `"first_to_score"` no enum.
2. "Curva do 1º gol da liga" (distribuição empírica do minuto do 1º gol, censurando 0-0) + `general.first_goal_window` + `general.first_half_goal_prob`. Nota anti-ingenuidade "gols mais raros nos 1os 15min".
3. Minuto mediano do 1º gol do time; baseline "mandante abre em X% nesta liga".
4. Coerência: "se over25_prob é alto, first_goal_window pesa cedo e first_half_goal_prob sobe".

**Vínculo wishlist:** W-033 (game script quem marca primeiro).

---

## 1.16 Artilheiro (anytime / primeiro marcador)

**Como o sharp pensa.** Bottom-up: `p(marca) ≈ 1−(1−conv)^n`, n = finalizações esperadas escaladas por minutos. Ancora no team_total (soma das anytime_prob ≈ team_total). **Chutes totais > SoT** (mais estável). Fade de gols >> xG. Cobrador de pênalti ganha chutes "de graça" (~76% conv). Minutos esperados > nome (fade do suplente e do vies-do-craque).

**O que o prompt já cobre.** Team total; gols+assists+pctInvolve por jogador (só desfalcados); SoT por jogador (type 86); minutos/starter; position; timing; penalti separado da conversão.

**Mudança concreta.**
1. Bloco "Candidatos a marcador" (top ~6 por SoT/gols) + `general.goalscorers[]` com anytime_prob/first_scorer_prob; ancorar no team_total.
2. Instruir a rota bottom-up `1−(1−p)^n`.
3. Cobrador de pênalti derivado de `goal.type=penalty → playerId` (+alerta se está desfalcado).
4. Minutos esperados / start rate; fade do suplente; nota anti-viés (preferir companheiro com matchup melhor ao craque óbvio).
5. `needs_new_data`: chutes totais/90 por jogador (lineup.details tem ~68 types de graça), xG por jogador (add-on), big-chance involvement.

**Vínculo wishlist:** W-052 (autor do gol/assist na forma), W-035 (MOTM recente), W-040 (retorno de lesão do cobrador/artilheiro).

---

## 1.17 Player Props — Shots / SoT

**Como o sharp pensa.** Mercado mais ineficiente e limpo. NUNCA SoT/jogo bruto — sempre por-90 (separa titular fixo de rotativo). Lineup confirmado é o gatilho de maior peso. Modelo de 2 camadas: volume de chutes × taxa chute→SoT. Fade do nome badalado (over inflado), valor no titular secundário.

**O que o prompt já cobre.** SoT de time; SoT por jogador (só desfalcados); minutos/starter; chutes na área/fora (team-level); notas; SoT sofrido; game-state modelado no nível do jogo; gate LOW_SAMPLE.

**Mudança concreta.**
1. Parte "Player Props (SoT)": bloco por time dos prováveis titulares ofensivos com SoT/j e **SoT/90 = sum(SoT)/sum(min)*90**; `general.player_props[]` + `"player_shots_on_target"` no enum.
2. Aplicar game-state ao 2ºT do jogador (favorito que abre reduz volume — reusa veredito de intenção/xg_bands).
3. Gate de amostra + ancorar na season, últimos 3-5 com peso baixo.
4. `needs_new_data`: chutes totais/90 por jogador, XI confirmado, batedor de bola parada.

---

## 1.18 Mercados por Tempo (gols 1ºT/2ºT, tempo com mais gols)

**Como o sharp pensa.** Ler as duas metades como jogos diferentes: 2ºT tem estruturalmente ~55% dos gols + quase o dobro de acréscimo — NÃO comparar linhas 0.5/1.5 de 1ºT e 2ºT como simétricas. Tempo-com-mais-gols e over-por-tempo são nichos líquidos e mal precificados.

**O que o prompt já cobre.** xg_1t/2t, total_1t/2t, one_x_two_1t/2t; halfSplit; timing; crossTable; momentum com `‖INTERVALO‖`; share1 default 0.45.

**O que falta.** "Tempo com mais gols" não existe (tem xg_1t/2t mas não converte em P(2t>1t)); over/under por tempo não ancorado; `best_bet.market` não aceita nenhum mercado de tempo (a granularidade fica inerte).

**Mudança concreta.**
1. `general.most_goals_half {pick:'1t'|'2t'|'equal', prob}` derivado das distribuições Poisson do total de cada tempo; citar prior de liga (~44/56).
2. `over05_1t_prob`, `over15_1t_prob`, `over05_2t_prob`, `over15_2t_prob` via Poisson dos λ por tempo.
3. Estender enum: `"half_total"`, `"most_goals_half"`, `"ht_ft"` + `best_bet.period ('1t'|'2t'|'ft')`. Posicionar over 0.5 1ºT/2ºT perto do topo (baixa variância).
4. Split de gols por tempo DA LIGA (substituir o 0.45 hardcoded); halfSplit recortado por últimos 5-10 e por mando; minuto mediano / rótulo fast-slow starter.

---

## 1.19 Race to X / faixas de contagem / tempo do 1º gol (derivados do grid)

**Como o sharp pensa.** Derivados são os menos eficientes; o sharp os deriva da MESMA grade λ. Tempo até 1º gol ~ exponencial(λ_total/90), correlação −0.70 entre λ e mediana. Só crava exótico quando o edge supera a vig grande daquele mercado.

**Mudança concreta.**
1. `general.correct_score_top`, `general.goal_bands {b0_1, b2_3, b4plus}` (somando células por h+a — distinto das xg_bands que são faixas de TEMPO).
2. `general.first_goal {expected_minute≈90/λ_total, p_before_ht, p_by_band}`; `general.race_to_goal {n1,n2}` (P(home chega a N primeiro)).
3. Dixon-Coles antes de somar bandas; suavizar a frase "eventos descorrelacionados" para o LLM não double-corrigir.
4. Degrau (6) na escada de variância: correct_score/faixa estreita/1º gol = MAIS arriscado, confidence ≤ low.

---

## 1.20 Ao Vivo / In-Play (leitura pré-jogo do "filme")

**Como o sharp pensa.** Mesma filosofia bayesiana. **Achado contraintuitivo crítico:** compactação defensiva extrema do líder (park-the-bus) AUMENTA a chance de sofrer a próxima finalização (tracking CSL, p<2e-16) — recuar NÃO é seguro. Vantagem de 1 gol é o ponto de máxima cautela, sobretudo 80-90' e se o líder era underdog. Distinguir pressão SUSTENTADA (regime) de evento ISOLADO. Posse ≠ perigo.

**⚠️ Correção de bug de doutrina.** O prompt hoje afirma o OPOSTO da evidência: "Favorito que faz 2-0 cedo pode ADMINISTRAR → o jogo morre" e lê "queda longa após marcar = administra/segura" como under. A pesquisa mostra que **compactação extrema do líder aumenta o risco de sofrer**, especialmente 1-0 tardio de um underdog.

**Mudança concreta.**
1. Após a linha do favorito que administra (linha ~1117), adicionar: "**ATENÇÃO (contraintuitivo, tracking):** time que se fecha pra segurar 1-0, sobretudo se era UNDERDOG pré-jogo e na reta 76-90, NÃO fica mais seguro — a compactação AUMENTA a chance de sofrer. Se a curva de defesa (interceptações+desarmes) do líder DISPARA no fim e ele sofre gols em 76-90, leia recuo = RISCO, não controle → sustenta team_total over 0.5 do perseguidor e desaconselha under tardio bancado só em administração." Ajustar o texto para não equiparar "queda longa após marcar" a "segura o resultado".
2. `general.game_state_read` (3 cenários: mandante abre / visitante abre / 0-0 persiste, cada um com encadeamento + mercado favorecido, obrigatoriamente simétrico).
3. `general.late_lead_fragility` por time (gols sofridos 76-90 + carga defensiva no fim + era underdog).
4. Classificar persistência do momentum: "regime sustentado (vários picos seguidos) vs surtos que ESFRIAM (cooling-off) — chute isolado não é sinal".
5. Posse ≠ perigo: "só conte pressão quando a posse vira ENTRADAS de qualidade".

---

# PARTE 2 — POR FASE DO JOGO (o cruzamento central: fases × muitos/poucos gols)

Esta é a seção pedida com ênfase. **Tese unificadora:** gols NÃO são uniformes no tempo, e o prompt hoje mostra o número do time por faixa **sem baseline de liga** para calibrar. O motor precisa (1) de um prior de FORMA da curva, (2) de redistribuir o xG por fase conforme intenção/game-state (não só o total), e (3) de separar fadiga dentro-do-jogo de fadiga entre-jogos.

## 2.1 Fatos robustos (convergência multi-fonte)

- **Curva crescente:** ~10/15/20/15/20/20-25% nas faixas 0-15/16-30/31-45/46-60/61-75/76-90. A **0-15 é sistematicamente a mais pobre** (jogo começa cauteloso, "cagey start" — o oposto de "início elétrico"). Picos no FIM de cada tempo (31-45 e 76-90), não no início.
- **1ºT vs 2ºT ~44/56** (agregado histórico estável 2005-hoje). Por liga: PL ~50/50, Bundesliga 51/49, Ligue 1 48/52, Serie A 45/55, La Liga 43/57. Brasileirão ~43/57. **Calibrar por liga, não usar número global.**
- **76-90 é a faixa isolada mais goleadora** (18-25%), e está engordando por acréscimo inflado pós-2023 (PL 2025/26: 13-22% dos gols aos 80'+/90'+, recorde). Parte é estrutural (a faixa absorve acréscimo, é "maior").
- **Mecanismo do salto no 2ºT é majoritariamente DEFENSIVO:** fadiga degrada marcação (pico do efeito na janela 80-85', GPS Champions League); substituições ofensivas concentram-se em 62' e 79' (pernas frescas vs pernas cansadas, maior desigualdade 90-95'). Vantagem de mando erode de ~56/44 para ~53/47 no acréscimo.
- **0-0 no intervalo ~25%** (não 50/50). Sem gol até o HT → P(over 2.5) cai pra ~16%; com 2 gols no HT → over ~80%.

## 2.2 O CRUZAMENTO fase × muitos/poucos gols (o coração do pedido)

Regras acionáveis, cada uma amarrada a um dado que o prompt já tem ou pode ter barato:

1. **Under estrutural no 1ºT** quando o jogo tem cara de mata-mata/decisão/derby: o share de gols do 1ºT cai de ~44% para ~35-39% (Libertadores ~35%, Copa do Mundo ~39%). `stageName` de copa já identifica mata-mata sem dado novo.
2. **Bloco baixo do underdog reduz gol SOFRIDO especificamente em 0-15/16-30**, não no jogo todo — é sinal de TIMING, não de solidez geral (o time pode ceder quando cansa/precisa sair).
3. **`bothPush` deve empurrar a FORMA da curva, não só o xG total:** jogos onde os dois precisam vencer concentram MAIS gol tardio (76-90) que a média sazonal do próprio time (fadiga + desespero simultâneos). Euro 2012: 57.9% no 2ºT, 21.1% do total nos últimos 15min.
4. **Volume tardio de time perseguindo converte PIOR** (chute apressado/de fora): SoT gerado em chasing 76-90 NÃO vira gol na taxa da season — MODERAR (não anular) o xg_band de 76-90 do lado que persegue por desespero.
5. **Score effects (StatsBomb):** time que abre 1-0 é OUTSHOT (46.6% vs 53.4%) mas fica com 52.94% dos gols (converte contra-ataque com xG/chute maior). **"Administrar" ≠ zero gol a mais** — o over ainda pode se sustentar via o próprio líder; e domínio de posse do líder não é sinal de mais gols vindo.
6. **Gol cedo (0-15) tem peso de ROTEIRO desproporcional:** quem marca antes dos 15min vence ~60-66%, mas restam ~75min — abre um jogo ainda incerto (perseguidor se lança OU líder administra, conforme intenção/stake). Gol tardio (85') praticamente sela o resultado.
7. **Assimetria de fragilidade tardia:** vantagem de 1 gol cai em 37% dos jogos; **vantagem de 2 gols é MAIS friável que a de 1** na sequência (relaxamento). Mandante marca ~35% mais gols tardios que visitante; visitante na frente sofre mais tarde que mandante na frente.
8. **Burstiness:** o time que ACABOU de marcar tende a marcar de novo (não o adversário responder rápido) — a cascata de perseguição se constrói em 10-20min, não nos 2-3min pós-gol. Separar "reação imediata pós-gol" (0-10min, tende a cair — ruído esperado) de "reação sustentada" (10-20min+, sinal real).

## 2.3 O que o prompt já cobre nas fases

`timing()`/`timingLines()` por 15min; `crossTable()` (ataque×defesa por janela, "índice janela"); `momentumLines()`/`minuteNet()` (últimos 5 com `‖INTERVALO‖`, minuto de cada gol, 76'-90' e 91'+ separados — resolução melhor que a maioria dos artigos); `defenseBands()` (interceptações+desarmes por faixa); `halfSplit`; xg_bands; `share1` default 0.45; reconhecimento de que "o Poisson é CEGO ao placar".

## 2.4 Mudanças concretas por fase

1. **Baseline de liga por faixa (a lacuna nº1):** computar o % médio da LIGA em cada faixa de 15min (sobre `played`) e o split 1ºT/2ºT real da liga; exibir no bloco "Distribuição de gols por faixa" para o modelo saber se o time é anômalo. Substituir o 0.45 hardcoded pelo split real.
2. **`bothPush` redistribui xg_bands:** "Se veredito ASSIMÉTRICA/TRAVA e λ_total abaixo da liga, o Poisson independente subestima 0-0/1-1 → empurre P(par)/banda 2-3/CS. Se `bothPush` E λ_total alto, redistribua fração MAIOR do xg_total pra 76-90 além da proporção histórica do time."
3. **Cruzar `defenseBands` com `concededPg` 76-90** (reproduz o achado GPS): se a atividade defensiva do líder cai em 76-90 relativo a 61-75 E concededPg é alto nessa faixa → flag textual de **fadiga defensiva tardia mensurável**.
4. **Separar os dois relógios de fadiga:** dentro-do-jogo (abre o FIM do mesmo jogo) vs entre-jogos (calendário apertado fecha o jogo TODO desde o início — território da "teoria ressaca meio de semana" do João). Não generalizar a literatura de 2ºT para cansaço acumulado.
5. **Separar as duas leituras de momentum:** "surto após SOFRER" (reação tática/perseguição) vs "sequência após MARCAR" (burstiness/moral) — hoje o prompt trata como uma coisa só.
6. **Padrão recorrente vs pico isolado:** instrução explícita — "surto na MESMA faixa em 3+ dos últimos 5 é sinal; pico não-repetido de 1 jogo é ruído" (evidência: paper Ötting — apostar em momentum de evento isolado perde dinheiro; o valor está no padrão multi-partida, que é exatamente o que `momentumLines` já constrói).
7. **Discount de conversão tardia em chasing:** "SoT gerado em 76-90 por quem está atrás converte pior que a média — MODERE o xg_band, não assuma volume=gol".
8. **Ancorar min ~20 e faixa 60-80 como marcos:** min 20 (ponto onde P(over 0.5 1ºT) cai abaixo de 50%) e 60-80 (janela mais preditiva de shift de momentum, gol tende a sair 5-10min após a pressão ficar visível).
9. **Assimetria 1-gol vs 2-gols no roteiro:** "diferença de 1 gol tende a ABRIR o jogo (perseguição real, +over tardio); diferença de 2+ tende a FECHAR (os dois relaxam, +under) — mas cuidado, 2-0 não é jogo morto por causa do relaxamento do líder".
10. **Nota de convenção `bandOf`:** hoje 45+x cai em '46-60' (imprecisão aceita) — diverge da convenção de mercado que joga acréscimos do 1ºT em '31-45'; comparar timing interno com linha de 1ºT de mercado pode subestimar levemente o 1ºT. Documentar ou reclassificar.

---

# PARTE 3 — CONTEXTO NÃO-ESTATÍSTICO

**Princípio geral (D+C).** Contexto entra na camada **EXPLICAR** (texto citável do LLM), NÃO no motor **ESTIMAR** (probabilidade calibrada) — salvo quando vira ajuste explícito e auditável de λ (desfalque, fadiga). A cadeia evidência→ajuste→prob precisa ser rastreável, com `fonte_url` + `data` + severidade (`rumor`|`confirmado`). Onde as ineficiências reais vivem: **desfalque, fadiga, momento, notícia fresca (horas)** — o mercado retail demora a ajustar isso. Ligas grandes/líquidas são eficientes; o valor está no nicho e na notícia recente.

## 3.1 Mood / redes sociais do clube (W-038)

**Como o sharp pensa.** Mood não é sinal preditivo direto — é proxy de (a) velocidade de informação não precificada e (b) fluxo de aposta de varejo (noise trader). A régua é "isso já está no preço?", não "o clube está em crise?". Sentimento social mede o TORCEDOR, não o vestiário (~56% de acurácia só com texto, ~71% combinado com desempenho — o desempenho carrega o sinal). Crise institucional é lida via mercado-espelho objetivo (sack race), não NLP de tom. Assimetria: o mercado sobre-reage a sequências POSITIVAS mais que negativas → "crise" tende a estar mais sub-precificada que "euforia".

**Recomendação.** NÃO construir score de humor persistido (redundante com forma/notícia/lesão — conclusão já herdada do SIN-003, que descartou mood a nível de jogador; W-038 tenta contornar operando a nível institucional). Perna barata defensável: anexar handles oficiais como metadado. Se avançar, registrar EVENTO pontual `{tipo, clube_id, fonte_url, data, severidade}` no molde de W-018, alimentando só o campo de contexto. Limite estrito: institucional (pessoa jurídica) + factual, nunca inferência de estado interno de indivíduo (vedado LGPD/EU AI Act).

## 3.2 Notícias / imprensa pré-jogo (W-018)

**Como o sharp pensa.** Notícia é evento de volatilidade, não edge por si — o valor é agir antes do mercado precificar. Cadeia causal completa obrigatória: "jogador fora → time perde ameaça de bola parada → adversário defende estreito" (sem a 2ª etapa é ruído). Hierarquia de fonte: escalação oficial > vazamento de beat reporter > coach-speak/boato. Motivação/narrativa (derby, "jogo decisivo") é SUPERPRECIFICADA pelo público → o ângulo de valor é frequentemente CONTRA a narrativa.

**Recomendação.** Pipeline notícia→evidência tipado `{tipo, alvo, severidade: rumor|confirmado, fonte_url, data, resumo}`; timestamp de frescor (24-72h tem edge residual; notícia velha já está no preço); destino EXPLICAR, não ESTIMAR; dedup por transição de estado. Nunca apresentar rumor como fato.

## 3.3 Lesões / baixas / suspensões / retorno (W-029, W-040, W-041)

**Como o sharp pensa.** Converter a ausência em VALOR NUMÉRICO (gols/pontos/% win) e comparar com o quanto a linha já moveu. **Importa o GAP titular↔reserva (replacement value)**, não o talento isolado — é exatamente o `dropPct` with/without que o `AbsenceLine` já calcula. Posição > nome: goleiro ausente é o desfalque mais devastador (save% ~72→64%); CB/volante ausente destrava BTTS mais que atacante. **Retorno de lesão não é crédito pleno imediato — há "ferrugem" mensurável** (velocidade/aceleração/distância caem nas primeiras partidas, La Liga). Suspensão é ausência 100% previsível (evidência ainda mais "limpa").

**O que o prompt já cobre (forte).** `AbsenceLine` com gols/assists/90, key passes/90, SoT/90, rating, pctInvolve/recentPctInvolve, with/without (dropPct) com gate LOW_SAMPLE + flag de confound; desfalque ofensivo→λ próprio, defensivo→λ adversário; ressalva de double-count (desfalque já embutido na forma).

**O que falta / mudança concreta.**
1. **Qualidade do reserva** não é modelada (só have/without do titular) — dois times com o "mesmo" desfalque têm impactos diferentes conforme o backup. Cruzar posição do ausente com quem ocupa aquela posição sem ele.
2. **Retorno (W-040):** usar o mesmo feed sidelined para detectar reaparição em lineup; creditar ancorado em `minutesPlayed` pós-retorno, não crédito cheio (**W-041 ferrugem**).
3. **Suspensão** como categoria de ausência tão dura quanto lesão, sem incerteza — dado de cartões já no schema.
4. **Efeito composto de múltiplas ausências** (não-linear) quando 2+ AbsenceLine no mesmo time.
5. Alerta de desfalque (**W-029**): janela de valor fecha rápido — cruzar com o momento da temporada.

## 3.4 Rivalidade / derby / lei do ex (W-039)

**Como o sharp pensa.** Decompor "é clássico" em efeitos independentes (cartões↑, mando↓, gols=misto) — parte do folclore não sobrevive a amostra grande. Único ajuste com evidência forte: **desconto no mando** (Brasileirão: mando cai de 52.4% para 30.0% em clássicos, p≤0.001). Migrar para mercados secundários (cartões, escanteios, dupla chance). "Lei do ex" é efeito pequeno mas peer-reviewed (Assanskiy 2022); "técnico revanche" é folclore puro (sem estudo isolando). Emoção aumenta o VOLUME (faltas/cartões/caos), não necessariamente o OUTPUT (gols). Fade a supervalorização da narrativa de revanche.

**O que falta / mudança concreta.**
1. Flag binário derby (whitelist curada — footballderbies.com nota 0-10; seed estático por liga, zero-schema-friendly) OU proximidade geográfica de estádio (Wikidata P625) como proxy.
2. Desconto de mando em derby confirmado + cautela de under no 1ºT de mata-mata.
3. Multiplicador de cartões só com árbitro rígido confirmado (senão o público já precificou).
4. "Lei do ex" via SportMonks `transfers` + Team Squad (já mapeado no projeto — evita Transfermarkt/ToS frágil); reforçada quando joga FORA e a saída foi conturbada.
5. Não double-contar o efeito derby já precificado em ligas líquidas — valor está em ligas menores + mercados secundários.

## 3.5 Treinador / assinatura tática / H2H de bancos (W-053)

**Como o sharp pensa.** "New manager bounce" é real na média (~7.3 pts em 6 jogos) mas inconsistente (3 de 10 casos) e falha em times ameaçados de rebaixamento — literatura acadêmica é cética (pode ser regressão à média, não o técnico). Bounce REAL = estrutura tática descritível em 1 frase após 1 jogo, xG sustentado; FALSO = só emoção/esforço, pico isolado. **Timing: evitar a estreia (hype tax), mirar jogos 2-4.** H2H de treinador só com 5+ confrontos e decaimento temporal, zerado se técnico/elenco mudou. PPDA/posse como fingerprint que persiste entre clubes (isola o duelo de ideias). "Bogey team" cross-club é o sinal mais forte.

**O que falta / mudança concreta.**
1. `coachId` cross-season/cross-club (pré-requisito de W-053 — com 1 season a amostra fica vazia); função "jogos desde a troca de técnico" (análoga a `restDays()`) para a janela do bounce.
2. Fingerprint tático por técnico (PPDA/posse agregado por `coachId`, não `teamId`) — hoje não hookado.
3. H2H de treinador (W-053) só quando cross-club/multi-season; senão é decoração.
4. Cruzar H2H de treinador com desfalque (o combo "este par trava/under MAS o artilheiro que quebra o padrão voltou" é evidência composta rara).

## 3.6 Motivação / postura / must-win (W-034, W-051)

**Como o sharp pensa.** Ceticismo empírico: "trap games"/"letdown games" NÃO são estatisticamente significativos (Harvard NFL 2002-2011). Motivação pura é a narrativa mais fácil de superestimar. Onde motivação move de forma comprovável: **decisão de ESCALAÇÃO e POSTURA TÁTICA** (rotação em dead rubber, rastreável via lineup real), não adjetivo. Camada RELACIONAL/interdependente (W-051): o stake do time depende do calendário e do adversário do RIVAL, não só da própria tabela — o perseguidor pode resignar mesmo sem estar eliminado, porque o caminho do líder é fácil demais. Quase nenhum guia público modela isso → edge real.

**O que o prompt já cobre.** `stakesFor()` com alcance matemático; veredito de intenção; `computeStandings`; fadiga cross-competição.

**O que falta / mudança concreta.**
1. **W-051:** avaliar o stake relacional — calendário restante + força e stake dos próximos adversários do rival direto; "resignação do perseguidor" quando o caminho do líder é fácil. Requer força relativa dos próximos adversários (proxy: posição/Elo) e status de stake de cada adversário futuro.
2. **W-034 (postura lida da forma):** forma com granularidade de estilo (gols feitos/sofridos, SoT, placar por tempo) para inferir postura — "atira pra frente sob pressão vs segura vs capitula" — não só V/E/D.
3. Rotação de elenco (titular vs reserva) como proxy auditável de "quanto o técnico valoriza este jogo".
4. Threshold histórico de pontos pra segurança/objetivo por competição (calibrado, não chutado).
5. Nunca escrever motivação como frase vaga — sempre evidência mastigada com números (gap de pontos, jogos restantes, status do adversário do rival, escalação).

---

# PARTE 4 — TEMAS TRANSVERSAIS

## 4.1 Eficiência de mercado, CLV e valor

**Princípios.** CLV (bater a odd de fechamento) é o ÚNICO índice de skill que separa sorte de acerto — win rate 45% com CLV+ é lucrativo; o inverso não. A odd de fechamento (Pinnacle, margem 2-4%) é o melhor proxy de probabilidade real. **Achado mais acionável (DataGolf):** bookmakers empatam/batem modelos puros (corr 0.74-0.90); a estratégia vencedora é **BLENDAR modelo com mercado (~45% modelo / 55% mercado** para inputs medianos, subindo a 60-65% com inputs de alta qualidade). Threshold de EV mínimo 5-8% (não 1-2%, que é ruído). Devig com Power/Shin (não proporcional) em mercados assimétricos. Favorite-longshot bias: ceticismo extra no valor do underdog. Sharp entra cedo; RLM (linha move contra o volume) = dinheiro esperto. Line shopping sozinho = ~2-3% ROI/ano. Kelly fracionário (0.25-0.5×), nunca cheio.

**Aplica ao prompt.** Enquanto não há odds, **trocar o enquadramento do best_bet de "escolha o mercado de maior valor" para "produza PROBABILIDADE JUSTA (não veredito de valor)"** + `general.fair_odds_1x2`. Timing: rodar assim que lineups/desfalques disponíveis (mais janela de valor); considerar rodar 2× e comparar drift como proxy interno de CLV. A tese "aposta precisa de evidência" (desfalque/fadiga/momento) está exatamente onde ficam as ineficiências — priorizar isso sobre "otimizar o λ".

## 4.2 Poisson / Dixon-Coles / xG

**Princípios.** Dixon-Coles (1997): fator τ só em 0-0/1-0/0-1/1-1 (ρ ~ −0.03 a −0.15, estimado por MLE junto com ataque/defesa, **não chutado**). A dependência está concentrada nos placares baixos → τ captura quase todo o ganho do bivariate completo (barato). **Força ataque/defesa com split casa/fora obrigatório** (misturar destrói o home-advantage embutido no λ — o erro mais comum). Time-weighting `exp(−ξt)` calibrado por backtest (com 1 season ξ→0, só compensa multi-temporada). **xG > gols crus** para previsão futura (filtra sorte de finalização; regride à média). Shrinkage bayesiano para amostra pequena (puxa λ à média da liga proporcional ao N). Calibração (log-loss/Brier/RPS) > taxa de acerto. xG NÃO é comparável cross-liga sem recalibração (relevante para mrtip multi-liga).

**Aplica ao prompt.** Dixon-Coles em `marketProbs` antes de gerar todos os mercados; decaimento temporal em `form.service.ts`; confirmar split casa/fora obrigatório em `get-team.service.ts`/`shared.ts`; xG como insumo do λ onde ingerido; shrinkage para times com poucos jogos; **expor sinal de confiança/tamanho de amostra junto do λ** para o LLM não escrever narrativa com o mesmo tom de certeza para amostra robusta e para amostra rala.

## 4.3 Correlação entre mercados / Same-Game Parlay

**Princípios.** **Todo mercado deve nascer da MESMA matriz de placar conjunta** (Dixon-Coles), nunca de calibrações independentes por mercado — senão surgem inconsistências que parecem "valor" mas são artefato de correlação. Correlação positiva entre pernas faz a prob conjunta real ficar bem acima da multiplicação ingênua (ex.: 16.0% ingênuo vs 21.2% real, +33% — o "imposto de correlação"). Volume (O/U) e participação (BTTS) são dimensões distintas do mesmo processo. Favoritismo extremo tem correlação mecânica Over↔cobertura de handicap. Bivariate completo (Karlis-Ntzoufras) raramente melhora sobre Dixon-Coles — o ganho é garantir grid único, não covariância complexa.

**Aplica ao prompt.** Gerar 1x2/O/U/BTTS/team_total/HT/FT de uma única matriz DC. **Proibir empilhar picks correlacionados como evidências independentes** — exigir que o texto identifique a causa raiz única e derive as correlatas dela. Se sugerir combos, calcular prob conjunta pela matriz (nunca p1·p2·p3) e sinalizar mercados da mesma região do grid como "mesmo sinal, não confirmação dupla". Separar narrativa de volume (fadiga/pace/defesas fracas → Over) de narrativa de participação (um time domina → BTTS-No mesmo com Over). Renormalizar contribuições per-player para bater o λ agregado do time.

## 4.4 Dados que o sharp valoriza (hierarquia de sinais)

**Princípios.** xG > resultado bruto (divergência xG-vs-gols é o gatilho de valor, mais explorável em ligas menores/promovidos). **Bola parada é sub-modelo à parte** (~30-35% dos gols; xG de bola parada mais estável que gols de bola parada em amostra pequena). Desfalque com peso numérico por jogador, não binário. **Árbitro é fator mensurável e subestimado** (faltas/cartões/pênaltis/acréscimos persistem). Clima como covariável do λ (chuva −0.4 gol/jogo; vento mata escanteio; calor reduz gols no 2ºT). Fadiga por congestionamento/viagem (respalda a "ressaca de meio de semana" do João, mas NÃO determinístico — rotação não implica pior resultado). Motivação/tabela como modificador qualitativo. Decaimento temporal validado empiricamente. **CLV como disciplina de calibração** (logar prob prevista vs odd de fechamento, não só vs resultado). Amostra pequena é a armadilha nº1 (descartar variáveis com <30 registros). PPDA complementa xG.

**Aplica ao prompt.** Formalizar desfalque como valor numérico que desconta o λ (não só citar). LIG-011 (forma cross-competition) + "ressaca meio de semana" = fator de fadiga/viagem que desconta λ após meio de semana europeu com viagem. Weather/trends/sidelined já expostos pela SportMonks podem virar features numéricas diretas. Exigir que o LLM cite xG, divergência xG-vs-resultado e % de gols de bola parada como evidência obrigatória. Considerar decaimento temporal em `form.service` em vez de janela fixa.

## 4.5 Confiança, seleção de mercado e staking

**Princípios.** Kelly fracionário (1/4 a 1/2) é padrão — variância escala quadraticamente com a fração, crescimento linear (meio-Kelly = ~75% do crescimento, ~25% da variância). Kelly cheio = drawdown 50-60% em ~20% das simulações. Teto rígido de stake (1-3%) como proteção contra edge superestimado. Limiar mínimo de edge ≥3-5% (edges de 0.5% são indistinguíveis de ruído). **Mapear variância por mercado para decidir ONDE apostar:** handicap asiático/DNB/linhas fracionárias absorvem parte do resultado (curva mais previsível que 1x2/placar exato/acumulada). Regra de roteamento: **confiança moderada → handicap asiático/linha de gols; edge grande E bem evidenciado → mercados de alta variância (placar exato, first scorer).** Múltiplas/acumuladas são anti-padrão. Separar duas dimensões de confiança: (1) confiança na probabilidade (amostra/calibração) e (2) magnitude do edge — stake alto só quando AMBAS fortes. Evidência qualitativa (rivalidade/mando emocional) entra só como ajuste auditável de λ, nunca inflando confiança/stake solto do cálculo.

**Aplica ao prompt.** A escada de disciplina de variância já existente é o lugar certo para posicionar TODOS os mercados novos (DC entre handicap e O/U; DNB no degrau 3.5; multigoals como redução de variância; odd_even e correct_score no topo da variância). Se o motor um dia recomendar stake, sempre fracionado e amarrado à qualidade dos dados. Blindar contra confiança-por-narrativa: a cadeia evidência→ajuste de λ→prob→edge→stake precisa ser rastreável.

---

# APÊNDICE — Quadro-resumo de novos campos e enum

**`best_bet.market` (enum estendido):** `double_chance`, `draw_no_bet`, `euro_handicap`, `corners`, `corners_handicap`, `team_corners`, `cards`, `clean_sheet`, `win_to_nil`, `odd_even`, `multigoals`, `correct_score`, `goal_band`, `first_to_score`, `time_of_first_goal`, `race_to_goal`, `ht_ft`, `half_total`, `most_goals_half`, `goalscorer`, `player_shots_on_target`, `player_shots`.
**Campos `best_bet`:** `period ('1t'|'2t'|'ft')`, `push_prob`, `player`, `edge` (null até odds), `market_vig_note`.
**Campos `general`:** `fair_odds_1x2`, `draw_value_flag`, `result_lean`, `game_openness`, `ah_fair`, `euro_handicap`, `margin_dist`, `expected_supremacy`, `correct_score(_top)`, `score_scenario`, `goal_bands`, `odd_even_prob`, `multigoals`, `first_to_score`, `first_goal(_window/_minute_expected)`, `first_half_goal_prob`, `race_to_goal`, `ht_ft`, `most_goals_half`, `over05/15_1t/2t_prob`, `corners{...}`, `cards_total/line/1t/2t`, `red_card_prob`, `clean_sheet_prob`, `win_to_nil_prob`, `low_score_flag`, `game_state_read`, `late_lead_fragility`, `btts_prob_freq`, `draw_rate_baseline`.
**Por time:** `scores_prob`, `clean_sheet_prob`, `tt_over05/15/25_prob`, `lambda_sos_adj`, `finishing_regression`, `regression_flag`, `open_scored/conceded_prob`, `momentum_persistence`, `cards`.
**Motor (interno, sem dado novo):** Dixon-Coles τ no grid; decaimento temporal no λ; materializar grid de placar; baseline de liga por faixa; split 1ºT/2ºT da liga; `marginHistogram`, `htftMatrix`, `cardAvg`, `cardTiming`, `ttProbs`, corners λ, `leagueDrawRate`.
**`needs_new_data`:** odds (abertura/fechamento, Pinnacle) → devig/CLV/EV; árbitro; xG por jogador; chutes totais por jogador; XI confirmado; batedor de bola parada; flag de rivalidade; PPDA; minuto/tipo de substituição; minutos de acréscimo; `coachId` cross-season/cross-club.

---

# FONTES WEB

## Fases temporais / timing / momentum / game-state
- InPlayGuru: Momentum — https://inplayguru.com/guide/in-play-scanner/momentum
- Performance Odds — Best Football Stats for Punters (xG, Momentum, Form) — https://www.performanceodds.com/how-to-guides/best-football-stats-for-punters-xg-momentum-form-analysis-full-guide/
- IDSCA — Reading Momentum Swings in Live Soccer — https://idsca.com/how-to-read-momentum-swings-in-live-soccer-betting/
- Footy Amigo — 30+ Soccer Scanner Rules — https://footyamigo.com/struggling-for-in-play-value-30-soccer-scanner-rules-to-spot-match-momentum-instantly/
- ResearchGate — Goals per 15-min period — https://www.researchgate.net/figure/Number-of-goals-scored-per-15-min-period_fig1_339174372
- PlayThePercentage — What time are goals scored — https://playthepercentage.com/blog/what-time-are-goals-scored-in-football
- Expecting Goals (Caley) — The Game of Two Halves — https://www.expectinggoals.com/p/the-game-of-two-halves
- Expecting Goals — Substitute Effects Study Part I — https://www.expectinggoals.com/p/substitute-effects-study-part-i
- Sportingpedia — First vs Second half goal distribution (top 5) — https://www.sportingpedia.com/2024/10/17/first-vs-second-half-goal-distribution-across-europes-top-5-leagues-scoring-patterns-of-all-96-teams/
- PMC — Temporal features of goals, substitutions, fouls — https://pmc.ncbi.nlm.nih.gov/articles/PMC10923682/
- My Football Trading System — Best Goal Signals for In-Play — https://www.myfootballtradingsystem.com/are-these-the-best-goal-signals-for-in-play-football-trading/
- Ötting et al. — Gambling on Momentum (arXiv 2211.06052) — https://arxiv.org/abs/2211.06052
- T&F — Psychological momentum: last-minute equalizer — https://www.tandfonline.com/doi/full/10.1080/24733938.2019.1665704
- Coventry-bet — Reading Momentum Shifts — https://coventry-bet.com/articles/inplay-championship-betting-reading-momentum/
- Online Betting UK — Football Scoring Periods — https://www.onlinebetting.org.uk/betting-guides/football/scoring-periods.html
- Academia das Apostas Brasil — Momentos dos Gols — https://www.academiadasapostasbrasil.com/blog/2014/10/estudar-os-momentos-dos-gols-minutos-e-competicoes
- Goal.com Brasil — Gols nos 15 minutos finais — https://www.goal.com/br/apostas/gols-15-minutos-finais-tendencia-brasileirao/blta215956f6150d72d
- Goalstatistics — Late Goal Stats And Strategy — https://goalstatistics.com/article/late-goal-stats-and-strategy
- Goalstatistics — First Half Goal Stats And Strategy — https://goalstatistics.com/article/first-half-goal-stats-and-strategy
- The Football Analyst — Game State and Stats — https://the-footballanalyst.com/game-state-and-stats-how-the-scoreline-skews-the-numbers/
- SoccerStats — Goals per 15-Minute Period — https://www.soccerstats.com/stats.asp?page=11
- StatsUltra — When Are Most Goals Scored — https://statsultra.com/when-are-most-goals-scored-football/
- Scoreroom — Goal Times Stats — https://scoreroom.com/goal-times-stats/
- Performance Odds — Real-Time Football Insights (momentum decay) — https://www.performanceodds.com/betting-tricks/real-time-football-insights-how-live-stats-momentum-market-trends-improve-your-betting-accuracy/
- StatsHub — First Half Goals — https://www.statshub.com/betting-academy/first-half-goals
- PMC — Mental fatigue meta-analysis — https://pmc.ncbi.nlm.nih.gov/articles/PMC9354787/
- SAPub — Timing of Goals (Europe/South America) — http://article.sapub.org/10.5923.s.sports.201401.08.html
- FootyStats — 1st/2nd Half Goals — https://footystats.org/stats/1st-2nd-half-goals
- EFDeportes — Gol antes dos 15 minutos — http://www.efdeportes.com/efd169/gol-marcado-antes-dos-quinze-minutos.htm
- Bet The Builder — Over 0.5 First Half Goals — https://previews.betthebuilder.com/the-ultimate-guide-to-finding-value-in-over-0-5-first-half-goals-fhg-markets/
- SportsBoom — First Half Goals Betting — https://www.sportsboom.co.uk/betting/first-half-goals-betting-explained
- Frontiers — Scoring First (Chinese Super League) — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.662708/full
- Barça Innovation Hub — Effect of Scoring First — https://barcainnovationhub.fcbarcelona.com/blog/examining-the-effect-of-scoring-first-in-the-outcome-of-a-football-match/
- AssMan.AI — Low Block / Park the Bus — https://assman.ai/guides/low-block-park-the-bus
- Tactalyse — How to beat teams that park the bus — https://www.tactalyse.com/how-to-beat-teams-that-park-the-bus/
- ResearchGate — Goals per match knockout phase — https://www.researchgate.net/figure/Average-number-of-goals-per-match-in-the-knockout-phase-of-the-Champions-League_fig5_353281156
- arXiv 2501.18606 — Temporal dynamics of goal scoring — https://arxiv.org/html/2501.18606v1
- Premier League — Late goals record 2025-26 — https://www.premierleague.com/en/news/4430518/more-late-goals-and-stoppage-time-winners-being-scored-in-2025-26
- Premier League — Opta analysis late goals — https://www.premierleague.com/en/news/4437338/opta-analysis-of-why-more-late-goals-are-being-scored-in-2025-26-premier-league-season
- Opta Analyst — 90th-minute winners all-time high — https://theanalyst.com/articles/premier-league-90th-minute-winners-late-goals-stats
- PMC — Running performance while scoring/conceding (UCL 5-min) — https://pmc.ncbi.nlm.nih.gov/articles/PMC11874785/
- Wharton — Optimal Substitution Time — https://wsb.wharton.upenn.edu/optimal-substitution-time/
- T&F — Beware the Two-Goal Lead — https://www.tandfonline.com/doi/full/10.1080/09332480.2025.2560280
- StatsBomb (archive) — Score Effects — https://blogarchive.statsbomb.com/articles/soccer/score-effects/
- One Short Corner — Game States and Score Effects — https://oneshortcorner.wordpress.com/2016/04/12/football-analytics-part-five-game-states-and-score-effects/
- arXiv 1207.6796 — Effect of first goal on second (survival) — https://arxiv.org/pdf/1207.6796
- arXiv 2508.04008 — Adjust offensive production for game context — https://arxiv.org/pdf/2508.04008
- Soccermetrics — Dixon & Robinson birth process — https://www.soccermetrics.net/paper-discussions/goal-scoring-probability-over-the-course-of-a-football-match-2
- American Soccer Analysis — Gamestates — https://www.americansocceranalysis.com/projects/game-states
- PMC — Scoring First (CSL) — https://pmc.ncbi.nlm.nih.gov/articles/PMC8194256/
- Pinnacle — How important is the first goal — https://www.pinnacle.com/betting-resources/en/soccer/how-important-is-the-first-goal-in-soccer/lccjgxjxn985lv6n
- arXiv 1002.0797 — Is scoring goals a Poissonian process — https://arxiv.org/pdf/1002.0797
- MDPI — First to Score (FIFA CWC 2025) — https://www.mdpi.com/2076-3417/15/15/8471
- 20bet — Second-Half Betting Strategy — https://blog.20bet.com/betting-guide/soccer-betting-strategy-second-half-guide/
- UFRGS/SciELO — Distribuição temporal de gols — https://lume.ufrgs.br/bitstream/handle/10183/247625/001148246.pdf
- LSE — Profitable Model for Over/Under — https://researchonline.lse.ac.uk/103712/1/Predict_total_goals_LSE.pdf
- Tipsterspredicts — Game State scoring patterns — https://tipsterspredicts.com/how-game-state-influences-scoring-patterns-the-hidden-data-guiding-football-tactics-and-betting/
- SharkBetting — Late Goal Betting Strategy — https://www.sharkbetting.com/blog/late-goal-betting
- 22bet — Late Goals Betting Strategy — https://news.22bet.com/wiki/betting-guide/late-goals-betting-strategy/
- The Stats Don't Lie — 1st/2nd Half + Early Goals — https://www.thestatsdontlie.com/1st-2nd-half-goals/ · https://www.thestatsdontlie.com/early-goals/
- Aposta Ganha — Distribuição de Poisson — https://www.apostaganhabr.com/distribuicao-de-poisson-nas-apostas-esportivas/

## Contexto (mood / notícia / lesão / rivalidade / técnico / motivação)
- Fan Banter — Fan Sentiment vs Market Reality — https://fanbanter.co.uk/fan-sentiment-vs-market-reality-does-social-media-noise-actually-move-the-betting-lines
- Injuries and Suspensions — Social Media Sentiment — https://injuriesandsuspensions.com/all-news/the-role-of-social-media-sentiment-analysis-in-predictions/
- Betsentiment — https://betsentiment.com/
- ResearchGate — Sentiment Bias and Asset Prices — https://www.researchgate.net/publication/310437257_SENTIMENT_BIAS_AND_ASSET_PRICES...
- ResearchGate — Overreaction in NFL point spread — https://www.researchgate.net/publication/24070462_Overreaction_in_the_NFL_point_spread_market
- Pinnacle — What is CLV — https://www.pinnacle.com/betting-resources/en/educational/what-is-closing-line-value-clv-in-sports-betting
- OddsIndex — Fade the Public — https://oddsindex.com/guides/fade-public-betting-strategy
- OLBG — New Manager Bounce — https://www.olbg.com/blogs/new-manager-bounce
- ScienceDirect — Momentum trading NFL gambling — https://www.sciencedirect.com/science/article/abs/pii/S1544612323003781
- Bet Prediction Site — News Discipline for Bettors — https://betpredictionsite.com/blog/how-to-bet-injury-news-lineup-changes/
- Matchbook (O'Haire) — Motivation Overrated — https://insights.matchbook.com/betting-previews/football-tips/mark-ohaire-motivation-overrated-by-the-market/
- OnPattison — Impact of News in Betting — https://onpattison.com/news/2026/may/08/the-impact-of-news-in-betting-how-fast-should-you-react/
- WagerTalk — What Are Sports Betting Sharps — https://www.wagertalk.com/sports-betting-guide/what-are-sports-betting-sharps
- SportBot AI — Sharp Bettor Habits — https://www.sportbotai.com/blog/sharp-bettor-habits-identified-by-ai-analysis
- ECU — Weak Form Efficiency in Sports Betting — https://myweb.ecu.edu/robbinst/PDFs/Weak%20Form%20Efficiency%20in%20Sports%20Betting%20Markets.pdf
- arXiv 2603.17687 — Objective Mispricing Detection (news signals) — https://arxiv.org/pdf/2603.17687
- Football-Data — Pinnacle Closing Line Efficiency — https://www.football-data.co.uk/blog/pinnacle_efficiency.php
- OLBG — Sack Race markets — https://www.olbg.com/news/next-premier-league-manager-go-odds-slot-remains-under-pressure-sack-race-market-tightens
- GamedayMath — Injury Effect on Betting Lines — https://www.gamedaymath.com/blog/injury-effect-impact-on-betting-lines
- ACR — How Injuries Impact Point Spreads — https://www.acrpoker.eu/betting-strategy/how-injuries-impact-point-spreads-what-to-look-for/
- MyBookie — Betting Impact of Injured Players — https://www.mybookie.ag/sports-betting-guide/determining-wagering-impact-of-injured-players/
- ProCappers — Injuries and Line Movements — https://procappers.com/article/the-impact-of-injuries-and-line-movements-on-betting-decisions
- Maddux Sports — NFL Star Injuries Value — https://www.madduxsports.com/library/nfl-handicapping/accessing-the-betting-value-of-nfl-star-player-injuries.html
- PMC — Effect of Injuries on Match Performance — https://pmc.ncbi.nlm.nih.gov/articles/PMC8894514/
- PMC — Return to performance (LaLiga ML) — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12490316/
- ResearchGate — Injuries affect team performance (UCL 11yr) — https://www.researchgate.net/publication/236639717...
- Performance Odds — Sharp Bettors Explained — https://www.performanceodds.com/strategies/sharp-bettors-explained-what-professionals-look-for-in-team-data/
- Breaking The Lines — Rivalries and Betting Logic — https://breakingthelines.com/opinion/using-club-rivalries-to-predict-match-intensity/
- Betfame — Betting on Derbies — https://www.betfame.com/blog-detail/507/how-to-bet-smart-on-football-derbies-and-rivalries.html
- Folha PE — Lei do ex é real? — https://www.folhape.com.br/esportes/lei-do-ex-nos-esportes-e-real-aplicamos-a-matematica-para-testar-e/393992/
- SportBot AI — PL Derbies Betting Guide — https://www.sportbotai.com/blog/premier-league-derbies-betting-guide-ai-predictions-value-angles
- PLOS One — Referee bias / additional assistants — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0227758
- PMC — Attendance restrictions / crowd home advantage — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9261922/
- Know Rivalry Project — https://knowrivalry.com/research/
- ScienceDirect — Assanskiy: athletes vs former clubs — https://www.sciencedirect.com/science/article/abs/pii/S2214804322000532
- AtoZSports — Bulletin board / player duels — https://atozsports.com/college-football/oklahoma-sooners-news/ou-bulletin-board-material-red-river-rivalry-texas-longhorns-edge-colin-simmons/
- Betfair — New Manager Bounce — https://betting.betfair.com/football/manager-specials/new-manager-bounce-is-it-real-and-can-bettors-profit-140922-696.html
- Premier League — New manager bounce myth — https://www.premierleague.com/en/news/4593686/what-is-a-new-manager-bounce-and-is-it-a-myth
- Betting Forum — New Manager Bounce (structure vs headlines) — https://www.betting-forum.com/threads/new-manager-bounce-in-football-when-its-real-structure-change-vs-just-headlines.46436/
- SportBot AI — H2H Records in Prediction Models — https://www.sportbotai.com/blog/head-to-head-records-soccer-prediction-models-ai-betting-value
- StatPair — High Press vs Low Block — https://statpair.com/blog/tactical-matchup-analysis-team-styles
- LinkedIn — Understanding PPDA — https://www.linkedin.com/pulse/understanding-ppda-key-metric-modern-football-marco-tirinato-ii5te
- Squawka — Big Six bogey teams — https://www.squawka.com/en/premier-league-top-managers-bogey-team/
- IZA DP14104 — Effect of Head Coaches — https://repec.iza.org/dp14104.pdf
- Springer — In-Season Manager Changes EPL — https://link.springer.com/article/10.1007/s10645-016-9277-0
- StatsBomb — Modelling Team Playing Style — https://blogarchive.statsbomb.com/articles/soccer/modelling-team-playing-style/
- WinOnBetOnline — Value Betting Explained — https://www.winonbetonline.com/value-betting-explained-the-strategy-sharp-bettors-use-to-beat-the-bookmaker/
- Harvard Sports Analysis — Trap/Letdown Game Myths — https://harvardsportsanalysis.wordpress.com/2012/11/22/debunking-the-trap-game-and-letdown-game-myths/
- Pinnacle Odds Dropper — What is a Trap Game — https://www.pinnacleoddsdropper.com/blog/trap-game
- 7bet — Dead Rubber Match — https://7bet.co.uk/blog/what-is-a-dead-rubber-match-and-how-does-it-impact-football-odds/
- Opta Analyst — 40 points survival — https://theanalyst.com/articles/premier-league-relegation-40-points-spurs-west-ham-nottingham-forest-leeds
- arXiv 2409.04889 — Expected Points ML→statistics — https://arxiv.org/html/2409.04889
- We Are Brighton — Squad choices and betting odds — https://www.wearebrighton.com/newsopinion/squad-announcements-and-team-performance-before-world-cup-2026-impact-on-betting-markets/
- World Football Index — Derby Day Drama — https://worldfootballindex.com/2025/04/derby-day-drama-the-psychological-weight-of-derby-rivalries/
- Medium (Valli) — Bogey Teams — https://medium.com/@jtv0325/bogey-teams-596f4fadc08f
- ScienceDirect — Managerial change team performance — https://www.sciencedirect.com/science/article/abs/pii/S0148619502001200
- BettorEdge — How Injuries Shift Betting Odds — https://www.bettoredge.com/post/how-injuries-shift-betting-odds
- 22bet — Lineups/Team News/Injuries — https://news.22bet.com/wiki/betting-guide/lineups-team-news-injuries-football-betting-strategy-odds-movement/
- Fox Sports — Real Madrid dressing room — https://www.foxsports.com/stories/soccer/crisis-at-real-madrid-kylian-mbappe-and-antonio-rudiger-involved-in-dressing-room-flare-ups-ahead-of-el-clasico

## Transversal (eficiência, Poisson/DC, correlação, dados, staking)
- OddsJam — Closing Line Value — https://oddsjam.com/betting-education/closing-line-value
- Action Network — Remove Juice/Vig — https://www.actionnetwork.com/education/remove-juice-vig
- Bet Hero — Devigging Methods (Power/Shin) — https://betherosports.com/blog/devigging-methods-explained
- Data Golf — How sharp are bookmakers — https://datagolf.com/how-sharp-are-bookmakers
- SportBot AI — Market Efficiency — https://www.sportbotai.com/blog/market-efficiency-sports-betting-explained-1775829772714
- XCLSV — Steam Moves — https://xclsvmedia.com/how-to-use-steam-moves-sports-betting-sharp-action-2026/
- XCLSV — Reverse Line Movement — https://xclsvmedia.com/reverse-line-movement-explained-how-to-spot-sharp-money-sports-betting-2026-guide/
- betstamp — Line Shopping — https://betstamp.com/education/line-shopping-why-you-should-always-get-the-best-odds
- Wikipedia — Kelly Criterion — https://en.wikipedia.org/wiki/Kelly_criterion
- ScienceDirect — Favorite-Longshot Bias overview — https://www.sciencedirect.com/science/chapter/edited-volume/abs/pii/B9780444507440500093
- ScienceDirect — FLB fixed-odds (college) — https://www.sciencedirect.com/science/article/abs/pii/S1062976916000041
- Bet-Analytix — Closing Odds — https://www.bet-analytix.com/pt/academia/closing-odds-indicador-definitivo
- Football Intelligence — Value Betting Poisson — https://footballinteligence.com/value-betting-guide
- Prediction Engine — Dixon-Coles Explained — https://predictionengine.app/learn/dixon-coles-soccer-model
- dashee87 — Dixon-Coles and Time-Weighting — https://dashee87.github.io/football/python/predicting-football-results-with-statistical-modelling-dixon-coles-and-time-weighting/
- opisthokonta — Time-weighted Poisson regression — https://opisthokonta.net/?p=1013
- penaltyblog — Dixon and Coles in Python — https://pena.lt/y/2021/06/24/predicting-football-results-using-python-and-dixon-and-coles/
- Whitaker — Bivariate Poisson and Football — https://gawhitaker.github.io/project.pdf
- arXiv 2508.05891 — Bayesian weighted dynamic models — https://arxiv.org/html/2508.05891v1
- Beat the Bookie — Attack & Defence Strength — https://beatthebookie.blog/2017/05/16/define-variables-attack-defence-strength/
- Total Football Analysis — xG in Soccer / Digital Betting — https://totalfootballanalysis.com/thought-analysis/expected-value-models-xg-in-soccer-and-digital-betting
- DRatings — Log Loss vs Brier — https://www.dratings.com/log-loss-vs-brier-score/
- Betting Forum — Poisson undervalued tool — https://www.betting-forum.com/threads/the-poisson-distribution-remains-the-single-most-undervalued-tool-in-football-betting.46351/
- Wizard of Odds — Same-Game Parlays math — https://wizardofodds.com/article/same-game-parlays-the-mathematics-of-correlation/
- OddsIndex — Correlated Parlay Guide — https://oddsindex.com/guides/correlated-parlay-guide
- BJ21 (Wong) — Correlated parlays — https://bj21.com/articles/sports-betting/correlated-parlays
- lsports — Player Props & Team Totals Correlation Risk — https://www.lsports.eu/blog/player-props-team-totals-correlation-risk/
- BoydsBets — Correlated Parlays — https://www.boydsbets.com/correlated-parlays/
- Establish The Run — Same-Game Parlays — https://establishtherun.com/should-you-bet-same-game-parlays/
- Performance Odds — BTTS & Over/Under models — https://www.performanceodds.com/how-to-guides/betting-predictions-explained-the-complete-guide-to-btts-over-2-5-under-2-5-high-probability-models/
- Football Trading Academy — Pinnacle Odds Gold Standard — https://footballtradinga.com/pinnacle-odds/
- Pinnacle — Poisson distribution — https://www.pinnacle.com/betting-resources/en/soccer/poisson-distribution-predicting-the-scores-in-the-world-soccer-cup-2026/md62mlxumkmxz6a8
- RobôTip — Como Analisar Estatísticas (xG) — https://blog.robotip.com.br/estatisticas-apostas-futebol-analisar-expected-goals-xg-qualidade-chutes-mandante-visitante-forma-lesoes-movimento-odds/
- Clube da Aposta — Fatores de análise — https://clubedaposta.com/apostas-esportivas/fatores-analise-apostar-futebol/
- BetsForToday — Poisson Models Step-by-Step — https://www.betsfortoday.com/guides/poisson-distribution/
- Footiehound — Referee Profiles and Card Patterns — https://footiehound.com/how-referee-profiles-and-card-patterns-influence-match-pricing
- StatPair — Weather Impact on Football Stats — https://statpair.com/blog/weather-impact-football-statistics-betting
- PMC — Fixture Congestion systematic review — https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/
- Trademate (Medium) — Closing line most important metric — https://tradematesports.medium.com/closing-line-the-most-important-metric-in-sports-trading-58e56cdb4458
- Betmana — Set Piece Analysis — https://betmana.co.uk/guide/set-piece-analysis-for-football-betting/
- SetPieceSicko (Medium) — How to Analyse Set-Pieces — https://medium.com/@setpiecesicko/how-to-analyse-set-pieces-like-a-sicko-d05e95a222f7
- The Football Analyst — VAEP — https://the-footballanalyst.com/vaep-valuing-actions-by-estimating-probabilities-in-football/
- KU Leuven DTAI — Exploring VAEP — https://dtai.cs.kuleuven.be/sports/vaep/
- Wikipedia — Favourite-longshot bias — https://en.wikipedia.org/wiki/Favourite-longshot_bias
- Core Sports Betting — FLB / Edge Threshold — https://www.coresportsbetting.com/understanding-the-favorite-longshot-bias-in-sports-betting/ · https://www.coresportsbetting.com/how-to-set-edge-threshold-for-sports-betting/
- Pinnacle Odds Dropper — Overround / Devig Pinnacle — https://www.pinnacleoddsdropper.com/blog/overround · https://www.pinnacleoddsdropper.com/guides/how-to-devig-pinnacle-s-odds-for-betting-on-soft-books
- True Value Engine — Vig/Margin/Overround — https://www.truevalueengine.com/understanding-bookmaker-vig-margin-and-overround/
- Karl Whelan — Estimating Expected Loss Rates — https://www.karlwhelan.com/Papers/Overround.pdf
- GitHub mberk/shin — Shin's method — https://github.com/mberk/shin
- BettorEdge — Sharp Money vs Public / Line Movement — https://www.bettoredge.com/post/sharp-money-vs-public-action-line-movement-explained
- MTS — Betting Against the Public — https://www.mytopsportsbooks.com/guide/advanced-betting/betting-against-the-public/
- 22bet — Beating the Closing Line — https://news.22bet.com/wiki/betting-guide/beating-closing-line-matters-sports-betting/
- ScienceDirect — Behavioral biases NFL (overreaction/recency) — https://www.sciencedirect.com/science/article/abs/pii/S2214635021000666
- SportsHandle — Recency Bias — https://sportshandle.com/recency-bias-sports-betting/
- Netbots Norway — Anchoring bias — https://www.netbotsnorway.com/how-anchoring-bias-affects-decision-making-in-sports-betting/
- Action Network (Bales) — Anchoring — https://www.actionnetwork.com/education/jonathan-bales-how-to-deal-with-anchoring-in-sports-betting-and-daily-fantasy-sports
- Pinnacle — Confirmation bias — https://www.pinnacle.com/en/betting-articles/Betting-Psychology/how-confirmation-bias-affects-your-betting/79425XBAQM6NPE72
- The Data Jocks — EMH and Sports Betting — https://thedatajocks.com/oddsmakers-sports-efficient-market-hypothesis/
- Pinnacle — EMH / early bets — https://www.pinnacle.com/betting-resources/en/educational/efficient-market-hypothesis-in-sports-betting-why-early-bets-beat-the-market
- Wiley Kyklos — Home advantage & market efficiency (crowds) — https://onlinelibrary.wiley.com/doi/10.1111/kykl.12291
- arXiv 2008.05417 — Mispricing disappeared home advantage (Bundesliga COVID) — https://arxiv.org/pdf/2008.05417
- PubMed — Overreaction in Football Wagers — https://pubmed.ncbi.nlm.nih.gov/30427702/
- ResearchGate — Role of Surprise (in-play) — https://www.researchgate.net/publication/256013000...
- ResearchGate — Profiting from overreaction in soccer odds — https://www.researchgate.net/publication/341608827...
- Oxford Academic JRSS-C — Dixon-Coles original (Modelling Association Football Scores) — https://academic.oup.com/jrsssc/article-abstract/46/2/265/6990546
- wagerbase — Kelly Criterion Practical Guide — https://wagerbase.io/guides/kelly-criterion-sports-betting-guide
- BettorEdge — Kelly vs Flat / Variance — https://www.bettoredge.com/post/kelly-criterion-vs-flat-betting-bankroll-strategies · https://www.bettoredge.com/post/variance-in-sports-betting-explained
- Bet Hero — Staking Strategies — https://betherosports.com/blog/staking-strategies
- RebelBetting — Reduce Variance / Kelly vs Flat — https://www.rebelbetting.com/blog/how-to-reduce-variance-when-value-betting · https://www.rebelbetting.com/blog/kelly-staking-strategy-vs-flat-staking-which-is-the-best
- VSiN — Importance of CLV — https://vsin.com/how-to-bet/the-importance-of-closing-line-value/
- trueedge.bet — What is CLV — https://trueedge.bet/blog/what-is-closing-line-value/
- Grokipedia / football-bet-prediction / datafc — Dixon-Coles overview — https://grokipedia.com/page/DixonColes_model · https://football-bet-prediction.com/articles/dixoncoles-model-explained-improving-poisson/ · https://urazakgul.github.io/datafc-blog/posts/en/post3/...
- arXiv physics/0008082 — CI for Poisson parameter — https://arxiv.org/pdf/physics/0008082
- Eracons — Bayesian Poisson uncertainty — https://eracons.com/resources/bayesian-poisson
- Predictology — Overfitting betting models — https://www.predictology.co/blog/7-mistakes-youre-making-with-overfitting-betting-models-and-how-to-fix-them/
- football-data.co.uk — Wisdom of the Crowd — https://www.football-data.co.uk/The_Wisdom_of_the_Crowd_updated.pdf
- Academia das Apostas Brasil — Prós/contras handicap asiático — https://www.academiadasapostasbrasil.com/blog/2025/02/pros-e-contras-de-apostas-em-handicap-asiatico-de-gols
- Erick Tipster — Handicap Asiático — https://ericktipster.com.br/handicap-asiatico-o-mercado-preferido-dos-profissionais-nas-apostas-esportivas/
- Frontiers — Bayesian predict performance football — https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1486928/full
- Wikipedia — Shrinkage (statistics) — https://en.wikipedia.org/wiki/Shrinkage_(statistics)
