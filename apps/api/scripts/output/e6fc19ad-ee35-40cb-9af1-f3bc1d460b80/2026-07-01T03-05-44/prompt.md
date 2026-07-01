# Prognóstico de expected goals — Wolverhampton Wanderers x Arsenal

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
- Data: 2026-02-18 20:00 · Rodada 31 · Liga PL
- Local: Molineux Stadium, Wolverhampton (grass)
- Clima: light snow · 3.5°C (sens. -2.2°C) · vento 11.5 m/s · umidade 65% · nuvens 100% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: Wolverhampton Wanderers 3 dias (último: FA Cup Round 4, 2026-02-15) · Arsenal 3 dias (último: FA Cup Round 4, 2026-02-15)
- Viagem do visitante: ~180 km
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, 260 jogos): mandante 1.542 gols/jogo · visitante 1.235 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.31 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-02-18)
- Wolverhampton Wanderers: 20º, 9 pts · Arsenal: 1º, 57 pts
- Linhas: segurança (sair do Z) 27 pts (17º) · Champions 44 pts (5º) · última vaga europeia 37 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Wolverhampton Wanderers: 20º, 9 pts, 12 jogo(s) restante(s) (máx possível 45 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - Champions ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - Arsenal: 1º, 57 pts, 12 jogo(s) restante(s) (máx possível 93 pts)
  - AINDA PODE CAIR — e **só uma vitória** garante a permanência neste jogo; precisa ir pra cima.
  - ainda pode ser CAMPEÃO — precisa vencer.
  - Champions ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - disputa pela vaga (1º): o Arsenal **precisa vencer** pra travar (empate ainda deixa 11 rival vivo). Quem ainda ameaça → Manchester City (2º, 53 pts, máx 89) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Aston Villa (3º, 50 pts, máx 86) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Manchester United (4º, 45 pts, máx 81) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Chelsea (5º, 44 pts, máx 80) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Liverpool (6º, 42 pts, máx 78) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Brentford (7º, 40 pts, máx 76) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Everton (8º, 37 pts, máx 73) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; AFC Bournemouth (9º, 37 pts, máx 73) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Newcastle United (10º, 36 pts, máx 72) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Sunderland (11º, 36 pts, máx 72) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Fulham (12º, 34 pts, máx 70) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Crystal Palace (13º, 32 pts, máx 68) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Brighton & Hove Albion (14º, 31 pts, máx 67) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Leeds United (15º, 30 pts, máx 66) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Tottenham Hotspur (16º, 29 pts, máx 65) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; Nottingham Forest (17º, 27 pts, máx 63) pode **passar em pontos** — vencendo, se o Arsenal tropeçar; West Ham United (18º, 24 pts, máx 60) pode **passar em pontos** — vencendo, se o Arsenal tropeçar

🔥 **VEREDITO DE INTENÇÃO: OS DOIS PRECISAM IR PRA CIMA** (nenhum se contenta com empate) → o jogo tende a ABRIR. Over / handicap de quem ataca / team_total GANHAM peso — aposta de gol é COERENTE aqui.

## Wolverhampton Wanderers (manda) — até 2026-02-18

### Gols & finalização (season)
- Total **16 marcados / 48 sofridos** em 26j · média **0.62 marca / 1.85 sofre** por jogo
- **Em casa (13j): marca 0.85 / sofre 2.15** (11 gols) · por tempo: 1ºT 0.38/0.92 · 2ºT 0.23/0.92
- **Finalização: 84 SoT (3.23/j · casa 3.77/j) · conv 17%** (aberta, −2 pên) · sofre 4.65 SoT/j (adv 37%) · 6.88 KP/j
- **Volume: 9.3 chutes/j (5.9 na área) · 1.2 big chances/j** · posse 43.6%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 39.2/59.6 · chutes pra fora 3.8/5.3 · bloqueados 2.4/4 · de fora da área 3.4/5
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 34.8/58 · chutes pra fora 4.4/7.2 · bloqueados 2.8/4 · de fora da área 4.2/6.2

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: EDDDE** (2pts) · **1 feitos / 7 sofridos** · marca 0.2↓ / sofre 1.4↓ g/j · SoT 3.2 feito / 5.2 sofrido
- **Consistência: MARCOU em 12/26** (casa 7/13 · fora 5/13) · não-marcou 14 · clean sheet 3 · BTTS 11/26
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Manchester City** (fora · **D 0-2**) — adv 2º briga-top · você 20º briga-Z · seu fora até ali 0.5 marca/1.6 sofre
- vs **AFC Bournemouth** (casa · **D 0-2**) — adv 13º · você 20º briga-Z · seu casa até ali 0.9 marca/2.1 sofre
- vs **Chelsea** (casa · **D 1-3**) — adv 5º briga-top · você 20º briga-Z · seu casa até ali 0.8 marca/2.1 sofre
- @ **Nottingham Forest** (fora · **E 0-0**) — adv 17º briga-Z · você 20º briga-Z · seu fora até ali 0.4 marca/1.7 sofre
- @ **Grimsby Town** (fora · **V 1-0**) — 🏆 FA Cup

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Newcastle United (CASA · E 0-0) — min 1→95:
    📈 pressão (net/min): 1'-15' [-3 -3 -5 -3 -3 -2 -3 -2 -1 -1 0 +1 +6 +3 +2] · 16'-30' [+2 0 -5 -4 -4 -2 -2 -5 -4 -4 -2 -6 -4 -1 -1] · 31'-45' [0 -1 -2 -2 -2 -6 -4 -4 -4 -3 -4 -3 -2 -1 -6] · ‖INTERVALO‖ · 46'-60' [-4 -2 -2 -7 -7 -5 -3 -2 -1 -2 -1 -5 -3 -2 -3] · 61'-75' [-2 -1 -1 -2 0 0 +1 0 0 0 -1 +1 -1 -1 -5] · 76'-90' [-4 -3 -3 -5 -4 -2 -2 0 0 0 -7 -6 -5 -5 -3] · 91'+ [-1 0 0 -2 -3]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **3** · 31'-45' **4** ‖ 46'-60' **5** · 61'-75' **4** · 76'-90' **2**
  - @ Manchester City (FORA · D 0-2) — min 1→95:
    📈 pressão (net/min): 1'-15' [0 -2 -2 -3 -7 -7 -9 -9 -9 -9 -7 -7 -6 -7 -6] · 16'-30' [-5 -5 -2 -1 -1 -3 -3 -3 -3 -3 -3 -8 -6 -5 -4] · 31'-45' [-4 -4 -2 -1 -2 -2 -3 -3 -3 -3 -3 -3 -3 -3 -2] · ‖INTERVALO‖ · 46'-60' [-8 -6 -4 -4 -4 -3 -3 -2 -2 -5 -4 -1 0 +3 +1] · 61'-75' [0 -3 -3 -3 -2 -3 -1 -2 0 +2 +2 +2 +2 +3 +2] · 76'-90' [+1 0 -2 -3 -3 -3 -3 +1 0 0 0 -5 -5 -5 -2] · 91'+ [-1 0 +1 +3 +3]
    ⚽ gols: 6'✗ 45'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **2** ‖ 46'-60' **10** · 61'-75' **4** · 76'-90' **5**
  - vs AFC Bournemouth (CASA · D 0-2) — min 1→94:
    📈 pressão (net/min): 1'-15' [0 -1 -1 -1 -1 -1 -1 -1 -1 0 -1 -1 0 -2 0] · 16'-30' [-3 -2 0 0 0 0 0 +1 -2 -1 -1 0 0 +1 +1] · 31'-45' [+2 -2 -2 -3 -2 -1 0 -1 -2 -6 -6 -4 -7 -5 -4] · ‖INTERVALO‖ · 46'-60' [-3 -4 -4 -4 -1 -1 0 +1 +4 +5 +4 +3 +4 +4 +4] · 61'-75' [+3 +5 +4 +3 +5 +5 +5 +4 +3 +3 +2 +5 +5 +4 +3] · 76'-90' [+3 +2 +2 +1 +1 +1 +1 +3 +3 +11 +6 +5 +5 +2 0] · 91'+ [-4 -4 -2 -1]
    ⚽ gols: 33'✗ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **3** · 31'-45' **5** ‖ 46'-60' **5** · 61'-75' **2** · 76'-90' **5**
  - vs Chelsea (CASA · D 1-3) — min 1→98:
    📈 pressão (net/min): 1'-15' [0 +1 +7 +5 +3 +2 +2 +2 +2 +2 +2 +1 -2 -3 -1] · 16'-30' [-2 -3 -2 -1 -2 -2 -2 -2 -2 -2 -4 -9 -9 -9 -7] · 31'-45' [-7 -6 -9 -16 -16 -11 -9 -9 -8 -18 -13 -13 -9 -6 -5] · ‖INTERVALO‖ · 46'-60' [-3 -3 -1 -1 -7 -2 -2 -1 -2 +5 +4 +4 +4 +1 +1] · 61'-75' [+1 +1 +1 +8 +5 +5 +6 +4 +3 +3 +3 +7 +6 +6 +5] · 76'-90' [+3 +3 +4 +4 +4 +2 +2 +2 +2 0 0 -2 -2 -5 -10] · 91'+ [-7 -4 0 +2 +8 +6 +6 +7]
    ⚽ gols: 13'✗ 35'✗ 38'✗ 54'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **6** · 31'-45' **3** ‖ 46'-60' **5** · 61'-75' **3** · 76'-90' **2**
  - @ Nottingham Forest (FORA · E 0-0) — min 1→93:
    📈 pressão (net/min): 1'-15' [0 -3 -4 -2 -5 -4 -2 -2 -1 -4 -3 -3 -3 -8 -11] · 16'-30' [-7 -6 -5 -7 -9 -6 -6 -4 -2 -1 0 +1 0 0 -3] · 31'-45' [-3 -3 -5 -6 -6 -7 -7 -7 -6 -16 -11 -13 -13 -7 -5] · ‖INTERVALO‖ · 46'-60' [-2 -1 -1 0 -1 -1 -2 -2 -1 -5 -7 -5 -6 -4 +1] · 61'-75' [+1 -2 -7 -5 -4 -3 -5 -4 -6 -1 +1 +1 +2 -1 -2] · 76'-90' [-1 -5 -11 -9 -9 -9 -8 -5 -3 -2 -1 -1 -3 -3 -6] · 91'+ [-5 -8 -6]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **10** · 31'-45' **5** ‖ 46'-60' **3** · 61'-75' **4** · 76'-90' **2**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.08 · 16-30: 0.08 · 31-45: 0.23 · 46-60: 0.12 · 61-75: 0.04 · 76-90: 0.08
- Sofre por faixa (/j): 0-15: 0.23 · 16-30: 0.23 · 31-45: 0.46 · 46-60: 0.12 · 61-75: 0.46 · 76-90: 0.35
- 1ºT: marca 10 / sofre 24 (totais na temporada)

### Desfalques de Wolverhampton Wanderers neste jogo
- **Hee-chan Hwang** (Unknown Injury) — 2 gols + 1 assists até a data; season: **13% dos gols** do time (19% com assists); **últimos 5 jogos do time**: participou de 0/1 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 0.7 g/j (20j) vs sem ele 0.33 g/j (6j) = −53%; finaliza **0.3 SoT/jogo** (time: 3.15 SoT/j com ele vs 3.5 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.4 interceptações/j** (~5% do time) · 0.4 desarmes/j · 1.8 duelos ganhos/j · 0.1 cruz. certos/j · 0.4 dribles certos/j · 0.5 key passes/j
- **Toti** (Hamstring Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/1 gols = **0%** (≈ estável); with/without: com ele 0.46 g/j (13j) vs sem ele 0.77 g/j (13j) = +67%; finaliza **0.08 SoT/jogo** (time: 2.54 SoT/j com ele vs 3.92 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.7 interceptações/j** (~8% do time) · 1.1 desarmes/j · 3.2 duelos ganhos/j · 0.2 cruz. certos/j · 0.6 dribles certos/j · 0.4 key passes/j
- **E. Gonzalez Medina** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/1 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 0.62 g/j (26j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Arsenal (visita) — até 2026-02-18

### Gols & finalização (season)
- Total **50 marcados / 18 sofridos** em 26j · média **1.92 marca / 0.69 sofre** por jogo
- **Fora (13j): marca 1.46 / sofre 0.77** (19 gols) · por tempo: 1ºT 0.69/0.23 · 2ºT 1.23/0.46
- **Finalização: 130 SoT (5/j · fora 5.08/j) · conv 36%** (aberta, −3 pên) · sofre 2.15 SoT/j (adv 32%) · 10.77 KP/j
- **Volume: 14.7 chutes/j (11.1 na área) · 3 big chances/j** · posse 57.5%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 61.6/33.7 · chutes pra fora 5.4/2.9 · bloqueados 4.3/2.7 · de fora da área 3.6/2.7
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 65.4/41.4 · chutes pra fora 4.2/2.8 · bloqueados 4.8/2.4 · de fora da área 3.4/3.4

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: EVVDE** (8pts) · **10 feitos / 4 sofridos** · marca 2= / sofre 0.8↑ g/j · SoT 4.8 feito / 2 sofrido
- **Consistência: MARCOU em 23/26** (casa 12/13 · fora 11/13) · não-marcou 3 · clean sheet 13 · BTTS 12/26
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Leeds United** (fora · **V 4-0**) — adv 16º briga-Z · você 1º briga-top · seu fora até ali 1.3 marca/0.8 sofre
- vs **Chelsea** (casa · **V 1-0**) — 🏆 Carabao Cup
- vs **Sunderland** (casa · **V 3-0**) — adv 8º · você 1º briga-top · seu casa até ali 2.3 marca/0.7 sofre
- @ **Brentford** (fora · **E 1-1**) — adv 7º briga-top · você 1º briga-top · seu fora até ali 1.5 marca/0.8 sofre
- vs **Wigan Athletic** (casa · **V 4-0**) — 🏆 FA Cup

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Nottingham Forest (FORA · E 0-0) — min 1→95:
    📈 pressão (net/min): 1'-15' [-1 0 -1 0 0 0 +1 +5 +3 +2 +1 -2 0 -4 -3] · 16'-30' [-3 +1 +1 +2 +7 +7 +9 +6 +5 +3 +2 +4 +3 +3 +4] · 31'-45' [+8 +10 +10 +8 +8 +5 +2 -2 -2 -2 -7 -4 -4 -3 -4] · ‖INTERVALO‖ · 46'-60' [-9 -5 -6 -4 -2 -1 0 0 0 -3 -4 -3 -4 0 +1] · 61'-75' [-1 -1 0 -2 +2 +4 +4 +4 +6 +4 +9 +9 +9 +6 +4] · 76'-90' [+3 +1 0 -2 -2 -2 0 0 +4 +5 +5 +5 +4 +4 +6] · 91'+ [+4 +2 +3 +3 +2]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **3** · 31'-45' **2** ‖ 46'-60' **6** · 61'-75' **4** · 76'-90' **1**
  - vs Manchester United (CASA · D 2-3) — min 1→97:
    📈 pressão (net/min): 1'-15' [-2 0 0 +1 +1 0 +1 +4 +4 +9 +8 +7 +7 +4 +4] · 16'-30' [+6 +5 +5 +6 +5 +5 +4 +2 -1 -2 -2 -1 -1 0 +1] · 31'-45' [+1 +2 +1 +1 +1 +1 -4 -4 -2 0 0 0 0 -2 -1] · ‖INTERVALO‖ · 46'-60' [0 -1 -2 -2 -2 -4 -4 -2 0 +4 +4 +3 +6 +4 +3] · 61'-75' [+3 +6 +4 +3 +3 +3 +2 +3 +3 +4 +4 +8 +1 +1 0] · 76'-90' [+4 +3 +7 +5 +4 +5 +3 +3 +8 +7 +5 +1 +2 +2 +1] · 91'+ [+1 +2 +2 +2 +1 +2 +4]
    ⚽ gols: 29'✓ 37'✗ 50'✗ 84'✓ 87'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **1** · 16'-30' **5** · 31'-45' **2** ‖ 46'-60' **4** · 61'-75' **6** · 76'-90' **3**
  - @ Leeds United (FORA · V 4-0) — min 1→94:
    📈 pressão (net/min): 1'-15' [+1 +1 +6 +6 +4 +2 +2 +2 +1 0 -2 -2 +1 +2 +2] · 16'-30' [+2 +1 +1 0 +1 +1 +1 +8 +6 +5 +3 +7 +4 +2 +7] · 31'-45' [+5 +3 +3 +2 +2 +3 +2 +2 +2 +3 +3 +2 +1 +1 +2] · ‖INTERVALO‖ · 46'-60' [+4 +2 +1 +1 -2 -6 0 +2 +3 +2 +3 0 0 0 -3] · 61'-75' [-2 -2 -2 -9 -9 -7 -6 -4 -1 +1 +1 +2 +6 +5 +2] · 76'-90' [+1 +2 +4 +3 +9 +9 +32 +22 +14 +14 +12 +12 +12 +6 +6] · 91'+ [+10 +7 +5 -9]
    ⚽ gols: 27'✓ 38'✓ 69'✓ 86'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **1** · 31'-45' **5** ‖ 46'-60' **2** · 61'-75' **6** · 76'-90' **3**
  - vs Sunderland (CASA · V 3-0) — min 1→96:
    📈 pressão (net/min): 1'-15' [+1 +1 +1 +2 +2 +2 +2 +1 -1 -2 -1 0 0 +6 +3] · 16'-30' [+1 +3 +2 +2 +1 0 +1 +1 +1 +1 +1 +2 +2 +2 +2] · 31'-45' [+2 +1 +1 +6 +4 +4 +3 +3 +1 +11 +11 +10 +10 +10 +10] · ‖INTERVALO‖ · 46'-60' [+1 -2 0 -2 -1 -1 -2 +1 +3 +2 +4 +2 +2 +4 +3] · 61'-75' [+2 +2 +1 +1 +3 +5 +5 +3 +2 +2 +2 +1 +6 +5 +6] · 76'-90' [+5 +4 +6 +3 +1 0 +1 +1 +1 +1 +2 +1 +1 +1 +1] · 91'+ [+1 -1 -1 +4 -5 -4]
    ⚽ gols: 42'✓ 66'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **5** · 16'-30' **1** · 31'-45' **3** ‖ 46'-60' **8** · 61'-75' **2** · 76'-90' **6**
  - @ Brentford (FORA · E 1-1) — min 1→95:
    📈 pressão (net/min): 1'-15' [+2 +1 +1 0 +1 +4 +3 +2 +2 +3 +3 +4 +5 +4 +3] · 16'-30' [+2 +3 +5 +2 +2 +1 -2 -5 -7 -10 -6 -5 -7 -6 -4] · 31'-45' [-2 -1 +2 +2 +1 +1 +5 +5 +4 +5 +4 +6 +6 +7 +1] · ‖INTERVALO‖ · 46'-60' [+2 +3 +5 +5 +8 +4 +3 +2 +1 +3 +6 +6 +5 +5 +3] · 61'-75' [+7 +6 +3 -1 -1 0 +1 -2 -2 -3 -5 -5 -5 -4 -4] · 76'-90' [+6 +6 +4 +2 0 -1 -1 -1 -2 -3 -2 -1 0 -3 -2] · 91'+ [-4 -6 -5 0 -1]
    ⚽ gols: 61'✓ 71'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **8** · 16'-30' **6** · 31'-45' **3** ‖ 46'-60' **2** · 61'-75' **1** · 76'-90' **6**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.15 · 16-30: 0.15 · 31-45: 0.38 · 46-60: 0.46 · 61-75: 0.31 · 76-90: 0.46
- Sofre por faixa (/j): 0-15: 0.08 · 16-30: 0 · 31-45: 0.15 · 46-60: 0.12 · 61-75: 0.08 · 76-90: 0.27
- 1ºT: marca 18 / sofre 6 (totais na temporada)

### Desfalques de Arsenal neste jogo
- **Mikel Merino** (Foot Injury) — 4 gols + 3 assists até a data; season: **8% dos gols** do time (14% com assists); **últimos 5 jogos do time**: participou de 1/10 gols = **10%** (≈ estável); with/without: com ele 1.76 g/j (21j) vs sem ele 2.6 g/j (5j) = +48%; finaliza **0.43 SoT/jogo** (time: 5 SoT/j com ele vs 5 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.5 interceptações/j** (~7% do time) · 1.2 desarmes/j · 3.8 duelos ganhos/j · 0 cruz. certos/j · 0.2 dribles certos/j · 0.6 key passes/j
- **Martin Ødegaard** (Knee Injury) — 1 gols + 4 assists até a data; season: **2% dos gols** do time (10% com assists); **últimos 5 jogos do time**: participou de 1/10 gols = **10%** (≈ estável); with/without: com ele 1.89 g/j (19j) vs sem ele 2 g/j (7j) = +6%; finaliza **0.37 SoT/jogo** (time: 4.79 SoT/j com ele vs 5.57 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.4 interceptações/j** (~5% do time) · 0.9 desarmes/j · 1.9 duelos ganhos/j · 0.3 cruz. certos/j · 0.5 dribles certos/j · 1.6 key passes/j
- **Kai Havertz** (Muscle Injury) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 1/10 gols = **10%** (↑ mais decisivo AGORA); with/without: com ele 2.67 g/j (3j) vs sem ele 1.83 g/j (23j) = −31%; finaliza **0 SoT/jogo** (time: 5.67 SoT/j com ele vs 4.91 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0.7 desarmes/j · 4.3 duelos ganhos/j · 0 cruz. certos/j · 0.7 dribles certos/j · 1 key passes/j
- **Max Dowman** (Ankle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 2.5 g/j (2j) vs sem ele 1.88 g/j (24j) = −25%; finaliza **0 SoT/jogo** (time: 3 SoT/j com ele vs 5.17 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 1 desarmes/j · 2.5 duelos ganhos/j · 0 cruz. certos/j · 0.5 dribles certos/j · 0 key passes/j

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Wolverhampton Wanderers atacando × Arsenal defendendo**
| Faixa | Wolverhampton Wanderers marca/j | Arsenal sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.08 | 0.08 | 0.16 |
| 16-30 | 0.08 | 0 | 0.08 |
| 31-45 | 0.23 | 0.15 | 0.38 |
| 46-60 | 0.12 | 0.12 | 0.24 |
| 61-75 | 0.04 | 0.08 | 0.12 |
| 76-90 | 0.08 | 0.27 | 0.35 |

**Arsenal atacando × Wolverhampton Wanderers defendendo**
| Faixa | Arsenal marca/j | Wolverhampton Wanderers sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.15 | 0.23 | 0.38 |
| 16-30 | 0.15 | 0.23 | 0.38 |
| 31-45 | 0.38 | 0.46 | 0.84 |
| 46-60 | 0.46 | 0.12 | 0.58 |
| 61-75 | 0.31 | 0.46 | 0.77 |
| 76-90 | 0.46 | 0.35 | 0.81 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Wolverhampton Wanderers (casa) = 0.42 · λ Arsenal (fora) = 2.54 · total = 2.96

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Wolverhampton Wanderers: λ_SoT 2.12 × conv 17% → **0.36 gols**
- Arsenal: λ_SoT 6.08 × conv 36% → **2.19 gols**
- total via SoT = 2.55
- **Índice de volume do jogo**: λ_SoT total 8.2 vs média da liga 8.4 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 4/12/83% | 5/15/80% |
| Over 1.5 | 79% | 72% |
| Over 2.5 | 57% | 47% |
| Over 3.5 | 34% | 25% |
| BTTS | 32% | 27% |

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **10/43/47%** · 2ºT **3/26/71%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Wolverhampton Wanderers) e `away` (= Arsenal), cada um com:
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
