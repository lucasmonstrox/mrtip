# Padrões, Layouts & Acessibilidade

> Parte do Design System do **mrtip**. As-of: **2026-06-21**. Volta para o [[README]] do DS.
>
> Esta seção define **como montar telas** (templates das superfícies, grid, responsividade), **como mostrar muito número sem poluir** (densidade de dados, tabelas/ledger, estados vazios/loading/erro), **como ser acessível** (WCAG AA no tema escuro, foco, teclado, motion, não-só-cor) e **como formatar para o Brasil** (pt-BR, dinheiro, datas, odds). Os valores de cor/raio/tipografia citados vivem em [[tokens]]; os componentes concretos (pickbox, card de value bet, chip de peso, ledger) vivem em [[componentes]] — aqui é a **gramática de composição**, não o catálogo.

---

## 0. Princípios que mandam no layout

Três regras do produto viram regra de tela. Tudo abaixo deriva delas:

1. **Nenhum pick sem o porquê.** O layout nunca apresenta um número (EV, prob, odd) sem reservar espaço para a explicação e as fontes ao lado/abaixo. Se uma tela só "cabe" escondendo a justificativa, a tela está errada.
2. **"Não apostar também é resultado".** Estado vazio do Hub não é um vazio — é um card de conteúdo de primeira classe (sem value → recomendação explícita de não apostar). Ver [§3.4](#34-estados-vazios-loading-erro).
3. **Probabilidade calibrada, não promessa** (Lei 14.790, [COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md)). Vira requisito de cor/ícone/texto: positivo nunca é "ganho garantido", verde nunca aparece sozinho ([§4.5](#45-não-usar-só-cor-o-pacto-do-mrtip)).

---

## 1. Sistema de layout (a base das 4 superfícies)

Os mockups são **desktop-first ~1180px**. Formalizo isso num app-shell único e três breakpoints, para não reinventar grid por tela.

### 1.1 App-shell

Todas as superfícies de produto (Hub, Dossiê, Histórico) vivem dentro do mesmo shell. O admin shell é uma variação (ver [§2.4](#24-admin-shell)).

```
┌──────────────────────────────────────────────────────────┐
│  Topbar  (logo · seletor de rodada/liga · busca · perfil) │  56px, sticky
├────────────┬─────────────────────────────────────────────┤
│            │                                              │
│  Nav lat.  │   Região de conteúdo (max-width 1180px,      │
│  (rail)    │   centralizada, padding lateral fluido)      │
│  64–240px  │                                              │
│            │                                              │
└────────────┴─────────────────────────────────────────────┘
```

- **Container de conteúdo:** `max-width: 1180px`, centralizado, `padding-inline: clamp(16px, 4vw, 32px)`. Não esticar tabela/ledger além disso — densidade pede medida de linha controlada.
- **Topbar:** `position: sticky; top: 0`, fundo `bg-2` (#0f151c) com `border-bottom: 1px solid line`. Altura 56px. Contém o **seletor de rodada/liga** (controle global — muda o contexto do Hub e do Dossiê).
- **Nav lateral (rail):** três destinos canônicos — Hub da Rodada · Dossiê · Histórico/CLV. Recolhível para 64px (só ícone) em telas médias.
- **Faixa de compliance:** o disclaimer +18 / jogo responsável **não** é rodapé escondido. É uma barra fina persistente no rodapé do shell (`faint` sobre `bg`, sempre visível) ou um bloco fixo no fim do conteúdo. Decisão: barra persistente de 1 linha + link "Jogo responsável" que abre o painel de limites. Detalhe de copy em [[conteudo-tom-conformidade]].

### 1.2 Grid e espaçamento

- **Grid de cards (Hub):** CSS Grid `repeat(auto-fill, minmax(340px, 1fr))`, `gap: 16px`. Em ≥1180px isso dá 3 colunas; degrada sozinho.
- **Escala de espaço:** múltiplos de 4 (4/8/12/16/24/32). Padding interno de card = 16px; gap entre seções de uma tela = 24px. (Tokens de spacing em [[tokens]].)
- **Raio:** 14px em containers/cards, 9px em controles internos (chips, inputs, badges) — ver [[tokens]].
- **Faixa de acento à esquerda (3px):** assinatura visual do mrtip. Todo card de "veredito" (value bet, pickbox, linha de ledger) tem `border-left: 3px solid <cor-semântica>`. A cor carrega significado → precisa de reforço não-cromático ([§4.5](#45-não-usar-só-cor-o-pacto-do-mrtip)).

### 1.3 Breakpoints e comportamento responsivo

Desktop-first; defino o que **colapsa** ao estreitar.

| Faixa | Nome | Shell | Conteúdo |
|---|---|---|---|
| ≥ 1180px | desktop | rail expandido (240px) | grids multi-coluna; Dossiê em 2 colunas (dossiê + chat) |
| 768–1179px | tablet | rail recolhido (64px, só ícone) | grid de cards 2 col; Dossiê empilha (chat vira aba/drawer) |
| < 768px | mobile | rail vira bottom-tab ou drawer; topbar mantém seletor de rodada | tudo 1 coluna; tabelas viram listas (ver [§3.2](#32-tabelas--ledger)); chat vira tela cheia |

Regras duras de mobile:
- **Nada de scroll horizontal em tabela.** Ledger/CLV viram cartões-linha empilhados ([§3.2](#32-tabelas--ledger)).
- **Números mono não encolhem abaixo de 13px** — perdem legibilidade. Antes disso, reduza o nº de colunas, não a fonte.
- **Pickbox e value bet** mantêm explicação visível no mobile (collapse opcional das fontes, nunca da razão).

---

## 2. Templates de página (as 4 superfícies)

Cada template descreve regiões + hierarquia + o que é fixo vs. fluido. Os componentes referidos estão em [[componentes]].

### 2.1 Hub da Rodada

Objetivo: varredura rápida de onde há EV+ na rodada. **Ordenação por EV+ é o default e o ponto-chave.**

```
[ Topbar: seletor de rodada/liga ]
[ Barra de filtros  ── mercado (cartões/escanteios/team-total/…) · liga · só EV+ · ordenar ]   sticky abaixo da topbar
[ Resumo da rodada  ── nº de jogos · nº de value bets · faixa de EV ]    1 linha, muted
[ GRID de cards de value bet ───────────────────────────────────── ]
   ┌ card ┐ ┌ card ┐ ┌ card ┐      cada card: faixa verde 3px à esq.,
   │ EV+  │ │ EV+  │ │ EV+  │      jogo · mercado · odd (mono) · EV (mono) ·
   └──────┘ └──────┘ └──────┘      1 linha de razão · CTA "abrir dossiê"
   ┌ card "SEM VALOR" ───────────────────────────────┐
   │ faixa âmbar/neutra · "Nesta rodada não há EV+ em │  ← card de primeira classe
   │ X. Não apostar também é resultado."              │
   └──────────────────────────────────────────────────┘
```

- **Hierarquia visual:** o **EV** é o elemento mais forte do card (mono, maior, cor semântica). Odd e mercado são secundários. A razão é texto `text`, 1 linha, com "..." → expande no Dossiê.
- **Filtro = estado de URL** (querystring) para ser compartilhável/voltável. O filtro "só EV+" é ligado por padrão? **Decisão:** não — mostrar também os "sem valor" reforça a honestidade. `[A confirmar com João]` se o default deve esconder jogos sem mercado analisado.
- **Densidade:** muitos cards → use [§3.1](#31-densidade-de-números) (tabular-nums, alinhamento à direita dos números).

### 2.2 Dossiê do Jogo

Objetivo: a tela mais densa — o "porquê" completo de um pick. Desktop = 2 colunas; o chat é cidadão de primeira classe, não popup.

```
[ Cabeçalho do jogo: times · data/hora (America/Sao_Paulo) · liga · rodada ]
┌─────────────────────────────────────────────┬───────────────────────────┐
│  COLUNA PRINCIPAL (≈ 64%)                     │  COLUNA CHAT (≈ 36%)      │
│                                               │                           │
│  [ PICKBOX ]  veredito + mercado/odd + EV +   │  Assistente conversacional│
│               prob calibrada + faixa 3px      │  ancorado no jogo.        │
│                                               │  Cada resposta cita fontes│
│  [ Dimensões do jogo (com PESO) ]             │  (chips clicáveis).       │
│    ── árbitro      [peso ALTO]   ▓▓▓          │                           │
│    ── lesões       [peso MÉDIO]  ▓▓           │  sticky; scroll próprio.  │
│    ── rivalidade   [peso BAIXO]  ▓            │                           │
│    ── narrativa    [peso 0]      ·            │                           │
│                                               │                           │
│  [ Mercado & Odds ]  tabela mono, CLV ref.    │                           │
│  [ Fontes ]  lista auditável com timestamp    │                           │
└─────────────────────────────────────────────┴───────────────────────────┘
```

- **Pickbox no topo, sempre:** veredito + EV + **probabilidade calibrada** + odd. Acompanha o aviso de risco inline (não rodapé). É o componente que mais sofre restrição de [COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md): linguagem de probabilidade/risco, nunca "ganho".
- **Dimensões com peso:** cada dimensão mostra **rótulo de peso** (alto/médio/baixo/**narrativa = peso 0**). O peso é visual (barra/intensidade) **e** textual — peso é informação crítica e não pode depender só de tamanho de barra ([§4.6](#46-data-viz-acessível)). A camada narrativa (peso 0) é visualmente desmarcada como "não entra no número" — coerente com a disciplina *estimar ≠ explicar* da [tese](../../tese-produto.md).
- **Chat:** coluna fixa no desktop; vira drawer/aba no tablet; tela cheia no mobile. Respostas **sempre com fontes** (chips). O chat herda as regras de linguagem do agente (impacto de COMP-001 → AGT-001/002).
- **Responsivo:** abaixo de 1180px as colunas empilham — pickbox → dimensões → mercado/odds → fontes, com o chat acessível por botão flutuante/aba.

### 2.3 Histórico · CLV

Objetivo: a **prova de honestidade**. KPIs no topo, calibração no meio, ledger imutável embaixo.

```
[ Filtros: período · mercado · liga ]
[ FAIXA DE KPIs ── 3–4 cards mono ]
   ┌ CLV ┐ ┌ Yield ┐ ┌ Acerto honesto ┐ ┌ N apostas ┐
   │ +2.1%│ │ +1.4% │ │ 47% (n=210)    │ │ 210       │   ← CLV é o KPI herói
[ PLOT DE CALIBRAÇÃO ]  prob prevista × frequência observada + diagonal ideal
[ LEDGER IMUTÁVEL ]  tabela append-only; cada linha: data · jogo · mercado ·
                     odd · prob · resultado · CLV · HASH (mono, truncado, copiável)
```

- **CLV é o KPI-herói** (métrica de confiança da tese). Maior, primeiro, com seta direcional + sinal explícito (`+`/`−`), nunca só verde/vermelho.
- **Ledger = append-only auditável.** Cada linha tem **hash + timestamp** do pick gravado **antes** do jogo. O hash é mono, truncado (`a1b2…9f`) com botão copiar e tooltip do hash completo. Visualmente comunica imutabilidade (ícone de cadeado/selo + texto "registrado em … antes do jogo"). Ver [§3.2](#32-tabelas--ledger).
- **Acerto "honesto":** sempre acompanhado do `n` (tamanho da amostra) — mostrar % sem amostra é desonesto e o produto é sobre honestidade.

### 2.4 Admin shell

Variação do shell para operação interna (consulte `docs/mockups/admin-shell.html` quando existir):

- **Rail mais largo + densidade maior** (admin tolera mais densidade que produto). Sem a faixa de compliance pública (é tela interna), mas **mantém o tema escuro e os tokens** — não é um app à parte.
- **Tabelas-mestras** (operadores .bet.br licenciados / whitelist, settings de jogo responsável, limites prudenciais) usam os mesmos padrões de tabela do [§3.2](#32-tabelas--ledger).
- Edição de settings de conformidade (`jogo_responsavel`, `limites_prudenciais`) e da `operadores_licenciados` (âncoras de COMP-001) vive aqui.

---

## 3. Densidade de dados — muito número, zero poluição

O mrtip é um app de tabelas, odds e métricas. A regra: **o número é o herói; a moldura recua.**

### 3.1 Densidade de números

- **`font-variant-numeric: tabular-nums`** em TODA superfície que alinha números em coluna (odds, EV, CLV, yield, prob). Combinado com a Geist Mono (`--font-mono`) para odds/EV/CLV/hash. Sem isso, dígitos pulam de largura e a coluna "dança".
- **Alinhamento:** números à **direita**; rótulos à esquerda. Sinal (`+`/`−`) prefixado e colorido com seu reforço não-cromático.
- **Cor a serviço do sinal, não da decoração:** verde só em valor positivo/EV+, vermelho só em negativo/perda, âmbar em aviso/compliance. Valor neutro = `text`. Nunca colorir uma coluna inteira "pra ficar bonito".
- **Agrupamento:** separe blocos por **espaço e divisórias finas** (`line` #243140), não por caixas aninhadas. Hierarquia por tamanho/peso de fonte e por `muted`/`faint`, não por mais bordas.
- **Precisão:** odds com 2 casas; EV/yield/CLV em % com 1 casa + sinal; probabilidade em % inteiro ou 1 casa. Padronizar em [§5](#5-i18n--formatação-br).

### 3.2 Tabelas & ledger

Padrão único para Mercado&Odds (Dossiê), KPIs/ledger (Histórico) e tabelas-mestras (Admin):

- **Cabeçalho `muted`, sticky** no scroll vertical de tabelas longas.
- **Linhas (rows):** sem zebra pesada; separador de 1px `line`. Hover = leve realce de fundo (`panel-2` #18222e), nunca mudança de cor que confunda com semântica.
- **Linha de veredito** (ex.: a aposta recomendada na tabela de mercado) ganha a faixa de acento 3px à esquerda + ícone.
- **Ledger imutável:** append-only, ordem cronológica reversa por padrão. Coluna de hash mono truncada + copiar. Selo de imutabilidade por linha. Nunca renderizar como editável (sem inputs, sem ações de edição/exclusão — só visualização/cópia/exportação).
- **Mobile (< 768px):** tabela → **lista de cartões-linha**. Cada cartão = um registro com pares rótulo/valor empilhados; o número-chave (CLV/EV) em destaque. **Zero scroll horizontal.**

### 3.3 Estados de loading / skeleton

- **Skeleton mantém o layout** (mesmo grid/altura) para não haver "salto" (CLS) — importante para o Lighthouse e para densidade. Blocos `panel` com shimmer; **shimmer respeita `prefers-reduced-motion`** ([§4.4](#44-movimento-prefers-reduced-motion)) → vira fade estático.
- Não usar spinner central genérico onde o conteúdo é estruturado (Hub/ledger). Spinner só em ação pontual (envio de chat, recálculo).
- Skeleton de número usa um bloco da largura típica do valor (evita reflow ao chegar o dado).

### 3.4 Estados vazios, loading, erro

- **Vazio do Hub ("sem valor"):** card de conteúdo, não placeholder triste. Copy: variação de *"Nesta rodada não há EV+ em [mercado]. Não apostar também é resultado."* Faixa âmbar/neutra (não vermelha — não é erro). É um princípio do produto, ver [§0](#0-princípios-que-mandam-no-layout).
- **Vazio do Histórico** (sem apostas ainda): explica o que vai aparecer (CLV/ledger) + por que o registro é imutável — usa o vazio para ensinar o diferencial.
- **Erro:** distinguir *erro técnico* (falha ao carregar odds/fontes → retry, sem inventar dado) de *ausência de dado* (jogo sem mercado analisado → mensagem honesta, nunca um número fabricado). Em app de aposta, **inventar/estimar sem base é falha de conformidade**, não só de UX.
- **Estado degradado de fontes:** se uma fonte do Dossiê falhou, marcar a dimensão como "fonte indisponível" em vez de omitir silenciosamente — a auditabilidade exige saber o que faltou.

---

## 4. Acessibilidade (WCAG AA)

Tema escuro denso + significado por cor + público amplo (apostas) ⇒ acessibilidade é requisito, não enfeite.

### 4.1 Risco de contraste — auditoria dos pares do tema escuro

WCAG AA pede **≥ 4.5:1** para texto normal, **≥ 3:1** para texto grande (≥18.66px bold / ≥24px) e para componentes/estados gráficos. Pares a verificar (cores de [[tokens]]) — os fundos canônicos são `bg` #0b0f14, `panel` #141c26, `panel-2` #18222e:

| Par (texto sobre fundo) | Uso | Status / risco |
|---|---|---|
| `text` #e7eef6 / `bg` #0b0f14 | corpo principal | OK (alto contraste, ~14:1) |
| `text` #e7eef6 / `panel` #141c26 | corpo em card | OK |
| `muted` #8aa0b4 / `panel` #141c26 | rótulos secundários | **Limítrofe — medir.** Provável ~4.5:1; usar só em texto ≥14px regular, evitar em <12px. |
| `faint` #5f7286 / `bg` #0b0f14 | disclaimers, placeholders | **RISCO — provavelmente < 4.5:1.** Aceitável só como *texto grande* ou texto **não-essencial decorativo**. **A barra de compliance NÃO pode usar `faint` se o texto for essencial** — usar `muted` no mínimo. `[A confirmar com João]` após medição. |
| `green` #27d07a / `panel` #141c26 | EV+ / positivo | OK como cor de texto grande/número; **como texto pequeno medir** (verde saturado tende a passar em fundo escuro). |
| `red` #f0556d / `panel` #141c26 | perda | OK p/ número grande; medir texto pequeno. |
| `amber` #f0b429 / `panel` #141c26 | aviso/compliance | OK (âmbar claro sobre escuro). |
| `blue` #4ea3ff / `accent` #6ad0ff sobre `bg` | links/realce | OK; **não usar `accent` #6ad0ff como texto pequeno** (ciano claro pode ficar abaixo para corpo — usar para ícones/realce, texto link em `blue`). |
| faixas `*-dim` (green-dim #163828 etc.) | **fundos**, não texto | nunca colocar texto pequeno sobre `*-dim` sem medir; são fundos de badge. |

**Ação:** rodar um check automatizado de contraste (axe/Lighthouse) sobre os mockups renderizados antes de cravar [[tokens]]. Os pares marcados RISCO/Limítrofe são os candidatos a ajuste de token. Verde/vermelho/âmbar **como cor de borda 3px** contam como elemento gráfico (≥3:1) e devem ser checados contra o fundo adjacente, não contra branco.

### 4.2 Foco visível

- **Anel de foco sempre visível** em todo elemento interativo: usar `--ring` (em [[tokens]]) com `outline: 2px solid; outline-offset: 2px`. Nunca `outline: none` sem substituto.
- Foco **não pode depender só de cor** — manter o anel (forma) além da cor, para daltônicos.
- `:focus-visible` para não poluir o mouse, mas garantir teclado.

### 4.3 Navegação por teclado

- **Ordem de tab = ordem visual/lógica:** topbar → filtros → cards/linhas → chat.
- **Skip link** "pular para o conteúdo" no topo (denso, com nav grande).
- **Cards do Hub** são links/botões reais (Enter/Espaço abrem o Dossiê), não `div` com `onClick`.
- **Chat:** Enter envia, Shift+Enter quebra linha; foco volta ao input após resposta; região de mensagens com `aria-live="polite"`.
- **Tabela/ledger:** navegável por teclado; botão "copiar hash" alcançável e rotulado (`aria-label="copiar hash do registro"`).
- **Filtros e seletor de rodada:** combobox acessível (Radix/shadcn já entrega isso — ver [[componentes]]).

### 4.4 Movimento (`prefers-reduced-motion`)

- Respeitar `@media (prefers-reduced-motion: reduce)` globalmente: shimmer de skeleton → fade estático; transições de drawer/chat → instantâneas ou fade curto; **nenhuma animação essencial para entender o estado**.
- Plot de calibração não anima entrada de pontos quando reduce está ligado.

### 4.5 Não usar só cor — o pacto do mrtip

**Crítico num app de apostas.** Verde (EV+/positivo) e vermelho (perda/red) **nunca** comunicam sozinhos:

- **Sinal numérico explícito:** `+2.1%` / `−1.4%` — o sinal carrega o significado mesmo em monocromático.
- **Ícone + cor:** ▲/positivo, ▼/negativo, ⚠/aviso-âmbar, 🔒/imutável. Ícone com `aria-label`.
- **Texto/rótulo:** "EV positivo", "perda", "sem valor", "aviso de risco" — palavra antes da cor.
- **Faixa de acento 3px** reforça por posição+cor, mas o card também traz rótulo textual.
- Teste de sanidade: **a tela em grayscale ainda comunica EV+ vs. perda vs. aviso.** Se não, falhou.

### 4.6 Data-viz acessível

- **Plot de calibração:** além da cor da curva, usar **forma de marcador + rótulos diretos + linha-diagonal ideal rotulada**. Eixos com unidade textual (prob. prevista % × frequência observada %). Tooltip acessível por teclado/foco. Oferecer **tabela equivalente** dos pontos (a mesma informação em texto) — atende leitor de tela e é coerente com "auditável".
- **Barras de peso (Dossiê):** a barra é redundante ao **rótulo textual de peso** (ALTO/MÉDIO/BAIXO/PESO 0). O peso nunca depende só do comprimento/cor da barra.
- **KPIs:** sempre número + unidade + direção textual, não só uma cor de fundo.

---

## 5. i18n / formatação BR

Locale único: **pt-BR**. Não há plano multilíngue agora; ainda assim, **todo texto fica em arquivos de copy/conteúdo** (ver [[conteudo-tom-conformidade]]), nunca hardcoded em componente, para auditoria de conformidade (linguagem de COMP-001) e futura i18n.

### 5.1 Dinheiro (regra DURA do repo)

- Valor canônico = **centavos (int)**. Formatação **exclusivamente** via a porta `@workspace/core/money` (`formatBRL`, `centsParaReaisStr`). Conversão centavos↔reais só na borda (input/exibição).

> ⚠ `@workspace/core/money` ainda não existe no repo — é a porta canônica a criar (regra do CLAUDE.md). Até existir, isole a formatação num util local e migre quando o pacote for criado.

- **PROIBIDO** `Number(x) * 100`, `.toFixed(2)` para cálculo, ou `Intl.NumberFormat` manual — erro de ponto flutuante.
- Exibição BRL: `R$ 1.234,56` (entregue por `formatBRL`). Não reimplementar separador.

```tsx
import { formatBRL } from "@workspace/core/money";
// stakeCents: number (centavos)
<span className="font-mono tabular-nums">{formatBRL(stakeCents)}</span>
```

### 5.2 Datas/horas (regra DURA do repo)

- **`date-fns` / `date-fns-tz`**, sempre no fuso da operação **`America/Sao_Paulo`**. Nada de `new Date()` aritmético nem `Intl` cru.
- O timestamp do **ledger imutável** (pick gravado antes do jogo) é exibido no fuso BR, formato `dd/MM/yyyy HH:mm` (24h), com indicação do fuso quando o registro for de auditoria.
- Kickoff do jogo no cabeçalho do Dossiê: `EEE, dd/MM 'às' HH:mm` em pt-BR (`date-fns` com locale `ptBR`).

```ts
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";
const TZ = "America/Sao_Paulo";
formatInTimeZone(kickoff, TZ, "EEE, dd/MM 'às' HH:mm", { locale: ptBR });
```

### 5.3 Odds, percentuais e números

| Dado | Formato | Notas |
|---|---|---|
| Odds decimais | `1.85` (2 casas, ponto) | mono + tabular-nums; ponto decimal é convenção de odds (não vírgula) |
| Probabilidade | `62%` ou `62,5%` | vírgula decimal pt-BR; 0–1 casa |
| EV / Yield / CLV | `+2,1%` / `−1,4%` | **sempre com sinal**; vírgula decimal; cor + ícone ([§4.5](#45-não-usar-só-cor-o-pacto-do-mrtip)) |
| Amostra (n) | `n=210` | sempre junto de % de acerto |
| Hash | `a1b2…9f` (mono, truncado) | tooltip/copiar com hash completo |

**Decisão de consistência:** percentuais de produto usam **vírgula decimal** (pt-BR), mas **odds usam ponto** (padrão universal de odds; mudar confundiria o apostador). Esse é o único ponto onde misturamos separadores, e é intencional. `[A confirmar com João]`.

> Helpers de formatação de **odds/percentual** ainda não têm porta dedicada como o money. **Decisão:** criar um util de feature (ex.: `utils/format.ts` → `formatOdds`, `formatPct`, `formatCLV`) e, se 2+ features usarem, promover para `@workspace/core` — mesma disciplina do `money`. Não espalhar `.toFixed` por componente. Detalhe de implementação fica com a seção de [[componentes]]/feature, não aqui.

---

## 6. Checklist de "pronto" (toda tela passa por aqui)

- [ ] Cabe no app-shell + container 1180px; degrada nos 3 breakpoints sem scroll horizontal.
- [ ] Todo número em coluna usa tabular-nums + mono ondecabe; alinhado à direita.
- [ ] Nenhum pick/valor sem razão+fontes visíveis (princípio nº 1).
- [ ] Estado "sem valor"/vazio é conteúdo de primeira classe, não placeholder.
- [ ] Skeleton mantém layout; respeita reduced-motion.
- [ ] Grayscale test: EV+/perda/aviso se distinguem sem cor (sinal+ícone+texto).
- [ ] Foco visível em tudo interativo; tab order lógica; skip link.
- [ ] Contraste AA medido nos pares de risco (`faint`, `muted` pequeno, `accent` texto).
- [ ] Datas em America/Sao_Paulo via date-fns-tz; dinheiro via formatBRL (centavos).
- [ ] Linguagem de probabilidade/risco — zero "ganho/renda/investimento" (COMP-001).
- [ ] Barra de compliance +18/jogo responsável presente e legível.

---

## Cross-refs

- [[tokens]] — valores de cor, raio, spacing, tipografia (mono/sans), `--ring`.
- [[componentes]] — pickbox, card de value bet, chip de peso, ledger, KPIs, plot de calibração, controles.
- [[conteudo-tom-conformidade]] — copy de disclaimers, +18, estados vazios, regras de linguagem.
- [tese-produto.md](../../tese-produto.md) · [visão-geral.md](../../visao-geral.md) — porquê de "honesto/auditável" e "estimar ≠ explicar".
- [COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md) — conformidade como restrição de design.
