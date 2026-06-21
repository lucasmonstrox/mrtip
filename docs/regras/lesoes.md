# Regra de prognóstico — Lesões e desfalques

> Como **lesões, suspensões e desfalques** entram na pipeline do mrtip. É dimensão central do [overview](../visao-geral.md#6-como-a-ia-entende-um-jogo). O impacto é real e mensurável, mas **assimétrico por posição** e fortemente dependente do **timing** da notícia.

- **Status:** rascunho inicial (v0) — investigado.
- **Última atualização:** 2026-06-18
- **Mercado-alvo:** 1X2, handicap asiático e **over/under** (a direção depende da posição do desfalcado).

---

## 1. Por que desfalques importam

Cada **~1,5 jogador-chave a mais indisponível ≈ -1 ponto** na tabela (Bundesliga, 7 temporadas). Mas o efeito sobre **gols** depende de **quem** falta: tirar o artilheiro derruba os gols do time (under); tirar o zagueiro/goleiro líder aumenta os gols sofridos (over). E o grande edge é de **timing** — desfalque confirmado dias antes já está na linha; o valor está na **janela pós-escalação** e na **suspensão previsível**.

> **Regra-base:** não trate "desfalque" como sinal único de under. **Separe por posição:** atacante/criador fora → under do time; zagueiro/goleiro fora → over/gols sofridos.

---

## 2. Sinais e heurísticas

| Sinal | Evidência | Efeito | Direção do pick | Força |
|---|---|---|---|---|
| **Volume de lesionados** | ~1,45-1,52 lesionados a mais = -1 ponto; ~1,62/jogo = -1 posição (Bundesliga) | Queda de rendimento mensurável | ↓ força no 1X2/AH | **Forte** |
| **Atacante/criador fora** | Mercados de total são sensíveis a desfalque ofensivo | Menos gols marcados pelo time | ↓ **under do time** / enfraquece no AH | Moderada |
| **Zagueiro líder / goleiro fora** | Spread melhor vs pior goleiro PL 23/24 ≈ **17 gols** (PSxG-GA) | Mais gols sofridos | ↑ **over** / gols do adversário | Moderada (forte p/ goleiro) |
| **Goleiro reserva fraco** | É o desfalque mais **subprecificado** | Vários gols extras sofridos | ↑ gols do adversário / handicap contra | Moderada |
| **Suspensão por cartões** | Regra determinística (ex.: 5 amarelos = gancho na PL); lista pública "na bica" | Desfalque **100% previsível** | antecipar **antes** do mercado | **Forte** |
| **Profundidade de elenco** | Ausência de peça substituível ≈ impacto **nulo** | Modula tudo acima | filtrar peças realmente importantes | Moderada |

> ⚠️ A direção "atacante→under, zagueiro→over" é **qualitativa sólida, números frágeis** (circulam em blogs de apostas, sem base peer-reviewed). Use como direção, não como magnitude cravada. E lembre: é efeito **por time** — o total da partida é a soma dos dois ataques esperados.

---

## 3. Timing: onde está o edge

Há **três camadas** de sinal, e o valor está na mais fresca:

1. **Disponibilidade estrutural** (lesões/suspensões de médio prazo) — já precificada em ligas líquidas. **Sem edge** apostar contra o time desfalcado quando a notícia é antiga.
2. **Escalação provável** (predicted lineups, ~horas antes) — Sportmonks reporta ~84-88% de acerto nas grandes ligas europeias; confiável **só com vazamento crível**. Valor quando a provável **diverge do consenso** (titular poupado).
3. **Escalação confirmada** (~1h antes; 75 min no app da PL, ~1h no Brasileirão) e **notícia de última hora** — **a janela de ouro**: a casa leva minutos para reprecificar quem joga.

> **Suspensão por cartão é o desfalque mais previsível de todos** — montar alerta de "na bica do gancho" e precificar o desfalque **antes** da rodada é edge limpo.

---

## 4. Como aplicar no pick

1. **Classificar** os desfalques por posição e importância (valor de mercado/minutos, não só nome).
2. **Direcionar:** atacante/criador → under do time + lado oposto no AH; zagueiro/goleiro → over + gols do adversário.
3. **Goleiro reserva:** estimar gols extras sofridos via **PSxG-GA** (FBref) e jogar gols do adversário/handicap contra.
4. **Suspensão:** antecipar o gancho da próxima rodada.
5. **Magnitude p/ o modelo:** ~1,5 peça-chave ≈ -1 ponto esperado; ponderar por profundidade de elenco (substituível ≈ nulo).
6. **Explicar** (LLM): *"over reforçado: goleiro titular fora, reserva com PSxG-GA negativo; atacante do mandante volta de suspensão."*

> **Onde o mercado já precifica:** desfalque conhecido dias antes em liga líquida — sem valor. **Onde sobra:** goleiro reserva (subprecificado), suspensão antecipável, e a janela pós-escalação/última hora.

---

## 5. Fontes de dados

| Fonte | O que dá | Custo | Cobertura |
|---|---|---|---|
| **API-Football** | `/injuries` (lesões+suspensões, filtro por fixture), lineups confirmados | Free 100 req/dia; pago | 1.200+ comps — **checar flag `coverage.injuries` por liga** |
| **Sportmonks** | Entidade `sidelined` (lesão/suspensão com datas) + **predicted/expected lineups** (~84-88%) | Pago (Expected ~€199/mês) | 2.500+ ligas; acurácia documentada só p/ Europa |
| **FBref** | **PSxG-GA** (gols evitados pelo goleiro), xG/xA por jogador, minutos | Grátis (scraping) | Top-5 + outras |
| **Transfermarkt** (`sperrenausfaelle`) | Lesionados, suspensos e **em risco de gancho** por acúmulo; valor de mercado | Grátis (scraping); worldfootballR `tm_get_suspensions()` | Ampla, incl. Brasileirão |
| **Premier Injuries** | Base especialista de lesões da PL desde 2010 | Assinatura | **PL apenas** |
| **Imprensa BR** (ge.globo, UOL, Lance) | Provável/confirmada do Brasileirão (supre a lacuna das APIs) | Grátis (monitorar) | Brasileirão (não estruturado) |

---

## 6. Limitações e cuidados

- **Cobertura BR é fraca.** APIs internacionais têm dados de lesão rasos/instáveis no Brasileirão — depender de **imprensa + Transfermarkt** (suspensões) e tratar a "provável" BR com mais desconto de confiança que a europeia. Sempre checar `coverage.injuries`.
- **Profundidade de elenco modula tudo.** Time grande com banco forte absorve desfalque; peça substituível ≈ impacto nulo. Não superdimensionar.
- **Magnitudes por posição são frágeis** (blogs, não estudos) — direção sim, número não.
- **Janela de valor é curta** (minutos após a notícia) — exige pipeline rápido de ingestão de escalação, senão o edge já evaporou.
- **Associação, não causalidade.** Os dados de lesão→pontos vêm de fontes midiáticas e são observacionais.

---

## Decisões em aberto

1. **Pipeline de escalação em tempo real** (provável + confirmada) e latência alvo — é onde mora o edge. `[A confirmar]`
2. **Magnitude por posição** a calibrar com dados próprios (atacante/zagueiro/goleiro). `[A confirmar]`
3. **Alerta de suspensão** ("na bica do gancho") por liga — entra no MVP? `[A confirmar]`
4. **Fonte BR de lesões** confiável (imprensa estruturada vs API paga). `[A confirmar]`

---

## Referências

- [*Monetising misfortune* (BMJ Open Sport & Exercise Med)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12207164/) — ~1,5 lesionado = -1 ponto.
- [GiveMeSport — PL goalkeepers by goals prevented (PSxG-GA)](https://www.givemesport.com/premier-league-goalkeeper-ranked-expected-goals/) — spread ~17 gols.
- [Premier League — suspensões / "on the brink"](https://www.premierleague.com/en/news/2801986).
- [*Impact of international call-ups*](https://pmc.ncbi.nlm.nih.gov/articles/PMC12872852/) — profundidade modula o impacto.
- [API-Football `/injuries`](https://www.api-football.com/documentation-v3) · [Sportmonks sidelined/expected lineups](https://www.sportmonks.com/glossary/injuries-and-suspensions/) · [worldfootballR](https://jaseziv.github.io/worldfootballR/articles/extract-transfermarkt-data.html).
