# Investigação — Dias de descanso (rest days) na página da partida (LIG-005 / W-019)

> Exibir, na página da partida, há quantos dias mandante e visitante jogaram pela última vez antes
> deste jogo. **Display derivado, zero-schema** — a fatia visível e barata do sinal de fadiga
> (SIN-008). Promovida da wishlist **W-019**.

- **Tier:** Lookup/baixo — feature derivável, paridade de mercado, sem fan-out web (o domínio já está
  investigado no SIN-008; o trabalho real é arqueologia interna).
- **Data:** 2026-06-29
- **Feature:** `docs/features/ligas/LIG-005-rest-days-descanso.md`

---

## TL;DR + recomendação cravada

Rest days é **100% derivável do que já existe** — `match.date` (yyyy-MM-dd) + "último jogo jogado do
time antes desta data", exatamente o padrão que `computeForm` (`apps/api/src/modules/leagues/shared/shared.ts:1268`)
já implementa (`m.score != null` + `m.date < before` + ordena most-recent-first). **Zero schema, zero
migração, zero ingestão.** Recomendação: extrair um helper puro **`lastMatchBefore(matches, teamId, before): Match | null`**
no `shared.ts` (o "último jogo" que a **W-021** vai reusar pra puxar os marcadores — o par de cálculo),
e o `getMatch` (`apps/api/src/modules/leagues/get-match/get-match.service.ts:12`) anexa um campo
**`rest: { home, away }`** ao payload da partida (cada lado `{ lastMatchDate, restDays } | null`). A UI
mostra os dois números na aba **Fatos** do `match-detail` (irmão do card de venue do LIG-004), com a
**ressalva honesta**: só a **PL 25/26** está ingerida, então jogo de copa/seleção no meio de semana é
invisível e o descanso pode estar **superestimado** — rotular como "descanso na liga" e nunca alimentar
um sinal de fadiga sem o caveat (o SIN-008 já cravou: peso baixo, não calibrado). Estreia de temporada
(sem jogo anterior no dataset) → `null` → "estreia". É entregável hoje.

---

## Contexto e problema

**O quê:** na página da partida, "há quantos dias cada equipe jogou pela última vez" — rest days de
mandante e visitante, lado a lado. Lê na hora "vem de 3 dias × 7 dias de folga" (assimetria de carga).

**Por quê (da W-019):** rest days é o insumo cru de fadiga/carga, que pesa sobre over/under e resultado,
e é a fatia **visível e auditável** da intuição da "ressaca de meio de semana" — o usuário vê o número
que justifica o sinal, no lugar onde decide. Paridade com qualquer preview sério (rest days é coluna
padrão). É a **perna de UI** do SIN-008 (sinal de calendário e fadiga, *investigado*): o display vem
hoje; o sinal modelado vem depois e reaproveita o mesmo cálculo.

**Brief / requisitos implícitos:** datas via `date-fns` (regra do projeto — nada de `Intl` cru nem
aritmética manual de `new Date()`); código/dado em inglês, UI em pt-BR; honestidade de amostra
(single-season). Não há dinheiro envolvido. Não re-decide nada do `docs/arquitetura/` — opera dentro
do que o SIN-008 já cravou.

---

## Estado real no código

Tudo `lido-no-código` (Read/search desta sessão):

| Achado | Âncora | Classificação |
|---|---|---|
| `match.date` é `date(..., { mode: "string" })` → **yyyy-MM-dd string** | `apps/api/src/db/schemas/leagues.ts:66` | real — fonte do cálculo |
| `computeForm` já filtra `m.score != null` + `m.date < before` + ordena most-recent-first; `recent[0]` = último jogo jogado | `apps/api/src/modules/leagues/shared/shared.ts:1268` | real — **o mecanismo já existe** |
| `form.service` ancora na data da partida (`before: row.m.date`) e roda `computeForm` pros dois times | `apps/api/src/modules/leagues/form/form.service.ts:12-25` | real — prova que "último jogo antes de X" já é computado hoje |
| `loadMatches(code)` carrega todas as partidas da liga (já usado por form/standings) | `apps/api/src/modules/leagues/shared/shared.ts:441` | real — fonte do helper |
| `getMatch` monta o payload da partida (`useMatchQuery`); **não** chama `loadMatches` hoje | `apps/api/src/modules/leagues/get-match/get-match.service.ts:12` | real — ponto de injeção do campo `rest` |
| Tipo `Match` (id/round/date/home/away/score/venue) — o shape que `serializeMatch` devolve | `apps/api/src/modules/leagues/shared/shared.ts:112` | real — onde o tipo `rest` encosta no contrato |
| Aba **Fatos** do `match-detail` hoje só tem o card de venue (LIG-004) — lar natural do display | `apps/web/features/leagues/components/match-detail/match-detail.tsx:128-147` | real — superfície de UI |
| `match-detail` já busca `useMatchQuery(id)` **e** `useMatchFormQuery(id)` (side default `"all"`) | `match-detail.tsx:26-27`, `use-match-form-query.ts:10` | real — habilita a opção "puro front" |
| `daysAgo()` / `formatDate()` no web: parse **local** (`parse(day,"yyyy-MM-dd")`) + `differenceInCalendarDays`, evita off-by-one de fuso | `apps/web/features/leagues/utils/format.ts:11,19` | real — helper de diff pronto pra reuso |
| **`date-fns` NÃO está em `apps/api`** (só no web) | `apps/api/package.json` (grep `date-fns` vazio) | gap — decide onde o nº de dias é calculado |

**Conclusão da arqueologia:** o repo já sabe fazer "último jogo antes desta data" (é o coração da
`form`). A feature é **só re-expor esse cálculo como rest days** + renderizar. Nada de schema.

---

## Estado da arte / mercado

Rest days ("days of rest", "rest advantage") é **paridade absoluta** de qualquer preview de jogo
(FlashScore, Sofascore, FBref mostram dias desde o último jogo). Não é diferencial — faltar é que dói.
Classificação: **paridade** (`inferência`/domínio conhecido — não gastei fetch numa obviedade de
mercado). O diferencial do mrtip aqui não é o display, é a **honestidade auditável** (mostrar o número
com a ressalva de cobertura) e o reuso como insumo do SIN-008.

A fundamentação de domínio (rest days importa? quanto?) **já foi investigada** no SIN-008 e não se
re-pesquisa: Scoppa (2013) — efeito sobre **gols** só aparece com **descanso ≤3 dias**, some com 4+;
a maior parte do "under pós-Europa" é o efeito casa/fora que o mercado já precifica
(`docs/regras/calendario-fadiga.md:18-25`). Ou seja, o **número** é útil como contexto, mas o **sinal**
é fraco/condicional — daí este ser um *display*, não um driver de pick.

---

## Opções com matriz de trade-offs

Todas zero-schema. A escolha é **onde** o rest days é computado/exposto.

| Opção | Onde | Prós | Contras |
|---|---|---|---|
| **A — puro front** | `match-detail.tsx` deriva de `form.home.recent[0].date` (já fetchado) + `match.date` | Mais enxuta; **zero novo request** (form já carrega); ~15 linhas | Acopla ao `side="all"` default e ao sucesso do load da form; **hack semântico** (repurpose do `recent[0]` da form); **não reusa** pra W-021 (que precisa da API p/ os gols); número não auditável por curl |
| **B — campo no `getMatch`** ✅ | `getMatch` anexa `rest: {home,away}` via helper `lastMatchBefore` sobre `loadMatches` | **Desacoplado** da form (side/N); número **auditável por curl**; **helper reusado pela W-021** (o par de cálculo da wishlist); vive ao lado do venue (LIG-004) no mesmo payload; front fino | 1 `loadMatches` extra no `getMatch` (~380 rows, mesmo custo da form/standings); um pouco mais de código |
| C — novo endpoint `/:id/rest` | rota dedicada | Isolado | Request a mais por nada; rest days é fato da partida, pertence ao payload dela, não a um endpoint próprio |

**Recomendação: B.** O motivo decisivo é a **W-021** — o usuário vai pedir W-019 *e depois* W-021
("quem marcou no jogo anterior"), e a wishlist marca as duas como **par de cálculo** ("último jogo do
time antes desta data" é a mesma busca, dois consumos). Extrair `lastMatchBefore` agora cria a unidade
que a W-021 reusa pra puxar os `goal` daquele jogo. Some a isso: número auditável por curl (ethos
prova-por-superfície do projeto), desacoplamento da form, e o display caindo no mesmo lugar/payload do
venue. A opção A é a alternativa enxuta se quisermos deferir — mas perde a sinergia com a W-021.

### Sub-decisão (pro `/pl`): onde computar o número de dias

`date-fns` não está em `apps/api`. Duas saídas, ambas corretas:

1. **API computa `restDays` dep-free** (recomendado): `Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)`
   onde `a`/`b` são `yyyy-MM-dd` puros — `Date.parse` de data pura é **meia-noite UTC**, a diferença é
   **exata em dias de calendário** (sem fuso, sem float-error). Honra o ethos "número auditável por curl"
   e mantém `apps/api` sem nova dep. *Não* viola a regra "datas = date-fns" (a regra existe pra evitar
   bug de fuso/float; aqui não há nenhum dos dois — é diff inteiro de duas meia-noites UTC). Documentar
   o porquê no código pra ninguém "consertar" adicionando date-fns.
2. **API expõe só `lastMatchDate`; web computa `restDays`** via `differenceInCalendarDays` (reusando o
   parse-local do `daysAgo`). Mantém todo date-math no toolchain web. Custo: o número só é provado na UI.

Lean: **(1)** — número no contrato, front fino, curl-auditável.

---

## Modelo de dados proposto

Sem mudança de schema. Só tipos no contrato (`shared.ts`) + campo no retorno do `getMatch`:

```ts
// shared.ts — descanso de um lado: último jogo JOGADO na liga antes desta partida + dias até ela.
// null quando o time não tem jogo anterior no dataset (estreia da temporada ingerida).
export type TeamRest = { lastMatchDate: string; restDays: number } | null

// shared.ts — "último jogo jogado do time antes de `before`" (qualquer mando). Puro, sobre loadMatches.
// Reusado por W-019 (rest days) e W-021 (marcadores do jogo anterior) — o par de cálculo.
export function lastMatchBefore(matches: Match[], teamId: string, before: string): Match | null {
  return (
    matches
      .filter((m) => m.score != null)
      .filter((m) => m.home.id === teamId || m.away.id === teamId)
      .filter((m) => m.date < before)
      .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null
  )
}

// get-match.service.ts — anexa rest ao payload (mesma forma do { home, away } já usado pela form).
// rest: { home: TeamRest; away: TeamRest }
```

Fadiga é **venue-agnóstica** → o último jogo é o overall (qualquer mando), não filtrado por `side`.

---

## Plano por faceta

- **dados:** nada. (Schema já suporta; `match.date` + partidas já ingeridas.)
- **api:** helper `lastMatchBefore` no `shared.ts`; `getMatch` chama `loadMatches(row.m.leagueCode)`,
  computa `rest.home`/`rest.away` (helper + diff dep-free), anexa ao retorno; estender o tipo do payload.
  **Prova:** `curl /v1/matches/<id> | jq '.rest'` → `{ home:{lastMatchDate, restDays}, away:{…} }`;
  conferir contra duas datas reais à mão; partida de estreia → `rest.home` ou `.away` null.
- **ia:** nada agora (o consumo pelo SIN-008 é roadmap, não esta feature).
- **ui:** na aba **Fatos** do `match-detail`, uma linha "Descanso (na liga): Mandante N dias · Visitante
  M dias" (irmão do card de venue), com ressalva de cobertura; null → "estreia"/"—". Strings pt-BR.
  Eden flui o tipo. **Prova:** Chrome (chrome-devtools) — render correto numa partida com os dois lados,
  e numa partida de início de temporada (estreia), console limpo; `typecheck`.

---

## Riscos e gotchas

1. **Single-season superestima o descanso (o grande).** Só a **PL 25/26** está ingerida — jogo de
   copa/Champions/seleção no meio de semana **não aparece**, então o "descanso" calculado pode estar
   **alto demais** justamente no caso que mais interessa à fadiga. O SIN-008 abre com isso
   (`docs/regras/calendario-fadiga.md:14,72` pedem "dias de descanso dos dois times" de fonte com tag de
   competição). **Mitigação:** rotular "descanso **na liga**", mostrar com ressalva, e **nunca** passar
   esse número cru a um sinal de fadiga sem o caveat. É display honesto, não verdade absoluta.
2. **Estreia / primeiro jogo do dataset → sem jogo anterior.** `lastMatchBefore` devolve `null` → UI
   "estreia da temporada"/"—". O primeiro jogo da 25/26 cai aqui (o anterior seria 24/25, não ingerido)
   — e isso é **correto**: within-season é o escopo honesto.
3. **Convenção de diff.** Usar dias de **calendário** (não 24h-blocks): "jogou sábado, joga terça" = 3
   dias. A opção dep-free (meia-noite UTC) e o `differenceInCalendarDays` do web dão o mesmo inteiro;
   não misturar com horário (a coluna `match.date` é data pura, sem hora).
4. **Partida futura (sem score).** Rest days ainda faz sentido (dias desde o último jogo *jogado* até a
   data do fixture). Ancorar sempre em `match.date`; o filtro `score != null` é só no **jogo anterior**,
   não nesta partida.
5. **Custo do `loadMatches`.** Carrega a liga inteira (~380 rows) pra achar 2 jogos. É o mesmo custo de
   form/standings — aceitável. Otimização podável (query `max(date)` direcionada por time) fica pro `/pl`
   se algum dia pesar; a W-021 precisa do **row** do jogo (pros gols), então o `loadMatches` compartilhado
   é o caminho consistente.

---

## Refutado

- **"Precisa de migração / tabela nova" (premissa implícita da faceta `dados` na W-019).** Refutado: o
  dado é 100% derivável de `match.date` + partidas já ingeridas; `computeForm` (`shared.ts:1268`) já faz
  a busca "último jogo antes de X". Faceta `dados` cai pra **nenhuma** (zero schema). Evidência: schema
  `match` (`leagues.ts:66`) e a própria `form.service` (`form.service.ts:12-25`).
- **"date-fns obrigatório pro diff no backend".** Refutado como bloqueio: o diff de duas datas puras
  yyyy-MM-dd é exato via meia-noite UTC, sem o fuso/float que a regra date-fns existe pra prevenir.
  date-fns continua dono do date-math no **web**; o backend pode reportar o inteiro dep-free.

---

## Perguntas abertas / lacunas

1. **Onde computar `restDays`** (API dep-free vs web via date-fns) — decisão do `/pl`; lean API dep-free.
   Baixo risco, reversível.
2. **Copy da ressalva de cobertura** — "descanso na liga" inline? tooltip? ícone de info? Decidir no `/i`
   junto da UI (default: legenda curta "na liga" + texto explicativo no hover).
3. **Layout exato na aba Fatos** — linha própria acima/abaixo do venue, ou um mini-card de "contexto"
   agrupando venue + descanso. Default: linha própria; barato trocar.
4. Nenhuma busca web foi necessária (tier lookup); nenhuma fonte externa voltou vazia porque nenhuma foi
   disparada — o domínio está coberto pelo SIN-008.
