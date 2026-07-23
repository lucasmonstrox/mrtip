---
id: LIG-024
titulo: Abas do dossiê da partida como páginas (URL por aba)
modulo: ligas
status: em-andamento
prioridade: P2
facetas:
  ui: em-andamento # /matches/[slug]/[tab]; nav por Link; redirect sem aba → /fatos
testada: nao
testes: []
depende_de: [LIG-009]
impacta: []
ancoras:
  settings: []
  tabelas: []
  tools: []
  funcoes: [MATCH_TABS, isMatchTabValue, MatchDetail]
  rotas: []
docs: []
verificado_em: null
atualizado: 2026-07-23
---

# Abas do dossiê da partida como páginas (URL por aba)

## Descrição

As 10 abas do dossiê (Fatos, Escalação, H2H, Gols, Notícias, Prognóstico, Momentum, Estatísticas, Eventos, Narração) deixam de ser só estado React e passam a ser **rotas** `/matches/[slug]/[tab]`. Refresh e link compartilhado abrem a aba certa; `/matches/[slug]` redireciona pra `/fatos`.

## Tarefas

- [x] ui — extrair `MATCH_TABS` / `MatchTabValue` pra validação server+client
- [x] ui — redirect `/matches/[slug]` → `/matches/[slug]/fatos`
- [x] ui — page `/matches/[slug]/[tab]` com `notFound` pra aba inválida
- [x] ui — `MatchDetail` controlado por `tab` + Links na barra
- [ ] ui — prova browser (deep-link, refresh, redirect, 404)

## Pronto quando

- Abrir `/matches/<slug>/prognostico` mostra Prognóstico sem clique
- Refresh na mesma URL mantém a aba
- `/matches/<slug>` cai em `/fatos`
- Aba inventada → 404
- Links legados `/matches/<slug>` (rounds, time, search) continuam funcionando via redirect
