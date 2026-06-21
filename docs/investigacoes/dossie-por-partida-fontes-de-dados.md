# DOS-001 — Dossiê por partida: fontes de dados + modelo de dados

> Investigação (`/rs`). As-of: **2026-06-18**. Feature: [docs/features/dossie/DOS-001-dossie-por-partida.md](../features/dossie/DOS-001-dossie-por-partida.md).
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `inferência` (dedução, não fonte) · `NEI` (não encontrado/insuficiente).

## TL;DR + recomendação cravada

Para o "dossiê por partida" (PL + Brasileirão Série A, mercado BR), a recomendação verificada é: **SportMonks como espinha dorsal de dados** — é o único provedor com **API oficial + xG + cobertura do Brasileirão com profundidade de jogador + lesões/escalações + licença comercial que permite armazenar, derivar e monetizar** (proíbe só revenda do dado bruto), por ~€58–128/mês [`verificado-fetch`]. As demais dimensões **não fecham sozinhas e ficam como decisão de protótipo**: **odds é o maior risco aberto** — The Odds API é barata, tem o Brasileirão e licença OK, mas **não cobre as casas que operam no Brasil** (Betano/Superbet/KTO), então o value bet contra o mercado BR nasce descalibrado; a alternativa OpticOdds custa **~US$5.000/mês**, não é "upgrade barato". **Contexto social** entra no MVP só na versão barata (notícia/RSS oficial + sentimento leve sobre esse feed); sentimento de torcida em escala (X/Reddit) é caro/arriscado e fica para fase posterior. **Modelo de dados:** Postgres + JSONB híbrido (esqueleto relacional + payloads multi-fonte em JSONB) com **snapshot imutável (hash) por pick** para o point-in-time. **Atenção regulatória que muda o schema:** a Lei 14.790/2023 + Portaria SPA/MF 1.231/2024 já estão **em vigor** e exigem gate +18, jogo responsável, advertências e cuidado com "recomendar aposta" — isso vira campo no modelo e gate no produto, não é só copy.

---

## Contexto e problema

O dossiê por partida é o **estágio 2** da pipeline da visão ([docs/visao-geral.md](../visao-geral.md) §6): ingestão → **consolidação no "dossiê do jogo"** → raciocínio IA (quant + LLM) → saída (picks/insights/value bets) com rastro das fontes. É o insumo único dos motores e do assistente. O princípio "todo pick mostra o porquê + fontes" (§5) torna a **proveniência por campo** um requisito de arquitetura, não um detalhe.

**Brief (do §0):** mapear, por dimensão (forma/xG, H2H, lesões/escalações, social, odds), as fontes viáveis com **custo, licença (pode derivar+exibir?), cobertura PL e Brasileirão**; e propor o **modelo de dados** do dossiê (entidades, point-in-time/imutabilidade, proveniência). Requisitos implícitos do repo: odds/dinheiro em **centavos (int)**; fuso **America/Sao_Paulo** na borda; separação **quant/LLM**; custo de dados/IA escala com nº de jogos → favorecer boa relação custo/cobertura.

---

## Estado real no código

**Greenfield — não há nada a contestar, tudo é construção nova.** Confirmado por leitura desta sessão:

- O único código de app é o scaffold do Next.js: [apps/web/app/page.tsx](../../apps/web/app/page.tsx), [apps/web/app/layout.tsx](../../apps/web/app/layout.tsx), [apps/web/components/theme-provider.tsx](../../apps/web/components/theme-provider.tsx) (`lido-no-código`, Glob desta sessão).
- **Não existe** `packages/core` (porta de dinheiro `@workspace/core/money` é mandada pelo CLAUDE.md mas ainda não criada), **não existe** camada de persistência (`packages/db`), **não existe** `apps/api` nem qualquer coletor/ingestão (`lido-no-código`, estrutura do repo desta sessão).
- Não há schema de banco a confirmar (sem `codebase_context_search` aplicável — `.socraticodecontextartifacts.json` existe mas não há schema indexado).
- `bun run features impact DOS-001` → sem dependentes/âncoras compartilhadas (feature recém-criada).

Implicação: DOS-001 define do zero o modelo de dados, a porta de dinheiro/odds em centavos e a primeira camada de persistência do projeto — é **fundacional** (por isso `prioridade: P1`).

---

## Estado da arte / mercado — por dimensão

Claims atômicos, com fonte inline + confiança + as-of. Preços as-of 2026-06-18.

### Dimensão 1+2 — Stats/xG + H2H

| Fonte | xG | PL | Brasileirão | Preço | Licença derivar+exibir | Conf. |
|---|---|---|---|---|---|---|
| **SportMonks** | sim (add-on €29/mês) | sim | **sim, c/ player-stats, lineups, H2H ~2010+** | Starter €29 (5 ligas) / Growth €99 (30) / Pro €249 (120) + xG €29 + liga extra €4 | **sim** (revenda de dado bruto proibida) | `verificado-fetch` |
| **API-Football** | sim, **inconsistente por liga** | sim | sim (xG/profundidade a testar) | free 100 req/dia; $19/$29/$39 | **restrita** — não concede licença de publicação | preço `snippet`; licença `snippet` (ToS deu 403) |
| **Opta/Stats Perform** | sim | sim | sim | enterprise, sem preço público | sim sob contrato | `snippet` |
| **Sportradar** | sim | sim | sim | enterprise, sem preço público | sob contrato | `inferência` |
| **StatsBomb open data** | sim | parcial | **não confirmado** | grátis | **NÃO** — cláusula 1.2.2 proíbe explorar comercialmente os dados ou análise derivada | `verificado-fetch` (LICENSE.pdf) |
| **Understat** | sim | sim | **NÃO** (só 6 ligas europeias) | grátis (scraping, sem API) | sem licença; risco de ToS | `snippet` |
| **FBref** | **NÃO mais** — Opta cortou em **jan/2026** | básico | básico | grátis (scraping) | **NÃO** (ToS proíbe derivar/treinar IA) | `verificado-fetch` |
| **football-data.org** | **NÃO** | sim | sim (free tier) | €0–199 + add-ons | comercial nos pagos | `verificado-fetch` |

Decisivo: **só a SportMonks junta xG + Brasileirão profundo + licença comercial explícita** entre as fontes de custo acessível. As gratuitas caíram todas (FBref perdeu xG; Understat não tem BR; StatsBomb proíbe uso comercial).

### Dimensão 3 — Lesões / escalações

| Fonte | Lesões/suspensões | Lineups (previsto/confirmado) | Brasileirão | Preço | Licença exibir | Conf. |
|---|---|---|---|---|---|---|
| **SportMonks** | sim (entidade "sidelined") | confirmado incluso; **previsto = add-on "Expected Lineups" a partir de €199/mês** | sim (confirmado/sidelined; **accuracy de previsto só publicada p/ Europa**) | base + add-on | **sim** (incluso nos planos pagos) | `verificado-fetch` (accuracy `snippet`) |
| **API-Football** | sim (`/injuries`) | confirmado sim; **previsto não** | sim | $19+ | **restrita** (sem licença de publicação) | `snippet` |
| **Sportradar** | sim | previsto + confirmado | sim (tier alto) | enterprise | sob contrato | `snippet` |
| **Premier Injuries** | sim (nicho PL) | previsto (PL) | **NÃO** | NEI | NEI | `inferência` |

SportMonks cobre lesões+escalações **no mesmo contrato** das stats — consolidação de 3 dimensões num provedor.

### Dimensão 4 — Contexto social / sentimento

| Abordagem | Captura | Preço/limite | ToS comercial | Conf. |
|---|---|---|---|---|
| **X/Twitter API** | posts em tempo real, sentimento, vazamento de escalação | pay-per-use **$0,005/leitura, teto 2M/mês**; Basic $200 (legado), Pro $5k, Enterprise $42k+; **free extinto fev/2026** | comercial nos pagos | `verificado-fetch` |
| **Reddit API** | threads/comentários de subreddits | free 100 QPM; ~$0,24/1k chamadas | **exige contrato + proíbe treinar IA sem permissão escrita** | `verificado-fetch` (via terceiro) |
| **GNews** | notícia multi-idioma (**pt-BR**) | Essential €49,99/mês | comercial nos pagos | `verificado-fetch` |
| **NewsAPI.org** | manchetes/artigos | Business $449/mês (free é dev-only) | comercial nos pagos | `verificado-fetch` |
| **RSS oficial** (clubes/ligas/ge.globo/BBC) | notícia, lesão, escalação anunciada | grátis | baixíssimo (feed público) | `inferência` |

Aritmética verificada: 2M leituras/mês do X ≈ 50k tweets/jogo p/ 1 liga — **não cobre PL+Brasileirão em profundidade**; acima disso → Enterprise (proibitivo) [`verificado-fetch`]. Literatura indica sinal preditivo de sentimento bruto **fraco/ruidoso** para resultado de jogo.

### Dimensão 5 — Odds / mercado

| Fonte | Mercados | Brasileirão | **Casas BR** | Line movement | Preço | Licença | Conf. |
|---|---|---|---|---|---|---|---|
| **The Odds API** | 1X2, O/U (BTTS NEI) | **sim** (`soccer_brazil_campeonato`) | **NÃO** (regiões us/uk/eu/fr/se/au) | sim, desde 2020 | free 500/mês; $59 (100k) | **comercial + value bet OK** (não revender como produto de dados) | `verificado-fetch` |
| **OpticOdds** | 1X2, O/U, props, alt | provável | **Betano/bet365/Sportingbet/Betfair sim; KTO/Superbet não** | sim (grade/CLV) | **~US$5.000/mês, sales-gated** | contrato (NEI) | `verificado-fetch` (lista) / `snippet` (preço) |
| **API-Football** | 1X2, O/U, **BTTS** | sim | bet365/Betano em snippet; Superbet/KTO não confirmados | limitado/NEI | $19–39 | NEI (ToS 403) | `snippet` |
| **SportMonks (add-on)** | 42 markets, 140+ casas | sim | **BR específico não confirmado** | histórico até 7d pós-jogo | add-on **€129/mês** | NEI cláusula | `verificado-fetch` (preço) |
| **Betfair Exchange** | 1X2/O/U/BTTS (exchange) | sim | N/A (é a própria Betfair) | preço ao vivo; histórico pago | dev free; **£499 + licença comercial p/ publicar** | restritiva (Odds Publisher só p/ afiliados) | `verificado-fetch` |
| **Pinnacle** | 1X2/totals (linha "sharp") | sim | N/A (não cobre casas BR) | via agregador | acesso direto **fechado desde jul/2025** | via agregador | `snippet` |
| **OddsPapi / odds-api.io** | — | — | **lista Betano/Superbet/KTO/EstrelaBet** (fornecedor, viés) | — | NEI | NEI | `snippet` (auto-promoção) |

**Achado crítico do counter-review:** o slug `soccer_brazil_campeonato` cobre o *jogo*, mas as odds vêm de casas EU/UK — **não das casas .bet.br reguladas pela Lei 14.790**. O apostador brasileiro vê a linha da Betano/Superbet, não a do mercado EU. Logo, o value bet do The Odds API **não corresponde ao mercado-alvo**.

---

## Opções e recomendação

### Espinha dorsal de dados (stats/xG/H2H + lesões/escalações)

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **SportMonks** | xG + BR profundo + lesões/escalações + **licença comercial explícita**; 3 dimensões num contrato; preço previsível | xG e Expected Lineups são add-ons; **accuracy de escalação do Brasileirão não publicada**; lock-in num vendor | **Recomendado** |
| API-Football | barato, free tier generoso | xG inconsistente; **licença de publicação não concedida** (risco jurídico); sem previsto | Secundário (validação cruzada) |
| Opta/Sportradar | qualidade premium | enterprise, caro, overkill | Fase de escala |

**Recomendação:** SportMonks como base (Starter/Growth + add-on xG; +Expected Lineups €199/mês **se** escalação provável virar diferencial). **Sobreviveu ao counter-review** a licença comercial para betting ("data suitable for betting/fantasy/gaming", compliance por conta do cliente) [`verificado-fetch` FAQ]. **Ressalvas obrigatórias:** validar em teste real a **profundidade de xG e a acurácia de escalação do Brasileirão** antes do go-live (números só existem p/ Europa); ler o **Terms of Service jurídico completo** antes de assinar (só a FAQ foi aberta — `NEI` nas cláusulas linha-a-linha).

### Odds (decisão de protótipo — NÃO fechada aqui)

Regra do dono: tooling = protótipo comparativo. O counter-review **matou** The Odds API como fonte BR única e **matou** OpticOdds como "upgrade barato". Caminhos:

- **(a) Linha de referência + fonte BR separada:** The Odds API (free/$59) só para a **linha justa do mercado EU/sharp** (calibração do quant), + uma fonte que traga **casas .bet.br** para o value bet real. ← provável melhor custo/benefício.
- **(b) Validar OddsPapi/odds-api.io** (alega Betano/Superbet/KTO — fornecedor, viés): só por **protótipo com teste real**, nunca pela palavra do vendor.
- **(c) Aceitar OpticOdds** (~US$5k/mês) — adia para quando houver receita.

**Recomendação:** prototipar (a) — The Odds API grátis para a linha de referência — em paralelo a um **spike de validação de uma fonte de casas BR** (OddsPapi vs API-Football vs OpticOdds), medindo cobertura real de Betano/Superbet/KTO antes de comprometer.

### Contexto social (versão barata no MVP)

Não adiar a dimensão inteira (é 1 dos 5 pilares). **MVP:** GNews (€49,99/mês, pt-BR) + RSS oficial (ge.globo p/ BR, premierleague.com/BBC p/ PL) + **sentimento leve sobre esse feed de notícia** (custo marginal ~0, já que o texto já é coletado). **Adiar:** sentimento de torcida em escala via X (teto 2M estoura p/ 2 ligas) e Reddit (contrato + proíbe treinar IA). Classificação: notícia/lesão oficial = **paridade barata**; sentimento em escala = **diferencial caro/arriscado**.

### Modelo de dados (recomendado)

**Postgres + JSONB híbrido:** esqueleto canônico relacional + payloads multi-fonte em JSONB (GIN só nos campos consultados). JSONB é binário, indexável por GIN, doc recomenda como padrão [`verificado-fetch` postgresql.org]. **Point-in-time:** `dossier_snapshot` imutável com `content_hash` referenciado pelo `pick` (counter-review: guardar **hash + payload comprimido/ponteiro**, não duplicação ingênua). **Proveniência:** tabela `observation` append-only com `source`/`observed_at`/`ingested_at` (lineage row-level → renderiza "veio da fonte Y às Z"). **Reconciliação de IDs entre fontes:** tabela `entity_xref` (canonical_id ↔ source/source_id + confidence). **Tooling:** prototipar **Drizzle + Bun SQL nativo** vs **Prisma v7 (`--bun`)** [`verificado-fetch`]; counter-review: usar **driver pg maduro no caminho crítico do snapshot**, não depender do `Bun.sql` nativo enquanto imaturo (`NEI` em benchmark vivo do Bun 1.2.20).

Esboço (`inferência` — proposta):

```
league(id, name, country)
season(id, league_id, label, start_date, end_date)
round(id, season_id, number, name)
team(id, canonical_name)
player(id, canonical_name, primary_position)
match(id, season_id, round_id, home_team_id, away_team_id, kickoff_at, status)   ← entidade canônica
entity_xref(entity_type, canonical_id, source, source_id, confidence, matched_at)  ← crosswalk de IDs
observation(id, match_id, dimension, metric, value_jsonb, source, observed_at, ingested_at)  ← fato + proveniência
match_odds(id, match_id, bookmaker, market, odds_cents int, captured_at, source)   ← odds em CENTAVOS
dossier_snapshot(id, match_id, captured_at, content_jsonb, content_hash)           ← point-in-time imutável
pick(id, match_id, snapshot_id, selection, model_version, created_at)              ← imutável; invariante: created_at < match.kickoff_at
-- compliance (Lei 14.790 / Portaria 1.231): provenance+disclaimer por pick; gate +18 e jogo responsável na camada de produto
```

`timestamptz` interpretado em `America/Sao_Paulo` na borda; odds/dinheiro em centavos (int) via `@workspace/core/money`.

---

## Plano por faceta (dados → api → ia → ui)

- **dados:** conectores de ingestão por fonte (SportMonks primeiro) → normalização para `observation` com proveniência → `entity_xref` para cross-id → consolidação no `dossier_snapshot`. Odds em centavos. Jobs por rodada + sob demanda.
- **api:** servir o dossiê por partida (atrás do gate +18); endpoint do snapshot (imutável) que o pick referencia.
- **ia:** quant lê o dossiê estruturado (calibração) ; LLM explica **citando as fontes do dossiê** (sem inventar). Separação obrigatória.
- **ui:** renderizar o dossiê **com proveniência** ("o porquê"), advertência de jogo responsável e gate +18 (Portaria 1.231).

---

## Riscos e gotchas

1. **Cobertura de odds das casas BR (maior risco)** — sem Betano/Superbet/KTO o value bet não serve ao mercado-alvo; resolver por protótipo antes de prometer.
2. **Regulação em vigor (Lei 14.790 + Portaria SPA/MF 1.231/2024)** — gate +18, jogo responsável, advertências ≥10% do anúncio, vedação a "chamada para ação imediata" e a "afirmações infundadas sobre probabilidade de ganhar"; multa até 20% da arrecadação + **afiliados solidariamente responsáveis** [`verificado-fetch`]. Vira campo no schema e gate no produto — **precisa de revisão jurídica** (não é claim de research agent). PL 2.985/2023 (Senado, 2025-05-28) ainda **não é lei** — risco futuro.
3. **Profundidade do Brasileirão na SportMonks** — xG é add-on; acurácia de escalação só publicada p/ Europa → validar em trial.
4. **JSONB/snapshot em escala** — bloat de TOAST, custo de duplicar snapshot, GIN só nos campos consultados.
5. **Maturidade do Bun SQL** — usar driver pg maduro no caminho transacional do snapshot.
6. **Lock-in e dependência de fontes** — ToS/preço/bloqueio podem mudar (FBref perdeu xG em jan/2026 é o exemplo vivo); mitigar com ≥1 fonte alternativa por dimensão crítica.

---

## Refutado (com a evidência que matou)

- **"The Odds API resolve as odds do produto BR"** — REFUTADO: sem casas .bet.br (regiões us/uk/eu/fr/se/au) [`verificado-fetch` the-odds-api.com/bookmaker-apis].
- **"OpticOdds é upgrade futuro barato"** — REFUTADO: ~US$5.000/mês, sales-gated [`snippet`].
- **"FBref/Understat/StatsBomb como fontes grátis de stats/xG"** — REFUTADO: FBref perdeu xG da Opta em jan/2026 [`verificado-fetch`]; Understat não tem Brasileirão [`snippet`]; StatsBomb open data proíbe uso comercial/derivado (cláusula 1.2.2) [`verificado-fetch` LICENSE.pdf].
- **"Adiar toda a dimensão social"** — REFUTADO (parcial): manter sentimento leve sobre o feed de notícia já coletado (custo marginal ~0); só o sentimento em escala (X/Reddit) se adia.
- **"football-data.org cobre o dossiê"** — REFUTADO: não tem xG em nenhum tier [`verificado-fetch`].

## Perguntas Abertas / lacunas

- **Fonte de odds das casas BR:** OddsPapi vs API-Football vs OpticOdds — `NEI` (claims de fornecedor, viés); resolver por **protótipo com teste real** de cobertura Betano/Superbet/KTO.
- **SportMonks:** profundidade de xG e acurácia de escalação do **Brasileirão** (`NEI` — só números europeus); ToS jurídico completo (`NEI` — só FAQ aberta).
- **API-Football:** licença de publicação (`NEI` — ToS deu 403).
- **Bun SQL maturidade** no caminho transacional (`NEI` — sem benchmark vivo na 1.2.20).
- **Decisões de produto do dono** (visão §15) que travam o modelo: liga foco nº1 (PL vs Brasileirão), mercados do MVP (1X2 + O/U?), provedor de IA, escolha de banco. O modelo aqui é agnóstico a essas, mas a priorização de ingestão depende delas.
- **Revisão jurídica** do enquadramento Lei 14.790 / Portaria 1.231 para um produto de "recomendação/tips" — fora do escopo de research agent.
- Buscas que voltaram fracas/vazias: reclamações independentes de qualidade de dados do Brasileirão (SportMonks/API-Football) — quase só material de marketing dos vendors (`NEI`).

---

## Evidências decisivas (fontes abertas via fetch nesta sessão)

- [código] estrutura do repo + [apps/web/app/page.tsx](../../apps/web/app/page.tsx) — greenfield, sem camada de dados.
- [web] https://www.sportmonks.com/football-api/plans-pricing/ — preços + add-on xG/Expected Lineups.
- [web] https://www.sportmonks.com/terms-of-service/ + /faq/ — licença comercial: armazenar/derivar/monetizar OK; revenda de dado bruto proibida; betting "suitable".
- [web] https://www.sportmonks.com/football-api/serie-a-api-brazil/ — cobertura Brasileirão com xG/player/lineups/H2H.
- [web] https://the-odds-api.com/sports-odds-data/bookmaker-apis.html — regiões us/uk/eu/fr/se/au, **sem casas BR**.
- [web] https://the-odds-api.com/liveapi/guides/v4/ + /#get-access — Brasileirão slug, line movement desde 2020, tiers.
- [web] https://developer.opticodds.com/docs/sportsbooks — Betano/bet365/Sportingbet/Betfair sim; KTO/Superbet não.
- [web] github.com/statsbomb/open-data LICENSE.pdf — cláusula 1.2.2 proíbe uso comercial/derivado.
- [web] https://awfulannouncing.com/soccer/sports-reference-pulls-advanced-data... — FBref perdeu xG da Opta (jan/2026).
- [web] https://baptistaluz.com.br/publicidade-de-apostas-novidades-da-portaria-spa-mf-n-1-231-2024/ — obrigações em vigor (advertência ≥10%, +18, vedação a ação imediata).
- [web] https://www12.senado.leg.br/noticias/materias/2025/05/28/senado-aprova-restricao-a-publicidade-de-bets — PL 2.985/2023 (ainda não é lei).
- [web] https://postproxy.dev/blog/x-api-pricing-2026/ — X pay-per-use $0,005/leitura, teto 2M, free extinto fev/2026.
- [web] https://gnews.io/pricing + https://newsapi.org/pricing — GNews €49,99 (pt-BR) / NewsAPI Business $449.
- [web] https://octolens.com/blog/reddit-api-pricing — Reddit proíbe treinar IA sem permissão escrita.
- [web] https://www.postgresql.org/docs/current/datatype-json.html — JSONB binário, GIN, recomendado por padrão.
- [web] https://orm.drizzle.team/docs/get-started/bun-sql-new + https://www.prisma.io/docs/guides/bun + https://bun.com/docs/runtime/bun-apis — Drizzle/Prisma/Bun SQL nativo com Bun.
