# Prognóstico de expected goals — Mirassol x Grêmio

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
- **Goleiro (bloco próprio):** o save% e as defesas/j do goleiro TITULAR são a trava da conversão defensiva — cruze com o VOLUME (SoT) que o adversário cria: muito SoT contra goleiro de save% alto = under disfarçado; goleiro reserva/de save% baixo (ou com erros→chute) solta o over do OUTRO lado. Goleiro desfalcado (⚠️) é o desfalque que mais mexe na conversão — trate à parte dos de linha.
- **Jogo físico (aéreo, faltas, erros):** três arestas que a média de gols não mostra. (1) **Aéreo × bola parada**: time com % alto de gols de escanteio/falta contra defensores que PERDEM o duelo aéreo = rota de gol concreta (nomeie quem cruza e quem falha no alto). (2) **Faltas**: cavador de faltas (sofre muitas) contra time faltoso = pênalti/bola parada perigosa mais prováveis. (3) **Erros→chute**: defesa/goleiro que entrega finalização de graça sustenta gol do adversário SEM o adversário criar — é gol que o λ não previu.
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

## Verificação encadeada (CoVe) — o rascunho NÃO é o veredito
Depois de montar o grafo, os roteiros e um RASCUNHO do veredito (xG, mercados, best_bet), você é obrigado a rodar uma **Chain-of-Verification** antes de emitir a saída — é ela que separa "raciocinou" de "confabulou em cima da própria narrativa":
1. **Rascunhe** o veredito completo e PARE. Trate-o como hipótese, não como resposta.
2. **Gere 6 a 10 perguntas de verificação** — e componha com DENTE, não com espelho: checar só o que você copiou ("o briefing diz X?") nunca falha e não verifica nada. Obrigatório incluir: **≥2 perguntas ADVERSARIAIS sobre a condição de pagamento da best_bet em frequência recente** ("em quantos dos últimos 5 o time fez o que a aposta precisa — marcou ≥ linha+1 / passou da linha?" — conte nos blocos de forma/consistência); **1 de DIREÇÃO vinculante** ("em quantos dos últ.5 o favorito do meu 1x2 venceu, e neste mando?" — se contrariar, o `one_x_two` DESCE junto, não só a aposta); **1 de coerência interna** ("algum número meu contradiz a aposta?" — e se o cenário de falha descrito coincide com um roteiro provável SEU, rebaixe a confiança ou troque pra mercado que sobreviva a ele); **1 de identidade de titular** ("o goleiro/jogador que a aposta pressupõe é o titular REAL? cruze o 'faltou X/5' do perfil"); e o resto sobre drivers, xG (inclusive o TAMANHO do desvio vs prior) e a janela apontada. **TRAVA ANTI-ARREDONDAMENTO**: a prob publicada é a DERIVADA — proibido arredondar pra cruzar limiar e viabilizar aposta (0.48 não vira 0.50; se só existe arredondada, escolha outro mercado).
3. **Responda cada pergunta RELENDO a Parte 2 do zero**, citando o número/frase literal do bloco — proibido responder "de memória" do rascunho (é exatamente assim que um erro de leitura sobrevive). Marque cada uma: ✓ confirma · ✗ contradiz · ~ parcial.
4. **Revise**: qualquer ✗ ligado a um driver ou à best_bet OBRIGA revisão NUMÉRICA — re-derive a prob/xG afetado ou troque a aposta; **"mantive porque a perda é qualitativa" é PROIBIDO** sem dado citado que sustente. Um ~ rebaixa a força do fator e, se ele era decisivo, a confiança. **Se TODAS derem ✓ com zero ajuste, desconfie de você mesmo**: refaça as 2 adversariais com mais dente antes de aceitar. Só depois da revisão você emite a saída final — e o `summary` geral deve refletir o veredito REVISADO, não o rascunho.
Armadilhas que a CoVe existe pra pegar: número citado de um bloco errado (season × últimos 5, casa × fora), with/without ⚠️ usado como se fosse confiável, frequência recente contrariando a aposta (time que não faz 2 gols há 5 jogos bancado num team_total 1.5), conclusão que contraria o VEREDITO DE INTENÇÃO, aposta que contradiz o próprio roteiro, e cruzamento "lembrado" que não está em lugar nenhum do briefing.

## Método numérico
**PARTA da base rate** abaixo (duas rotas: λ de gols puro E λ_SoT × conversão) e das **probabilidades Poisson já calculadas** — esse é o seu **PRIOR**, não o veredito — e **ATUALIZE** pelo roteiro + cada fator, justificando direção e tamanho com evidência nomeada. Regras:
- **Poisson é o PRIOR; o roteiro é a ATUALIZAÇÃO.** Seu `over25_prob`, `btts_prob` e `one_x_two` PARTEM da Rota B, mas **MOVA-OS com convicção** quando o roteiro + a assimetria apontam um lado — cego ao placar, o Poisson regride pra média; você não precisa. Desvio grande exige fator nomeado e quantificado; **mas timidez também é erro** — não devolva a média só porque "o total costuma ser baixo". Só fique colado no prior quando NÃO há fator nem roteiro claro.
- **SoT é o sinal de VOLUME primário** — 3× mais denso que gols, logo menos ruído. Use gols para a CONVERSÃO (gols/SoT) e como checagem. Onde as rotas divergem, confie mais no SoT (a diferença é finalização que regride à conversão do time).
- **Cruze feito × sofrido**: ataque de um time × o que o outro CONCEDE (ex.: ataques perigosos/SoT que A cria × que B permite). O confronto manda, não a média solta.
- O **desconto por desfalque age no VOLUME (SoT/λ_SoT)**, não na conversão. **NÃO double-conte**: desfalque que já estava fora nos últimos jogos já está na média recente. Desfalque **DEFENSIVO** (alto volume PRÓPRIO de interceptações/desarmes e/ou alto **% das interceptações do time** — vide bloco de desfalques) → a defesa do time piora → **+gols do ADVERSÁRIO** (sobe o λ do OUTRO time, não o dele). Use o número **PESSOAL** do jogador; a interceptação AGREGADA do time é ruidosa (sobe quando o time tem menos a bola).
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️ e prefira o de **SoT** (mais estável que o de gols).
- O **goleiro age na CONVERSÃO DEFENSIVA** (o convDef do time), não no volume: save% alto do titular puxa o convDef pra baixo (segura o over do rival); reserva entrando ou save% baixo puxa pra cima. É o espelho do desfalque de linha — um mexe em quanto o rival FINALIZA, o outro em quanto dessas finalizações VIRA gol.
- **Big chances criadas/perdidas** calibram a conversão fina: time (ou atacante) que cria muita big chance e desperdiça tende a REGREDIR PRA CIMA (os gols vêm); conversão alta com poucas big chances tende a regredir pra baixo (sorte de finalização).
- Incerteza: NÃO temos xG real — SoT é o melhor proxy de volume/qualidade; chutes totais, posse e clima entram como contexto.

---

**PARTE 2 · OS DADOS DO JOGO** — analise e tire UMA CONCLUSÃO de CADA seção abaixo (cada `##` e cada `###`). O que você não comentar, você desperdiçou. É daqui que sai o veredito.

## Contexto
- Data: 2026-07-17 20:00 · Rodada 19 · Liga BRA
- Local: Estádio José Maria de Campos Maia, Mirassol (grass)
- Clima: clear sky · ?°C (sens. ?°C) · vento 4.8 m/s · umidade 39% · nuvens 0% (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: Mirassol 48 dias (último: liga, 2026-05-30) · Grêmio 48 dias (último: liga, 2026-05-30)
- Viagem do visitante: ~690 km
- Densidade da janela de forma: **Mirassol** **5 jogos em 27 dias** (intervalos 7-6-7-7) · **Grêmio** **5 jogos em 28 dias** (intervalos 8-7-6-7)
- Dureza da janela (últ.5): **Mirassol** 2/5 vs top-6 · duelos 89/j (-4%) · faltas 26.2/j (-4%) · cartões 5.0/j (+1%) → **sequência NEUTRA** · **Grêmio** 3/5 vs top-6 · duelos 96/j (+3%) · faltas 28.6/j (+5%) · cartões 5.6/j (+13%) → **sequência DURA** (3/5 vs top-6, faltas +5%, cartões +13%)
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- **Densidade + Dureza da janela** (as 2 linhas acima — MOD-008/MOD-009): leem o que o Descanso sozinho não vê — "5 jogos em 14 dias" ≠ os mesmos 5 num mês, e sequência contra top-6 pesada em duelos desgasta mais que a mesma contagem contra a parte de baixo. Três travas: (1) é **evidência QUALITATIVA** pro seu ajuste de cenário — NUNCA recalcule λ/probabilidades por isso; (2) o sinal é a **ASSIMETRIA** (um lado em maratona dura, o outro em semana cheia leve) — densidade/dureza parecidas dos dois lados ≈ ruído; (3) **não dupla-conte** com o Descanso: o último intervalo já está na linha própria, e densidade BAIXA não é frescor garantido (pausa de calendário ≠ time descansado por mérito). Cruzamento que importa: **densidade/dureza ALTA + este jogo SEM stake real → rodízio provável** — confira o XI provável/minutagem e os "VIVOS fora do XI" antes de confiar no time-base.
- Média da liga (pré-jogo, 179 jogos): mandante 1.553 gols/jogo · visitante 1.101 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.45 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-07-17)
- Mirassol: 19º, 16 pts · Grêmio: 15º, 21 pts
- Linhas: segurança (sair do Z) 21 pts (16º) · Libertadores 29 pts (5º) · última vaga continental 24 pts (11º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Mirassol: 19º, 16 pts, 20 jogo(s) restante(s) (máx possível 76 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - alcance pra CIMA (19º): **18 time(s) ainda ao alcance** — o que o Mirassol tem a GANHAR, não só a perder:
    - **Remo** (18º · 18 pts, mín 18 · 4 V · SG -8 · 21 GP) → **Mirassol passa em PONTOS** (Mirassol 76 vs Remo 18), sem depender de desempate. Basta Mirassol vencer o que resta e Remo não somar 58 ponto(s).
    - **Vasco da Gama** (17º · 20 pts, mín 20 · 5 V · SG -8 · 22 GP) → **Mirassol passa em PONTOS** (Mirassol 76 vs Vasco da Gama 20), sem depender de desempate. Basta Mirassol vencer o que resta e Vasco da Gama não somar 56 ponto(s).
    - **Santos** (16º · 21 pts, mín 21 · 5 V · SG -4 · 27 GP) → **Mirassol passa em PONTOS** (Mirassol 76 vs Santos 21), sem depender de desempate. Basta Mirassol vencer o que resta e Santos não somar 55 ponto(s).
    - +15 mais acima (alcance remoto)
  - ⚠️ desempate modelado até **goalsFor** (é o que a fonte entrega: a SportMonks dá só o rótulo da regra, sem a cascata). Se dois times empatarem ATÉ esse critério, o desfecho é **indefinido para nós** — regulamentos costumam seguir com confronto direto/cartões/sorteio, que NÃO estão calculados. Nesse caso diga "indefinido", não invente o desempate.
  - Grêmio: 15º, 21 pts, 20 jogo(s) restante(s) (máx possível 81 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - alcance pra CIMA (15º): **14 time(s) ainda ao alcance** — o que o Grêmio tem a GANHAR, não só a perder:
    - **Internacional** (14º · 21 pts, mín 21 · 5 V · SG -1 · 21 GP) → **Grêmio passa em PONTOS** (Grêmio 81 vs Internacional 21), sem depender de desempate. Basta Grêmio vencer o que resta e Internacional não somar 60 ponto(s).
    - **Cruzeiro** (13º · 24 pts, mín 24 · 6 V · SG -4 · 24 GP) → **Grêmio passa em PONTOS** (Grêmio 81 vs Cruzeiro 24), sem depender de desempate. Basta Grêmio vencer o que resta e Cruzeiro não somar 57 ponto(s).
    - **Corinthians** (12º · 24 pts, mín 24 · 6 V · SG -1 · 18 GP) → **Grêmio passa em PONTOS** (Grêmio 81 vs Corinthians 24), sem depender de desempate. Basta Grêmio vencer o que resta e Corinthians não somar 57 ponto(s).
    - +11 mais acima (alcance remoto)
  - ⚠️ desempate modelado até **goalsFor** (é o que a fonte entrega: a SportMonks dá só o rótulo da regra, sem a cascata). Se dois times empatarem ATÉ esse critério, o desfecho é **indefinido para nós** — regulamentos costumam seguir com confronto direto/cartões/sorteio, que NÃO estão calculados. Nesse caso diga "indefinido", não invente o desempate.

🔥 **VEREDITO DE INTENÇÃO: OS DOIS PRECISAM IR PRA CIMA** (nenhum se contenta com empate) → o jogo tende a ABRIR. Over / handicap de quem ataca / team_total GANHAM peso — aposta de gol é COERENTE aqui.

## H2H — confronto direto Mirassol × Grêmio (liga 2 seasons + copas, até 2026-07-17)
**Retrospecto (2 confrontos na janela ingerida, ótica do Mirassol): 2V 0E 0D · gols 5-1** · over 2.5 em 1/2 · BTTS em 1/2
- 2025-09-13 · @ **Grêmio** (fora · **Vitória 1-0**, HT 1-0) — SoT 6-5
- 2025-04-16 · vs **Grêmio** (casa · **Vitória 4-1**, HT 2-0) — SoT 6-6
**Último confronto (o precedente mais parecido com ESTE jogo):** 2025-09-13 · @ **Grêmio** (fora · **Vitória 1-0**, HT 1-0) — SoT 6-5
  - Gols: 45' Alesson (Mirassol)
_Use como PRECEDENTE, não como destino: cite a DATA (técnico/elenco podem ter mudado desde então) e pese o MANDO — o jogo do turno foi na casa do outro. Par que trava (under/poucos SoT recorrentes) ou freguesia recorrente é sinal; 1 jogo isolado não é._

## Mirassol (manda) — até 2026-07-17

### Gols & finalização (season)
- Total **18 marcados / 24 sofridos** em 17j · média **1.06 marca / 1.41 sofre** por jogo
- **Em casa (9j): marca 1.22 / sofre 1.22** (11 gols) · por tempo: 1ºT 0.65/0.53 · 2ºT 0.41/0.88
- **Finalização: 80 SoT (4.71/j · casa 6.11/j) · conv 21%** (aberta, −1 pên) · sofre 4.47 SoT/j (adv 25%) · 10.71 KP/j
- **Volume: 14 chutes/j (8 na área) · big chances: cria 2.1/desperdiça 1.6 por j** · posse 51.4%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 43.9/40.3 · chutes pra fora 6.1/5.2 · bloqueados 3.4/4.8 · de fora da área 6/6.4
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 38.8/37.8 · chutes pra fora 5.6/6.4 · bloqueados 2.2/3.8 · de fora da área 6.4/5.6

### Goleiro (season — a trava da conversão defensiva)
  - **Walter** (titular, 17j · ~90 min/j) · **2.94 defesas/j** (62% dentro da área — chance clara) · **save% 68** (50 defesas / 24 gols sofridos nos jogos dele) · ⚠️ **1 erro(s) que viraram finalização**

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.76**
  - **Walter** nota **6.8** (season) · forma 6.58↓ (últ.5 do time: 6.4→7→6.1→6.6→6.8 ➡️ estável) · 17j
    ↳ 🧤 **2.94 defesas/j** (62% dentro da área) · **save% 68** (50 defesas / 24 gols sofridos nos jogos dele) · ⚠️ **1 erro(s)→chute** na season · ~90 min/j
  - **João Victor** 🎖️capitão nota **6.92** (season) · forma 6.9= (últ.5 do time: 6.9→6.8→6.5→6.9→7.4 📈 subindo) · 17j
    ↳ **0G+1A** · **0.47 chutes/j (pontaria 13%)** · 0.06 SoT/j (últ.5: 0↓) · big chances: cria 0.06/perde 0.12 por j · 0.24 KP/j (últ.5: 0.2=) · 0.06 chances criadas/j · 0.12 dribles/j · 4.59 passes no 3º final/j
    ↳ aéreo **2.88/4 por j (72%)** · faltas: sofre 0.35/comete 0.59 por j · def: 0.65 desarme + 0.88 int + 3.82 duelo/j · 5.65 cortes/j · perde 0.24 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 63 toques/j · ~90 min/j
  - ⚠️(fora) **Willian Machado** nota **7.11** (season) · forma 7.18= (últ.5 do time: 6.5→7.5→7.1→7.6→7.2 📈 subindo) · 15j
    ↳ **1G+1A** · gols aos 40' · **0.67 chutes/j (pontaria 50%)** · 0.33 SoT/j (últ.5: 0.4↑) · big chances: cria 0.13/perde 0.07 por j · 0.53 KP/j (últ.5: 0.8↑) · 0.33 chances criadas/j · 0.07 dribles/j · 6.4 passes no 3º final/j
    ↳ aéreo **2.87/3.07 por j (93%)** · faltas: sofre 0.8/comete 0.67 por j · def: 1.47 desarme + 1.07 int + 5.07 duelo/j · 6.8 cortes/j (+1 último homem) · 0.13 cruz/j · perde 0.07 bolas pressionado/j · 68 toques/j · ~90 min/j
  - **Reinaldo ** nota **6.83** (season) · forma 7.28↑ (últ.5 do time: –→8.2→7.4→6.9→6.6 📉 caindo) · **faltou 1/5** · 1× MOTM · 14j
    ↳ **0G+1A** · **1.14 chutes/j (pontaria 13%)** · 0.14 SoT/j (últ.5: 0.4↑) · big chances: cria 0.29/perde 0 por j · 2.5 KP/j (últ.5: 3.4↑) · 1.93 chances criadas/j · 0.64 dribles/j · 9.79 passes no 3º final/j
    ↳ aéreo **0.36/0.14 por j (250%)** · faltas: sofre 0.71/comete 0.71 por j · def: 0.86 desarme + 0.5 int + 2.57 duelo/j · 1.71 cortes/j · 1.86 cruz/j · perde 0.79 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 63 toques/j · ~82 min/j
  - **Alesson** nota **6.86** (season) · forma 6.82= (últ.5 do time: 6.8→7→6.4→7.3→6.6 ➡️ estável) · 17j
    ↳ **0G+4A** · **1.65 chutes/j (pontaria 50%)** · 0.82 SoT/j (últ.5: 1.2↑) · big chances: cria 0.29/perde 0.29 por j · 0.94 KP/j (últ.5: 0.8=) · 0.76 chances criadas/j · 1.12 dribles/j · 2 passes no 3º final/j
    ↳ aéreo **0.65/1.12 por j (58%)** · faltas: sofre 1.47/comete 0.94 por j · def: 1.82 desarme + 0.18 int + 4.94 duelo/j · 0.47 cortes/j · 0.35 cruz/j · perde 1.65 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 37 toques/j · ~67 min/j
  - **Igor Formiga** nota **6.96** (season) · forma 6.7↓ (últ.5 do time: 6.9→6.5→–→–→– ⚠️ poucos jogos na janela) · **faltou 3/5** · 1× MOTM · 14j
    ↳ **3G+0A** · gols aos 21',81',90' — mais no 2ºT, 2 tardios (76'+) · **1.07 chutes/j (pontaria 33%)** · 0.36 SoT/j (últ.5: 0↓) · big chances: cria 0.07/perde 0.07 por j · 1.14 KP/j (últ.5: 0.4↓) · 0.5 chances criadas/j · 0.71 dribles/j · 3.79 passes no 3º final/j
    ↳ aéreo **1.71/1.64 por j (104%)** · faltas: sofre 0.5/comete 1.57 por j · def: 2.57 desarme + 1.43 int + 5.5 duelo/j · 2.71 cortes/j (+1 último homem) · 0.71 cruz/j · perde 0.86 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 54 toques/j · ~79 min/j
  - **José Aldo** nota **6.86** (season) · forma 6.95= (últ.5 do time: –→7.4→6.3→6.9→7.2 📈 subindo) · **faltou 1/5** · 15j
    ↳ **0G+1A** · **0.87 chutes/j (pontaria 31%)** · 0.27 SoT/j (últ.5: 0.2↓) · big chances: cria 0.13/perde 0 por j · 1.47 KP/j (últ.5: 1↓) · 0.8 chances criadas/j · 0.53 dribles/j · 7.53 passes no 3º final/j
    ↳ aéreo **1.27/0.8 por j (158%)** · faltas: sofre 0.53/comete 1.4 por j · def: 1.33 desarme + 1 int + 3.53 duelo/j · 1.33 cortes/j · 0.13 cruz/j · perde 0.93 bolas pressionado/j · ⚠️ **3 erro(s)→chute** na season · 58 toques/j · ~72 min/j
  - **Shaylon** nota **6.68** (season) · forma 6.6= (últ.5 do time: 6.4→6.3→6.4→6.5→7.4 📈 subindo) · 14j
    ↳ **1G+1A** · gols aos 21' · **0.71 chutes/j (pontaria 40%)** · 0.29 SoT/j (últ.5: 0.2↓) · big chances: cria 0.14/perde 0 por j · 0.86 KP/j (últ.5: 0.8=) · 0.5 chances criadas/j · 0.29 dribles/j · 3.64 passes no 3º final/j
    ↳ faltas: sofre 0.07/comete 0.93 por j · def: 0.43 desarme + 0.21 int + 1.07 duelo/j · 0.29 cortes/j · 0.21 cruz/j · perde 0.71 bolas pressionado/j · 35 toques/j · ~60 min/j
  - ⚠️(fora) **Negueba** nota **7.24** (season) · forma 7.24= (últ.5 do time: –→–→–→–→– ⚠️ poucos jogos na janela) · **faltou 5/5** · 1× MOTM · 9j
    ↳ **2G+0A** · gols aos 53',71' — mais no 2ºT · **2.11 chutes/j (pontaria 32%)** · 0.67 SoT/j (últ.5: 0.4↓) · big chances: cria 0.22/perde 0.22 por j · 2 KP/j (últ.5: 2.4=) · 0.22 chances criadas/j · 1.78 dribles/j · 3 passes no 3º final/j
    ↳ aéreo **0.56/0.22 por j (250%)** · faltas: sofre 2.11/comete 0.56 por j · def: 1.11 desarme + 1.11 int + 5.33 duelo/j · 0.33 cortes/j · 2 cruz/j · perde 1.22 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 59 toques/j · ~87 min/j
  - **Neto Moura** nota **6.82** (season) · forma 6.7= (últ.5 do time: 7.1→–→–→–→6.3 ⚠️ poucos jogos na janela) · **faltou 3/5** · 12j
    ↳ **0.92 chutes/j (pontaria 18%)** · 0.17 SoT/j (últ.5: 0.2=) · big chances: cria 0.08/perde 0 por j · 0.33 KP/j (últ.5: 0.2↓) · 0.17 chances criadas/j · 0.08 dribles/j · 6.67 passes no 3º final/j
    ↳ faltas: sofre 0.5/comete 0.92 por j · def: 1.25 desarme + 0.75 int + 2.42 duelo/j · 0.75 cortes/j · 0.08 cruz/j · perde 0.17 bolas pressionado/j · 48 toques/j · ~61 min/j
  - **Eduardo ** nota **6.66** (season) · forma 6.63= (últ.5 do time: –→7.1→6.4→6.7→6.3 📉 caindo) · **faltou 1/5** · 10j
    ↳ **2G+0A** · gols aos 54',71' — mais no 2ºT · **0.82 chutes/j (pontaria 44%)** · 0.36 SoT/j (últ.5: 0.2↓) · 0.27 KP/j (últ.5: 0↓) · 0.18 chances criadas/j · 0.09 dribles/j · 2.45 passes no 3º final/j
    ↳ aéreo **0.91/1.27 por j (71%)** · faltas: sofre 0.82/comete 0.82 por j · def: 0.27 desarme + 0.45 int + 2 duelo/j · 0.36 cortes/j · 0.09 cruz/j · perde 0.18 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 24 toques/j · ~53 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: DVDEV** (7pts) · **5 feitos / 6 sofridos** · marca 1= / sofre 1.2= g/j · SoT 4.4 feito / 3.2 sofrido
- **Consistência: MARCOU em 11/17** (casa 7/9 · fora 4/8) · não-marcou 6 · clean sheet 1 · BTTS 10/17
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- **Densidade da janela:** **5 jogos em 27 dias** (intervalos 7-6-7-7)
- 2026-05-03 · vs **Corinthians** (casa · **Vitória 2-1**, HT 2-0) — 5-3 SoT · posse 55%/42% (1ºT/2ºT) · adv 15º briga-Z · você 19º briga-Z · seu casa até ali 1.2 marca/1.5 sofre
- 2026-05-10 (+7d) · vs **Chapecoense** (casa · **Empate 1-1**, HT 0-0) — 4-4 SoT · posse 57%/62% (1ºT/2ºT) · adv 20º briga-Z · você 18º briga-Z · seu casa até ali 1.3 marca/1.4 sofre
- 2026-05-16 (+6d) · @ **Atlético Mineiro** (fora · **Derrota 1-3**, HT 1-1) — 3-5 SoT · posse 50%/46% (1ºT/2ºT) · adv 13º · você 18º briga-Z · seu fora até ali 1 marca/1.5 sofre
- 2026-05-23 (+7d) · vs **Fluminense** (casa · **Vitória 1-0**, HT 1-0) — 8-2 SoT · posse 39%/35% (1ºT/2ºT) · adv 3º briga-top · você 19º briga-Z · seu casa até ali 1.3 marca/1.4 sofre
- 2026-05-30 (+7d) · @ **Athletico PR** (fora · **Derrota 0-1**, HT 0-0) — 2-2 SoT · posse 50%/51% (1ºT/2ºT) · adv 4º briga-top · você 18º briga-Z · seu fora até ali 1 marca/1.7 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Corinthians (CASA · V 2-1) — min 1→96:
    📈 pressão (net/min): 1'-15' [-1 0 +3 +3 +6 +4 +4 +7 +4 -2 -7 -4 -4 -4 -4] · 16'-30' [-2 -1 -1 +1 +2 +2 +2 +6 +6 +4 +3 +4 +4 0 -1] · 31'-45' [+1 +4 +5 +4 +2 +1 0 +1 +1 +1 -1 -2 -2 -4 -4] · ‖INTERVALO‖ · 46'-60' [+1 0 +1 -2 -3 -2 -3 0 -1 0 +2 +3 +1 0 0] · 61'-75' [-4 -4 -2 -1 0 0 -1 0 -4 -3 -1 0 -1 -2 -3] · 76'-90' [-2 -2 -2 -3 -6 -7 -7 -4 -2 -1 -1 -1 +2 +2 +3] · 91'+ [0 +2 -1 -1 -1 -2]
    ⚽ gols: 23'✓ 33'✓ 80'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **1** · 16'-30' **1** · 31'-45' **3** ‖ 46'-60' **3** · 61'-75' **2** · 76'-90' **7**
  - vs Chapecoense (CASA · E 1-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [+1 0 -1 -2 +2 -2 -3 -3 0 0 +1 +3 +3 +2 +1] · 16'-30' [+1 0 0 +2 +3 0 -2 -2 -2 -3 -1 -1 +2 +3 +3] · 31'-45' [+3 +2 +2 +3 +3 +4 +4 +3 +3 +5 +6 +5 +7 +6 +3] · ‖INTERVALO‖ · 46'-60' [+2 +1 +3 +3 +2 +3 +5 +4 +3 -1 -1 -1 +3 +2 -1] · 61'-75' [+8 +4 +5 +5 +5 +3 +3 +5 +3 +2 +6 +9 +5 +3 +1] · 76'-90' [+1 -1 +2 0 -3 -2 -3 -3 -3 0 0 +2 +4 +4 +3] · 91'+ [+1 +2 +4 +4 +2 -3 -2]
    ⚽ gols: 71'✓ 81'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **5** · 31'-45' **2** ‖ 46'-60' **3** · 61'-75' **0** · 76'-90' **2**
  - @ Atlético Mineiro (FORA · D 1-3) — min 1→94:
    📈 pressão (net/min): 1'-15' [0 +1 +2 +1 +1 0 +1 +2 +3 -1 0 -1 -1 -2 -4] · 16'-30' [-3 -5 -6 -4 -5 -6 -8 -8 -10 -8 -6 -6 -2 -1 0] · 31'-45' [+1 +2 -1 -1 +1 +1 0 +1 +2 +2 +5 +2 0 0 +2] · ‖INTERVALO‖ · 46'-60' [+1 -2 +1 -2 -3 -4 -3 -2 -5 -3 -4 -3 -3 -3 -3] · 61'-75' [-7 -5 -4 -2 0 +1 +5 +5 +4 +3 +3 -1 -1 +1 0] · 76'-90' [0 -1 +1 -1 0 -2 -5 -3 0 0 0 -1 -4 0 +4] · 91'+ [+3 +5 +4 +4]
    ⚽ gols: 17'✗ 40'✓ 61'✗ 82'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **5** · 31'-45' **2** ‖ 46'-60' **4** · 61'-75' **5** · 76'-90' **0**
  - vs Fluminense (CASA · V 1-0) — min 1→95:
    📈 pressão (net/min): 1'-15' [0 +3 +4 +5 +2 +1 +1 -1 -1 -5 -5 -4 -3 -3 +1] · 16'-30' [+3 +2 +5 +5 +4 +3 0 -1 -1 +1 +3 +7 +5 +5 +3] · 31'-45' [+2 -1 -1 -1 0 +5 +3 +3 +3 +3 +2 +1 +2 +1 +3] · ‖INTERVALO‖ · 46'-60' [-3 -7 -5 -6 -4 -5 -1 0 +5 +6 +5 +3 +2 +1 +1] · 61'-75' [0 -1 -5 -3 +5 +3 +1 +2 +3 +2 +2 0 0 -1 -3] · 76'-90' [-3 -3 -1 -1 +2 +1 0 +2 +2 +3 +3 +3 +3 -1 -1] · 91'+ [-4 -6 -8 -7 -7]
    ⚽ gols: 36'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **1** · 16'-30' **3** · 31'-45' **4** ‖ 46'-60' **5** · 61'-75' **5** · 76'-90' **2**
  - @ Athletico PR (FORA · D 0-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 +1 +2 +4 +2 +1 0 0 +2 +3 +3 +2 0 0 +1] · 16'-30' [+5 +4 +3 +1 -1 0 0 -2 -2 -1 -2 -4 -4 -6 -5] · 31'-45' [-5 -5 -4 -2 -1 -1 +1 +1 +2 +2 +2 +2 +4 +3 0] · ‖INTERVALO‖ · 46'-60' [+5 0 -1 -2 +1 0 -4 -1 -1 0 +2 +4 +4 +2 0] · 61'-75' [-1 -1 -3 -3 -10 -10 -10 -6 -4 -4 -4 -4 -7 -7 -3] · 76'-90' [-4 -3 -3 +1 +1 +2 +2 +2 0 -2 -2 -3 -7 -7 -4] · 91'+ [-4 -4 0 0 -4 -2 0]
    ⚽ gols: 88'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **4** ‖ 46'-60' **6** · 61'-75' **6** · 76'-90' **2**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.06 · 16-30: 0.24 · 31-45: 0.35 · 46-60: 0.12 · 61-75: 0.12 · 76-90: 0.18
- Sofre por faixa (/j): 0-15: 0.12 · 16-30: 0.29 · 31-45: 0.12 · 46-60: 0.06 · 61-75: 0.24 · 76-90: 0.59
- 1ºT: marca 11 / sofre 9 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (18): **4 de bola parada (22%)** — escanteio 2 · falta 1 · pênalti 1 · contra-ataque 0 · jogo corrido 5 · sem narração 9
- Gols sofridos (24): **5 de bola parada (21%)** — escanteio 0 · falta 0 · pênalti 5 · contra-ataque 2 · jogo corrido 10 · sem narração 7
- Escanteios: **5.7 a favor / 4.8 contra por jogo** (média da liga: 5 por time)

### Jogo físico — aéreo, faltas e erros (season)
- **Cabeceios certos: 12.9 feito / 10.5 sofrido por jogo** (domínio do alto — cruze com o % de gols de bola parada acima)
- Aéreo por jogador (líderes, ganhos/disputados): **João Victor** 2.9/4 por j (72%) · **Willian Machado** 2.9/3.1 por j (93%)
- Faltas — quem mais SOFRE (cava pênalti/bola parada a favor): **Negueba** 2.1/j · **Alesson** 1.5/j · quem mais COMETE (risco de pênalti/falta perigosa contra): **Igor Formiga** 1.6/j · **José Aldo** 1.4/j
- **Erros que viraram finalização: 11 na season** — José Aldo 3 (chance DE GRAÇA pro adversário — não aparece no λ)

### Desfalques de Mirassol neste jogo
- **Nathan Fogaça** (Ankle Sprain) — 2 gols + 0 assists até a data; season: **11% dos gols** do time (11% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.3 g/j (10j) vs sem ele 0.71 g/j (7j) = −45%; finaliza **0.9 SoT/jogo** (time: 6 SoT/j com ele vs 2.86 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0.3 desarmes/j · 1.6 duelos ganhos/j · 0 cruz. certos/j · 0.2 dribles certos/j · 0.3 key passes/j · 0.5 aéreos ganhos/j · 0.6 faltas sofridas/j
- **Willian Machado** (Yellow Card Suspension) — 1 gols + 1 assists até a data; season: **6% dos gols** do time (11% com assists); **últimos 5 jogos do time**: participou de 2/5 gols = **40%** (↑ mais decisivo AGORA); with/without: com ele 1.13 g/j (15j) vs sem ele 0.5 g/j (2j) = −56%; finaliza **0.33 SoT/jogo** (time: 4.8 SoT/j com ele vs 4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.1 interceptações/j** (~15% do time) · 1.5 desarmes/j · 5.1 duelos ganhos/j · 0.1 cruz. certos/j · 0.1 dribles certos/j · 0.5 key passes/j · 2.9 aéreos ganhos/j · 0.8 faltas sofridas/j
- **Negueba** (Unknown Injury) — 2 gols + 0 assists até a data; season: **11% dos gols** do time (11% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.22 g/j (9j) vs sem ele 0.88 g/j (8j) = −28%; finaliza **0.67 SoT/jogo** (time: 5.67 SoT/j com ele vs 3.63 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.1 interceptações/j** (~13% do time) · 1.1 desarmes/j · 5.3 duelos ganhos/j · 2 cruz. certos/j · 1.8 dribles certos/j · 2 key passes/j · 0.6 aéreos ganhos/j · 2.1 faltas sofridas/j
- **Gabriel Pires** (Unknown Injury) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (6% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 0.71 g/j (7j) vs sem ele 1.3 g/j (10j) = +83%; finaliza **0.57 SoT/jogo** (time: 4.57 SoT/j com ele vs 4.8 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.6 interceptações/j** (~7% do time) · 0.4 desarmes/j · 2.7 duelos ganhos/j · 0.3 cruz. certos/j · 0.6 dribles certos/j · 0.3 key passes/j · 0.7 aéreos ganhos/j · 1 faltas sofridas/j
- **Alex Muralha** (Calf Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.06 g/j (17j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Tiquinho Soares** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (≈ estável); with/without: com ele 0.43 g/j (7j) vs sem ele 1.5 g/j (10j) = +249%; finaliza **0.57 SoT/jogo** (time: 3 SoT/j com ele vs 5.9 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0.3 desarmes/j · 2 duelos ganhos/j · 0 cruz. certos/j · 0.1 dribles certos/j · 0.6 key passes/j · 0.6 aéreos ganhos/j · 1 faltas sofridas/j

## Grêmio (visita) — até 2026-07-17

### Gols & finalização (season)
- Total **20 marcados / 23 sofridos** em 18j · média **1.11 marca / 1.28 sofre** por jogo
- **Fora (9j): marca 0.56 / sofre 1.33** (5 gols) · por tempo: 1ºT 0.44/0.5 · 2ºT 0.67/0.78
- **Finalização: 66 SoT (3.67/j · fora 2.22/j) · conv 29%** (aberta, −1 pên) · sofre 4.56 SoT/j (adv 26%) · 7.83 KP/j
- **Volume: 11.3 chutes/j (6.2 na área) · big chances: cria 1.9/desperdiça 1.2 por j** · posse 49.4%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 37.8/44.9 · chutes pra fora 4.8/7.2 · bloqueados 3.2/2.7 · de fora da área 5.1/5.6
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 32.6/51.4 · chutes pra fora 4.6/8.8 · bloqueados 2/4 · de fora da área 3/6.6

### Goleiro (season — a trava da conversão defensiva)
  - **Weverton** (titular, 17j · ~90 min/j) · **2.88 defesas/j** (73% dentro da área — chance clara) · **save% 71** (49 defesas / 20 gols sofridos nos jogos dele)
  - ⚠️(fora) **Thiago Beltrame** (reserva, 1j · ~75 min/j) · **5 defesas/j** (20% dentro da área — chance clara) · **save% 63** (5 defesas / 3 gols sofridos nos jogos dele)

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.77**
  - **Weverton** nota **7.01** (season) · forma 7.1= (últ.5 do time: 7.6→7.3→7.5→6→– 📉 caindo) · **faltou 1/5** · 3× MOTM · 17j
    ↳ 🧤 **2.88 defesas/j** (73% dentro da área) · **save% 71** (49 defesas / 20 gols sofridos nos jogos dele) · ~90 min/j
  - **Carlos Vinícius** nota **6.93** (season) · forma 6.88= (últ.5 do time: –→6.5→6.7→8.5→5.8 📈 subindo) · **faltou 1/5** · 2× MOTM · 17j
    ↳ **9G+0A** · gols aos 7',26',38',40',50',54',57',59',75' · **2 chutes/j (pontaria 56%)** · 1.12 SoT/j (últ.5: 0.8↓) · big chances: cria 0/perde 0.18 por j · 0.12 KP/j (últ.5: 0↓) · 0.06 chances criadas/j · 0.12 dribles/j · 0.65 passes no 3º final/j
    ↳ aéreo **1.24/2.12 por j (58%)** · faltas: sofre 1.06/comete 1.41 por j · def: 0.18 desarme + 0.12 int + 2.53 duelo/j · 0.29 cortes/j · perde 0.65 bolas pressionado/j · 15 toques/j · ~82 min/j
  - **Cristian Pavón** nota **7.17** (season) · forma 7.5↑ (últ.5 do time: 7.6→6.6→–→8.3→– 📈 subindo) · **faltou 2/5** · 16j
    ↳ **0G+2A** · **0.56 chutes/j (pontaria 44%)** · 0.25 SoT/j (últ.5: 0.2=) · big chances: cria 0.25/perde 0 por j · 1.81 KP/j (últ.5: 3↑) · 1.19 chances criadas/j · 1.38 dribles/j · 5.63 passes no 3º final/j
    ↳ aéreo **0.81/0.69 por j (118%)** · faltas: sofre 0.25/comete 0.69 por j · def: 1.94 desarme + 1.38 int + 4.31 duelo/j · 2.13 cortes/j · 2 cruz/j · perde 0.69 bolas pressionado/j · ⚠️ **2 erro(s)→chute** na season · 65 toques/j · ~78 min/j
  - **Viery** nota **6.81** (season) · forma 6.53↓ (últ.5 do time: –→6.7→6.9→6.5→6 📉 caindo) · **faltou 1/5** · 1× MOTM · 13j
    ↳ **1G+0A** · gols aos 62' — mais no 2ºT · **0.46 chutes/j (pontaria 33%)** · 0.15 SoT/j (últ.5: 0.4↑) · big chances: cria 0/perde 0.08 por j · 0.31 KP/j (últ.5: 0.2↓) · 0.15 chances criadas/j · 0 dribles/j · 8.54 passes no 3º final/j
    ↳ aéreo **1.92/2.62 por j (74%)** · faltas: sofre 0.62/comete 1.54 por j · def: 2.38 desarme + 0.62 int + 4.92 duelo/j · 6.54 cortes/j (+1 último homem) · perde 0.23 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 76 toques/j · ~90 min/j
  - **Francis Amuzu** nota **6.89** (season) · forma 6.85= (últ.5 do time: –→6.7→6.7→7.5→6.5 📈 subindo) · **faltou 1/5** · 16j
    ↳ **1G+3A** · gols aos 54' — mais no 2ºT · **1.75 chutes/j (pontaria 29%)** · 0.5 SoT/j (últ.5: 0.2↓) · big chances: cria 0.25/perde 0.06 por j · 0.75 KP/j (últ.5: 1.2↑) · 0.44 chances criadas/j · 0.38 dribles/j · 1.06 passes no 3º final/j
    ↳ aéreo **0.25/0.19 por j (133%)** · faltas: sofre 1.19/comete 0.75 por j · def: 0.44 desarme + 0.13 int + 2.06 duelo/j · 0.13 cortes/j · 0.44 cruz/j · perde 0.69 bolas pressionado/j · 29 toques/j · ~65 min/j
  - **Erick Noriega** nota **6.98** (season) · forma 6.8↓ (últ.5 do time: –→7→6.6→6.8→– ➡️ estável) · **faltou 2/5** · 13j
    ↳ **1G+1A** · gols aos 51' — mais no 2ºT · **0.54 chutes/j (pontaria 43%)** · 0.23 SoT/j (últ.5: 0.2=) · big chances: cria 0/perde 0.08 por j · 0.77 KP/j (últ.5: 0.6↓) · 0.23 chances criadas/j · 0.46 dribles/j · 6.69 passes no 3º final/j
    ↳ aéreo **1.08/0.54 por j (200%)** · faltas: sofre 1.15/comete 1.23 por j · def: 1.38 desarme + 1 int + 4 duelo/j · 2 cortes/j · 0.08 cruz/j · perde 0.54 bolas pressionado/j · 52 toques/j · ~73 min/j
  - **Gustavo Martins** nota **6.93** (season) · forma 7.55↑ (últ.5 do time: 8.1→7→–→–→– ⚠️ poucos jogos na janela) · **faltou 3/5** · 1× MOTM · 11j
    ↳ **0G+2A** · **0.82 chutes/j (pontaria 22%)** · 0.18 SoT/j (últ.5: 0↓) · big chances: cria 0.09/perde 0.18 por j · 0.55 KP/j (últ.5: 0.2↓) · 0.45 chances criadas/j · 0.18 dribles/j · 3.82 passes no 3º final/j
    ↳ aéreo **2.36/2.27 por j (104%)** · faltas: sofre 0.27/comete 1.27 por j · def: 0.82 desarme + 1.27 int + 3.55 duelo/j · 4.36 cortes/j · ⚠️ **2 erro(s)→chute** na season · 51 toques/j · ~81 min/j
  - ⚠️(fora) **José Enamorado** nota **6.59** (season) · forma 6.52= (últ.5 do time: 6.3→6.7→6.8→6.3→6.5 ➡️ estável) · 17j
    ↳ **0G+2A** · **0.76 chutes/j (pontaria 23%)** · 0.18 SoT/j (últ.5: 0↓) · big chances: cria 0.12/perde 0.06 por j · 0.53 KP/j (últ.5: 0.2↓) · 0.29 chances criadas/j · 0.82 dribles/j · 0.94 passes no 3º final/j
    ↳ aéreo **0.18/0.12 por j (150%)** · faltas: sofre 1.47/comete 0.88 por j · def: 1.41 desarme + 0.24 int + 3.88 duelo/j · 0.18 cortes/j · 0.29 cruz/j · perde 1.18 bolas pressionado/j · 26 toques/j · ~50 min/j
  - **Arthur Melo** 🎖️capitão nota **6.9** (season) · forma 6.9= (últ.5 do time: –→–→–→7→6.8 ⚠️ poucos jogos na janela) · **faltou 3/5** · 10j
    ↳ **0.3 chutes/j (pontaria 0%)** · 0 SoT/j (últ.5: 0=) · big chances: cria 0.1/perde 0 por j · 0.8 KP/j (últ.5: 1↑) · 0.6 chances criadas/j · 0.3 dribles/j · 8.6 passes no 3º final/j
    ↳ aéreo **0.6/0.3 por j (200%)** · faltas: sofre 3.2/comete 0.8 por j · def: 0.8 desarme + 0.8 int + 4.9 duelo/j · 0.9 cortes/j · 0.1 cruz/j · perde 0.8 bolas pressionado/j · 68 toques/j · ~81 min/j
  - **Juan Nardoni** nota **6.66** (season) · forma 6.3↓ (últ.5 do time: 6.3→–→–→–→– ⚠️ poucos jogos na janela) · **faltou 4/5** · 1× MOTM · 11j
    ↳ **1G+1A** · gols aos 45' · **0.73 chutes/j (pontaria 13%)** · 0.09 SoT/j (últ.5: 0↓) · big chances: cria 0/perde 0.18 por j · 0.55 KP/j (últ.5: 0.6=) · 0.36 chances criadas/j · 0.36 dribles/j · 4 passes no 3º final/j
    ↳ aéreo **0.82/1.36 por j (60%)** · faltas: sofre 1/comete 1.18 por j · def: 0.82 desarme + 1.09 int + 3 duelo/j · 0.91 cortes/j · perde 0.91 bolas pressionado/j · 35 toques/j · ~68 min/j
  - **Pedro Gabriel** nota **6.65** (season) · forma 6.48↓ (últ.5 do time: 7→6.4→6.7→–→5.8 📉 caindo) · **faltou 1/5** · 9j
    ↳ **0G+1A** · **0.56 chutes/j (pontaria 60%)** · 0.33 SoT/j (últ.5: 0.4↑) · big chances: cria 0.22/perde 0 por j · 0.78 KP/j (últ.5: 1↑) · 0.78 chances criadas/j · 0.33 dribles/j · 2.67 passes no 3º final/j
    ↳ aéreo **1.11/1.56 por j (71%)** · faltas: sofre 0.22/comete 1.56 por j · def: 1.78 desarme + 0.56 int + 3.44 duelo/j · 1.78 cortes/j · 0.89 cruz/j · perde 0.44 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 46 toques/j · ~79 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: DVEDE** (5pts) · **5 feitos / 7 sofridos** · marca 1= / sofre 1.4= g/j · SoT 2.4 feito / 5.8 sofrido
- **Consistência: MARCOU em 12/18** (casa 7/9 · fora 5/9) · não-marcou 6 · clean sheet 5 · BTTS 10/18
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- **Densidade da janela:** **5 jogos em 28 dias** (intervalos 8-7-6-7)
- 2026-05-02 · @ **Athletico PR** (fora · **Empate 0-0**, HT 0-0) — 0-5 SoT · posse 33%/48% (1ºT/2ºT) · adv 5º briga-top · você 11º briga-top · seu fora até ali 0.6 marca/1.6 sofre
- 2026-05-10 (+8d) · vs **Flamengo** (casa · **Derrota 0-1**, HT 0-0) — 3-5 SoT · posse 24%/29% (1ºT/2ºT) · adv 2º briga-top · você 15º briga-Z · seu casa até ali 1.8 marca/0.8 sofre
- 2026-05-17 (+7d) · @ **Bahia** (fora · **Empate 1-1**, HT 0-0) — 1-6 SoT · posse 40%/41% (1ºT/2ºT) · adv 6º briga-top · você 17º briga-Z · seu fora até ali 0.5 marca/1.4 sofre
- 2026-05-23 (+6d) · vs **Santos** (casa · **Vitória 3-2**, HT 1-1) — 5-4 SoT · posse 42%/50% (1ºT/2ºT) · adv 16º briga-Z · você 15º briga-Z · seu casa até ali 1.6 marca/0.9 sofre
- 2026-05-30 (+7d) · vs **Corinthians** (casa · **Derrota 1-3**, HT 1-1) — 3-9 SoT · posse 50%/44% (1ºT/2ºT) · adv 15º briga-Z · você 14º briga-Z · seu casa até ali 1.8 marca/1 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - @ Athletico PR (FORA · E 0-0) — min 1→96:
    📈 pressão (net/min): 1'-15' [-3 -4 -4 -5 -2 0 +1 +1 0 -3 -5 -5 -3 -3 -4] · 16'-30' [-3 -3 -3 -2 -2 -2 -1 -1 +1 +2 +1 0 -1 -4 -4] · 31'-45' [-4 -4 -4 -4 -3 -4 -3 -1 0 0 0 -1 +2 +2 -6] · ‖INTERVALO‖ · 46'-60' [-4 -4 +1 -3 0 -1 -4 -4 -2 -1 -3 -3 -2 0 0] · 61'-75' [+1 +1 0 0 0 +2 +3 +4 +4 +5 +5 +3 +5 +5 +6] · 76'-90' [+7 +7 +7 +6 +6 +5 +5 +2 +2 +2 -5 -3 -1 -1 0] · 91'+ [+2 +5 +3 +3 +4 +3]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **6** · 16'-30' **3** · 31'-45' **5** ‖ 46'-60' **9** · 61'-75' **2** · 76'-90' **0**
  - vs Flamengo (CASA · D 0-1) — min 1→95:
    📈 pressão (net/min): 1'-15' [-2 -3 -3 -4 -8 -6 -2 -1 -1 0 0 0 0 -2 -2] · 16'-30' [-2 -1 -2 -3 -2 0 -5 -4 -7 -10 -10 -6 -5 -5 -5] · 31'-45' [-5 -7 -5 -3 -1 +2 +1 0 0 -2 -1 +1 -1 -4 -3] · ‖INTERVALO‖ · 46'-60' [0 -1 +1 +3 0 -2 -8 -7 -5 -7 -10 -12 -9 -9 -7] · 61'-75' [-6 -7 -9 -7 -7 -4 +1 -5 -5 -4 +4 +4 +2 +2 0] · 76'-90' [-1 -1 0 +2 0 -2 -5 -4 -3 -5 -6 -5 -6 -6 -7] · 91'+ [-9 -4 -5 -3 -5]
    ⚽ gols: 68'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **6** · 31'-45' **6** ‖ 46'-60' **5** · 61'-75' **3** · 76'-90' **6**
  - @ Bahia (FORA · E 1-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 -2 -5 -4 -4 -8 -5 -3 -3 -1 0 -1 -1 -1 -1] · 16'-30' [-3 -5 -6 -6 -6 -7 -9 -9 -6 -8 -7 -4 -4 -2 -1] · 31'-45' [-1 0 0 0 0 -3 -2 -5 -3 -3 -2 -2 -2 -2 0] · ‖INTERVALO‖ · 46'-60' [-7 -6 -3 -1 0 -3 -2 -3 -3 -5 -3 -4 -9 -9 -9] · 61'-75' [-5 -5 -1 +2 +1 -1 -1 -2 -1 -2 -5 -5 -7 -9 -6] · 76'-90' [-3 -3 -2 -2 -2 -2 -2 -2 +2 +5 +3 0 -2 -1 -4] · 91'+ [-4 -6 -5 -5 -6 -5 -5]
    ⚽ gols: 62'✓ 72'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **4** ‖ 46'-60' **4** · 61'-75' **1** · 76'-90' **5**
  - vs Santos (CASA · V 3-2) — min 1→94:
    📈 pressão (net/min): 1'-15' [-1 -7 -9 -7 -3 0 0 +1 +4 +5 +3 +3 +3 -2 -3] · 16'-30' [-2 0 0 -5 -5 -3 -5 -8 -5 -1 -1 -1 +1 +1 +2] · 31'-45' [0 -4 -4 -1 +2 +4 +3 +4 +4 +10 +9 +9 +5 +2 +2] · ‖INTERVALO‖ · 46'-60' [+2 -2 -2 -3 -1 +2 +2 +3 -2 -4 -4 -5 -2 +3 +3] · 61'-75' [+3 +2 +2 +2 +4 +4 0 0 +4 +3 +3 +3 +5 +3 +3] · 76'-90' [+6 +7 +6 +6 +2 -2 -2 +2 +2 +2 +2 +1 -2 -2 -2] · 91'+ [-1 -1 -1 +2]
    ⚽ gols: 32'✗ 40'✓ 55'✗ 59'✓ 63'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **6** · 16'-30' **5** · 31'-45' **4** ‖ 46'-60' **3** · 61'-75' **3** · 76'-90' **5**
  - vs Corinthians (CASA · D 1-3) — min 1→96:
    📈 pressão (net/min): 1'-15' [0 +2 +1 +2 +3 +2 +1 +5 +7 +4 +3 +2 +2 +2 +1] · 16'-30' [+5 +3 0 -3 -4 -5 -6 -6 -4 -4 -2 -2 -3 -4 -7] · 31'-45' [-5 -6 -9 -7 -11 -8 -6 -2 -3 -2 -2 -2 -2 0 +1] · ‖INTERVALO‖ · 46'-60' [-9 -10 -7 -6 -4 -4 -6 -6 -5 -1 -1 +2 0 0 0] · 61'-75' [+3 +4 +5 +3 +1 -4 -3 -7 -6 -6 -5 -4 -3 +2 +3] · 76'-90' [+3 +3 +3 +3 +2 -1 -2 -3 -4 -5 0 -1 -1 -4 -4] · 91'+ [-4 -3 -3 -3 -3 0]
    ⚽ gols: 7'✓ 45'✗ 65'✗ 67'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **6** · 16'-30' **5** · 31'-45' **3** ‖ 46'-60' **6** · 61'-75' **2** · 76'-90' **4**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.11 · 16-30: 0.11 · 31-45: 0.22 · 46-60: 0.39 · 61-75: 0.22 · 76-90: 0.06
- Sofre por faixa (/j): 0-15: 0.06 · 16-30: 0.17 · 31-45: 0.28 · 46-60: 0.33 · 61-75: 0.39 · 76-90: 0.06
- 1ºT: marca 8 / sofre 9 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (20): **2 de bola parada (10%)** — escanteio 1 · falta 0 · pênalti 1 · contra-ataque 0 · jogo corrido 14 · sem narração 4
- Gols sofridos (23): **2 de bola parada (9%)** — escanteio 0 · falta 0 · pênalti 2 · contra-ataque 0 · jogo corrido 9 · sem narração 12
- Escanteios: **3.9 a favor / 4.7 contra por jogo** (média da liga: 5 por time)

### Jogo físico — aéreo, faltas e erros (season)
- **Cabeceios certos: 7.1 feito / 7.7 sofrido por jogo** (domínio do alto — cruze com o % de gols de bola parada acima)
- Aéreo por jogador (líderes, ganhos/disputados): **Gustavo Martins** 2.4/2.3 por j (104%) · **Viery** 1.9/2.6 por j (74%) · **Carlos Vinícius** 1.2/2.1 por j (58%)
- Faltas — quem mais SOFRE (cava pênalti/bola parada a favor): **Arthur Melo** 3.2/j · **Marlon** 1.7/j · quem mais COMETE (risco de pênalti/falta perigosa contra): **Leonel Pérez** 1.8/j · **Pedro Gabriel** 1.6/j
- **Erros que viraram finalização: 10 na season** — Cristian Pavón 2 · Wagner Leonardo 2 · Gustavo Martins 2 (chance DE GRAÇA pro adversário — não aparece no λ)

### Desfalques de Grêmio neste jogo
- **José Enamorado** (Yellow Card Suspension) — 0 gols + 2 assists até a data; season: **0% dos gols** do time (10% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 0.88 g/j (17j) vs sem ele 5 g/j (1j) = +468%; finaliza **0.18 SoT/jogo** (time: 3.41 SoT/j com ele vs 8 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.2 interceptações/j** (~2% do time) · 1.4 desarmes/j · 3.9 duelos ganhos/j · 0.3 cruz. certos/j · 0.8 dribles certos/j · 0.5 key passes/j · 0.2 aéreos ganhos/j · 1.5 faltas sofridas/j
- **Marlon** (Ankle Injury) — 1 gols + 1 assists até a data; season: **5% dos gols** do time (10% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.83 g/j (6j) vs sem ele 0.75 g/j (12j) = −59%; finaliza **0.5 SoT/jogo** (time: 5.17 SoT/j com ele vs 2.92 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.3 interceptações/j** (~12% do time) · 3.7 desarmes/j · 5.8 duelos ganhos/j · 1.3 cruz. certos/j · 0.3 dribles certos/j · 1.7 key passes/j · 0.5 aéreos ganhos/j · 1.7 faltas sofridas/j
- **Fabián Balbuena** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (≈ estável); with/without: com ele 1.29 g/j (7j) vs sem ele 1 g/j (11j) = −22%; finaliza **0 SoT/jogo** (time: 3.43 SoT/j com ele vs 3.82 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.6 interceptações/j** (~17% do time) · 1.1 desarmes/j · 3 duelos ganhos/j · 0.1 cruz. certos/j · 0.1 dribles certos/j · 0 key passes/j · 1.6 aéreos ganhos/j · 0.1 faltas sofridas/j
- **Roger** (Hamstring Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (≈ estável); with/without: com ele 1.5 g/j (2j) vs sem ele 1.06 g/j (16j) = −29%; finaliza **0.5 SoT/jogo** (time: 6.5 SoT/j com ele vs 3.31 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0.5 desarmes/j · 0.5 duelos ganhos/j · 0.5 cruz. certos/j · 0 dribles certos/j · 0.5 key passes/j
- **Thiago Beltrame** (Red Card Suspension) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (≈ estável); with/without: com ele 1 g/j (1j) vs sem ele 1.12 g/j (17j) = +12%; finaliza **0 SoT/jogo** (time: 3 SoT/j com ele vs 3.71 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0 interceptações/j** (~0% do time) · 0 desarmes/j · 1 duelos ganhos/j · 0 cruz. certos/j · 0 dribles certos/j · 0 key passes/j · 1 faltas sofridas/j
- **M. Nascimento de Paula** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.11 g/j (18j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **João Pedro** (Thigh Muscle Strain) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/5 gols = **0%** (≈ estável); with/without: com ele 1.8 g/j (5j) vs sem ele 0.85 g/j (13j) = −53%; finaliza **0 SoT/jogo** (time: 4.6 SoT/j com ele vs 3.31 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.4 interceptações/j** (~4% do time) · 0.6 desarmes/j · 2 duelos ganhos/j · 0.4 cruz. certos/j · 0.8 dribles certos/j · 0 key passes/j · 0.2 aéreos ganhos/j · 0.4 faltas sofridas/j

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Mirassol atacando × Grêmio defendendo**
| Faixa | Mirassol marca/j | Grêmio sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.06 | 0.06 | 0.12 |
| 16-30 | 0.24 | 0.17 | 0.41 |
| 31-45 | 0.35 | 0.28 | 0.63 |
| 46-60 | 0.12 | 0.33 | 0.45 |
| 61-75 | 0.12 | 0.39 | 0.51 |
| 76-90 | 0.18 | 0.06 | 0.24 |

**Grêmio atacando × Mirassol defendendo**
| Faixa | Grêmio marca/j | Mirassol sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.11 | 0.12 | 0.23 |
| 16-30 | 0.11 | 0.29 | 0.4 |
| 31-45 | 0.22 | 0.12 | 0.34 |
| 46-60 | 0.39 | 0.06 | 0.45 |
| 61-75 | 0.22 | 0.24 | 0.46 |
| 76-90 | 0.06 | 0.59 | 0.65 |

### Cruzamento de MOMENTUM (fluxo minuto-a-minuto dos últimos 5, já cruzado pra você)
A curva de momentum foi digerida e CRUZADA em código — não precisa cruzar 90 pontos na mão, use a conclusão abaixo (quem domina cada janela) junto com o cruzamento de gols acima.

**Janela de gol provável pela curva de momentum** — Mirassol: **16-30** (domínio +3.1) · Grêmio: **61-75** (domínio -0.1). Cruze com o timing de gols e com a intenção: se a janela de quem PRECISA do gol coincide com a fraqueza do outro, é ali que o gol tende a sair.

| Faixa | Mirassol domínio/j | Grêmio domínio/j | cruzamento |
|---|---|---|---|
| 0-15 | +0.3 | -1.2 | +1.5 ≈ |
| 16-30 | -0.2 | -3.3 | +3.1 🏠 |
| 31-45 | +1.4 | -1.4 | +2.8 🏠 |
| 46-60 | -0.2 | -3.2 | +3 🏠 |
| 61-75 | -0.4 | -0.3 | -0.1 ≈ |
| 76-90 | -0.8 | -0.7 | -0.1 ≈ |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Mirassol (casa) = 1.04 · λ Grêmio (fora) = 0.62 · total = 1.66

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Mirassol: λ_SoT 5.5 × conv 21% → **1.16 gols**
- Grêmio: λ_SoT 2.29 × conv 29% → **0.66 gols**
- total via SoT = 1.82
- **Índice de volume do jogo**: λ_SoT total 7.8 vs média da liga 9.1 SoT → **ABAIXO** (jogo travado → pressão de UNDER)
- **Se A e B divergirem, prefira A.** Isto inverte a regra anterior ("prefira B, volume é mais estável"), que foi **medida e reprovada**: em 56 jogos já disputados (PL 42 + BRA 14, auditoria de 2026-07-20, `scripts/_audit-total-bias.ts`), a Rota A errou **-0,32** gol por jogo e a Rota B **-0,56** — preferir B custava 0,24 gol de viés adicional, e o total final colava na Rota B (delta +0,04), ou seja, a instrução estava de fato mandando no resultado.
- **AS DUAS ROTAS SUBESTIMAM EM RODADA FINAL — e provavelmente só ali (a amostra não permite afirmar mais).** Na mesma auditoria o real médio foi **3,02** contra 2,50 projetados, com **64% dos jogos acima do previsto**; e a subestimação cresce quanto MENOR o prior (prior ~1,95 → real 2,93; prior ~3,23 → real 3,12, correto). **Limitação que impede generalizar: 50 dos 56 jogos auditados são de rodada ≥35**, e rodada final tem mais gol por natureza (PL +0,14 · Brasileirão +0,48 vs o resto da temporada, medido nas 380 partidas de cada). O grupo de controle tem n=6 — não dá pra separar viés do modelo de composição da amostra. **Uso correto desta nota:** em **rodada final ou jogo sem nada em jogo pra um dos lados**, desconfie de prior baixo — "time sem objetivo" costuma abrir o jogo, não travá-lo, e é aí que o quant mais erra. **Fora desse contexto, não aplique o ajuste** — não há evidência de viés medida em rodada de meio de temporada.
- **Não aplique fator de correção fixo.** Multiplicar o prior por uma constante (testado: ×1,12) zera o viés médio mas estraga os extremos (passa a superestimar +0,49 nos jogos de prior alto). O ajuste correto é qualitativo e assimétrico: subir a desconfiança no prior baixo, não empurrar tudo pra cima.

## Probabilidades de mercado (Poisson corrigido por **Dixon-Coles** sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 43/37/20% | 46/34/19% |
| Over 1.5 | 51% | 56% |
| Over 2.5 | 23% | 27% |
| Over 3.5 | 9% | 11% |
| BTTS | 31% | 35% |

**Mercados derivados do MESMO grid corrigido** (Rota B — já coerentes entre si; use como prior destes mercados):
- **Dupla chance**: 1X **81%** · 12 **66%** · X2 **54%** · **Draw No Bet** casa 70% / fora 30%
- **Placar exato (mais prováveis)**: 0-0 18% · 1-0 17% · 1-1 14% · 2-0 11%
- **Odd/Even**: ímpar 45% / par 55% · **Multigoals**: 0-1 44% · 2-3 45% · 4+ 11%
- **Team totals** (marginais do λ da Rota B — a prob de CADA time marcar; base do `team_total`): Mirassol over 0.5 **69%** / over 1.5 **32%** · Grêmio over 0.5 **48%** / over 1.5 **14%**
- **Fair odds no-vig (1x2, calculadas pelo grid — não pelo mercado)**: casa 2.16 · empate 2.91 · fora 5.17. São PROBABILIDADE JUSTA, não veredito de valor (sem odds do mercado ingeridas não há EV/CLV — não prometa "aposta certa").
- ⚠️ O grid Dixon-Coles JÁ corrige o empate pra cima (o Poisson independente o subestima). **O empate / dupla chance é pick LEGÍTIMO** quando o prior aqui aponta — NÃO o rebaixe por covardia; num jogo travado de poucos gols o X costuma ser o de MENOR variância com valor.

**Baseline da liga (1ºT/2ºT):** 46% dos gols saem no 1º tempo / 54% no 2º (sobre 179 jogos jogados). Use como referência pra dizer se um time é ANÔMALO no timing (o padrão da literatura é ~44/56 — 2º tempo mais goleador por fadiga/game-state).
**Baseline por faixa de 15min (% dos gols da liga):** 0-15: 12% · 16-30: 16% · 31-45: 18% · 46-60: 18% · 61-75: 15% · 76-90: 22%. É a curva NORMAL — compare o timing de cada time (bloco "Distribuição de gols por faixa") contra ela; desvio grande (marca/sofre muito mais que a liga numa janela) é o sinal de onde o gol tende a sair NESTE jogo.

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **42/45/12%** · 2ºT **26/51/23%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Mirassol) e `away` (= Grêmio), cada um com:
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
