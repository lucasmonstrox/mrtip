---
id: LIG-003
titulo: Stats de volume por partida (chutes, passes, desarmes, faltas)
modulo: ligas
status: em-andamento # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: feito # lineupDetailTypes alargado + colunas em lineup_player + backfill (migrações 0019 e 0039)
  api: ideia # falta hit-rate por threshold; os agregados de season já saem no PlayerDetail
  ui: ideia # falta a seção de over/under por threshold; os cards temáticos já mostram os volumes
testada: sim
testes:
  - "migração 0019 aplicada; backfill atualizou 15.179 lineup_player; interceptions/tackles/duels/passes/crosses/dribbles/big-chances-missed por jogador (2026-06-30)"
  - "probe PL 25/26: 78/100/106/80/98/99/108/109/581 confirmados per-jogador no lineups.details; %s e attacks/long-passes/headers só nível-time (2026-06-30)"
  - "tese do desfalque validada: top interceptadores por time (Caicedo/Chelsea 2.2/jogo, Garner/Everton 2.0/jogo) → query jogador→time funciona (2026-06-30)"
  - "cobertura medida em 200 jogos da PL 25/26 (não 1 fixture): a entrega real é de 74 types por jogador e 45 por time — types esparsos (571/114/115/582/113/112) só aparecem quando o lance acontece, por isso sondagem de amostra única subconta (2026-07-20)"
  - "migração 0039 + backfill-defensive-stats.ts: 12.618 linhas de lineup_player em 1.536 jogos; 571 erro-que-virou-gol=638, 114 pênaltis cometidos=374, 115 pênaltis ganhos=303, 95 impedimentos provocados=1.981, 121 bolas entregues=19.225, 582 corte na linha=326 (2026-07-20)"
  - "sanity check da cobertura: 95 pênaltis cometidos em 380 jogos da PL 25/26 = 0,25/jogo, batendo com a taxa base de mercado (~0,25–0,30) de docs/mercados/penalti-expulsao-eventos.md — prova que o dado é completo, não amostral (2026-07-20)"
  - "verificado no navegador (chrome-devtools + agent-browser), os 6 campos renderizando: Joachim Andersen 25/26 → Defesa com 16 impedimentos provocados e 2 erros que viraram gol, Construção com 13 bolas entregues, Disciplina com 1 pênalti cometido; Dominic Calvert-Lewin 25/26 → 3 cortes em cima da linha e 2 pênaltis ganhos; sem erro de console (2026-07-20)"
depende_de: [LIG-001]
impacta: []
ancoras:
  settings: []
  tabelas: [lineup_player]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/pagina-do-jogador.md]
verificado_em: null
atualizado: 2026-07-20
---

# Stats de volume por partida (chutes, passes, desarmes, faltas)

## Descrição

O maior unlock de produto de apostador, separado de LIG-001 por ser `dados`-pesado. Hoje o sync filtra `lineupDetailTypes:118,119,1490` (`apps/api/src/db/sync-sportmonks.ts:265`) — só rating/minutos/MOTM. Os ~12 types de aposta vêm na **mesma chamada** (`fixtures?include=lineups.details.type`), basta alargar o filtro + colunas em `lineup_player` + re-sync: chutes(86 SoT, total), passes(80/116/1584), key-passes(117), desarmes(78), interceptações(100), duelos(105/106), dribles(108/109), toques(120), faltas(56/96). Destrava props de volume (over/under de chutes/SoT/desarmes/faltas), per-90 e hit-rate empírico por threshold. Investigação: `docs/investigacoes/pagina-do-jogador.md`. **Não confunde com xG** (add-on pago) nem xA (inexistente na SportMonks).

## Tarefas

- [x] dados — alargar `lineupDetailTypes` no sync + colunas de volume em `lineup_player`; re-sync e verificar preenchimento ✓ migração 0019, backfill 15.179 linhas
- [x] dados — erro individual e evento raro decisivo: 571 erro-que-virou-gol, 114 pênalti cometido, 115 pênalti ganho, 95 impedimento provocado, 121 bola entregue, 582 corte na linha ✓ migração 0039, backfill 12.618 linhas (2026-07-20)
- [ ] api — expor stats de volume agregados + per-90 + hit-rate por threshold no endpoint do jogador
- [ ] ui — seção de volume na página do jogador (com gate de amostra, igual ao per-90 de LIG-001)
- [ ] ia — agregar volume defensivo por time descontando desfalques (tese do desfalque → espaço de criação do adversário) e alimentar o prognóstico

## Plano

_(gerado pelo `/pl` quando planejada — depende de LIG-001 estar feito.)_

## Evidências

- [código, histórico] `apps/api/src/db/sync-sportmonks.ts` — o filtro `lineupDetailTypes:118,119,1490` era o gargalo original. **Já não existe**: foi removido em 2026-07-03 porque a API limita cada filtro a 50 ids e o `STAT` passou disso. Hoje o fetch (`sync-sportmonks.ts:304-305`) manda só `fixtureStatisticTypes` e `trendTypes`, vêm todos os 74 types de jogador e o mapa `STAT` escolhe. Reintroduzir o filtro trunca em silêncio.
- [doc] `docs/investigacoes/pagina-do-jogador.md` — lista de types, settlement Opta, volume>gol como edge de sharp.
- [código] `apps/api/scripts/backfill-defensive-stats.ts` — backfill dos 6 types de 2026-07-20 sem re-sync (mesmo padrão do `backfill-referees.ts`).
- [código] `apps/api/scripts/_probe-def-cobertura.ts` e `_probe-def-pedidos.ts` — medem cobertura por type em 200 jogos; é o método que separa "a liga não entrega" de "o lance não aconteceu".
- [armadilha] O mapa `STAT` existe **duplicado**: local em `sync-sportmonks.ts:47` (usado pelo sync) e exportado em `sync-ingest.ts:23` (usado pelos scripts). Adicionar type em só um dos dois passa no typecheck do script e não popula no sync — os dois precisam da mesma entrada.

## Verificação

_(preencher quando status=verificado.)_
