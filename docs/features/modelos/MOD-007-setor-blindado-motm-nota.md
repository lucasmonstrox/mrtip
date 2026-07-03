---
id: MOD-007
titulo: Setor blindado — MOTM/nota alta no setor do rival como redutor do corredor aberto
modulo: modelos
status: verificado
prioridade: P2
facetas:
  ia: verificado # setorTeam + expectativaPanel (evidence-crossings) → veredito e fatores por jogador
testada: sim
testes:
  - "P1: digest TOT x EVE (2026-07-02) — corredor do Porro sai '🛡️ SETOR BLINDADO (1 MOTM, nota 7.5, tendência +0.3)'"
  - "P2: Expectativa TOT x EVE — 3 fatores 'setor' (Mykolenko -10% blindado; Tel/Udogie +8% O'Brien em queda), aplicados no xSoT/xKP"
  - "P3: evidence-crossings nos 5 jogos da rodada 38 (output/evidence/2026-07-02T11-30-54) — 1 blindado + 2 em-queda com evidência; os 2 CORREDOR ABERTO que batiam com o real preservados"
  - "revisor subagent: A1-A5 ok; bug 'desfalcado blinda' + lado por último-row corrigidos na sessão; typecheck do meu diff verde (falha atual no workspace é W-057 externo em sync-sportmonks)"
depende_de: [MOD-004]
impacta: [MOD-004]
ancoras:
  settings: []
  tabelas: [lineup_player]
  tools: []
  funcoes: [setorTeam, expectativaPanel, evidenceDigestMd]
docs:
  - docs/wishlist.md
verificado_em: 2026-07-02
atualizado: 2026-07-02
---

# Setor blindado — MOTM/nota alta no setor do rival como redutor do corredor aberto

## Descrição

Cruza o painel de **setores** (miolo/corredores do `evidence-crossings`, MOD-004 P9) com a **forma individual de quem ocupa aquele setor no rival**: corredor habitado por jogador em alta (nota alta últ.5, MOTM recorrente, curva de rating subindo) fica **blindado** — o veredito "CORREDOR ABERTO" ganha um redutor clampado, e as previsões por jogador (xSoT/xKP do `expectativaPanel`) de quem ataca aquele setor descontam. O simétrico amplifica: setor defendido por jogador em nota baixa/queda reforça o corredor aberto. Leitura de treinador: não se ataca onde o rival tem o jogador do jogo.

Casos motivadores (rodada 38, sessão 2026-07-02): Porro (nota 7.5 em alta) segurou o corredor que o Everton atacaria — o painel não penalizou quem atacava ali; Mukiele (4 interceptações vs 1.2/90, nota 7.15) blindou a área contra o João Pedro (0 SoT no jogo).

Dado 100% no banco: `lineup_player.rating`/`man_of_match` ingeridos desde o início; `lineup_player.role` (papel por jogo derivado de formation+grid+mando, criado 2026-07-02) diz quem habita cada setor; `setorTeam` já computa nota média dos defensores por corredor.

**Trava anti-dupla-contagem:** a nota média do defensor já entra no veredito de corredor hoje — o sinal NOVO é MOTM count + tendência de nota (últ.3 vs season), nunca empilhar a mesma nota duas vezes.

## Tarefas

- [x] P1 ia — `setorTeam` + `setoresDigest`: MOTM count e curva de nota por corredor defensivo; veredito ganha "SETOR BLINDADO"/"setor em queda"
- [x] P2 ia — `expectativaPanel`: fator `setor` clampado no xSoT/xKP de quem ataca corredor blindado/em queda do rival
- [x] P3 ia — validação na rodada 38: digest dos 5 jogos com os vereditos novos, sem degradar as direções que já acertavam

## Plano

> Plano-mini (esforço P, 1 arquivo, `ia` puro, sem schema). Base: commit `b87c80c` (2026-07-02). Dado já ingerido: `lineup_player.rating`, `lineup_player.man_of_match` (`apps/api/src/db/schemas/leagues.ts#lineupPlayer`), `lineup_player.role` (backfill 21.346 linhas em 2026-07-02). Tudo em `apps/api/scripts/evidence-crossings.ts`.

**Objetivo:** o veredito de corredor e as previsões por jogador passam a enxergar a FORMA de quem habita o setor do rival — MOTM recorrente/nota em alta blinda o setor (redutor), nota em queda amplifica o corredor aberto. Trava anti-dupla-contagem: a nota MÉDIA do defensor já entra no veredito hoje (`setoresDigest#fraco`); o sinal novo é exclusivamente MOTM count + tendência (últ.3 vs season) — nunca reaplicar a média.

**P1 — Readout de forma por corredor + veredito (walking skeleton).** Em `setorTeam` (`evidence-crossings.ts`), o agregado `defAgg` (hoje `notas: number[]` + `min`) ganha `motm` (count de `man_of_match` na season) e `notasL3` (últ.3 jogos com nota, na ordem dos jogos); o tipo `SetorTeam.defesa` expõe `motm` e `tendencia` (média L3 − média season). Em `setoresDigest`, o veredito do corredor atacado incorpora: **BLINDADO** quando o defensor top-minutos do corredor tem `motm ≥ 2` OU (nota média últ.5 ≥ 7.2 E tendência ≥ +0.2) → suprime a tag "CORREDOR ABERTO" e anota `🛡️ SETOR BLINDADO (dado)`; **EM QUEDA** quando tendência ≤ −0.4 → reforça a tag com o dado. Thresholds são defaults ajustáveis — cravados aqui pra P3 medir.
  - **Prova:** `cd apps/api && bun -e "import{evidenceDigestMd}from'./scripts/evidence-crossings';console.log(await evidenceDigestMd('f0c7743f-3eaf-42ed-805b-d745dc4c4fb9'));process.exit(0)"` → a seção `### Setores` do Tottenham x Everton imprime o corredor do Everton atacando (defendido por Porro, nota 7.5 em alta) com `🛡️ SETOR BLINDADO`, citando MOTM/tendência; exit 0.

**P2 — Fator `setor` nas previsões por jogador.** `expectativaPanel` recebe o `SetorTeam` do RIVAL (novo parâmetro opcional, computado uma vez em `evidenceDigestMd`/`analyze` — hoje `setorTeam` já é chamado lá; reordenar pra reusar, não computar 2x). Pra cada jogador do XI com corredor identificável (via `lineup_player.role` dominante na season: ponta/lateral/ala/meia-pela-X → esquerda/direita), cruza com o corredor espelhado do rival: blindado → fator `setor` 0.90 no xSoT e xKP; em queda → 1.08; clamp e formato de evidência iguais aos fatores existentes (`Factor{k:"setor", v, ev}` com nome do defensor + MOTM/tendência). Papel central (volante/zagueiro/meia central/9) não recebe o fator — setor central fica fora do escopo (checkbox futuro se render).
  - **Prova:** mesmo comando do P1 → na seção `### Expectativa por jogador`, ≥1 jogador do Everton que ataca o corredor do Porro lista `setor -10% [Porro ...]` nos fatores; exit 0.

**P3 — Validação rodada 38 (não-regressão).** Rodar `bun run scripts/evidence-crossings.ts` (3 default) + os ids do Forest x Bournemouth (`21b6ffa6-…`) e Liverpool x Brentford (`e48a0228-…`); conferir no HTML/digest que (a) os vereditos novos aparecem com evidência, (b) nenhuma direção de painel D/E que batia com o placar real inverteu por causa do fator (checagem manual dos 5, registrada nos `testes:` do frontmatter).
  - **Prova:** `bun run scripts/evidence-crossings.ts 21b6ffa6-4ba8-42e1-b584-f92a01148c90 e48a0228-e381-42d3-8ce9-c1a84c0009c0` → HTML gerado (path impresso, exit 0) com painel E mostrando 🛡️/queda onde há dado.

**Adiado de propósito pro `/i`:** micro-forma dos thresholds (7.2/+0.2/−0.4/0.90/1.08) pode ser calibrada se o P3 mostrar exagero — mudar valor não muda desenho. **Fora de escopo:** setor central (miolo) e superfície UI (family W-014).

**Verificação:** as 3 Provas acima + `bun run typecheck` verde no workspace api.

## Evidências

- [código] `apps/api/scripts/evidence-crossings.ts` — `setorTeam` computa corredores + nota média dos defensores; `expectativaPanel` tem o padrão de fatores clampados com evidência.
- [código] `apps/api/src/db/schemas/leagues.ts` — `lineup_player.rating`, `man_of_match`, `role` (papel por jogo) já ingeridos.
- [doc] docs/wishlist.md — origem W-056 (promovida em 2026-07-02) com os casos Porro/Mukiele.

## Verificação

Feito em 2026-07-02, seguindo a Verificação final do Plano:
- **P1** — `bun -e "…evidenceDigestMd('f0c7743f-…')"`: seção Setores imprime *"corredor direita do Tottenham defendido por Pedro Porro (nota 7.5 últ.5) → 🛡️ SETOR BLINDADO (Pedro Porro: 1 MOTM na season, nota 7.5 últ.5, tendência +0.3)"* — o caso exato do plano.
- **P2** — mesma run: 3 fatores `setor` na Expectativa (Mykolenko `setor -10% [corredor direita do rival BLINDADO — Porro…]`; Tel e Udogie `+8%` pelo O'Brien em queda), multiplicando xSoT e xKP.
- **P3** — `bun run scripts/evidence-crossings.ts <5 ids da rodada 38>` → `output/evidence/2026-07-02T11-30-54/evidencias.html`: 1 blindado (Porro) + 2 corredores em queda (O'Brien, Kayode) com evidência; os 2 CORREDOR ABERTO que batiam com o placar real (Spurs×Mykolenko; Forest×Smith) preservados — nenhuma direção correta invertida.
- **Revisor (subagent, contexto fresco)** — A1–A5 aprovados; 2 achados corrigidos na sessão: desfalcado não pode blindar (agora `defs.find(d => !d.inj)`) e corredor do defensor passa a ser o lado DOMINANTE por minutos (`sideMin`), não o último row do SQL; nit da tendência null ("s/d") corrigido. Nit restante (empate de minutos no `roleDom` decide arbitrário) registrado, impacto raro.
- **Typecheck** — verde com o diff do MOD-007; a falha atual do workspace (`sync-sportmonks.ts: preferredFootOf`) é trabalho externo em andamento (W-057), fora deste diff.
