# Revisão adversarial do Design System

> _as-of 2026-06-21_ · volta para o [README do DS](./README.md)
>
> Passada crítica de completude, consistência e precisão de compliance sobre os 7 arquivos do DS
> (README + 6 seções). Cada achado tem prioridade (Alto/Médio/Baixo), arquivo + linha aproximada, e a
> correção sugerida. **Não consertei nada — só relato.** O veredito final está no fim.
>
> Método: li os 7 arquivos inteiros e verifiquei as afirmações sobre o repo contra o código real
> (`packages/ui/package.json`, `button.tsx`, `apps/web/app/layout.tsx`, `theme-provider.tsx`,
> `globals.css`). Os achados de prioridade Alta saem da divergência entre o que o DS assume existir e o
> que de fato existe.

---

## Prioridade ALTA

### A1. `@workspace/core/money` NÃO EXISTE — toda a "regra dura de dinheiro" referencia um pacote inexistente

**Onde:** README §6 (l.245-247), tokens.md cross-refs e §0 do contexto, componentes.md §0 conv. 9 (l.21),
padroes-layouts-acessibilidade.md §5.1 (l.252-261, snippet `import { formatBRL } from "@workspace/core/money"`),
marca-e-tom.md §3.5 (l.183).

**Problema:** verifiquei o repo: **não existe `packages/core`**, não existe nenhum `formatBRL`/`reaisParaCents`/
`centsParaReais` em código (`grep` por `@workspace/core` e `formatBRL` em `.ts/.tsx` retorna zero fora de
docs). O `packages/ui/package.json` não declara `@workspace/core` como dependência. O DS inteiro trata
`@workspace/core/money` como uma porta existente ("regra DURA"), e o snippet de padroes §5.1 mostra um
`import` que **não compila hoje**. Isso é herdado do CLAUDE.md/contexto, mas o DS o materializa em código de
exemplo, virando uma afirmação falsa sobre o estado do repo.

**Correção sugerida:** adicionar uma nota explícita (em README §6 e/ou tokens) de que `@workspace/core/money`
é **um pacote a ser criado** (não existe na árvore atual), e marcar os snippets que o importam como
"depende de `@workspace/core` ainda não criado". Alternativamente, rebaixar para `[A confirmar com João]` o
caminho exato do pacote (pode ser `lib/` em `apps/web` até promover). Sem isso, quem seguir o DS escreve um
import quebrado.

---

### A2. Gap de `--font-mono` no `@theme`: o claim está certo, mas o bloco final de tokens.md está incompleto vs. o `globals.css` real

**Onde:** tokens.md §2 (l.230-233, "Gap a corrigir") e §6 bloco `@theme inline` (l.402-454).

**Problema:** o claim de tokens.md está **correto** — verifiquei: o `globals.css` atual tem `--font-sans` e
`--font-heading` no `@theme`, mas **não** `--font-mono`, embora `layout.tsx` defina `Geist_Mono` →
`--font-mono`. Porém o bloco "pronto para colar" da §6 **omite os tokens `--radius-2xl/3xl/4xl`** que existem
no `globals.css` atual (verifiquei: o arquivo real tem `--radius-2xl` até `--radius-4xl`). Colar o bloco da
§6 como está (ele diz "substitui linhas ~10-120") **apaga** esses tokens de raio maiores, podendo quebrar
componentes shadcn que os usem. O bloco também não mostra os `@import`/`@custom-variant`/`@source` do topo
(diz "mantém", mas não lista), risco de quem cola apagá-los.

**Correção sugerida:** no bloco da §6, ou (a) preservar `--radius-2xl..4xl` na escala, ou (b) adicionar nota
"manter os `--radius-2xl..4xl` existentes". Tornar explícito que `@import`/`@custom-variant`/`@source` do
topo do arquivo atual **não** entram no diff (só o miolo). É um bloco "pronto para colar" — precisa ser
fielmente colável sem regressão.

---

### A3. Contradição direta de token: componentes.md inteiro usa `ev-positive`/`loss`/`accent-cyan`, que o README §4.1 declara NÃO-canônicos

**Onde:** componentes.md §0 conv. 7 (l.19) e **todos** os snippets cva (l.103-104, 153-154, 179, 213,
219, 258, 291, 303-306, 364, 392, 434, 468, 498, 523, 558); README §4.1 (l.84-108); tokens.md §1.3 (l.136).

**Problema:** o README já documenta esse conflito e crava que `tokens.md` vence (`positive`/`negative`/
`warning`/`info`). Mas o arquivo componentes.md **inteiro** ainda está escrito com os nomes errados
(`text-ev-positive`, `bg-loss-dim`, `border-loss/40`, `bg-accent-cyan`, `fill-accent-cyan`). Para um leitor
que abra componentes.md direto, **todo snippet cva referencia classes que não vão existir** no `@theme`
(porque o `@theme` exporta `bg-positive`, não `bg-ev-positive`). O README chama isso de "ajuste pendente",
mas enquanto não for feito, o arquivo de componentes é literalmente não-implementável como está — gera
classes Tailwind inexistentes (que falham silenciosamente, sem erro de build). Mesma situação em
benchmark-externo.md (l.75, 84-91, 114) com `--color-ev-positive`/`--color-loss`.

**Correção sugerida:** executar o ajuste já prometido no README §4.1 — substituir em componentes.md e
benchmark-externo.md `ev-positive*`→`positive*`, `loss*`→`negative*`, `accent-cyan`→`primary`/`--primary`.
Não é "nice to have": é a diferença entre o catálogo de componentes compilar ou produzir classes mortas. Até
lá, no mínimo pôr um aviso no topo de componentes.md apontando para o mapa do README §4.1.

---

### A4. `bg-[--warn]` / `text-[--warn]` / `bg-[--bg-2]` em conformidade.md são sintaxe que não resolve nenhum token deste DS

**Onde:** conformidade-jogo-responsavel.md §1.3 (l.54-67, snippet do banner), §3 (l.151-156, SponsoredTag),
§4.2 (l.182-189, snippet do ledger com `text-[--muted]`, `text-[--faint]`, `text-[--green]`, `text-[--red]`).

**Problema:** os snippets de conformidade usam `border-[--warn]`, `text-[--warn]`, `bg-[--bg-2]`,
`text-[--green]`, `text-[--red]`, `text-[--muted]`, `text-[--faint]`. **Nenhum** desses nomes de variável
existe no contrato de tokens.md: o token de aviso é `--warning` (não `--warn`), o verde é `--positive` (não
`--green`), o vermelho é `--negative`/`--destructive` (não `--red`), o fundo elevado é `--secondary`/`bg-card`
(não `--bg-2` exposto como utility). Além disso, a forma `bg-[--warn]` (arbitrary property apontando para var
crua) contraria a regra do próprio DS de **consumir utilitárias semânticas** (`bg-warning`, `text-positive`).
São snippets que não funcionam e que violam a convenção de consumo. Isso é mais grave que A3 porque conformidade
é a seção que o README diz ser "dona da copy/semântica legal" — os exemplos dela viram referência.

**Correção sugerida:** reescrever os snippets de conformidade com as utilitárias canônicas: `border-warning`,
`text-warning`, `bg-secondary`/`bg-card`, `text-positive`, `text-negative`, `text-muted-foreground`,
`text-faint`. Alinhar com a decisão "componentes.md é dono da anatomia" (README §4.4): idealmente os snippets
de conformidade só ilustram copy, e a marcação real fica em componentes.md.

### A5. Compliance — `AgePill` com `font-mono` no "+18" e o "+18" como texto: sem problema legal, mas a cor ficou ABERTA em dois lugares com defaults divergentes

**Onde:** componentes.md §13 (l.523, "`bg-warning text-bg` ... ou `bg-loss` `[A confirmar]`"); README §4.5
(l.142-146, crava **âmbar**); conformidade.md §1.2 tabela (l.42, gate +18 = âmbar).

**Problema:** o README §4.5 **já cravou âmbar** para o AgePill e diz "Ajustar: componentes.md — fechar a
questão aberta para âmbar". componentes.md §13 ainda está aberto ("`[A confirmar]` se +18 deve ser vermelho
ou âmbar"). Enquanto a questão estiver aberta no arquivo dono da anatomia, há risco real de alguém
implementar +18 em **vermelho** — e vermelho é o token de **perda** (`--negative`). Um selo +18 vermelho
mistura a semântica regulatória (+18 = aviso/compliance) com a semântica de resultado (perda), o que
enfraquece o "pacto de cor" que o DS vende como diferencial de honestidade. Não é violação da Lei 14.790 em
si, mas é uma inconsistência de compliance-design que o próprio DS classifica como crítica.

**Correção sugerida:** fechar componentes.md §13 para **âmbar** (`bg-warning` / `border-warning text-warning`),
removendo a opção `bg-loss`, conforme README §4.5 já decidiu.

---

## Prioridade MÉDIA

### M1. Estado atual do tema é `defaultTheme="system"` + hotkey `d`, não "layout não força" — o DS subdescreve o que existe

**Onde:** tokens.md §6 nota final (l.591-594); README §5 "Default dark" (l.170-171).

**Problema:** o DS diz "hoje o `layout.tsx` não força [dark]". Verifiquei: o `ThemeProvider`
(`apps/web/components/theme-provider.tsx`) já tem `defaultTheme="system"` + `enableSystem` + um **hotkey `d`
que alterna dark/light** (`ThemeHotkey`). Ou seja, não é só "não força" — há um default ativo (`system`) e um
toggle funcional que o DS ignora. A recomendação "dark-only em v1" colide com a existência desse toggle
(que sugere que light é um caminho suportado). 

**Correção sugerida:** atualizar a nota para refletir o estado real (`defaultTheme="system"` + hotkey `d`) e
decidir explicitamente: se dark-only v1, então mudar para `defaultTheme="dark"` e possivelmente remover/ocultar
o hotkey; se light é suportado, então o "tema claro é débito consciente" precisa ser revisto (ele já é
alcançável por hotkey hoje).

### M2. Wikilinks `[[...]]` não-resolvidos por todo o DS, apesar do README mandar trocá-los

**Onde:** README §3 nota (l.67-75) reconhece e manda trocar; mas persistem em tokens.md (l.6, 70, 71, 142,
246, 280, 610-611), componentes.md (l.5, 19, 22, e dezenas em specs), conformidade.md (l.3, 19, 171, 209,
266-288), padroes (l.5, 42, 311-312), marca-e-tom (links `./cores-tokens.md`, `./tipografia.md`,
`./motion.md` — arquivos que **não existem**).

**Problema:** marca-e-tom.md é o pior caso: usa **links markdown reais** para arquivos inexistentes
(`./cores-tokens.md` l.21,87; `./tipografia.md` l.137,227; `./motion.md` l.92; `./componentes.md` existe). São
links clicáveis quebrados, não wikilinks. Os `[[...]]` em outros arquivos ao menos sinalizam "placeholder";
estes parecem reais e levam a 404.

**Correção sugerida:** varredura final trocando `[[tokens]]`→`(./tokens.md)`, `[[componentes]]`→
`(./componentes.md)`, `[[conformidade]]`/`[[guidelines-conformidade]]`/`[[conteudo-tom-conformidade]]`→
`(./conformidade-jogo-responsavel.md)`, `[[superficies]]`/`[[graficos-e-dados]]`/`[[grid-densidade]]`→
`(./padroes-layouts-acessibilidade.md)`, `[[tokens-cor]]`/`[[fundacoes]]`/`[[tipografia]]`→`(./tokens.md)`.
Em marca-e-tom.md, consertar os links markdown quebrados (`./cores-tokens.md`→`./tokens.md`, etc.) e o
`./motion.md` (motion vive em tokens.md §5.3 — apontar para lá).

### M3. Contradição mono vs. tabular: o README §4.3 "conciliou", mas marca-e-tom e componentes ainda dizem "número SEMPRE mono"

**Onde:** README §4.3 (l.118-128); marca-e-tom §3.2 nota (l.137) e §5 (l.227-229: "sempre em mono");
componentes.md §0 conv. 8 (l.20: "números financeiros nunca em fonte proporcional"); padroes §3.1 (l.156).

**Problema:** o README crava a nuance "mono = âncora isolada; sans+tabular = coluna de tabela densa", mas
componentes.md conv.8 diz o contrário literal ("nunca em fonte proporcional") e marca-e-tom reforça "sempre
mono". O `ImmutableLedger` (componentes §9) usa `font-mono` em todas as colunas numéricas — exatamente o caso
que o README diz que poderia ser sans+tabular. Há tensão não resolvida entre "número é mono como marca"
(marca-e-tom, princípio identitário) e "tabela longa lê melhor em sans+tabular" (benchmark/README).

**Correção sugerida:** já que é trade-off real, marcar `[A confirmar com João]` num lugar só (recomendo
tokens.md §2.1) e fazer marca-e-tom/componentes apontarem para ele em vez de afirmar "sempre mono". Decisão
de fundo: o ledger é a "prova de marca" (mono) ou uma tabela densa (sans+tabular)? O DS hoje fala as duas.

### M4. Requisito "≥10%" e KYC: bem-marcados como `[A confirmar]`, mas falta a fonte primária citável

**Onde:** conformidade.md §1.1 (l.27, claim "≥10%" atribuído a "Souto Correa/Baptista Luz" via investigação),
§1.4 (l.78-83, KYC).

**Problema:** o "≥10%" é apresentado com âncora numa investigação interna
(`docs/investigacoes/regulacao-br-apostas-produto.md`). **Não verifiquei** se esse arquivo existe nem se o
claim "≥10% da peça" está corretamente extraído da Portaria SPA 1.231 (o DS não cita o artigo/inciso). Como
este é o achado de compliance mais sensível (um requisito quantitativo de tamanho de aviso), ele precisa de
âncora primária (número do artigo), não só "snippet de escritório". O DS faz a ressalva certa ("aplicação à
área logada não cravada"), mas o **número em si** carece de citação primária.

**Correção sugerida:** confirmar `docs/investigacoes/regulacao-br-apostas-produto.md` existe e cita
artigo/inciso da Portaria SPA/MF 1.231 para o "≥10%"; senão, rebaixar o "≥10%" a `[A confirmar com jurídico —
fonte primária pendente]`. (Não é erro de design, é precisão de claim regulatório.)

### M5. `lucide-react` versão `^1.20.0` — verificar antes de cravar nomes de ícones

**Onde:** marca-e-tom §4 (l.194, 203-216, mapa emoji→lucide com nomes como `triangle-alert`, `chart-line`);
componentes.md (imports `TrendingUp, TrendingDown, Minus` l.95, `ShieldAlertIcon` citado em conformidade l.59).

**Problema:** o `package.json` declara `lucide-react: ^1.20.0`. A numeração major do lucide-react público
está em `0.x` há anos; `1.20.0` é incomum e pode ser um fork/registry interno ou um typo de versão. Os nomes
de ícones citados (`triangle-alert` vs. o antigo `alert-triangle`; `chart-line`) **mudaram entre versões** do
lucide. Se a versão instalada não tiver esses nomes, os imports quebram. conformidade.md usa
`<ShieldAlertIcon>` (PascalCase de `shield-alert`) enquanto marca-e-tom mapeia para `shield` — inconsistência
de nome do mesmo ícone.

**Correção sugerida:** validar a versão real de `lucide-react` e conferir os nomes de ícone contra ela antes
de cravar o mapa de migração; unificar `shield` vs. `shield-alert` entre marca-e-tom e conformidade.

### M6. `WeightBadge`/`DimensionCard`: `border-info/30 bg-info/10` usa opacidade sobre token, mas `info` não tem variantes `-dim`/`-line`

**Onde:** componentes.md §2 (l.153-154, `border-info/30 bg-info/10 text-info`), §10 (l.434,
`bg-warning/10 text-warning border-warning/30`).

**Problema:** tokens.md define `positive`/`negative` com trincas `-dim`/`-line`, mas `warning` e `info` são
tokens **únicos** (sem `-dim`/`-line` — ver tokens.md §1.3, l.130-134). Os componentes resolvem isso com
opacidade Tailwind (`bg-info/10`), o que funciona, mas tokens.md não documenta que `warning`/`info` devem ser
usados via alpha (`/10`, `/30`) em fundos. Falta a regra explícita "para fundo tonal de warning/info, use
`/10`; para borda, `/30`" — hoje cada componente improvisa o alpha.

**Correção sugerida:** tokens.md adicionar uma linha: "warning/info não têm `-dim`/`-line`; para bloco tonal
usar `bg-warning/10` + `border-warning/30` (convenção fixa)". Padroniza o alpha que componentes já usam ad hoc.

---

## Prioridade BAIXA

### B1. `ConfidenceBar` é citado em componentes mas ausente do índice de domínio do README

**Onde:** README §3 tabela (l.62, lista "EvBadge, WeightBadge, ValueCard, PickBox, CalibrationPlot,
ImmutableLedger, AssistantChat, ResponsibleGamingBanner, AgePill…"); componentes.md tem 13 componentes
incluindo `ConfidenceBar` (§3), `MarketOddsStrip` (§5), `DimensionCard` (§7), `SourcesList` (§11).

**Problema:** o README diz "13 componentes de domínio" mas lista só 9 no texto (com "…"). Menor: o "…" cobre,
mas um leitor não sabe que `ConfidenceBar`/`MarketOddsStrip`/`DimensionCard`/`SourcesList` existem sem abrir
componentes.md.

**Correção sugerida:** completar a lista no README §3 ou dizer "13 (ver componentes.md)".

### B2. `SponsoredTag` e `PastPerformanceNote` ainda faltam em componentes.md, como o README §4.4 já anotou

**Onde:** README §4.4 (l.139, "Ajustar: componentes.md — adicionar specs de SponsoredTag e
PastPerformanceNote"); conformidade.md §8 (l.286-287) lista os dois como dono-de-anatomia = componentes.md;
componentes.md **não** os especifica.

**Problema:** dois componentes de conformidade (`SponsoredTag`, `PastPerformanceNote`) têm copy/semântica
definida em conformidade.md mas **nenhuma spec de anatomia/API** em componentes.md, que o README declara ser
o dono. Lacuna conhecida e já registrada, mas ainda aberta.

**Correção sugerida:** adicionar as duas specs em componentes.md (anatomia + cva + API TSX), seguindo o
padrão das outras 13.

### B3. Inconsistência de raio em px hardcoded vs. token nos snippets de componentes

**Onde:** componentes.md §0 conv.10 (l.22, "mapeie via `--radius` ... em vez de cravar px quando der"); mas os
snippets cravam `rounded-[9px]` (l.99, 149) e `rounded-[14px]` (l.219, 296, 434).

**Problema:** a própria convenção 10 pede usar `rounded-lg`/`rounded-sm` (tokens), mas todos os snippets
cva usam `rounded-[14px]`/`rounded-[9px]` hardcoded. tokens.md §4 mapeou `rounded-lg`=14px e `rounded-sm`≈9px
justamente para evitar o px cravado. Contradição interna leve (a seção se desautoriza).

**Correção sugerida:** trocar `rounded-[14px]`→`rounded-lg` e `rounded-[9px]`→`rounded-sm` nos snippets, ou
remover a convenção 10 se a decisão for cravar px. Coerência interna.

### B4. `MarketOddsStrip` e `ConfidenceBar`/`SourcesList` não aparecem nos templates de superfície

**Onde:** padroes §2.1-2.3 (templates ASCII); componentes.md §3,5,11.

**Problema:** os templates de Hub/Dossiê citam "card", "pickbox", "dimensões", "tabela", "fontes", mas não
amarram explicitamente onde `MarketOddsStrip`/`ConfidenceBar` entram (o Dossiê tem "[ Mercado & Odds ]" mas
não nomeia o componente). Rastreabilidade componente↔superfície fica frouxa.

**Correção sugerida:** anotar nos templates de padroes qual componente de componentes.md materializa cada
região (ex.: "Mercado & Odds → `MarketOddsStrip` layout=block").

### B5. marca-e-tom §1.5 usa emoji ❌/✅ em "don'ts" — aceitável por nota, mas a nota está só em §4

**Onde:** marca-e-tom §1.5 (l.87-93, bullets com ❌), §4 nota (l.217, "em docs internas ❌/✅ são aceitáveis").

**Problema:** menor — o uso editorial de ❌/✅ em docs é explicitamente permitido pela nota em §4, mas a nota
vem **depois** de já terem aparecido em §1.5. Coerente, só ordem.

**Correção sugerida:** nenhuma obrigatória; se quiser rigor, mover a nota para o início do arquivo.

### B6. Tema claro: `--warning oklch(0.62 0.14 70)` no claro tem hue 70 vs. 82.54 no dark (mesmo "âmbar")

**Onde:** tokens.md §1.4 (l.186, claro `--warning oklch(0.62 0.14 70)`); §1.1/§6 (dark `0.8045 0.1558 82.54`).

**Problema:** o âmbar do tema claro está em hue 70 (mais alaranjado) vs. 82.54 no dark. Pode ser intencional
(âmbar escurecido tende a parecer mais quente), mas não está justificado, e o `--positive` claro mantém hue
154 (≈ dark 154.43) — ou seja, só o warning derivou de hue. Inconsistência não explicada.

**Correção sugerida:** ou alinhar o hue do warning claro a ~82, ou anotar por que derivou (intencional). Baixo
impacto porque o tema claro é secundário/débito consciente.

---

## Achados de compliance (consolidado — a verificação mais importante)

Esta é a checagem central. **Resultado: nenhuma cópia que viole a Lei 14.790 foi encontrada nos textos-modelo
do DS.** O DS é, no geral, exemplar em compliance — a linguagem é consistentemente "probabilidade + risco,
nunca renda/lucro", o glossário banido (marca-e-tom §3.2, conformidade §2.2) é correto, e o card "sem valor" /
"não apostar também é resultado" é tratado como conteúdo de primeira classe. Pontos de atenção (já listados
acima, recapitulados aqui por serem compliance):

- **A5 (Alto):** AgePill com cor aberta (âmbar vs. vermelho) — risco de misturar semântica +18 com perda.
- **M4 (Médio):** o "≥10%" carece de fonte primária citável (artigo/inciso da Portaria 1.231).
- **A4 (Alto):** os snippets de conformidade usam tokens que não existem (`--warn`, `--green`) — não é
  violação legal, mas torna a seção dona-da-copy não-implementável como referência.
- **Positivo:** o requisito de whitelist `.bet.br` (conformidade §3, l.146) está corretamente cravado como
  "bug de conformidade, não de dados" — boa precisão.
- **Positivo:** "jogo responsável é mecanismo, não aviso" (conformidade §1.1) com links de limites/
  autoexclusão diretos — alinhado ao requisito real.
- **Sem requisitos inventados sem fonte** além do "≥10%" (M4): todas as afirmações legais apontam para
  COMP-001 ou a investigação. **Não confirmei** que esses dois docs-âncora existem em disco (COMP-001 é
  referenciado por path; a investigação `regulacao-br-apostas-produto.md` também) — recomendo confirmar, pois
  se algum não existir, várias âncoras legais ficam soltas. `[A confirmar]`

---

## Consistência com o repo (Tailwind v4 @theme / centavos / date-fns / kebab-case)

- **Tailwind v4 @theme sem config:** ✓ correto. O DS não inventa `tailwind.config`; usa `@theme inline`. O
  bloco de tokens.md §6 está alinhado (ressalva A2 sobre raios omitidos).
- **`button.tsx` como padrão (cva + Slot de `radix-ui` + `cn`):** ✓ verifiquei — componentes.md §0 descreve
  fielmente o `button.tsx` real (import `{ Slot } from "radix-ui"`, `cn` de `@workspace/ui/lib/utils`).
- **kebab-case nos arquivos, PascalCase nos componentes:** ✓ os paths propostos (`ev-badge.tsx`,
  `value-card.tsx`) seguem a regra.
- **Centavos/`@workspace/core/money`:** ✗ ver A1 — o pacote não existe; a "regra dura" referencia código
  ausente.
- **date-fns/date-fns-tz:** ⚠ o DS usa corretamente `formatInTimeZone` + locale `ptBR`, MAS **não verifiquei
  se `date-fns`/`date-fns-tz` estão instalados** (não aparecem em `packages/ui/package.json`; podem estar em
  `apps/web`). Recomendo confirmar a dependência antes de cravar os snippets como copiáveis.
- **`exports` map do `packages/ui`:** ✓ a "pegadinha" de componentes.md §0 (l.30) está **correta** —
  verifiquei: `"./components/*": "./src/components/*.tsx"` resolve só arquivo, não pasta. A recomendação
  (público = arquivo raiz) é sólida.

---

## Veredito final

**O DS está coerente em visão e quase-pronto em conteúdo, mas NÃO está pronto para uso direto como referência
de implementação** — por causa de 5 achados Altos que tornam partes dele não-compiláveis ou factualmente
erradas sobre o repo:

1. **A1** — `@workspace/core/money` não existe; snippets de dinheiro não compilam.
2. **A2** — o bloco "pronto para colar" de tokens.md omite `--radius-2xl..4xl` existentes (regressão ao colar).
3. **A3** — componentes.md e benchmark-externo.md inteiros usam nomes de token não-canônicos (geram classes
   Tailwind mortas).
4. **A4** — os snippets de conformidade.md usam variáveis inexistentes (`--warn`, `--green`, `--bg-2`).
5. **A5** — cor do AgePill ainda aberta (risco de +18 vermelho = colisão semântica com perda).

A boa notícia: **os 5 Altos são todos "execução do que o próprio README §4 já decidiu"** ou correções
mecânicas, não repensar de arquitetura. A espinha do DS (filosofia, semântica de cor, compliance-como-produto,
escala de tokens OKLCH, catálogo de 13 componentes, templates das 4 superfícies) é sólida, internamente
consistente na intenção, e **exemplar em compliance** (nenhuma copy viola a Lei 14.790).

**O que falta para "pronto":**
- Executar os ajustes de convergência já listados no README §4 (renomear tokens em componentes/benchmark/
  conformidade) — fecha A3, A4, A5.
- Resolver A1/A2 (criar `@workspace/core` ou marcar como pendente; corrigir o bloco de tokens).
- Trocar todos os `[[wikilinks]]` e consertar os links markdown quebrados de marca-e-tom (M2).
- Confirmar existência dos docs-âncora de compliance (COMP-001, investigação 14.790) e da fonte primária do
  "≥10%" (M4).
- Verificar `lucide-react ^1.20.0` e `date-fns` instalados (M5, repo).

Sem esses, o DS é uma **especificação madura e confiável de leitura**, mas quem copiar os snippets hoje produz
imports quebrados e classes Tailwind inexistentes.
