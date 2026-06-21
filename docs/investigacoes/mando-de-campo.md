# Investigação — Mando de campo (vantagem de jogar em casa) · SIN-016

> **Feature:** [SIN-016](../features/sinais/SIN-016-mando-de-campo.md) · **Data:** 2026-06-21 · **Status:** investigado
> **Classificação na taxonomia:** o mando é **BASELINE do ESTIMAR** (parâmetro de força do modelo, MOD-001), **não** um sinal de edge por si. O edge — quando existe — está nos **DESVIOS** do mando esperado, que os outros sinais (SIN-006 clima, SIN-007 rivalidade, SIN-008 calendário/altitude) **modulam** e que o mercado às vezes **demora a reprecificar**.

---

## 1. TL;DR + recomendação cravada

O mando é o **maior fator isolado** do futebol, mas está **encolhendo há mais de um século** (vitórias em casa no top inglês caíram de ~65% em 1895 para ~42% hoje, queda proporcional de ~36% — [Sky Sports/Between the Lines](https://www.skysports.com/football/news/11095/13511444/home-advantage-is-on-the-wane-in-the-premier-league-between-the-lines), as-of 2024). O experimento natural dos jogos sem público (COVID 2020-21) **isolou os componentes**: sem torcida, a vantagem de mando caiu **>50%** medida em gols esperados e o **viés de arbitragem pró-mandante praticamente sumiu** (cartões/faltas contra o visitante deixaram de existir, p<0,001 — [No Fans–No Pressure, PMC8416626](https://pmc.ncbi.nlm.nih.gov/articles/PMC8416626/), verificado-fetch). **Recomendação:** modelar o mando como **parâmetro de força no MOD-001** (γ no Dixon-Coles, idealmente **time-específico** e não global), tratá-lo como a **referência neutra** sobre a qual os outros sinais somam desvios, e **nunca** dar peso de edge ao mando cru — ele já está na odd. O **value real** vive em desvios que o mercado é lento pra reprecificar: na quebra de mando da Bundesliga sem público, as casas **continuaram superprecificando o mandante** e apostar **contra** rendeu ROI ~4-7% ([arXiv 2008.05417](https://arxiv.org/pdf/2008.05417), verificado-fetch). Esse é o padrão a perseguir: **mando como baseline limpo + caça a desvios mal precificados**, validados contra a CLV (SIN-012), nunca dupla-contados.

---

## 2. Contexto e problema

O mando é citado em três regras do repo como o **confundidor central** — o fator que dissolveu vários "edges" candidatos ("isso é só efeito casa/fora que o mercado já precifica"). O problema de produto:

- **Requisito quant/LLM (visao-geral §6):** o mando precisa entrar no **ESTIMAR** (move a probabilidade), não no EXPLICAR. Mas só a *parte do mando que o modelo de força ainda não captou* — e a parte que o **mercado ainda não precificou** — vira EV+.
- **Requisito "porquê + fontes":** o assistente (EXPLICAR) deve poder narrar *por que* um jogo tem mando forte/fraco (torcida cheia? viagem longa? estádio neutro?), citando o componente, sem mexer no número.
- **Requisito anti-dupla-contagem (taxonomia-sinais.md:12-14):** o risco nº1. Se o mando entra como parâmetro de força E os sinais climático/rivalidade/calendário cada um "descontam o mando" de novo, conta-se o mesmo efeito 2-4 vezes. Precisa de **uma fronteira de posse clara**: quem é dono do baseline e quem só modula.
- **Requisito endogeneidade:** "mando" e "força do time" são correlacionados (times fortes jogam continental, viajam menos cansados, têm estádios novos). Separar o mando *causal* da seleção de times fortes é a armadilha recorrente.

---

## 3. Estado real no repo (o que já está cravado)

**O mando já é dimensão prevista do feature set do MOD-001:**

- `docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md:160` — `match_features` inclui explicitamente **"xG, forma (rolling), descanso/congestão, mando"** como o feature set do modelo.
- `docs/features/modelos/MOD-001-motor-prognostico-quant.md:17,32` — âncoras `[match, team_ratings, match_features, ...]`; baseline = **Dixon-Coles time-weighted (penaltyblog)**, cujo parâmetro γ É o mando global. Tabela `team_ratings` = snapshots de força (Elo/pi-ratings).

**Vários números de mando já foram levantados pelo dono (não re-pesquisar, reaproveitar):**

- `docs/regras/calendario-fadiga.md:19` — visitante marca **~0,4 gol a menos** historicamente, **~0,25 hoje**; "o mercado já precifica isso".
- `docs/regras/calendario-fadiga.md:59` — regra de ouro: "jogo fora já é under por baseline; **sempre** comparar contra o mesmo time fora sem congestionamento" → o desvio é o que importa, não o baseline.
- `docs/regras/rivalidade.md:37,174` — em clássico, vitória do mandante cai **52,4% → 30,0%** (Volossovitch, Brasil 2007-11, p≤0,001) → o mando É modulável por contexto.
- `docs/regras/rivalidade.md:46` — jogos sem público (COVID): mando caiu de **~59%→55% dos pontos** e **viés de árbitro sumiu**.
- `docs/regras/calendario-fadiga.md:49` — altitude (McSharry/BMJ): prob. de vitória do mandante sobe de **0,54** (mesma altitude) para **0,83** com +3.695 m → o mando tem um componente ambiental gigante e localizado.

**Fronteiras de posse já cravadas (taxonomia-sinais.md:50-56):**

- `estadios` é âncora compartilhada por SIN-006/007/008 (coords/altitude/cobertura) — SIN-016 encosta nela (familiaridade/altitude são componentes do mando).
- O `dossier_snapshot` (DOS-001) tem bloco quant separado do narrativo (pergunta em aberto, taxonomia:66) — o mando vive no bloco quant.

**Gaps no repo:**

1. Nenhum doc decompõe o mando em **componentes** nem cita a literatura de jogos sem público de forma estruturada (só menções de passagem). Esta investigação preenche.
2. Não está cravado **se o mando é γ global ou time-específico** no MOD-001 — decisão técnica importante (§6).
3. Não existe coluna/tabela de mando explícita; `match_features.mando` é proposta conceitual, não schema.
4. **Não há decisão de fronteira** "quem desconta o mando" entre SIN-007/008 e o baseline — risco de dupla-contagem latente.

---

## 4. Estado da arte — claims atômicos verificados

| # | Claim | Veredito | Fonte (as-of) | Confiança |
|---|---|---|---|---|
| C1 | Vitórias em casa no top inglês caíram de **~65% (1895) → ~42% (2023-24)**; queda proporcional **~36%** | SUPPORTED | [Sky Sports/Between the Lines](https://www.skysports.com/football/news/11095/13511444/home-advantage-is-on-the-wane-in-the-premier-league-between-the-lines) (2024) | verificado-fetch |
| C2 | Mandante na PL marca **~37% mais gols** que o visitante (estudo de 2006) | SUPPORTED | [Wikipedia—Home advantage](https://en.wikipedia.org/wiki/Home_advantage) citando Boyko 2006 | verificado-fetch |
| C3 | Na COVID 2020/21 (sem público) a **taxa de vitória fora superou a de casa pela 1ª vez** na história (40% fora vs 38% casa, top inglês) | SUPPORTED | [Sky Sports](https://www.skysports.com/football/news/11095/13511444/home-advantage-is-on-the-wane-in-the-premier-league-between-the-lines) (2024) | verificado-fetch |
| C4 | Pollard & Pollard postulam **7 componentes** do mando: torcida, viagem, familiaridade, territorialidade, tática, fatores psicológicos, viés de arbitragem | SUPPORTED | [ScienceDirect—Perspectives on home advantage](https://www.sciencedirect.com/science/article/abs/pii/S1469029211001658) + [TandF HAM model](https://www.tandfonline.com/doi/full/10.1080/1750984X.2024.2358491) | snippet |
| C5 | Em jogos sem público, a vantagem de mando (gols esperados casa−fora) **caiu >50%** em EPL/Bundesliga/Serie A/La Liga | SUPPORTED | [Fischer & Haucap via search](https://www.researchgate.net/publication/347152533) + agregado [PLOS systematic review](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0289899) | snippet/fetch |
| C6 | Sem público, o **viés de arbitragem pró-mandante desaparece**: o excesso de faltas/amarelos contra o visitante some (fouls p<0,001, amarelos p<0,001, vermelhos p<0,05) | SUPPORTED | [No Fans–No Pressure, PMC8416626](https://pmc.ncbi.nlm.nih.gov/articles/PMC8416626/) (1.286 jogos, 8 ligas) | verificado-fetch |
| C7 | Quantificação: amarelos por falta do **mandante +26,2% (+238)** sem público vs visitante **+2,8% (n.s.)**; vitórias do mandante 48,1%→39,8% | SUPPORTED | [No Fans–No Pressure, PMC8416626](https://pmc.ncbi.nlm.nih.gov/articles/PMC8416626/) | verificado-fetch |
| C8 | Brasileirão: vitórias do mandante **57,9% (2019) → 44,9% (2020 sem público)**, recuperação parcial **48,6% (2022)**, p=0,004 | SUPPORTED | [Nortis Journal](https://nortisjournal.com/index.php/pub/article/view/6) (741 jogos) | verificado-fetch |
| C9 | Brasileirão longitudinal (8.405 jogos, 2003-23): mando médio **~35,1% ± 7,7%**, com tendência de queda | SUPPORTED (2 fontes) | [Baltic Sports Science](https://www.balticsportscience.com/cgi/viewcontent.cgi?article=2184&context=journal) + search | snippet |
| C10 | Dixon-Coles usa **um único parâmetro de mando global γ (~1,2)** para toda a liga (2N+2 parâmetros) | SUPPORTED | [Grokipedia—DixonColes](https://grokipedia.com/page/DixonColes_model) + [arXiv 2307.02139](https://arxiv.org/pdf/2307.02139) | snippet |
| C11 | Há heterogeneidade de mando entre times; refinamentos do DC usam **mando time-específico** (não global) | SUPPORTED | [arXiv 2307.02139—Extending Dixon-Coles](https://arxiv.org/pdf/2307.02139) + search | snippet |
| C12 | Na quebra de mando da Bundesliga sem público, as casas **continuaram superprecificando o mandante**; apostar contra rendeu **ROI ~4-7%** | SUPPORTED | [arXiv 2008.05417](https://arxiv.org/pdf/2008.05417) | verificado-fetch |
| C13 | A altitude desloca o mando de forma localizada: prob. vitória mandante **0,54 → 0,83** com +3.695 m | SUPPORTED | repo (McSharry/BMJ) `calendario-fadiga.md:49` | herdado-verificado |
| C14 | Em condições normais, as casas **precificam o mando corretamente** em ligas líquidas (sem mispricing sistemático estável) | SUPPORTED | [Reading—online betting market efficiency](https://www.reading.ac.uk/web/files/economics/emdp201910.pdf) + search | snippet |

---

## 5. Decomposição do mando + o experimento dos jogos sem público

O quadro acadêmico canônico é o de **Pollard (7 fatores)** [C4], que a literatura COVID conseguiu **isolar** porque os jogos sem público desligaram a torcida (e, via torcida, a arbitragem) mantendo o resto.

| Componente | Mecanismo | Magnitude / evidência | Modulável por qual sinal mrtip? |
|---|---|---|---|
| **Torcida / pressão** | Suporte emocional + amplificação da pressão sobre o árbitro | Responsável por **>50%** da queda do mando sem público [C5]; dose-resposta com lotação (`rivalidade.md:47`) | SIN-007 (torcida única / portões fechados / lotação) |
| **Viés de arbitragem pró-mandante** | Árbitro inconscientemente favorece o mandante sob pressão de torcida (mais tempo de acréscimo perdendo, menos cartões à casa) | **Some** sem público: amarelos do mandante +26,2% sem torcida (p<0,001) [C6][C7] — é o componente **mais limpo e causal** isolado | SIN-007 (rivalidade afeta arbitragem) + SIN-009 (árbitro escalado, dono dos cartões) |
| **Viagem do visitante** | Fadiga/disrupção de rotina do time que viaja | Visitante marca ~0,4→0,25 gol a menos (`calendario-fadiga.md:19`); **distância vira não-significativa controlando força na era moderna** (`calendario-fadiga.md:22`) | SIN-008 (calendário/fadiga + distância haversine) |
| **Familiaridade gramado/estádio + altitude** | Conhecer o campo, dimensões, piso; aclimatação à altitude | Altitude: prob. vitória **0,54→0,83** com +3.695 m [C13]; familiaridade pura é pequena na era de estádios padronizados | SIN-008 (altitude, via `estadios`) |
| **Territorialidade / psicológico / tática** | Testosterona em casa, conforto, mando tático | Efeitos pequenos/difusos; em grande parte **endógenos à força do time** | (residual, fica no baseline) |

**O experimento natural dos "Geisterspiele" (jogos-fantasma):**

A COVID 2020-21 forneceu o **contrafactual** que décadas de observação não davam: os mesmos times, mesmas ligas, mesma temporada, **com e sem torcida**. Os achados convergem (com nuances):

- **Mando desaba >50%** medido em gols esperados casa−fora, transversal a EPL/Bundesliga/Serie A/La Liga [C5].
- **O componente arbitragem é o que mais cai** e o mais causalmente nítido: o excesso de cartões/faltas contra o visitante **desaparece** (p<0,001) [C6][C7] — confirma que esse viés **vinha da pressão de torcida**, não de o visitante jogar mais sujo.
- **Brasileirão segue o padrão**: 57,9%→44,9% de vitórias do mandante (p=0,004), com recuperação só parcial pós-COVID — sinal de que parte da queda é **estrutural**, não só ausência de público [C8].

**Contraponto honesto (counter-review, §6):** nem todo estudo concorda que o canal é só arbitragem. O estudo **"No Home Bias in Ghost Games"** ([ResearchGate](https://www.researchgate.net/publication/357850675)) argumenta que, controlando a **dominância ofensiva** do time, o viés de árbitro **se dilui** — ou seja, parte do "viés" é o mandante de fato atacar mais, não o árbitro favorecer. E a revisão PLOS [C5] alerta que a queda pode misturar treino em casa, infecções, mudanças de regra e calendário congestionado — não só torcida. **Para o produto isso reforça a recomendação:** o mando é multi-componente e parcialmente confundido com força → tratá-lo como **um parâmetro de baseline a estimar dos dados**, não decompor manualmente em produção.

---

## 6. Como modelar como baseline limpo — matriz de opções e recomendação

O objetivo: o mando deve ser a **referência neutra** do ESTIMAR, dono **único** do "quanto jogar em casa vale", de modo que SIN-006/007/008 apenas **somem desvios** sem recontar o mando.

| Opção | O que é | Prós | Contras / risco de dupla-contagem |
|---|---|---|---|
| **A. γ global (Dixon-Coles padrão)** | Um único parâmetro de mando para a liga inteira [C10] | Simples; é o baseline já cravado no MOD-001; robusto com pouco dado | Ignora heterogeneidade (altitude, estádios) [C11]; força os sinais a "consertar" o que o baseline errou |
| **B. γ time-específico** | Cada time tem seu fator de mando, estimado dos dados [C11] | Captura altitude/estádio/torcida **automaticamente** dos resultados; menos trabalho pros sinais | Precisa de mais dados por time; risco de overfit em ligas curtas; ainda confunde mando com força se não regularizado |
| **C. γ global + ajustes por sinal** | Baseline global, e SIN-007/008 descontam mando caso a caso | Explicável; cada sinal "vê" o mando | **Maior risco de dupla-contagem**: se o γ global já embute torcida média e SIN-007 desconta torcida de novo → conta 2× |
| **D. Baseline limpo + desvios validados por CLV** (recomendado) | γ **time-específico regularizado** como baseline; SIN-006/007/008 produzem **desvios** que só ganham peso se baterem a closing line | Fronteira de posse limpa; o mando é dono do baseline, os sinais são donos dos **desvios**; anti-dupla-contagem por construção (SIN-012 corta o que já está na odd) | Exige disciplina de validação; γ time-específico precisa de dado (PL ok, BR mais raso) |

**Recomendação: Opção D, implementada em camadas.**

1. **Baseline (dono: MOD-001/SIN-016).** O mando entra como **parâmetro de força** do Dixon-Coles. Começar com **γ global** (MVP, PL — pouco custo, já é o baseline cravado em MOD-001), evoluir para **γ time-específico regularizado** quando houver dado, pois isso absorve altitude/estádio/torcida-média **automaticamente** dos resultados [C11] — exatamente os componentes do §5. *O baseline NÃO decompõe manualmente os 7 fatores;* ele os aprende como um número por time.
2. **Desvios (donos: SIN-006/007/008).** Cada sinal só pode mexer no que é **incremental ao baseline**: SIN-007 = mando **neutralizado** (torcida única/portões fechados → puxar o γ daquele jogo pra baixo); SIN-008 = visitante **acabou de jogar em altitude/viajou longe** (incremento sobre o baseline); SIN-006 = clima do dia. **Regra de ouro herdada** (`calendario-fadiga.md:59`): o sinal só conta se o desvio for **acima do baseline do próprio time naquele mando**, não acima da média da liga.
3. **Validação (dono: SIN-012/CLV).** Nenhum desvio vira peso no ESTIMAR sem bater a closing line. O mando cru **nunca** é edge — está na odd [C14]. O edge aparece em **desvios mal precificados**, como a quebra de mando da Bundesliga onde as casas demoraram a reprecificar (ROI 4-7%) [C12].

**O que o counter-review levantou (≥3 problemas reais):**

1. **O mando cru não é exploitável — só desvios são** [C14][C12]. Em condições normais, a odd já embute o mando corretamente. **Risco mitigado**, virou a tese central: caçar desvios, não o baseline. (Força.)
2. **γ time-específico pode confundir mando com força do time** (endogeneidade): um time forte parece ter "mando alto" só porque vence muito. **Risco declarado** — exige regularização e separar attack/defense do fator casa. Em ligas curtas (BR fase 2) pode não ter dado → cair pra γ global lá.
3. **A causa da queda do mando sem público é disputada** [C5, "No Home Bias"]: parte é arbitragem, parte é o mandante atacar menos, parte é confundidor (treino em casa, calendário). **Risco declarado** — por isso NÃO decompor manualmente em produção; deixar o parâmetro absorver o efeito líquido e validar contra CLV.
4. **O mispricing de mando é transitório, não estrutural** [C12 foi um choque único da COVID; C14 diz que casas normalmente acertam]. Não há evidência de mispricing **permanente** do mando em ligas líquidas → o edge de "apostar contra mandante" só existe em **regimes de quebra** (mudança de regra de público, estádio neutro súbito, troca de regime de torcida) ou em **ligas de baixa liquidez**. **Risco declarado** — o produto não deve prometer edge de mando constante.

---

## 7. Modelo de dados proposto

Reaproveita o que MOD-001/DOS-001 já cravaram; **não cria tabela nova** — estende `team_ratings`, `match_features` e `estadios`. Datas/fuso via **date-fns / date-fns-tz**, fuso da partida (ex.: `America/Sao_Paulo`).

```
team_ratings  (já existe — MOD-001)
  + home_advantage           numeric   -- γ time-específico estimado (opção B/D); null no MVP global
  + rating_as_of             timestamptz (fuso da liga)  -- snapshot de força/mando por data

match_features (já existe — MOD-001)
  + expected_home_advantage  numeric   -- baseline do mando p/ ESTE jogo (do γ + estádio)
  + home_advantage_neutralized boolean -- estádio neutro / torcida única / portões fechados (vem de SIN-007)
  -- (os DESVIOS de SIN-006/007/008 vivem nas colunas deles, não aqui — esta é só o baseline)

estadios       (âncora compartilhada SIN-006/007/008 — já existe)
  -- reutiliza: latitude, longitude, altitude_m, coberto/retratil
  -- mando lê altitude_m (componente familiaridade/altitude) e flag de neutralidade
```

**Princípios:**
- O mando NÃO ganha tabela própria — é **propriedade do time** (`team_ratings.home_advantage`) e **do jogo** (`match_features.expected_home_advantage`). Carimbo `// @feature SIN-016` só na coluna `home_advantage` (ponto de posse única).
- `match_features.expected_home_advantage` é o **baseline limpo** que os outros sinais leem para calcular desvios — evita que cada um recompute o mando.
- A altitude/coords saem de `estadios` (âncora já compartilhada) — SIN-016 **lê**, SIN-008 é dono da regra de altitude. Sem duplicar a coluna.

---

## 8. Plano por faceta

**`dados`:**
- Reutilizar `team_ratings` + `match_features` (MOD-001) e `estadios` (âncora SIN-006/007/008). Adicionar `team_ratings.home_advantage` e `match_features.expected_home_advantage` (only-expand).
- Fonte de força/mando: o próprio fit do **Dixon-Coles (penaltyblog)** sobre football-data.co.uk (PL) já produz γ — não precisa de fonte externa de mando. Brasileirão = fase 2 (dado mais raso → cair pra γ global).
- Para validar a tese de desvio: backtest de **mando vs closing line** (CLV) e teste do regime "mando neutralizado" (estádio neutro/torcida única) — fonte de odds de fechamento via football-data.co.uk / OddsPortal (herdado de MOD-001/SIN-012).

**`ia` (ESTIMAR):**
- MVP: γ **global** no Dixon-Coles (já é o baseline de MOD-001 — custo zero adicional).
- Evolução: γ **time-específico regularizado** quando o dado da liga suportar; absorve altitude/estádio/torcida-média automaticamente.
- Os sinais SIN-006/007/008 entram como **multiplicadores de desvio** sobre `expected_home_advantage`, cada um validado por CLV antes de ganhar peso (SIN-012).

**`ia` (EXPLICAR):**
- O LLM narra o componente do mando sem mexer no número: *"mando reforçado: estádio em altitude (La Paz, 3.640 m) + torcida cheia"* ou *"mando neutralizado: jogo de portões fechados por punição"*. Lê `match_features.expected_home_advantage` + flags + `estadios.altitude_m`.

---

## 9. Riscos e gotchas

1. **Dupla-contagem (risco nº1).** Se o γ embute torcida média E SIN-007 desconta torcida, conta 2×. **Mitigação:** fronteira de posse — MOD-001 dono do baseline; SIN-006/007/008 donos só dos **desvios incrementais**, validados por CLV.
2. **Endogeneidade mando×força.** γ time-específico pode capturar "time forte" em vez de "mando". **Mitigação:** regularização; separar attack/defense do fator casa; em liga curta usar γ global.
3. **Edge transitório.** O mispricing de mando [C12] foi um choque único da COVID; não é estrutural [C14]. **Mitigação:** prometer edge de mando só em **regimes de quebra** ou **ligas ilíquidas**, nunca como constante.
4. **Heterogeneidade BR.** Mando no Brasileirão é mais alto, mais ligado a viagem/altitude continental e cai mais rápido [C8][C9]; calibrar por liga, não importar γ da PL.
5. **Queda estrutural pós-COVID.** O mando não recuperou totalmente [C8] — usar janela recente de calibração, não série histórica longa que infla o γ.
6. **Estádio neutro / mando invertido.** Mandos cedidos (gramado em obra, punição) quebram o baseline — precisa da flag `home_advantage_neutralized` populada (depende de SIN-007 + cadastro de estádios).

---

## 10. Refutado e Perguntas em aberto

**Refutado (com evidência):**

- **"O viés pró-mandante vem de o visitante jogar mais sujo."** REFUTED — o excesso de faltas/cartões do visitante **desaparece sem público** (p<0,001), provando que vinha da **pressão de torcida sobre o árbitro**, não do comportamento do visitante [C6][C7], [No Fans–No Pressure](https://pmc.ncbi.nlm.nih.gov/articles/PMC8416626/).
- **"O mando cru é um edge apostável."** REFUTED — em ligas líquidas as casas precificam o mando corretamente [C14]; o mando cru já está na odd (`calendario-fadiga.md:19`). Só **desvios mal precificados** rendem (ROI 4-7% só no choque COVID) [C12]. O edge não é o mando, é o desvio.
- **"Distância de viagem reduz o mando na era moderna."** REFUTED (parcial) — controlando força do time, a **distância vira não-significativa** na era moderna (`calendario-fadiga.md:22`); o que sobrevive é **altitude** (localizada), não distância pura.

**Perguntas em aberto (NEI / a decidir):**

1. **γ global vs time-específico no MVP da PL:** decisão técnica de MOD-001 (quanto dado a PL dá para γ regularizado por time sem overfit?). NEI — exige experimento de calibração, não há número publicado decisivo.
2. **Fronteira exata de quem desconta o mando** entre SIN-007 (torcida) e SIN-008 (altitude/viagem) e o baseline — precisa ser cravada no /pl do MOD-001 para não dupla-contar; hoje é só princípio.
3. **Magnitude do mando residual pós-treino-em-casa** (o componente "estrutural" que não recuperou pós-COVID [C8]): nenhuma fonte isola quanto é treino-em-casa vs torcida vs regra. Busca específica por "home training effect persistence post-COVID magnitude" não retornou número decisivo — **NEI declarado**.
4. **Mando no Brasileirão com γ time-específico:** dado raso de xG/odds de fechamento BR (buraco estrutural herdado de MOD-001) pode inviabilizar — fica pra fase 2.

---

## Auditoria de citações

- **Toda URL veio de tool result desta sessão?** Sim — todas as URLs (Sky Sports, Wikipedia, PMC8416626, Nortis, PLOS, arXiv 2008.05417, arXiv 2307.02139, Grokipedia, ScienceDirect, TandF, Baltic, Reading) saíram de WebSearch/WebFetch desta sessão. As citações `path:linha` (calendario-fadiga, rivalidade, MOD-001, predicao-futebol) saíram de Read/Grep desta sessão.
- **Claims load-bearing por fetch?** C1/C3 (decline + COVID inversão), C6/C7 (referee bias magnitude), C8 (Brasil), C12 (mispricing/ROI) — todos **verificado-fetch** da página real. C5/C10/C11/C13/C14 = snippet/herdado.
- **Reabertura de 3-5 claims numéricos:** ✔ C1 (65%→42%, ~36%) confirmado no fetch do Sky Sports. ✔ C7 (+26,2% amarelos mandante, 48,1%→39,8% vitórias, 1.286 jogos) confirmado no fetch de PMC8416626. ✔ C8 (57,9%→44,9%→48,6%, p=0,004, 741 jogos) confirmado no fetch de Nortis. ✔ C12 (ROI 4-7% apostando contra mandante) confirmado no fetch de arXiv 2008.05417. ✔ C13 (0,54→0,83 com altitude) é herdado do repo (McSharry), não re-fetchado — marcado como herdado-verificado.
- **Efeito de mercado com ≥2 fontes independentes:** o mispricing transitório do mando (C12, arXiv) é corroborado pela eficiência normal em ligas líquidas (C14, Reading) — proveniências independentes, conclusões compatíveis (mando precificado em regime normal, mal precificado em choque).
