# SIN-004 — Sinal: relação jogador–treinador (troca de técnico, titularidade, confiança)

> Investigação (`/rs`). As-of: **2026-06-18**. Feature: [docs/features/sinais/SIN-004-relacao-jogador-treinador.md](../features/sinais/SIN-004-relacao-jogador-treinador.md).
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `inferência` (dedução, não fonte) · `NEI` (não encontrado/insuficiente).

## TL;DR + recomendação cravada

O **"new manager bounce" como efeito causal é majoritariamente regressão à média** — este é o achado central e ele é **load-bearing**. As duas referências acadêmicas mais fortes (Ter Weel, Eredivisie 1986–2004, **184 trocas**; e De Economist 2016, EPL 2000–2015, **61 trocas**, com **grupo de controle contrafactual**) convergem: **na média, trocar de técnico não melhora o desempenho** além de uma melhora de curtíssimo prazo que **também apareceria em times igualmente mal que NÃO demitiram** [`verificado-fetch` ×2]. O dado bruto da Opta (PL desde 2021/22: 0,90 → 1,27 PPG nos 5 primeiros jogos, **+41%**) **parece** confirmar o bounce, mas a própria Opta ressalva que times trocam justamente quando já estão mal — ou seja, o número bruto é o artefato de regressão à média, não a prova do efeito [`verificado-fetch`]. No **Brasileirão** a evidência é ainda mais dura: estudo econométrico (2003–2018, 264 técnicos, 594 trocas, 6.506 jogos) acha **nenhuma melhora significativa nos jogos 1–6**, efeito parcial só a partir do **7º jogo**, e mostra que **mando de campo pesa MUITO mais** (+261,8% na prob. de vitória) que qualquer efeito de técnico; chama o fenômeno de "ritual do bode expiatório" [`verificado-fetch`].

**Recomendação: ADIAR para fase posterior (não MVP), mas MANTER no radar como feature de baixo custo de sourcing.** Justificativa em uma linha: é o sinal **mais observável e barato de coletar** do conjunto intangível (troca de técnico, titularidade e minutagem são **públicos** e já vêm nas APIs que o DOS-001 vai contratar de qualquer jeito), mas o **conteúdo preditivo do efeito-bounce é ~nulo/ruído** — então não justifica peso no motor quant no MVP. O uso correto no produto **não é "preveja bounce"**, e sim: (a) **flag de incerteza/contexto** no dossiê ("técnico há 3 jogos; amostra ainda não estabilizou — reduzir confiança"), e (b) **insumo de explicação do LLM** (narrativa honesta), nunca um termo com peso positivo no estimador. Titularidade/minutagem tem mais lastro que o bounce (disponibilidade real do jogador), mas como **proxy de disponibilidade**, não como "termômetro de confiança" — esse último é narrativa, não efeito medido.

---

## Contexto e problema

SIN-004 é um **sinal intangível NOVO** que alimentaria o "dossiê por partida" ([DOS-001](../features/dossie/DOS-001-dossie-por-partida.md)). A hipótese de domínio: a relação jogador–treinador (prestígio/confiança do técnico no jogador, titularidade vs banco, atritos públicos) e, em especial, o **efeito de troca de técnico** ("new manager bounce") seriam preditivos do rendimento individual e/ou do time.

Pergunta de research, honesta: **o efeito existe e é mensurável, ou é narrativa?** A entrega tem que distinguir os dois. Requisitos do repo que tocam a decisão: o motor separa **estimar** (quant) de **explicar** (LLM); todo pick mostra "o porquê + fontes"; custo de dados/IA escala com nº de jogos.

**Estado interno:** repo greenfield, sem camada de dados (confirmado pela investigação do DOS-001). Não há nada a contestar no código — foco total em pesquisa externa, como pedido no brief.

---

## Estado da arte / evidência

Claims atômicos, fonte inline + confiança + as-of (2026-06-18). **Distinção mantida o tempo todo: efeito BRUTO observado vs. efeito CAUSAL líquido (contra contrafactual).**

### 1. Troca de técnico — o efeito é majoritariamente regressão à média

| Estudo | Amostra | Método | Achado | Conf. |
|---|---|---|---|---|
| **Ter Weel — Dutch Soccer 1986–2004** (De Economist 2011) | 184 trocas, 19 times, Eredivisie | diff-in-diff + 2SLS, contrafactual | **Nenhuma melhora** além de curtíssimo prazo; média de pontos/jogo (moving average) **permanece ~constante**; melhora aparente = **regressão à média** | `snippet` (abstract/discussão) |
| **De Economist 2016 — In-Season Manager Changes EPL** | 61 trocas, 15 temporadas (2000/01–2014/15) | **grupo de controle contrafactual** (trajetória igual, sem troca) + F-test | "On average, performance does **not** improve following a managerial replacement"; F-test **não significativo** → a melhora **teria ocorrido mesmo sem trocar** = regressão à média | `verificado-fetch` |
| **Bryson et al. "Special Ones?"** (Scottish J. Pol. Eco. 2024 / IZA DP 14104) | 4 países, 15 temporadas, dados employer-employee jogo-a-jogo | **entropy balancing** (reweight da trajetória pré-saída) | Técnico que **pede demissão**: ~zero efeito. Técnico **demitido**: melhora **pequena mas significativa** — **só** se o time **mantém** o novo técnico (ou seja, condicionado a não ter nova troca); "little, if any, positive effect" no geral | `snippet` (abstract + síntese) |
| **Brasileirão 2003–2018** (UFOP, monografia) | 264 técnicos, 594 trocas, 6.506 jogos, 16 temporadas | econométrico (prob. de resultado) | Jogos **1–6: nenhuma melhora significativa**; efeito parcial **só no 7º jogo** (+30,8% prob. vitória, +40,7% empate); jogos 8–10 voltam a nulo. **Mando de campo: +261,8%** prob. vitória (domina). "Ritual do bode expiatório" | `verificado-fetch` |

**Triangulação:** 4 estudos independentes (NL, ENG, 4-países, BR), 2 abertos por fetch, todos convergem para **efeito causal líquido ≈ nulo a muito pequeno**, com a melhora bruta atribuída a **regressão à média**. O caso BR é o mais relevante para o produto e o mais cético.

- **Opta Analyst (Oliver Hopkins), PL desde 2021/22** [`verificado-fetch`]: 35 técnicos mid-season, ≥5 jogos. Primeiros 5 jogos: **1,27 PPG** vs **0,90 PPG** antes (**+41%**). Mas o texto **explicitamente** diz: "teams usually change managers because results are already poor, so improvement is more likely than decline". → É a melhor ilustração de que o **bruto +41% é o artefato**, não o efeito. Sem contrafactual, não prova causalidade.
- **Ter Weel / Eredivisie (via socceranalytics substack)** [`verificado-fetch`]: "almost the same pattern could be observed where managers had **not** been sacked"; times demitem perto de **1,0 ponto/jogo** mas têm média ~**1,3** → reversão à média explica a recuperação. Contraponto honesto do autor (Whittall): nem toda demissão segue má sorte (ex.: Spurs de Pochettino jogavam **na linha do xG**), então o efeito **pode** existir pequeno/temporário, "but remains largely insignificant for long-term success".

### 2. Relação jogador–treinador individual (confiança/minutos) — lastro mais fraco e mais "narrativa"

- A literatura de psicologia do esporte associa **relação treinador–atleta** a engajamento, confiança e desempenho (ex.: estudo longitudinal com academia da FA Premier League; teoria 3Cs com mediação de inteligência emocional/engajamento) [`snippet` ×2]. **Mas**: são construtos auto-reportados (questionário), N pequeno, **não medem efeito sobre resultado/odds de jogo** e **não são observáveis em escala** para um produto de prognóstico. → É **diferencial caro/ não-observável**, vira narrativa, não termo do estimador.
- **Titularidade/minutagem** é o sub-sinal **com lastro real**, mas o lastro é **disponibilidade do jogador** (joga ou não, vem de sequência ou voltou de lesão), não "confiança". Já é capturado por escalações/lineups + sidelined das APIs do DOS-001. Tratar como **proxy de disponibilidade/rotação**, não como termômetro emocional.

### 3. Como o mercado de apostas quantifica hoje

- **Modelos de odds reagem a troca de técnico, mas via notícia/probabilidade, não via "bounce" garantido.** Material de mercado afirma que a troca desloca probabilidades em ~5–15% e que casas "nem sempre precificam rápido" — alegação de **fonte comercial** (22bet), **viés**, sem método [`snippet`]. Tratar como hipótese, não como fato.
- A literatura acadêmica de **eficiência de mercado** de odds de futebol é mista: mercados **não** satisfazem eficiência forte; algumas estratégias simples parecem lucrativas in-sample; mas **nenhuma fonte aberta nesta sessão isola "manager sacking" como edge precificável** [`snippet`]. → `NEI` para "o bounce é apostável com edge". O consenso implícito (dado que o efeito causal é ~nulo) é que **apostar no bounce mecanicamente não é estratégia de valor**; o pouco de edge que sobra depende de **fit técnico×elenco**, julgamento caso-a-caso (fonte comercial, `snippet`).

---

## Opções de sourcing / viabilidade

**Boa notícia do brief confirmada: este é o sinal MAIS observável do conjunto.** Troca de técnico, técnico atual, e minutagem/titularidade são **públicos** e já vêm nos provedores que o DOS-001 vai contratar — **custo marginal ~0**.

| Dado | API-Football | SportMonks | Conf. |
|---|---|---|---|
| **Técnico atual do time** | sim (endpoint `coachs` por team) | sim (entidade Coach + include `teams`) | API-F `snippet`; SM `verificado-fetch` |
| **Histórico de carreira do técnico** (clubes + datas início/fim) → **detectar a TROCA** | **sim, explícito** (career history com start/end por clube) | **parcial** — Coach tem includes `teams`/`fixtures`/`latest` mas **doc não confirma datas de tenure**; pode exigir derivar da timeline de fixtures | API-F `snippet` (mais forte); SM `verificado-fetch` (mais fraco) |
| **Escalação / titular vs banco (por fixture)** | sim (lineups: XI + suplentes) | sim (lineups: XI, formação, banco, coaching staff) | ambos `snippet`/`verificado-fetch` |
| **Minutagem / aparições do jogador** | sim (players com minutos/appearances) | sim (player statistics) | `snippet` |
| **Lesão/suspensão (contexto de minutagem)** | sim (`/injuries` + por fixture) | sim (`/sidelined` por player/coach + por fixture) | SM `verificado-fetch` |
| **Atritos públicos jogador×técnico** | **não** (não é dado estruturado) | **não** | `inferência` — só via feed de notícia (a dimensão social barata do DOS-001) |

**Veredito de sourcing:** a **detecção da troca de técnico** (a parte com mais valor narrativo) é trivial e barata — derivável do **histórico de carreira** (API-Football é mais explícito) **ou** da timeline de escalações por fixture (data em que o head coach muda). **Cobertura BR/PL:** ambos provedores cobrem PL e Brasileirão Série A; **profundidade do Brasileirão é a ressalva herdada do DOS-001** (validar em trial, igual aos outros sinais — `NEI` em números específicos de cobertura de técnico BR). Custo: **incluído** nos planos já recomendados no DOS-001 (SportMonks como espinha; API-Football como validação cruzada). "Atritos públicos" **não é dado estruturado** em nenhuma API — só sai do feed de notícia/sentimento, que no DOS-001 já é a versão barata adiada para sentimento leve.

---

## Nota de modelo de dados

Encaixa **sem novas entidades pesadas** no esquema híbrido do DOS-001:

- `coach(id, canonical_name, ...)` + `entity_xref` (crosswalk de IDs entre fontes, igual aos outros).
- **Troca de técnico** = derivada, não tabela nova: ou de `coach_tenure(coach_id, team_id, start_date, end_date)` (se API-Football der as datas) ou inferida da mudança de `head_coach` em `lineups`/`dossier_snapshot` ao longo dos fixtures. Campo derivado no dossiê: `games_under_current_coach` (int).
- **Minutagem/titularidade** = já dentro de `observation` (dimension=`lineup`/`minutes`) — não duplicar.
- **Uso no motor:** SIN-004 entra como **feature de contexto/flag**, não termo aditivo no estimador. Sugestão de campos no snapshot: `coach_changed_recently: bool`, `games_under_current_coach: int`, `lineup_stability: float` (rotação) — consumidos pelo **LLM (explicar)** e como **redutor de confiança** quando a amostra do técnico é curta, **não** como bônus de PPG. Mando de campo (já no dossiê) deve ter peso muito maior — o estudo BR é taxativo.
- **Point-in-time:** "técnico há N jogos" tem que ser computado **as-of kickoff** (snapshot imutável), nunca com dados futuros — senão vaza o resultado da "bounce window" no backtest.

---

## Riscos e gotchas

1. **Dar peso positivo ao bounce no quant = erro de modelagem.** A evidência diz que é regressão à média; um termo "+PPG por técnico novo" estaria capturando o viés de seleção (times trocam quando estão mal), não um efeito. Risco de **deteriorar** o estimador e o CLV. Mitigação: SIN-004 é flag/contexto + insumo de LLM, não termo aditivo.
2. **Leakage no backtest.** A janela de 5 jogos do bounce é exatamente onde a regressão à média opera; sem contrafactual (time igualmente mal que não trocou) o backtest "confirma" um efeito falso. Mitigação: avaliar **sempre** contra controle, never naive before/after.
3. **"Confiança/atritos" é narrativa não-observável.** Pode contaminar a explicação do LLM com causalidade inventada ("o técnico confia nele"). Mitigação: LLM só afirma o **observável** (titular/banco, minutos, técnico há N jogos, notícia citável), nunca infere estado emocional.
4. **Profundidade do Brasileirão** (datas de tenure de técnico, lineups) — herdada do DOS-001, validar em trial (`NEI`).
5. **Regulação (Lei 14.790/2023 + Portaria SPA/MF 1.231/2024):** qualquer narrativa de "aposte no bounce" beira "afirmação infundada sobre probabilidade de ganhar" — agrava o risco de copy. Reforça tratar como contexto honesto, não como tip.

---

## Refutado (com a evidência que matou)

- **"New manager bounce é um efeito causal real e apostável"** — REFUTADO: De Economist 2016 (EPL, contrafactual, F-test não-significativo) [`verificado-fetch`] + Ter Weel (Eredivisie, 184 trocas, sem melhora além de curtíssimo prazo) [`snippet`] + Brasileirão UFOP (jogos 1–6 nulos) [`verificado-fetch`]. O +41% bruto da Opta é **regressão à média**, e a própria Opta ressalva isso [`verificado-fetch`].
- **"O Brasileirão é diferente / lá o bounce funciona"** — REFUTADO: estudo BR é o **mais cético**; efeito só parcial no 7º jogo e mando de campo domina (+261,8%) [`verificado-fetch`].
- **"Confiança/relação jogador–treinador é um sinal preditivo mensurável em escala"** — REFUTADO (parcial): existe literatura de psicologia [`snippet`], mas é auto-reporte, N pequeno, não mede resultado de jogo e **não é observável em escala**. Sobra titularidade/minutagem como **proxy de disponibilidade**, não de confiança.

## Perguntas Abertas / lacunas

- **Edge apostável do bounce com fit técnico×elenco:** só material comercial enviesado afirma; `NEI` em fonte acadêmica isolando "manager change" como ineficiência precificável.
- **Datas de tenure de técnico na SportMonks** (doc não confirma start/end por clube) e **profundidade de técnico/lineups do Brasileirão** em ambos provedores — resolver no mesmo trial do DOS-001 (`NEI`).
- **Magnitude exata** do efeito "sacking + retém o técnico" do Bryson (Wiley/IZA PDF não abriu — binário; UCL/Wiley pagos) — número fino `NEI`, mas a direção (pequeno e condicional) está triangulada.
- **Sub-sinal de minutagem como proxy de forma/rotação** (rodízio, voltar de lesão) pode ter valor próprio independente da "relação" — vale um spike separado, fora do escopo do bounce.

---

## Evidências decisivas (fontes abertas via fetch nesta sessão)

- [web] https://www.premierleague.com/en/news/4593686/what-is-a-new-manager-bounce-and-is-it-a-myth — Opta (Hopkins): PL 2021/22+, 35 técnicos, 0,90→1,27 PPG (+41%) bruto, com ressalva de seleção. `verificado-fetch`
- [web] https://link.springer.com/article/10.1007/s10645-016-9277-0 (via redirect autorizado) — De Economist 2016, EPL 61 trocas, contrafactual, F-test não-significativo, regressão à média. `verificado-fetch`
- [web] https://socceranalytics.substack.com/p/is-the-new-manager-bounce-really — síntese Ter Weel (Eredivisie); "mesmo padrão onde técnicos NÃO foram demitidos"; ~1,0 vs ~1,3 ponto/jogo. `verificado-fetch`
- [web] https://universidadedofutebol.com.br/2020/11/02/o-impacto-das-mudancas-de-comando-tecnico-no-futebol-brasileiro-o-efeito-da-troca-de-treinadores/ — Brasileirão 2003–2018, efeito só no 7º jogo, mando +261,8%, "bode expiatório". `verificado-fetch`
- [web] https://docs.sportmonks.com/football/endpoints-and-entities/entities/team-player-squad-coach-and-referee — entidade Coach (includes teams/fixtures/latest; **sem** datas de tenure confirmadas). `verificado-fetch`
- [web] papers.ssrn.com / link.springer.com 10.1007/s10645-010-9157-y — Ter Weel "Does Manager Turnover Improve Firm Performance?" 184 trocas, sem melhora. `snippet`
- [web] repec.iza.org/dp14104.pdf · onlinelibrary.wiley.com/10.1111/sjpe.12369 — Bryson "Special Ones?", entropy balancing, efeito pequeno e condicional (PDF binário/pago — `snippet`).
- [web] news.22bet.com/.../football-betting-managerial-changes — odds deslocam ~5–15% (fonte comercial, viés). `snippet`
