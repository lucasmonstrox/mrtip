# Panorama de concorrentes do mrtip

> Investigação (`/rs`, tema amplo). As-of: **2026-06-18**. Mapeia quem já entrega prognóstico/insight/value bet de futebol (com ou sem IA), global + BR, e testa **quais "diferenciais" do mrtip ([visão §10](../visao-geral.md#10-diferenciais)) são reais e quais já são commodity**. Rótulos: `verificado-fetch` · `parcial` (single-origin/marketing) · `inferência`.
>
> ⚠️ **Caveat de método:** o agente de **counter-review** (refutar o fosso) e uma verificação caíram por **limite de sessão**. O counter-review abaixo foi feito por mim a partir dos dados verificados das 5 frentes — recomendo um passe adversarial independente quando a sessão resetar (ver Perguntas Abertas).

## TL;DR + recomendação cravada

**Nenhum "diferencial" isolado do mrtip é um fosso — quase todos já existem lá fora.** A explicabilidade conversacional ("mostra o porquê") já é feita por copilots como RotoBot/ParlaySavant/footyGPT; o histórico auditável de tipster é **commodity** de ~10 anos (Tipstrr, Betting Gods, Blogabet, OLBG); "IA" é majoritariamente Poisson/ML com marketing inflado (acurácia real ~55-65% em 1X2, não os "90%" anunciados). **O que sobra como defensável é a COMBINAÇÃO + dois vácuos reais:** (1) **mercado BR/PT-BR** — toda a concorrência forte é UK/EU/US-cêntrica; o BR é dominado por afiliados opacos e "IA" não comprovada; (2) **auditoria bilateral + CLV** — todos auditam só o lado do *tipster*, ninguém mede o resultado real do *apostador*, e quase ninguém usa Closing Line Value (o padrão-ouro). **Recomendação:** posicionar o mrtip como **"probabilidade calibrada + explicada + histórico auditável via CLV, em português, no mercado regulado BR"** — e tratar transparência/jogo-responsável como **produto**, não rodapé de compliance. O chat conversacional é **ticket de entrada (paridade)**, não o fosso. Reforça a decisão #9 da visão (nicho/BR > 1X2/PL).

---

## Contexto e brief

mrtip quer ser copiloto de IA de futebol (picks + insights + value bets + assistente), dois lados (apostador + tipster), com transparência radical e histórico auditável. **Brief:** mapear concorrentes por categoria, global+BR; responder onde está o diferencial defensável vs paridade. Requisitos implícitos: regulação BR (Lei 14.790/2023, sem promessa de ganho), separação quant/LLM, "pick mostra o porquê".

## Estado real no código

**Greenfield** — confirmado nesta e em sessões anteriores: não há produto, só o scaffold `apps/web` + os registros de features (`DOS-001` planejado, `MOD-001` investigado, `SIN-*`). Nenhuma feature de assistente/marketplace existe. Logo, esta investigação é **100% externa/estratégica** e informa a [visão §10](../visao-geral.md#10-diferenciais) e a decisão #9, não um arquivo de feature.

---

## Panorama por categoria (5 frentes)

### 1. Apps/sites de predição (incumbentes maduros)
Forebet (2009), PredictZ, WinDrawWin (2003), Infogol/Timeform, Statarea. Gratuitos, monetizados por **afiliação de casas** (revenue-share). Núcleo = **Poisson/xG, não LLM** [`verificado-fetch`, arxiv.org/abs/2408.08331]. Acurácia real **~55-65% em 1X2, 20-30% em placar** — bem abaixo dos "75-90%" de marketing [`parcial`, sports-ai.dev]. **Quase nenhum explica o "porquê" caso a caso**; só Forebet tem track record público (mas o "62,1% verificado por terceiros" rastreia a um *concorrente*, não é auditoria independente — `parcial`). Infogol é o "modelo de verdade" mais transparente (xG/Opta) e cobre Brasileirão.

### 2. IA-first / data-driven novos
Dois grupos: **com substância** (Footixify — ML + backtest + EV + Kelly; NerdyTips — CSV de histórico baixável; ScoutingStats.ai — calibração vs mercado) e **caixa-preta com selo "AI"** (Scoore.ai — alega 79-81% sem nenhuma calibração; OddsGPT — admite usar **LLM puro** GPT/Claude/Gemini, notoriamente não-calibrado). Padrão do segmento: **headline de acurácia inflada (75-99%) sem reliability plot nem auditoria**; modelos sérios ficam ~50-60% [`parcial`, thedatabetics.com]. Ninguém mostra os três juntos: acurácia × **calibração** × **valor (ROI/CLV)**.

### 3. Tipsters & marketplaces com proofing
Tipstrr, Betting Gods, Blogabet, OLBG, ProTipster. **Proofing de tipster = commodity** há ~10 anos: odd capturada na publicação via feeds, resultado auto-gravado, picks não-editáveis [`verificado-fetch`, punter2pro]. **Mas** três fraturas conhecidas e raramente resolvidas: (a) ROI inflado por "best odds" inatingíveis pelo assinante [`verificado-fetch`]; (b) padrão-ouro **CLV vs Pinnacle/SP é raro**; (c) **todos auditam só o lado do tipster — ninguém mede o "lucro prático" de quem seguiu** [`parcial`]. Monetização: assinatura de canal + comissão (Blogabet repassa até 90%) vs afiliado grátis (OLBG).

### 4. Concorrentes BR
Afiliados (Aposta10, Academia das Apostas, APWin, Apostas e Palpites), mídia editorial (Lance/NSN, ge, UOL, Trivela) e onda de "IA" (RobôTip/Darwin IA, NerdyTips, **SportingBOT** da Sportingbet, jun/2025). Padrão: **palpite grátis custeado por afiliação .bet.br** [`verificado-fetch`], análise rasa, **sem track record auditável** (data+mercado+odd+stake+resultado), "IA" como rótulo sem metodologia. Avisos +18/jogo responsável existem como **compliance mínima de rodapé** (Lei 14.790 + Portaria 1.231/2024 obrigam, e proíbem apresentar aposta como renda/investimento) [`verificado-fetch`, planalto].

### 5. Assistente conversacional / AI betting copilot
**Já existe e amadurece rápido no exterior (EN/EUA):** RotoBot AI e ParlaySavant (chat real que "mostra o trabalho" e cita fontes), **footyGPT** (futebol, compara 8 books, inferência bayesiana p/ confiança). Cauda longa de GPTs custom e apps caixa-preta (BetMines, PRO Betting Tips). **No BR a frente é quase greenfield:** Playbook (converte print em bilhete, não opina), Betbots (alertas), Darwin/NerdyTips (tabelas, não chat). Ponto fraco transversal: **ninguém expõe track record auditável independente**.

---

## Counter-review do fosso do mrtip (síntese própria — agente caiu por limite)

Testando cada diferencial declarado contra a evidência das frentes:

| Diferencial (visão §10) | Já comoditizado? | Quem já faz | Veredito |
|---|---|---|---|
| **(a) "Mostra o porquê" / explicabilidade** | **Parcial** | RotoBot, ParlaySavant, footyGPT citam fontes/raciocínio | Paridade no exterior; **diferencial no BR** (quase ninguém explica) |
| **(b) Separação quant × LLM** | n/a (interno) | mercado usa Poisson/ML **ou** LLM puro (OddsGPT) | Bom design, **fraco como fosso** (invisível ao usuário) |
| **(c) Histórico auditável** | **Sim (lado tipster)** | Tipstrr/Betting Gods/Blogabet/OLBG há ~10 anos | A *palavra* é commodity; **o real é bilateral + CLV + BR** |
| **(d) Dois lados + assistente** | Parcial | copilots (assistente) sim; **auditoria bilateral, ninguém** | Assistente = paridade; **auditoria dos dois lados = aberto** |
| **(e) Foco BR/Brasileirão** | **Não** | todos fortes são UK/EU/US | **Maior diferencial defensável** |

**Os ≥3 problemas mais fortes da tese "mrtip tem fosso":**
1. **"Transparência radical" e "IA explicável" já são paridade no mercado EN** — copilots fazem isso. Vender isso como inovação subestima a concorrência madura.
2. **"Histórico auditável" é commodity** no lado do tipster; só vira fosso se for **bilateral + CLV** (e isso é caro/difícil — nem os líderes resolveram a fratura do "best odds inatingível").
3. **O chat conversacional não é fosso** — é ticket de entrada; o risco é investir no chat e não na credibilidade auditável + BR, que é onde está o vácuo.

> **O fio condutor das 5 frentes:** o mercado está **saturado de "90% AI" inflado e opaco**. A oportunidade não é "ter IA" — é ser **honesto e auditável** (calibração + CLV + perdas à vista + jogo responsável como produto), **em português, no mercado regulado BR**. Isso casa com a tese anti-caixa-preta da visão.

---

## Recomendação de posicionamento

1. **Cunha de entrada = honestidade auditável em PT-BR**, não "mais um AI tipster". Mostrar **calibração** (reliability/Brier por mercado) e **CLV** (`docs/regras/mercado-odds.md`) — métricas que **ninguém publica**.
2. **Auditoria bilateral** como diferencial de rede: medir também o resultado de quem segue (o "lucro prático" que Tipstrr admite não medir).
3. **BR-nativo:** Brasileirão (todas as séries) + Conmebol, BRL em centavos, fuso `America/Sao_Paulo`, casas .bet.br, enquadramento Lei 14.790.
4. **Jogo responsável como produto** (limites/alertas), não rodapé — vira confiança num mercado de afiliados opacos.
5. **Assistente conversacional = paridade necessária**, construir, mas não tratar como o fosso.

## Matriz paridade × diferencial (resumo)
- **Paridade (custo de entrada):** probabilidade 1X2/O/U/BTTS via Poisson; cobertura de N ligas; chat conversacional; proofing de tipster; avisos +18.
- **Diferencial defensável:** BR/PT-BR + regulação nativa; auditoria **bilateral**; **CLV/calibração** publicados; explicação com fonte ligada ao modelo (no BR); a combinação como produto único.

## Riscos e gotchas
1. **"Auditável" rebatizado** — se o mrtip só disser "auditável" sem bilateral+CLV, é paridade disfarçada.
2. **Casas .bet.br fora do The Odds API** (risco aberto do DOS-001) — sem odds BR, CLV não fecha no Brasileirão. **Dependência crítica.**
3. **Regulação** — Lei 14.790 proíbe enquadrar aposta como renda/investimento; o discurso "value bet/EV+" precisa de cuidado de comunicação (+18, sem promessa de ganho).
4. **Copilots EN avançam rápido** — janela de "primeiro bom copilot BR" pode fechar; um global pode localizar.
5. **Marketing inflado é o normal do setor** — ser honesto pode parecer "fraco" frente a "90% de acerto" dos concorrentes; exige educar o usuário.

## Refutado (com a evidência que matou)
- **"IA dos concorrentes é ML/LLM sofisticado"** — REFUTADO (parcial): núcleo é **Poisson** de ~50 anos; "IA" é largamente marketing; ganho de ML sobre Poisson é de poucos p.p. [`verificado-fetch`, arxiv 2408.08331].
- **"Acurácia de 75-99% dos sites de predição"** — REFUTADO: real ~55-65% em 1X2; "90% sem método é essencialmente sem sentido" [`parcial`].
- **"Histórico auditável é diferencial do mrtip"** — REFUTADO no lado tipster (commodity há 10 anos); sobrevive só como **bilateral + CLV + BR**.
- **"Assistente conversacional é diferencial"** — REFUTADO: já existe (RotoBot/ParlaySavant/footyGPT); é paridade no exterior, greenfield no BR.

## Perguntas Abertas / lacunas
- **Counter-review independente não rodou** (limite de sessão) — re-executar o agente role-locked pós-reset (6:10 Lisboa) para um passe adversarial que não seja minha própria síntese.
- **Tamanho do mercado BR de tips/IA** (`NEI`) — não quantifiquei TAM/usuários; só estrutura competitiva.
- **Pricing real dos copilots EN** (`NEI`/parcial) — vários não expõem tiers.
- **`vs CLV` viável no BR?** depende das casas .bet.br (cruza com DOS-001/SIN-012 — risco aberto herdado).

## Evidências decisivas (fontes via fetch nesta sessão pelos subagentes)
- [web] arxiv.org/abs/2408.08331 — Poisson/Dixon-Coles é a base canônica há décadas; "IA" é marketing.
- [web] sports-ai.dev / thedatabetics.com — acurácia real ~50-65%, claims de 90%+ "meaningless".
- [web] punter2pro.com (Tipstrr review + rogue tipsters) — proofing é commodity; ROI inflado por "best odds"; só audita o tipster.
- [web] honestbettingreviews.com — CLV vs closing é o padrão-ouro raro; histórico auditável detalhado = critério anti-golpe.
- [web] planalto.gov.br/.../l14790.htm — Lei 14.790: +18, proíbe apresentar aposta como renda/investimento; afiliado = ação do operador.
- [web] rotobot.ai / parlaysavant.com / footygpt.com — copilots conversacionais que "mostram o trabalho" já existem (paridade EN).
- [web] yogonet.com (SportingBOT, jun/2025) — casas BR já lançam assistente de IA (mas a favor do próprio funil).
- [doc] docs/research/sites-futebol-masculino.csv — catálogo-base (437 sites) usado como espinha da arqueologia competitiva.
