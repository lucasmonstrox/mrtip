---
name: wl
description: Wishlist/favoritos de ideias futuras — captura, enriquece e organiza coisas que o João quer implementar um dia em docs/wishlist.md. Use quando ele jogar uma ideia ("seria legal ter…", "anota aí que um dia quero…", "/wl <ideia>"), pedir pra ver/mexer na wishlist, ou promover uma ideia a feature.
argument-hint: <ideia livre> | list | <W-ID> [edição] | done <W-ID> | drop <W-ID> | promote <W-ID>
---

A wishlist é o **inbox cru de ideias** do mrtip, antes de virarem feature rastreada. O documento vive em `docs/wishlist.md` (um arquivo só, curado à mão por esta skill). Entrada: `$ARGUMENTS`.

**Princípio de altitude:** wishlist é desejo, não compromisso. NÃO é o registro oficial — `docs/features/` continua sendo a fonte única de status do projeto. Aqui não tem build, ID de commit, nem teste. Não duplique a máquina de features; faça a ponte pra ela quando a ideia amadurecer.

## 0. Roteie o modo (primeira coisa, sem gastar token à toa)

Leia `$ARGUMENTS` e decida o modo. Na dúvida entre "adicionar" e outra coisa, **adicionar é o default** — capturar é o ato mais comum e o mais barato de errar.

| Sinal em `$ARGUMENTS` | Modo | Seção |
|---|---|---|
| texto livre descrevendo um desejo (default) | **add** | §1 |
| `list`, `ver`, vazio, ou pergunta sobre a wishlist | **list** | §2 |
| começa com um `W-NNN` existente + texto | **edit** | §3 |
| `done <W-ID>`, `feito`, `implementei` | **done** | §3 |
| `drop <W-ID>`, `descarta`, `não quero mais` | **drop** | §3 |
| `promote <W-ID>`, "vira feature", "bora fazer" | **promote** | §4 |

Sempre comece lendo `docs/wishlist.md` inteiro (é pequeno) — você precisa do estado atual e do maior `W-NNN` usado pra qualquer modo que escreva.

## 1. Add — capturar e ENRIQUECER (o coração da skill)

O valor não é anexar uma linha; é transformar um desejo solto numa entrada que o João-do-futuro entende sem contexto. Capture rápido, mas enriqueça.

1. **Resolva duplicata primeiro.** Antes de escrever, `Grep` o tema na wishlist E uma busca rápida em `docs/features/INDEX.md`. Se já existe entrada parecida → **não crie duplicata**: enriqueça a existente (modo edit) e diga isso. Se já é feature → avise ("isso já é `XXX-000`, status Y") e pergunte se ainda quer anotar algo à parte.
2. **Enriqueça inferindo, não interrogando.** Da ideia + do que você sabe do repo (CLAUDE.md, tese, modelagem), preencha você mesmo: `faceta`, `esforço` (palpite grosseiro), conexão com features/âncoras existentes, pré-requisitos óbvios. Arqueologia rasa só se barata: 1 `codebase_search` quando a ideia encosta em código existente e muda o palpite de esforço. Não faça investigação completa — isso é trabalho do `/rs`.
3. **Pergunte no máximo 1 coisa, só se mudar o rumo** (AskUserQuestion, multiple choice): tipicamente o **desejo** (🔥/✨/💤) quando ambíguo, ou um escopo que bifurca a ideia em duas. Nunca metralhe perguntas — é wishlist, tem que ser leve.
4. **Escreva a entrada** com o template abaixo, sob o bucket de desejo certo. ID = maior `W-NNN` existente + 1 (números nunca se reusam, mesmo de entradas arquivadas). Data = **data real de hoje** (absoluta, nunca "hoje"/"ontem" — converta).
5. **Confirme em 1 linha** o que entrou e onde, e ofereça o próximo passo natural (`/rs W-NNN` pra investigar, ou `/wl promote` quando quiser fazer).

### Template de entrada

```markdown
### W-NNN · <título curto e concreto> · 🔥|✨|💤 · esforço P|M|G|❓ · `faceta`
<adicionada: AAAA-MM-DD · status: ideia>

**O quê:** 1-2 frases do que é, em linguagem natural com os termos de domínio (over/under, xG, λ, desfalque, dossiê…). Concreto > vago.

**Por quê:** a dor ou a oportunidade. Por que vale a pena um dia. (Conversa com a tese? paridade de mercado ou diferencial?)

**Inspiração:** origem da ideia — link/concorrente/print/conversa. (omita se não houver)

**Depende de / esbarra em:** pré-requisitos e features que ela toca (`XXX-000`, tabela, setting). (omita se nada óbvio)

**Notas:** rabiscos, alternativas, dúvidas em aberto. (cresce com o tempo)
```

Campos vazios: omita a linha inteira em vez de deixar "N/A". A entrada deve respirar.

## 2. List — mostrar o estado

- Sem filtro: renderize a wishlist agrupada por desejo (🔥 → ✨ → 💤), uma linha por entrada (`W-NNN · título · esforço · faceta · status`). Arquivadas só se pedirem.
- Com filtro implícito no pedido ("o que tem de IA?", "o que tá pronto pra fazer?"): filtre por faceta/status/desejo e mostre só o recorte.
- Pergunta de recomendação ("o que eu faço primeiro?"): ordene por (desejo desc, esforço asc) e sugira 1-2 candidatos com 1 frase de porquê — quick wins (🔥 + P) primeiro. Recomende, não faça um relatório.

## 3. Edit / Done / Drop — mexer numa entrada

- **edit**: encontre o `W-NNN`, aplique a mudança (novo desejo, esforço revisado, nota nova, retítulo). Acumule notas — não apague histórico de raciocínio sem motivo. Toda edição que muda status carimba a data.
- **done**: mude `status: feito`, mova pra **🗄️ Arquivadas** com `feito: AAAA-MM-DD`. Se foi implementado como feature, anote o `XXX-000`. Não delete — arquivar preserva a memória do "por que isso existe".
- **drop**: mude `status: descartado`, mova pra **🗄️ Arquivadas** com `descartado: AAAA-MM-DD` + 1 frase do motivo (decisão arquivada vale tanto quanto ideia viva — evita re-propor o mesmo daqui a 3 meses). Confirme antes se a entrada tinha conteúdo substancial.

## 4. Promote — wishlist → feature rastreada (a ponte)

Quando uma ideia deixa de ser desejo e vira trabalho de verdade, ela sai da wishlist e entra no pipeline oficial. Não recrie a máquina de features aqui — **delegue**:

1. Confirme com o João que é pra promover (promover é decisão dele, não sua).
2. Decida o handoff certo e diga qual vai usar:
   - ideia ainda nebulosa / "isso existe? como o mercado faz?" → **`/rs`** (investigação) com o conteúdo da entrada como brief.
   - ideia clara, só falta planejar a codificação → cria a feature a partir de `docs/features/_template.md` no módulo certo (próximo número do prefixo, confira no `INDEX.md`) e segue pro **`/pl`**.
3. Carregue **tudo** que a entrada acumulou (o quê, por quê, inspiração, dependências, notas) pro brief — esse é o pagamento de ter enriquecido na captura.
4. Na wishlist: `status: promovido`, mova pra **🗄️ Arquivadas** com `promovido: AAAA-MM-DD → XXX-000`. O elo wishlist↔feature fica registrado dos dois lados.

## Regras transversais

- **Português na escrita visível, termos de domínio embutidos** (mesma regra de comentários de busca do CLAUDE.md): título e "o quê" carregam over/under, xG, λ, desfalque… — é o que torna a entrada achável depois.
- **Datas absolutas sempre.** Converta "semana que vem", "um dia desses" pra data real. Nunca grave relativo.
- **Uma ideia, uma entrada.** Pedido com 3 desejos distintos → 3 entradas. Não amontoe.
- **Não invente prioridade do João.** Desejo (🔥/✨/💤) é leitura dele; na dúvida, pergunte (1 vez) ou marque 💤 e diga que assumiu o conservador.
- **Leve por default.** Esta skill existe pra reduzir atrito de capturar ideia. Se você está fazendo investigação pesada aqui, parou de ser wishlist — chame `/rs`.
