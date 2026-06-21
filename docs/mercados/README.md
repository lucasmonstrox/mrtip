# Mercados de Apostas de Futebol

Esta é a base de conhecimento de **mercados de apostas de futebol masculino** do projeto: um conjunto de dossiês neutros e globais (sem viés de liga específica) que descrevem, para cada família de mercado, como ela é **definida e liquidada**, como a **odd/margem se forma**, onde mora o **valor (EV+)**, quais **características do jogo** a movem (o "coração" de cada dossiê), os **indicadores preditivos**, as **armadilhas (traps)**, a **correlação entre mercados** (bet builder / same game multi) e uma **camada ao vivo (live)**. Cada arquivo termina com as **fontes** (primárias e secundárias) que sustentam os números.

## Como navegar

- **Comece pela camada fundacional** ([`contexto-motivacao-fatores.md`](./contexto-motivacao-fatores.md)) se quer entender os fatores situacionais — motivação, calendário, clima, árbitro, mando/altitude — que atuam por trás de *todos* os mercados.
- **Vá direto ao mercado** que te interessa pela lista abaixo, agrupada por família.
- **Para montar bilhetes combinados** ou entender como os mercados se relacionam, leia a síntese [`correlacoes-cruzadas.md`](./correlacoes-cruzadas.md), que costura todos os dossiês nos três eixos **SG (supremacia)**, **T (total de gols)** e **atrito/território**.
- Todo dossiê segue a mesma espinha (definição → margem → tips → correlações com o jogo → indicadores → traps → correlação entre mercados → fontes → live), então é fácil pular para a seção que você precisa.
- O fio condutor matemático de quase tudo é a decomposição em **SG** (gols esperados do mandante − do visitante) e **T** (soma dos gols esperados), modelados via **Poisson / Dixon-Coles**.

## Arquivos por família

### Camada fundacional (contexto)

- [`contexto-motivacao-fatores.md`](./contexto-motivacao-fatores.md) — fatores situacionais (motivação, estilo tático, árbitro, clima/vento, calendário/cansaço, mando/altitude/viagem, viés psicológico) como variáveis explicativas por trás de todos os mercados, separando mecanismo plausível de edge comprovado.

### Resultado e supremacia (eixo SG)

- [`resultado-1x2.md`](./resultado-1x2.md) — o mercado 1X2 (mandante/empate/visitante) e seus derivados imediatos (Dupla Chance, Draw No Bet, AH 0), com foco em favoritismo, o empate como aposta e o peso do mando de campo.
- [`handicap-asiatico.md`](./handicap-asiatico.md) — Handicap Asiático: linhas inteiras, meias e quartos, o split de stake (half-win/half-loss), push, e a equivalência matemática com Over/Under via supremacia + total.
- [`handicap-europeu.md`](./handicap-europeu.md) — Handicap Europeu 3-way (gols inteiros, Empate-Handicap, sem push), com comparação detalhada contra o Asiático e o efeito em múltiplas.
- [`derivados-resultado.md`](./derivados-resultado.md) — derivados do resultado: Dupla Chance, DNB, Intervalo-Final (HT/FT), Margem de Vitória, Corrida a X Gols e Resultado + Ambas Marcam, todos como transformações da matriz de placar.

### Gols e total (eixo T)

- [`over-under-gols.md`](./over-under-gols.md) — Over/Under de gols: total, totais asiáticos, total por equipe, total por tempo, total exato e Par/Ímpar, com o motor Poisson + Dixon-Coles e as quarter lines.
- [`ambas-marcam-btts.md`](./ambas-marcam-btts.md) — Ambas Marcam (BTTS Sim/Não), Clean Sheet, BTTS por tempo e combinados, com foco na tensão entre solidez defensiva e estilo ofensivo.
- [`placar-exato-scorecast.md`](./placar-exato-scorecast.md) — Placar Exato (Correct Score), placar de 1º tempo, Scorecast, Wincast e Timecast, com a distribuição conjunta de gols e o overround altíssimo desses mercados.
- [`parciais-tempo.md`](./parciais-tempo.md) — mercados de recorte temporal (1º/2º tempo, janelas de 15 min, momento do 1º gol, qual metade tem mais gols, gol antes de X minutos) ancorados na distribuição temporal de gols.

### Atrito e território (eventos do jogo)

- [`escanteios.md`](./escanteios.md) — toda a família de escanteios (total O/U, asiático, por equipe, handicap, Most Corners, Race, Multicorners) como proxy de pressão ofensiva com largura, com distribuição binomial negativa/Poisson composta.
- [`cartoes.md`](./cartoes.md) — cartões (total, asiático, booking points, por equipe, handicap, vermelho sim/não, props), com os dois sistemas de contagem e o árbitro como driver número 1.
- [`penalti-expulsao-eventos.md`](./penalti-expulsao-eventos.md) — eventos discretos: pênalti no jogo, score/miss, expulsão/vermelho, gol contra, método de gol, substituições e disputa de pênaltis, com frequências de base e regras de liquidação de borda.

### Jogadores e combinados

- [`jogadores-props.md`](./jogadores-props.md) — props individuais (marcador, 2+/hat-trick, chutes, chutes ao gol, assistências, desarmes, faltas, passes, cartões), distinguindo mercados de evento raro de mercados de volume e usando definições Opta.
- [`especiais-betbuilder.md`](./especiais-betbuilder.md) — Bet Builder / Same Game Multi e especiais de placar/método (vencer/marcar nos dois tempos, virar o jogo, gol de fora da área, método do gol), com a mecânica de correlação e margem composta.

### Síntese transversal

- [`correlacoes-cruzadas.md`](./correlacoes-cruzadas.md) — costura todos os dossiês: como os mercados se relacionam nos três eixos (SG, T, atrito), as cadeias causais (fator de jogo → pacote de mercados), a matriz de correlação para bet builder e doze cenários de jogo arquetípicos com o pacote de mercados de valor.

## Mapa rápido: mercado → principais drivers do jogo

| Mercado / família | Principais drivers do jogo |
|---|---|
| **Resultado (1X2)** | Mando de campo; mismatch de qualidade (xG diff); times parelhos e baixo placar → empate; motivação/contexto; árbitro caseiro |
| **Handicap Asiático** | Supremacia esperada (SG = xG diff); mando (~+0,3–0,4 gol); total esperado (define qual linha); clima/cansaço comprimem a margem |
| **Handicap Europeu (3-way)** | Margem de gols esperada; assimetria ataque-favorito × defesa-azarão; jogos travados → Empate-HC; motivação de golear → -2/-3 |
| **Derivados de Resultado** | Diferencial de força (DC/DNB); ritmo do 1º vs 2º tempo (HT/FT); xG-diff e xGA (Margem); ataque forte + defesa vazada (Result+BTTS) |
| **Over/Under de Gols** | xG + xGA dos dois lados; estilo (linha alta vs bloco baixo); clima (vento); árbitro que fragmenta; calendário/cansaço |
| **Ambas Marcam (BTTS)** | Dois ataques competentes × duas defesas vulneráveis; assimetria (favorito goleia a zero → BTTS Não); transições e linha alta; clean sheet |
| **Placar Exato / Scorecast** | λ total (regulador-mestre); mando (assimetria da matriz); estilo (bloco baixo → placares magros); hierarquia de marcador (scorecast) |
| **Parciais e de Tempo** | Distribuição temporal de gols (~44/56 1º/2º tempo); pressing → gol cedo; fadiga/substituições → gols tardios; 0–0 ao HT → ~74–75% gol no 2º tempo |
| **Escanteios** | Estilo (largura + cruzamentos vs contra-ataque); favorito domina contagem (~63,6%); mando (~+1 canto); chasing tardio; bloco baixo concede |
| **Cartões** | Árbitro (driver nº1); estilo (posse inversa a faltas); viés casa/fora (visitante leva mais); derby/decisão; faltas como driver mecânico |
| **Pênalti / Expulsão / Eventos** | VAR (pênalti); derby/decisão + árbitro + timing (vermelho); escanteios/bola parada e altura (cabeça); equilíbrio (ir aos pênaltis) |
| **Props de Jogadores** | Estilo e papel tático (volume); xG/xA individual e role-change (gol/assistência); árbitro (faltas/cartões); escalação/minutos; adversário |
| **Especiais / Bet Builder** | Correlação entre legs do mesmo jogo; favorito dominante + ataque consistente (especiais); árbitro/contexto (legs de cartão); cópula + margem composta |
| **Correlações Cruzadas** | Os três eixos SG, T e atrito/território; o fator de contexto que empurra cada cluster; supremacia × total acoplados; vermelho move todos os eixos |

---

README indexado em `c:/Users/joaog/Workspace/monstrox/mrtip/docs/mercados/README.md` — 15 arquivos `.md` indexados (14 dossiês de mercado + a síntese de correlações cruzadas).
