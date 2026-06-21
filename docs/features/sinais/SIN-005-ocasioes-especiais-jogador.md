---
id: SIN-005
titulo: Sinal — ocasiões especiais (aniversário, homenagem, luto)
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [DOS-001]
impacta: []
ancoras:
  tabelas: []
docs: [docs/investigacoes/sinal-ocasioes-especiais-jogador.md, docs/arquitetura/taxonomia-sinais.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal — ocasiões especiais (aniversário, homenagem, luto)

## Descrição

Sinal intangível: ocasiões especiais que afetam a motivação — aniversário do jogador, jogos-homenagem ou luto (ex.: Benfica jogando inspirado em homenagem a Eusébio), datas simbólicas, jogo contra ex-clube, marcos de carreira. Investigar evidência de "efeito emoção/motivação" na psicologia esportiva e a viabilidade de capturar o sinal por calendário/eventos.

## Tarefas

- [x] dados — investigar fonte e viabilidade do sinal → [investigação](../../investigacoes/sinal-ocasioes-especiais-jogador.md)

## Recomendação (investigado, 2026-06-18)

**Descartar do MVP como sinal próprio.** Quatro sub-sinais com evidência muito desigual:

- **Ex-clube ("lei do ex")** — único com evidência acadêmica (mais chutes contra o ex-time, **quantidade não qualidade**; mais forte p/ quem teve pouca minutagem/corte/dispensa). **Posse cravada na [SIN-007 (rivalidade)](SIN-007-rivalidade.md)** (ver `docs/arquitetura/taxonomia-sinais.md`) → SIN-005 NÃO modela lei do ex (evita dupla-contagem).
- **Homenagem/luto** — efeito agregado real porém **efêmero**: "rally effect" curto que some em poucos jogos (203 mortes 1970–2024, Groningen). Raro + eticamente sensível em produto de apostas.
- **Aniversário no dia do jogo** — **sem evidência confiável: é narrativa** (o "birthday effect" da literatura é o Relative Age Effect, fenômeno distinto).
- **Marcos/testimonial** — sem efeito medido (testimonial é amistoso não-competitivo).

**Fase posterior (opcional):** flags baratas e observáveis (`is_birthday`, `tribute_context`) vindas da SportMonks (custo ~zero) como **metadado de contexto no dossiê (DOS-001)** para o **LLM narrar** — peso **zero** no quant. `vs_former_club` fica com a SIN-007. Caso clássico barato-e-observável-mas-de-sinal-incerto.

## Evidências

- [doc] [docs/investigacoes/sinal-ocasioes-especiais-jogador.md](../../investigacoes/sinal-ocasioes-especiais-jogador.md) — investigação completa (4 sub-sinais + sourcing + modelo de dados).
- [web] https://phys.org/news/2022-07-professional-athletes-clubs.html — Assanskiy et al. 2022: ex-clube gera **mais chutes, não mais precisos** (quantidade ≠ qualidade); efeito maior fora e p/ quem teve pouca minutagem.
- [web] https://ideas.repec.org/a/eee/soceco/v98y2022ics2214804322000532.html — abstract do estudo ex-clube (*J. Behav. Exp. Econ.* 98, 2022); "emoção prevalece sobre tática".
- [web] https://www.rug.nl/ucg/news/2026/new-publicaiton-with-ucg-alumnus?lang=en — Jong-A-Pin & Prandi 2026: luto gera **rally effect curto** (203 casos 1970–2024) que some após poucos jogos.
- [web] https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.01947/full — "birthday effect" da literatura = Relative Age Effect (mês de nascimento vs. corte), **não** jogar no aniversário → aniversário fica sem suporte.
- [web] https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/players/get-all-players — `date_of_birth` + transfers no provedor já adotado em DOS-001: sourcing de custo ~zero.
- [doc] [SIN-007-rivalidade.md](SIN-007-rivalidade.md) — dona da "lei do ex"; fronteira de posse cravada em `docs/arquitetura/taxonomia-sinais.md`.
