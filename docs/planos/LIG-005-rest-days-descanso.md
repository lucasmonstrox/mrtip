# Dossiê de codificação — LIG-005 · Dias de descanso (rest days) na página da partida

Base: commit `dc71e0e` (2026-06-29). Todo `path:linha` abaixo vale nesse commit.

> Plano executável: seção `## Plano` em `docs/features/ligas/LIG-005-rest-days-descanso.md`.
> Investigação: `docs/investigacoes/rest-days-descanso-na-partida.md`. Constraints transversais
> (inglês no código, UI pt-BR, Eden flui tipo) no CLAUDE.md/memória — não repetidas aqui.

## Briefing — o que já foi decidido

- **Dono nesta conversa:** pediu W-019 primeiro, na sequência `/rs` → `/pl` → `/i`. W-021 ("quem marcou
  no jogo anterior") vem depois e a wishlist marca as duas como **par de cálculo** (mesmo "último jogo
  antes desta data") — por isso o helper sai compartilhado já aqui.
- **Investigação (cravado):** Opção **B** — campo `rest` no `getMatch` via helper `lastMatchBefore` sobre
  `loadMatches`, desacoplado da `form`. Display na aba **Fatos** do `match-detail`. Zero schema.
  (`docs/investigacoes/rest-days-descanso-na-partida.md` §Opções/§Modelo de dados.)
- **Micro-decisão resolvida (default lean):** o número de dias é computado **na API, dep-free** —
  `date-fns` não está em `apps/api` e o diff de duas datas puras `yyyy-MM-dd` é exato via meia-noite UTC
  (`Math.round((Date.parse(b)-Date.parse(a))/86_400_000)`), sem fuso nem float. Honra "número auditável
  por curl" e mantém `apps/api` sem nova dep. Reversível (baixo risco) se o `/i` preferir expor só a data.
- **SIN-008 (autoridade de domínio):** rest days é a perna de UI do sinal de fadiga; peso **baixo, não
  calibrado**; o limite single-season é dele (`docs/regras/calendario-fadiga.md:14,72`).

## Estado do terreno (validado neste commit)

| Ponto | Âncora | Papel no plano |
|---|---|---|
| `computeForm` já filtra `score != null` + `date < before` + ordena most-recent-first | `apps/api/src/modules/leagues/shared/shared.ts:1268` | molde do `lastMatchBefore` (mesma lógica, retorna o `Match` em vez de `Form`) |
| `loadMatches(code)` → todas as partidas da liga (serializadas) | `apps/api/src/modules/leagues/shared/shared.ts:441` | fonte do helper; `getMatch` passa a chamá-la |
| `getMatch` monta `{ ...serializeMatch(row), league, goals, cards }` | `apps/api/src/modules/leagues/get-match/get-match.service.ts:12-19` | anexa `rest` aqui (Eden flui pro `match.rest`) |
| Tipo `Match` (sem `rest`) | `apps/api/src/modules/leagues/shared/shared.ts:112` | `rest` NÃO entra no `Match` base (listas/rounds não precisam); vai só no retorno do `getMatch`. `TeamRest` é tipo novo exportado do `shared.ts` |
| `match.date` = `date(mode:"string")` yyyy-MM-dd | `apps/api/src/db/schemas/leagues.ts:66` | diff de datas puras, zero migração |
| Aba **Fatos** = card de venue (LIG-004) + empty-state | `apps/web/features/leagues/components/match-detail/match-detail.tsx:128-147` | irmão onde a linha de descanso entra |
| `match-detail` já tem `match` via `useMatchQuery` | `match-detail.tsx:26` | `match.rest` chega de graça (sem novo request) |
| Tipos re-exportados de `@workspace/api`; `goals`/`cards` provam que campos do retorno do `getMatch` fluem sem export manual | `apps/web/features/leagues/types/index.ts:1-31` | `match.rest` infere via Eden; opcional re-exportar `TeamRest` p/ tipar o subcomponente |

## Dependências e blast radius

| Alvo alterado | Consumidores | O que re-testar / sintoma se quebrar |
|---|---|---|
| `getMatch` (+campo `rest`) | `GET /v1/matches/:id` → `useMatchQuery` → `MatchDetail` | só **aditivo** (campo novo). Sintoma se errar: `rest` ausente/errado no curl; partida ainda carrega (campo extra não quebra Eden) |
| `shared.ts` (+`lastMatchBefore`, +`TeamRest`) | novo símbolo; ninguém importa ainda (W-021 importará depois) | adição pura, sem caller existente — `codebase_impact` nulo |
| `match-detail.tsx` aba Fatos (+linha de descanso) | a própria página | render quebrado/console error; isolado nessa aba |

Nenhuma âncora compartilhada **alterada** (só leitura de `match`; `getMatch` ganha campo aditivo).
`features impact LIG-005`: impacta SIN-008 (consumo futuro do cálculo) — não há código de SIN-008 pra
re-testar hoje.

## Cuidados (Cn)

- **C1 — single-season superestima (o grande).** Só PL 25/26 ingerida → jogo de copa/seleção no meio de
  semana invisível → `restDays` alto demais. UI **deve** rotular "descanso na liga" + ressalva; nunca
  apresentar como verdade absoluta. (`docs/regras/calendario-fadiga.md:14`.)
- **C2 — estreia → null.** Primeiro jogo do dataset não tem anterior → `lastMatchBefore` = null → UI
  "estreia"/"—". Correto (within-season é o escopo honesto).
- **C3 — dias de calendário, não 24h.** "Sábado→terça" = 3. O diff UTC-midnight e o `differenceInCalendarDays`
  do web dão o mesmo inteiro; não misturar com horário (coluna é data pura).
- **C4 — partida futura (sem score).** Ancorar em `match.date` mesmo sem resultado; o filtro `score != null`
  é só no jogo **anterior**.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:1268` — `computeForm`: a busca "último jogo antes
  de X" já existe; `lastMatchBefore` é a mesma lógica devolvendo o `Match`.
- [código] `apps/api/src/modules/leagues/get-match/get-match.service.ts:12` — ponto de injeção do `rest`.
- [código] `apps/api/src/db/schemas/leagues.ts:66` — `match.date` yyyy-MM-dd: zero migração.
- [código] `apps/web/.../match-detail/match-detail.tsx:128-147` — aba Fatos (venue LIG-004): lar do display.
- [doc] `docs/regras/calendario-fadiga.md:14,72` — SIN-008: fundamenta o uso e o caveat de cobertura.
