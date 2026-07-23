# Viagem / deslocamento dos times (km, modal, “perto”)

> **As-of:** 2026-07-23 · **Feature:** SIN-023 · **Tier:** tema amplo  
> **Brief:** como times viajam; o que o mrtip já tem (venue geo, `travelKm`, SIN-008); o que meter nos 2 prompts **sem inventar modal**. Responder: (1) medir km · (2) dá pra saber modal? · (3) “perto” por liga · (4) MVP nos prompts · (5) Mapbox? · (6) feature nova vs estender SIN-008.  
> **Requisitos implícitos:** Lei 14.790 (+18, jogo responsável, sem promessa de ganho); dinheiro em centavos; fuso `America/Sao_Paulo`; separação quant/LLM; “todo pick mostra o porquê + fontes”; Achados REFUTED de `calendario-fadiga.md` / SIN-008 **não** re-litigados (fadiga crua ≈ mando já precificado; altitude Conmebol fica em SIN-008). ≠ W-049 (km que o jogador correu **na** partida).

## TL;DR + recomendação

**Carve-out SIN-023** (espelhando SIN-020): o objeto é **deslocamento geográfico por jogo no dossiê/prompt**, distinto da ressaca de calendário/altitude (SIN-008) e das janelas sazonais (SIN-020). O código já calcula um proxy de `travelKm` (haversine estádio-casa do visitante → venue do jogo) e injeta uma linha no `## Contexto` — incompleto e assimétrico. **MVP endurecido (pós counter-review):** (1) medir km com **haversine venue→venue** (great-circle), preferindo a **perna inbound do visitante** = venue do `lastMatchAnyComp` → venue do jogo (fallback = proxy atual se faltar geo do jogo anterior); (2) **omitir modal** — não há limiar oficial da PL e o 500 km da CBF é **custeio do feminino**, não fisiologia; (3) **não** rotular bins “curta/média/longa” como edge — mostrar **km bruto + proveniência** (“great-circle; modal desconhecido”) + **nota de escala por liga** (p50/p90 do nosso banco); (4) **casa: omitir por default** (last-leg do mandante costuma ser viagem de **volta** já feita dias antes); (5) camada **EXPLAIN** nos 2 prompts (vivo + super herda o Contexto), com doutrina SIN-008 (não dupla-contar mando; sem mover λ); (6) **Mapbox fora do MVP de rota** — geo PL/BRA já 100%; geocode só se furar. Cumulative travel / fuso / modal observado = pós-MVP.

## Contexto e problema

João quer km nos dois prompts de prognóstico; tem key Mapbox; não sabe limiar modal. Avaliação prévia sugeria haversine última perna + omitir modal + Mapbox só geocode — esta `/rs` **confirma a direção** mas **endurece** após counter-review: last-leg simétrico home+away e bins ordinais reaqueciam a falácia de fadiga que SIN-008 já matou.

## Estado real no código

| Achado | Tipo | Âncora |
|---|---|---|
| `haversineKm` (R=6371, arredonda km) | **real** | `apps/api/scripts/prognosis-prompt.ts:28-36` |
| `travelKm` = haversine(venue do jogo, venue do **último jogo em casa** do visitante) — **não** é last-leg | **real** (proxy) | `prognosis-prompt.ts:901-909` |
| Injeção no prompt: `- Viagem do visitante: ~N km` | **real** | `prognosis-prompt.ts:1940` |
| Doutrina Descanso/fadiga no Contexto (sem doutrina específica de viagem) | **real** | `prognosis-prompt.ts:1943` |
| Super lista `descanso/viagem` como bloco `contexto` e herda fatia `## Contexto`→PARTE 3 | **real** | `apps/api/scripts/super-prognosis.ts:335` (+ herança via spawn do prompt vivo) |
| `lastMatchAnyComp` (liga∪copa) já existe p/ descanso — base natural do last-leg | **real** | `prognosis-prompt.ts:817-822` |
| Schema venue lat/lon numeric(9,6); match.venueId FK | **real** | `apps/api/src/db/schemas/leagues.ts:80-81` · `:125` |
| Comentário do schema ainda atribui lat/lon a “travel/fatigue signal (SIN-008)” | **real** (débito de naming) | `leagues.ts:69-71` |
| UI mostra descanso (LIG-005); **não** mostra km de viagem | gap/display | `apps/web/.../prognosis.tsx` RestPanel |
| Modal / Mapbox / Flightradar24 / altitude por venue | **fantasma** | zero no código produto |
| Introduzido no mesmo nascimento do prompt | git | `c9bb684` (2026-06-29) — `git log -S travelKm` |

**Cobertura de dados (query read-only desta sessão, 2026-07-23):**

| Liga | venues com geo | matches com geo |
|---|---|---|
| PL | 24/24 | 760/760 |
| BRA | 31/31 | 760/760 |
| FAC | 82/82 venues, mas só **123/871** matches com venue geo | buraco de sync em copa |
| All venues | **1734/1734** com lat/lon | — |

**Distribuição km (amostra finished, haversine, 2026-07-23):**

| Métrica | PL | BRA |
|---|---|---|
| Proxy atual (casa visitante→jogo) p50 / p90 / max | 180 / 357 / 472 | 722 / 2314 / 3202 |
| Last-leg **away** p50 / p90 | 257 / 378 | 765 / 2177 |
| Last-leg **home** ≤30 km | 73/200 (≈37%) | 57/200 |
| Home prev = away | 147/200 | 147/200 |

Leitura: na PL **nada** passa de ~500 km no proxy; no BRA a mediana já é “longa” na escala inglesa. Last-leg do mandante frequentemente **não** é “perto” em km (é a volta do jogo anterior) — por isso **não** entra no MVP como fadiga do jogo atual.

**Docs vizinhos lidos (obrigatório):** `docs/regras/calendario-fadiga.md` (fadiga crua REFUTED; distância não-sig controlando força; altitude fica); `docs/investigacoes/venue-estadio-geo.md` + LIG-004 (geo SportMonks, sem geocoding); `docs/investigacoes/mando-de-campo.md` (viagem = componente do mando; distância pura fraca na era moderna); SIN-020 (carve-out macro-sazonal); wishlist W-007/W-008→LIG-004, W-019→LIG-005, **W-049 = tracking in-match ≠ este tema**.

## Estado da arte / mercado (claims atômicos)

### PL / Europa — modal e limiares

| # | Claim | Veredito | Fonte | Conf | As-of |
|---|---|---|---|---|---|
| P1 | A Premier League **não** manda centralmente o plano de viagem dos clubes | SUPPORTED | https://www.bbc.co.uk/sport/football/65017565 | verificado-fetch | 2026-07-23 |
| P2 | Em jan–mar/2023, BBC+Flightradar24: **81** voos domésticos em **100** jogos (média ~42 min; mais curto 27 min) | SUPPORTED | mesma URL | verificado-fetch | 2026-07-23 |
| P3 | Tottenham declara política interna: ônibus em trajetos **&lt; 2,5 h** “whereby performance is not compromised” (clube, não liga) | SUPPORTED | https://www.mirror.co.uk/sport/football/news/tottenham-manutd-flight-maddison-video-33814616 | verificado-fetch | 2026-07-23 |
| P4 | Campanha Possible: ~84% dos jogos fora da PL alcançáveis de ônibus em &lt;4,5 h | SUPPORTED (single-origin campanha) | Mirror citando Possible (mesma URL) | snippet→citado | 2026-07-23 |
| P5 | Existe limiar **oficial** PL km/h ônibus×avião | **REFUTED** | BBC + FA: clubes decidem | verificado-fetch | 2026-07-23 |

### BR / Conmebol

| # | Claim | Veredito | Fonte | Conf | As-of |
|---|---|---|---|---|---|
| B1 | Imprensa calcula ranking de km do Brasileirão em **linha reta cidade↔cidade** (ida+volta) — Remo ~93–97k km na Série A 2026 | SUPPORTED | https://ge.globo.com/pa/futebol/brasileirao-serie-a/noticia/2026/01/27/remo-vai-bater-recorde-em-distancia-percorrida-com-viagens-no-brasileirao-veja-ranking.ghtml | verificado-fetch | 2026-07-23 |
| B2 | CBF **feminino A1** (prática reportada): entidade só banca avião em deslocamentos **&gt;500 km** (já foi 700 km; baixou em 2023) — regra de **custeio**, não de fisiologia; Série A masculina sem teto de distância p/ avião custeado | SUPPORTED | https://ge.globo.com/futebol/futebol-feminino/brasileiro-feminino/noticia/2025/06/13/brasileiro-feminino-como-clubes-encaram-regra-da-cbf-para-viagens.ghtml | verificado-fetch | 2026-07-23 |
| B3 | Em feminino &lt;500 km, ônibus é o default; clubes ricos às vezes arcam com voo | SUPPORTED | mesma URL | verificado-fetch | 2026-07-23 |
| B4 | Altitude Conmebol / McSharry | **não re-litigado** — fica em SIN-008 / `calendario-fadiga.md` | herdado | — | — |
| B5 | REC **Copa do Brasil 2026** (oficial): passagens **rodoviárias até 500 km** / **aéreas acima de 500 km** — ainda **custeio de logística**, não limiar fisiológico nem regra do Brasileirão Série A | SUPPORTED | https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/REC_Copa_do_Brasil_2026_7c91253458.pdf | verificado-fetch | 2026-07-23 |

### Ciência / performance

| # | Claim | Veredito | Fonte | Conf | As-of |
|---|---|---|---|---|---|
| S1 | Wellness em ground travel (academy) correlaciona com distância; tendência a **platô ~600–700 km** (ou 7–8 h) | SUPPORTED (amostra jovem IR/PSG academy; wellness, não gols) | https://hrcak.srce.hr/clanak/251520 | verificado-fetch | 2026-07-23 |
| S2 | Autores sugerem que **duração** do trip pode pesar mais que bus vs avião *per se* | SUPPORTED (discussão do paper) | mesma | verificado-fetch | 2026-07-23 |
| S3 | A-League: modelo com **modalidade** explica performance física melhor que home/away; road no dia do jogo pior que voo com chegada antecipada | SUPPORTED | https://doi.org/10.1016/j.jsams.2023.08.151 | verificado-fetch | 2026-07-23 |
| S4 | Elite NA soccer: métricas de viagem **agudas** sem associação clara com outcome; **cumulativo** (distância/tempo/time-away) associações **pequenas** | SUPPORTED | https://pubmed.ncbi.nlm.nih.gov/39079688/ | verificado-fetch | 2026-07-23 |
| S5 | Distância de viagem → under/gols como sinal cru | **já REFUTED** em SIN-008 (confundidor mando; distância não-sig controlando força) | `docs/regras/calendario-fadiga.md` · `docs/investigacoes/mando-de-campo.md` | herdado | — |

**Paridade vs diferencial:** mostrar “estádio + km do visitante” é paridade barata de preview. Diferencial mrtip = km **auditável** (fonte = venues SportMonks) com proveniência e sem teatro de modal inventado — alinhado a “porquê + fontes”.

## Opções (matriz) → recomendação

| Opção | O quê | Prós | Contras | Veredito |
|---|---|---|---|---|
| **A** Last-leg haversine (2 times) | prev venue → jogo | honesto p/ visitante em sequência fora | mandante: confunde volta com inbound; acute ≈ null em elite (S4) | **parcial** — só away inbound |
| **B** Proxy atual (casa visitante→jogo) | já no código | estável, sempre tem “casa” | erra quando time veio de outro fora / copa | **fallback** |
| **C** Mapbox road km | Directions API | km de estrada | custo; modal implícito falso; geo já basta | **fora do MVP** |
| **D** Inferir modal por limiar | &lt;X ônibus / &gt;X avião | narrativa rica | **inventa fato**; limiar PL inexistente (P5); 500 km CBF ≠ fisiologia (B2); A-League mostra modal≠km (S3) | **proibido** |
| **E** Flightradar24 / feeds | modal observado | verdade operacional | fragilidade, custo, não cobre ônibus; BBC usou pra jornalismo | **fora** |
| **F** Bins curta/média/longa sem modal | ordinal | “perto” legível | bins viram edge narrativo sem calibração (counter-review) | **suavizar** → escala p50/p90, sem rótulo de edge |

### Recomendação cravada (com o que o counter-review matou)

1. **Medir:** haversine (`haversineKm` já existe). Primário = **away inbound last-leg** via venue de `lastMatchAnyComp(away)` → `matchVenue`. Fallback = proxy B. Rotular no texto: `~N km (great-circle venue→venue; modal desconhecido)`.
2. **Modal:** omitir. Não inventar. Não usar 500 km CBF (custeio — B2/B5), 2,5 h Spurs (política de clube — P3) nem 4–4,5 h de campanhas ambientais como regra do produto.
3. **“Perto” por liga (contexto, não edge):** PL — mediana proxy ~180 km, teto doméstico &lt;500 km; BRA — mediana ~720 km, cauda &gt;2000 km. No prompt: uma linha de escala (“nesta liga, p50 visitante ≈ …”) derivada de constante/tabela por `leagueCode`, **sem** “viagem longa → under”.
4. **MVP nos 2 prompts:** editar bloco Descanso/Viagem no vivo; super herda. Doutrina explícita: EXPLAIN; não move λ; não dupla-conta com mando (SIN-016/SIN-008); assimetria de descanso já na linha ao lado.
5. **Mapbox:** não. Cobertura geo PL/BRA = 100% hoje. Geocode só se query `missing_geo` &gt; 0.
6. **Feature:** **SIN-023 nova** (não só aprofundar SIN-008). SIN-008 continua dono de calendário≤3d + altitude. SIN-023 dono de **km geográfico no dossiê**. Atualizar comentário `leagues.ts:69-71` no `/i` pra citar SIN-023.

### O que o counter-review levantou (e o que sobreviveu)

- **Matou:** last-leg simétrico home+away; bins ordinais como sinal; modal omitido **e** bins que implicam ranking; “EXPLAIN never weights λ” como firewall suficiente sem doutrina anti-fadiga.
- **Sobreviveu:** não inventar modal; haversine barato sem Mapbox routing; ID separado **se** o constructo for geo no prompt com guardrails SIN-008.
- **Endurecimento aplicado:** away-only inbound; km bruto + proveniência + escala liga; sem bins de edge; cumulative = aberto.

## Modelo de dados proposto

**MVP zero schema:** reusar `venue.latitude`/`longitude` + `match.venueId` + `lastMatchAnyComp`. Função pura `travelInboundKm(teamId, matchVenue)` no script do prompt.

**Pós-MVP (opcional):** materializar `match_team_travel` (`matchId`, `teamId`, `fromVenueId`, `toVenueId`, `haversineKm`, `method: last_leg|home_proxy`) pra UI/audit — não bloqueia `/pl` do prompt.

Altitude continua fora (SIN-008 / coluna futura se entrar).

## Plano por faceta

- **dados** — nenhum no MVP; query de cobertura geo no `/i`; opcional materialização depois.
- **api** — opcional depois: campo `travel: { awayKm, method, note }` no get-match/prognosis (paridade com RestPanel).
- **ia** — **P0:** `prognosis-prompt.ts` (cálculo + linha + doutrina); super herda. Travas no texto do prompt. Zero peso em λ.
- **ui** — opcional P2: linha “Viagem do visitante: ~N km” no painel Descanso (auditabilidade).

## Riscos e gotchas

1. **Copa/seleção sumida** — `lastMatchAnyComp` só vê o que está ingerido (FAC com buraco de venue geo); last-leg pode pular perna real.
2. **Campo neutro / mando invertido** — usar `match.venueId` (já correto na LIG-004).
3. **Dupla contagem com mando** — km do visitante é componente do home advantage; doutrina obrigatória.
4. **Acute vs cumulative** — MVP acute pode ter efeito nulo em outcomes (S4); honestidade no copy.
5. **Bins / linguagem causal** — risco Lei 14.790 / indução; proibir “viagem longa = under” no prompt.
6. **FAC geo esparso** — last-leg cross-cup degrada; fallback proxy.
7. **≠ W-049** — tracking de km na partida é outro dado.

## Refutado

- Limiar oficial PL ônibus×avião — REFUTED (P5).
- “Precisa Mapbox pra ter km no prompt” — REFUTED (LIG-004 + cobertura 100% PL/BRA + `haversineKm` já existe).
- “500 km CBF = limiar fisiológico universal / inferível no prompt” — REFUTED (B2/B5: custeio de passagens em RECs/imprensa; não prova ônibus×avião nem efeito em gols).
- “Fadiga/viagem crua → under sistemático” — já REFUTED em SIN-008; não reaberto.
- “Geocoding externo obrigatório” — já REFUTED em `venue-estadio-geo.md`.
- Last-leg **home+away** como upgrade default — REFUTED pelo counter-review + dados (home last-leg ≠ inbound do kickoff) + S4.

## Perguntas abertas / lacunas

1. **Escala no prompt:** constantes por liga (p50/p90) vs só km bruto — decisão de copy no `/pl`.
2. **Cumulative away-km / time-away** como v2 (S4 sugere mais sinal que acute) — vale `/rs` curto depois do MVP?
3. **Fuso / direção** (leste×oeste) no Brasileirão/Conmebol — NEI produto; fora do MVP.
4. **UI** na aba prognóstico agora ou só texto de prompt?
5. **Backtest CLV** distância×mercados (spec em `calendario-fadiga.md` §4) — sem isto, peso continua zero.
6. ~~PDF REC CBF com cláusula literal “500 km”~~ — **fechado parcial:** REC Copa do Brasil 2026 tem a cláusula (B5). PDF A1 feminino com “500 km” literal ainda NEI (prática via imprensa; Sub-20/Copa Feminina RECs ainda citam 700 km em outras comps — nuance, não muda o veto a inferir modal).
7. **Arrival-day / duração** (ciência F4: road no dia do jogo vs voo D−1) — forte em performance física, mas **inexigível** no MVP sem modal observado; fica como prior de v2 se Flightradar/club feed entrar.

## Auditoria de citações

- [x] URLs de tool results desta sessão (BBC, Mirror, GE×2, PubMed, Taylor&Francis/doi, hrcak PDF).
- [x] Load-bearing (P1/P2/B2/S1/S3/S4) vieram de fetch, não só snippet.
- [x] Achados internos com `path:linha` lidos nesta sessão (`:28`, `:901-909`, `:1940`, `:817`, `leagues.ts:80-81,:125`).
- [x] Spot-check interno: reabertos `haversineKm`, bloco `travelKm`, linha Viagem do visitante.
- [x] Escopo fiel ao brief (6 perguntas); W-049 explicitamente fora.
- [x] Refutado + buscas vazias (limiar PL oficial; A1 feminino PDF 500 km literal) preenchidos.
- [x] Follow-up F2/F3/F4: REC Copa do Brasil 500 km (B5) + nuance custeio vs fisiologia; recomendação MVP **inalterada**.
- [x] `node scripts/verify-citations.mjs` — exit 0 (11/11 OK, pós-patch B5).
