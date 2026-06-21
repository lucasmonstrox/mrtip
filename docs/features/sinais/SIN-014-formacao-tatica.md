---
id: SIN-014
titulo: Sinal — formação tática (matchup de formações)
modulo: sinais
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P3 # P1 | P2 | P3
facetas:
  dados: investigado # ingestão da formação (declarada/confirmada) via SportMonks lineups
  ia: investigado # camada EXPLICAR: narrar matchup de formações como contexto, não como número
testada: nao
testes: []
depende_de: [DOS-001]
impacta: []
ancoras:
  settings: []
  tabelas: []
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/sinal-formacao-tatica.md]
verificado_em: null
atualizado: 2026-06-21
---

# Sinal — formação tática (matchup de formações)

## Descrição

Formação (4-4-2, 4-3-3, 3-5-2, 4-2-3-1, etc.) como sinal. A investigação conclui que é
majoritariamente **EXPLICAR** (contexto narrativo didático do "porquê"), não **ESTIMAR**:
o matchup de estilo/tática já foi refutado como edge pré-jogo em [[leitura-de-jogo-profundidade-dominio]],
e formação é um proxy ainda mais grosseiro (declarada ≠ real, fluida por fase/tempo, endógena ao elenco).
Serve para o assistente explicar o jogo (gaps por zona, jogo aéreo, espaço entre linhas, bola parada),
ancorado no número do quant/mercado, que ele nunca move.

## Tarefas

- [ ] dados — ingerir `formation` (declarada/confirmada) da SportMonks no dossiê (DOS-001), com proveniência
- [ ] ia — camada EXPLICAR: vocabulário de formação/zona/fase como contexto transparente, tag EXPLICATIVO-NÃO-PREDITIVO

## Plano

_(gerado pelo `/pl` quando a feature for planejada.)_

## Evidências

- [doc] [docs/investigacoes/sinal-formacao-tatica.md](../../investigacoes/sinal-formacao-tatica.md) — investigação completa
- [doc] [docs/investigacoes/leitura-de-jogo-profundidade-dominio.md](../../investigacoes/leitura-de-jogo-profundidade-dominio.md) — refutação-mãe (matchup de estilo ≠ edge)

## Verificação

_(preencher quando status=verificado)_
</content>
</invoke>
