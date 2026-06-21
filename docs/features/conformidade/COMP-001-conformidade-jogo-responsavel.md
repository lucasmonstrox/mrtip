---
id: COMP-001
titulo: Conformidade e jogo responsável (Lei 14.790 / Portaria SPA 1.231)
modulo: conformidade
status: investigado
prioridade: P1
facetas:
  ui: investigado # gate +18, disclaimers (≥10%), rótulo de publicidade
  api: investigado # limites prudenciais, autoexclusão, whitelist de operadores
  ia: investigado # regras de linguagem dos picks (sem renda/investimento/promessa)
testada: nao
testes: []
depende_de: []
impacta: [AGT-001, AGT-002]
ancoras:
  settings: [jogo_responsavel, limites_prudenciais]
  tabelas: [operadores_licenciados]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/regulacao-br-apostas-produto.md]
verificado_em: null
atualizado: 2026-06-18
---

# Conformidade e jogo responsável (Lei 14.790 / Portaria SPA 1.231)

## Descrição

Camada transversal de conformidade regulatória BR. Não é rodapé jurídico — é **restrição de produto**: como picks/value-bets podem ser apresentados (proibido prometer ganho/renda/investimento), gate +18, disclaimers obrigatórios (≥10%), jogo responsável como **mecanismo** (limites prudenciais + autoexclusão), e whitelist de operadores **.bet.br licenciados** (responsabilidade solidária por divulgar operador ilegal). `impacta` o agente (AGT-001/002) porque toda explicação/apresentação de pick deve obedecer às regras de linguagem.

## Tarefas

- [ ] ia — regras de linguagem do agente: banir "lucro/renda/ganho garantido"; enquadrar como "probabilidade calibrada + risco explícito".
- [ ] ui — gate +18 + disclaimer de jogo responsável; rótulo "publicidade/parceria paga" em conteúdo afiliado.
- [ ] api — limites prudenciais (tempo/perda/depósito/nº), autoexclusão simplificada; whitelist de operadores licenciados.

## Recomendação (investigado, 2026-06-18)

A regulação é restrição de 1ª ordem e **converge com o diferencial de "honestidade auditável"** do [panorama](../../research/panorama-concorrentes.md): enquadrar tudo como **probabilidade calibrada + risco**, nunca renda/lucro. **Afiliado é alcançado** pelas regras (compensação por resultado) com responsabilidade solidária; **só linkar casas .bet.br licenciadas**. Jogo responsável = mecanismo, não aviso. Paisagem em revisão (2026) → desenhar conservador. Detalhes em [docs/investigacoes/regulacao-br-apostas-produto.md](../../investigacoes/regulacao-br-apostas-produto.md).

## Evidências

- [doc] [docs/investigacoes/regulacao-br-apostas-produto.md](../../investigacoes/regulacao-br-apostas-produto.md) — investigação completa (regras + implicações de produto).
- [web] https://baptistaluz.com.br/publicidade-de-apostas-novidades-da-portaria-spa-mf-n-1-231-2024/ — afiliado = compensação por resultado; responsabilidade solidária.
- [web] https://igamingbrazil.com/legislacao/2026/02/19/ministerio-da-fazenda-prioriza-fiscalizacao-da-publicidade-de-bets-e-mira-influenciadores-em-2026/ — fiscalização mira afiliados; responsabilidade tributária por operador ilegal.
