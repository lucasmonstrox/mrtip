# Investigação — Game-state e timing de gols (SIN-017)

> **Tema:** quando e por que os gols acontecem dentro dos 90+ min, e como o **estado do jogo** (placar corrente, homens em campo) altera a taxa de gols. É o **driver comportamental** por trás dos mercados de over/under, parciais por tempo, gols tardios e AO VIVO — não o mercado em si.
> **As-of:** 2026-06-21. Fontes externas verificadas por FETCH (URL + data); claims atômicos com veredito.
> **Decisão-mãe que manda aqui:** [taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) — três camadas (ESTIMAR / EXPLICAR / VALIDAR) + anti-dupla-contagem + endogeneidade.

---

## 1. TL;DR + recomendação cravada

**Game-state e timing de gols é majoritariamente EXPLICAR + um condicionamento estrutural já-existente no motor; quase nada vira sinal ESTIMAR autônomo (pré-jogo).**

Três achados são SUPPORTED e robustos:
1. **A taxa de gols é não-homogênea no tempo** — sobe de forma não-linear rumo ao fim de cada metade, com dip no início de cada metade e pico nos acréscimos (arXiv 2501.18606, 3.433 jogos). Isso é **parâmetro de calibração do MOD-001** (λ(t) por minuto/janela), não um edge.
2. **Score effects são reais** — time que lidera **suprime a própria produção ofensiva**; time atrás **ataca mais** (mas converte pouco). Goal-differential é um **modificador de contexto da geração de chances** (arXiv 2508.04008; Lago-Peñas 2014). Mas é **endógeno**: o time forte é quem lidera e fecha — **isso já está na odd pré-jogo**.
3. **Expulsão muda a intensidade**, com efeito **proporcional ao tempo restante** e **assimétrico por força** (WC 1998-2014: não-expulso +124%, expulso −47%; ponto de virada ~intervalo). Também **endógeno**: time que está perdendo leva ~75% mais cartão por gol de desvantagem.

**Recomendação:**
- **ESTIMAR (pré-jogo):** **NADA novo vira feature de probabilidade autônoma** a partir deste tema. O único item com cara de ESTIMAR — λ(t) não-homogêneo dividido por tempo (λ₁/λ₂) — **já é responsabilidade declarada do MOD-001** (processo não-estacionário; ver mercados). SIN-017 não cria um motor paralelo; **encomenda a especificação de λ(t) e dos modificadores de game-state como condicionamento do MOD-001 na camada LIVE**.
- **ESTIMAR (live/condicional):** o lugar onde game-state vira probabilidade de verdade é **AO VIVO** — λ(t | placar, homens em campo, minuto). Mas o mrtip MVP **não tem produto live** declarado, e a literatura mostra que o evento óbvio (gol, vermelho) **é precificado em segundos**. Logo: **registrar como capacidade futura do motor live, fora do MVP**, não como sinal pré-jogo.
- **EXPLICAR:** o grosso vira **narrativa do dossiê** — "favorito que abre cedo tende a controlar e fechar", "0-0 ao HT com xG alto = gol represado no 2º tempo", "expulsão cedo no time que perde abre o jogo". Tudo **ancorado no número do motor, sem mover a probabilidade**.
- **VALIDAR:** qualquer pretensão de edge pré-jogo aqui passa pela CLV (SIN-012) — e a expectativa honesta é que **não sobreviva** (já precificado).

---

## 2. Contexto e problema (+ requisitos implícitos)

O catálogo de mercados do mrtip **já cobre densamente** a fenomenologia: a distribuição temporal de gols, o split 1º/2º tempo (~44/56), o efeito de expulsão modulado pelo tempo, e a camada live de score effects estão escritos em [parciais-tempo.md](../mercados/parciais-tempo.md), [over-under-gols.md](../mercados/over-under-gols.md) e [derivados-resultado.md](../mercados/derivados-resultado.md). O **gap** que SIN-017 nomeia não é "descobrir que o 2º tempo tem mais gols" — é decidir **o que disso o motor (MOD-001) condiciona quantitativamente** vs **o que o assistente apenas narra**, sem dupla-contagem com força do time e sem inventar edge onde a odd já precifica.

**Requisitos implícitos:**
- **Não duplicar o MOD-001.** O motor já se compromete com Dixon-Coles + processo de Poisson não-homogêneo (λ(t)). SIN-017 não é um segundo motor; é o sinal que **especifica** o componente temporal/game-state e marca quem o possui.
- **Separar pré-jogo de live.** Game-state só existe quando o jogo já começou. O que cabe pré-jogo é a *forma da curva* λ(t) e os *priors* de score effect; o resto é live.
- **Tratar endogeneidade como o risco nº1** (taxonomia §"anti-dupla-contagem"): times fortes lideram e fecham → o "efeito game-state" pré-jogo já está embutido no λ que o modelo de força produz e na odd de fechamento.
- **Regulação (Lei 14.790/2023):** nada de promessa de ganho; narrativa de timing/gol tardio é informacional, não incitação.

---

## 3. Estado real no repo (o que já existe, com path:linha)

O tema **não tem código** (repo é majoritariamente docs; `MOD-001` ainda é `investigado`, sem schema implementado). Mas está **fartamente documentado** — re-pesquisar seria desperdício. Mapa do que já está decidido:

**Distribuição temporal (já escrita, com fonte primária):**
- Split macro 1º/2º tempo ~44/56% e suas causas (fadiga, substituições, chasing): [parciais-tempo.md:18-27](../mercados/parciais-tempo.md).
- Curva não-homogênea, dip no início de cada metade, pico 81-90 (~18,8%), citando **arXiv 2501.18606 como referência metodológica**: [parciais-tempo.md:55-72](../mercados/parciais-tempo.md).
- Aviso de escala 10 min vs 15 min (não misturar): [parciais-tempo.md:44, 218](../mercados/parciais-tempo.md).
- "0-0 ao HT → ~74-75% de gol no 2º tempo" (6.078 jogos): [parciais-tempo.md:70-72](../mercados/parciais-tempo.md).

**Score effects (já escrito como correlação/live):**
- Gol cedo do favorito pode "matar o jogo" (controle → Under) vs azarão na frente senta: [over-under-gols.md:290-293](../mercados/over-under-gols.md).
- "Time forte = muitos gols" é trap — superior controla defensivamente: [over-under-gols.md:248](../mercados/over-under-gols.md).
- Score effect como driver de HT/FT (X/1, X/2 porque 2º tempo concentra gols): [derivados-resultado.md:177, 212](../mercados/derivados-resultado.md).
- Filtro de ouro live: evento óbvio (gol/vermelho) já precificado; EV mora em momentum **sem** gatilho: [over-under-gols.md:306-307](../mercados/over-under-gols.md).

**Expulsão (já escrito, com modulação temporal):**
- Efeito proporcional ao tempo restante, ~1,45 (Taylor) a ~1,8 gol (full match), ponto de virada ~intervalo, ~64% da mudança vem do time de 11 marcando mais, mandante expulso ~1,2 gol pior: [parciais-tempo.md:275-278](../mercados/parciais-tempo.md).
- Faixas agregadas RunRepeat (19.985 jogos): time com vermelho perde ~55-59%: [derivados-resultado.md:366](../mercados/derivados-resultado.md).

**O motor (MOD-001):**
- Já assume **Dixon-Coles time-weighted → grid de placar → 1X2 + O/U 2.5**, com λ por mando: [MOD-001:32, 36-37](../features/modelos/MOD-001-motor-prognostico-quant.md).
- **CLV/bater closing = experimento, não barra de sucesso do MVP**: [MOD-001:38](../features/modelos/MOD-001-motor-prognostico-quant.md).
- O processo **não-homogêneo de λ(t)** já é descrito como o que "modelos modernos usam": [parciais-tempo.md:118, 256](../mercados/parciais-tempo.md).

**Precedente de método (irmã SIN-015):** perfil tático foi **EXPLICAR** porque ineficiências pré-jogo **não persistem** (Winkelmann 2024) e o contra-ataque já está precificado: [SIN-015:9, 49](../features/sinais/SIN-015-perfil-tatico-transicoes.md). SIN-017 herda exatamente essa lógica de refutação.

**Gaps reais (o que SIN-017 fecha):**
1. Ninguém **cravou a posse** de λ(t)/game-state: é MOD-001 (motor) ou um sinal? → Resposta desta investigação: **MOD-001 possui o quant; SIN-017 é o EXPLICAR + a especificação que MOD-001 implementa**.
2. Falta o **schema de eventos por minuto** que alimentaria qualquer λ(t) ou camada live.
3. Falta dizer explicitamente que **game-state pré-jogo não é ESTIMAR autônomo** (endogeneidade) — para não nascer um sinal duplicando força do time.

---

## 4. Estado da arte — claims atômicos verificados

Escada de fontes respeitada (papers > blog técnico sério > trade press; listicle/tip channel banidos). Veredito por claim.

### 4.1 Distribuição temporal de gols (não-homogeneidade)

| # | Claim atômico | Veredito | Fonte (URL) | Confiança | As-of |
|---|---|---|---|---|---|
| D1 | A probabilidade de gol **sobe à medida que o jogo avança** (não é processo estacionário); correlação positiva minuto×gols (r≈0,438, p≈7,1×10⁻⁶), em 3.433 jogos / 21 ligas | **SUPPORTED** | [arXiv 2501.18606](https://arxiv.org/html/2501.18606v1) (FETCH) | Alta (paper + dataset grande) | 2026-06-21 |
| D2 | Há **menos gols que o esperado nos minutos iniciais de cada metade**; dip claro em 45-50 (intervalo) | **SUPPORTED** | [arXiv 2501.18606](https://arxiv.org/html/2501.18606v1) (FETCH) | Alta | 2026-06-21 |
| D3 | **Bursty scoring**: o mesmo time que marcou tende a marcar de novo logo em seguida (mais que o adversário, em todas as janelas); tempos entre gols decaem exponencialmente | **SUPPORTED** | [arXiv 2501.18606](https://arxiv.org/html/2501.18606v1) (FETCH) | Alta | 2026-06-21 |
| D4 | Os **últimos ~10 min são o decil mais cheio** (~19% dos gols); janela 41-50 é a 2ª maior (~12,2%) | **SUPPORTED** | [StatsUltra](https://statsultra.com/when-are-most-goals-scored-football/) (FETCH via WebSearch) | Média (agregador; coerente com D1/D2 e com o repo) | 2026-06-21 |
| D5 | Causas do viés do 2º tempo: fadiga + substituições + chasing; taxa sobe ~0,175 gol/90 no 2º tempo | **SUPPORTED** | [StatsUltra](https://statsultra.com/when-are-most-goals-scored-football/), [Wharton WSB](https://wsb.wharton.upenn.edu/optimal-substitution-time/) | Média (mecanismo bem estabelecido) | 2026-06-21 |

> **Implicação:** D1-D3 são **calibração do motor** (λ(t), e potencialmente um termo de "momentum/bursty" no live), não edge. D3 (bursty) é interessante mas **é fenômeno live** e provavelmente já precificado quando há gol.

### 4.2 Score effects (efeito do placar corrente sobre a taxa de gols)

| # | Claim atômico | Veredito | Fonte (URL) | Confiança | As-of |
|---|---|---|---|---|---|
| S1 | **Time que lidera reduz posse e intensidade**; time que perde tem mais posse (corre atrás). Prob. de chegar à score-box cai **43% empatando** e **53% liderando** vs perdendo (908 posses, time espanhol 2009-10) | **SUPPORTED** | [Lago-Ballesteros & Lago-Peñas 2011, PubMed 22856388](https://pubmed.ncbi.nlm.nih.gov/22856388/) (score-box 43%/53%); [Lago-Peñas & Gómez-López 2014, SAGE](https://journals.sagepub.com/doi/abs/10.2466/23.27.PMS.119c32z1) (influência do placar) | Alta (literatura clássica de score effects) | 2026-06-21 |
| S2 | Goal-differential é um **modificador de contexto da geração de chances** (block-level): líder **suprime a própria produção ofensiva**, perdedor **gera mais**; efeito **mais íngreme na Serie A** | **SUPPORTED** | [arXiv 2508.04008](https://arxiv.org/pdf/2508.04008) (FETCH) | Alta (paper minuto-a-minuto, GAM) | 2026-06-21 |
| S3 | Times perdendo **atacam mais mas convertem pouco** (subdesempenho em chutes bloqueados/escanteios do líder) | **SUPPORTED** | [arXiv 2508.04008](https://arxiv.org/pdf/2508.04008); corroborado por S1 | Média-alta | 2026-06-21 |
| S4 | **Estilo de jogo (posse vs contra-ataque) quase não move gols reais**: xG levemente a favor de posse (R²=0,13, p<0,01), mas **gols reais não-significativos (p=0,14)** e pontos não-significativos (p=0,36) | **SUPPORTED** | [Frontiers 2023, fpsyg.2023.1197039](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1197039/full) (FETCH) | Alta | 2026-06-21 |
| S5 | Score effects pré-jogo são **endógenos** (time forte lidera/fecha) e **já precificados**: ineficiências táticas pré-jogo não persistem sistematicamente | **SUPPORTED** | [Winkelmann et al. 2024](https://journals.sagepub.com/doi/10.1177/15270025231204997) (via SIN-015); reforça [taxonomia §anti-dupla-contagem](../arquitetura/taxonomia-sinais.md) | Alta | 2026-06-21 |

> **Implicação:** S1-S3 confirmam que game-state **muda o processo de gols** — mas é um efeito **condicional ao placar corrente** (live), e S5 mata o pré-jogo (endógeno/precificado). S4 é munição de counter-review: nem o estilo persistente move gols o bastante; menos ainda um "tema de game-state" genérico.

### 4.3 Efeito de cartão vermelho / expulsão

| # | Claim atômico | Veredito | Fonte (URL) | Confiança | As-of |
|---|---|---|---|---|---|
| R1 | Após expulsão (WC 1998-2014, 320 jogos / 94 vermelhos): **time não-sancionado +~124%** na taxa de gols; **time sancionado −~47%** | **SUPPORTED** | [Springer, Empirical Economics 2017](https://link.springer.com/article/10.1007/s00181-017-1287-5) (FETCH) | Alta (paper, hazard model) | 2026-06-21 |
| R2 | **O timing importa**: efeito proporcional ao tempo restante; **ponto de virada ~intervalo** — expulsão tardia move pouco. Sem suporte ao mito "dez jogam melhor" | **SUPPORTED** | [Springer 2017](https://link.springer.com/article/10.1007/s00181-017-1287-5); [Vecer et al. 2009](https://www.degruyter.com/document/doi/10.2202/1559-0410.1146/html) | Alta (2 fontes independentes) | 2026-06-21 |
| R3 | **Efeito médio em gols** ~1,45 (Mark Taylor) a ~1,8 gol (full match, expulsão no início) — **teto para expulsão cedo** | **SUPPORTED** (com cautela: número exato varia por estudo) | repo [parciais-tempo.md:275](../mercados/parciais-tempo.md) cruzando Taylor + WC | Média | 2026-06-21 |
| R4 | **Assimetria por força**: vermelho no **time forte → menos gols** no total; no **time fraco → pode aumentar** o total | **SUPPORTED** | [Vecer et al. 2009](https://www.degruyter.com/document/doi/10.2202/1559-0410.1146/html) (via WebSearch) | Média-alta | 2026-06-21 |
| R5 | **ENDOGENEIDADE**: o time que **está perdendo leva mais cartão** — prob. de vermelho cai ~75% por gol de vantagem. Logo o "efeito do vermelho" se confunde com "quem já ia mal" | **SUPPORTED** | [Springer 2017](https://link.springer.com/article/10.1007/s00181-017-1287-5) (FETCH) | Alta | 2026-06-21 |
| R6 | **Mandante é penalizado desproporcionalmente** com um a menos (~0,86 ponto/jogo de déficit; mandantes vencem muito mais raramente) | **SUPPORTED** | [RunRepeat, 19.985 jogos](https://runrepeat.com/red-card-study) (via repo) | Média-alta | 2026-06-21 |

> **Implicação:** expulsão é **o** evento de game-state com maior impacto no λ. Mas é (a) **live** (não pré-jogo previsível — a não ser via SIN-009/árbitro), (b) **modulado pelo tempo**, (c) **assimétrico por força**, (d) **endógeno** (R5) e (e) **precificado em segundos** (repo: filtro de ouro). Vira **EXPLICAR/condicionamento live**, não ESTIMAR pré-jogo. *Cartões pré-jogo já têm dono: SIN-009 (árbitro escalado).*

---

## 5. ESTIMAR vs EXPLICAR — matriz, recomendação, counter-review

### 5.1 Matriz de classificação

| Item do tema | Classe | Onde vive | Por quê |
|---|---|---|---|
| **λ(t) não-homogêneo** (forma da curva, λ₁/λ₂ por tempo, pico fim-de-metade, dip pós-intervalo) | **ESTIMAR** (mas **já é do MOD-001**) | MOD-001 (motor), spec encomendada por SIN-017 | Parâmetro de calibração para mercados de parcial/tempo; não é edge, é precisão. D1-D2 SUPPORTED. |
| **Modificador de game-state no λ live** (goal-diff, homens em campo, minuto) | **ESTIMAR live (fora do MVP)** | Motor live futuro | S2/R1 SUPPORTED, mas exige produto live + dado minuto-a-minuto; e evento óbvio já precificado. |
| **Bursty / momentum same-team** (D3) | **EXPLICAR** (talvez termo live experimental) | Narrativa live; backlog do motor | Fenômeno live; provavelmente já na odd pós-gol. |
| **Score effect pré-jogo** ("forte abre e fecha → Under") | **EXPLICAR** | Dossiê/narrativa | Endógeno (S5) + já precificado; **dupla-contagem com força do time**. |
| **Efeito de expulsão** (R1-R6) | **EXPLICAR + condicionamento live** | Narrativa + motor live | Live, modulado por tempo/força, endógeno (R5), precificado em segundos. Cartão *pré-jogo* é de SIN-009. |
| **"0-0 ao HT com xG alto = gol represado"** | **EXPLICAR** (ângulo live) | Narrativa live | Já documentado como ângulo (cegueira de placar); não muda probabilidade pré-jogo. |
| **Estilo de jogo → gols** | **DESCARTAR como ESTIMAR** | — | S4: gols reais não-significativos. Já é EXPLICAR via SIN-015. |

### 5.2 Recomendação

1. **SIN-017 não cria motor nem sinal de probabilidade pré-jogo.** Ele **encomenda ao MOD-001** a especificação do componente temporal λ(t) (não-homogêneo, λ₁/λ₂) — que o próprio MOD-001 já assume — e **declara a posse**: o quant temporal é do motor; SIN-017 é o EXPLICAR.
2. **SIN-017 = a camada EXPLICAR de game-state/timing**: vocabulário e regras narrativas que o assistente usa pra justificar picks de O/U, parciais e gols tardios, **ancorado no número do motor, peso ZERO no quant** (igual SIN-015).
3. **Modificador de game-state no λ + camada live** entram como **capacidade futura do motor live** (backlog), fora do MVP, porque (a) não há produto live declarado e (b) o evento óbvio é precificado em segundos.
4. **Schema de eventos por minuto** (§6) é o pré-requisito de dado para qualquer uma das frentes acima e o entregável tangível da faceta `dados`.

### 5.3 Counter-review (tentando refutar a própria recomendação)

Foco mandatório em **endogeneidade** e **já-precificado**. ≥3 problemas reais:

1. **"Score effect é endógeno — o forte lidera e fecha"** (S5, R5, taxonomia). O coeficiente de game-state pré-jogo se confunde com força do time, que o modelo de força (Dixon-Coles/Elo) já captura e a odd já precifica. **Modelar score-effect pré-jogo seria dupla-contagem.** → *Confirma a recomendação:* fica em EXPLICAR/live.
2. **"Já precificado em segundos no live"** (repo, filtro de ouro; Vecer estima intensidade *a partir das próprias odds* live). O movimento causado por gol/vermelho some no instante do evento. Qualquer edge live exigiria **velocidade de execução + modelo de momentum sem gatilho** — fora do escopo e do MVP. → *Confirma:* não prometer edge live.
3. **"Mesmo o estilo persistente quase não move gols"** (S4: p=0,14 para gols reais). Se um estilo tático estável tem efeito não-significativo no gol, um "tema de game-state" genérico tem ainda menos chance de virar edge pré-jogo. → *Confirma:* DESCARTAR ESTIMAR autônomo.
4. **"O número de R3 (~1,45-1,8 gol) é instável entre estudos"** e some quando se controla por força/timing/endogeneidade. Usar um número fixo de expulsão no motor seria frágil. → *Refina:* expulsão = efeito **proporcional ao tempo restante e condicional à força**, nunca constante; e isso é live.
5. **"SIN-017 corre o risco de virar um MOD-001 paralelo."** Se SIN-017 começar a "estimar λ(t)", duplica o motor. → *Por isso* a recomendação crava a fronteira: **quant temporal = MOD-001; SIN-017 = spec + EXPLICAR**.

**Veredito do counter-review:** a recomendação sobrevive — e sai **mais forte e mais modesta**: zero ESTIMAR novo pré-jogo, fronteira de posse explícita com MOD-001, live como backlog.

---

## 6. Modelo de dados proposto (eventos por minuto + game-state)

> Pré-requisito da faceta `dados`. Datas/tempos via **date-fns/-tz** (fuso `America/Sao_Paulo`); dinheiro N/A aqui. **Não** carimbar `@feature` em colunas compartilhadas; só em coluna de posse única.

**`match_event`** (evento minuto-a-minuto — base de λ(t) e de game-state):

| Coluna | Tipo | Nota |
|---|---|---|
| `id` | uuid | |
| `match_id` | fk → `match` (DOS-001) | alinhar à âncora `match` |
| `minute` | int | minuto regulamentar |
| `stoppage` | int null | acréscimo (90+X / 45+X) — separar do minuto para não inflar janelas de borda |
| `period` | enum `1H`/`2H`/`ET1`/`ET2` | metade; o split λ₁/λ₂ depende disso |
| `event_type` | enum `goal`/`red_card`/`second_yellow`/`penalty_goal`/`own_goal`/`sub` | |
| `team_id` | fk | time do evento |
| `score_home`/`score_away` | int | **placar ANTES** do evento → reconstrói game-state em qualquer minuto |
| `players_home`/`players_away` | int (default 11) | homens em campo → estado de superioridade numérica |

**Estado derivado (view/feature, não tabela nova):** `game_state(minute) = (goal_diff_focal, players_diff, minute_remaining, period)`. É o vetor que o **motor live** consumiria como modificador de λ — e que o **EXPLICAR** usa para narrar.

**Agregados pré-jogo (features do motor, sem live):**
- `goal_dist_by_window(team, window)` — share de gols marcados/sofridos por janela (fast-starter vs late-finisher); calibra parciais. *Cuidado: comparar contra baseline da liga, não absoluto* (repo).
- `lambda_time_profile(league)` — curva λ(t) por liga (Bundesliga 1º gol cedo etc.).

**Fronteira de dado:** `match_event` é **ingestão do DOS-001** (dado bruto por partida, com proveniência). SIN-017/MOD-001 **interpretam**. Cobertura minuto-a-minuto para Brasileirão é incerta (mesmo gotcha de xG/eventos do SIN-015 com SportMonks) — **gate de viabilidade** antes de prometer λ(t) no BR. PL primeiro (alinhado ao MVP do MOD-001).

---

## 7. Plano por faceta (dados → ia)

**Faceta `dados`:**
1. Gate de viabilidade: provedor com **eventos minuto-a-minuto** (gols + cartões + subs) com placar/homens-em-campo por evento, para PL (MVP) e Brasileirão (fase 2). Candidatos: SportMonks (events/timeline), API-Football. Confirmar `type_id` entregável, não glossário de marketing (gotcha SIN-015).
2. Especificar `match_event` (§6) como **dimensão do DOS-001**; SIN-017 documenta a interpretação.
3. Agregados pré-jogo (`goal_dist_by_window`, `lambda_time_profile`) — features do motor.

**Faceta `ia`:**
1. **EXPLICAR (entregável principal):** dicionário de regras narrativas game-state/timing (tag EXPLICATIVO-NÃO-PREDITIVO): "favorito que abre cedo controla → leitura de Under", "0-0 ao HT + xG alto → gol represado no 2º tempo", "expulsão cedo no time atrás → abre o jogo", "últimos 10 min são o decil mais cheio". Sempre **ancorado no λ do motor**.
2. **Encomenda ao MOD-001 (spec, não implementação aqui):** λ(t) não-homogêneo dividido por metade (λ₁/λ₂), forma da curva (pico fim-de-metade, dip pós-intervalo) — para mercados de parcial/tempo. Marcar como **posse do MOD-001**.
3. **Backlog (fora do MVP):** modificador de game-state no λ **live** (goal-diff, players-diff, minute-remaining) + termo de momentum/bursty — só se houver produto live e após gate de execução/precificação. **Não** prometer edge; validar contra CLV live (SIN-012) antes de qualquer peso.

---

## 8. Riscos e gotchas

1. **Endogeneidade (risco nº1).** Score effect e cartão pré-jogo se confundem com força do time, que o motor e a odd já capturam. **Mitigação:** game-state pré-jogo = EXPLICAR; nada de coeficiente pré-jogo de "lidera → Under".
2. **Dupla-contagem com força do time / com outros sinais.** "Forte fecha o jogo" sobrepõe a SIN-016 (mando) e ao λ de força. **Mitigação:** fronteira de posse explícita — quant temporal = MOD-001; mando = SIN-016; árbitro/cartão pré-jogo = SIN-009.
3. **Já precificado em segundos no live.** Gol/vermelho movem a odd no instante. **Mitigação:** live como backlog; edge só em momentum-sem-gatilho, que exige infra de execução fora do escopo.
4. **Número fixo de expulsão é frágil** (R3 varia entre estudos; some sob controle de timing/força). **Mitigação:** efeito proporcional ao tempo restante e condicional à força, nunca constante.
5. **Cobertura minuto-a-minuto no Brasileirão.** Mesmo buraco estrutural do xG/eventos (SIN-015/MOD-001). **Mitigação:** PL primeiro; BR fase 2 com gate.
6. **Confusão de escala (10 min vs 15 min)** já documentada no repo — não misturar ao especificar janelas.
7. **Inflar janelas de borda com acréscimos** (45+X em 31-45; 90+X em 76-90). **Mitigação:** coluna `stoppage` separada no schema.
8. **Risco de virar MOD-001 paralelo.** **Mitigação:** SIN-017 só especifica + narra; não implementa motor.

---

## 9. Refutado e perguntas abertas

**Refutado / rebaixado:**
- ❌ **"Game-state vira sinal ESTIMAR pré-jogo autônomo."** Endógeno (S5/R5) + já precificado + estilo nem move gols (S4). Vira EXPLICAR.
- ❌ **"Expulsão tem efeito fixo de ~1,8 gol."** É teto para expulsão cedo; some no fim do jogo (R2); varia por força (R4). Modelar proporcional, não constante.
- ❌ **"Mito dos dez jogam melhor."** Sem suporte estatístico (R1/R2: sancionado −47%).
- ❌ **"Forte = jogo de muitos gols."** Já marcado como trap no repo (controle defensivo).

**Perguntas abertas:**
1. **Fronteira λ(t): MOD-001 ou SIN-017?** Esta investigação crava "quant = MOD-001, EXPLICAR = SIN-017", mas a decisão final é do **/pl do MOD-001** (igual à pergunta aberta da taxonomia sobre regra×motor da SIN-011).
2. **Produto live existe no roadmap?** Todo o potencial ESTIMAR de game-state é live. Sem produto live declarado, o modificador de λ fica em backlog indefinido. Decisão de produto.
3. **Cobertura de eventos minuto-a-minuto + placar/homens-em-campo por evento no Brasileirão** — viável e barato? (gate de dado, herdado do risco SIN-015/MOD-001).

---

## Fontes

- arXiv 2501.18606 — Temporal dynamics of goal scoring in soccer (3.433 jogos, 21 ligas; não-homogeneidade, dip por metade, bursty scoring): https://arxiv.org/html/2501.18606v1
- arXiv 2508.04008 — Leveraging Minute-by-Minute Soccer Match Event Data to Adjust Team's Offensive Production for Game Context (goal-diff como modificador de geração de chance; Serie A mais íngreme): https://arxiv.org/pdf/2508.04008
- Lago-Ballesteros & Lago-Peñas 2011 — The effect of playing tactics and situational variables on achieving score-box possessions (score-box −43%/−53% empatando/liderando vs perdendo): https://pubmed.ncbi.nlm.nih.gov/22856388/
- Lago-Peñas & Gómez-López 2014 — How Important is it to Score a Goal? The Influence of the Scoreline on Match Performance (SAGE): https://journals.sagepub.com/doi/abs/10.2466/23.27.PMS.119c32z1
- Frontiers (match status × ball possession, score-box −43%/−53%): https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.00487/full
- Frontiers 2023 — Is ball-possession style more physically demanding than counter-attacking? (estilo quase não move gols reais, p=0,14): https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1197039/full
- Springer, Empirical Economics 2017 — Effects of a red card on goal-scoring in World Cup football matches (320 jogos, +124%/−47%, timing, endogeneidade ~75%): https://link.springer.com/article/10.1007/s00181-017-1287-5
- Repositório EUR (versão aberta do paper WC red card): https://repub.eur.nl/pub/109448/REPUB_109448_OA.pdf
- Vecer, Kopřiva — Estimating the Effect of the Red Card in Soccer (intensidades via odds; ponto de virada ~intervalo; assimetria forte×fraco): https://www.degruyter.com/document/doi/10.2202/1559-0410.1146/html
- RunRepeat — Red card study (19.985 jogos; mandante penalizado): https://runrepeat.com/red-card-study
- StatsUltra — When Are Most Goals Scored in Football? (últimos 10 min ~19%; 41-50 ~12,2%): https://statsultra.com/when-are-most-goals-scored-football/
- Wharton Sports Analytics — Optimal Substitution Time (substituições e taxa de gols no fim): https://wsb.wharton.upenn.edu/optimal-substitution-time/
- Winkelmann et al. 2024 (via SIN-015) — ineficiências táticas pré-jogo não persistentes: https://journals.sagepub.com/doi/10.1177/15270025231204997
- Repo interno: [taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md), [parciais-tempo.md](../mercados/parciais-tempo.md), [over-under-gols.md](../mercados/over-under-gols.md), [derivados-resultado.md](../mercados/derivados-resultado.md), [MOD-001](../features/modelos/MOD-001-motor-prognostico-quant.md), [SIN-015](../features/sinais/SIN-015-perfil-tatico-transicoes.md)
</content>
</invoke>
