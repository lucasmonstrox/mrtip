---
id: AGT-002
titulo: Agente — raciocínio de seleção do melhor mercado
modulo: agente
status: ideia
prioridade: P1
facetas:
  ia: ideia
  api: ideia
testada: nao
testes: []
depende_de: [DOS-001, MOD-001, SIN-012]
impacta: []
ancoras:
  tools: []
  funcoes: []
docs: []
verificado_em: null
atualizado: 2026-06-18
---

# Agente — raciocínio de seleção do melhor mercado

## Descrição

O cérebro do produto: dado o dossiê de um jogo (DOS-001) + os sinais (SIN-*) + as probabilidades do quant (MOD-001), como o agente **decide qual é o melhor mercado/aposta** (1X2, O/U, BTTS, cartões, escanteios, props), ranqueia por valor (EV+/CLV) e explica o porquê com as fontes. Investigar a arquitetura de raciocínio (quant estima × LLM explica/orquestra), padrões de agente LLM para decisão sob incerteza, como o mercado/sindicatos fazem, e os anti-padrões (dupla-contagem vs closing line, overfitting, número alucinado).

## Tarefas

- [ ] ia — investigar arquitetura de raciocínio e seleção de mercado
