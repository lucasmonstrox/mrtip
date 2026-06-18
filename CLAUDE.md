# CLAUDE.md

Este arquivo fornece orientação ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Comandos

O gerenciador de pacotes é o **bun 1.2.20**; o executor de tarefas é o **turbo**. Rode a partir da raiz do repositório, salvo indicação contrária.

- `bun install` — instala as dependências do workspace.
- `bun run dev` — inicia todos os servidores de desenvolvimento (`next dev --turbopack` para `apps/web`).
- `bun run build` — builda todos os workspaces.
- `bun run lint` — ESLint em todos os workspaces.
- `bun run typecheck` — `tsc --noEmit` em todos os workspaces.
- `bun run format` — Prettier write em `**/*.{ts,tsx}`.

Por workspace: `cd apps/web && bun run <script>` (ou `packages/ui`). Ainda não há um runner de testes configurado.

### Verificação no navegador

Para qualquer mudança de UI/frontend, verifique em um navegador real usando o **`chrome-devtools` MCP server** — não confie apenas em typecheck/lint. Inicie o servidor de desenvolvimento e então controle o Chrome pelas ferramentas `mcp__chrome-devtools__*` (`navigate_page`, `take_snapshot`, `take_screenshot`, `list_console_messages`, `list_network_requests`, `click`, `fill`, `evaluate_script`, `lighthouse_audit`, etc.) para exercitar o caminho principal (golden path) e checar erros de console ou falhas de rede antes de reportar a tarefa como concluída. Se o chrome-devtools não estiver disponível na sessão, diga isso explicitamente em vez de afirmar que a mudança funciona.

### Adicionando componentes shadcn/ui

Rode a partir da raiz do repositório — os componentes vão para `packages/ui/src/components`, não para `apps/web`:

```bash
bunx shadcn@latest add button -c apps/web
```

Importe com `import { Button } from "@workspace/ui/components/button"`.

## Arquitetura

Monorepo Turborepo. O `turbo.json` conecta as dependências `^build`/`^lint`/`^format`/`^typecheck` para que os pacotes upstream sejam buildados primeiro.

- **`apps/web`** — Next.js 16 App Router, React 19, Turbopack. Aliases de path: `@/*` para arquivos locais do app, `@workspace/ui/*` → `packages/ui/src/*`. O `next.config.mjs` define `transpilePackages: ["@workspace/ui"]` para que o pacote de UI seja consumido como fonte, não pré-buildado.
- **`packages/ui`** — design system compartilhado (`@workspace/ui`). Componentes shadcn/Radix + Tailwind v4 (CSS `@theme`, sem `tailwind.config`). Os exports têm escopo de arquivo (`./components/*`, `./hooks/*`, `./lib/*`, `./globals.css`) — adicione novos diretórios ao mapa `exports` em `packages/ui/package.json` antes de importá-los.
- **`packages/eslint-config`** — flat configs compartilhadas do ESLint 9: `base` (JS/TS + security + sonarjs), `next-js` (adiciona React/Hooks/Next/Tailwind), `react-internal` (React sem Next). Os apps escolhem uma via `eslint.config.js`.
- **`packages/typescript-config`** — `base.json` (strict + `noUncheckedIndexedAccess`), `nextjs.json`, `react-library.json`.

A folha de estilos do Tailwind v4 fica em `packages/ui/src/styles/globals.css` e é referenciada pelas configs de PostCSS + Prettier do `apps/web`.

### Dinheiro e datas (OBRIGATÓRIO)

- **Dinheiro → `currency.js`**, sempre via a porta única `@workspace/core/money` (`formatBRL`, `reaisParaCents`, `centsParaReais`, `centsParaReaisStr`). O valor canônico é **centavos (int)**; a conversão centavos↔reais acontece só na borda (input/exibição). **Proibido** `Number(x) * 100`, `.toFixed(2)` pra calcular, ou `Intl.NumberFormat` manual — dá erro de ponto flutuante.
- **Datas/horas → `date-fns`** (e `date-fns-tz` quando houver fuso; usar o fuso da loja, ex.: `America/Sao_Paulo`). Nada de `new Date()` aritmético manual nem `Intl` cru pra formatar.

### SocratiCode MCP (OBRIGATÓRIO)

O **`socraticode` MCP server** é o ponto de entrada **obrigatório** para exploração da base de código neste repo. O projeto já está indexado (`codebase_2c7823a553f2`, 57 arquivos, grafo de dependências construído). **Não** comece com `Glob`/`Grep`/`Read` para perguntas exploratórias — busque primeiro, leia depois de afunilar.

**Regras rígidas:**

- Antes de responder perguntas de "onde/como/o quê" sobre código existente, escolha a ferramenta de entrada certa:
  - **Termo concreto/nomeável** (função, tipo, substantivo de domínio como `product`, `auth`) → `codebase_symbols` primeiro — mais barato, retorna só nomes + paths.
  - **Pergunta conceitual** sem um nome de símbolo óbvio ("como funciona o fluxo de auth") → `codebase_search` (chunks semânticos).
  - Não rode os dois para a mesma query, a menos que o primeiro venha vazio.
- Antes de refatorar, renomear ou deletar um símbolo, chame `mcp__plugin_socraticode_socraticode__codebase_impact` (nível de símbolo) ou `codebase_graph_query` (nível de arquivo) para avaliar o raio de impacto.
- Antes de abrir um arquivo para "ver o que ele importa", chame `codebase_graph_query`.
- Use `Grep` só quando você já souber a string literal **exata**; use `Read` só depois que a busca tiver afunilado para ≤3 arquivos.
- Se você pular essas ferramentas, justifique na resposta.

**Referência de ferramentas (prefixo `mcp__plugin_socraticode_socraticode__`):**

| Categoria | Ferramenta | Quando usar |
|--------|------|----------|
| Busca | `codebase_search` | Híbrido semântico + BM25; primeira chamada para perguntas **conceituais** sem um nome de símbolo óbvio |
| Busca | `codebase_status` | Verifica se o índice está atualizado (rode após grandes mudanças / em nova sessão) |
| Símbolos | `codebase_symbols` | Primeira chamada para termos **nomeados** (função/tipo/substantivo de domínio) — mapa barato de onde as coisas estão |
| Símbolos | `codebase_symbol` | Quem chama X, o que X chama, onde X é definido |
| Impacto | `codebase_impact` | Raio de impacto de mudar uma função/arquivo antes de editar |
| Impacto | `codebase_flow` | Rastreia a execução a partir de um ponto de entrada (rota, main, teste) |
| Grafo | `codebase_graph_query` | Dependências em nível de arquivo: imports + dependentes |
| Grafo | `codebase_graph_circular` | Detecta ciclos de dependência |
| Grafo | `codebase_graph_stats` | Conectividade, órfãos, distribuição por linguagem |
| Grafo | `codebase_graph_visualize` | Grafo Mermaid / HTML interativo |
| Índice | `codebase_update` | Reindexação incremental após edições (barato) |
| Índice | `codebase_index` | Reindexação completa (raro) |
| Índice | `codebase_watch` | Liga/desliga o watcher de arquivos ao vivo |
| Saúde | `codebase_health` | Diagnostica Docker/Qdrant/Ollama se uma ferramenta der erro |
| Contexto | `codebase_context*` | Schemas / specs de API / artefatos de infra (se `.socraticodecontextartifacts.json` existir) |

**Workflow:** `symbols`/`search` → `graph_query` → `impact`/`symbol` → `Read` (direcionado) → editar → `codebase_update`.

**Quando `Read` um arquivo depois de search/symbols:**

- **Leia quando:** estiver prestes a editá-lo; o snippet estiver truncado na zona relevante; o arquivo for central segundo o `graph_query` e a pergunta for sistêmica; o snippet chamar um helper cuja semântica muda a resposta; o arquivo for pequeno (<~50 linhas) e claramente central.
- **Não leia quando:** o snippet já contiver o símbolo completo; a pergunta for "onde X é definido"; o arquivo for grande e você só precisar de uma função (use `Read` com `offset`/`limit`, ou `codebase_symbol`); a pergunta for "o que quebra se eu mudar X" (use `codebase_impact`).
- Critério de desempate: quando estiver em dúvida sobre ordem / efeitos colaterais / invariantes ocultos, prefira ler.

Se uma ferramenta do SocratiCode falhar, rode `codebase_health` e exponha o erro ao usuário — não recorra silenciosamente a uma exploração só com grep.

## Estrutura de pastas por feature

A estrutura abaixo é **base de referência**, não exaustiva. Extenda quando a feature pedir: `hooks/` pode ter outras categorias além de `data/` e `ui/` (ex: `hooks/integrations/` pra WebSocket/SSE, `hooks/analytics/` pra tracking), `services/` pode ter múltiplos arquivos por contexto, `schemas/` cresce conforme novos inputs aparecem. Mantenha os princípios e adapta o resto.

```
products/
├── components/
│   ├── products-page.tsx
│   ├── products-list/              # vira pasta quando tem subcomponentes
│   │   ├── products-list.tsx
│   │   ├── products-list-item.tsx
│   │   └── products-list-empty.tsx
│   └── create-product-modal/
│       ├── create-product-modal.tsx
│       └── create-product-form.tsx
├── hooks/
│   ├── data/
│   │   ├── queries/use-products-query.ts
│   │   └── mutations/use-create-product-mutation.ts
│   └── ui/use-create-product-modal.ts
├── schemas/
│   ├── product.ts                  # entidade
│   └── create-product.ts           # input do form
├── services/products.ts            # único lugar com fetch
├── types/index.ts                  # z.infer dos schemas
├── utils/
│   ├── format.ts                   # formatPrice, formatStock, ...
│   └── discount.ts                 # calculateDiscount, applyCoupon, ...
├── consts.ts
└── index.ts                        # public API (barrel)
```

**Regras**

- `app/**/page.tsx` é fino: importa da feature e renderiza. Sem lógica, sem tipagem.
- Schema Zod é source of truth. Tipos via `z.infer` centralizados em `types/`.
- Hooks: `data/queries` (GET), `data/mutations` (POST/PUT/DELETE), `ui/` (estado e comportamento, sem rede). Outras categorias podem ser adicionadas conforme a feature.
- Utils agrupados por contexto: vários arquivos, várias funções por arquivo. Funções puras, sem hooks/JSX.
- Componente vira pasta quando tem subcomponentes; senão é arquivo solto em `components/`.
- Estrutura sempre nested, mesmo com 1 arquivo.
- **Proibido importar entre features.** Feature não importa de outra feature, nem pelo `index.ts`. Se 2+ features precisam do mesmo código, promove pra `lib/` ou `shared/`.

**Naming**

- Tudo kebab-case nos arquivos.
- Sem sufixo redundante: pasta `schemas/` → `product.ts` (não `product.schema.ts`). Mesma regra pra `services/`.
- Hooks mantêm prefixo `use-` (convenção do React).
- Componente: `PascalCase`. Hook: `useX`. Constante: `SCREAMING_SNAKE_CASE`.
- Promove pra `lib/` ou `shared/` só quando 2+ features usam. Se importa tipo da feature, fica na feature.

## Controle de features (docs/features) — OBRIGATÓRIO

`docs/features/` é o registro estruturado de TODAS as features (62+ seeds): 1 arquivo por feature com frontmatter YAML (`id`, `status`, `facetas` por superfície, `testada`, `depende_de`, `impacta`, `ancoras`, `docs`, `codigo`). Convenções completas em `docs/features/README.md`; o painel `docs/features/INDEX.md` é **gerado** — nunca editar na mão.

- Ao **criar/mudar uma feature**: atualize o arquivo dela (status, facetas, testada/testes, tarefas) e rode `bun run features check && bun run features build`.
- Antes de mexer em algo: `bun run features impact <ID>` diz o que re-testar; o índice de âncoras do INDEX.md diz quem toca a mesma tabela/setting/tool.
- **Commits levam o ID**: `feat(cupons): … [CUP-002]` — é o vínculo linha↔feature via git blame (`bun run features lines <ID>`).
- Carimbo `// @feature XXX-000` SÓ em pontos de posse única (coluna de schema, tool do agente); nunca em código compartilhado.
- Skills (em `.claude/skills/`, invocadas como slash command): `/rs <ID|tema>` investiga (existe? concorrência? recomendação), `/pl <ID>` planeja a codificação (briefing + dossiê em `docs/planos/` com dependências/blast radius + passos com Prova executável → status planejado), `/bug <descrição>` caça causa-raiz, `/i <ID>` implementa (com gate de pré-existência). Fluxo natural: `/rs` → `/pl` → `/i`. As instruções completas de cada uma vivem no `SKILL.md` da skill — este arquivo não as duplica.
