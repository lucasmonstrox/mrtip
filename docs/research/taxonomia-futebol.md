# Taxonomia do Futebol (Football Taxonomy)

Esta taxonomia é uma referência de domínio abrangente e bilíngue (PT-BR/EN) do futebol, pensada para servir tanto como material de consulta humana quanto como base para modelagem de dados. Ela organiza o conhecimento do jogo em nove ramos — de posições e formações a táticas, regras, métricas, competições, jargão e atributos de jogador — com cada termo apresentado em português e inglês para eliminar ambiguidade entre as duas convenções de nomenclatura. Cada ramo é hierárquico: parte das categorias macro e desce até os termos folha, de modo que a estrutura possa ser percorrida tanto de cima para baixo (entendendo o campo) quanto consultada pontualmente (procurando um termo).

## Sumário

1. [Posições e Funções (Positions & Roles)](#1-posições-e-funções-positions--roles)
2. [Formações e Sistemas de Jogo (Formations & Systems)](#2-formações-e-sistemas-de-jogo-formations--systems)
3. [Conceitos e Estilos Táticos (Tactical Concepts & Styles)](#3-conceitos-e-estilos-táticos-tactical-concepts--styles)
4. [Fases e Momentos do Jogo (Phases & Moments of Play)](#4-fases-e-momentos-do-jogo-phases--moments-of-play)
5. [Regras do Jogo (Laws of the Game — IFAB)](#5-regras-do-jogo-laws-of-the-game--ifab)
6. [Métricas e Estatísticas (Metrics & Analytics)](#6-métricas-e-estatísticas-metrics--analytics)
7. [Competições e Estruturas (Competitions & Structures)](#7-competições-e-estruturas-competitions--structures)
8. [Termos, Jargão e Habilidades Técnicas (Terms, Jargon & Skills)](#8-termos-jargão-e-habilidades-técnicas-terms-jargon--skills)
9. [Atributos e Perfis de Jogador (Player Attributes & Profiles)](#9-atributos-e-perfis-de-jogador-player-attributes--profiles)

## Como esta taxonomia se conecta (modelagem)

A tabela abaixo mapeia cada ramo a uma sugestão concreta de modelagem de dados (enum, tabela ou relação). É um ponto de partida para quem for transformar esta referência em schema — os nomes seguem convenção `snake_case` para tabelas e `PascalCase` para enums/tipos.

| # | Ramo | Sugestão de entidade / enum | Observações de modelagem |
|---|------|------------------------------|---------------------------|
| 1 | Posições e Funções | enum `Position` (GK, CB, FB, DM, CM, AM, W, ST…) + tabela `player_roles` | Separe **posição** (slot no campo) de **função/role** (mezzala, regista). Tabela ponte `player_role_assignments` (player × role × peso). Mapeie a numeração de camisa em `shirt_number` e o "número de função" (6/8/10/9) em `role_number`. |
| 2 | Formações e Sistemas | enum `Formation` (`F_4_3_3`, `F_4_2_3_1`…) + tabela `formation_variants` | Guarde a string canônica (`"4-3-3"`) e as variantes (`"4-3-3 false 9"`). Modele **forma por fase** com `formation_phase` (in_possession / out_of_possession). |
| 3 | Conceitos e Estilos Táticos | tabela `tactical_concept` + enum `TacticalCategory` | Categorias: filosofia, princípio ofensivo, princípio defensivo, transição. Auto-relação `related_concept` para ligar tiki-taka ↔ jogo de posição. Coluna `school` para escola/filósofo. |
| 4 | Fases e Momentos | enum `GamePhase` (4 fases) + enum `SubMoment` | Bola parada como `set_piece` (quinta fase). Útil para taggear eventos: cada `match_event` referencia uma `phase` + `sub_moment`. |
| 5 | Regras do Jogo | tabela `law` (17 leis IFAB) + enum `Sanction` / `RestartType` | `law_number` (1–17), `concept` (impedimento, DOGSO, SPA). Enums separados: `CardType`, `RestartType` (tiro livre, pênalti, lateral…), `VarDecision`. |
| 6 | Métricas e Estatísticas | tabela `metric_definition` + tabela `match_metrics` | `metric_definition` (chave, nome PT/EN, o que mede, fórmula, provedor). `match_metrics` liga (match × player/team × metric × value). enum `DataProvider` (Opta, StatsBomb, FBref, Understat). |
| 7 | Competições e Estruturas | enum `CompetitionFormat` + tabela `competition` | `CompetitionFormat` (liga, mata_mata, grupos, ida_volta, suico). Mecanismos em colunas: `promotion_relegation`, `points_system`, `tiebreakers` (array ordenado). enum `CompetitionType` (liga, copa, supercopa, continental, selecoes). |
| 8 | Termos, Jargão e Habilidades | tabela `glossary_term` | `term_pt`, `term_en`, `category` (drible, passe, finalização, ação defensiva…), `synonyms` (array), `origin`, `example`. Base do sistema de busca/autocomplete. |
| 9 | Atributos e Perfis | enum `AttributeCategory` + tabela `attribute` + tabela `player_archetype` | `attribute` (técnico/físico/mental/goleiro, ref. FM e métrica FBref correspondente). `player_archetype` (perfil por setor) com relação para `attribute` (peso por atributo). |

Relação transversal sugerida: `match_event` (tabela de eventos) referencia simultaneamente `Position`, `GamePhase`/`SubMoment`, `glossary_term` (a ação) e alimenta `match_metrics` — é o ponto onde os ramos 1, 4, 6 e 8 se cruzam.

## Convenções

- **Formato dos termos:** cada item aparece como **Termo PT (Term EN)** — definição. Ex.: **Volante (Defensive midfielder)** — meio-campista posicionado à frente da defesa, responsável por proteger a linha e iniciar a construção.
- **Sem termo PT consagrado:** quando não existe tradução estabelecida em português e o termo é usado em inglês mesmo no Brasil, marca-se **(sem termo PT consagrado)** e mantém-se o termo original. Ex.: **Raumdeuter (sem termo PT consagrado)** — "intérprete de espaço", atacante que vive de leitura de espaços vazios.
- **Sinônimos:** listados após a definição quando relevantes, separados por vírgula e precedidos de "tb.:" (também conhecido como). Ex.: tb.: cabeça de área, primeiro volante.
- **Direção de tradução:** o português brasileiro é a língua-base; o inglês entre parênteses segue a convenção internacional (geralmente britânica) usada na literatura tática e nos provedores de dados.

---

## Posições e Funções (Positions & Roles)

Distingue-se aqui **posição** (zona nominal no campo), **posicionamento** (onde o jogador efetivamente fica) e **função/role** (a tarefa tática). Os termos seguem o padrão bilíngue PT-BR / EN.

### Sistema de numeração (Numbering systems)

#### Numeração clássica das camisas (Classic shirt numbers, 1-11)

Herança do esquema 2-3-5 e depois do WM; ainda referenciada na fala tática mesmo quando os números das camisas hoje são livres.

| Nº | Posição PT | Position EN |
|----|------------|-------------|
| 1 | Goleiro | Goalkeeper |
| 2 | Lateral-direito | Right-back |
| 3 | Lateral-esquerdo | Left-back |
| 4 | Zagueiro (ou volante, no Brasil) | Centre-back (or defensive mid in BR) |
| 5 | Zagueiro / Volante | Centre-back / Defensive midfielder |
| 6 | Volante / Lateral-esquerdo (BR) | Defensive midfielder / LB (BR) |
| 7 | Ponta-direita | Right winger |
| 8 | Meia-central | Central midfielder |
| 9 | Centroavante | Centre-forward / Striker |
| 10 | Meia-armador | Attacking midfielder / Playmaker |
| 11 | Ponta-esquerda | Left winger |

> Nota BR: no Brasil a camisa 5 costuma ser o primeiro volante e a 4/6 são zagueiro e lateral-esquerdo — divergindo do padrão europeu da tabela. Historicamente o zagueiro do lado direito era o "zagueiro central" e o do lado esquerdo o **quarto-zagueiro (fourth defender)**, terminologia hoje em desuso.

> Nota etimológica: **volante** vem do português brasileiro inspirado em Carlos Volante, meia argentino que atuava recuado no Flamengo dos anos 1940; o termo virou sinônimo do meio-campista de contenção no Brasil.

#### Números de função (Role numbers / positional shorthand)

Linguagem tática moderna que nomeia a *função* pelo número, independente da camisa.

- **Número 6 (Number 6 / "the six")** — Volante de contenção/organização na base do meio-campo (single pivot); protege os zagueiros e inicia a construção. (ex.: Rodri, Casemiro)
- **Número 8 (Number 8 / "the eight")** — Meia-central completo, mais adiantado que o 6, chega à área e liga as faixas. (ex.: De Bruyne em fases recuadas, Bellingham)
- **Número 10 (Number 10 / "the ten")** — Meia-armador entre linhas, o criador clássico. (ex.: Zidane, Riquelme)
- **Número 9 (Number 9 / "the nine")** — Centroavante referência de área. (ex.: Haaland)
- **Número 9 falso (False 9)** — Ver em Atacantes.
- **Número 9 e meio / "nove e meio" (Number 9½ / shadow striker)** — Híbrido entre o 10 e o 9: segundo atacante que ataca o gol vindo de trás (ver "atacante-sombra"). (ex.: Roberto Baggio, Raúl)
- **"Duplo pivô" (Double pivot)** — Dois volantes lado a lado (6+6 ou 6+8) na base. (ex.: Busquets-Xabi Alonso)

### Goleiro (Goalkeeper)

- **Goleiro (Goalkeeper, GK)** — Único jogador autorizado a usar as mãos dentro da própria área; defende com pegada, soco ou espalmada e organiza a defesa. Camisa 1.
  - **Goleiro-líbero / Goleiro-líbero moderno (Sweeper-keeper)** — Atua adiantado fora da área para cortar bolas em profundidade e participar da saída de bola com os pés. (ex.: Manuel Neuer, Ederson)

### Defensores (Defenders)

#### Zagueiros centrais (Centre-backs)

- **Zagueiro central (Centre-back, CB)** — Defensor do meio da zaga; bloqueia, desarma, cabeceia e cobre o espaço atrás. Marca por zona ou individualmente. Camisas 4 e 5.
- **Zagueiro de contenção / "limitado" (No-nonsense centre-back / limited defender)** — Zagueiro pragmático que prioriza segurança: chuta para longe, não arrisca a saída de bola, vive de desarme e cabeceio. (ex.: perfis clássicos de zaga "raçuda")
- **Stopper (Stopper)** — *(sem termo PT consagrado; "zagueiro de saída/agressivo")* O zagueiro mais agressivo de uma dupla, que **sobe** da linha para encontrar o centroavante adversário cedo e disputar a bola antes que ele gire. Costuma formar par com um zagueiro de cobertura. (ex.: dupla stopper + cover)
- **Zagueiro de cobertura (Cover centre-back)** — O parceiro do stopper que se mantém recuado para varrer o espaço nas costas e dar segurança. (ex.: par recuado de uma dupla stopper-cover)
- **Zagueiro construtor / saidor (Ball-playing defender / ball-playing centre-back)** — Zagueiro tecnicamente apto a iniciar a jogada com passes longos e quebrando linhas. (ex.: David Luiz, Virgil van Dijk)
- **Zagueiro pelo lado / lateralizado (Wide centre-back, WCB)** — Em defesas de três, o zagueiro de fora da linha que cobre o corredor lateral, ajuda o ala e por vezes sai com a bola por fora. Exige explosão e capacidade de duelo no 1v1 aberto. (ex.: sistemas com linha de três que pedem zagueiros móveis nas pontas)
- **Líbero / Sweeper (Sweeper / Libero)** — Posição histórica: zagueiro que jogava *atrás* da linha defensiva, "varrendo" o que passava, e subia com a bola quando o time tinha posse. (ex.: Franz Beckenbauer)
  - **Líbero moderno (Modern libero / progressive centre-back)** — Reinterpretação atual: o zagueiro central de um trio que carrega a bola para o meio-campo (step-up), criando superioridade na construção. (ex.: Beckenbauer; releituras de Stones recuado)

#### Defensores laterais (Full-backs & wing-backs)

- **Lateral (Full-back, FB)** — Defensor de flanco ao lado dos zagueiros; protege contra pontas e apoia o ataque. Camisas 2 (direita) e 3 (esquerda).
  - **Lateral ofensivo / de transbordo (Overlapping fullback)** — Lateral que sobe por fora do ponta para dar largura e cruzar. (ex.: Marcelo, Dani Alves)
  - **Lateral de apoio por dentro (Underlapping fullback)** — Lateral que sobe por **dentro**, infiltrando-se pelo meio-espaço por trás do ponta, em vez de por fora. (ex.: laterais que fazem corridas internas)
  - **Lateral invertido (Inverted fullback)** — Com a posse, entra para o meio-campo central formando um pivô extra (overload central e linhas de passe). (ex.: Cancelo/Zinchenko sob Guardiola, Trent Alexander-Arnold)
  - **Lateral defensivo / "fixo" (Defensive / no-frills fullback)** — Lateral conservador que sobe pouco e prioriza a marcação e a segurança da linha de quatro.
- **Ala (Wing-back, WB)** — Lateral "transportado" para a linha do meio em sistemas com três zagueiros (3-5-2 / 3-4-3); recua para formar uma linha de cinco e avança para dar largura. Camisas 7/11 ou 2/3. (ex.: alas de Conte)
  - **Ala completo / ofensivo (Complete / attacking wing-back)** — Ala de fôlego que cobre o corredor inteiro, cruza, finaliza e ainda recompõe na linha de cinco. (ex.: Achraf Hakimi, Theo Hernández)
  - **Ala invertido (Inverted wing-back)** — Defende como ala mas, na posse, penetra por dentro criando espaço para os companheiros, em vez de buscar a linha de fundo.

### Meio-campistas (Midfielders)

#### Meio-campo defensivo (Defensive midfield)

- **Volante / Primeiro-volante / Cabeça de área (Defensive midfielder / Holding midfielder / Anchor man)** — Joga "plantado" à frente da zaga (single pivot); blinda os centrais, intercepta e distribui. Camisas 5/6. (ex.: Casemiro, Rodri)
- **Volante de desarme (Ball-winning midfielder, BWM)** — Volante agressivo cuja função primária é recuperar a bola com desarmes e pressão, mais do que organizar. (ex.: N'Golo Kanté)
- **Destruidor (Destroyer)** — Termo histórico para o volante "destruidor" que desarmava e entregava a bola ao "criador" (creator) ao lado. (ex.: Makélélé, Gattuso)
- **Volante organizador recuado / Regista (Deep-lying playmaker / Regista)** — Armador na base do meio; recebe dos zagueiros, gira e inicia ataques com passes longos quebrando linhas — cria, não só desarma. "Regista" é o termo italiano. (ex.: Andrea Pirlo, Jorginho)
- **Volante "metrônomo" / circulador (Tempo-setter / metronome)** — Volante que dita o ritmo com posse segura e passes curtos constantes, controlando o pulso do jogo. (ex.: Sergio Busquets)

#### Meio-campo central (Central midfield)

- **Meia-central / Segundo-volante (Central midfielder, CM)** — Liga defesa e ataque; o "motor" do time. No Brasil, o **segundo-volante (second holding midfielder)** é o mais adiantado dos dois homens de contenção: ajuda o primeiro-volante a marcar os meias adversários e ampara a criação subindo ao ataque. Camisa 8.
- **Box-to-box (Box-to-box midfielder)** — Meia-central de grande mobilidade e fôlego que contribui nas duas áreas (defende e finaliza). (ex.: Steven Gerrard, Bellingham)
- **Mezzala / Meia de meio-espaço (Mezzala — lit. "meia-asa")** — Termo italiano: meia-central que atua nos *meios-espaços* (half-spaces) ao lado do pivô, abrindo para os corredores, fazendo corridas por dentro (underlap) e chegando atrasado ao ataque; meio caminho entre meia e ponta. (ex.: Barella, Arthur em alguns sistemas)
- **Carrilero (Carrilero)** — *(sem termo PT consagrado; "meia de ligação/lançadeira")* Termo espanhol ("transportador"): meia-central de perfil mais equilibrado/defensivo que **transita lateralmente** num corredor, cobrindo o lateral que sobe e tapando buracos no meio; dá largura e equilíbrio sem ser ponta nem chegar à área como a mezzala. (ex.: Sergio Busquets em fases mais abertas, perfis de "shuttler")
- **Meia box-crasher / chegador (Late-arriving 8)** — Função do nº 8 que ataca a área em segunda onda. (ex.: Frank Lampard)

#### Meio-campo ofensivo (Attacking midfield)

- **Meia-armador / Camisa 10 (Attacking midfielder / Playmaker / No. 10)** — Joga entre linhas ("no buraco"/the hole), criando com visão, controle e técnica. Camisa 10. (ex.: Zidane, Kaká)
- **Enganche (Enganche)** — *(sem termo PT consagrado distinto; "meia-armador clássico")* Termo argentino ("gancho"): camisa 10 quase estático, pivô criativo que dita o jogo do buraco sem cobrir muito campo. (ex.: Juan Román Riquelme)
- **Trequartista / Fantasista (Trequartista / Fantasista)** — *(sem termo PT consagrado)* Italiano para "três-quartista": armador de roaming livre, com forte pendor para finalizar e assistir, sem deveres defensivos fixos. "Fantasista" enfatiza o talento criativo imprevisível. (ex.: Francesco Totti, Roberto Baggio)
- **Armador móvel / errante (Roaming playmaker, RPM)** — Criador que vagueia por centro, meios-espaços e flancos buscando bolsões de espaço. (ex.: David Silva)
- **Armador pelo lado (Wide playmaker / wide creator)** — Criador principal que arma a partir de uma posição aberta (faixa/meio-espaço) em vez do centro, puxando o jogo para o seu corredor. (ex.: David Silva pela direita, Bernardo Silva)

### Atacantes (Forwards / Attackers)

#### Atacantes de lado (Wide forwards)

- **Ponta / Extremo / Ponteiro (Winger)** — Atacante posicionado junto à linha lateral; usa velocidade, drible e cruzamento. Camisas 7 (direita) e 11 (esquerda). (ex.: Garrincha, Vinícius Jr.)
- **Ponta invertido (Inverted winger)** — Ponta de pé trocado (canhoto pela direita / destro pela esquerda) que recebe na faixa e corta para dentro para finalizar no pé bom. (ex.: Arjen Robben, Mohamed Salah)
- **Atacante de lado / Falso ponta (Inside forward / Wide forward)** — Mais focado em corridas sem bola para dentro, chegando como um segundo finalizador, do que em ir à linha de fundo. (ex.: Thierry Henry pela esquerda)
- **Ponta de marcação / Tornante (Tornante / defensive winger)** — *(sem termo PT consagrado; "ponta de retorno")* Termo italiano ("que retorna"): atacante de lado com forte dever defensivo, que recompõe e cobre o ala/lateral atrás de si. (ex.: pontas com função de retorno em sistemas defensivos)
- **Raumdeuter ("intérprete de espaço")** — *(sem termo PT consagrado)* Alemão: atacante sem posição fixa que "lê" e ocupa bolsões de espaço no último terço, sobretudo na faixa direita, chegando solto à área. (ex.: Thomas Müller)

#### Atacantes centrais (Central forwards)

- **Centroavante (Centre-forward / Striker, CF)** — Finalizador principal e ponto de referência mais avançado do ataque. Camisa 9. (ex.: Romário, Erling Haaland)
- **Pivô / Homem de referência (Target man)** — Centroavante forte e bom de cabeça que recebe bolas longas, segura a marcação (protege a bola) e tabela para os companheiros chegarem. (ex.: Didier Drogba, Olivier Giroud)
- **Matador de área / Oportunista (Poacher / Fox in the box)** — Especialista de área que vive de posicionamento e instinto, finalizando de curta distância sem cair para construir. (ex.: Filippo Inzaghi, Gerd Müller)
- **Atacante de pressão (Pressing forward)** — Centroavante cuja função primária é iniciar a marcação alta, perseguir os zagueiros e os passes de construção adversários para forçar o erro. (ex.: Roberto Firmino, Diego Costa)
- **Atacante completo (Complete forward)** — Reúne técnica de um falso 9, faro de gol de poacher e força de pivô; finaliza, cria e participa de toda a jogada. (ex.: Ronaldo Fenômeno, Karim Benzema)
- **Segundo atacante / Meia-atacante (Second striker / Withdrawn forward)** — Joga logo atrás do centroavante em sistemas com dois homens de frente, ligando meio e ataque com mobilidade; varia entre criar e finalizar. (ex.: Wayne Rooney, Roberto Firmino recuado)
- **Atacante-sombra (Shadow striker)** — Variante do segundo atacante **focada no gol** (não na criação): vem de trás do centroavante, ataca o espaço e a área para finalizar, "na sombra" do nº 9. Corresponde ao "nove e meio". (ex.: Roberto Baggio, Raúl, Thomas Müller centralizado)
- **Falso 9 (False 9 / False nine)** — Centroavante que recua para o meio-campo, arrastando os zagueiros e abrindo espaço para infiltrações de pontas e meias; cria mais do que ocupa a área. (ex.: Lionel Messi sob Guardiola, Cesc Fàbregas na Espanha de 2012)

### Resumo das funções por número (Role-to-number summary)

| Número de função | Função PT | Role EN | Exemplo |
|------------------|-----------|---------|---------|
| Nº 1 | Goleiro / goleiro-líbero | Goalkeeper / sweeper-keeper | Neuer |
| Nº 2/3 | Lateral / ala / lateral invertido | Full-back / wing-back / inverted FB | Cancelo, Hakimi |
| Nº 4/5 | Zagueiro / stopper / construtor / líbero moderno | Centre-back / stopper / ball-playing / modern libero | Van Dijk, Beckenbauer |
| Nº 6 | Volante / regista | Holding mid / regista | Rodri, Pirlo |
| Nº 8 | Meia-central / box-to-box / mezzala / carrilero | Central mid / box-to-box / mezzala / carrilero | Bellingham, Barella |
| Nº 10 | Meia-armador / enganche / trequartista | Playmaker / enganche / trequartista | Riquelme, Totti |
| Nº 7/11 | Ponta / ponta invertido / raumdeuter / tornante | Winger / inverted winger / raumdeuter / tornante | Salah, Müller |
| Nº 9 | Centroavante / pivô / poacher / atacante de pressão / falso 9 | CF / target man / poacher / pressing forward / false 9 | Haaland, Firmino, Messi |
| Nº 9½ | Atacante-sombra / segundo atacante | Shadow striker / second striker | Baggio, Raúl |

---

## Formações e Sistemas de Jogo (Formations & Systems)

### Como ler uma formação (Reading a Formation)

- **Notação de formação (Formation notation)** — Sequência de números que descreve a distribuição dos 10 jogadores de linha, lida da defesa para o ataque (o goleiro nunca entra na conta). Ex.: 4-4-2 = 4 defensores, 4 meio-campistas, 2 atacantes; a soma sempre dá 10.
- **Linhas/setores (Lines / bands)** — Cada número representa uma "linha" horizontal de jogadores. Formações com 4 ou 5 números (ex.: 4-2-3-1, 4-1-2-1-2) subdividem o meio em camadas: das mais recuadas para as mais avançadas.
- **Numeração de posições (Position numbers)** — Sistema tradicional de camisas que mapeia funções: **1** goleiro, **2** lateral-direito, **3** lateral-esquerdo, **4 e 5** zagueiros, **6** volante/primeiro-volante, **8** meia box-to-box, **10** meia-armador, **7** ponta-direita, **11** ponta-esquerda, **9** centroavante. (Base do jargão "um 6", "um 8", "um 10", "um 9", "um camisa 7/11".) A numeração não é universal: na Inglaterra clássica o **4** costumava ser o volante e o **6** um zagueiro, e o esquema sul-americano e o continental divergem em pontos — por isso o número descreve a *função* esperada, não uma posição fixa de campo.
- **Formação nominal vs. real (Nominal vs. actual shape)** — A formação anunciada na escalação raramente é a forma que se vê em campo; ela muda conforme a fase de jogo (ver "Conceitos de sistema"). Por isso analistas distinguem a **forma na posse (in-possession shape)** da **forma sem a bola (out-of-possession shape)**.

### Funções como âncora de sistema (Role-defined anchors)

Além dos números, muitos sistemas são descritos pela função-chave que os define. Os principais nomes que aparecem na leitura de uma formação:

- **Volante de marcação / primeiro-volante (Holding midfielder, no 6)** — Pivô recuado à frente da zaga; pode ser **pivô único (single pivot)**, base do 4-3-3 e do 4-1-4-1, ou parte de um **pivô duplo (double pivot)** do 4-2-3-1.
- **Regista / volante construtor (Regista, deep-lying playmaker)** — "Maestro" recuado que dita o ritmo e distribui de trás; ocupa o vértice do meio em sistemas de posse (Pirlo, Jorginho).
- **Mezzala (Mezzala, "meio-ala")** — Um dos dois interiores de um meio-campo de três (4-3-3, 3-5-2) que combina meio-campista e ponta, atacando os **meios-espaços** (De Bruyne, Modrić).
- **Carrilero / "shuttler" (Carrilero)** — Interior mais defensivo que cobre o corredor (vai de um lado a outro, não sobe ao ataque), protegendo o ala-volante que avança; contraponto do mezzala.
- **Meia box-to-box (Box-to-box midfielder, no 8)** — Interior que cobre toda a extensão do campo, ligando defesa e ataque verticalmente.
- **Meia-armador / trequartista / enganche (Attacking midfielder, no 10 / trequartista / enganche)** — Criador entre linhas atrás dos atacantes; o **enganche** é a versão argentina clássica (fixo, sem função defensiva), o **trequartista** a italiana.
- **Segundo volante (Box-crashing deep midfielder)** — Termo sul-americano para o volante que sobe para finalizar/chegar à área a partir do meio recuado.
- **Segundo atacante (Second striker, no 10 recuado)** — Atacante que joga atrás do centroavante, ligando meio e ataque (caracteriza o 4-4-1-1).

### Evolução histórica dos sistemas (Historical Evolution)

| Sistema (PT) | System (EN) | Numeração | Origem / exemplo |
|---|---|---|---|
| Pirâmide | Pyramid | 2-3-5 | Primeira formação duradoura (anos 1880); dominou até os anos 1930. |
| Escola Danubiana | Danubian School | 2-3-5 (variante) | Áustria, Hungria e Tchecoslováquia (anos 1920-30); refinou a pirâmide com toque curto e habilidade individual. |
| Método / WW | Metodo / WW | 2-3-2-3 | Vittorio Pozzo, Itália bicampeã mundial (1934, 1938); derivado da Escola Danubiana, recuava dois atacantes. |
| WM | WM | 3-2-2-3 | Herbert Chapman (Arsenal, anos 1920), resposta à mudança da lei do impedimento de 1925. |
| Verrou ("ferrolho") | Verrou | 1-3-3-3 (com líbero) | Karl Rappan na Suíça (anos 1930); recuava um lateral atrás da linha — primeiro uso do líbero, antecessor do catenaccio. |
| Sistema 4-2-4 | 4-2-4 system | 4-2-4 | Brasil, Copas de 1958/1962; primeira formação descrita com números. |
| Catenaccio | Catenaccio | 5-3-2 (com líbero) | Itália (Rocco, depois Inter de Herrera); defesa fechada com líbero e contra-ataque, derivado do *verrou* de Rappan. |
| Futebol Total | Total Football | fluido (base 4-3-3) | Ajax/Holanda de Rinus Michels e Cruyff (anos 1970); rotação universal de posições. |
| Zona / pressão de Sacchi | Sacchi's zonal pressing | 4-4-2 | Milan de Arrigo Sacchi (fim dos anos 1980); marcação por zona, bloco compacto e linha alta com pressão. |

- **Pirâmide (Pyramid 2-3-5)** — Sistema mais ofensivo da história inicial: 2 fullbacks, 3 halfbacks e 5 atacantes; dominou até os anos 1930.
- **Escola Danubiana (Danubian School)** — Refinamento centro-europeu da pirâmide, baseado em passe curto e técnica individual, com o centromédio recuado como criador; influenciou diretamente o Método de Pozzo.
- **WM (WM 3-2-2-3)** — Recuou um atacante central para criar um terceiro zagueiro ("stopper") e equilibrar defesa/ataque após a nova lei do impedimento.
- **Verrou (Verrou)** — "Ferrolho" suíço de Karl Rappan: man-to-man rígido com um defensor extra recuado atrás da linha — primeira aparição do líbero —, concebido para igualar adversários tecnicamente superiores; semente do catenaccio.
- **Sistema 4-2-4 (4-2-4 system)** — Inovação brasileira que dividia o time em seis defensivos e seis ofensivos, equilíbrio inédito; raiz do 4-3-3 moderno.
- **Catenaccio (Catenaccio)** — Esquema italiano ultradefensivo com **líbero (libero/sweeper)** atrás da linha e jogo de contra-ataque; sistematizado por Nereo Rocco e levado ao ápice por Helenio Herrera na Inter.
- **Futebol Total (Total Football)** — Filosofia holandesa em que qualquer jogador de linha pode assumir a função de outro; antecessor conceitual do **falso 9 (false 9)** e da posse posicional.
- **Pressão zonal de Sacchi (Sacchi's zonal pressing)** — Releitura do 4-4-2 com marcação por zona, bloco curto entre as linhas e linha de defesa adiantada para comprimir o campo; base do pressing moderno.

### Formações modernas e variantes (Modern Formations & Variants)

#### Base de 4 defensores (Four at the back)

- **4-4-2 clássico/achatado (Classic / flat 4-4-2)** — Quatro defensores, meio em linha de quatro e dois atacantes; dois blocos compactos, forte defensivamente e em contra-ataque. (Milan de Sacchi.)
- **4-4-2 em losango/diamante (4-4-2 diamond, 4-1-2-1-2)** — Meio escalonado verticalmente: um **6 (holding midfielder)** na base e um **10 (playmaker)** na ponta; a largura vem dos laterais. (Milan de Ancelotti, 2003.)
- **4-3-3 clássico (4-3-3)** — Três meias (geralmente um volante + dois interiores) e tridente ofensivo (centroavante + dois pontas); pede laterais que dão largura e pressão alta. (Ajax/Barcelona.)
- **4-3-3 com volante / "holding" (4-3-3 holding, 4-1-2-3)** — O vértice do meio é um pivô único recuado, com dois interiores (mezzalas/box-to-box) à frente; prioriza controle e equilíbrio defensivo.
- **4-3-3 ofensivo (4-3-3 attack, 4-2-1-3)** — Dois volantes recuados e um 10 adiantado dentro do trio de meio; aumenta a presença criativa entre linhas.
- **4-2-3-1 (4-2-3-1)** — Dupla de volantes (**pivô duplo / double pivot**) protege a defesa; linha de três criativos atrás de um centroavante único. Combina solidez e criação. (Bayern do tri 2012-13.)
- **4-1-4-1 (4-1-4-1)** — Um volante isolado à frente da defesa, linha de quatro no meio e atacante único; bom para bloco médio e contra-ataque.
- **4-5-1 (4-5-1)** — Meio-campo lotado com cinco jogadores e atacante isolado; conservador, usado para segurar resultado ou 0-0.
- **4-3-2-1 árvore de natal (Christmas tree, 4-3-2-1)** — Três meias, dois meias-atacantes recuados e um centroavante; estreito, congestiona o miolo. (Milan campeão da Champions 2007.)
- **4-3-1-2 (4-3-1-2)** — Três volantes/interiores, um 10 e dois atacantes; muito estreito, sem pontas, típico da escola italiana (depende dos laterais para largura).
- **4-1-3-2 (4-1-3-2)** — Um volante de contenção, três meias avançados (um deles costuma abrir como ponta) e dois atacantes; ofensivo e arriscado atrás.
- **4-4-1-1 (4-4-1-1)** — Variante do 4-4-2 com um atacante recuado (**segundo atacante / second striker**) ligando meio e ataque; a "distância" entre os dois 9s é o que o distingue.
- **4-2-2-2 (4-2-2-2, "quadrado mágico")** — Dois volantes, dois meias internos e dois atacantes; sem pontas natos. (França de 1982/Euro 1984; comum no Brasil.)
- **4-6-0 (4-6-0)** — Sem centroavante fixo; um **trequartista/falso 9** ocupa o eixo, com quatro homens atacando de posições que a zaga não consegue marcar. Raro e específico. (Manchester United 2007-08 em jogos pontuais; Roma de Spalletti com Totti.)

#### Base de 3 defensores / 5 defensores (Three / five at the back)

- **3-5-2 (3-5-2)** — Três zagueiros, dois **alas/ala-volantes (wing-backs)** que dão toda a largura, três meias e dois atacantes; domina o miolo. (Argentina campeã de 1986.)
- **3-4-3 (3-4-3)** — Três zagueiros, quatro no meio (dois alas + dois centrais) e tridente; ofensivo. (Chelsea de Conte 2016-17 e de Tuchel, Champions 2021.)
- **3-4-2-1 (3-4-2-1)** — Três zagueiros, dois alas e dois volantes, dois meias-atacantes ("dez duplo") atrás de um centroavante; muito usado como a "cara ofensiva" do 5-4-1 sem a bola.
- **3-4-1-2 (3-4-1-2)** — Variante do 3-5-2 com um **meia-armador (number 10)** atrás de dois atacantes, em vez de três meias em linha.
- **3-1-4-2 (3-1-4-2)** — Três zagueiros, um volante de contenção isolado, quatro no meio e dois atacantes; variante do 3-5-2 atribuída a Carlos Bilardo (Argentina, anos 1980).
- **3-6-1 / 3-2-4-1 (3-6-1, 3-2-4-1)** — Três zagueiros com meio-campo sobrecarregado e atacante único; o **3-2-4-1** (dois pivôs, quatro avançados) é hoje a forma *na posse* mais comum de equipes que defendem em 4-4-2/4-2-3-1, gerando superioridade central. (Forma de ataque do Manchester City e do Arsenal modernos.)
- **5-3-2 (5-3-2)** — Três zagueiros + dois alas recuados (vira linha de cinco sem a bola), três meias e dois atacantes; defensivo, base histórica do catenaccio. (Brasil 2002 com Cafu e Roberto Carlos como alas.)
- **5-4-1 (5-4-1)** — Linha de cinco defensores, quatro no meio e atacante isolado; muito defensivo, "muralha". (Grécia campeã da Euro 2004.)

> Nota de simetria: 3-5-2 ↔ 5-3-2, 3-4-3 ↔ 5-4-1 e 3-4-2-1 ↔ 5-4-1 são frequentemente a **mesma equipe em fases diferentes** — os alas sobem (3 atrás) na posse e recuam (5 atrás) sem a bola. Por isso uma escalação "3 atrás" e "5 atrás" pode descrever o mesmo time.

### Conceitos de sistema (System Concepts)

- **Formação fluida / posicional (Fluid / positional formation)** — Estrutura que prioriza ocupação de zonas e rotações sobre posições fixas; base do **Juego de Posición (positional play)**, em que cada jogador ocupa uma zona e, ao sair dela, é substituído por um companheiro.
- **Mudança de forma por fase (Phase-dependent shape)** — A equipe assume formações distintas em cada fase: **construção/posse (in possession)**, **transição (transition)** e **defesa/sem a bola (out of possession)**. Ex.: um 4-3-3 que vira **3-2-5 / 3-2-4-1** na posse e **4-4-2** ao defender (Manchester City de Guardiola).
- **Forma na posse vs. sem a bola (In-possession vs. out-of-possession shape)** — As duas estruturas que toda equipe moderna alterna; a escalação "oficial" geralmente nomeia só uma delas.
- **Lateral invertido (Inverted full-back)** — Lateral que entra para o miolo na posse, formando um meio em caixa (**box midfield**) e gerando superioridade central; mecanismo central da forma fluida do City.
- **Ponta invertido (Inverted winger)** — Ponta canhoto pela direita (ou destro pela esquerda) que corta para o miolo para finalizar ou criar, liberando o corredor para o lateral; assinatura ofensiva de muitos 4-3-3 modernos.
- **Zagueiro que avança / construção em caixa (Stepping centre-back / box build-up)** — Um zagueiro sobe para ao lado do volante na saída de bola, criando a "caixa" de dois pivôs. (John Stones no City.)
- **Formação assimétrica (Asymmetric formation)** — Lados do campo com estruturas diferentes (ex.: ala-volante de um lado e ponta fixo do outro), distorcendo a marcação adversária. (City 2022-23 com flanco direito mais alto.)
- **Falso 9 (False 9)** — Centroavante que recua para o meio, arrastando o zagueiro e abrindo espaço para pontas/meias atacarem o vão. (Messi no Barça de Guardiola.)
- **Líbero (Libero / sweeper)** — Zagueiro "livre" que varre atrás da linha e organiza a defesa; central no catenaccio (revivido modernamente como **líbero construtor / ball-playing libero**).
- **Ala-volante / ala (Wing-back)** — Jogador de corredor que cobre todo o flanco sozinho em formações de três zagueiros, defendendo como lateral e atacando como ponta.
- **Meios-espaços (Half-spaces)** — Faixas verticais entre o corredor central e os laterais; zonas prioritárias na posse posicional por gerarem mais perigo.
- **Pivô duplo (Double pivot)** — Dois volantes lado a lado que blindam a defesa e equilibram as transições; assinatura do 4-2-3-1 e do 4-2-2-2.
- **Pivô único (Single pivot)** — Um só volante na base do meio (4-3-3, 4-1-4-1); dá mais homens à frente, mas exige cobertura dos interiores e dos zagueiros.
- **Superioridade / sobrecarga numérica (Overload)** — Criar mais jogadores que o adversário numa zona (geralmente o miolo ou um corredor) para sair jogando ou progredir; objetivo declarado de mecanismos como o lateral invertido e o 3-2-4-1.
- **Linha de confronto / gatilho de pressão (Line of confrontation / pressing trigger)** — A altura do campo a partir da qual a equipe começa a pressionar; define se o bloco é alto, médio ou baixo e é parte integrante de como um sistema "sem a bola" funciona.

---

## Conceitos e Estilos Táticos (Tactical Concepts & Styles)

> Convenção: cada item-folha traz **Termo PT (Term EN)** — definição concisa. Exemplos reais entre parênteses. Quando não há termo PT consagrado, indica-se "(sem termo PT consagrado)".

### 0. Estrutura conceitual: fases e momentos do jogo (Phases & moments of the game)

> Camada-base que organiza todo o resto: os estilos e princípios abaixo sempre se aplicam a *um* dos quatro momentos. Faltava como moldura explícita.

- **Modelo de jogo (Game model / Modelo de jogo)** — conjunto de princípios e comportamentos que define como uma equipe quer jogar em cada momento; a "identidade" tática que orienta treino e decisões. (conceito central da escola portuguesa — Vítor Frade, periodização tática).
- **Quatro momentos do jogo (Four moments of the game)** — divisão do jogo em quatro fases que se alternam continuamente:
  - **Organização ofensiva (Offensive organisation / In possession)** — com a bola e adversário organizado; construir e criar.
  - **Organização defensiva (Defensive organisation / Out of possession)** — sem a bola e adversário organizado; bloco, marcação, compactação.
  - **Transição ofensiva (Offensive transition)** — instante imediato após recuperar a bola; base do contra-ataque.
  - **Transição defensiva (Defensive transition)** — instante imediato após perder a bola; reorganizar ou contrapressionar.
- **Fases da construção (Phases of build-up)** — sub-divisão da organização ofensiva por terço do campo:
  - **1ª fase / Saída de bola (First phase / Build-up)** — sair do terço defensivo sob pressão, normalmente com goleiro + zagueiros + 1º volante.
  - **2ª fase / Progressão (Second phase / Progression)** — atravessar o meio-campo, quebrando a 2ª linha de pressão.
  - **3ª fase / Criação e finalização (Third phase / Creation & finishing)** — chegar e finalizar no terço ofensivo.
- **Bolas paradas (Set pieces)** — fase à parte (jogadas ensaiadas: escanteios, faltas, laterais longos, pênaltis); fora do escopo deste ramo, mas é o "5º momento" para muitos treinadores.

### 1. Macro-estilos e filosofias de jogo (Macro-styles & playing philosophies)

#### 1.1 Estilos de posse (Possession-based styles)

- **Tiki-taka (Tiki-taka)** — estilo de posse extrema baseado em passes curtos, movimento constante e circulação paciente da bola por vários corredores para fixar e desgastar o adversário. Termo cunhado pelo locutor Andrés Montes na Copa de 2006. (Barcelona e Espanha de 2008-2012; o próprio Guardiola depois rejeitou o rótulo como "passar por passar, sem propósito").
- **Tiki-taka vertical (Vertical tiki-taka)** — evolução do tiki-taka que mantém a posse e o passe curto, mas com intenção vertical clara: progredir rápido para a frente em vez de circular lateralmente. Resposta à crítica de que o tiki-taka virou "lento e sem direção".
- **Futebol de posse (Possession football)** — termo guarda-chuva para qualquer estilo que prioriza manter a bola como forma de controlar o jogo e a defesa. O tiki-taka é uma de suas variantes mais radicais.
- **Posse estéril / Posse improdutiva (Sterile possession)** — posse alta sem progressão nem criação de chances: circular a bola lateral/para trás sem furar o bloco adversário. Crítica recorrente a times de posse mal executada. (sem termo PT 100% fixo; "posse estéril" é o mais usado).
- **Futebol total (Total Football)** — sistema do Ajax/Holanda (Michels, Cruyff) em que qualquer jogador de linha pode assumir o papel de qualquer outro via rotação posicional, com linha alta e pressão. Antepassado direto do tiki-taka e do jogo de posição. (Holanda 1974; Ajax de Michels).

#### 1.2 Estilos diretos e de contra-ataque (Direct & counter-attacking styles)

- **Jogo direto (Direct play)** — estilo que busca chegar ao terço final com poucos passes e pouco tempo, atacando o espaço atrás da defesa em vez de circular a bola.
- **Bola longa / Lançamento (Long ball)** — passe longo, geralmente aéreo, que ultrapassa uma ou mais linhas do adversário, frequentemente para um homem-alvo disputar a segunda bola.
- **Segunda bola (Second ball)** — disputa da sobra após um duelo aéreo ou um lançamento; conquistar segundas bolas é princípio-chave do jogo direto e do route one.
- **Route One / "Chuveirinho" (Route One)** — versão extrema e direta do jogo direto: bola da defesa ao ataque pelo caminho vertical mais curto, com cruzamentos e centroavante de referência; abordagem avessa ao risco. (sem termo PT 100% consagrado; "ligação direta" / "bola na frente" são aproximações).
- **Posse direta (Direct possession)** — híbrido moderno: mantém a posse mas joga de forma vertical e agressiva, quebrando linhas com passes intencionais em vez de apenas lançar por cima. (Inter de Milão recente: ~52% de posse, mas xG entre os melhores da Europa).
- **Contra-ataque (Counter-attack)** — transição rápida da defesa ao ataque logo após recuperar a bola, explorando o adversário desorganizado/avançado.
- **Catenaccio ("Ferrolho") (Catenaccio)** — sistema defensivo italiano dos anos 1960: bloco rígido, linha de cinco com um líbero/varredor (libero) atrás, absorção de pressão e contra-ataques rápidos. "Catenaccio" = trinco/ferrolho de porta. (Inter de Helenio Herrera).
- **Retranca / "Estacionar o ônibus" (Park the bus)** — versão extrema do bloco baixo: praticamente todos os jogadores atrás da linha da bola, defendendo a própria área e abdicando do ataque. Termo "park the bus" popularizado por Mourinho. (PT: "retranca", "ferrolho", "guarda-roupa").
- **"Kick and rush" / "Chutar e correr" (Kick and rush)** — estilo inglês primitivo de chutão para frente e corrida atrás da bola; precursor histórico do route one.

#### 1.3 Paradigmas estruturais (Structural paradigms)

- **Jogo de posição (Positional play / Juego de posición)** — paradigma que divide o campo em zonas (linhas verticais e horizontais) e regula quantos jogadores podem ocupar cada zona/corredor, buscando sistematicamente superioridade para progredir a bola por entre as linhas. (Guardiola, herdeiro de Cruyff).
  - **Regra de ocupação (Occupancy rule)** — heurística do jogo de posição: nunca mais de **3 jogadores na mesma linha horizontal** e nunca mais de **2 na mesma linha vertical (corredor)**, e idealmente nenhum par de jogadores no mesmo cruzamento — para evitar amontoamento e garantir múltiplas linhas de passe. Materializa-se em estruturas escalonadas como 3-2-2-3 / 3-2-5.
  - **Escalonamento / Posições escalonadas (Staggering)** — evitar que jogadores fiquem na mesma altura/linha de passe; criar diferenças de altura para abrir ângulos. (sem termo PT único; "escalonamento" é o mais comum).
- **Posicionismo (Positionism)** — rótulo conceitual para a família de ideias do jogo de posição: a estrutura/espaço como referência primária; gera fluxo constante de chances e segurança defensiva, à custa da espontaneidade. (Bielsa e Guardiola como expoentes "puros").
- **Relacionismo (Relationism)** — paradigma sul-americano que prioriza as relações dinâmicas entre os jogadores (e com bola/espaço/adversário) em vez de zonas fixas; aproximações, diagonais e improvisação. Risco maior de fragilidade defensiva. (Fernando Diniz no Fluminense; tradição do "jogo funcional" brasileiro desde os anos 1940).
  - **Aposicionalismo (A-positionalism)** — como o próprio Diniz define seu jogo: "a-posicional", sem posições fixas, organizado pelas relações e pela aglomeração ao redor da bola.
  - **Escadinha (Escadinha / Staircase)** — orientações diagonais em escada que surgem das aproximações relacionistas, criando linhas de passe curtas e ângulos. (conceito-chave do relacionismo brasileiro).
  - **Corta-luz (Corta-luz / Blind-side / Dummy run)** — jogador cruza na frente de um companheiro ou deixa a bola passar ("deixa") para confundir a marcação e liberar um terceiro; sequência clássica escadinha → corta-luz → tabela. (sem termo EN único; aproxima-se de "dummy"/"blind-side run").
  - **Diagonais (Diagonals)** — movimentos e passes na diagonal que caracterizam a aproximação relacionista, gerando ângulos e quebrando a lógica das colunas verticais.
  - **"Toco y me voy" (Toco y me voy)** — tabela em movimento: passa e já se desloca; base do estilo argentino "La Nuestra" e do toque coletivo relacionista. (sem termo PT consagrado; aproxima-se de "tabela e corre").

### 2. Princípios ofensivos (Attacking principles)

#### 2.1 Superioridades (Superiorities)

O princípio-mãe do jogo de posição: procurar sempre algum tipo de vantagem para progredir.

| Tipo (PT) | Type (EN) | O que é | Exemplo |
|---|---|---|---|
| Superioridade numérica | Numerical superiority | Mais jogadores que o adversário numa zona; cria o "homem livre" | Salida lavolpiana: volante desce entre os zagueiros → 3v2 na saída |
| Superioridade posicional | Positional superiority | Jogador melhor posicionado (ex.: entrelinhas, nas costas da marcação) | Receber no half-space por trás do meio-campo adversário |
| Superioridade qualitativa | Qualitative superiority | Seu melhor jogador num duelo contra um pior do adversário | Isolar o ponta driblador em 1v1 contra o lateral mais fraco |
| Superioridade dinâmica/socioafetiva | Dynamic/socio-affective superiority | Vantagem por movimento em velocidade ou entrosamento | Atacar o espaço já em corrida; tabelas automatizadas |

- **Homem livre / Sobra (Free man)** — jogador sem marcação direta resultante de uma superioridade numérica; alvo da circulação para progredir.
- **Salida lavolpiana (La Salida Lavolpiana)** — rotação de saída de bola criada por Ricardo La Volpe: um volante desce para a linha dos dois zagueiros (formando um trio na primeira linha), enquanto os laterais sobem, gerando 3v2 contra os dois atacantes do pressing adversário. (popularizada na Europa por Guardiola; também usada por Tuchel).

#### 2.2 Espaços e zonas (Spaces & zones)

- **Half-spaces / Corredores internos / "Meias-luas" (Half-spaces)** — as duas faixas verticais entre o corredor central e os corredores laterais. Permitem influenciar várias zonas e formar triângulos/losangos; receber ali costuma puxar um defensor para fora, abrindo a linha. (popularizado por Guardiola e Nagelsmann).
- **Corredores / Faixas (Channels / Lanes)** — divisões verticais do campo (central, half-spaces, alas) usadas para regular ocupação no jogo de posição.
- **Entrelinhas (Between the lines)** — espaço entre as linhas do adversário (ex.: entre defesa e meio-campo); receber ali quebra um setor inteiro da marcação e é o alvo preferencial do meia-armador / falso 9.
- **Linha de passe (Passing lane / Passing line)** — corredor livre de adversários por onde um passe pode chegar; abrir e fechar linhas de passe é o objeto central de pressing e posicionamento.
- **Largura (Width)** — uso de toda a amplitude do campo para esticar a defesa horizontalmente e abrir espaços internos.
- **Profundidade (Depth)** — escalonamento vertical com jogadores ameaçando as costas da defesa, esticando o adversário no eixo vertical.
- **Amplitude e profundidade (Width and depth)** — princípio combinado de ocupar o campo nos eixos X e Y para desorganizar e abrir linhas de passe que quebram a marcação.
- **Verticalidade (Verticality)** — orientação progressiva para a frente; passes/conduções que ganham terreno rumo ao gol.
- **Jogo pelos flancos vs. jogo interior (Wing play vs. central play)** — atacar predominantemente pelas pontas/cruzamentos vs. progredir pelo miolo e half-spaces; muitos times alternam para desorganizar.

#### 2.3 Combinações e movimentos (Combinations & movements)

- **Terceiro homem (Third man)** — combinação em que A passa para B (a isca/parede) e B serve um terceiro jogador C que recebe livre por trás da linha. Mecanismo central para progredir centralmente.
- **Sobrecarga para isolar / "Overload to isolate" (Overload to isolate)** — concentrar jogadores num lado para atrair a defesa e então inverter o jogo, liberando um atacante em 1v1 no lado oposto. (sem termo PT plenamente consagrado).
- **Sobrecarga (Overload)** — criar superioridade numérica localizada numa região do campo para vencer duelos e atrair marcadores.
- **Inversão de jogo / Mudança de flanco (Switch of play)** — transferir a bola rapidamente de um lado ao outro para explorar o flanco fraco após uma sobrecarga.
- **Tabela / "Parede" (Wall pass / One-two / Give-and-go)** — passar e receber de volta de imediato para ultrapassar um marcador.
- **La pausa / A pausa (La pausa / The pause)** — desacelerar deliberadamente com a bola num momento de transição/ataque para esperar o apoio e o melhor passe surgir, em vez de jogar rápido por jogar. (associada a meias clássicos; "a pausa" no Brasil).
- **Triângulos e losangos (Triangles & diamonds)** — estruturas de apoio que garantem múltiplas linhas de passe ao portador da bola.
- **Movimento de apoio e de ruptura (Support & penetrating runs)** — apoiar (vir à bola, dar linha curta) vs. romper (atacar o espaço nas costas da defesa).
- **Falso 9 (False 9)** — centroavante que recua para os entrelinhas em vez de fixar a linha, atraindo um zagueiro para fora e abrindo espaço para corridas de fora para dentro. Conceito tático ofensivo emblemático do tiki-taka (Messi sob Guardiola). (também relacionado: lateral/ponta "por dentro", *inverted full-back/winger*).
- **Ultrapassagem por fora / por dentro (Overlap / Underlap)** — apoio externo (overlap, por fora) ou interno (underlap, por dentro/half-space) ao portador, criando dúvida no defensor. (sem termos PT consagrados; "ultrapassagem por fora/por dentro").

### 3. Princípios defensivos (Defensive principles)

#### 3.1 Pressão e blocos (Pressing & blocks)

- **Pressão / Pressing (Pressing)** — ação coordenada de pressionar o portador e as linhas de passe para forçar erro e recuperar a bola.
- **Gatilhos de pressão (Pressing triggers)** — sinais que disparam a pressão coletiva: passe lateral/para trás, mau controle, passe para um jogador de costas, bola no ar.
- **Armadilha de pressão / "Funil" (Pressing trap / shepherding / cul-de-sac)** — induzir o adversário a jogar para um lado predeterminado (geralmente a linha lateral, que funciona como "defensor extra") para então fechar todas as saídas e roubar a bola. "Shepherd" = tocar/conduzir o portador para a armadilha. (sem termo PT único; "armadilha de pressão", "encurralar na linha").

Altura do bloco/pressão (combinam-se posição da linha defensiva + onde se pressiona):

| Termo (PT) | Term (EN) | Descrição |
|---|---|---|
| Pressão alta / Bloco alto | High press / High block | Linha avançada; pressiona a saída de bola no campo adversário, buscando recuperar perto do gol oponente |
| Pressão média / Bloco médio | Mid press / Mid block | Equipe se posiciona na zona central; compacta e espera o adversário avançar para então pressionar |
| Pressão baixa / Bloco baixo | Low press / Low block | Equipe recua ao terço defensivo, protege a área e cede a posse, defendendo perto do próprio gol |

- **PPDA (PPDA / Passes per defensive action)** — métrica de intensidade de pressão: nº de passes que o adversário completa por cada ação defensiva (desarme, interceptação, falta), normalmente medida nos 60% finais do campo. Quanto **menor**, mais agressiva a pressão (~4-8 = pressão alta; 9-12 = bloco médio; 13+ = bloco baixo passivo).
- **Compactação (Compactness)** — manter linhas (entre setores e entre jogadores) curtas, vertical e horizontalmente, reduzindo espaços para o adversário. Mais fácil na marcação por zona.
- **Basculação / Deslocamento lateral do bloco (Shifting / Sliding)** — o bloco inteiro desloca para o lado da bola para sobrecarregar e fechar espaços. (sem termo PT único; "basculação" é comum no Brasil).
- **Encurtar o espaço / Subir a linha (Squeezing / Pushing up)** — avançar a linha defensiva para comprimir o campo e empurrar o adversário.

#### 3.2 Princípios individuais e de apoio defensivo (Individual & supporting defensive principles)

- **Contenção (Pressure / Jockeying)** — o defensor mais próximo pressiona/contém o portador, atrasando-o sem se lançar precipitadamente.
- **Cobertura (Cover / Covering)** — segundo defensor se posiciona atrás do que contém, pronto para cobrir caso ele seja superado.
- **Equilíbrio (Balance)** — demais defensores cobrem o lado oposto e os espaços longe da bola, mantendo a forma defensiva.
- **Concentração / Compactação central (Concentration)** — recuar e proteger a zona central/eixo do gol, forçando o jogo para fora.
- **Dobra (Doubling / Double-teaming)** — dois marcadores fecham o mesmo adversário (ex.: lateral + ponta sobre o atacante de flanco).
- **Recomposição / Corrida de recuperação (Recovery run)** — corrida de volta para reocupar a posição defensiva após perda de bola ou após apoiar o ataque.
- **Desarme vs. conter (Tackle vs. jockey)** — decidir entre tentar o desarme (risco de ser eliminado) ou apenas conter/atrasar até a cobertura chegar.

#### 3.3 Sistemas de marcação (Marking systems)

- **Marcação por zona (Zonal marking)** — cada defensor protege uma área/zona e os passes que a cruzam, não um adversário específico. Garante compactação e menos buracos. (Sacchi, Sarri; muitos times em escanteios).
- **Marcação individual / Homem-a-homem (Man-marking / Man-to-man)** — cada defensor acompanha um adversário designado por todo o campo. Pode fragmentar a forma defensiva. (Bielsa levou volantes a marcarem individualmente o meio-campo).
- **Marcação mista / Híbrida (Hybrid marking)** — estrutura zonal com homens-chave saltando para marcar individualmente conforme a bola/jogador entra na zona. Padrão moderno dominante.
- **Marcação por referência / orientada (Reference-oriented marking)** — Sacchi: cada movimento decidido por quatro referências — bola, espaço, adversário e companheiro.
- **Marcação orientada à zona / ao homem / à linha de passe (Zone-/man-/passing-lane-oriented)** — eixos que descrevem para que cada jogador olha primeiro ao pressionar: a sua zona, o seu adversário direto, ou a linha de passe que quer fechar (cover shadow).
- **Sombra de cobertura (Cover shadow)** — ao pressionar, posicionar o corpo de modo que o próprio jogador "cubra" (bloqueie) uma linha de passe atrás de si, marcando o portador e um receptor ao mesmo tempo.

#### 3.4 Linha defensiva e impedimento (Defensive line & offside)

- **Linha defensiva (Defensive line / Backline)** — alinhamento horizontal dos defensores; sua altura define a profundidade do bloco.
- **Linha de impedimento (Offside line)** — posição do penúltimo defensor que define a linha do impedimento.
- **Linha alta (High defensive line)** — defesa avançada que comprime o campo e habilita pressão alta, ao custo de espaço nas costas. (Bielsa, Guardiola, Klopp).
- **Linha baixa (Low defensive line)** — defesa recuada que protege as costas e a área, cedendo o espaço à frente; típica do bloco baixo/retranca.
- **Armadilha de impedimento (Offside trap)** — defensores sobem em conjunto e em sincronia para deixar o atacante em posição irregular. Difícil de executar; mais arriscado que a marcação individual.
- **Líbero / Varredor (Sweeper / Libero)** — defensor extra atrás da linha que "varre" bolas e cobre buracos; emblema do catenaccio. (Beckenbauer ressignificou como líbero ofensivo).
- **Goleiro-líbero / Goleiro-jogador (Sweeper-keeper)** — goleiro que atua adiantado para varrer bolas nas costas da linha alta e participar da saída como jogador a mais. (Neuer; habilita a linha alta moderna).

#### 3.5 Defesa em posse e transições (Rest defense & transitions)

- **Transição (Transition)** — momento da troca de posse (turnover) entre as fases ofensiva e defensiva.
- **Transição defensiva (Defensive transition)** — instante imediato após perder a bola; a equipe reorganiza-se para defender ou recuperar.
- **Transição ofensiva (Offensive transition)** — instante imediato após recuperar a bola; base do contra-ataque.
- **Rest defense / Resto defensivo (Rest defense / Restverteidigung)** — estrutura dos jogadores que ficam "sobrando" atrás durante o ataque, posicionados para neutralizar o contra-ataque assim que a posse é perdida. "Rest" = o que resta/sobra. (sem termo PT consagrado; "saldo/resto defensivo").
- **Contrapressão / Gegenpressing (Counter-pressing / Gegenpressing)** — pressionar imediatamente e em grupo logo após perder a bola, na própria transição defensiva, para recuperá-la perto do gol adversário ("contra-atacar o contra-ataque"). Variantes de cobertura: orientada ao homem, à linha de passe (zonal) ou híbrida. (Klopp, Rangnick, Tuchel; "nenhum armador é tão bom quanto uma boa situação de gegenpressing" — Klopp).
- **Recuar e reorganizar (Drop & regroup)** — alternativa ao contrapressing: em vez de pressionar logo após perder a bola, recuar rapidamente para reconstruir o bloco. (decisão tática chave na transição defensiva).
- **Regra dos 5/6 segundos (5/6-second rule)** — heurística associada à contrapressão (atribuída a Guardiola/Barcelona): tentar recuperar a bola nos primeiros segundos após perdê-la, antes de recuar. (princípio prático, não regra formal).

### 4. Escolas, filósofos e rótulos (Schools, philosophers & labels)

| Filósofo/Escola | Rótulo associado | Contribuição-chave |
|---|---|---|
| **Rinus Michels / Johan Cruyff** | Futebol Total → DNA do Barça | Rotação posicional, linha alta, pressão; semente do jogo de posição e do tiki-taka |
| **Arrigo Sacchi** | Zona / pressão coletiva | Marcação por zona orientada por bola-espaço-adversário-companheiro; defesa em bloco compacto e linha alta (Milan dos anos 1980-90) |
| **Helenio Herrera** | Catenaccio | Sistematizou o ferrolho com líbero na Inter |
| **Ricardo La Volpe** | Salida lavolpiana | Rotação de saída de bola com volante na linha dos zagueiros; influência indireta sobre Guardiola |
| **Pep Guardiola** | Jogo de posição / tiki-taka | Codificou zonas e superioridades; falso 9, laterais por dentro, goleiro-jogador, contrapressão imediata |
| **Jürgen Klopp** | Gegenpressing / heavy metal football | Contrapressão de alta intensidade + transições verticais; "heavy metal football" (em oposição ao "futebol de orquestra/silencioso") (Dortmund, Liverpool) |
| **Ralf Rangnick** | Gegenpressing / pressing | Pioneiro alemão do pressing estruturado e dos gatilhos de pressão; "padrinho" da escola de pressing alemã |
| **Marcelo Bielsa** | "Bielismo" / posicionismo + marcação individual | Pressão homem-a-homem por todo o campo, linha alta, intensidade extrema |
| **Fernando Diniz** | Relacionismo / aposicionalismo | Aproximações, escadinhas, corta-luz e improvisação coletiva em vez de zonas fixas |
| **José Mourinho / Diego Simeone** | Bloco baixo / médio reativo | Defesa compacta por zona, transições rápidas, pragmatismo; "park the bus" |
| **Maurizio Sarri** | "Sarrismo" | Posse + marcação por zona; padrões de passe automatizados |
| **Vítor Frade** | Periodização tática / modelo de jogo | Estruturou o treino em torno do modelo de jogo e dos quatro momentos (escola portuguesa) |

> Nota terminológica: "posicionismo × relacionismo" é frequentemente apresentado como dualidade, mas muitos analistas a consideram um espectro (a "falácia do relacionismo") — equipes reais misturam referências de espaço e de relação. O próprio Diniz se descreve como "a-posicional", não "anti-posicional".

---

## Fases e Momentos do Jogo (Phases & Moments of Play)

O futebol é dividido em **quatro fases (four phases / four moments of play)** que se alternam ciclicamente conforme a posse de bola muda. Duas são fases de **organização** (equipe estruturada, com ou sem a bola) e duas são fases de **transição** (instantes caóticos de troca de posse). As **bolas paradas (set pieces)** são frequentemente tratadas como uma **"quinta fase" (fifth phase)**, por terem dinâmica própria.

| # | Fase PT | Fase EN | Estado da posse |
|---|---------|---------|-----------------|
| 1 | Organização ofensiva | Offensive organisation / In possession | Com a bola, estruturado |
| 2 | Organização defensiva | Defensive organisation / Out of possession | Sem a bola, estruturado |
| 3 | Transição ofensiva | Offensive / attacking transition | Acabou de recuperar (defesa→ataque) |
| 4 | Transição defensiva | Defensive transition | Acabou de perder (ataque→defesa) |

> **Nota sobre o ciclo:** as fases são cíclicas — a transição ofensiva desemboca na organização ofensiva (se a posse for mantida); a transição defensiva desemboca na organização defensiva (se a bola não for recuperada de imediato). Os dois conceitos de "estrutura de reserva" (**rest defence** e **rest attack**, ver §3 e §4) são o elo entre uma fase de organização e a transição seguinte.

---

### 1. Organização ofensiva (Offensive organisation / In possession)

Fase em que a equipe tem a posse de forma estruturada e busca progredir e finalizar. Subdivide-se em três (às vezes quatro) momentos sequenciais ao longo do campo.

#### 1.1 Saída de bola / Construção (Build-up play)

- **Saída de bola (Build-up play / first phase of build-up)** — construção desde o terço defensivo, geralmente com o goleiro, para superar a primeira linha de pressão do adversário. Sinônimos PT: *saída a jogar*, *construção*, *fase 1*.
- **Saída em 2 (Build-up in a 2 / box build-up)** — dois zagueiros abrindo, comum em equipes com goleiro-líbero participativo.
- **Saída em 3 (Build-up in a 3 / back-three build-up)** — três jogadores alinhados na base da construção, gerando superioridade contra um pressing de dois atacantes. Pode ser linha de 3 zagueiros, ou um volante descendo entre/ao lado dos zagueiros.
  - **Volante recuado / pivô descendente (Single pivot dropping / "La Salida Lavolpiana")** — meio-campista desce entre os zagueiros (3+1), criando saída em 3 com 4-3-3. (Ex.: Sergio Busquets entre os zagueiros do Barcelona.)
  - **Lateral invertido (Inverted full-back)** — lateral entra para o meio na saída, formando estrutura tipo 3 atrás + meio reforçado. (Ex.: João Cancelo no City de Guardiola.)
- **Saída em 4 (Build-up in a 4 / back-four build-up)** — dois zagueiros + dois laterais (ou + dois volantes) dando a base larga da construção.
- **Goleiro-líbero / Goleiro construtor (Sweeper-keeper / ball-playing goalkeeper)** — goleiro como +1 numérico na saída, recebendo e distribuindo com os pés. (Ex.: Ederson, Ter Stegen.)
- **Atrair para soltar (Bait the press / luring the press)** — atrair a pressão adversária a um lado para liberar espaço/jogador livre no lado oposto.
- **Homem livre (Free man / spare man)** — o jogador desmarcado gerado pela superioridade na saída; achá-lo é o objetivo da construção. Relaciona-se ao **+1**.
- **Quebra de linhas / Passe entre linhas (Line-breaking pass / passing between the lines)** — passe que ultrapassa uma linha do adversário, frequentemente para um homem entre setores.
- **Recurso de tabela / apoio-tabela (Bounce pass / lay-off)** — passe de primeira para um companheiro que reentrega, usado para soltar a bola sob pressão na saída.

#### 1.2 Progressão (Progression / mid-third play)

- **Progressão (Progression)** — avançar a bola do terço médio rumo ao terço final, superando o bloco intermediário. Sinônimo PT: *construção de jogo no meio*.
- **Progressão pelo meio (Central progression)** — avanço pelo corredor central, normalmente via homem entre linhas; mais arriscado, mas abre o jogo para os dois lados.
- **Progressão pelas pontas / corredores (Wide progression / progression down the flanks)** — avanço pelos corredores laterais (1 e 5), mais seguro, usando largura e profundidade.
- **Superar o bloco médio (Beating / playing through the mid-block)** — momento específico de furar a estrutura defensiva intermediária do adversário.
- **Receber/jogar entre linhas (Receiving / playing between the lines)** — ocupar e abastecer o espaço entre as linhas de meio e defesa adversárias, forçando a "crise de decisão" do marcador (sair e abrir buraco vs. ficar e deixar o homem virar).
- **Terceiro homem (Third-man run / third-man combination)** — combinação A→B→C em que o terceiro jogador recebe livre após uma tabela curta; ferramenta clássica para furar marcação orientada à bola.
- **Condução para fixar (Driving / carrying to commit a defender)** — conduzir a bola para atrair um marcador e liberar o passe; "fixar para passar".
- **Troca de lado / Inversão do jogo (Switch of play / change of orientation)** — mover a bola rápido de um corredor ao outro (em um lançamento ou via sequência de passes) para explorar o lado fraco após atrair a defesa para um lado. Sinônimo PT: *mudar a orientação do ataque*.
- **Superioridade / Inferioridade / Igualdade numérica (Numerical superiority / inferiority / equality)** — relação de número de jogadores numa zona; busca-se o **+1** na saída e progressão.
- **Superioridade posicional e qualitativa (Positional / qualitative superiority)** — vantagem por melhor posicionamento (entre linhas, livre de marcação) ou por confronto individual favorável (1v1 a favor), além da puramente numérica.

#### 1.3 Criação e finalização (Creation & finishing / final-third play)

- **Jogo de criação no terço final (Chance creation in the final third)** — geração de oportunidades de gol no último terço. Sinônimo PT: *último terço*, *terço de finalização*.
- **Zona 14 (Zone 14)** — zona central logo à frente da área (dividindo o campo em 18 zonas, 6 por terço); a "zona de dilema de decisão" para o playmaker. Sem termo PT consagrado além de "zona 14". (Ex.: meias que recebem de costas/frente entre a linha de meio-campistas e zagueiros adversários.)
- **Meios-espaços / Corredores internos (Half-spaces / inside channels — alemão *Halbraum*)** — as duas faixas verticais entre o corredor central e os corredores laterais (faixas 2 e 4 das cinco faixas verticais). (Ex.: ~90% dos gols do Man City partem dos meios-espaços.)

| Faixa | PT | EN |
|------|----|----|
| 1 e 5 | Corredores laterais / pontas | Wide areas / wings |
| 2 e 4 | Meios-espaços / corredores internos | Half-spaces / inside channels |
| 3 | Corredor central | Central lane / channel |

- **Largura (Width)** — uso de toda a amplitude do campo para esticar a defesa; fator nº 1 para furar bloco baixo.
- **Profundidade (Depth)** — ameaça nas costas da linha defensiva, com corridas em profundidade.
- **Corrida nas costas / Romper a linha (Run in behind / breaking the line)** — movimento de ruptura por trás do último defensor para atacar o espaço em profundidade.
- **Superar o bloco baixo (Beating / breaking down a low block)** — desorganizar uma defesa muito recuada e compacta via largura, sobrecargas e troca rápida de lado.
- **Triangulações / Tabelas (Triangles / combination play)** — combinações curtas criando linhas de passe e superioridade local.
- **Tabela de parede (One-two / give-and-go / "wall pass")** — passe curto e devolução de primeira, ultrapassando o marcador.
- **Sobreposição (Overlap)** — apoio por fora, lateral ultrapassando o ponta. **Sobreposição interna (Underlap / inverted overlap)** — apoio por dentro, pelo meio-espaço.
- **Rotações posicionais (Positional rotations)** — troca coordenada de posições entre jogadores (ex.: ponta-meia-lateral) para desorganizar referências de marcação.
- **Cruzamento (Cross)** — bola alçada da lateral para a área.
- **Recuo / Bola atrasada da linha de fundo (Cut-back / pull-back)** — passe rasteiro recuado a partir da linha de fundo para a entrada da área; jogada de altíssima eficiência de finalização.
- **Finalização na área (Finishing in the box)** — momento de concluir, com corridas inteligentes de atacantes e meias buscando espaço.
- **Sobrecarga / Sobreposição numérica (Overload)** — criar maioria de jogadores num lado para depois trocar de lado (*overload to isolate*).
- **Isolar o 1v1 (Isolate the 1v1)** — após sobrecarregar um lado e trocar de lado, deixar um driblador em duelo individual com espaço no corredor oposto.

---

### 2. Organização defensiva (Defensive organisation / Out of possession)

Fase em que a equipe está sem a bola, mas estruturada, buscando recuperar a posse e impedir a progressão e a finalização do adversário.

#### 2.1 Blocos defensivos (Defensive blocks)

- **Bloco alto (High block)** — linha defensiva e de pressão subidas, encurralando o adversário no campo dele; busca recuperar a bola perto do gol adversário. (Ex.: Liverpool de Klopp, City de Guardiola.)
- **Bloco médio / Bloco intermediário (Mid-block)** — bloco começando perto da linha do meio, comum em 4-4-2 / 4-2-3-1, esperando para pressionar quando a bola entra no meio.
- **Bloco baixo (Low block)** — equipe protege o terço defensivo, compacta e recuada perto do próprio gol. (Ex.: Atlético de Simeone, Burnley de Dyche, Mourinho.)

#### 2.2 Pressão e princípios defensivos (Pressing & defensive principles)

- **Pressão / Pressing (Pressing)** — ação coordenada de incomodar o portador e fechar linhas de passe.
- **Pressão alta (High press)** — pressionar no campo adversário, ainda na saída de bola dele.
- **Gatilho de pressão (Pressing trigger)** — sinal que dispara a pressão coletiva (passe ruim, controle ruim, passe para trás, jogador de costas, passe lento/em altura).
- **Armadilha de pressão (Pressing trap)** — induzir deliberadamente o adversário a jogar numa zona/jogador onde a pressão já está armada para recuperar a bola.
- **Sombra de cobertura (Cover shadow)** — bloquear uma linha de passe com o próprio corpo ao pressionar, "apagando" o jogador que está atrás na sombra do defensor; permite pressionar um homem e marcar outro ao mesmo tempo.
- **Direcionar a marcação (Forcing inside / forcing outside / showing one way)** — pressionar em ângulo para empurrar o portador para um lado (geralmente para a linha lateral, "usando-a como defensor a mais", ou para dentro, conforme o plano).
- **Pressão orientada à bola vs. ao homem (Ball-oriented vs. man-oriented pressing)** — bloco que se desloca em referência à bola (zonal) vs. pressão que persegue marcações individuais.
- **Marcação por zona (Zonal marking)** — defender espaços/zonas em vez de homens.
- **Marcação individual / Homem a homem (Man-marking / man-to-man)** — cada defensor responsável por um adversário.
- **Marcação mista (Hybrid / mixed marking)** — combinação de zona e individual.
- **Compactação (Compactness)** — manter pouca distância entre linhas (compactação vertical) e entre jogadores da linha (horizontal).
- **Basculação / Pendular (Shifting / sliding across)** — deslocamento coletivo do bloco para o lado da bola.
- **Encurtar / Subir a linha (Stepping up / squeezing the line)** — subir a linha defensiva para reduzir espaço e armar o impedimento.
- **Cobertura, equilíbrio e concentração (Cover, balance & concentration)** — princípios táticos defensivos: cobertura ao primeiro defensor, equilíbrio do restante, concentração perto do gol.
- **Atraso / Conter (Delay / containing / jockeying)** — atrasar o ataque (e "segurar" o portador sem se lançar ao bote) para a defesa se reorganizar.
- **Bote / Desarme (Tackle / challenge)** — momento de disputar e tirar a bola do portador.
- **Dobra de marcação (Doubling up / double-team)** — dois jogadores pressionando o portador para forçar a perda. (Também aplicável na transição — ver §4.)
- **Linha de impedimento (Offside line / offside trap)** — uso coordenado da linha para colocar atacantes em impedimento.

---

### 3. Transição ofensiva (Offensive / attacking transition)

Momento imediato após **recuperar** a bola, quando o adversário ainda está desorganizado (em postura de ataque). Janela de vantagem máxima.

- **Transição ofensiva (Offensive / attacking transition)** — instante ataque após a recuperação (defesa→ataque→posse).
- **Contra-ataque (Counter-attack)** — recuar, deixar o adversário atacar e avançar rápido ao recuperar, explorando os espaços deixados. Sinônimo PT: *contragolpe*.
- **Contra-ataque direto vs. combinado (Direct vs. combinative counter-attack)** — direto: bola vertical imediata ao espaço/atacante; combinado: transição rápida porém com tabelas curtas para furar a primeira recomposição.
- **Verticalidade (Verticality / playing forward quickly)** — buscar o gol o mais direto e rápido possível na transição.
- **Espaço nas costas / Profundidade (Space in behind)** — alvo preferencial da transição: as costas da linha que subiu.
- **Sair da pressão (Beating the counter-press / playing out of pressure)** — superar a contrapressão adversária logo após recuperar, para lançar o contra-ataque.
- **Pausa / Segurar a transição (Slowing it down / retaining)** — quando o contra-ataque não é viável, recompor a posse e voltar à organização ofensiva.
- **Rest attack / Estrutura de ataque na defesa (Rest-attack)** — posicionamento dos jogadores ainda na fase defensiva pensando já no contra-ataque (deixar referências adiantadas / "agulhas" para a transição). É o espelho ofensivo do *rest defence*. Sem termo PT único consagrado; usa-se *resto de ataque* ou *estrutura de transição ofensiva*. (Do alemão, contraposto a *Restverteidigung*.)
- **Segunda bola (Second ball)** — disputa da bola que sobra após um duelo aéreo, divisão, rebote ou bola longa; momento de transição em que conquistar a segunda bola decide a posse. (Ex.: equipe que joga em bola longa estrutura jogadores para "caçar" a segunda bola.)

---

### 4. Transição defensiva (Defensive transition)

Momento imediato após **perder** a bola, quando a equipe está desorganizada e vulnerável ao contra-ataque. Fase crítica.

- **Transição defensiva (Defensive transition)** — instante defesa após perder a posse (ataque→defesa→sem posse).
- **Contrapressão / Pressão após perda (Counter-pressing / Gegenpressing)** — pressionar imediatamente o adversário nos primeiros segundos após perder a bola para recuperá-la no campo ofensivo. Tradução PT: *contra-pressão*. (Ex.: "heavy metal football" de Klopp no Dortmund/Liverpool; "5-second rule" de Guardiola.)
- **Reação à perda (Reaction to loss / first reaction)** — comportamento coletivo no segundo da perda: pressionar (contrapressão) ou recuar (recompor).
- **Recomposição / Recuperar a forma (Recovery runs / getting back into shape)** — quando a contrapressão não recupera a bola, corrida de retorno para reorganizar o bloco defensivo.
- **Equilíbrio defensivo na posse / "Rest defence" (Rest defence)** — estrutura de jogadores deixada atrás durante o ataque, justamente para abafar a transição defensiva. Sem termo PT único consagrado; usa-se *equilíbrio defensivo* ou *resto defensivo*. (Do alemão *Restverteidigung*; tipicamente "atacar com 5, defender com 5".)
- **Falta tática (Tactical foul / professional foul)** — falta deliberada para interromper um contra-ataque adversário e dar tempo de recompor.
- **Atrasar a transição adversária (Delaying the counter / counter-defence)** — primeiro defensor segura/atrasa o contra-ataque para os companheiros voltarem.
- **Dobra de marcação (Doubling up)** — dois jogadores pressionando o portador para forçar a recuperação rápida.

---

### 5. Bolas paradas / "Quinta fase" (Set pieces / "Fifth phase")

Reinícios com a bola parada após paralisação. No alto nível, ~25-30% dos gols nascem de bolas paradas. Cada tipo tem versão **ofensiva** e **defensiva**.

#### 5.1 Tipos de bola parada (Types of set piece / restart)

| PT | EN | Origem |
|----|----|--------|
| Escanteio | Corner kick | Bola sai pela linha de fundo, último toque do defensor |
| Falta (direta / indireta) | Free kick (direct / indirect) | Infração fora ou dentro do campo de jogo |
| Pênalti | Penalty kick | Infração dentro da área defensiva |
| Arremesso lateral | Throw-in | Bola sai pela linha lateral (único reinício com as mãos) |
| Tiro de meta | Goal kick | Bola sai pela linha de fundo, último toque do atacante |
| Tiro livre / Reinício | Free kick / restart | Reinício genérico |
| Bola ao chão | Dropped ball | Reinício neutro pelo árbitro após paralisação sem infração |

#### 5.2 Escanteios (Corners)

**Ofensivo:**
- **Escanteio fechado / "pra dentro" (Inswinger)** — bola que curva em direção ao gol.
- **Escanteio aberto / "pra fora" (Outswinger)** — bola que curva para fora do gol.
- **Escanteio curto (Short corner)** — cobrança curta para tirar marcadores da área e criar espaço/superioridade.
- **Cobrança ensaiada (Set / rehearsed routine / training-ground routine)** — jogada combinada e treinada. (Ex.: cobrança sempre para o mesmo alvo, como Baier→Luiz Alberto no Atlético-PR em 2013.)
- **Bloqueio / Tela (Blocker / screen / "meat wall")** — jogador que trava o marcador para liberar o cabeceador; tendência recente na Premier League.
- **Aglomeração / pacote de jogadores (Stack / cluster)** — agrupar atacantes para partir em corridas cruzadas e desorganizar a marcação por zona.
- **Zona de queda / Primeiro pau, segundo pau (Near post / far post / six-yard zone)** — alvos de cabeceio.

**Defensivo:**
- **Marcação por zona no escanteio (Zonal marking at corners)** — defensores cobrindo zonas-chave da área.
- **Marcação individual no escanteio (Man-marking at corners)** — cada defensor com um atacante, para responsabilizar individualmente.
- **Marcação mista (Hybrid marking)** — combina zona (postes/área pequena) com individual nos cabeceadores fortes.
- **Homem no poste (Post man)** — defensor(es) protegendo o(s) poste(s).
- **Comando da área pelo goleiro (Goalkeeper's command of the area)** — goleiro como organizador da defesa do escanteio, decidindo se sai para interceptar dentro da zona em que consegue chegar primeiro.
- **Afastar a primeira bola (Clearing the first contact)** — vencer o primeiro contato e afastar alto, longe e largo.
- **Saída para contra-ataque (Counter-attack outlet)** — atacante deixado adiantado para a transição após defender o escanteio.

#### 5.3 Faltas (Free kicks)

- **Falta direta (Direct free kick)** — pode-se chutar direto ao gol.
- **Falta indireta (Indirect free kick)** — gol só vale após segundo toque.
- **Barreira (Wall)** — alinhamento de jogadores a ≥9,15 m (10 jardas) da bola.
- **Chute por cima/por baixo da barreira (Over/under the wall)** — técnicas de cobrança direta.
- **Cobrança ensaiada de falta (Rehearsed free-kick routine)** — combinação treinada (toque curto, sobreposição, bloqueio).
- **Cobrança rápida (Quick free kick)** — reiniciar antes de o adversário se posicionar.
- **Jogador deitado atrás da barreira (Player lying behind the wall)** — recurso defensivo para evitar o chute rasteiro por baixo da barreira que salta.

#### 5.4 Arremesso lateral (Throw-in)

- **Arremesso lateral longo (Long throw)** — arremesso potente direto à área, funcionando como um "escanteio". (Ex.: revivido como arma na Premier League recente.)
- **Arremesso rápido (Quick throw-in)** — cobrar rápido para pegar a defesa desprevenida e gerar superioridade.
- **Jogada ensaiada de lateral (Rehearsed throw-in routine)** — combinações para criar linha de passe (cobrar em espaço vazio; lembrar que **não há impedimento** diretamente do arremesso).

#### 5.5 Tiro de meta (Goal kick)

- **Tiro de meta curto / saída construída (Short goal kick / built-up goal kick)** — reiniciar curto pelos zagueiros para construir desde trás (permitido receber dentro da própria área desde 2019).
- **Tiro de meta longo (Long goal kick)** — bola longa buscando segunda bola ou o pivô.

#### 5.6 Pênalti (Penalty)

- **Pênalti (Penalty kick)** — cobrança de 11 m, um a um contra o goleiro.
- **Cavadinha / Panenka (Panenka / chip / "dink")** — toque suave por baixo da bola, jogando-a no meio do gol depois que o goleiro já se atirou para um canto. (Criada por Antonín Panenka, Euro 1976.)
- **Paradinha (Paradinha / stutter / hesitation)** — parar/desacelerar na corrida para a bola a fim de induzir o movimento do goleiro; é a origem brasileira da hesitação na cobrança (a finta após a finalização da corrida é punida pela regra).
- **Passada quebrada / corrida em saltos (Stutter-step / stop-and-go run-up)** — variação de ritmo na aproximação, legal desde que não haja finta após a conclusão da corrida.
- **Pênalti ensaiado / em dois (Two-player / indirect penalty routine)** — toque curto para companheiro finalizar (raro, mas legal). (Ex.: Cruyff→Olsen.)
- **Disputa de pênaltis (Penalty shootout)** — desempate por cobranças alternadas (atualmente cogitado o formato ABBA em algumas competições).

#### 5.7 Conceitos transversais (Cross-cutting concepts)

- **Segunda bola na bola parada (Second ball at set pieces)** — estrutura para recuperar rebotes e afastamentos curtos após o primeiro contato, tanto no ataque (manter a pressão) quanto na defesa (sair limpo).
- **Equilíbrio/contenção na bola parada ofensiva (Rest defence at set pieces)** — jogadores mantidos fora da área na cobrança ofensiva justamente para abafar o contra-ataque caso a bola seja afastada.
- **Especialista em bolas paradas (Set-piece coach / specialist)** — função técnica dedicada, crescente no futebol moderno e nas seleções rumo à Copa de 2026.

---

## Regras do Jogo (Laws of the Game — IFAB)

> Fonte canônica: **The IFAB — Laws of the Game** (edição **2025/26**, vigente desde 1º de julho de 2025). No Brasil a tradução oficial é a **CBF / "Livro de Regras"**; em Portugal, a **FPF / "Leis do Jogo"**. Onde a terminologia PT-BR (CBF) e PT-PT (FPF) divergem, ambas são indicadas. Cada edição entra em vigor em **1º de julho**; competições já em andamento podem adiar a adoção até o fim da temporada.

### Estrutura geral

- **Regras / Leis do Jogo (Laws of the Game / LOTG)** — conjunto de **17 leis** mantidas pelo IFAB que regem o futebol de associação (futebol de 11). A numeração de 17 leis vigora desde a reescrita de 1938.
- **IFAB — International Football Association Board (sem termo PT consagrado; "Conselho")** — órgão guardião das Regras; composto pelas quatro federações britânicas (1 voto cada) + FIFA (4 votos). Mudanças exigem **6 de 8 votos**. As decisões são tomadas na **Reunião Geral Anual (AGM / Annual General Meeting)**.
- **Espírito do jogo (Spirit of the game)** — princípio de que o árbitro aplica as Leis dentro do bom senso e da justiça, não só na letra.
- **Estrutura de cada Lei** — texto principal + **Modificações (Modifications)** permitidas (autoriza variações nacionais p. ex. no futebol de base, sênior, feminino, deficiente, ver abaixo) + **Interpretação das Regras e diretrizes para árbitros (Practical Guidelines / Notes)**.
- **Variações permitidas (Permitted modifications)** — federações podem alterar dimensões da meta, tamanho do campo, duração, intervalo, número de substituições e nº mínimo de jogadores em certas categorias (juvenil, veterano, futebol feminino, futebol para deficientes).
- **Trials / experiências (IFAB trials)** — testes formais autorizados antes de virar Lei (ex.: árbitro com câmera corporal, FVS, banimento de cabeçada deliberada).

---

### Lei 1 — O Campo de Jogo (Law 1 — The Field of Play)

- **Campo de jogo / terreno de jogo (Field of play / pitch)** — superfície retangular de grama natural ou artificial (artificial deve ser verde). Não pode misturar superfícies natural e artificial sem autorização da competição.
- **Relva artificial / "football turf" (Artificial turf)** — quando usada em jogos oficiais da FIFA/confederação, deve atender ao **FIFA Quality Programme for Football Turf** (selos **FIFA Quality** e **FIFA Quality Pro**).
- **Linhas de marcação (Field markings / lines)** — todas com a mesma largura, **máx. 12 cm**; pertencem à área que delimitam. Linhas de cor diferente do gramado.
  - **Linha lateral (Touchline / sideline)** — as duas linhas mais longas. **Comprimento: 90–120 m** (jogos internacionais: **100–110 m**).
  - **Linha de fundo / linha de meta (Goal line)** — as duas linhas mais curtas. **Largura: 45–90 m** (internacionais: **64–75 m**).
  - **Linha do meio-campo (Halfway line)** — divide o campo; **marca central (Centre mark)** no meio dela.
- **Áreas e marcas:**

| Termo PT (Term EN) | Especificação |
|---|---|
| Área de meta / pequena área (Goal area) | 5,5 m a partir de cada poste, 5,5 m para dentro |
| Área penal / grande área (Penalty area) | 16,5 m a partir de cada poste, 16,5 m para dentro |
| Marca do pênalti / marca penal (Penalty mark / spot) | 11 m do meio da meta |
| Arco / meia-lua da área (Penalty arc / "D") | Arco de raio 9,15 m a partir da marca penal |
| Círculo central (Centre circle) | Raio 9,15 m em torno da marca central |
| Quadrante de canto (Corner arc) | Raio 1 m em cada canto |
| Marcas externas opcionais (Optional outside marks) | 9,15 m da linha lateral (escanteio) e da linha de fundo (área penal), por fora do campo, para auxiliar o controle de distância |

- **Meta / baliza / gol (Goal)** — **7,32 m** entre os postes (interno) × **2,44 m** de altura (borda inferior do travessão ao chão).
  - **Trave / poste (Goalpost)**, **travessão (Crossbar)**, **rede (Net)** — postes e travessão brancos, de mesma largura/espessura (máx. 12 cm), e formato quadrado, retangular, redondo ou elíptico, sem perigo. A meta deve estar fixada com segurança ao solo.
- **Bandeirinhas de canto (Corner flagposts)** — obrigatórias nos quatro cantos, ≥ 1,5 m de altura, topo não pontiagudo; bandeirinhas no meio-campo são opcionais (a ≥ 1 m da linha lateral).
- **Zona técnica (Technical area)** — área demarcada para banco, comissão e suplentes; apenas uma pessoa por vez transmite instruções e deve permanecer dentro dela (salvo casos específicos, como atender lesionado).
- **Logos e publicidade (Commercial/advertising)** — proibida publicidade comercial no campo, redes, bandeirinhas e equipamento dos árbitros a partir do início ao fim da partida.

### Lei 2 — A Bola (Law 2 — The Ball)

- **Bola (Ball)** — esférica, couro/material adequado. **Circunferência: 68–70 cm**; **peso: 410–450 g** (no início do jogo); **pressão: 0,6–1,1 atm (600–1100 g/cm²)** ao nível do mar.
- **Selos de qualidade (FIFA Quality marks)** — jogos oficiais exigem bola com selo **FIFA Quality Pro**, **FIFA Quality** ou **IMS — International Match Standard**.
- **Bola defeituosa (Defective ball)** — se estoura/danifica em jogo, para-se o jogo e reinicia-se com **bola ao solo (dropped ball)** no local; se ocorre numa cobrança/reinício (pênalti, tiro livre, etc.), a cobrança é repetida.
- **Bolas adicionais / múltiplas bolas (Additional balls / multi-ball system)** — bolas extras podem ficar em volta do campo sob controle do árbitro, agilizando reinícios.

### Lei 3 — Os Jogadores (Law 3 — The Players)

- **Equipe / time (Team)** — máx. **11 jogadores** em campo, um deles o goleiro; jogo não inicia/continua com menos de **7**.
- **Goleiro (Goalkeeper)** — único jogador autorizado a tocar a bola com as mãos dentro da própria área penal; pode trocar de posição com outro jogador desde que com permissão do árbitro e numa parada.
- **Substituição (Substitution)** — até **5 substituições** em competições oficiais (em até **3 paradas** + intervalo); número de suplentes (geralmente 3 a 15) definido pela competição.
- **Substituição extra na prorrogação (Extra substitution in extra time)** — uma substituição adicional permitida na prorrogação (e uma parada extra).
- **Substituição por concussão (Concussion substitution)** — substituição **permanente adicional** por suspeita de traumatismo craniano (protocolo aprovado/adotado por competição), sem contar no limite normal; o adversário ganha o direito a uma substituição correspondente.
- **Substituição com retorno (Return substitution)** — permitida apenas no futebol de base, veterano, deficiente e de massa, se a competição autorizar.
- **Procedimento de substituição (Substitution procedure)** — jogador a substituir sai pelo ponto mais próximo da linha (regra introduzida para agilizar/evitar perda de tempo), salvo orientação do árbitro.
- **Excesso de pessoas no campo (Extra persons on field)** — distingue **agente externo (outside agent)**, **membro da equipe (team official, suplente, jogador substituído ou expulso)** e jogador a mais; cada caso tem reinício próprio (ex.: anular gol irregular, bola ao solo, tiro livre).
- **Capitão da equipe (Team captain)** — não tem status especial nas Leis, mas tem responsabilidade pela conduta do time; a partir de 2025/26 muitas competições adotam o protocolo **"só o capitão fala com o árbitro" (captain-only / only the captain)** em certas situações; será obrigatório para todas as competições **a partir de 1º/jul/2027**.

### Lei 4 — O Equipamento dos Jogadores (Law 4 — The Players' Equipment)

- **Equipamento obrigatório (Compulsory equipment)** — camisa com mangas, calção, meiões, **caneleiras (shin guards)** e calçado.
- **Cores (Kit colours)** — equipes distintas entre si e dos árbitros; goleiro distinto de todos os jogadores e árbitros.
- **Roupa de baixo / "undergarments" (Undershorts / tights)** — devem ter a cor predominante da manga da camisa ou do calção; ambos os times com a mesma cor; **meiões com fita/tape devem ter a mesma cor do meião** naquele trecho.
- **Segurança (Safety)** — proibido o que ofereça perigo (joias, brincos, fitas de cabelo com peças metálicas etc. incluídas); cobrir joia com fita não é permitido.
- **Cabeça (Head covers / headgear)** — permitido cobre-cabeça por motivos religiosos/médicos, desde que seguro, da cor do uniforme e sem partes salientes.
- **Comunicação/eletrônicos (EPTS / electronic equipment)** — permitido equipamento de monitoramento e comunicação aprovado; **comunicação eletrônica entre comissão técnica e jogadores** só é permitida em casos específicos (bem-estar/segurança) e com aprovação.
- **Slogans/imagens (Slogans, statements, images)** — proibidos no equipamento (incl. roupa de baixo) mensagens políticas, religiosas, pessoais ou propaganda.
- **Infrações de equipamento (Equipment offences)** — jogador irregular é mandado fora para ajustar e só retorna com autorização numa parada; reinício depende da situação.

### Lei 5 — O Árbitro (Law 5 — The Referee)

- **Árbitro (Referee)** — autoridade máxima; aplica as Leis; suas **decisões de fato (factual decisions)** são definitivas, salvo correção pelo VAR antes de o jogo recomeçar.
- **Poderes e deveres (Powers and duties)** — controla a partida com os demais árbitros; é o cronometrista oficial; pode parar/suspender/abandonar o jogo por interferências externas, clima, segurança.
- **Vantagem (Advantage / play-on)** — não interromper o jogo quando a equipe infringida se beneficia; pode-se punir a falta original depois (cartão) se a vantagem não se concretizar em poucos segundos.
- **Cartões (Cards)** — **amarelo (yellow card)** = advertência; **vermelho (red card)** = expulsão. O árbitro pode aplicá-los a jogadores, suplentes e membros da comissão técnica (banco).
- **Cronometragem (Timekeeping)** e acréscimos são de sua responsabilidade.
- **Lesões (Injuries)** — distingue lesão leve (jogo segue) de grave (para o jogo); jogador sangrando deve sair.
- **Câmera corporal do árbitro (Referee body camera)** — desde 2025/26 as competições **podem** equipar árbitros, assistentes e quarto árbitro com câmeras corporais (em teste/uso em competições FIFA, com imagens podendo ir à transmissão).
- **Anúncio de decisões à torcida (Referee announcements)** — competições podem autorizar o árbitro a **anunciar pelo sistema de som do estádio** o resultado de revisões de VAR (parte do plano de transparência do VAR).

### Lei 6 — Os Demais Árbitros (Law 6 — The Other Match Officials)

- **Árbitro assistente / bandeirinha (Assistant referee / "linesman")** — sinaliza bola fora, impedimento, faltas e infrações fora do alcance do árbitro, e quem tem direito ao reinício.
- **Quarto árbitro (Fourth official)** — administra a área técnica, substituições, troca de bolas, controle do banco e exibe o tempo de acréscimo.
- **Árbitro assistente de reserva (Reserve assistant referee)** — substitui um assistente ou o quarto árbitro que não possa seguir.
- **Árbitros assistentes adicionais / atrás da meta (Additional assistant referees — AARs)** — junto à linha de fundo (sistema usado em algumas competições, p. ex. UEFA pré-VAR).
- **VAR e AVAR (Video assistant referee / Assistant VAR)** — ver "Tecnologias e VAR".
- **Operador de replay (Replay operator — RO)** — técnico na sala de vídeo que opera as imagens para o VAR.
- **Conduta dos árbitros (Officials' conduct)** — assistentes que cometam infração grave podem ser substituídos; só o árbitro principal aplica cartões.

### Lei 7 — A Duração da Partida (Law 7 — The Duration of the Match)

- **Tempo de jogo (Periods of play)** — dois tempos de **45 minutos** cada (pode ser reduzido por acordo prévio, ex.: base).
- **Intervalo (Half-time interval)** — máx. **15 minutos**; só pode ser alterado com consentimento do árbitro.
- **Acréscimos / tempo adicional (Additional time / stoppage time / "added time")** — compensação por substituições, lesões, atendimento, comemorações de gol, revisões de VAR, perda de tempo e qualquer outra causa; o quarto árbitro indica o mínimo.
- **Cobrança postergada (Time allowed for penalty)** — se um pênalti tem de ser executado/repetido, o tempo é prorrogado até a conclusão da jogada.
- **Pausa para hidratação / "cooling break" (Drinks/cooling break)** — pausas curtas por calor (~90 s a 3 min), à parte dos acréscimos; **drinks break** é mais curta que **cooling break**.
- **Jogo abandonado/suspenso (Abandoned / suspended match)** — regras de continuação ou repetição são definidas pela competição, não pela Lei.

### Lei 8 — O Início e o Reinício do Jogo (Law 8 — The Start and Restart of Play)

- **Sorteio (Coin toss)** — vencedor escolhe lado de ataque OU dá a saída; o outro time faz a escolha restante. No segundo tempo as equipes trocam de lado.
- **Pontapé de saída / saída de bola (Kick-off)** — reinício no início de cada tempo, da prorrogação e após gol; a bola fica na marca central, parada, e pode-se **marcar gol diretamente** (gol contra direto do kick-off não vale — vira escanteio). Adversários a ≥ 9,15 m até a bola estar em jogo. Desde 2016 a bola pode ser jogada em qualquer direção (não precisa ir para frente).
- **Bola ao solo / bola ao chão (Dropped ball)** — reinício neutro após interrupção que não seja um reinício previsto.
  - **Entrega (Who receives)** — entregue ao **goleiro** (se a interrupção ocorreu dentro da área penal) ou ao **jogador da equipe que tocou por último** a bola; demais jogadores a **≥ 4 m**.
  - **Posse provável (2024/25)** — se a bola estava **fora da área** e está claro para o árbitro qual equipe **teria a posse**, a bola é dada a essa equipe; caso contrário, à equipe que tocou por último.
  - A bola está em jogo ao tocar o solo; se ninguém a toca, repete-se; não se pode marcar gol diretamente (se entrar, é tiro de meta/escanteio).

### Lei 9 — A Bola em Jogo e Fora de Jogo (Law 9 — The Ball In and Out of Play)

- **Bola fora de jogo (Ball out of play)** — quando ultrapassa **completamente** a linha lateral ou de fundo (no solo ou no ar), ou o jogo é parado pelo árbitro.
- **Bola em jogo (Ball in play)** — em todos os demais momentos, inclusive ao ricochetear em trave, travessão, bandeirinha de canto ou árbitro permanecendo no campo.
- **Toque do árbitro (Ball off match official)** — se a bola toca um árbitro **dentro do campo** e, em consequência, há **mudança de posse**, início de **ataque promissor** ou **gol**, o jogo para e reinicia-se com **bola ao solo**.

### Lei 10 — A Determinação do Resultado (Law 10 — Determining the Outcome of a Match)

- **Gol válido (Goal)** — quando a bola ultrapassa **totalmente** a linha de meta, entre os postes e sob o travessão, sem infração da equipe atacante (incl. mão, impedimento, falta).
- **Equipe vencedora / empate (Winner / draw)** — mais gols vence; igual = empate.
- **Critérios de desempate (Tie-breaking)** — definidos pela competição: **gols fora de casa (away goals rule)** — em desuso/abolido em muitas competições (UEFA aboliu em 2021) —, **prorrogação (extra time)** e **disputa por pênaltis (kicks from the penalty mark)**.
  - **Disputa de pênaltis (Kicks from the penalty mark / "shootout")** — cobranças alternadas; padrão **ABAB**; a ordem **ABBA** foi testada e descontinuada. Cada equipe começa com igual número de cobranças (5), depois morte súbita; só jogadores em campo no fim podem cobrar (**redução para igualar / "reduce to equate"** se um time tiver menos jogadores).

### Lei 11 — Impedimento (Law 11 — Offside)

- **Posição de impedimento (Offside position)** — jogador com qualquer parte da **cabeça, tronco ou pés** mais perto da linha de meta adversária do que **a bola E o penúltimo adversário (second-last opponent)** (mãos e braços, até a base da axila, **não contam**). Estar na posição **não é infração por si só**. Não há impedimento no **próprio campo de defesa**.
- **Infração de impedimento (Offside offence)** — punível quando o jogador, no momento em que a bola é **jogada ou tocada** por um companheiro, se envolve no jogo ativo:
  - **Interferir no jogo (Interfering with play)** — toca/joga a bola passada/tocada por um companheiro.
  - **Interferir em adversário (Interfering with an opponent)** — impede o adversário de jogar/disputar a bola, obstrui linha de visão, ou faz movimento/ação que afete claramente a capacidade do adversário de jogar a bola; ou desafia o adversário pela bola.
  - **Obter vantagem (Gaining an advantage)** — joga bola que ricocheteou ou desviou em trave/travessão, em adversário ou no árbitro; ou de **defesa deliberada (deliberate save)** de qualquer adversário.
- **Jogada deliberada vs. desvio (Deliberate play vs. deflection — clarificação 2024/25)** — se um adversário **joga deliberadamente** a bola (não defesa), o impedimento é "resetado" e o atacante não é punido. O IFAB definiu critérios para distinguir **jogada deliberada** de **desvio**: o jogador (a) tinha visão clara da bola, (b) não estava sob pressão/à distância, (c) teve tempo de coordenar o movimento, (d) a bola não vinha rápida, (e) a bola não veio de origem inesperada — só um movimento controlado caracteriza jogada deliberada. **Defesa deliberada (deliberate save)** nunca "reseta" o impedimento.
- **Exceções (No offside)** — recebe a bola diretamente de **tiro de meta, arremesso lateral ou escanteio**.
- **Sanção** — **tiro livre indireto** no local da infração.

### Lei 12 — Faltas e Conduta Antidesportiva (Law 12 — Fouls and Misconduct)

#### Faltas (Fouls) — punidas com tiro livre

- **Tiro livre direto (Direct free kick)** — falta cometida de forma **imprudente, descuidada ou com força excessiva (careless / reckless / using excessive force)** contra adversário: chutar/tentar chutar, dar/tentar dar rasteira, saltar sobre, **carga (charge)**, agredir/tentar agredir (incl. cabeçada), empurrar, dividir tocando o adversário antes da bola (**tackle**), segurar, impedir/bloquear com contato, **morder ou cuspir** em alguém, **atirar objeto** na bola/adversário/árbitro.
- **Mão na bola / toque com a mão (Handball / handling the ball)** — punível quando o jogador (a) **toca deliberadamente** a bola com mão/braço; (b) marca gol direto com a mão/braço (mesmo acidental) ou imediatamente após; (c) cria chance de gol após a bola tocar sua mão/braço numa posição que torne o corpo **antinaturalmente maior**. Não é falta se a bola vem do próprio corpo/de outro jogador próximo, ou se a mão está próxima ao corpo de modo natural. **Goleiro está isento** dentro da própria área (salvo regras de devolução).
- **Tiro livre indireto (Indirect free kick)** — **jogo perigoso (dangerous play)** (sem contato), bloquear a progressão do adversário sem contato (**impeding without contact**), impedir o goleiro de soltar a bola, **dissentir/linguagem (dissent)**, e infrações específicas do goleiro:
  - **Regra dos 8 segundos / antigo "6 segundos" (Goalkeeper holding the ball — 2025/26)** — desde 2025/26, o goleiro que **controla a bola com a(s) mão(s)/braço(s)** por **mais de 8 segundos** (árbitro faz contagem visual dos últimos 5 segundos com a mão levantada) é punido com **tiro de canto (escanteio)** para o adversário — substitui a antiga sanção de tiro livre indireto por reter por mais de 6 s.
  - **Recuo / passe deliberado (Back-pass rule)** — goleiro toca com a mão a bola **passada deliberadamente com o pé** por companheiro, ou **recebida diretamente de arremesso lateral** de um companheiro; sanção: tiro livre indireto.

#### Conduta antidesportiva (Misconduct) — punida com cartão

- **Cartão amarelo / advertência (Yellow card / caution — CA)** — conduta antidesportiva, dissentir por palavra/ato, infrações persistentes, retardar o reinício, não respeitar a distância em reinício, entrar/sair/retornar ao campo sem permissão, **simulação / "cair" (simulation / diving)**, festejar de modo provocativo, e:
  - **Interromper ataque promissor (Stopping a promising attack — SPA)** — falta tática que corta um ataque em desenvolvimento (amarelo; se a falta foi tentativa de jogar a bola dentro da área e gerou pênalti, não há cartão).
- **Cartão vermelho / expulsão (Red card / sending-off — CV)** — **jogo brusco grave (serious foul play)**, **conduta violenta (violent conduct)**, cuspir/morder, linguagem/gestos ofensivos/injuriosos, **segundo cartão amarelo**, e:
  - **Impedir gol/chance clara de gol (Denying an obvious goal-scoring opportunity — DOGSO)** — expulsão; mas se a falta foi **tentativa legítima de jogar a bola dentro da própria área** e resultou em pênalti, a sanção é reduzida a **amarelo** (mitigação do "triple punishment"). **Mão deliberada** que impede gol/chance = vermelho onde quer que ocorra (exceto goleiro na própria área).
- **Comportamento da comissão técnica (Team officials)** — treinadores/membros do banco também recebem amarelo/vermelho; vermelho a dirigente = saída para fora da zona técnica/estádio.
- **Briga / confronto (Mass confrontation)** — o árbitro deve identificar e punir individualmente os envolvidos.

### Lei 13 — Os Tiros Livres (Law 13 — Free Kicks)

- **Tiro livre direto (Direct free kick)** — gol pode ser marcado diretamente contra o adversário (gol contra direto = escanteio).
- **Tiro livre indireto (Indirect free kick)** — gol só é válido após a bola tocar **outro jogador**; o árbitro mantém o braço levantado até esse toque (ou até a bola sair de jogo).
- **Procedimento (Procedure)** — bola parada no local da infração; em jogo quando chutada e claramente movimentada (tiro livre dentro da própria área: em jogo assim que é chutada).
- **Barreira (Wall)** — com **3+ defensores** formando barreira, **todos os atacantes** devem ficar a **≥ 1 m** da barreira até a bola estar em jogo (sob pena de tiro livre indireto ao adversário).
- **Distância (Distance)** — adversários a **≥ 9,15 m** da bola até estar em jogo (ou na linha de meta entre os postes, se o tiro for de dentro da área de meta da equipe defensora).

### Lei 14 — O Pênalti / Tiro Penal (Law 14 — The Penalty Kick)

- **Pênalti / tiro penal / penalidade máxima (Penalty kick)** — concedido por falta punível com **tiro livre direto** (incl. mão na bola) cometida **dentro da própria área** com a bola em jogo.
- **Execução (Procedure)** — bola na marca penal; **cobrador claramente identificado**; goleiro entre os postes virado ao cobrador; demais jogadores fora da área, atrás da bola e do arco, a **≥ 9,15 m**.
- **Goleiro (Goalkeeper)** — deve ter **ao menos parte de um pé** sobre, atrás ou alinhado à linha de meta no momento do chute (não pode estar à frente).
- **Finta / paradinha (Feinting)** — fintar na **corrida** é permitido; fintar **após concluir a corrida** (parar) é infração — advertência (CA) e, se houver gol, **tiro livre indireto** ao adversário; se não houver gol, repete-se conforme o caso.
- **Toque duplo do cobrador (Double touch — clarificação jun/2025)** — se o cobrador **deliberadamente** joga a bola de novo antes de outro jogador tocá-la, é **tiro livre indireto** (ou direto se for mão). Mas o **toque duplo acidental** (ex.: pé de apoio raspa a bola por escorregão) **com gol** → o pênalti é **repetido**; em **disputa de pênaltis**, idem (repetir se entrou, sem mais sanção). Mudança originada do caso Julián Álvarez (Atlético × Real Madrid, 2025).
- **Invasão / encroachment (Encroachment)** — invasão de jogadores só é punida se **impactar** o lance: se o cobrador invade e há gol → repete; se um companheiro invade e o gol vem após rebote por ele tocado → repete; se um defensor invade e há gol → vale; se não há gol → repete. O mesmo princípio do goleiro aplica-se aos jogadores de linha.
- **Rebote (Rebound)** — em pênalti **durante o jogo**, a bola segue em jogo (cobrador pode jogá-la de novo só após rebote do **goleiro/adversário**; após rebote em **trave/travessão** deve esperar outro toque). Em **disputa de pênaltis (shootout)** **não há rebote** — a jogada acaba.

### Lei 15 — O Arremesso Lateral / Lançamento Lateral (Law 15 — The Throw-In)

- **Arremesso lateral / lateral (Throw-in)** — reinício quando a bola sai **inteira** pela linha lateral; cobrança da equipe que **não** tocou por último.
- **Técnica (Technique)** — cobrador de **frente para o campo**, parte do corpo sobre/atrás da linha, **ambos os pés no chão** (no chão, na linha ou fora), lançando com **as duas mãos por trás e por cima da cabeça**, do ponto onde a bola saiu.
- **Restrições** — **não se marca gol** diretamente (se a bola entra na meta adversária → escanteio; na própria → tiro de meta); **não há impedimento** na recepção direta; o cobrador **não pode tocar a bola duas vezes** antes de outro jogador (sanção: tiro livre indireto).
- **Adversários (Opponents)** — devem ficar a **≥ 2 m** do ponto do arremesso.
- **Arremesso errado (Foul throw)** — técnica incorreta = arremesso para o adversário.

### Lei 16 — O Tiro de Meta (Law 16 — The Goal Kick)

- **Tiro de meta / pontapé de baliza (Goal kick)** — reinício quando a bola sai **inteira** pela linha de fundo, **tocada por último por atacante**, sem gol.
- **Execução (Procedure)** — bola parada em **qualquer ponto da área de meta**; **em jogo assim que é chutada** e claramente movimentada (mudança 2019: não precisa sair da área antes de outro jogador tocar).
- **Adversários (Opponents)** — devem permanecer **fora da área penal** até a bola estar em jogo.
- **Outras regras** — permite **gol contra o adversário diretamente** (gol contra na própria meta = escanteio); permite **passe curto ao próprio goleiro/companheiro dentro da área**; **não há impedimento** na recepção direta.

### Lei 17 — O Tiro de Canto / Escanteio (Law 17 — The Corner Kick)

- **Escanteio / pontapé de canto / tiro de canto (Corner kick)** — reinício quando a bola sai **inteira** pela linha de fundo, **tocada por último por defensor**, sem gol.
- **Execução (Procedure)** — bola dentro do **quadrante de canto** mais próximo de onde saiu; a bandeirinha de canto não pode ser movida; pode-se **marcar gol diretamente**; **não há impedimento** na recepção direta; cobrador não pode tocar duas vezes (sanção: tiro livre indireto).
- **Distância (Distance)** — adversários a **≥ 9,15 m** do arco de canto até a bola estar em jogo.

---

### Sanções e disciplina (Sanctions & discipline)

| Termo PT (Term EN) | Significado |
|---|---|
| Advertência (Caution) | Aviso formal sinalizado com cartão amarelo |
| Expulsão (Sending-off / dismissal) | Saída obrigatória do campo, sinalizada com cartão vermelho; equipe fica com um a menos e não pode repor o jogador |
| Cartão amarelo (Yellow card) | Sinaliza advertência |
| Cartão vermelho direto (Straight red card) | Expulsão sem amarelo prévio |
| Segundo amarelo (Second yellow / soft red) | Dois amarelos = vermelho |
| Vantagem (Advantage / play-on) | Árbitro deixa o jogo seguir em benefício do infringido |
| DOGSO | Impedir oportunidade clara de gol (geralmente vermelho) |
| SPA (Stopping a promising attack) | Interromper ataque promissor (geralmente amarelo) |
| Jogo brusco grave (Serious foul play) | Disputa pela bola com força excessiva/brutalidade (vermelho) |
| Conduta violenta (Violent conduct) | Agressão sem disputa de bola, contra qualquer pessoa (vermelho) |
| Imprudente / temerário / força excessiva (Careless / reckless / excessive force) | Graus de falta: imprudente = sem cartão; temerário = amarelo; força excessiva = vermelho |
| Triplo castigo mitigado (Triple punishment mitigation) | Pênalti por tentativa legítima de jogar a bola → amarelo, não vermelho |
| Sanção disciplinar à comissão (Staff / team-official sanctions) | Cartões a treinadores/membros do banco |
| Simulação (Simulation / diving) | Fingir falta ou lesão (amarelo) |

### Tecnologias e VAR (Technology & VAR)

- **VAR — Árbitro Assistente de Vídeo (Video Assistant Referee)** — assiste o árbitro em **erros claros e óbvios (clear and obvious error)** ou **incidentes graves não vistos (serious missed incident)**, restrito a **4 situações decisivas**:

| Situação (EN) | Termo PT |
|---|---|
| Goal / no goal | Gol / não-gol (incl. impedimento, mão, bola fora, infração na origem do lance) |
| Penalty / no penalty | Pênalti / não-pênalti |
| Direct red card | Cartão vermelho direto (não 2º amarelo) |
| Mistaken identity | Identidade trocada (cartão ao jogador errado) |

  - **AVAR (Assistant VAR; sem termo PT consagrado)** — auxiliar do VAR na sala de operação de vídeo (VOR).
  - **Sala de operação de vídeo (Video Operation Room — VOR)** — local onde VAR/AVAR/RO trabalham.
  - **Princípio "mínima interferência, máximo benefício" (Minimum interference, maximum benefit)** — filosofia central do VAR.
  - **OFR — Revisão à beira do campo (On-field review)** — árbitro revê o lance no monitor; **TV signal** = gesto de "tela/retângulo" para iniciar/comunicar a revisão.
  - **Revisão só do VAR (VAR-only review / "factual review")** — decisão factual (impedimento, bola fora, local da falta) confirmada sem ida ao monitor.
  - **APP — Fase de ataque possível (Attacking Possession Phase / APP)** — limita até onde o VAR "volta" para checar a origem de um lance que terminou em gol/pênalti.
  - **Plano de transparência do VAR** — em 2025/26, competições podem permitir que o árbitro **anuncie a decisão final ao estádio** pelo som e/ou que as imagens da OFR sejam exibidas.
- **Tecnologia da linha do gol (Goal-line technology — GLT)** — confirma automaticamente, em < 1 s, se a bola cruzou totalmente a linha; avisa o árbitro por sinal no relógio/comunicador.
- **Impedimento semiautomático (Semi-automated offside technology — SAOT)** — rastreamento óptico de jogadores + bola (incl. **bola conectada / connected ball** com sensor) para traçar a linha de impedimento mais rápido e gerar gráfico virtual; usado na Copa 2022, Copa Feminina 2023, Euro 2024, Premier League 2024/25 e previsto para a Copa 2026. Não muda o critério, acelera a decisão.
- **EPTS (Electronic Performance and Tracking Systems; sem termo PT consagrado)** — sistemas de rastreamento/monitoramento aprovados pela Lei 4.
- **Apoio em vídeo do futebol / desafio do treinador (Football Video Support — FVS / "coach challenge")** — sistema reduzido de revisão acionado pela própria equipe (nº limitado de desafios), testado em competições com infraestrutura menor que a do VAR.
- **Câmera corporal do árbitro (Referee body camera)** — em teste/uso desde 2025/26 (ver Lei 5).

### Experiências em curso (Ongoing trials)

- **Banimento da cabeçada deliberada (Ban on deliberate heading)** — em teste no futebol de base/juvenil (preocupação com saúde cerebral).
- **Football Video Support (FVS)** — desafio do treinador, em teste.
- **Protocolo "só o capitão" (Only the captain)** — adotado opcionalmente em 2025/26, obrigatório a partir de 1º/jul/2027.

### Glossário transversal (Cross-cutting glossary)

- **Bola ao solo (Dropped ball)** — reinício neutro (Lei 8).
- **Oito segundos / antigo seis segundos (GK time limit)** — limite de posse manual do goleiro; sanção atual = escanteio (Lei 12).
- **Recuo / passe atrás (Back-pass)** — restrição ao goleiro pegar com a mão (Lei 12).
- **Penúltimo adversário (Second-last opponent)** — referência do impedimento (Lei 11).
- **Defesa deliberada vs. jogada deliberada (Deliberate save vs. deliberate play)** — distinção que define se o impedimento é "resetado" (Lei 11).
- **Triplo castigo / "triple punishment" (sem termo PT consagrado)** — pênalti + vermelho + suspensão; mitigado para amarelo em tentativa legítima de jogar a bola (Lei 12).
- **Saída de meta vs. linha lateral (Goal line vs. touchline)** — define qual reinício (tiro de meta/escanteio vs. arremesso lateral).
- **Clear and obvious error / serious missed incident** — gatilhos de intervenção do VAR (Tecnologias e VAR).
- **Careless / reckless / excessive force** — escala de gravidade da falta que gradua a sanção disciplinar (Lei 12).

---

## Métricas e Estatísticas (Metrics & Analytics)

Convenção: cada métrica é nomeada em PT e EN. O sufixo **x** vem de *expected* (esperado) — modelos probabilísticos. Quando não há termo PT consagrado, usa-se o termo EN e indica-se "(sem termo PT consagrado)".

> **Normalização e leitura dos números.** Quase toda métrica de contagem é reportada em três formas: **total**, **por 90 minutos (per 90 / p90)** — divide pelo tempo jogado para comparar jogadores com minutagens diferentes (`stat ÷ minutos × 90`) — e **percentil (percentile)** dentro de uma posição/liga. Sempre cite **provedor, janela (jogo/temporada) e se inclui pênaltis** ao comparar.

### 1. Métricas tradicionais (Traditional / box-score metrics)

São contagens diretas de eventos, sem modelagem probabilística. Base de qualquer súmula.

#### 1.1 Ataque e finalização (Attacking & shooting)

- **Gols (Goals / G)** — bolas que entram no gol, excluindo gols contra a favor do marcador. Métrica final de eficácia.
- **Assistências (Assists / A)** — passe (ou ação) imediatamente anterior a um gol. Variação: **assistência secundária / pré-assistência (secondary assist / hockey assist)** — o passe antes da assistência.
- **Participações em gol (Goal involvements / G+A)** — soma de gols e assistências; também **gols + assistências sem pênaltis (npG+A)**.
- **Finalizações / Chutes (Shots / Sh)** — total de tentativas de chute a gol (inclui bloqueadas, fora e no alvo).
- **Finalizações no alvo (Shots on Target / SoT)** — chutes que entrariam no gol se não defendidos (exclui traves e chutes para fora). Trave **não** conta como no alvo na convenção Opta/FBref.
- **Precisão de finalização (Shot accuracy / SoT%)** — SoT ÷ Sh. Mede qualidade de direcionamento.
- **Conversão de chutes (Goals per shot / G/Sh)** e **gols por chute no alvo (G/SoT)** — eficiência ofensiva bruta.
- **Distância média de finalização (Average shot distance / Dist)** — distância média (em jardas) de onde se finaliza; proxy de seleção de chute.
- **Grandes chances (Big Chances)** — terminologia Opta: oportunidade clara em que se espera marcar (situação de 1-contra-1 ou chute curto). Subitens: **grandes chances perdidas (big chances missed)** e **grandes chances criadas (big chances created)**.
- **Passes decisivos / passes-chave (Key Passes / KP)** — passe que leva diretamente a uma finalização (sem virar gol; se virar, é assistência).
- **Toques na área (Touches in box / Att Pen)** — toques dentro da grande área adversária; proxy de presença ofensiva.
- **Mapa de chutes / gráfico de fluxo de xG (shot map / xG flow chart, xG race chart)** — visualizações: localização e qualidade de cada chute; acúmulo de xG ao longo do tempo entre as equipes.

#### 1.2 Passe e posse (Passing & possession)

- **Posse de bola (Possession / Poss%)** — percentual de tempo (ou de passes) com a bola. Dois métodos: por tempo de posse efetivo ou por share de passes (FBref usa passes).
- **Passes (Passes / total e completos)** — número de passes tentados e completados.
- **Precisão de passe (Pass completion % / Cmp%)** — passes certos ÷ tentados. Costuma estar entre 75% e 90% no alto nível.
- **Passes longos / curtos / médios (Long / short / medium passes)** — segmentação por distância (FBref: curto <15 jardas, médio 15-30, longo >30).
- **Distância total / progressiva de passe (Total / progressive passing distance, TotDist / PrgDist)** — metros somados de todos os passes e, separadamente, metros ganhos rumo ao gol.
- **Cruzamentos (Crosses)** — passes da faixa lateral para a área; com variante **cruzamentos certos (accurate crosses)** e **cruzamentos na área (crosses into penalty area, CrsPA)**.
- **Lançamentos (Through balls / passes em profundidade, TB)** — passe que rompe a linha defensiva para um companheiro em corrida.
- **Passes que quebram linha (Line-breaking passes / LBP)** *(sem termo PT consagrado)* — passe que ultrapassa uma ou mais linhas defensivas adversárias; identificado com dados de tracking/360.
- **Passes / conduções para o terço final (Passes/entries into final third)** — passe ou condução que cruza para o terço ofensivo; **entradas na área (penalty area entries)** análogo para a grande área. Wyscout: passe que origina fora do terço final e termina dentro dele.
- **Completações profundas (Deep completions)** *(sem termo PT consagrado)* — passe sem cruzamento que chega à zona a ~20 m do gol adversário (Wyscout). Variante: **cruzamento profundo completado (deep completed cross)**.
- **Progressões profundas (Deep progressions)** *(sem termo PT consagrado)* — passes + conduções que entram no terço final do adversário.
- **Bolas paradas (Set pieces / dead-ball)** — escanteios (corners), faltas (free kicks), laterais (throw-ins), pênaltis (penalties).

#### 1.3 Defesa e disciplina (Defending & discipline)

- **Desarmes (Tackles / Tkl)** — disputa em que o jogador toma/contesta a bola do adversário. **Desarmes ganhos (Tackles won / TklW)** na definição FBref: desarmes em que **a equipe** recuperou a posse. Subdivisão por terço: **defensivo / meio / ofensivo (Def 3rd / Mid 3rd / Att 3rd)**.
- **Interceptações (Interceptions / Int)** — corte de um passe adversário lendo a trajetória da bola.
- **Desarmes + interceptações (Tackles + interceptions / Tkl+Int)** — somatório FBref de ações defensivas de recuperação de bola.
- **Bloqueios (Blocks / Blk)** — bloquear chute ou passe colocando o corpo na trajetória. Subitens: **chutes bloqueados (shots blocked)**, **passes bloqueados (passes blocked)**.
- **Cortes / afastamentos (Clearances / Clr)** — afastar a bola da zona de perigo sem destino a companheiro.
- **Duelos (Duels)** — disputas 1-contra-1; **duelos aéreos (aerial duels)** e **duelos de chão (ground duels)**, com **% ganho (duel win %)** e **% de duelos aéreos ganhos (aerial win %, Won%)**.
- **Recuperações (Recoveries / ball recoveries)** — vezes em que o jogador recupera bola solta/disputada (distinta de interceptação, que lê um passe).
- **Erros que levam a chute/gol (Errors leading to shot/goal)** — falha individual que resulta diretamente em finalização ou gol adversário.
- **Perdas de controle (Miscontrols / Mis)** — falha ao tentar dominar a bola. **Perda de bola por desarme (Dispossessed / Dis)** — perde a posse após ser desarmado pelo adversário.
- **Faltas cometidas / sofridas (Fouls committed / Fouls drawn)** — infrações cometidas e sofridas.
- **Cartões (Cards)** — **amarelo (yellow)**, **vermelho (red)**, **segundo amarelo (second yellow)**.
- **Impedimentos (Offsides)** — posições de impedimento marcadas.

#### 1.4 Goleiro (Goalkeeping)

- **Defesas (Saves)** — finalizações no alvo defendidas. **% de defesas (Save % / Sv%)** = defesas ÷ chutes no alvo enfrentados.
- **Gols sofridos (Goals against / GA)**, **gols sofridos por 90 (GA90)** e **jogos sem sofrer gols (Clean sheets / CS, CS%)**.
- **Saídas / cruzamentos interceptados (Crosses stopped / claims, Stp%)** — cruzamentos cortados pelo goleiro, com percentual sobre os cruzamentos enfrentados.
- **Ações defensivas fora da área (Sweeper actions / #OPA, defensive actions outside penalty area)** — cortes/desarmes/interceptações do goleiro fora da grande área; mede goleiro-líbero (FBref: `#OPA` total e por 90).
- **Distância média da ação defensiva do goleiro (Average distance of defensive actions / AvgDist)** — distância média ao gol (jardas) das saídas; quanto maior, mais alto o goleiro joga.
- **Passe do goleiro: lançamentos e distribuição (Launched passes %, pass length, goal kicks)** — % de passes longos (lançados >40 jd), comprimento médio de passe e de tiro de meta; perfila goleiro de construção vs. de chutão.
- **Pênaltis enfrentados / defendidos (Penalties faced / saved)** — cobranças sofridas e defendidas.

### 2. Métricas avançadas / modeladas (Advanced / modelled metrics)

Probabilidades estimadas por modelos estatísticos a partir de dados de eventos (e, nas mais novas, de rastreamento/tracking).

#### 2.1 Família "Expected" — qualidade de chance (Expected family — chance quality)

| Métrica (PT / EN) | O que mede | Detalhe |
|---|---|---|
| **Gols esperados (Expected Goals / xG)** | Probabilidade de cada finalização virar gol (0-1), somada ao longo do jogo/temporada | Inputs: distância e ângulo ao gol, parte do corpo, tipo de assistência, fase de jogo (bola rolando vs. parada), pressão defensiva. xG = Σ pᵢ |
| **xG por chute (xG per shot / xG/Sh)** | xG médio por finalização | Mede a **qualidade** média das chances criadas, não o volume |
| **xG sem pênaltis (Non-penalty xG / npxG)** | xG excluindo cobranças de pênalti (~0,76 de xG cada) | Avalia geração de chance em jogo aberto, sem distorção dos pênaltis |
| **Assistências esperadas (Expected Assists / xA, xAG)** | Probabilidade de um passe completado virar assistência | Baseado em tipo de passe e localização de chegada (terminologia Opta). FBref distingue **xAG** (xG do chute que o passe gerou) de **xA** modelado |
| **npxG + xAG (npxG+xAG)** | Soma de criação própria (chute) + criação para o outro, sem pênaltis | Resumo FBref do impacto ofensivo total por 90 |
| **Gols esperados pós-chute (Post-Shot xG / PSxG)**, também **xG no alvo (xG on Target / xGOT)** | Probabilidade de gol **dado que o chute foi no alvo**, somando qualidade da chance + canto/altura onde a bola foi colocada | Só existe para chutes no alvo. Premia bolas nos cantos vs. centro. Usada para avaliar finalizador e goleiro |
| **xG concedido / xGA (xG against)** | Soma do xG das finalizações sofridas | Mede qualidade defensiva (chances cedidas) |
| **PSxG +/− (PSxG +/−, PSxG-GA)** | PSxG enfrentado menos gols sofridos pelo goleiro | Métrica de goleiro: positivo = defendeu mais do que o esperado |

- **Diferença xG (xG difference / xGD)** — xG criado menos xG concedido; saldo de chances de uma equipe. **xGD por 90 (xGD/90)** normaliza por jogo.
- **Sobre/sub-rendimento (xG over/underperformance, G−xG / np:G−xG)** — gols reais menos xG; finalização "quente" ou "fria" (tende a regredir à média).
- **Pontos esperados (Expected Points / xP, xPts)** — pontos que a equipe deveria ter somado, simulando milhares de resultados a partir do xG das duas equipes em cada jogo (0/1/3). Mede performance "merecida" e sorte na tabela.

#### 2.2 Modelos de valor de ação e posse (Action/possession-value models)

Vão além do chute: atribuem valor a passes, conduções e dribles pela contribuição ao gol.

- **xGChain (xGChain / xGC)** *(sem termo PT consagrado — "cadeia de xG")* — soma o xG de toda posse em que o jogador participou, creditando todos os envolvidos. Destaca quem constrói a jogada (volantes, zagueiros de saída). Origem: Understat/StatsBomb.
- **xGBuildup (xGBuildup)** *(sem termo PT consagrado — "construção de xG")* — igual ao xGChain, **excluindo** o chute do próprio jogador e o passe-chave (assistência). Isola a construção pura, sem crédito por finalizar ou assistir.
- **Ameaça esperada (Expected Threat / xT)** — divide o campo em grade; cada zona tem uma probabilidade de gerar gol nas próximas N ações. Valoriza passes/conduções pela mudança de zona (origem → destino). Ignora o adversário. Criado por Karun Singh.
- **VAEP (Valuing Actions by Estimating Probabilities)** *(sem termo PT consagrado)* — valor de cada ação = variação na probabilidade de marcar **menos** a de sofrer, olhando as ~3 ações anteriores. Framework acadêmico (KU Leuven), lib `socceraction`.
- **OBV (On-Ball Value)** *(sem termo PT consagrado)* — versão StatsBomb do valor de posse; considera bola parada e pressão.
- **g+ / Goals Added (goals added)** *(sem termo PT consagrado — "gols adicionados")* — versão American Soccer Analysis; prevê diferença de gols na posse atual e na próxima.
- **PV (Possession Value)** *(sem termo PT consagrado)* — versão Stats Perform/Opta.
- **Packing (Packing)** *(sem termo PT consagrado)* — número de adversários "superados" (deixados para trás) por um passe ou condução. Submétrica de defensores superados ao receber (**Impect / bypassed defenders**). Provedor: Impect.

> Nota: xT, VAEP, OBV, g+ e PV são todos *Expected Possession Value (EPV)* — conceitualmente irmãos. Diferem em quanto contexto usam e se modelam o gol sofrido: g+/OBV preveem diferença de gols na posse atual e próxima; xT prevê só o gol nas próximas ~5 ações e ignora o adversário; VAEP usa as últimas ~3 ações.

#### 2.3 Progressão e condução (Progression & carrying)

- **Passes progressivos (Progressive passes / PrgP)** — passe que avança a bola significativamente rumo ao gol. Definição FBref: ≥10 jardas mais perto que o ponto mais avançado dos últimos 6 passes, **ou** qualquer passe completado para dentro da área; exclui passes originados nos primeiros 40% do campo. (Convenção Wyscout por zonas: 30 m no campo próprio, 15 m cruzando o meio, 10 m no campo adversário.)
- **Conduções progressivas (Progressive carries / PrgC)** — conduzir a bola avançando rumo ao gol (limiar análogo aos passes progressivos).
- **Conduções (Carries)** — qualquer controle com movimento de bola nos pés; **distância total / progressiva de condução (carry total/progressive distance, TotDist / PrgDist)** mede metros percorridos e metros ganhos rumo ao gol.
- **Recepções progressivas (Progressive passes received / PrgR)** — passes progressivos recebidos pelo jogador; mede movimentação ofensiva.
- **Dribles / conduções bem-sucedidas (Take-ons / dribbles, Succ)** — tentativas de passar pelo marcador em condução; com **% de sucesso (take-on success %)** e **vezes driblado / superado (tackled during take-on)**.

#### 2.4 Criação de chances e ações (Chance & action creation)

- **Ações de criação de chute (Shot-Creating Actions / SCA)** — as 2 ações ofensivas imediatamente anteriores a uma finalização (passe rolando, passe de bola parada, drible, falta sofrida, ação defensiva que recupera e arma). Métrica FBref, decomposta por tipo (PassLive, PassDead, TO, Sh, Fld, Def).
- **Ações de criação de gol (Goal-Creating Actions / GCA)** — as 2 ações ofensivas imediatamente anteriores a um gol. Mesma lógica do SCA, mas terminando em gol.

#### 2.5 Pressão e estilo defensivo (Pressing & defensive style)

- **PPDA (Passes Allowed Per Defensive Action)** *("passes por ação defensiva")* — nº de passes que o adversário consegue dar antes de sofrer uma ação defensiva (desarme, interceptação, falta), medido nos ~60% finais do campo do adversário. **Quanto menor, mais intenso o pressing.** Inverso = intensidade de pressão.
- **Inclinação de campo (Field Tilt)** *(sem termo PT consagrado)* — share de passes no terço final entre as duas equipes; mede domínio territorial (diferente da posse global).
- **Pressões (Pressures)** *(sem termo PT consagrado)* — ações de pressionar o portador da bola; com **% de pressões bem-sucedidas (successful pressure %)** quando a equipe recupera a bola em até ~5s. (Métrica StatsBomb; descontinuada no FBref público a partir de 2023.)
- **Contrapressão / Gegenpressing (Counterpressing / gegenpressing)** — pressionar imediatamente após perder a bola para recuperá-la rápido; medida por recuperações nos primeiros ~5s pós-perda.
- **Ações defensivas no campo adversário (Defensive actions in attacking third)** — proxy de linha de pressão alta.
- **Altura da linha defensiva (Defensive action height / defensive line height)** — altura média no campo onde a equipe age sem a bola.
- **Recuperações altas (High turnovers / high recoveries)** — recuperações no terço ofensivo, frequentemente convertidas em chute.

#### 2.6 Sequências, posses e velocidade (Sequences, possessions & tempo — Opta)

- **Sequências (Sequences)** — passagens de jogo de uma mesma equipe, encerradas por ação defensiva, parada ou finalização (Stats Perform/Opta).
- **Posses (Possessions)** — uma ou mais sequências seguidas da mesma equipe.
- **Velocidade direta (Direct Speed)** *(sem termo PT consagrado)* — metros por segundo progredidos rumo ao gol em sequências de jogo aberto; mede ritmo vertical.
- **Ataques construídos (Build-up attacks)** — sequência de jogo aberto com 10+ passes que termina em chute ou toque na área.
- **Ataques diretos (Direct attacks)** — sequência que começa perto do próprio campo, avança ≥50% rumo ao gol e termina em chute/toque na área; mede transição/verticalidade.

#### 2.7 Métricas de tracking e dados físicos (Tracking & physical metrics)

Derivadas de rastreamento óptico/GPS (posições muitas vezes por segundo), não do log de eventos.

- **Controle de campo (Pitch control / Potential Pitch Control Field, PPCF)** *(sem termo PT consagrado)* — probabilidade de cada equipe controlar a bola em cada ponto do campo, dado posição e velocidade dos jogadores (Spearman, "Beyond Expected Goals").
- **Corridas sem bola (Off-ball runs)** — movimentações sem a bola que criam/ocupam espaço; quantificadas via tracking (ex.: SkillCorner) e podem receber valor de xT.
- **Dados físicos (Physical data)** — distância total e por intensidade, **sprints**, número e distância de **corridas em alta velocidade (high-speed runs)**, velocidade máxima, acelerações/desacelerações.
- **xG de tiro pós-tracking / pressão no chute** — modelos de xG que usam posição de defensores e goleiro no momento do chute (freeze-frame), além de localização.

### 3. Provedores e fontes de dados (Providers & data sources)

| Provedor (EN) | Tipo de dado | Acesso | Observações |
|---|---|---|---|
| **Opta / Stats Perform** | Event data + tracking | Comercial | Padrão da indústria; alimenta transmissões e muitos sites. Métricas: Big Chances, xG, PV, sequências/posses |
| **StatsBomb** | Event data detalhado + **StatsBomb 360** (posicionamento de quem está fora da bola) | Comercial + **open-data** gratuito (JSON no GitHub) | Métricas próprias: OBV, xGChain/xGBuildup, pressures. Melhor fonte aberta para event data |
| **FBref (Sports Reference)** | Estatísticas por jogo/temporada/carreira | Gratuito | Era alimentado por dados Opta; **perdeu a licença Opta em jan/2026** (não recebe mais stats avançadas atualizadas). Glossário canônico de SCA/GCA/progressivos/#OPA |
| **Stathead (FBref)** | Query builder sobre o histórico do FBref | Assinatura | Filtra qualquer combinação de stats em qualquer jogo da base |
| **Understat** | xG, xGChain, xGBuildup por chute | Gratuito (web/scraping) | Popularizou xGChain/xGBuildup; cobre as 5 grandes ligas |
| **Wyscout (Hudl)** | Event + vídeo, scouting | Comercial | Glossário próprio (deep completions, ball progression); muito usado por clubes e scouts |
| **SkillCorner** | Tracking por broadcast (dados físicos, corridas sem bola) | Comercial | Velocidade, distância, corridas off-ball, passe progressivo contextual |
| **Impect** | **Packing** e defensores superados | Comercial | Criou e licencia o conceito de packing |
| **DTAI / KU Leuven** | Framework acadêmico **VAEP** + lib `socceraction` | Open-source | Referência acadêmica de valor de ações |
| **Second Spectrum / Genius Sports** | Tracking óptico (Second Spectrum comprado pela Genius Sports por ~US$200M) | Comercial | Tracking oficial de ligas; alimenta PPCF/off-ball |
| **Hawk-Eye / TRACAB (ChyronHego) / SportVU** | Tracking óptico multi-câmera | Comercial | Posicionamento e dados físicos oficiais de ligas/torneios |
| **SofaScore / WhoScored / FotMob** | Stats agregadas voltadas ao público (ratings, mapas de calor) | Gratuito/freemium | Consumidor; WhoScored e SofaScore usam Opta; ratings proprietários |
| **American Soccer Analysis** | **g+ / Goals Added** | Gratuito | EPV aberto, foco em MLS |

> Atenção a inconsistências entre provedores: modelos de xG diferem (StatsBomb usa freeze-frame de posição de defensores; Understat e Opta usam features distintas), então o xG de um mesmo chute pode variar entre fontes. Definições de "passe progressivo", "duelo" e "posse" também divergem (FBref/Opta vs. Wyscout). Sempre cite o provedor e a definição ao comparar números.

---

## Competições e Estruturas (Competitions & Structures)

Este ramo descreve **como** as competições de futebol são organizadas: o desenho da disputa (formato), as regras que movem times entre níveis e desempatam tabelas (estruturas), os arquétipos de torneio (tipos) e a malha temporal que tudo isso ocupa (calendário).

### Formatos de competição (Competition formats)

#### Pontos corridos / liga (League / round-robin)

- **Pontos corridos (Round-robin / League format)** — Todos os participantes se enfrentam; vence quem somar mais pontos ao fim das rodadas. Sem mata-mata: o título sai da classificação acumulada. (ex.: Premier League, Campeonato Brasileiro Série A.)
- **Turno único (Single round-robin)** — Cada time enfrenta os demais uma só vez. Usado quando o calendário é curto (ex.: fase de liga da Champions desde 2024, em que cada clube joga 8 de 35 adversários possíveis).
- **Turno e returno / ida e volta na tabela (Double round-robin / home-and-away league)** — Cada time enfrenta os demais duas vezes, uma em casa e uma fora, equilibrando o mando. Padrão das ligas nacionais (ex.: Brasileirão, 38 rodadas com 20 clubes).
- **Pontos corridos em duas fases (Apertura/Clausura)** — Temporada partida em dois torneios curtos de pontos corridos, cada um com campeão próprio. Comum na América Latina (ex.: Liga MX, ligas argentina e uruguaia).
- **Pontos corridos + playoff final (League + championship playoff / liguilla)** — Fase regular de pontos corridos seguida de um mata-mata final entre os mais bem colocados, que decide o título (ex.: *liguilla* da Liga MX; playoffs da MLS após a temporada regular). Difere do pontos corridos "puro", em que o líder da tabela já é campeão.
- **Rodada (Matchday / round / gameweek)** — Conjunto de jogos disputados num mesmo período da liga; numerada sequencialmente (1ª rodada, última rodada).
- **Turno e returno (First half / second half of the season)** — As duas metades de uma liga de pontos corridos; no Brasil, "campeão do primeiro turno" é uma distinção informal sem título oficial.

#### Mata-mata / eliminatórias (Knockout / single-elimination)

- **Mata-mata (Knockout / single-elimination / cup format)** — Quem perde está fora; o torneio avança por chaveamento até a final. (ex.: fases finais da Copa do Mundo, Copa do Brasil.)
- **Chave / chaveamento (Bracket / draw)** — Estrutura que define os confrontos e o caminho de cada lado até a final (ex.: "lado de cima" e "lado de baixo" da chave).
- **Jogo único (Single match / one-off tie)** — Confronto decidido em uma só partida, normalmente em campo neutro (ex.: final da Copa Libertadores desde 2019; finais do Mundial de Clubes 2025).
- **Cabeça de chave (Seed / seeded team)** — Time melhor classificado no sorteio (por ranking/coeficiente), protegido de enfrentar outro cabeça de chave nas fases iniciais.
- **Potes do sorteio (Seeding pots)** — Grupos de clubes/seleções de força semelhante (Pote 1, 2, 3, 4) usados no sorteio para distribuir os fortes entre grupos/chaves diferentes.
- **Sorteio (Draw)** — Procedimento que distribui os clubes em grupos ou confrontos, geralmente com potes (pots) por força/coeficiente e restrições (ex.: evitar dois clubes do mesmo país no mesmo grupo).
- **Bye (Bye / "passagem direta")** — Avanço de fase sem jogar, por número ímpar de participantes ou por sementeio.
- **Rodadas eliminatórias nomeadas (Named knockout rounds)** — Sequência padrão: trigésima-segunda de final / fase de 32 (Round of 32) → oitavas de final (Round of 16) → quartas de final (Quarter-finals) → semifinais (Semi-finals) → final (Final). A "fase preliminar/prévia" (preliminary/qualifying round) antecede tudo.
- **Disputa de terceiro lugar (Third-place play-off / bronze final)** — Jogo entre os perdedores das semifinais para definir o 3º colocado (presente na Copa do Mundo; ausente em muitas copas, inclusive o Mundial de Clubes 2025).
- **Repescagem por "lucky loser" / melhor perdedor (Lucky loser / wildcard)** — Vaga concedida a um eliminado com a melhor campanha, quando faltam clubes para fechar uma chave.

##### Replays e jogos extras (Replays and rematches)

- **Replay / jogo de volta de desempate (Cup replay)** — Tradição inglesa: empate na copa gerava uma nova partida na casa do visitante original, em vez de prorrogação imediata.
- **Abolição dos replays da FA Cup (Abolition of FA Cup replays)** — A FA aboliu os replays a partir de **2024–25** (acordo de seis anos com a Premier League), em todas as rodadas; empates passam direto a prorrogação e pênaltis. Motivos: descongestionar o calendário diante da expansão das competições da UEFA. Criticado por clubes menores, que perdiam a renda de receber gigantes num replay.

#### Confronto de ida e volta (Two-legged tie)

- **Ida e volta / dois jogos (Two-legged tie)** — Confronto eliminatório decidido em duas partidas, uma na casa de cada clube; vence quem tiver maior placar agregado. (ex.: oitavas a semifinais da Libertadores e da Champions.)
- **Final em ida e volta (Two-legged final)** — Final disputada em dois jogos (ex.: finais da Copa do Brasil; finais da Libertadores até 2018, antes da migração para jogo único).
- **Placar agregado (Aggregate score)** — Soma dos gols dos dois jogos. Critério primário para definir o vencedor de um confronto de ida e volta (ex.: 2–1 e 1–1 = agregado 3–2).
- **Jogo de ida / jogo de volta (First leg / second leg)** — A primeira e a segunda partida do confronto; o time que joga a volta em casa costuma ser o mais bem ranqueado.
- **Prorrogação (Extra time)** — Dois tempos de 15 minutos jogados quando o agregado está empatado ao fim do tempo normal do jogo de volta (regra UEFA pós-2021).
- **Disputa por pênaltis (Penalty shootout / kicks from the penalty mark)** — Cobranças alternadas que definem o classificado quando persiste o empate após a prorrogação.

##### Gol qualificado fora de casa (Away goals rule)

- **Gol fora de casa / gol qualificado (Away goals rule)** — Desempate histórico: com agregado igual, classificava quem marcasse mais gols como visitante. Introduzido pela UEFA em 1965.
- **Abolição do gol qualificado (Abolition of the away goals rule)** — A UEFA aboliu a regra em **24/06/2021**, valendo a partir de **2021–22**, em todas as competições de clubes (masculinas, femininas e de base). Motivos: a regra inibia o time mandante na ida (medo de sofrer gol "que vale dobrado") e era considerada injusta na prorrogação. Sem ela, empate no agregado vai direto a prorrogação e, persistindo, a pênaltis.
- **Observação de transição** — Algumas competições nacionais e a CONMEBOL já não usavam (ou já tinham abandonado) o critério antes da decisão da UEFA; a Libertadores aboliu o gol qualificado em 2005.

##### Gol de ouro e gol de prata (Golden goal and silver goal — abolidos)

- **Gol de ouro / morte súbita (Golden goal / sudden death)** — Regra (introduzida pelo IFAB em 1993, batizada pela FIFA) em que o primeiro gol na prorrogação encerrava o jogo, dando a vitória. Usado em Copas de 1998 e 2002 e na Euro 1996/2000.
- **Gol de prata (Silver goal)** — Variante (2002–2004): quem estivesse à frente no fim do primeiro tempo da prorrogação vencia, sem precisar completar os 30 minutos.
- **Abolição (Abolition)** — O IFAB extinguiu **gol de ouro e gol de prata** após a **Euro 2004**; desde a Copa de 2006 a prorrogação voltou a ser dois tempos completos de 15 minutos. Motivo: as regras geravam jogo defensivo (medo de sofrer o gol decisivo), o oposto do efeito ofensivo pretendido.

#### Grupos + mata-mata (Group stage + knockout)

- **Fase de grupos (Group stage)** — Mini-ligas de pontos corridos (geralmente 4 times, turno e returno) das quais os melhores avançam ao mata-mata. (ex.: 8 grupos de 4 na Copa do Mundo até 2022 e no Mundial de Clubes 2025.)
- **Classificação ao mata-mata (Qualification to knockout)** — Regra que define quantos avançam por grupo (ex.: 2 primeiros de cada grupo) e eventuais vagas extras.
- **Melhores terceiros (Best third-placed teams)** — Vagas concedidas aos terceiros colocados mais bem ranqueados entre todos os grupos, quando há mais grupos que potências de 2. (ex.: 8 melhores terceiros na Copa do Mundo de 2026, com 12 grupos → mata-mata de 32.)
- **Fase de liga / modelo suíço (League phase / Swiss model)** — Tabela única em que cada clube joga contra um subconjunto de adversários sorteados, sem turno e returno completo; substitui a fase de grupos. Inspirado no xadrez/esports. (ex.: Champions League 2024–25 — 36 clubes, 8 jogos cada, tabela única; top 8 vai direto às oitavas, 9º–24º disputam playoff de ida e volta, 25º–36º eliminados.)
- **Formato híbrido / multi-fase (Hybrid / multi-stage format)** — Combinação de grupos, fase única e mata-mata num mesmo torneio. (ex.: Campeonato Paulista 2024 — 16 clubes em 4 grupos, mas cada time enfrenta só os 12 adversários de fora do seu grupo numa fase única de 12 rodadas; 2 melhores de cada grupo vão às quartas em jogo único; final em ida e volta; os 2 piores em pontos no geral caem para a Série A2.)

#### Playoffs e repescagem (Play-offs and repechage)

- **Playoff de promoção / acesso (Promotion play-offs / promotion play-off)** — Mini-torneio entre clubes logo abaixo da zona de acesso direto para decidir a última vaga de subida. (ex.: EFL Championship — 3º a 6º disputam semifinais de ida e volta e final em jogo único em Wembley; expansão prevista para 6 clubes a partir de 2026–27.) Historicamente chamado, na Inglaterra, de *test matches*.
- **Playoff de classificação / playoff round (Play-off round)** — Rodada eliminatória que filtra clubes intermediários antes da fase principal (ex.: playoff da Champions 2024–25 entre os colocados de 9º a 24º).
- **Repescagem (Repechage / second-chance qualifier)** — "Segunda chance" para times eliminados ou mal classificados disputarem uma vaga remanescente. (ex.: 3º colocado dos grupos da Libertadores cai para os playoffs da Sul-Americana.)
- **Eliminatórias intercontinentais / repescagem mundial (Inter-confederation play-offs)** — Mata-mata entre seleções de confederações diferentes por vagas finais na Copa do Mundo. Para 2026: **6 seleções** em **2 chaves de 3**, jogos únicos, prorrogação e pênaltis se preciso; o cabeça de chave (por ranking) espera na final da chave enquanto os outros dois jogam a semi; os **2 vencedores de chave** se classificam. Cada confederação teve 1 vaga (exceto UEFA), mais uma extra para a confederação do(s) anfitrião(ões) — a CONCACAF ficou com 2. Disputado no México em março de 2026.

### Estruturas (Structures)

#### Divisões e acesso/rebaixamento (Divisions and promotion/relegation)

- **Sistema de divisões / pirâmide do futebol (League system / football pyramid)** — Hierarquia de ligas em níveis (1ª, 2ª, 3ª divisão…) interligadas por acesso e rebaixamento. (ex.: no Brasil, Séries A→B→C→D; na Inglaterra, Premier League → EFL Championship → League One → League Two e, abaixo, o futebol não profissional / *non-league*.)
- **Acesso / promoção (Promotion)** — Subida de um clube para a divisão imediatamente superior por desempenho na temporada. O número de vagas varia (ex.: 4 acessos na Série B brasileira; 3 na Championship inglesa, sendo a 3ª via playoff).
- **Rebaixamento (Relegation)** — Queda para a divisão imediatamente inferior; o oposto do acesso (ex.: 4 rebaixados no Brasileirão Série A; 3 na Premier League).
- **Zona de rebaixamento (Relegation zone / drop zone)** — Faixa final da tabela cujos ocupantes são rebaixados (ex.: "Z4" no Brasileirão = últimos 4 colocados).
- **Zona de classificação (Qualification zone)** — Faixa do topo da tabela que dá vaga a competições continentais (ex.: G4 → Libertadores; G6 → Libertadores + pré-Liberta).
- **Liga fechada / franquia (Closed league / franchise system)** — Modelo sem acesso/rebaixamento, com vagas fixas (ex.: MLS, padrão norte-americano). Contraste com a pirâmide aberta europeia/sul-americana.
- **Expansão / clube de expansão (Expansion / expansion team)** — Em ligas fechadas, a entrada de uma nova franquia por concessão paga (não por mérito esportivo), comum na MLS.

#### Sistema de pontos (Points system)

| Sistema (System) | Vitória (Win) | Empate (Draw) | Derrota (Loss) | Uso (Usage) |
|---|---|---|---|---|
| Dois pontos por vitória (Two points for a win) | 2 | 1 | 0 | Padrão clássico até os anos 1980/90 |
| Três pontos por vitória (Three points for a win) | 3 | 1 | 0 | Padrão global atual |

- **Três pontos por vitória (Three points for a win)** — Recompensa maior à vitória para estimular o jogo ofensivo e desestimular o empate. Criado por Jimmy Hill, adotado na Inglaterra em **1981–82**; usado pela primeira vez numa Copa do Mundo em **1994** e adotado pela FIFA em **1995**, tornando-se padrão mundial.
- **Pontuação corrida (League points / pontos ganhos)** — Total acumulado de pontos que define a classificação numa liga ou fase de grupos.
- **Aproveitamento (Points percentage / PPG — points per game)** — Pontos obtidos sobre o máximo possível (ou por jogo). Usado em rankings e, ocasionalmente, como critério ou para encerrar temporadas interrompidas (ex.: definição via PPG em ligas paralisadas).
- **Dedução de pontos / punição em pontos (Points deduction)** — Subtração de pontos por irregularidade administrativa, financeira (fair play financeiro) ou disciplinar (ex.: punições a clubes ingleses por descumprir regras de gastos).

#### Critérios de desempate (Tiebreakers)

- **Critérios de desempate (Tiebreakers / tie-breaking criteria)** — Sequência hierárquica aplicada quando clubes terminam empatados em pontos; varia por competição. Os mais comuns abaixo.

| Critério (Criterion) | O que mede (What it measures) |
|---|---|
| Pontos (Points) | Critério primário — só os abaixo entram em caso de empate |
| Número de vitórias (Number of wins) | Total de jogos vencidos |
| Saldo de gols (Goal difference) | Gols marcados − gols sofridos |
| Gols pró / marcados (Goals scored / goals for) | Total de gols a favor |
| Confronto direto (Head-to-head record) | Resultado entre os clubes empatados (só com 2 empatados, no Brasileirão) |
| Gols fora de casa (Away goals) | Gols como visitante (usado p/ desempate em algumas tabelas) |
| Cartões vermelhos (Red cards / fair play) | Menos expulsões = melhor |
| Cartões amarelos (Yellow cards / fair play) | Menos amarelos = melhor |
| Sorteio (Drawing of lots) | Último recurso |
| Coeficiente do clube (Club coefficient) | Ranking histórico UEFA (último critério na fase de liga) |

- **Ordem no Brasileirão (CBF, hierárquica):** 1) pontos; 2) vitórias; 3) saldo de gols; 4) gols pró; 5) confronto direto (apenas entre 2 clubes); 6) cartões vermelhos; 7) cartões amarelos; 8) sorteio.
- **Ordem na fase de liga da UEFA (2024–25):** 1) saldo de gols; 2) gols marcados; 3) gols fora de casa; 4) vitórias; 5) vitórias fora; depois critérios de força dos adversários, disciplina e, por fim, coeficiente do clube. **Nota:** a UEFA substituiu o confronto direto pelo saldo de gols como primeiro critério, porque na fase de liga cada time enfrenta adversários diferentes.
- **Diferença chave PT/EN de jargão:** "saldo de gols" = *goal difference*; "gols pró" = *goals for/scored*; "confronto direto" = *head-to-head*.
- **Tabela sub judice (Provisional / sub judice table)** — Classificação provisória sujeita a alteração por decisões pendentes na justiça desportiva (recursos, pontos a confirmar).

### Tipos de torneio (Types of tournament)

#### Competições nacionais de clubes (National club competitions)

- **Liga nacional (National league)** — Campeonato de pontos corridos que define o campeão nacional (ex.: Campeonato Brasileiro Série A, Premier League, La Liga).
- **Copa nacional (National cup)** — Torneio de mata-mata aberto a clubes de várias divisões (ex.: Copa do Brasil, FA Cup, Copa del Rey).
- **Copa da liga (League cup / EFL Cup / Carabao Cup)** — Copa de mata-mata restrita aos clubes das divisões profissionais da liga, paralela à copa nacional aberta (típica da Inglaterra; sem equivalente direto no Brasil).
- **Supercopa nacional (National super cup)** — Jogo (ou mini-torneio) entre o campeão da liga e o campeão da copa nacional, abrindo a temporada.
  - **Supercopa do Brasil / Supercopa Rei (Brazilian Super Cup)** — Campeão do Brasileirão x campeão da Copa do Brasil, em jogo único e campo neutro; sem prorrogação (empate vai direto a pênaltis). Renomeada "Supercopa Rei" desde 2024 em homenagem a Pelé.
  - **Supercopa da Espanha (Spanish Super Cup)** — Desde 2019 em formato *final four*: campeão e vice de La Liga + campeão e vice da Copa del Rey, com semifinais e final em jogo único, sede no exterior.
- **Estaduais / regionais (State/regional championships)** — Torneios regionais que precedem a temporada nacional (ex.: Campeonato Paulista, Carioca) — sem equivalente direto na maioria dos países europeus. Têm pirâmide própria (ex.: Paulista A1, A2, A3, Segunda Divisão) com acesso e rebaixamento internos.

#### Competições continentais de clubes (Continental club competitions)

- **UEFA Champions League / Liga dos Campeões (UEFA Champions League)** — Principal torneio europeu de clubes. Desde 2024–25: fase de liga (modelo suíço, 36 clubes, 8 jogos) + playoffs + mata-mata de ida e volta, final em jogo único.
- **UEFA Europa League / Liga Europa (UEFA Europa League)** e **UEFA Conference League (UEFA Conference League)** — Segundo e terceiro escalões continentais europeus, com estrutura análoga.
- **Copa Libertadores da América (Copa Libertadores)** — Principal torneio sul-americano (CONMEBOL): fases prévias / pré-Libertadores (rodadas eliminatórias de ida e volta para entrar nos grupos) → 8 grupos de 4 (turno e returno) → mata-mata de ida e volta → **final em jogo único** (desde 2019). Terceiros dos grupos caem para a Sul-Americana.
- **Copa Sul-Americana (Copa Sudamericana)** e **Recopa Sul-Americana (Recopa Sudamericana)** — Segundo torneio continental e o "super" entre os campeões da Liberta e da Sul-Americana.
- **Coeficiente / ranking continental (UEFA/CONMEBOL coefficient)** — Pontuação histórica que define potes do sorteio, sementeio e número de vagas por país (a "access list" da UEFA distribui as vagas por associação conforme o coeficiente de país).

#### Competições de seleções (National team competitions)

- **Copa do Mundo FIFA (FIFA World Cup)** — Principal torneio de seleções, a cada 4 anos.
  - **Formato 2026 (2026 format)** — Expansão para **48 seleções** em **12 grupos de 4**; avançam os 2 primeiros de cada grupo + os **8 melhores terceiros**, formando um **mata-mata de 32 (Round of 32)**. Total de **104 jogos** (antes 64); finalistas jogam 8 partidas. Sediada por EUA, México e Canadá.
- **Eliminatórias / qualificatórias (Qualifiers / qualifying)** — Disputas continentais (por confederação) que distribuem as vagas da Copa do Mundo. Cada confederação tem seu formato:
  - **Eliminatórias Sul-Americanas (CONMEBOL)** — Pontos corridos em turno e returno entre todas as seleções (o formato mais longo e admirado).
  - **Hexagonal / Octogonal (CONCACAF)** — Antiga fase final em grupo único de 6 (*Hexagonal*) ou 8 seleções (*Octagonal*, usado para 2022); substituídos para 2026 por playoff inicial + duas rodadas de grupos.
  - **Vaga de anfitrião (Host qualification)** — País-sede classifica-se automaticamente, sem disputar eliminatórias (ex.: EUA, México e Canadá em 2026).
- **Torneios continentais de seleções (Continental championships)** — Eurocopa (UEFA Euro), Copa América (CONMEBOL), Copa Africana de Nações (AFCON), Copa Asiática (AFC Asian Cup), Copa Ouro da CONCACAF (Gold Cup) etc.
- **Liga das Nações (Nations League)** — Torneio de seleções em formato de liga com divisões e acesso/rebaixamento, criado pela UEFA (2018) e replicado pela CONCACAF; substitui parte dos amistosos por jogos oficiais.
- **Mundial de Clubes FIFA (FIFA Club World Cup)** — Reformulado em 2025 para **32 clubes em 8 grupos de 4** (formato idêntico ao da Copa do Mundo de 1998–2022); 2 primeiros de cada grupo avançam; mata-mata em jogo único, **sem disputa de 3º lugar**; periodicidade quadrienal. Edição de estreia: EUA, jun–jul/2025 (Brasil com 4 clubes — recordista).
- **Copa Intercontinental (Intercontinental Cup)** — Novo formato anual da FIFA (a partir de 2024) que cruza campeões continentais culminando no campeão europeu, paralelo ao Mundial quadrienal.

### Calendário e janelas (Calendar and windows)

- **Datas FIFA (FIFA International Match Calendar / FIFA dates)** — Janelas reservadas no calendário em que os clubes são obrigados a liberar jogadores para suas seleções (amistosos e eliminatórias).
- **Janela de transferências (Transfer window)** — Período em que clubes podem registrar contratações (janela de meio de ano e de início de temporada).
- **Liberação de jogadores (Player release)** — Prazo em que clubes devem ceder atletas convocados (ex.: para a Copa de 2026, liberação até 25/05/2026, com exceções para finalistas continentais até 30/05).
- **Mando de campo (Home advantage / hosting rights)** — Direito de jogar como mandante, com vantagem de torcida e logística; em mata-mata de ida e volta, o melhor ranqueado costuma decidir em casa.
- **Campo neutro (Neutral venue)** — Sede que não pertence a nenhum dos clubes, usada em finais de jogo único e supercopas (ex.: final da Libertadores; final do playoff da Championship em Wembley).
- **Calendário de temporada (Season calendar)** — Estrutura temporal anual; difere por região (Europa: ago–mai, atravessando o ano; Brasil e países de calendário "de ano civil": jan/fev–dez).
- **Parada de inverno / recesso (Winter break / mid-season break)** — Pausa no meio da temporada europeia (típica da Alemanha, Itália), por clima e descanso; debate recorrente na Inglaterra, que historicamente não a adota.
- **Pré-temporada (Pre-season)** — Período de preparação física e amistosos antes do início da competição oficial (inclui as *tours* internacionais de pré-temporada).
- **Jogo de abertura / "curtain-raiser" (Season opener / curtain-raiser)** — Partida que inaugura a temporada, frequentemente a supercopa nacional ou o jogo de abertura da liga.
- **Congestionamento de calendário / sobrecarga (Fixture congestion / fixture pile-up)** — Acúmulo de jogos em curto período, agravado pela expansão da Champions e do Mundial de Clubes — tema central no debate sobre carga dos atletas, recurso de clubes/sindicatos (ex.: FIFPRO) por excesso de jogos.

---

## Termos, Jargão e Habilidades Técnicas (Terms, Jargon & Skills)

Glossário bilíngue do vocabulário técnico-individual do futebol. Convenção: **Termo PT (Term EN)** — definição. Onde há sinônimos regionais, eles vêm listados; onde não há termo PT (ou EN) consagrado, sinaliza-se explicitamente.

### Dribles, fintas e habilidades individuais (Dribbling, feints & skill moves)

#### Conceitos-base (Core concepts)

- **Drible (Dribble)** — conduzir/passar pela marcação mantendo a posse, em geral com mudanças de direção e fintas.
- **Condução (Carrying / Ball-carrying)** — levar a bola com toques sucessivos enquanto se desloca, sem necessariamente driblar alguém.
- **Domínio / controle (Ball control / First touch)** — receber e controlar a bola (com pé, peito, coxa ou cabeça); o "primeiro toque" (first touch) qualifica a recepção.
- **Domínio orientado (Directional first touch)** — primeiro toque que já posiciona a bola para a ação seguinte (saída de marcação, ataque ao espaço).
- **Finta / corpo mole (Dummy / Feint)** — fingir uma ação (passe, chute, recepção) para enganar o adversário; inclui o "deixar passar" a bola (dummy run sobre bola em movimento).
- **Drible do corpo / finta de corpo (Body feint / Body swerve)** — fingir o deslocamento do corpo para um lado e arrancar para o outro, sem truque específico com a bola.
- **Proteção de bola (Shielding / Screening)** — interpor o corpo entre a bola e o marcador para preservar a posse.

#### Passar por baixo / entre as pernas (Through-the-legs moves)

- **Caneta / canetinha / janelinha / ovinho / rolinho (Nutmeg)** — jogar a bola por entre as pernas do adversário e recuperá-la do outro lado. (Ex.: passar a bola entre as pernas do zagueiro e correr para pegá-la atrás dele.)
- **Túnel (Nutmeg / Tunnel)** — sinônimo de caneta, ênfase na bola passando "como num túnel" sob o oponente.

#### Mudanças bruscas de direção (Change-of-direction moves)

- **Elástico / flip-flap (Elastico / Flip-flap / Snake)** — tocar a bola com a parte externa do pé e, no mesmo movimento, "trazê-la de volta" com a parte interna, simulando um elástico. Popularizado por Rivellino (que aprendeu com Sérgio Echigo) e dominado por Ronaldinho/Robinho.
- **Corta-luz / corte do Cruyff (Cruyff turn)** — fingir o passe/chute e arrastar a bola para trás com a parte interna do pé, girando 180°. Imortalizado por Johan Cruyff na Copa de 1974. (Sem termo PT único consagrado — costuma-se dizer "drible do Cruyff".)
- **Giro de Marselha / drible da roleta (Marseille turn / Roulette / 360 / "Maradona spin")** — girar 360° sobre a bola usando as solas dos dois pés alternadamente para proteger e escapar. Marca registrada de Zidane e Maradona.
- **Pedalada / bicicletinha (Step-over / Scissors)** — passar o pé por cima/em volta da bola sem tocá-la, simulando ir para um lado e indo para o outro. Atribuída a Didi (1957); símbolo de Robinho e Cristiano Ronaldo.
- **La Croqueta / croqueta (La Croqueta)** — deslocar a bola rapidamente da parte interna de um pé para a interna do outro para sair da pressão e acelerar em seguida. Pioneirismo creditado a Michael Laudrup (anos 1980); marca registrada de Iniesta e usada por Messi. (Sem termo PT próprio — usa-se o nome espanhol.)
- **Corte / "chop" (Ronaldo chop / Cut)** — cortar a bola atrás da perna de apoio com a parte interna do pé para inverter o sentido subitamente. Associado a Cristiano Ronaldo.
- **Drible da vaca / meia-lua / gaúcha (The "Big-Cow" dribble / split dribble — sem termo EN único consagrado)** — empurrar a bola por um lado do marcador e correr pelo outro para reencontrá-la. "Meia-lua" e "gaúcha" são sinônimos consagrados da mesma jogada. Origem nos campos de pastagem do futebol brasileiro primitivo.
- **Pisão / passar a sola (Sole roll / Stepover with sole)** — controlar e mover a bola com a sola do pé, mudando o ritmo ("pisar" na bola para parar e arrancar).
- **Puxeta para trás / pisão para trás (Drag-back)** — puxar a bola para trás com a sola para mudar de direção e escapar da pressão.
- **Para-e-arranca (Stop-and-go)** — reduzir o ritmo (ou parar) para induzir o marcador a frear e então acelerar de novo.

#### Dribles aéreos / por cima do adversário (Aerial / over-the-top moves)

- **Chapéu / lençol / banho (Lob / "Hat" / Sombrero flick)** — levantar a bola por cima da cabeça do marcador e recuperá-la atrás dele. É a versão mais simples do drible aéreo: um toque sutil por cima do oponente. "Chapéu" enfatiza passar por cima da cabeça; "lençol" e "banho" são variantes consagradas do mesmo conceito.
- **Lambreta / carretilha / chapéu-mexicano (Rainbow flick / Rainbow / Sombrero)** — usar um pé para rolar a bola pela parte de trás da perna oposta e lançá-la em arco por cima da cabeça do adversário; variação de maior dificuldade que o chapéu. Inventada por Kaneco (Santos, 1968); conhecida como "Ardiles flick" (Reino Unido), "arco-íris" (EUA/Espanha) e "coup du sombrero" (França).
- **Meia-lua (Half-moon — sem termo EN único consagrado)** — usado às vezes como sinônimo de drible da vaca; em outros contextos descreve o arco descrito pela bola ou pelo jogador ao contornar o adversário.

#### Outras habilidades de controle (Other control skills)

- **Embaixadinha / firula (Keepie-uppie / Juggling)** — manter a bola no ar com toques sucessivos sem deixá-la cair.
- **Drible da foca (Seal dribble)** — equilibrar a bola na testa e correr com ela, driblando no ar. Marca de Kerlon.
- **Chaleira (Backheel feint / "Chaleira" — sem termo EN único consagrado)** — no Brasil, também usado como sinônimo de rabona; jogada/finta executada cruzando a perna de chute por trás da perna de apoio (ver "rabona" e "de letra").

### Tipos de passe (Types of pass)

- **Passe (Pass)** — entrega da bola a um companheiro.
- **Lançamento / bola longa (Long ball / Long pass)** — passe longo para mudar o lado do jogo ou lançar o ataque a partir do campo de defesa.
- **Inversão de jogo / mudança de lado (Switch of play / Cross-field ball)** — passe longo que transfere o jogo do lado congestionado para o lado oposto, mais aberto.
- **Enfiada / bola enfiada / passe em profundidade (Through ball)** — passe que rompe a linha defensiva, colocando o companheiro de frente para o gol, entre/atrás dos zagueiros.
- **Cruzamento (Cross)** — passe vindo da lateral do campo para a área, normalmente para cabeceio ou finalização.
- **Cruzamento rasteiro / recuado (Low cross / Cutback / Pull-back)** — cruzamento junto ao chão; o "recuado" (cutback) volta a bola da linha de fundo para a entrada da área.
- **Tabela / tabelinha / parede (One-two / Wall pass / Give-and-go)** — passar para um companheiro e receber de volta imediatamente, ultrapassando o marcador.
- **Triangulação (Triangle / Third-man combination)** — combinação de passes curtos entre três jogadores para progredir e furar a marcação.
- **Pivô / passe de descarga (Lay-off / Hold-up pass)** — atacante de costas para o gol segura a bola e a descarrega de primeira para um companheiro em apoio.
- **Passe de calcanhar (Backheel)** — passe (ou chute) executado com o calcanhar, propelindo a bola para trás.
- **Passe de letra / chaleira (No-look / heel-cross pass — "de letra")** — passe executado cruzando a perna de chute por trás da de apoio, ou sem olhar o destinatário (passe "no look"); marca de Sócrates no uso do calcanhar para enganar.
- **Trivela (passe) (Outside-of-the-foot pass / Trivela)** — passe com a parte externa do pé, imprimindo curva/efeito (ex.: especialidade de Ricardo Quaresma).
- **Rabona / lambreta (passe) (Rabona)** — chutar/passar cruzando a perna de chute por trás da perna de apoio; no Brasil também chamada "chaleira" ou "de letra". Associada a Pelé e a popularizadores posteriores.
- **Passe de primeira / de primeira (First-time pass / One-touch pass)** — tocar a bola em um único toque, sem dominar antes.
- **Passe raspado / com efeito (Curled / driven pass)** — passe com curva ou batido com força para vencer o espaço/marcação.

### Finalizações e chutes (Shooting & finishing)

- **Finalização / chute (Shot)** — tentativa de marcar gol.
- **Bicicleta / voleio de costas (Bicycle kick / Overhead kick)** — chute acrobático com o corpo no ar, de costas para o gol, pernas pedalando para acertar a bola acima da cabeça.
- **Voleio (Volley)** — chutar a bola ainda no ar, antes de tocar o chão.
- **Meio-voleio / batida de meia-virada (Half-volley)** — chutar a bola no exato momento (ou logo após) em que ela toca o chão.
- **Cavadinha (Chip / Dink)** — chute de trajetória alta e curta, "cavando" o pé por baixo da bola para encobrir o goleiro.
- **Panenka (Panenka)** — cobrança de pênalti em cavadinha pelo meio do gol, esperando o mergulho do goleiro. Nome de Antonín Panenka (final da Euro 1976).
- **Cobertura / encobrir (Lob / Lobbed shot)** — encobrir o goleiro adiantado com chute alto.
- **De primeira (First-time shot / One-touch finish)** — finalizar em um único toque, sem dominar.
- **Emendar / pegar de primeira no ar (Volleyed finish)** — finalizar diretamente um cruzamento ou rebote, sem amortecer.
- **Trivela (chute) (Trivela / Outside-of-the-foot shot)** — chute com a parte externa do pé, gerando curva acentuada.
- **Chute com efeito / "folha seca" (Curled shot / Knuckleball)** — chute com rotação que faz a bola curvar; a "folha seca" (associada a Didi) tem trajetória descendente brusca; o "knuckleball" tem pouca rotação e oscila no ar.
- **Bomba / chute colocado (Power shot / Placed shot)** — distinção entre chute forte ("bomba") e chute de precisão no canto ("colocado").
- **Chute de fora da área (Long-range shot / Screamer)** — finalização de longa distância.
- **Cabeceio / cabeçada (Header)** — usar a cabeça para finalizar (ou jogar/controlar a bola).
- **Peixinho / cabeçada de mergulho (Diving header)** — cabecear mergulhando rente ao chão para alcançar bola baixa.
- **Letra (Toe / heel flick — sem termo EN único consagrado)** — finalizar/passar com a parte externa do pé cruzando a perna; coloquialmente "de letra".

### Termos gerais de jogo (General match terms)

#### Regras e reinícios (Rules & restarts)

- **Impedimento (Offside)** — jogador em posição irregular: à frente do penúltimo defensor e da bola no campo adversário, no momento do passe. Conta tronco, cabeça e pés (não o braço).
- **Linha de impedimento (Offside line)** — linha imaginária do penúltimo defensor usada para aferir o impedimento (traçada pelo VAR).
- **Escanteio / córner (Corner kick)** — reinício com chute do canto, quando a bola sai pela linha de fundo tocada por último por um defensor.
- **Escanteio curto / batido curto (Short corner)** — escanteio jogado em curto a um companheiro em vez de cruzado direto na área.
- **Tiro de meta (Goal kick)** — reinício pela equipe defensora quando a bola sai pela linha de fundo tocada por último por um atacante.
- **Pênalti (Penalty / Spot kick)** — cobrança a 11 m do gol, por falta cometida dentro da própria área.
- **Disputa de pênaltis (Penalty shootout)** — série alternada de cobranças para decidir partida empatada em mata-mata.
- **Falta (Foul)** — infração às regras, punida com tiro livre ou pênalti.
- **Tiro livre direto (Direct free kick)** — falta da qual se pode marcar gol diretamente.
- **Tiro livre indireto (Indirect free kick)** — cobrança que exige um segundo toque antes do gol valer.
- **Barreira (Wall)** — fileira de jogadores posicionada a 9,15 m para bloquear a cobrança de falta.
- **Lateral / arremesso lateral (Throw-in)** — reinício com as mãos quando a bola sai pela linha lateral.
- **Bola parada / jogada ensaiada (Set piece / Dead-ball situation)** — situação com a bola estática (falta, escanteio, pênalti, lateral ensaiado).
- **Mão / toque de mão (Handball)** — tocar a bola deliberadamente com mão/braço (exceto goleiro na própria área).
- **Vantagem (Advantage)** — árbitro deixa o jogo seguir após falta porque parar prejudicaria a equipe atacada.
- **VAR / árbitro de vídeo (VAR — Video Assistant Referee)** — revisão por vídeo de gol, pênalti, cartão vermelho direto e erro de identidade.
- **Acréscimos (Added time / Stoppage time / Injury time)** — minutos somados ao fim de cada tempo para compensar paralisações.
- **Prorrogação (Extra time)** — dois períodos extras de 15 min em mata-mata empatado no tempo normal.
- **Cartão amarelo / advertência (Booking / Yellow card)** — registro de infração passível de advertência.
- **Cartão vermelho / expulsão (Sending-off / Red card)** — exclusão do jogador da partida (direto ou por dois amarelos), deixando a equipe com um a menos.
- **Cera / cera (Time-wasting)** — retardar o jogo de propósito para preservar o resultado.
- **Simulação / cai-cai (Simulation / Diving)** — fingir falta ou contato para enganar o árbitro; é infração passível de cartão.

#### Ações defensivas (Defensive actions)

- **Marcação (Marking)** — vigiar adversários para evitar que recebam/avancem.
- **Marcação individual (Man-to-man marking)** — cada defensor responsável por um adversário específico.
- **Marcação por zona (Zonal marking)** — cada defensor responsável por uma área do campo, não por um jogador.
- **Pressão / pressing (Pressing)** — pressionar o portador da bola para forçar o erro ou o passe ruim.
- **Antecipação (Anticipation / Reading the play)** — sair antes do adversário para interceptar a bola, lendo a jogada.
- **Desarme (Tackle / Dispossession)** — recuperar a bola do adversário em disputa.
- **Carrinho (Slide tackle)** — desarme em que o jogador desliza pelo gramado para alcançar a bola.
- **Corte / afastamento (Clearance)** — chutar/cabecear a bola para longe da própria meta.
- **Interceptação (Interception)** — cortar um passe antes que chegue ao destinatário.
- **Bloqueio (Block)** — interpor o corpo no caminho de um chute ou cruzamento.

#### Padrões de jogo (Patterns of play)

- **Contra-ataque (Counter-attack)** — atacar rápido logo após recuperar a bola, aproveitando o desequilíbrio do adversário.
- **Transição (Transition)** — momento de troca de posse (defesa↔ataque); transição ofensiva e defensiva.
- **Tempo de bola / timing (Timing — sem termo PT único consagrado)** — momento exato de tocar, lançar ou desarmar; "ler" o instante certo da jogada.
- **Tempo de bola (no sentido de domínio) (Time on the ball)** — espaço/segundos que o jogador tem antes da pressão chegar.

#### Marcos e estatísticas individuais (Milestones & individual stats)

| Termo PT | Term EN | Definição |
|---|---|---|
| Gol contra | Own goal | Gol marcado pelo jogador contra a própria equipe, em geral por erro. |
| Hat-trick / três gols | Hat-trick | Três gols do mesmo jogador na mesma partida. |
| Dobradinha / "brace" | Brace | Dois gols do mesmo jogador na mesma partida. |
| Pôquer / poker-trick | Poker (four goals) | Quatro gols do mesmo jogador na mesma partida (analogia ao pôquer/quadra). |
| Manita | Manita (five goals) | Cinco gols do mesmo jogador na mesma partida (alusão aos cinco dedos da mão). |
| Gol olímpico | Olympic goal / Olimpico | Gol marcado diretamente de escanteio; nome cunhado pelos argentinos em 1924 (gol de Cesáreo Onzari) para ironizar o Uruguai, campeão olímpico daquele ano. |
| Assistência / passe para gol | Assist | Passe que resulta diretamente em gol. |
| Não sofrer gol / jogo sem sofrer gols | Clean sheet | Goleiro/equipe que termina a partida sem ser vazado. |
| Gols esperados | Expected goals (xG) | Métrica que estima a probabilidade de uma finalização virar gol. |

#### Atributos do jogador (Player attributes)

- **Pé direito (Right foot / Right-footed)** — pé dominante/preferencial à direita.
- **Pé esquerdo / canhoto (Left foot / Left-footed)** — jogador que usa preferencialmente a esquerda.
- **Ambidestro / bom dos dois pés (Two-footed / Ambidextrous)** — finaliza e passa bem com ambos os pés.
- **Pé ruim / perna ruim (Weak foot)** — pé não dominante; jargão de scouting/games (ex.: usar a rabona às vezes serve para evitar o pé ruim).

---

## Atributos e Perfis de Jogador (Player Attributes & Profiles)

> **Nota de framework.** A estrutura por categorias (Técnico / Mental / Físico / Goleiro) segue a convenção consolidada pelo **Football Manager (FM)**, que pontua cada atributo de **1 a 20** (1 = fraco, 20 = excelente) e divide os atributos de jogador de linha em **14 técnicos + 14 mentais + 8 físicos**, com um conjunto próprio para goleiros. Isso é usado como *referência de organização*, não como verdade absoluta — o futebol real combina os quatro eixos (técnico, tático, físico, psicológico) de forma interdependente. Onde útil, mapeamos o atributo para a **métrica avançada** (FBref/StatsBomb/Opta) que o aproxima quantitativamente.

---

### 1. Atributos Técnicos (Technical Attributes)

Habilidades de execução com a bola — em posse, fora de posse e em bolas paradas.

#### 1.1 Em posse / criação
- **Passe (Passing)** — precisão e qualidade na distribuição de bola, curta e longa. (Métrica: % de acerto de passe, *progressive passes*.)
- **Visão / Visão de jogo (Vision)** — capacidade de enxergar e executar a opção de passe que outros não veem; governa a tentativa do passe arriscado. (Ex.: Kevin De Bruyne; métrica: *key passes*, xA — expected assists.) *(No FM é classificado como atributo mental, mas o resultado se manifesta tecnicamente.)*
- **Técnica (Technique)** — refinamento geral na manipulação da bola; quão "limpo" o jogador executa gestos difíceis (passe de trivela, bola enrolada). (Ex.: David Silva.)
- **Primeiro toque (First Touch)** — qualidade do domínio ao receber; um bom controle orientado já encaminha o próximo movimento. (Ex.: Dennis Bergkamp.)
- **Controle / Domínio de bola (Ball Control)** — capacidade de manter a bola sob domínio próximo em movimento (no FM, embutido em *Technique* + *Dribbling*; no FIFA/EA FC, atributo próprio: *Ball Control*).
- **Drible / Condução (Dribbling)** — habilidade de conduzir a bola em velocidade sob controle apertado e superar adversários no 1v1. (Ex.: Lionel Messi; métrica: *take-ons completed*, *progressive carries*.)
- **Cruzamento (Crossing)** — precisão ao levar a bola da faixa lateral para zonas de finalização. (Ex.: Trent Alexander-Arnold; métrica: *crosses completed*, xA de cruzamentos.)

#### 1.2 Finalização
- **Finalização / Acabamento (Finishing)** — eficiência ao converter chances claras com os pés. (Ex.: Erling Haaland; métrica: *goals − xG* / *G−xG overperformance*.)
- **Chute de longa distância (Long Shots)** — capacidade de finalizar de fora da área. (Ex.: Steven Gerrard.)
- **Cabeceio (Heading)** — qualidade no jogo aéreo, ofensivo e defensivo. (Ex.: Cristiano Ronaldo; métrica: *aerial duels won %*, *headed goals*.)
- **Compostura / Sangue-frio (Composure)** — frieza para decidir bem sob pressão na hora da finalização ou do último passe. *(No FM é classificado como mental, mas afeta diretamente a execução técnica.)*

#### 1.3 Fora de posse
- **Desarme (Tackling)** — qualidade e timing no carrinho/bote para recuperar a bola sem cometer falta. (Métrica: *tackles won*, *tackles + interceptions*.)
- **Marcação (Marking)** — capacidade de anular um adversário acompanhando-o de perto (marcação individual/zona). (Métrica aproximada: *interceptions*, *pressures*.)

#### 1.4 Bolas paradas (Set Pieces)
- **Cobrança de falta (Free Kick Taking)** — precisão em faltas diretas e em lançamentos à área a partir de falta. (Ex.: Juninho Pernambucano.)
- **Pênaltis (Penalty Taking)** — eficiência na cobrança de penalidades.
- **Escanteios / Cantos (Corners)** — qualidade na cobrança de escanteios.
- **Lateral / Arremesso longo (Long Throws)** — alcance e precisão no arremesso lateral como arma ofensiva. (Ex.: Rory Delap.)

---

### 2. Atributos Físicos (Physical Attributes)

Capacidades atléticas: explosão, velocidade, resistência, potência e mobilidade. (No FM são 8 atributos físicos.)

| Termo PT | Term EN | Definição | Métrica aproximada |
|---|---|---|---|
| Aceleração | Acceleration | Rapidez para atingir a velocidade máxima a partir da parada | *sprint count*, dados de GPS |
| Velocidade / Ritmo | Pace / Speed | Velocidade máxima atingida em corrida | *top speed (km/h)* |
| Resistência / Fôlego | Stamina | Capacidade de manter intensidade os 90+ minutos | *distance covered*, *high-intensity runs* |
| Força / Físico | Strength | Potência nos duelos corpo a corpo (proteger/disputar bola) | *duels won %* |
| Salto / Impulsão (alcance) | Jumping Reach | Altura efetiva atingida no salto; compensa baixa estatura no jogo aéreo | *aerial duels won %* |
| Agilidade | Agility | Rapidez para mudar de direção e iniciar/parar movimentos | — |
| Equilíbrio | Balance | Capacidade de manter-se em pé sob contato e em mudanças bruscas | — |
| Recuperação física (sem termo PT consagrado) | Natural Fitness | Manutenção da forma física e recuperação entre jogos / lesões | — |

> **Nota.** *Pace* e *Acceleration* são distintos: *Pace* é a velocidade de pico; *Acceleration* é a rapidez para chegar nela (explosão nos primeiros metros). Um jogador pode ter alta aceleração e *pace* mediano (explosivo em espaços curtos) ou vice-versa (rápido em corridas longas). No EA FC, *Pace* é a média ponderada de *Sprint Speed* + *Acceleration*.

---

### 3. Atributos Mentais / Táticos (Mental & Tactical Attributes)

Leitura de jogo, comportamento e psicologia competitiva. (No FM são 14 atributos mentais.)

#### 3.1 Inteligência de jogo
- **Posicionamento (Positioning)** — capacidade de ler situações defensivas e estar no lugar certo para interceptar/cobrir. (Métrica aproximada: *interceptions*, *blocks*.)
- **Posicionamento ofensivo / Desmarque (Off the Ball)** — qualidade dos movimentos sem bola para criar e ocupar espaços. (Ex.: Thomas Müller, o "Raumdeuter".)
- **Antecipação (Anticipation)** — capacidade de prever e reagir mais rápido que o adversário ao desenrolar do lance.
- **Tomada de decisão (Decisions)** — escolher a ação certa (passar, driblar, chutar) no momento certo.
- **Visão de jogo (Vision)** — *ver* a oportunidade *(listada também em técnicos: ler vs. executar o passe)*.

#### 3.2 Caráter / volume de trabalho
- **Empenho / Volume de trabalho (Work Rate)** — disposição mental para se esforçar ao máximo e chegar onde precisa em todas as situações.
- **Determinação (Determination)** — comprometimento e vontade de vencer, dentro e fora de campo.
- **Agressividade (Aggression)** — intensidade na pegada: pressionar mais, dividir mais forte (risco de falta).
- **Bravura / Coragem (Bravery)** — disposição a entrar em divididas e situações de risco físico.
- **Trabalho em equipe (Teamwork)** — adesão a instruções táticas e ao esforço coletivo.

#### 3.3 Psicologia competitiva
- **Concentração (Concentration)** — manter o foco os 90 minutos sem lapsos. (Crítico em zagueiros e goleiros.)
- **Compostura / Sangue-frio (Composure)** — frieza para tomar boas decisões sob pressão.
- **Flair / Imprevisibilidade (Flair)** — tendência a tentar o inesperado e o criativo. (Ex.: Neymar.)
- **Liderança (Leadership)** — influência sobre os companheiros; capacidade de comandar o grupo em campo. (Ex.: capitães como Sergio Ramos.)

#### 3.4 Atributos ocultos / de personalidade (Hidden / Personality Attributes — FM)
Não aparecem na ficha visível, mas influenciam rendimento e desenvolvimento.
- **Consistência / Regularidade (Consistency)** — frequência com que o jogador rende perto do seu teto.
- **Jogos importantes (Important Matches)** — desempenho elevado em partidas decisivas. (Ex.: "Big-game player".)
- **Versatilidade (Versatility)** — facilidade para render bem fora da posição natural.
- **Sujeira / Malícia (Dirtiness)** — propensão a jogo faltoso/desleal.
- **Pressão / Lidar com pressão (Pressure)** — resistência psicológica em ambientes hostis.
- **Profissionalismo / Ambição / Lealdade (Professionalism / Ambition / Loyalty)** — traços de personalidade que afetam desenvolvimento e comportamento.
- **Adaptabilidade / Controle / Temperamento (Adaptability / Controversy / Temperament)** — facilidade de se adaptar a novo país/clube e estabilidade emocional sob provocação/pressão da mídia.
- **Lance arriscado / Injury Proneness (Injury Proneness)** — propensão a sofrer lesões; afeta longevidade e disponibilidade.

---

### 4. Atributos de Goleiro (Goalkeeping Attributes)

Específicos da posição; substituem boa parte dos atributos técnicos de linha.

| Termo PT | Term EN | Definição |
|---|---|---|
| Reflexos | Reflexes | Reação instintiva e rápida em finalizações de curta distância |
| Defesa com as mãos / Pegada | Handling | Segurar a bola com firmeza ao agarrar/encaixar |
| Soco / Rebatida (tendência) | Punching (Tendency) | Tendência a socar a bola em vez de encaixá-la |
| Domínio da área | Command of Area | Frequência e segurança ao sair para cruzamentos e bolas altas |
| Saída do gol / 1 contra 1 | One-on-Ones | Capacidade de neutralizar o atacante em frente a frente |
| Alcance aéreo | Aerial Reach | Altura/extensão efetiva para alcançar bolas altas |
| Posicionamento (goleiro) | Positioning (GK) | Estar bem colocado para reduzir ângulo de finalização |
| Reposição / Lançamento de mão | Throwing | Precisão e velocidade ao distribuir com as mãos (puxar contra-ataque) |
| Tiro de meta / Reposição de pé | Kicking | Alcance e precisão na reposição com os pés |
| Comunicação | Communication | Organização da defesa pela voz |
| Tendência a sair da área | Rushing Out (Tendency) | Disposição a abandonar a linha de gol para varrer espaços (sweeper keeper) |
| Excentricidade | Eccentricity | Propensão do goleiro a tentar o inusitado/arriscado (atributo oculto no FM) |

> **Goleiro moderno (sweeper-keeper / goleiro-líbero).** A evolução tática trata o goleiro como o **primeiro armador** — distribuição com os pés e leitura para sair da área tornaram-se atributos centrais. (Ex.: Manuel Neuer, Ederson, Alisson.)

---

### 5. Perfis / Arquétipos de Jogador (Player Profiles & Archetypes)

Combinações típicas de atributos que definem um *papel* em campo. (Mistura de arquétipos é a norma; jogadores raramente são "puros". O FM26 cataloga ~72 *roles*; aqui listamos os reconhecidos no jogo real.)

#### 5.1 Goleiros
- **Goleiro tradicional / Linha de gol (Shot-Stopper / Goalkeeper-Defend)** — foco em reflexos, pegada e 1v1; pouca saída de área.
- **Goleiro-líbero / Goleiro de linha (Sweeper Keeper / Líbero)** — sai da área, joga com os pés, inicia a construção. (Ex.: Ederson, Manuel Neuer.)

#### 5.2 Defensores
- **Zagueiro marcador / Brigador (Stopper / No-Nonsense CB)** — força, jogo aéreo, desarme e bravura; prioriza afastar o perigo. (Ex.: defensores clássicos físicos.)
- **Zagueiro de cobertura (Cover / Central Defender-Defend)** — recua para cobrir o espaço nas costas da linha em vez de subir na marcação; complementa o *stopper*.
- **Zagueiro construtor / Saída de bola (Ball-Playing Defender / Líbero construtor)** — qualidade de passe e compostura para iniciar jogadas; atua como armador secundário. (Ex.: Bonucci, Hummels, Beckenbauer como precursor.)
- **Líbero (Libero / Sweeper)** — zagueiro extra que cobre atrás da linha e sobe com a bola (arquétipo clássico, hoje raro).
- **Lateral defensivo (Full-Back)** — equilíbrio defensivo, marcação e cobertura na faixa.
- **Lateral ofensivo / Ala (Attacking Full-Back / Wing-Back)** — fôlego, velocidade e cruzamento; cobre toda a faixa. (Ex.: Cafu, Alphonso Davies.)
- **Ala completo (Complete Wing-Back)** — versão completa do ala: defende, cruza, conduz e finaliza; exige altíssimo fôlego. (Ex.: Achraf Hakimi.)
- **Lateral invertido (Inverted Full-Back / Inverted Wing-Back)** — recua para o meio na posse, virando um meio-campista extra. (Ex.: João Cancelo no City de Guardiola.)

#### 5.3 Meio-campistas
- **Volante de contenção / Cabeça de área (Holding Midfielder / Anchor / "Destroyer")** — recuperação, desarme, posicionamento; protege a defesa. (Ex.: Casemiro, Makélélé.)
- **Volante recompositor / Half-Back (Half-Back)** — recua entre os zagueiros na posse, formando linha de 3 e liberando os laterais; híbrido de volante e zagueiro construtor. (Ex.: Sergio Busquets recuando, Rodri em fases.)
- **Cão de guarda / Ladrão de bola (Ball-Winning Midfielder)** — especialista em pressionar, desarmar e recuperar; volume defensivo alto. (Ex.: N'Golo Kanté.)
- **Armador recuado / Regista (Deep-Lying Playmaker / Regista)** — dita o ritmo de trás, passe de longo alcance, mais toques que qualquer outro. (Ex.: Andrea Pirlo, Xabi Alonso, Toni Kroos.)
- **Box-to-box / Meia completo (Box-to-Box Midfielder)** — fôlego e versatilidade para defender e atacar de área a área. (Ex.: Yaya Touré, Steven Gerrard.)
- **Segundo volante (Segundo Volante / Carrilero)** — o *carrilero* cobre o corredor lateral ligando defesa e meio; o *segundo volante* é o volante que se projeta ao ataque (chegada à área). (Ex.: Arturo Vidal como mezzala; tradição argentina/brasileira do "segundo volante".)
- **Mezzala / Meia interior (Mezzala)** — meia de um lado que invade o meio-espaço ofensivo para criar e finalizar. (Ex.: Ilkay Gündogan.)
- **Armador móvel / itinerante (Roaming Playmaker)** — armador que circula por todo o campo procurando a bola, sem posição fixa. (Ex.: Sergio Busquets/Modric em fases de roaming.)
- **Armador avançado / Camisa 10 clássico (Advanced Playmaker / Number 10 / Trequartista)** — liga meio e ataque em função livre; visão, drible e passe decisivo. (Ex.: Zidane, Totti, Riquelme, Kaká.)
- **Enganche / Meia-armador entre linhas (Enganche)** — 10 fixo que conecta meio e ataque, pouco recuo defensivo (tradição sul-americana).

#### 5.4 Atacantes (wide e centrais)
- **Ponta / Extremo clássico (Winger)** — velocidade, drible e cruzamento pela linha de fundo. (Ex.: ponta de pé natural.)
- **Ponta invertido (Inverted Winger)** — atua na faixa do pé contrário para cortar e cruzar/finalizar; tende a recuar/abrir mais que o inside forward.
- **Inside forward / Atacante interior (Inside Forward)** — ponta de pé invertido que corta para dentro buscando o gol; mais agressivo e próximo da área que o *inverted winger*. (Ex.: Arjen Robben, Mohamed Salah, Cristiano Ronaldo no United.)
- **Ponta pressionador (Pressing Winger)** — extremo cuja função primária é pressionar a saída de bola adversária; típico de sistemas de *gegenpressing*.
- **Ponta defensivo (Defensive Winger)** — extremo que prioriza ajudar a marcação na faixa, cobrindo o lateral.
- **Armador de lado / Ponta-armador (Wide Playmaker)** — criador que parte de posição aberta em vez de central, organizando o jogo pela faixa.
- **Raumdeuter / "Investigador de espaços" (Raumdeuter)** — atacante de lado que vive de timing e ocupação de espaço (poucos toques, muitos gols/assistências por aparição). (Ex.: Thomas Müller.)
- **Pivô de lado / Ponta-pivô (Wide Target Man)** — referência física na faixa para segurar bola e disputar pelo alto em construção/cruzamentos.
- **Segundo atacante / Meia-atacante (Second Striker / Shadow Striker)** — joga atrás do 9, finaliza e cria entre linhas. (Ex.: Roberto Firmino em fases, Müller.)
- **Centroavante de referência / Pivô (Target Man / Centroavante de área)** — força, jogo aéreo, segura e distribui de costas para o gol. (Ex.: Olivier Giroud, Didier Drogba.)
- **Centroavante móvel / Poacher (Poacher / Finalizador de área)** — especialista em desmarque e finalização dentro da área. (Ex.: Filippo Inzaghi, Gerd Müller.)
- **Atacante recuado (Deep-Lying Forward)** — 9 que recua para receber e ligar meio e ataque, deixando espaço para infiltrações de companheiros. (Ex.: Dennis Bergkamp, Karim Benzema em fases.)
- **Atacante pressionador (Pressing Forward / Defensive Forward)** — 9 cuja primeira função é pressionar zagueiros e goleiro, iniciando a recuperação alta. (Ex.: Roberto Firmino no Liverpool de Klopp.)
- **Falso 9 (False Nine)** — parte de centroavante mas recua para receber, arrastando zagueiros e abrindo espaço para infiltrações. Técnico, criativo e de boa visão. (Ex.: Messi sob Guardiola, Cesc Fàbregas pela Espanha.)
- **Centroavante completo / móvel (Complete / Mobile Forward)** — combina finalização, força, velocidade e participação na pressão. (Ex.: Karim Benzema, Harry Kane, Erling Haaland.)

---

### 6. Atributos × Métricas Avançadas (Attributes ↔ Advanced Metrics)

Como cada atributo subjetivo se aproxima de uma métrica de dados (FBref / StatsBomb / Opta).

| Atributo (PT / EN) | Métrica avançada | O que mede |
|---|---|---|
| Finalização / Finishing | **xG** (*expected goals*) e **G − xG** | Qualidade da chance vs. gols efetivos; eficiência do finalizador |
| Visão / Vision · Passe / Passing | **xA** (*expected assists*), **key passes**, **SCA** (*shot-creating actions*) e **GCA** (*goal-creating actions*) | Geração de chances pelo passe (SCA = 2 ações antes do chute; GCA = 2 ações antes do gol) |
| Drible / Dribbling · Condução | **Progressive carries**, **take-ons completed**, **Deep Progressions** | Avanço da bola conduzindo / superando adversários até o terço final |
| Passe / Passing (progressão) | **Progressive passes** | Passes que avançam a bola rumo ao gol |
| Desarme / Tackling · Marcação | **Tackles won**, **interceptions**, **pressures**, **PPDA** | Ações defensivas e intensidade de pressão (PPDA = passes adversários por ação defensiva; quanto menor, mais alta a pressão) |
| Cabeceio / Heading · Salto / Jumping | **Aerial duels won %** | Domínio no jogo aéreo |
| Empenho / Work Rate · Resistência / Stamina | **Distance covered**, **high-intensity runs** | Volume e intensidade de corrida (dados de GPS/tracking) |
| Reflexos / Reflexes · Posicionamento (GK) | **PSxG − GA** (*post-shot xG menos gols sofridos*) | Eficiência de defesa do goleiro acima do esperado pela qualidade dos chutes |
| Valor agregado de qualquer ação | **OBV** (*On-Ball Value*, StatsBomb/Hudl) e **Goalkeeper OBV** | Variação na probabilidade de marcar/sofrer causada por cada passe, condução, desarme ou defesa |

> **Aviso de validade.** Em **20/01/2026** a Sports Reference anunciou a remoção das estatísticas avançadas do **FBref** após desacordo com a Opta — verifique a fonte de dados antes de citar números atuais. Métricas proprietárias como **OBV** e **PSxG** seguem disponíveis via StatsBomb/Hudl e Opta sob licença.


---

## Referências (Sources)

- http://ademirtozizinho.blogspot.com/2011/08/brief-history-of-tactics-danubian.html
- https://aposta10.com/blog/manual-de-expressoes-de-futebol-em-ingles
- https://arxiv.org/pdf/2501.05870
- https://blogarchive.statsbomb.com/articles/soccer/statsbomb-360-exploring-line-breaking-passes/
- https://blogarchive.statsbomb.com/articles/soccer/understanding-statsbomb-radars/
- https://blogarchive.statsbomb.com/news/introducing-on-ball-value-obv/
- https://breakingthelines.com/tactical-analysis/what-is-juego-de-posicion/
- https://coachnotes.co.uk/blogs/coaching-tactics-1/understanding-the-4-phases-of-play
- https://dataglossary.wyscout.com/ball_progression/
- https://dataglossary.wyscout.com/deep_competion/
- https://dataglossary.wyscout.com/metrics/
- https://dataglossary.wyscout.com/progressive_pass/
- https://downloads.theifab.com/downloads/changes-to-the-laws-of-the-game-2025-26?l=en — IFAB, mudanças 2025/26
- https://downloads.theifab.com/downloads/laws-of-the-game-2025-26-single-pages?l=en — IFAB, Laws of the Game 2025/26 (PDF oficial)
- https://drawtactics.com/blog/tactics/positional-play-tactical-guide
- https://dtai.cs.kuleuven.be/sports/vaep/
- https://eduardocecconi.wordpress.com/2015/09/16/7-transicao-ofensiva/
- https://eduardocecconi.wordpress.com/2015/09/16/8-transicao-defensiva/
- https://elitesoccercoaching.net/player-and-coach-development/relationism-in-theory-and-practice
- https://en.wikipedia.org/wiki/2024%E2%80%9325_UEFA_Champions_League_league_phase
- https://en.wikipedia.org/wiki/2026_FIFA_World_Cup
- https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_qualification_(inter-confederation_play-offs)
- https://en.wikipedia.org/wiki/Association_football_positions
- https://en.wikipedia.org/wiki/Away_goals_rule
- https://en.wikipedia.org/wiki/Catenaccio
- https://en.wikipedia.org/wiki/Corner_kick
- https://en.wikipedia.org/wiki/Defender_(association_football)
- https://en.wikipedia.org/wiki/EFL_Championship_play-offs
- https://en.wikipedia.org/wiki/Expected_goals
- https://en.wikipedia.org/wiki/Formation_(association_football)
- https://en.wikipedia.org/wiki/Forward_(association_football)
- https://en.wikipedia.org/wiki/Glossary_of_association_football_terms
- https://en.wikipedia.org/wiki/Golden_goal
- https://en.wikipedia.org/wiki/Hexagonal_(CONCACAF)
- https://en.wikipedia.org/wiki/History_of_tactics_in_association_football
- https://en.wikipedia.org/wiki/Laws_of_the_Game_(association_football)
- https://en.wikipedia.org/wiki/Laws_of_the_Game_(association_football) — visão geral histórica e de estrutura
- https://en.wikipedia.org/wiki/List_of_association_football_skills
- https://en.wikipedia.org/wiki/Midfielder
- https://en.wikipedia.org/wiki/Offside_(association_football)
- https://en.wikipedia.org/wiki/Panenka_(penalty_kick)
- https://en.wikipedia.org/wiki/Penalty_kick_(association_football)
- https://en.wikipedia.org/wiki/Playmaker
- https://en.wikipedia.org/wiki/Rabona
- https://en.wikipedia.org/wiki/Set_piece_(football)
- https://en.wikipedia.org/wiki/Three_points_for_a_win
- https://en.wikipedia.org/wiki/Tiki-taka
- https://escored.com/features/what-is-xpts-in-football/
- https://exame.com/esporte/tabela-do-paulistao-2024-veja-formato-onde-assistir-grupos-e-datas/
- https://fbref.com/en/comps/9/keepersadv/Premier-League-Stats
- https://fbref.com/en/expected-goals-model-explained/
- https://fieldinsider.com/route-one-style/
- https://footballiconic.com/carrilero-vs-mezzala-vs-regista-what-is-the-difference/
- https://footballiconic.com/centre-backs-in-football-stopper-vs-ball-playing-vs-libero/
- https://footballiconic.com/trequartista-vs-enganche-vs-number-10/
- https://frvr.com/blog/football-manager-26-all-player-positions-and-roles-explained/
- https://futebolinterativo.com/blog/identificando-como-um-time-se-defende/
- https://github.com/statsbomb/open-data
- https://grokipedia.com/page/Karl_Rappan
- https://guidetofootball.com/tactics/roles/
- https://guidetofootball.com/tactics/striker-roles/
- https://guidetofootball.com/tactics/winger-roles/
- https://jobsinfootball.com/blog/skills/elastico-soccer-move/
- https://jobsinfootball.com/blog/the-mezzala-role-explained/
- https://jobsinfootball.com/blog/the-role-of-the-deep-lying-playmaker/
- https://joinstriveon.com/blog/4-3-3-formation
- https://kharasportsdaily.com/raumdeuter-explained/
- https://kharasportsdaily.com/zone-14-tactical-analysis/
- https://kiqiq.com/en-US/blog/what-is-fbref
- https://kiqiq.com/ppda-football/
- https://learning.coachesvoice.com/cv/3-2-4-1-formation-tactics-explained/
- https://learning.coachesvoice.com/cv/counter-pressing-gegenpressing-football-tactics-explained-klopp-guardiola-bielsa-hasenhuttl/
- https://learning.coachesvoice.com/cv/formations-football-tactics-explained-best-most-used/
- https://learning.coachesvoice.com/cv/glossary-football-tactics-coaching/
- https://learning.coachesvoice.com/cv/half-spaces-football-tactics-explained/
- https://learning.coachesvoice.com/cv/inverted-full-backs-guardiola-cancelo-trent-alexander-arnold-lahm-football-tactics/
- https://learning.coachesvoice.com/cv/low-block-football-tactics-explained-simeone-dyche-mourinho/
- https://learning.coachesvoice.com/cv/positional-play-football-tactics-explained-guardiola-cruyff-manchester-city/
- https://learning.coachesvoice.com/cv/ppda-explained-passes-per-defensive-action/
- https://learning.coachesvoice.com/cv/rest-defence-explained/
- https://learning.coachesvoice.com/cv/switches-of-play-football-tactics-explained/
- https://learning.coachesvoice.com/cv/wing-backs-football-tactics-explained-conte-tuchel/
- https://learning.coachesvoice.com/cv/zonal-marking-football-tactics-explained-mourinho-conte-simeone/
- https://manchestercityanalysis.com/zones-in-football
- https://medium.com/@CaioGondo/as-organiza%C3%A7%C3%B5es-ofensivas-e-defensivas-das-bolas-paradas-escanteios-faltas-e-laterais-6fd09913b2c7
- https://medium.com/@SamHoleAFC/a-beginners-guide-to-the-half-spaces-in-football-b77cb89f137
- https://medium.com/@buildingblocks/football-stats-ppda-and-packing-a750a0df18ef
- https://medium.com/@stirlingj1982/what-is-relationism-c98d6233d9c2
- https://medium.com/@thefootballgazette/12-stats-that-explain-football-and-where-they-fail-413aa28b03a8
- https://mwfutebol.wordpress.com/2021/02/23/a-diversificacao-da-saida-de-3/
- https://noangulo.com.br/re-apresentacao-e-as-diagonais-de-fernando-diniz/
- https://onefootball.com/en/news/why-there-arent-fa-cup-replays-in-the-2024-25-season-40546576
- https://onlinesoccerguide.com/the-four-moments-in-soccer/
- https://opontofuturo.com/futebol-brasileiro-e-fernando-diniz/
- https://opontofuturo.com/o-que-e-o-relacionismo/
- https://pt.wikipedia.org/wiki/Campeonato_Paulista_de_Futebol_de_2024
- https://pt.wikipedia.org/wiki/Caneta_(futebol)
- https://pt.wikipedia.org/wiki/Cart%C3%A3o_de_penalidade
- https://pt.wikipedia.org/wiki/Copa_Libertadores_da_Am%C3%A9rica_de_2026
- https://pt.wikipedia.org/wiki/Drible
- https://pt.wikipedia.org/wiki/Drible_da_vaca
- https://pt.wikipedia.org/wiki/Escanteio
- https://pt.wikipedia.org/wiki/Esquemas_t%C3%A1ticos_do_futebol
- https://pt.wikipedia.org/wiki/Formato_do_Campeonato_Brasileiro_de_Futebol
- https://pt.wikipedia.org/wiki/Gol_de_Peixinho_(futebol)
- https://pt.wikipedia.org/wiki/Gol_ol%C3%ADmpico
- https://pt.wikipedia.org/wiki/Impedimento_(futebol)
- https://pt.wikipedia.org/wiki/Lambreta_(futebol)
- https://pt.wikipedia.org/wiki/Mundial_de_Clubes_FIFA_de_2025
- https://pt.wikipedia.org/wiki/Poker-trick
- https://pt.wikipedia.org/wiki/Posi%C3%A7%C3%B5es_no_futebol
- https://pt.wikipedia.org/wiki/Regras_do_futebol
- https://pt.wikipedia.org/wiki/Supercopa_da_Espanha
- https://pt.wikipedia.org/wiki/Volante_(futebol)
- https://refrsports.com/blog/set-piece-rules-in-soccer-explained
- https://simplesmentefutebolcom.wordpress.com/2021/02/25/taticas-bloco-baixo/
- https://skillcorner.com/articles/progressive-passing
- https://soccerment.com/expected-threat/
- https://soccerwizdom.com/2025/04/29/four-moments-of-the-game/
- https://statsbomb.com/articles/soccer/new-statsbomb-radars-2023-update/
- https://taticamente.com/atributos-dos-jogadores-no-football-manager/
- https://the-footballanalyst.com/expected-points-xp-football-statistics-explained/
- https://the-footballanalyst.com/goal-creating-actions-gca-football-statistics-explained/
- https://the-footballanalyst.com/half-spaces-football-tactics-explained/
- https://the-footballanalyst.com/long-balls-football-tactics-explained/
- https://the-footballanalyst.com/overload-to-isolate-tactics-creating-superiority-to-unlock-space/
- https://the-footballanalyst.com/rest-attack-football-tactics-explained/
- https://the-footballanalyst.com/rest-defence-football-tactics-explained/
- https://the-footballanalyst.com/shot-creating-actions-sca-football-statistics-explained/
- https://the-footballanalyst.com/the-phases-of-play-football-tactics-explained/
- https://theanalyst.com/articles/possessions-and-sequences-in-football
- https://theanalyst.com/articles/what-are-expected-goals-on-target-xgot
- https://theifab.com/news/clarification-of-the-guidelines-to-distinguish-between-deliberate-play-and-deflec/ — IFAB, clarificação do toque duplo no pênalti (jun/2025)
- https://themastermindsite.com/2022/07/02/why-the-technical-tactical-physical-and-psychological-sides-of-football-are-deeply-intertwined/
- https://thesporting.blog/blog/Football-history-of-the-three-point-system
- https://thetacticalanalyst.wordpress.com/2016/04/08/pressing-mechanisms-focusing-on-cover-shadows-and-pressing-traps/
- https://toptimebrasil.com.br/glossario/o-que-e-segundo-volante-entenda-essa-posicao-no-futebol/
- https://totalfootballanalysis.com/article/tactical-theory-a-comprehensive-guide-to-direct-possession-tactical-analysis-tactics
- https://totalfootballanalysis.com/thought-analysis/the-impact-of-player-archetypes-on-tactical-formations
- https://touchlinetheory.com/the-practical-guide-to-actually-understanding-positional-play/
- https://tribuna.com/en/blogs/from-regista-to-raumdeuter-how-weird-football-roles-were-bor/
- https://trivela.com.br/brasil/brasileirao-criterios-desempate/
- https://trutactics.com/2024/04/13/tactical-insights-rest-defence/
- https://unisportbrasil.com.br/bloco-baixo-2/
- https://unisportbrasil.com.br/conceitos-taticos-futebol-moderno/
- https://www.90min.com/posts/the-evolution-of-the-second-striker-role
- https://www.bemparana.com.br/copa-do-mundo-2026/termos-futebol/
- https://www.britannica.com/sports/football-soccer/Strategy-and-tactics
- https://www.cbf.com.br/a-cbf/arbitragem/aplicacao-regra-diretrizes-fifa
- https://www.cbssports.com/soccer/news/new-champions-league-format-explained-how-does-swiss-system-work-number-of-teams-league-phase/
- https://www.dci.com.br/esporte/brasileirao/criterios-de-desempate-no-brasileirao-entenda-a-regra-para-2024/
- https://www.dicionarioolimpico.com.br/futebol/palavra/cavadinha
- https://www.dicionarioolimpico.com.br/futebol/palavra/chute-de-trivela-1
- https://www.discountfootballkits.com/blog/tactics-explained-understanding-different-defensive-blocks/
- https://www.espn.com/soccer/story/_/id/37506736/iniesta-croqueta-kroos-shuffle-modern-football-best-signature-moves
- https://www.espn.com/soccer/story/_/id/39967167/fa-cup-replays-scrapped-2024-25-season
- https://www.eucalyptus.com.br/artigos/C47_Vocabulario+Futebol.pdf
- https://www.expectinggoals.com/p/the-set-piece-revolution
- https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/play-off-tournament-teams-qualifying-dates-tickets-matches-format
- https://www.fifatrainingcentre.com/en/game/tournaments/fu20wc/2025/goalkeeper-considerations-when-defending-corners.php
- https://www.fmscout.com/a-fm13-tactic-442-of-arrigo-sacchi.html
- https://www.fmscout.com/a-guide-to-player-roles-in-football-manager.html
- https://www.footballmanagerblog.org/2024/09/football-manager-goalkeeping-attributes-guide.html
- https://www.footballmanagerblog.org/2024/09/football-manager-mental-attributes-guide.html
- https://www.footballmanagerblog.org/2024/09/football-manager-physical-attributes-guide.html
- https://www.footballmanagerblog.org/2024/09/football-manager-technical-attributes-guide.html
- https://www.footballparadise.com/en/glossary/mezzala
- https://www.foottheball.com/explainer/regista-football-position-explained-meaning-history-role/
- https://www.fourfourtwo.com/features/cover-shadow-football-tactics-explained
- https://www.fourfourtwo.com/features/formations-in-football
- https://www.futbolidealists.com/blog/tactical-theory-the-concept-of-la-salida-lavolpiana
- https://www.futebolnaveia.com.br/drible-da-vaca-jogada-criativa-inusitada-e-habilidosa/
- https://www.goal.com/en-us/lists/best-football-skills-how-to-do-ronaldo-chop-elastico-cruyff-turn-soccers-top-trick-moves/blt9a4896aea1e854d9
- https://www.goal.com/en-us/news/gegenpressing-how-does-the-football-tactical-style-made-famous-by-klopp-work/1wc20wx6qtkkq1t36xj0px9mel
- https://www.hudl.com/blog/introducing-xgchain-and-xgbuildup
- https://www.hudl.com/blog/o-que-e-xg
- https://www.hudl.com/blog/statsbomb-on-ball-value
- https://www.lance.com.br/futebol-internacional/poquer-entenda-como-esporte-de-cartas-virou-termo-no-futebol.html
- https://www.lance.com.br/lancepedia/conheca-a-origem-do-temo-volante.html
- https://www.maisfutebol.com.br/curiosidades-do-futebol/o-que-e-lambreta-no-futebol/
- https://www.mlssoccer.com/news/octagonal-is-beautiful-why-2022-concacaf-world-cup-qualifying-format-should-be-c
- https://www.noticiasfavoritas.com.br/blog/guia-da-copa-explica-termos-de-futebol-para-iniciantes-09-06-2026-esporte/
- https://www.olympics.com/pt/noticias/supercopa-brasil-campeoes-historico-completo
- https://www.passion4fm.com/football-manager-2023-pep-guardiola-man-city-tactics-new-3-2-4-1-formation/
- https://www.passion4fm.com/football-manager-goalkeeper-attributes/
- https://www.passion4fm.com/football-manager-player-attributes/
- https://www.phaseofplay.com/post/phases-of-play-in-football
- https://www.planetfootball.com/nostalgia/remembering-short-lived-silver-goal-2004-czech-side-robbed
- https://www.premierleague.com/en/news/4250153/passes-per-defensive-action-explained
- https://www.premierleague.com/en/news/4256036
- https://www.premierleague.com/en/news/4373884/whats-new-in-2025-26-season-ifab-laws-and-premier-league-football-principles — Premier League, novidades 2025/26 (captain-only, anúncios de VAR, câmeras corporais)
- https://www.skysports.com/football/news/11095/12340830/away-goals-rule-abolished-for-uefa-competitions-from-2021-22-season
- https://www.skysports.com/football/news/11688/13515549/championship-play-offs-efl-confirms-expansion-from-four-to-six-teams-from-2026-27-season-onwards
- https://www.soccercoachingpro.com/la-croqueta/
- https://www.soccerpilot.com/tactic/articles/foundations-of-the-4-4-2-diamond-midfield.html
- https://www.sports-reference.com/blog/2020/04/goal-creation-possession-passing-and-more-advanced-stats-on-fbref/
- https://www.sportspro.com/news/genius-sports-second-spectrum-acquisition-data-tracking-technology/
- https://www.statsperform.com/pt-br/insights/expected-goals-xg-the-football-metric-changing-analysis-betting-and-fan-engagement/
- https://www.statsperform.com/resource/introducing-a-possessions-framework/
- https://www.tactiq.club/en/blog/field-tilt-territorial-dominance-football/
- https://www.thefa.com/football-rules-governance/lawsandrules/laws/football-11-11/law-1---the-field-of-play
- https://www.thefa.com/football-rules-governance/lawsandrules/laws/football-11-11/law-2---the-ball
- https://www.thefootballnotebook.com/post/enganche-segundo-volante-carrilero-explained
- https://www.thefootballnotebook.com/post/regista-trequartista-mezzala-explained
- https://www.thehighertempopress.com/football-formations/3-1-4-2/
- https://www.theifab.com/law-changes/2024-25/ — IFAB, mudanças 2024/25 (bola ao solo / posse provável, deliberate play)
- https://www.theifab.com/laws/latest/
- https://www.theifab.com/laws/latest/ — The IFAB, Laws of the Game (edição vigente, todas as 17 leis)
- https://www.theifab.com/laws/latest/fouls-and-misconduct/
- https://www.theifab.com/laws/latest/the-penalty-kick/ — IFAB, Lei 14 (toque duplo, encroachment, rebote)
- https://www.theifab.com/laws/latest/video-assistant-referee-var-protocol/
- https://www.theifab.com/news/law-11-offside-deliberate-play-guidelines-clarified/ — IFAB, clarificação de 'deliberate play' no impedimento
- https://www.theifab.com/news/the-ifab-tackles-goalkeeper-time-wasting/ — IFAB, regra dos 8 segundos do goleiro → escanteio
- https://www.theixsports.com/the-ix-soccer/fbrefs-loss-advanced-stats-womens-soccer-data-accessibility/
- https://www.theoutfield.nyc/p/lets-talk-about-the-salida-lavolpiana
- https://www.uefa.com/news-media/news/026a-1298aeb73a7a-5b64cb68d920-1000--abolition-of-the-away-goals-rule-in-all-uefa-club-competi/
- https://www.uefa.com/uefachampionsleague/news/0291-1bd88ae04870-e1e038c319e3-1000--champions-league-league-phase-standings-how-teams-level-on-/
