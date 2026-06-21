# Marca & Tom de Voz — mrtip

> Seção do design system do mrtip. **As-of: 2026-06-21.** Volta para o [README do DS](./README.md).
>
> Esta seção define **quem o mrtip é** (marca, personalidade, voz) antes de definir como ele aparece pixel a pixel. Tokens de cor, tipografia e componentes vivem em outras seções do DS — aqui ficam as **regras de identidade e linguagem** que governam todas elas. Quando uma decisão visual existir aqui em forma de princípio, a seção técnica correspondente herda o princípio e não o redefine.

---

## 0. A marca em uma frase

**mrtip é o copiloto de futebol que fala probabilidade, não promessa.** Num mercado saturado de "90% de acerto" opaco ([panorama-concorrentes](../../research/panorama-concorrentes.md)), a diferenciação **não é ter IA** — é ser o mais **honesto e auditável** ([tese-produto](../../tese-produto.md)). A marca tem que **parecer** isso antes de o usuário ler uma linha de copy: sóbria, técnica, sem euforia. Se um concorrente afiliado pintou a tela de verde-neon com "GANHE HOJE", o mrtip ganha sendo o oposto disso — calmo, denso, mensurável.

> **Princípio-mãe (vale para tudo abaixo):** *a sobriedade é a feature.* Cada vez que houver tentação de "animar", "vender" ou "celebrar", a resposta default é não. A marca compete por **confiança**, e confiança no nicho de apostas se constrói parecendo um terminal de dados, não um cassino.

---

## 1. Logo "mr·tip"

### 1.1 Anatomia

O logotipo é a wordmark **`mr·tip`** em uma palavra, minúscula, com um **ponto verde (dot)** entre `mr` e `tip`. O dot **não é pontuação** — é o elemento de marca isolável: ele carrega a cor semântica de **EV+/positivo** (verde `#27d07a`, ver [tokens de cor](./cores-tokens.md)) e funciona como bullet/sinal de "valor presente". É a única peça da identidade que pode existir sozinha (favicon, app icon, avatar, loading).

- **Wordmark:** `mr·tip`, tudo minúsculo, sem itálico, peso médio/semibold da fonte de marca.
- **Dot:** círculo perfeito, alinhado à **altura-x** (baseline da minúscula), não centralizado verticalmente na cap-height. Cor: verde de marca.
- **Tom da palavra:** `mr` e `tip` em `--text` (`#e7eef6`) sobre fundo escuro; o contraste vem do dot, não de cor na palavra.

> **Decisão opinada:** wordmark sempre **minúscula**. Maiúscula ("Mr Tip", "MRTIP") lê como sigla corporativa ou como afiliado gritando — quebra a sobriedade. A minúscula é deliberadamente discreta, "lowercase tech".

> **Decisão opinada:** o nome se lê "mister tip" (apostador que dá o tip), mas a marca **nunca** se escreve "Mr. Tip" com ponto-final-de-abreviação. O ponto é sempre o **dot verde no meio**, no lugar do espaço — é o que torna a marca dele e não de qualquer um. [A confirmar com João] se quer reforçar a leitura "mister" em algum lugar (ex.: tagline) ou deixar a ambiguidade `mr` = "market reader" viva de propósito.

### 1.2 Espaçamento e construção

Para reproduzir/desenhar o dot de forma consistente sem depender do glifo de uma fonte específica:

| Medida | Valor | Racional |
|---|---|---|
| Diâmetro do dot | `0.28em` do tamanho da wordmark | Lê como "ponto forte", não como pingo de `i` nem como bullet inteiro |
| Gap `mr` → dot | `0.16em` | Respira sem virar dois blocos |
| Gap dot → `tip` | `0.16em` | Simétrico |
| Baseline do dot | alinhado à **x-height** (centro vertical da minúscula) | Ótica de "no meio da palavra", não flutuando |

CSS de referência (a wordmark de produção pode ser SVG; este é o fallback textual e a fonte de verdade das proporções):

```css
.mrtip-wordmark {
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--foreground); /* #e7eef6 */
}
.mrtip-wordmark .dot {
  display: inline-block;
  width: 0.28em;
  height: 0.28em;
  margin: 0 0.16em;
  border-radius: 50%;
  background: var(--positive); /* #27d07a — token EV+/positivo */
  vertical-align: 0.06em; /* sobe pro centro da x-height */
}
```

```tsx
// Wordmark como componente (referência; produção pode virar SVG no @workspace/ui)
export function MrtipWordmark() {
  return (
    <span className="mrtip-wordmark" aria-label="mrtip">
      mr<span className="dot" aria-hidden="true" />tip
    </span>
  );
}
```

### 1.3 Versões

1. **Cor sobre escuro (primária):** `mr` + `tip` em `--foreground`, dot em verde de marca, sobre `--background`/`--sidebar`. É a versão canônica — o produto é dark-first.
2. **Cor sobre claro (excepcional):** mesma lógica, palavra em um cinza-escuro próximo de `--background` (`#0b0f14`), dot no **mesmo verde**. Só para superfícies que escapam do tema (PDF de fatura, e-mail HTML claro, papel). O verde não muda entre fundos — é a constante da marca.
3. **Monocromática (1 cor):** palavra + dot **na mesma cor**. Usar quando a peça é gravada/estampada em uma cor só (carimbo, watermark, favicon B&W, impressão térmica). Nessa versão o dot perde a semântica verde e vira só ritmo tipográfico — aceitável **porque é monocromático por restrição física**, não por escolha. Nunca usar o mono onde a versão em cor cabe.
4. **Dot isolado (símbolo):** só o círculo verde. App icon, favicon, avatar de bot, spinner/loading, marca d'água de "pick gravado". Em contextos muito pequenos (favicon 16px), o dot sozinho lê melhor que a wordmark inteira.

### 1.4 Área de proteção e tamanho mínimo

- **Área de proteção:** margem livre ao redor da wordmark = **largura de um dot** (`0.28em`) em todos os lados. Nada (texto, ícone, borda de card) invade essa zona.
- **Tamanho mínimo da wordmark:** **16px** de altura de x-height (abaixo disso o dot some) → use o **dot isolado**.
- **Dot isolado mínimo:** 8px.

### 1.5 Don'ts (cravados)

- ❌ Não trocar a cor do dot. O dot é **sempre o verde EV+**. Dot âmbar/vermelho/azul reescreve a semântica de cor do sistema ([tokens](./tokens.md)) e mente sobre o produto.
- ❌ Não usar o dot para sinalizar perda/alerta. Verde = valor; é a única leitura.
- ❌ Não escrever "Mr Tip", "Mr. Tip", "MrTip", "MRTIP", "mr.tip", "mr-tip". Só `mr·tip` com o dot no meio.
- ❌ Não colocar a wordmark em itálico, com sombra, gradiente, brilho/glow, outline ou contorno. Glow é estética de cassino — proibido na marca toda.
- ❌ Não colocar a wordmark sobre foto, gradiente ruidoso ou fundo de baixo contraste. Só sobre `--background`/`--sidebar`/`--card`.
- ❌ Não animar o dot de forma "festiva" (pulsar, explodir, confete). Movimento permitido só funcional: spinner de loading (rotação/respiração discreta) e o "carimbo" de pick gravado. Ver [princípios de motion](./motion.md) [A confirmar se essa seção existirá].
- ❌ Não esticar/condensar a wordmark. `letter-spacing` é fixo.

---

## 2. Personalidade da marca

O mrtip é uma pessoa específica na mesa: **o analista quant que perdeu a paciência com chute e marketing.** Cinco traços, cada um com seu oposto-proibido:

| Traço | É | **NÃO é** |
|---|---|---|
| **Honesto** | mostra a perda, mostra o erro de calibração, mostra quando não há valor | esconder downside, arredondar pra cima, "esquecer" o histórico ruim |
| **Auditável** | tudo rastreável — hash, timestamp, fonte ligada ao número, CLV publicado | "confia em mim", selo de acurácia sem método ([panorama §2](../../research/panorama-concorrentes.md)) |
| **Sóbrio** | calmo, denso, terminal-de-dados; deixa o número falar | euforia, exclamação, emoji de foguete, urgência fabricada |
| **Anti-hype** | "probabilidade calibrada de 58%", "edge fino", "sem valor hoje" | "90% de acerto", "green certo", "entrada garantida", "tip bombástica" |
| **Tecnicamente respeitoso** | trata o usuário como adulto que entende EV/CLV/risco | infantilizar, prometer, vender sonho de renda |

> **A régua de uma frase:** *se um afiliado de Telegram poderia ter escrito/desenhado isso, está errado.* O concorrente típico do BR é palpite grátis custeado por afiliação, com "IA" como rótulo e zero track record ([panorama §4](../../research/panorama-concorrentes.md)). A marca do mrtip é **o anti-afiliado**: a sobriedade comunica "isto aqui é diferente" antes de qualquer argumento.

> **Tensão honesta com o negócio:** ser sóbrio pode parecer "fraco" frente ao "90% de acerto" do vizinho (risco #5 do [panorama](../../research/panorama-concorrentes.md)). A marca **assume esse custo de propósito** — quem quer hype não é o público. A conversão vem de quem já se queimou com hype e procura adulto na sala. Não diluir a sobriedade pra competir em barulho.

---

## 3. Tom de voz & microcopy

### 3.1 As três leis da linguagem (não-negociáveis)

Derivadas direto da [Lei 14.790 + Portaria SPA 1.231](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md) — aqui **compliance e marca são a mesma decisão** ([tese §2](../../tese-produto.md)):

1. **Probabilidade, nunca promessa.** Todo número é uma estimativa calibrada com incerteza, não um resultado futuro. "58% de probabilidade", não "vai acontecer".
2. **Risco sempre à vista.** Onde há upside, há downside no mesmo enquadramento. Nunca mostrar ganho potencial sem o risco no mesmo nível visual.
3. **Aposta não é renda.** Proibido qualquer enquadramento de investimento/lucro/renda/retorno-garantido. É proibido por lei **e** é a marca.

### 3.2 Glossário: palavras que usamos / banimos

| ✅ Usamos | ❌ Banidas |
|---|---|
| probabilidade, chance estimada, calibração | acerto garantido, certeza, fato |
| valor (EV+), edge, vantagem estatística | tip bombástica, entrada certa, green na conta |
| risco, variância, downside, drawdown | sem risco, dinheiro fácil, livre de perda |
| CLV, yield, acerto honesto | "90% de acerto", taxa de vitória esmagadora |
| stake sugerida, gestão de banca | invista, multiplique, dobre, renda extra |
| "sem valor hoje", "não apostar" | "não perca essa", "última chance", "agora ou nunca" |
| pick, prognóstico, leitura do jogo | palpite quente, dica infalível, bilhete premiado |

> **Regra dura:** os números (odds, EV, CLV, hash) são **mono** ([tipografia](./tipografia.md)) e nunca recebem adjetivo emocional. Um EV de `+3.2%` aparece como `+3.2%`, não como "EV ótimo!". O número se defende sozinho — adjetivá-lo é hype.

### 3.3 Copy bom vs. proibido (exemplos por contexto)

**Pick / value bet (Hub da Rodada, Dossiê):**
- ✅ "Mais cartões — Palmeiras x Corinthians · prob. estimada 61% · odd 1,95 · EV +4,1%. Árbitro com média alta de cartões; clássico de alta fricção."
- ❌ "GREEN CERTO: + de 4.5 cartões no clássico! Árbitro caseiro, não tem erro. Entra com tudo! 🔥"
- *Por quê:* o bom dá número + incerteza + porquê + fonte do sinal; o proibido promete, usa urgência e emoji de hype.

**Card "sem valor" (assinatura da marca — ver §3.4):**
- ✅ "Sem valor nesta rodada. As linhas estão eficientes nos mercados que cobrimos — **não apostar também é resultado.**"
- ❌ "Poucas opções hoje, mas separamos 3 palpites pra você não ficar de fora!"
- *Por quê:* o mrtip recomenda **não agir** quando não há edge. Inventar pick pra preencher é traição da tese.

**Histórico / CLV (quando foi mal):**
- ✅ "Yield −2,3% nos últimos 30 dias. CLV positivo (+1,8%) — o processo segurou, a variância não colaborou. Histórico completo, com hash, abaixo."
- ❌ "Tivemos uns reveses, mas já estamos de volta com tudo! Próxima semana vem a recuperação."
- *Por quê:* honestidade = mostrar a perda e separar **processo (CLV) de resultado (yield)**; o proibido maquia e promete recuperação.

**Conversa com o assistente (recusa elegante):**
- ✅ "Não tenho leitura com valor pra esse jogo nos mercados que cubro com confiança. Posso te mostrar a calibração desse mercado pra você decidir?"
- ❌ "Claro! Vai no over 2.5 que é sucesso. 95% de chance."
- *Por quê:* o assistente prefere **não opinar** a chutar; oferece dado, não certeza.

**Onboarding / CTA:**
- ✅ "Veja onde há valor real nesta rodada." / "Entenda o porquê de cada pick."
- ❌ "Comece a lucrar hoje!" / "Sua renda extra começa aqui."

**Estados de erro / vazio:**
- ✅ (sem jogos) "Sem rodada ativa agora. Volta quando as próximas partidas tiverem linha aberta."
- ❌ "Ops! Nada por aqui 😢 mas logo vem green!"

### 3.4 O card "sem valor" como manifesto

O card **"sem valor / não apostar também é resultado"** é o microcopy mais importante da marca — é a tese virada texto. Regras de tom:

- Frase-âncora: **"Não apostar também é resultado."** É um bordão da marca; pode aparecer literal no card vazio do Hub da Rodada.
- Tom: factual e tranquilo, **nunca apologético**. Não é desculpa por não ter pick — é uma recomendação de valor igual a qualquer outra.
- Visual: usa o estado neutro (`--muted`/`--faint`), **não** o verde (não há EV+ a celebrar) nem o vermelho (não é perda nem erro). Ver semântica em [cores-tokens](./cores-tokens.md); este card é a prova viva de que verde≠"qualquer coisa boa", verde="EV+".

### 3.5 Mecânica de escrita

- **Voz ativa, frases curtas.** Densidade > floreio. O usuário-alvo lê rápido e técnico.
- **Português BR**, natural, sem anglicismo gratuito — **exceto** os termos técnicos consagrados que o público já usa (CLV, EV, yield, stake, odd, over/under). Esses ficam; traduzir "stake" pra "aposta-base" só confunde.
- **Sem exclamação** em copy de produto. (Exceção raríssima: erro crítico de sistema, e mesmo aí, prefira calma.)
- **Sem CAPS LOCK** pra ênfase. Ênfase vem de **peso tipográfico** e cor semântica, não de gritar.
- **Números sempre em mono e formatados pelas portas certas:** dinheiro via [`@workspace/core/money`](../../../CLAUDE.md) (`formatBRL`), datas via `date-fns`/`date-fns-tz` (fuso `America/Sao_Paulo`). Microcopy nunca monta valor à mão.
- **+18 e jogo responsável** aparecem como parte da experiência, calmos e presentes — não como rodapé jurídico apagado ([COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md)). Tom: "isto é pra adultos e a gente leva a sério", não letra miúda.

---

## 4. Iconografia

### 4.1 Diagnóstico do estado atual

Os mockups usam **emojis** como ícones (foguete, fogo, alvo, etc. embutidos no HTML). Decisão de marca: **emoji é incompatível com a sobriedade.** Emoji renderiza diferente por SO, tem cor/estilo fora do nosso controle (e foguete/fogo são **literalmente a estética de hype** que a marca rejeita), não escala como ícone de UI e não casa com um terminal de dados.

> **Decisão opinada (cravada):** substituir todos os emojis por uma biblioteca de ícones vetoriais consistente. **Recomendação: [lucide-react](https://lucide.dev)** — alinha com o stack shadcn/Radix já em uso ([packages/ui](../../../packages/ui)), é a lib default do shadcn, tem traço fino e neutro que combina com a sobriedade, e é tree-shakeable. Instalar via o pacote, importar em `@workspace/ui`.

### 4.2 Estilo

- **Outline, traço fino (1.5px**, default do lucide), nunca preenchido/colorido por padrão.
- **Monocromático**: ícone herda `currentColor`. A cor vem do contexto/semântica, não do ícone.
- **Tamanhos**: 16px (inline com texto), 20px (controles), 24px (ações primárias). Múltiplos de 4.
- **Cor semântica só quando carrega significado de estado:** um check em verde = EV+/confirmado, um triângulo de alerta em âmbar = aviso/compliance, um X/seta-baixo em vermelho = perda. Caso contrário, ícone é `--muted`. Mantém a regra de cor do sistema ([cores-tokens](./cores-tokens.md)).

### 4.3 Mapa emoji → lucide (referência de migração)

| Conceito (mockup) | Emoji ~atual | Lucide sugerido | Cor |
|---|---|---|---|
| EV+ / valor / confirmado | 🚀 🔥 ✅ | `trending-up`, `check` | verde (estado) |
| Aviso / compliance / +18 | ⚠️ | `triangle-alert`, `shield` | âmbar |
| Perda / queda | 📉 ❌ | `trending-down`, `x` | vermelho |
| Alvo / mercado / pick | 🎯 | `target`, `crosshair` | muted |
| Tempo / agenda / rodada | ⏰ 📅 | `clock`, `calendar` | muted |
| Fonte / referência | 🔗 📰 | `link`, `file-text` | muted/azul |
| Auditoria / hash / lacre | 🔒 | `lock`, `fingerprint`, `badge-check` | muted |
| Calibração / estatística | 📊 | `chart-line`, `gauge` | muted/azul |
| Assistente / chat | 💬 🤖 | `message-circle`, `sparkles` (com parcimônia) | muted |

> **Don't:** não reintroduzir emoji em produto. (Em docs internas como esta, ✅/❌ em tabelas de "bom/proibido" são aceitáveis — são marcação editorial, não UI.)

> **`sparkles`/"IA":** usar com extrema parcimônia. O ícone de "mágica de IA" é clichê e flerta com o hype. A marca prefere assinar IA com **transparência** (mostrar fonte e número), não com brilhinho.

---

## 5. Número como elemento de marca

O **número em mono** é tão identidade quanto o dot verde. Num produto cuja tese é "probabilidade calibrada + CLV auditável", os números são a prova — e a tipografia mono os trata como **dados verificáveis, não como copy persuasiva**.

- Odds, EV, CLV, yield, probabilidades, stakes, valores BRL, hash e timestamps: **sempre em mono** (Geist Mono, já ligada no [layout](../../../apps/web/app/layout.tsx)). Detalhes de escala/uso em [tipografia](./tipografia.md) — aqui fica o **princípio de marca**.
- Tabular nums (alinhamento de colunas) onde houver tabela/ledger — números que "batem" coluna comunicam rigor.
- O número **nunca** é adjetivado nem decorado (sem glow, sem badge "HOT", sem seta animada de hype). Cor semântica nele segue a regra do sistema: `+EV` verde, perda vermelho, neutro `--text`.
- O **hash** do pick gravado (registro imutável, [COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md)) é exibido em mono, truncado com elipse, copiável — é a assinatura literal da auditabilidade. Tratá-lo como elemento de marca (presente, legível, orgulhoso) reforça o posicionamento melhor que qualquer slogan.

> **Princípio:** *o mono é a fonte da verdade; a sans é a fonte da conversa.* Quando algo é verificável, é mono. Quando algo é interpretação/narrativa (a explicação do LLM, a copy de UI), é sans. Essa divisão tipográfica **espelha a disciplina "estimar ≠ explicar"** da [taxonomia de sinais](../../arquitetura/taxonomia-sinais.md): o número (quant) e a narrativa (LLM) também se vestem diferente.

---

## 6. Imagery & ilustração

**Decisão opinada: ausência de imagery decorativa é proposital.** O mrtip não usa fotos de estádio, jogadores comemorando, dinheiro, gráficos genéricos de banco de imagem, nem ilustração "fintech-flat". Tudo isso é o vocabulário visual do **hype** e do **afiliado** — exatamente o que a marca rejeita.

O que ocupa o lugar da imagery:

- **Dados são a estética.** Plot de calibração, ledger, sparklines de CLV, barras de peso de sinal (alto/médio/baixo/narrativa peso-0) — a "ilustração" do produto **são os próprios gráficos honestos**. Eles não são enfeite; são a prova. Estilo: data-viz sóbria, traço fino, cor só onde carrega semântica ([cores-tokens](./cores-tokens.md)).
- **Escudos/logos de clubes** quando necessários: pequenos, neutros, funcionais (identificar o jogo), nunca grandes/heroicos. [A confirmar com João] os direitos de uso de escudos no BR — pode exigir versão genérica/monograma por time. Risco jurídico real, não só estético.
- **O dot verde** é o único elemento "gráfico de marca" recorrente. Repetição do dot (como bullet/acento) já dá identidade suficiente.
- **Faixa de acento à esquerda do card** (3px, ver [cores-tokens](./cores-tokens.md) e [componentes](./componentes.md)) é um motivo visual de marca — verde/âmbar/vermelho conforme estado. É decoração **que carrega significado**, o único tipo permitido.

> **Regra:** se um elemento visual não **informa** (não carrega dado nem estado), ele provavelmente não pertence ao mrtip. A tela densa de dados **é** a marca; espaço "respirando" com ilustração bonita é o cassino tentando te distrair. [A confirmar com João] se haverá uma exceção pontual para superfícies de marketing/landing fora do produto (onde alguma ilustração sóbria poderia caber) — dentro do produto, ausência é a regra.

---

## 7. Conexão com o posicionamento (por que isso tudo)

Cada decisão desta seção rastreia a um achado do [panorama-concorrentes](../../research/panorama-concorrentes.md):

- O mercado BR é **afiliado opaco + "IA" sem método + hype** → a marca é o **anti-hype sóbrio** (logo discreto, sem emoji, sem glow, sem exclamação).
- Concorrentes vendem **"90% de acerto"** sem calibração → a voz fala **probabilidade + risco + CLV**, e o número em mono é a prova.
- Ninguém mostra **perdas** → o tom **mostra a perda** e o card "sem valor" recomenda **não apostar**.
- Regulação ([Lei 14.790/COMP-001](../../features/conformidade/COMP-001-conformidade-jogo-responsavel.md)) **proíbe** linguagem de renda → a marca já nasce falando risco, então **compliance e identidade são a mesma decisão** (a jogada dupla da [tese §2](../../tese-produto.md)).

A sobriedade não é estilo — é a estratégia competitiva tornada visível.
