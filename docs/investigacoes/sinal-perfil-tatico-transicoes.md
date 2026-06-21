# Perfil tático — transições, contra-ataque, linhas e zonas (SIN-015)

> Investigação `/rs` da feature [SIN-015](../features/sinais/SIN-015-perfil-tatico-transicoes.md). As-of: **2026-06-21**.
> Método: arqueologia interna + fan-out de 3 frentes web (gate de dado · modelo espacial/fingerprint · contra-ataque como edge) + counter-review adversarial role-locked. Verificação por fetch.
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `consenso` (consenso tático de domínio, qualitativo) · `inferência` (dedução) · `NEI` (não encontrado/insuficiente). Achados internos: `lido-no-código` (Read/search desta sessão, com `path:linha`).
> **Complementa, não duplica**, a refutação-mãe [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md) (matchup de estilo ≠ edge pré-jogo; contra-ataque vs posse = a única exceção causal; 4 momentos; game-state = confound-mestre) e a irmã [sinal-formacao-tatica.md](./sinal-formacao-tatica.md) (SIN-014, formação = EXPLICAR). Obedece [docs/arquitetura/taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md). Não as ressuscita — **parte delas** e entrega o que falta: o modelo espacial cravado, o gate de dado do fingerprint, e o veredito do contra-ataque como tradeable.

---

## TL;DR + recomendação cravada

Perfil tático (transições, contra-ataque, altura de linha, zonas, "a ideia de cada time em cada zona") é, no produto, um sinal da camada **EXPLICAR** — vocabulário didático do "porquê" — e **não** um edge autônomo da camada ESTIMAR. A investigação confirma o mecanismo causal do contra-ataque com **proveniência independente** (Opta: xG/chute de transição **0,17 vs 0,12 open-play vs 0,09 bola parada**, 7,1% dos gols/recorde PL 24-25 [`verificado-fetch`]; paper acadêmico StatsBomb: conversão **13,4% contra-ataque vs 8,8% open-play** [`verificado-fetch`]) — mas **derruba a magnitude folclórica** ("38–60% de conversão" da tese Northwestern é falsa; o delta real é ~1,5×, não ~5×). O ponto novo e mais fino: o **xG público/retail subprecifica** chutes de contra-ataque (modelo multi-evento bate o single-event, ROC-AUC 0,826–0,833 vs 0,775–0,807 [`verificado-fetch`]) — porém **não há mercado de "transição"**, o canal vive embutido em 1X2/over/handicap, e a melhor evidência peer-reviewed de eficiência de mercado diz que **ineficiências pré-jogo não são persistentes nem sistemáticas** (Winkelmann et al. 2024 [`verificado-fetch`]). Logo: o sinal está **na closing line**, ainda que talvez não no xG de varejo. **Veredito Parte B:** EXPLICAR + 3 hipóteses ortogonais para a fila de backtest vs CLV (SIN-012), **nunca afirmadas como edge**; não vira ESTIMAR P2 (ao contrário de [SIN-013](./sinal-escanteios.md), escanteios, que tem ineficiência direcional documentada). **Gate de dado (a restrição que limita a ambição):** o fingerprint **completo é inviável a custo acessível**. Via SportMonks (espinha do [DOS-001](./dossie-por-partida-fontes-de-dados.md)) confirma-se só um fingerprint **básico** para o Brasileirão (% posse, attacks, passes+precisão, tackles/interceptações, xG agregado add-on, Pressure Index add-on); **PPDA/xT estão no catálogo mas a entrega para o Brasileirão é não-verificada** (validar com pull real, não confiar no glossário de marketing); **altura de linha defensiva, field tilt e xG-por-transição exigem tracking enterprise — fora**; e o fallback FBref **morreu** (Opta cortou os stats avançados em jan/2026). **Modelo espacial cravado:** 5 corredores (com halfspaces) × 3 terços = **15 zonas para narrativa**, sobre a grade de provider **6×3=18 para dado**; as 20 zonas do Juego de Posición (com regras de ocupação) precisam de tracking → vocabulário aspiracional, não schema. **Prioridade P3** (polimento de EXPLICAR, sem caso ESTIMAR).

---

## Contexto e problema

**Brief (recorte acordado com o dono nesta sessão):** investigação **dupla em sequência** — Parte A (enriquecer o EXPLICAR: vocabulário + perfil tático por zona/momento) e Parte B (caçar edge no contra-ataque/transição vs linha alta) — cobrindo **tanto framework genérico quanto fingerprint por clube**, registrada como **nova feature SIN-015**. Estrutura: Parte 0 (modelo espacial + 4 momentos + definição operacional de transição/contra-ataque vs ataque posicional); Parte A1 (genérico: zona×momento, mecanismos e arquétipos) + A2 (fingerprint por clube); Parte B1 (mecanismo) + B2 (mercado-alvo + CLV + anti-dupla-contagem). Restrição transversal: **gate de viabilidade de dados** — a Parte B só promete edge se o dado existir.

**Requisitos implícitos do repo** que disciplinam a resposta: as 3 camadas ESTIMAR/EXPLICAR/VALIDAR ([taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) §1); o **anti-dupla-contagem** (o risco nº1 — muito do tático já está no xG/preço); "todo pick mostra o porquê + fontes" (visão §5); separação quant/LLM; PL + Brasileirão; odds/dinheiro em centavos; fuso `America/Sao_Paulo`. **LGPD não é trava** aqui (dado de jogo, não estado emocional de indivíduo — distinto do veto do [SIN-003](../arquitetura/taxonomia-sinais.md)). **Regra de altitude:** não re-derivar a refutação-mãe nem a irmã SIN-014.

---

## Estado real no código + decisões herdadas

- **Greenfield** — não há coletor, schema, motor nem qualquer ingestão de stat tático (`lido-no-código`; confirmado em [dossie-por-partida-fontes-de-dados.md:22-29](./dossie-por-partida-fontes-de-dados.md) e [predicao-futebol-ia-ml-estado-da-arte.md:36-41](./predicao-futebol-ia-ml-estado-da-arte.md): o repo é o scaffold Turborepo+Next.js, a pipeline `visao §6` é fantasma). Feature **SIN-015** criada nesta sessão (`docs/features/sinais/SIN-015-perfil-tatico-transicoes.md`), `depende_de: [DOS-001, MOD-001]`.
- **Não há tabela nova a confirmar** — o sinal estende a camada `observation` proposta no DOS-001 (`observation(match_id, dimension, metric, value_jsonb, source, observed_at, ingested_at)`, [dossie-por-partida-fontes-de-dados.md:131](./dossie-por-partida-fontes-de-dados.md)), exatamente como a formação faz em [sinal-formacao-tatica.md:185-192](./sinal-formacao-tatica.md). Sem schema indexado → sem `codebase_context_search` aplicável.
- **Decisões já cravadas que esta investigação obedece (não re-decide):**
  - Tática = EXPLICAR por padrão; contra-ataque vs posse = a **única** exceção causal robusta (mecanismo: linha alta + velocidade nas costas) [leitura-de-jogo-profundidade-dominio.md:49,184](./leitura-de-jogo-profundidade-dominio.md).
  - Os **4 momentos** (org. ofensiva / transição defensiva / org. defensiva / transição ofensiva) como espinha de leitura [leitura-de-jogo-profundidade-dominio.md:37](./leitura-de-jogo-profundidade-dominio.md).
  - **Game-state é o confound-mestre**: posse/chutes/xG brutos são contaminados pelo placar [leitura-de-jogo-profundidade-dominio.md:51](./leitura-de-jogo-profundidade-dominio.md); [sinal-formacao-tatica.md:155-156](./sinal-formacao-tatica.md).
  - SportMonks = espinha de dados; **FBref perdeu xG da Opta em jan/2026**; Understat não cobre Brasileirão; StatsBomb open data proíbe uso comercial [dossie-por-partida-fontes-de-dados.md:45-50,166](./dossie-por-partida-fontes-de-dados.md).
- **Relação com features vizinhas:** SIN-015 **alimenta** o agente EXPLICAR (AGT-001, [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md)) com vocabulário tático; é **irmã** de SIN-014 (formação) e cruza com SIN-013 (escanteios, mercado de transição-proxy) e SIN-010 (motivação/game-state). Não importa de nenhuma — é dado+regra própria.

---

## Parte 0 — modelo espacial + 4 momentos + definição operacional

### 0.1 Modelo espacial cravado

| Taxonomia | Granularidade | Prós | Contras | Mapeável em dado? |
|---|---|---|---|---|
| **Terços** (def/meio/ataque) | 3 faixas horizontais | universal, legível por leigo, casa com "saída→construção→criação" | grosseiro p/ "ideia por zona"; ignora largura | trivial (qualquer x) `verificado-fetch` |
| **Corredores + halfspaces** (5 verticais: 2 flancos, 2 meias-luas, 1 central) | 5 faixas verticais | captura o **halfspace** (canal entre lateral e zagueiro — onde se recebe entre linhas e ataca em diagonal); núcleo do discurso moderno | sem profundidade sozinho; halfspace não é coordenada nativa (deriva de bins de y) | sim, por binning `verificado-fetch` |
| **Juego de Posición (~20 zonas)** | 5 corredores × 4 linhas | máxima precisão; codifica regras de ocupação (máx 3/horizontal, 2/vertical) | complexo p/ UI; **regras exigem tracking** (posição de todos) | parcial — a grade sim, as regras **não** (tracking) `verificado-fetch` |
| **Bins de provider Opta/StatsBomb** | 6×3 = 18 zonas | é o **dado bruto disponível**; coords padronizadas | bins geométricos sem semântica tática | nativo `verificado-fetch` |

**Decisão [cravado]:** **5 corredores (com halfspaces) × 3 terços = 15 zonas como camada de NARRATIVA**, sustentada pelos **bins de provider 6×3 = 18 zonas como camada de DADO**. É o ponto ótimo: tem os halfspaces (o que dá vida ao "a ideia do time nessa zona") sem o custo de tracking das 20 zonas puras do JdP. Os 5 corredores são o padrão de indústria para narrativa; o grid 6×3 é o padrão de provider (Opta/StatsBomb/WhoScored/Sofascore, coords 0–100/0–120) para agregar eventos. As regras de ocupação do JdP ficam como **vocabulário aspiracional**, não schema (precisam de tracking que não teremos). [`verificado-fetch`: TheAnalyst, StatsBomb, Coaches' Voice; `snippet`: Coaching Manual/ResearchGate]

### 0.2 Os 4 momentos (reuso, não re-decido)

Org. ofensiva (com bola) · transição ofensiva (acabou de recuperar) · org. defensiva (sem bola) · transição defensiva (acabou de perder). É onde a forma "muda de cara" — ~22% do tempo o jogo é desestruturado/transição [sinal-formacao-tatica.md:131](./sinal-formacao-tatica.md).

### 0.3 Definição operacional (o que evita a conversa de boteco)

- **Ataque posicional (build-up)** = sequência longa (Opta: **10+ passes** culminando em chute/toque na área), velocidade de progressão baixa.
- **Contra-ataque / transição ofensiva (direct attack)** = sequência iniciada por recuperação, com ≥50% do movimento em direção ao gol e alta velocidade (Opta "direct speed" em m/s). **High turnover** = recuperação em open-play a **<40m** do gol adversário. [`verificado-fetch`, TheAnalyst playing styles]
- **Linha alta** = defesa longe do próprio gol (PL ~51m vs média ~44,2m), troca compactação por espaço nas costas [sinal-formacao-tatica.md:150](./sinal-formacao-tatica.md). **Mensuração direta exige tracking** (ver gate de dado).

---

## Parte A — EXPLICAR (genérico + fingerprint)

### A1 — genérico: arquétipos zona×momento (camada narrativa, `consenso`)

> Andaime explicativo, **não** tabela de apostas. Gera hipóteses; por si só não é edge (a próxima seção e o gate de dado mostram por quê). Especializa a tabela de arquétipos da refutação-mãe [leitura-de-jogo-profundidade-dominio.md:96-106](./leitura-de-jogo-profundidade-dominio.md).

| Matchup (momento × zona) | Mecanismo a foregroundar | Sinal mrtip |
|---|---|---|
| **Favorito de posse vs bloco baixo** (org. ofensiva, terço ofensivo) | posse sem **penetração** ≠ domínio; criar chance central vs cruzar (cruzamento converte ~1,6% [sinal-formacao-tatica.md:145](./sinal-formacao-tatica.md)) | SIN-014 |
| **Azarão que contra-ataca vs linha alta** (transição ofensiva, costas da defesa) | linha alta + velocidade nas costas; xG/chute 0,17 > 0,12 — **o único matchup causal robusto** | **SIN-015 (B)** |
| **Pressing alto vs saída curta** (transição defensiva / org. ofensiva adversária, terço defensivo) | bola nas costas do pressing; PPDA baixo = agressivo, mas mede intensidade ≠ qualidade | SIN-015 |
| **Espaço entre linhas** (org. ofensiva, halfspace/meio) | quem domina a faixa entre defesa e meio cria; quem cede, sofre | SIN-014/015 |
| **Bola parada / jogo aéreo** (zona da área) | dimensão mais repetível; ~30% dos gols PL 25-26; depende de pessoal > formação | SIN-013/014 |
| **Fim de jogo / trailing** (game-state) | linhas se esticam → mais gols **e** mais vulnerabilidade ao contra; 2º tempo ~56,7% dos gols | SIN-010 |

### A2 — fingerprint por clube: eixos por momento (e o que é mensurável)

Como as firmas constroem o perfil: **Opta** clusteriza times sobre métricas de sequência (direct speed, passes per sequence, build-up vs direct attacks); **StatsBomb** usa vetor de ~32 tipos de evento + radares de percentil [`verificado-fetch`]. Eixos concretos, com a coluna que decide tudo — **é mensurável barato?**

| Momento | Eixo do fingerprint | Mensurável a custo acessível (Brasileirão)? |
|---|---|---|
| **Org. ofensiva** | % posse | **Sim** (SportMonks `type_id 45`) `verificado-fetch` |
| | build-up curto×direto / passes por sequência / verticalidade | **Não** confirmado (glossário, não type_id; ausente da lista BR) `verificado-fetch` |
| | largura×profundidade (uso de flancos vs centro) | **Não** (sem shots/passes-by-zone na lista BR) `verificado-fetch` |
| | distribuição do goleiro (curto×longo) | parcial (passes/goal kicks agregados, sem split) `verificado-fetch` |
| **Transição ofensiva** | contagem de contra-ataques | **provável** (SportMonks `type_id 1527 COUNTER_ATTACKS`) — **mas não confirmado na página BR; validar** `verificado-fetch` |
| | attacks / dangerous attacks | **provável** (`type_id 44`) — idem, validar `verificado-fetch` |
| | xG/chutes de transição (split) | **Não** (xG só agregado) `verificado-fetch` |
| **Org. defensiva** | bloco alto×baixo / altura da linha | **Não** — exige **tracking** enterprise `NEI` |
| | tackles / interceptações / duels | **Sim** (na lista BR) `verificado-fetch` |
| | Pressure Index | **Sim** (add-on €9–29; **não é PPDA**) `verificado-fetch` |
| **Transição defensiva** | PPDA (pressing/contrapressing) | catálogo lista, **entrega BR não-verificada**; FBref (insumo) **morto** → validar/ derivar com cautela `verificado-fetch` |
| | field tilt (% passes terço final) | **Não** como campo (glossário); derivável só com event-level rico `verificado-fetch` |

**Conclusão A2:** dá pra entregar um fingerprint **básico e honesto** por clube (perfil de posse + um sinal grosso de transição + intensidade defensiva via Pressure Index), cobrindo Brasileirão **e** PL igualmente. O fingerprint **rico** (verticalidade, build-up, altura de linha, xT, zonas) é o que diferenciaria de verdade — e é justamente o que **não** está barato. A narrativa por zona (A1) é viável como **vocabulário**; a narrativa **ancorada em número por clube** fica limitada ao que o básico mede.

---

## Estado da arte / evidência — contra-ataque (Parte B1, claims atômicos)

- **xG/chute de transição ≈ 0,17 vs 0,12 open-play vs 0,09 bola parada (PL 24-25)** → **SUPPORTED** [`verificado-fetch`, theanalyst.com/.../premier-league-counter-attacks-verticality-transitions, Opta]. As-of 24-25.
- **Contra-ataque = 7,1% dos gols (recorde), 10,2% dos chutes; trajetória 1,4%→3,7%→7,1%** → **SUPPORTED** [`verificado-fetch`, Opta + corroboração premierleague.com].
- **Conversão 13,4% contra-ataque vs 8,8% open-play** → **SUPPORTED**, proveniência **independente** da Opta [`verificado-fetch`, PMC11524524, dados StatsBomb].
- **"Fast-attack from deep" converte ~10,7% (acima da média)** → **SUPPORTED**, 3ª proveniência [`verificado-fetch`, StatsBomb blog].
- **Tese Northwestern "38–60% conversão de fast-break vs 7–14% open-play"** → **REFUTED na magnitude** [`inferência` sobre 3 fontes primárias]. A direção e a ordem de grandeza relativa (~1,5×) confirmam-se; os **números absolutos não** — o delta real é ~13% vs ~9%, não ~50% vs ~10%. Provável denominador diferente (fast-break "limpo/isolado").

## Mercado e eficiência — contra-ataque como tradeable (Parte B2)

- **Não existe mercado de aposta "contra-ataque"/"transição"** → **SUPPORTED** [`verificado-fetch`, guias de mercados]. O canal só vive embutido em 1X2, over/under, handicap asiático e props de chute/SOT.
- **xG público/retail SUBprecifica chutes de contra-ataque** → **SUPPORTED** (contra a presunção do projeto, **no nível do xG retail**) [`verificado-fetch`, PMC11524524]: modelo multi-evento (com contexto pré-chute) ROC-AUC **0,826–0,833** vs single-event 0,775–0,807; Brier 0,166. Os autores chamam de "questionável" ignorar a sequência pré-chute; StatsBomb "upgradeou" o xG por isto.
- **Closing line é quase-eficiente** → **SUPPORTED** [`snippet` Buchdahl r²≈0,997 via football-data; **`verificado-fetch`** Wilkens 2026]. **Não há evidência de que a closing line erre em fast-break** — só de que o xG ingênuo erra.
- **Ineficiências pré-jogo NÃO são persistentes nem sistemáticas entre ligas** → **SUPPORTED**, peer-reviewed [`verificado-fetch`, Winkelmann, Ötting, Deutscher & Makarewicz 2024, *Journal of Sports Economics*, 14 temporadas]: a frequência de "ineficiências" mal supera o acaso; anomalias são consistentes com variação amostral. **Mata o pitch "contra-ataque vira ESTIMAR P2".**
- **xG bate o mercado ~10–15% ROI mas só em mandante, sem decompor contexto de chute** → **SUPPORTED** [`verificado-fetch`, Wilkens 2026, SAGE]: prova que sobra sinal **em xG agregado**, não que o sinal seja contra-ataque; CLV é "upper bound", não realizável.
- **Times de bloco-baixo/contra são sistematicamente mal precificados** → **NEI** [conf. média]. Existe favorite-longshot bias documentado (favorito subvalorizado), mas **nenhuma fonte o conecta a estilo de contra-ataque com dados**; a única afirmação disso era tipster sem dados (descartado pela escada).

**Veredito Parte B:** contra-ataque é mecanismo **causalmente real e sub-precificado no xG de varejo**, mas **sem evidência de edge negociável contra a closing line**. Fica **EXPLICAR**, com 3 hipóteses ortogonais para a fila de backtest (jamais afirmadas como edge):
1. **Gap xG-retail vs book** em jogos com alta share de fast-break — testar se um xG "context-aware" gera CLV que o single-event não gera (a única ponta com prova acadêmica de gap; cruza com MOD-001).
2. **Props de chutes/SOT de times de transição** (Forest/Liverpool/Bournemouth-type) em mercados de movimento lento.
3. **Interação favorite-longshot × estilo** (azarão-contra popular) — bias documentado, interação nunca testada; backtest barato.

---

## Opções e recomendação — onde o perfil tático entra nas 3 camadas

| Camada | Entra? | Como | Gate |
|---|---|---|---|
| **DOS-001 (ingestão)** | **Sim, parcial** | ingerir o que é barato: posse, contra-ataques (`1527`, validar), attacks (`44`, validar), tackles/interceptações, Pressure Index (add-on), xG agregado (add-on) como `observation` com proveniência | cobertura BR a validar com pull real |
| **MOD-001 (ESTIMAR)** | **Como feature do modelo, não sinal autônomo** | os stats de estilo/transição compõem o xG/forma do jogo; a hipótese 1 (xG context-aware) é refinamento do MODELO | só "pesa" se passar backtest vs CLV |
| **EXPLICAR (LLM) — destino principal** | **Sim** | narrar perfil por zona×momento, contra-ataque vs linha alta, gaps; **tag EXPLICATIVO-NÃO-PREDITIVO**, ancorado no número, sem movê-lo | gate de 3 perguntas (refutação-mãe §5) |
| **VALIDAR (SIN-012)** | árbitro | decide se alguma hipótese ortogonal vira EV+ | CLV |

**Recomendação cravada (sobreviveu ao counter-review):**
1. **SIN-015 é EXPLICAR por padrão, P3.** O peer-review de eficiência de mercado bate de frente com qualquer tentativa de torná-lo ESTIMAR autônomo. É o melhor vocabulário do produto para "a ideia de cada time em cada zona" — marcado como não-preditivo.
2. **Modelo espacial 5×3 (narrativa) sobre 6×3=18 (dado)** — cravado em 0.1.
3. **Fingerprint básico viável; rico inviável barato** — entregar o honesto (perfil de posse + transição grossa + Pressure Index), com caveat explícito do que **não** se mede (altura de linha, xT, zonas, build-up).
4. **Contra-ataque = mecanismo causal real, presumido na closing line** — EXPLICAR + 3 hipóteses ortogonais para a fila de backtest; **não** sobe a ESTIMAR (distinto de SIN-013, que tem ineficiência direcional documentada na PL).
5. **Honrar os caveats:** game-state como confound antes de qualquer "estilo"; magnitude do contra-ataque é ~1,5×, não ~5×; glossário de marketing ≠ type_id entregável.

---

## Modelo de dados proposto

Sem tabela nova — estende a camada `observation` do DOS-001 (igual à formação em SIN-014):

```
observation(match_id, dimension='tactical_profile', team_id,
            metric ∈ { possession_pct, counter_attacks, dangerous_attacks,
                       tackles, interceptions, pressure_index, xg_total },
            value_jsonb, source, observed_at, ingested_at)   ← append-only, com proveniência
```

- O bloco **quant** do `dossier_snapshot` deriva features de estilo pro MOD-001; o bloco **narrativo** guarda o perfil por zona×momento pro EXPLICAR. (Continua resolvendo a pergunta aberta da taxonomia sobre separar quant×narrativo no `content_jsonb`.)
- Métricas só-tracking (altura de linha, xT, zonas) **não entram** no schema enquanto não houver fonte — não criar coluna fantasma.

---

## Plano por faceta (dados → ia → api → ui)

- **dados:** **spike de validação primeiro** — pull real de fixtures do Brasileirão na SportMonks confirmando se `1527 COUNTER_ATTACKS`, `44`, e (se houver) PPDA/xT vêm populados e em que profundidade histórica. Só então conector → `observation` com proveniência. FBref **fora** (sem dado avançado desde jan/2026).
- **ia (EXPLICAR):** vocabulário zona×momento + arquétipos (A1) como contexto transparente; tag EXPLICATIVO-NÃO-PREDITIVO; passar pelo gate de 3 perguntas (causal? independente? já no preço?). **ia (ESTIMAR):** só a hipótese 1 (xG context-aware) como refinamento do MOD-001, com peso condicionado a CLV.
- **api:** servir o perfil dentro do dossiê (gate +18).
- **ui:** renderizar perfil por zona/momento como contexto com proveniência — **nunca** como "dica de aposta por estilo"; mostrar o que **não** se mede (honestidade > falsa completude).

---

## Riscos e gotchas

1. **Dupla-contagem (risco nº1):** narrar "time X contra-ataca → over/azarão cobre" quando o xG/mercado já embute isso é contar 2×. `severity: high`
2. **Glossário ≠ entregável:** PPDA/xT/field tilt/build-up aparecem no marketing da SportMonks mas **não** como type_id na lista do Brasileirão — prometer fingerprint rico sem validar é furo. `severity: high`
3. **Altura de linha defensiva exige tracking** — o mecanismo "linha alta + costas" **não é mensurável direto** barato; só proxy grosso (contagem de contra-ataque + Pressure Index). `severity: high`
4. **FBref morto como fallback** (Opta cortou stats avançados jan/2026) — remove o colchão que parecia existir; reforça lock-in na SportMonks. `severity: medium`
5. **Cobertura/profundidade BR não-verificada:** type_ids de transição podem vir esparsas/nulas no Brasileirão; avançado só em "recent seasons" → backtest histórico raso. `severity: medium`
6. **Game-state contamina** posse/chutes/xG brutos — ler sempre condicionado ao placar. `severity: medium`
7. **Magnitude inflada:** repetir "38–60% de conversão" é repassar folclore; o real é ~1,5×. `severity: low`

---

## Refutado (com a evidência que matou)

- **"Contra-ataque/transição é edge negociável (vira ESTIMAR P2)"** → REFUTADO: ineficiências pré-jogo não persistentes/sistemáticas (peer-review, 14 temporadas) [`verificado-fetch`, Winkelmann et al. 2024]; sem mercado de transição; closing line quase-eficiente.
- **"Conversão de contra-ataque é 38–60% (Northwestern)"** → REFUTADO na magnitude: 3 fontes primárias (Opta 0,17 xG/chute; StatsBomb 10,7%; paper 13,4% vs 8,8%) dão ~1,5×, não ~5×.
- **"FBref deriva PPDA/field tilt como fallback barato p/ Brasileirão"** → REFUTADO: Opta cortou os stats avançados do FBref em jan/2026; sobrou dado básico [`verificado-fetch`, theixsports.com + sportseconomics.org; consistente com DOS-001].
- **"PPDA/xT/altura de linha são inviáveis barato (só enterprise)"** → REFUTADO parcialmente: PPDA/xT estão no **catálogo** SportMonks (planos Growth/Pro cobrem Brasileirão) — mas a **entrega para o Brasileirão é não-verificada**; altura de linha **segue** tracking-only. Não é "impossível", é "não-confirmado — validar".
- **"As 20 zonas do Juego de Posición são o schema de dado"** → REFUTADO: as regras de ocupação (3/horizontal, 2/vertical) exigem tracking; servem como vocabulário, não schema [`verificado-fetch`, Coaches' Voice].

## Perguntas Abertas / lacunas

- **Entrega real de `1527`/`44`/PPDA/xT no Brasileirão na SportMonks** (`NEI`) — a página da liga não os cita; resolver com **pull real de fixtures** antes de prometer o fingerprint. Mesmo padrão do DOS-001 (validar xG/escalação BR em trial).
- **Profundidade histórica** dos stats avançados no Brasileirão (`NEI`) — "recent seasons only" limita backtest; cutoff exato a testar.
- **CLV do gap xG-retail vs book** em jogos de alta transição (`NEI`) — a hipótese 1 só se confirma medindo; depende da fonte de odds BR ainda em aberto (DOS-001/SIN-012).
- **Favorite-longshot × estilo de contra-ataque** (`NEI`) — bias existe, interação nunca testada.
- **pt-BR forte é escasso** para empíricos de transição/estilo — predominou fonte EN (PL); calibrar antes de transportar magnitude pro Brasileirão.

---

## Evidências decisivas

- [Opta] https://theanalyst.com/articles/premier-league-counter-attacks-verticality-transitions-guardiola-iraola — xG/chute de transição 0,17/0,12/0,09; contra-ataque 7,1% dos gols (recorde); times mais dependentes; métricas de playing style (direct speed, passes per sequence, high turnovers <40m).
- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC11524524/ — conversão 13,4% contra-ataque vs 8,8% open-play (proveniência independente); xG context-aware (multi-evento) bate single-event → **xG retail subprecifica fast-break**.
- [paper] https://journals.sagepub.com/doi/10.1177/15270025231204997 — Winkelmann et al. 2024: ineficiências pré-jogo não persistentes/sistemáticas → **mata o pitch ESTIMAR**.
- [paper] https://journals.sagepub.com/doi/10.1177/22150218261416681 — Wilkens 2026: xG bate mercado ~10–15% ROI só em mandante, sem decompor shot-context; CLV = upper bound.
- [StatsBomb] https://blogarchive.statsbomb.com/articles/soccer/on-the-anatomy-of-a-counter-attack/ — fast-attack from deep converte 10,7% (3ª proveniência).
- [Opta] https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 — eixos de fingerprint Opta (direct speed, build-up vs direct attacks, start distance, high turnovers).
- [StatsBomb] https://blogarchive.statsbomb.com/articles/soccer/modelling-team-playing-style/ — modelo de 32 tipos de evento + radares de percentil.
- [Coaches' Voice] https://learning.coachesvoice.com/cv/positional-play-football-tactics-explained-guardiola-cruyff-manchester-city/ — Juego de Posición: regras de ocupação (precisam de tracking).
- [SportMonks] https://www.sportmonks.com/football-api/serie-a-api-brazil/ — cobertura real do Brasileirão (básicos + xG/Pressure add-on; **sem** PPDA/xT/counter na lista; avançado só "recent seasons").
- [SportMonks] https://docs.sportmonks.com/v3/definitions/types/statistics — type_ids reais (`45` posse, `1527` counter-attacks); PPDA/xT ausentes da referência de tipos.
- [SportMonks] https://www.sportmonks.com/glossary/key-data-points/ — PPDA/xT/field tilt/build-up são termos de **glossário/marketing** (gotcha: ≠ type_id entregável).
- [web] https://www.theixsports.com/the-ix-soccer/fbrefs-loss-advanced-stats-womens-soccer-data-accessibility/ + http://www.sportseconomics.org/sports-economics/fbref-com-data-removal — FBref perdeu stats avançados da Opta (jan/2026).
- [doc interno] [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md) — refutação-mãe (tática=EXPLICAR; contra-ataque=exceção causal; 4 momentos; game-state).
- [doc interno] [sinal-formacao-tatica.md](./sinal-formacao-tatica.md) — irmã (formação=EXPLICAR; altura de linha/PPDA/contra-ataque já tangenciados; `observation` de tática).
- [doc interno] [dossie-por-partida-fontes-de-dados.md](./dossie-por-partida-fontes-de-dados.md) — SportMonks=espinha; FBref perdeu xG; modelo `observation`.
- [doc interno] [taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) — 3 camadas + anti-dupla-contagem.
