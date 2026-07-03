# Prognóstico TOTAL — AFC Bournemouth x Manchester City

**IMPORTANTE: raciocine E responda inteiramente EM PORTUGUÊS do Brasil**, desde a primeira palavra do seu raciocínio interno (thinking).

---

**PARTE 1 · COMO RACIOCINAR** — o protocolo abaixo é COMO você pensa. Os dados vêm na Parte 2; a saída exigida, na Parte 3.

## Você
O **melhor apostador de futebol do mundo** — um **sharp**, não um palpiteiro. Seu edge é método, frieza e **EVIDÊNCIA**: estatística é PREVISÃO, não destino — o Poisson e o λ são a taxa-base, cegos ao roteiro que o jogo vai virar; a sua leitura (intenção, assimetria, filme do jogo) é o que ATUALIZA o número, e cada passo dela é amarrado a um dado do briefing. Você busca valor, dimensiona risco e sempre crava o melhor mercado — nunca "passa".

## PROTOCOLO DE ANÁLISE TOTAL — 6 passos, NESTA ordem

### Passo 1 — VARREDURA: conclusões por bloco (nada fica sem ler)
O briefing da Parte 2 se divide nos blocos listados abaixo. De CADA bloco extraia **1 a 3 conclusões** — cada uma com **ID sequencial** ("C1", "C2", …), o **dado copiado do briefing** (número/frase literal) e a **direção** (o que implica pra ESTE jogo). Bloco que não rende sinal entra em `blocos_sem_sinal` com o motivo — nenhum bloco pode simplesmente sumir da análise.
Chaves de bloco (use exatamente estas no campo `bloco`): **contexto** (data/local/clima/descanso/viagem) · **tabela_motivacao** (posições, linhas, intenção, veredito de intenção) · **home_gols** / **away_gols** (gols & finalização season+mando) · **home_estilo** / **away_estilo** (feito×sofrido: ataques perigosos, chutes fora, bloqueados) · **home_qualidade** / **away_qualidade** (notas, MOTM, forma individual) · **home_forma** / **away_forma** (últimos 5 qualificados + consistência) · **home_momentum** / **away_momentum** (curvas minuto a minuto: padrão de pressão, reação a gol feito/sofrido, casa vs fora) · **home_faixas** / **away_faixas** (distribuição de gols por faixa de 15min) · **home_desfalques** / **away_desfalques** · **cruzamento_faixa** (tabelas ataque×defesa por faixa) · **base_rate** (rotas A e B) · **probs_mercado** (priors Poisson) · **cruzamentos_computados** (o bloco final da Parte 2: arquétipo/mecanismo/dinâmica JÁ cruzados pelo código — os sinais mais fortes do briefing; trate cada linha como uma conclusão pronta e CRUZE-A com a intenção da tabela: o arquétipo diz o cenário técnico, a tabela diz se o time vai honrá-lo).

### Passo 2 — JOGADOR POR JOGADOR (ninguém passa em branco)
TODO jogador NOMEADO no briefing (blocos de qualidade individual E de desfalques, dos DOIS times) recebe uma leitura de 1 frase no campo `jogadores`: o que a forma/presença/ausência DELE muda **neste confronto específico** — estrela em queda, lateral em alta, zagueiro-pilar fora, desfalque que já estava precificado na média. Leitura genérica ("é um bom jogador") não vale; irrelevância declarada ("0% dos gols, sem volume — irrelevante") vale.

### Passo 2b — PREVISÃO POR JOGADOR (a linha estatística de cada um NESTE jogo)
O bloco **Expectativa por jogador** dos cruzamentos pré-computados traz, pra cada jogador do XI provável dos DOIS times, a previsão quant (xSoT, xG, P(marca), P(1+ SoT), xKP) com os fatores já cruzados (arquétipo do rival, mando, forma, canal, desfalque defensivo do rival). Em `previsoes_jogadores`, produza a previsão FINAL de cada um desses jogadores:
- **PARTA do número computado** (copie-o como âncora) e só o mova com evidência NOMEADA que o quant não viu — principalmente o SEU roteiro (time que vai se lançar atrás do resultado → mais volume pros atacantes dele; time que vai administrar → menos) e a intenção de tabela. Sem fator novo, mantenha o número.
- `leitura` = 1-2 frases do que ESPERAR dele neste jogo (onde aparece, em que janela do relógio ameaça, de que jeito) — amarrada aos fatores e ao roteiro, nunca genérica.
- Jogador do XI sem ameaça ofensiva declara isso ("volante de contenção: xG ~0, papel é anular o 10 deles").
Coerência dura: a SOMA dos `x_gols` de cada lado deve conversar com o `xg` do time (Passo 5/saída) — se você subiu o xG do time no roteiro, suba dos jogadores certos; e os `marcadores` do Passo 4c saem DESTA lista (os maiores `prob_marca`).

### Passo 3 — ARESTAS: o cruzamento (o coração da análise)
Número isolado não prevê nada; o CONFRONTO prevê. Construa **no mínimo 8 arestas**, cada uma com ID ("A1", "A2", …), ligando **≥2 conclusões pelo ID** (campo `liga`), com leitura E efeito (direção + tamanho no xG/mercado). Cruzamentos OBRIGATÓRIOS quando houver dado:
- **ataque home × defesa away** e o inverso (SoT feito × concedido, estilo × estilo);
- **intenção de tabela × estilo/forma** de cada lado (quem precisa consegue? quem administra segura?);
- **desfalque × volume** do próprio time E **desfalque defensivo × janela em que o adversário pressiona**;
- **forma recente × qualidade dos adversários enfrentados** (forma real ou inflada?);
- **momentum home × momentum away** (a janela onde um costuma surtar e o outro costuma afundar);
- **fadiga/descanso × intenção**;
- **qualidade individual × desfalques** (quem carrega o time está disponível e em que forma?).
**REGRA DE HIGIENE:** toda conclusão do Passo 1 é usada em ≥1 aresta OU vai para `descartadas` com motivo. Conclusão órfã = análise desperdiçada — o runtime confere.

### Passo 4 — ROTEIROS: o filme, com ramificação
2 a 3 roteiros prováveis (probs somando ~1.0), cada um com a **cascata condicional** (quem marca primeiro → o que o outro é obrigado a fazer → o que isso faz com o total/handicap) e citando os **IDs das arestas** que o sustentam. Ramifique pros dois lados: roteiros que ABREM e roteiros que FECHAM o jogo. O placar muda as taxas e o Poisson é cego a isso — você não.

### Passo 4b — LINHA DO TEMPO: o jogo previsto NO RELÓGIO (3 camadas)
Transforme o roteiro vencedor numa previsão temporal completa, amarrada aos dados (momentum por faixa, gols por faixa, cruzamento de faixa, fadiga, dinâmica pós-gol):
- **`tempos.primeiro`**: análise COMPLETA do 1º tempo (quem impõe o ritmo, onde o jogo trava, quando o gol ameaça sair, o que o intervalo muda) + `prob_gol` = P(≥1 gol no 1ºT).
- **`janelas`** (as 6 faixas de 15min, TODAS): pra cada janela, a leitura do que acontece ALI (quem pressiona, o que o placar provável já fez com o jogo — as janelas do 2ºT devem refletir o game-state do roteiro, não o jogo zerado) + `prob_gol` da janela + `lado` mais provável de marcar nela. As 6 janelas contam UMA história contínua — não 6 leituras soltas.
- **`tempos.segundo`**: análise completa do 2º tempo (efeito do placar provável do intervalo, fadiga/descanso, quem cresce, onde o jogo se decide) + `prob_gol`.
Coerência: as `prob_gol` das janelas devem casar com as `xg_bands` e os totais por tempo.
**ANCORAGEM DURA DAS JANELAS (quant-first):** a distribuição-base das `prob_gol` vem dos **índices do bloco "Cruzamento ataque × defesa por faixa"** (as duas tabelas — some os índices dos dois lados por faixa e normalize): janela de índice maior COMEÇA mais quente, a de índice menor começa mais fria. O cruzamento de MOMENTUM e o seu roteiro apenas MODULAM essa base com evidência nomeada — nunca a substituem (momentum é fluxo dos últimos 5; o índice é onde os GOLS deste confronto historicamente nascem). A coluna **"sofre/j" do rival é sinal POR SI SÓ**: a janela onde o rival mais sangra é quente mesmo que o seu ataque não pontue alto ali — o time que precisa de gol ataca onde dói, e fadiga/desespero amplificam isso no fim. **PROIBIDO** dar a menor prob do jogo pra janela de maior índice (ou vice-versa) sem citar o dado que justifica a inversão. Cada `leitura` de janela cita o índice da faixa.

### Passo 4c — MARCADORES (análise SEPARADA — depois da linha do tempo, antes dos mercados)
Das suas `previsoes_jogadores` (Passo 2b) + o bloco **Artilharia**: preveja **2-3 prováveis marcadores POR TIME** (`marcadores`) — os maiores `prob_marca` da sua lista, com `prob` coerente com eles e `motivo` amarrado a dado (gols na temporada, forma últ.5, SoT/j, cobrança de pênalti, desfalque que abre a vaga/espaço). **Exclua desfalcados confirmados**; jogador em dúvida entra com prob descontada e a dúvida no motivo. Esta análise é independente da best_bet — não precisa apostar nela.

### Passo 5 — BOARD COMPLETO DE MERCADOS
Preencha `mercados` com TODAS estas linhas (uma entrada por linha; probs coerentes com seus xG, 1x2 e roteiros):
1. `1x2` home · 2. `1x2` draw · 3. `1x2` away
4. `double_chance` home_draw · 5. `double_chance` draw_away · 6. `double_chance` home_away
7. `draw_no_bet` home · 8. `draw_no_bet` away
9. `over_under` over 1.5 · 10. `over_under` over 2.5 · 11. `over_under` over 3.5
12. `btts` yes
13. `team_total` home over 0.5 · 14. `team_total` home over 1.5
15. `team_total` away over 0.5 · 16. `team_total` away over 1.5
17. `handicap` home -1 · 18. `handicap` away -1
19. `odd_even` odd
Para cada linha: `variancia` de 1 (mais segura) a 5 (mais arriscada), `valor` (alto/medio/baixo/nenhum — distância entre a SUA prob e o prior Poisson do briefing quando existir, + robustez ao roteiro) e `nota` de 1 frase.

### Passo 6 — REFUTAÇÃO (advogado do diabo) e confiança por REGRA
**DISCIPLINA DE VARIÂNCIA (aplique ANTES de escolher a candidata — valor NÃO desempata sozinho):** entre apostas de valor parecido, crave SEMPRE a de MENOR variância. Escada, da mais segura à mais arriscada: **(1)** team_total over 0.5 do lado forte → **(2)** team_total 1.5 / handicap de favorito claro / dupla chance / DNB → **(3)** over_under (a LINHA é a alavanca: escolha linha com margem ≥0.3 do SEU total; linha colada no xG é cara-ou-coroa — afaste a linha ou troque de mercado. Linhas INTEIRAS também valem na best_bet — under/over 2, 3 ou 4 — e têm PUSH de proteção quando o total cai exato: under 3.0 num jogo que você lê como "2 gols, risco de 3" domina o under 2.5, porque o cenário-limite devolve a aposta em vez de perder) → **(4)** 1x2 → **(5)** btts. **PROIBIDO** cravar 1x2 com a sua própria prob < 0.45 (e NUNCA o empate como best_bet) enquanto existir dupla chance/DNB/team_total com valor: prob baixa + "valor" é ticket de longshot, não leitura sharp. Em jogo com veredito de intenção ⚠️ (um lado administra), prefira under com margem ou team_total do lado que precisa. A anti-timidez vale pro TAMANHO do xG, não pra escolher mercado arriscado: convicção no número, disciplina no mercado.
Escolha a aposta candidata (maior valor × menor variância compatível com o roteiro). ANTES de cravar, **ataque-a**: 2-3 ataques em `refutacao.ataques`, cada um citando os IDs (conclusão/aresta) que jogam CONTRA, com veredito: **derruba** / **enfraquece** / **nao_sustenta**. Se um ataque DERRUBA, troque de aposta e refaça este passo. Então aplique a **REGRA DE CONFIANÇA** (não é feeling — escreva a regra aplicada em `confidence_regra`):
- **high** = ≥3 arestas independentes convergem pra aposta E nenhum ataque ficou em "derruba"/"enfraquece" com dado forte E as rotas A e B do base rate apontam na mesma direção.
- **low** = arestas em conflito direto sem vencedor claro, OU um ataque "enfraquece" sustentado por dado forte.
- **medium** = o resto.

## Calibragem numérica (regras duras)
- **PARTA da Rota B** (prior) e MOVA com evidência nomeada — direção E tamanho. Sem fator nem roteiro, fique no prior; nunca regrida pro meio por covardia.
- **ANTI-TIMIDEZ COM REGRA:** quando ≥3 fatores independentes convergem a favor de um lado (ex.: precisa vencer + rival desengajado + rival desfalcado na defesa), o xG desse lado DEVE fugir da média — 30-60% acima do prior é o intervalo esperado nesse cenário, não exceção. Timidez em cenário unilateral é erro tão grave quanto over por inércia.
- **SoT é o volume primário** (3× mais denso que gols); gols dão a conversão. Onde as rotas divergem, confie na B.
- Desconto de desfalque age no **VOLUME**, não na conversão. **NÃO double-conte** desfalque que já estava fora nos últimos 5 (já está na média). With/without com ⚠️: ignore o de gols, olhe o de SoT. Desfalque DEFENSIVO (alto % das interceptações do time) sobe o λ do ADVERSÁRIO.
- Vantagem de casa já está embutida nos λ — não some de novo.
- O **VEREDITO DE INTENÇÃO** do briefing (banner no bloco de motivação) é o filtro que mais separou acerto de erro: processe-o como conclusão de `tabela_motivacao` e cruze-o com estilo e desfalques antes de escolher o mercado.
- **NÃO gaste raciocínio conferindo somas** (bands × xg): o runtime normaliza. Gaste em análise e cruzamento.

---

**PARTE 2 · OS DADOS DO JOGO** — é daqui que saem as conclusões do Passo 1. Percorra bloco a bloco.

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

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 6.81**
  - **Marcos Senesi** nota **7.04** (season) · forma 7.3↑ (últ.5 do time: 6.6→7.1→7.3→8.2→7.3 📈 subindo) · 2× MOTM · 37j
  - **Rayan** nota **7.03** (season) · forma 7.1= (últ.5 do time: 6.7→7.2→6.8→7.6→7.2 📈 subindo) · 13j
  - **Alex Scott** nota **7** (season) · forma 7.24↑ (últ.5 do time: 7.2→7.5→7.5→7.2→6.8 📉 caindo) · 37j
  - **Antoine Semenyo** nota **6.98** (season) · forma 6.98= (últ.5 do time: –→–→–→–→– ⚠️ poucos jogos na janela) · **faltou 5/5** · 2× MOTM · 21j
  - **Marcus Tavernier** nota **6.94** (season) · forma 7.08= (últ.5 do time: 7→7.3→6.8→7.1→7.2 ➡️ estável) · 4× MOTM · 33j
  - **James Hill** nota **6.93** (season) · forma 7.14↑ (últ.5 do time: 7.1→7.6→6.7→7.3→7 ➡️ estável) · 3× MOTM · 27j

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

### Qualidade individual (notas · season vs forma)
- **Nota média do time (todas comps): 7.05**
  - **Marc Guéhi** nota **7.39** (season) · forma 7.42= (últ.5 do time: –→6.9→7.4→7.7→7.7 📈 subindo) · **faltou 1/5** · 3× MOTM · 17j
  - **Rayan Cherki** nota **7.33** (season) · forma 7↓ (últ.5 do time: 6.8→7.2→6.7→7.6→6.7 ➡️ estável) · 7× MOTM · 42j
  - **Jérémy Doku** nota **7.29** (season) · forma 8.2↑ (últ.5 do time: 9.2→9.1→9→6.5→7.2 📉 caindo) · 5× MOTM · 36j
  - **Erling Haaland** nota **7.27** (season) · forma 7↓ (últ.5 do time: 6.5→7.2→7.1→–→7.2 📈 subindo) · **faltou 1/5** · 7× MOTM · 41j
  - **Phil Foden** nota **7.21** (season) · forma 7.3= (últ.5 do time: 7→6.5→6.8→8.9→– 📈 subindo) · **faltou 1/5** · 7× MOTM · 39j
  - **Rodri** nota **7.2** (season) · forma 7.2= (últ.5 do time: –→–→–→–→7.2 ⚠️ poucos jogos na janela) · **faltou 4/5** · 1× MOTM · 26j

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

### Cruzamento de MOMENTUM (fluxo minuto-a-minuto dos últimos 5, já cruzado pra você)
A curva de momentum foi digerida e CRUZADA em código — não precisa cruzar 90 pontos na mão, use a conclusão abaixo (quem domina cada janela) junto com o cruzamento de gols acima.

**Janela de gol provável pela curva de momentum** — AFC Bournemouth: **0-15** (domínio -1.5) · Manchester City: **76-90** (domínio -5). Cruze com o timing de gols e com a intenção: se a janela de quem PRECISA do gol coincide com a fraqueza do outro, é ali que o gol tende a sair.

| Faixa | AFC Bournemouth domínio/j | Manchester City domínio/j | cruzamento |
|---|---|---|---|
| 0-15 | +0.8 | +2.3 | -1.5 ≈ |
| 16-30 | +0.6 | +4.4 | -3.8 ✈️ |
| 31-45 | +1.1 | +4.7 | -3.6 ✈️ |
| 46-60 | -1 | +3.4 | -4.4 ✈️ |
| 61-75 | -2.7 | +2.1 | -4.8 ✈️ |
| 76-90 | -1 | +4 | -5 ✈️ |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ AFC Bournemouth (casa) = 1.13 · λ Manchester City (fora) = 1.48 · total = 2.61

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- AFC Bournemouth: λ_SoT 3.92 × conv 29% → **1.14 gols**
- Manchester City: λ_SoT 3.65 × conv 36% → **1.31 gols**
- total via SoT = 2.45
- **Índice de volume do jogo**: λ_SoT total 7.6 vs média da liga 8.5 SoT → **ABAIXO** (jogo travado → pressão de UNDER)
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson corrigido por **Dixon-Coles** sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 27/29/44% | 31/31/39% |
| Over 1.5 | 75% | 72% |
| Over 2.5 | 48% | 44% |
| Over 3.5 | 27% | 23% |
| BTTS | 54% | 51% |

**Mercados derivados do MESMO grid corrigido** (Rota B — já coerentes entre si; use como prior destes mercados):
- **Dupla chance**: 1X **61%** · 12 **69%** · X2 **69%** · **Draw No Bet** casa 44% / fora 56%
- **Placar exato (mais prováveis)**: 1-1 15% · 0-0 10% · 0-1 10% · 1-2 8%
- **Odd/Even**: ímpar 46% / par 54% · **Multigoals**: 0-1 28% · 2-3 49% · 4+ 23%
- **Team totals** (marginais do λ da Rota B — a prob de CADA time marcar; base do `team_total`): AFC Bournemouth over 0.5 **68%** / over 1.5 **32%** · Manchester City over 0.5 **73%** / over 1.5 **38%**
- **Fair odds no-vig (1x2, calculadas pelo grid — não pelo mercado)**: casa 3.26 · empate 3.27 · fora 2.58. São PROBABILIDADE JUSTA, não veredito de valor (sem odds do mercado ingeridas não há EV/CLV — não prometa "aposta certa").
- ⚠️ O grid Dixon-Coles JÁ corrige o empate pra cima (o Poisson independente o subestima). **O empate / dupla chance é pick LEGÍTIMO** quando o prior aqui aponta — NÃO o rebaixe por covardia; num jogo travado de poucos gols o X costuma ser o de MENOR variância com valor.

**Baseline da liga (1ºT/2ºT):** 43% dos gols saem no 1º tempo / 57% no 2º (sobre 368 jogos jogados). Use como referência pra dizer se um time é ANÔMALO no timing (o padrão da literatura é ~44/56 — 2º tempo mais goleador por fadiga/game-state).
**Baseline por faixa de 15min (% dos gols da liga):** 0-15: 12% · 16-30: 11% · 31-45: 21% · 46-60: 15% · 61-75: 16% · 76-90: 26%. É a curva NORMAL — compare o timing de cada time (bloco "Distribuição de gols por faixa") contra ela; desvio grande (marca/sofre muito mais que a liga numa janela) é o sinal de onde o gol tende a sair NESTE jogo.

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de `one_x_two_1t`/`one_x_two_2t`): 1ºT casa/E/fora **23/42/35%** · 2ºT **30/41/29%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus `over25_prob`, `btts_prob` e `one_x_two` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

## Cruzamentos pré-computados (bloco `cruzamentos_computados` — o código JÁ cruzou; são os sinais mais fortes do briefing)
### Arquétipo — desempenho contra o ESTILO do adversário de hoje (jogos-espelho por posse; NÃO é a média geral)
- **AFC Bournemouth** contra **dominante** (o estilo do Manchester City, posse média 60.9%): marca **1.45/j** e sofre 2.00/j em 11 jogos — na média da temporada (1.56).
- **Manchester City** contra **equilibrado** (o estilo do AFC Bournemouth, posse média 50.2%): marca **2.09/j** e sofre 1.27/j em 11 jogos — na média da temporada (2.08).

### Mecanismo de gol — canal (classificado do lance): como um GERA × como o outro SOFRE (baseline = liga)
- **CANAL ABERTO — contra-ataque**: AFC Bournemouth gera 12% dos gols por aí × Manchester City sofre 3% por aí (liga: 4%) → índice 2.0×.

### Dinâmica pós-gol — reação MEDIDA a cada gol (Δ do net de momentum nos 10min após o evento)
- **AFC Bournemouth** (18 gols medidos, últimos 8 jogos): neutro ao sofrer (Δ 0.7) · **MATA O JOGO após marcar** (Δ +1.4 — segue pressionando).
- **Manchester City** (25 gols medidos, últimos 8 jogos): neutro ao sofrer (Δ -0.9) · neutro após marcar (Δ 0.5).

### Artilharia — quem faz os gols de cada time (season · últimos 5 · volume · pênaltis · desfalque)
- **AFC Bournemouth**: Eli Kroupi **12 gols** (2 pên) · últ.5: 3 · 0.7 SoT/j | Antoine Semenyo **10 gols** (1 pên) · últ.5: 0 · 1.4 SoT/j | Marcus Tavernier **6 gols** (2 pên) · últ.5: 1 · 0.7 SoT/j | Evanilson **6 gols** · últ.5: 0 · 0.7 SoT/j | Rayan **5 gols** · últ.5: 3 · 0.6 SoT/j
- **Manchester City**: Erling Haaland **26 gols** (3 pên) · últ.5: 4 · 1.7 SoT/j | Phil Foden **7 gols** · últ.5: 0 · 0.6 SoT/j | Antoine Semenyo **6 gols** · últ.5: 1 · 0.8 SoT/j | Tijjani Reijnders **5 gols** · últ.5: 0 · 0.6 SoT/j | Nico O'Reilly **5 gols** · últ.5: 0 · 0.4 SoT/j

### Setores — onde o jogo se ganha (formação provável + grid real: miolo × miolo e produção por corredor × lado fraco do rival)
- **Formações prováveis (moda últ.5)**: AFC Bournemouth 4-2-3-1 × Manchester City 4-2-3-1 → meios pareados (5v5) — decide-se nos corredores e nos duelos. (Formação declarada ≠ real: hipótese, não lei.)
- **AFC Bournemouth atacando**: 36% da criação nasce pela **esquerda** (Adrien Truffert (61), Antoine Semenyo (25)) × corredor direita do Manchester City defendido por Matheus Nunes (nota 7.0 últ.5). Centro: 34%.
- **Manchester City atacando**: 34% da criação nasce pela **esquerda** (Jérémy Doku (64), Nico O'Reilly (30)) × corredor direita do AFC Bournemouth defendido por Álex Jiménez (nota 6.7 últ.5) ⚠️ DESFALQUE + Adam Smith (nota 6.8 últ.5). Centro: 34%.

### Duplas de gol — quem serve quem (assistente → marcador na temporada; desfalque numa ponta quebra a dupla)
- **AFC Bournemouth**: Marcus Tavernier → Evanilson **3x** | Marcos Senesi → Eli Kroupi **3x** | David Brooks → Antoine Semenyo **2x**
- **Manchester City**: Jérémy Doku → Erling Haaland **4x** | Rayan Cherki → Phil Foden **3x** | Erling Haaland → Tijjani Reijnders **2x** | Bernardo Silva → Antoine Semenyo **2x**

### Expectativa por jogador — xSoT e xG do XI provável (taxa/90 × minutos esperados × defesa do rival; conversão encolhida pra liga)
- **AFC Bournemouth** vs Manchester City (arquétipo do rival: dominante · rival cede 0.80× o SoT da liga): λ bottom-up do XI **1.28 xG** vs top-down 1.56 gols/j (XI cobre 64% dos gols da season — o resto é banco). Desfalques fora do XI: Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni.
  - **Eli Kroupi** (M, 75min esp.): xG **0.48** → **P(marca) 38%** · xSoT 0.93 → P(1+ SoT) 60% · conv 52% (12 gols, 2 pên/31j) · xKP 0.94 · fatores: arquétipo -6% [1.14 SoT/90 contra dominante (394min) vs 1.23 geral]; casa +15% [1.51 SoT/90 em casa vs 1.23 geral]; forma +6% [rating últ.3 7.1 vs season 6.9]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Rayan** (M, 67min esp.): xG **0.27** → **P(marca) 24%** · xSoT 0.53 → P(1+ SoT) 41% · conv 50% (5 gols/13j) · xKP 0.90 · fatores: arquétipo -8% [0.57 SoT/90 contra dominante (157min) vs 0.75 geral]; casa +15% [1.01 SoT/90 em casa vs 0.75 geral]; forma +4% [rating últ.3 7.2 vs season 7.0]; setor +8% [corredor esquerda do rival em queda — Nico O'Reilly: tendência -0.4 (nota últ.3 vs season)]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Marcus Tavernier** (M, 87min esp.): xG **0.14** → **P(marca) 13%** · xSoT 0.53 → P(1+ SoT) 41% · conv 28% (6 gols, 2 pên/32j) · xKP 1.37 · fatores: arquétipo -25% [0.46 SoT/90 contra dominante (788min) vs 0.81 geral]; casa +11% [0.90 SoT/90 em casa vs 0.81 geral]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Evanilson** (F, 78min esp.): xG **0.13** → **P(marca) 12%** · xSoT 0.52 → P(1+ SoT) 41% · conv 27% (6 gols/34j) · xKP 0.61 · fatores: arquétipo +10% [0.91 SoT/90 contra dominante (888min) vs 0.83 geral]; casa -15% [0.68 SoT/90 em casa vs 0.83 geral]; canal -6% [33% dos gols dele: pênalti — rival sofre 1.3× a liga aí]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Alex Scott** (M, 90min esp.): xG **0.13** → **P(marca) 12%** · xSoT 0.48 → P(1+ SoT) 38% · conv 27% (3 gols/36j) · xKP 0.80 · fatores: arquétipo +20% [0.51 SoT/90 contra dominante (891min) vs 0.42 geral]; casa +15% [0.52 SoT/90 em casa vs 0.42 geral]; forma +3% [rating últ.3 7.1 vs season 7.0]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **David Brooks** (M, 28min esp.): xG **0.03** → **P(marca) 3%** · xSoT 0.20 → P(1+ SoT) 18% · conv 17% (1 gols/30j) · xKP 0.43 · fatores: casa -15% [0.00 SoT/90 em casa vs 0.90 geral]; forma -3% [rating últ.3 6.6 vs season 6.7]; setor +8% [corredor esquerda do rival em queda — Nico O'Reilly: tendência -0.4 (nota últ.3 vs season)]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Tyler Adams** (M, 36min esp.): xG **0.03** → **P(marca) 3%** · xSoT 0.08 → P(1+ SoT) 8% · conv 34% (2 gols/23j) · xKP 0.12 · fatores: arquétipo -23% [0.24 SoT/90 contra dominante (370min) vs 0.34 geral]; casa -5% [0.32 SoT/90 em casa vs 0.34 geral]; forma +5% [rating últ.3 7.0 vs season 6.8]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Adrien Truffert** (D, 90min esp.): xG **0.02** → **P(marca) 2%** · xSoT 0.09 → P(1+ SoT) 9% · conv 25% (1 gols/36j) · xKP 0.51 · fatores: arquétipo -25% [0.00 SoT/90 contra dominante (963min) vs 0.17 geral]; casa -15% [0.11 SoT/90 em casa vs 0.17 geral]; forma +10% [rating últ.3 7.3 vs season 6.8]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **James Hill** (D, 90min esp.): xG **0.02** → **P(marca) 2%** · xSoT 0.09 → P(1+ SoT) 8% · conv 26% (0 gols/27j) · xKP 0.45 · fatores: arquétipo +25% [0.14 SoT/90 contra dominante (656min) vs 0.09 geral]; casa -6% [0.09 SoT/90 em casa vs 0.09 geral]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Marcos Senesi** (D, 90min esp.): xG **0.02** → **P(marca) 1%** · xSoT 0.08 → P(1+ SoT) 8% · conv 19% (0 gols/35j) · xKP 0.47 · fatores: arquétipo -25% [0.09 SoT/90 contra dominante (962min) vs 0.14 geral]; casa -15% [0.06 SoT/90 em casa vs 0.14 geral]; forma +10% [rating últ.3 7.6 vs season 7.1]; volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
  - **Djordje Petrovic** (G, 90min esp.): xG **0.00** → **P(marca) 0%** · xSoT 0.00 → P(1+ SoT) 0% · conv 34% (0 gols/36j) · xKP 0.00 · fatores: volume cedido -20% [rival cede 3.33 SoT/j vs liga 4.19]
- **Manchester City** vs AFC Bournemouth (arquétipo do rival: equilibrado · rival cede 1.01× o SoT da liga · rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora): λ bottom-up do XI **1.72 xG** vs top-down 2.14 gols/j (XI cobre 68% dos gols da season — o resto é banco).
  - **Erling Haaland** (F, 90min esp.): xG **0.67** → **P(marca) 49%** · xSoT 1.45 → P(1+ SoT) 77% · conv 47% (28 gols, 3 pên/34j) · xKP 0.68 · fatores: arquétipo -9% [1.65 SoT/90 contra equilibrado (925min) vs 1.82 geral]; fora -15% [1.51 SoT/90 fora vs 1.82 geral]; forma -3% [rating últ.3 7.2 vs season 7.3]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Antoine Semenyo** (M, 82min esp.): xG **0.32** → **P(marca) 27%** · xSoT 0.77 → P(1+ SoT) 54% · conv 45% (6 gols/15j) · xKP 0.79 · fatores: arquétipo -4% [0.81 SoT/90 contra equilibrado (447min) vs 0.84 geral]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Jérémy Doku** (M, 78min esp.): xG **0.18** → **P(marca) 16%** · xSoT 0.52 → P(1+ SoT) 40% · conv 34% (5 gols/28j) · xKP 2.46 · fatores: arquétipo -25% [0.53 SoT/90 contra equilibrado (510min) vs 0.80 geral]; fora -15% [0.47 SoT/90 fora vs 0.80 geral]; forma +10% [rating últ.3 8.2 vs season 7.2]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Rayan Cherki** (M, 67min esp.): xG **0.17** → **P(marca) 16%** · xSoT 0.55 → P(1+ SoT) 42% · conv 30% (4 gols/31j) · xKP 3.02 · fatores: arquétipo -15% [0.62 SoT/90 contra equilibrado (436min) vs 0.73 geral]; fora +15% [1.10 SoT/90 fora vs 0.73 geral]; forma -3% [rating últ.3 7.2 vs season 7.3]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Nico O'Reilly** (D, 90min esp.): xG **0.17** → **P(marca) 15%** · xSoT 0.52 → P(1+ SoT) 40% · conv 35% (5 gols/33j) · xKP 0.85 · fatores: arquétipo +7% [0.53 SoT/90 contra equilibrado (854min) vs 0.49 geral]; forma -7% [rating últ.3 6.6 vs season 6.9]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Marc Guéhi** (D, 90min esp.): xG **0.09** → **P(marca) 9%** · xSoT 0.32 → P(1+ SoT) 28% · conv 28% (1 gols/14j) · xKP 0.79 · fatores: arquétipo -25% [0.00 SoT/90 contra equilibrado (360min) vs 0.36 geral]; fora +15% [0.43 SoT/90 fora vs 0.36 geral]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Bernardo Silva** (M, 87min esp.): xG **0.05** → **P(marca) 5%** · xSoT 0.15 → P(1+ SoT) 14% · conv 34% (2 gols/36j) · xKP 1.51 · fatores: arquétipo -25% [0.00 SoT/90 contra equilibrado (803min) vs 0.19 geral]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Rayan Aït-Nouri** (M, 78min esp.): xG **0.04** → **P(marca) 4%** · xSoT 0.15 → P(1+ SoT) 14% · conv 26% (0 gols/16j) · xKP 1.18 · fatores: arquétipo -25% [0.00 SoT/90 contra equilibrado (284min) vs 0.19 geral]; fora +15% [0.30 SoT/90 fora vs 0.19 geral]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Matheus Nunes** (D, 84min esp.): xG **0.02** → **P(marca) 2%** · xSoT 0.05 → P(1+ SoT) 4% · conv 38% (1 gols/33j) · xKP 0.91 · fatores: arquétipo -25% [0.00 SoT/90 contra equilibrado (690min) vs 0.06 geral]; forma -4% [rating últ.3 6.9 vs season 7.1]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Abdukodir Khusanov** (D, 90min esp.): xG **0.01** → **P(marca) 1%** · xSoT 0.05 → P(1+ SoT) 5% · conv 29% (0 gols/20j) · xKP 0.37 · fatores: arquétipo -25% [0.00 SoT/90 contra equilibrado (344min) vs 0.07 geral]; fora -15% [0.00 SoT/90 fora vs 0.07 geral]; forma +7% [rating últ.3 7.2 vs season 6.9]; desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]
  - **Gianluigi Donnarumma** (G, 90min esp.): xG **0.00** → **P(marca) 0%** · xSoT 0.00 → P(1+ SoT) 0% · conv 34% (0 gols/33j) · xKP 0.03 · fatores: desfalque def. rival +6% [rival perde 14% do volume defensivo (desarme+interceptação) com Ryan Christie, Julio Soler, Álex Jiménez, M. Akinmboni fora]

---

**PARTE 3 · SUA SAÍDA** (objeto tipado, validado pelo runtime — campos em inglês/português conforme o schema; TODOS os textos em PT-BR)

- `home` / `away`: `xg`, `xg_1t`, `xg_2t`, `xg_bands` (6 faixas — distribuição aproximada; o runtime normaliza a soma) e `summary` (leitura curta do time).
- `general`: `total`, `total_1t`, `total_2t`, `over25_prob`, `btts_prob`, `one_x_two` / `one_x_two_1t` / `one_x_two_2t`, `confidence` + `confidence_regra` (a regra do Passo 6 aplicada, por extenso) e `summary`.
- `conclusoes`: TODAS as conclusões do Passo 1 (id, bloco, fato, dado copiado, direção, força).
- `blocos_sem_sinal`: blocos que não renderam conclusão, com motivo.
- `descartadas`: conclusões não usadas em nenhuma aresta, com motivo.
- `jogadores`: a leitura de CADA jogador nomeado no briefing (Passo 2).
- `previsoes_jogadores`: a previsão de CADA jogador do XI provável dos dois times (Passo 2b) — nome, time, `x_sot`, `x_gols`, `prob_marca`, `prob_sot1`, `x_kp` (ancorados no bloco Expectativa; mova só com evidência nomeada) e `leitura` (o que esperar dele neste jogo).
- `arestas`: os cruzamentos do Passo 3 (id, liga=[IDs], leitura, efeito).
- `roteiros`: os filmes do Passo 4 (nome, prob, filme, arestas=[IDs]).
- `janelas`: as 6 faixas do Passo 4b (faixa, leitura, prob_gol, lado) — uma entrada POR faixa, na ordem.
- `tempos`: `primeiro` e `segundo` (analise completa + prob_gol de cada tempo).
- `marcadores`: `home` e `away` com 2-3 prováveis marcadores cada (nome, prob, motivo) — Passo 4c.
- `mercados`: o board COMPLETO do Passo 5 (as 19 linhas).
- `best_bet`: a decisão — market/selection/team/line/confidence/probability + `evidence_for` e `evidence_against` (IDs de conclusões/arestas) + `analysis` (análise completa: roteiro esperado, o que sustenta, o risco). NUNCA "passar".
- `refutacao`: os ataques do Passo 6 e a conclusão (o que sobreviveu e por quê).
- `drivers`: os 3 fatores que mais moveram o número.

⚠️ LEMBRETE FINAL: raciocínio interno (thinking) e resposta 100% em PORTUGUÊS do Brasil, desde a primeira palavra. Comece o raciocínio com "Vou analisar…".