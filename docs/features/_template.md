---
id: XXX-000
titulo: Título curto da feature
modulo: nome-da-pasta
status: ideia # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas: # só as superfícies que se aplicam; mesma escala do status
  dados: ideia # ingestão/normalização de fontes, schema, persistência
  api: ideia # rotas/handlers backend
  ia: ideia # assistente conversacional + motores quant/LLM (sempre com o "porquê")
  ui: ideia # apps/web (Next.js)
testada: nao # nao | parcial | sim
testes: [] # evidências: "E2E Chrome 8/8 (2026-06-18)", scripts, asserts no banco
depende_de: [] # pré-requisitos (IDs); o check proíbe ciclos
impacta: [] # quem re-testar se isso mudar (IDs)
ancoras: # pontos compartilhados que ESTA feature toca
  settings: []
  tabelas: []
  tools: [] # ferramentas do assistente de IA
  funcoes: []
  rotas: []
docs: [] # paths de docs/investigacoes|planos|arquitetura
verificado_em: null # data, obrigatório quando status: verificado
atualizado: 2026-06-18
---

# Título curto da feature

## Descrição

O que é, pra quem (apostador? tipster?), e o comportamento esperado em 2-5 linhas.

## Tarefas

- [ ] dados — …
- [ ] api — …
- [ ] ia — …
- [ ] ui — …

## Plano

_(gerado pelo `/pl` quando a feature for planejada: passos P1..Pn com Prova executável; as Tarefas viram espelho 1:1 dos passos. Sem plano ainda? Apague esta seção.)_

## Evidências

_(links que sustentam decisões e diagnósticos — SÓ o que foi útil, com 1 linha do que cada um prova; nada de histórico de busca)_

- [web] https://… — o que esta fonte prova
- [issue] https://github.com/<pacote>/issues/… — confirma a causa / dá o workaround
- [commit] `abc1234` — introduziu a regressão / decisão passada relevante
- [código] `arquivo:linha` — comportamento real observado

## Verificação

_(preencher quando status=verificado: como foi provado — E2E no Chrome, chamada ao motor de IA, assert no banco, request à API)_
