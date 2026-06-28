---
id: SIN-007
titulo: Sinal de rivalidade (clássicos, torcida, ex-clube)
modulo: sinais
status: investigado
prioridade: P2
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: []
impacta: [DOS-001, MOD-001, SIN-016, SIN-009]
ancoras:
  settings: []
  tabelas: [estadios, match]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/rivalidade.md, docs/research/fontes-rivalidade.md, docs/arquitetura/taxonomia-sinais.md, docs/investigacoes/derby-por-formato-de-competicao.md]
verificado_em: null
atualizado: 2026-06-28
---

# Sinal de rivalidade (clássicos, torcida, ex-clube)

## Descrição

Índice de rivalidade por confronto (whitelist + distância de estádios + carga de H2H) e seus efeitos verificados: mais cartões, mando que encolhe, lei do ex. Sob mito: under em clássico e "favorito sempre tropeça".

> **Camada de formato de competição** (investigado 2026-06-28, [derby-por-formato-de-competicao.md](../../investigacoes/derby-por-formato-de-competicao.md)): o efeito derby muda com liga × copa mata-mata × europa, mas o condicionamento é **dados + heurística qualitativa**, não peso quant calibrado (n amostral insuficiente). Pré-requisito é migração de schema (`match` ganha `stage`/`leg`/`aggregate`/`neutral_venue`/regra-de-desempate-versionada) — território de DOS-001. Efeito-copa genérico (knockout menos gols/mando) é **separado** da rivalidade (anti-dupla-contagem). Gol-fora-→-over **refutado**; final neutra **atenua** (não zera) mando.

## Tarefas

- [ ] dados — whitelist (Wikipedia/Wikidata/derby.ist/footballderbies), distância via coords de estádio, transferências (lei do ex).
- [ ] dados — rivalidades **não-locais** (cross-border/nacionais): Wikipedia "club rivalries in Europe" + tier "Rivalries" do footballderbies.
- [ ] dados — schema de formato no `match` (stage/leg/aggregate/neutral_venue/round_name/tiebreak_rule) + include `stage.type;metadata` no sync.
- [ ] ia — over de cartões, desconto no mando do favorito, tilt em props do ex-jogador; explicação.
- [ ] ia — roteador de formato: mando atenua em derby / atenua+assimetria em sede neutra / some na prorrogação; árbitro×nacionalidade em comp. internacional.

## Evidências

- [doc] docs/regras/rivalidade.md — regra completa.
- [doc] docs/research/fontes-rivalidade.md — catálogo de fontes de detecção.
- [doc] docs/investigacoes/derby-por-formato-de-competicao.md — condicionamento por formato (liga/copa/europa), schema gap e o que o counter-review refutou.
