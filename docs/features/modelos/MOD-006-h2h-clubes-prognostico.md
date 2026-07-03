---
id: MOD-006
titulo: Seção de H2H clube×clube no prognóstico com o detalhe do último confronto
modulo: modelos
status: em-andamento # ia verificada E2E; falta só a fase 2 de ui (aba fantasma)
prioridade: P2
facetas:
  ia: verificado # bloco H2H na PARTE 2 do prognosis-prompt (herda no super prompt); LLM citou o precedente no E2E
  ui: ideia # aba H2H fantasma no match-detail (placeholder "em breve") — fase 2
testada: parcial
testes:
  - "prompt gerado em 4 jogos reais (golden cross-season c/ SoT da 24/25, copa+arco, 1-confronto, par inédito) — 2026-07-02"
  - "anti-vazamento: cutoff no turno não vaza returno/copa posteriores (4f97cb2a)"
  - "estrutural: ## H2H dentro da fatia Contexto..PARTE 3 que o super-prognosis extrai"
  - "typecheck raiz 3/3 verde (2026-07-02)"
  - "E2E LLM: run-deepseek no 60a3d183 (Sunderland×Chelsea R38) — reasoning citou o precedente de 2025-10-25 (placar, SoT, filme) COM o caveat 'precedente antigo, não é forte pra prever'; persistido em match_prognosis 7df1dfbb (2026-07-02)"
depende_de: [LIG-008]
impacta: [MOD-004]
ancoras:
  settings: []
  tabelas: [match, goal, match_prognosis]
  tools: []
  funcoes: [buildPrompt, contextoUltimos5, teamMatches]
  rotas: []
docs:
  - docs/investigacoes/h2h-clube-prognostico.md
verificado_em: null
atualizado: 2026-07-02
---

# Seção de H2H clube×clube no prognóstico com o detalhe do último confronto

## Descrição

Bloco de **confronto direto entre os dois clubes** no prompt do prognóstico (`prognosis-prompt.ts`, PARTE 2) — retrospecto compacto na janela ingerida (PL 25/26 + 24/25 + copas domésticas, ~4-5 jogos) e, em destaque, **como foi o último encontro**: placar, autores dos gols, HT, arco do jogo (virada/cedeu), SoT e mando. Por entrar entre os marcadores `## Contexto`…`**PARTE 3`, o bloco **herda automaticamente no super prompt** (`super-prognosis.ts` fatia o `prompt_text` persistido). Pro apostador, é o precedente citável que o modelo hoje não enxerga (pares que travam, freguesia). Origem: wishlist W-055.

## Tarefas

- [x] ia — query H2H cross-season (PL 2 seasons + `cupPlayed`, `date < CUTOFF`) + bloco `## H2H` na PARTE 2 no formato do `contextoUltimos5` + autores (`goal ⋈ player`, gol contra rotulado) + data/mando por extenso
- [x] ia — degradação honesta: "N confrontos na janela", SoT só com `hasSot`, "sem confronto direto na janela" pra par inédito/promovido
- [ ] ui — (fase 2) preencher a aba H2H do `match-detail` (hoje placeholder) com endpoint irmão do `get-scorers`

## Evidências

- [código] `apps/api/scripts/prognosis-prompt.ts:1132-1177` — `contextoUltimos5` já monta a linha "como foi" (HT/arco/SoT/posse); template do bloco H2H.
- [código] `apps/api/scripts/super-prognosis.ts:380-385` — super prompt fatia `## Contexto`→`**PARTE 3` do `match_prognosis.prompt_text`: 1 edição cobre as 2 superfícies.
- [código] `apps/web/features/leagues/components/match-detail/match-detail.tsx:160,196-198` — aba H2H fantasma ("Confrontos diretos em breve.").
- [dado] queries de 2026-07-02 — PL 24/25 (sm 23614) ingerida completa (380 resultados, gols em 364, lineups/HT 380, `lineup_player` com SoT 2614 linhas); 0 `match_team_stats`/`match_trend` na 24/25.
- [web] https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/fixtures/get-fixtures-by-head-to-head — endpoint existe; **sonda viva (2026-07-02)**: devolve só as 2 seasons já ingeridas (Arsenal×Liverpool → 4 jogos, league 8) → MVP 100% do banco, sem API.

## Verificação

Feito em 2026-07-02 (faceta `ia`; escada erro→variantes→golden):

- **Par inédito (branch vazio + anti-vazamento):** `bun run scripts/prognosis-prompt.ts 4f97cb2a-…` (Chelsea × Sunderland, o TURNO, cutoff 2025-10-25) → "Sem confronto direto na janela ingerida"; o returno de 2026-05-24 e a copa posteriores existem no banco e **não vazaram**.
- **Só 1 confronto (promovido):** Sunderland × Chelsea (60a3d183) → 1 confronto (o turno), plural correto.
- **Copa + arco:** West Ham × Leeds (77a4255a) → 2 confrontos (turno + **FA Cup 🏆** 2-2 com arco "buscou o empate", SoT 6-8, 4 autores com minuto).
- **Golden path (cross-season):** Tottenham × Everton (f0c7743f) → 3 confrontos incluindo **2024-08-24 da season 24/25 COM SoT 7-1** (o cross-season funciona); retrospecto 2V0E1D · over 2.5 em 3/3 (totais 3/5/4 ✓) · BTTS 1/3 (✓); último confronto destacado com 3 autores (Van de Ven ×2, Sarr).
- **Herança no super prompt (estrutural):** no output gerado, `## H2H` (linha 79) está entre `## Contexto` (54) e `**PARTE 3` (332) — dentro da fatia que o `super-prognosis.ts:381-385` extrai do `prompt_text`.
- `bun run typecheck` raiz 3/3 verde; lint apps/api 0 erros (warnings pré-existentes).

- **E2E do LLM (2026-07-02):** `bun run scripts/run-deepseek.ts 60a3d183-…` (Sunderland × Chelsea, R38) → o reasoning do DeepSeek abriu uma seção "## 2. H2H" citando o precedente de 2025-10-25 (2-1 fora, SoT 4-7, gol cedo do Chelsea + virada nos acréscimos) e aplicou o caveat ("precedente antigo, com possível mudança de elenco/técnico — não é muito forte para prever"). Persistido em `match_prognosis 7df1dfbb…` com o bloco no `prompt_text` (`prompt.md:80`) → o super prompt herda daqui em diante.

**Em aberto pra `status: verificado`:** só a faceta `ui` (aba H2H fantasma do match-detail) — fase 2 declarada.
