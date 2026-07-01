# Investigação — Attack Momentum / pressão da partida (SIN-021)

> Status: investigado · as-of 2026-06-30 · feature [SIN-021](../features/sinais/SIN-021-attack-momentum-pressao-da-partida.md)

## TL;DR + recomendação

**Reconstruir o attack momentum a partir do include `trends` (grátis no plano atual), NÃO comprar o add-on `pressure`.** O Pressure Index pronto da SportMonks (= equivalente ao "Attack Momentum" do Sofascore) está atrás de um **add-on de €9–29/mês** (causa do 403 local) e, pior pro nosso uso, é **soma-zero** (zera o time dominado, só um lado fica positivo). Os `trends` brutos — incluídos em todos os planos, sem custo — trazem ~1333 pontos/jogo, 40 stats por minuto e **todos os 5 inputs da fórmula oficial**, permitindo um índice **simétrico** (os dois times com valor) e com pesos sob nosso controle. A fórmula recomendada, alinhada ao que InplayRadar/Predictology/xT fazem publicamente: `valor_minuto(time) = Σ (Δmétrica_por_minuto × peso_de_perigo)`, hierarquia **SoT > chute > dangerous attack > attack > posse**, suavizado por janela móvel **~10 min**, plotado como gangorra casa◄—+—►fora. **Vender como descritivo de fluxo, não como probabilidade de gol** (a literatura não sustenta a ponte preditiva pra futebol). É dado **in-play/pós-jogo** — não toca o prognóstico pré-jogo. Os pesos numéricos são **decisão de produto calibrável**, não fato citável (nenhuma fonte pública os dá).

## Contexto e problema

João pediu o "attack momentum tipo o do Sofascore". A curva de gangorra mostra, minuto a minuto, qual time está pressionando — leitura de jogo retroativa (e futuramente ao vivo) que alimenta narrativa de game-state e mercados de 2º tempo/ao vivo. Blind spot atual: o dossiê da partida não tem nenhuma noção de **fluxo intra-jogo**; o único evento de ataque com minuto ingerido hoje é o gol.

**Brief:** (a) estado interno (sync/schema/dossiê) e encaixe; (b) fórmula defensável de reconstrução; (c) cobertura/granularidade real na PL; (d) requisito implícito do repo — todo card do dossiê mostra "o porquê + fontes". **Requisitos implícitos assumidos:** dado in-play ≠ pick pré-jogo (sem mexer no motor quant); separação ESTIMAR/EXPLICAR (momentum é EXPLICATIVO); sem promessa de ganho (Lei 14.790 — vender como descrição de fluxo, não sinal preditivo).

## Estado real no código

Real × inexistente, com âncora por achado (lido nesta sessão):

| Item | Status | Âncora |
|---|---|---|
| Include `trends` no sync | **FALTA** (1 linha) | `apps/api/src/db/sync-sportmonks.ts:369` — include traz `…statistics;weatherReport`, sem `trends` |
| Tabela `match_trend` | **FALTA** | schema em `apps/api/src/db/schemas/leagues.ts` — não existe |
| `match_team_stats` (DOS-002, vizinho) | **EXISTE** | migração `0013`; 1 linha por `(matchId, teamId)` — molde do padrão, mas grão diferente (ver §Modelo) |
| Pesos + delta + EMA da reconstrução | **EXISTE (POC)** | `apps/api/scripts/_momentum.ts:11` — `W={86:5,580:6,44:3,42:2,43:1,49:2,34:1}`, delta por minuto, EMA α=0.3 |
| type_ids dos stats | **EXISTE (ingeridos por time)** | `sync-sportmonks.ts:30` — `TEAM_STAT` já tem 45,42,49,86,580,44,34 (agregado de jogo, não por minuto) |
| Rota do dossiê | **EXISTE** | `apps/api/src/modules/leagues/get-match/get-match.service.ts:34` — retorna `{...serializeMatch, league, goals, cards, rest, standings}` |
| UI do dossiê (aba Fatos) | **EXISTE** | `apps/web/features/leagues/components/match-detail/match-detail.tsx:193` — cards horizontais (Classificação/Venue/Rest) |
| Charting (ECharts) | **EXISTE** | `apps/web/features/leagues/components/player-detail/minutes-chart.tsx` / `rating-chart.tsx` — `echarts.init` + setOption |
| Endpoint de momentum | **FALTA** | precisaria estender `get-match.service.ts` ou sub-rota dedicada |
| Consumo no prognóstico | **NÃO SE APLICA** | `apps/api/scripts/prognosis-prompt.ts:1` — corta tudo em `match.date` (pré-jogo); não lê trends |

**Validado empiricamente (POC `_momentum.ts`, fixture 19427245 = West Ham 3-0 Leeds, 2026-05-24):** `trends` retorna **1333 pontos, 40 tipos** por minuto; `value` é **ACUMULADO** (Leeds dangerous-attacks: 3→4→5→8 monotônico); períodos vêm como `period_id` distintos por tempo (`6972390`/`6972648`); `pressure` → **403**; a gangorra reconstruída bate com o jogo (Leeds pressiona 14-24'/46-49', West Ham domina 34-42' e fecha 86-94'). **Lacuna confirmada no probe: xG por minuto NÃO está entre os 40 tipos de trend** da PL.

## Estado da arte / mercado

Claims atômicos, URL inline, label de confiança, as-of 2026-06-30.

- **SportMonks publica os ingredientes do Pressure Index, não a receita** [verificado-fetch] — inputs: shots on target, possession %, attacking third entries, dangerous attacks, defensive actions; "each statistic is weighted to reflect its relative importance" sem números. `docs.sportmonks.com/.../includes/pressure-index`.
- **Pressure Index é soma-zero/relativo** [verificado-fetch] — "only one team can have positive pressure"; no exemplo (fixture 18804442) o time dominado fica em `0` e o outro marca `10.92…32.99`. Não serve de "pressão absoluta por time". Mesma URL.
- **`pressure` exige add-on de €9–29/mês** [verificado-fetch] — disponível em todo plano base, mas só pago → explica o 403. Mesma URL.
- **`trends` é incluído em todos os planos, sem custo extra** [verificado-fetch] — planos diferem só em nº de ligas e rate limit. `docs.sportmonks.com/.../tutorials/trends`.
- **Pressure Status / `computable`** [verificado-fetch] — metadata `type_id 97352`, `code pressure-status`; quando há poucas stats, `computable:false` e não há índice. Requisitar via `?include=metadata.type`. SportMonks changelog.
- **Entidade Trend** [verificado-fetch] — campos `{id, fixture_id, participant_id, type_id, period_id, value, minute}`; injury time = `minute + extra` somados; v3 separa por `period_id` (resolve overlap 45+2 vs 47:00). `docs.sportmonks.com/.../entities/statistic` + `/api-changes`.
- **Polling de trends** [verificado-fetch] — gravados "just after the start of each minute"; best practice = request separado, **1×/min, offset 30s** após a virada do minuto; cache os `types` localmente. `docs.sportmonks.com/.../best-practices`.
- **Sofascore "Attack Momentum" é da Opta/Stats Perform** [verificado-fetch] — 1 barra/minuto; "value based on whether this possession will increase or decrease the likelihood of a goal"; inputs = passes em área perigosa, chutes on/off, bolas paradas, contra-ataques. Metodologia exata proprietária; há inconsistência entre os próprios artigos sobre autoria (tratar Opta como provável, não 100% firme). `sofascore.com/news/how-live-attack-momentum-works-at-the-world-cup` + `/how-sofascores-attack-momentum-changed-sport-analysis`.
- **xT (Expected Threat), Karun Singh** [verificado-fetch] — grade 16×12, valor de zona = prob. de virar gol, cadeia de Markov converge em 4-5 iterações; base teórica de que **o valor de uma ação cresce conforme se aproxima do chute na área**. `karun.in/blog/expected-threat.html`.
- **Índices comerciais convergem em rolling window ~10 min** [verificado-fetch] — InplayRadar: "dangerous attacks, shots, possession sequences, goal-mouth activity" em janela 5–15 min (ex. 10). Predictology: dangerous attacks + **xG (não contagem)** + dominância territorial + PPDA, média móvel de 10 min. `inplayradar.com/glossary/momentum/` + `predictology.co/blog/pressure-index-matters…`.
- **Momentum é descritivo, não comprovadamente preditivo pra futebol** [verificado-fetch / snippet] — o único paper que conclui "momentum existe/é preditivo" (PLOS One 0269604) usa **NFL 2002–2012**, não soccer; literatura de hot-hand/gambler's fallacy alerta pro viés. Vender como descrição de fluxo, não probabilidade de gol.

## Opções e trade-offs

| Opção | Custo | Simetria | Controle | Veredito |
|---|---|---|---|---|
| **A. Reconstruir dos `trends`** | €0 (já no plano) | Simétrico (os 2 times) | Total (pesos nossos) | **Recomendada** |
| B. Comprar add-on `pressure` | €9–29/mês | Soma-zero (zera dominado) | Caixa-preta | Pior: paga mais por output menos útil |
| C. Híbrido (comprar e exibir o deles) | €9–29/mês | Soma-zero | Nenhum | Descartada: nem valida nem ensina nada |

**Por que A:** o add-on não só custa como entrega um formato *inferior* pro nosso caso (soma-zero não deixa comparar a intensidade dos dois lados; a barra do Sofascore que o João quer é justamente a gangorra simétrica). Os trends têm os mesmos inputs + 35 outros, então reconstruir é estritamente mais flexível. **O que o counter-review levantou** (vira risco, não veto): nossa curva é *não-validável* contra o índice pago, falta xG/min, e posse infla pressão falsa — tudo mitigável com escolha de pesos e validação por face-validity.

## Modelo de dados proposto

Tabela nova `match_trend` (expand-only, molde de `match_team_stats` mas **grão por-minuto**), em `apps/api/src/db/schemas/leagues.ts`:

```
match_trend
  id          serial pk
  match_id    fk → match.id           (not null)
  team_id     fk → team.id            (not null)   -- participant_id resolvido
  type_id     integer                 (not null)   -- 86=SoT, 44=DA, 43=attack, 42=shots, 580=big-chance, 45=posse…
  period_id   integer                 (not null)   -- separa 1ºT/2ºT/prorrogação
  minute      integer                 (not null)   -- minute+extra já somados (injury time)
  value       integer                 (not null)   -- ACUMULADO no período
  unique(match_id, team_id, type_id, period_id, minute)
```

- **Grão ≠ `match_team_stats`**: lá é 1 linha por time/jogo; aqui são **muitas linhas** (time × tipo × minuto). ~1300 linhas/jogo × ~380 jogos/season ≈ 500k linhas/season na PL — ok pra Postgres, mas indexar `(match_id, team_id)`.
- **Momentum NÃO é coluna persistida** — é **derivado em leitura** (delta + pesos + EMA) a partir do `match_trend`. Persistir só o dado bruto deixa a fórmula iterável sem re-sync. (Alternativa: materializar `match_momentum (match_id, team_id, minute, score)` se a derivação ficar cara na request — decidir no `/pl`.)
- **Seleção de tipos**: ingerir só os úteis pro momentum via filtro `trendTypes:86,44,43,42,580,45,49,34,78,100` (espelha o padrão de `lineupDetailTypes`/`fixtureStatisticTypes`), não os 40.

## Plano por faceta

- **dados** — (1) `match_trend` + migração drizzle (expand-only); (2) no sync: `trends` ao include (`sync-sportmonks.ts:368`) com `filters=trendTypes:…`, tipo `SmTrend`, novo ramo mapeando `fixture.trends[]` por `participant_id` → upsert; backfill via re-sync das 4 janelas. Atenção ao polling se um dia for ao vivo (request separado 1×/min). PL primeiro.
- **api** — momentum derivado em `get-match` (ou sub-rota `/matches/:id/momentum`): query `match_trend` por jogo, computa série por minuto (delta por período + pesos + EMA) e devolve `{ minute, home, away }[]`. TypeBox no schema (Elysia/Eden, sem response schema pesado).
- **ui** — `<MomentumChart>` (ECharts) como card na aba **Fatos** ou aba própria "Momentum" do `match-detail.tsx`; gangorra casa◄—+—►fora, eixo X = minuto, marcadores de gol. **Mostrar o porquê + fonte**: legenda "pressão = chutes/ameaças por minuto (SportMonks)", tag descritivo-não-preditivo.
- **ia** — (opcional, fase 2) EXPLICAR: narrar surtos ("Leeds pressionou 14-24'") ancorado na curva; peso ZERO no quant.

## Riscos e gotchas

- **Não-validável contra ground truth** — sem o índice pago, validar por *face-validity* (picos batem com gols/big chances), não por correlação com a Opta.
- **Sem xG por minuto** (confirmado no probe) — proxy de qualidade = big-chances (580) + SoT (86); risco de superponderar volume. Se a SportMonks expuser xG/min num trendType na PL, plugar como peso do chute (ancoragem xT/xG).
- **Posse infla pressão falsa / contra-ataque** — peso de posse (45) ~0; apoiar em SoT/big-chances/dangerous-attacks. Janela ~10 min filtra contra isolado (mas pode mascarar o contra que vale gol — trade-off aceito).
- **`value` cumulativo por período** — delta tem que resetar na virada de `period_id` e lidar com minutos faltantes (carregar último valor visto). A POC já faz carry-forward; robustecer nas bordas de período.
- **`computable:false`** — checar `metadata.type` (pressure-status) ou simplesmente ausência de trends; jogo sem dado → não renderiza a aba (não quebra).
- **Cobertura por liga** — PL é top-tier (completa); ligas menores podem vir esparsas. Tudo nullable + guard.
- **EMA vs janela 10 min** — a POC usa EMA α=0.3 (~6 min efetivos); o consenso de mercado é ~10 min. Decisão de engenharia, calibrar e documentar (sem fonte forte pra EMA específico).
- **Volume de linhas** — ~500k/season; índice composto e, se pesar, materializar `match_momentum`.

## Refutado

- **"Comprar o add-on `pressure` é o caminho mais simples"** — REFUTADO: custa €9–29/mês [verificado-fetch pressure-index] **e** entrega formato soma-zero (zera o dominado), que é *menos* útil que a gangorra simétrica que o João quer. Reconstruir dos trends grátis é mais barato e melhor.
- **"Copiar o output do índice deles seria o ideal de fidelidade"** — REFUTADO: o índice deles não é a barra simétrica do Sofascore; é relativo/zero-sum. Fidelidade ao Sofascore se obtém reconstruindo simétrico, não copiando o `pressure`.
- **"Momentum prevê o próximo gol"** — REFUTADO pra futebol: o único paper pró-preditivo é NFL [verificado-fetch PLOS 0269604]; sem evidência pra soccer. Posicionar como descritivo.

## Perguntas abertas / lacunas

- **Pesos numéricos finais** — nenhuma fonte pública os dá (Opta/SportMonks proprietários). Decisão de produto: calibrar por face-validity nos nossos jogos. A hierarquia (SoT>chute>DA>attack>posse) é defensável; os multiplicadores não.
- **xG por minuto na PL** — o probe (1 jogo) não trouxe; confirmar via `/v3/my/filters/entity` se algum `trendType` de xG existe na assinatura antes de descartar.
- **Derivar em leitura vs materializar** — decidir no `/pl` conforme o custo da query por request.
- **Card na aba Fatos vs aba própria "Momentum"** — decisão de UX pro `/pl`/`/i` (provar no Chrome).
- **Ao vivo (fase futura)** — esta investigação cobre pós-jogo; o polling 1×/min e o estado in-play são outro escopo.

## Evidências (fontes decisivas)

- [doc] `docs.sportmonks.com/.../includes/pressure-index` — add-on €9–29, soma-zero, inputs sem pesos.
- [doc] `docs.sportmonks.com/.../tutorials/trends` — trends grátis em todo plano; estrutura time-series.
- [doc] `docs.sportmonks.com/.../entities/statistic` — campos da entidade Trend.
- [doc] `docs.sportmonks.com/.../best-practices` — polling de trends 1×/min offset 30s.
- [web] `karun.in/blog/expected-threat.html` — xT: base teórica da hierarquia de perigo.
- [web] `predictology.co/blog/pressure-index-matters…` — composto DA+xG+território+PPDA, média móvel 10 min, alerta posse/contra.
- [web] `sofascore.com/news/how-live-attack-momentum-works-at-the-world-cup` — Attack Momentum = Opta, 1 barra/min, valor por likelihood de gol.
- [código] `apps/api/scripts/_momentum.ts:11` — POC da reconstrução (pesos + delta + EMA) rodando.
- [código] `apps/api/src/db/sync-sportmonks.ts:369` — include sem trends (gap de 1 linha).
