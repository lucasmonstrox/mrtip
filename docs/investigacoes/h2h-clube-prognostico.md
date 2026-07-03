# H2H clube × clube no prognóstico (W-055 → MOD-006)

> Investigação de 2026-07-02 (`/rs W-055`). Tier: lookup+ (arqueologia interna + 1 verificação viva de API). Origem: wishlist W-055 ("coloca aí na seção de h2h nos prognósticos, como foi a última partida deles, etc.").

## TL;DR + recomendação

**Construir o bloco de H2H 100% do banco, dentro do `prognosis-prompt.ts` (PARTE 2), sem tocar na API da SportMonks.** A sonda viva (2026-07-02) provou que o endpoint `fixtures/head-to-head` devolve exatamente as 2 seasons que **já estão ingeridas** (PL 25/26 **e 24/25 completa**, 380+380 jogos com resultado) — a API não adiciona nada hoje. A amostra real do H2H é **~4-5 confrontos ricos** (2 da PL 25/26 + 2 da PL 24/25 + eventual cruzamento de copa), não os 1-2 que a wishlist assumia. O bloco reusa o formato de linha do `contextoUltimos5` (HT, arco do jogo, SoT, mando) e, por entrar entre os marcadores `## Contexto`…`**PARTE 3`, **flui automaticamente pro super prompt** — uma edição cobre as duas superfícies. Esforço P confirmado; faceta `ia` pura no MVP.

## Contexto e problema

O prognóstico lê a forma de cada time isoladamente, mas nunca o que aconteceu quando os dois se encontraram. O pedido: seção de H2H no prompt do prognóstico e no super prompt, com destaque pro **último confronto** — placar, autores, HT, mando, SoT ("o como foi, não só o resultado").

**Brief:** (1) existe H2H hoje no código? (2) o último confronto é derivável do banco sem migração? (3) o endpoint H2H da SportMonks destrava multi-season? (4) requisitos implícitos: PT nos rótulos/inglês nos campos, evidência auditável, quant-first (fato mastigado pro LLM, nunca pedir número), anti-vazamento por CUTOFF.

## Estado real no código

| Achado | Tipo | Âncora | Label |
|---|---|---|---|
| Nenhuma leitura de H2H em `apps/api` (zero hits pra `h2h/head_to_head`) | ausência | grep desta sessão em `apps/` | lido-no-código |
| Aba "H2H" **fantasma** na UI — trigger existe, conteúdo é placeholder "Confrontos diretos em breve." | fantasma | `apps/web/features/leagues/components/match-detail/match-detail.tsx:160,196-198` | lido-no-código |
| Pipeline do prompt: CUTOFF = `match.date`, escopo por `seasonId` (LIG-008) — `played` só tem a season do jogo | real | `apps/api/scripts/prognosis-prompt.ts:38-43,59-63` | lido-no-código |
| `teamMatches(id)` / `goalsFor/Against` — helpers de jogo por time sobre `played` | real | `prognosis-prompt.ts:66-69` | lido-no-código |
| Copas carregadas cross-season (`cupPlayed`, escopo por time + janela) — um H2H de copa entre os 2 já está em memória | real | `prognosis-prompt.ts:76-89` | lido-no-código |
| `contextoUltimos5` monta a linha "como foi": HT (`:1154-1155`), **arco nomeado** virada/cedeu (`:1158-1167`), SoT (`:1168`), posse por tempo (`:1170-1171`), status do adversário — o template pronto pro bloco H2H | real | `prognosis-prompt.ts:1132-1177` | lido-no-código |
| SoT por (match, team) vem de `lineup_player` somado (`statRows`), não de `match_team_stats` | real | `prognosis-prompt.ts:94-112` | lido-no-código |
| **Super prompt reusa o `prompt_text` persistido**: fatia `## Contexto` → `**PARTE 3` do `match_prognosis` — bloco novo na PARTE 2 entra de graça no super | real | `apps/api/scripts/super-prognosis.ts:380-385` | lido-no-código |
| Gols com autor por partida já são consultados pelos dois scripts (`goal ⋈ player`) | real | `super-prognosis.ts:387-396`; `prognosis-prompt.ts:17` (import de `goal`/`player`) | lido-no-código |

### Estado real nos DADOS (queries de 2026-07-02, banco de dev)

| Fato | Evidência |
|---|---|
| **PL 24/25 (sm 23614) ingerida COMPLETA**: 380 jogos com resultado (2024-08-16→2025-05-25) | query `match ⋈ season` desta sessão |
| PL 25/26 (sm 25583): 380/380 com resultado (**season TERMINADA** — último jogo 2026-05-24) | idem |
| Copas: CARA 25654 (93 jogos) + FAC 25919 (871) com resultado | idem |
| Riqueza 24/25: gols em 364 partidas, lineups 380, HT 380 — **mas 0 `match_team_stats` e 0 `match_trend`** | query de riqueza desta sessão |
| **24/25 TEM SoT/minutos por jogador**: `lineup_player.shots_on_target` 2614 linhas (25/26: 2561) — SoT do H2H funciona nas duas seasons | query desta sessão |

## Refutado

- **"Só a season atual tem esses stats" (comentário em `prognosis-prompt.ts:92`)** — refutado pela query: a 24/25 tem SoT/KP/minutos em `lineup_player` na mesma ordem de grandeza da 25/26. O comentário está stale.
- **"Amostra na janela ingerida = 1-2 jogos" (premissa da W-055)** — refutado: com a 24/25 ingerida, o H2H típico tem 4 jogos de PL + eventual copa.
- **"Só PL 25/26 ingerida" (memórias/notas de 2026-06/07)** — stale: a 24/25 está no banco (LIG-008/LIG-011).

## Estado da arte / mercado (verificação externa)

- **SportMonks tem o endpoint** `GET /v3/football/fixtures/head-to-head/{team1}/{team2}` com includes de `events`, `lineups`, `statistics`, `scores`, `periods`, `weatherReport` etc. — [docs](https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/fixtures/get-fixtures-by-head-to-head) `verificado-fetch, as-of 2026-07-02`.
- **Sonda viva no plano atual** (Arsenal sm 19 × Liverpool sm 8, key do repo): devolveu **4 fixtures, só seasons 25583+23614, só league 8**, janela 2024-10-27→2026-01-08 — ou seja, **o endpoint espelha a assinatura** (2 seasons de PL) e não devolve histórico de carreira nem os cruzamentos de copa. `verificado-fetch (chamada real), as-of 2026-07-02`.
- H2H é **paridade** de mercado (todo site de stats/casa mostra); o diferencial defensável do mrtip é o *detalhe auditável* do último confronto dentro do prognóstico (HT/arco/SoT/autores citáveis pelo modelo), alinhado à tese quant-first.

## Opções

| Opção | Prós | Contras |
|---|---|---|
| **A. 100% banco (recomendada)** | zero dependência nova; 4-5 jogos ricos; copas incluídas; anti-leak pelo CUTOFF já existente | retrospecto limitado a 2 seasons |
| B. Endpoint H2H da SportMonks | — | provado que devolve o MESMO recorte já ingerido; adiciona rede/latência/custo à toa |
| C. Fonte externa (transfermarkt etc.) pra retrospecto longo | série histórica | fora do escopo do pedido; barreira já mapeada nas W-002/W-053 |

**Recomendação: A.** B só volta a valer se a assinatura ganhar seasons históricas.

## Desenho proposto (pro `/pl`)

1. **Query H2H própria** (a `played` é season-scoped): jogos com resultado onde `{home,away} = {A,B}`, `leagueCode = 'PL'` nas 2 seasons **+ `cupPlayed`** filtrado pro par, tudo `date < CUTOFF`, ordenado desc.
2. **Bloco `### H2H — confronto direto` na PARTE 2** (entre `## Contexto` e `**PARTE 3`, pra herdar no super prompt): retrospecto compacto (V-E-D na janela, na ótica do mandante atual) + **último confronto em destaque** no formato do `contextoUltimos5` (res + placar + HT + arco + SoT + mando + 🏆 se copa) **+ autores dos gols** (`goal ⋈ player`, `type != 'own'`) + **data por extenso** (o modelo pesa a idade do precedente).
3. **Degradação honesta**: 24/25 sem posse/trends (não renderizar), rótulo "N confrontos na janela (2 seasons)"; promovido/rebaixado pode ter 0 H2H → "sem confronto na janela".

## Riscos e gotchas

- **Anti-vazamento**: tudo `date < CUTOFF` — um H2H da mesma season pode ser jogo FUTURO ao cutoff do backtest.
- **Contexto mudou**: técnico/elenco de 2024 ≠ hoje — citar data e mando (o jogo do turno foi na casa do outro); instrução pro modelo pesar, não cravar.
- **Doutrina quant-first**: o bloco é evidência textual; proibido pedir ao LLM converter H2H em número (Lei 14.790: leitura, nunca promessa).
- **Volume no prompt**: limitar a ~5 confrontos, 1 linha cada + destaque só no último.
- **Super prompt depende de `match_prognosis.prompt_text` re-gerado** (`super-prognosis.ts:380`) — rodar o pipeline vivo antes do super pra propagar o bloco.

## Perguntas abertas

- A UI (aba H2H fantasma, `match-detail.tsx:196`) entra quando? Fica registrada como faceta `ui: ideia` na MOD-006 — endpoint `GET /matches/:id/h2h` seria irmão do `get-scorers`.
- O comentário stale de `prognosis-prompt.ts:92` merece correção junto do `/i`.
- Retrospecto de carreira (opção C) segue barrado pela assinatura — reavaliar se LIG-011 ingerir mais seasons.
