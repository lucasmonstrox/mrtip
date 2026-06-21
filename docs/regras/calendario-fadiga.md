# Regra de prognóstico — Calendário e fadiga ("ressaca de meio de semana")

> Como o **congestionamento de calendário** (jogo importante no meio de semana → jogo da liga no fim de semana) entra na pipeline do mrtip. Nasce de uma **hipótese de domínio do João**: *time que joga competição continental no meio de semana e depois joga FORA na liga → poucos gols (under)*. Esta regra é o resultado de uma investigação adversarial dessa hipótese — e o veredito é **honesto**: a versão crua é, em grande parte, o efeito casa/fora que o mercado já precifica; só uma versão **refinada e estreita** tem chance de virar EV+.

- **Status:** rascunho inicial (v0) — investigado, **não** calibrado.
- **Última atualização:** 2026-06-18
- **Dimensão no dossiê:** adiciona "Calendário/fadiga" às dimensões do [overview](../visao-geral.md#6-como-a-ia-entende-um-jogo). Conversa com [rivalidade.md](./rivalidade.md) (ambos modulam contexto) e com a futura regra de **mando de campo** (o confundidor central aqui).
- **Origem:** memória `teoria-ressaca-meio-de-semana`. Workflow de pesquisa: 5 ângulos, verificação anti-confundidor (2026-06-18).

---

## 1. A hipótese e o veredito em uma tela

> **Hipótese (João):** time com jogo importante de meio de semana (Champions, Europa, Conference, Libertadores, Sudamericana) + jogo da liga **fora** no fim de semana → **under** (poucos gols). Mecanismo: fadiga + rotação + cautela fora.

| Afirmação | Veredito da pesquisa |
|---|---|
| Fadiga reduz **gols** no jogo seguinte | ⚠️ **Fraco/nulo.** A evidência forte mede **físico e pontos, não gols**. Scoppa (2013): efeito **nulo** sobre gols, exceto descanso ≤3 dias. |
| "Under fora após jogo europeu" | ❌ **Majoritariamente o efeito casa/fora** (visitante já marca ~0,4 gol a menos; hoje ~0,25). O mercado **já precifica** isso. |
| "Hangover de pontos" no jogo seguinte | ❌ **Refutado** (Kitman, 61 mil jogos): dissolve em mando + força do adversário. Um estudo achou o **oposto** (mais gols pós-Europa). |
| Rotação de elenco pós-Europa | ✅ **Real** (alas/atacantes são os mais poupados) — mas rotação pode tanto *baixar* o ataque quanto *abrir* a defesa (over). Direção **ambígua**. |
| Viagem/altitude (Conmebol) | ⚠️ Viagem e altitude são **reais e grandes**, mas a altitude afeta o jogo *na* altitude; controlando força do time, a **distância** vira não-significativa na era moderna. Promissor, **não comprovado**. |
| "Casas subprecificam o under" | ❌ **Especulativo** — sem evidência de mispricing sistemático. |

**Conclusão:** a teoria crua não tem edge porque confunde **"menos pontos" com "menos gols"** e captura o **mando** disfarçado de fadiga. Mas há uma **versão refinada** (§2) que ainda pode valer — e só um **backtest pareado** (§4) decide.

---

## 2. O sinal que sobrevive (versão refinada e apostável)

Empilhe **todas** as condições abaixo — quanto mais presentes, mais forte o sinal:

| Condição | Por quê |
|---|---|
| **Descanso ≤3 dias** (quinta→domingo, quarta→sábado) | É a **única janela** com efeito sobre gols na evidência forte (Scoppa 2013). Com 4+ dias, o efeito some. |
| **Mercado = team-total do lado ressacado**, não total da partida | Isola o canal "o time cansado marca menos" do ruído do adversário e do mando. |
| **Elenco curto / pouca profundidade** | Em elenco profundo (elite) o efeito é **quase nulo** — rodam mantendo qualidade. |
| **Adversário descansado** (sem jogo no meio de semana) | O efeito é maximizado quando **só um** lado está cansado. |
| **Conmebol com viagem longa e/ou altitude** | Mecanismo físico maior **e** mercado BR menos eficiente — o ângulo mais promissor (a calibrar). |

> **Regra de ouro:** o pick só faz sentido se o under estiver **acima do baseline do próprio time jogando fora SEM jogo de meio de semana** — não acima da média da liga. Se o under só aparece porque é jogo fora, **não há edge** (o mercado já embute o mando).

### 2.1 Altitude (Conmebol) — o sinal ambiental mais forte e o mais subestimado

Diferente da fadiga (efeito fraco sobre gols), a **altitude** tem efeito causal **grande e confirmado**, controlando a força dos times — e é o lado mais promissor do teu ângulo Conmebol:

| Sinal | Evidência | Direção do pick | Força |
|---|---|---|---|
| **Diferença de altitude mandante–visitante** | McSharry (BMJ, 1.460 jogos sul-americanos): prob. de vitória do mandante sobe de **0,54** (mesma altitude) para **0,83** com +3.695 m; cada 1.000 m de diferença ≈ **+0,5 gol** de margem | ↑ **mandante** / handicap a favor da casa | **Forte** |
| **Queda do visitante após ~60 min** | Visitante de baixa altitude perde corridas de alta intensidade na 2ª etapa em Quito (~2.850 m)/La Paz (~3.640 m)/El Alto (~4.150 m) | ↑ **under do visitante** / gols tardios contra | Moderada |
| **Fusos cruzados + altitude (qualificatórias)** | Pollard & Armatas: altitude e fusos horários são fatores significativos do mando (HA ~62%) | reforça mando em jogo de altitude pós-viagem | Moderada |

> **Atenção:** a altitude afeta sobretudo o jogo **na** altitude (continental), não necessariamente o jogo doméstico dias depois. Como sinal do Brasileirão, vale **mais** quando o visitante acabou de jogar **em altitude** no meio de semana. Os casos de maior edge são jogos da Conmebol em La Paz/El Alto/Quito com visitante litorâneo — e o mercado costuma subprecificar isso.

---

## 3. O que NÃO fazer (os confundidores que matam o edge)

1. **Mando de campo.** Jogo fora já é under por baseline. **Sempre** comparar contra o mesmo time fora sem congestionamento.
2. **Seleção de times fortes.** Só time bom joga competição continental → amostra enviesada para times de ataque forte. Normalizar por força (Elo).
3. **"Menos pontos = menos gols".** Salto inválido. Time cansado pode tomar gol (over). Medir **gols**, não resultado.
4. **Rotação ≠ fadiga.** Menos gols pode ser escalação reserva deliberada — e reserva também defende pior (over). Direção ambígua.
5. **Amostra anedótica.** "Tottenham 33% pós-Europa" = 6 jogos. Ruído. Exigir amostra grande e grupo de controle.
6. **Regressão à média.** Os "9–14 pontos a menos" da Opta são de **temporada inteira**, não do jogo seguinte.

---

## 4. Como validar (especificação de backtest)

O único jeito de transformar a hipótese em número. Sem isto, entra como sinal **qualitativo de baixíssimo peso**.

1. **Variável de tratamento:** marcar jogos da liga em que o time jogou competição continental no meio de semana anterior, com **tag de competição** e **dias de descanso** dos **dois** times. Fonte: API-Football / FBref / Transfermarkt (calendário com competição).
2. **Variável de exposição (Conmebol):** distância de viagem (haversine entre estádios) e altitude do jogo continental. Fonte: coordenadas/altitude de estádios.
3. **Desfecho:** gols totais **e** gols do time ressacado **e** xG (separar "jogo travado" de "azar"). Fonte: FBref/Understat.
4. **Grupo de controle pareado:** o **mesmo time jogando fora SEM** jogo de meio de semana, contra adversário de força (Elo) similar. **Não** comparar com a média da liga.
5. **Edge real, não frequência:** comparar contra a **odd de fechamento** (CLV). Fonte: football-data.co.uk / OddsPortal / Pinnacle. Frequência alta de under ≠ valor se a linha já paga pouco.
6. **Cortes:** estratificar por janela de descanso (2/3/4+ dias), profundidade de elenco, mando do adversário, Conmebol vs Europa.

---

## 5. Fontes de dados

| Fonte | O que dá | Custo | Cobertura |
|---|---|---|---|
| **API-Football** | Fixtures com competição + datas (dias de descanso), mando, gols, escalações (rotação), odds | Free 100 req/dia; pago | BR + Conmebol + Europa |
| **FBref / StatsBomb** | Calendário com competição, gols, **xG**, minutos (rotação real) | Grátis (scraping) | Big-5, Brasileirão, Conmebol limitada |
| **football-data.co.uk** | Resultados + **odds de fechamento** (over/under, AH) — backtest direto | Grátis | Europa forte; BR/Conmebol irregular |
| **Understat** | xG por jogo (separar jogo travado de variância) | Grátis | Top-5 europeias |
| **OddsPortal** | Histórico de odds O/U para medir CLV (inclui Brasileirão) | Grátis (scraping) | Global, inclui Conmebol |
| **Coordenadas/altitude de estádios** | Distância de viagem + altitude (exposição Conmebol) | Grátis | Conmebol |

---

## 6. Como aplicar no pick (até calibrar)

1. **Detectar** o gatilho: time jogou continental ≤3 dias antes, joga **fora**, adversário descansado, elenco curto.
2. **Direção:** leve viés a **under do team-total do time ressacado** (não under total cru).
3. **Peso:** **baixo** e explícito — enquanto não houver backtest (§4), é heurística qualitativa, nunca driver de pick.
4. **Explicar** (LLM): *"leve under nos gols do [time]: jogou a Libertadores na quarta (viagem longa + altitude), visita no domingo com elenco curto e adversário descansado — sinal fraco, não calibrado."*

> **Não dupla-contar com o mercado.** O efeito casa/fora **já está na linha**. Só há valor se o sinal de fadiga **superar** o baseline de jogo-fora do próprio time — e em **nicho** (Conmebol, elenco curto, ligas menos líquidas).

---

## Decisões em aberto

1. **Rodar o backtest da §4** — é o que decide se a regra entra no modelo ou é arquivada. `[A confirmar]`
2. **Limiar de janela** de descanso (2 vs 3 dias) e de altitude (>2.500 m?) que ativam o sinal. `[A confirmar]`
3. **Peso** relativo vs mando, rivalidade e forma. `[A confirmar]`
4. **Conmebol primeiro?** O ângulo BR é o mais promissor e o mais alinhado ao go-to-market — priorizar a coleta de viagem/altitude. `[A confirmar]`

---

## Referências

- Scoppa (2013/2015), [*Fatigue and Team Performance in Soccer*](https://newsroom.iza.org/en/archive/research/new-evidence-from-soccer-tournaments-three-days-of-rest-are-enough/) (IZA DP 7519) — efeito nulo sobre gols exceto ≤3 dias.
- Julian, Page & Harper (2020), [*Effect of Fixture Congestion on Performance* (meta-análise)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/) — sem efeito técnico/distância total.
- Kitman Labs / Verheijen, [*20-Year Study on Midweek European Matches*](https://www.kitmanlabs.com/blog/verheijen-20-year-study/) — hangover de pontos dissolve em mando/força.
- [*Comparing UCL/UEL Team Performances in Subsequent League Matches*](https://www.researchgate.net/publication/360188604) — achou **mais** gols pós-Europa.
- McSharry (2007, BMJ) — efeito causal de **altitude** controlando força do time.
- [Home advantage (Wikipedia)](https://en.wikipedia.org/wiki/Home_advantage) — visitante marca ~0,4 gol a menos.
- Pinnacle — [*Does a Europa League hangover exist?*](https://www.pinnacle.com/en/betting-articles/Soccer/does-a-europa-league-hangover-exist/N9PJ5XNCKF9F64LP) (amostra pequena, observacional).
