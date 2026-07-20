---
id: CORE-004
titulo: Neon serverless na API (destrava o deploy no Workers)
modulo: core
status: em-andamento
prioridade: P1
facetas:
  api: feito # dual-driver + aot:false; workerd real consultando Neon devolve dados em 4 rotas
  dados: feito # Neon provisionado (eu-central-1), 37 migrações aplicadas, 21/21 tabelas com contagem idêntica ao local
docs: [docs/investigacoes/neon-serverless-api.md]
testada: parcial
testes:
  [
    "typecheck turbo verde nos 3 pacotes (2026-07-20)",
    "Diferencial bun-sql × node-postgres: count/sum/avg idênticos, zero regressão (2026-07-20)",
    "9 rotas reais por HTTP → 200, 13-76ms, zero erro no log: /v1/leagues, /PL, /PL/standings, /PL/scorers, /PL/rounds, /PL/bracket, /v1/teams/arsenal, /v1/players/{uuid}, /v1/search (2026-07-20)",
    "Tipos no JSON: scorers.goals/assists = number; perfil de jogador com 45 stats e 0 strings (2026-07-20)",
    "workerd real (wrangler dev): /health 200 em 33ms — prova que o bundle builda e sobe com pg + @neondatabase/serverless (2026-07-20)",
    "workerd real: /v1/leagues chega a compor o SQL e despacha pelo driver Neon; falha só na rede (DATABASE_URL local não fala o proxy do Neon) (2026-07-20)",
    "Neon provisionado: 37 migrações aplicadas pelo endpoint direto; 21 tabelas + pg_trgm/unaccent + immutable_unaccent presentes (2026-07-20)",
    "Carga: pg_dump --data-only do local (126MB) → psql --single-transaction no Neon em 31s, exit 0 (2026-07-20)",
    "Paridade de dados: 21/21 tabelas com contagem idêntica local×Neon, incl. match_trend 379.561 e commentary 115.890 (2026-07-20)",
    "E2E workerd→Neon: /v1/leagues, /PL/standings, /PL/scorers, /v1/search → 200 com dados reais (188-373ms) (2026-07-20)",
    "PENDENTE: wrangler deploy (API + web juntos — ver riscos)",
  ]
depende_de: []
impacta: [CORE-003]
ancoras:
  settings: [database_url, neondb_connection_string]
  tabelas: []
  tools: []
  funcoes: [db, migrate]
  rotas: [worker.ts]
verificado_em: null
atualizado: 2026-07-20
---

# Neon serverless na API (destrava o deploy no Workers)

## Descrição

A API (`apps/api`) hoje fala com Postgres via **`drizzle-orm/bun-sql`** (driver nativo do Bun),
que **não roda no workerd** — por isso `apps/api/src/worker.ts:5` carrega o aviso "DEPLOY PARADO"
e a API nunca subiu na Cloudflare. Esta feature troca o acesso a dados por um cliente
**dual-driver runtime-detectado**: `@neondatabase/serverless` no workerd (queries por fetch),
`pg`/node-postgres sob Bun (dev local + scripts de sync). O destino do dado passa a ser um
projeto **Neon** em `aws-sa-east-1`.

> Padrão espelhado do `grupoceralis/apps/api/src/db/client.ts`, que já roda assim em produção —
> mas **não copiado cego**: o Worker do mrtip é **100% leitura** (zero `db.insert/update/delete`
> em `modules/`, zero `.transaction(`), enquanto o CRM escreve e transaciona. Isso torna o
> caminho de fetch do Neon o caso ideal aqui, e neutraliza a maior pegadinha do modo
> `poolQueryViaFetch`.

## Tarefas

- [x] api — `db/client.ts`: dual-driver (`pg` sob Bun, `@neondatabase/serverless` no workerd), detectado por `navigator.userAgent`.
- [x] api — `db/migrate.ts`: `drizzle-orm/bun-sql/migrator` → `drizzle-orm/node-postgres/migrator`.
- [x] api — type parsers (numeric 1700 / int8 20 → `Number`) nos dois drivers, como cinto de segurança.
- [x] api — validar o ramo Bun/`pg` contra o Postgres local: typecheck, diferencial entre drivers e 9 rotas por HTTP.
- [x] api — `app.ts`: sob workerd, `{ adapter: CloudflareAdapter, aot: false }` — sem isso o AOT do Elysia dá `EvalError` em toda request no workerd.
- [x] api — provar no workerd real (`wrangler dev`) que o bundle sobe com `pg` + `@neondatabase/serverless`.
- [ ] dados — provisionar projeto Neon em `aws-sa-east-1` (plano **Launch**, não Free); guardar a URL **direta** (sem `-pooler`) e a pooler.
- [ ] dados — aplicar as 37 migrações no Neon pela URL direta; conferir `pg_trgm` + `unaccent` (migração `0020_search_trgm.sql`).
- [ ] dados — carregar os dados (rodar o sync da SportMonks contra o Neon, ou dump/restore do local).
- [ ] api — `worker.ts`: injetar `NEONDB_CONNECTION_STRING` em `process.env.DATABASE_URL`; remover o aviso de deploy parado.
- [ ] ops — `wrangler secret put NEONDB_CONNECTION_STRING`; `bunx wrangler deploy`; provar `/health` e uma rota de leitura em produção.

## Recomendação (investigado, 2026-07-20)

Portar o padrão dual-driver do `grupoceralis`, com **`neon-serverless` (Pool) e não `neon-http`** —
não porque o Worker precise de transação hoje (não precisa), mas porque é superset: cobre a
leitura de hoje pelo mesmo caminho de fetch e não exige nova troca de driver quando a persistência
por usuário de CORE-003 chegar. **Não usar Hyperdrive**: o `pg` sobre TCP no workerd é justamente
o que falhou em produção no projeto irmão. Detalhes, riscos e o que o counter-review levantou:
[docs/investigacoes/neon-serverless-api.md](../../investigacoes/neon-serverless-api.md).

## Evidências

- [código] `apps/api/src/db/client.ts:1` — a API importa `drizzle-orm/bun-sql`; é a causa-raiz do deploy travado.
- [código] `apps/api/src/worker.ts:5` — o repo já declara "DEPLOY PARADO" e aponta o motivo (Bun.SQL não roda no workerd).
- [código] `grupoceralis/apps/api/src/db/client.ts:21-29` (repo irmão) — incidente de PRODUÇÃO que refuta `pg`/TCP no workerd: connect pendura sob requests paralelos, `wallTime` cravado em 15.000 ms, request morre em 500.
- [código] `grupoceralis/apps/api/src/db/client.ts:30-58` (repo irmão) — o padrão dual-driver a portar (detecção por `navigator.userAgent`, `poolQueryViaFetch`, `maxUses:1`).
- [código] `apps/api/src/lib/db.ts:3-4` — únicas 2 ocorrências de "transaction" no `src`, e são tipo/comentário: o Worker não transaciona.
- [request] `GET /openapi/json` no Worker de produção (2026-07-20) — o contrato publicado ainda lista `/v1/ligas` (português), provando build ~4 semanas defasado; `/v1/leagues` devolve 404.
- [commit] `c0f1205` (2026-06-28) — commit de mensagem enganosa ("add ScrollArea and Select") que trouxe docker-compose + drizzle.config + db/client bun-sql: é onde o deploy congelou.
- [web] https://neon.com/pricing — Free = 0.5 GB (banco já tem 191 MB); Launch é pay-as-you-go sem mensalidade mínima.
- [web] https://neon.com/docs/extensions/pg-extensions — `pg_trgm` e `unaccent` suportados, então `0020_search_trgm.sql` aplica sem adaptação.
- [web] https://neon.com/docs/introduction/scale-to-zero — autosuspend fixo em 5 min no Free, desligável só no plano pago.

## Verificação

_(pendente: `/health` + rota de leitura respondendo em produção no Workers contra o Neon)_
