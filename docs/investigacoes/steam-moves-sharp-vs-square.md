# SIN-019 — Steam moves e origem da linha (sharp vs square)

> Investigação (`/rs`). As-of: **2026-06-21**. Feature: [docs/features/sinais/SIN-019-steam-moves-sharp-vs-square.md](../features/sinais/SIN-019-steam-moves-sharp-vs-square.md).
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `inferência` (dedução) · `NEI` (não encontrado/insuficiente).
> **Não re-decide** o SIN-012 (CLV/closing line é a âncora). Este tema é a **microestrutura** que diz **quando** o movimento de odds do SIN-012 é informação real vs ruído.

---

## 1. TL;DR + recomendação cravada

A microestrutura do mercado **confirma e refina** a camada VALIDAR (SIN-012), não a substitui — **classificação: VALIDAR** (reforço da camada transversal de mercado). Os achados cravados (só SUPPORTED):

1. **A linha nasce em poucas casas "market makers"** (originating books): **Pinnacle**, **BetCRIS**, **Circa** e as **exchanges (Betfair)** — margem baixa, limites altos, aceitam sharps, não banem ganhadores. As demais (Bet365/DraftKings/FanDuel e a maioria das casas BR) são **followers/square**: copiam a linha do market maker e ajustam [`verificado-fetch` Unabated 2021; corroborado]. As **exchanges lideram a descoberta de preço** e suas odds têm **mais poder preditivo** que as de bookmaker [`verificado-fetch` busca acadêmica].

2. **Steam move** = movimento **rápido, súbito e sincronizado** da linha em **várias casas ao mesmo tempo** (segundos a minutos), tipicamente originado num market maker (Pinnacle/Betfair) e copiado pelas followers. **Detecção** = cruzar várias casas e exigir **direção igual + janela curta + origem no market maker** (um book mexendo = ruído; o mercado inteiro mexendo = sinal) [`verificado-fetch` STN/Buchdahl; trade press].

3. **O sinal de steam/RLM existe, mas é majoritariamente capturável só ANTES do fechamento, e some ao close.** Buchdahl (4.069 jogos EPL): "heavy steamers" rendem **+6,74% a preços pré-close** (p=0,00002) mas o edge **desaparece no preço de fechamento** (−4,29%) [`verificado-fetch`]. Logo: **steam confirma para onde a closing vai migrar** — exatamente a âncora do SIN-012 — mas **chasing tardio não tem edge**.

4. **Reverse Line Movement (RLM)** como estratégia isolada é **fraco/não-confiável**: estudo peer-reviewed (J. Economics and Finance, Springer, 2019) e arXiv 2306.01740 (2023) concluem que RLM **não é lucrativo** (lucros somem ao corrigir dados / pós-2020) [`verificado-fetch`]. RLM só tem valor com **divergência aposta% vs dinheiro%** (handle split) — dado que **nenhum feed BR expõe**. O veredito qualitativo do SIN-012 (maior parte do movimento bruto não é exploável) **se mantém**; o número "~90%" de [mercado-odds.md:70] é **heurística de trade press, REFUTADO como estatística com fonte** (ver §4.4/§9) — usar com essa ressalva.

5. **Para o mercado BR isto tem uma limitação dura e herdada:** o sinal sharp (Pinnacle/Betfair/steam) **não vive nas casas .bet.br**. As .bet.br são **entidades brasileiras separadas** (incorporação local obrigatória desde 01/01/2025, domínio .bet.br) [`verificado-fetch` igamingbrazil/sumsub], com linha própria — e **o The Odds API não cobre nenhuma .bet.br** (regiões us/uk/eu/fr/se/au) [`verificado-fetch`]. Detectar steam **nas casas BR** exige um feed que cubra Betano/Superbet/etc. — hoje só via **aggregador pago sales-gated** (OpticOdds/Betstamp, com Betano/Superbet confirmados) ou **OddsPapi free-tier não-comprovado** (claim de vendor), ou scraping (risco de ToS). **Pinnacle direto fechou em 23/07/2025** [`snippet`].

**Recomendação cravada:** SIN-019 **não vira sinal próprio de camada ESTIMAR**; é **regra de qualidade do movimento de odds dentro do SIN-012**. Defina uma **taxonomia de confiança do movimento** (origem × sincronização × velocidade × contra-público) que pondera *quanto* confiar num delta de odds antes de tratá-lo como informação. Para **CLV/closing do SIN-012**, use a linha **sharp/exchange (Pinnacle/Betfair via aggregador)** como âncora de "verdade"; trate a linha das **.bet.br** como a **soft a ser batida**, não como a verdade. O movimento sharp é confiável; o movimento de uma casa BR isolada (square) é ruído até prova em contrário.

---

## 2. Contexto e problema

O SIN-012 cravou: a **closing line sharp (Pinnacle/Betfair) vig-free + CLV** é a âncora que decide se um sinal de camada ESTIMAR vira EV+ ([taxonomia-sinais.md:10](../arquitetura/taxonomia-sinais.md), [mercado-odds.md:15](../regras/mercado-odds.md)). Mas o SIN-012 trata "movimento de odds" como um bloco só. Na prática, **nem todo movimento é igual**: um delta de odds pode ser (a) dinheiro sharp corrigindo a linha (informação real, prediz a closing) ou (b) dinheiro recreativo numa casa soft (ruído). SIN-019 é a **microestrutura** que separa os dois — *quando* confiar no movimento que o SIN-012 já usa.

**Brief (do header da feature):** (a) quais casas **originam** a linha vs copiam; (b) o que é **steam move** e como detectar; (c) **reverse line movement** como sinal sharp; (d) distinção **sharp/respeitada × square/recreational**; (e) o que isso implica para **confiar na closing/CLV** do SIN-012; (f) **feeds** que expõem movimento de odds, custo e **limitações no mercado BR** (a taxonomia já registra que as .bet.br não vêm do The Odds API — [taxonomia-sinais.md:54](../arquitetura/taxonomia-sinais.md)).

**Requisitos implícitos do repo:** odds **não** são dinheiro (decisão CORE-001 — `NUMERIC(6,3)`, não `odds_cents`); snapshots de odds com **timestamp** em `timestamptz` interpretado em **America/Sao_Paulo** na borda; dinheiro (se houver) em **centavos (int)**; separação quant/LLM; custo escala com nº de jogos.

---

## 3. Estado real no repo (o que já está cravado + gaps)

SIN-019 não tem código (greenfield, como todo o repo — confirmado em [DOS-001:22](dossie-por-partida-fontes-de-dados.md) e [CORE-001:16](porta-de-dinheiro-odds-e-arredondamento.md)). O que **outras features já cravaram** e que SIN-019 **não pode contradizer**:

- **SIN-012 é a âncora (VALIDAR), transversal.** "A closing line sharp (Pinnacle/Betfair) ≈ probabilidade verdadeira; CLV é o KPI" — [SIN-012-mercado-odds.md:29](../features/sinais/SIN-012-mercado-odds.md); `impacta: [SIN-006..011, DOS-001, MOD-001]`; âncora `tabelas: [match_odds]`. SIN-019 **`impacta` SIN-012** (refina) e **`depende_de` SIN-012/DOS-001** (consome a closing e o feed de odds).
- **A regra de mercado já cravou o essencial deste tema** ([mercado-odds.md](../regras/mercado-odds.md)):
  - [linha 25] "**Pinnacle = benchmark**: margem ~2%, aceita sharps, limites altos; move pouco rumo a concorrentes."
  - [linha 26] "**Steam move / RLM** sinaliza dinheiro sharp; RLM = linha move contra a maioria das apostas... Moderada (⚠️ ~90% é ruído)."
  - [linha 39] "RLM/steam na Pinnacle indica o lado para onde a closing vai — entrar **cedo, no mesmo lado do dinheiro sharp**, antes de a soft ajustar (janela curta). Confiar mais em RLM com **divergência aposta-vs-dinheiro** do que em movimento bruto."
  - [linha 70] "**~90% do movimento de linha é ruído.** Steam costuma chegar **tarde** demais... RLM só é forte com divergência aposta-vs-dinheiro."
  - **SIN-019 confirma esses claims com evidência externa nova** (§4) e **adiciona** a microestrutura (originating books, detecção, taxonomia de confiança) — sem re-decidir.
- **Odds não são dinheiro (CORE-001).** `match_odds.odds_cents` (proposto no DOS-001) → renomear **`odds_decimal NUMERIC(6,3)`** + `implied_prob` vig-free derivada na ingestão — [CORE-001:68](porta-de-dinheiro-odds-e-arredondamento.md). SIN-019 **herda** essa representação; snapshots de steam são linhas de `match_odds` com `captured_at`.
- **Fronteira odds (DOS-001 ingere × SIN-012 valida)** — [taxonomia-sinais.md:54](../arquitetura/taxonomia-sinais.md). SIN-019 mora **dentro do SIN-012** (interpretação do movimento), consumindo o feed de odds que o DOS-001 entrega.

**Gaps abertos (riscos herdados):**
1. **Casas .bet.br fora do The Odds API** ([DOS-001:87](dossie-por-partida-fontes-de-dados.md), [taxonomia-sinais.md:54](../arquitetura/taxonomia-sinais.md)) — **o gap nº1 de SIN-019**: o sinal sharp não vive nas casas que o apostador BR usa. Resolução de fonte BR continua **`NEI`/protótipo** (§5).
2. **Frequência de snapshots abertura→fechamento** — decisão em aberto do SIN-012 ([mercado-odds.md:82](../regras/mercado-odds.md)). Steam exige **alta frequência** (segundos/minutos) numa janela curta — tensão com custo de requisições.
3. **Filtro de liquidez** ([mercado-odds.md:83](../regras/mercado-odds.md)) — abaixo de que liquidez a closing/steam é não-confiável. SIN-019 dá o critério qualitativo (sharp vs square), falta o numérico.

---

## 4. Estado da arte — originating books, steam, RLM (claims atômicos)

Confiança + URL + as-of inline. As-of de todas = **2026-06-21** salvo indicado.

### 4.1 Originating books vs followers (square)

| # | Claim | Veredito | Fonte | Conf. |
|---|---|---|---|---|
| A1 | **Market makers que originam a linha:** Pinnacle (benchmark **global/offshore/futebol**), BetCRIS/BookMaker e Circa (originadores **US** hoje, pós-saída da Pinnacle do mercado US regulado), e **exchanges (Betfair)**. A maioria dos books é "follow the leader": só move depois que o market maker move. ⚠️ "Pinnacle seta a linha **US**" é **datado** — globalmente/futebol vale; no US regulado quem origina é BetCRIS/Circa. | SUPPORTED | [unabated.com/.../market-makers](https://unabated.com/articles/who-sets-the-sports-betting-line-market-makers) (2021); [help.outlier.bet](https://help.outlier.bet/en/articles/9922960-how-sportsbooks-set-odds-soft-vs-sharp-books); [sccgmanagement.com](https://sccgmanagement.com/areas-of-expertise/2024/1/10/market-maker-vs-retail-sportsbook-business-models-and-the-impact-of-price-discovery/) | `verificado-fetch` |
| A2 | **Por que Pinnacle origina:** margem ~2%, **limites altos**, **aceita sharp action** e **não bane ganhadores** — usa o dinheiro sharp para afiar a linha (modelo "Pinnacle crowd"). | SUPPORTED | [pinnacleoddsdropper Buchdahl CLV](https://www.pinnacleoddsdropper.com/blog/closing-line-value--clv-demystified-by-expert-joseph-buchdahl); corroborado [mercado-odds.md:25] | `verificado-fetch` |
| A3 | **Circa origina por limites altos:** ~US$20k+ em sides/totals de NFL (vs $1–2k em books recreativos), busca ativamente ação sharp em vez de limitá-la. | SUPPORTED | busca (JediBets, ValueBetFactory, ETR) | `snippet` (≥2 fontes) |
| A4 | **Exchanges (Betfair) lideram a descoberta de preço:** odds de exchange têm **mais poder preditivo** que odds de bookmaker; traders rápidos/informados promovem price discovery; exchange **não** mostra favorite-longshot bias. | SUPPORTED | busca acadêmica (ScienceDirect price-discovery; EPL 1004 jogos Betfair) | `snippet` (papers peer-reviewed) |
| A5 | **Square/recreational books** (Bet365, DraftKings, FanDuel, maioria das casas BR) são **price-takers** (copiam/seguem o market maker, mais lentos, vig maior); sua linha reflete dinheiro recreativo, não informação. | SUPPORTED | [mercado-odds.md:23] (blind betting close −7% soft vs −3,3% Pinnacle); [help.outlier.bet](https://help.outlier.bet/en/articles/9922960-how-sportsbooks-set-odds-soft-vs-sharp-books) | `verificado-fetch` (interno) + `snippet` |
| A6 | **Recreational books restringem/limitam quem é perfilado como sharp** — e **bater a closing line correlaciona forte com ser limitado**. Mass. Gaming Commission (set/2024): ~0,64% das contas MA limitadas; quem **batia o fechamento teve limite cortado/elevado conforme o lado**. ⚠️ Operadores **disputam a intenção** ("não é por ganhar; é por courtsiding/sindicato/bônus"); o enquadramento defensável é "restringem perfil sharp", não "banem qualquer ganhador". | SUPPORTED (efeito) / contestado (intenção) | [espn.com/.../41231266](https://www.espn.com/sports-betting/story/_/id/41231266/); [covers.com/.../massachusetts-roundtable](https://www.covers.com/industry/massachusetts-limiting-sports-betting-debate-sharps-roundtable-september-2024) | `snippet` (≥2, primário MGC) |

### 4.2 Steam move — definição e detecção

| # | Claim | Veredito | Fonte | Conf. |
|---|---|---|---|---|
| B1 | **Steam move = movimento rápido, súbito e SINCRONIZADO** da linha em **múltiplas casas** numa janela curta (segundos–minutos), tipicamente dinheiro sharp/sindicato batendo simultaneamente. | SUPPORTED | busca (Quantum Sports, STN); corrobora [mercado-odds.md:26] | `snippet` (≥3) |
| B2 | **Detecção:** exigir **direção igual + janela curta + origem em casa respeitada** (Pinnacle/Betfair) + idealmente **contra o público**. Um book mexendo = pode ser ruído; **o mercado inteiro mexendo = sinal**. Serviços de "steam chasing" monitoram dezenas de books e alertam. | SUPPORTED | busca (steam vs mirage; Quantum); corrobora [mercado-odds.md:39] | `snippet` (≥2) |
| B3 | **Steamers têm sinal pré-close mas perdem no fechamento:** Buchdahl, **4.069 jogos EPL** (2010/11–2011/12): backing steamers −1,24% pré-close vs drifters −12,12%; **heavy steamers (>2% Δprob) +6,74% pré-close (p=0,00002)**; mas a **preços de fechamento o edge some** (−4,29%). "Steamers permanecem sub-apostados e marginalmente sobre-precificados mesmo no kick-off." | SUPPORTED | [sportstradingnetwork.com/.../steamers](https://www.sportstradingnetwork.com/article/steamers-provide-edge-analysis-english-1x2-football-betting-market/) | `verificado-fetch` |
| B4 | **Steam chasing tardio não tem edge** e exige um **book soft** com número velho: "betting into a steamed line é como comprar a ação depois que ela disparou". | SUPPORTED | busca (TennesseEv, Quantum, boydsbets) | `snippet` (≥3) |

### 4.3 Reverse Line Movement (RLM)

| # | Claim | Veredito | Fonte | Conf. |
|---|---|---|---|---|
| C1 | **RLM = a linha move CONTRA o lado com a maioria das apostas (tickets)** → sinaliza dinheiro sharp (maior, em menos apostas) no outro lado. | SUPPORTED | [actionnetwork.com/education/reverse-line-movement](https://www.actionnetwork.com/education/reverse-line-movement); [mercado-odds.md:26] | `verificado-fetch` (interno) + `snippet` |
| C2 | **RLM como estratégia isolada NÃO é lucrativa:** (a) estudo peer-reviewed (J. Economics and Finance, Springer, **2019**) sobre totais de college football (2005–2016) conclui que RLM **não é lucrativo** (não rejeita H0 de zero lucro a 10%); (b) arXiv 2306.01740 ("Not feeling the buzz", 2023): após corrigir um dado ruim, "a maior parte dos lucros sumiu" e a estratégia sobrevivente "não gera mais lucro" pós-2020 (mercado mais eficiente). | SUPPORTED (refuta a versão ingênua de RLM) | [link.springer.com/.../s12197-019-09479-3](https://link.springer.com/article/10.1007/s12197-019-09479-3); [arxiv.org/abs/2306.01740](https://arxiv.org/abs/2306.01740) | `verificado-fetch` (busca) |
| C3 | **RLM só é forte com divergência aposta%-vs-dinheiro% (handle split)** — exige saber **% de tickets vs % de handle**, dado proprietário de book que **nenhum feed BR expõe**. | SUPPORTED | [mercado-odds.md:39, :70]; busca | `verificado-fetch` (interno) |

### 4.4 Confiar na closing / CLV — sinal vs ruído

| # | Claim | Veredito | Fonte | Conf. |
|---|---|---|---|---|
| D1 | **CLV é melhor que resultado para avaliar um método:** dá informação estatisticamente significativa muito mais rápido; bater a NVP (no-vig price) de fechamento ⇒ EV+ esperado. | SUPPORTED | [pinnacleoddsdropper Buchdahl CLV](https://www.pinnacleoddsdropper.com/blog/closing-line-value--clv-demystified-by-expert-joseph-buchdahl); [mercado-odds.md:24] | `verificado-fetch` |
| D2 | **Movimento é informação real quando:** origina em market maker (Pinnacle/exchange), é **sincronizado** entre casas, **rápido**, e **contra o público**. É **ruído** quando: casa soft isolada, dinheiro recreativo, sem sincronização. "Move num book pode ser ruído; move no mercado é sinal." | SUPPORTED | §4.1–4.2; busca (steam vs mirage) | `snippet` (síntese) |
| D3 | **A closing é eficiente EM MÉDIA, não jogo a jogo;** menos confiável em **baixa liquidez / props / ligas menores** (onde sobra espaço para divergir). | SUPPORTED | [mercado-odds.md:30, :69]; [taxonomia-sinais.md] | `verificado-fetch` (interno) |
| D4 | **"~90% do movimento de linha é ruído"** — **REFUTADO como estatística com fonte**: caça adversarial dupla (esta sessão + agente) não achou o número em **nenhuma** fonte primária/autoritativa (Pinnacle, Buchdahl, Unabated, VSiN, Action Network, papers). A única "origem" rastreável é um blog SEO/afiliado sem dado/metodologia; provável eco distorcido de uma estatística de **magnitude** (ex.: só ~20% dos jogos NFL movem >1 ponto — tamanho, não conteúdo informacional). Usar **só como heurística**, nunca como quantidade medida. | REFUTED (número) / NEI (direção exata) | [unabated.com/.../market-makers](https://unabated.com/articles/who-sets-the-sports-betting-line-market-makers) (sem %); blogs content-farm; [mercado-odds.md:70] | `snippet`/`NEI` |

**Síntese da arte:** o consenso sério (Buchdahl, papers de exchange, Unabated) é coerente e converge: **a informação vive no market maker e no movimento sincronizado/precoce; o edge é capturável só antes do close; RLM bruto e steam-chasing tardio não pagam.** Isso **reforça o SIN-012** — a closing sharp é a âncora; o movimento sharp **prediz** essa closing; o movimento square é ruído.

---

## 5. Feeds de odds que expõem movimento — matriz BR

Preços/cobertura **`verificado-fetch` 2026-06-21** salvo indicado. Foco: **expõe line movement/steam? cobre casas .bet.br?**

| Feed | Preço (verificado) | Line movement / steam | Casas .bet.br | API self-serve? | Fit p/ steam BR |
|---|---|---|---|---|---|
| **The Odds API** | Free 500; **$30/20k; $59/100k**; $119/5M; $249/15M | Sim — histórico desde **2020** | **Nenhuma** (us/uk/eu/fr/se/au) | Sim | ✗ não cobre BR |
| **OddsJam** | Consumo: ~**$199/mo** (Gold/Sharp); **~$999/mo** (Platinum tem *Line Movement History*); **API sales-gated** | Push + DB histórico; *Line Movement History* só no topo | Sem menção a .bet.br | Não (API sales-gated) | ? BR não confirmado |
| **OpticOdds** | **Sales-gated** (~US$5k/mo citado, mas **NEI** na página viva) | **Push line-move** ("notify when lines move") | **Betano + Superbet + Sportingbet confirmados** (páginas dedicadas); KTO/EstrelaBet em snippet | Não | ✓ melhor opção legítima, caro |
| **Betstamp** | Demo/trial-gated (sem preço público) | **SSE stream** ("Betano line moves as they happen", sub-segundo) | **Betano confirmado**; resto NEI | Não | ✓ melhor formato de stream, BR estreito |
| **OddsPapi / odds-api.io** | **Free tier** (250 req/mo, "historical incluso", sem cartão); pago **NEI** | Claim genérico de timestamp/CLV — **ausente nas páginas BR/Betano** (red flag) | **Slugs .bet.br explícitos** (estrelabet, superbet.bet.br, sportingbet.bet.br, betano.bet.br, kto, pixbet) | Sim | ⚠️ cheap mas **não-comprovado** (vendor) |
| **SportMonks (add-on odds)** | Base €29–249 + add-on odds **~€15/mo** (o €129 citado no [DOS-001:82] **não confirmado** hoje) | Sim, histórico até 7d pós-jogo | **Nenhuma evidente** (feed europeu) | Sim | ✗ provável sem BR |
| **Pinnacle direto** | **Fechado desde 23/07/2025** (só "high-value/commercial", api@pinnacle.com) | n/a (só via aggregador) | n/a (não é casa BR) | Não | ✗ só âncora sharp via aggregador |

### Recomendação (§5)

**Para a âncora SHARP (a "verdade" do SIN-012):** obter **Pinnacle e/ou Betfair via aggregador** (The Odds API cobre Pinnacle EU + Betfair Exchange, $30–59/mo, histórico desde 2020 — barato e suficiente para a **linha de referência vig-free** e para **detectar steam no lado sharp**). Pinnacle direto está fechado [`snippet`].

**Para o movimento NAS CASAS BR (a "soft" a bater):** **não existe** ainda um feed barato, amplo e **comprovado** de .bet.br. Caminho recomendado, em ordem:
1. **Pilotar OddsPapi free-tier imediatamente** (custo ~0): polar Betano BR + Superbet BR a cada N min e **verificar empiricamente se vêm snapshots distintos com timestamp** que dá para diffar em line movement. **Não** arquitetar na palavra do vendor.
2. **Em paralelo, cotar Betstamp (SSE, Betano) e OpticOdds (push, Betano+Superbet+Sportingbet)** como fallback legítimo-mas-pago se o OddsPapi não entregar.
3. **Scraping direto das .bet.br** como **contingência** (risco de ToS — §8), nunca fundação.
4. **Descartar The Odds API e SportMonks para BR** — não carregam .bet.br.

### Counter-review (≥3 problemas reais da recomendação)

1. **A âncora sharp e a casa-alvo BR vivem em mercados diferentes.** Steam na Pinnacle EU **não garante** que a Betano BR vai mover igual — a .bet.br é entidade separada, com seu próprio book/risco/público. "Entrar antes da soft ajustar" pode falhar se a soft **brasileira** simplesmente não acompanha o sharp europeu. → o edge de timing do steam pode **não existir** no mercado BR. **Risco maior da feature.**
2. **OddsPapi é claim de vendor não-comprovado** e a evidência interna ([DOS-001:108, :172]) já mandou tratar como protótipo, nunca como verdade. A ausência de line-movement nas páginas BR específicas (só nos textos genéricos) é red flag concreto. Construir sobre ele sem o piloto = dívida.
3. **Custo × frequência de snapshot brigam.** Steam exige amostragem de segundos/minutos numa janela curta — em The Odds API isso queima créditos rápido (cada chamada conta); em aggregador push/SSE (OpticOdds/Betstamp) resolve, mas é **sales-gated/caro** — incompatível com MVP barato. O filtro "só snapshot denso perto do off" mitiga, mas reduz a captura de steam precoce.
4. **(bônus) RLM é impossível no BR:** handle split (tickets% vs money%) é dado proprietário de book US/UK; **nenhuma casa BR publica**. O sinal mais limpo de "dinheiro sharp" (C3) está **fora de alcance** — sobra só o movimento bruto de preço, que é o mais ruidoso.

---

## 6. Modelo de dados proposto

Reaproveita a tabela **`match_odds`** (âncora do SIN-012) como **série temporal de snapshots** — não cria entidade nova; SIN-019 é interpretação, não posse de schema novo. Herda CORE-001 (odds = `NUMERIC`, não centavos).

```
match_odds(
  id,
  match_id            → match,
  bookmaker           text,          -- ex: 'pinnacle','betfair_ex','betano_bet_br'
  bookmaker_class     text,          -- 'sharp' | 'exchange' | 'square'  ← classificação SIN-019
  market              text,          -- '1x2','ou_2_5', ...
  selection           text,
  odds_decimal        NUMERIC(6,3),  -- fato de mercado imutável (CORE-001; NÃO odds_cents)
  implied_prob        NUMERIC,       -- vig-free, derivada na ingestão (float64/numeric)
  captured_at         timestamptz,   -- instante do snapshot (América/Sao_Paulo na borda)
  is_closing          boolean,       -- marca o snapshot de fechamento (âncora do CLV/SIN-012)
  source              text           -- proveniência (the_odds_api | oddspapi | scrape | ...)
)
```

Derivações (em float64/numeric, **não** materializadas como dinheiro — só leitura analítica):

```
-- delta de movimento entre dois snapshots de mesma (match, bookmaker, market, selection)
line_delta = implied_prob(t2) − implied_prob(t1)

-- sinal de steam (janela curta, várias casas, mesma direção, origem sharp)
steam_score = f(
  n_books_moved_same_direction (em Δt curto),
  origin_is_market_maker (bookmaker_class ∈ {sharp,exchange}),
  speed (Δt pequeno),
  vs_public (se houver handle split — NEI no BR)
)

-- CLV (SIN-012, ex-post): odd_apostada vs odds_decimal where is_closing
clv = implied_prob_closing_sharp − implied_prob_aposta
```

**Notas:**
- `bookmaker_class` é a contribuição de schema do SIN-019: rotula cada casa como **sharp/exchange/square** → o motor (MOD-001) pondera o movimento pela classe da origem (movimento sharp pesa; square não).
- `captured_at` em `timestamptz`, interpretado em **America/Sao_Paulo** na borda (regra do repo).
- **Sem coluna de dinheiro** aqui — odd é fato de mercado (CORE-001). Stake/payout/CLV-em-R$ vivem noutra camada, em centavos-int.
- Frequência de snapshot é **decisão de produto** (custo×steam) — herdada do SIN-012 ([mercado-odds.md:82]).

---

## 7. Plano por faceta (dados → ia)

- **dados:**
  1. Ingerir odds da **âncora sharp** (Pinnacle/Betfair via The Odds API, $30–59/mo) como série de `match_odds` com `bookmaker_class ∈ {sharp,exchange}`, `is_closing` marcado no último snapshot pré-kickoff.
  2. **Spike de fonte BR** (OddsPapi free-tier first; OpticOdds/Betstamp como fallback) para `bookmaker_class='square'` das .bet.br — **medir empiricamente** se há timestamp diffável (gate antes de prometer steam BR).
  3. Frequência: snapshots esparsos longe do off + **densos perto do kickoff** (onde steam importa e o custo é justificável).
  4. Tudo em `NUMERIC`/`implied_prob` vig-free; `captured_at` America/Sao_Paulo.
- **ia:**
  1. **Ponderar o movimento pela origem:** delta numa casa **sharp/exchange** sincronizado → informação (ajusta confiança/valida o lado); delta numa **square** isolada → ruído (peso ~0).
  2. **Steam como confirmação da direção da closing**, não como sinal de aposta tardio (Buchdahl B3: edge some no close).
  3. **Anti-ruído:** exigir sincronização + origem sharp + velocidade antes de tratar movimento como sinal; sem handle split (BR), **não** usar RLM bruto como gatilho.
  4. **LLM (EXPLICAR):** narrar "a linha sharp moveu para X (steam), a casa BR ainda está em Y" **citando os snapshots** — sem inventar; o peso na probabilidade fica no quant (via SIN-012/MOD-001).

---

## 8. Riscos e gotchas

1. **Casas BR sem feed sharp (risco nº1, herdado).** O sinal sharp não vive nas .bet.br; o apostador BR vê Betano/Superbet, não Pinnacle. Steam europeu pode **não** se propagar à soft brasileira → o edge de timing pode inexistir no mercado-alvo. Resolver por **protótipo** antes de prometer ([DOS-001:153]).
2. **Latência.** Steam é janela de segundos/minutos; capturar exige ingestão de alta frequência e baixa latência. Feeds baratos (The Odds API por crédito) ou são caros nessa frequência ou chegam tarde; push/SSE (OpticOdds/Betstamp) resolvem mas são sales-gated. **Chasing tardio não tem edge** (B3/B4).
3. **ToS de scraping das .bet.br.** As .bet.br proíbem acesso automatizado; scraping é frágil e expõe juridicamente (e o produto já tem peso regulatório Lei 14.790). Contingência, não fundação.
4. **RLM impossível no BR.** Handle split (ticket% vs money%) é dado proprietário de book US/UK; nenhuma casa BR publica → o sinal mais limpo de sharp (C3) está fora de alcance; sobra movimento bruto (mais ruidoso).
5. **Vendor claims (OddsPapi).** Cobertura .bet.br + line-movement é auto-reportada e parcialmente ausente nas páginas BR específicas. Verificar empiricamente.
6. **Pinnacle fechado (jul/2025).** Acesso só via aggregador; dependência de terceiro para a âncora sharp.
7. **Custo × frequência.** Snapshot denso o suficiente para steam queima créditos/exige tier caro; o filtro "denso só perto do off" mitiga mas perde steam precoce — e é justo o precoce que paga (B3).

---

## 9. Refutado e Perguntas Abertas

### Refutado (com a evidência que matou)

- **"RLM (linha contra o público) é estratégia lucrativa por si só"** — REFUTADO: estudo peer-reviewed (J. Economics and Finance 2019) acha RLM em totais de college football **não-lucrativo** [`verificado-fetch`]. Só vale com handle split (indisponível no BR).
- **"Chasing steam tardio captura o edge"** — REFUTADO: Buchdahl — edge dos steamers **some no preço de fechamento** (−4,29%) [`verificado-fetch`]; precisa entrar **antes** e numa casa soft com número velho.
- **"The Odds API resolve as odds BR (e portanto o steam BR)"** — REFUTADO: regiões us/uk/eu/fr/se/au, **sem .bet.br** [`verificado-fetch`]; herdado de [DOS-001:164].
- **"~90% do movimento é ruído" tem base acadêmica rigorosa"** — REFUTADO quanto ao **número** (caça adversarial dupla: ausente de Pinnacle/Buchdahl/Unabated/VSiN/Action Network/papers; única origem é blog SEO sem dado); a **direção** (maioria do movimento bruto não é exploável) é coerente com C2/B3, mas o "90%" é heurística, não medição.
- **"Pinnacle seta a linha US"** — REFUTADO/datado: Pinnacle saiu do mercado US regulado; hoje BetCRIS/BookMaker e Circa originam no US. Globalmente/futebol/offshore a Pinnacle ainda é benchmark.
- **"Recreational books banem qualquer ganhador"** — REFUTADO na intenção (operadores disputam: "courtsiding/sindicato/bônus", não "por ganhar"); SUPPORTED no efeito (bater a closing correlaciona com ser limitado — MGC 2024). Enquadrar como "restringem perfil sharp".
- **"Pinnacle dá pra puxar direto via API"** — REFUTADO: API pública fechada desde 23/07/2025 [`snippet`]; só via aggregador ou deal comercial.

### Perguntas Abertas / lacunas

1. **O steam sharp (Pinnacle/Betfair) se propaga às .bet.br a tempo de gerar CLV+?** — `NEI`. É a pergunta que decide se SIN-019 tem valor no mercado-alvo. **Só backtest com snapshots reais de Betano/Superbet vs Pinnacle responde.** (Depende da fonte BR resolvida no DOS-001.)
2. **Fonte BR de movimento com timestamp:** OddsPapi (free, não-comprovado) vs Betstamp/OpticOdds (pago, sales-gated). — `NEI`; resolver por **piloto empírico** (medir se há snapshots diffáveis).
3. **Frequência de snapshot** que captura steam sem estourar custo — decisão de produto (herda [mercado-odds.md:82]); tensão latência×crédito.
4. **Filtro de liquidez numérico** abaixo do qual closing/steam é não-confiável — SIN-019 dá o critério qualitativo (sharp vs square), falta o limiar (herda [mercado-odds.md:83]).
5. **Onde vive a lógica de `bookmaker_class`/`steam_score`** — no SIN-012, no SIN-019, ou no motor (MOD-001)? Fronteira regra×motor a cravar no `/pl`.
6. Buscas fracas: medição rigorosa e pública do "% de movimento que é ruído" e da propagação sharp→casas BR especificamente (`NEI` — nicho dominado por content farm e dados proprietários de book).

---

## Evidências decisivas (fontes abertas via fetch nesta sessão)

- [web] [unabated.com/articles/who-sets-the-sports-betting-line-market-makers](https://unabated.com/articles/who-sets-the-sports-betting-line-market-makers) — market makers (Pinnacle/BetCRIS/Circa/exchanges) × followers; "follow the leader". `verificado-fetch`.
- [web] [sportstradingnetwork.com/.../steamers-provide-edge...](https://www.sportstradingnetwork.com/article/steamers-provide-edge-analysis-english-1x2-football-betting-market/) — Buchdahl, 4.069 jogos EPL; heavy steamers +6,74% pré-close (p=0,00002), edge some no close. `verificado-fetch`.
- [web] [link.springer.com/.../s12197-019-09479-3](https://link.springer.com/article/10.1007/s12197-019-09479-3) + [ideas.repec.org](https://ideas.repec.org/a/spr/jecfin/v43y2019i4d10.1007_s12197-019-09479-3.html) — RLM em totais de college football não-lucrativo (peer-reviewed). `verificado-fetch` (busca).
- [web] [pinnacleoddsdropper.com/.../clv-demystified-buchdahl](https://www.pinnacleoddsdropper.com/blog/closing-line-value--clv-demystified-by-expert-joseph-buchdahl) — CLV > resultado; modelo Pinnacle-crowd. `verificado-fetch`.
- [web] [actionnetwork.com/education/reverse-line-movement](https://www.actionnetwork.com/education/reverse-line-movement) — definição de RLM (linha contra o público). `snippet`/interno [mercado-odds.md:92].
- [web] [the-odds-api.com/#get-access](https://the-odds-api.com/#get-access) + [bookmaker-apis.html](https://the-odds-api.com/sports-odds-data/bookmaker-apis.html) — Free 500/$30 20k/$59 100k/$119 5M/$249 15M; histórico desde 2020; regiões us/uk/eu/fr/se/au, **sem .bet.br**; Pinnacle EU + Betfair sim. `verificado-fetch`.
- [web] OddsJam — [oddsjam.com/subscribe](https://oddsjam.com/subscribe) + [rotowire.com/betting/oddsjam-review](https://www.rotowire.com/betting/oddsjam-review) — ~$199/mo Gold; *Line Movement History* só no Platinum (~$999/mo citado); API sales-gated. `verificado-fetch` (review) / `snippet` (preço).
- [web] [developer.opticodds.com/docs/sportsbooks](https://developer.opticodds.com/docs/sportsbooks) + páginas Betano/Superbet — push line-move; Betano/Superbet/Sportingbet confirmados; preço sales-gated (~$5k **NEI**). `verificado-fetch`.
- [web] [betstamp.com/odds/betano](https://betstamp.com/odds/betano) — SSE stream de line moves da Betano (sub-segundo); preço demo-gated. `verificado-fetch`.
- [web] [oddspapi.io/blog/brazil-betting-api-estrelabet-betano-brasileirao](https://oddspapi.io/blog/brazil-betting-api-estrelabet-betano-brasileirao) + [oddspapi.io/sportsbooks/betano-bet-br](https://oddspapi.io/sportsbooks/betano-bet-br) — slugs .bet.br explícitos; free tier 250 req/mo; line-movement ausente nas páginas BR (red flag). `verificado-fetch` (vendor, viés).
- [web] [sportmonks.com/football-api/plans-pricing](https://www.sportmonks.com/football-api/plans-pricing/) — base €29–249 + add-on odds ~€15/mo; sem .bet.br evidente. `verificado-fetch`.
- [web] [arbusers.com/.../pinnacle-api-closed-july-23-2025](https://arbusers.com/access-to-pinnacle-api-closed-since-july-23rd-2025-t10682/) + [odds-api.io/blog/pinnacle-api-shutdown-alternatives](https://odds-api.io/blog/pinnacle-api-shutdown-alternatives) — Pinnacle API fechada 23/07/2025; só via aggregador. `snippet`.
- [web] [igamingbrazil.com](https://igamingbrazil.com/en/legislation-en/2025/02/11/treasury-publishes-new-list-of-bookmakers-with-definitive-licenses/) + [sumsub.com/blog/gambling-in-brazil](https://sumsub.com/blog/gambling-in-brazil/) — .bet.br = entidade BR separada, incorporação local obrigatória desde 01/01/2025. `verificado-fetch` (busca).
- [web] busca acadêmica — exchanges lideram price discovery; odds Betfair mais preditivas; sem favorite-longshot bias (ScienceDirect; EPL 1004 jogos). `snippet` (peer-reviewed).
- [doc] [docs/regras/mercado-odds.md](../regras/mercado-odds.md) (Pinnacle benchmark, steam/RLM, ~90% ruído), [docs/features/sinais/SIN-012-mercado-odds.md](../features/sinais/SIN-012-mercado-odds.md), [docs/arquitetura/taxonomia-sinais.md:54](../arquitetura/taxonomia-sinais.md) (.bet.br fora do The Odds API), [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](dossie-por-partida-fontes-de-dados.md), [docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md](porta-de-dinheiro-odds-e-arredondamento.md) (odds ≠ dinheiro, `NUMERIC(6,3)`).
