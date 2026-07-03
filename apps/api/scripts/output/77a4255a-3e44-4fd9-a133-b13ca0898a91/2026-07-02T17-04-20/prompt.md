# Prognóstico de expected goals — West Ham United x Leeds United

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
- **Quem provavelmente marca primeiro?** (pela intenção + assimetria ataque×defesa). E então: o que o OUTRO é obrigado a fazer? Time que vai perdendo e precisa de pontos se lança → o jogo escancara → total e handicap SOBEM. Favorito que faz 2-0 cedo pode ADMINISTRAR — mas **CUIDADO: administrar NÃO é sinônimo de jogo morto**. Recuar e comprimir a defesa **AUMENTA o risco de sofrer** (evidência de tracking, sobretudo num 1-0 tardio de azarão que se tranca): o líder é encurralado, cede escanteio/bola parada e o gol pode sair — pra ELE (contra-ataque, o líder marca ~53% dos gols nesse cenário) OU contra. NÃO empurre under automático só porque "o favorito administra"; o over pode se sustentar justamente pela pressão do perseguidor + a fragilidade da vantagem de 1 gol (cai em ~37% dos jogos).
- **Ramifique dos DOIS lados (seja simétrico):** roteiros que ABREM (perseguição, dois times que precisam, defesa que vaza fora) E roteiros que FECHAM (um se contenta com empate e o outro sem fôlego; favorito que mata e poupa; jogo amarrado de poucas chances). Não force over nem under — deixe o roteiro mais provável mandar.
- **O placar muda as taxas, e o Poisson é CEGO a isso** (trata cada time como taxa fixa e independente, os dois eventos descorrelacionados). Você não: se o roteiro provável é de perseguição, o total real fica ACIMA do Poisson; se é de controle/administração, ABAIXO.
- **Cada roteiro AMARRADO a um dado** ("toma 1.8/jogo fora E precisa de pontos → ao sofrer o 1º, se lança → cascata de over / handicap do mandante"). Sem dado que o sustente, é achismo — descarte.
- **Leia o momentum MINUTO A MINUTO dos últimos 5** (bloco de cada time): a curva net (quem pressiona a cada minuto, do 1º ao último) mostra o jogo INTEIRO — se o time começa forte, afunda no meio, surta no fim, segura vantagem ou desmorona ao sofrer gol. É evidência direta de como ele conduz E SOFRE o game-state (surto sustentado no fim = sustenta roteiro de perseguição; queda longa após marcar = tenta administrar — mas isso EXPÕE a defesa à pressão do outro, não garante que o resultado se segura).

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
- Data: 2026-05-24 15:00 · Rodada 38 · Liga PL
- Local: London Stadium, London (grass)
- Clima: sky is clear · 27.6°C (sens. 27.4°C) · vento 3 m/s · umidade 42% · nuvens 4% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: West Ham United 7 dias (último: liga, 2026-05-17) · Leeds United 7 dias (último: liga, 2026-05-17)
- Viagem do visitante: ~270 km
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- West Ham United: 18º, 36 pts · Leeds United: 14º, 47 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - West Ham United: 18º, 36 pts, 1 jogo(s) restante(s) (máx possível 39 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - Leeds United: 14º, 47 pts, 1 jogo(s) restante(s) (máx possível 50 pts)
  - já SEGURO do rebaixamento.
  - sem alvo continental alcançável.
  - → motivação: **baixa** — NÃO precisa lutar — já seguro e sem alvo alcançável

⚠️ **VEREDITO DE INTENÇÃO: ASSIMÉTRICA / JOGO TENDE A TRAVAR** — pelo menos um lado NÃO precisa ir pra cima (já garantido, rebaixado, sem alvo, ou **um empate basta** → ADMINISTRA). O lado que precisa pode NÃO furar o ferrolho, e quem administra segura o jogo. **NÃO** favoreça over / goleada / handicap de mando por inércia estatística — prefira UNDER ou mercado de MENOR variância (team_total over 0.5 do lado que precisa, dupla chance), OU rebaixe a confiança. Foi exatamente neste tipo de jogo que a leitura puramente estatística mais errou no histórico.

## H2H — confronto direto West Ham United × Leeds United (liga 2 seasons + copas, até 2026-05-24)
**Retrospecto (2 confrontos na janela ingerida, ótica do West Ham United): 0V 1E 1D · gols 3-4** · over 2.5 em 2/2 · BTTS em 2/2
- 2026-04-05 · vs **Leeds United** (casa · **Empate 2-2**, HT 0-1) 🔺 buscou o empate (perdia no HT) — SoT 6-8 · 🏆 FA Cup
- 2025-10-24 · @ **Leeds United** (fora · **Derrota 1-2**, HT 0-2) — SoT 3-5
**Último confronto (o precedente mais parecido com ESTE jogo):** 2026-04-05 · vs **Leeds United** (casa · **Empate 2-2**, HT 0-1) 🔺 buscou o empate (perdia no HT) — SoT 6-8 · 🏆 FA Cup
  - Gols: 26' Ao Tanaka (Leeds United) · 75' Dominic Calvert-Lewin (Leeds United) · 90' Mateus Fernandes (West Ham United) · 90' Axel Disasi (West Ham United)
_Use como PRECEDENTE, não como destino: cite a DATA (técnico/elenco podem ter mudado desde então) e pese o MANDO — o jogo do turno foi na casa do outro. Par que trava (under/poucos SoT recorrentes) ou freguesia recorrente é sinal; 1 jogo isolado não é._

## West Ham United (manda) — até 2026-05-24

### Gols & finalização (season)
- Total **43 marcados / 65 sofridos** em 37j · média **1.16 marca / 1.76 sofre** por jogo
- **Em casa (18j): marca 1.33 / sofre 1.67** (24 gols) · por tempo: 1ºT 0.57/0.7 · 2ºT 0.59/1.05
- **Finalização: 135 SoT (3.65/j · casa 3.61/j) · conv 30%** (aberta, −3 pên) · sofre 5.3 SoT/j (adv 30%) · 7.68 KP/j
- **Volume: 10.5 chutes/j (7.6 na área) · 1.9 big chances/j** · posse 42.5%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 41.4/59.2 · chutes pra fora 3.8/5.4 · bloqueados 3.1/4.3 · de fora da área 2.8/4.6
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 45.2/51 · chutes pra fora 4.2/4.6 · bloqueados 2.6/4 · de fora da área 3.2/5.2

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.79**
  - **Jarrod Bowen** nota **7.05** (season) · forma 6.98= (últ.5 do time: 6.8→7.7→6.8→7→6.6 📉 caindo) · 1× MOTM · 41j
    ↳ **10G+11A** · gols aos 7',10',19',24',28',34',49',65',73',84' · 1.24 KP/j (últ.5: 1.6↑) · 0.78 SoT/j (últ.5: 0.6↓) · 1.39 dribles/j · def: 1.32 desarme + 0.78 int + 4.85 duelo/j · 0.73 cruz/j · ~92 min/j
  - **Mateus Fernandes** nota **7.08** (season) · forma 6.98= (últ.5 do time: 7.4→6.6→6.7→7→7.2 ➡️ estável) · 3× MOTM · 37j
    ↳ **4G+3A** · gols aos 1',43',90',90' — 2 tardios (76'+) · 1.08 KP/j (últ.5: 0.6↓) · 0.22 SoT/j (últ.5: 0.4↑) · 0.84 dribles/j · def: 2.89 desarme + 0.95 int + 5.59 duelo/j · 0.46 cruz/j · ~86 min/j
  - **Konstantinos Mavropanos** nota **7.03** (season) · forma 7.12= (últ.5 do time: 7.2→6.8→6→8.3→7.3 📈 subindo) · 5× MOTM · 34j
    ↳ **3G+0A** · gols aos 35',42',83' · 0.18 KP/j (últ.5: 0.2=) · 0.26 SoT/j (últ.5: 0.4↑) · 0.06 dribles/j · def: 1.26 desarme + 1.56 int + 4.47 duelo/j · 0.03 cruz/j · ~83 min/j
  - **El Hadji Malick Diouf** nota **6.73** (season) · forma 6.92↑ (últ.5 do time: 6.8→7.5→6.5→7→6.8 📉 caindo) · 33j
    ↳ **0G+5A** · 0.97 KP/j (últ.5: 2.4↑) · 0.12 SoT/j (últ.5: 0.4↑) · 0.73 dribles/j · def: 1.36 desarme + 0.97 int + 4.24 duelo/j · 1 cruz/j · ~85 min/j
  - **Crysencio Summerville** nota **6.95** (season) · forma 6.94= (últ.5 do time: 6.9→6.8→6.8→7→7.2 📈 subindo) · 1× MOTM · 33j
    ↳ **7G+2A** · gols aos 13',14',15',36',45',65',95' · 0.88 KP/j (últ.5: 1=) · 0.58 SoT/j (últ.5: 0↓) · 1.73 dribles/j · def: 1.42 desarme + 0.55 int + 5.55 duelo/j · 0.45 cruz/j · ~80 min/j
  - **Tomáš Souček** nota **6.8** (season) · forma 7.04↑ (últ.5 do time: 7→7.9→7→6.7→6.6 📉 caindo) · 1× MOTM · 36j
    ↳ **6G+0A** · gols aos 49',50',50',51',77',90' — mais no 2ºT, 2 tardios (76'+) · 0.34 KP/j (últ.5: 0.4=) · 0.42 SoT/j (últ.5: 0.2↓) · 0.13 dribles/j · def: 1.24 desarme + 0.55 int + 4.11 duelo/j · 0.03 cruz/j · ~64 min/j
  - **Alphonse Areola** nota **6.75** (season) · forma 6.75= (últ.5 do time: –→–→–→–→– ⚠️ poucos jogos na janela) · **faltou 5/5** · 1× MOTM · 24j
    ↳ **0G+1A** · 0.04 KP/j (últ.5: 0↓) · 0 SoT/j (últ.5: 0=) · 0 dribles/j · def: 0 desarme + 0.04 int + 0.25 duelo/j · ~94 min/j
  - **Aaron Wan-Bissaka** nota **6.72** (season) · forma 6.7= (últ.5 do time: –→–→6.7→6.8→6.6 ➡️ estável) · **faltou 2/5** · 1× MOTM · 27j
    ↳ **0G+2A** · 0.67 KP/j (últ.5: 0.2↓) · 0 SoT/j (últ.5: 0=) · 0.67 dribles/j · def: 1.22 desarme + 1.59 int + 3.19 duelo/j · 0.67 cruz/j · ~82 min/j
  - **Jean-Clair Todibo** nota **6.59** (season) · forma 6.2↓ (últ.5 do time: –→–→–→6.4→6 ⚠️ poucos jogos na janela) · **faltou 3/5** · 24j
    ↳ **0G+1A** · 0.2 KP/j (últ.5: 0↓) · 0 SoT/j (últ.5: 0=) · 0.16 dribles/j · def: 1.68 desarme + 0.72 int + 3.28 duelo/j · ~81 min/j
  - **Maximilian Kilman** nota **6.62** (season) · forma 6.62= (últ.5 do time: –→–→–→–→– ⚠️ poucos jogos na janela) · **faltou 5/5** · 23j
    ↳ 0.2 KP/j (últ.5: 0.2=) · 0.08 SoT/j (últ.5: 0↓) · 0.2 dribles/j · def: 0.96 desarme + 0.48 int + 3.64 duelo/j · 0.08 cruz/j · ~78 min/j
  - **Kyle Walker-Peters** nota **6.75** (season) · forma 6.63= (últ.5 do time: 6.8→7→6.1→–→– 📉 caindo) · **faltou 2/5** · 26j
    ↳ **1G+1A** · gols aos 87' — mais no 2ºT · 0.37 KP/j (últ.5: 0.6↑) · 0.15 SoT/j (últ.5: 0.2↑) · 0.81 dribles/j · def: 2.26 desarme + 0.48 int + 4.7 duelo/j · 0.11 cruz/j · ~65 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: DDDVE** (4pts) · **3 feitos / 8 sofridos** · marca 0.6↓ / sofre 1.6= g/j · SoT 4.4 feito / 4.2 sofrido
- **Consistência: MARCOU em 24/37** (casa 12/18 · fora 12/19) · não-marcou 13 · clean sheet 6 · BTTS 20/37
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Crystal Palace** (fora · **Empate 0-0**, HT 0-0) — 4-1 SoT · posse 49%/50% (1ºT/2ºT) · adv 13º · você 17º briga-Z · seu fora até ali 1.1 marca/1.8 sofre
- vs **Everton** (casa · **Vitória 2-1**, HT 0-0) — 3-3 SoT · posse 48%/49% (1ºT/2ºT) · adv 10º salvo · você 17º briga-Z · seu casa até ali 1.4 marca/1.8 sofre
- @ **Brentford** (fora · **Derrota 0-3**, HT 0-1) — 4-6 SoT · posse 50%/53% (1ºT/2ºT) · adv 9º salvo · você 17º briga-Z · seu fora até ali 1.1 marca/1.7 sofre
- vs **Arsenal** (casa · **Derrota 0-1**, HT 0-0) — 3-4 SoT · posse 35%/33% (1ºT/2ºT) · adv 1º Eur-gar · você 18º briga-Z · seu casa até ali 1.4 marca/1.7 sofre
- @ **Newcastle United** (fora · **Derrota 1-3**, HT 0-2) — 8-7 SoT · posse 41%/44% (1ºT/2ºT) · adv 13º salvo/s-alvo · você 18º briga-Z · seu fora até ali 1 marca/1.8 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Crystal Palace (FORA · E 0-0) — min 1→95:
    📈 pressão (net/min): 1'-15' [+2 +2 -1 -1 -1 -1 -5 -4 -4 0 0 0 -3 -1 -3] · 16'-30' [-3 -4 -3 -3 -5 -1 -1 0 +1 +3 +3 +2 +3 +3 +6] · 31'-45' [+4 +4 -1 -1 -1 +1 +2 +7 +7 +7 +7 +5 +5 +5 +10] · ‖INTERVALO‖ · 46'-60' [+3 +2 -1 -3 -1 +3 +3 +3 0 -1 -3 -2 -4 -2 -3] · 61'-75' [-3 -3 -2 +1 +2 0 -2 0 +7 +2 0 0 +1 -2 0] · 76'-90' [0 -1 -2 -2 -2 -2 -5 -5 -2 -2 -1 +2 +1 +1 0] · 91'+ [-2 -3 -2 -4 -1]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **4** · 31'-45' **0** ‖ 46'-60' **8** · 61'-75' **1** · 76'-90' **4**
  - vs Everton (CASA · V 2-1) — min 1→100:
    📈 pressão (net/min): 1'-15' [0 +1 0 0 -5 -5 -5 -7 -9 -6 -2 -2 +1 -1 0] · 16'-30' [+4 +4 +4 +5 +9 +7 +6 +6 +8 +5 +5 -1 0 0 0] · 31'-45' [+1 +1 0 0 0 -5 -3 -5 -5 -3 -3 -3 -1 0 +2] · ‖INTERVALO‖ · 46'-60' [+11 +11 +8 +8 +6 +7 +7 +14 +11 +9 +26 +19 +13 +9 +9] · 61'-75' [+14 +14 +9 +6 +6 +4 +3 +3 +2 +1 0 0 +2 +1 -6] · 76'-90' [-7 -5 -5 -12 -13 -13 -10 -10 -6 -6 -7 -7 -3 -6 -3] · 91'+ [-3 -4 -4 +4 +4 +3 0 0 -2 -1]
    ⚽ gols: 51'✓ 88'✗ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **4** ‖ 46'-60' **7** · 61'-75' **3** · 76'-90' **9**
  - @ Brentford (FORA · D 0-3) — min 1→98:
    📈 pressão (net/min): 1'-15' [-1 0 -3 -3 -3 -1 +1 +2 +1 -1 -1 0 0 0 -4] · 16'-30' [-3 -1 +5 +6 +5 +8 +10 +8 +5 +2 +2 +3 +3 +2 -2] · 31'-45' [+1 +1 0 0 -1 -1 -5 -2 -2 -3 -3 -2 0 +1 +1] · ‖INTERVALO‖ · 46'-60' [+4 +5 +2 +1 +3 +1 -2 -1 -1 -5 -2 +1 +2 +2 +1] · 61'-75' [+1 -6 -7 -8 -8 -3 -1 -3 -2 -1 -1 0 -6 -4 -4] · 76'-90' [-1 -1 0 -1 +1 +1 +1 -3 -3 -3 -2 -2 -1 -1 -3] · 91'+ [-2 -2 -1 -3 -3 -1 -2 0]
    ⚽ gols: 15'✗ 54'✗ 82'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **10** · 16'-30' **2** · 31'-45' **2** ‖ 46'-60' **6** · 61'-75' **7** · 76'-90' **7**
  - vs Arsenal (CASA · D 0-1) — min 1→102:
    📈 pressão (net/min): 1'-15' [-3 -1 -1 -4 -4 -6 -5 -2 -2 -8 -8 -14 -10 -10 -15] · 16'-30' [-12 -10 -10 -10 -10 -7 -7 -9 -9 -9 -7 -7 -4 -4 -4] · 31'-45' [-3 0 -1 -1 -1 -1 -1 0 -2 -2 -2 +1 +3 +1 +5] · ‖INTERVALO‖ · 46'-60' [0 +3 +2 +1 0 +2 -1 -1 -2 +1 0 0 -2 -2 -4] · 61'-75' [-6 -6 -4 -4 -2 0 +1 0 -2 -1 -2 -1 0 -3 -5] · 76'-90' [+1 +2 +3 +9 +8 +10 +4 +1 -2 -1 0 -1 0 -1 0] · 91'+ [-1 0 0 +4 +4 +7 +7 +7 +17 +17 +12 +11]
    ⚽ gols: 83'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **4** · 31'-45' **3** ‖ 46'-60' **6** · 61'-75' **2** · 76'-90' **1**
  - @ Newcastle United (FORA · D 1-3) — min 1→96:
    📈 pressão (net/min): 1'-15' [-1 -2 +2 +2 -2 -7 -4 -4 -2 -4 -3 -7 -7 -7 -10] · 16'-30' [-4 -4 -4 -5 -4 -4 -2 -1 -1 -3 -2 -2 -2 +6 +6] · 31'-45' [+8 +7 +7 +8 +8 +8 +3 0 -2 -2 -2 -2 0 -3 +1] · ‖INTERVALO‖ · 46'-60' [+1 +1 +1 +2 -1 +1 +1 +1 +1 +1 +4 -1 -1 0 0] · 61'-75' [0 +1 +2 +2 -2 -4 -3 -4 -1 0 -4 -4 +1 +1 +3] · 76'-90' [+6 +5 +2 -1 -1 +2 +3 +5 +6 +7 +5 +3 0 +1 0] · 91'+ [-2 -2 0 0 +2 -1]
    ⚽ gols: 15'✗ 19'✗ 65'✗ 69'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **2** · 31'-45' **4** ‖ 46'-60' **5** · 61'-75' **3** · 76'-90' **10**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.24 · 16-30: 0.08 · 31-45: 0.24 · 46-60: 0.11 · 61-75: 0.19 · 76-90: 0.3
- Sofre por faixa (/j): 0-15: 0.3 · 16-30: 0.11 · 31-45: 0.3 · 46-60: 0.27 · 61-75: 0.38 · 76-90: 0.41
- 1ºT: marca 21 / sofre 26 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (43): **9 de bola parada (21%)** — escanteio 4 · falta 2 · pênalti 3 · contra-ataque 5 · jogo corrido 24 · sem narração 5
- Gols sofridos (65): **17 de bola parada (26%)** — escanteio 11 · falta 0 · pênalti 6 · contra-ataque 2 · jogo corrido 35 · sem narração 11
- Escanteios: **4.9 a favor / 6.1 contra por jogo** (média da liga: 5 por time)

### Desfalques de West Ham United neste jogo
- **Adama Traoré** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/3 gols = **0%** (≈ estável); with/without: com ele 1.44 g/j (9j) vs sem ele 1.07 g/j (28j) = −26%; finaliza **0 SoT/jogo** (time: 3.67 SoT/j com ele vs 3.64 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0.1 desarmes/j · 0.8 duelos ganhos/j · 0.2 cruz. certos/j · 0.7 dribles certos/j · 0 key passes/j
- **Lukasz Fabianski** (Back Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/3 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.16 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Leeds United (visita) — até 2026-05-24

### Gols & finalização (season)
- Total **49 marcados / 53 sofridos** em 37j · média **1.32 marca / 1.43 sofre** por jogo
- **Fora (18j): marca 1.11 / sofre 1.78** (20 gols) · por tempo: 1ºT 0.65/0.43 · 2ºT 0.68/1
- **Finalização: 150 SoT (4.05/j · fora 3.61/j) · conv 29%** (aberta, −6 pên) · sofre 4.24 SoT/j (adv 30%) · 8.7 KP/j
- **Volume: 12.6 chutes/j (8.6 na área) · 2.4 big chances/j** · posse 45.4%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 44.1/51.5 · chutes pra fora 5/4.6 · bloqueados 3.6/3.7 · de fora da área 4/4.1
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 38.6/58.4 · chutes pra fora 5.2/4.6 · bloqueados 3/4.4 · de fora da área 3.6/3.2

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.82**
  - **Ethan Ampadu** nota **7.01** (season) · forma 7.08= (últ.5 do time: 7→7→6.7→7.5→7.2 📈 subindo) · 2× MOTM · 39j
    ↳ **1G+1A** · gols aos 60' — mais no 2ºT · 0.54 KP/j (últ.5: 0.4↓) · 0.18 SoT/j (últ.5: 0↓) · 0.36 dribles/j · def: 2.33 desarme + 1.56 int + 5.33 duelo/j · 0.23 cruz/j · ~89 min/j
  - **Pascal Struijk** nota **6.89** (season) · forma 6.58↓ (últ.5 do time: 7.2→5.9→6.1→7.1→– ➡️ estável) · **faltou 1/5** · 36j
    ↳ **0G+1A** · 0.44 KP/j (últ.5: 0.4=) · 0.17 SoT/j (últ.5: 0↓) · 0.14 dribles/j · def: 1.14 desarme + 0.92 int + 5.17 duelo/j · ~85 min/j
  - **Jayden Bogle** nota **6.61** (season) · forma 6.77↑ (últ.5 do time: 6.4→6.7→7.2→–→– 📈 subindo) · **faltou 2/5** · 38j
    ↳ **2G+3A** · gols aos 26',81' · 0.63 KP/j (últ.5: 1.2↑) · 0.13 SoT/j (últ.5: 0↓) · 0.58 dribles/j · def: 1.84 desarme + 0.97 int + 3.89 duelo/j · 0.39 cruz/j · ~79 min/j
  - **Joe Rodon** nota **6.75** (season) · forma 6.66= (últ.5 do time: 6.5→6.5→6.5→6.9→6.9 📈 subindo) · 36j
    ↳ **2G+0A** · gols aos 15',37' · 0.27 KP/j (últ.5: 0.8↑) · 0.22 SoT/j (últ.5: 0.6↑) · 0.05 dribles/j · def: 0.97 desarme + 0.86 int + 3.86 duelo/j · 0.08 cruz/j · ~81 min/j
  - ⚠️(fora) **Gabriel Gudmundsson** nota **6.71** (season) · forma 6.8= (últ.5 do time: 6.9→6.7→–→–→– ⚠️ poucos jogos na janela) · **faltou 3/5** · 3× MOTM · 35j
    ↳ **1G+1A** · gols aos 43' · 0.71 KP/j (últ.5: 0.4↓) · 0.11 SoT/j (últ.5: 0↓) · 1.11 dribles/j · def: 2.11 desarme + 1.03 int + 5.57 duelo/j · 0.77 cruz/j · ~83 min/j
  - **Dominic Calvert-Lewin** nota **6.89** (season) · forma 6.92= (últ.5 do time: 6.5→6.6→7.2→6.9→7.4 📈 subindo) · 3× MOTM · 38j
    ↳ **15G+1A** · gols aos 31',38',45',45',47',49',49',56',72',73'… — mais no 2ºT · 0.53 KP/j (últ.5: 0.4↓) · 1 SoT/j (últ.5: 0.8=) · 0.26 dribles/j · def: 0.29 desarme + 0.11 int + 5.11 duelo/j · 0.03 cruz/j · ~76 min/j
  - **Brenden Aaronson** nota **6.73** (season) · forma 6.72= (últ.5 do time: 7→6.8→6.6→6.5→6.7 📉 caindo) · 2× MOTM · 40j
    ↳ **4G+5A** · gols aos 3',32',62',79' · 0.88 KP/j (últ.5: 0.8=) · 0.44 SoT/j (últ.5: 0.4=) · 0.83 dribles/j · def: 1.46 desarme + 0.41 int + 4.22 duelo/j · 0.29 cruz/j · ~64 min/j
  - ⚠️(fora) **Anton Stach** nota **7.21** (season) · forma 7.18= (últ.5 do time: –→7→8→6.6→7.1 📉 caindo) · **faltou 1/5** · 5× MOTM · 33j
    ↳ **5G+3A** · gols aos 8',31',39',75',90' · 1.97 KP/j (últ.5: 1↓) · 0.47 SoT/j (últ.5: 0.6↑) · 0.68 dribles/j · def: 2.09 desarme + 0.65 int + 4.85 duelo/j · 1.47 cruz/j · ~74 min/j
  - **Jaka Bijol** nota **7** (season) · forma 7.04= (últ.5 do time: 6.9→6.7→7.2→7.4→7 📈 subindo) · 2× MOTM · 30j
    ↳ **1G+3A** · gols aos 6' · 0.3 KP/j (últ.5: 0.4↑) · 0.2 SoT/j (últ.5: 0↓) · 0.1 dribles/j · def: 1.07 desarme + 1.1 int + 4.97 duelo/j · ~79 min/j
  - **James Justin** nota **6.9** (season) · forma 6.82= (últ.5 do time: 6.8→6.3→7.1→7.2→6.7 📈 subindo) · 30j
    ↳ **3G+1A** · gols aos 18',28',90' · 0.36 KP/j (últ.5: 0.2↓) · 0.24 SoT/j (últ.5: 0.2=) · 0.09 dribles/j · def: 1.79 desarme + 0.97 int + 4.3 duelo/j · 0.18 cruz/j · ~65 min/j
  - **Karl Darlow** nota **6.83** (season) · forma 7.2↑ (últ.5 do time: 7.3→–→6.7→6.5→8.3 📈 subindo) · **faltou 1/5** · 1× MOTM · 23j
    ↳ **1G+0A** · gols aos 63' — mais no 2ºT · 0 KP/j (últ.5: 0=) · 0 SoT/j (últ.5: 0=) · 0.04 dribles/j · def: 0.04 desarme + 0 int + 0.61 duelo/j · ~91 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VEVEV** (11pts) · **10 feitos / 4 sofridos** · marca 2↑ / sofre 0.8↓ g/j · SoT 4.4 feito / 4.6 sofrido
- **Consistência: MARCOU em 26/37** (casa 14/19 · fora 12/18) · não-marcou 11 · clean sheet 8 · BTTS 22/37
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **AFC Bournemouth** (fora · **Empate 2-2**, HT 0-0) — 3-7 SoT · posse 47%/40% (1ºT/2ºT) · adv 9º salvo · você 15º briga-Z · seu fora até ali 1.1 marca/1.8 sofre
- @ **Chelsea** (fora · **Derrota 0-1**, HT 0-1) — 3-2 SoT · posse 23%/40% (1ºT/2ºT) · 🏆 FA Cup
- vs **Burnley** (casa · **Vitória 3-1**, HT 1-0) — 8-3 SoT · posse 71%/55% (1ºT/2ºT) · adv 19º REBAIX. · você 15º briga-Z · seu casa até ali 1.5 marca/1.2 sofre
- @ **Tottenham Hotspur** (fora · **Empate 1-1**, HT 0-0) — 4-3 SoT · posse 38%/43% (1ºT/2ºT) · adv 17º briga-Z · você 16º briga-Z · seu fora até ali 1.1 marca/1.8 sofre
- vs **Brighton & Hove Albion** (casa · **Vitória 1-0**, HT 0-0) — 1-8 SoT · posse 38%/35% (1ºT/2ºT) · adv 7º briga-top · você 14º salvo/s-alvo · seu casa até ali 1.6 marca/1.2 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Wolverhampton Wanderers (CASA · V 3-0) — min 1→102:
    📈 pressão (net/min): 1'-15' [+1 +4 +4 0 -2 +1 0 0 +1 +5 +4 +2 +2 +3 +6] · 16'-30' [+8 +2 +2 +2 +6 +9 +7 +6 +5 +3 0 +3 -1 -5 -5] · 31'-45' [-3 -2 0 +2 +2 -2 -3 -3 -3 -6 -5 -5 -3 -2 0] · ‖INTERVALO‖ · 46'-60' [+3 -2 -1 -1 -1 -2 -4 -4 -1 0 0 -1 -2 -1 -1] · 61'-75' [+1 +1 0 -7 -7 -4 -2 0 0 0 -3 -3 -3 -2 -2] · 76'-90' [0 +1 +1 +1 +1 +1 +1 +1 +3 +3 +2 +3 +2 +2 +2] · 91'+ [+3 0 +1 0 +5 +5 +5 +3 +2 -1 +2 +1]
    ⚽ gols: 18'✓ 20'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **5** · 31'-45' **6** ‖ 46'-60' **2** · 61'-75' **6** · 76'-90' **4**
  - @ AFC Bournemouth (FORA · E 2-2) — min 1→98:
    📈 pressão (net/min): 1'-15' [+1 +3 +1 +1 -3 -1 -2 -3 -1 -3 -2 -3 0 +1 -2] · 16'-30' [-2 -1 +2 +2 +2 -1 -2 -3 -3 -3 +2 0 -2 +1 +1] · 31'-45' [-1 -5 -6 -6 -7 -9 -5 -5 -2 -2 0 +1 -7 -7 -4] · ‖INTERVALO‖ · 46'-60' [+1 0 0 0 +1 0 -2 -1 -4 -7 -12 -12 -7 -9 -6] · 61'-75' [-9 -6 -1 -1 -2 +1 +1 +3 +6 +7 +7 +5 +6 +3 -3] · 76'-90' [-3 -7 -9 -4 -6 -7 -3 -2 -1 -2 -6 -7 -3 -5 -5] · 91'+ [-8 -33 -21 -14 -9 -6 -2 -2]
    ⚽ gols: 60'✗ 68'✓ 85'✗ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **8** · 16'-30' **5** · 31'-45' **4** ‖ 46'-60' **1** · 61'-75' **3** · 76'-90' **7**
  - vs Burnley (CASA · V 3-1) — min 1→99:
    📈 pressão (net/min): 1'-15' [+3 +3 +2 +1 +1 +2 +5 +6 +4 +3 +3 +4 +4 +3 +3] · 16'-30' [+3 +1 +2 +2 +4 +3 +4 +7 +6 +4 +3 +5 +1 +1 0] · 31'-45' [+1 -1 0 -1 -4 -2 -1 +1 +1 +2 +3 -1 -1 -1 -2] · ‖INTERVALO‖ · 46'-60' [+1 0 0 -2 0 +3 +6 +6 +11 +8 +8 +12 +9 +9 +6] · 61'-75' [+4 +5 +6 +5 +5 +5 +2 -2 -4 -1 0 -3 -2 -2 +4] · 76'-90' [+4 +4 +10 +5 +6 +4 +2 +2 +1 +4 +6 +2 -1 0 0] · 91'+ [0 0 0 0 -2 -5 -8 -7 -4]
    ⚽ gols: 8'✓ 52'✓ 56'✓ 71'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **5** · 31'-45' **1** ‖ 46'-60' **5** · 61'-75' **5** · 76'-90' **4**
  - @ Tottenham Hotspur (FORA · E 1-1) — min 1→105:
    📈 pressão (net/min): 1'-15' [+2 +1 +1 +1 0 -3 -4 -4 -3 -3 -3 -2 -2 -5 -8] · 16'-30' [-6 -7 -4 -2 -1 +5 +4 +3 0 +2 +2 -2 -2 -5 -4] · 31'-45' [-2 -2 -4 -2 -3 -8 -9 -6 -7 -3 -2 -1 -2 -3 0] · ‖INTERVALO‖ · 46'-60' [-3 -2 -2 -1 -1 -1 -3 -2 -1 -1 0 -1 -3 -9 -5] · 61'-75' [-2 +2 +1 +1 0 0 -1 +3 +3 +3 +3 +3 +3 +6 +8] · 76'-90' [+8 +4 +3 +5 +3 +6 +3 +2 +3 +3 +2 +3 +2 +1 +1] · 91'+ [-1 -6 -8 -5 -4 -5 -4 -5 -1 +5 +7 +4 +2 +2 -3]
    ⚽ gols: 50'✗ 74'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **9** · 16'-30' **2** · 31'-45' **6** ‖ 46'-60' **5** · 61'-75' **3** · 76'-90' **7**
  - vs Brighton & Hove Albion (CASA · V 1-0) — min 1→100:
    📈 pressão (net/min): 1'-15' [0 +1 -2 -1 +1 -2 -3 -2 -1 0 0 +1 -2 -1 -2] · 16'-30' [-1 +4 +2 0 -3 -3 -9 -8 -7 -4 0 +2 +5 +4 +6] · 31'-45' [+4 +4 +2 0 0 -1 -2 -2 -1 -1 +1 +1 -1 -2 -6] · ‖INTERVALO‖ · 46'-60' [-2 -1 +1 -1 -3 -6 -7 -6 -4 -6 -10 -5 -6 -6 -5] · 61'-75' [-7 -5 -2 -1 -1 -1 -3 -2 -3 -2 +2 +1 +1 +1 -1] · 76'-90' [0 -3 -3 -9 -9 -11 -6 -4 -4 -3 -4 -6 -6 -8 -8] · 91'+ [-7 -4 -2 -1 -1 +2 +3 -1 -2 -3]
    ⚽ gols: 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **1** · 31'-45' **3** ‖ 46'-60' **1** · 61'-75' **3** · 76'-90' **9**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.19 · 16-30: 0.16 · 31-45: 0.3 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.24
- Sofre por faixa (/j): 0-15: 0.11 · 16-30: 0.19 · 31-45: 0.14 · 46-60: 0.3 · 61-75: 0.3 · 76-90: 0.41
- 1ºT: marca 24 / sofre 16 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (49): **16 de bola parada (33%)** — escanteio 5 · falta 5 · pênalti 6 · contra-ataque 1 · jogo corrido 20 · sem narração 12
- Gols sofridos (53): **11 de bola parada (21%)** — escanteio 4 · falta 1 · pênalti 6 · contra-ataque 1 · jogo corrido 33 · sem narração 8
- Escanteios: **4.4 a favor / 5.1 contra por jogo** (média da liga: 5 por time)

### Desfalques de Leeds United neste jogo
- **Noah Okafor** (Calf Injury) — 8 gols + 1 assists até a data; season: **16% dos gols** do time (18% com assists); **últimos 5 jogos do time**: participou de 3/10 gols = **30%** (↑ mais decisivo AGORA); with/without: com ele 1.61 g/j (28j) vs sem ele 0.44 g/j (9j) = −73%; finaliza **0.54 SoT/jogo** (time: 4.39 SoT/j com ele vs 3 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.4 interceptações/j** (~4% do time) · 0.8 desarmes/j · 3.1 duelos ganhos/j · 0.3 cruz. certos/j · 1.4 dribles certos/j · 0.7 key passes/j
- **Anton Stach** (Ankle Injury) — 5 gols + 3 assists até a data; season: **10% dos gols** do time (16% com assists); **últimos 5 jogos do time**: participou de 1/10 gols = **10%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.1 g/j (29j) vs sem ele 2.13 g/j (8j) = +94%; finaliza **0.48 SoT/jogo** (time: 3.9 SoT/j com ele vs 4.63 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.7 interceptações/j** (~8% do time) · 2.2 desarmes/j · 5.3 duelos ganhos/j · 1.6 cruz. certos/j · 0.7 dribles certos/j · 2.2 key passes/j
- **Ilia Gruev** (Unknown Injury) — 0 gols + 3 assists até a data; season: **0% dos gols** do time (6% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.52 g/j (23j) vs sem ele 1 g/j (14j) = −34%; finaliza **0.04 SoT/jogo** (time: 3.96 SoT/j com ele vs 4.21 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.7 interceptações/j** (~7% do time) · 1 desarmes/j · 2.3 duelos ganhos/j · 0.2 cruz. certos/j · 0.3 dribles certos/j · 0.5 key passes/j
- **Gabriel Gudmundsson** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 1.34 g/j (32j) vs sem ele 1.2 g/j (5j) = −10%; finaliza **0.09 SoT/jogo** (time: 4.03 SoT/j com ele vs 4.2 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.9 interceptações/j** (~10% do time) · 2 desarmes/j · 5.6 duelos ganhos/j · 0.7 cruz. certos/j · 1.2 dribles certos/j · 0.7 key passes/j

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**West Ham United atacando × Leeds United defendendo**
| Faixa | West Ham United marca/j | Leeds United sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.24 | 0.11 | 0.35 |
| 16-30 | 0.08 | 0.19 | 0.27 |
| 31-45 | 0.24 | 0.14 | 0.38 |
| 46-60 | 0.11 | 0.3 | 0.41 |
| 61-75 | 0.19 | 0.3 | 0.49 |
| 76-90 | 0.3 | 0.41 | 0.71 |

**Leeds United atacando × West Ham United defendendo**
| Faixa | Leeds United marca/j | West Ham United sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.19 | 0.3 | 0.49 |
| 16-30 | 0.16 | 0.11 | 0.27 |
| 31-45 | 0.3 | 0.3 | 0.6 |
| 46-60 | 0.19 | 0.27 | 0.46 |
| 61-75 | 0.24 | 0.38 | 0.62 |
| 76-90 | 0.24 | 0.41 | 0.65 |

### Cruzamento de MOMENTUM (fluxo minuto-a-minuto dos últimos 5, já cruzado pra você)
A curva de momentum foi digerida e CRUZADA em código — não precisa cruzar 90 pontos na mão, use a conclusão abaixo (quem domina cada janela) junto com o cruzamento de gols acima.

**Janela de gol provável pela curva de momentum** — West Ham United: **46-60** (domínio +3.7) · Leeds United: **0-15** (domínio -3.3). Cruze com o timing de gols e com a intenção: se a janela de quem PRECISA do gol coincide com a fraqueza do outro, é ali que o gol tende a sair.

| Faixa | West Ham United domínio/j | Leeds United domínio/j | cruzamento |
|---|---|---|---|
| 0-15 | -3 | +0.3 | -3.3 ✈️ |
| 16-30 | -0.4 | +0.7 | -1.1 ≈ |
| 31-45 | +0.8 | -2.2 | +3 🏠 |
| 46-60 | +2.4 | -1.3 | +3.7 🏠 |
| 61-75 | -0.5 | +0.2 | -0.7 ≈ |
| 76-90 | -0.2 | -1.3 | +1.1 ≈ |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ West Ham United (casa) = 1.55 · λ Leeds United (fora) = 1.51 · total = 3.06

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- West Ham United: λ_SoT 3.89 × conv 30% → **1.17 gols**
- Leeds United: λ_SoT 4.44 × conv 29% → **1.29 gols**
- total via SoT = 2.46
- **Índice de volume do jogo**: λ_SoT total 8.3 vs média da liga 8.5 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson corrigido por **Dixon-Coles** sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 37/27/36% | 32/31/38% |
| Over 1.5 | 82% | 72% |
| Over 2.5 | 59% | 45% |
| Over 3.5 | 37% | 23% |
| BTTS | 63% | 52% |

**Mercados derivados do MESMO grid corrigido** (Rota B — já coerentes entre si; use como prior destes mercados):
- **Dupla chance**: 1X **62%** · 12 **69%** · X2 **68%** · **Draw No Bet** casa 46% / fora 54%
- **Placar exato (mais prováveis)**: 1-1 15% · 0-0 10% · 0-1 9% · 1-0 8%
- **Odd/Even**: ímpar 46% / par 54% · **Multigoals**: 0-1 28% · 2-3 49% · 4+ 23%
- **Team totals** (marginais do λ da Rota B — a prob de CADA time marcar; base do `team_total`): West Ham United over 0.5 **69%** / over 1.5 **33%** · Leeds United over 0.5 **72%** / over 1.5 **37%**
- **Fair odds no-vig (1x2, calculadas pelo grid — não pelo mercado)**: casa 3.14 · empate 3.27 · fora 2.66. São PROBABILIDADE JUSTA, não veredito de valor (sem odds do mercado ingeridas não há EV/CLV — não prometa "aposta certa").
- ⚠️ O grid Dixon-Coles JÁ corrige o empate pra cima (o Poisson independente o subestima). **O empate / dupla chance é pick LEGÍTIMO** quando o prior aqui aponta — NÃO o rebaixe por covardia; num jogo travado de poucos gols o X costuma ser o de MENOR variância com valor.

**Baseline da liga (1ºT/2ºT):** 43% dos gols saem no 1º tempo / 57% no 2º (sobre 370 jogos jogados). Use como referência pra dizer se um time é ANÔMALO no timing (o padrão da literatura é ~44/56 — 2º tempo mais goleador por fadiga/game-state).
**Baseline por faixa de 15min (% dos gols da liga):** 0-15: 12% · 16-30: 11% · 31-45: 21% · 46-60: 15% · 61-75: 16% · 76-90: 26%. É a curva NORMAL — compare o timing de cada time (bloco "Distribuição de gols por faixa") contra ela; desvio grande (marca/sofre muito mais que a liga numa janela) é o sinal de onde o gol tende a sair NESTE jogo.

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **27/42/31%** · 2ºT **28/41/32%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= West Ham United) e `away` (= Leeds United), cada um com:
- `xg` (total), `xg_1t`, `xg_2t` e **`xg_bands`** = o xG nas 6 faixas de 15 min (`"0-15"`,`"16-30"`,`"31-45"`,`"46-60"`,`"61-75"`,`"76-90"`). Dê a distribuição APROXIMADA pelo cruzamento ataque×defesa por faixa — **NÃO gaste raciocínio conferindo a soma**: o runtime normaliza as bands pra somar `xg` (e o 1ºT = 3 primeiras).
  - **FORMA da curva (não só o total):** parta do baseline da liga (~44% no 1ºT / 56% no 2ºT, pico em `"76-90"`). Sem os dois empurrando, siga o baseline; um jogo travado/administrado NÃO tem o surto tardio — não force massa no fim. Mata-mata/decisão/derby REDUZ o 1ºT (share ~35-39%, cautela tática).
- `summary` (PT) = leitura CURTA daquele time (1-2 frases): motivação de tabela, desfalque que pesa, mando, e como isso move o xG dele.

**Geral** (`general`) — agregados do jogo:
- `total`, `total_1t`, `total_2t`, `over25_prob`, `btts_prob`.
- **1x2 (home/draw/away)** em 3 recortes: `one_x_two` (jogo 90min), `one_x_two_1t` (1º tempo), `one_x_two_2t` (2º tempo isolado). PARTA dos priors "1x2 por tempo" acima e mova pelo roteiro / fator nomeado.
- `confidence` ∈ {low, medium, high} e `summary` (PT) = 1 parágrafo do jogo + a maior incerteza.

No topo: `drivers` = os 3 fatores (frases em PT) que mais moveram o número.

**`best_bet`** — a sua leitura de APOSTADOR (a DECISÃO, em campos SEPARADOS; **não** escreva o nome do time, ele sai de `selection`/`team`):
- `market`: `"1x2"` | `"over_under"` | `"btts"` | `"handicap"` | `"team_total"` | `"double_chance"` | `"draw_no_bet"` | `"odd_even"` — crave SEMPRE o de **maior valor**, o que o ROTEIRO mais favorece. **`double_chance`/`draw_no_bet`** são as opções de MENOR variância pra proteger um lado ou bancar o empate/azarão sólido — use os priors de "Mercados derivados" acima (já saem do grid Dixon-Coles corrigido) — **OBRIGATÓRIO escolher um mercado; NUNCA "passar"/"sem aposta". Mesmo no jogo mais imprevisível existe o mercado de MENOR risco; é esse que você crava.** **Em jogo assimétrico, handicap ou total-do-time costumam pagar MAIS que o O/U do jogo**: se o mandante atropela mas o visitante pode marcar de bola parada, "mandante `handicap` -1" ou "mandante `team_total` over 1.5" captura o cenário sem depender do total exato. NÃO se ancore por default no O/U 2.5. **MENOR variância**: quando o mandante MARCA em casa com alta frequência (vide Consistência) E o visitante está DESENGAJADO (nada em jogo na tabela), `team_total` over 0.5/1.5 do mandante ganha sem depender de vitória (que um empate nega) NEM de BTTS (que depende do visitante desinteressado marcar) — costuma ser a leitura mais segura.
- **⛔ ANTI-REFLEXO DE OVER/UNDER (regra dura):** `over_under` NÃO é o default. Antes de cravá-lo, PERGUNTE: o mercado de RESULTADO/menor-variância não paga melhor aqui? **Se o empate do grid Dixon-Coles está alto (≥ ~30%) e o jogo é equilibrado/de poucos gols (λ total baixo), o pick de valor costuma ser `double_chance` (1X/X2), `draw_no_bet`, ou o próprio EMPATE — NÃO o under reflexo.** Um jogo 1-1/0-0 provável é onde a dupla chance e o empate ganham; cravar "under 2.5" ali joga fora o valor do resultado. Só vá de `over_under` quando o TOTAL for de fato a leitura de maior valor (roteiro de gols claro), não por hábito.
- **DISCIPLINA DE VARIÂNCIA (regra de escolha — aplique ANTES de cravar):** entre mercados de valor parecido, crave SEMPRE o de MENOR variância. Do mais seguro ao mais arriscado: **(1)** `team_total` over 0.5 ("time marca" — ganha com UM gol; a trava quando o time marca com alta frequência no mando, vide Consistência) → **(2)** `double_chance` (1X/X2 — ganha em DOIS dos três resultados; a trava pra bancar favorito sólido OU proteger contra o empate num jogo equilibrado) · `draw_no_bet` (empate devolve a aposta — risco menor que 1x2) · `team_total` over 1.5 ou `handicap` de favorito claro (dependem de UM time, não do placar exato) → **(3)** `over_under` — **a LINHA é a alavanca de variância; NÃO fique preso no 2.5.** xG 2.3 → "under 3.5" é quase trava (margem enorme), "under 2.5" é apertado; xG 3.2 → "over 2.5" tem folga, "over 1.5" é mais seguro ainda. Escolha a linha (1.5, 2, 2.5, 3, 3.5…) com MARGEM real pro xG; linha colada no xG (margem < 0.3) é cara-ou-coroa → afaste a linha ou troque de mercado → **(4)** `1x2` (o empate nega; só com vitória nítida) → **(5)** `btts` é o MAIS ARRISCADO (depende dos DOIS marcarem). **NUNCA aposte `btts` quando um lado está DESENGAJADO** (já salvo / sem alvo / rebaixado) — ele é o elo fraco que pode não marcar (é assim que se perde BTTS num 1-0; prefira "o lado forte marca" via `team_total`). A **anti-timidez é sobre o TAMANHO do xG** (não ancore tímido na média), **NÃO sobre escolher o mercado mais arriscado**: convicção na leitura, DISCIPLINA no mercado.
- **COERÊNCIA com a INTENÇÃO (a aposta NÃO pode contradizer seu próprio roteiro):** se você leu que um time **administra / se contenta com o empate / já está garantido** — mesmo jogando EM CASA —, **NÃO banque o `team_total` ALTO dele** (over 1.5+): time satisfeito marca pra se garantir (no MÁXIMO over 0.5), NÃO pra golear. `team_total` over 1.5 é só pra time que PRECISA de gols (motivado, indo pra cima). Do mesmo jeito, não banque over agressivo num jogo que você mesmo descreveu como administrado/morno pelos dois lados. Se a aposta brigar com o roteiro, a aposta está errada — não o roteiro.
- **SIGA O "VEREDITO DE INTENÇÃO" (banner no bloco de motivação) — foi o filtro que MAIS separou acerto de erro no backtest:**
  - **🔥 os dois precisam ir pra cima** (nenhum se contenta com empate) → o jogo abre; over / handicap de quem ataca / `team_total` over 1.5 ganham peso — é o cenário onde a aposta de gol acerta.
  - **⚠️ assimétrica / trava** (≥1 lado administra, está garantido, rebaixado, sem alvo, ou **"empate basta"**) → **NÃO** crave over alto, goleada, nem handicap de mando por inércia estatística. O lado que PRECISA muitas vezes **não fura o ferrolho** (vira 1-0 / 1-1) e quem administra segura o jogo. Prefira **under** (numa linha com margem) OU o mercado de **MENOR variância**: `team_total` over 0.5 do lado que precisa, ou `1x2`/dupla-chance do lado motivado JOGANDO EM CASA — **nunca** banque o favorito motivado pra GOLEAR quem só defende (é a perda clássica). Aqui **rebaixe a confiança pra no máximo `medium`**.
- `selection`: 1x2 → `"home"`/`"draw"`/`"away"` · over_under → `"over"`/`"under"` · btts → `"yes"`/`"no"` · **handicap** → o time bancado `"home"`/`"away"` · **team_total** → `"over"`/`"under"` · **double_chance** → `"home_draw"` (1X) / `"draw_away"` (X2) / `"home_away"` (12) · **draw_no_bet** → o time bancado `"home"`/`"away"` · **odd_even** → `"odd"`/`"even"`.
- `team`: SÓ em `team_total` — de qual time é o total (`"home"`/`"away"`); `null` nos demais mercados.
- `line`: over_under → **a linha que melhor casa com o xG e a variância (1.5, 2, 2.5, 3, 3.5… — NÃO se limite a 2.5)** · handicap → o hcap do time bancado (-1, -1.5, +1) · team_total → linha de gols do time (0.5, 1.5…) · `null` em 1x2/btts.
- `confidence`: `"low"` | `"medium"` | `"high"` · `probability`: sua prob (0-1) do evento.
- `analysis` (PT): análise COMPLETA e profissional — não um resumo. Comece pelo **ROTEIRO esperado** (o filme do jogo + a cascata condicional), junte o que sustenta a aposta (mando, motivação, momento/forma, desfalques, volume/conversão) e o que pode virar contra (o risco). **Sempre crave o melhor mercado**; se o edge for fino, escolha mesmo assim com `confidence` baixa, explicando a margem. **NUNCA** escreva na análise que é melhor "não apostar", "evitar", "passar" ou "esperar" — a saída tem SEMPRE uma recomendação concreta e acionável.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (o grafo de raciocínio / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
