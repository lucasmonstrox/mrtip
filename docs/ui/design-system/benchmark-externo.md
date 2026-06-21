# Benchmark externo — o que copiar, o que NÃO copiar

> Seção do design system do **mrtip**. As-of: **2026-06-21**. Volta para o [[README]] do DS.
>
> O que outras categorias de produto (trading, fintech BR, dashboards analíticos, apps regulados de aposta) já resolveram em UI — e o que disso se aplica a um copiloto de **probabilidade calibrada + CLV** Brasil-first. Para cada achado: insight acionável + fonte + rótulo de confiança. Rótulos: **[fato]** = verificável em fonte primária/secundária citada · **[opinião]** = juízo do autor desta seção, não verificado externamente · **[A confirmar com João]** = trade-off real e não-óbvio.

---

## 0. Por que esta seção existe (a tese, em uma linha)

O mercado do mrtip é, segundo a própria pesquisa interna, **"saturado de '90% AI' inflado e opaco"** (ver [panorama-concorrentes](../../research/panorama-concorrentes.md), TL;DR). Logo o benchmark de UI **não é** "copiar o app de aposta mais bonito" — é **importar a gramática visual de produtos que tratam número e risco com seriedade** (trading, fintech regulada, dashboards quant) e **rejeitar deliberadamente** a linguagem visual do nicho de tips (verde-néon de "acerto garantido", ticker de hype, badge de "GENIUS AI 99%"). A linguagem visual é parte do argumento de honestidade — não decoração.

---

## 1. Trading / data-dense dashboards — a gramática a IMPORTAR

Plataformas de trading e terminais financeiros já resolveram o problema central do mrtip: **muito número, decisão rápida, sem caos.** Os três requisitos canônicos de uma identidade visual de trading são **legibilidade (decisão rápida), densidade de informação sem caos, e consistência** ([fato], [Trading App Design Guide, Lollypop 2026](https://lollypop.design/blog/2026/june/trading-app-design/)).

### 1.1 Números: tabular-nums, não só monoespaçada

Achado que **corrige uma suposição comum** do nosso contexto compartilhado ("Mono pra números"):

- A fonte monoespaçada (ex.: IBM Plex Mono) ajuda porque **previne ler `1.234,56` como `12,34.56`** — diferenciação de glifos ([fato], [FontAlternatives, dense dashboards](https://fontalternatives.com/blog/best-fonts-dense-dashboards/)).
- **Mas** numerais **tabulares numa fonte proporcional** dão colunas alinhadas com **melhor legibilidade que monoespaçada pura**. O caminho recomendado é `font-variant-numeric: tabular-nums` (fallback `font-feature-settings: 'tnum'`) nos containers de dados ([fato], [mesma fonte](https://fontalternatives.com/blog/best-fonts-dense-dashboards/)).

**Insight acionável pro mrtip:** Geist Mono (já ligada via `--font-mono`, ver layout) é a escolha certa para os tokens **densos e copiáveis** — odds, EV, CLV, **hash**, stake. Mas para **tabelas longas** (ledger do Histórico, lista do Hub) considere Geist Sans com `tabular-nums` ligado no container, que alinha decimais sem o "peso" visual da mono em parágrafos de linhas. **[opinião]** Regra prática: **mono = valores-âncora isolados e identificadores** (hash, CLV de um pick); **sans + tabular-nums = colunas de tabela**. A definição fina (quando exatamente cada uma) é da seção de [[tipografia]] — aqui fica só o princípio.

### 1.2 Alinhamento e densidade de tabela

- Números **alinhados à direita** comparam melhor (decimais alinham) ([fato], [UIPrep, data tables](https://www.uiprep.com/blog/the-ultimate-guide-to-designing-data-tables)).
- Para tabelas densas, `font-size: 13px` + `line-height: 1.4` é o melhor ratio densidade/legibilidade; **grid completo (linhas H+V)** dá separação clara mas vira ruído se exagerado ([fato], [mesma fonte](https://www.uiprep.com/blog/the-ultimate-guide-to-designing-data-tables)).

**Insight:** o **ledger imutável** (Histórico · CLV) e o **Hub da Rodada** são tabelas densas — direita para todos os números (odd/EV/CLV/stake/resultado), `~13px`/`1.4`, e separadores **só horizontais** usando o token `line` (#243140), reservando linhas verticais para quando a leitura realmente exigir. Casa com a [[grid-densidade]] (se existir essa seção) — não duplicar aqui.

### 1.3 Densidade calibrada ao usuário, não máxima

O contraste Bloomberg vs. varejo é instrutivo: **terminais Bloomberg sacrificam whitespace por densidade máxima** (chains de opção, múltiplos feeds); **investidores de varejo precisam de progressive disclosure, tipografia limpa e whitespace** para não se afogar ([fato], [David Pham, Trading App Design](https://medium.com/@david.pham_1649/trading-app-design-the-complete-guide-to-ui-ux-system-architecture-5b10664c5002)).

**Insight:** o mrtip tem dois públicos com apetites de densidade diferentes — **tipster ≈ Bloomberg** (quer tudo na tela), **apostador casual ≈ varejo** (quer o pick + o porquê, sem afogar). O **Dossiê do Jogo** deve usar **progressive disclosure**: pickbox + dimensões de alto peso visíveis; dimensões médio/baixo/narrativa peso-0 recolhíveis. O **Hub** é denso por natureza, mas o card "sem valor" ("não apostar também é resultado") é o anti-padrão de densidade proposital — espaço para uma mensagem, não mais um número. **[A confirmar com João]** se haverá um "modo denso" (toggle estilo terminal) para tipsters, ou se a densidade é fixa por superfície.

### 1.4 Cor de ganho/perda: nunca o néon puro

Achado direto e relevante: interfaces financeiras têm a restrição verde=ganho / vermelho=perda, **mas verde `#00ff00` e vermelho `#ff0000` puros causam fadiga ocular em sessões longas** ([fato], [Lollypop](https://lollypop.design/blog/2026/june/trading-app-design/)).

**Insight (valida o que já temos):** os tokens atuais já fazem isso certo — verde **`#27d07a`** (não `#00ff00`) e vermelho **`#f0556d`** (não `#ff0000`) são dessaturados/escurecidos para dark-first, exatamente a recomendação. Esta seção **endossa** a paleta semântica do contexto compartilhado; a formalização em tokens é da seção de [[cor]]. Único alerta: garantir que o **verde de EV+** não vire o "verde-néon de acerto" do nicho de tips — manter a saturação contida é parte do argumento de honestidade (ver §4).

---

## 2. Fintech BR — o que aprender com a NuDS (Nubank)

A NuDS (Nubank Design System) é a referência BR mais forte de design system maduro com **tokens + theming + governança**, e três fatos dela são acionáveis:

1. **Tokens como base de acessibilidade e localização.** A NuDS é construída em tokens/theming; a paleta foi validada **com critérios de acessibilidade** junto a times de Brasil e branding ([fato], [Figma — Nubank Design System](https://www.figma.com/customers/nubank-design-system-accessible-experiences-with-figma/)).
2. **Theming barato.** Com fundação de tokens/theming/governança, a Nu trocou o tema **em um sprint** ([fato], [mesma fonte](https://www.figma.com/customers/nubank-design-system-accessible-experiences-with-figma/)).
3. **Dark mode é projeto, não inversão.** O Nubank documentou o nascimento do dark mode como uma jornada deliberada, não um flip de cores ([fato], [Building Nubank — dark mode](https://building.nubank.com/the-birth-of-the-dark-mode-a-journey-into-nubanks-app-evolution/)).

**Insight pro mrtip:**
- O mrtip é **dark-first por mockup** (bg `#0b0f14`), o que é o caminho mais defensável: começar dark bem-feito e, se um light mode vier, tratá-lo como **projeto à parte** (não inversão automática) — exatamente a lição Nu. **[opinião]** Para v1, **dark-only** é a aposta certa; light mode é débito consciente, não requisito.
- A lição de **acessibilidade nos tokens** é crítica num produto regulado: a paleta `text #e7eef6` / `muted #8aa0b4` / `faint #5f7286` sobre `#0b0f14` precisa de **contraste verificado (WCAG AA)** — especialmente `faint` em texto pequeno, que é o token mais arriscado. A verificação numérica de contraste é da seção de [[cor]] / [[acessibilidade]]; aqui fica o requisito: **nenhum token de texto entra sem ratio medido.**
- **Não copiar** o roxo Nu nem a estética "amigável/lúdica" de banco — o mrtip é um instrumento analítico, mais perto de terminal que de carteira digital. A lição é **método** (tokens, governança, dark como projeto), não **estilo**.

---

## 3. OKLCH + Tailwind v4 @theme + shadcn — o padrão técnico (2025/2026)

O contexto compartilhado já diz que o tema shadcn atual é **neutro/grayscale em OKLCH sem croma** e que isso **não bate com os mockups**. O benchmark confirma qual é o padrão correto para fechar esse gap:

- **shadcn migrou HSL → OKLCH** no Tailwind v4 (melhor espaço de cor, consistência perceptual) ([fato], [shadcn — Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)).
- **Padrão para adicionar um token novo:** definir a variável em `:root` **e** em `.dark`, depois expor ao Tailwind via **`@theme inline`** — assim a utility (`bg-warning`) e o acesso via JS ficam disponíveis ([fato], [shadcn — Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4) + [shadcn — Theming](https://ui.shadcn.com/docs/theming)).
- **Tokens semânticos** que resolvem por modo mantêm o markup limpo (ex.: `--color-text-main` resolve escuro no light / claro no dark) ([fato], [TailwindThemeMaker](https://tailwindthememaker.com/articles/light-vs-dark-mode-best-practices)).
- **Dark-first específico:** usar cinza muito escuro (ex.: `oklch(12% 0.01 240)`) **em vez de preto absoluto** para evitar smearing OLED; **dessaturar primárias** no dark; texto **off-white** (~`#E2E8F0`) em vez de branco puro, reduzindo dureza mantendo AA ([fato], [TailwindThemeMaker](https://tailwindthememaker.com/articles/light-vs-dark-mode-best-practices)).

**Insight pro mrtip (valida e direciona a migração de tema):**
- O `bg #0b0f14` dos mockups **já segue** a regra "não-preto-puro", e `text #e7eef6` **já segue** "off-white" — os mockups foram desenhados com bom instinto dark. A tarefa da seção de [[cor]] é **converter os hex para OKLCH** e plugar no esquema `:root`/`.dark` + `@theme inline`, mantendo o mesmo valor perceptual.
- A semântica de cor (verde=EV+, vermelho=perda, âmbar=aviso) deve virar **tokens semânticos** (`--color-positive`, `--color-negative`, `--color-warning`), não nomes de cor crus — para que o markup leia intenção, não pigmento. (Mapa exato → seção de [[cor]].)
- **Padrão de migração concreto** (formato confirmado, valores ilustrativos — a conversão real é da seção de [[cor]]):

```css
/* :root e .dark definem o valor; @theme inline expõe a utility */
/* Nomes canônicos (tokens.md §1.3 + README §4.1 do DS): positive / negative / warning */
:root {
  --bg:        oklch(0.16 0.02 240);  /* ~#0b0f14 convertido */
  --positive:  oklch(0.78 0.16 152);  /* ~#27d07a */
  --negative:  oklch(0.65 0.18 12);   /* ~#f0556d */
  --warning:   oklch(0.79 0.15 80);   /* ~#f0b429 */
}
@theme inline {
  --color-bg: var(--bg);
  --color-positive: var(--positive);
  --color-negative: var(--negative);
  --color-warning: var(--warning);
}
```

> ⚠️ Os valores OKLCH acima são **aproximações ilustrativas** do padrão, não os tokens finais. A conversão fiel hex→OKLCH e a tabela canônica vivem em [[cor]]. **[A confirmar com João]** se mantemos nomes shadcn (`--primary`, `--destructive`) mapeados sobre os semânticos, ou se criamos uma camada semântica própria por cima.

---

## 4. Apps regulados de aposta — jogo responsável como UI (o que apps SÉRIOS fazem)

A pesquisa interna já posiciona **"jogo responsável como produto, não rodapé"** (ver [COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md) e o contexto compartilhado). O benchmark mostra **quais padrões concretos** jurisdições reguladas (UKGC) usam:

- **Reality checks / lembretes de sessão:** pop-ups temporizados mostrando **há quanto tempo a sessão dura**, integrados ao fluxo **sem interromper bruscamente** ([fato], [Soft2Bet](https://www.soft2bet.com/news/strong-design-to-encourage-responsible-gambling) + [SOFTSWISS](https://www.softswiss.com/knowledge-base/responsible-gambling-guide/)).
- **Limites de depósito/perda/aposta** (diário/semanal/mensal), acessíveis dentro de UI intuitiva — promovendo transparência ([fato], [mesmas fontes](https://www.softswiss.com/knowledge-base/responsible-gambling-guide/)).
- **Regra de comunicação UKGC/CAP/ASA:** conteúdo promocional/descritivo **não pode enganar sobre chances**, **deve** incluir mensagem de jogo responsável e **não pode** sugerir aposta como solução financeira ([fato], [Responsible gambling — Wikipedia](https://en.wikipedia.org/wiki/Responsible_gambling) + busca UKGC).
- **Monitoramento comportamental** por ML para padrões de risco (chasing losses, aumento de frequência de depósito, picos de duração de sessão) ([fato], [Soft2Bet](https://www.soft2bet.com/news/implementing-responsible-gambling-in-igaming)).

**Insight pro mrtip — e ALINHAMENTO direto com a Lei 14.790/2023:**

A regra UKGC ("não enganar sobre chances", "não apresentar como solução financeira") é **a mesma família** da proibição da 14.790 de apresentar aposta como **renda/investimento**. Isso converte requisito legal em **decisões de UI concretas**:

| Padrão regulado (UKGC/14.790) | Decisão de UI no mrtip |
|---|---|
| Não enganar sobre chances | Todo pick mostra **probabilidade calibrada + risco**, nunca "acerto garantido". A própria existência do card "sem valor" é UI anti-engano. |
| Não apresentar como renda/investimento | Vocabulário do produto = "probabilidade", "risco", "EV", "CLV" — **proibido** "lucro garantido", "renda extra", linguagem de carteira. Token semântico `--color-positive` é **verde calibrado, não verde-promessa** (§1.4). |
| Reality check / sessão | Lembrete de tempo de sessão **não-interruptivo** — padrão a adotar, não inventar. |
| Limites | Limites de stake/exposição **dentro da UI**, não escondidos em config. |
| Mensagem de jogo responsável | **+18 e aviso** tratados como **componente de primeira classe** do DS (não `<small>` cinza no rodapé). |

**O que NÃO copiar do nicho de tips/casino BR** (cruzando com [panorama-concorrentes](../../research/panorama-concorrentes.md), frentes 3-4): badges de "**90% / 99% de acerto**", verde-néon de hype, ROI inflado por "best odds inatingível", avisos +18 como **compliance mínima de rodapé**. A pesquisa interna é explícita: o BR é dominado por **afiliados opacos** com "IA como rótulo sem metodologia" e **avisos como rodapé**. **A oportunidade de UI do mrtip é literalmente fazer o oposto visual disso.** **[opinião]** O aviso de jogo responsável bem-desenhado (não escondido) é, contraintuitivamente, um **sinal de confiança**, não um custo de conversão — num mercado onde o concorrente esconde a letra miúda.

---

## 5. Como mostrar CONFIANÇA, HISTÓRICO e INCERTEZA (o coração honesto)

O diferencial defensável do mrtip é **calibração + CLV publicados** — métricas que, segundo a pesquisa interna, **"ninguém publica"**. A UI dessas métricas é onde o produto vence ou falha. O benchmark de visualização de incerteza dá o vocabulário:

- **Calibration plot / reliability diagram:** confiança prevista × resultado observado; modelo bem-calibrado **cola na diagonal** ([fato], [Calibrate, arXiv 2207.13770](https://arxiv.org/pdf/2207.13770)). Esse é exatamente o "plot de calibração" da superfície Histórico · CLV.
- **Confidence visualization** (barras/%, cor) é padrão essencial em **IA de alto risco — médica/financeira** — onde o usuário precisa saber **quando verificar** ([fato], [AI UX Design Guide — Confidence Visualization](https://www.aiuxdesign.guide/patterns/confidence-visualization)).
- **Incerteza:** intervalos de confiança, bandas, **opacidade/fade para certeza decrescente**, drill-down interativo para distribuições ([fato], [Think Design](https://medium.com/@marketingtd64/visualizing-uncertainty-best-practices-for-complex-data-eadfc9d3546f) + [Dev3lop](https://dev3lop.com/blog/visualizing-uncertainty-techniques-for-representing-data-confidence/)).

**Insight pro mrtip:**
- O **plot de calibração** (Histórico) deve seguir a convenção canônica: **eixo confiança prevista × frequência observada, com a diagonal de referência visível** — porque é um padrão científico reconhecível, e reconhecibilidade = credibilidade. **Não inventar** uma viz proprietária aqui; a familiaridade é o ponto.
- A **confiança de um pick** (no Dossiê) pode usar barra/% **com cor**, mas a lição de "IA financeira" é mostrar **quando o usuário deve verificar** — ou seja, **incerteza alta deve ser visualmente honesta**, não escondida. **[opinião]** Picks de baixa confiança/baixo EV devem parecer baixa confiança (peso visual menor, sem o verde forte), não maquiados. Isso é o oposto do nicho de tips, que pinta tudo de "alta confiança".
- O sistema de **peso das dimensões** do Dossiê (alto/médio/baixo/**narrativa peso-0**) é, na prática, uma **visualização de incerteza/contribuição** — a dimensão peso-0 ("narrativa") é o equivalente honesto de marcar "isto é contexto, não sinal". Padrão de **opacidade/fade para peso decrescente** se aplica diretamente. (Componente exato → seção de [[componentes]] / Dossiê.)
- O **CLV** é a métrica-âncora: deve ter o maior peso tipográfico (mono, §1.1) na superfície Histórico, tratado como o "preço de fechamento" de um trading desk — porque é literalmente isso.

---

## 6. Matriz síntese — COPIAR vs. NÃO COPIAR

| Fonte / categoria | COPIAR (importar) | NÃO COPIAR (rejeitar) |
|---|---|---|
| **Trading / terminais** | tabular-nums + mono p/ números; alinhar números à direita; densidade calibrada ao usuário; verde/vermelho **dessaturados** | densidade máxima indiscriminada p/ todos; néon `#0f0`/`#f00` |
| **Fintech BR (NuDS)** | tokens como base de acessibilidade; theming barato; dark mode **como projeto**; contraste WCAG verificado | roxo Nu; estética lúdica/amigável de carteira |
| **OKLCH/Tailwind v4/shadcn** | `:root`+`.dark` → `@theme inline`; tokens **semânticos**; não-preto-puro; off-white; dessaturar no dark | tema neutro grayscale atual (não bate com mockups) |
| **Apps regulados (UKGC)** | reality check não-interruptivo; limites na UI; +18/aviso como **componente 1ª classe**; vocabulário de probabilidade/risco | avisos como rodapé; badges "90/99%"; linguagem de renda/investimento |
| **Viz de incerteza** | calibration plot canônico (diagonal); confiança com "quando verificar"; opacidade p/ peso decrescente | viz proprietária ilegível; pintar tudo de "alta confiança" |

---

## 7. Lacunas / o que não rendeu

- **Pinnacle/sharp books como referência visual de CLV** — não achei fonte secundária forte sobre **como** a UI deles apresenta closing line; o conhecimento de CLV aqui vem da pesquisa interna ([panorama-concorrentes](../../research/panorama-concorrentes.md), honestbettingreviews) + analogia com trading. **[A confirmar]** se vale um benchmark visual dedicado de sharp books quando houver acesso autenticado.
- **Tom "Stark" + Nubank** especificamente — a busca não confirmou uso da ferramenta Stark pela NuDS; afirmações sobre acessibilidade da NuDS vêm do case Figma oficial, não de Stark.
- **Contraste numérico exato dos tokens** do mrtip (WCAG AA/AAA) — não medi aqui; é trabalho da seção de [[cor]]/[[acessibilidade]]. Esta seção só crava o **requisito** de que seja medido.
