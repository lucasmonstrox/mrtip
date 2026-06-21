# Plano — App Shell + Sidebar (com expander)

> Briefing de codificação da fundação de UI: o **app-shell** (sidebar colapsável +
> header + área de conteúdo) que todas as telas de produto vão habitar. É infra
> compartilhada (cross-feature), não uma feature de `docs/features/` — por isso
> mora em `apps/web/shared/app-shell/`, espelhando o padrão validado do
> **marketero**. As páginas entram como **stubs TODO** (só o link no rail + uma
> `page.tsx` placeholder), pra navegação funcionar de ponta a ponta antes de
> qualquer feature ser implementada.
>
> Status: **planejado** · Superfície: UI (web) · Blast radius: novo código, zero
> features existentes tocadas (greenfield).

---

## 1. Objetivo

Entregar o shell idêntico ao do marketero — sidebar `collapsible="icon"`, header
fino com breadcrumb, footer com theme-toggle + user menu, e **o mesmo expander**
(a barrinha `|` na borda que vira chevron no hover) — e plugar nele os destinos
de navegação que o **design system do mrtip** já define
(`docs/ui/design-system/padroes-layouts-acessibilidade.md` §2), cada um como uma
página placeholder.

Critério de pronto: subir `bun run dev`, ver a sidebar, colapsar/expandar pelo
expander **e** pelo `Ctrl/Cmd+B`, navegar entre todas as rotas do rail (cada uma
renderiza um stub "em construção"), alternar tema, e o estado da sidebar
persistir no refresh. Verificação real no Chrome (chrome-devtools MCP), conforme
CLAUDE.md.

---

## 2. Estado atual (greenfield)

- `apps/web/app/` → só `layout.tsx` (root) + `page.tsx` (boilerplate) + favicon.
- `packages/ui/src/components/` → só `button.tsx`. **Sem `sidebar.tsx`.**
- `packages/ui/src/styles/globals.css` → **já tem** os tokens `--sidebar`,
  `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-accent`,
  `--sidebar-border`, `--sidebar-ring` (paleta neutra default do shadcn) e o
  bloco `@theme inline` que os expõe como `--color-sidebar-*`. **Não precisa
  mexer em token pra funcionar.**
- `exports` do `@workspace/ui` já mapeia `./components/*` e `./hooks/*`.
- `lucide-react`, `next-themes`, `radix-ui`, `shadcn` (CLI) já instalados.
- `apps/web/components/theme-provider.tsx` **já existe** (next-themes + hotkey
  `d` pra alternar tema). Vamos reusar, não recriar.

Conclusão: o trabalho é (a) adicionar o componente `sidebar` do shadcn na UI,
(b) portar 1:1 os arquivos do shell do marketero adaptando 2 detalhes de token,
(c) criar a árvore de rotas com stubs.

---

## 3. Diferenças de adaptação marketero → mrtip (atenção)

O shell do marketero é colável quase 1:1. Os **únicos** pontos que mudam:

1. **Token de cor do expander.** O `sidebar-expander.tsx` usa `text-accent-brand`
   / `hover:bg-accent-brand/10`. Como vamos **portar a paleta estudada** do
   marketero (índigo/violeta — ver §8), o token `--accent-brand` passa a existir
   no mrtip → **mantemos as classes 1:1**, sem adaptação. (Só precisamos mapear
   `--color-accent-brand` no bloco `@theme inline` do `globals.css`, que vem junto
   com a paleta — §8.)
2. **Active state do menu.** A classe `data-active:bg-sidebar-primary!…` do
   marketero funciona com qualquer paleta (usa `--sidebar-primary`), então
   **mantemos como está** — fica com o cinza-escuro neutro do mrtip por ora.
3. **Providers.** O marketero tem `shared/providers.tsx` (ThemeProvider +
   TooltipProvider + Toaster). O mrtip já tem `ThemeProvider` em
   `components/theme-provider.tsx`. → Criar `shared/providers.tsx` que **envolve
   o ThemeProvider existente** e adiciona `TooltipProvider` (necessário pros
   tooltips dos itens colapsados) + `Toaster`. O root `layout.tsx` passa a usar
   `<Providers>` no lugar de `<ThemeProvider>` direto.
4. **Logo.** Sem asset de marca → `Logo` textual "mrtip" + um ícone lucide
   (sugestão: `Goal` ou `Trophy`), com `group-data-[collapsible=icon]:hidden` no
   texto (some no modo ícone). Placeholder, marcado TODO.
5. **`lang`** do `<html>`: `en` → `pt-BR`.

---

## 4. Arquitetura de arquivos a criar

Espelha `marketero/apps/web/shared/app-shell/`.

```
apps/web/
├── app/
│   ├── layout.tsx                    # EDIT: trocar <ThemeProvider> por <Providers>, lang=pt-BR
│   └── (app)/                        # NEW grupo de rotas com o shell
│       ├── layout.tsx                # NEW SidebarProvider + AppSidebar + SidebarInset + AppHeader
│       ├── page.tsx                  # NEW Hub da Rodada (stub TODO)
│       ├── jogo/page.tsx             # NEW Dossiê — índice (stub TODO)
│       ├── historico/page.tsx        # NEW Histórico · CLV (stub TODO)
│       ├── assistente/page.tsx       # NEW Assistente (stub TODO)
│       ├── jogo-responsavel/page.tsx # NEW Jogo Responsável (stub TODO)
│       ├── conta/page.tsx            # NEW Conta / Assinatura (stub TODO)
│       └── configuracoes/page.tsx    # NEW Configurações (stub TODO)
│
└── shared/                           # NEW infra cross-feature (padrão marketero)
    ├── providers.tsx                 # ThemeProvider(existente) + TooltipProvider + Toaster
    └── app-shell/
        ├── nav.ts                    # NAV_SECTIONS + titleForPath() — fonte da navegação
        ├── app-sidebar.tsx           # Sidebar (header/content/footer) + <SidebarExpander/>
        ├── app-header.tsx            # header fino: SidebarTrigger(mobile) + breadcrumb
        ├── sidebar-expander.tsx      # ★ o expander, 1:1 do marketero (token adaptado)
        └── user-menu.tsx             # dropdown de usuário no footer (placeholder)

apps/web/shared/ui/
        ├── logo.tsx                  # NEW wordmark textual "mrtip" (placeholder)
        ├── theme-toggle.tsx          # NEW botão sol/lua (usa next-themes)
        └── page-container.tsx        # NEW wrapper das páginas-documento (max-w + scroll)

packages/ui/src/components/
        └── sidebar.tsx               # NEW via `bunx shadcn add sidebar -c apps/web`
        └── (dependências shadcn: sheet, tooltip, separator, breadcrumb,
              dropdown-menu, avatar, skeleton, input, sonner — vêm junto/ a pedir)
```

> `app/page.tsx` boilerplate atual será movido pra dentro de `(app)/page.tsx`
> como Hub. O grupo `(app)` não afeta a URL — `(app)/page.tsx` = `/`.

---

## 5. O expander (cópia fiel — o ponto que você pediu "igualzinho")

`shared/app-shell/sidebar-expander.tsx` é portado **1:1** do marketero. Mecânica:

- `useSidebar()` → `{ state, toggleSidebar, isMobile }`.
- `isMobile` → não renderiza (no mobile quem abre é o `SidebarTrigger` do header).
- Botão `fixed top-1/2`, grudado na borda: `left-(--sidebar-width)` quando
  aberto, `left-(--sidebar-width-icon)` quando colapsado, com transição em `left`.
- SVG de 2 linhas (`|`) que, no hover, rotacionam ±17° e formam um chevron —
  aponta pra dentro (recolher) quando aberto, pra fora (expandir) quando fechado.
- Clique → `toggleSidebar()` (que grava o cookie `sidebar_state`, 7 dias).

**Única mudança:** as classes de cor `text-accent-brand…` viram
`text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground`.
Geometria, rotação, timing e posicionamento — **idênticos**.

---

## 6. Navegação — páginas como TODO (só os links)

`nav.ts` define `NAV_SECTIONS` (grupos rotulados, igual marketero) + helper
`titleForPath()` pro breadcrumb. Cada rota aponta pra uma `page.tsx` que é um
**stub "🚧 em construção"** com o título e a feature de origem — zero lógica.

Origem das telas: design system §2 (3 destinos canônicos de produto) + visão de
produto. Rail proposto (recomendação — ajustável):

| Seção | Item (label) | Rota | Ícone (lucide) | Origem / o que será |
|---|---|---|---|---|
| _(sem label)_ | **Hub da Rodada** | `/` | `Trophy` | DOS-001/MOD-002/SIN-012 — grid de value bets (EV+) da rodada |
| Análise | **Dossiê do Jogo** | `/jogo` | `FileSearch` | DOS-001/MOD-* — o "porquê" do pick; índice → `/jogo/[matchId]` depois |
| Análise | **Histórico · CLV** | `/historico` | `LineChart` | SIN-012 — prova de honestidade: CLV, yield, calibração, ledger |
| Assistente | **Assistente** | `/assistente` | `Sparkles` | AGT-001/AGT-002 — chat em linguagem natural com fontes |
| Sistema | **Jogo Responsável** | `/jogo-responsavel` | `ShieldCheck` | COMP-001 — limites prudenciais, autoexclusão |
| Sistema | **Conta** | `/conta` | `UserCircle` | visão §8 — perfil + assinatura (gate +18) |
| Sistema | **Configurações** | `/configuracoes` | `Settings` | preferências do app |

**Fora do rail MVP (anotado como TODO no `nav.ts`, comentado):**
- **Admin** (`/admin/operadores`, `/admin/conformidade`, `/admin/ingestao`) — o
  design system §2.4 trata admin como **shell separado**; criamos as rotas como
  stub mas **não** no rail principal (entram num grupo "Admin" condicional depois).
- **Fases 2/3** (perfil público de tipster, feed/seguir, marketplace, alertas) —
  sem feature em `docs/features/` ainda; ficam como comentário `// TODO fase 2`.

> ⚠️ **Decisão sua (vale 5 min):** o design system canônico prega um rail
> **enxuto de 3** (Hub · Dossiê · Histórico). A tabela acima é a versão "rica"
> (7 itens), tratando Conta/Jogo Responsável/Configurações como itens de rail em
> vez de topbar. Vou deixar o `nav.ts` montado com a versão rica **mas com os 3
> canônicos no topo**, e os demais agrupados — é trivial você comentar/remover
> itens. Marquei o ponto exato no arquivo. (Ver §10.)

---

## 7. Layout / providers (cola do marketero)

- **`app/layout.tsx`** (edit): `lang="pt-BR"`, `<Providers>{children}</Providers>`.
- **`shared/providers.tsx`** (new): `ThemeProvider` (o existente) →
  `TooltipProvider delayDuration={200}` → `{children}` + `<Toaster>`.
- **`app/(app)/layout.tsx`** (new): exatamente o do marketero —
  `<SidebarProvider className="h-svh overflow-hidden">` → `<AppSidebar/>` →
  `<SidebarInset className="overflow-hidden">` → `<AppHeader/>` + `<main>`.
- **`app-sidebar.tsx`**: `<Sidebar collapsible="icon">` com header(Logo) /
  content(map de `NAV_SECTIONS` → grupos → `SidebarMenuButton` com `isActive` por
  `pathname`) / footer(ThemeToggle + UserMenu), e `<SidebarExpander/>` irmão.
- **`app-header.tsx`**: `SidebarTrigger` (só `md:hidden`) + `Separator` +
  `Breadcrumb` com `titleForPath(pathname)`.
- **`user-menu.tsx`**: dropdown com avatar de iniciais + e-mail placeholder +
  itens "Preferências"/"Sair" **disabled** (auth é leva futura).

---

## 8. Tema — paleta acinzentada/tintada (parte do escopo, não TODO)

**Decisão fechada pelo João:** nada de branco chapado nem dark "preto". O tema
padrão (claro) é **acinzentado e tintado**, com a paleta **já estudada** do
marketero. Vou portar os tokens OKLCH do
`marketero/packages/ui/src/styles/globals.css` para o
`mrtip/packages/ui/src/styles/globals.css`, substituindo a paleta neutra atual:

- **Canvas claro tintado (não branco):** `--background: oklch(0.99 0.003 286)`
  (quase-branco com viés frio), `--foreground: oklch(0.21 0.02 286)`. Cards/popover
  herdam o mesmo viés frio em vez de `oklch(1 0 0)`.
- **Marca índigo (autoridade):** `--primary: oklch(0.45 0.17 264)`.
- **Accent-brand violeta (energia/IA):** `--accent-brand: oklch(0.55 0.21 292)`
  + mapear `--color-accent-brand` / `--color-accent-brand-foreground` no
  `@theme inline` (é o que o expander e elementos de IA usam).
- **Sidebar índigo-profundo** com texto claro e item ativo violeta
  (`--sidebar`, `--sidebar-primary`, `--sidebar-accent`, …), exatamente como o
  estudo. Isso dá o contraste "rail escuro / canvas claro tintado".
- **Status:** `--success`/`--warning`/`--info`/`--destructive` da mesma fonte.
- **Dark mode** continua existindo (hotkey `d`), mas é um índigo-quase-preto
  tintado (`oklch(0.18 0.015 286)`), **não** preto puro — também copiado do estudo.

Resultado: o shell já nasce com a identidade visual, sem etapa de "definir marca
depois". Nenhum componente muda — só os tokens do `globals.css`.

> Nota de verificação: como hoje o `globals.css` do mrtip tem só `--sidebar*` e
> `chart` neutros, o port precisa **adicionar** as variáveis novas (`accent-brand`,
> `success`, etc.) tanto em `:root`/`.dark` quanto no mapa `@theme inline`. Conferir
> no Chrome que canvas não está branco (`oklch(1 0 0)`) e a sidebar está escura.

---

## 9. Passos de execução (com prova)

1. **Adicionar sidebar shadcn** → `bunx shadcn@latest add sidebar -c apps/web`
   (da raiz). Puxa `sidebar.tsx` + deps (sheet, tooltip, separator, skeleton,
   input, `use-mobile`). **Prova:** `sidebar.tsx` existe em
   `packages/ui/src/components/` e `bun run typecheck` passa.
2. **Adicionar deps shadcn restantes** → `breadcrumb dropdown-menu avatar sonner`
   (mesmo comando). **Prova:** arquivos presentes.
3. **Portar a paleta acinzentada/tintada** (§8) pro `packages/ui/src/styles/
   globals.css`: substituir os tokens neutros de `:root` e `.dark`, adicionar
   `accent-brand`/`success`/etc. e mapeá-los no `@theme inline`. **Prova:** no
   Chrome, `getComputedStyle(document.body).backgroundColor` ≠ branco puro.
4. **`shared/providers.tsx`** + editar `app/layout.tsx` (lang + Providers).
   **Prova:** `bun run dev` sobe sem erro de hidratação.
5. **`shared/ui/`**: `logo.tsx`, `theme-toggle.tsx`, `page-container.tsx`.
6. **`shared/app-shell/`**: `nav.ts` → `sidebar-expander.tsx` →
   `user-menu.tsx` → `app-header.tsx` → `app-sidebar.tsx`.
7. **Rotas**: `(app)/layout.tsx` + 7 `page.tsx` stubs (mover boilerplate p/ Hub).
8. **`bun run typecheck && bun run lint`** limpos.
9. **Verificação Chrome (chrome-devtools MCP)** — golden path:
   - `navigate_page` → `/`; `take_snapshot` confirma sidebar + itens.
   - `click` no expander → colapsa pra ícones; `take_screenshot`.
   - hover no expander → chevron (visual); clicar de novo → expande.
   - `Ctrl/Cmd+B` → também alterna (atalho do shadcn).
   - navegar por cada rota do rail → cada stub renderiza + breadcrumb muda +
     item ativo destaca.
   - toggle de tema (botão + hotkey `d`).
   - refresh → estado da sidebar persiste (cookie).
   - `list_console_messages` / `list_network_requests` → sem erro.
   - Se o chrome-devtools não estiver disponível na sessão, **digo isso
     explicitamente** em vez de afirmar que funciona.

---

## 10. Sua contribuição (decisão que molda a feature)

Antes do passo 5, vou deixar `shared/app-shell/nav.ts` **montado** com a estrutura
(`NavItem`/`NavSection`/`titleForPath`) e a versão recomendada de `NAV_SECTIONS`,
com um bloco marcado:

```ts
// ┌─ DECISÃO DE NAVEGAÇÃO — ajuste aqui ────────────────────────────
// Versão "rica" (7 itens) abaixo. Para o rail enxuto do design system,
// mantenha só a 1ª seção (Hub · Dossiê · Histórico) e mova o resto p/ topbar.
export const NAV_SECTIONS: NavSection[] = [ /* ... */ ]
// └──────────────────────────────────────────────────────────────────
```

Você decide: **rail enxuto (3, fiel ao DS)** vs **rail rico (7)**, e os ícones.
São ~5 linhas que definem a espinha da navegação. Default que vou deixar: **rico
com os 3 canônicos no topo** — você corta o que não quiser.

---

## 11. Fora de escopo

- Conteúdo real de qualquer página (são stubs). Cada tela vira feature via
  `/pl` → `/i` depois.
- Autenticação, assinatura, gate +18 (leva futura — itens do user-menu `disabled`).
- _(Tema de marca agora ESTÁ no escopo — §8.)_
- Admin shell separado e telas de Fase 2/3 (rotas stub sem rail).
