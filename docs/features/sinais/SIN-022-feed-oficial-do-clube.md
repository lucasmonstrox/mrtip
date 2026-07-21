---
id: SIN-022
titulo: Feed oficial do clube (X/Twitter) como fonte de notícia
modulo: sinais
status: em-andamento # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: feito # handle institucional dos 24 clubes do Brasileirão 25+26 na coluna team.twitter_username (migração 0040); 24/24 preenchidos
  api: feito # getTeamBySlug devolve twitterUsername cru (sem @, sem URL) → flui pro getTeam via spread
  ia: ideia # extrair desfalque/clima de vestiário/escalação vazada do texto do tweet — alimenta o prognóstico (MOD-004). Via de acesso ao X NÃO resolvida (API paga/gated)
  ui: feito # link externo no header da página do time (target=_blank + rel=noopener), some quando o handle é null
testada: sim
testes:
  - "Coluna team.twitter_username criada e aplicada: assert em information_schema.columns (text, nullable) (2026-07-21)"
  - "Backfill 24/24 clubes do Brasileirão 25+26; query de controle 'clubes sem handle' = 0 (2026-07-21)"
  - "API: getTeam devolve @Flamengo, @ECVitoria, @RedBullBraga; Arsenal (fora do BRA) devolve null sem quebrar — scripts/_check-twitter-api.ts (2026-07-21)"
  - "UI no navegador (agent-browser, logado): /teams/flamengo → href https://x.com/Flamengo, target=_blank, rel='noopener noreferrer'; /teams/bragantino → @RedBullBraga; /teams/arsenal → 0 links x.com e header intacto; 0 erro de console (2026-07-21)"
depende_de: []
impacta: [LIG-002] # página do time consome o handle pra exibição; re-testar o header se a coluna mudar
ancoras:
  settings: []
  tabelas: [team] # coluna team.twitter_username é posse desta feature
  tools: []
  funcoes: [getTeamBySlug] # compartilhada com LIG-002/LIG-008: mexer aqui pede re-teste da página do time
  rotas: ["/teams/:slug"]
docs: []
verificado_em: null
atualizado: 2026-07-21
---

# Feed oficial do clube (X/Twitter) como fonte de notícia

## Descrição

Guardar o handle do X/Twitter da conta institucional de cada clube pra abrir duas portas: **ler o feed oficial como fonte de notícia** (desfalque, clima de vestiário, escalação vazada — a evidência narrativa que a tese do projeto exige antes de apostar) e **exibir o link** no perfil do time. A fonte é o próprio clube, não imprensa: é onde a informação sai primeiro e sem interpretação de terceiro.

A coluna existe porque a **SportMonks não entrega social em nenhum endpoint do nosso tier** (confirmado no inventário completo) — o preenchimento é pesquisado à mão, cruzando o site oficial do clube com Wikipédia/Wikidata.

Entregue: **o dado + a exibição**. Coluna com os handles dos 24 clubes que jogaram Brasileirão 2025 ou 2026, e o link externo no header da página do time. **A leitura dos tweets NÃO está feita** — e não é só codar: o acesso à API do X é pago/gated hoje, então a via precisa ser resolvida antes de qualquer implementação. A coluna é o pré-requisito dela, não a feature.

## Tarefas

- [x] dados — coluna `team.twitter_username` (text, nullable) + migração `0040_glorious_ink.sql`
- [x] dados — backfill dos 24 clubes do Brasileirão 2025 + 2026 (`scripts/_backfill-twitter.ts`)
- [x] api — `getTeamBySlug` devolve o handle cru; `getTeam` propaga via spread
- [x] ui — link externo do X no header da página do time
- [ ] dados — handle dos clubes da PL/copas (hoje só Brasileirão tem cobertura; Arsenal & cia. = null)
- [ ] ia — ler o feed e extrair sinal (desfalque, clima, escalação); **definir a via de acesso ao X antes**

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts` — `team` é deduplicada por `sportmonksTeamId`, logo o handle é 1-por-clube, season-agnostic (não 1-por-temporada)
- [doc] `docs/investigacoes/sportmonks-inventario-completo.md` — zero menção a social/twitter: confirma que o dado não vem da API e precisa ser pesquisado
- [código] `apps/api/scripts/_backfill-twitter.ts` — os 24 handles com o nível de confiança de cada verificação

## Verificação

**`dados`** — migração `0040` aplicada e conferida em `information_schema.columns` (text, nullable). Backfill 24/24, com a query de controle "clubes do Brasileirão sem handle" devolvendo 0.

**`api`** — `scripts/_check-twitter-api.ts` chama `getTeam` direto (a rota HTTP exige token Clerk): Flamengo→`@Flamengo`, Vitória→`@ECVitoria`, Bragantino→`@RedBullBraga`, Arsenal→`null` sem quebrar.

**`ui`** — navegador real (agent-browser, sessão autenticada) em `/teams/flamengo`: `href=https://x.com/Flamengo`, `target=_blank`, `rel="noopener noreferrer"`. `/teams/bragantino` traz `@RedBullBraga`. `/teams/arsenal` (handle null) renderiza 0 link `x.com` com o header intacto. Nenhum erro de console.

**Sobre a verificação dos handles** — 24 clubes pesquisados por agentes independentes cruzando o site oficial do clube com Wikipédia/Wikidata (P2002). 5 deles (Corinthians, Palmeiras, Chapecoense, Sport, Coritiba) tiveram o site oficial bloqueando fetch, então a autoridade primária foi Wikidata + busca, não o site do clube. Bahia/Vitória/Bragantino foram confirmados por **dois agentes independentes** que chegaram ao mesmo handle.

**Ressalvas conhecidas**

1. **Tudo isto é ambiente de desenvolvimento.** Migração aplicada no banco de dev e backfill rodado contra ele. Pra valer em produção, falta aplicar a `0040` e rodar `_backfill-twitter.ts` contra o banco de prod.
2. **A suíte E2E do repo está vermelha por motivo alheio a esta feature.** O login manual no navegador para em `/sign-in/client-trust` (verificação de dispositivo do Clerk) e só passa com o código de teste `424242`. A causa **provável** — não rastreada até a raiz — é o `clerk.signIn` do `@clerk/testing` não atravessar essa etapa. `e2e/team-twitter.spec.ts` está escrito e correto mas falha por isso, exatamente como o `rounds-tab.spec.ts` que já existia.
