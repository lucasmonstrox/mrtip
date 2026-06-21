---
mercado: especiais-betbuilder
titulo: Especiais e Bet Builder
---

# Especiais e Bet Builder

> Documento neutro/global (sem viés de liga). Foco em mecânica, precificação, correlação e EV. Valores de exemplo são ilustrativos salvo quando a fonte é citada.

## 0. Mapa da família

Esta família reúne dois grupos:

1. **Construtores combinados** — Bet Builder / Same Game Multi (SGM) / Same Game Parlay (SGP): várias seleções do **mesmo jogo** num único bilhete, a preço combinado.
2. **Especiais de placar/tempo/método** — Vencer os dois tempos, Marcar nos dois tempos, Virar o jogo (vencer de virada), Gol de fora da área, Método do gol.

O fio condutor é a **correlação**: como dois ou mais eventos do mesmo jogo se reforçam ou se anulam, e como a casa precifica isso. Por isso a Seção 4 (Correlações) e a Seção 7 (Correlação entre mercados) são o coração do documento.

**Submercados cobertos (7):** (1) Bet Builder / SGM / SGP; (2) Vencer os dois tempos; (3) Marcar nos dois tempos; (4) Virar o jogo / Vencer de virada; (5) Gol de fora da área; (6) Método do gol; (7) Legs auxiliares de cartões/escanteios dentro do builder.

---

## 1. Definição e regras de liquidação

### 1.1 Bet Builder / Same Game Multi (SGM/SGP)

- **Definição:** combinação de 2+ seleções (legs) extraídas de **um mesmo evento** num único bilhete. Todas as legs precisam vencer para o bilhete pagar.
- **Liquidação:** AND lógico — uma leg perdida derruba o bilhete inteiro.
- **Void/push de uma leg — ATENÇÃO, NÃO é "cai a leg e recalcula":** esta é a maior trap operacional da família. Em **acumuladores tradicionais** (legs de jogos diferentes), uma leg anulada **cai do bilhete** e o preço é recalculado com as legs restantes. **Em Bet Builder / SGM o comportamento padrão de muitas casas é o OPOSTO.** Na **bet365**, a regra oficial é:
  - **Mercados de jogador (player markets)** — ex.: "Fulano marca a qualquer momento", "Fulano leva cartão": se a leg de **jogador** vira void (o jogador não consta na ficha / não entra), o Bet Builder **pré-jogo é recalculado automaticamente** com as legs restantes.
  - **Todos os demais mercados** — se uma seleção que **não** seja de jogador vira void/push, o **bilhete INTEIRO fica void/push** e a stake é devolvida. Não há recálculo.
  - Diversas outras casas vão além e **anulam o SGM inteiro** se **qualquer** leg (inclusive de jogador) for void, devolvendo a stake.
  - **Implicação prática:** não conte com "perder só a leg ruim". Dependendo da casa e do tipo de mercado, você pode receber **só a stake de volta** (bilhete inteiro void) mesmo que as outras legs teriam vencido. Cheque as regras da casa por tipo de mercado antes de montar.
- **Borda — jogador não joga:** numa leg de "marcar a qualquer momento" / "cartão", se o jogador **não participa** (não entra), a leg é tratada como void de mercado de jogador (recálculo na bet365; possível void total noutras casas). Se entra por 1 minuto, a leg **vale** (vence ou perde normalmente).
- **Borda — gol contra:** depende da leg. Em **Resultado** (1X2) e em mercados de **placar/BTTS/marcar em ambos os tempos**, gol contra conta para o placar/para o time beneficiado. Em legs de **scorer nominal / método do gol**, gol contra é **desconsiderado** (ver 1.3 e 1.6).
- **Cash out:** majoritariamente um recurso **in-play (ao vivo)** — serve para **sair da posição com o jogo andando**. Antes do jogo o que existe é simplesmente não apostar / cancelar pela política da casa, não "cash out" no sentido estrito. A disponibilidade de cash out em **Bet Builder ao vivo varia muito** por casa e pela composição das legs (legs voláteis ou de mercados suspensos costumam travar o recurso). **Não dependa de cash out para gerir risco em tempo real num builder.**

### 1.2 Vencer os dois tempos (To Win Both Halves)

- **Definição:** a equipe escolhida precisa marcar **mais gols que o adversário no 1º tempo E mais gols que o adversário no 2º tempo**, com o **placar resetando** a 0–0 no intervalo.
- **Liquidação:** vitória parcial em **ambos** os tempos. Manter vantagem **não basta**.
- **Apenas tempo regulamentar:** o mercado considera **90' + acréscimos** de cada tempo. Prorrogação e pênaltis **não contam** (mesma regra de "virar o jogo" em 1.4 — reforçada aqui por simetria).
- **Exemplos de borda:**
  - 1ºT 3–0, 2ºT 0–0 (final 3–0): **PERDE** (2º tempo empatado).
  - 1ºT 1–0, 2ºT 2–1 (final 3–1): **GANHA**.
  - 1ºT 0–0, 2ºT 2–0: **PERDE** (1º tempo empatado).
- **Diferença vs. HT/FT:** em HT/FT o time pode empatar/perder o 2º tempo e o bilhete vencer (basta liderar no intervalo e no fim). Em "vencer os dois tempos" cada tempo é uma vitória independente — é **estritamente mais difícil**.

### 1.3 Marcar nos dois tempos (Team to Score in Both Halves)

- **Definição:** a equipe escolhida precisa **marcar ≥1 gol no 1ºT e ≥1 gol no 2ºT**. Não importa se vence, empata ou perde cada tempo; o adversário marcar é irrelevante.
- **Liquidação:** dois eventos de gol, um em cada metade.
- **Gol contra CONTA a favor do time beneficiado:** se o gol que coloca o time-alvo "na conta" daquele tempo for um **gol contra do adversário**, ele **conta** como o time-alvo tendo marcado naquele tempo (o OG é creditado ao time que se beneficia, para fins de BTTS / marcou no tempo). **Isto é o oposto da regra de scorer nominal** (onde gol contra **não** conta para nenhum jogador) — borda importante de não confundir.
- **Diferença vs. vencer os dois tempos:** aqui só importa **marcar**, não superar o rival. Mercado mais frouxo, odds tipicamente melhores que o resultado simples (ex.: time favorito a 1.91 no 1X2 pode pagar ~3.00 em "marcar nos dois tempos").

### 1.4 Virar o jogo / Vencer de virada (To Win From Behind / Come From Behind)

- **Definição:** a equipe escolhida precisa **estar perdendo em algum momento** (conceder ao menos 1 gol e ficar atrás no placar) e **terminar vencendo** dentro dos 90' + acréscimos.
- **Liquidação:** condição dupla — (a) ficar atrás em algum instante; (b) vencer no fim do tempo normal.
- **Casos de borda:**
  - Time lidera do início ao fim e vence → **PERDE** (nunca esteve atrás).
  - Empata o jogo após estar atrás, mas não vence → **PERDE**.
  - Vira no acréscimo do 2ºT → **GANHA** (acréscimo conta).
  - Prorrogação/pênaltis: **não contam** (mercado é de tempo regulamentar).

### 1.5 Gol de fora da área (Goal from Outside the Box)

- **Definição:** gol cujo **chute é desferido de fora da grande área (18 jardas)**, antes de a bola entrar na área. Pode ser mercado de jogo ("haverá gol de fora da área") ou de jogador nominal ("Fulano marca de fora da área").
- **Liquidação por dado oficial (Opta):** a posição **do chute**, não de onde a bola cruza a linha. Define-se pela base Opta → provedor de feed → site oficial da competição.
- **Bordas:**
  - **Desvio:** se um chute de fora **desvia** e entra, a atribuição segue a regra de gol contra/atacante: se o chute estava no alvo e seria gol, fica para o atacante (conta como de fora); se ia para fora e o desvio o tornou gol, pode virar gol contra (não conta).
  - **Falta direta / pênalti:** um pênalti **nunca** é "de fora da área"; faltas diretas convertidas dependem da distância do batedor. Em mercados de **Método do gol** (ver 1.6) a falta direta liquida como **Shot**, não como categoria própria.
- **Estatística de referência (PL, Opta) — CALIBRADA:** o percentual de gols de fora da área **caiu fortemente** na era moderna. Na Premier League, **2024/25 registrou o menor percentual já medido (~11,5%)** e a temporada seguinte ficou em **~11,7%**. **Desde 2015/16 nenhuma temporada passou de ~15%.** O pico histórico foi **~20,2% em 2006/07**. Para liga-alvo moderna, use **~11–12%**, não os ~17–21% que circulam em fontes antigas. (A "regra geral ~10%" é a aproximação mais próxima da realidade atual.)

### 1.6 Método do gol (Method of Goal)

- **Definição:** como o gol foi marcado. **As categorias oficiais da bet365 (settlement via Opta) são apenas 4:**
  1. **Penalty** — gol marcado **diretamente** da cobrança de pênalti. Rebote convertido **NÃO** é Penalty (liquida como Shot).
  2. **Own Goal** — gol contra.
  3. **Header** — último toque do artilheiro com a **cabeça** (intencional ou não). **Inclui o gol olímpico** (gol marcado **diretamente** de escanteio é classificado como **Header** nas regras bet365 — detalhe contraintuitivo).
  4. **Shot** — "todos os demais tipos de gol não incluídos acima". **Gol de falta direta liquida como Shot** — **NÃO existe categoria própria "Free Kick / Falta"** no Method of Goal padrão da bet365. "Falta direta" só aparece como categoria separada em sub-mercados específicos de algumas casas.
- **Gol contra em mercados de método/scorer nominal:** para um **jogador/time nominal**, gols contra **são desconsiderados** (tratados como se não tivessem ocorrido). Apenas no mercado "método do 1º gol" com opção explícita "Own Goal" é que o gol contra conta para aquela seleção.

---

## 2. Como a odd/margem se forma

### 2.1 Apostas simples vs. builders

| Tipo | Margem/edge típica da casa |
|---|---|
| Mercado simples (1X2, O/U) líquido | ~4–6% (casas recreativas 5–10%; sharps Pinnacle/Matchbook 2–3%) |
| Bet Builder / SGM (3–4 legs) | **~14–25%**, com **20–30% como teto observado** quando legs individuais de 3–7% se compõem (Predictology cita 20–25% teórico; Wizard of Odds exemplifica ~14,9% num SGP de 3 legs) |

A margem do builder é **muito maior** porque (a) o overround de cada leg se compõe e (b) a complexidade da correlação esconde o juice — "a matemática é mais difícil para o apostador médio calcular" (Predictology). A faixa **14–25%** é consistente entre as fontes; registre **20–30%** como teto observado quando há muitas legs.

### 2.2 Por que não é só multiplicar as odds

Parlay tradicional (legs independentes): `P(tudo) = p1 × p2 × ... × pn`.

No mesmo jogo as legs são **dependentes**, então a casa usa **probabilidade conjunta** `P(A∩B) = P(A) × P(B|A)`, não o produto ingênuo. O preço combinado fica **abaixo** do produto das simples quando há correlação positiva (a "correlation tax").

**Modelos usados pelas casas:**
- **Frequência empírica** onde há dados abundantes (combos populares de ligas grandes).
- **Cópula Gaussiana / Monte Carlo** para preencher e suavizar combos raros: transforma os resultados binários em variáveis normais latentes com uma **matriz de correlação R**, preservando as probabilidades marginais.
- Abordagem **híbrida** é o padrão dos books sofisticados (empírico + cópula).

### 2.3 O "desconto de correlação" na prática

Heurística usada por calculadoras públicas (gamblingcalc) — desconto linear sobre as odds de independência por tipo de combo:

| Combinação no builder | Desconto típico aplicado |
|---|---|
| Resultado + Jogador marca | **40–55%** (forte correlação +) |
| Resultado + Over/Under gols | 25–40% |
| Resultado + BTTS | 20–35% |
| BTTS + Over/Under gols | 20–35% |
| Jogador marca + Over/Under | 15–30% |
| Resultado + Cartões/Escanteios | **5–20%** (quase independentes) |

**Exemplo numérico (correlação +):** "Time A vence" (3.90) + "Salah marca" (1.53). Produto = 5.96, mas o builder paga ~**5.04** — a casa cobra a correlação positiva. Mesma lógica num exemplo Atalanta: 1.29 × 1.29 = 1.66, mas builder com legs **negativamente** correlacionadas pagou **1.95** (preço **acima** do produto).

---

## 3. Tips e ângulos de valor (onde mora o EV+)

1. **Explorar correlação negativa mal precificada — e fazê-lo SEPARADO.** Books são reconhecidamente piores em precificar correlações **negativas** (Predictology). O ângulo +EV **mais limpo** não é colocar essas seleções no mesmo builder — é apostá-las como **simples separadas**, formando um **hedge natural**: como elas tendem a não cair juntas, você captura preço justo (ou inflado) em cada uma sem pagar correlation tax. A correlação **positiva**, por contraste, só tem valor se a casa **não** aplicou desconto suficiente — situação rara, porque é justamente nela que os books são bons.
2. **Reconstruir a probabilidade justa.** Processo de 3 passos: (i) achar o preço justo de cada leg sem vig; (ii) cruzar com frequências históricas de correlação por liga; (iii) comparar a probabilidade implícita do builder com a frequência real. Se os dados dizem 35% (justo 2.85) e o builder paga 3.10 → valor escondido.
3. **Construção baseada em dados, não em narrativa.** "Salah marcou em 7 dos últimos 9 jogos em casa contra defesas frágeis" justifica a leg; palpite não.
4. **3–5 legs é o sweet spot.** Cada leg extra reduz exponencialmente a chance (4 legs a 70% cada ≈ 24%; 6 legs ≈ 12%) e aumenta a correlation tax. Builder de 12 legs a 500/1 quase sempre tem EV pior que um de 3 legs a 6/1.
5. **Mercados especiais com odds infladas por aversão:** "Marcar nos dois tempos" e "Vencer os dois tempos" costumam pagar bem em times de ataque consistente — onde o 1X2 não vale a pena, o especial pode ter EV.
6. **Cash out parcial em builders longos** trava lucro mantendo upside nas legs restantes (útil quando 3 de 4 já entraram) — **mas só se a casa oferecer o recurso ao vivo**, o que não é garantido (ver 1.1 e 9.4).

---

## 4. Correlações com o jogo (CORAÇÃO)

Cada característica abaixo indica **qual fator do jogo PUXA o mercado pra cima ou pra baixo**.

### 4.1 Estilo de jogo

| Fator | Efeito |
|---|---|
| **Favorito dominante + adversário aberto/desorganizado** | ↑ Vencer os dois tempos, ↑ Marcar nos dois tempos, ↑ Resultado+scorer no builder |
| **Posse alta + pressão alta (70% bola)** | ↑ escanteios e ↑ chutes → ↑ builders com escanteios/chute; ↑ probabilidade de marcar nos dois tempos |
| **Time de contra-ataque / bloco baixo** | ↓ gol de fora da área **do bloco baixo** (chuta pouco de longe), mas ↑ se for o time **dominante frustrado** (ver 4.5) |
| **Jogo "morto"/cadenciado de favorito que administra** | ↓ Vencer os dois tempos (relaxa no 2ºT) e ↓ Virar o jogo |

### 4.2 Ritmo e gols esperados (xG total)

- **xG total alto / O2.5 provável:** ↑ Marcar nos dois tempos, ↑ Vencer os dois tempos, ↑ chance de gol de fora da área (mais chutes).
- **xG baixo / jogo travado:** ↓ todos os especiais de gol; favorece "manter vantagem", não "vencer cada tempo".

### 4.3 Mando de campo

- **Mandante forte:** ↑ Vencer os dois tempos e ↑ Marcar nos dois tempos.
- **Viés de arbitragem pró-mandante (CALIBRADO, não é "leve empurrão"):** controlando a dominância em campo, estudos peer-reviewed encontram **+25% de amarelos a visitantes na Champions League** e **+10% na Europa League**. O efeito **cresce com a densidade de público** e **cai sem torcida** — durante os jogos sem público da COVID houve **queda de ~20% nos amarelos a visitantes**. Ou seja: o empurrão para "legs de cartão do visitante" é **material e modulado pela presença de torcida**, não marginal.
- **Virar o jogo:** tem leve correlação com o **mandante** (apoio da torcida puxa reação) e com **times de "comeback factor"** alto (frequência de marcar o gol seguinte após conceder).

### 4.4 Perfil do árbitro

- Cartões/jogo variam fortemente por árbitro: PL ~3 a 5+ (ex.: Mike Dean 4.04 vs. Simon Hooper 2.95). Médias por liga (fonte agregadora): **PL 5.37 amarelos / 0.13 vermelhos; La Liga 5.33 / 0.46; Ligue 1 3.61 / 0.28; Bundesliga 1.99 / 0.14**.
  - **ALERTA de dado:** o **1,99 amarelo/jogo da Bundesliga é anômalo** — a liga historicamente fica em **~3,5–4 amarelos/jogo** (é menos cartoneira que PL/La Liga, mas não pela metade). Provável erro do agregador ou recorte de temporada parcial. **Trate 1,99 com ceticismo e confirme em FootyStats/WhoScored para a temporada-alvo** antes de usar em precificação de cartões.
- **Árbitro rigoroso** ↑ legs de cartões no builder. **Cartão vermelho** muda tudo: a taxa de gols do time **punido cai** e a do **não punido sobe** (amarelos **não** afetam taxa de gols).
- **Janela temporal pós-vermelho (acionável):** após uma expulsão, o time com 10 **concede gol em ~40,7% dos casos**; dessas ocorrências, **~56% sofrem em até 15 min** e **~80% em até 30 min** (RunRepeat, 19.985 jogos). Excelente para builders **ao vivo** de "próximo gol" / over logo após a expulsão.

### 4.5 Clima / campo

- **Campo encharcado/vento:** ↑ erros defensivos e ↑ chutes de fora (bola desliza) → leve ↑ gol de fora da área; ↑ variância no placar.
- **Calor extremo / fim de jogo cansado:** ↓ intensidade → pode ↓ "marcar no 2ºT".

### 4.6 Calendário / cansaço

- **Time importante no meio de semana + jogo fora no fim de semana:** tende ao **under** e à administração → ↓ Vencer os dois tempos / ↓ Marcar nos dois tempos do time cansado.
- **Rodízio pesado de elenco:** ↓ consistência ofensiva → ↓ especiais de gol do time que poupa.

### 4.7 Motivação e contexto

- **Final / decisão / jogo eliminatório:** jogo mais fechado, ↓ gols → ↓ Vencer os dois tempos; ↑ cartões (tensão) → ↑ legs de cartão.
- **Fim de temporada sem objetivo:** jogos abertos → ↑ especiais de gol.
- **Clássico/rivalidade:** ↑ cartões, ↑ vermelhos → cuidado com builders de "vencer os dois tempos" (vermelho derruba).

### 4.8 Qualidade defensiva/ofensiva

- **Defesa frágil do adversário + ataque potente:** ↑ Vencer os dois tempos, ↑ Marcar nos dois tempos, ↑ Resultado+scorer.
- **Goleiro/defesa elite:** ↓ todos os especiais de gol; ↓ correlação Resultado→Over.

---

## 5. Indicadores preditivos e como lê-los

| Indicador | Leitura para esta família |
|---|---|
| **xG / xGA por equipe** | Alimenta um modelo Poisson (força ofensiva/defensiva vs. média da liga → expectativa de gols → matriz de placares). Para "marcar/vencer nos dois tempos", **quebre o xG por metade** (muitos times têm perfil 1ºT vs 2ºT distinto). |
| **Distribuição temporal de gols** | Time que marca consistentemente em **ambas as metades** → ↑ "marcar nos dois tempos". Time "tudo no 2ºT" → ↓ "vencer os dois tempos". |
| **Comeback factor / gol seguinte após conceder** | Métrica direta para "virar o jogo". |
| **Mapa de chutes (shot map) / % de chutes de fora** | Para gol de fora da área: time chuta muito de longe? Tem especialista (perfil de chutador)? Dados PL recentes: **~11–12% dos gols saem de fora da área** (e caindo); conversão fora é muito menor que dentro (ordem de ~4% fora vs. ~15% dentro). |
| **Stats de árbitro (cartões/jogo, viés casa/fora)** | Para legs de cartão no builder. Calibrar pelo viés mandante/visitante (4.3) e confirmar a média do árbitro/liga na temporada-alvo. |
| **Forma recente + H2H** | "Marcou nos dois tempos em 2 dos últimos 3" eleva a probabilidade base; H2H captura padrões táticos repetidos. |
| **Escalação / lesões** | Crucial em builders com scorer nominal (leg de jogador vira void se o jogador não joga — e na bet365 recalcula; noutras casas pode anular o bilhete). |

---

## 6. Armadilhas comuns (traps)

1. **A ilusão do preço grande.** Odds maiores ≠ valor. O builder de 12 legs esconde margem composta de 20–30%; é "sucker bet" estatístico.
2. **Empilhar legs não correlacionadas só pra inflar preço** — adiciona variância sem EV; a casa adora isso (margem cresce, sua chance despenca).
3. **Confundir "manter vantagem" com "vencer os dois tempos".** O segundo é muito mais difícil; muita gente perde por 1ºT vencido + 2ºT empatado.
4. **Adicionar legs curtas "óbvias"** (favoritão a 1.20) — quase não muda o preço e adiciona risco de zebra.
5. **Value trap:** achar +EV por sentimento. Valor só existe se **sua** probabilidade > implícita do mercado; modelo ruim gera EV falso.
6. **Trap de void = bilhete inteiro:** acreditar que "a leg cai e o resto segue". Em **Bet Builder/SGM**, fora de mercados de jogador na bet365 (e em muitas casas até com jogador), **uma leg void anula o bilhete inteiro e devolve só a stake** — você não embolsa as legs que teriam ganhado. Diferença material vs. acumulador tradicional (ver 1.1).
7. **Favorite-longshot bias / overreaction:** o mercado **subestima** zebras que marcam tarde e times em sequência ruim — relevante para "virar o jogo" do azarão mandante (estratégia de underdog mandante mostra retorno positivo em estudos), mas só com lógica tática real (set-piece, transição, favorito rodando elenco).
8. **Gol contra e desvios** quebram legs de scorer/método/gol-de-fora sem o apostador perceber as regras Opta — e, ao contrário, **gol contra CONTA** em "marcar nos dois tempos"/BTTS (ver 1.3).
9. **Cash out ao vivo indisponível** em builder — não conte com travar lucro durante o jogo.

---

## 7. Correlação entre mercados (o que combina e o que se contradiz)

### 7.1 Combinam (correlação POSITIVA — preço cai, mas é coerente)

| Combo | Por quê |
|---|---|
| Resultado (favorito vence) **+** Jogador-craque marca | Se vence folgado, o artilheiro tende a marcar (ρ alto; desconto 40–55%) |
| Over 2.5 **+** BTTS | Jogo aberto puxa ambos |
| Vencer os dois tempos **+** Over 2.5 **+** Time marca nos dois tempos | Todos pedem o **mesmo cenário** (favorito dominante e prolífico) |
| Time vence **+** Marca 1º gol **+** Lidera no intervalo | Cadeia causal: 1º gol → liderança HT → vitória |
| Posse alta/pressão **+** Over escanteios **+** Over chutes | Domínio territorial gera ambos |
| Cartão vermelho do adversário **+** Favorito vence/Over | Vermelho ↑ gols do não-punido |

### 7.2 Se contradizem (correlação NEGATIVA — evite no mesmo builder)

| Combo conflitante | Por quê |
|---|---|
| Time vence **+** Adversário marca nos dois tempos | Se o adversário marca muito, a vitória fica em risco |
| Under 2.5 **+** Vencer os dois tempos | "Vencer cada tempo" tende a exigir ≥2 gols → empurra pro Over |
| Vencer de virada **+** Time não sofre gol (clean sheet) | "Virar" exige **conceder** primeiro — contradição direta |
| Time A under cartões **+** jogo over cartões | Joga toda a carga de cartões no time B (improvável) |
| Gol de fora da área **+** Under chutes / bloco baixo passivo | Quase não chuta de longe |

**Princípio de construção:** legs positivamente correlacionadas → cobram desconto (preço pior, mas chance real maior). Legs negativamente correlacionadas → pagam **acima** do produto, mas são **menos prováveis de cair juntas** — ótimas como **simples separadas** (hedge natural com preço justo/inflado), ruins como builder.

---

## 8. Fontes de dados para alimentar prognósticos

- **xG / xGA, shot maps, % chute de fora:** Opta/The Analyst, FBref, Understat, FootyStats.
- **Distribuição de gols por metade / minuto:** FootyStats, Soccerway, FlashScore.
- **Stats de árbitro (cartões/jogo, viés casa/fora):** FootyStats referee stats, ScoreRoom, Corner-Stats, Planète Football, WhoScored (para confirmar anomalias como a Bundesliga 1,99).
- **Cartões e escanteios por time/liga:** AccaPlanner, ScoreRoom, FootyStats.
- **Odds e preço justo (devigging):** OddsJam, OpticOdds, Pinnacle (linha sharp de referência), OddsPortal.
- **Modelagem (Poisson/xG):** guias dashee87, Caan Berry; papers de Poisson EPL (arXiv/NEJSDS).
- **Comeback factor / forma:** plataformas tipo BetBallers e bases próprias derivadas de event data.

---

## 9. Camada LIVE (ao vivo)

Como cada mercado da família se reprecifica durante o jogo:

### 9.1 Gol cedo
- **Vencer os dois tempos:** gol cedo do favorito **eleva** a leg do 1ºT (já está vencendo a metade), mas o mercado migra o foco pro 2ºT — preço encurta. Se o favorito faz cedo e administra, a chance de **vencer também o 2ºT cai**.
- **Marcar nos dois tempos:** gol cedo confirma a "metade 1"; resta só marcar depois do intervalo — preço encurta bastante.
- **Virar o jogo:** gol cedo do **adversário** é o gatilho que **liga** o mercado (agora há "estar atrás"); o preço de "virar" do time que sofreu fica jogável e costuma estar **inflado por overreaction** (mercado superestima o líder).

### 9.2 Expulsão (cartão vermelho)
- Time punido: taxa de gols **cai**; o não-punido **sobe**. → ↑ "vencer/marcar nos dois tempos" do time com homem a mais; ↓ do time reduzido. Builders abertos com legs do time expulso despencam.
- **Janela de gol pós-vermelho:** o time com 10 concede em **~40,7%** dos casos, **~56% em até 15 min** e **~80% em até 30 min** (RunRepeat) — gatilho concreto para entrar em "próximo gol"/over ao vivo logo após a expulsão.
- Vermelho cedo costuma **abrir** o jogo no longo prazo (mais espaço) → leve ↑ gol de fora da área contra o bloco com 10.

### 9.3 Mudança de placar / momentum
- **Favorito vence o 1ºT mas leva empate no início do 2ºT:** "vencer os dois tempos" morre (2ºT já não será vencido com folga); reavalie.
- **Empate tardio após um time liderar:** mercado de "virar o jogo" pode reabrir valor se o time que empatou tem pressão/momentum (ler xG ao vivo, não o placar).
- **Pressão sem gol (xG ao vivo subindo):** janela para entrar em "marcar no 2ºT" antes do mercado ajustar.

### 9.4 Estratégias live específicas
- **Pré-confirmar metades:** apostar "marcar nos dois tempos" **ao vivo no intervalo** se o time já marcou no 1ºT e mantém domínio — você elimina metade do risco a um preço ainda razoável.
- **Trading de "virar o jogo":** entrar logo após o adversário abrir o placar, quando há overreaction; sair (cash out/lay) se o empate vem com momentum.
- **Cuidado:** cash out de **builder** ao vivo frequentemente fica indisponível e é política-dependente — não dependa dele para gerir risco em tempo real.

---

## Resumo executivo

- A família vive de **correlação**. O book usa frequência empírica + cópula Gaussiana/Monte Carlo, com margem efetiva de **14–25%** (teto observado ~30%) em builders vs. 4–6% em simples.
- **EV+ raro** mora em correlações **negativas mal precificadas** — melhor exploradas como **simples separadas** (hedge natural), não no mesmo builder — e em especiais (vencer/marcar nos dois tempos) com odds infladas em times de ataque consistente.
- **Regras de borda decidem o resultado:** void de leg em SGM pode **anular o bilhete inteiro** (não "cai a leg"); gol contra **conta** em "marcar nos dois tempos" mas **não** em scorer/método nominal; Method of Goal da bet365 tem só **4 categorias** (gol de falta = Shot, escanteio direto = Header); gol de fora da área na PL moderna é **~11–12%**, não ~20%.
- 3–5 legs, construção por dados, e leitura ao vivo via **xG e eventos-gatilho** (gol cedo, vermelho com janela de ~15–30 min) — não pelo placar cru.

---

## Fontes

- Bet Builders vs. Single Bets: Correlation Pricing and Hidden +EV — Predictology: https://www.predictology.co/blog/bet-builders-vs-single-bets-the-truth-about-correlation-pricing-and-hidden-ev/
- How to Use Correlation in Sports Betting — OddsJam: https://oddsjam.com/betting-education/how-to-use-correlation-in-sports-betting
- Same-Game Parlays: The Mathematics of Correlation — Wizard of Odds: https://wizardofodds.com/article/same-game-parlays-the-mathematics-of-correlation/
- Correlation in Same Game Parlays — OpticOdds: https://opticodds.com/blog/correlation-in-same-game-parlays
- Bet Builder Calculator: Same Game Multi Odds & Correlation Discount — GamblingCalc: https://gamblingcalc.com/betting/football/bet-builder-calculator/
- Bet Builder Tips — That's a Goal: https://www.thatsagoal.com/football-tips/bet-builder-tips
- To Win Both Halves Betting Market Explained — On The Ball Bets: https://www.ontheballbets.com/betting-guides/football/betting-markets/to-win-both-halves/
- To Score In Both Halves Betting Market Explained — On The Ball Bets: https://www.ontheballbets.com/betting-guides/football/betting-markets/score-both-halves/
- To Win From Behind Betting Market Explained — On The Ball Bets: https://www.ontheballbets.com/betting-guides/football/betting-markets/win-from-behind/
- What Does Win Both Halves Mean — RulesofSport.com: https://www.rulesofsport.com/betting/football/what-does-win-both-halves-mean-in-football-betting/
- Do Own Goals Count in Betting? — StatsChecker: https://www.statschecker.com/guides/do-own-goals-count-in-betting
- Football/Soccer Rules (method of goal, own goals) — Betfair Support: https://support.betfair.com/app/answers/detail/football-soccer-rules/
- Football Match Stat Markets / Goalscorer Rules — Sky Bet Support: https://support.skybet.com/app/answers/detail/football-match-stat-markets
- Same Game Multi Explained 2026 — BettingPro AU: https://www.bettingpro.com.au/same-game-multi-betting-guide/
- Poisson Distribution / Predicting Football Results — dashee87: https://dashee87.github.io/data%20science/football/r/predicting-football-results-with-statistical-modelling/
- Why are players shooting less from long range — Premier League / Opta Analyst: https://theanalyst.com/articles/numbers-behind-premier-league-goal-explosion
- Distance from Goal — % of goals from outside the area (ResearchGate): https://www.researchgate.net/figure/Distance-from-Goal-Figure-5-shows-that-31-2138-goals-were-scored-from-the-goal-area_fig2_287574161
- Referee Card Stats for Betting — Planète Football: https://planetefootball.com/guides/referee-card-stats-betting
- Yellow and red card statistics 2025/2026 — ScoreRoom: https://scoreroom.com/stats-cards/
- Effects of a red card on goal-scoring in World Cup matches — Empirical Economics (Springer): https://link.springer.com/article/10.1007/s00181-017-1287-5
- The Overround Explained — SportSignals: https://www.sportsignals.com/resources/value-betting-football/overround-value
- Same Game Parlay Pricing and Correlation Limits — Shutterb: https://shutterb.org/same-game-parlay-pricing-correlation-limits/
- bet365 — Bet Builder FAQs (regra de void: player markets recalculam, demais mercados void/push o bilhete inteiro): https://help.bet365.com/s/en/sports/bet-builder
- bet365 — Goalscoring Markets (Method of Goal: Penalty/Own Goal/Header/Shot; escanteio direto = Header; settlement por Opta): https://help.bet365.com/s/en/sportsrules/soccer/goalscoring-markets
- Premier League — Why are players shooting less from long range (gols de fora ~11,5–11,7%, pico 20,2% em 2006/07): https://www.premierleague.com/en/news/4272809
- RunRepeat — Red card study (40,7% concede gol; 56% em 15min; estudo de 19.985 jogos): https://runrepeat.com/red-card-study
- Estudo de viés de arbitragem (mais amarelos a visitantes controlando dominância): https://pubmed.ncbi.nlm.nih.gov/24444213/
