---
id: AGT-001
titulo: Leitura de jogo (núcleo agêntico de entendimento)
modulo: agente
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1
facetas:
  ia: investigado # camada EXPLICAR: síntese causal do jogo, sem tocar na probabilidade
testada: nao
testes: []
depende_de: [DOS-001, MOD-001] # lê o dossiê e ancora na probabilidade do quant
impacta: []
ancoras:
  funcoes: []
  tools: []
docs: [docs/investigacoes/leitura-de-jogo-profundidade-dominio.md, docs/investigacoes/agente-selecao-melhor-mercado.md, docs/arquitetura/taxonomia-sinais.md]
verificado_em: null
atualizado: 2026-06-18
---

# Leitura de jogo (núcleo agêntico de entendimento)

## Descrição

O coração da camada **EXPLICAR** (taxonomia-sinais §1, visao-geral §6): o agente que **entende a partida em profundidade** e produz o "porquê". Consome a probabilidade calibrada do motor quant ([[MOD-001]]) — **sem nunca alterá-la** (regra da arquitetura) — mais o dossiê ([[DOS-001]]) e os sinais narrativos (SIN-001/002/004/005), e sintetiza um **read causal de analista**: matchup de estilo, dimensões táticas, métricas além do xG, integração e resolução de conflito entre sinais. Disciplina obrigatória herdada da taxonomia: **causal × endógeno**, anti-dupla-contagem, anti-falácia narrativa. Esta feature nasce de uma investigação de profundidade de domínio (como analistas de verdade leem um jogo).

## Tarefas

- [ ] ia — spec de raciocínio: síntese quant + dossiê + sinais num read causal, por arquétipo de jogo, com grau de profundidade e fontes.

## Evidências

> Investigação `/rs` 2026-06-18. Recomendação: pipeline determinístico, **quant estima / LLM explica**, mercado (CLV) como árbitro. AGT-001 é a metade EXPLICAR; a estimativa/ranking de mercado vive em [[MOD-001]]. A investigação cobre as duas (espinha compartilhada).

- [doc] [docs/investigacoes/leitura-de-jogo-profundidade-dominio.md](../../investigacoes/leitura-de-jogo-profundidade-dominio.md) — **profundidade de domínio da camada EXPLICAR**: como ler o jogo (scout pro, matchup de estilo, métricas além do xG, causal×narrativa, fusão de sinais, arquétipos, pipeline anti-bullshit). Achado central: a leitura tática é **explicativa, não preditiva** — não dá edge além do xG/mercado, então o agente explica e nunca afirma edge (VALIDAR/CLV decide).
- [web] pmc.ncbi.nlm.nih.gov/articles/PMC12640942 + PMC10627876 — EPV/xG/Elo/mercado empatam em RPS pré-jogo; experts têm acurácia sem edge monetário → leitura tática = EXPLICATIVA-NÃO-PREDITIVA por default.
- [doc] [docs/investigacoes/agente-selecao-melhor-mercado.md](../../investigacoes/agente-selecao-melhor-mercado.md) — arquitetura completa do agente (estimar×explicar, seleção de mercado, anti-padrões).
- [web] arxiv.org/abs/2306.13063 + 2410.09724 — LLM descalibrado e confiança não-correlacionada → **EXPLICAR nunca emite número**; ancora no quant.
- [web] arxiv.org/abs/2509.06902 (Proof-Carrying Numbers) + 2603.04663 (Sentinel) — todo número exibido rastreia a uma tool; default não-verificado (sustenta "mostra o porquê").
- [web] daloopa.com + mager.co — padrão de mercado: LLM traduz/explica o que o quant decide (nunca o estimador).
- [web] arxiv.org/abs/2402.10979 — LLM degrada ao renomear jogadores (usa memória, não contexto) → risco da leitura de jogo; mitigar com grounding no dossiê.
- [doc] [docs/arquitetura/taxonomia-sinais.md](../../arquitetura/taxonomia-sinais.md) — disciplina causal×endógeno, anti-dupla-contagem, anti-falácia narrativa.

## Verificação

_(preencher quando status=verificado)_
