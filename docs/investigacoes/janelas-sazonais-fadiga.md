# Investigação — Janelas sazonais de fadiga (SIN-020)

> Quais **épocas do ano** acumulam fadiga (volta de férias/pré-temporada, festas/Boxing Day, reta final, parões internacionais) e como isso vira sinal apostável. Eixo **MACRO-sazonal** — complementa o eixo **MICRO** (congestionamento por-jogo) já cravado em [SIN-008](../regras/calendario-fadiga.md), sem re-litigá-lo.

- **Status:** investigado, **não** calibrado.
- **Data:** 2026-06-28.
- **Método:** arqueologia interna (código + schema) + fan-out web de 6 frentes (ciência da fadiga acumulada · festas · pré-temporada · reta final · parões · mercado) + verificação adversarial de 12 claims load-bearing. Workflow `rs-fadiga-sazonal` (18 subagentes).
- **Liga-alvo:** Premier League (única sincronizada — `apps/api/src/db/schemas/leagues.ts:5`).

---

## 1. TL;DR + recomendação cravada

**O sinal sazonal robusto NÃO é "time cansado faz menos gol".** A meta-análise de congestionamento não acha efeito em distância total nem em técnica (Hedge's G=0,12, p=0,134) e **nenhum** estudo primário mede gols/resultado — "under de festa por fadiga" não tem lastro ([PMC7846542](https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/), `verificado-fetch`, meta-análise 2021). O que é **real e bem documentado** é o efeito sobre **lesão/disponibilidade**, concentrado no **inverno inglês** (festas dez-jan + ausência histórica de winter break): times sem pausa perdem **+303 player-days/temporada** e têm **+2,1 lesões graves**, com pior incidência jan-mar ([Ekstrand BJSM 2019, PubMed 30442720](https://pubmed.ncbi.nlm.nih.gov/30442720/), `verificado-fetch`). Logo a direção apostável é **"mais lesões/desfalques" em clusters de calendário** — que alimenta [SIN-011](../features/sinais/SIN-011-lesoes.md) (desfalques) e o dossiê, **não** um sinal direto de placar.

**Recomendação:** implementar SIN-020 como **modulador de contexto sazonal + risco de disponibilidade**, peso baixo e explícito, **não** como driver de over/under. Em ordem de defensabilidade da evidência:
1. **Flag de janela congestionada → risco de desfalque** (alimenta SIN-011 e o dossiê). Evidência forte (`verificado-fetch`).
2. **Nota de contexto da fase de temporada** no dossiê (início = ferrugem reversível + pico de lesão; reta final = queda de sprint **mas** placar movido por motivação/rotação, não fadiga pura). Qualitativo.
3. **Micro-edge de jet lag assimétrico para leste** (sul-americanos voltando à Europa no 1º jogo pós-parão) — mecanismo `SUPPORTED`, aplicação a resultado de clube **não comprovada** (Perguntas Abertas).

**Rejeitado como driver:** "under no período de festas", "over por defesas cansadas na reta final", "fade o time grande pós-parão", "fade the tired team no Natal". Todos folclore ou confundidos (§7).

---

## 2. Contexto e problema

Pedido do João: investigar fadiga de jogador e **quais épocas do ano** os jogadores ficam mais fadigados (volta de férias, perto do Natal, reta final). SIN-008 já cravou o eixo **micro** (jogo continental no meio de semana → under fora), e refutou "fadiga reduz gols" salvo descanso ≤3 dias. Esta investigação ataca o eixo **macro-sazonal** — janelas do calendário anual, não turnaround de um jogo específico.

**Requisitos implícitos assumidos:** regulação BR (sem promessa de ganho, jogo responsável); todo pick mostra o porquê + fontes; separação quant/LLM; peso baixo até backtest. **Brief:** respondido = janelas nomeadas com evidência fetchada, efeito direcional triangulado, veredito sobre gap de dados.

---

## 3. Estado real no código

| Capacidade | Estado | Âncora | Veredito |
|---|---|---|---|
| Data + horário do jogo | **real** | `match.date` (yyyy-MM-dd) + `match.time` (`leagues.ts:46-47`) | Permite computar **dias de descanso** por time e **fase de temporada** (mês). |
| Rodada | **real** | `match.round` (`leagues.ts:44`) | Proxy de fase (início/meio/fim) por number de rodada. |
| Minutos por jogador/jogo | **real** | `lineupPlayer.minutesPlayed` (type 119, `leagues.ts:171`) | Carga acumulada de minutos é derivável — base de "ACWR caseiro". |
| Lesões/desfalques por jogo | **real** | tabela `injury` + `reason` ("Muscle Injury", `leagues.ts:181-200`) | Proxy direto do sinal forte (lesão muscular em congestionamento). |
| **Histórico multi-temporada** | **gap (fantasma)** | só season 25583 / PL 2025-26 (`leagues.ts:5`, `consts.ts`) | **Sem depth** pra backtest sazonal in-house — bloqueador #1. |
| Tag de competição continental / jogos de meio de semana | **gap** | só PL sincronizada | Mesma lacuna que SIN-008 já anota; sem isso não dá pra cruzar parão/copa. |
| Dias de descanso pré-computados | **fantasma** | nenhuma coluna | Derivável de `match.date` em query, mas não materializado. |

**Conclusão de dados:** o schema **suporta** detectar fase de temporada e dias de descanso a partir do que já existe, mas a falta de **histórico multi-temporada** impede qualquer backtest próprio hoje. O sinal de lesão é detectável (`injury`), mas precisa de séries históricas pra virar número.

---

## 4. Estado da arte / mercado — por janela

> Padrão que atravessa **todas** as janelas: o desempenho físico/técnico **em campo** é majoritariamente **preservado**; o que muda é a **taxa de lesão**. Isso alinha com o cravado do SIN-008 (fadiga não derruba o jogo, derruba a disponibilidade).

### 4.1 Mecanismo de base (ciência)
- Congestionamento (≤4 dias entre jogos) **eleva incidência de lesão em partida**: Dupont 97,7 vs 19,3 lesões/1000h; Dellal 43,3 vs 18,6; 5 de 8 estudos significativos — mas **afastamento mais curto** (lesões leves/musculares) ([revisão sistemática Page 2022, PMC9758680](https://pmc.ncbi.nlm.nih.gov/articles/PMC9758680/), `verificado-fetch`).
- Jogar 2x/semana eleva a taxa de lesão **~6x** (25,6 vs 4,1/1000h) **sem** afetar distância/sprints ([Dupont 2010, PubMed 20400751](https://pubmed.ncbi.nlm.nih.gov/20400751/), `verificado-fetch`).
- **Gatilho mecanístico = spike de carga (ACWR):** ACWR >2,0 sobre crônica baixa = **5-7x** mais lesão sem contato na EPL ([Bowen 2019, BJSM, PMC7285788](https://pmc.ncbi.nlm.nih.gov/articles/PMC7285788/), `verificado-fetch`). Ressalva: ACWR no limiar genérico 1,5 **não** prediz bem — só spikes extremos (§7).

### 4.2 Volta de férias / pré-temporada / início
- **"Ferrugem" é real mas reversível:** ~2 semanas de pausa derrubam capacidade aeróbica/sprint repetido (Yo-Yo IR2 ~-22%), velocidade pura preservada, recupera em 2-3 semanas ([PMC5944970](https://pmc.ncbi.nlm.nih.gov/articles/PMC5944970/), `verificado-fetch`, 2018).
- **Gols no início NÃO diferem:** 5 primeiras rodadas = 50,9% dos gols vs 49,1% nas 5 últimas pré-meio em ligas top ([PMC10908095](https://pmc.ncbi.nlm.nih.gov/articles/PMC10908095/), `verificado-fetch`, 2024). **Não** apostar over/under por "início de temporada".
- **Pico de lesão real no início:** GW1-4 acima da média da temporada na PL ([Analytics FC](https://analyticsfc.co.uk/blog/2023/09/29/change-acclimation-or-load-management-why-is-the-beginning-of-the-season-so-bad-for-injuries/), `verificado-fetch`, vendor); pré-temporada concentra 17% das lesões, overuse/tendão/rectus femoris ([estudo FA, PMC1724575](https://pmc.ncbi.nlm.nih.gov/articles/PMC1724575), `verificado-fetch`).
- **"Tournament hangover" de verão é contextual, não universal:** dissolve em temporada normal; só mordeu na Copa 2022 (nov/dez) por compressão. Mecanismo: quem jogou a Copa **perde o benefício do descanso** que os demais ganham — não ganha um déficit absoluto ([LaLiga, PMC12244402](https://pmc.ncbi.nlm.nih.gov/articles/PMC12244402/), `verificado-fetch`, 2025; [Total Football Analysis](https://totalfootballanalysis.com/article/fact-or-fiction-the-truth-around-international-tournament-induced-slumps-data-analysis-statistics), `verificado-fetch`).

### 4.3 Período de festas (Boxing Day / dez-jan inglês)
- **Densidade real quantificada:** 40 jogos em 15 dias (20 dez–4 jan), todo time joga 4 partidas em ~2 semanas ([Premier League oficial](https://www.premierleague.com/en/news/4450698/seven-key-takeaways-as-202526s-festive-fixtures-are-confirmed), `verificado-fetch`, 2025/26).
- **Inglaterra-sem-pausa é o achado macro mais limpo:** +303 player-days e +2,1 lesões graves/temporada vs ligas com winter break, pior jan-mar ([Ekstrand BJSM 2019](https://pubmed.ncbi.nlm.nih.gov/30442720/), `verificado-fetch`).
- **Paradoxo da pausa:** pausa **curta** (<13 dias, modelo La Liga / break escalonado da PL pós-2019) **não** prejudica; pausa **longa** (Bundesliga 32d) **derruba** a performance no retorno ([McErlain-Naylor 2020](https://www.stuartmcnaylor.com/publication/mj_wbreak/), `verificado-fetch`). Ter pausa não é puro upside.
- **Gols/resultado: nulo.** Zero estudo primário mede gols no congestionamento festivo; dado anedótico aponta o contrário (Boxing Day 2021 = 4,0 gols/jogo, acima da média).

### 4.4 Reta final (abril/maio)
- **Queda física real:** alta intensidade e sprints caem no terço final em 3 estudos independentes (LaLiga, Championship −59% n.º sprints, Bundesliga), **distância total preservada** — é qualidade do esforço, não volume ([PMC11474997](https://pmc.ncbi.nlm.nih.gov/articles/PMC11474997/) · [PMC7739604](https://pmc.ncbi.nlm.nih.gov/articles/PMC7739604/) · [PMC6603920](https://pmc.ncbi.nlm.nih.gov/articles/PMC6603920/), `verificado-fetch`).
- **Gols na reta final: pequeno e movido por motivação, não fadiga.** Últimos 9 jogos da PL: swing de só +0,21 gol/90, concentrado em **Top-2 já resolvido** (sofre +0,28/90) e **16-20 desesperado**; meio de tabela 8-15 quase flat ([Analytics FC](https://analyticsfc.co.uk/blog/2024/05/08/how-teams-perform-in-the-last-nine-games-of-the-season/), `verificado-fetch`, vendor). **Atenção:** a verificação adversarial mostrou que mesmo esse desvio do Top-2 é atribuído pela fonte a **rotação/load management** (não desânimo) — o proxy "posição = motivação" é confundido (§7).
- **Anti-confundidor oficial:** a PL atribui surtos de gols tardios a profundidade de elenco/5 subs e bolas paradas, **explicitamente não** a fadiga; gols/jogo em 2025-26 no menor patamar em 10+ anos ([PL/Opta](https://www.premierleague.com/en/news/4437338/opta-analysis-of-why-more-late-goals-are-being-scored-in-2025-26-premier-league-season), `verificado-fetch`).

### 4.5 Parões internacionais
- **"Hangover" de performance é fraco/confundido:** estudo de 522 jogos top-5 acha só diferenças "modestas", **gols estáveis** (p>0,05) ([Frontiers 2026, PMC12872852](https://pmc.ncbi.nlm.nih.gov/articles/PMC12872852/), `verificado-fetch`).
- **Lesão NÃO sobe pós-parão:** incidência 2022/23 igual a temporadas normais (RR 0,98); só 6% dos convocados à Copa se lesionaram no torneio ([UEFA Elite Club Injury Study, PMC12406901](https://pmc.ncbi.nlm.nih.gov/articles/PMC12406901/), `verificado-fetch`).
- **Único sinal mecanicamente sólido: jet lag assimétrico para leste.** Recuperação ~1-1,5 dia/fuso a leste vs ~0,5 a oeste; o relógio biológico (>24h) resiste a encurtar o dia ([revisão PMC13030464](https://pmc.ncbi.nlm.nih.gov/articles/PMC13030464/) · [PMC3435929](https://pmc.ncbi.nlm.nih.gov/articles/PMC3435929/), `verificado-fetch`). Sul-América (UTC-3) → Europa é trajeto **leste**, cai antes do 1º jogo do clube. Analogia NBA: jet lag leste no mandante = -6% win ([PMC9245584](https://pmc.ncbi.nlm.nih.gov/articles/PMC9245584/), `verificado-fetch`). **Mas** SA→Europa são só ~3-5 fusos (efeito modesto) e a aplicação a resultado de clube **não foi testada** — fica como hipótese, não edge comprovado.
- **Mapa das janelas:** ~5 janelas FIFA/ano; em temporada europeia caem set, out, nov, mar. A partir de 2026 a FIFA funde set+out num bloco único de ~16 dias ([Wikipedia/FIFA calendar](https://en.wikipedia.org/wiki/FIFA_International_Match_Calendar), `verificado-fetch`).

### 4.6 Mercado de apostas
- **"Fade the tired team" e "festivo = menos gols" são majoritariamente folclore.** Não há fonte que isole um edge sazonal **sobrevivente ao closing line value (CLV)** — odds de fechamento no futebol são eficientes; folga aparece em **linhas de abertura** e jogos de meio de semana (menos liquidez), não numa "janela festiva".
- O único dado de mercado direto (Pinnacle: elite venceu 37/49 jogos de Natal 2x-em-48h vs ~30 esperados) **não pôde ser verificado** (Pinnacle bloqueia fetch, HTTP 403; sem snapshot) → veredito **NEI**, e ainda assim é backtest hand-picked de n=49 sobre 5 clubes a dedo, sem out-of-sample (§7).
- **Cartões em jogos cansados: sem suporte empírico** — a literatura liga cartões a disputa de classificação e VAR, não a fadiga sazonal.

---

## 5. Matriz de trade-offs — como usar SIN-020

| Uso candidato | Evidência | Direção | Defensabilidade | Veredito |
|---|---|---|---|---|
| **Janela congestionada → risco de desfalque** (alimenta SIN-011/dossiê) | Forte (`verificado-fetch`, múltiplos primários) | mais lesões/desfalques | Alta — mecanismo robusto e dado interno (`injury`) existe | **Implementar** (peso explícito) |
| **Nota de contexto da fase** (início/festas/reta final) no dossiê | Mista (físico real, placar nulo) | qualitativa | Média — honesto sobre o que não move placar | **Implementar** como contexto LLM, nunca driver |
| **Jet lag leste, sul-americanos, 1º jogo pós-parão** | Mecanismo `SUPPORTED`, aplicação aberta | under/queda no 1º jogo de volta | Baixa — extrapolação não testada em clube | **Backlog** — só após backtest |
| Under no período de festas | Refutada | — | Nula | **Rejeitar** |
| Over por defesas cansadas na reta final | Refutada (motivação/rotação, não fadiga) | — | Nula | **Rejeitar** |
| Fade o favorito pós-parão / no Natal | Refutada / NEI | — | Nula | **Rejeitar** |

**Recomendação (com o porquê):** o canal **fadiga → lesão → desfalque → força de elenco no jogo** é o único com evidência forte e dado interno disponível. Ele não é um sinal de gols novo — é um **input de qualidade de escalação** que SIN-011 já modela; SIN-020 contribui o **gatilho temporal** (em que janelas o risco de desfalque sobe). O counter-review reforçou: qualquer tentativa de virar isso em over/under direto morre no confundidor (motivação, rotação, mando, eficiência de mercado).

---

## 6. Modelo de dados proposto

Tudo derivável do schema atual **assim que houver histórico multi-temporada**:
- **`days_rest`** por time por jogo: `match.date` atual − `match.date` do jogo anterior do mesmo time (window function). Não precisa de coluna nova pra MVP (computar on-the-fly).
- **`season_phase`**: derivar de `match.round` (início ≤4 / meio / reta final ≥30) e do mês de `match.date` (festas = 20 dez–4 jan; parão = janelas FIFA).
- **Carga de minutos acumulada** por jogador: soma rolante de `lineupPlayer.minutesPlayed` (proxy de ACWR sem GPS).
- **Risco de desfalque sazonal**: cruzar janela congestionada × histórico de `injury.reason` muscular.

**Bloqueador:** ingestão de **N temporadas** da PL (e idealmente tag de competição/parão) — sem isso, SIN-020 fica qualitativo. Mesma dependência de dados que SIN-008.

---

## 7. Refutado (com a evidência que matou)

1. **"Congestionamento derruba o desempenho em campo (menos distância/técnica → menos produção)."** — Meta-análise sem efeito significativo em distância total (p=0,134) nem técnica; só alta intensidade cai 7-14% e isso não vira métrica de gol ([PMC7846542](https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/)).
2. **"Fadiga se acumula monotonicamente; time fica mensuravelmente mais cansado no fim."** — Fadiga subjetiva física/mental **não** muda do início ao fim na EPL no nível de grupo (p>0,05); domina variabilidade individual ([PMC12244382](https://pmc.ncbi.nlm.nih.gov/articles/PMC12244382/), `verificado-fetch`).
3. **"Primeiras rodadas têm padrão de gols distinto."** — Distribuição praticamente idêntica (50,9% vs 49,1%); efeito de calor só em ligas do Golfo ([PMC10908095](https://pmc.ncbi.nlm.nih.gov/articles/PMC10908095/)).
4. **"Tournament hangover de verão é universal."** — Some em calendário normal; só aparece sob compressão (Copa 2022) ([Total Football Analysis](https://totalfootballanalysis.com/article/fact-or-fiction-the-truth-around-international-tournament-induced-slumps-data-analysis-statistics)).
5. **"Lesões disparam por causa do parão internacional em si."** — UEFA Elite Club Injury Study não detecta mudança material; o aumento na mídia é congestão de calendário geral ([PMC12406901](https://pmc.ncbi.nlm.nih.gov/articles/PMC12406901/)).
6. **"ACWR >1,5 é preditor universal de lesão."** — Dissociação documentada; risco forte só em spikes >2,0 sobre crônica baixa ([Frontiers 2020](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2020.00075/full)).
7. **Proxy "posição = motivação" para separar fadiga de motivação na reta final.** — `REFUTED` na verificação adversarial: a própria fonte atribui o desvio do Top-2 a **rotação/load management/prioridade de copas (~20% mais rotação)**, não a desânimo; e a premissa "fadiga atinge todos igualmente" é contradita (times de cima têm a pior deterioração defensiva). Parte da evidência alegada (LaLiga/Bundesliga "não condicionam posição") **não existe na fonte** ([Analytics FC](https://analyticsfc.co.uk/blog/2024/05/08/how-teams-perform-in-the-last-nine-games-of-the-season/)).

---

## 8. Perguntas Abertas / lacunas

- **Sem fonte isolando edge sazonal que sobreviva ao CLV.** A ciência documenta risco fisiológico; nenhuma fonte confiável mostra (in)eficiência de mercado precificável por janela. Buscas voltaram vazias — registrado, não inventado.
- **Pinnacle "elite 37/49 no Natal" não verificável** (403, sem snapshot) → `NEI`. É backtest hand-picked, n pequeno, sem out-of-sample. Não usar como load-bearing.
- **JAOAO 2025 "Copa de inverno aumentou lesão muscular na PL" → `NEI`**: usa contagens brutas sem ajuste por exposição (total de lesões até **caiu**); o padrão-ouro (UEFA, ajustado) **contradiz** (RR 0,98). Efeito contestado.
- **Jet lag aplicado a resultado de clube não testado** — mecanismo cronobiológico `SUPPORTED`, mas o salto pra placar no 1º jogo pós-parão é extrapolação. SA→Europa são só 3-5 fusos (efeito modesto vs estudos de 7-11 fusos).
- **Sem série de gols/jogo por mês da PL** rastreável a Opta desagregada nesta sessão — achados de "últimos 9 jogos" são proxy de janela, não mês-calendário.
- **Bloqueador de dados interno:** só 1 temporada sincronizada → nenhum backtest sazonal próprio possível hoje.

---

## 9. Plano por faceta (rascunho, pré-`/pl`)

- **dados:** ingerir N temporadas da PL; materializar `days_rest` e `season_phase` (deriváveis de `match.date`/`round`); somar `minutesPlayed` rolante por jogador.
- **ia:** módulo que, dado a janela (festas/parão/reta final) + dias de descanso + histórico de lesão muscular, emite **risco de desfalque** (entra em SIN-011) e uma **nota de contexto** explicável; peso baixo, nunca driver de over/under.
- **(sem api/ui dedicadas até calibrar.)**

---

## 10. Evidências decisivas

- [Ekstrand BJSM 2019, PubMed 30442720](https://pubmed.ncbi.nlm.nih.gov/30442720/) — sem winter break = +303 player-days e +2,1 lesões graves/temporada, pior jan-mar. Âncora do sinal de inverno inglês.
- [Page 2022, revisão sistemática, PMC9758680](https://pmc.ncbi.nlm.nih.gov/articles/PMC9758680/) — congestionamento eleva lesão em jogo (5/8 estudos), afastamento mais curto.
- [Bowen 2019, BJSM, PMC7285788](https://pmc.ncbi.nlm.nih.gov/articles/PMC7285788/) — spike de ACWR >2,0 = 5-7x lesão na EPL (gatilho mecanístico).
- [Meta-análise congestionamento, PMC7846542](https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/) — **prova o nulo**: sem efeito em distância/técnica; mata o "under por fadiga".
- [Kiely, fadiga subjetiva EPL, PMC12244382](https://pmc.ncbi.nlm.nih.gov/articles/PMC12244382/) — fadiga não acumula monotonicamente; mata o "time cansado no fim".
- [Analytics FC — últimos 9 jogos](https://analyticsfc.co.uk/blog/2024/05/08/how-teams-perform-in-the-last-nine-games-of-the-season/) — swing de gols na reta final é motivação/rotação, não fadiga.
- [UEFA Elite Club Injury Study, PMC12406901](https://pmc.ncbi.nlm.nih.gov/articles/PMC12406901/) — lesão não sobe pós-parão/Copa de inverno; refuta o hangover de lesão.
