# Inventário & specs de componentes

> Seção do **design system do mrtip**. As-of: **2026-06-21**. Volta para o [[README]] do DS.
>
> O que esta seção entrega: (A) a lista priorizada de **componentes base shadcn** a adicionar, e (B) a especificação **implementation-ready** dos **componentes de domínio** (que o shadcn não tem) — anatomia, props, variantes, estados, tokens e API TSX proposta. Cores/tokens vivem em [[tokens]]; layouts de tela vivem em [[superficies]] (Hub da Rodada, Dossiê do Jogo, Histórico·CLV). Aqui é o catálogo de peças, não o arranjo delas.

---

## 0. Convenções (valem para TODO componente daqui)

Herdadas do `button.tsx` que já existe (`packages/ui/src/components/button.tsx`) — não reinvente, copie o padrão:

1. **cva para variantes.** `class-variance-authority` já é dependência (`packages/ui/package.json`). Toda peça com >1 visual usa `cva(base, { variants, defaultVariants })` e exporta `xVariants` junto do componente (`export { ValueCard, valueCardVariants }`).
2. **`data-slot` em toda raiz** (`data-slot="value-card"`) — é o hook de styling/teste e a convenção shadcn deste repo. Subpartes ganham seu próprio slot (`data-slot="value-card-header"`).
3. **`data-variant` / `data-state` espelham a prop** no DOM (ex.: `data-variant="green"`, `data-result="red"`) para permitir styling de descendentes e asserts de teste sem classe mágica.
4. **`asChild` via `radix-ui` `Slot`** quando o componente pode virar link/outro elemento (mesmo import do button: `import { Slot } from "radix-ui"`).
5. **`cn()` de `@workspace/ui/lib/utils`** para merge de classes. Sempre aceitar `className` e fazer merge por último.
6. **Props = `React.ComponentProps<"div"> & VariantProps<typeof xVariants> & { ...domínio }`.** Sem `FC`, sem `any`.
7. **Tokens, nunca hex.** Componente só consome variáveis semânticas (`bg-card`, `text-muted-foreground`, `border-border`, `text-positive`). Os hex dos mockups (#27d07a etc.) já viram tokens em [[tokens]] — esta seção usa os tokens canônicos: `--color-positive`/`positive-dim`/`positive-line` (verde), `--color-negative`/`negative-dim` (vermelho), `--color-warning` (âmbar), `--color-info` (azul), `--primary` (#6ad0ff cyan de marca). Nomes canônicos definidos em [[tokens]] §1.3 e README §4.1 do DS.
8. **Mono para número.** Odds, EV, CLV, yield, hash → `font-mono` (Geist Mono já ligado em `apps/web/app/layout.tsx`) + `tabular-nums`. Regra dura: números financeiros nunca em fonte proporcional.
9. **Dinheiro e datas pela borda.** Componente **não** formata BRL nem data por conta própria — recebe já-formatado **ou** recebe centavos/`Date` e chama `formatBRL`/`centsParaReaisStr` de `@workspace/core/money` e `date-fns`/`date-fns-tz` (fuso `America/Sao_Paulo`). Proibido `toFixed`/`Intl` manual (regra dura do repo). Para EV/CLV/yield (percentuais, não dinheiro) ver utils de format da feature, não `money`.
10. **Acento à esquerda = `border-l-[3px]`** + cor semântica (padrão visual dos cards dos mockups). Radius padrão `rounded-[14px]` (cards) / `rounded-[9px]` (chips/badges) — mapeie via `--radius` em [[tokens]] em vez de cravar px quando der.

### Onde mora cada peça (regra de pastas + a pegadinha do `exports`)

Componentes base e de domínio **simples** (1 arquivo) → `packages/ui/src/components/<nome>.tsx`, importados como `@workspace/ui/components/<nome>`.

Componente de domínio **com subpartes** vira **pasta** (regra do CLAUDE.md): `packages/ui/src/components/value-card/` com `value-card.tsx`, `value-card-header.tsx`, etc.

> **Pegadinha real (verifiquei `packages/ui/package.json`):** o mapa `exports` hoje só tem `"./components/*": "./src/components/*.tsx"`. Isso resolve `@workspace/ui/components/value-card` **apenas se houver um arquivo `value-card.tsx`** — **não** resolve uma pasta `value-card/`. Duas saídas, escolha uma e padronize:
> - **(preferida)** manter o componente público como `value-card.tsx` na raiz de `components/` e pôr as subpartes privadas numa subpasta `value-card/` que o arquivo público importa por path relativo. Public API = 1 arquivo, exports atual já funciona.
> - **(alternativa)** estender `exports` para `"./components/*": ["./src/components/*.tsx", "./src/components/*/index.tsx"]`. Mais flexível, mexe no contrato do pacote.
>
> `[A confirmar com João]` — recomendo a **preferida** (zero mudança no `exports`, padrão shadcn de "um arquivo por componente público"). As specs abaixo assumem ela.

---

## (A) Camada base — componentes shadcn a adicionar

`button` já existe. Adicione com `bunx shadcn@latest add <x> -c apps/web` (vai para `packages/ui/src/components`, importa de `@workspace/ui/components/<x>`). Após adicionar, **re-temar**: o shadcn entrega o tema neutro; as cores vêm de [[tokens]], então o componente gerado deve consumir só tokens semânticos.

Prioridade por superfície (1 = adicione já no MVP):

| Componente | Prio | Por quê / onde | Re-tema necessário |
|---|---|---|---|
| `card` | **1** | base estrutural de ValueCard, DimensionCard, PickBox, KPIs | sim — acento esquerdo + tokens de painel |
| `badge` | **1** | base de EvBadge, WeightBadge, AgePill, tag de resultado | sim — variantes verde/vermelho/âmbar |
| `tabs` | **1** | filtros de mercado no Hub; abas Dossiê/Histórico | leve |
| `tooltip` | **1** | explicar EV, CLV, peso, hash (princípio "sempre o porquê") | leve |
| `progress` | **1** | base do ConfidenceBar e barras de calibração | sim — cor por faixa |
| `table` | **1** | ImmutableLedger (histórico/CLV) | sim — mono nas colunas numéricas |
| `separator` | **1** | divisórias internas de card/dossiê | não |
| `dialog` | **2** | detalhe de pick, modal de fontes, modal +18/gate | leve |
| `sheet` | **2** | painel lateral de filtros (mobile), chat assistente em drawer | leve |
| `input` | **2** | campo do AssistantChat, busca | leve |
| `select` | **2** | seletor de liga/rodada/mercado | leve |
| `dropdown-menu` | **2** | menu de ações no ledger, ordenação do Hub | leve |
| `tooltip`/`hover-card` | **2** | preview de fonte ao passar o mouse (SourcesList) | leve |
| `avatar` | **3** | escudo de time / foto de tipster | não |
| `sonner` (toast) | **3** | feedback de "pick gravado" / erros | não |
| `scroll-area` | **3** | área de mensagens do chat, listas longas | não |
| `skeleton` | **2** | estados loading (ver §estados) | sim — tom de painel |
| `accordion` | **3** | seções colapsáveis do dossiê (dimensões) | leve |

**Não adicionar** agora (YAGNI até a superfície pedir): `calendar`, `carousel`, `command`, `menubar`, `navigation-menu`, `pagination` (ledger pagina via table própria), `radio-group` (a menos que filtros de mercado virem rádio).

**Gráficos (CalibrationPlot):** o shadcn `chart` embrulha **Recharts**. Recharts **não** é dependência hoje. Decisão: para o CalibrationPlot (scatter de previsto×observado + diagonal), o gráfico é simples o bastante para **SVG puro** sem dependência nova — evita 1 dep pesada por 1 gráfico. `[A confirmar com João]` se vamos padronizar Recharts cedo (aí adiciona `chart` + `recharts`) ou ficar SVG-first. Spec abaixo assume SVG-first.

---

## (B) Camada de domínio — specs

Ordem = grosso modo a ordem em que as superfícies precisam delas. Cada peça: **propósito · anatomia · variantes · estados · tokens · onde mora · API TSX**.

---

### 1. `EvBadge` — selo de EV/edge

**Propósito.** Mostrar o valor esperado (EV+) de uma aposta como número monoespaçado, com cor semântica. É o átomo de confiança do Hub. Honestidade: EV zero/negativo **não** é escondido — tem variante própria.

**Anatomia.** `[ caret ▲/— ] [ "+4.2%" mono ]` — pílula compacta. Sem ícone quando `variant="zero"`.

**Variantes (cva).**
- `variant`: `positive` (verde, EV>0, caret ▲), `zero` (muted/âmbar suave, EV≈0, sem caret, copy "sem valor"), `negative` (vermelho, EV<0, caret ▼ — uso interno/admin, raro no apostador).
- `size`: `sm` (inline em listas) | `md` (default).

**Estados.** Sem interação por padrão (é display). `hover` só se envolto por Tooltip (recomendado — explica "EV = retorno esperado por unidade apostada"). Sem disabled/loading (quem carrega é o card pai).

**Tokens.** `positive` → `text-positive` sobre `bg-positive-dim`, `border-positive-line`. `zero` → `text-muted-foreground` / `bg-muted`. `negative` → `text-negative` / `bg-negative-dim`. Sempre `font-mono tabular-nums`. Ver [[tokens]].

**Onde mora.** `packages/ui/src/components/ev-badge.tsx` (átomo, arquivo solto).

```tsx
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const evBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[9px] border px-1.5 py-0.5 font-mono text-xs font-medium tabular-nums",
  {
    variants: {
      variant: {
        positive: "border-positive-line bg-positive-dim text-positive",
        zero: "border-border bg-muted text-muted-foreground",
        negative: "border-negative/40 bg-negative-dim text-negative",
      },
      size: { sm: "text-[0.7rem] px-1", md: "text-xs px-1.5" },
    },
    defaultVariants: { variant: "positive", size: "md" },
  }
)

type EvBadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof evBadgeVariants> & {
    /** já formatado, ex. "+4.2%". Componente NÃO calcula EV. */
    label: string
  }

function EvBadge({ className, variant = "positive", size, label, ...props }: EvBadgeProps) {
  const Icon = variant === "positive" ? TrendingUp : variant === "negative" ? TrendingDown : Minus
  return (
    <span data-slot="ev-badge" data-variant={variant} className={cn(evBadgeVariants({ variant, size, className }))} {...props}>
      {variant !== "zero" && <Icon className="size-3" aria-hidden />}
      {label}
    </span>
  )
}
export { EvBadge, evBadgeVariants }
```

---

### 2. `WeightBadge` — peso do sinal (alto/médio/baixo/narrativa)

**Propósito.** Etiquetar o **peso** de uma dimensão do jogo no prognóstico. Encapsula a disciplina central do produto (`docs/arquitetura/taxonomia-sinais.md`): sinais quant têm peso; sinais narrativos (intangíveis do jogador) são **peso-0** — explicam, não estimam. A peça torna isso visível e auditável.

**Variantes (cva).** `weight`: `alto` | `medio` | `baixo` | `narrativa` (peso-0). Cada uma com cor + rótulo distintos.

**Anatomia.** `[ dot ] [ rótulo ]` — `narrativa` ganha rótulo "peso 0 · só narra" e estilo dashed/sutil para sinalizar "não entra no número".

**Estados.** Display. `hover` via Tooltip explicando o peso (recomendado).

**Tokens.** `alto` → `positive` (forte). `medio` → `info` (azul). `baixo` → `muted-foreground`. `narrativa` → `faint` + borda `border-dashed` (visualmente "fora do cálculo"). Ver [[tokens]].

**Onde mora.** `packages/ui/src/components/weight-badge.tsx`.

```tsx
const weightBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[9px] border px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      weight: {
        alto: "border-positive-line bg-positive-dim text-positive",
        medio: "border-info/30 bg-info/10 text-info",
        baixo: "border-border bg-muted text-muted-foreground",
        narrativa: "border-dashed border-border text-faint",
      },
    },
    defaultVariants: { weight: "medio" },
  }
)
// label default por weight: alto="alto" · medio="médio" · baixo="baixo" · narrativa="peso 0 · só narra"
```

API: `<WeightBadge weight="narrativa" />` (rótulo derivado, override via `children`). `data-weight` no DOM.

---

### 3. `ConfidenceBar` — barra de confiança/calibração

**Propósito.** Visualizar a confiança/probabilidade calibrada (0–100%) de um prognóstico, sem prometer resultado. Reforça "probabilidade, não palpite".

**Anatomia.** Trilho (`bg-muted`) + preenchimento por faixa + rótulo opcional `"68% calibrada"` mono à direita.

**Variantes.** `tone`: `auto` (cor deriva do valor — baixo<40 âmbar, médio âmbar→verde, alto verde) | `neutral` (sempre `bg-primary`/cyan de marca, para barras informativas). `size`: `sm` | `md`.

**Estados.** `loading` → trilho com shimmer (skeleton). `empty`/sem valor → trilho vazio + "—". Animar largura em mount (`transition-[width]`).

**Tokens.** Trilho `bg-muted`. Fill: faixa baixa `bg-warning`, alta `bg-positive`. `neutral` → `bg-primary`. Rótulo `font-mono text-muted-foreground`.

**Onde mora.** `packages/ui/src/components/confidence-bar.tsx`. (Pode reusar `Progress` shadcn por dentro; recomendo wrapper próprio porque a cor-por-faixa e o rótulo mono são específicos.)

```tsx
type ConfidenceBarProps = React.ComponentProps<"div"> & {
  /** 0..100, probabilidade calibrada (não "chance de ganhar dinheiro") */
  value: number
  tone?: "auto" | "neutral"
  showLabel?: boolean
  loading?: boolean
}
```

---

### 4. `ValueCard` — card de value bet (átomo do Hub da Rodada)

**Propósito.** O card que lista cada oportunidade no Hub, ordenado por EV+. Variante `none` materializa o princípio "não apostar também é resultado" — o card "sem valor" tem dignidade visual, não é erro.

**Anatomia (pasta — tem subpartes).**
```
[3px acento esquerdo]
ValueCardHeader   → confronto (timeA × timeB), liga/rodada, horário (date-fns, fuso BR)
ValueCardBody     → mercado + seleção (ex. "Cartões — Over 4.5"), EvBadge, odd (mono), ConfidenceBar
ValueCardFooter   → MarketOddsStrip (mini) | WeightBadge das top-dimensões | CTA "ver dossiê"
```

**Variantes (cva).**
- `variant`: `green` (tem EV+, acento `positive`, EvBadge positive) | `none` (sem valor, acento `border-2`/`faint`, copy "Sem valor nesta linha — não apostar também é resultado", EvBadge zero, CTA secundário "ver por quê").
- `density`: `comfortable` | `compact` (lista densa no Hub mobile).

**Estados.** `hover` → leve `bg-secondary` + elevação sutil (acento não muda). `focus-visible` → ring (padrão button). `loading` → skeleton do card inteiro (ver §estados). `empty` (rodada sem jogos) é da superfície [[superficies]], não deste card. `disabled` n/a. Clicável inteiro via `asChild`+Link → Dossiê.

**Tokens.** Fundo `bg-card`, borda `border-border`, acento `border-l-[3px] border-l-positive` (green) / `border-l-faint` (none). Hover `bg-secondary`. Radius `rounded-[14px]`. Números mono. Ver [[tokens]].

**Onde mora.** Público `packages/ui/src/components/value-card.tsx`; subpartes em `packages/ui/src/components/value-card/` (header/body/footer) importadas por path relativo (ver §pegadinha do exports).

```tsx
const valueCardVariants = cva(
  "group/value-card relative flex flex-col rounded-[14px] border bg-card border-l-[3px] transition-colors hover:bg-secondary",
  {
    variants: {
      variant: {
        green: "border-l-positive",
        none: "border-l-faint opacity-95",
      },
      density: { comfortable: "gap-3 p-4", compact: "gap-2 p-3" },
    },
    defaultVariants: { variant: "green", density: "comfortable" },
  }
)

type ValueCardProps = React.ComponentProps<"div"> &
  VariantProps<typeof valueCardVariants> & {
    asChild?: boolean
    match: { home: string; away: string; league: string; kickoffLabel: string } // kickoff já formatado (date-fns-tz)
    market: string            // "Cartões — Over 4.5"
    odd: string               // já formatado, mono
    ev?: string               // "+4.2%" — ausente quando variant="none"
    confidence?: number       // 0..100
  }
// variant="none" → renderiza copy "não apostar também é resultado" no Body e EvBadge variant="zero".
```

---

### 5. `MarketOddsStrip` — mercado, odds e movimento de linha

**Propósito.** Mostrar a odd atual de um mercado e o **movimento da linha** (abertura → atual / drift até a closing line). Conecta com o pilar **CLV**: ver a linha mexer é o começo de entender value.

**Anatomia.** `[ mercado ] [ odd abertura mono, riscada/faint ] → [ odd atual mono ] [ delta ▲/▼ colorido ]`. Variante expandida: mini sparkline do drift.

**Variantes.** `trend`: `up` (linha subiu = valor encolhendo, vermelho/âmbar) | `down` (linha caiu desde sua entrada = CLV+, verde) | `flat` (faint). `layout`: `inline` (dentro de ValueCard) | `block` (no Dossiê, com sparkline).

> **Semântica cuidadosa:** "linha caiu a seu favor" = CLV positivo = **verde**; "linha foi contra" = vermelho. Cravar a convenção em [[tokens]]/[[superficies]] e documentar no Tooltip — é contraintuitivo e fácil de errar. `[A confirmar com João]` se o sinal é sempre do ponto de vista do pick do usuário (recomendo que sim).

**Estados.** `loading` (odds chegando) → odd como skeleton mono. `stale` (odd defasada > X min) → ícone âmbar + Tooltip "odd pode estar desatualizada" (honestidade). `empty` → "sem odds .bet.br" (risco real do produto: cobertura de odds BR).

**Tokens.** Odds `font-mono tabular-nums`. Delta verde `text-positive` / vermelho `text-negative` / `text-faint`. Sparkline traça com `positive`/`negative`.

**Onde mora.** `packages/ui/src/components/market-odds-strip.tsx` (inline) — versão `block` com sparkline pode virar pasta se crescer.

```tsx
type LineMove = { openOdd: string; currentOdd: string; deltaPct: number } // já formatados
type MarketOddsStripProps = React.ComponentProps<"div"> & {
  market: string
  line: LineMove
  trend?: "up" | "down" | "flat"   // do ponto de vista do pick
  layout?: "inline" | "block"
  stale?: boolean
}
```

---

### 6. `PickBox` — caixa do pick (átomo do Dossiê)

**Propósito.** O veredito do Dossiê do Jogo: a seleção recomendada, com EV, confiança, odd, mercado, e **timestamp/registro** (gancho do registro imutável — pick gravado ANTES do jogo). É o ponto mais sensível à Lei 14.790: linguagem de **probabilidade + risco**, nunca promessa.

**Anatomia.**
```
[acento esquerdo verde]
PickBox header:  mercado + seleção (destaque) · EvBadge · odd mono
PickBox body:    ConfidenceBar + "probabilidade calibrada"  ·  resumo de 1 linha do porquê (link p/ dimensões)
PickBox meta:    AgePill (+18)  ·  selo "registrado · {timestamp BR} · {hash curto}"  ·  ResponsibleGamingBanner (compacto)
```

**Variantes.** `state`: `recommended` (EV+, verde) | `no-bet` (sem valor — espelha ValueCard `none`: "não apostar") | `pending` (pré-jogo, aguardando gravação) | `settled-green`/`settled-red` (pós-jogo, no histórico). `emphasis`: `hero` (topo do dossiê) | `inline`.

**Estados.** `loading` (motor calculando) → skeleton + "calculando probabilidade…". `disabled` n/a. Sempre exibir disclaimer de risco — **não** é estado opcional (compliance). O selo de registro só aparece quando há hash (pós-gravação).

**Tokens.** Acento `border-l-positive` (recommended) / `border-l-negative` (settled-red) / `border-l-faint` (no-bet/pending). Fundo `bg-secondary`. Hash/timestamp `font-mono text-faint`. Banner âmbar via `ResponsibleGamingBanner`.

**Onde mora.** Público `packages/ui/src/components/pick-box.tsx`; subpartes em `pick-box/`.

```tsx
const pickBoxVariants = cva(
  "relative flex flex-col gap-3 rounded-[14px] border bg-secondary border-l-[3px] p-4",
  {
    variants: {
      state: {
        recommended: "border-l-positive",
        "no-bet": "border-l-faint",
        pending: "border-l-warning",
        "settled-green": "border-l-positive",
        "settled-red": "border-l-negative",
      },
      emphasis: { hero: "p-5", inline: "p-4" },
    },
    defaultVariants: { state: "recommended", emphasis: "inline" },
  }
)

type PickBoxProps = React.ComponentProps<"div"> &
  VariantProps<typeof pickBoxVariants> & {
    market: string
    selection: string
    odd: string
    ev?: string
    confidence: number
    rationale: string                 // 1 linha — o "porquê" obrigatório
    record?: { timestampLabel: string; hashShort: string } // presente => pick gravado
  }
// SEMPRE renderiza disclaimer de risco + AgePill. Sem pick sem porquê.
```

---

### 7. `DimensionCard` — dimensão do jogo com peso

**Propósito.** No Dossiê, cada fator analisado (árbitro, lesões, motivação, rivalidade, clima, narrativa…) é um card com seu **WeightBadge**, leitura do sinal e fontes. Operacionaliza "estimar ≠ explicar": dimensões peso-0 (narrativa) ficam visualmente apartadas.

**Anatomia.** `header: título da dimensão + WeightBadge` · `body: leitura (texto curto) + mini-indicador (ConfidenceBar ou seta)` · `footer: SourcesList (compacta)`.

**Variantes.** Deriva o estilo do `weight` (reusa a semântica do WeightBadge): `alto`/`medio`/`baixo` = card sólido; `narrativa` = card com fundo mais sutil + borda dashed (sinaliza "fora do número, só contexto").

**Estados.** `collapsible` (default colapsado no mobile via Accordion). `empty` (sem sinal para a dimensão) → "sem dado relevante" faint (honestidade > inventar). `loading` → skeleton.

**Tokens.** Mesma paleta do WeightBadge. Fundo `bg-card` (quant) / `bg-background` + `border-dashed` (narrativa).

**Onde mora.** `packages/ui/src/components/dimension-card.tsx` (usa WeightBadge + SourcesList).

```tsx
type DimensionCardProps = React.ComponentProps<"div"> & {
  title: string                       // "Árbitro" | "Rivalidade" | ...
  weight: "alto" | "medio" | "baixo" | "narrativa"
  reading: string                     // leitura do sinal
  sources?: Source[]                  // ver SourcesList
  defaultOpen?: boolean
}
```

---

### 8. `CalibrationPlot` — plot de calibração (previsto × observado)

**Propósito.** A prova visual de honestidade no Histórico·CLV: scatter de probabilidade prevista (x) × frequência observada (y) com a diagonal ideal (y=x). Um modelo honesto fica em cima da diagonal. Nenhum concorrente mostra isso — é o diferencial.

**Anatomia.** SVG: eixos 0–100%, diagonal de referência (`border`/`faint`, dashed), pontos por bucket (raio ∝ nº de picks), banda de erro opcional, legenda. Hover no ponto → Tooltip "previsto 60% · observado 57% · n=42".

**Variantes.** `size`: `sm` (sparkline-card no painel de KPIs) | `md` (full). `showBands`: bool.

**Estados.** `loading` → eixos + shimmer. `empty` (histórico insuficiente) → eixos + "dados insuficientes para calibrar (mín. N picks)" — **não** plotar ruído. `sparse` → pontos + aviso de baixa amostra.

**Tokens.** Eixos/grid `stroke-border`. Diagonal `stroke-faint` dashed. Pontos `fill-primary` (ou `positive` se bem calibrado / `warning` se desviado). Texto `text-muted-foreground`. Sem dependência nova (SVG puro) — ver decisão em (A).

**Onde mora.** `packages/ui/src/components/calibration-plot/` (pasta: `calibration-plot.tsx` + `calibration-axes.tsx` + `calibration-point.tsx`), público via `calibration-plot.tsx` na raiz de components reexportando.

```tsx
type CalibrationBucket = { predicted: number; observed: number; n: number } // 0..1
type CalibrationPlotProps = React.ComponentProps<"div"> & {
  buckets: CalibrationBucket[]
  size?: "sm" | "md"
  showBands?: boolean
  minSamples?: number   // abaixo disso => estado empty/sparse
}
```

---

### 9. `ImmutableLedger` — ledger imutável de picks (table + hash + resultado)

**Propósito.** O registro de acerto **auditável**: cada pick gravado antes do jogo, com hash + timestamp, e resultado GREEN/RED honesto (inclui as perdas). É o coração da tese "honesto e auditável" e do CLV.

**Anatomia (table shadcn re-temada).** Colunas: `data (BR)` · `confronto` · `mercado/seleção` · `odd (mono)` · `EV na entrada (mono)` · `CLV (mono, ±)` · `resultado (LedgerResult)` · `hash (mono, truncado, copiável)`. Linha de resumo/KPIs no topo é da superfície [[superficies]].

**Subcomponente `LedgerResult`** (chip): `green` (acerto, verde) | `red` (perda, vermelho — mostrado com a mesma proeminência, não escondido) | `void` (anulado, faint) | `pending` (pré-jogo, âmbar). Mesma família visual do EvBadge/Badge.

**Variantes.** `density`: `comfortable` | `compact`. Coluna CLV colore o número (+verde / −vermelho).

**Estados.** `loading` → linhas skeleton. `empty` → "nenhum pick registrado ainda" + CTA. `hover` linha → `bg-panel-2`. Hash → click copia (toast `sonner`), Tooltip "registro imutável · clique para copiar". Ordenável por CLV/EV/data (dropdown-menu).

**Tokens.** Header `text-faint uppercase text-xs`. Números mono `tabular-nums`. CLV +/− nas cores semânticas. Resultado via chips. Linhas `border-b border-border`. Hash `font-mono text-faint`.

**Onde mora.** `packages/ui/src/components/immutable-ledger/` → público `immutable-ledger.tsx` (+ `ledger-result.tsx`, `ledger-row.tsx`).

```tsx
type LedgerEntry = {
  id: string
  dateLabel: string          // date-fns-tz, fuso BR
  match: string
  selection: string
  odd: string                // mono
  evAtEntry: string          // "+4.2%"
  clv: string                // "+2.1%" / "-0.8%" — já com sinal
  result: "green" | "red" | "void" | "pending"
  hash: string               // completo; UI trunca
}
type ImmutableLedgerProps = React.ComponentProps<"div"> & {
  entries: LedgerEntry[]
  density?: "comfortable" | "compact"
  onCopyHash?: (hash: string) => void
}
```

---

### 10. `AssistantChat` — chat do assistente (msg user/assistant + fontes)

**Propósito.** O copiloto conversacional do Dossiê. Cada resposta do assistente que faça afirmação factual **anexa fontes** (princípio "sempre o porquê") e respeita a linguagem de compliance (probabilidade/risco, sem promessa).

**Anatomia (pasta).**
```
AssistantChat (container, scroll-area)
├─ ChatMessage variant="user"       → bolha alinhada à direita, neutra
├─ ChatMessage variant="assistant"  → bolha esquerda + SourcesList anexa + (opcional) chips de pick referenciado
│   └─ estado "streaming" (cursor) / "thinking" (3 dots)
└─ ChatComposer                     → input + enviar; sugestões rápidas (chips); disclaimer fino de IA
```

**Variantes.** `ChatMessage.role`: `user` | `assistant` | `system` (aviso de compliance/erro, âmbar). `AssistantChat.layout`: `panel` (coluna do dossiê) | `drawer` (sheet mobile).

**Estados.** `streaming` (token a token, cursor pulsando). `thinking` (dots). `error` (system message âmbar, "não consegui responder"). `empty` → mensagem de boas-vindas + sugestões. Composer `disabled` enquanto streaming. Toda msg assistant factual **deve** poder anexar `sources` (vazio = aviso "sem fonte" em vez de afirmar seco).

**Tokens.** User bubble `bg-panel-2 text-foreground`. Assistant bubble `bg-card border-border`. System `bg-warning/10 text-warning border-warning/30`. Fontes via SourcesList. Radius `rounded-[14px]`.

**Onde mora.** `packages/ui/src/components/assistant-chat/` → público `assistant-chat.tsx` (+ `chat-message.tsx`, `chat-composer.tsx`).

```tsx
type ChatSource = Source
type ChatMessageData = {
  id: string
  role: "user" | "assistant" | "system"
  content: React.ReactNode
  sources?: ChatSource[]
  status?: "streaming" | "thinking" | "error"
}
type AssistantChatProps = React.ComponentProps<"div"> & {
  messages: ChatMessageData[]
  layout?: "panel" | "drawer"
  onSend?: (text: string) => void
  pending?: boolean          // bloqueia composer durante streaming
  suggestions?: string[]
}
```

---

### 11. `SourcesList` — lista de fontes

**Propósito.** Tornar toda afirmação rastreável. Usada por DimensionCard, PickBox, AssistantChat. Materializa "nenhum pick sem explicação E fontes".

**Anatomia.** Lista compacta de chips/linhas: `[ favicon/ícone tipo ] [ título da fonte ] [ data (date-fns) ] [ ↗ link ]`. Tipo de fonte: `data` (API/odds), `web` (artigo), `model` (saída do motor), `news`.

**Variantes.** `layout`: `inline` (chips numerados [1][2]) | `stacked` (lista). `kind` por item colore o ícone.

**Estados.** `empty` → **não** silenciar: render "sem fonte verificável" em `text-faint` (honestidade > falsa autoridade). `loading` → chips skeleton. Link externo → ícone ↗ + `rel="noopener"`.

**Tokens.** Chip `bg-muted border-border text-muted-foreground`, hover `text-foreground`. Ícone de tipo colorido (`info`/`positive`/`primary`). Data `font-mono text-faint`.

**Onde mora.** `packages/ui/src/components/sources-list.tsx`.

```tsx
type Source = {
  id: string
  title: string
  url?: string
  kind: "data" | "web" | "model" | "news"
  dateLabel?: string   // date-fns
}
type SourcesListProps = React.ComponentProps<"div"> & {
  sources: Source[]
  layout?: "inline" | "stacked"
}
```

---

### 12. `ResponsibleGamingBanner` — aviso de jogo responsável (âmbar)

**Propósito.** Jogo responsável **como produto**, não rodapé (COMP-001, Lei 14.790). Banner âmbar reutilizável: disclaimer de risco, +18, links de autoexclusão/limites/ajuda. Presença é **requisito**, não opção, nas superfícies de pick.

**Anatomia.** `[ ícone aviso âmbar ] [ texto: "Probabilidade não é garantia. Aposte com responsabilidade." ] [ AgePill +18 ] [ links: limites · autoexclusão · jogo responsável ]`. Variante compacta = só ícone + 1 linha (rodapé de PickBox).

**Variantes.** `variant`: `full` (faixa completa, topo de superfície) | `compact` (1 linha, dentro de card) | `gate` (modal/tela de bloqueio +18 — usado no gate de entrada). `tone` fixo âmbar (não varia — é semântica de compliance cravada).

**Estados.** Estático (display). `gate` tem ações (confirmar +18 / sair). Nenhum estado o esconde — é a regra (proibido sumir com o aviso).

**Tokens.** `bg-warning/10 border-warning/30 text-warning` (ícone+borda), texto principal `text-foreground` para legibilidade. Links `text-info underline-offset-2`. Ver [[tokens]] (token âmbar = aviso/compliance).

**Onde mora.** `packages/ui/src/components/responsible-gaming-banner.tsx`. Conteúdo/copy canônica vem de [[conformidade]] (esta peça só renderiza; texto legal mora lá).

```tsx
type ResponsibleGamingBannerProps = React.ComponentProps<"div"> & {
  variant?: "full" | "compact" | "gate"
  onConfirmAge?: () => void   // só em variant="gate"
  onExit?: () => void
}
// copy default importada de consts de conformidade — NÃO hardcode jurídico no componente.
```

---

### 13. `AgePill` — selo +18

**Propósito.** Marca +18 ubíqua (requisito legal). Átomo reusado por PickBox, banner, header.

**Anatomia.** Pílula `"+18"` sólida. Tamanho `xs`/`sm`.

**Variantes.** `tone`: `solid` (default, alto contraste) | `outline`. `size`: `xs` | `sm`.

**Estados.** Display puro. Sem hover/disabled.

**Tokens.** `solid` → `bg-warning text-background` (alto contraste, família compliance — âmbar cravado em README §4.5: +18 é aviso, não perda). `outline` → `border-warning text-warning`. `font-mono` no "+18".

**Onde mora.** `packages/ui/src/components/age-pill.tsx`.

```tsx
type AgePillProps = React.ComponentProps<"span"> & { tone?: "solid" | "outline"; size?: "xs" | "sm" }
// render fixo "+18"
```

---

## Resumo de localização (mapa rápido)

| Componente | Tipo | Path em `packages/ui/src/components/` |
|---|---|---|
| EvBadge, WeightBadge, ConfidenceBar, MarketOddsStrip, DimensionCard, SourcesList, ResponsibleGamingBanner, AgePill | átomo (arquivo) | `ev-badge.tsx`, `weight-badge.tsx`, … |
| ValueCard, PickBox | molécula (pasta priv. + público raiz) | `value-card.tsx` + `value-card/`, `pick-box.tsx` + `pick-box/` |
| CalibrationPlot, ImmutableLedger, AssistantChat | composto (pasta) | `calibration-plot.tsx` + `calibration-plot/`, etc. |

Todos importados como `@workspace/ui/components/<nome>` (público sempre arquivo na raiz — ver §pegadinha do exports).

---

## Estados transversais (aplicar a todos)

- **loading** — skeleton no tom do painel (`skeleton` shadcn re-temado para `bg-muted`); números viram barras mono-width; nunca spinner genérico em cima de número (some o contexto).
- **empty** — copy honesta e específica por componente (já descrita acima). Princípio do produto: **vazio explica**, não some. "Sem valor", "sem fonte", "dados insuficientes" são conteúdo, não erro.
- **error** — tom âmbar (`warning`), mensagem acionável; nunca afirmar com dado quebrado (honestidade).
- **hover/focus** — `bg-panel-2` em cards; `focus-visible:ring` herdado do padrão button; alvos clicáveis ≥ 40px no mobile.
- **disabled** — `opacity-50 pointer-events-none` (padrão button). Raro nestes componentes (a maioria é display).

---

## Pendências para outras seções (não resolver aqui)

- Nomes canônicos dos tokens semânticos (`positive*`, `negative*`, `warning`, `info`, `--primary` para cyan, `bg-card`/`bg-secondary` para painéis, `faint`) → [[tokens]] e README §4.1 do DS.
- Copy jurídica canônica do ResponsibleGamingBanner / AgePill / gate +18 → [[conformidade]].
- Composição das três telas (Hub, Dossiê, Histórico) usando estes componentes → [[superficies]].
- Tipografia/escala (mono, pesos) e radius como tokens → [[tokens]] / [[fundacoes]].
