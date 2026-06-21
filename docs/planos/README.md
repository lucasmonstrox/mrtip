# docs/planos

Saída da skill `/pl`: o **dossiê** de planejamento de uma feature (`<ID>-<slug>.md`) — briefing, estado do terreno, mapa de dependências, blast radius, evidências, detalhes por passo. É a memória do planejamento; o outline executável (`## Plano`) vive no arquivo da feature.

Teste de qualidade: um `/i` em sessão nova, sem contexto, executa sem re-decidir nada. Por isso tudo é por `path:linha` pinado ao commit do cabeçalho do dossiê (ver `.claude/skills/pl/templates/dossie.md`).
