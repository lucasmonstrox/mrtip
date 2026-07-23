# SIN-023 — Viagem / deslocamento dos times (km, última perna) · dossiê de planejamento (2026-07-23)

Feature: [docs/features/sinais/SIN-023-viagem-deslocamento-times.md](../features/sinais/SIN-023-viagem-deslocamento-times.md)
Base: commit `b8d47c1` (2026-07-23) — todo file:line deste doc vale neste commit.

## TL;DR

Endurecer o proxy já existente de `travelKm` no prompt vivo: **haversine last-leg inbound do visitante** (venue do `lastMatchAnyComp(away)` → venue do jogo; fallback = proxy casa→jogo), com **proveniência + escala p50/p90 por liga** e **doutrina EXPLAIN** (não move λ; não dupla-conta mando; sem modal; sem bins de edge; casa omitida). Superfície única de código produto: `apps/api/scripts/prognosis-prompt.ts` (+ comentário de posse em `leagues.ts` venue). Super herda a fatia `## Contexto` via spawn — sem duplicar lógica. Zero schema, zero Mapbox, zero UI/API no MVP.

## Briefing — o que já foi falado e decidido

- **MVP cravado pelo `/rs` (2026-07-23)** — fonte: `docs/investigacoes/viagem-deslocamento-times.md` §TL;DR + §Recomendação: (1) km haversine inbound visitante last-leg + fallback proxy; (2) omitir modal; (3) casa omitida por default; (4) camada EXPLAIN nos 2 prompts; (5) Mapbox fora; (6) zero schema; (7) proveniência + escala liga p50/p90 sem bins de edge; (8) ≠ W-049.
- **Counter-review matou** — fonte: mesma investigação §counter-review: last-leg simétrico home+away; bins ordinais como sinal; “EXPLAIN = firewall” frouxo sem doutrina anti-fadiga/mando.
- **Dono (conversa pré-/pl, 2026-07-23)** — pediu km nos 2 prompts; tem Mapbox key mas aceita fora do MVP; não sabia limiar modal → omitir; pediu `/rs` completo → SIN-023 `investigado`; agora `/pl` em agente fresco. **Não reabrir** o MVP sem `[PENDENTE-DONO]`.
- **Pergunta aberta #1 (copy escala)** — fonte: investigação §Perguntas abertas + briefing do orquestrador: resolvida neste plano como **D1** (default seguro): km bruto + proveniência **e** nota p50/p90 hardcoded (não km-only; não bins).
- **Perguntas #2–#5** — cumulative / fuso / UI painel / backtest CLV → **Fora de escopo** (não gold-platear).
- **Doutrina mãe** — fonte: `docs/regras/calendario-fadiga.md` §1: fadiga/distância crua ≈ mando já precificado; distância não-sig controlando força; altitude fica em SIN-008. SIN-016 = mando já embutido nos λ.
- **Precedente de forma (passo+Prova)** — fonte: `docs/planos/MOD-008-desgaste-sequencia-jogos-dificeis.md` + Plano em MOD-009: tweak no bloco Descanso do `prognosis-prompt.ts`, prova = gerar prompt + grep/diff restrito ao `## Contexto`.
- **Nascimento do proxy** — commit `c9bb684` (2026-06-29): `travelKm` + linha `Viagem do visitante` no prompt.
- **Deps** — `LIG-004` e `LIG-005` estão `verificado` → gate `depende_de` liberado (sem P0 stub).

## Estado do terreno

Tudo validado nesta sessão via SocratiCode (`codebase_symbols` / `codebase_graph_query` / `codebase_impact`) + re-Read das âncoras.

- **`haversineKm`** — `apps/api/scripts/prognosis-prompt.ts:28-36` (R=6371, arredonda km). `codebase_impact` → 0 callers externos (esperado: função local do script CLI).
- **`lastMatchAnyComp`** — `prognosis-prompt.ts:817-822` (liga∪copa via `teamMatches` + `cupMatchesOf`). Mesmo: callers só no arquivo (alimenta `restDays`/`lastMatchNote`). `Row` = linha completa de `match` (`:72`) → tem `venueId`.
- **Proxy atual (NÃO last-leg)** — `prognosis-prompt.ts:901-909`: haversine(venue do jogo, venue do **último jogo em casa** do visitante). Comentário ainda diz “proxy de fadiga”.
- **Injeção** — `prognosis-prompt.ts:1940`: `- Viagem do visitante: ~N km` colado na linha de Descanso quando `travelKm != null`.
- **Doutrina Descanso** — `:1943`; densidade/dureza MOD-008/009 — `:1941-1944`; mando — `:1946` (“já embutida nos λ — NÃO some de novo”). **Não há** bullet específico de viagem.
- **Venue do jogo** — `:55` carrega `matchVenue` via `m.venueId`.
- **Super herança** — `apps/api/scripts/super-prognosis.ts:772-778`: `Bun.spawnSync` do `prognosis-prompt.ts` → fatia `## Contexto`…`**PARTE 3`. Chave de bloco `contexto` já lista `descanso/viagem` (`:335`).
- **Schema** — `apps/api/src/db/schemas/leagues.ts:104-105` `venue.latitude`/`longitude`; comentário `:92-95` ainda atribui travel a SIN-008 (débito de naming — corrigir no `/i`).
- **CLI** — `bun run scripts/prognosis-prompt.ts <matchId>` (cwd `apps/api`); default id `:22`; escreve `scripts/output/prognosis-<matchId>.md`.
- **UI/API travel** — gap (LIG-005 RestPanel mostra descanso, não km). MVP **não** preenche.
- **Cobertura geo (herdada do `/rs`, 2026-07-23)** — PL/BRA matches 100% com geo; FAC ~123/871 matches com venue geo → last-leg cross-cup pode cair no fallback.

## Mapa de dependências

**Features** (`bun run features impact SIN-023`):
- `depende_de`: LIG-004 (venue geo), LIG-005 (`lastMatchAnyComp` / descanso) — ambos verificados.
- `impacta` declarados: SIN-008 (doutrina), SIN-016 (mando), MOD-004 (prompt vivo compartilhado).
- Declaram impactar SIN-023: LIG-004, LIG-005, SIN-008.
- Âncoras compartilhadas amplas (`match`/`venue`) — re-teste **prático** restringe a quem lê o prompt: MOD-004 + geração vivo/super; não re-rodar toda a família LIG-* só por comentário/linha de Contexto.

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `prognosis-prompt.ts#haversineKm` | bloco travel (`:901-909`) | Provas P1–P2 (km numérico) |
| `prognosis-prompt.ts#lastMatchAnyComp` | `restDays`, `lastMatchNote`, **novo** last-leg travel | Descanso intacto + viagem last-leg |
| bloco `travelKm` (`:901-909`) → vira last-leg+fallback | template `:1940` | grep linha Viagem + method |
| template `## Contexto` (`:1936-1946`) | `super-prognosis.ts:772-778` (spawn+fatia) | super ainda acha marcadores; diff só Contexto |
| `leagues.ts` comentário venue (`:92-95`) | nenhum runtime | typecheck; sem migração |

Nota SocratiCode: `codebase_impact` em `haversineKm`/`lastMatchAnyComp` devolveu “0 callers” — **falso negativo de script-local** (não exportados). Consumidores confirmados por re-Read no mesmo arquivo + spawn do super.

## Blast radius e cuidados

- **Prompt vivo + super** — mesma fonte de Parte 2; quebrar marcadores `## Contexto` / `**PARTE 3` derruba o super (`super-prognosis.ts:775-777`). Sintoma: throw “não achei os marcadores”; detectar: gerar um super dry ou só o prompt e assert nos índices.
- **Descanso/LIG-005** — reusar `lastMatchAnyComp` sem alterar assinatura; se o `/i` “otimizar” o helper, assimetria de descanso quebra. Detectar: grep linha `- Descanso:` idêntica em jogo de referência vs baseline pré-diff (exceto hunks de Viagem/doutrina).
- **MOD-004 / λ** — viagem **não** pode tocar `lambdaHome`/`marketProbs`. Detectar: diff do md gerado sem hunks em seções de λ/probs; ou `grep` das linhas de âncora Poisson iguais.
- **Dupla contagem com mando (SIN-016)** — LLM interpreta km como edge extra além da vantagem de casa já nos λ. Sintoma: unders/overs sistemáticos em visitantes “longe”. Mitigação: bullet doutrina no P3 (colada, não só link).
- **FAC geo esparso** — last-leg falha → fallback proxy (honesto via `method`). Sintoma: muitos `home-proxy` em copa; aceitável no MVP.
- **Linguagem causal / Lei 14.790** — proibir “viagem longa → under” no copy. Detectar: grep do bullet sem bins `curta|média|longa` como rótulo de edge.
- **Rollback** — `git revert` puro (texto de script + comentário). Não desfaz prompts/prognósticos já gerados.

## Evidências

- [doc] `docs/investigacoes/viagem-deslocamento-times.md` — MVP + matriz A–F + counter-review + p50/p90 PL/BRA.
- [doc] `docs/regras/calendario-fadiga.md` §1 — distância/fadiga crua REFUTED como edge; altitude ≠ este carve-out.
- [código] `apps/api/scripts/prognosis-prompt.ts:28-36` — `haversineKm` já existe.
- [código] `apps/api/scripts/prognosis-prompt.ts:817-822` — `lastMatchAnyComp` base do last-leg.
- [código] `apps/api/scripts/prognosis-prompt.ts:901-909` — proxy casa→jogo (a substituir como primário).
- [código] `apps/api/scripts/prognosis-prompt.ts:1940` — injeção atual sem proveniência/escala/doutrina.
- [código] `apps/api/scripts/super-prognosis.ts:772-778` — super herda Contexto via spawn.
- [commit] `c9bb684` — nascimento de `travelKm` no prompt.
- [doc] `docs/planos/MOD-008-desgaste-sequencia-jogos-dificeis.md` — precedente passo+Prova no mesmo bloco.

## Detalhes por passo (referenciados pelo ## Plano)

### §Cálculo last-leg + fallback (P1)

Intenção (não código pronto): perto do bloco `:901-909`, substituir o `let travelKm` por um resultado tipado (`type`, nunca `interface`):

```ts
type AwayTravel = {
  km: number
  method: "last_leg" | "home_proxy"
}
```

Ordem:
1. Se `matchVenue` sem lat/lon → `null` (omite linha, como hoje).
2. `prev = lastMatchAnyComp(away.id)`; se `prev?.venueId` e venue com geo → `haversineKm(prevVenue, matchVenue)` + `method: "last_leg"`.
3. Senão: proxy atual (último jogo **em casa** do visitante na liga via `teamMatches`) + `method: "home_proxy"`.
4. **Don't:** calcular viagem do mandante; inferir ônibus/avião; usar Mapbox Directions; gravar em tabela; mover λ.

Labels PT na linha: `last-leg` / `home-proxy` (ou “última perna” / “proxy casa→jogo”) — micro-copy adiada ao `/i`, desde que `method` fique auditável.

### §Copy da linha + escala (P1–P2) — D1

Forma alvo (1–2 linhas sob Descanso):

```
- Viagem do visitante: ~N km (great-circle venue→venue; <method>; modal desconhecido)
- Escala nesta liga (visitante, amostra finished): p50 ≈ X · p90 ≈ Y km — contexto de tamanho, NÃO edge
```

Constantes hardcoded (as-of `/rs` 2026-07-23; **proxy** p50/p90 — escala estável do “tamanho típico” da liga; a linha do jogo usa last-leg):

| leagueCode | p50 | p90 | max (só doc) |
|---|---|---|---|
| PL | 180 | 357 | 472 |
| BRA | 722 | 2314 | 3202 |

Outras ligas: **omitir** a linha de escala (só km+proveniência). Não inventar bins `curta/média/longa`.

### §Doutrina EXPLAIN (P3) — âncoras obrigatórias do texto

Bullet novo (colar perto de `:1943-1946`), deve conter em qualquer redação:
1. camada **EXPLAIN** / evidência qualitativa — **NUNCA** recalcular λ/probabilidades por km;
2. km do visitante é **componente do mando** já embutido nos λ (`:1946`) — **não dupla-contar**;
3. sinal fraco/agudo: distância sozinha não é edge (herda SIN-008 / `calendario-fadiga.md`);
4. **sem modal** (desconhecido) e **sem** “viagem longa → under”;
5. assimetria de **Descanso** continua na linha própria — viagem não substitui dias de folga.

### §Provas — jogos de referência

- PL default do script: `77a4255a-3e44-4fd9-a133-b13ca0898a91`
- BRA (já gerado nesta árvore): `dd109402-f7cd-4029-b3da-14e9044fb1c4` (hoje `~981 km` no proxy)
- BRA: `d87c9963-4145-47b6-a6ad-e1e170b6146c`

O `/i` deve, se possível, escolher 1 jogo em que o último jogo do visitante **não** foi em casa (last-leg ≠ proxy) e assertar `method`/`last-leg` no texto — senão documentar que a amostra local só cobriu fallback.

### §Comentário schema (P3)

Atualizar `leagues.ts:92-95`: travel geográfico no dossiê = **SIN-023**; fadiga/altitude continua SIN-008. Só comentário — zero migração.

### §Testes (camadas)

- **ia/dados (script):** `cd apps/api && bun run scripts/prognosis-prompt.ts <id>` → grep linhas Viagem/Escala/doutrina; diff md restrito a `## Contexto`; assert ausência de mudança em λ.
- **api/ui:** N/A no MVP (facetas omitidas).
- **chrome-devtools / Playwright:** N/A.
- **Cobertura geo (assert, não passo de schema):** opcional no `/i` — query read-only “matches da liga com venue geo / total” (FAC hole conhecido); não bloqueia merge se PL/BRA 100%.

## Plano executável

Ver seção `## Plano` de [docs/features/sinais/SIN-023-viagem-deslocamento-times.md](../features/sinais/SIN-023-viagem-deslocamento-times.md) — os passos NÃO são duplicados aqui.
