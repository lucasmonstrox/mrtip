# Investigação — Hub da Rodada (primeira página / landing logada) · DOS-001 · MOD-002 · SIN-012

> Investigado em 2026-06-28. Orquestrado por workflow de 15 agentes (1 âncora interna → 5 lentes de pesquisa web em paralelo [apostador pré-jogo, workflow de tipster, hubs de concorrentes, apresentação de value/EV, conformidade+engajamento BR] → 8 verificações adversariais → síntese). Fontes web fetchadas nesta sessão; capacidades e gap de dados confirmados contra o schema e os services de `apps/api/src/modules/leagues`.

## TL;DR + recomendação cravada

O **Hub da Rodada** é a landing logada do mrtip — a superfície de **varredura rápida da rodada**: o apostador escaneia todos os jogos de uma vez e enxerga, por confronto, o *dossiê mínimo de decisão*, com cada número trazendo o porquê e a fonte. A intenção FINAL documentada (DOS-001 · MOD-002 · SIN-012) é um **grid denso de value bets ordenados por EV**, com o card "sem valor" como conteúdo de primeira classe.

**A virada de chave da investigação:** o coração documentado do Hub (EV, value bet, no-vig, fair odds, CLV, calibração, proveniência) está **100% bloqueado** — não existe tabela de odds (`match_odds`/`odds_snapshots`), nem motor quant (MOD-001), nem `dossier_snapshot` (DOS-001), nem a porta de dinheiro (`@workspace/core/money`, CORE-001). A v1 **não pode** exibir nenhum EV, probabilidade de resultado, fair odd ou pick sem fabricar dado.

**Recomendação:** construir uma **v1 honesta de contexto da rodada** — previews quant ricos com dado real (tabela, forma, tendências com banda Wilson, desfalques com peso, descanso), explicitamente rotulada "**contexto, não previsão**", sem inventar EV. O scaffolding (shell de conformidade + tokens de terminal + forma do grid e do card) já nasce pronto para receber EV/odds na v2 **sem relayout**. Tudo entregável hoje é descritivo/retrospectivo (o que aconteceu); nada é preditivo (o que vai acontecer) até odds + motor entrarem.

---

## 1. Tese da página

O Hub da Rodada é onde o apostador varre a rodada inteira e, por confronto, lê o dossiê mínimo de decisão com proveniência. Fim documentado: grid de value bets ordenados por EV (DOS-001 · MOD-002 · SIN-012), com o estado "sem valor" tratado como conteúdo de primeira classe (tese anti-cassino). Como odds/quant/dossiê não têm código nem dado ingerido, a v1 entregável é um Hub de **contexto** honesto, com o esqueleto pronto para a v2 preditiva.

---

## 2. Anatomia da página (cima → baixo)

| Seção | O que mostra | Por quê |
|---|---|---|
| **Banner de jogo responsável (sticky)** | Faixa âmbar persistente: +18, risco de dependência, links limites/autoexclusão, rótulo "publicidade" inline. | Obrigatório por Lei 14.790 em toda superfície; é identidade, não rodapé escondido. |
| **Header da rodada** | Liga (só PL 25/26 hoje) + seletor de rodada (← Rodada N →), data-range da rodada, label honesto "última atualização". | Orienta "qual rodada estou vendo". `groupByRound`/`rounds` já entregam. |
| **Barra de filtros / ordenação** | Filtros: mercado, liga, **e o switch "só com valor (EV+)"**. Na v1 o filtro EV+ aparece **desabilitado com tooltip "requer odds — em breve"** (honestidade, não esconder a intenção). Ordenação v1: por horário/dia. | A gramática-fim é ordenar por EV; v1 mostra a moldura sem fingir o dado. |
| **Faixa "Desfalques de peso da rodada"** | Tira horizontal com as 3-5 ausências mais relevantes da rodada inteira (peso = gols/assists na liga até a data, jogos consecutivos fora). | Desfalque é "o fator que destrói mais apostas que qualquer outro"; leitura cross-rodada de "quem falta e quanto importa". |
| **Lista de jogos (o grid)** | Jogos agrupados por dia (Sáb/Dom, date-fns no fuso America/Sao_Paulo); cada jogo é um card de confronto denso (ver §3). Em telas largas, lista densa "uma linha por jogo" expansível. | É o coração escaneável. `apps/web` rola dentro de Radix ScrollArea (virtualização precisa de `customScrollParent`). |
| **Estado "sem valor" / vazio rico** | Quando não há jogos ou (futuramente) nenhum EV+, card de primeira classe: "não apostar também é resultado", com o contexto ainda visível. | Tese central anti-cassino. |
| **Painel lateral (desktop, opcional v1.1)** | Mini-tabela de classificação da rodada (`computeStandings` + zonas) e top-3 marcadores (`scorers`). | Contexto de tabela sem sair do Hub; reusa o que já existe. |

---

## 3. O card de jogo (o coração)

Campos ordenados por importância para a decisão. **v1** = dado existe hoje; **[FUTURO]** = espera ingestão.

1. **[FUTURO] EV% + selo EV+/sem valor** — herói do card, mono/tabular-nums, ordenável. Bloqueado por SIN-012+MOD-001+CORE-001.
2. **[FUTURO] prob calibrada do modelo vs prob no-vig do mercado** — duas barras lado a lado + gap em p.p.; fair odd vs odd ofertada + casa/logo + link. *(verificado-confirmado: no-vig + EV)*
3. **Confronto** — mandante × visitante com slug+logo, horário (date-fns, fuso loja), status (NS/FT/POSTP). **v1.**
4. **Posição na tabela + pontos de cada lado, com gap.** **v1.** (`computeStandings`)
5. **Forma W/D/L últimos 5 (pílulas coloridas)** por lado, com tooltip de contexto (placar/adversário). **v1.** (`computeForm`)
6. **Tendência combinada de gols (over 2.5 / BTTS / clean sheet)** com **banda Wilson 95% + flag lowSample** e split casa/fora. Rotulado "**contexto, não previsão**". **v1.** (`computeTeamTrends` — diferencial real entregável)
7. **Desfalques do jogo** — ausentes com peso (Missing vs Questionable, motivo, gols/assists na liga). **v1, com ressalva**: depende de injuries/lineup ingeridos por partida; pode faltar em jogos futuros. (`loadMatchAbsences`)
8. **Dias de descanso (rest days) de cada lado + diferencial** — date-fns sobre `match.date`. **v1, com ressalva honesta obrigatória**: só PL ingerida → jogo de copa/seleção no meio de semana não aparece, descanso pode estar superestimado.
9. **Splits casa/fora** — mandante em casa vs visitante fora. **v1** (tabela `standing` tem 12 colunas oficiais casa/fora).
10. **[FUTURO] xG criado/concedido + flag over/underperformance** — MOD-002 só investigado, add-on SportMonks (~€29/mês) não assinado.
11. **[FUTURO] H2H compacto** — derivável de `match`, mas sem agregação pronta.
12. **[FUTURO] movimento de linha / steam / RLM** — exige série temporal de odds (SIN-019), inexistente.
13. **[FUTURO] escanteios/cartões médias + projeção** — LIG-003 só ideia, não ingerido.

Drill-down: o card expande/linka para o **Dossiê** (DOS-001) — na v1, linka para a página de jogo/time já existente.

---

## 4. Tabela de priorização

| Elemento | Valor p/ apostador | Esforço | HOJE? | Depende de |
|---|---|---|---|---|
| Shell conformidade (banner GR, +18, disclaimers) | Médio (confiança/legal) | P | **Sim** | Copy jurídica; componentes em packages/ui |
| Seletor de rodada + agrupar por dia | Alto (navegação) | P | **Sim** | rounds/matches, groupByRound |
| Card: confronto + horário + status | Alto (base) | P | **Sim** | serializeMatch |
| Card: posição + pontos + gap | Alto | P | **Sim** | computeStandings |
| Card: forma W/D/L (pílulas) | Alto | P | **Sim** | computeForm |
| Card: tendência over2.5/BTTS/CS + Wilson | **Alto (diferencial honesto)** | M | **Sim** | computeTeamTrends |
| Card: splits casa/fora | Médio-alto | P | **Sim** | tabela standing (oficial) |
| Faixa desfalques de peso | **Alto** | M | **Parcial** | loadMatchAbsences (injuries por jogo) |
| Card: rest days + diferencial | Médio-alto | P | **Sim (c/ ressalva)** | match.date; só PL → fadiga subestima meio de semana |
| Painel lateral: mini-tabela + scorers | Médio | P | **Sim** | standings, scorers |
| Filtro "só EV+" (desabilitado/em breve) | Médio (sinaliza intenção) | P | **Sim (placeholder)** | — |
| **EV% herói + ordenar por EV** | **Altíssimo** | M | **NÃO** | SIN-012 (odds), MOD-001 (motor), CORE-001 (money) |
| **prob modelo vs no-vig + fair odds** | **Altíssimo** | M | **NÃO** | SIN-012 + MOD-001 |
| Stake Kelly fracionado (0,25) | Alto | P | **NÃO** | EV + CORE-001 |
| Selo de confiança por calibração (gate ECE) | Alto (anti-falsa-confiança) | M | **NÃO** | motor + histórico calibração |
| Proveniência por número (clicável → fonte) | **Altíssimo (diferencial)** | G | **NÃO** | dossier_snapshot (DOS-001) |
| Tag de tipo de edge + hipótese causal | Médio-alto | M | **NÃO** | motor + odds |
| xG no card | Alto | M | **NÃO** | MOD-002, add-on SportMonks não assinado |
| H2H compacto | Médio | M | **NÃO** | agregação inexistente (derivável) |
| Movimento de linha / steam / RLM | Médio | G | **NÃO** | série temporal odds (SIN-019) |
| Escanteios/cartões + árbitro | Médio | M | **NÃO** | LIG-003 não ingerido |
| CLV por aposta/agregado | Alto | G | **NÃO** | é a superfície **Histórico**, não o Hub; sem pick/odds de fechamento |
| Votação torcida / leaderboard tipsters | Baixo (engajamento) | M-G | **NÃO** | auth/contas inexistente — **e contraria a sobriedade; ver §7** |

**Gap de dados — sem rodeio:** o coração documentado do Hub (EV, value bet, no-vig, CLV, calibração, proveniência) está **100% bloqueado**. A v1 só usa dado descritivo/retrospectivo (o que aconteceu), nunca preditivo (o que vai acontecer).

---

## 5. MVP vs. depois

**v1 — só com dado atual** (rounds+matches, standings, scorers, form, trends, injuries, lineup/ratings):
- Shell de conformidade (banner GR sticky + disclaimers) — *dia 1, independe de dado*.
- Header + seletor de rodada + agrupamento por dia.
- Grid de cards de confronto: times/logo/horário/status; posição+pontos+gap; forma W/D/L; tendência over/BTTS/clean-sheet com banda Wilson + lowSample; splits casa/fora; rest days (com ressalva).
- Faixa "desfalques de peso" da rodada.
- Painel lateral: mini-classificação + top scorers (v1.1).
- Filtro "só EV+" presente porém desabilitado ("em breve"), e o card **reserva o espaço fixo** do bloco EV/odds/prob — para v2 entrar sem relayout.
- Régua de linguagem: tudo marcado "**contexto da rodada, não previsão de resultado**".

**Depois — espera ingestão:**
- **v2 (desbloqueio SIN-012 + MOD-001 + CORE-001):** odds reais → no-vig, fair odd, prob calibrada vs mercado, **EV% herói**, ordenar por EV, filtro EV+ ativo, stake Kelly 0,25, gate ECE.
- **v2.x:** proveniência por número clicável (DOS-001 / dossier_snapshot), tag de tipo de edge + hipótese causal.
- **v3:** xG no card (MOD-002 + add-on), H2H, movimento de linha/RLM (SIN-019), escanteios/cartões (LIG-003).
- **Superfície separada (não Hub):** CLV/ledger imutável/Histórico (pick carimbado antes do kickoff).

---

## 6. Conformidade (obrigatório BR — Lei 14.790/2023 + Portaria SPA 1.231)

**TEM que ter:**
- Banner de jogo responsável **persistente e sticky** (borda/ícone âmbar) em todas as telas: **+18**, alerta de risco de dependência/perda, links para limites e autoexclusão.
- Seção/link **"Jogo Responsável"** sempre acessível (sinais de alerta, autoteste, canais de apoio).
- **Disclaimer de incerteza junto de cada estimativa**: toda %/tendência exibe a banda/`n` amostral; "estimativa, resultado não garantido". `% de acerto` SEMPRE com `n`.
- Rótulo **"publicidade"** visível inline; links só para casas **.bet.br licenciadas** (whitelist) — relevante na v2 quando odds/links entrarem.
- Microcopy fixo (v2): "**+EV não garante ganhar este jogo**" (variância/amostra).

**NÃO pode ter:**
- Linguagem de **lucro/renda/investimento/ganho garantido/aposta certa/renda extra/solução financeira**. Tips = análise, nunca retorno garantido.
- CTA de urgência ("aposte agora"), contagem regressiva, glow/animação festiva.
- **Verde** como cor de CTA ou de conformidade — verde = SÓ EV+/positivo. Cyan = marca/CTA. Âmbar = aviso. Vermelho = perda. Cor **nunca** comunica sozinha (sempre número +/− + ícone + texto).
- Esconder/recalcular CLV ou perdas — perdas sempre visíveis, CLV cru com sinal.

**Nota de escopo:** o mrtip é produto **editorial/analítico**, não operador .bet.br (sem carteira/depósito) — obrigações de operador (KYC, limite de depósito) não se aplicam direto; o que **sempre** alcança a página são as regras de **publicidade** (avisos +18, dependência, vedação de promessa de lucro). Ver `docs/investigacoes/regulacao-br-apostas-produto.md`.

---

## 7. Diferenciais vs. concorrentes (e o que NÃO copiar)

**Onde o mrtip ganha:**
- **Proveniência por número** (DOS-001 / Proof-Carrying-Numbers): cada dígito clicável até a tool/fonte. Sofascore/Forebet/Oddspedia mostram número de caixa-preta; o mrtip mostra *de onde veio*. Diferencial defensável.
- **Incerteza sempre à vista**: banda Wilson + `n` + flag lowSample em cada tendência — já entregável na v1. Forebet dá "% mágica" sem amostra; o mrtip nunca.
- **Calibração auditável (gate ECE) + reliability diagram/Brier** (v2+): "admite onde erra". Tipster comum só posta greens.
- **EV/no-vig/CLV honestos** (v2): número do modelo *ao lado* do no-vig de mercado, com EV explícito — gramática de OddsJam/RebelBetting, mas com referência própria e auditável.
- **Sobriedade como feature**: terminal quant dark-first, número herói em mono/tabular-nums, "não apostar também é resultado". Régua: "se um afiliado de Telegram poderia ter feito, está errado".

**O que NÃO copiar:**
- **Votação da torcida / leaderboard de tipsters por ROI / buzz social** (Sofascore, BettorEdge) — contraria a sobriedade e flerta com prova social de "ganhador"; descartar.
- **Indicadores festivos ao vivo / momentum / emoji / glow** (FlashScore) — viola a régua anti-cassino.
- **"Supercomputador 25.000 simulações" como número mágico** (FotMob) sem proveniência nem banda — o mrtip só publica probabilidade calibrada com fonte.
- **Promessas de "value bet" antes de ter odds e motor** — não fabricar EV; é exatamente o que separa o mrtip do afiliado.

---

## 8. Ajustes ditados pelos verdicts de verificação adversarial

- **Movimento de linha / "apostar cedo gera CLV"**: NÃO prometer "antes = mais CLV" (verdict refutou a monotonia). Copy correto: "trave a linha mole quando aparece, antes do mercado absorver a info".
- **CLV 60-65% em 200+ apostas**: é heurística de mercado, **não** citação da OddsJam (verdict: mal-atribuído); comparar contra **no-vig closing line de book sharp**, não qualquer fechamento.
- **Escanteios/cartões**: justificar por **previsibilidade/modelagem**, não por "valor consistente" (marketing); reconhecer overdispersion; linha central ~9,5-11,5 escanteios, não 8,5.
- **No-vig + EV + Kelly fracionado**: confirmados — implementar quando odds entrarem, com Kelly fração configurável (default ≤0,5), nunca full Kelly.
- **Grid escaneável (OddsJam odds screen) + coluna de edge/EV ordenável (OddsJam Positive EV, RebelBetting)**: confirmados como padrão de produto líder.

---

## Marcação de origem

Itens "v1 entregáveis" e a forma do grid/seletor vêm dos **docs internos** (stub DOS-001/MOD-002/SIN-012 + services existentes). EV%-herói, no-vig lado a lado, stake Kelly, gate ECE, proveniência clicável, tag de edge, movimento de linha, escanteios/cartões e os disclaimers de incerteza são **ideias da pesquisa web** (verificadas), todas marcadas FUTURO por dependerem de odds/motor/dossiê ainda não ingeridos. Nenhum dado foi inventado: a v1 só usa `rounds`, `matches`, `computeStandings`, `computeForm`, `computeTeamTrends`, `scorers`, `loadMatchAbsences`, `lineup`/ratings e `match.date`.
