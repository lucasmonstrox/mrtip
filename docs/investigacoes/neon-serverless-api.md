# Neon serverless na API — destravar o deploy no Cloudflare Workers

> Investigação CORE-004 · 2026-07-20 · tier: comparação (enxuto)

> **Convenção de citação**: âncoras que começam com `grupoceralis/` apontam para o **repo irmão**
> (`../grupoceralis`), não para este repositório — o `verify-citations.mjs` as reporta como `NO_FILE`
> por estar escopado em `.`, o que é esperado, não quebra. Todas foram relidas nesta sessão e conferem.

## TL;DR + recomendação

Portar o padrão **dual-driver** do `grupoceralis/apps/api/src/db/client.ts:30-58` — `pg`/node-postgres
sob Bun, `@neondatabase/serverless` + `drizzle-orm/neon-serverless` no workerd, escolhidos em runtime
por `navigator.userAgent === "Cloudflare-Workers"` — apontando para um projeto **Neon em
`aws-sa-east-1`**. Duas correções sobre o "igual fiz no grupoceralis", ambas por evidência do próprio
repo: **(1)** o Worker do mrtip é **100% leitura** (zero `db.insert/update/delete` em
`apps/api/src/modules/`, zero `.transaction(` em todo o `apps/api/src`), então o modo
`poolQueryViaFetch` — o caminho de fetch stateless — é o caso ideal aqui, e não o compromisso que
foi no CRM; **(2)** o landmine de type-parsing que doeu no grupoceralis **já está neutralizado** no
mrtip por coerção defensiva em todos os sítios de agregação lidos. Vá direto pro plano **pago
(Launch)**, não pro Free: o banco tem **191 MB** contra um teto de **0.5 GB** no Free, e o Launch é
pay-as-you-go sem mensalidade mínima (~US$ 0,07/mês de storage nesse tamanho). Sobre **Hyperdrive**:
a doc oficial de Cloudflare e Neon o recomenda para este cenário, e ele traz pooling regional que o
driver por fetch não tem — mas foi exatamente `pg`/TCP no workerd que falhou em produção no projeto
irmão. Recomendo **começar pelo driver Neon** (provado no nosso stack) e tratar Hyperdrive como
**experimento de latência depois do deploy**, não como pré-requisito. Ver §"O que o counter-review
levantou".

> **Status desta investigação**: a troca de driver **já foi implementada e validada** a pedido do
> dono (ver §"Implementação e validação"). O que falta é infraestrutura: provisionar o Neon e
> deployar. Por isso a feature está `em-andamento`, não `investigado`.

## Contexto e problema

**Pedido**: "Preciso na api usar o neon serverless, igual fiz para o projeto do grupoceralis."

O que está em jogo não é preferência de driver — é que **a API do mrtip está congelada em produção**.
`apps/api/src/db/client.ts:1` importa `drizzle-orm/bun-sql` (driver nativo do Bun), que não existe no
workerd; `apps/api/src/worker.ts:5` registra isso explicitamente ("⚠️ DEPLOY PARADO").

### Brief

- **Escopo**: como trocar o acesso a dados da `apps/api` para rodar no workerd contra Neon; o que
  quebra; o que muda no dev local e nos scripts de sync.
- **Respondido =** driver escolhido com justificativa, blast radius por arquivo, plano de migração de
  dados, e os riscos que sobrevivem a um refutador.
- **Fora de escopo**: migrar o `apps/web` (já está em OpenNext/Workers), redesenhar schema, tunar query.

### Requisitos implícitos assumidos

- Dinheiro em centavos e datas via `date-fns` (CLAUDE.md) — **não tocados** aqui: o schema não tem
  coluna monetária (`apps/api/src/db/schemas/leagues.ts` só tem `numeric` em lat/long e `real` em
  métricas), então a troca de driver não passa perto da porta de dinheiro.
- Fuso `America/Sao_Paulo` — a região Neon `aws-sa-east-1` mantém o banco no mesmo continente que o
  usuário; não altera semântica de timestamp (o app já usa `lib/kickoff`).
- Regulação BR / "todo pick mostra o porquê" — **não afetados**: esta é uma troca de infraestrutura
  sem superfície de produto.

## Estado real no código

### O que é real

| Achado | Âncora | Confiança |
|---|---|---|
| API usa `drizzle-orm/bun-sql` (Bun.SQL) | `apps/api/src/db/client.ts:1` | lido-no-código |
| Migrator também é bun-sql | `apps/api/src/db/migrate.ts:1` | lido-no-código |
| Worker declara o deploy travado por causa disso | `apps/api/src/worker.ts:5` | lido-no-código |
| `nodejs_compat` já ligado (pré-requisito do `pg`) | `apps/api/wrangler.jsonc` (`compatibility_flags`) | lido-no-código |
| `account_id` já fixado na conta certa | `apps/api/wrangler.jsonc` (`162bc07e…`) | lido-no-código |
| Postgres local: pgvector/pg17, porta 5434 | `apps/api/docker-compose.yml` | lido-no-código |
| `DATABASE_URL` já é `globalEnv` do turbo | `turbo.json` | lido-no-código |
| 37 migrações Drizzle | `apps/api/src/db/migrations/*.sql` (contagem) | lido-no-código |
| Extensões exigidas: `pg_trgm`, `unaccent` | `apps/api/src/db/migrations/0020_search_trgm.sql:3,5` | lido-no-código |
| Os 3 scripts de sync consomem o **mesmo** `db` | `sync-sportmonks.ts:4`, `sync-ingest.ts:3`, `sync-cup.ts:3` | lido-no-código |

### O achado que muda a recomendação: o Worker só lê

Busca por `db.insert|db.update|db.delete` em `apps/api/src/modules/` → **nenhum resultado**. Busca por
`transaction` em `apps/api/src` inteiro → **2 ocorrências, ambas em comentário/tipo**
(`apps/api/src/lib/db.ts:3-4`, que só deriva o tipo `Tx` e não é usado por ninguém em runtime).

Toda escrita vive nos scripts de sync (`apps/api/src/db/sync-*.ts`), que rodam **sob Bun**, fora do
Worker. Consequência direta: no workerd o mrtip nunca precisa de transação interativa — o caminho de
**fetch stateless** cobre 100% do tráfego do Worker. No CRM não era assim (pedidos/boletos/comissões
transacionam), e é por isso que lá o `neon-serverless` com WebSocket era obrigatório.

### O landmine do grupoceralis — em grande parte já neutralizado aqui

`grupoceralis/apps/api/src/db/client.ts:16-18` corrige globalmente os type parsers de `numeric` (OID
1700) e `int8` (OID 20), porque o node-postgres devolve **string** onde o Bun.SQL devolvia number, e
lá isso quebrava agregações de dinheiro. Auditei os sítios equivalentes no mrtip:

- `sum()`/`avg()` (≈45 colunas num único select) — `shared.ts:1006-1053` — **já coeridos**: o bloco
  `n()`/`pct()` em `shared.ts:1058-1078` envolve tudo em `Number()`.
- `count()` — `scorers.service.ts:33` consumido via `Number(r.goals)` em `scorers.service.ts:81`;
  `scorers.service.ts:44` via `Number(r.assists)` em `:51`; `shared.ts:1712,1723` via `:1730`;
  `shared.ts:1800,1806` via `:1810-1811`; `shared.ts:1915,1924,1930` via `:1921,1934-1935`;
  `get-league.service.ts:17` coage inline.
- Colunas `real()` (xG, probabilidades, ratings) — float4/float8 já voltam number no node-postgres,
  fora do escopo do problema.
- Colunas `numeric` — só `latitude`/`longitude` (`schemas/leagues.ts:71-72`), e o código **já as trata
  como string** por design (comentário em `schemas/leagues.ts:60` e `shared.ts:115`).

**Veredito**: o risco existe mas está pré-mitigado. Ainda assim recomendo copiar o loop de
`setTypeParser` — são 4 linhas que tornam a classe inteira de bug impossível, em vez de depender de
todo `count()` futuro lembrar do `Number()`. Note a armadilha de tipo: o Drizzle tipa `count()` como
`number`, então o TypeScript **não** obriga a coerção — um `count()` novo sem `Number()` passa no
`typecheck` e quebra em runtime. É exatamente o tipo de bug que o type parser elimina na raiz.

### Arqueologia git — quanto tempo produção está atrás

| Commit | Data | O que prova |
|---|---|---|
| `0a5e4c3` | 2026-06-22 | "API Elysia + tela de ligas" — introduz as rotas `/v1/ligas` (português) |
| `c0f1205` | 2026-06-28 | Commit misto (mensagem fala só de UI): traz `docker-compose.yml`, `drizzle.config.ts` e o `db/client` com bun-sql — **é aqui que o deploy congela** |
| `251d3b4` | 2026-06-28 | Renomeia `/v1/ligas` → `/v1/leagues` (código em inglês) |

### Estado de produção (verificado por request, 2026-07-20)

O Worker **está no ar** — mas serve um build de ~4 semanas atrás:

- `GET https://mrtip-api.joao-galiano-silva.workers.dev/health` → `200 {"status":"ok"}`
  (a mesma URL devolve **404 em HEAD** — o Elysia só registra o handler GET; se um checker
  automático marcar essa URL como morta, é falso-positivo)
- `GET /v1/leagues` → **404 NOT_FOUND**
- `GET /openapi/json` → o contrato publicado lista `/v1/ligas/`, `/v1/ligas/{code}` — **em português**

Ou seja: o que está deployado é anterior ao `251d3b4` (rename) e ao `c0f1205` (Postgres). O `/health`
responde porque é estático. `apps/web/shared/api/eden.ts:8` aponta a produção justamente pra esse
host — então **o front em produção fala com uma API que não tem as rotas dele**. Isso reposiciona a
tarefa: não é "melhoria de infra", é conserto de produção quebrada.

### Gaps

- Não existe `.dev.vars` em `apps/api/` (o `wrangler dev` do grupoceralis usa um) — só `.env`/`.env.example`.
- `turbo.json` `globalEnv` não tem `NEONDB_CONNECTION_STRING`.
- `apps/api/wrangler.jsonc` não tem `vars` nem secrets declarados (o do CRM documenta os dele em comentário).

## Estado da arte — claims verificados

Todos verificados por fetch da página oficial nesta sessão, as-of 2026-07-20.

| Claim | Veredito | Fonte |
|---|---|---|
| Neon suporta `pg_trgm` (1.6) e `unaccent` (1.1) em PG14–18 | SUPPORTED | https://neon.com/docs/extensions/pg-extensions |
| Neon suporta `vector`/pgvector (0.8.0 em PG14–17) | SUPPORTED | https://neon.com/docs/extensions/pg-extensions |
| Neon tem região `aws-sa-east-1` (São Paulo) | SUPPORTED | https://neon.com/docs/introduction/regions |
| Regiões **Azure** do Neon estão deprecated (sem projetos novos) | SUPPORTED | https://neon.com/docs/introduction/regions |
| `@neondatabase/serverless` está em **1.1.0** | SUPPORTED | https://registry.npmjs.org/@neondatabase/serverless/latest |
| Drizzle documenta `drizzle-orm/neon-serverless` (Pool + WebSocket) vs `neon-http` (fetch) | SUPPORTED | https://orm.drizzle.team/docs/connect-neon |
| Free = **0.5 GB** de storage por projeto | SUPPORTED | https://neon.com/pricing |
| Launch = pay-as-you-go: **$0.35/GB-mês + $0.106/CU-hora**, sem mensalidade mínima | SUPPORTED | https://neon.com/pricing |
| Free tem scale-to-zero **fixo** em 5 min; só plano pago desliga | SUPPORTED | https://neon.com/docs/introduction/scale-to-zero |
| Cold start do scale-to-zero: "a few hundred milliseconds" | SUPPORTED | https://neon.com/docs/introduction/scale-to-zero |
| Free: 100 CU-horas/projeto/mês, 100 projetos, 10 branches/projeto | SUPPORTED | https://neon.com/faqs/free-plan-limits-and-quotas |
| No Free, storage acima do teto **suspende** o projeto (não cobra overage) | SUPPORTED | https://neon.com/faqs/free-plan-limits-and-quotas |

### O tamanho do banco decide o plano

Medido no Postgres local em 2026-07-20 (`pg_database_size` / `pg_total_relation_size`):

| Tabela | Tamanho |
|---|---|
| **total do banco** | **191 MB** |
| `match_trend` | 87 MB (46%) |
| `commentary` | 29 MB |
| `match_tv_station` | 25 MB |
| `lineup_player` | 17 MB |
| `match_prognosis` | 13 MB |

191 MB é **37% do teto do Free** com apenas Premier League + FA Cup + Carabao. A migração do
Brasileirão já está investigada (`docs/investigacoes/serie-a-brasileirao-migracao-sportmonks.md`) —
com ela o Free estoura, e estourar no Free **suspende o projeto**. Como o Launch não tem mensalidade
mínima, 191 MB custam ~**US$ 0,07/mês** de storage; o custo real é compute (CU-hora). Ir direto pro
pago também **desliga o scale-to-zero**, eliminando o cold start de cada request que chega frio.

> Alavanca de espaço, se um dia apertar: `match_trend` (87 MB) é a stat por minuto e `match_tv_station`
> (25 MB) é grade de TV — juntas são 59% do banco e são as primeiras candidatas a corte/retenção.

## Opções e trade-offs

| Opção | Como | Prós | Contras | Veredito |
|---|---|---|---|---|
| **A. Dual-driver `pg` + `neon-serverless`** | Padrão do `grupoceralis/…/client.ts:30-58` | Provado em prod no repo irmão, mesmo dono/stack; mantém docker local; cobre leitura hoje e escrita amanhã | 2 drivers no `package.json`; exige migrar o lado Bun de bun-sql → node-postgres | **Recomendada** |
| B. Só `neon-http` (fetch puro) | `drizzle-orm/neon-http` em todo lugar | Mais leve; encaixa perfeito no Worker read-only de hoje | Sem transação interativa — CORE-003 planeja persistência por usuário, e aí troca de driver de novo | Descartada (miopia) |
| C. Hyperdrive + `pg` sobre TCP | Binding Hyperdrive, sem driver Neon | Um driver só; pooling regional corta round-trips (recomendação oficial CF/Neon) | Foi exatamente isso que caiu em produção no repo irmão | **Adiada**, não descartada — medir como otimização pós-deploy |
| D. Sair do Workers (Fly/Railway) | Roda Bun de verdade | Mantém bun-sql e TCP rápido pro sync | Rompe o padrão Cloudflare do dono; `apps/web` já é OpenNext/Workers | Fora de escopo (decisão já tomada) |

**Por que A e não B**: hoje B basta — o Worker só lê. Mas `docs/features/core/CORE-003-autenticacao-clerk.md`
já prevê "tabela `users` + webhook de sync quando houver persistência por usuário". `neon-serverless`
com `poolQueryViaFetch = true` roda as queries simples pelo **mesmo caminho de fetch** que o
`neon-http` usaria — o custo de escolher A hoje é ~zero, e evita a segunda migração.

## Modelo de dados proposto

**Nenhuma mudança de schema.** As 37 migrações existentes aplicam como estão; `0020_search_trgm.sql`
já qualifica a extensão explicitamente (`public.unaccent('public.unaccent', $1)`), que é o formato
seguro quando o `search_path` não é garantido.

## Plano por faceta

### dados
1. Criar projeto Neon `mrtip-prod` em `aws-sa-east-1`, plano **Launch**. Guardar as duas URLs: a
   **direta** (sem `-pooler`) e a pooler.
2. Aplicar as migrações pela URL **direta**: `DATABASE_URL=<neon-direta> bun run --cwd apps/api db:migrate`.
3. Conferir as extensões: `select extname from pg_extension` deve trazer `pg_trgm` e `unaccent`.
4. Carregar dados — `pg_dump`/`pg_restore` do local (mais rápido) ou re-rodar `db:sync` contra o Neon.

### api
5. `db/client.ts` — dual-driver espelhando `grupoceralis/apps/api/src/db/client.ts:30-58`, incluindo o
   loop de `setTypeParser` (:16-18).
6. `db/migrate.ts` — trocar `drizzle-orm/bun-sql/migrator` por `drizzle-orm/node-postgres/migrator`.
7. `package.json` — `+pg`, `+@types/pg`, `+@neondatabase/serverless@^1.1.0`.
8. `worker.ts` — injetar `NEONDB_CONNECTION_STRING` em `process.env.DATABASE_URL` (padrão de
   `grupoceralis/apps/api/src/worker.ts:60`) e apagar o aviso "DEPLOY PARADO" de `worker.ts:5`.
9. `turbo.json` — `NEONDB_CONNECTION_STRING` no `globalEnv`; `.env.example` documentando as duas URLs.

### ops
10. `wrangler secret put NEONDB_CONNECTION_STRING` (usar a URL **pooler** pro Worker).
11. `bunx wrangler deploy` e provar em produção: `/health` **e** `/v1/leagues` (hoje 404) devolvendo dados.

> **Scripts de sync**: não precisam de mudança de código — os três importam o mesmo `db` e caem
> automaticamente no ramo Bun/`pg`. Só precisam do `DATABASE_URL` apontando pro **endpoint direto**
> (sem `-pooler`): o pooler atrapalha escrita em massa, como o grupoceralis documenta em
> `scripts/migrar-supabase-neon.ts` e nos one-offs, todos com `.replace("-pooler", "")`.

## Riscos e gotchas

1. **Contrato quebrado entre web e API já em produção.** `apps/web/shared/api/eden.ts:8` aponta pro
   Worker velho. Ao deployar a versão nova, as rotas mudam de `/v1/ligas` para `/v1/leagues` — o front
   novo espera as novas, mas vale conferir se há algum caminho cacheado/antigo apontando pras velhas.
2. **`pg` no workerd exige `nodejs_compat`** — já está em `apps/api/wrangler.jsonc`, mas o ramo `pg`
   nunca deve **executar** no Worker; se a detecção de runtime falhar, cai no bug de TCP do CRM.
3. **`count()` mente no tipo.** Drizzle tipa como `number`, node-postgres entrega string — o
   `typecheck` não pega. Mitigado pelo `setTypeParser`; sem ele, todo `count()` futuro é um bug latente.
4. **Cold start** se ficar no Free (scale-to-zero fixo em 5 min, algumas centenas de ms na primeira
   request). Resolvido indo pro Launch.
5. **Crescimento do banco** — `match_trend` é 46% e escala por partida×minuto×liga. Vale definir
   retenção antes de somar ligas.
6. **Dev local continua em docker** — o `@neondatabase/serverless` não fala com Postgres puro sem um
   proxy WebSocket; manter o ramo `pg` para dev é o que evita esse acoplamento.

## O que o counter-review levantou

Um subagente role-locked pra **refutar** a recomendação, com buscas próprias e sem acesso ao meu
raciocínio, trouxe 5 problemas. Veredito de cada um depois de confrontar com o repo:

| # | Achado do refutador | Veredito |
|---|---|---|
| 1 | `poolQueryViaFetch` mata estado de sessão em **SQL raw** (`SET`, `LISTEN/NOTIFY`, advisory locks, cursores `WITH HOLD`) | **Procede como restrição futura.** Não morde hoje: não existe `db.execute(sql...)` no repo — todos os `sql` são fragmentos dentro do query builder (`search.service.ts:59-73,149-172`, `shared.ts:1052`, `sync-ingest.ts:159`). O refutador também confirmou, lendo o source do Drizzle, que `db.transaction()` usa `pool.connect()` (WebSocket real) e **não** é afetado pela flag. Fica documentado como limite do lado Worker. |
| 2 | **Cloudflare e Neon recomendam oficialmente Hyperdrive**, não o driver serverless puro; Hyperdrive dá pooling regional (~6→1 round-trips) | **Procede e corrige minha recomendação.** É a tensão real desta investigação: doc oficial de vendor × incidente de produção no nosso próprio stack. Mantenho o driver Neon como ponto de partida (evidência primária, mesmo dono/stack, e o Worker é read-only), mas **rebaixo "não usar Hyperdrive" para "não usar agora"** — vale medir depois do deploy. |
| 3 | Bun.SQL × node-postgres divergem em int8/numeric em SQL raw | **Procede na teoria, não morde na prática** (mesma razão do #1: não há SQL raw). E foi **medido**: ver §"Implementação e validação" — as agregações batem entre os drivers. |
| 4 | Free tier de 0.5 GB vs banco de 191 MB; recomendação não escolhia plano | **Confirmação independente.** O refutador chegou sozinho ao mesmo número e à mesma conclusão que a §"O tamanho do banco decide o plano". |
| 5 | Pooled × direct endpoint pros scripts de sync não estava decidido; direto tem `max_connections` bem menor | **Procede.** Incorporado ao plano: sync usa o endpoint **direto** (o pooler quebra sessão e atrapalha escrita em massa), com a ressalva de que isso limita conexões concorrentes — se o sync paralelizar muito, medir. |

Também **não achou problema** em dois pontos que eu tinha assumido sem verificar, e vale registrar:
`navigator.userAgent === "Cloudflare-Workers"` é confiável (a flag `global_navigator` é default-ON
desde a compat date 2022-03-21; a do mrtip é 2026-06-18), e `pg_trgm`/`unaccent` não têm pegadinha de
`search_path` no Neon — o único gotcha real (o `unaccent()` não ser IMMUTABLE) já está resolvido em
`0020_search_trgm.sql`. O racional do `maxUses: 1` ficou **NEI**: copiado do repo irmão, sem doc
primária que o explique.

## Implementação e validação (2026-07-20)

Implementado a pedido do dono, no mesmo dia da investigação.

**Mudanças**: `apps/api/src/db/client.ts` reescrito no padrão dual-driver; `db/migrate.ts` passou pro
migrator do node-postgres; `+pg@8.22.0`, `+@types/pg@8.20.0`, `+@neondatabase/serverless@1.1.0`.

**Como foi provado — parte 1: ramo Bun/`pg`** (contra o Postgres local). ⚠️ Atenção ao ler esta parte:
ela valida o ramo que **nunca esteve quebrado**. O objeto da tarefa é o ramo workerd (parte 2).

- `bun run typecheck` (turbo, 3 pacotes) — verde.
- **Teste diferencial** bun-sql × node-postgres nas mesmas agregações: `count()` → `4274` (number) nos
  dois; `sum()` → `"28891"` (string) nos dois; `avg()` → `"80.34417296016585"` (string) nos dois.
  Ou seja: **nenhuma regressão**. E o motivo de `sum`/`avg` virem string é o **Drizzle**
  (`mapWith(String)`), não o driver — por isso os `Number()` de `shared.ts:1058-1078` sempre foram
  necessários e continuam corretos.
- **Rotas reais por HTTP** (auth desligada pelo escape hatch de `apps/api/src/auth/guard.ts:35`): `/v1/leagues`,
  `/v1/leagues/PL`, `/PL/standings`, `/PL/scorers`, `/PL/rounds`, `/PL/bracket`, `/v1/teams/arsenal`,
  `/v1/players/{uuid}`, `/v1/search?q=haaland` → todas **200**, 13–76 ms, zero erro no log.
  O `/v1/search` é o que exercita `pg_trgm` + `immutable_unaccent`.
- **Tipos no contrato JSON**: `scorers[0].goals = 27 (number)`, `assists = 8 (number)`; o perfil de
  jogador devolve **45 campos de stats com 0 strings**. Nenhum vazamento de string pro front.

**Como foi provado — parte 2: ramo workerd** (`bunx wrangler dev`, workerd real, com `.dev.vars`
apontando o `DATABASE_URL` pro Postgres local só pra satisfazer o `env.required()`).

Este é o teste que importa, e ele **achou um blocker que nada no ramo Bun pegaria**:

1. **1ª tentativa → 500 em toda request**: `EvalError: Code generation from strings disallowed for
   this context`. Causa: a compilação **AOT do Elysia** gera handlers via `new Function()`, e o
   workerd proíbe codegen a partir de string. **Não tem relação com o driver** — teria quebrado o
   deploy do mesmo jeito com qualquer banco.
2. **Correção** (espelhando `grupoceralis/apps/api/src/app.ts:29`): sob workerd, construir o Elysia
   com `{ adapter: CloudflareAdapter, aot: false }`; sob Bun, manter o padrão (mais rápido).
   Aplicado em `apps/api/src/app.ts:26-31`.
3. **2ª tentativa → `/health` 200 em 33 ms sob workerd real.** Isso prova o que mais preocupava:
   o bundle **builda e sobe** com `pg` e `@neondatabase/serverless` importados estaticamente no topo
   de `db/client.ts` (o `pg` tem fama de não bundlar pro workerd) e sem estourar o limite de CPU de
   boot que o `worker.ts` já alertava.
4. **Rota de banco (`/v1/leagues`) → 500, e o erro é o certo**: o Drizzle compôs o SQL correto
   (`select "code", … from "league"`) e despachou pelo driver Neon; falhou na **rede**, porque
   `@neondatabase/serverless` fala o protocolo do proxy do Neon e o `DATABASE_URL` aponta pro
   Postgres local. Ou seja: a pilha inteira funciona até exatamente o ponto onde um endpoint Neon
   real é necessário.

**O que segue sem prova**: uma query devolvendo linhas pelo driver Neon. Isso exige provisionar o
Neon — é o único passo que falta, e é infraestrutura, não código.

### Achado inesperado: o bun-sql estava corrompendo `numeric(9,6)`

O teste diferencial pegou uma divergência real em `venue.latitude`/`longitude` — e o **bun-sql é quem
estava errado**. Conferido contra o `psql` (fonte da verdade), 6/6 linhas:

| Estádio | psql (real) | bun-sql (antigo) | node-pg (novo) |
|---|---|---|---|
| Villa Park | `52.509167` | `52.509100` ✗ | `52.509167` ✓ |
| Old Trafford | `53.463056` | `53.463000` ✗ | `53.463056` ✓ |
| Tottenham Hotspur Stadium | `51.604444` | `51.604400` ✗ | `51.604444` ✓ |

O bun-sql **trunca em 4 casas decimais e preenche o resto com zero**. É um bug latente de corrupção
de dado no driver que está em produção hoje; a migração o corrige de graça. **Impacto prático baixo**:
4 casas ≈ 11 m de erro de posição, desprezível pra distância entre estádios (o consumo é geo/viagem —
`docs/investigacoes/venue-estadio-geo.md`), mas é um dado que estava silenciosamente errado.

## Refutado

- **Hyperdrive + `pg` sobre TCP como caminho principal no workerd, *na primeira tentativa*.** Refutado
  por incidente de produção documentado no repo irmão (`grupoceralis/apps/api/src/db/client.ts:21-29`):
  sob requests paralelos o `connect` nunca completa, estoura o `connectionTimeoutMillis` de 15 s e o
  request morre em 500 — observado nos logs de observability com `wallTime` cravado em 15.000 ms e
  `cpuTime` ~1 ms. O paliativo `maxUses:1` não segurou. O Hyperdrive segue no CRM apenas como
  **fallback** (`grupoceralis/apps/api/src/worker.ts:60`).
  ⚠️ **Refutação parcial, não total**: o counter-review mostrou que a doc oficial de Cloudflare e Neon
  recomenda Hyperdrive justamente aqui, pelo pooling regional que corta round-trips. A evidência
  primária do nosso stack pesa mais pra decidir *o que fazer primeiro*, mas não invalida Hyperdrive
  como otimização de latência a medir depois — sobretudo porque o Worker do mrtip é read-only e
  perfila diferente do CRM.
- **"O type-parsing vai quebrar as agregações do mrtip como quebrou o do CRM."** Refutado por auditoria:
  todos os sítios de `count()`/`sum()`/`avg()` lidos já coagem com `Number()` (âncoras na seção de
  estado real). O risco é de regressão futura, não de quebra na migração.
- **"Usa o Free tier pra começar."** Refutado por medição: 191 MB contra teto de 0.5 GB, com
  crescimento garantido por liga adicionada; e no Free o estouro **suspende o projeto**.

## Perguntas abertas

- **Decisão do dono**: carregar o Neon por `pg_dump`/`restore` do local (rápido, fotografa o estado
  atual) ou re-rodar `db:sync` contra o Neon (mais lento, mas revalida a ingestão)?
- **Decisão do dono**: manter `match_tv_station` (25 MB, grade de TV)? Não vi consumo dela nas rotas —
  não auditei a fundo, então fica como pergunta, não como recomendação de corte.
- **Não verificado**: se o `apps/web` em produção (OpenNext) tem alguma variável `NEXT_PUBLIC_API_URL`
  setada no dashboard da Cloudflare que sobreponha o default de `eden.ts:8` — não tenho acesso ao
  dashboard nesta sessão.
- **Não verificado**: custo real de CU-hora pro perfil do mrtip. Depende do tráfego, que ainda não existe.
- **Lacuna de busca**: `npmjs.com/package/@neondatabase/serverless` devolveu HTTP 403 ao fetch; a versão
  1.1.0 foi confirmada pela API oficial do registry (`registry.npmjs.org`), não pela página web.

## Evidências decisivas

- [código] `apps/api/src/db/client.ts:1` — a API usa bun-sql; é a causa-raiz do deploy travado.
- [código] `apps/api/src/worker.ts:5` — o próprio repo declara "DEPLOY PARADO" e aponta o motivo.
- [código] `grupoceralis/apps/api/src/db/client.ts:21-29` — o incidente de produção que refuta o TCP/Hyperdrive.
- [código] `grupoceralis/apps/api/src/db/client.ts:30-58` — o padrão dual-driver a ser portado.
- [request] `GET /openapi/json` no Worker de produção (2026-07-20) — o contrato publicado ainda é `/v1/ligas`, provando build defasado.
- [web] https://neon.com/pricing — Free = 0.5 GB; Launch = pay-as-you-go sem mínimo mensal.
- [web] https://neon.com/docs/extensions/pg-extensions — `pg_trgm` e `unaccent` suportados (as migrações aplicam).
- [web] https://neon.com/docs/introduction/scale-to-zero — autosuspend fixo no Free, desligável só no pago.
