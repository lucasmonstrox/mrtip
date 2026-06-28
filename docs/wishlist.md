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

**Depende de / esbarra em:** gols/assists por jogador **já existem** (derivados da tabela `goal`, `getPlayerDetail` em `apps/api/src/modules/leagues/shared/shared.ts:261`, já no front via `use-player-query.ts`). A **série de notas por partida NÃO está ingerida** — schema só tem `goal`/`injury`/`lineup`/`lineupPlayer`, sem coluna de rating (`apps/api/src/db/schemas/leagues.ts`). Esbarra nos sinais de jogador (`SIN-001`..`SIN-004`, dossiê `DOS-001`), mesma âncora de ingestão.

**Notas:** decidir o componente de tooltip (Radix/shadcn já no `@workspace/ui`) e a lib do sparkline (algo leve, sem Recharts pesado). **Achado (2026-06-28, SocratiCode):** a feature parte em duas — (1) tooltip com gols/assists = UI quase pura, dado já existe; (2) sparkline de notas = exige antes ingerir `rating` por partida da SportMonks (`dados`). Promover a (1) sozinha é um quick win; a (2) depende da migração de schema.

### W-002 · Histórico de clubes por season na página do jogador · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do jogador, mostrar por qual clube ele jogou em cada season (linha do tempo de carreira / histórico de transferências), não só os dados da season atual.

**Por quê:** dá profundidade ao perfil e alimenta contexto de aposta — "esse cara acabou de chegar", "voltou ao ex-clube". Conversa com a tese (perfil auditável do jogador) e é paridade básica de qualquer site de stats.

**Depende de / esbarra em:** a página do jogador já existe (`getPlayerDetail`, `apps/api/src/modules/leagues/shared/shared.ts:264`), mas só tem gols/assists/desfalques **derivados da season corrente** — não há histórico de clube/transferência no schema (tabela `player` é mínima). **Mesma âncora de dados do `SIN-007` (lei do ex / rivalidade):** `docs/regras/rivalidade.md` já mapeou as fontes de histórico de transferências — transfermarkt-datasets (`transfers`+`appearances`), API-Football `/transfers`, worldfootballR, Wikidata P54. Ingerir isso destrava as DUAS features.

**Notas:** **Sinergia forte com `SIN-007`** — o mesmo unlock de dados (ingestão de histórico de transferências) serve pro sinal de rivalidade E pra esse histórico de UI; vale planejar junto. **Aberto:** SportMonks tem histórico de transferências/career por jogador? Se sim, é a fonte natural (já é a fonte única do projeto) e evita trazer transfermarkt; conferir no `/rs`.

### W-003 · Jogos disputados por season na página do jogador · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do jogador, mostrar quantos jogos (appearances) ele disputou em cada season — uma quebra por temporada, não só o agregado da season atual.

**Por quê:** medida básica de presença/regularidade do jogador, e base pra contextualizar gols/assists (taxa por jogo). Paridade de qualquer perfil de jogador; complementa o histórico de clubes (W-002).

**Depende de / esbarra em:** página do jogador já existe (`getPlayerDetail`, `apps/api/src/modules/leagues/shared/shared.ts:264`), mas hoje só conta eventos da season corrente — **não há contagem de appearances por season no schema**. O dado de appearances é a mesma tabela (`appearances` do transfermarkt-datasets, ou stats de season da SportMonks) já mapeada na ingestão da W-002 / `SIN-007`.

**Notas:** **Família "página do jogador por season" — W-001 (stats), W-002 (clubes), W-003 (jogos), W-004 (minutos) — todas presas no MESMO gargalo:** a página só tem dados derivados da season atual; falta um modelo de stats de jogador **por season**. Provavelmente uma única feature de dados ("season stats por jogador": appearances, minutos, gols, assists, notas, clube) destrava todas de uma vez. **Forte candidata a `/rs` único** que cubra a família inteira em vez de promover uma a uma.

### W-004 · Minutos jogados por season na página do jogador · 🔥 · esforço M · `dados` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** na página do jogador, mostrar quantos minutos ele jogou em cada season — quebra por temporada, par natural da contagem de jogos (W-003).

**Por quê:** minutos é a medida fina de uso real (titular x reserva x entrou no fim), melhor que só "jogos". Base pra normalizar stats por 90min (gols/90, etc.) e contextualizar forma/carga. Paridade de perfil de jogador.

**Depende de / esbarra em:** mesma dependência das irmãs — página do jogador existe (`getPlayerDetail`, `apps/api/src/modules/leagues/shared/shared.ts:264`), mas **não há minutos por season no schema**. Minutos vêm do stat de season da SportMonks ou de `appearances` (transfermarkt) — mesma ingestão da W-002/W-003/`SIN-007`.

**Notas:** parte da **família "página do jogador por season"** (W-001..W-004); o `/rs` único de "season stats por jogador" deve incluir `minutes` no modelo. Minutos por 90 é o denominador que torna os outros números comparáveis — não tratar como campo solto.

### W-005 · Split de gols casa/fora do jogador · 🔥 · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** mostrar quantos gols o jogador fez em casa vs fora — o total de gols dividido por mando de campo.

**Por quê:** padrão casa/fora é sinal clássico pra props de jogador (artilheiro que só engrena em casa) e conversa direto com a tese de over/under e mercados de jogador. Recorte simples com leitura imediata.

**Depende de / esbarra em:** **NÃO depende do unlock de season stats (W-001..W-004).** É derivável do que já existe: `goal.teamId` (time que marcou) vs `match.homeTeamId`/`awayTeamId` → casa se iguais, fora se não. O `getPlayerDetail` (`apps/api/src/modules/leagues/shared/shared.ts:264`) já faz o join `goal`→`match`; falta só adicionar a contagem fatiada por mando.

**Notas:** **a ovelha fora do rebanho — quick win real.** Diferente das W-001..W-004, o dado já está no banco; é só uma agregação a mais no `getPlayerDetail` + 2 números na UI. Escopo atual = season corrente (igual aos gols/assists de hoje); se um dia houver season stats por jogador, o split casa/fora pode ganhar a quebra por season de brinde. **Promotível sozinha sem esperar a família.** Par natural com a W-006 (split de gols por tempo) — mesma natureza de agregação.

### W-006 · Split de gols 1º tempo / 2º tempo do jogador · 🔥 · esforço P · `api` `ui`
<adicionada: 2026-06-28 · status: ideia>

**O quê:** mostrar quantos gols o jogador fez no 1º tempo vs 2º tempo — total de gols dividido pelo tempo da partida em que saíram.

**Por quê:** padrão de timing de gol é insumo pra mercados de over/under por tempo e props de jogador ("marca cedo?"). Recorte com leitura imediata e direto na tese.

**Depende de / esbarra em:** **derivável do que já existe** (igual W-005, sem migração): `goal.minute` já é selecionado no `getPlayerDetail` (`apps/api/src/modules/leagues/shared/shared.ts:264`) → 1º tempo = `minute ≤ 45`, 2º tempo = `minute > 45`. Só falta a agregação + os 2 números na UI.

**Notas:** **par com W-005 — micro-família "recortes de gol derivados" (casa/fora + tempo), ambas quick wins `api`+`ui` sem tocar schema.** Valem ser promovidas juntas numa feature só ("breakdowns de gol do jogador"). **Gotcha pro `/pl`:** acréscimos — como a SportMonks codifica o minuto de um gol aos 45+2 / 90+3? Se `goal.minute` guarda 45 ou 90 (sem o extra) o corte por `≤45` funciona; se guarda 47/93, ainda funciona; confirmar a convenção antes de cravar o limiar.

## ✨ Seria legal

_(vazio)_

## 💤 Anotando

_(vazio)_

---

## 🗄️ Arquivadas (promovidas ou descartadas)

_(vazio)_
