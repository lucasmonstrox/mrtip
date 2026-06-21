---
mercado: penalti-expulsao-eventos
titulo: Penalti, Expulsao e Eventos
---

# Penalti, Expulsao e Eventos

> Dossiê neutro e global (sem viés de liga específica). Cobre **penalti no jogo** (sim/não), **score/miss a penalty**, **expulsão/cartão vermelho**, **gol contra**, **método de gol** (cabeça/falta/penalti/chute/contra), **substituições** e **disputa de pênaltis** (mata-mata). Foco em frequências de base, regras de liquidação, formação de odd, valor (EV+), e — coração do documento — **correlações com as características do jogo**, mais uma camada **live** dedicada.

---

## 0. Sumário de frequências de base (a régua mental)

Antes de qualquer aposta, fixe as taxas-base. São elas que dizem se uma odd é cara ou barata. Trate todo número aqui como **faixa**, não constante: a base oscila forte por liga e por temporada.

| Evento | Frequência de base (média global elite) | Tradução prática |
|---|---|---|
| **Penalti marcado no jogo** | ~0,25–0,30 por jogo | ~22–27% dos jogos têm ≥1 penalti |
| Médias por jogo verificáveis | PL 23/24 ~0,28–0,29; MLS ~0,31–0,32; La Liga 20/21 ~0,39 | todas consistentes com a faixa 0,25–0,30 |
| **Conversão de penalti** | ~75–82% média histórica; pico de **89,7% (PL 23/24)** pós-regra do goleiro na linha + VAR | penalti ≈ "gol grátis" moderno |
| **Cartão vermelho no jogo** | ~0,08–0,13 por jogo (PL); evento raro, cauda longa | oscila muito: 22/23 caiu a ~0,08; teto recente ~0,13 |
| **Gol contra** | ~8,9% dos gols/temporada (média 5 temporadas); ~1 a cada ~11–12 jogos | mercado quase "loteria"; ~71,6% dos OGs são de zagueiros |
| **Gol de cabeça** | **~15–17% na média recente** (PL 24/25 = 15,6%), podendo chegar a 19–21% em temporadas de pico ou mata-mata | método volátil; não superestimar a base |
| **Gol de falta direta** | ~3,6–6,8% de conversão (PL últimas 6 temporadas); só ~3–5% dos gols | em forte declínio histórico |
| **Gol de penalti como método** | taxa de penalti × conversão (~0,20–0,25 gol de pênalti/jogo) | derivado de 4.1 |

> Fontes para a tabela: Opta/The Analyst, Premier League (season trends), Spreadex, ScoreRoom, PlayToday, ThePuntersPage, BettingWebsites UK (ver seção Fontes).
>
> **Ressalva sobre a distribuição "73,46% / 22,45% / 3,74% / 0,34%"** (jogos com 0/1/2/3 penaltis): esse quarteto circula em snippets, mas **não foi confirmado em fonte primária** (sem liga/temporada/universo rastreável). Trate-o como **estimativa de uma amostra não identificada**, não como "a referência mais citada". O que é verificável são as **médias por jogo** acima.

---

## 1. Definição e regras de liquidação

As regras variam por casa (bet365, Betfair, Paddy Power, William Hill, DraftKings, Matchbook), mas o núcleo é convergente. Sempre que houver dúvida de borda, **a fonte de dados oficial (geralmente Opta) decide**.

### 1.1 Penalti no jogo (Sim/Não)

- **O que conta:** o árbitro **apontar para a marca do pênalti durante o tempo normal (90' + acréscimos)**. Não importa qual time, nem se o pênalti é convertido, defendido, isolado ou na trave. Se o juiz marcou pênalti, "Sim" ganha.
- **O que NÃO conta:**
  - **Disputa de pênaltis (shootout) pós-prorrogação** — não conta para "penalti no jogo". É um **mercado separado** (ver 1.7).
  - **Pênalti na prorrogação** — em geral não conta (mercados são "regulation/90 minutes" por padrão; confira a casa).
  - **Pênalti cancelado/anulado pelo VAR** antes da cobrança — ignorado, como se não tivesse existido.
- **Casos de borda:**
  - **"Foul penalty"** (cobrança irregular, invasão, dois toques): para mercados de *score/miss*, a casa normalmente **ignora** a cobrança viciada. Para "penalti no jogo Sim/Não", o pênalti já foi concedido → "Sim".
  - **Pênalti repetido** (invasão do goleiro/atacante): conta como **um** evento de pênalti concedido.
  - **Jogo abandonado:** se o pênalti já ocorreu, "Sim" já está liquidado e mantém-se; se não ocorreu e o jogo é abandonado, **void** (salvo se o resultado do mercado já estiver determinado). Padrão de mercado: jogo não retomado em 48h → todas as apostas void exceto as já decididas.

### 1.2 Score/Miss a Penalty (marcar/perder pênalti)

- **Marcar:** o pênalti resulta em gol **direto** (gol creditado ao cobrador).
- **Perder:** defesa do goleiro, trave/bola fora, ou isolada.
- **Regra de rebote / retomada (fonte comum de disputa — verificado em Matchbook/DraftKings/STN):**
  - **Rebote convertido** (do poste OU do goleiro) **= MISS**, não "pênalti marcado" — é gol de jogada normal.
  - **Pênalti mandado a repetir (retaken)** = a **cobrança original é IGNORADA**; vale só a final.
  - **Pênalti rescindido/cancelado** antes da cobrança = liquida como **perdido/ignorado** conforme a casa (em "to score a penalty", normalmente perde).
- Formalize a regra mental: **"retaken = original ignorado; rebote = miss"**.

### 1.3 Cartão vermelho / Expulsão (Law 12, The FA)

- **Red Card Shown — Yes/No:** liquida "Sim" se **qualquer jogador em campo** receber vermelho (direto ou 2º amarelo) no tempo regulamentar.
- **Player to be Sent Off:** jogador nomeado recebe vermelho. Segundo amarelo conta. Se o jogador não entrar em campo (banco), em geral **void** (vira não-participante).
- **Booking points (pontos de cartão):** padrão de mercado **amarelo = 10, vermelho = 25**; um 2º amarelo que vira vermelho costuma somar **35 = 10+25**, máximo **35 por jogador**.
  - **ATENÇÃO operacional — não é universal.** O sistema **10/25/35** é de **Paddy Power / Betfair / Ladbrokes** e similares. A **bet365** (citada como referência neste dossiê) **NÃO usa booking points**: ela opera por **CONTAGEM DE CARTÕES**, onde **um vermelho = 2 cartões**. Confirme sempre o esquema da casa antes de montar bet builder de cartões. (Fonte: help.bet365.com card-markets; thepunterspage.com.)
- **O que NÃO conta:** cartões a **técnicos, comissão técnica, reservas no banco e jogadores já substituídos** — não entram nos totais de cartões/booking points nem em bet builders na maioria das casas UK.

### 1.4 Gol contra (Own Goal — Yes/No)

- **Yes** se a fonte oficial (Opta) **declarar o gol como gol contra**.
- Impacto cruzado nos outros mercados:
  - **Resultado/placar/Over-Under:** o OG **conta** normalmente no placar (1-0 por OG é vitória 1-0; total de gols inclui o OG).
  - **Artilheiro (1º/qualquer):** OG **não** conta para nenhum jogador atacante. Se o 1º gol for OG, mercados de "primeiro a marcar" liquidam pelo **próximo gol regular** ou pela regra "no goalscorer"/own goal da casa.
  - **Método do 1º gol:** "Own goal" é uma categoria própria.

### 1.5 Método de gol (cabeça / falta / penalti / chute / gol contra)

Classificação típica (Opta), aplicada ao **primeiro gol** ou a "como o time marca":

| Categoria | Regra |
|---|---|
| **Cabeça (Header)** | Último toque do autor é com a cabeça. Inclui gol direto de escanteio cabeceado. |
| **Penalti** | Gol direto da cobrança de pênalti, com o cobrador nomeado como autor. |
| **Falta (Free kick)** | Gol direto de cobrança de falta (algumas casas agregam dentro de "Shot"/"Outro"; confira). |
| **Chute (Shot)** | Todos os demais gols de jogada não incluídos acima. |
| **Gol contra (Own goal)** | Gol declarado como contra. |

> Detalhe de borda comum: em "primeiro método", cobranças que **entram após desvio** podem mudar a classificação; a fonte oficial decide o **último toque**.

### 1.6 Substituições

- **Over/Under de substituições:** conta substituições **efetivamente usadas** por ambos os times no tempo normal (inclui acréscimos, **exclui prorrogação e pênaltis**). Regra atual padrão: **até 5 substituições** no tempo regulamentar (em até 3 paradas + intervalo), o que elevou as linhas.
- **6ª substituição na prorrogação:** há **1 janela extra** permitida na prorrogação (a "6ª substituição"). Mercados de sub liquidam **só pelo tempo normal**, então essa 6ª troca **não conta** para os totais.
- **Primeira/última substituição:** se ambos os times substituem **simultaneamente** e essa é a 1ª/última, a aposta normalmente é **void**.
- **Abandono:** void salvo resultado já determinado.

### 1.7 Disputa de pênaltis ("Jogo vai aos pênaltis" / Penalty Shootout)

- **Mercado próprio, só de mata-mata** (copas, playoffs). **NÃO conta** para "penalti no jogo" nem para método de gol.
- Variantes: "jogo vai à disputa de pênaltis (Sim/Não)", "vencedor incluindo pênaltis", "placar exato da disputa", "primeiro a errar".
- Drivers (ver 4.6): **equilíbrio de forças** entre os times e **jogos truncados de mata-mata** (poucas chances no tempo normal/prorrogação) **aumentam** a chance de ir aos pênaltis; mismatch forte e jogos abertos a reduzem.

---

## 2. Como a odd e a margem se formam

### 2.1 Mecânica básica

A casa converte cada resultado em probabilidade implícita, soma tudo (passa de 100%) e o excedente é o **overround/juice/margem**. Exemplo (penalti Sim/Não):

- Probabilidade "justa": Sim 25% / Não 75%. Odds justas: Sim 4,00 / Não 1,333.
- Com 7% de margem: Sim ~3,60 / Não ~1,28 → soma das implícitas ≈ 107%.

### 2.2 Margens típicas por nível de mercado

| Mercado | Margem típica |
|---|---|
| Resultado 1X2 (top operadores) | 4–8% |
| **Derivados/props (penalti, OG, método de gol, vermelho)** | **8–15%+** (menos líquido, pricing mais difícil) |
| Bet builder / SGM (margem composta) | 20–30% efetiva em 4 pernas |

**Por que props são mais caros:** menos volume equilibra menos a casa, eventos de cauda são difíceis de modelar, e a competição entre casas é menor. Em props raros (OG Sim, vermelho Sim), a margem costuma estar **embutida no lado "Sim"** (longshot bias: o público adora o tiro longo, a casa encurta a odd do Sim).

### 2.3 Como a linha se move

- **Notícias de escalação** (cobrador de pênalti titular fora, especialista de falta ausente) movem método de gol e score-a-penalty.
- **Designação de árbitro** publicada → mercados de cartão e penalti reagem (árbitro "caseiro"/rigoroso encurta odd de vermelho/cartões).
- **Clima/gramado** e **importância** (decisão, rebaixamento) movem cartões para cima.
- **In-play:** cada falta dura na área, cada VAR check e cada escalada de temperatura reprecifica vermelho/pênalti em segundos.

---

## 3. Tips e ângulos de valor (onde mora o EV+)

1. **Penalti "Sim" em ligas/árbitros com VAR ativo.** O VAR **aumentou** penaltis concedidos (handballs flagrados na revisão). Cruze: liga com VAR + árbitro de média alta + time que cruza muito na área + atacantes que "ganham" faltas. (Quantificação por liga em 4.1.)
2. **Método de gol — cabeça, com a base CALIBRADA.** Não use "18–20% como média": a base recente é **~15–17%** (PL 24/25 = 15,6%; recorde anterior 19,3% em 2010/11; pico atípico 21,3% em 25/26). O ângulo de valor segue válido em jogos com **muitos escanteios/cruzamentos** e times **fortes no alto** (zagueiros altos, pivôs, especialistas de bola parada) e em **mata-mata** (sobe para 19–21%+), onde o mercado às vezes precifica abaixo. Mas não trate cabeça como estruturalmente barata em **toda** janela — é volátil.
3. **Pênalti como "gol grátis".** Conversão moderna até **89,7% (PL 23/24)** — só 8 de 107 defendidos (7,5%, recorde de menor proporção defendida); recorde anterior 83,9% (2013/14); 22/23 foi 74,8%. Em **score-a-penalty** e bet builders, modele conversão alta; o público ainda lembra das épocas de 75%.
4. **Vermelho "Sim" via árbitro + contexto + timing.** Em derbies, decisões e jogos de alto atrito com árbitro permissivo (que deixa o jogo "ferver"), a odd de "vermelho Sim" às vezes está longa demais. O valor real costuma aparecer **ao vivo**, com a temperatura subindo — e expulsões **se concentram a partir do ~min 65** e na reta final (ver camada live).
5. **Evite OG Sim como aposta sistemática.** ~8,9%/temporada e **aleatório demais** para previsão — é loteria (~71,6% dos OGs são de zagueiros, sem sinal preditivo útil). Só faz sentido como perna oportunista de bet builder com odd inflada.
6. **Falta direta: fade os especialistas no hype.** Conversão real ~3,6–6,8% (PL). Mercados de "gol de falta" costumam estar **caros** quando há um nome famoso; a produção de gols de falta nas top-5 **despencou ~53,6%** (~33,2/temporada nas 3 primeiras de 08/09–10/11 → ~15,4/temporada nas 3 recentes, por média móvel de 3 temporadas, Opta). La Liga 23/24 teve apenas **2,4%** de conversão (pior já registrado).

---

## 4. Correlações com o jogo (o coração do dossiê)

A regra de ouro: **cada submercado é puxado por uma característica diferente do jogo.** Não confunda "jogo de gols" com "jogo de pênalti" ou "jogo de cartão".

### 4.1 Penalti — o que puxa para CIMA

| Característica do jogo | Direção | Por quê |
|---|---|---|
| **VAR ativo na competição** | ↑↑ | handballs e faltas na área que passariam batido são flagrados |
| **Time que cruza/infiltra muito na área** | ↑ | mais bolas na área = mais contato/handball = mais pênalti |
| **Defesa que defende baixa e aglomerada** | ↑ | muitos corpos na área, mais handball/agarrão |
| **Atacantes que "provocam" contato/diving** | ↑ | ganham faltas no limite |
| **Goleiro impulsivo/aventureiro** | ↑ | sai mal e derruba |
| **Árbitro de gatilho fácil para a marca** | ↑ | viés individual real (ver perfil do árbitro) |
| **Liga de alta taxa** | ↑/↓ | base estrutural varia muito por liga |
| **Jogo truncado, poucas entradas na área** | ↓ | menos exposição ao evento |

> **VAR e penaltis — duas métricas distintas (mesma fonte, Spreadex), não confunda:**
> - (a) **+32,7%** mais pênaltis **concedidos** na La Liga pós-VAR.
> - (b) Pênaltis como **% do total de gols** subindo de **7,64% → 11,57% (+51,5%)** na La Liga.
> - Conversão de pênalti **+9,3%** na La Liga pós-VAR (a maior das top-5).
> - **Big-5 agregado:** **+12,0%** de pênaltis cobrados e **+3,7%** de conversão pós-VAR.
> Médias-âncora: PL 23/24 ~0,28–0,29 pênalti/jogo; MLS ~0,31–0,32; La Liga 20/21 ~0,39.

### 4.2 Cartão vermelho — o que puxa para CIMA

| Característica | Direção | Por quê |
|---|---|---|
| **Derby/rivalidade** | ↑↑ | mais atrito, juiz mais propenso a punir |
| **Decisão / fim de temporada / rebaixamento** | ↑ | tensão e faltas táticas |
| **Árbitro rigoroso / permissivo demais** | ↑/depende | rigoroso pune cedo; permissivo deixa ferver até explodir |
| **Times de pressão alta e faltas táticas anti-contra-ataque** | ↑ | acúmulo de amarelos → 2º amarelo |
| **Placar apertado nos minutos finais** | ↑ | vermelhos se concentram ~min 65→90; margem de erro some |
| **Time perdendo e pressionando com afobação** | ↑ | entradas atrasadas, frustração (gatilho live clássico) |
| **Liga "quente" culturalmente** (Bolívia ~8 cartões/jogo; ~98% > 4 cartões) | ↑↑ | base estrutural altíssima |
| **Clima quente/gramado ruim** | ↑ | jogo mais físico e nervoso |

> **Ressalva de base (PL):** ~0,13 vermelho/jogo é o **teto** da faixa recente, não constante. As 4 temporadas até ~21/22 médiaram ~45,5 vermelhos/temporada (≈0,12/jogo), mas **22/23 caiu para 30** (recorde de menor número, ≈0,08/jogo). A base **oscila bastante** — recalibre por temporada/liga.
>
> **Timing:** no recorte de Copa, expulsões se concentram a partir do **~min 65** e na reta final. Distribuição de gols (e de tensão) também pende para o 2º tempo.

### 4.3 Método de gol — o que puxa cada método

- **Cabeça ↑:** muitos escanteios/cruzamentos, times altos, especialistas de bola parada, **mata-mata** (sobe para 19–21%+). A maior parte dos gols de cabeça de jogo aberto vem de **cruzamento**. **Base recente ~15–17%** — não superprojetar.
- **Falta direta ↑:** presença de especialista real, faltas perto da área, árbitro que marca muitas faltas em zonas perigosas. Mas a base é baixa e **caindo** (~3,6–6,8% de conversão).
- **Penalti (como método) ↑:** ver 4.1 — é a taxa de pênalti × conversão.
- **Chute de jogada aberta:** domina o resto; favorecido por jogos de transição rápida e posse no terço final.

### 4.4 Gol contra — quase sem sinal

OG é **predominantemente aleatório**. ~8,9% dos gols/temporada são OG (média 5 temporadas), ~1 a cada ~11–12 jogos, e **~71,6% vêm de zagueiros** — confirmando que não há sinal preditivo de jogador útil. Único viés fraco: **muitos cruzamentos rasteiros/perigosos na área + defesa pressionada** elevam marginalmente. Não construa tese pesada em cima disso.

### 4.5 Substituições

- **↑:** jogo aberto e disputado (técnicos mexem para buscar/segurar), clima quente, calendário apertado (rodízio), prorrogação possível.
- **↓:** jogo controlado, lesões cedo que "queimam" janelas, times que poupam trocas.

### 4.6 Disputa de pênaltis (ir aos pênaltis)

- **↑:** **equilíbrio de forças** entre os dois times, jogos **truncados de mata-mata** (defesas fechadas, poucas chances claras), torneio de ida e volta empatado no agregado, prorrogação sem gols.
- **↓:** mismatch claro de qualidade, jogo aberto com muito xG, time que precisa atacar (perde no agregado) gerando gols antes do fim.

---

## 5. Indicadores preditivos e como lê-los

| Mercado | Indicadores-chave | Como ler |
|---|---|---|
| **Penalti** | Pênaltis a favor/contra por time (histórico), toques/cruzamentos na área, % de jogos do time com pênalti, perfil do árbitro, VAR sim/não | Some a tendência **ofensiva** de um time (ganha pênalti) com a **defensiva** do outro (concede). Filtre por árbitro. |
| **Vermelho** | Faltas/90, amarelos/90 por time e por jogador-alvo, média de cartões do árbitro, contexto (derby/decisão) | Jogador específico: faltas + amarelos altos + já amarelado em padrão. Mercado de jogo: árbitro + atrito esperado. |
| **Método (cabeça)** | xG de bola parada, escanteios/jogo, altura média, % gols de cabeça do time, qualidade de cruzamento | Cruze ataque de bola parada de um × fragilidade aérea do outro. Lembre da base ~15–17%. |
| **Falta direta** | Cobranças/jogo, conversão do especialista, faltas sofridas perto da área | Só vale com especialista real + volume. |
| **Substituições** | Média de subs do técnico, ritmo do jogo, calendário | Técnicos "mexedores" vs. conservadores. |
| **Ir aos pênaltis** | Força relativa (Elo/odds 1X2), histórico de jogos travados, contexto de agregado | Equilíbrio + baixo xG esperado → ↑. |

**xG/xGA** ajudam menos diretamente nesses props do que em over/under, mas o **xG de bola parada** é o melhor proxy para método-cabeça, e o **volume de toques na área adversária** é o melhor proxy para pênalti.

---

## 6. Armadilhas comuns (traps)

1. **Longshot bias no "Sim".** O público superaposta penalti Sim, vermelho Sim, OG Sim, gol de falta — a casa encurta esses lados. Muitas vezes o **EV+ está no "Não"**.
2. **Confundir "jogo de gols" com "jogo de pênalti".** Um 3-3 pode ter zero pênalti; um 0-0 pode ter pênalti perdido. Os drivers são diferentes.
3. **Narrativa do especialista de falta.** Nome famoso ≠ probabilidade alta; conversão real ~3,6–6,8% (e caindo).
4. **Superestimar a base de cabeça.** "18–20% como média" é o **teto histórico**, não a média. Use **~15–17%** recente.
5. **Ignorar a fonte de classificação.** "Gol de cabeça" vs "chute" é decisão do Opta; desvios e classificações de borda quebram apostas que pareciam certas.
6. **Esquecer que cartões de banco/técnico não contam** — e que **bet365 usa contagem de cartões (vermelho=2), não booking points 10/25.** Bet builders de cartões quebram por isso.
7. **Superprojetar vermelho em time bom.** Times de elite às vezes defendem heroicamente com 10; "fade" do favorito após vermelho nem sempre funciona. E a base de vermelhos **oscila** (PL 22/23 = recorde de menos).
8. **Tratar VAR como uniforme.** O efeito do VAR sobre pênaltis varia por liga. Não generalize.
9. **OG como "value".** Não é value; é variância pura.
10. **Confundir rebote/retomada na liquidação.** Rebote convertido = miss; retaken = original ignorado.

---

## 7. Correlação entre mercados (bet builder / same game multi)

**Combina (correlação positiva — cuidado, a casa aplica desconto de 5–20%):**
- **Penalti Sim + Over gols / BTTS** — pênalti adiciona gol e abre o jogo.
- **Penalti Sim + artilheiro = cobrador titular** — clássico (penalti → quem bate marca).
- **Time favorito vence + marca 2+ + clean sheet** — coerente.
- **Vermelho Sim + Over cartões/booking points** — atrito alto puxa os dois.
- **Vermelho no time A + time B Over gols (2º tempo)** — após expulsão, gols do time completo sobem **+124%**, do time reduzido caem **−47%**; xG do reduzido cai ~65%, do adversário sobe ~54%.
- **Cabeça (1º gol) + Over escanteios** — ambos vêm de pressão de bola parada.

**Contradiz (correlação negativa — evite na mesma seleção):**
- **Vermelho cedo no favorito + favorito vence por muitos gols** — reduz a chance de goleada do favorito.
- **Under gols + Penalti Sim** — pênalti tende a abrir o placar.
- **Time reduzido a 10 + esse mesmo time marca 2+** — improvável (xG despenca).
- **Jogo controlado/poucas faltas + muitos cartões** — contraditório.

> **Margem composta:** 4 pernas a 5% cada ≈ 20–30% de margem efetiva. SGM correlacionado **parece** generoso, mas a casa já descontou a correlação **e** empilhou margem. Use SGM só com edge claro por perna. Regras de liquidação de bet builder (ex.: Matchbook) reaplicam todas as ressalvas de void/ignore acima por perna.

---

## 8. Fontes de dados para alimentar prognósticos

| Fonte | Para quê | Observação |
|---|---|---|
| **Opta / Stats Perform (The Analyst)** | método de gol, pênaltis, definições oficiais | padrão de liquidação da maioria das casas |
| **Premier League (season trends)** | taxas oficiais de cabeça, falta, vermelho, pênalti | fonte primária para base PL |
| **Understat** | xG, xGA, xG de bola parada | melhor proxy para método-cabeça |
| **FBref** | histórico detalhado, fouls, cartões/90, pênaltis | **perdeu licença Opta em jan/2026** — arquivo histórico útil, dados avançados desatualizados |
| **WhoScored** | ratings, faltas, mapas de calor, cartões | bom para perfil de jogador (faltas/cartões) |
| **ScoreRoom / ThePuntersPage / TheStatsDontLie** | stats de pênaltis, cartões e **perfis de árbitro** por liga | essencial para o filtro de árbitro |
| **Spreadex (blog)** | impacto do VAR sobre pênaltis por liga | quantificação +51,5% / +32,7% La Liga |
| **Transfermarkt** | escalações, lesões, stats de pênalti por liga | confirmação de titularidade do cobrador |
| **Football-Data.co.uk** | CSV histórico para modelagem própria | base de modelos Poisson/regressão |
| **SoccerData (lib Python)** | scraping integrado (FBref, Understat, Sofascore, WhoScored, ClubElo) | para pipelines automatizados |

**Stack recomendada:** Understat (números subjacentes) + ScoreRoom/ThePuntersPage (árbitro e taxas de cartão/pênalti) + Spreadex/Premier League (efeitos VAR e bases oficiais) + Transfermarkt (escalação/cobrador) + Football-Data.co.uk (modelo próprio).

---

## PLUS) Camada Live (ao vivo)

A leitura desses mercados **muda radicalmente in-play** — é onde o value mais aparece, porque a casa reprecifica rápido mas o público reage por emoção.

### Gatilhos e como o mercado se move

| Evento live | Efeito imediato | Leitura/estratégia |
|---|---|---|
| **Gol cedo** | abre o jogo; perdedor pressiona | sobe prob. de pênalti e de cartão (faltas táticas de quem defende a vantagem; afobação de quem persegue) |
| **Vermelho** | reprecificação brutal | gols do time completo +124%, do reduzido −47%; xG do reduzido −65%, do adversário +54%. Lay/back conforme placar e mando |
| **Temperatura subindo** (faltas duras, encarada, VAR check) | odd de **2º vermelho** encurta | entre **antes** do mercado fechar; o valor de vermelho "Sim" é quase sempre **ao vivo** |
| **Time perdendo e pressionando no fim** | ↑ pênalti e ↑ vermelho | entradas atrasadas + frustração; clássico para "vermelho Sim" e "pênalti Sim" tardio |
| **Reta final 65'–90'** | pico de expulsões e gols | janela natural para cartões e Over de cartões |
| **Sub tática anti-jogo** | ↓ ritmo | pode **reduzir** subs futuras e cartões se o jogo "morre" |

### Estratégias live específicas

1. **Antecipar o 2º amarelo:** jogador já amarelado + perdendo + ainda fazendo faltas → back "player sent off"/"vermelho Sim" antes do evento. **Timing**: a janela de maior densidade de expulsões é **a partir do ~min 65** — esperar o jogo esquentar antes de entrar maximiza o edge.
2. **Fade da emoção pós-vermelho:** o público assume colapso do time reduzido; às vezes ele se fecha bem (lay do "Over gols" exagerado, ou back do empate/under).
3. **Mando + reduzido:** time da casa com 10 sofre desvantagem maior (~1,2 gol) que o visitante (~0,58 gol) — calibre o lado.
4. **Pênalti perdido ≠ jogo morto:** rebote e momentum podem manter o mercado de gols vivo; não feche posição cedo demais.
5. **VAR check em andamento:** janela de segundos onde casas suspendem; quem lê a tendência da decisão antes da suspensão captura preço.
6. **Mata-mata travado rumo aos pênaltis:** em prorrogação 0-0 entre forças equilibradas, "ir aos pênaltis Sim" se valoriza minuto a minuto — entrar cedo na prorrogação captura preço melhor.

---

## Apêndice — Números-âncora para memorizar

- Penalti/jogo: **~0,25–0,30** (PL 23/24 ~0,28–0,29; MLS ~0,31–0,32; La Liga 20/21 ~0,39).
- Distribuição 0/1/2/3 penaltis: **não confirmada em fonte primária** — usar médias por jogo, não o quarteto de snippet.
- Conversão de penalti: **~75–82%** histórica, pico **89,7%** (PL 23/24; só 7,5% defendidos).
- VAR La Liga: pênaltis concedidos **+32,7%**; pênaltis como % dos gols **+51,5%** (7,64%→11,57%); conversão **+9,3%**. Big-5: **+12,0%** cobrados, **+3,7%** conversão.
- Vermelho/jogo (PL): **~0,08–0,13** (oscila; 22/23 = recorde de menos, ~0,08).
- Impacto de vermelho: gols do adversário **+124%**, do reduzido **−47%**; xG reduzido **−65%**, adversário **+54%**. Mando: casa com 10 ~−1,2 gol vs. visitante ~−0,58.
- Booking points: **amarelo 10, vermelho 25, máx 35/jogador** — MAS **bet365 = contagem de cartões (vermelho=2)**.
- OG: **~8,9%/temporada**; ~1 a cada ~11–12 jogos; ~71,6% de zagueiros; loteria.
- Cabeça: **~15–17%** recente (PL 24/25 = 15,6%; pico 19–21%+ em mata-mata/temporadas atípicas).
- Falta direta: conversão **~3,6–6,8%** (PL); produção nas top-5 caiu **~53,6%** (33,2→15,4/temporada, média móvel 3 temporadas); La Liga 23/24 só **2,4%**.
- Liga mais cartões: **Bolívia ~8/jogo**, ~98% dos jogos com >4 cartões.
- Substituições: **5 no tempo normal + 1 extra na prorrogação** (a 6ª não conta nos mercados de sub).

---

## Fontes

- Penalty Kick Statistics — PlayToday: https://playtoday.co/blog/stats/penalty-kick-statistics/
- Premier League Penalties Like a Free Goal — Opta/The Analyst: https://theanalyst.com/articles/premier-league-penalties-like-free-goal
- VAR Impact on Europe Big 5 Leagues — Spreadex: https://www.spreadex.com/sports/blog/features/var-impact-europe-big-5-premier-league/
- Penalties Stats Football — ScoreRoom: https://scoreroom.com/stats-penalties/
- Penalty Awarded Betting Markets — Betpack: https://www.betpack.com/guides/betting-strategy/penalty-awarded-betting/
- The value of a penalty in soccer — Pinnacle: https://www.pinnacle.com/betting-resources/en/soccer/how-important-is-a-penalty-in-soccer-betting/nc92jxgbetbhaum3
- Player To Be Sent Off Betting Market Explained — OnTheBallBets: https://www.ontheballbets.com/betting-guides/football/betting-markets/cards/player-sent-off/
- Booking Points / Red Cards Strategy — 22bet: https://news.22bet.com/wiki/betting-guide/booking-points-betting-strategy-red-cards/
- Yellow and red card statistics — ScoreRoom: https://scoreroom.com/stats-cards/
- How Do Red Cards Impact Team Performance — Data Between The Lines: https://databetweenthelines.substack.com/p/how-do-red-cards-impact-team-performance
- Effects of a red card on goal-scoring in World Cup matches — Springer Empirical Economics: https://link.springer.com/article/10.1007/s00181-017-1287-5
- World Cup Red Cards & Late-Game Chaos — Covers: https://www.covers.com/world-cup/red-cards-timing-data-analysis
- Own Goal Betting Rules — ThePuntersPage: https://www.thepunterspage.com/own-goals-in-betting/
- Do Own Goals Count in Betting — Statschecker: https://www.statschecker.com/guides/do-own-goals-count-in-betting
- Why headed goals at the 2026 World Cup look under-priced — xGenius: https://www.xgenius.bet/p/why-headed-goals-at-the-2026-world
- How Many Goals Are Scored from Direct Free Kicks — SQAF: https://sqaf.club/free-kick-goal-stats/
- Free-Kick Specialists: Celebrating an Endangered Species — Opta/The Analyst: https://theanalyst.com/articles/free-kick-specialists-celebrating-an-endangered-species
- Goalscoring Markets settlement — bet365 Help: https://help.bet365.com/s/en-us/sportsrules/soccer/goalscoring-markets
- Card Markets — bet365 Help Center: https://help.bet365.com/s/en/sportsrules/soccer/card-markets
- Bet Builder / SGM correlation discount & compounding margin — BettingPro: https://www.bettingpro.com.au/same-game-multi/
- Betbuilder Rules — Matchbook Exchange: https://www.matchbook.com/page/rules_and_regulations/betbuilder-rules/
- Live Betting Momentum signals — PerformanceOdds: https://www.performanceodds.com/football-stats-trends/live-betting-with-momentum-6-in-play-signals-using-real-match-stats/
- Red Card Betting Guide Pro Strategies — Upload Insider: https://www.uploadinsider.com/blog/red-card-betting-guide-3-winning-pro-strategies/
- Best Football Data Websites (FBref perdeu licença Opta jan/2026) — SportsDataCampus: https://english-programs.sportsdatacampus.com/free-football-data-websites/
- Law 12 Fouls and Misconduct — The FA: https://www.thefa.com/football-rules-governance/lawsandrules/laws/football-11-11/law-12---fouls-and-misconduct
- VAR Penalty / handball APP check — Premier League: https://www.premierleague.com/en/news/1300076
- Penalties Have Never Been Closer to a Free Goal in the PL — Opta Analyst: https://theanalyst.com/articles/premier-league-penalties-like-free-goal
- Season trends: Headers rise despite fewer crosses — Premier League: https://www.premierleague.com/en/news/4029745
- Season trends: Why direct free-kick goals hit all-time low — Premier League: https://www.premierleague.com/en/news/4029342
- How Common Are Own Goals In Football — Betting Websites UK: https://www.bettingwebsites.org.uk/articles/football/own-goals/
- Card Betting Tips & Booking Points Explained — ThePuntersPage: https://www.thepunterspage.com/betting-on-cards/
- Season trends: Record low number of red cards — Premier League: https://www.premierleague.com/en/news/3533373
