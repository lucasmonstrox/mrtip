# MOD-008 — Desgaste por sequência de jogos difíceis · dossiê de planejamento (2026-07-03)

Feature: [docs/features/modelos/MOD-008-desgaste-sequencia-jogos-dificeis.md](../features/modelos/MOD-008-desgaste-sequencia-jogos-dificeis.md)
Base: commit `d589ef6` (2026-07-03) — **atenção:** `prognosis-prompt.ts` tem mudanças MOD-004 não commitadas na working tree; os `file:line` abaixo valem na **working tree de 2026-07-03**, não no commit puro. Reconfirme âncoras por símbolo se o arquivo tiver sido commitado/movido.

## TL;DR

Promover a W-047 a feature: computar em código a **dureza dos últimos 5 jogos** de cada time (adversários top-6 pela tabela as-of + duelos do jogo + faltas somadas por jogador + cartões, comparados ao baseline da liga pré-cutoff) e imprimir como **1 linha + 1 bullet de leitura** no bloco `## Contexto` do prompt vivo, colada à linha de Descanso. Decisão central: **saída 100% qualitativa** — nunca multiplicador no λ (trava SIN-008/MOD-004: quant-first, medir antes de calibrar). Superfície única: `apps/api/scripts/prognosis-prompt.ts` (o super-prognosis reusa a PARTE 2). **Gate duro: zero schema/migração** — todas as colunas já existem e estão ingeridas.

## Briefing — o que já foi falado e decidido

- **Origem W-047** (`docs/wishlist.md` §W-047, adicionada 2026-07-01): sequência de times fortes desgasta mais que sequência fácil no MESMO intervalo; medir a dureza (contra quem, quão pegado), não só o intervalo. Gotchas listados lá: (1) proxy de dureza — força do adversário é o mínimo, refino por placar é opcional/caro; (2) double-counting com o SIN-008; (3) copa/prorrogação desgasta mais, mas só copas domésticas ingeridas; (4) rodízio — quem poupou não acumulou desgaste (família W-050, fora daqui).
- **Ceticismo herdado do SIN-008** (`docs/regras/calendario-fadiga.md` §1): fadiga crua é majoritariamente o efeito casa/fora **que o mercado já precifica**; efeito sobre GOLS é fraco/nulo exceto descanso ≤3 dias. §6: até calibrar, fadiga entra como **sinal qualitativo de baixíssimo peso, nunca driver de pick**. → A dureza segue o mesmo regime.
- **Trava quant-first do MOD-004** (`docs/planos/MOD-004-mercados-e-motor-prompt-vivo.md` §Briefing): o LLM nunca emite número, o código calcula e o LLM explica; diretiva "**medir antes de calibrar**". → dureza NÃO mexe em λ/probabilidade; qualquer peso futuro passa pelo harness `apps/api/scripts/backtest-prognosis.ts`.
- **Catálogo de cruzamentos** (`docs/regras/catalogo-de-cruzamentos.md` §2, linha W-047): condicionador "Dureza dos jogos anteriores (fadiga qualitativa)" está **❌** com o dado apontado ("agregação de duelos/faltas/lesões-em-jogo dos últimos jogos"). Este plano o move pra **🔶** (dado ingerido, cruzamento entregue no briefing; quem pondera é a LLM).
- **Substrato compartilhado com a W-046** (wishlist §W-047 "Depende de"): mesma métrica de força do adversário (posição de tabela via standings recomputadas). Aqui usamos a `standingsAsOf` que JÁ existe no prompt — sem criar métrica nova; se a W-046 um dia cravar Elo, a dureza migra junto.
- **Restrições do orquestrador (dono, nesta conversa, 2026-07-03):** superfície só `prognosis-prompt.ts` (o super reusa a PARTE 2); injetar junto ao bloco de descanso; proxy barato (duelos + faltas por jogador somadas por time + top-6 + cartões da tabela `card`); gate de não mexer em schema/migração; nunca peso automático no λ.
- Memória `prognostico-mercados-mod004`: travas quant-first e "medir antes de calibrar" confirmadas vigentes.

## Estado do terreno

Tudo em `apps/api/scripts/prognosis-prompt.ts` (script CLI: `bun run scripts/prognosis-prompt.ts <matchId>` → stdout + `scripts/output/prognosis-<matchId>.md`, cabeçalho `:1-13`):

- **Descanso hoje = só intervalo.** `lastMatchAnyComp` (`:803-808`) e `restDays` (`:812-816`) cruzam liga+copa; render na linha `- Descanso:` (`:1666`) + bullet de leitura `- **Descanso / fadiga**` (`:1667`) que já manda ler a **assimetria** e já avisa que 1-2 dias de diferença é ruído. **Nenhuma noção de intensidade/dureza existe.**
- **Janela "últimos 5 liga+copa"** já canonizada em `contextoUltimos5` (`:1325-1370`): merge `teamMatches` + `cupMatchesOf` (`:88-89`) ordenado por data, `slice(-5)` (`:1328-1330`). A dureza usa a MESMA janela.
- **Força do adversário as-of** já existe: `standingsAsOf(dateStr)` (`:1258-1268`) recomputa a tabela só com jogos `date < dateStr` (anti-leak) → `pos` por time. Adversário de copa de outra divisão não aparece no map (sem pos).
- **Duelos:** `match_team_stats` é carregado INTEIRO em `teamStatsByMatch` (`:399-408`); a coluna `duelsWon` existe (`apps/api/src/db/schemas/leagues.ts:407`, type 106). `duelsTotal` de time NÃO existe em `match_team_stats` — existe por jogador (`lineup_player.duels_total`, `leagues.ts:296`). Proxy escolhido (D3): `duelsWon(A)+duelsWon(B)` do jogo ≈ duelos disputados.
- **Faltas:** `match_team_stats` NÃO tem faltas cometidas (só `freeKicks` = faltas A FAVOR, `leagues.ts:400`). Faltas por jogador estão ingeridas: `lineup_player.fouls` (type 56, `leagues.ts:289`) e `fouls_drawn` (type 96, `:290`). A query agregada por (matchId, teamId) que já soma SoT/KP de todos os lineups é `statRows` (`:95-104`, indexada em `statByMatchTeam:105-113`) — é o ponto natural de somar `fouls` também. Guarda de ausência de lineup: padrão `hasSot` (`:395`).
- **Cartões:** tabela `card` ingerida (`leagues.ts:529-543`, type yellow/red/yellowred, com `matchId`+`teamId`), **nunca lida pelo prompt** (dado morto, já apontado no dossiê MOD-004 §Estado). Padrão de query por janela de matchIds: `possMatchIds` (`:1301`).
- **Baselines de liga pré-cutoff** já são praxe no arquivo (ex.: `leagueHomeAvg`/média da liga em `:1668`, médias de SoT `:797-798`) — a dureza replica o padrão sobre `played` (`:63`, só jogos `date < CUTOFF`).
- **Consumo do prompt:** `run-deepseek.ts:31` exige o md gerado; o super-prognosis reusa a PARTE 2 do prompt vivo (premissa do dono) — nada além do `prognosis-prompt.ts` precisa mudar.

## Mapa de dependências

**Features** (grafo `depende_de`/`impacta`):
- MOD-004 ← dono do prompt vivo/motor; MOD-008 injeta uma seção no template dele — re-testar geração + probabilidades intactas.
- LIG-005 (rest days) ← vizinho conceitual: a linha de dureza fica COLADA à de descanso; não altera `restDays`.
- SIN-008/`calendario-fadiga.md` ← regra-mãe do regime qualitativo; W-046/W-050 ← primos de substrato (não bloqueiam).

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `prognosis-prompt.ts#statRows` (select ganha `fouls`/`foulsDrawn`) | `statByMatchTeam` → `sotFor/sotAgainst/hasSot`, blocos de SoT do prompt | prompt gera; números de SoT idênticos ao pré-mudança (só ADIÇÃO de campos no select agregado) |
| `prognosis-prompt.ts#durezaUltimos5` (novo) | template `## Contexto` (linha nova) | Provas P1-P3 |
| template do prompt (`:1666-1667`, linha+bullet novos) | `run-deepseek.ts` (lê o md), super-prognosis (reusa PARTE 2) | diff do prompt restrito ao `## Contexto`; run-deepseek segue parseando (saída tipada não muda) |
| tabela `card` (leitura nova) | nenhum consumidor prévio | — |

## Blast radius e cuidados

- **`statRows` alterado** — é a única mudança em código pré-existente; se o `sum(fouls)` entrar errado (ex.: quebrar o groupBy), TODOS os blocos de SoT/KP do prompt degradam. Sintoma: SoT "?" ou valores absurdos na seção Finalização; detecção: diff antes/depois do prompt de um jogo de referência (A3) — hunks fora do `## Contexto` = quebrou.
- **Tamanho do prompt** cresce ~3 linhas — irrelevante pro contexto do DeepSeek, mas o diff de não-regressão pega qualquer vazamento acidental pra outras seções.
- **Double-counting na leitura** (não no código): o LLM já recebe descanso + copa no meio de semana; dureza mal explicada vira desconto duplo. Sintoma: unders sistemáticos pós-copa; mitigação: bullet do P4 com a proibição explícita.
- **Jogos sem dado** (copa sem `match_team_stats`/lineup ingeridos): componente sai da média e a amostra é exposta (`duelos 98/j (4 jogos c/ dado)`); nunca tratar ausência como 0.
- **Sem schema/migração e sem setting** — rollback é `git revert` puro; prognósticos já persistidos com a linha não são (nem precisam ser) desfeitos.

## Evidências

- [doc] `docs/wishlist.md` §W-047 — a tese, o par W-046 e os 4 gotchas (proxy, double-counting, copa, rodízio).
- [doc] `docs/regras/calendario-fadiga.md` §1 e §6 — fadiga crua ≈ mando já precificado; até backtest, sinal qualitativo de baixíssimo peso — o regime que a dureza herda.
- [doc] `docs/regras/catalogo-de-cruzamentos.md` §2 — linha "❌ Dureza dos jogos anteriores (W-047)" com o dado apontado; este plano a move pra 🔶.
- [código] `prognosis-prompt.ts:1258-1268` — `standingsAsOf` anti-leak, base do top-6 sem métrica nova.
- [código] `prognosis-prompt.ts:399-408` + `leagues.ts:407` — `match_team_stats.duelsWon` já em memória pra todos os jogos (D3).
- [código] `prognosis-prompt.ts:95-113` + `leagues.ts:289-290` — query agregada por (matchId, teamId) pronta pra ganhar `sum(fouls)`/`sum(fouls_drawn)`.
- [código] `leagues.ts:529-543` — tabela `card` ingerida e órfã (confirma também dossiê MOD-004 §Estado, "dados mortos").
- [doc] `docs/planos/MOD-004-mercados-e-motor-prompt-vivo.md` §Briefing — quant-first + "medir antes de calibrar" (trava reafirmada aqui).

## Detalhes por passo

### §Shape da linha (P1-P3 — copy final adiada pro /i)

```
- Dureza últ.5: Arsenal 3/5 vs top-6 · duelos 102/j (liga 94) · faltas 23/j (liga 21) · cartões 4.2/j (liga 3.6) — DURO
  · Everton 1/5 vs top-6 · duelos 88/j · faltas 19/j · cartões 3.0/j — LEVE
```

Componente sem dado → `?` + amostra (`duelos ?/j (0 de 5 c/ dado)`). Baselines = médias sobre `played` (pré-cutoff): duelos/faltas/cartões **por jogo** (2 lados somados), cartões via 1 aggregate `select match_id, count(*) from card where match_id in (...) group by match_id` restrito aos ids de `played` — anti-leak garantido pelo próprio `played`.

### §Thresholds do rótulo (P3 — defaults ajustáveis, mudar valor não muda desenho)

- Cada componente vira um voto: top-6 ≥ 3/5 · duelos ≥ +8% vs liga · faltas ≥ +10% · cartões ≥ +15% (e os espelhos negativos pra LEVE).
- **DURO** = ≥ 2 votos positivos e nenhum negativo; **LEVE** = espelho; senão **NEUTRO** (sem rótulo alarmista). Motivo dos votos vencedores impresso entre parênteses — o LLM lê a evidência, não só a etiqueta (C2 do pré-mortem: 1 componente sozinho não rotula).

### §Bullet de leitura (P4 — âncoras obrigatórias do texto)

Precisa conter, em qualquer redação: (1) "evidência **qualitativa**" — não é desconto mecânico no xG; (2) o sinal é a **ASSIMETRIA** entre os lados (dureza parecida dos dois = ignore); (3) **não dupla-contar** com o bullet de Descanso (a copa no meio de semana já pesa lá — aqui é CONTRA QUEM foi, não QUANDO); (4) herança SIN-008: fadiga crua já é meio precificada pelo mercado — use pra modular leitura de reta final/intensidade, nunca como driver único de pick.

### §Fora de escopo detalhado

- Refino por placar/contexto do jogo (1×1 disputado > goleada tranquila) e prorrogação de mata-mata (dado de períodos não ingerido — inventário `periods.statistics`).
- Peso quantitativo: só via `backtest-prognosis.ts` (harness MOD-004) comparando acerto com/sem a linha — se provar incremento, vira feature própria `depende_de: [MOD-008]`.
- Dureza POR JOGADOR (rodízio: quem poupou não desgastou) = W-050.

## Plano executável

Ver seção `## Plano` de [docs/features/modelos/MOD-008-desgaste-sequencia-jogos-dificeis.md](../features/modelos/MOD-008-desgaste-sequencia-jogos-dificeis.md) — os passos NÃO são duplicados aqui.
