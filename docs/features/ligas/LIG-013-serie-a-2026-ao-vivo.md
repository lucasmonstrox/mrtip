---
id: LIG-013
titulo: Série A 2026 ao vivo (sync incremental e resiliente)
modulo: ligas
status: ideia # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: ideia # sync incremental, backoff em 429, retomada, agendamento
testada: nao # nao | parcial | sim
testes: []
depende_de: [LIG-012] # o sync parametrizado e as generalizações nascem lá
impacta: [MOD-004, SIN-008, MOD-009] # temporada viva vira insumo de pick e de sinais de calendário
ancoras:
  settings: []
  tabelas: [match, season, standing]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/serie-a-brasileirao-migracao-sportmonks.md]
verificado_em: null
atualizado: 2026-07-19
---

# Série A 2026 ao vivo (sync incremental e resiliente)

## Descrição

> **ESCOPO MUDOU (2026-07-19, no fim do `/i` do LIG-012): a 2026 JÁ ESTÁ NO BANCO.** O dono pediu a
> sincronização da temporada corrente durante o LIG-012 e ela foi feita com o sync parametrizado —
> season `26763`, **380 partidas, 20 clubes, 182 disputadas / 198 a disputar, marcada `is_current`**.
> Logo esta feature **não é mais "ingerir a 2026"**: a carga inicial está feita, e o que falta é
> exatamente o que a carga única não resolve — **manter atualizada**. O que sobra aqui:
> sync incremental (hoje só existe o one-shot, que re-varre a temporada inteira), backoff em 429,
> retomada, e agendamento. Sem isso o dado **envelhece a partir de 2026-07-19** e só atualiza quando
> alguém rodar o comando na mão:
> `bun run db:sync --league 648 --season 26763 --code BRA --timezone America/Sao_Paulo`
> O gate de go-live abaixo (latência da escalação pré-jogo) **continua valendo** — ter o dado no banco
> não é o mesmo que poder gerar pick com ele.

**Passo 2 dos 2** da entrada da Série A no produto. O LIG-012 ingere a temporada **2025, encerrada** — base de
histórico e calibração, mas não apostável. Esta feature põe a temporada **2026 em curso** (season SportMonks
`26763`, 380 jogos, ~182 já FT) no ar, o que exige o que uma temporada viva exige e uma encerrada não: sync
**incremental** (o sync da PL foi one-shot de temporada encerrada), agendamento, e resiliência de rede.

O cliente HTTP hoje lança em qualquer não-2xx, sem retry, backoff ou retomada, e ninguém lê o `rate_limit` que a
própria API expõe no envelope (limite de 2000 req/h por entidade). Uma varredura de temporada viva com uploads no
R2 não cabe em "roda e torce".

**Gate de go-live declarado**: medir a latência real de escalação pré-jogo no Brasileirão antes de gerar pick —
toda a cobertura conhecida foi medida em jogos encerrados, onde a escalação sempre existe. O que decide aposta é
a escalação sair ~1h antes do apito.

## Tarefas

- [ ] dados — backoff e retry no cliente SportMonks; ler `rate_limit` do envelope; retomada de sweep interrompido
- [ ] dados — sync incremental da season em curso (só o que mudou), com agendamento
- [ ] dados — medir latência de escalação pré-jogo no BR numa rodada real, antes de qualquer pick

## Evidências

- [doc] investigação `docs/investigacoes/serie-a-brasileirao-migracao-sportmonks.md` §7 item 1 — o gate de
  latência de escalação no BR, ainda não medido; e §2, que registra o cliente sem retry/backoff/retomada

## Verificação

_(preencher quando status=verificado)_
