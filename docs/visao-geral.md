# mrtip — Visão Geral do Produto

> Documento vivo. Define **por que** o mrtip existe, **para quem**, **o que entrega** e **como** — antes do código. Tudo o que for construído (features, modelo de dados, escolha de IA) deve poder ser justificado a partir daqui.

- **Status:** rascunho inicial (v0)
- **Última atualização:** 2026-06-18
- **Estratégia / onde está o valor:** ver [tese-produto.md](tese-produto.md) — síntese (destilada das investigações) de onde mora o EV+, por que honestidade auditável é fosso + conformidade, e por onde começar.
- **Itens marcados `[A confirmar]`** dependem de decisão sua e estão listados em [Decisões em aberto](#11-decisões-em-aberto).

---

## 1. Pitch em uma frase

**mrtip é um copiloto de IA para futebol que transforma o caos de dados de uma partida — desempenho, lesões, forma, contexto social e odds do mercado — em prognósticos, análises e apostas de valor, servindo tanto apostadores quanto tipsters numa só plataforma.**

---

## 2. O problema

Quem aposta ou produz prognósticos de futebol hoje lida com:

- **Informação espalhada e perecível.** Estatísticas num site, escalações e lesões em outro, sentimento da torcida no X/Reddit, odds em dezenas de casas. Ninguém consolida isso a tempo de decidir.
- **Análise manual e lenta.** Montar uma leitura decente de um jogo leva tempo; multiplique por dezenas de jogos por rodada e é inviável fazer bem.
- **Excesso de "palpite" e falta de rigor.** Muitos tips são achismo sem histórico verificável. O apostador não consegue distinguir sorte de competência.
- **Dificuldade de achar valor (EV+).** Saber se uma odd está "cara" ou "barata" exige uma probabilidade própria bem calibrada — algo que a maioria não tem.
- **Para o tipster:** falta ferramenta que acelere a produção de análises **e** prove, de forma auditável, o desempenho ao longo do tempo.

**Resumo:** existe muita informação e pouca *inteligência acionável* — e quase nenhuma *confiança verificável* sobre quem acerta.

---

## 3. Visão

> Ser a camada de inteligência sobre o futebol: o lugar onde **apostadores** decidem melhor e **tipsters** produzem e provam melhor — com a IA fazendo o trabalho pesado de coletar, entender e explicar cada jogo.

No longo prazo, o mrtip vira uma **rede de dois lados**: tipsters publicam (e monetizam) prognósticos potencializados por IA, e apostadores consomem tanto o conteúdo da plataforma quanto o dos tipsters — com o histórico de acerto de todos sempre transparente.

---

## 4. Público-alvo

Plataforma de **dois lados**. O MVP precisa servir bem os dois, mas a aquisição inicial provavelmente começa pelo apostador (demanda) e usa o tipster como gerador de conteúdo/retenção.

### 4.1 Persona A — O Apostador
- **Casual/recreativo:** aposta por diversão, quer ajuda simples e clara pra decidir, foge de jargão.
- **Sério/sharp:** busca valor de forma sistemática, quer dados profundos, probabilidades calibradas e comparação com as odds.
- **Dor central:** "não tenho tempo nem dados pra decidir com confiança."

### 4.2 Persona B — O Tipster
- Produz e/ou vende prognósticos (canais no Telegram, redes sociais).
- **Dor central:** "produzir análise de qualidade dá trabalho, e não consigo provar meu acerto de forma confiável."
- **O que ganha aqui:** IA que acelera a análise + **histórico auditável** que vira prova social + (futuro) canal de monetização.

> `[A confirmar]` Qual lado é o foco **número 1** do MVP? (recomendação: apostador como tração inicial, tipster entra na fase 2).

---

## 5. Proposta de valor — o que o mrtip entrega

Você quer "tudo": picks, insights, value bets e um assistente conversacional. A forma de não construir 4 produtos soltos é organizar assim:

```
                ┌─────────────────────────────────────┐
   Interface →  │     Assistente de IA conversacional   │  "Como está o jogo X pra hoje?"
                └─────────────────────────────────────┘
                          ▲        ▲        ▲
   Motores →     ┌────────┴──┐ ┌───┴────┐ ┌─┴──────────┐
                 │  Picks /  │ │Insights│ │ Value bets │
                 │ Prognós-  │ │ e con- │ │ (prob. vs  │
                 │  ticos    │ │ texto  │ │  odds, EV+)│
                 └───────────┘ └────────┘ └────────────┘
                          ▲        ▲        ▲
   Base →        ┌────────┴────────┴────────┴──────────┐
                 │  Camada de dados + modelos de IA     │
                 └─────────────────────────────────────┘
```

- **Assistente conversacional (a cara do produto):** o usuário pergunta em linguagem natural e recebe resposta com dados + opinião. É a porta de entrada que dá acesso a todos os motores.
- **Picks / prognósticos:** recomendação acionável ("valor em over 2.5") com **nível de confiança** e justificativa.
- **Insights e contexto:** resumo digerível de lesões, forma, desfalques, contexto social e estatísticas — para quem prefere decidir sozinho.
- **Value bets:** probabilidade própria do modelo comparada às odds do mercado, destacando onde há valor esperado positivo (EV+).

> **Princípio de produto:** o mrtip **sempre mostra o porquê**. Nenhum pick sem explicação e sem os dados que o sustentam. Isso diferencia de "grupo de palpite" e reduz risco de virar caixa-preta.

---

## 6. Como a IA entende um jogo

O coração do produto é uma pipeline que, para cada partida, reúne e interpreta múltiplas dimensões — exatamente as que você descreveu:

| Dimensão | O que captura | Exemplos de fonte |
|---|---|---|
| **Desempenho / forma** | Estatísticas de time e jogador, xG, tendências recentes | FBref / StatsBomb, Understat |
| **Eventos passados** | Histórico de confrontos (H2H), resultados, padrões | Bases históricas de resultados |
| **Lesões e desfalques** | Quem está fora, suspenso, dúvida | Premier Injuries, notícias de clube |
| **Contexto social** | O que torcida/imprensa/insiders comentam (sentimento, vazamentos de escalação) | X/Twitter, Reddit, portais |
| **Mercado** | Odds das casas e seus movimentos | Agregadores de odds `[A confirmar fontes]` |

**Fluxo (alto nível):**

1. **Ingestão** — coletores buscam e normalizam dados de cada fonte (jobs agendados + sob demanda).
2. **Consolidação** — tudo vira um "dossiê do jogo" estruturado por partida.
3. **Raciocínio com IA** — modelos (LLM para leitura/explicação + modelos quantitativos para probabilidade) processam o dossiê.
4. **Saída** — picks, insights e value bets, sempre com rastro das fontes que os geraram.
5. **Feedback / calibração** — resultados reais retroalimentam a avaliação dos modelos e dos tipsters (histórico de acerto).

> **Decisão de IA importante:** separar **"explicar" (LLM)** de **"estimar probabilidade" (modelo quantitativo)**. LLM é ótimo para ler contexto e redigir; ruim para calibrar probabilidade sozinho. Tratar como camadas distintas evita prognósticos que *soam* confiantes mas são estatisticamente fracos.

---

## 7. Escopo inicial (MVP): uma liga, bem feita

Decisão: **começar por uma única liga**, escolhida pela riqueza de dados e cobertura, e só expandir depois de validada.

- **Liga recomendada: Premier League** `[A confirmar]` — é a que tem mais e melhores fontes (stats, xG, lesões, volume de notícia e social), ideal para testar a pipeline de dados a fundo.
  - *Alternativa estratégica:* **Brasileirão**, se o foco de go-to-market for o público brasileiro desde já (cobertura/contexto em português, menos concorrência local). Boa candidata para a Fase 2.
- **Mercados do MVP** `[A confirmar]`: começar enxuto — sugestão **1X2 (resultado) + over/under 2.5 gols**. Ampliar para ambas marcam, escanteios, cartões etc. depois.
- **Critério de "bem testado" antes de expandir:**
  - Pipeline de dados estável e atualizada a tempo de cada rodada.
  - Histórico de acerto registrado e **auditável** por algumas rodadas.
  - Probabilidades minimamente **calibradas** (avaliadas vs. resultado real).

---

## 8. Funcionalidades

### MVP (Fase 1)
- Assistente conversacional sobre os jogos da liga escolhida.
- Dossiê por partida (forma, lesões, H2H, contexto social, odds).
- Picks com nível de confiança + justificativa.
- Value bets (probabilidade do modelo vs. odd da casa).
- Registro de histórico de acerto (transparente).
- Conta de usuário + camada de assinatura. `[A confirmar autenticação/pagamento]`

### Fase 2 — lado do tipster
- Ferramentas para tipster gerar/publicar análises com apoio da IA.
- Perfil público do tipster com histórico de acerto verificável.
- Seguir tipsters; feed de prognósticos.

### Fase 3 — rede / marketplace
- Tipsters monetizam (assinatura do canal, comissão da plataforma).
- Expansão para mais ligas e mercados.
- Alertas em tempo real (movimento de odds, escalação confirmada, lesão de última hora).

---

## 9. Modelo de negócio

- **Principal (MVP): assinatura mensal (SaaS premium).** Acesso a picks/insights/value bets e ao assistente.
- **Camada gratuita** `[A confirmar]`: provável freemium leve (ex.: assistente limitado, 1 jogo/dia) para aquisição — definir na Fase 1.
- **Futuro: marketplace de tipsters** — plataforma fica com comissão sobre assinaturas dos canais. Casa com o público "ambos os lados".

> `[A confirmar]` Faixas de preço e o que entra em cada tier.

---

## 10. Diferenciais

1. **Transparência radical.** Todo pick mostra o porquê e as fontes; todo histórico de acerto é auditável (apostadores *e* tipsters).
2. **Multidimensional de verdade.** Junta o que normalmente está separado — incluindo **sentimento social** e **lesões**, não só estatística seca.
3. **Dois lados num só lugar.** Apostador e tipster na mesma plataforma, com efeito de rede como fosso competitivo no longo prazo.
4. **Foco antes de escala.** Uma liga impecável vence dez ligas medianas.
5. **IA explicável.** Separação entre estimar (quant) e explicar (LLM) → confiança sem caixa-preta.

---

## 11. Arquitetura técnica (alto nível)

Stack atual do repositório: **monorepo Turborepo + Bun**, app web **Next.js**, UI com **shadcn/ui** (`packages/ui`).

Componentes previstos (a detalhar em doc próprio de arquitetura):
- **`apps/web`** — front-end (assistente, dossiês, dashboards de histórico).
- **Camada de ingestão de dados** — coletores/normalizadores por fonte. `[A confirmar: onde rodam — jobs/serverless/serviço dedicado]`
- **Camada de IA** — orquestração de LLM (leitura/explicação) + modelos quantitativos (probabilidade). `[A confirmar provedor de modelos]`
- **Persistência** — dossiês por jogo, histórico de acerto, contas/assinaturas. `[A confirmar banco]`

> Decisões técnicas vivem em um `docs/arquitetura.md` separado — este documento é só de produto/visão.

---

## 12. Métricas de sucesso

- **Qualidade do modelo:** calibração das probabilidades e ROI/yield simulado dos picks ao longo das rodadas.
- **Engajamento:** usuários ativos por rodada, perguntas ao assistente por usuário.
- **Negócio:** conversão free→pago, retenção mensal, churn.
- **Confiança:** % de picks com justificativa completa; tamanho/transparência do histórico de acerto.

> `[A confirmar]` Quais dessas viram **metas numéricas** do MVP.

---

## 13. Riscos e considerações

- **Regulação (BR):** a Lei 14.790/2023 regulamentou apostas de quota fixa no Brasil. O mrtip precisa de **avisos de jogo responsável**, restrição de idade (+18) e cuidado com como "recomendações" são apresentadas. `[A confirmar enquadramento jurídico]`
- **Jogo responsável:** evitar gamificação que incentive aposta compulsiva; deixar claro que **não há garantia de ganho**.
- **Expectativa de acerto:** o produto não pode prometer vitória. Posicionar como **inteligência/probabilidade**, não como "bilhete certo".
- **Qualidade e dependência de dados:** o produto vale o que valem suas fontes. Risco de mudança de termos/preço/bloqueio de APIs e sites. Mitigar com múltiplas fontes por dimensão.
- **Custos de IA:** chamadas de LLM por jogo escalam com nº de partidas/usuários — daí o foco em uma liga primeiro.
- **Confiança no histórico:** o registro de acerto precisa ser à prova de manipulação (registrar o pick *antes* do jogo, imutável).

---

## 14. Roadmap em fases

| Fase | Foco | Entregável-chave |
|---|---|---|
| **1 — MVP** | Apostador, 1 liga, poucos mercados | Assistente + picks + value bets + histórico auditável |
| **2 — Tipster** | Lado da oferta | Ferramentas de tipster + perfil com histórico verificável |
| **3 — Rede** | Marketplace + escala | Monetização de tipsters + mais ligas/mercados + alertas em tempo real |

---

## 15. Decisões em aberto

1. **Foco nº 1 do MVP:** apostador ou tipster primeiro? (recomendação: apostador)
2. **Liga do MVP:** Premier League (riqueza de dados) vs. Brasileirão (go-to-market BR)?
3. **Mercados do MVP:** começar com 1X2 + over/under 2.5?
4. **Fontes de dados oficiais** por dimensão (stats, lesões, social, odds) — quais usar.
5. **Provedor de IA** e separação quant/LLM.
6. **Tiers e preços** da assinatura; existe camada grátis?
7. **Nome/branding** — "mrtip" é definitivo?
8. **Enquadramento jurídico** e requisitos de jogo responsável.
9. **Tensão "onde está o valor" (nicho/BR) × "onde começar" (1X2/PL).** A investigação das regras de prognóstico (`docs/regras/`, features `SIN-00X`) convergiu: o EV+ real mora em **mercados de nicho** (cartões, escanteios, team-totals) e em **ligas de baixa liquidez** (Brasileirão/Conmebol) — porque nos mercados principais de ligas grandes a *closing line* sharp já comeu o valor (ver [mercado-odds.md](regras/mercado-odds.md)). Isso conflita com a sugestão atual de iniciar por **1X2 + over/under 2.5 na Premier League** (§7), que é justamente o cenário **mais eficiente**. Decidir: o MVP começa pelo mercado mais *fácil de cobrir* (PL/1X2) ou pelo mais *lucrativo* (cartões e/ou Brasileirão/Conmebol)? `[A confirmar]`

---

## 16. Glossário rápido

- **Pick / prognóstico:** recomendação de aposta.
- **Tipster:** quem produz/vende prognósticos.
- **Odd:** cotação da casa (quanto paga uma aposta).
- **EV+ (valor esperado positivo) / value bet:** aposta cuja probabilidade real é maior do que a odd sugere.
- **xG (expected goals):** métrica de qualidade de chances.
- **Calibração:** o quanto as probabilidades previstas batem com a frequência real dos resultados.
- **H2H (head-to-head):** histórico de confrontos diretos.
