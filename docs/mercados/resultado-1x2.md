---
mercado: resultado-1x2
titulo: Resultado (1X2)
---

# Resultado (1X2)

> Dossie de referencia, neutro e global, sobre a familia de mercado **Resultado (1X2)**: vitoria mandante (**1**), empate (**X**), vitoria visitante (**2**). Foco em logica de favoritismo, o empate como aposta, e o peso do mando de campo.

---

## 0. Visao geral e nomenclatura

O **1X2** (tambem chamado *Match Result*, *Full-Time Result / FTR*, *3-way moneyline*, *Resultado Final*) e o mercado mais negociado do futebol. Sao tres resultados mutuamente exclusivos e coletivamente exaustivos:

| Codigo | Significado | Aposta |
|--------|-------------|--------|
| **1** | Home / Mandante vence | Vitoria do time da casa |
| **X** | Draw / Empate | Jogo empatado no tempo regulamentar |
| **2** | Away / Visitante vence | Vitoria do time visitante |

Por ser o mercado de maior volume e o mais comparado entre casas, e tipicamente o que carrega a **menor margem** do livro (ver secao 2). Submercados derivados que pertencem a mesma familia logica:

- **Double Chance (Dupla Chance)**: `1X` (casa ou empate), `X2` (visitante ou empate), `12` (qualquer um vence, sem empate).
- **Draw No Bet (DNB / Empate Anula)**: aposta em time vencer; se empatar, **stake devolvida** (push).
- **Home/Away (Money Line 2-way)**: comum onde nao ha empate possivel (ja com prorrogacao incluida) ou em apresentacao "2-way" que exclui o empate da liquidacao.
- **Asian Handicap 0 (AH 0 / level ball)**: primo algebrico do DNB — protege o empate exatamente como o DNB (push no empate), mas e precificado por outra mesa. Apostadores de valor comparam DNB com AH0 porque a mesma protecao aparece com **odds diferentes** entre os dois mercados, abrindo rota de arbitragem de precificacao.

Estes derivados sao algebricamente reconstrutiveis a partir das tres pernas do 1X2, o que e a base de varias estrategias de valor (secao 3).

---

## 1. Definicao e regras de liquidacao

### 1.1 Janela de liquidacao (o ponto mais critico)

O 1X2 liquida pelo **resultado ao fim do tempo regulamentar**: **90 minutos + acrescimos**. **Prorrogacao, penaltis e gol de ouro NAO contam** para o mercado de Resultado Final, salvo se a casa anunciar explicitamente o contrario. Esta e a chamada "regra dos 90 minutos" (Betfair, Pinnacle e a esmagadora maioria dos livros).

Implicacao pratica: numa final de Champions ou Copa que vai aos penaltis, o 1X2 liquida como **empate (X)** se estava empatado aos 90'+acrescimos, *independentemente* de quem levantou a taca. Quem quer apostar no "campeao" deve usar o mercado **To Qualify / To Lift the Trophy / To Advance**, nao o 1X2.

### 1.2 Casos de borda e void

| Situacao | Tratamento tipico |
|----------|-------------------|
| Jogo **cancelado** / nao inicia | Todas as apostas **void**, stake devolvida |
| Jogo **interrompido** e nao retomado | Void dos periodos nao concluidos, **com duas excecoes operacionais decisivas** (ver abaixo: regra dos 12h e regra dos 85') |
| **Adiamento** com nova data | Varia por casa: muitas casas **void**; varios livros do varejo (UK) mantem a aposta se o jogo for reagendado para a **mesma data ou dentro de ~72h** |
| **Mudanca de sede / mando** (ex: jogo de "casa" mandado em campo neutro) | Algumas casas **void** apostas no 1X2 porque o mando muda a precificacao; checar regras |
| **W.O. / forfeit declarado SEM jogo valido em campo** | Pratica dominante: **void / stake devolvida** — nao ha resultado de campo para liquidar |
| **Resultado alterado por tribunal APOS jogo disputado em campo** (tapetao pos-jogo) | Geralmente liquida pelo **resultado em campo**, ignorando a decisao administrativa posterior — mas e regra que **varia por casa** |
| **Push no 1X2 puro** | Nao existe push no 1X2 de 3 vias (os 3 resultados cobrem o universo). Push so aparece nos derivados (DNB / AH0) |

**Duas excecoes operacionais que mudam o jogo em partidas interrompidas:**

- **Regra dos 12 horas (Pinnacle e similares)**: se uma partida **comeca** mas nao e concluida **dentro de 12 horas** do pontape inicial, as apostas nos periodos **nao concluidos** sao anuladas. (Nao confundir com a janela de 48–72h de *reagendamento* usada por varios livros do varejo para jogos que sequer iniciaram.)
- **Regra dos 85 minutos**: se o arbitro **encerra a partida apos pelo menos 85 minutos jogados**, varias casas (Pinnacle entre elas) consideram que **todos os periodos tem acao** — o 1X2 liquida pelo **placar do momento do encerramento**, em vez de anular. Este `85'` e o divisor de aguas operacional mais importante de jogos abreviados.

> Atencao: as janelas (12h Pinnacle, 72h reagendamento varejo) e o tratamento de W.O./tapetao **variam por operador**. Sempre conferir o regulamento da casa especifica.

### 1.3 Liquidacao dos derivados (onde aparecem push/void)

- **Double Chance**: liquida ganho se qualquer um dos dois resultados cobertos ocorrer. Sem push.
- **Draw No Bet**: vitoria do time -> ganha; **empate -> push (stake devolvida)**; derrota -> perde. E o unico desta familia onde o "void parcial" e o coracao da regra.
- **Asian Handicap 0**: identico ao DNB na liquidacao (push no empate), apenas exposto em outra mesa de precos.

---

## 2. Como a odd/margem se forma

### 2.1 Da probabilidade a odd

A casa estima a probabilidade "justa" de cada resultado (`p1`, `pX`, `p2`, somando ~100%), depois aplica a **margem (overround / vig / juice)** comprimindo as odds para baixo, de modo que a soma das probabilidades implicadas passe de 100%.

**Probabilidade implicada = 1 / odd decimal.**

**Exemplo numerico:**

| Resultado | Odd | Prob. implicada |
|-----------|-----|-----------------|
| 1 (Casa) | 2.10 | 47.62% |
| X (Empate) | 3.40 | 29.41% |
| 2 (Visitante) | 3.75 | 26.67% |
| **Soma** | — | **103.70%** |

Overround = 103.70% − 100% = **3.70%**. Esse excesso e a vantagem teorica da casa.

Para recuperar a probabilidade justa, normaliza-se dividindo cada implicada pela soma:
- p1 justo ≈ 47.62 / 103.70 = **45.9%**
- pX justo ≈ 29.41 / 103.70 = **28.4%**
- p2 justo ≈ 26.67 / 103.70 = **25.7%**

### 2.2 Margem tipica no 1X2

| Faixa de overround | Avaliacao | Onde se encontra |
|--------------------|-----------|------------------|
| < 3% | Excelente | Casas sharp (Pinnacle) e exchanges |
| 3–5% | Bom | Boas casas |
| 5–7% | Medio | Casas tradicionais de varejo |
| > 7% (ate 12%+) | Ruim | Operadores recreativos |

O 1X2 das grandes ligas e o mercado de **menor margem** justamente por volume e comparabilidade.

### 2.3 Distribuicao assimetrica da margem (chave de valor — fenomeno de VAREJO)

No **varejo**, a casa **nao distribui a margem igualmente** entre os tres resultados:

- **Favoritos** costumam carregar **menos margem** (sao o foco dos sharps; a casa nao quer ser pega).
- **Zebras/longshots** carregam margem **desproporcional** (o vies favorito-azarao do publico, secao 6).
- O **empate** no futebol costuma levar margem extra, por ser o resultado mais dificil de o apostador casual avaliar.

> **Ressalva importante**: essa assimetria e bem documentada no **varejo recreativo**, mas **nao se generaliza para toda "a casa"**. Em dados de casas sharp (Pinnacle), estudos (Sestovic, SSRN 3035848) encontram **nenhum sinal claro de longshot bias e apenas leve indicacao de favorito bias**. Ao usar este angulo, mire o varejo; em casas sharp o efeito e quase ausente.

> Pratica: ao comparar casas de varejo, a perna do favorito frequentemente tem o melhor valor relativo; o empate e a perna do azarao tendem a ser mais "caros".

### 2.4 Movimento de linha

A linha de abertura e uma estimativa; ela se move ate o fechamento por:
- **Dinheiro sharp / steam move**: cascata de ajuste entre casas quando dinheiro respeitado entra. O encurtamento ("dropping odds") sinaliza informacao.
- **Reverse Line Movement (RLM)**: linha anda **contra** a maioria das apostas do publico -> sinal de que os sharps estao do outro lado.
- **Noticias**: escalacoes confirmadas (1h antes), lesoes, clima.
- **Closing line value (CLV)**: apostar consistentemente a odds melhores que a **linha de fechamento** e o melhor preditor de lucro de longo prazo, pois a linha de fechamento incorpora toda a informacao disponivel.

---

## 3. Tips e angulos de valor (onde mora o EV+)

1. **Caçar a perna correta do mercado**: como a margem e assimetrica (no varejo), a comparacao deve ser **por resultado**, nao pela media. Favorito de uma casa sharp + empate de outra + visitante de uma terceira pode montar uma "linha sem vig" que revela o EV+.

2. **Comparar com a linha sem vig (no-vig line)**: remova a margem da melhor casa disponivel (ex: Pinnacle) e compare com o varejo. Se o varejo paga acima do "justo" sem vig, ha valor.

3. **Closing Line Value**: registre se voce bate o fechamento. Bater o close consistentemente > resultado de curto prazo.

4. **1X2 vs derivados — arbitrar a precificacao mal feita**:
   - **Double Chance e frequentemente mal precificado** (margem disfarcada). Reconstrua o DC a partir das tres pernas 1X2 e compare; muitas vezes o 1X2 + cobertura propria sai melhor.
   - **Draw No Bet costuma dar melhor valor que Double Chance** para o mesmo time, quando a conviccao e de vitoria mas se quer proteger o empate. A logica e estrutural: a odd do DNB fica **entre** o preco da vitoria seca e o do DC, e o DC e sistematicamente cortado pela casa (porque o empate vira resultado vencedor para o apostador). Exemplo numerico tipico: **vitoria seca 2.50 → DNB ~1.80 → Double Chance ~1.40**. O DNB entrega quase a mesma protecao do DC pagando bem mais.
   - **DNB vs Asian Handicap 0**: como sao algebricamente equivalentes, compare os dois — a mesma protecao de empate as vezes paga mais num mercado que no outro.

5. **Empate como aposta de valor**: o empate e estruturalmente **subapostado** pelo publico (ninguem "torce pelo empate"), o que as vezes o deixa com odd inflada — porem a casa adiciona margem extra nele. Onde ha valor real no empate (ver secao 4): jogos equilibrados, baixo placar esperado, derbis truncados, fim de temporada sem motivacao.

6. **Mando subvalorizado em contextos especificos**: o mando ja esta no preco, mas certas ligas tem mando estruturalmente maior (Grecia, Espanha, ligas dos Balcas, Andes). Em jogos com viagem longa de visitante (continental, fusos), o mercado as vezes subestima o desgaste.

---

## 4. Correlacoes com o jogo (o coracao do dossie)

Aqui a regra: cada caracteristica do jogo **puxa** uma das tres pernas. O eixo principal e **quanto o jogo tende a empate vs decisao**, e **para qual lado a decisao pende**.

### 4.1 Mando de campo

- **Direcao**: puxa **1** para cima, **2** para baixo. O empate fica no meio.
- **Numeros de referencia — distinguir historico de recente**:
  - **Premier League, media historica all-time**: aproximadamente **Casa ~46% / Empate ~27% / Visitante ~26%**.
  - **Premier League, temporadas recentes**: o **empate caiu** para a faixa de **~22–24%** (2022-23: **casa 48.4% / fora 28.7% / empate ~22.9%**). A fatia de empate na PL vem **caindo** ao longo dos anos — usar o numero recente, nao o all-time, como prior atual.
  - **Selecoes (1993–2004)**: Casa ~50.5% / Empate ~25% / Visitante ~24.5%.
- **Drivers**: torcida (principal), distancia de viagem, familiaridade com o campo, vies de arbitragem (4.4).
- **Forca do mando por liga (respaldo academico)**: o estudo de **157 ligas nacionais** ("Components of home advantage in 157 national soccer leagues worldwide") aponta os maiores mandos em **focos regionais** — **Andes, Balcas, Africa Ocidental, America Central** — e identifica a **Grecia como o maior mando entre as ligas top europeias**. Isso da respaldo ao ponto pratico de que **Espanha / Grecia / Balcas / Noruega (distancia de viagem)** tem mando estruturalmente maior, enquanto **Alemanha e Inglaterra** tendem a mando relativamente mais fraco apesar do grande publico.
- **Jogos sem torcida ("ghost games" da COVID)**: os estudos convergem em **direcao** (menos vitorias da casa, mais vitorias visitantes, vies de arbitragem some) mas divergem em **magnitude** conforme a metrica. Faixa reportada: **queda de ~7 a 13 pontos percentuais** na vantagem mandante durante jogos sem publico — ex.: ~6.9 p.p. na fatia de vitorias mandantes da 1a divisao alema; ate ~13 p.p. de reducao na probabilidade de vitoria mandante (e +~10 p.p. na visitante) no primeiro periodo sem publico — efeito que **se recuperou ao longo do tempo**. Prova material de que a torcida e parte do mando.

### 4.2 Estilo de jogo e ritmo

| Caracteristica | Efeito no 1X2 |
|----------------|---------------|
| Dois times **ofensivos / pressao alta / placar alto esperado** | **Reduz X (empate)**; aumenta a chance de o melhor time vencer (mais gols = menos chance de zero-a-zero / empate). Puxa para a perna do favorito |
| **Time de posse vs time de contra-ataque baixo bloco** | Tende a jogo travado; **aumenta X** se o bloco baixo aguenta. Favorito de posse pode esbarrar em empate |
| Dois times **defensivos / baixo placar esperado** | **Aumenta X**. Classico ambiente de empate 0-0 / 1-1 |
| **Mismatch de qualidade grande** | Puxa forte para a perna do favorito, **reduz X** (favorito tende a abrir distancia) |
| **Times parelhos** | **Aumenta X** — o empate e mais provavel em jogos equilibrados |

> Regra-mestra: **mais gols esperados -> menos empate**; **menos gols esperados -> mais empate**. O empate e o resultado de baixa entropia (placares baixos e parelhos).

### 4.3 Clima e campo

- **Chuva forte / vento / campo pesado / neve**: nivela qualidade tecnica, reduz gols, **aumenta X** e da chance ao azarao (2 ou 1 conforme quem e o azarao). Puxa para baixo a perna do favorito tecnico.
- **Calor extremo / altitude**: reduz ritmo; pode favorecer o time aclimatado (em geral o mandante em altitude — ex: La Paz).

### 4.4 Perfil do arbitro

- **Vies de mando**: arbitros tendem a dar **mais cartoes ao visitante** — direcao bem documentada. Em magnitude, a PL recente roda em torno de **~2,0–2,5 amarelos por lado por jogo** (ex.: visitantes ~2,43 caindo para ~1,94 nos jogos sem publico da COVID; total da PL ~3,5 cartoes/jogo caindo para ~2,53 sem torcida). Os valores absolutos exatos variam por fonte/temporada — tratar como aproximacao; o que e robusto e a **direcao** (visitante leva mais).
- **Direcao no 1X2**: arbitro "caseiro" reforca **1**. Arbitro de muitos cartoes/vermelhos **aumenta variancia** -> uma expulsao pode destravar um jogo parelho (reduz X situacionalmente).
- **Acrescimos**: vies de tempo adicional historicamente favoreceu o mandante perdendo/empatando (mais tempo para o mando reagir) — embora estudos recentes em arbitros de elite contestem o efeito. Sem torcida, o vies de cartoes e de acrescimos some.

### 4.5 Calendario, cansaco e motivacao

- **Time importante no meio de semana + jogo fora no fim de semana**: hipotese de desgaste (rotacao/pernas pesadas) -> favorito visitante cansado pode escorregar, **aumentando X ou a zebra**. (Angulo a validar caso a caso.)
- **Jogo continental na quinta -> liga no domingo**: desgaste de viagem reforca mando do adversario e o empate.
- **Fim de temporada sem objetivo (dead rubber)**: motivacao baixa de um ou ambos -> **empates "de cavalheiros"** ou resultados erraticos; o mercado frequentemente erra aqui.
- **Decisao / mata-mata / rebaixamento**: jogos truncados, medo de perder -> **aumenta X** (especialmente jogos de ida). Times "jogando para nao perder" inflam o empate.
- **Rivalidade / derbi**: forma vai pro lixo; jogos mais truncados e cartonados, **empate e expulsoes mais provaveis**; mando pesa mais (caldeirao).

### 4.6 Qualidade defensiva/ofensiva

- Boa **defesa de ambos** -> baixo placar -> **mais X**.
- Ataque forte vs defesa fraca -> **menos X**, puxa o lado do ataque.
- Time que **concede muito mas marca muito** -> jogo aberto, **menos empate**, resultado mais para o lado de quem tem o melhor saldo de xG.

---

## 5. Indicadores preditivos e como le-los para o 1X2

| Indicador | Como ler para 1X2 |
|-----------|-------------------|
| **xG / xGA** | Metrica preditiva mais forte. Diferencial de xG = forca real. Times **vencendo acima do xG** (sorte na finalizacao) tendem a **regredir** -> a perna deles esta cara. Times **perdendo apesar de xG superior** estao subvalorizados -> valor na perna deles |
| **Modelo Poisson / Bivariado** | Gera matriz de placares; soma das diagonais = `pX`. Exemplo de saida: **Casa 52.4% / Empate 25.8% / Visitante 21.8%**. Poisson *independente* **subestima empates** — usar **bivariado** ou ajuste (Dixon-Coles) para corrigir placares baixos e o empate |
| **Forma recente** | Util, mas ruidosa; ponderar por **qualidade do adversario** e por xG, nao so por resultados |
| **H2H (confronto direto)** | Fraco isoladamente (elencos mudam); util para padrao tatico/estilo (jogos historicamente truncados -> sinal de empate) |
| **Escalacao / desfalques** | Forte mover de linha. Ausencia de goleiro/zagueiro/craque desloca o xG esperado. Ler escalacao confirmada (~1h antes) |
| **Tiros / posse / chances claras** | Posse alta isolada nao prediz resultado; **chances claras e shots on target** correlacionam melhor com vitoria |
| **Medias historicas de empate da liga/competicao** | Ligas/contextos variam; usar como prior (ver tabela 5.1) |

### 5.1 Base rate de empate por liga (priors)

Empate em ligas top europeias gira tipicamente em **~22–28%**, com a **media global em torno de ~25%**. Vitorias mandantes giram **~43–48%** e visitantes **~27–29%** nas grandes ligas.

| Grupo | Faixa de empate | Exemplos |
|-------|-----------------|----------|
| Ligas "de mais empate" | **~27–30%+** | Ligue 1, Serie A, Ligue 2 e varias ligas francesas/gregas costumam liderar rankings de empate |
| Media global | **~25%** | Referencia neutra para um jogo "tipico" |
| Ligas mais ofensivas / "de menos empate" | **~22–25%** | Bundesliga (~25% em 2025/26), Premier League recente (~22–24%) |

> Cautela com over/underperformance: ler a base rate da liga em conjunto com xG, nunca isolada.

> Pesquisa sobre lucratividade de modelos xG (atribuicao, nao lei geral): **um paper especifico** ("Modeling of Football Match Outcomes with Expected Goals Statistic") so encontrou lucratividade **apostando em resultados com probabilidade > 70%** (favoritos fortes bem identificados). Contraponto: **outros estudos** reportam ROI de **~10% (odds medias) a ~15% (melhores precos) SEM esse corte**, com **lucro concentrado em vitorias mandantes** e **prejuizo consistente em vitorias visitantes** (ResearchGate 350543528 e 387250442). Ou seja, o "> 70%" e resultado de UM modelo, nao verdade universal — mas a cautela com apostas de baixa probabilidade e razoavel.

---

## 6. Armadilhas comuns (traps)

1. **Vies favorito-azarao (favourite-longshot bias)**: no **varejo recreativo**, o publico **superaposta azaroes** (odds longas) e **subaposta favoritos** -> azaroes ficam **caros** e favoritos as vezes **baratos**. Apostar cegamente na zebra "porque paga muito" e armadilha classica. **Porem**: em dados de casas sharp (Pinnacle), estudos nao acham longshot bias claro e veem so leve favorito bias. Nao generalizar o efeito para "a casa" — e fenomeno de varejo.

2. **Empate subapostado pelo publico**: ninguem torce por empate, entao ha menos volume no `X`; isso ora cria valor, ora e neutralizado pela margem extra que a casa poe no empate. Nao assumir valor automatico.

3. **Confundir janela de liquidacao**: apostar "no campeao" via 1X2 numa eliminatoria/final — o 1X2 ignora prorrogacao e penaltis (regra dos 90'). Erro caro.

4. **Narrativa de forma sem xG**: "ganhou os ultimos 5" pode esconder vitorias sortudas (xG inferior). O mercado as vezes precifica a narrativa; o valor esta em apostar **contra** o time superestimado por finalizacao quente.

5. **Mando como tese isolada**: o mando ja esta no preco. Apostar "casa sempre" nao tem EV — so ha valor onde o mando especifico (liga, viagem, altitude) e subestimado.

6. **Public games / midia**: jogos de gigante popular atraem dinheiro de torcedor; a casa **encurta** o favorito popular alem do justo -> o **lado contrario** (visitante/empate) pode ter valor.

7. **Dead rubbers e rotacao**: fim de temporada, times ja classificados/rebaixados, prioridade na proxima competicao — o mercado frequentemente nao precifica bem a desmotivacao/rotacao; alto risco de surpresa.

8. **Jogos sem torcida / sede neutra**: assumir o mando historico "normal" quando ha portoes fechados ou campo neutro infla erradamente a perna `1` (ver 4.1: queda de ~7–13 p.p.).

---

## 7. Correlacao entre mercados (bet builder / same game multi)

A casa aplica **desconto de correlacao**: nao multiplica simplesmente as pernas; reduz a odd combinada quando os resultados sao **positivamente correlacionados**, e **rejeita** combinacoes logicamente impossiveis.

### Combina bem (correlacao positiva — bom para o apostador, mas a casa corta a odd)

| Combinacao | Por que correlaciona |
|------------|----------------------|
| **1 (casa vence) + Over 1.5/2.5 gols** | Favorito que vence costuma marcar; jogo aberto reforca ambos |
| **1/2 (favorito vence) + Favorito marca / Craque marca** | Se o atacante marca, o time tende a vencer |
| **Vitoria do favorito forte + Handicap −1** | Mesma direcao (favorito dominante) |
| **1 + Time da casa marca primeiro** | Marcar primeiro eleva muito a prob. de vencer |

### Combina por tese de jogo (correlacao moderada)

| Combinacao | Logica |
|------------|--------|
| **Vitoria de A + BTTS Sim** | "A vence num jogo aberto" — ambos marcam mas A leva. Coerente quando A ataca muito mas defende mal |
| **Empate (X) + Under 2.5 / BTTS variavel** | Empates de baixo placar (0-0, 1-1) sao os mais comuns; X correlaciona com Under |

### Contradiz / e rejeitado (correlacao negativa)

- **Vitoria por margem larga (Handicap −2) + Under 1.5 gols** — incompativel.
- **Under 1.5 + BTTS Sim** — logicamente impossivel (BTTS exige ≥2 gols), **rejeitado**.
- **Empate (X) + um time marcar muitos / Handicap** — tensiona.
- **Goleada do favorito + "favorito nao sofre gol" + Over 4.5** pode ser permitido, mas a odd combinada e fortemente cortada por correlacao.

> Regra: bet builders coerentes com **uma unica tese de jogo** (ex: "favorito atropela jogo aberto" = 1 + Over + favorito marca) sao os mais naturais; mas e exatamente onde a casa mais corta a odd. O valor em SGM costuma estar em **correlacoes que a casa subestima**, nao nas obvias.

---

## 8. Fontes de dados para alimentar prognosticos de 1X2

| Fonte | O que oferece | Uso para 1X2 |
|-------|---------------|--------------|
| **Understat** | xG/xGA por time e jogador (rede neural, 100k+ chutes), shot maps, timelines | Forca real, deteccao de over/underperformance vs xG |
| **FBref (Sports Reference)** | Stats estruturadas de temporada: xG, xA, npxG, pressao, acoes defensivas | Base ampla para forca ofensiva/defensiva e priors |
| **SofaScore / WhoScored** | Stats ao nivel de jogo (chutes, posse, faltas, escanteios), cobertura ampla de ligas | Forma, escalacao, contexto, ligas alem do top-5 |
| **Infogol** | xG aplicado a previsao de resultado | Probabilidades de 1X2 derivadas de xG |
| **APIs de odds historicas** (ex: football-data, provedores comerciais) | Odds pre-jogo e de fechamento de 9+ casas, 25+ ligas, desde 2000/01 | Backtest, calculo de no-vig, CLV |
| **worldfootballR (R)** | Scraper de FBref/Understat/Transfermarkt | Pipelines de modelagem proprios |
| **Exchanges (Betfair/Smarkets)** | Preco de mercado quase sem margem | Melhor proxy de probabilidade "verdadeira" |

> Boa pratica: cruzar **FBref (temporada) + Understat (shot-level xG) + odds de fechamento** (proxy do consenso) e alimentar um modelo Poisson bivariado / Dixon-Coles, comparando a saida com a no-vig line do mercado.

---

## 9. Camada LIVE (ao vivo)

Ao vivo, o 1X2 vira um problema dinamico: a cada minuto sem gol o **empate sobe** e os tempos restantes encolhem o leque de placares possiveis. Eventos discretos (gol, vermelho) **reprecificam** o mercado em segundos.

### Como cada evento move o 1X2

| Evento | Efeito imediato no 1X2 |
|--------|------------------------|
| **Gol cedo do favorito** | Encurta drasticamente a perna do favorito; empate e a outra perna disparam |
| **Gol cedo do azarao** | Maior choque de preco: azarao encurta muito, favorito alonga, **empate sobe** (favorito agora precisa correr atras) |
| **Vermelho** | Reprecifica em segundos; o time com 10 perde prob. de vencer e ganha de levar; **empate sobe** se o jogo estava parelho, ou se destrava se o lado expulso ja perdia |
| **Tempo passando 0-0** | **Empate sobe continuamente**; ambas as vitorias alongam. Aos 70'+ no 0-0, o `X` vira favorito do mercado |
| **Penalti / lesao de craque / goleiro** | Saltos pontuais de preco |

### Estrategias live especificas

1. **Esperar a confirmacao, nao reagir ao evento**: apos gol contra o favorito, **nao** apostar no segundo do gol. Assista **5–10 min**: se o time forte continua dominando, a odd alongada nele e **valor genuino** (overreaction do mercado). Mercados tendem a **sobre-corrigir** apos gols contra o roteiro.

2. **Overreaction a gol/vermelho**: o mercado costuma exagerar o impacto de um gol "fora de roteiro"; o lado dominante fica barato.

3. **Momentum / pressao sem gol**: um time pressionando (chances, escanteios, linguagem corporal) ve a odd encurtar **antes** de marcar. Ler o fluxo antes do mercado e a vantagem. Stats live nao capturam momentum visual -> **assistir ao jogo e quase obrigatorio**; sem assistir, pre-jogo costuma ser melhor.

4. **Trade de empate (lay the draw / back the draw)**: backar o empate cedo num jogo parelho de baixo placar e fazer cash-out/hedge conforme o `X` encurta com o passar do tempo; ou *lay the draw* esperando gol num jogo aberto.

5. **Velocidade no vermelho**: a janela de valor pos-expulsao fecha em segundos. Sem conta pronta e jogo ao vivo, outros capturam antes.

6. **Disciplina e suspensao de mercado**: durante lances perigosos a casa **suspende** o mercado; planejar a entrada antes do lance.

> Sintese live: o 1X2 ao vivo e governado por **tempo restante × placar atual × homens em campo**. Gol cedo e vermelho sao os dois maiores moveres; o empate e o "atrator" que cresce com o relogio em jogos travados.

---

## Fontes

- Pinnacle — Betting rules (regra dos 12h de abandono, regra dos 85min, liquidacao em 90min): https://www.pinnacle.com/en/future/betting-rules
- Betfair — Football 90 Minute Rule (prorrogacao/penaltis nao contam): https://support.betfair.com/app/answers/detail/10264-football---90-minute-rule/
- What is 1X2 in betting? (+ How it works & Advantages) — Pinnacle Odds Dropper: https://www.pinnacleoddsdropper.com/blog/1x2-betting
- 1x2 Betting — Sportmonks Glossary: https://www.sportmonks.com/glossary/1x2-betting/
- Interrupted Matches (settlement rules) — FootballPredictions.com: https://footballpredictions.com/betting-guide/rules/interrupted-matches/
- Vig, Juice, and the Overround: How Bookmakers Guarantee Profit — True Value Engine: https://www.truevalueengine.com/understanding-bookmaker-vig-margin-and-overround/
- Bookmaker Margins Explained — How the Overround Works — Bet.report: https://bet.report/en/blog/bookmaker-margins-explained/
- Understanding Bookmaker Margins (Vig) 2026 — Mr Super Tips: https://www.mrsupertips.com/guides/bookmaker-margins-vig-guide
- Sestovic — Bookmaker Margins and Favourite-Longshot Bias in Football (SSRN 3035848): https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3035848
- The Favourite-Longshot Bias and Market Efficiency in UK Football Betting (PDF): https://www.academia.edu/5755424/The_Favourite_Longshot_Bias_and_Market_Efficiency_in_UK_Football_Betting
- Favorite-Longshot Bias and Market Efficiency in the Soccer Betting Market — ResearchGate: https://www.researchgate.net/publication/351985837_Favorite-Longshot_Bias_and_Market_Efficiency_in_the_Soccer_Betting_Market
- Home Advantage in Football Betting — Soccer-Rating: https://www.soccer-rating.com/home-advantage-in-betting
- Components of home advantage in 157 national soccer leagues worldwide — ResearchGate: https://www.researchgate.net/publication/260337857_Components_of_home_advantage_in_157_national_soccer_leagues_worldwide
- Deuces Cracked — Hidden truth about home vs away (PL 2022-23: casa 48.4%, fora 28.7%): https://www.deucescracked.com/blog/the-hidden-truth-about-home-vs-away-stats-that-premier-league-bettors-miss
- During and after COVID-19: home advantage in Germany's first division (arXiv 2411.12509): https://arxiv.org/html/2411.12509v1
- Professional football in times of COVID-19: did home advantage disappear? (PMC8670806): https://pmc.ncbi.nlm.nih.gov/articles/PMC8670806/
- A complete season with attendance restrictions confirms spectators' contribution to home advantage and referee bias (PMC9261922): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9261922/
- Referee bias contributes to home advantage in English Premiership football — Taylor & Francis: https://www.tandfonline.com/doi/full/10.1080/02640410601038576
- Home-bias in referee decisions: Evidence from Ghost Matches (COVID) — ScienceDirect: https://www.sciencedirect.com/science/article/pii/S0165176520303815
- RunRepeat — Referees' home-bias disappears without audience (cartoes home vs away): https://runrepeat.com/refereeing-analysis-post-covid-soccer
- Predicting Football Results With Statistical Modelling (Poisson/Dixon-Coles) — dashee87: https://dashee87.github.io/data%20science/football/r/predicting-football-results-with-statistical-modelling/
- How to calculate Poisson distribution for football betting — Smarkets Help Centre: https://help.smarkets.com/hc/en-gb/articles/115001457989-How-to-calculate-Poisson-distribution-for-football-betting
- Predicting Football Match Results Using a Poisson Regression Model — MDPI: https://www.mdpi.com/2076-3417/14/16/7230
- Modeling of Football Match Outcomes with Expected Goals Statistic (limiar >70%) — ResearchGate 350543528: https://www.researchgate.net/publication/350543528_Modeling_of_Football_Match_Outcomes_with_Expected_Goals_Statistic
- Expected Goals (xG): How It Really Predicts Match Outcomes — Performance Odds: https://www.performanceodds.com/how-to-guides/expected-goals-deep-dive-how-xg-can-predict-your-next-winning-bet/
- Expected Goals (xG) for Football Betting: Data-Driven Analysis — FootballBookie: https://football-bookie.com/articles/expected-goals-xg-for-football-betting/
- In-Play Betting Strategies 2026 — Mr Super Tips: https://www.mrsupertips.com/guides/in-play-betting
- 5 In-Play Football Betting Strategies That Actually Work — Caan Berry: https://caanberry.com/5-in-play-football-betting-strategies-that-work/
- Double Chance vs Draw No Bet: Which Bet Offers Better Value? — Caan Berry: https://caanberry.com/double-chance-vs-draw-no-bet/
- Double Chance betting / Draw No Bet alternative — Pinnacle: https://www.pinnacle.com/betting-resources/en/betting-strategy/double-chance-betting-using-odds-to-calculate-your-stake/7rx2xrrawglbxd8v
- Draw No Bet Explained / Stats over 60 leagues — The Punters Page: https://www.thepunterspage.com/draw-no-bet-explained/
- Bet Builder & Same-Game Multi guide — Free Super Tips: https://www.freesupertips.com/news/betting-academy-bet-builder-same-game-multi-guide/
- Bet Builder Calculator: Estimate Same Game Multi Odds & Correlation Discount — GamblingCalc: https://gamblingcalc.com/betting/football/bet-builder-calculator/
- Best xG Websites 2026: Understat, FBref, SofaScore Compared — StatPair: https://statpair.com/blog/best-xg-websites-2026-comparison
- Understat — xG stats for teams and players: https://understat.com/
- Dropping Odds Explained: How to Read Sharp Money Movement — Statsbet: https://statsbet.org/blog/dropping-odds-explained
- What is Sharp Money? (+ How it works) — Pinnacle Odds Dropper: https://www.pinnacleoddsdropper.com/blog/sharp-money
