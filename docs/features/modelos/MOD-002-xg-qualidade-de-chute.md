---
id: MOD-002
titulo: xG / qualidade de chute (feature central do quant)
modulo: modelos
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [DOS-001] # o xG é ingerido pela dimensão forma/xG do dossiê (backbone SportMonks)
impacta: [MOD-001, MOD-003] # alimenta o rating de força do motor; janela mínima toca a inicialização de promovidos
ancoras:
  settings: []
  tabelas: [match_features, dossier_snapshot] # xG agregado em match_features; dimensão forma/xG no snapshot; tabela shot opcional se shot-level
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/xg-qualidade-de-chute.md]
verificado_em: null
atualizado: 2026-06-21
---

# xG / qualidade de chute (feature central do quant)

## Descrição

MOD-001 trata de ML de previsão de forma genérica; falta cravar o **xG como feature central**: qual modelo de xG usar, quão ruidoso é, pré-chute (xG) vs pós-chute (xGOT), e o fenômeno de **regressão à média** (time/jogador finalizando acima do xG tende a regredir). É a fundação quant da estimativa de gols — define a qualidade de tudo que o motor produz.

## Tarefas

- [ ] dados — provedores de xG/xGOT, granularidade (chute), proveniência, custo, cobertura de ligas.
- [ ] ia — uso de xG vs gols brutos no motor; ajuste de regressão; separação sinal × variância.

## Investigação (2026-06-21)

Dossiê: [docs/investigacoes/xg-qualidade-de-chute.md](../../investigacoes/xg-qualidade-de-chute.md). xG é **insumo do ESTIMAR (quant)**: complementa o feature set do MOD-001 (não substitui), trocando gols brutos por xG na matéria-prima do rating de gols e adicionando xGOT/SGA como features de finalização/goleiro. Decisões cravadas:

- **Alimentar o Dixon-Coles (penaltyblog, já cravado no MOD-001) com xG, não gols** — simular placar via Poisson-Binomial sobre o xG-por-chute → DC time-weighted (técnica Torvaney 2018). xG-ratio vira mais preditivo que gols-ratio após **~7–8 jogos** (ASA 2022) → janela de confiança mínima; abaixo, regride ao prior.
- **Separar papéis (anti-dupla-contagem):** xG (pré-chute) = criação de chance → rating de força; **xGOT/post-shot** = finalização + goleiro (SGA, goals-prevented) → só props, com shrinkage.
- **Regredir over/underperformance à média:** G−xG tem ~zero correlação ano-a-ano e viés de modelo (ASA 2023, KU Leuven 2024) — nunca vira força permanente; só EXPLICAR.
- **Provider = bake-off (não fechar):** finalistas **SportMonks** (backbone, xG add-on €29/mês, BR profundo, licença comercial) + **API-Football** (validação cruzada). Herda DOS-001. FBref morto p/ xG (Opta cortou 20/jan/2026), Understat sem BR, StatsBomb open-data proíbe comercial. Spike obrigatório: confirmar **xG shot-level + xGOT** no tier acessível.
- **xT/VAEP = adiar** (tracking-pesado, fora do MVP); **xPts** = derivável do motor, candidato a narrativa (EXPLICAR).

## Evidências

- [verificado-fetch] https://theanalyst.com/articles/what-are-expected-goals-on-target-xgot — Opta: xG (pré) vs xGOT (pós-chute); SGA = xGOT−xG (finalização); goals-prevented (goleiro).
- [verificado-fetch] https://www.americansocceranalysis.com/home/2022/7/19/the-replication-project-is-xg-the-best-predictor-of-future-results — xG-ratio > gols-ratio após 7–8 jogos (define a janela mínima).
- [verificado-fetch] https://www.americansocceranalysis.com/home/2023/8/28/the-replication-project-measuring-shooting-overperformance — superformance de finalização (G−xG) ~zero correlação ano-a-ano → regride.
- [verificado-fetch] https://dtai.cs.kuleuven.be/sports/blog/biases-in-expected-goals-models-confound-finishing-ability/ — Davis & Robberechts 2024: viés de xG confunde medição de finalização; G−xG não isola skill.
- [verificado-fetch] https://karun.in/blog/expected-threat.html — Karun Singh 2018: xT valoriza ações sem chute (grid 16×12); evolução além do xG.
- [verificado-fetch] https://www.statsandsnakeoil.com/2018/06/22/dixon-coles-and-xg-together-at-last/ — Torvaney: alimentar o Dixon-Coles com xG via placar simulado (Poisson-Binomial).
- [doc] [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](../../investigacoes/dossie-por-partida-fontes-de-dados.md) — matriz de providers de xG (SportMonks recomendado; FBref perdeu xG jan/2026); herdada por MOD-002.
