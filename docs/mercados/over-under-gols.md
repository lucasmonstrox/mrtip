---
mercado: over-under-gols
titulo: Over/Under de Gols
---

# Over/Under de Gols

> Documento de referência neutro e global (sem viés de liga específica). Cobre Over/Under total, totals asiáticos, total por equipe, total por tempo, total exato e Par/Ímpar. Valores e percentuais citados vêm das fontes listadas ao final; quando o número é uma faixa típica de mercado, isso está sinalizado.
>
> **Nota de confiança das fontes**: as regras de liquidação/void abaixo foram cruzadas de fontes secundárias (Stake, bettingexpert, Pinnacle) e do próprio texto da Central de Ajuda da bet365 capturado via busca — a bet365 (403) e a DraftKings não puderam ser abertas diretamente. A regra de abandono ("partida abandonada antes dos 90 min é void, exceto apostas já matematicamente determinadas") foi **corroborada literalmente pelo texto da bet365 via busca**, o que eleva a confiança dessa parte específica.

---

## 0. Mapa da família

| Submercado | Pergunta que responde | Linhas comuns | Push/void possível? |
|---|---|---|---|
| Over/Under total | Quantos gols saem na soma das duas equipes? | 0.5, 1.5, 2.5, 3.5, 4.5 | Não em linhas .5 |
| Total asiático | Idem, mas com linhas inteiras e quartos | 1.0, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0 | Sim (whole/quarter) |
| Total por equipe | Quantos gols UMA equipe marca? | 0.5, 1.5, 2.5 (por time) | Não em .5 |
| Total por tempo (HT/2T) | Quantos gols num único tempo? | 0.5, 1.5 (1º tempo); 1.5, 2.5 (2º tempo) | Não em .5 |
| Total exato | Número exato de gols no jogo | 0, 1, 2, 3, 4, 5, 6+ | Não (mutuamente exclusivo) |
| Par/Ímpar | Paridade do total de gols | — | Não (0 conta como par) |

Toda a família mede o **volume de gols**, não o vencedor. Isso a torna estruturalmente mais previsível que o 1X2: o volume de gols **regride à média de xG de forma mais confiável** do que o resultado vencedor/perdedor regride a qualquer coisa.

**Aviso transversal de liquidação**: todos os submercados desta família liquidam no **tempo regulamentar (90 min + acréscimos)**, salvo marcação explícita "incluindo prorrogação". **Prorrogação** só conta se o mercado for explicitamente *incl. ET*; **disputa de pênaltis (shootout)** nunca conta em mercado algum de gols.

---

## 1. Definição e regras de liquidação

### 1.1 Over/Under total (linhas .5)

- **Regra**: conta-se a soma de gols de ambas as equipes no **tempo regulamentar (90 min + acréscimos)**. Prorrogação e pênaltis **não contam**, salvo regra explícita do mercado.
- **Linha .5 nunca dá push**: como não existe meio gol, o resultado é sempre vitória ou derrota limpa.
  - Over 2.5 ganha com **3+ gols**; Under 2.5 ganha com **0, 1 ou 2 gols**.
  - Over 0.5 ganha com 1+; Over 1.5 com 2+; Over 3.5 com 4+; Over 4.5 com 5+.
- **Abandono / interrupção**: se a partida é abandonada antes dos 90 min, **todas as apostas são anuladas (void)** — exceto as cuja liquidação **já está matematicamente determinada** (ex.: já saíram 3 gols, então Over 2.5 já é vitória mesmo com abandono). Regra padrão bet365/Sky Bet/DraftKings — o texto da Central de Ajuda da bet365 confirma: "qualquer partida abandonada antes dos 90 min será void, exceto apostas já determinadas".
- **Gol contra**: conta normalmente para o total geral do jogo.
- **Pênalti durante o jogo**: conta. **Disputa de pênaltis (shootout)**: não conta.

### 1.2 Total asiático (linhas inteiras e de quarto) — o ponto técnico crítico

O total asiático introduz **push** (linha inteira) e **stake split** (linha de quarto). É o submercado com mais casos de borda.

**Linha inteira (whole line: 1.0, 2.0, 3.0):**
- Se o total **for exatamente igual à linha**, a aposta é **void** (stake devolvido, odd efetiva ×1.00).
- Over 2.0: ganha com 3+; void com exatamente 2; perde com 0–1.

**Linha de meio (half line: 1.5, 2.5):** idêntica ao Over/Under tradicional — só ganha ou perde.

**Linha de quarto (quarter line: 1.75, 2.25, 2.75):** o stake é **dividido em duas metades iguais** entre a linha inteira adjacente e a linha de meio adjacente.

| Linha | Metade A | Metade B |
|---|---|---|
| 2.25 | Over/Under 2.0 | Over/Under 2.5 |
| 2.75 | Over/Under 2.5 | Over/Under 3.0 |
| 1.75 | Over/Under 1.5 | Over/Under 2.0 |

**Matriz de liquidação — Over 2.25 (stake R$10, odd 2.20):**

| Gols | Metade 2.0 | Metade 2.5 | Resultado | Retorno |
|---|---|---|---|---|
| 0–1 | perde | perde | **Derrota total** | R$0 |
| exatamente 2 | **void** (R$5 dev.) | perde | **Meia derrota** | R$5 |
| 3+ | ganha | ganha | **Vitória total** | R$22 |

**Matriz de liquidação — Over 2.75 (stake R$10, odd 2.20):**

| Gols | Metade 2.5 | Metade 3.0 | Resultado | Retorno |
|---|---|---|---|---|
| 0–2 | perde | perde | **Derrota total** | R$0 |
| exatamente 3 | ganha | **void** (R$5 dev.) | **Meia vitória** | R$16 (≈ odd 1.65) |
| 4+ | ganha | ganha | **Vitória total** | R$22 |

> Os quatro estados possíveis numa quarter line: vitória total, **meia vitória**, **meia derrota**, derrota total. Isso reduz a variância em relação ao .5 puro — você paga por essa "proteção" em odd ligeiramente menor.

**Heurística prática — qual quarter line escolher dado o λ projetado.** A graça do quarto é o *refund parcial* no resultado exato adjacente. Ajuste a escolha para que o resultado "no fio da navalha" caia na metade que te devolve stake, não na que te derrota:

- **λ_total ~2.6–2.8 (jogo em torno de 3 gols), apostando UNDER**: prefira **Under 2.75** — se sair exatamente 3, você só leva **meia derrota** (a metade 3.0 é void), não derrota total. É a forma barata de "comprar seguro" contra o gol no fim.
- **λ_total ~2.2–2.4, apostando OVER**: prefira **Over 2.25** — se sair exatamente 2, você leva só **meia derrota**, em vez de perder tudo a 2.5.
- **λ_total ~2.6–2.8, apostando OVER**: prefira **Over 2.75** — exatamente 3 vira **meia vitória** com refund, em vez de tudo-ou-nada a 3.0.
- Regra-mãe: posicione a quarter line de modo que o **placar mais provável de "empatar a linha"** caia no lado do refund parcial. O preço dessa proteção é odd menor; só vale quando seu λ está perto de um inteiro.

### 1.3 Total por equipe (team total goals)

- Conta apenas os gols **daquela equipe** no tempo regulamentar. Versões asiáticas (whole/quarter) também existem, com as mesmas regras de push/split.
- **Gol contra (regra setorial firme, não variável por casa)**: o gol contra é sempre creditado **ao time que se beneficia no placar** — ou seja, ao adversário de quem colocou na própria rede. Para o **team total do Time X**, o gol contra **só conta se beneficia X**. Logo, um gol contra cometido pelo Time A **sobe o team total do Time B**, nunca o de A. (Confirmado em bet365/Betfair; ver Fontes.)
- Casos de borda iguais aos do total geral: abandono antes dos 90 min → void, salvo já matematicamente determinado. Liquida em 90 min salvo marcação explícita.

### 1.4 Total por tempo (1º tempo / 2º tempo)

- **Conta apenas os gols marcados naquele tempo**, no tempo regulamentar (acréscimos do respectivo tempo incluídos; pausa do intervalo separa os dois mercados).
- Linhas comuns: Over/Under **0.5 HT**, **1.5 HT** (1º tempo); **1.5**, **2.5** (2º tempo). Mesmas regras de push das linhas inteiras se ofertadas em formato asiático.
- **Fato estrutural**: o **2º tempo concentra mais gols** que o 1º (cansaço, aberturas táticas, times atrás se lançando). Isso torna o total por tempo fortemente correlacionado com o estado de jogo e com a camada live (§PLUS). Útil como linha autônoma e como perna de bet builder.

### 1.5 Total exato de gols

- Mercado de **resultados mutuamente exclusivos** (0, 1, 2, 3, 4, 5, 6+). Sem push: só a faixa correta ganha. O bucket "6+" agrega a cauda alta.
- Liquida em 90 min (sem prorrogação/shootout, salvo marcação explícita). Odds altas e overround elevado (ver §2.3) porque há muitos resultados.

### 1.6 Par/Ímpar (odd/even)

- **0-0 conta como PAR** (zero é par). Liquida no tempo regulamentar.
- Variantes: 1º tempo par/ímpar, 2º tempo par/ímpar, par/ímpar por equipe.
- Sem push possível: todo total é par ou ímpar.

---

## 2. Como a odd/margem se forma

### 2.1 O motor de precificação: Poisson sobre xG (e a correção Dixon-Coles)

A casa parte de um **λ (lambda) = gols esperados** para cada equipe:

```
λ_casa = força_ataque_casa × força_defesa_visitante × média_gols_liga(mando)
λ_visitante = força_ataque_visitante × força_defesa_casa × média_gols_liga(fora)
```

Com λ, a distribuição de Poisson dá P(0), P(1), P(2), P(3)… gols para cada time. A probabilidade de cada placar exato é o produto dos marginais (ou via **Poisson bivariada** quando se modela a correlação entre os dois ataques). A partir da matriz de placares, **toda** a família é derivada por soma de células:

- **Under 2.5** = P(0-0)+P(1-0)+P(0-1)+P(1-1)+P(2-0)+P(0-2)
- **Over 2.5** = 1 − Under 2.5 (= soma das células onde gols totais ≥ 3)
- **Par/Ímpar** = soma das células cujo total tem a paridade pedida
- **Total exato n** = soma das células cuja soma = n
- **Team total** = soma marginal de Poisson de um único λ

**Correção Dixon-Coles (1997) — o que modelos de produção realmente usam.** O Poisson puro/bivariado **distorce sistematicamente as células de baixo placar**: superestima 0-0 e 1-1 e subestima 1-0/0-1 em jogos de λ baixo, porque assume independência total entre os ataques. Dixon & Coles introduzem um **parâmetro de ajuste τ (tau)** que reescala exatamente essas quatro células (0-0, 1-0, 0-1, 1-1), além de ponderar jogos recentes mais pesado (decaimento temporal). Sem essa correção, o leitor pode achar que Poisson cru é o estado da arte — **não é**. Para mercados de gols isso importa porque Under 2.5, Par/Ímpar e Total Exato 0/1/2 dependem justamente dessas células de baixo placar.

**Exemplo numérico (Poisson puro, ilustrativo).** λ_casa = 1.6, λ_visitante = 1.1 (total esperado 2.7 gols):
- P(total = 0) ≈ e^(−2.7) ≈ 0.067
- P(total = 1) ≈ 0.181; P(total = 2) ≈ 0.245; → Under 2.5 ≈ 0.493
- Over 2.5 ≈ **0.507** → odd justa ≈ 1/0.507 ≈ **1.97**

Isso bate com o fato histórico de que **partidas passam de 2.5 gols ~51–56% das vezes** nas grandes competições (FootyStats: ~56% em ~141k jogos) — daí o Over 2.5 frequentemente orbitar a odd 2.00. Aplicar Dixon-Coles deslocaria ligeiramente massa para 1-0/0-1, refinando especialmente o Under e o Par/Ímpar.

### 2.2 Margem / overround / juice

Implícita = 1/odd. A soma das implícitas das pernas passa de 100%; o excedente é a margem.

- Over 2.5 e Under 2.5 ambos a **1.91** → 52.4% + 52.4% = **104.8%** → overround **4.8%**.
- **Casas sharp (ex.: Pinnacle)**: margem típica **2–4%** em totais principais.
- **Casas recreativas**: **6–10%+**, especialmente em props e mercados nichados.
- **Total exato e Par/Ímpar**: overround tende a ser **mais alto** (mercado nichado, menos volume).

### 2.3 Por que o asiático tem margem menor

Linhas inteiras/quartos devolvem stake em push/meio-push. Isso permite à casa **cotar mais apertado e atrair volume sharp** — o asiático costuma ser o subconjunto da família com **menor margem** e melhor referência de "preço justo".

### 2.4 Como a linha se move

- **Viés do público para o Over**: o apostador casual gosta de torcer por gols; isso empurra o Over para baixo (odd) e pode **inflar a linha** acima do justo.
- **Reverse line movement**: se a maioria das apostas está no Over mas a linha **cai** (move para Under), é sinal de **dinheiro sharp no Under** — leitura clássica de valor.
- **Lineups e clima**: a linha reage forte ao anúncio das escalações (atacante/goleiro titular) e a previsões de vento/chuva pesada.

---

## 3. Tips e ângulos de valor (onde mora o EV+)

1. **Under em jogos de meio de tabela com viés de Over inflado.** O público paga caro pelo Over; o EV+ mora frequentemente no **Under** de jogos sem narrativa atrativa.
2. **Regra do gap de 0.3–0.4 gol.** Só aposte quando seu total projetado divergir da linha da casa por **≥0.3 gol** (cobre 5–7% de margem recreativa); algumas fontes pedem **0.4** para totais principais. Abaixo disso, o edge não cobre o juice.
3. **Linha asiática como termômetro.** Use o asiático (margem baixa) para estimar o "preço justo" e então procure desvios na casa recreativa do mesmo evento.
4. **Quarter line como hedge de variância calibrado pelo λ.** Quando λ_total estiver perto de um inteiro, prefira a quarter line cujo refund parcial cobre o placar de "empate de linha" (ver heurística da §1.2): 2.75 para Under e 2.25 para Over num jogo ~2.6–2.8.
5. **xG-overperformance → mean reversion.** Time que marcou **1.5+ gols acima do xG** nos últimos 5 jogos tende a regredir → ângulo de **Under**.
6. **Goleiro quente** segurando chutes de baixa qualidade cria variância para **regressão** (cuidado com o lado: pode tanto sustentar Under quanto preparar correção).
7. **Mismatch tático.** Time de linha alta/posse vs. bloco baixo contra-atacante gera muitas chances → **Over**.
8. **Over 2.5 + BTTS Sim como combo correlacionado (bet builder).** Nas grandes ligas, Over 2.5 e BTTS **coincidem ~55–60%** das vezes; e *quando* o Over 2.5 bate, **~80%** das vezes ambos marcaram. É a perna de same-game multi mais natural da família (ver §7).
9. **Par/Ímpar com viés de placar.** Não aposte par/ímpar isolado: primeiro estime o total implícito; em jogos de **baixo placar (Under 2.5), o PAR é favorecido** (0-0, 1-1, 2-0 dominam).

---

## 4. Correlações com o jogo (o coração)

Cada característica abaixo diz **qual lado** ela puxa e **por quê**.

### 4.1 Estilo de jogo
| Perfil | Direção | Mecanismo |
|---|---|---|
| Posse alta + linha alta (mando) vs. bloco baixo contra-ataque | **OVER** | Muitas chances criadas + espaço para transição do adversário |
| Dois blocos baixos (espelho defensivo) | **UNDER** | Poucas transições, jogo travado no meio |
| Pressing alto pós-jogo europeu (≤72h) de clube ofensivo | **OVER** | Intensidade ofensiva e desorganização recíproca |
| Treinador novo (primeiros 4–6 jogos) | **UNDER** | Organização defensiva ainda não consolidada → jogo mais cauteloso/lento |

### 4.2 Ritmo e dangerous attacks
Volume de **ataques perigosos / chutes / chegadas na Zona 14** é o melhor proxy de ritmo. Ritmo alto → OVER.

### 4.3 Mando de campo
Mandante tem λ maior (joga mais para frente em casa). Em ligas com forte fator-casa, o total cresce; o desequilíbrio extremo (mandante muito superior) pode, porém, gerar **controle defensivo** e segurar gols (trap, §6).

### 4.4 Perfil do árbitro
Alguns árbitros **interrompem mais** (faltas/cartões), reduzindo fluxo → tendência de **UNDER**. Árbitros permissivos com jogo corrido tendem a **OVER**. O efeito de estilo de árbitro é real e mensurável — por exemplo, diferenças de **~1 cartão/jogo** entre nomes (ex.: Mike Dean vs. Simon Hooper). Use o histórico de cartões/faltas do árbitro como proxy de quanto ele fragmenta o jogo, mas trate números específicos de escanteios como **ilustrativos**, não como dado citável sem fonte primária.

### 4.5 Clima e campo
- **Vento forte / chuva pesada / campo encharcado ou pesado de inverno**: reduzem precisão e volume → **UNDER**.
- Campo seco e rápido favorece o jogo ofensivo → leve viés de **OVER**.

### 4.6 Calendário / cansaço
**Terceiro jogo em 7 dias**: pressing mais fraco e bloco mais profundo → menos chances → **UNDER** (apesar de às vezes o cansaço defensivo gerar gols no fim — ver camada live).

### 4.7 Motivação e contexto
| Contexto | Direção |
|---|---|
| Mata-mata / final / jogo de ida cauteloso | **UNDER** (medo de errar) |
| Time caçando saldo de gols / posição na tabela | **OVER** |
| Briga de rebaixamento | **UNDER** (cautela) |
| Fim de temporada sem nada em jogo ("praia") | **OVER** (defesas relaxadas) |
| Clássico/rivalidade | ambíguo — costuma ter UNDER por tensão, mas depende da liga |

### 4.8 Qualidade ofensiva/defensiva
Linha de fundo frágil + ataque produtivo dos dois lados → **OVER**. Duas defesas elite com ataques medianos → **UNDER**.

---

## 5. Indicadores preditivos e como lê-los

| Indicador | Como ler para gols |
|---|---|
| **xG / xGA rolantes (janela 6–8 jogos)** | Some xG ofensivo + xGA defensivo dos dois lados; gap ≥0.4 vs. linha = acionável. Pondere mais o recente. |
| **npxG (sem pênalti)** | Mais estável que xG cru; evita ruído de pênaltis. |
| **Over/under do xG real** | Time muito acima do xG → candidato a Under por regressão. |
| **Forma recente de gols concedidos** | Concessão em alta = sinal de Over. |
| **H2H (últimos 5 confrontos)** | Útil como contexto, **não** como causa; cuidado com amostra pequena. |
| **Escalação** | Ausência de goleador/zagueiro-chave move o λ; checar **antes** do mercado reagir. |
| **Chutes / posse / ataques perigosos** | Volume sustentado de chances precede gols (essencial no live). |
| **Médias da liga** | Bundesliga/Eredivisie/PL altas; Serie A/Ligue 1 mais baixas — calibra o baseline. |

### 5.1 Onde buscar os dados (estado em 2026)

| Fonte | O que oferece | Observação |
|---|---|---|
| **Understat** | xG, npxG, xGChain, xGBuildup, dados de chute (shot-level) desde 2014/15 | Melhor fonte **gratuita** de xG das top-5 ligas + Rússia; modelo treinado em 100k+ chutes |
| **FBref** | Stats estruturadas de temporada | ⚠️ **SEM xG desde 20/01/2026** — a Stats Perform (Opta) encerrou o contrato e exigiu remoção de TODAS as métricas avançadas (xG, npxG, progressive passes, shot-creating actions). **Não é mais fonte de xG.** Serve só para stats básicas. |
| **FotMob** | xG por jogo/time na interface | Alternativa de consulta rápida de xG |
| **Opta / Stats Perform (direto)** | xG oficial | Provedor pago; é a fonte que o FBref perdeu |
| **xGscore / xgScore.io** | xG por liga/time | Cobertura ampla |
| **worldfootballR (R)** | Wrapper para FBref/Understat/Transfermarkt | Para pipelines automatizados — note que o canal FBref→xG morreu em jan/2026 |
| **Apify Understat scraper** | xG via API | Para ingestão programática |
| Bases de odds (Pinnacle como referência sharp) | Linha de mercado "justa" de baixo overround | Use para de-vig e benchmark |

> Para modelar a família inteira você precisa, no mínimo: **xG/npxG por time (ofensivo e defensivo)** — hoje via Understat/FotMob/Opta, **não mais FBref** — médias da liga por mando, e a linha asiática de mercado para calibrar/de-vigar.

---

## 6. Armadilhas comuns (traps)

1. **"Time forte = jogo de muitos gols".** Falso. Equipe superior frequentemente **controla** o jogo de forma defensiva e segura placar baixo → Under, não Over.
2. **Viés do público para o Over** infla a linha; comprar Over no preço inflado é EV−.
3. **Apostar em linha já movida.** Se o dinheiro sharp já moveu a linha para o seu lado, o edge evaporou.
4. **Ignorar escalação/clima de meio de semana.** Mudanças tardias destroem o modelo.
5. **H2H como muleta.** Confrontos passados refletem elencos/treinadores que podem ter mudado.
6. **Par/Ímpar como 50/50 puro.** Não é simétrico: Under 2.5 favorece PAR (1-1, 2-0, 0-0); jogos de placar alto (3.5+) inclinam levemente para ÍMPAR (2-1, 3-2). Mesmo assim, é o submercado de menor skill da família — quase puro acaso.
7. **Confundir total exato com over/under.** "Exato 2" perde se o jogo tem 2 gols mas você queria cobrir 0–2; estruturas diferentes.
8. **Tratar Poisson cru como verdade.** Sem a correção Dixon-Coles, seu modelo superestima 0-0/1-1 — exatamente as células que sustentam Under e Par. Quem precifica Under/Exato com Poisson puro está sistematicamente enviesado.

---

## 7. Correlação entre mercados (bet builder / same game multi)

### 7.1 Combina (correlação positiva — preço sai com desconto de correlação)
| Combo | Lógica | Número |
|---|---|---|
| **Over 2.5 + BTTS Sim** | Coincidem ~55–60% nas grandes ligas; e *quando* Over 2.5 bate, **~80%** das vezes ambos marcaram | Forte correlação; a casa aplica desconto de correlação (preço menor que o produto independente) |
| **Over 2.5 + ambos os team totals Over 0.5** | Equivalente lógico de BTTS+Over | Idem |
| **Over 3.5 + favorito vence** | Goleada do mandante puxa total e resultado juntos | Positiva |
| **Over 1.5 2º tempo + Over 2.5 jogo** | O 2º tempo concentra gols; reforça o total cheio | Positiva |

### 7.2 Contradiz (correlação negativa — evitar no mesmo bilhete)
| Combo | Por quê |
|---|---|
| **Under 2.5 + BTTS Sim** | Só cabe placar 1-1; espaço minúsculo, EV ruim disfarçado de odd alta |
| **Over 2.5 + 0-0 ou Under 1.5** | Mutuamente excludentes/anti-correlacionados |
| **Par + Over 4.5** | Tensão de paridade (gols altos inclinam ímpar) |

> **Regra de ouro do bet builder**: o gerador multiplica as pernas e **aplica ajuste de correlação**. Combos positivamente correlacionados parecem ótimos mas a casa já removeu boa parte do valor; combos negativamente correlacionados raramente valem a odd exibida.

---

## 8. Fontes de dados para alimentar prognósticos

Consolidado na tabela da **§5.1**. Resumo operacional: para modelar a família inteira você precisa, no mínimo, de **xG/npxG por time (ofensivo e defensivo)** — hoje via **Understat / FotMob / Opta direto**, e **não mais FBref** (perdeu o feed Opta em jan/2026) — das **médias da liga por mando**, e da **linha asiática de mercado** (baixo overround) para de-vigar e calibrar o "preço justo".

---

## PLUS) Camada live (ao vivo)

O over/under de gols é **mais estável no live** que o 1X2: o volume regride ao xG, e mesmo após um cartão vermelho o jogo segue "vivo" para o mercado de gols.

### Gol cedo
- **Favorito leva o gol**: o λ do favorito **dispara** (manda gente pra frente), o xG dele sobe; o azarão na frente **senta** e estabiliza → leitura de **OVER** (espaço para contra-ataque + pressão).
- Gol cedo a favor do favorito: pode **matar o jogo** (controle) → atenção para Under.

### Cartão vermelho
- Vermelho no time que **perde** → ele se lança → **OVER** (mas a casa reage instantaneamente; o valor some no segundo do cartão).
- Modelos de xG **demoram a absorver** o impacto tático do vermelho — janela curta de ineficiência.

### Momentum / placar parado
- **xG > 1.0 no intervalo com 0-0 ou 1-0**: gol estatisticamente "atrasado" → backing OVER.
- **Burst de momentum**: jogo morno por 45 min e depois **0.80 xG em 10 min** de um lado = mudança de game state → OVER.
- **Big chances** (chute com xG > 0.35) desperdiçadas em série + bolas na trave → gol iminente.
- **Regra 1.0 DA**: ataques perigosos ≥ minutos jogados (ex.: 25 DA em 25 min) = gols estatisticamente próximos.
- **Zona 14** (entrada da área) sendo invadida repetidamente precede picos de xG.
- **2º tempo**: lembre que ele concentra mais gols — o total por tempo do 2T (§1.4) é o mercado live mais alinhado com a fadiga e as aberturas táticas do fim de jogo.

### Filtro de ouro no live
Os movimentos causados por **evento óbvio** (gol, vermelho) já estão precificados — a casa reage na hora. O EV+ mora nos **momentum shifts SEM evento gatilho** (domínio territorial crescente, fadiga defensiva visível), que a casa demora a precificar.

### Under no live
Combinado de xG **< 1.0** com momentum defensivo (time na frente segurando, ritmo caindo) sustenta **UNDER** ao vivo — especialmente no fim de jogos com favorito controlando.

---

## Apêndice — Cheat sheet de direção rápida

| Característica do jogo | Puxa para |
|---|---|
| Linha alta vs. bloco baixo, pressing, fim de temporada relaxado, defesas frágeis, caça a saldo | **OVER** |
| Mata-mata/rebaixamento, treinador novo, terceiro jogo em 7 dias, vento/chuva, árbitro que para o jogo, dois blocos baixos, favorito controlando | **UNDER** |
| Under 2.5 esperado | **PAR** mais provável |
| Over 3.5 esperado | **ÍMPAR** levemente mais provável |
| λ_total perto de inteiro (~3), apostando Under | **Under 2.75** (refund parcial se sair exatamente 3) |
| λ_total perto de inteiro (~2), apostando Over | **Over 2.25** (refund parcial se sair exatamente 2) |

---

## Fontes

- Stake Help Center — How do Asian Totals work?: https://help.stake.com/en/articles/5086225-how-do-asian-totals-work
- bettingexpert — Asian Total Goals Explained (glossário): https://www.bettingexpert.com/academy/glossary/asian-total-goals
- Pinnacle Odds Dropper — Over 2.5 Goals Explained: https://www.pinnacleoddsdropper.com/blog/over-2.5-goals
- Pinnacle Odds Dropper — What Is Asian Total?: https://www.pinnacleoddsdropper.com/blog/asian-total
- Pinnacle Odds Dropper — What Is Reverse Line Movement: https://www.pinnacleoddsdropper.com/blog/reverse-line-movement
- SportsBoom — Over/Under Goals Betting Explained: The Expert Strategy Playbook (2026): https://www.sportsboom.co.uk/betting/over-under-goals-betting-explained
- GoalStatistics — Asian Handicap and Over/Under Explained: https://goalstatistics.com/article/asian-handicap-and-over-under-explained
- GoalStatistics — BTTS and Over 2.5 Goals Strategy: https://goalstatistics.com/article/btts-and-over-2-5-goals-strategy
- Predictology — Football Expected Goals Stats: How to Use Advanced Metrics for In-Play Trading: https://www.predictology.co/blog/football-expected-goals-stats-how-to-use-advanced-metrics-for-in-play-trading/
- Bet Report — Bookmaker Margins Explained (Overround): https://bet.report/en/blog/bookmaker-margins-explained/
- Smarkets Help Centre — How to calculate Poisson distribution for football betting: https://help.smarkets.com/hc/en-gb/articles/115001457989-How-to-calculate-Poisson-distribution-for-football-betting
- SignalOdds — Poisson Distribution for Soccer Betting: https://signalodds.com/blog/poisson-models-in-sports-betting-predicting-goals-and-value-bets-in-lowscoring-sports
- Tactiq — Poisson Distribution in Football (metodologia λ + nota Dixon-Coles 1997): https://www.tactiq.club/en/blog/poisson-distribution-goal-modelling-football/
- Honest Betting Reviews — Total Betting Explained: Over/Under Markets: https://www.honestbettingreviews.com/total-betting/
- WinFulltime — Total Goals Odd/Even: Niche Market Strategy: https://winfulltime.com/blog/odd-even-goals-betting
- Understat — xG stats for teams and players: https://understat.com/
- Liam Henshaw — Where to Find Football Data in 2026 (Free and Paid): https://www.liamhenshaw.com/writing/where-to-find-football-data
- RulesOfSport — What Does Over/Under 0.5, 1.5 or 2.5 Goals Mean?: https://www.rulesofsport.com/betting/football/what-does-over-under-0-5-1-5-or-2-5-goals-mean/
- bet365 Help Center — Goalscoring Markets / Abandoned Matches (regra de void por abandono salvo já determinado): https://help.bet365.com/s/en/sportsrules/soccer/abandoned-matches
- Statschecker — Do Own Goals Count in Betting? (gol contra conta para o time que se beneficia no placar): https://www.statschecker.com/guides/do-own-goals-count-in-betting
- Sports Reference / FBref data update — término do contrato Opta em 20/01/2026 (fim do xG gratuito): https://www.sports-reference.com/blog/2026/01/fbref-stathead-data-update/
- FootyStats — Over 2.5 Goals Stats (~56% em ~141k jogos; confirma faixa 51–56%): https://footystats.org/stats/over25-goals
- 7bet — Over 2.5 or Both Teams to Score (Over 2.5 e BTTS coincidem ~55–60%; quando Over 2.5 bate, ~80% tem BTTS): https://7bet.co.uk/blog/over-2-5-both-teams-to-score-football-betting-stats/
