# docs/features — registro estruturado de features

Cada feature do mrtip é **1 arquivo** aqui, com frontmatter YAML + corpo em Markdown. Este diretório é a fonte única de status do projeto. O painel [INDEX.md](INDEX.md) é **gerado** pelo CLI — nunca edite na mão.

## Por que existe

- **Rastreabilidade linha ↔ feature**: commits carregam o `[ID]` (`feat(picks): … [PICK-002]`), então `git blame`/`bun run features lines <ID>` ligam código a feature pra sempre.
- **Retomável sem contexto**: `status` + `facetas` + `## Plano` deixam uma sessão nova continuar de onde a anterior parou.
- **Blast radius explícito**: `depende_de`/`impacta` + `ancoras` dizem quem re-testar antes de mexer em algo.

## Arquivo de feature

Copie [_template.md](_template.md) pra `docs/features/<modulo>/<ID>-<slug>.md`. O `<ID>` é `<PREFIXO>-<NNN>` (ex.: `PICK-002`), número crescente por prefixo (confira o maior usado no INDEX.md).

### Frontmatter

| Campo | Valores | Notas |
|---|---|---|
| `id` | `XXX-000` | único no repo; o `check` reclama de duplicata |
| `titulo` | texto | |
| `modulo` | nome de pasta | agrupa features (= subpasta de `docs/features/`) |
| `status` | `ideia` → `investigado` → `planejado` → `em-andamento` → `feito` → `verificado` | ciclo de vida; `verificado` exige `testada: sim` + `verificado_em` |
| `prioridade` | `P1` \| `P2` \| `P3` | |
| `facetas` | mapa `superfície: status` | superfícies: **`dados`** (ingestão/schema/persistência), **`api`** (rotas backend), **`ia`** (assistente + motores quant/LLM), **`ui`** (apps/web). Só liste as que se aplicam |
| `testada` | `nao` \| `parcial` \| `sim` | |
| `testes` | lista | evidências nomeadas: `"E2E Chrome 8/8 (2026-06-18)"`, scripts, asserts |
| `depende_de` | lista de IDs | pré-requisitos; o `check` proíbe ciclos |
| `impacta` | lista de IDs | quem re-testar se isto mudar |
| `ancoras` | `settings`/`tabelas`/`tools`/`funcoes`/`rotas` | pontos compartilhados que ESTA feature toca; alimentam o índice de âncoras do INDEX |
| `docs` | paths | `docs/investigacoes\|planos\|arquitetura/...` |
| `verificado_em` | data \| `null` | obrigatório quando `status: verificado` |
| `atualizado` | data | toque a cada mudança |

### Corpo

`## Descrição` · `## Tarefas` (checkboxes por faceta; com Plano viram espelho 1:1 dos passos) · `## Plano` (gerado pelo `/pl`) · `## Evidências` · `## Verificação`.

## Princípio de domínio (mrtip)

Toda feature de pick/insight/value bet **mostra o porquê e as fontes** (ver `docs/visao-geral.md` §5). A IA separa **estimar** (quant) de **explicar** (LLM). Dinheiro sempre em **centavos** via `@workspace/core/money`; datas via `date-fns`/`-tz` (fuso `America/Sao_Paulo`). Regulação: Lei 14.790/2023, +18, jogo responsável, nada de promessa de ganho.

## CLI

`bun run features <comando>`:

| Comando | O que faz |
|---|---|
| `check` | valida todos os arquivos: campos obrigatórios, enums, IDs únicos, refs de `depende_de`/`impacta` existentes, ciclos em `depende_de`, `verificado` com prova. Exit ≠ 0 em erro |
| `build` | (re)gera [INDEX.md](INDEX.md): tabela de features + índice de âncoras + índice doc→features |
| `impact <ID>` | quem re-testar: features que dependem do ID, que ele impacta, ou que compartilham âncoras |
| `lines <ID>` | commits e arquivos que carregam `[<ID>]` no histórico git |

Rode `bun run features check && bun run features build` ao fim de qualquer mudança em features. Skills relacionadas: `/rs` (investiga), `/pl` (planeja), `/i` (implementa), `/bug` (causa-raiz).
