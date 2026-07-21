# Segmentos de jogadores e alertas — notas de desenho

> **Não é um `/rs`.** É o registro de uma conversa de arquitetura (2026-07-20) entre o João e o Claude,
> parada no meio de propósito: várias decisões fechadas, várias em aberto. O valor aqui são os
> **fatos verificados** (consultas rodadas no banco, docs da SportMonks e da Cloudflare conferidos) —
> o resto é raciocínio que pode mudar.
>
> Status: **em aberto** · Sem ID de feature ainda · Não implementar a partir daqui sem fechar §4.

---

## 1. O que é a ideia

Deixar o usuário **definir um segmento de jogadores por métrica** — sem precisar nomear ninguém — e
depois receber alerta sobre quem cai nesse segmento. Exemplo canônico do João:

> *"quero filtrar por ranking do top 3 marcador do time que está desfalcado"*

O ponto de partida importante: **o segmento é útil sozinho, sem alerta e sem login.** Ele é um
*screener* da liga ("quem está produzindo"). O alerta é uma camada em cima: rodar o screener de
tempos em tempos e avisar quem entrou.

Correção de enquadramento feita durante a conversa: a `/alertas` **já existe** como rota e item do
rail (`apps/web/shared/app-shell/nav.ts:44`, `apps/web/app/(app)/alertas/page.tsx`), com a copy do
stub já nomeando gatilhos — inclusive "início de jogo". Não é ideia solta; é uma tela vazia
esperando conteúdo. Foi **criada de propósito** no commit `b611e92` (2026-06-28), a mesma faxina que
**removeu** os stubs de `assistente`, `configuracoes` e `leagues` — ou seja, na leva em que stubs
estavam sendo apagados, esse foi adicionado.

---

## 2. Fatos verificados (a parte que não se perde)

### 2.1 Métricas por jogador — o que existe no banco

Consulta rodada em 2026-07-20 sobre `lineup_player` na PL 25/26 (season corrente):

| Campo | Linhas não-nulas |
|---|---|
| total de linhas | 15.179 |
| `minutes_played` | 11.487 |
| `rating` | 11.061 |
| `key_passes` | 4.481 |
| `chances_created` | 3.961 |
| `shots_on_target` | 2.561 |
| `big_chances_created` | 1.187 |

As ~3.700 linhas sem `minutes_played` são relacionados que não entraram — dá pra separar quem jogou
de quem ficou no banco. `null` da SportMonks = 0 (não criou), não "dado faltando" — convenção já
estabelecida no LIG-001 (P8).

**Assimetria de fonte que estrutura o desenho:** gols e assistências **não** estão no
`lineup_player` — vêm da tabela `goal` (`playerId`, `assistId`, `type != 'own'`). Volume e criação
vêm do `lineup_player`. Todo segmento é um casamento de duas fontes.

**Não temos quilometragem/tracking físico** — é a [[W-049]], depende de fonte externa. O mais perto
é `minutes_played` (tempo, não intensidade).

### 2.2 Frequência do caso canônico — "top-3 marcador desfalcado"

Pergunta do João: *isso é caso raro?* Consulta rodada na PL 25/26:

| | |
|---|---|
| partidas na season | 380 |
| desfalques (total) | 3.334 |
| desfalques que eram top-3 marcador do próprio time | 185 |
| **partidas com ≥1 top-3 marcador fora** | **147 (39%)** |

**Não é raro — 2 em cada 5 jogos.** Justifica focar aí.

### 2.3 Escalação: quando sai (SportMonks)

- **Escalação confirmada: ~1 hora antes do kickoff.**
- `predictedLineups` — grátis, automática, é estimativa; substituída quando a oficial sai.
- `expectedLineups` — add-on **pago**, curada por humano, sai horas antes.
- Flag pronto: `metadata.lineup_confirmed` (`false` = previsão · `true` = oficial).
- `/fixtures/latest` devolve **todas** as partidas mudadas numa chamada — 1 request por ciclo,
  não 1 por jogo. Importa porque o rate limit é **por entidade/hora** (Starter 2.000 · Growth 2.500
  · Pro 3.000 · Enterprise 5.000) e os jogos da PL saem todos no mesmo horário.
- Docs recomendam poll de 5–8s, **mas isso é pra jogo ao vivo**. Pra pegar escalação, 1 min sobra.

> **Consequência de produto:** o alerta de desfalque *de verdade* ("não está na escalação", não
> "está na lista de lesionados") só é possível na janela de ~1h antes. Antes disso é previsão, e o
> alerta tem que dizer isso.

### 2.4 Cloudflare — o que a infra permite

- **Cron Trigger:** `triggers.crons` no `wrangler.jsonc` + handler `scheduled()`. Roda em **UTC**.
  Granularidade mínima **1 minuto**. Limite **por conta**: 5 no Free, 250 no Paid. `controller.cron`
  distingue qual schedule disparou.
- **Workflows:** `step.do()` é durável (não re-executa passo concluído em retry); retry padrão 5×
  com backoff exponencial. **`step.sleep()` aceita até 30 dias** — é o que viabiliza "acordar em
  relação ao kickoff" sem polling. Workflows já aceitam cron direto no binding (`schedules`), máx
  100/conta.
- Hoje o `apps/api/wrangler.jsonc` **não tem** `triggers.crons` — nenhum agendador existe; os
  `sync-*.ts` são scripts manuais.
- Sub-minuto (se um dia precisar de ao vivo) → alarm de Durable Object, não cron.

### 2.5 Auth — onde está de verdade

Mais adiantado do que os docs velhos sugerem (a investigação do Clerk dizia "API adiada"; não é
mais o caso):

- Web e API **ambas gateadas**. O Eden injeta `Authorization: Bearer` em todo request
  (`apps/web/shared/api/eden.ts`), e o guard global da API rejeita quem não tem
  (`apps/api/src/auth/guard.ts`).
- **Furo pequeno e concreto:** o guard faz `await verifier.verify(token)` e **descarta o resultado**
  (`guard.ts:47`). A API sabe que *alguém* logado chamou, mas nenhum handler sabe **quem**. Pra
  persistir por usuário, o guard precisa expor o `sub` no contexto. Poucas linhas.
- **Não existe tabela de usuários** (o schema tem 21 tabelas, todas de futebol). O `CORE-003`
  declara `tabelas: []` e a faceta `dados` como *ideia*.

---

## 3. O que ficou decidido

- **Ranking de marcador** como métrica base do primeiro corte; filtro por liga; UI com select/input.
  Conversão de texto livre em segmento → [[W-068]], explicitamente **não é pra agora**.
- **Identidade e métrica são o mesmo objeto.** "Jogador específico" é só um segmento com um nome no
  campo de identidade. Não são duas features. Combinação: **E** entre identidade e métrica; **OU**
  só dentro de cada lado.
- **`user_id`** (o `sub` do Clerk), sem prefixo `clerk_`. **Sem tabela de usuários por ora** — o
  Clerk é o dono da identidade; cópia local exige webhook pra não desatualizar. Criar quando houver
  dado que o Clerk não guarda (plano BRL, preferências) ou necessidade de FK/admin.
- **`criteria` como `jsonb`**, não colunas — o vocabulário vai crescer e cada critério novo seria uma
  migração. Precedente no repo: `match_prognosis` guarda `oneXTwo`/`xgHomeBands` assim.
- **Performance saiu de cena**: são poucos usuários por ora, roda por usuário mesmo. (O João testou
  o raciocínio com uma premissa falsa de escala; a resposta registrada, caso volte a valer, é
  *inverter o loop* — calcular as métricas dos ~500 jogadores **uma vez** e casar os segmentos contra
  esse resultado, agrupando por critério idêntico, em vez de rodar uma agregação por segmento.)
- **Levantado (não decidido):** existe uma distinção entre gatilho de **relógio** (alertar X horas
  antes) e gatilho de **evento** (alertar quando a escalação sair, seja lá que horas for). A
  observação é sólida — o desenho dos "dois momentos" em cima dela **não foi confirmado**. Ver §4.2.

### 3.1 Rascunho do `criteria` (não fechado)

```json
{
  "identity": { "league": "PL", "team": null, "position": null, "player": null },
  "metric":   { "name": "goals", "mode": "ranking", "value": 3, "scope": "team" },
  "gate":     { "minutes": 270 },
  "context":  { "sidelined": true }
}
```

- `metric.mode`: `ranking` (top N) · `threshold` (≥ X por 90).
- **`metric.scope` é o campo que quase passou batido**: `team` = top 3 de *cada* time (o exemplo
  canônico do João) · `league` = top N da liga inteira. Sem ele, o exemplo que motivou a feature não
  é expressável.
- `gate.minutes` (default sugerido 270 ≈ 3 jogos): sem piso, reserva com 1 pênalti em 90 min lidera
  qualquer ranking por 90.
- Reservado, aceito pelo schema mas ignorado no MVP: `window` (season vs últimos N), `penalties`
  (contar ou não), resto de `context`.

### 3.2 Tabela

```
segment
  id
  user_id      ← sub do Clerk
  name         ← "meus artilheiros"
  criteria     ← jsonb
  created_at
```

---

## 4. O que ficou EM ABERTO (a razão de parar)

O João encerrou com *"ainda tenho muitas dúvidas"*. As que ficaram explícitas:

1. **`context.sidelined` pertence ao `criteria`?** "Estar desfalcado" é estado de hoje, não produção
   do jogador — misturado, o objeto faz duas coisas (ranqueia **e** filtra estado). Funciona, mas se
   crescer ("voltou de lesão", "joga fora de casa"), `context` vira saco de condições soltas.
   **Não decidido.**
2. **O tempo do alerta de preparação** — 24h dá tempo de estudar mas a escalação não saiu; 1h tem a
   escalação mas não tem tempo. A recomendação registrada (dois momentos separados) foi apresentada
   e **não confirmada** pelo João.
3. **Janela da métrica** — season inteira vs últimos Y jogos, e se "últimos Y" é do jogador ou do
   time. Levantado, não fechado.
4. **Pênalti conta como gol?** Levantado, não fechado.
5. **Limiar cru vs percentil da liga.** Levantado, não fechado.
6. **Onde o screener aparece na UI** — tela própria (`/alertas`?) ou filtro em cima de algo que já
   existe. Nem discutido.
7. **Plano do Workers (Free vs Paid)** — não respondido; decide se 5 cron triggers por conta é
   apertado.

---

## 5. Fronteiras que valem lembrar

- **Não plumbar o corte "as-of kickoff" no MVP.** Métrica é sempre retrospectiva; a disciplina de
  cortar a janela na data do jogo (pra não vazar o resultado) pertence ao caminho de *avaliar uma
  partida*, não ao screener "quem está produzindo agora". Quando o segmento alimentar prognóstico,
  aí sim — o `prognosis-prompt.ts` já trabalha com `CUTOFF` e a investigação do sinal
  jogador↔treinador crava a regra.
- **"Quente" não é edge.** Sequência de gols é o dado mais público que existe; a casa já precificou.
  O segmento serve pra **triagem** (500 jogadores → 12 que valem olhar), não pra decidir aposta. O
  valor real aparece no cruzamento com **role-change** (virou batedor de pênalti, subiu pra
  referência por lesão do titular) — aí a métrica retrospectiva *subestima* o jogador.
  Ver `docs/mercados/jogadores-props.md`.
- **Guardrail de compliance:** `docs/ui/design-system/conformidade-jogo-responsavel.md` §6.1 (linha
  230) proíbe push de urgência; §6.2 proíbe apresentar sequência como se aumentasse a chance da
  próxima (falácia do apostador). O alerta é informativo, nunca gatilho de aposta.

---

## 6. Próximos passos sugeridos

1. Fechar as dúvidas da §4 — principalmente a 1 e a 2, que mexem no formato do `criteria`.
2. Só então criar a feature em `docs/features/` (módulo provável: `core` ou um novo `alertas`) e
   seguir pro `/pl`.
3. A atualização pré-jogo (poll de `/fixtures/latest` até `lineup_confirmed`) é **feature separada**
   e pré-requisito do alerta de desfalque real — vale ID próprio.

## Relacionados

[[W-068]] (texto → segmento) · [[W-029]] (alerta de desfalque, com o construtor de perfil) ·
[[W-031]] (X gols/assists em Y jogos) · [[W-032]] (alerta por xG do prognóstico) ·
[[W-020]] (movimento de odds) · [[W-067]] (entrega por mensageria) · `CORE-003` (auth) ·
`SIN-011` (lesões) · `LIG-001` (página do jogador, `getPlayerDetail`)
