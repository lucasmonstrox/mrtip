---
mercado: escanteios
titulo: Escanteios
---

# Escanteios

> Dossiê de referência neutro e global (sem viés de liga específica). Reúne regras de liquidação, formação de preço, ângulos de valor, correlações com o jogo, indicadores preditivos, armadilhas, correlação entre mercados, fontes de dados e camada ao vivo. Números são médias de referência reportadas pelas fontes — **recalibre por liga/temporada antes de usar**. Em particular, atenção ao número usado para construir o μ (média): a referência global multi-liga é mais baixa que a das grandes ligas europeias (ver §3 e §5).

---

## 1. Mapa da família e definições

A família "escanteios" cobre todo mercado cujo objeto de liquidação é a **contagem de cantos batidos** (não os concedidos no papel, ver §2), e não o placar. Subdivide-se em:

| Submercado | O que você aposta | Linha típica |
|---|---|---|
| **Total O/U (linha cheia/meia)** | Soma dos cantos das duas equipes acima/abaixo de uma linha | 9.5, 10.5, 11.5 |
| **Total Asiático (quarter lines)** | Igual ao O/U mas com linhas .0/.25/.5/.75 → split de stake | 9.75, 10.25 |
| **Cantos por equipe (Team Corners O/U)** | Cantos de UMA equipe acima/abaixo de linha | Casa 4.5–5.5; visitante 3.5–4.5 |
| **Handicap de escanteios** | Diferença de cantos entre as equipes com vantagem/desvantagem | -2 / +2 |
| **Handicap asiático de escanteios** | Igual, com quarter lines e push | -1.5 / -2.25 |
| **Most Corners (3-way)** | Qual equipe termina com mais cantos (Casa / Visitante / Empate) | — |
| **1º escanteio** | Qual equipe bate o 1º canto do jogo | — |
| **Último escanteio** | Qual equipe bate o último canto do jogo | — |
| **Race to X (corrida a X)** | Qual equipe atinge X cantos primeiro | Race to 3/5/7 |
| **Multicorners (produto)** | Cantos do 1º tempo **multiplicados** pelos cantos do 2º tempo (O/U sobre o produto) | ver detalhe abaixo |
| **Intervalos de tempo (janelas de 10 min)** | Quantos cantos / qual equipe numa janela (0-10, 81-90 etc.) | — |
| **Cantos por tempo (1º/2º tempo O/U)** | O/U na soma de um tempo só | HT ~4.5/5.5 |
| **Odd/Even corners** | Total de cantos par ou ímpar | — |
| **Próximo escanteio (next corner)** | Quem bate o próximo canto (mercado live) | — |
| **Specials de janela** | "Haverá canto entre min 85-90", "canto na 1ª jogada" etc. | — |

**Detalhe — Multicorners (mercado de produto, não de soma):** confirmado oficialmente pela bet365. O resultado é `cantos_1T × cantos_2T`. Exemplo: 4 cantos no 1º tempo × 5 no 2º tempo = **20**. A dinâmica de risco é peculiar e contraintuitiva:

- Se **qualquer um dos tempos tiver 0 cantos**, o produto é **0** — um forte puxão estrutural para o **Under** de qualquer linha, mesmo em jogos com muitos cantos totais mal distribuídos.
- O produto é **muito mais volátil** que a soma (dispersão amplificada), o que torna o mercado **difícil de precificar** — fonte de margem gorda e de valor ocasional para quem modela a covariância entre tempos.
- A **William Hill** oferece uma variante 3-way "1st Half x 2nd Half Corners" (qual produto/lado vence), não só O/U.

**Correlação central da família:** escanteios são uma *proxy de pressão ofensiva sustentada com largura*. Equipes que atacam pelas pontas, cruzam muito, finalizam muito e mantêm posse no campo de ataque geram mais cantos; defesas que bloqueiam chutes e cortam cruzamentos para a linha de fundo **concedem** cantos. Isso é o que separa este mercado dos mercados de gols: você está apostando em *volume de approach*, não em conversão.

---

## 2. Definição e regras de liquidação (com casos de borda)

### Regras universais (válidas para praticamente todas as casas)

- **Conta o canto batido (taken), não o concedido/awarded.** Um escanteio assinalado pelo árbitro mas **não cobrado** (ex.: jogo termina, lesão, o jogador opta por não bater) normalmente **não conta**. Esta é a regra de borda mais importante e a fonte nº1 de disputa de bilhete.
- **Canto re-batido (retaken) conta como UM só.** Se o canto é mandado repetir (ex.: por falta na área no momento da cobrança, invasão, bola que não saiu corretamente), as casas (confirmado em **bet365** e **Pinnacle**) contam **apenas um** escanteio para aquela jogada, não dois. Não confunda a repetição da cobrança com dois cantos.
- **Apenas tempo normal:** 90 minutos + acréscimos. **Prorrogação não conta** em mata-matas, salvo mercado explicitamente "incluindo prorrogação".
- **Abandono/partida interrompida:** se o jogo é abandonado, **todas as apostas são anuladas (void)** *a menos que a liquidação já esteja matematicamente determinada* (ex.: Over 8.5 com 9 cantos já batidos → ganho mantido). **Regra concreta da Pinnacle:** se a partida não se completa em **12 horas** após o horário marcado, apostas em períodos incompletos são void — **com exceção** de partidas abandonadas após **pelo menos 85 minutos jogados**, em que vale o resultado do momento do abandono. O gatilho dos 85' é o ponto verificável a checar antes de assumir void.

### Liquidação por tipo de linha (Total e Handicap Asiático)

| Linha | Resultado se o total bate exatamente a linha | Possíveis saídas |
|---|---|---|
| **Meia (.5)** ex. 10.5 | impossível empatar → tudo ou nada | Win / Loss |
| **Cheia (.0)** ex. 10.0 | **Push** (stake devolvida) | Win / Push / Loss |
| **Quarter (.25)** ex. 10.25 Over | metade do stake em 10.0, metade em 10.5 | meio-win, meio-push, meio-loss |
| **Quarter (.75)** ex. 10.75 Over | metade em 10.5, metade em 11.0 | idem |

**Exemplo numérico — Over 10.25:** stake R$100 = R$50 em Over 10.0 + R$50 em Over 10.5.
- 11+ cantos → ganha as duas metades (win cheio).
- Exatamente 10 → a metade 10.0 é **push** (devolve R$50), a metade 10.5 **perde** (R$50) → **meia-derrota**.
- 9 ou menos → perde tudo.

**Handicap asiático de escanteios — Exemplo:** Casa -2.0 corners.
- Casa vence a contagem por 3+ → win. Por exatamente 2 → **push**. Por 1, empate ou perde a contagem → loss.
- Em -2.25, metade do stake em -2.0 e metade em -2.5.

### Mercados de "qual equipe" (1º, último, Most, Race)

- **1º escanteio:** a equipe precisa cobrar um canto **antes** do adversário. Se o jogo terminar 0 cantos (raríssimo), void.
- **Último escanteio:** só importa o canto final; todos os anteriores são ignorados. Sensível a borda — um canto no min 90+5 vira o bilhete.
- **Most Corners:** mercado 3-way normalmente (Casa/Visitante/Empate na contagem). Se for oferecido 2-way (Asian, sem empate), o empate na contagem é **push**.
- **Race to X (ex. Race to 5):** primeiro a atingir X cantos. Se **nenhuma** equipe atinge X, há a opção **"Neither/Nenhum"** (quando ofertada); sem ela, o mercado pode ser void. Dead-heat não ocorre aqui porque cantos são eventos sequenciais (não simultâneos).
- **Odd/Even:** 0 cantos costuma contar como **Even (par)** — confira a regra da casa.

### Casos de borda que mais geram disputa

1. Canto assinalado e não batido no apito final → não conta.
2. Canto mandado repetir (retaken) → conta como **um só**, regra oficial bet365/Pinnacle.
3. Mercado "incluindo prorrogação" vs "tempo normal" — leia o rótulo.
4. Suspensão temporária e retomada no mesmo dia → normalmente válida; abandono definitivo → void salvo (a) liquidação já determinada ou (b) abandono após 85'+ jogado (Pinnacle).

---

## 3. Como a odd/margem se forma

### Mecânica de precificação

A casa estima um **mean (μ) de cantos** do jogo a partir de um modelo (ver §5) e converte essa distribuição em probabilidades por linha. Como cantos **não seguem Poisson puro**, as casas sérias usam **binomial negativa / Poisson composta (compound Poisson)** ou uma distribuição discreta ajustada.

**O que a estatística realmente diz (verificado):** um estudo de **30.000 jogos em 907 ligas** (Bookie Bashing) encontrou média de **9,54 cantos/jogo** e mostrou que o **Poisson erra de forma sistemática** comparado à distribuição empírica:

- **superestima as duas caudas** — tanto **0-6** quanto **13-22** cantos;
- **subestima o miolo** — **7-12** cantos, exatamente onde ficam as linhas mais negociadas (9.5/10.5/11.5).

A leitura mecânica correta: a distribuição real tem **caudas mais gordas e maior P(0)** do que o Poisson prevê, porque **cantos vêm em clusters** (um canto tende a gerar outro na sequência de pressão). Esse comportamento de agrupamento é uma **superdispersão (overdispersion)** — variância maior que a média — e é exatamente por isso que se usa **binomial negativa / Poisson composta** em vez de Poisson simples (confirmado em arXiv 2112.13001 e Bookie Bashing). Nota: a literatura é ambígua no rótulo (alguns trechos falam em "underdispersion"), mas a mecânica negociável é a do agrupamento → use binomial negativa/composta.

> **Cuidado com o número-âncora do μ:** **9,54 é a média GLOBAL multi-liga**, e as 907 ligas incluem muitas competições fracas que puxam a média para baixo. Para as grandes ligas europeias a referência é **bem mais alta**: Premier League fica na faixa **~10–11,8** dependendo da temporada/fonte (StatsChecker; ~9,97 na PL 2025/26 por CornerValue), e agregados de top-5 europeu chegam a **~11,4** (StatPair). **Não use 9,54 para construir o μ de um jogo de Premier League — isso subestima a linha.** Trate 9,54 como **piso global**, não como média das ligas que você de fato negocia.

### Margem (overround / juice)

- Escanteios são **mercado secundário/de baixa liquidez**. A margem é tipicamente **maior** que no mercado 1X2/Asian Handicap de gols.
- Referência geral de margem em futebol: **~2-3% em casas sharp (Pinnacle, SBO)** em mercados principais, subindo para **8-12%+** em casas recreativas e em mercados de nicho como cantos.
- **A margem escala com o exotismo do mercado de canto.** Quanto mais exótica a aposta, maior o "imposto":

| Tipo de mercado de canto | Margem de referência |
|---|---|
| Total O/U / Asiático (linha principal) | ~5–10% |
| Team corners, handicap | ~8–12% |
| Marcador do 1º gol (comparação não-canto) | ~20–40% |
| **Specials de janela / cantos por meio-tempo** | **>50%** |

- O formato **asiático (quarter lines)** existe justamente para apertar a margem e oferecer push — costuma ter overround menor que o O/U binário equivalente da mesma casa.
- **Limites baixos** acompanham a baixa liquidez: a casa protege-se da exposição com stakes máximos menores e margem inflada.

### Movimento de linha

- A linha sobe quando informação aponta jogo aberto/pressão (escalações ofensivas, clima de ataque, mando forte) e quando entra dinheiro sharp no Over.
- **Cantos correlacionam com o total de gols esperado e com a supremacia do mandante** — quando o mercado de gols/handicap move, a linha de cantos costuma mover junto (sinal para antecipar).
- Em **pré-jogo tardio**, escalações confirmadas (titular cruzador dentro/fora, ponta-de-lança fixa vs móvel) movem a linha de cantos por equipe.

---

## 4. Correlações com o jogo (o coração do dossiê)

Cada linha abaixo diz **qual característica** puxa o mercado e **em que direção**.

### Estilo de jogo (o driver dominante)

| Característica | Efeito nos cantos | Direção |
|---|---|---|
| Ataque com **largura + cruzamentos** (City, Liverpool, Bayern como arquétipos) | gera muitos cantos | **PUXA PRA CIMA** |
| **Posse no campo de ataque** sustentada | mais entradas no terço final → mais cantos | CIMA |
| **Contra-ataque / transição rápida** | finaliza sem cercar; menos cantos | **PUXA PRA BAIXO** |
| **Bloco baixo defensivo** que corta cruzamento pra linha de fundo | **CONCEDE** cantos | CIMA (para o atacante) |
| **Bloco baixo que bloqueia chutes** | bloqueio frequentemente vira canto | CIMA |
| Jogo **direto/aéreo low-build** (chutão, segunda bola) | menos posse no terço final | BAIXO |

### Mando, favoritismo e mismatch

- **Mando de campo:** equipe da casa ganha em média **~+1 canto** (faixa **+0,9 a +1,1** por liga; ex.: PL 2020/21 = 5,54 casa vs 4,61 fora = +0,93; outra fonte 5,7 vs 4,7 = +1,0). → favorece **Team Corners Over do mandante** e **handicap a favor do mandante**.
- **O favorito domina a contagem de cantos MAIS do que domina o placar.** Verificado nas 5 temporadas da Premier League 2016/17–2020/21: em **1.208 de 1.900 jogos (63,6%)** o favorito teve **mais cantos**, contra apenas **55,6%** de **vitórias** do favorito no placar. → o favorito vence a contagem em **~63%** dos jogos.
- **Mismatch grande (favorito forte vs bloco baixo):** o cenário clássico de **muitos cantos do favorito**. O underdog defende e o favorito cerca → Team Corners Over do favorito + handicap favorito.
- **Dois times de posse equilibrados e cautelosos:** jogo "xadrez", poucos cruzamentos → tende ao **Under** apesar de bons times.

> **Insight de valor (decorre da assimetria acima):** como o favorito **vence os cantos com mais frequência (63,6%) do que vence o jogo (55,6%)**, o **domínio de cantos é mais previsível que o domínio no placar**. Por isso **handicap de escanteios** e **Team Corners do favorito** tendem a ter **melhor expected value** do que apostar no favorito no 1X2 — você está negociando uma assimetria mais estável e menos sujeita à variância de um único gol.

### Ritmo, motivação e contexto

- **Jogo aberto / mata-matas decisivos no fim:** desespero → enxurrada de cruzamentos → CIMA, sobretudo no 2º tempo.
- **Equipe correndo atrás do placar (chasing):** joga bolas na área "a qualquer custo" → cluster de cantos tardios → CIMA.
- **Final de temporada / luta contra rebaixamento em casa:** esforço ofensivo extra → CIMA.
- **Jogo "morto" (sem motivação, decisão já encaminhada):** ritmo cai → BAIXO.
- **Rivalidade/derby travado e nervoso:** muitas faltas, pouca fluidez ofensiva → frequentemente BAIXO (cuidado com a narrativa de "jogo quente = muitos cantos", nem sempre).

### Árbitro, clima e campo

- **Árbitro:** influência menos documentada que em cartões, mas árbitros que deixam o jogo correr (menos faltas, mais continuidade) tendem a permitir mais sequências ofensivas → leve CIMA. (Confiança baixa — ver gaps.)
- **Clima/campo:** campo pesado/molhado e vento → bolas que escapam para a linha de fundo, defesas afobadas cortando para escanteio → leve CIMA. Calor extremo → ritmo cai no 2º tempo → leve BAIXO.

### Qualidade defensiva/ofensiva

- **Defesa que limpa cruzamentos para fora vs para fundo:** zagueiros que cabeceiam para a linha de fundo **inflam** o número de cantos concedidos. Ler perfil defensivo, não só "gols sofridos".
- **Ataque que finaliza muito mas de longe / chutes bloqueados:** chute bloqueado por defensor vira canto → a correlação cantos↔chutes **existe mas é modesta**. (Atenção: o intervalo numérico `r ~0,10–0,17` aparece em estudo específico e **não foi reconfirmado** nas fontes abertas — trate como ordem de grandeza, não como valor cravado. Ver §5 e §6.)

---

## 5. Indicadores preditivos e como lê-los

| Indicador | Como usar para cantos | Força do sinal |
|---|---|---|
| **Médias móveis de cantos (for/against, casa/fora)** | base do μ; pondere últimos 6-10 jogos por mando | ALTA |
| **xG / xGA + total de gols esperado** | total de gols esperado correlaciona com cantos; jogo aberto = mais cantos | MÉDIA-ALTA |
| **Supremacia/goal supremacy do mandante** | quanto mais assimétrico o jogo, mais o favorito domina a contagem | ALTA (p/ handicap e team corners) |
| **Chutes / chutes ao gol** | correlação real porém **modesta** (intervalo numérico não-verificado); use como reforço, não driver | BAIXA-MÉDIA |
| **Toques no terço final e na área, entradas no terço final** | melhores preditores de pressão/finalização do que posse pura | MÉDIA-ALTA |
| **Posse de bola crua** | fraco isoladamente (posse não diferencia resultado) — combine com largura/cruzamentos | BAIXA |
| **Cruzamentos por jogo / dependência de jogo pelas pontas** | driver direto de cantos | ALTA |
| **Escalação confirmada** (pontas, laterais ofensivos, cruzador titular) | move o μ da equipe; ausência de cruzador → BAIXO | MÉDIA-ALTA |
| **H2H** | útil só quando o *estilo* dos dois é estável; senão ruído | BAIXA-MÉDIA |
| **Perfil do adversário (bloco baixo concede cantos)** | cruze "for" do favorito com "against" do underdog | ALTA |

**Nota de cautela sobre correlações numéricas (verificada):** o que é **robustamente documentado** é que **cantos têm correlação FRACA com gols** (algumas análises apontam ~zero), enquanto **chutes ao gol↔gols é forte (~0,55)**. Ou seja: canto **não é** bom preditor direto de gol — ele é preditor de **pressão**, e pressão só às vezes vira gol. A correlação cantos↔chutes é plausível e modesta, mas o valor numérico exato citado em fontes secundárias **permanece não-verificado**; não construa o modelo em cima dele.

**Construção prática do μ:** μ_jogo ≈ (cantos_for_casa + cantos_against_visitante)/2 (lado casa) + (cantos_for_visitante + cantos_against_casa)/2 (lado fora), ajustado por mando (**~+1 canto**, faixa +0,9 a +1,1) e por total de gols esperado. **Ancore o baseline na média da LIGA negociada** (PL ~10–11,8; top-5 ~11,4), **não** nos 9,54 globais. Depois aplique **binomial negativa / Poisson composta** (não Poisson simples) para extrair P(Over linha).

---

## 6. Armadilhas comuns (traps)

1. **Achar que cantos seguem Poisson.** Poisson superestima as duas caudas (0-6 e 13-22) e subestima o miolo 7-12. Quem precifica com Poisson erra sistematicamente justamente onde estão as linhas negociadas. Use binomial negativa/Poisson composta.
2. **Usar a média global (9,54) numa liga forte.** É piso multi-liga; subestima a linha de PL/top-5 (que ficam ~10–11,8). Sempre ancore o μ na liga negociada.
3. **"Time bom = muitos cantos".** Falso quando o adversário também tem posse e ambos são cautelosos (jogo travado de elite → Under). E times de **contra-ataque** de elite geram poucos cantos.
4. **"Muitos chutes = muitos cantos".** Correlação modesta e com magnitude não cravada. Chute de longa distância não cercado raramente vira canto.
5. **Confundir canto com gol.** Cantos têm correlação ~zero com gols; "time que faz muito canto" não é "time que marca muito". Cantos medem approach, não conversão.
6. **Ignorar margem/limite no nicho.** Cantos têm overround mais gordo (specials de janela >50%); um "valor" de 3% some na margem de 8-10% (ou pior) de casa recreativa. Faça **line shopping** e compare com casa sharp.
7. **Narrativa de derby = cantos.** Derbys travados e faltosos podem ir Under apesar do clima.
8. **Confundir canto concedido com canto batido / re-batido** na liquidação (último escanteio, specials de janela final; retaken conta como um).
9. **Apostar Under em jogo com favorito forte vs bloco baixo** — é o setup que mais produz cantos.
10. **Mercados de nicho ilíquidos como "ineficientes".** Ligas obscuras têm odds largas mas a casa engorda a margem; valor real é mais difícil, não mais fácil.
11. **Subestimar o efeito-zero no Multicorners.** Um tempo com 0 cantos zera o produto — não é um O/U de soma; modele a covariância entre tempos.

---

## 7. Correlação entre mercados (bet builder / same game multi)

Em SGM os eventos são do **mesmo jogo** → a casa aplica **desconto de correlação** (odds combinadas abaixo da multiplicação simples). Cantos são leg muito comum para "engordar" odd.

**Combinam (correlação positiva — a casa desconta, mas a tese é coerente):**
- **Over gols + Over cantos** — jogo aberto produz os dois.
- **BTTS (ambos marcam) + Over cantos** — jogo aberto e atacante.
- **Favorito/mandante vencer + Over Team Corners do favorito** — domínio territorial produz ambos.
- **Jogador cruzador/cabeceador marcar + Over cantos** — fluxo de cruzamentos compartilhado.
- **Over chutes + Over cantos** — correlação real, ainda que modesta.

**Se contradizem (correlação negativa — cuidado, mas às vezes o boost paga):**
- **Time A vencer + Time B Over 5.5 cantos:** se B acumula cantos, geralmente está pressionando A → reduz prob. de A vencer. Negativamente correlacionado; ocasionalmente o boost do leg supera o risco estatístico (janela rara de valor).
- **Under gols + Over cantos:** possível (muitos cantos sem conversão — coerente com a correlação cantos↔gols ~zero), mas tensiona a tese de jogo fechado.
- **Time defensivo de contra-ataque vencer + Over cantos totais:** estilos brigam entre si.

**Regra prática:** monte SGM com legs que compartilham o **mesmo motor de jogo** (jogo aberto e cercado), e só pegue legs negativamente correlacionados quando o **boost** for visivelmente generoso.

---

## 8. Fontes de dados para alimentar prognósticos

- **Estatística de cantos por liga/time (for/against, casa/fora, médias):** FootyStats, StatsChecker, WinDrawWin, FCTables, APWin, Betaminic, Betfair Blog (corners stats), ScoreRoom, BetOnCorners, StatPair, CornerValue.
- **Modelagem/distribuição:** Bookie Bashing (distribuição discreta ajustada, binomial negativa), papers acadêmicos (Poisson composta / overdispersed — arXiv 2112.13001; Lund University) — ver fontes.
- **xG/xGA, chutes, toques no terço final/área, entradas no terço final:** provedores de event data; American Soccer Analysis e similares para frameworks.
- **Odds/linha e movimento:** comparadores (Oddspedia) e casa sharp (Pinnacle) como âncora de mercado justo.
- **Escalações confirmadas e contexto:** feeds de lineup pré-jogo.
- **Validação de regra de liquidação:** páginas de regras das casas (bet365 corner/Asian corner rules; Pinnacle abandono/85') antes de apostar borda.

---

## 9. Camada Live (ao vivo)

A leitura ao vivo de cantos muda mais por **estado de jogo (match state)** do que por qualquer estatística pré-jogo.

### Como cada evento move o mercado

| Evento ao vivo | Efeito nos cantos | Estratégia |
|---|---|---|
| **Gol cedo do mandante/favorito** | líder recua, **perde** seu motor de cantos; quem perde passa a atacar → cantos migram para o agora-perdedor | apostar Over Team Corners do time que está atrás |
| **Gol cedo do underdog** | favorito assume controle territorial → cantos do favorito sobem | Over Team Corners do favorito |
| **Expulsão (10 vs 11)** | efeito **ambíguo**: a equipe com vantagem numérica pode dobrar cantos nos 30 min seguintes pressionando, MAS no total muitas vezes **reduz** (10 homens defendem fundo, 11 administram posse sem forçar) | janela curta: Over do time com a mais; total do jogo: tendência Under se o jogo "morre" |
| **Placar apertado nos min 70-90** | favorito empatando/perdendo 1 gol → ataque all-out → **surto de 3, 4, 5+ cantos** em minutos | esperar até ~70-75' e pegar **Over live** com a linha ainda "atrasada" |
| **Momentum / pressão prolongada** | cantos vêm em **clusters** (um canto puxa outro) | "próximo canto"/Race live durante a onda de pressão |
| **Jogo decidido (3-0) cedo** | ritmo cai dos dois lados | Under live / evitar Over |

### Padrões temporais úteis ao vivo

- **2º tempo > 1º tempo** em cantos: técnicos sacam atacantes no intervalo quando perdem → volume sobe. Linhas de HT costumam ficar ~4.5/5.5.
- **Últimos 10-15 minutos** concentram cantos em jogos apertados — janela nobre para **Over** e para **specials de janela final** (ex.: "canto entre 81-90").
- **Cluster:** depois de 1 canto, a probabilidade do próximo no curto prazo é elevada — base dos mercados **next corner / race live** (e a razão estatística da superdispersão que vimos no §3).

### Disciplina live

- A odd de cantos live move **rápido** após eventos — entre **antes** do mercado reprecificar o novo match state (ex.: segundos após uma expulsão ou um gol que vira o jogo).
- Cuidado com **suspensão de mercado** durante a própria sequência de canto.
- Não persiga Over num jogo que claramente "morreu"; o cluster tardio só existe quando há **motivo de placar** para atacar.

---

## Resumo executivo (regras de bolso)

- Cantos = **proxy de pressão com largura e cruzamento**, não de qualidade absoluta — e **correlação ~zero com gols**.
- **Mando ~+1 canto** (faixa +0,9 a +1,1); o favorito vence a **contagem** em **~63,6%** dos jogos, **mais** do que vence o **placar** (55,6%) → **handicap/Team Corners do favorito é o ângulo de melhor EV**.
- Média de referência: **9,54 é piso GLOBAL**; ligas fortes vão a **~10–11,8** (PL) / **~11,4** (top-5). **Ancore o μ na liga negociada.**
- **Não use Poisson** — use binomial negativa / Poisson composta (clusters → superdispersão).
- Setup de Over: **favorito forte × bloco baixo, jogo aberto, mando, 2º tempo, chasing**.
- Setup de Under: **dois times cautelosos/posse equilibrada, contra-ataque, jogo morto, derby travado**.
- Margem cresce com o exotismo: **specials de janela >50%** → line shopping obrigatório.
- Live: o **match state manda**; melhor valor de Over costuma estar **min 70-90 com placar apertado**.

---

## Fontes

- Pinnacle Odds Dropper — What is Asian Corner betting (+ How it works in football): https://www.pinnacleoddsdropper.com/blog/asian-corners
- The Punters Page — Asian Corners Explained (Full Betting Guide): https://www.thepunterspage.com/asian-corners-betting-explained/
- bet365 Help Center — Corners (settlement rules): https://help.bet365.com/s/en/sportsrules/soccer/corner-markets
- bet365 Help Center — Asian Corners (Soccer Rules): https://help.bet365.com/s/en/sportsrules/soccer/asian-corners
- bet365 Help Center — Asian Corners (US, settlement quarter line/push/handicap): https://help.bet365.com/s/en-us/sportsrules/soccer/asian-corners
- Pinnacle Betting Resources — Corners betting strategy: https://www.pinnacle.com/betting-resources/en/soccer/corners-betting/jx22qspl6r6gkbf7
- Bookie Bashing — A discrete model for predicting corners (9,54 média, 907 ligas, Poisson super/subestima caudas vs miolo): https://www.bookiebashing.net/2019/09/19/a-discrete-model-for-predicting-corners/
- Bookie Bashing — Corners: A probability distribution (hub): https://www.bookiebashing.net/hub/sports-strategies/corners/
- Lund University — Forecasting football corner odds: statistical modelling, betting strategies: https://lup.lub.lu.se/student-papers/record/9127007/file/9127013.pdf
- arXiv 2112.13001 — Forecasting number of corner kicks using overdispersed/compound Poisson distribution: https://arxiv.org/pdf/2112.13001
- StatPair — Corner Betting: 11.4 Average Corners Per Match (média por liga top-5, mando): https://statpair.com/blog/corner-betting-analysis-statistical-breakdown
- StatPair — Total Corners Betting: Team Corner Statistics & Over/Under Strategy (favorito 63,6% mais cantos vs 55,6% vitória, PL 2016-21): https://statpair.com/blog/total-corners-betting-team-statistics
- StatsChecker — Premier League Corners Stats With Totals & Averages: https://www.statschecker.com/stats/corners-per-game/premier-league-corner-stats
- CornerValue — Average Corners Per Match Premier League 2025/2026 (~9,97 média atual): https://www.cornervalue.com/post/average-corners-per-match-in-premier-league-2025-2026
- FootballPredictions.com — Corner Betting Tips & How to Predict Corners: https://footballpredictions.com/betting-tips/corners/
- On The Ball Bets — First & Last Match Corners Betting Market Explained: https://www.ontheballbets.com/betting-guides/football/betting-markets/corners/first-last-match-corners/
- On The Ball Bets — Asian Handicap Corners Betting Market Explained: https://www.ontheballbets.com/betting-guides/football/betting-markets/asian-handicap-corners/
- On The Ball Bets — Multicorners Betting Market Explained: https://www.ontheballbets.com/betting-guides/football/betting-markets/corners/multicorners/
- William Hill — Football Rules: Multi Match — 1st Half x 2nd Half Corners 3 Way: https://williamhill-lang.custhelp.com/app/answers/detail/a_id/13053/~/football-rules:-multi-match---1st-half-x-2nd-half-corners-3-way
- Oddspedia — Betting on Corners Explained: https://oddspedia.com/us/betting/types/corners-betting
- Pinnacle Odds Dropper — Bookmaker Margins / Overround Explained: https://www.pinnacleoddsdropper.com/blog/overround
- UNC Charlotte — An Econometric Analysis of the Relationship Between Corner Kicks and Match Outcomes: https://ninercommons.charlotte.edu/record/504/files/Ashimolowo_uncc_0694N_11959.pdf
- Footy Amigo — Correlated Stats Matter: Bet Builder Strategy: https://footyamigo.com/correlated-stats-matter-why-your-bet-builder-strategy-isnt-working-and-how-to-use-data-to-fix-it/
- SportyTrader — How To Bet On Corner Kicks: https://www.sportytrader.com/us/sports-betting/guide/how-to-bet-corner-kicks/
- Stefan Leanie (Medium) — Football data analytics: Does corners really matter (cantos ~sem correlação com gols; chutes ao gol r=0,55): https://medium.com/@stefanleanie/football-data-analytics-does-corners-really-matter-and-other-in-match-stories-33f00e04af99
