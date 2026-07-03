# Prognóstico de expected goals — Sunderland x Chelsea

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
- Local: Stadium of Light, Sunderland (grass)
- Clima: scattered clouds · 21°C (sens. 20.6°C) · vento 2.8 m/s · umidade 55% · nuvens 41% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: Sunderland 7 dias (último: liga, 2026-05-17) · Chelsea 5 dias (último: liga, 2026-05-19)
- Viagem do visitante: ~390 km
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Sunderland: 10º, 51 pts · Chelsea: 8º, 52 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Sunderland: 10º, 51 pts, 1 jogo(s) restante(s) (máx possível 54 pts)
  - já SEGURO do rebaixamento.
  - vaga europeia ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga europeia
  - Chelsea: 8º, 52 pts, 1 jogo(s) restante(s) (máx possível 55 pts)
  - já SEGURO do rebaixamento.
  - vaga europeia ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga europeia
  - disputa pela vaga (8º): o Chelsea **precisa vencer** pra travar (empate ainda deixa 2 rival vivo). Quem ainda ameaça → Brentford (9º, 52 pts, máx 55) pode **passar em pontos** — vencendo, se o Chelsea tropeçar; Sunderland (10º, 51 pts, máx 54) pode **passar em pontos** — vencendo, se o Chelsea tropeçar; Newcastle United (11º, 49 pts, máx 52) empata em pontos mas está **-7 de saldo** (+0 vs +7) — só passa se o Chelsea perder por muito E ele vencer por muito (virar 7); Everton (12º, 49 pts, máx 52) empata em pontos mas está **-9 de saldo** (-2 vs +7) — só passa se o Chelsea perder por muito E ele vencer por muito (virar 9); Fulham (13º, 49 pts, máx 52) empata em pontos mas está **-13 de saldo** (-6 vs +7) — só passa se o Chelsea perder por muito E ele vencer por muito (virar 13)

🔥 **VEREDITO DE INTENÇÃO: OS DOIS PRECISAM IR PRA CIMA** (nenhum se contenta com empate) → o jogo tende a ABRIR. Over / handicap de quem ataca / team_total GANHAM peso — aposta de gol é COERENTE aqui.

## H2H — confronto direto Sunderland × Chelsea (liga 2 seasons + copas, até 2026-05-24)
**Retrospecto (1 confronto na janela ingerida, ótica do Sunderland): 1V 0E 0D · gols 2-1** · over 2.5 em 1/1 · BTTS em 1/1
- 2025-10-25 · @ **Chelsea** (fora · **Vitória 2-1**, HT 1-1) — SoT 4-7
**Último confronto (o precedente mais parecido com ESTE jogo):** 2025-10-25 · @ **Chelsea** (fora · **Vitória 2-1**, HT 1-1) — SoT 4-7
  - Gols: 4' Alejandro Garnacho (Chelsea) · 22' Wilson Isidor (Sunderland) · 90' Chemsdine Talbi (Sunderland)
_Use como PRECEDENTE, não como destino: cite a DATA (técnico/elenco podem ter mudado desde então) e pese o MANDO — o jogo do turno foi na casa do outro. Par que trava (under/poucos SoT recorrentes) ou freguesia recorrente é sinal; 1 jogo isolado não é._

## Sunderland (manda) — até 2026-05-24

### Gols & finalização (season)
- Total **40 marcados / 47 sofridos** em 37j · média **1.08 marca / 1.27 sofre** por jogo
- **Em casa (18j): marca 1.28 / sofre 1.06** (23 gols) · por tempo: 1ºT 0.32/0.62 · 2ºT 0.76/0.65
- **Finalização: 125 SoT (3.38/j · casa 3.5/j) · conv 29%** (aberta, −4 pên) · sofre 4.65 SoT/j (adv 26%) · 6.95 KP/j
- **Volume: 10.1 chutes/j (7.2 na área) · 1.7 big chances/j** · posse 44.9%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 44.8/55.9 · chutes pra fora 3.9/5.5 · bloqueados 2.9/4.4 · de fora da área 3/5.1
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 51.8/45 · chutes pra fora 3.6/4.8 · bloqueados 3.6/3.4 · de fora da área 3.8/5

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.79**
  - **Robin Roefs** nota **6.97** (season) · forma 6.5↓ (últ.5 do time: 5.8→5.2→7.6→7→6.9 📈 subindo) · 3× MOTM · 36j
    ↳ 0.11 KP/j (últ.5: 0↓) · 0 SoT/j (últ.5: 0=) · 0.03 dribles/j · def: 0 desarme + 0 int + 0.97 duelo/j · ~91 min/j
  - **Enzo Le Fée** nota **7.07** (season) · forma 7.46↑ (últ.5 do time: 8.2→6.3→6.7→7.7→8.4 📈 subindo) · 6× MOTM · 39j
    ↳ **6G+6A** · gols aos 30',30',33',76',81',82' — 3 tardios (76'+) · 1.77 KP/j (últ.5: 2.2↑) · 0.33 SoT/j (últ.5: 0.8↑) · 0.44 dribles/j · def: 2.41 desarme + 0.85 int + 4.49 duelo/j · 0.87 cruz/j · ~84 min/j
  - **Trai Hume** nota **6.79** (season) · forma 6.74= (últ.5 do time: 7.3→6.2→6.8→6.9→6.5 ➡️ estável) · 39j
    ↳ **1G+1A** · gols aos 86' — mais no 2ºT · 0.69 KP/j (últ.5: 0.6=) · 0.21 SoT/j (últ.5: 0.2=) · 0.13 dribles/j · def: 1.77 desarme + 0.69 int + 4.74 duelo/j · 0.44 cruz/j · ~81 min/j
  - **Nordi Mukiele** nota **6.99** (season) · forma 6.76↓ (últ.5 do time: 6.3→6.2→7.4→7.2→6.7 📈 subindo) · 1× MOTM · 34j
    ↳ **3G+4A** · gols aos 16',17',61' · 0.71 KP/j (últ.5: 0.6=) · 0.18 SoT/j (últ.5: 0.2=) · 0.44 dribles/j · def: 2.03 desarme + 1.15 int + 5.59 duelo/j · 0.44 cruz/j · ~88 min/j
  - **Noah Sadiki** nota **6.71** (season) · forma 6.62= (últ.5 do time: 6.7→6→7.2→7→6.2 📈 subindo) · 34j
    ↳ **0G+1A** · 0.5 KP/j (últ.5: 1↑) · 0.15 SoT/j (últ.5: 0.2↑) · 0.88 dribles/j · def: 1.47 desarme + 1.03 int + 3.76 duelo/j · 0.12 cruz/j · ~87 min/j
  - **Granit Xhaka** nota **7.15** (season) · forma 7.22= (últ.5 do time: 6.5→6.9→8→7.8→6.9 📈 subindo) · 3× MOTM · 35j
    ↳ **1G+6A** · gols aos 46' — mais no 2ºT · 1.06 KP/j (últ.5: 1.2=) · 0.14 SoT/j (últ.5: 0↓) · 0.34 dribles/j · def: 1.46 desarme + 0.91 int + 4.49 duelo/j · 0.63 cruz/j · ~84 min/j
  - **Omar Alderete** nota **6.86** (season) · forma 6.54↓ (últ.5 do time: 6.1→6.2→6.8→7.2→6.4 📈 subindo) · 2× MOTM · 34j
    ↳ **1G+1A** · gols aos 38' · 0.29 KP/j (últ.5: 0↓) · 0.26 SoT/j (últ.5: 0.2↓) · 0.56 dribles/j · def: 1.06 desarme + 1.09 int + 4.53 duelo/j · 0.09 cruz/j · ~85 min/j
  - ⚠️(fora) **Dan Ballard** nota **6.86** (season) · forma 5.63↓ (últ.5 do time: 6.4→6.1→4.4→–→– 📉 caindo) · **faltou 2/5** · 1× MOTM · 31j
    ↳ **2G+0A** · gols aos 36',73' · 0.52 KP/j (últ.5: 0.4↓) · 0.35 SoT/j (últ.5: 0.4=) · 0.13 dribles/j · def: 1.1 desarme + 0.68 int + 5.84 duelo/j · 0.03 cruz/j · ~74 min/j
  - **Brian Brobbey** nota **6.69** (season) · forma 6.68= (últ.5 do time: 6.4→6.3→6.8→6.8→7.1 📈 subindo) · 31j
    ↳ **7G+1A** · gols aos 59',66',69',71',80',90',90' — mais no 2ºT, 3 tardios (76'+) · 0.48 KP/j (últ.5: 1↑) · 0.55 SoT/j (últ.5: 0.8↑) · 0.06 dribles/j · def: 0.29 desarme + 0 int + 3.48 duelo/j · ~62 min/j
  - **Reinildo Mandava** nota **6.74** (season) · forma 6.6= (últ.5 do time: 5.8→6.5→6.6→7.2→6.9 📈 subindo) · 24j
    ↳ **0G+1A** · 0.25 KP/j (últ.5: 0.4↑) · 0 SoT/j (últ.5: 0=) · 0.63 dribles/j · def: 1.54 desarme + 1.25 int + 4.88 duelo/j · 0.17 cruz/j · ~78 min/j
  - **Lutsharel Geertruida** nota **6.7** (season) · forma 7.3↑ (últ.5 do time: –→–→–→7.4→7.2 ⚠️ poucos jogos na janela) · **faltou 3/5** · 28j
    ↳ 0.28 KP/j (últ.5: 0.2↓) · 0.1 SoT/j (últ.5: 0.4↑) · 0.24 dribles/j · def: 1.34 desarme + 0.76 int + 2.28 duelo/j · 0.07 cruz/j · ~61 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VEEDD** (5pts) · **7 feitos / 11 sofridos** · marca 1.4↑ / sofre 2.2↑ g/j · SoT 4 feito / 5 sofrido
- **Consistência: MARCOU em 24/37** (casa 13/18 · fora 11/19) · não-marcou 13 · clean sheet 11 · BTTS 17/37
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- @ **Aston Villa** (fora · **Derrota 3-4**, HT 1-2) — 7-7 SoT · posse 47%/48% (1ºT/2ºT) · adv 4º briga-top · você 11º · seu fora até ali 0.6 marca/1.4 sofre
- vs **Nottingham Forest** (casa · **Derrota 0-5**, HT 0-4) — 4-6 SoT · posse 63%/59% (1ºT/2ºT) · adv 16º briga-Z · você 11º · seu casa até ali 1.4 marca/0.9 sofre
- @ **Wolverhampton Wanderers** (fora · **Empate 1-1**, HT 1-0) 🔻 cedeu o empate (vencia no HT) — 2-7 SoT · posse 60%/42% (1ºT/2ºT) · adv 20º REBAIX. · você 12º · seu fora até ali 0.8 marca/1.5 sofre
- vs **Manchester United** (casa · **Empate 0-0**, HT 0-0) — 4-1 SoT · posse 53%/51% (1ºT/2ºT) · adv 3º Eur-gar · você 12º salvo · seu casa até ali 1.4 marca/1.1 sofre
- @ **Everton** (fora · **Vitória 3-1**, HT 0-1) 🔄 **VIRADA** (perdia no HT) — 3-4 SoT · posse 60%/58% (1ºT/2ºT) · adv 10º salvo · você 12º salvo · seu fora até ali 0.8 marca/1.5 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Aston Villa (FORA · D 3-4) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 -3 -7 -2 +1 +4 +4 +3 +5 +7 +7 +5 +5 +5 +2] · 16'-30' [-2 -6 -6 -7 -4 -2 -2 -3 -3 -1 -3 -2 0 +3 +5] · 31'-45' [+3 +3 +5 +3 +1 -4 -7 -6 -3 -2 0 +1 +3 +1 -1] · ‖INTERVALO‖ · 46'-60' [-4 -7 -6 -4 -2 -1 0 +1 +2 +3 -3 -8 -6 -5 -3] · 61'-75' [-2 -3 -3 -4 -7 -3 -3 +1 +2 +2 +2 +2 +1 +2 +5] · 76'-90' [+4 +5 +3 +3 +3 +1 -3 -6 -4 -3 +3 +5 +5 +3 +3] · 91'+ [+3 +2 -2 -4 -4 -3 -3]
    ⚽ gols: 2'✗ 9'✓ 36'✗ 46'✗ 86'✓ 87'✓ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **5** · 31'-45' **1** ‖ 46'-60' **5** · 61'-75' **5** · 76'-90' **5**
  - vs Nottingham Forest (CASA · D 0-5) — min 1→96:
    📈 pressão (net/min): 1'-15' [0 +2 +1 -1 +1 +7 +8 +9 +6 +3 0 -1 0 +1 +6] · 16'-30' [+6 +4 +2 +3 +1 0 -3 -5 -4 -1 0 0 -5 -4 -4] · 31'-45' [-4 -8 -7 -6 -7 -5 -4 -6 -4 +1 +1 0 0 +2 +3] · ‖INTERVALO‖ · 46'-60' [+3 +2 +2 0 -1 -1 0 -1 0 +2 +2 +6 +7 +5 +7] · 61'-75' [+7 +9 +9 +9 +15 +11 +7 +3 +2 +3 0 0 +1 +4 +3] · 76'-90' [+5 +4 +4 +5 +6 +6 +10 +11 +9 +10 +8 +12 +10 +7 +5] · 91'+ [+6 +6 +17 +9 +4 +1]
    ⚽ gols: 17'✗ 31'✗ 34'✗ 37'✗ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **3** · 31'-45' **1** ‖ 46'-60' **5** · 61'-75' **3** · 76'-90' **3**
  - @ Wolverhampton Wanderers (FORA · E 1-1) — min 1→94:
    📈 pressão (net/min): 1'-15' [0 0 0 -2 0 +2 +2 +3 +3 0 -1 -1 -1 -1 +1] · 16'-30' [+2 +5 +6 +4 +3 +9 +6 +6 +6 +6 +4 +3 +6 +6 +4] · 31'-45' [+3 +1 +1 -1 -9 -9 -6 -4 -3 -9 -6 -6 -6 -2 -5] · ‖INTERVALO‖ · 46'-60' [-2 -7 -11 -11 -12 -9 -12 -9 -5 -9 -9 -9 -6 -6 -6] · 61'-75' [-6 -7 -7 -4 -3 -5 -2 -1 +4 +4 +1 -3 -3 -2 0] · 76'-90' [+2 +4 +3 +5 +6 +12 +9 +2 -5 -5 -8 -5 -3 -4 -1] · 91'+ [-1 0 -1 -3]
    ⚽ gols: 17'✓ 54'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **5** · 16'-30' **4** · 31'-45' **5** ‖ 46'-60' **5** · 61'-75' **4** · 76'-90' **1**
  - vs Manchester United (CASA · E 0-0) — min 1→94:
    📈 pressão (net/min): 1'-15' [0 -1 0 0 +4 +5 +3 +5 +8 +1 +1 +3 +4 +3 +2] · 16'-30' [+1 +1 +2 +8 +8 +5 +2 +1 +2 +2 +3 +2 +1 -5 -3] · 31'-45' [+1 +1 +1 +7 +7 +8 +8 +5 +6 +8 +5 +3 +2 +2 +1] · ‖INTERVALO‖ · 46'-60' [-3 0 +1 0 -3 -5 -10 -6 -6 -4 -4 -4 -3 -3 -2] · 61'-75' [-2 -1 -1 +2 +2 +2 +2 +1 +1 0 +3 +1 +2 +3 +3] · 76'-90' [+2 0 0 0 0 0 0 +1 0 -1 -1 +1 +3 +3 +3] · 91'+ [-2 -5 -5 -7]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **5** · 31'-45' **3** ‖ 46'-60' **3** · 61'-75' **4** · 76'-90' **2**
  - @ Everton (FORA · V 3-1) — min 1→96:
    📈 pressão (net/min): 1'-15' [+1 +1 +1 0 -2 -2 -3 -3 -3 -3 0 +1 +2 +3 +2] · 16'-30' [+3 +3 +1 +2 +1 +1 +1 +1 +2 +5 +7 +8 +6 +6 +4] · 31'-45' [+4 +3 +3 0 -5 -4 -4 -6 -4 -6 -5 -7 -9 -9 -5] · ‖INTERVALO‖ · 46'-60' [+2 +1 +4 +3 +3 +3 0 +1 +5 +6 +6 +5 +5 +8 +7] · 61'-75' [+7 +4 +4 +3 -4 -4 -5 -4 -4 -4 -3 -3 -3 -2 -2] · 76'-90' [-6 -4 -4 -4 -2 -1 +4 +1 -3 -3 -5 -5 -4 -4 -3] · 91'+ [-2 +3 +1 +1 0 -1]
    ⚽ gols: 43'✗ 59'✓ 81'✓ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **1** · 16'-30' **3** · 31'-45' **2** ‖ 46'-60' **2** · 61'-75' **1** · 76'-90' **5**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.05 · 16-30: 0.16 · 31-45: 0.11 · 46-60: 0.14 · 61-75: 0.27 · 76-90: 0.35
- Sofre por faixa (/j): 0-15: 0.22 · 16-30: 0.14 · 31-45: 0.27 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.22
- 1ºT: marca 12 / sofre 23 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (40): **7 de bola parada (18%)** — escanteio 2 · falta 1 · pênalti 4 · contra-ataque 2 · jogo corrido 24 · sem narração 7
- Gols sofridos (47): **7 de bola parada (15%)** — escanteio 4 · falta 1 · pênalti 2 · contra-ataque 6 · jogo corrido 24 · sem narração 10
- Escanteios: **3.6 a favor / 5.2 contra por jogo** (média da liga: 5 por time)

### Desfalques de Sunderland neste jogo
- **Dan Ballard** (Red Card Suspension) — 2 gols + 0 assists até a data; season: **5% dos gols** do time (5% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (≈ estável); with/without: com ele 1.07 g/j (29j) vs sem ele 1.13 g/j (8j) = +6%; finaliza **0.31 SoT/jogo** (time: 3.41 SoT/j com ele vs 3.25 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.7 interceptações/j** (~9% do time) · 1.1 desarmes/j · 5.8 duelos ganhos/j · 0 cruz. certos/j · 0.1 dribles certos/j · 0.6 key passes/j
- **Simon Moore** (Broken Hand) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.08 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Romaine Mundle** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (≈ estável); with/without: com ele 0.93 g/j (14j) vs sem ele 1.17 g/j (23j) = +26%; finaliza **0.14 SoT/jogo** (time: 3.5 SoT/j com ele vs 3.3 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.1 interceptações/j** (~1% do time) · 0.4 desarmes/j · 1.7 duelos ganhos/j · 0.1 cruz. certos/j · 0.5 dribles certos/j · 0.1 key passes/j

## Chelsea (visita) — até 2026-05-24

### Gols & finalização (season)
- Total **57 marcados / 50 sofridos** em 37j · média **1.54 marca / 1.35 sofre** por jogo
- **Fora (18j): marca 1.72 / sofre 1.39** (31 gols) · por tempo: 1ºT 0.7/0.62 · 2ºT 0.84/0.73
- **Finalização: 164 SoT (4.43/j · fora 4.61/j) · conv 30%** (aberta, −7 pên) · sofre 4.19 SoT/j (adv 31%) · 10.27 KP/j
- **Volume: 13.5 chutes/j (9 na área) · 2.7 big chances/j** · posse 57.8%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 54.5/43.7 · chutes pra fora 4.7/3.8 · bloqueados 4.4/2.6 · de fora da área 4.5/3.1
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 49.4/35.6 · chutes pra fora 4/3 · bloqueados 5.6/1.4 · de fora da área 5.8/2

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.89**
  - **Robert Sánchez** nota **6.78** (season) · forma 6.7= (últ.5 do time: 7.3→6.2→–→7→6.3 ➡️ estável) · **faltou 1/5** · 2× MOTM · 41j
    ↳ **0G+1A** · 0.12 KP/j (últ.5: 0↓) · 0 SoT/j (últ.5: 0=) · 0 dribles/j · def: 0.05 desarme + 0.02 int + 0.73 duelo/j · ~88 min/j
  - **Enzo Fernández** nota **7.28** (season) · forma 7.6↑ (últ.5 do time: 8.3→7.6→6.6→7→8.5 ➡️ estável) · 10× MOTM · 43j
    ↳ **12G+5A** · gols aos 18',23',23',24',34',35',56',64',88',90'… — 4 tardios (76'+) · 1.93 KP/j (últ.5: 2.6↑) · 0.88 SoT/j (últ.5: 1=) · 0.35 dribles/j · def: 1.49 desarme + 0.51 int + 3.77 duelo/j · 0.49 cruz/j · ~82 min/j
  - **Moisés Caicedo** nota **7.07** (season) · forma 6.94= (últ.5 do time: 6.6→6.8→7.6→6.7→7 ➡️ estável) · 2× MOTM · 39j
    ↳ **3G+1A** · gols aos 14',54',85' — mais no 2ºT · 0.74 KP/j (últ.5: 0.8=) · 0.21 SoT/j (últ.5: 0.2=) · 0.49 dribles/j · def: 2.56 desarme + 1.69 int + 5.23 duelo/j · 0.1 cruz/j · ~83 min/j
  - **Trevoh Chalobah ** nota **6.89** (season) · forma 6.67↓ (últ.5 do time: 7.1→6.4→–→–→6.5 📉 caindo) · **faltou 2/5** · 38j
    ↳ **3G+0A** · gols aos 48',58',80' — mais no 2ºT · 0.16 KP/j (últ.5: 0.4↑) · 0.13 SoT/j (últ.5: 0↓) · 0.24 dribles/j · def: 1.03 desarme + 1 int + 4.03 duelo/j · 0.03 cruz/j · ~82 min/j
  - **Pedro Neto ** nota **7.05** (season) · forma 6.97= (últ.5 do time: 7→–→–→6.7→7.2 ➡️ estável) · **faltou 2/5** · 3× MOTM · 43j
    ↳ **10G+8A** · gols aos 23',37',40',50',51',52',71',73',82',90' — mais no 2ºT · 1.63 KP/j (últ.5: 1↓) · 0.49 SoT/j (últ.5: 0.2↓) · 1.44 dribles/j · def: 0.53 desarme + 0.21 int + 2.88 duelo/j · 1 cruz/j · ~72 min/j
  - **João Pedro** nota **7.1** (season) · forma 7= (últ.5 do time: 6.7→7.4→7.2→6.7→– ➡️ estável) · **faltou 1/5** · 4× MOTM · 41j
    ↳ **17G+6A** · gols aos 4',15',24',25',26',34',35',37',45',45'… · 0.85 KP/j (últ.5: 0.6↓) · 0.76 SoT/j (últ.5: 0.2↓) · 1.17 dribles/j · def: 0.66 desarme + 0.15 int + 5.49 duelo/j · 0.02 cruz/j · ~75 min/j
  - **Marc Cucurella** nota **6.81** (season) · forma 6.76= (últ.5 do time: 6.8→7→6.8→6.7→6.5 📉 caindo) · 2× MOTM · 40j
    ↳ **1G+4A** · gols aos 70' — mais no 2ºT · 1.05 KP/j (últ.5: 0.8↓) · 0.15 SoT/j (últ.5: 0.2↑) · 0.03 dribles/j · def: 1.55 desarme + 0.9 int + 3.48 duelo/j · 0.33 cruz/j · ~76 min/j
  - **Malo Gusto** nota **6.83** (season) · forma 6.68= (últ.5 do time: 6.9→6.9→6.3→6.6→– 📉 caindo) · **faltou 1/5** · 1× MOTM · 41j
    ↳ **2G+4A** · gols aos 45',51' · 0.88 KP/j (últ.5: 1.4↑) · 0.17 SoT/j (últ.5: 0.2=) · 0.37 dribles/j · def: 1.61 desarme + 1 int + 3 duelo/j · 0.46 cruz/j · ~67 min/j
  - **Wesley Fofana** nota **6.92** (season) · forma 6.73↓ (últ.5 do time: –→–→6.6→6.8→6.8 ➡️ estável) · **faltou 2/5** · 31j
    ↳ **0G+1A** · 0.13 KP/j (últ.5: 0.2↑) · 0.06 SoT/j (últ.5: 0.2↑) · 0.42 dribles/j · def: 0.74 desarme + 1.42 int + 4.52 duelo/j · 0.03 cruz/j · ~70 min/j
  - **Andrey Santos** nota **6.95** (season) · forma 7= (últ.5 do time: 6.8→6.8→6.6→–→7.8 📈 subindo) · **faltou 1/5** · 1× MOTM · 36j
    ↳ **3G+2A** · gols aos 5',67',69' — mais no 2ºT · 0.49 KP/j (últ.5: 0.2↓) · 0.16 SoT/j (últ.5: 0.2↑) · 0.16 dribles/j · def: 1.84 desarme + 0.65 int + 3.68 duelo/j · ~57 min/j
  - **Cole Palmer** nota **6.92** (season) · forma 6.56↓ (últ.5 do time: 6.5→6.2→6.7→6.7→6.7 📈 subindo) · 2× MOTM · 29j
    ↳ **9G+1A** · gols aos 13',15',21',35',38',55',58',61',76' · 0.97 KP/j (últ.5: 0.4↓) · 0.86 SoT/j (últ.5: 0.6↓) · 0.83 dribles/j · def: 0.93 desarme + 0.55 int + 3 duelo/j · 0.21 cruz/j · ~72 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VEDDD** (4pts) · **4 feitos / 9 sofridos** · marca 0.8↓ / sofre 1.8↑ g/j · SoT 3 feito / 4 sofrido
- **Consistência: MARCOU em 30/37** (casa 15/19 · fora 15/18) · não-marcou 7 · clean sheet 9 · BTTS 23/37
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- vs **Leeds United** (casa · **Vitória 1-0**, HT 1-0) — 2-3 SoT · posse 78%/60% (1ºT/2ºT) · 🏆 FA Cup
- vs **Nottingham Forest** (casa · **Derrota 1-3**, HT 0-2) — 5-4 SoT · posse 56%/67% (1ºT/2ºT) · adv 16º briga-Z · você 9º · seu casa até ali 1.4 marca/1.2 sofre
- @ **Liverpool** (fora · **Empate 1-1**, HT 1-1) — 3-3 SoT · posse 44%/50% (1ºT/2ºT) · adv 4º briga-top · você 9º salvo · seu fora até ali 1.8 marca/1.4 sofre
- vs **Manchester City** (casa · **Derrota 0-1**, HT 0-0) — 1-4 SoT · posse 30%/45% (1ºT/2ºT) · 🏆 FA Cup
- vs **Tottenham Hotspur** (casa · **Vitória 2-1**, HT 1-0) — 4-3 SoT · posse 45%/47% (1ºT/2ºT) · adv 17º briga-Z · você 10º salvo · seu casa até ali 1.3 marca/1.3 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Manchester United (CASA · D 0-1) — min 1→94:
    📈 pressão (net/min): 1'-15' [+1 0 -1 -4 -1 0 -2 -1 +1 +2 +2 +4 +4 +4 +4] · 16'-30' [+3 +3 +3 +2 +1 0 0 -1 0 -1 -1 0 +1 +3 +5] · 31'-45' [+6 +7 +9 +8 +7 +3 -3 -2 +2 0 0 0 -3 -4 -2] · ‖INTERVALO‖ · 46'-60' [0 0 0 0 -2 -1 +1 +2 0 +1 +1 +7 +11 +10 +3] · 61'-75' [+1 +1 +1 +3 +2 +1 +3 +3 +2 +5 +4 +5 +11 +10 +10] · 76'-90' [+25 +20 +14 +10 +9 +8 +10 +6 +4 +4 +2 +5 +4 +25 +16] · 91'+ [+9 +7 +7 +5]
    ⚽ gols: 43'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **2** · 31'-45' **5** ‖ 46'-60' **2** · 61'-75' **4** · 76'-90' **3**
  - @ Brighton & Hove Albion (FORA · D 0-3) — min 1→95:
    📈 pressão (net/min): 1'-15' [-2 -4 -4 -8 -9 -6 -7 -7 -4 -3 -3 -2 -2 -8 -7] · 16'-30' [-7 -6 -11 -11 -8 -5 -4 -4 -5 -2 0 -1 -1 -1 0] · 31'-45' [0 -3 -3 -5 -7 -7 -5 -6 -5 -1 +1 +2 +2 -2 -1] · ‖INTERVALO‖ · 46'-60' [-1 +3 +2 +1 +1 +1 +2 +4 -1 -1 +1 -4 -2 -1 -1] · 61'-75' [0 -1 -2 -1 -1 -2 -8 -10 -8 -3 -3 -5 -5 -3 -5] · 76'-90' [-4 -1 -1 0 0 +2 +4 +2 +2 0 -2 -3 -1 +1 +1] · 91'+ [-2 -3 -2 +1 0]
    ⚽ gols: 3'✗ 56'✗ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **1** · 16'-30' **1** · 31'-45' **6** ‖ 46'-60' **2** · 61'-75' **2** · 76'-90' **3**
  - vs Nottingham Forest (CASA · D 1-3) — min 1→98:
    📈 pressão (net/min): 1'-15' [-3 -6 -6 -3 -3 -1 0 0 -1 +1 +2 -2 -2 -1 -5] · 16'-30' [-3 -2 +1 +2 +2 +5 +8 +7 +6 +4 +4 +7 +7 +5 +5] · 31'-45' [+4 +3 +3 +2 +4 +1 +2 +6 +8 +5 +6 +5 +7 +6 +8] · ‖INTERVALO‖ · 46'-60' [+4 +4 +4 +2 +5 +5 0 0 0 -1 0 +7 +1 +2 +3] · 61'-75' [+2 +2 +2 +2 +2 +2 +2 +2 +2 +2 +6 +6 +6 +9 +10] · 76'-90' [+27 +21 +21 +21 +21 +13 +10 +10 +14 +15 +15 +13 +12 +12 +11] · 91'+ [+8 +8 +12 +12 +14 +14 +14 +11]
    ⚽ gols: 2'✗ 15'✗ 52'✗ 90'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **5** · 16'-30' **6** · 31'-45' **1** ‖ 46'-60' **4** · 61'-75' **2** · 76'-90' **2**
  - @ Liverpool (FORA · E 1-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 +1 +2 +1 +1 -2 -2 -1 +1 +2 0 -4 -6 -5 -5] · 16'-30' [-3 -3 -2 -2 0 0 0 -1 -1 -1 -1 +2 +6 +6 +8] · 31'-45' [+6 +8 +8 +6 +4 +5 +5 +8 +9 +10 +10 +5 +3 +1 +1] · ‖INTERVALO‖ · 46'-60' [0 -3 -3 +2 +13 +10 +6 +5 +5 +6 +1 +1 +1 -2 -4] · 61'-75' [-3 -4 -4 -2 -2 0 0 -1 -2 -6 -5 -6 -5 -6 -4] · 76'-90' [-1 +1 -1 -5 -5 -3 -2 -2 -3 -2 -3 -1 0 +4 +2] · 91'+ [+2 +2 +2 -2 +1 +3 0]
    ⚽ gols: 6'✗ 35'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **5** · 31'-45' **5** ‖ 46'-60' **7** · 61'-75' **4** · 76'-90' **6**
  - vs Tottenham Hotspur (CASA · V 2-1) — min 1→96:
    📈 pressão (net/min): 1'-15' [-1 -1 +4 +4 +1 +1 0 +2 0 -1 -3 -7 -5 +1 +3] · 16'-30' [+3 +2 +2 +4 +2 +2 +1 +1 +2 +1 +2 +2 -2 -2 -2] · 31'-45' [-1 -3 -1 -1 0 +3 0 -2 -3 -1 -1 -1 -1 +1 +1] · ‖INTERVALO‖ · 46'-60' [+3 +2 +1 0 -1 -2 -4 -3 -2 -1 -1 -1 -1 0 -1] · 61'-75' [+1 +1 0 -1 -3 -3 +1 +2 0 +1 -2 -3 -7 -9 -7] · 76'-90' [-4 -4 -3 -3 -3 -3 0 -2 -3 -5 -5 -4 -4 -2 -1] · 91'+ [-1 -2 -2 -2 -3 -4]
    ⚽ gols: 18'✓ 67'✓ 74'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **5** · 31'-45' **3** ‖ 46'-60' **5** · 61'-75' **6** · 76'-90' **5**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.16 · 16-30: 0.19 · 31-45: 0.35 · 46-60: 0.35 · 61-75: 0.24 · 76-90: 0.24
- Sofre por faixa (/j): 0-15: 0.3 · 16-30: 0.14 · 31-45: 0.19 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.3
- 1ºT: marca 26 / sofre 23 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (57): **17 de bola parada (30%)** — escanteio 8 · falta 2 · pênalti 7 · contra-ataque 3 · jogo corrido 25 · sem narração 12
- Gols sofridos (50): **7 de bola parada (14%)** — escanteio 5 · falta 0 · pênalti 2 · contra-ataque 4 · jogo corrido 34 · sem narração 5
- Escanteios: **6.1 a favor / 4.2 contra por jogo** (média da liga: 5 por time)

### Desfalques de Chelsea neste jogo
- **Estêvão** (Unknown Injury) — 2 gols + 2 assists até a data; season: **4% dos gols** do time (7% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.45 g/j (22j) vs sem ele 1.67 g/j (15j) = +15%; finaliza **0.36 SoT/jogo** (time: 4.59 SoT/j com ele vs 4.2 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.2 interceptações/j** (~2% do time) · 0.5 desarmes/j · 2.4 duelos ganhos/j · 0.2 cruz. certos/j · 1.3 dribles certos/j · 0.7 key passes/j
- **Jamie Gittens** (Doubtful) — 0 gols + 2 assists até a data; season: **0% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 2.06 g/j (16j) vs sem ele 1.14 g/j (21j) = −45%; finaliza **0.13 SoT/jogo** (time: 5.56 SoT/j com ele vs 3.57 sem — volume mais estável que gols)
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.1 interceptações/j** (~1% do time) · 0.5 desarmes/j · 2 duelos ganhos/j · 0.3 cruz. certos/j · 0.8 dribles certos/j · 0.6 key passes/j
- **Roméo Lavia** (Doubtful) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 1.08 g/j (12j) vs sem ele 1.76 g/j (25j) = +63%; finaliza **0 SoT/jogo** (time: 4.42 SoT/j com ele vs 4.44 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.5 interceptações/j** (~5% do time) · 0.7 desarmes/j · 1.8 duelos ganhos/j · 0 cruz. certos/j · 0.3 dribles certos/j · 0.1 key passes/j
- **M. Mudryk** (Doping Ban) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.54 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **C. Wiley** (Adductor Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.54 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Sunderland atacando × Chelsea defendendo**
| Faixa | Sunderland marca/j | Chelsea sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.05 | 0.3 | 0.35 |
| 16-30 | 0.16 | 0.14 | 0.3 |
| 31-45 | 0.11 | 0.19 | 0.3 |
| 46-60 | 0.14 | 0.19 | 0.33 |
| 61-75 | 0.27 | 0.24 | 0.51 |
| 76-90 | 0.35 | 0.3 | 0.65 |

**Chelsea atacando × Sunderland defendendo**
| Faixa | Chelsea marca/j | Sunderland sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.16 | 0.22 | 0.38 |
| 16-30 | 0.19 | 0.14 | 0.33 |
| 31-45 | 0.35 | 0.27 | 0.62 |
| 46-60 | 0.35 | 0.19 | 0.54 |
| 61-75 | 0.24 | 0.24 | 0.48 |
| 76-90 | 0.24 | 0.22 | 0.46 |

### Cruzamento de MOMENTUM (fluxo minuto-a-minuto dos últimos 5, já cruzado pra você)
A curva de momentum foi digerida e CRUZADA em código — não precisa cruzar 90 pontos na mão, use a conclusão abaixo (quem domina cada janela) junto com o cruzamento de gols acima.

**Janela de gol provável pela curva de momentum** — Sunderland: **0-15** (domínio +3) · Chelsea: **31-45** (domínio -3.1). Cruze com o timing de gols e com a intenção: se a janela de quem PRECISA do gol coincide com a fraqueza do outro, é ali que o gol tende a sair.

| Faixa | Sunderland domínio/j | Chelsea domínio/j | cruzamento |
|---|---|---|---|
| 0-15 | +1.5 | -1.5 | +3 🏠 |
| 16-30 | +1.5 | +0.5 | +1 ≈ |
| 31-45 | -1.3 | +1.8 | -3.1 ✈️ |
| 46-60 | -1.7 | +1.3 | -3 ✈️ |
| 61-75 | +0.5 | -0.2 | +0.7 ≈ |
| 76-90 | +1.2 | +4.2 | -3 ✈️ |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Sunderland (casa) = 1.16 · λ Chelsea (fora) = 1.49 · total = 2.65

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Sunderland: λ_SoT 3.42 × conv 29% → **0.99 gols**
- Chelsea: λ_SoT 4.56 × conv 30% → **1.37 gols**
- total via SoT = 2.36
- **Índice de volume do jogo**: λ_SoT total 8 vs média da liga 8.5 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson corrigido por **Dixon-Coles** sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 28/29/43% | 25/31/44% |
| Over 1.5 | 76% | 70% |
| Over 2.5 | 49% | 42% |
| Over 3.5 | 27% | 21% |
| BTTS | 55% | 49% |

**Mercados derivados do MESMO grid corrigido** (Rota B — já coerentes entre si; use como prior destes mercados):
- **Dupla chance**: 1X **56%** · 12 **69%** · X2 **75%** · **Draw No Bet** casa 37% / fora 63%
- **Placar exato (mais prováveis)**: 1-1 14% · 0-1 11% · 0-0 11% · 0-2 9%
- **Odd/Even**: ímpar 46% / par 54% · **Multigoals**: 0-1 30% · 2-3 49% · 4+ 21%
- **Team totals** (marginais do λ da Rota B — a prob de CADA time marcar; base do `team_total`): Sunderland over 0.5 **63%** / over 1.5 **26%** · Chelsea over 0.5 **75%** / over 1.5 **40%**
- **Fair odds no-vig (1x2, calculadas pelo grid — não pelo mercado)**: casa 3.93 · empate 3.26 · fora 2.28. São PROBABILIDADE JUSTA, não veredito de valor (sem odds do mercado ingeridas não há EV/CLV — não prometa "aposta certa").
- ⚠️ O grid Dixon-Coles JÁ corrige o empate pra cima (o Poisson independente o subestima). **O empate / dupla chance é pick LEGÍTIMO** quando o prior aqui aponta — NÃO o rebaixe por covardia; num jogo travado de poucos gols o X costuma ser o de MENOR variância com valor.

**Baseline da liga (1ºT/2ºT):** 43% dos gols saem no 1º tempo / 57% no 2º (sobre 370 jogos jogados). Use como referência pra dizer se um time é ANÔMALO no timing (o padrão da literatura é ~44/56 — 2º tempo mais goleador por fadiga/game-state).
**Baseline por faixa de 15min (% dos gols da liga):** 0-15: 12% · 16-30: 11% · 31-45: 21% · 46-60: 15% · 61-75: 16% · 76-90: 26%. É a curva NORMAL — compare o timing de cada time (bloco "Distribuição de gols por faixa") contra ela; desvio grande (marca/sofre muito mais que a liga numa janela) é o sinal de onde o gol tende a sair NESTE jogo.

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **15/48/37%** · 2ºT **30/38/33%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Sunderland) e `away` (= Chelsea), cada um com:
- `xg` (total), `xg_1t`, `xg_2t` e **`xg_bands`** = o xG nas 6 faixas de 15 min (`"0-15"`,`"16-30"`,`"31-45"`,`"46-60"`,`"61-75"`,`"76-90"`). Dê a distribuição APROXIMADA pelo cruzamento ataque×defesa por faixa — **NÃO gaste raciocínio conferindo a soma**: o runtime normaliza as bands pra somar `xg` (e o 1ºT = 3 primeiras).
  - **FORMA da curva (não só o total):** parta do baseline da liga (~44% no 1ºT / 56% no 2ºT, pico em `"76-90"`). **Os dois PRECISAM ir pra cima** → concentre MAIS massa nas faixas TARDIAS (`"61-75"`/`"76-90"`): fadiga + desespero simultâneos empurram o gol pro fim. Mas o lado que estiver PERSEGUINDO (vai perdendo) converte PIOR no fim (chute apressado) — não infle demais o `"76-90"` DELE além do baseline. Mata-mata/decisão/derby REDUZ o 1ºT (share ~35-39%, cautela tática).
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
