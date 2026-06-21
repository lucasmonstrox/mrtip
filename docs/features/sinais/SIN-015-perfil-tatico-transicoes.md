---
id: SIN-015
titulo: Sinal — perfil tático (transições, contra-ataque, linhas e zonas)
modulo: sinais
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P3 # P1 | P2 | P3
facetas:
  dados: investigado # gate: fingerprint básico viável (posse/counter/Pressure Index); rico (PPDA/altura de linha/xT) inviável barato
  ia: investigado # EXPLICAR é o destino (perfil por zona/momento); contra-ataque NÃO vira ESTIMAR autônomo (já precificado)
testada: nao
testes: []
depende_de: [DOS-001, MOD-001]
impacta: []
ancoras:
  settings: []
  tabelas: []
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/sinal-perfil-tatico-transicoes.md]
verificado_em: null
atualizado: 2026-06-21
---

# Sinal — perfil tático (transições, contra-ataque, linhas e zonas)

## Descrição

Perfil tático por time ao longo dos 4 momentos (organização ofensiva/defensiva + transições)
e por zona de campo, mais o canal contra-ataque vs linha alta. Duas faces: (A) **EXPLICAR** —
vocabulário + fingerprint por clube que o assistente usa pra narrar o "porquê" (zona×momento),
ancorado no número e sem movê-lo; (B) **ESTIMAR** — o contra-ataque/transição vs linha alta como
candidato a edge, condicionado a dado disponível + sobrevivência à CLV (SIN-012). Especializa a
refutação-mãe [[leitura-de-jogo-profundidade-dominio]] e a irmã [[SIN-014]] (formação).

## Tarefas

- [ ] dados — gate de viabilidade: que métricas táticas por time/zona existem p/ Brasileirão+PL e a que custo/licença
- [ ] ia — camada EXPLICAR: modelo espacial + 4 momentos + fingerprint por clube (tag EXPLICATIVO-NÃO-PREDITIVO)
- [ ] ia — hipótese ESTIMAR: contra-ataque vs linha alta, só com peso se sobreviver ao backtest vs CLV

## Plano

_(gerado pelo `/pl` quando a feature for planejada.)_

## Evidências

- [doc] [docs/investigacoes/sinal-perfil-tatico-transicoes.md](../../investigacoes/sinal-perfil-tatico-transicoes.md) — investigação completa (modelo espacial + gate de dado + veredito Parte B)
- [paper] https://journals.sagepub.com/doi/10.1177/15270025231204997 — Winkelmann et al. 2024: ineficiências pré-jogo não persistentes/sistemáticas → contra-ataque NÃO vira ESTIMAR
- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC11524524/ — conversão contra-ataque 13,4% vs 8,8%; xG retail subprecifica fast-break (a única ponta de gap)
- [Opta] https://theanalyst.com/articles/premier-league-counter-attacks-verticality-transitions-guardiola-iraola — xG/chute 0,17/0,12/0,09; 7,1% dos gols; eixos de playing style
- [SportMonks] https://www.sportmonks.com/football-api/serie-a-api-brazil/ — cobertura real do Brasileirão: básicos + xG/Pressure add-on; PPDA/xT/counter NÃO confirmados na liga
- [SportMonks] https://www.sportmonks.com/glossary/key-data-points/ — gotcha: PPDA/xT/field tilt são glossário de marketing, ≠ type_id entregável
- [doc] [docs/investigacoes/sinal-formacao-tatica.md](../../investigacoes/sinal-formacao-tatica.md) — irmã (formação=EXPLICAR; `observation` de tática; altura de linha/PPDA tangenciados)

## Verificação

_(preencher quando status=verificado)_
