# Investigação — Derby/rivalidade condicionado ao FORMATO da competição (liga × copa mata-mata × europa)

> O que apostadores/tipsters devem considerar quando o jogo é um clássico, **dependendo de onde ele acontece**: pontos corridos, mata-mata de copa, ou competição continental. Complementa — não substitui — a investigação genérica de rivalidade ([SIN-007](../features/sinais/SIN-007-rivalidade.md), [regras/rivalidade.md](../regras/rivalidade.md)), que tratou o efeito derby de forma *competition-agnostic*.

- **Status:** investigado · **Data:** 2026-06-28 · **Tier:** tema amplo (6 frentes de pesquisa + 2 refutadores adversariais, ~431k tokens de subagente).
- **Feature:** SIN-007 (rivalidade). Toca [DOS-001](../features/dossie/DOS-001-dossie-por-partida.md) (ingestão de metadados de fixture), [MOD-001](../features/modelos/MOD-001-motor-prognostico-quant.md) (efeito-formato como feature), [SIN-010](../features/sinais/SIN-010-motivacao.md) (stakes), [SIN-016](../features/sinais/SIN-016-mando-de-campo.md) (mando), [SIN-009](../features/sinais/SIN-009-arbitragem.md) (cartões/árbitro).

---

## TL;DR + recomendação cravada

O formato da competição **muda o cálculo de um derby**, mas o counter-review derrubou metade da hipótese ingênua. **Cravado (SUPPORTED):** (1) o que muda no mata-mata é sobretudo **regra de liquidação** — over/under e 1X2 fecham em **90 min**; prorrogação/pênaltis só contam em mercados *to-qualify*/"quem avança"; isso é **fato de regra, não aposta estatística**, e melhora a correção do produto a custo zero de calibração. (2) O modelo de dados **não sabe distinguir liga de copa de mata-mata** hoje ([match.round é `integer`](../../apps/api/src/db/schemas/leagues.ts) e o sync nem puxa `stage`) — essa **migração de schema é o entregável de maior ROI e o pré-requisito de tudo**. (3) "Mando que encolhe em derby" **generaliza** para elite-vs-elite europeu, e **final em sede neutra atenua (não zera) o mando** — vira intermediário/quase-mando da torcida que viaja.

**Reescrito pelo counter-review (não implementar como estava):** (a) **gol fora não é seletor de formato** — foi abolido de forma quase universal (UEFA 2021/22, CONMEBOL 2022, AFC 2023/24, Copa do Brasil 2018) e a **Copa do Brasil usou até 2017**, então cruzar pré/pós sem **versionar a regra de desempate por competição+temporada** contamina qualquer calibração; (b) **a tese "abolir gol fora → ida mais aberta/over" está REFUTADA** pela única medição acadêmica (mandantes marcaram *menos*); (c) o **"under do mata-mata" é efeito GENÉRICO de copa/incentivo, não de rivalidade** — pendurá-lo no sinal de derby é dupla-contagem e ressuscita o mito *under-em-clássico* que o próprio mrtip já relativizou.

**Recomendação:** tratar "formato de competição" como **camada de DADOS + heurística qualitativa (EXPLICAR)**, **não** como peso quantitativo calibrado por célula. O n amostral de derbies em mata-mata é pequeno demais (≈18 finais *country-derby* de UEFA em 70 anos) para calibrar formato×fase×stakes×tipo sem overfit. Próximo passo concreto e seguro: **migração de schema** (`stage`/`leg`/`aggregate`/`neutral_venue`/regra-de-desempate-versionada) + ajuste do sync, que beneficia DOS-001/MOD-001 inteiros, não só o derby. Tudo sob **gate de jogo responsável** (Lei 14.790): a camada é calibração interna com "porquê + fontes", **nunca** gancho de marketing "jogão hoje".

---

## Contexto e problema

### O brief
A pergunta do João: *o que apostadores/tipsters devem considerar num derby — em ligas, copas (mata-mata) e competições europeias.* A investigação de rivalidade existente ([rivalidade.md](../regras/rivalidade.md)) e o dossiê de [contexto/motivação](../mercados/contexto-motivacao-fatores.md) já cobrem **os efeitos do derby** (≈+30% cartões, mando que encolhe, bimodal *under-HT/over-FT*, ~65% dos grandes derbies passam de 2.5, lei do ex) — mas **nenhum condiciona esses efeitos ao formato da competição**. Esse é o gap-alvo: o **delta por formato**.

### Requisitos implícitos assumidos
- **Regulação BR (Lei 14.790/2023 + Portaria SPA/MF 1.231/2024):** derbies e finais são gatilhos emocionais de alto risco; a camada não pode virar gancho de "aposte no clássico" (ver [COMP-001](../features/conformidade/COMP-001-conformidade-jogo-responsavel.md) e §Riscos).
- **Estimar ≠ explicar** ([taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md)): só vira peso no quant o que sobrevive à closing line (SIN-012); o resto é narrativa.
- **Anti-dupla-contagem:** o efeito-copa genérico e o efeito-rivalidade são coisas distintas — não empacotar um no outro.
- **Código em inglês, dado em centavos, fuso `America/Sao_Paulo`.**

---

## Estado real no código (o que existe, o que falta)

| Item | Estado | Âncora | Nota |
|---|---|---|---|
| Tabela `match` | **real, só-liga** | [leagues.ts:38-61](../../apps/api/src/db/schemas/leagues.ts) | `round: integer` ([:44](../../apps/api/src/db/schemas/leagues.ts)); discriminador de competição é só `leagueCode` ([:41](../../apps/api/src/db/schemas/leagues.ts)). **Sem** `stage`, `stage_type`, `leg`, `aggregate_id`, `group_id`, `venue_id`, `is_neutral_venue`. |
| Estágio/fase (group vs knockout) | **fantasma** | — | Não existe coluna. Impossível saber se um match é liga, copa ou mata-mata. |
| `round` no sync | **bug latente p/ copa** | [sync-sportmonks.ts:314](../../apps/api/src/db/sync-sportmonks.ts) | `round: Number(f.round?.name ?? 0)` — converte o **nome** do round em número; num mata-mata o round chama "Final"/"Semi-Final" → vira **0**. Quebra silenciosamente fora de pontos corridos. |
| Include do sync | **real, incompleto** | [sync-sportmonks.ts:292](../../apps/api/src/db/sync-sportmonks.ts) | `participants;scores;round;state;lineups…;events.type` — **não traz `stage.type` nem `metadata`** (onde mora `neutral_venue`). |
| Normalização de zona/competição | **real, parcial** | [leagues.ts:104](../../apps/api/src/db/schemas/leagues.ts) + [sync-sportmonks.ts:137-140](../../apps/api/src/db/sync-sportmonks.ts) | Já mapeia `champions/europa/conference/relegation` por `developer_name` — prova que o sync já lê metadados textuais da SportMonks; estender pra `stage.type` é incremento, não obra nova. |
| Sinal de rivalidade | **investigado, não-implementado** | [SIN-007](../features/sinais/SIN-007-rivalidade.md) | Detecção (whitelist+distância+H2H) e efeitos cravados, mas competition-agnostic e sem código. |

> **Conclusão do estado real:** o produto é hoje **single-format (pontos corridos)**. Antes de qualquer ajuste de derby por formato, o schema precisa carregar o formato — e o `Number(round.name)` em [:314](../../apps/api/src/db/sync-sportmonks.ts) é um bug à espera de uma copa.

### Metadados que a SportMonks JÁ expõe (verificado na doc oficial)
Tudo abaixo é `verificado-fetch` na [doc SportMonks v3](https://docs.sportmonks.com/v3/endpoints-and-entities/entities/fixture):
- **`stage.type_id`**: `223` group-stage · `224` knock-out · `225` qualifying — [tipos de league/stage](https://docs.sportmonks.com/v3/definitions/types/leagues-and-stages). É o discriminador grupos vs mata-mata.
- **`league.sub_type`**: `domestic` · `domestic_cup` · `cup_international` · `international` · `play-offs` · `friendly` — liga vs copa vs continental.
- **`leg`** (string): `"1/1"` jogo único; `"x/y"` ida/volta. **`aggregate_id`** liga as duas pernas; **`group_id`** = grupo.
- **`round.name`** (`"Final"`, `"Semi-Final"`…) + **`placeholder: true`** = chave de mata-mata sem times definidos até o sorteio.
- **Campo neutro:** não está no fixture base — vem no include **`metadata` type_id 35 `neutral_venue`** ({neutral: bool}); o mesmo include traz **ATTENDANCE (578)** (dose-resposta de público), FORMATION, PITCH, LINEUP_CONFIRMED.
- **Prorrogação/pênaltis via `state`:** `AET=7`, `FT_PEN=8`, `INPLAY_ET=6`, `INPLAY_PENALTIES=9` ([states](https://docs.sportmonks.com/v3/definitions/states)); scores têm `EXTRA_TIME`/`EXTRA_TIME_ONLY` → dá pra **isolar gols de prorrogação** do baseline de 90 min.

---

## Estado da arte por formato (claims atômicos)

### A) Derby em LIGA (pontos corridos) — a baseline
- **Mando do mandante cai em derby** (BR Série A 2007-2011, p≤0.001, ES=5.5; mando geral ~51% dos pontos, derby fica abaixo). `snippet` · as-of 2007-2011 · [Volossovitch et al. (ResearchGate)](https://www.researchgate.net/publication/278158148_Home_advantage_in_derby_and_non-derby_matches_of_Premier_Brazilian_National_Football_League_played_from_2007_to_2011_seasons), [Taylor & Francis](https://www.taylorfrancis.com/chapters/edit/10.4324/9780203080443-10/home-advantage-derby-non-derby-matches-premier-brazilian-national-football-league-played-2007-2011-seasons-anna-volossovitch-jackson-cruz-ant%C3%B3nio-paulo-ferreira-ana-isabel-carita).
- **Por que "mando encolhe" é estrutural, não folclore:** a vantagem de mando cresce com a **distância** e satura ~100 km; derby local = distância ~0 → o componente "fadiga de viagem" some, sobra só torcida/familiaridade. `verificado-fetch` · [Bundesliga 57 anos (Springer)](https://link.springer.com/article/10.1007/s12662-021-00787-7).
- **Calibrar com dado recente:** o componente-distância do mando caiu ~50% em 57 anos (mando geral 67.9%→59.8% dos pontos). Não herdar coeficiente de paper antigo. `verificado-fetch` · mesma fonte Springer.
- **DELTA liga vs copa (chave):** a vantagem de mando é **similar** nos dois formatos **no tempo normal** (estudo holandês 2004-2023); a diferença aparece na **prorrogação** (mando some) e no **incentivo de eliminação**, não nos 90 min. `snippet` · as-of 2024 · [Incentives matter sometimes (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S2773161824000144), [Tinbergen DP 24-044](https://tinbergen.nl/discussion-paper/6349/24-044-v-incentives-matter-sometimes-on-the-differences-between-league-and-cup-football-matches). → **derby de liga é bom proxy do derby de copa nos 90 min.**
- **+cartões em derby é ligado a público cheio** (experimento natural COVID: portões fechados zeraram o excesso anti-visitante). Derby de liga lota → efeito máximo. `snippet` · [PMC9261922](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9261922/).
- **Grande derby já vem precificado:** book ajusta por exposição/volume ("emotional tax"), margem alarga em jogo de alta atenção → favoritismo de mando já aparado no preço. Valor (se existir) está em **divisão inferior/menos midiática**, onde o book gasta menos esforço analítico. `snippet` · [Fischer 2022 Kyklos](https://onlinelibrary.wiley.com/doi/10.1111/kykl.12291), [arXiv 2008.05417](https://arxiv.org/pdf/2008.05417).
- **Efeito-revanche (ida vs volta) = mito/inconclusivo** — neutralizado por ajuste do vencedor + regressão à média; sem fonte acadêmica forte. `snippet`/REFUTED.

### B) Derby em COPA / MATA-MATA — o maior delta
- **Regra de liquidação (verificada, 3 casas concordam):** 1X2, resultado e over/under = **90 min + acréscimos**; prorrogação, pênaltis e golden goal **NÃO contam**, salvo indicação do mercado. `verificado-fetch` · as-of 2025 · [Action Network](https://www.actionnetwork.com/soccer/soccer-betting-rules-does-extra-time-count-for-my-bets); Pinnacle/bet365 via snippet. → **Comprar over esperando "vai pra prorrogação e sai gol" é erro de regra.**
- **Mercados "to qualify"/"to advance"/"to lift the trophy" INCLUEM prorrogação+pênaltis** — é o mercado coerente com a eliminatória. Nunca confundir "vencedor da partida" (90 min) com "quem se classifica". `verificado-fetch` · mesma fonte.
- **Regra de desempate depende de competição E de rodada:** UEFA = prorrogação+pênaltis; **CONMEBOL/Libertadores = pênaltis direto no mata-mata, prorrogação só na final** (jogo único neutro); EFL Cup = sem prorrogação exceto final. `verificado-fetch` · [Bolavip CONMEBOL](https://bolavip.com/en/soccer/conmebol-eliminates-away-goal-rule-in-an-effort-to-increase-sporting-justice--20211125-0014.html), [Wikipedia EFL Cup](https://en.wikipedia.org/wiki/EFL_Cup). → premissa de uma copa **não transfere** pra outra.
- **"Vantagem de jogar a volta em casa" = largamente MITO no futebol moderno:** 52,5% (324 jogos CL desde 1995, ~50%); estudos antigos (54,3%, 1955-2006) não se sustentam. `verificado-fetch` · [Behavioural Spectator](https://www.behaviouralspectator.com/post/the-curious-case-of-second-leg-home-advantage), [Jost 2024 Wiley](https://onlinelibrary.wiley.com/doi/full/10.1002/mde.3982). ⚠️ **Conflito interno:** outra frente achou ~56% avançam jogando a volta em casa, com gols do mandante +33% da ida (1,27) pra volta (1,68) ([JRSS-A](https://doi.org/10.1111/rssa.12338)). Leitura conciliada: o **viés bruto** existe mas é **explicado por força do time**, não pela ordem dos jogos → não pagar prêmio por "joga a volta em casa".
- **Ida mais cautelosa, volta mais agressiva** (sobretudo se um lado precisa reverter): viés *under* na ida, *over* na volta. `snippet` · direção, não magnitude.
- **"Under do mata-mata" é direcional mas CONFUNDIDO:** WC tem mais gols nos grupos que no mata-mata, mas grupos incluem goleadas contra fracos e mata-mata junta times parelhos. Não é efeito limpo. `verificado-fetch` · [FootballHistory](https://www.footballhistory.org/world-cup/statistics.html). → **não é rivalidade, é incentivo de copa** (ver §Refutado).
- **Fases iniciais ≠ final:** zebra concentra cedo (FA Cup ~99,85%/ano de upset de 1 divisão) e grandes **rotacionam elenco** (EFL Cup); derby de fase inicial pode ter favorito poupando. `verificado-fetch` · [OLBG](https://www.olbg.com/blogs/third-round-giant-killings), [Wikipedia EFL Cup](https://en.wikipedia.org/wiki/EFL_Cup).
- **Final em sede neutra:** ver §C/§Refutado — **atenua, não zera** o mando.

### C) Derby em COMPETIÇÕES EUROPEIAS / continentais
- **Derby doméstico clássico é raro no mata-mata europeu** — o gatilho vira **rivalidade transfronteiriça recorrente** (Real-Bayern, 29 jogos, o mais frequente da UCL) e **grudge** acumulado (Barça-PSG pós-Remontada). Detectar por H2H+narrativa, não por "mesma liga". `verificado-fetch` · [CBS Remontada](https://www.cbssports.com/soccer/news/what-was-the-remontada-the-game-that-turned-psg-vs-barcelona-into-a-modern-champions-league-grudge-match/).
- **Árbitro UEFA tem own-nationality bias:** +10% de chamadas favoráveis ao conterrâneo, **maior nas fases finais** e pra jogadores de seleção; árbitro neutro **não zera** viés pró-mandante (visitante leva ~25% mais amarelo). `snippet` · as-of 2015 · [Pope & Pope, Economic Inquiry](https://onlinelibrary.wiley.com/doi/abs/10.1111/ecin.12180). → cruzar **nacionalidade do árbitro × times** vira feature de cartão/pênalti que o modelo doméstico não captura.
- **Mando desaba elite-vs-elite (confirma e generaliza "mando some em derby"):** HA cai de 64-79% (vs fracos) para 32-79% (vs fortes); só ~9 superclubes (Bayern, Barça, Real, PSG, Liverpool, City, United, Juventus, Ajax) mantêm mando contra qualquer um. `verificado-fetch` · as-of 2024 · [PMC11079936](https://pmc.ncbi.nlm.nih.gov/articles/PMC11079936/).
- **Viagem/fadiga = DELTA por competição:** efeito significativo **só na Conference League** (p=0.006; win rate do visitante <15% em viagem extrema), **não** na UCL (p=0.292) nem UEL (p=0.658) — elite tem logística/rodízio. Jet-lag genérico é misto/inconclusivo. `verificado-fetch` · [Statathlon](https://statathlon.com/travel-stress-in-european-competitions/), [medRxiv 2023](https://www.medrxiv.org/content/10.1101/2023.10.19.23296960v1.full.pdf).
- **"Especialista em noites europeias" (Celtic Park) = FOLCLORE** até prova: anedótico, não isolado da força do elenco. `snippet`/fraca.
- **Rivalidade política transfronteiriça é majoritariamente de SELEÇÃO**, não clube (Rússia banida; clubes ucranianos jogam em sede neutra → mando neutralizado). No nível clube é rara. `verificado-fetch` · [Sportcal](https://www.sportcal.com/features/when-geopolitics-seeps-into-sport-uefas-forbidden-soccer-fixtures/).

### D) Stakes/motivação × formato
- **Stakes→cartões é CONTÍNUO:** Z3-vs-Z3 na PL, booking points 34 (ago-mar) → 40 (abr) → **45 (mai)**, +32% só pela importância crescente — mesmo confronto, stakes maiores = mais cartões. `verificado-fetch` · [Racing Post/Pullein](https://www.racingpost.com/sport/opinion/card-counts-can-go-up-in-premier-league-relegation-battles-as-season-nears-end-aSv2l0Z7uAYS/). Reforço: +£1M no prêmio esperado → +0,07 faltas/jogo (`snippet`, [Foul Play](https://www.sciencedirect.com/science/article/pii/S2773161825000072)).
- **Dead rubber suprime o prêmio de derby:** time já classificado/eliminado roda reservas, intensidade cai → *under* e neutraliza parte da rivalidade. `verificado-fetch` · [Csató arXiv](https://arxiv.org/pdf/2509.13141).
- **Decisão unilateral cria assimetria** (o lado que mais precisa ganha leve viés arbitral; psicologia favorito-que-precisa→choke/under, azarão "nada a perder"→solto). `verificado-fetch`/`snippet` · [Referee-team relationships](https://footballperspectives.org/refereeteam-relationships-and-yellow-cards-football/), [Motivating underdogs and favorites](https://www.sciencedirect.com/science/article/abs/pii/S0749597815302028).
- **⚠️ A interação "rivalidade × stakes" em si não tem coeficiente medido** — é triangulação por composição (stakes→cartões + rivalidade→cartões), não um efeito isolado num paper. Ordenamento *mata-mata > grupos contestados > liga comum > dead rubber* é **inferência**, não calibração.

### E) Eficiência de mercado por tipo de competição
- **Liga líquida (PL/La Liga/Serie A) é majoritariamente eficiente** no longo prazo; back-home ROI -1.7%, estratégia de sentimento só +3.1% (não bate margem robusto). `verificado-fetch` · as-of 2024 · [Winkelmann et al. (2024)](https://journals.sagepub.com/doi/10.1177/15270025231204997). Margens caíram de >10% para ~5% (Pinnacle 2-3%). → **derby de liga top não é EV+ automático.**
- **Favourite-longshot bias:** favorito subprecificado (EV+), empate/longshot inflado. `verificado-fetch` · [Cain, Law, Peel (2000)](https://ideas.repec.org/a/bla/scotjp/v47y2000i1p25-36.html).
- **CLV é o juiz:** medir edge de derby contra a **closing line sharp** (Pinnacle vig-free), nunca por win/loss; ~100+ apostas pra separar skill de variância. `verificado-fetch` · [VSiN CLV](https://vsin.com/how-to-bet/the-importance-of-closing-line-value/).
- **⚠️ O "valor em mercados secundários/ligas menores" é economicamente frágil** (ver §Refutado): o vig do mercado HT chega a ~10,82% (vs 5,4% no 1X2) e a liquidez não suporta volume.

---

## Decisão de arquitetura: a camada é QUANT ou EXPLICAR?

A hipótese inicial era condicionar o **sinal de rivalidade** por formato como feature do quant. **Os dois refutadores convergiram: não.** A decisão cravada:

| Componente | Camada | Por quê |
|---|---|---|
| **Metadados de formato no schema** (stage/leg/aggregate/neutral_venue/regra-desempate) | **DADOS** (DOS-001) | Fato de fixture. Pré-requisito de tudo. ROI alto, custo de calibração zero. |
| **Regra de liquidação 90 min vs to-qualify** | **DADOS/produto** | Fato de regra de mercado, não aposta. Evita induzir o usuário a erro (e a Lei 14.790). Modelar por **tipo de mercado**, não só por formato. |
| **Mando: atenuar em derby; atenuar+assimetria em sede neutra; some na prorrogação** | **QUANT** (MOD-001/SIN-016) | Efeito de mando é calibrável e generaliza; o *formato* só liga/desliga o componente. |
| **Efeito-copa genérico (knockout menos gols/mando)** | **QUANT** (MOD-001), **feature própria** | É de incentivo/formato, **não** de rivalidade. Separar pra não dupla-contar. |
| **Condicionar a INTENSIDADE da rivalidade por formato/stakes** | **EXPLICAR** (LLM), heurística | n amostral insuficiente p/ calibrar célula (≈18 finais country-derby UEFA em 70 anos). Overfit garantido. |

> **Princípio:** o formato entra como **roteador de quais ajustes já calibrados ligam/desligam** (mando on/off, prorrogação on/off, regra de liquidação) — não como um novo peso de "derby em copa = +X". O que não tem amostra vira narrativa do dossiê, com "porquê + fontes".

---

## Modelo de dados proposto

Migração na tabela `match` ([leagues.ts:38](../../apps/api/src/db/schemas/leagues.ts)) — todas nullable (fixtures antigos ficam null):

```
stage_id          integer            -- SportMonks stage id
stage_type        text               -- "group" | "knockout" | "qualifying" | "regular" (de type_id 223/224/225)
competition_kind  text               -- de league.sub_type: "domestic" | "domestic_cup" | "cup_international" | ...
leg               text               -- "1/1" | "1/2" | "2/2"
aggregate_id      integer            -- liga as duas pernas de um confronto
group_id          integer
is_neutral_venue  boolean            -- de metadata type_id 35
round_name        text               -- "Final"/"Semi-Final"/... (preserva o que o Number(round.name) destrói hoje)
tiebreak_rule     text               -- VERSIONADA por competição+temporada: "et_pens" | "pens_direct" | "away_goals" | "concacaf_partial"
```

- **Sync** ([sync-sportmonks.ts:292](../../apps/api/src/db/sync-sportmonks.ts)): adicionar `stage.type;metadata` ao include; parar de coagir `round` via `Number(round.name)` ([:314](../../apps/api/src/db/sync-sportmonks.ts)) — guardar `round_name` textual e só numerar quando `stage_type="regular"`.
- **`tiebreak_rule` versionada** (não booleano "é mata-mata"): a Copa do Brasil usou gol fora até 2017; calibração que cruza pré/pós sem versionar contamina. Tabela de regra por (competição, temporada).
- **Detecção de rivalidade não-local** (complementa [fontes-rivalidade.md](../research/fontes-rivalidade.md)): adicionar [Wikipedia — club rivalries in Europe](https://en.wikipedia.org/wiki/List_of_association_football_club_rivalries_in_Europe) (cross-border, ideológicas pós-Iugoslávia) e o tier **"Rivalries"** do [footballderbies.com](https://www.footballderbies.com/) (já separa geográfico de não-geográfico). Wikidata **não tem** propriedade de rivalidade — só P54/P625; rivalidade não-local depende de whitelist curada.

---

## Plano por faceta

- **dados (DOS-001 + sync):** migração de schema acima; include `stage.type;metadata`; corrigir o `round`; popular `tiebreak_rule`. **Maior ROI, faz primeiro.** Habilita LIG-002 (perfil de time) e MOD-001 a saberem o formato.
- **ia/quant (MOD-001):** (1) feature **efeito-copa genérico** (knockout) separada da rivalidade; (2) roteador de mando (atenua em derby; atenua+assimetria-de-torcida em `is_neutral_venue`; zera na prorrogação via state); (3) feature **árbitro × nacionalidade** em competição internacional (SIN-009); (4) penalidade de viagem ao visitante **só em Conference**.
- **ia/narrativa (SIN-007 EXPLICAR):** dossiê explica a intensidade do clássico condicionada ao formato/stakes como contexto qualitativo, com "porquê + fontes" — sem mexer na probabilidade.
- **api:** expor `stage_type`/`leg`/`is_neutral_venue`/`tiebreak_rule` no contrato do match para o dossiê.
- **ui:** badge de formato (liga/copa/mata-mata/final) e aviso de jogo responsável reforçado em derby/final (gate Lei 14.790).

---

## Riscos e gotchas

1. **Dupla-contagem efeito-copa × rivalidade** — o "under do mata-mata" é genérico de incentivo; se entrar no sinal de derby, conta duas vezes e contradiz o "~65% dos grandes derbies passam de 2.5" já cravado.
2. **Contaminação de calibração por regra de desempate** — Copa do Brasil com gol fora até 2017; sem `tiebreak_rule` versionada, o backtest mistura mundos.
3. **Overfit por fragmentação amostral** — formato×fase×stakes×tipo estilhaça um n já pequeno; manter como heurística, não peso.
4. **Bug do `round`** — [sync-sportmonks.ts:314](../../apps/api/src/db/sync-sportmonks.ts) zera o round em qualquer mata-mata; corrigir junto com a migração.
5. **Jogo responsável (Lei 14.790, art. 16-17 + Portaria 1.231/2024)** — escalar o **realce** do pick com a emoção/stakes do jogo colide com a vedação de publicidade "socialmente atraente"/"vantagem garantida". A camada é calibração interna, **nunca** gancho de marketing. `verificado-fetch` · [Lei 14.790 — Publicidade](https://modeloinicial.com.br/lei/L-14790-2023/publicidade-da-propaganda-@____V_II), [Portaria/MF](https://www.gov.br/fazenda/pt-br/assuntos/noticias/2024/agosto/nova-portaria-da-fazenda-estabelece-que-operadores-de-apostas-poderao-ser-responsabilizados-por-publicidade-abusiva).
6. **Liquidez/vig dos mercados secundários** — o "valor em derby de liga menor / mercado secundário" some no vig (HT ~10,82%) e não escala em stake. Tratar como hipótese, não como tese de produto.

---

## Refutado (com a evidência que matou)

- **❌ "Abolir o gol fora deixou a ida mais aberta → over."** Única medição acadêmica (n=112 mata-matas CL, 56 com regra / 56 sem): mandantes marcaram **MENOS** gols sem a regra, com quedas significativas (p<0,05) em passes progressivos, contra-ataques e duelos — jogo **menos** ofensivo. A regra antiga *promovia* ataque. `verificado-fetch` · [Tandfonline 2024](https://www.tandfonline.com/doi/full/10.1080/24748668.2024.2354114), [J. Policy Modeling 2025](https://ideas.repec.org/a/eee/jpolmo/v47y2025i1p78-96.html). **Não criar ajuste de over-na-ida pós-abolição.**
- **❌ "Gol fora é um traço/seletor de formato UEFA-2021."** Abolição é quase universal (UEFA 2021/22, CONMEBOL 2022, AFC 2023/24, Copa do Brasil 2018; só CONCACAF mantém versão parcial). O valor é o mesmo (ausente) em quase todo mata-mata atual → não serve de variável condicionante; usar **`tiebreak_rule` versionada**. `verificado-fetch` · [Away goals rule (Wikipedia)](https://en.wikipedia.org/wiki/Away_goals_rule), [Goal.com BR](https://www.goal.com/br/not%C3%ADcias/gol-fora-de-casa-na-copa-do-brasil-nao-e-mais-criterio-de-desempate-veja-o-regulamento/vm3dpteghpid18ppz6qdsjouq).
- **❌ "Final em sede neutra ZERA o mando."** Neutro é **intermediário** (~65% vitória do favorito vs ~80% em casa) e costuma ser **quase-mando** da torcida que viaja. "Zerar" contradiz o próprio "fade do público em final". Correto: **atenuar + checar assimetria de torcida**. `snippet` · [Home advantage (Wikipedia)](https://en.wikipedia.org/wiki/Home_advantage).
- **❌ "Under do mata-mata é efeito de rivalidade."** É efeito **genérico de copa/incentivo** (mando 0.27 vs 0.51 gols, mas só significante a 10% — fraco), vale pra qualquer jogo de copa, derby ou não. Empacotá-lo na rivalidade = dupla-contagem + ressuscita o mito *under-em-clássico*. `verificado-fetch` · [Incentives matter sometimes (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S2773161824000144).
- **❌ "Vantagem de jogar a volta em casa."** Largamente mito no futebol moderno (~50% em amostra CL pós-1995); viés bruto explicado por força do time. `verificado-fetch` · [Behavioural Spectator](https://www.behaviouralspectator.com/post/the-curious-case-of-second-leg-home-advantage).
- **❌ "Fade do público em noites europeias é edge replicável."** São os jogos de **maior liquidez/atenção sharp**; o viés do público já está na closing line. `verificado-fetch` · [Market efficiency & closing line](https://joesaumarez.co.uk/sports-betting-market-efficiency-and-the-closing-line).
- **❌ "Efeito-revanche ida/volta na liga."** Sem suporte; regressão à média. `snippet`.

---

## Perguntas abertas / lacunas

- **Decisão do dono:** o "efeito-copa genérico" (knockout) merece **feature própria** (ex.: SIN-021 "formato de competição") ou fica como feature interna do MOD-001? A taxonomia de sinais é curada pelo dono — não auto-criei.
- **NEI (não achei fonte confiável):** magnitude exata de gols/jogo de derby **em mata-mata vs liga** controlando força; effect-size do *under-ida/over-volta*; cartões/jogo da UCL vs ligas domésticas (fontes paywalled); interação rivalidade×stakes com coeficiente próprio; viés de árbitro/viagem específico da **Libertadores** (distâncias sul-americanas enormes — provável edge, não verificado).
- **Frescor a confirmar em runtime:** IDs numéricos de `league.sub_type`; entidade `Aggregate` (sem doc dedicada); se fixtures antigos da SportMonks trazem `metadata.neutral_venue` (doc avisa que campos podem vir vazios em jogos antigos). Testar com token real no sync.
- **Cobertura BR das fontes de rivalidade não-local** é fraca (Wikipedia Europa é UEFA-only); para clássicos BR o caminho segue sendo whitelist manual + distância + H2H (já cravado em [fontes-rivalidade.md](../research/fontes-rivalidade.md)).
- **Verificação-fetch pendente:** vários números do bloco A (paper BR, paper holandês) vieram de `snippet` (ResearchGate/ScienceDirect deram 403); direção triangulada, magnitude não lida em página viva.

---

## Evidências decisivas

- [Incentives matter sometimes (ScienceDirect 2024)](https://www.sciencedirect.com/science/article/pii/S2773161824000144) — mando similar liga vs copa nos 90 min; diferença é incentivo/prorrogação. Funda o "derby de liga é proxy do de copa".
- [Effect of away goal rule on technical performance, UCL (Tandfonline 2024)](https://www.tandfonline.com/doi/full/10.1080/24748668.2024.2354114) — **refuta** "abolir gol fora → mais ataque/over".
- [Away goals rule (Wikipedia)](https://en.wikipedia.org/wiki/Away_goals_rule) — timeline de abolição por confederação; Copa do Brasil até 2017 → exige `tiebreak_rule` versionada.
- [HA in CL: valid for all teams? (PMC11079936)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11079936/) — mando desaba elite-vs-elite; generaliza "mando some em derby".
- [SportMonks Fixture entity](https://docs.sportmonks.com/v3/endpoints-and-entities/entities/fixture) + [States](https://docs.sportmonks.com/v3/definitions/states) — `stage.type`/`leg`/`aggregate_id`/`metadata.neutral_venue`/`AET`/`FT_PEN` já disponíveis; viabiliza a migração.
- [Winkelmann et al. (2024)](https://journals.sagepub.com/doi/10.1177/15270025231204997) — ligas líquidas eficientes; derby de liga top não é EV+ automático.
- [Lei 14.790 — Publicidade (art. 16-17)](https://modeloinicial.com.br/lei/L-14790-2023/publicidade-da-propaganda-@____V_II) — gate de jogo responsável sobre realce de pick em derby/final.
