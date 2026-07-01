# Prognóstico de expected goals — Leeds United x Burnley

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
- Data: 2026-05-01 19:00 · Rodada 35 · Liga PL
- Local: Elland Road, Leeds (grass)
- Clima: light rain · 19.5°C (sens. 18.5°C) · vento 3.5 m/s · umidade 36% · nuvens 33% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: Leeds United 5 dias (último: FA Cup Semi-finals, 2026-04-26) · Burnley 9 dias (último: liga, 2026-04-22)
- Viagem do visitante: ~43 km
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, 339 jogos): mandante 1.499 gols/jogo · visitante 1.236 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.26 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-01)
- Leeds United: 15º, 40 pts · Burnley: 19º, 20 pts
- Linhas: segurança (sair do Z) 36 pts (17º) · Champions 58 pts (5º) · última vaga europeia 48 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Leeds United: 15º, 40 pts, 4 jogo(s) restante(s) (máx possível 52 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - vaga europeia ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - Burnley: 19º, 20 pts, 4 jogo(s) restante(s) (máx possível 32 pts)
  - já REBAIXADO matematicamente — sem objetivo de tabela.
  - → motivação: **baixa** — NÃO precisa lutar — já rebaixado

⚠️ **VEREDITO DE INTENÇÃO: ASSIMÉTRICA / JOGO TENDE A TRAVAR** — pelo menos um lado NÃO precisa ir pra cima (já garantido, rebaixado, sem alvo, ou **um empate basta** → ADMINISTRA). O lado que precisa pode NÃO furar o ferrolho, e quem administra segura o jogo. **NÃO** favoreça over / goleada / handicap de mando por inércia estatística — prefira UNDER ou mercado de MENOR variância (team_total over 0.5 do lado que precisa, dupla chance), OU rebaixe a confiança. Foi exatamente neste tipo de jogo que a leitura puramente estatística mais errou no histórico.

## Leeds United (manda) — até 2026-05-01

### Gols & finalização (season)
- Total **44 marcados / 51 sofridos** em 34j · média **1.29 marca / 1.5 sofre** por jogo
- **Em casa (17j): marca 1.47 / sofre 1.18** (25 gols) · por tempo: 1ºT 0.68/0.47 · 2ºT 0.62/1.03
- **Finalização: 137 SoT (4.03/j · casa 4.47/j) · conv 28%** (aberta, −5 pên) · sofre 4.21 SoT/j (adv 31%) · 8.71 KP/j
- **Volume: 12.6 chutes/j (8.7 na área) · 2.5 big chances/j** · posse 45.7%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 44.5/51.1 · chutes pra fora 5/4.5 · bloqueados 3.6/3.6 · de fora da área 3.9/4.1
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 50.2/54 · chutes pra fora 4.6/4 · bloqueados 4.2/4.4 · de fora da área 3.4/3.4

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 6.82**
  - **Anton Stach** nota **7.2** (season) · forma 7.02↓ (últ.5) · 4× MOTM · 30j
  - **Sean Longstaff** nota **7.02** (season) · forma 7= (últ.5) · 1× MOTM · 22j
  - **Ethan Ampadu** nota **6.99** (season) · forma 6.97= (últ.5) · 1× MOTM · 36j
  - **Jaka Bijol** nota **6.98** (season) · forma 6.97= (últ.5) · 2× MOTM · 27j
  - **Pascal Struijk** nota **6.91** (season) · forma 7.04= (últ.5) · 34j
  - **James Justin** nota **6.89** (season) · forma 7.1↑ (últ.5) · 27j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: EVVEE** (9pts) · **7 feitos / 3 sofridos** · marca 1.4= / sofre 0.6↓ g/j · SoT 4.4 feito / 4 sofrido
- **Consistência: MARCOU em 23/34** (casa 12/17 · fora 11/17) · não-marcou 11 · clean sheet 7 · BTTS 20/34
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **West Ham United** (fora · **E 2-2**) — 🏆 FA Cup
- @ **Manchester United** (fora · **V 2-1**) — adv 3º briga-top · você 15º briga-Z · seu fora até ali 1 marca/1.9 sofre
- vs **Wolverhampton Wanderers** (casa · **V 3-0**) — adv 20º briga-Z · você 15º briga-Z · seu casa até ali 1.4 marca/1.3 sofre
- @ **AFC Bournemouth** (fora · **E 2-2**) — adv 9º salvo · você 15º briga-Z · seu fora até ali 1.1 marca/1.8 sofre
- @ **Chelsea** (fora · **D 0-1**) — 🏆 FA Cup

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Crystal Palace (FORA · E 0-0) — min 1→94:
    📈 pressão (net/min): 1'-15' [+2 -1 0 -2 -2 -2 -3 -3 -1 -1 -1 0 0 0 +1] · 16'-30' [+1 0 +1 +8 +7 +6 +4 +2 +2 +1 +2 +4 +2 +1 0] · 31'-45' [0 0 0 0 -1 -6 -4 -2 -1 +1 +1 +1 +10 +8 +8] · ‖INTERVALO‖ · 46'-60' [+2 +1 +1 0 0 0 +1 0 +1 0 +1 +1 +1 +1 +1] · 61'-75' [0 0 0 0 +1 0 0 -1 -1 -1 -2 -10 -6 -4 -4] · 76'-90' [-3 -4 -5 -5 -3 -4 -4 -3 -7 -7 -5 -5 -5 -1 +2] · 91'+ [+1 0 +1 +1]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **3** · 31'-45' **4** ‖ 46'-60' **6** · 61'-75' **3** · 76'-90' **3**
  - vs Brentford (CASA · E 0-0) — min 1→94:
    📈 pressão (net/min): 1'-15' [-1 -2 -4 -3 -3 -2 -6 -4 -3 -2 -2 0 0 +6 +5] · 16'-30' [+2 -1 0 +1 0 +3 +2 +1 0 +3 +2 0 +1 +1 +4] · 31'-45' [+1 0 0 +2 +2 +1 +3 +2 -1 +1 +3 +4 +3 0 -3] · ‖INTERVALO‖ · 46'-60' [-2 -2 -1 -1 +2 +1 +1 +1 +4 +2 +5 +3 +2 +1 +1] · 61'-75' [+3 +2 -3 -2 -1 +1 +1 +3 +3 +3 +3 +2 +2 +3 +6] · 76'-90' [+6 +6 +4 +1 0 0 0 0 +1 +2 +4 +4 +6 +7 +7] · 91'+ [+5 +7 +5 +13]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **3** · 31'-45' **8** ‖ 46'-60' **5** · 61'-75' **5** · 76'-90' **2**
  - @ Manchester United (FORA · V 2-1) — min 1→96:
    📈 pressão (net/min): 1'-15' [-1 +1 +4 +5 +7 +5 +4 +4 +3 +3 0 -4 -4 -3 -2] · 16'-30' [-4 -3 -5 -3 -2 -1 +2 +5 +6 +2 +2 0 +3 +6 +7] · 31'-45' [+4 +2 +3 +3 0 -4 -4 -6 -3 -4 -4 -1 -2 -2 +1] · ‖INTERVALO‖ · 46'-60' [+2 +4 -3 -1 -4 -8 -6 -5 -4 -4 -4 -2 -2 0 +2] · 61'-75' [+3 +4 +3 +2 -2 -4 -3 -3 -9 -4 -6 +8 +8 +8 +11] · 76'-90' [+11 -3 +3 +2 +4 +4 +3 +1 -1 +1 -7 -1 +1 +2 +1] · 91'+ [0 -2 -1 -2 -3 -2]
    ⚽ gols: 5'✓ 29'✓ 69'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **7** · 31'-45' **4** ‖ 46'-60' **2** · 61'-75' **1** · 76'-90' **3**
  - vs Wolverhampton Wanderers (CASA · V 3-0) — min 1→102:
    📈 pressão (net/min): 1'-15' [+1 +4 +4 0 -2 +1 0 0 +1 +5 +4 +2 +2 +3 +6] · 16'-30' [+8 +2 +2 +2 +6 +9 +7 +6 +5 +3 0 +3 -1 -5 -5] · 31'-45' [-3 -2 0 +2 +2 -2 -3 -3 -3 -6 -5 -5 -3 -2 0] · ‖INTERVALO‖ · 46'-60' [+3 -2 -1 -1 -1 -2 -4 -4 -1 0 0 -1 -2 -1 -1] · 61'-75' [+1 +1 0 -7 -7 -4 -2 0 0 0 -3 -3 -3 -2 -2] · 76'-90' [0 +1 +1 +1 +1 +1 +1 +1 +3 +3 +2 +3 +2 +2 +2] · 91'+ [+3 0 +1 0 +5 +5 +5 +3 +2 -1 +2 +1]
    ⚽ gols: 18'✓ 20'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **5** · 31'-45' **6** ‖ 46'-60' **2** · 61'-75' **6** · 76'-90' **4**
  - @ AFC Bournemouth (FORA · E 2-2) — min 1→98:
    📈 pressão (net/min): 1'-15' [+1 +3 +1 +1 -3 -1 -2 -3 -1 -3 -2 -3 0 +1 -2] · 16'-30' [-2 -1 +2 +2 +2 -1 -2 -3 -3 -3 +2 0 -2 +1 +1] · 31'-45' [-1 -5 -6 -6 -7 -9 -5 -5 -2 -2 0 +1 -7 -7 -4] · ‖INTERVALO‖ · 46'-60' [+1 0 0 0 +1 0 -2 -1 -4 -7 -12 -12 -7 -9 -6] · 61'-75' [-9 -6 -1 -1 -2 +1 +1 +3 +6 +7 +7 +5 +6 +3 -3] · 76'-90' [-3 -7 -9 -4 -6 -7 -3 -2 -1 -2 -6 -7 -3 -5 -5] · 91'+ [-8 -33 -21 -14 -9 -6 -2 -2]
    ⚽ gols: 60'✗ 68'✓ 85'✗ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **8** · 16'-30' **5** · 31'-45' **4** ‖ 46'-60' **1** · 61'-75' **3** · 76'-90' **7**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.18 · 16-30: 0.18 · 31-45: 0.32 · 46-60: 0.15 · 61-75: 0.24 · 76-90: 0.24
- Sofre por faixa (/j): 0-15: 0.12 · 16-30: 0.21 · 31-45: 0.15 · 46-60: 0.29 · 61-75: 0.29 · 76-90: 0.44
- 1ºT: marca 23 / sofre 16 (totais na temporada)

### Desfalques de Leeds United neste jogo
- **Ilia Gruev** (Unknown Injury) — 0 gols + 3 assists até a data; season: **0% dos gols** do time (7% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.52 g/j (23j) vs sem ele 0.82 g/j (11j) = −46%; finaliza **0.04 SoT/jogo** (time: 3.96 SoT/j com ele vs 4.18 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.7 interceptações/j** (~7% do time) · 1 desarmes/j · 2.3 duelos ganhos/j · 0.2 cruz. certos/j · 0.3 dribles certos/j · 0.5 key passes/j
- **Gabriel Gudmundsson** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (≈ estável); with/without: com ele 1.34 g/j (32j) vs sem ele 0.5 g/j (2j) = −63%; finaliza **0.09 SoT/jogo** (time: 4.03 SoT/j com ele vs 4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.9 interceptações/j** (~10% do time) · 2 desarmes/j · 5.6 duelos ganhos/j · 0.7 cruz. certos/j · 1.2 dribles certos/j · 0.7 key passes/j

## Burnley (visita) — até 2026-05-01

### Gols & finalização (season)
- Total **34 marcados / 68 sofridos** em 34j · média **1 marca / 2 sofre** por jogo
- **Fora (17j): marca 1.12 / sofre 2.47** (19 gols) · por tempo: 1ºT 0.44/1 · 2ºT 0.56/1
- **Finalização: 102 SoT (3/j · fora 3.06/j) · conv 31%** (aberta, −2 pên) · sofre 5.74 SoT/j (adv 32%) · 6.76 KP/j
- **Volume: 9.1 chutes/j (5.7 na área) · 1.5 big chances/j** · posse 41.5%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 39.5/58.4 · chutes pra fora 3.2/6.4 · bloqueados 3/4.6 · de fora da área 3.4/5.5
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 40.4/56.6 · chutes pra fora 2.6/7.2 · bloqueados 3.6/6.2 · de fora da área 2.4/5.6

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 6.7**
  - ⚠️(fora) **J. Cullen** nota **6.96** (season) · forma 6.92= (últ.5) · 1× MOTM · 18j
  - **James Ward-Prowse** nota **6.91** (season) · forma 6.89= (últ.5) · 10j
  - **Martin Dúbravka** nota **6.89** (season) · forma 6.87= (últ.5) · 3× MOTM · 34j
  - **Jaidon Anthony** nota **6.86** (season) · forma 6.72= (últ.5) · 1× MOTM · 34j
  - **Zian Flemming** nota **6.84** (season) · forma 6.88= (últ.5) · 1× MOTM · 26j
  - **Ashley Barnes** nota **6.8** (season) · forma 6.65= (últ.5) · 10j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: DDDDE** (1pts) · **2 feitos / 10 sofridos** · marca 0.4↓ / sofre 2= g/j · SoT 3.2 feito / 5.6 sofrido
- **Consistência: MARCOU em 21/34** (casa 8/17 · fora 13/17) · não-marcou 13 · clean sheet 4 · BTTS 19/34
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- vs **AFC Bournemouth** (casa · **E 0-0**) — adv 9º · você 19º briga-Z · seu casa até ali 1.1 marca/1.6 sofre
- @ **Fulham** (fora · **D 1-3**) — adv 11º · você 19º briga-Z · seu fora até ali 1.1 marca/2.3 sofre
- vs **Brighton & Hove Albion** (casa · **D 0-2**) — adv 10º · você 19º briga-Z · seu casa até ali 1 marca/1.5 sofre
- @ **Nottingham Forest** (fora · **D 1-4**) — adv 16º briga-Z · você 19º briga-Z · seu fora até ali 1.1 marca/2.4 sofre
- vs **Manchester City** (casa · **D 0-1**) — adv 2º Eur-gar · você 19º briga-Z · seu casa até ali 0.9 marca/1.6 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs AFC Bournemouth (CASA · E 0-0) — min 1→97:
    📈 pressão (net/min): 1'-15' [+3 +3 -1 -1 -3 -3 -3 -7 -7 -19 -19 -14 -14 -9 -9] · 16'-30' [-6 -2 -1 +4 +4 0 0 0 +4 +4 +5 +10 +10 +10 +13] · 31'-45' [+13 +13 +13 +11 +11 +11 +11 +10 +10 +10 +4 +4 +4 +5 -1] · ‖INTERVALO‖ · 46'-60' [-1 -1 -1 -1 -3 -3 -4 -4 -2 -1 +4 +4 +6 +6 +6] · 61'-75' [+14 +14 +8 +8 +2 -4 -6 -5 -5 -3 -7 -8 -8 -8 -6] · 76'-90' [-6 -6 -3 -3 -2 -1 +4 +2 +3 +3 +2 +2 -1 -1 -1] · 91'+ [-3 -3 -24 -16 -16 -15 -13]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **4** · 31'-45' **1** ‖ 46'-60' **5** · 61'-75' **4** · 76'-90' **1**
  - @ Fulham (FORA · D 1-3) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 0 +6 +5 +5 +4 +4 +4 +4 +4 +4 +4 +4 +4 +4] · 16'-30' [+8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8 +8] · 31'-45' [+8 +8 +8 -1 -1 -1 -1 -1 -1 -1 -1 +1 +1 -6 -6] · ‖INTERVALO‖ · 46'-60' [-4 -5 -5 -5 -6 -4 -8 -8 -9 -5 -5 -7 -2 -2 0] · 61'-75' [0 0 +1 -1 -1 -3 -3 -2 -2 -12 -9 -9 -6 -7 -5] · 76'-90' [+3 +4 +3 +1 +1 +2 +7 +8 +5 +5 +3 +1 +6 +6 +3] · 91'+ [+3 +1 +1 +1 -4 -4 -5]
    ⚽ gols: 60'✓ 67'✗ 73'✗ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **3** · 31'-45' **3** ‖ 46'-60' **11** · 61'-75' **2** · 76'-90' **1**
  - vs Brighton & Hove Albion (CASA · D 0-2) — min 1→96:
    📈 pressão (net/min): 1'-15' [-1 -1 -2 -1 -3 -5 -3 -2 -4 -2 -2 +6 +5 +5 +4] · 16'-30' [+3 +4 +4 0 0 -3 -3 -3 -10 -8 -8 -7 -3 +1 +6] · 31'-45' [+6 +4 0 0 -1 -2 -1 -1 -1 -1 -2 -2 -2 -4 -3] · ‖INTERVALO‖ · 46'-60' [-10 -7 -1 +12 +9 +6 +6 +4 0 +1 +2 +2 +4 +5 +8] · 61'-75' [+4 +4 +1 -2 -3 -4 -4 -2 -1 -1 0 +2 +3 0 +1] · 76'-90' [0 -1 -1 0 +25 +24 +18 +13 +8 +6 +4 +3 +3 -1 0] · 91'+ [-1 -2 -2 -1 +1 +3]
    ⚽ gols: 43'✗ 89'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **4** · 31'-45' **3** ‖ 46'-60' **1** · 61'-75' **3** · 76'-90' **6**
  - @ Nottingham Forest (FORA · D 1-4) — min 1→98:
    📈 pressão (net/min): 1'-15' [-1 -1 -1 0 +1 0 -1 -1 -1 -1 -1 -1 -3 -3 -5] · 16'-30' [-5 -5 -4 -3 -3 0 -3 -2 +1 -1 -2 -4 -3 -2 -1] · 31'-45' [-1 -1 -1 -1 -5 -4 -3 -3 -1 -2 -2 -2 -3 -3 +2] · ‖INTERVALO‖ · 46'-60' [+4 +3 +2 +2 +4 +4 +1 0 -2 -4 -4 -4 -4 -3 -3] · 61'-75' [-5 -5 -9 -6 -6 0 -2 -2 -5 -5 -4 -8 +1 +1 +2] · 76'-90' [+2 -3 -3 -6 -6 -5 -3 0 0 +2 +1 +1 +2 +1 -2] · 91'+ [-2 +1 +5 +6 +4 +6 +6 -1]
    ⚽ gols: 45'✓ 62'✗ 69'✗ 77'✗ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **7** · 16'-30' **9** · 31'-45' **4** ‖ 46'-60' **1** · 61'-75' **5** · 76'-90' **8**
  - vs Manchester City (CASA · D 0-1) — min 1→92:
    📈 pressão (net/min): 1'-15' [0 0 -1 0 -1 -8 -3 -1 -8 -5 -3 -1 -1 +1 +2] · 16'-30' [0 +3 +3 -1 -3 -3 -4 -3 -5 -5 -12 -8 -10 -8 -7] · 31'-45' [-4 -4 -3 -3 -7 -6 -2 -2 -4 -6 -6 -6 -7 -7 +1] · ‖INTERVALO‖ · 46'-60' [+2 0 0 -4 -3 -1 -3 -2 -3 -3 -3 -7 -8 -6 -4] · 61'-75' [-1 -5 -5 -4 -1 -2 -2 -2 -6 -7 -7 -9 -9 -7 -7] · 76'-90' [-4 -3 -7 -7 -11 -7 -7 -11 -7 -7 -8 -8 -6 -6 -10] · 91'+ [-10 -17]
    ⚽ gols: 5'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **4** ‖ 46'-60' **10** · 61'-75' **4** · 76'-90' **10**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.06 · 16-30: 0.15 · 31-45: 0.24 · 46-60: 0.15 · 61-75: 0.12 · 76-90: 0.29
- Sofre por faixa (/j): 0-15: 0.35 · 16-30: 0.18 · 31-45: 0.47 · 46-60: 0.21 · 61-75: 0.29 · 76-90: 0.5
- 1ºT: marca 15 / sofre 34 (totais na temporada)

### Desfalques de Burnley neste jogo
- **J. Cullen** (Cruciate Ligament Tear) — 2 gols + 2 assists até a data; season: **6% dos gols** do time (12% com assists); **últimos 5 jogos do time**: participou de 0/2 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.06 g/j (18j) vs sem ele 0.94 g/j (16j) = −11%; finaliza **0.33 SoT/jogo** (time: 3.06 SoT/j com ele vs 2.94 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.2 interceptações/j** (~12% do time) · 1.7 desarmes/j · 3.7 duelos ganhos/j · 0.1 cruz. certos/j · 0.1 dribles certos/j · 0.7 key passes/j
- **Axel Tuanzebe** (Doubtful) — 1 gols + 0 assists até a data; season: **3% dos gols** do time (3% com assists); **últimos 5 jogos do time**: participou de 0/2 gols = **0%** (≈ estável); with/without: com ele 1.27 g/j (11j) vs sem ele 0.87 g/j (23j) = −31%; finaliza **0.09 SoT/jogo** (time: 3.27 SoT/j com ele vs 2.87 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.8 interceptações/j** (~8% do time) · 1.1 desarmes/j · 3 duelos ganhos/j · 0 cruz. certos/j · 0 dribles certos/j · 0 key passes/j
- **L. Beyer** (Knee Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/2 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1 g/j (34j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Mike Tresor** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/2 gols = **0%** (≈ estável); with/without: com ele 0.67 g/j (6j) vs sem ele 1.07 g/j (28j) = +60%; finaliza **0 SoT/jogo** (time: 3.17 SoT/j com ele vs 2.96 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0.2 desarmes/j · 0.2 duelos ganhos/j · 0.2 cruz. certos/j · 0 dribles certos/j · 0.2 key passes/j
- **C. Roberts** (Achilles tendon problems) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/2 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1 g/j (34j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Leeds United atacando × Burnley defendendo**
| Faixa | Leeds United marca/j | Burnley sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.18 | 0.35 | 0.53 |
| 16-30 | 0.18 | 0.18 | 0.36 |
| 31-45 | 0.32 | 0.47 | 0.79 |
| 46-60 | 0.15 | 0.21 | 0.36 |
| 61-75 | 0.24 | 0.29 | 0.53 |
| 76-90 | 0.24 | 0.5 | 0.74 |

**Burnley atacando × Leeds United defendendo**
| Faixa | Burnley marca/j | Leeds United sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.06 | 0.12 | 0.18 |
| 16-30 | 0.15 | 0.21 | 0.36 |
| 31-45 | 0.24 | 0.15 | 0.39 |
| 46-60 | 0.15 | 0.29 | 0.44 |
| 61-75 | 0.12 | 0.29 | 0.41 |
| 76-90 | 0.29 | 0.44 | 0.73 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Leeds United (casa) = 2.42 · λ Burnley (fora) = 1.07 · total = 3.49

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Leeds United: λ_SoT 5.45 × conv 28% → **1.53 gols**
- Burnley: λ_SoT 2.65 × conv 31% → **0.82 gols**
- total via SoT = 2.35
- **Índice de volume do jogo**: λ_SoT total 8.1 vs média da liga 8.4 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 67/18/15% | 54/26/20% |
| Over 1.5 | 86% | 68% |
| Over 2.5 | 68% | 42% |
| Over 3.5 | 46% | 21% |
| BTTS | 60% | 44% |

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **43/41/16%** · 2ºT **38/42/21%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Leeds United) e `away` (= Burnley), cada um com:
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
