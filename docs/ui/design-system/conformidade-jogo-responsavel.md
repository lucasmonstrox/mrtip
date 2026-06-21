# Conformidade & Jogo Responsável — padrões de UI

> _as-of 2026-06-21_ · volta para [[README]] (índice do design system)

Esta seção define os **padrões de interface** que a **Lei 14.790/2023** + **Portaria SPA/MF 1.231/2024** (e a fiscalização ativa 2025-2026) exigem, e como o posicionamento **"honesto e auditável"** do mrtip transforma esses requisitos legais em **diferencial de produto** — não em letra miúda de rodapé.

Fundamentação legal: [docs/features/conformidade/COMP-001-conformidade-jogo-responsavel.md](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md) e [docs/investigacoes/regulacao-br-apostas-produto.md](../../investigacoes/regulacao-br-apostas-produto.md). **Toda afirmação legal abaixo está ancorada nesses docs.** O que não estiver coberto está marcado `[A confirmar]`.

> **Princípio-mestre desta seção:** a conformidade **não é uma camada que se adiciona depois** — ela é a própria tese do produto. "Probabilidade calibrada + risco explícito, nunca renda/lucro" é simultaneamente (a) o que a regulação exige e (b) o que diferencia o mrtip de "mais uma IA de palpite". Quem constrói tela aqui não está atendendo a um requisito chato; está construindo o ativo de confiança.

---

## 0. Como usar esta seção

Três artefatos acionáveis, em ordem de uso no dia a dia:

1. **[§2 Checklist de linguagem](#2-linguagem-proibida-vs-obrigatória-checklist-acionável)** — cole no PR template; toda copy de pick/value-bet passa por ele.
2. **[§6 Anti-padrões](#6-anti-padrões-o-que-nunca-fazer)** — lista de "não faça" para revisão de design.
3. **Tokens e componentes** — as cores/raios vêm de [[tokens-cor]] e [[fundamentos]]; aqui só especificamos **uso semântico** (quando âmbar, quando vermelho) e **anatomia dos componentes de conformidade**.

---

## 1. Avisos obrigatórios: o quê, onde, quando

### 1.1 O requisito legal (resumido)

- **Cláusula de advertência de jogo responsável** deve ocupar **≥ 10%** do tamanho/duração da peça, falada e escrita quando o meio permitir ([investigação](../../investigacoes/regulacao-br-apostas-produto.md), claim "Cláusula de advertência"; `snippet` Souto Correa/Baptista Luz).
- **Jogo responsável é mecanismo, não aviso** — limites prudenciais + autoexclusão são obrigatórios; aviso de texto **não basta** sozinho (mesma fonte, claim "Jogo responsável é mecanismo").
- **+18** obrigatório.
- **Rótulo de publicidade** ("publicidade" / "parceria paga") em todo conteúdo afiliado/patrocinado.

> O "≥ 10%" foi documentado para **peças de marketing/publicidade** (anúncios). Sua aplicação literal à **UI do produto in-app** (área logada) não está cravada nos docs. Decisão de design abaixo trata os dois casos separadamente. `[A confirmar com João]` se a área logada é considerada "peça publicitária" para fins do 10% ou se basta o aviso persistente + mecanismos de RG.

### 1.2 Inventário de avisos por superfície

Três tipos de aviso, cada um com gatilho e local próprios:

| Aviso | Tipo de componente | Onde aparece | Quando |
|---|---|---|---|
| **Banner persistente de RG** (`<ResponsibleGamblingBar/>`) | barra fina sticky no rodapé do app shell | **todas** as superfícies logadas (Hub, Dossiê, Histórico) e a landing | sempre visível |
| **Gate +18** (`<AgeGate/>`) | tela bloqueante / modal | primeira visita (pré-conteúdo) | uma vez por dispositivo + revalidação `[A confirmar período]` |
| **Rótulo de publicidade** (`<SponsoredTag/>`) | chip/badge âmbar | em qualquer card de pick patrocinado ou link afiliado | sempre que houver compensação por resultado |
| **Disclaimer de "desempenho passado"** (`<PastPerformanceNote/>`) | nota inline | Histórico/CLV, perto de qualquer KPI agregado | sempre que se mostra acerto/yield/CLV histórico |
| **Cláusula 10%** (peça de marketing) | overlay/texto na arte | landing pages, OG images, conteúdo de divulgação | toda peça publicitária externa |

### 1.3 Banner persistente de jogo responsável

Decisão: **barra sticky no rodapé do app shell**, sempre presente, **âmbar como cor de borda/ícone** (não fundo âmbar inteiro — isso vira ruído e a gente perde a hierarquia de cor; reservamos preenchimento âmbar para alertas pontuais).

Semântica de cor (de [[tokens-cor]]): **âmbar `#f0b429` = aviso/compliance** — é a cor canônica de tudo nesta seção. Verde nunca aparece num contexto de conformidade (verde = EV+/positivo; usar verde aqui sugeriria que apostar "dá certo").

```tsx
// packages/ui — anatomia (não-normativa do código final, normativa do layout)
<aside
  role="contentinfo"
  aria-label="Aviso de jogo responsável"
  className="sticky bottom-0 flex items-center gap-2 border-t border-[--warning] bg-[--sidebar] px-4 py-2 text-xs text-[--muted-foreground]"
>
  <ShieldAlertIcon className="size-4 shrink-0 text-[--warning]" />
  <span>
    <strong className="text-[--text]">+18.</strong> Apostas envolvem risco de
    perda. Isto não é renda nem investimento.{" "}
    <a href="/jogo-responsavel" className="underline">Jogue com responsabilidade</a>{" "}
    · <a href="/limites" className="underline">definir limites</a>{" "}
    · <a href="/autoexclusao" className="underline">autoexcluir-se</a>
  </span>
</aside>
```

**Texto-modelo do banner (copy aprovável):**

> **+18.** Apostas envolvem risco de perda. Isto não é renda nem investimento. Jogue com responsabilidade · definir limites · autoexcluir-se.

Note que os links **definir limites** / **autoexcluir-se** são o que torna o RG **mecanismo, não aviso** — eles dão acesso direto às telas de limites prudenciais e autoexclusão (faceta `api` da COMP-001: `settings.jogo_responsavel`, `settings.limites_prudenciais`).

`[A confirmar com João]` o texto literal precisa de revisão jurídica antes do go-live — a investigação lista "confirmar redação literal" como lacuna aberta. Tratar a copy aqui como **estrutura aprovada, redação pendente**.

### 1.4 Gate +18 / verificação de idade

Decisão: **tela bloqueante na primeira visita** (não modal dispensável por clique fora). Conteúdo de picks/odds **não renderiza** atrás do gate.

- **Gate visual (declaração de idade):** "Você tem 18 anos ou mais?" com confirmação explícita. Bloqueia o conteúdo até o aceite. Persiste em `localStorage`/cookie + revalidação `[A confirmar período de revalidação]`.
- **Verificação real de idade (KYC):** a verificação documental forte (faceta `api`) pertence ao backend/onboarding, fora do escopo deste DS. A UI do gate visual é o que esta seção especifica. `[A confirmar com João]` se o produto exige só a auto-declaração (padrão de conteúdo/tips) ou KYC documental (padrão de operador) — depende do enquadramento legal do mrtip, que a própria investigação lista como pergunta aberta.

```tsx
// Gate bloqueante — conteúdo não monta atrás dele
<AgeGate>
  {/* só renderiza após confirmação +18 */}
  <AppShell>{children}</AppShell>
</AgeGate>
```

Anatomia do gate: tela cheia, fundo `--bg`, card central `--panel` com radius 14px, dois botões: **"Tenho 18 anos ou mais"** (primário) e **"Sou menor de 18"** (secundário → leva para fora, mensagem de que o conteúdo é restrito). **Nunca** pré-selecionar o "sim" nem usar dark pattern para empurrar o aceite.

---

## 2. Linguagem PROIBIDA vs. OBRIGATÓRIA (checklist acionável)

Este é o artefato mais importante da seção. A investigação crava: **"value bet/EV+" é o conceito central do produto E o de maior risco de linguagem** — ele pode ser lido como promessa de renda/investimento, o que é vedado.

### 2.1 Regra de ouro

> Enquadrar **tudo** como **"probabilidade calibrada + risco explícito"**. Nunca "lucro", "renda", "investimento", "ganho garantido", "aposta certa".

### 2.2 Checklist (copiar para o PR template)

Toda string visível ao usuário que descreva um pick, mercado, EV ou resultado passa por:

- [ ] **Não** usa as palavras: `lucro`, `renda`, `renda extra`, `investimento`, `ganho garantido`, `ganho fácil`, `aposta certa`, `dinheiro certo`, `dobrar a banca`, `método infalível`, `green garantido`, `não tem erro`.
- [ ] **Não** apresenta aposta como solução financeira ou fonte de sustento (vedado pela Lei 14.790 — [investigação](../../investigacoes/regulacao-br-apostas-produto.md), claim "Aposta ≠ renda/investimento").
- [ ] **Não** sugere ganho fácil, sucesso pessoal/social/financeiro, ou habilidade extraordinária (Portaria 1.231).
- [ ] **Não** usa call-to-action de urgência/ato imediato ("aposte agora", "última chance", "não perca") — vedado (claim "Jogo responsável é mecanismo": "vedada chamada para ação sugerindo ato imediato").
- [ ] **Toda** estimativa exibe a **incerteza** junto (probabilidade %, intervalo, ou "estimativa, não garantia").
- [ ] EV+ aparece como **"valor esperado positivo, com risco"** — nunca como dinheiro garantido.
- [ ] Histórico aparece como **"desempenho passado, sem garantia futura"**.

### 2.3 Tabela de substituição (de → para)

| Proibido (não usar) | Obrigatório (usar) |
|---|---|
| "Lucro garantido nessa" | "Estimamos probabilidade acima da implícita pela odd" |
| "Renda extra com apostas" | "Ferramenta de análise probabilística. Não é renda." |
| "Aposta certa / green na conta" | "Pick com valor esperado positivo — **e risco real de perda**" |
| "EV+ = dinheiro fácil" | "EV+ significa odd acima do justo estimado; perde com frequência mesmo assim" |
| "90% de acerto" | "Acerto honesto: X de N picks (inclui as perdas) · CLV +Y%" |
| "Não tem erro" | "Probabilidade calibrada, não certeza" |
| "Aposte agora!" | "Pick registrado às HH:MM. A decisão é sua." |
| "Dobre sua banca" | "Gestão de banca: nunca aposte o que não pode perder" |

### 2.4 Onde isto vira componente

- **Pickbox** (Dossiê) — o subtítulo padrão de qualquer pick inclui o framing de risco. Ver [[componentes-dominio]] para a anatomia da pickbox; **esta seção é dona da copy de risco que vai nela**.
- **Chat assistente** — o agente (AGT-001/002, que a COMP-001 `impacta`) tem as mesmas regras de linguagem no system prompt. A UI do chat deve renderizar o disclaimer de risco de forma persistente no header da conversa, não só uma vez.
- **Card "sem valor"** (Hub) — "não apostar também é resultado" é a expressão máxima da linguagem honesta. Tratado em [[componentes-dominio]].

---

## 3. Rótulo de publicidade / conteúdo afiliado

A investigação é dura aqui: se o mrtip monetiza por **afiliação atrelada a resultado**, **é afiliado regulado**, com **responsabilidade solidária** do operador, e **exige identificação publicitária explícita** (claims "Afiliado definido e responsabilizado" + "Identificação publicitária obrigatória").

Padrão de UI:

- **`<SponsoredTag/>`** — chip âmbar com texto **"publicidade"** ou **"parceria paga"**, **sempre visível** no card, não escondido em tooltip. Posição: topo do card, antes do conteúdo.
- Aplicado a: qualquer pick patrocinado, qualquer link "apostar nesta casa", qualquer card de operador.
- **Whitelist obrigatória:** a UI só pode renderizar link/botão para casas **.bet.br licenciadas** (claim "Responsabilidade tributária por operador ilegal" — divulgar operador não-autorizado gera responsabilidade solidária). O componente de "ir para a casa" deve receber operadores **apenas de uma lista de licenciados** (faceta `api`: tabela `operadores_licenciados`). Renderizar um operador fora da whitelist é um **bug de conformidade**, não só de dados.

```tsx
<article className="...card...">
  {pick.isSponsored && (
    <span className="inline-flex items-center gap-1 rounded-full border border-[--warning] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[--warning]">
      Parceria paga
    </span>
  )}
  {/* ...conteúdo do pick... */}
</article>
```

---

## 4. Registro auditável imutável como PADRÃO de UI

Este é onde **conformidade vira o produto**. O "registro de acerto imutável" não é compliance defensivo — é o **ativo de confiança central** do mrtip (a tese "honesto e auditável"). A investigação reforça: o histórico auditável é **diferencial do produto E conformidade** (apresentar desempenho passado sem garantia futura).

### 4.1 Por que é produto, não rodapé

Concorrentes inflam acerto retroativamente (editam o pick depois do jogo, escondem perdas). O mrtip **prova** que não faz isso, gravando o pick **antes** do jogo com **hash + timestamp**, e **expondo esse registro na UI** de forma verificável. A imutabilidade visível é o que sustenta a afirmação "não é palpite".

### 4.2 Anatomia do registro (UI)

Cada pick no ledger do Histórico exibe, em fonte **mono** (números/hash sempre mono — ver [[tokens-tipografia]]):

| Campo | Formato UI | Por quê |
|---|---|---|
| **Timestamp de gravação** | `21/06/2026 14:32 BRT` (date-fns-tz, `America/Sao_Paulo`) | prova que foi **antes** do jogo |
| **Kickoff** | mesmo formato | comparável visualmente ao timestamp |
| **Hash** | mono, truncado `a3f9…b2e1` com copy-to-clipboard + tooltip do hash completo | prova de imutabilidade |
| **Resultado** | green/red/void, cor semântica (verde/vermelho/cinza) | honestidade — perdas visíveis |
| **CLV** | mono, com sinal `+0.04` / `-0.02` | métrica-chave, mostrada **crua** |

```tsx
<tr className="font-mono text-sm">
  <td className="text-[--muted]">{formatInTimeZone(pick.recordedAt, "America/Sao_Paulo", "dd/MM/yy HH:mm")}</td>
  <td className="text-[--faint]">{shortHash(pick.hash)}{/* a3f9…b2e1 + copy */}</td>
  <td className={pick.result === "green" ? "text-[--positive]" : pick.result === "red" ? "text-[--negative]" : "text-[--faint]"}>
    {resultLabel(pick.result)}
  </td>
  <td className={pick.clv >= 0 ? "text-[--positive]" : "text-[--negative]"}>{formatClv(pick.clv)}</td>
</tr>
```

### 4.3 Exibir de forma confiável (regras)

- **A linha do ledger é read-only e visivelmente imutável.** Nada de botão "editar". Se um pick foi anulado (jogo cancelado), mostrar como **void** com motivo — nunca apagar.
- **O hash é clicável/copiável** e idealmente verificável (link para página de verificação `[A confirmar com João]` se haverá verificação pública/on-chain ou só hash interno).
- **Timestamp sempre no fuso da loja** (`America/Sao_Paulo`), com label de fuso explícito, via `date-fns-tz` — regra dura do repo. Nunca `new Date()` aritmético nem `Intl` cru.
- **Ordenação default por data**, mostrando **as perdas junto** — não filtrar perdas por padrão (ver §6 anti-padrões).

---

## 5. Acerto honesto vs. acerto inflado

A métrica de honestidade é o oposto do "% de acerto" inflado do mercado. Padrões de exibição:

- **Sempre mostrar `n` amostral.** "73% de acerto" sozinho é proibido pela honestidade do produto. Mostrar **"38 de 52 picks"** — o denominador é tão importante quanto o percentual.
- **Perdas visíveis e contadas.** O ledger inclui os reds; os KPIs agregados são calculados sobre **todos** os picks gravados, não sobre uma seleção.
- **CLV cru, com sinal.** CLV é a métrica-chave de confiança do mrtip (mede se o pick bateu a linha de fechamento). Mostrar o valor real, positivo **ou** negativo, em mono. Não maquiar CLV negativo.
- **Yield com aviso de variância.** Yield/ROI exibido com janela temporal e `n`, acompanhado da nota de §5.1.
- **Plot de calibração** (Histórico/CLV) — gráfico que mostra probabilidade prevista vs. frequência real. É a prova visual de calibração. Cores: a diagonal de referência em `--line`, os pontos do produto em `--accent`/`--blue`. **Não** colorir tudo de verde (sugeriria sucesso). Detalhe de viz em [[graficos-e-dados]].

### 5.1 Nota obrigatória de desempenho passado

`<PastPerformanceNote/>` acompanha **todo** KPI agregado:

> Desempenho passado não garante resultados futuros. Os números incluem perdas. Apostar envolve risco.

Em fonte menor (`text-xs`), cor `--muted`, **sempre presente** — não dispensável.

---

## 6. Anti-padrões — o que NUNCA fazer

Lista de "não faça" para revisão de design. Cada item viola a tese honesta e/ou a regulação.

### 6.1 Gamificação que incentiva compulsão

- **NÃO** usar streaks/sequências como recompensa visual que pressiona a continuar ("você está há 5 dias seguidos! não quebre a sequência!").
- **NÃO** confetes/celebração animada ao registrar/ganhar aposta — celebrar reforça o loop de compulsão.
- **NÃO** badges/conquistas por **volume** de apostas ("apostador ouro: 100 apostas!").
- **NÃO** notificações push de urgência ("seu palpite está pegando fogo, aposte de novo").

### 6.2 Contadores enganosos de "hot streak"

- **NÃO** "está pegando fogo 🔥", "7 greens seguidos!" como destaque — sugere que o próximo é mais provável (falácia do apostador) e infla expectativa.
- Se mostrar sequência, mostrar **sempre com o histórico completo** ao lado (incluindo a maior sequência de **perdas**), em tom neutro, sem ícone de fogo/comemoração.

### 6.3 Urgência artificial

- **NÃO** countdown timers de "oferta expira em 00:14" para picks.
- **NÃO** "últimas vagas", "só hoje", "agora ou nunca" — call-to-action de ato imediato é **vedada** pela Portaria 1.231 (claim "Jogo responsável é mecanismo").
- **NÃO** badge "trending/quente" que empurra para ação rápida.

### 6.4 % de acerto inflado

- **NÃO** mostrar percentual de acerto **sem o `n` amostral**.
- **NÃO** filtrar/esconder perdas por padrão no ledger.
- **NÃO** "cherry-pick" de janela temporal (mostrar só o mês bom).
- **NÃO** recalcular acerto retroativamente — o pick gravado é imutável (§4).
- **NÃO** arredondar acerto para cima ou usar "até X%".

### 6.5 Linguagem (resumo cruzado com §2)

- **NÃO** "renda", "lucro", "investimento", "garantido", "certa", "fácil" em qualquer lugar.
- **NÃO** apresentar EV+ como dinheiro garantido.

### 6.6 Dark patterns de conformidade

- **NÃO** esconder o banner de RG, limites ou autoexclusão atrás de menus profundos — devem ser acessíveis em ≤2 cliques.
- **NÃO** pré-selecionar "+18 sim" no gate.
- **NÃO** rótulo de publicidade em tooltip/escondido — deve ser visível inline.

---

## 7. Cor & componentes desta seção (resumo de tokens)

Esta seção **não define** tokens — eles vivem em [[tokens-cor]]. Aqui está só o **uso semântico** que a conformidade impõe:

| Contexto de conformidade | Token | Hex (de [[tokens-cor]]) |
|---|---|---|
| Aviso / banner RG / rótulo publicidade / gate | **âmbar (warn)** | `#f0b429` |
| Perda no ledger (red) | **vermelho** | `#f0556d` |
| EV+ / green / acerto (positivo) — **nunca** em contexto de aviso | verde | `#27d07a` |
| Void / neutro / nota de desempenho | faint/muted | `#5f7286` / `#8aa0b4` |
| Hash, timestamp, CLV, odds | **mono** | (ver [[tokens-tipografia]]) |

**Regra de cor crítica:** verde **jamais** aparece em copy de aviso ou em CTA de apostar. Verde sinaliza valor/positivo; usá-lo no contexto de conformidade comunicaria "apostar dá certo", o oposto da tese.

---

## 8. Componentes a criar (backlog para [[componentes-dominio]] / packages/ui)

| Componente | Dono da anatomia | Dono da copy/semântica |
|---|---|---|
| `<ResponsibleGamblingBar/>` | [[componentes-dominio]] | esta seção (§1.3) |
| `<AgeGate/>` | [[componentes-dominio]] | esta seção (§1.4) |
| `<SponsoredTag/>` | [[componentes-dominio]] | esta seção (§3) |
| `<PastPerformanceNote/>` | [[componentes-dominio]] | esta seção (§5.1) |
| Linha de ledger imutável (hash/timestamp) | [[componentes-dominio]] + [[graficos-e-dados]] | esta seção (§4) |

---

## Questões abertas (para João / jurídico)

- **Redação literal de toda copy de aviso e disclaimer** — a investigação lista "confirmar redação literal da Lei 14.790/Portaria 1.231" como lacuna. Estrutura aprovada aqui, texto pendente de revisão jurídica.
- **Aplicação do "≥10%" à área logada** — documentado para peças de marketing; aplicação literal ao app in-app não cravada.
- **Auto-declaração +18 vs. KYC documental** — depende do enquadramento legal do mrtip (afiliado × veículo × plataforma de tips), que a própria investigação lista como pergunta aberta.
- **Período de revalidação do gate +18.**
- **Verificação pública do hash** — se haverá página/mecanismo público de verificação do registro imutável ou só hash interno.
