---
name: rs
description: Investigação completa de uma feature — arqueologia interna (código + git + schema) + pesquisa externa verificada → docs/investigacoes + status investigado. Use quando o usuário pedir pra investigar/pesquisar uma feature ou tema, perguntar "isso existe? como o mercado faz?", ou disser "/rs <ID|tema>".
argument-hint: <ID da feature ou tema> [foco opcional]
---

Faça uma **investigação completa** da feature: `$ARGUMENTS`

O entregável é a investigação — **não implemente nada**. Regra de altitude: não re-decida o que `docs/arquitetura/` já cravou; investigação nova complementa ou contesta COM evidência, nunca ignora. Para fan-out web pesado, a skill `deep-research` (Skill tool) é o harness de referência (buscas em leque → fetch → verificação adversarial → síntese citada); esta skill orquestra a arqueologia interna + a entrega no registro de features.

## 0. Triagem + brief (antes de gastar qualquer token caro)

Classifique e **declare o tier + orçamento** na primeira resposta — esforço se decide aqui, não no meio:

| Tier | Sinal | Orçamento | Entregável |
|---|---|---|---|
| **Lookup** | 1 fato verificável ("qual o limite X?", "lib Y suporta Z?") | você mesmo, 3-10 buscas/fetches | resposta direta com fonte — **SEM doc completo** |
| **Comparação** | 2-5 opções nomeáveis (libs, providers, abordagens) | 2-4 subagentes, 10-15 calls cada | doc completo |
| **Tema amplo** | mercado + código + schema + regulatório | 5-10+ subagentes por frente | doc completo |

- Pedido ambíguo em algo que muda o rumo → **1 pergunta de cada vez, multiple choice** (AskUserQuestion), antes do fan-out — nunca no meio.
- Comprima num **brief de 3-6 linhas**: escopo, perguntas a responder, o que conta como "respondido". Todo search e o TL;DR final são julgados contra ele. Inclua os **requisitos implícitos** que o pedido não falou mas o repo exige: regulação BR de apostas (Lei 14.790/2023, +18, jogo responsável, sem promessa de ganho), dinheiro em centavos, fuso `America/Sao_Paulo`, separação quant/LLM e o princípio "todo pick mostra o porquê + fontes" (requisito implícito ignorado é ~metade das falhas de research agents).
- Tier comparação/amplo: emita o plano como **checklist visível** (frentes, perguntas, arqueologia × web) ANTES do fan-out — o dono pode podar a fase cara. Gate: o doc final só é escrito depois dos §§1-5.
- Pressão por atalho ("só me responde rápido, pula a web") rebaixa o TIER, nunca remove a verificação — lookup também cita fonte fetchada.

## 1. Resolver a feature + memória do que já foi investigado

- ID existente (ex: `FID-001`): leia `docs/features/<modulo>/<ID>-*.md` + TODOS os `docs:` vinculados.
- Tema sem feature: crie o arquivo a partir de `docs/features/_template.md` no módulo certo (próximo número do prefixo — confira no `docs/features/INDEX.md`), `status: ideia`, ANTES de investigar. **Número livre no INDEX não basta**: um ID pode estar reservado só em prosa (uma feature prometendo `XXX-010` a um trabalho futuro numa seção "Fora de escopo"), e aí o número nasce significando duas coisas. Confira com `grep -rn "<PREFIXO>-0NN" docs/` antes de cravar; se tomar um número reservado, **reponte a reserva** no doc que a fez. Idem pra `W-NNN` novo na wishlist: o próximo livre sai de `grep -o "^### W-[0-9]*" docs/wishlist.md | sed 's/.*W-//' | sort -n | tail -1`, não de olhar o topo do arquivo (que é ordenado por desejo, não por número).
- `bun run features impact <ID>` + índice de âncoras do INDEX.md → em quem ela encosta; features afetadas são leitura obrigatória.
- **Investigações prévias são leitura obrigatória, não opcional**: índice doc→features do INDEX.md + `Grep` do tema em `docs/investigacoes/` + memórias recuperadas. **Achado já REFUTADO em investigação anterior entra no diário como REFUTED — proibido re-pesquisar sem evidência nova.** O mesmo vale pra decisões já cravadas do dono (vetos, "tooling = protótipo comparativo").

## 2. Arqueologia interna (antes da web — o repo sabe mais do que parece)

- **Código real** (SocratiCode obrigatório, regras do CLAUDE.md): `codebase_search` é a entrada padrão pra perguntas conceituais; `codebase_symbols` quando o termo é nomeável → `codebase_graph_query` → `Read` direcionado. Separe **real × mock × fantasma** — toggle que não faz nada é achado, não detalhe.
- **Schema/contratos**: `codebase_context_search` (schema do banco, specs de API, infra) pra confirmar colunas e shapes em vez de deduzir do código — o schema atual já suporta o tema ou implica migração? Gaps com `arquivo:linha`/campo.
- **Git como fonte de decisão**: `git log --grep "\[<IDs vizinhos>\]" --oneline`; `git log --follow --oneline -- <arquivo central>`; `git log -S "<termo>"` pra saber quando/por que algo entrou ou saiu.
- **Code-as-action**: levantamento de dados multi-step (contar ocorrências, cruzar tabelas, agregar rows) → escreva 1 script bun descartável em vez de N tool calls granulares. Subagentes de arqueologia são **read-only** — nunca mutam o repo.
- **Citação interna obrigatória** (mesmo regime das URLs — achado sem âncora é inauditável):
  - **Código**: todo achado (real, mock, fantasma, gap) carrega `caminho/desde-a-raiz.ts:linha` na **primeira menção**; repetições podem encurtar (`arquivo.ts:linha`). Linha vem de Read/search **desta sessão** — nunca de doc/memória antiga (line-drift gera citação errada).
  - **Git**: decisão/data minerada do histórico cita o **hash curto** (`abc1234`) + 1 frase do que o commit prova. Sem hash = inferência, rotule como tal.
  - **Schema/banco**: cite `tabela.coluna` (+ arquivo do schema Drizzle ou migração quando o shape importa). Fato sobre DADOS leva a query + data — dado de dev gira no re-seed.
  - Tabela real×mock×fantasma sem âncora por linha = doc reprovado.

## 3. Pesquisa externa — fan-out, persistência e fontes

- **Fan-out por perspectiva** (tier comparação/amplo): as frentes saem das personas do domínio — apostador (casual e sharp), tipster, concorrentes (plataformas de tips, agregadores de odds, sites de stats/xG e quem o tema pedir), engenharia/modelo de dados (ingestão, dossiê do jogo, calibração quant/LLM), compliance/regulação (Lei 14.790, jogo responsável). Cada perspectiva gera as próprias perguntas; as que renderem viram seções do doc. Default: ~4 sub-perguntas por frente × até 2 níveis de follow-up.
- **Spec de subagente em 4 campos** (delegação vaga = subagentes duplicando ângulo): objetivo · formato exato do output · fontes/tools permitidos · fronteiras DO-NOT-COVER. Subagentes devolvem **notas destiladas + lista de fontes — NUNCA prosa de relatório** (seções escritas em paralelo saem desconexas; a síntese é sua, em um passe).
- **Broad-then-narrow**: queries curtas e amplas primeiro, avalie o terreno, depois estreite. Busque em pt-BR E inglês.
- **Persistência com estratégia**: 2 formulações falharam → MUDE a estratégia (termos, idioma, `site:`, docs × fóruns × issues), não conclua "não existe". E **"nenhuma fonte confiável encontrada" é resposta válida** — registrada na seção de lacunas, melhor que citar fraco.
- **Reflexão entre batches** (obrigatória, escrita no diário): "respondido: X · falta: Y · próxima query: Z". Sub-pergunta nova entra na FRENTE da fila; a pergunta-mãe só fecha quando a fila à frente drena.
- **Escada de fontes** (content farm de "palpite/tips" domina o nicho de apostas BR — escada é defesa, não burocracia): docs oficiais/changelog (de APIs de stats/odds) > blog de engenharia/whitepaper do vendor > acadêmico/relatório setorial (Secretaria de Prêmios e Apostas do MF, IBIA, papers de modelagem esportiva/xG) > trade press séria > listicle SEO e canal de tip (**banidos como evidência única**). Estatística ou odd em agregador → rastreie até a primeira fonte primária e cite ELA.
- Lib/serviço candidato: docs atuais via context7 (`resolve-library-id` → `query-docs`); issues/discussions abertas (maturidade, pegadinhas); licença e manutenção. Regra do dono: **decisão de tooling = protótipo comparativo** — a investigação recomenda finalistas, não fecha sozinha.
- Classifique cada capacidade de mercado: **paridade** (todo mundo tem, faltar dói) × **diferencial defensável** (conversa com a tese do mrtip: transparência radical + IA explicável quant/LLM + histórico auditável dos dois lados).

**Antipadrões desta skill:** `premature-editing` (concluir após 1-2 buscas — a maior fatia das falhas) · `grep-silencio-como-prova` (1 busca vazia ≠ "não existe"; ausência exige ≥2 buscas com parâmetros distintos) · `citacao-de-memoria` (parte das URLs citadas por agentes é fabricada) · `single-origin-disfarcado` (20 blogs recitando o mesmo press release ≠ 20 fontes) · `vaporware-as-evidence` (landing page ≠ feature existente) · `feature-parity-trap`/`cargo-cult` ("concorrente tem X" sem dor própria) · `grafico-tesla` (matriz extensa sem decisão que ela muda) · `lost-in-the-codebase` (ler arquivo após arquivo É o mecanismo do context rot).

## 4. Verificação (onde research agents morrem — 6-22% das citações erram até no estado da arte)

- **Fetch, não snippet**: claim que sustenta a recomendação (preço, limite, capacidade de API, deprecação) exige WebFetch da página real — snippet de busca fabricado/desatualizado é failure mode documentado.
- **URL só de tool result DESTA sessão** — zero URLs de memória (3-13% das URLs citadas por agentes são fabricadas).
- **Veredito por claim atômico**: SUPPORTED (URL + data as-of) · REFUTED (vai pra seção **Refutado** — vale tanto quanto confirmado) · NEI/não-achei (vai pra **Perguntas Abertas**, **nunca pro TL;DR**). "X é grátis até 100k req/mês" é átomo verificável; "X é o melhor" é opinião — atribui, não vereda.
- **Triangulação com independência real**: claim de mercado/número exige ≥2 fontes de proveniência distinta — 20 blogs recitando o mesmo press release = 1 fonte (marque "single-origin").
- **Rigor extra nas PRIMEIRAS fontes** de cada frente — erro de fonte no início ancora e cascateia pelo resto (>57% dos erros nascem aí).
- **Frescor**: pricing/limites/status de API com >12 meses → re-verificar na página viva; paisagem de mercado >24 meses → suspeita. Conflito entre fontes: a primária mais nova vence, conflito anotado.
- **Label de confiança por achado**: `verificado-fetch` / `snippet` / `inferência` / `não-verificado` + data as-of. Achados internos usam `lido-no-código` (Read/search desta sessão, com `path:linha`) vs `inferência` (deduzido de doc/memória, sem âncora fresca).
- **Orçamento esgotado → modo conclusão**: escreva com o que está verificado; o que ficou NEI vai pra Perguntas Abertas — proibido estourar o orçamento buscando "só mais uma".

## 5. Counter-review (antes de escrever, em recomendação que carrega decisão)

Tier comparação/amplo: 1 subagente **role-locked pra REFUTAR** a recomendação preliminar, com buscas frescas próprias (não recebe seu raciocínio, só a recomendação + brief). Quota: **≥3 problemas reais** ou você re-examina por conta. Escolha contestada (qual PSP/lib/abordagem) → 2-3 subagentes na MESMA pergunta por ângulos diferentes; só entra na matriz o que 2+ confirmam. O que sobreviver vira força da recomendação; o que não, vira risco declarado.

## 6. Entregar

1. **Escrita one-shot**: você escreve `docs/investigacoes/<slug>.md` inteiro de uma vez, a partir do brief + notas destiladas — nunca colagem de outputs de subagente. Espinha:
   - **TL;DR + recomendação cravada** (1 parágrafo no topo; só claims SUPPORTED)
   - Contexto e problema (+ brief e requisitos implícitos assumidos)
   - **Estado real no código** (real×mock×fantasma com `path:linha` por achado, hash de commit pra arqueologia git, `tabela.coluna` pra schema — gaps idem)
   - Estado da arte / mercado — claims atômicos com URL inline + label de confiança + as-of
   - **Opções com matriz de trade-offs** (síntese ENTRE fontes, não fato-por-fonte) → recomendação com o porquê + o que o counter-review levantou
   - Modelo de dados proposto
   - Plano por faceta (dados → api → ia → ui)
   - Riscos e gotchas
   - **Refutado** (com a evidência que matou) e **Perguntas Abertas / lacunas** (decisões do dono + NEI + buscas que voltaram vazias — vazio se declara, não se omite)
2. **Auditoria de citações (passe separado, depois do draft)** — citação é etapa própria, não efeito colateral da escrita:
   ```
   [ ] Toda URL veio de tool result desta sessão?
   [ ] Spot-check: reabri 3-5 claims numéricos/nominais contra a fonte?
   [ ] Load-bearing veio de fetch, não de snippet?
   [ ] Reli o pedido original — não ampliei/estreitei o escopo em silêncio?
   [ ] O que recuperei e NÃO usei — justifiquei ou descartei de propósito?
   [ ] Refutado + buscas vazias preenchidas (mesmo que "nenhuma")?
   [ ] Todo achado interno tem âncora (`path:linha` / hash / `tabela.coluna`) na primeira menção — vinda de leitura DESTA sessão?
   [ ] Spot-check interno: reabri 2-3 `path:linha` citados e a linha ainda mostra o que o doc afirma?
   [ ] `node scripts/verify-citations.mjs docs/investigacoes/<slug>.md --repo .` saiu com exit 0? (checker mecânico: path:linha existe, trecho verbatim casa, URL resolve — auto-conferência não substitui o oráculo)
   [ ] O doc responde cada pergunta do brief do §0?
   ```
   Item falhou → conserte antes de salvar; poucas citações verificadas > link-stuffing.
3. Atualize o frontmatter da feature: `status: investigado`, `docs:` += o novo doc, refine `ancoras`/`depende_de`/`impacta`/`facetas`, `atualizado:` = hoje. As 3-8 fontes decisivas entram na seção **Evidências** da feature com 1 linha do que cada uma prova.
4. `bun run features check && bun run features build`.
5. Responda com: TL;DR da recomendação, o que mudou no grafo (dependências/impactos novos), perguntas em aberto, e o próximo passo natural — `/pl <ID>` (gap trivial de 1 frase pode ir direto pro `/i <ID>`).
