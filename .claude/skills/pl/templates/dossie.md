# Template do dossiê — `docs/planos/<ID>-<slug>.md`

O registro completo do que o planejamento encontrou (o `## Plano` na feature é só o outline; o dossiê é a memória). Plano-mini dispensa dossiê.

```markdown
# <ID> — <título da feature> · dossiê de planejamento (AAAA-MM-DD)

Feature: [docs/features/<modulo>/<ID>-<slug>.md](../features/<modulo>/<ID>-<slug>.md)
Base: commit `<git rev-parse --short HEAD>` (AAAA-MM-DD) — todo file:line deste doc vale neste commit.

## TL;DR

<O que vai ser feito e a decisão central, 1 parágrafo.>

## Briefing — o que já foi falado e decidido

<Cada item com fonte. Inclui o que foi explicitamente VETADO.>
- <decisão/restrição> — fonte: <path do doc | memória | commit abc1234 | dono nesta conversa (data)>
- Conflitos entre fontes → `[PENDENTE-DONO: ...]`, nunca escolha silenciosa.

## Estado do terreno

<O que existe HOJE por faceta: paths reais, real × mock × fantasma, shapes/colunas confirmados via context_search.
Referencie código por `path:linha` na 1ª menção (Regras de citação interna, SKILL §4) — NUNCA re-descreva a lógica em prosa.>

## Mapa de dependências

**Features** (saída de `bun run features impact <ID>` + grafos `depende_de`/`impacta`, com o porquê de cada aresta):
- <ID-X> ← <por que encosta>

**Código** (por arquivo-alvo: imports/dependentes via `graph_query`; por símbolo ALTERADO: callers via `codebase_impact`):

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `<path#simbolo>` | `<paths>` | <teste/script/fluxo> |

## Blast radius e cuidados

<O que pode quebrar FORA da feature: âncoras compartilhadas alteradas (consumidores do índice do INDEX.md), contratos que mudam (shape de settings, retorno de service, tool do assistente de IA), superfícies que leem o mesmo dado (web × assistente × API leem o MESMO banco/dossiê do jogo), janelas de transição de schema.>
- <item> — sintoma se quebrar: <X>; como detectar: <Y>

## Evidências

<Links/paths/commits que sustentam as decisões, 1 linha do que cada um prova — só o que foi ÚTIL. As 3-8 decisivas também vão pra seção Evidências da feature.>
- [código] `packages/core/src/money/index.ts:42` — <o que esta linha prova>
- [commit] `6c97373` — <decisão que mora nesse commit>
- [banco] query dev AAAA-MM-DD (`SELECT ...`) — <fato>; re-seed gira uuids
- [doc] `docs/arquitetura/<x>.md §<seção>` — <o que cravou>

## Detalhes por passo (referenciados pelo ## Plano)

<Só o detalhe pesado que não cabe no outline: SQL completo do expand, shape JSON grande, cenário longo de teste. Cada § nomeado pra ser citado pelo passo ("detalhe: dossiê §Schema").>

## Plano executável

Ver seção `## Plano` de [docs/features/<modulo>/<ID>-<slug>.md](../features/<modulo>/<ID>-<slug>.md) — os passos NÃO são duplicados aqui.
```
