# Recomendação de Arquitetura — Agente de IA para Prognóstico Detalhado (mrtip)

## 1. Resposta direta

O agente vai dar o prognóstico em cada detalhe assim: um **motor determinístico em TypeScript** (o QUANT, função pura em `packages/core`, sem LLM) lê um **snapshot imutável do dossiê** e produz uma **tabela sinal-a-sinal** — para cada sinal (xG, desfalque, bola parada, árbitro, calendário, estilo, contexto) um registro com direção, magnitude, confiança e ponteiro de fonte. O número NUNCA nasce no LLM; o Claude (Sonnet 4.6) só **reescreve em português citando a fonte**, e nem digita o número — recebe os campos por referência. A correção mais importante sobre as 4 propostas: o QUANT decompõe o **RESÍDUO contra o mercado** (onde e por que discordo da linha), não o lambda absoluto — senão você re-precifica o que a casa já viu e fabrica "edge" fantasma. Para o usuário final isso aparece como **probabilidade e análise com proveniência**, sob gate +18 e jogo responsável — sem linguagem de "aposta de valor / stake / lucro" (risco legal nº1 da Lei 14.790).

A espinha é a vencedora (**quant-first-explainer**, score 20). Enxerto: o **schema obrigatório por sinal** do Ângulo 3 (força "cada detalhe"), o **fallback ao dossiê cru** e o **content-addressing**; o **CLV-por-sinal testável** e a **degradação honesta** do Ângulo 4; e o **raciocínio agêntico de aprofundamento** do Ângulo 2 — mas confinado ao **offline (Opus)**, nunca no caminho do número ao vivo, porque os juízes provaram que a discricionariedade agêntica quebra a calibração (estimador não-estacionário) e o determinismo de auditoria.

---

## 2. A arquitetura recomendada — pipeline ponta a ponta

Fronteira rígida: **tudo que vira número é determinístico; o LLM é estritamente gerador-de-texto sem autoridade numérica.**

**Estágio 0 — Ingestão (determinístico, job batch, ZERO LLM).** Cron/worker de coleta grava fatos em `observation` (append-only, `{value, source, observed_at, ref_id}`, modelo DOS-001). Roda fora do caminho do prognóstico.

**Estágio 1 — Snapshot imutável (determinístico).** `buildDossierSnapshot(matchId)` agrega as `observation` num `content_jsonb` **canonicalizado** (chaves ordenadas, floats quantizados — senão "mesmo input → mesmo hash" é mentira) e grava `dossier_snapshot` com `content_hash` (sha256). É o único objeto que as camadas seguintes leem. Congela o estado do mundo no instante do pick (`pick.created_at < kickoff_at`).

**Estágio 2 — QUANT (determinístico, TS puro, sub-ms, ZERO LLM).** Lê o snapshot e produz o `PrognosisObject`. Aqui mora a correção central (ver §3): decompõe o **resíduo vs. linha de mercado**, não o lambda absoluto. Calibração isotônica/Platt sobre ledger de resultados liquidados, com **gate de ECE** (>0.05 → não publica aquele mercado). Poisson/Dixon-Coles (ρ≈−0.13) mapeia λ → P(mercado). Cada sinal sai com `{direcao, delta_residual, confianca_calibrada, refs[], status_evidencia}`.

**Estágio 3 — Explicador (LLM, structured output).** Rota `GET /partidas/:id/prognostico` chama a Anthropic passando SÓ o `PrognosisObject` + trechos de proveniência. **O LLM recebe os números por referência (`signal_id`) e emite apenas `{signal_id, source_ref, narrativa}`** — o código costura direção/magnitude/confiança por join. Isso mata o furo de transposição (1.55→1.5, troca casa↔fora) que os juízes acharam no Ângulo 2/4: o LLM nunca transcreve um dígito.

**Estágio 4 — Validação pós-LLM em 3 camadas (determinístico + Haiku).**
- (a) **Lexical**: todo número que escapar na prosa tem de existir literal no struct (com tolerância de arredondamento controlada).
- (b) **Semântica de direção** (o furo que os juízes mais cobraram): um check confirma que a direção causal da frase bate com o campo `direcao` do struct — Haiku 4.5 classifica `over/under/neutro` da frase e compara; divergência → descarta narrativa, cai em template estático.
- (c) **Relevância da fonte**: o `source_ref` citado precisa pertencer ao conjunto `refs[]` daquele sinal — não basta existir no snapshot (proveniência por relevância, não por presença).
Qualquer falha → fallback para template determinístico. O LLM nunca é fonte de um dígito exibido nem de uma atribuição causal não verificada.

**Estágio 5 — Persistência.** `pick` referencia `snapshot_id` + `content_hash` + `quant_version` + `prompt_version` + `model_id` + `calibration_version`. Narrativa cacheada por (`content_hash`, `prompt_version`) → regerar não regasta tokens. Reprodutível e auditável por CLV (interno).

**Estágio 6 — UI (Next.js).** Renderiza a tabela sinal-a-sinal COM proveniência ("o porquê"), narrativa por baixo de cada linha, gate +18 (mecanismo, não banner) e jogo responsável. **Número exibido vem sempre do QUANT.**

**Onde cada modelo Claude entra:**
- **Estágios 0–2, 4a, 4c, 5**: 100% determinístico, sem LLM.
- **Estágio 3 (explicador, produção, por jogo)**: **Sonnet 4.6** — prosa PT-BR fiel, segue schema/tool-use, cite-ou-cale. Cavalo de batalha.
- **Microcopy/tooltips/resumo de 1 linha + Sentinel de direção (4b)**: **Haiku 4.5** — barato, rápido, tarefa trivial.
- **Opus 4.8 — SÓ offline, fora do caminho ao vivo**: (i) desenhar/auditar a fórmula do QUANT; (ii) ler reliability diagrams e propor recalibração; (iii) **rodar o "painel agêntico de aprofundamento" do Ângulo 2 em jogos atípicos** (goleiro fora, ressaca de CL, sinais em conflito) para sugerir AO MODELADOR um delta novo a codar — nunca para emitir número em produção. É assim que se aproveita o melhor raciocínio do Claude sem deixá-lo alucinar número ao vivo, e sem quebrar a calibração com discricionariedade no pipeline de produção.

Prompt caching no system prompt + schema do dossiê (estável entre jogos); structured output via tool-use.

---

## 3. Como nasce "cada detalhe" — o mecanismo

"Cada detalhe" é **forçado pela estrutura do schema** (enxerto do Ângulo 3): o `PrognosisObject` tem um campo **obrigatório por sinal canônico**, então o agente é obrigado a se posicionar — ou declarar `sem_evidencia` — em cada eixo. Não há veredito agregado sem a quebra.

**A correção que salva a calibração (mata o killer weakness comum aos 4):** o QUANT **não soma deltas em cima do prior de mercado**. A linha de fechamento já precifica Welbeck fora, escanteios do Villa, fadiga, mando. Somar isso de novo = re-precificar informação pública e chamar de edge. Então:

- `lambda_prior` = lambda implícito da linha O/U de-vigada (âncora). É o ponto de partida E o teto de confiança.
- Cada sinal é classificado em **`ja_no_preco`** (o mercado já viu; contribui 0 ao resíduo, aparece como diagnóstico/contexto) ou **`residual`** (informação plausivelmente ainda não digerida ou mal-precificada, COM uma tese explícita de ineficiência).
- `delta_residual` por sinal só existe para os `residual`. `lambda_final = lambda_prior + Σ delta_residual`, com **shrink ponderado por informação-além-do-mercado** (não por completude do dossiê — dossiê completo de info pública deveria colar MAIS no mercado, como os juízes apontaram).
- **Confiança NÃO é f(|edge|)** (isso estava invertido): gap grande contra linha sharp gera **ceticismo**, não convicção. Confiança = f(calibração realizada do mercado-alvo, ortogonalidade do sinal residual, largura da barra de erro do de-vig).
- **Barra de erro do de-vig**: não reportar resíduo menor que o ruído da conversão (proporcional vs Shin vs power muda o prior 1–3pp). Edge abaixo do chão de ruído → "sem sinal", não "+2.4pp".
- Anti-dupla-contagem entre sinais: bola parada só conta se o xG for **open-play** (não total); pênalti aparece em UM lugar; um mesmo evento causal (ex.: goleiro fora) não pode mover dois sinais.

**Schema de output (`PrognosisObject`):**

```
{
  snapshot_id, content_hash, quant_version, calibration_version,
  mercado: { linha, odds_raw, metodo_devig, p_fair, lambda_prior, devig_error_band },
  sinais: [
    {
      sinal: "xg_combinado" | "bola_parada" | "desfalques" | "arbitro"
           | "calendario" | "estilo_matchup" | "contexto" | "clima",
      classe: "ja_no_preco" | "residual",
      direcao: "over" | "under" | "neutro",
      delta_residual: number,         // 0 se ja_no_preco
      confianca: 0..1,                 // calibrada, do QUANT
      status_evidencia: "forte" | "fraca_proxy" | "sem_evidencia" | "indisponivel",
      refs: [observation_id...],       // proveniência relevante a ESTE sinal
      nota_metodologica: string
    }
  ],
  lambda_final, shrink_peso,
  mercados: { "over_2.5": {p_modelo, p_mercado}, "btts": {...}, placar_modal },
  divergencia_vs_mercado: number,     // INTERNO; barra-de-erro-aware
  confianca_agregada: 0..1,
  flags_legais: { idade_min: 18, sem_garantia: true }
}
```

A narrativa do LLM é um array paralelo `{signal_id, source_ref, narrativa}` costurado por join. O usuário vê quanto cada sinal moveu o número, por quê, e o link da fonte.

---

## 4. Exemplo concreto (números ILUSTRATIVOS)

**JOGO: Brighton x Aston Villa — Premier League. Linha O/U 2.5. Snapshot #a3f9c1 (imutável).**

**TABELA SINAL-A-SINAL (saída do QUANT, determinística):**

| Sinal | Classe | Direção | Δ resíduo (λ) | Conf. | Evidência | Fonte |
|---|---|---|---|---|---|---|
| Mercado (âncora) | — | — | λ_prior = 2.78 | 0.80 | forte | odds#a1 (de-vig power, banda ±0.04) |
| xG combinado | já_no_preço | over | 0.00 | 0.55 | fraca_proxy | obs#xg_home, #xg_away_conc (sem SportMonks → proxy finalizações) |
| Bola parada | residual | over | +0.10 | 0.50 | fraca | obs#corners_villa, #aerial_bri_conc |
| Desfalques | residual | under | −0.12 | 0.70 | forte | obs#sidelined.welbeck (7G+2A), #lineup.joaopedro (gap parcial) |
| Árbitro | já_no_preço | neutro | 0.00 | 0.40 | forte (shrink) | obs#ref (pênalti encolhido p/ média) |
| Calendário | já_no_preço | neutro | 0.00 | 0.60 | forte | obs#fixtures (turnaround 6d, sem CL) |
| Estilo (matchup) | já_no_preço | over | 0.00 | 0.45 | fraca | obs#ppda (já no xGA medido) |
| Contexto | já_no_preço | neutro | 0.00 | 0.65 | forte | obs#table (meio de tabela, sem jogo morto) |
| Clima | já_no_preço | neutro | 0.00 | 0.90 | forte | obs#weather (vento 11 km/h, não extremo) |

```
λ_final = 2.78 + (+0.10 set-piece) + (−0.12 desfalque) = 2.76
shrink (info-além-do-mercado baixa, ambos resíduos fracos/parciais) → λ_final ≈ 2.77
Dixon-Coles(2.77): P(Over 2.5) ≈ 0.534 | P(BTTS) ≈ 0.55 | placar modal 1-1
Divergência vs mercado de-vig (0.514): +2.0pp — DENTRO da banda de erro do de-vig (±1-3pp)
→ classificado como SEM SINAL ACIONÁVEL. Confiança agregada: BAIXA.
```

**NARRATIVA (Sonnet 4.6 — só reescreve, com citação; números vêm por referência):**

> "Esperamos um jogo perto da média da linha (gols esperados ~2.77 contra ~2.78 do mercado). A maior parte dos fatores — estilo das equipes, calendário, árbitro, clima — **já está embutida na linha** e não muda o número. Dois pontos puxam em direções opostas e quase se anulam: o Brighton perde Welbeck (7 gols + 2 assistências), e João Pedro cobre só parte da ausência (puxa levemente para baixo); do outro lado, a Aston Villa cria bem em bola parada contra um Brighton frágil no alto (puxa levemente para cima). O saldo fica **praticamente colado no mercado** — não enxergamos vantagem analítica clara aqui. Análise probabilística, não garantia. +18. Jogue com responsabilidade."

(Validação: lexical OK; direção das frases bate com o struct; cada `source_ref` pertence ao `refs[]` do sinal. Note: **nada de "edge +2.4pp / stake mínimo / CLV positivo"** no texto do usuário — ver §5.)

Repare como a decomposição correta **mata o falso edge**: a versão original deste mesmo jogo nos Ângulos reportava "+2.4pp, lean over, stake mínimo". Aqui, ao decompor o resíduo e respeitar a banda de erro do de-vig, o veredito honesto é **"sem sinal acionável"** — que é o que um tipster bem calibrado diz na maioria dos jogos.

---

## 5. Guard-rails inegociáveis

1. **Separação QUANT/LLM (trava-mãe):** todo λ/delta/probabilidade é TS determinístico; o LLM recebe números por referência e nunca os transcreve. Sem ferramenta de cálculo, sem autoridade numérica.
2. **Cite-ou-cale com relevância:** cada `narrativa` referencia um `source_ref` que pertence ao `refs[]` daquele sinal — proveniência por **relevância**, não por presença.
3. **Validação pós-LLM em 3 camadas:** lexical (dígitos batem) + **semântica de direção** (Haiku confere que a causalidade da prosa bate com `direcao`) + relevância da fonte. Falha → template estático. Fecha o furo "número certo na direção errada" e "sinal qualitativo fabricado sem fonte".
4. **Anti-dupla-contagem estrutural:** decompõe o **resíduo vs. mercado**, não o lambda absoluto; sinal só conta ao edge se `classe=residual` com tese de ineficiência; xG open-play vs total; um evento causal move um só sinal; banda de erro do de-vig como chão de ruído.
5. **Calibração real, não rótulo:** isotônica/Platt sobre ledger de resultados liquidados, gate de ECE por mercado, reliability diagram auditado offline pelo Opus; CLV é a métrica de sucesso **interna**, nunca win-rate.
6. **Snapshot imutável + canonicalização:** `content_hash` sobre forma canônica; pick aponta o hash + todas as versões (quant/calibração/prompt/modelo). "Mesmo input → mesmo resultado" de verdade.
7. **Compliance (Lei 14.790 / Portaria 1.231) — separação interna×usuário:** CLV/edge/EV/stake/Kelly são **ferramentas internas**; **proibidos na superfície do usuário** (framing de renda/investimento é o maior risco legal, e o output dos 4 Ângulos derrapava nele). Gate +18 é **mecanismo de verificação de idade/conta**, não banner; jogo responsável é **mecanismo** (limites, autoexclusão), não só aviso; whitelist **.bet.br**; classificar o produto (tipster/afiliado?) e cumprir as obrigações disso. Referenciar `docs/investigacoes/regulacao-br-apostas-produto.md` (COMP-001).
8. **Proveniência na UI:** cada número com chip de fonte clicável; degradação honesta (`status_evidencia=fraca_proxy/indisponivel`) visível; linguagem de probabilidade, nunca de certeza.

---

## 6. O que dá pra fazer JÁ vs. o que precisa de dado novo

**Realidade do stack (verificada nos vereditos, não otimista):** `packages/core` **não existe**; o schema vivo só tem liga/time/partida/jogador/técnico/escalação/lesão/gol — **sem `observation`, `dossier_snapshot`, `pick` nem `odds`**; DOS-001 é **plano, não implementado**; `worker.ts` está com **deploy PARADO** (Bun.SQL/Postgres não roda no workerd; o banco é Postgres, não D1); `wrangler.jsonc` sem bindings; sem SportMonks. Então a camada de persistência/IA é **greenfield** e a parte "encaixa com baixo atrito" das 4 propostas é exagero.

**Dá pra fazer JÁ (API-Football, rodando como job Bun no servidor que já tem o Postgres — não na edge):**
- Snapshot imutável + content-hash + ledger (engenharia de dados pura).
- QUANT com **desfalques com peso** (G+A até a data, jogos seguidos fora, substituto via escalação) — o sinal de **maior valor incremental** e que a API-Football já cobre.
- Forma, contexto, calendário, mando.
- Explicador Sonnet + validação 3 camadas + UI com proveniência e gate +18.
- Em modo degradado: xG por **proxy** (finalizações) com `status_evidencia=fraca_proxy` e confiança rebaixada; sem odds, o `lambda_prior` cai para estimativa por forma/mando (mais fraca) e o shrink cola no que houver.

**Precisa de dado novo (destravar nesta ordem):**
1. **Feed de ODDS .bet.br** — é o gargalo duplo: âncora do modelo **e** whitelist de compliance. Sem isso, o "prior mais forte" e a métrica de CLV não funcionam. **Item nº1 a destravar.**
2. **SportMonks xG** (add-on EUR29) — a espinha boa do sinal; tira o xG do modo proxy (que é literalmente a armadilha "volume alto + xG baixo = over enganoso"). Distinguir xG open-play vs total.
3. **Migração de DB para edge** (D1/Hyperdrive) — só necessária se quiser servir da edge; até lá, job Bun + tabela `prognosticos` pré-computada resolve.
4. Árbitro / ~80 stats / escalação prevista (add-on EUR199) — incrementais, fase 2.

---

## 7. Plano de evolução em fases

**v0 — QUANT determinístico cru, ZERO LLM (semanas 1–3).** Criar `packages/core` (junto com CORE-001/money), `observation`/`dossier_snapshot`/`pick`/`odds` no schema, snapshot + hash, job Bun de coleta. QUANT decompondo resíduo com os sinais que existem hoje (desfalques, forma, contexto, calendário; xG proxy). UI renderiza a **tabela sinal-a-sinal crua com proveniência** — sem texto de LLM. **Já responde "cada detalhe"** e já é defensável. Validar a fórmula com Opus offline.

**v1 — Explicador LLM + validação (semanas 4–6).** Sonnet 4.6 narrando por referência; Haiku no Sentinel de direção; validação 3 camadas; cache por hash; fallback ao dossiê cru. Linguagem compliant (sem EV/edge ao usuário), gate +18 mecanismo, RG mecanismo.

**v2 — Calibração real + dados ricos + painel offline (semanas 7+).** Ledger de resultados liquidados → isotônica/Platt + gate de ECE; CLV-por-sinal (enxerto do Ângulo 4) para desligar sinais que não pagam. Integrar SportMonks xG (sai do proxy) e odds .bet.br (âncora real + CLV instrumentado, capturando a **linha de fechamento**, não a de abertura). **Painel agêntico do Ângulo 2 com Opus, mas OFFLINE**: em jogos atípicos/sinais em conflito, o Opus aprofunda e sugere ao modelador um delta novo — o pipeline de produção segue determinístico e de feature set FIXO.

---

## 8. Trade-offs honestos e riscos

- **O teto é o QUANT.** Se a decomposição do resíduo ou a calibração estiverem ruins, o LLM só explica bem um número ruim — e pior, explica com a mesma autoridade de um dado SportMonks real. Erro de modelagem vira erro sistemático calibrado com confiança. Mitigação: auditoria Opus offline contínua, gate de ECE, CLV-por-sinal. **Risco residual**: a incerteza epistêmica da fonte (proxy vs xG real) não propaga bem para o tom da narrativa além de um grosseiro "confiança baixa".
- **Decompor resíduo é mais difícil de explicar que somar deltas.** A maioria dos jogos vai dar "sem sinal acionável" — que é honesto, mas levanta a dúvida de produto: um tipster bem calibrado quase sempre diz "sem edge forte". Risco de o dono achar o produto "sem graça". É o preço da honestidade estatística; vender isso como feature ("a gente te diz quando NÃO apostar") em vez de bug.
- **Falsa precisão.** Δλ a duas casas projeta autoridade que um modelo com banda de erro grande não tem. Mitigação: disclosure progressivo (top-line + expandir), e nunca reportar resíduo abaixo do chão de ruído do de-vig.
- **Dependência crítica de duas fontes ainda não destravadas** (odds .bet.br + xG SportMonks). Sem elas, v0/v1 rodam degradados — funcionam, mas com confiança baixa em metade dos sinais. Uma feed faltante decapita modelo E legalidade ao mesmo tempo.
- **Greenfield maior do que as propostas admitem.** Snapshot imutável + content-addressing + ledger + calibração + ingestão de odds + migração de DB é trabalho real de pipeline e de modelagem estatística contínua (recalibração por temporada/liga) — não só engenharia. Não subestimar.
- **Risco de subutilizar o Claude.** O LLM só narra em produção. Aceito conscientemente: o raciocínio do Claude agrega na **modelagem (offline, Opus)**, não no número ao vivo, onde alucinaria. O painel agêntico do Ângulo 2 fica como ferramenta de descoberta de sinais, não de produção — porque os juízes provaram que a discricionariedade agêntica torna o λ não-estacionário e invalida a calibração e a auditoria sob a Lei 14.790.
- **Manutenção da narrativa.** Preenchimento de template pode ficar mecânico entre jogos. Mitigação: variar prompt por perfil de jogo, mas sem deixar o LLM "criar" — a variação é estilística, nunca factual.

**Em uma linha:** pegue a espinha quant-first (auditável, anti-alucinação por construção, barata), conserte o pecado de calibração que os três juízes de calibração mataram nas quatro propostas (**decompor o resíduo vs. mercado, não o lambda absoluto**), feche os furos semânticos com validação de direção/relevância e número-por-referência, separe o que é métrica interna (CLV/edge) do que o usuário vê (probabilidade/análise) por causa da Lei 14.790, e reserve o Opus e o raciocínio agêntico para offline. É o caminho que entrega "cada detalhe" sem virar caixa-preta nem inventar número — e que degrada com honestidade enquanto odds e xG não chegam.

---

## Ranking das arquiteturas (painel de juizes)

1. **quant-first-explainer** — score 20
2. **agentic-tool-calling** — score 18
3. **rag-dossie-structured** — score 17
4. **panel-especialistas** — score 17
