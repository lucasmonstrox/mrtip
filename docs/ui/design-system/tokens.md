# Fundamentos & Tokens — Design System do mrtip

> _as-of 2026-06-21_ · voltar para o [README do Design System](./README.md)

Esta é a seção **canônica** de fundamentos: cor, tipografia, espaçamento, raio, elevação, bordas e
motion. Tudo aqui é a fonte da verdade dos tokens. Componentes ([[componentes]]), padrões de superfície
e regras de domínio consomem estes tokens — não redefinem cor/raio/tipo localmente.

O mrtip é **dark-first**: a linguagem visual nasceu dos mockups dark (`docs/mockups/mrtip-mockups.html`).
O tema claro existe e é coerente, mas é secundário (apostadores operam à noite, terminais financeiros
são escuros, e a leitura de números/odds em mono pede fundo escuro). O contrato de variáveis é o do
**shadcn/ui** (Tailwind v4, `@theme inline`, sem `tailwind.config`) — não inventamos um sistema paralelo;
estendemos o contrato com cores **semânticas de domínio** que o shadcn neutro não tem.

> **Nota de processo:** no momento da escrita o arquivo `docs/mockups/mrtip-mockups.html` não estava
> presente na árvore de trabalho (apareceu como `?? docs/mockups/` no git status mas não existe em disco
> nem no histórico). Os valores abaixo foram derivados da paleta hex canônica fornecida no briefing do DS.
> `[A confirmar com João]` se algum hex divergir do HTML quando ele voltar ao repo.

---

## 0. Por que OKLCH (e não hex/HSL)

shadcn v4 já usa OKLCH. Mantemos. OKLCH é **perceptualmente uniforme**: o `L` (lightness) bate com o que o
olho percebe, então gerar variantes (-dim, hover, estados de foco) é aritmética simples e previsível, e o
contraste é controlável sem surpresas. Toda a paleta abaixo foi convertida de sRGB hex → OKLCH com a matriz
oficial. Os hex originais ficam anotados como comentário em cada token — são o registro de proveniência, não
um segundo source of truth.

---

## 1. Cor

### 1.1 Paleta-base derivada dos mockups (hex → OKLCH)

Todos os neutros caem numa **mesma família de matiz azul-aço** (`H ≈ 250–254`), o que dá o ar de terminal
frio dos mockups. Importante: os neutros **não** são grayscale puro (croma `0`) como o tema shadcn atual —
têm croma baixíssimo (`0.012–0.038`) que segura o tom azulado. É a diferença central vs. o `globals.css` de
hoje.

| Papel (mockup)   | Hex       | OKLCH                          | Uso |
| ---------------- | --------- | ------------------------------ | --- |
| `bg`             | `#0b0f14` | `oklch(0.1665 0.0124 254.17)`  | fundo da app (mais escuro) |
| `bg-2`           | `#0f151c` | `oklch(0.193 0.017 252.57)`    | fundo elevado / faixas alternadas |
| `panel`          | `#141c26` | `oklch(0.2234 0.0229 254.29)`  | superfície de card / popover |
| `panel-2`        | `#18222e` | `oklch(0.2482 0.0271 253.37)`  | card aninhado / input / hover de card |
| `line`           | `#243140` | `oklch(0.3082 0.0324 252.42)`  | borda padrão |
| `line-2`         | `#2e3e50` | `oklch(0.3579 0.0377 251.81)`  | borda de ênfase / divisória forte |
| `text`           | `#e7eef6` | `oklch(0.9461 0.0131 251.56)`  | texto primário |
| `muted`          | `#8aa0b4` | `oklch(0.6955 0.0385 245.82)`  | texto secundário / labels |
| `faint`          | `#5f7286` | `oklch(0.5441 0.0387 249.87)`  | texto terciário / placeholder / disabled |

**Cores de sinal (semânticas de domínio):**

| Papel            | Hex       | OKLCH                          | Significado cravado |
| ---------------- | --------- | ------------------------------ | --- |
| `green` (positive) | `#27d07a` | `oklch(0.7567 0.1798 154.43)` | **EV+ / pick positivo / green / acerto** |
| `green-dim`      | `#163828` | `oklch(0.3099 0.0496 161.03)`  | fundo tonal de bloco positivo |
| `green-line`     | `#1f6b46` | `oklch(0.4715 0.0953 157.9)`   | borda de bloco positivo |
| `amber` (warning) | `#f0b429` | `oklch(0.8045 0.1558 82.54)`  | **aviso / compliance / risco / "sem valor"** |
| `red` (negative) | `#f0556d` | `oklch(0.6631 0.1899 14.88)`   | **perda / red / erro / EV−** |
| `red-dim`        | `#3a1d24` | `oklch(0.273 0.0463 5.1)`      | fundo tonal de bloco negativo |
| `blue` (info)    | `#4ea3ff` | `oklch(0.7051 0.1584 252.55)`  | informação neutra / link |
| `accent` (cyan)  | `#6ad0ff` | `oklch(0.8143 0.1158 230.39)`  | destaque/realce de marca (ring, foco, acento de UI) |

> **Decisão — verde é EV+, NÃO é a `--primary`.** No contexto de apostas o verde carrega significado
> financeiro ("ganho/positivo") que a Lei 14.790 nos proíbe de transformar em promessa. Se o verde virasse a
> cor primária de botão, todo CTA gritaria "lucro". Por isso a **`--primary` é o cyan/accent** (cor de marca,
> neutra do ponto de vista regulatório) e o verde fica reservado para a semântica **`--color-positive` /
> EV+**, usado em dado e estado, não em "aperte aqui para ganhar". Ver [[../../features/conformidade/COMP-001-conformidade-jogo-responsavel]]
> e [[guidelines-conformidade]].

### 1.2 Mapeamento no contrato shadcn — tema `.dark` (primário)

| Variável shadcn        | Token-base        | OKLCH                          | Rationale |
| ---------------------- | ----------------- | ------------------------------ | --- |
| `--background`         | `bg`              | `oklch(0.1665 0.0124 254.17)`  | fundo da app |
| `--foreground`         | `text`            | `oklch(0.9461 0.0131 251.56)`  | texto primário |
| `--card`               | `panel`           | `oklch(0.2234 0.0229 254.29)`  | superfície de card |
| `--card-foreground`    | `text`            | `oklch(0.9461 0.0131 251.56)`  | |
| `--popover`            | `panel`           | `oklch(0.2234 0.0229 254.29)`  | dropdowns/menus = mesma superfície de card |
| `--popover-foreground` | `text`            | `oklch(0.9461 0.0131 251.56)`  | |
| `--primary`            | `accent` (cyan)   | `oklch(0.8143 0.1158 230.39)`  | cor de marca / CTA — **não** o verde (ver 1.1) |
| `--primary-foreground` | `bg`              | `oklch(0.1665 0.0124 254.17)`  | texto escuro sobre cyan claro |
| `--secondary`          | `panel-2`         | `oklch(0.2482 0.0271 253.37)`  | botão/superfície secundária |
| `--secondary-foreground` | `text`          | `oklch(0.9461 0.0131 251.56)`  | |
| `--muted`              | `panel-2`         | `oklch(0.2482 0.0271 253.37)`  | fundos discretos |
| `--muted-foreground`   | `muted`           | `oklch(0.6955 0.0385 245.82)`  | texto secundário |
| `--accent`             | `line-2`          | `oklch(0.3579 0.0377 251.81)`  | hover/realce de UI (estado), distinto da marca |
| `--accent-foreground`  | `text`            | `oklch(0.9461 0.0131 251.56)`  | |
| `--destructive`        | `red`             | `oklch(0.6631 0.1899 14.88)`   | = perda/erro de domínio (unificado) |
| `--border`             | `line`            | `oklch(0.3082 0.0324 252.42)`  | borda sólida (sem alpha — diferente do shadcn padrão que usa `oklch(1 0 0 / 10%)`) |
| `--input`              | `line`            | `oklch(0.3082 0.0324 252.42)`  | borda de input |
| `--ring`               | `accent` (cyan)   | `oklch(0.8143 0.1158 230.39)`  | anel de foco = cor de marca |
| `--chart-1`            | `green`           | `oklch(0.7567 0.1798 154.43)`  | EV+ / série positiva |
| `--chart-2`            | `blue`            | `oklch(0.7051 0.1584 252.55)`  | info / linha de fechamento (CLV) |
| `--chart-3`            | `amber`           | `oklch(0.8045 0.1558 82.54)`   | aviso / neutro-quente |
| `--chart-4`            | `red`             | `oklch(0.6631 0.1899 14.88)`   | perda / EV− |
| `--chart-5`            | `accent` (cyan)   | `oklch(0.8143 0.1158 230.39)`  | marca / destaque secundário |
| `--sidebar`            | `bg-2`            | `oklch(0.193 0.017 252.57)`    | shell de navegação levemente destacado do bg |
| `--sidebar-foreground` | `text`            | `oklch(0.9461 0.0131 251.56)`  | |
| `--sidebar-primary`    | `accent` (cyan)   | `oklch(0.8143 0.1158 230.39)`  | item ativo na sidebar |
| `--sidebar-primary-foreground` | `bg`      | `oklch(0.1665 0.0124 254.17)`  | |
| `--sidebar-accent`     | `panel`           | `oklch(0.2234 0.0229 254.29)`  | hover de item de sidebar |
| `--sidebar-accent-foreground` | `text`     | `oklch(0.9461 0.0131 251.56)`  | |
| `--sidebar-border`     | `line`            | `oklch(0.3082 0.0324 252.42)`  | |
| `--sidebar-ring`       | `accent` (cyan)   | `oklch(0.8143 0.1158 230.39)`  | |

> **Decisão — `--border` sólido, não alpha.** O shadcn padrão usa `oklch(1 0 0 / 10%)` (branco translúcido)
> no dark. Trocamos por `line` sólido (`#243140`) porque os mockups têm linhas com cor definida e azulada;
> alpha sobre fundos diferentes (bg vs panel vs panel-2) produziria bordas de tons inconsistentes. Custo:
> perdemos a "auto-adaptação" do alpha. Vale a pena pela consistência visual de terminal.

> **Decisão — `--accent` (shadcn) ≠ cor de marca.** No vocabulário shadcn, `--accent` é a cor de **estado**
> (hover de item, realce de linha selecionada), não a cor de marca. Por isso `--accent` = `line-2` (um
> realce neutro) e a marca (cyan) vive em `--primary`/`--ring`/`--sidebar-primary`. Isso evita que todo
> hover fique ciano-berrante.

### 1.3 Cores semânticas de domínio expostas no `@theme`

O contrato shadcn não tem "positivo/negativo/aviso/info". Em vez de abusar de `--chart-*` na UI (que são para
gráficos), expomos tokens próprios via `@theme` — eles geram utilitárias Tailwind (`bg-positive`,
`text-negative`, `border-warning-line`, etc.) **sem** colidir com o contrato shadcn.

```css
/* dentro de @theme inline */
--color-positive:      var(--positive);       /* EV+ / green / acerto      */
--color-positive-dim:  var(--positive-dim);   /* fundo tonal positivo      */
--color-positive-line: var(--positive-line);  /* borda de bloco positivo   */
--color-negative:      var(--negative);       /* perda / red / EV-         */
--color-negative-dim:  var(--negative-dim);   /* fundo tonal negativo      */
--color-warning:       var(--warning);        /* aviso / compliance / risco*/
--color-info:          var(--info);           /* informação neutra / link  */
```

Convenção de nomes: **`positive`/`negative`/`warning`/`info`** (papéis), não `green`/`red`/`amber`/`blue`
(aparência). Assim a UI fala intenção — `text-positive` num número de EV — e o significado é à prova de
re-tema. A aparência (qual hex) vive só no `:root`/`.dark`.

> **Uso obrigatório:** dado financeiro positivo (EV+, yield+, CLV+) → `text-positive`; negativo →
> `text-negative`; selo de compliance/risco/"sem valor" → `warning`; metadado neutro/link → `info`. Nunca
> use `--primary`(cyan) para significar "ganho". Ver [[guidelines-conformidade]].

### 1.4 Tema claro (`:root`) — secundário, coerente

Mantém os mesmos matizes; inverte o eixo de lightness. Fundos quase-brancos com leve tom azul-aço (croma
mínimo), texto azul-tinta escuro, cores de sinal **escurecidas** (subir croma / baixar L) para passar AA
sobre fundo claro — o verde/âmbar dos mockups são claros demais para texto sobre branco.

| Variável               | OKLCH                          | Origem |
| ---------------------- | ------------------------------ | --- |
| `--background`         | `oklch(0.985 0.003 250)`       | branco azulado |
| `--foreground`         | `oklch(0.21 0.02 254)`         | tinta azul-aço |
| `--card`               | `oklch(1 0 0)`                 | branco puro (card sobressai do bg) |
| `--card-foreground`    | `oklch(0.21 0.02 254)`         | |
| `--popover`            | `oklch(1 0 0)`                 | |
| `--popover-foreground` | `oklch(0.21 0.02 254)`         | |
| `--primary`            | `oklch(0.55 0.13 235)`         | cyan escurecido p/ AA com texto branco |
| `--primary-foreground` | `oklch(0.99 0.003 250)`        | |
| `--secondary`          | `oklch(0.96 0.006 250)`        | |
| `--secondary-foreground` | `oklch(0.26 0.02 254)`       | |
| `--muted`              | `oklch(0.96 0.006 250)`        | |
| `--muted-foreground`   | `oklch(0.52 0.03 248)`         | |
| `--accent`             | `oklch(0.93 0.01 250)`         | realce de estado claro |
| `--accent-foreground`  | `oklch(0.26 0.02 254)`         | |
| `--destructive`        | `oklch(0.55 0.2 15)`           | vermelho escurecido |
| `--border`             | `oklch(0.9 0.008 250)`         | |
| `--input`              | `oklch(0.9 0.008 250)`         | |
| `--ring`               | `oklch(0.55 0.13 235)`         | |
| `--chart-1`            | `oklch(0.58 0.16 154)`         | verde escuro p/ leitura em claro |
| `--chart-2`            | `oklch(0.55 0.16 252)`         | |
| `--chart-3`            | `oklch(0.66 0.15 75)`          | |
| `--chart-4`            | `oklch(0.55 0.2 15)`           | |
| `--chart-5`            | `oklch(0.55 0.13 235)`         | |
| `--sidebar`            | `oklch(0.97 0.005 250)`        | |
| `--sidebar-foreground` | `oklch(0.21 0.02 254)`         | |
| `--sidebar-primary`    | `oklch(0.55 0.13 235)`         | |
| `--sidebar-primary-foreground` | `oklch(0.99 0.003 250)`| |
| `--sidebar-accent`     | `oklch(0.93 0.01 250)`         | |
| `--sidebar-accent-foreground` | `oklch(0.26 0.02 254)` | |
| `--sidebar-border`     | `oklch(0.9 0.008 250)`         | |
| `--sidebar-ring`       | `oklch(0.55 0.13 235)`         | |

Semânticas no claro: `--positive oklch(0.52 0.15 154)`, `--positive-dim oklch(0.95 0.04 158)`,
`--positive-line oklch(0.7 0.1 156)`, `--negative oklch(0.55 0.2 15)`, `--negative-dim oklch(0.95 0.03 12)`,
`--warning oklch(0.62 0.14 70)`, `--info oklch(0.55 0.16 252)`.

> `[A confirmar com João]` o tema claro é "best effort coerente". Se o mrtip for permanentemente dark-only
> (provável, dado o público e a estética de terminal), podemos não investir em refinar o claro — ele fica
> como fallback de `prefers-color-scheme` e acessibilidade, não como produto polido.

### 1.5 Contraste WCAG (verificado, tema dark)

Ratios calculados pela fórmula WCAG 2.x (luminância relativa). AA texto normal = ≥4.5; AA texto grande/UI = ≥3.0.

| Par                        | Ratio  | Veredito |
| -------------------------- | ------ | --- |
| `text` / `bg`              | 16.44  | AAA |
| `text` / `panel`           | 14.67  | AAA |
| `text` / `panel-2`         | 13.74  | AAA |
| `muted` / `bg`             | 7.11   | AAA |
| `muted` / `panel`          | 6.35   | AA (texto normal) ✓ |
| `faint` / `bg`             | 3.88   | **só AA-grande/UI** — nunca usar `faint` em texto pequeno de corpo |
| `faint` / `panel`          | 3.46   | **só AA-grande/UI** — idem; ok p/ placeholder/disabled |
| `positive`(green) / `bg`   | 9.51   | AAA |
| `positive` / `panel`       | 8.49   | AAA |
| `warning`(amber) / `bg`    | 10.31  | AAA |
| `warning` / `panel`        | 9.21   | AAA |
| `negative`(red) / `bg`     | 5.70   | AA ✓ |
| `negative` / `panel`       | 5.09   | AA ✓ |
| `info`(blue) / `bg`        | 7.33   | AAA |
| `info` / `panel`           | 6.54   | AA ✓ |
| `accent`(cyan) / `panel`   | 9.87   | AAA |
| `bg` sobre `positive` (texto escuro em botão verde) | 9.51 | AAA — se houver botão verde, use texto escuro, nunca branco |
| `text` / `positive-dim`    | 11.01  | AAA |
| `positive` / `positive-dim`| 6.37   | AA ✓ (número verde sobre bloco verde-dim) |
| `negative` / `negative-dim`| 4.51   | AA ✓ (no limite — não reduzir) |

**Regras de contraste cravadas:**
- `faint` é **proibido** em texto de corpo pequeno. Só hint/placeholder/disabled, ou texto ≥18.66px regular / ≥14px bold.
- `negative` sobre `negative-dim` está em 4.51 (limite de AA). Não escurecer mais o número nem clarear mais o dim.
- Sobre `--primary` (cyan claro) o texto é **sempre escuro** (`--primary-foreground` = `bg`). Texto branco em cyan reprova.

---

## 2. Tipografia

Fontes já carregadas em `apps/web/app/layout.tsx`: **Geist** (`--font-sans`) e **Geist Mono** (`--font-mono`).

> **Gap a corrigir:** `--font-mono` existe no `<html>` mas **não está mapeado em `@theme`** (só `--font-sans`
> e `--font-heading`). Sem o mapa, a utilitária `font-mono` do Tailwind não aponta para a Geist Mono. O bloco
> da seção 6 adiciona `--font-mono: var(--font-mono)` no `@theme`. **Sem isso, `font-mono` em odds/CLV/hash
> não funciona** — esse é o ponto mais importante da tipografia do mrtip.

### 2.1 Regra de ouro: número é mono + tabular

Todo **número de máquina** — odds, EV%, CLV, yield, stake, probabilidade, hash, timestamp — usa **Geist Mono
com `tabular-nums`**. Tabular trava a largura de cada dígito, então colunas de odds/EV num ledger ou tabela
alinham na vírgula e não "dançam" quando atualizam ao vivo. Prosa, labels e títulos usam Geist (sans).

```css
.num { font-family: var(--font-mono); font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }
```

Sugiro um utilitário/classe `.num` (ou `tabular-nums font-mono` direto) aplicado em todo dado quantitativo.
Ver [[componentes]] para os primitivos `<Odd>`, `<EV>`, `<Hash>` que encapsulam isso.

### 2.2 Escala de tipo

Escala modular ~1.2 (minor third), ancorada em 14px de corpo (densidade de terminal/dashboard, não de blog).

| Token       | rem / px        | line-height   | Uso |
| ----------- | --------------- | ------------- | --- |
| `text-2xs`  | 0.6875 / 11px   | 1.4 (15.4px)  | micro-label, selo de hash, timestamp em ledger |
| `text-xs`   | 0.75 / 12px     | 1.4 (16.8px)  | label de campo, badge, eyebrow de seção |
| `text-sm`   | 0.8125 / 13px   | 1.5 (19.5px)  | meta, texto auxiliar, fontes |
| `text-base` | 0.875 / 14px    | 1.55 (21.7px) | **corpo padrão** |
| `text-md`   | 1.0 / 16px      | 1.5 (24px)    | corpo destacado, valores de card |
| `text-lg`   | 1.125 / 18px    | 1.45 (26px)   | subtítulo |
| `text-xl`   | 1.375 / 22px    | 1.3 (28.6px)  | título de card/seção |
| `text-2xl`  | 1.75 / 28px     | 1.2 (33.6px)  | número grande (odd em destaque, KPI) |
| `text-3xl`  | 2.25 / 36px     | 1.15 (41.4px) | hero de KPI (CLV/yield no Histórico) |

> `text-base` = 14px é uma decisão de densidade. Telas do mrtip são listas densas de jogos/picks; 16px
> inflaria tudo. `[A confirmar com João]` se ele preferir 16px (mais "consumer", menos "terminal").

### 2.3 Pesos, tracking, headers de seção

| Papel             | Família | Peso | Tracking | Transform |
| ----------------- | ------- | ---- | -------- | --------- |
| Corpo             | sans    | 400  | normal   | — |
| Ênfase / label    | sans    | 500  | normal   | — |
| Título de card    | sans    | 600  | `-0.01em`| — |
| KPI / número hero | mono    | 600  | `-0.01em`| — |
| **Header de seção (eyebrow)** | sans | 600 | **`0.08em`** | **UPPERCASE** |
| Dado mono inline  | mono    | 500  | normal (tabular) | — |

> **Header de seção uppercase + tracking** é a assinatura tipográfica dos mockups: pequenos rótulos como
> "VALUE BETS", "DIMENSÕES DO JOGO", "LEDGER" em `text-xs`/`text-2xs`, `font-semibold`, `uppercase`,
> `tracking-[0.08em]`, na cor `muted`. Padronizar como classe/componente `<SectionLabel>` em [[componentes]].
> Texto comum **nunca** leva uppercase+tracking (é só para esses eyebrows).

```css
.section-label {
  font: 600 var(--text-xs)/1 var(--font-sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
```

---

## 3. Espaçamento

Base **4px** (escala Tailwind padrão — sem override). Cravo o ritmo recomendado para as superfícies densas:

| Token         | px   | Uso típico |
| ------------- | ---- | --- |
| `space-1` (4) | 4    | gap entre ícone e label |
| `space-2` (8) | 8    | padding interno apertado, gap em chip |
| `space-3` (12)| 12   | padding de célula de tabela / item de lista |
| `space-4` (16)| 16   | **padding padrão de card** |
| `space-5` (20)| 20   | padding de card maior |
| `space-6` (24)| 24   | gap entre cards / seções dentro de painel |
| `space-8` (32)| 32   | gap entre blocos de página |
| `space-10`(40)| 40   | margem de página / topo de seção |

Densidade: lista de picks/jogos usa linhas de `space-3` vertical; cards de destaque (pickbox, KPI) usam
`space-4`/`space-5`. Não inventar valores fora da escala de 4.

---

## 4. Raio

Os mockups têm **dois** raios: `14px` (cards/painéis) e `9px` (controles internos — chips, inputs, botões
pequenos). Mapeamos para a variável `--radius` do shadcn de modo que a escala derivada (`--radius-sm/md/lg/xl`)
caia perto desses dois valores.

**Decisão:** `--radius: 0.875rem` (**14px**) — é o raio dominante dos mockups (cards). A escala shadcn deriva:

| Token shadcn   | Cálculo            | px    | Uso |
| -------------- | ------------------ | ----- | --- |
| `--radius-sm`  | `--radius * 0.6`   | 8.4px | ~ os `9px` dos mockups → chip, input, botão pequeno, badge |
| `--radius-md`  | `--radius * 0.8`   | 11.2px| controle médio |
| `--radius-lg`  | `--radius`         | 14px  | **card / painel / popover (raio canônico)** |
| `--radius-xl`  | `--radius * 1.4`   | 19.6px| modal / container grande |

> O `9px` dos mockups não tem um slot exato; `--radius-sm` (8.4px) é a aproximação canônica e ninguém vai
> perceber 0.6px. Se for crítico, há a opção de um token dedicado `--radius-control: 9px`, mas evito
> proliferar tokens — **decisão: usar `--radius-sm`** e não criar `--radius-control`. `[A confirmar com João]`
> se ele quiser o 9px exato.
>
> Mudança vs. atual: o `globals.css` de hoje tem `--radius: 0.625rem` (10px). Subimos para `0.875rem` (14px).

Acento de card à esquerda (faixa de 3px) **não é raio** — é uma borda/pseudo-elemento colorido; ver
seção 7.4 e [[componentes]] (variante `accent-left` do Card).

---

## 5. Elevação / sombra, bordas, motion

### 5.1 Elevação

Em dark, **profundidade vem de cor de superfície + borda**, não de sombra preta (sombra preta sobre fundo
quase-preto é invisível). A hierarquia é: `bg` → `card`(panel) → nested(panel-2), cada degrau ~+0.025–0.05 de
`L`. Sombra entra só para overlays que flutuam acima do plano (dropdown, modal, toast, tooltip).

| Token         | Valor                                                   | Uso |
| ------------- | ------------------------------------------------------- | --- |
| `shadow-none` | —                                                       | cards no plano (usam só borda) |
| `shadow-sm`   | `0 1px 2px oklch(0 0 0 / 0.30)`                         | hover sutil de card interativo |
| `shadow-md`   | `0 4px 12px oklch(0 0 0 / 0.40)`                        | dropdown / popover |
| `shadow-lg`   | `0 12px 32px oklch(0 0 0 / 0.50)`                       | modal / dialog |
| `shadow-focus`| `0 0 0 3px color-mix(in oklch, var(--ring) 40%, transparent)` | anel de foco (cyan translúcido) |

Regra: card no fluxo = **sem sombra**, só `border`. Sombra = sinal de "isto flutua".

### 5.2 Bordas

- Largura padrão **1px**, cor `--border` (`line`).
- Divisória de ênfase / borda de bloco semântico = `line-2` ou a `*-line` da cor (ex.: `--positive-line`).
- Hairline de tabela: `--border` a 1px; em fundo `bg` pode-se usar `bg-2` como linha quase-invisível para
  zebra striping.

### 5.3 Motion

Os mockups têm um **fade de entrada** discreto. Tokens de motion:

| Token              | Valor                          | Uso |
| ------------------ | ------------------------------ | --- |
| `--ease-standard`  | `cubic-bezier(0.2, 0, 0, 1)`   | transições gerais (entrada/saída de UI) |
| `--ease-out`       | `cubic-bezier(0, 0, 0.2, 1)`   | enter (aparecer) |
| `--duration-fast`  | `120ms`                        | hover, focus, mudança de cor/estado |
| `--duration-base`  | `200ms`                        | **fade de entrada de card/seção (assinatura dos mockups)** |
| `--duration-slow`  | `320ms`                        | overlay/modal |

```css
@keyframes mrtip-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in { animation: mrtip-fade-in var(--duration-base) var(--ease-out) both; }
```

> **Acessibilidade obrigatória:** envolver toda animação em `@media (prefers-reduced-motion: reduce)` para
> zerar `animation`/`transition`. Incluído no bloco da seção 6. Público de apostas pode usar a app por horas;
> motion gratuito cansa e o jogo responsável pede sobriedade — motion é funcional (feedback de estado, "pick
> gravado"), nunca decorativo.

---

## 6. Bloco pronto para colar — `packages/ui/src/styles/globals.css`

Substitui o conteúdo atual do arquivo inteiro (`packages/ui/src/styles/globals.css`). Inclui o cabeçalho
de `@import`/`@custom-variant`/`@source` do topo (para não apagá-lo ao colar). **Mudanças vs. atual:**
(a) neutros oklch grayscale → azul-aço com croma baixo; (b) `--radius` 0.625rem → 0.875rem;
(c) `--border`/`--input` alpha → sólido; (d) `--primary` vira cyan; (e) adiciona `--font-mono` ao `@theme`;
(f) adiciona tokens semânticos `--color-positive/negative/warning/info` + `-dim`/`-line`;
(g) adiciona tokens de motion/shadow; (h) `prefers-reduced-motion`; (i) mantém `--radius-2xl/3xl/4xl`
(já presentes no globals.css atual).

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));
@source "../../../apps/**/*.{ts,tsx}";
@source "../../../components/**/*.{ts,tsx}";
@source "../**/*.{ts,tsx}";

@theme inline {
    --font-sans: var(--font-sans);
    --font-mono: var(--font-mono);            /* NOVO — sem isto, font-mono não usa Geist Mono */
    --font-heading: var(--font-sans);

    /* contrato shadcn */
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-popover: var(--popover);
    --color-popover-foreground: var(--popover-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-accent: var(--accent);
    --color-accent-foreground: var(--accent-foreground);
    --color-destructive: var(--destructive);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --color-chart-1: var(--chart-1);
    --color-chart-2: var(--chart-2);
    --color-chart-3: var(--chart-3);
    --color-chart-4: var(--chart-4);
    --color-chart-5: var(--chart-5);
    --color-sidebar: var(--sidebar);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-ring: var(--sidebar-ring);

    /* semânticas de domínio (NOVO) */
    --color-positive: var(--positive);
    --color-positive-dim: var(--positive-dim);
    --color-positive-line: var(--positive-line);
    --color-negative: var(--negative);
    --color-negative-dim: var(--negative-dim);
    --color-warning: var(--warning);
    --color-info: var(--info);

    /* raio */
    --radius-sm: calc(var(--radius) * 0.6);   /* ~8.4px ≈ 9px dos mockups */
    --radius-md: calc(var(--radius) * 0.8);   /* ~11.2px */
    --radius-lg: var(--radius);               /* 14px — card */
    --radius-xl: calc(var(--radius) * 1.4);   /* ~19.6px — modal */
    --radius-2xl: calc(var(--radius) * 1.8);  /* ~25.2px */
    --radius-3xl: calc(var(--radius) * 2.2);  /* ~30.8px */
    --radius-4xl: calc(var(--radius) * 2.6);  /* ~36.4px */
}

:root {
    /* tema CLARO (secundário) */
    --background: oklch(0.985 0.003 250);
    --foreground: oklch(0.21 0.02 254);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.21 0.02 254);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.21 0.02 254);
    --primary: oklch(0.55 0.13 235);
    --primary-foreground: oklch(0.99 0.003 250);
    --secondary: oklch(0.96 0.006 250);
    --secondary-foreground: oklch(0.26 0.02 254);
    --muted: oklch(0.96 0.006 250);
    --muted-foreground: oklch(0.52 0.03 248);
    --accent: oklch(0.93 0.01 250);
    --accent-foreground: oklch(0.26 0.02 254);
    --destructive: oklch(0.55 0.2 15);
    --border: oklch(0.9 0.008 250);
    --input: oklch(0.9 0.008 250);
    --ring: oklch(0.55 0.13 235);
    --chart-1: oklch(0.58 0.16 154);
    --chart-2: oklch(0.55 0.16 252);
    --chart-3: oklch(0.66 0.15 75);
    --chart-4: oklch(0.55 0.2 15);
    --chart-5: oklch(0.55 0.13 235);
    --sidebar: oklch(0.97 0.005 250);
    --sidebar-foreground: oklch(0.21 0.02 254);
    --sidebar-primary: oklch(0.55 0.13 235);
    --sidebar-primary-foreground: oklch(0.99 0.003 250);
    --sidebar-accent: oklch(0.93 0.01 250);
    --sidebar-accent-foreground: oklch(0.26 0.02 254);
    --sidebar-border: oklch(0.9 0.008 250);
    --sidebar-ring: oklch(0.55 0.13 235);
    /* semânticas claro */
    --positive: oklch(0.52 0.15 154);
    --positive-dim: oklch(0.95 0.04 158);
    --positive-line: oklch(0.7 0.1 156);
    --negative: oklch(0.55 0.2 15);
    --negative-dim: oklch(0.95 0.03 12);
    --warning: oklch(0.62 0.14 70);
    --info: oklch(0.55 0.16 252);

    --radius: 0.875rem;                       /* 14px */

    /* motion */
    --ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --duration-fast: 120ms;
    --duration-base: 200ms;
    --duration-slow: 320ms;
}

.dark {
    /* tema ESCURO (primário — bate com os mockups) */
    --background: oklch(0.1665 0.0124 254.17);   /* #0b0f14 */
    --foreground: oklch(0.9461 0.0131 251.56);   /* #e7eef6 */
    --card: oklch(0.2234 0.0229 254.29);         /* #141c26 */
    --card-foreground: oklch(0.9461 0.0131 251.56);
    --popover: oklch(0.2234 0.0229 254.29);
    --popover-foreground: oklch(0.9461 0.0131 251.56);
    --primary: oklch(0.8143 0.1158 230.39);      /* #6ad0ff cyan (marca) */
    --primary-foreground: oklch(0.1665 0.0124 254.17);
    --secondary: oklch(0.2482 0.0271 253.37);    /* #18222e */
    --secondary-foreground: oklch(0.9461 0.0131 251.56);
    --muted: oklch(0.2482 0.0271 253.37);
    --muted-foreground: oklch(0.6955 0.0385 245.82); /* #8aa0b4 */
    --accent: oklch(0.3579 0.0377 251.81);       /* #2e3e50 (estado) */
    --accent-foreground: oklch(0.9461 0.0131 251.56);
    --destructive: oklch(0.6631 0.1899 14.88);   /* #f0556d = perda */
    --border: oklch(0.3082 0.0324 252.42);       /* #243140 sólido */
    --input: oklch(0.3082 0.0324 252.42);
    --ring: oklch(0.8143 0.1158 230.39);         /* cyan */
    --chart-1: oklch(0.7567 0.1798 154.43);      /* verde EV+ */
    --chart-2: oklch(0.7051 0.1584 252.55);      /* azul info/CLV */
    --chart-3: oklch(0.8045 0.1558 82.54);       /* âmbar */
    --chart-4: oklch(0.6631 0.1899 14.88);       /* vermelho perda */
    --chart-5: oklch(0.8143 0.1158 230.39);      /* cyan */
    --sidebar: oklch(0.193 0.017 252.57);        /* #0f151c */
    --sidebar-foreground: oklch(0.9461 0.0131 251.56);
    --sidebar-primary: oklch(0.8143 0.1158 230.39);
    --sidebar-primary-foreground: oklch(0.1665 0.0124 254.17);
    --sidebar-accent: oklch(0.2234 0.0229 254.29);
    --sidebar-accent-foreground: oklch(0.9461 0.0131 251.56);
    --sidebar-border: oklch(0.3082 0.0324 252.42);
    --sidebar-ring: oklch(0.8143 0.1158 230.39);
    /* semânticas escuro */
    --positive: oklch(0.7567 0.1798 154.43);     /* #27d07a */
    --positive-dim: oklch(0.3099 0.0496 161.03); /* #163828 */
    --positive-line: oklch(0.4715 0.0953 157.9); /* #1f6b46 */
    --negative: oklch(0.6631 0.1899 14.88);      /* #f0556d */
    --negative-dim: oklch(0.273 0.0463 5.1);     /* #3a1d24 */
    --warning: oklch(0.8045 0.1558 82.54);       /* #f0b429 */
    --info: oklch(0.7051 0.1584 252.55);         /* #4ea3ff */
}

@layer base {
    * {
        @apply border-border outline-ring/50;
    }
    body {
        @apply bg-background text-foreground;
    }
    /* número de máquina = mono + tabular */
    .num {
        font-family: var(--font-mono);
        font-variant-numeric: tabular-nums;
        font-feature-settings: "tnum" 1;
    }
    /* eyebrow / header de seção dos mockups */
    .section-label {
        font-weight: 600;
        font-size: 0.75rem;
        line-height: 1;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-muted-foreground);
    }
}

@keyframes mrtip-fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
}
@layer utilities {
    .fade-in { animation: mrtip-fade-in var(--duration-base) var(--ease-out) both; }
}
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

> **Default dark:** os mockups são dark-first. Para a app abrir em dark por padrão, garantir `class="dark"`
> no `<html>` (via `ThemeProvider` com `defaultTheme="dark"`) — hoje o `layout.tsx` não força. `[A confirmar
> com João]` se quer dark forçado ou respeitando `prefers-color-scheme`. Detalhe de wiring fica em
> [[componentes]] / setup do app, não neste arquivo de tokens.

---

## 7. Consumo (resumo para quem implementa)

1. **Cor de dado financeiro:** `text-positive` (EV+/yield+/CLV+), `text-negative` (perda/EV−),
   `text-warning` (risco/compliance/"sem valor"), `text-info` (neutro/link). **Nunca** `text-primary` para "ganho".
2. **Número:** sempre `.num` (ou `font-mono tabular-nums`). Odds, EV, CLV, stake, hash, timestamp.
3. **Eyebrow de seção:** `.section-label` (uppercase + tracking 0.08em + muted).
4. **Card:** superfície `bg-card`, borda `border` 1px, raio `rounded-lg` (14px), sem sombra no fluxo.
   Faixa de acento à esquerda (3px) = pseudo-elemento/borda colorida pela semântica do card (positive/warning),
   especificada em [[componentes]].
5. **Foco:** `--ring` (cyan) + `shadow-focus`. Compliance e acessibilidade exigem foco visível.

## Cross-refs
- [[componentes]] — primitivos (`Card accent-left`, `<Odd>`, `<EV>`, `<Hash>`, `SectionLabel`, Badge) que consomem estes tokens.
- [[guidelines-conformidade]] — uso obrigatório de cor/linguagem sob a Lei 14.790.
- [[README]] — índice do Design System.
- [`packages/ui/src/styles/globals.css`](../../../packages/ui/src/styles/globals.css) — alvo do bloco da seção 6.
- [`apps/web/app/layout.tsx`](../../../apps/web/app/layout.tsx) — fontes Geist/Geist Mono (`--font-sans`/`--font-mono`).
- [`docs/features/conformidade/COMP-001-conformidade-jogo-responsavel.md`](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md)
