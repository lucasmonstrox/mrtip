# Modelagem de dados — domínio futebol (ligas, partidas, lances, copas)

> **As-of:** 2026-06-21. Documento de **design do modelo de dados canônico** do mrtip para o domínio futebol: ligas/competições, temporadas, estágios/fases, rodadas, grupos, copas e mata-mata (ida-volta + agregado + pênaltis), playoffs, partidas, escalações, substituições, cartões, gols, estádios, classificação, odds, predições e xG.
>
> **Método:** derivado da engenharia reversa do modelo de dados de 5 fontes já investigadas em [docs/research/apis-futebol.md](research/apis-futebol.md) — **API-Football (API-Sports v3)**, **Sportmonks v3**, **API Futebol (BR)**, **football-data.org v4 + openfootball/football.db**, e **The Odds API + TheSportsDB**. Onde as fontes divergem, a decisão canônica está marcada com **[cravado]** + rationale.
>
> **Relacionado:** [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](investigacoes/dossie-por-partida-fontes-de-dados.md) (camada de dossiê/proveniência/snapshot, que consome este modelo) e a feature [DOS-001](features/dossie/DOS-001-dossie-por-partida.md). Este arquivo é o **esqueleto canônico estrutural**; a camada de proveniência multi-fonte (`observation`, `dossier_snapshot`, `pick`) vive lá.

---

## 0. TL;DR das decisões cravadas

1. **Hierarquia de 5 níveis + Confronto (agregado) como irmão do Estágio** — `Competição → Temporada → Estágio → (Rodada | Grupo) → Partida`, com `Confronto` ligando as duas pernas de um mata-mata ida-volta. Toda partida é uma linha plana de FKs anuláveis (`rodada_id`, `grupo_id`, `confronto_id` todos nullable). É isso que faz **uma única tabela `partida`** servir pontos-corridos, grupos e mata-mata sem polimorfismo de tabela. *(Base: Sportmonks; API Futebol BR confirma com `fase` + `chaves`.)*
2. **O formato mora no Estágio, não na Competição** — `estagio.formato ∈ {pontos_corridos, grupos, mata_mata, qualificatoria}`. Copa do Brasil e Libertadores **misturam formatos numa mesma temporada**, então um booleano `is_cup` na competição é insuficiente. *(Base: `fase.tipo` da API Futebol BR; `stage.type_id` 223/224/225 da Sportmonks.)*
3. **Mata-mata ida-volta = entidade `Confronto` explícita** — porque **nenhuma das APIs baratas modela o agregado** (API-Football, football-data.org e openfootball emitem 2 partidas soltas e deixam o agregado por sua conta). Reconstruímos isso de qualquer jeito, então é first-class aqui. *(Base: `Aggregate` da Sportmonks + `chaves` da API Futebol BR.)*
4. **Placar com quebra explícita por período + `decidido_em`** — guardar intervalo / tempo normal (90') / prorrogação / pênaltis separadamente, mais `decidido_em ∈ {tempo_normal, prorrogacao, penaltis}` e `vencedor`. Unifica `score.{halftime,fulltime,extratime,penalty}` (API-Football), `duration/regularTime` (football-data.org), `ht/ft/et/p` (openfootball) e `disputa_penalti` (API Futebol BR).
5. **Log único de eventos** (`evento_partida`) com `tipo` + `detalhe` enums, ordenado por `ordem` (não por minuto). Cartões e substituições são linhas desse log, não tabelas separadas. *(Base: `/fixtures/events` da API-Football e `events` da Sportmonks; achatamos os objetos `gols`/`cartoes`/`substituicoes` da API Futebol BR na ingestão.)*
6. **Modelo source-agnostic + `entity_xref`** — entidades canônicas com ID interno estável; uma tabela de crosswalk reconcilia IDs de cada fonte. API-Football é a espinha do MVP; Sportmonks entra para xG/profundidade; The Odds API entra por **join de nome** (não tem ID). *(Base: recomendação da DOS-001.)*
7. **Enums nativos do Postgres** para os conjuntos pequenos e estáveis (status, formato, tipo de evento, cor de cartão...), **não** o catálogo dinâmico `type_id` da Sportmonks — mapeamos os `type_id` dela para nossos enums na ingestão.
8. **Odds/cotações em inteiro (centésimos)** via `@workspace/core/money`; datas como `timestamptz`, instante canônico via epoch, interpretação na borda em `America/Sao_Paulo` com `date-fns-tz`. *(Convenção do repo + DOS-001.)*

> **Convenção de implementação (CLAUDE.md):** o **schema Zod é source of truth**; os tipos saem por `z.infer` centralizados em `types/`. As DDLs SQL abaixo são o alvo de persistência (Postgres + JSONB híbrido, ver DOS-001); cada entidade ganha um schema Zod espelho. Nomes de tabela/coluna em `snake_case`, em português de domínio.

---

## 1. Por que essa forma — síntese cruzada das 5 fontes

| Decisão de modelagem | API-Football v3 | Sportmonks v3 | API Futebol (BR) | football-data.org v4 | openfootball |
|---|---|---|---|---|---|
| Liga vs copa | `league.type` = `League`/`Cup` | `league.sub_type` (`domestic`, `domestic_cup`, `cup_international`...) | `campeonato.tipo` = `Pontos Corridos`/`Mata-Mata`/`Misto` | `competition.type` = `LEAGUE`/`CUP`/`LEAGUE_CUP`/`PLAYOFFS` | implícito no arquivo |
| Formato da fase | só string de `round` | `stage.type_id` 223/224/225 | **`fase.tipo`** = `pontos-corridos`/`grupos`/`mata-mata` | `match.stage` enum | header `▪` |
| Rodada/fase | string `"Regular Season - 30"` / `"Quarter-finals"` | entidade `Round` + `Stage` | entidade `rodada` + `fase` | `matchday` int + `stage` enum | `"Matchday N"` / `"Round of 16"` |
| Grupo | `standings[]` aninhado + `group` na linha | entidade `Group` + `group_id` | array `grupos` + `partida.grupo` string | `match.group` = `GROUP_A..L` | `▪ Group A` |
| Ida-volta agregado | **não modela** (2 fixtures) | **`Aggregate`** + `aggregate_id` + `leg` | **`chaves`** (`partida_ida`/`partida_volta`) | **não modela** (2 matches) | **não modela** (2 linhas) |
| Pênaltis | `score.penalty` | `scores` desc=`PENALTIES` | `disputa_penalti` (com `cobrancas[]`) | `score.penalties` + `duration` | `X-Y pen.` inline |
| Eventos (cartão/sub) | log `/fixtures/events` (`type`+`detail`) | log `events` (`type_id`+`sub_type_id`) | objetos separados `gols`/`cartoes`/`substituicoes` | arrays `bookings`/`substitutions`/`goals` | `goals1`/`goals2` |
| Estádio | `venue` (com `surface`) | `venues` (com `surface`, lat/long) | só `{estadio_id, nome_popular}` | só `venue` (nome string) | — |
| xG | **não tem** | add-on (`type_id` 5304/5305) | não tem | não tem | não tem |
| Predições | `/predictions` (modelo próprio) | add-on `/predictions` | não tem | não (add-on limitado) | não |

**Leitura:** a forma mais robusta é a da **Sportmonks** (hierarquia normalizada + agregado), validada pela **API Futebol BR** (que usa exatamente `fase → chaves/grupos/rodadas`). As APIs baratas (API-Football, football-data, openfootball) são *casos degenerados* dessa forma — basta normalizar strings de rodada para nossas entidades na ingestão. Adotamos a forma rica como canônica e fazemos os adaptadores convergirem para ela.

---

## 2. Diagrama do modelo canônico

```
pais ─< cidade ─< estadio
                     │
competicao ─< temporada ─< estagio ─┬─< rodada ─┐
                                    ├─< grupo ──┤
                                    └─< confronto│   (mata-mata ida/volta)
                                                 │
            time ──┐                             ▼
            ├──────┴──────────────────────────< partida >── estadio (sede, pode ser neutra)
            │                                    │  │  │
            │              ┌─────────────────────┘  │  └────────────┐
            │              ▼                         ▼               ▼
            │        placar_periodo            escalacao ─< escalacao_jogador
            │        (HT/90'/ET/PEN)                │
            │                                  evento_partida (gol/cartao/sub/var/penalti)
            ├──< classificacao (por temporada/estagio/grupo) >── time
            │
            ├──< time_jogador (elenco por temporada)  ── jogador
            └──< odds_mercado ─< odds_cotacao         (por casa, por mercado)

entity_xref  (id_canonico ↔ fonte/id_externo, qualquer entidade)
partida_predicao / partida_xg   (snapshots por fonte, point-in-time)
```

---

## 3. Geografia e estádios

### 3.1 `pais`, `cidade`

Hierarquia geográfica simples (football-data.org modela `Area` com `parentArea`; Sportmonks tem `country_id`/`city_id`). Mínimo viável:

```sql
pais (
  id            bigserial PRIMARY KEY,
  nome          text NOT NULL,
  codigo_iso2   char(2),            -- "BR"; null para "World"/continental
  bandeira_url  text
);

cidade (
  id        bigserial PRIMARY KEY,
  pais_id   bigint NOT NULL REFERENCES pais(id),
  nome      text NOT NULL,
  uf        text                    -- útil para estaduais BR (SP, RJ, MG...)
);
```

### 3.2 `estadio` (venue)

Fonte mais rica de estádio é **TheSportsDB** (`strLocation`, `strCountry`, `strTimezone`, `intCapacity`, `strMap`) e **Sportmonks** (`latitude`/`longitude`, `capacity`, `surface`). **API-Football** tem `surface`; **API Futebol BR** só dá `{estadio_id, nome_popular}`.

> ⚠️ `surface` (tipo de gramado) existe em API-Football e Sportmonks, mas **TheSportsDB não expõe** — não modelar feature dependendo só de TheSportsDB. Capacidade e localização viabilizam as teses de mando/viagem (ver [[teoria-ressaca-meio-de-semana]] e regras de clima/fadiga).

```sql
estadio (
  id            bigserial PRIMARY KEY,
  cidade_id     bigint REFERENCES cidade(id),
  nome          text NOT NULL,
  nome_popular  text,
  apelido       text,
  capacidade    int,
  superficie    text,              -- "grama natural" | "sintético" | null
  latitude      numeric(9,6),      -- Sportmonks devolve como string; converter
  longitude     numeric(9,6),
  fuso          text,              -- IANA, ex "America/Sao_Paulo" (TheSportsDB)
  imagem_url    text
);
```

---

## 4. Competição, temporada, estágio, rodada, grupo, confronto

Este é o coração da modelagem. **O formato mora no estágio.**

### 4.1 `competicao`

```sql
competicao (
  id              bigserial PRIMARY KEY,
  pais_id         bigint REFERENCES pais(id),     -- null para continental/mundial
  nome            text NOT NULL,                  -- "Campeonato Brasileiro Série A"
  nome_popular    text,                           -- "Brasileirão"
  slug            text UNIQUE,
  tipo            competicao_tipo NOT NULL,       -- ver enum abaixo
  ambito          competicao_ambito NOT NULL,     -- nacional|estadual|continental|mundial|amistoso
  genero          text DEFAULT 'masculino',
  logo_url        text
);
```

```sql
-- [cravado] funde league.type (API-Football), sub_type (Sportmonks) e campeonato.tipo (BR)
CREATE TYPE competicao_tipo AS ENUM (
  'liga',          -- pontos corridos puro (Brasileirão, Premier League)
  'copa',          -- mata-mata / misto nacional (Copa do Brasil)
  'copa_int',      -- copa internacional (Libertadores, Sul-Americana, Champions)
  'liga_int',      -- liga internacional de seleções (Copa do Mundo, Copa América)
  'amistoso'
);
CREATE TYPE competicao_ambito AS ENUM (
  'nacional','estadual','regional','continental','mundial','amistoso'
);
```

> **Nota:** `competicao.tipo` é só um rótulo de topo (como o `Misto` da API Futebol BR para a Copa do Brasil). A verdade operacional de "como renderizar/calcular" está em `estagio.formato`.

### 4.2 `temporada` (season / edição)

```sql
temporada (
  id              bigserial PRIMARY KEY,
  competicao_id   bigint NOT NULL REFERENCES competicao(id),
  rotulo          text NOT NULL,         -- "2026" ou "2025/2026"
  ano             int,                   -- chave junto com competicao (API-Football usa league+season)
  inicio          date,
  fim             date,
  atual           boolean DEFAULT false, -- season.is_current / coverage.current
  finalizada      boolean DEFAULT false,
  campea_time_id  bigint REFERENCES time(id),
  -- [cravado] cobertura é por (competição, temporada), não por competição (API-Football coverage)
  cobertura       jsonb,                 -- {eventos, escalacoes, stats, predicoes, odds, standings}
  UNIQUE (competicao_id, ano)
);
```

> **Por que `cobertura` na temporada:** na API-Football os flags `coverage.fixtures.lineups`, `coverage.predictions`, `coverage.odds` etc. variam **por temporada** — divisões inferiores brasileiras (Série C/D) frequentemente têm cobertura parcial. Checar antes de assumir que existem escalações/eventos.

### 4.3 `estagio` (stage / fase) — **onde mora o formato**

```sql
estagio (
  id              bigserial PRIMARY KEY,
  temporada_id    bigint NOT NULL REFERENCES temporada(id),
  nome            text NOT NULL,          -- "Fase única", "Fase de Grupos", "Oitavas de Final", "Final"
  slug            text,
  formato         estagio_formato NOT NULL,
  ordem           int NOT NULL,           -- sort_order: sequência dentro da temporada
  eliminatorio    boolean DEFAULT false,  -- fase.eliminatorio (BR)
  ida_e_volta     boolean DEFAULT false,  -- fase.ida_e_volta (BR)
  decisivo        boolean DEFAULT false,  -- fase.decisivo: é a fase que define o campeão?
  gera_tabela     boolean DEFAULT false,  -- pontos_corridos/grupos => true; mata_mata => false
  proximo_estagio_id bigint REFERENCES estagio(id),  -- encadeia o mata-mata (proxima_fase)
  inicio          date,
  fim             date
);
```

```sql
-- [cravado] mapeia fase.tipo (BR) e stage.type_id 223/224/225 (Sportmonks)
CREATE TYPE estagio_formato AS ENUM (
  'pontos_corridos',  -- round-robin (gera tabela)        ~ REGULAR_SEASON
  'grupos',           -- fase de grupos (gera tabela/grupo) ~ GROUP_STAGE (223)
  'mata_mata',        -- eliminatório                       ~ KNOCK_OUT (224)
  'qualificatoria'    -- pré-fase / qualifying              ~ QUALIFYING (225)
);
```

> Estágios não-aplicáveis a um formato simplesmente não existem para aquela temporada. A API Futebol BR co-retorna `rodadas`/`grupos`/`chaves` num mesmo objeto de fase, com os não-aplicáveis em `[]`; na ingestão escolhemos o que preencher pelo `formato`.

### 4.4 `rodada` (round / matchday)

```sql
rodada (
  id              bigserial PRIMARY KEY,
  estagio_id      bigint NOT NULL REFERENCES estagio(id),
  nome            text NOT NULL,          -- "1ª Rodada" / "Regular Season - 30" / "Semifinais"
  numero          int,                    -- matchday (null em mata-mata sem numeração)
  fase_eliminatoria fase_eliminatoria,    -- preenchido quando o estágio é mata_mata/grupos-knockout
  inicio          date,
  fim             date
);
```

```sql
-- [cravado] taxonomia canônica de fase, baseada no enum `stage` da football-data.org v4
-- (cobre Copa do Brasil, Libertadores e mata-matas estaduais)
CREATE TYPE fase_eliminatoria AS ENUM (
  'preliminar','qualificatoria_1','qualificatoria_2','qualificatoria_3',
  'fase_de_grupos',
  'rodada_1','rodada_2','rodada_3','rodada_4',         -- fases iniciais Copa do Brasil
  'trigesima_segunda','dezasseis_avos',                -- LAST_64 / LAST_32
  'oitavas','quartas','semifinal','disputa_terceiro','final',
  'apertura','clausura','grupo_campeonato','grupo_rebaixamento'  -- formatos sul-americanos/split
);
```

> Em pontos-corridos, `fase_eliminatoria` é `null` e usamos `numero` (1..38). Em mata-mata, `numero` costuma ser `null` e usamos `fase_eliminatoria`. As fontes que só dão string (`"Quarter-finals"`, `"Oitavas de Final"`) são parseadas para esse enum na ingestão.

### 4.5 `grupo`

```sql
grupo (
  id           bigserial PRIMARY KEY,
  estagio_id   bigint NOT NULL REFERENCES estagio(id),  -- grupo pertence a um estágio de formato 'grupos'
  nome         text NOT NULL                            -- "Grupo A" ... "Grupo H"
);
```

### 4.6 `confronto` (aggregate / chave) — **mata-mata ida-volta**

```sql
-- [cravado] entidade explícita porque API-Football/football-data/openfootball NÃO modelam o agregado.
-- Espelha o Aggregate da Sportmonks + a `chave` (partida_ida/partida_volta) da API Futebol BR.
confronto (
  id                  bigserial PRIMARY KEY,
  estagio_id          bigint NOT NULL REFERENCES estagio(id),
  nome                text,                 -- "Chave 1" / "Flamengo x Palmeiras"
  -- agregado é DERIVADO das partidas (soma gols), mas materializamos para consulta:
  placar_agg_a        int,
  placar_agg_b        int,
  decidido_em         partida_decidido_em,  -- tempo_normal | prorrogacao | penaltis | gol_qualificado
  vencedor_time_id    bigint REFERENCES time(id)
);
```

> **Regra de agregação:** cada perna é uma `partida` independente com `confronto_id` e `perna ∈ {1,2}`. O agregado é a soma dos placares de tempo normal (+ prorrogação na 2ª perna quando houver), com desempate por `disputa_penalti` da 2ª perna. **Materializamos** `placar_agg_*` + `vencedor_time_id` para não recomputar em toda leitura — recalculado quando uma perna fecha. Jogo único (final em jogo único, fases iniciais da Copa do Brasil) = `confronto` com 1 partida e `perna=1`.

---

## 5. Times, jogadores, técnicos

### 5.1 `time`

```sql
time (
  id              bigserial PRIMARY KEY,
  nome            text NOT NULL,          -- "Sociedade Esportiva Palmeiras"
  nome_popular    text,                   -- "Palmeiras"
  sigla           text,                   -- "PAL" (3 letras / tla)
  apelido         text,                   -- "Verdão"
  pais_id         bigint REFERENCES pais(id),
  fundacao        int,                    -- ano
  selecao         boolean DEFAULT false,  -- national team? (API-Football team.national)
  estadio_id      bigint REFERENCES estadio(id),  -- mando padrão (pode diferir da sede da partida)
  escudo_url      text,
  cor_primaria    text,                   -- TheSportsDB strColour1 (hex) — útil p/ UI
  cor_secundaria  text
);
```

### 5.2 `jogador`

```sql
jogador (
  id            bigserial PRIMARY KEY,
  nome          text NOT NULL,            -- completo
  nome_popular  text,
  posicao       posicao_jogador,          -- GOL|DEF|MEI|ATA (canônico)
  posicao_det   text,                     -- "Zagueiro Direito" / "Centre-Forward" (detalhe)
  nascimento    date,
  nacionalidade text,
  altura_cm     int,
  foto_url      text,
  foto_recorte_url text                    -- TheSportsDB strCutout (PNG transparente p/ cards)
);

CREATE TYPE posicao_jogador AS ENUM ('GOL','DEF','MEI','ATA','DESCONHECIDA');
```

### 5.3 `tecnico` e elenco por temporada

```sql
tecnico (
  id     bigserial PRIMARY KEY,
  nome   text NOT NULL,
  nome_popular text,
  nascimento date,
  nacionalidade text,
  foto_url text
);

-- elenco: vínculo jogador↔time por temporada (squad/runningCompetitions)
time_jogador (
  id            bigserial PRIMARY KEY,
  time_id       bigint NOT NULL REFERENCES time(id),
  jogador_id    bigint NOT NULL REFERENCES jogador(id),
  temporada_id  bigint REFERENCES temporada(id),
  numero        int,                     -- camisa
  desde         date,
  ate           date,
  UNIQUE (time_id, jogador_id, temporada_id)
);
```

---

## 6. Partida (fixture / match) — entidade central

```sql
partida (
  id                bigserial PRIMARY KEY,
  temporada_id      bigint NOT NULL REFERENCES temporada(id),
  estagio_id        bigint NOT NULL REFERENCES estagio(id),
  rodada_id         bigint REFERENCES rodada(id),      -- nullable
  grupo_id          bigint REFERENCES grupo(id),       -- nullable (só fase de grupos)
  confronto_id      bigint REFERENCES confronto(id),   -- nullable (só mata-mata)
  perna             smallint,                          -- 1|2 dentro do confronto (leg)

  time_mandante_id  bigint NOT NULL REFERENCES time(id),
  time_visitante_id bigint NOT NULL REFERENCES time(id),
  estadio_id        bigint REFERENCES estadio(id),     -- sede (pode ser neutra ≠ mando padrão)
  arbitro           text,

  inicio_previsto   timestamptz,                       -- instante canônico (UTC); borda renderiza em America/Sao_Paulo
  status            partida_status NOT NULL DEFAULT 'agendada',
  minuto            int,                               -- relógio ao vivo (status.elapsed)
  minuto_acrescimo  int,                               -- status.extra
  publico           int,                               -- attendance / intSpectators

  -- placar visível final (inclui prorrogação, EXCLUI pênaltis) = "CURRENT" da Sportmonks
  placar_mandante   int,
  placar_visitante  int,
  decidido_em       partida_decidido_em,               -- como o jogo foi decidido
  vencedor          partida_vencedor,                  -- mandante|visitante|empate (null se não finalizada)
  placeholder       boolean DEFAULT false,             -- fixture TBD de mata-mata (Sportmonks placeholder)

  atualizado_em     timestamptz
);
```

```sql
-- [cravado] enum canônico de status, mapeando API-Football status.short + football-data.org status + Sportmonks states.developer_name
CREATE TYPE partida_status AS ENUM (
  'a_definir',     -- TBD / TBA
  'agendada',      -- NS / SCHEDULED / TIMED
  'ao_vivo',       -- 1H/2H / IN_PLAY / INPLAY_*
  'intervalo',     -- HT
  'prorrogacao',   -- ET / EXTRA_TIME
  'penaltis',      -- P / PENALTY_SHOOTOUT / INPLAY_PENALTIES
  'finalizada',    -- FT/AET/PEN / FINISHED / FT_PEN
  'adiada',        -- PST / POSTPONED
  'suspensa',      -- SUSP / SUSPENDED / INTERRUPTED
  'cancelada',     -- CANC / CANCELLED
  'abandonada',    -- ABD / ABANDONED
  'wo'             -- WO / AWD / AWARDED (decisão de mesa)
);

CREATE TYPE partida_decidido_em AS ENUM ('tempo_normal','prorrogacao','penaltis','gol_qualificado');
CREATE TYPE partida_vencedor    AS ENUM ('mandante','visitante','empate');
```

### 6.1 `placar_periodo` — quebra por período

> **[cravado]** Guardamos o placar **acumulado ao fim de cada período** (semântica das `descriptions` da Sportmonks), não contribuições isoladas — assim evitamos a ambiguidade entre `fullTime` cumulativo (football-data.org) e `ft` = 90' (openfootball). A ingestão normaliza cada fonte para esta convenção.

```sql
placar_periodo (
  partida_id   bigint NOT NULL REFERENCES partida(id),
  periodo      placar_periodo_tipo NOT NULL,
  mandante     int NOT NULL,
  visitante    int NOT NULL,
  PRIMARY KEY (partida_id, periodo)
);

CREATE TYPE placar_periodo_tipo AS ENUM (
  'intervalo',     -- HT (1º tempo)
  'tempo_normal',  -- 90'  (resultado da regulamentação)
  'prorrogacao',   -- fim da prorrogação (acumulado, inclui os 90')
  'penaltis'       -- resultado da disputa de pênaltis (contagem de cobranças)
);
```

Exemplo — final de copa 2x2 no normal, 1x0 na prorrogação, decidida em jogo: `tempo_normal=(2,2)`, `prorrogacao=(3,2)`, `decidido_em='prorrogacao'`. Decidida nos pênaltis 4x3: `tempo_normal=(1,1)`, `penaltis=(4,3)`, `decidido_em='penaltis'`, `placar_mandante/visitante=(1,1)`.

### 6.2 `disputa_penalti` (cobranças)

A API Futebol BR é a única que detalha as cobranças (`cobrancas[]` com `status: converteu|perdeu`). Modelamos opcionalmente:

```sql
penalti_cobranca (
  id           bigserial PRIMARY KEY,
  partida_id   bigint NOT NULL REFERENCES partida(id),
  time_id      bigint NOT NULL REFERENCES time(id),
  jogador_id   bigint REFERENCES jogador(id),
  ordem        int,
  convertido   boolean NOT NULL
);
```

---

## 7. Escalações (lineups)

```sql
escalacao (
  id              bigserial PRIMARY KEY,
  partida_id      bigint NOT NULL REFERENCES partida(id),
  time_id         bigint NOT NULL REFERENCES time(id),
  esquema_tatico  text,                   -- "4-3-3" (formation string)
  tecnico_id      bigint REFERENCES tecnico(id),
  UNIQUE (partida_id, time_id)
);

escalacao_jogador (
  id               bigserial PRIMARY KEY,
  escalacao_id     bigint NOT NULL REFERENCES escalacao(id),
  jogador_id       bigint NOT NULL REFERENCES jogador(id),
  titular          boolean NOT NULL,      -- startXI vs substitutes / type_id 11 vs 12
  numero           int,                   -- camisa
  posicao          posicao_jogador,
  grid             text,                  -- "linha:coluna" (API-Football grid / Sportmonks formation_field)
  ordem            int                    -- ordem de exibição (BR `ordem`)
);
```

> `grid`/`formation_field` (ex.: `"2:1"`) renderiza o diagrama tático. **Substitutos têm `grid = null`**. Distinção previsto vs confirmado: a Sportmonks separa lineup confirmado de **"Expected Lineups"** (add-on caro); se entrarmos nisso, vira uma coluna `confirmada boolean` ou um `tipo_escalacao` enum — fica como decisão futura (ver DOS-001).

---

## 8. Eventos da partida — gols, cartões, substituições, VAR

> **[cravado]** Log único cronológico. Cartões e substituições **não** são tabelas separadas — são `tipo` deste log. Achamos os objetos `gols`/`cartoes`/`substituicoes` da API Futebol BR aqui na ingestão.

```sql
evento_partida (
  id                bigserial PRIMARY KEY,
  partida_id        bigint NOT NULL REFERENCES partida(id),
  time_id           bigint REFERENCES time(id),
  tipo              evento_tipo NOT NULL,
  detalhe           evento_detalhe,        -- subdivisão (ver mapa abaixo)
  jogador_id        bigint REFERENCES jogador(id),   -- protagonista (ver semântica por tipo)
  jogador_rel_id    bigint REFERENCES jogador(id),   -- secundário (ver semântica por tipo)
  minuto            int,
  minuto_acrescimo  int,                   -- 90+N
  periodo           text,                  -- "1º tempo"/"2º tempo"/"prorrogação"
  ordem             int NOT NULL,          -- [cravado] ordenar por isto, NÃO por minuto (Sportmonks sort_order)
  rescindido        boolean DEFAULT false, -- cartão anulado depois (Sportmonks rescinded)
  placar_no_lance   text,                  -- "1-0" no momento (Sportmonks result)
  observacao        text                   -- comments / motivo do VAR
);
```

```sql
CREATE TYPE evento_tipo AS ENUM ('gol','cartao','substituicao','var','penalti_disputa');

CREATE TYPE evento_detalhe AS ENUM (
  -- gol:
  'gol_normal','gol_contra','gol_penalti','penalti_perdido',
  -- cartao:
  'amarelo','vermelho','amarelo_vermelho',   -- amarelo_vermelho = 2º amarelo (YELLOWREDCARD)
  -- var:
  'var_gol_confirmado','var_gol_anulado','var_penalti_confirmado','var_penalti_anulado','var_cartao',
  -- penalti_disputa (shootout, quando vier como evento):
  'penalti_disputa_convertido','penalti_disputa_perdido'
  -- substituicao não precisa de detalhe (basta o tipo)
);
```

**Semântica de `jogador_id` / `jogador_rel_id` por tipo — [cravado]:**

| `tipo` | `jogador_id` | `jogador_rel_id` |
|---|---|---|
| `gol` | autor do gol | quem deu a assistência |
| `cartao` | jogador advertido | — |
| `substituicao` | **quem SAIU** | **quem ENTROU** |
| `var` | jogador relacionado | — |

> ⚠️ **Atenção na ingestão:** API-Football e API Futebol BR tratam `player`=quem sai. **Sportmonks inverte** (`player_id`=quem ENTRA, `related_player_id`=quem sai). O adaptador da Sportmonks deve trocar os dois ao mapear substituições. Goleiros/comissão técnica podem gerar cartão com `jogador_id = null`.

---

## 9. Classificação (standings)

```sql
classificacao (
  id              bigserial PRIMARY KEY,
  temporada_id    bigint NOT NULL REFERENCES temporada(id),
  estagio_id      bigint REFERENCES estagio(id),
  grupo_id        bigint REFERENCES grupo(id),    -- null = liga de grupo único
  time_id         bigint NOT NULL REFERENCES time(id),
  posicao         int NOT NULL,
  pontos          int NOT NULL,
  jogos           int NOT NULL,
  vitorias        int NOT NULL,
  empates         int NOT NULL,
  derrotas        int NOT NULL,
  gols_pro        int NOT NULL,
  gols_contra     int NOT NULL,
  saldo_gols      int NOT NULL,
  aproveitamento  int,                   -- % (BR aproveitamento)
  variacao        int,                   -- vs rodada anterior (BR variacao_posicao / API-Football status)
  forma           text,                  -- "WWDLW" / "v,e,d" — últimos 5
  zona            classificacao_zona,    -- faixa: libertadores/rebaixamento/... (parse de description/rule)
  -- splits casa/fora (API-Football all/home/away)
  casa            jsonb,                 -- {jogos,v,e,d,gp,gc}
  fora            jsonb,
  atualizado_em   timestamptz,
  UNIQUE (estagio_id, grupo_id, time_id)
);

CREATE TYPE classificacao_zona AS ENUM (
  'titulo','libertadores','libertadores_pre','sul_americana',
  'classificado','rebaixamento','playoff','neutro'
);
```

> Em pontos-corridos: `grupo_id = null`, uma linha por time. Em fase de grupos: uma linha por (grupo, time). Mata-mata puro **não tem classificação** (`estagio.gera_tabela = false`) — a progressão vem do `confronto`. **Pendência:** a Sportmonks ainda modela *dedução de pontos* (`StandingCorrection`) e *standings ao vivo* — só entram se virar requisito.

---

## 10. Odds / mercado de apostas

> **[cravado]** Cotação em **inteiro (centésimos)** via `@workspace/core/money` (convenção do repo / DOS-001): odd decimal `2.10` → `210`. Prob. implícita = `100 / cotacao_centesimos` (= `1/decimal`). The Odds API **não tem ID de time** → join por nome normalizado (ver `entity_xref` + alias de time).

```sql
odds_mercado (
  id            bigserial PRIMARY KEY,
  partida_id    bigint NOT NULL REFERENCES partida(id),
  casa          text NOT NULL,           -- bookmaker key (ex "betano", "betfair_ex_eu")
  mercado       odds_mercado_tipo NOT NULL,
  linha         numeric(4,2),            -- point/handicap (over/under, spread); null em 1x2/btts
  capturado_em  timestamptz NOT NULL,    -- last_update (point-in-time p/ line movement)
  fonte         text NOT NULL
);

odds_cotacao (
  id                  bigserial PRIMARY KEY,
  mercado_id          bigint NOT NULL REFERENCES odds_mercado(id),
  resultado           text NOT NULL,     -- "mandante"|"empate"|"visitante"|"over"|"under"|"sim"|"nao"
  cotacao_centesimos  int NOT NULL       -- odd decimal × 100
);
```

```sql
-- [cravado] chaves de mercado mapeadas das market keys da The Odds API (relevantes p/ futebol BR)
CREATE TYPE odds_mercado_tipo AS ENUM (
  'resultado_1x2',     -- h2h (inclui empate no futebol)
  'dupla_chance',      -- double_chance
  'empate_anula',      -- draw_no_bet
  'total_gols',        -- totals (over/under, usa `linha`)
  'handicap',          -- spreads (usa `linha`)
  'ambas_marcam',      -- btts (sim/nao)
  'resultado_1tempo',  -- h2h_h1
  'total_escanteios',  -- alternate_totals_corners
  'total_cartoes',     -- alternate_totals_cards
  'vencedor_torneio'   -- outrights
);
```

> Cobertura confiável para `soccer_brazil_campeonato`: `resultado_1x2`, `total_gols`, `ambas_marcam`. `handicap` e props de jogador são inconsistentes — ler o `markets[]` real do evento, não assumir. **Risco aberto (DOS-001):** The Odds API traz casas EU/UK, **não** as `.bet.br` (Betano/Superbet/KTO) — o value bet contra o mercado-alvo precisa de validação de fonte BR.

---

## 11. Predições e xG (camada de modelo, point-in-time)

Tanto predições (API-Football nativo; Sportmonks add-on) quanto xG (Sportmonks add-on; **API-Football não tem xG**) são **snapshots por fonte com `capturado_em`** — entram na camada de dossiê/proveniência da DOS-001, mas a forma estrutural é:

```sql
partida_predicao (
  id            bigserial PRIMARY KEY,
  partida_id    bigint NOT NULL REFERENCES partida(id),
  fonte         text NOT NULL,
  capturado_em  timestamptz NOT NULL,
  -- normalizado: probabilidades em pontos-base (int, 0–10000) p/ evitar float
  prob_mandante int, prob_empate int, prob_visitante int,
  conselho      text,                    -- advice / "Combo Double chance..."
  payload       jsonb                    -- bruto da fonte (comparison, under_over, correct_score...)
);

partida_xg (
  id            bigserial PRIMARY KEY,
  partida_id    bigint NOT NULL REFERENCES partida(id),
  time_id       bigint NOT NULL REFERENCES time(id),
  jogador_id    bigint REFERENCES jogador(id),   -- null = xG de time; preenchido = xG por jogador
  metrica       text NOT NULL,           -- "xg" (5304) | "xgot" (5305)
  valor         numeric(5,3) NOT NULL,
  fonte         text NOT NULL
);
```

> ⚠️ Os `predictions.goals.{home,away}` da API-Football são **estimativa do modelo deles, NÃO xG real** (vêm como string `"-1.5"`). Não tratar como xG. As `percent` vêm com `%` e devem ser parseadas para int na borda.

---

## 12. Reconciliação multi-fonte — `entity_xref`

> **[cravado]** Modelo source-agnostic: IDs canônicos internos + crosswalk. API-Football é a espinha do MVP; Sportmonks entra para xG/profundidade; The Odds API/TheSportsDB entram por nome.

```sql
entity_xref (
  id            bigserial PRIMARY KEY,
  entidade      text NOT NULL,           -- 'competicao'|'temporada'|'time'|'jogador'|'partida'|'estadio'...
  id_canonico   bigint NOT NULL,         -- FK lógica para a tabela da entidade
  fonte         text NOT NULL,           -- 'api_football'|'sportmonks'|'api_futebol_br'|'the_odds_api'|'thesportsdb'|'openfootball'
  id_externo    text NOT NULL,           -- id da fonte (string: alguns são numéricos, outros nome)
  confianca     numeric(3,2) DEFAULT 1,  -- p/ matches por nome (odds/openfootball)
  casado_em     timestamptz,
  UNIQUE (entidade, fonte, id_externo)
);

-- alias de nome de time (join por nome com The Odds API / openfootball, sem ID)
time_alias (
  time_id   bigint NOT NULL REFERENCES time(id),
  alias     text NOT NULL,               -- "Atletico-MG", "Atlético Mineiro", "CAM"...
  fonte     text,
  UNIQUE (alias)
);
```

---

## 13. Exemplos resolvidos — como cada formato BR encaixa

### 13.1 Brasileirão Série A (pontos corridos puro)
```
competicao(tipo=liga, ambito=nacional)
└ temporada(2026)
  └ estagio(nome="Fase única", formato=pontos_corridos, gera_tabela=true, ordem=1)
    └ 38 rodada(numero=1..38, fase_eliminatoria=null)
      └ 380 partida(rodada_id=*, grupo_id=null, confronto_id=null)
  classificacao: 20 linhas, grupo_id=null
```
> Não há `turno`/`returno` no modelo (a API Futebol BR confirma: zero ocorrências). Se precisar, deriva da `rodada.numero` (1–19 = turno, 20–38 = returno).

### 13.2 Copa do Brasil (mata-mata / misto, ida-volta)
```
competicao(tipo=copa, ambito=nacional)
└ temporada(2026)
  ├ estagio(nome="Primeira Fase", formato=mata_mata, ida_e_volta=false, ordem=1)  -- jogo único
  ├ estagio(nome="Oitavas", formato=mata_mata, ida_e_volta=true, ordem=4)
  │ └ rodada(fase_eliminatoria=oitavas)
  │   └ confronto(×8)  -- cada um: 2 partida (perna 1 e 2), pênaltis na perna 2
  ├ ... quartas, semifinal ...
  └ estagio(nome="Final", formato=mata_mata, ida_e_volta=true, decisivo=true)
  classificacao: nenhuma (gera_tabela=false)
```

### 13.3 Libertadores (qualificatória → grupos → mata-mata)
```
competicao(tipo=copa_int, ambito=continental)
└ temporada(2026)
  ├ estagio(formato=qualificatoria, ordem=1)          -- pré-Libertadores (mata_mata)
  ├ estagio(nome="Fase de Grupos", formato=grupos, gera_tabela=true, ordem=2)
  │ ├ grupo(A..H)
  │ └ partida(grupo_id=*)   ;  classificacao por (estagio, grupo, time)
  └ estagio(nome="Mata-mata", formato=mata_mata, ordem=3)
    └ rodada(oitavas/quartas/semifinal) + confronto(ida-volta); final em jogo único
```

### 13.4 Estaduais (ex.: Paulistão — grupos + mata-mata)
```
competicao(tipo=copa, ambito=estadual)   -- estaduais costumam ser grupos + mata-mata
└ temporada(2026)
  ├ estagio(formato=grupos)   -> classificacao por grupo
  └ estagio(formato=mata_mata) -> quartas/semifinal/final (confronto)
```

### 13.5 Playoffs (acesso/rebaixamento ou pós-temporada)
```
estagio(nome="Playoffs", formato=mata_mata, eliminatorio=true)
└ rodada(fase_eliminatoria=playoff via zona) + confronto
```
> `competicao.tipo` pode ser `liga` com um `estagio` final `mata_mata` (modelo "liga + playoff", football-data.org `PLAYOFFS`).

---

## 14. Catálogo de enums canônicos (resumo)

| Enum | Valores | Origem principal |
|---|---|---|
| `competicao_tipo` | liga, copa, copa_int, liga_int, amistoso | league.type + sub_type + campeonato.tipo |
| `competicao_ambito` | nacional, estadual, regional, continental, mundial, amistoso | domínio BR |
| `estagio_formato` | pontos_corridos, grupos, mata_mata, qualificatoria | fase.tipo (BR) + stage.type_id (SM) |
| `fase_eliminatoria` | preliminar…final (+ apertura/clausura/grupo_*) | stage enum (football-data.org v4) |
| `partida_status` | a_definir, agendada, ao_vivo, intervalo, prorrogacao, penaltis, finalizada, adiada, suspensa, cancelada, abandonada, wo | status.short + states |
| `partida_decidido_em` | tempo_normal, prorrogacao, penaltis, gol_qualificado | score.duration |
| `partida_vencedor` | mandante, visitante, empate | teams.winner |
| `placar_periodo_tipo` | intervalo, tempo_normal, prorrogacao, penaltis | scores.description |
| `evento_tipo` | gol, cartao, substituicao, var, penalti_disputa | /fixtures/events type |
| `evento_detalhe` | gol_normal/contra/penalti/penalti_perdido; amarelo/vermelho/amarelo_vermelho; var_*; penalti_disputa_* | detail / type_id |
| `posicao_jogador` | GOL, DEF, MEI, ATA, DESCONHECIDA | pos / position_id |
| `classificacao_zona` | titulo, libertadores, libertadores_pre, sul_americana, classificado, rebaixamento, playoff, neutro | description / standing rule |
| `odds_mercado_tipo` | resultado_1x2, dupla_chance, empate_anula, total_gols, handicap, ambas_marcam, resultado_1tempo, total_escanteios, total_cartoes, vencedor_torneio | The Odds API market keys |

---

## 15. Riscos, lacunas e decisões em aberto

1. **Agregado não é nativo** em API-Football/football-data/openfootball — temos que reconstruir o `confronto` pareando pernas por `(estagio, time-par)`. Materializar e recalcular ao fechar perna. *(resolvido pelo design; custo de ingestão.)*
2. **Cobertura por (competição, temporada)** — Série C/D e estaduais têm cobertura parcial de escalações/eventos na API-Football. Checar `cobertura` antes de prometer dado.
3. **xG só fora da API-Football** — se xG virar requisito, depende de Sportmonks (add-on) ou fonte BR validada. API-Football `predictions.goals` **não é xG**.
4. **Odds das casas BR** — maior risco aberto (DOS-001): The Odds API não cobre `.bet.br`. Decisão de fonte de odds fica em aberto (prototipar).
5. **Inversão de substituição na Sportmonks** — adaptador precisa trocar `player_in`/`player_out`. Carimbar teste.
6. **`ft` ambíguo entre fontes** — football-data.org `fullTime` = acumulado; openfootball `ft` = 90'. Nossa convenção (`placar_periodo` acumulado por período) resolve, mas **cada adaptador deve normalizar explicitamente**.
7. **Catálogo `type_id` da Sportmonks** — mapeamos para nossos enums na ingestão; alguns `type_id` de evento (14–23) precisam ser confirmados contra `/v3/core/types` ao implementar o adaptador.
8. **Escalação prevista vs confirmada** — não modelado ainda (add-on caro da Sportmonks). Vira `tipo_escalacao` se entrar.
9. **Reconciliação por nome** (The Odds API/openfootball) — exige `time_alias` curado; risco de match errado → `confianca` < 1 e revisão.
10. **Camada de proveniência/point-in-time** (snapshot imutável por pick, `observation` append-only) **não está aqui** — é a DOS-001. Este modelo é o esqueleto que aquela camada referencia.

---

## 16. Próximos passos sugeridos

- [ ] Transformar este modelo em **schemas Zod** (source of truth) por entidade, com `z.infer` em `types/` (convenção CLAUDE.md).
- [ ] Escolher tooling de persistência (Drizzle vs Prisma — ver DOS-001) e gerar as migrations Postgres a partir das DDLs acima.
- [ ] Escrever o **adaptador API-Football → modelo canônico** primeiro (espinha do MVP), com parser de string de rodada → `(rodada, fase_eliminatoria)` e reconstrução de `confronto`.
- [ ] Backfill histórico com **openfootball** (Brasileirão A/B 2018+, Libertadores/Sudamericana, Copa do Brasil 2025+), reconciliando nomes via `time_alias`.
- [ ] Adaptador Sportmonks (xG + agregado nativo) como segunda fonte; The Odds API por nome para o mercado.

---

### Fontes (modelos de dados verificados nesta investigação)

- **API-Football v3** — [documentation-v3](https://www.api-football.com/documentation-v3): leagues/coverage, fixtures/rounds, fixtures (score breakdown), lineups (grid), events (type/detail), standings, predictions.
- **Sportmonks v3** — [docs.sportmonks.com/football](https://docs.sportmonks.com/football): League→Season→Stage→Round→Group→Fixture, **Aggregate** (`aggregate_id`/`leg`), scores por `description`, states, sidelined, events (`type_id`/`sub_type_id`), standings + rules, xG/predictions.
- **API Futebol (BR)** — [api-futebol.com.br/documentacao](https://www.api-futebol.com.br/documentacao): campeonato.tipo, **fase.tipo** + `chaves`/`grupos`/`rodadas`, partida (disputa_penalti/cobranças), escalações, gols/cartões/substituições.
- **football-data.org v4** — [docs.football-data.org](https://docs.football-data.org/general/v4/lookup_tables.html): enums `stage`/`status`/`duration`, score com `regularTime`.
- **openfootball/football.db** — [github.com/openfootball](https://github.com/openfootball/football.json): formato `.txt`/`football.json` (`ht/ft/et/p`, `pen.`/`a.e.t.`), cobertura BR.
- **The Odds API** — [the-odds-api.com/liveapi/guides/v4](https://the-odds-api.com/liveapi/guides/v4/): sport/event/bookmaker/market/outcome, market keys, snapshots históricos.
- **TheSportsDB** — [thesportsdb.com/docs_api_guide](https://www.thesportsdb.com/docs_api_guide): venue (capacidade/localização/fuso), cores de time, assets visuais.
