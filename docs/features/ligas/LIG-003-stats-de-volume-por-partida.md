---
id: LIG-003
titulo: Stats de volume por partida (chutes, passes, desarmes, faltas)
modulo: ligas
status: ideia # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: ideia # alargar lineupDetailTypes no sync + colunas em lineup_player + re-sync
  api: ideia # expor os stats de volume + per-90 + hit-rate por threshold
  ui: ideia # seção de volume na página do jogador (over/under de chutes/SoT/desarmes/faltas)
testada: nao
testes: []
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
atualizado: 2026-06-28
---

# Stats de volume por partida (chutes, passes, desarmes, faltas)

## Descrição

O maior unlock de produto de apostador, separado de LIG-001 por ser `dados`-pesado. Hoje o sync filtra `lineupDetailTypes:118,119,1490` (`apps/api/src/db/sync-sportmonks.ts:265`) — só rating/minutos/MOTM. Os ~12 types de aposta vêm na **mesma chamada** (`fixtures?include=lineups.details.type`), basta alargar o filtro + colunas em `lineup_player` + re-sync: chutes(86 SoT, total), passes(80/116/1584), key-passes(117), desarmes(78), interceptações(100), duelos(105/106), dribles(108/109), toques(120), faltas(56/96). Destrava props de volume (over/under de chutes/SoT/desarmes/faltas), per-90 e hit-rate empírico por threshold. Investigação: `docs/investigacoes/pagina-do-jogador.md`. **Não confunde com xG** (add-on pago) nem xA (inexistente na SportMonks).

## Tarefas

- [ ] dados — alargar `lineupDetailTypes` no sync + colunas de volume em `lineup_player`; re-sync e verificar preenchimento
- [ ] api — expor stats de volume agregados + per-90 + hit-rate por threshold no endpoint do jogador
- [ ] ui — seção de volume na página do jogador (com gate de amostra, igual ao per-90 de LIG-001)

## Plano

_(gerado pelo `/pl` quando planejada — depende de LIG-001 estar feito.)_

## Evidências

- [código] `apps/api/src/db/sync-sportmonks.ts:24,265,406-408` — filtro `lineupDetailTypes:118,119,1490` na mesma chamada que traria os stats de volume.
- [doc] `docs/investigacoes/pagina-do-jogador.md` — lista de types, settlement Opta, volume>gol como edge de sharp.

## Verificação

_(preencher quando status=verificado.)_
