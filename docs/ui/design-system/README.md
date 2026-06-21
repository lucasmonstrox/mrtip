# Design System do mrtip

> _as-of 2026-06-21_ · este é o **ponto de entrada** do Design System (DS). Leia daqui antes de qualquer seção.

O mrtip é um copiloto de IA para futebol (Brasil-first) que transforma dados de uma partida em
**prognósticos com value, value bets e um assistente conversacional**, para dois públicos (apostador e
tipster). A tese não é "mais uma IA de palpite" — é ser o copiloto **mais honesto e auditável** do mercado
([tese-produto](../../tese-produto.md), [visão-geral](../../visao-geral.md)). Este DS existe para que essa
tese **apareça em pixels**: a sobriedade é a feature, e a linguagem visual é parte do argumento de confiança.

---

## 1. Filosofia

**Probabilidade calibrada, não promessa.** Tudo no DS deriva de uma frase: num mercado saturado de "90% de
acerto" opaco ([panorama-concorrentes](../../research/panorama-concorrentes.md)), o mrtip ganha **parecendo um
terminal de dados, não um cassino**. A régua de uma frase, herdada de [marca-e-tom](./marca-e-tom.md): _se um
afiliado de Telegram poderia ter feito, está errado._

Três achados de produto viram restrição de design e atravessam todas as seções:

- **Nenhum pick sem o porquê.** Todo número (EV, odd, prob) reserva espaço para explicação + fontes. Tela que
  só "cabe" escondendo a justificativa está errada.
- **"Não apostar também é resultado."** O estado "sem valor" é conteúdo de primeira classe, não vazio triste.
- **Conformidade = identidade (a jogada dupla).** "Probabilidade + risco, nunca renda/lucro" é o que a
  **Lei 14.790/2023** exige _e_ o que diferencia o mrtip. Compliance não é rodapé — é o ativo de confiança
  ([conformidade-jogo-responsavel](./conformidade-jogo-responsavel.md), [COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md)).

---

## 2. Princípios de design (opinados)

1. **Honesto e auditável antes de bonito.** Perdas visíveis, CLV cru, hash + timestamp na UI. O registro
   imutável é produto, não letra miúda. Vazio explica ("sem valor", "sem fonte", "dados insuficientes") em vez
   de sumir.
2. **Verde é dado, não botão.** Verde significa **EV+/positivo** e nada mais; **nunca** é a cor de CTA. A cor
   primária/marca é o **cyan**, regulatoriamente neutra. Pintar "apertar aqui" de verde mente sobre ganho e
   fere a Lei 14.790. (Token canônico: `--color-positive` — ver §4.)
3. **Cor nunca comunica sozinha.** Todo sinal carrega `+/−` numérico **+ ícone + texto**. Teste de sanidade:
   a tela em grayscale ainda distingue EV+ / perda / aviso. (Pacto de [padroes-layouts-acessibilidade §4.5](./padroes-layouts-acessibilidade.md).)
4. **O número é o herói; a moldura recua.** Mono (Geist Mono) + `tabular-nums` para todo número de máquina
   (odds, EV, CLV, yield, hash, timestamp). Princípio de marca: _mono é a fonte da verdade, sans é a fonte da
   conversa_ — espelha "estimar ≠ explicar" da [taxonomia de sinais](../../arquitetura/taxonomia-sinais.md).
5. **Dark-first, denso, sóbrio.** Azul-aço sobre `#0b0f14` (não-preto-puro), off-white, primárias
   dessaturadas — gramática de terminal de trading, validada em [benchmark-externo](./benchmark-externo.md).
   Sem glow, gradiente, emoji de hype, exclamação, CAPS ou animação festiva. Light mode é débito consciente,
   não requisito de v1.
6. **Tokens semânticos por papel, não por aparência.** A UI fala intenção (`text-positive`,
   `border-warning`), não pigmento (`green`/`red`). Estende o contrato shadcn sem quebrá-lo.
7. **Reusar antes de inventar.** shadcn/Radix via `packages/ui`, padrão do `button.tsx` existente (cva +
   `data-slot` + `cn`), `lucide-react` para ícones, e as portas duras do repo para dinheiro/datas. Promove
   para `lib/`/`@workspace/core` só quando 2+ features usam.

---

## 3. Índice das seções

| Seção | O que cobre |
|---|---|
| **[Tokens & Fundamentos](./tokens.md)** | Fonte da verdade: paleta hex→OKLCH, contrato shadcn `.dark`+claro, tokens semânticos, tipografia, espaçamento, raio, elevação, motion, contraste WCAG e o bloco `@theme` pronto para `globals.css`. |
| **[Marca & Tom de Voz](./marca-e-tom.md)** | Logo `mr·tip` (dot verde), personalidade anti-hype, leis de linguagem coladas na Lei 14.790, glossário usa/bane, card "sem valor" como manifesto, migração emoji→lucide, número-em-mono como marca. |
| **[Componentes](./componentes.md)** | Bases shadcn a adicionar + 13 componentes de domínio (EvBadge, WeightBadge, ValueCard, PickBox, CalibrationPlot, ImmutableLedger, AssistantChat, ResponsibleGamingBanner, AgePill…) com anatomia, cva, estados, tokens e API TSX. |
| **[Conformidade & Jogo Responsável](./conformidade-jogo-responsavel.md)** | Padrões de UI da Lei 14.790: avisos obrigatórios por superfície, checklist de linguagem proibida/obrigatória (PR template), registro imutável, acerto honesto, anti-padrões (gamificação, hot streak, urgência). |
| **[Padrões, Layouts & Acessibilidade](./padroes-layouts-acessibilidade.md)** | Gramática de composição: app-shell, grid, breakpoints, templates das 4 superfícies (Hub, Dossiê, Histórico·CLV, Admin), densidade de dados, estados vazio/loading/erro, WCAG AA, formatação BR. |
| **[Benchmark externo](./benchmark-externo.md)** | O que copiar/rejeitar de trading, fintech BR (NuDS), OKLCH+Tailwind v4, apps regulados (UKGC) e viz de incerteza — fundamentando as decisões acima com fontes citadas. |

> **Nota de nomenclatura de arquivos.** Durante a escrita, várias seções se referenciaram por nomes
> provisórios via `[[wikilink]]` (ex.: `[[tokens-cor]]`, `[[cor]]`, `[[fundacoes]]`, `[[componentes-dominio]]`,
> `[[superficies]]`, `[[conteudo-tom-conformidade]]`, `[[graficos-e-dados]]`, `[[guidelines-conformidade]]`).
> **Os arquivos canônicos são os seis da tabela acima.** Mapa de resolução: `tokens-cor`/`cor`/`tipografia`/
> `fundacoes`/`fundamentos`/`grid-densidade` → **tokens.md**; `componentes-dominio` → **componentes.md**;
> `superficies`/`grid-densidade`/`graficos-e-dados` → **padroes-layouts-acessibilidade.md** (data-viz e grid
> moram lá; tokens de cor da viz vêm de tokens.md); `guidelines-conformidade`/`conteudo-tom-conformidade` →
> **conformidade-jogo-responsavel.md** (linguagem/copy) e **marca-e-tom.md** (tom). Ao revisar as seções,
> trocar os wikilinks pelos nomes reais.

---

## 4. Conflitos resolvidos entre seções (decisões cravadas)

Estas são as divergências reais que apareceram entre as seções. A decisão vale para todo o DS; a coluna
"ajustar" diz qual arquivo precisa ser editado para convergir.

### 4.1 Nomes dos tokens semânticos — **`positive`/`negative`/`warning`/`info`** (cravado)

`tokens.md` (a seção **canônica** de fundamentos) define os tokens por **papel**:
`--color-positive`, `--color-positive-dim`, `--color-positive-line`, `--color-negative`,
`--color-negative-dim`, `--color-warning`, `--color-info`. Já `componentes.md` e `benchmark-externo.md`
escreveram `--color-ev-positive` / `ev-positive-dim` / `ev-positive-line` / `--color-loss` / `loss-dim` /
`--color-accent-cyan`.

**Decisão:** vence **tokens.md**. Os nomes oficiais são `positive`/`negative`/`warning`/`info` (+ `-dim`/
`-line`). Mapeamento de equivalência para quem ler as outras seções:

| Usado em componentes/benchmark | Token canônico (tokens.md) |
|---|---|
| `ev-positive` | `positive` |
| `ev-positive-dim` | `positive-dim` |
| `ev-positive-line` | `positive-line` |
| `loss` / `loss-dim` | `negative` / `negative-dim` |
| `warning` | `warning` (igual) |
| `info` | `info` (igual) |
| `accent-cyan` | `--primary` / `--ring` (cyan de marca; não há token `accent-cyan` — `--accent` shadcn é o realce de **estado**, `line-2`, não o cyan) |
| `panel` / `panel-2` | `bg-card` / `bg-secondary` (= `panel` / `panel-2`); use as utilitárias shadcn, não nomes crus |
| `faint` | `faint` (existe como cor-base; exposto via `text-faint` quando necessário) |

**Ajustar:** `componentes.md` e `benchmark-externo.md` — substituir `ev-positive*`/`loss*`/`accent-cyan` pelos
nomes canônicos nos snippets cva. Os componentes ficam idênticos; só muda o nome da classe.

### 4.2 Semântica de cor — alinhada (sem conflito real, reforçar)

As três seções que tocam cor concordam: **verde = EV+/positivo** (e _só_ isso), **vermelho = perda**,
**âmbar = aviso/compliance**, **verde jamais em contexto de conformidade ou CTA**, **cyan = marca/CTA**. O dot
da marca é sempre o verde EV+ ([marca-e-tom §1.5](./marca-e-tom.md)). Isso bate 1:1 com tokens.md (§1.1) e
conformidade (§7). **Nada a ajustar** — só garantir que `--destructive` (shadcn) = `--negative` (mesmo
vermelho de perda), como tokens.md já faz.

### 4.3 Mono vs. tabular-nums em tabelas longas — **regra prática unificada**

`benchmark-externo §1.1` corrige a suposição "mono pra tudo": numerais **tabulares numa fonte proporcional**
são mais legíveis em tabelas longas que mono pura. Já marca-e-tom e componentes dizem "número sempre mono".

**Decisão (concilia):** **mono = valores-âncora isolados e identificadores** (hash, CLV de um pick, odd
destacada, KPI herói); **sans + `tabular-nums` = colunas de tabela densa** (ledger, lista do Hub) quando a
legibilidade pedir. Ambos sempre com `tabular-nums`. A classe `.num` de tokens.md (mono + tabular) cobre o
caso âncora; para colunas, aplicar `tabular-nums` no container. **Ajustar:** tokens.md §2.1 e componentes.md
podem citar essa nuance (hoje dizem "número sempre mono"); o princípio de marca permanece (número é mono onde
é verdade verificável isolada).

### 4.4 Anatomia de componentes de conformidade — **uma fonte só**

`conformidade-jogo-responsavel.md` nomeia `<ResponsibleGamblingBar/>`, `<AgeGate/>`, `<SponsoredTag/>`,
`<PastPerformanceNote/>`; `componentes.md` especifica `ResponsibleGamingBanner` e `AgePill`.

**Decisão:** **componentes.md é dono da anatomia/API**; **conformidade é dona da copy/semântica legal** (texto
nunca hardcoded no componente — importado de consts de conformidade). Unificação de nomes: `<ResponsibleGamblingBar/>`
= variante `full`/`compact` do `ResponsibleGamingBanner`; `<AgeGate/>` = variante `gate` do mesmo +
`AgePill`; `<SponsoredTag/>` e `<PastPerformanceNote/>` ficam como componentes próprios (faltam em
componentes.md). **Ajustar:** componentes.md — adicionar specs de `SponsoredTag` e `PastPerformanceNote`;
conformidade.md — referenciar os nomes de componente.md.

### 4.5 Cor do `AgePill` / +18 — **âmbar** (cravado)

componentes.md deixou em aberto âmbar vs. vermelho. **Decisão: âmbar** (`warning`), alinhando à família de
compliance — conformidade.md já trata +18 como âmbar. Vermelho fica reservado a perda. **Ajustar:**
componentes.md — fechar a questão aberta para âmbar.

### 4.6 Faixa de acento de 3px e dot verde — **definidos em tokens.md, citados pelas demais**

marca-e-tom trata o dot e a faixa 3px como motivos de marca; tokens.md/componentes.md/padroes os especificam
tecnicamente. **Decisão:** valor e cor moram em **tokens.md** (`border-l-[3px]` + cor semântica) e
**componentes.md** (variante `accent-left`); marca-e-tom só os **referencia** como significado. **Nada a
ajustar** além de manter os cross-refs.

### 4.7 Foco/`--ring`, spacing e raio — **tokens.md manda**

padroes e componentes assumem 14px/9px, base-4 e `--ring` cyan. tokens.md crava: `--radius 0.875rem` (14px),
`--radius-sm` ≈ 9px, base-4, `--ring` = cyan. **Nada a ajustar** — já convergem.

---

## 5. Decisões em aberto para o João

Consolidado de todas as seções. `[A confirmar com João]` salvo onde indicado como jurídico.

**Tema / tokens**

- **Tema claro:** o mrtip será **dark-only permanente** (provável) ou vale refinar o claro além de fallback de
  `prefers-color-scheme`? Recomendação das seções: dark-only em v1, claro como débito consciente.
- **Default dark:** forçar `class="dark"` no `<html>` (via `ThemeProvider defaultTheme="dark"`) ou respeitar
  `prefers-color-scheme`? Hoje o `layout.tsx` não força.
- **`text-base` = 14px (densidade terminal) vs. 16px (consumer).** Recomendação: 14px.
- **Raio 9px exato dos mockups vs. `--radius-sm` 8.4px** — criar token `--radius-control` dedicado ou aceitar
  a aproximação? Recomendação: aceitar `--radius-sm`.
- **Manter nomes shadcn (`--primary`/`--destructive`) mapeados sobre os semânticos** ou criar camada semântica
  própria por cima? Recomendação: manter o mapeamento (já feito em tokens.md).
- **Confirmar os hex contra `docs/mockups/mrtip-mockups.html`** quando o arquivo voltar ao repo (no momento da
  escrita ele não existe em disco nem no git history; a paleta foi derivada do briefing).
- **Rodar check automatizado de contraste** (axe/Lighthouse) nos mockups renderizados para cravar os tokens de
  risco (`faint`, `muted` pequeno, `accent`/cyan como texto) — pendente porque os mockups não estão no disco.

**Marca & tom**

- Reforçar a leitura "mister tip" numa tagline ou manter a ambiguidade `mr` = "market reader" de propósito?
- Direitos de uso de **escudos/logos de clubes no BR** — pode exigir versão genérica/monograma (risco
  jurídico real).
- Exceção pontual de ilustração sóbria em **marketing/landing** fora do produto? (Dentro do produto, ausência
  de imagery é regra.)
- Peso/fonte exata da wordmark de marca (assumido medium/semibold da fonte de marca).
- Confirmar se haverá **seção de motion** dedicada (referenciada para spinner do dot e "carimbo" de pick
  gravado).

**Componentes**

- Estender o mapa `exports` do `packages/ui` para resolver pastas (`./components/*/index.tsx`) **ou** manter
  público sempre como arquivo raiz? Recomendação: arquivo raiz (zero mudança no contrato do pacote).
- Padronizar **Recharts** cedo (adicionar shadcn `chart`) vs. ficar **SVG-first** no CalibrationPlot?
  Recomendação: SVG-first.
- Convenção de sinal do `MarketOddsStrip`: trend sempre do **ponto de vista do pick do usuário** (linha caiu a
  favor = CLV+ = verde)? É contraintuitivo. Recomendação: sim.

**Layout & superfícies**

- Default do Hub: esconder jogos sem mercado analisado ou listar **todos** incluindo "sem valor"?
  Recomendação: o filtro "só EV+" **não** vem ligado por default (mostrar "sem valor" reforça a honestidade).
- Confirmar a convenção **odds-com-ponto** vs. **percentual-com-vírgula** pt-BR como padrão definitivo (única
  mistura de separadores, intencional).
- "Modo denso" (toggle estilo terminal) para tipsters vs. densidade fixa por superfície?

**Conformidade (boa parte depende de revisão jurídica)**

- **Redação literal** de toda copy de aviso/disclaimer — estrutura aprovada, texto pendente de jurídico
  (confirmar contra Lei 14.790 / Portaria SPA 1.231).
- Aplicação do requisito **"≥10%"** à área logada in-app (hoje documentado só para peças de marketing).
- **Auto-declaração +18 vs. KYC documental** — depende do enquadramento legal do mrtip (afiliado × veículo ×
  plataforma de tips).
- **Período de revalidação do gate +18.**
- Haverá **verificação pública do hash** (página/mecanismo público) ou só hash interno?

---

## 6. Como usar

**Stack (do [CLAUDE.md](../../../CLAUDE.md)):** Turborepo + bun + Next.js 16 (App Router, React 19, Turbopack).
UI compartilhada em `packages/ui` (`@workspace/ui`); Tailwind v4 com `@theme` (sem `tailwind.config`).

**Cor & tipografia (Tailwind v4 `@theme`).** A fonte da verdade é o bloco da [§6 de tokens.md](./tokens.md),
pronto para colar em [`packages/ui/src/styles/globals.css`](../../../packages/ui/src/styles/globals.css)
(substitui o tema neutro shadcn atual). Consuma **só tokens semânticos** — `bg-card`, `text-positive`,
`border-warning`, `rounded-lg`, `.num`, `.section-label` — nunca hex. Garanta `--font-mono` mapeado no `@theme`
(sem isso, `font-mono` não usa Geist Mono e odds/CLV/hash quebram).

**Componentes (shadcn via `packages/ui`).** Adicione bases a partir da raiz do repo:

```bash
bunx shadcn@latest add card -c apps/web   # vai para packages/ui/src/components
```

Importe com `import { Card } from "@workspace/ui/components/card"`. Re-tematize o que o shadcn entregar (vem
neutro) para consumir os tokens deste DS. Componente novo segue o padrão do `button.tsx` existente: `cva` para
variantes, `data-slot` na raiz, `data-variant`/`data-state` espelhando props, `cn()` para merge, `asChild` via
Radix `Slot`. Público = arquivo na raiz de `components/`; subpartes em subpasta privada importada por path
relativo (o mapa `exports` resolve arquivo, não pasta).

**Dinheiro (regra DURA).** Valor canônico = **centavos (int)**. Formatação **só** via `@workspace/core/money`
(`formatBRL`, `centsParaReaisStr`). **Proibido** `Number(x)*100`, `.toFixed(2)` para cálculo, ou
`Intl.NumberFormat` manual. Conversão centavos↔reais só na borda.

> ⚠ `@workspace/core/money` ainda não existe no repo — é a porta canônica a criar (regra do CLAUDE.md).

**Datas (regra DURA).** `date-fns` / `date-fns-tz`, sempre no fuso `America/Sao_Paulo`. Nada de `new Date()`
aritmético nem `Intl` cru. Ledger/timestamps em `dd/MM/yyyy HH:mm` (24h); kickoff com locale `ptBR`.

**Ícones.** `lucide-react` (alinha com shadcn, traço fino, tree-shakeable). **Proibido emoji em produto.**

**Verificação no navegador (obrigatória para UI).** Toda mudança de frontend passa pelo `chrome-devtools` MCP
(snapshot, console, network) no golden path — typecheck/lint não bastam.

## 7. Como contribuir

- Mudou tokens/cor/tipografia/raio/motion → edite **tokens.md** (é a única fonte da verdade desses valores) e
  o bloco `globals.css`. Outras seções **consomem**, não redefinem.
- Mudou um componente → **componentes.md** (anatomia/API). Se for de conformidade, a **copy legal** vem de
  conformidade-jogo-responsavel.md (nunca hardcoded).
- Mudou layout/superfície/acessibilidade/formatação → **padroes-layouts-acessibilidade.md**.
- Mudou voz/logo/iconografia → **marca-e-tom.md**.
- Toda seção mantém o header `as-of <data>` + link de volta para este README.
- Cada decisão opinada leva rationale curto; trade-off real e não-óbvio leva `[A confirmar com João]` e sobe
  para a §5 deste README.
- **Commits levam o ID da feature** quando houver (ver controle de features no [CLAUDE.md](../../../CLAUDE.md)).

---

## Status (as-of 2026-06-21)

Investigação de DS **completa**: 6 seções escritas + este README. Próximos passos sugeridos: (1) resolver as
decisões em aberto da §5; (2) aplicar os ajustes de convergência da §4 (renomear tokens em componentes.md e
benchmark-externo.md; trocar wikilinks pelos nomes de arquivo reais); (3) colar o bloco de tokens em
`packages/ui/src/styles/globals.css` e adicionar `card`/`badge`/`tabs`/`tooltip`/`progress`/`table` como
primeiras bases shadcn; (4) confirmar a paleta contra `docs/mockups/mrtip-mockups.html` quando voltar ao repo.
Nada aqui é código de produção — é a especificação que o código deve seguir.
