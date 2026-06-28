# Investigação — Página do jogador (perfil de performance) · LIG-001

> Investigado em 2026-06-28. Orquestrado por `/rs` (tier Tema amplo) + workflow de 9 agentes (recon 6 frentes → síntese → counter-review adversarial + verificação-fetch SportMonks). Fontes web fetchadas nesta sessão; capacidades SportMonks confirmadas na doc viva (as-of 2026-06-28).

## TL;DR + recomendação cravada

A página do jogador hoje é um stub (nome + gols/assists/jogos-fora + lista de gols — `player-detail.tsx`). A descoberta que reorienta tudo: **o dado granular por partida que falta exibir já está quase todo ao alcance da mesma chamada de sync** — `rating`, `minutesPlayed` e `manOfMatch` já são persistidos (`lineup_player`), e os ~25 stats de volume por partida (chutes, chutes no alvo, passes, key passes, desarmes, interceptações, faltas, duelos, dribles, toques) vêm do **mesmo endpoint** `fixtures?include=lineups.details.type`, hoje **filtrados de fora** por `lineupDetailTypes:118,119,1490` (`sync-sportmonks.ts:265`). Logo: o maior unlock de produto de apostador custa **alargar um filtro + colunas no schema**, sem add-on pago e sem nova fonte.

**Recomendação:** construir a página em duas camadas, com o MVP já incluindo o que dá edge de aposta:
1. **MVP (baixo custo de dados):** header/bio · forma recente (strip últimos 5/10) · produção ofensiva (gols/assists com NPG separado) · per-90 com gate de amostra · minutos/titularidade/disponibilidade · match-log enriquecido · **stats de volume por partida (chutes/SoT/passes/desarmes/faltas) + hit-rate** · disciplina. Tudo a partir do granular já ingerido (`agregar`) ou do filtro alargado (`ingerir-barato`).
2. **Fase 2 (custo real):** radar de percentil vs pares · xG (add-on pago) · histórico de carreira/transferências (multi-season) · heatmap/shot-map (coordenadas **não** existem na SportMonks).
3. **Norte de produto (a ponte que falta em TODOS os concorrentes):** a página tem de **chegar a uma linha/projeção** — o quant ESTIMA o λ do prop (Poisson/binomial-negativa a partir de SoT/90, minutos esperados, força do adversário) e o LLM EXPLICA o porquê em PT, lado a lado com a odd da casa. Sem isso, a página é um Sofascore traduzido, não ferramenta de aposta.

**3 correções do counter-review que entram como decididas:** (a) stats de volume **sobem pro MVP** — eram o item de maior valor/menor custo e estavam adiados; (b) o `rating` SportMonks (118) é **composto proprietário opaco** — não pode ser o "veredito" do header sem carimbo de "score externo, sem porquê", senão fere a tese; (c) a curva **gols-acumulados-vs-xG é impossível** com o dado free (xG per-match é add-on pago; **xA não existe** na SportMonks) — vira no máximo 1 escalar G-xG com ressalva.

---

## Contexto e problema

Pedido do dono: *"página do jogador muito foda, com estatísticas de performance — jogos, notas, gráfico de minutos por jogo… eu preciso saber o que ela DEVE ter."* Aberto por design. O entregável é o **conjunto certo de seções/métricas/gráficos**, priorizado pelo que é factível com a fonte única (SportMonks) e útil pra aposta.

**Requisitos implícitos assumidos:** produto BR de apostas (Lei 14.790/2023, +18, jogo responsável, **nada de promessa de ganho** → mostrar probabilidade + incerteza, nunca certeza); separação **ESTIMAR (quant) × EXPLICAR (LLM)**; **todo número mostra o porquê + a fonte**; datas em `America/Sao_Paulo`. Constraint dura de dados: **só PL 2025/26 ingerida** (1 liga, 1 season) — desenhar multi-season-capável, mas popular com o que há, e tratar amostra pequena como cidadão de primeira classe.

## Estado real no código

| Item | Estado | Âncora |
|---|---|---|
| Página do jogador | **Stub**: nome + 3 números (gols, assists, "jogos fora") + lista de gols | `apps/web/features/leagues/components/player-detail/player-detail.tsx` |
| Endpoint do perfil | `getPlayerDetail` — totais derivados de `goal`/`injury`, lista de gols; **não** usa rating, minutos, cartões, MOTM | `apps/api/src/modules/leagues/shared/shared.ts:264` |
| **Rating por partida** | **Já ingerido** (real 0-10, type 118) | `lineup_player.rating` — `db/schemas/leagues.ts:171` |
| **Minutos por partida** | **Já ingerido** (type 119) | `lineup_player.minutesPlayed` — `leagues.ts:172` |
| **MOTM por partida** | **Já ingerido** (type 1490) | `lineup_player.manOfMatch` — `leagues.ts:173` |
| Titular/posição/grid | Já ingerido | `lineup_player.starter/position/grid` — `leagues.ts:167-169` |
| Gols (minuto, tipo normal/penalty/own, assistência) | Já ingerido | `goal` — `leagues.ts:207-225` |
| Cartões (minuto, yellow/red/yellowred) | Já ingerido | `card` — `leagues.ts:229-245` |
| Lesões/desfalques (Missing/Questionable + motivo, inclui "Suspended") | Já ingerido | `injury` — `leagues.ts:183-202` |
| Bio (nascimento, altura, foto, nacionalidade+bandeira) | Já ingerido | `player`/`nationality` — `leagues.ts:96-119` |
| **Stats de volume por partida** (chutes, SoT, passes, key passes, desarmes, faltas, duelos, dribles, toques) | **Fantasma — filtrado de fora do sync** | filtro `lineupDetailTypes:118,119,1490` em `sync-sportmonks.ts:265`; const em `:24`; persistência em `:406-408` |

**O achado central:** o sync já bate em `fixtures?include=...lineups.details...` e só **não pede** os outros types (o filtro restringe a 3). Alargar `lineupDetailTypes` + adicionar colunas traz ~25 stats de jogador por partida na **mesma chamada**, sem endpoint novo e sem add-on. (Correção a uma premissa anterior da wishlist W-001/W-003/W-004: notas e minutos **não** faltam — já estão no banco.)

## Estado da arte (concorrentes)

Síntese dos teardowns (URLs fetchadas nesta sessão). Confiança `verificado-fetch` salvo nota.

- **FBref** (`fbref.com`) — amplitude tabular + **Scouting Report em percentil vs pares da MESMA posição** (janela móvel 365d): número bruto vira julgamento ("top 10% em xAG entre pontas"). Glossário por métrica (casa com a tese de transparência). Separa sempre penalti (npxG, np:G-xG). Match logs por jogo.
- **Understat** (`understat.com`) — **xG no nível do chute** + shot map interativo; métricas próprias xGChain/xGBuildup; toggle totais↔per-90; separa NPG/NPxG.
- **Sofascore** (`sofascore.com`) — **Sofascore Rating** (0-10) + **Attribute Overview** (radar de 5 eixos normalizados, clicável até a stat-fonte) + **heatmap** por jogo/season. Foco mainstream: "um número e um radar resumem o jogador".
- **FotMob** (`fotmob.com`) — o mais analytics-dense porém mobile-legível: **Per-90 percentile rank vs pares da posição**, xG/npxG/xA, Defensive contributions, Touches in opp. box, season shot map, transfer value.
- **WhoScored** (`whoscored.com`) — **traduz stats crus em atributos nomeáveis com escala** (Finishing: Very Strong; Offside awareness: Very Weak) + Style of Play em frases. É literalmente a ponte ESTIMAR→EXPLICAR. Rating Opta 0-10 + diagrama de campo com nota por posição.
- **Transfermarkt** (`transfermarkt.com`) — **trajetória**: valor de mercado como série temporal, histórico de transferências com fee, stats por season×competição×clube, injury history.

**Padrões transversais que valem pro mrtip:** (1) uma **nota por jogo** resume o jogador antes de qualquer tabela; (2) **per-90 é a régua canônica** + toggle totais↔per-90; (3) **percentil vs pares da posição** é o "truque de ouro" que vira número em julgamento; (4) stats **agrupadas por tema** (finalização/criação/posse/defesa/disciplina), não lista plana; (5) **separar penalti** sempre; (6) metodologia/janela/fonte **carimbadas** ao lado do número.

## Capacidades da SportMonks (verificado-fetch, as-of 2026-06-28)

- **Por partida, na MESMA chamada que o sync já faz** (basta alargar o filtro + persistir): chutes total/no-alvo(86)/fora/bloqueado, passes(80)/certos(116)/%(1584), key-passes(117), cruzamentos(98/99), bolas-longas(122/123), desarmes(78), interceptações(100), cortes(101), duelos(105/106/1491), aéreos(107), dribles(108/109/110), toques(120), faltas(56)/sofridas(96), capitão(40), big-chances-missed(581), e GK saves(57/104). — `docs.sportmonks.com/.../fixture-statistics`.
- **Agregados por season** (chamada nova `players/{id}?include=statistics.details.type`): appearances/lineups/bench, gols(52, com {total,goals,penalties}), assists(79), clean sheets, big-chances-created(580), hattricks(27259), avg-points/jogo(9676), W/D/L do time(214/215/216), errors-lead-to-goal. Há ainda o endpoint **Season Statistics by Participant** que devolve o bloco agregado do elenco inteiro numa chamada (bom pra backfill).
- **xG: existe mas é ADD-ON PAGO** (xG Basic/Advanced, ~EUR 19-399). Per-match por jogador via `lineups.xGLineup` (5304/5305); per-season via `statistics.details.type` (5304). — `docs.sportmonks.com/.../expected/includes`.
- **xA: NÃO existe** na SportMonks (nem fixture nem season). Limitação dura — o "gap de assistência" e o xGChain/xGBuildup do Understat exigiriam fonte externa (FBref/Understat).
- **Heatmap / coordenadas x,y de toque ou chute: NÃO disponíveis** nos types de jogador → shot map e heatmap reais ficam fora sem outra fonte.
- **Carreira/transferências: confirmado** — `transfers` include (ou `GET /transfers/players/{id}`): from/to_team, date, type_id (transfer 218/loan 219/free 220/end-of-loan 9688), amount(fee), completed. Spells por season via **Team Squad** (`/squads/seasons/{season}/teams/{team}`: start/end de contrato, jersey, position_id, season_id). Ressalva da própria SportMonks: cobertura retroativa incompleta. (Responde a wishlist **W-002**.)

## Dataviz — gráficos × libs

Catálogo casado com o dado: **baixa complexidade e "já dá"** — sparkline de rating (header), minutos/jogo (barras titular×reserva), strip de forma últimos 5/10, timeline de cartões, donut de uso de posição, MOTM badges, dot-plot de consistência de rating. **Média** — G+A acumulado (step/area), per-90 (barras), Gantt de disponibilidade, posição média num pitch SVG (do `grid`, aproximação — **não** é heatmap). **Alta / fase 2** — radar de percentil, shot map, heatmap, curva gols-vs-xG.

**Libs (fit com React 19 / Next 16 / Tailwind v4 / shadcn):** o **shadcn já entrega um wrapper `chart` sobre Recharts** com theming via CSS vars do Tailwind — é a base pros gráficos médios. **SVG manual + `d3-scale`** pros pequenos (sparkline, strip, pitch-dot): ~0KB, SSR perfeito, casa 100% com Tailwind. **visx** (modular, ~15KB) pros gráficos "de futebol" (pitch/radar/shot-map) quando chegarem. Evitar **Tremor** (redundante com shadcn+Recharts) e **nivo** como base (theming próprio diverge do design system).

**per-90 — armadilhas com 1 season (obrigatório):** denominador = soma de `minutesPlayed` (não nº de jogos); **piso de ~450-600 min (~5-7 jogos cheios)** antes de exibir per-90, senão mostrar só contagem bruta + minutos e marcar "amostra insuficiente"; 1 gol em 30' vira 3.0/90 fantasioso → nunca per-90 sozinho; separar penalti; indicador de confiança proporcional à amostra.

## Recomendação (matriz + o que o counter-review mudou)

A síntese inicial do workflow caiu em **inversão de prioridade**: pôs as stats de volume (o edge de aposta, custo ~baixo) no `deferred` e encheu o MVP de paridade descritiva. **Corrigido.** MVP recomendado:

| # | Seção (MVP) | data_status | Aposta | Por quê |
|---|---|---|---|---|
| 1 | Header/bio + resumo | tem | baixa | identidade; rating só **carimbado como score externo opaco**, não veredito |
| 2 | Forma recente (strip 5/10 + timeline rating) | tem | **alta** | maior valor/pixel; forma pondera todo prop |
| 3 | Produção ofensiva (gols/assists, **NPG separado**, share do time) | agregar | **alta** | hierarquia de finalização honesta |
| 4 | Per-90 (com gate de amostra) | agregar | **alta** | régua canônica dos concorrentes |
| 5 | Minutos/titularidade/disponibilidade | tem | **alta** | minutos esperados é o input que mais move a linha (void/under) |
| 6 | Match-log enriquecido (rating/min/cartão/MOTM + link ao fixture) | tem | média | transparência por jogo |
| 7 | **Volume por partida (chutes/SoT/passes/desarmes/faltas) + hit-rate** | **ingerir-barato** | **alta** | **o edge**: sharp prioriza volume sobre gol (menos variância); custo = alargar filtro + colunas |
| 8 | Disciplina (cartões) | tem | média* | *vira "alta" só com perfil de árbitro (não ingerido) |

**Fase 2 (custo real, decisão do dono):** radar de percentil (precisa baseline da liga — fraco com 1 season); xG/gap (add-on pago; **xA impossível**); carreira/transferências (multi-season); heatmap/shot-map (coordenadas inexistentes na SportMonks → exige outra fonte).

**Splits:** manter **casa/fora bruto** (responde wishlist W-005/W-006) e **artilheiros da liga** (W-009, derivável de `goal`); **cortar "split por adversário"** — com 1 season dá n=1 por adversário, ruído puro.

## Modelo de dados proposto

- **Volume por partida:** alargar `lineupDetailTypes` no sync (`sync-sportmonks.ts:265`) para incluir os ~12 types de maior valor (86 SoT, total shots, 80/116/1584 passes, 117 key-passes, 78 tackles, 100 int, 105/106 duelos, 108/109 dribles, 120 toques, 56/96 faltas) + colunas correspondentes em `lineup_player`. **Trade-off:** colunas tipadas (queryável, simples, ideal pra per-90) **vs** tabela KV `lineup_player_stat(lineupPlayerId, typeId, value)` (flexível, à prova de novos types). **Recomendo colunas tipadas** para o punhado de stats de aposta — querga direto e barato; KV se a lista explodir.
- **Agregados por season:** **derivar on-the-fly** no endpoint a partir do per-match (temos tudo) enquanto for 1 season — barato. Materializar `player_season_stat` é o caminho de escala (e bate com a wishlist "season stats por jogador").
- **xG:** adiar; carimbar a limitação. **xA:** declarar indisponível.
- **Carreira:** `transfers` + Team Squad endpoints (chamadas novas) — fase multi-season.

## Plano por faceta

- **dados:** (P1) alargar filtro do sync + colunas de volume em `lineup_player`; re-sync. (P2) ingestão de agregados season + transfers/squad; (opcional) add-on xG.
- **api:** evoluir `getPlayerDetail` → endpoint de perfil rico: agregados, per-90 **com gate de minutos**, splits casa/fora, match-log enriquecido, hit-rate por threshold. Cada número devolve `{valor, janela, fonte, n}`.
- **ia (norte):** o **bloco de próxima-partida + projeção** — quant estima λ do prop (Poisson/neg-binomial) a partir de SoT/90 + minutos esperados + força do adversário → prob + odd justa + incerteza; LLM explica em PT (azar de finalização que regride, novo batedor de pênalti, goleiro reserva do adversário). Faseável, mas é o que separa "enciclopédia" de "ferramenta de aposta".
- **ui:** seções do MVP; toggle totais↔per-90; **scaffold de seletor competição/season** mesmo com 1 liga (evita retrabalho); indicadores de confiança por amostra; SVG manual nos charts pequenos, shadcn/Recharts nos médios.

## Riscos e gotchas

- **Inversão de prioridade** (corrigida): sem volume no MVP, o produto é indistinguível de site grátis.
- **`rating` opaco:** type 118 é composto proprietário sem fórmula exibível — usar como dado carimbado ("score SportMonks"), nunca como o "porquê". Não derivar percentis/consistência dele e vender como insight.
- **Amostra de 1 season:** pênalti (~3-6 eventos/time — "share de pênaltis" é ruído), distribuição de gol por minuto, IQR de rating, percentis de radar — todos exigem **piso de n + carimbo de incerteza**, senão desenham ruído como padrão.
- **xG pago + xA inexistente:** não prometer curva gols-vs-xG nem gap-de-assist sem add-on/fonte externa.
- **Custo real do "barato":** alargar o filtro é 1 call igual, mas **re-sync** reprocessa a janela e **schema migration** — baixo, não-zero (o counter-review disse "zero"; é "baixo").
- **Perfis-borda:** goleiro (seções de finalização vazias), jogador que chegou no meio da season, recém-promovido — desenhar estados por posição/cobertura.

## Refutado

- **"Notas/minutos por partida não estão ingeridos"** (premissa anterior, wishlist W-001/W-003/W-004) — **REFUTADO**: `lineup_player.rating`/`minutesPlayed` existem (`leagues.ts:171-172`). O gargalo é exibição/agregação, não ingestão.
- **"Stats de volume já vêm no payload, custo zero pra persistir"** (counter-review) — **parcialmente refutado**: o filtro `lineupDetailTypes` (`sync:265`) restringe a 3 types; custo é alargar filtro + colunas + re-sync = **baixo**, não zero.
- **"Curva gols-acumulados vs xG"** (síntese inicial) — **REFUTADO** como entregável: xG per-match é add-on pago e xA não existe na SportMonks; no free, no máximo 1 escalar G-xG(season) com ressalva.
- **"Heatmap/shot map a partir do que temos"** — **REFUTADO**: SportMonks não expõe coordenadas x,y de jogador; `grid` dá só posição média aproximada.

## Perguntas Abertas (decisão do dono)

1. **Alargar o filtro de stats de volume agora?** (unlock #1, custo baixo, sem add-on) — recomendado SIM, já no MVP.
2. **Pagar o add-on de xG?** (sem ele, sem gap-de-gol preditivo e sem shot-map por xG; xA fica fora de qualquer jeito).
3. **Piso de minutos para per-90** — ~450-600 min? Abaixo, só contagem bruta + "amostra insuficiente"?
4. **Radar de percentil** com baseline só da PL 25/26 (instável) ou segurar até ter mais ligas/seasons?
5. **Carreira/transferências** agora (cobertura retroativa incompleta; valor de mercado contínuo **não** existe na SportMonks, só fee — plugar Transfermarkt carimbado?) ou adiar?
6. **Bloco de próxima-partida + projeção/linha** entra em que fase? É o maior valor de produto e o que falta em TODOS os concorrentes — mas exige odds + motor quant.
7. **Perfil de árbitro** (transforma cartões de paridade em diferencial) entra no roadmap de ingestão junto com o volume?

## Evidências decisivas

- `apps/api/src/db/sync-sportmonks.ts:24,265,406-408` — prova que o sync filtra `lineupDetailTypes:118,119,1490` na mesma chamada que traria os stats de volume.
- `apps/api/src/db/schemas/leagues.ts:171-173,207-245,183-202` — rating/minutos/MOTM/gols/cartões/lesões já no schema.
- `apps/web/.../player-detail.tsx` + `shared.ts:264` — estado stub atual da página/endpoint.
- `docs.sportmonks.com/.../fixture-statistics` + `.../player-statistics` + `.../expected/includes` (as-of 2026-06-28) — types per-match vs season; xG como add-on pago; xA ausente.
- `docs.sportmonks.com/.../transfers/get-transfers-by-player-id` + Team Squad — histórico de carreira/clubes confirmado (W-002).
- FBref Scouting Report (percentil) · WhoScored strengths/weaknesses · FotMob per-90 percentile · Sofascore Attribute Overview — referências de "número vira julgamento" e da ponte ESTIMAR→EXPLICAR.
- `docs/mercados/jogadores-props.md` (interno) — settlement Opta, pricing Poisson, volume>gol, hit-rate, batedor de pênalti, traps de SGP.
