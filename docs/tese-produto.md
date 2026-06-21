# Tese de produto — onde está o valor e por onde começar

> Síntese estratégica destilada das investigações desta fase (`docs/regras/`, `docs/investigacoes/`, `docs/research/`). Não re-deriva — **fundamenta decisões**. Complementa a [visão](./visao-geral.md) (o "porquê/para quem") com o **"onde está o edge e em que ordem atacar"**. As-of: **2026-06-18**.

## A tese em uma frase

**O produto vencedor não é "mais uma IA de palpite" — é o mais HONESTO e AUDITÁVEL de um mercado saturado de hype, focado em NICHO + BRASIL, onde o EV+ de fato existe.**

---

## 1. Onde o valor mora (e onde NÃO mora)

Cinco investigações independentes (rivalidade, árbitro, mercado-odds, escanteios, concorrentes) convergiram no mesmo ponto:

- ❌ **NÃO mora** no **1X2 / over-2.5 das ligas grandes** — ali a *closing line* sharp (Pinnacle/Betfair) já é quase perfeitamente calibrada e **comeu o valor**. É o cenário **mais eficiente** do mercado.
- ✅ **Mora** em **mercados de nicho** (cartões, escanteios, team-totals) e **ligas de baixa liquidez/cobertura** (Brasileirão, Conmebol), onde a linha soft ajusta de forma grosseira.

> **Tensão com a visão (decisão #9):** o MVP sugerido — 1X2 + over-2.5 na Premier League — aponta justo para o mercado mais eficiente. A evidência empurra para **cartões/escanteios e/ou Brasileirão**. Decisão de produto a cravar.

## 2. Honestidade = fosso competitivo **e** conformidade (a jogada dupla)

Dois ângulos opostos bateram no mesmo lugar:
- **Concorrência** ([panorama](./research/panorama-concorrentes.md)): o mercado é saturado de "90% de acerto / IA" inflado e opaco; quase ninguém mostra **calibração + CLV + perdas**. Honestidade auditável é o diferencial não-comoditizado.
- **Regulação** ([regulação BR](./investigacoes/regulacao-br-apostas-produto.md), COMP-001): a Lei 14.790 **proíbe** prometer ganho/renda/investimento — você é **obrigado** a falar "probabilidade + risco".

**→ Uma decisão resolve os dois:** enquadrar tudo como **probabilidade calibrada + risco explícito**, com **CLV** como métrica de confiança e **jogo responsável como produto** (não rodapé). Raro: o diferencial competitivo e o requisito legal são a mesma coisa.

## 3. Hierarquia de sinais por EV (o que construir primeiro)

| Camada | Sinais | Papel | Prioridade |
|---|---|---|---|
| **Validar** | **SIN-012 mercado/CLV** | Âncora: define se qualquer sinal vira EV+. KPI = CLV. | 🥇 base |
| **Estimar (edge)** | **SIN-009 árbitro** | Maior edge isolado (cartões, ~2×, estável, subprecificado) | 🥇 primeiro a provar |
| Estimar | SIN-011 lesões (goleiro reserva, suspensão), SIN-010 motivação assimétrica, SIN-007 rivalidade (cartões/mando), SIN-013 escanteios | Edges secundários, calibrar por liga | P2 |
| Estimar (ambiental) | SIN-006 clima, SIN-008 calendário/**altitude Conmebol** | Moduladores; altitude é o forte | P3 |
| **Explicar (narrativa)** | SIN-001/002/003/004/005 (intangíveis do jogador) | **Peso zero no quant** — só o LLM narra | — |

**Disciplina inegociável** (taxonomia-sinais): **estimar ≠ explicar**. O quant estima probabilidade calibrada; o LLM explica/orquestra **sem nunca mexer no número**. Foi isso que mandou os 5 sinais intangíveis pra camada narrativa e mantém o motor limpo.

## 4. O que a verificação adversarial **matou** (não construir)

- "Under em clássico" — mito (é efeito casa/fora).
- "Hangover de pontos pós-Europa" — refutado (dissolve em mando + força do adversário).
- "Favorito sempre tropeça em derby" — sem dado.
- "Aniversário/mood/conflito de vestiário movem resultado" — folclore/endógeno/LGPD.
- "Teoria da ressaca de meio de semana" (João) — **majoritariamente efeito casa/fora**; sobrevive só uma versão estreita (team-total do time ressacado, ≤3 dias, elenco curto, adversário descansado) — e só após backtest vs CLV.

> Saber o que **não** apostar é metade do produto. Cada mito morto é dinheiro não-queimado.

## 5. Implicações de roadmap

1. **Fundação primeiro:** `/i DOS-001` (dossiê) — destrava tudo; já tem plano.
2. **Primeiro edge a provar:** árbitro (SIN-009) em **mercado de cartões** — onde o EV é mais claro e automatizável.
3. **CLV desde o dia 1** (SIN-012) como métrica do histórico auditável — é o diferencial + a prova de honestidade.
4. **BR-nativo:** Brasileirão/Conmebol, BRL em centavos, fuso `America/Sao_Paulo`, **whitelist de casas .bet.br licenciadas**.
5. **Conformidade nativa** (COMP-001): +18, linguagem de probabilidade/risco, jogo responsável como mecanismo.

## 6. Riscos e dependências críticas

- **Odds das casas .bet.br** (risco aberto DOS-001/SIN-012): The Odds API não as cobre; OpticOdds ~US$5k/mês. **Sem odds BR, o CLV não fecha no Brasileirão** — é a dependência nº1, resolver por spike de validação.
- **Regulação móvel** (normas de afiliado em revisão 2026, fiscalização mirando afiliados) — desenhar conservador.
- **Edges são pequenos e por-liga** (corners não transfere; ressaca é frágil) — nada vira peso sem backtest calibrado.

## 7. Mapa de fontes
- Sinais/regras: `docs/regras/*` (clima, rivalidade, calendario-fadiga, **arbitragem**, motivacao, lesoes, **mercado-odds**).
- Investigações: `docs/investigacoes/*` (sinais do jogador, escanteios, **regulação BR**, dossiê, motor, agente).
- Mercado: `docs/research/panorama-concorrentes.md`, `fontes-rivalidade.md`, `sites-futebol-masculino`, `apis-futebol`.
- Arquitetura: `docs/arquitetura/taxonomia-sinais.md` (mapa canônico de sinais).
- Registro: `docs/features/INDEX.md` (19 features).
