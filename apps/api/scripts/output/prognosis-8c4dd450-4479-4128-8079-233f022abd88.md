# Prognóstico de expected goals — AFC Bournemouth x Manchester City

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
- Data: 2026-05-19 18:30 · Rodada 37 · Liga PL
- Local: Vitality Stadium, Bournemouth (grass)
- Clima: moderate rain · 15.2°C (sens. 14.7°C) · vento 10.9 m/s · umidade 75% · nuvens 81% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: AFC Bournemouth 10 dias (último: liga, 2026-05-09) · Manchester City 3 dias (último: FA Cup Final, 2026-05-16)
- Viagem do visitante: ~307 km
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, 368 jogos): mandante 1.533 gols/jogo · visitante 1.228 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-19)
- AFC Bournemouth: 6º, 55 pts · Manchester City: 2º, 77 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - AFC Bournemouth: 6º, 55 pts, 2 jogo(s) restante(s) (máx possível 61 pts)
  - já SEGURO do rebaixamento.
  - Champions ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga de Champions
  - disputa pela vaga (6º): pro AFC Bournemouth **um empate basta** (vai a 57, fora do alcance) — só perde a vaga se PERDER. Quem ainda ameaça → Brighton & Hove Albion (7º, 53 pts, máx 56) pode **passar em pontos** — vencendo, se o AFC Bournemouth tropeçar; Brentford (8º, 52 pts, máx 55) empata em pontos mas está **-1 de saldo** (+3 vs +4) — só passa se o AFC Bournemouth perder por muito E ele vencer por muito (virar 1); Chelsea (10º, 49 pts, máx 55) empata em pontos mas está **+2 de saldo** (+6 vs +4) — só passa se o AFC Bournemouth perder por muito E ele vencer por muito (virar -2)
  - Manchester City: 2º, 77 pts, 2 jogo(s) restante(s) (máx possível 83 pts)
  - já SEGURO do rebaixamento.
  - ainda pode ser CAMPEÃO — precisa vencer.
  - vaga de Champions já garantida.
  - → motivação: **alta** — PRECISA LUTAR — briga pelo título
  - disputa pela vaga (2º): ninguém abaixo alcança 77 pts → já travado.

⚠️ **VEREDITO DE INTENÇÃO: ASSIMÉTRICA / JOGO TENDE A TRAVAR** — pelo menos um lado NÃO precisa ir pra cima (já garantido, rebaixado, sem alvo, ou **um empate basta** → ADMINISTRA). O lado que precisa pode NÃO furar o ferrolho, e quem administra segura o jogo. **NÃO** favoreça over / goleada / handicap de mando por inércia estatística — prefira UNDER ou mercado de MENOR variância (team_total over 0.5 do lado que precisa, dupla chance), OU rebaixe a confiança. Foi exatamente neste tipo de jogo que a leitura puramente estatística mais errou no histórico.

## AFC Bournemouth (manda) — até 2026-05-19

### Gols & finalização (season)
- Total **56 marcados / 52 sofridos** em 36j · média **1.56 marca / 1.44 sofre** por jogo
- **Em casa (18j): marca 1.56 / sofre 1.06** (28 gols) · por tempo: 1ºT 0.69/0.61 · 2ºT 0.86/0.83
- **Finalização: 175 SoT (4.86/j · casa 4.72/j) · conv 29%** (aberta, −5 pên) · sofre 4.28 SoT/j (adv 30%) · 9.75 KP/j
- **Volume: 13.8 chutes/j (8.3 na área) · 2.5 big chances/j** · posse 50.2%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 49.8/52.1 · chutes pra fora 5.1/4.1 · bloqueados 4/4.1 · de fora da área 5.5/3.7
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 46.2/52.6 · chutes pra fora 4.4/4.8 · bloqueados 3.6/4.4 · de fora da área 4.8/2

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VVEVV** (13pts) · **10 feitos / 4 sofridos** · marca 2↑ / sofre 0.8↓ g/j · SoT 4.6 feito / 2.4 sofrido
- **Consistência: MARCOU em 29/36** (casa 14/18 · fora 15/18) · não-marcou 7 · clean sheet 11 · BTTS 23/36
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Arsenal** (fora · **V 2-1**) — adv 1º Eur-gar · você 13º · seu fora até ali 1.5 marca/2.1 sofre
- @ **Newcastle United** (fora · **V 2-1**) — adv 14º · você 11º · seu fora até ali 1.6 marca/2 sofre
- vs **Leeds United** (casa · **E 2-2**) — adv 15º briga-Z · você 9º salvo · seu casa até ali 1.4 marca/1.1 sofre
- vs **Crystal Palace** (casa · **V 3-0**) — adv 14º · você 8º salvo · seu casa até ali 1.5 marca/1.1 sofre
- @ **Fulham** (fora · **V 1-0**) — adv 11º salvo · você 6º briga-top · seu fora até ali 1.6 marca/1.9 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Arsenal (FORA · V 2-1) — min 1→95:
    📈 pressão (net/min): 1'-15' [0 -1 0 -1 -2 -2 0 0 0 +4 +2 -1 -3 -4 -5] · 16'-30' [-4 -4 +2 +1 -3 -3 -5 -4 -4 -2 -3 +3 +3 +3 +2] · 31'-45' [+1 +3 +2 0 -6 -6 -4 -3 -3 -1 +3 +2 +6 +5 -1] · ‖INTERVALO‖ · 46'-60' [0 0 +1 +3 +4 +2 0 -2 -2 -17 -13 -10 -7 -5 -5] · 61'-75' [-4 -4 -1 -1 0 +2 +4 +3 0 -5 -8 -3 -3 +2 +3] · 76'-90' [0 -1 -1 -7 -7 -1 -2 -1 -3 -3 -6 -9 -6 -6 -4] · 91'+ [-3 -5 -5 -5 -5]
    ⚽ gols: 17'✓ 35'✗ 74'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **5** ‖ 46'-60' **2** · 61'-75' **6** · 76'-90' **8**
  - @ Newcastle United (FORA · V 2-1) — min 1→99:
    📈 pressão (net/min): 1'-15' [0 -1 -1 +2 +3 +3 +2 +2 +3 -2 -1 +1 -1 -1 -1] · 16'-30' [-3 0 -3 -2 +2 +2 +2 +1 +2 +6 +3 +3 +3 +3 0] · 31'-45' [0 +3 +3 +4 +4 +4 +3 +3 -1 0 +1 +2 -3 -4 -9] · ‖INTERVALO‖ · 46'-60' [-8 -6 -4 -1 -2 -4 -3 -2 -5 -4 -3 -3 -3 +2 +2] · 61'-75' [-5 -6 -5 -5 -4 -3 -3 -2 -2 -1 -1 -5 -2 -2 -1] · 76'-90' [-2 -2 -2 -2 -9 -5 -2 -2 -28 -18 -7 -7 -5 -5 -4] · 91'+ [-1 -4 -3 -11 -7 -5 -3 -3 -4]
    ⚽ gols: 32'✓ 68'✗ 85'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **6** · 16'-30' **5** · 31'-45' **4** ‖ 46'-60' **1** · 61'-75' **4** · 76'-90' **10**
  - vs Leeds United (CASA · E 2-2) — min 1→98:
    📈 pressão (net/min): 1'-15' [-1 -3 -1 -1 +3 +1 +2 +3 +1 +3 +2 +3 0 -1 +2] · 16'-30' [+2 +1 -2 -2 -2 +1 +2 +3 +3 +3 -2 0 +2 -1 -1] · 31'-45' [+1 +5 +6 +6 +7 +9 +5 +5 +2 +2 0 -1 +7 +7 +4] · ‖INTERVALO‖ · 46'-60' [-1 0 0 0 -1 0 +2 +1 +4 +7 +12 +12 +7 +9 +6] · 61'-75' [+9 +6 +1 +1 +2 -1 -1 -3 -6 -7 -7 -5 -6 -3 +3] · 76'-90' [+3 +7 +9 +4 +6 +7 +3 +2 +1 +2 +6 +7 +3 +5 +5] · 91'+ [+8 +33 +21 +14 +9 +6 +2 +2]
    ⚽ gols: 60'✓ 68'✗ 85'✓ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **6** · 31'-45' **6** ‖ 46'-60' **2** · 61'-75' **2** · 76'-90' **4**
  - vs Crystal Palace (CASA · V 3-0) — min 1→95:
    📈 pressão (net/min): 1'-15' [0 +5 +5 +3 +2 +1 +4 +6 +5 +7 +5 +4 +4 +7 +5] · 16'-30' [+4 +2 +3 +2 +4 +2 +3 +2 +4 +4 +4 +4 +5 +6 +6] · 31'-45' [+6 +9 +9 +6 +5 +4 +2 -1 0 0 +2 +4 +3 +4 -1] · ‖INTERVALO‖ · 46'-60' [-2 -6 -1 -1 -1 0 -3 -2 -2 -6 -4 -1 -2 0 +1] · 61'-75' [+1 0 -1 -1 -2 -1 -2 -2 -1 0 +1 +1 +1 -1 0] · 76'-90' [+1 0 +3 +5 +4 +3 +3 -3 -2 -1 -1 0 0 -2 -3] · 91'+ [-6 -4 -2 -1 0]
    ⚽ gols: 10'✓ 32'✓ 77'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **3** · 31'-45' **5** ‖ 46'-60' **8** · 61'-75' **2** · 76'-90' **5**
  - @ Fulham (FORA · V 1-0) — min 1→95:
    📈 pressão (net/min): 1'-15' [+1 +1 +1 0 0 -1 -1 -1 -5 -2 -1 0 -1 -2 0] · 16'-30' [-3 -3 -3 -3 -2 -1 0 0 0 +1 +1 +2 0 -3 -3] · 31'-45' [-5 -4 +1 0 0 +2 +2 +1 -5 -5 -5 -5 -5 -6 -6] · ‖INTERVALO‖ · 46'-60' [-6 -5 -6 -5 -3 -3 -2 -2 +1 +1 0 0 +5 +7 +7] · 61'-75' [+4 +4 +4 0 0 -18 -14 -14 -13 -11 -11 -11 -10 -10 -13] · 76'-90' [-12 -8 -8 -8 -2 -1 -1 -1 +1 +2 +2 +1 -1 -2 -2] · 91'+ [-2 -1 +1 +1 -2]
    ⚽ gols: 53'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **3** · 31'-45' **0** ‖ 46'-60' **1** · 61'-75' **2** · 76'-90' **7**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.22 · 16-30: 0.22 · 31-45: 0.25 · 46-60: 0.14 · 61-75: 0.28 · 76-90: 0.44
- Sofre por faixa (/j): 0-15: 0.14 · 16-30: 0.19 · 31-45: 0.28 · 46-60: 0.19 · 61-75: 0.25 · 76-90: 0.39
- 1ºT: marca 25 / sofre 22 (totais na temporada)

### Desfalques de AFC Bournemouth neste jogo
- **Ryan Christie** (Red Card Suspension) — 2 gols + 0 assists até a data; season: **4% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 1.46 g/j (26j) vs sem ele 1.8 g/j (10j) = +23%; finaliza **0.31 SoT/jogo** (time: 4.65 SoT/j com ele vs 5.4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.5 interceptações/j** (~5% do time) · 1.1 desarmes/j · 3.1 duelos ganhos/j · 0.1 cruz. certos/j · 0.8 dribles certos/j · 0.4 key passes/j
- **Álex Jiménez** (Unknown Injury) — 1 gols + 0 assists até a data; season: **2% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 1.58 g/j (31j) vs sem ele 1.4 g/j (5j) = −11%; finaliza **0.16 SoT/jogo** (time: 4.87 SoT/j com ele vs 4.8 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.9 interceptações/j** (~9% do time) · 2.3 desarmes/j · 4.5 duelos ganhos/j · 0.4 cruz. certos/j · 1.3 dribles certos/j · 0.5 key passes/j
- **Julio Soler** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 1 g/j (3j) vs sem ele 1.61 g/j (33j) = +61%; finaliza **0 SoT/jogo** (time: 6 SoT/j com ele vs 4.76 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0.3 desarmes/j · 1 duelos ganhos/j · 0 cruz. certos/j · 0 dribles certos/j · 0 key passes/j
- **M. Akinmboni** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.56 g/j (36j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Manchester City (visita) — até 2026-05-19

### Gols & finalização (season)
- Total **75 marcados / 32 sofridos** em 36j · média **2.08 marca / 0.89 sofre** por jogo
- **Fora (18j): marca 1.72 / sofre 1.11** (31 gols) · por tempo: 1ºT 1.11/0.25 · 2ºT 0.97/0.64
- **Finalização: 199 SoT (5.53/j · fora 4.78/j) · conv 36%** (aberta, −3 pên) · sofre 3.36 SoT/j (adv 26%) · 12.42 KP/j
- **Volume: 15.7 chutes/j (11.3 na área) · 3.3 big chances/j** · posse 60.9%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 64.2/36 · chutes pra fora 5.7/3.5 · bloqueados 4.5/2.8 · de fora da área 4.3/2.7
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 86.4/26.8 · chutes pra fora 7.4/2.4 · bloqueados 7/3.2 · de fora da área 6.8/2

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VVEVV** (13pts) · **12 feitos / 4 sofridos** · marca 2.4↑ / sofre 0.8= g/j · SoT 6.4 feito / 2.8 sofrido
- **Consistência: MARCOU em 32/36** (casa 17/18 · fora 15/18) · não-marcou 4 · clean sheet 16 · BTTS 17/36
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- vs **Southampton** (casa · **V 2-1**) — 🏆 FA Cup
- @ **Everton** (fora · **E 3-3**) — adv 11º · você 2º Eur-gar · seu fora até ali 1.6 marca/1 sofre
- vs **Brentford** (casa · **V 3-0**) — adv 7º briga-top · você 2º Eur-gar · seu casa até ali 2.4 marca/0.8 sofre
- vs **Crystal Palace** (casa · **V 3-0**) — adv 15º briga-Z · você 2º Eur-gar · seu casa até ali 2.4 marca/0.7 sofre
- @ **Chelsea** (fora · **V 1-0**) — 🏆 FA Cup

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Arsenal (CASA · V 2-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 0 +3 +7 +5 +2 -2 -2 -2 -2 -4 -6 -5 -4 -4] · 16'-30' [+2 +3 0 +1 -1 -2 -1 -2 0 +2 +3 +4 +2 0 0] · 31'-45' [+1 +5 +7 +7 +8 +6 +5 +7 +2 -1 -2 0 +4 +2 0] · ‖INTERVALO‖ · 46'-60' [0 0 0 +3 +7 +8 +11 +7 +8 +9 +6 +8 +8 +5 -1] · 61'-75' [-10 -5 -1 -1 +1 +3 +3 +4 +5 +7 +7 +4 +4 -2 -2] · 76'-90' [+2 +2 +2 +3 +4 +4 +3 +2 +1 +1 +3 +2 +1 -2 -1] · 91'+ [-2 -2 -5 -7 -9 -5 -5]
    ⚽ gols: 16'✓ 18'✗ 65'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **0** · 31'-45' **3** ‖ 46'-60' **6** · 61'-75' **2** · 76'-90' **3**
  - @ Burnley (FORA · V 1-0) — min 1→92:
    📈 pressão (net/min): 1'-15' [0 0 +1 0 +1 +8 +3 +1 +8 +5 +3 +1 +1 -1 -2] · 16'-30' [0 -3 -3 +1 +3 +3 +4 +3 +5 +5 +12 +8 +10 +8 +7] · 31'-45' [+4 +4 +3 +3 +7 +6 +2 +2 +4 +6 +6 +6 +7 +7 -1] · ‖INTERVALO‖ · 46'-60' [-2 0 0 +4 +3 +1 +3 +2 +3 +3 +3 +7 +8 +6 +4] · 61'-75' [+1 +5 +5 +4 +1 +2 +2 +2 +6 +7 +7 +9 +9 +7 +7] · 76'-90' [+4 +3 +7 +7 +11 +7 +7 +11 +7 +7 +8 +8 +6 +6 +10] · 91'+ [+10 +17]
    ⚽ gols: 5'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **0** · 31'-45' **5** ‖ 46'-60' **4** · 61'-75' **4** · 76'-90' **8**
  - @ Everton (FORA · E 3-3) — min 1→96:
    📈 pressão (net/min): 1'-15' [0 +1 0 +2 +2 0 +6 +6 +6 +6 +13 +10 +11 +8 +5] · 16'-30' [+8 +8 +12 +13 +16 +13 +10 +8 +5 +4 +1 -3 0 0 0] · 31'-45' [-1 -5 -5 -1 0 0 +2 +3 +3 +3 +9 +6 +6 +6 +2] · ‖INTERVALO‖ · 46'-60' [+9 +5 +3 +4 +4 +4 +3 +2 +1 0 0 0 +2 +2 +3] · 61'-75' [0 0 0 -1 -6 -2 0 -3 -6 -3 +4 +2 -3 -3 0] · 76'-90' [+2 +3 +3 +1 +19 +14 +4 +4 +8 +4 +3 +6 +5 +4 +4] · 91'+ [+6 +5 +3 +4 +5 +6]
    ⚽ gols: 43'✓ 68'✗ 73'✗ 81'✗ 83'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **3** · 31'-45' **3** ‖ 46'-60' **3** · 61'-75' **2** · 76'-90' **5**
  - vs Brentford (CASA · V 3-0) — min 1→96:
    📈 pressão (net/min): 1'-15' [-1 -1 +1 +7 +7 +3 +1 +1 +2 +2 +1 +1 -1 -3 -2] · 16'-30' [-5 -3 +2 +3 +5 +6 +3 0 +1 +6 +5 +11 +10 +15 +17] · 31'-45' [+15 +10 +7 +7 +8 +9 +6 +6 +4 +5 +8 +6 +5 +4 +6] · ‖INTERVALO‖ · 46'-60' [+8 +8 +6 +8 +5 +4 -1 0 0 +1 -6 -5 -5 +1 +1] · 61'-75' [+3 +2 -1 +1 +4 +5 +7 +12 +8 +6 +4 +1 0 +4 +4] · 76'-90' [+4 +4 +7 +5 +4 +4 +6 +10 +7 +5 +6 +5 +3 +3 +3] · 91'+ [+3 +1 +4 +1 -3 -5]
    ⚽ gols: 60'✓ 75'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **6** · 16'-30' **1** · 31'-45' **2** ‖ 46'-60' **4** · 61'-75' **2** · 76'-90' **4**
  - vs Crystal Palace (CASA · V 3-0) — min 1→96:
    📈 pressão (net/min): 1'-15' [-1 0 +1 +1 +3 +2 +5 +7 +9 +9 +9 +5 +1 +8 +7] · 16'-30' [+7 +7 +5 +7 +6 +6 +5 +3 +2 +5 +8 +7 +5 +5 +6] · 31'-45' [+6 +9 +6 +1 +2 +2 +5 +8 +8 +8 +8 +8 +9 +10 +8] · ‖INTERVALO‖ · 46'-60' [+10 +10 +7 +5 +5 +5 +4 +3 0 0 +2 +2 +4 +5 +5] · 61'-75' [+7 +4 +3 +2 +2 +1 +1 +1 +1 +1 +1 +1 +1 +2 +3] · 76'-90' [+3 +4 +3 +3 +3 +2 +2 +2 +3 +5 +5 +9 +5 +5 +6] · 91'+ [+4 +3 +3 +7 +7 +6]
    ⚽ gols: 32'✓ 40'✓ 84'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **6** · 31'-45' **3** ‖ 46'-60' **3** · 61'-75' **1** · 76'-90' **3**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.25 · 16-30: 0.25 · 31-45: 0.61 · 46-60: 0.25 · 61-75: 0.39 · 76-90: 0.33
- Sofre por faixa (/j): 0-15: 0 · 16-30: 0.11 · 31-45: 0.14 · 46-60: 0.17 · 61-75: 0.28 · 76-90: 0.19
- 1ºT: marca 40 / sofre 9 (totais na temporada)

### Desfalques de Manchester City neste jogo
Sem desfalques registrados.

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**AFC Bournemouth atacando × Manchester City defendendo**
| Faixa | AFC Bournemouth marca/j | Manchester City sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.22 | 0 | 0.22 |
| 16-30 | 0.22 | 0.11 | 0.33 |
| 31-45 | 0.25 | 0.14 | 0.39 |
| 46-60 | 0.14 | 0.17 | 0.31 |
| 61-75 | 0.28 | 0.28 | 0.56 |
| 76-90 | 0.44 | 0.19 | 0.63 |

**Manchester City atacando × AFC Bournemouth defendendo**
| Faixa | Manchester City marca/j | AFC Bournemouth sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.25 | 0.14 | 0.39 |
| 16-30 | 0.25 | 0.19 | 0.44 |
| 31-45 | 0.61 | 0.28 | 0.89 |
| 46-60 | 0.25 | 0.19 | 0.44 |
| 61-75 | 0.39 | 0.25 | 0.64 |
| 76-90 | 0.33 | 0.39 | 0.72 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ AFC Bournemouth (casa) = 1.13 · λ Manchester City (fora) = 1.48 · total = 2.61

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- AFC Bournemouth: λ_SoT 3.92 × conv 29% → **1.14 gols**
- Manchester City: λ_SoT 3.65 × conv 36% → **1.31 gols**
- total via SoT = 2.45
- **Índice de volume do jogo**: λ_SoT total 7.6 vs média da liga 8.5 SoT → **ABAIXO** (jogo travado → pressão de UNDER)
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 29/26/45% | 32/27/40% |
| Over 1.5 | 73% | 70% |
| Over 2.5 | 48% | 44% |
| Over 3.5 | 27% | 23% |
| BTTS | 52% | 50% |

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **23/42/35%** · 2ºT **30/41/29%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= AFC Bournemouth) e `away` (= Manchester City), cada um com:
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
