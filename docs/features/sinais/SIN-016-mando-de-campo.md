---
id: SIN-016
titulo: Sinal — mando de campo (vantagem de jogar em casa)
modulo: sinais
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [MOD-001]
impacta: [SIN-006, SIN-007, SIN-008, MOD-001, DOS-001]
ancoras:
  settings: []
  tabelas: [team_ratings, match_features, estadios]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/mando-de-campo.md]
verificado_em: null
atualizado: 2026-06-21
---

# Sinal — mando de campo (vantagem de jogar em casa)

## Descrição

O mando é o maior fator isolado do futebol e o **confundidor central** citado por SIN-006 (clima), SIN-007 (rivalidade) e SIN-008 (calendário/fadiga) — vários "edges" se dissolveram em "isso é só efeito casa/fora". Investigar a **decomposição** do mando (torcida/pressão, viagem do visitante, viés de arbitragem pró-mandante, familiaridade do gramado), sua **magnitude histórica e o quanto encolheu** (incl. experimento natural de jogos sem público pós-COVID), e como modelá-lo como baseline limpo que os outros sinais modulam — sem dupla-contagem.

## Tarefas

- [ ] dados — fontes de mando por liga/temporada, separação dos componentes, série histórica.
- [ ] ia — baseline de mando no motor (MOD-001) que os outros sinais modulam; explicação.

## Investigação (2026-06-21)

Doc completo: [docs/investigacoes/mando-de-campo.md](../../investigacoes/mando-de-campo.md).

**Classificação:** mando é **BASELINE do ESTIMAR** (parâmetro de força no MOD-001 — γ do Dixon-Coles, idealmente time-específico), **não** sinal de edge. O mando cru já está na odd; o value vive nos **DESVIOS** mal precificados, que SIN-006/007/008 modulam e que SIN-012 (CLV) valida. Anti-dupla-contagem por fronteira de posse: MOD-001 dono do baseline, os sinais donos só dos desvios incrementais. Jogos sem público (COVID) isolaram os componentes: torcida+arbitragem respondem por >50% do mando; o viés de árbitro pró-mandante some sem torcida.

## Evidências

- [Sky Sports/Between the Lines](https://www.skysports.com/football/news/11095/13511444/home-advantage-is-on-the-wane-in-the-premier-league-between-the-lines) — vitórias em casa no top inglês 65% (1895) → 42% (2023-24), queda proporcional ~36%; na COVID, fora superou casa (40% vs 38%).
- [No Fans–No Pressure (PMC8416626)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8416626/) — 1.286 jogos/8 ligas: sem público, amarelos do mandante +26,2% (p<0,001); viés de arbitragem pró-mandante desaparece; vitórias 48,1%→39,8%.
- [arXiv 2008.05417](https://arxiv.org/pdf/2008.05417) — Bundesliga sem público: casas continuaram superprecificando o mandante; apostar contra rendeu ROI ~4-7% → o edge está no DESVIO mal precificado, não no mando.
- [Nortis Journal](https://nortisjournal.com/index.php/pub/article/view/6) — Brasileirão: mandante 57,9% (2019) → 44,9% (2020 sem público) → 48,6% (2022), p=0,004; recuperação só parcial = queda estrutural.
- [Extending Dixon-Coles (arXiv 2307.02139)](https://arxiv.org/pdf/2307.02139) — DC padrão usa γ global único; refinamentos usam mando time-específico que absorve altitude/estádio automaticamente.
- [Pollard via ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1469029211001658) — 7 componentes do mando: torcida, viagem, familiaridade, territorialidade, tática, psicológico, arbitragem.
