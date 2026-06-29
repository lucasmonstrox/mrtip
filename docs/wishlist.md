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

### W-028 · Peso do jogo na classificação (luta por título / rebaixamento / vaga europeia) · 🔥 · esforço M · `api` `ui`
<adicionada: 2026-06-29 · status: ideia>

**O quê:** mostrar e **classificar** os jogos pelo que cada equipe tem **em disputa na tabela** — "luta pra não cair" (zona de rebaixamento), "ainda briga pelo título", "caça vaga na Champions / Europa / Conference". Um **selo de peso** por time em cada partida (o que aquele resultado significa pra classificação dele) e, no nível da rodada/lista, **destacar/ordenar** os jogos de maior peso (dois necessitados se enfrentando > dois times no meio de tabela sem nada em jogo).

**Por quê:** peso do jogo é o insumo nº1 de **motivação assimétrica** (necessitado x indiferente), que move 1X2/over-under e é onde mora o edge — e o usuário quer ver, num relance, "esse jogo vale rebaixamento dos dois lados" no lugar onde escolhe a aposta. Conversa direto com a tese (o porquê auditável aparece junto do jogo) e dá leitura instantânea de quais partidas da rodada **importam de verdade**.

**Depende de / esbarra em:** **zero schema, zero migração — derivável do que já existe.** A classificação já é computada (`computeStandings` + `loadTeamStanding` em `shared/shared.ts:694`, a mesma base que a [[W-027]]/LIG-006 usa) e todas as partidas estão no banco → o "peso" sai de **posição atual + pontos restantes (jogos que faltam ×3) + gap pra cada zona** (título, G4/G5 Champions, Europa, Conference, Z-rebaixamento). **Par de UI do `SIN-010`** (motivação e peso do jogo / stakes — *investigado*, P2, `docs/regras/motivacao.md`): o sinal modela o edge, este display é a perna visível do mesmo conceito. Encosta na LIG-006 (snapshot da tabela na partida) como lugar natural do selo.

**Notas:** **a perna de UI do `SIN-010`** — mesma relação que a [[W-019]] (dias de descanso) tem com o `SIN-008` (fadiga): display barato hoje, sinal modelado depois reusa o cálculo. **Ambiguidade de escopo (resolver no `/rs`/`/pl`):** (a) **selo por jogo** (badge "luta contra rebaixamento" nos dois lados) — captura simples e barata; vs (b) **classificar/ordenar a rodada** pelos jogos de maior peso (highlight dos jogos que importam) — mais produto. São UIs diferentes; o "mostrar/classificar" do pedido quer as duas, mas dá pra entregar (a) primeiro. **Gotchas grandes pro `/pl`:** (1) as **zonas são por-competição** — Z-rebaixamento (3 últimos na PL), G-Champions (4-5), Europa, Conference mudam por liga; mesma família da memória [[standings-desempate-pl-especifico]] (cutoffs e desempate são PL-específicos, recompute genérico mis-ordena); (2) "matematicamente vivo" tem dois níveis — gap simples (pontos até a zona ≤ pontos em jogo) é barato e honesto; **magic number** rigoroso (considerar confrontos diretos restantes) é mais caro e provavelmente exagero pro MVP; (3) só temos a **PL 25/26** ingerida e ainda no meio da season — o peso é mais nítido na **reta final**; cedo demais quase tudo está "vivo". **Assumi 🔥** pela ênfase ("seria *muito* legal ter isso") — me fala se é ✨.

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

**Depende de / esbarra em:** **NÃO está ingerido — precisa de migração.** O sync só trata `goal` e `card` (`apps/api/src/db/sync-sportmonks.ts:451-471`); não há tabela `substitution` (schema só tem `goal`/`card`/`injury` em `apps/api/src/db/schemas/leagues.ts`). O **feed de eventos da fixture já é buscado** no mesmo loop, então o unlock é: (1) tabela `substitution` (`matchId`, `teamId`, `playerInId`, `playerOutId`, `minute`, `sportmonksEventId` p/ dedup), (2) novo ramo no sync mapeando o tipo de evento de sub, (3) novo tipo na timeline `match-events.tsx` (que já mistura gols+cartões cronologicamente). A `docs/arquitetura/modelagem.md` §8 **já previa** `substituicao` como tipo de evento (mapa pronto: protagonista = entra, secundário = sai).

**Notas:** **Sinergia com W-004 (minutos por season):** os minutos finos saem do par sub-entra/sub-sai + apito final; vale o `/rs` cruzar as duas. **Assumi ✨ ("seria legal") — você disse "quero saber", me fala se é 🔥.** Gotchas pro `/pl`: convenção do minuto em acréscimos (igual W-006); a SportMonks dá entra/sai num evento só ou em dois? (decide `playerInId`/`playerOutId` numa linha vs duas); e a regra de `sort_order` da `modelagem.md` (ordenar por ordem do evento, não só por minuto).

### W-014 · Notas (ratings) coloridas por faixa de valor · ✨ · esforço P · `ui`
<adicionada: 2026-06-28 · status: feito · feito: 2026-06-28>

**Feito (2026-06-28):** o `ratingColor()` que já existia em `match-detail/lineup.tsx` foi **promovido** pra `apps/web/features/leagues/utils/format.ts` (compartilhado, mesma escala ≥7.5 verde · ≥6.5 neutro · <6.5 vermelho), o `lineup.tsx` passou a importar de lá (dedupe), e a coluna **Nota** do match-log da página do jogador (`player-detail.tsx`) ganhou a cor. Verificado no Chrome (Garner: 8.28/7.75 verde, 6.7x neutro), 0 erro de console.


**O quê:** colorir o número da nota (rating 0-10) conforme a faixa — verde para notas altas, neutro no meio, laranja/vermelho para baixas — onde a nota aparece (hoje: match-log da página do jogador; depois: dossiê, escalação, tooltip W-001).

**Por quê:** leitura instantânea de desempenho/forma sem ler o número — o olho pega a cor antes do dígito. É o padrão de mercado (Sofascore Rating badge colorido), citado na investigação `docs/investigacoes/pagina-do-jogador.md` como selo. Reforça o match-log que o LIG-001 acabou de entregar.

**Depende de / esbarra em:** **zero dados, zero API — puro `ui`.** A nota já é exibida (`apps/web/features/leagues/components/player-detail/player-detail.tsx`, coluna "Nota", de `lineup_player.rating`). É só um helper `ratingColor(rating)` → classe Tailwind por threshold, aplicado na célula. Nada de schema/endpoint.

**Notas:** definir os limiares (estilo Sofascore: ~≥8 verde forte · 7–8 verde · 6.5–7 neutro · <6.5 laranja/vermelho) — confirmar a escala com o João. Promover como pequeno enriquecimento do LIG-001 (ou fazer junto da P5, que já mexe em forma/sparkline de nota). **Assumi ✨ — me fala se é 🔥.**

### W-017 · Alertas de rumores de transferência de jogadores · ✨ · esforço G · `dados` `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** deixar o usuário **criar um alerta** (por jogador, por time ou por liga) e ser avisado quando surgir um novo **rumor de transferência** sobre o alvo — quem está sendo cotado, pra onde, com qual nível de confiança da fonte. É um inbox de "fica de olho nesse cara" alimentado pelo feed de rumores.

**Por quê:** rumor de transferência mexe com mercado de aposta (jogador de saída perde minutos/motivação, clube que reforça muda o teto de gols) e é o tipo de informação que o apostador quer **na hora que sai**, não quando vai conferir o app. É também a primeira peça de uma infra de **alertas em tempo real**, que a `docs/visao-geral.md:143` já coloca como diferencial de Fase 2/3 (junto de movimento de odds, escalação confirmada, lesão de última hora).

**Inspiração:** ecossistema de rumores é gigante no UK (NewsNow, Sky Sports Transfer Centre, TEAMtalk… ver `docs/research/sites-futebol-masculino.md`) — alerta personalizado é a forma de domar esse ruído num feed só do que interessa ao usuário.

**Depende de / esbarra em:** **a fonte de dados já existe** — SportMonks tem `transfer-rumours` (+ `transfers`/`pendingTransfers`), dentro da assinatura atual, mapeado na investigação do `SIN-002` (`docs/investigacoes/sinal-interesses-patrocinadores-jogador.md:66`). O que **não existe** é a infra de alerta: persistência das preferências do usuário (quem segue o quê), um job que varre o feed e casa com os alertas, e um canal de entrega. **Guardrail de compliance (OBRIGATÓRIO):** `docs/ui/design-system/conformidade-jogo-responsavel.md:230` **proíbe** notificação push de urgência no estilo "aposte agora" — o alerta tem que ser informativo (rumor saiu), nunca um gatilho de aposta. Esbarra também na futura **página do jogador/time** como lugar natural de exibir os rumores e o botão "criar alerta".

**Notas:** **primeira ideia de alerta/notificação da wishlist** — abre a família "alertas em tempo real" da Fase 2/3 (a mesma infra serve odds/escalação/lesão depois, então vale o `/rs` desenhar a infra genérica, não só pra rumor). **Confiabilidade do rumor é o calcanhar:** rumor "frequentemente é falso/inflado" (`docs/investigacoes/sinal-conflitos-entre-jogadores.md:88`) — herdar o padrão `severidade: rumor|confirmado` + sempre carregar `fonte_url`/`data`, e jamais apresentar rumor como fato. Pré-requisito de produto que ainda não está resolvido: **autenticação/conta de usuário** (alerta é por-usuário) e o **canal** (in-app inbox? e-mail? push?). Esforço G assumido pela infra nova, não pelo dado. **Assumi ✨** porque você disse "seria legal" — me fala se quer 🔥.

### W-018 · Alertas sobre evidências extraídas de notícia · ✨ · esforço G · `dados` `api` `ia` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** o caso **geral** da W-017 — deixar o usuário criar um alerta e ser avisado quando uma **nova evidência extraída de notícia** aparecer sobre um alvo que ele segue (jogador, time, partida): lesão/desfalque, suspensão na bica do gancho, conflito de elenco, interesse de patrocinador, rumor de transferência… Cada evidência carrega **fonte, data e nível de confiança**, e o alerta dispara quando algo novo casa com o que o usuário segue.

**Por quê:** é a notícia que move o número de aposta (desfalque derruba o over, racha no elenco muda a postura) chegando **na hora que sai**, filtrada só pro que interessa ao usuário. É a forma de transformar o ruído de centenas de portais (NewsNow, Sky, TEAMtalk… `docs/research/sites-futebol-masculino.md`) num feed acionável. Conversa direto com a tese (transparência: cada evidência é auditável pela fonte/data) e com a visão de **alertas em tempo real** de Fase 2/3 (`docs/visao-geral.md:143`).

**Depende de / esbarra em:** **mais pesada que a W-017** em duas frentes. (1) **Infra de alerta** — mesma da W-017: preferências por-usuário, job de matching, canal de entrega; pré-requisito de **conta/auth** ainda inexistente. (2) **Camada de evidência a partir de notícia** — extrair sinal estruturado de texto livre é trabalho de **`ia`**, e os sinais já investigados dão o molde: lesões (`docs/regras/lesoes.md` — inclusive o alerta de "na bica do gancho" já cogitado em `lesoes.md:86`), conflito de elenco (`SIN-...`, com o padrão `{ tipo, time, severidade: "rumor|confirmado", fonte_url, data, resumo }` em `docs/investigacoes/sinal-conflitos-entre-jogadores.md:77`), interesse de patrocinador (`SIN-002`). **Guardrail de compliance (OBRIGATÓRIO):** alerta informativo, nunca gatilho de aposta — `docs/ui/design-system/conformidade-jogo-responsavel.md:230` proíbe push de urgência.

**Notas:** **W-018 é o guarda-chuva; W-017 (rumor de transferência) é um caso particular dele.** Vale promover pensando na infra genérica: *uma* máquina de alertas + *vários* produtores de evidência (rumor, lesão, conflito…), não um alerta por tipo. **Calcanhar conhecido:** evidência de notícia "frequentemente é falsa/inflada" (`docs/investigacoes/sinal-conflitos-entre-jogadores.md:88`) — daí `severidade` + `fonte_url`/`data` obrigatórios e nunca apresentar como fato. O `/rs` aqui é mais sobre **arquitetura do pipeline notícia→evidência→alerta** do que sobre uma fonte só. **Assumi ✨** ("seria legal") — me fala se é 🔥.

### W-029 · Alerta de desfalque de jogador (lesão/suspensão) · ✨ · esforço G · `api` `ui`
<adicionada: 2026-06-29 · status: ideia>

**O quê:** deixar o usuário **criar um alerta** (por jogador, por time ou por liga) e ser avisado quando um jogador **vira desfalque** para uma partida — entrou na lista de lesionados ou pegou suspensão. Lê como "fica de olho: o Salah caiu pra o próximo jogo" no momento em que o desfalque aparece, não quando o usuário for conferir o app.

**Por quê:** desfalque é a notícia que **mais mexe o número** — perder o artilheiro/criador derruba o over e muda o 1X2, e o apostador quer isso **na hora que sai** (a janela de valor fecha rápido). É também a fatia mais acionável da família de alertas: ao contrário de rumor (incerto) ou odds (caro), o desfalque é um fato estruturado que já temos.

**Depende de / esbarra em:** **o dado JÁ está ingerido — esta é a versão barata-de-dado da família de alertas.** O `SIN-011` (sinal de lesões e desfalques) está com `dados:feito` (`docs/features/INDEX.md`), a tabela `injury` já existe no schema (`apps/api/src/db/schemas/leagues.ts`, âncora compartilhada com LIG-001/LIG-002/SIN-020) e a superfície `absences` já aparece na UI (citada no [[W-001]]). Então **não precisa do pipeline notícia→evidência da [[W-018]]** (nada de `ia`/NLP): o produtor de evento é a varredura do próprio feed estruturado de lesões/suspensões. O que **falta é a infra de alerta** — a MESMA da [[W-017]]/[[W-018]]: persistência das preferências por-usuário (quem segue o quê), um job que detecta "novo desfalque" e casa com os alertas, e um canal de entrega. Pré-requisito de produto ainda inexistente: **conta/auth** (alerta é por-usuário) e o **canal** (in-app inbox? e-mail? push?). **Guardrail de compliance (OBRIGATÓRIO):** `docs/ui/design-system/conformidade-jogo-responsavel.md:230` proíbe push de urgência estilo "aposte agora" — o alerta é informativo (desfalque saiu), nunca gatilho de aposta.

**Notas:** **caso particular concreto da [[W-018]]** (guarda-chuva de alertas de evidência), mas separado de propósito: aqui o produtor é o **feed estruturado** (SIN-011, já ingerido), não a extração de notícia — por isso é mais barato de dado e não carrega o custo de `ia`. Família de alertas com [[W-017]] · [[W-018]] · [[W-020]] (mesma máquina de alerta, produtores diferentes) — vale o `/rs` desenhar a infra genérica de alerta uma vez e este ser o **primeiro produtor a plugar**, justamente por ser o de fonte mais confiável. **Gotcha pro `/pl`:** definir o gatilho exato — "entrou na lista de lesão" vs "confirmado fora da próxima partida" (estados diferentes no feed); e dedupe pra não disparar de novo a cada sync enquanto a lesão persiste (alertar na **transição** apto→desfalque, não no estado). Esforço **G** pela infra nova (não pelo dado, que é o barato). **Assumi ✨** ("seria legal") — me fala se é 🔥.

### W-030 · Previsão do tempo no estádio na hora do jogo · ✨ · esforço M · `dados` `api` `ui`
<adicionada: 2026-06-29 · status: ideia>

**O quê:** na página da partida, mostrar a **condição do tempo prevista no estádio na hora do jogo** — chuva, vento, temperatura, umidade no kickoff, geolocalizado pelo venue. Lê como "no Anfield às 16h30: chuva forte, vento 30 km/h, 8°C" ao lado da partida.

**Por quê:** clima é insumo clássico de **over/under** — chuva pesada e vento forte derrubam a qualidade de passe e o número de gols (jogo trava, mais bola parada), enquanto campo seco favorece o jogo aberto. É o tipo de contexto que o apostador quer **antes** de fechar a linha, no lugar onde decide. Conversa direto com a tese (o porquê auditável — o número/condição aparece junto do jogo) e com o sinal já investigado.

**Depende de / esbarra em:** **a perna de UI/display do `SIN-006`** (sinal de clima / condições de campo — *investigado*, P3, `docs/regras/clima.md`): o sinal modela o edge, este display é a fatia visível do mesmo conceito (mesma relação que [[W-019]]↔SIN-008 e [[W-028]]↔SIN-010). **Destravado pela LIG-004** (`docs/features/ligas/LIG-004-venue-estadio-geo.md`): a tabela `venue` já guarda `latitude`/`longitude` (string, vindos da própria entidade venue da SportMonks, sem geocoding externo) — é a coordenada que habilita o lookup de clima por estádio. **O que falta é a fonte de clima**, que ainda não temos ingerida: confirmar no `/rs` se a SportMonks entrega `weatherreport` por fixture (include no mesmo request do sync) ou se vai precisar de API externa de meteorologia (ex.: Open-Meteo) batendo na lat/lon do venue.

**Notas:** **família "perna de UI de sinal investigado"** com [[W-019]] (descanso/SIN-008) e [[W-028]] (peso/SIN-010) — display barato hoje, o sinal modelado depois reusa o mesmo dado. **Escopo: prospectivo** (previsão pro jogo que vem, que é o "vai estar" do pedido) — o histórico de clima nos jogos passados é leitura secundária e pode coexistir. **Gotchas pro `/rs`/`/pl`:** (1) **previsão x realizado** — pra jogo futuro é *forecast* (muda até o kickoff, precisa refresh), pra jogo passado é *observado*; fontes e frescor diferentes. (2) **fuso/hora local** — o "naquela hora" é o horário local do estádio; casar `match.date` (UTC) com o fuso do venue (regra do projeto: `date-fns-tz`). (3) **estádio coberto/retrátil** — clima não afeta jogo de teto fechado; se a feature virar sinal, lembrar dessa ressalva. (4) cobertura de lat/lon da LIG-004 na prática (geocoding era plano B). **Assumi ✨** ("seria legal") — me fala se é 🔥.

### W-019 · Dias de descanso de cada equipe na página da partida · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página da partida, mostrar há quantos dias cada equipe jogou pela última vez — os **dias de descanso** (rest days) de mandante e visitante antes deste jogo. Lê na hora "o time vem de 3 dias x 7 dias de folga" — assimetria de carga entre os dois lados.

**Por quê:** dias de descanso é o insumo cru de **fadiga/carga**, que pesa sobre over/under e resultado (time com pernas cansadas rende menos, jogo trava). É a fatia **visível e auditável** da intuição da "ressaca de meio de semana" — o usuário vê o número que justifica o sinal, no lugar onde decide a aposta. Paridade com qualquer preview sério de jogo (rest days é coluna padrão).

**Depende de / esbarra em:** **zero schema, zero migração — derivável do que já existe.** É a diferença em dias entre `match.date` deste jogo e a `match.date` do **jogo anterior de cada time** (mais recente antes desta data). Todas as partidas já estão no banco; o cálculo é uma busca do "último match do time antes de X" + `differenceInCalendarDays` (`date-fns`, regra do projeto). A página da partida é o domínio `match-detail` (`apps/web/features/leagues/components/league-detail/.../match-detail`, irmão de `lineup.tsx`/`match-events.tsx`); provavelmente um campo a mais no service que monta a partida (`get-match`/`shared.ts`). **Par analítico do `SIN-008`** (calendário e fadiga, *investigado*) — este display é a perna de UI do mesmo conceito.

**Notas:** **a fatia derivável e barata do `SIN-008`** — display hoje, o sinal modelado vem depois e reaproveita o mesmo cálculo. **Gotcha honesto pro `/pl`:** só temos a **PL 25/26** ingerida — jogo de **copa/seleção no meio de semana não aparece**, então o "descanso" calculado pode estar **superestimado** (o time pode ter jogado um jogo que não enxergamos). É exatamente o caso que mais distorce a leitura de fadiga; mostrar com ressalva ou só dentro da liga. Casa com a memória do João sobre [[teoria-ressaca-meio-de-semana]] (jogo importante no meio de semana → under). **Assumi ✨** — me fala se é 🔥.

### W-021 · Quem marcou no jogo anterior de cada time na página da partida · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-29 · status: ideia>

**O quê:** na página da partida, mostrar os marcadores do **último jogo de cada equipe** antes desta — quem fez os gols (e em que minuto) na partida anterior de mandante e visitante. Lê como "o City vem de 3x0, gols de Haaland (2) e Foden" ao lado de "o rival vem de 0x2" — contexto de quem está fazendo gol chegando neste jogo.

**Por quê:** quem balançou a rede no último jogo é leitura imediata de **forma ofensiva e momento** — complementa a `form-guide` (que hoje dá só V/E/D) com o *autor* do gol, insumo direto pra props de marcador e pra over/under (ataque engrenado x seco). Conversa com a tese (o número/nome aparece auditável no lugar onde se decide a aposta).

**Depende de / esbarra em:** **zero schema, zero migração — derivável do que já existe.** É o mesmo "último match do time antes de X" que a [[W-019]] (dias de descanso) precisa calcular, agora puxando também os `goal` daquela partida (`goal.playerId`, `goal.minute`, `goal.teamId`, excluindo gol contra com `type != "own"`) — join `goal⋈match` que o `scorers.service.ts` já faz. API: `apps/api/src/modules/leagues/get-match/get-match.service.ts`. UI: novo bloco no domínio `match-detail` (`apps/web/features/leagues/components/match-detail/`, irmão de `form-guide.tsx`/`match-events.tsx`).

**Notas:** **par de cálculo com a W-019** — "último jogo do time antes desta data" é a mesma busca; vale o `/pl` planejar junto (uma query, dois consumos: dias de descanso + marcadores). **Ambiguidade de escopo (resolver no `/rs`/`/pl`):** "jogo anterior" = (a) o último jogo de **cada time** (forma/momento, assumido aqui) ou (b) o **último confronto direto** entre os dois (H2H) — são UIs diferentes; assumi (a) pela sinergia com a W-019, mas (b) é leitura válida e pode coexistir. **Mesmo gotcha da W-019:** só temos a **PL 25/26** ingerida — jogo de copa/seleção no meio de semana some, então "jogo anterior" pode pular um jogo que não enxergamos; mostrar com ressalva ou só dentro da liga. **Assumi ✨** pelo seu "seria legal".

### W-023 · Gols do jogador contra um adversário específico (casa/fora) · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-29 · status: ideia>

**O quê:** mostrar quantos gols um jogador já fez **contra um time específico** ("fazer gol *no* adversário"), com recorte **casa/fora** — o padrão de **freguês** ("o Salah adora pegar o United: 7 gols, 4 em casa, 3 fora"). É o split de gols da [[W-005]] com uma dimensão a mais: o adversário.

**Por quê:** desempenho contra um oponente fixo é insumo clássico de **props de marcador** (anytime/first scorer) — alguns jogadores têm "presa" recorrente, e isso não aparece no número agregado de gols. Some o mando (casa/fora) e fica leitura direta pra over/under de jogador. Conversa com a tese (perfil auditável que justifica a aposta).

**Depende de / esbarra em:** **zero schema, zero migração — derivável do que já existe.** Mesmo join `goal⋈match` do `getPlayerDetail` (`apps/api/src/modules/leagues/shared/shared.ts:264`) que a W-005/W-006 já usam: o **adversário** é o outro time da partida (`match.homeTeamId`/`awayTeamId` vs o `goal.teamId` do jogador) e o **mando** sai da mesma comparação. Só falta agrupar os gols por adversário e fatiar por casa/fora. Tangencia o `SIN-007` (rivalidade/ex-clube) mas é outro conceito — aqui é *freguês* (oponente preferido), não clássico/lei-do-ex.

**Notas:** **Família "recortes de gol derivados" com W-005 (casa/fora) e W-006 (1º/2º tempo)** — mesma fonte `goal`, mesma regra de excluir gol contra (`type != "own"`), zero schema; vale promover no mesmo balaio. **Gotcha grande (o motivo de ter sido cortado antes):** o `/rs` LIG-001 cortou o *split por adversário* como **ruído com 1 season** — com só a **PL 25/26** ingerida, um jogador pega cada adversário **no máx. 2x** (casa + fora), então "gols contra o time X" é amostra minúscula (0–2 jogos). Só vira sinal de verdade com **multi-season** (a mesma ingestão histórica que destrava a W-002/W-003/W-004). Mostrar sempre a contagem bruta + nº de confrontos; **não** transformar em taxa/% com 1 season. **Assumi ✨** pelo seu "seria legal".

### W-031 · Alerta de jogador com X gols/assists nos últimos Y jogos · ✨ · esforço G · `api` `ui`
<adicionada: 2026-06-29 · status: ideia · atualizada: 2026-06-29 (métrica gols pedida explicitamente)>

**O quê:** deixar o usuário **configurar um alerta** parametrizado — "me avisa quando o jogador X tiver **≥ N gols** (ou **≥ N assistências**) nos **últimos Y jogos**" — e ser avisado quando o jogador cruza esse limiar numa janela móvel de partidas. Lê como "fica de olho: o Haaland fez 5 gols nos últimos 4 jogos" / "o De Bruyne deu 4 assists nos últimos 5" no momento em que a marca bate. O alvo é o jogador; a **métrica** (gols, assists, e por extensão participação/minutos/nota), o **limiar N** e a **janela Y** são escolhidos pelo usuário.

**Por quê:** é um alerta de **forma/momento ofensivo** sobre dado estruturado que já temos — pega o jogador "quente" (sequência de gols ou de assistências) na hora em que a sequência se forma, insumo direto pra **props de marcador/assistente** (anytime scorer/assist) e leitura de over/under. Diferente dos outros alertas da família, não depende de notícia incerta nem de feed externo: gol e assistência são fatos auditáveis do nosso banco.

**Depende de / esbarra em:** **zero schema, zero migração no lado do DADO — a versão mais barata-de-dado da família de alertas.** Gol é a própria linha `goal` (excluindo gol contra, `type != "own"`) e assistência sai do `goal.assistId`, ambos no mesmo join `goal⋈match` que o `scorers.service.ts`/`loadTeamScorers` (`shared/shared.ts`) já fazem; a janela "últimos Y jogos" é o match-log por jogador que o LIG-001 (página do jogador, `getPlayerDetail` em `apps/api/src/modules/leagues/shared/shared.ts:264`) e o [[W-026]] (timeline de gols/assists no popover) já montam. **Não precisa de `ia`/NLP** (ao contrário da [[W-018]]) nem do feed estruturado de lesão (ao contrário da [[W-029]]). O que **falta é a infra de alerta** — a MESMA da [[W-017]]/[[W-018]]/[[W-020]]/[[W-029]]: persistência das preferências por-usuário (quem segue, qual métrica, N, Y), um job que recalcula a janela a cada sync e dispara na transição, e um canal de entrega. Pré-requisito de produto ainda inexistente: **conta/auth** (alerta é por-usuário) e o **canal** (in-app inbox? e-mail? push?). **Guardrail de compliance (OBRIGATÓRIO):** `docs/ui/design-system/conformidade-jogo-responsavel.md:230` proíbe push de urgência estilo "aposte agora" — o alerta é informativo (marca de forma batida), nunca gatilho de aposta.

**Notas:** **novo tipo de produtor na família de alertas** ([[W-017]] · [[W-018]] · [[W-020]] · [[W-029]]) — os outros disparam em **evento/evidência** (rumor saiu, desfalque, odd mexeu); este dispara num **limiar sobre janela móvel** de stat estruturado. É o produtor de **dado mais barato e confiável** do lote (fonte própria, sem `ia`, sem feed externo) — bom **primeiro a plugar** junto da [[W-029]] pra validar a máquina genérica de alerta. **Generaliza fácil:** "X _métrica_ nos últimos Y jogos" serve pra gols, assists, participação ([[W-015]]), minutos, MOTM ([[W-011]]) — vale o `/rs`/`/pl` desenhar o alerta como **(métrica, limiar, janela)**, não preso a uma métrica. **Gols e assists são as duas métricas canônicas pedidas explicitamente pelo João (2026-06-29)** — foram dois pedidos irmãos colapsados nesta entrada única (mesmo alerta, mesma infra, mesmos gotchas; só muda o `metric`). **Gotchas pro `/pl`:** (1) **gatilho na transição, não no estado** — dedupe pra não disparar a cada sync enquanto a condição persiste (alertar quando *cruza* N, rearmar quando cai abaixo), mesmo cuidado da [[W-029]]; (2) "últimos Y jogos" = jogos **do jogador** (em que entrou em campo, via `lineup_player`) ou jogos **do time**? Definir — um reserva não-utilizado não "joga" mas o time joga; (3) **só temos a PL 25/26 ingerida** e janela móvel atravessa rodadas — com Y grande perto do começo da season a janela fica curta; e jogo de copa/meio de semana some (mesma ressalva da [[W-019]]/[[W-021]]). **Esforço G** pela infra nova (o dado é o barato). **Assumi ✨** ("anota aí" / tom de capturar) — me fala se é 🔥.

## 💤 Anotando

### W-020 · Alerta de movimento de odds (por time + por mercado) · 💤 · esforço G · `dados` `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** deixar o usuário criar um alerta de **movimento de odds** parametrizado por **time** e por **tipo de mercado** (1X2, over/under, handicap…) — ser avisado quando a linha daquele time/mercado se mexer além de um limiar (caiu/subiu X% numa janela). É o terceiro irmão da família de alertas (W-017 rumores, W-018 evidências de notícia), agora sobre o **mercado**.

**Por quê:** movimento de odds é o exemplo **canônico** de alerta em tempo real do produto — a `docs/visao-geral.md:143` lista "movimento de odds" como o primeiro item da fase de alertas. Linha caindo/subindo é onde o dinheiro esperto aparece (validação de valor, steam move), e o apostador quer pegar isso **enquanto a janela está aberta**.

**Depende de / esbarra em:** **a mais cara do trio de alertas** — depende de uma stack de odds que **ainda não existe**. As âncoras `match_odds` e `odds_snapshots` estão **planejadas mas não implementadas** (grep no schema `apps/api/src/db/schemas` não acha odds; âncoras mapeadas em DOS-001/SIN-012/MOD-001). Detectar *movimento* exige **série temporal** de odds (snapshots ao longo do tempo), não um valor único — então o pré-requisito é todo o pipeline de captura+armazenamento de snapshots, **além** da infra de alerta da W-017/W-018 e da **conta/auth** por-usuário. **Primos analíticos:** `SIN-012` (camada de mercado e movimento de odds — *investigado*, P1) e `SIN-019` (steam moves, sharp vs square) — o alerta é o gatilho-pro-usuário em cima da mesma deteção de movimento.

**Notas:** **família de alertas (W-017 · W-018 · W-020)** — mesma máquina de alerta, produtores diferentes; W-020 puxa o produtor mais pesado (odds snapshots). **Guardrail de compliance é mais sensível aqui que nos outros dois:** "odd caindo" é exatamente o gatilho de FOMO que a `docs/ui/design-system/conformidade-jogo-responsavel.md:230` proíbe ("aposte de novo" / urgência) — desenhar como informação de mercado, jamais como chamariz pra apostar. **Pro `/rs`:** definir o que conta como "movimento" (delta absoluto vs %, qual janela, qual book de referência) — o `docs/investigacoes/steam-moves-sharp-vs-square.md` já tem o critério (direção igual + janela curta + origem em casa respeitada) pra distinguir steam real de ruído. **Assumi 💤** porque você disse "um possível alerta" (tom de só-anotando) — me fala se é ✨/🔥.

---

## 🗄️ Arquivadas (promovidas ou descartadas)

### W-027 · Snapshot da classificação dos dois times na página da partida · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-29 · status: promovido · promovido: 2026-06-29 → LIG-006>

**Promovida (2026-06-29 → LIG-006):** virou a feature **LIG-006 · Snapshot da classificação na página da partida** (`docs/features/ligas/LIG-006-classificacao-na-partida.md`). Caminho trivial: `loadTeamStanding(teamId)` (`shared/shared.ts:694`) já devolve o `TeamStanding` (posição/pts/V-E-D/saldo/zona) — `getMatch` chama p/ os dois times e o card na aba Fatos espelha o `RestSide` do LIG-005. Indo pro `/pl` → `/i`.

**O quê (original):** card com posição na tabela de mandante e visitante lado a lado (posição, pontos, saldo, V-E-D) na aba Fatos da página da partida, reusando a classificação que já existe.

### W-026 · Mini timeline de gols e assists por jogo no popover do jogador · ✨ · esforço P · `ui`
<adicionada: 2026-06-29 · status: feito · feito: 2026-06-29>

**Feito (2026-06-29):** **zero backend, zero migração** — derivado do que o `PlayerHoverCard` já carrega (`data.appearances`, com `goals`/`assists`/`opponent`/`opponentLogo`/`home` por jogo, mesma fonte do sparkline de notas). Nova seção **"Gols e assists · últimos 5"** no popover (`apps/web/features/leagues/components/player-hover-card/player-hover-card.tsx`), abaixo do sparkline de forma: tira de 5 células (uma por jogo, mais antigo→mais recente, mesma direção do sparkline), cada célula com **1 ícone de bola por gol + 1 ícone de chuteira por assist** (flex-wrap, traço quando o jogo foi em branco) e o **escudo do adversário** embaixo; o cabeçalho mostra os totais da janela (⚽ N · 👟 M, que também servem de legenda). Gate: só aparece pra quem tem `season.goals > 0 || season.assists > 0` (não polui card de goleiro). Leitura rápida de **forma ofensiva / produção recente** pra **props de marcador** (anytime/first scorer) e over/under de jogador.

**Decisões de design (iteradas ao vivo com o João):** começou como "bolinhas" coloridas (pips), mas (1) o destaque de cor no jogo mais recente (roxo vs verde) **confundia** — removido, recência já vem da posição + escudo; (2) virou **gols + assists** (não só gols) a pedido; (3) os SVGs caseiros de bola/chuteira ficaram feios a ~12px → trocados por **`ball-football` do Tabler (MIT)** pro gol + **`sport-shoe` do lucide (ISC, já instalado)** pro assist, ambos line-style num `StripIcon` comum (stroke 2, viewBox 24) pra parecerem um conjunto; tamanho ~12px na tira, 14px no cabeçalho. `typecheck` 3/3 + lint limpos. **Verificação visual feita pelo João ao vivo** (chrome-devtools não anexou — Chrome dele segura o profile do MCP, igual [[W-025]]).

**O quê (original):** no popover do jogador, um mini timeline pra saber quantos gols ele fez nos últimos 5 jogos, mostrando **quantos por jogo** (evoluiu pra incluir assists).

**Notas:** **enriquecimento direto do [[W-001]]** (o `PlayerHoverCard`), mesma família "destilação da forma recente" do LIG-001. Implementado direto da wishlist, **sem ID de feature** (precedente W-009/W-013/W-024/W-025). Na captura foram desenhados 3 mockups `.html` (barras / bolinhas / heatmap) — o João escolheu o de bolinhas, que evoluiu pros ícones. Aberto p/ depois: quando o "dossiê" do W-001 tiver nomes de jogador linkáveis, a tira já vale lá junto.

### W-022 · Card de artilheiros das equipes na página da partida · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-29 · status: feito · feito: 2026-06-29>

**Feito (2026-06-29):** **sem migração de schema** — derivado live de `goal⋈match`. Card **"Artilheiros"** no topo da aba **Gols (xG)** do `match-detail` (acima do timing da [[W-024]]): top-5 goleadores de cada equipe na season, lado a lado, com **gols (G) + assists (A)** por jogador, foto, link pro perfil e o `PlayerHoverCard`. Criado o agregador reutilizável **`loadTeamScorers(team, leagueCode, limit)`** em `shared/shared.ts` (escopado por `goal.teamId`, exclui gol contra, ranqueado por gols, `name` desempata) — a unidade que a [[W-015]] (squad table do time) vai reusar. Endpoint novo `GET /v1/matches/:id/scorers` (`get-scorers/`, padrão 1-rota-1-service) + hook `use-match-scorers-query.ts`. Tipos `MatchScorer`/`TeamScorers`/`MatchScorers` no contrato (`shared.ts` → `apps/api/src/index.ts` → web). **Caso de transferência validado:** Semenyo aparece sob o Bournemouth (não o Man City) porque `goal.teamId` conta gols feitos PELO clube — o split por time não vaza a transferência. Verificado no Chrome (Liverpool: Ekitiké 11G, Salah 7/7…; Bournemouth: Kroupi 13G…), console limpo, `typecheck` 3/3. Implementado **sem ID de feature** (precedente W-009/W-013/W-024).

**O quê (original):** na página da partida, card de marcadores com os principais goleadores de cada equipe na season (gols + assists, lado a lado) — prévia de "quem pode marcar".

**Notas:** **par com a [[W-021]]** (quem marcou no último jogo, *retrospectivo*) — W-022 é *prospectivo*; juntas + [[W-024]] (timing) fecham o contexto de gol do `match-detail`. O `loadTeamScorers` é o agregador único "marcadores por time" pra 3 superfícies (liga W-009 / time W-015 / partida W-022). Top-5 por equipe (lista curta com 1 season).

### W-007 · Estádio de cada partida · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: promovido · promovido: 2026-06-29 → LIG-004>

**Promovida (2026-06-29 → LIG-004, junto da [[W-008]]):** virou a feature **LIG-004 · Estádio (venue) com geo na página da partida** (`docs/features/ligas/LIG-004-venue-estadio-geo.md`, status `investigado`). O `/rs` confirmou por fetch na doc viva da SportMonks que o **venue vem completo por fixture** (`include=venue`, mesmo request do sync), com `name`/`city_name`/`capacity`/`surface`/`image_path`. Modelo: tabela `venue` própria (inglês), `match.venueId`. Investigação: `docs/investigacoes/venue-estadio-geo.md`.

**O quê (original):** registrar e exibir em qual estádio cada partida foi disputada — o venue do jogo, na página da partida.

### W-008 · Coordenadas (lat/lon) de cada estádio · 🔥 · esforço M · `dados`
<adicionada: 2026-06-28 · status: promovido · promovido: 2026-06-29 → LIG-004>

**Promovida (2026-06-29 → LIG-004, junto da [[W-007]]):** a dúvida-chave foi **respondida** — a SportMonks **devolve `latitude`/`longitude` (string) na própria entidade `venue`**, inclusas no include da fixture: **sem geocoding externo** (geocoding vira só plano B se a cobertura real vier furada). Coordenada entra como `numeric(9,6)` na tabela `venue`, insumo do sinal de viagem/fadiga (SIN-008), não display. Investigação: `docs/investigacoes/venue-estadio-geo.md`.

**O quê (original):** ter latitude/longitude de cada estádio, pra geolocalizar partidas — habilita distância de viagem, mapas e proximidade entre clubes.

### W-024 · Widget de gols por faixa de 15min na página da partida · 💤 · esforço M · `api` `ui`
<adicionada: 2026-06-29 · status: feito · feito: 2026-06-29>

**Feito (2026-06-29):** **sem migração de schema** — derivado live de `goal⋈match`. Virou o card **"Gols por faixa de 15'"** na aba **Gols (xG)** do `match-detail`, e foi **além do escopo original** em duas frentes: (1) o **espelho ofensivo** já previsto nas notas — o card mostra os DOIS lados por faixa de cada time (gols **marcados** em verde + **sofridos** em vermelho), cada métrica normalizada pelo próprio total com minuto conhecido; (2) o **recorte de mando Todos/Casa/Fora** (pedido nesta sessão) — toggle no topo-direito do card que refaz o perfil só com os jogos em casa / fora, com o corte aplicado igual aos dois times (mesma semântica do `form`). API: `loadGoalTiming(home, away, leagueCode, side)` em `shared/shared.ts` (predicado `inCut` filtra por mando) + `GET /v1/matches/:id/goal-timing?side=all|home|away`, validado no edge (TypeBox `UnionEnum` → 422). Web: `goal-timing.tsx` (toggle via `CardAction`, slot top-right do grid do shadcn) + `use-match-goal-timing-query.ts` (`side` na queryKey + `keepPreviousData` pra não piscar no toggle). Verificado no Chrome (Liverpool×Bournemouth): decomposição exata casa+fora=total (19+19=38 jogos, 34+29=63 marcados, 20+33=53 sofridos), 3 requests `side=` 200, console limpo, `typecheck` 3/3. Implementado **sem ID de feature** (precedente W-009/W-013/W-025); o comentário do componente carimba `W-024`. **Perna de UI do `SIN-017`** (game-state e timing de gols).

**O quê (original):** na página da partida, a distribuição temporal dos gols (concedidos e marcados) de cada equipe na season, em faixas de 15 minutos — perfil de timing pro over/under por tempo.

**Notas:** par natural com a [[W-022]] (card de artilheiros na partida): W-022 = *quem* marca, W-024 = *quando* se marca/toma. O espelho ofensivo previsto saiu de graça do mesmo agregado. Gotcha de acréscimos (45+2 / 90+3 → `timingBucket`) herdado da [[W-006]]. Amostra: ~38 jogos/time (19 por mando) — ok pra distribuição, contagem sempre ao lado do %.

### W-001 · Tooltip de jogador no hover (stats da season) · 🔥 · esforço M · `ui` `dados`
<adicionada: 2026-06-28 · status: feito · feito: 2026-06-29>

**Feito (2026-06-29):** `PlayerHoverCard` (`apps/web/features/leagues/components/player-hover-card/`) — HoverCard (Radix/shadcn do `@workspace/ui`) que, no **primeiro hover**, faz lazy-fetch do jogador (reusa `GET /v1/players/:id` via `usePlayerQuery(id, enabled)` — o 2º arg defere o fetch ao hover; **zero backend, zero migração**) e mostra foto, clube, posição, os totais da season (jogos/gols/assists + nota média colorida por `ratingColor`) e um **sparkline SVG** das notas das últimas 10 partidas (escala ≥7.5 verde · ≥6.5 neutro · <6.5 vermelho, igual ao `RatingChart`; último ponto destacado). SVG manual em vez de ECharts de propósito — numa tooltip que abre/fecha, init+dispose de canvas a cada hover é caro. Cache do React Query compartilhado por id entre todas as menções. Plugado nas **5 superfícies** que mencionam jogador: gols + assistências + cartões (`match-events`), escalação (`lineup`), desfalques (`absences`) e marcadores da liga (`scorers-table`, dentro do Virtuoso). Verificado no Chrome nas 5 (Eze, Dan Burn, Saliba, Mikel Merino, Haaland), layout intacto, console sem erros novos, typecheck + lint 0 erros. Implementado direto da wishlist, **sem ID de feature** (precedente W-009/W-013/W-014). O "dossiê" citado abaixo ainda não tem nomes de jogador linkáveis — quando tiver, é só envolver o link com `<PlayerHoverCard id>`.

**O quê:** ao passar o mouse sobre o nome de um jogador (escalação, dossiê, lista), abrir uma tooltip com um resumo da season dele: gols, assists e um mini-gráfico de performance (sparkline) baseado nas notas por partida.

**Por quê:** dá contexto na hora sem tirar o usuário da tela — quem lê o dossiê entende rápido "esse cara tá em forma?" pelas notas recentes. Polimento de UX que conversa com a tese de transparência (o número aparece junto do nome, auditável).

**Depende de / esbarra em:** gols/assists por jogador **já existem** (derivados da tabela `goal`, `getPlayerDetail` em `apps/api/src/modules/leagues/shared/shared.ts:264`, já no front via `use-player-query.ts`). **CORREÇÃO (2026-06-28, `/rs` LIG-001):** a série de notas por partida **JÁ ESTÁ INGERIDA** — `lineup_player.rating` (type 118) em `apps/api/src/db/schemas/leagues.ts:171`. A premissa antiga ("rating não ingerido") está **refutada**; o sparkline é UI/agregação pura, sem migração.

**Notas:** decidir o componente de tooltip (Radix/shadcn já no `@workspace/ui`) e a lib do sparkline (SVG manual + `d3-scale` é o recomendado pra sparkline pequena — ver `docs/investigacoes/pagina-do-jogador.md`). **Coberta pela investigação LIG-001** (a tooltip é uma destilação da seção "forma recente" da página do jogador). Tanto (1) gols/assists quanto (2) sparkline de notas são entregáveis HOJE — o dado já está no banco.

### W-025 · Data e placar por tempo no popover da forma · ✨ · esforço P · `api` `ui`
<adicionada: 2026-06-29 · status: feito · feito: 2026-06-29>

**Feito (2026-06-29):** **sem migração de schema.** Descoberta-chave: o **half-time já existia no contrato** (`Score.ht`, populado por `serializeMatch` a partir das colunas `htHome/htAway` do `match`) — não precisou derivar de `goal.minute`. API: o `FormResult` (`apps/api/src/modules/leagues/shared/shared.ts`) ganhou `date` + `htGoalsFor`/`htGoalsAgainst` (perspectiva do time, null quando a fonte não tem HT), preenchidos no `formResult()`. Web: o popover (`form-guide.tsx` `Chip`/`HoverCardContent`) virou coluna — **linha 1** placar final, **linha 2** "1º tempo X-Y", **linha 3** "2º tempo X-Y" (2º tempo = FT − HT), **linha 4** data + "há N dias". Helper `daysAgo()` novo em `utils/format.ts` (`differenceInCalendarDays` + parse local pra evitar off-by-one de fuso; "hoje"/"ontem"/"há N dias"). Tipos fluíram do `@workspace/api` pro web sem duplicação. `typecheck` 3/3. Verificação visual feita **pelo João ao vivo** (chrome-devtools não anexou — Chrome dele segurava o profile do MCP); iterou layout (colunas→linhas empilhadas) e formato.

**Bug latente pego de brinde:** a data no popover revelou que os chips de forma estavam em ordem **antigo→recente** (mais recente à direita). O João quis **mais recente à esquerda** → removido o `[...recent].reverse()` do `FormChips` (a API já devolve `recent` most-recent-first, confirmado batendo no endpoint `/v1/matches/:id/form`). **Toca 3 superfícies** que compartilham `FormChips`: página da partida, classificação (`standings-table.tsx`) e página do time (`team-detail.tsx` via `FormGuide`).

**O quê (original):** enriquecer o popover (HoverCard) do chip de forma (V/E/D) na página da partida com a data do jogo, o "há X dias" e o placar por tempo (1º/2º tempo).

**Notas:** **enriquecimento direto do `form-guide.tsx`** — mesma família "contexto da partida" da [[W-021]]/[[W-022]]/[[W-024]]. Implementado direto da wishlist, **sem ID de feature** (precedente W-009/W-013). Gotcha resolvido: o "2º tempo" sai por subtração (FT − HT) já que o FT é o placar grande; quando a fonte não tem HT, as linhas de tempo simplesmente não aparecem.


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
