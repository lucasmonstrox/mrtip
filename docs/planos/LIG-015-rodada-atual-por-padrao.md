# LIG-015 — Rodada atual por padrão na aba Rodadas · dossiê de planejamento (2026-07-19)

Feature: [docs/features/ligas/LIG-015-rodada-atual-por-padrao.md](../features/ligas/LIG-015-rodada-atual-por-padrao.md)
Base: commit `9ff0cf3` (2026-07-19) — todo file:line deste doc vale neste commit.

## TL;DR

A aba **Rodadas** da página da liga abre hoje na **última rodada da temporada**, não na rodada em curso. A correção é puro front, sem API e sem schema: uma função pura escolhe a rodada atual pela **progressão do número de rodada** — a maior rodada que já teve jogo, avançando pra próxima quando essa acabou (nunca por placar, nunca por data mínima — ver §Por que progressão de rodada) — e a seleção do usuário passa a morar em `?round=N`, espelhando o `?season=` que já existe. O param é o que faz "fica onde eu deixei" funcionar: o Radix **desmonta** o `TabsContent` inativo, então o `useState` de hoje seria zerado a cada volta pra aba — com o default novo, isso viraria "sempre volta pra rodada atual", que é exatamente o incômodo invertido.

## Briefing — o que já foi falado e decidido

- **O pedido**: "ao clicar a rodada mostre sempre a rodada atual no primeiro load; se eu já carreguei a página e mexi na rodada, fica aonde eu deixei" — fonte: dono nesta conversa (2026-07-19).
- **Delegação das decisões abertas**: perguntei se, no intervalo entre rodadas, ele quer ver a rodada que vem ou a que acabou; respondeu "segue" — fonte: dono nesta conversa (2026-07-19) + memória `estilo-delegacao-joao`. Resolvido em D3, **não** vira `[PENDENTE-DONO]`.
- **Precedente de persistência já cravado na área**: o `?season=` tem a semântica "ausente = atual/default", escrito com `router.replace` pra não poluir o back stack — `apps/web/features/leagues/hooks/ui/use-season-param.ts:25`. O `?round=` copia essa forma. Fonte: [código] + LIG-008.
- **Precedente de "hoje" na MESMA pasta**: `daysAgo` compara `new Date()` (local do browser) contra o dia da partida parseado como data local — `apps/web/features/leagues/utils/format.ts:21`. Sustenta D2.
- **Gotcha de data do repo**: Eden Treaty revive strings ISO em `Date` no client, então `match.date` é `string | Date` em runtime mesmo tipado como `string` no contrato — `apps/web/features/leagues/utils/format.ts:12` + memória `eden-revive-datas-em-date`.
- **Vizinha na mesma superfície, NÃO incluída**: W-010 (agrupar jogos por data dentro da rodada, `docs/wishlist.md`) mexe no mesmo componente. Fica fora — ver §Fora de escopo do Plano.
- **Chrome MCP pode não atachar** com o Chrome do dono aberto — memória `chrome-devtools-profile-travado`. Tratado na Verificação final, não afirmar UI verde sem prova.

## Estado do terreno

**ui** — `apps/web/features/leagues/components/league-detail/rounds-list.tsx` é o único consumidor. O default mora em `rounds-list.tsx:74`: `rounds.find((r) => r.round === selected) ?? rounds.at(-1)` — o fallback `.at(-1)` é a **última rodada da temporada**. A seleção é estado local em `rounds-list.tsx:65` (`useState<number | null>(null)`).

O componente é montado dentro do `TabsContent value="rounds"` em `league-detail.tsx:120`. O Radix desmonta o conteúdo da aba inativa (sem `forceMount`), logo todo estado local do `RoundsList` morre ao trocar de aba.

**api** — nada a fazer, e há uma armadilha a evitar.

O hook já busca **todas** as rodadas da season: `apps/web/features/leagues/hooks/data/queries/use-league-rounds-query.ts:7`.

O arg opcional `round` desse hook filtra **uma** rodada no servidor, o que quebraria o dropdown: `apps/api/src/modules/leagues/list-rounds/list-rounds.service.ts:11`.

O tipo `Round` traz `matches`, e cada `Match` tem `date` (yyyy-MM-dd) e `score: Score | null` — insumo suficiente pra decidir a rodada atual no client: `apps/api/src/modules/leagues/shared/shared.ts:154`.

A saída já vem ordenada por número de rodada: `apps/api/src/modules/leagues/shared/shared.ts:2024`.

**dados** — nenhuma entidade de rodada existe: `round` é coluna inteira em `match` (`apps/api/src/db/schemas/leagues.ts:88`). Não há `is_current` pra ler (ver D4).

**deps** — `apps/web` tem `date-fns` (`apps/web/package.json:28`) mas **não** tem `date-fns-tz` (só `apps/api` tem). Sustenta D2.

## Por que progressão de rodada (duas armadilhas descartadas)

O teste que separa uma regra boa de uma ruim é sempre o mesmo: **um único jogo não-jogado numa rodada velha muda a resposta?** Se muda, a regra quebra em jogo adiado — que é rotina em liga ao vivo (LIG-013 é sync ao vivo) e é a **motivação declarada** desta feature.

**Descartada 1 — por placar.** *"Primeira rodada que ainda tem jogo sem placar"*: um jogo da rodada 5 remarcado continua com `score == null`, então devolve **rodada 5** com a liga na 20.

**Descartada 2 — por data mínima futura** (`argmin(date)` sobre jogos com `date >= hoje`). Parece imune, mas **não é**, porque jogo adiado quase sempre é remarcado pra um meio de semana **mais próximo** que a próxima rodada. Contraexemplo, hoje = `2026-07-19`:

| Rodada | Jogos |
|---|---|
| 18 (jogo adiado) | `2026-07-22` |
| 19 | `2026-07-18` (jogada) |
| 20 (a corrente) | `2026-07-25`, `2026-07-26` |

`argmin` sobre o futuro → `2026-07-22` → **rodada 18**. Sem adiamento as rodadas são monotônicas na data e o argmin sempre acerta; **adiamento é a única coisa que o quebra — e é justamente o caso que precisamos cobrir.**

**Adotada — progressão do número de rodada.** Um jogo solto no futuro da rodada 18 não abaixa a maior rodada já iniciada, então a regra é imune ao straggler:

1. `rounds` vazio → `null`.
2. `played` = rodadas com ao menos um jogo de dia `<= hoje`. Vazio (season não começou) → **primeira** rodada.
3. `base` = a rodada de **maior número** em `played` (maior número, **não** maior data).
4. `base` ainda tem jogo com dia `>= hoje` (rodada em curso, ex.: sábado jogado e domingo pendente) → `base`.
5. `base` inteiramente no passado → a **próxima rodada do array ordenado** depois dela (é aqui que mora o D3); não havendo próxima (season encerrada) → `base`.

Consequência aceita: com o straggler da rodada 18 pendente pra quarta, a aba abre na **20**. É a leitura certa de "rodada atual"; o jogo atrasado continua acessível pelo select.

Passo 5 usa "a próxima do array", nunca `base + 1` aritmético — número de rodada pode ter buraco, e `groupByRound` já entrega ordenado.

## Mapa de dependências

**Features** (`bun run features impact LIG-015` só roda depois do arquivo existir; arestas derivadas à mão do INDEX):

- **LIG-008** ← dono do `?season=`/`useSeasonParam`, que o P3 altera (limpar `round` ao trocar de season). Âncora compartilhada.
- **LIG-014** ← "Home (hub da rodada) fora do mock e multi-liga" tem tarefa `api — servir a rodada corrente por liga`; a regra desta feature é a definição de referência que ela deve reusar ou substituir (D4).
- **LIG-012** ← a Série A é a liga onde o bug aparece (season em curso); a PL 25/26 encerrada não muda de comportamento.

**Código**:

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `rounds-list.tsx#RoundsList` | só `league-detail.tsx:120` | aba Rodadas de uma liga em curso + de uma season encerrada |
| `use-season-param.ts#useSeasonParam` | `season-switcher.tsx`, e os query hooks de liga/time/jogador que leem `season` | trocar season na página de **liga, time e jogador** (o `params.delete("round")` novo roda nas três; é no-op onde não há `round`) |
| `utils/rounds.ts#pickCurrentRound` (proposta) | `rounds-list.tsx` (novo) | script da P1 |
| `hooks/ui/use-round-param.ts#useRoundParam` (proposta) | `rounds-list.tsx` (novo) | roteiro de browser T2/T3 |

## Blast radius e cuidados

- **`useSeasonParam` é hook compartilhado** (liga, time, jogador — LIG-008) e o P3 acrescenta `params.delete("round")` nele. Sintoma se quebrar: trocar de temporada na página do **time/jogador** para de funcionar ou perde outro param da URL. Como detectar: cenário T4 do roteiro (trocar season em `/teams/<slug>`) + conferir que só `season`/`round` mudam na query string.
- **Hidratação**: `pickCurrentRound` depende de `new Date()`. Chamado no corpo do componente **depois** do guard de `isPending`, nunca em escopo de módulo. Sintoma se errar: hydration mismatch / rodada congelada na data do build. Como detectar: `list_console_messages` sem warning de hidratação no T5.
- **Eden revive datas**: se `pickCurrentRound` assumir `string` crua, `date.slice` explode com `Date` em runtime. Sintoma: `TypeError: date.slice is not a function` só no browser (typecheck passa, porque o contrato **diz** `string`). Como detectar: T5 no browser — typecheck **não** pega isto.
- **Season encerrada / liga sem jogo futuro** → fallback pra última rodada. Sintoma se a regra vazar: `undefined` na UI ("Rodada undefined"). Coberto pelo caso 2 do script da P1.
- **Superfície que NÃO é tocada**: a API continua servindo todas as rodadas; nenhum script de prognóstico ou ingestão lê a seleção de UI.

## Evidências

- [código] `apps/web/features/leagues/components/league-detail/rounds-list.tsx:74` — o `?? rounds.at(-1)` é literalmente o bug: default = última rodada da season.
- [código] `apps/web/features/leagues/components/league-detail/league-detail.tsx:120` — `RoundsList` vive dentro de `TabsContent`, que o Radix desmonta ⇒ estado local não sobrevive à troca de aba.
- [código] `apps/web/features/leagues/hooks/ui/use-season-param.ts:25` — forma exata a espelhar no `?round=` (`router.replace` + `scroll: false`).
- [código] `apps/web/features/leagues/utils/format.ts:12` — normalização `string | Date` que o Eden exige; `format.ts:21` — precedente de "hoje" com `new Date()` local nesta mesma pasta.
- [código] `apps/web/package.json:28` — `date-fns` presente; `date-fns-tz` ausente em `apps/web` (só em `apps/api`), o que torna o fuso pinado uma adição de dependência, não um reuso.
- [código] `apps/web/features/leagues/hooks/data/queries/use-league-rounds-query.ts:7` — o arg `round?` filtra UMA rodada no servidor; passá-lo quebraria o dropdown.
- [código] `apps/web/playwright.config.ts:26` — o e2e já roda com `timezoneId: "America/Sao_Paulo"`, então browser-local == fuso da loja no headless.
- [doc] `docs/wishlist.md` §W-010 — vizinha no mesmo componente (agrupar por data), deliberadamente fora de escopo.

## Detalhes por passo

### §Regra — contrato de `pickCurrentRound`

```ts
// apps/web/features/leagues/utils/rounds.ts
pickCurrentRound(rounds: Round[], today: string /* yyyy-MM-dd */): number | null
```

Os 5 passos estão em §Por que progressão de rodada — **é aquela a especificação**, não repetida aqui pra não divergir.

Duas notas de implementação:

- Comparação por **string ISO lexicográfica** (`"2026-07-19" >= "2026-07-18"`), sem `Date` intermediário — mata o problema de fuso na comparação. Só é válido porque `yyyy-MM-dd` é zero-padded de largura fixa: **não** normalize as datas pra outro formato.
- O dia de cada jogo sai de `date` que pode ser `string` **ou** `Date` (Eden revive) — normalizar como `format.ts:12` antes de comparar.

### §Testes — roteiro de browser (chrome-devtools MCP)

Pré-check: `navigate_page` em `/leagues` e escolher uma liga com **season em curso** (a Série A/`BRA` é a candidata; a PL 25/26 está encerrada e por design **não** muda de comportamento). Se nenhuma liga em curso existir no banco, declarar isso — o caso "em curso" fica coberto só pelo script da P1, e não se afirma o contrário.

Escada (erro/borda → golden path por último):

- **T1 · borda — season encerrada não regride**: abrir a liga com season encerrada → aba Rodadas → assert: abre na **última** rodada (comportamento de hoje preservado).
- **T2 · a seleção sobrevive à troca de aba** (o núcleo do pedido): liga em curso → aba Rodadas → anotar a rodada default → escolher **outra** rodada no select → `click` na aba Classificação → `click` de volta em Rodadas → assert: continua na rodada escolhida (**não** volta pro default).
- **T3 · a seleção sobrevive ao refresh**: com `?round=N` na URL, `navigate_page` na mesma URL → assert: abre em N.
- **T4 · trocar season limpa o round**: com `?round=N`, trocar a temporada no switcher → assert: `round` sai da query string e a lista abre na rodada atual daquela season. Repetir o switch em `/teams/<slug>` → assert: nada quebra (é no-op lá).
- **T5 · golden path — primeiro load**: `navigate_page` na liga em curso **sem** query string → aba Rodadas → assert: abre na rodada atual (bate com a data de hoje), a URL **não** ganha `?round=` sozinha, e o título do card diz "Rodada \<N\>".
- Fechamento: `list_console_messages` sem erro/warning novo (inclusive hidratação) e `list_network_requests` sem falha.

### §Testes — script da função pura (P1)

`apps/web/scripts/check-current-round.ts`, rodado com `cd apps/web && bun run scripts/check-current-round.ts`. Alimenta `today` como argumento (nunca lê o relógio), com fixtures inline:

`today` é sempre fixo por caso — o script nunca lê o relógio, senão os casos apodrecem com o calendário.

| Caso | Fixture (`today = 2026-07-19` salvo indicado) | Esperado |
|---|---|---|
| 1 · rodada em curso, fim de semana partido | r20 com sáb `07-18` (jogado) e dom `07-19` (hoje, pendente) | `20` — não pula pra 21 |
| 2 · entre rodadas | r19 toda em `07-18`; r20 em `07-25` | `20` — o avanço do passo 5 (D3) |
| 3 · **straggler mais próximo que a corrente** (a regressão que importa) | r18 adiado pra `07-22`; r19 em `07-18`; r20 em `07-25` | `20` — **nunca** `18`; é o caso que reprova a regra de data mínima |
| 4 · season encerrada | tudo no passado | última rodada (A4, não-regressão) |
| 5 · season não começou | tudo no futuro | **primeira** rodada — nunca `null` nem última |
| 6 · lista vazia | `[]` | `null` |
| 7 · Eden revive | fixture do caso 1 com `date` como objeto `Date` | `20`, igual ao caso 1 |

Saída esperada: 7 linhas `ok` e exit 0; qualquer `fail` derruba o passo. O caso 3 é o **discriminador** — se alguém "simplificar" a regra pra data mínima futura, é ele que acusa.

## Divergência encontrada na execução (2026-07-19)

**A página de liga NÃO é pública** — este dossiê e o Plano afirmavam o contrário, e a Verificação final foi corrigida inline no arquivo da feature.

Origem do erro: o planejamento procurou por `apps/web/middleware.ts`, não achou, e concluiu "sem gate". O **Next 16 renomeou `middleware.ts` → `proxy.ts`**, e o arquivo existe: `apps/web/proxy.ts:5` faz `createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])` — **toda** rota fora dessas duas exige sessão Clerk (`proxy.ts:28-32` redireciona pra `/sign-in`). Confirmado empiricamente: `curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}" http://localhost:3000/leagues` → `307 -> /sign-in?redirect_url=%2Fleagues`.

Lição pra próximos planos nesta base: **procurar `proxy.ts`, não `middleware.ts`**, ao checar se uma rota do `apps/web` é pública.

Impacto: nulo sobre o desenho da regra (as 4 premissas de implementação do §Estado do terreno seguem válidas e foram confirmadas no código); total sobre a **prova de UI** — as duas rotas previstas (chrome-devtools MCP e Playwright) assumiam acesso sem sessão e ficaram bloqueadas juntas. Detalhe do bloqueio e as três formas de destravar estão em §Divergência 2026-07-19 do arquivo da feature.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-015-rodada-atual-por-padrao.md](../features/ligas/LIG-015-rodada-atual-por-padrao.md) — os passos NÃO são duplicados aqui.
