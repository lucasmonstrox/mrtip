---
mercado: ambas-marcam-btts
titulo: Ambas Marcam (BTTS)
---

# Ambas Marcam (BTTS)

> Documento neutro e global (sem viés de liga específica). Foco na correlação entre **solidez defensiva** e **estilo ofensivo**. Cobre BTTS Sim/Não, BTTS + Over/Under combinado, BTTS + Resultado, BTTS por tempo (1º/2º), Clean Sheet, e a camada ao vivo.

---

## 0. Mapa rápido da família

| Submercado | O que é | Faixa típica de odds | Frequência (referência) |
|---|---|---|---|
| BTTS Sim | Os dois times marcam ≥1 gol no tempo normal | 1.70–2.00 | ~50–53% na média; **dispersa muito por liga** (ver §8) |
| BTTS Não | Pelo menos um time não marca | 1.80–2.20 | ~45–50% (vence em mais cenários — ver §1.3) |
| BTTS + Over 2.5 | Ambos marcam **e** total ≥ 3 gols | 2.50–4.00 | alta correlação interna (ver §7) |
| BTTS + Resultado (BTTS & Win / & Draw) | Ambos marcam **e** um resultado específico (ex.: "Casa vence E ambos marcam") | 3.00–6.00+ | dinâmica própria (ver §0.1 e §7) |
| BTTS 1º tempo | Ambos marcam entre 0'–45'+ | 4.50–7.00 | baixa (1º tempo é mais cauteloso) |
| BTTS 2º tempo | Ambos marcam entre 45'–90'+ | 3.50–5.00 | maior que no 1º tempo |
| BTTS nos dois tempos | Ambos marcam em cada metade | 8.00–20.00+ | <5% das partidas de liga |
| Clean Sheet (Sim) | Time escolhido não sofre gol | varia muito | espelho direto do BTTS Não |

Fonte das faixas: Pinnacle Odds Dropper; números de frequência: FootyStats / WinDrawW in / Performance Odds (ver §8).

### 0.1 BTTS + Resultado (submercado correlacionado)

Distinto de "BTTS + Over/Under": aqui o leg combinado é **um resultado** (1X2 ou dupla chance), não um total de gols.

- **BTTS & Casa vence** (ex.: 2–1, 3–2): exige favorito que ganha **mas concede**. Correlaciona-se **positivamente** com placares apertados de vitória (2–1) e **negativamente** com goleadas a zero (3–0, 4–0).
- **BTTS & Empate**: só pode ser 1–1, 2–2, 3–3… (qualquer empate com gols). Liquida-se **junto** com BTTS Sim sempre que o jogo termina empatado com gols.
- **Nuance de valor**: o cenário que mata "BTTS & Casa vence" é exatamente o que infla a narrativa pública ("favorito forte vai golear") — quando o favorito vence **a zero**, perde-se o bilhete apesar do acerto no 1X2.

---

## 1. Definição e regras de liquidação

### 1.1 BTTS Sim/Não
- **Liquidação**: ganha **BTTS Sim** se cada equipe marcar ao menos 1 gol; **BTTS Não** se uma ou ambas terminarem sem marcar.
- **Período válido**: **90 minutos + acréscimos**. Prorrogação **não conta**, mesmo em mata-mata. Pênaltis de disputa (shootout) **não contam**; pênaltis batidos no tempo normal **contam**.
- **Gol contra**: creditado ao time **adversário** para fins de BTTS. Ex.: se o Time A faz gol contra e o Time B marca legitimamente, **ambos** são considerados marcadores → BTTS Sim. (Esta é a regra que mais confunde apostador leigo, que espera void — não é.)
- **Gol anulado**: excluído da liquidação, qualquer que seja o motivo.
- **VAR**: decisões tomadas dentro dos 90' contam; ação retrospectiva pós-jogo não altera a liquidação.
- **Jogo abandonado**: normalmente **void** (stake devolvido) se interrompido antes do fim. Algumas casas liquidam se já houver ~80'+ jogados — **regra varia por operador** (não é universal; sempre conferir os termos da casa).

> Verificação: estas regras bateram com Pinnacle Odds Dropper, Football Collective e OddsNotifier. São o padrão da indústria, com a única ressalva sendo o tratamento de jogo abandonado, que difere por operador.

### 1.2 BTTS por tempo
- **BTTS 1º tempo**: ambos marcam entre 0' e 45' (+ acréscimos do 1º tempo).
- **BTTS 2º tempo**: ambos marcam entre 45' e 90' (+ acréscimos). Gols do 1º tempo **não contam** para o submercado de 2º tempo, e vice-versa.

### 1.3 Clean Sheet (não sofrer gol)
- **Duas opções**: Clean Sheet Sim / Não, **por equipe**.
- O time **não precisa vencer**: 0–0, 1–0, 5–0 todos validam o Clean Sheet Sim. O que importa é **não sofrer gol**.
- **Gol contra e pênalti contam** como gol sofrido (quebram o clean sheet).
- Período: 90' + acréscimos; prorrogação/pênaltis em disputa não contam.
- **Relação espelho**: `BTTS Não` ⇔ (Clean Sheet do mandante **OU** Clean Sheet do visitante). Backing BTTS Não é, na prática, apostar que **algum** dos dois manterá o clean sheet.
- **Número de referência**: BTTS Não acerta **~45–50%** nas grandes ligas europeias e tipicamente precifica **um pouco mais curto** que BTTS Sim, porque vence em **mais cenários** — cobre 0–0 **e** qualquer placar em que pelo menos um lado não marca (1–0, 2–0, 3–0…). É o derivado mais "limpo" de clean sheet.

### 1.4 Casos de borda que mais geram disputa
- Gol contra como "gol do adversário" (apostadores leigos esperam void — não é).
- Gol no último minuto dos acréscimos vira BTTS Sim a 0' de odds residual no ao vivo.
- Anulação por VAR depois de o mercado já ter pago no ao vivo (raro, mas reabre).

---

## 2. Como a odd/margem se forma

### 2.1 Precificação base
O mercado é **binário** (Sim/Não). A casa estima `P(BTTS Sim)` a partir de:
- taxas de marcar/sofrer de cada time, **com split casa/fora**;
- força defensiva (taxa de clean sheet) e ofensiva;
- H2H, motivação/contexto, lesões, clima.

Depois aplica a **margem (overround)**: num mercado de duas vias, o "justo" soma 100%; tudo acima é margem da casa.

### 2.2 Margem típica e juice
- Operadores **soft** chegam a embutir ~**10%** de margem no BTTS (considerado abusivo).
- Casas **sharp** (Pinnacle, exchanges como Betfair) operam muito mais apertado e refletem a probabilidade "verdadeira".
- **Implicada = 1 / odd decimal**. Ex.: 1.80 → 55,6%. Duas odds de 1.80/1.90 → implícitas 55,6% + 52,6% = **108,2%** → margem ≈ 8,2%.

### 2.3 Como a linha se move
- **Pré-jogo**: notícias de escalação (ausência de centroavante ou de zagueiro central) movem a linha; remoção de um goleador puxa BTTS Sim **para baixo**.
- **Clima** entra na precificação de algumas casas (vento/chuva), mas o **efeito real sobre gols é contestado** — ver §4.5.
- **Ao vivo**: cada gol e cada cartão vermelho reprecificam o mercado quase instantaneamente (ver §9).

### 2.4 Onde comparar
A dispersão de margem entre operadores é grande → **line shopping** é parte estrutural do EV. Comparar soft vs. sharp/exchange para detectar discrepância é o passo 1 do método de valor.

---

## 3. Tips e ângulos de valor (onde mora o EV+)

### 3.1 O método de valor (núcleo)
1. **Estime sua probabilidade** com dados (xG/xGA, taxas de marcar/sofrer casa/fora, clean sheet, forma).
2. **Converta a odd em implícita** (`1/odd`) e **remova o overround**.
3. **Aposte só quando sua estimativa > implícita**. Critério prático citado por modeladores: **edge ≥ 2–4%** após remover a margem.

Exemplo numérico:
- Odd BTTS Sim = 1.80 → implícita 55,6%.
- Sua estimativa via Poisson/xG = 65%.
- Edge bruto ≈ 9,4 pp → aposta de valor.

### 3.2 Ângulos concretos de EV+
- **BTTS Sim vs. Over 2.5**: se BTTS Sim está 1.90 e Over 2.5 está 2.10, o valor pode estar no BTTS — os dois podem marcar **sem** chegar a 3 gols (ex.: 1–1, 2–1).
- **Regressão por xG**: time com **xGA alto mas poucos gols sofridos reais** está "devendo" gols → candidato a BTTS Sim contra ataque competente.
- **Perfil-modelo de BTTS Sim**: mandante que marca com facilidade **+** visitante que **contribui ofensivamente** (não se fecha atrás).
- **Limiares úteis** (referências de guias):
  - **Taxa de clean sheet < 30%** → time concede com regularidade (bom para BTTS Sim).
  - **Taxa BTTS do time ≥ 60%** nos jogos recentes (com split casa/fora).
  - **≥ 5 chutes no alvo sofridos por jogo** → vulnerabilidade defensiva.
- **Disciplina por liga**: especializar-se em 1–2 ligas melhora o reconhecimento de padrão; stake 1–2% da banca por aposta.

### 3.3 Clean Sheet / BTTS Não como valor
- BTTS Não costuma estar **subprecificado** quando a narrativa pública superestima "dois times que marcam muito" (ver §6). Defesa sólida + visitante que recua = BTTS Não com odd inflada.
- Lembre que BTTS Não **vence ~45–50%** das vezes e cobre mais cenários que o Sim (§1.3); como derivado de clean sheet, é o caminho mais direto para monetizar uma defesa sólida sem precisar acertar o placar exato.

---

## 4. Correlações com o jogo (o coração do dossiê)

> Regra geral: **BTTS Sim** quer **dois ataques capazes encontrando duas defesas vulneráveis ou abertas**, em jogo de **transições e ritmo alto**. **BTTS Não** quer **assimetria** (um lado muito superior que goleia, ou um lado que se fecha) **ou** condições que matam gols.

### 4.1 Estilo de jogo (o fator que mais move)
| Característica | Direção em BTTS Sim | Por quê |
|---|---|---|
| **Pressão alta (high press) dos dois lados** | ↑↑ | força erros/turnovers e deixa espaço nas costas → chances mútuas. PPDA baixo = ritmo alto |
| **Contra-ataque vs. posse** | ↑ | jogo "aberto": time de posse arrisca na saída, sofre na transição |
| **Linha defensiva alta** | ↑ | vulnerável a bolas em profundidade e velocistas → o "fraco" também marca |
| **Posse estéril / bloqueio baixo de uma equipe** | ↓ | um lado controla, o outro não chega ao gol |
| **Dois blocos baixos cautelosos** | ↓↓ | poucos chutes de qualidade dos dois lados |

Combinação clássica de **BTTS Sim**: time de **posse que arrisca** contra time de **contra-ataque com velocidade**.

### 4.2 Ritmo / tempo
- Mais transições e velocidade de progressão → mais gols de ambos. **PPDA** (intensidade de pressão) é proxy de tempo.
- 1º tempo é estatisticamente **mais cauteloso**; a maioria dos gols sai no **2º tempo** → BTTS de tempo cheio depende muito do desenrolar tardio.

### 4.3 Mando de campo
- Mandante tende a marcar mais (vantagem de casa). BTTS Sim ideal = **ataque forte do mandante + visitante que ainda assim balança a rede**.
- Cuidado: mandante muito superior pode **golear a zero** → mata o BTTS (ver traps).

### 4.4 Perfil do árbitro
- Árbitro **permissivo** (deixa o jogo correr, marca menos faltas) → jogo mais fluido e aberto → tende a favorecer gols e BTTS Sim.
- Árbitro **rigoroso/cartoneiro** → mais interrupções, mais faltas, ritmo quebrado → tende a reduzir volume de gols.

### 4.5 Clima e campo (efeito CONTESTADO — não tratar como fato)

> **Atenção:** o efeito do clima sobre o **número de gols** é **estatisticamente não comprovado**. A melhor evidência disponível contradiz a crença popular de "chuva = menos gols".

- A análise estatística mais rigorosa encontrada (opisthokonta.net, ~4.826 jogos da Championship + ~2.702 da Premier League desde 2002, com dados de precipitação ponderados por estação meteorológica) conclui que **a chuva não influencia os resultados**: cada milímetro de chuva está associado a **+0,16% de gols**, valor **estatisticamente indistinguível de zero** (p = 0,856).
- Os números que circulam em guias de tipster — "chuva ~0,4 gol a menos por jogo", "reduz ~17% os gols", "vento >25 km/h eleva BTTS Não até ~15%", "precisão de passe −9/−12%" — vêm de fontes promocionais (bettinggods, tipstercompetition, sportbotai) e **não são validados por análise estatística séria**. Trate-os como **alegações de tipster, não como direcionais confiáveis**.
- O efeito **mais consistentemente documentado** do clima é sobre a **precisão de passe** (queda de ~10–15% em passes longos sob chuva/vento), **não** sobre o número de gols. Mesmo aí, a tradução disso em gols/BTTS é incerta.
- **Conclusão prática**: não construa edge sobre "vai chover → BTTS Não". Se a casa precificar clima de forma agressiva, isso pode até ser uma fonte de valor **a favor** do BTTS Sim, já que o efeito real é próximo de nulo.

### 4.6 Calendário e cansaço
- Jogos a cada 3–4 dias → técnicos **reduzem a intensidade de pressão** no início para poupar energia → 1ºs tempos mais cautelosos, menos cascatas de gols cedo, mais empates ao intervalo.
- Hipótese do usuário (memória do projeto): **jogo importante no meio de semana + jogo fora no fim de semana → under/BTTS Não** é consistente com o efeito-fadiga acima. Tratar como **hipótese a validar com dados**, não como fonte externa.

### 4.7 Motivação e contexto
| Contexto | Efeito típico |
|---|---|
| Decisão / mata-mata / "deve marcar" em jogo de volta | abre o jogo → ↑ BTTS Sim (lado que precisa marca; expõe-se atrás) |
| Clássico/derby tenso | frequentemente **mais cauteloso/cartoneiro** → ↓ BTTS Sim |
| Fim de temporada sem objetivo ("nada a perder") | jogo aberto → ↑ BTTS Sim |
| Time já classificado / poupando | imprevisível; pode reduzir intensidade |

### 4.8 Qualidade defensiva vs. ofensiva (síntese)
- **BTTS Sim** = (ataque competente A) × (defesa vulnerável B) × (ataque competente B) × (defesa vulnerável A). Basta **um** desses quatro falhar para virar BTTS Não.
- A **solidez defensiva do azarão** importa tanto quanto o ataque do favorito: dois ataques fortes às vezes produzem 3–0/4–0 porque o lado fraco **colapsa** (goleia-se a zero).

---

## 5. Indicadores preditivos (e como lê-los)

| Indicador | Leitura para BTTS |
|---|---|
| **xG for / 90** (ambos) | capacidade de criar — quanto maior dos dois lados, mais provável BTTS Sim |
| **xGA / 90** (ambos) | vulnerabilidade defensiva — alto dos dois lados é o cenário ideal de BTTS Sim |
| **xGA alto + poucos gols sofridos reais** | regressão pendente → defesa "devendo" gols |
| **Taxa de clean sheet** | < 30% = concede muito (BTTS Sim); alta = candidato a BTTS Não |
| **Taxa BTTS recente (split casa/fora)** | ≥ 60% reforça BTTS Sim; usar casa para mandante, fora para visitante |
| **Chutes no alvo sofridos/jogo** | ≥ 5 sinaliza fragilidade defensiva |
| **Share de chutes dentro da área / big chances** | qualidade > volume; valida o xG |
| **Forma recente (5–6 jogos) ponderada** | mais peso que média de temporada, mas cuidado com amostra pequena |
| **Escalação/lesões** | ausência de centroavante derruba BTTS Sim; ausência de zagueiro central eleva |
| **PPDA / build-up speed** | proxy de tempo e abertura do jogo |
| **H2H** | secundário e enganoso isolado (estilos mudam de temporada) |

### 5.1 Modelo Poisson + xG (núcleo quantitativo)
1. λ (gols esperados) de cada time = força de ataque × força de defesa do rival × média de gols da liga (com fator casa/fora).
2. `P(time marca ≥ 1) = 1 − P(0 gols) = 1 − e^(−λ)`.
3. `P(BTTS Sim) ≈ P(mandante ≥1) × P(visitante ≥1)` (multiplicação **assume independência** — ver limitação abaixo).

Exemplo: λ_casa = 1,6 e λ_fora = 1,1 →
- P(casa ≥1) = 1 − e^(−1,6) = 0,798
- P(fora ≥1) = 1 − e^(−1,1) = 0,667
- **P(BTTS Sim) ≈ 0,798 × 0,667 ≈ 0,53 (53%)** → odd justa ≈ 1,89. Comparar com o mercado para achar valor.

### 5.2 A limitação da independência (Dixon-Coles) — atenção técnica

A multiplicação `P(casa ≥1) × P(fora ≥1)` **não é exata**. A literatura é específica:

- **Dixon & Coles (1997)** e **Karlis & Ntzoufras (2003)** mostram que a distribuição **conjunta** dos gols dos dois times **não é bem representada pelo produto de duas Poisson independentes**: há **subrepresentação sistemática de placares baixos**, em especial **0–0 e 1–1**.
- Isso enviesa **diretamente** o `P(BTTS)` calculado por multiplicação simples, porque **0–0** (BTTS Não) e **1–1** (BTTS Sim) são justamente os placares mal modelados — o erro recai sobre a **fronteira** do mercado BTTS.
- **Padrão da indústria** para corrigir: o termo de correção **tau (τ)** do modelo **Dixon-Coles** (ajusta os baixos placares), ou o **bivariate Poisson** de Karlis-Ntzoufras (parâmetro de covariância explícito).
- **Na prática**, gols são apenas **fracamente correlacionados**, então as duas abordagens dão previsões **quase idênticas** à Poisson dupla na maioria dos jogos — mas a correção importa exatamente nos placares de fronteira que decidem o BTTS.
- Modeladores modernos também calibram λ com **xG** (Opta/Wyscout) em vez de gols brutos, reduzindo ruído de amostra.

---

## 6. Armadilhas comuns (traps)

1. **"Times grandes sempre marcam" ⇒ BTTS Sim automático**: Real/Bayern/City frequentemente fazem **3–0/4–0**; o azarão **colapsa** e não marca. Ataque forte ≠ BTTS Sim.
2. **Ler só o placar final**: 4–0 ou 5-gols recente não prediz BTTS Sim no próximo. É preciso contexto (xG, estilo do adversário).
3. **Ignorar a defesa do favorito**: uma defesa de elite transforma "jogo aberto no papel" em **BTTS Não**.
4. **"Últimos 5 jogos"** como filtro raso: amostra pequena, sem split casa/fora, sem ajuste de oponente. Modeladores preferem filtros maiores e ponderados.
5. **Confundir "marca muito" com "concede muito"**: um time pode marcar bastante e **não conceder** → bom para Clean Sheet, ruim para BTTS Sim.
6. **Jogos cagados/baixo risco** (decisões tensas, derbies travados, jogos sem objetivo defensivo de ambos) raramente dão BTTS Sim, apesar de nomes ofensivos.
7. **Sobrepeso em estrela individual** vs. padrão sistêmico do time.
8. **Narrativa de "clássico de gols"** inflando BTTS Sim em jogos historicamente truncados.
9. **Margem soft de ~10%** comendo o EV silenciosamente — não comparar odds é uma trap por si só.
10. **Combinar BTTS Sim + Over 2.5 numa múltipla "normal"** (tratada como independente pela casa): os dois são **positivamente correlacionados**, então a odd combinada **não reflete a probabilidade conjunta verdadeira** — a casa cobra como se fossem eventos independentes quando não são, **destruindo EV**. (O inverso também vale: **Under 2.5 + Clean Sheet** são igualmente correlacionados — ambos se beneficiam de defesa sólida — e sofrem o mesmo problema numa acumulada simples.) Para combinar mercados correlacionados, **use o bet builder / same game multi**, que aplica o desconto de correlação (ver §7), e não o acumulador padrão.
11. **Clima como direcional (falso)**: apostar BTTS Não "porque vai chover" — o efeito sobre gols é estatisticamente nulo (§4.5).
12. **Liga top-heavy lida como liga de gols**: ligas com favorito muito dominante têm **Over 2.5 alto mas BTTS mais baixo** (goleadas a zero) — ver §8. Não importe a intuição de uma liga ofensiva equilibrada para uma liga de favoritos.

---

## 7. Correlação entre mercados (bet builder / same game multi)

> **Princípio central**: o bet builder aplica desconto de correlação; o **acumulador padrão não** (ele precifica como se os legs fossem independentes). Combinar mercados correlacionados num acumulador comum é -EV (ver trap §6.10).

### 7.1 Combina bem (correlação positiva — odd combinada é descontada no bet builder)
- **BTTS Sim + Over 2.5**: forte correlação positiva. Jogo onde os dois marcam costuma passar de 3 gols. O bet builder **reduz** a odd combinada por correlação. Risco residual: 1–1 (BTTS Sim mas Under). Liquidação: precisa de **≥3 gols E ≥1 de cada lado** (ex.: 2–2 ganha; 3–0 perde).
- **BTTS Sim + "Casa vence"** → equivale a **BTTS & Win** (§0.1): correlação positiva com placares apertados (2–1) e negativa com goleadas a zero.
- **BTTS Sim + ambos os times com gol no jogador** / **time a marcar**: coerente em torno da mesma ameaça ofensiva.
- **BTTS Sim + escanteios altos**: time que ataca muito gera escanteios — funciona quando o leg de gols e o de cantos giram em torno da **mesma pressão ofensiva**.
- **Under 2.5 + Clean Sheet** (de um lado): positivamente correlacionados (defesa sólida alimenta os dois).

### 7.2 Contradiz (correlação negativa — evitar no mesmo bilhete)
- **BTTS Sim + Clean Sheet** (de qualquer lado): mutuamente exclusivos — Clean Sheet = BTTS Não.
- **BTTS Sim + Under 1.5**: quase impossível (mínimo de BTTS Sim é 1–1 = 2 gols).
- **BTTS Sim + "Vitória por 2+ com Clean Sheet"** (handicap seco a zero): contraditório.

### 7.3 Fraco/independente (desconto pequeno, 5–20%)
- **BTTS + cartões**: cartões são relativamente independentes do placar; perfil de árbitro liga os dois fracamente.
- **Resultado + cartões/escanteios**: SGM fica perto do preço de acumulada simples por baixa correlação.

### 7.4 Nuance por liga (correlação BTTS↔Over varia)
- Premier League, Bundesliga, Ligue 1: % de Over 2.5 e BTTS quase **idênticas**.
- Serie A e La Liga: desvios maiores, geralmente **inclinando para BTTS** (jogos equilibrados, menos goleadas).
- Ligas com top muito dominante (França/Espanha topo): mais **resultados unilaterais** → Over 2.5 alto **mas** BTTS menor (goleadas a zero).

---

## 8. Fontes de dados e frequência por liga

> **Não use um número global único de BTTS para precificar.** A média ronda **~50–53%**, mas a **dispersão por liga é grande** (de ~45% em ligas top-heavy a ~63% na Eredivisie). Sempre puxe a tabela por liga.

| Fonte | Para quê |
|---|---|
| **FootyStats** (`/stats/btts-stats`, atualizada diariamente) | % BTTS por liga e por time, splits casa/fora, BTTS 1º/2º tempo, "marcou nos dois tempos" |
| **WinDrawWin** (`/statistics/best-leagues-for-both-teams-to-score/`) | ranking de ligas por % BTTS e BTTS nos dois tempos |
| **StatsChecker / Football365 / Statz** | tabelas de BTTS da Premier League e outras |
| **Opta / Wyscout** | xG, xGA, big chances, share de chutes na área (qualidade) |
| **Understat (xG público)** | xG/xGA por time e por jogo para regressão |
| **Pinnacle / Betfair Exchange** | odds "sharp" como benchmark de probabilidade justa |
| **Performance Odds / The Stat Bible / ProbWin** | filtros e modelos de BTTS, consistência por time |
| **Provedores de clima** | vento/chuva pré-jogo — útil para **detectar overreaction da casa**, não como direcional próprio (§4.5) |

### 8.1 Frequências por liga (referência verificada, temporada 2025/26)

| Liga | BTTS Sim (aprox.) | Observação |
|---|---|---|
| **Eredivisie** (Holanda) | **~63%** | ~85/135 jogos; faixa plurianual típica 58–64% — liga ofensiva e equilibrada |
| **Bundesliga** (Alemanha) | **~60%** | ~163/270 jogos |
| **Premier League** (Inglaterra) | **~55%** | ~179/324 jogos numa temporada de referência (55,2%) |
| **Ligas top-heavy** (favorito dominante) | **~45%** | Over 2.5 alto **mas** BTTS baixo por goleadas a zero |

- **Faixa por time** dentro de uma liga: de ~33% (defensivo/fraco ofensivamente) a >90% (atacante e vazado).
- O headline "~50–55% em grandes ligas" subestima Eredivisie/Bundesliga e provavelmente reflete só uma amostra de Premier League — daí a regra de **usar tabela por liga**.

---

## 9. Camada live (ao vivo)

### 9.1 Como a leitura muda com o placar
- **Gol cedo (0–15')**: encurta brutalmente o caminho do BTTS Sim. Estratégia: **backing BTTS Sim pré-jogo e cash-out parcial** após o 1º gol, ou **lay 0–0**/back Over 1.5 antecipando. Depois de 1–0, falta só o outro time marcar; a odd de BTTS Sim cai (e o valor migra para BTTS Não residual se o líder controla).
- **Placar travado em 0–0 entrando no 2º tempo**: BTTS Sim fica caro de "completar"; mas como a maioria dos gols sai no 2º tempo, ainda há vida. Avaliar xG ao vivo e quem precisa do resultado.
- **1–0 com bloqueio baixo do líder + 30' restando**: BTTS Sim depende do perdedor marcar — leia pressão, chutes no alvo e substituições ofensivas.

### 9.2 Cartão vermelho (o maior choque de mercado)
- Time com 10 homens: rende ~**0,6 gol/jogo abaixo** da expectativa pré-jogo (marca menos, **concede mais**) — efeito documentado em estudo acadêmico (Empirical Economics).
- **Direção para BTTS**: depende de **quem** levou o vermelho e do **placar**:
  - Vermelho no time que **ainda não marcou** → BTTS Sim **despenca** (ele dificilmente fura agora).
  - Vermelho no time **na frente** que já marcou → o outro lado tende a marcar → BTTS Sim **sobe**.
- Mercado **suspende** brevemente após o vermelho, reabre com preço novo que embute tanto a probabilidade quanto a gestão de exposição da casa — o **primeiro preço pós-reabertura** nem sempre está corretamente dimensionado (janela de valor para quem leu rápido).

### 9.3 Momentum e contexto ao vivo
- Sequência de chutes no alvo / escanteios de um lado que ainda não marcou → antecipar gol e **back BTTS Sim** antes da reprecificação.
- Mudança de placar que obriga um time a se abrir (ex.: 0–1 em casa) → expõe a defesa → **ambos** podem marcar → BTTS Sim sobe.
- Acréscimos longos + um lado pressionando para empatar → valor tardio em BTTS Sim se faltar só um gol.

### 9.4 Estratégias live específicas
- **Lay do BTTS Não / back BTTS Sim** logo após gol cedo do lado mais fraco (sinaliza jogo aberto).
- **Trade de clean sheet ao vivo**: backing Clean Sheet pré-jogo do favorito e cash-out se ele abrir 1–0 cedo controlando.
- **Não perseguir** BTTS Sim no fim de jogo travado 0–0/1–0 com bloqueio baixo: probabilidade real é baixa apesar de odd "tentadora".

---

## Apêndice — Regras de bolso

- **BTTS Não = Clean Sheet de algum dos lados** e vence ~45–50% das vezes (cobre mais cenários). Sempre cheque qual defesa segura.
- **Gol contra conta** para o time adversário; **pênalti batido no tempo** conta; **disputa de pênaltis e prorrogação não**.
- **Jogo abandonado** geralmente é void — mas a regra do "~80'+" varia por operador; confira os termos.
- **Estilo > nomes**: transições e linha alta puxam BTTS Sim; assimetria e bloqueio baixo puxam BTTS Não.
- **Clima NÃO é direcional comprovado**: o efeito sobre gols é estatisticamente nulo; se a casa precificar chuva agressivamente, pode haver valor **a favor** do BTTS Sim.
- **Poisson dupla enviesa a fronteira** (0–0 e 1–1): use a correção **Dixon-Coles (τ)** ou bivariate Poisson para precisão no BTTS.
- **Use tabela por liga** (FootyStats/WinDrawWin), nunca um número global: ~45% (top-heavy) a ~63% (Eredivisie).
- **Vermelho** move tudo — leia quem e quando antes de entrar.
- **Não combine mercados correlacionados** (BTTS+Over, Under+Clean Sheet) em acumulador padrão — só no bet builder.
- **Compare odds** (margem soft chega a 10%) e exija **edge ≥ 2–4%** após overround.

---

## Fontes

- Pinnacle Odds Dropper — What does BTTS mean in betting? https://www.pinnacleoddsdropper.com/blog/btts
- Pinnacle Odds Dropper — What is a clean sheet bet? https://www.pinnacleoddsdropper.com/blog/clean-sheet
- Smart Sports Trader — BTTS Strategy: Value Method. https://smartsportstrader.com/both-teams-to-score-btts-strategy-value-method/
- FootyMind — BTTS Model-Based Tips & Strategy. https://www.footymind.com/btts
- MyDeepMetrics — Both Teams to Score (BTTS) Guide. https://mydeepmetrics.com/betting/both-teams-to-score-btts-guide
- Smarkets — How to calculate Poisson distribution for football betting. https://help.smarkets.com/hc/en-gb/articles/115001457989-How-to-calculate-Poisson-distribution-for-football-betting
- GamblingCalc — Bet Builder Calculator. https://gamblingcalc.com/betting/football/bet-builder-calculator/
- Performance Odds — BTTS & Over/Under e correlações por liga. https://www.performanceodds.com/how-to-guides/betting-predictions-explained-the-complete-guide-to-btts-over-2-5-under-2-5-high-probability-models/
- FootyStats — BTTS stats (Premier League). https://footystats.org/england/premier-league/btts
- FootyStats — BTTS stats (índice por liga). https://footystats.org/stats/btts-stats
- FootyStats — Bundesliga BTTS Stats (~60%). https://footystats.org/germany/bundesliga/btts
- WinDrawWin — BTTS nos dois tempos / estatísticas por liga. https://www.windrawwin.com/statistics/both-teams-to-score-in-both-halves/
- WinDrawWin — Best Football Leagues for Both Teams to Score. https://www.windrawwin.com/statistics/best-leagues-for-both-teams-to-score/
- WinDrawWin — Eredivisie Both Teams To Score Statistics (~63%). https://www.windrawwin.com/us/soccer-stats/both-teams-to-score/netherlands-eredivisie/
- Tipster Competition — Weather Football Betting (alegações de tipster, contestadas). https://tipstercompetition.com/article/weather-football-betting-how-rain-wind-pitch-conditions-affect-your-bets
- BettingGods — Does weather affect the number of goals scored in football? (alegação contestada). https://bettinggods.com/football/does-weather-affect-the-number-of-goals-scored-in-football/
- opisthokonta.net — Rain does not influence football results (análise estatística que contradiz o efeito-chuva). https://opisthokonta.net/?p=1066
- Shurzy — How Red Cards Affect Live Soccer Odds. https://content.shurzy.com/post/how-red-cards-affect-live-soccer-odds
- Springer / Empirical Economics — Effects of a red card on goal-scoring. https://link.springer.com/article/10.1007/s00181-017-1287-5
- FootballBookie — Expected Goals (xG) for Football Betting. https://football-bookie.com/articles/expected-goals-xg-for-football-betting/
- Predictive Modeling of Association Football Scores Using Bivariate Poisson (Karlis-Ntzoufras). http://article.sapub.org/10.5923.j.ajms.20201003.01.html
- Dixon–Coles Model Explained (correção da independência do Poisson, placares baixos). https://predictionengine.app/learn/dixon-coles-soccer-model
- 20bet — BTTS, Over/Under, Clean Sheet: A Goal Markets Betting Strategy (correlação entre mercados). https://blog.20bet.com/betting-guide/btts-over-under-clean-sheet-guide/
- NerdyTips — What Is a 'Both Teams to Score No' Bet? (BTTS Não como derivado de clean sheet). https://nerdytips.com/blog/what-is-a-both-teams-to-score-no-bet-a-beginners-guide-to-btts-no-betting/
