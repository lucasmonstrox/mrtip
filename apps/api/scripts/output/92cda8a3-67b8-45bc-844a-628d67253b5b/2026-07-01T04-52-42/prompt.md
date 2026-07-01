# Prognóstico de expected goals — Aston Villa x Tottenham Hotspur

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
- Data: 2026-05-03 18:00 · Rodada 35 · Liga PL
- Local: Villa Park, Birmingham (grass)
- Clima: heavy intensity rain · 14.2°C (sens. 13.8°C) · vento 4.2 m/s · umidade 81% · nuvens 77% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: Aston Villa 8 dias (último: liga, 2026-04-25) · Tottenham Hotspur 8 dias (último: liga, 2026-04-25)
- Viagem do visitante: ~160 km
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, 344 jogos): mandante 1.515 gols/jogo · visitante 1.227 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.29 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-03)
- Aston Villa: 5º, 58 pts · Tottenham Hotspur: 18º, 34 pts
- Linhas: segurança (sair do Z) 36 pts (17º) · Champions 58 pts (5º) · última vaga europeia 49 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Aston Villa: 5º, 58 pts, 4 jogo(s) restante(s) (máx possível 70 pts)
  - já SEGURO do rebaixamento.
  - Champions ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga de Champions
  - disputa pela vaga (5º): pro Aston Villa **um empate basta** (vai a 62, fora do alcance) — só perde a vaga se PERDER. Quem ainda ameaça → Brentford (6º, 51 pts, máx 60) pode **passar em pontos** — vencendo, se o Aston Villa tropeçar; Brighton & Hove Albion (7º, 50 pts, máx 59) pode **passar em pontos** — vencendo, se o Aston Villa tropeçar; AFC Bournemouth (8º, 49 pts, máx 61) pode **passar em pontos** — vencendo, se o Aston Villa tropeçar; Chelsea (9º, 48 pts, máx 60) pode **passar em pontos** — vencendo, se o Aston Villa tropeçar; Everton (11º, 47 pts, máx 59) pode **passar em pontos** — vencendo, se o Aston Villa tropeçar; Crystal Palace (14º, 43 pts, máx 58) empata em pontos mas está **-8 de saldo** (-3 vs +5) — só passa se o Aston Villa perder por muito E ele vencer por muito (virar 8)
  - Tottenham Hotspur: 18º, 34 pts, 4 jogo(s) restante(s) (máx possível 46 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento

⚠️ **VEREDITO DE INTENÇÃO: ASSIMÉTRICA / JOGO TENDE A TRAVAR** — pelo menos um lado NÃO precisa ir pra cima (já garantido, rebaixado, sem alvo, ou **um empate basta** → ADMINISTRA). O lado que precisa pode NÃO furar o ferrolho, e quem administra segura o jogo. **NÃO** favoreça over / goleada / handicap de mando por inércia estatística — prefira UNDER ou mercado de MENOR variância (team_total over 0.5 do lado que precisa, dupla chance), OU rebaixe a confiança. Foi exatamente neste tipo de jogo que a leitura puramente estatística mais errou no histórico.

## Aston Villa (manda) — até 2026-05-03

### Gols & finalização (season)
- Total **47 marcados / 42 sofridos** em 34j · média **1.38 marca / 1.24 sofre** por jogo
- **Em casa (17j): marca 1.59 / sofre 1.06** (27 gols) · por tempo: 1ºT 0.56/0.56 · 2ºT 0.82/0.68
- **Finalização: 153 SoT (4.5/j · casa 5/j) · conv 31%** (aberta, −0 pên) · sofre 4.47 SoT/j (adv 27%) · 9.82 KP/j
- **Volume: 12.8 chutes/j (8.1 na área) · 2.2 big chances/j** · posse 53.9%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 50.4/46.2 · chutes pra fora 4.6/4.4 · bloqueados 3.8/3.9 · de fora da área 4.7/4.2
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 48.2/41.2 · chutes pra fora 6.8/3.8 · bloqueados 2.8/4 · de fora da área 5.4/4.2

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 6.79**
  - **Youri Tielemans** nota **7.18** (season) · forma 7.21= (últ.5) · 2× MOTM · 22j
  - **Douglas Luiz** nota **7.01** (season) · forma 6.67↓ (últ.5) · 1× MOTM · 11j
  - ⚠️(fora) **A. Mvom Onana** nota **6.96** (season) · forma 6.99= (últ.5) · 25j
  - **Matty Cash** nota **6.93** (season) · forma 6.57↓ (últ.5) · 2× MOTM · 33j
  - **Emiliano Martínez** nota **6.91** (season) · forma 6.81= (últ.5) · 2× MOTM · 30j
  - **Morgan Rogers** nota **6.91** (season) · forma 6.87= (últ.5) · 3× MOTM · 37j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: DVEVD** (7pts) · **8 feitos / 8 sofridos** · marca 1.6↑ / sofre 1.6↑ g/j · SoT 4.4 feito / 4.8 sofrido
- **Consistência: MARCOU em 24/34** (casa 13/17 · fora 11/17) · não-marcou 10 · clean sheet 9 · BTTS 18/34
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Manchester United** (fora · **D 1-3**) — adv 3º briga-top · você 4º briga-top · seu fora até ali 1.3 marca/1.4 sofre
- vs **West Ham United** (casa · **V 2-0**) — adv 18º briga-Z · você 4º briga-top · seu casa até ali 1.4 marca/1 sofre
- @ **Nottingham Forest** (fora · **E 1-1**) — adv 16º briga-Z · você 4º briga-top · seu fora até ali 1.3 marca/1.5 sofre
- vs **Sunderland** (casa · **V 4-3**) — adv 11º · você 4º briga-top · seu casa até ali 1.4 marca/0.9 sofre
- @ **Fulham** (fora · **D 0-1**) — adv 12º · você 4º briga-top · seu fora até ali 1.3 marca/1.4 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Manchester United (FORA · D 1-3) — min 1→96:
    📈 pressão (net/min): 1'-15' [0 -1 -2 -2 -1 -1 -1 0 +4 +3 +1 +1 +1 +1 0] · 16'-30' [-1 -1 -1 -1 -1 -3 -4 -4 -2 -2 -1 -5 -4 -3 -1] · 31'-45' [0 0 0 -1 -1 -4 -3 -5 -4 -3 -2 -1 -1 -1 0] · ‖INTERVALO‖ · 46'-60' [-2 -2 -3 -9 -8 -7 -10 -10 -5 +1 +1 +2 +13 +10 +7] · 61'-75' [+5 +2 +2 +8 +8 +7 +7 +12 +8 +8 +1 +1 0 -3 -2] · 76'-90' [-2 +1 +1 0 -3 -2 -2 +3 0 0 +1 +1 0 +1 -1] · 91'+ [-5 -4 -3 -2 -2 -1]
    ⚽ gols: 53'✗ 64'✓ 71'✗ 81'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **2** · 31'-45' **5** ‖ 46'-60' **3** · 61'-75' **5** · 76'-90' **4**
  - vs West Ham United (CASA · V 2-0) — min 1→85:
    📈 pressão (net/min): 1'-15' [0 0 0 -2 -2 -2 +1 +4 +6 +4 +3 +1 +1 +2 +2] · 16'-30' [+2 +1 0 +1 +1 +1 +1 +10 +8 +8 +6 +4 +6 +6 +4] · 31'-45' [+5 +5 +5 +10 +10 +10 +6 +6 +5 +4 +4 +4 +4 +4 +4] · ‖INTERVALO‖ · 46'-60' [+4 +4 +4 +4 +4 +4 +16 +16 +16 +16 +16 +16 +16 +16 +16] · 61'-75' [+16 +16 +16 +16 +16 +16 +8 +8 +8 +8 +8 +8 +8 +8 +7] · 76'-90' [+7 +7 +7 +7 +7 +7 +7 +7 +7 +1]
    ⚽ gols: 15'✓ 68'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **3** · 31'-45' **2** ‖ 46'-60' **1** · 61'-75' **5** · 76'-90' **1**
  - @ Nottingham Forest (FORA · E 1-1) — min 1→93:
    📈 pressão (net/min): 1'-15' [-1 -3 -2 0 +2 +4 +1 -4 -5 -4 -2 -3 -3 -2 -3] · 16'-30' [+1 +2 +1 0 +3 +4 +4 +4 +3 +2 +2 +2 +1 0 -3] · 31'-45' [-3 0 0 0 +2 +3 +2 -2 -16 -14 -7 -9 -8 -6 -7] · ‖INTERVALO‖ · 46'-60' [-7 -5 -5 -6 -2 0 0 -1 0 0 +3 +3 0 -24 -16] · 61'-75' [-11 -7 -9 -3 -2 -1 +4 -5 -4 -5 -5 -5 -4 -3 -5] · 76'-90' [-2 -8 -8 -3 -1 0 +1 +1 +3 +5 +9 +7 +6 +5 +4] · 91'+ [+3 +3 +1]
    ⚽ gols: 23'✓ 38'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **5** ‖ 46'-60' **4** · 61'-75' **3** · 76'-90' **3**
  - vs Sunderland (CASA · V 4-3) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 +3 +7 +2 -1 -4 -4 -3 -5 -7 -7 -5 -5 -5 -2] · 16'-30' [+2 +6 +6 +7 +4 +2 +2 +3 +3 +1 +3 +2 0 -3 -5] · 31'-45' [-3 -3 -5 -3 -1 +4 +7 +6 +3 +2 0 -1 -3 -1 +1] · ‖INTERVALO‖ · 46'-60' [+4 +7 +6 +4 +2 +1 0 -1 -2 -3 +3 +8 +6 +5 +3] · 61'-75' [+2 +3 +3 +4 +7 +3 +3 -1 -2 -2 -2 -2 -1 -2 -5] · 76'-90' [-4 -5 -3 -3 -3 -1 +3 +6 +4 +3 -3 -5 -5 -3 -3] · 91'+ [-3 -2 +2 +4 +4 +3 +3]
    ⚽ gols: 2'✓ 9'✗ 36'✓ 46'✓ 86'✗ 87'✗ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **2** · 31'-45' **2** ‖ 46'-60' **5** · 61'-75' **1** · 76'-90' **2**
  - @ Fulham (FORA · D 0-1) — min 1→94:
    📈 pressão (net/min): 1'-15' [0 -2 -6 -4 -2 0 -2 -1 +1 0 -2 0 -1 -1 -1] · 16'-30' [-1 0 0 0 -1 -2 -2 +2 +1 -1 -1 -5 -4 -3 -3] · 31'-45' [-1 -2 -2 -1 +1 +1 0 0 -1 -3 -3 -2 -9 -8 -4] · ‖INTERVALO‖ · 46'-60' [-1 0 +1 +1 -1 -3 -2 -1 0 +1 0 0 -1 +1 +1] · 61'-75' [+4 +4 +7 +7 +4 +3 +3 +2 +4 +6 +6 +11 +7 +6 +4] · 76'-90' [+3 +3 +2 +2 +3 +2 +2 +24 +20 +17 +13 +7 +5 +2 0] · 91'+ [-1 0 0 0]
    ⚽ gols: 43'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **3** · 31'-45' **0** ‖ 46'-60' **3** · 61'-75' **4** · 76'-90' **4**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.12 · 16-30: 0.18 · 31-45: 0.26 · 46-60: 0.24 · 61-75: 0.24 · 76-90: 0.35
- Sofre por faixa (/j): 0-15: 0.21 · 16-30: 0.09 · 31-45: 0.26 · 46-60: 0.24 · 61-75: 0.21 · 76-90: 0.24
- 1ºT: marca 19 / sofre 19 (totais na temporada)

### Desfalques de Aston Villa neste jogo
- **John McGinn** (Doubtful) — 4 gols + 3 assists até a data; season: **9% dos gols** do time (15% com assists); **últimos 5 jogos do time**: participou de 2/8 gols = **25%** (↑ mais decisivo AGORA); with/without: com ele 1.52 g/j (27j) vs sem ele 0.86 g/j (7j) = −43%; finaliza **0.33 SoT/jogo** (time: 4.41 SoT/j com ele vs 4.86 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.4 interceptações/j** (~7% do time) · 1 desarmes/j · 3.7 duelos ganhos/j · 0.7 cruz. certos/j · 0.6 dribles certos/j · 1.4 key passes/j
- **Boubacar Kamara** (Knee Injury) — 1 gols + 3 assists até a data; season: **2% dos gols** do time (9% com assists); **últimos 5 jogos do time**: participou de 0/8 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.78 g/j (18j) vs sem ele 0.94 g/j (16j) = −47%; finaliza **0.22 SoT/jogo** (time: 4.67 SoT/j com ele vs 4.31 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.1 interceptações/j** (~17% do time) · 2.1 desarmes/j · 6.4 duelos ganhos/j · 0 cruz. certos/j · 0.8 dribles certos/j · 0.8 key passes/j
- **A. Mvom Onana** (Calf Injury) — 2 gols + 0 assists até a data; season: **4% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 0/8 gols = **0%** (≈ estável); with/without: com ele 1.58 g/j (24j) vs sem ele 0.9 g/j (10j) = −43%; finaliza **0.29 SoT/jogo** (time: 4.96 SoT/j com ele vs 3.4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1 interceptações/j** (~16% do time) · 2 desarmes/j · 5 duelos ganhos/j · 0 cruz. certos/j · 0.3 dribles certos/j · 0.3 key passes/j
- **A. da Rocha dos Santos** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/8 gols = **0%** (≈ estável); with/without: com ele 0.67 g/j (3j) vs sem ele 1.45 g/j (31j) = +116%; finaliza **0 SoT/jogo** (time: 3.67 SoT/j com ele vs 4.58 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.3 interceptações/j** (~4% do time) · 0 desarmes/j · 1 duelos ganhos/j · 0 cruz. certos/j · 0.7 dribles certos/j · 0 key passes/j

## Tottenham Hotspur (visita) — até 2026-05-03

### Gols & finalização (season)
- Total **43 marcados / 53 sofridos** em 34j · média **1.26 marca / 1.56 sofre** por jogo
- **Fora (17j): marca 1.35 / sofre 1.35** (23 gols) · por tempo: 1ºT 0.5/0.85 · 2ºT 0.76/0.71
- **Finalização: 134 SoT (3.94/j · fora 3.82/j) · conv 32%** (aberta, −0 pên) · sofre 4.18 SoT/j (adv 36%) · 8.53 KP/j
- **Volume: 11.2 chutes/j (7.6 na área) · 1.8 big chances/j** · posse 49.9%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 46.2/47.6 · chutes pra fora 4.1/5.1 · bloqueados 3.2/3.4 · de fora da área 3.6/4
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 45.4/47.2 · chutes pra fora 4.4/4.8 · bloqueados 3/3.4 · de fora da área 4.4/4.2

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 6.76**
  - **Cristian Romero ** nota **7.03** (season) · forma 6.56↓ (últ.5) · 2× MOTM · 23j
  - **Pedro Porro** nota **6.98** (season) · forma 7.3↑ (últ.5) · 3× MOTM · 33j
  - **Xavi Simons ** nota **6.97** (season) · forma 6.98= (últ.5) · 2× MOTM · 31j
  - **Richarlison** nota **6.92** (season) · forma 6.85= (últ.5) · 4× MOTM · 31j
  - **João Palhinha** nota **6.91** (season) · forma 6.73↓ (últ.5) · 3× MOTM · 32j
  - **Pape Matar Sarr** nota **6.86** (season) · forma 6.89= (últ.5) · 23j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VEDDE** (5pts) · **4 feitos / 7 sofridos** · marca 0.8↓ / sofre 1.4= g/j · SoT 5 feito / 3.6 sofrido
- **Consistência: MARCOU em 27/34** (casa 14/17 · fora 13/17) · não-marcou 7 · clean sheet 8 · BTTS 20/34
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Liverpool** (fora · **E 1-1**) — adv 6º briga-top · você 16º briga-Z · seu fora até ali 1.5 marca/1.5 sofre
- vs **Nottingham Forest** (casa · **D 0-3**) — adv 17º briga-Z · você 16º briga-Z · seu casa até ali 1.2 marca/1.7 sofre
- @ **Sunderland** (fora · **D 0-1**) — adv 12º · você 18º briga-Z · seu fora até ali 1.5 marca/1.5 sofre
- vs **Brighton & Hove Albion** (casa · **E 2-2**) — adv 9º · você 18º briga-Z · seu casa até ali 1.1 marca/1.8 sofre
- @ **Wolverhampton Wanderers** (fora · **V 1-0**) — adv 20º REBAIX. · você 18º briga-Z · seu fora até ali 1.4 marca/1.4 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Liverpool (FORA · E 1-1) — min 1→94:
    📈 pressão (net/min): 1'-15' [-1 0 -2 -7 -7 -4 -3 -1 0 -1 +1 +5 +3 +1 +1] · 16'-30' [+1 -1 -1 -1 -1 0 0 -1 -1 -2 -2 -3 -2 -1 -3] · 31'-45' [-3 -6 -5 -5 -8 -6 -4 -4 -3 -2 -3 -3 -2 -7 +6] · ‖INTERVALO‖ · 46'-60' [+3 +1 0 0 +1 -1 -9 -6 -5 -5 +1 -2 -2 -2 -4] · 61'-75' [-3 -8 -8 -6 +1 +1 +2 +2 0 0 -3 -2 -2 +3 +3] · 76'-90' [+1 0 -3 -4 -2 -1 -2 -1 -3 -3 -5 -3 +2 +6 +6] · 91'+ [+3 +2 +1 -2]
    ⚽ gols: 18'✗ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **8** · 16'-30' **1** · 31'-45' **4** ‖ 46'-60' **6** · 61'-75' **9** · 76'-90' **3**
  - vs Nottingham Forest (CASA · D 0-3) — min 1→88:
    📈 pressão (net/min): 1'-15' [+1 -2 -2 -1 -1 -1 -1 -1 -1 -1 -1 -1 +2 +2 +2] · 16'-30' [+12 +12 +6 +6 +6 +6 +8 +5 +4 +3 +3 +3 +6 +6 +6] · 31'-45' [+6 +6 +5 +5 +5 +5 +5 +12 +9 +9 +9 +9 +9 +9 +9] · ‖INTERVALO‖ · 46'-60' [+9 +6 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8] · 61'-75' [+8 +8 +8 +8 +8 +8 +8 +8 +6 +6 +6 +6 +6 +6 +6] · 76'-90' [+6 +6 +6 +6 +6 +6 +6 +6 +6 +6 +6 +6 +11]
    ⚽ gols: 45'✗ 62'✗ 87'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **7** · 16'-30' **6** · 31'-45' **0** ‖ 46'-60' **2** · 61'-75' **4** · 76'-90' **6**
  - @ Sunderland (FORA · D 0-1) — min 1→101:
    📈 pressão (net/min): 1'-15' [0 +3 +2 -2 +1 -1 -1 -2 -3 -4 -2 -1 -1 -1 -1] · 16'-30' [-1 -1 -4 -7 -7 -6 -3 -3 -3 -2 +2 +4 +3 +2 +3] · 31'-45' [-1 -2 -3 -2 -1 -1 +2 +2 +2 +1 +1 0 0 0 +3] · ‖INTERVALO‖ · 46'-60' [+4 +4 +3 +4 +3 0 0 0 -5 -4 -3 -2 -4 0 0] · 61'-75' [-3 -2 -2 -1 -1 +1 +1 +1 +1 +3 +2 +1 +4 +3 +2] · 76'-90' [+5 +3 +4 +3 -1 -4 -4 -2 -2 0 0 0 -1 -1 -10] · 91'+ [-7 -4 -3 +3 +3 +3 +3 +8 +8 +5 +4]
    ⚽ gols: 61'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **0** · 31'-45' **5** ‖ 46'-60' **5** · 61'-75' **1** · 76'-90' **5**
  - vs Brighton & Hove Albion (CASA · E 2-2) — min 1→98:
    📈 pressão (net/min): 1'-15' [0 0 0 0 +1 +1 +1 0 0 0 +1 +1 0 0 +1] · 16'-30' [+1 0 0 0 0 0 +4 +2 +3 +2 +1 -1 -3 -2 -2] · 31'-45' [-5 -5 -7 -5 -5 -5 -7 -7 +1 +2 +4 +4 +10 +8 +6] · ‖INTERVALO‖ · 46'-60' [-5 -5 -4 -5 -6 -7 -2 -1 0 0 +5 +3 +2 -1 -4] · 61'-75' [-6 -4 -4 -4 -6 -6 -4 0 0 +5 +3 +1 0 0 0] · 76'-90' [-9 -4 -4 -3 +1 +4 +4 +3 +2 +2 -4 -3 -2 -4 -4] · 91'+ [-5 -3 -6 -5 -13 -13 -11 -4]
    ⚽ gols: 39'✓ 45'✗ 77'✓ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **5** · 16'-30' **5** · 31'-45' **2** ‖ 46'-60' **5** · 61'-75' **6** · 76'-90' **2**
  - @ Wolverhampton Wanderers (FORA · V 1-0) — min 1→98:
    📈 pressão (net/min): 1'-15' [0 +1 +3 +4 +4 +5 +7 +7 +5 +4 +3 +3 +4 +3 +4] · 16'-30' [+4 +5 +4 +3 +2 +1 +1 +2 +6 +4 +6 +6 +6 -2 -2] · 31'-45' [-1 +1 +2 +3 +3 +7 +7 +6 +5 +5 +5 +1 -1 -1 -1] · ‖INTERVALO‖ · 46'-60' [-6 -4 +2 -3 0 -6 -4 -3 -1 -3 -4 -2 -2 -2 -2] · 61'-75' [-2 -3 -3 -2 -2 0 -1 +1 +1 +1 +7 +4 +4 +2 +2] · 76'-90' [0 0 -2 -1 -6 -6 -4 +3 +3 +2 +2 +8 +9 +9 +9] · 91'+ [+2 +2 +1 +3 +4 +3 +2 +2]
    ⚽ gols: 82'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **5** · 16'-30' **6** · 31'-45' **7** ‖ 46'-60' **6** · 61'-75' **5** · 76'-90' **14**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.09 · 16-30: 0.12 · 31-45: 0.29 · 46-60: 0.21 · 61-75: 0.18 · 76-90: 0.38
- Sofre por faixa (/j): 0-15: 0.21 · 16-30: 0.09 · 31-45: 0.56 · 46-60: 0.15 · 61-75: 0.18 · 76-90: 0.38
- 1ºT: marca 17 / sofre 29 (totais na temporada)

### Desfalques de Tottenham Hotspur neste jogo
- **Xavi Simons** (Unknown Injury) — 2 gols + 5 assists até a data; season: **5% dos gols** do time (16% com assists); **últimos 5 jogos do time**: participou de 2/4 gols = **50%** (↑ mais decisivo AGORA); with/without: com ele 1.29 g/j (28j) vs sem ele 1.17 g/j (6j) = −9%; finaliza **0.36 SoT/jogo** (time: 3.93 SoT/j com ele vs 4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.5 interceptações/j** (~6% do time) · 1.2 desarmes/j · 4.2 duelos ganhos/j · 0.5 cruz. certos/j · 1 dribles certos/j · 1.3 key passes/j
- **Mohammed Kudus** (Muscle Injury) — 2 gols + 5 assists até a data; season: **5% dos gols** do time (16% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.37 g/j (19j) vs sem ele 1.13 g/j (15j) = −18%; finaliza **0.47 SoT/jogo** (time: 3.37 SoT/j com ele vs 4.67 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.2 interceptações/j** (~3% do time) · 1.5 desarmes/j · 5.6 duelos ganhos/j · 1.5 cruz. certos/j · 2.7 dribles certos/j · 1.4 key passes/j
- **Cristian Romero** (Knee Injury) — 4 gols + 1 assists até a data; season: **9% dos gols** do time (12% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.26 g/j (23j) vs sem ele 1.27 g/j (11j) = +1%; finaliza **0.26 SoT/jogo** (time: 4.04 SoT/j com ele vs 3.73 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.3 interceptações/j** (~18% do time) · 2.5 desarmes/j · 6.7 duelos ganhos/j · 0 cruz. certos/j · 0.3 dribles certos/j · 0.6 key passes/j
- **D. Solanke** (Muscle Injury) — 3 gols + 0 assists até a data; season: **7% dos gols** do time (7% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.2 g/j (15j) vs sem ele 1.32 g/j (19j) = +10%; finaliza **0.73 SoT/jogo** (time: 4.87 SoT/j com ele vs 3.21 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.3 interceptações/j** (~3% do time) · 1.5 desarmes/j · 4.3 duelos ganhos/j · 0 cruz. certos/j · 0.9 dribles certos/j · 0.4 key passes/j
- **Wilson Odobert** (Cruciate Ligament Tear) — 0 gols + 2 assists até a data; season: **0% dos gols** do time (5% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 1.38 g/j (24j) vs sem ele 1 g/j (10j) = −28%; finaliza **0.33 SoT/jogo** (time: 3.92 SoT/j com ele vs 4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.1 interceptações/j** (~1% do time) · 0.5 desarmes/j · 2 duelos ganhos/j · 0.3 cruz. certos/j · 1 dribles certos/j · 0.8 key passes/j
- **Ben Davies** (Ankle Injury) — 1 gols + 0 assists até a data; season: **2% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0.67 g/j (3j) vs sem ele 1.32 g/j (31j) = +97%; finaliza **0.67 SoT/jogo** (time: 4 SoT/j com ele vs 3.94 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.3 interceptações/j** (~3% do time) · 1.7 desarmes/j · 3 duelos ganhos/j · 0.7 cruz. certos/j · 0 dribles certos/j · 0.3 key passes/j
- **D. Kulusevski** (Knee Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.26 g/j (34j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Guglielmo Vicario** (Groin Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 1.29 g/j (31j) vs sem ele 1 g/j (3j) = −22%; finaliza **0 SoT/jogo** (time: 3.84 SoT/j com ele vs 5 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0 desarmes/j · 0.5 duelos ganhos/j · 0 cruz. certos/j · 0 dribles certos/j · 0 key passes/j

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Aston Villa atacando × Tottenham Hotspur defendendo**
| Faixa | Aston Villa marca/j | Tottenham Hotspur sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.12 | 0.21 | 0.33 |
| 16-30 | 0.18 | 0.09 | 0.27 |
| 31-45 | 0.26 | 0.56 | 0.82 |
| 46-60 | 0.24 | 0.15 | 0.39 |
| 61-75 | 0.24 | 0.18 | 0.42 |
| 76-90 | 0.35 | 0.38 | 0.73 |

**Tottenham Hotspur atacando × Aston Villa defendendo**
| Faixa | Tottenham Hotspur marca/j | Aston Villa sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.09 | 0.21 | 0.3 |
| 16-30 | 0.12 | 0.09 | 0.21 |
| 31-45 | 0.29 | 0.26 | 0.55 |
| 46-60 | 0.21 | 0.24 | 0.45 |
| 61-75 | 0.18 | 0.21 | 0.39 |
| 76-90 | 0.38 | 0.24 | 0.62 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Aston Villa (casa) = 1.42 · λ Tottenham Hotspur (fora) = 1.17 · total = 2.59

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Aston Villa: λ_SoT 4.68 × conv 31% → **1.45 gols**
- Tottenham Hotspur: λ_SoT 4.24 × conv 32% → **1.36 gols**
- total via SoT = 2.81
- **Índice de volume do jogo**: λ_SoT total 8.9 vs média da liga 8.4 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 43/26/31% | 39/25/35% |
| Over 1.5 | 73% | 77% |
| Over 2.5 | 48% | 53% |
| Over 3.5 | 26% | 31% |
| BTTS | 52% | 57% |

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **30/43/27%** · 2ºT **34/34/32%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Aston Villa) e `away` (= Tottenham Hotspur), cada um com:
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
