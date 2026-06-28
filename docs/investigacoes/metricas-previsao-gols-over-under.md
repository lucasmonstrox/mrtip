# Relatório de Investigação — Estimar MUITOS vs POUCOS gols na Premier League (over/under)

Você pediu meios práticos pra ir além do óbvio. A boa notícia: a base sólida é mais "chata" e numérica do que o folclore de apostador. A má: vários sinais badalados (derby, chuva, cartões, contra-ataque "2x") murcham no fact-check. Abaixo, tudo pesado pelos vereditos.

---

## 1. TL;DR — sinais de maior poder preditivo (ordenados)

1. **xG combinado projetado (λ_casa + λ_visitante) é a espinha dorsal.** É literalmente o λ do Poisson para o total. xG correlaciona ~0,91 com gols (nível agregado) e é a feature dominante (~60%) pra prever gols/jogo. *[suportado, forte]* — mas no nível de UMA partida há variância de Poisson enorme: é base, não bola de cristal.
2. **A linha O/U de fechamento do mercado já precifica quase tudo isso.** Closing line (Pinnacle) é o melhor estimador único; trate como prior forte e só divirja com sinal real. *[suportado, forte]* O mercado bate os modelos de xG em calibração (Bet365 Brier 57,2 < 58,6 do melhor xG).
3. **Modele mando SEPARADO (casa marca ~1,53 vs ~1,12 fora).** Mando redistribui quem marca, não infla o total por si — a menos que case favorito ofensivo forte em casa. *[suportado, forte]*
4. **Ancore no xG, não nos gols recentes (regressão à média).** Sobre/sub-conversão (G−xG) é instável ano a ano (~0,12) enquanto a criação de chance persiste (~0,63). Desconte a sorte recente. *[suportado, forte]*
5. **Goleiro titular fora → over pelos gols sofridos** é o desfalque mais quantificável: swing melhor-pior goleiro ~9,7 gols/temporada (~0,25/jogo); downgrade elite→reserva fraco ~+0,2 a +0,4 gol. *[suportado]*
6. **Bloco baixo / xGA < 1,0 → under** é quase tautológico (conceder menos xG = menos gols). Dois blocos baixos = candidato natural a under. *[suportado]*
7. **Posse % NÃO prevê gols (corr ~0,13).** Posse estéril contra bloco baixo = under. Use "passes por posse" (curto = mais perigoso), não posse %. *[suportado — desmistificação]*
8. **Bola parada ≈ 30% dos gols; penalti = ~0,76–0,79 xG.** Fonte de gol mais repetível e independente do jogo aberto; modele em bloco separado. *[suportado]*

---

## 2. Tabela mestra priorizada (só o que sobreviveu)

| # | Sinal | Direção | Força (pós-fact-check) | Como calcular / dado necessário |
|---|-------|---------|------------------------|----------------------------------|
| 1 | xG combinado projetado = λ total | contexto (base) | **Suportado / forte** | Média móvel de xG marcado de cada time × xGA do adversário, ajustado por mando; somar os dois lados; alimentar Poisson/Dixon-Coles |
| 2 | Linha O/U de fechamento (mercado) | contexto (prior) | **Suportado / forte** | Pegar total implícito (Pinnacle); invertê-lo da odd O/U 2.5 de-margem via CDF de Poisson; exigir gap mínimo antes de divergir |
| 3 | Mando modelado separado | contexto | **Suportado / forte** | λ_casa e λ_visitante separados (home_for/away_for vs against); coeficiente por liga; reduzir sem público |
| 4 | Média móvel xG/xGA (janela 5–15 jogos) | contexto (base) | **Suportado / forte** | SMA/EMA (meia-vida ~10 jogos) de xG for/against, ajustado por adversário e mando |
| 5 | Regressão à média (G−xG) | contexto | **Suportado / forte** | G−xG e GA−xGA nos últimos ~10 jogos; ancorar projeção no xG, descontar sorte; NÃO supor reversão obrigatória |
| 6 | Goleiro titular fora | **over** | **Suportado** | "goals prevented/90" (xGOT sofrido − gols sofridos) titular vs reserva; default +0,2 a +0,4 se downgrade elite→reserva fraco; ~0 se reserva competente |
| 7 | Bloco baixo / xGA < 1,0 | **under** | **Suportado** | Altura de linha baixa + PPDA alto (>11–12) + xGA medido baixo; reforço se DOIS blocos baixos |
| 8 | Posse estéril vs bloco baixo | **under** | **Suportado** | Passes por posse (curto melhor), diretividade; NÃO usar posse % |
| 9 | Fatia de bola parada (% do total) | contexto | **Suportado** | Gols esperados open-play + (escanteios esperados × ~3%) + penaltis × 0,76; usar % típica (~20–25% sem pênalti), não pico da temporada |
| 10 | Valor de um pênalti (~0,76 xG) | **over** | **Suportado** | Pênaltis esperados (times + árbitro) × 0,76–0,79 |
| 11 | Gols tardios (75–90') | **over** (2º tempo / ao vivo) | **Suportado / forte** | Janela 76–90' = ~22–26% dos gols; usar pra over de 2º tempo, NÃO pra total pré-jogo |
| 12 | Assimetria desfalque + caveat de depth | contexto | **Suportado** | Σ(Δλ de A) + Σ(Δλ de B); SEMPRE validar qualidade do substituto (gols/90, xA/90, goals prevented/90) |
| 13 | Goal involvement share | contexto | **Suportado** | (G + A do jogador)/gols do time; escala a redução; ponderar pela profundidade do elenco |
| 14 | VAR (modificador neutro) | contexto | **Suportado** | Não é sinal; net-neutro no total (mais pênaltis/acréscimo vs gols anulados) |
| 15 | Fim de temporada → decompor | contexto | **Suportado (ceticismo)** | NÃO usar nº da rodada; decompor em stakes + fadiga + rotação |
| 16 | Dixon-Coles (ρ ~ −0,13) | under (leve) | **Suportado** | Corrige placares baixos (0-0,1-0,0-1,1-1); efeito pequeno sobre E[total] |
| 17 | Simulação por xG (Monte Carlo) | contexto | **Suportado** | Rolling xG como λ ou simular chute-a-chute (Poisson-Binomial, ~10k sims) |
| 18 | Finalizações no alvo (com xG) | contexto | **Suportado** | Chutes no alvo > chutes totais; sempre junto do xG; volume alto + xG baixo = inflação, cuidado com over |
| 19 | Jogo morto (ambos sem objetivo) | **over** | Parcial | Índice de stakes; flag dead_rubber só se AMBOS sem objetivo; ~+0,5 gol total (ruidoso) |
| 20 | Cartão VERMELHO | **over** | Parcial (parte vermelho = sólida) | Expulsão a ~30' do fim ≈ +0,5 gol líquido pró-vantagem numérica |
| 21 | Artilheiro fora | **under** (team-total) | Parcial | Reduzir xG do time; −5/10% com depth, até −25/30% só em alta dependência sem reserva |
| 22 | Criador/armador fora | **under** (team-total) | Parcial | Fatia de xA/key passes; −10 a −20% conforme concentração e substituto |
| 23 | Zagueiro central-chave fora | **over** | Parcial | +10–20% xGA do adversário; checar entrosamento da dupla substituta |
| 24 | Vento forte (>24–32 km/h) | **under** | Parcial (sólido em esportes aéreos) | Vento sustentado + estádio exposto + times de cruzamento/bola longa |
| 25 | Neve pesada | **under** | Parcial | Distinguir neve forte (real) de frio puro (folclore) |
| 26 | Altitude (diferença) | contexto/saldo | Suportado (como saldo, não over) | +1.000 m de diferença ≈ +0,5 no SALDO; dias de aclimatação |
| 27 | Ressaca de Champions (não Europa League) | under (team-total) | Suportado (split) | Flag jogo CL meio de semana + turnaround ≤3 dias; só lado que jogou CL |
| 28 | Calor extremo (WBGT >28°C) | contexto (muda estilo) | Suportado (null direto sobre gols) | Lê "jogo mais lento", NÃO under automático |
| 29 | Dependência/vulnerabilidade de bola parada | over (mismatch) | Parcial | Set-piece xG ofensivo de A × fraqueza de set-piece de B; com shrinkage |
| 30 | Diretividade/transições | over (condicional) | Parcial | Fast-break vale ~1,3–1,5× o xG/chute (0,17 vs 0,12), NÃO 2× |

---

## 3. Por tema

### 3.1 xG / finalização — a base de tudo

**Sólido (suportado):**
- **xG combinado = λ do Poisson.** Soma do xG esperado dos dois lados é a média da distribuição do total. Exemplo: 1,8 + 1,5 = 3,3 → jogo "primed" pra over. Correlação ~0,91 (agregada) e feature dominante (~60%). **Ressalva crítica:** 0,91 é correlação de temporada; em UMA partida os gols são sorteio de Poisson com variância grande + erro de estimar o xG futuro.
- **Média móvel xG/xGA (5–15 jogos)** bate gols brutos como preditor. Backtest de ~12.000 jogos: os 10 melhores modelos eram TODOS de xG; EMA ≈ SMA. **Mas:** ganho de Brier sobre gols é só ~1,9% relativo, e nenhum modelo do backtest deu lucro (perderam 300–800 unidades).
- **Regressão à média (G−xG).** Persistência de sobre-conversão ~0,12 vs criação de chance ~0,63. Ancore no xG. **Cuidado com a falácia do apostador:** overperformer NÃO "tem" que underperformar — ele só volta a converter na linha do xG.
- **Finalizações no alvo (sempre com xG).** Volume bruto de chutes é ruidoso. Sinal de armadilha: **volume alto + xG combinado baixo = inflação → cuidado com over.**

**Relativize (parcial):**
- **Big chances:** ~38% de conversão, mas têm viés de resultado (chute que entra tende a ser rotulado big chance), são marcadas manualmente e inconsistentes entre ligas — podem PIORAR o modelo por overfit ao desfecho. O "×0,38" dupla-conta xG.
- **xG por chute:** trait real e estável (~0,63), mas **redundante** com o xG combinado; mais diagnóstico que preditor; atualiza devagar (~200 chutes).
- **xGOT:** ótimo pra avaliar finalização/goleiro retrospectivamente, mas carrega info pós-chute (onde a bola foi colocada) — a alta correlação com gols na mesma partida é quase mecânica, não prova poder prospectivo. Os R² de 0,92/0,98 são cross-sectional (mesma partida); o 0,98 estava mislabel (é xG feminino, não xGOT).

**Mecanismo-chave:** o xG por chute NÃO diferencia o finalizador — Kane e um zagueiro na mesma posição recebem o mesmo xG. Por isso modelos de xG bruto não "veem" um artilheiro de elite (Kane: 30 gols vs ~21,5 xG em 2022/23).

### 3.2 Desfalques — assimetria + caveat de depth

O framework correto (suportado): **ofensivo fora → under no team-total; defensivo fora → over nos gols sofridos. Some os dois lados.** E o ponto MAIS importante de toda a dimensão: **depth neutraliza o desfalque** — estudo de 522 jogos (5 ligas) achou produção ofensiva IGUAL ou MELHOR durante ausências; UEFA CL achou <5% de queda com banco profundo.

- **Goleiro fora [suportado]** — o mais quantificável. PL 2024/25: Henderson +4,4 gols evitados vs Verbruggen −5,3 = swing ~9,7/temporada (~0,25/jogo). Downgrade elite→reserva fraco: **+0,2 a +0,4 gol**. Reservas competentes (Ortega no City: +2 evitados) → ajuste ~0.
- **Goal involvement share [suportado]** — calibra QUANTO o desfalque pesa: (G+A)/gols do time. Share alto + gap grande pro 2º artilheiro = insubstituível. Mas o "Haaland 1º→14º" é contrafactual ingênuo (o próprio artigo pede "pinch of salt").
- **Artilheiro fora [parcial]** — direção certa, mas o "15–30%" vem de blogs. Queda média fica **<5% com banco profundo**; só puxe pro −25/30% em alta dependência sem reserva.
- **Criador fora [parcial]** — função mais redistribuível que finalização; estudo de datas FIFA mostrou criação MANTIDA via reorganização (mais passes progressivos).
- **Zagueiro central fora [parcial]** — direção certa (+10–20% xGA), mas Van Dijk/Liverpool foi crise múltipla de zaga (Van Dijk + Gomez + Matip), não desfalque isolado. Ruidoso, depende do entrosamento da dupla substituta.
- **Rotação / vários fora [contestado]** — dois estudos peer-reviewed opostos. Não trate "múltiplos titulares fora = under automático".

### 3.3 Fadiga / calendário

- **Gols tardios (75–90') [suportado, forte]** — 76–90' concentra ~22–26% dos gols (PL 25,8%), a maior faixa. **Mas a causa é mista** (game state + subs + fadiga), não só cansaço. Use pra **over de 2º tempo / ao vivo**, não pra total pré-jogo.
- **Ressaca de Champions ≠ Europa League [suportado]** — o split é o achado. CL real em PONTOS (10/13 clubes ingleses perderam mais pontos; Liverpool dobrou pontos perdidos/jogo 0,75→1,5). **EL não mostra prejuízo doméstico** (Keele, 16 temporadas — clubes em EL marcaram MAIS). Efeito é específico de competição muito exigente.
- **Limiar de 3 dias [parcial]** — não-linear: importa só com ≤3 dias, irrelevante com ≥4 (Scoppa). Mas vale pra VITÓRIA/output físico, não pro total de gols. Efeito mais limpo no team-total do lado cansado.
- **Congestionamento/pacing [parcial]** — meta-análise (Julian): distância total inalterada, cai só baixa/moderada intensidade; **técnica (passe/finalização) preservada**. Isso CORTA contra o under — o canal "menos chances" é mais tênue que o argumento sugere.
- **Risco de lesão <5 dias [suportado]** — fato epidemiológico sólido (mais lesão muscular), mas é **contexto via desfalques**, não empurra gols direto.
- **Diferença de descanso [parcial]** — afeta 1X2/handicap, quase nada no over/under.
- **Sua hipótese (meio de semana importante + fora → under) [parcial]:** defensável SÓ na forma estreita — **team-total under do lado fora+cansado quando o jogo de meio de semana foi CL de alta minutagem e turnaround ≤3 dias**. Como under da partida inteira é fraco-a-médio. Descarte se: turnaround ≥4 dias, competição não-CL, ou jogo muito rodado. Contra-vetores: viagem não reduz gols (efeito de distância virou insignificante na era moderna), EL é null, e fadiga também alimenta gols tardios (over).

### 3.4 Clima

A maioria é mais fraca do que o senso comum diz.

- **Calor extremo [suportado]** — o mais bem calibrado: muda o ESTILO (sprints −10%, mais controle, passe +3,2%) mas Nassis (Copa 2014) achou **"no difference in number of goals" entre faixas de WBGT**. NÃO afirma under. Lê "jogo mais lento", não "menos gols".
- **Altitude [suportado, como saldo]** — +1.000 m de diferença ≈ **+0,5 no SALDO** a favor do time mais alto (gols tardios da casa). É handicap/saldo, NÃO over limpo dos dois lados.
- **Vento forte [parcial]** — sólido em esportes aéreos (NFL: passe 60,3%→54,65%; FG 83,8%→76,9%), mas no futebol a evidência direta sobre gols é inferencial (UCL só mostra DESLOCAMENTO da finalização pra dentro da área, OR 1,21). Magnitude incerta no futebol.
- **Chuva leve / bola rápida [parcial]** — física sólida (atrito reduzido, skid), e Pullein mostra piso molhado marca mais (out 2,67 vs fev 2,45; Over 2,5 cai 50%→44%). Mas confundido com sazonalidade e creditado ao ESTADO DO PISO, não à chuva.
- **Neve pesada [parcial]** — efeito real e grande (NFL −25% pontos), mas evidência vem da NFL.
- **Gramado [parcial]** — mecanismo aceito (corte 20–30 mm padroniza velocidade da bola), manipulação tática documentada, mas quase tudo qualitativo, sem coeficiente.

### 3.5 Árbitro / bola parada

- **Pênalti = ~0,76–0,79 xG [suportado]** — Opta 0,79, StatsBomb 0,78, Wyscout 0,76. Mas raros (~0,20/jogo) e concessão é endógena.
- **Fatia de bola parada [suportado]** — ~30% com pênalti, ~26,9% sem pênalti (recorde 2025/26), escanteios ~12–17%, falta direta ~2–3%. **Calibração:** a % recorde de 2025/26 está inflada pelo denominador (open-play despencou). Use a % típica.
- **VAR [suportado]** — net-neutro no total (meta-análise Rogerson 2024: sem diferença significativa em gols/jogo). Use como modificador, não sinal.
- **Acréscimo [parcial]** — direcionalmente certo, mas ganho mínimo. 2025/26 tem RECORDE de acréscimo E de gols tardios, MAS é a 2ª temporada de MENOR scoring da PL (~2,24 gols/jogo). O acréscimo **redistribui** gols pro fim, não levanta o total.
- **Tendência do árbitro a pênalti [parcial]** — real mas pequeno (+0,04–0,08 xG) e ruidoso (6 pênaltis em 10 jogos não é tendência). Use shrinkage forte pra média da liga.
- **Dependência/vulnerabilidade de bola parada + escanteios [parcial]** — habilidade ofensiva de set-piece é das mais estáveis (Arsenal: 19 gols de escanteio, recorde). Mas é input de qualidade de time, não gatilho de over (Arsenal foi set-piece-heavy DENTRO de um perfil de baixa pontuação). Conversão de escanteio é só ~2–3%; volume bruto é preditor fraco.

### 3.6 Estilo tático

A grande lição: **o total depende da INTERAÇÃO entre os dois estilos, e vários sinais badalados estão confundidos com QUALIDADE do time.**

- **Bloco baixo / xGA<1,0 → under [suportado]** — quase tautológico. ~80% dos gols vêm de dentro da área, exatamente o que o bloco nega. Dois blocos baixos = under. **Use o xGA medido, não a fama tática** (Burnley "senta" mas sofre muito).
- **Posse estéril [suportado]** — corr posse%×gols ~0,13; meta-análise de 75 artigos confirma que posse % não é dominante; sequências curtas (~4 passes/posse) elevam gol, posses longas têm efeito negativo. **Não use posse % como sinal de over.**
- **PPDA / pressão alta [parcial]** — a tese "low PPDA infla xGA dos dois lados" FALHA nos exemplos: Man City (low PPDA) tem o MENOR xGA da PL (~1,11). Pressores de elite SUPRIMEM xGA. O "espaço nas costas" só vira gol contra pressor sub-elite ou vs time rápido/direto. Confundido com qualidade.
- **Linha alta [parcial]** — mesmo problema: City/Arsenal jogam linha altíssima e têm xGA dos menores. Só vira over contra adversário rápido que lança nas costas.
- **Diretividade/transições [parcial]** — fast-break tem xG/chute maior REAL (0,17 vs 0,12 open-play, ~1,3–1,5×), recorde de 10,2% dos chutes / 7,1% dos gols em 2024-25. Mas o **"2×" é exagerado** (conversão real ~10,7%). Time direto frequentemente é low-event (pode dar under). Condicional.
- **Game state [contestado]** — loss aversion é real (líder de 1 gol marca ~50,6% vs 55,3% esperado), mas a direção é AMBÍGUA: a mesma loss aversion faz o líder montar "defensive shell" e DERRUBAR o total. É fenômeno IN-PLAY, não preditor pré-jogo. Net ≈ neutro.
- **Choque de estilos [parcial]** — arcabouço correto (press+press→caos; bloco+bloco→under), mas a quantificação é fraca: StatPair dá "high press vs low block = 2,4 gols" — que é UNDER 2,5. A matriz é hipótese, não backtest.

### 3.7 Contexto / motivação

- **Mando [suportado, forte]** — casa ~1,53 vs fora ~1,12. Experimento COVID: vantagem caiu quase pela metade sem público, "quase inteiramente por redução dos gols do mandante"; visitante levou ~20% menos cartões com torcida. **Redistribui quem marca, não infla o total.**
- **Fim de temporada [suportado, ceticismo]** — NÃO há efeito-gol robusto da data em si (produção ofensiva estável o ano todo). Decomponha em stakes + fadiga + rotação. Não use nº da rodada como feature.
- **Jogo morto [parcial]** — over consistente em 3 análises (time sem nada em jogo: +0,26 marcados e +0,27 sofridos/90 = ~+0,53 no jogo). Mas zero teste de significância e flag exige AMBOS sem objetivo (raro).
- **Cartão vermelho [parcial — parte vermelho sólida]** — expulsão a ~30' do fim ≈ +0,5 gol líquido pró-vantagem numérica → **over**.
- **Favoritismo extremo [parcial]** — supremacia e total são quase ortogonais. Favorito forte pode "administrar" em 1-0/2-0 (Liverpool 24/25 venceu 64% por 2+). Só vira over quando **supremacia alta E total esperado alto** coincidem (favorito ofensivo × visitante de defesa vazada).
- **Alta importância/mata-mata [parcial]** — finais e six-pointers tendem a fechado, mas Frontiers (CSL) mostra postura conservadora COM gols estáveis. Modesto e condicional.
- **Biscotto [parcial, raro]** — quando placar baixo serve aos DOIS, under quase certo, mas FIFA neutralizou jogos finais de grupo simultâneos desde 1986.

### 3.8 Mercado / modelos — onde mora (ou não) o edge

- **Linha O/U de fechamento [suportado, forte]** — melhor estimador único; CLV é o benchmark. **Mas:** quase-eficiente, não totalmente — há viés documentado pró-OVER e overreaction de linha exploráveis (Simon 2024). É onde mora o edge residual.
- **Inversão da odd O/U 2.5 → total esperado [suportado]** — procedimento determinístico: resolver λ em ppois(2, λ) = P(under 2.5). Ex.: 62% under → λ = 2,21.
- **Decompor 1x2 → λ_casa, λ_visitante [suportado]** — supremacy = λ_casa−λ_visitante; total = λ_casa+λ_visitante. (A sub-afirmação "Poisson subestima total em 0,1–0,15" não foi verificada.)
- **Dixon-Coles (ρ ~ −0,13) [suportado]** — corrige placares baixos; efeito sobre E[total] é PEQUENO (redistribui dentro dos placares baixos).
- **Simulação por xG [suportado]** — xG é leading indicator mais repetível que gols brutos; Monte Carlo (~10k sims) reduz variância. (O "18% a mais de acurácia" NÃO foi verificado — descarte.)
- **Poisson bivariada [contestado]** — a premissa de correlação POSITIVA entre placares é contrariada pelos dados (correlação empírica ~−0,16). Literatura recente recomenda covariância ZERO. Ganho líquido sobre Dixon-Coles é duvidoso.
- **"Modelos batem o mercado" [parcial]** — Wilkens (Bundesliga) deu ROI ~10–15%, MAS lucro vem quase só de mandantes mal precificados (não de O/U), desaba pra ~1% sem calibração isotônica (overfit), e o mercado mantém calibração superior por categoria. Edge estreito, frágil, não generalizável.

---

## 4. Mitos a evitar (folclore / contestado)

- **"Derby = under automático" [contestado].** A diferença de gols some depois de controlar a qualidade dos times — é qualidade disfarçada. E há derbies goleadores (North London ~2,9; East Lancashire/Essex 3,33; Black Country 3,08). **Correção:** use só o delta within-team (cada time vs sua própria média) + H2H histórico do par específico.
- **"Chuva forte = under" [contestado].** Melhor estudo (7.528 jogos PL+Championship) acha efeito NULO (+0,16%/mm, p=0,856), e o ponto estimado aponta pra MAIS gols. Meses chuvosos (out) marcam mais que secos (fev). **Correção:** neutro, salvo empoçamento real + favorito de posse curta.
- **"Árbitro rigoroso / muitos cartões = under" [folclore].** Correlação cartões→total de gols é ~zero. Pior: expulsão costuma AUMENTAR o total. **Correção:** trate vermelho separado (cauda de over), não some com "jogo picotado".
- **"Frio = under" [parcial/confundido].** Frio puro é quase folclore — a queda out→fev é creditada ao PISO (seco marca menos), não à temperatura. Só **neve pesada** tem efeito real.
- **"Muito escanteio = gol vindo" [folclore].** Conversão ~2–3%, ~57% terminam em perda imediata de posse. Volume bruto é preditor fraco.
- **"Contra-ataque vale 2× o xG" [exagerado].** Real é ~1,3–1,5× (0,17 vs 0,12). Conversão de fast-break ~10,7%, não 2×.
- **"Acréscimo recorde = mais gols totais" [parcial/contrário].** 2025/26 tem recorde de acréscimo E gols tardios MAS é 2ª temporada de menor scoring da PL. Redistribui, não levanta o total.
- **"Bivariada com covariância positiva melhora o modelo" [contestado].** Correlação real entre placares é ~negativa; use covariância zero.
- **"Modelo de xG bate o mercado" [exagerado].** Bet365 (Brier 57,2) bate todos os modelos de xG (melhor 58,6); todas as estratégias de aposta do backtest deram prejuízo. O "40% melhor" era vs baseline ingênuo, não vs a casa.
- **"Game state pré-jogo prevê over" [contestado].** Loss aversion corta dos dois lados (perseguidor sobe, líder fecha); net ≈ neutro e é fenômeno in-play.
- **"Diferença de descanso move o over" [parcial].** Move 1X2/handicap, não o total.

---

## 5. Como combinar os sinais (sem dupla contagem)

**Princípio nº 1: o mercado já precifica quase tudo isso.** A linha O/U de fechamento é o baseline mais forte que você tem. Seu trabalho não é estimar o total do zero — é detectar onde o mercado **ainda não** incorporou um sinal (escalação que acabou de sair, mismatch de set-piece, goleiro reserva confirmado). Edge residual existe (viés pró-over, overreaction de linha), mas é estreito.

**Princípio nº 2: muitos sinais são REDUNDANTES com o xG combinado — não some duas vezes.**
- xG/chute, big chances, xGOT, ritmo/pace, diretividade → **já estão embutidos no xG combinado**. Não os adicione por cima; use-os no máximo como diagnóstico de QUALIDADE do xG (volume alto + xG baixo = inflação).
- Estilo tático (PPDA, linha alta, bloco) → **em grande parte capturado pelo xG/xGA medido**. O valor incremental é só a INTERAÇÃO de matchup (press+press, bloco+bloco) e o caveat de que rótulo ≠ xGA medido.
- "Fim de temporada" → não é sinal próprio; é stakes + fadiga + rotação.

**Princípio nº 3: sinais INDEPENDENTES (ajustes legítimos sobre o λ base):**
- Desfalques (o xG bruto não vê o finalizador nem o goleiro) — **o maior valor incremental**.
- Bola parada (canal separado do open-play).
- Pênalti esperado (árbitro + perfil dos times).
- Clima extremo real (vento forte, neve pesada).
- Stakes/contexto (jogo morto, vermelho).

### Scorecard mental (ordem de aplicação)

```
λ_total = [xG combinado projetado]              ← base (média móvel xG/xGA, ajustado por mando)
        + bloco de bola parada (separado)        ← escanteios×0,03 + pênaltis×0,76 + faltas
        ± Δ desfalques ofensivos (team-total ↓)  ← SÓ se share alto E sem depth equivalente
        ± Δ desfalques defensivos (gols sof. ↑)  ← goleiro reserva, CB-chave (validar substituto!)
        ± estilo de MATCHUP (não estilo isolado)  ← press+press ↑ / bloco+bloco ↓
        ± contexto (jogo morto ↑ / mata-mata mútuo ↓ / vermelho provável ↑)
        ± clima extremo real (vento/neve ↓; calor = NÃO ajustar total, só estilo)

→ comparar λ_total com a LINHA do mercado
→ apostar só se |gap| > limiar (3–5%) E o gap não for algo que o mercado já viu
→ medir sucesso por CLV, não por win-rate
```

Cada ajuste deve ser **pequeno** (centésimos a poucos décimos de gol). Se você está somando +0,5 de três fontes diferentes, provavelmente está dupla-contando ou caindo em folclore.

---

## 6. Checklist de pré-jogo

1. **Pegue a linha O/U de fechamento** (Pinnacle se possível) e inverta pro total esperado do mercado. Esse é seu prior. Anote.
2. **Calcule o λ base você mesmo:** média móvel (5–15 jogos) de xG marcado de cada time × xGA do adversário, **separado casa/fora**. Some os dois lados.
3. **Cheque G−xG dos últimos ~10 jogos** de cada time. Se algum vem muito acima/abaixo do xG, **ancore no xG** (desconte a sorte) — não na pontuação recente.
4. **Escalação (a hora da verdade — saiu ~1h antes):**
   - Goleiro titular? Se reserva, qual o goals prevented/90 dele? (downgrade elite→reserva fraco = +0,2 a +0,4)
   - Artilheiro/criador fora? Calcule o goal involvement share + **olhe quem é o substituto** (gols/90, xA/90). Sem depth e share alto → team-total under. Com reserva de nível → zere o ajuste.
   - CB-chave fora? +10–20% xGA, mas só se a dupla substituta não tem entrosamento.
5. **Bola parada:** os times são set-piece-heavy? Há mismatch (ataque forte de escanteio × defesa vazada)? Adicione como bloco separado (com shrinkage).
6. **Árbitro:** taxa de pênaltis/jogo vs média da liga (com shrinkage forte). Ignore cartões como sinal de total.
7. **Matchup de estilo:** classifique cada time (press↔bloco, direto↔posse). Press+press ou linha-alta+rápido → leve over. Bloco+bloco ou posse-estéril+bloco → leve under. **Use xGA medido, não a fama.**
8. **Calendário/fadiga:** algum lado jogou CL meio de semana com turnaround ≤3 dias e alta minutagem? → leve team-total under DESSE lado (não da partida). Ignore se ≥4 dias, EL, ou jogo rodado.
9. **Clima:** só ajuste se vento forte (>24–32 km/h, estádio exposto) ou neve pesada. Calor → ajuste o estilo esperado, NÃO o total.
10. **Contexto/stakes:** ambos sem objetivo (jogo morto) → leve over. Decisão mútua/ida de mata-mata → leve under. Probabilidade alta de vermelho → cauda de over.
11. **Compare seu λ_total ajustado com a linha.** Só registre tip se o gap > 3–5% E ele vier de um sinal INDEPENDENTE que o mercado plausivelmente ainda não viu. Se o gap vem de algo óbvio (pace, mando, favoritismo) → o mercado já precificou, passe.
12. **Acompanhe o CLV** (sua odd vs fechamento) como métrica de acerto do processo, não o resultado de um jogo isolado.

---

## Apendice — Fontes consultadas (pesquisa multi-agente)

- http://large.stanford.edu/courses/2016/ph241/goldberg1/docs/williams.pdf
- http://www2.stat-athens.aueb.gr/~jbn/papers2/08_Karlis_Ntzoufras_2003_RSSD.pdf
- https://7bet.co.uk/blog/what-is-a-dead-rubber-match-and-how-does-it-impact-football-odds/
- https://antonruanova.com/set-piece-analysis-effectiveness-player-roles-offensive-scoring-statistics
- https://arxiv.org/pdf/2401.09940
- https://arxiv.org/pdf/2512.00203
- https://beatthebookie.blog/2021/06/07/the-predictive-power-of-xg/
- https://bet.me/howtocreateabasicfootballmodel.html
- https://bettinggods.com/football/does-weather-affect-the-number-of-goals-scored-in-football/
- https://blogarchive.statsbomb.com/articles/soccer/game-states-and-loss-aversion/
- https://blogarchive.statsbomb.com/articles/soccer/on-the-anatomy-of-a-counter-attack/
- https://breakingthelines.com/opinion/high-lines-vs-low-blocks-which-wins-more-often/
- https://cnwltalkingtherapies.org.uk/derby-day-betting-why-rivalries-create-unique-opportunities/
- https://dashee87.github.io/football/python/predicting-football-results-with-statistical-modelling-dixon-coles-and-time-weighting/
- https://en.wikipedia.org/wiki/Disgrace_of_Gij%C3%B3n
- https://en.wikipedia.org/wiki/Expected_goals
- https://en.wikipedia.org/wiki/Home_advantage
- https://fbref.com/en/expected-goals-model-explained/
- https://fivethirtyeight.com/features/how-our-club-soccer-projections-work/
- https://fivethirtyeight.com/features/injuries-hounded-liverpool-last-season-how-good-can-it-be-at-full-strength/
- https://fivethirtyeight.com/features/youre-not-imagining-things-theres-way-more-stoppage-time-at-this-world-cup/
- https://footiehound.com/the-role-of-weather-and-pitch-conditions-in-match-outcomes/
- https://footnotefc.com/en/guide/high-press-vs-low-block
- https://grokipedia.com/page/DixonColes_model
- https://hns.family/files/documents/19065/UEFA%20Pitch%20Quality%20Guidelines%202018%20EN.pdf
- https://jobsinfootball.com/blog/what-is-the-xg-of-a-penalty/
- https://joesaumarez.co.uk/sports-betting-market-efficiency-and-the-closing-line
- https://journals.sagepub.com/doi/10.1177/22150218261416681
- https://kiqiq.com/football/ppda-explained
- https://learn.weatherstem.com/modules/learn/lessons/86/14.html
- https://learning.coachesvoice.com/cv/low-block-football-tactics-explained-simeone-dyche-mourinho/
- https://link.springer.com/article/10.1007/s40279-022-01799-5
- https://link.springer.com/article/10.1186/s40798-026-01008-x
- https://mackayanalytics.nl/2017/06/19/how-accurate-are-xg-models-ii-the-big-chance-dilemma/
- https://mathematicallysafe.wordpress.com/2016/01/16/take-the-long-road-the-effects-of-distance-travelled-on-results/
- https://mydeepmetrics.com/statistics/possession-statistics-football
- https://oddstake.com/article/how-injuries-affect-betting-odds-in-the-premier-league-and-uefa-matches/
- https://opisthokonta.net/?p=1066
- https://opisthokonta.net/?p=1760
- https://opisthokonta.net/?p=1835
- https://planetefootball.com/guides/ppda-football-explained
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10075453/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10850290/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11474995/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11829705/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11947059/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12567690/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC12872852/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13044101/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7739226/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8081822/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9758680/
- https://rivals.football/stats
- https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/1467-9884.00366
- https://soccermatics.readthedocs.io/en/latest/lesson2/MoreonxG.html
- https://statathlon.com/derby-games-and-their-importance-to-the-seasonal-performance-of-a-football-club/
- https://statathlon.com/travel-stress-in-european-competitions/
- https://statpair.com/blog/offsides-betting-positional-statistics-value
- https://statpair.com/blog/tactical-matchup-analysis-team-styles
- https://statsultra.com/when-are-most-goals-scored-football/
- https://the-footballanalyst.com/game-state-and-stats-how-the-scoreline-skews-the-numbers/
- https://the18.com/en/soccer-news/most-intimidating-soccer-stadium-world/5421
- https://theanalyst.com/2021/07/what-are-expected-goals-xg/
- https://theanalyst.com/articles/arsenal-tottenham-corners-record-premier-league-title-race-relegation-battle
- https://theanalyst.com/articles/game-state-how-premier-league-teams-play-expected-goals
- https://theanalyst.com/articles/premier-league-90th-minute-winners-late-goals-stats
- https://theanalyst.com/articles/premier-league-counter-attacks-verticality-transitions-guardiola-iraola
- https://theanalyst.com/articles/premier-league-goalkeeper-stats-2024-25
- https://thexgfootballclub.substack.com/p/quantifying-the-intensity-of-high-press-tactics-in-football-with-ppda-37d1ee09f768
- https://tips.gg/article/most-cards-per-referee-in-the-epl-25-26-season/
- https://totalfootballanalysis.com/data-analysis/premier-league-2025-2026-relegation-battle-data-analysis
- https://tribuna.com/en/blogs/have-set-pieces-completely-conquered-premier-league-and-is-t/
- https://www.arsenal.com/news/5-obscure-stats-about-north-london-derby-history
- https://www.besoccer.com/new/corner-kicks-stats-and-success-rate-guide-1287492
- https://www.betsfortoday.com/guides/poisson-distribution/
- https://www.btb-analytics.com/education/rest
- https://www.espn.com/soccer/story/_/id/37628835/how-var-changed-premier-league-penalties-offside-handball
- https://www.expectinggoals.com/p/what-happens-when-teams-have-nothing
- https://www.footballstudyhall.com/2018/6/25/17500384/football-betting-windy-conditions-effect
- https://www.footymetrics.com/blog/xg-explained-for-betting
- https://www.freebetoffers.org.uk/articles/how-does-distance-travelled-affect-team-performance/
- https://www.freesupertips.com/news/dropping-points-european-games-fact-myth/
- https://www.frontiersin.org/journals/behavioral-economics/articles/10.3389/frbhe.2024.1479832/full
- https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.1069082/full
- https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2025.1697146/full
- https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1348983/full
- https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1713852/full
- https://www.goal.com/en-gb/betting/european-hangover-weekend-picks/blt8043f079a752ab85
- https://www.goal.com/en-us/betting/world-cup/world-cup-matchday-three-betting/A%3Abltd228bcbd8de117b7
- https://www.hud.ac.uk/news/2020/november/football-fixture-congestion-new-study/
- https://www.hudl.com/blog/defensive-metrics-measuring-the-intensity-of-a-high-press
- https://www.hudl.com/blog/expected-goals-xg-explained
- https://www.isspf.com/articles/the-impact-of-fixture-congestion-on-elite-soccer-players/
- https://www.iza.org/publications/dp/7519
- https://www.jsr.org/index.php/path/article/download/1116/906/6318
- https://www.mdpi.com/2076-3417/14/22/10390
- https://www.mdpi.com/2306-5729/9/9/102
- https://www.messivsronaldo.app/articles/how-do-bookmakers-adjust-odds-when-messi-ronaldo-injured/
- https://www.myfootballfacts.com/premier-league/all-time-premier-league/all-time-premier-penalties-awarded-by-seasons/
- https://www.nature.com/articles/s41598-021-00784-8
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11874785/
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9821415/
- https://www.oddalerts.com/referees
- https://www.olbg.com/blogs/does-weather-affect-the-amount-goals-scored-football-match
- https://www.pinnacle.com/betting-resources/en/soccer/how-to-bet-on-cards-a-guide-to-betting-on-cards-in-soccer/ety2nhdtzvqgha2l
- https://www.pinnacle.com/betting-resources/en/soccer/understanding-the-limitations-of-expected-goals/k4gjclwx3vs6mwvk
- https://www.pinnacle.com/en/betting-articles/betting-strategy/how-to-bet-on-over-under-goals
- https://www.planetfootball.com/premier-league/premier-league-table-2025-26-without-erling-haaland-goals
- https://www.predictology.co/blog/are-scorelines-dead-why-xg-regression-is-the-key-to-spotting-overrated-teams/
- https://www.premierleague.com/en/news/3788455
- https://www.premierleague.com/en/news/4025806
- https://www.premierleague.com/en/news/4029218
- https://www.premierleague.com/en/news/4293708
- https://www.premierleague.com/en/news/4437338/opta-analysis-of-why-more-late-goals-are-being-scored-in-2025-26-premier-league-season
- https://www.racingpost.com/sport/opinion/kevin-pullein/some-football-forecasts-should-wait-until-you-have-studied-the-weather-forecast-adLki6x40nuK/
- https://www.redalyc.org/journal/5723/572366594004/html/
- https://www.researchgate.net/publication/227358040_Market_Efficiency_and_a_Profitable_Betting_Rule_Evidence_From_Totals_on_Professional_Football
- https://www.researchgate.net/publication/254127905_Altitude_or_Hot_Air
- https://www.researchgate.net/publication/272416570_The_association_of_environmental_heat_stress_with_performance_Analysis_of_the_2014_FIFA_World_Cup_Brazil
- https://www.researchgate.net/publication/395557638_The_negative_impact_of_squad_rotation_on_football_match_outcomes_Mediating_roles_of_passing_and_shooting_performance
- https://www.researchgate.net/publication/400097551_Association_Between_Expected_Goals_xG_and_Goal_Scoring_Across_Club_and_National_Team_Competitions_in_Elite_Football
- https://www.sciencedirect.com/science/article/pii/S2773161825000072
- https://www.sciencepublishinggroup.com/article/10.11648/j.ajss.20160405.12
- https://www.scoresandstats.com/expert-betting-guide/winning-margin-meaning/
- https://www.sharpfootballanalysis.com/sportsbook/clv-betting/
- https://www.sharpfootballanalysis.com/sportsbook/weather-impact-on-nfl-betting/
- https://www.soccermetrics.net/team-performance/an-alternative-formulation-of-tempo-in-football
- https://www.soccermetrics.net/team-performance/football-tempo-discussion
- https://www.sofascore.com/news/a-statistical-breakdown-of-shots-shots-on-target-and-big-chances
- https://www.sportbotai.com/blog/home-advantage-statistics-by-football-league-2026
- https://www.sportbotai.com/blog/injury-impact-on-soccer-match-predictions-quantified
- https://www.sportmonks.com/glossary/big-chance-conversion-rate/
- https://www.sportmonks.com/glossary/big-chances/
- https://www.spreadex.com/sports/blog/features/var-impact-europe-big-5-premier-league/
- https://www.squawka.com/en/features/premier-league-referees-ranked-leniency/
- https://www.statmuse.com/fc/ask/man-city-with-and-without-haaland
- https://www.statsandsnakeoil.com/2018/06/22/dixon-coles-and-xg-together-at-last/
- https://www.statsperform.com/resource/enhancing-expected-goals-on-target/
- https://www.statsperform.com/resource/expected-goals-xg-the-football-metric-changing-analysis-betting-and-fan-engagement/
- https://www.sundaysurefire.com/blog/-do-snow-games-really-lower-scoring-the-truth-about-cold-weather-football/
- https://www.tandfonline.com/doi/full/10.1080/24748668.2025.2567757
- https://www.thefreelibrary.com/Translating+odds+into+supremacy.-a060164652
- https://www.thepunterspage.com/poisson-distribution-betting/
- https://www.thestatbible.com/stats/over-2-5-goals
- https://www.whoscored.com/regions/252/tournaments/2/seasons/10743/stages/24533/refereestatistics/england-premier-league-2025-2026
