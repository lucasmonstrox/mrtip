# Investigação — Mercados e motor do prompt de prognóstico (MOD-004)

> Escopo: melhorar o pipeline VIVO de prognóstico (`apps/api/scripts/prognosis-prompt.ts` + `run-deepseek.ts`) cobrindo TODOS os mercados de aposta e o cruzamento fases-do-jogo × muitos/poucos gols.
> Base externa: dossiê de pesquisa web (61 subagentes, 1138 buscas) em `scratchpad/dossie-mercados-prognostico.md` — usado como arqueologia externa já feita.
> Arqueologia interna (esta sessão): 3 frentes read-only sobre registro de features, schema e blast radius.
> Data: 2026-07-01.

---

## TL;DR + recomendação

O prompt vivo já opera a filosofia sharp certa (Poisson como PRIOR em 2 rotas, roteiro como UPDATE, intenção/stakes movendo o número). Mas a arqueologia interna cruzada com a arquitetura **já cravada** (`arquitetura-agente-prognostico.md`, `agente-selecao-melhor-mercado.md`, `predicao-...-estado-da-arte.md`) muda a ordem de prioridade do dossiê. **Recomendação faseada:**

1. **Antes de qualquer calibração fina, construir o harness de MEDIÇÃO** (backtest do `best_bet` em ≥10-15 jogos + log prob-prevista vs resultado). É pré-requisito EXPLÍCITO já cravado (`analise-prompt-prognostico.md`) e pré-condição matemática do Dixon-Coles (ρ estimado por MLE, não chutado). Sem isso, toda "correção" é chute com verniz.
2. **Correção estrutural do motor determinístico** (barata, sem dado novo, e — o ponto de altitude — é o **primeiro passo concreto rumo à arquitetura quant-first cravada**): aplicar Dixon-Coles em `marketProbs` e **materializar o grid de placar** (hoje computado e jogado fora). Isso tira produção de número de dentro do LLM e coloca em código determinístico — exatamente o que a arquitetura manda. De um único grid corrigido saem, coerentes por construção: placar exato, dupla chance, DNB, HT/FT, odd/even, multigoals, first-to-score.
3. **Baseline de liga por fase** (barata): o prompt mostra o timing do time por faixa de 15min mas não tem contra o que comparar (~44/56 1ºT/2ºT, pico em 76-90) — sem baseline o LLM não sabe o que é anômalo. Substituir também o `share1` hardcoded 0.45 pelo split real da liga.
4. **Ler stats já ingeridas mas mortas**: `match_team_stats.corners` e a tabela `card`. **Escanteios é o mercado novo de maior ROI** (dado existe, edge real em mercado soft, não bloqueado). **Cartões fica bloqueado** por falta do sinal dominante (árbitro não é ingerido).
5. **Correções de doutrina no prompt** (camada EXPLICAR): o park-the-bus está com **sinal invertido**, e o empate está **sistematicamente fechado** como aposta.

**Ressalva de altitude que atravessa tudo:** vários "edges" do dossiê (fade the public, viés favorito/azarão, game-state, momentum) já foram classificados em investigações anteriores como **EXPLICAR / redutor de confiança**, não ESTIMAR — porque são **endógenos e já precificados** na odd de fechamento. Eles entram como texto auditável, nunca inflando probabilidade. Ver §Refutado.

---

## Contexto e problema

Pedido do João: workflow pesado de pesquisa web sobre como apostadores pensam TODOS os mercados (1x2, over/under, BTTS, AH, dupla chance, DNB, correct score, HT/FT, escanteios, cartões, props…), o cruzamento das fases do jogo (minuto-a-minuto, faixas de 15', tempos) com muitos/poucos gols, e o contexto não-estatístico (mood, notícias, lesões, rivalidade). Objetivo: o que melhorar no prompt de geração de prognóstico.

**Requisitos implícitos assumidos** (o pedido não falou, o repo exige):
- Regulação BR (Lei 14.790/2023): +18, jogo responsável, **sem promessa de ganho** — a saída é probabilidade/leitura, nunca "aposta certa". O reenquadramento "prob-only, não veredito de valor" (§Rec 5) reforça isso.
- Separação quant/LLM (arquitetura cravada): número é determinístico; LLM explica.
- Tese do projeto ([[projeto-aposta-precisa-de-evidencia]]): todo pick mostra o porquê + evidência.
- Dinheiro em centavos, fuso `America/Sao_Paulo` — não relevante a esta feature (sem dinheiro/data-aritmética nova).

**Achado de registro:** o pipeline vivo **não tinha feature** — `run-deepseek`/`persist-prognosis`/`prognosis-prompt`/`match_prognosis` não aparecem em `docs/features/`. As features de prognóstico existentes (MOD-001, AGT-001, AGT-002) são o DESIGN greenfield (`investigado`/`ideia`), não o que roda. Esta investigação registra o pipeline vivo como **MOD-004** e o posiciona como o caminho incremental que de-risca o MOD-001.

---

## Estado real no código (real × morto × fantasma)

Todas as âncoras vêm de leitura/busca desta sessão.

### Motor determinístico (`prognosis-prompt.ts`)
- **REAL:** `marketProbs(lh,la)` (`prognosis-prompt.ts:422-440`) monta `ph[h]` e `pa[a]` (Poisson por time) e no duplo laço soma `p = ph[h]*pa[a]` — **Poisson independente**. Retorna só `home/draw/away/over15/over25/over35/btts`.
- **FANTASMA (grid descartado):** o produto `ph[h]*pa[a]` — a matriz de placar conjunta completa — existe DENTRO do laço mas **nada é retornado além dos agregados**. Placar exato, margem (handicap), paridade, multigoals, HT/FT, first-to-score são todos deriváveis dessa matriz, hoje jogada fora.
- **REAL:** 2 rotas de λ — gols puros (`lambdaHome/Away`, `:448-449`) e SoT×conversão (`xgViaSotHome/Away`, `:511-512`); `marketProbs` roda nas duas (`probsGoals`/`probsSot`, `:520-521`) + por tempo (`probs1t/probs2t`, `:533-534`).
- **REAL mas hardcoded:** `share1` cai em 0.45 quando não há dados de tempo (`:530`) — deveria ser o split real da liga.

### Saída tipada (`run-deepseek.ts`)
- **REAL:** saída é **JSON Schema (AI SDK)** via `jsonSchema<Prognosis>` + `Output.object` (`run-deepseek.ts:110-135,145`). Não é TypeBox nem Zod.
- **REAL:** enum `best_bet.market` = `["1x2","over_under","btts","handicap","team_total"]` (`run-deepseek.ts:113`). `double_chance`/`draw_no_bet` **ausentes** (só aparecem como prosa "dupla-chance" no prompt `:1260`).
- **REAL:** `general` = `total,total_1t,total_2t,over25_prob,btts_prob,one_x_two{,_1t,_2t},confidence,summary` (`:98-109`).

### Persistência e leitura (blast radius)
- **REAL:** `match_prognosis` grava em **colunas tipadas** (`bestBetMarket/Selection/Team/Line/Confidence/Probability/Analysis`, todas text/real nullable) + `rawOutput jsonb` (`leagues.ts:496-534`; map em `persist-prognosis.ts:53-58`). **Nenhuma migração** é necessária para um valor de mercado novo — `market`/`selection` são `text` livre; um mercado que precise de coluna própria é a exceção.
- **REAL:** `get-prognosis.service.ts:12-62` remonta o payload por passthrough (sem validar `market`); rota `/matches/:id/prognosis` (`matches.routes.ts:65`) sem response-schema → tipo inferido pelo Eden.
- **REAL:** UI `prognosis.tsx` renderiza **um card único** cujo título vem de `betLabel()` (`:186-204`) — um `if` por mercado. Adicionar mercado = **novo branch**, não card novo.
- **Superfície mínima de um mercado novo = 3 arquivos**: prompt (instrução), `run-deepseek.ts:113` (enum), `prognosis.tsx` (label). Zero migração.

### Dados ingeridos mas NÃO consultados pelo prompt (âncoras)
| Dado | Coluna/tabela | Âncora | Veredito |
|---|---|---|---|
| Escanteios (time) | `match_team_stats.corners` | `leagues.ts:304` | **EXISTE, MORTO** (só indireto via momentum trend type 34) |
| Cartões | tabela `card` (type y/r/yr, minute) | `leagues.ts:434-450` | **EXISTE, MORTO** (nem importado no prompt) |
| Faltas a favor | `match_team_stats.freeKicks` | `leagues.ts:305` | EXISTE, MORTO |
| Cruzamentos (time) | `match_team_stats.crosses*` | `leagues.ts:319-320` | EXISTE, MORTO |
| SoT/KP por jogador | `lineup_player.shotsOnTarget/keyPasses` | `leagues.ts:258-259` | EXISTE, **só agregado por time** (`:94-112`); nunca por jogador |
| xG (time) | `match_team_stats.xg` | `leagues.ts:283-284,327` | **FANTASMA reservado** — add-on 5304 não comprado, sempre NULL |
| Árbitro | — | (nenhuma) | **NÃO EXISTE** (nem ingerido) |
| Faltas cometidas | — | (só freeKicks=a favor) | NÃO EXISTE |
| Chutes totais por jogador | — | (só `shotsOnTarget`) | NÃO EXISTE |

Consequência: `player_shots_on_target` e `goalscorer` (via tabela `goal`) são **viáveis hoje**; `player_total_shots` **não** (sem chutes totais per-jogador). Escanteios é viável e não bloqueado. Cartões precisa de árbitro (`needs_new_data`).

---

## Estado da arte / mercado (dossiê — claims atômicos)

Confiança: `web-verificado` = fonte fetchada no workflow; `single-origin` = recitado. As-of 2026-07 (workflow desta sessão).

### Motor / modelagem
- **Poisson independente subestima 0-0/1-0/0-1/1-1 e superestima Over e BTTS** — Dixon-Coles (1997) corrige com fator τ só nesses 4 placares, ρ ≈ −0.03 a −0.15 estimado por MLE. `web-verificado`. É o viés nº1 do mercado de total.
- **Todo mercado deve nascer da MESMA matriz de placar** (Dixon-Coles), nunca de modelos marginais por mercado — senão surgem "mercados fantasma" que parecem se confirmar por artefato de correlação. `web-verificado`.
- **Split casa/fora obrigatório no λ** (misturar destrói o home-advantage embutido). Time-decay `exp(−ξt)` só compensa multi-season (com 1 season ξ→0). `web-verificado`.
- **Blendar modelo com mercado ~45/55** bate modelo puro (DataGolf); a odd de fechamento é o melhor proxy de prob real. `single-origin` (DataGolf).

### Fases do jogo × muitos/poucos gols (pedido central)
- Curva de gols **não é uniforme**: ~10/15/20/15/20/20-25% nas 6 faixas; 0-15 é a mais pobre; picos no FIM de cada tempo (31-45 e 76-90). `web-verificado` (ResearchGate, PlayThePercentage, PMC).
- **1ºT/2ºT ~44/56**, estrutural, varia por liga (PL ~50/50, La Liga 43/57, Serie A/Brasileirão 45/55) → calibrar por liga. 76-90 é a faixa mais goleadora (18-25%), engordando por acréscimo pós-2023. `web-verificado` (Sportingpedia, Caley/Expecting Goals).
- O salto do 2ºT é **majoritariamente defensivo** (fadiga degrada marcação, pico 80-85'), recai no time cansado sofrer. `web-verificado`.
- **Cruzamento central:** jogo onde os dois precisam vencer concentra mais gol tardio → empurrar a FORMA da curva `xg_bands`, não só o total. Mata-mata/decisão reduz o share do 1ºT (~44%→~37%) → under estrutural no 1ºT. `single-origin`.
- **Chasing tardio converte PIOR** (chute apressado) → moderar (não anular) o `xg_band` 76-90 do lado que persegue. `single-origin`.
- Âncoras: 0-0 no HT tem prior ~25% (não 50/50); sem gol até o HT → P(over 2.5) ~16%; quem marca antes dos 15' vence ~60-66%. `web-verificado`.

### Contexto não-estatístico
- **Árbitro é a variável dominante de cartões** (desloca 20%+ sozinho). `web-verificado`. Não ingerido → `needs_new_data`.
- **Derby: único ajuste com evidência forte é o desconto no mando** (Brasileirão 52.4%→30.0%, p≤0.001); emoção sobe VOLUME (cartões), não gols. `web-verificado` (bate `regras/rivalidade.md`).
- **Mood/redes mede o TORCEDOR, não o vestiário** (~56% acurácia só texto) → não construir score de humor. `web-verificado`.
- **Notícia é evento de volatilidade, não edge por si** — valor é agir antes do mercado; narrativa é superprecificada → ângulo de valor costuma ser CONTRA. `single-origin`.
- **Retorno de lesão ≠ crédito pleno** — ferrugem mensurável, ancorar em minutos pós-retorno. `single-origin`.

---

## Reconciliação com a arquitetura cravada (o núcleo desta investigação)

O dossiê é forte, mas foi produzido cego às decisões internas. Cruzando com `docs/investigacoes/` + `docs/arquitetura/` + `docs/regras/`:

**1. A correção do motor É o caminho da arquitetura, não um desvio.** `arquitetura-agente-prognostico.md` crava **quant-first-explainer**: tudo que vira número é determinístico, o LLM só gera texto e recebe números por referência (nunca transcreve dígito); confiança = f(calibração), não f(|edge|). O prompt VIVO viola isso — o LLM emite `xg`, `over25_prob`, todas as probabilidades e o `best_bet`. Logo, **mover Dixon-Coles + grid de placar + todos os mercados derivados para dentro de `marketProbs` (código) e deixar o LLM só EXPLICAR/escolher direção** não é só bug-fix: é a primeira parcela concreta da migração para a arquitetura decidida. Corolário: recs do dossiê que pedem o LLM emitir MAIS números (`fair_odds`, mais probabilidades) devem ser **computadas em código** e passadas por referência.

**2. MEDIR antes de calibrar (diretiva dura).** `analise-prompt-prognostico.md` crava: "**NÃO calibrar mais viés-under sem MEDIR** — precisa lote de 10-15 jogos + medir acerto do `best_bet`". E `agente-selecao-melhor-mercado.md`: **calibração > acurácia por ~70pp de ROI**; confiança = f(calibração), não f(edge). Portanto o Dixon-Coles (ρ por MLE) e a correção do park-the-bus **exigem o harness de backtest primeiro** — que é justamente o que MOD-001 propõe (`backtest_clv`, `model_predictions`). O harness sobe de "nice-to-have" a **pré-requisito**.

**3. Onde o edge realmente vive (várias investigações concordam).** `agente-selecao-melhor-mercado.md` + `predicao-...-estado-da-arte.md`: edge NÃO mora no 1X2 de liga grande (77.63% das "ineficiências" = ruído; 8 LLMs apostaram uma PL e todos perderam) — mora em **cartões, escanteios e ligas ilíquidas**. Isso **eleva escanteios** ao mercado novo de maior valor (dado existe, não bloqueado) e confirma cartões como alvo (bloqueado só pelo árbitro). E rebaixa o entusiasmo com refinar o 1x2.

**4. Score-effects / game-state são ENDÓGENOS.** `game-state-timing-de-gols.md` (SIN-017): a taxa de gols não-homogênea no tempo é **parâmetro de calibração λ(t)**, não edge; score effects são reais mas **já embutidos na odd pré-jogo**. Logo o cruzamento fases×gols (pedido central) entra como **melhoria de calibração da distribuição `xg_bands`** e como EXPLICAR — não como fonte de edge autônomo. A correção do park-the-bus é sobre **não enganar a narrativa**, não sobre "achar valor no under".

**5. "Fade the public" / viés favorito-azarão / momentum: EXPLICAR, não ESTIMAR.** `vies-favorito-azarao.md` (SIN-018) e `steam-moves-sharp-vs-square.md` (SIN-019): FLB e dinheiro recreativo são reais mas **comprimidos a ~zero na closing Pinnacle/Betfair**; "fade the public" como estratégia autônoma é mito/já precificado. `attack-momentum-pressao-da-partida.md` (SIN-021): momentum é **descritivo, in-play/pós-jogo — não deveria tocar o prognóstico pré-jogo** (e hoje toca, `prognosis-prompt.ts:876-903`). Então a rec do dossiê de "fade de reputação" no 1x2 vira **redutor de confiança**, não direção; e o uso pré-jogo de momentum é uma **tensão a revisar**, não a expandir.

---

## Opções e recomendação

### Mercados novos — matriz
| Mercado | Fonte | Custo | Edge (por investigações) | Veredito |
|---|---|---|---|---|
| dupla chance, DNB | grid 1x2 (já existe) | 3 arquivos, 0 migração | baixa variância; casa com "empate fechado" | **FAZER** |
| placar exato, odd/even, multigoals, HT/FT, first-to-score | grid materializado | motor + campos | coerência por construção | **FAZER** (com grid) |
| escanteios (total/handicap/team) | `match_team_stats.corners` (morto) | ler dado + λ próprio | **edge alto** (mercado soft) | **FAZER — maior ROI** |
| clean sheet / win-to-nil | grid + `convDef` (existe) | campos | baixo | fazer junto |
| goalscorer (anytime) | tabela `goal` + SoT/jogador | bloco novo | médio | fazer (fase 2) |
| player shots on target | `lineup_player.shotsOnTarget` | bloco por jogador | médio (prop limpo) | fase 2 |
| cartões | tabela `card` (morto) + **árbitro (falta)** | ler + ingerir árbitro | alto MAS bloqueado | **precisa árbitro** |
| player total shots, euro handicap detalhado | — | — | — | `needs_new_data` |

### Recomendação (ordem)
1. **Harness de medição** (backtest do `best_bet` + log de calibração). Pré-requisito de tudo que é calibração.
2. **Motor:** Dixon-Coles em `marketProbs` (ρ por MLE no harness) + materializar o grid → dupla chance, DNB, placar exato, odd/even, multigoals, HT/FT, first-to-score de graça e coerentes.
3. **Baseline de liga por faixa** + split 1ºT/2ºT real (mata `share1`=0.45) → o cruzamento fases×gols do pedido central.
4. **Escanteios** (ler `corners`, computar λ de escanteio, novo mercado).
5. **Doutrina no prompt** (EXPLICAR): corrigir park-the-bus; abrir empate/DC como pick legítimo; reenquadrar `best_bet` como prob-only + `fair_odds` no-vig (computado em código).
6. **Fase 2:** goalscorer + player SoT; cartões (quando árbitro for ingerido); contexto (notícia tipada W-018, retorno-com-ferrugem W-040).

### Counter-review (o que sobreviveu / virou risco)
- *Contestado:* "adicionar todos os 20+ mercados". **Vira risco:** mercado sem edge (odd/even, 1x2 de liga grande) só adiciona superfície e ruído de narrativa; priorizar os de edge real (escanteios) e os de baixa-variância que o João valoriza (DC/DNB/multigoals). Mercado é feature de EXPLICAR/coerência, não de edge por si.
- *Confirmado:* Dixon-Coles + grid como espinha — múltiplas fontes web + alinhamento com quant-first.
- *Risco declarado:* sem odds ingeridas, nada disso vira EV/CLV real — é probabilidade melhor calibrada, não "valor". Não prometer valor (regulação + honestidade).

---

## Modelo de dados proposto

- **Sem migração para o núcleo:** dupla chance/DNB/placar exato reusam `bestBetMarket/Selection/Line` (text/real) + caem em `rawOutput jsonb`. Campos `general.*` novos vivem no jsonb até valer coluna própria.
- **Novos campos de saída (schema `run-deepseek.ts`, computados em código quando numéricos):** `general.fair_odds_1x2`, `draw_value_flag`, `game_openness`, `correct_score_top`, `odd_even_prob`, `multigoals`, `first_to_score`, `ht_ft`, `most_goals_half`, `corners{total,line,home,away}`, `league_band_baseline`. Enum `best_bet.market` += `double_chance,draw_no_bet,corners,correct_score,clean_sheet,ht_ft,odd_even,multigoals` (faseado).
- **Precisa dado novo:** árbitro (tabela/coluna) para cartões; odds (abertura/fechamento) para EV/CLV; xG add-on 5304 (opcional).

## Plano por faceta

- **dados:** baseline de liga por faixa + split real (sobre `played`); ler `corners`/`card`; (fase 2) ingerir árbitro.
- **ia (motor):** τ Dixon-Coles + grid materializado em `marketProbs`; funções `topScores`, `marginDist`, `htftMatrix`, `oddEven`, `cornersLambda`; expor confiança/tamanho de amostra junto do λ.
- **ia (prompt):** corrigir park-the-bus; regra de empate/DC; `xg_bands` remodelado por `bothPush`; reenquadrar `best_bet` prob-only.
- **api:** estender enum + campos `general.*`.
- **ui:** branches de `betLabel` (`prognosis.tsx:186-204`) para os mercados novos.

## Riscos e gotchas

- **Calibrar sem medir** contradiz diretiva cravada — o harness é gate, não opcional.
- **Proliferação de mercados** dilui a leitura e multiplica narrativa (risco de "confiança por narrativa", vedado pela arquitetura).
- **Momentum pré-jogo** (`:876-903`) contraria SIN-021 (descritivo/in-play) — revisar, não expandir.
- **1 season só** limita time-decay, H2H de treinador, cross-season (destrava com LIG-011).
- **`bandOf` joga 45+x em '46-60'** (`:267`) — diverge da convenção de mercado (acréscimo do 1ºT em '31-45'); pode subestimar o 1ºT ao comparar com linha de mercado.
- **Regulação:** saída é leitura/probabilidade, nunca promessa de ganho (Lei 14.790).

## Refutado (com a evidência que matou)

- **"Fade the public" / viés favorito-azarão como edge direcional** — REFUTADO por `vies-favorito-azarao.md` (SIN-018): comprimido a ~zero na closing. → vira redutor de confiança (EXPLICAR).
- **"Time cansado faz menos gol / under de festa"** — REFUTADO por `janelas-sazonais-fadiga.md` (SIN-020): meta-análise sem efeito (G=0.12, p=0.134). O real da fadiga é lesão/disponibilidade (→ SIN-011), não driver de over/under. → a remodelagem `xg_bands` por `bothPush` é **timing/λ(t)**, não sinal de fadiga-under.
- **"Under do mata-mata como sinal de rivalidade" / "abolir gol fora → over"** — REFUTADO por `derby-por-formato-de-competicao.md` (SIN-007): efeito genérico de copa, dupla-contagem. Confirmado só: desconto de mando + mais cartões.
- **"Técnico revanche vs ex-clube"** — folclore (`regras/rivalidade.md`); sem estudo isolando.
- **Score-effects / game-state como edge autônomo pré-jogo** — endógenos, já na odd (SIN-017). → calibração + EXPLICAR.
- **LLM emitir número como fonte de verdade** — 8 LLMs apostaram uma PL e todos perderam (`predicao-...-estado-da-arte.md`); LLM alucina número 17-55% (`agente-selecao-melhor-mercado.md`). → quant calcula, LLM explica.

## Perguntas abertas / lacunas

**Decisões do dono (2026-07-01):**
- ✅ **Caminho: incremental (MOD-004)**, não o salto ao MOD-001 greenfield.
- ✅ **Backtest: começar com lote pequeno** (10-15 jogos da PL 25/26) — é a fase 1 (harness), não esperar mais ingestão.
- ✅ **Momentum pré-jogo: decidir no `/pl` via mini-teste A/B** (com vs sem momentum, mede acerto do `best_bet` no backtest — decisão sai do número, não do palpite). Resolve a tensão SIN-021 empiricamente.

**Ainda abertas:**
- **ρ do Dixon-Coles:** valor exato precisa de MLE sobre os jogos ingeridos — número virá do harness, não do dossiê (faixa −0.03 a −0.15).
- **Odds:** sem ingestão de odds, EV/CLV ficam fora — quando priorizar DOS-001/SIN-012?
- **`match_team_stats.xg`:** confirmado NULL (add-on não comprado) — reconfirmar se algum jogo tem valor antes de assumir 100% morto (dev DB pode ter seed pontual).

---

## Fontes web decisivas (do workflow, as-of 2026-07)

- Dixon & Coles (1997), modelo de correlação de placares baixos — base da correção τ.
- ResearchGate — gols por período de 15min; PlayThePercentage — "what time are goals scored"; PMC10923682 — features temporais de gols/substituições.
- Sportingpedia — distribuição 1ºT/2ºT nas top-5; Expecting Goals (Caley) — "The Game of Two Halves" e substitute effects.
- DataGolf — blend modelo/mercado ~45/55; Pinnacle — corners como "value alternativo" e devig.
- Ötting et al. (arXiv 2211.06052) — "Gambling on Momentum" (momentum como ruído, não sinal robusto).

_(Lista completa de URLs no dossiê `scratchpad/dossie-mercados-prognostico.md`, §FONTES WEB.)_
