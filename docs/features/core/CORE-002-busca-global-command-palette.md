---
id: CORE-002
titulo: Busca global (command palette ⌘K)
modulo: core
status: verificado
prioridade: P2
facetas:
  ui: feito
testada: sim
testes: ["E2E Chrome (2026-06-29): abre por clique e Ctrl+K, filtro fuzzy 'hist'→Histórico, Enter navega e fecha, console limpo"]
depende_de: []
impacta: []
ancoras:
  funcoes: [SidebarSearch]
  rotas: []
docs: []
verificado_em: 2026-06-29
atualizado: 2026-06-29
---

# Busca global (command palette ⌘K)

## Descrição

Botão "Pesquisar" no `SidebarHeader` que abre uma command palette estilo ⌘K
(componente `Command`/`CommandDialog` do shadcn, sobre cmdk). Atalho global
⌘K (Mac) / Ctrl+K (Windows/Linux). Lista os destinos de navegação
(`NAV_SECTIONS`) e as ligas dinâmicas (`useLeaguesNav`) em grupos separados;
o cmdk faz o filtro fuzzy por texto, e selecionar um item navega via
`router.push` e fecha o dialog.

## Tarefas

- [x] ui — instalar `command` do shadcn em `packages/ui` (+ dep `cmdk` na própria UI)
- [x] ui — `SidebarSearch`: botão na sidebar + `CommandDialog` com navegação e ligas + atalho ⌘K/Ctrl+K
- [x] ui — plugar em `AppSidebar` (header, abaixo do logo)

## Evidências

- [código] `apps/web/shared/app-shell/sidebar-search.tsx` — botão + dialog + atalho + navegação.
- [código] `packages/ui/src/components/command.tsx` — `CommandDialog` da versão do registro vinha sem o provider `<Command>`; corrigido envolvendo `{children}` (senão `CommandInput` quebra com `'subscribe' of undefined`).
- [código] `packages/ui/src/components/sidebar.tsx` — `SidebarMenuSkeleton` usa `Math.random()` na largura → hydration mismatch; adicionado `suppressHydrationWarning` (pré-existente, destravava a verificação).

## Verificação

E2E no Chrome (2026-06-29): a paleta abre por clique no botão e por Ctrl+K;
digitar "hist" filtra para só "Histórico · CLV"; Enter navega para `/historico`
e fecha o dialog; sem erros nem warnings no console.
