# Prognóstico de expected goals — São Paulo x Athletico PR

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
- Data: 2026-07-22 21:30 · Rodada 19 · Liga BRA
- Local: Estádio Cícero Pompeu de Toledo, São Paulo (grass)
- Clima: — (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: São Paulo 52 dias (último: liga, 2026-05-31) · Athletico PR 53 dias (último: liga, 2026-05-30)
- Viagem do visitante: ~344 km
- Densidade da janela de forma: **São Paulo** **5 jogos em 28 dias** (intervalos 7-6-7-8) · **Athletico PR** **5 jogos em 28 dias** (intervalos 8-7-7-6)
- Dureza da janela (últ.5): **São Paulo** 2/5 vs top-6 · duelos 86/j (-8%) · faltas 26.4/j (-3%) · cartões 6.4/j (+29%) → **sequência NEUTRA** · **Athletico PR** 1/5 vs top-6 · duelos 81/j (-13%) · faltas 21.0/j (-23%) · cartões 5.2/j (+5%) → **sequência LEVE** (só 1/5 vs top-6, duelos -13% vs liga, faltas -23%)
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- **Densidade + Dureza da janela** (as 2 linhas acima — MOD-008/MOD-009): leem o que o Descanso sozinho não vê — "5 jogos em 14 dias" ≠ os mesmos 5 num mês, e sequência contra top-6 pesada em duelos desgasta mais que a mesma contagem contra a parte de baixo. Três travas: (1) é **evidência QUALITATIVA** pro seu ajuste de cenário — NUNCA recalcule λ/probabilidades por isso; (2) o sinal é a **ASSIMETRIA** (um lado em maratona dura, o outro em semana cheia leve) — densidade/dureza parecidas dos dois lados ≈ ruído; (3) **não dupla-conte** com o Descanso: o último intervalo já está na linha própria, e densidade BAIXA não é frescor garantido (pausa de calendário ≠ time descansado por mérito). Cruzamento que importa: **densidade/dureza ALTA + este jogo SEM stake real → rodízio provável** — confira o XI provável/minutagem e os "VIVOS fora do XI" antes de confiar no time-base.
- Média da liga (pré-jogo, 182 jogos): mandante 1.555 gols/jogo · visitante 1.093 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.46 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-07-22)
- São Paulo: 8º, 25 pts · Athletico PR: 5º, 30 pts
- Linhas: segurança (sair do Z) 21 pts (16º) · Libertadores 30 pts (5º) · última vaga continental 24 pts (11º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - São Paulo: 8º, 25 pts, 20 jogo(s) restante(s) (máx possível 85 pts)
  - sem risco de queda hoje: 8º, 4 pts acima da linha de segurança (20 jogos, 60 pts em disputa) — matematicamente indefinido, mas NÃO é briga dele.
  - ainda pode ser CAMPEÃO — precisa vencer.
  - Libertadores ao alcance (5 pts da linha).
  - → motivação: **alta** — PRECISA LUTAR — briga pelo título
  - disputa pela vaga (8º): o São Paulo **precisa vencer** pra travar (empate ainda deixa 12 rivais vivos). Quem ainda ameaça → Botafogo (9º, 25 pts, máx 85) pode **passar em pontos** — vencendo, se o São Paulo tropeçar; Vitória (10º, 25 pts, máx 85) pode **passar em pontos** — vencendo, se o São Paulo tropeçar; Atlético Mineiro (11º, 24 pts, máx 81) pode **passar em pontos** — vencendo, se o São Paulo tropeçar; Corinthians (12º, 24 pts, máx 84) pode **passar em pontos** — vencendo, se o São Paulo tropeçar; +8 atrás (perseguição remota, 20 jogos pra fechar)
  - Athletico PR: 5º, 30 pts, 20 jogo(s) restante(s) (máx possível 90 pts)
  - sem risco de queda hoje: 5º, 9 pts acima da linha de segurança (20 jogos, 60 pts em disputa) — matematicamente indefinido, mas NÃO é briga dele.
  - ainda pode ser CAMPEÃO — precisa vencer.
  - está NA zona de Libertadores (5º) — defendendo a vaga, ainda não garantida.
  - → motivação: **alta** — PRECISA LUTAR — briga pelo título
  - disputa pela vaga (5º): o Athletico PR **precisa vencer** pra travar (empate ainda deixa 15 rivais vivos). Quem ainda ameaça → Bahia (6º, 29 pts, máx 86) pode **passar em pontos** — vencendo, se o Athletico PR tropeçar; Coritiba (7º, 26 pts, máx 86) pode **passar em pontos** — vencendo, se o Athletico PR tropeçar; São Paulo (8º, 25 pts, máx 85) pode **passar em pontos** — vencendo, se o Athletico PR tropeçar; Botafogo (9º, 25 pts, máx 85) pode **passar em pontos** — vencendo, se o Athletico PR tropeçar; +11 atrás (perseguição remota, 20 jogos pra fechar)

🔥 **VEREDITO DE INTENÇÃO: OS DOIS PRECISAM IR PRA CIMA** (nenhum se contenta com empate) → o jogo tende a ABRIR. Over / handicap de quem ataca / team_total GANHAM peso — aposta de gol é COERENTE aqui.

## H2H — confronto direto São Paulo × Athletico PR (liga 2 seasons + copas, até 2026-07-22)
- **Sem confronto direto na janela ingerida** (par inédito ou recém-promovido) — não há precedente a citar; pese só forma/estilo.

## São Paulo (manda) — até 2026-07-22

### Gols & finalização (season)
- Total **23 marcados / 20 sofridos** em 18j · média **1.28 marca / 1.11 sofre** por jogo
- **Em casa (8j): marca 1.75 / sofre 0.75** (14 gols) · por tempo: 1ºT 0.39/0.44 · 2ºT 0.89/0.67
- **Finalização: 74 SoT (4.11/j · casa 4.13/j) · conv 27%** (aberta, −3 pên) · sofre 3.94 SoT/j (adv 27%) · 9.33 KP/j
- **Volume: 11.8 chutes/j (7.4 na área) · big chances: cria 2.3/desperdiça 1.3 por j** · posse 53.4%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 42.4/34.7 · chutes pra fora 4.4/5.7 · bloqueados 3.3/2.9 · de fora da área 4.4/5.1
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 43.2/46.8 · chutes pra fora 3.6/6.2 · bloqueados 3.6/2.8 · de fora da área 4.2/4.6

### Goleiro (season — a trava da conversão defensiva)
  - ⚠️(fora) **Rafael** (titular, 18j · ~90 min/j) · **2.67 defesas/j** (58% dentro da área — chance clara) · **save% 71** (48 defesas / 20 gols sofridos nos jogos dele) · ⚠️ **1 erro(s) que viraram finalização**

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.8**
  - ⚠️(fora) **Rafael** nota **6.77** (season) · forma 6.74= (últ.5 do time: 7.3→6.2→6.1→7.5→6.6 📈 subindo) · 18j
    ↳ 🧤 **2.67 defesas/j** (58% dentro da área) · **save% 71** (48 defesas / 20 gols sofridos nos jogos dele) · ⚠️ **1 erro(s)→chute** na season · ~90 min/j
  - **Jonathan Calleri ** 🎖️capitão nota **6.9** (season) · forma 6.72↓ (últ.5 do time: 6.7→6.5→–→7.2→6.5 📈 subindo) · **faltou 1/5** · 1× MOTM · 16j
    ↳ **6G+1A** · gols aos 12',59',60',66',68',87' — mais no 2ºT · **2.38 chutes/j (pontaria 37%)** · 0.88 SoT/j (últ.5: 0.2↓) · big chances: cria 0.19/perde 0.5 por j · 1 KP/j (últ.5: 1.2=) · 0.38 chances criadas/j · 0.13 dribles/j · 1.44 passes no 3º final/j
    ↳ aéreo **2.81/6.25 por j (45%)** · faltas: sofre 2.19/comete 1.63 por j · def: 0.56 desarme + 0.25 int + 5.63 duelo/j · 1 cortes/j · 0.25 cruz/j · perde 1.25 bolas pressionado/j · 30 toques/j · ~85 min/j
  - **Danielzinho** nota **7.01** (season) · forma 6.76↓ (últ.5 do time: 6.8→7→6.6→6.8→6.6 📉 caindo) · 2× MOTM · 16j
    ↳ **1G+1A** · gols aos 71' — mais no 2ºT · **0.56 chutes/j (pontaria 22%)** · 0.13 SoT/j (últ.5: 0.2↑) · big chances: cria 0.13/perde 0.06 por j · 0.81 KP/j (últ.5: 0.4↓) · 0.31 chances criadas/j · 0.13 dribles/j · 6.63 passes no 3º final/j
    ↳ aéreo **0.88/0.75 por j (117%)** · faltas: sofre 2/comete 0.88 por j · def: 0.94 desarme + 1.13 int + 3.88 duelo/j · 1.38 cortes/j · 0.63 cruz/j · perde 0.63 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 67 toques/j · ~80 min/j
  - ⚠️(fora) **Sabino** nota **6.99** (season) · forma 6.83↓ (últ.5 do time: 6.8→6.3→7.7→6.5→– 📈 subindo) · **faltou 1/5** · 1× MOTM · 15j
    ↳ **1G+1A** · gols aos 53' — mais no 2ºT · **0.47 chutes/j (pontaria 43%)** · 0.2 SoT/j (últ.5: 0.2=) · big chances: cria 0.07/perde 0 por j · 0.2 KP/j (últ.5: 0.2=) · 0.07 chances criadas/j · 0.2 dribles/j · 6.27 passes no 3º final/j
    ↳ aéreo **2.27/2.73 por j (83%)** · faltas: sofre 0.67/comete 1.4 por j · def: 2.07 desarme + 1.13 int + 5.13 duelo/j · 5.87 cortes/j (+3 último homem) · 0.13 cruz/j · perde 0.27 bolas pressionado/j · 59 toques/j · ~84 min/j
  - **Alan Franco** nota **6.73** (season) · forma 6.83= (últ.5 do time: 7→–→–→6.7→6.8 ➡️ estável) · **faltou 2/5** · 13j
    ↳ **0.31 chutes/j (pontaria 0%)** · 0 SoT/j (últ.5: 0=) · big chances: cria 0/perde 0.08 por j · 0.15 KP/j (últ.5: 0↓) · 0.31 dribles/j · 6.31 passes no 3º final/j
    ↳ aéreo **1.77/3 por j (59%)** · faltas: sofre 0.15/comete 0.85 por j · def: 0.77 desarme + 0.54 int + 2.92 duelo/j · 4.54 cortes/j · perde 0.08 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 60 toques/j · ~83 min/j
  - **Damián Bobadilla** nota **6.91** (season) · forma 6.93= (últ.5 do time: 6.6→7.3→6.9→–→– 📈 subindo) · **faltou 2/5** · 14j
    ↳ **0G+2A** · **0.93 chutes/j (pontaria 38%)** · 0.36 SoT/j (últ.5: 0.2↓) · big chances: cria 0.29/perde 0 por j · 1.14 KP/j (últ.5: 1.6↑) · 0.57 chances criadas/j · 0.43 dribles/j · 5.5 passes no 3º final/j
    ↳ faltas: sofre 0.5/comete 1.36 por j · def: 1.79 desarme + 1.29 int + 2.71 duelo/j · 1.21 cortes/j · 0.21 cruz/j · perde 0.43 bolas pressionado/j · 46 toques/j · ~76 min/j
  - **Lucas Ramon** nota **6.87** (season) · forma 6.77= (últ.5 do time: 7.1→–→6.8→6.5→6.7 📉 caindo) · **faltou 1/5** · 12j
    ↳ **0G+1A** · **0.58 chutes/j (pontaria 43%)** · 0.25 SoT/j (últ.5: 0.4↑) · big chances: cria 0.17/perde 0 por j · 0.58 KP/j (últ.5: 0.6=) · 0.42 chances criadas/j · 0.92 dribles/j · 3.67 passes no 3º final/j
    ↳ aéreo **0.67/0.33 por j (200%)** · faltas: sofre 1.42/comete 0.58 por j · def: 1.75 desarme + 1.42 int + 4.75 duelo/j · 3.17 cortes/j · 0.67 cruz/j · perde 0.25 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 56 toques/j · ~82 min/j
  - **Luciano** nota **7.08** (season) · forma 6.93= (últ.5 do time: 6.6→6.9→–→7.3→– 📈 subindo) · **faltou 2/5** · 3× MOTM · 14j
    ↳ **6G+1A** · gols aos 4',10',41',47',61',76' · **2 chutes/j (pontaria 39%)** · 0.79 SoT/j (últ.5: 1↑) · big chances: cria 0.14/perde 0.14 por j · 1.29 KP/j (últ.5: 1.4=) · 0.71 chances criadas/j · 0.14 dribles/j · 2.93 passes no 3º final/j
    ↳ aéreo **0.71/0.79 por j (91%)** · faltas: sofre 1.43/comete 1.21 por j · def: 0.79 desarme + 0.21 int + 2.93 duelo/j · 0.71 cortes/j · perde 0.79 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 32 toques/j · ~70 min/j
  - **Enzo Díaz** nota **6.74** (season) · forma 6.68= (últ.5 do time: 6.2→6.3→6.8→–→7.4 📈 subindo) · **faltou 1/5** · 13j
    ↳ **0G+1A** · **0.85 chutes/j (pontaria 18%)** · 0.15 SoT/j (últ.5: 0.4↑) · big chances: cria 0.08/perde 0 por j · 0.62 KP/j (últ.5: 0.4↓) · 0.31 chances criadas/j · 0.46 dribles/j · 4.08 passes no 3º final/j
    ↳ aéreo **1/0.77 por j (130%)** · faltas: sofre 1.23/comete 1.77 por j · def: 2.54 desarme + 0.62 int + 5.15 duelo/j · 1.62 cortes/j · 0.54 cruz/j · perde 0.46 bolas pressionado/j · 54 toques/j · ~71 min/j
  - **Marcos Antônio** nota **6.87** (season) · forma 6.5↓ (últ.5 do time: –→–→–→–→6.5 ⚠️ poucos jogos na janela) · **faltou 4/5** · 12j
    ↳ **0G+2A** · **0.75 chutes/j (pontaria 11%)** · 0.08 SoT/j (últ.5: 0↓) · big chances: cria 0.25/perde 0.08 por j · 1 KP/j (últ.5: 1=) · 0.42 chances criadas/j · 0.25 dribles/j · 6.83 passes no 3º final/j
    ↳ aéreo **0.33/0.33 por j (100%)** · faltas: sofre 0.83/comete 1.08 por j · def: 1.25 desarme + 0.17 int + 2.5 duelo/j · 0.75 cortes/j · 0.08 cruz/j · perde 0.75 bolas pressionado/j · 60 toques/j · ~74 min/j
  - **Artur** nota **7.02** (season) · forma 7.02= (últ.5 do time: 7.4→6.8→6.9→7.7→6.3 ➡️ estável) · 1× MOTM · 10j
    ↳ **1G+1A** · gols aos 17' · **2.1 chutes/j (pontaria 48%)** · 1 SoT/j (últ.5: 1.4↑) · big chances: cria 0.3/perde 0.3 por j · 1.8 KP/j (últ.5: 1.8=) · 1.8 chances criadas/j · 1.1 dribles/j · 3.5 passes no 3º final/j
    ↳ faltas: sofre 1.5/comete 0.3 por j · def: 1.6 desarme + 0.5 int + 4.3 duelo/j · 0.7 cortes/j · 1.3 cruz/j · perde 1.9 bolas pressionado/j · 55 toques/j · ~88 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: DEDDE** (2pts) · **6 feitos / 9 sofridos** · marca 1.2= / sofre 1.8↑ g/j · SoT 5.4 feito / 5 sofrido
- **Consistência: MARCOU em 14/18** (casa 7/8 · fora 7/10) · não-marcou 4 · clean sheet 4 · BTTS 10/18
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- **Densidade da janela:** **5 jogos em 28 dias** (intervalos 7-6-7-8)
- 2026-05-03 · vs **Bahia** (casa · **Empate 2-2**, HT 1-0) 🔻 cedeu o empate (vencia no HT) — 8-8 SoT · posse 41%/40% (1ºT/2ºT) · adv 6º briga-top · você 4º briga-top · seu casa até ali 1.8 marca/0.5 sofre
- 2026-05-10 (+7d) · @ **Corinthians** (fora · **Derrota 2-3**, HT 1-1) — 4-6 SoT · posse 46%/47% (1ºT/2ºT) · adv 17º briga-Z · você 4º briga-top · seu fora até ali 0.9 marca/1.1 sofre
- 2026-05-16 (+6d) · @ **Fluminense** (fora · **Derrota 1-2**, HT 0-2) — 7-3 SoT · posse 40%/49% (1ºT/2ºT) · adv 3º briga-top · você 4º briga-top · seu fora até ali 1 marca/1.4 sofre
- 2026-05-23 (+7d) · vs **Botafogo** (casa · **Empate 1-1**, HT 1-0) 🔻 cedeu o empate (vencia no HT) — 4-6 SoT · posse 69%/59% (1ºT/2ºT) · adv 10º briga-top · você 4º briga-top · seu casa até ali 1.9 marca/0.7 sofre
- 2026-05-31 (+8d) · @ **Remo** (fora · **Derrota 0-1**, HT 0-0) — 4-2 SoT · posse 61%/59% (1ºT/2ºT) · adv 19º briga-Z · você 8º briga-top · seu fora até ali 1 marca/1.4 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Bahia (CASA · E 2-2) — min 1→99:
    📈 pressão (net/min): 1'-15' [0 0 +1 -2 -3 -2 -1 -4 -4 -4 -4 -3 +3 +3 +5] · 16'-30' [+5 +13 +9 +9 +5 +3 +3 +3 0 0 +2 +3 -1 -3 -5] · 31'-45' [-10 -9 -9 -9 -6 -6 -6 -5 -5 +1 -1 +3 +5 +3 -1] · ‖INTERVALO‖ · 46'-60' [+5 +4 +6 +5 +5 +4 +1 +1 -3 -1 0 +2 +3 +1 0] · 61'-75' [-1 -3 -2 -3 -6 -9 -9 -7 -6 -7 -6 -5 0 -2 -1] · 76'-90' [-2 -5 -4 -3 -1 +4 +3 +2 +2 +1 -3 -3 0 -3 -1] · 91'+ [-1 +1 +2 +3 +3 +2 -2 -3 -2]
    ⚽ gols: 17'✓ 62'✗ 73'✓ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **3** · 31'-45' **2** ‖ 46'-60' **1** · 61'-75' **5** · 76'-90' **0**
  - @ Corinthians (FORA · D 2-3) — min 1→96:
    📈 pressão (net/min): 1'-15' [-3 -2 -1 -4 -4 -2 0 +2 0 +1 -2 -3 -4 -5 -9] · 16'-30' [-10 -8 -11 -11 -11 -11 -12 -4 0 +1 -1 +1 +2 +2 +2] · 31'-45' [+1 +1 0 0 +3 +5 +5 +6 +5 +3 +5 +5 +5 +5 -4] · ‖INTERVALO‖ · 46'-60' [-5 -5 -4 -4 -3 -9 -9 -7 -4 +3 +2 +2 -1 +2 -4] · 61'-75' [+5 +6 +5 +6 +6 +7 +4 0 -4 -4 -5 -4 -4 -4 -1] · 76'-90' [0 -1 -1 -3 -2 -2 -3 -2 -2 -2 -3 -3 -3 -2 -3] · 91'+ [-3 -3 -2 -1 -1 0]
    ⚽ gols: 17'✗ 41'✓ 52'✗ 57'✗ 89'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **5** · 16'-30' **3** · 31'-45' **2** ‖ 46'-60' **9** · 61'-75' **7** · 76'-90' **4**
  - @ Fluminense (FORA · D 1-2) — min 1→96:
    📈 pressão (net/min): 1'-15' [+4 +4 +2 +2 +1 +1 -2 -3 -3 -2 -3 -5 +2 0 +1] · 16'-30' [+3 +3 +6 +5 +2 -1 +1 0 +2 +3 +3 +2 +2 +2 +3] · 31'-45' [+3 +3 +4 +3 -1 -1 +1 +1 +2 +4 +3 +3 +3 +1 -3] · ‖INTERVALO‖ · 46'-60' [-2 -4 -1 0 +2 +2 +1 -5 -5 -2 -1 -1 +2 +2 +2] · 61'-75' [+3 +2 +2 +1 0 +1 +1 0 +1 0 0 -5 -3 -4 -3] · 76'-90' [-2 -1 +4 +11 +9 +12 +12 +11 +8 +6 +6 +4 -3 -4 -4] · 91'+ [-2 -7 -26 -14 -13 -9]
    ⚽ gols: 19'✗ 44'✗ 79'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **9** · 16'-30' **3** · 31'-45' **4** ‖ 46'-60' **3** · 61'-75' **5** · 76'-90' **6**
  - vs Botafogo (CASA · E 1-1) — min 1→95:
    📈 pressão (net/min): 1'-15' [-1 0 +1 +8 +8 +6 +1 +2 +3 +3 +6 +4 +5 +5 +7] · 16'-30' [+8 +8 +5 +6 +4 +1 +1 +4 +5 +5 +5 +5 +3 -1 -1] · 31'-45' [-4 -5 -4 -4 -4 -2 +2 +3 +5 +4 +3 +2 0 -1 -1] · ‖INTERVALO‖ · 46'-60' [+5 0 -2 -3 -1 0 +1 0 0 0 -1 -3 0 +1 +1] · 61'-75' [+1 +4 0 +2 +1 +1 -1 0 -1 -3 -5 -3 -4 -4 -3] · 76'-90' [-2 -1 -1 +1 +1 +1 -1 -4 -4 -3 -2 -3 -1 0 -2] · 91'+ [-7 -7 -4 -4 -1]
    ⚽ gols: 4'✓ 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **4** · 31'-45' **1** ‖ 46'-60' **2** · 61'-75' **5** · 76'-90' **4**
  - @ Remo (FORA · D 0-1) — min 1→97:
    📈 pressão (net/min): 1'-15' [+7 +8 +8 +4 +4 0 0 0 0 +2 +1 0 0 +2 +2] · 16'-30' [+8 +7 +7 +3 +1 +4 +1 +1 +4 +4 +4 +4 +1 +1 -3] · 31'-45' [-4 -4 -2 -2 -1 -2 -1 -1 -1 -1 -1 +1 +1 +3 +4] · ‖INTERVALO‖ · 46'-60' [+7 +5 +3 0 -1 -3 -3 -3 -2 -3 0 0 -1 -1 -3] · 61'-75' [-2 -1 -1 0 0 0 +1 +1 -1 -1 -2 -3 -2 +1 +3] · 76'-90' [-2 -2 -2 +2 +1 +3 +2 +3 0 +3 +4 +3 +6 +9 +6] · 91'+ [+3 +2 -1 -4 -4 -2 -2]
    ⚽ gols: 90'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **0** · 16'-30' **2** · 31'-45' **1** ‖ 46'-60' **3** · 61'-75' **1** · 76'-90' **3**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.17 · 16-30: 0.17 · 31-45: 0.06 · 46-60: 0.28 · 61-75: 0.33 · 76-90: 0.28
- Sofre por faixa (/j): 0-15: 0.06 · 16-30: 0.17 · 31-45: 0.22 · 46-60: 0.22 · 61-75: 0.17 · 76-90: 0.28
- 1ºT: marca 7 / sofre 8 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (23): **4 de bola parada (17%)** — escanteio 1 · falta 0 · pênalti 3 · contra-ataque 0 · jogo corrido 8 · sem narração 11
- Gols sofridos (20): **3 de bola parada (15%)** — escanteio 2 · falta 0 · pênalti 1 · contra-ataque 0 · jogo corrido 12 · sem narração 5
- Escanteios: **6.6 a favor / 4.6 contra por jogo** (média da liga: 5 por time)

### Jogo físico — aéreo, faltas e erros (season)
- **Cabeceios certos: 9.4 feito / 10.5 sofrido por jogo** (domínio do alto — cruze com o % de gols de bola parada acima)
- Aéreo por jogador (líderes, ganhos/disputados): **Jonathan Calleri** 2.8/6.3 por j (45%) · **Sabino** 2.3/2.7 por j (83%) · **Alan Franco** 1.8/3 por j (59%)
- Faltas — quem mais SOFRE (cava pênalti/bola parada a favor): **Jonathan Calleri** 2.2/j · **Danielzinho** 2/j · quem mais COMETE (risco de pênalti/falta perigosa contra): **Wendell** 2.3/j · **Enzo Díaz** 1.8/j
- **Erros que viraram finalização: 7 na season** (chance DE GRAÇA pro adversário — não aparece no λ)

### Desfalques de São Paulo neste jogo
- **Ferreirinha** (Thigh Problems) — 4 gols + 0 assists até a data; season: **17% dos gols** do time (17% com assists); **últimos 5 jogos do time**: participou de 1/6 gols = **17%** (≈ estável); with/without: com ele 1.23 g/j (13j) vs sem ele 1.4 g/j (5j) = +14%; finaliza **0.54 SoT/jogo** (time: 4.23 SoT/j com ele vs 3.8 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.1 interceptações/j** (~1% do time) · 0.5 desarmes/j · 3 duelos ganhos/j · 0.2 cruz. certos/j · 1.5 dribles certos/j · 0.6 key passes/j · 0.1 aéreos ganhos/j · 0.9 faltas sofridas/j
- **Lucas Moura** (Achilles tendon rupture) — 1 gols + 1 assists até a data; season: **4% dos gols** do time (9% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.5 g/j (8j) vs sem ele 1.1 g/j (10j) = −27%; finaliza **0.38 SoT/jogo** (time: 4.63 SoT/j com ele vs 3.7 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.3 interceptações/j** (~4% do time) · 0.1 desarmes/j · 2 duelos ganhos/j · 0.3 cruz. certos/j · 0.4 dribles certos/j · 0.6 key passes/j · 0.8 aéreos ganhos/j · 0.8 faltas sofridas/j
- **Sabino** (Hamstring Injury) — 1 gols + 1 assists até a data; season: **4% dos gols** do time (9% com assists); **últimos 5 jogos do time**: participou de 1/6 gols = **17%** (↑ mais decisivo AGORA); with/without: com ele 1.47 g/j (15j) vs sem ele 0.33 g/j (3j) = −78%; finaliza **0.2 SoT/jogo** (time: 4 SoT/j com ele vs 4.67 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **1.1 interceptações/j** (~14% do time) · 2.1 desarmes/j · 5.1 duelos ganhos/j · 0.1 cruz. certos/j · 0.2 dribles certos/j · 0.2 key passes/j · 2.3 aéreos ganhos/j · 0.7 faltas sofridas/j
- **Young** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.28 g/j (18j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Rafael** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1.28 g/j (18j) vs sem ele 0 g/j (0j) = −100%; finaliza **0 SoT/jogo** (time: 4.11 SoT/j com ele vs 0 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.1 interceptações/j** (~1% do time) · 0.1 desarmes/j · 0.5 duelos ganhos/j · 0 cruz. certos/j · 0 dribles certos/j · 0 key passes/j · 0.3 aéreos ganhos/j · 0.1 faltas sofridas/j

## Athletico PR (visita) — até 2026-07-22

### Gols & finalização (season)
- Total **24 marcados / 18 sofridos** em 18j · média **1.33 marca / 1 sofre** por jogo
- **Fora (8j): marca 0.88 / sofre 1.5** (7 gols) · por tempo: 1ºT 0.61/0.72 · 2ºT 0.72/0.28
- **Finalização: 88 SoT (4.89/j · fora 4.13/j) · conv 24%** (aberta, −3 pên) · sofre 3.39 SoT/j (adv 30%) · 9 KP/j
- **Volume: 12.1 chutes/j (7.5 na área) · big chances: cria 2.7/desperdiça 2.1 por j** · posse 47.9%

### Estilo (feito/sofrido por jogo)
- **Temporada** (feito/sofrido por jogo): ataques perigosos 37.8/34.4 · chutes pra fora 5.2/4 · bloqueados 2.7/3.1 · de fora da área 4.8/4.2
- **Últimos 5** (feito/sofrido por jogo): ataques perigosos 36.2/38.8 · chutes pra fora 7/5 · bloqueados 3.6/2.4 · de fora da área 4.2/3.2

### Goleiro (season — a trava da conversão defensiva)
  - **Santos** (titular, 18j · ~90 min/j) · **2.28 defesas/j** (66% dentro da área — chance clara) · **save% 69** (41 defesas / 18 gols sofridos nos jogos dele)

### Provável XI & perfil individual (11 mais usados — nota, trajetória, stats, minuto dos gols)
- **Nota média do time (todas comps): 6.8**
  - **Santos ** 🎖️capitão nota **6.8** (season) · forma 7↑ (últ.5 do time: 7.1→7.3→7.1→6.5→7 📉 caindo) · 1× MOTM · 18j
    ↳ 🧤 **2.28 defesas/j** (66% dentro da área) · **save% 69** (41 defesas / 18 gols sofridos nos jogos dele) · ~90 min/j
  - **Kevin Viveros** nota **7.05** (season) · forma 6.92= (últ.5 do time: 6.3→–→6→8.2→7.2 📈 subindo) · **faltou 1/5** · 5× MOTM · 17j
    ↳ **11G+1A** · gols aos 4',10',34',45',45',53',56',81',88',90'… — 4 tardios (76'+) · **2.76 chutes/j (pontaria 60%)** · 1.65 SoT/j (últ.5: 2.4↑) · big chances: cria 0.12/perde 0.76 por j · 0.59 KP/j (últ.5: 1↑) · 0.35 chances criadas/j · 0.53 dribles/j · 0.53 passes no 3º final/j
    ↳ aéreo **0.47/0.59 por j (80%)** · faltas: sofre 3.53/comete 2.12 por j · def: 0.24 desarme + 0.06 int + 4.65 duelo/j · 0.76 cortes/j · 0.12 cruz/j · perde 1.24 bolas pressionado/j · 28 toques/j · ~89 min/j
  - **Arthur Dias** nota **6.86** (season) · forma 6.88= (últ.5 do time: 7.4→6.8→7→6.5→6.7 📉 caindo) · 17j
    ↳ **0.29 chutes/j (pontaria 0%)** · 0 SoT/j (últ.5: 0=) · 0.18 KP/j (últ.5: 0.2=) · 0.12 chances criadas/j · 0.35 dribles/j · 6 passes no 3º final/j
    ↳ aéreo **0.71/0.88 por j (80%)** · faltas: sofre 0.71/comete 0.71 por j · def: 1.41 desarme + 1.41 int + 3 duelo/j · 3 cortes/j · perde 0.12 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 56 toques/j · ~88 min/j
  - **Stiven Mendoza** nota **6.97** (season) · forma 7.02= (últ.5 do time: 7.2→6.6→7.5→7.3→6.5 ➡️ estável) · 1× MOTM · 18j
    ↳ **5G+0A** · gols aos 1',5',9',11',57' · **1.44 chutes/j (pontaria 42%)** · 0.61 SoT/j (últ.5: 0.6=) · big chances: cria 0.11/perde 0.06 por j · 0.89 KP/j (últ.5: 0.8=) · 0.61 chances criadas/j · 0.5 dribles/j · 3.33 passes no 3º final/j
    ↳ aéreo **0.11/0.11 por j (100%)** · faltas: sofre 0.78/comete 0.72 por j · def: 1 desarme + 0.5 int + 2.28 duelo/j · 0.56 cortes/j · 0.39 cruz/j · perde 1 bolas pressionado/j · ⚠️ **2 erro(s)→chute** na season · 42 toques/j · ~82 min/j
  - **Gastón Benavídez** nota **6.94** (season) · forma 6.8= (últ.5 do time: 6.5→–→7.2→6.7→6.8 ➡️ estável) · **faltou 1/5** · 15j
    ↳ **0G+5A** · **0.4 chutes/j (pontaria 50%)** · 0.2 SoT/j (últ.5: 0.2=) · big chances: cria 0.33/perde 0.07 por j · 1.33 KP/j (últ.5: 1.4=) · 0.73 chances criadas/j · 0.4 dribles/j · 7.67 passes no 3º final/j
    ↳ aéreo **0.6/0.73 por j (82%)** · faltas: sofre 0.87/comete 1.13 por j · def: 0.73 desarme + 0.87 int + 2.47 duelo/j · 2.27 cortes/j · 0.33 cruz/j · perde 0.33 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 56 toques/j · ~90 min/j
  - **Juan Felipe Aguirre** nota **6.82** (season) · forma 6.9= (últ.5 do time: –→6.8→6.7→6.8→7.3 📈 subindo) · **faltou 1/5** · 14j
    ↳ **1G+0A** · gols aos 49' — mais no 2ºT · **0.64 chutes/j (pontaria 56%)** · 0.36 SoT/j (últ.5: 0.2↓) · big chances: cria 0/perde 0.07 por j · 0.07 KP/j (últ.5: 0.2↑) · 0.07 chances criadas/j · 0.07 dribles/j · 2.29 passes no 3º final/j
    ↳ aéreo **2.14/2.86 por j (75%)** · faltas: sofre 0.36/comete 1.21 por j · def: 0.86 desarme + 1 int + 3.29 duelo/j · 5.29 cortes/j · perde 0.14 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 48 toques/j · ~83 min/j
  - ⚠️(fora) **Lucas Esquivel** nota **7.14** (season) · forma 6.67↓ (últ.5 do time: 6→–→7→–→7 📈 subindo) · **faltou 2/5** · 1× MOTM · 14j
    ↳ **1G+3A** · gols aos 81' — mais no 2ºT · **0.93 chutes/j (pontaria 23%)** · 0.21 SoT/j (últ.5: 0↓) · big chances: cria 0.36/perde 0 por j · 1.36 KP/j (últ.5: 1.2=) · 0.43 chances criadas/j · 1.07 dribles/j · 8.64 passes no 3º final/j
    ↳ aéreo **0.86/0.64 por j (133%)** · faltas: sofre 0.93/comete 1.64 por j · def: 2.29 desarme + 0.64 int + 4.71 duelo/j · 2.36 cortes/j · 1.14 cruz/j · perde 0.43 bolas pressionado/j · ⚠️ **1 erro(s)→chute** na season · 71 toques/j · ~80 min/j
  - ⚠️(fora) **Luiz Gustavo** nota **6.9** (season) · forma 7.2↑ (últ.5 do time: –→7.2→–→–→– ⚠️ poucos jogos na janela) · **faltou 4/5** · 13j
    ↳ **2G+0A** · gols aos 75',90' — mais no 2ºT · **1.23 chutes/j (pontaria 44%)** · 0.54 SoT/j (últ.5: 1↑) · big chances: cria 0.08/perde 0.15 por j · 0.46 KP/j (últ.5: 0.6↑) · 0.23 chances criadas/j · 0.62 dribles/j · 6.23 passes no 3º final/j
    ↳ aéreo **0.38/0.31 por j (125%)** · faltas: sofre 1.62/comete 1.23 por j · def: 1.08 desarme + 0.54 int + 3.62 duelo/j · 1.23 cortes/j · perde 0.85 bolas pressionado/j · 46 toques/j · ~77 min/j
  - **Juan Portilla** nota **6.62** (season) · forma 6.6= (últ.5 do time: 6.9→6.3→–→–→– ⚠️ poucos jogos na janela) · **faltou 3/5** · 14j
    ↳ **0.4 chutes/j (pontaria 17%)** · 0.07 SoT/j (últ.5: 0↓) · 0.2 KP/j (últ.5: 0.2=) · 0.2 chances criadas/j · 0.47 dribles/j · 4.13 passes no 3º final/j
    ↳ aéreo **0.53/0.13 por j (400%)** · faltas: sofre 0.6/comete 1.27 por j · def: 0.8 desarme + 0.67 int + 2.2 duelo/j · 0.67 cortes/j · 0.13 cruz/j · perde 0.27 bolas pressionado/j · 32 toques/j · ~53 min/j
  - **Carlos Terán ** nota **6.68** (season) · forma 6.73= (últ.5 do time: 7.2→6.5→–→–→6.5 📉 caindo) · **faltou 2/5** · 12j
    ↳ **0.5 chutes/j (pontaria 67%)** · 0.33 SoT/j (últ.5: 0.6↑) · big chances: cria 0.08/perde 0.08 por j · 0.17 KP/j (últ.5: 0↓) · 0.08 chances criadas/j · 0 dribles/j · 4.58 passes no 3º final/j
    ↳ aéreo **0.75/1.5 por j (50%)** · faltas: sofre 0.58/comete 0.83 por j · def: 0.75 desarme + 1 int + 2.08 duelo/j · 2.92 cortes/j (+2 último homem) · 0.17 cruz/j · perde 0.08 bolas pressionado/j · 40 toques/j · ~63 min/j
  - **Julimar** nota **6.75** (season) · forma 6.9= (últ.5 do time: –→–→–→7→6.8 ⚠️ poucos jogos na janela) · **faltou 3/5** · 13j
    ↳ **3G+1A** · gols aos 6',79',88' — mais no 2ºT, 2 tardios (76'+) · **1.15 chutes/j (pontaria 40%)** · 0.46 SoT/j (últ.5: 0.4=) · big chances: cria 0.15/perde 0.15 por j · 0.85 KP/j (últ.5: 1.2↑) · 0.54 chances criadas/j · 0.31 dribles/j · 1.62 passes no 3º final/j
    ↳ aéreo **1.23/2 por j (62%)** · faltas: sofre 0.31/comete 1 por j · def: 0.54 desarme + 0.38 int + 2.31 duelo/j · 0.38 cortes/j · 0.23 cruz/j · perde 1 bolas pressionado/j · 24 toques/j · ~56 min/j

### Forma & contexto (últimos 5 — cada resultado justificado)
- **Forma (momento) — últimos 5: VVEDE** (8pts) · **4 feitos / 3 sofridos** · marca 0.8↓ / sofre 0.6↓ g/j · SoT 4.8 feito / 2.6 sofrido
- **Consistência: MARCOU em 13/18** (casa 8/10 · fora 5/8) · não-marcou 5 · clean sheet 5 · BTTS 9/18
_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._
- **Densidade da janela:** **5 jogos em 28 dias** (intervalos 8-7-7-6)
- 2026-05-02 · vs **Grêmio** (casa · **Empate 0-0**, HT 0-0) — 5-0 SoT · posse 69%/52% (1ºT/2ºT) · adv 11º briga-top · você 5º briga-top · seu casa até ali 2.1 marca/0.7 sofre
- 2026-05-10 (+8d) · @ **Vasco da Gama** (fora · **Derrota 0-1**, HT 0-1) — 3-6 SoT · posse 35%/41% (1ºT/2ºT) · adv 13º · você 5º briga-top · seu fora até ali 0.8 marca/1.7 sofre
- 2026-05-17 (+7d) · vs **Flamengo** (casa · **Empate 1-1**, HT 1-0) 🔻 cedeu o empate (vencia no HT) — 5-3 SoT · posse 41%/35% (1ºT/2ºT) · adv 2º briga-top · você 5º briga-top · seu casa até ali 1.9 marca/0.6 sofre
- 2026-05-24 (+7d) · @ **Remo** (fora · **Vitória 2-1**, HT 1-1) — 9-2 SoT · posse 45%/57% (1ºT/2ºT) · adv 19º briga-Z · você 5º briga-top · seu fora até ali 0.7 marca/1.6 sofre
- 2026-05-30 (+6d) · vs **Mirassol** (casa · **Vitória 1-0**, HT 0-0) — 2-2 SoT · posse 50%/49% (1ºT/2ºT) · adv 18º briga-Z · você 4º briga-top · seu casa até ali 1.8 marca/0.7 sofre

### Momentum minuto a minuto (últimos 5)
(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)
  - vs Grêmio (CASA · E 0-0) — min 1→96:
    📈 pressão (net/min): 1'-15' [+3 +4 +5 +5 +2 0 -1 -1 0 +3 +5 +5 +3 +3 +4] · 16'-30' [+3 +3 +3 +2 +2 +2 +1 +1 -1 -2 -1 0 +1 +4 +4] · 31'-45' [+4 +4 +4 +4 +3 +4 +3 +1 0 0 0 +1 -2 -2 +6] · ‖INTERVALO‖ · 46'-60' [+4 +4 -1 +3 0 +1 +4 +4 +2 +1 +3 +3 +2 0 +1] · 61'-75' [-1 -1 0 0 0 -2 -3 -4 -4 -5 -5 -3 -5 -5 -6] · 76'-90' [-7 -7 -7 -6 -6 -5 -4 -2 -2 -2 +5 +3 +1 +1 0] · 91'+ [-2 -5 -3 -3 -4 -3]
    ⚽ gols: —
    🛡️ defesa (interceptações+desarmes): 1'-15' **4** · 16'-30' **4** · 31'-45' **5** ‖ 46'-60' **9** · 61'-75' **4** · 76'-90' **1**
  - @ Vasco da Gama (FORA · D 0-1) — min 1→95:
    📈 pressão (net/min): 1'-15' [0 -6 -5 -5 -5 -7 -6 -2 -1 -1 -5 -3 -3 +1 0] · 16'-30' [+2 -1 -1 -2 -5 -4 0 0 -3 -3 -7 -7 -7 -4 -6] · 31'-45' [-7 -5 -4 -4 -3 -2 -3 -7 -5 -4 -2 -1 0 +2 +2] · ‖INTERVALO‖ · 46'-60' [0 0 0 0 -1 -1 -2 -2 -1 0 -4 -3 -1 -4 -8] · 61'-75' [-8 -6 -6 -1 0 0 -1 +1 0 +1 0 0 0 0 +1] · 76'-90' [+3 +3 +1 0 +1 +2 +3 +3 +1 0 -2 -3 -2 -2 -4] · 91'+ [-4 -2 -3 0 +2]
    ⚽ gols: 37'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **3** · 31'-45' **2** ‖ 46'-60' **6** · 61'-75' **5** · 76'-90' **2**
  - vs Flamengo (CASA · E 1-1) — min 1→96:
    📈 pressão (net/min): 1'-15' [0 -1 -1 +3 +6 +6 +7 +5 +5 +3 +5 +5 +3 -1 -1] · 16'-30' [-2 -5 -3 -3 -2 -2 -2 -3 -3 -3 -3 0 0 0 0] · 31'-45' [+2 +2 +1 +1 -1 -4 -4 -2 -2 -2 -2 -2 -2 -1 -1] · ‖INTERVALO‖ · 46'-60' [-1 -1 +3 +10 +8 +5 0 -3 -3 -4 -3 -3 -3 -5 -4] · 61'-75' [-6 -4 -2 -5 -4 -3 -2 -2 -6 -5 -5 -4 -5 -5 -1] · 76'-90' [0 -1 0 -4 -3 -1 +8 +9 +3 0 0 -1 +1 +1 -4] · 91'+ [-3 -2 -2 +4 +4 +3]
    ⚽ gols: 11'✓ 84'✗
    🛡️ defesa (interceptações+desarmes): 1'-15' **3** · 16'-30' **4** · 31'-45' **3** ‖ 46'-60' **2** · 61'-75' **5** · 76'-90' **1**
  - @ Remo (FORA · V 2-1) — min 1→98:
    📈 pressão (net/min): 1'-15' [-1 0 0 -2 -3 -2 -2 -4 -4 -1 -5 -3 -2 -6 -6] · 16'-30' [-4 -4 -2 -1 +4 +4 +8 +7 +5 +5 +5 +8 +7 +6 +8] · 31'-45' [+7 +4 +4 +4 +3 +1 +1 +2 +2 +1 0 +2 +2 +5 +5] · ‖INTERVALO‖ · 46'-60' [0 +3 +3 +1 +1 +3 +7 +5 +6 +6 +4 +5 +6 +6 +7] · 61'-75' [+4 +2 +3 +4 +3 +2 -3 -4 -3 -3 -2 -3 -1 +2 +3] · 76'-90' [+4 +5 +3 +6 +3 +3 +3 +2 +1 +1 +3 +5 +9 +9 +10] · 91'+ [+9 +16 +30 +20 +17 +13 +9 +8]
    ⚽ gols: 14'✗ 45'✓ 53'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **2** · 16'-30' **2** · 31'-45' **3** ‖ 46'-60' **7** · 61'-75' **3** · 76'-90' **8**
  - vs Mirassol (CASA · V 1-0) — min 1→97:
    📈 pressão (net/min): 1'-15' [0 -1 -2 -4 -2 -1 0 0 -2 -3 -3 -2 0 0 -1] · 16'-30' [-5 -4 -3 -1 +1 0 0 +2 +2 +1 +2 +4 +4 +6 +5] · 31'-45' [+5 +5 +4 +2 +1 +1 -1 -1 -2 -2 -2 -2 -4 -3 0] · ‖INTERVALO‖ · 46'-60' [-5 0 +1 +2 -1 0 +4 +1 +1 0 -2 -4 -4 -2 0] · 61'-75' [+1 +1 +3 +3 +10 +10 +10 +6 +4 +4 +4 +4 +7 +7 +3] · 76'-90' [+4 +3 +3 -1 -1 -2 -2 -2 0 +2 +2 +3 +7 +7 +4] · 91'+ [+4 +4 0 0 +4 +2 0]
    ⚽ gols: 88'✓
    🛡️ defesa (interceptações+desarmes): 1'-15' **5** · 16'-30' **3** · 31'-45' **3** ‖ 46'-60' **9** · 61'-75' **4** · 76'-90' **6**

### Distribuição de gols por faixa (season)
- Marca por faixa (/j): 0-15: 0.39 · 16-30: 0.06 · 31-45: 0.17 · 46-60: 0.22 · 61-75: 0.06 · 76-90: 0.44
- Sofre por faixa (/j): 0-15: 0.28 · 16-30: 0.17 · 31-45: 0.28 · 46-60: 0.06 · 61-75: 0 · 76-90: 0.22
- 1ºT: marca 11 / sofre 13 (totais na temporada)

### Bola parada — origem dos gols (liga, season) e escanteios
- Gols marcados (24): **7 de bola parada (29%)** — escanteio 0 · falta 4 · pênalti 3 · contra-ataque 0 · jogo corrido 10 · sem narração 7
- Gols sofridos (18): **1 de bola parada (6%)** — escanteio 0 · falta 1 · pênalti 0 · contra-ataque 0 · jogo corrido 8 · sem narração 9
- Escanteios: **5.2 a favor / 4.5 contra por jogo** (média da liga: 5 por time)

### Jogo físico — aéreo, faltas e erros (season)
- **Cabeceios certos: 7 feito / 7.6 sofrido por jogo** (domínio do alto — cruze com o % de gols de bola parada acima)
- Aéreo por jogador (líderes, ganhos/disputados): **Juan Felipe Aguirre** 2.1/2.9 por j (75%) · **Julimar** 1.2/2 por j (62%)
- Faltas — quem mais SOFRE (cava pênalti/bola parada a favor): **Kevin Viveros** 3.5/j · **Luiz Gustavo** 1.6/j · quem mais COMETE (risco de pênalti/falta perigosa contra): **Kevin Viveros** 2.1/j · **Lucas Esquivel** 1.6/j
- **Erros que viraram finalização: 11 na season** — Stiven Mendoza 2 · Gilberto Júnior Leite dos Santos 2 (chance DE GRAÇA pro adversário — não aparece no λ)

### Desfalques de Athletico PR neste jogo
- **Lucas Esquivel** (Suspended) — 1 gols + 3 assists até a data; season: **4% dos gols** do time (17% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.5 g/j (14j) vs sem ele 0.75 g/j (4j) = −50%; finaliza **0.21 SoT/jogo** (time: 5 SoT/j com ele vs 4.5 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.6 interceptações/j** (~8% do time) · 2.3 desarmes/j · 4.7 duelos ganhos/j · 1.1 cruz. certos/j · 1.1 dribles certos/j · 1.4 key passes/j · 0.9 aéreos ganhos/j · 0.9 faltas sofridas/j
- **Luiz Gustavo** (Calf Injury) — 2 gols + 0 assists até a data; season: **8% dos gols** do time (8% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.46 g/j (13j) vs sem ele 1 g/j (5j) = −32%; finaliza **0.54 SoT/jogo** (time: 5 SoT/j com ele vs 4.6 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): **0.5 interceptações/j** (~7% do time) · 1.1 desarmes/j · 3.6 duelos ganhos/j · 0 cruz. certos/j · 0.6 dribles certos/j · 0.5 key passes/j · 0.4 aéreos ganhos/j · 1.6 faltas sofridas/j
- **Mycael** (Leg Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.33 g/j (18j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **A. García Castillo** (Pubic Bone Bruise) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.33 g/j (18j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**São Paulo atacando × Athletico PR defendendo**
| Faixa | São Paulo marca/j | Athletico PR sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.17 | 0.28 | 0.45 |
| 16-30 | 0.17 | 0.17 | 0.34 |
| 31-45 | 0.06 | 0.28 | 0.34 |
| 46-60 | 0.28 | 0.06 | 0.34 |
| 61-75 | 0.33 | 0 | 0.33 |
| 76-90 | 0.28 | 0.22 | 0.5 |

**Athletico PR atacando × São Paulo defendendo**
| Faixa | Athletico PR marca/j | São Paulo sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.39 | 0.06 | 0.45 |
| 16-30 | 0.06 | 0.17 | 0.23 |
| 31-45 | 0.17 | 0.22 | 0.39 |
| 46-60 | 0.22 | 0.22 | 0.44 |
| 61-75 | 0.06 | 0.17 | 0.23 |
| 76-90 | 0.44 | 0.28 | 0.72 |

### Cruzamento de MOMENTUM (fluxo minuto-a-minuto dos últimos 5, já cruzado pra você)
A curva de momentum foi digerida e CRUZADA em código — não precisa cruzar 90 pontos na mão, use a conclusão abaixo (quem domina cada janela) junto com o cruzamento de gols acima.

**Janela de gol provável pela curva de momentum** — São Paulo: **16-30** (domínio +1.3) · Athletico PR: **76-90** (domínio -2.3). Cruze com o timing de gols e com a intenção: se a janela de quem PRECISA do gol coincide com a fraqueza do outro, é ali que o gol tende a sair.

| Faixa | São Paulo domínio/j | Athletico PR domínio/j | cruzamento |
|---|---|---|---|
| 0-15 | +0.6 | -0.3 | +0.9 ≈ |
| 16-30 | +1.5 | +0.2 | +1.3 ≈ |
| 31-45 | 0 | +0.2 | -0.2 ≈ |
| 46-60 | -0.4 | +0.7 | -1.1 ≈ |
| 61-75 | -1.1 | -0.5 | -0.6 ≈ |
| 76-90 | -0.6 | +1.7 | -2.3 ✈️ |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ São Paulo (casa) = 1.69 · λ Athletico PR (fora) = 0.6 · total = 2.29

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- São Paulo: λ_SoT 4.18 × conv 27% → **1.13 gols**
- Athletico PR: λ_SoT 4.05 × conv 24% → **0.97 gols**
- total via SoT = 2.1
- **Índice de volume do jogo**: λ_SoT total 8.2 vs média da liga 9 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson corrigido por **Dixon-Coles** sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 63/26/11% | 37/33/29% |
| Over 1.5 | 68% | 64% |
| Over 2.5 | 40% | 35% |
| Over 3.5 | 20% | 16% |
| BTTS | 38% | 44% |

**Mercados derivados do MESMO grid corrigido** (Rota B — já coerentes entre si; use como prior destes mercados):
- **Dupla chance**: 1X **71%** · 12 **67%** · X2 **63%** · **Draw No Bet** casa 56% / fora 44%
- **Placar exato (mais prováveis)**: 1-1 15% · 0-0 14% · 1-0 12% · 0-1 10%
- **Odd/Even**: ímpar 46% / par 54% · **Multigoals**: 0-1 36% · 2-3 48% · 4+ 16%
- **Team totals** (marginais do λ da Rota B — a prob de CADA time marcar; base do `team_total`): São Paulo over 0.5 **68%** / over 1.5 **31%** · Athletico PR over 0.5 **62%** / over 1.5 **25%**
- **Fair odds no-vig (1x2, calculadas pelo grid — não pelo mercado)**: casa 2.67 · empate 3 · fora 3.42. São PROBABILIDADE JUSTA, não veredito de valor (sem odds do mercado ingeridas não há EV/CLV — não prometa "aposta certa").
- ⚠️ O grid Dixon-Coles JÁ corrige o empate pra cima (o Poisson independente o subestima). **O empate / dupla chance é pick LEGÍTIMO** quando o prior aqui aponta — NÃO o rebaixe por covardia; num jogo travado de poucos gols o X costuma ser o de MENOR variância com valor.

**Baseline da liga (1ºT/2ºT):** 46% dos gols saem no 1º tempo / 54% no 2º (sobre 182 jogos jogados). Use como referência pra dizer se um time é ANÔMALO no timing (o padrão da literatura é ~44/56 — 2º tempo mais goleador por fadiga/game-state).
**Baseline por faixa de 15min (% dos gols da liga):** 0-15: 12% · 16-30: 16% · 31-45: 18% · 46-60: 17% · 61-75: 14% · 76-90: 22%. É a curva NORMAL — compare o timing de cada time (bloco "Distribuição de gols por faixa") contra ela; desvio grande (marca/sofre muito mais que a liga numa janela) é o sinal de onde o gol tende a sair NESTE jogo.

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **20/53/27%** · 2ºT **38/39/22%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= São Paulo) e `away` (= Athletico PR), cada um com:
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
