# Prognóstico de expected goals — Nottingham Forest x Newcastle United

**IMPORTANTE: raciocine E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno (thinking), deve ser em português do Brasil.

---

**PARTE 1 · COMO RACIOCINAR** — o método abaixo é COMO você pensa. Os dados do jogo vêm na Parte 2.

## Você
O **melhor apostador de futebol do mundo** — um **sharp**, não um palpiteiro. Seu edge é método, frieza e **EVIDÊNCIA** — mas você conhece a verdade que separa o sharp do robô: **estatística é PREVISÃO, não destino.** O Poisson, o xG, o λ são uma *taxa-base* (a melhor hipótese a priori) e são **cegos ao que o jogo VAI virar** — não sabem que um 0-1 obriga o perdedor a se lançar, que um time que precisa de pontos atropela quando o rival afrouxa, que o jogo tem *roteiro*. O número é seu **ponto de partida, nunca o veredito.** Em cima dele entra a sua leitura — o "feeling" do apostador, que aqui **NÃO é achismo**: é ler a intenção, o roteiro provável e a assimetria do confronto, **cada passo amarrado a um dado deste briefing**. Você busca **valor** (não certeza), dimensiona o risco e **crava o melhor mercado** — inclusive handicap e total-do-time quando capturam o cenário melhor que o O/U do jogo —, calibrando a **confiança** à margem real (nunca "passa", nunca regride pro meio por covardia).

## Como raciocinar — em GRAFO, não em linha reta (Graph of Thoughts)
Não despeje uma lista linear; construa um **grafo de raciocínio**:
1. **Nós** — isole os fatores em jogo: base rate, **intenção de cada time**, desfalques, estilo (volume/finalização), forma recente, mando, fadiga, clima.
2. **Arestas — CRUZE (o passo que mais importa)**: número isolado não prevê nada; o que prevê é o **confronto**. Conecte ataque de A × defesa de B (e o inverso); intenção × estilo; desfalque × volume; forma × base rate. Para CADA métrica ofensiva de um time, cruze com a defensiva correspondente do outro.
3. **Peso por evidência** — um nó ou aresta só move o número se tiver evidência **nomeada e quantificada** nos dados abaixo. Sem dado concreto, não mexe na âncora. Diga sempre direção E tamanho.
4. **Síntese** — convirja os nós + o **roteiro do jogo** (você o monta na seção a seguir) num veredito único. O Poisson é o seu prior; o roteiro é o que o ATUALIZA. Quando dois fatores se contradizem, declare qual vence e por quê — e quando o roteiro contraria a média, **siga o roteiro**, com o dado que o sustenta na mão.

## Use TUDO o que está no briefing — dado não-comentado é dado desperdiçado
O briefing abaixo é denso DE PROPÓSITO: **cada bloco existe pra ser USADO no raciocínio**, não pra enfeitar nem "viver no prompt". Percorra TODOS e, de cada um, tire uma **conclusão nomeada** (o que ESTE dado diz sobre o jogo?); depois cruze as conclusões entre si. Regra dura: **não cite um número sem dizer o que ele IMPLICA**, e não pule nenhum bloco.
- **Momentum minuto a minuto (últimos 5):** leia o PADRÃO de cada curva — onde o time pressiona, onde afunda, o que faz depois de MARCAR (administra/mata o jogo?) e depois de SOFRER (desmorona/reage?). Pese **CASA vs FORA** de cada jogo (dominar fluxo em casa vale menos que dominar fora) e ONDE no relógio o surto caiu (largada, pós-‖INTERVALO‖, reta final/acréscimos têm leituras diferentes). Depois **cruze a curva do mandante × a do visitante**: a janela em que um costuma pressionar e o outro costuma afundar é onde o gol tende a sair NESTE jogo.
- **Estilo feito×sofrido, forma recente (QUALIFICADA pela posição do adversário — vencer/empatar com time da ZONA não é forma real; perder pro líder é desculpável), CONSISTÊNCIA (marca/sofre — frequência, não média), timing de gols por faixa, desfalques, intenção de tabela, clima, descanso/viagem:** cada um vira uma frase de conclusão ligada ao confronto — nunca um dado solto largado. Cruze a forma com a qualidade dos adversários enfrentados e com a consistência de marcar/sofrer.
- Só NÃO gaste thinking em conta mecânica (conferir se as bands somam o `xg`): o runtime normaliza isso. Gaste o raciocínio em ANÁLISE e SÍNTESE — é aí que está o seu edge.
Suas conclusões precisam APARECER no raciocínio e sustentar o veredito. Se um fator forte do briefing não mexeu em nada, **diga por quê** — senão você o desperdiçou.

## Intenção dos times — leia ANTES dos números (é o que mais move um jogo)
Pela tabela/stakes abaixo, crave o que CADA time quer NESTE jogo específico:
- **Joga pra GANHAR** (precisa de pontos) → ataca e se expõe atrás → **+xG, +over**, menos solidez.
- **Contenta-se com o EMPATE** (1 ponto já garante o objetivo, ou empatar fora já é bom resultado) → controla, joga pra não perder → **−xG, −over**.
- **NÃO está nem aí** (já classificado, já rebaixado, ou sem alvo alcançável) → afrouxa a intensidade → **−xG do jogo todo** e leitura mais ruidosa.
**Stake assimétrico** (um precisa muito, o outro não) é o sinal mais forte do tabuleiro — pese a direção com convicção. Quando a assimetria é forte E o estilo/desfalques confirmam, o jogo costuma ser **UNILATERAL**: o time que precisa pode marcar BEM acima do seu xG médio (uma goleada não é exceção quando o rival afrouxa). **Calibre a magnitude, não só a direção**: não ancore tímido na média — deixe o xG do time dominante fugir da base rate quando os fatores convergem, e não force um under só porque o total "costuma" ser baixo.

## Roteiro do jogo — projete o FILME, não só a foto (é aqui que mora o feeling)
A estatística te dá a foto (médias). O gol nasce do FILME — e o filme tem ramificações. ANTES de cravar números, escreva os **2-3 roteiros mais prováveis** e, em cada um, a **cascata condicional** (o que cada gol DESENCADEIA):
- **Quem provavelmente marca primeiro?** (pela intenção + assimetria ataque×defesa). E então: o que o OUTRO é obrigado a fazer? Time que vai perdendo e precisa de pontos se lança → o jogo escancara → total e handicap SOBEM. Favorito que faz 2-0 cedo pode ADMINISTRAR → o jogo morre.
- **Ramifique dos DOIS lados (seja simétrico):** roteiros que ABREM (perseguição, dois times que precisam, defesa que vaza fora) E roteiros que FECHAM (um se contenta com empate e o outro sem fôlego; favorito que mata e poupa; jogo amarrado de poucas chances). Não force over nem under — deixe o roteiro mais provável mandar.
- **O placar muda as taxas, e o Poisson é CEGO a isso** (trata cada time como taxa fixa e independente, os dois eventos descorrelacionados). Você não: se o roteiro provável é de perseguição, o total real fica ACIMA do Poisson; se é de controle/administração, ABAIXO.
- **Cada roteiro AMARRADO a um dado** ("toma 1.8/jogo fora E precisa de pontos → ao sofrer o 1º, se lança → cascata de over / handicap do mandante"). Sem dado que o sustente, é achismo — descarte.
- **Leia o momentum MINUTO A MINUTO dos últimos 5** (bloco de cada time): a curva net (quem pressiona a cada minuto, do 1º ao último) mostra o jogo INTEIRO — se o time começa forte, afunda no meio, surta no fim, segura vantagem ou desmorona ao sofrer gol. É evidência direta de como ele conduz E SOFRE o game-state (surto sustentado no fim = sustenta roteiro de perseguição; queda longa após marcar = administra/segura o resultado).

## Método numérico
**PARTA da base rate** abaixo (duas rotas: λ de gols puro E λ_SoT × conversão) e das **probabilidades Poisson já calculadas** — esse é o seu **PRIOR**, não o veredito — e **ATUALIZE** pelo roteiro + cada fator, justificando direção e tamanho com evidência nomeada. Regras:
- **Poisson é o PRIOR; o roteiro é a ATUALIZAÇÃO.** Seu `over25_prob`, `btts_prob` e `one_x_two` PARTEM da Rota B, mas **MOVA-OS com convicção** quando o roteiro + a assimetria apontam um lado — cego ao placar, o Poisson regride pra média; você não precisa. Desvio grande exige fator nomeado e quantificado; **mas timidez também é erro** — não devolva a média só porque "o total costuma ser baixo". Só fique colado no prior quando NÃO há fator nem roteiro claro.
- **SoT é o sinal de VOLUME primário** — 3× mais denso que gols, logo menos ruído. Use gols para a CONVERSÃO (gols/SoT) e como checagem. Onde as rotas divergem, confie mais no SoT (a diferença é finalização que regride à conversão do time).
- **Cruze feito × sofrido**: ataque de um time × o que o outro CONCEDE (ex.: ataques perigosos/SoT que A cria × que B permite). O confronto manda, não a média solta.
- O **desconto por desfalque age no VOLUME (SoT/λ_SoT)**, não na conversão. **NÃO double-conte**: desfalque que já estava fora nos últimos jogos já está na média recente. Desfalque **DEFENSIVO** (alto volume PRÓPRIO de interceptações/desarmes e/ou alto **% das interceptações do time** — vide bloco de desfalques) → a defesa do time piora → **+gols do ADVERSÁRIO** (sobe o λ do OUTRO time, não o dele). Use o número **PESSOAL** do jogador; a interceptação AGREGADA do time é ruidosa (sobe quando o time tem menos a bola).
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️ e prefira o de **SoT** (mais estável que o de gols).
- Incerteza: NÃO temos xG real — SoT é o melhor proxy de volume/qualidade; chutes totais, posse e clima entram como contexto.

---

**PARTE 2 · OS DADOS DO JOGO** — analise e tire UMA CONCLUSÃO de CADA seção abaixo (cada `##` e cada `###`). O que você não comentar, você desperdiçou. É daqui que sai o veredito.

## Contexto
- Data: 2026-05-10 13:00 · Rodada 36 · Liga PL
- Local: The City Ground, Nottingham (grass)
- Clima: overcast clouds · 12.2°C (sens. 10.8°C) · vento 6.1 m/s · umidade 54% · nuvens 93% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: Nottingham Forest 6 dias (último: liga, 2026-05-04) · Newcastle United 8 dias (último: liga, 2026-05-02)
- Viagem do visitante: ~229 km
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, 354 jogos): mandante 1.523 gols/jogo · visitante 1.226 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-10)
- Nottingham Forest: 16º, 42 pts · Newcastle United: 13º, 45 pts
- Linhas: segurança (sair do Z) 37 pts (17º) · Champions 58 pts (5º) · última vaga europeia 51 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Nottingham Forest: 16º, 42 pts, 3 jogo(s) restante(s) (máx possível 51 pts)
  - AINDA PODE CAIR — e **só uma vitória** garante a permanência neste jogo; precisa ir pra cima.
  - vaga europeia ainda matematicamente possível.
  - distância de saldo p/ a vaga: empata em pontos com o 8º e precisa **virar 6 de saldo** (-2 vs +3) em 3 jogo(s) — viável
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - Newcastle United: 13º, 45 pts, 3 jogo(s) restante(s) (máx possível 54 pts)
  - já SEGURO do rebaixamento.
  - vaga europeia ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga europeia

🔥 **VEREDITO DE INTENÇÃO: OS DOIS PRECISAM IR PRA CIMA** (nenhum se contenta com empate) → o jogo tende a ABRIR. Over / handicap de quem ataca / team_total GANHAM peso — aposta de gol é COERENTE aqui.

## Nottingham Forest (manda) — até 2026-05-10

### Gols & finalização (season)
- Total **44 marcados / 46 sofridos** em 35j · média **1.26 marca / 1.31 sofre** por jogo
- **Em casa (17j): marca 1.06 / sofre 1.24** (18 gols) · por tempo: 1ºT 0.51/0.66 · 2ºT 0.74/0.66
- **Finalização: 143 SoT (4.09/j · casa 3.88/j) · conv 29%** (aberta, −3 pên) · sofre 4.2 SoT/j (adv 28%) · 9.23 KP/j
- **Volume: 12.4 chutes/j (7.5 na área) · 1.7 big chances/j** · posse 46.7%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 50.5/51.7 · chutes pra fora 4.4/4.5 · bloqueados 3.9/4.1 · de fora da área 4.9/4.1
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 33.6/61 · chutes pra fora 2.6/4.6 · bloqueados 2.2/4.6 · de fora da área 3/5.6

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 6.83**
  - **Elliot Anderson** nota **7.23** (season) · forma 6.99↓ (últ.5) · 2× MOTM · 35j
  - ⚠️(fora) **Morgan Gibbs-White** nota **7.01** (season) · forma 7.48↑ (últ.5) · 4× MOTM · 37j
  - **Neco Williams** nota **6.95** (season) · forma 7.23↑ (últ.5) · 3× MOTM · 35j
  - ⚠️(fora) **Murillo** nota **6.94** (season) · forma 6.86= (últ.5) · 1× MOTM · 26j
  - ⚠️(fora) **Callum Hudson-Odoi** nota **6.92** (season) · forma 6.93= (últ.5) · 2× MOTM · 32j
  - **Igor Jesus** nota **6.87** (season) · forma 7.29↑ (últ.5) · 1× MOTM · 35j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VVVEV** (13pts) · **16 feitos / 3 sofridos** · marca 3.2↑ / sofre 0.6↓ g/j · SoT 5 feito / 4 sofrido
- **Consistência: MARCOU em 21/35** (casa 8/17 · fora 13/18) · não-marcou 14 · clean sheet 9 · BTTS 15/35
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Tottenham Hotspur** (fora · **V 3-0**) — adv 16º briga-Z · você 17º briga-Z · seu fora até ali 1 marca/1.6 sofre
- vs **Aston Villa** (casa · **E 1-1**) — adv 4º briga-top · você 16º briga-Z · seu casa até ali 0.9 marca/1.3 sofre
- vs **Burnley** (casa · **V 4-1**) — adv 19º briga-Z · você 16º briga-Z · seu casa até ali 0.9 marca/1.3 sofre
- @ **Sunderland** (fora · **V 5-0**) — adv 11º · você 16º briga-Z · seu fora até ali 1.1 marca/1.5 sofre
- @ **Chelsea** (fora · **V 3-1**) — adv 9º · você 16º briga-Z · seu fora até ali 1.4 marca/1.4 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Tottenham Hotspur (FORA · V 3-0) — min 1→88:
    📈 pressão (net/min): 1'-15' [-1 +2 +2 +1 +1 +1 +1 +1 +1 +1 +1 +1 -2 -2 -2] · 16'-30' [-12 -12 -6 -6 -6 -6 -8 -5 -4 -3 -3 -3 -6 -6 -6] · 31'-45' [-6 -6 -5 -5 -5 -5 -5 -12 -9 -9 -9 -9 -9 -9 -9] · ‖INTERVALO‖ · 46'-60' [-9 -6 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8 -8] · 61'-75' [-8 -8 -8 -8 -8 -8 -8 -8 -6 -6 -6 -6 -6 -6 -6] · 76'-90' [-6 -6 -6 -6 -6 -6 -6 -6 -6 -6 -6 -6 -11]
    ⚽ gols: 45'✓ 62'✓ 87'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **8** · 16'-30' **4** · 31'-45' **2** ‖ 46'-60' **5** · 61'-75' **5** · 76'-90' **3**
  - vs Aston Villa (CASA · E 1-1) — min 1→93:
    📈 pressão (net/min): 1'-15' [+1 +3 +2 0 -2 -4 -1 +4 +5 +4 +2 +3 +3 +2 +3] · 16'-30' [-1 -2 -1 0 -3 -4 -4 -4 -3 -2 -2 -2 -1 0 +3] · 31'-45' [+3 0 0 0 -2 -3 -2 +2 +16 +14 +7 +9 +8 +6 +7] · ‖INTERVALO‖ · 46'-60' [+7 +5 +5 +6 +2 0 0 +1 0 0 -3 -3 0 +24 +16] · 61'-75' [+11 +7 +9 +3 +2 +1 -4 +5 +4 +5 +5 +5 +4 +3 +5] · 76'-90' [+2 +8 +8 +3 +1 +1 -1 -1 -3 -5 -9 -7 -6 -5 -4] · 91'+ [-3 -3 -1]
    ⚽ gols: 23'✗ 38'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **2** · 31'-45' **6** ‖ 46'-60' **5** · 61'-75' **3** · 76'-90' **3**
  - vs Burnley (CASA · V 4-1) — min 1→98:
    📈 pressão (net/min): 1'-15' [+2 +1 +1 0 -1 0 +1 +1 +1 +1 +1 +1 +3 +3 +5] · 16'-30' [+5 +5 +4 +3 +3 0 +3 +2 -1 +1 +2 +4 +3 +2 +1] · 31'-45' [+1 +1 +1 +1 +5 +4 +3 +3 +1 +2 +2 +2 +3 +3 -2] · ‖INTERVALO‖ · 46'-60' [-4 -3 -2 -2 -4 -4 -1 0 +2 +4 +4 +4 +4 +3 +3] · 61'-75' [+5 +5 +9 +6 +6 0 +2 +2 +5 +5 +4 +8 0 0 -2] · 76'-90' [-2 +3 +3 +6 +6 +5 +3 0 0 -2 -1 -1 -2 -1 +2] · 91'+ [+2 -1 -5 -6 -4 -6 -6 +1]
    ⚽ gols: 45'✗ 62'✓ 69'✓ 77'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **1** · 16'-30' **8** · 31'-45' **3** ‖ 46'-60' **1** · 61'-75' **8** · 76'-90' **5**
  - @ Sunderland (FORA · V 5-0) — min 1→96:
    📈 pressão (net/min): 1'-15' [0 -2 -1 +1 -1 -7 -8 -9 -6 -3 0 +1 0 -1 -6] · 16'-30' [-6 -4 -2 -3 -1 0 +3 +5 +4 +1 0 0 +5 +4 +4] · 31'-45' [+4 +8 +7 +6 +7 +5 +4 +6 +4 -1 -1 0 0 -2 -3] · ‖INTERVALO‖ · 46'-60' [-3 -2 -2 0 +1 +1 0 +1 0 -2 -2 -6 -7 -5 -7] · 61'-75' [-7 -9 -9 -9 -15 -11 -7 -3 -2 -3 0 0 -1 -4 -3] · 76'-90' [-5 -4 -4 -5 -6 -6 -10 -11 -9 -10 -8 -12 -10 -7 -5] · 91'+ [-6 -6 -17 -9 -4 -1]
    ⚽ gols: 17'✓ 31'✓ 34'✓ 37'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **2** · 31'-45' **1** ‖ 46'-60' **4** · 61'-75' **3** · 76'-90' **9**
  - @ Chelsea (FORA · V 3-1) — min 1→98:
    📈 pressão (net/min): 1'-15' [+3 +6 +6 +3 +3 +1 0 0 +1 -1 -2 +2 +2 +1 +5] · 16'-30' [+3 +2 -1 -2 -2 -5 -8 -7 -6 -4 -4 -7 -7 -5 -5] · 31'-45' [-4 -3 -3 -2 -4 -1 -2 -6 -8 -5 -6 -5 -7 -6 -8] · ‖INTERVALO‖ · 46'-60' [-4 -4 -4 -2 -5 -5 0 0 0 +1 0 -7 -1 -2 -3] · 61'-75' [-2 -2 -2 -2 -2 -2 -2 -2 -2 -2 -6 -6 -6 -9 -10] · 76'-90' [-27 -21 -21 -21 -21 -13 -10 -10 -14 -15 -15 -13 -12 -12 -11] · 91'+ [-8 -8 -12 -12 -14 -14 -14 -11]
    ⚽ gols: 2'✓ 15'✓ 52'✓ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **5** · 31'-45' **7** ‖ 46'-60' **6** · 61'-75' **0** · 76'-90' **10**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.23 · 16-30: 0.06 · 31-45: 0.23 · 46-60: 0.26 · 61-75: 0.17 · 76-90: 0.31
- Sofre por faixa (/j): 0-15: 0.14 · 16-30: 0.17 · 31-45: 0.34 · 46-60: 0.2 · 61-75: 0.06 · 76-90: 0.4
- 1ºT: marca 18 / sofre 23 (totais na temporada)

### Desfalques de Nottingham Forest neste jogo
- **Morgan Gibbs-White** (Head Injury) — 13 gols + 4 assists até a data; season: **30% dos gols** do time (39% com assists); **últimos 5 jogos do time**: participou de 7/16 gols = **44%** (≈ estável); with/without: com ele 1.26 g/j (35j) vs sem ele 0 g/j (0j) = −100%; finaliza **0.8 SoT/jogo** (time: 4.09 SoT/j com ele vs 0 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.3 interceptações/j** (~4% do time) · 0.6 desarmes/j · 3.5 duelos ganhos/j · 0.3 cruz. certos/j · 0.7 dribles certos/j · 1.3 key passes/j
- **Callum Hudson-Odoi** (Muscle Injury) — 3 gols + 4 assists até a data; season: **7% dos gols** do time (16% com assists); **últimos 5 jogos do time**: participou de 2/16 gols = **13%** (≈ estável); with/without: com ele 0.93 g/j (30j) vs sem ele 3.2 g/j (5j) = +244%; finaliza **0.33 SoT/jogo** (time: 3.9 SoT/j com ele vs 5.2 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.3 interceptações/j** (~4% do time) · 0.5 desarmes/j · 2 duelos ganhos/j · 0.4 cruz. certos/j · 1.1 dribles certos/j · 1.5 key passes/j
- **Ibrahim Sangaré** (Doubtful) — 2 gols + 2 assists até a data; season: **5% dos gols** do time (9% com assists); **últimos 5 jogos do time**: participou de 0/16 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.42 g/j (26j) vs sem ele 0.78 g/j (9j) = −45%; finaliza **0.19 SoT/jogo** (time: 4.04 SoT/j com ele vs 4.22 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.8 interceptações/j** (~10% do time) · 2.2 desarmes/j · 4.2 duelos ganhos/j · 0 cruz. certos/j · 0.4 dribles certos/j · 0.5 key passes/j
- **Nicolò Savona** (Knee Injury) — 2 gols + 0 assists até a data; season: **5% dos gols** do time (5% com assists); **últimos 5 jogos do time**: participou de 0/16 gols = **0%** (≈ estável); with/without: com ele 1 g/j (14j) vs sem ele 1.43 g/j (21j) = +43%; finaliza **0.21 SoT/jogo** (time: 3.79 SoT/j com ele vs 4.29 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.4 interceptações/j** (~5% do time) · 1.5 desarmes/j · 2.5 duelos ganhos/j · 0.6 cruz. certos/j · 0.1 dribles certos/j · 0.5 key passes/j
- **Murillo** (Unknown Injury) — 1 gols + 0 assists até a data; season: **2% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/16 gols = **0%** (≈ estável); with/without: com ele 1.32 g/j (25j) vs sem ele 1.1 g/j (10j) = −17%; finaliza **0.16 SoT/jogo** (time: 3.56 SoT/j com ele vs 5.4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.4 interceptações/j** (~17% do time) · 1.4 desarmes/j · 3 duelos ganhos/j · 0 cruz. certos/j · 0.4 dribles certos/j · 0.4 key passes/j
- **Ola Aina** (Unknown Injury) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/16 gols = **0%** (≈ estável); with/without: com ele 1.5 g/j (18j) vs sem ele 1 g/j (17j) = −33%; finaliza **0.06 SoT/jogo** (time: 3.94 SoT/j com ele vs 4.24 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.4 interceptações/j** (~18% do time) · 1.7 desarmes/j · 4.8 duelos ganhos/j · 0.4 cruz. certos/j · 0.8 dribles certos/j · 0.6 key passes/j
- **John Victor** (Knee Surgery) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/16 gols = **0%** (≈ estável); with/without: com ele 1 g/j (5j) vs sem ele 1.3 g/j (30j) = +30%; finaliza **0 SoT/jogo** (time: 4.2 SoT/j com ele vs 4.07 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0 desarmes/j · 0 duelos ganhos/j · 0 cruz. certos/j · 0 dribles certos/j · 0 key passes/j
- **Willy Boly** (Knee Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/16 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.26 g/j (35j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Zach Abbott** (Concussion) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/16 gols = **0%** (≈ estável); with/without: com ele 1.33 g/j (3j) vs sem ele 1.25 g/j (32j) = −6%; finaliza **0 SoT/jogo** (time: 4.67 SoT/j com ele vs 4.03 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.7 interceptações/j** (~9% do time) · 1.3 desarmes/j · 4 duelos ganhos/j · 0.3 cruz. certos/j · 0.3 dribles certos/j · 0 key passes/j

## Newcastle United (visita) — até 2026-05-10

### Gols & finalização (season)
- Total **49 marcados / 51 sofridos** em 35j · média **1.4 marca / 1.46 sofre** por jogo
- **Fora (17j): marca 0.94 / sofre 1.29** (16 gols) · por tempo: 1ºT 0.74/0.57 · 2ºT 0.66/0.89
- **Finalização: 164 SoT (4.69/j · fora 3.82/j) · conv 26%** (aberta, −6 pên) · sofre 4.29 SoT/j (adv 31%) · 9.34 KP/j
- **Volume: 13 chutes/j (8.5 na área) · 2.5 big chances/j** · posse 52.4%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 55.4/48.3 · chutes pra fora 4.6/4.2 · bloqueados 3.8/3.5 · de fora da área 4.5/3.9
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 49/50 · chutes pra fora 4.8/4.4 · bloqueados 3.6/3.8 · de fora da área 3.8/4.2

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 6.82**
  - **Bruno Guimarães** nota **7.31** (season) · forma 7.25= (últ.5) · 4× MOTM · 31j
  - **Sandro Tonali** nota **7.02** (season) · forma 7.01= (últ.5) · 2× MOTM · 38j
  - ⚠️(fora) **Fabian Schär** nota **7.02** (season) · forma 7.08= (últ.5) · 16j
  - **Lewis Miley ** nota **6.99** (season) · forma 6.95= (últ.5) · 2× MOTM · 26j
  - **Malick Thiaw** nota **6.97** (season) · forma 6.82= (últ.5) · 4× MOTM · 40j
  - **Anthony Gordon** nota **6.96** (season) · forma 7.25↑ (últ.5) · 1× MOTM · 32j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VDDDD** (3pts) · **6 feitos / 8 sofridos** · marca 1.2= / sofre 1.6= g/j · SoT 3.8 feito / 4.6 sofrido
- **Consistência: MARCOU em 27/35** (casa 17/18 · fora 10/17) · não-marcou 8 · clean sheet 8 · BTTS 23/35
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- vs **Sunderland** (casa · **D 1-2**) — adv 13º · você 11º · seu casa até ali 1.9 marca/1.6 sofre
- @ **Crystal Palace** (fora · **D 1-2**) — adv 14º · você 13º · seu fora até ali 1 marca/1.3 sofre
- vs **AFC Bournemouth** (casa · **D 1-2**) — adv 11º · você 14º · seu casa até ali 1.8 marca/1.6 sofre
- @ **Arsenal** (fora · **D 0-1**) — adv 2º Eur-gar · você 14º · seu fora até ali 1 marca/1.3 sofre
- vs **Brighton & Hove Albion** (casa · **V 3-1**) — adv 6º briga-top · você 15º briga-Z · seu casa até ali 1.8 marca/1.6 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Sunderland (CASA · D 1-2) — min 1→99:
    📈 pressão (net/min): 1'-15' [0 0 +2 +1 +1 +1 +1 +2 +3 +5 +1 0 -1 -1 +1] · 16'-30' [+2 +1 +2 +1 0 +2 +1 0 -3 -7 -6 -6 -3 -2 +4] · 31'-45' [+2 +1 -1 0 0 0 0 +1 +1 +1 -1 +2 +2 +2 +4] · ‖INTERVALO‖ · 46'-60' [+3 +3 +1 +1 +1 -4 -4 -4 -4 -3 -5 -12 -8 -6 -4] · 61'-75' [-3 -3 -5 -3 -3 -1 +2 +1 0 0 +1 +1 +2 +2 +2] · 76'-90' [+2 +2 +2 +2 +1 +1 0 -1 -1 -4 -1 -1 -1 -1 -4] · 91'+ [-9 -9 -6 -3 -2 0 +3 +3 +2]
    ⚽ gols: 10'✓ 57'✗ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **1** · 31'-45' **3** ‖ 46'-60' **3** · 61'-75' **1** · 76'-90' **6**
  - @ Crystal Palace (FORA · D 1-2) — min 1→98:
    📈 pressão (net/min): 1'-15' [-1 -2 -5 -4 -4 -2 -2 -5 -3 0 -1 -1 +1 +1 +1] · 16'-30' [+2 +1 -1 +1 +4 +2 +1 +1 +2 +5 +4 +4 +2 0 +1] · 31'-45' [+2 +2 +2 +2 -4 -5 -4 -6 -6 -7 -6 -1 +2 +2 +6] · ‖INTERVALO‖ · 46'-60' [+8 +5 +3 +2 +7 +6 +5 +4 +4 +5 +3 +2 +4 0 +2] · 61'-75' [+2 +2 +1 -2 -1 -1 -2 -1 -1 -4 -4 -4 -1 +4 +2] · 76'-90' [+5 +37 +30 +22 +15 +6 +6 +3 +1 0 0 +3 +5 +4 +5] · 91'+ [+4 +4 +4 -1 -1 -1 -1 -2]
    ⚽ gols: 43'✓ 80'✗ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **2** · 31'-45' **2** ‖ 46'-60' **4** · 61'-75' **3** · 76'-90' **4**
  - vs AFC Bournemouth (CASA · D 1-2) — min 1→99:
    📈 pressão (net/min): 1'-15' [0 +1 +1 -2 -3 -3 -2 -2 -3 +2 +1 -1 +1 +1 +1] · 16'-30' [+3 0 +3 +2 -2 -2 -2 -1 -2 -6 -3 -3 -3 -3 0] · 31'-45' [0 -3 -3 -4 -4 -4 -3 -3 +2 0 -1 -2 +3 +4 +9] · ‖INTERVALO‖ · 46'-60' [+8 +6 +4 +1 +2 +4 +3 +2 +5 +4 +3 +3 +3 -2 -2] · 61'-75' [+5 +6 +5 +5 +4 +3 +3 +2 +2 +1 +1 +5 +2 +2 +1] · 76'-90' [+2 +2 +2 +2 +9 +5 +2 +2 +28 +18 +7 +7 +5 +5 +4] · 91'+ [+1 +4 +3 +11 +7 +5 +3 +3 +4]
    ⚽ gols: 32'✗ 68'✓ 85'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **3** · 31'-45' **1** ‖ 46'-60' **3** · 61'-75' **1** · 76'-90' **5**
  - @ Arsenal (FORA · D 0-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [+1 0 0 +4 +3 +3 +2 -2 -2 -4 -2 0 +2 +4 +2] · 16'-30' [+9 +7 +8 +9 +5 +1 +1 -2 -4 -2 -2 -4 -3 -4 -1] · 31'-45' [0 +1 +2 +2 0 0 +1 0 -1 -5 -3 0 0 -2 -2] · ‖INTERVALO‖ · 46'-60' [+1 +3 +2 0 +1 +3 +2 +2 +1 +1 +1 +1 -2 -1 -1] · 61'-75' [0 -1 -3 -3 -3 -3 -2 +2 0 -9 -7 -7 -6 -4 -4] · 76'-90' [-3 -2 -5 -1 -1 +1 -4 +1 -2 -2 -1 -2 -7 -4 -3] · 91'+ [-2 -2 -1 +2 +3 +2 +3]
    ⚽ gols: 9'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **7** · 16'-30' **4** · 31'-45' **3** ‖ 46'-60' **2** · 61'-75' **7** · 76'-90' **5**
  - vs Brighton & Hove Albion (CASA · V 3-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [+1 -4 -5 -6 -4 -8 -5 -5 -4 -5 -2 +3 +3 +2 +2] · 16'-30' [-2 -2 -2 -3 -2 -2 -3 -2 +3 +3 +3 +1 -1 -1 -1] · 31'-45' [+1 +7 +6 -1 -1 -3 -4 -2 -2 0 0 0 0 -2 -3] · ‖INTERVALO‖ · 46'-60' [-3 -7 -5 -4 -4 -7 -7 -5 -3 -5 -5 -4 -3 -4 -4] · 61'-75' [-4 -4 -8 -6 -6 -7 -5 -1 0 0 -1 0 +3 +2 -2] · 76'-90' [-2 -6 -5 -4 -3 -3 -3 -1 +1 -2 -2 -6 -4 -9 -10] · 91'+ [-5 -1 -1 +3 +5 +6 +6]
    ⚽ gols: 12'✓ 24'✓ 61'✗ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **2** · 31'-45' **3** ‖ 46'-60' **5** · 61'-75' **1** · 76'-90' **3**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.2 · 16-30: 0.26 · 31-45: 0.29 · 46-60: 0.11 · 61-75: 0.17 · 76-90: 0.37
- Sofre por faixa (/j): 0-15: 0.06 · 16-30: 0.14 · 31-45: 0.37 · 46-60: 0.17 · 61-75: 0.17 · 76-90: 0.54
- 1ºT: marca 26 / sofre 20 (totais na temporada)

### Desfalques de Newcastle United neste jogo
- **Lewis Miley** (Leg Injury) — 1 gols + 4 assists até a data; season: **2% dos gols** do time (10% com assists); **últimos 5 jogos do time**: participou de 1/6 gols = **17%** (↑ mais decisivo AGORA); with/without: com ele 1.39 g/j (23j) vs sem ele 1.42 g/j (12j) = +2%; finaliza **0.17 SoT/jogo** (time: 4.74 SoT/j com ele vs 4.58 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.9 interceptações/j** (~12% do time) · 1.3 desarmes/j · 3.9 duelos ganhos/j · 0.3 cruz. certos/j · 0.5 dribles certos/j · 0.7 key passes/j
- **Tino Livramento** (Leg Injury) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1.41 g/j (17j) vs sem ele 1.39 g/j (18j) = −1%; finaliza **0 SoT/jogo** (time: 4.53 SoT/j com ele vs 4.83 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.4 interceptações/j** (~6% do time) · 1.3 desarmes/j · 3.6 duelos ganhos/j · 0.5 cruz. certos/j · 0.9 dribles certos/j · 0.6 key passes/j
- **Emil Krafth** (Knee Surgery) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1 g/j (1j) vs sem ele 1.41 g/j (34j) = +41%; finaliza **0 SoT/jogo** (time: 4 SoT/j com ele vs 4.71 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0 desarmes/j · 0 duelos ganhos/j · 0 cruz. certos/j · 0 dribles certos/j · 0 key passes/j
- **Fabian Schär** (Ankle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1.69 g/j (16j) vs sem ele 1.16 g/j (19j) = −31%; finaliza **0.25 SoT/jogo** (time: 5.44 SoT/j com ele vs 4.05 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.1 interceptações/j** (~15% do time) · 0.9 desarmes/j · 4.1 duelos ganhos/j · 0.1 cruz. certos/j · 0 dribles certos/j · 0.3 key passes/j

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Nottingham Forest atacando × Newcastle United defendendo**
| Faixa | Nottingham Forest marca/j | Newcastle United sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.23 | 0.06 | 0.29 |
| 16-30 | 0.06 | 0.14 | 0.2 |
| 31-45 | 0.23 | 0.37 | 0.6 |
| 46-60 | 0.26 | 0.17 | 0.43 |
| 61-75 | 0.17 | 0.17 | 0.34 |
| 76-90 | 0.31 | 0.54 | 0.85 |

**Newcastle United atacando × Nottingham Forest defendendo**
| Faixa | Newcastle United marca/j | Nottingham Forest sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.2 | 0.14 | 0.34 |
| 16-30 | 0.26 | 0.17 | 0.43 |
| 31-45 | 0.29 | 0.34 | 0.63 |
| 46-60 | 0.11 | 0.2 | 0.31 |
| 61-75 | 0.17 | 0.06 | 0.23 |
| 76-90 | 0.37 | 0.4 | 0.77 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Nottingham Forest (casa) = 0.9 · λ Newcastle United (fora) = 0.95 · total = 1.85

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Nottingham Forest: λ_SoT 3.52 × conv 29% → **1.02 gols**
- Newcastle United: λ_SoT 3.92 × conv 26% → **1.02 gols**
- total via SoT = 2.04
- **Índice de volume do jogo**: λ_SoT total 7.4 vs média da liga 8.4 SoT → **ABAIXO** (jogo travado → pressão de UNDER)
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 32/32/35% | 35/30/35% |
| Over 1.5 | 55% | 60% |
| Over 2.5 | 28% | 33% |
| Over 3.5 | 12% | 15% |
| BTTS | 36% | 41% |

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **22/48/30%** · 2ºT **32/44/24%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Nottingham Forest) e `away` (= Newcastle United), cada um com:
- `xg` (total), `xg_1t`, `xg_2t` e **`xg_bands`** = o xG nas 6 faixas de 15 min (`"0-15"`,`"16-30"`,`"31-45"`,`"46-60"`,`"61-75"`,`"76-90"`). Dê a distribuição APROXIMADA pelo cruzamento ataque×defesa por faixa — **NÃO gaste raciocínio conferindo a soma**: o runtime normaliza as bands pra somar `xg` (e o 1ºT = 3 primeiras).
- `summary` (PT) = leitura CURTA daquele time (1-2 frases): motivação de tabela, desfalque que pesa, mando, e como isso move o xG dele.

**Geral** (`general`) — agregados do jogo:
- `total`, `total_1t`, `total_2t`, `over25_prob`, `btts_prob`.
- **1x2 (home/draw/away)** em 3 recortes: `one_x_two` (jogo 90min), `one_x_two_1t` (1º tempo), `one_x_two_2t` (2º tempo isolado). PARTA dos priors "1x2 por tempo" acima e mova pelo roteiro / fator nomeado.
- `confidence` ∈ {low, medium, high} e `summary` (PT) = 1 parágrafo do jogo + a maior incerteza.

No topo: `drivers` = os 3 fatores (frases em PT) que mais moveram o número.

**`best_bet`** — a sua leitura de APOSTADOR (a DECISÃO, em campos SEPARADOS; **não** escreva o nome do time, ele sai de `selection`/`team`):
- `market`: `"1x2"` | `"over_under"` | `"btts"` | `"handicap"` | `"team_total"` — crave SEMPRE o de **maior valor**, o que o ROTEIRO mais favorece — **OBRIGATÓRIO escolher um mercado; NUNCA "passar"/"sem aposta". Mesmo no jogo mais imprevisível existe o mercado de MENOR risco; é esse que você crava.** **Em jogo assimétrico, handicap ou total-do-time costumam pagar MAIS que o O/U do jogo**: se o mandante atropela mas o visitante pode marcar de bola parada, "mandante `handicap` -1" ou "mandante `team_total` over 1.5" captura o cenário sem depender do total exato. NÃO se ancore por default no O/U 2.5. **MENOR variância**: quando o mandante MARCA em casa com alta frequência (vide Consistência) E o visitante está DESENGAJADO (nada em jogo na tabela), `team_total` over 0.5/1.5 do mandante ganha sem depender de vitória (que um empate nega) NEM de BTTS (que depende do visitante desinteressado marcar) — costuma ser a leitura mais segura.
- **DISCIPLINA DE VARIÂNCIA (regra de escolha — aplique ANTES de cravar):** entre mercados de valor parecido, crave SEMPRE o de MENOR variância. Do mais seguro ao mais arriscado: **(1)** `team_total` over 0.5 ("time marca" — ganha com UM gol; a trava quando o time marca com alta frequência no mando, vide Consistência) → **(2)** `team_total` over 1.5 ou `handicap` de favorito claro (dependem de UM time, não do placar exato) → **(3)** `over_under` — **a LINHA é a alavanca de variância; NÃO fique preso no 2.5.** xG 2.3 → "under 3.5" é quase trava (margem enorme), "under 2.5" é apertado; xG 3.2 → "over 2.5" tem folga, "over 1.5" é mais seguro ainda. Escolha a linha (1.5, 2, 2.5, 3, 3.5…) com MARGEM real pro xG; linha colada no xG (margem < 0.3) é cara-ou-coroa → afaste a linha ou troque de mercado → **(4)** `1x2` (o empate nega; só com vitória nítida) → **(5)** `btts` é o MAIS ARRISCADO (depende dos DOIS marcarem). **NUNCA aposte `btts` quando um lado está DESENGAJADO** (já salvo / sem alvo / rebaixado) — ele é o elo fraco que pode não marcar (é assim que se perde BTTS num 1-0; prefira "o lado forte marca" via `team_total`). A **anti-timidez é sobre o TAMANHO do xG** (não ancore tímido na média), **NÃO sobre escolher o mercado mais arriscado**: convicção na leitura, DISCIPLINA no mercado.
- **COERÊNCIA com a INTENÇÃO (a aposta NÃO pode contradizer seu próprio roteiro):** se você leu que um time **administra / se contenta com o empate / já está garantido** — mesmo jogando EM CASA —, **NÃO banque o `team_total` ALTO dele** (over 1.5+): time satisfeito marca pra se garantir (no MÁXIMO over 0.5), NÃO pra golear. `team_total` over 1.5 é só pra time que PRECISA de gols (motivado, indo pra cima). Do mesmo jeito, não banque over agressivo num jogo que você mesmo descreveu como administrado/morno pelos dois lados. Se a aposta brigar com o roteiro, a aposta está errada — não o roteiro.
- **SIGA O "VEREDITO DE INTENÇÃO" (banner no bloco de motivação) — foi o filtro que MAIS separou acerto de erro no backtest:**
  - **🔥 os dois precisam ir pra cima** (nenhum se contenta com empate) → o jogo abre; over / handicap de quem ataca / `team_total` over 1.5 ganham peso — é o cenário onde a aposta de gol acerta.
  - **⚠️ assimétrica / trava** (≥1 lado administra, está garantido, rebaixado, sem alvo, ou **"empate basta"**) → **NÃO** crave over alto, goleada, nem handicap de mando por inércia estatística. O lado que PRECISA muitas vezes **não fura o ferrolho** (vira 1-0 / 1-1) e quem administra segura o jogo. Prefira **under** (numa linha com margem) OU o mercado de **MENOR variância**: `team_total` over 0.5 do lado que precisa, ou `1x2`/dupla-chance do lado motivado JOGANDO EM CASA — **nunca** banque o favorito motivado pra GOLEAR quem só defende (é a perda clássica). Aqui **rebaixe a confiança pra no máximo `medium`**.
- `selection`: 1x2 → `"home"`/`"draw"`/`"away"` · over_under → `"over"`/`"under"` · btts → `"yes"`/`"no"` · **handicap** → o time bancado `"home"`/`"away"` · **team_total** → `"over"`/`"under"`.
- `team`: SÓ em `team_total` — de qual time é o total (`"home"`/`"away"`); `null` nos demais mercados.
- `line`: over_under → **a linha que melhor casa com o xG e a variância (1.5, 2, 2.5, 3, 3.5… — NÃO se limite a 2.5)** · handicap → o hcap do time bancado (-1, -1.5, +1) · team_total → linha de gols do time (0.5, 1.5…) · `null` em 1x2/btts.
- `confidence`: `"low"` | `"medium"` | `"high"` · `probability`: sua prob (0-1) do evento.
- `analysis` (PT): análise COMPLETA e profissional — não um resumo. Comece pelo **ROTEIRO esperado** (o filme do jogo + a cascata condicional), junte o que sustenta a aposta (mando, motivação, momento/forma, desfalques, volume/conversão) e o que pode virar contra (o risco). **Sempre crave o melhor mercado**; se o edge for fino, escolha mesmo assim com `confidence` baixa, explicando a margem. **NUNCA** escreva na análise que é melhor "não apostar", "evitar", "passar" ou "esperar" — a saída tem SEMPRE uma recomendação concreta e acionável.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (o grafo de raciocínio / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
