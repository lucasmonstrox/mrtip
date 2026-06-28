# 🌠 Wishlist — coisas que quero implementar (ainda não decididas)

Caderno de ideias **antes** de virarem feature rastreada. É o inbox cru: jogue a ideia aqui no calor do momento, a skill `/wl` enriquece e organiza. Quando uma ideia amadurece, ela sai daqui (vira feature em `docs/features/` via `/rs`/`/pl`) e o registro abaixo marca `promovido`.

> **Não é** o registro oficial de features. Aqui não tem build, nem ID de commit, nem teste. É desejo, não compromisso. A fonte única de status do projeto continua sendo `docs/features/`.

## Como ler uma entrada

| Campo | O que é |
|---|---|
| `W-NNN` | id local da wishlist (crescente, nunca reusa número) |
| **desejo** | 🔥 quero muito · ✨ seria legal · 💤 só anotando |
| **esforço** | palpite grosseiro: P (horas) · M (dias) · G (semana+) · ❓ não sei |
| **faceta** | superfície que toca: `dados` · `api` · `ia` · `ui` (igual `docs/features`) |
| **status** | `ideia` · `amadurecendo` · `pronta` (pra investigar) · `promovido` (virou feature) · `descartado` |

---

## 🔥 Quero muito

### W-001 · Tooltip de jogador no hover (stats da season) · 🔥 · esforço M · `ui` `dados`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** ao passar o mouse sobre o nome de um jogador (escalação, dossiê, lista), abrir uma tooltip com um resumo da season dele: gols, assists e um mini-gráfico de performance (sparkline) baseado nas notas por partida.

**Por quê:** dá contexto na hora sem tirar o usuário da tela — quem lê o dossiê entende rápido "esse cara tá em forma?" pelas notas recentes. Polimento de UX que conversa com a tese de transparência (o número aparece junto do nome, auditável).

**Depende de / esbarra em:** gols/assists por jogador **já existem** (derivados da tabela `goal`, `getPlayerDetail` em `apps/api/src/modules/leagues/shared/shared.ts:264`, já no front via `use-player-query.ts`). **CORREÇÃO (2026-06-28, `/rs` LIG-001):** a série de notas por partida **JÁ ESTÁ INGERIDA** — `lineup_player.rating` (type 118) em `apps/api/src/db/schemas/leagues.ts:171`. A premissa antiga ("rating não ingerido") está **refutada**; o sparkline é UI/agregação pura, sem migração.

**Notas:** decidir o componente de tooltip (Radix/shadcn já no `@workspace/ui`) e a lib do sparkline (SVG manual + `d3-scale` é o recomendado pra sparkline pequena — ver `docs/investigacoes/pagina-do-jogador.md`). **Coberta pela investigação LIG-001** (a tooltip é uma destilação da seção "forma recente" da página do jogador). Tanto (1) gols/assists quanto (2) sparkline de notas são entregáveis HOJE — o dado já está no banco.

### W-002 · Histórico de clubes por season na página do jogador · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do jogador, mostrar por qual clube ele jogou em cada season (linha do tempo de carreira / histórico de transferências), não só os dados da season atual.

**Por quê:** dá profundidade ao perfil e alimenta contexto de aposta — "esse cara acabou de chegar", "voltou ao ex-clube". Conversa com a tese (perfil auditável do jogador) e é paridade básica de qualquer site de stats.

**Depende de / esbarra em:** a página do jogador já existe (`getPlayerDetail`, `apps/api/src/modules/leagues/shared/shared.ts:264`), mas só tem gols/assists/desfalques **derivados da season corrente** — não há histórico de clube/transferência no schema (tabela `player` é mínima). **Mesma âncora de dados do `SIN-007` (lei do ex / rivalidade):** `docs/regras/rivalidade.md` já mapeou as fontes de histórico de transferências — transfermarkt-datasets (`transfers`+`appearances`), API-Football `/transfers`, worldfootballR, Wikidata P54. Ingerir isso destrava as DUAS features.

**Notas:** **Sinergia forte com `SIN-007`** — o mesmo unlock de dados serve pro sinal de rivalidade E pra esse histórico de UI; vale planejar junto. **RESPONDIDO (2026-06-28, `/rs` LIG-001):** a **SportMonks ENTREGA** sim — `transfers` include (`/transfers/players/{id}`: from/to_team, date, type_id transfer/loan/free, fee) + Team Squad endpoints (spells por season com start/end de contrato, jersey). Evita trazer transfermarkt. Ressalva: cobertura retroativa incompleta, e **valor de mercado contínuo NÃO existe** na SportMonks (só fee de transferência) — se quiser o gráfico de valor-no-tempo estilo Transfermarkt, aí sim precisa fonte externa. Faceta `dados` é fase 2 (multi-season), detalhado em `docs/investigacoes/pagina-do-jogador.md`.

### W-003 · Jogos disputados por season na página do jogador · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do jogador, mostrar quantos jogos (appearances) ele disputou em cada season — uma quebra por temporada, não só o agregado da season atual.

**Por quê:** medida básica de presença/regularidade do jogador, e base pra contextualizar gols/assists (taxa por jogo). Paridade de qualquer perfil de jogador; complementa o histórico de clubes (W-002).

**Depende de / esbarra em:** página do jogador já existe (`getPlayerDetail`, `apps/api/src/modules/leagues/shared/shared.ts:264`). **CORREÇÃO (2026-06-28, `/rs` LIG-001):** appearances da season corrente são **deriváveis HOJE** — basta contar as linhas de `lineup_player` do jogador (cada partida que ele entrou na escalação). Não precisa de tabela nova. Só a quebra **multi-season** depende de ingestão futura (hoje só PL 25/26 ingerida).

**Notas:** **Coberta pela investigação LIG-001** — appearances vira parte da seção "minutos/titularidade". A premissa antiga ("não há contagem no schema") está **refutada**: o granular por partida basta pra season corrente; multi-season é roadmap, não bloqueio.

### W-004 · Minutos jogados por season na página do jogador · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do jogador, mostrar quantos minutos ele jogou em cada season — quebra por temporada, par natural da contagem de jogos (W-003).

**Por quê:** minutos é a medida fina de uso real (titular x reserva x entrou no fim), melhor que só "jogos". Base pra normalizar stats por 90min (gols/90, etc.) e contextualizar forma/carga. Paridade de perfil de jogador.

**Depende de / esbarra em:** página do jogador existe (`getPlayerDetail`, `apps/api/src/modules/leagues/shared/shared.ts:264`). **CORREÇÃO (2026-06-28, `/rs` LIG-001):** minutos por partida **JÁ ESTÃO INGERIDOS** — `lineup_player.minutesPlayed` (type 119) em `apps/api/src/db/schemas/leagues.ts:172`. Somar por season é agregação pura. A premissa antiga ("não há minutos no schema") está **refutada**; só a quebra multi-season depende de ingestão futura.

**Notas:** **Coberta pela investigação LIG-001** — minutos é a base da seção "minutos/titularidade" E o denominador do per-90. O `/rs` confirmou: a soma de `minutesPlayed` (não o nº de jogos) é o denominador correto, com **piso de ~450-600 min** antes de exibir per-90 (amostra pequena). Entregável hoje.

### W-005 · Split de gols casa/fora do jogador · 🔥 · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** mostrar quantos gols o jogador fez em casa vs fora — o total de gols dividido por mando de campo.

**Por quê:** padrão casa/fora é sinal clássico pra props de jogador (artilheiro que só engrena em casa) e conversa direto com a tese de over/under e mercados de jogador. Recorte simples com leitura imediata.

**Depende de / esbarra em:** **NÃO depende do unlock de season stats (W-001..W-004).** É derivável do que já existe: `goal.teamId` (time que marcou) vs `match.homeTeamId`/`awayTeamId` → casa se iguais, fora se não. O `getPlayerDetail` (`apps/api/src/modules/leagues/shared/shared.ts:264`) já faz o join `goal`→`match`; falta só adicionar a contagem fatiada por mando.

**Notas:** **a ovelha fora do rebanho — quick win real.** Diferente das W-001..W-004, o dado já está no banco; é só uma agregação a mais no `getPlayerDetail` + 2 números na UI. Escopo atual = season corrente. **Coberta pela investigação LIG-001** — entra na seção "splits casa/fora" do MVP da página do jogador. Par natural com a W-006. (O `/rs` cortou o split *por adversário* como ruído com 1 season, mas casa/fora bruto fica.)

### W-006 · Split de gols 1º tempo / 2º tempo do jogador · 🔥 · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** mostrar quantos gols o jogador fez no 1º tempo vs 2º tempo — total de gols dividido pelo tempo da partida em que saíram.

**Por quê:** padrão de timing de gol é insumo pra mercados de over/under por tempo e props de jogador ("marca cedo?"). Recorte com leitura imediata e direto na tese.

**Depende de / esbarra em:** **derivável do que já existe** (igual W-005, sem migração): `goal.minute` já é selecionado no `getPlayerDetail` (`apps/api/src/modules/leagues/shared/shared.ts:264`) → 1º tempo = `minute ≤ 45`, 2º tempo = `minute > 45`. Só falta a agregação + os 2 números na UI.

**Notas:** **par com W-005 — micro-família "recortes de gol derivados" (casa/fora + tempo), ambas quick wins `api`+`ui` sem tocar schema.** Valem ser promovidas juntas numa feature só ("breakdowns de gol do jogador"). **Coberta pela investigação LIG-001** (seção "produção ofensiva" / distribuição de gol por minuto — o `/rs` recomenda strip/pontos, não histograma suavizado, por causa da amostra pequena). **Gotcha pro `/pl`:** acréscimos — como a SportMonks codifica o minuto de um gol aos 45+2 / 90+3? Confirmar a convenção antes de cravar o limiar `≤45`.

### W-007 · Estádio de cada partida · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** registrar e exibir em qual estádio cada partida foi disputada — o venue do jogo, na página da partida (e disponível pra cruzamentos).

**Por quê:** estádio é dimensão de contexto (mando real, fator casa, viagem do visitante) e base pra sinais de carga/viagem e rivalidade territorial. Insumo, não enfeite — alimenta análise, não só mostra.

**Depende de / esbarra em:** **não está no schema** — a tabela `match` tem score/data/times, sem `venue`/`stadium` (busca SocratiCode 2026-06-28, nada em `apps/api/src/db/schemas/leagues.ts`). A SportMonks entrega venue por fixture (e venue como estádio-casa do time), então é ingestão + coluna/tabela `venue` + sync. Esbarra no `SIN-007` (rivalidade) e em sinais de **viagem/carga**, que já pediam **geocoding de estádios** — `docs/regras/rivalidade.md` cita estádio/whitelist/geocoding.

**Notas:** primeira ideia **fora da página do jogador** — domínio de partida. **Sinergia de dados:** venue + coordenadas destrava (a) este display, (b) distância de viagem do visitante (sinal de fadiga), (c) rivalidade territorial do `SIN-007`. **Decisão de modelagem RESOLVIDA por W-008 (2026-06-28):** como o João pediu lat/lon por estádio, vence a **tabela `venue` própria** (nome + cidade + lat/long) em vez de coluna solta em `match` — `match` referencia `venue`. Promover W-007 e W-008 como uma feature só de venue.

### W-008 · Coordenadas (lat/lon) de cada estádio · 🔥 · esforço M · `dados`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** ter latitude/longitude de cada estádio, pra geolocalizar partidas — habilita distância de viagem, mapas e proximidade entre clubes.

**Por quê:** lat/lon é o que transforma "nome do estádio" em **dado calculável**: distância de viagem do visitante (sinal de fadiga/carga sobre over/under), rivalidade territorial (proximidade geográfica), e qualquer visualização em mapa. É insumo de modelo, não enfeite.

**Depende de / esbarra em:** **acoplada à W-007** — é a coordenada da mesma tabela `venue` (W-008 = colunas `latitude`/`longitude` na tabela que a W-007 cria). Mesmo domínio do `SIN-007` (rivalidade/viagem), que já listava **geocoding de estádios** como necessidade em `docs/regras/rivalidade.md`.

**Notas:** **W-007 + W-008 = uma feature só ("venue com geo"); não promover separado.** W-008 é a razão de a W-007 virar tabela própria em vez de coluna. **Aberto pro `/rs`:** a SportMonks já devolve lat/long no objeto de venue? Se sim, vem de brinde na ingestão da W-007; se não, precisa de uma fonte de geocoding (geocodificar o nome/cidade do estádio 1x e cachear). Coordenada só destrava valor com a fórmula de distância (haversine) — anotar que o consumidor real é o **sinal de viagem**, não o display.

### W-015 · Participação ofensiva por jogador na página do time · 🔥 · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do time, uma tabela de produção ofensiva do elenco — cada jogador com **gols + assistências** na season E a sua **participação**: a fatia do ataque do time que ele tocou, `(gols + assists do jogador) / total de gols do time`. Lê como "Haaland participou de 38% dos gols do City" — dependência ofensiva, não só contagem.

**Por quê:** participação revela **concentração de ataque** — time que depende de 1 cara (desfalque dele derruba o over) vs ataque distribuído. É insumo direto pra over/under e props: o número bruto de gols não diz "quão dependente o time é dele". Conversa com a tese (perfil auditável + leitura de mercado) e dá à página do time a dimensão de elenco que hoje falta (só tem standing/trends/form/matches).

**Depende de / esbarra em:** **zero schema, zero migração — derivável do que já existe.** Mesma agregação `goal⋈match` que o `scorers.service.ts` já faz pra liga (gols excluindo `type = "own"`, assists via `goal.assistId`), só que **escopada a um time** (filtrar por `goal.teamId` / `match` do time). O total de gols do time pro denominador já sai do mesmo join. A página do time é o `getTeam` em `apps/api/src/modules/leagues/get-team/get-team.service.ts:13` (compõe `loadTeamMatches` etc. de `shared/shared.ts`) → adicionar um `loadTeamScorers(teamId)` no mesmo padrão. UI: novo componente em `apps/web/features/leagues/components/team-detail/` (irmão de `team-standing.tsx`/`team-trends.tsx`).

**Notas:** **Família B (derivados do `goal`, zero schema) — primo da W-009/W-013 (marcadores da liga), mas no domínio de time.** Reaproveita a regra de excluir gol contra (`type != "own"`) e a heurística de assists. **Gotchas pro `/pl`:** (1) o denominador é **total de gols do time** (contar gols com `teamId` = time, exceto contra) — gol contra a favor do time não conta como participação de ninguém; (2) participação pode passar de 100%? Não, porque cada gol conta no máx. 1 vez pro denominador, mas um mesmo gol pode dar +1 a **dois** jogadores (marcador E assistente) — isso é correto (os dois participaram), só deixar claro que a soma das participações > 100% é esperada; (3) piso de amostra — com poucos gols do time, % fica ruidosa (mostrar contagem sempre, % com banda ou só com n mínimo). **Assumi 🔥** pelo "quero saber" + ser quick win.

### W-016 · Minutos jogados por jogador na página do time · 🔥 · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do time, mostrar quantos minutos cada jogador do elenco acumulou na season — o tempo de jogo por atleta, somado sobre todas as partidas do time. Lê como uso real do elenco (titular fixo x rodízio x quem quase não joga).

**Por quê:** minutos é a medida fina de **quem o técnico confia** e de carga acumulada — base pra normalizar produção por 90min e contextualizar forma/rotação. Junto da participação ofensiva (W-015), fecha a leitura de elenco da página do time: quem joga muito E quem entrega. Paridade com qualquer perfil de clube.

**Depende de / esbarra em:** **zero schema, zero migração — o dado JÁ está ingerido.** `lineup_player.minutesPlayed` (SportMonks type 119) em `apps/api/src/db/schemas/leagues.ts:172`, preenchido pelo sync. Confirmado nos docs da SportMonks (player statistics) que minutes-played é stat de evento, não de tracking. Somar por jogador sobre as partidas do time é agregação pura — mesmo caminho do `getTeam` (`apps/api/src/modules/leagues/get-team/get-team.service.ts:13`) + um `loadTeamMinutes(teamId)` no padrão dos outros loaders de `shared/shared.ts`.

**Notas:** **Mesma tabela de elenco da W-015 — provavelmente UMA feature só ("squad table" da página do time: minutos + gols + assists + participação por jogador), não dois componentes.** Vale o `/pl` planejar W-015 + W-016 juntas. Primo da **W-004** (minutos na página do **jogador**) — mesma coluna de origem, superfície diferente. **Assumi 🔥** pelo "quero saber" + quick win, alinhado com a W-015.

## ✨ Seria legal

### W-010 · Agrupar jogos por data na aba Rounds · ✨ · esforço P · `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** dentro de cada rodada na aba **Rounds** da página da liga, subdividir os jogos por data (ex.: "Sáb 30/08", "Dom 31/08") em vez de listar todas as partidas da rodada num bloco corrido.

**Por quê:** uma rodada da PL espalha os jogos por 3-4 dias (Sex→Seg); agrupar por data dá leitura imediata de "quando cada jogo acontece" e organiza visualmente um bloco que hoje fica plano. Polimento de UX, paridade com qualquer site de futebol.

**Depende de / esbarra em:** **zero schema, zero API.** O dado já existe — `match.date` por partida; a rodada já vem agrupada de `groupByRound` (`apps/api/src/modules/leagues/shared/shared.ts:619`) e é renderizada em `apps/web/features/leagues/components/league-detail/rounds-list.tsx`. A sub-quebra por data é puro front (agrupar o array de `matches` da rodada por `date`, formatar com `date-fns`).

**Notas:** quick win `ui` isolado, sem família. Formatar a data com `date-fns` (regra do projeto, nada de `Intl` cru). **Assumi ✨ ("seria legal") — me fala se quer 🔥.** Aberto: ordenar os grupos por data asc e, dentro do dia, por horário (`match` tem hora?).

### W-011 · Coluna de MOTM (man of the match) nos marcadores · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na aba **Marcadores** da página da liga, adicionar uma coluna com quantas vezes cada jogador foi o homem da partida (MOTM) na season — ao lado de gols e assistências.

**Por quê:** MOTM é a medida de "quem decide jogo" que gols/assists não capturam sozinhos (zagueiro/goleiro que ganha partida). Enriquece o ranking de marcadores com performance além do gol e conversa com perfil auditável do jogador. Paridade com sites de stats.

**Depende de / esbarra em:** **zero schema, zero migração — o dado JÁ está ingerido.** Coluna `lineup_player.man_of_match` (boolean, SportMonks type 1490) preenchida pelo sync (`apps/api/src/db/sync-sportmonks.ts:24`, schema em `apps/api/src/db/schemas/leagues.ts:174`). Falta só a agregação no `scorers.service.ts` (`count(lineup_player WHERE man_of_match)` por jogador, escopado à liga via `lineup → match.leagueCode`) + a coluna na `scorers-table.tsx`. Mesma forma das duas agregações que o service já faz (gols, assists).

**Notas:** **entra na Família B (derivados, zero schema) com W-009 (artilheiros) — quick win `api`+`ui`.** Veio do `7af237f` (ratings/minutes/MOTM por jogador-partida já no banco). **Assumi ✨ — me fala se é 🔥.** Aberto: ordenar a tabela ainda por gols (MOTM é coluna extra, não chave de ordenação) e decidir se o número também aparece no dossiê/página do jogador.

### W-012 · Substituições de cada partida · ✨ · esforço M · `dados` `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** registrar e exibir as substituições de cada partida — quem entrou, quem saiu e em que minuto — na timeline de eventos da página da partida (junto de gols e cartões).

**Por quê:** substituição é peça que falta pra contar a história do jogo (mudança tática, gestão de carga, lesão no lance) e fecha o conjunto de eventos canônicos. Também é a fonte fina de **minutos jogados** por entrada/saída e insumo pra forma/rotação. Paridade com qualquer súmula.

**Depende de / esbarra em:** **NÃO está ingerido — precisa de migração.** O sync só trata `goal` e `card` (`apps/api/src/db/sync-sportmonks.ts:451-471`); não há tabela `substitution` (schema só tem `goal`/`card`/`injury` em `apps/api/src/db/schemas/leagues.ts`). O **feed de eventos da fixture já é buscado** no mesmo loop, então o unlock é: (1) tabela `substitution` (`matchId`, `teamId`, `playerInId`, `playerOutId`, `minute`, `sportmonksEventId` p/ dedup), (2) novo ramo no sync mapeando o tipo de evento de sub, (3) novo tipo na timeline `match-events.tsx` (que já mistura gols+cartões cronologicamente). A `docs/modelagem.md` §8 **já previa** `substituicao` como tipo de evento (mapa pronto: protagonista = entra, secundário = sai).

**Notas:** **Sinergia com W-004 (minutos por season):** os minutos finos saem do par sub-entra/sub-sai + apito final; vale o `/rs` cruzar as duas. **Assumi ✨ ("seria legal") — você disse "quero saber", me fala se é 🔥.** Gotchas pro `/pl`: convenção do minuto em acréscimos (igual W-006); a SportMonks dá entra/sai num evento só ou em dois? (decide `playerInId`/`playerOutId` numa linha vs duas); e a regra de `sort_order` da `modelagem.md` (ordenar por ordem do evento, não só por minuto).

### W-014 · Notas (ratings) coloridas por faixa de valor · ✨ · esforço P · `ui`
<adicionada: 2026-06-28 · status: feito · feito: 2026-06-28>

**Feito (2026-06-28):** o `ratingColor()` que já existia em `match-detail/lineup.tsx` foi **promovido** pra `apps/web/features/leagues/utils/format.ts` (compartilhado, mesma escala ≥7.5 verde · ≥6.5 neutro · <6.5 vermelho), o `lineup.tsx` passou a importar de lá (dedupe), e a coluna **Nota** do match-log da página do jogador (`player-detail.tsx`) ganhou a cor. Verificado no Chrome (Garner: 8.28/7.75 verde, 6.7x neutro), 0 erro de console.


**O quê:** colorir o número da nota (rating 0-10) conforme a faixa — verde para notas altas, neutro no meio, laranja/vermelho para baixas — onde a nota aparece (hoje: match-log da página do jogador; depois: dossiê, escalação, tooltip W-001).

**Por quê:** leitura instantânea de desempenho/forma sem ler o número — o olho pega a cor antes do dígito. É o padrão de mercado (Sofascore Rating badge colorido), citado na investigação `docs/investigacoes/pagina-do-jogador.md` como selo. Reforça o match-log que o LIG-001 acabou de entregar.

**Depende de / esbarra em:** **zero dados, zero API — puro `ui`.** A nota já é exibida (`apps/web/features/leagues/components/player-detail/player-detail.tsx`, coluna "Nota", de `lineup_player.rating`). É só um helper `ratingColor(rating)` → classe Tailwind por threshold, aplicado na célula. Nada de schema/endpoint.

**Notas:** definir os limiares (estilo Sofascore: ~≥8 verde forte · 7–8 verde · 6.5–7 neutro · <6.5 laranja/vermelho) — confirmar a escala com o João. Promover como pequeno enriquecimento do LIG-001 (ou fazer junto da P5, que já mexe em forma/sparkline de nota). **Assumi ✨ — me fala se é 🔥.**

## 💤 Anotando

_(vazio)_

---

## 🗄️ Arquivadas (promovidas ou descartadas)

### W-009 · Artilheiros da liga (marcadores) · 🔥 · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: feito · feito: 2026-06-28>

**O quê:** na página da liga, ao lado de classificação e rodadas, um ranking de artilheiros (marcadores) — goleadores ordenados por gols na season, com assistências ao lado.

**Por quê:** completa o trio canônico de página de liga (tabela → rodadas → artilheiros). Paridade básica de qualquer site de futebol e porta de entrada pra perfil de jogador (W-001..W-006).

**Feito (2026-06-28):** endpoint `GET /v1/leagues/:code/scorers` — agregação `goal⋈match` por jogador (gols excluindo `type = "own"` + assists via `goal.assistId`), ranqueada por gols, **sem migração de schema** (`apps/api/src/modules/leagues/scorers/scorers.service.ts`, rota em `leagues.routes.ts`). Front: aba **Marcadores** em `league-detail.tsx` com `react-virtuoso` revelando **20-em-20** no scroll da própria página, via `customScrollParent` (`scorers-table.tsx` + `use-scorers-query.ts`). Colunas pedidas pelo João: **gols + assists, sem quebra de pênaltis**. Verificado no browser (PL: Haaland 27/8 no topo, 280 marcadores, console limpo). Implementado direto da wishlist, **sem ID de feature** em `docs/features/`.

**Notas:** **Família B (derivados do `goal`) com W-005/W-006** — quick win `api`+`ui`, zero schema; compartilham a regra de excluir gol contra (`type != "own"`) e a fonte `goal`. Não feito (em aberto): quebra de pênaltis no total (`goal.type` já distingue `"penalty"`). **W-011 (coluna de MOTM nos marcadores) estende esta aba** — mesma `scorers-table.tsx` + `scorers.service.ts`.

### W-013 · Time do jogador (com logo) nos marcadores · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: feito · feito: 2026-06-28>

**O quê:** na aba **Marcadores** da página da liga, mostrar de qual time é cada jogador, com o logo do clube à esquerda da linha (antes do nome/foto do jogador).

**Por quê:** sem o clube, o ranking de marcadores não diz "quem é de quem" num relance — o logo dá leitura imediata e identidade visual à lista. Paridade com qualquer tabela de artilheiros e ponte natural pra página do time.

**Feito (2026-06-28):** **sem migração de schema.** API — `scorers.service.ts` ganhou um terceiro agregado (padrão "query + merge por `Map`", igual gols/assists): join `goal⋈match⋈team` filtrando gol contra, ordenado por `match.date` desc, e o **primeiro gol (mais recente) define o clube** — resolve jogador que trocou de time no meio da season. O `Scorer` agora carrega `team: { id, name, slug, logoUrl } | null` (sempre preenchido, já que todo marcador tem ≥1 gol não-contra). Front — `scorers-table.tsx`: nova coluna de escudo à esquerda no grid `COLS` (rank·**logo**·jogador·G·A), `<img>` com `object-contain` e `title` = nome do time. **Bug pego no browser e corrigido:** a célula do header da coluna do escudo usava `sr-only` (`position:absolute`), que **sai do fluxo do grid** e desalinhava o header (G/A caíam uma coluna à esquerda) — trocado por `<span aria-hidden>` vazio que ocupa a coluna. **Verificado no browser** (chrome-devtools, PL): escudos à esquerda, header alinhado (G sobre gols, A sobre assists), console limpo. `typecheck` 3/3. **Caso de transferência validado de verdade:** o dataset tem Semenyo transferido pro Man City em jan/2026 (marcou pelo Bournemouth até 07/01, pelo Man City a partir de 24/01) — a heurística "gol mais recente" mostrou corretamente o **clube atual** (Man City). Implementado direto da wishlist, **sem ID de feature** (precedente da W-009).

**Notas:** **Família B (enriquecimentos da tabela de marcadores).** Restou a **W-011 (coluna de MOTM)** na mesma `scorers-table.tsx` + `scorers.service.ts` — quando for implementar, é só mais um agregado + coluna. Gotcha resolvido aqui que vale pra W-002 (histórico de clubes): a regra "time do gol mais recente" é uma aproximação barata de "clube atual" sem precisar de histórico de transferências.
