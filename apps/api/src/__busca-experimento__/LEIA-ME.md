# Experimento descartável — estilo de comentário × busca do SocratiCode

**Objetivo:** medir qual estilo de comentário de linha em service faz o SocratiCode
(busca híbrida: semântica/embeddings + BM25/keyword) recuperar melhor a função.

**Controle:** corpo de código **idêntico** dentro de cada conceito e nomes **neutros**
(`calcA*`, `calcB*`) — assim a única variável que muda entre as 5 variantes é o comentário.
Nomes de arquivo neutros (a1..a5, b1..b5) pra não vazar o estilo no path indexado.

## Conceito A — probabilidade de over 2.5 gols via Poisson

| Arquivo | Estilo do comentário |
|---|---|
| a1.ts | **sem comentário** (controle) |
| a2.ts | **keywords** (bag of words) |
| a3.ts | **explicação curta** (1 linha) |
| a4.ts | **explicação média** (2 linhas) |
| a5.ts | **explicação longa** (parágrafo JSDoc) |

## Conceito B — ajuste de gols por desfalque do artilheiro

| Arquivo | Estilo do comentário |
|---|---|
| b1.ts | sem comentário |
| b2.ts | keywords |
| b3.ts | explicação curta |
| b4.ts | explicação média |
| b5.ts | explicação longa |

## Hipótese pré-registrada

- Query **conceitual** (sem os termos do código) → variantes de **explicação** (curta/média)
  ranqueiam acima de keywords e de sem-comentário (canal semântico).
- Query de **keyword exata** → **keywords** e **média** ajudam o BM25.
- **Sem comentário** → mais fraco em query conceitual.
- **Longo** → pode diluir levemente vs médio/curto.
- `codebase_symbols` (busca por nome) → indiferente ao comentário.

> Pasta descartável. Apagar depois do teste (`rm -r apps/api/src/__busca-experimento__`).
