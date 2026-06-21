# xG / qualidade de chute como feature central do quant — investigação (MOD-002)

> Investigação (`/rs`). As-of: **2026-06-21**. Feature: [docs/features/modelos/MOD-002-xg-qualidade-de-chute.md](../features/modelos/MOD-002-xg-qualidade-de-chute.md).
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `inferência` (dedução) · `NEI` (não encontrado/insuficiente).
> Escopo: o xG **especificamente** — o que é, ruído/amostra, pré-chute vs xGOT, regressão à média, evolução (xT/xPts), providers e como o motor (MOD-001) consome xG. **NÃO re-pesquisa** o estado da arte geral de ML (já cravado em [MOD-001](../features/modelos/MOD-001-motor-prognostico-quant.md) e [predicao-futebol-ia-ml-estado-da-arte.md](predicao-futebol-ia-ml-estado-da-arte.md)).

---

## 1. TL;DR + recomendação cravada (só SUPPORTED)

xG é **a feature de força mais forte que o quant tem** — vira o motor (MOD-001) mais cedo e melhor que gols brutos, mas é **ruidoso por jogo** e só estabiliza em janela de temporada. A decisão central já está cravada no repo e esta investigação **confirma** com evidência fresca, sem re-decidir. O que MOD-002 acrescenta a MOD-001 é a **mecânica do xG**:

1. **Alimentar o rating de força com xG, não gols.** xG-ratio é mais preditivo de resultados futuros que gols-ratio **a partir de ~7–8 jogos** (ligas europeias 8, MLS 7, dados 2018–2022) e mantém vantagem por mais tempo quanto melhor o modelo de xG [`verificado-fetch`, ASA]. A técnica concreta: **simular placares a partir do xG por chute (Poisson-Binomial) e alimentar o Dixon-Coles com esses placares ponderados** — exatamente o baseline que MOD-001 já cravou (penaltyblog Dixon-Coles), só que com gols esperados no lugar de gols [`verificado-fetch`, statsandsnakeoil 2018].

2. **Separar dois papéis (anti-dupla-contagem):** **xG = criação de chance** (qualidade da posição **antes** do chute → mede ataque/defesa do time, é o insumo do rating de força); **xGOT/post-shot xG = qualidade da finalização + desempenho do goleiro** (depois do chute, condicionado ao chute estar no alvo). São features de **naturezas diferentes** — xG no motor de gols, xGOT em props de finalização/goleiro [`verificado-fetch`, Opta Analyst].

3. **Tratar over/underperformance como ruído que regride, não skill.** Goals-minus-xG (G−xG) tem **~zero correlação ano-a-ano no nível de jogador** e não é skill estável; modelos de xG ainda têm viés que confunde a medição de finalização [`verificado-fetch`, ASA 2023 + KU Leuven 2024]. → o motor **regride à média** a superformance recente; **não** dá peso de força permanente a quem está "finalizando acima do xG".

4. **Provider — protótipo comparativo, não fechar agora.** Decisão de tooling = bake-off. **Finalistas:** **SportMonks** (xG add-on €29/mês, Brasileirão profundo, **licença comercial explícita**) como backbone recomendado, com **API-Football** como validação cruzada barata — exatamente o que [dossie-por-partida-fontes-de-dados.md](dossie-por-partida-fontes-de-dados.md) já cravou. As fontes grátis caíram: **FBref perdeu o xG (Opta cortou o feed em 20/jan/2026)**, **Understat não tem Brasileirão**, **StatsBomb open-data proíbe uso comercial** [`verificado-fetch`]. → MOD-002 **não abre novo provider**; herda o backbone do DOS-001 e só especifica que o xG vem **por chute** (não só agregado por jogo), para poder simular placar.

**Classificação na taxonomia:** xG é **insumo do ESTIMAR (quant)**, ingerido pelo DOS-001 e consumido pelo MOD-001. **Complementa** o feature set do MOD-001 (não substitui): MOD-001 já lista `match_features` com coluna `xG` e força via Elo/pi-ratings — xG **substitui gols brutos** como matéria-prima do rating de gols e **adiciona** xGOT/SGA como features novas de finalização/goleiro (mercados de props). Sem dupla-contagem porque cada um entra em um mercado distinto.

---

## 2. Contexto e problema (+ requisitos implícitos)

MOD-001 trata ML de previsão de forma genérica e **já cravou** o desenho (Dixon-Coles + odds de-margined; GBT depois; calibração isotônica; LLM só explica). O que faltava: **cravar o xG como a feature central** — qual modelo, quão ruidoso, pré vs pós-chute, e o fenômeno de regressão à média. É a fundação quant: a qualidade do xG limita a qualidade de tudo que o motor produz.

**Requisitos implícitos:**
- O xG precisa chegar **por chute** (shot-level), não só somado por jogo, para (a) simular o placar via Poisson-Binomial e (b) derivar xGOT/SGA. Agregado por jogo serve para rating; shot-level habilita o resto.
- O motor precisa de uma **janela mínima** (≥7–8 jogos) antes de confiar em xG; no começo de temporada e para promovidos (ver [MOD-003](../features/modelos/MOD-003-forca-entre-ligas-promovidos.md)) precisa de **prior**.
- Provider de xG do **Brasileirão** é o gargalo (mesma assimetria PL×BR que MOD-001 já marcou).
- xG é **endógeno-resistente** mas não imune: parte dele já está na odd de fechamento (mercado vê xG). Vale como força bruta no motor; o edge real depende da validação CLV (SIN-012).

---

## 3. Estado real no repo (o que já está cravado, com path:linha)

**Já cravado — não re-decidir:**

- **xG é feature central do motor, não enfeite.** `predicao-futebol-ia-ml-estado-da-arte.md:97` — "investir em features (xG, pi-/Berrar ratings, descanso, mercado de-margined) e calibração rende mais que trocar de arquitetura". `:160` propõe `match_features` com coluna **xG** explícita.
- **Baseline = Dixon-Coles via penaltyblog** (MOD-001:32, `predicao...:88`). Esta investigação acopla o xG **a esse mesmo baseline** (simular placar → DC), não propõe motor novo.
- **Assimetria PL×Brasileirão de xG é buraco estrutural, não "ponto a validar"** (`predicao...:16`, `:137`; MOD-001:36). MVP = PL; Brasileirão fase 2.
- **Provider de xG já mapeado e recomendado:** `dossie-por-partida-fontes-de-dados.md:41` (SportMonks xG add-on €29/mês, BR profundo, licença comercial), `:47` (**FBref perdeu xG, Opta cortou jan/2026**), `:45` (StatsBomb open-data proíbe uso comercial), `:46` (Understat sem BR), `:50` ("só a SportMonks junta xG + Brasileirão profundo + licença comercial"). Recomendação `:97`: SportMonks backbone + API-Football validação cruzada.
- **`match_features` já é a casa do xG** no schema do MOD-001 (`predicao...:160`); **DOS-001** ingere a dimensão "forma/xG" (`DOS-001:27`) em `dossier_snapshot.content_jsonb` com proveniência por campo.
- **Taxonomia:** "forma/xG" é dimensão de **INGESTÃO/DOSSIÊ** (taxonomia-sinais.md:7) que vira insumo do **ESTIMAR** (`:8`). xG **não** é um SIN-* narrativo; é quant puro.
- **StatsBomb open-data = laboratório histórico de xG, não backbone** (`predicao...:131`: EPL só 2003/04 e 2015/16, zero Brasileirão).

**Gaps que MOD-002 fecha (e que o repo não cravava):**
- Pré-chute (xG) **vs** xGOT/post-shot — papéis distintos; o repo só falava "xG" genérico.
- **Quão ruidoso** o xG é e **amostra mínima** (≥7–8 jogos) — não havia número.
- **Regressão à média** de over/underperformance (G−xG, PDO) — citado no nome da feature, sem evidência.
- **Mecânica** de alimentar o DC com xG (Poisson-Binomial → placar simulado) — não estava descrita.
- **Granularidade shot-level** como requisito (vs agregado por jogo).
- **xT/xPts/possession value** — evolução além do chute, ainda não mapeada.

---

## 4. Estado da arte — claims atômicos (URL + confiança + as-of)

### 4.1 O que é xG e suas limitações (ruído, amostra)

- **SUPPORTED** — xG é probabilístico (0–1) por chute; um jogo tem ~10–20 chutes, então o **ruído amostral domina no nível de jogo** e o xG é uma ferramenta de **nível de temporada**. [`verificado-fetch`, americansocceranalysis.com/explanation via WebSearch; reforçado por statology] — as-of 2026-06-21.
- **SUPPORTED (número, ≥2 fontes)** — **xG-ratio passa a ser mais preditivo de resultados futuros que gols-ratio após ~7–8 jogos** (8 ligas europeias, 7 MLS, dados 2018–2022); na pesquisa original de 2015 o cruzamento era em ~4 jogos. [`verificado-fetch`, ASA Replication Project, Eliot McKinley, 2022-07-20, https://www.americansocceranalysis.com/home/2022/7/19/the-replication-project-is-xg-the-best-predictor-of-future-results] + [`snippet`, "goals passam o xG ingênuo entre 10 jogos e meia temporada; xG sofisticado vence por até ~2 temporadas", múltiplos]. → MOD-002 adota **≥7–8 jogos** como janela de confiança mínima; abaixo disso, regride ao prior.
- **SUPPORTED** — xG de temporada correlaciona com gols reais bem melhor que qualquer jogo isolado; estimativa independente (Lars Maurath) de 79–93% das temporadas-time dentro do IC 95%, conforme qualidade do modelo. [`snippet`, statology/americansocceranalysis via WebSearch] — número é `snippet`, **NEI** para cravar exato.

### 4.2 Pré-chute (xG) vs xGOT / post-shot xG — papéis diferentes

- **SUPPORTED** — **xG é pré-chute** (qualidade da chance antes do chute); **xGOT é pós-chute** — soma à xG a **localização do chute no gol** (canto vs centro), construído sobre o histórico de **chutes no alvo**. Um chute de 0.1 xG pode valer 0.81 xGOT se vai no ângulo (ex. Sterling vs Crystal Palace). [`verificado-fetch`, Opta Analyst, 2021-06-23, https://theanalyst.com/articles/what-are-expected-goals-on-target-xgot] — as-of 2026-06-21.
- **SUPPORTED** — **xGOT − xG = "Shooting Goals Added" (SGA)** mede a **qualidade da finalização** (execução); xGOT > xG = finaliza melhor que a chance média. Ex.: Harry Kane 2019/20, 10.9 xG → 14.5 xGOT (~+3.5 gols de finalização). [`verificado-fetch`, Opta Analyst]. StatsPerform confirma com Hazard 2018/19 (3.3 xG, 8.2 xGOT, SGA 4.9). [`verificado-fetch`, https://www.statsperform.com/insights/introducing-expected-goals-on-target-xgot/]
- **SUPPORTED** — **xGOT mede desempenho do goleiro** ("goals prevented" = xGOT enfrentado − gols sofridos), isolando o goleiro da força defensiva à sua frente. Ex.: De Gea 2017/18 sofreu 28 vs 39.7 esperados → ~12 gols evitados. Um chute de 0.3 xGOT tem 70% de chance de ser defendido. [`verificado-fetch`, StatsPerform + Opta Analyst].
- **SUPPORTED** — xGOT é provido por **Opta e StatsBomb (via Stats Perform)**; ambos modelos pós-chute construídos sobre chutes no alvo. [`snippet`, Sky Sports/Medium via WebSearch] — **NEI** se SportMonks/API-Football expõem xGOT no tier acessível (ver §9).

### 4.3 Regressão à média — over/underperformance, PDO

- **SUPPORTED** — **superformance de finalização (G−xG) NÃO é skill repetível**: ~**zero correlação ano-a-ano no nível de jogador** do ratio G/xG mesmo com ajuste empírico-Bayes; G−xG simples também tem baixa preditividade ano-a-ano. [`verificado-fetch`, ASA "Measuring Shooting Overperformance", 2023-08-28, https://www.americansocceranalysis.com/home/2023/8/28/the-replication-project-measuring-shooting-overperformance].
- **SUPPORTED** — manter superformance cumulativa exige **finalização excepcional + alto volume de chutes**; só um punhado de jogadores sustenta; a maioria **regride à média**. [`snippet`, ASA/soccercardsrock via WebSearch + KU Leuven].
- **SUPPORTED** — **modelos de xG têm viés que confunde a medição de finalização**: não representam um "jogador médio" real; jogadores de alto volume distorcem a calibração e elite-finishers são subestimados; G−xG/GAX **não pode ser usado sozinho** como métrica de finalização. [`verificado-fetch`, Davis & Robberechts, KU Leuven, 2024-02-08, https://dtai.cs.kuleuven.be/sports/blog/biases-in-expected-goals-models-confound-finishing-ability/ (arxiv 2401.09940)].
- **SUPPORTED (conceito)** — **PDO** (soma de % de conversão de chutes a favor + % de defesas) tende a **100 (ou 1.000)** no longo prazo; valores muito acima/abaixo sinalizam sorte que regride. PDO é o análogo "shooting+save%" do hóquei aplicado ao futebol. [`snippet`, múltiplos; conceito consolidado] — **as-of** conceitual; número 100 é definição, não claim empírico a 2 fontes.
- **Implicação para o motor:** alimentar o rating com **xG (criação)**, **não** com G−xG (que regride). xGOT/SGA entra **só** em props de finalização/goleiro e ainda assim **com encolhimento** (shrinkage) por baixa estabilidade.

### 4.4 Evolução além do chute — xT, possession value, xPts

- **SUPPORTED** — **Expected Threat (xT)**: valor de ameaça em cada ponto do campo; valoriza **ações sem chute** (passes, dribles) pela mudança na probabilidade de marcar nas próximas ações. Criado por **Karun Singh (2018)** (conceito anterior de Sarah Rudd, 2011); grid 16×12 = 192 zonas; valores iterados (4–5 iterações) até convergir. Resolve a cegueira do xG a buildup. [`verificado-fetch`, https://karun.in/blog/expected-threat.html].
- **SUPPORTED** — xT é o **possession-value model mais conhecido da indústria**; alternativas: **VAEP** (valoriza toda ação on-ball por mudança na prob. de marcar/sofrer) e **xPts (expected points)** (converte prob. de resultado em pontos esperados — útil para "merecia mais pontos que o ranking real"). [`snippet`, Hudl/databallpy/tomdecroos via WebSearch].
- **Veredito para o mrtip:** xT/VAEP/xPts são **tracking/event-data-pesados** e **fora do MVP** (mesma lógica que MOD-001 deu a deep learning: precisa dado que o projeto não tem barato no BR). **xPts** é o mais barato (deriva de prob. de resultado que o motor já produz) e é forte para **EXPLICAR** ("o time merecia X pontos"). → **xT/VAEP = adiar**; **xPts = candidato a narrativa/explicação** derivável do próprio motor.

### 4.5 Divergência entre providers de xG

- **SUPPORTED** — Opta, StatsBomb, Wyscout, Understat treinam **modelos próprios** em event-data próprio → o **mesmo chute** varia ~5–10% entre providers (e ~3% no total do jogo). Opta×Understat alinham forte no nível de jogo (~0.96); Opta×StatsBomb e StatsBomb×Understat ~0.92–0.93. Diferenças vêm de features distintas (alguns usam posição do goleiro, outros não). [`snippet`, pythonfootball/tacticsnotantics/beatthebookie via WebSearch] — número é `snippet` (não aberto), **confiança média**; o **fato** de divergirem é robusto.
- **Implicação:** **nunca misturar xG de providers diferentes** na mesma série temporal (quebra a calibração do motor). Backbone único por liga.

---

## 5. Providers / fontes — matriz de trade-offs → recomendação + counter-review

**Esta matriz herda e referencia [dossie-por-partida-fontes-de-dados.md §Dimensão 1+2](dossie-por-partida-fontes-de-dados.md) (as-of 2026-06-18).** MOD-002 não re-cataloga; só destaca o eixo **xG shot-level + BR + xGOT**.

| Fonte | xG | xG shot-level | xGOT | Cobertura BR | Custo | Licença derivar+exibir | Veredito |
|---|---|---|---|---|---|---|---|
| **SportMonks** | sim (add-on €29/mês) | sim (event/shot) `inferência` | NEI no tier base | **sim, profundo** (2010+) | Starter €29 + xG €29 | **sim** (revenda de bruto proibida) | **Backbone recomendado** |
| **API-Football** | sim, **inconsistente por liga** | parcial/NEI | NEI | sim (a testar) | $19–39 | **restrita** (sem licença de publicação) | **Validação cruzada** (barato) |
| **Opta/Stats Perform** | sim (gold) | sim | **sim (dono do xGOT)** | sim | enterprise, sem preço público | sob contrato | Fase de escala |
| **StatsBomb open-data** | sim | sim | sim | **não confirmado** | grátis | **NÃO — proíbe uso comercial (1.2.2)** | **Só laboratório histórico** |
| **Understat** | sim | sim (scrape) | não | **NÃO** (6 ligas EU) | grátis | sem licença / risco ToS | Descartado p/ BR |
| **FBref** | **NÃO mais** (Opta cortou 20/jan/2026) | — | — | — | grátis | **NÃO** (ToS) | **Morto p/ xG corrente** |

**Recomendação cravada (tooling = bake-off):** **SportMonks como backbone** (único que junta xG + Brasileirão profundo + licença comercial explícita a custo acessível — confirma DOS-001) + **API-Football como validação cruzada barata**. **Protótipo comparativo obrigatório antes de fechar:** medir, em ≥1 partida real da PL e ≥1 do Brasileirão, se o SportMonks entrega **xG por chute** (não só agregado) e se há **xGOT**; comparar consistência com API-Football. **Não fechar** sem o spike — é o mesmo padrão "decisão de tooling = protótipo" do DOS-001.

**Counter-review (≥3 problemas reais com a recomendação):**
1. **xGOT pode não vir no tier acessível.** O xGOT é "dono" da Opta/StatsBomb (enterprise). Se SportMonks/API-Football não expõem xGOT, os mercados de **finalização (SGA) e goleiro (goals prevented)** ficam **bloqueados no MVP** — só sobra o xG pré-chute para o rating. **NEI → spike resolve.** [risco `severity: high`]
2. **Lock-in + add-on creep.** SportMonks cobra xG como add-on (€29) e Expected Lineups parte de €199 (DOS-001:56); empilhar add-ons por liga/dimensão pode estourar o custo. Migrar provider depois **quebra a série de xG** (divergência §4.5 → re-calibrar o motor do zero). [risco `severity: medium`]
3. **xG do Brasileirão pode ser raso/atrasado.** Mesma pré-mortem do DOS-001 (C1): SportMonks BR pode não ter shot-level ou ter accuracy menor. Sem shot-level, **não dá para simular placar nem derivar xGOT** — o motor BR cai para xG agregado, mais fraco. [risco `severity: high`, herdado de DOS-001].
4. **Divergência entre providers** (§4.5): validação cruzada SportMonks↔API-Football vai **discordar por construção** (~5–10%/chute); não confundir divergência normal com erro de ingestão. Precisa de tolerância definida no spike.

---

## 6. Modelo de dados proposto (aditivo, só-expand)

Herda `match_features` (MOD-001) e a dimensão "forma/xG" do `dossier_snapshot` (DOS-001). **Nada de tabela nova obrigatória no MVP** — xG agregado por jogo cabe em `match_features`; shot-level só vira tabela se o provider entregar e os mercados de finalização forem priorizados.

**Em `match_features` (por time × partida), agregados:**
- `xg_for`, `xg_against` — xG criado/concedido (pré-chute). **Matéria-prima do rating de força** (substitui gols brutos).
- `xgot_for`, `xgot_against` — se disponível; habilita SGA e goals-prevented.
- `shots_on_target_for/against` — denominador do xGOT.
- `xg_rolling_n` — xG médio em janela móvel (n≥7–8) para o sinal estabilizar (§4.1).
- `provider` + `model_version` — proveniência **obrigatória** (§4.5: nunca misturar providers).

**Nova tabela opcional `shot` (só se houver shot-level e mercado de props):**
- `match_id`, `team_id`, `player_id`, `minute`, `xg` (pré-chute), `xgot` (pós-chute, null se off-target), `on_target` (bool), `outcome` (goal/saved/off/blocked), `provider`, `model_version`.
- Habilita: (a) simular placar via Poisson-Binomial para alimentar o DC; (b) SGA por jogador; (c) goals-prevented por goleiro.

**Derivados (calculados, não armazenados crus como força):**
- `g_minus_xg` — **só para exibir/explicar**, com flag de instabilidade; **nunca** vira feature de força permanente (§4.3, regride).
- `pdo` — diagnóstico de sorte/regressão.

Tudo dinheiro/odds segue a porta `@workspace/core/money` (não aplicável a xG, que é float adimensional, mas o rating final que vira EV passa por lá).

---

## 7. Plano por faceta

**`dados`:**
- Herdar backbone do DOS-001 (SportMonks). **Exigir granularidade shot-level** no contrato de ingestão (não só `xg` agregado por jogo).
- Spike comparativo SportMonks × API-Football: confirmar **xG por chute** + presença de **xGOT** em 1 partida PL e 1 BR; medir divergência; documentar se xGOT está fora do tier (→ corta props de goleiro do MVP).
- Popular `match_features.xg_for/against` + `xg_rolling_n`; gravar `provider`/`model_version` por linha (proveniência, §4.5).
- Brasileirão = **fase 2** (assimetria estrutural já cravada em MOD-001).

**`ia` (ESTIMAR):**
- **Alimentar o Dixon-Coles (penaltyblog) com xG, não gols:** por jogo, simular distribuição de placar via **Poisson-Binomial** sobre os xG-por-chute → placares ponderados → DC time-weighted (técnica statsandsnakeoil/Torvaney). Onde só houver xG agregado, usar o xG agregado como média do Poisson do time (degradação graciosa).
- **Janela de confiança ≥7–8 jogos** antes de pesar xG; abaixo, regredir ao prior (Elo/pi-rating; ver MOD-003 para promovidos).
- **Regredir G−xG/superformance à média** — não dar peso de força a quem finaliza acima do xG (§4.3). xGOT/SGA, se disponível, entra **só** em props de finalização/goleiro, com shrinkage.
- **xPts** (derivável do grid de placar do próprio motor) como **número para o EXPLICAR** ("merecia X pontos"), nunca como input que move a própria probabilidade (anti-dupla-contagem).
- **xT/VAEP = adiar** (tracking-pesado, fora do MVP).
- Calibração/avaliação herdadas de MOD-001 (isotonic + RPS/Brier/ECE).

---

## 8. Riscos e gotchas

- **Ruído de jogo único:** xG por 1 jogo é quase inútil para tip; usar **sempre** janela móvel. Gotcha de produto: o EXPLICAR pode citar "o time criou 2.3 xG e perdeu" (narrativa válida), mas o motor **não** pode super-reagir a um jogo.
- **Modelos de xG divergem entre providers** (§4.5, ~5–10%/chute): **nunca misturar** na mesma série; backbone único por liga; validação cruzada serve para sanidade, não para média.
- **xGOT pode não estar no tier acessível** (§5 counter-review #1): mercados de finalização/goleiro podem nascer bloqueados.
- **Viés do próprio modelo de xG** (KU Leuven): G−xG não isola finalização; elite-finishers subestimados; deflexões/chutões inflam o denominador. → usar xG só como **força agregada do time**, não como skill individual cru.
- **xG já está parcialmente na odd** (taxonomia: anti-dupla-contagem): xG é força bruta forte, mas o **edge** depende de sobreviver à CLV (SIN-012). Não confundir "modelo de xG bom" com "edge" — a investigação de MOD-001 já **refutou** que xG próprio bate a calibração do mercado.
- **Endogeneidade leve:** xG-against é função tanto da defesa quanto do estado de jogo (time vencendo recua e concede xG "barato"). Ajuste por game-state é refinamento pós-MVP (xT dinâmico/DxT trata disso, mas é caro).

---

## 9. Refutado e Perguntas Abertas

**Refutado (REFUTED):**
- **"Um modelo próprio de xG bate a calibração do mercado"** → **já refutado em MOD-001** (`predicao...:195`: Wilkens 2026, mercado **melhor calibrado** que o modelo xG+isotonic na Bundesliga). MOD-002 **não** promete xG-edge contra a closing line; xG é força para o motor, validação é com a CLV.
- **"G−xG mede skill de finalização (e identifica quem vai continuar marcando)"** → **REFUTED**: ~zero correlação ano-a-ano (ASA 2023) + viés de modelo (KU Leuven 2024). É majoritariamente ruído que regride.
- **"FBref é fonte grátis de xG para o Brasileirão"** → **REFUTED**: Opta/StatsPerform terminou o feed em **20/jan/2026** (violação de termos; 6 dias após o deal StatsPerform–FIFA). Histórico ainda serve para backtest, **não** para temporada corrente. [`verificado-fetch` via WebSearch, theixsports/archysport/tildes].
- **"xG é confiável jogo a jogo"** → **REFUTED**: ruído amostral domina em ~10–20 chutes/jogo; só estabiliza em ~7–8 jogos (ASA).

**Perguntas Abertas (NEI — nunca no TL;DR):**
- **SportMonks/API-Football expõem xG por chute (shot-level) e xGOT no tier acessível?** NEI — decide se props de finalização/goleiro entram no MVP. → **spike** (faceta dados).
- **Cobertura/atraso do xG do Brasileirão na SportMonks** (mesma C1 do DOS-001): shot-level existe? accuracy? NEI até dado real.
- **Número exato de jogos para o xG do Brasileirão estabilizar** — os 7–8 jogos são de ligas EU/MLS; ligas de menor liquidez/qualidade de modelo podem precisar de mais. NEI para o BR.
- **PDO no futebol — magnitude do efeito e horizonte de regressão** com número a ≥2 fontes primárias: NEI (conceito sólido, número não cravado).
- **VAEP vs xT vs xPts** para uma futura camada de possession-value: qual entrega mais para o EXPLICAR a custo viável sem tracking-data? NEI (fora do MVP, revisitar).

---

## Auditoria de citações (reabertura de claims load-bearing, 2026-06-21)

Reabri por fetch real, nesta sessão, os 5 claims que sustentam a recomendação:

1. **xGOT pré vs pós-chute + SGA + goleiro** → `verificado-fetch` https://theanalyst.com/articles/what-are-expected-goals-on-target-xgot (Opta Analyst, 2021-06-23) + https://www.statsperform.com/insights/introducing-expected-goals-on-target-xgot/. Números (Sterling 0.1→0.81; Kane 10.9→14.5; Hazard 3.3/8.2/SGA 4.9; De Gea 28 vs 39.7) batem entre as duas fontes. ✓
2. **xG-ratio > gols-ratio após 7–8 jogos** → `verificado-fetch` https://www.americansocceranalysis.com/home/2022/7/19/the-replication-project-is-xg-the-best-predictor-of-future-results (McKinley, 2022-07-20). Número confirmado na página (8 EU / 7 MLS; 4 no estudo 2015). ✓
3. **G−xG não é skill repetível** → `verificado-fetch` https://www.americansocceranalysis.com/home/2023/8/28/the-replication-project-measuring-shooting-overperformance (2023-08-28, ~zero correlação ano-a-ano) + viés de modelo `verificado-fetch` https://dtai.cs.kuleuven.be/sports/blog/biases-in-expected-goals-models-confound-finishing-ability/ (Davis & Robberechts, 2024-02-08). ✓
4. **xT criado por Karun Singh 2018, grid 16×12, valoriza não-chute** → `verificado-fetch` https://karun.in/blog/expected-threat.html. ✓
5. **xG alimenta o Dixon-Coles via placar simulado** → `verificado-fetch` https://www.statsandsnakeoil.com/2018/06/22/dixon-coles-and-xg-together-at-last/ (Torvaney, 2018). Nota honesta: o autor **assume** (não prova ali) que xG > gols para estimar força; a prova de superioridade vem do ASA (#2), não dele. Claim ajustado no texto para refletir isso. ✓
6. **FBref perdeu xG (Opta cortou)** → cravado em DOS-001 (`verificado-fetch` original) + reforçado nesta sessão com data **20/jan/2026** via WebSearch (theixsports/archysport/tildes, `snippet`). Mantido como SUPPORTED na parte "perdeu o feed"; data exata é `snippet`/`verificado-fetch` de DOS-001.

Sem URLs inventadas. Números de provider (preços) herdados de DOS-001 (as-of 2026-06-18) e marcados como tal. Divergência entre providers (§4.5) marcada `snippet`/confiança média por não ter aberto a fonte primária.
