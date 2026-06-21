# CORE-001 — Porta de dinheiro, representação de odds e arredondamento

> Investigação (`/rs`). As-of: **2026-06-18**. Feature: [docs/features/core/CORE-001-money-port.md](../features/core/CORE-001-money-port.md).
> Rótulos: `verificado-fetch` · `snippet` · `inferência` · `NEI`. Counter-review: os subagentes fizeram verificação adversarial própria (bugs do currency.js lidos nas issues; Shin≠aditivo confirmado em exemplo); counter-review dedicado pulado (limite Opus) — declarado.

## TL;DR + recomendação cravada

A decisão do CLAUDE.md (**currency.js + centavos-int + porta única `@workspace/core/money`**) **se sustenta para dinheiro**, com uma ressalva real: currency.js está **pouco mantido** (último release funcional jul/2023, 12 issues abertas incl. bugs em `fromCents`/multiply/divide, sem `allocate`/rateio) — mas a **porta única abstrai a lib** (trocar = 1 arquivo) e o valor canônico em centavos-int **nunca passa pelo caminho bugado**, então é defensável; o forte candidato a reavaliar é **dinero.js v2** (ficou estável em **mar/2026**, TS-first, inteiros nativos, `allocate` embutido, Intl p/ BRL). A descoberta que muda o desenho: **odds NÃO são dinheiro e NÃO devem usar a porta de dinheiro nem se chamar `odds_cents`**. A indústria é unânime: **odd decimal é o formato de armazenamento; probabilidade é o formato de cálculo** — converte pra probabilidade na ingestão, faz toda a matemática em probabilidade (**float64 basta, 15,95 dígitos >> incerteza do modelo**), e arredonda só na borda. Regra de arredondamento: **calcular em alta precisão, arredondar só ao gravar/exibir dinheiro**; stake e payout = **floor** (conservador + padrão da indústria); nunca `Math.round` (é half-up, não IEEE half-even). São **três tipos distintos** que precisam de **três representações**: dinheiro (centavos-int, porta money), odds (decimal como int escalado ×1000 ou DECIMAL, fato de mercado imutável), probabilidade/EV (float64, alta precisão). → **CORE-001 cobre só dinheiro; odds/probabilidade pedem um módulo separado** (`@workspace/core/odds`), e o `match_odds.odds_cents` do DOS-001 deve virar `odds_milli` (ou DECIMAL).

## Contexto e problema

CORE-001 é a porta única de dinheiro (CLAUDE.md). A investigação foca no não-cravado: (A) currency.js vs alternativas; (B) como representar/armazenar odds; (C) política de arredondamento em EV/Kelly; (D) a fronteira dinheiro × odds × probabilidade. Consumidores: `match_odds` (DOS-001) e o cálculo de EV/value bet (MOD-001/AGT-001).

## Estado real no código

Greenfield: `packages/core` não existe (`ls packages` → só eslint-config/typescript-config/ui, nesta sessão); currency.js ainda não está no `bun.lock`. A regra mandante é o CLAUDE.md (porta única, centavos-int, API `formatBRL`/`reaisParaCents`/`centsParaReais`/`centsParaReaisStr`). `match_odds.odds_cents` é coluna **proposta** (não criada) no plano do DOS-001.

## A — Bibliotecas de dinheiro (2026)

| Lib | Release/manutenção | Licença | TS / Bun | Modelo de precisão | Pegadinha |
|---|---|---|---|---|---|
| **currency.js** | v2.0.4 (mai/2024); **sem fix de lógica desde jul/2023**; 12 issues abertas | MIT | tipos bundled / roda no Bun | float escalado ×100 (limite 2^53 cents ≈ 90 tri) | bugs abertos em `fromCents`/multiply/divide; **sem `allocate`** [`verificado-fetch` github issues] |
| **dinero.js v2** | **v2.0.0 estável 02/mar/2026**, v2.0.2 13/mar | MIT | TS-first (moeda no tipo) / agnóstico | inteiro nativo (calculator plugável: number/bigint) | API nova (sem `divide` direto, usa `allocate`) [`verificado-fetch` releases + sarahdayan.com] |
| **big.js / decimal.js** | ativas, ~35M downloads/sem (big.js) | MIT | tipos incluídos | decimal arbitrário (string) | é lib de aritmética, **não de dinheiro**; sem formatação BRL/allocate [`verificado-fetch` pkgpulse] |
| **BigInt nativo** | linguagem | — | nativo | inteiro puro | **divisão trunca** (`5n/3n=1n`) → perde centavo em rateio; BRL manual via Intl [`verificado-fetch` MDN] |

**Veredito:** currency.js **se sustenta como escolha pragmática** porque (1) a porta única abstrai a lib, (2) o canônico em centavos-int não sofre o bug de `fromCents`, (3) `formatBRL` encapsula o locale. **Mas** se surgir necessidade de **rateio (`allocate`)** — dividir prêmio/bolão entre apostadores, dividir stake — ou multiplicação de valores grandes, **dinero.js v2 é a alternativa mais sólida de 2026**. Regra do dono (tooling = protótipo comparativo) aplica-se: a investigação **recomenda manter currency.js e marcar dinero.js v2 como candidato de reavaliação**, não fecha sozinha.

## B — Representação de odds (consenso forte da indústria)

- **Odd decimal é o formato canônico de armazenamento/wire**; americana e fracionária são **só display**, derivadas na hora [`verificado-fetch` the-odds-api.com/odds-format, SportsDataIO]. Fracionária não tem papel em sistema computacional moderno.
- **Probabilidade é o formato de cálculo**: converte na ingestão (`p = 1/D`), faz tudo em probabilidade, volta pra odd só no display [`verificado-fetch` r-bloggers 2026, Dremio; arxiv 1802.08848 usa "inverse betting odds" = prob como feature].
- **Nunca FLOAT pra armazenar odd** (quebra `=` e acumula erro). Use **DECIMAL/NUMERIC** ou **inteiro escalado** (×1000: `2.500→2500`) — o padrão "multiplique por potência de 10 e guarde int" é o mesmo do dinheiro [`verificado-fetch` PostgreSQL docs, MongoDB monetary, Google Spanner].
- **Odds são discretas** (ladder): Betfair tem ~350 preços válidos, ticks 0.01→10 por faixa; ×1000 captura todos os ticks classic sem perda [`verificado-fetch` betfair dev docs + price.py].
- **Conversões (fórmulas exatas):** `D=(N/M)+1`; americana `A≥0: D=A/100+1`, `A<0: D=100/|A|+1`; `p=1/D`; overround `M=Σ(1/Dᵢ)−1`.
- **Fórmula de Kelly usa prob + odd decimal:** `f*=(b·p−q)/b`, `b=D−1` — exige probabilidade, não odd crua [`verificado-fetch` Wikipedia Kelly].

**Síntese:** armazenar **odd decimal como `NUMERIC(6,3)`** — precedente direto: a **própria SportMonks** (provedor do DOS-001) usa `NUMERIC(6,3)` no tracker de movimento de odds, "pra fazer delta/média/desvio sem cast" [`verificado-fetch` sportmonks.com/blogs/designing-an-odds-movement-tracker]; e é o que os sportsbooks open-source fazem (DECIMAL/double, nunca int escalado) [`verificado-fetch` schemas GitHub]. **Int escalado (×1000) está REFUTADO como default**: como os ticks da Betfair variam por faixa (0,01→10), nenhum fator de escala único codifica todos os preços válidos sem **tabela de lookup** [`verificado-fetch` betfair dev docs] — overhead que o DECIMAL evita. Armazenar a **probabilidade vig-free separada** (float64/numeric); converter odd→prob na ingestão. **O que importa: nunca FLOAT; `NUMERIC(p,s)`; odds não usam a porta de dinheiro nem o nome `odds_cents`.**

## C — Arredondamento e precisão

- **Regra canônica:** calcular em **alta precisão**, arredondar **só na borda** (gravar/exibir dinheiro). Arredondar no meio compõe erro [`verificado-fetch` shopify.engineering, dev.to/usmanzahidcode, foundingminds].
- **float64 basta para probabilidade/EV:** 53 bits = **15,95 dígitos significativos**; menor edge prático (~0,001) tem 12+ ordens de folga; o gargalo é a **calibração do modelo** (ECE 0,01–0,05), não o float [`verificado-fetch` IEEE 754, matthew-brett]. `decimal.js` só se exigir base-10 exata contratual.
- **Modos:** IEEE 754 default é **half-even** (banker's, sem viés acumulado, erro ~√N); JS `Math.round` é **half-up** (`floor(x+0.5)`) e **não** corrige erro de representação binária → **proibido pra dinheiro** [`verificado-fetch` MDN, Wikipedia Rounding].
- **Dinheiro:** `stake_cents = floor(kelly_f × bankroll_cents)` (floor nunca passa do Kelly — lado conservador); `payout_cents = floor(stake_cents × D)` ("frações de centavo no retorno são invariavelmente arredondadas pra baixo pela casa" — breakage) [`verificado-fetch` Wikipedia Mathematics of bookmaking, albionresearch]; totais exibidos = half-even.
- **Devig:** **Power method** é o melhor empírico (Clarke 2017) e default; **Shin** p/ mercado assimétrico (favorito pesado); multiplicativo OK p/ Pinnacle low-vig; aditivo é o pior (gera prob negativa) [`verificado-fetch` betherosports, CRAN implied, mberk/shin]. Convergência 1e-9..1e-12.

**Fronteira (a resposta central):**
```
[FLOAT64 — alta precisão, NUNCA toca centavo]            [INT — só centavo]
prob → implied_prob → edge → EV → kelly_f   →→→ floor →→→  stake_cents → payout_cents
                                              (ÚNICA borda de conversão)
[ODD = fato de mercado imutável: decimal como int ×1000 ou DECIMAL — tipo PRÓPRIO]
```

## D — Os três tipos (e por que a porta de dinheiro é só pra dinheiro)

| Tipo | Exemplos | Representação canônica | Módulo |
|---|---|---|---|
| **Dinheiro** | stake, payout, assinatura, banca | **centavos (int)** | `@workspace/core/money` (currency.js) — **CORE-001** |
| **Odds** | cotação da casa | **decimal como `NUMERIC(6,3)`** (não int escalado — tick variável); imutável | **`@workspace/core/odds`** (novo, separado) |
| **Probabilidade / EV / edge** | p do modelo, fair prob, EV, Kelly f | **float64** alta precisão (sem arredondar no meio) | utilitário de cálculo (odds/quant) |

Misturar os três numa "porta de dinheiro" é o erro a evitar: odd não é dinheiro (não tem centavo, é fato de mercado), probabilidade não é dinheiro (não pode arredondar pra centavo no cálculo). CORE-001 fica **só com dinheiro**; conversão/devig de odds vira módulo próprio.

## Modelo de dados (impacto no DOS-001)

- `match_odds.odds_cents` (proposto no DOS-001) → **renomear `odds_decimal NUMERIC(6,3)`** (precedente SportMonks). "cents" é nome errado (odd não é dinheiro) e int escalado não cobre o tick variável da Betfair sem lookup. [contesta o schema proposto do DOS-001]
- adicionar `match_odds.implied_prob` (vig-free, float64/numeric) — derivada na ingestão.
- dinheiro (stake/payout/assinatura, quando existir) → colunas `*_cents` int, via porta money.

## Plano por faceta (dados → api → ia → ui)

- **dados:** `packages/core` com **money** (CORE-001, currency.js) + **odds** (conversões decimal↔frac↔americana↔prob, devig Power/Shin) como módulo separado; lógica pura → **teste primeiro** (padrão do pacote).
- **api/ia:** EV/Kelly em float64, arredondar só ao materializar stake/payout em centavos.
- **ui:** `formatBRL` na borda; odds exibidas no formato escolhido pelo usuário (decimal/frac/americana), derivado do canônico.

## Riscos e gotchas

1. **currency.js pouco mantido** → mitigado pela porta única (swap = 1 arquivo); gatilho de troca = precisar de `allocate`/rateio → dinero.js v2.
2. **`Math.round` pra dinheiro** → bug silencioso (half-up + erro binário); usar `Math.floor` p/ stake/payout, half-even p/ totais.
3. **odd como float / `odds_cents`** → erro de `=` e nome enganoso; usar int ×1000 ou DECIMAL e nome correto.
4. **arredondar probabilidade/EV no meio** → corrompe sinal do edge; manter float64 até a borda.
5. **aditivo no devig** → prob negativa em longshot; usar Power/Shin.

## Refutado (com evidência)

- **"odds devem ser guardadas como `odds_cents` (centavos) / na porta de dinheiro"** — REFUTADO: odd não é dinheiro; canônico é decimal (int escalado/DECIMAL) e cálculo é em probabilidade [`verificado-fetch` the-odds-api, SportsDataIO, r-bloggers].
- **"FLOAT serve pra odds/dinheiro"** — REFUTADO: quebra igualdade + acumula erro [`verificado-fetch` SQL guides, evanjones].
- **"`Math.round` arredonda dinheiro corretamente"** — REFUTADO: é half-up e não corrige erro binário [`verificado-fetch` MDN].
- **"precisa de decimal.js pra EV/probabilidade"** — REFUTADO: float64 (15,95 díg.) >> incerteza do modelo; decimal só p/ base-10 contratual [`verificado-fetch` IEEE 754].
- **"Shin ≡ aditivo"** — REFUTADO: só em mercado 2-way simétrico; em linha torta diferem [`verificado-fetch` betherosports].

## Perguntas Abertas / lacunas

- **Manter currency.js ou já adotar dinero.js v2?** — decisão do dono (protótipo comparativo); gatilho = necessidade de `allocate`. `NEI` sobre roadmap de manutenção do currency.js.
- **Escala de odds: ×1000 (milli) basta?** — cobre ticks classic da Betfair; conferir se algum mercado/feed pede mais casas (`NEI`).
- **Renomear `match_odds.odds_cents` no plano do DOS-001** — decisão de quando (afeta o `/pl`/`/i` do DOS-001).
- **Onde vive o devig** (módulo odds vs SIN-012/MOD-001) — fronteira a cravar no `/pl`.
- Banco ainda não escolhido (DOS-001) → tipo exato (DECIMAL vs int) depende disso.

## Evidências decisivas (fetch nesta sessão)

- [web] github.com/scurker/currency.js (releases+issues) — sem fix de lógica desde 2023; 12 issues; sem allocate.
- [web] github.com/dinerojs/dinero.js (releases) + sarahdayan.com/blog/dinerojs-v2-is-out — v2 estável mar/2026, inteiros nativos, allocate.
- [web] the-odds-api.com/sports-odds-data/odds-format.html + SportsDataIO — decimal é storage; frac/americana são display.
- [web] postgresql.org/docs/current/datatype-numeric.html + mongodb monetary — int escalado / DECIMAL, nunca FLOAT.
- [web] betfair dev docs (price ladder) — odds discretas, ~350 ticks; ×1000 cobre classic.
- [web] shopify.engineering + dev.to/usmanzahidcode — arredondar só na borda.
- [web] en.wikipedia.org/wiki/IEEE_754 + MDN Math.round — half-even default vs half-up do JS; float64 15,95 díg.
- [web] en.wikipedia.org/wiki/Mathematics_of_bookmaking — payout arredonda pra baixo (breakage).
- [web] betherosports.com/devigging-methods + CRAN implied + mberk/shin — Power/Shin/multiplicativo, aditivo é o pior.
- [doc] [docs/regras/mercado-odds.md](../regras/mercado-odds.md) — devig/CLV (consome a representação de odds/prob daqui).
