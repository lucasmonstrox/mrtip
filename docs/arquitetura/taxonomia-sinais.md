# Taxonomia de sinais — mapa canônico (2026-06-18)

> Decisão de arquitetura cross-feature. Define **quais sinais existem**, **em que camada cada um atua** e **quem é dono de quê** — para o motor (MOD-001) e o dossiê (DOS-001) não fazerem dupla-contagem. Manda sobre as features individuais; investigação/plano posterior detalha, não re-decide.

## As três camadas (do princípio "estimar ≠ explicar", visão §6)

1. **INGESTÃO/DOSSIÊ (DOS-001)** — coleta e consolida o dado bruto por partida (forma/xG, H2H, lesões, social, odds) com proveniência. Não decide nada; entrega o material.
2. **ESTIMAR (quant, MOD-001)** — sinais que **movem a probabilidade**. Só entra aqui o que sobrevive à validação contra a closing line (camada 3). Cada um precisa de backtest próprio.
3. **EXPLICAR (LLM)** — contexto **narrativo** que o assistente usa pra justificar ("o porquê"), **sem mexer na probabilidade**. É o destino dos sinais de evidência fraca/endógena/não-observável.
4. **VALIDAR (SIN-012, transversal)** — a closing line sharp (Pinnacle/Betfair) + CLV é a âncora que decide se um sinal de camada 2 vira EV+ de verdade ou já está precificado. `impacta` todos os outros.

## Princípio anti-dupla-contagem (o risco nº1)

Muitos sinais **já estão na odd de fechamento** (forma, troca de técnico, lesão pública, crise de vestiário noticiada). Um sinal só ganha peso no **estimar** se, validado contra a CLV (SIN-012), ainda mostra edge. Senão, é **narrativa** (camada 3) ou descartado. Endogeneidade ("vencer gera coesão", "trocam o técnico quando já vão mal") é a armadilha recorrente.

## Mapa dos sinais

### Candidatos a edge quantitativo (camada ESTIMAR — exigem backtest vs CLV)

| ID | Sinal | Prioridade | Força do edge | Dono / fronteira |
|---|---|---|---|---|
| **SIN-009** | Arbitragem (árbitro escalado) | P1 | **Melhor candidato** — maior driver isolado de cartões (~2×), estável, subprecificado | dono do mercado de cartões/booking points |
| **SIN-010** | Motivação/stakes (importância matemática) | P2 | Forte em ligas de baixa liquidez; "mercado precifica reputação, não motivação" | stakes mensuráveis (standings) — distinto das ocasiões emocionais (SIN-005) |
| **SIN-011** | Lesões/desfalques | P2 | Edge de **timing** (janela pós-escalação); goleiro reserva subprecificado | **interpreta** o dado que o DOS-001 **ingere** (dimensão lesões) — ver fronteira abaixo |
| **SIN-007** | Rivalidade (clássico, ex-clube) | P2 | Mais cartões, mando que encolhe; **dona da "lei do ex"** | dono de clássico + **lei do ex** (ver abaixo) |
| **SIN-006** | Clima (condições de campo) | P3 | Chuva forte → under; ambíguo no resto | desloca over/under |
| **SIN-008** | Calendário/fadiga + altitude | P3 | Versão crua é mito (efeito casa/fora); refinada sobrevive; **altitude (Conmebol) é o forte** | under do time ressacado + viés altitude |

### Camada VALIDAR (transversal)

| ID | Sinal | Papel |
|---|---|---|
| **SIN-012** | Mercado / movimento de odds (CLV) | P1 — âncora de probabilidade "verdadeira"; define onde os outros viram EV+; **coração do value bet**. `impacta` todos. |

### Narrativa apenas (camada EXPLICAR — peso ZERO no quant)

| ID | Sinal | Veredito da investigação | Por quê não é quant |
|---|---|---|---|
| **SIN-004** | Relação jogador–treinador | ADIAR | "new manager bounce" ≈ regressão à média; usar como **redutor de confiança** quando amostra do técnico é curta |
| **SIN-001** | Conflitos de elenco | ADIAR | r≈0,19 em elite, **endógeno** (já na odd), sem feed observável |
| **SIN-002** | Interesses comerciais do jogador | ADIAR | contract-year dilui no futebol de elite; parte causal (bônus) confidencial |
| **SIN-005** | Ocasiões especiais (aniversário, homenagem) | DESCARTAR (cauda narrativa) | aniversário é folclore; homenagem é efêmera; **lei do ex cedida à SIN-007** |

### Descartado (nem narrativa)

| ID | Sinal | Por quê |
|---|---|---|
| **SIN-003** | Mood/estado emocional | **Veto LGPD**: inferir estado emocional de indivíduo identificado = dado sensível sem base legal (ANPD); + EU AI Act (PL); + efeito fraco e proxies refutados. **Não criar coluna no schema.** |

## Fronteiras de posse (resolução de sobreposição)

- **"Lei do ex" → SIN-007 (rivalidade)**, exclusivo. SIN-005 NÃO modela (só `is_birthday`/`tribute_context` narrativos). Decisão do dono nesta sessão ("lei do ex é legal") + recomendação dos dois agentes. Mexe em **props de volume de chute do ex-jogador** (mais chutes, não mais precisos — Assanskiy 2022), não em resultado.
- **Lesões — duas camadas, sem duplicar:** DOS-001 **ingere** lesões/escalações (dimensão do dossiê, via SportMonks/API-Football); **SIN-011 interpreta** (direção por posição: atacante fora → under, goleiro/zagueiro fora → over). DOS-001 = dado; SIN-011 = regra.
- **Odds — duas camadas:** DOS-001 **ingere** odds (`match_odds`, em centavos); **SIN-012 valida** (closing line + CLV + anti-dupla-contagem). A investigação de fontes ([docs/investigacoes/dossie-por-partida-fontes-de-dados.md](../investigacoes/dossie-por-partida-fontes-de-dados.md)) mostrou que as casas .bet.br não vêm do The Odds API — SIN-012 herda esse risco aberto.
- **Motivação:** SIN-010 = **stakes matemáticos** (mensurável, quant). SIN-005 = **ocasiões emocionais** (folclore, narrativo). Não confundir.
- **`tabelas: [estadios]`** é âncora compartilhada por SIN-006/007/008 (coords/altitude/cobertura) — alterar o cadastro de estádios re-testa os três.

## Estado das investigações

- **Investigados pelo dono** (docs/regras/): SIN-006..SIN-012 — 7 sinais "mensuráveis", vários com edge real (SIN-009 e SIN-012 são P1).
- **Investigados nesta sessão** (docs/investigacoes/): SIN-001..SIN-005 — 5 sinais "intangíveis/humanos", todos adiar/descartar → narrativa ou veto.
- **Convergência:** a separação estimar/explicar não é teórica — emergiu dos dados. Os intangíveis humanos não têm edge quant; os sinais mensuráveis (árbitro, stakes, lesões, mercado) é que carregam o value bet.

## Perguntas em aberto

- Como o `dossier_snapshot` (DOS-001) separa fisicamente o **bloco quant** (features de SIN-006..012) do **bloco narrativo** (contexto de SIN-001/002/004/005) — duas seções do `content_jsonb`? (decisão pro /pl do DOS-001 ou do MOD-001).
- SIN-011 vs DOS-001: a regra de interpretação de lesão vive em SIN-011 ou no motor (MOD-001)? (fronteira regra×motor a cravar quando MOD-001 for planejado).
- Validação anti-dupla-contagem (SIN-012) precisa de CLV histórico — depende da fonte de odds resolvida em DOS-001 (casas BR em aberto).
