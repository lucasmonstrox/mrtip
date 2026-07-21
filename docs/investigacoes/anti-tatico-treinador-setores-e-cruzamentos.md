# Anti-tático, treinador, setores e cruzamentos além do matchup A×B

> As-of: **2026-07-20**.
> Método: fan-out de 6 frentes web em Sonnet (F1-treinador-antitático, F2-apostador-tática, F3-métodos-além-do-cruzamento, F4-setor-ofensivo-defensivo, F5-faixas-15min, F6-treinador-entidade) + refutação adversarial por frente (contra-verificação com fetch independente, teste de confound, teste de amostra, teste de fonte proibida) + síntese em 3 eixos (didático, métodos/pipeline, viabilidade).
> **Cobertura da pesquisa:** 31 perguntas disparadas, **28 respondidas**. Três se perderam (1 falha dura de schema, 2 devolveram placeholder) e ficam como lacuna conhecida: (a) *"o plano de jogo é montado contra a formação nominal ou contra os padrões do adversário?"* — a mais substantiva das três, vale re-rodar; (b) *"existe registro mensurável de 'treinador X sempre faz Y contra bloco baixo'?"*; (c) *"histórico pessoal treinador-X-vs-treinador-Y prevê algo além da força dos times?"*. As duas últimas eram as pré-marcadas como prováveis NEI antes de rodar — a ausência delas não muda nenhuma conclusão; a primeira é um buraco real.
> Rótulos de confiança herdados do protocolo e preservados na síntese: `verificado-fetch` (página aberta de fato, nesta pesquisa ou na refutação) · `snippet` (só resultado de busca) · `consenso` (consenso qualitativo de domínio, sem fetch) · `inferência` (dedução própria) · `NEI` (não encontrado — resposta honesta, não buraco de busca).
> **Estende e não re-deriva** [sinal-formacao-tatica.md](./sinal-formacao-tatica.md) (SIN-014: formação é EXPLICAR, efeito causal pequeno ~0,11-0,18 gol, n≈22k) e [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md) (refutação-mãe: matchup de estilo/tática não adiciona edge pré-jogo além do mercado). Obedece [taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) (3 camadas ESTIMAR/EXPLICAR/VALIDAR + anti-dupla-contagem).

---

## TL;DR + recomendação cravada

> ⚠️ **Correção aplicada em 2026-07-20, após a síntese automática.** A primeira versão deste TL;DR afirmava que "cruzamento setorial foi testado e piorou o RPS". **Isso estava errado** e a correção muda a recomendação. O estudo citado (Robberechts & Davis) testa o **ODM — Offense-Defense Model**, que gera *dois escalares por time* a partir da matriz de gols. Não tem setor, não tem corredor, não tem papel tático, não tem jogador. A cadeia do erro: o agente de pesquisa rotulou ODM como "decomposição setorial" → o refutador não pegou → a síntese propagou. O que o estudo mostra é que **decompor o rating de um time em ataque/defesa não melhora previsão de V/E/D** — pergunta legítima, mas **diferente** da que foi feita. O texto abaixo já está corrigido.

**Nada nas seis frentes vira ESTIMAR *hoje* — mas por motivos diferentes, e a distinção importa.** O motor Poisson/Dixon-Coles com ataque-defesa por time inteiro, que o mrtip já usa, é a representação que a literatura endossa para a tarefa que ele cumpre (gerar distribuição de gols, que rating agregado tipo Elo não produz sozinho). Sobre **subir a granularidade**, há três situações que a versão anterior deste documento fundia numa só:

1. **Testado e sem ganho:** decompor o rating de time em ataque/defesa (ODM) somado a Elo — dois datasets grandes, RPS praticamente idêntico e levemente pior (0,1860→0,1878 e 0,2035→0,2045). Deltas de ~0,002 são "não ajuda", não "é ruim". `verificado-fetch`, força forte para o que testa.
2. **Nunca testado (NEI):** matchup por **setor/papel de verdade** — agregar métrica de jogador por corredor ou por papel e cruzar ataque de A × defesa de B. Busca sistemática não achou **nenhum** estudo isolando isso da força geral dos times. Isto é **território não estudado, não território refutado.** Não existe evidência a favor nem contra. Consequência: é a única linha desta pesquisa que continua **viva como hipótese** — e o mrtip tem a matéria-prima (66 colunas de `lineup_player`, `role` em ~55%). Mas vive como hipótese a testar out-of-sample contra o motor atual, **nunca** como feature assumida.
3. **Bloqueado por dado ausente:** embeddings de interação, grafos jogador-a-jogador e tracking espaço-temporal — o mrtip não tem nenhum par x,y de evento; onde havia claim de vantagem, a refutação o **derrubou**.

**Ação concreta de maior alavancagem e menor custo, prioridade #1: auditar se o motor de BANDS de 15 minutos já existente condiciona por estado de placar corrente.** F5 mostrou, com evidência repetida em desenhos diferentes, que o placar é o confound dominante de qualquer variação temporal de gols (time perdendo eleva a própria taxa de gol em 10%-53% dependendo da margem — Dixon & Robinson 1998, `verificado-fetch`). Sem essa auditoria, qualquer "esse time cai de produção no fim do jogo" exposto ao usuário corre risco concreto de estar reembalando efeito de placar como se fosse traço tático do time. Essa auditoria é pergunta de schema/código interna, não foi respondida nesta pesquisa, e deve vir **antes** de qualquer investimento novo nesta frente.

**Treinador como entidade: não priorizar ingestão motivada por edge quantitativo.** `coach` tem 0 linhas e `lineup.coach_name` está 0% preenchido por motivo estrutural confirmado na documentação oficial SportMonks (as entidades `Fixture`/`Lineup` nunca tiveram campo de treinador) — não é falha de sync, é ausência de campo na fonte. O caminho de ingestão via `coach.fixtures`/`coach.teams` está mapeado e é barato, mas a pesquisa causal converge para efeito de treinador nulo ou pequeno-e-condicionado-a-informação-só-conhecida-depois-do-fato (Lundkvist et al. 2026, n=331, IC cruzando zero em todas as janelas), somado ao argumento estrutural de que identidade/troca de treinador é pública com dias/semanas de antecedência — presumivelmente já precificada antes mesmo da escalação (que só sai ~1h antes). Se um dia entrar, é textura EXPLICAR de baixíssimo custo ("técnico há N jogos no cargo"), nunca input do modelo.

**Declarados mortos/bloqueados por falta de matéria-prima (não por falta de esforço de engenharia):** setor por corredor/zona/grid (nenhum provedor — Opta, StatsBomb, Wyscout — despacha "setor" nativo, todos guardam coordenada x,y que o mrtip não ingere); mudança de formação durante o jogo (`formations` é registro único sem timestamp, confirmado por fetch direto na doc oficial); rede de passes jogador-a-jogador (falta o evento com origem→destino, e mesmo com o dado a literatura é majoritariamente pós-hoc); matchup lateral×ponta isolado da força geral dos times (NEI puro — busca sistemática em StatsBomb Conference/Google Scholar/Semantic Scholar/OpenAlex não achou nenhum estudo); jogo aéreo → escanteio → gol de bola parada (falta xG, que está zerado no banco, e tracking, que nenhum provedor do plano atual entrega).

**O que sobra vira EXPLICAR barato e opcional, nunca ESTIMAR, e VALIDAR segue bloqueado por inteiro.** Narrativa de papel tático via as 66 colunas de `lineup_player` (dribbled_past, tackles_won_pct, duels_won_pct etc.) pode virar frase de contexto na aba Fatos — mas só com agregação estatística correta (soma antes de dividir, per-90 ponderado por minutos, shrinkage por amostra pequena) e com o caveat de que nenhuma dessas métricas de contagem é sinal individual limpo (todas confundidas por sistema/estilo do time, triangulado em 3 fontes independentes). VALIDAR (confronto com mercado) está bloqueado estruturalmente para qualquer sinal desta pesquisa, novo ou velho: o schema do mrtip não tem nenhuma tabela de odds/preço/mercado hoje — fato interno, verificado por busca direta no schema, independente do que a literatura externa mostrasse.

---

## Contexto e problema

Esta investigação é a continuação natural de [SIN-014](./sinal-formacao-tatica.md), que já havia cravado que **formação declarada** é EXPLICAR, não edge autônomo. O dono pediu para ir além da formação nominal e investigar tudo que fica "embaixo" ou "ao redor" dela: como um treinador de verdade monta um plano anti-tático (não só formação nominal, mas marcação individual, corredor, ligação entre jogadores); como um apostador profissional trata essa mesma informação; se existe algum método de cruzar dado tático melhor do que "ataque do time A vs. defesa do time B" (o próprio Dixon-Coles); se cruzar por setor ofensivo×defensivo (lateral vs. ponta, por exemplo) tem sinal; se a janela de 15 minutos que o motor de BANDS já usa pode ser cruzada com tática sem cair em confound; e se treinador merece virar entidade de dado própria no schema.

O desenho de pesquisa foi seis frentes paralelas (F1-F6), cada uma pesquisada e depois **atacada adversarialmente** — um segundo passe que reabriu fontes, testou amostra, testou confound de força de elenco e de placar, e aplicou a regra do projeto contra claim numérico de fonte fraca (blog de aposta, vendor de software, jornalismo com autosseleção). O resultado consolidado abaixo respeita integralmente os vereditos do refutador: nenhum claim marcado como derrubado foi reaproveitado como recomendação em nenhuma das três sínteses (didática, métodos, viabilidade) que compõem este documento.

Requisitos do repo que disciplinam a leitura: as 3 camadas ESTIMAR/EXPLICAR/VALIDAR e o princípio anti-dupla-contagem (`taxonomia-sinais.md`); a régua de que aposta precisa de evidência, não de narrativa bonita sem número atrás; e a regra de altitude — não re-decidir o que `docs/arquitetura/` já cravou.

---

## Estado real no código (fatos internos, não pesquisa externa)

- `lineup.formation`: 100% preenchido, 3.072 lineups (PL 1.520, Brasileirão 1.124, FA Cup 246, Carabao Cup 182).
- `lineup_player`: 66 colunas por jogador por jogo, incluindo `aerials_won`/`aerials_lost`/`aerials_won_pct`, `tackles_won_pct`, `duels_won_pct`, `dribbled_past`, `dribble_attempts`, `dribbles_successful`, `ball_recoveries`, `passes_final_third`, `errors_lead_to_shot`, `error_lead_to_goal`, `possession_lost`, `turnovers`, `clearances`, `long_balls_won`, `big_chances_created`, `chances_created`, `touches`, `rating`, `minutes_played`.
- `lineup_player.role` (papel tático por jogo, derivado de formação+grid+mando) e `.grid`: ~55% de cobertura — não é aleatório; a hipótese não verificada nesta pesquisa é que a lacuna se concentra no jogador que troca de função (suplente que entra), que é justamente o caso mais valioso para narrativa de matchup.
- `coach`: 0 linhas. `lineup.coach_name`: 0% preenchido. Confirmado por fetch direto na documentação oficial da SportMonks: as entidades `Fixture` e `Lineup` nunca tiveram campo de treinador (a taxonomia de `type_id` do Lineup só tem 11=titular/12=banco) — é ausência estrutural da fonte, não falha de sync ou backfill pendente.
- `match_team_stats.xg`: 0 preenchido. xG está bloqueado no plano SportMonks atual (fato já registrado no repo).
- O mrtip já tem um motor de faixas de 15 minutos (BANDS 0-15…76-90) com cruzamento de momentum. **Não verificado nesta pesquisa** (pergunta de schema/código, fora do escopo): se esse motor já condiciona por estado de placar corrente por faixa. É a auditoria de maior prioridade decorrente desta investigação.
- O schema do mrtip **não tem nenhuma tabela de odds/preço/mercado** — checado por busca direta no schema. Isso bloqueia estruturalmente qualquer etapa VALIDAR para qualquer sinal, novo ou antigo.

---

## Mapa rápido — matriz ESTIMAR / EXPLICAR / VALIDAR

Tabela-resumo para navegação; o detalhe de cada linha está nas seções "Claims atômicos por frente" abaixo.

| Sinal / decisão | Camada | Veredito | Detalhe |
|---|---|---|---|
| Motor Poisson/Dixon-Coles atual (ataque-defesa por time) | **ESTIMAR** (núcleo) | Manter — é a representação que a literatura endossa para gerar distribuição de gols | Parte 2 (a) |
| Decomposição ataque/defesa por time (ODM) somada a Elo | ESTIMAR testado | **Sem ganho** (RPS ~igual, levemente pior) em 2 datasets grandes — não vale subir por aqui | Parte 2 (a) linha 2 |
| **Matchup por setor/papel** (métrica de jogador agregada por corredor/função, A×B) | ESTIMAR **hipótese viva** | **NEI — nunca estudado.** Não refutado. Dado existe no mrtip. Testar out-of-sample antes de qualquer uso | Parte 2 (a) linha 2b |
| Rating agregado puro (Elo/pi-ratings) substituindo o motor | ESTIMAR testado | Vence em RPS de resultado, mas não gera distribuição de gols sozinho — não substituir | Parte 2 (a) |
| BANDS 15min sem condicionar por placar | ESTIMAR/EXPLICAR bloqueado | **Auditar primeiro** (prioridade #1) — sem isso, risco de reembalar score effect como tática | Parte 2 (c), Parte 3 (a.1) |
| Narrativa de papel tático (`lineup_player`, 66 colunas) | **EXPLICAR** | Construir com agregação correta (per-90, soma-antes-de-dividir, shrinkage); nunca mover o número | Parte 2 (b), Parte 3 (a.2/a.3) |
| Duelo aéreo/de chão (`duels_won_pct`, `aerials_won_pct`) bruto | EXPLICAR fraco | Fato correto, mas a versão com sinal real (ajustada por força do par) é irreconstruível com o dado do mrtip; provavelmente já precificada (pesquisa pública desde ~2018) | Parte 2 (b), Parte 3 (a.3) |
| Perfil temporal por time (BANDS) exposto ao usuário | EXPLICAR condicional | Só depois de estratificar por placar, excluir/marcar cartão vermelho, empilhar várias temporadas | Parte 2 (c) |
| Treinador como entidade (`coach.fixtures`/`coach.teams`) | EXPLICAR fraco, não priorizado | Ingestão barata, retorno baixo; nunca ESTIMAR | Parte 3 (b) |
| "Efeito novo treinador" (bounce) como sinal | **Morto** (ESTIMAR/VALIDAR) | Efeito nulo no estudo mais rigoroso (n=331, xP como contrafatual, IC cruza zero) | Parte 3 (b) |
| "Time X ataca mais pela esquerda" como traço fixo | **Morto** | Nem seria estável com o dado — varia por jogo/mando (r=0,956 correlaciona com desvio, não fixidez) | Parte 3 (a.4) |
| Setor por corredor/zona/grid (x,y de evento) | **Bloqueado** | Falta matéria-prima mínima — nenhum provedor despacha nativo, mrtip não tem par (x,y) | Parte 2 (b), Parte 3 (c) |
| Mudança de formação durante o jogo | **Morto** | `formations` é registro único sem timestamp (doc oficial SportMonks) | Parte 2 (d) Etapa 6, Parte 3 (c) |
| Rede de passes / matchup jogador-a-jogador | **Morto** | Dado ausente + literatura majoritariamente pós-hoc (revisão de 55 estudos, nenhum validou pré-jogo) | Parte 3 (c) |
| Jogo aéreo → escanteio → gol de bola parada | **Bloqueado** | Falta xG (0 preenchido) e tracking | Parte 3 (c) |
| Matchup lateral × ponta isolado da força de time | NEI, não construir | Busca sistemática não achou nenhum estudo — não promover a EXPLICAR sem teste causal caseiro | Parte 3 (c) |
| Handicap asiático como "porta lateral" de edge tático | **Morto** | Compartilha basicamente as mesmas ineficiências do 1x2 tradicional (Constantinou, PL 13 temporadas) | Parte 1 (b) |
| VALIDAR (confronto com mercado) para qualquer sinal desta pesquisa | **Bloqueado estruturalmente** | mrtip não tem nenhuma tabela de odds hoje | Parte 1 (b), Parte 2 (d) Etapa 5 |

---

## Claims atômicos por frente

### Parte 1 — Seção didática: como o treinador pensa, como o apostador pensa (F1 + F2, com apoio de F4)

Esta seção não pergunta se tática "funciona" — pergunta por que duas cabeças diferentes (quem monta o jogo, quem precifica o jogo) olham para a mesma informação e chegam a conclusões diferentes sem se contradizer. É o eixo que decide o que vira ESTIMAR e o que vira EXPLICAR.

#### a) Como um treinador de verdade prepara um jogo

Esqueça "matriz de confronto" (lateral X contra ponta Y, 11 casinhas). Não é assim que funciona na prática profissional.

**É um departamento, não uma pessoa com uma planilha.** Times de elite mantêm equipes de análise de 3 a 10 pessoas, cada uma especializada (análise do próprio time, análise de oposição, scouting, bola parada, dados avançados); em clubes menores, é 1 pessoa fazendo tudo (`verificado-fetch`, FSI Training).

**É um processo de vídeo, não de números.** O analista assiste de 3 a 5 partidas recentes do próximo adversário numa semana normal — podendo chegar a 3-4 partidas por dia quando o calendário aperta — concentrado entre segunda e quarta-feira da semana do jogo (`verificado-fetch`, FSI Training). Desse material corta ~350 clipes e reduz para 40-50 que apresenta ao treinador principal; os jogadores recebem a versão final via vídeo e imagens estáticas nos dias que antecedem o jogo (`verificado-fetch`, Coaches' Voice).

**O relatório tem estrutura fixa**, repetida em times diferentes: como o adversário sai jogando, progride a bola, cria a última jogada, finaliza (fase ofensiva, 4 etapas); como pressiona e onde é fraco na marcação (fase defensiva); como se comporta na transição; e rotinas de bola parada (`verificado-fetch`, Total Football Analysis).

**O alvo do plano não é sempre o mesmo.** A literatura e casos reais mostram pelo menos três alvos diferentes:

- **Um jogador específico** — marcação individual dedicada. Forma mais antiga (Vogts em Cruyff, 1974; Gentile em Maradona, 1982), hoje usada de forma seletiva: só no jogador mais criativo do rival, ou em bola parada (`verificado-fetch`, Wikipedia — usado só como cor histórica, não como prova de mecanismo).
- **Um corredor do campo** (meio-espaço) — o time inteiro se reposiciona pra fechar aquela faixa, sem marcar uma pessoa. É o que Simeone, Nagelsmann e outros fazem de forma coletiva (`verificado-fetch`, Total Football Analysis) — descrição qualitativa de sistema, sem estudo que meça tamanho de efeito.
- **A ligação entre dois jogadores do adversário** (cortar o caminho entre eles, sem marcar ninguém). Caso real recente, reverificado por fetch independente: Tottenham 1x4 Arsenal (fev/2026) — o Tottenham colou um zagueiro em Bukayo Saka (plano anti-jogador) e não deu certo; o Arsenal atacou o espaço entre lateral e zagueiro do Tottenham (plano anti-ligação) e teve sucesso (`verificado-fetch`, Coaches' Voice) — mas é **um jogo só**, e 4x1 quase sempre reflete sobretudo diferença de elenco. Ilustração de que os planos existem de verdade, não prova de qual funciona melhor.

**O que muda o plano DURANTE o jogo é o placar, não uma "leitura tática" nova.** Achado mais consistente e mais bem verificado desta pesquisa: time perdendo troca jogador mais cedo (~55min vs ~59-60min quando não está perdendo) e muda de formação com muito mais frequência (`verificado-fetch`, PMC — analysing substitutions; `verificado-fetch`, Tamura & Masuda, arXiv, n=5.944 J-League + 15.548 Bundesliga). O estudo mais robusto (154.170 observações minuto-a-minuto em UCL/UEL) mostra que a **direção** da troca (atacante ou defensor) não muda a chance de gol de forma significativa — o que muda tudo é **se o time está perdendo** no momento da troca (`verificado-fetch`, Amez, Neyt, Van Nuffel & Baert, 2021, Psychology of Sport and Exercise). Um segundo estudo, controlando força relativa dos times, não achou nenhum momento específico do 2º tempo em que trocar dê benefício comprovado — a "regra 58-73-79" não sobrevive ao controle estatístico (`verificado-fetch`, Silva & Swartz, 2016, Journal of Quantitative Analysis in Sports).

> **Nota de auditoria:** a citação de que o chefe de análise de oposição do Liverpool diz que a preparação começa 15-20 dias antes foi checada e **descartada** — a página não continha esse trecho ao ser reaberta. A estatística "15 de 16 times na Champions 2003/04 jogavam marcação zonal", usada para descrever o padrão "hoje", também foi **descartada**: amostra de uma temporada, mais de 20 anos atrás, indevidamente usada para descrever o presente. Nenhuma das duas entra como fato nesta seção — ver REFUTADO.

**Conclusão da parte (a):** o treinador pensa em cima de vídeo, rotina e reação ao placar — muito menos em "matriz de matchup estatístico" do que a intuição popular sugere. Mesmo o plano mais sofisticado encontrado (cortar a ligação entre dois jogadores) depende de dado que o mrtip não tem — vídeo, coordenadas de campo, identidade de treinador (`coach` = 0 linhas, fato interno).

#### b) Como um apostador profissional olha para a mesma informação

Resultado incômodo, e vale contar com honestidade: a fonte mais citável sobre "o que apostadores profissionais usam" — reportagem de revista com três nomes dizendo que ignoram leitura tática por narrativa e confiam só em ratings agregados — **foi auditada e descartada**. É jornalismo, n≈3 autosselecionados, e quem tem edge real e durável normalmente **não** conversa sobre o método com a imprensa. Fica registrado como pista descartada, não como fato.

O que sobra e sobrevive à auditoria é a literatura de **eficiência de mercado**, que testa o resultado (o preço se comporta como se já soubesse) em vez de perguntar opinião de alguém:

- **Não existe medição pública rigorosa (paper ou dado de exchange) que isole "quanto o preço se move quando a escalação é confirmada"** — mesmo após vasculhar a literatura clássica de eficiência de mercado em apostas de futebol (**NEI — ausência real, buscada de forma sistemática**). Não dá pra afirmar com número que "o mercado absorve a escalação em X minutos" — nem a favor, nem contra.
- O handicap asiático — porta lateral aparente para explorar informação tática fora do 1x2 — **compartilha basicamente as mesmas ineficiências do mercado 1x2 tradicional**, segundo o primeiro modelo acadêmico feito especificamente para testar isso, 13 temporadas de Premier League (`verificado-fetch`, Constantinou, arXiv 2003.09384). Não é distribuição diferente, é a mesma reembalada.
- **"Efeito treinador novo" parece existir no resultado bruto, mas evapora com regressão à média controlada.** No estudo mais rigoroso (46 temporadas da Bundesliga, 14 mil+ jogos, 154 demissões meio de temporada) não houve melhora real de desempenho pós-troca (Δ saldo de gols = 0,030±0,044, estatisticamente nulo) (`verificado-fetch`, Heuer, Müller & Rubner, PLoS ONE).
- Pista fraca, por analogia: mercados de futebol de alta frequência reagem rápido e sem sinal de antecipação a eventos públicos discretos — medido para **gols**, não para escalação, usado por `inferência` (`verificado-fetch`, arXiv 2505.21275, 306 jogos Bundesliga).

**Fato interno mais decisivo:** o mrtip não tem nenhuma tabela de odds/preço/mercado hoje (0 tabelas, checado no schema). Mesmo que a pesquisa externa tivesse achado um número bonito, o mrtip não teria como testar isso contra dado próprio agora — limitação de infraestrutura, não de teoria.

**Conclusão da parte (b):** apostador profissional pensa em eficiência de mercado, não em narrativa de matchup. A pergunta não é "esse confronto é interessante?" — é "essa informação já apareceu em algum lugar público e alguém com mais capital e velocidade já reagiu?". Quando a resposta é sim (via de regra é), a informação para de valer dinheiro, mesmo continuando verdadeira e relevante para o jogo.

#### c) Vocabulário mínimo (sem jargão)

| Termo | O que significa |
|---|---|
| **Setor / corredor** | Faixa vertical do campo (esquerda/centro/direita, às vezes com "meio-espaço"). Nenhum provedor profissional guarda "setor" pronto — todos guardam coordenada (x,y) e o analista desenha a faixa em cima (`verificado-fetch`, doc StatsBomb/Wyscout). O mrtip não tem essa coordenada — limite de dado, não de esforço. |
| **Transição** | Instante em que a bola muda de dono — o momento mais caótico e mais estudado do futebol moderno. |
| **Bloco** | Quão recuado/adiantado o time se posiciona sem a bola. Bloco baixo = recuado; bloco alto = pressão lá na frente. |
| **Entre-linhas** | Espaço vago entre defesa e meio-campo do adversário, onde um criativo recebe de costas pro gol. |
| **Score effects** | O placar muda o comportamento dos times mais que qualquer plano tático — o "confound-mestre": tentar explicar um padrão sem separar "é bom taticamente" de "geralmente tá perdendo nesse momento" contamina o número. |

#### d) A tensão central: por que o matchup importa pro jogo e não importa pro preço

"Se o lateral direito de A é ruim e a ponta de B é ótima, isso não vale alguma coisa na aposta?" Resposta curta: **importa pro jogo, sim — e ainda assim não muda o preço.** Dois fatos operam em conjunto:

**1. O jogo é evento único; o preço é média de tudo que já se sabe.** A força geral do time já embute boa parte de "quem tem os jogadores melhores em cada função". Quando alguém ajusta o duelo pela força do oponente, a taxa bruta (sem ajuste) já correlaciona **0,86-0,94** com a versão ajustada — o duelo individual majoritariamente **reflete** a força geral, não é sinal escondido independente dela (`verificado-fetch`, Stats Perform/OptaPro, n=114.063 duelos; achado de F4, citado aqui pelo mecanismo).

**2. A informação não é secreta.** Treinador, forma de montar o time e mesmo a escalação (que sai ~1h antes) são públicas antes do apito. Um mercado eficiente não precisa que ninguém seja gênio — só que **alguém**, entre milhares de participantes com capital em jogo, já tenha reagido antes de você. Achamos evidência fraca (por analogia) de reação rápida sem antecipação a eventos públicos, e nenhuma evidência (procurando de forma sistemática) de janela de exploração conhecida em torno da escalação especificamente — tratado, na prática de quem aposta com disciplina, como "assuma eficiente até prova em contrário".

**3. Mesmo quando o efeito tático é real, tende a ser pequeno.** SIN-014: efeito causal de formação ~0,11-0,18 gol por confronto, n≈22 mil — real, mas pequeno o bastante pra se perder no ruído normal do jogo. Mesmo padrão aqui: direção tática de substituição não muda a chance de gol de forma significativa; só o placar muda (Amez et al. 2021, já citado).

**4. O confound (score effects) é a armadilha mais comum.** Time perdendo eleva sua própria taxa de criar chance em 10%-53% dependendo da margem (`verificado-fetch`, Dixon & Robinson, 1998, The Statistician) — vale a qualquer minuto em que aquele placar exista, não é "explosão tática de fim de jogo". Sem separar os dois, leitura tática de olho nu corre risco de só descrever o placar de outro jeito.

**Onde isso deixa o produto:** tática segue tendo valor real — contar a história do jogo, não mover o número. É exatamente a régua ESTIMAR/EXPLICAR/VALIDAR: tática entra em EXPLICAR sempre; ESTIMAR é trabalho do motor quantitativo sem input de narrativa; VALIDAR (confronto com mercado) hoje nem é possível de fato, porque o mrtip não tem dado de odds para testar nada disso.

---

### Parte 2 — Métodos e desenho de pipeline (F3 + F4 + F5)

Pergunta prática: dado tudo que a pesquisa encontrou, como o mrtip deveria (ou não deveria) cruzar dado tático — e o que disso é ESTIMAR, EXPLICAR ou VALIDAR? O fio condutor de F3+F4+F5, depois da refutação adversarial, é consistente: **toda tentativa de representar confronto com granularidade maior que "ataque do time A vs. defesa do time B" foi testada contra um baseline agregado e não venceu — em alguns casos, piorou.**

#### a) Inventário de formas de representar o confronto — da mais fraca à mais forte

| # | Representação | O que exige de dado | O que a pesquisa mostrou | Rótulo |
|---|---|---|---|---|
| 1 | **Tabela de matchup pareado** (1 parâmetro por confronto A×B) | Histórico de resultados, N grande por célula | 20 times de uma liga geram 380 confrontos possíveis — igual ao total de jogos de uma temporada de PL. Parâmetro próprio por célula dá EPV≈1, muito abaixo do piso de referência (~10, Peduzzi et al. 1996). Ressalva do refutador: a regra EPV≥10 é heurística hoje contestada (van Smeden et al. 2016) — o número "10" é frágil, mas a lógica combinatória (380≈380) não depende de fonte externa. | inferência (força **média**) |
| 2 | **Decomposição ataque/defesa por TIME INTEIRO** (ODM — Offense-Defense Model — somado a rating agregado) | Histórico de gols marcados/sofridos por time | Testado em 2 datasets (4 Copas 2002-2014; 216.743 jogos de 52 ligas 2000-2018): somar ODM a Elo **não melhorou** o RPS — piorou por margem mínima nos dois casos (0,1860→0,1878; 0,2035→0,2045, deltas de ~0,001-0,002); ODM sozinho foi o pior dos logits (0,1949). **ATENÇÃO — correção de leitura (2026-07-20):** este resultado foi originalmente rotulado nesta pesquisa como "cruzamento setorial". **Não é.** O ODM produz *dois escalares por time* (um de ataque, um de defesa) a partir da matriz de gols; não contém setor, corredor, papel tático nem jogador. É evidência sobre *decomposição de rating de time*, **não** sobre matchup por setor. Ver linha 2b. | verificado-fetch (força **forte** para o que de fato testa) |
| 2b | **Matchup por SETOR/PAPEL de verdade** (ataque pela esquerda de A × lateral-direito de B, agregando métrica de jogador) | Métrica por jogador + papel tático — o mrtip **tem** (66 colunas, `role` em ~55%) | **NEI — nunca foi testado.** A busca sistemática (StatsBomb Conference, Google Scholar, Semantic Scholar, OpenAlex) não achou nenhum estudo que isole matchup posicional da força geral dos times. Isto é território **não estudado**, não território refutado. Consequência prática: não há evidência a favor **nem contra** — logo, entra como **hipótese a testar out-of-sample**, nunca como feature assumida. O único vizinho próximo é o GAP ratings de Wheatcroft (4 parâmetros por time: ataque/defesa × casa/fora), que reportou lucro de +5,01% (IC 3,38-6,76; n=49.884) mas **sem** baseline de rating único — o refutador derrubou o claim de lucro por risco de overfitting de backtest, e essa derrubada continua de pé. | NEI (força **nenhuma nos dois sentidos**) |
| 3 | **Modelo setorial por time inteiro estilo Dixon-Coles/Maher** (o que o mrtip já usa) | Só histórico de gols por time | Não vence rating agregado em acurácia de V/E/D — nunca foi sua função. É a **única** representação que gera nativamente distribuição de gols: ratings de ataque/defesa (Berrar) batem deep learning por margem grande em RMSE de placar exato (1,0047 vs 1,5063, n>300.000, 51 ligas). | verificado-fetch (força **média** — gap ~50%, grande demais pra ser ruído) |
| 4 | **Rating agregado contínuo** (Elo, pi-ratings, SPI) | Só histórico de resultados | Vence em RPS/acurácia no maior benchmark (>300 mil jogos), mas não gera distribuição de gols sozinho. | verificado-fetch (força **média**, vantagem sobre DL dentro da margem de erro) |
| 5 | **Team embeddings aprendidos** (ex.: STEVE) | Só histórico (viável hoje) | Testado em valor de mercado de jogador, não em resultado — refutador **derrubou** o uso como evidência de representação superior (tarefa diferente: valor de mercado reflete reputação/força de clube). | claim de vantagem **derrubado** |
| 6 | **Grafo jogador-time / GNN** (ex.: HIGFormer) | Dado de evento com direção — mrtip não tem | Bateu baselines genéricos por 4-5 p.p., mas **derrubado**: sem baseline forte tipo pi-ratings, e o dado primitivo (rede de passe com origem-destino) não existe no mrtip. | claim de vantagem **derrubado**; dado ausente |
| 7 | **Tracking espaço-temporal completo** (pitch control, SoccerCPD, TacticAI) | Coordenadas x,y de 22 jogadores a 10-25Hz | Único método usado na literatura para medir mudança de formação real e prever desfecho de escanteio com robustez (TacticAI: F1 0,64, n=7.176 escanteios). Fora de alcance: nenhum provedor despacha isso pro nível de assinatura do mrtip; doc oficial SportMonks confirma `formations` sem timestamp. | verificado-fetch (força **forte** para a barreira de dado) |

**Leitura prática:** o mrtip já está na linha 3 — exatamente a que a literatura endossa para gerar distribuição de gols. Subir para a linha 2 (decompor o rating de time em ataque/defesa via ODM) **não traz ganho** — testado, RPS praticamente idêntico. A linha **2b** (matchup por setor/papel de verdade) é **outra coisa e continua em aberto**: ninguém testou, e é a única rota de aumento de granularidade para a qual o mrtip **já tem** a matéria-prima. Subir para as linhas 5-7 exige dado que o mrtip não possui e, onde foi possível medir vantagem de verdade (linha 3 vs. 4), a vantagem é específica de tarefa, não geral.

#### b) Cruzamento por setor ofensivo × defensivo

**Definição de setor — o que existe vs. o que o mrtip pode calcular.** Não existe "setor" nativo em nenhum dos três grandes provedores (Opta, StatsBomb, Wyscout): todos armazenam coordenada x,y contínua por evento (StatsBomb x∈[0,120]/y∈[0,80]; Wyscout percentual; Opta só um qualifier grosseiro de 4 valores em eventos específicos). Toda grade de zona é construção de analista em cima da coordenada bruta (`verificado-fetch`, força **forte**).

**O mrtip não tem nenhum par (x,y) de evento no schema** — `lineup_player` guarda 66 colunas agregadas por jogador-por-partida, não eventos geolocalizados. Isso fecha, por falta de matéria-prima, qualquer definição de setor por corredor/terço/grid — parede mais dura que a já registrada em SIN-014 para formação (lá o dado existia e o efeito é que era pequeno; aqui falta o dado primitivo mínimo).

A única definição de setor operacionalizável hoje é **papel tático**, via `lineup_player.role` + `.grid` (~55% de cobertura): aproximar "ataque pela esquerda deles" por "produção agregada dos jogadores registrados como ponta-esquerda/lateral-esquerdo daquele time" — mesmo tipo de rótulo "de prateleira" que StatsBomb/Wyscout usam para posição, não para zona espacial.

**Método de agregação jogador → setor:**

1. **Métricas de contagem/volume** (`dribble_attempts`, `touches`, `ball_recoveries`, `clearances`, `passes_final_third`, `chances_created`, `big_chances_created`, `long_balls_won`): agregar como **soma(métrica) ÷ soma(`minutes_played`) × 90**, nunca média simples jogo-a-jogo (`verificado-fetch`, força **média**, com o caveat do próprio vendor SportMonks de que "aggregated stats based on a small number of matches can be unreliable").
2. **Métricas de percentual** (`tackles_won_pct`, `duels_won_pct`, `aerials_won_pct`): somar numerador e denominador brutos ao longo das partidas e dividir uma única vez — nunca média das porcentagens prontas. **Pré-requisito NEI**: checar no schema se `tackles_won_pct`/`duels_won_pct` guardam os brutos por trás do percentual (para `aerials_won`/`aerials_lost` os brutos existem separados, então esses dois são agregáveis corretamente hoje; para os outros, agregar por média simples está errado até confirmar).
3. **Amostra pequena**: shrinkage, não corte binário. Formalização clássica: James-Stein/Bayes empírico — exemplo canônico de beisebol (Efron & Morris 1973, n=18 jogadores), perda quadrática 5,01 (shrinkage) contra 17,56 (média bruta), eficiência ~3,5× (`verificado-fetch`, força **média**, analogia explicitamente rotulada como tal). Piso de referência de mercado (~900min/~10 jogos completos antes de tratar per-90 como estável) é alto demais para um recorte de papel×partida — reforça a necessidade de shrinkage.

**Mapeamento das 66 colunas por setor:**
- **Ofensivo**: `dribble_attempts`, `dribbles_successful`, `chances_created`, `big_chances_created`, `passes_final_third`, `touches`, `long_balls_won`, `key_passes` (via `lineup.details`, fora das 66 centrais — checar disponibilidade separadamente).
- **Defensivo**: `tackles_won_pct`, `duels_won_pct`, `dribbled_past`, `aerials_won`, `aerials_lost`, `aerials_won_pct`, `ball_recoveries`, `clearances`, `errors_lead_to_shot`, `error_lead_to_goal`.
- **Ambíguas/contexto**: `possession_lost`, `turnovers`, `rating`, `minutes_played` (só denominador).

**Nenhuma dessas colunas passa no teste de "sinal individual limpo"** (força **forte**, triangulado em 3 fontes independentes): `tackles_won_pct`, `ball_recoveries`, `clearances` são confundidas por sistema/estilo de time (exemplo numérico: 7,6 ações defensivas/90 num sistema recuado vs 5,1/90 num sistema de pressão, o segundo potencialmente mais efetivo apesar do número menor). `duels_won_pct`/`aerials_won_pct` têm sinal real (correlacionam 0,86-0,94 com modelo ajustado por força do oponente, Bradley-Terry, n=114.063 duelos) — mas a taxa bruta sofre viés de pareamento (zagueiro bom marca atacante bom), e a versão ajustada é irreconstruível com o dado agregado do mrtip; só a bruta, mais fraca, está disponível (força **fraca**: fato correto, inútil como sinal — pesquisa pública da OptaPro há quase 8 anos, presumivelmente já precificada). `errors_lead_to_shot`/`error_lead_to_goal` não têm fonte sobre confiabilidade estatística (NEI) — eventos raros por jogador/partida, alta variância amostral esperada em janelas curtas (`inferência`, não verificada).

**Conclusão de camada**: cruzamento setorial por papel tático entra **hoje** como **EXPLICAR** — frase de contexto na aba Fatos, sempre com piso de amostra reportado, nunca input que move o λ do motor. O "nunca ESTIMAR" da versão original deste documento era forte demais: como não existe teste na literatura (linha 2b do inventário, NEI), a promoção a ESTIMAR não está *refutada*, está *não autorizada* — e o que a autoriza é um único portão: bater o motor atual em RPS/log-loss out-of-sample, em backtest próprio. Enquanto esse teste não existir, EXPLICAR.

#### c) Cruzamento com as faixas de 15 minutos sem cair no confound de score effects

O motor de BANDS (0-15…76-90) corre um risco concreto: **contar "gols sofridos por banda" sem condicionar pelo estado de placar corrente naquela banda está, muito provavelmente, recapturando o efeito de placar, não um traço tático do time.**

Evidência (Dixon & Robinson 1998, RSS, 4.012 jogos ingleses 1993-96, `verificado-fetch`, força **média** — dado de 30+ anos, mas peer-reviewed): time perdendo tem a própria taxa de gol elevada entre 10% e 53% dependendo da margem (visitante perdendo por 1: 1,33×; casa perdendo por 2+: 1,53×). Esse efeito é **constante ao longo dos 90 minutos** no desenho do modelo — o que empurra a média agregada pra cima no fim é em parte composicional (conforme o jogo avança, cresce a fração de partidas com placar já decidido) — leitura da estrutura do modelo, `inferência`.

Segundo estudo independente e mais recente (arXiv 2508.04008, 15 temporadas × 5 grandes ligas europeias, ~4 milhões de observações-minuto, `verificado-fetch`, força **forte**) confirma externamente o confound-mestre já travado no repo: o estado do placar distorce sistematicamente a produção ofensiva bruta, a ponto de os próprios autores proporem ajustar para um cenário padronizado "empate em casa, 11×11" antes de comparar times.

**Cartão vermelho como variável de controle, não sinal tático**: efeito grande (taxa de gol do adversário sobe ~124%, do time reduzido cai ~47%, n=320 partidas de Copa do Mundo, `verificado-fetch`, força **média** — amostra de seleções/mata-mata), mas a própria emissão do cartão é endógena ao placar: cada gol de vantagem reduz ~75% a chance do time cometer falta de cartão vermelho (`verificado-fetch`, força **forte**). Precisa ser excluído/controlado antes de atribuir qualquer pico de gols numa faixa a "pressão tática" ou "fadiga".

**Substituição também não é sinal tático independente de placar**: no estudo mais robusto (Amez et al. 2021, n=2.025 jogos, 154.170 minutos-time, `verificado-fetch`, força **forte**), a direção tática da troca não teve efeito significativo sobre a chance de gol em nenhuma especificação — o que move a agulha, ~10× maior, é o time estar perdendo no momento da troca, e os próprios autores alertam que isso não pode ser lido como causal.

**Estabilidade por time**: mesmo sem esse confound, uma temporada de um único time não tem amostra suficiente. Ordem de grandeza (`inferência` própria, força **forte** por ser dedução matemática direta): time de PL marca ~55-60 gols/temporada; dividido em 6 faixas sob hipótese nula uniforme, dá ~9 gols/faixa/temporada, erro-padrão Poisson ≈3 (≈33% de ruído relativo). O único paper que testa não-uniformidade em amostra grande (3.433 partidas, 21 ligas, `verificado-fetch`) nunca identifica perfil estável por time — os próprios autores tratam "time" como ruído a controlar.

**Recomendação concreta para o motor de BANDS:**
1. **Auditoria obrigatória antes de qualquer novo uso** (não executada nesta pesquisa): verificar se o motor de BANDS já guarda o placar corrente por faixa de 15 minutos. Item de maior prioridade.
2. Qualquer contagem de "gols/finalizações por banda" deve ser **estratificada por estado de placar** (líder/empate/atrás) — nunca contagem bruta por banda.
3. Cartão vermelho e substituição entram como **variáveis de exclusão/controle**, não como features.
4. Perfil temporal por time só deve ser exposto com várias temporadas empilhadas (ruído de ~33%/faixa é demais para temporada única) e com caveat explícito de contaminação por composição de placar.

#### d) Arquitetura de pipeline recomendada

Cada etapa indica se a saída é **ESTIMAR** (move o número), **EXPLICAR** (narrativa, nunca realimenta) ou **VALIDAR** (confronto com mercado).

- **Etapa 0 — Auditoria de pré-condição** (nem ESTIMAR nem EXPLICAR): confirmar se `tackles_won_pct`/`duels_won_pct` guardam os brutos (pré-requisito b.2); confirmar se BANDS já condiciona por placar (pré-requisito c). Não avançar sem essas duas checagens.
- **Etapa 1 — ESTIMAR (núcleo, já existente)**: motor Poisson/Dixon-Coles com ataque/defesa por time inteiro. Mantém a arquitetura atual (linha 3 do inventário). Nenhuma das 66 colunas de `lineup_player` entra aqui sem teste out-of-sample formal (RPS/log-loss contra o motor atual como baseline).
- **Etapa 2 — ESTIMAR (condicional/auditoria)**: BANDS de 15min estratificado por placar. Só produz saída utilizável depois da Etapa 0; uso legítimo é interno (mercados in-play com λ dinâmico) — para o mrtip pré-jogo atual, essa etapa não alimenta o λ inicial (efeito de placar é intrajogo e já precificado ao vivo).
- **Etapa 3 — EXPLICAR**: camada de narrativa setorial (papel tático). Frases de contexto com soma/soma×90, shrinkage, piso de amostra. Nunca recalibra o λ. Formação (SIN-014), rede de passe, cluster de estilo e treinador (se ingerido) entram na mesma etapa e regra.
- **Etapa 4 — EXPLICAR**: perfil temporal por time (BANDS) estratificado e com múltiplas temporadas. "Historicamente, quando o placar está X, esse time…" — nunca "esse time é fraco no fim de jogo" sem condicionamento.
- **Etapa 5 — VALIDAR**: confronto com mercado. Aplica-se só onde o mrtip tiver dado de odds (hoje: nenhuma tabela). Bloqueado estruturalmente para qualquer sinal desta seção, incluindo os de EXPLICAR.
- **Etapa 6 — Bloqueada/não fazer** (registro explícito): mudança de formação durante o jogo (SportMonks não expõe timestamp/posição do substituto, confirmado na doc oficial); team embeddings e grafos de interação (dado primitivo ausente, vantagem derrubada onde testada); matchup lateral×ponta isolado (NEI puro, não construir nem versão EXPLICAR sem teste causal caseiro prévio).

#### e) Anti-padrões a evitar

1. **Dupla contagem de sinal.** As 66 colunas de `lineup_player` são, em boa parte, versões redondas/pct/won-lost do mesmo evento subjacente (`aerials_won`, `aerials_lost`, `aerials_won_pct` medem a mesma disputa três vezes). Caso análogo documentado (GPS de carga de treino em rugby, n=16 jogadores): 9 de 12 variáveis com VIF>1.000 (`verificado-fetch`, força **forte** como analogia de mecanismo). Regra: se uma métrica entra em EXPLICAR, não pode também recalibrar o número em ESTIMAR.
2. **Explosão combinatória.** 380 confrontos possíveis ≈ 380 jogos/temporada. Parâmetro próprio por célula (EPV≈1) é overfitting garantido pela lógica (força **média**, ver ressalva do refutador sobre EPV≥10) — e o teste empírico direto (item a.2) confirma: piora, não melhora.
3. **Testar muitas hipóteses no mesmo histórico sem correção.** Com 1.000 tentativas, Sharpe máximo esperado chega a 3,26 mesmo com efeito real zero (Bailey & López de Prado, `verificado-fetch`, força **média**). Qualquer exploração nova é uma tentativa dentro de um orçamento finito sobre as mesmas ~380 partidas/temporada.
4. **Vazamento de dado / tautologia.** Caso concreto derrubado nesta pesquisa: estudo que usava estatísticas do próprio jogo para "prever" o resultado desse mesmo jogo (AUC alto que não é predição nenhuma). Confirmar que toda feature é calculável **antes do apito inicial**.
5. **Reconstruir dado que a fonte não expõe.** Formação dinâmica, treinador (0 linhas), xG (0 preenchido) e rede de passe com par emissor-receptor não têm como ser reconstruídos com o pipeline SportMonks atual — heurísticas fracas (inferir mudança de formação pela posição do substituto) já foram checadas como impossíveis na prática.
6. **Presumir que "mais granular" é "melhor".** Em cada teste controlado real encontrado (decomposição ataque/defesa de time via Elo+ODM, tipo de substituição, consistência de estilo, direção tática de troca), a versão mais granular/tática não venceu a mais simples. Ressalva honesta: nenhum desses testes chegou a testar granularidade **por setor/papel** — ali não há teste, logo não há veredito, só a presunção (razoável, não provada) de que a regra se repita. Qualquer cruzamento novo nasce como hipótese a testar (RPS/log-loss out-of-sample), nunca como melhoria assumida.

---

### Parte 3 — Viabilidade (F4 + F5 + F6)

Pergunta prática: das cinco frentes táticas, o que sobra que o mrtip pode **construir de verdade**, com o dado que tem ou pode ter? Resposta curta: quase nada vira ESTIMAR, um punhado vira EXPLICAR barato, e a maioria das ideias mais interessantes esbarra numa parede de dado que não existe — coordenada de evento, tracking, xG, identidade de treinador.

#### a) O que dá pra construir HOJE com o dado que já existe

**1. Auditoria de placar no motor de BANDS de 15 minutos (custo baixíssimo, benefício alto — pré-requisito, não feature nova).** F5 mostrou, com evidência forte e repetida em métodos diferentes, que o placar é o confound dominante de qualquer variação temporal de gols. A ação concreta e barata é auditar se o motor já condiciona por estado de placar por faixa — sem isso, o motor corre risco de reembalar efeito de placar como se fosse traço do time. Não foi feita nesta pesquisa (é pergunta de schema/código interno), mas é a tarefa de maior alavancagem de toda a lista.

**2. EXPLICAR com as 66 colunas de `lineup_player`, só como narrativa de contexto — nunca número que move o motor.** O dado é real e utilizável para frases tipo "o lateral direito sofreu N dribles nos últimos 5 jogos" (glossário SportMonks avisa textualmente que "aggregated stats based on a small number of matches can be unreliable and prone to distortion", `verificado-fetch`, forte, autorreferente ao próprio pipeline do mrtip). Nenhuma métrica de contagem (dribbled_past, tackles, ball_recoveries, clearances) é sinal individual limpo — todas confundidas por sistema/estilo do time, triangulado em 3 fontes independentes. Para construir corretamente: soma(métrica)/soma(minutos)×90, soma-antes-de-dividir para percentuais, shrinkage para amostra pequena — higiene metodológica correta, mas pré-condição de build, não confirmação de que vale a pena construir. Se for ao ar: frase na aba Fatos/EXPLICAR, nunca input que move o λ — a reputação de um lateral fraco é informação pública multi-jogo, plausivelmente já precificada com folga ainda maior que a formação (revelada só ~1h antes).

**3. Duelos aéreos/de chão: usar a taxa bruta com cautela, sabendo que a versão com sinal real é irreconstruível.** Taxa bruta correlaciona 0,86 (chão)/0,94 (aéreo) com modelo Bradley-Terry ajustado por força do oponente, 114.063 duelos (`verificado-fetch`, Stats Perform/OptaPro). Mas isso esconde viés de pareamento: zagueiro bom marca atacante bom, taxa bruta subestima quem enfrenta adversário forte. A versão ajustada exige identidade do par — dado que o mrtip não tem. Pesquisa pública desde ~2018: presunção forte de que qualquer casa com dado Opta já precificou o ajuste. Pode entrar como cor de contexto, nunca como "esse zagueiro é fraco no aéreo" sem qualificar quem ele marca.

**4. Não construir "esse time ataca mais pela esquerda" como traço estável — resultado útil em si (evita esforço em sinal já mostrado instável).** Evidência mais rigorosa (rede de passes, LaLiga 2018/19, n=380 jogos, `verificado-fetch`, forte): padrão espacial de um time varia jogo a jogo, é mais consistente em casa que fora (19 de 20 times), e o desvio do padrão típico num jogo específico correlaciona com o resultado (44% de vitórias do time mais "identificável" vs 27% do outro lado). Soma-se ao achado de que o placar distorce sistematicamente o volume ofensivo bruto (15 temporadas × 5 ligas, `verificado-fetch`, forte). "Time X ataca pela esquerda" não é etiqueta fixa — é comportamento condicional a mando e placar.

#### b) O que exige ingestão nova — o caso treinador

`coach`: 0 linhas. `lineup.coach_name`: 0 preenchidos. F6 confirmou o *porquê* estrutural e mapeou o caminho de ingestão, mesmo concluindo que não vale a pena priorizar.

**O que F6 descobriu sobre a API SportMonks (tudo `verificado-fetch` direto na doc oficial):**
- Existe entidade `Coach` dedicada, com 5 endpoints (`GET All Coaches`, `GET Coach by ID`, `GET Coaches by Country ID`, `GET Coaches Search by Name`, `GET Last Updated Coaches`).
- O include `coaches.fixtures` tem descrição explícita **"Fixtures coached"** — vínculo direto treinador→partida, não inferência por data. Reverificado duas vezes nesta cadeia (frente original e refutador), bateu igual nas duas.
- O include `latest` do Coach tem limite documentado de 6 meses; esse aviso **não aparece** para `fixtures` (sugere, sem confirmar numericamente, cobertura mais longa — `inferência`).
- Caminho alternativo: `coach.teams` devolve janelas de mandato (team_id, position_id, start, end) cruzáveis com a data da partida — inferência por intervalo, não vínculo direto, pode falhar em trocas rápidas/interinos.
- **Por que `lineup.coach_name` está zerado é estrutural**: `Fixture`/`Lineup` nunca tiveram campo de treinador; `type_id` do Lineup só tem 11=titular/12=banco. Coluna deveria ser tratada como morta/a descontinuar, não como backfill pendente.
- **NEI real**: profundidade histórica exata de `fixtures`; se `Coaches` exige add-on pago; cobertura real (quantos coaches, quantas fixtures vinculadas) para PL/Brasileirão na assinatura do mrtip — só se verifica com chamada real na API.

**Vale a pena ingerir?** Mecanicamente sim — barato, caminho mapeado. Como sinal para o motor quantitativo, não:
- Estudo mais recente e bem desenhado (Lundkvist et al. 2026, n=331 trocas em 5 países, xG/xP como contrafatual, `verificado-fetch`, forte, reconferido via PubMed pelo refutador): sem efeito significativo em pontos nem xP — IC cruzam zero em todas as janelas.
- Revisão sistemática PRISMA (94 títulos → 24 estudos elegíveis, `verificado-fetch`, forte): "achados mistos, sem consenso".
- Estudo mais favorável a efeito real (Bryson et al. 2021, n=1.327 demissões + 533 saídas, 15 temporadas, 4 países, `verificado-fetch`): efeito estatisticamente zero no modelo não-viesado; efeito pequeno (0,04-0,1 ponto/jogo) só numa especificação condicionada a reter o substituto por 20 jogos — conhecida só *depois* do fato. **Tensão de leitura registrada**: o resumo oficial dos autores enfatiza esse efeito pequeno-mas-significativo como achado central da especificação preferida, não como "limite superior descartável" — o refutador manteve essa nuance sem derrubar a conclusão prática, porque mesmo no enquadramento mais favorável o efeito é condicionado a algo desconhecido no momento da aposta.
- Treinador individual raramente acumula amostra própria suficiente: permanência média ~45 jogos, 34% das passagens terminam até o jogo 20, mais de 13% nem chegam ao jogo 10 (`verificado-fetch`).
- Argumento estrutural independente de qualquer paper: identidade/troca de treinador é pública com dias/semanas de antecedência (ao contrário da escalação, ~1h antes) — presunção forte de já precificada.

**Conclusão**: não priorizar ingestão de `coach` motivada por edge quantitativo. Se entrar um dia, textura EXPLICAR de baixo custo (via `coach.fixtures`/`coach.teams`) — "técnico há N jogos no cargo" — nunca input do motor. Mesmo a hipótese de "efeito novo treinador" como sinal de mercado foi descartada em outra frente (F2, Bundesliga n=14.018): não há melhora real pós-troca; a ineficiência que às vezes aparece em estudos menos rigorosos parece viés comportamental do apostador, não edge fundamentalista.

#### c) O que está bloqueado e deve ser declarado morto

**xG = 0 preenchido, bloqueado no plano SportMonks atual (já registrado no repo).** Mata de saída qualquer proxy de "qualidade de chance criada" ou "xG de bola parada por time": a própria StatsBomb admite que "Aerial Unit Strength alone isn't a silver bullet" (`verificado-fetch`) — o Everton liderou o rating de força aérea numa temporada mas ficou só mediano em eficiência de bola parada. O que de fato prevê desfecho de escanteio (TacticAI, DeepMind, `verificado-fetch`, n=7.176 escanteios) é posição x,y de 22 jogadores + velocidade + altura no momento da cobrança — tracking, não estatística agregada.

**Tracking data — a parede mais dura de toda a investigação.** F4 confirmou, checando documentação técnica dos três grandes provedores (`verificado-fetch`), que nenhum despacha "zona"/"corredor"/"setor" como campo nativo pronto. O mrtip não tem nenhum par (x,y) de evento no schema — não é falta de esforço de engenharia, é ausência da matéria-prima mínima que qualquer definição de setor, mesmo a mais frouxa, pressupõe. Matchup por corredor/terço/grid está morto enquanto essa lacuna existir.

**Mudança de formação durante o jogo.** Confirmado por fetch direto na doc oficial SportMonks (força **forte**): `formations` é registro único sem timestamp; `formation_field` reflete só o pré-jogo; evento SUBSTITUTION não carrega posição de quem entra/sai (substituto vem com `formation_field: null`). Mesmo a heurística mais fraca ("saiu zagueiro, entrou atacante → time foi pra frente") não é calculável. Toda literatura séria (SoccerCPD/KDD, survey Frontiers 2024, `verificado-fetch`) resolve isso com tracking espaço-temporal — dado de evento só segmenta a partida em fases. Vai além do que SIN-014 já havia cravado: aqui nem o EXPLICAR dinâmico pode ser dito como fato — seria invenção.

**Rede de passes / matchup jogador-a-jogador.** Não existe no schema — `lineup_player` guarda agregados por jogador-por-jogo, não sequência com origem e destino. Mesmo se existisse: revisão sistemática de 55 estudos (2017-2024, `verificado-fetch`, forte) não achou nenhum caso de validação preditiva pré-jogo genuína — a esmagadora maioria calcula a rede com dados da própria partida analisada (pós-hoc por construção). Duas portas fechadas: falta o dado e, mesmo com ele, a literatura não valida uso pré-jogo.

**Matchup lateral × ponta isolado da força geral dos times.** Buraco de literatura confirmado por busca sistemática (StatsBomb Conference 2021/22, Google Scholar, Semantic Scholar, OpenAlex): nenhum estudo isola esse efeito controlando força de time. É **NEI**, a resposta correta. Veredito prático: não construir nem como ESTIMAR nem como EXPLICAR sem antes rodar um teste causal caseiro (ex.: taxa de sucesso do lateral em duelos contra pontas de diferentes níveis, controlando força relativa via Elo/xG) — promover a narrativa sem essa evidência interna arriscaria pseudo-explicação.

#### d) A lacuna de cobertura do role/grid em 55%

Não é detalhe menor — é o gargalo que decide se qualquer coisa do item (a) acima é construível de forma confiável:

- **O jogador mais sensível a essa lacuna é exatamente o mais relevante para narrativa de matchup**: o suplente que entra em campo, muitas vezes mudando de função. A lacuna provavelmente se concentra onde a informação seria mais valiosa (mudança tática real), não onde é mais redundante (titular fixo).
- **Consequência prática**: qualquer agregação "produção do nosso lateral vs ataque pela esquerda deles" perde metade da amostra ou fica enviesada a favor de titulares que nunca mudam de posição, o que distorce qualquer shrinkage calculado em cima disso.
- **O que essa lacuna impede**: (i) EXPLICAR por papel tático em ~metade dos jogos-jogador, silenciosamente; (ii) validar estabilidade de "estilo" por posição ao longo da temporada; (iii) isolar efeito de troca tática de substituição por papel.
- **Recomendação**: antes de investir em narrativa de papel tático, mapear *por que* 45% falta (sistemático — formações não-padrão, ligas específicas, banco — ou espalhado). Trabalho de auditoria de dado, fora do escopo desta investigação, mas pré-requisito.

#### e) Tabela de decisão

| Sinal proposto | Dado necessário | Temos? | Camada | Veredito |
|---|---|---|---|---|
| Auditoria de placar no motor de BANDS | estado de placar por minuto/fixture | Não verificado (checar código) | pré-requisito de EXPLICAR | **Fazer primeiro** |
| Narrativa de matchup por papel | `lineup_player` + `role`/`grid` (55%) | Parcial | EXPLICAR | Construir com agregação correta; nunca mover o número |
| Duelo aéreo/chão ajustado (Bradley-Terry) | identidade do par em cada duelo | Não temos (só bruto) | — | Sinal real na literatura, irreconstruível com o dado do mrtip; presumivelmente já precificado |
| "Time X ataca mais pela esquerda" como traço fixo | coordenada x,y por evento | Não temos | — | **Morto** — nem seria estável mesmo com o dado |
| Matchup setorial completo (corredor/terço/grid) | coordenada x,y por evento | Não temos | — | **Bloqueado** |
| Mudança de formação durante o jogo | tracking ou evento com posição | Não temos (confirmado na doc oficial) | — | **Morto** |
| Rede de passes / matchup jogador-a-jogador | eventos com origem→destino | Não temos | — | **Morto** |
| Jogo aéreo → escanteios → gol de bola parada | esquema de cobrança + x,y + xG | Não temos (xG=0, sem tracking) | — | **Bloqueado** |
| Matchup lateral × ponta isolado | dado de duelo com par + ajuste de força | Parcial (bruto sim, ajustado não) | NEI | Não construir sem teste causal caseiro primeiro |
| Treinador como entidade (`coach.fixtures`/`.teams`) | SportMonks `Coach` | Não ingerido, mapeado | EXPLICAR fraco | Barato, retorno baixo — não priorizar |
| "Efeito novo treinador" (bounce) | `coach` + odds históricas | Não temos nenhum dos dois | — | **Morto** — efeito nulo no estudo mais rigoroso |
| `lineup.coach_name` (coluna existente) | campo de treinador em `Fixture`/`Lineup` | Não existe na API | — | Descontinuar |
| Substituição (timing/direção) como sinal pré-jogo | dado de evento minuto-a-minuto | Parcial (se `events` for ingerido) | — | **Morto como ESTIMAR** |
| Cartão vermelho como controle | eventos de cartão com minuto | Não confirmado se ingerido | controle estatístico | Necessário só se medir padrão temporal de gols |

---

## Veredito adversarial por frente (síntese cravada de cada refutação)

> Estas seis afirmações são o fechamento de cada frente após o passe adversarial — transcritas de forma próxima ao original para preservar a autoridade do veredito.

**F1 — Como treinador monta anti-tático de verdade.** A frente não sobrevive como fonte de edge: o achado mais rigoroso (Amez et al. 2021, n=154 mil observações) mostra que a direção tática de um ajuste não move a chance de gol — só o placar move, estendendo SIN-014 e a "refutação-mãe" para dentro do próprio jogo. A "regra 58-73-79" de substituição é desmontada pela reanálise mais rigorosa do próprio corpo de evidência (Silva & Swartz 2016). Pelo menos 3 fontes violam o protocolo (vendor de software, blog de aposta bloqueado, citação não confirmada) e foram eliminadas. Nada aqui vira ESTIMAR; o que resta para EXPLICAR é vocabulário/processo de bastidor de scouting, sem número que o mrtip possa citar com confiança.

**F2 — Como apostador profissional trata informação tática.** A conclusão central (tática declarada = EXPLICAR, sem edge autônomo, presumidamente precificada) sobrevive — mas porque já estava gravada no SIN-014 antes desta frente começar, e a peça nova mais robusta (Heuer et al., Bundesliga, n=14.018, null-result de troca de treinador) reforça por analogia, não prova diretamente nada sobre formação. A maior parte do material de apoio não resiste a escrutínio: a âncora numérica de Q1 (anedota Rooney) e boa parte de Q2/Q3 violam a regra do projeto contra fonte fraca para claim numérico, e a citação mais aplicável ao produto (Galdino et al. 2025, Brasileirão) não pôde ser reverificada. Rebaixar explicitamente a confiança desta frente a "reforço qualitativo fraco-a-médio".

**F3 — Métodos além de cruzar A×B.** A refutação mata claims verdadeiros-mas-irrelevantes (STEVE em valor de mercado, HIGFormer sem baseline forte, RPS de pi-ratings vs DL dentro da margem de ruído), derruba um claim tautológico (Zhong et al. usa estatísticas do próprio jogo para "prever" o resultado desse mesmo jogo), e neutraliza um claim de lucro de backtest (Wheatcroft +5%) que cai na mesma armadilha de overfitting que a própria pesquisa do lote ensina a desconfiar. O pilar que sobrevive com força real é o resultado nulo de Elo+ODM em 216 mil jogos — **decompor o rating de um time em ataque/defesa** não bate rating agregado simples para prever V/E/D. **Isto não é evidência sobre matchup por setor/papel** (ver correção no TL;DR e linha 2b do inventário): esse continua NEI, nunca testado. Nada aqui pede mudança de arquitetura no ESTIMAR — mas nada aqui fecha a porta da linha 2b, que segue como hipótese aberta a testar.

**F4 — Cruzamento por setor (ofensivo × defensivo).** A frente sobrevive na conclusão geral, mas não porque os claims individuais sejam fortes — cerca de um quarto dos ~50 claims coletados caem por serem snippets sem URL ou anedotas de mídia. O que sobrevive é uma parede mais dura que a de SIN-014: nenhum provedor de dado despacha "setor" nativo, e o mrtip não tem um único par (x,y) no schema. A peça mais forte (estabilidade espacial do time, n=380, r=0,956) ativamente derruba a premissa de que "time X ataca pela esquerda" seja etiqueta estável o suficiente para virar sinal.

**F5 — Janela de 15 minutos cruzada com tática.** A frente prova que dinâmicas intrapartida são reais e estatisticamente robustas — curva de gols não-uniforme, efeito de placar, cartão vermelho, timing de substituição — mas nenhuma investigação produz o que o título promete: um perfil tático estável por time na janela de 15 minutos que sirva de sinal pré-jogo. As duas perguntas que de fato testam "tática" (substituição ofensiva vs. neutra; mudança de formação in-game) voltam com resultado nulo ou incalculável. Cerca de um terço dos claims caiu por rótulo de fonte inflado, amostra subdimensionada, ou citação de segunda mão. Nada aqui sustenta alimentar o motor de BANDS com sinal tático por time; a auditoria de se o motor já condiciona por placar é a auditoria mais urgente antes de investir mais nesta frente.

**F6 — Treinador como entidade de dado.** A frente é majoritariamente sólida e bem rotulada, mas a espinha dorsal causal (Bryson et al. 2021) foi apresentada com enquadramento mais definitivo do que o resumo oficial dos autores sustenta — ressalva de enquadramento real, mas que não invalida a interpretação (condicionar em retenção pós-hoc é selecionar por resultado positivo). A seção de mecânica da API SportMonks é o ponto mais forte — bateu verbatim em três spot-checks independentes. A conclusão prática (treinador é no máximo EXPLICAR, hoje nem isso porque o dado não existe) sobrevive por um motivo mais forte que "o estudo mais rigoroso prova efeito zero": mesmo o efeito mais favorável reportado é condicionado a um resultado só conhecido depois do fato, e treinador é informação pública dias/semanas antes do jogo — já precificada.

---

## Modelo de dados proposto

Nenhuma tabela nova é necessária para os itens que sobrevivem como EXPLICAR — todos se apoiam em tabelas já existentes:

- **Narrativa de papel tático (setor por role/grid)**: consome `lineup_player` (66 colunas já existentes) + `lineup.role`/`.grid` (~55% de cobertura). Agregação computada em runtime ou pré-calculada por (`team_id`, `role`, janela de jogos), nunca gravada como feature do motor.
- **BANDS estratificado por placar** (condicional à Etapa 0): requer que o motor de BANDS já existente (fora do escopo desta pesquisa auditar) tenha ou ganhe uma dimensão de estado de placar por faixa — não é tabela nova, é campo/dimensão adicional na estrutura já existente do motor.
- **Treinador (se algum dia ingerido, baixa prioridade)**: caminho mapeado via SportMonks `coach.fixtures` (vínculo direto treinador→partida) e `coach.teams` (janelas de mandato, para inferência por intervalo de data). Sugestão de forma mínima, seguindo o padrão `observation` já usado em SIN-014: `observation(match_id, dimension='coach', team_id, value_jsonb={coach_id, coach_name, tenure_games, source}, source, observed_at, ingested_at)` — append-only, com proveniência, sem tabela `coach` própria a manter se o uso for só textura de EXPLICAR. `lineup.coach_name` deve ser tratada como coluna morta a descontinuar, não como pendência de backfill.
- **Setor por corredor/zona/grid espacial, rede de passes, jogo aéreo→escanteio com xG**: nenhum modelo de dado proposto — todos dependem de coordenada de evento (x,y) que não existe no schema e não está no roadmap de ingestão SportMonks do mrtip. Propor schema aqui seria desenhar para um dado que não se pode obter.

---

## Plano por faceta (dados → ia → api → ui)

| Faceta | Ação | Camada | Prioridade |
|---|---|---|---|
| **dados** | Auditar se o motor de BANDS (15min) já condiciona por estado de placar corrente | pré-requisito | **Alta — fazer primeiro** |
| **dados** | Confirmar se `tackles_won_pct`/`duels_won_pct` guardam os brutos por trás do percentual | pré-requisito | Alta |
| **dados** | Mapear por que `role`/`grid` tem só ~55% de cobertura (sistemático vs. espalhado) | pré-requisito | Média |
| **dados** | Ingestão de `coach.fixtures`/`coach.teams` via SportMonks (se decidido seguir) | EXPLICAR fraco | Baixa, opcional |
| **ia (EXPLICAR)** | Vocabulário de matchup por papel tático (dribbled_past, duels/aerials_won_pct via role) como frase de contexto, com agregação per-90 + shrinkage + disclaimer de amostra | EXPLICAR | Média, condicional às auditorias de dados |
| **ia (EXPLICAR)** | Perfil temporal por time (BANDS) só depois de estratificar por placar, excluir cartão vermelho, empilhar temporadas | EXPLICAR | Baixa, condicional à Etapa 0 |
| **ia (ESTIMAR)** | Nenhuma feature nova de tática/setor entra sem teste out-of-sample (RPS/log-loss) contra o motor atual como baseline | ESTIMAR | N/A — regra permanente, não tarefa pontual |
| **api** | Se treinador entrar, servir como campo de contexto dentro do dossiê (nunca como filtro/ranqueador) | EXPLICAR | Baixa |
| **ui** | Renderizar qualquer narrativa de setor/tática com o piso de amostra visível, nunca como "dica de aposta por matchup" | EXPLICAR | Média, junto com o item de ia (EXPLICAR) |
| **validar** | Nenhuma ação possível — mrtip não tem tabela de odds | VALIDAR | Bloqueado até existir dado de mercado |

---

## Riscos e gotchas

1. **Dupla-contagem de sinal.** As 66 colunas de `lineup_player` medem o mesmo evento subjacente de formas redundantes (won/lost/pct). Se uma métrica entra em EXPLICAR, não pode também recalibrar o número em ESTIMAR por fora. `severity: high`
2. **Reembalar score effect como tática.** Qualquer leitura de "esse time cai no fim do jogo" ou "esse time ataca mais em tal faixa" sem condicionar por placar corrente está, com alta probabilidade, medindo o placar, não o time. `severity: high`
3. **Confound de força de elenco / endogeneidade.** Métricas de contagem por jogador (tackles, ball_recoveries, clearances) são confundidas por sistema/estilo do time, não por qualidade individual — mesmo padrão do confound de formação em SIN-014, agora em métrica individual. `severity: high`
4. **Presunção de "já precificado" não é fato provado.** É presunção forte (mercado eficiente, informação pública, ausência de evidência de brecha), não medição direta — o mrtip não tem dado de odds para testar isso contra preço real. Tratar como hipótese de trabalho, não como certeza. `severity: medium`
5. **Amostra pequena / EPV baixo em qualquer matchup pareado ou faixa temporal.** 380 confrontos possíveis ≈ 380 jogos/temporada; ~9 gols/faixa/temporada por time com ≈33% de ruído relativo. Nenhuma dessas granularidades tem amostra própria suficiente numa única temporada. `severity: high`
6. **Overfitting em backtest com múltiplas tentativas.** Testar vários cruzamentos novos (setor, banda, matchup) no mesmo histórico de ~380 jogos/temporada sem correção por número de tentativas produz "sinal" aparente mesmo com efeito real zero. `severity: medium`
7. **Vazamento de dado / tautologia.** Confirmar sempre que uma feature é calculável antes do apito inicial — não basta existir no banco, precisa existir a tempo. `severity: high`
8. **Reconstruir dado que a fonte não expõe.** Formação dinâmica, treinador, xG e rede de passe com par emissor-receptor não são reconstruíveis com heurística — já checado como impossível na prática (campo de posição do substituto vem nulo). `severity: medium`
9. **Cobertura desigual de `role`/`grid` (~55%) concentrada onde a informação seria mais valiosa** (jogador que troca de função). Qualquer narrativa de papel tático corre risco de enviesar a favor de titulares fixos. `severity: medium`

---

## REFUTADO (consolidado das 6 frentes, com o motivo que derrubou)

### F1 — Treinador anti-tático

- **Citação de Greg Mathieson/Liverpool** (análise começa 15-20 dias antes, apresentação 3 dias antes) — o refutador reabriu a página e o trecho não estava lá; a própria pesquisa já havia rebaixado para `snippet`. Não usar como número. [Coaches' Voice — opposition-analyst-football-explained]
- **"5 zonas" de escanteio como padrão** — fonte é página de produto da Nacsport (vendor de software de análise de vídeo), conteúdo de marketing, não pesquisa/relato de analista nomeado. [nacsport.com/.../opponents-set-pieces-football]
- **Dossiê pré-jogo com árbitro + clima genérico** — footiehound.com segue o padrão de blog de dica de aposta proibido pela regra 4 do protocolo; bloqueado com 403 na reverificação, sem número nem n. [footiehound.com/.../weather-and-pitch-conditions]
- **Myers (2012), regra 58-73-79 de substituição, n=485** — superado pela reanálise bayesiana de Silva & Swartz (2016, n=4.226, 8,7× maior), que encontrou IC 95% cobrindo zero em toda a 2ª etapa; provável causalidade reversa (times que já vão bem seguem "a regra" e vencem por outros motivos). [sfu.ca/~tswartz/papers/substitution.pdf]
- **Del Corral, Barros & Prieto-Rodríguez (2008)** — nunca aberto (citação de segunda mão via outros papers), e redundante com fontes primárias abertas mais fortes (Copas do Mundo n=549; Amez et al. n=154 mil).
- **"15 de 16 times jogavam zonal na Champions 2003/04"** usada como descrição do "presente" — amostra de 1 temporada, 20+ anos atrás. Exemplos de marcação individual (Vogts, Gentile etc.) vêm da Wikipedia (fonte terciária), servem só de cor histórica. [en.wikipedia.org/wiki/Marking_(association_football)]
- **Rede de passes/jogadores-hub, n=45 jogos J-League** — non-sequitur: mede robustez estrutural da própria rede do time, não se treinadores identificam e atacam a conexão entre dois jogadores do rival; amostra pequena para padrão de futebol. [arxiv.org/abs/2003.13465]
- **Padrão híbrido de marcação + "marcação dupla libera companheiro"** — snippets sem número, quase tautológico. [totalfootballanalysis.com/.../man-marking]

### F2 — Apostador profissional e tática

- **Movimento de preço Man Utd/Rooney (1,63→1,45)** — blog de trading, proibido pela regra 4; n=1 anedota escolhida a dedo. [sportstradinglife.com/.../how-team-news-can-impact-betfair-markets]
- **"3-4 ticks médios" de movimento no dia do jogo** — mesma fonte proibida; nem responde à pergunta de escalação especificamente. [sportstradinglife.com/.../pre-match-price-moves]
- **Odds "under" de escanteios subavaliadas na PL** — TCC de mestrado (Lund), não peer-reviewed, zero número de efeito capturado, não generaliza para Bundesliga, e é sobre volume de chutes/escanteios, não sinal tático declarado. [lup.lub.lu.se/student-papers/.../9127013.pdf]
- **Star Lizard: ~30 pesquisadores, monitora tática/xG em tempo real** — "30 pesquisadores" vem de fórum citando terceiro nunca aberto; "tática+xG" vem do próprio site de marketing da empresa sobre si mesma — conflito de interesse máximo. [starlizard.com]
- **Apostadores citados na Bleacher Report rejeitando leitura tática** — jornalismo, n≈3 autosselecionados; quem tem edge real e durável tem incentivo a não falar com repórter. [bleacherreport.com/.../mugs-and-millionaires]
- **Bernardo, Ruberti & Verona (2019): mercado ineficiente na troca de treinador** — abstract reverificado não tem nenhum número (sem n, sem ROI%); presença de significância sem magnitude reportável. [ideas.repec.org/.../quaeco]
- **Brasileirão 2010-2020 (n=4.180, 379 trocas), ROI positivo em janelas específicas pós-demissão** — DOI redirecionou pro índice genérico do periódico na reverificação; precisão numérica suspeita para confiança rotulada apenas "snippet". [doi.org/10.32731/IJSF.202.052025.02]
- **"The sacking illusion" (2026), números de ATT (-0,18 a +0,13)** — não reverificado nesta rodada (orçamento de busca esgotado); mesmo padrão de precisão suspeita para "snippet". [tandfonline.com/.../02640414.2026.2698238]
- **"Notícia de escalação é gatilho de movimento de linha"** — fightmatrix.com é historicamente site de rankings de MMA/boxe, fonte incoerente com o conteúdo mesmo para um claim qualitativo sem número. [fightmatrix.com/.../how-football-betting-markets-react]

### F3 — Métodos além do cruzamento A×B

- **Zhong et al. (Biology of Sport): classificadores por estilo tático preveem V/D com AUC 0,783/0,726, n=869** — tautologia/vazamento: as 30 variáveis preditoras (posse, passes, desarmes, chutes) são estatísticas do próprio jogo cujo resultado está sendo "previsto" — confirmado por fetch direto. [pmc.ncbi.nlm.nih.gov/articles/PMC12954490]
- **STEVE (team embeddings): supera baseline em RMSE de valor de mercado (111 vs 174M€)** — tarefa errada (valor de mercado, não resultado de jogo); embedding provavelmente só captura reputação/força de clube, a mesma coisa que Elo já captura. [arxiv.org/abs/1908.00698]
- **HIGFormer (grafo jogador-time): bate baselines em 3,9-5,4 p.p., n=1.941** — baselines comparados eram redes genéricas, não um rating forte tipo pi-ratings; sem esse baseline, o ganho não isola se o grafo soma algo além do que um rating simples já capturaria. [arxiv.org/html/2507.10626v1]
- **GAP ratings (Wheatcroft): lucro médio +5,01% (IC 3,38-6,76%), n=49.884** — sem comparação contra baseline de rating único, sem correção por múltiplas tentativas; padrão exatamente do tipo que a literatura de overfitting em backtest (Bailey & López de Prado) ensina a desconfiar. [arxiv.org/abs/2001.09097]
- **"Modelagem chique não bateu rating simples" (RPS pi-ratings 0,2085 vs DL 0,2098-0,2141)** — desvios-padrão do próprio estudo se sobrepõem à diferença entre os pontos; "vence" é forte demais para o que os números sustentam (mas a versão inversa — são estatisticamente equivalentes — sobrevive). [arxiv.org/abs/2309.14807]

### F4 — Cruzamento por setor ofensivo × defensivo

- **Grid 6x3 (18 zonas), Zona 14 como área mais valiosa** — `snippet`, blog não especializado, nunca verificado-fetch; ruído sem uso na conclusão. [manchestercityanalysis.com/zones-in-football]
- **Dribles sofridos por 90min "especialmente significativo" para laterais** — sem URL rastreável.
- **Taxa de desarme favorece defensor conservador** — origem incerta, nem quem escreveu se sabe apontar.
- **Pouca posse → mais desarmes/interceptações naturalmente** — sem fonte, plausível mas não verificável.
- **Modelo Bayesiano beta-binomial para pênalti como precedente de shrinkage em futebol** — sem URL, não verificável como precedente concreto.
- **Ponderar por minutos é problemático para rating 0-10** — sem URL; e rating não é insumo cotado pro setor no schema mrtip, também irrelevante.
- **Deslocar foco de ataque via ajuste tático deliberado** — sem URL; formulação mais especulativa da seção, tipo narrativa de comentarista sem dado atrás.
- **Cluster analysis, final Copa do Brasil sub-20 2018** — n=2 jogos, 312 sequências, categoria de base; anedota, não evidência, mesmo verificado-fetch. [journals.sagepub.com/doi/abs/10.1177/17479541231186796]
- **Herold et al. (2022), pressão defensiva sem bola via tracking, seleção alemã** — `snippet`, de um único time nacional, não compara matchup lateral×ponta, tangencial. [doi.org/10.1080/02640414.2022.2081405]
- **Duels_won_pct Liverpool (50,6% vs 47,5%) e Bournemouth (47,6%)** — verificado-fetch mas anedótico (2-3 casos escolhidos), redundante com o achado mais forte (glossário SportMonks). [theanalyst.com/.../liverpools-duel-woes]
- **1.826 partidas: escanteios não correlacionam com gols** — blog pessoal no Medium, não peer-reviewed, correlação bruta sem controle de posse/placar/força. [medium.com/@stefanleanie/.../does-corners-really-matter]
- **Arsenal 16 gols de escanteio; Midtjylland 39% de gols de bola parada** — casos extremos escolhidos a dedo, survivorship bias clássico. [statswing.com/research/aerials]
- **Elo ajustado por altura para duelo aéreo "confirma que altura pesa" (K League, n=33.163)** — fonte real e peer-reviewed, mas AUROC=0,649 é discriminação fraca pelo critério convencional (abaixo de 0,70=pobre); interpretação inflada — leitura correta é "efeito residual fraco". [bepro.ai/news-updates/aerial-duel-elo-rating]

### F5 — Janela de 15 minutos cruzada com tática

- **2º tempo tem mais gols que 1º (Mendes, Malacarne, Anteneodo 2007)** — nunca aberto (paywall/403), citado como "consenso" mas usado para sustentar direção numérica nunca verificada. [link.springer.com/.../epjb/e2007-00177-4]
- **Posse maior perdendo, La Liga 2008-09, p<0,01** — rótulo "verificado-fetch" inflado: só um mirror (docslib) foi aberto, não a fonte primária (doi.org/10.2478/v10078-010-0036-z).
- **Efeito de cartão vermelho "não constante" por janela (Copa do Mundo, n=84 cartões/320 jogos)** — subamostra de ~28 cartões/janela; efeito no time sancionado não é significativo em 2 de 3 janelas testadas — sobreinterpretação de pontos não-significativos, e é amostra de Copa do Mundo, não liga doméstica. [link.springer.com/.../s00181-017-1287-5]
- **"Triangulação independente" de 30% de concordância de formação entre provedores (survey Frontiers 2024)** — não confirmado se é medição nova ou recitação do mesmo estudo que SIN-014 já usa; moldura de "confirmação cruzada" cai, o número em si permanece do survey. [frontiersin.org/.../fspor.2024.1512386]
- **Rey et al. (2015) e Gomez, Lago-Peñas & Owen (2016), janelas de minuto para substituição** — ambos citados de segunda mão dentro da revisão de Amez et al., nunca abertos diretamente. [repository.uantwerpen.be/docman/irua/1dfa49/177409av.pdf]
- **Bloco de 6 citações sobre cartão vermelho** (Ridder/Cramer/Hopstaken 1994, Caliendo & Radic 2006, Bar-Eli et al. 2006, Vecer/Kopriva/Ichiba 2009, Mechtel et al. 2011, Titman et al. 2015) — todas de segunda mão via um único paper de 2017, sem número próprio sustentado. [docs.iza.org/dp10174.pdf]

### F6 — Treinador como entidade de dado

- **Leitura da Figura 5 do Coach2vec (distância geométrica de perfil entre treinadores multi-clube)** — impossível extrair informação geométrica confiável de uma ferramenta de fetch que converte figura em texto; leitura matematicamente implausível, tratar como não-evidência.
- **Barcelona 2012/13 (sem Guardiola) mantendo padrão de passe único** como evidência de "estilo é do elenco, não do treinador" — n=1 clube/1 transição, com confound de continuidade admitido pela própria frente (Vilanova era assistente direto de Guardiola, não uma ruptura de escola tática). [arxiv.org/pdf/1409.0308] (o dado numérico bruto do z-score em si não é contestado — só a inferência causal construída em cima do caso).
- **Furlan, Grandinetti & Rentocchini (2023): treinador carrega "rotina" que sobrevive à troca de clube** — nunca aberto (4 tentativas falharam), e o construto "rotina" é ambíguo — pode medir prática administrativa, não estilo tático em campo; desqualificado como "achado mais direto" para a pergunta sobre estilo tático.

---

## Perguntas abertas / NEI

- **Motor de BANDS já condiciona por estado de placar corrente?** Não verificado nesta pesquisa — pergunta de schema/código, é a auditoria de maior prioridade decorrente deste documento.
- **`tackles_won_pct`/`duels_won_pct` guardam os brutos por trás do percentual?** NEI — se não, agregação por média simples está errada e não deve ser feita até confirmação (para `aerials_won`/`aerials_lost` os brutos já existem separados).
- **Por que `role`/`grid` tem só ~55% de cobertura — sistemático ou espalhado?** Fora do escopo desta pesquisa, mas pré-requisito para investir em narrativa de papel tático.
- **Quanto o preço de mercado se move especificamente na confirmação da escalação?** NEI honesto e real, buscado de forma sistemática na literatura clássica de eficiência de mercado em apostas — não é buraco de busca malfeita, é lacuna real da literatura.
- **Profundidade histórica exata do include `coach.fixtures` da SportMonks.** NEI — a documentação não dá o número; só uma chamada real na API resolve.
- **O endpoint `Coaches` da SportMonks exige add-on pago?** NEI — a página de comparação de planos não lista como restrito, mas também não confirma inclusão.
- **Cobertura real de coaches/fixtures vinculadas para Premier League e Brasileirão** na assinatura específica do mrtip. NEI — só verificável com chamada real na API.
- **Matchup lateral × ponta isolado da força geral dos times.** NEI puro — busca sistemática em StatsBomb Conference, Google Scholar, Semantic Scholar e OpenAlex não encontrou nenhum estudo que isole esse efeito controlando força de time.
- **Números do Galdino et al. 2025 (Brasileirão, ROI por janela pós-demissão, n=4.180)** não puderam ser reverificados nesta rodada (DOI redirecionou para índice genérico) — é a citação mais aplicável ao produto (única sobre Brasileirão especificamente) e por isso merece leitura de texto completo antes de qualquer uso, mesmo narrativo.
- **Números de "The sacking illusion" (2026)** não reverificados nesta rodada (orçamento de busca esgotado) — mesmo padrão de precisão suspeita para confiança "snippet" observado em Galdino et al.
- **Tensão de leitura em Bryson et al. (2021)**: resumo oficial dos autores enfatiza o efeito pequeno-mas-significativo da especificação condicional como achado central, não como limite superior descartável — divergência de ênfase não resolvida entre a frente original e o refutador (não muda a conclusão prática, porque o efeito é condicionado a informação só conhecida depois do fato).

---

## Fontes

Rótulos preservados como capturados na pesquisa. URLs vazias ou ausentes nas fontes originais (citação sem link rastreável) estão marcadas como tal, sem link inventado.

### F1 — Treinador anti-tático

**Usadas / sobreviventes:**
- FSI Training — *How Football Tactical Analysts Work in Professional Soccer* — `verificado-fetch` — https://fsi.training/en/blogs/how-tactical-analysts-work-in-professional-teams
- Coaches' Voice — *Opposition Analyst: explained* — `verificado-fetch` — https://learning.coachesvoice.com/cv/opposition-analyst-football-explained/
- Coaches' Voice — *Tottenham 1 Arsenal 4: tactical analysis* (fev/2026) — `verificado-fetch` — https://learning.coachesvoice.com/cv/tottenham-arsenal-tactics-february-2026/
- Total Football Analysis — *Scout Reports: How to effectively scout your opposition* — `verificado-fetch` — https://totalfootballanalysis.com/article/scout-reports-how-to-effectively-scout-your-opposition-tactical-analysis-tactics
- Total Football Analysis — *Tactical theory: Defending the half-space* — `verificado-fetch` — https://totalfootballanalysis.com/article/tactical-theory-defending-half-space-tactical-analysis-tactics
- Wikipedia — *Marking (association football)* — `verificado-fetch` (cor histórica apenas) — https://en.wikipedia.org/wiki/Marking_(association_football)
- PMC — *Analysing substitutions in recent World Cups and European Championships* — `verificado-fetch` — https://pmc.ncbi.nlm.nih.gov/articles/PMC11167463/
- Tamura & Masuda (2015), arXiv:1503.02484 — `verificado-fetch` (preprint) — https://arxiv.org/abs/1503.02484
- Amez, Neyt, Van Nuffel & Baert (2021), *Psychology of Sport and Exercise* — `verificado-fetch` — https://repository.uantwerpen.be/docstore/d:irua:5838
- Silva & Swartz (2016), *Journal of Quantitative Analysis in Sports* — `verificado-fetch` — https://www.sfu.ca/~tswartz/papers/substitution.pdf

**Descartadas (ver REFUTADO):**
- Coaches' Voice — *Opposition Analyst: explained* (citação Mathieson não confirmada) — https://learning.coachesvoice.com/cv/opposition-analyst-football-explained/
- Nacsport — set-piece zones — https://www.nacsport.com/blog/en-gb/Tips/opponents-set-pieces-football
- Footiehound — weather/pitch conditions — https://footiehound.com/the-role-of-weather-and-pitch-conditions-in-match-outcomes/ (403 na reverificação)
- Silva & Swartz (usado para refutar Myers 2012, sem URL própria do Myers original) — https://www.sfu.ca/~tswartz/papers/substitution.pdf
- Del Corral, Barros & Prieto-Rodríguez (2008) — sem URL rastreável
- Wikipedia — Marking (usado indevidamente como base de mecanismo, não só cor) — https://en.wikipedia.org/wiki/Marking_(association_football)
- Rede de passes/hub players, J-League n=45 — https://arxiv.org/abs/2003.13465
- Total Football Analysis — man-marking — https://totalfootballanalysis.com/tactical-theory-man-marking-tactical-analysis-tactics

### F2 — Apostador profissional e tática

**Usadas / sobreviventes:**
- Constantinou, arXiv:2003.09384 (handicap asiático) — `verificado-fetch` — https://arxiv.org/abs/2003.09384
- Heuer, Müller & Rubner, *PLoS ONE* (Bundesliga, troca de treinador) — `verificado-fetch` — https://pmc.ncbi.nlm.nih.gov/articles/PMC3062541/
- arXiv:2505.21275 (Bundesliga, antecipação de gol em mercado ao vivo) — `verificado-fetch`, usado por `inferência` — https://arxiv.org/html/2505.21275

**Descartadas (ver REFUTADO):**
- Sports Trading Life — Rooney/Man Utd — https://sportstradinglife.com/2012/10/how-team-news-can-impact-betfair-markets/
- Sports Trading Life — movimento pré-jogo — https://sportstradinglife.com/2015/04/what-causes-the-sudden-pre-match-price-moves-on-betfair/
- TCC Lund (Universidade de Lund) — escanteios under — https://lup.lub.lu.se/student-papers/record/9127007/file/9127013.pdf
- Star Lizard (site institucional) — https://starlizard.com/
- Bleacher Report — Mugs and Millionaires — https://bleacherreport.com/articles/2200795-mugs-and-millionaires-inside-the-murky-world-of-professional-football-gambling
- Bernardo, Ruberti & Verona (2019) — https://ideas.repec.org/a/eee/quaeco/v71y2019icp239-246.html
- Galdino et al. (Brasileirão 2010-2020) — https://doi.org/10.32731/IJSF.202.052025.02 (não reverificado — ver Perguntas Abertas)
- "The sacking illusion" (2026) — https://www.tandfonline.com/doi/full/10.1080/02640414.2026.2698238 (não reverificado — ver Perguntas Abertas)
- Fightmatrix — market reaction — https://www.fightmatrix.com/2026/07/14/how-football-betting-markets-react-to-information-in-real-time/

### F3 — Métodos além do cruzamento A×B

**Usadas / sobreviventes (citadas por nome na pesquisa; URL não capturada nas seções de insumo para todas):**
- Robberechts & Davis (KU Leuven) — Elo+ODM vs. Elo, 4 Copas do Mundo + 216.743 jogos de 52 ligas — `verificado-fetch` — https://lirias.kuleuven.be/server/api/core/bitstreams/7527e8cb-f047-4ef5-8395-89edd5ddc792/content (URL recuperada do transcript do agente de pesquisa em 2026-07-20; a síntese a havia perdido). **Ler com a correção do TL;DR: ODM = Offense-Defense Model, dois escalares por time, não decomposição por setor.**
- Berrar — ratings de ataque/defesa vs. deep learning, RMSE de placar exato — `verificado-fetch` (URL não propagada)
- Bailey & López de Prado — deflated Sharpe ratio / minimum backtest length — `verificado-fetch` (URL não propagada)

**Descartadas (ver REFUTADO):**
- Zhong et al., *Biology of Sport* — https://pmc.ncbi.nlm.nih.gov/articles/PMC12954490/
- STEVE (team embeddings) — https://arxiv.org/abs/1908.00698
- HIGFormer — https://arxiv.org/html/2507.10626v1
- GAP ratings (Wheatcroft) — https://arxiv.org/abs/2001.09097
- Comparação pi-ratings vs. deep learning — https://arxiv.org/abs/2309.14807

### F4 — Cruzamento por setor ofensivo × defensivo

**Usadas / sobreviventes:**
- Stats Perform / OptaPro — *A New Metric for Evaluating 1v1 Ability* (Bradley-Terry, n=114.063 duelos) — `verificado-fetch` — https://www.statsperform.com/insights/a-new-metric-for-evaluating-1v1-ability/
- Documentação StatsBomb/Wyscout (schema de coordenada de evento x,y) — `verificado-fetch` — https://support.wyscout.com/matches-wyid-events
- Glossário SportMonks (limitação de estatística agregada em amostra pequena) — `verificado-fetch` (fonte primária do próprio pipeline do mrtip)
- Rede de passes, LaLiga 2018/19, n=380 jogos (estabilidade espacial por time) — `verificado-fetch` (URL não propagada às seções de síntese)
- arXiv 2508.04008 — 15 temporadas × 5 ligas, distorção de score effect no volume ofensivo — `verificado-fetch`
- StatsBomb — admissão sobre limite do Aerial Unit Strength (Everton) — `verificado-fetch` (URL não propagada)
- Opta Analyst / the-footballanalyst.com / getgoalsideanalytics — confound de sistema em métricas defensivas — `verificado-fetch` (URLs não propagadas às seções de síntese)

**Descartadas (ver REFUTADO):**
- Manchester City Analysis — zonas do campo — https://manchestercityanalysis.com/zones-in-football
- Cluster analysis, Copa do Brasil sub-20 2018 — https://journals.sagepub.com/doi/abs/10.1177/17479541231186796
- Herold et al. (2022) — https://doi.org/10.1080/02640414.2022.2081405
- The Analyst — duelos Liverpool/Bournemouth — https://theanalyst.com/articles/liverpools-duel-woes-timid-league-cup-final
- Medium (Stefan Leanie) — escanteios não importam — https://medium.com/@stefanleanie/football-data-analytics-does-corners-really-matter-and-other-in-match-stories-33f00e04af99
- Statswing — Arsenal/Midtjylland aéreo — https://www.statswing.com/research/aerials/
- Bepro.ai — Elo ajustado por altura, K League — https://bepro.ai/news-updates/aerial-duel-elo-rating

### F5 — Janela de 15 minutos cruzada com tática

**Usadas / sobreviventes:**
- Dixon & Robinson (1998), *The Statistician* — `verificado-fetch` — https://www.ma.imperial.ac.uk/~ejm/M3S4/Problems/football.pdf
- arXiv 2508.04008 (15 temporadas × 5 ligas, ~4M observações-minuto) — `verificado-fetch`
- Amez, Neyt, Van Nuffel & Baert (2021) — `verificado-fetch` — https://repository.uantwerpen.be/docstore/d:irua:5838
- Silva & Swartz (2016) — `verificado-fetch` — https://www.sfu.ca/~tswartz/papers/substitution.pdf
- Documentação oficial SportMonks (`formations` sem timestamp, `SUBSTITUTION` sem posição) — `verificado-fetch`
- Estudo de 3.433 partidas / 21 ligas (curva de gol não-uniforme) — `verificado-fetch` (URL não propagada)
- Estudo Copa do Mundo/Euros (n=549 jogos, timing de substituição por placar) — `verificado-fetch` — fonte PMC (URL específica não propagada às seções de síntese)

**Descartadas (ver REFUTADO):**
- Mendes, Malacarne & Anteneodo (2007) — https://link.springer.com/article/10.1140/epjb/e2007-00177-4
- La Liga 2008-09 posse ao perder — https://doi.org/10.2478/v10078-010-0036-z
- Cartão vermelho por janela, Copa do Mundo — https://link.springer.com/article/10.1007/s00181-017-1287-5
- Survey Frontiers in Sports 2024 (30% concordância de formação, moldura de "triangulação" descartada) — https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1512386/full
- Rey et al. / Gomez, Lago-Peñas & Owen — https://repository.uantwerpen.be/docman/irua/1dfa49/177409av.pdf
- Bloco de 6 citações sobre cartão vermelho — https://docs.iza.org/dp10174.pdf

### F6 — Treinador como entidade de dado

**Usadas / sobreviventes:**
- Lundkvist et al. (2026), "The sacking illusion" — `verificado-fetch` (reconferido via PubMed) — URL não propagada às seções de síntese
- Revisão sistemática PRISMA, *Biology of Sport* — `verificado-fetch`
- Zart & Güllich (2022) — `verificado-fetch` (reconferido via PubMed)
- Bryson et al. (2021), IZA DP 14104 — `verificado-fetch` (resumo oficial reverificado; tensão de leitura registrada em Perguntas Abertas)
- Documentação oficial SportMonks — endpoints `Coach`, include `coaches.fixtures`/`coach.teams` — `verificado-fetch`

**Descartadas (ver REFUTADO):**
- Coach2vec (Cintia & Pappalardo 2021), leitura da Figura 5 — sem URL própria capturada; claim descartado por implausibilidade de método de extração
- Gyarmati et al. (2014), caso Barcelona/Vilanova — dado numérico (z-score) confirmado, inferência causal descartada — https://arxiv.org/pdf/1409.0308
- Furlan, Grandinetti & Rentocchini (2023) — nunca aberto (4 tentativas falharam), sem URL própria capturada

---

## Referências internas

- [sinal-formacao-tatica.md](./sinal-formacao-tatica.md) — SIN-014, formação declarada como EXPLICAR.
- [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md) — refutação-mãe (matchup de estilo/tática ≠ edge pré-jogo além do mercado).
- [taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) — 3 camadas ESTIMAR/EXPLICAR/VALIDAR + anti-dupla-contagem.
