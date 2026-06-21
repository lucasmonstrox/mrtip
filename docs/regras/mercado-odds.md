# Regra de prognóstico — Mercado e movimento de odds

> Como o **mercado de odds** entra na pipeline do mrtip. Não é "mais uma dimensão": é o **árbitro de valor** de todas as outras. O motor de **value bet** ([overview §5](../visao-geral.md#5-proposta-de-valor--o-que-o-mrtip-entrega)) só existe se a probabilidade do modelo for comparada a uma linha de referência **eficiente**.

- **Status:** rascunho inicial (v0) — investigado, alta confiança.
- **Última atualização:** 2026-06-18
- **Papel:** camada transversal — define **se** e **onde** os sinais das outras regras (clima, rivalidade, árbitro, motivação, lesões, calendário) viram EV+.

---

## 1. Por que o mercado importa

A **linha de fechamento** (closing line) de uma casa sharp incorpora quase toda a informação disponível — é o preço mais eficiente do mercado. Logo, a melhor medida de que um pick é **+EV** não é se ele *ganhou*, mas se ele **bateu a linha de fechamento** (Closing Line Value, CLV). Isso reposiciona o produto: o mrtip não precisa "prever o jogo" melhor que todos; precisa achar onde a sua probabilidade **diverge de uma linha eficiente** — e medir CLV como KPI.

> **Regra-base:** use a **Pinnacle vig-free** (ou Betfair Exchange perto do off) como probabilidade-âncora "verdadeira". Só há value bet se a odd ofertada implicar probabilidade **menor** que a âncora — ou seja, se você espera **bater o fechamento** (CLV+).

---

## 2. Sinais e heurísticas

| Sinal | Evidência | O que significa | Uso no mrtip | Força |
|---|---|---|---|---|
| **Closing line sharp ≈ verdade** | Pinnacle: calibração quase perfeita no agregado; blind betting no fechamento -3,3% (Pinnacle) vs -7% (Bet365/DraftKings) | A closing vig-free ≈ probabilidade real | **âncora** de valor | **Forte** |
| **CLV como preditor de lucro** | Bater a closing consistentemente ⇒ lucrativo no longo prazo (lei dos grandes números) | Melhor KPI que win rate (dominada por variância) | **KPI principal** ex-post | Moderada |
| **Pinnacle = benchmark** | Margem ~2%, aceita sharps, limites altos; move pouco rumo a concorrentes | A "linha de referência" | usar como fair odds | **Forte** |
| **Steam move / Reverse Line Movement** | Sinaliza dinheiro sharp; RLM = linha move contra a maioria das apostas | Para onde a closing vai migrar | entrar **antes** da soft ajustar | Moderada (⚠️ ~90% é ruído) |
| **Favourite-longshot bias** | Longshots pagam abaixo do justo; favoritos pesados ROI ~0 | Viés estrutural | evitar longshots; pouco edge em favorito pesado líquido | **Forte** (mas encolhendo) |
| **Overreaction / não totalmente eficiente** | Autocorrelação negativa nos movimentos; spreads/totals explicam só ~79-86% | Mercado erra mais em jogos de **baixa visibilidade** | **fadear** movimentos exagerados em ligas menores | Moderada |

> ⚠️ **Cuidado com o "r²=0,997".** Esse número (Pinnacle vs resultados) é **calibração agregada**, não "acerta 99,7% dos jogos". A closing está certa **em média**, não jogo a jogo — é exatamente por isso que sobra espaço para divergir num jogo específico.

---

## 3. Como aplicar no pick

1. **Âncora:** pegar a probabilidade de referência (Pinnacle/Betfair), **remover a margem** (vig-free).
2. **Comparar** com a odd ofertada na casa-alvo (geralmente soft, margem maior, linha menos eficiente).
3. **Apostar só quando** a odd ofertada > odd justa da âncora (EV+ esperado / CLV+).
4. **Movimento:** RLM/steam na Pinnacle indica o lado para onde a closing vai — entrar **cedo, no mesmo lado do dinheiro sharp**, antes de a soft ajustar (janela curta). Confiar mais em RLM com **divergência aposta-vs-dinheiro** do que em movimento bruto.
5. **Medir CLV ex-post** (Pikkit/OddsJam) como **KPI nº 1** — é o melhor proxy de que os picks são +EV, acima da taxa de acerto de curto prazo. Casa diretamente com o **histórico auditável** do produto.

> **Onde há valor:** (a) **ligas/mercados de baixa visibilidade** (closing menos eficiente, overreaction a fadear); (b) **longshots evitados** (não apostar contra o justo); (c) a **janela** antes de a soft acompanhar o sharp. **Onde não há:** favoritos pesados em mercados líquidos/sharp (viés já comprimido).

---

## 4. O alerta central: não dupla-contar com o mercado

Esta é a regra que governa **todas** as outras. Se um sinal do mrtip (chuva, derby, árbitro, desfalque) **já moveu a linha**, o EV já evaporou. O valor de uma regra de contexto existe **só** quando ela é **ortogonal** à informação já embutida no fechamento — tipicamente em **ligas e mercados que o sharp não cobre bem**.

> Por isso o mercado é a **camada de validação**: cada regra de contexto deve ser testada contra a closing (CLV), não contra a frequência bruta do evento. "Sair under quando chove" só vale se **bater a linha** — não se a linha já estiver baixa.

---

## 5. Fontes de dados

| Fonte | O que dá | Custo | Cobertura |
|---|---|---|---|
| **Pinnacle** | Odds abertura/fechamento da casa sharp benchmark; fair odds vig-free | Grátis ler; sem API oficial | Futebol global + grandes esportes |
| **Betfair Exchange API** | Preços back/lay e volume; linha quase eficiente alternativa | App key + conta | Futebol, forte no UK |
| **The Odds API** | Odds históricas/ao vivo de muitas casas + abertura/fechamento → CLV, line movement, steam | Free ~500 req/mês; pago | Global |
| **OddsJam** | Odds em tempo real + closing + calculadora de CLV/EV + detecção de steam | Pago | Ampla US + internacional |
| **Pikkit** | Tracking automático de CLV da carteira (valida CLV→lucro) | Freemium | Casas US |
| **football-data.co.uk** | CSV grátis com odds de **abertura e fechamento** (Pinnacle, Bet365, Max/Avg) — backtest de CLV e do favourite-longshot bias | Grátis | Ligas europeias |

---

## 6. Limitações e cuidados

- **CLV→lucro é parcialmente teórico.** O que se mede direto é a **eficiência da closing**; a ponte para "lucro garantido" vale em mercados **líquidos** e **quebra em ilíquidos** (props, ligas menores), onde dá para lucrar sem bater o close — ou ter CLV+ ilusório por timing.
- **~90% do movimento de linha é ruído.** Steam costuma chegar **tarde** demais para capturar valor. RLM só é forte com divergência aposta-vs-dinheiro.
- **O viés favorito-longshot está encolhendo** em mercados maduros — menos explorável que no passado.
- **Acesso à Pinnacle/Betfair** pode exigir scraping/agregadores; validar ToS e estabilidade.
- **Risco de circularidade:** se o modelo do mrtip apenas reproduz o mercado, não há edge. O sinal próprio precisa ser **ortogonal** ao já precificado (§4).
- **Jogo responsável:** mesmo com CLV+, não há garantia de ganho no curto prazo (variância). Coerente com o [posicionamento regulatório](../visao-geral.md#13-riscos-e-considerações).

---

## Decisões em aberto

1. **Casa-benchmark de produção:** Pinnacle, Betfair Exchange, ou ambas como âncora vig-free? `[A confirmar]`
2. **CLV como métrica oficial** do histórico de acerto (além de ROI/yield)? `[A confirmar]`
3. **Pipeline de captura** de abertura→fechamento (frequência de snapshots) para medir movimento. `[A confirmar]`
4. **Filtro de liquidez:** abaixo de que liquidez tratar a closing como **não** confiável (e priorizar o modelo próprio)? `[A confirmar]`

---

## Referências

- Data Golf — [*How sharp are bookmakers?*](https://datagolf.com/how-sharp-are-bookmakers) — Pinnacle vs softs, blind betting.
- [football-data.co.uk — Pinnacle efficiency](https://www.football-data.co.uk/blog/pinnacle_efficiency.php) — calibração da closing.
- VSiN — [*The Importance of Closing Line Value*](https://vsin.com/how-to-bet/the-importance-of-closing-line-value/) · Pinnacle Odds Dropper — [CLV demystified (Buchdahl)](https://www.pinnacleoddsdropper.com/blog/closing-line-value--clv-demystified-by-expert-joseph-buchdahl).
- Action Network — [*Reverse Line Movement*](https://www.actionnetwork.com/education/reverse-line-movement).
- [*Favorite-longshot bias in fixed-odds markets*](https://www.sciencedirect.com/science/article/abs/pii/S1062976916000041) · Whelan (2024, Economica) — [viés encolhendo](https://onlinelibrary.wiley.com/doi/10.1111/ecca.12500).
- [*Inefficiencies in Moneyline Movement*](https://sage.cnpereading.com/doi/10.1177/15586235251394815) — overreaction.
