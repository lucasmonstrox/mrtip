# Formação tática como sinal — matriz de formações + cruzamentos (SIN-014)

> Investigação `/rs` da feature [SIN-014](../features/sinais/SIN-014-formacao-tatica.md). As-of: **2026-06-21**.
> Método: arqueologia interna + fan-out de 3 frentes web (literatura de formação · viabilidade de dado · âncoras empíricas de tempo/aéreo/linhas) + counter-review adversarial. Verificação por fetch.
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca) · `consenso` (consenso tático de domínio, qualitativo, sem fetch) · `inferência` (dedução) · `NEI` (não encontrado).
> **Complementa, não duplica**, a refutação-mãe [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md) (matchup de estilo ≠ edge pré-jogo) e obedece [docs/arquitetura/taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md). Esta investigação **especializa** aquela refutação para o caso "formação" e entrega a matriz tática didática.

---

## TL;DR + recomendação cravada

**Formação (4-4-2, 4-3-3, 3-5-2, etc.) é, no produto, um sinal da camada EXPLICAR — contexto narrativo do "porquê" — e NÃO um edge autônomo da camada ESTIMAR.** A evidência nova de 2026 (Double Machine Learning, ~22k jogos, `verificado-fetch` preprint) atualiza a refutação-mãe num ponto: a formação **tem** efeito causal sobre gols, só que **pequeno** (~0,11–0,18 gol por matchup) e heterogêneo, e "estacionar o ônibus" defensivo **não** aumenta a chance de vitória. Esse efeito é **material para o modelo** (0,15 gol desloca o over 2.5 em ~4–6 p.p.), o que obriga o quant (MOD-001) a **ingerir** formação/escalação como feature — mas **materialidade não é edge**: a formação é anunciada ~1h antes e o modelo da casa já a incorpora, então por padrão ela está **precificada** (presunção forte da taxonomia, não fato provado — ver counter-review). Some-se a isso que **formação declarada ≠ forma real** (só ~30% de concordância entre provedores; muda com/sem bola, por placar e por mando), o que torna o rótulo nominal um proxy grosseiro. **Veredito:** o assistente usa formação para **explicar** o jogo (gaps por zona, jogo aéreo, espaço entre linhas, bola parada, mudanças por tempo), sempre ancorado no número do quant/mercado que ele **nunca move**; e ficam **três hipóteses ortogonais** para a fila de backtest vs closing line (SIN-012), nunca afirmadas como edge: (a) mercados menos eficientes (escanteios/cartões); (b) formação-surpresa vs prevista no timing pré-anúncio; (c) o ruído declarada≠real que a casa não desconta. **Viabilidade de dado: ✓** — SportMonks entrega o campo `formation` (nominal + grid por jogador) na escalação confirmada e prevista, com Brasileirão coberto.

---

## Contexto e problema

**Brief (do pedido do dono):** investigar TUDO que é possível saber sobre formações — ponto forte/fraco de cada uma, contra qual é boa/ruim (matriz de confrontos), onde ficam os gaps por zona, viés ofensivo vs defensivo — cruzando com fase/tempo de jogo, jogo aéreo, jogo nas linhas (espaço entre linhas, altura da linha, pressing) e bola parada. O dono declarou não ser bom de futebol → a investigação precisa ser **didática e exaustiva**, fazendo surgir o que ele não saberia perguntar.

**Requisitos implícitos do repo** que disciplinam a resposta: as 3 camadas ESTIMAR/EXPLICAR/VALIDAR (taxonomia-sinais §1); o princípio **anti-dupla-contagem** (taxonomia-sinais §12 — o risco nº1); "todo pick mostra o porquê + fontes" (visão §5); separação quant/LLM; PL + Brasileirão; e a regra de altitude: não re-decidir o que `docs/arquitetura/` cravou. A refutação-mãe já fixou que **matchup de estilo/tática não adiciona edge pré-jogo além do mercado** — esta investigação não a ressuscita; especializa-a para formação com evidência nova.

---

## Estado real no código + decisões cravadas

- **Greenfield** — não existia nenhum sinal tático/de formação na taxonomia (SIN-001..013 cobrem árbitro, lesão, clima, rivalidade, fadiga, motivação, mercado, escanteios — nenhum de formação; confirmado em `docs/features/INDEX.md` e `taxonomia-sinais.md`, `lido-no-código`). Feature **SIN-014** criada nesta sessão (`docs/features/sinais/SIN-014-formacao-tatica.md`), `depende_de: DOS-001`.
- **Viabilidade de dado confirmada** (frente 2, `verificado-fetch`): a SportMonks (espinha dorsal já decidida no [DOS-001](./dossie-por-partida-fontes-de-dados.md)) expõe formação:
  - Campo `formation` = string nominal ("4-4-2") via `include=formations` em qualquer Fixture [docs.sportmonks.com/v3/.../lineups-and-formations, `verificado-fetch`].
  - Campo `formation_field` = posição em grid `linha:coluna` por jogador (linha 1 = goleiro) → permite **inferir a forma real**, não só o rótulo [docs.sportmonks.com/v3/.../includes/lineups, `verificado-fetch`].
  - Vem na escalação **confirmada** (pós-jogo) e na **prevista** (addon Expected Lineups; o predicted gratuito também traz formação histórica) [docs.sportmonks.com/v3/.../premium-expected-lineups, `verificado-fetch`].
  - Cobertura Brasileirão ~2010+ com lineups [sportmonks.com/football-api/brasileirao-api, `verificado-fetch`]; **cutoff exato de quando a formação começou a ser coletada = NEI** (testar fixture de 2010 vs 2015).
  - Fallback API-Football: campo `formation` + `player.grid` confirmado [api-football.com/documentation-v3, `snippet` — RapidAPI deu 403].
- **Conclusão de dado:** ingerir formação é **construção nova barata** sobre o DOS-001 (entra como `observation` com proveniência), sem tabela nova e sem bloqueio técnico.

---

## A matriz tática didática (camada EXPLICAR — consenso de domínio)

> Tudo nesta seção é **`consenso`** tático qualitativo (conhecimento de domínio, não fetch) — serve para o assistente **explicar**, é gerador de hipóteses, e por si só **não é edge**. Os números verificados estão na seção seguinte.

### Vocabulário mínimo (pra quem não é de futebol)

- **Formação** = arranjo dos 10 jogadores de linha em setores, lido de trás pra frente: `4-4-2` = 4 defensores, 4 meio-campistas, 2 atacantes. O goleiro não entra na conta.
- **Setores/linhas:** defesa, meio-campo, ataque. **Largura** = ocupar os corredores laterais; **profundidade** = ter gente perto do gol adversário.
- **Espaço entre linhas:** a faixa entre a defesa e o meio do adversário — onde um "camisa 10" recebe de frente pro gol. Quem domina esse espaço cria; quem o cede, sofre.
- **Altura da linha defensiva:** quão longe do próprio gol a defesa joga. **Linha alta** comprime o jogo e pressiona, mas deixa **espaço nas costas**; **bloco baixo** protege as costas, mas cede campo e posse.
- **Superioridade numérica no meio:** ter 3 contra 2 no meio-campo costuma decidir o controle do jogo.
- **Transição:** o instante em que a bola troca de dono — ataque→defesa e defesa→ataque. É onde mais se ganha e se sofre gol.
- **Os 4 momentos:** organização ofensiva (com bola), organização defensiva (sem bola), transição ofensiva, transição defensiva. **A formação muda de cara em cada um** (ver "declarada vs real").

### Formação por formação

**4-4-2 (clássico, 2 linhas de 4 + 2 atacantes)**
- **Forte:** simples e compacto; as duas linhas de 4 formam um bloco difícil de furar; 2 atacantes pressionam a dupla de zaga e dão 2 alvos na área (bom no jogo direto e aéreo); largura natural pelos meias de lado.
- **Fraco:** só 2 no meio → perde o controle contra meios de 3; pouca presença **entre linhas** (não tem o "10"); os 2 volantes ficam expostos em transição.
- **Bom contra:** 3-5-2 e times de 1 atacante (os 2 atacantes ocupam os 3 zagueiros; o bloco fecha o meio). Bom contra quem só sabe jogar pelo centro.
- **Ruim contra:** 4-3-3 e 4-2-3-1 — perde o meio 3v2 e cede o espaço entre linhas pro "10".
- **Gap por zona:** miolo do meio-campo + a faixa entre meio e defesa.
- **Viés:** equilibrado, tendendo a reativo/direto na versão moderna.

**4-4-2 em losango (diamante)**
- **Forte:** resolve o 3v2 central (4 no meio em losango: 1 volante, 2 interiores, 1 meia ofensivo); o "10" joga entre linhas; mantém os 2 atacantes.
- **Fraco:** **sem largura no meio** → depende dos laterais subirem; os corredores ficam abertos.
- **Bom contra:** times estreitos que jogam pelo centro.
- **Ruim contra:** times com pontas/alas rápidos (3-4-3, 4-3-3 de extremos abertos) que exploram os flancos vazios.
- **Gap por zona:** corredores laterais.

**4-3-3 (3 no meio, 2 extremos + centroavante)**
- **Forte:** controla o meio (3v2 contra 4-4-2), largura alta com extremos, pressão alta potente (9 + 2 extremos sufocam a saída), triângulos pro jogo posicional. Ofensivo.
- **Fraco:** exige laterais e meias atléticos; se os extremos não voltam, os laterais ficam 1v1/2v1 em transição; só 1 referência de área (jogo aéreo mais pobre).
- **Bom contra:** 4-4-2 (ganha o meio) e blocos baixos (largura + posse os abre).
- **Ruim contra:** **bloco médio-baixo que contra-ataca rápido** — a linha alta + laterais subidos deixam espaço nas costas (este é o **único matchup causal robusto** do doc-irmão: azarão deve contra-atacar o favorito de posse).
- **Gap por zona:** costas dos laterais.
- **Viés:** ofensivo / posse.

**4-2-3-1 (2 volantes, 3 meias ofensivos, 1 atacante)**
- **Forte:** o desenho mais "equilibrado/moderno" — a dupla de volantes dá segurança e base de transição; o "10" + 2 meias ocupam o espaço entre linhas; **muda de forma com facilidade** (vira 4-4-2 sem bola, 4-3-3 com bola).
- **Fraco:** vira passivo se os 3 atrás do 9 não pressionam; o atacante isola se o apoio não chega; os 2 volantes cobrem muita área.
- **Bom contra:** 4-4-2 (ganha o meio).
- **Ruim contra:** 4-3-3 que pressiona os 2 volantes 3v2.
- **Viés:** equilibrado.

**3-5-2 / 3-4-1-2 (3 zagueiros, 2 alas, miolo de meio, 2 atacantes)**
- **Forte:** superioridade no meio (os alas viram 5); 3 zagueiros dão segurança e boa saída de bola; **forte contra 2 atacantes** (3v2 atrás); largura total pelos alas.
- **Fraco:** depende **demais** dos alas (físico extremo); contra 3 atacantes, os 3 zagueiros ficam 1v1 sem cobertura; vulnerável a bola nas costas dos alas.
- **Bom contra:** 4-4-2 e times de 2 atacantes (sobra um zagueiro).
- **Ruim contra:** 4-3-3 com 3 frentes (estica os zagueiros) e times que atacam os corredores dos alas.
- **Gap por zona:** corredores e costas dos alas quando sobem.
- **Viés:** controle (3-5-2) ou ofensivo (3-4-3).

**3-4-3 (3 zag, 2 alas + 2 meio, 3 frente)**
- **Forte:** muito ofensivo — largura + 3 frentes + pressão alta.
- **Fraco:** só 2 no miolo → frágil no meio e em transição; risco defensivo alto.
- **Bom contra:** blocos baixos e times passivos.
- **Ruim contra:** meios de 3 (perde o miolo) e contra-ataque.
- **Viés:** muito ofensivo.

**5-3-2 / 5-4-1 (bloco baixo, 5 defensores)**
- **Forte:** a defesa de 5 fecha largura e profundidade; difícil de furar pelo centro; feito para **defender vantagem e contra-atacar**.
- **Fraco:** cede posse e campo; pouca presença ofensiva; sofre contra paciência + bola parada + qualidade individual.
- **Bom contra:** favoritos de posse sem plano B (o azarão que contra-ataca).
- **Ruim contra:** times pacientes que cruzam/batem bola parada e têm qualidade pra furar o bloco.
- **Viés:** defensivo/reativo. ⚠️ **Ressalva empírica:** o DML 2026 não acha evidência de que "estacionar o ônibus" **aumente** a chance de vitória — é gestão de risco, não vantagem.

**4-1-4-1 (1 volante, 2 linhas de 4, 1 atacante)**
- **Forte:** bloco médio muito compacto (2 linhas de 4 + pivô) que fecha o espaço entre linhas sem bola; vira 4-3-3 com bola.
- **Fraco:** atacante isolado; o volante único sobrecarrega; transição ofensiva lenta.
- **Bom contra:** times que insistem pelo meio/entre linhas.
- **Ruim contra:** pressão sobre o volante único; 2 atacantes que prendem os 2 zagueiros.

### A leitura honesta da matriz (por que ela é EXPLICAR, não ESTIMAR)

A "matriz de confrontos" acima é **andaime explicativo**, não tabela de apostas, por três razões que a próxima seção comprova: (1) o efeito líquido de cada confronto é **pequeno**; (2) ele é **endógeno** (times bons escolhem formas ofensivas — não é a forma que ganha, é o elenco); e (3) o rótulo nominal **mal descreve** o que acontece em campo.

---

## Estado da arte / mercado — evidência empírica (claims atômicos)

### A) A formação prevê resultado depois de controlar a força do elenco?

- **Efeito causal existe, mas é pequeno e heterogêneo:** Double Machine Learning em ~22k jogos europeus acha 4-3-3 ≈ **+0,11–0,17 gol** vs 4-4-2/5-4-1, e 4-2-3-1 ≈ **+0,16 gol / +0,18 escanteio** vs 3-5-2 (p<0,001), com 13/18 matchups significativos — mas os autores avisam que os efeitos **não são grandes o bastante pra ser vantagem decisiva** [arxiv.org/html/2602.16830v1, `verificado-fetch`, **preprint 2026, single-origin, não peer-reviewed**].
- **"Parking the bus" não aumenta vitória:** mesmo paper — "no evidence supports the idea that defensive formations increase a team's winning potential" [arxiv 2602.16830v1, `verificado-fetch`].
- **Efeito de posição/role > efeito de formação:** trocar 4 zagueiros por 3 muda mais a carga/zona dos jogadores (ES 0,38–0,70) do que a formação nominal em si [journals.plos.org/plosone .../pone.0265501, `verificado-fetch`, 2022].
- **Formação isolada melhora previsão só marginalmente:** modelo com formação + ratings FIFA dá AUC-ROC ~0,54 vs ~0,50 sem formação — ganho pequeno, e a formação só ajuda **combinada** com qualidade do elenco [PMC10101499, `verificado-fetch`, 2022]. ⚠️ O counter-review citou este paper como "bate a baseline de odds (F1 0,47 vs 0,39)", mas F1 **não é** teste de mercado (CLV/RPS); o doc-irmão fixou que os melhores modelos **empatam** o mercado em RPS [PMC12640942] — ganho de F1 ≠ edge após a margem.
- **Endogeneidade não é eliminada:** os próprios autores do DML reconhecem que times fortes "anunciam" formações ofensivas, confundindo a causalidade; o DML residualiza confundidores observáveis, não todos [arxiv 2602.16830v1, `verificado-fetch` → `NEI` sobre eliminação completa].

### B) Formação declarada ≠ forma real (o caveat que esvazia o rótulo)

- **~30% de concordância** entre 3 provedores (Opta/StatsBomb/Wyscout) sobre qual era a formação, vs concordância **muito maior na posição individual** [PMC11836022, `verificado-fetch`, 2024] — ou seja, o rótulo "4-4-2" é em parte subjetivo.
- **Mesmo rótulo, execução diferente:** com o mesmo "4-4-2", times posicionam os jogadores **15–30% mais altos** em casa vs fora (primeira detecção automática de formação) [MIT Sloan, Bialkowski et al., `verificado-fetch`].
- **Muda com bola vs sem bola:** laterais avançam com a posse e recuam sem ela; ~**22% do tempo** o jogo é "desestruturado" (transições), 78% em forma coerente [arxiv 2502.03342, `verificado-fetch`, Ligue 1 2021-22]. Opta usa **templates distintos** para com-bola (17) e sem-bola (13) [statsperform.com/.../shape-analysis, `verificado-fetch`].
- **Detecção por tracking** (role-based, Hungarian algorithm; SoccerCPD) existe e é superior a coordenadas fixas — mas exige dado posicional que o produto **não tem barato** [ResearchGate Bialkowski; arxiv 2206.10926, `verificado-fetch`].

### C) Cruzamento com tempo de jogo

- **2º tempo concentra ~56,7% dos gols** (vs ~43,3% no 1º) [soccerstats.com/timing, `snippet` agregador]; **minutos 76–90 = ~25,8%** dos gols [idem]. (Fato direcional é `consenso`; o número exato é agregador — tratar como ordem de grandeza.)
- **Gols aos 90+min em alta:** 8,6% em 2024-25 vs 6,7% em 2021-22, recorde da PL; 8% dos jogos decididos nos acréscimos [theanalyst.com (Opta), `verificado-fetch`].
- **Comebacks em alta:** 21% dos jogos com virada de 1 gol; mais viradas de 2 gols [theanalyst.com (Opta), `verificado-fetch`].
- **Por quê (consenso):** fadiga estica as linhas, abre espaço; substituições ofensivas; e **game-state** — o time que perde joga gente à frente e **se abre ao contra-ataque**. Aqui a formação cruza com o tempo: trailing → forma mais ofensiva no fim → mais gols **e** mais vulnerabilidade.

### D) Jogo aéreo e bola parada

- **Bola parada = ~30% dos gols** da PL 25-26 (2º maior da história); escanteios = **19%** dos gols (recorde) [theanalyst.com (Opta), `verificado-fetch`].
- **Arremesso longo explodiu: +162%** (1,52→3,97/jogo), virando 1 gol a cada 11,25 jogos (era 1/27) [premierleague.com, `verificado-fetch`].
- **Cruzamento é ineficiente:** só **~1,6%** dos cruzamentos viram gol direto; precisão média **~23,5%** [soccerment.com, `snippet` top-5 ligas]; correlação cruzamento-de-cabeça↔sucesso do time é fraca (~0,43) [blogarchive.statsbomb.com, `verificado-fetch`].
- **Leitura:** bola parada é a dimensão **mais repetível** e depende mais de **pessoal (altura, especialista)** do que da formação nominal — mas formações com 2 atacantes / 3 zagueiros mudam a presença aérea na área. Conecta com [SIN-013](./sinal-escanteios.md) (escanteios).

### E) Jogo nas linhas (altura, espaço, pressing)

- **Altura média de linha ~44,2 m** do gol; linha alta (Arsenal/City ~51 m) troca compactação por **vulnerabilidade nas costas** [statsultra.com; americansocceranalysis.com, `snippet`/`verificado-fetch`].
- **PPDA** como proxy de pressing: <10 = ultra-agressivo (Bournemouth 9,9), >15 = bloco baixo [techlawnews.com (Opta), `verificado-fetch`]. ⚠️ PPDA mede **intensidade, não qualidade** (doc-irmão).
- **Contra-ataque é o canal mais letal:** xG/chute de fast-break = **0,17** > open play 0,12 > bola parada 0,09; 7,1% dos gols (recorde) [theanalyst.com (Opta), `verificado-fetch`]. É o mecanismo que pune a linha alta — o matchup causal robusto.

### F) Score effects (o confound-mestre)

- Time **liderando** é superado em chutes (TSR 46,6%) mas faz 52,9% dos gols e tem melhor eficiência de xG (34,9%) [blogarchive.statsbomb.com/score-effects, `verificado-fetch`]. Time **perdendo** ganha ~1% de posse a cada 11 min atrás [`snippet` agregado]. → posse/chutes/xG brutos são **contaminados pelo placar**; nunca ler "dominou" sem olhar o game-state.

---

## Opções e recomendação

### Onde a formação entra nas 3 camadas

| Camada | Entra? | Como | Gate |
|---|---|---|---|
| **DOS-001 (ingestão)** | **Sim** | ingerir `formation` (confirmada + prevista) + `formation_field` como `observation` com proveniência | — |
| **MOD-001 (ESTIMAR)** | **Sim, como feature do modelo — não como sinal autônomo** | formação/escalação compõem o xG do jogo (efeito material ~0,15 gol); o modelo deve ser bem-especificado, mas isso **não é edge** (a casa já faz igual) | só "pesa" se passar o backtest vs CLV |
| **EXPLICAR (LLM)** | **Sim — destino principal** | narrar gaps por zona, jogo aéreo, espaço entre linhas, mudanças por tempo/placar — **tag EXPLICATIVO-NÃO-PREDITIVO**, ancorado no número, sem movê-lo | gate de 3 perguntas (doc-irmão §5) |
| **VALIDAR (SIN-012)** | árbitro | decide se alguma hipótese ortogonal vira EV+ | CLV |

### Recomendação cravada

1. **Formação é EXPLICAR por padrão.** É o melhor vocabulário didático do produto para o "porquê" — mas marcada como não-preditiva, ancorada no quant/mercado.
2. **O quant ingere formação como feature** (bundle com escalação→xG) porque o efeito é **material** (0,15 gol move o over 2.5 em ~4–6 p.p.). Isso é **especificar bem o modelo**, não achar edge — a casa tem a mesma informação.
3. **Materialidade ≠ edge.** Por ser pública ~1h antes, a formação está, **por presunção forte (não fato provado)**, na closing line. Nada nesta investigação prova ROI/CLV+ a partir de formação.
4. **Três hipóteses ortogonais para a fila de backtest** (do counter-review, como hipótese, jamais como afirmação): (a) **escanteios/cartões** — mercados de menor liquidez onde o matchup pode estar subprecificado (cruza com SIN-013); (b) **formação-surpresa vs prevista** — quando o time joga diferente do esperado, no timing antes do mercado ajustar; (c) o **ruído declarada≠real** (~30% discordância) que a casa não consegue descontar. Cada uma só vira sinal de ESTIMAR **se** sobreviver ao CLV (SIN-012).
5. **Honrar os caveats:** declarada≠real, endogeneidade, game-state como confound, e o fato de que **posição/role importa mais que o rótulo**.

---

## Modelo de dados proposto

Sem tabela nova — estende o DOS-001:

```
observation(match_id, dimension='formation', team_id,
            value_jsonb={ kind: 'confirmed'|'predicted',
                          nominal: '4-2-3-1',
                          grid: [{player_id, row, col}],   ← de formation_field
                          source, provider_agreement? },
            source, observed_at, ingested_at)              ← append-only, com proveniência
```

- `kind` separa **prevista** (pré-jogo, pro EXPLICAR e pra hipótese de timing) de **confirmada** (pós-anúncio).
- O bloco quant do `dossier_snapshot` pode derivar uma feature de formação pro MOD-001; o bloco narrativo guarda o `nominal` + `grid` pro EXPLICAR. (Resolve em parte a pergunta aberta do taxonomia-sinais sobre separar quant×narrativo no `content_jsonb`.)

---

## Plano por faceta (dados → ia → api → ui)

- **dados:** conector SportMonks → `observation` de formação (confirmada + prevista) com proveniência; reconciliar IDs via `entity_xref`. Custo do addon Expected Lineups herdado do DOS-001.
- **ia (EXPLICAR):** vocabulário de formação/zona/fase como **contexto transparente**; tag EXPLICATIVO-NÃO-PREDITIVO; passar pelo gate de 3 perguntas (causal? independente? já no preço?). **ia (ESTIMAR):** formação como feature do MOD-001, só com peso se sobreviver ao backtest vs CLV.
- **api:** servir formação dentro do dossiê (atrás do gate +18).
- **ui:** renderizar a forma (nominal + opcional o grid) como contexto com proveniência — nunca como "dica de aposta por formação".

---

## Riscos e gotchas

1. **Dupla-contagem (risco nº1):** narrar "4-3-3 ataca mais → over" quando o xG já embute a escalação é contar a mesma coisa 2×. `severity: high`
2. **Declarada ≠ real (~30% concordância):** tratar o rótulo nominal como verdade de campo engana; mitigar com `formation_field`/grid e com o caveat explícito. `severity: high`
3. **Endogeneidade:** sem controlar força do elenco, mede-se o time, não a forma. `severity: high`
4. **Game-state contamina** posse/chutes/xG brutos — ler sempre condicionado ao placar. `severity: medium`
5. **Evidência-chave é preprint single-origin** (arxiv 2602.16830, 2026, não peer-reviewed) — magnitudes a re-confirmar quando publicado. `severity: medium`
6. **Brasileirão:** profundidade/qualidade de formação na SportMonks só documentada para Europa; cutoff histórico exato `NEI` — validar em trial. `severity: medium`

---

## Refutado (com a evidência que matou)

- **"Formação defensiva (estacionar o ônibus) aumenta a chance de vitória"** → REFUTADO: DML não acha evidência [arxiv 2602.16830v1, `verificado-fetch`].
- **"Matchup de formação dá edge pré-jogo claro"** → REFUTADO: efeito pequeno (~0,1–0,18 gol) + presumido precificado + modelos só **empatam** o mercado em RPS [PMC12640942 via doc-irmão; arxiv 2602.16830v1].
- **"Tipsters/artigos descrevem estratégias por formação, logo é edge"** → REFUTADO como evidência: são content-farm (fonte banida pela escada); e a existência de estratégia pública sugere ângulo **conhecido → mais precificado**, não menos; o doc-irmão já fixou "acurácia sem lucro" de tipsters [PMC10627876].
- **"Modelo com formação bate a baseline de odds (F1 0,47 vs 0,39), logo há edge"** → REFUTADO parcialmente: F1 não é teste de mercado; o critério válido é CLV/RPS, onde modelos empatam [PMC10101499 é in-context, não CLV; PMC12640942].

## Perguntas Abertas / lacunas

- **"Já está na closing line" é presunção, não fato:** nenhuma fonte abriu a closing line para isolar formação como variável omitida — só backtest com CLV histórico resolve (depende da fonte de odds BR do DOS-001, ainda em aberto). `NEI`.
- **Formação-surpresa vs prevista** como edge de timing: literatura estuda mudanças **in-game** (ES 0,52), mas **não** a surpresa pré-jogo [PMC9218789 só in-game] — gap real, candidato a backtest.
- **Escanteios/cartões subprecificados por matchup:** plausível (mercado de menor liquidez), mas as fontes do counter-review eram fracas; só o DML (+0,18 escanteio) é sólido — hipótese, não achado.
- **Brasileirão na SportMonks:** cutoff de coleta de formação e qualidade `NEI` — testar em trial.
- **pt-BR forte é escasso** para empíricos de formação — predominou fonte EN (PL); calibrar antes de transportar magnitude pro Brasileirão.

---

## Evidências decisivas

- [preprint] https://arxiv.org/html/2602.16830v1 — DML, ~22k jogos: formação tem efeito causal **pequeno** (~0,1–0,18 gol); defensiva não aumenta vitória. (single-origin, 2026)
- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC11836022/ — só ~30% de concordância entre provedores sobre a formação (declarada≠real).
- [paper] https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0265501 — efeito de posição/role > efeito de formação.
- [paper] https://arxiv.org/html/2502.03342 — forma muda com/sem bola; ~22% do tempo "desestruturado".
- [sloan] https://www.sloansportsconference.com/research-papers/win-at-home-and-draw-away... — mesmo rótulo, execução 15–30% mais alta em casa.
- [Opta] https://theanalyst.com/articles/premier-league-counter-attacks-verticality-transitions-guardiola-iraola — contra-ataque xG/chute 0,17 > open play; pune linha alta.
- [Opta] https://theanalyst.com/articles/premier-league-delays-set-piece-throw-in-stats — bola parada ~30% dos gols; escanteios 19%.
- [Opta] https://theanalyst.com/articles/premier-league-2024-25-data-trends-stats — gols 90+ em alta (8,6%); comebacks em alta.
- [StatsBomb] https://blogarchive.statsbomb.com/articles/soccer/score-effects/ — game-state como confound-mestre.
- [docs] https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/lineups — campo `formation` + `formation_field` (grid) confirmado/previsto.
- [doc interno] [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md) — refutação-mãe (estilo/tática ≠ edge; modelos empatam o mercado).
- [doc interno] [taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) — 3 camadas + anti-dupla-contagem.
