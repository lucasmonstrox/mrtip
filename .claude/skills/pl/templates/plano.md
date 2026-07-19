# Template da seção `## Plano` (vai no arquivo da feature, entre Tarefas e Evidências)

Preencha exatamente este shape — o `/i` parseia os subtítulos e o formato dos passos. Data = dia de hoje.

```markdown
## Plano (AAAA-MM-DD)

Dossiê: [docs/planos/<ID>-<slug>.md](../../planos/<ID>-<slug>.md)
<Se houve bloqueio de depende_de tratado por design: "bloqueio de <ID> tratado via P0 (stub)".>

### Objetivo, aceite e non-goals

<1-2 linhas do que "pronto" significa.>
Non-goals: <o que NÃO entra, declarado cedo pra ninguém gold-platear.>
Aceite (cada critério aponta a Prova que o cobre):
- A1 [ia] quando <evento>, o assistente <comportamento observável, sempre com o porquê + fontes> → coberto por P4
- A2 [ui] quando <evento>, observo <Z> no Chrome → coberto por P6

### Premissas

<Suposições verificadas no mapeamento: "settings.X tem shape Y", "tool Z existe em <path>".
Se uma premissa cair durante o /i: PARAR, atualizar este Plano com a divergência datada, nunca forçar o passo original.>

### Decisões

- D1: <decisão> — driver: <restrição que decidiu>; descartado: <alternativa real> porque <1 linha>; pagamos: <consequência negativa aceita>
- Adiadas de propósito pro /i (não é esquecimento): <nomes exatos, micro-estrutura, copy>

### Passos

**P1 [dados+api] esqueleto** — `apps/api/src/modules/<módulo>/<verbo>-<substantivo>/`, rota registrada em `app.ts`: <o que muda — intenção (criar/alterar/reusar), não código>. Regras: <texto condensado das regras de estrutura do CLAUDE.md que ESTE passo toca — pasta-por-endpoint / routes fino / TypeBox no Elysia / `type` não `interface` / centavos / fuso pinado — colado, não linkado>. Don't: <lista dos erros concretos que a função inserida NÃO deve cometer — efeitos colaterais proibidos, responsabilidades de outros símbolos, atalhos que violam convenção, casos que ela não trata de propósito; texto colado, nunca só link de regra>. Prova: `<comando literal>` → <saída esperada>.
**P2 [ia] (depende: P1)** — motor quant/LLM do assistente: <...>. Falha provável: <gotcha conhecido da área + correção em 1 linha>. Prova: `<comando>` → <saída>.
**P3 [ui] [PENDENTE-DONO: <pergunta>]** — `apps/web/...`: <o /i pula este passo até a resposta; os demais seguem>.

### Verificação final

<Entradas FUTURAS do campo `testes:`, com nomes reais — não categorias. Cobre TODA faceta tocada nas camadas aplicáveis (ver SKILL §5 "Testes em camadas"):>
- `bun run typecheck` limpo (raiz)
- **API/dados** (se tocou `dados`/`api`): script bun ad-hoc / `fetch` contra o dev server em `<path real>` → N/N — casos: <happy, borda, erro>; assert direto no banco quando o efeito não aparece no HTTP. (Não existe runner de unidade no repo — não invente `bun test`.)
- **Browser real (chrome-devtools MCP)** (se tocou `ui` — teste PRIMÁRIO): roteiro completo no dossiê §Testes (escada: erros/validação → variantes/bordas → golden path por último), cada cenário com passos + assert observável; fechamento com `list_console_messages` sem erro novo e `list_network_requests` sem falha. Referencie: "roteiro: dossiê §Testes, cenários T1..Tn". MCP não atacha → declare, não afirme que funciona.
- **E2E Playwright complementar** (se tocou `ui` e o fluxo justificar): `cd apps/web && bun run test:e2e` (specs em `apps/web/e2e/`, dev :3211) → N/N — specs: <nomes>; login exige `.env.e2e`, sem as chaves dá skip (declare em vez de contar como verde).
- re-teste da lista do `features impact` + callers do `codebase_impact`
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra os critérios A1..An — reporta só gap de requisito/correção (não estilo); diff fora dos paths deste plano = achado

### Pré-mortem e rollback

3 semanas depois do merge, quebrou. Causas mais prováveis (ranqueadas, seedadas nos gotchas do repo — fuso `America/Sao_Paulo`, centavos, calibração das probabilidades, fonte de dados fora do ar/mudou de contrato, re-seed):
- C1: <causa> — sintoma que o dono veria: <X>; mitigação: <vira passo ou item da Verificação>
Rollback por classe: comportamento do assistente/pick → toggle `settings.<chave>` (default seguro: <Y>; **pick é registrado antes do jogo e é imutável — revert não apaga o que já entrou no histórico de acerto**); ui/api pura → `git revert` basta; schema → por fase (expand reverte com drop; pós-migrate não).
O rollback NÃO desfaz: <picks já publicados, registros de histórico gravados, cobranças de assinatura>.

### Fora de escopo

- <item> → criar `docs/features/<modulo>/<ID-novo>-<slug>.md` (status: ideia, depende_de: [<este ID>]) com 1 linha de critério
```

**Plano-mini** (mudança trivial — ver gate de proporcionalidade): só `### Objetivo, aceite e non-goals` + `### Passos` (1-3, com Prova) + `### Verificação final`; sem dossiê.
