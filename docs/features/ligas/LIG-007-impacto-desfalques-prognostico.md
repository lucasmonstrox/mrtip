---
id: LIG-007
titulo: Impacto dos desfalques no prognóstico da partida
modulo: ligas
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas: # zero-schema: derivado de injury + goal + lineup_player, cortado em match.date
  api: verificado # loadAbsenceImpact + rota /matches/:id/absence-impact (cross-check contra dump do LLM)
  ui: verificado # painel "Impacto dos desfalques" na aba Prognóstico (E2E Chrome, console limpo)
testada: sim # nao | parcial | sim
testes:
  - "api — loadAbsenceImpact(77a4255a West Ham×Leeds) cross-check contra o dump do prognosis-prompt: Okafor 17% gols, com 1.61(28j)/sem 0.44(9j) ▼73%; Traoré 1.44/1.07 ▼26% ⚠️; Stach ▼-94% (marca mais sem ele); total Leeds 27% gols (aditivo 17+10+0+0), cheio 1.89→desfalcado 1.14 ▼40% (2026-06-29)"
  - "typecheck 3/3 (api+ui+ui-pkg) exit 0 + lint 0 erros (2026-06-29)"
  - "E2E Chrome — aba Prognóstico (West Ham×Leeds, autenticado): painel 'Impacto dos desfalques' com West Ham TOTAL 0% (sem agregado) e Leeds TOTAL 27% (42% c/assist) + elenco cheio 1.89→1.14 ▼40%; por jogador Okafor 17%·▼73%, Stach ▲94% verde, ⚠️ nos confundidos; console limpo (só aviso dev-keys Clerk) (2026-06-29)"
depende_de: [] # reusa dados de SIN-011 (desfalques) mas não depende do código dele
impacta: [] # painel aditivo na aba; não altera contratos existentes
ancoras:
  settings: []
  tabelas: [injury, goal, lineup_player] # só LEITURA; nenhuma coluna nova
  tools: []
  funcoes: [loadAbsenceImpact, getAbsenceImpact]
  rotas: [/matches/:id/absence-impact]
docs: []
verificado_em: 2026-06-29 # data, obrigatório quando status: verificado
atualizado: 2026-06-29
---

# Impacto dos desfalques no prognóstico da partida

## Descrição

Na aba **Prognóstico** da página da partida, um painel que mostra **quanto o ataque de cada time depende
de quem está fora**. Por desfalque: a fatia dos gols do time que ele carrega (% gols / % com assistências)
e o **with/without** — gols/jogo do time **com ele** vs **sem ele** (a queda direcional "quanto o time
perde sem ele"), com ⚠️ quando o with/without não é confiável (sem G+A direta ou amostra pequena). No fim,
um **total por time**: a soma dos % de gols (aditiva e honesta — cada gol tem um autor) como headline, mais
o agregado **elenco cheio → com estes fora** (g/jogo quando todos estavam disponíveis vs jogos com algum
ausente), com a ressalva de que quedas individuais não somam linearmente.

É o mesmo sinal de desfalque que já alimenta o prompt do prognóstico (LLM), agora **determinístico,
auditável e cortado em `match.date`** (anti-vazamento), exposto na UI — irmão do card de Descanso
([[LIG-005]]) na mesma aba. Reaproveita os dados de desfalque do [[SIN-011]] por um caminho próprio
(não depende do código dele). Para o apostador: revela **concentração de ataque** — time que depende de 1
cara (desfalque dele derruba o over) vs ataque distribuído.

## Tarefas

- [x] api — `loadAbsenceImpact(matchId)` em `shared/shared.ts` (% gols, with/without por jogador, total
  aditivo + agregado elenco-cheio→desfalcado) + service `get-absence-impact` + rota `GET
  /matches/:id/absence-impact`.
- [x] ui — `AbsenceImpactPanel` em `match-detail/` consumindo `useAbsenceImpactQuery`, renderizado na aba
  Prognóstico após o `RestPanel`.
- [ ] ui — prova visual no Chrome (golden path: partida com desfalques de peso → painel com %, with/without
  e total; console limpo). Bloqueada hoje pelo profile do Chrome do João aberto.

## Evidências

- [código] `apps/api/scripts/prognosis-prompt.ts:188` — a função `absences()` que já calculava esse dado
  (até então só virava texto no prompt do LLM); o painel espelha a mesma matemática.
- [código] `apps/web/.../match-detail/prognosis.tsx` (RestPanel, LIG-005) — o molde: sinal determinístico
  do prompt, recalculado e exposto como card na aba.

## Verificação

E2E no Chrome (2026-06-29), partida West Ham × Leeds (`77a4255a…`), sessão autenticada:

- **Dado correto** — a saída do `loadAbsenceImpact` bate número a número com o `dump.json` que o LLM produziu na run real (duas implementações independentes do mesmo cálculo): Okafor 17% dos gols, com ele 1.61 g/j (28j) / sem ele 0.44 (9j) ▼73%; Traoré 1.44/1.07 ▼26% ⚠️; Stach ▲94% (marca mais sem ele); Gruev 1.52/1.00 ▼34%.
- **UI** — na aba Prognóstico, abaixo do Descanso: West Ham **TOTAL FORA 0%** (ausentes sem G+A → agregado omitido); Leeds **TOTAL FORA 27%** (42% contando assistências) + `elenco cheio 1.89 → com estes fora 1.14 ▼40% · quedas individuais não somam linearmente`. Setas ▼ vermelhas / ▲ verde, ⚠️ nos with/without não confiáveis.
- **Console limpo** (só o aviso benigno de dev-keys do Clerk). typecheck 3/3 + lint 0 erros.
