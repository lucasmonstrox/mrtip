# SIN-011 — Sinal de lesões e desfalques · dossiê de planejamento (2026-06-28)

Feature: [docs/features/sinais/SIN-011-lesoes.md](../features/sinais/SIN-011-lesoes.md)
Base: commit `619875b` (2026-06-28) — todo file:line deste doc vale neste commit.

## TL;DR

Popular a tabela `injury` (hoje **vazia**, `count=0`) no sync da SportMonks, ingerindo o include `sidelined` que já provamos voltar 100% de cobertura no nosso tier. Escopo deste plano = **só a faceta `dados`** (ingestão). A faceta `ia` (direção por posição, antecipação de suspensão) fica para outra fase. Decisão central, que **inverte a recomendação preliminar desta conversa**: gravar `type ∈ {"Missing Fixture","Questionable"}` (não o `developer_name` cru), porque o caminho de leitura **já existente** é load-bearing nesses valores — assim a ingestão acende os reads sem tocar neles e **sem migração de schema**.

## Briefing — o que já foi falado e decidido

- **Escopo = ingestão, não o sinal completo.** O dono pediu "popular a tabela injury no sync" — fonte: dono nesta conversa (2026-06-28). A regra de produto do sinal (direção atacante→under / goleiro→over, timing pós-escalação) está em `docs/regras/lesoes.md` e é a faceta `ia`, fora deste plano.
- **Tier libera o dado.** Probe real das 380 fixtures: `sidelined` volta em 100% delas, média 8.8/jogo, base (time+jogador+tipo) sempre presente — fonte: `docs/investigacoes/desfalques-sportmonks-estudo.md` (2026-06-28).
- **`sidelined.sideline` (detalhe) descartado deste escopo.** Só 17% de cobertura e `games_missed` é cumulativo de carreira (máx 100 num campeonato de 38) — o read path deriva "jogos perdidos" contando linhas, não usa esse campo. Fonte: estudo §"games_missed cumulativo".
- **VETO herdado:** xG vetado pelo dono (2026-06-28) em LIG-002 — não encosta aqui, mas registra o tom: não inflar com add-on pago. Suspensões já vêm de graça no mesmo `sidelined`.

## Estado do terreno

- **Tabela `injury`** (`apps/api/src/db/schemas/leagues.ts:199-216`): `matchId, teamId, playerId, type(text,notNull), reason(text)`, `unique(matchId, playerId)`. Comentário (`leagues.ts:196-197`) já documenta a semântica pretendida: `type` = `"Missing Fixture"` (não jogou) | `"Questionable"` (dúvida); `reason` = causa.
- **`[banco]` `select count(*) from injury` = 0** (estudo, 2026-06-28) — tabela e reads existem, ninguém escreve.
- **Sync não escreve injury** — zero menções a `injury`/`sidelined` em `apps/api/src/db/sync-sportmonks.ts` (grep, 2026-06-28). Include de fixtures em `sync-sportmonks.ts:291-292` traz `participants;scores;round;state;lineups.*;formations;events.type` — **sem `sidelined`**.
- **Helpers disponíveis no ponto de inserção** (dentro de `main()`, após o loop de eventos `sync-sportmonks.ts:462-498`): `matchIdByFixture` (`:299`), `teamIdBySm` (`:221`), `ensurePlayer` (`:450-460`, cria stub id+name p/ quem não está em lineup — lesionado nunca está). Tipo `SmFixture` (`:107-118`) precisa ganhar `sidelined?`.
- **Read path JÁ consome `injury`, load-bearing em `type`:**
  - `loadMatchAbsences` (`shared.ts:826-930`) → `didNotPlay = (type === "Missing Fixture")` (`:912`); agrupa "não jogou" vs "dúvida". Alimenta `matchInjuries` → `GET /v1/matches/:id/injuries` (painel de desfalques, LIG-002).
  - "jogos perdidos" do jogador: `shared.ts:405-406` filtra `injury.type === "Missing Fixture"` (perfil do jogador, LIG-001).
  - `consecutiveOut`/`totalOut`: `shared.ts:885-888` idem `type === "Missing Fixture"`.

## Mapa de dependências

**Features** (`bun run features impact SIN-011`): re-testar DOS-001, MOD-001, SIN-012, SIN-020 — mas esses consomem o **sinal** (faceta `ia`), que este plano não entrega; não quebram com ingestão pura. O blast radius **real** é dos reads que já leem `injury`: **LIG-001** (perfil do jogador) e **LIG-002** (painel de desfalques do jogo) — saem de "vazio" para "populado".

**Código** (alvo único alterado):

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `sync-sportmonks.ts` (novo loop de `injury` + include) | nada importa o script | rodar `db:sync`; assert no banco |
| tabela `injury` (passa a ter linhas) | `shared.ts#loadMatchAbsences`, `shared.ts:405` (perfil), `shared.ts:885` | `GET /v1/matches/:id/injuries` populado; stat "jogos perdidos" no perfil do jogador |

## Blast radius e cuidados

- **`GET /v1/matches/:id/injuries`** vai de `{home:null, away:null}` para listas populadas — sintoma se o mapeamento de `type` errar: todos caem em "dúvida" (`didNotPlay` sempre false) ou todos em "não jogou". Detectar: assert que existem AMBOS os valores no banco pós-sync + checar o painel no Chrome.
- **Perfil do jogador (LIG-001)** ganha stat "jogos perdidos" real — sintoma se `type` não for exatamente `"Missing Fixture"`: stat fica 0 mesmo com lesão. Detectar: query `count filter (where type='Missing Fixture')` > 0.
- **Jogador-stub sem posição/foto** — lesionado fora de lineup entra via `ensurePlayer` (só id+name). O painel mostra só nome (ok), mas a faceta `ia` (direção por posição) vai precisar enriquecer depois. Detectar: n/a aqui (é non-goal). Vira follow-up.
- **Dupla lesão no mesmo jogo** (2 registros `sidelined` p/ o mesmo player) colide no `unique(matchId, playerId)` → `onConflictDoUpdate` mantém o último. Aceito; raro.

## Evidências

- [banco] `select count(*) from injury` = 0 (estudo, 2026-06-28) — tabela vazia, sync não escreve.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:912` — `didNotPlay = r.type === "Missing Fixture"`: o read path é load-bearing nessa string literal.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:888` e `:406` — mesmo filtro `type === "Missing Fixture"` p/ "jogos perdidos"/consecutivos.
- [código] `apps/api/src/db/sync-sportmonks.ts:291-292` — include de fixtures sem `sidelined`; `:450-460` `ensurePlayer`; `:462-498` loop de eventos (ponto de inserção do novo loop).
- [doc] `docs/investigacoes/desfalques-sportmonks-estudo.md` — shape real do `sidelined`, 100% cobertura, `DOUBTFUL` é o "Questionable", `games_missed` cumulativo (descartado).

## Detalhes por passo (referenciados pelo ## Plano)

### §Mapa-de-tipo (P1)

Cada item de `f.sidelined[]` tem `participant_id` (→ `teamIdBySm`), `player_id`+`player{}` (→ `ensurePlayer`), e `type{ name, developer_name }`. Gravar:

```
type   = item.type?.developer_name === "DOUBTFUL" ? "Questionable" : "Missing Fixture"
reason = item.type?.name ?? null          // "Hamstring Injury", "Red Card Suspension", "Doubtful"
upsert onConflict (matchId, playerId)
```

Filtro de guarda: pular item sem `player_id` ou cujo `teamIdBySm`/`matchIdByFixture` não resolva (mesma defesa do loop de eventos `:467-470`). Include a anexar em `sync-sportmonks.ts:292`: `;sidelined.player;sidelined.type` (NÃO `;sidelined.sideline`). Extensão de tipo em `SmFixture` (`:107-118`): `sidelined?: { participant_id: number; player_id: number; player?: { id: number; name?: string; common_name?: string }; type?: { name: string; developer_name: string } }[]`.

## Plano executável

Ver seção `## Plano` de [docs/features/sinais/SIN-011-lesoes.md](../features/sinais/SIN-011-lesoes.md) — os passos NÃO são duplicados aqui.
