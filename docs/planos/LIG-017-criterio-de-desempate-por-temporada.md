# LIG-017 — Critério de desempate por temporada · dossiê de planejamento (2026-07-20)

Feature: [docs/features/ligas/LIG-017-criterio-de-desempate-por-temporada.md](../features/ligas/LIG-017-criterio-de-desempate-por-temporada.md)
Base: commit `3a7fdaf` (2026-07-20) — todo file:line deste doc vale neste commit.

> **Aviso de pino.** A investigação ([docs/investigacoes/criterio-de-desempate-por-temporada.md](../investigacoes/criterio-de-desempate-por-temporada.md))
> citou a **árvore de trabalho suja**, que tem +23 linhas de WIP do SIN-009 em `shared.ts`. As linhas deste
> dossiê foram **re-resolvidas contra `3a7fdaf`** e diferem das de lá por −23 no bloco de desempate
> (investigação `:2083` = HEAD `:2060`). Use as daqui.

## TL;DR

Ingerir `season.tie_breaker_rule_id` da SportMonks numa coluna nova da `season`, mapear cada id para uma
**lista curada de critérios em código** (`TIEBREAK_BY_RULE_ID`), fazer `tiebreakOf` receber a temporada em vez
do código da liga — devolvendo `{ criteria, source, label }` — e publicar o critério aplicado como campo
**aditivo** em `GET /v1/leagues/:code`, exibido na faixa de legenda sob a tabela.

A decisão central que o `/pl` **acrescenta** à investigação: **`resolveSeason` não muda.** Ela devolve
`string` (uuid), não a linha da season (`shared.ts:686`), e tem **7 callers de serviço**. `tiebreakOf` fica
**pura** (sem acesso a banco) recebendo `{ code, sportmonksTieBreakerRuleId }`; quem precisa da regra faz uma leitura
pontual do id pelo `seasonId` já resolvido. Isso mantém o arnês `_check-standings-order.ts` — que roda com
dado sintético e **sem banco** — funcionando com um objeto literal, que é exatamente o ponto onde a quebra
seria silenciosa (R2).

## Briefing — o que já foi falado e decidido

- **Ingerir + modelar legível + exibir** são as três coisas pedidas — fonte: pedido do dono citado na
  investigação, §"Contexto e problema" (o arquivo é **posterior ao pino** — ainda não commitado em `3a7fdaf`,
  por isso citado por seção e não por linha): *"quero que feede o banco e organize pra ter o tiebreak aqui…
  organizar de um jeito mais bonito que esse número aí que não significa nada… preciso de pôr lá na tabela da
  classificação"*.
- **A semântica da regra mora em código, não no banco** — fonte: decisão D10 do LIG-012
  (`docs/features/ligas/LIG-012-ingestao-serie-a-brasileirao.md:160-163`). A investigação reconciliou: o que vai
  pro banco é o **fato ingerido** (qual regra a fonte declara), não a regra configurável. O D10 **continua
  valendo** para a semântica.
- **VETADO: persistir o `name` da regra da SportMonks** — fonte: investigação §Decisão 2. O nome do tipo `171`
  é "Goal Difference, **Matches Played**, Goals Scored" e o regulamento real da PL não tem "matches played";
  persistir o nome criaria duas fontes de rótulo, e a errada seria a mais fácil de puxar.
- **VETADO: envelope `{ rows, tiebreak }` em `/standings`** — fonte: investigação §Decisão 3. Quebraria
  `_check-standings-order.ts` e `_check-endpoints.ts`, que consomem `standings()` como array e **não são
  typechecked**.
- **Confronto direto (H2H) fora de escopo** — fonte: investigação §"As 6 regras de confronto direto". Não é
  impossível; é que **nenhum dos 6 tipos H2H aparece nas 15 temporadas da assinatura**. Fora por ausência de
  dado, não por impossibilidade.
- **Recomputar a tabela em vez de usar a `position` pronta continua certo** — fonte: LIG-012, reafirmado na
  investigação §Estado da arte (o ramo `?upTo=N` recomputa por definição e não tem `position` oficial).
- **Desempate é PL-específico e o recompute mis-ordena o Brasileirão** — fonte: memória do projeto
  (`standings-desempate-pl-especifico`). Confere com o código atual.
- **Código/dado em inglês, string de UI em português** — fonte: memória do projeto (`codigo-em-ingles-ui-em-pt`)
  + CLAUDE.md.
- **`git log --grep "[LIG-012]"` não retorna nada**: os commits da área (`57f5b3d`, `ac7bd5f`, `eec3e64`) usam
  IDs no corpo de forma irregular. Não há decisão adicional escondida em commit sobre desempate além do que a
  investigação já minerou.

- **RESOLVIDO pelo dono (2026-07-20, nesta conversa):** o incômodo com "esse número que não significa nada" era
  o **nome**, não a modelagem. Palavras dele: *"Eu só queria ter um nome mais bonito pra guardar as coisas…
  pode trazer o id do sportmonks, talvez algo como sportMonksTieBreakId… isso é id interno, que não sai na
  api; na api sairia uma semântica bonita"*. Isso **confirma** a Decisão 2 da investigação (id cru no banco,
  semântica na API) e **descarta** a tabela de referência `tiebreaker_rule`. O único ajuste é o nome da coluna:
  `sportmonks_tie_breaker_rule_id`, seguindo a convenção `sportmonks_*_id` que o schema já usa
  (`sportmonks_season_id`, `sportmonks_team_id`) e que **já significa** exatamente "id externo da fonte, não a
  nossa semântica". O `[PENDENTE-DONO-1]` está **fechado** — P1 desbloqueado.

## Estado do terreno

**dados** — `season` (`apps/api/src/db/schemas/leagues.ts:29-39`) tem `id`, `sportmonksSeasonId`, `leagueCode`,
`name`, `startYear`, `isCurrent`, `createdAt`. **Não há coluna de desempate.** Quatro sítios fazem upsert de
`season`:

| Sítio | Linha | Tem o dado da API à mão? |
|---|---|---|
| `apps/api/src/db/sync-sportmonks.ts:357` | `onConflictDoUpdate` sobre `seasonValues` (`:348`) | **sim** |
| `apps/api/src/db/sync-cup.ts:91` | idem (`seasonValues` em `:82`) | **sim** |
| `apps/api/scripts/sync-old-season.ts:120` | idem (`apiSeason` em `:114`) | **sim** |
| `apps/api/scripts/backfill-season.ts:28` | ponte **local**, monta a linha do `league` | **não** — não chama a API |

O quarto é a correção factual mais importante que este dossiê faz sobre a investigação: ela diz "escrita nos
**4** upserts", mas `backfill-season.ts` é uma ponte que só reconstrói a season a partir da linha de `league`
já existente, sem request à SportMonks. Lá a coluna **nasce null por construção** — coberto pelo override
`BRA` (R4a) e denunciado pela asserção (R4b), não por um write que não pode existir.

**api** — o desempate já existe e roda (não é greenfield):

| Símbolo | Linha (`3a7fdaf`) |
|---|---|
| `type TiebreakCriterion = "points" \| "wins" \| "goalDifference" \| "goalsFor"` | `shared.ts:2041` |
| `TIEBREAK_VALUE` — extrator escalar por critério | `shared.ts:2046` |
| `PREMIER_LEAGUE_TIEBREAK` = `["points","goalDifference","goalsFor"]` | `shared.ts:2055` |
| `TIEBREAK_BY_LEAGUE` — mapa por `league.code`, **uma** entrada (`BRA`) | `shared.ts:2060` |
| `tiebreakOf(code: string)` → default PL para liga não listada | `shared.ts:2065` |
| `computeStandings(matches, tiebreak)` — recebe a lista, não a deduz | `shared.ts:2073` |
| fallback `localeCompare` do nome quando todos os critérios empatam | `shared.ts:2123` |

`standings.service.ts:14` resolve a temporada e `:17` joga a informação fora chamando `tiebreakOf(code)`.
`resolveSeason` (`shared.ts:686`) devolve **`Promise<string>`** — o uuid, não a linha.

**ia** — três comparadores inline, **nenhum** chama `tiebreakOf`, e — achado novo deste `/pl` — **nenhum dos
três acumula vitórias**, então nem seria possível aplicar o critério `wins` sem alterar o acumulador:

| Declaração do acumulador | Sítio do sort | Falta |
|---|---|---|
| `apps/api/scripts/prognosis-prompt.ts:910` — `type Line = { teamId: string; points: number; gd: number; gf: number }` | preMatchTable, sort na linha 938 | sem contagem de vitórias |
| `apps/api/scripts/prognosis-prompt.ts:1359` — `{ pts: number; gd: number; gf: number; pl: number }` | standingsAsOf, sort na linha 1367 | idem |
| `apps/api/scripts/stakes-rounds.ts:43` — `type Line = { teamId: string; points: number; gd: number; gf: number }` | sort na linha 60 | idem |

`prognosis-prompt.ts:1372-1375` prova que o autor já corrigiu o **número de vagas** por liga mas deixou a
**ordenação** PL-only — meio bug corrigido.

**ui** — `standings-table.tsx:55-73` define os cabeçalhos `# Time J V E D GP GC SG Pts Forma`;
`:143-152` é a faixa de legenda, hoje só com zonas. **Ela é renderizada sob a condição `present.length`**
(`:143`) — se a liga não tiver zona nenhuma, a faixa inteira some. O componente importa **apenas**
`useStandingsQuery` (`:16`). `league-detail.tsx:18-22` já chama `useLeagueQuery` **e** `useStandingsQuery` no
mesmo componente que renderiza `<StandingsTable>`, e `use-league-query.ts:8-12` usa o mesmo `useSeasonParam()`
e carrega a season na `queryKey` — a premissa "mesma season nas duas queries" está **confirmada**.

**tooling** — `apps/api/tsconfig.json:12` tem `"include": ["src/**/*.ts", "drizzle.config.ts"]`: **`scripts/`
fica de fora do typecheck**, e não existe `.github/workflows`. Quebra em script é silenciosa.

## Mapa de dependências

**Features** (saída de `bun run features impact LIG-017`):

- `LIG-006` (classificação na partida) ← consome a tabela computada; se a ordem mudar, a posição exibida no jogo muda.
- `MOD-004` (prognóstico) ← consome `standingsAsOf`/`preMatchTable`; é quem mais ganha com o passo `ia`.
- `LIG-002, LIG-008, LIG-011, LIG-012, LIG-013, LIG-014` ← compartilham as âncoras `season`/`standing`.
- `depende_de: [LIG-012, LIG-008]` — ambos **feito/verificado**; nenhum bloqueio, **não há P0 de stub**.

**Código** (símbolos alterados → callers):

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `shared.ts#tiebreakOf` (assinatura muda) | `standings.service.ts:5,17` · `_check-standings-order.ts:11,59-60` (**não typechecked**) | `bun run scripts/_check-standings-order.ts` → 11/11 |
| `shared.ts#computeStandings` (ganha invariante) | `standings.service.ts:20,26` · `_check-standings-order.ts:59-60` | idem |
| `get-league.service.ts#getLeague` (retorno **aditivo**) | `leagues.routes.ts` · `use-league-query.ts` (Eden tipa) | `fetch /v1/leagues/BRA` + typecheck do web |
| `schemas/leagues.ts#season` (coluna nova) | 4 upserts (tabela §Estado do terreno) · `resolveSeason` | `select … from season` → zero null nos 3 sítios com API |
| `resolveSeason` | **7 serviços** (bracket, get-league, get-player, get-team, list-rounds, scorers, standings) | **não muda** — por isso não entram na re-verificação |

## Blast radius e cuidados

- **`tiebreakOf` mudando de assinatura** — sintoma: `_check-standings-order.ts` para de compilar/rodar **sem
  erro de typecheck**; como detectar: rodar o script à mão no mesmo passo (P3), nunca depois.
- **`getLeague` ganhando campo** — sintoma: nenhum esperado (aditivo); risco real é o **inverso** — a UI
  rotular a tabela com uma season e recomputá-la com outra. Como detectar: as duas queries partilham
  `useSeasonParam()`; se alguém tornar uma delas season-agnóstica o rótulo passa a mentir **em silêncio**
  (`171` e `1526` renderizam texto idêntico, e BRA é sempre `577`, então o bug é invisível no dado de hoje).
  **Invariante a preservar, registrada aqui de propósito.**
- **`573 "None"` → lista vazia** — sintoma: a tabela ordena por **ordem alfabética ignorando pontos**
  (`shared.ts:2123`); como detectar: a invariante do P3 rejeita lista vazia em vez de degradar.
- **Superfícies que leem o mesmo banco** — web (tabela), scripts de prognóstico (prompt da LLM) e `standings()`
  leem a **mesma** `season`. Corrigir o `api` sem corrigir o `ia` deixa a tela certa e o prompt errado; é
  justamente o estado de hoje.
- **`/standings` é rota pública sem guarda de `league.type`** — copa cai ali se alguém chamar direto, mesmo a
  UI renderizando bracket (`league-detail.tsx`). Mais um motivo para a invariante do P3.
- **Migração**: a árvore tem `0037_petite_mephistopheles.sql` **não-commitada** (SIN-009). O número desta
  feature **não é `0038` por decreto** — o `/i` gera com `drizzle-kit` e aceita o que sair.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:2060` — `TIEBREAK_BY_LEAGUE` é `Record<string, …>` por
  `league.code`; prova que o modelo atual **não consegue** expressar variação entre temporadas da mesma liga.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:686` — `resolveSeason` devolve `Promise<string>`
  (uuid), não a linha; prova que "passar a temporada resolvida" exige leitura extra, e sustenta a decisão D1.
- [código] `apps/api/src/modules/leagues/standings/standings.service.ts:17` — `tiebreakOf(code)` uma linha
  depois de `resolveSeason` (`:14`); prova que virar season-aware é troca de argumento, não refatoração.
- [código] `apps/api/scripts/_check-standings-order.ts:59` — `computeStandings(synthetic, tiebreakOf("BRA"))`
  com dado **sintético e sem banco**; prova que `tiebreakOf` precisa continuar pura, e que a quebra do arnês
  seria silenciosa.
- [código] `apps/api/tsconfig.json:12` — `include` cobre só `src/**/*.ts`; prova que `scripts/**` não é
  typechecked (R2).
- [código] `apps/api/scripts/backfill-season.ts:28` — monta a linha da season a partir de `lg` (a linha de
  `league`), sem request à API; prova que o 4º upsert **não pode** preencher a coluna.
- [código] `apps/web/features/leagues/components/league-detail/standings-table.tsx:143` — a faixa de legenda é
  condicionada a `present.length`; prova que a linha de desempate não pode ser pendurada nessa condição.
- [código] `apps/web/features/leagues/components/league-detail/league-detail.tsx:18-22` — `useLeagueQuery` e
  `useStandingsQuery` no mesmo componente; prova que o campo aditivo não custa request novo.
- [api] `GET /v3/football/seasons/{id}` (2026-07-20) — 15/15 temporadas com `tie_breaker_rule_id` preenchido,
  4 tipos distintos (`171`, `1526`, `577`, `573`); prova que o campo pode **dirigir** o comparador.
- [doc] `docs/arquitetura/modelagem.md:168` — `[cravado]` "cobertura é por (competição, temporada)"; precedente
  direto para atributo por temporada.

## Detalhes por passo

### §Schema (P1)

Aditivo e nullable — **só expand, sem contract**. Nada a remover: `TIEBREAK_BY_LEAGUE` **permanece** como
camada de override (decisão D5).

```ts
// Regra de desempate que a SportMonks declara pra esta temporada (`season.tie_breaker_rule_id`). É o
// SELETOR da regra, não a regra: a semântica de cada id mora em TIEBREAK_BY_RULE_ID (shared.ts). Nullable
// porque a ponte local `backfill-season.ts` não fala com a API. @feature LIG-017
sportmonksTieBreakerRuleId: integer("sportmonks_tie_breaker_rule_id"),
```

### §Semântica (P3)

Mapa curado — cada entrada escrita **contra o regulamento**, nunca derivada do `name` do tipo:

O mapa é `id → { criteria, label }`, **não** `id → criteria[]`. Isso é uma correção deste `/pl` sobre a
investigação: o tipo `Tiebreak` dela tem `label`, mas o mapa proposto só tinha a lista, deixando `label` sem
origem. `label` é o **rótulo curado da procedência** (o regulamento que manda), escrito à mão junto dos
critérios — nunca o `name` da SportMonks (D2). É `null` quando a regra caiu no default.

```ts
const TIEBREAK_BY_RULE_ID: Record<number, { criteria: TiebreakCriterion[]; label: string }> = {
  171:  { criteria: ["points", "goalDifference", "goalsFor"],          label: "Regulamento da Premier League" },
  1526: { criteria: ["points", "goalDifference", "goalsFor"],          label: "Regulamento da Premier League" },
  577:  { criteria: ["points", "wins", "goalDifference", "goalsFor"],  label: "Regulamento da CBF" },
  573:  { criteria: PREMIER_LEAGUE_TIEBREAK,                           label: "Sem regra declarada" }, // NUNCA [] — R1
}

type Tiebreak = {
  criteria: TiebreakCriterion[]      // nunca vazio — invariante
  source: "sportmonks" | "league-override" | "default"
  label: string | null               // null = caiu no default; a UI não inventa nome de regulamento
}
```

`label` é **rótulo de procedência**, não a lista de critérios — a linha exibida sob a tabela é montada a partir
de `criteria` (critério → coluna), não do `label`. São dois campos com papéis distintos; não colapse.

Ordem de resolução: `sportmonksTieBreakerRuleId` no mapa curado → override por `league.code` → default PL.
`tiebreakOf({ code, sportmonksTieBreakerRuleId })` — **objeto literal, sem banco**.

**O override também carrega `label`** — define-se `TIEBREAK_BY_RULE_ID` primeiro e o override aponta pra ele:

```ts
const TIEBREAK_BY_LEAGUE: Record<string, { criteria: TiebreakCriterion[]; label: string }> = {
  BRA: TIEBREAK_BY_RULE_ID[577]!,   // mesma regra, mesma procedência — sem duplicar a lista
}
```

Sem isso, o caso exato que o D5 existe pra proteger (id null → `BRA` cai no override) ordenaria certo mas
ficaria **sem procedência**, o que derrota metade do propósito do D5. Como os critérios são idênticos, apontar
pro mapa é DRY e o Brasileirão com id null exibe "Regulamento da CBF" com `source: "league-override"`.

Os 4 tipos colapsam exatamente nos 2 comparadores que já rodam ⇒ **não-regressivo por construção** para todo
dado ingerido hoje. É isso que o 11/11 do arnês tem de continuar mostrando.

### §Testes — roteiro de browser real (P5)

Escada: erro/variante → bordas → golden path por último. Dev server de pé (`bun run dev`).

- **T1 (variante — liga com regra própria):** `navigate_page` → `/leagues/BRA` · `take_snapshot` →
  assert: sob a tabela, texto *"Em caso de empate: 1. Vitórias (V) 2. Saldo de gols (SG) 3. Gols marcados (GP)"*.
- **T2 (variante — default inglês):** `navigate_page` → `/leagues/PL` · `take_snapshot` → assert: **sem**
  "Vitórias"; ordem saldo → gols marcados. Texto **diferente** do T1 (é isso que prova que a regra é por
  temporada e não uma string fixa).
- **T3 (borda — season antiga):** `/leagues/PL?season=<id 24/25>` → assert: renderiza sem erro. Como `171` e
  `1526` têm a mesma semântica, o texto é igual ao do T2 — **isso é esperado**, não é falha do teste.
- **T4 (borda — copa):** `/leagues/FAC` → assert: aba "Chaveamento", **sem** tabela e **sem** linha de
  desempate; nenhum erro de console.
- **T5 (borda — sem zonas):** liga cuja tabela não tem zona alguma → assert: a linha de desempate **aparece
  mesmo assim** (é a regressão que o `present.length` de `standings-table.tsx:143` provocaria).
- **T6 (golden path):** `/leagues/BRA` → confere que a ordem das linhas bate com a regra exibida num par
  empatado em pontos e saldo (o caso Atlético-MG × Corinthians).
- **Fechamento:** `list_console_messages` sem erro novo · `list_network_requests` sem falha, e **sem request
  adicional** para a tabela (o campo é aditivo numa query que já existia).

> **Gotcha de ambiente:** o MCP `chrome-devtools` não atacha com o Chrome do dono aberto
> (memória `chrome-devtools-profile-travado`). Se não atachar, **declarar** — não afirmar que a UI funciona.

### §Pendências ao dono — ambas RESOLVIDAS (2026-07-20)

- **[PENDENTE-DONO-1] — RESOLVIDO: id cru, com nome que declara a origem.** A pergunta era se a linha do banco
  deveria virar auto-descritiva via tabela de referência `tiebreaker_rule`. O dono respondeu que o incômodo era
  o **nome**, não a modelagem: guardar o id da SportMonks está ok, desde que o nome deixe claro que é id
  interno da fonte, e a API devolva a semântica bonita. **Decisão: coluna
  `sportmonks_tie_breaker_rule_id`**, sem tabela de referência. O prefixo `sportmonks_*_id` já é a convenção do
  schema (`sportmonks_season_id`, `sportmonks_team_id`, `sportmonks_referee_id`) e carrega exatamente esse
  significado — o nome resolve o pedido sem custar normalização.
- **[PENDENTE-DONO-2] — RESOLVIDO: não exibir a cauda não aplicada.** A recomendação do revisor, aceita: a
  cauda é justamente o que o modelo **não computa** (confronto direto é irrepresentável em `TiebreakCriterion`
  — R3/LIG-018). Exibir "…4. Confronto direto" apagado faria a UI descrever uma ordenação que o código não
  executa: se um empate real caísse no fallback alfabético (`shared.ts:2123`), o texto estaria **mentindo** —
  variante visível do C2. A lista de `criteria` aplicados já responde o que o usuário quer saber. Como é copy
  pura, dá pra acrescentar depois a custo zero. Se um dia o dono quiser a completude da Wikipédia, a única
  forma segura é bloco separado, legendado *"regulamento completo — ordenamos pelos critérios acima"*, **nunca**
  na mesma lista dos aplicados.

## Plano executável

Ver seção `## Plano` de
[docs/features/ligas/LIG-017-criterio-de-desempate-por-temporada.md](../features/ligas/LIG-017-criterio-de-desempate-por-temporada.md)
— os passos NÃO são duplicados aqui.
