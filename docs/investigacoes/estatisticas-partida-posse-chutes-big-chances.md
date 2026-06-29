# Estatísticas de partida por time (SportMonks fixture statistics) — investigação (DOS-002)

> Investigação (`/rs`). As-of: **2026-06-29**. Feature: [docs/features/dossie/DOS-002-estatisticas-partida-time.md](../features/dossie/DOS-002-estatisticas-partida-time.md).
> Rótulos: `verificado-probe` (chamada real à API SportMonks nesta sessão) · `lido-no-código` (Read/search desta sessão, `path:linha`) · `prévia` (investigação anterior do repo) · `inferência` · `NEI`.
> Escopo: ingerir 3 métricas pro criador de prognóstico — **posse de bola**, **big chances**, **chutes totais + na área**. Pedido do João (2026-06-29) pra alimentar `apps/api/scripts/prognosis-prompt.ts`, que hoje só tem SoT + key passes.

---

## 1. TL;DR + recomendação cravada

**Os 3 metrics pedidos VÊM no nosso tier atual, de graça** — todos são *fixture statistics* (nível TIME), entregues pelo include `statistics` que o sync **ainda não busca**. Probe ao vivo (fixture 19427240, PL 25/26) confirma presentes: **posse (45), chutes totais (42), chutes na área (49), big chances criadas (580)**; ausentes: big chances **perdidas (581)** e **xG (5304, add-on pago)**. A arquitetura certa é **uma tabela nova `match_team_stats`** (time × partida) populada por **um include novo** no sync — posse só existe nível-time, não cabe em `lineup_player`.

**Mas a investigação prévia do repo reordena a prioridade — ingerir ≠ usar como sinal de gol:**
- **Posse %: REFUTADA como preditor de gols** (corr ~0,13 — [metricas-previsao-gols-over-under.md:15](metricas-previsao-gols-over-under.md)). Ingerir é barato (vem junto), mas **não** vira sinal de over; serve como território/contexto e pra derivar "passes por posse" (curto = mais perigoso).
- **Big chances: redundante com xG + viés de resultado** ([metricas...:68](metricas-previsao-gols-over-under.md), §5 princípio 2). Usar como diagnóstico de qualidade de chance, **com encolhimento** — e só temos *criadas*, não *perdidas* (581 ausente), então não dá pra medir "desperdício".
- **Chutes na área (49) é o de maior valor incremental dos 3** — proxy de qualidade de chance (chute na área converte muito mais que fora) e denominador melhor que SoT pra volume. Usar **com a conversão**.

**Recomendação cravada:** construir a ingestão `match_team_stats` agora (destrava os 3 + corners/dangerous-attacks de brinde e é a casa futura do xG). **Ordem de uso no prompt por valor preditivo, não por disponibilidade:** chutes-na-área + chutes-totais (volume/qualidade) > big-chances-criadas (qualidade, com caveat) > posse (contexto, **não** sinal de over). **O verdadeiro prêmio — xG (5304) — está fora do tier** (add-on €29/mês, já recomendado como backbone em [MOD-002](../features/modelos/MOD-002-xg-qualidade-de-chute.md)); é decisão de compra, não de código, e cai na MESMA tabela quando comprado.

---

## 2. Contexto e problema (+ brief)

O criador de prognóstico ([prognosis-prompt.ts](../../apps/api/scripts/prognosis-prompt.ts)) hoje só ingere **2 métricas per-jogador** via `lineups.details` — `shots_on_target` (86) e `key_passes` (117) — e o próprio prompt admite a lacuna: *"NÃO temos xG real, clima, nem posse/chutes totais — SoT é o melhor proxy"*. O João pediu pra fechar 3 dessas: posse, big chances, chutes totais/na-área.

**Brief:** (1) a SportMonks entrega cada uma no nosso tier? (2) type_ids? (3) per-jogador vs per-time? (4) impacto schema/sync? (5) concorrência? (6) o bug dos pênaltis entra junto? **Respondido =** type_id + include confirmados por probe + plano de schema/sync + ordem por valor.

**Requisito implícito (da tese):** todo número que entra no prognóstico tem que **mover gol de verdade** — daí o fact-check da [metricas-previsao-gols-over-under.md](metricas-previsao-gols-over-under.md) ser obrigatório aqui: ingerir um número badalado que não prevê gol (posse) é custo sem edge.

---

## 3. Estado real no código (`path:linha`)

- **`lido-no-código`** — O sync busca fixtures com **filtro de tipos per-jogador** e **sem o include `statistics` de time**: [sync-sportmonks.ts:348-349](../../apps/api/src/db/sync-sportmonks.ts#L348) — `filters=...lineupDetailTypes:${STAT.rating},${STAT.minutes},${STAT.motm},${STAT.keyPasses},${STAT.shotsOnTarget}` + `include=...lineups.details;...`. Não há `statistics` no include → **posse/chutes/big-chances de time nunca chegam hoje**.
- **`lido-no-código`** — Os 5 types per-jogador ingeridos: [sync-sportmonks.ts:29](../../apps/api/src/db/sync-sportmonks.ts#L29) `STAT = { rating: 118, minutes: 119, motm: 1490, keyPasses: 117, shotsOnTarget: 86 }`, gravados em `lineup_player` ([leagues.ts](../../apps/api/src/db/schemas/leagues.ts)).
- **`lido-no-código`** — O prompt deriva SoT/conversão **somando os jogadores** por time: `statByMatchTeam` em [prognosis-prompt.ts:59-82](../../apps/api/scripts/prognosis-prompt.ts#L59). Com `match_team_stats`, o total de time vira **oficial** (não soma que pode perder sub) e ganha posse/chutes/big-chances que não existem per-jogador no nosso feed.
- **`lido-no-código` (BUG tangente)** — `GOAL_TYPE` mapeia **`PENALTY: "normal"`** em [sync-sportmonks.ts:35](../../apps/api/src/db/sync-sportmonks.ts#L35): pênalti vira gol normal, `penaltyGoals` zera, e a **conversão** (gols/SoT, sinal central do prompt) fica poluída (pênalti converte ~0,76 vs ~0,30 de jogada aberta). Conserto independente e barato; de-noise direto do que já existe.
- **`lido-no-código`** — Chave da fonte: `match.sportmonksFixtureId` ([leagues.ts:78](../../apps/api/src/db/schemas/leagues.ts#L78)); helper de fetch `sm()` em `apps/api/src/lib/sportmonks.ts` (base `https://api.sportmonks.com/v3/football`, `?api_token=env.sportmonksApiKey`).

**Concorrência (features que tocam o mesmo terreno):**
- **DOS-001** (Dossiê por partida, `planejado`) — a dimensão "forma/xG" do dossiê é exatamente esta família; DOS-002 é o **produtor de dados** que DOS-001 consome. `depende_de: DOS-001`.
- **MOD-001 / MOD-002** — o motor quant e o xG. `match_team_stats` é insumo deles (e a casa futura do xG agregado). `impacta`.
- **SIN-013 (escanteios)** e **SIN-017 (game-state/timing)** — usam corners/shots, que vêm de brinde no mesmo include.

---

## 4. Estado da arte — type_ids e disponibilidade no tier (`verificado-probe`)

**Probe ao vivo** (`include=statistics.type` no fixture `19427240` = Liverpool×Brentford PL 25/26, nosso `env.sportmonksApiKey`, as-of 2026-06-29): **76 linhas = 38 type_ids × 2 times**. Catálogo cruzado com [docs SportMonks — Fixture statistics](https://docs.sportmonks.com/v3/definitions/types/statistics/fixture-statistics).

**Presentes no nosso tier (free, sem add-on):**

| Métrica | type_id | developer_name |
|---|---|---|
| Posse de bola | **45** | BALL_POSSESSION |
| Chutes totais | **42** | SHOTS_TOTAL |
| Chutes na área | **49** | SHOTS_INSIDEBOX |
| Chutes fora da área | **50** | SHOTS_OUTSIDEBOX |
| Chutes no alvo | 86 | SHOTS_ON_TARGET (já temos per-jogador) |
| Chutes fora do alvo | 41 | SHOTS_OFF_TARGET |
| **Big chances criadas** | **580** | BIG_CHANCES_CREATED |
| Ataques perigosos | 44 | DANGEROUS_ATTACKS |
| Escanteios | 34 | CORNERS |
| Key passes (time) | 117 | KEY_PASSES |
| (+ passes, tackles, cruzamentos, dribles, duelos… ~28 outros) | | |

**Ausentes no nosso tier (probe confirmou ❌):**

| Métrica | type_id | Situação |
|---|---|---|
| Big chances **perdidas** | 581 | BIG_CHANCES_MISSED — simplesmente não vem (mesmo com 580 vindo) |
| **xG (expected goals)** | 5304 | EXPECTED_GOALS — **add-on pago €29/mês** ([MOD-002:101](xg-qualidade-de-chute.md)) |
| xGA / xGOT / xG-prevented | 9687 / 9685 / 9686 | toda a família xG fora do tier base |

**Veredito de valor preditivo (da [metricas-previsao-gols-over-under.md](metricas-previsao-gols-over-under.md), fact-check prévio):**
- **xG (5304) = espinha dorsal** (~60% do poder preditivo, corr ~0,91 agregada) — §1.1. É o que mais moveria o modelo, e é o único **ausente** dos relevantes. `prévia`.
- **Posse % → corr ~0,13 com gols; "não use como sinal de over"** — §1.7/§3.6. `prévia`. Útil só como "passes por posse" (curto = perigoso).
- **Big chances → ~38% conversão MAS viés de resultado + dupla-conta o xG; podem PIORAR o modelo** — §3.1. `prévia`. Usar com encolhimento, como diagnóstico.
- **Chutes: "shots total > shots on target, sempre junto do xG; volume alto + xG baixo = inflação"** — §3.1, item 18 da tabela. `prévia`. Chutes-na-área é o melhor proxy de qualidade dos 3 disponíveis.

---

## 5. Opções — matriz de trade-offs → recomendação

| Opção | O que faz | Prós | Contras |
|---|---|---|---|
| **A. `match_team_stats` via include `statistics`** ✅ | tabela nova time×partida; 1 include + 1 ramo no sync | posse só existe assim; pega os 3 + corners/dangerous/xG-futuro de uma vez; total oficial (não soma de subs) | tabela + migração novas; 1 request por fixture (ou no mesmo loop) |
| B. Cravar em `lineup_player` (per-jogador) | adicionar type_ids ao filtro `lineupDetailTypes` | reusa o pipeline atual; granular pra absence with/without | **posse não é per-jogador** (não cabe); big-chances per-jogador no `lineups.details` é NEI (não probado); mistura dois conceitos |
| C. Não ingerir; manter SoT proxy | status quo | zero custo | mantém a lacuna que o João pediu pra fechar |

**Recomendada: A.** É a única que comporta posse (inerentemente nível-time) e é a **casa natural do xG** quando o add-on for comprado — investir uma vez no pipeline `statistics` paga os 3 agora e o xG depois. Opção B fica como **fase 2** se quisermos big-chances *por jogador* (refinar o absence with/without) — exige probar `lineups.details` sem filtro antes.

**Counter-review (riscos reais da recomendação):**
1. **Posse pode seduzir o LLM a um sinal morto.** Se entrar no prompt sem o aviso "posse não prevê gol", o modelo pode pesar território como se fosse over. → mitigação: rotular no prompt como contexto, não volume. [severity: medium]
2. **Big chances só-criadas é meia-métrica.** Sem as perdidas (581), não dá pra ler "time que cria e desperdiça" (candidato a regressão) — exatamente o uso mais valioso. → usar 580 só como reforço de volume de chance, não como sinal de azar. [severity: medium]
3. **O ganho real (xG) não vem sem €29/mês.** Construir `match_team_stats` sem xG entrega os 3 pedidos mas **não** fecha a maior lacuna do prompt ("não temos xG real"). → deixar a coluna `xg` pronta (nullable) e tratar a compra do add-on como decisão à parte. [severity: high — é o verdadeiro lever]

---

## 6. Modelo de dados proposto (aditivo)

Tabela nova **`match_team_stats`** (uma linha por time × partida; dedup `(matchId, teamId)`):

```
match_team_stats
  matchId        uuid  → match.id
  teamId         uuid  → team.id
  possession     int        # 45 BALL_POSSESSION (%)
  shotsTotal     int        # 42
  shotsInsidebox int        # 49
  shotsOutsidebox int       # 50
  shotsOnTarget  int        # 86 (oficial de time; cross-check vs soma per-jogador)
  bigChancesCreated int     # 580
  dangerousAttacks int      # 44   (de brinde — SIN-017)
  corners        int        # 34   (de brinde — SIN-013)
  xg             real null  # 5304 — NULLABLE; só popula se o add-on for comprado
  (UNIQUE matchId, teamId)
```

Tudo `int` nullable (nem todo fixture/tier tem toda linha). `xg real` já entra **nullable** pra não exigir migração quando o add-on chegar. Não toca dinheiro (sem `currency.js`).

---

## 7. Plano por faceta

**`dados` (o núcleo):**
1. Tabela `match_team_stats` + migração (drizzle-kit generate).
2. No sync: adicionar `statistics` ao `include` do fetch de fixtures ([sync-sportmonks.ts:349](../../apps/api/src/db/sync-sportmonks.ts#L349)) com `filters=fixtureStatisticTypes:42,45,49,50,86,580,44,34` (só os úteis, espelhando o padrão de `lineupDetailTypes`); novo ramo que mapeia `fixture.statistics[]` (por `participant_id`/`location`) → upsert em `match_team_stats`.
3. **Bug dos pênaltis (paralelo):** `GOAL_TYPE.PENALTY = "penalty"` + tratar no cálculo de conversão. Independente, mas no mesmo PR de "qualidade dos inputs de gol".

**`ia` (consumo no prognóstico):**
4. No `prognosis-prompt.ts`: ler `match_team_stats` por time/partida; adicionar ao dossiê **chutes na área/jogo**, **chutes totais/jogo**, **big chances criadas/jogo** — sempre ao lado da conversão. **Posse** entra como linha de contexto rotulada ("posse não prevê gols sozinha; veja passes-por-posse"), nunca como volume.
5. (fase 2) xG: se o add-on for comprado, popular `xg` e trocar o `λ_SoT × conversão` por `λ_xG` como rota principal (a Rota A/B do prompt).

---

## 8. Riscos e gotchas

- **`fixtureStatisticTypes` pode não filtrar** como `lineupDetailTypes` — confirmar a sintaxe do filtro no spike (a doc cita o filtro, mas o probe trouxe os 38 sem filtro). Se não filtrar, ingerir todos os 38 e selecionar no código (barato).
- **Cobertura por liga/fixture:** o probe foi 1 fixture da PL; fixtures antigos ou de ligas menores podem ter linhas faltando. Tudo nullable + `hasStats` guard (como o `hasSot` atual).
- **Não double-contar com a soma per-jogador:** ao trocar a SoT-somada pela SoT-oficial de time, validar que batem (o probe traz 86 nível-time; hoje somamos 86 per-jogador). Pode haver pequena divergência (subs/dados faltando) — a oficial é a fonte de verdade.
- **Big chances 580 é marcação manual** (inconsistente entre ligas — §3.1); ok pra PL, suspeito pra ligas futuras.

---

## 9. Refutado e Perguntas Abertas

**Refutado (REFUTED, com evidência):**
- **"Posse de bola prevê gols / é sinal de over"** → **REFUTED**: corr ~0,13 ([metricas-previsao-gols-over-under.md:15,120](metricas-previsao-gols-over-under.md), meta-análise de 75 artigos). Ingerir sim (território), usar como sinal de over **não**.
- **"Big chances melhora o modelo de gols"** → **REFUTED/parcial**: viés de resultado + dupla-conta o xG; "podem PIORAR o modelo por overfit ao desfecho" ([metricas...:68](metricas-previsao-gols-over-under.md)). Uso restrito a diagnóstico com encolhimento.
- **"xG (5304) vem no nosso tier"** → **REFUTED por probe**: ausente no fixture 19427240; é o add-on €29/mês ([MOD-002:101](xg-qualidade-de-chute.md)).

**Perguntas Abertas (NEI):**
- **`lineups.details` (per-jogador) expõe big-chances/shots por jogador no nosso tier?** NEI — não probado sem o filtro `lineupDetailTypes`. Decide se a fase 2 (big-chances por jogador, pro absence with/without) é viável de graça.
- **`fixtureStatisticTypes` filtra de fato?** NEI — confirmar no spike de implementação.
- **Cobertura de `statistics` em ligas além da PL** (Brasileirão) — NEI até dado real (mesma assimetria PL×BR de sempre).
- **Comprar o add-on de xG (€29/mês)?** Decisão do dono — é o maior lever, fora do escopo de código.
