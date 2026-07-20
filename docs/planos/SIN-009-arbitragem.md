# SIN-009 — Sinal de arbitragem (árbitro escalado) · dossiê de planejamento (2026-07-20)

Feature: [docs/features/sinais/SIN-009-arbitragem.md](../features/sinais/SIN-009-arbitragem.md)
Base: commit `3a7fdaf` (2026-07-20) — todo file:line deste doc vale neste commit.

## TL;DR

Ingerir o **árbitro principal de cada jogo** (`include=referees`, `type_id` 6) numa tabela `referee` nova + a coluna `match.refereeId`, e **exibir na aba Fatos da página da partida** um card com quem apita.

> Duas reversões durante a execução moldaram o escopo final: o dono cortou as estatísticas do árbitro (**D7**) e questionou a tabela de vínculo (**D8**). O que ficou é deliberadamente mínimo — identidade, nada mais. Ver §Schema.

**Esta iteração é de DADOS + EXIBIÇÃO, não de modelo.** O dono cortou a injeção no prompt (decisão de 2026-07-20): o número não entra no prognóstico agora. O cálculo multiplicativo anti-dupla-contagem está desenhado e **deferido** pra próxima iteração (§Quant, deferido) — a faceta `ia` da feature segue `investigado`.

O que torna isso barato: `ingestTvStations` já é exatamente esta forma (catálogo + R2 + vínculo) e `getMatch` já compõe 4 cards da aba Fatos do mesmo jeito (venue, descanso, classificação, onde assistir). O trabalho é copiar um padrão de quatro features de profundidade, não inventar um.

## Briefing — o que já foi falado e decidido

- **Escopo: só a página do jogo por ora; NÃO injetar nada no prompt** — decisão do dono nesta conversa (2026-07-20), respondendo à pergunta de escopo do `/pl`. Consequência: a faceta `ia` fica `investigado` e o §Quant vira deferido; MOD-001 sai do blast radius desta iteração.
- **A fonte é a SportMonks, não API-Football/football-data/FootyStats** — a `## Tarefas` da feature e a §5 de `docs/regras/arbitragem.md:60-67` listam fontes externas descartadas quando a SportMonks virou fonte única. Corrigido na feature nesta sessão. Fonte: memória `sportmonks-assinatura` (decisão de 2026-06-28) + dono nesta conversa (2026-07-20).
- **Dono pediu explicitamente `/pl` + `/i`** ("temos os árbitros? podemos sincronizar, acho legal" → "merece um /pl e /i"). Fonte: dono nesta conversa (2026-07-20).
- **Nada em português no banco/contrato** — tabelas e colunas em inglês; só string de UI em PT. A âncora antiga da feature era `arbitros` (PT) e foi corrigida pra `referee`. Fonte: memória `codigo-em-ingles-ui-em-pt`.
- **`type`, nunca `interface`.** Fonte: memória `preferencia-type-nao-interface`.
- **Elysia no Workers: TypeBox, não zod, e sem response schemas** — vale pra qualquer mexida em rota. Fonte: memória `elysia-cloudflare-workers`.
- **Chrome-devtools MCP não atacha com o Chrome do dono aberto** — agora é relevante: esta iteração TEM faceta `ui`. LIG-006 registra a mesma falha nos testes dela. A Verificação já nasce com o fallback honesto (dono valida o golden path). Fonte: memória `chrome-devtools-profile-travado` + `docs/features/ligas/LIG-006-classificacao-na-partida.md` (campo `testes`).
- **`docs/regras/arbitragem.md` §6 crava as travas** de leitura (era-VAR, pênalti/vermelho ruidosos, sinal direcional) — valem pra exibição também: o card mostra dado, não veredito.

## Estado do terreno

**dados — o árbitro não existe no banco.** Nenhuma das 21 tabelas de `apps/api/src/db/schemas/leagues.ts` é de árbitro, e `grep -rn "referee" apps/api/src` devolve **zero ocorrências**. O include `referees` não está em `richInclude` (`apps/api/src/db/sync-ingest.ts:35-44`), que hoje pede participants, scores, round, state, lineups (player/position/details), formations, events, sidelined, venue, statistics, trends, weatherReport, metadata e tvStations.

**O precedente de ingestão já existe.** `ingestTvStations` (`apps/api/src/db/sync-ingest.ts:128-166`) é estruturalmente idêntico ao que o árbitro precisa: catálogo de entidade upsertado por id da SportMonks + imagem pro R2 via `pool(...)`/`imgKey` (`sync-ingest.ts:168-171`) + tabela de vínculo com o match. Ele é chamado de **dois** sítios — `apps/api/src/db/sync-sportmonks.ts:511` (liga) e `apps/api/src/db/sync-ingest.ts:440` (pipeline compartilhado liga+copa). `ingestReferees` copia a metade do catálogo (upsert por id + foto no R2); a designação em si virou um `UPDATE match SET referee_id` (D8), não uma tabela de vínculo.

**api — `getMatch` é uma composição de loaders, e o padrão é literal.** `apps/api/src/modules/leagues/get-match/get-match.service.ts:33-67` monta o payload chamando um loader por bloco (`loadMatchGoals`, `loadMatchCards`, `loadMatchTvStations:41`, `loadTeamStanding`) e devolvendo cada um como campo (`tvStations:65`). Adicionar árbitro = **1 loader novo em `shared/shared.ts` + 1 campo**. Sem response schema a mexer (Elysia no Workers não os usa).

**ui — a aba Fatos já é uma pilha de cards do mesmo formato.** `apps/web/features/leagues/components/match-detail/match-detail.tsx` renderiza os cards de descanso (`:295-305`, LIG-005) e de onde assistir (`:307-330`, W-059) no mesmo desenho: `rounded-lg border bg-card p-4`, rótulo em `text-xs uppercase tracking-wide text-muted-foreground`, conteúdo abaixo. O card de árbitro entra nessa pilha. LIG-004 (venue) e LIG-006 (classificação) são os outros dois exemplos da mesma aba.

**Os cartões já estão ingeridos** — `card` (`apps/api/src/db/schemas/leagues.ts:532-547`) tem `matchId`, `teamId`, `playerId`, `minute`, `type`. Não é usado por esta iteração, mas é o insumo local que torna o §Quant deferido implementável sem request novo quando ele voltar.

**Cobertura confirmada ao vivo (2026-07-20), plano Starter/Advanced + Match Facts, pago (`next_billing_cycle` 2026-08-12):**

- `include=referees` → 4 árbitros/fixture (type 6 principal, 7/8 assistentes, 9 quarto).
- **12/12 jogos encerrados com principal nas 4 competições** (PL, BRA, FAC, CARA) — `apps/api/scripts/_probe-ref.ts`. Probe por season SEM filtro de estado dá 0/25 em BRA/FAC: são fixtures **futuros**, sem árbitro designado. Falso negativo, não buraco de cobertura — **e é o caso primário da UI, ver Blast radius**.
- (deferido, ver §Quant) `/referees/{id}?include=statistics.details` → **7 métricas por (árbitro, season)**: Yellowcards, Redcards, Yellowred Cards, Penalties, Fouls, VAR Moments, Season Matches. Cartões e pênaltis vêm com split **home/away** (`count`/`average`/`percentage`); cartões ainda quebram em `on_pitch`/`on_bench`/`for_coach`.
- Entidade `referee`: `id, sport_id, country_id, city_id, common_name, firstname, lastname, name, display_name, image_path, height, weight, date_of_birth, gender`.
- **O spread existe e é grande na Série A** (season 26763): Candançan **2.75** amarelos/jogo · Rodrigo J. P. de Lima **5.27** · Bruno Arleu **6.18** — **2.2×** entre extremos, com 8-11 jogos de amostra cada. É o que dá valor ao card: o número diferencia de verdade.
- Stats são **por (árbitro, season)** e a mesma pessoa tem seasons separadas por competição — A. Taylor tem PL 23614/25583 **e** FA Cup 25919, esta última com só 2 jogos. Amostra pequena é a regra, não a exceção — o que reforça por que shrink é obrigatório quando o §Quant voltar.

## Mapa de dependências

**Features** (saída de `bun run features impact SIN-009`, filtrada pelo escopo desta iteração):

- **DOS-001** ← declarado em `impacta`: o dossiê/página da partida ganha um bloco novo. É o alvo desta iteração.
- **LIG-004, LIG-005, LIG-006, W-059** ← vizinhos de aba: todos renderizam cards na mesma aba Fatos e são servidos pelo mesmo `getMatch`. Re-testar que nenhum sumiu do payload.
- **MOD-001** ← declarado em `impacta`, mas **fora desta iteração**: só volta quando o §Quant deferido for implementado (prompt).
- **SIN-007 (rivalidade)** ← declara impactar SIN-009 e empurra cartões pela mesma porta. **Sem risco nesta iteração** — um card de exibição não dupla-conta; o cuidado volta junto com o prompt.
- A lista `compartilham âncora` do `features impact` traz 20 IDs porque a âncora `match` é universal — e a **D8 põe a coluna `refereeId` justamente no `match`**. Ainda assim é aditiva e nullable (mesma forma do `venueId`/LIG-004), então o re-teste real é DOS-001 + os vizinhos de aba, não as 20.

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `apps/api/src/db/sync-ingest.ts#richInclude` | `sync-ingest.ts:451` (`fetchRichByIds`, copas), `sync-sportmonks.ts:301` (liga) | `bun run db:sync` da PL + `sync-cup` de uma copa: contagens de ingestão inalteradas |
| `apps/api/src/db/sync-ingest.ts#ingestFixtures` | `sync-cup.ts`, `sync-sportmonks.ts` | mesmo acima — o pipeline é compartilhado pelas 4 competições |
| `apps/api/src/modules/leagues/get-match/get-match.service.ts#getMatch` | `matches.routes.ts`, `apps/web` (Eden Treaty), `match-detail.tsx` | `GET /v1/matches/:key` devolve os campos antigos + `referee`; nenhum bloco da aba Fatos some |
| `apps/api/src/modules/leagues/shared/shared.ts` (loader novo) | só `getMatch` | — (símbolo novo) |
| `apps/web/.../match-detail/match-detail.tsx` (aba Fatos) | página `/matches/[slug]` | render dos 5 cards da aba, incluindo estados vazios |

## Blast radius e cuidados

- **`richInclude` é compartilhado por liga E copa** (`sync-ingest.ts:35`) — adicionar `;referees` muda a request de PL, BRA, FAC e CARA de uma vez. Sintoma se quebrar: payload maior estourando timeout ou `per_page`, sync abortando no meio. Como detectar: `bun run db:sync` até o fim com as contagens finais iguais às de hoje + 1 contagem nova de árbitro. **Não carimbar `// @feature SIN-009` nessa linha** — é código compartilhado; o carimbo só vai nas tabelas novas (regra do CLAUDE.md).
- **"Árbitro ainda não designado" é o caso PRIMÁRIO da UI, não uma borda.** A página da partida é vista sobretudo **antes** do jogo, e jogo futuro normalmente não tem árbitro — foi exatamente o que gerou o falso negativo do probe. Sintoma se tratado como exceção: card quebrado ou vazio na maioria dos jogos futuros, que é quando o usuário olha. Mitigação: estado vazio explícito e testado (T7), não um guard de null escondido na API. **Confirmar durante o `/i` com que antecedência a designação sai** (a PL publica junto com a escala da rodada, dias antes); se sair tarde, o card fica vazio na maior parte dos jogos futuros e isso precisa estar claro pro dono antes do merge, não depois.
- **Contrato do `getMatch`** — a web consome via Eden Treaty com tipo inferido. Campo novo é aditivo, mas remover/renomear qualquer campo existente quebra a página inteira. Sintoma: aba Fatos em branco. Como detectar: `bun run typecheck` na raiz (o web re-infere o tipo da API) + render da aba.
- **Custo de requests**: as stats do árbitro são **1 request por árbitro** (não por jogo). O universo é de dezenas, não milhares, e o rate limit é 2000/h por entidade (`rate_limit.requested_entity`). Sintoma se errar: backfill batendo 429. Mitigação: dedupe por `referee_id` ANTES de buscar (é o que `ingestTvStations` já faz com estações).
- **Amostra pequena** — A. Taylor tem season de FA Cup com **2 jogos**. Média de 2 jogos exibida sem a amostra ao lado é número com cara de fato. Mitigação: o card sempre imprime "X,X/jogo em N jogos".
- **Era-VAR** (`docs/regras/arbitragem.md` §6): comparar árbitro só contra baseline da MESMA era. Nossas seasons são todas pós-VAR — sem risco no conjunto atual, mas a trava fica registrada pro §Quant deferido.

## Evidências

- [código] `apps/api/src/db/sync-ingest.ts:128-166` — `ingestTvStations`: o precedente estrutural exato (catálogo + R2 + vínculo) que `ingestReferees` copia.
- [código] `apps/api/src/db/sync-ingest.ts:35-44` — `richInclude` sem `referees`; ponto único de mudança que atinge as 4 competições.
- [código] `apps/api/src/modules/leagues/get-match/get-match.service.ts:33-67` — `getMatch` como composição de loaders; `:41` e `:65` são a linha a copiar (`loadMatchTvStations` → campo `tvStations`).
- [código] `apps/web/features/leagues/components/match-detail/match-detail.tsx:307-330` — card "Onde assistir" na aba Fatos: o molde visual do card de árbitro.
- [código] `apps/api/src/db/schemas/leagues.ts:532-547` — tabela `card`: insumo local do §Quant quando ele voltar.
- [código] `apps/api/scripts/_probe-ref.ts` — probe de cobertura: 12/12 com árbitro principal em PL/BRA/FAC/CARA (jogos encerrados).
- [banco] query 2026-07-20 (`select s.league_code, count(m.id) from match m join season s ... group by 1`) — 2.484 jogos em 6 seasons (PL 24/25+25/26, BRA 2025+2026, CARA, FAC): o universo do backfill.
- [doc] `docs/regras/arbitragem.md` §1 — o spread de ~2× entre árbitro rígido e brando; §6 — travas de leitura (era-VAR, ruído de pênalti/vermelho).
- [doc] `docs/features/ligas/LIG-006-classificacao-na-partida.md` (campo `testes`) — precedente registrado do chrome-devtools não atachando: o motivo do fallback na Verificação.
- [commit] `c19e081` — DOS-002 (stats de time por partida): o precedente de "novo include + tabela + backfill".

## Detalhes por passo

### §Schema — o que foi de fato criado (P1)

Só-expand (aditivo, nenhuma coluna existente muda). Tudo em inglês; `type`, nunca `interface`.
Migração: `apps/api/src/db/migrations/0037_petite_mephistopheles.sql`.

**`referee`** — catálogo, dedupe por `sportmonksRefereeId`. Colunas: `id` (uuid pk), `sportmonksRefereeId` (int unique), `name`, `commonName` (nullable), `slug` (unique), `countryId` (FK → `nationality.id`, nullable), `imageUrl` (R2, nullable), `dateOfBirth` (date, nullable), `createdAt`.

**`match.refereeId`** — FK nullable → `referee.id`, direto no `match` (D8). Mesma forma do `match.venueId` (LIG-004). Só o árbitro PRINCIPAL (`type_id` 6); assistentes e quarto árbitro não são ingeridos.

> **Duas tabelas foram desenhadas, criadas em dev e REMOVIDAS antes de qualquer commit ou deploy:**
> `match_referee` (vínculo com `typeId`, revertida por **D8** — 75% de linhas mortas) e `referee_season_stats`
> (20 colunas de perfil disciplinar, cortada por **D7** — o dono só queria a identidade). Nenhuma das duas
> existe no schema. O desenho de `referee_season_stats` sobrevive no §Quant abaixo, para quando a faceta
> `ia` voltar — **não** o re-derive nem tente consultá-las.

### §Payload — o que `getMatch` devolve (P4)

Campo `referee`, `null` quando não há designação (o caso comum em jogo futuro):

```
referee: {
  name, commonName, imageUrl, countryName,
  role: 6,                       // principal; assistentes ficam fora do payload por ora
  season: {                      // perfil da season DESTA competição
    sportmonksSeasonId, matches, // matches = a amostra, sempre exibida
    yellowAvg, yellowHomeAvg, yellowAwayAvg,
    redAvg, yellowredAvg, penaltiesAvg, foulsAvg, varMomentsAvg,
    scope: "current" | "fallback" // "fallback" = season atual vazia, usou a última com dado
  } | null
} | null
```

**Escopo da season**: season corrente **desta competição** primeiro; se não houver linha (ou `matches = 0`), cai pra última season com dado e marca `scope: "fallback"` — o card diz de qual temporada veio. Decidido no plano (D5), não é pergunta aberta.

### §Quant — DEFERIDO pra próxima iteração (faceta `ia`)

**Não implementar nesta iteração** — o dono cortou a injeção no prompt em 2026-07-20. Registrado aqui pra não ser re-derivado do zero depois.

Método de `docs/regras/arbitragem.md` §3, multiplicativo, **nunca soma**:

```
baseline_liga   = média de cartões/jogo da liga-season, dos jogos pré-CUTOFF (tabela `card`)
rr_arbitro      = shrink(yellowAvg_do_arbitro / baseline_liga, seasonMatches)
rr_casa         = shrink(cartões/jogo do mandante  / baseline_liga, jogos_do_time)
rr_fora         = shrink(cartões/jogo do visitante / baseline_liga, jogos_do_time)
esperado        = baseline_liga × rr_arbitro × rr_casa × rr_fora
```

`shrink(rr, n) = 1 + (rr − 1) × n / (n + K)`, com **K = 10** como default declarado (a regra §3 exige shrink e deixa o fator `[A confirmar]`; MOD-004 manda medir antes de calibrar). Com n=2 o efeito cai a ~17% do bruto; com n=20, fica em ~67%.

Quando isso voltar, os dois cuidados que morrem nesta iteração ressuscitam: **(a) dupla contagem** — a linha de Dureza já imprime uma média de cartões por jogo (`apps/api/scripts/prognosis-prompt.ts:1499`) e a rivalidade (SIN-007) empurra na mesma direção; **(b) quant-first** — o número sai de função pura, o LLM só interpreta. Ponto de inserção no prompt: bloco `## Contexto` (`apps/api/scripts/prognosis-prompt.ts:1843`), que `super-prognosis.ts:380-385` fatia e herda automaticamente. Pênaltis e vermelhos ficam como modificador textual, nunca no cálculo (§6 da regra: eventos raros e ruidosos).

### §Testes — casos executados

Script: `apps/api/scripts/_check-referee.ts` (assert no banco real; não há runner de unidade no repo).

- **T1** jogo encerrado tem árbitro em `match.refereeId` com nome preenchido.
- **T2** idempotência: re-ingerir o mesmo fixture não duplica catálogo nem re-designa.
- **T3** catálogo sem árbitro órfão (todo `referee` tem ao menos um jogo).
- **T4** cobertura por competição, medida contra os jogos que o pipeline **enriquece** (denominador = tem `lineup`); os jogos fora do pipeline rico são contados e impressos, nunca escondidos.
- **T5** `getMatch` devolve `referee` e preserva `rest`/`standings`/`tvStations`/`goals`/`cards`/`league`.
- **T6** jogo futuro sem designação → `referee: null`, sem lançar.

**Roteiro de browser (chrome-devtools MCP)** — escada: vazio → variante → golden path.

- **T8 (vazio, caso primário)** jogo futuro → card "Árbitro ainda não designado para esta partida."
- **T9 (variante)** jogo da Série A com árbitro brasileiro → nome acentuado e país corretos.
- **T10 (golden path)** jogo encerrado da PL → nome + foto + papel + país, com os 4 cards antigos da aba Fatos intactos.
- **Fechamento** `list_console_messages` e `list_network_requests` sem erro novo.
