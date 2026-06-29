---
id: SIN-011
titulo: Sinal de lesões e desfalques
modulo: sinais
status: em-andamento
prioridade: P2
facetas:
  dados: feito
  ia: investigado
testada: parcial
testes:
  - "db:sync + assert banco: injury 3334 linhas (Missing Fixture 3121 / Questionable 213) (2026-06-28)"
  - "GET /v1/matches/:id/injuries: Liverpool×Bournemouth fora 5/6 + dúvida (didNotPlay false, reason Doubtful) (2026-06-28)"
  - "GET /v1/players/:id: matchesOut 20 p/ A. Isak (era 0), consecutiveOut derivado (2026-06-28)"
depende_de: []
impacta: [DOS-001, MOD-001]
ancoras:
  settings: []
  tabelas: [injury]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/lesoes.md, docs/investigacoes/desfalques-sportmonks-estudo.md, docs/planos/SIN-011-lesoes.md]
verificado_em: null
atualizado: 2026-06-28
---

# Sinal de lesões e desfalques

## Descrição

Impacto de desfalques, assimétrico por posição (atacante fora → under; zagueiro/goleiro fora → over). Goleiro reserva é o desfalque mais subprecificado; suspensão por cartão é o mais previsível. O edge é de timing (janela pós-escalação).

## Tarefas

- [x] P1 dados — ingerir `sidelined` no sync → popular `injury` (include + loop + mapa de tipo)
- [ ] ia (fase futura) — direção por posição + antecipação de suspensão; ponderar profundidade de elenco. (não entra neste plano)
- [ ] dados (fase futura) — escalação provável/confirmada; PSxG-GA do goleiro; cobertura BR via imprensa; enriquecer player-stub lesionado (posição/foto).

## Plano (2026-06-28)

Dossiê: [docs/planos/SIN-011-lesoes.md](../../planos/SIN-011-lesoes.md)

### Objetivo, aceite e non-goals

"Pronto" = após `bun run db:sync`, a tabela `injury` tem linhas e os reads que já existem (painel de desfalques do jogo, "jogos perdidos" no perfil do jogador) saem de vazio para populado, sem alterar o read path nem migrar schema.
Non-goals: o **sinal** em si (faceta `ia`: direção por posição, antecipação de suspensão); `sidelined.sideline`/`games_missed`; enriquecer dados do jogador-stub lesionado (posição/foto); escalação provável.
Aceite (cada critério aponta a Prova):
- A1 [dados] após sync, `injury` tem linhas com AMBOS `type='Missing Fixture'` e `type='Questionable'` → coberto por P1
- A2 [api] `GET /v1/matches/:id/injuries` de um jogo com desfalques retorna `home`/`away` populados, `didNotPlay` correto → coberto por P2

### Premissas

- Include `sidelined.player;sidelined.type` cabe na MESMA chamada `/fixtures/between` — **0 request extra** (verificado: o estudo varreu as 380 fixtures assim). Dossiê §Estado do terreno.
- `matchIdByFixture`, `teamIdBySm`, `ensurePlayer` estão em escopo no ponto de inserção (`sync-sportmonks.ts:462-498`).
- `unique(injury.matchId, playerId)` → 2 lesões do mesmo jogador no mesmo jogo: `onConflictDoUpdate` mantém o último (aceito).
- Se cair (ex.: SportMonks parar de mandar `type.developer_name`): PARAR e atualizar este Plano, não chutar mapeamento.

### Decisões

- D1: `type` grava `"Missing Fixture"` | `"Questionable"` (de `developer_name === "DOUBTFUL"`), NÃO o `developer_name` cru — driver: o read path (`shared.ts:912,888,406`) é load-bearing nessas strings; descartado: `type=developer_name` (rec. preliminar desta conversa) porque quebraria os reads e exigiria editá-los; pagamos: a categoria fina ("Hamstring Injury") vive em `reason`, não em `type`.
- D2: ignorar `sidelined.sideline` — driver: 17% cobertura + `games_missed` cumulativo inútil; o read path conta linhas p/ "jogos perdidos". Pagamos: sem data de início/fim da lesão (não usada hoje).
- Adiadas pro /i: nome exato do contador de log, posição precisa do loop dentro de `main()`.

### Passos

**P1 [dados] esqueleto** — `apps/api/src/db/sync-sportmonks.ts`: (a) estender `SmFixture` (`:107-118`) com `sidelined?` (shape no dossiê §Mapa-de-tipo); (b) anexar `;sidelined.player;sidelined.type` ao include em `:292`; (c) após o loop de eventos (`~:498`), novo loop sobre `f.sidelined` fazendo upsert em `injury` com o mapa de tipo de D1, guardando itens sem player/team/match resolvido (espelha `:467-470`) + `console.log` de contagem. Detalhe: dossiê §Mapa-de-tipo. Prova: `cd apps/api && bun run db:sync` conclui sem erro **e** `select count(*) filter (where type='Missing Fixture') as out, count(*) filter (where type='Questionable') as doubt from injury` → ambos > 0.
**P2 [api] (depende: P1)** — sem código novo: confirma que o read path existente acende. Escolher um `match.id` com desfalque conhecido e bater `GET /v1/matches/:id/injuries`. Prova: resposta com `home`/`away` não-nulos, `absences[]` não-vazio, e ao menos um `didNotPlay:true` e um `didNotPlay:false` no conjunto. ✅ (Liverpool×Bournemouth: fora 5/6 + dúvida "Doubtful" `didNotPlay:false`; consecutiveOut derivado.)

### Verificação final

- `bun run typecheck` limpo (apps/api)
- `bun run db:sync` conclui; assert no banco: `select type, count(*) from injury group by type` mostra `Missing Fixture` e `Questionable` > 0 (P1)
- `GET /v1/matches/:id/injuries` populado p/ um jogo com desfalques (P2); painel de desfalques do jogo no Chrome renderiza lista (golden path LIG-002)
- re-teste leve do perfil do jogador (LIG-001): stat "jogos perdidos" sai de 0 p/ valor real em jogador sabidamente lesionado
- subagent em contexto fresco revisa o diff contra A1/A2 — diff fora de `sync-sportmonks.ts` (+ `SmFixture`) = achado

### Pré-mortem e rollback

3 semanas depois, quebrou. Causas mais prováveis:
- C1: SportMonks muda `type.developer_name`/some com `DOUBTFUL` → tudo cai num só bucket; sintoma: painel só mostra "dúvida" ou só "fora"; mitigação: o assert de P1 (ambos os valores > 0) é gate, não polish.
- C2: include `sidelined` removido/bloqueado se o tier sair do trial (expira 2026-07-12) → `injury` para de crescer no re-sync; sintoma: contagem estagnada; detecção: o `console.log` de contagem por sync.
- C3: jogador-stub sem posição polui a futura faceta `ia`; sintoma: direção por posição sem posição; mitigação: é non-goal explícito + follow-up.
Rollback por classe: ingestão pura → `git revert` do passo; **não há migração** (schema intacto), então nada de contract a desfazer. O rollback NÃO desfaz linhas de `injury` já gravadas (re-rodar sync recompõe; truncate manual se preciso).

### Fora de escopo

- Faceta `ia` (sinal por posição/timing) → já é a tarefa `ia` da própria SIN-011, fase futura.
- Enriquecer player-stub lesionado (posição/foto via `sidelined.player`) → criar `docs/features/ligas/LIG-004-enriquecer-jogador-desfalcado.md` (status: ideia, depende_de: [SIN-011]) quando a faceta `ia` pedir posição.

## Evidências

- [doc] docs/regras/lesoes.md — regra completa do sinal (faceta ia).
- [doc] docs/investigacoes/desfalques-sportmonks-estudo.md — `sidelined` real: 100% cobertura, `DOUBTFUL`="Questionable", `games_missed` cumulativo descartado.
- [código] apps/api/src/modules/leagues/shared/shared.ts:912 — `didNotPlay = type === "Missing Fixture"`: read path load-bearing na string (sustenta D1).
- [código] apps/api/src/db/sync-sportmonks.ts:291-292 — include sem `sidelined`; :450-460 `ensurePlayer`; :462-498 loop de eventos (ponto de inserção).
- [banco] `select count(*) from injury` = 0 (2026-06-28) — tabela vazia hoje.

## Verificação

Faceta **`dados`** implementada e provada (2026-06-28). A faceta **`ia`** (o sinal por posição/timing) segue `investigado` — fase futura, non-goal deste plano.

- **P1 [dados] — A1 ✅** `bun run db:sync` concluiu (`injuries: 3334`); assert no banco `group by type`: `Missing Fixture` = 3121, `Questionable` = 213 (ambos > 0). `reason` carrega a causa ("Hamstring Injury", "Red Card Suspension", "Doubtful"…).
- **P2 [api] — A2 ✅** `GET /v1/matches/:id/injuries` em Liverpool×Bournemouth: `home`/`away` não-nulos, fora 5/6, dúvida `didNotPlay:false` reason "Doubtful" — mapeamento de `type` correto.
- **Blast radius LIG-001 ✅** `GET /v1/players/:id` (A. Isak): `matchesOut: 20` (era 0), `consecutiveOut` derivado das linhas por-jogo — o segundo consumidor de `injury` acende.
- **Revisor em contexto fresco** (diff de `sync-sportmonks.ts` no commit `81072b5`): nenhum gap — mapeamento bate com `shared.ts:912`, guardas defensivas idênticas ao loop de eventos, target de upsert e include corretos.
- **Não executado:** render do painel de desfalques no Chrome (golden path LIG-002) — UI inalterada por este trabalho; o contrato da API que ela consome está provado acima. `bun run typecheck` (apps/api) limpo.
