---
id: SIN-018
titulo: Sinal — viés favorito-azarão e dinheiro recreativo
modulo: sinais
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [SIN-012]
impacta: [SIN-012]
ancoras:
  settings: []
  tabelas: [match_odds]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/vies-favorito-azarao.md]
verificado_em: null
atualizado: 2026-06-21
---

# Sinal — viés favorito-azarão e dinheiro recreativo

## Descrição

Viés comportamental clássico de mercado: o **favorite-longshot bias** (azarões sobre-apostados, favoritos com valor) e o **dinheiro recreativo** concentrado em times de torcida grande, que infla a odd do popular → valor em fadear o público. Complementa o SIN-012 (CLV/closing line) pelo lado comportamental: identifica *onde* a linha é menos eficiente por viés sistemático do apostador casual, não só por movimento sharp.

## Tarefas

- [x] dados — evidência do favorite-longshot bias no futebol, magnitude por liga/mercado, proxies de "dinheiro recreativo". → investigado: ver [docs/investigacoes/vies-favorito-azarao.md](../../investigacoes/vies-favorito-azarao.md). Não exige tabela nova (FLB é leitura de `match_odds`); proxies de torcida BR ficam NEI.
- [x] ia — como o motor/validação usa o viés sem dupla-contagem com a CLV (SIN-012). → **EXPLICAR + guard-rail VALIDAR, NÃO ESTIMAR**: FLB/recreativo já estão na closing sharp/exchange; entram como insumo do devig (Shin) e filtro negativo ("evitar longshot caro"), nunca como termo aditivo de probabilidade.

## Evidências

> Investigação verificada (2026-06-21). Veredito: **EXPLICAR + guard-rail VALIDAR**, não ESTIMAR — FLB e dinheiro recreativo são reais mas majoritariamente de varejo/quote-driven; em casa sharp e exchange estão comprimidos a ~0 e não geram edge. Modelá-los como sinal que move probabilidade dupla-contaria o SIN-012.

1. **Favorito-only continua EV-negativo (FLB não é edge).** Pinnacle soccer (27.150 jogos 2012–2020) aloca margem quase igual por resultado, e ainda assim todos os resultados ficam EV−; favorito só perde menos. DataGolf — *Favorite-Longshot: Not a Bias*: https://datagolf.com/fav-longshot-not-a-bias
2. **Closing line sharp é calibrada, sem padrão favorito-azarão.** football-data.co.uk, eficiência Pinnacle (~87.960 pares de odds, desde 2012/13): https://www.football-data.co.uk/blog/pinnacle_efficiency.php
3. **FLB de varejo é grande no rabo de longshot, mas é fenômeno bookmaker.** Cain, Law & Peel (2000), futebol UK: ~2% de perda em odds curtas vs ~15% em odds longas. https://ideas.repec.org/a/bla/scotjp/v47y2000i1p25-36.html
4. **FLB emerge de aversão a risco + carga de margem (mecanismo, não declínio temporal).** Whelan (2024, Economica, doi 10.1111/ecca.12500): https://onlinelibrary.wiley.com/doi/10.1111/ecca.12500 · resumo https://www.karlwhelan.com/sports-betting-risk-aversion-and-biased-odds/
5. **Bookmakers quote-driven dão odds mais favoráveis a clubes populares (sentimento).** Franck, Verbeek & Nüesch (16.000+ jogos ingleses); efeito do regime quote-driven, não da exchange. https://ideas.repec.org/p/iso/wpaper/0089.html
6. **ADVERSARIAL: fade-the-public não vira retorno positivo — transparência de preço impede.** Flepp, Nüesch & Franck (2016): "We do not find that this volume imbalance is associated with systematic biases in bettor returns… High price transparency seems to prevent bookmakers from systematically distorting their odds". https://ideas.repec.org/a/sae/jospec/v17y2016i1p3-11.html
7. **Books exploram viés sistemático do apostador via shading do preço.** Levitt (2004, Economic Journal): "systematically exploit bettor biases by choosing prices that deviate from the market clearing price". https://academic.oup.com/ej/article-abstract/114/495/223/5086012
8. **AH compartilha as ineficiências do 1X2 (corrige afirmação interna).** Constantinou (arXiv 2003.09384, 13 temporadas EPL) — AH não é "sem FLB / eficiente"; atribuição interna a "Hegarty & Whelan" do arXiv 2003.09384 está trocada. https://arxiv.org/abs/2003.09384
