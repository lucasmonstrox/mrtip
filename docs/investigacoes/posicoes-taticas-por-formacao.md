# Posições x Formações — leitura de jogo na ótica de treinador de elite

> Material **didático e exaustivo** de domínio tático. As-of: **2026-06-21**.
> Método: workflow multi-agente — 1 agente por posição (cruzando cada posição com cada formação) + 1 agente por formação (eixo ortogonal) + síntese. 21 agentes.
> Rótulos de confiança usados pelos agentes: `consenso` (conhecimento tático de domínio, qualitativo — a maior parte) · `verificado-fetch`/`snippet` (web) · `inferência` · `NEI`.
> **Complementa, não duplica** [SIN-014 / formação tática](./sinal-formacao-tatica.md) (que trata a *formação* como sinal da camada EXPLICAR) e a refutação-mãe [leitura-de-jogo-profundidade-dominio.md](./leitura-de-jogo-profundidade-dominio.md). Aqui o foco é a granularidade de **posição/role** — que a evidência aponta importar **mais** que o rótulo nominal da formação. **Tudo isto é vocabulário da camada EXPLICAR (o "porquê" narrativo), nunca edge de aposta.**

---

## TL;DR — o fio condutor

**TL;DR — como ler esta síntese (a "tabela periódica" tática do produto).**

Você recebeu dois eixos que descrevem a MESMA realidade por ângulos diferentes: **11 dossiês de POSIÇÃO** (o que cada função faz) e **9 dossiês de FORMAÇÃO** (como as funções se arranjam). Reconciliar os dois é o trabalho desta síntese. A matriz abaixo é o cruzamento canônico: **linha = posição, coluna = formação (agrupadas por família)**, célula = "o papel/relevância daquela posição naquele esquema".

**A primeira coisa que o dono precisa internalizar (e que une os dois eixos):** *posição nominal não é papel real*. O mesmo rótulo ("lateral", "10", "ponta") muda de função — às vezes some por completo — conforme a formação. Três exemplos que vão se repetir na matriz:
- **"Lateral" vs "ala (wing-back)"**: são o MESMO corredor, mas o ala (sistemas de 3 zagueiros) cobre a faixa inteira sozinho e a largura do time depende dele; o lateral (linha de 4) joga protegido com zagueiro ao lado. Quando você lê "ala" num 4-4-2, é gíria imprecisa — ala não existe ali.
- **"Camisa 10" e "ponta"**: não são números, são PAPÉIS. O 10 floresce no losango/4-2-3-1/3-4-1-2 e é literalmente apagado pelo 4-4-2 e pelo bloco de 5. O ponta é a alma do 4-3-3/4-2-3-1 e inexistente em qualquer sistema sem extremos (losango, 3-5-2, 4-3-1-2).
- **"Goleiro" e "volante"**: o goleiro vira goleiro-construtor no 4-3-3 e volta a shot-stopper no 5-4-1; o volante vira pivô único exposto no losango e duplo pivô blindado no 4-2-3-1.

**Como isto conversa com o SIN-014 (a síntese das formações) e com a refutação-mãe do produto:** o SIN-014 já estabeleceu que **a formação declarada (papel) raramente é a formação real (gramado)** — times respiram entre formas (3 vira 5, 4-3-3 vira 4-5-1, 4-1-4-1 vira 4-3-3) sem trocar ninguém. Esta matriz herda esse aviso: cada célula descreve o papel **na fase com bola** do esquema-base; a fase sem bola frequentemente muda a formação e, com ela, o papel. E — refutação-mãe, sempre ligada — **estilo/tática/arquétipo NÃO é edge de aposta**. Tudo aqui é vocabulário da camada **EXPLICAR**: o "porquê narrativo" de como o jogo tende a se desenhar, ancorado no número do mercado/quant, que nunca se move. Saber que um time joga losango (sem largura, vulnerável aos flancos) ajuda a NARRAR de onde os gols/escanteios tendem a nascer; nunca a dizer que o número está errado.

---

## Matriz de referência rápida — posição x formação

**Nota de leitura (essencial):** colunas agrupam formações por família. **4at-2pivo** = 4-2-3-1 e 4-1-4-1 (linha de 4 + pivô protegido). **4at-1pivo** = 4-3-3 (pivô único + tridente). **4-4-2** = duas linhas de 4. **Losango** = 4-4-2 diamante e 4-3-1-2 (sem pontas, largura só dos laterais). **3at-equilíbrio** = 3-5-2 / 3-4-1-2 / 3-4-3 / 3-4-2-1 (3 zagueiros + alas). **Bloco-5** = 5-3-2 / 5-4-1 (alas recuados). Célula = papel + se a formação **valoriza (V)**, **apaga (X)** ou é **neutra (~)** a posição. "Papel real" descreve a fase com bola; sem bola muitos esquemas mudam de forma.

| Posição \ Formação | 4-4-2 clássico | Losango (diamante / 4-3-1-2) | 4-3-3 (1 pivô) | 4-2-3-1 / 4-1-4-1 | 3-5-2 / 3-4-x (alas) | Bloco-5 (5-3-2 / 5-4-1) |
|---|---|---|---|---|---|---|
| **Goleiro** | ~ Shot-stopper + comando aéreo; distribuição direta | ~ Construtor moderado: +1 na saída pra suprir falta de largura | **V** Construtor/sweeper: pré-requisito; saída em 3, linha alta | **V** Completo: duplo pivô blindando a saída curta | **V** +1 que vira linha de 4; lê costas dos alas | **X** Volta ao shot-stopper clássico: defende chute, lança contra-ataque |
| **Lateral** (linha de 4) | **V** Equilíbrio: largura + cobertura do meia de lado; sobe alternado | **V++** ÚNICA largura do time; vira quase-ala; risco máximo na transição | **V** Define o moderno: dança overlap/underlap com o ponta; pode invertir | **V** Sobe com rede dupla (4-2-3-1) ou criterioso (4-1-4-1, 1 pivô) | (vira ala — ver linha abaixo) | (vira ala recuado — ver linha abaixo) |
| **Ala / Wing-back** | **X** Não existe; o corredor é do lateral + meia de lado | **X** Não existe; ausência de largura é a fraqueza-mãe do diamante | **X** Não existe; flanco é ponta + lateral | **X** Não existe; ponta + lateral protegido | **V+++** Habitat máximo: largura inteira do time, área a área | **X→** Modo defensivo: ala-zagueiro, fecha o flanco, sobe só em transição |
| **Zagueiro central** | **V** Casa-mãe: stopper+cover, 2v2 limpo, jogo aéreo, marcação referenciada | ~ Mais exposto lateralmente: desliza pra cobrir flanco do lateral subido | **V** Saída de bola é tudo: ball-playing + velocidade pra linha alta | **V** Confortável: duplo pivô blinda; 2v1 sobra um livre | **V** Trio: líbero do meio + 2 de fora que sobem; sobra numérica | **V** Fortaleza: trio em modo bloco, stopper clássico + aéreo total |
| **Volante / 6** | **V** Duplo pivô disfarçado: alternância obrigatória, 2v3 no miolo | **X-risco** Pivô único MAIS exposto: flancos descobertos o puxam | **V** Catedral do pivô único: organiza saída, cobre sozinho | **V** Lar do duplo pivô (4-2-3-1) / mais ancorado e protegido (4-1-4-1) | **V** Colchão de 3 zagueiros: sobe e arrisca mais; cobre subida dos alas | ~ Coberturista posicional: destroi e devolve, não organiza |
| **Box-to-box (8)** | **V** Lar histórico: motor + alternância; trabalho braçal | **V** Multiplica: 2 interiores do diamante, carga lateral pesada | **V** Vira mezzala: arquétipo moderno por excelência | **V/~** Controlado (4-2-3-1, freio) / LIBERADO chegador (4-1-4-1) | **V** Melhor dos mundos: 3 zagueiros dão lastro pra subir | **X→** Vira carregador de transição; chegador apagado |
| **Interior / Mezzala** | **X** Apaga: só licença ocasional a um dos 2 volantes | **V** Ressuscita: 2 interiores natos do losango | **V+++** Casa por excelência: meia-espaço, triângulo com lateral+ponta | **~** Disfarçado: volante avançado (4-2-3-1) / interior claro (4-1-4-1) | **V** Favorável: alas terceirizam a largura, ele foca o half-space | **X→** Mezzala-trabalhador: contenção + contra-ataque (5-3-2); apagado no 5-4-1 |
| **Camisa 10** | **X** MAIS apaga: sem casa; só vira 4-4-1-1 informal | **V+++** Templo do enganche: ponta do diamante, liberdade máxima | **X→mezzala** Sem vaga pura; talento migra pra interior 8 | **V+++** Casa moderna (4-2-3-1) / diluído em interior (4-1-4-1) | **V (3-4-1-2/3-4-2-1)** Enganche ou 2 dieces; **~** diluído no 3-5-2 puro | **X** Hostil: só sobrevive como 10 de transição no 5-3-2 |
| **Ponta / Extremo** | **V** Tradicional: meia-de-lado two-way, cruza E recua | **X** Eliminado: sem extremos; largura só dos laterais | **V+++** Casa natural: invertido + ponta-atacante, tridente | **V** Excelente: invertido protegido por 2 volantes | **V (3-4-3) / X (3-5-2)** Volta no 3-4-3 jogando por dentro; some no 3-5-2 | **X→** Apagado/reconfigurado: defende recuado, vive de contra-ataque |
| **Segundo atacante / 9.5** | **V** Habitat clássico: dupla assimétrica, cai e cria | **V** Valorizado, mas perde o armar pro 10; vira móvel/finalizador | **~** Só como falso-9 ou ponta caindo no meio-espaço | **V (4-2-3-1)** O "10" é 9.5 disfarçado; **X→** intermitente no 4-1-4-1 | **V (3-5-2/3-4-2-1)** Dupla solta / 2 meias-atacantes nos half-spaces | **V (5-3-2)** Vira jogador de transição; **X** apagado no 5-4-1 |
| **Centroavante (9)** | **V** Exige DOIS: dupla complementar (target + finalizador) | **V** Valorizado com apoio rico do 10 + interiores; sem largura | **V** Isolado mas com 2 pontas: falso-9 / pivô / pressionador | **V (4-2-3-1, 9+10)** / **X-isola (4-1-4-1)** Sacrificado, autossuficiente | **V** Dupla (3-5-2) ou único com 2 dieces atrás (3-4-2-1) | **V→transição (5-3-2)** / **X-solidão total (5-4-1)** |

**Como o dono usa a matriz:** bata o olho na coluna da formação do jogo. Célula **V+++** = posição que decide o esquema (ex.: ala no 3-5-2, 10 no losango, ponta no 4-3-3). Célula **X** = posição que some ou vira outra coisa (ex.: ponta no losango). As setas (→) avisam que a fase sem bola muda o papel. Cruze com os "ganchos" de cada dossiê de posição pra montar a narrativa EXPLICAR do jogo (de onde tendem a nascer gols, escanteios, cartões), sempre ancorada no número.

---

## A leitura honesta — por que isto é EXPLICAR e não ESTIMAR

**Por que isto é camada EXPLICAR e não ESTIMAR — e por que a distinção protege o produto.**

**1. Efeito de ROLE > rótulo nominal (a tese central da reconciliação).** A descoberta que emerge ao cruzar os dois eixos é que a *função real* de um jogador é produzida pela formação, não pelo nome da posição na escalação. "Lateral-esquerdo" pode significar quatro coisas radicalmente diferentes (overlapping puro no 4-3-3, lateral invertido virando 3º volante, ala que cobre o corredor inteiro no 3-5-2, ala-zagueiro recuado no 5-4-1) — cada uma com consequências narrativas opostas (muito cruzamento vs. zero cruzamento; muito risco de transição vs. nenhum). Isso é EXPLICAR puro: descreve o *mecanismo* de como o jogo se desenha. Não é ESTIMAR porque não produz um número — produz a *história por trás* do número que o quant já fixou.

**2. Endogeneidade (a armadilha de inverter causa e efeito).** Um treinador não escolhe a formação no vácuo: ele a escolhe *por causa* dos jogadores que tem e do adversário que enfrenta. Um time joga losango porque TEM um 10 craque; joga 3-5-2 porque TEM dois alas de motor; trança pro 5-4-1 porque DECIDIU segurar o resultado. Logo, "formação X tende a gerar padrão Y" é parcialmente um efeito da intenção prévia, não uma lei causal isolável. Por isso a matriz é gerador de *hipóteses* qualitativas, nunca um sinal mecânico — o número do mercado já absorveu boa parte dessa intenção.

**3. Declarada != real (herdado do SIN-014).** A matriz descreve o papel no esquema-BASE com bola. Mas a formação real respira: o 4-1-4-1 vira 4-3-3 ou 4-5-1 dentro do mesmo jogo; o 3-4-3 vira 5-4-1 sem bola; o ala oscila entre 5º defensor e quase-ponta a cada posse. Qualquer leitura que trate a escalação no papel como verdade fixa erra. A célula é um *ponto de partida narrativo*, não um retrato congelado.

**4. Anti-dupla-contagem (a trava mais importante pro produto).** Os "ganchos" de cada posição (escanteios do ala ofensivo, cartões do volante destruidor, gols de segunda linha do box-to-box chegador) descrevem os MESMOS eventos por ângulos diferentes — e descrevem fenômenos que o modelo quant já tem precificados via dados de time/jogador. Empilhar "tem ala ofensivo (+escanteio)" + "tem ponta driblador (+escanteio)" + "joga 3-5-2 (+cruzamento)" como se fossem três sinais independentes é dupla/tripla contagem do mesmo mecanismo. O papel correto desta matriz é dar *vocabulário para narrar* o número, não somar ajustes sobre ele. Uma vez que a narrativa explica o número, ela cumpriu sua função e para.

**Conexão com o produto:** o leitor (dono, admite não ser bom de futebol) usa esta matriz para *entender e contar* por que o jogo tende a ter certa textura — de onde o perigo nasce, qual flanco é frágil, quem concentra a criação. Isso dá textura e credibilidade ao "explicar". O número/quant é a âncora soberana; a matriz é a legenda do mapa, nunca o GPS que recalcula a rota.

---

## Parte 1 — As posições (dossiê por posição)

Cada dossiê: perfil e arquétipos · os 4 momentos · zonas e gaps · jogo aéreo e bola parada · relação com as linhas · **papel em cada formação** · parcerias · exemplos de elite · erros comuns · ganchos para a camada EXPLICAR.

1. [Goleiro (incluindo goleiro-líbero / sweeper-keeper)](#goleiro-incluindo-goleiro-líbero--sweeper-keeper)
2. [Lateral / Full-back (lateral ofensivo, lateral invertido / inverted full-back, lateral-zagueiro)](#lateral--full-back-lateral-ofensivo-lateral-invertido--inverted-full-back-lateral-zagueiro)
3. [Ala / Wing-back (alas de sistemas com linha de 5 ou 3 zagueiros)](#ala--wing-back-alas-de-sistemas-com-linha-de-5-ou-3-zagueiros)
4. [Zagueiro central (incl. zagueiro de saída / ball-playing, stopper-marcador, zagueiro de cobertura, líbero)](#zagueiro-central-incl-zagueiro-de-saída--ball-playing-stopper-marcador-zagueiro-de-cobertura-líbero)
5. [Volante / pivô defensivo (6) — incl. destruidor (ball-winner), regista (deep-lying playmaker / maestro), e a distinção pivô único vs duplo pivô](#volante--pivô-defensivo-6--incl-destruidor-ball-winner-regista-deep-lying-playmaker--maestro-e-a-distinção-pivô-único-vs-duplo-pivô)
6. [Meio-campista box-to-box (camisa 8)](#meio-campista-box-to-box-camisa-8)
7. [Interior / Mezzala (meia de meio-espaço, half-space)](#interior--mezzala-meia-de-meio-espaço-half-space)
8. [Meia-armador / Camisa 10 (jogador entre linhas, enganche, trequartista)](#meia-armador--camisa-10-jogador-entre-linhas-enganche-trequartista)
9. [Extremo / Ponta (ponta aberta, extremo invertido / inverted winger, ponta-atacante)](#extremo--ponta-ponta-aberta-extremo-invertido--inverted-winger-ponta-atacante)
10. [Segundo atacante / 9.5 (support striker; falso 9 como variação)](#segundo-atacante--95-support-striker-falso-9-como-variação)
11. [Centroavante (9) — homem-alvo / target man, finalizador / poacher, falso 9, atacante completo, pressionador](#centroavante-9--homem-alvo--target-man-finalizador--poacher-falso-9-atacante-completo-pressionador)

---

### Goleiro (incluindo goleiro-líbero / sweeper-keeper)

#### Resumo didático

**O que é, em uma frase:** o goleiro é o único jogador autorizado a usar as mãos (dentro da própria grande área) e é a última linha de defesa — o cara entre o atacante e o gol. Mas isso é só a metade antiga da história.

**Por que a posição existe:** num esporte onde marcar gol é difícil, alguém precisa ter o poder de impedir o gol já feito (chute na direção da rede). O goleiro existe para *converter chances do adversário de volta em "nada aconteceu"*. Cada defesa que ele faz é, na prática, um gol que ele tira do placar.

**A revolução que você precisa entender (e que muda tudo na narrativa do jogo):** nos últimos ~15 anos o goleiro deixou de ser só "o que defende" e virou *o primeiro jogador da fase de ataque*. Como o regulamento permite que o goleiro use as mãos, o time em posse de bola joga, na prática, com 11 contra 10 quando usa o goleiro pra construir a jogada — porque o goleiro adversário nunca sobe pra marcar. Esse "homem a mais" no campo de defesa é o que permite times modernos jogarem com linha alta, pressão alta e bola no chão saindo de trás. Sem um goleiro que sabe jogar com os pés, esse estilo desmorona.

**Os dois grandes arquétipos que você vai ouvir o tempo todo:**
- **Goleiro tradicional / linha de gol (line-keeper):** fica colado no gol, é especialista em defender chute. Pensa "primeiro não tomar gol". 
- **Goleiro-líbero / sweeper-keeper ("varredor"):** joga adiantado, alto fora da área, "varre" (do inglês *to sweep*, varrer) as bolas que passam pela linha de zaga antes do atacante chegar — funciona como um zagueiro extra. E na fase de ataque é uma opção de passe constante, às vezes com mais participação na construção que alguns zagueiros.

**Jargão que vou usar e você precisa fixar:**
- **Distribuição:** como o goleiro entrega a bola pro time (com o pé curto, chutão longo, lançamento, ou arremesso com a mão).
- **Saída de bola / construção (build-up):** a fase em que o time tira a bola de trás organizadamente; o goleiro costuma ser o ponto de partida.
- **Sair do gol / reduzir o espaço:** o goleiro avança pra "fechar o ângulo" do atacante (quanto mais perto ele chega, menos rede sobra pra mirar).
- **Bola parada:** escanteios, faltas e cobranças paradas — o goleiro é o chefe de tudo que cai na área dele.

#### Perfil e arquétipos

Atributos ideais, separados por categoria, e depois os sub-papéis com a diferença *prática* entre eles.

**Físico:**
- *Altura e envergadura:* alcançar a "gaveta" (canto alto do gol, ~2,44 m de altura) e dominar o jogo aéreo. Padrão de elite hoje gira em torno de 1,88–1,95 m. Goleiro baixo (sub-1,85 m) precisa compensar com explosão e leitura — é fragilidade clara em cruzamento e bola alta.
- *Explosão e impulsão:* não é correr 100 m, é o primeiro passo lateral e o salto. A defesa difícil é vencer a gravidade em meio segundo.
- *Reflexo:* tempo de reação a chute de curta distância e desvio (deflexão).
- *Coordenação mão-pé:* hoje o pé é tão importante quanto a mão.

**Técnico:**
- *Pegada e encaixe (handling):* segurar a bola firme em vez de dar rebote. Rebote = segunda chance pro adversário.
- *Jogo de base/posicionamento:* a defesa "fácil" que o público nem percebe vem de já estar no lugar certo. O melhor posicionamento transforma chute difícil em rotina.
- *Saída de gol em cruzamento (aerial command):* sair, gritar "minha!", e socar ou agarrar a bola no ar com gente em cima.
- *Distribuição com os dois pés:* passe curto sob pressão sem entrar em pânico, lançamento longo de 60–75 m com precisão, e o arremesso de mão (mais preciso que o chute pra lançar contra-ataque).
- *Jogo com os pés sob pressão:* receber de costas pro campo, com atacante chegando, e sair jogando — sangue-frio.

**Mental (o mais subestimado):**
- *Concentração por 90+ min:* pode ficar 70 min sem tocar e precisar fazer A defesa do jogo no minuto 89.
- *Coragem e decisão:* sair ou ficar? Em milissegundos. Indecisão é o pior dos mundos.
- *Liderança e comunicação:* o goleiro vê o jogo inteiro de frente; ele organiza a linha de defesa, avisa de marcação perdida, comanda a barreira. É o "maestro de trás".
- *Resiliência psicológica:* falha de goleiro vira gol direto. Tem que esquecer o erro no mesmo lance.

**ARQUÉTIPOS (a diferença prática importa muito pra leitura de jogo):**

**1. Goleiro de linha / shot-stopper puro (ex-arquétipo "São Marcos / Buffon clássico"):** vive da área, especialista absoluto em defender chute e dominar a própria área aérea. Joga mais recuado, distribui com chutão (bola longa direta). *Diferença prática:* dá segurança máxima na bola na área, mas o time perde o "homem a mais" na saída — costuma jogar mais direto/vertical e ceder posse.

**2. Sweeper-keeper / goleiro-líbero:** posiciona-se alto (até 18–25 m do gol quando o time tem a bola ou a linha está alta), corre pra fora da área pra cortar bola nas costas da zaga. *Diferença prática:* permite linha de defesa alta e compactação do bloco — mas se errar a leitura fora da área, é gol no gol vazio (risco assimétrico, alto ganho / alto custo).

**3. Goleiro-construtor / playmaker (o "Ederson"):** o foco é a distribuição. Trata a saída de bola como um armador trataria. Pé de jogador de linha, lançamento cirúrgico que pula linhas de pressão inteiras. *Diferença prática:* é o que viabiliza posse dominante e pressão alta; mas times assim às vezes toleram um shot-stopping um pouco inferior em troca do controle de jogo.

**4. O completo (o "Alisson / Neuer no auge"):** une shot-stopping de elite + sweeper + distribuição. Raro. É o que permite tanto o gegenpressing/linha altíssima quanto a segurança na bola parada. O melhor dos mundos.

Na vida real os goleiros são uma *mistura*; o que muda é a dosagem e o que o treinador prioriza. Um treinador de posse (Guardiola) sacrifica reflexo por pé; um treinador reativo de bloco baixo prioriza shot-stopping e jogo aéreo.

#### Os 4 momentos do jogo

**(1) Organização ofensiva (time com a bola, posicionado):**
O goleiro é o **ponto de partida e o "+1" da construção**. Ele se posiciona alto (frequentemente fora da área pequena, às vezes na entrada da grande área) pra criar a superioridade numérica 11v10 no campo de defesa — como o goleiro adversário não sobe pra marcar, o time em posse sempre tem um homem livre atrás. Funções: (a) receber o recuo do zagueiro e *resetar* a jogada pro outro lado, atraindo a pressão do adversário pra abrir espaço; (b) ser a "válvula de escape" quando a saída trava; (c) pular linhas com lançamento longo quando o adversário pressiona alto demais (passe direto pro pivô/ponta nas costas da pressão). Em times de elite, o goleiro às vezes integra a linha de 3 na saída (vira "líbero recuado").

**(2) Organização defensiva (time sem a bola, bloco montado):**
Aqui o goleiro **gerencia a profundidade**. Se o time joga com linha alta, ele se adianta pra ocupar o espaço entre sua linha de zaga e o gol (a "zona de cobertura"), pronto pra varrer bola lançada nas costas. Se o time joga em bloco baixo, ele fica mais perto da linha de gol, focado em defender chute e dominar cruzamento. Comanda e posiciona a barreira, organiza a linha ("sobe!", "marca o 9!"), e fecha os ângulos quando o adversário chega na área.

**(3) Transição ofensiva (acabou de recuperar a bola):**
Momento de ouro do goleiro moderno. Ao agarrar a bola ou recuperar nos pés, ele decide em 1–2 segundos: **lançar o contra-ataque rápido** (arremesso de mão preciso pra um corredor lançado, ou chutão pro pivô) OU **segurar e recomeçar a posse**. Goleiro de elite lê *quando* o adversário está desorganizado e dispara o contragolpe — vira um "primeiro passador" de transição. A escolha errada (segurar quando devia lançar, ou vice-versa) mata o contra-ataque.

**(4) Transição defensiva (acabou de perder a bola — o famoso "balde de água fria"):**
É quando o sweeper-keeper justifica o salário. Ao perder a bola com a linha alta, surge espaço nas costas da zaga. O goleiro precisa **estar adiantado e ler o lançamento** pra sair correndo e cortar a bola/atacante antes do duelo 1v1 (a tal "varredura" fora da área). É decisão de alto risco: acertar é defesa que ninguém vê; errar é gol no gol vazio. O goleiro tradicional, mais recuado, vira refém do 1v1 ou do chute de longe.

#### Zonas ocupadas e gaps deixados

**Zona natural de ocupação:** a grande área (16,5 m) e principalmente a área pequena (5,5 m). É a única zona do campo onde o goleiro pode usar as mãos — e isso define geometricamente tudo.

**A "zona de cobertura" do sweeper-keeper:** o espaço entre a linha de zaga e o gol. Quanto mais alta a linha de defesa, maior esse espaço e mais o goleiro tem que ocupá-lo *fora* da área (onde NÃO pode usar a mão — só o pé/peito/cabeça, como um jogador de linha). Goleiros modernos passam parte significativa do jogo posicionados na entrada ou fora da grande área.

**Corredores na saída de bola:** na construção o goleiro tende a se posicionar **central**, no eixo do gol, pra ter os dois lados disponíveis (pé direito e esquerdo, ou os dois zagueiros). Alguns times o deslocam levemente pro lado da bola pra encurtar o passe.

**O gap/espaço que o goleiro DEIXA EXPOSTO (crucial pra leitura):**
1. **O gol vazio atrás dele.** Toda vez que ele sai pra varrer ou sobe pra construir, fica espaço entre ele e a rede. Por isso existe o chute/lançamento "por cima do goleiro adiantado" e o **chute de muito longe** (o "lob") — o adversário tenta explorar o goleiro alto. Times que enfrentam sweeper-keepers procuram esse passe nas costas dele ou a finalização de primeira por cobertura.
2. **O 1v1 quando ele hesita.** Se sai e não chega, ou fica e não sai, o atacante ganha o duelo.
3. **Na saída de bola, o erro técnico:** se o goleiro recebe sob pressão e perde a bola na própria área, é gol quase certo. Esse é o "preço" de jogar com o goleiro na construção — e o motivo de o adversário **pressionar a saída** (forçar o erro perto do gol).

**Como o adversário explora a ausência/o avanço dele:**
- *Pressão alta sobre a saída:* atacantes marcam os zagueiros e o passe de retorno, forçando o goleiro a chutar longo (perda de controle) ou a errar curto perto do gol.
- *Lançamento nas costas da linha alta:* obriga o goleiro a uma corrida-decisão; se ele é lento ou indeciso, vira chance clara.
- *Finalização de longa distância / por cobertura:* contra goleiro muito adiantado.
- *Cruzamento na área com goleiro de comando aéreo fraco:* abre escanteio/gol de cabeça.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo (o pão com manteiga do goleiro na bola alta):**
O goleiro é a autoridade máxima dentro da própria área no jogo aéreo. Em cruzamentos e bolas alçadas, ele decide entre:
- *Sair pra agarrar/encaixar* (ideal — encerra o lance e gera transição).
- *Socar/espalmar (punch)* — quando tem gente demais e não dá pra agarrar com segurança; tira a bola pra longe/pro lado.
- *Ficar na linha* — quando o cruzamento é longe demais e sair seria suicídio.
A qualidade de "comando de área" (aerial command) separa goleiros: um que domina o ar **encurta escanteios e cruzamentos**; um inseguro no ar transforma toda bola alçada em pânico — e isso aparece em **gols de cabeça e segundas bolas**.

**Em escanteios e faltas alçadas:** o goleiro organiza a marcação (quem fica em zona, quem é individual, quem fecha os postes — "primeiro pau" e "segundo pau"), posiciona-se geralmente perto do segundo pau pra cobrir mais campo, e tem prioridade pra atacar a bola. Um goleiro alto e de bom timing de salto é um **redutor de perigo enorme** em bola parada defensiva.

**Barreira (em faltas frontais e laterais):** o goleiro **monta e alinha a barreira** — define quantos jogadores, e se posiciona pra cobrir o lado do gol que a barreira não tapa (ele defende o "lado aberto", confiando na barreira pro lado fechado). Erro de barreira ou posicionamento errado do goleiro = gol de falta.

**Pênalti:** duelo psicológico puro. O goleiro estuda o batedor, tenta intimidar/atrasar, escolhe lado (por leitura ou por aposta). Em disputas por pênaltis, vira protagonista absoluto — e há goleiros "especialistas em pênalti" que mudam o destino de mata-matas.

**Bola parada OFENSIVA:** raríssimo, mas em momentos finais e desesperados (últimos minutos perdendo) o goleiro **sobe pra área adversária** em escanteios e faltas laterais pra usar a altura como mais um cabeceador — alto risco de levar gol no contra-ataque no gol vazio, mas é uma cartada conhecida. Goleiro alto e bom de cabeça já marcou gols decisivos assim.

**Lateral/tiro de meta:** o tiro de meta é distribuição pura (ver os 4 momentos). No lateral arremessado perto da área, o goleiro deve estar atento pra sair em bola alçada.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

A relação do goleiro com a **altura da linha defensiva** é talvez o vínculo tático mais importante da posição moderna — eles funcionam como um sistema acoplado.

**Linha alta ⇄ goleiro adiantado (relação direta):** quanto mais alta a linha de zaga, **mais o goleiro precisa subir** pra cobrir o espaço que se abre nas costas dela. O sweeper-keeper *é o que torna a linha alta possível*: ele é a apólice de seguro contra o lançamento nas costas. Sem um goleiro que sai bem, a linha alta vira roleta-russa. Por isso times de **gegenpressing e pressão alta** (estilo "heavy metal", linha de defesa altíssima) dependem visceralmente de um goleiro tipo varredor — é o que sustenta o sistema inteiro.

**Linha baixa ⇄ goleiro mais recuado:** em bloco baixo (time defende perto do próprio gol), o espaço nas costas some, então o goleiro fica mais perto da linha de gol, e o jogo dele vira shot-stopping + dominar a chuva de cruzamentos. Pouca varredura, muita defesa de chute e bola aérea.

**Espaço entre as linhas:** o goleiro não atua diretamente entre linhas, mas a sua coragem de sair **comprime o bloco**: se ele garante as costas, a linha de zaga sobe e gruda no meio-campo, reduzindo o espaço entre linhas onde o camisa 10 adversário recebe. Goleiro que não sai = linha tem que recuar pra se proteger = abre espaço entre linhas pro adversário.

**Pressing e contrapressing (e a PPDA):** PPDA (*passes allowed per defensive action* — passes que você deixa o adversário dar antes de fazer uma ação defensiva; PPDA baixa = pressão muito intensa) baixa exige goleiro como sweeper, porque pressar alto deixa as costas expostas. Já do lado da *posse*, quando o time é **pressionado na saída**, o goleiro vira o alvo: o adversário tenta isolá-lo. Aí ele decide entre furar a pressão com passe curto corajoso (mantém posse, mas arrisca perto do gol) ou bater longo por cima da pressão (segurança, mas entrega a bola). Essa decisão recorrente é uma das mais reveladoras do jogo: um goleiro que fura pressão bem **desarma o pressing adversário** e gera vantagem; um que entra em pânico **alimenta** o pressing e gera chances claras contra.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

Formação tradicionalmente mais **reativa e direta**, com bloco médio/baixo e duas linhas compactas. Aqui o goleiro tende mais ao **arquétipo de linha / shot-stopper + comando aéreo**: a distribuição costuma ser mais direta (chutão pra disputa dos dois atacantes, segundas bolas) do que construção elaborada. Com a linha de zaga geralmente menos alta, a função de varredura é menor; o que pesa é dominar cruzamento (4-4-2 sofre muito pelos lados) e defender chute de fora. A formação **não valoriza** especialmente o goleiro-construtor — usa mais o goleiro pra segurança e início direto. Conexão principal: com a dupla de zaga e os volantes/meias para a segunda bola.

**4-4-2 em losango (diamante)**

O losango concentra gente no meio e **abre os flancos** (sem pontas fixas, os laterais sobem muito). Isso significa que o time fica **vulnerável a bola nas costas dos laterais avançados e a cruzamentos**. O goleiro ganha duas responsabilidades extra: **comando aéreo forte** (vai chover cruzamento dos lados que ficaram descobertos) e **leitura de lançamento diagonal** pras costas dos laterais. Na saída, como o losango oferece o volante de origem (a ponta de trás do diamante) como opção central, o goleiro tem um receptor curto — mas precisa de cuidado porque o meio está congestionado. Valoriza o goleiro **equilibrado** (aéreo + alguma saída de bola).

**4-3-3**

Formação **proativa, de posse e pressão**, frequentemente com linha alta. Aqui o goleiro-**construtor/sweeper é altamente valorizado** — é praticamente um pré-requisito. Na saída, os dois zagueiros abrem e o goleiro fica no meio formando uma linha de 3 de construção (o famoso 'salometro' de saída em 3), criando o 11v10 pra furar a pressão do trio ofensivo adversário. Com a linha alta, a varredura nas costas é constante. É o ecossistema natural do Ederson/Alisson/ter Stegen. A formação **valoriza ao máximo** o goleiro de pés bons e coragem de sair. Conexão-chave: com os zagueiros (saída em 3) e com o volante (camisa 6) que dá a opção de passe pra dentro.

**4-2-3-1**

A formação mais comum do futebol moderno equilibra posse e segurança. A **dupla de volantes (o duplo pivô)** dá ao goleiro **duas opções de passe protegidas** logo à frente — facilita muito a saída curta e reduz o risco de perder a bola na pressão. O goleiro tende ao perfil **completo/construtor moderado**: participa da saída em segurança (zagueiros + dois volantes formam estrutura), e a linha costuma ser média-alta, exigindo varredura moderada. A presença do duplo pivô **protege** o goleiro do pressing central. Valoriza o goleiro que distribui bem curto. Conexão-chave: com o duplo pivô (válvulas de escape) e com os zagueiros.

**4-1-4-1**

Tem um **único volante (pivô) de origem** à frente da defesa, mais um quarteto de meias. Na saída, o goleiro conta com esse pivô solitário como referência central — mas se o adversário **marca esse pivô**, a saída pode travar e o goleiro vira a válvula obrigatória, precisando de **sangue-frio sob pressão ou bom passe longo** pra furar por cima. A linha costuma ser média; varredura moderada. Defensivamente o 4-1-4-1 é sólido e compacto, dando ao goleiro uma frente protegida — mas exige que ele saiba **quebrar pressão** quando o pivô é anulado. Conexão-chave: com o volante único (e sua marcação determina a vida do goleiro na saída).

**3-5-2 / 3-4-1-2**

Com **três zagueiros**, a saída de bola já nasce com superioridade, e o goleiro frequentemente vira o **'+1' que sobe pra formar uma linha de 4 de construção** (ou fica de líbero recuado atrás dos 3). O foco da saída desloca-se pra **ocupar os lados e esticar o adversário horizontalmente** (com os alas/wing-backs muito abertos), em vez de monopolizar o centro. O goleiro precisa distribuir bem pros lados e ler as costas dos alas avançados (espaço típico do 3-5-2). Defensivamente os 3 zagueiros dão cobertura central forte, então a varredura central é menos urgente, mas a bola nas costas dos alas é o gap clássico. Valoriza o goleiro **bom de pé e de leitura lateral**.

**3-4-3 / 3-4-2-1**

Variante mais ofensiva do esquema de 3 zagueiros, geralmente com **linha mais alta e pressão**. O goleiro é **muito valorizado como construtor e sweeper**: sobe pra dar saída com os 3 zagueiros (vira 4 na construção), e a linha alta exige varredura ativa nas costas. Os alas altíssimos deixam **espaço enorme nas costas** — o goleiro precisa ler lançamentos diagonais e estar adiantado. É um esquema que exige um goleiro de pés muito bons (a estrutura de saída é elaborada) e corajoso. Conexão-chave: com os 3 zagueiros na saída e com os alas (cobertura das costas deles).

**5-3-2 / 5-4-1 (bloco de 5)**

Esquema **reativo e defensivo** (os 5 atrás são zagueiros + alas recuados formando linha de 5). Aqui o goleiro volta ao perfil **shot-stopper + comando aéreo + distribuição direta**: o time defende baixo, então **não há espaço nas costas pra varrer** — a função de sweeper quase some. O que importa é defender o chute de fora (o 5-4-1 cede muito chute de média distância), dominar a chuva de cruzamentos e bolas paradas (bloco baixo sofre escanteio em série), e **lançar o contra-ataque** (chutão/arremesso longo pros dois atacantes ou pro homem de referência, já que o time joca por transição). A formação **'apaga' o goleiro-construtor** e **acende o goleiro defensivo clássico**. Conexão-chave: com a linha de 5 (organização) e com os atacantes de transição (alvo do lançamento).

**4-3-1-2 (sem pontas)**

Esquema **estreito/central** (sem pontas, com meia-atacante e dois atacantes), que **abre os flancos** como o losango. O goleiro carrega de novo a carga de **comando aéreo e leitura de bola pras costas dos laterais** (que sobem pra dar largura, deixando os lados expostos a cruzamento). Na saída, o trio de meio + o meia-armador oferecem opções centrais — mas o congestionamento central pode dificultar; um bom **passe longo pros lados/atacantes** ajuda a contornar a pressão. Valoriza o goleiro **equilibrado**, forte no aéreo e capaz de variar a distribuição (curto central ou longo pros lados). Conexão-chave: com os zagueiros e o volante de origem, e atenção redobrada aos cruzamentos dos flancos descobertos.

#### Parcerias-chave

**Goleiro + dupla/trio de zagueiros (a parceria-mãe):** é a relação mais íntima do time. Na saída de bola, o goleiro + zagueiros formam a estrutura de construção (linha de 3 com dois zagueiros, ou linha de 4 com três zagueiros). Defensivamente, o goleiro **comanda** a linha — manda subir, recuar, marcar. A confiança mútua define se o time consegue jogar com linha alta: o zagueiro só sobe se confia que o goleiro cobre as costas. Comunicação constante e relação de anos é o que faz a defesa parecer 'telepática'.

**Goleiro + volante de origem (camisa 6 / pivô):** o volante que desce entre/à frente dos zagueiros é a **válvula de escape central** do goleiro na saída sob pressão. Quando o adversário marca esse pivô, a saída do goleiro fica muito mais difícil — por isso o adversário frequentemente prioriza marcar esse jogador. A relação goleiro-pivô define a fluidez da construção.

**Goleiro + laterais/alas:** o goleiro lê e cobre as **costas dos laterais avançados** — quanto mais ofensivo o lateral, mais o goleiro precisa estar atento ao lançamento diagonal naquele corredor. Na distribuição, o goleiro também usa o lateral aberto como opção de passe pra contornar a pressão central.

**Goleiro + meio-campo (em transição):** ao recuperar a bola, o goleiro é o 'primeiro passador' do contra-ataque — a parceria com um meia ou ponta que arranca em velocidade transforma uma defesa em chance de gol em 3 segundos (o arremesso de mão preciso pro corredor lançado).

#### Exemplos de elite

**Os definidores dos arquétipos modernos (verificado-fetch, temporadas 2023-2026):**

- **Alisson Becker (Liverpool) — o "completo":** considerado por muitos o goleiro mais completo do mundo em 2025, equilibra shot-stopping de elite (taxa de defesa citada em ~76%) com distribuição excelente. É o goleiro que viabiliza o estilo de linha altíssima e gegenpressing do Liverpool — sem a capacidade dele de sair correndo pra cortar bola nas costas e distribuir bem, esse estilo seria impossível. *(verificado-fetch)*

- **Ederson (Manchester City) — o "construtor/playmaker":** o **template do goleiro de saída de bola** sob Guardiola. Distribuição inigualável, lançamento de longa distância cirúrgico e calma sob pressão permitem ao City jogar com linha alta. Tem várias assistências na carreira. Seu shot-stopping às vezes é mais questionado que o de Alisson — o trade-off clássico construtor vs. defensor. *(verificado-fetch)*

- **Manuel Neuer (Bayern) — o pioneiro do sweeper-keeper:** *revolucionou* a função; foi quem popularizou o goleiro agindo como "décimo-primeiro jogador de linha", saindo da área com ousadia e participando da construção. Mesmo passado o auge, seu legado é a base do goleiro moderno. *(verificado-fetch)*

**Outros nomes de referência (consenso):**
- **Marc-André ter Stegen** — outro pilar do goleiro-construtor de posse (escola Barcelona).
- **Jordan Pickford (Everton/Inglaterra)** — exemplo de goleiro de distribuição longa precisa ("bate 75 jardas fácil") mesmo fora de um time de posse dominante. *(verificado-fetch)*
- **Thibaut Courtois** — referência do shot-stopper de elite com altura (1,99 m) e comando de área, perfil menos "varredor" e mais defensor clássico moderno (consenso).
- **Emiliano "Dibu" Martínez** — referência de especialista em pênalti e jogo psicológico em mata-matas (consenso).

**Históricos que definem a linhagem (consenso):** *Lev Yashin* (a "Aranha Negra", precursor do goleiro que saía jogando e dominava a área, anos 1960); *Edwin van der Sar* e *Fabien Barthez* (pioneiros do goleiro de pés bons); *Gianluigi Buffon* e *Iker Casillas* (shot-stoppers/reflexo de elite, Casillas apelidado de "São Iker" pelas defesas-milagre); *Peter Schmeichel* (comando de área e lançamento de contra-ataque); *René Higuita* (o extremo do goleiro-líbero, o caso-limite que mostrou o risco do estilo).

#### Erros comuns / como falha

**Como a posição falha — erros típicos e sinais de mau desempenho:**

- **Indecisão no sair-ou-ficar:** o erro mais clássico. Sai pela metade num cruzamento e não chega (fica em "terra de ninguém"), ou hesita no 1v1. Resultado: gol. Um treinador cobra **decisão clara e precoce** — "ou vai, ou não vai, mas decide".
- **Pânico na saída de bola:** receber sob pressão e perder a bola perto do próprio gol, ou bater um chutão apressado entregando a posse de graça. Sinal de goleiro sem o perfil pro estilo de posse. Treinador cobra **leitura de quando furar curto vs. quando bater longo**.
- **Mau posicionamento de base:** chute que "parecia difícil" mas era difícil só porque ele estava mal posicionado. O bom goleiro faz parecer fácil; o ruim transforma chute defensável em gol por estar no lugar errado/adiantado/atrasado no ângulo.
- **Rebote / pegada insegura (handling ruim):** soltar a bola em vez de encaixar, gerando segunda chance pro adversário. Sinal recorrente de goleiro pressionado/sem confiança.
- **Fragilidade no jogo aéreo:** não sair em cruzamento por medo, ou sair e socar mal. Vira gol de cabeça e sofrimento em todo escanteio. Treinador cobra **comando de área** e voz ("minha!").
- **Falha de comunicação/liderança:** não organizar a barreira, não avisar a marcação, deixar a linha desalinhada. O goleiro silencioso é um problema invisível que aparece em gols evitáveis de bola parada.
- **Erro de leitura da linha alta:** com o time pressionando, não estar adiantado o suficiente e ser superado pelo lançamento nas costas — vira 1v1 ou gol no gol vazio.
- **Falha psicológica em sequência:** tomar um gol bobo e "desabar" no mesmo jogo (o erro que vira dois). Resiliência é parte do ofício.

**O que um treinador de elite cobra acima de tudo:** consistência (não o milagre ocasional, mas o erro zero nas jogadas rotineiras), decisão rápida e clara, e — no futebol moderno — coragem com a bola nos pés. Um goleiro que dá *uma* defesa espetacular mas comete *um* erro de saída por jogo costuma custar mais pontos do que parece.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**ATENÇÃO: tudo abaixo é vocabulário EXPLICATIVO e gerador de hipóteses pra camada "explicar" — o porquê narrativo. NUNCA é edge de aposta nem dica por posição. O número do mercado/quant é a âncora e não se move.**

**Mercado de GOLS (over/under):**
- Um goleiro shot-stopper de elite vs. um goleiro frágil é parte do *contexto* de quantos chutes viram gol. Goleiro de elite ajuda a *explicar* por que um time concede poucos gols apesar de sofrer chutes (a defesa "invisível"). Gancho: "este time tem xGA — *expected goals against*, gols esperados sofridos — historicamente maior que os gols realmente sofridos, o que costuma ser narrado via qualidade do goleiro." *(explicativo, não preditivo)*
- Goleiro frágil no aéreo + adversário forte em bola alçada → hipótese explicativa de onde os gols *tendem* a nascer (cabeça/escanteio), sempre ancorada no número.

**Mercado de ESCANTEIOS:**
- Goleiro de comando aéreo fraco **espalma/soca pra escanteio** mais vezes em vez de agarrar → pode ajudar a *narrar* volume de escanteios de um lado. Goleiro que agarra encerra o lance e gera menos segundo escanteio. *(explicativo)*
- Goleiro de distribuição longa direta (chutão) reduz posse e pode aumentar disputa/segunda bola — contexto pra ritmo de jogo.

**Mercado de CARTÕES:**
- Pouca conexão direta. Indireta: time que perde a bola na saída do goleiro sofre transições e faltas táticas → contexto explicativo frouxo. Não force.

**ASSISTÊNCIAS / props de jogador:**
- Goleiro-construtor (tipo Ederson) tem **assistências** e participações de construção — relevante só pra *explicar* o estilo de jogo direto/longo do time, não como aposta na prop do goleiro.
- O lançamento longo de um goleiro de distribuição é o *primeiro passe* de muitos contra-ataques — contexto pra entender de onde nascem as transições rápidas do time.

**JOGO AÉREO:**
- O goleiro é o principal "redutor de perigo aéreo" do próprio time. Comando de área forte vs. fraco é peça central pra *explicar* a competência defensiva aérea — sempre como narrativa do número, jamais como sinal de aposta.

**Hipótese explicativa transversal:** "Este time joga linha alta e pressão; isso depende de um goleiro-varredor. Se o goleiro titular (varredor) está suspenso e entra um reserva de perfil de linha, o time *pode* recuar a linha — o que muda a geografia de onde os chutes e espaços aparecem." É exatamente o tipo de **gerador de hipótese qualitativa** que enriquece o "explicar" — e que continua subordinado ao que o mercado/quant diz.

---

### Lateral / Full-back (lateral ofensivo, lateral invertido / inverted full-back, lateral-zagueiro)

#### Resumo didático

**O que é.** O lateral é o defensor que joga nas pontas da linha de quatro (ou de três), encostado na linha de fundo lateral do campo. Existem dois: o **lateral-direito** e o **lateral-esquerdo**. Ele é, em essência, um "defensor de corredor": cuida da faixa de campo perto da linha lateral, que é justamente por onde o adversário tenta chegar perto da área pelos cantos (onde costumam jogar os pontas/extremos rápidos).

**Por que a posição existe.** Há um conflito embutido nela que define tudo: o lateral precisa **defender** (marcar o ponta adversário, fechar o cruzamento, evitar que entrem na área pela ponta) e ao mesmo tempo **atacar** (subir a linha lateral, dar largura ao time, cruzar ou entrar na área). Defender exige ficar atrás; atacar exige ir à frente. Nenhuma outra posição de defesa tem essa dupla missão tão extrema. Por isso o lateral moderno é frequentemente o jogador que mais corre no time (em distância total percorrida), porque vive subindo e descendo os ~50 metros do seu corredor.

**Jargão essencial (definido na primeira vez):**
- **Corredor:** o campo dividido em faixas verticais. São três principais — corredor central (miolo) e dois corredores laterais (as "beiradas"). O lateral mora no corredor lateral. Há também o **meia-espaço** (half-space): a faixa intermediária entre o corredor central e o lateral — zona nobre, de onde saem os melhores passes para a área.
- **Largura (amplitude):** "abrir o campo", manter alguém colado na linha lateral para esticar a defesa adversária e criar espaço no meio.
- **Sobreposição (overlap):** o lateral passa por fora do ponta do seu time para receber a bola já na frente dele.
- **Sub-aposição (underlap):** o lateral passa por dentro (pelo meia-espaço), e não por fora.

**Lateral-zagueiro / wing-back: a confusão de nomes.** Quando o time joga com **linha de três zagueiros**, os homens dos corredores deixam de se chamar "laterais" e passam a se chamar **alas (wing-backs)**. O ala é um lateral com ainda mais responsabilidade ofensiva: ele cobre o corredor inteiro praticamente sozinho, de uma área à outra. "Lateral-zagueiro" é o caminho oposto: um lateral que, em certos momentos, recua e vira o terceiro/quarto zagueiro de uma linha de defesa — comum em times que defendem com cinco.

#### Perfil e arquétipos

**Atributos ideais (o "kit" do lateral moderno):**
- **Físico:** resistência aérobica acima da média (é quem mais percorre distância), velocidade e aceleração para duelos de corrida contra extremos rápidos, e capacidade de repetir sprints (fazer 30 piques de alta intensidade por jogo, não só ser rápido uma vez).
- **Defensivo:** marcação 1x1 em espaço aberto (o duelo mais difícil do futebol: campo livre, ponta encarando), tempo de bola/desarme sem cometer falta perto da própria área, e leitura de cruzamento.
- **Ofensivo:** qualidade de cruzamento, controle em velocidade, passe no meia-espaço, e — no perfil moderno — capacidade de jogar por dentro com a bola.
- **Mental:** disciplina posicional (saber QUANDO subir e quando ficar), porque um lateral que sobe na hora errada é o maior gerador de contra-ataque sofrido do futebol.

**Lateralidade — o detalhe que muda tudo:** um lateral **destro na esquerda** (ou canhoto na direita) é um "pé invertido". Ele tende a cortar para dentro no pé bom em vez de cruzar de primeira na linha de fundo. Isso muda o cardápio ofensivo do time inteiro (mais finalização/passe no meia-espaço, menos cruzamento de linha de fundo).

**ARQUÉTIPOS (sub-papéis) — diferença prática:**

**1. Lateral ofensivo clássico (overlapping full-back).** Vive na linha lateral, sobe por fora do ponta, dá largura e cruza. É o "ala disfarçado de lateral". Diferença prática: dá ao time amplitude máxima e volume de cruzamento, mas deixa o corredor exposto na transição. Exige um ponta que jogue por dentro para liberar a linha de fundo. *Arquétipo de: Theo Hernández, Hakimi, Alphonso Davies, Reece James.*

**2. Lateral invertido (inverted full-back).** Quando o time tem a bola, ele NÃO sobe pela linha — ele entra para **dentro**, ao lado do volante, formando um meio-campo extra ("double pivot"). Diferença prática: dá superioridade numérica no meio (ajuda na construção e na proteção contra contra-ataque), e a largura passa a ser dada pelo ponta. Troca cruzamento por controle e estabilidade. É um lateral "de cérebro", não de pernas. *Arquétipo: João Cancelo (sob Guardiola), Trent Alexander-Arnold (no papel inventado por Klopp/Slot), Oleksandr Zinchenko.*

**3. Lateral de cruzamento / "fundo de linha" puro.** Versão menos refinada do nº1: forte de pé bom, vive de levar a bola até a linha de fundo e cruzar. Menos jogo por dentro, mais volume de bola na área. Útil para times que jogam com centroavante de jogo aéreo.

**4. Lateral-zagueiro / lateral defensivo (full-back que vira terceiro/quarto zagueiro).** Recua e fecha. Forte na marcação, bom no jogo aéreo, raramente cruza a linha do meio. Diferença prática: dá segurança total ao corredor e libera o OUTRO lateral para atacar (assimetria: um sobe, o outro segura). *Arquétipo: Dani Carvajal em modo controle, Kyle Walker como "defensor de profundidade".*

**5. Ala (wing-back), na linha de cinco/três.** O atleta híbrido completo: cobre o corredor inteiro sozinho, ataca como ponta e defende como lateral. Exige o físico mais extremo de todos. *Arquétipo: Denzel Dumfries (Inter), Hakimi quando vira ala num 3-4-3, Jeremie Frimpong.*

#### Os 4 momentos do jogo

**1. Organização ofensiva (time com a bola, posicionado).**
- *Lateral clássico:* dá **largura** no seu corredor, fica colado na linha lateral para esticar a defesa adversária e abrir o meio. Sobe na altura do ponta ou além, oferecendo a sobreposição. É a válvula de escape quando o meio está congestionado: o passe lateral "desafoga" a saída de bola.
- *Lateral invertido:* entra por dentro e vira meio-campista temporário. Ajuda a fazer 3 contra 2 na saída de bola contra o pressing adversário e a manter a posse no meio. A largura, nesse caso, vem do ponta. Trent na fase com bola joga "ao lado do volante, na frente de três zagueiros" — esse é o desenho.

**2. Organização defensiva (sem bola, bloco montado).**
- Marca o **ponta/extremo** do seu lado, normalmente em 1x1. Decisão-chave: marcar de perto (agressivo, arriscando ser passado nas costas) ou recuar e "cair" na linha (seguro, mas concede o cruzamento de longe).
- Comprime para dentro quando a bola está no lado oposto, virando quase um terceiro zagueiro do lado fraco (o "bloco" inteiro desliza). Esse deslizamento é o que mantém a linha de quatro compacta.

**3. Transição ofensiva (acabou de recuperar a bola).**
- É um dos principais lançadores de contra-ataque pela ponta: recuperou, arranca pela linha lateral no espaço que o adversário deixou ao atacar. Laterais velozes (Hakimi, Davies) são armas letais aqui, porque correm 60 metros enquanto a defesa adversária está desorganizada.

**4. Transição defensiva (acabou de perder a bola) — o momento mais perigoso para o lateral.**
- Se ele estava subido atacando, há um **buraco gigante** nas suas costas. Ele precisa: (a) fazer falta tática para parar o contra-ataque, (b) sprintar de volta numa corrida de recuperação ("recovery run"), ou (c) confiar que o volante/zagueiro cobre o seu espaço enquanto ele volta. O lateral invertido tem vantagem AQUI: como estava por dentro (não lá na ponta), ele já está mais perto do centro para frear a transição — é a principal razão tática da invenção do papel.

#### Zonas ocupadas e gaps deixados

**Zonas que ocupa:**
- *Defendendo:* o terço final do seu corredor lateral, recuado, na linha de quatro/cinco. Desliza para o meio quando a bola está do outro lado.
- *Atacando (clássico):* sobe todo o corredor lateral até a linha de fundo do adversário — vira praticamente um ponta.
- *Atacando (invertido):* abandona o corredor e ocupa o **meia-espaço/centro**, ao lado do volante.

**O gap que abre — e como o adversário explora:**
O grande espaço exposto pelo lateral é **o corredor nas suas costas** quando ele sobe. Esse é o alvo nº1 do adversário na transição: o ponta contrário fica "guardado" lá na ponta justamente esperando a bola nas costas do lateral que atacou. Times que jogam contra laterais ofensivos deliberadamente deixam um extremo rápido fixo nesse corredor para puni-los no contra-ataque.

Há ainda o **gap entre o lateral e o zagueiro** (o "canal", ou *half-space* defensivo). Quando o lateral sai puxado pelo ponta que abre, abre-se uma fresta entre ele e o zagueiro central — por onde o segundo atacante (um meia infiltrando ou o ponta invertido) ataca em diagonal. Fechar ou não esse canal é uma decisão constante: sair no homem e abrir o canal, ou segurar o canal e dar liberdade ao homem na ponta.

**Assimetria como solução:** muitos times de elite resolvem o dilema fazendo **um lateral subir e o outro segurar** (ex.: lateral-direito ofensivo + lateral-esquerdo que vira terceiro zagueiro). Isso fecha um lado do gap de transição. O lateral invertido é outra solução: ele tapa o próprio buraco ao não ir à ponta.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo.** O lateral costuma ser o jogador **mais baixo** da defesa, então é o elo fraco aéreo da linha. Adversários inteligentes atacam o lado do lateral em cruzamentos e mandam o atacante mais alto disputar contra ele (o famoso "isolar o grandão contra o baixinho no segundo poste"). Na marcação de escanteio por zona, o lateral costuma ficar no **primeiro poste** (cortar a trajetória curta/o cruzamento tenso) ou na **marca do pênalti** próxima, exatamente para tirá-lo do duelo aéreo direto. Na marcação individual, costuma pegar um atacante de estatura menor.

**Jogo aéreo ofensivo.** Pouco relevante para o lateral clássico (ele é o cruzador, não o cabeceador). Mas o **ala (wing-back)** moderno cada vez mais surge no segundo poste em ataques pelo lado oposto — Dumfries, por exemplo, ataca a área e cabeceia (liderou os defensores da Serie A em gols). Esse é um detalhe explicativo importante: alas de linha de cinco geram gol de cabeça vindos do lado contrário.

**Bola parada — papel ofensivo:**
- **Escanteio/falta lateral:** o lateral com bom pé é frequentemente o **batedor** (Trent é o exemplo máximo — sua entrega em bola parada é arma de criação de gol; *consenso* forte). Times com lateral batedor ganham uma fonte extra de gol de bola parada.
- Se não bate, costuma ficar de **vigia ("resto defensivo" / rest-defence)** atrás, junto do zagueiro, prevenindo o contra-ataque após o escanteio — papel invisível, mas decisivo.
- **Lateral/lateral arremesso:** o arremesso lateral longo, quando o lateral tem essa especialidade, vira "quase escanteio".

**Bola parada — papel defensivo:** marca um homem na área ou faz zona no primeiro poste; e é peça central da **linha do impedimento** em faltas (subir a linha no tempo certo para deixar atacantes impedidos).

**Gancho explicativo:** o lado defensivo do lateral (estatura, quem ele marca no escanteio) ajuda a contar por que certos times concedem mais gol de bola parada por um flanco específico; o lado ofensivo (lateral batedor de qualidade) ajuda a explicar volume de escanteios/perigo de bola parada — sempre explicativo, nunca preditivo.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha defensiva.** O lateral é parte da linha de fundo e precisa subir e descer **em sincronia** com os zagueiros. Se a linha é alta (time que pressiona no campo adversário), o lateral também joga alto — o que o coloca longe do próprio gol e amplifica o perigo nas suas costas (espaço para a bola em profundidade). Se a linha é baixa (bloco recuado), o lateral vira quase um quinto defensor, com pouca ambição ofensiva. **Manter a linha** (não atrasar sozinho e deixar o atacante em condição legal) é uma das responsabilidades mais técnicas do lateral — um lateral que "fica plantado" anula o impedimento de toda a defesa.

**Espaço entre linhas.** Quando o time defende com a linha de defesa e a linha de meio-campo afastadas, abre-se o espaço entre linhas onde o meia-atacante adversário recebe de costas. O lateral às vezes é puxado para **subir e marcar** esse homem entre linhas (rompendo a linha), o que abre o corredor às suas costas — um dilema de cobertura constante.

**Pressing / contrapressing / PPDA.** *PPDA (passes permitidos por ação defensiva)* é uma métrica de intensidade de pressing: quanto menor, mais o time pressiona. Times de PPDA baixo (pressing alto) exigem laterais que **pressionam o lateral/ponta adversário lá na frente** e aguentam o 1x1 nas costas — perfil atlético obrigatório. No contrapressing (recuperar imediatamente após perder), o lateral invertido é precioso porque já está central e fecha a primeira saída do adversário. Já um time de bloco baixo "abre mão" do pressing do lateral e pede a ele para apenas segurar o corredor.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**Valoriza, mas controla.** No 4-4-2 puro o lateral é peça-chave do *equilíbrio*: tem cobertura clara do **meia (volante) do seu lado** logo à frente, então pode subir com relativa segurança, pois alguém tapa o corredor. Tarefa principal: dar a largura, porque o 4-4-2 tradicional ataca muito por cruzamento (dois centroavantes esperando na área). O lateral sobe para cruzar e o meia de lado faz a sobreposição/diagonal. **Risco:** se ambos os laterais sobem ao mesmo tempo, o 4-4-2 fica frágil na transição — por isso costuma haver alternância (um sobe, o outro segura). É a formação mais 'natural' e legível para o lateral: papel definido, parceria clara com o meia do flanco. Conecta-se com: meia de lado (parceria de flanco) e centroavantes (alvos de cruzamento).

**4-4-2 em losango (diamante)**

**Sobrecarrega o lateral — é quem dá TODA a largura.** O losango (volante na base, dois meias internos, um camisa 10 na ponta) **não tem pontas/extremos**. Toda a amplitude do time depende dos dois laterais. Eles deixam de ser 'apoio' e viram a única fonte de jogo pelos lados: precisam subir muito, sustentar o corredor inteiro e cruzar. Isso aproxima o lateral do papel de **ala**. **Risco alto:** com os dois laterais lá na frente e sem ponta para cobrir o corredor, a transição defensiva pelos flancos é o calcanhar de Aquiles do losango. Exige laterais de motor enorme e volantes/meias que cubram a diagonal. Valoriza imensamente o lateral ofensivo; pune o lateral lento ou puramente defensivo.

**4-3-3**

**Define o lateral moderno — e cria o jogo de 'quem dá a largura'.** No 4-3-3 há ponta aberto no corredor do lateral. Isso gera a pergunta central do futebol de posse: a largura é do **ponta** ou do **lateral**? Se o ponta fica aberto, o lateral faz a **sub-aposição (underlap)** por dentro, no meia-espaço. Se o ponta corta para dentro (ponta invertido), o lateral sobe por fora e dá a largura (sobreposição). É aqui que floresce o **lateral invertido**: como o 4-3-3 tem só três no meio, um lateral entrando por dentro vira o quarto homem do meio e protege contra a transição. **Parceria definidora:** lateral + ponta (a dança overlap/underlap). Valoriza o lateral inteligente e técnico mais do que qualquer formação.

**4-2-3-1**

**Equilíbrio confortável — sobe com rede de segurança dupla.** Os **dois volantes** ('double pivot') à frente da defesa dão ao lateral a cobertura mais segura de todas as formações. Ele pode subir agressivamente porque, se perder a bola, há dois homens fechando o meio. Conecta-se com o ponta do 3 (a faixa de três atrás do centroavante) na sobreposição. É a formação onde o **lateral ofensivo** rende sem expor demais o time. Frequentemente um lateral é mandado a atacar (lado forte) e o outro a segurar, com os volantes cobrindo. Valoriza o lateral; reduz o risco que outras formações impõem a ele.

**4-1-4-1**

**Sobe com a permissão do volante único — e com mais responsabilidade.** Aqui há **um só volante** (o '1') protegendo a defesa, com quatro meias à frente. Como a proteção central é de um homem só, o lateral precisa ser mais criterioso ao subir: se ele e o volante saem ao mesmo tempo, a defesa fica 3 contra o ataque. Por outro lado, os meias dos lados (na linha de 4) ajudam a cobrir o corredor, criando uma parceria de flanco como no 4-4-2. **Tarefa:** apoiar o ataque sem deixar o único volante isolado. Risco médio-alto na transição. Valoriza o lateral disciplinado e bom de leitura mais do que o puramente ofensivo.

**3-5-2 / 3-4-1-2**

**Transforma o lateral em ALA puro — papel máximo.** Com três zagueiros atrás, o homem do corredor vira **wing-back**: cobre o corredor inteiro sozinho, de área a área. É a formação que mais exige fisicamente da posição e a que mais a valoriza ofensivamente — o ala é, muitas vezes, o jogador mais decisivo do time (Dumfries no Inter é o exemplo: gols, cruzamentos, presença de área). Como há três zagueiros, há sempre cobertura quando o ala sobe (um zagueiro de canto desliza), o que dá liberdade ofensiva enorme com rede de segurança. **Parcerias:** ala + meia interno do seu lado (sobrecarga de flanco) e ala + os dois atacantes. Sem pontas, os alas são a largura inteira do time. Exige o perfil mais completo e atlético de todos.

**3-4-3 / 3-4-2-1**

**Ala ofensivo de altíssimo volume — quase um ponta.** Semelhante ao 3-5-2 (três zagueiros, alas cobrindo o corredor), mas com mais homens ofensivos à frente (3-4-3) ou dois meias-pontas (3-4-2-1). Aqui o ala sobe ainda mais alto, frequentemente alinhado com o ataque, porque os meias-internos (os '2' do 3-4-2-1) jogam por dentro nos meia-espaços e abrem o corredor para o ala. Resultado: o ala vira praticamente um extremo, com cruzamento e chegada de área. **Risco:** três zagueiros precisam cobrir muito espaço quando os dois alas atacam juntos; transição perigosa se o trio de zaga for lento. Valoriza enormemente o ala ofensivo/de cruzamento.

**5-3-2 / 5-4-1 (bloco de 5)**

**Apaga o lado ofensivo — o lateral vira defensor de corredor.** Este é o 3-5-2 'em modo defensivo': quando o time não tem a bola, os dois alas **recuam e formam uma linha de cinco**. Aqui o homem do corredor é, antes de tudo, um **lateral-zagueiro**: fecha o cruzamento, marca o ponta, e quase não sobe. O 5-4-1 é ainda mais conservador (quatro no meio). A função vira segurança: dar à defesa uma muralha de cinco sem buracos de corredor. **Quando explode para frente:** só em transições pontuais, virando 3-5-2 ofensivo por segundos. É a formação que mais **apaga** o lateral ofensivo e mais valoriza o lateral defensivo, forte na marcação e no jogo aéreo. Times que defendem campeonato/seguram resultado vivem disso.

**4-3-1-2 (sem pontas)**

**Outra vez o lateral é a ÚNICA largura — como no losango.** O 4-3-1-2 (quatro defensores, três meios, um camisa 10, dois atacantes) não tem extremos. Toda a amplitude depende dos laterais, igual ao diamante. Eles têm de subir muito para alargar um time que, por desenho, é estreito e concentrado no miolo. **Diferença para o losango:** a linha de três do meio (em vez do losango) tende a dar cobertura ligeiramente melhor ao corredor. Ainda assim, a transição pelos lados é o ponto frágil, e a sincronia 'um sobe / um segura' é vital. Valoriza o lateral ofensivo de muito fôlego e bom cruzamento, porque é dele que sai quase toda a bola de fora para a área.

#### Parcerias-chave

**Lateral + ponta/extremo (a parceria definidora).** É a relação mais importante. Os dois ocupam o mesmo corredor, então têm de se revezar entre **dentro e fora**: se o ponta abre, o lateral entra por dentro (underlap); se o ponta corta para dentro, o lateral sobe por fora (overlap). Quando essa rotação funciona, o corredor vira uma sequência de 2x1 contra o lateral adversário. Quando não funciona, os dois 'pisam no mesmo espaço' e o ataque trava. Ponta invertido (canhoto na direita) + lateral que sobe por fora = combinação clássica de elite (Salah + Trent foi o arquétipo).

**Lateral + volante (a parceria de segurança).** O volante do lado é quem **cobre o buraco** quando o lateral sobe. Sem essa cobertura, todo lateral ofensivo é um suicídio tático. No caso do lateral invertido, a relação inverte: o lateral é que vira parceiro do volante no meio, formando o double pivot.

**Lateral + zagueiro do seu lado.** Comunicação constante sobre o **canal** entre eles (quem fecha a diagonal, quem sai no homem). Quando o lateral sobe, o zagueiro desliza para cobrir; numa linha de três, o zagueiro de canto faz esse deslize automaticamente — por isso a linha de três 'liberta' o ala.

**Os dois laterais entre si (a assimetria).** Raramente atacam juntos com tudo. O padrão de elite é **um sobe, o outro segura** — combinação cruzada com o resto do time (lado forte/lado fraco). Decidir qual lado ataca é uma escolha de jogo inteira.

**Lateral + camisa 10 / meia interno (em formações sem ponta).** No losango, 3-4-1-2 e 4-3-1-2, o lateral 'troca de função' com os meias internos: eles seguram o meio enquanto o lateral é a largura. A sintonia aqui define se o time consegue ou não criar pelos lados sem pontas.

#### Exemplos de elite

**ATUAIS (2023-2026):**
- **Achraf Hakimi (PSG)** — *verificado-fetch*: melhor lateral-direito do mundo no ciclo recente, 6º no Ballon d'Or de 2025, gols na semi e na final da Champions 2024-25. Arquétipo do **lateral/ala ofensivo veloz** que é arma de transição e chegada de área.
- **Theo Hernández** — *verificado-fetch*: lateral-esquerdo 'foco do ataque', média altíssima de conduções progressivas (~7,9/jogo). Arquétipo do **lateral que carrega a bola** e inicia o ataque conduzindo.
- **Denzel Dumfries (Inter)** — *verificado-fetch*: arquétipo do **ala completo** no 3-5-2; liderou defensores da Serie A em gols (sete), referência de chegada de área e jogo aéreo ofensivo vindo do corredor.
- **Trent Alexander-Arnold** — *verificado-fetch*: arquétipo do **lateral invertido / lateral-criador**; no papel inventado por Klopp ele entrava 'ao lado do volante, à frente de três zagueiros' na fase com bola, e é referência mundial em **bola parada/entrega de passe**. (Nota de contexto, *verificado-fetch*: viveu fase difícil no Real Madrid em 2025-26, papel secundário e lesões — exemplo do arquétipo, não juízo de forma atual.)
- **Alphonso Davies (Bayern)** — *consenso*: arquétipo do **lateral-esquerdo de velocidade pura** e recuperação atlética, transição ofensiva e defensiva de elite.
- **Reece James (Chelsea)** — *consenso*: arquétipo do **lateral-direito de potência** com cruzamento e bola parada de alto nível, frequentemente híbrido lateral/ala.

**HISTÓRICOS (definem arquétipos):**
- **Cafu e Roberto Carlos** — *consenso*: o par que definiu o **lateral ofensivo moderno** brasileiro (motor inesgotável + ataque pelo corredor inteiro). Roberto Carlos = lateral-esquerdo de potência e bola parada.
- **Paolo Maldini / Philipp Lahm** — *consenso*: arquétipo do **lateral inteligente e defensivamente impecável**; Lahm em especial migrou para o invertido/meio sob Guardiola, prenunciando o papel moderno.
- **João Cancelo (sob Guardiola no City)** — *consenso*: o protótipo público do **lateral invertido** que vira meio-campista com a bola.
- **Dani Alves** — *consenso*: arquétipo do **lateral-ponta** na parceria com Messi no Barça (overlap/underlap elevado a arte).

#### Erros comuns / como falha

**Como a posição falha (erros típicos e o que o treinador cobra):**

1. **Subir na hora errada (timing de apoio).** O erro nº1: o lateral ataca quando o time não tem o meio controlado e, ao perder a bola, deixa o corredor aberto para o contra-ataque. Sinal de mau desempenho: gols/chances sofridos repetidamente nas costas do lateral. O treinador cobra **'leia o momento de subir'** e disciplina de rest-defence.

2. **Ser passado no 1x1 em campo aberto.** Marcar mal o ponta — sair com o corpo errado, atacar a bola e ser driblado, ou deixar virar para o pé bom. Em campo aberto isso vira chance limpa de cruzamento ou de entrada na área.

3. **Largar o homem entre linhas / não fechar o canal.** Ou o lateral sai longe demais no ponta e abre o canal interno, ou fica preso ao canal e deixa o cruzador livre. Escolher errado entre os dois é falha de leitura.

4. **Não sustentar a linha de impedimento.** Atrasar sozinho e anular o impedimento de toda a defesa — erro técnico que custa gols evitáveis e enfurece o treinador, porque estraga o trabalho coletivo.

5. **Cruzamento ruim / decisão pobre no último terço.** Subir muito e desperdiçar: cruzar para ninguém, na primeira trave, ou insistir no cruzamento quando o passe rasteiro estava livre. Lateral que 'sobe muito e produz pouco' é gasto de energia sem retorno.

6. **Fragilidade aérea explorada.** Por ser o mais baixo da linha, é alvo de cruzamentos direcionados ao seu lado. Falha quando não posiciona o corpo ou perde o duelo no segundo poste.

7. **Indisciplina nos dois laterais subindo juntos.** Falha coletiva, mas que recai sobre os laterais: sem a alternância 'um sobe, um segura', o time fica permanentemente exposto na transição.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

Esta seção lista o que a posição **ajuda a EXPLICAR** (o 'porquê' narrativo do jogo), sempre como **vocabulário explicativo-não-preditivo**, ancorado no número do mercado/quant — nunca apresentado como edge ou dica.

- **Escanteios.** Lateral ofensivo de alto volume de cruzamento → mais cruzamentos bloqueados/desviados, que geram escanteios. **Ajuda a EXPLICAR** por que um time/flanco específico tende a produzir muitos escanteios. Inverso: lateral que joga por dentro (invertido) cruza menos e tende a gerar menos escanteio por aquele lado. (Explicativo, jamais preditivo.)

- **Cartões.** O lateral ofensivo que sobe e perde a bola é o maior cliente de **falta tática** na transição (cartão amarelo por parar contra-ataque). Marcar 1x1 em campo aberto contra ponta veloz também eleva risco de falta/cartão. **Ajuda a EXPLICAR** acúmulo de cartões por um lado do campo.

- **Gols / jogo aéreo defensivo.** Sendo o mais baixo da linha, o lado do lateral costuma ser o **alvo de cruzamento** adversário. **Ajuda a EXPLICAR** por que certos times concedem mais perigo (e gols) por um flanco específico.

- **Assistências e gols (props de jogador).** Lateral/ala ofensivo é fonte legítima de assistência (cruzamento) e até de gol (ala chegando no 2º poste, como Dumfries). Lateral batedor de bola parada (perfil Trent) concentra criação de chance. **Ajuda a EXPLICAR** de onde vem a criação do time, e qual jogador tende a aparecer em chutes/assistências — sempre como narrativa do estilo, **ancorada no número que o mercado já tem**, nunca como recomendação de prop.

- **Volume de cruzamentos / chutes do time.** Times sem ponta (losango, 4-3-1-2) dependem do lateral para toda a largura → o estilo do lateral molda de onde vêm os cruzamentos e a forma do ataque. **Ajuda a EXPLICAR** o padrão ofensivo, não a prevê-lo.

**Regra transversal:** todos os ganchos acima são **geradores de hipótese e linguagem de contexto** para a camada EXPLICAR. O número do mercado/quant é a âncora e não se move; a leitura tática só dá o 'porquê'.

---

### Ala / Wing-back (alas de sistemas com linha de 5 ou 3 zagueiros)

#### Resumo didático

**O que é, em uma frase:** o ala (em inglês *wing-back*, abreviado WB) é o jogador que cobre toda a faixa lateral do campo — de uma ponta à outra, da própria área até a área adversária — em times que jogam com **três zagueiros**. Ele é, ao mesmo tempo, o lateral (defensor da beirada) e o ponta (atacante da beirada), as duas funções fundidas numa pessoa só.

**Por que ele existe:** quando um time abre mão de um quarto defensor e joga com só 3 zagueiros no fundo, ele "sobra" um jogador para usar no meio ou no ataque — mas paga um preço: as laterais (os corredores junto à linha de fundo, chamados *corredores laterais*) ficam descobertas, porque não há mais laterais fixos ali. O ala é a solução: ele desce a faixa toda. Em um quadro defensivo, ele recua e vira o 4º e o 5º defensor (por isso se diz que o time "vira uma linha de 5"); com a bola, ele sobe e vira praticamente um ponta, dando largura (*amplitude*) e cruzamentos.

**A diferença para o lateral comum:** o lateral de uma linha de 4 sempre tem um companheiro de zaga ao lado e joga "protegido". O ala não — atrás dele há só os 3 zagueiros, mais espalhados. Por isso o ala precisa correr **muito mais** (é a posição que mais percorre quilômetros em campo), ter motor físico de maratonista e ser bom nas duas pontas do ofício: defender 1x1 na beirada e atacar 1x1 na beirada. É uma posição cruel fisicamente e, taticamente, é o **termômetro** do sistema de 3 zagueiros: se os alas não dão conta, o time inteiro encolhe e some pelos lados.

**Jargão que vou usar adiante (defino aqui):** *amplitude/largura* = ocupar a faixa junto à linha lateral, esticando o time horizontalmente; *meia-largura/half-space* = o corredor intermediário entre o meio e a linha lateral; *overlap* = ultrapassar o companheiro por fora; *underlap* = ultrapassar por dentro; *cobertura/basculação* = o time deslizar em bloco para o lado da bola.

#### Perfil e arquétipos

**Atributos ideais (a tríade física-técnica-mental):**

- **Físico:** o atributo número 1 é **resistência aeróbica + repetição de sprint** (capacidade de fazer corrida de 60-70m em alta intensidade, recuperar, e repetir 30-40 vezes por jogo). Sem motor, o ala não existe — ele cobre a maior distância média de qualquer posição. Em segundo, **velocidade de recuperação** (voltar correndo quando perde a bola lá na frente). Estatura média/alta ajuda no jogo aéreo defensivo, mas não é eliminatória.
- **Técnico:** **cruzamento** (de fundo, de meia-distância e rasteiro/tenso), **controle em velocidade** (receber correndo), **1x1 ofensivo** (drible ou proteção de bola na beirada) e **1x1 defensivo** (postura de marcação, temporização). Pé bom para cruzar é quase obrigatório.
- **Mental:** **leitura de quando subir e quando ficar** (timing) — o erro mais caro do ala é subir na hora errada e deixar o flanco aberto na transição. Disciplina posicional e capacidade de tomar a decisão certa cansado, no minuto 80.

**Arquétipos (sub-papéis) — a diferença prática importa muito:**

1. **Ala-ofensivo / quase-ponta (touchline winger).** Vive colado na linha lateral, alto, é a principal fonte de cruzamento e de 1x1. Defende com a ajuda de basculação do bloco. *Diferença prática:* é tratado quase como um atacante; o time aceita que ele defenda menos e recupere atrasado, cobrindo o buraco com o trio de zaga e o volante. Ex. arquétipo: Dimarco/Dumfries no Inter.

2. **Ala-completo / box-to-box (two-way wing-back).** O ideal teórico: sobe e desce a faixa inteira com igual competência. Raro porque exige um motor sobre-humano. É o ala que sustenta sistemas que sobem os dois alas ao mesmo tempo.

3. **Ala invertido / inside wing-back (modelo Pep).** Em vez de abrir na linha, ele **entra para dentro**, ocupando a meia-largura ou até o meio como um volante extra na construção (forma de "caixa" no meio-campo). *Diferença prática:* dá superioridade numérica central e controle de bola, mas abdica do cruzamento clássico e da amplitude — quem dá largura passa a ser o ponta. Exige inteligência tática mais que velocidade.

4. **Ala-zagueiro / defensivo (defensive wing-back).** Usado em blocos de 5-3-2/5-4-1: prioriza fechar, marcar e cobrir. Sobe pouco, ataca em transição rápida ou não ataca. *Diferença prática:* é quase um 5º defensor; o time não conta com ele para criar.

5. **Ala-canhoto invertido vs ala-destro aberto (pé trocado).** Um ala canhoto na direita (ou destro na esquerda) corta para dentro e finaliza/passa com o pé bom — bom para chutes e passes em diagonal, ruim para cruzamento de fundo de linha. O ala de pé natural protege a linha e cruza de fundo. Times de elite frequentemente montam **alas assimétricos**: um aberto que cruza, outro invertido que entra.

#### Os 4 momentos do jogo

**1) Organização ofensiva (com a bola, jogo montado):** o ala é o provedor de **amplitude máxima** — fica colado na linha lateral para esticar o bloco adversário horizontalmente e abrir espaço entre os marcadores. Funções típicas: sustentar a posse pelo lado, dar o cruzamento (de fundo ou recuado), fazer o 1x1, e — no modelo invertido — entrar para dentro e virar uma opção de passe central. Como há 3 zagueiros segurando atrás, **os dois alas podem subir simultaneamente**, dando ao time uma frente de ataque larguíssima (efetivamente 5 homens na linha ofensiva: 2 alas + 2 atacantes + 1 meia). É a grande vantagem ofensiva do sistema de 3.

**2) Organização defensiva (sem a bola, adversário montado):** o ala **recua e o time vira uma linha de 5** (3 zagueiros + 2 alas). Ele marca o ponta/lateral adversário do seu lado, controla o homem mais aberto e impede o cruzamento. Aqui mora a tensão central da posição: quanto mais alto ele defende (pressão), mais espaço deixa nas costas; quanto mais baixo, mais o time recua e convida pressão. Em bloco baixo, os 5 atrás formam uma muralha difícil de furar pelos lados.

**3) Transição ofensiva (acabou de recuperar a bola):** o ala é uma **válvula de escape e uma arma de contra-ataque** — quando o time rouba a bola, ele dispara pela faixa que costuma estar livre (porque o lateral adversário subiu). A largura dele estica a defesa adversária em recomposição e cria o espaço para o contra-ataque vertical. Em duplas de ataque (3-5-2), o ala que sobe rápido vira o terceiro homem do contragolpe.

**4) Transição defensiva (acabou de perder a bola):** é o **momento mais perigoso para o ala** e o que mais separa o bom do ruim. Se ele estava subido e o time perde a bola, o flanco fica escancarado e o adversário ataca exatamente esse corredor. O ala precisa de: (a) *timing* para não estar subido na hora errada, (b) velocidade de recuperação para voltar 50-60m, e (c) coordenação com o zagueiro do seu lado, que sai para cobrir provisoriamente enquanto o ala recompõe. Times bem treinados protegem essa transição com um volante que desliza para a faixa e "segura" o contra-ataque até o ala chegar.

#### Zonas ocupadas e gaps deixados

**Corredores que ocupa:** o ala é o dono do **corredor lateral** (a faixa junto à linha de cal) do seu lado, da própria linha de fundo até a do adversário. No modelo invertido, ele migra para a **meia-largura/half-space** (o corredor entre o lateral e o miolo) ou até o centro.

**Espaço que abre (a favor):** ao colar na linha, ele **fixa** o lateral/ponta adversário lá fora e abre a meia-largura para um meia ou para o atacante diagonalizar por dentro. Dois alas largos esticam a última linha adversária, alargando os intervalos entre os zagueiros — é assim que o sistema de 3 cria espaço central para os atacantes.

**Espaço que deixa exposto (o preço):** **as costas do ala**, ou seja, o espaço entre ele e o zagueiro do seu lado quando ele sobe. Esse é o buraco clássico do sistema de 3 zagueiros. Quando o ala sobe, o trio de zaga precisa **deslizar para o lado** (basculação) — e isso, por sua vez, abre o flanco oposto. Daí a regra: **os dois alas raramente sobem ao mesmo tempo na fase defensiva**; quando um sobe, o outro recua para fechar a linha de 5.

**Como o adversário explora a ausência:**
- **Trocar o jogo rápido (switch):** atacar o lado contrário ao da bola, onde o ala recuou para dentro e o flanco está aberto. A bola longa diagonal é o antídoto clássico contra sistemas de 3.
- **Atacar as costas do ala subido:** lançamento ou passe em profundidade no corredor que ele deixou, forçando o zagueiro a sair da zona (e abrindo o miolo).
- **Sobrecarregar o lado do ala (2x1):** colocar lateral + ponta no mesmo flanco para isolar o ala e fazê-lo escolher quem marcar — se ele erra a decisão, sai cruzamento livre.
- **Atrair e fixar o ala alto para depois lançar nas costas dele:** típico de quem joga contra um ala muito ofensivo e indisciplinado.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo:** na linha de 5, o ala fecha o **primeiro pau** ou marca o homem mais aberto no esquema de cruzamento adversário. Não costuma ser o cabeceador principal (esse é o zagueiro), mas precisa ganhar o duelo aéreo com o ponta/lateral adversário e, sobretudo, **impedir o cruzamento na origem** — defesa aérea começa em não deixar a bola subir. Alas altos e fortes (tipo Dumfries) viram quase um zagueiro extra em cruzamentos.

**Jogo aéreo ofensivo:** geralmente o ala é **quem cruza, não quem cabeceia**. Em sistemas de 3 com dois atacantes (3-5-2), o ala alimenta as duas referências de área com bola alta. Quando o cruzamento vem do lado oposto, o ala do lado de longe pode **aparecer no segundo pau** (back-post run) como finalizador surpresa — um padrão muito usado (Dumfries chegando de trás no Inter é o exemplo de manual).

**Bola parada — ataque:**
- **Escanteios/faltas laterais:** o ala costuma ser **batedor** (especialmente os de pé bom, como Dimarco em faltas e escanteios) ou marcador da quebra/curto. Alguns alas são a principal arma de bola parada do time.
- **Laterais (arremesso):** o ala arremessa e recebe os laterais ofensivos do seu lado; em times com arremesso longo, ele é o ponto de origem.
- **Posicionamento de resto/segunda bola:** alas frequentemente ficam "soltos" fora da área para recuperar a segunda bola e impedir o contra-ataque após escanteio — papel de equilíbrio.

**Bola parada — defesa:** na marcação de escanteio, o ala costuma cobrir um poste ou marcar um homem na zona; pela velocidade, é candidato natural a **vigia do contra-ataque** (ficar adiantado para sair no contragolpe se o time recuperar). Sua disciplina aqui evita gols em transição pós-escanteio defendido.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha defensiva:** o ala é parte da última linha quando recua, então a altura do bloco define a vida dele. Com **linha alta + pressão**, o ala sobe para pressionar o portador adversário no flanco e marca de frente — mas aceita risco enorme nas costas (lançamento em profundidade). Com **linha baixa / bloco de 5**, o ala vira praticamente lateral de uma linha de 5 compacta, prioriza fechar e quase não cruza a linha do meio na defesa.

**Espaço entre linhas:** quando o ala dá amplitude alta, ele **alarga a linha adversária** e abre o espaço entre a defesa e o meio do oponente — é onde o meia/segundo atacante recebe entre linhas. Ou seja, a largura do ala é o que *gera* o espaço entre linhas para os jogadores de dentro. No modelo invertido, ele faz o oposto: encolhe para dentro, fortalece o meio e deixa a amplitude para o ponta.

**Pressing e contrapressing (e PPDA):** *PPDA* (passes permitidos por ação defensiva — quanto menor, mais o time pressiona) cai bastante quando o ala participa do pressing alto, porque ele fecha a saída pelo lado e força o erro. O ala é o **gatilho de pressão lateral**: quando a bola vai para o lateral adversário, é o ala quem salta para pressionar, e o time inteiro bascula atrás dele. No contrapressing (recuperar logo após perder), o ala alto é peça-chave para sufocar a primeira saída — mas, se a pressão falha, é o flanco dele que vira a autoestrada do contra-ataque. Equilíbrio entre agressividade no pressing e proteção da transição é a competência-mestra da posição.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**A posição quase não existe aqui — esta formação a APAGA.** O 4-4-2 tem linha de 4 zagueiros, então quem ocupa o flanco é o **lateral** (com um meia-lateral à frente) e não o ala. A diferença prática é enorme: o lateral do 4-4-2 sempre tem zagueiro ao lado e um companheiro de meio à frente, joga 'protegido' e sobe com parcimônia; o ala do sistema de 3 cobre a faixa sozinho. Quando um time de 3 zagueiros enfrenta um 4-4-2, o tema tático é justamente que **os alas costumam ficar livres**, porque o 4-4-2 tem só 2 homens de meio fechando o miolo e os pontas precisam decidir se largam o flanco para ajudar dentro. Conclusão: num 4-4-2 não há ala; se você lê 'ala' numa escalação 4-4-2, é gíria imprecisa para 'lateral' ou 'meia-lateral'.

**4-4-2 em losango (diamante)**

**Também não há ala — e o losango é o cenário que mais SOFRE com a falta dele.** O 4-4-2 losango (volante na base, dois meias nos lados do losango, um meia-armador na ponta) é **estreito por definição**: concentra 4 meias no miolo e abre mão da largura. Quem dá a largura são os **laterais** da linha de 4, não alas. O losango depende desesperadamente de os laterais subirem para dar amplitude, senão o time fica todo amontoado no centro e fácil de fechar. Por isso, quando um time de losango enfrenta um sistema de 3 zagueiros com alas largos, costuma apanhar pelos flancos: os alas adversários atacam exatamente o espaço que o losango deixa vazio nas pontas. Resumo: posição inexistente nesta formação, e sua ausência estrutural é a maior fraqueza do diamante.

**4-3-3**

**Sem ala — a largura ofensiva é dos pontas (extremos), e a defensiva dos laterais.** No 4-3-3, o flanco é dividido entre o **ponta** (que dá amplitude e ataca o 1x1) e o **lateral** (que defende e às vezes sobe por baixo/overlap). É a divisão de trabalho oposta à do ala, que faz as duas coisas sozinho. Relevância tática: quando um time de 3 zagueiros (com alas) enfrenta um 4-3-3, surge o duelo clássico **ala x ponta** — o ala precisa segurar o extremo driblador sem largar a marcação, e o time de 3 frequentemente tem vantagem numérica no flanco (ala + zagueiro de fora contra ponta + lateral). Se você ouvir 'ala' num 4-3-3, é uso impreciso para 'ponta' ou 'lateral'.

**4-2-3-1**

**Não há ala — flanco coberto por ponta (na linha dos 3) + lateral (na linha de 4) com proteção dupla de volantes.** O 4-2-3-1 é a estrutura mais 'segura' para o lateral subir, porque os **dois volantes** dão cobertura ao espaço que ele deixa. Ainda assim, é lateral + ponta, não ala. O contraste prático: o lateral do 4-2-3-1 pode atacar sabendo que há dois homens segurando o miolo atrás; o ala do sistema de 3 não tem essa rede de segurança dupla. Em jogos 3-zagueiros x 4-2-3-1, o duelo de flanco vira ala x ponta, e o meia-armador (o '10') costuma atacar a meia-largura que o ala adversário abandona ao subir.

**4-1-4-1**

**Sem ala — flanco com lateral (linha de 4) + meia-lateral (na linha de 4 do meio).** O 4-1-4-1 tem um único volante de contenção e uma linha de 4 no meio que inclui dois homens de lado. A largura vem do lateral subindo e do meia-de-lado abrindo. É uma estrutura defensivamente sólida (o '1' protege a zaga), mas a subida do lateral é mais arriscada que no 4-2-3-1 porque há só um volante cobrindo. Relevância para o ala: quando um time de 3 enfrenta o 4-1-4-1, o ala costuma ter espaço para subir porque o meia-lateral adversário tende a fechar para dentro para ajudar o volante único — abrindo o corredor para o ala atacar.

**3-5-2 / 3-4-1-2**

**O HABITAT NATURAL E MÁXIMO do ala — esta formação o VALORIZA ao extremo.** Aqui o ala não é detalhe, é estrutura: os **dois alas são os ÚNICOS provedores de largura do time inteiro**, porque por dentro há um miolo compacto (3 ou 4 meias) e dois atacantes centralizados. Sem os alas, o 3-5-2 é completamente sem largura e fácil de fechar. Tarefas: cobrir a faixa inteira, dar amplitude alta com a bola, cruzar para os dois atacantes, e recuar para formar a linha de 5 sem a bola. Liberdade: máxima para subir — é esperado que cheguem à linha de fundo. Risco: máximo nas costas, porque com 2 pontas-de-lança o time fica preso ao apoio dos volantes para proteger a transição. Conexões: ala + atacante do seu lado (combinações e cruzamento), ala + volante de mesmo lado (cobertura na transição). O 3-4-1-2 acrescenta um '10' que ataca a meia-largura que o ala abre. É a formação onde os melhores alas do mundo brilham (Inter de Inzaghi com Dimarco/Dumfries é o retrato-padrão).

**3-4-3 / 3-4-2-1**

**Também VALORIZA o ala, mas divide a largura com o ataque — papel mais equilibrado.** No 3-4-3 (com 3 atacantes / pontas) os alas têm um **parceiro de flanco** (o ponta do seu lado), então podem alternar: às vezes o ala sobe e o ponta entra na meia-largura, às vezes o inverso. Isso permite ao ala defender um pouco mais e atacar com sobreposições, em vez de ser a única largura como no 3-5-2. No 3-4-2-1 (dois meias-atacantes atrás de um '9'), os alas voltam a ser a largura principal, porque os dois '10' jogam por dentro — papel mais parecido com o do 3-5-2. Risco nas costas continua, mas há mais homens à frente para o contrapressing. É a base de times como Brighton/Brentford na Premier League, que usam o 3-4-3 para criar overloads (superioridade numérica) nos flancos com ala + ponta.

**5-3-2 / 5-4-1 (bloco de 5)**

**O ala em modo DEFENSIVO — a formação o usa mais para fechar do que para criar.** O 5-3-2 e o 5-4-1 são a mesma família do 3-5-2/3-4-3, mas com a mentalidade invertida: o time já começa com a linha de 5 montada (os alas recuados como 4º e 5º defensores) e só transforma em 3-5-2 quando ataca. O ala aqui é, na prática, um **ala-zagueiro**: prioriza marcar o flanco, fechar cruzamento, basculação compacta. Ele sobe pouco e quase só na transição rápida (contra-ataque). No 5-4-1, com 4 no meio, o ala tem ainda menos liberdade ofensiva, porque o time monta um muro de 5+4. É a configuração de quem defende um resultado ou enfrenta favorito: o ala vira um defensor a mais e a criação fica para os contra-ataques. Quem tem alas velozes (tipo um ala que vira ponta na transição) sofre menos com a perda de poder ofensivo dessa armação.

**4-3-1-2 (sem pontas)**

**Sem ala — mas é o cenário onde a AUSÊNCIA de largura mais pesa, parente do losango.** O 4-3-1-2 tem linha de 4 atrás (logo, laterais e não alas) e nenhum ponta na frente (dois atacantes centrais + um '10'). Como o 4-4-2 losango, é **estreitíssimo**: toda a largura depende dos **laterais** subindo — eles são obrigados a virar quase-alas no ataque, senão o time não tem nenhuma amplitude. Relevância para a posição: quando um time de 3 zagueiros com alas largos enfrenta o 4-3-1-2, costuma dominar os flancos, porque o 4-3-1-2 não tem ninguém estruturalmente posicionado na faixa para conter o ala adversário — os laterais ficam num 1x1 desprotegido contra alas que sobem com apoio. Conclusão: posição inexistente aqui, e a fragilidade de flanco do 4-3-1-2 é justamente o que os alas adversários exploram.

#### Parcerias-chave

**As relações-chave do ala (sem elas, a posição não funciona):**

- **Ala + zagueiro do seu lado (o de fora do trio):** a parceria de sobrevivência. Quando o ala sobe, o zagueiro de fora desliza para cobrir a faixa; quando o ala fica, o zagueiro segura mais central. A comunicação e o entrosamento entre os dois definem se as costas do ala viram buraco ou não. É a dupla que decide quem 'segura' o atacante adversário na transição.

- **Ala + volante de mesmo lado:** o volante (no 3-5-2, um dos três meias) é a **rede de segurança** do ala. Quando o ala sobe e o time perde a bola, é o volante que desliza para a faixa e 'segura' o contra-ataque até o ala recompor. Em construção, o volante dá a passagem para o ala subir e oferece a opção de tabela.

- **Ala + atacante/ponta do seu lado:** a sociedade ofensiva. No 3-5-2, o ala cruza para os atacantes e troca passes em diagonal; no 3-4-3, ala + ponta fazem o **overload de flanco** (2x1 contra o lateral adversário), alternando quem abre e quem entra (rotação). No modelo invertido, é o ponta quem abre e o ala quem entra — papéis trocados.

- **Ala + ala (o do lado oposto):** parceria à distância e de equilíbrio. Os dois quase nunca sobem juntos na fase defensiva — quando um ataca, o outro recua para formar a linha de 5. Em ataque montado, o ala do lado contrário ao da bola faz a **corrida de segundo pau** para finalizar cruzamentos (o padrão Dumfries chegando de trás).

- **Ala + meia-armador / '10' (no 3-4-1-2 / 3-4-2-1):** o ala abre a meia-largura que o '10' ataca por dentro; em troca, o '10' ocupa o marcador central e libera o ala para o 1x1 externo. Relação de espaços recíprocos.

#### Exemplos de elite

**Atuais (2023-2026) — `verificado-fetch` para os fatos de função abaixo:**

- **Federico Dimarco (Inter, esquerda):** arquétipo do **ala-ofensivo técnico/batedor**. Pé esquerdo excepcional, é fonte de cruzamentos de profundidade média e arma de bola parada (escanteios/faltas) do Inter; participa da construção mais baixa e lança em profundidade (`verificado-fetch`). É o modelo de ala que define o 3-5-2 moderno de Inzaghi.
- **Denzel Dumfries (Inter, direita):** arquétipo do **ala-completo físico/box-to-box** com chegada de segundo pau. Dá largura vertical colado na linha, faz *underlaps* diagonais visando o poste mais distante, e vira quase um zagueiro extra no jogo aéreo defensivo pela estatura (`verificado-fetch`). A dupla Dimarco/Dumfries é o retrato-padrão da assimetria de alas (um técnico-batedor à esquerda, um físico-finalizador à direita).
- **Piero Hincapié e Daniel Muñoz (Premier League, 2025-26):** citados entre os melhores laterais/alas — Muñoz (Crystal Palace) com bom xA, xG sem pênalti e toques na área adversária, típico de ala que ataca; perfis confirmados em rankings de desempenho da temporada (`verificado-fetch`).
- **Achraf Hakimi (PSG/Marrocos, direita):** `consenso` — referência de **ala/lateral de motor extremo e velocidade pura**, talvez o melhor do mundo no ataque do corredor em transição.
- **Theo Hernández:** `consenso` — ala-completo de corrida vertical devastadora, com chegada de finalização.

**Históricos (definidores de arquétipo, `consenso`):**

- **Cafu e Roberto Carlos (Brasil 2002, 3-5-2):** os definidores eternos do ala brasileiro — Cafu como ala-completo incansável à direita, Roberto Carlos como ala-ofensivo de potência e bola parada à esquerda. O título de 2002 com 3 zagueiros é o monumento da posição.
- **Antonio Cassano-era / Maicon (Inter de Mourinho):** Maicon como ala-direito de força e cruzamento.
- **Marcelo (Real Madrid):** `inferência` — embora majoritariamente lateral de linha de 4, redefiniu o ala-ofensivo criativo quando usado em 3 atrás.
- **Philipp Lahm:** `consenso` — protótipo do **ala/lateral invertido inteligente** sob Guardiola, antes do conceito virar moda.

#### Erros comuns / como falha

**Como a posição falha (o que um treinador de elite cobra):**

- **Subir na hora errada (timing de transição):** o erro mais caro. O ala está adiantado quando o time perde a bola, e o flanco vira autoestrada para o contra-ataque adversário. Sinal de mau desempenho: o time leva gols/chances repetidas pelo corredor do ala. Um treinador cobra: 'leia o jogo, não suba se não temos cobertura'.

- **Não recompor (falta de motor ou de vontade):** o ala atacou e não voltou correndo, deixando o time em linha de 4 desbalanceada. Sinal: o ala aparece andando enquanto o adversário ataca o lado dele. É o erro físico/mental que mais desgasta a confiança do treinador.

- **Indecisão no 2x1 defensivo:** quando lateral + ponta adversários atacam juntos seu flanco, o ala que não decide rápido quem marcar acaba não marcando ninguém — sai cruzamento ou passe livre. Sinal: cruzamentos saindo sem oposição do lado dele.

- **Cruzamento ruim / decisão pobre no último terço:** chegar à linha de fundo e cruzar para ninguém, ou cruzar sempre no primeiro pau lotado. Sinal: muitos cruzamentos, poucos que chegam. Um treinador cobra qualidade e variação (rasteiro, recuado, de fundo) sobre volume.

- **Marcação alta sem temporização (ser eliminado no 1x1 defensivo):** o ala sai afobado para pressionar o ponta e é driblado/passado por dentro, abrindo o flanco e arrastando o zagueiro. Sinal: pontas adversários ganhando o 1x1 com facilidade pelo lado dele.

- **Não dar largura suficiente (encolher cedo demais):** o ala que não cola na linha aperta o time, facilita a marcação adversária e mata a vantagem estrutural do sistema de 3. Sinal: o time fica amontoado no centro, sem amplitude.

- **Desequilíbrio dos dois alas subindo juntos na fase errada:** falha coletiva de coordenação — ambos sobem, o time fica sem linha de 5, e o adversário troca o jogo para o flanco aberto. Cobrança: 'um sobe, o outro segura'."

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**Mercados/dimensões que esta posição mais ajuda a EXPLICAR (vocabulário explicativo, gerador de hipóteses — NUNCA edge nem dica; o número do mercado é a âncora e não se move):**

- **Cruzamentos e escanteios:** o ala é a principal fábrica de cruzamentos de times com 3 zagueiros. Quando os dois alas são ofensivos e o adversário defende em bloco, faz sentido NARRAR uma tendência de muitos cruzamentos e, por consequência, de escanteios conquistados/cedidos. *Hipótese explicativa, não previsão:* 'time de 3 com alas largos x bloco baixo tende a gerar volume de bola parada lateral'. Marcar sempre como explicativo-não-preditivo.

- **Assistências / props de jogador (cruzamentos certos, passes-chave do ala):** o ala costuma liderar o time em cruzamentos e aparecer em xA. Bom para EXPLICAR por que tal jogador concentra criação pelo lado — sempre ancorado no número que o mercado já precificou, jamais como recomendação.

- **Gols (estrutura, não placar):** a amplitude dos alas é o mecanismo que abre o espaço central; ajuda a EXPLICAR por que um time cria/sofre por dentro. Útil para a narrativa de 'como os gols tendem a nascer' (cruzamento → segundo pau; ou nas costas do ala na transição) — descritivo.

- **Jogo aéreo (props de cabeceio/duelos):** alas altos (tipo Dumfries) entram em duelos aéreos defensivos e em chegadas de segundo pau; explica props de cabeceio e finalização do ala oposto.

- **Cartões:** o duelo ala x ponta é um dos mais físicos e repetidos do jogo; alas que defendem muito 1x1 acumulam faltas táticas (parar transição) — ajuda a EXPLICAR propensão a cartão do ala ou do ponta adversário. Descritivo.

- **Sinal de leitura de jogo:** se um time troca para 5-3-2/5-4-1 (alas recuados), isso EXPLICA uma intenção mais defensiva → narrativa coerente com menos volume ofensivo pelo lado. Sempre como leitura contextual que acompanha o número, nunca que o desafia."

---

### Zagueiro central (incl. zagueiro de saída / ball-playing, stopper-marcador, zagueiro de cobertura, líbero)

#### Resumo didático

**O que é (`consenso`):** O zagueiro central (em inglês *center-back* ou *centre-half*; abreviado CB) é o defensor que joga no miolo da defesa, à frente do goleiro e entre os dois laterais. Quase sempre são dois (formação de 4 atrás) ou três (formação de 3/5 atrás). É a última linha de gente antes do goleiro.

**Pra que existe (`consenso`):** A função-mãe é **impedir o gol** — mas isso se desdobra em três tarefas que o leigo confunde:
1. **Marcar o atacante adversário** (não deixar o homem mais perigoso ficar livre na frente do gol).
2. **Defender o espaço** (cobrir a área perigosa mesmo quando não há um adversário ali ainda — antecipar onde a bola vai cair).
3. **Construir o jogo** (com a bola no pé, dar o primeiro passe que tira o time da defesa; no futebol moderno o zagueiro é o início do ataque, não só o fim da defesa).

**A imagem mental (`consenso`):** Pense no zagueiro como o **segurança + o arquiteto da casa ao mesmo tempo**. Ele tira o invasor (segurança) e, com a bola, decide por onde a equipe vai sair jogando (arquiteto). Um zagueiro só "segurança" (forte no corpo, ruim com a bola) limita o time moderno; um zagueiro só "arquiteto" (bom de passe, frágil na marcação) vira passivo perigoso. Os melhores fazem os dois.

**O jargão que aparece o tempo todo (definido aqui):**
- **Saída de bola / construção:** a fase em que o time tira a bola de trás pra criar o ataque. "Zagueiro de saída" = bom nisso.
- **Stopper / marcador:** o zagueiro que sobe para "matar" o atacante antes dele girar — agressivo, vai ao homem.
- **Cobertura:** o zagueiro que fica atrás, "varrendo" o espaço, protegendo as costas do companheiro que subiu.
- **Líbero (sweeper):** zagueiro extra, posicionado mais atrás que todos, que limpa as sobras — clássico do passado, ressurgido na figura do "zagueiro central de uma defesa de 3" que tem liberdade pra sair com a bola.
- **Linha defensiva:** a fila imaginária dos defensores. "Linha alta" = adiantada; "linha baixa" = recuada perto do gol.

#### Perfil e arquétipos

**Atributos ideais (`consenso`):**

*Físicos:* altura e força no jogo aéreo (disputar bola alta), velocidade (cada vez mais decisiva por causa da linha alta — zagueiro lento vira alvo de bola nas costas), capacidade de salto, resistência ao corpo a corpo, equilíbrio para virar e correr.

*Técnicos:* domínio sob pressão, passe curto e longo preciso (o **passe quebra-linha** — aquele que passa por entre os adversários e elimina um setor inteiro do bloco — é o ouro do zagueiro moderno), desarme limpo (carrinho e bote em pé), corte/interceptação, condução com a bola (o "carregar pra dentro" que atrai a pressão e abre o passe).

*Mentais:* leitura de jogo (antecipar a jogada antes dela acontecer), concentração (90% do tempo sem bola, mas um erro custa gol), tomada de decisão sob pressão (sair ou esperar?), coragem para subir a linha, comunicação e liderança (o zagueiro organiza a linha aos gritos — quem sobe, quem cobre, a linha do impedimento).

**ARQUÉTIPOS (a diferença prática entre eles — `consenso`):**

**1. Zagueiro de saída / ball-playing defender.** Define-se pela qualidade com a bola. Conduz pra dentro do campo, quebra linha com passe, às vezes vira um "meia recuado". *Diferença prática:* o técnico desenha a saída de bola em torno dele — ele recebe sob pressão e tem que ter sangue-frio. Risco: se o time é montado pra isso e o cara erra um passe na saída, vira gol limpo. Exige um par que cubra suas subidas.

**2. Stopper / marcador (no-nonsense / destroyer).** Define-se pela agressividade defensiva. Sobe no atacante, ganha o duelo, "limpa" a bola pra longe sem firula. *Diferença prática:* ideal contra um centroavante de referência (homem-alvo). É o cara que você quer no último minuto defendendo 1x0. Risco: pode ser atraído pra fora de posição e deixar espaço; em time que quer jogar de trás, é limitado.

**3. Zagueiro de cobertura (cover / spare man).** Define-se por posicionamento e velocidade, não por duelo. Fica meio passo atrás, lê onde a bola vai cair, varre as costas do parceiro. *Diferença prática:* é o "bombeiro" — apaga incêndios que o stopper, ao subir, deixou. Costuma ser o mais rápido da dupla porque cobre o espaço nas costas da linha alta.

**4. Líbero / sweeper moderno.** Híbrido: um zagueiro com liberdade pra largar a marcação fixa e sair conduzindo/passando, geralmente o central de uma defesa de 3. *Diferença prática:* tem licença pra "romper a linha" levando a bola, virando jogador a mais no meio. Exige inteligência altíssima de quando sair e quando segurar.

*Observação de elite (`consenso`):* a dupla ideal raramente é dois iguais. O casamento clássico é **um stopper + um homem de cobertura**, ou **um ball-playing canhoto + um marcador destro** (pé e lado se complementam). Dois ball-playing podem ser frágeis na bola aérea; dois stoppers podem ser lentos e sem saída.

#### Os 4 momentos do jogo

**1) Organização ofensiva (com bola, `consenso`).** O zagueiro é o **ponto de partida da construção**. Abre em largura ("os zagueiros abrem, o volante desce") pra criar ângulos de passe e esticar a primeira linha de pressão adversária. Tarefas: receber do goleiro, atrair o pressing com condução ("carregar a bola"), achar o homem livre — seja o lateral, o volante que desceu, ou o passe quebra-linha pro meia entre as linhas. Em time de posse, fica com a bola muito tempo e dita o tempo. Em time direto, sua função ofensiva é o **lançamento** pro atacante ou o segundo andar (disputa aérea ofensiva).

**2) Organização defensiva (sem bola, `consenso`).** É o **organizador da linha**. Define a altura (sobe pra comprimir, recua pra proteger), arma o **impedimento** (sobe a linha no tempo certo pra deixar o atacante em posição irregular), distribui as marcações (quem pega o 9, quem cobre). Protege a **zona central** — o corredor onde os gols nascem. Comanda a comunicação: "sobe!", "segura!", "meu!".

**3) Transição ofensiva (acabou de recuperar, `consenso`).** No instante do desarme, a primeira decisão é **seguro ou rápido**: ou tira a pressão com passe limpo, ou — se for ball-playing — lança rápido pro contra-ataque achando o atacante nas costas da defesa adversária desorganizada. Erro comum aqui é querer sair jogando bonito no momento em que devia limpar.

**4) Transição defensiva (acabou de perder, `consenso`).** O momento mais perigoso pro zagueiro. Acabou de perder a bola num time adiantado → tem MUITO espaço nas costas. Tarefas: **frear o contra-ataque** (a "falta tática/profissional" sacrificial entra aqui quando não há outra opção), **recuar correndo pra fechar o corredor central**, e decidir entre **segurar o atacante** (atrasar pra defesa se recompor) ou **ir ao desarme**. É onde a velocidade do zagueiro mais aparece — e onde o lento sofre.

#### Zonas ocupadas e gaps deixados

**Zonas ocupadas (`consenso`):** o zagueiro vive no **corredor central** (a faixa do meio do campo, à frente do gol) e na **zona 14 defensiva** — o miolo logo na entrada da própria área, de onde nascem os gols de jogada trabalhada e os rebotes. Numa defesa de 4, cada central cobre meia-largura central; numa defesa de 3, o central do meio é puro corredor central e os dois de fora deslizam pros meio-corredores (os "half-spaces", as faixas entre o centro e a lateral — onde meias e pontas invertidos adoram aparecer).

**O que a posição abre/expõe (`consenso`):**
- Quando um zagueiro **sobe pra marcar** (stopper), ele abre as **costas da linha** — o espaço entre a defesa e o goleiro. É exatamente onde a bola em profundidade e o atacante rápido atacam. Por isso o stopper precisa de cobertura.
- Quando o zagueiro **é puxado pra fora** (um 9 que abre na lateral, um falso 9 que recua), deixa o **buraco central** — e um segundo atacante ou o meia chegando de trás explora.
- A **linha alta** transforma o espaço nas costas num campo aberto; a **linha baixa** entope a área mas entrega o controle e convida pressão e escanteios.

**Como o adversário explora a ausência/erro (`consenso`):**
- **Bola nas costas (em profundidade)** contra linha alta e zagueiro lento.
- **Combinação rápida no half-space** pra puxar um central pra fora e atacar o buraco que ele deixou.
- **Sobrecarga (overload) de um lado** pra obrigar o zagueiro a deslizar e abrir distância do parceiro — o gap entre os dois centrais é onde o atacante "se esconde" e ataca o cruzamento.
- **Falso 9 / 9 que recua:** atrai o zagueiro pra fora da zona; se ele segue, abre buraco; se não segue, o falso 9 recebe livre entre linhas. Dilema clássico.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo (`consenso`):** é o pão-com-manteiga do zagueiro. Domina a disputa de bola alta na própria área, ataca a bola no ponto mais alto (timing do salto > altura pura), e "ganha a primeira bola" pra afastar. A regra de ouro é **afastar longe, alto e largo** (pra fora do corredor central, longe da área). Numa defesa de 3, os centrais formam um triângulo aéreo dominante — uma das razões de times que sofrem com cruzamento migrarem pra 3 zagueiros.

**Jogo aéreo ofensivo (`consenso`):** zagueiro alto é arma de ataque em bola parada. Sobe pro escanteio e pra falta lateral pra cabecear no gol — frequentemente o maior goleador de bola parada do time depois do centroavante.

**Escanteio (`consenso`):**
- *Defendendo:* na **marcação por zona**, o zagueiro guarda uma região (primeiro pau, segundo pau, linha da pequena área); na **marcação individual (homem a homem)**, gruda no atacante mais perigoso; a maioria usa **mista** (zona + alguns individuais nos perigosos). O zagueiro mais forte no alto pega o melhor cabeceador adversário.
- *Atacando:* é alvo de cruzamento, faz **bloqueio/tela** (atrapalhar legalmente o marcador do companheiro) e ataca os paus.

**Falta (`consenso`):** defendendo, compõe a barreira ou marca no espaço/homem na área. Atacando, vira "torre" na área pra cabecear cruzamento.

**Lateral (`consenso`):** pouco impacto direto, mas o arremesso longo na área vira "segunda bola parada" — o zagueiro disputa o primeiro contato.

**Pênalti (`consenso`):** não tem papel direto, salvo o raro caso de cobrar (incomum). Posiciona-se na borda da área pra disputar o rebote.

*Nuance de elite (`consenso`):* na **segunda bola** (a sobra após a primeira disputa aérea), o zagueiro que afastou precisa imediatamente reorganizar a linha — gol de rebote nasce de zagueiro que afastou e ficou parado admirando.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha (`consenso`):** o zagueiro é quem **define e sustenta** a linha. Linha alta = comprime o campo, sufoca o adversário perto do gol dele, mas expõe as costas (exige zagueiro rápido + goleiro-líbero que sai jogando alto, tipo um goleiro "sweeper-keeper"). Linha baixa = protege a área mas cede território, vira refém de cruzamento e bola parada. Times de elite alternam: sobem pra pressionar, recuam pra defender o resultado.

**Espaço entre linhas (`consenso`):** o pesadelo do zagueiro é o **espaço entre a linha de defesa e a de meio** — onde o meia-armador (o "10") e o falso 9 recebem de frente pro gol. O dilema permanente: **subir pra marcar** quem aparece ali (e abrir as costas) ou **segurar** (e dar tempo/espaço ao criador). Compactar esse espaço é trabalho coletivo, mas o zagueiro é o último voto.

**Pressing e contrapressing (`consenso`):**
- No **pressing alto** do time, o zagueiro joga numa linha adiantada e precisa estar pronto pra **defender em campo aberto, 1x1, com muito gramado nas costas** — exige coragem e velocidade.
- No **contrapressing** (recuperar a bola imediatamente após perdê-la), o zagueiro participa "subindo junto" pra encurtar o campo e não deixar o adversário respirar na transição.
- **PPDA** (*passes permitidos por ação defensiva* — métrica de intensidade do pressing; quanto menor, mais agressivo): time de PPDA baixo joga com linha altíssima → o zagueiro vive na corda bamba do impedimento e da bola nas costas. É a troca que define o estilo da equipe.

*Síntese de elite (`consenso`):* não existe "altura de linha certa" isolada — ela é função de quem você tem. Com dois zagueiros rápidos, suba; com dois lentos e fortes, defenda baixo e ganhe no alto. Casar o estilo de linha ao perfil dos centrais é metade do trabalho do treinador.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**Casa-mãe do zagueiro (`consenso`).** Dupla de centrais limpa e clássica, normalmente um **stopper + um cobertura**. Defendem o corredor central e protegem a dupla de atacantes adversária quase em paridade (2 zagueiros x 2 atacantes — equilíbrio numérico, sem sobra). Por isso a marcação tende a ser mais **referenciada (homem a homem na área)** e a linha mais bem definida. A formação **valoriza muito** o zagueiro forte na bola aérea e no duelo: as duas linhas de 4 entopem o meio, então o jogo vira disputa direta e cruzamento, terreno do central clássico. Saída de bola é mais simples e direta (não exige tanto ball-playing). O risco: contra um 9 que recua entre linhas, a dupla fica em dúvida sobre quem segue — o famoso 'buraco do 4-4-2'.

**4-4-2 em losango (diamante)**

**Mais exposto lateralmente (`consenso`).** O losango fecha o meio (4 jogadores em diamante: volante, dois meias internos, um 10) mas **abandona as pontas** — não há extremos. Isso joga muita responsabilidade nos laterais, que sobem muito, e expõe os corredores. Pro zagueiro, significa **deslizar mais para os flancos** pra cobrir o lateral que subiu e ficou pra trás, e gerir o espaço atrás dele. A dupla de centrais defende contra 2 atacantes mas com flancos vulneráveis a bola aberta e cruzamento. **Valoriza** o zagueiro de boa cobertura e leitura (apagar incêndios de flanco). Exige um zagueiro que saiba defender o cruzamento que vem dos lados, já que o losango convida o adversário a atacar pelas beiradas.

**4-3-3**

**Saída de bola é tudo (`consenso`).** A dupla de centrais defende contra um centroavante e dois pontas, mas no ataque vira o **motor da construção**: os zagueiros abrem em largura, o volante (pivô) desce entre eles formando a 'saída em 3', e eles precisam **furar a primeira pressão com passe**. A formação **valoriza o ball-playing defender** acima de tudo — quebrar linha pro meia ou achar o ponta no 1x1. Defensivamente, contra os dois pontas adversários, os zagueiros sustentam linha alta pra comprimir, então **velocidade** é premium (bola nas costas é a ameaça nº1). É a formação que mais transformou o zagueiro em iniciador de jogo.

**4-2-3-1**

**Confortável e protegido (`consenso`).** Os **dois volantes (o duplo pivô)** blindam a dupla de zagueiros — esse é o grande conforto deste sistema. Contra um único centroavante, há **sobra numérica (2x1)**, então um zagueiro pode marcar o 9 e o outro vira **líbero/cobertura** com liberdade pra sair conduzindo ou subir. A grande ameaça é o **'10' adversário entre as linhas**: os volantes deveriam fechá-lo, mas se ele escapa, cabe ao zagueiro decidir subir ou segurar. **Valoriza** um zagueiro inteligente de cobertura e bom de saída, já que o duplo pivô lhe dá tempo. Sistema confortável pro central — talvez o mais protegido entre os de 4 atrás.

**4-1-4-1**

**Um escudo só, então mais atenção (`consenso`).** Só **um volante (single pivot)** protege a dupla — menos blindagem que o 4-2-3-1. A linha de 4 à frente pressiona/recompõe, mas se for furada, os zagueiros ficam mais expostos ao meia que invade. Contra um 9, ainda há sobra (2x1), permitindo um cobertura livre. **Valoriza** zagueiros que **lêem bem a transição** e sobem a linha com coragem pra compactar (compensar o único volante). Saída de bola: os zagueiros abrem e o pivô oferece o apoio central — se o pivô é marcado, a saída passa obrigatoriamente pelos pés dos zagueiros, exigindo qualidade técnica.

**3-5-2 / 3-4-1-2**

**O trio que muda tudo (`consenso`).** Aqui são **três zagueiros**, com papéis distintos: o **central do meio** é o líbero/organizador (mais liberdade pra sair com a bola, vira jogador a mais na saída — 3x2 contra dois atacantes); os **dois de fora (os 'wide center-backs')** deslizam pros meio-corredores e podem até **subir conduzindo** quando o lado está livre, virando quase um lateral-zagueiro híbrido. **Valoriza enormemente** o zagueiro: dá sobra numérica defensiva (conforto contra 2 atacantes), domínio aéreo (3 torres) e, no caso dos de fora, exige saber **defender o 1x1 aberto** quando o ala (wing-back) sobe e deixa o flanco. É a formação que mais pede **inteligência de líbero** no central do meio.

**3-4-3 / 3-4-2-1**

**Trio agressivo e adiantado (`consenso`).** Mesmo trio de zagueiros, porém num sistema mais **ofensivo e de linha mais alta** (os alas viram quase pontas, os '2' atrás do 9 atacam os half-spaces). Os zagueiros de fora têm que **defender muito espaço aberto** quando o ala sobe — duelo 1x1 no flanco é constante. O central do meio organiza e sai jogando, frequentemente o **melhor com a bola dos três**. **Valoriza** zagueiros rápidos e bons no 1x1 (a linha alta + alas adiantados deixam muito gramado nas costas dos de fora). Defensivamente vira 5-4-1 ou 5-2-3 quando recua — os alas caem e formam o bloco de 5. Exige zagueiros que entendam essa **respiração 3↔5**.

**5-3-2 / 5-4-1 (bloco de 5)**

**Fortaleza defensiva (`consenso`).** O 3-x-x vira **5 atrás** com os alas recuados — é o trio de zagueiros em modo defesa pura. **Máximo conforto numérico**: contra 1 ou 2 atacantes há sobra grande, marcação individual no homem de referência + cobertura, domínio aéreo total. **Valoriza o stopper/marcador clássico** e o jogo aéreo — é o sistema do time que defende o resultado, aceita ter menos a bola e ataca em transição/bola parada. O zagueiro central organiza um bloco baixo e compacto. Risco/contraponto: tanta gente atrás pode virar **passividade** (recuar demais, convidar pressão) — e a saída de bola fica difícil porque o adversário tem mais homens à frente. Pro central, é o sistema mais 'defensor tradicional' de todos.

**4-3-1-2 (sem pontas)**

**Meio congestionado, flancos abertos (`consenso`).** Variante do losango/diamante sem extremos: três volantes/meias + um 10 + dois atacantes. O meio é super povoado (bom pra blindar o corredor central do zagueiro), **mas os flancos ficam descobertos** — dependentes dos laterais que sobem. Pro zagueiro, repete o padrão do diamante: **deslizar pra cobrir o flanco** que o lateral deixou e **defender o cruzamento** que vem aberto. A dupla central enfrenta 2 atacantes com o meio protegido, então o duelo é mais central e direto. **Valoriza** o zagueiro de boa cobertura lateral e forte no cruzamento. O 10 adversário entre linhas é, de novo, o dilema (subir x segurar), mas aqui há mais meio-campistas pra ajudar a fechá-lo.

#### Parcerias-chave

**Relações-chave (`consenso`):**

- **Zagueiro ↔ zagueiro (a dupla):** a parceria mais íntima do time. Comunicação constante, divisão de tarefas (quem sobe, quem cobre), sincronia da linha e do impedimento. Complementaridade > similaridade: stopper + cobertura, ou canhoto + destro. Um sobe, o outro **basculha** (desliza) pra cobrir — falha de sincronia aqui = gol.

- **Zagueiro ↔ volante (pivô):** dupla de construção. O volante **desce entre os zagueiros** ('sair em 3') na saída de bola e é o **escudo** que protege o espaço entre linhas. Se o pivô some ou é marcado, a saída cai toda no pé do zagueiro. Defensivamente, o volante 'tampa o buraco' quando o zagueiro é puxado pra fora.

- **Zagueiro ↔ lateral / ala:** quando o lateral sobe, o zagueiro **cobre a diagonal** atrás dele e desliza pro flanco. Numa defesa de 3, essa relação é com o **ala (wing-back)** — o zagueiro de fora assume o 1x1 quando o ala está adiantado. Combinação fina aqui evita o cruzamento e o 2x1 no flanco.

- **Zagueiro ↔ goleiro:** parceria de última linha. Com **linha alta**, o goleiro vira 'líbero/sweeper-keeper' que sai pra varrer as costas — confiança mútua é vital. Na bola parada e no cruzamento, comunicação clara ('minha!'/'sua!') evita o gol bobo. O zagueiro também é a principal opção de **passe de retorno** pro goleiro relançar.

*Insight de elite (`consenso`):* a melhor defesa não é a soma de quatro indivíduos bons, é a **sincronia das parcerias** — sobe-cobre, lateral-zagueiro, pivô-zagueiro. Times trocam um zagueiro mais talentoso por um que 'casa' melhor com o parceiro de propósito.

#### Exemplos de elite

**ATENÇÃO (`inferência`/`consenso`):** os nomes abaixo ilustram arquétipos com base em conhecimento de domínio até o cutoff (jan/2026). NÃO citei estatísticas específicas (gols, números) — onde isso importaria, marquei `NEI`. Trate como exemplos de estilo, não como dado verificado.

**Ball-playing / zagueiro de saída:**
- *Virgil van Dijk* (`consenso`): referência moderna do central completo — domina o alto, lê o jogo com calma e sai jogando limpo; "ganha sem correr" pela antecipação.
- *Rúben Dias* (`consenso`): organizador e líder de linha, leitura e comunicação de elite; arquétipo do central que comanda o bloco.
- *Josko Gvardiol* / *Antonio Rüdiger* (`consenso`): canhoto/agressivo respectivamente, exemplos de central moderno que conduz e quebra linha.
- *Histórico:* *Franz Beckenbauer* (`consenso`) — o **líbero** definitivo, inventou o zagueiro que sai jogando como criador. *Franco Baresi* / *Paolo Maldini* (`consenso`) — inteligência posicional e líbero/ leitura de elite do Milan.

**Stopper / marcador (no-nonsense):**
- *Histórico:* *Fabio Cannavaro* (`consenso`) — duelo e timing acima da altura. *Nemanja Vidić* (`consenso`) — o stopper físico arquetípico, ganha tudo no corpo e no alto. *Carles Puyol* (`consenso`) — raça, liderança e dueloconstante.

**Cobertura / velocidade:**
- *William Saliba* (`consenso`) — rápido, cobre as costas da linha alta, lê a profundidade; arquétipo do cobertura moderno pra time que pressiona alto.

**Líbero moderno / central de 3:**
- *Beckenbauer* e *Matthias Sammer* (`consenso`) históricos; no jogo atual, centrais de defesa de 3 com licença pra conduzir (perfil tipo *Gvardiol* avançando) ilustram o líbero ressurgido.

*Confiança:* arquétipos = `consenso` (qualitativo, robusto). Vínculo de um nome a um clube/temporada específica em 2025-26 = `inferência` (não verifiquei via fetch). Qualquer estatística = `NEI`.

#### Erros comuns / como falha

**Como a posição falha (`consenso`):**

- **Bola nas costas:** subiu a linha no tempo errado ou é lento → atacante recebe em profundidade sozinho. Sinal de mau desempenho que o técnico mais cobra em linha alta.
- **Ser atraído pra fora de posição:** seguir o 9 que recua / o atacante que abre, deixando o **buraco central** pro segundo atacante ou pro meia chegando. O dilema 'sigo ou seguro' mal resolvido.
- **Perder o duelo aéreo:** errar o timing do salto, deixar o cabeceador livre no escanteio, perder a **primeira bola** na área.
- **Erro de saída de bola:** querer jogar bonito sob pressão e entregar a bola na entrada da área — gol limpo. O 'risco do ball-playing' mal calibrado.
- **Quebra da linha / impedimento mal armado:** um zagueiro segura quando o outro sobe → o atacante fica habilitado. Falha de **sincronia da dupla**.
- **Falta de comunicação:** ninguém organiza a linha, dois marcam o mesmo homem e sobra outro livre. Defesa muda = defesa que sofre.
- **Lentidão na transição defensiva:** após perder a bola, não recua nem freia o contra-ataque (não comete a falta tática quando devia, ou comete tarde e toma cartão + leva o ataque).
- **'Admirar' a sobra:** afastou e ficou parado → gol de rebote/segunda bola.

**Sinais que o treinador lê (`consenso`):** gols sofridos pelo corredor central; xG concedido alto em jogada trabalhada; muitos cruzamentos vencidos pelo atacante; passes de saída errados em campo próprio; cartões por falta tática mal-feita; impedimentos não-marcados (linha furada). O que se cobra: **concentração os 90 minutos** (um erro = gol), **decisão sob pressão** e **liderança vocal** da linha.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**SEMPRE explicativo-não-preditivo. Ancorado no número do mercado, que nunca move. Geram hipótese narrativa, jamais 'edge'. (`consenso`)**

- **Gols (sofridos):** a solidez/fragilidade da dupla de zagueiros é o gancho central pra EXPLICAR o lado *under/over de gols sofridos* de uma equipe. Zagueiros lentos + linha alta = narrativa de 'vulnerável a profundidade'. Dupla forte + bloco de 5 = narrativa de 'difícil de furar'. Sempre como contexto do número, não como dica.

- **Jogo aéreo / cruzamentos:** domínio aéreo dos centrais ajuda a EXPLICAR por que um time sofre ou não com cruzamento e bola alta. Defesa de 3 (três torres) = narrativa de força aérea. Útil pra contextualizar mercados ligados a cruzamento/cabeceio onde existirem.

- **Escanteios:** zagueiro alto que **sobe pra atacar** o escanteio informa a narrativa de 'time que ameaça no alto'; defesa que **afasta mal** (segunda bola) explica por que concede escanteios em sequência. Contexto explicativo de mercados de escanteio — nunca previsão.

- **Cartões:** o zagueiro é candidato natural a **cartão por falta tática** na transição defensiva (frear contra-ataque) e por duelo aéreo/carrinho. Explica props de cartão de jogador e contexto de cartões do time — como narrativa de estilo (time de linha alta comete mais falta tática atrás), nunca como aposta sugerida.

- **Assistências / props de jogador:** o **ball-playing defender** que quebra linha pode aparecer em mercados de passe/assistência improváveis; zagueiro-goleador de bola parada aparece em props de finalização/gol de zagueiro. Útil pra EXPLICAR por que um central tem props ofensivos atípicos.

- **Posse / ritmo do jogo:** o estilo de saída dos zagueiros (jogar de trás x lançar direto) ajuda a EXPLICAR o ritmo e a posse esperados — pano de fundo narrativo do jogo.

*Lembrete obrigatório:* todos esses ganchos são **vocabulário pra explicar o 'porquê' do número do mercado/quant**. O número manda; o zagueiro só dá a história por trás. Nunca virar 'dica por posição' nem 'edge'.

---

### Volante / pivô defensivo (6) — incl. destruidor (ball-winner), regista (deep-lying playmaker / maestro), e a distinção pivô único vs duplo pivô

#### Resumo didático

**O que é, em uma frase:** o volante (no Brasil) ou pivô defensivo (número 6) é o jogador que fica logo na frente da zaga, no coração do campo, e funciona como a **rótula** do time — a articulação que liga a defesa ao ataque e que, quando a bola é perdida, é o primeiro escudo na frente dos zagueiros.

**A analogia mais útil:** pense no time como um corpo. A zaga é a coluna; o atacante é o punho; o 6 é o **plexo solar e a base da espinha ao mesmo tempo**. Quase tudo passa por ele. Em organização com bola, é por onde a bola circula de um lado para o outro do campo (ele é o "distribuidor"). Sem bola, é quem tapa o buraco central por onde o adversário mais quer atacar (porque o meio é o caminho mais curto e perigoso para o gol).

**Por que a posição existe (a função que justifica tudo):** o futuro do futebol moderno se decide no centro do campo, na zona logo à frente da defesa, que os táticos chamam de **"meia-lua"** ou **"zona 14"** (a área central na entrada da área adversária) na fase ofensiva, e de **espaço entre linhas** na defensiva. O 6 existe para (a) dar uma **opção de passe segura e constante** para os zagueiros saírem jogando sem chutão, (b) **proteger o espaço central** quando o time perde a bola, e (c) **controlar o ritmo** — acelerar quando dá para atacar, segurar quando o time precisa respirar.

**O jargão que o dono do produto precisa conhecer já:**
- **"Volante"** é o termo brasileiro; **"pivô defensivo"**, **"6"**, **"holding midfielder"**, **"defensive midfielder (DM)"**, **"mediocentro defensivo (MCD)"** e **"pivote"** são o mesmo cargo em outras culturas.
- **"Pivô único" (single pivot)** = UM volante sozinho na base (sistemas como 4-3-3 e 4-1-4-1). **"Duplo pivô" (double pivot)** = DOIS volantes lado a lado (sistemas como 4-2-3-1 e 4-4-2). Essa é a divisão mais importante da posição e muda quase tudo.
- **"Destruidor" / "ball-winner"** = o arquétipo que existe para **roubar bola e destruir jogadas** (mais músculo e leitura defensiva).
- **"Regista" / "deep-lying playmaker" / "maestro"** = o arquétipo que existe para **organizar e distribuir** desde a base (mais cérebro e qualidade de passe). O 6 não é uma posição só: é um espectro entre esses dois polos.

#### Perfil e arquétipos

**Atributos ideais (e por que cada um importa):**

*Físicos:* não precisa ser o mais rápido em arrancada, mas precisa de **resistência altíssima** (cobre muito chão, é o jogador que mais corre "em diagonal" para tapar buracos), **força de tronco/equilíbrio** (ganha duelos de ombro, aguenta pressão de costas para o gol sem perder a bola) e **mobilidade de giro** — capacidade de virar 180° rápido, porque ele recebe muito de costas e precisa "abrir o corpo" para enxergar o campo. **Envergadura/timing de bote** vale mais que velocidade pura.

*Técnicos:* o atributo-rei é o **primeiro toque orientado** (receber a bola já virando para frente, ganhando tempo). Depois: **passe de média e longa distância sob pressão**, **passe quebra-linha** (o passe vertical que "fura" uma linha do adversário e elimina marcadores de uma vez — o mais valioso do jogo moderno), **controle de bola em espaço curto** (escapar de marcação em meio metro), e **leitura/antecipação** (chegar na bola antes do passe acontecer).

*Mentais:* aqui mora a diferença entre o bom e o genial. **Scanning** (o hábito de virar a cabeça antes de receber para já saber onde estão todos — os melhores 6 fazem isso 6-8 vezes nos segundos antes de tocar na bola), **posicionamento sem bola** (estar sempre na sombra de passe certa), **gestão de risco** (saber quando é hora do passe seguro e quando é hora do passe que vence o jogo), **inteligência de falta tática** (cometer a falta "boa" que para o contra-ataque sem tomar cartão) e **liderança/voz** (organiza a linha, manda subir ou cair).

---

**OS ARQUÉTIPOS (o coração desta posição):**

**1. O DESTRUIDOR (ball-winner / "destroyer"):** existe para recuperar bola. Pressão alta, antecipação, bote, cobertura. Geralmente mais físico e agressivo. Joga "para frente" com a bola só o necessário — passa curto e seguro para quem cria. *Diferença prática:* num jogo contra time que ataca muito, ele é ouro; num jogo onde SEU time domina e precisa quebrar bloco baixo, ele pode sobrar (não cria nada). Ex. de função: N'Golo Kanté, Casemiro, Declan Rice (versão defensiva).

**2. O REGISTA / DEEP-LYING PLAYMAKER (maestro):** existe para organizar. É o "cérebro" que dita o ritmo desde a base. Recebe dos zagueiros, vira, e desenha o jogo com passe. Menos agressivo no bote, mais posicional na defesa (corta linhas de passe em vez de sair no carrinho). *Diferença prática:* transforma posse estéril em posse perigosa, mas se não tiver proteção ao lado, vira passivo defensivo. Ex. de função: Sergio Busquets, Rodri (com bola), Toni Kroos (mais avançado), Jorginho, Andrea Pirlo (histórico).

**3. O BOX-TO-BOX DISFARÇADO / "carrilero defensivo":** um híbrido que protege mas também chega. Menos comum como 6 puro; aparece quando o 6 tem licença para conduzir a bola para frente (ball-carrier). Ex.: Declan Rice no Arsenal (conduz e chega à área), Yaya Touré (histórico).

**4. O "ANCHOR" PURO (âncora):** fica quase fixo entre os zagueiros, raramente cruza a linha do meio. Existe em times que defendem muito ou que querem um terceiro homem de saída fixo. *Diferença prática:* dá segurança máxima mas reduz o time a 10 no ataque se for muito conservador.

**A síntese de elite (o "6 completo"):** Rodri é o exemplo-modelo de 2023-2026 — junta destruir, organizar E chegar para finalizar, com scanning de classe mundial. Ele é raro justamente porque a maioria dos 6 é boa em UM polo, não nos dois. Entender em qual polo o seu 6 mora explica metade do que o time vai conseguir fazer.

#### Os 4 momentos do jogo

**1) ORGANIZAÇÃO OFENSIVA (com bola, jogo construído):** é onde o 6 mais aparece. Ele é o **primeiro homem de saída** — desce entre ou ao lado dos zagueiros para criar superioridade numérica contra a primeira linha de pressão (o movimento chamado **"dropar"** ou **"descer na linha"**; quando ele cai EXATAMENTE entre os dois zagueiros formando um trio de três, chama-se **"salida lavolpiana"**, em homenagem a Ricardo La Volpe). Ele recebe, **vira o jogo** (troca a bola de um lado para o outro para mover o bloco adversário), oferece o **passe quebra-linha** quando a janela abre, e **fixa** o meia adversário (ocupa a atenção dele para liberar companheiros). É o metrônomo: define se o time joga rápido ou lento.

**2) ORGANIZAÇÃO DEFENSIVA (sem bola, bloco montado):** o 6 é o **dono do espaço central** à frente da zaga. A tarefa principal é **proteger o "espaço entre linhas"** (a faixa entre a defesa e o meio-campo onde os camisas 10 adversários querem receber de frente). Ele faz isso por **cobertura** (ler onde vai o perigo e estar lá antes), não necessariamente por marcação individual. Decide se **marca por referência** (gruda no 10 adversário) ou **por zona** (protege a área). Comanda quando a linha sobe ou cai. Num duplo pivô, um sobe para pressionar e o outro cobre — comunicação constante.

**3) TRANSIÇÃO OFENSIVA (acabou de recuperar a bola):** momento de ouro. Nos primeiros 3-5 segundos após o roubo, o adversário está desorganizado. O 6 tem duas opções: **(a)** ele mesmo conduz/lança rápido para explorar o caos (se for ball-carrier/passador vertical), ou **(b)** faz o **"primeiro passe limpo"** — tira a bola da zona de pressão e entrega ao criador, segurando a posse. A decisão entre acelerar e segurar é uma das mais importantes do jogo e cai no colo dele. Um 6 que erra esse passe devolve a bola e mata o contra-ataque.

**4) TRANSIÇÃO DEFENSIVA (acabou de perder a bola — o momento mais crítico para esta posição):** aqui o 6 é o **seguro de vida do time**. No instante da perda, os laterais e meias estão subidos; o 6 é frequentemente o ÚNICO entre o ataque adversário e a zaga. Funções: **(a) contrapressing** — se está perto, pressiona na hora para recuperar em 5 segundos (gegenpressing); **(b) "tapar o buraco"** — recuar para a zona central e atrasar o contra-ataque; **(c) a falta tática** — se não dá para recuperar limpo, comete a falta inteligente que para o ataque (a "falta boa"). Um grande 6 transforma transições defensivas perigosas em meros sustos. É por isso que se diz que ele "não aparece nas estatísticas, mas aparece na ausência": o que ele evita não tem número.

#### Zonas ocupadas e gaps deixados

**Corredor que ocupa:** o **corredor central**, na **faixa logo à frente da zaga** — em termos de zonas do campo (dividindo em terços e corredores), ele vive nas **zonas centrais do meio-campo defensivo**, oscilando entre cair para a linha dos zagueiros (na saída) e subir até a entrada do círculo central (na organização). Horizontalmente, num pivô único ele precisa "varrer" toda a largura central; num duplo, cada um cobre meio-corredor (esquerda/direita do centro).

**Espaço que ABRE ao subir/descer:**
- Quando ele **desce para a saída** (dropa entre os zagueiros), libera os laterais para subirem e abre o corredor central no meio — alguém precisa preencher esse meio (geralmente um dos 8s desce). Se ninguém preenche, o time fica com a base bem servida mas **oco no miolo**.
- Quando ele **sobe para apoiar o ataque**, abre o espaço que ele deveria proteger — e é exatamente aí que nasce o contra-ataque adversário. Esse é o gap mais perigoso da posição.

**Espaço que DEIXA EXPOSTO (e como o adversário explora):**
- **As costas do 6 (entre ele e a zaga):** se o adversário coloca um 10 ou um falso 9 nessa faixa e o 6 sobe demais, abre-se a janela para receber de frente — a jogada mais letal contra qualquer bloco.
- **Os "meios-espaços" (half-spaces)** ao lado dele: os corredores entre o central e a lateral. Num pivô único, ele não cobre os dois meios-espaços ao mesmo tempo — o adversário ataca pelo lado oposto ao que ele desloca (princípio de "puxar e atacar o outro lado"). Por isso o pivô único exige 8s que ajudem a fechar os meios-espaços.
- **A largura quando o time perde a bola:** se o 6 é arrastado para um lado, o centro fica aberto para a inversão rápida.

**Regra de ouro explicativa:** quando você vir um time sofrer muitos chutes "da entrada da área" ou gols de jogadas que começam "pelo meio", a primeira pergunta tática é: *o 6 estava posicionado, foi arrastado, ou subiu demais?* A ausência ou má posição do 6 é uma das causas-raiz mais comuns de fragilidade central.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo:** o 6 raramente é o cabeceador principal (esse papel é dos zagueiros), mas tem duas funções aéreas cruciais. **(1) "Cobrir a segunda bola":** em cruzamentos e bolas alçadas, ele se posiciona na **entrada da área / borda da meia-lua** para varrer o **rebote/segunda bola** (a bola que sobra do primeiro corte) — é a zona onde mais nascem chutes de fora perigosos. Um 6 atento nessa zona apaga muito perigo. **(2) Disputar a "primeira bola" em lançamentos diretos:** contra times de bola longa, às vezes ele ajuda a brigar pela primeira bola no meio.

**Jogo aéreo ofensivo:** geralmente fica **recuado de proteção** ("resto defensivo"), justamente porque alguém precisa cobrir a transição enquanto os zagueiros sobem para a bola parada. Volantes mais altos e fortes podem ir à área em escanteios, mas o padrão é o 6 ser o **"jogador de equilíbrio"** que fica fora da área protegendo contra o contra-ataque.

**Bola parada — funções típicas:**
- **Escanteio defensivo:** quase sempre é um dos **homens de borda/proteção** — fica na entrada da área para cortar a sobra e iniciar o contra-ataque, OU faz **marcação de zona** num poste. Raramente marca homem na área (não é seu forte).
- **Escanteio ofensivo:** costuma ser o **resto defensivo** (fica atrás, equilibrando), às vezes na quina para a cobrança curta.
- **Falta lateral/cruzamento:** equilíbrio defensivo, cobre a saída de contra-ataque.
- **Falta frontal (direta):** alguns regista batem faltas e escanteios com qualidade (passe é o atributo deles) — Pirlo, Kroos e Trent (quando recuado) são exemplos de 6/construtores que viram batedores. Mas não é regra.
- **Lateral (arremesso):** oferece a opção de apoio curto e seguro para reiniciar a posse.
- **Pênalti:** ocasionalmente um regista frio é cobrador (ex.: Jorginho com seu "pula-pula" característico), mas não é função da posição.

**Gancho explicativo:** a presença de um 6 forte na **borda da área** em situações defensivas reduz chutes de fora e segundas bolas; já em bola parada ofensiva, a regra "o 6 fica de equilíbrio" ajuda a explicar por que alguns times sofrem (ou não) gols de contra-ataque logo após cobrarem escanteio.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha defensiva — o 6 é o regulador.** Quando a zaga sobe (linha alta), aumenta o espaço **nas costas dela** (perigo de bola nas costas/profundidade) mas reduz o espaço entre linhas. Quando a zaga cai (linha baixa), protege a profundidade mas **abre o espaço entre linhas** — e é aí que o 6 vira essencial, porque ele tem que cobrir essa faixa praticamente sozinho. Em bloco baixo, o 6 e a zaga formam quase uma "linha de 3,5". **Quem manda subir ou cair a linha, na prática, é frequentemente o 6**, porque ele tem o campo todo à sua frente e enxerga o perigo antes.

**Espaço entre linhas (a faixa onde o jogo se decide):** é literalmente o território do 6. O trabalho de "encurtar o espaço entre linhas" (manter meio-campo e defesa juntos, **compactos**) recai sobre ele somar com os 8s. Se o time fica **esticado** (linhas longe uma da outra), o camisa 10 adversário recebe de frente e o jogo desmorona — e a culpa quase sempre passa pelo posicionamento do 6.

**Pressing e contrapressing:** num **pressing alto**, o 6 sobe junto para **comprimir** e fechar a saída central do adversário — ele "marca a sombra" do volante adversário (fica no caminho do passe). Mas há um trade-off: quanto mais alto o 6 pressiona, mais exposto fica o espaço atrás dele se o pressing for furado. No **contrapressing (gegenpressing)**, o 6 é peça central: ao perder a bola, ele lidera a reação de 5 segundos para recuperar, OU é a **rede de segurança** que protege caso a pressão seja vencida.

**PPDA (jargão técnico que o produto vai cruzar):** PPDA = "*Passes Permitidos por Ação Defensiva*", uma métrica de intensidade de pressão — **quanto MENOR o PPDA, mais o time pressiona** (permite poucos passes antes de ir à bola). Um time com PPDA baixo (pressing intenso) **exige um 6 com pulmão e leitura excepcionais**, porque ele cobre muito espaço e precisa acertar o tempo do bote. Times com PPDA alto (bloco passivo, esperam) pedem um 6 mais posicional/coberturista. **Gancho explicativo:** o estilo de pressão do time (lido pelo PPDA) ajuda a antecipar o tipo de jogo — pressing alto tende a gerar jogos mais "partidos", com mais transições, mais faltas e mais cartões no miolo; bloco baixo tende a empurrar o jogo para chutes de fora e cruzamentos. Sempre como leitura explicativa, nunca como edge.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**Não existe um '6' puro — existe um duplo pivô disfarçado.** Os dois meias centrais da linha de 4 dividem as funções de 6: tipicamente um é mais 'segurador' (fica como pivô defensivo) e o outro tem mais liberdade para chegar. **A formação valoriza a dupla, não o indivíduo:** o segredo é a **alternância** (um sobe, o outro cobre — nunca os dois ao mesmo tempo). Riscos: como a linha de 4 do meio precisa ser larga para cobrir as faixas, o **centro pode ficar oco** se os volantes abrirem demais; e contra um trio de meio (3 contra 2), a dupla fica em **inferioridade numérica no miolo** — o clássico problema do 4-4-2 contra o 4-3-3. Conecta-se com: os dois zagueiros (saída a 4), os laterais (que precisam dar a largura) e os dois atacantes (passe vertical direto). É a formação onde o 6 mais depende do parceiro e menos brilha sozinho.

**4-4-2 em losango (diamante)**

**Aqui nasce o 6 mais 'clássico' e mais EXPOSTO de todas as formações.** O losango tem UM volante na base (a ponta de baixo do diamante) — pivô ÚNICO de verdade. A formação **valoriza muito** a posição: ele é a âncora isolada que sustenta todo o meio. Mas é também a mais **perigosa para ele**, porque o diamante **abre mão da largura no meio** — não há meias pelos lados, então os **meios-espaços e as laterais ficam descobertos**, e o 6 é puxado de um lado para o outro para socorrer. Tarefas: proteger sozinho a frente da zaga, cobrir as subidas dos laterais (que são a única fonte de largura), e ligar a saída ao 10 que está no topo do diamante. Risco máximo: contra um time que joga com 2 atacantes ou pontas abertas, esse 6 sofre **superioridade pelos lados**. Conexões-chave: o 10 do topo (parceria vertical) e os laterais (que ele cobre o tempo todo). Exige um 6 com pulmão gigante e leitura de elite.

**4-3-3**

**A formação-catedral do pivô único moderno.** O 6 é a base do trio de meio (1-2: um 6 atrás, dois 8s à frente) e é **absolutamente central** — é o jogador que organiza a saída de bola e protege a transição. **A formação o valoriza ao máximo**, mas também o expõe: ele tem que cobrir o corredor central sozinho enquanto os 8s sobem e as pontas abrem. Variante crítica: muitos 4-3-3 modernos viram **4-3-3 com salida lavolpiana** (o 6 cai entre os zagueiros para sair a 3) ou **'2-3-5' na posse** (o 6 vira o '1' que segura tudo enquanto 5 atacam). Riscos: se os 8s não ajudam a defender, o 6 fica isolado contra o meio adversário; e nas costas dele há a faixa que o falso 9 / 10 adversário ataca. Conexões: zagueiros (saída), os dois 8s (triângulos de meio), e indiretamente as pontas (a quem ele serve com inversões). É a formação onde o regista/Rodri-Busquets brilha — mas só funciona com 8s que correm por ele.

**4-2-3-1**

**O lar do DUPLO PIVÔ por excelência.** Dois 6s lado a lado, protegendo a zaga e dando base ao 10 que joga à frente deles. **Valoriza a dupla e dá segurança máxima:** com dois homens na base, o time raramente fica exposto no centro, e isso libera o 10, os pontas e o lateral para atacar com tranquilidade. Divisão clássica de funções: **um é o destruidor** (fica mais fixo, recupera, protege) **e o outro é o construtor/box-to-box** (sobe, liga com o 10, às vezes finaliza) — o famoso par 'Makélélé + Lampard' ou 'Casemiro + Kroos/Modrić'. Riscos: se os dois forem muito parecidos (dois destruidores), falta criação; se forem dois construtores, falta proteção. A **zona crítica é o espaço entre os dois 6s e os zagueiros**, onde o 10 adversário tenta receber. Conexões: o 10 da frente (a quem alimentam), os zagueiros (saída a 4+2) e os laterais (cobrem suas subidas). É a formação mais 'confortável' para a posição.

**4-1-4-1**

**O pivô único MAIS protegido e mais ancorado de todos.** Aqui o 6 é o '1' isolado entre a defesa e uma linha de 4 à frente. **A formação foi praticamente desenhada em torno dele:** ele é a única peça naquela faixa, então sua disciplina posicional é tudo. Diferença para o 4-3-3: à frente dele há uma **linha de 4 inteira** (não 2 oito), o que significa mais ajuda para fechar os meios-espaços defensivamente — então ele pode ser um **âncora mais posicional**, menos box-to-box. Tarefas: ser o pêndulo de saída (sair a 3 com os zagueiros), proteger o miolo, e ligar para a linha de 4 à frente. Risco: na transição ofensiva, ele pode ficar muito isolado da linha de 4 (que sobe junta), virando o único elo — se erra o passe, o time fica partido. Valoriza o 6 do tipo regista-âncora (organiza e protege) mais que o box-to-box. Conexões: zagueiros e os 4 meias à frente, que ele municia.

**3-5-2 / 3-4-1-2**

**O 6 ganha um 'colchão' de 3 zagueiros atrás — muda tudo na exposição.** Com três zagueiros, o 6 tem mais cobertura nas costas e pode **subir e arriscar mais** no pressing e na construção, porque há sempre um zagueiro extra para tapar. No 3-5-2 há tipicamente um **trio de meio (1-2 ou 2-1)**: o 6 pode ser o pivô único à frente da linha de 3 (com dois 8s/carrileros à frente) OU parte de um duplo pivô (no 3-4-1-2/3-4-2-1). **A formação valoriza o 6 construtor**, porque a saída a 3 atrás + 6 à frente cria superioridade fácil contra a primeira pressão. Função-chave: ligar os 3 zagueiros aos alas (wing-backs), que são a fonte de largura e sobem muito — quando o ala sobe, o 6 desliza para cobrir aquela faixa, virando quase um 4º zagueiro temporário. Risco: se os dois atacantes não pressionam a saída adversária, o 6 fica sobrecarregado contra o meio. Conexões: os 3 zagueiros (saída), os alas (cobertura), e o 10/2 atacantes (passe vertical).

**3-4-3 / 3-4-2-1**

**Quase sempre um DUPLO PIVÔ sobre uma linha de 3.** O '4' do meio normalmente é 2 volantes + 2 alas, então a base do meio é uma **dupla de 6s** protegida por três zagueiros — combinação que dá **muita segurança central**. Isso libera os alas para subirem como pontas e os dois meias-atacantes (no 3-4-2-1) para flutuarem nos meios-espaços. **Valoriza o duplo pivô equilibrado:** um segura, o outro liga. Como há 3 zagueiros + 2 volantes, o centro fica densíssimo — difícil de penetrar. Tarefas dos 6s: blindar o miolo, cobrir as subidas dos alas (faixa enorme a cobrir), e municiar os meias-atacantes/ponta. Risco: a largura toda depende dos alas; se o adversário fixa os alas embaixo, os 6s precisam gerar a progressão sozinhos pelo meio (que está lotado). Conexões: trio de zaga, os dois alas e os meias da frente. É uma das estruturas mais sólidas defensivamente para a posição.

**5-3-2 / 5-4-1 (bloco de 5)**

**Formação de bloco/contenção — o 6 vira coberturista posicional, não protagonista.** Com 5 defensores e bloco baixo, o time abre mão da posse e prioriza fechar espaços. No **5-3-2**, há um trio de meio onde o 6 é o homem central que **protege a frente dos 3 zagueiros** e cobre o espaço entre linhas em bloco médio/baixo. No **5-4-1** ele faz parte de uma linha de 4 muito compacta, com pouquíssima licença para subir. **A formação 'apaga' o 6 criativo e valoriza o 6 destruidor/posicional:** quase não há saída construída elaborada — o foco é varrer segundas bolas, cobrir e ligar transições rápidas para os atacantes. Na transição ofensiva, o 6 faz o **primeiro passe vertical** para lançar os 2 atacantes (no 5-3-2) e some de novo. Risco: o time tem pouca bola, então o 6 toca pouco; mas qualquer erro dele no bloco baixo é fatal porque há pouca margem. Conexões: os 3 zagueiros (com quem forma um bloco quase contínuo) e os atacantes (alvo da transição). Aqui o 6 'destrói e devolve', não 'organiza'.

**4-3-1-2 (sem pontas)**

**Variante do losango — pivô único exposto pelos flancos, mas com mais ajuda central que o diamante puro.** Estrutura: 4 defensores, 1 volante na base (o 6), 2 'interiores'/8s à frente dele, 1 meia (10) e 2 atacantes. Sem pontas de origem, a **largura vem só dos laterais** — então o 6 e os 8s precisam **deslizar para cobrir os flancos** quando os laterais sobem. **A formação valoriza um 6 com boa cobertura lateral e os 8s que ajudam a fechar.** Diferença para o 4-4-2 losango: aqui há 2 interiores à frente do 6 (em vez do diamante mais fechado), o que dá um pouco mais de proteção nos meios-espaços. Tarefas: sustentar o centro congestionado (o jogo fica muito 'por dentro'), cobrir as costas dos laterais, e ser o pivô da saída. Risco: igual ao diamante — vulnerável a times de pontas abertas que atacam as faixas que o 6 não consegue cobrir sozinho. Conexões: os 2 interiores (triângulos centrais), o 10 (à frente) e os laterais (cobertura de flanco). Densidade central altíssima, flancos como calcanhar de Aquiles.

#### Parcerias-chave

**Com os ZAGUEIROS (a parceria mais íntima):** o 6 é a "terceira opção de saída". Os zagueiros precisam de um 6 que ofereça passe constante e saiba quando cair entre eles (salida lavolpiana) para virar trio. Quanto melhor o 6 recebe sob pressão, mais a zaga pode jogar de pé em vez de chutar. Inversamente, um 6 que não dá opção condena a zaga ao chutão. Eles também dividem a cobertura da profundidade.

**Com os 8s / meias interiores (a parceria que define o trio de meio):** num pivô único, os 8s são a **vida ou morte** do 6. Eles têm que **revezar a cobertura central** quando o 6 sobe e **fechar os meios-espaços** que ele não alcança. O 6 organiza atrás; os 8s correm na frente e por ele. Sem 8s trabalhadores, o melhor 6 do mundo fica isolado (é por isso que Rodri precisa de um De Bruyne/Bernardo que also defenda, e Busquets precisava de Xavi/Iniesta que recuavam).

**Com o parceiro de DUPLO PIVÔ (a parceria do espelho):** num duplo, a regra de ouro é **nunca os dois na mesma altura ao mesmo tempo** — um sobe, o outro cobre, num balanço constante. A divisão ideal é **complementar** (destruidor + construtor), não redundante. A comunicação entre os dois decide a solidez do centro.

**Com os LATERAIS / ALAS (a parceria da cobertura):** quando o lateral sobe, alguém cobre a faixa que ele deixou — muitas vezes é o 6 deslizando para o lado (vira "lateral temporário"). Em sistemas de 3 zagueiros com alas, essa cobertura é ainda mais demandante. O 6 é o "bombeiro" das subidas laterais.

**Com o 10 / camisa 10 (a parceria vertical defensiva):** o 6 é o anti-10 do próprio time E o alimentador do 10 da frente. Defensivamente, ele neutraliza o 10 adversário (tira o espaço entre linhas). Ofensivamente, o melhor passe que ele dá é o quebra-linha que coloca o SEU 10 de frente para o gol.

**Com o 9 (indireta, mas existe):** os melhores lançamentos verticais que pulam o meio inteiro saem do pé de um regista direto para o 9. A parceria 6-construtor → 9 é a "tomada de atalho" do time (Kroos → Benzema é o exemplo histórico recente).

#### Exemplos de elite

**ATUAIS (2023-2026) — `consenso` sobre o estilo, com nota de confiança onde cito dado específico:**

- **Rodri (Manchester City / Espanha)** — o **6 completo de referência da era**. Junta organização (regista), recuperação (destruidor) e chegada à área (gols decisivos). `verificado-fetch`: venceu a **Bola de Ouro 2024**, raríssimo para um volante, o que sinaliza o quanto a posição passou a ser valorizada. Arquétipo: regista-completo.
- **Declan Rice (Arsenal / Inglaterra)** — evoluiu de destruidor puro (West Ham) para um **6 que conduz a bola e chega à área** (box-to-box moderno). Arquétipo: destruidor → híbrido carregador.
- **Casemiro (versão recente)** — protótipo do **destruidor clássico** que cobre e desarma; menos criação, máxima proteção. Histórico recente no Real Madrid o consagrou como a âncora de um meio com Kroos/Modrić.
- **Joshua Kimmich (Bayern)** — **regista/organizador** que também já jogou de lateral; visão de passe e cobranças. Arquétipo: construtor-organizador.
- **Aurélien Tchouaméni (Real Madrid / França)** — destruidor moderno com saída de bola; protege e dá o primeiro passe limpo.

**REGISTA / DEEP-LYING PLAYMAKER (organizadores):**
- **Sergio Busquets** — o **modelo histórico-recente do regista posicional**: quase nunca corria, mas estava sempre no lugar certo, cortando linhas e organizando. Referência de "inteligência > físico".
- **Jorginho** — regista de toque e ritmo, cobrador de pênalti com o característico "pula-pula".
- **Toni Kroos (aposentado em 2024)** — `verificado-fetch`: encerrou a carreira após a Euro 2024; foi o **maestro de passe** que ditava o Real Madrid; lançamentos verticais para o 9 viraram assinatura.

**DESTRUIDORES (ball-winners):**
- **N'Golo Kanté** — o **destruidor-arquétipo** da última década: cobertura, antecipação e energia que "parece dois jogadores". Referência de ball-winner.

**HISTÓRICOS (definem os arquétipos):**
- **Claude Makélélé** — deu nome à função ("o **papel Makélélé**" = o destruidor-âncora puro à frente da zaga). Marco zero do 6 defensivo moderno.
- **Andrea Pirlo** — redefiniu o **regista** ao recuar de 10 para a base, virando deep-lying playmaker; batedor de faltas de elite.
- **Xabi Alonso** (como jogador) — construtor de passe longo de classe mundial; hoje técnico de elite, o que reforça o quanto a leitura de jogo do 6 vira repertório de treinador.
- **Sergio Busquets / Yaya Touré (box-to-box)** — polos opostos do mesmo cargo na mesma era, úteis para mostrar o espectro.

**Nota de confiança:** os perfis/arquétipos são `consenso`. Os marcos pontuais sinalizados (`verificado-fetch`: Bola de Ouro de Rodri 2024, aposentadoria de Kroos 2024) são fatos amplamente conhecidos até o cutoff; se o produto for exibir como afirmação factual datada, vale um fetch de confirmação na hora.

#### Erros comuns / como falha

**Como a posição falha (o que um treinador de elite cobra):**

**1. Subir na hora errada (o erro mais caro):** o 6 acompanha o ataque e some da base; o time perde a bola e não há ninguém na frente da zaga. Sinal de mau desempenho: o adversário cria chances "pelo meio" logo após o time perder a bola no ataque. Cobrança do treinador: *"resto! fica de resto!"* (mantenha-se de equilíbrio).

**2. Deixar-se arrastar / perder a referência de zona:** sair correndo atrás da bola e abandonar o espaço central, abrindo a janela para o 10 adversário receber de frente. O bom 6 protege a ZONA, não persegue a bola.

**3. Erro de passe na saída sob pressão (o 'turnover' perigoso):** perder a bola na própria saída entrega uma chance limpa — porque ele está na frente da própria zaga. Um 6 que não recebe virado ou que não tem coragem/técnica para o passe sob pressão vira passivo do gol. Sinal: muitos erros de passe na própria meia-lua.

**4. Lentidão de giro / 'pego de costas':** receber sempre de costas e não conseguir virar = jogo lento, previsível, sempre pra trás. O time não progride. Falta de **scanning** é a causa-raiz.

**5. Falta tática mal-executada / cartões:** o 6 comete muitas faltas no miolo. A falta "boa" (parar o contra-ataque sem cartão) é arte; a falta atrasada, frustrada ou desnecessária vira **cartão amarelo/vermelho** — e o 6 é, estatisticamente, dos jogadores que mais levam amarelo por acúmulo de faltas táticas. Sinal de mau jogo: amarelo cedo que o obriga a "jogar de meia-força" o resto da partida.

**6. Inferioridade numérica não resolvida:** num pivô único contra um trio de meio, se o 6 não recebe ajuda dos 8s, o time **perde o meio-campo** — sintoma clássico de "o time não consegue ter a bola" ou "está sempre correndo atrás".

**7. Passar sempre seguro (o regista covarde) ou sempre arriscar (o afobado):** o equilíbrio entre o passe que mantém e o passe que vence é a essência. Errar muito para um lado = posse estéril (nunca fura) ou perdas perigosas (sempre devolve).

**8. No duplo pivô: os dois subirem juntos:** quebra a regra do espelho e deixa a base vazia. Cobrança: comunicação e disciplina de revezamento.

**Resumo do que o treinador observa primeiro:** posicionamento na perda de bola (transição defensiva), qualidade do primeiro passe sob pressão, e disciplina de zona. Um 6 falha mais por **decisão e posição** do que por falta de talento.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**Sempre como vocabulário EXPLICATIVO/gerador de hipóteses, ancorado ao número do mercado que nunca move — nunca como edge.**

**GOLS (over/under, time do gol):**
- A **qualidade do 6 na construção** ajuda a explicar a *capacidade de um time furar bloco baixo* (regista bom → mais entradas perigosas) — útil para narrar por que um favorito "deveria" criar.
- A **fragilidade central** (6 ausente/arrastado/sobrecarregado no pivô único exposto, ex.: losango contra pontas) é uma hipótese explicativa para *gols sofridos pelo meio* e jogos mais abertos.
- O **estilo de pressing** (lido via PPDA, regulado pelo 6): pressing alto → jogos mais "partidos" e mais transições → hipótese de mais chances dos dois lados.

**ESCANTEIOS:**
- Um 6 **coberturista forte na borda da área** tende a apagar segundas bolas e chutes de fora → hipótese explicativa de *menos pressão sustentada* (e indiretamente menos escanteios gerados por rebotes) contra esse time.
- Time que **não fura pelo meio** (sem regista) tende a empurrar o jogo para cruzamentos e chutes de fora → hipótese de *mais escanteios* gerados.

**CARTÕES (jogador e total):**
- O 6 é um dos **maiores candidatos a amarelo** do time por **faltas táticas** na transição defensiva. Pivô único exposto, time que defende muito (5-3-2, losango), ou 6 destruidor agressivo → hipótese explicativa de *propensão a cartão* desse jogador/posição. **Sempre explicativo, ancorado à linha do mercado.**
- Jogo "partido" com muitas transições (pressing alto) → mais faltas no miolo → hipótese de mais cartões totais.

**ASSISTÊNCIAS / PROPS DE JOGADOR:**
- Um **regista/construtor** (Kroos, Kimmich, Trent recuado) é hipótese explicativa para *props de passe/assistência/key passes* — ele é a fonte de lançamentos verticais. Útil para narrar por que tal jogador "toca a criação".
- Um **destruidor puro** raramente entra em props ofensivos — gancho para explicar *baixa probabilidade de assistência/gol* desse perfil.

**PROPS DEFENSIVOS DE JOGADOR (desarmes, interceptações, faltas):**
- O 6 é, por construção, o **líder natural de desarmes + interceptações + faltas cometidas** do time. Ótimo para *explicar* por que esse jogador domina props defensivos — o destruidor ainda mais. Ancorado à linha; explicativo, não preditivo.

**JOGO AÉREO:**
- O 6 geralmente NÃO é alvo aéreo ofensivo (fica de equilíbrio) → gancho para explicar *baixa expectativa de gol de cabeça* dele. Exceções: 6 alto que sobe em escanteio.

**Carimbo obrigatório de uso:** todos os itens acima são **camada EXPLICAR** — geram a narrativa do "porquê" e levantam hipóteses para o leitor entender o jogo. O número do mercado/quant é a âncora e **nunca se move** por causa dessas leituras. Nada aqui é "dica por posição" nem "edge".

---

### Meio-campista box-to-box (camisa 8)

#### Resumo didático

**O que é, em uma frase:** o box-to-box (lê-se "bóx-tu-bóx", literalmente "de área a área") é o meio-campista mais **completo e mais cansado** do time — ele defende perto da própria área e ataca chegando na área adversária, dentro do mesmo lance às vezes. É o **motor** (em inglês "engine", termo que treinadores usam) que liga as duas pontas do campo.

**Por que ele existe:** um time de futebol tem quatro "andares" — goleiro, defesa, meio e ataque. O meio-campo é onde o jogo é ganho ou perdido, porque é por ali que a bola precisa passar para sair da defesa e chegar ao ataque. O box-to-box é o cara que **percorre esse andar inteiro de cima a baixo**, repetidamente, durante os 90 minutos. Quando o time perde a bola, ele corre para trás para ajudar a defender. Quando o time recupera, ele corre para frente para ajudar a atacar — e muitas vezes é ele quem aparece dentro da área para finalizar.

**A camisa 8:** no futebol, as posições têm "números clássicos". O **6** é o volante mais recuado (o que fica sentado na frente da zaga, em inglês "holding"). O **10** é o meia mais avançado e criativo (o "cérebro" ofensivo). O **8** fica **no meio dos dois** — é o elo. Por isso a camisa 8 virou sinônimo do box-to-box: ele não é nem o mais defensivo nem o mais ofensivo, é o que **faz um pouco de tudo e cobre o campo todo**.

**A diferença que define a posição:** outros meio-campistas se especializam — um defende, outro cria. O box-to-box é definido justamente por **NÃO se especializar**: ele tem que ser bom o suficiente em defender, passar, conduzir a bola, finalizar e disputar bola aérea — tudo ao mesmo tempo — e ter **fôlego de maratonista** para repetir isso o jogo inteiro. Treinadores costumam dizer que ele é o jogador que "mais corre" e o que "mais aparece nas estatísticas de distância percorrida". Pense nele como o **pulmão e as pernas** do time no meio-campo.

#### Perfil e arquétipos

**Atributos físicos (a base de tudo):**
- **Resistência aeróbica de elite** — é o atributo número 1. Ele corre tipicamente entre 11 e 13 km por jogo, frequentemente o mais alto do time. Sem motor, nada do resto importa.
- **Capacidade de repetir sprints** (em inglês "repeated sprint ability") — não basta correr muito; ele precisa fazer arrancadas explosivas, recuperar e fazer outra logo em seguida.
- **Força no duelo** — disputa bola dividida, segura marcação de costas, ganha o "segundo bola" (a sobra de uma dividida).

**Atributos técnicos:**
- **Passe competente em movimento** — não precisa ser o passe-perfeito do camisa 10, mas tem que circular a bola sob pressão e dar o passe progressivo (que avança o time) quando aparece.
- **Condução de bola** (em inglês "ball carrying") — capacidade de pegar a bola e **arrancar conduzindo** por 20-30 metros, furando linhas. Esse é o atributo que mais valorizou na última década.
- **Finalização de chegada** — não a do artilheiro, mas a do jogador que aparece de surpresa na área e bate de primeira ou cabeceia.

**Atributos mentais/táticos:**
- **Leitura de momento** (timing) — saber **quando** subir e **quando** ficar. Subir na hora errada deixa o time exposto.
- **Inteligência espacial** — encontrar os corredores internos (entre a linha de meio e a zaga adversária).
- **Disciplina posicional alternada** — ele tem liberdade, mas tem que se coordenar com o parceiro de meio.

---

**ARQUÉTIPOS (sub-papéis) — a diferença prática:**

**1. Box-to-box clássico / "engine" (motor):** o equilibrado puro. Defende, constrói e chega na área em volumes parecidos. É o "all-rounder". Exemplo de molde: o Steven Gerrard maduro, o Arturo Vidal. *Diferença prática:* é o mais previsível e o mais sustentável taticamente — não desorganiza o time.

**2. Box-to-box "carrileiro" / progressor por condução (ball-carrier):** a evolução moderna. O peso dele está em **pegar a bola e conduzir furando linhas** — ele é uma transição ambulante. Exemplo atual: **Federico Valverde** (Real Madrid) — "defende como destruidor, conduz como ponta, finaliza como atacante" [verificado-fetch]. *Diferença prática:* gera perigo carregando a bola sozinho; precisa de espaço pra correr (brilha mais contra times que se abrem).

**3. Box-to-box "chegador" / late-arriving (atacante de segunda linha):** o peso está na **chegada à área**. Ele é quase um terceiro atacante que vem de trás, especialista em aparecer atrasado na área ("late run"). Exemplo molde: Frank Lampard (recorde de gols de um meia), e a evolução de **Jude Bellingham** no Real Madrid (14 gols, 9 assistências em 27 jogos de La Liga numa temporada) [verificado-fetch]. *Diferença prática:* infla números de gol/finalização do meio; é o "fantasma" que o zagueiro perde.

**4. Box-to-box "destruidor-construtor" / ball-winning all-action:** o peso está na **recuperação de bola e volume defensivo**, mas com pernas pra subir. Exemplo: **Declan Rice** (Arsenal), Yves Bissouma. *Diferença prática:* dá lastro defensivo ao time que sobe muito; é a apólice de seguro com mobilidade.

**5. "Mezzala" (meia-ala, termo italiano):** um box-to-box que joga **mais por dentro e mais alto, num dos lados** (esquerda ou direita do meio), associando-se ao lateral e ao ponta daquele lado. É o box-to-box de um 4-3-3. *Diferença prática:* o raio de ação dele é diagonal e lateralizado, não vertical-central. Molde clássico moderno do papel.

> **Nota de domínio (consenso):** a tendência 2023-2026 fundiu o box-to-box com o camisa 10. Bellingham é o exemplo: começou box-to-box e "evoluiu para o meia atacante mais completo do mundo" [verificado-fetch]. A linha entre "8 chegador" e "10 que recua" ficou borrada — é o arquétipo dominante da elite atual.

#### Os 4 momentos do jogo

**1. ORGANIZAÇÃO OFENSIVA (time com a bola, jogo construído):**
O box-to-box é o **elo de circulação e progressão**. Na construção, ele oferece linha de passe entre a zaga/volante e o setor ofensivo — frequentemente recebe de frente para o gol ou de meio-perfil. A função-chave é **progredir a bola**: ou por passe entre linhas, ou conduzindo. Conforme o ataque amadurece, ele faz a **chegada à área** (movimento de "third man" / terceiro homem, e corridas atrasadas). Ele transforma o ataque de "10 contra 11" num momentâneo "11 contra 10" ao aparecer na área. Ocupa os **corredores internos** (meias-luas entre lateral e zagueiro adversário) pra puxar marcação e abrir espaço para ponta e atacante.

**2. ORGANIZAÇÃO DEFENSIVA (time sem a bola, adversário construído):**
Ele é tipicamente **o meio-campista mais ativo defensivamente** [verificado-fetch]. Tarefas: marcar o camisa 8/10 adversário, fazer cobertura sobre o volante, fechar os corredores internos por onde o adversário tenta progredir, e disputar segunda bola. Num bloco médio/baixo, ele compõe a linha de meio (numa linha de 4 ou de 3 dependendo da formação) e precisa de disciplina pra **não ser atraído pra fora da posição** — o gap que ele deixa é perigoso.

**3. TRANSIÇÃO OFENSIVA (acabou de recuperar a bola — o contra-ataque):**
Aqui o arquétipo "carrileiro" brilha: o box-to-box é frequentemente **quem carrega a bola no contra-ataque**, fazendo a ponte entre recuperar e finalizar. Ele ou conduz furando o campo aberto, ou faz a corrida de apoio/ultrapassagem para receber em velocidade. Valverde é o emblema disso [verificado-fetch]. O timing da corrida dele decide se o contra-ataque vira 3-contra-2 ou morre.

**4. TRANSIÇÃO DEFENSIVA (acabou de perder a bola — o contrapressing / recomposição):**
Momento mais brutal pra ele fisicamente. Se ele estava subido (chegando na área) e a bola é perdida, ele tem que **recompor correndo 40-50 metros pra trás**, ou fazer **contrapressing imediato** (pressionar na hora da perda pra recuperar em 5 segundos — o "gegenpressing"). A capacidade de fazer isso **repetidamente** é o que separa o box-to-box de elite. O erro clássico é "ficar de fora do lance" depois de uma chegada frustrada — e aí o time defende com um a menos no meio.

#### Zonas ocupadas e gaps deixados

**Corredores/zonas que ocupa:**
- **Corredor central e meias-luas (half-spaces / corredores internos):** o habitat natural. O box-to-box vive nos **half-spaces** — as faixas verticais entre o meio do campo e as laterais (nem totalmente centro, nem totalmente beirada). É daí que ele recebe entre linhas e ataca a área em diagonal. Como diz a literatura tática, ele faz o estrago "ocupando os canais internos entre o meio-campo e a defesa adversária, forçando o adversário a sair pra marcá-lo e abrindo buracos pra atacantes e pontas" [verificado-fetch].
- **Zona 14 (a área logo à frente da grande área adversária, no centro):** zona de chegada e finalização.
- **Verticalmente:** ele cobre da própria meia-lua defensiva até a meia-lua ofensiva — daí o nome "de área a área".

**Espaço que ABRE para os parceiros:**
Quando ele puxa marcação no corredor interno, **arrasta um zagueiro ou volante adversário pra fora**, abrindo o corredor pro ponta entrar por dentro ou pro lateral subir por fora. A presença dele na área também "trava" zagueiros, liberando o atacante.

**Espaço que DEIXA EXPOSTO (o gap):**
Esse é o ponto crítico do dossiê. **Quando o box-to-box sobe, ele esvazia o meio-campo central.** O buraco que fica é o **corredor central na frente da zaga** — exatamente por onde um adversário inteligente lança o contra-ataque. 

**Como o adversário explora a ausência dele:**
- **Contra-ataque pelo meio:** assim que o time perde a bola com o 8 subido, o adversário busca o homem livre no centro (o que era marcado pelo 8) e ataca o espaço.
- **Atração e troca de lado:** o adversário atrai o 8 pra um lado e inverte rápido pro outro, onde o time fica desfalcado.
- **Superioridade no meio:** se o 8 sobe sem coordenação com o volante e o outro meia, o adversário fica **3 contra 2 no meio** e domina a posse.

> **Regra de treinador (consenso):** "nunca os dois 8 sobem ao mesmo tempo sem cobertura". A organização do meio depende de **alternância** — um sobe, o outro segura. Quando essa alternância quebra, o gap central vira gol sofrido.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo:**
O box-to-box é peça importante na defesa de bolas alçadas, mas **fora da primeira zona** (a zaga pega a primeira bola). A função dele é a **segunda bola** ("second ball" — a sobra que cai fora da área após o primeiro cabeceio). Ele também marca a "rebarba" no escanteio: muitos esquemas colocam o 8 marcando **a entrada da área / o ponto de pênalti** ou fazendo a marcação por zona na meia-lua, justamente pra varrer rebotes e impedir chute de fora. Em escanteios, é comum o box-to-box ser o **homem do contra-ataque** posicionado na entrada da área pra sair correndo se o time recuperar.

**Jogo aéreo ofensivo:**
O arquétipo "chegador" é **arma de escanteio e falta ofensiva**. Ele entra na área como **segundo onda de ataque** — não disputa o primeiro pau com os zagueirões, mas ataca a sobra, o recuo de cabeça, ou faz a chegada na meia-lua pra bater de primeira. Box-to-box com bom cabeceio (tipo Bellingham, Vidal) marca muito gol de cabeça vindo de trás, porque o marcador o perde no movimento.

**Bola parada — função por tipo:**
- **Escanteio defensivo:** marcação na entrada da área / segunda bola / ponto de partida do contra-ataque.
- **Escanteio ofensivo:** chegada de segunda onda; às vezes batedor curto na jogada ensaiada.
- **Falta lateral ofensiva:** ataca a área ou faz a sobra na entrada pra finalização de fora.
- **Falta frontal:** raramente o batedor (isso é do 10 ou do especialista), mas pode ser o "muro falso" ou o que ataca o rebote.
- **Lateral (arremesso):** participa do triângulo de tabela pra reter posse; no ataque, faz o movimento de receber e girar.
- **Pênalti:** pode ser cobrador se for finalizador confiável (o arquétipo chegador frequentemente é), mas não é função inerente da posição.

> **Gancho para o produto (consenso):** a presença de um box-to-box "chegador" de bom jogo aéreo num time **aumenta a ameaça em escanteios e a contagem de finalizações de segunda linha** — é vocabulário explicativo pra mercados de escanteios/finalizações, nunca um edge.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha defensiva:**
- **Time com linha alta:** o box-to-box defende mais espaço aberto às costas e tem que ser rápido na recomposição — mas em compensação joga mais perto da área adversária e participa mais do ataque. Times de linha alta (Guardiola, Klopp) **exigem mais do motor** do 8 porque o campo a cobrir na transição defensiva é gigante.
- **Time com linha baixa (bloco baixo):** o box-to-box fica mais comprimido, com menos espaço pra subir; vira mais "marcador + carregador de transição". O valor dele migra do volume de chegada pra capacidade de **carregar a bola sozinho no contra-ataque** (já que o time defende fundo e ataca em transição).

**Espaço entre linhas:**
O box-to-box é **gestor do espaço entre linhas** nos dois sentidos. Ofensivamente, ele **ocupa** esse espaço (entre meio e zaga adversários) pra receber e progredir. Defensivamente, ele **fecha** esse espaço pra que o 10 adversário não receba ali. A qualidade dele em "achar" e "tampar" esse espaço entre linhas é o que mais o distingue de um volante puro.

**Pressing / contrapressing / PPDA:**
- **PPDA** (passes permitidos por ação defensiva — métrica de intensidade de pressão; quanto **menor**, mais o time pressiona alto) cai quando há box-to-box de bom motor: ele é o gatilho de pressão no meio-campo, saltando pra cima do portador.
- No **contrapressing**, ele é peça central: pressiona na hora da perda. Mas há um **trade-off físico** brutal — pressionar alto + recompor + subir pra atacar é uma carga que só motores de elite sustentam 90 minutos. Por isso muitos box-to-box "morrem" no último terço do jogo (queda de intensidade nos minutos finais), o que é vocabulário explicativo relevante (consenso) — times trocam o 8 cedo ou o ritmo do meio cai após os 70'.

> **Cruzamento tático (consenso):** quanto mais alto o bloco e mais agressivo o pressing, **mais o box-to-box é exigido e mais cedo ele se desgasta** — relevante pra entender quedas de intensidade e janelas de jogo nos minutos finais.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**Formação que mais EXIGE o box-to-box puro — talvez o lar histórico dele.** No 4-4-2 com duas linhas de 4, os dois meias centrais formam a 'dupla' do meio. Como há só **dois** homens no centro contra times que botam três, eles vivem em desvantagem numérica e precisam cobrir muito chão. A divisão de tarefas clássica: um meia mais 'segurador' (holding) e o outro o box-to-box que sobe — mas na prática **os dois precisam ser box-to-box alternados**, porque o gap central é enorme. Tarefas: cobrir o meio inteiro, sair pra dar suporte aos lados (já que os pontas no 4-4-2 são mais defensivos), e fazer a chegada pra apoiar os dois atacantes. **Risco máximo:** se os dois sobem juntos, o meio fica escancarado — o 4-4-2 é notoriamente vulnerável a times com 3 no meio. **A formação valoriza muito o motor e a inteligência de alternância;** apaga o box-to-box criativo/técnico (não há espaço pra refinamento, é trabalho braçal). Conecta-se com: o parceiro de dupla (alternância obrigatória) e os atacantes (chegada).

**4-4-2 em losango (diamante)**

**Formação que MULTIPLICA box-to-box — o losango usa dois 8 como 'pernas do diamante'.** O meio em losango tem: um volante na base, dois meias pelos lados do diamante (os '8' / interiores) e um 10 na ponta. Os **dois interiores são box-to-box clássicos**, mas com um detalhe: eles defendem os corredores internos/laterais porque **o losango não tem pontas** — então os 8 precisam dar a largura defensiva e cobrir os laterais adversários junto com os laterais próprios. Tarefas: marcar em diagonal pra fora, subir pra apoiar o 10 e os atacantes, cobrir o volante. **Liberdade ofensiva alta**, mas **carga lateral defensiva pesadíssima** (eles correm pra fora e pra dentro o tempo todo). A formação **valoriza ao extremo o fôlego e a versatilidade lateral** do box-to-box. Conecta com: laterais (sobreposição/cobertura), o 10 (triângulos centrais) e o volante (rotação).

**4-3-3**

**A formação onde o box-to-box vira 'mezzala' (meia-ala) — o arquétipo moderno por excelência.** No trio de meio do 4-3-3 (geralmente um 6 e dois 8), os dois 8 jogam como **mezzale**: cada um num half-space, mais alto que o volante, associando-se ao ponta e ao lateral do seu lado. Tarefas: progredir por dentro, fazer triângulos com lateral+ponta, chegar na área pela meia-lua, e na defesa pressionar/marcar o interior adversário. **É a formação que mais valoriza o box-to-box técnico-ofensivo** (Bellingham/Valverde/Pedri jogam aqui [verificado-fetch]). O 6 dá a cobertura que permite os 8 subirem com mais segurança que no 4-4-2. **Risco:** se o ponta do mesmo lado é muito ofensivo e o lateral sobe, o flanco fica exposto quando o 8 também sobe. Conecta com: volante (cobertura), ponta+lateral do seu lado (trio de banda), atacante (chegada).

**4-2-3-1**

**Formação que tende a SEGURAR um pouco o box-to-box — ele divide o meio num duplo pivô.** No 4-2-3-1, há **dois volantes** (duplo pivô) atrás de um 10. Um dos dois do pivô pode ser um box-to-box, mas com **freio**: como há só dois ali e um 10 que não defende muito, o box-to-box tem que equilibrar — ele sobe pra apoiar o 10 e o atacante, mas o parceiro de pivô o obriga a uma disciplina maior. **O papel migra do 'chegador livre' pro 'box-to-box controlado / progressor que volta'.** A chegada à área existe, mas é mais escolhida (timing) que constante. A formação **valoriza o box-to-box equilibrado e inteligente**, e **apaga o chegador puro** (não dá pra subir sempre). Conecta com: o outro volante (equilíbrio obrigatório), o 10 (ele dá a saída pro 10, que dá o passe final), o atacante.

**4-1-4-1**

**Formação que LIBERA o box-to-box — a melhor moldura pro 8 chegador.** No 4-1-4-1 há **um único volante (o 1)** protegendo a zaga, e uma linha de **quatro** à frente onde os dois meios centrais são box-to-box quase sem amarras. Como o volante solitário cobre as costas, **os dois 8 têm licença pra subir de verdade** e atacar a área junto com o atacante e os pontas. Tarefas: chegar na área constantemente, pressionar alto, ocupar half-spaces. **É talvez a formação que mais favorece o arquétipo 'late-arriving' (chegador)** — explica times que metem muito gol de meio-campo. **Risco:** tudo desaba sobre o volante único; se os dois 8 somem na transição, é 3-contra-1 contra o pivô. A formação **valoriza o motor + faro de gol**; exige um volante de leitura excepcional pra bancar a liberdade dos 8. Conecta com: o volante (dependência total dele), pontas e atacante (chegada coletiva à área).

**3-5-2 / 3-4-1-2**

**Formação que dá ao box-to-box o melhor dos mundos — três zagueiros como rede de segurança.** Com **três zagueiros** atrás e alas (wing-backs) dando a largura, o meio central (no 3-5-2 tipicamente um volante + dois 8, ou no 3-4-1-2 um duplo pivô + um 10) ganha **cobertura defensiva extra**. Isso **solta o box-to-box pra subir com confiança**: se ele perde a bola lá em cima, há três zagueiros + volante pra segurar. Tarefas: progredir e chegar na área pra apoiar os dois atacantes, e na defesa fechar o meio (já que os alas cuidam dos flancos). **A formação valoriza muito o box-to-box** — é uma das estruturas onde ele rende mais com menos risco. **Risco residual:** se o ala adversário ganha o duelo, o 8 às vezes precisa ajudar lá fora, deixando o centro. Conecta com: alas (os alas cobrem a largura que o 8 não precisa cobrir), volante, dupla de atacantes.

**3-4-3 / 3-4-2-1**

**Formação que tende a SEGURAR o box-to-box num duplo pivô, mas com proteção de 3 zagueiros.** No 3-4-3 (e no 3-4-2-1), o meio é geralmente um **duplo pivô (dois homens)** atrás de três ofensivos. Aqui o box-to-box é mais 'pivô móvel' que chegador desenfreado: ele divide com o parceiro a tarefa de cobrir todo o meio, dá saída de bola e faz chegadas seletivas. Os **dois meias-atacantes (no 3-4-2-1) ou os pontas (no 3-4-3) já ocupam os half-spaces ofensivos**, então o espaço de chegada do 8 fica mais disputado. **A formação valoriza o box-to-box que constrói e equilibra**, e **apaga parcialmente o chegador** (o espaço de chegada já está ocupado pelos de cima). Compensação: os 3 zagueiros + alas permitem que, quando ele sobe, suba com lastro. Conecta com: o parceiro de pivô (divisão rígida), os meias-atacantes/pontas (a quem ele alimenta), alas.

**5-3-2 / 5-4-1 (bloco de 5)**

**Formação defensiva que TRANSFORMA o box-to-box em 'carregador de transição' — e quase apaga o chegador.** Com **cinco defensores** (3 zagueiros + 2 alas recuados formando linha de 5) e bloco baixo, o time defende fundo e ataca em contra-ataque. No 5-3-2, os dois 8 do trio de meio defendem muito (compõem o bloco, marcam por dentro) e, na recuperação, **a função vira carregar a bola sozinho campo afora ou correr pra dar a segunda opção** ao contra-ataque. No 5-4-1, o meio é ainda mais defensivo (linha de 4) e o box-to-box vira quase um quarto-volante. **A formação valoriza o motor defensivo + a condução de transição (arquétipo carrileiro), e apaga totalmente o chegador / mezzala criativo** — não há posse alta nem espaço de chegada. O 8 aqui é avaliado por quanto recupera e por quão bem inicia o contra-ataque. Conecta com: os dois atacantes (no 5-3-2, ele os alimenta na transição), alas (que viram pontas no contra-ataque), zagueiros (a quem ele protege).

**4-3-1-2 (sem pontas)**

**Variante do losango sem largura nas pontas — os dois 8 viram essenciais e sobrecarregados.** O 4-3-1-2 tem volante + dois 8 + um 10 + dois atacantes, **sem pontas**. Como não há largura ofensiva natural, **os dois box-to-box e os laterais têm que dar TODA a amplitude e cobertura lateral**. Os 8 abrem pra fora pra defender os flancos e correm pra dentro pra atacar — carga lateral semelhante à do losango. Ofensivamente, eles sobem pra dar superioridade central junto do 10 e dos dois atacantes (o time aposta em **saturar o centro**). **A formação valoriza enormemente o box-to-box completo e incansável** (fôlego + versatilidade lateral + chegada central), e **apaga o especialista** — não há lugar pra quem só faz uma coisa. **Risco:** os flancos vivem expostos se os 8 não cobrem bem; times com pontas rápidos exploram isso. Conecta com: laterais (parceria obrigatória de flanco), o 10 (triângulos centrais), a dupla de atacantes (chegada e tabelas).

#### Parcerias-chave

**Com o volante / camisa 6 (a parceria mais crítica):**
É a relação de **cobertura e alternância**. O 6 é a "rede de segurança" que permite o 8 subir. Toda vez que o box-to-box ataca a área, é o 6 quem fica protegendo o espaço que ele deixou. Sem um 6 de boa leitura, o box-to-box não pode se soltar — ou se solta e o time apanha de contra-ataque. **É a parceria que define quanta liberdade o 8 tem.**

**Com o outro 8 (quando há dois no meio):**
**Alternância coordenada** — a regra de ouro. Um sobe, o outro segura, e eles trocam. Quando os dois sincronizam essa "gangorra", o meio fica sempre coberto e sempre com chegada. Quando dessincronizam, o time ou fica passivo (os dois recuam) ou exposto (os dois sobem).

**Com o lateral do seu lado (no 4-3-3 / losango):**
A **dupla de progressão pela meia-banda**. Box-to-box e lateral fazem sobreposições e trocas de posição: se o lateral sobe por fora, o 8 ataca por dentro, e vice-versa. No 4-3-3 com mezzala, esse par + o ponta forma o **trio de banda** que destrói a defesa pelo lado.

**Com o ponta do seu lado:**
**Troca de corredor.** Quando o 8 ataca o half-space por dentro, ele puxa o lateral adversário e **abre o corredor pro ponta cortar pra dentro** ou receber por fora isolado. É uma das principais fontes de criação do 4-3-3.

**Com o camisa 10 / meia-atacante:**
**Divisão de criação e chegada.** Classicamente, o 10 dá o último passe e o 8 faz a corrida pra recebê-lo (ou o contrário). Na elite moderna, essa fronteira sumiu — Bellingham faz os dois papéis [verificado-fetch]. Quando coexistem, o 10 cria parado/entre linhas e o 8 chega em movimento.

**Com o(s) atacante(s) / camisa 9:**
**Quem trava e quem chega.** O atacante prende os zagueiros; o box-to-box aparece atrasado no espaço que o 9 abriu. É a parceria que gera o "gol de meio-campo".

#### Exemplos de elite

**ELITE ATUAL (2023-2026) — todos verificados em busca de junho 2026 [verificado-fetch]:**

- **Jude Bellingham (Real Madrid):** o exemplo emblemático do box-to-box evoluído. 14 gols e 9 assistências em 27 jogos de La Liga numa temporada, 5,2 conduções progressivas e 2,8 desarmes por 90 minutos — "o meio-campista de dois sentidos mais completo da Europa". Arquétipo **chegador + carrileiro** fundidos com o 10.
- **Federico Valverde (Real Madrid):** o protótipo do box-to-box moderno completo — "defende como um destruidor, conduz como um ponta, finaliza como um atacante". Arquétipo **carrileiro / all-action** por excelência.
- **Declan Rice (Arsenal):** arquétipo **destruidor-construtor** com pernas — base defensiva que sobe; citado entre os meias mais versáteis, "capazes de funcionar por toda a linha de meio".
- **Florian Wirtz (Liverpool, desde junho de 2025):** mais próximo do híbrido 8/10 criativo (59 gols e 63 assistências em 201 jogos pelo Leverkusen) — comparado a "o próximo De Bruyne". Arquétipo **mezzala criativo**.
- **Pedri (Barcelona):** box-to-box mais técnico/posse, mezzala de controle e progressão por passe.

**HISTÓRICOS que definem os arquétipos (consenso):**
- **Steven Gerrard** — o box-to-box completo de manual: defendia, conduzia, finalizava e batia. Arquétipo "engine" total.
- **Frank Lampard** — o **chegador** definitivo: maior artilheiro meio-campista da história da Premier League, mestre da corrida atrasada na área.
- **Arturo Vidal** — o **all-action** físico, duelos + chegada + cabeceio.
- **Yaya Touré** — o **carrileiro** de força, carregava a bola furando o campo inteiro.
- **Roy Keane / Patrick Vieira** — os destruidores-líderes box-to-box dos anos 90/2000.
- **Xabi Alonso, Andrea Pirlo** — *contra-exemplos úteis*: meio-campistas de elite que **NÃO eram box-to-box** (eram registas/regista profundo), pra marcar a fronteira do que a posição é e não é.

> **Rótulo de confiança:** dados numéricos específicos de Bellingham, Valverde, Wirtz e os rankings são [verificado-fetch] (busca jun/2026). Os moldes históricos e a categorização por arquétipo são [consenso] tático.

#### Erros comuns / como falha

**Como a posição FALHA — sinais e cobranças do treinador:**

**1. Romper a alternância (o erro nº 1):** subir ao ataque na hora errada, junto com o outro 8, deixando o meio escancarado. *Sinal:* o time sofre contra-ataques pelo centro logo após perder a bola no campo ofensivo. *Cobrança do treinador:* "quando você sobe, quem segura? Olha o teu parceiro antes de ir."

**2. Ficar de fora do lance na transição defensiva ("não voltar"):** depois de uma chegada frustrada, não recompor — e o time defende com um a menos. *Sinal:* o adversário tem sempre um homem livre no meio nos contra-ataques. *Cobrança:* "você atacou, perdeu, e parou. Tem que voltar correndo SEMPRE."

**3. Ser atraído pra fora da posição na defesa:** sair pra perseguir a bola e abrir o corredor interno. *Sinal:* o 10 adversário recebe livre entre linhas repetidamente. *Cobrança:* "segura tua zona, não corre atrás da bola."

**4. Cair de produção no fim do jogo (gestão de motor):** chegar gasto aos 70'+ e parar de subir / parar de pressionar. *Sinal:* a intensidade do meio despenca no último terço, o PPDA do time piora, o adversário passa a dominar a posse após os 70'. Isso é tão previsível que vira **vocabulário explicativo** sobre janelas finais de jogo (consenso).

**5. Chegar na área sem timing (chegar cedo ou tarde):** o chegador que perde o tempo da corrida — entra na área antes da bola (entra em impedimento ou some) ou tarde demais. *Sinal:* muitas corridas sem recompensa, gols de chegada que não saem.

**6. Querer ser o que não é:** o box-to-box braçal tentando fazer o passe do camisa 10 (perde bola em zona perigosa) ou o técnico tentando ser destruidor (chega atrasado nos duelos). *Cobrança:* "joga a tua função."

**7. Indisciplina tática no pressing:** saltar pra pressionar sozinho sem o time subir junto — fura a linha e deixa passe nas costas. *Sinal:* o adversário rompe o pressing exatamente pelo espaço que ele deixou.

**8. Volume sem qualidade:** correr 13 km mas correr "errado" — muita distância, pouca influência no jogo. *Sinal:* estatística de distância alta, baixa participação em ações decisivas. É o erro mais traiçoeiro porque "parece" que ele jogou bem.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**SEMPRE explicativo-não-preditivo, ancorado no número do mercado, jamais edge.**

**GOLS (especialmente gols de fora da área / de segunda linha):** um box-to-box do arquétipo **chegador** num sistema que o libera (4-1-4-1, 3-5-2) é fonte narrativa de **gols vindos do meio-campo**. Serve pra EXPLICAR por que um time marca de fora ou em chegadas de segunda onda — gancho pra contexto de mercados de gols/finalizações, nunca afirmação de valor.

**FINALIZAÇÕES (volume e de fora da área):** o carrileiro e o chegador inflam a contagem de **finalizações de meio-campo**. Vocabulário pra explicar de onde vêm os chutes de um time, ancorado ao número.

**ESCANTEIOS:** box-to-box que ataca segunda onda + bom jogo aéreo → **mais ameaça e mais finalizações em escanteios** (e o 8 frequentemente é o homem de segunda bola). Explica geração/defesa de escanteios. Também relevante: o 8 como **iniciador de contra-ataque a partir do escanteio defensivo**.

**ASSISTÊNCIAS:** o mezzala/box-to-box técnico que progride e dá o penúltimo/último passe alimenta o vocabulário de criação — quem **abre o corredor** pro ponta ou pro 9.

**CARTÕES:** o arquétipo **destruidor / all-action** que faz muito desarme e muita falta tática (parar transição adversária) é vocabulário pra explicar **propensão a cartões** do meio-campo — especialmente a "falta tática" do box-to-box que perde a bola e segura na infração. Explicativo sobre disciplina, ancorado ao número.

**PROPS DE JOGADOR (distância percorrida, desarmes, finalizações):** a posição é a que mais infla **distância percorrida** (11-13 km) — explica por que certos jogadores lideram esse dado. O destruidor explica volume de **desarmes/recuperações**; o chegador explica **chutes/gols do jogador**.

**JOGO AÉREO:** box-to-box com cabeceio (chegada de cabeça em escanteio, segunda bola) é gancho pra **duelos aéreos** do meio.

**JANELAS DE TEMPO (gancho de domínio forte — consenso):** a **queda de motor após os 70'** é vocabulário pra explicar mudança de ritmo no último terço do jogo — quando o box-to-box gasta, o pressing do time afrouxa e o controle do meio muda de mãos. Puramente explicativo sobre dinâmica de intensidade, ancorado ao número do mercado, **jamais um sinal de aposta**.

> **Travas obrigatórias:** todos os ganchos acima são **gerador de hipótese / camada EXPLICAR**. O número do mercado/quant é soberano e nunca se move por causa deste vocabulário. Nada aqui é "dica por posição" nem "edge".

---

### Interior / Mezzala (meia de meio-espaço, half-space)

#### Resumo didático

**O que é, em uma frase:** o interior (ou *mezzala*, palavra italiana que significa literalmente "meio-ala") é o meio-campista que joga **deslocado para um dos lados do centro**, num corredor específico do campo chamado **meio-espaço**, com a função de ligar a defesa ao ataque e, principalmente, de **chegar por dentro na área adversária** vindo de trás.

**Vamos por partes, porque aqui mora a confusão.** Imagine o campo dividido em cinco corredores verticais (faixas, de uma trave à outra): as duas **laterais** (onde correm os pontas e os laterais), o **corredor central** (onde fica o homem de marca/centroavante e o camisa 10), e, entre o central e cada lateral, dois corredores intermediários — **esses dois corredores intermediários são os meio-espaços** (em inglês, *half-spaces*; em espanhol, *interior* ou *pasillo interior*). O meio-espaço é a zona mais valiosa do futebol moderno: dali você enxerga a baliza de frente (consegue chutar e passar para a área), mas a marcação adversária tem dificuldade de te pegar, porque você está num "ponto cego" — nem é o homem do meio que o volante adversário vigia, nem é o homem da ponta que o lateral adversário vigia. O mezzala é o jogador **especializado em viver nesse ponto cego**.

**Por que essa posição existe.** Ela existe para resolver dois problemas de uma vez. Primeiro: um time precisa de gente que **chegue à área sem ser o atacante** — atacantes são marcados de perto, então o gol muitas vezes nasce de alguém que vem "de surpresa" da segunda linha. O mezzala é esse homem que **chega atrasado** (em inglês, *late run* — corrida tardia para a área), aparecendo na hora do cruzamento ou do recuo de bola quando ninguém o estava marcando. Segundo: um time precisa **superar a marcação na construção**. Quando o mezzala se abre no meio-espaço, ele cria um triângulo com o lateral e o ponta do seu lado, e esse triângulo "afoga" o adversário com um homem a mais naquela região (o que se chama **superioridade numérica** ou *overload*).

**A diferença para parentes próximos** (defino o jargão para você nunca mais confundir):
- O **camisa 10 / meia-armador** joga no centro, de frente para o jogo, é o cérebro criativo — o mezzala é mais "lateralizado" e corre mais.
- O **box-to-box** (o "vai-e-vem", que cobre toda a extensão do campo) cobre o eixo central inteiro — o mezzala faz algo parecido em volume de corrida, mas **canalizado num lado só**, e termina suas corridas mais perto da área e mais "abertas".
- O **volante / pivô** fica atrás, organizando — o mezzala fica à frente dele, é a peça que **adianta**.

Num resumo cru para o seu produto: sempre que você vê um meio-campista que **não é o camisa 10 nem o volante**, mas mesmo assim aparece marcando gols, dando assistências e surgindo na área "do nada" pela direita ou pela esquerda do meio — esse é o mezzala. Ele é o motor que transforma posse de bola em chegada. `consenso`

#### Perfil e arquétipos

**Atributos ideais (físico, técnico, mental):**

- **Físico:** resistência altíssima (é a posição que mais percorre quilômetros junto do box-to-box, porque sobe e desce repetidamente num corredor), aceleração em curtas distâncias para o *late run* à área, e equilíbrio de corpo para receber de costas com marcação colada. Não precisa ser o mais rápido em velocidade pura (isso é exigência de ponta), mas precisa de **explosão nos primeiros 5–10 metros**.
- **Técnico:** controle orientado de primeiro toque (receber de costas no meio-espaço e já girar para frente — o famoso *receber e virar*), passe de meia e longa distância (para mudar o jogo de lado ou enfiar entre linhas), chute de fora da área e finalização dentro dela (porque chega muito à área), e **drible em espaço curto** para sair de pressão na faixa lateral.
- **Mental:** **leitura de espaço** acima de tudo — saber *quando* abrir, *quando* arrancar para a área, *quando* segurar para dar saída. Inteligência de temporização (*timing*) na corrida sem bola é o que separa o mezzala bom do mediano. Coragem para receber sob pressão e personalidade para pedir a bola em zona apertada.

**Sub-papéis e arquétipos (a diferença prática entre eles):**

1. **Mezzala-criador (perfil playmaker, "De Bruyne/Bernardo Silva"):** o foco é a **última bola**. Recebe entre linhas, vira e enfia o passe decisivo, ou cruza rasteiro da faixa do meio-espaço. Mais ligado ao toque e à visão do que à arrancada. Tende a ter mais assistências do que gols. Joga mais "de cara para o jogo". `consenso`

2. **Mezzala-goleador / chegador (perfil "Frank Lampard / Bellingham 23/24 / Arda Güler-Bellingham híbrido"):** o foco é **terminar a jogada na área**. Especialista no *late run*, no rebote, na chegada de fora para chutar. Vive da temporização da corrida. Produz números de gol altos para um meio-campista. É o arquétipo que mais "engana" estatísticas — parece atacante nos números mas é meia. `consenso`

3. **Mezzala-condutor / portador (perfil "Pogba / Tchouaméni adiantado / Valverde"):** o foco é **carregar a bola** (em inglês, *ball carrier*), avançando metros conduzindo, quebrando linhas com a própria condução e atraindo marcação para liberar o companheiro. Fisicamente dominante, cobre muito chão. `consenso`

4. **Mezzala-trabalhador / de equilíbrio (perfil "Milinković-Savić defensivo / Gavi / mezzala de Simeone"):** num time mais reativo, é o mezzala que **prioriza a fase sem bola** — pressiona, cobre o corredor, faz a transição defensiva — e ataca o meio-espaço com mais parcimônia. Existe para que o time não fique exposto quando os laterais sobem. `consenso`

**A distinção mais importante para você:** todo mezzala vive no meio-espaço, mas **uns olham para a bola (criadores), outros olham para o gol (goleadores), outros olham para o espaço à frente (condutores) e outros olham para trás (trabalhadores)**. Saber qual arquétipo o time escalou muda completamente o que esperar dos números daquele jogo.

#### Os 4 momentos do jogo

**1) Organização ofensiva (com bola, jogo construído):** é o momento que define o mezzala. Ele **abre no meio-espaço**, entre o lateral e o ponta do seu lado, formando triângulos para escapar da marcação e dar saída limpa. Suas tarefas: receber entre linhas e virar para frente; fixar o volante adversário para liberar o homem por fora; e, na fase final, **atacar a área com corrida de trás** (*late run*) quando a bola chega na ponta. Num time de posse, o mezzala é quem dá a **terceira opção** num corredor — se o lateral e o ponta estão marcados, ele aparece por dentro. `consenso`

**2) Organização defensiva (sem bola, time postado):** o mezzala normalmente recua para compor um **meio-campo de três** (com o volante e o outro mezzala), fechando o meio-espaço do seu lado para o adversário não jogar ali. A grande **vulnerabilidade estrutural** aparece aqui: como ele é convidado a subir muito na fase ofensiva, na hora de defender ele frequentemente **chega atrasado** ao seu posto, deixando o corredor aberto por uma fração de segundo. Em times bem treinados, o lateral ou o volante cobre essa lacuna temporariamente. `consenso`

**3) Transição ofensiva (acabou de recuperar a bola — o contra-ataque):** o mezzala é uma **rota de saída** preferencial. Como ele costuma estar posicionado num corredor lateralizado e adiantado, ao recuperar a bola o time o procura para **conduzir no espaço** (arquétipo condutor brilha aqui) ou para tabelar rápido com o ponta e atacar as costas do lateral adversário, que normalmente subiu. É um dos jogadores que **transforma roubada em chance** com mais frequência. `consenso`

**4) Transição defensiva (acabou de perder a bola — o contrapressing):** aqui o mezzala tem papel duplo e contraditório. Se o time pratica **contrapressing** (pressão imediata após perder a bola, conceito de Klopp/Guardiola — *Gegenpressing*), o mezzala que estava adiantado é o **primeiro a pressionar** a bola perdida, tentando recuperá-la em 5–6 segundos antes que o adversário organize o contra-ataque. Mas se a pressão falha, **é exatamente o corredor dele que fica escancarado** — o adversário escapa pelo meio-espaço que ele abandonou. Essa é a maior fonte de gol sofrido associada à posição. `consenso`

#### Zonas ocupadas e gaps deixados

**Corredores/zonas que ocupa:** o mezzala vive no **meio-espaço** do seu lado (esquerdo ou direito) — a faixa vertical entre o corredor central e a lateral. Verticalmente, ele oscila entre a **altura do volante** (quando recua para dar saída) e a **entrada da área** (quando chega no *late run*). Não é um jogador de uma zona fixa; é um jogador de uma **faixa vertical** que ele percorre de cima a baixo. `consenso`

**Espaço que ele ABRE para os companheiros:** quando o mezzala se posiciona no meio-espaço, ele **fixa** (prende) o volante ou o lateral adversário. Isso libera duas coisas: (a) a **lateral pura** para o ponta receber isolado contra o lateral adversário (1v1), e (b) o **corredor central** para o camisa 10 ou o centroavante recuar e receber, porque o volante adversário foi puxado para o lado. O mezzala é um **gerador de espaço para os outros** tanto quanto um finalizador. `consenso`

**Espaço que ele DEIXA EXPOSTO:** o problema estrutural. Quando o mezzala sobe, **o meio-espaço dele atrás fica vazio**. Esse buraco é o que o adversário inteligente ataca na transição: o volante adversário recebe e enfia a bola exatamente naquela zona que o mezzala desocupou, encontrando ali o atacante ou o outro meia adversário entre a linha de zaga e o meio-campo do time. Em formações com só um volante (4-3-3, 4-1-4-1), se os **dois** mezzalas sobem ao mesmo tempo, o time fica com **um homem só** protegendo toda a frente da zaga — situação clássica de vulnerabilidade. `consenso`

**Como o adversário explora a ausência dele:**
- **Inversão rápida de jogo:** o adversário troca o lado de ataque para o flanco que o mezzala deixou, chegando antes de ele recompor.
- **Terceiro homem no meio-espaço:** um atacante adversário "cai" naquele corredor abandonado e recebe de frente para a zaga.
- **Atração e fuga:** o adversário atrai a pressão do mezzala num lado e libera o jogo no meio-espaço oposto, onde ninguém está. `consenso`

#### Jogo aéreo e bola parada

**Jogo aéreo na dinâmica (bola rolando):**
- **Ofensivo:** o mezzala é, com frequência, um **chegador de segunda bola** na área — não necessariamente o alvo do cruzamento, mas o homem que ataca o **rebote** ou a **sobra na entrada da área** (a zona onde a bola desviada costuma cair). Os mezzalas-goleadores marcam muito de cabeça vindo de trás, justamente porque chegam sem marcação. Mezzalas altos (tipo Milinković-Savić) viram alvos diretos de cruzamento. `consenso`
- **Defensivo:** na defesa de cruzamento, o mezzala costuma ser responsável por **marcar a entrada da área / a meia-lua** (a zona de onde sai o chute de rebote) ou por **acompanhar o meia adversário que chega de trás** — espelhando a função que ele mesmo exerce no ataque. `consenso`

**Bola parada (situações específicas):**
- **Escanteio ofensivo:** dependendo da estatura, ou é **atacante de primeiro/segundo pau**, ou fica na **borda da área** como "homem do rebote" e primeira linha de **balanço defensivo** (o jogador deixado atrás para impedir o contra-ataque adversário caso o escanteio seja rebatido). O mezzala é candidato natural a esse papel de balanço por ser bom em transição. `consenso`
- **Escanteio defensivo:** marcação na entrada da área ou marcação individual de um meia adversário, raramente no primeiro pau.
- **Falta lateral/cruzada:** os de bom porte vão à área; os criadores podem ser o **batedor** (especialmente os de bom pé, tipo De Bruyne em faltas e cruzamentos).
- **Falta frontal/direta:** mezzalas-criadores canhotos ou destros de boa batida são candidatos a **cobrador** de faltas diretas e a **batedor de escanteios**.
- **Pênalti:** não há vínculo de posição; depende da hierarquia de batedores do elenco (mas mezzalas-goleadores costumam estar na lista). `consenso`

**Gancho útil:** quando o mezzala do time é alto e/ou bom cabeceador, isso adiciona um **alvo extra de bola parada** que muitas vezes passa despercebido, porque a atenção vai para os zagueiros e o centroavante. `inferencia`

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Espaço entre linhas (a especialidade da casa):** o mezzala é, por definição, um **jogador de entrelinhas** — vive no espaço entre a linha de meio-campo e a linha de defesa do adversário. Quanto mais o adversário deixa esse espaço aberto (linhas afastadas, bloco "esticado"), **mais o mezzala prospera**, porque tem onde receber virado para o gol. Contra um bloco baixo e compacto (linhas coladas, sem espaço entre elas), o mezzala perde sua zona natural e tem de **atacar por fora ou por trás** (chegando na área), já que não há entrelinha para ocupar. `consenso`

**Altura da linha defensiva (do próprio time):** quando o próprio time joga com **linha alta** e os laterais avançam, o mezzala precisa ter **disciplina de cobertura** — porque se ele também sobe, abre-se aquele buraco no meio-espoço atrás dele que o adversário ataca em profundidade. Times de linha alta exigem mezzalas com bom motor de recomposição. `consenso`

**Pressing / contrapressing e PPDA:** (defino **PPDA** = *Passes Permitidos Por Ação Defensiva*, métrica de intensidade de pressão — quanto **menor** o PPDA, mais o time pressiona, porque permite menos passes ao adversário antes de tentar roubar). O mezzala é **peça central do pressing alto**: como já está adiantado, ele frequentemente é o gatilho ou a segunda onda da pressão sobre o volante/zagueiro adversário. Num time de PPDA baixo (pressão intensa, estilo Bielsa/Guardiola/Klopp), o desgaste físico do mezzala é enorme e a posição exige um perfil de altíssima resistência. Num time de PPDA alto (bloco recuado, reativo), o mezzala economiza energia na fase sem bola e guarda força para a transição ofensiva. **Saber em que regime de pressão o time joga muda totalmente o perfil esperado do mezzala em campo.** `consenso`

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**A formação que mais APAGA o mezzala puro.** No 4-4-2 clássico, o meio-campo é uma linha de **dois volantes centrais** lado a lado (uma dupla) mais dois homens de beirada (meias-laterais, que na prática viram quase pontas). Não existe a 'casa' do meio-espaço com um trio escalonado, então não há vaga estrutural para o mezzala como tal. O que pode acontecer é um dos dois meias centrais ter **liberdade de tendência mezzala**: ele desgarra da dupla e ataca o meio-espaço, enquanto o parceiro segura. Mas isso é arriscado — se ele sobe, o meio-campo central fica com **um homem só** contra os meias adversários, vulnerabilidade clássica do 4-4-2 contra times de três no meio. Resumo: aqui o mezzala não é um papel, é no máximo uma **licença ocasional** dada a um dos volantes box-to-box. `consenso`

**4-4-2 em losango (diamante)**

**Formação que RESSUSCITA o mezzala com força.** O losango (diamante) tem quatro meias em forma de pipa: um volante na base, um camisa 10 na ponta, e **dois interiores nas laterais do losango — esses dois são mezzalas natos**. Eles vivem nos meio-espaços direito e esquerdo, fazendo exatamente a função clássica: dar saída por dentro, sustentar a posse, e atacar a área. O ponto crítico do diamante é que ele **não tem pontas** (a largura vem dos laterais), então os mezzalas precisam de inteligência redobrada para abrir e dar amplitude quando o lateral não chega, e para fechar o meio-espaço na defesa, já que o time pode ficar estreito e ser atacado pelos flancos. Aqui o mezzala é **protagonista absoluto**: liga o volante ao 10 e aos dois atacantes. `consenso`

**4-3-3**

**A casa por excelência do mezzala moderno.** O 4-3-3 com um **pivô único** (um volante) e **dois interiores à frente** é o sistema-padrão para deployar mezzalas — é nele que jogam Mac Allister (Liverpool), Odegaard e seus pares, e foi nele que o City de Guardiola usou Bernardo Silva e De Bruyne como interiores. Os dois mezzalas ocupam os meio-espaços, formam triângulos com o lateral e o ponta de cada lado, e chegam à área pelo *late run*, enquanto o pivô sozinho segura a frente da zaga. **Valoriza ao máximo** o mezzala — mas também cobra ao máximo a disciplina dele, porque com **um volante só**, se os dois interiores sobem juntos e perdem a bola, a transição adversária encontra o meio-campo escancarado. O equilíbrio costuma ser ter um mezzala mais ofensivo e outro mais contido. `consenso` / `verificado-fetch`: Mac Allister como interior esquerdo no 4-3-3 do Liverpool de Slot e Odegaard como interior no 4-3-3 do Arsenal são exemplos correntes (2024-25).

**4-2-3-1**

**Formação que TRANSFORMA o mezzala em algo diferente.** Aqui o meio tem **dois volantes (duplo pivô)** atrás de um trio de meias-atacantes e um camisa 10 central. Não há a estrutura clássica de interior do 4-3-3. Onde o mezzala aparece: (a) um dos **dois volantes** pode ter licença mezzala, adiantando-se pelo meio-espaço enquanto o parceiro fica (o duplo pivô dá mais segurança para essa subida do que o pivô único do 4-3-3); ou (b) um dos **homens abertos** do trio de três pode jogar como **ponta invertido/meia por dentro** — funcionalmente um mezzala muito adiantado. O 4-2-3-1 não tem a 'vaga' pura do interior, mas **acomoda bem** um mezzala disfarçado de volante avançado, com a vantagem da rede de segurança do segundo pivô. `consenso`

**4-1-4-1**

**Casa clara, mas com cobrança defensiva pesada.** O 4-1-4-1 tem **um único volante de contenção** (o '1' atrás) e uma **linha de quatro meias** à frente, dos quais os **dois centrais funcionam como interiores/mezzalas** e os dois de beirada como meias-laterais. Os mezzalas atacam os meio-espaços e formam o trio com o volante na fase de posse. A diferença para o 4-3-3 é sutil mas importante: o 4-1-4-1 nasce mais **defensivo e em bloco**, então os mezzalas costumam ter **mais responsabilidade de recompor** a linha de quatro à frente, defendendo de forma mais conservadora. É uma estrutura que valoriza o mezzala-trabalhador e o mezzala-equilíbrio mais do que o puro criador, porque o time confia na compactação. `consenso`

**3-5-2 / 3-4-1-2**

**Formação muito favorável ao mezzala — com largura terceirizada.** Com **três zagueiros** atrás e **alas (wing-backs)** dando toda a amplitude pelos flancos, os meias centrais podem se concentrar nos meio-espaços sem precisar abrir para dar largura — os alas fazem isso. No 3-5-2 com base de três no meio (um volante + dois interiores), os dois interiores são **mezzalas clássicos** que ligam o meio aos dois atacantes e chegam à área com liberdade, protegidos pela linha de três que cobre as suas costas. No 3-4-1-2, com um camisa 10 explícito, os dois meias da base de quatro têm carga híbrida (mais contidos), mas ainda atacam os meio-espaços. **Valoriza** o mezzala porque a linha de três e os alas reduzem o risco da subida dele — os zagueiros extras cobrem o buraco que ele deixa. `consenso`

**3-4-3 / 3-4-2-1**

**Depende do desenho — o 3-4-2-1 é uma fábrica de mezzalas adiantados.** No **3-4-3** com base de quatro no meio (dois volantes centrais + dois alas), os dois meias centrais são mais um **duplo pivô** do que mezzalas puros, podendo um deles ganhar licença para adiantar. Já no **3-4-2-1**, os dois '2' atrás do centroavante são exatamente **meias por dentro nos meio-espaços** — funcionalmente mezzalas muito ofensivos (em alguns clubes chamados de *inside forwards* ou *dez duplos*). Eles vivem entre as linhas adversárias, recebem dos volantes e ligam com o atacante, com os alas dando a largura. O 3-4-2-1 é uma das estruturas que **mais empodera** o mezzala criativo/goleador, porque o coloca permanentemente na zona de finalização sem exigir que ele dê amplitude. `consenso`

**5-3-2 / 5-4-1 (bloco de 5)**

**Formações reativas que SUBORDINAM o mezzala à fase defensiva.** Tanto o 5-3-2 quanto o 5-4-1 são, na origem, **blocos defensivos** (cinco atrás). No **5-3-2**, há um meio de três (volante + dois interiores), então o mezzala **existe**, mas sua identidade é a do **mezzala-trabalhador**: defende compacto, fecha o meio-espaço, e só ataca em **transição/contra-ataque** — não na posse construída, porque o time costuma ter pouca bola. É o mezzala que vira motor de contragolpe junto dos dois atacantes. No **5-4-1**, com uma linha de quatro no meio, os dois centrais são quase só **volantes de contenção** — o papel de mezzala fica **apagado**, reduzido a, no máximo, surtidas pontuais ao ataque. Resumo: nesses blocos o mezzala troca o caderno de chegada pelo caderno de contenção e contra-ataque. `consenso`

**4-3-1-2 (sem pontas)**

**Variante do losango — mezzala protagonista, com dever extra de amplitude.** O 4-3-1-2 é, na prática, um **diamante** (volante na base, dois interiores, um camisa 10, dois atacantes) ou um trio + 10 + dupla, **sem pontas**. Os **dois interiores são mezzalas centrais à carga** da ligação e da chegada à área. Como não há pontas, recai sobre os mezzalas (junto dos laterais) a obrigação de **dar amplitude quando necessário** — eles precisam saber abrir para o flanco e não só atacar por dentro, senão o time fica estreito e fácil de defender. Estruturalmente o mezzala é **central e valorizado**, mas com a exigência tática extra de equilibrar 'jogar por dentro' (sua natureza) com 'esticar para fora' (necessidade do sistema sem pontas). `consenso`

#### Parcerias-chave

**As parcerias que definem o mezzala (relações-chave):**

- **Mezzala + lateral + ponta do mesmo lado (o triângulo de corredor):** é a relação mais importante. Os três formam um triângulo no flanco que cria superioridade e permite tabelas, sobreposições (o lateral passa por fora) e sub-posições (o lateral passa por dentro enquanto o mezzala segura por fora). A regra de ouro é **não ocupar o mesmo espaço ao mesmo tempo**: se o ponta abre na linha, o mezzala ataca por dentro; se o mezzala abre, o lateral chega por trás. A coordenação desse trio é o que faz um time render por um lado. `consenso`

- **Mezzala + volante/pivô (a relação de equilíbrio):** quando o mezzala sobe, o volante **cobre** o buraco; quando o mezzala recua para receber, o volante **avança** ou se desloca para liberar a linha de passe. É uma gangorra. Num 4-3-3 de pivô único, essa relação é existencial — o volante precisa ter raio de cobertura para os dois mezzalas. `consenso`

- **Mezzala + camisa 10 ou segundo atacante (a relação de ligação final):** o mezzala alimenta o 10/atacante entre linhas e depois chega na área para finalizar a jogada que ele mesmo iniciou. Quando o 10 cai para receber, abre o espaço que o mezzala invade — um troca-troca de posições constante. `consenso`

- **Mezzala + o outro mezzala (a relação de assimetria):** raramente os dois interiores fazem a mesma coisa. O bom funcionamento costuma vir de **assimetria**: um mais ofensivo/criador, outro mais contido/equilíbrio; ou um que sobe enquanto o outro segura, alternando. Quando os dois sobem juntos sem coordenação, o time se expõe. `consenso`

- **Mezzala + ala (wing-back) nas formações de três zagueiros:** nas estruturas com linha de três, o mezzala terceiriza a largura para o ala e se concentra no meio-espaço — a relação é de **divisão de corredor** (o ala fica na linha, o mezzala por dentro), o que potencializa a chegada do mezzala à área. `consenso`

#### Exemplos de elite

**Atuais (temporadas 2023–2026):**

- **Kevin De Bruyne** (Man City, até 2025) e **Bernardo Silva** (Man City) — os arquétipos do **mezzala-criador** de Guardiola; recebem no meio-espaço, viram e dão a última bola. Bernardo também exerceu versão mais trabalhadora/condutora. `verificado-fetch`: confirmado uso de Bernardo Silva e De Bruyne como mezzalas no City.
- **Jude Bellingham** (Real Madrid) — na temporada **2023-24** foi o exemplo perfeito do **mezzala-goleador/chegador**, fazendo 19 gols na liga vindo de meio-campo, vivendo do *late run* à área; em **2024-25**, com a chegada de Mbappé, foi **recuado para função mais profunda**, mostrando como o papel muda com o elenco. `verificado-fetch`: stats e mudança de função 24/25 confirmadas.
- **Alexis Mac Allister** (Liverpool) — **interior esquerdo no 4-3-3** de Arne Slot; exemplo corrente de mezzala completo (saída, pressão, chegada). `verificado-fetch`.
- **Martin Odegaard** (Arsenal) — interior no 4-3-3, perfil **criador** com chegada, embora oscile entre 10 e mezzala conforme o jogo. `verificado-fetch`.
- **Federico Valverde** (Real Madrid) — referência de **mezzala-condutor/box-to-box** com motor físico e chute de fora. `consenso`
- **Pedri / Gavi** (Barcelona) — interiores no meio-campo de três; Pedri mais criador, Gavi mais agressivo/trabalhador. `consenso`

**Históricos (que definiram os arquétipos):**

- **Frank Lampard** — o protótipo do **mezzala-goleador** antes do termo virar moda: meia que marcava 15-20 gols por temporada chegando de trás. `consenso`
- **Paul Pogba** (auge no Juventus de Conte/Allegri, num 3-5-2) — o **mezzala-condutor** definitivo: carregava a bola, quebrava linhas e chegava à área. `consenso`
- **Arturo Vidal** (Juventus) — o **mezzala-trabalhador/box-to-box** completo, agressivo, chegador e ladrão de bola. `consenso`
- **David Silva** (Man City) — **mezzala-criador** de toque curto e espaço apertado, mestre do meio-espaço. `consenso`
- **Sergej Milinković-Savić** (Lazio) — mezzala **alto e físico**, alvo aéreo e chegador de área, exemplo do perfil de porte. `consenso`
- **Ángel Di María** em algumas fases — frequentemente citado como mezzala/interior criativo. `consenso`

**Confiança geral:** os vínculos de papel (quem foi usado como mezzala) são `consenso` consolidado; os números específicos de Bellingham e os usos correntes de Mac Allister/Odegaard são `verificado-fetch` desta sessão.

#### Erros comuns / como falha

**Como a posição falha — e o que um treinador cobra:**

1. **Subir sem hora certa e deixar o corredor aberto (o erro nº 1).** O mezzala que ataca a área toda vez, mesmo quando o time não recuperou estrutura, vira o buraco por onde o adversário contra-ataca. O treinador cobra **leitura de momento**: "só sobe quando a bola está controlada e tem cobertura atrás". Sinal de mau desempenho: o time sofre repetidamente gols/chances **pelo meio-espaço que ele deveria proteger**. `consenso`

2. **Não dar largura quando o sistema exige (em formações sem ponta).** No diamante e no 4-3-1-2, se o mezzala só joga por dentro, o time fica **estreito e previsível** — fácil de defender. Cobrança: "abre quando o lateral não chega". `consenso`

3. **Ocupar o mesmo espaço do ponta ou do 10 (pisar no calo do companheiro).** Dois jogadores no mesmo corredor anulam um ao outro e destroem o triângulo. Sinal: o lado do campo "trava", sem progressão. `consenso`

4. **Receber de costas e não conseguir virar (técnica de proteção/giro).** O mezzala que recebe entre linhas e tem de devolver a bola para trás porque não sabe girar **desperdiça a melhor posição do campo**. Cobrança: primeiro toque orientado, "recebe já virando".

5. **Chegada à área sem temporização (*timing*).** Chegar cedo demais (a marcação te pega) ou tarde demais (a bola já passou) anula o *late run*. O bom mezzala é cronômetro; o ruim corre por correr. `consenso`

6. **Apagar na fase defensiva (preguiça de recompor).** Mezzalas muito ofensivos que não voltam transformam o time num 4-3-3 que vira 4-2-... na defesa, sobrecarregando o pivô. Treinador cobra **PPDA e voltas de pressão**. `consenso`

7. **Sumir contra bloco baixo.** Quando o adversário fecha e tira o espaço entre linhas, o mezzala que só sabe jogar entrelinhas **desaparece** — não sabe atacar a área por trás nem criar do estático. Sinal: muita posse e zero penetração por aquele lado. `consenso`

**Sintoma geral de mau desempenho:** time com posse mas **sem chegada** por um dos lados (mezzala apagado na construção) OU time que **sofre transições** sempre pelo mesmo meio-espaço (mezzala indisciplinado na cobertura). São os dois extremos do mesmo defeito de equilíbrio. `consenso`

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**Para o assistente EXPLICAR (sempre explicativo-narrativo, nunca edge nem dica — ancorado no número do mercado, que não se move):**

- **Gols e props de finalização de meio-campista:** o mezzala é, de longe, o **meio-campista que mais explica gol e chute vindos da segunda linha**. Quando o time escala um mezzala-goleador (perfil Bellingham 23/24, Lampard), faz sentido **narrar** por que aquele meia aparece nos mercados de "marcar a qualquer momento" ou "finalizações" — ele vive a chegada na área. *Uso correto:* explicar ao leitor de onde vem a ameaça de gol daquele meia, jamais sugerir que isso é vantagem de aposta. `consenso`

- **Assistências:** o mezzala-criador (Bernardo, De Bruyne, Odegaard) é gancho natural para **explicar a origem das assistências** de um time — a última bola costuma nascer no meio-espaço dele. `consenso`

- **Escanteios:** o mezzala alimenta o triângulo de corredor que **gera cruzamentos e, portanto, escanteios** por um dos lados; quando um lado tem um mezzala ativo + lateral ofensivo + ponta de 1v1, dá para **narrar** por que aquele flanco produz mais pressão e canto. *Sempre como contexto do número, não como previsão.* `consenso`

- **Cartões:** o mezzala-trabalhador/condutor (Vidal, Gavi) é gancho para **explicar faltas táticas e cartões** — ele comete falta na transição defensiva justamente para tapar o buraco que ele mesmo abriu (a chamada *falta tática*). Bom para o leitor entender por que aquele meia acumula amarelos. `consenso`

- **Jogo aéreo:** mezzalas altos (Milinković-Savić) adicionam um **alvo aéreo escondido** em bola parada — gancho para explicar uma fonte extra de perigo que o leitor leigo não enxergaria. `inferencia`

- **Total de gols / over-under do jogo (contexto, nunca direção):** o **regime do mezzala** ajuda a narrar o caráter do jogo — dois mezzalas ofensivos num 4-3-3 de pivô único sugerem um jogo de **mais transições e espaços** (história de jogo aberto), enquanto mezzalas-trabalhadores num 5-3-2 sugerem **contenção e contragolpe**. Isso é **vocabulário para explicar o número do mercado**, gerador de hipótese — o número quant é que manda, e ele nunca se move por causa dessa narrativa. `consenso`

**Regra transversal para o produto:** tudo acima é a camada do **"porquê"** — serve para o assistente contar a história tática por trás do número, dar textura ao leitor leigo e gerar hipóteses qualitativas. **Nunca** deve ser apresentado como *edge*, *dica por posição* ou recomendação de aposta. O número do mercado/quant é a âncora imóvel; o mezzala é personagem da narrativa, não sinal de valor. `consenso`

---

### Meia-armador / Camisa 10 (jogador entre linhas, enganche, trequartista)

#### Resumo didático

A camisa 10 é o cérebro criativo do time na frente — o jogador que existe pra **inventar a jogada de gol**, não pra fazer o trabalho braçal. Pensa nele como o "tradutor": ele recebe a bola dos jogadores que defendem e constroem (zagueiros, volantes) e a transforma em chance de gol pros atacantes. O nome "camisa 10" é histórico — vem de quando o craque do time usava esse número (Pelé, Maradona, Zico). Hoje "camisa 10" virou um *papel*, não um número de fato.

Três palavras-chave pra entender o que ele faz:
- **"Entre linhas"**: no futebol, o time adversário se organiza em fileiras horizontais — a linha de defesa (os 4 ou 5 de trás) e a linha de meio-campo (os volantes na frente deles). Existe um *vão* entre essas duas fileiras. O camisa 10 vive nesse vão — perto demais do gol pros volantes o marcarem confortavelmente, longe demais pros zagueiros saírem da linha sem abrir um buraco. Receber "entre linhas" é o ato técnico-tático que define a posição.
- **"Enganche"** (palavra argentina, significa literalmente "engate/gancho"): é o 10 clássico, o ponto de ligação (engate) entre o meio e o ataque. Fica adiantado, perto do centroavante, e é o último homem antes do gol que ainda *organiza* em vez de só finalizar.
- **"Trequartista"** (italiano, "homem dos três quartos"): o jogador que opera no último terço do campo (os "três quartos" à frente), a versão italiana do mesmo conceito.

Em uma frase: a camisa 10 existe pra **receber a bola na zona mais perigosa do campo, de costas ou de frente pro gol, e produzir a jogada decisiva** — o passe que rasga a defesa (o "passe entre linhas" ou "último passe"), o drible que elimina um marcador, ou o chute de fora da área. Ele troca volume de corrida por qualidade de decisão: corre menos que um volante, mas cada toque dele tem peso. Por isso é a posição mais associada a "talento" e também a mais questionada taticamente no futebol moderno — porque um jogador que não defende precisa justificar sua presença com criação de elite.

#### Perfil e arquétipos

**Atributos ideais (consenso):**

*Técnicos:* primeiro toque de elite (orientado — já direciona a bola pra longe do marcador), capacidade de receber de costas para o gol sob pressão e "girar" (virar de frente), passe de quebra de linha (o passe que atravessa uma fileira adversária), visão periférica (escanear o campo *antes* de receber — os melhores fazem "check de ombro" várias vezes por segundo), chute de média/longa distância, jogo em espaço curto (driblar em metro quadrado).

*Físicos:* não precisa ser rápido em linha reta, mas precisa de **aceleração curta** e **agilidade/mudança de direção** (sair da marcação em 2-3 metros). Equilíbrio e centro de gravidade baixo ajudam a proteger a bola. Resistência pra repetir microexplosões. Força de tronco pra aguentar o contato do volante nas costas.

*Mentais:* leitura de espaço (saber onde o vão vai abrir *antes* de abrir), coragem pra pedir a bola na zona apertada (não se "esconder"), tomada de decisão sob pressão, e — o mais subestimado — **timing**: receber no momento exato em que o marcador está mal posicionado. Inteligência posicional > inteligência atlética.

**Sub-papéis / arquétipos (diferença prática real):**

1. **Enganche clássico / 10 puro estático** — opera quase só no eixo central entre linhas, raramente recua pra construir, raramente corre 50m. Pede a bola com o jogo já avançado e finaliza a jogada com passe ou chute. *Diferença prática:* dá o máximo de criação no último terço, mas custa um homem na pressão e na transição defensiva. Tipo Riquelme, Özil em pico, Isco em fases. Está em extinção no topo porque exige um time que "carregue" sua ausência defensiva.

2. **10 box-to-box / camisa 10 moderno (mezzala avançado)** — o 10 que também corre, pressiona e chega na área pra finalizar. Combina criação com volume físico. *Diferença prática:* resolve o problema defensivo do enganche clássico — defende o suficiente pra caber em qualquer sistema. Bellingham e Bruno Fernandes são o protótipo atual. É o arquétipo dominante de 2023-2026.

3. **10 falso / 10 que vira condutor (carrilero criativo)** — recebe entre linhas mas o instinto é *carregar a bola driblando* em vez de tocar de primeira. Cria pelo drible e pela condução progressiva. *Diferença prática:* desorganiza a defesa puxando marcadores, mas pode "segurar" a bola demais e travar a velocidade do ataque. Cherki, Wirtz e Musiala têm forte componente disso.

4. **10 finalizador / segundo atacante disfarçado (enganche-goleador)** — mais "matador" que "garçom", vive da chegada na área e do gol mais que do passe. Fronteira com o segundo atacante. *Diferença prática:* perigo direto ao gol, mas menos volume de criação pros companheiros. Kaká em pico, Bergkamp recuado.

5. **Regista avançado / 10 organizador profundo** — recua bastante pra pegar a bola, é o metrônomo que dita o ritmo com passe. Mais "maestro" que "matador". Kevin De Bruyne (versão avançada do regista) e Bruno em fase de organizador. *Diferença prática:* dá controle e cadência ao jogo, mas se recua demais some da zona de finalização.

**Regra de ouro do treinador:** antes de tudo, pergunte se o seu 10 é **garçom** (criação por passe), **dançarino** (criação por drible/condução) ou **matador** (criação por chegada/gol). Isso muda quem precisa estar ao redor dele.

#### Os 4 momentos do jogo

**1. Organização ofensiva (time com a bola, posicionado):** é o momento-rei do camisa 10. Tarefa central: **ocupar o vão entre a linha de defesa e a de meio adversária** e oferecer-se como opção de passe vertical. Ele "fixa" (ocupa a atenção de) os volantes adversários — se eles saem pra marcá-lo, abre-se o espaço atrás; se ficam, ele recebe livre. Funções típicas: receber entre linhas e girar, dar o último passe pro atacante em profundidade, fazer tabela com o 9 ("um-dois"), aparecer entre os zagueiros pra finalizar cruzamento. O 10 de elite *manipula* marcadores com falsos movimentos antes de receber.

**2. Organização defensiva (time sem a bola, adversário com posse organizado):** historicamente o **calcanhar de Aquiles** da posição. No bloco defensivo o 10 costuma ficar na primeira linha de pressão (junto do 9) pra "fechar" o volante de saída adversário, ou cair pra formar um meio-campo de mais homens. Se ele não defende, o time vira 10x11 atrás da bola — daí a pressão moderna pra que o 10 também corra. O arquétipo box-to-box pressiona e marca volante; o enganche clássico só faz "cobertura simbólica" e o sistema tem que absorver isso.

**3. Transição ofensiva (acabou de recuperar a bola — contra-ataque):** aqui o 10 é **ouro**, porque é o jogador posicionado mais perto do gol e com a melhor cabeça pra decidir rápido. No instante da recuperação ele deve aparecer como opção entre linhas pra "limpar" a primeira pressão e lançar o contra-ataque com um passe vertical, ou conduzir ele mesmo. A qualidade de decisão dele em 1-2 segundos define se o contra vira gol ou se morre. É o momento em que o 10 "matador" e o "garçom" mais brilham.

**4. Transição defensiva (acabou de perder a bola — contrapressing ou recomposição):** o ponto mais delicado. Como o 10 fica adiantado, quando o time perde a bola ele está **mal posicionado pra defender** e longe do próprio gol. Duas escolhas do sistema: (a) **contrapressing** — ele pressiona imediatamente quem roubou, pra sufocar a saída (exige fôlego e atitude); ou (b) **recomposição** — corre pra trás pra reocupar a zona central. O enganche clássico falha aqui (não pressiona nem volta), e é exatamente por isso que times de pressing alto (Klopp, Bielsa) tradicionalmente desconfiam do 10 puro.

#### Zonas ocupadas e gaps deixados

**Zonas que ocupa (consenso):**
- **Corredor central, último terço, "zona 14"** — o espaço logo na entrada da área, no eixo central, à frente da linha de zagueiros. É estatisticamente a zona de onde mais saem assistências de qualidade; é o "escritório" do 10. (Jargão: o campo é dividido em 18 zonas; a *zona 14* é a central imediatamente antes da grande área.)
- **Meio-espaços / half-spaces** — os corredores intermediários entre o centro e a lateral (nem totalmente no meio, nem na linha de fundo). O 10 moderno desliza pra esses corredores pra receber em ângulo mais aberto, fora da aglomeração central, e atacar a área na diagonal.
- **"Entre linhas"** no eixo — o vão vertical entre defesa e meio adversários.

**Espaço que ABRE para os outros:**
- Quando o 10 cai pra receber, ele **arrasta um volante** adversário pra fora de posição — isso abre o vão para o 9 atacar as costas da zaga ou para um meia chegar de trás.
- Sua ameaça entre linhas obriga os zagueiros centrais a hesitar (sair pra marcá-lo abre buraco na zaga; ficar deixa ele livre) — esse "dilema do zagueiro" é o presente que o 10 dá ao centroavante.

**Espaço que DEIXA EXPOSTO / como o adversário explora a ausência:**
- O 10 ocupa pouca largura e fica adiantado, então a **zona à sua frente-lateral e atrás dele** (o setor do volante adversário em construção) fica desguarnecida quando o time defende. Se ele não recua, o adversário tem **superioridade numérica no meio-campo** — sobra um homem livre pra construir.
- Na transição defensiva, a região central logo à frente da defesa (justamente a "zona 14" do adversário) fica aberta porque o 10 está lá na frente, fora da jogada. Times que atacam rápido o centro punem o 10 que não volta.
- Adversários espelham o 10 com um volante "marcador-sombra" (que o segue por toda parte) ou com marcação por zona agressiva da linha de meio, tirando-o do jogo — quando o 10 é apagado e não tem plano B, o ataque do time inteiro emperra.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo:** geralmente o 10 é o **homem mais poupado** da defesa aérea — raramente é dos mais altos e seu valor está com a bola, não nos duelos. Em escanteios defensivos costuma ficar **na entrada da área (na "quina") ou adiantado como referência de contra-ataque** — é deliberadamente deixado fora da marcação pra ser a saída rápida caso o time afaste a bola. Em alguns esquemas marca por zona o primeiro poste ou a "segunda bola" (a bola que sobra após o primeiro afastamento). Não é o jogador a quem se cobra ganhar duelo aéreo defensivo.

**Jogo aéreo ofensivo:** também não é referência de cabeceio (salvo o 10-finalizador alto, raro). Seu papel ofensivo no alto é **rondar a segunda bola** e o rebote — ficar na borda da área pra recuperar o que sobra e finalizar de primeira, ou recarregar a jogada.

**Bola parada (peça-chave):**
- **Cobrador.** Aqui o 10 frequentemente é **o batedor designado** — de faltas (pela técnica de chute e curva), de escanteios e às vezes de pênaltis. É um dos maiores "ganchos explicativos" da posição: muito do volume de finalização e de assistência de bola parada de um time passa pelo pé do 10. Bruno Fernandes e De Bruyne são exemplos atuais de 10s que concentram a batida de bola parada e penalidades.
- **Falta direta:** o 10 com bom pé é a ameaça de gol olímpico/falta no ângulo — informa o mercado de "gol de falta" e de finalizações.
- **Escanteios:** o 10 batedor define a qualidade da entrega; se ele bate, normalmente não é alvo dentro da área (fica fora). Se *não* bate, pode ser o homem da quina pra finalização de fora ou da segunda bola.
- **Lateral ofensivo / arremesso:** participa das tabelas curtas pra reativar a posse no campo de ataque, raramente como alvo.

**Confiança:** que o 10 tende a ser o batedor de bola parada designado = `consenso`; os nomes específicos (Bruno, De Bruyne) = `verificado-fetch`/`consenso`.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha defensiva (do próprio time):** quanto **mais alta** a linha do seu time (defesa adiantada, campo comprimido), **menos espaço o 10 tem** para receber entre linhas — porque o campo fica curto e as fileiras adversárias se juntam. Paradoxalmente, o 10 brilha mais quando *o adversário* sobe a linha e deixa espaço atrás/entre as linhas dele. Por isso um 10 rende muito contra times que pressionam alto (há vão pra explorar) e sofre contra blocos baixos e compactos (não há espaço entre linhas — tudo está aglomerado na frente da área).

**Espaço entre linhas (o habitat dele):** é literalmente a matéria-prima do 10. Contra **bloco compacto** (defesa e meio coladas, ~25-30m entre goleiro e linha de meio), o vão some e o 10 precisa *criar* o espaço ele mesmo — caindo pra receber, fazendo o adversário "morder" a isca, ou jogando de um toque pra acelerar antes de a defesa se fechar. Contra **bloco esticado** (linhas distantes), o 10 vive. O treinador de elite mede a relação **"compactação vertical do adversário × qualidade do 10 em espaço curto"** pra prever se ele vai aparecer no jogo.

**Pressing e contrapressing (PPDA):** PPDA ("passes permitidos por ação defensiva") é a métrica de intensidade de pressão — quanto **menor** o PPDA, mais o time pressiona. Um 10 que não pressiona **piora o PPDA do time** (deixa o adversário tocar livre na saída) — é o motivo tático nº1 de o 10 puro ter caído de moda em times de pressing. O 10 box-to-box, ao contrário, é gatilho de pressing: fecha o volante adversário e dispara a armadilha. No contrapressing (reação imediata à perda), o 10 adiantado pode ser o primeiro a sufocar quem roubou — se tiver a mentalidade pra isso. Em resumo: a relação do 10 com o pressing é o eixo que decide se ele é um luxo absorvível ou um buraco no sistema.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**A formação que MAIS APAGA o 10 puro.** No 4-4-2 não existe uma vaga natural pra um 10: há dois meias centrais (que precisam cobrir muito chão) e dois pontas presos às linhas. O 10 clássico fica sem casa — se jogar como um dos dois centrais, é exposto defensivamente (o parceiro vira sozinho 2 buracos); se jogar como um dos atacantes, vira segundo atacante e perde a função de organizar entre linhas. *Como aparece quando aparece:* um dos dois atacantes recua e funciona como 'falso 10' livre, formando um 4-4-1-1 informal — esse é o caminho. Riscos: o 10 fica isolado entre as linhas adversárias sem apoio próximo e perde volume de bola. **Veredito: formação hostil ao arquétipo;** só cabe se o time aceitar virar 4-4-1-1 e tiver dois centrais que corram por três.

**4-4-2 em losango (diamante)**

**A formação que mais EXALTA o 10 clássico.** O losango tem, por definição, um 10 na ponta de cima do diamante, com um volante na base e dois meias nas laterais do diamante. É o lar tradicional do enganche: ele joga **central, adiantado, atrás de duas referências de ataque (dois 9s)** — a configuração ideal pra tabela e último passe. Tarefas: ligar meio e ataque, alimentar os dois atacantes, receber entre linhas com liberdade quase total. Liberdade: máxima — o volante e os dois meias 'pagam' a conta defensiva por ele. Conexões: 10+os dois 9s (tabelas), 10+laterais (que dão a largura que o diamante não tem). Risco do sistema: pouca largura (o diamante é estreito) — depende dos laterais subirem, e se o 10 não defende, o miolo pode ficar exposto nas costas. **Veredito: a vitrine do 10; é onde o enganche puro ainda sobrevive no topo.**

**4-3-3**

**Não há vaga de 10 puro — ela se transforma em mezzala (meia interior).** No 4-3-3 o meio é um trio (geralmente 1 volante + 2 meias), sem um 10 dedicado atrás do 9. O DNA do camisa 10 migra para a **mezzala adiantada (interior 8):** um dos dois meias joga mais alto, pelos meio-espaços, com licença criativa — recebe entre linhas mas também corre e chega na área. Tarefas: progressão por dentro, combinar com o ponta e o lateral do seu lado, infiltrar na área. Liberdade: média — tem que voltar e ajudar o trio a sustentar o meio-campo. Conexões: mezzala+ponta+lateral (o 'trio do corredor'). Bellingham no Madri e Bernardo/De Bruyne em fases do City são esse 10 disfarçado de mezzala. **Veredito: a formação não tem o cargo, mas absorve o talento — desde que o 10 corra.**

**4-2-3-1**

**A casa moderna por excelência do camisa 10.** O '3' do meio do 4-2-3-1 é a linha de três criativos atrás do 9, e o homem central desse três **é literalmente o 10.** Atrás dele, dois volantes ('o duplo pivô') fazem a proteção — exatamente a estrutura que cobre a fragilidade defensiva do 10 e o libera pra criar. Tarefas: receber entre linhas, organizar o último terço, ligar com o 9 e com os dois meias-pontas dos lados. Liberdade: alta no ataque, com a rede de segurança dos dois volantes atrás. É o esquema que melhor equilibra 'dar liberdade ao 10' com 'não ficar exposto'. Risco: se os dois volantes não cobrem o suficiente, o 10 ainda deixa o meio em desvantagem na transição. **Veredito: o melhor compromisso do futebol moderno entre liberdade criativa e segurança — o esquema-padrão pra montar um time em torno de um 10.**

**4-1-4-1**

**O 10 vira um dos dois meias interiores avançados da linha de 4 do meio — diluído, mas presente.** Aqui há 1 volante de proteção (o '1') e uma linha de 4 à frente dele, dentro da qual moram dois interiores. O papel de 10 é assumido por um desses interiores, jogando alto perto do 9. Tarefas: alternar entre receber entre linhas e dar volume defensivo (a linha de 4 precisa defender junta). Liberdade: média-baixa na fase sem bola (tem que recompor a linha de 4), alta com bola. Conexão: o interior-10 vive de tabela com o 9, que costuma ficar isolado lá na frente. Risco: o 10 fica preso à disciplina da linha de meio-campo; menos liberdade que no 4-2-3-1. **Veredito: tolera o 10, mas como 'meia que cria', não como enganche livre — exige um jogador híbrido.**

**3-5-2 / 3-4-1-2**

**Depende do desenho: o 3-5-2 dilui, o 3-4-1-2 consagra.** No **3-5-2 puro** não há 10 fixo — o talento criativo joga como um dos três meias (geralmente o mais adiantado, uma mezzala), apoiando os dois atacantes. Já o **3-4-1-2 tem um '1' que é exatamente o 10:** um enganche central, atrás de dois 9s, com quatro homens no meio à frente da linha de 3 zagueiros pra cobri-lo. Esse é dos melhores ambientes possíveis pro 10 clássico — proteção atrás (3 zagueiros + 2 volantes) e dois alvos na frente. Conexões: 10+dois 9s+alas (que dão toda a largura). Liberdade: muito alta no 3-4-1-2. **Veredito: 3-5-2 = papel diluído em mezzala; 3-4-1-2 = templo do enganche, comparável ao losango.**

**3-4-3 / 3-4-2-1**

**O 3-4-2-1 cria DOIS '10s' (os dois meias-atacantes); o 3-4-3 com tridente puro não tem nenhum.** No **3-4-2-1** os dois jogadores atrás do 9 são 'duplos 10s' / *mezze-punte* — vivem nos meio-espaços entre linhas, criando e chegando na área. É um habitat ótimo, com liberdade alta e largura dada pelos alas, mas exige que esses dois também pressionem (Conte usou muito esse modelo cobrando defesa dos dois). No **3-4-3 com três atacantes de frente (tridente)**, não há 10 — o criativo teria que jogar de ponta-invertido (recolhendo pra dentro como falso 10) ou de meia no quarteto. Conexões no 3-4-2-1: os dois 10s + o 9 formam um triângulo de ataque móvel, com os alas alargando. **Veredito: 3-4-2-1 valoriza muito (mas pede esforço defensivo dos 10s); 3-4-3 tridente apaga o enganche central.**

**5-3-2 / 5-4-1 (bloco de 5)**

**Formações DEFENSIVAS que tendem a apagar o 10 — ele vira a exceção criativa ou nem existe.** O 5-4-1 é puramente reativo (bloco de 5+4, um atacante só): não há lugar pra um 10 — todo mundo defende em duas linhas baixas e o único homem à frente é o 9 isolado. O 10 só caberia 'roubando' a vaga do 9 ou de um meia, mas perde a função. No **5-3-2** há mais respiro: o mais adiantado dos três meias pode jogar como '10 de transição' — não cria em posse paciente (o time tem pouca bola), mas é o **homem-chave do contra-ataque**, recebendo entre linhas no instante da recuperação pra lançar os dois atacantes. Liberdade: baixíssima com bola, mas decisivo na transição ofensiva. **Veredito: bloco de 5 é hostil ao 10 de posse; no 5-3-2 ele sobrevive reconvertido em criador de contra-ataque — um 10 'de transição', não 'de organização'.**

**4-3-1-2 (sem pontas)**

**Outra formação-templo do 10 — é o nome técnico do diamante.** O '1' do 4-3-1-2 é o camisa 10 explícito: central, atrás de dois 9s, com um trio de meio (1 volante + 2 meias) protegendo-o. Idêntico em espírito ao 4-4-2 losango. Sem pontas, **toda a criação pelo centro passa pelo 10** — ele é o eixo absoluto do ataque, com liberdade máxima e dois alvos de tabela. Conexões: 10+dois 9s (combinações centrais), 10+laterais (única fonte de largura — críticos pra não deixar o ataque previsível pelo meio). Risco: sem pontas o jogo fica estreito e previsível se o 10 for marcado de perto; e se ele não defende, o meio precisa de três meias muito disciplinados. **Veredito: valoriza ao máximo — é uma das duas ou três formações desenhadas literalmente em torno de um camisa 10.**

#### Parcerias-chave

**As relações que fazem ou quebram um camisa 10 (consenso):**

- **10 + centroavante (9):** a parceria mãe. O 10 vive de *ler* o movimento do 9 e vice-versa. Se o 9 é **móvel e cai pra combinar** (tipo falso 9), eles fazem tabelas e trocam de posição — o 10 ataca o espaço que o 9 abre. Se o 9 é **fixo, alto e ataca a profundidade** (centroavante de área), o 10 vira o garçom que o alimenta com passe nas costas da zaga e cruzamentos rasteiros. O 10 precisa saber *que tipo* de 9 tem na frente, porque isso muda tudo. Dupla 10-9 entrosada é a fábrica de gols do time.

- **10 + volante(s) de proteção:** invisível mas vital. Pra o 10 ter liberdade, **alguém paga a conta defensiva atrás dele** — o duplo pivô do 4-2-3-1 ou o volante de base do diamante. Quanto melhor o volante 'limpa' as costas do 10, mais o 10 pode adiantar e arriscar. É a parceria silenciosa que viabiliza o luxo.

- **10 + laterais/alas:** em formações estreitas (diamante, 4-3-1-2, 3-4-1-2) os laterais/alas dão a **largura que o 10 não dá**. O 10 atrai a defesa pro centro e descarrega pro lateral livre na ponta — ou recebe o cruzamento dele. Sem laterais ofensivos, o 10 central fica previsível e fácil de marcar.

- **10 + extremos/pontas (quando há):** o 10 e o ponta trocam o corredor — o ponta vem por fora e ataca a profundidade, o 10 desliza pro meio-espaço. Combinam em tabelas de tabela curta e diagonais. Com ponta-invertido (que corta pra dentro), o 10 precisa dar espaço pra não se atropelarem no meio.

- **10 + outro 10 (nos sistemas de dois meias-atacantes, ex. 3-4-2-1):** precisam de **referências espelhadas** — um ocupa o meio-espaço esquerdo, o outro o direito, alternando quem cai e quem ataca, pra não pisarem na mesma zona.

#### Exemplos de elite

**Atuais de elite (2023-2026) — confiança `verificado-fetch`/`consenso`:**

- **Jude Bellingham (Real Madrid)** — protótipo do *10 box-to-box / moderno*: cria entre linhas, corre, pressiona e chega na área pra fazer gol. O arquétipo dominante da era. (`verificado-fetch`: descrito como dos atacantes-meias mais completos do mundo, jogando como meia avançado com output de elite.)
- **Bruno Fernandes (Manchester United)** — *regista avançado / 10 organizador + finalizador*: concentra criação, batida de bola parada e pênaltis; quebrou recorde de assistências da Premier League. Exemplo de 10 que vive de último passe e de chute. (`verificado-fetch`: ~0,59 assistências intencionais por 90, percentil 95.)
- **Florian Wirtz (Liverpool)** — *10 condutor/criativo entre linhas*, técnico, visão e compostura no último terço. (`verificado-fetch`.)
- **Jamal Musiala (Bayern)** — *10 falso/dançarino*: cria pelo drible e condução em espaço curto, o meia-atacante mais valorizado do mundo na pesquisa (~€130M). (`verificado-fetch`.)
- **Kevin De Bruyne** — *regista avançado de elite*: o passador total (curto, médio, longo, com as duas faces do pé), referência de 10 que organiza e bate bola parada. (`verificado-fetch`.)
- **Rayan Cherki, Xavi Simons, Cole Palmer, Phil Foden** — geração atual de 10s/criativos por dentro; Cherki citado como nº1 do posto na Premier 2025-26 numa métrica, Palmer/Foden como 10s-finalizadores. (`verificado-fetch` para as menções; rankings variam por fonte, tratar como ilustrativo, não definitivo.)

**Históricos que DEFINIRAM cada arquétipo (consenso):**
- *Enganche clássico:* **Riquelme** (o último grande 10 estático puro), **Zidane**, **Mesut Özil** (o garçom entre linhas), **Francesco Totti** (trequartista total).
- *10 falso/condutor:* **Maradona**, **Ronaldinho** (criação por drible).
- *10 finalizador/segundo atacante:* **Kaká** em pico, **Dennis Bergkamp**, **Roberto Baggio**.
- *Maestro/regista avançado:* **Zico**, **Michel Platini**, **Juan Román Riquelme** também aqui.
- *Referência brasileira histórica do 'craque camisa 10':* **Pelé**, **Rivaldo**, **Ronaldinho** — a linhagem que deu ao número seu peso simbólico.

#### Erros comuns / como falha

**Como a posição falha — sinais que um treinador de elite cobra (consenso):**

- **"Sumir do jogo" / ficar invisível:** o erro nº1. O 10 que não se mexe pra criar ângulo de passe fica nas costas do volante adversário e nunca recebe. Sinal: poucos toques, pedidos de bola só de costas e parado. Cobrança: 'apareça entre linhas, peça em movimento, escaneie antes de receber'.

- **Não escanear (cabeça baixa):** receber sem ter olhado o campo antes → toma a bola já marcado e a perde ou volta pra trás. Sinal: muita perda de posse no último terço, joga sempre 'pra trás'. Os melhores 10s fazem vários check-de-ombro por segundo.

- **Segurar a bola demais (over-dribbling):** o 10 'dançarino' que conduz quando devia tocar de primeira — trava a velocidade do ataque e deixa a defesa se reorganizar. Sinal: contra-ataques que morrem nos pés dele; muitos dribles tentados, poucos passes progressivos.

- **Não defender / não pressionar:** transforma o time em 10x11 na fase sem bola e piora o PPDA. Sinal: o volante adversário sai jogando sempre livre; o time sofre superioridade no meio. É o motivo de muitos 10s puros não caberem em times de pressing.

- **Má transição defensiva:** após a perda, o 10 fica 'passeando' adiantado em vez de pressionar ou voltar — abre o corredor central pro contra-ataque adversário. Cobrança clássica: '5 segundos de pressão ou volta pra linha'.

- **Decisão ruim sob pressão / forçar o passe difícil:** insistir no passe espetacular de baixa probabilidade quando havia a opção simples. Sinal: muitas perdas tentando o 'passe-açúcar'; baixa taxa de acerto de passe no terço final.

- **Posicionamento estático / não rodar entre meio-espaços:** ficar 'colado' no centro deixa o 10 fácil de marcar (um volante-sombra o anula). Cobrança: deslize pros meio-espaços, alterne profundidade, force o marcador a decidir.

- **Não saber 'ler o 9':** combinar mal com o tipo de centroavante (pede curto quando o 9 quer profundidade e vice-versa) → ataque desconexo.

**Veredito do treinador:** um 10 falha quando dá **baixo volume de criação E baixo volume defensivo ao mesmo tempo** — aí ele não justifica a vaga. O 10 sobrevive no topo moderno provando uma das duas coisas: criação de elite (que compensa a defesa) ou contribuição defensiva real (que o torna absorvível)."

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**O que esta posição mais informa para o assistente EXPLICAR (sempre explicativo, nunca preditivo, nunca 'edge' — o número do mercado é que manda; isto é só vocabulário pra narrar o porquê):**

- **Assistências e criação de chances:** é o gancho-mãe. O camisa 10 é, por desenho, o maior produtor de assistências e 'chances criadas' do time — explicar quem é o 10, seu arquétipo (garçom/dançarino/matador) e contra que tipo de bloco ele joga ajuda a *narrar* por que um time gera muitas ou poucas chances. (Explicativo, não dica.)

- **Gols (volume ofensivo do time):** a presença e a forma do 10 informam o quão fluido é o ataque. 10 de elite em formação que o valoriza (4-2-3-1, diamante) = história de ataque mais criativo; 10 apagado por bloco compacto = história de ataque travado. Útil pra contextualizar mercados de gols — sempre ancorado no número, nunca como recomendação.

- **Props de jogador (assistências, finalizações, passes-chave do 10):** o 10 costuma liderar o time nessas métricas individuais — bom material pra explicar de onde vêm os números de um jogador específico.

- **Bola parada → escanteios, faltas, pênaltis:** o 10 é tipicamente o **batedor designado** — então muito do volume de finalização de bola parada, e os pênaltis/faltas diretas, passam por ele. Forte gancho explicativo pros mercados de bola parada e de 'gol de falta/pênalti' (descritivo: 'quem bate e por quê', não 'aposte nisso').

- **Escanteios (volume do time):** um 10 criativo que ataca muito pelo centro e força defesas a desviar/bloquear gera contexto pra volume de escanteios — explicativo.

- **Cartões (gancho mais fraco/indireto):** o 10 costuma ser *vítima* de falta (driblador na zona apertada → sofre faltas → cartões no adversário) mais do que autor. Pode ajudar a narrar de onde saem faltas e cartões num jogo, com baixa força — marcar como hipótese.

- **Jogo aéreo:** gancho **fraco** pra esta posição (o 10 raramente é referência aérea) — mencionar só pra dizer que NÃO é onde o 10 informa.

**Regra fixa:** todos acima são *gerador de hipóteses e narrativa explicativa*, ancorados no número do mercado/quant, que nunca se move. Nunca apresentar como 'edge', 'dica por posição' ou recomendação de aposta."

---

### Extremo / Ponta (ponta aberta, extremo invertido / inverted winger, ponta-atacante)

#### Resumo didático

**O que é, em uma frase:** o extremo (ou ponta) é o jogador de ataque que joga colado a uma das laterais do campo — a faixa de grama mais próxima da linha de fundo do lado direito ou esquerdo. "Faixa" ou "corredor" aqui significa: imagine o campo dividido em três avenidas verticais — corredor esquerdo, miolo (central) e corredor direito. O extremo vive nas avenidas das pontas.

**Por que essa posição existe:** o futebol é um jogo de espaço. No meio do campo (o miolo) há muita gente amontoada — é a região mais defendida. Os lados ficam mais livres. O extremo existe para **atacar pelo lado, onde sobra espaço**, e fazer três coisas: (1) **driblar** o defensor da frente dele (em geral o lateral adversário) num confronto de 1 contra 1; (2) **cruzar** a bola para a área (jogar a bola por cima ou rasteira para o centroavante cabecear/chutar); ou (3) **cortar para dentro e finalizar** ele mesmo, como se fosse um segundo atacante.

**A grande divisão que o dono do produto PRECISA entender — pé e lado:** existem dois jeitos opostos de jogar de ponta, e tudo decorre disso.
- **Ponta "aberto" / de pé natural:** destro jogando na direita, ou canhoto jogando na esquerda. Ele tem a linha de fundo do lado do seu pé bom. Tende a **ir por fora**, chegar à linha de fundo e **cruzar**. Pensa em assistência por cruzamento.
- **Extremo "invertido" / inverted winger:** destro jogando na ESQUERDA, ou canhoto jogando na DIREITA. O pé bom dele aponta para o meio do campo. Ele tende a **cortar para dentro** (driblar em diagonal rumo ao gol) e **finalizar** ou dar um passe de qualidade. É o arquétipo dominante do futebol moderno (`consenso`). Salah (canhoto na direita), Vinícius Jr. (destro na esquerda) e Lamine Yamal (canhoto na direita) são os retratos disso (`verificado-fetch`).

**Tradução de jargão que vai aparecer:** "ponta" = extremo = winger (tudo a mesma coisa). "Cortar para dentro" = driblar em diagonal do lado para o miolo. "Cair na linha" = ir colar na lateral do campo para esticar a defesa. "1v1" = duelo individual ponta x lateral. "Ponta-atacante" (inside forward) = um extremo que joga tão por dentro e tão perto do gol que vira quase um segundo centroavante.

#### Perfil e arquétipos

**Atributos ideais (o que faz um bom ponta):**
- **Físico:** velocidade explosiva (arranque curto de 5–15 metros é mais importante que velocidade de fundo), aceleração e mudança de direção, equilíbrio para driblar em alta velocidade. Resistência para repetir piques (um ponta dá dezenas de sprints máximos por jogo). Não precisa ser alto.
- **Técnico:** drible em velocidade, controle de bola no espaço curto, finalização (especialmente o invertido), qualidade de cruzamento (especialmente o aberto), passe de quebra de linha, e — cada vez mais exigido (`consenso`) — capacidade de receber de costas e proteger a bola.
- **Mental:** coragem para encarar o 1v1 e errar (um ponta que tem medo de driblar é inútil), tomada de decisão sob pressão (cruzar? cortar? segurar?), e disciplina tática defensiva, que hoje é inegociável até para os craques (`consenso`).

**Sub-papéis e arquétipos — a diferença prática:**

1. **Ponta aberto clássico / touchline winger (pé natural):** vive colado à linha, estica o campo na largura, vai à linha de fundo e cruza. Função: dar **amplitude** e munição aérea. Ex. histórico: David Beckham (mais cruzador que driblador), Arjen Robben era o oposto disso. Atuais puros são raros; aproxima-se disso um Pervis Estupiñán/cruzadores de fundo ou um ponta de seleção mais conservadora.

2. **Extremo invertido / inverted winger (pé trocado):** corta para dentro, finaliza com o pé bom em diagonal, cria a partir do meio-espaço. É o **modelo dominante** (`consenso`). Salah, Vinícius, Yamal, Saka, Doku, Olise (`verificado-fetch`).

3. **Inside forward / ponta-atacante:** versão extrema do invertido — joga tão por dentro que opera como segundo 9, vivendo entre o zagueiro e o lateral, somando muitos gols. Salah em alguns anos do Liverpool; Son no City... (na verdade Son no Tottenham); Mbappé partindo da esquerda funciona quase como ponta-atacante.

4. **Ponta-condutor / dribbler de progressão (Doku, Kvaratskhelia, Vinícius):** o valor está em **carregar a bola** e furar bloco no 1v1, não no número de gols. Gera faltas, escanteios e desorganização (`consenso`).

5. **Ponta-criador / playmaker de lado (Olise, Saka, Yamal):** o pé é uma ferramenta de **passe**; corta para dentro não só para chutar, mas para enfiar bolas. Yamal "costura linhas defensivas com o canhoto" (`verificado-fetch`).

6. **Ponta-trabalhador / two-way winger:** o que mais corre para trás, cobre o lateral e pressiona. Saka é citado por "criar, marcar, conduzir E trabalhar defensivamente" (`verificado-fetch`); na seleção, jogadores como Bukayo Saka ou um Raphinha encarnam isso.

#### Os 4 momentos do jogo

**1. Organização ofensiva (com a bola, jogo montado):** é o momento-âncora do ponta. Ele se posiciona conforme o arquétipo: o **aberto** fica colado à linha para **esticar a defesa na largura** (forçar o lateral adversário a sair, abrindo buracos por dentro); o **invertido** posiciona-se no **meio-espaço** (a faixa entre o corredor lateral e o miolo central) a espera de receber de frente para o gol ou para fazer a diagonal de corte. Aqui o ponta é o gatilho do 1v1: recebe, encara o lateral e decide entre cruzar, cortar ou tabelar com o lateral do seu time (`consenso`).

**2. Organização defensiva (sem a bola, adversário com posse montada):** no futebol moderno é onde os pontas mais evoluíram e onde os fracos são expostos (`consenso`). A tarefa típica: **fechar a saída do lateral adversário** e recuar para formar uma linha de defesa de 4-4-2 ou 4-5-1 quando o time defende baixo — o ponta "vira o quarto/quinto homem da linha". Quanto mais ofensivo o time, mais alto o ponta para. O grande risco é o ponta preguiçoso que não acompanha o lateral adversário, deixando o próprio lateral em inferioridade 2v1.

**3. Transição ofensiva (acabou de recuperar a bola — contra-ataque):** é o momento de OURO do ponta veloz (`consenso`). Com a defesa adversária desorganizada, o espaço nas costas dos laterais é gigante. O ponta arranca em diagonal ou pela linha; um único pique seu pode transformar recuperação em gol. Vinícius e Doku vivem disso (`verificado-fetch`). Times que defendem baixo e lançam o ponta na transição (ex.: Real Madrid de Ancelotti em alguns jogos grandes) fazem disso a principal arma.

**4. Transição defensiva (acabou de perder a bola — contrapressão ou recuo):** o ponta tem duas obrigações possíveis. Em times de **contrapressão** (Klopp, Guardiola), ele pressiona imediatamente para recuperar nos 5 segundos seguintes. Em times de **recuo organizado**, ele dispara de volta para tapar o corredor antes que o adversário ataque pela ponta dele. É a tarefa que craques odeiam e treinadores de elite cobram sem exceção (`consenso`).

#### Zonas ocupadas e gaps deixados

**Corredores que ocupa:** o ponta vive no **corredor lateral** (a avenida vertical junto à linha) e, no caso do invertido, migra para o **meio-espaço** (half-space, a faixa intermediária entre o corredor lateral e o miolo central — a zona mais valiosa do ataque moderno, de onde se enxerga o gol em diagonal) (`consenso`).

**Espaço que ABRE para o time (efeito cascata):**
- O ponta **aberto** que cola na linha **arrasta o lateral adversário para fora**, abrindo o **corredor por dentro** para o meia ou para o lateral do próprio time avançar.
- O ponta **invertido** que **corta para dentro** desocupa o corredor lateral e o **entrega para o lateral do próprio time fazer a sobreposição** (overlap: o lateral corre por fora, por trás do ponta). É a sociedade clássica do futebol atual: invertido por dentro + lateral por fora (`consenso`).
- Ao puxar marcação para o lado, o ponta também **alarga a linha de zaga adversária**, abrindo o buraco central para o centroavante.

**Espaço que DEIXA EXPOSTO (o gap):** quando o ponta sobe e não volta, ou quando o lateral do próprio time avança em sobreposição e a bola é perdida, fica um **buraco gigante nas costas** daquele corredor. O adversário ataca exatamente ali na transição. Esse é o ponto fraco estrutural de toda equipe com pontas ofensivos e laterais que sobem (`consenso`). Por isso muitos times usam um volante que "desce e cobre o lado" ou um ponta-trabalhador disciplinado para tapar esse vão.

**Como o adversário explora a ausência:** lança rápido no espaço atrás do ponta/lateral; ataca em superioridade 2v1 contra o lateral solitário; ou inverte o jogo (troca de lado em bola longa) justo para o corredor que o ponta abandonou.

#### Jogo aéreo e bola parada

**Jogo aéreo na dinâmica (bola rolando):**
- **Ofensivo:** o ponta **aberto** é o principal **fornecedor de cruzamentos** — a munição aérea do centroavante depende dele. O **invertido** raramente cruza de fundo; ele faz o **cruzamento "trivela"/de trás para frente** ou, mais comum, abandona o jogo aéreo e busca o chute. O ponta em si quase nunca é alvo de cabeçada (em geral baixo); a exceção é o ponta entrando no segundo pau para cabecear cruzamento do lado oposto — jogada clássica do invertido que "ataca o segundo poste".
- **Defensivo:** numa defesa de cruzamento, o ponta costuma **marcar o lateral adversário** ou ficar na "zona curta" perto da área para cortar o cruzamento na origem. Não é peça aérea forte dentro da própria área (vai contestar a primeira bola só em emergência).

**Bola parada (set pieces):**
- **Escanteio ofensivo:** o ponta com bom pé é frequentemente o **cobrador** (o invertido bate com curva fechando no gol — "in-swinger"; o pé natural bate "out-swinger" afastando do goleiro). Yamal e Saka cobram escanteios e faltas (`consenso`). Se não cobra, costuma ficar na **borda da área** para a **segunda bola** (rebote) ou no esquema de **contra-ataque** (fica adiantado esperando a sobra para sair no pique).
- **Falta:** o invertido de pé bom é o **batedor de falta direta** preferencial de muitos times.
- **Lateral/arremesso:** participa de tabelas curtas no seu corredor.
- **Pênalti:** pontas costumam estar entre os **batedores** designados (Salah, Saka são cobradores regulares) (`consenso`).
- **Defesa de bola parada:** quase sempre o ponta fica **adiantado** como "saída rápida" (out-ball) para o contra-ataque, ou marca um homem na primeira trave/zona curta. Raramente é peça de marcação aérea pesada.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha defensiva (própria):** quanto mais alta a linha do próprio time, **mais alto o ponta começa** e mais perto do gol adversário ele opera — o que favorece o invertido finalizador. Quando a linha é baixa (time defende recuado), o ponta recua para virar 4º/5º da linha defensiva e seu valor migra todo para a **transição**: ele vira o "ponto de saída" do contra-ataque (`consenso`).

**Altura da linha defensiva ADVERSÁRIA — distinção crucial para EXPLICAR um jogo:**
- **Contra linha alta:** abre-se o espaço NAS COSTAS dos zagueiros. O ponta **veloz** é a arma perfeita — corre para o espaço, recebe lançamento ou bola em profundidade. Aqui o ponta-condutor/velocista brilha (Vinícius, Doku) (`consenso`).
- **Contra linha baixa / bloco fechado:** não há espaço atrás; tudo é congestionado. Aí o valor é do ponta **driblador/criador** que fura o 1v1 no pouco espaço, gera falta e escanteio, ou inventa o passe entre linhas (Yamal, Olise) (`consenso`). Velocidade pura vale menos.

**Espaço entre linhas:** o invertido caça o espaço **entre a linha de defesa e o meio-campo adversário** (entrelinhas) recebendo de frente para o gol — é onde ele se torna criador. Quanto mais o adversário deixa esse vão aberto, mais perigoso o invertido.

**Pressing / contrapressing (e PPDA):** PPDA = "passes permitidos por ação defensiva", uma métrica de intensidade de pressão; PPDA baixo = pressiona muito. O ponta é um **gatilho de pressão**: muitas vezes é ele quem inicia a pressão sobre o lateral/zagueiro adversário, dando o sinal para o time subir. Em times de PPDA baixo (pressão alta: Liverpool de Klopp, City de Guardiola), o trabalho defensivo do ponta é tão importante quanto o ofensivo (`consenso`). Um ponta que não pressiona quebra o sistema todo.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**Formação que define o ponta tradicional.** Aqui o extremo é literalmente um dos quatro do meio-campo: na linha de 4, os dois homens das pontas SÃO os extremos. Tarefa dupla e pesada: atacar pela ponta na posse E **recuar para formar a linha de 4 defensiva** marcando o lateral adversário. Tende a ser o ponta **aberto/two-way** (trabalhador), pois precisa de disciplina defensiva. Liberdade ofensiva menor que no 4-3-3 — ele não tem um lateral tão liberado para sobreposição constante e cobre muito chão na vertical. Conecta-se com o lateral atrás (dobra na ponta) e com os DOIS centroavantes à frente (cruza para os dois). A formação **valoriza o ponta como cruzador e corredor de linha**, mas **apaga o ponta-craque puro** que não defende — não há lugar para passageiro no 4-4-2 (`consenso`).

**4-4-2 em losango (diamante)**

**Formação que APAGA o ponta — não existem extremos de origem.** O meio-campo é um losango (1 volante, 2 meias por dentro, 1 meia-armador na ponta do losango) e há 2 centroavantes. A largura NÃO vem de pontas; vem **inteiramente dos laterais**, que sobem como pontas improvisados. Se há um jogador de perfil de ponta no time, ele é remanejado: ou vira um dos 2 atacantes (caindo para o lado), ou é o meia da ponta do losango com licença para flutuar para as faixas. Quem ama jogar aberto sofre nesta formação porque o campo é estreito por dentro e congestionado no miolo. **Para EXPLICAR:** se um time joga em losango, espere poucos cruzamentos de ponta tradicional e muita dependência dos laterais para dar largura (`consenso`).

**4-3-3**

**A casa natural do ponta moderno.** No 4-3-3 há dois extremos de origem ladeando um centroavante — o tridente ofensivo. Máxima liberdade e máxima importância: é a formação que mais valoriza o ponta. Aqui floresce o **invertido** (corta para dentro enquanto o lateral sobrepõe por fora) e o **ponta-atacante** (joga quase como segundo 9). A largura pode vir do ponta (aberto) OU do lateral (com o ponta invertido por dentro) — flexível. Sociedade-chave: ponta + lateral do mesmo lado + um dos 3 meias que dá cobertura por dentro. Tridentes de elite: Liverpool de Klopp (Salah-Firmino-Mané), Barça histórico (Messi-Suárez-Neymar). **Valoriza intensamente** (`consenso`).

**4-2-3-1**

**Também excelente para o ponta — formação dominante do futebol de clubes.** Há 1 centroavante, um meia-armador (o '10') por dentro e DOIS pontas nas faixas, com 2 volantes dando segurança atrás. Essa proteção dupla **libera os pontas para serem mais ofensivos** e arriscarem o 1v1, porque o time está bem coberto. O invertido prospera porque o '10' ocupa o miolo e o lateral sobe por fora, criando a tríade lateral-ponta-meia no corredor. O ponta tem menos obrigação defensiva que no 4-4-2 (os 2 volantes amortecem). Conecta-se fortemente com o '10' (tabelas) e com o lateral (sobreposição). **Valoriza muito o ponta**, especialmente o invertido criador/finalizador (`consenso`).

**4-1-4-1**

**Formação que pede o ponta-trabalhador.** Estrutura: 1 volante de contenção, linha de 4 no meio (2 meias + 2 pontas) e 1 centroavante. Na defesa, vira facilmente um 4-5-1 com os pontas recuando para formar uma linha de 5 no meio — ou seja, **carga defensiva alta** sobre o extremo, parecida com o 4-4-2. Ofensivamente o ponta tem o centroavante isolado lá na frente, então precisa **chegar à área para apoiar a finalização** (o '1' sozinho não dá conta). Favorece o two-way winger disciplinado e o invertido que sabe atacar a área no segundo poste. **Valoriza o ponta equilibrado; apaga o craque que só ataca** (`consenso`).

**3-5-2 / 3-4-1-2**

**Formação que ELIMINA o ponta puro.** Com 3 zagueiros e 2 centroavantes, não há extremos: a largura vem dos **alas (wing-backs)** — homens que percorrem o corredor inteiro, metade lateral metade ponta. Se você tem um ponta nesse sistema, a saída é (a) recuá-lo para ala (perde o lado ofensivo, ganha defesa — muitos pontas detestam) ou (b) usá-lo como um dos 2 atacantes ou como o '1' do 3-4-1-2 (puxando para os lados). **Para EXPLICAR:** times em 3-5-2 dão largura por alas, não por pontas; cruzamentos vêm de mais fundo e o duelo de corredor é ala x ala, não ponta x lateral (`consenso`).

**3-4-3 / 3-4-2-1**

**Aqui o ponta VOLTA — mas em duas versões diferentes.** No **3-4-3** tradicional há um tridente ofensivo com 2 pontas abertos + centroavante; a largura é dividida entre o ponta e o ala do mesmo lado, o que pode liberar o ponta para jogar mais por dentro (quase ponta-atacante), já que o ala dá a largura. No **3-4-2-1** os 'pontas' são na verdade dois meias-atacantes que jogam **nos meios-espaços por dentro** (não colados à linha) — é mais inside forward que ponta clássico; a largura vem 100% dos alas. Formação muito usada por Conte e pelo Chelsea de Tuchel. **Valoriza o ponta que joga por dentro / nos meios-espaços, não o cruzador de linha** (`consenso`).

**5-3-2 / 5-4-1 (bloco de 5)**

**Formação defensiva que apaga ou reconfigura o ponta.** No **5-3-2** não há pontas — largura só por alas, e como o sistema é defensivo, até os alas sobem pouco. No **5-4-1**, os dois homens das pontas da linha de 4 são pontas que **recuaram para defender** quase como alas, formando um bloco baixíssimo. Aqui o valor do ponta é quase todo na **transição/contra-ataque**: ele defende recuado e, na recuperação, é o ponto de saída veloz para correr o campo (Vinícius/Doku num jogo de contra-ataque encaixam) (`consenso`). **Para EXPLICAR:** time em bloco de 5 com ponta veloz sinaliza estratégia de defender e sair no contragolpe — leitura útil para o porquê narrativo, nunca como edge.

**4-3-1-2 (sem pontas)**

**Formação que, pelo nome, ELIMINA o ponta.** É um meio-campo em estilo losango curto (3 + 1 enganchado) com 2 centroavantes e SEM extremos. Largura, de novo, **só dos laterais**. Um jogador de perfil de ponta aqui é remanejado para um dos 2 atacantes (caindo para os lados na dinâmica) ou para o '1' (meia enganchado) com liberdade de flutuar. Campo estreito e congestionado por dentro: ruim para quem vive de 1v1 na linha, bom para quem combina em espaço curto. **Para EXPLICAR:** ausência de pontas = jogo mais central, dependência total dos laterais para amplitude e cruzamentos vindos de fundo (`consenso`).

#### Parcerias-chave

**Ponta + lateral do mesmo lado (a parceria-mãe):** é a relação mais importante do extremo (`consenso`). Duas dinâmicas opostas:
- **Invertido + lateral em sobreposição (overlap):** o ponta corta para dentro, o lateral corre por fora e por trás dele para dar a largura e cruzar. Padrão dominante do futebol moderno.
- **Aberto + lateral em sub-sobreposição (underlap):** o ponta segura a largura na linha, e o lateral corre por DENTRO dele, pelo meio-espaço. Mais raro, usado por times de Guardiola.
O entrosamento ponta-lateral decide se aquele corredor é uma arma ou um buraco. Mau entrosamento = os dois pisam no mesmo espaço e o time fica exposto na transição.

**Ponta + meia-armador ('10'):** no 4-2-3-1 e 3-4-2-1, o ponta invertido e o '10' trocam de posição e fazem tabelas no meio-espaço; o '10' enche a bola para o ponta partir no 1v1 ou na diagonal.

**Ponta + centroavante ('9'):** o aberto **alimenta** o 9 com cruzamentos; o invertido **abre espaço** para o 9 ao arrastar marcação, e faz movimentos cruzados (o ponta entra por dentro enquanto o 9 sai para o lado — "rodízio"). Em times sem 9 fixo ("falso 9"), o ponta-atacante vira o finalizador principal.

**Ponta + volante de cobertura:** relação invisível mas vital — quando o ponta sobe e o lateral sobrepõe, é o volante que **desliza para tapar o corredor** abandonado. Sem esse volante, o ponta ofensivo é um luxo perigoso (`consenso`).

**Dois pontas entre si (tridente):** em times com tridente, os dois extremos coordenam profundidade — um cai para receber enquanto o outro ataca o segundo poste no cruzamento do lado oposto.

#### Exemplos de elite

**Invertidos de elite — atuais (2023–2026):** (`verificado-fetch`)
- **Lamine Yamal** (canhoto na direita, Barcelona) — apontado como o melhor ponta do mundo no momento, 14 gols e 9 assists no recorte de La Liga citado, 2º no Ballon d'Or 2025; arquétipo **criador-finalizador** que "costura linhas defensivas com o canhoto".
- **Mohamed Salah** (canhoto na direita, Liverpool) — o **ponta-atacante/inside forward** definitivo da era, máquina de gols por movimento, timing e finalização clínica mesmo marcado especificamente.
- **Vinícius Jr.** (destro na esquerda, Real Madrid) — arquétipo **condutor/velocista** que destrói linha alta na transição; 11 gols e 5 assists no recorte citado.
- **Bukayo Saka** (canhoto na direita, Arsenal) — o **two-way winger** completo: cria, marca, conduz e trabalha defensivamente.
- **Jeremy Doku** (destro na esquerda, Man City) — **driblador puro** de elite, top em toques na área adversária por 90; valor em furar bloco baixo no 1v1.
- **Michael Olise** (canhoto na direita, Bayern) — **criador-finalizador**, primeiros dois dígitos de gols+assists na liga em 2024/25.
- **Khvicha Kvaratskhelia** (destro na esquerda) — **condutor/driblador** de progressão.

**Tendência tática verificada:** a direita virou a casa do "atacante invertido" canhoto (Yamal/Saka/Salah) — driblar para dentro e finalizar, em vez de cruzar de fundo (`verificado-fetch`).

**Históricos que definiram os arquétipos:** (`consenso`)
- **Arjen Robben** — invertido canhoto na direita; a "jogada do Robben" (corta para dentro e bate no contrapé) é o protótipo do arquétipo.
- **Lionel Messi** — inside forward/falso-9 partindo da direita; redefiniu o ponta-atacante.
- **Cristiano Ronaldo** (fase Man Utd/Real) — ponta que virou finalizador letal vindo da esquerda.
- **Ryan Giggs / David Beckham** — pontas abertos clássicos (Giggs driblador de linha; Beckham cruzador).
- **Garrincha** — o ponta-driblador de 1v1 arquetípico do futebol brasileiro.

*Confiança:* dados numéricos específicos vêm de uma única busca (`verificado-fetch`, podem datar/variar); a classificação por arquétipo é `consenso`.

#### Erros comuns / como falha

**Como a posição falha — o que um treinador de elite cobra:**

1. **Não defender / não recuar (o pecado capital):** o ponta que sobe e não volta deixa o próprio lateral em 2v1 e o time exposto na transição. É a falha número 1 e a mais cobrada hoje, mesmo de craques (`consenso`). Sinal de mau desempenho: o time sofre repetidamente ataques pelo corredor daquele ponta.

2. **Drible no momento errado / perda de bola em zona perigosa:** encarar o 1v1 quando deveria segurar e sair em transição imediata para o adversário. Volume de dribles alto com baixa taxa de sucesso em zona central é bandeira vermelha.

3. **Decisão ruim no último terço:** cruzar quando deveria cortar, cortar quando deveria cruzar, finalizar quando o passe estava melhor. O "ponta egoísta" que ignora o companheiro melhor posicionado.

4. **Cruzamento ruim / previsível:** o ponta aberto cuja única arma é o cruzamento de fundo e que cruza para ninguém (sem alvo na área) ou sempre na mão do goleiro.

5. **Ser apagado por marcação dobrada:** times marcam o craque com lateral + um homem extra. O ponta que não sabe **trocar de lado, cair para receber ou liberar o espaço** para o companheiro vira passageiro. Bom ponta lida com a dobra arrastando-a e abrindo espaço para outro.

6. **Falta de pé invertido / unidimensionalidade:** o ponta que só sabe ir pra um lado (só corta, ou só vai por fora) é lido facilmente; o defensor "manda ele pro pé ruim".

7. **Sumir contra bloco baixo:** velocista que perde o valor quando não há espaço atrás e não tem drible em espaço curto. **Sinal:** muitos minutos sem toque na área, sem dribles completados, sem entradas no último terço.

8. **Indisciplina posicional no rodízio:** dois pontas/atacantes que ocupam a mesma faixa e se atrapalham, ou que não fazem o movimento cruzado combinado.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**IMPORTANTE: tudo abaixo é vocabulário EXPLICATIVO e gerador de hipóteses para a camada "porquê narrativo" — NUNCA edge de aposta, NUNCA dica por posição. O número do mercado/quant é a âncora e jamais se move.** (`consenso` em todo o bloco)

**Mercados/dimensões que o estudo do ponta mais ajuda a EXPLICAR:**

- **Gols:** time com **invertido finalizador** contra **linha alta** = narrativa de espaço nas costas para o velocista; já **dois pontas abertos cruzadores** contra **9 cabeceador** = narrativa de gol aéreo. Isso explica *de onde o gol tende a nascer* na história do jogo, sem prever placar.
- **Escanteios:** pontas-dribladores (Doku, Vinícius) que furam o 1v1 contra bloco baixo **geram volume de escanteio** por dribles bloqueados e cruzamentos desviados — gancho explicativo clássico para "por que esse jogo costuma ter muito escanteio".
- **Cartões:** ponta veloz/driblador que arranca em transição **sofre faltas táticas** do lateral adversário (falta para parar o contra-ataque) — gancho para narrativa de cartão no lateral marcador.
- **Assistências / props de cruzamento:** ponta **aberto** alimenta a dimensão de "cruzamentos completados/assistência por cruzamento"; ponta **invertido** alimenta "key passes"/assistência por passe entre linhas. Útil para contextualizar props de jogador.
- **Props de jogador (chutes, chutes no alvo, dribles, gols/assist):** o arquétipo prediz o PERFIL de produção — o invertido-atacante (Salah) carrega volume de chute; o condutor (Doku) carrega volume de drible; o criador (Olise/Yamal) carrega key passes. Serve para **explicar** por que o número de um mercado de jogador está onde está — nunca para dizer que está errado.
- **Jogo aéreo:** baixo (o ponta raramente é peça aérea); relevante só quando é cobrador de escanteio (in-swinger/out-swinger muda o perfil das chances aéreas do time).

**Regra de ouro para o produto:** estes ganchos servem para o assistente narrar *por que o jogo tende a ter tal textura*, ancorado no número que o mercado/quant já fixou. Se o número diz X, o ponta explica a história por trás de X — não o corrige.

---

### Segundo atacante / 9.5 (support striker; falso 9 como variação)

#### Resumo didático

**O que é, em uma frase:** o segundo atacante é o jogador de ataque que **não é o homem-gol mais avançado**, mas joga **um degrau atrás ou ao lado dele**, ligando o meio-campo ao gol. O número "9.5" é um apelido tático: ele está entre o **9** (centroavante puro, o finalizador) e o **10** (meia armador clássico). Por isso "nove e meio".

**Por que ele existe:** o futebol moderno tem um problema crônico — o espaço perto da área adversária é o mais defendido do campo. Os zagueiros marcam o centroavante, e os volantes fecham o meia. Sobra uma **terra de ninguém entre a linha de defesa e a linha de meio-campo do adversário** (o que treinadores chamam de "espaço entre linhas" ou, em inglês, *the hole* / *the pocket*). O 9.5 existe para **morar nesse buraco**: ele é avançado demais para o volante adversário querer subir e marcá-lo (deixaria a defesa exposta), e recuado demais para o zagueiro querer sair e persegui-lo (abriria a linha defensiva). Essa ambiguidade de marcação é a razão de ser da posição.

**O que ele faz, na prática (linguagem simples):** recebe a bola de costas ou de lado, **gira e encara o gol**, dá o passe decisivo para quem está na frente, e — diferente de um armador puro — também **chega para finalizar**. Pense nele como um "garçom que também faz gol". Ele divide o trabalho de criar e o de concluir.

**As três caras da mesma posição (importante o dono entender):**
- **Segundo atacante / support striker:** joga ao lado de um centroavante de referência (geralmente em esquemas com dois homens de frente). Ele é o parceiro que cai, busca a bola e finaliza as sobras.
- **9.5 / armador-finalizador:** versão que joga atrás de um único 9, num papel híbrido de meia-atacante (o "enganche" sul-americano, o *trequartista* italiano com instinto de gol).
- **Falso 9 (variação):** um centroavante **sem centroavante de verdade** — ele é nominalmente o homem mais avançado, mas **abandona a posição de pivô e recua para o meio**, arrastando o zagueiro adversário para fora e abrindo o espaço que ele mesmo deixou para outros invadirem. É uma inversão da lógica: em vez de ser o alvo, ele é a **isca**.

**Tradução para o produto (camada EXPLICAR):** quando você vê um time com um "segundo atacante" ou "falso 9", o jogo tende a ter **mais combinações curtas no meio, mais jogadores chegando à área de surpresa (não só o centroavante) e mais imprevisibilidade de quem finaliza**. Isso é vocabulário para *explicar por que um jogo se desenha de certo jeito* — nunca uma previsão de placar nem dica de aposta.

#### Perfil e arquétipos

**Atributos ideais (o que faz um bom 9.5):**

- **Físico:** não precisa ser alto nem forte como um centroavante de área. O que importa é **aceleração curta** (arrancar em 3-5 metros para escapar da marcação no buraco), **baixo centro de gravidade** (girar rápido em espaço apertado) e **resistência para repetir corridas** entre linhas o jogo todo. Muitos são de estatura média/baixa (1,70-1,80m).
- **Técnico:** **controle de bola de costas para o gol** (receber sob pressão e proteger), **giro rápido** (*turn*), **passe de ruptura** (o passe que rompe a linha — *line-breaking pass* / *through ball*), **finalização variada** (de fora da área, de primeira, em espaço curto) e **tomada de decisão sob pressão**. O atributo mais subestimado é a **scan / leitura de espaço**: o bom 9.5 olha por cima do ombro antes de receber e já sabe para onde vai girar.
- **Mental:** **inteligência posicional** (saber *quando* cair e *quando* atacar a profundidade — timing é tudo nessa posição), **fome de área** (instinto de finalizador, não só de armador) e **generosidade tática** (ele faz muito trabalho invisível: cria espaço para os outros saindo da posição).

**Sub-papéis e arquétipos — a diferença prática (o dono PRECISA distinguir):**

1. **Segundo atacante "caçador de sobras" (poacher-parceiro):** vive na área, joga das costas do centroavante, vive de rebote, cruzamento mal afastado e bola dividida. Pouco recua. Diferença prática: ele **soma jogadores na área**, não na construção. Exemplo de função: o "matador" que parceriza um pivô.

2. **Segundo atacante "móvel / inquieto" (mobile forward):** cai pelos lados, troca de posição com o parceiro, puxa marcador para criar buraco. Vive de **diagonal** e de combinação. Diferença prática: ele **bagunça a marcação** dos zagueiros porque nunca está onde foi marcado.

3. **9.5 armador (enganche / trequartista com gol):** o cérebro avançado. Recebe entre linhas, **organiza o último passe**, mas chega para finalizar. Diferença prática: ele é **o homem do último passe E do gol** — concentra criação e conclusão num jogador só. Risco: se some do jogo, o time perde as duas coisas.

4. **Falso 9 (variação extrema):** parte de 9, recua sistematicamente. Diferença prática: **não há referência fixa na área**. Ele troca presença física por superioridade numérica no meio e por movimentos de ruptura dos pontas/meias para o espaço que ele esvaziou. Exige parceiros que ataquem a profundidade (senão o ataque vira posse estéril sem ninguém na frente).

**A confusão clássica a desfazer:** "segundo atacante" e "meia ofensivo (10)" não são a mesma coisa, embora se sobreponham. O **10 puro arma e raramente finaliza**; o **9.5 arma E finaliza** e mora mais perto da área. O 10 é o pintor; o 9.5 é o pintor que também leva o quadro pra casa.

#### Os 4 momentos do jogo

**1) Organização ofensiva (com a bola, jogo posicional):** é o momento de ouro da posição. O 9.5 **ocupa o espaço entre linhas** e oferece um ponto de apoio para o time progredir por dentro. Ele recebe entre os volantes adversários, gira e ativa o ataque. Como **segundo atacante**, dá a parede para o centroavante ou cai no half-space (corredor entre o lado e o centro) para receber e enfiar. Como **falso 9**, recua para gerar **superioridade numérica no meio-campo** (3 contra 2, 4 contra 3) e desorganizar a marcação dos zagueiros. Tarefa-chave: **dar largura vertical ao ataque sem dar largura horizontal** — ou seja, manter o time compacto enquanto cria a linha de passe que rompe.

**2) Organização defensiva (sem a bola, bloco montado):** aqui mora a fragilidade clássica do arquétipo. O 9.5 costuma ser um **defensor fraco/seletivo**. Suas tarefas reais: **marcar o relógio de pressão** (sombrear linhas de passe para o volante adversário junto do centroavante), fechar o lado de dentro e **não correr atrás da bola à toa** (preservar energia para a transição). Num bloco baixo, ele é o jogador **mais adiantado da segunda onda de pressão** ou simplesmente fica "guardado" lá na frente como saída de contra-ataque. Treinador de elite cobra dele: orientação corporal certa (curvar a corrida pra forçar o adversário pro lado fraco), não a quantidade de desarmes.

**3) Transição ofensiva (acabou de recuperar — o contra-ataque):** **aqui o 9.5 é ouro puro**. No instante da recuperação, ele é frequentemente o jogador **já posicionado entre linhas, de frente para o gol**, e vira o pivô do contra-ataque: segura a bola sob pressão até os companheiros chegarem, ou dá o passe imediato para o centroavante/ponta atacar a profundidade. A combinação 9.5 + centroavante veloz em transição é uma das mais letais do futebol.

**4) Transição defensiva (acabou de perder — contrapressing):** o **dilema** da posição. Em times de pressão pós-perda (Guardiola, Klopp), espera-se que ele faça o **contrapressing imediato** (recuperar nos 5 segundos seguintes à perda). Mas como ele costuma estar adiantado e cansado de criar, muitos 9.5 são o **elo fraco do contrapressing** — adversário escapa pelo lado dele. Treinador resolve isso de duas formas: ou dá a ele um parceiro que cobre (volante box-to-box), ou aceita que ele "descansa na frente" e arma o bloco atrás dele. É a troca clássica: criatividade vs. esforço defensivo.

#### Zonas ocupadas e gaps deixados

**Corredores e zonas que ocupa:**
- **Zona 14 / o "buraco":** a área logo à frente da grande área adversária, no centro, entre a linha de defesa e a de meio-campo. É o endereço-padrão do 9.5. Estatisticamente, é a zona de onde nascem mais assistências de jogada elaborada.
- **Meios-espaços (half-spaces):** os dois corredores entre o centro e as laterais. O 9.5 móvel vive caindo neles para receber de lado, encarar a linha e enfiar a bola na diagonal. É de longe a zona preferida do arquétipo moderno.
- **Costas da linha (em transição):** quando ataca a profundidade, atrás dos zagueiros.

**Que espaço ele ABRE para os outros (o valor invisível):**
- Quando o 9.5 **recua para o buraco**, ele puxa o zagueiro ou o volante adversário junto. Isso abre **espaço nas costas da defesa** para um ponta cortar por dentro ou um meia chegar de segunda linha. O falso 9 leva isso ao extremo: o zagueiro que o segue deixa um **rombo no centro da defesa**.
- Quando cai no meio-espaço, **fixa o lateral ou o volante** e libera o corredor lateral para o lateral/ala do seu próprio time subir.

**Que espaço ele DEIXA EXPOSTO (o custo):**
- **Defensivamente**, a zona que ele deveria pressionar (à frente do volante adversário, ou o corredor de transição quando o time perde a bola) fica desguarnecida. O adversário sai jogando justamente pelo lado/centro que o 9.5 "abandona".
- Em times com **falso 9**, a **referência na área some**: cruzamento não acha alvo, e a equipe pode ter muita posse sem ninguém na frente para concluir.

**Como o adversário explora a ausência dele:**
- Um treinador adversário inteligente **deixa o falso 9 recuar livre** (não o segue) e aceita jogar 4 contra 3 atrás, sabendo que sem referência o ataque perde mordida na área. Foi assim que se aprendeu a neutralizar o falso 9: **não morder a isca**.
- Contra um 9.5 que não pressiona, o adversário **constrói a saída pelo lado dele**, ganhando tempo e progressão de graça.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo:** geralmente **baixíssima prioridade**. O 9.5 raramente é alto e quase nunca volta para defender escanteios na própria área — costuma ficar **adiantado como saída** (o "vaga-lume" que espera a bola para o contra-ataque após o escanteio ser afastado). Em alguns esquemas, ele fica na intermediária para **disputar a segunda bola** (a sobra do escanteio afastado) — função importante e subvalorizada: ganhar a segunda bola mantém a posse e evita o contra-ataque adversário.

**Jogo aéreo ofensivo:** raramente é alvo primário de cruzamento (não tem porte). Seu papel aéreo ofensivo é **chegar de segunda onda** — atacar a sobra do cruzamento, o rebote do goleiro, a bola que pinga na pequena área. O arquétipo "caçador de sobras" é especialmente perigoso aqui: muitos gols dele nascem de bola mal afastada na área.

**Bola parada (escanteio/falta):**
- **Escanteio ofensivo:** costuma ser **batedor** (se tiver bom pé) ou ficar na **borda da área para a segunda bola / chute de fora** — papel tático real, pois recuperar a sobra na entrada da área é o que sustenta a pressão.
- **Falta lateral/frontal:** com bom pé, vira **batedor** (o 9.5 armador frequentemente é o melhor pé do ataque). Sem isso, busca o movimento de quebra na área.
- **Pênalti:** frequentemente é um dos **cobradores designados**, sobretudo o arquétipo finalizador, por ter frieza e técnica de finalização.
- **Lateral:** raramente arremessa; oferece-se para a tabela curta perto da linha.

**Gancho para EXPLICAR:** times que usam falso 9 / 9.5 tendem a ter **menos ameaça aérea ofensiva direta** e mais perigo de **segunda bola e chute de fora** — isso ajuda a narrar por que certos jogos têm padrões de finalização específicos. (Sempre explicativo, nunca preditivo.)

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Altura da linha defensiva (do próprio time):** o 9.5 funciona melhor quando o **time joga com a linha alta e compacta**, porque isso comprime o campo e gera o "buraco" curto entre linhas onde ele opera com poucos metros para os companheiros. Com linha baixa (bloco recuado), o 9.5 fica **isolado e longe do apoio** — recebe de costas a 50 metros do gol, sem ninguém perto, e o time perde sua melhor qualidade. Por isso, esquemas de posse e pressão alta valorizam o arquétipo; blocos baixos reativos tendem a apagá-lo (a não ser que ele vire o ponto de apoio do contra-ataque).

**Espaço entre linhas (o oxigênio da posição):** é literalmente o habitat. Quanto **maior a distância entre a defesa e o meio-campo adversário**, mais o 9.5 brilha — ele encontra o buraco para receber virado. Treinadores adversários combatem isso **encurtando o espaço entre linhas** (defesa e meio juntos, bloco compacto) ou marcando-o **por referência** (um volante "cola" nele). Quando o adversário fecha bem esse espaço, o 9.5 precisa **cair mais (virar quase um 8/10)** ou **atacar a profundidade** para forçar a linha a recuar e reabrir o buraco — a alternância entre "vir e ir" (cair para receber vs. romper nas costas) é a habilidade que separa o 9.5 de elite do mediano.

**Pressing / contrapressing (PPDA):** *PPDA = passes permitidos por ação defensiva — quanto menor, mais intenso o pressing do time.* O 9.5 num time de PPDA baixo (pressão alta) é **gatilho ou cobertura** do pressing, mas costuma ser o **vazamento** se não for disciplinado. Em contrapressing, ele deve **fechar a linha de passe central** imediatamente após a perda. A leitura honesta: a maioria dos grandes 9.5 dá ao time **muito na criação e pouco na pressão** — daí a necessidade de um sistema que cubra suas costas.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**Habitat clássico e mais valorizado.** No 4-4-2 tradicional, a dupla de frente quase sempre é assimétrica: um centroavante de referência (o 9, alvo, segura a bola) e um **segundo atacante (o 9.5)** que joga ao lado/atrás dele. Tarefas: **cair para criar a parede com o 9**, buscar a bola entre as linhas (já que o 4-4-2 deixa o famoso espaço à frente da dupla de volantes adversária), atacar as sobras e finalizar. Liberdade: alta no terço final, baixa fora dele. Riscos: o 4-4-2 com duas linhas de 4 já tem **falta de homem no meio** (2 vs 3 contra meios de 3) — se o 9.5 não cair para ajudar a construir, o time fica partido. Conexão-chave: a **parceria com o centroavante** é a alma do esquema (um vem, o outro vai; um fixa, o outro recebe). **A formação valoriza muito a posição** — é o lar natural do segundo atacante.

**4-4-2 em losango (diamante)**

O losango tem um **10 fixo na ponta do diamante**, e a frente também é uma dupla. Aqui o papel do segundo atacante muda: ele tem **um armador atrás dele**, então sua função criativa diminui e a de **finalizador/móvel aumenta**. Tarefas: combinar com o 10, atacar a profundidade que o 10 enxerga, e cair pelos lados para compensar a **ausência de pontas** (o losango não tem extremos, então a largura ofensiva vem dos laterais e dos movimentos da dupla de frente para fora). Riscos: o losango é estreito; se os dois atacantes ficarem fixos no centro, o ataque fica previsível. Conexão-chave: **trio 10 + dois atacantes** no centro, com os laterais dando a largura. A formação valoriza a posição, mas **rouba dela parte da função de armar** (que vai pro 10) e exige mais movimento de amplitude.

**4-3-3**

No 4-3-3 com **centroavante único**, não existe um 'segundo atacante' nominal — mas a posição reaparece de duas formas. **(a) Falso 9:** o centroavante do 4-3-3 recua e vira falso 9, transformando o esquema num **2-3-5 / 3-2-5 com homem no buraco**; é o uso clássico (Messi sob Guardiola). **(b) Ponta invertido caindo no meio-espaço:** um dos extremos funciona como 9.5 deslocado, jogando entre linhas no half-space. Tarefas do falso 9 aqui: recuar para criar 3v2/4v3 no meio e abrir as costas da defesa para os **pontas cortarem por dentro**. Riscos: sem referência na área, o cruzamento dos laterais perde alvo. Conexão-chave: **falso 9 + dois pontas que atacam a profundidade** — sem essa corrida nas costas, o esquema vira posse estéril. A formação **não pede** um segundo atacante, mas **abriga** o falso 9 como variação sofisticada.

**4-2-3-1**

Esquema do **único centroavante com um 10 atrás** — e o '10' do 4-2-3-1 é, na prática, frequentemente um **9.5 disfarçado**. Quando o homem da faixa central de 3 é mais finalizador que armador, ele joga colado ao 9 como **segundo atacante avançado**, atacando a área junto e formando uma dupla de fato. Tarefas: receber entre linhas (protegido pelos dois volantes atrás dele), girar e enfiar, e **chegar como segundo homem na área**. A dupla de volantes (o duplo pivô) é justamente o que **libera o 9.5 das obrigações defensivas**, deixando-o focar em criar/finalizar. Riscos: se ele não pressiona, o duplo pivô fica exposto a 2v2 contra meios adversários. Conexão-chave: **9.5 (o '10') + centroavante + duplo pivô que cobre**. A formação **valoriza muito** o arquétipo — é talvez o lar mais comum do 9.5 no futebol moderno.

**4-1-4-1**

Esquema **mais defensivo e equilibrado**, com um volante de contenção (o '1') e uma linha de 4 meias à frente dele, atrás de um único 9. Aqui o segundo atacante quase **desaparece como função pura**: os dois meias internos da linha de 4 podem **se revezar subindo para o buraco** como meio-9.5, mas nenhum vive lá. Tarefas possíveis: um meia interno faz **chegadas tardias** (late runs) à área para virar segundo atacante momentâneo, surpreendendo a marcação. Riscos: como ninguém ocupa o buraco fixamente, o time depende do timing dessas chegadas — se falham, o 9 fica isolado. Conexão-chave: **meia interno que rompe + centroavante que segura**. A formação tende a **apagar** o segundo atacante como posição dedicada, transformando-o numa função intermitente de chegada.

**3-5-2 / 3-4-1-2**

**Outro lar de elite da dupla de ataque.** Com três zagueiros e alas dando toda a largura, o 3-5-2 **liberta a dupla de frente para jogar junta e por dentro** — condição ideal para a parceria 9 + 9.5. No **3-4-1-2** há ainda um armador (o '1') atrás da dupla, então o segundo atacante vira mais finalizador (como no losango). Tarefas: o 9.5 cai no buraco que os três volantes ajudam a criar, combina em espaço curto com o parceiro, e ataca as sobras; os **alas entregam a largura** que a dupla não precisa cobrir. Riscos: dependência total dos alas para amplitude; se eles não sobem, o ataque sufoca no centro. Conexão-chave: **dupla de frente entrosada + alas largos + (no 3-4-1-2) o armador**. A formação **valoriza muito** a posição — é onde o segundo atacante mais joga 'solto'.

**3-4-3 / 3-4-2-1**

Depende da variante. No **3-4-3 com três atacantes em linha**, não há segundo atacante clássico — mas no **3-4-2-1**, os **dois '2' atrás do 9** são exatamente um par de 9.5 / meias-atacantes que jogam nos **meios-espaços** entre a defesa e o meio adversário. Esse é um dos usos mais modernos e potentes do arquétipo: dois homens no buraco, um em cada half-space, ligando construção e finalização e atacando a área em ondas. Tarefas: receber no meio-espaço virado, combinar com o 9 e com o ala do seu lado, e **invadir a área** quando o jogo vai pro lado oposto. Riscos: exige alas muito disciplinados defensivamente, pois os dois 9.5 dão pouca cobertura. Conexão-chave: **dupla de 9.5 nos half-spaces + 9 de referência + alas**. O **3-4-2-1 valoriza intensamente** a posição (em dobro); o 3-4-3 puro a dilui.

**5-3-2 / 5-4-1 (bloco de 5)**

Esquemas **reativos / defensivos**. No **5-3-2**, ainda há uma **dupla de frente**, então o segundo atacante sobrevive — mas seu trabalho muda de natureza: ele vive mais de **transição ofensiva (contra-ataque)** do que de criação posicional, já que o time passa muito tempo sem a bola num bloco baixo. Tarefa central: ser o **ponto de apoio do contra-ataque** — segurar a bola na saída, esperar o parceiro e os meias chegarem. No **5-4-1**, há **só um atacante**, e o segundo atacante **desaparece** (vira, no máximo, um meia da linha de 4 que sobe em transição). Riscos: isolamento; com o time recuado, recebe longe do gol e sem apoio. Conexão-chave: **dupla em transição (no 5-3-2)** / função extinta (no 5-4-1). O 5-3-2 **mantém** a posição mas a converte em jogador de transição; o 5-4-1 a **apaga**.

**4-3-1-2 (sem pontas)**

Variante do diamante/estreito com **um armador (o '1') atrás de uma dupla de frente e sem extremos**. Aqui o segundo atacante é peça central e tem espaço para brilhar **por dentro**, já que não há pontas competindo pelo eixo. Como há um 10 atrás, ele assume o lado **finalizador/móvel** da função: ataca a profundidade que o armador enxerga, cai pelos lados para suprir a **falta de largura** (a grande fragilidade desse esquema), e combina em triângulos curtos no centro. Riscos: sem pontas, o ataque é estreitíssimo e **previsível pelo meio** se a dupla não se movimentar para fora; depende muito dos laterais subirem. Conexão-chave: **10 + dupla de frente + laterais para a amplitude**. A formação **valoriza** a posição, mas **exige dela mobilidade lateral** para compensar a ausência de extremos.

#### Parcerias-chave

**Com o centroavante (a parceria-mãe):** é a relação definidora. O modelo clássico é a **dupla complementar**: um centroavante "alvo/pivô" que fixa os zagueiros e segura a bola de costas + o 9.5 que **vive das migalhas** desse pivô (parede, sobra, segunda bola). Ou o inverso: um 9 veloz que ataca a profundidade + um 9.5 que **arma e enfia para ele**. A regra de ouro entre os dois é **'um vem, o outro vai'**: nunca os dois caem juntos (somem da área), nunca os dois ficam fixos (matam a criação). A alternância de movimentos é o coração da dupla.

**Com o meia armador (10):** quando coexistem (4-2-3-1 com 10 criativo, losango, 3-4-1-2), há **divisão de trabalho criativo**: o 10 faz o penúltimo passe, o 9.5 faz o último ou finaliza. Risco de **canibalização**: se ambos querem morar no buraco, atrapalham-se. Bons sistemas escalonam — um mais recuado, outro mais perto da área.

**Com os volantes / duplo pivô:** relação de **dependência defensiva**. O 9.5 só pode 'descansar na frente' e focar em criar porque há volantes cobrindo suas costas. O **volante box-to-box** que acompanha as chegadas é o melhor amigo do 9.5 — chega como segundo homem quando o 9.5 puxa a marcação.

**Com os pontas / extremos invertidos:** quando o 9.5 (ou falso 9) recua e abre as costas da defesa, é o **ponta cortando por dentro** quem ataca esse espaço esvaziado. Relação de troca de posição: o 9.5 sai do centro, o ponta entra. Sincronia de timing é tudo.

**Com os laterais / alas:** em esquemas estreitos (losango, 4-3-1-2), o 9.5 **depende dos laterais para a largura** que ele não dá. Ele fixa o adversário por dentro e o lateral explora o corredor livre por fora.

#### Exemplos de elite

**Aviso de confiança:** os exemplos abaixo são `consenso` tático (reputação de papel/estilo dos jogadores). Não verifiquei estatísticas específicas via fetch nesta sessão; trate números e clubes pontuais como `inferencia` e confirme se forem usados como fato no produto.

**Segundo atacante / parceiro de dupla (histórico e referência):**
- **Sergio Agüero** — arquétipo do segundo atacante móvel que vira finalizador letal; caía para combinar e aparecia na área.
- **Carlos Tévez** — o "guerreiro" 9.5: cria, finaliza, pressiona e briga; raro por unir esforço defensivo a instinto de gol.
- **Wayne Rooney** — talvez o exemplo mais completo do arquétipo: jogou de 9, de 9.5, de 10 e de falso 9 na mesma carreira.
- **Dennis Bergkamp** — o segundo atacante "artista", mestre do controle de costas, giro e último passe.

**9.5 armador-finalizador (enganche / trequartista com gol):**
- **Roberto Firmino** — o **falso 9 funcional** de elite no Liverpool: pouco gol relativo, mas recuava, criava 3v2 e abria espaço para Salah/Mané atacarem as costas. Caso-escola do falso 9 como "isca".
- **Lionel Messi** — o **falso 9 que redefiniu a função** (Barcelona de Guardiola): recuava do 9 ao buraco, atraía o zagueiro e destruía a linha. Também o 9.5 criador-finalizador supremo.
- **Paulo Dybala** — 9.5 clássico moderno: cai no meio-espaço, gira e finaliza/assiste.

**Atuais (2023-2026) — `inferencia`, confirmar via fetch se citado como fato:**
- **Lautaro Martínez** (Inter, 3-5-2) — segundo atacante/finalizador móvel num sistema de dupla, referência atual do arquétipo em esquema de três zagueiros.
- **João Pedro / Raphael Veiga-tipo / Julián Álvarez** — Álvarez em especial é exemplo contemporâneo do 9.5 que tanto faz de falso 9/segundo atacante quanto de 9, com altíssima mobilidade e contribuição em construção.
- **Antoine Griezmann** (Atlético) — evoluiu para um 9.5 / falso 9 recuado de elite, ligando linhas e finalizando.

**Histórico fundacional:**
- **Roberto Baggio, Francesco Totti, Alessandro Del Piero** — a tradição italiana do *trequartista*/seconda punta, raiz conceitual do 9.5.
- **Romário e Bebeto (Copa 94)** — dupla brasileira clássica de 9 + segundo atacante complementar.

#### Erros comuns / como falha

**Como a posição falha (sinais de mau desempenho):**

1. **Sumir do jogo / 'jogo invisível':** o pior pecado do 9.5. Quando o espaço entre linhas é fechado e ele **não sabe alternar** (cair mais OU romper nas costas), some — não recebe, não cria, não finaliza. O time fica jogando 10 contra 11 na fase ofensiva. Sinal: poucos toques, recepções todas de costas longe do gol.

2. **Canibalizar o centroavante:** quando o 9.5 **fica fixo na área junto do 9** (ou os dois caem juntos), eles **se anulam** — disputam o mesmo espaço e tiram a referência. Sinal: a dupla nunca está escalonada; ambos somem ao mesmo tempo.

3. **Buraco negro defensivo:** o erro mais cobrado por treinador. O 9.5 que **não pressiona, não fecha a linha central e não faz o contrapressing** entrega a saída do adversário de graça. O time vira 9 contra 11 na fase defensiva. Sinal: o adversário constrói sistematicamente pelo lado dele; PPDA do time piora.

4. **Falso 9 sem corrida nas costas:** quando o falso 9 recua mas **ninguém ataca o espaço que ele abriu**, a equipe tem posse bonita e estéril, sem ninguém na frente. Sinal: muita posse no meio, zero presença na área, cruzamentos sem alvo.

5. **Timing errado de movimento:** cair quando devia romper (deixa o time sem profundidade) ou romper quando devia cair (perde a ligação). O 9.5 medíocre é **previsível** no movimento; o de elite é imprevisível.

6. **Egoísmo na finalização:** o arquétipo finalizador que **chuta tudo** em vez de dar o último passe melhor posicionado — converte uma função de ligação numa de desperdício.

**O que um treinador de elite cobra dele:** orientação corporal na recepção (receber já virado), timing dos movimentos (vir/ir), disciplina no gatilho de pressão (não a quantidade de desarmes), e **generosidade tática** — entender que sair da posição para criar espaço aos outros é trabalho, mesmo sem aparecer na súmula.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**Sempre explicativo-não-preditivo: ancora o porquê narrativo, nunca move o número do mercado nem vira edge.**

- **Gols / quem finaliza:** a presença de um 9.5/segundo atacante **distribui a ameaça de gol** para além do centroavante — mais finalizadores diferentes, gols de segunda onda e de fora da área. Ajuda a explicar por que um time marca de formas variadas (não só via 9). Com **falso 9**, o oposto: ameaça de gol mais difusa e **menos via centroavante puro**. Útil para narrar o *padrão* de finalização — nunca para prever volume.

- **Assistências / criação:** o 9.5 concentra **último passe E gol** num jogador; é o nó onde a criação do time passa. Bom gancho para explicar de onde nasce o perigo de um time (por dentro, pela zona 14).

- **Props de jogador (explicativo):** o arquétipo informa *que tipo* de contribuição esperar de um jogador específico — finalizador (chutes, gols) vs. armador (passes-chave) vs. falso 9 (toques, passes, menos finalizações). Serve para **contextualizar** uma linha de prop, jamais para afirmar valor sobre ela.

- **Escanteios / segunda bola:** times com 9.5/falso 9 tendem a ter **menos ameaça aérea ofensiva direta** e mais perigo de **segunda bola e chute de fora** — gancho para explicar perfis de finalização e pressão sustentada, não para prever contagem.

- **Cartões:** o arquétipo "guerreiro" (Tévez-tipo) que pressiona e briga pode **explicar** propensão a faltas/cartões de um jogador específico; o arquétipo artista (Bergkamp-tipo), o contrário. Estritamente contextual.

- **Jogo aéreo:** geralmente **baixo** para esse perfil — gancho para explicar por que a ameaça aérea de um ataque é menor do que o número de gols sugeriria.

**Selo obrigatório de uso no produto:** todos esses ganchos são **vocabulário para a camada EXPLICAR (o 'porquê' do jogo)**. O número do mercado/quant é a âncora e **não se move**; o papel da posição apenas ilumina a narrativa por trás dele.

---

### Centroavante (9) — homem-alvo / target man, finalizador / poacher, falso 9, atacante completo, pressionador

#### Resumo didático

**O que é, em uma frase:** o centroavante (camisa 9, ou "9") é o jogador mais avançado do time, o que fica mais perto do gol adversário e cuja função-mãe é **fazer e/ou gerar gols**. Tudo o que ele faz — correr, segurar a bola, brigar com o zagueiro, recuar — existe em função de colocar a bola na rede do outro time, seja com o pé dele ou criando a chance para um companheiro.

**Por que a posição existe:** num campo de futebol, o espaço mais valioso e mais disputado é a área adversária (o retângulo grande na frente do gol). O 9 é o time inteiro "esticado" para dentro desse espaço. Ele cumpre três utilidades que ninguém mais cumpre tão bem:
1. **Finalizar** — estar no lugar certo na hora certa para converter o trabalho dos outros em gol (o gesto técnico mais difícil e mais raro do futebol é fazer gol; por isso bons 9 valem fortunas).
2. **Fixar os zagueiros** — só pela presença dele perto do gol, ele "prende" um ou dois defensores adversários, que não podem sair para ajudar em outro lugar. Isso abre espaço para os companheiros mesmo quando ele não toca na bola.
3. **Ser a referência ofensiva** — quando o time está sob pressão e precisa aliviar, chuta a bola longa "no 9"; quando o time ataca, é o ponto de chegada das jogadas.

**Analogia simples:** pense no 9 como o "ponto final" de uma frase que o time inteiro escreve. Lateral, meia e ponta são as palavras; o 9 é o ponto que dá sentido a tudo — sem ele, a jogada "não fecha". Mas existem 9 de tipos muito diferentes: uns são "brutamontes" que recebem a bola de costas e seguram a marcação (homem-alvo); uns são "oportunistas" que quase não tocam na bola mas aparecem do nada na pequena área (finalizador/poacher); uns recuam e "somem" do gol para confundir a defesa (falso 9); e os melhores fazem um pouco de tudo (atacante completo).

**Jargão definido na primeira aparição:**
- **De costas para o gol / receber de costas:** o atacante recebe a bola com o corpo voltado para o próprio campo, de frente para o zagueiro que está atrás dele. É a situação mais comum e mais difícil para o 9.
- **Pivô / segurar a bola (hold-up play):** receber a bola, aguentar o empurrão do marcador e segurá-la até os companheiros chegarem para apoiar. "Fazer pivô" = servir de ponto de apoio.
- **Movimento de profundidade / ataque ao espaço:** correr para trás da linha de defesa, em direção ao gol, buscando a bola lançada no espaço vazio.
- **Pequena área / segundo poste:** a pequena área é o retângulo menor coladinho no gol; o "segundo poste" é o lado do gol mais distante de onde a bola vem (onde poacher e cabeceadores aparecem).

#### Perfil e arquétipos

**Atributos por dimensão (o "ideal" não existe — cada arquétipo prioriza atributos diferentes):**

*Físicos:* força e equilíbrio de corpo (para segurar zagueiro), explosão/velocidade (para atacar profundidade), impulsão e timing de salto (jogo aéreo), resistência (para pressionar 90 minutos). Altura ajuda no jogo aéreo mas não é obrigatória.

*Técnicos:* finalização (com os dois pés e de cabeça), controle de bola sob pressão e de costas, primeiro toque para amortecer lançamento, passe de tabela (one-touch), cabeceio.

*Mentais:* **timing de movimentação** (saber QUANDO arrancar — o atributo mais subestimado e o que separa elite de bom), leitura do passe do zagueiro/goleiro, frieza na finalização (sangue-frio diante do gol), inteligência espacial para se posicionar, resiliência (o 9 erra muito mais do que acerta).

---

**OS SEIS ARQUÉTIPOS (diferença prática entre eles):**

**1. Homem-alvo / Target man (`consenso`)**
Forte, geralmente alto, recebe de costas e faz pivô. Existe para **segurar a bola** quando ela chega longa e dar tempo do time subir, e para **dominar a bola parada/aérea**. Diferença prática: ele NÃO precisa ser rápido nem driblador; precisa ser uma "parede" que não perde a bola e ganha duelos. Exemplos de função: descer de cabeça para o meia, proteger a bola na lateral para o time respirar.
*Variação moderna:* o target man "completo" (Kane, Lewandowski) que além de segurar, finaliza de elite e dá assistência.

**2. Finalizador / Poacher / Caçador de área (`consenso`)**
Vive dentro da área. Toca pouquíssimo na bola fora dali (às vezes 15-20 toques no jogo inteiro) mas é letal nos 2-3 toques que importam. Diferença prática: o valor dele é quase invisível na narrativa do jogo até a bola entrar. Especialista em desmarques curtos, antecipar o zagueiro, achar o segundo poste. Não faz pivô, não pressiona muito, não cria — só converte. Inzaghi histórico é o protótipo; **Viktor Gyökeres** (`verificado-fetch`) é descrito como letal na área porém limitado contra blocos baixos e no jogo aéreo — perfil de finalizador mais que completo.

**3. Falso 9 (False nine) (`consenso`)**
Não é um 9 tradicional: ele **recua** para o meio-campo, sai da última linha e "desaparece" do gol de propósito. Cria um **dilema para o zagueiro**: se segue o falso 9 para fora, abre buraco nas costas para pontas/meias atacarem; se não segue, o falso 9 recebe livre entre as linhas e vira um camisa 10. Diferença prática: prioriza passe, associação e inteligência sobre força e finalização. Messi no Barça de Guardiola é o caso histórico-canônico; **Ousmane Dembélé** (`verificado-fetch`) se reinventou como falso 9 e ganhou a Bola de Ouro 2025.

**4. Atacante completo / Complete forward (`consenso`)**
Faz tudo razoavelmente bem ou mais: segura, finaliza, ataca profundidade, associa, cabeceia, cria. É o arquétipo mais raro e caro. Diferença prática: o treinador pode pedir QUALQUER coisa dele e a defesa adversária nunca sabe o que esperar. **Harry Kane** (`verificado-fetch`: 31 gols em 26 jogos em 2026 pelo Bayern, único nas big-5 com média acima de gol por jogo no ano-calendário) e **Robert Lewandowski** (`verificado-fetch`: descrito como "centroavante quase completo") são os protótipos modernos.

**5. Pressionador / Pressing forward (`consenso`)**
O 9 como **primeira linha de defesa**. Dispara o pressing, encurrala o zagueiro/goleiro adversário, fecha linhas de passe com a sombra (cobertura por sombra — "tampar" o passe ao volante usando o próprio corpo). Diferença prática: parte do valor dele está SEM a bola; gasta energia enorme. Indispensável em times de pressing alto (Klopp, Bielsa). Roberto Firmino no Liverpool de Klopp é o caso canônico — um 9 cuja função era mais pressionar e associar do que fazer gol.

**6. Atacante de profundidade / Velocista (`consenso`)** — sub-arquétipo de transição
Vive do ataque ao espaço nas costas da defesa; mortal em campo aberto e contra-ataque, menos útil contra bloco baixo (sem espaço para correr). **Erling Haaland** (`verificado-fetch`: 27 gols/8 assists em 2025-26, 3º Chuteira de Ouro em 4 tentativas) combina profundidade brutal + finalização de poacher de elite. **Kylian Mbappé** (`verificado-fetch`: artilheiro da Champions 2025-26 com 15 gols) é descrito como um 9 atípico que não segura a bola, joga como se ainda fosse ponta.

#### Os 4 momentos do jogo

**1. Organização ofensiva (time com a bola, posicionado) (`consenso`)**
A tarefa do 9 muda conforme o arquétipo:
- *Fixar a última linha:* ficar no ombro do último zagueiro, "preso" entre os dois centrais, para impedir que a linha defensiva suba e roube espaço do time. Mesmo parado, ele ocupa dois marcadores.
- *Oferecer o pivô:* mostrar-se para receber de costas e segurar (target man), descarregando para meias/pontas.
- *Recuar para criar superioridade (falso 9):* sair da linha para virar +1 no meio-campo e puxar um central para fora.
- *Movimentos de desmarque dentro da área:* atacar primeiro poste, fingir e ir ao segundo, parar e "esconder-se" atrás do zagueiro para reaparecer (movimento de poacher).
- *Coordenar o "blind-side run":* arrancar pelo lado cego do zagueiro (onde ele não consegue ver a bola e o atacante ao mesmo tempo).

**2. Organização defensiva (time sem a bola, posicionado) (`consenso`)**
- *Primeira linha de pressão ou de contenção:* dependendo do plano, o 9 ou pressiona os zagueiros adversários (bloco alto) ou apenas "fecha" a saída de bola pelo meio com cobertura de sombra, empurrando o adversário para os lados (bloco médio/baixo). 
- *Marcar o volante/primeiro construtor:* muitos esquemas pedem que o 9 "esconda" o volante adversário com o corpo, obrigando os zagueiros a jogarem entre si sem progredir.
- *Em bloco baixo (time pequeno):* o 9 vira quase um "espantalho" — fica adiantado como ponto de referência para o alívio, gastando pouca energia defensiva para guardar pernas para o contra-ataque.

**3. Transição ofensiva (acabou de recuperar a bola) (`consenso`)**
O momento de ouro do 9. Tarefas:
- *Atacar profundidade imediatamente:* virar-se e correr para as costas da defesa adversária, que está desorganizada (target/velocista).
- *Ser o ponto de retenção:* receber de costas e segurar para o time se lançar ao ataque com apoio (pivô de transição).
- *Liderar o contra-ataque:* em times de transição rápida (Mbappé, Haaland), o 9 é o destino do passe vertical de 1-2 toques. Aqui o atacante de profundidade vale ouro e o falso 9 vale menos.

**4. Transição defensiva (acabou de perder a bola) (`consenso`)**
- *Contrapressing imediato (Gegenpressing):* o pressionador parte para cima de quem recuperou a bola, tentando recuperá-la nos primeiros 5-6 segundos antes que o adversário organize o contra-ataque. Firminos do mundo brilham aqui.
- *Atrasar/cobrir:* se não consegue pressionar, o 9 recua alguns metros para tampar uma linha de passe e dar tempo ao time se reorganizar.
- *Poacher puro tende a ser passageiro neste momento* — economiza energia — o que é uma fraqueza tática que o adversário pode explorar saindo justamente por aquele lado.

#### Zonas ocupadas e gaps deixados

**Corredores e zonas que ocupa (`consenso`):**
O território natural do 9 é o **corredor central, na altura da última linha adversária** — especificamente a "zona 9" (o quadrante central da grande área e a entrada da área, em frente ao gol). É a zona mais defendida do campo, então o 9 raramente fica sozinho ali.

**Zona 14 (a meia-lua na entrada da área):** o ponto onde o falso 9 e o atacante completo recuam para receber — a zona mais perigosa de criação do campo. Quando o 9 a ocupa, ele descola um central da linha.

**Largura/canais (half-spaces):** os "meio-espaços" (corredores entre o centro e a lateral, onde meias e pontas invertidos operam). Bons 9 desviam para o meio-espaço para receber em diagonal e arrastar o zagueiro, abrindo o miolo para um companheiro infiltrar — esse é um movimento típico de troca de posição.

**Que espaço ele ABRE quando se movimenta (`consenso`):**
- Quando o 9 **fixa os dois zagueiros**, abre o espaço **entre as linhas** (entrelinhas) para o meia/10 receber, e o espaço **nas costas dos laterais** para as pontas.
- Quando o 9 **recua** (falso 9), abre o **espaço nas costas da defesa** — o buraco que ele deixou — para pontas e meias atacarem em diagonal por dentro.
- Quando o 9 **arrasta para um lado**, abre o lado oposto para o ponto distante chegar (overload to isolate).

**Que espaço ele DEIXA EXPOSTO / como o adversário explora a ausência (`consenso`):**
- *Se o 9 é poacher e não pressiona/recompõe:* o adversário sai jogando livre pelo setor dele, ganhando superioridade no meio-campo (o time joga "10 contra 11" defensivamente).
- *Se o 9 recua demais (falso 9 mal executado):* o time fica **sem referência na área** e os cruzamentos não encontram alvo; ataques pelas pontas morrem sem finalizador.
- *Se o 9 fica isolado lá na frente (bloco baixo passivo):* o time perde conexão entre meio e ataque — surge o "buraco" entre o meio-campo e o atacante, e o 9 recebe bolas impossíveis de segurar, perdendo posse e convidando o contra-ataque adversário.
- *Ausência de movimento de profundidade:* se o 9 não ameaça as costas, a linha defensiva adversária pode subir tranquila e comprimir o time todo num espaço pequeno, sufocando a criação.

#### Jogo aéreo e bola parada

**Jogo aéreo defensivo (`consenso`):**
O 9 costuma ser o jogador mais adiantado em escanteios e faltas defensivas, e por isso tem duas funções:
- *Ponto de saída / "outlet":* fica perto do círculo central ou na entrada da área para receber o alívio e segurar a bola, iniciando o contra-ataque (por isso times mantêm o 9 lá em cima mesmo defendendo escanteio).
- *Marcar o primeiro poste ou o jogador de saída curta* em escanteios — função defensiva mínima mas existente.
Um 9 grande e forte às vezes é "sacrificado" defendendo a primeira trave em escanteios pela sua estatura.

**Jogo aéreo ofensivo (`consenso`):**
Aqui o 9 (sobretudo o target man) é protagonista. Em escanteios e faltas laterais é o principal alvo do cruzamento. Atributos decisivos: timing de salto, força para se desvencilhar da marcação, capacidade de "atacar a bola" (ir nela em movimento, não esperar). Arquétipos:
- *Cabeceador de área (target man):* ataca o primeiro ou segundo poste; vale como arma direta.
- *Bloqueador/"screener":* faz o **bloqueio (pick/block)** para liberar um companheiro cabecear, sacrificando-se sem tocar na bola.
- *Finalizador de rebote (poacher):* não disputa o alto, fica "rondando" a pequena área para a sobra/rebote — o gol "feio" que vale três pontos.

**Bola parada — papéis específicos (`consenso`):**
- *Escanteio ofensivo:* alvo principal de cabeceio (target/completo) OU rondador de rebote (poacher) OU bloqueador.
- *Falta lateral:* mesmo papel do escanteio.
- *Pênalti:* o 9 é frequentemente o **batedor designado** — frieza e técnica de finalização são o core da posição (Kane, Lewandowski, Haaland batem os pênaltis de seus times, o que infla muito a contagem de gols deles — fato relevante para entender por que esses 9 têm números tão altos).
- *Falta direta:* raramente; só se o 9 tiver chute de bola parada (não é típico da posição).
- *Lateral longo (arremesso):* o target man pode ser alvo do arremesso longo como se fosse um escanteio em times diretos.

#### Relação com as linhas (altura, espaço entre linhas, pressing)

**Relação com a altura da linha defensiva ADVERSÁRIA (`consenso`):**
Essa é a relação mais importante do 9. Existe um duelo permanente entre o 9 e os zagueiros sobre **onde a linha de defesa vai ficar**:
- Se a linha adversária está **alta** (subida), há espaço nas costas → o 9 de profundidade/velocista (Haaland, Mbappé) prospera, atacando o espaço vazio com lançamentos. A linha alta é o "prato cheio" desse arquétipo.
- Se a linha está **baixa** (recuada, bloco baixo), não há espaço atrás → o 9 precisa ser bom em receber de costas em espaço apertado, jogar de pivô e finalizar em área lotada. Aqui o poacher e o target man valem mais que o velocista; o falso 9 perde função (não há entrelinha para explorar porque o time todo está recuado).

**Relação com o espaço ENTRE LINHAS (`consenso`):**
O 9 que recua (falso 9, atacante completo) vive de receber no espaço entre a linha de defesa e o meio-campo adversário (as "entrelinhas"). Quanto maior esse espaço (time adversário com linhas desconectadas), mais o falso 9 brilha. Quando o adversário "junta as linhas" (compacta), esse espaço some e o 9 precisa virar referência de profundidade ou de área.

**Pressing / contrapressing / PPDA (`consenso`):**
- O **PPDA** (passes permitidos por ação defensiva — métrica de intensidade de pressing; quanto MENOR, mais o time pressiona) começa no 9. Ele é o gatilho do pressing: a forma como ele encurrala o zagueiro define se o time inteiro sobe ou não.
- Num time de **pressing alto**, o 9 pressionador é peça estrutural (sem ele o pressing não funciona, e o PPDA do time piora). 
- Num time de **bloco baixo + contra-ataque**, o 9 quase não pressiona — economiza energia para a transição. 
- No **contrapressing**, o 9 é a primeira pressão após a perda; sua disposição de correr para trás define quantas posses o time recupera no campo de ataque.
A nuance de elite: um 9 que pressiona "errado" (sai na hora errada ou no ângulo errado) **quebra a estrutura de pressing inteira** do time, abrindo a linha de passe que deveria fechar — por isso pressionar bem é uma habilidade tática refinada, não só esforço.

#### Papel em cada formação

**4-4-2 clássico (duas linhas de 4)**

**Formação que VALORIZA o 9 — e exige dois deles em dupla (`consenso`).** O 4-4-2 clássico tem dois atacantes, então a regra de ouro é a **complementaridade da dupla**: tipicamente um target man (recebe de costas, segura, cabeceia) + um finalizador/móvel (joga das sobras dele, ataca profundidade). É a 'dupla de área' clássica. O 9 raramente fica isolado: tem um parceiro permanente para tabelar e dividir a marcação dos dois zagueiros (2 contra 2 na frente). Riscos: se ambos forem do mesmo tipo (dois target men lentos, ou dois poachers), o time fica previsível e some no meio-campo. Conexão principal: com o parceiro de ataque e com os meias de fora (que cruzam). Em times diretos, vira o 'plano A' do chutão. Bom para jogo aéreo: dois alvos na área em bola parada.

**4-4-2 em losango (diamante)**

**Formação que VALORIZA muito o 9, com apoio rico por dentro (`consenso`).** O losango tem um 10 (ponta do diamante) jogando colado nos dois atacantes, então a dupla de 9 recebe MUITO apoio central — quase um trio de ataque. A diferença para o 4-4-2 clássico: como o losango não tem pontas, os cruzamentos vêm dos laterais (que sobem muito) e a criação vem de dentro, pelo 10. A dupla precisa abrir os canais (um vai para o meio-espaço) para os laterais terem por onde subir. Valoriza 9 que sabem associar (tabelar com o 10), não só esperar a bola. Risco: o time fica estreito (sem largura natural), então se a dupla não abrir os zagueiros, o ataque congestiona no meio. Parceria-chave: 9 + 10 + laterais.

**4-3-3**

**9 isolado como referência, mas com dois pontas de apoio (`consenso`).** No 4-3-3, o 9 é único na frente, ladeado por dois extremos. É a formação onde o arquétipo importa mais: pode ser um falso 9 (recua e vira o trio em criação, com pontas atacando por dentro — modelo Guardiola/Messi), um target man (segura para os pontas chegarem), um pressionador (Firmino no Liverpool) ou um finalizador (Haaland no City — fixa os dois centrais e finaliza o que os pontas criam). O 9 'paga o pato' de fixar a defesa enquanto os pontas brilham, OU recebe nas costas pelos cruzamentos rasados dos pontas invertidos. Parceria decisiva: 9 + extremos (quem fixa libera quem ataca). Risco: 9 isolado e sem pivô fica 'comendo poeira' contra dois zagueiros sem apoio.

**4-2-3-1**

**9 único com um 10 grudado nas costas — a relação 9+10 é o coração da formação (`consenso`).** É talvez o melhor esquema para um 9 'completo' ou target man de referência, porque ele tem SEMPRE um 10 logo atrás para a tabela e para aproveitar o que ele segura. O 9 fixa a linha e a dupla de pontas (alas do 3) + o 10 orbitam ao redor dele. Funções típicas: segurar e descarregar para o 10, atacar o espaço que o 10 enxerga, finalizar os cruzamentos das alas. Valoriza o 9 que faz pivô e o que cabeceia. Risco: se o 9 não segura a bola, o 10 fica órfão e a ligação meio-ataque quebra. Parceria nuclear: 9 + 10. Boa plataforma também para o pressionador (9 e 10 pressionam juntos os zagueiros).

**4-1-4-1**

**9 mais ISOLADO e sacrificado — a formação tende a apagá-lo ofensivamente (`consenso`).** O 4-1-4-1 é uma estrutura mais defensiva/equilibrada: um volante de contenção (o '1' atrás) e uma linha de 4 meias, com o 9 sozinho lá na frente, frequentemente sem apoio imediato. O 9 aqui precisa ser autossuficiente: segurar a bola sozinho contra dois zagueiros até os meias-alas subirem (o que demora). Vira muito o 'pressionador' e o 'ponto de saída' — corre, pressiona e segura mais do que finaliza. Exige um 9 de pivô forte e generoso defensivamente; um poacher puro morre de inanição nesse esquema (pouca bola chega). Risco máximo de isolamento. Parceria: depende dos meias-internos (os dois '4' centrais) chegarem na segunda onda.

**3-5-2 / 3-4-1-2**

**Formação que VALORIZA a dupla de 9 com apoio dos alas (`consenso`).** Volta a ter dois atacantes, mas agora com três zagueiros atrás e alas (wing-backs) dando a largura. A dupla de 9 enfrenta TRÊS zagueiros (2 contra 3) — desvantagem numérica — então precisa ser inteligente: um fixa dois centrais e o outro explora o terceiro ou as costas dos alas adversários. No 3-4-1-2 há ainda um 10 para alimentá-los (parecido com o losango). A dupla recebe cruzamentos dos alas, que sobem muito. Valoriza complementaridade (target + móvel) e movimentação para desorganizar a linha de 3. Parceria: dupla de 9 + alas + (no 3-4-1-2) o 10. Risco: contra 3 zagueiros, dupla parada é engolida.

**3-4-3 / 3-4-2-1**

**No 3-4-3 o 9 tem dois pontas de apoio (como no 4-3-3); no 3-4-2-1 ele é único com dois meias-atacantes (`consenso`).** No 3-4-3 com três atacantes, o 9 central fixa e finaliza, com extremos largos. No 3-4-2-1 (com dois '10'/mezzala-atacantes por dentro, ex: modelo Conte/Tuchel-Chelsea), o 9 é único mas tem DOIS criadores grudados atrás dele nos meio-espaços — excelente para um target man ou completo que segura e libera os dois meias-pontas a infiltrarem. Valoriza 9 que ocupa os dois centrais sozinho e abre os half-spaces para os '2'. Parceria nuclear: 9 + os dois meias-atacantes (no 3-4-2-1). Risco: 9 isolado contra defesa de 5 (no jogo contra bloco baixo) sem espaço.

**5-3-2 / 5-4-1 (bloco de 5)**

**Esquema reativo: o 9 vira referência de transição/contra-ataque, não de posse (`consenso`).** São formações defensivas (cinco defensores). No 5-3-2, sobrevive uma dupla de 9 cuja função principal é o CONTRA-ATAQUE: segurar a bola longa quando o time alivia (target man) e correr para o espaço quando recupera (velocista). É o esquema do '9 que aguenta sozinho lá na frente' e vive de pouca bola, mas de muita eficiência. No 5-4-1, o 9 fica TOTALMENTE isolado — único atacante de um bloco ultradefensivo — e seu trabalho é quase 100% segurar a bola sozinho e pressionar de leve para dar tempo ao time recompor. O 5-4-1 é a formação que mais ISOLA e sacrifica o 9. Valoriza força, resiliência e capacidade de segurar a bola sem apoio. Parceria: no 5-3-2, o parceiro de ataque; no 5-4-1, praticamente ninguém — solidão tática.

**4-3-1-2 (sem pontas)**

**Formação que VALORIZA a dupla de 9, alimentada por um 10 puro, mas sem largura (`consenso`).** Variante do losango/diamante: quatro defensores, três volantes/meias, um 10 e dois atacantes. Sem pontas, toda a criação vem do 10 e dos laterais. A dupla de 9 trabalha muito junta e por dentro, tabelando com o 10 e abrindo espaço para os laterais subirem pelos flancos vazios. Valoriza 9 associativos e móveis (precisam criar a própria largura indo aos meio-espaços) e penaliza poachers estáticos. Risco central: estreiteza — se a dupla não se mexer, o ataque entope no miolo e os zagueiros adversários defendem confortáveis. Parceria nuclear: dupla de 9 + 10 + laterais ofensivos.

#### Parcerias-chave

**As relações que definem o rendimento de um 9 (`consenso`):**

**9 + parceiro de ataque (em esquemas de dois atacantes — 4-4-2, 3-5-2, 4-3-1-2):** a parceria mais íntima. A regra é **complementaridade**: target man + móvel/finalizador. Um segura e desvia, o outro ataca a sobra e a profundidade. Dois iguais = previsibilidade. Boas duplas se "leem" sem olhar (movimentos coordenados de um para um lado, outro para o oposto).

**9 + 10 (meia-armador) — em 4-2-3-1, losango, 3-4-1-2, 4-3-1-2:** o 10 é quem 'enxerga' o passe que coloca o 9 na cara do gol; o 9 é quem segura para o 10 chegar. Quando essa dupla está afinada, o time tem o seu motor criativo. Parceria de assistência por excelência (a maioria das assistências para o 9 vem do 10 ou dos pontas).

**9 + extremos/pontas (4-3-3, 3-4-3):** relação de troca — quem fixa libera quem ataca. O 9 fixa os centrais e os pontas invertidos atacam por dentro; ou os pontas abrem os laterais e cruzam para o 9 finalizar. Pontas que cruzam = comida para target man; pontas que invadem por dentro = exigem que o 9 abra espaço (vá ao meio-espaço ou segure a marcação).

**9 + laterais/alas (wing-backs):** os laterais ofensivos e os alas são os principais fornecedores de **cruzamento** para o 9. Quanto mais sobem (3-5-2, losango, 4-3-1-2), mais o 9 precisa atacar a área para aproveitar. Em troca, o 9 precisa 'abrir' os zagueiros para criar a janela do cruzamento.

**9 + volante/construtor (relação inversa — defensiva):** quando o time defende, o 9 frequentemente 'esconde' o volante adversário com a sombra, condicionando toda a saída de bola do outro time. Aqui a parceria é com a estrutura, não com um jogador específico.

#### Exemplos de elite

**Atuais (2023-2026):**
- **Erling Haaland (Man City)** — atacante de profundidade + poacher de elite (`verificado-fetch`: 27 gols e 8 assistências em 2025-26, 3ª Chuteira de Ouro da PL em 4 temporadas; passou de 150 gols pelo City). Fixa os dois centrais, mortal nas costas da linha alta e na pequena área. Bate os pênaltis do time.
- **Harry Kane (Bayern)** — atacante completo / target man moderno (`verificado-fetch`: 31 gols em 26 jogos em 2026, único nas 5 grandes ligas com média acima de gol/jogo no ano-calendário). Segura, finaliza, lança e assiste — o protótipo do 9 que também é o melhor passador do time.
- **Kylian Mbappé (Real Madrid)** — 9 atípico/velocista (`verificado-fetch`: artilheiro da Champions 2025-26 com 15 gols). Não segura a bola como 9 clássico, joga como ponta centralizado vivendo de profundidade e dribles.
- **Robert Lewandowski (Barcelona)** — atacante quase completo (`verificado-fetch`: descrito como combinando as melhores qualidades dos pares). Referência de área, finalizador frio, ainda decisivo na bola parada.
- **Viktor Gyökeres (Arsenal)** — finalizador/poacher (`verificado-fetch`: 97 gols em 102 jogos no Sporting; descrito como letal na área mas limitado no aéreo e contra bloco baixo). Caso-escola de finalizador especialista, não completo.
- **Ousmane Dembélé (PSG)** — falso 9 reinventado (`verificado-fetch`: Bola de Ouro 2025 jogando recuado como falso 9, campeão da Champions). 
- **Julián Álvarez (Atlético)** — atacante completo/móvel e pressionador (`verificado-fetch`: entre os artilheiros da Champions 2025-26). Versátil entre 9 e segundo atacante.

**Históricos (definem os arquétipos) (`consenso`):**
- **Filippo Inzaghi** — o poacher arquetípico (vivia em impedimento, quase não tocava na bola, fazia o gol).
- **Didier Drogba / Zlatan Ibrahimović** — target men completos (força, pivô, gol e bola parada).
- **Lionel Messi (Barça 2009-2012)** — o falso 9 canônico que redefiniu a posição sob Guardiola.
- **Roberto Firmino (Liverpool de Klopp)** — o pressionador arquetípico (valor defensivo e associativo acima do gol).
- **Ronaldo Fenômeno / Thierry Henry** — atacantes completos/velocistas que uniam profundidade, drible e finalização.

#### Erros comuns / como falha

**Como a posição FALHA — sinais de mau desempenho e o que um treinador cobra (`consenso`):**

**Erros de finalização/decisão:**
- *Pressa e afobação na cara do gol* (chuta cedo, em vez de dar mais um toque ou esperar o goleiro cair). O treinador cobra **frieza** e repertório.
- *Escolher mal o canto / chutar no goleiro recorrentemente* — sinal de finalização tecnicamente fraca sob pressão.
- *Sumir nas finalizações fáceis e tentar o difícil* — falta de leitura.

**Erros de movimentação (o mais cobrado pelos técnicos de elite):**
- *Timing errado do desmarque:* sair cedo demais (cai em impedimento) ou tarde demais (não chega na bola). Impedimentos repetidos = leitura ruim da linha.
- *Movimento estático / 'ficar plantado':* não atacar o espaço, esperar a bola nos pés. Um 9 parado entrega o jogo ao zagueiro e some da partida.
- *Não fixar a linha:* recuar sem necessidade e deixar a defesa adversária subir confortável, comprimindo o time.
- *Movimentos previsíveis:* sempre o mesmo desmarque — o zagueiro 'decora' e antecipa.

**Erros de pivô/posse:**
- *Perder a bola de costas* (controle ruim, não protege com o corpo) — mata a transição e entrega o contra-ataque.
- *Descarregar mal* (devolve a bola sem critério sob pressão).

**Erros defensivos/de pressing:**
- *Pressionar no ângulo errado* — sai 'aberto' e o zagueiro joga justamente na linha que ele deveria fechar, quebrando o pressing do time inteiro.
- *Não recompor na transição (poacher preguiçoso)* — o adversário sai sempre pelo lado dele, e o time joga 10x11 defensivamente.
- *Não pressionar gatilho:* perde o momento de disparar a pressão e o time fica 'rachado' (linha de ataque solta do meio).

**Sinais de mau jogo no geral (o que o olho do treinador vê):**
- "9 que desaparece": poucos toques E poucos desmarques perigosos (diferente do poacher, que toca pouco mas ameaça muito).
- Briga aérea perdida sistematicamente (timing/posicionamento de salto ruim).
- Frustração visível, reclamação, queda de intensidade no pressing após errar uma chance — perda de cabeça.
- Isolamento por culpa própria: não se oferece, não dá linha de passe, some entre os zagueiros sem movimento.

#### Ganchos para EXPLICAR (explicativo-não-preditivo)

**Mercados/dimensões que esta posição mais informa para o assistente EXPLICAR (sempre explicativo-não-preditivo; o número do mercado é a âncora e nunca se move) (`consenso`):**

**Gols (total de gols / over-under / time marca):** o 9 é a variável humana mais ligada ao mercado de gols. Ganchos narrativos: arquétipo do 9 vs. estilo da defesa (velocista contra linha alta = mais chance de gol em profundidade; poacher contra bloco baixo = depende de cruzamento/bola parada). **Sempre como 'porquê' do número, jamais como edge.** Ex.: "o mercado precifica X gols; um 9 de profundidade contra uma linha que costuma subir é um ingrediente narrativo coerente com esse número — não uma recomendação."

**Escanteios:** um target man dominante no aéreo faz a defesa adversária 'cortar para escanteio' com mais frequência; um 9 que ataca a profundidade gera cruzamentos rasados desviados. Gancho explicativo para o volume de escanteios precificado.

**Cartões:** duelos físicos do target man com os zagueiros (faltas táticas para parar pivô/profundidade) alimentam a narrativa de cartões na marcação do 9. Um 9 que ataca o espaço puxa faltas de 'última linha' (possíveis amarelos em zagueiros).

**Assistências / props de jogador (chutes, chutes no alvo, finalizações, cabeçadas):**
- *Chutes/chutes no alvo do 9:* arquétipo informa volume — poacher e velocista tendem a concentrar finalizações; falso 9 e pressionador tendem a chutar menos e passar mais. Gancho para props de finalização.
- *Assistências:* falso 9, atacante completo e target man que descarrega geram assistências; poacher quase não. 
- *Cabeçadas/duelos aéreos:* target man informa props aéreos.
- *Anytime scorer / primeiro a marcar:* o arquétipo + a parceria (quem o alimenta) + o estilo da defesa é o material narrativo natural para EXPLICAR esses props.

**Jogo aéreo (mercado de duelos/cabeçadas):** o arquétipo target vs. poacher é o divisor — informa diretamente a narrativa de quem disputa e ganha bola alta.

**Regra transversal:** todos esses ganchos são **gerador de hipóteses e vocabulário do 'porquê'**, ancorados no número do mercado/quant que já está dado. Nunca afirmar que o arquétipo do 9 'cria edge' ou constitui 'dica por posição' — é a camada EXPLICAR contando a história por trás do número, não a camada que aposta.

---

## Parte 2 — As formações (papel de cada posição dentro da forma)

Eixo ortogonal: como cada formação molda holisticamente o time. Cross-check da Parte 1.

1. [4-4-2 clássico (duas linhas de 4)](#4-4-2-clássico-duas-linhas-de-4)
2. [4-4-2 em losango (diamante) — também escrito 4-1-2-1-2 ou "4-4-2 diamond"](#4-4-2-em-losango-diamante--também-escrito-4-1-2-1-2-ou-4-4-2-diamond)
3. [4-3-3](#4-3-3)
4. [4-2-3-1](#4-2-3-1)
5. [4-1-4-1](#4-1-4-1)
6. [3-5-2 / 3-4-1-2 (linha de 3 zagueiros, 5 no meio com 2 alas, e 2 atacantes; a variante 3-4-1-2 troca um volante por um meia-armador/10)](#3-5-2--3-4-1-2-linha-de-3-zagueiros-5-no-meio-com-2-alas-e-2-atacantes-a-variante-3-4-1-2-troca-um-volante-por-um-meia-armador10)
7. [3-4-3 / 3-4-2-1 (linha de 3 zagueiros, 4 no meio com 2 alas + 2 pivôs, e 3 no ataque — seja como tridente aberto 3-4-3 ou como 3-4-2-1 com dois "homens entre linhas" atrás de um centroavante)](#3-4-3--3-4-2-1-linha-de-3-zagueiros-4-no-meio-com-2-alas--2-pivôs-e-3-no-ataque--seja-como-tridente-aberto-3-4-3-ou-como-3-4-2-1-com-dois-homens-entre-linhas-atrás-de-um-centroavante)
8. [5-3-2 / 5-4-1 (bloco de 5 / linha de 5 defensores)](#5-3-2--5-4-1-bloco-de-5--linha-de-5-defensores)
9. [4-3-1-2 (sem pontas) — também chamada de "diamante estreito" ou "midfield diamond"](#4-3-1-2-sem-pontas--também-chamada-de-diamante-estreito-ou-midfield-diamond)

---

### 4-4-2 clássico (duas linhas de 4)

#### Resumo e viés

O **4-4-2 clássico** é a formação mais elementar e historicamente dominante do futebol: quatro defensores, quatro meias em linha e dois atacantes. "Duas linhas de 4" é a assinatura defensiva — defesa e meio-campo formam dois blocos horizontais paralelos, espaçados verticalmente, que sobem e descem juntos como uma sanfona. (consenso)

A filosofia que ela carrega é de **equilíbrio, simetria e simplicidade reativa**. Não é por natureza ofensiva nem ultradefensiva; é um sistema de **controle de espaço por ocupação de zonas**, não por marcação individual. Cada jogador é responsável por uma faixa do campo, e o time se move em bloco. Isso a torna fácil de ensinar, difícil de desorganizar e muito sólida em proteção — mas, no jogo moderno, ela carrega um **viés reativo**: tende a ceder a posse e o controle do meio-campo central a sistemas que põem mais homens ali (3 ou mais meio-campistas).

Para o leitor entender o pano de fundo: o 4-4-2 foi a base do futebol britânico e mundial dos anos 80-90 e do início dos 2000 (verificado-fetch). Hoje é menos comum como sistema declarado de posse, mas ressurgiu fortíssimo como **bloco defensivo médio/baixo** e como ferramenta de pressão coordenada (o "4-4-2 de pressing" do Atlético de Madrid de Simeone e da Inglaterra de várias eras). É o esqueleto reativo por excelência. (consenso)

Termo-chave logo de cara: **bloco** = a forma compacta do time sem a bola. **Linha** = uma fileira horizontal de jogadores (a "linha de 4" da defesa, por exemplo). **Espaço entre linhas** = a faixa de gramado entre a linha de defesa e a de meio-campo, onde meias-armadores adversários adoram receber. Essas três ideias governam tudo no 4-4-2.

#### Papel de cada posição nesta formação

**Goleiro**

No 4-4-2 clássico, o goleiro tem papel **tradicional e menos protagonista** do que em sistemas de posse. Como o time costuma jogar com bloco mais recuado e linha defensiva nem sempre alta, ele é menos exigido como **líbero/sweeper-keeper** (goleiro que sai da área para varrer bolas nas costas da defesa). Sua função primária é defender o gol e organizar a linha de 4 à frente, comandando a altura e a compactação. No 4-4-2 moderno de saída de bola, ele pode formar trio com os dois zagueiros na primeira fase, mas isso é menos natural aqui do que num 4-3-3, porque não há um volante isolado descendo para criar a linha de 3. (consenso)

**Lateral**

Os **laterais (full-backs)** são o motor ofensivo do 4-4-2 — e seu maior ponto de tensão. Sem alas dedicados (esse papel não existe nesta formação), são eles que dão a **largura no ataque**: sobem pela linha lateral enquanto os dois extremos podem fechar por dentro. Na defesa, voltam para formar a linha de 4. O dilema clássico: como há só dois meias centrais cobrindo o miolo, quando um lateral sobe demais ele deixa um **gap na lateral e no espaço atrás de si** que extremos rápidos e laterais infiltradores adversários exploram. Por isso, no 4-4-2 clássico, é comum os laterais serem mais **contidos** do que num 3-5-2 com alas. A coordenação típica é: sobe um lateral por vez, ou o lado da bola sobe e o lado oposto se fecha para virar quase uma linha de 3 temporária. (consenso)

**Zagueiro central**

São **dois zagueiros centrais**, e a dupla é a espinha dorsal da formação. Defendem em **zona** (cada um responsável por uma metade da área), protegem o miolo e disputam o jogo aéreo — fundamental, porque o 4-4-2 sofre cruzamentos quando os laterais são puxados. O ideal clássico é a **dupla complementar**: um mais agressivo, que sai na marcação e dá o bote (o 'stopper'), e um mais posicional, que faz a cobertura por trás (o 'cover'). A vulnerabilidade estrutural deles: contra **dois atacantes** numa dupla central, há paridade 2 contra 2 — sem sobra. Se um zagueiro é arrastado para fora, o outro fica isolado contra o atacante restante. Isso é o calcanhar de Aquiles do 4-4-2 contra ataques que jogam com dois homens de área que se movem em diagonais cruzadas. (consenso)

**Volante/Pivô**

O 4-4-2 clássico usa o **duplo pivô** — dois meias centrais lado a lado, sem um '6' único isolado. Esse par é o cérebro e os pulmões do time. A divisão clássica de trabalho é **um mais defensivo (o 'destruidor' / 'holding')** que fica à frente da zaga, protege o espaço central e cobre as subidas dos laterais; e **um mais móvel/criador (o 'box-to-box' ou meia mais avançado)** que liga a defesa ao ataque e chega na área. A grande limitação: **dois homens no centro contra três** (que é o que um 4-3-3 ou um 3-5-2 colocam ali) gera **inferioridade numérica no meio**. O par tem que cobrir muito chão lateralmente; se os dois sobem juntos, abrem o coração do campo. A regra de ouro do duplo pivô é a **balança**: quando um sobe, o outro segura — eles raramente atacam o mesmo espaço ao mesmo tempo. (consenso)

**Extremo/Ponta**

São **dois extremos**, um por lado, e aqui eles são na verdade **meias de lado de campo (wide midfielders)**, não pontas puras — uma distinção crucial. Diferente do extremo do 4-3-3 (que vive colado na linha e só ataca), o extremo do 4-4-2 tem **dupla função obrigatória**: ataca dando largura/cruzamento e **recua para formar a linha de 4 de meio-campo**, fechando o corredor e ajudando o lateral a defender o flanco. É o jogador que mais corre no eixo vertical da formação. Sem essa recomposição, a linha de 4 vira linha de 2 e o time é rasgado pelas laterais. Por isso o 4-4-2 exige **extremos trabalhadores e disciplinados**, não dribladores egoístas. Quando o time tem extremos que invertem o pé (canhoto na direita, destro na esquerda), eles fecham por dentro e os laterais dão a largura — automatismo moderno comum. (consenso)

**Centroavante / Segundo atacante**

São **dois atacantes**, e a riqueza tática do 4-4-2 está na **relação entre eles**. O modelo clássico é a **dupla complementar**: um **centroavante de referência (target man / '9' fixo)** — forte, segura a bola de costas, ganha pelo alto, fixa os dois zagueiros — e um **segundo atacante (second striker / '9 e meio')** mais móvel, que joga ao redor do primeiro, vive entre linhas, ataca o espaço nas costas da zaga e finaliza as sobras. A dinâmica é de **fixar e girar**: o referência prende a dupla de zaga, o parceiro explora os corredores que isso abre. Outras combinações: dois homens rápidos que atacam a profundidade em diagonais cruzadas; ou um '9' e um '10' falso recuando para criar superioridade no meio. A presença de **dois atacantes** é o que pressiona psicologicamente a defesa adversária — ocupa os dois zagueiros e impede que eles saiam jogando à vontade. (consenso)

#### Forças

**1. Solidez defensiva por zonas e compactação.** As duas linhas de 4 cobrem a largura inteira do campo (cada jogador responsável por ~9 metros). Bem treinado, o bloco é dificílimo de furar pelo meio — não sobra espaço entre os jogadores de uma mesma linha. É a forma mais **didática e estável** de defender em bloco. (consenso)

**2. Pressão coordenada na frente (os dois atacantes).** Com dois homens na frente, o 4-4-2 pressiona a saída de bola adversária com **paridade contra a dupla de zaga** (2v2), forçando erros ou chutões. Os dois atacantes podem fechar os passes para os volantes adversários ('cobrir sombra'), enquanto os extremos saltam nos laterais. Esse é o motor do 4-4-2 de pressing moderno (Atlético de Simeone). (consenso/verificado-fetch)

**3. Largura natural e jogo de cruzamento.** Quatro homens podem dar largura simultânea (dois laterais + dois extremos), gerando muitos **cruzamentos** para os dois atacantes na área — superioridade aérea no ataque. Formação clássica para quem joga forte pelo alto. (consenso)

**4. Transições rápidas e diretas.** Como já há **dois atacantes fixos na frente**, ao recuperar a bola o time tem alvos imediatos para o passe vertical — não precisa esperar ninguém subir. Ideal para contra-ataque. (consenso)

**5. Simplicidade e clareza de funções.** Cada jogador sabe exatamente sua zona. Reduz erros de comunicação, facilita a montagem de um time novo ou com pouco tempo de treino. (consenso)

**6. Referências de marcação claras.** Dupla de zaga marca dupla de ataque, laterais marcam extremos, meias marcam meias — o sistema 'casa' homem a homem com a maioria das formações simétricas, facilitando a marcação. (consenso)

#### Fraquezas

**1. Inferioridade numérica no meio-campo central (a fraqueza-mãe).** Com apenas **dois meias centrais**, o 4-4-2 perde o miolo para qualquer sistema com três homens ali (4-3-3, 4-2-3-1, 3-5-2). É **2 contra 3** no centro: o adversário tem sempre um homem livre para receber, girar e progredir. Esse é o motivo número um pelo qual o 4-4-2 saiu de moda como sistema de posse. (consenso)

**2. O espaço entre linhas.** A faixa entre a linha de defesa e a de meio-campo é a 'terra de ninguém' do 4-4-2. Um **meia-armador/10 adversário** que se posiciona ali (algo que o 4-2-3-1 faz por desenho) recebe sem marcador natural — nenhum dos dois volantes quer subir e abrir o centro, e nenhum zagueiro quer subir e furar a linha. Esse 10 livre é o que mais machuca a formação. (consenso)

**3. Gaps no flanco quando o lateral sobe.** Sem ala dedicado, cada vez que um lateral ataca, abre o espaço atrás de si. Se o extremo do mesmo lado não recompõe a tempo, o corredor lateral inteiro fica exposto a contra-ataques e a sobrecargas (2v1 contra o lateral). (consenso)

**4. Vulnerabilidade à 'terceira linha' e à sobrecarga lateral.** Times que jogam com '10' + alas/laterais altos criam **superioridade numérica nas pontas** (3 contra 2: extremo + lateral + meia atacam o lateral e o extremo defensivo do 4-4-2). (consenso)

**5. Distância vertical entre as linhas.** Se as duas linhas de 4 se separam (a de meio sobe pra pressionar e a de defesa hesita), abre-se um vão enorme entre elas — exatamente o espaço que um time de posse busca. Manter as linhas a ~10-15 metros uma da outra exige sincronia constante; é o erro mais comum de times mal treinados na formação. (consenso)

**6. Exigência física dos extremos e laterais.** O sistema só funciona se os homens de flanco cobrirem o campo todo (atacar e defender). Times sem fôlego nas pontas viram presa fácil. (consenso)

#### Matchups (boa contra / sofre contra)

A lógica de todo matchup é contar homens por setor (defesa / meio / ataque) e achar onde sobra ou falta gente.

**Contra 4-4-2 (espelho).** Jogo simétrico, tudo casado: 2v2 na frente, 2v2 no meio central, 4v4 nas linhas. Vira um jogo de **duelos individuais e detalhes** — quem ganha os duelos de meio e os segundos lances. Sem superioridade estrutural para nenhum lado; decide quem é melhor no 1v1 e nas bolas paradas. (consenso)

**Contra 4-3-3.** **Desfavorável no meio.** O 4-3-3 põe três meias contra os dois do 4-4-2 — superioridade 3v2 no centro. Eles dominam a posse e progridem pelo homem livre. Em compensação, o 4-4-2 tem **2v2 contra a zaga do 4-3-3** (que tem só 2 zagueiros e 1 volante), então pode incomodar a saída de bola e ser perigoso no contra-ataque. Resumo: o 4-4-2 sofre com a bola, mas pode punir na transição. (consenso)

**Contra 4-2-3-1.** **O matchup mais incômodo para o 4-4-2.** O '10' do 4-2-3-1 vive exatamente no **espaço entre linhas** que o 4-4-2 não cobre, e o duplo pivô do adversário (também 2) iguala o miolo enquanto o 10 cria 3v2 funcional. Os três homens atrás do '9' (10 + 2 extremos) atacam as linhas e as costas dos laterais. O 4-4-2 precisa que um volante 'suba' no 10 — mas aí abre o centro. Dilema permanente. (consenso)

**Contra 3-5-2 / 3-4-2-1.** **Desfavorável no meio e nos flancos.** O 3-5-2 tem **três meias centrais (3v2)** e **alas** que atacam os laterais do 4-4-2 com apoio, gerando sobrecarga nos corredores. Os dois atacantes do 4-4-2, porém, encontram **3v2 contra a linha de 3 zagueiros? Não** — é 2 atacantes contra 3 zagueiros, ou seja, **inferioridade na frente**: a linha de 3 sobra um homem para cobertura. Difícil para o 4-4-2 em quase todos os setores. (consenso)

**Contra 3-4-3.** Parecido com o 3-5-2 nos flancos (alas perigosos), mas a frente de três do adversário (2v? ) ataca a linha de 4 com largura. O 4-4-2 luta no meio (4 meias do 3-4-3 vs 2 centrais + apoios). (consenso)

**Onde o 4-4-2 é BOM:** contra sistemas que **deixam só 2 zagueiros e descuidam o meio defensivo** — porque os dois atacantes do 4-4-2 viram 2v2 atrás e a pressão alta sufoca a saída. É letal contra times que tentam sair jogando curto com poucos homens. Também é forte contra adversários **lentos na recomposição lateral**, onde os cruzamentos para a dupla de ataque pesam. E brilha como **bloco contra times de posse sem profundidade** — se o adversário não tem quem ataque as costas da defesa, as duas linhas de 4 simplesmente fecham tudo e esperam o contra-ataque. (consenso)

#### Interações e automatismos

**1. O duplo pivô e a 'balança'.** A parceria dos dois meias centrais é a que mais define o time. O automatismo essencial: **um sobe, o outro segura** — nunca os dois ao mesmo tempo, ou o centro fica aberto. Eles também se revezam para cobrir as laterais quando os extremos sobem. Sem entrosamento nesse par, o 4-4-2 desmorona pelo meio. (consenso)

**2. Lateral + extremo do mesmo lado (a dupla de corredor).** Os dois ocupam o mesmo flanco e precisam de uma 'regra de gangorra': **se o lateral sobe, o extremo recua/fecha por dentro; se o extremo abre na linha, o lateral segura**. Essa coordenação cobre o gap atrás do lateral. Quando funciona, gera sobreposições (overlaps) e 2v1 no ataque; quando falha, vira o buraco por onde o time toma gol. (consenso)

**3. A dupla de ataque (fixar e girar).** O '9' de referência fixa os dois zagueiros e segura a bola; o segundo atacante explora o espaço que isso libera, vivendo entre linhas e atacando a profundidade. A diagonal cruzada (um vai na frente, o outro nas costas) é o movimento que mais desorganiza a dupla de zaga adversária. (consenso)

**4. As duas linhas de 4 como sanfona.** O automatismo coletivo central: as duas linhas sobem e descem **juntas e paralelas**, mantendo ~10-15m entre si para sufocar o espaço entre linhas. O gatilho de subida é o passe para trás do adversário; o de descida, a perda de referência. Esse 'respirar' coordenado é o que separa um 4-4-2 de elite de um amador. (consenso)

**5. Extremos defensivos = a quinta e a sexta peça defensiva.** O segredo do 4-4-2 sólido é que ele defende quase com **seis na linha de meio quando recua** (os dois extremos descem e o bloco vira um 4-4-2 bem baixo). Essa recomposição dos extremos é o que tapa a inferioridade numérica de fundo. (consenso)

#### Variações por fase (com bola / sem bola / placar)

**Com bola (organização ofensiva).** O 4-4-2 raramente fica '4-4-2 quadrado' ao atacar. As mutações típicas: um lateral sobe e o time vira **3-4-3 / 3-2-5** momentâneo (3 atrás, 5 na frente com extremos abertos e atacantes na área). Um dos meias centrais pode recuar entre os zagueiros para virar **3-1** na saída (formando linha de 3 para superar a pressão), enquanto o outro sobe. O segundo atacante frequentemente recua para o espaço entre linhas, transformando o 4-4-2 em algo perto de **4-4-1-1** ou **4-2-3-1** com a bola. Em resumo: a forma declarada (4-4-2) e a forma real com a bola quase nunca coincidem. (consenso)

**Sem bola (organização defensiva).** Aqui o 4-4-2 é mais fiel à sua forma — as duas linhas de 4 se mantêm. Variações pela **altura do bloco**: (a) **bloco alto / pressing** — os dois atacantes pressionam a zaga, extremos saltam nos laterais, linha sobe; ferramenta agressiva, mas deixa as costas expostas (4-4-2 de Bielsa/Klopp em fases). (b) **bloco médio** — espera no meio-campo, fecha o centro, convida o adversário a jogar pelos lados. (c) **bloco baixo** — recua para perto da própria área, vira quase **4-4-1-1** ou **4-5-1** (um atacante recua para a linha de meio e tapa o buraco central); a forma reativa pura, do Atlético de Simeone, que aceita não ter a bola e aposta no contra-ataque. (consenso/verificado-fetch)

**Por estado de placar.** **Ganhando** → recua para bloco médio/baixo, um atacante passa a ajudar na contenção (4-4-1-1 / 4-5-1), prioriza segurar e contra-atacar com os dois homens da frente. **Perdendo** → sobe o bloco, laterais viram quase alas, um volante avança, o time se aproxima de um 4-2-4 ou 4-3-3 ofensivo, lotando a área para cruzamentos — a força aérea do 4-4-2 é o trunfo natural quando precisa do gol. **Empate em jogo equilibrado** → mantém o bloco médio compacto e disputa o meio nos duelos. Distinção importante: o **4-4-2 'declarado' na escalação** quase sempre vira outra coisa nas duas fases reais — é mais um ponto de partida do que a forma efetiva durante os 90 minutos. (consenso)

#### Exemplos de times e treinadores

**Atlético de Madrid de Diego Simeone (2011-presente)** — o maior expoente moderno do 4-4-2 como **bloco defensivo médio/baixo e máquina de contra-ataque**. Duas linhas de 4 perfeitamente compactas, extremos que defendem como laterais, dupla de ataque que pressiona e finaliza transições. Referência absoluta de como a formação reativa vence no século XXI (campeão espanhol e finalista de Champions com ela). (verificado-fetch/consenso)

**Leicester City campeão da Premier League 2015/16 (Claudio Ranieri)** — 4-4-2 contra-atacante clássico: bloco médio, recuperação e bola longa rápida para a dupla de velocidade (Vardy na profundidade), extremos disciplinados e duplo pivô de muito volume (Kanté). O case que provou que o 4-4-2 ainda ganha títulos. (verificado-fetch/consenso)

**Manchester United de Alex Ferguson (anos 90 e 2000)** — o 4-4-2 'inglês' canônico em sua versão ofensiva: extremos clássicos abrindo o campo, duplo pivô equilibrado, dupla de ataque complementar (referência + móvel). Modelo histórico de excelência da formação. (consenso/verificado-fetch)

**Inglaterra (seleção, várias eras) e Arsenal 'Invincibles' (2003/04)** — bases 4-4-2 que marcaram época na Europa. O Arsenal de Wenger usava um 4-4-2 com extremos que invertiam e dupla de ataque móvel (Henry/Bergkamp), aproximando-o do jogo posicional moderno. (consenso)

**Simeone e Diego Pablo (uso por estado de placar)** e o **Burnley de Sean Dyche (Premier League)** ilustram o 4-4-2 'de resistência': bloco baixo, defesa de zona disciplinada, jogo aéreo e bola parada como armas de quem não tem a posse. (consenso)

---

### 4-4-2 em losango (diamante) — também escrito 4-1-2-1-2 ou "4-4-2 diamond"

#### Resumo e viés

**O que é (`consenso`).** O 4-4-2 em losango é uma variação do 4-4-2 em que os quatro jogadores do meio-campo, em vez de formarem uma linha horizontal (dois por dentro, dois pelas pontas), se organizam num **losango vertical**: um **volante/pivô** na base (o vértice de baixo), dois **interiores/mezzala** nos lados do losango, e um **meia-armador/10** na ponta de cima, logo atrás dos dois atacantes. Por isso é tão comum vê-lo escrito como **4-1-2-1-2**, que é literalmente a leitura vertical do losango: 4 defensores, 1 volante, 2 interiores, 1 dez, 2 atacantes.

**A filosofia / o viés que ele carrega (`consenso`).** O diamante é, na essência, uma formação de **domínio central** e de **superioridade numérica no miolo do campo**. Ele concentra quatro homens de meio-campo na coluna do meio para sufocar o adversário ali, criar triângulos curtos de passe e empurrar dois atacantes de verdade lá na frente. É a antítese filosófica do 4-3-3 (que valoriza largura e pontas abertas) e do 4-2-3-1 (que valoriza controle com duplo pivô e um único homem de referência). Quem monta um diamante está dizendo: *"vou ganhar o jogo pelo centro, vou ter dois atacantes para finalizar, e aceito ceder largura para isso."*

**Jargão essencial definido de cara (`consenso`):**
- **Corredor / coluna:** o campo é dividido mentalmente em cinco faixas verticais — duas laterais (perto das linhas de fundo), duas meias-luas (meio-corredores, o espaço entre o centro e a linha lateral) e a central. O diamante lota a central e as meias-luas, e **abandona as duas laterais** ao ataque (na fase ofensiva, quem ocupa a largura são os laterais).
- **Mezzala / interior:** "mezzala" é italiano para "meia-asa", o meio-campista dos lados do losango. Ele joga em diagonal, entre a linha e o corredor, ajudando tanto a construir quanto a chegar na área.
- **Volante / pivô / "número 6":** o homem da base do losango, à frente da zaga, que protege o meio e inicia a saída de bola.
- **Dez / armador / "número 10":** o homem da ponta do losango, o cérebro criativo entre os meias e os atacantes.

**Identidade resumida:** formação **proativa e de controle por dentro**, com **forte presença ofensiva** (dois atacantes + um dez + dois interiores que chegam = potencialmente cinco homens no ataque), mas com uma **vulnerabilidade estrutural crônica na largura** que define quase tudo de bom e de ruim nela.

#### Papel de cada posição nesta formação

**Goleiro**

**Goleiro-líbero / construtor da saída (`consenso`).** No diamante o goleiro é mais exigido com os pés do que numa formação reativa, porque a saída de bola pela lateral é pobre (não há pontas abertas para receber e os laterais sobem alto). O goleiro vira frequentemente o **homem extra na primeira fase de construção**, formando um triângulo curto com os dois zagueiros para superar o primeiro pressing. Em situações de pressão alta adversária, ele é a válvula de escape que permite ao volante descer e oferecer linha. Defensivamente, como o time cede a largura, ele precisa ser bom em **sair do gol para cobrir bolas nas costas dos laterais** (sweeper-keeper / goleiro-líbero: o goleiro que joga adiantado e varre o espaço atrás da linha).

**Lateral (lateral-direito e lateral-esquerdo)**

**A posição que decide se o diamante funciona (`consenso`). Os laterais são, de longe, os jogadores mais importantes do sistema.** Como o losângulo não tem pontas, **são os únicos jogadores que dão largura ao time inteiro**. Eles têm que percorrer a lateral de ponta a ponta, dos dois lados: subir como alas/extremos improvisados na fase ofensiva (para esticar a defesa adversária e dar o cruzamento que alimenta os dois atacantes) e recompor toda a faixa lateral na fase defensiva. É uma das funções mais fisicamente desgastantes do futebol — exige um lateral com pulmão de maratonista, qualidade de cruzamento e bom 1-contra-1. **O calcanhar de Aquiles do sistema:** quando o lateral está subido e a bola é perdida, há um corredor inteiro aberto às costas dele, e o diamante quase não tem quem cubra (não há ponta para recuar). Por isso muitos treinadores usam um lateral mais ofensivo de um lado e um mais contido do outro, ou pedem que os interiores/mezzala façam a cobertura diagonal.

**Zagueiro central (dupla de zaga)**

**Dupla de zaga em superioridade no eixo, exposta na largura (`consenso`).** Os dois zagueiros centrais têm proteção privilegiada no eixo central — o volante senta na frente deles e a estrutura inteira protege o miolo. O problema deles é horizontal: como os laterais sobem muito, a dupla de zaga acaba tendo que **cobrir uma largura grande demais** em transições. Isso exige zagueiros rápidos e bons em campo aberto, não apenas brigadores de área. Um perfil ideal aqui é um zagueiro com boa saída de bola (para alimentar o volante e os interiores na construção por dentro) e velocidade para defender o espaço nas costas dos laterais. Em times que jogam com linha alta, a dupla de zaga + goleiro líbero formam o seguro contra a bola em profundidade que o adversário busca explorar exatamente pela largura abandonada.

**Volante / pivô (base do losango, "número 6")**

**O pilar de equilíbrio — o jogador mais subestimado do diamante (`consenso`).** Senta sozinho à frente da zaga, no vértice de baixo do losango. Tem dupla responsabilidade pesada: (1) **na construção**, é o primeiro pivô de passe, quem gira o jogo de um lado para o outro e dá ritmo à posse — costuma descer entre os zagueiros (formando uma linha de 3 na saída) para liberar os laterais; (2) **na proteção**, é praticamente o único filtro na frente da defesa — se ele é arrastado para fora de posição, abre-se um buraco gigante no centro. Como joga sozinho nessa função (diferente do duplo pivô do 4-2-3-1), ele cobre muito chão sozinho e fica exposto contra equipes que atacam por dentro com um trio de meio. Perfil ideal: leitura de jogo de elite, posicionamento, e capacidade de iniciar jogadas. Em algumas variações é um 'regista' (volante-armador que dita o tempo) e em outras um 'destruidor' (volante-marcador puro), e essa escolha muda o caráter do time inteiro.

**Interior / mezzala (os dois lados do losango — meia-direita e meia-esquerda por dentro)**

**Os motores box-to-box do losango (`consenso`).** São os dois meias dos lados do diamante. Função híbrida e altíssima quilometragem: ajudam o volante a construir e proteger por dentro, mas também **chegam na área para finalizar e dar o último passe** (mezzala que rompe entre linhas). Crucialmente, eles têm um terceiro trabalho que é o segredo do sistema: **fazer a cobertura diagonal da largura** — quando o lateral do seu lado sobe ou é ultrapassado, é o interior que tem de deslocar-se para fora e tapar o corredor, evitando que o diamante seja furado pela ponta. Por isso o perfil ideal de mezzala num diamante é o de um meio-campista completo (box-to-box: o que cobre as duas áreas, defende e ataca) com pulmão, capacidade de marcar e de aparecer no ataque. É a posição onde mais se ganha ou se perde o equilíbrio entre o domínio central e a vulnerabilidade lateral.

**Meia-armador / 10 (ponta de cima do losango)**

**O cérebro criativo e a peça de luxo do sistema (`consenso`).** Joga no espaço entre o meio-campo adversário e a defesa adversária — a chamada **zona 14** (a região central logo à frente da área, estatisticamente a mais perigosa para criar chances). Tem liberdade posicional: é quem liga os dois atacantes ao meio-campo, dá os passes de ruptura, e flutua para os lados para criar superioridade onde a bola estiver. O diamante existe em parte para **dar um habitat ideal a um 10 clássico** — esse é um dos motivos pelos quais treinadores recuperam o sistema quando têm um camisa 10 talentoso que não cabe num 4-3-3 moderno. Defensivamente, costuma ser o jogador menos exigido na recomposição (geralmente fica de referência para a transição ofensiva), mas em times de pressing alto ele lidera a primeira linha de pressão junto com os dois atacantes.

**Centroavante (referência de área)**

**O ponto de fixação e finalizador (`consenso`).** Um dos dois homens de frente. Costuma ser o atacante mais 'de área' da dupla — referência física que segura a bola (jogo de costas, o chamado 'pivô ofensivo'), fixa a dupla de zaga adversária e finaliza os cruzamentos dos laterais e os passes do 10. O diamante o beneficia porque ele raramente fica isolado: tem o parceiro de ataque, o 10 chegando por trás e os interiores aparecendo na área. É a recompensa do sistema por ter empurrado tanta gente para o miolo — converte o domínio central em finalizações reais.

**Segundo atacante (parceiro móvel da dupla)**

**O atacante de ligação e movimento (`consenso`).** O outro homem de frente, normalmente mais móvel e associativo que o centroavante puro. Pode ser um segundo atacante clássico (que cai entre as linhas e combina), um atacante rápido que ataca a profundidade nas costas da zaga, ou um falso-9 que arrasta um zagueiro e abre espaço. A dupla funciona por complementaridade: um fixa, o outro circula. Esse jogador faz a 'sociedade' (parceria de ataque) que é a assinatura do 4-4-2 — diagonais cruzadas, tabelas curtas e a constante criação de dúvida sobre quem a zaga marca. No pressing, ele e o centroavante são a primeira linha de pressão, fechando o caminho da bola para os zagueiros adversários e empurrando a saída deles para os lados.

#### Forças

**1. Superioridade numérica no centro (`consenso`).** Quatro homens na coluna central (volante + 2 interiores + 10) costumam **sobrecarregar (overload) o meio** contra times que jogam com dois ou três meias. Isso significa mais um homem para receber, triângulos curtos por todo lado, e domínio de posse pelo miolo — o lugar mais perigoso do campo.

**2. Dois atacantes de verdade (`consenso`).** Diferente do 4-3-3/4-2-3-1 (um centroavante isolado), o diamante mantém uma dupla de ataque. Isso ocupa permanentemente os **dois zagueiros centrais adversários** (eles não podem sair para pressionar sem deixar um atacante livre) e multiplica as combinações na frente.

**3. Densidade e triângulos de passe (`consenso`).** A geometria do losango cria triângulos naturais em todas as direções (volante↔interior, interior↔10, 10↔atacante). Isso facilita a saída de pressão por dentro e dá muitas opções de passe curto — ótimo para times que querem controlar o jogo via posse.

**4. Habitat ideal para um camisa 10 (`consenso`).** Dá a um meia criativo o espaço e a liberdade que ele perde em sistemas mais rígidos. Para um dono de produto: quando você vir um time montar diamante, muitas vezes é porque ele tem um craque de meio que precisa de palco.

**5. Compactação defensiva central (`consenso`).** Sem bola, o losango vira um bloco central muito estreito e difícil de penetrar **por dentro**. Forçar o adversário a jogar só pelas pontas é, por si só, uma forma de defesa — atacar por fora gera menos gols que atacar por dentro.

**6. Chegada de muitos homens na área (`inferência` apoiada em `consenso`).** Em ataque organizado, é comum o diamante colocar 5 jogadores na frente: 2 atacantes + 10 + 2 interiores rompendo, além dos cruzamentos dos laterais. É uma das formações que mais 'enche a área'.

#### Fraquezas

**1. A largura abandonada — o pecado original (`consenso`).** Esta é A fraqueza que define o sistema. Sem pontas, os corredores laterais ficam vazios e a responsabilidade inteira de cobri-los recai sobre os laterais e, em cobertura, sobre os interiores. Contra um time que ataca bem pelos lados (com pontas abertas e laterais que dobram), o diamante **sofre superioridade 2-contra-1 na ponta** repetidamente. É a forma clássica de derrotar um diamante: puxar o jogo para fora, isolar o lateral, e cruzar/infiltrar.

**2. Distâncias horizontais grandes nas transições (`consenso`).** Quando o time perde a bola com os laterais subidos, há um corredor inteiro às costas deles e o losango está estreito no centro — distância grande para cobrir. Times de transição rápida (contra-ataque) exploram exatamente esse espaço de canto.

**3. O volante isolado (`consenso`).** Apenas um homem protege a frente da zaga. Contra um trio de meio adversário ou um 10 que ocupa a zona entre o volante e a zaga, esse jogador pode ser arrastado e o miolo abre. É o oposto da segurança do duplo pivô.

**4. Desgaste físico extremo (`consenso`).** Laterais e interiores correm absurdamente (subir e cobrir a largura, mais o miolo). Times que jogam diamante tendem a 'cair' no fim do jogo e nos finais de temporada se o elenco não tiver fôlego e profundidade — informação útil para ler jogos: um diamante cansado vaza pelos lados no segundo tempo.

**5. Saída de bola pressionável (`consenso`).** Sem largura na primeira fase, um pressing alto adversário (especialmente com pontas que travam os laterais) pode encurralar a construção por dentro e forçar erro perto da própria área.

**6. Dependência de perfis específicos (`inferência`).** O sistema só funciona com laterais-maratonistas, interiores box-to-box completos e um volante de leitura de elite. Faltando qualquer uma dessas peças, a fraqueza estrutural vira buraco escancarado. É uma formação 'cara' em termos de requisitos de elenco.

#### Matchups (boa contra / sofre contra)

**Pense sempre em termos de superioridade numérica por setor e de qual gap fica aberto (`consenso`).**

**É BOA contra (vence o miolo):**
- **Contra 4-4-2 em linha (clássico):** o diamante tem 4 meias contra 2 — **superioridade central clara (4v2 no eixo)**. Domina a posse no centro e atrai os volantes adversários, abrindo o 10. Matchup classicamente favorável ao diamante.
- **Contra 4-2-3-1 / duplo pivô:** o diamante geralmente põe 3-4 homens contra os 2 volantes adversários no centro e ainda fixa a zaga com 2 atacantes. Tende a dominar o meio, embora o trio ofensivo adversário (3 atrás do 9) possa atacar a largura.
- **Contra times que NÃO têm pontas / atacam por dentro:** aí o diamante joga no seu jogo — toda a batalha no eixo central, onde ele é superior. Anula a força do adversário e impõe a sua.
- **Contra 3-5-2 que descuida das pontas:** matchup de espelho no centro e nos dois atacantes; decide-se nos lados (laterais x alas).

**SOFRE contra (perde a largura):**
- **Contra 4-3-3 com pontas abertas e laterais ofensivos:** é o **kryptonita do diamante**. O 4-3-3 ataca exatamente os dois corredores que o losango abandona, gerando **2v1 na ponta** (ponta + lateral contra o lateral solitário do diamante). Para se defender, o diamante precisa puxar os interiores para fora — e ao fazer isso perde a sua própria superioridade central. Dilema sem boa saída.
- **Contra 4-2-3-1 com extremos rápidos e diretos:** os dois extremos atacam a largura cedida; o duplo pivô segura o miolo o suficiente para não ser totalmente dominado. Matchup desconfortável para o diamante.
- **Contra times de transição rápida / contra-ataque vertical:** exploram o espaço atrás dos laterais subidos no exato instante da perda da bola. O diamante perde a bola no meio adversário e leva o contragolpe pelo canto.
- **Contra 3-4-3 com alas (wing-backs):** os alas adversários atacam a largura e ainda há 3 zagueiros para a transição defensiva deles — combinação difícil para o diamante furar e perigosa para se defender.

**Regra-mãe para o produto (`consenso`):** o diamante **ganha onde concentra (centro)** e **perde onde abdica (lados)**. Todo confronto se resume a: o adversário consegue levar o jogo para a largura mais rápido do que o diamante consegue impor o jogo no centro? Quem vencer essa corrida vence o duelo tático.

#### Interações e automatismos

**As parcerias e automatismos que fazem o losango funcionar (`consenso`):**

**1. Lateral + interior (o automatismo que salva o sistema).** É a interação mais importante. Quando o lateral sobe, o interior do mesmo lado precisa fazer a **cobertura diagonal** para dentro-fora. Quando o lateral é ultrapassado, é o interior que tapa o buraco. Sem esse entrosamento, a largura abandonada vira gol sofrido. Em ataque, lateral e interior fazem **sobreposições (overlaps) e sub-posições (underlaps)** — o lateral por fora, o interior por dentro — para criar o 2v1 contra o lateral adversário e gerar o cruzamento.

**2. Volante que desce + laterais que sobem (a construção em 3).** Na saída de bola, o volante desce entre os zagueiros formando uma **linha de 3**, o que libera os dois laterais para subirem alto e darem a largura. É o mecanismo que transforma um 4-1-2-1-2 estático num shape ofensivo amplo. Esse movimento é o coração da fase de construção do diamante.

**3. Dupla de atacantes (a sociedade).** Um fixa (centroavante de costas), o outro circula (segundo atacante em movimento). Diagonais cruzadas, um abrindo espaço para o outro, tabelas curtas. É a assinatura ofensiva do 4-4-2 e o que justifica abrir mão da largura: você ganha um atacante a mais lá na frente.

**4. 10 + dupla de ataque (o trio criativo).** O camisa 10 liga o meio aos dois atacantes, jogando na zona 14. O automatismo é o 10 receber de frente para o gol e ter sempre dois movimentos de atacante para escolher (um na profundidade, um no apoio). É a fábrica de chances do sistema.

**5. Interiores que rompem + 10 + atacantes (encher a área).** No último terço, os dois interiores fazem corridas de ruptura (terceiro-homem) por dentro, somando-se ao 10 e aos dois atacantes — 5 homens atacando a área contra a defesa adversária. A coordenação dessas corridas (quem vai à primeira trave, quem segura, quem ataca o rebote) é o que converte domínio em gol.

**6. Volante + dupla de zaga (o seguro defensivo).** Como os laterais sobem, o bloco defensivo de emergência vira volante + 2 zagueiros (+ goleiro líbero). O entrosamento desse trio na cobertura de profundidade e largura é o que segura o time vivo nas transições.

#### Variações por fase (com bola / sem bola / placar)

**Como a forma muda na prática — declarada (4-4-2 losango no papel) vs. real (o que acontece em campo) (`consenso`):**

**Com bola (organização ofensiva) → vira algo como 2-3-5 ou 3-2-5.** Os laterais sobem para dar largura (virando alas/extremos improvisados), o volante desce entre/ao lado dos zagueiros, e os 5 homens da frente (2 atacantes + 10 + 2 interiores) atacam a área. O losango 'declarado' raramente aparece estático em ataque — ele se estica verticalmente e se alarga pelos laterais. A largura é **temporária e fornecida pelos laterais**, não pelo desenho de base.

**Sem bola (organização defensiva) → vira um bloco central compacto, geralmente um 4-4-2 estreito ou 4-1-2-1-2 comprimido.** O time fecha o centro, os interiores recuam e estreitam, e o 10 + os 2 atacantes formam a primeira linha de pressão (ou recuam para uma linha de meio se o bloco for baixo). O ponto fraco visível nesta fase: os **laterais ficam isolados** defendendo a largura, e quando o adversário troca o jogo de lado rápido, há um intervalo (a bola viaja mais rápido que a recomposição). Bloco alto = pressing agressivo no centro com risco nas costas; bloco baixo = aceita o jogo lateral do adversário e defende a área.

**Transição ofensiva (acabou de recuperar) → explosão pelo centro e pelos atacantes (`consenso`).** Como o time recupera a bola no miolo (onde tem gente), o contra-ataque sai por dentro, rápido, alimentando os dois atacantes e o 10. É um dos momentos mais fortes do diamante: muita gente perto da bola na recuperação central = transições verticais letais.

**Transição defensiva (acabou de perder) → o momento mais perigoso (`consenso`).** Se perde a bola com os laterais subidos, o time está com a largura totalmente exposta e o losango estreito. A reação tem que ser **contrapressing imediato no centro** (recuperar na hora, aproveitando a densidade central) — se o contrapressing falha e o adversário escapa para a ponta, o diamante leva o contra-ataque pelo corredor aberto. A escolha entre 'contrapressar para recuperar já' vs. 'recuar para proteger a largura' é a decisão tática que define se o time vaza ou não.

**Por estado de placar (`inferência` apoiada em `consenso`):** ganhando e protegendo resultado, o diamante tende a recuar o bloco e baixar os laterais, virando um 4-4-2 mais convencional e defensivo (sacrificando o domínio central pela segurança nos lados). Perdendo e precisando do gol, exagera a subida dos laterais e a chegada dos interiores — fica ainda mais 2-3-5, ganha poder ofensivo e fica ainda mais exposto às transições. Ler a altura dos laterais é a melhor pista visual do estado mental do time num diamante.

#### Exemplos de times e treinadores

**Times e treinadores que usaram bem o diamante (`consenso`; exemplos modernos marcados onde aplicável):**

- **Carlo Ancelotti — Milan (2004-2007):** o exemplo histórico canônico. O 'losango de Ancelotti' foi criado em parte para encaixar **Pirlo** como volante-armador (regista) na base, com **Gattuso** e **Seedorf** nos lados (interiores) e **Kaká** como o 10 voador na ponta, alimentando **Shevchenko/Inzaghi**. Mostrou o diamante no seu auge: domínio central absoluto e um 10 de classe mundial num habitat perfeito. Referência obrigatória.
- **Mauricio Pochettino — Southampton e fases do Tottenham (`consenso`):** usou o diamante para sobrecarregar o meio com pressing intenso, apoiado em interiores box-to-box de muito pulmão.
- **Maurizio Sarri — Napoli (fases) (`consenso`):** explorou a densidade de triângulos do losango para a sua posse curta e veloz por dentro.
- **Brendan Rodgers — Liverpool 2013-14 (`consenso`):** num período famoso, o Liverpool usou um diamante para potencializar **Suárez e Sturridge** como dupla e dar centro ao jogo — quase campeão inglês daquela temporada, ofensividade altíssima (e exatamente a vulnerabilidade defensiva lateral típica do sistema).
- **Diego Simeone — Atlético de Madrid (variações, `consenso`):** em certas fases usou o losango como bloco central compacto e agressivo, ressaltando o lado defensivo/de controle do sistema.
- **Antonio Conte (`consenso`):** ainda que mais associado a sistemas com três zagueiros, trabalhou variantes de meio-campo em losango com interiores de altíssima quilometragem — perfil que ele sempre valorizou.

**Leitura para o produto:** o diamante costuma reaparecer quando um time tem (a) um camisa 10 craque que não cabe num 4-3-3, (b) dois atacantes que se complementam bem, e (c) laterais e interiores de fôlego excepcional. Quando faltam esses ingredientes, o time abandona o sistema rápido — porque a fraqueza lateral fica impagável.

---

### 4-3-3

#### Resumo e viés

**O que é (consenso):** O 4-3-3 é uma formação com quatro defensores (dois zagueiros centrais + dois laterais), um meio-campo de três (um homem mais baixo + dois mais altos, OU dois homens baixos + um mais alto) e um tridente ofensivo (dois pontas/extremos abertos + um centroavante). É talvez a estrutura mais "natural" do futebol porque ocupa a largura máxima do campo em todas as linhas: laterais e pontas dão os quatro cantos, o trio de meio cobre o miolo.

**Jargão de largura:** "largura" = o quanto o time ocupa o campo de linha lateral a linha lateral. "Profundidade" = o quanto ocupa do próprio gol ao gol adversário. Um time que dá largura estica a defesa do oponente horizontalmente; um time que dá profundidade a estica verticalmente.

**Filosofia / viés:** O 4-3-3 não tem UM viés único — ele se desdobra em duas grandes famílias conforme onde fica o vértice do triângulo de meio:
- **4-3-3 com pivô único (1 volante + 2 interiores)** — vértice apontando pra TRÁS (`▽`). É a versão de **controle/posse** (a "escola Cruyff/Guardiola"). O pivô ancora, os dois interiores sobem. Domina a bola, prende o adversário no campo dele.
- **4-3-3 com duplo pivô + um 10** — vértice apontando pra FRENTE (`△`). Mais **reativo/equilibrado**: dois homens protegem a defesa, um meia mais avançado liga o jogo. Menos posse obsessiva, mais transição.

Na prática moderna o 4-3-3 é frequentemente o "rosto com a bola" de um time que sem a bola vira 4-4-2 ou 4-5-1 (explico em variações). É uma formação de **iniciativa**: pede um time tecnicamente bom que queira ter a bola, porque os três do meio precisam circular e os pontas precisam ganhar 1v1.

#### Papel de cada posição nesta formação

**Goleiro**

**Goleiro-linha (sweeper-keeper).** Num 4-3-3 de posse, o goleiro é o 11º jogador de saída de bola: joga alto, fora da área, varrendo o espaço nas costas da linha de defesa que sobe. Precisa jogar com os pés (passe curto pros zagueiros, passe quebra-linha quando o adversário pressiona). Jargão: 'sweeper-keeper' = goleiro que age como um líbero atrás da linha. Se o time for mais reativo, o papel encolhe pra goleiro tradicional, mas a saída de bola curta segue sendo pedida.

**Zagueiro central (x2)**

**Dupla de centrais com perfis complementares.** O ideal é um zagueiro mais 'cabeça' (forte no jogo aéreo, na marcação do centroavante, na linha) e um mais 'pé' (bom de saída, sobe conduzindo). Na saída de bola eles abrem (a dupla se afasta pra abrir ângulos), o pivô desce entre eles às vezes (vira saída em 3). Defensivamente, como o 4-3-3 deixa os laterais subirem, os centrais cobrem MUITO espaço nas diagonais: quando um lateral avança, o central daquele lado tem de defender a faixa que sobrou. Precisam de velocidade pra linha alta.

**Lateral (x2)**

**Lateral ofensivo que dá a largura.** Aqui mora uma decisão tática central do 4-3-3: como os pontas costumam jogar abertos e por DENTRO (cortando pro meio), quem dá a largura na ponta é o lateral, que sobe por fora (overlap = ultrapassagem por fora do ponta). Alternativa moderna: o **lateral invertido** (inverted full-back) — entra pra dentro e vira um terceiro homem de meio na saída, deixando a largura toda pro ponta. Defensivamente o lateral é o ponto mais exposto do 4-3-3: quando ele está lá em cima e a bola é perdida, sobra a faixa inteira atrás dele (gap clássico do 4-3-3, detalho em fraquezas/transição).

**Volante / pivô (single pivot ou x2)**

**O cérebro defensivo da formação.** No 4-3-3 de pivô único, é o jogador mais importante: senta na frente dos centrais (jargão: 'pivô' ou 'número 6'), recebe de costas pro jogo, gira e distribui, e é o seguro contra contra-ataques. Ele cobre o buraco central que os dois interiores deixam ao subir. Na variante de duplo pivô, são dois '6': um mais destruidor (marca, intercepta) e um mais construtor (sai jogando, lança). O pivô único exige um jogador de elite porque sozinho ele cobre uma largura enorme do miolo — se ele for driblado ou superado, a defesa fica exposta de frente.

**Mezzala / interior (x2)**

**Os dois interiores (números 8) — o motor do 4-3-3 de posse.** 'Mezzala' (italiano, 'meia-ala') = interior que joga nos meios-espaços (half-spaces = os corredores entre o centro e a linha lateral). Eles fazem a ligação: descem pra receber, sobem pra chegar na área, ocupam o espaço entre a linha de meio e a defesa do adversário (jargão: 'jogar entrelinhas'). São box-to-box obrigatórios — percorrem o campo todo. Um costuma ser mais chegador (gols, última linha) e outro mais armador (recebe, conduz, abre o jogo). Quando os laterais sobem por fora, os interiores seguram o meio; quando o lateral fica, o interior pode atacar a área.

**Meia-armador / 10 (apenas na variante 4-3-3 com △)**

**O ligador, quando o triângulo aponta pra frente.** Na versão com duplo pivô, o terceiro homem de meio é um meia mais avançado (número 10) que joga entre as linhas, recebe de frente pro gol e alimenta o tridente. Esta variante é meio caminho pro 4-2-3-1. Esse 10 dá criatividade mas custa equilíbrio: ele não volta tanto, então os dois pivôs precisam dar conta da defesa do meio sozinhos.

**Extremo / ponta (x2)**

**O 1v1 e a ameaça de profundidade.** Os dois pontas são a assinatura do 4-3-3. Dois arquétipos: (a) **ponta invertido** — canhoto na direita / destro na esquerda, abre pra receber e CORTA pro meio pra finalizar ou tabelar (Salah, Mbappe); (b) **ponta clássico/de linha** — fica colado na linha, leva o lateral pro fundo e cruza. O ponta invertido pede que o lateral suba por fora pra dar a largura; o ponta de linha já dá a largura sozinho. Sem bola, os pontas são a primeira linha de pressão e precisam recuar pra ajudar o lateral (é aí que o 4-3-3 vira 4-5-1).

**Centroavante**

**O ponto de referência ofensivo.** Três perfis possíveis num 4-3-3: (a) **9 de área / target man** — segura a bola de costas, ganha no alto, fixa os dois zagueiros pra abrir espaço pros interiores e pontas; (b) **9 móvel / falso 9** — desce pra receber entre as linhas, arrasta um zagueiro junto e abre o buraco central pros pontas invertidos invadirem (a inovação Messi/Guardiola); (c) **9 de profundidade** — vive nas costas da linha, ataca o espaço. A escolha do 9 muda a formação toda: um target man pede cruzamentos (laterais por fora); um falso 9 pede pontas que invadem o miolo.

#### Forças

**1. Largura e ocupação total do campo (consenso).** Com laterais + pontas, o 4-3-3 ocupa os quatro cantos do campo e estica a defesa adversária horizontalmente. Isso cria 1v1 nas pontas e abre os meios-espaços pros interiores. Um bloco baixo que se fecha no centro deixa as faixas; um bloco que abre pra cobrir as faixas deixa o miolo. O 4-3-3 força essa escolha.

**2. Triângulos por todo lado (organização ofensiva).** A geometria do 4-3-3 gera triângulos naturais em cada setor: lateral-interior-ponta de um lado, pivô-zagueiros atrás, interior-ponta-centroavante na frente. Triângulo = sempre tem duas opções de passe pro portador (jargão: 'terceiro homem'). Isso facilita a circulação e a saída sob pressão.

**3. Pressão alta coordenada (organização defensiva).** O tridente dá uma primeira linha de três que pode pressionar a saída de bola adversária homem-a-homem nos dois zagueiros + goleiro, enquanto os interiores sobem nos volantes do oponente. É uma das melhores estruturas pra pressing alto e contrapressing (jargão: 'gegenpressing' = recuperar a bola imediatamente após perdê-la, no lugar). PPDA baixo (passes permitidos por ação defensiva — quanto menor, mais agressiva a pressão) é típico do 4-3-3 de elite.

**4. Superioridade central via interiores.** Os dois números 8 chegando entre linhas dão superioridade numérica no último terço contra defesas de quatro, que têm só dois centrais pra controlar 9 + 2 interiores que invadem.

**5. Transição ofensiva rápida e vertical.** Ao recuperar, o time já tem três atacantes posicionados na frente — sem precisar de muita gente subir, dá pra atacar em 5-7 segundos pelo ponta que sai em velocidade ou pelo 9 nas costas da linha.

#### Fraquezas

**1. As faixas atrás dos laterais (o gap mais explorado).** Quando os laterais sobem (e no 4-3-3 ofensivo eles sobem muito), sobra a faixa inteira atrás deles. Se o time perde a bola lá em cima, o adversário ataca esse espaço com o ponta dele em velocidade contra um central que precisa sair pra fora — abrindo o centro. É o calcanhar de Aquiles clássico do 4-3-3. Times que jogam 4-3-3 sofrem com **transições pelas pontas**.

**2. O pivô único isolado (inferioridade no miolo às vezes).** Contra formações com três no meio mais um 10 (ou com dois 10), o único pivô pode ficar 1 contra 2 no centro. Se ele é atraído pra um lado, abre o corredor central. Por isso o pivô único exige um jogador excepcional ou os interiores têm de baixar — o que tira poder ofensivo.

**3. Distância entre os interiores e o pivô.** Se os dois 8 sobem juntos e o time perde a bola, há um vácuo enorme entre o pivô (sozinho lá atrás) e o trio de frente. O adversário joga nesse 'entre-linhas' e ataca com tempo e espaço (jargão: 'espaço entre linhas' = a faixa entre a linha de meio e a linha de defesa; quanto maior, mais perigoso pro adversário).

**4. Dependência do 1v1 dos pontas.** Se os pontas não ganham seus duelos individuais, o ataque pela largura trava e o time fica previsível (só circula sem furar). O 4-3-3 'reativo' sem pontas drible-positivos vira estéril.

**5. Linha alta vulnerável a bolas nas costas.** A pressão alta exige linha de defesa adiantada; um lançamento por cima da linha pra um 9 rápido vira 1v1 com o goleiro. Por isso o sweeper-keeper e os centrais velozes são pré-requisito, não luxo.

#### Matchups (boa contra / sofre contra)

**Por setor, a lógica é: contar homens por faixa (defesa/meio/ataque) e ver quem tem +1.**

**Bom contra 4-4-2 (consenso forte):**
- *Meio:* o 4-3-3 tem 3 contra 2 no miolo. Superioridade numérica central = o trio circula livre, o pivô recebe sem marcação (os dois atacantes do 4-4-2 não cobrem ele). Esse é o matchup-modelo a favor do 4-3-3.
- *Pontas:* os dois meias do 4-4-2 têm de escolher entre marcar o ponta ou o lateral que sobe — sempre sobra um. 2v1 na faixa.
- *Risco:* o 4-4-2 ataca exatamente as faixas atrás dos laterais com seus dois atacantes abrindo.

**Bom contra 4-2-3-1 / 4-5-1 em bloco baixo (com nuance):**
- O 4-3-3 domina a bola, mas precisa furar um bloco compacto. A vantagem vem dos interiores entre linhas e da largura. Sem cruzamento bom ou ponta decisivo, pode emperrar.

**Equilibrado / disputado contra outro 4-3-3:**
- Vira espelho: 3v3 no meio, lateral-vs-ponta nas faixas. Decide quem ganha os 1v1 individuais e quem controla a profundidade. Jogo de detalhes (qualidade do pivô, agressividade da pressão).

**Sofre contra 3-5-2 / 3-4-3 (gap clássico):**
- *Faixas:* o adversário tem **alas (wing-backs)** que atacam justamente as costas dos laterais do 4-3-3. Como o 4-3-3 só tem um homem por faixa lateral, o ala do 3-5-2 pode criar 2v1 com o interior/segundo atacante. Esse é o matchup mais desconfortável.
- *Meio:* o 3-5-2 pode botar 3 no meio também (ou 5 com os alas), igualando ou superando o trio. O pivô único do 4-3-3 fica pressionado.
- *Defesa:* contra dois atacantes do 3-5-2, os dois centrais do 4-3-3 ficam 2v2 sem cobertura — perigoso na transição.
- *Contramedida:* o 4-3-3 responde mandando o ponta marcar o ala (vira 4-5-1) ou o interior dobrar — mas isso custa poder ofensivo.

**Sofre contra times de transição direta (counter-attacking):** qualquer formação que aceite ceder a bola e atacar o espaço atrás dos laterais explora a fraqueza estrutural número 1.

#### Interações e automatismos

**1. Lateral + ponta: quem dá a largura?** A interação mais importante do 4-3-3. Duas soluções:
- **Ponta invertido + lateral por fora (overlap):** o ponta corta pra dentro pro meio-espaço, o lateral ultrapassa por fora pra dar a largura e cruzar. Cria 2v1 contra o lateral adversário.
- **Ponta de linha + lateral por dentro (lateral invertido / underlap):** o ponta segura a largura, o lateral entra pra dentro pra virar terceiro homem de meio ou fazer o 'underlap' (ultrapassagem por DENTRO). Solução Guardiola.
Os dois nunca devem ocupar a mesma faixa ao mesmo tempo — senão o time fica estreito e previsível.

**2. Pivô + dois interiores: a 'gangorra' do meio.** Quando os 8 sobem, o pivô segura; quando o pivô é atraído, um 8 baixa pra cobrir. É um sistema de rotação constante pra nunca deixar o centro vazio. Sem essa coordenação, vira a fraqueza 3 (vácuo entre linhas).

**3. Falso 9 + pontas invertidos: o automatismo que reinventou o 4-3-3.** O 9 desce pra receber, arrasta um central com ele; o buraco aberto na linha é invadido pelos pontas cortando pra dentro em diagonal. Foi o coração do Barcelona de Guardiola. Exige timing milimétrico entre os três.

**4. Pivô descendo entre os zagueiros (saída em 3).** Na construção, o pivô baixa pra formar uma linha de 3 com os centrais, liberando os laterais pra subir. Vira um 3-2-5 ou 3-4-3 com a bola. Automatismo padrão do 4-3-3 de posse.

**5. Contrapressing do tridente.** Ao perder a bola no campo ofensivo, os três da frente + interiores fecham o portador imediatamente (5 homens próximos) pra recuperar antes que o adversário organize a transição — compensando a fraqueza das faixas.

#### Variações por fase (com bola / sem bola / placar)

**COM A BOLA (organização ofensiva):** O 4-3-3 declarado raramente fica 4-3-3 na posse. As metamorfoses típicas:
- **Vira 3-2-5 / 2-3-5:** o pivô (ou um lateral invertido) desce/entra pra formar uma base de 3-2 atrás, enquanto os dois laterais e os três de frente formam uma linha ofensiva de 5 que ocupa os cinco corredores (duas faixas + dois meios-espaços + centro). É o shape de ataque posicional moderno.
- **Vira 3-4-3:** com os dois laterais virando alas e o pivô entre os centrais.
O objetivo: ocupar os 5 corredores na última linha pra esticar a defesa adversária ao máximo.

**SEM A BOLA (organização defensiva):** Aqui o viés muda conforme a altura do bloco:
- **Bloco alto / pressing:** mantém o 4-3-3, tridente pressiona a saída adversária, interiores sobem nos volantes. PPDA agressivo.
- **Bloco médio/baixo:** vira **4-5-1** — os dois pontas recuam pra linha de meio (viram quase laterais de contenção), o 9 fica isolado na frente. Compacta o centro e protege as faixas. Esse é o 'rosto defensivo' mais comum do 4-3-3.
- **Ou vira 4-4-2:** um interior sobe junto do 9 e o outro recua, fechando duas linhas de 4.

**POR ESTADO DE PLACAR (declarada vs real — jargão: a formação 'declarada' é a do papel; a 'real' é a que aparece em campo conforme o contexto):**
- **Ganhando / fechando o jogo:** afunda pro 4-5-1 ou até 4-1-4-1, baixa o bloco, abre mão da posse, segura as faixas. Vira reativo mesmo sendo declarado ofensivo.
- **Perdendo / precisando:** empurra os laterais, sobe o bloco, o pivô único fica ainda mais exposto, frequentemente sacrifica o 6 por mais um atacante (vira 4-2-3-1 ou 3-4-3 ofensivo). Aceita o risco nas costas em troca de mais gente na área.
- **Empate buscado fora de casa:** tende a viver no 4-5-1 compacto, cedendo a bola e apostando na transição pelos pontas (liga com a hipótese de under do dono do produto quando o time visitante prioriza segurança).

#### Exemplos de times e treinadores

**Pep Guardiola — Barcelona (2008-2012):** o 4-3-3 definitivo de posse. Pivô único (Busquets), interiores Xavi/Iniesta, falso 9 (Messi) com pontas invertidos. Referência máxima do 4-3-3 de controle, contrapressing e saída de bola. (consenso)

**Jurgen Klopp — Liverpool (2018-2022):** 4-3-3 de gegenpressing e transição vertical. Pontas que viram quase atacantes (Mane/Salah), 9 que liga (Firmino, um falso-9 funcional), laterais ofensivos (Alexander-Arnold/Robertson) que davam quase toda a largura e os assists. Mostra o 4-3-3 mais direto e intenso, oposto da posse pura. (consenso)

**Luis Enrique — Barcelona (2015) e Espanha/PSG:** 4-3-3 com tridente de finalizadores (MSN: Messi-Suarez-Neymar), menos posse estéril, mais verticalidade no último terço. (consenso)

**Carlo Ancelotti — Real Madrid (2022-2024):** 4-3-3 pragmático que vira 4-4-2 sem bola, com meio-campo equilibrado (Kroos-Modric-Casemiro/Valverde) e pontas/9 letais na transição. Exemplo do 4-3-3 'controle reativo' de elite — domina sem precisar de PPDA extremo. (consenso)

**Seleção da Holanda / escola Cruyff:** raiz histórica do 4-3-3 como filosofia (Total Football), origem dos conceitos de largura, triângulos e pressão. (consenso)

**Observação (verificado por domínio, não por fetch — rótulo: consenso):** os exemplos de jogadores específicos (Salah, Mbappe etc.) são ilustrativos do arquétipo de ponta invertido; não foram confirmados via WebSearch nesta entrega.

---

### 4-2-3-1

#### Resumo e viés

O **4-2-3-1** é, junto do 4-3-3, a formação mais equilibrada e popular do futebol moderno. A leitura dos números, de trás pra frente: **4** defensores (2 zagueiros + 2 laterais), **2** volantes (o chamado *duplo pivô* — dois meias de contenção lado a lado logo à frente da defesa), **3** meias ofensivos (dois pontas/extremos abertos + um meia-armador/camisa 10 central), e **1** centroavante isolado na ponta de lança.

A filosofia central é o **equilíbrio com viés de controle**: a base de seis jogadores (4 defensores + 2 volantes) é numerosa e estável o suficiente para travar o adversário, enquanto os quatro de cima (3+1) dão criatividade e presença ofensiva. É uma formação *modular* — você ajusta o caráter (mais ofensiva ou mais reativa) só mudando o perfil dos jogadores e a altura das linhas, sem trocar o desenho. Por isso treinadores tão diferentes a usam.

O DNA do 4-2-3-1 é a **segurança do duplo pivô**. Com dois homens na frente da zaga, a formação raramente fica exposta em transição (o momento perigoso logo após perder a bola), porque sempre sobra um volante de cobertura enquanto o outro pressiona. Isso a torna a formação predileta de quem valoriza *não tomar contra-ataque*. O preço disso aparece na criação: como há um homem a menos no ataque comparado a um 4-3-3 com falso-9 ou a um 4-4-2, muito da produção ofensiva depende do brilho individual do camisa 10 e dos pontas em 1x1.

**Viés**: tende ao **controle reativo** na versão clássica (duplo pivô protege, ataque depende de qualidade individual) ou ao **controle proativo** na versão moderna com laterais que invertem e volante que sobe — aí ela se aproxima de um 3-2-5 com bola.

#### Papel de cada posição nesta formação

**Goleiro**

No 4-2-3-1 moderno o goleiro precisa ser **goleiro-líbero** (sweeper-keeper): joga adiantado, com a linha defensiva alta, para varrer bolas nas costas dos zagueiros e ser a saída de bola sob pressão. Com o duplo pivô recuando para receber, o goleiro frequentemente forma um trio de construção (2 zagueiros + goleiro = 3 contra a primeira linha de pressão adversária). Na versão mais reativa, basta ser bom de área e jogo aéreo, já que a equipe defende mais baixa. Distribuição com o pé é cada vez mais inegociável.

**Lateral (direito e esquerdo)**

Posição **mais variável** da formação — define o caráter ofensivo do 4-2-3-1. Como os três meias ofensivos ocupam o centro e os corredores intermediários, os laterais costumam ser a **única largura natural** quando os pontas vêm por dentro. Três arquétipos: (1) **lateral-volante (overlapping fullback)** que sobe pela linha de fundo para dar amplitude e cruzar; (2) **lateral-invertido (inverted fullback)** que entra para dentro virando um terceiro homem de meio-campo ao lado do duplo pivô — desenho típico do Guardiola, que transforma o 4-2-3-1 num 3-2-5 com bola; (3) **lateral-conservador** que sobe pouco e prioriza não deixar o ponta adversário sozinho nas costas. A escolha aqui é o maior trade-off da formação: largura ofensiva vs. proteção das costas em transição.

**Zagueiro central (dupla de zaga)**

Dois zagueiros centrais clássicos. Como há **duplo pivô protegendo**, a dupla de zaga raramente fica isolada em inferioridade — esse é o conforto estrutural do 4-2-3-1. Idealmente complementares: um mais **agressivo/avançado** (sai na marcação, antecipa, ganha o duelo no centroavante adversário) e um mais **posicional/cobertura** (lê a profundidade, varre as costas). Com linha alta, precisam de velocidade ou de um goleiro-líbero compensando. Na saída de bola, abrem para receber do goleiro e progridem a bola até encontrar o pivô ou o meia entre linhas.

**Volante / Pivô (o duplo pivô — dois jogadores)**

**Coração da formação.** Os dois '2' são o que distingue o 4-2-3-1 de quase tudo. Em vez de um único volante isolado (como no 4-3-3 com pivô único), são **dois lado a lado**, o que cria cobertura mútua permanente: quando um sobe ou pressiona, o outro segura a posição. Há duas configurações: (1) **duplo pivô simétrico** — dois box-to-box/duelistas que se revezam; (2) **duplo pivô assimétrico/dividido** — um **6 puro** (volante de contenção, âncora à frente da zaga, distribui curto e protege o centro: o 'Busquets/Rodri') e um **8 avançado** (volante que chega à área, faz a ligação com o 10 e os pontas: o 'box-to-box'). É o setor que blinda contra transições e que organiza o início da posse. A qualidade do duplo pivô na progressão da bola (driblar a primeira linha de pressão por dentro) determina se a equipe sufoca jogando ou só se defende.

**Meia-armador / Camisa 10**

O **cérebro criativo** e o jogador mais característico do 4-2-3-1. Posiciona-se **entre linhas** — no espaço entre o meio-campo e a zaga adversários, a 'zona 14', o ponto mais perigoso do campo. Sua função é receber de costas ou de meia-volta nesse espaço, virar o jogo e municiar pontas e centroavante com o último passe. No 4-2-3-1 ele é frequentemente o teto criativo do time: como há só um centroavante e os pontas atacam o gol, **muito da geração de chances passa pelos pés do 10**. Versões modernas pedem que ele também pressione (vira primeiro defensor sobre o pivô adversário) e flutue para os lados para criar superioridade. Se o 10 some, o 4-2-3-1 vira estéril — é a maior dependência individual da formação.

**Extremo / Ponta (direito e esquerdo)**

Os dois pontas dos '3'. Dois arquétipos definem como o time ataca: (1) **ponta invertido (inverted winger)** — canhoto na direita / destro na esquerda, corta para dentro no pé bom para finalizar ou combinar, deixando a largura para o lateral subir por fora; é o padrão do 4-2-3-1 ofensivo moderno (Salah, Mbappé). (2) **ponta de linha (clássico)** — joga aberto, encara o lateral em 1x1 e cruza para o centroavante. Os pontas também são peça-chave **sem bola**: na organização defensiva eles recuam para formar um bloco de quatro no meio (o 4-2-3-1 vira 4-4-1-1 ou 4-4-2 defensivo), travando os corredores e dobrando a marcação no lateral adversário. A produtividade de gols dos pontas é o que compensa ter só um centroavante.

**Centroavante / Ponta de lança**

O **'1'** — atacante solitário lá na frente. Por jogar isolado contra dois zagueiros, precisa de um perfil completo: ou um **9 de referência/pivô** (segura a bola de costas, protege, fixa os dois zagueiros e espera a chegada do 10 e dos pontas — joga em inferioridade no ar e no físico), ou um **9 móvel/de profundidade** que ataca o espaço nas costas da linha alta e finaliza os passes do 10. Sem bola, é o **primeiro a pressionar**, orientando a saída de bola adversária para um lado e cobrindo a linha de passe para o pivô. É a posição mais ingrata da formação: pouca bola, muita marcação a fazer, e a cobrança de finalizar as poucas chances que sobram.

#### Forças

**1. Solidez em transição defensiva (a maior força).** O duplo pivô garante que, ao perder a bola, quase nunca o adversário acha um corredor central livre. Enquanto um volante vai à pressão (contrapressing), o outro segura a posição, dando tempo para a equipe recompor. Isso faz do 4-2-3-1 a escolha natural de quem quer **não sofrer contra-ataque**.

**2. Compactação defensiva fácil.** Sem bola, os pontas baixam e a formação vira um **4-4-1-1 / 4-4-2** com dois blocos de quatro bem alinhados — um dos blocos defensivos mais simples de organizar do futebol. Cobre bem a largura e o centro ao mesmo tempo.

**3. Ocupação da 'zona 14' (entre linhas).** O camisa 10 ocupa permanentemente o espaço mais perigoso do campo. Se ele é bom e o time consegue achá-lo, a formação gera as melhores chances de todas — bola na frente da zaga, encarando o gol.

**4. Superioridade central na saída de bola.** Goleiro + 2 zagueiros + 2 volantes = até 5 homens para construir contra a primeira linha de pressão. Raramente um time consegue pressionar isso em igualdade sem se expor.

**5. Modularidade.** A mesma estrutura serve para jogar reativo (linhas baixas, contra-ataque) ou proativo (laterais invertidos, 3-2-5 com bola). Treinador troca o caráter sem trocar o desenho.

**6. Clareza de funções.** Cada jogador tem um papel nítido — bom para times que precisam de previsibilidade e para encaixar craques (o 10 e os pontas) num esqueleto seguro.

#### Fraquezas

**1. Dependência crônica do camisa 10.** Como só há um centroavante e o ataque é construído pelo meio, se o 10 é marcado fora do jogo (um volante adversário cola nele) ou está num dia ruim, **a criação seca**. É a fragilidade estrutural número um.

**2. Buraco entre o duplo pivô e o trio ofensivo.** Há frequentemente uma **lacuna vertical** entre os dois volantes e os três da frente — os '2' ficam mais recuados, os '3' mais subidos. Se a ligação não funciona, o time fica **partido em dois blocos** (6 atrás, 4 na frente) e a bola não chega limpa ao ataque.

**3. Centroavante isolado.** O '9' luta sozinho contra dois zagueiros. Em jogo de posse contra bloco baixo, ele fica sem apoio e sem espaço; a equipe precisa que os pontas e o 10 cheguem rápido, ou o ataque morre na fixação.

**4. Vulnerabilidade nas costas dos laterais.** Quando os laterais sobem para dar a largura que os pontas invertidos não dão, sobram **dois corredores externos** nas suas costas. Times com pontas rápidos exploram exatamente esse espaço na transição.

**5. Inferioridade numérica no meio contra três meio-campistas.** Esta é a fraqueza tática mais explorável: os **2** volantes do 4-2-3-1 enfrentam **3** meias de um 4-3-3 ou 4-1-2-3. O time do 4-2-3-1 fica em **2v3 no meio**, perde a posse central e é obrigado a fazer o 10 baixar para ajudar — o que tira o time da força criativa.

**6. Pressão alta exige os pontas correndo muito.** Se o time quer pressionar no campo do adversário, depende de pontas que defendam o lateral adversário e voltem. Pontas de pouca entrega defensiva (craques ofensivos puros) deixam o bloco furado pelas laterais.

#### Matchups (boa contra / sofre contra)

**Pensar matchup no 4-2-3-1 = contar homens por setor (defesa/meio/ataque) e achar o setor onde ele fica em inferioridade ou onde o rival deixa um gap.** O setor decisivo do 4-2-3-1 é quase sempre o **meio-campo (os 2 volantes)**, porque é ali que ele pode ficar em 2v3.

**Contra 4-3-3 / 4-1-2-3 (sofre).** O confronto clássico que expõe o 4-2-3-1. O 4-3-3 tem **3 no meio contra os 2 volantes** → 3v2, superioridade central do adversário. Eles giram a bola no meio, atraem o 10 do 4-2-3-1 para baixo (deixando a 'zona 14' vazia) e dominam a posse. O 4-2-3-1 só sobrevive se o 10 marca um dos três meias (virando 4-4-2 ao defender) e aposta na transição rápida pelos pontas. **Veredito: confronto desfavorável no controle; favorável se você aceita ser reativo e contra-atacar.**

**Contra 4-4-2 clássico (bom).** Aqui o 4-2-3-1 **ganha o meio**: 2 volantes + o 10 = 3 homens contra os 2 meias centrais do 4-4-2 → 3v2 a favor. O 10 joga livre entre as linhas porque o 4-4-2 não tem um meia central para marcá-lo (os dois centrais ficam ocupados com os volantes). **Esse é o matchup-rei do 4-2-3-1** — uma das razões históricas de ele ter aposentado o 4-4-2 como padrão. **Veredito: favorável.**

**Contra 4-2-3-1 (espelho, neutro).** Jogo de espelho: cada setor se anula (2v2 no pivô, 10 contra 10, pontas contra laterais). Decide-se nos **detalhes** — qualidade do 10, quem ganha o duelo ponta-invertido vs. lateral, e bola parada. Tende a ser um jogo travado e equilibrado, frequentemente de poucos gols quando os dois respeitam o bloco.

**Contra 3-5-2 / 3-4-2-1 (matchup de incógnita).** Aqui a chave são os **lados**. O 3-5-2 tem alas (wing-backs) que atacam os corredores; o 4-2-3-1 tem lateral + ponta para responder. No centro, o 3-5-2 tem 3 meias contra 2 volantes (3v2) — de novo inferioridade central para o 4-2-3-1. Mas o 4-2-3-1 pode achar espaço **entre o ala e o zagueiro lateral do trio** com o ponta atacando esse canal. **Veredito: equilibrado, decidido pelos lados e pela qualidade dos alas vs. laterais.**

**Contra bloco baixo (5-4-1 / 4-5-1 defensivo).** O 4-2-3-1 atacante sofre o problema do **centroavante isolado**: pouco espaço, '9' sozinho contra 3-5 defensores. Precisa que laterais invertam, o pivô suba e a formação vire 3-2-5 para sobrecarregar a defesa. **Veredito: depende da capacidade de criar superioridade nas pontas; sem isso, esbarra.**

**Resumo dos gaps:** o 4-2-3-1 **brilha quando o adversário tem só 2 no meio** (4-4-2) e **sofre quando tem 3** (4-3-3, 3-5-2). O gap que ele oferece é nas **costas dos laterais** (quando sobem) e na **lacuna vertical entre pivô e trio**.

#### Interações e automatismos

**1. Os dois volantes (cobertura mútua) — o automatismo-mãe.** Tudo no 4-2-3-1 começa aqui. A regra de ouro é **nunca os dois saírem ao mesmo tempo**: quando um avança/pressiona, o outro automaticamente recua para a posição de cobertura. Esse 'gangorra' do duplo pivô é o que torna a formação tão segura. No 4-2-3-1 dividido (6 + 8), o 6 fica de âncora e o 8 tem liberdade de subir — interação assimétrica e mais dinâmica.

**2. Camisa 10 + centroavante (a dupla criativa-finalizadora).** O 10 recebe entre linhas; o 9 ou segura/devolve (tabela) ou ataca o espaço que o 10 abriu. Quando o 9 desce para receber, o 10 ataca a profundidade no lugar dele — **trocas de posição (rotações) verticais** que confundem a zaga adversária. Sem esse entrosamento, o 9 fica isolado.

**3. Ponta invertido + lateral (a dupla de corredor — automatismo central da largura).** Como o ponta corta para dentro, o lateral **deve** subir por fora para dar a largura — eles ocupam o mesmo corredor em alturas diferentes e se revezam. Se ambos vão para dentro, o time perde a largura; se ambos ficam abertos, perde gente no meio. A sincronia ponta-dentro / lateral-fora é o que faz o lado do campo funcionar.

**4. Lateral invertido + duplo pivô (o truque do controle moderno).** Quando o lateral entra para dentro ao lado dos volantes, cria-se um **trio de meio-campo com bola** (2+1), resolvendo a inferioridade 2v3 contra os 4-3-3 e blindando ainda mais a transição. É o que transforma o 4-2-3-1 num 3-2-5 ofensivo. Padrão Guardiola/Arteta.

**5. 10 baixando para virar duplo pivô + trio (ajuste defensivo).** Sem bola, o 10 frequentemente cola no volante adversário, virando o 4-2-3-1 num **4-4-2** ou **4-1-4-1** defensivo — esse deslizamento do 10 entre 'criar' e 'marcar o pivô rival' é a engrenagem que decide se o time empata a posse no meio.

**6. Pontas recuando para o bloco de 4 (compactação).** Na defesa, os dois pontas baixam para a linha do meio formando os dois blocos de quatro. É o automatismo que dá a estabilidade do 4-4-1-1 defensivo.

#### Variações por fase (com bola / sem bola / placar)

**Com bola (organização ofensiva) — a forma DECLARADA 4-2-3-1 quase nunca é a forma REAL.** Na construção, a formação se reconfigura:
- **Versão de controle (Guardiola/Arteta):** um lateral inverte para o meio → vira **3-2-5** (3 atrás na linha de construção, 2 volantes, 5 no último terço: 2 pontas + 10 + 9 + lateral que sobe). O 10 e o 9 ocupam a zona central, os pontas abrem a defesa. É o desenho que sobrecarrega o último terço.
- **Versão com laterais por fora:** ambos laterais sobem, pontas por dentro → **2-4-4** arriscado / **2-3-5** na posse máxima, deixando só os 2 zagueiros atrás (vulnerável em transição, mas devastador no ataque posicional).

**Sem bola (organização defensiva).** O 4-2-3-1 declarado vira:
- **4-4-1-1** (mais comum): pontas baixam para a linha de 4, o 10 fica meio-passo à frente do bloco vigiando o pivô adversário, o 9 sozinho na frente. Bloco compacto, dois banco de quatro.
- **4-2-3-1 alto (pressing):** o 9 e o 10 pressionam os zagueiros/pivô adversário, pontas sobem nos laterais → bloco alto, PPDA baixo (poucos passes permitidos antes de pressionar). Exige muita entrega dos pontas.
- **4-1-4-1:** quando o time quer matar o meio contra um 4-3-3, um volante baixa entre os zagueiros, o outro sobe para a linha de 4 com o 10 e os pontas.

**Por estado de placar (forma declarada vs. real).**
- **Ganhando / segurando:** os laterais param de subir, os pontas viram alas defensivos, o bloco baixa → vira um **4-5-1 / 4-4-1-1 reativo** que aposta tudo na transição pelo 9 e pelo ponta mais rápido. A 'cara' ofensiva some.
- **Perdendo / precisando do gol:** o duplo pivô vira **pivô único** na prática (um volante sai e sobe), o time empurra laterais e vira **4-1-3-2 / 4-2-4** improvisado, aceitando o risco de transição. Frequentemente entra um segundo atacante para tirar o 9 da solidão.
- **Empate buscado fora de casa:** mantém o duplo pivô intacto, baixa as linhas, e o 10 recua mais para defender — a formação fica no seu modo mais conservador e de poucas chances concedidas.

**Leitura para o produto:** ver '4-2-3-1' na escalação diz pouco sobre como o time **realmente** joga. O sinal que importa é o **perfil dos laterais** (invertem? sobem por fora? ficam?) e do **duplo pivô** (dois iguais ou 6+8?) — são essas duas escolhas que definem se o jogo será de controle/posse (tende a more bola, ataque posicional) ou reativo/transição (tende a contra-ataque, jogo mais aberto e direto)."

#### Exemplos de times e treinadores

**Real Madrid de Ancelotti (2021-2024)** — talvez o melhor exemplo do 4-2-3-1 *reativo de elite*: duplo pivô com um 6 posicional e um 8 chegador, transição fulminante pelos pontas e pelo centroavante, vencendo Champions sendo letal exatamente no momento de recuperar a bola. Mostra a força máxima da transição defensiva→ofensiva da formação.

**Bayern de Munique (era Heynckes 2013 e Ancelotti)** — 4-2-3-1 clássico com pivô duplo sólido, pontas invertidos rápidos e um 10 criativo; modelo de equilíbrio entre controle e ataque pelos lados.

**Arsenal de Arteta (2022-2025)** — exemplo do 4-2-3-1 *moderno de controle*: lateral invertido (Zinchenko/White entrando para o meio) transformando a forma em 3-2-5 com bola, resolvendo a inferioridade no meio e blindando a transição. Aula de como deixar o 4-2-3-1 proativo.

**Manchester City de Guardiola (em várias temporadas)** — usou o 4-2-3-1 como base que vira 3-2-5 / 3-box-2, com laterais invertidos e o '10' (De Bruyne/Bernardo) entre linhas; a expressão máxima da modularidade ofensiva da formação.

**Tottenham de Pochettino (2015-2019)** — 4-2-3-1 de pressing alto e intenso, com pontas que corriam muito, mostrando a versão de bloco alto e PPDA baixo (pressão coordenada) da formação.

**Seleção Alemã campeã de 2014** — referência histórica do 4-2-3-1 com duplo pivô de controle, demonstrando o equilíbrio estrutural que tornou o desenho o padrão dominante dos anos 2010.

**Leitura para o produto:** quando o time é de Ancelotti/Heynckes-style, espere **controle + transição letal** (jogo pode ser de poucos gols mas com chances de qualidade); quando é Guardiola/Arteta-style com lateral invertido, espere **domínio de posse e ataque posicional** (mais bola, adversário fechado, gols dependendo de quebrar bloco baixo)."

---

### 4-1-4-1

#### Resumo e viés

`consenso`

O **4-1-4-1** é uma das formações mais usadas em futebol moderno de elite, e ao mesmo tempo a mais mal-entendida pelo torcedor leigo. Ela se lê assim, de trás pra frente: **4** defensores (2 zagueiros centrais + 2 laterais), **1** volante de proteção isolado à frente da defesa (o "pivô único" ou *single pivot*), **4** meias numa linha horizontal (2 internos + 2 pelos lados), e **1** centroavante isolado lá na frente.

A filosofia central é **CONTROLE pela ocupação do meio-campo com bom equilíbrio defensivo**. O detalhe que define tudo é o volante único protegendo a zaga: ele cria uma "rede de segurança" entre a linha de 4 defensores e a linha de 4 meias, fechando o corredor central — o caminho mais perigoso e curto para o gol. Por isso o 4-1-4-1 nasce como uma formação de **viés equilibrado-reativo**, mais cauteloso que o 4-3-3 clássico, porém mais ambicioso e com presença no campo de ataque que o 4-5-1 puro (que é defensivo).

Jargão essencial logo de cara:
- **Pivô / volante único** (*single pivot*): o "1" do meio. Um só jogador encarregado de filtrar o meio-campo. É o ponto frágil e o ponto forte ao mesmo tempo da formação.
- **Linha entre linhas**: o espaço vertical entre a defesa e o meio. O pivô existe justamente para cobrir esse espaço.
- **Bloco**: o conjunto das linhas defensivas quando o time não tem a bola. O 4-1-4-1 sem bola vira facilmente um **4-5-1**, com 9 jogadores atrás da linha da bola — daí sua fama defensiva.

Importante para você, dono do produto: o 4-1-4-1 e o **4-3-3** são quase a mesma formação no papel — ambas têm 4 atrás, 3 no meio e 3 na frente OU 4 atrás e 1 volante. A diferença é a **disposição e a função das peças do meio**: no 4-3-3 os 3 meios formam um triângulo (1 volante + 2 mais avançados, ou 2 volantes + 1 meia); no 4-1-4-1 os 4 meias formam duas linhas planas (1 volante + 4 numa fila). Times frequentemente **alternam entre as duas formas dentro do mesmo jogo** sem trocar nenhum jogador — é a mesma equipe mudando de forma conforme a fase. Guarde isso: **formação declarada (a escalação no papel) raramente é igual à formação real (a forma no gramado)**.

#### Papel de cada posição nesta formação

**Goleiro**

`consenso` No 4-1-4-1, o goleiro é peça de **construção de jogo** e **seguro contra a profundidade**. Como a formação tende a manter uma linha defensiva razoavelmente alta (para comprimir o meio e dar suporte ao volante único), sobra espaço nas costas dos zagueiros. O goleiro precisa ser um **goleiro-líbero** (*sweeper-keeper*): sai da área para varrer bolas longas lançadas no espaço, funcionando como um quinto defensor improvisado. Na saída de bola, ele vira o '+1' numérico — quando o time constrói com 2 zagueiros contra 1 ou 2 atacantes adversários, o goleiro entra na conta para criar superioridade e furar o primeiro bloco de pressão. Jargão: *build-up* é a saída de bola organizada do fundo.

**Zagueiro central (2x)**

`consenso` Dupla de zaga clássica. As duas funções essenciais aqui: (1) **defender o espaço entre linhas em conjunto com o pivô** — quando o meia adversário se infiltra entre a zaga e o meio, é o zagueiro quem decide se sai na marcação (saltando a linha) ou se segura a posição. (2) **iniciar a construção**: no 4-1-4-1 moderno, os zagueiros frequentemente abrem em amplitude (afastam-se um do outro) para dar largura na primeira fase e permitir que o volante único receba a bola entre eles. Idealmente um dos dois é bom de saída de bola com os pés (o construtor) e o outro mais agressivo no duelo e no jogo aéreo (o destruidor). A vulnerabilidade que eles cobrem o tempo todo: como há só UM volante, se o adversário tira esse volante da jogada, os zagueiros ficam expostos a receber atacantes de frente em campo aberto.

**Lateral (2x)**

`consenso` Os laterais são o **principal motor de largura ofensiva** desta formação. Como os 4 meias tendem a jogar mais centralizados (sobretudo os 2 internos), são os laterais que dão amplitude e sobem pela linha de fundo para cruzar ou combinar com o homem de lado. Papel duplo e exigente: precisam **subir para atacar** mas **voltar para defender**, porque atrás deles o pivô único não consegue cobrir os dois corredores laterais ao mesmo tempo. Por isso, no 4-1-4-1, é comum os dois laterais **não subirem juntos**: um avança e o outro segura, mantendo uma defesa de 3 (2 zagueiros + 1 lateral) atrás. Variante moderna importante: o **lateral invertido** (*inverted fullback*) — em vez de subir pela linha, ele entra para dentro e se posiciona ao lado do volante único, formando um **duplo pivô temporário** na fase de construção. Isso resolve a maior fraqueza da formação (o volante sozinho) sem mudar a escalação.

**Volante / pivô único**

`consenso` **É O JOGADOR QUE DEFINE A FORMAÇÃO.** O '1' isolado. Suas tarefas, em ordem de importância: (1) **proteger o corredor central** — tampar o buraco entre a defesa e o meio para o time não ser cortado ao meio por um passe. (2) **ser o pêndulo da construção** — recebe a bola dos zagueiros, gira o jogo de um lado pro outro, é o ponto de apoio que conecta defesa e ataque. (3) **cobrir os espaços que os meias internos deixam ao avançar**. O perfil ideal é um volante posicional e inteligente, com leitura de jogo acima da média (saber ONDE estar vale mais que correr muito), boa primeira saída de passe e capacidade de marcar sem entrar em duelo a todo momento (porque se ele é driblado ou puxado pra fora, a casa cai). Jargão de domínio: por estar sozinho, ele é o ponto de **sobrecarga** (*overload*) que os adversários miram — colocam 2 jogadores na zona dele para deixá-lo na dúvida de quem marcar. A forma de protegê-lo é ter os 2 meias internos disciplinados para descer e ajudar.

**Meia interno / box-to-box (2x)**

`consenso` São os 2 jogadores centrais da linha de 4 meias — os 'pulmões' da formação. O 4-1-4-1 vive ou morre pela disciplina desses dois. Função sem bola: **descer e formar uma linha de 3 no meio com o volante** (a forma vira 4-3 atrás), fechando os espaços que o pivô sozinho não cobre. Função com bola: **subir para apoiar o centroavante isolado** e chegar na área (são eles que dão volume de chegada na grande área, fazendo gols de segunda linha). Por isso o termo **box-to-box** (de área a área): correm de uma grande área à outra o jogo inteiro. Variante: um dos dois pode ser uma **mezzala / interior** (meia que joga mais aberto, num corredor intermediário entre o centro e a lateral, recebendo entre linhas pra criar) e o outro um box-to-box mais vertical e de chegada. A relação deles com o volante é o coração tático da formação: se eles esquecem de voltar, o time fica com um buraco gigante no miolo; se esquecem de subir, o centroavante fica isolado e o ataque morre.

**Extremo / ponta (2x)**

`consenso` São os 2 jogadores das pontas na linha de 4 meias. Diferença em relação ao 4-3-3: aqui eles partem de uma posição um pouco **mais recuada** (estão numa linha de meio-campo, não de ataque). Isso lhes dá uma função defensiva mais clara — eles **descem para formar o 4-5-1** sem a bola, tapando o lateral adversário. Com a bola, são os homens de **1 contra 1**, drible e ataque à profundidade pelos corredores. Como os laterais sobem por fora, é comum o extremo **cortar pra dentro** (*inverted winger*: ponta canhoto na direita / destro na esquerda, que entra no pé invertido pra finalizar ou enfiar passe) enquanto o lateral dá a largura por fora. A combinação ponta-invertida + lateral-que-sobe é um dos automatismos clássicos da formação. Sem eles voltando, os laterais ficam expostos 1v1 nas transições — é o calcanhar de Aquiles do 4-1-4-1 mal treinado.

**Centroavante**

`consenso` O '1' lá na frente — atacante isolado, o homem de referência. Como joga sozinho contra (em geral) 2 zagueiros, o 4-1-4-1 **exige um centroavante completo e generoso**, não um finalizador puro de área. Funções: (1) **segurar a bola de costas** (*hold-up play*) para dar tempo dos meias internos subirem e apoiarem — sem isso o ataque fica isolado e a bola volta. (2) **ser o primeiro defensor** — inicia a pressão sobre os zagueiros adversários e direciona pra onde o time quer que a bola vá (*pressing trigger*). (3) **ocupar e fixar os 2 zagueiros** para abrir espaço para a chegada dos box-to-box e das pontas invertidas. O perfil pode variar: um '9' físico de pivô (segura, protege, briga no alto) ou um '9' móvel que sai da área pra criar superioridade. Em qualquer caso, ele trabalha muito mais para o time do que recebe em bolas — é a posição mais ingrata da formação.

#### Forças

`consenso`

**1. Controle e densidade no meio-campo.** Com 5 jogadores influenciando o miolo (volante + 2 internos + 2 pontas que descem), o 4-1-4-1 raramente perde a batalha numérica central. Isso facilita dominar a posse e sufocar times que tentam jogar por dentro.

**2. Solidez defensiva por transformação fácil em 4-5-1.** Sem a bola, as duas linhas de 4-1-4 se fundem num bloco de 9 atrás da linha da bola, com 2 linhas de 4 muito compactas e o centroavante de sentinela. É das formações mais difíceis de penetrar pelo centro — o corredor mais perigoso fica triplamente coberto (zaga + volante + internos).

**3. Proteção estrutural do espaço entre linhas.** O volante único existe especificamente para tapar o buraco que mata defesas: o espaço onde o camisa 10 adversário recebe de frente para a defesa. Em times bem treinados, esse espaço some.

**4. Flexibilidade camaleônica.** É a formação que mais facilmente vira outra coisa sem trocar jogadores: vira **4-3-3** quando um interno sobe, vira **4-5-1** quando recua, vira **3-2-5** (ou **2-3-5**) na fase ofensiva quando um lateral inverte e o outro sobe. Treinadores adoram pela maleabilidade.

**5. Boas transições defensivas (recompactação rápida).** Quando perde a bola no campo ofensivo, há sempre o pivô + linha de 4 atrás dele bem postados — a estrutura para o **contra-ataque adversário** já está montada. Reduz o risco de levar contragolpe fatal.

**6. Plataforma para pressing alto e coordenado (PPDA).** O centroavante mais os 2 internos podem disparar uma pressão na saída adversária com referências claras. *PPDA* (passes permitidos por ação defensiva) é a métrica de intensidade de pressão: quanto menor, mais o time pressiona; o 4-1-4-1 consegue PPDAs baixos sem se desorganizar, porque sempre sobra o volante de cobertura atrás da pressão.

#### Fraquezas

`consenso`

**1. O volante único como ponto único de falha.** Esta é A fraqueza estrutural. Um só jogador cobre toda a zona à frente da defesa. Se o adversário (a) o tira da posição com movimentação, (b) o sobrecarrega com 2 homens na zona dele, ou (c) simplesmente joga num volante de pouca leitura — o time é cortado ao meio com um passe e a defesa recebe atacantes de frente. Times de elite atacam o 4-1-4-1 jogando exatamente em cima e ao redor desse '1'.

**2. Dependência crítica da disciplina dos meias internos.** A formação só funciona se os 2 box-to-box descem para ajudar o volante na defesa E sobem para apoiar o ataque — um esforço físico e cognitivo brutal. Se eles cansam, se distraem ou são naturalmente mais ofensivos, a formação **rasga no miolo**: ou o volante fica sozinho (buraco defensivo) ou o centroavante fica sozinho (ataque estéril). É a formação que mais castiga indisciplina tática.

**3. Centroavante isolado / ataque dependente de chegada de segunda linha.** Com só 1 na frente, se os internos não chegam a tempo, o ataque é previsível e fácil de defender (2 zagueiros contra 1 atacante = superioridade defensiva confortável do adversário). Contra blocos baixos bem postados, o 4-1-4-1 pode ter muita posse e pouca criação — falta um segundo homem de referência na área.

**4. Vulnerabilidade dos corredores laterais nas costas dos laterais.** Quando o lateral sobe, o espaço atrás dele fica grande, e o pivô não consegue cobrir os dois lados. Times que atacam por fora com pontas rápidos e laterais que sobem podem explorar esse flanco em transição.

**5. Distância entre as duas linhas de 4 (o 'sanduíche').** Se as linhas se separam verticalmente (a de meias sobe pra atacar e a de defesa fica), abre-se uma faixa enorme no meio — exatamente onde o pivô vive. Manter as duas linhas compactas (a famosa **compactação vertical**) é difícil e exige treino constante; quando falha, a formação vira gruyère.

**6. Carência criativa quando não há um 10 explícito.** A linha plana de 4 meias não tem, por padrão, um armador clássico atrás do atacante. Sem um interno com qualidade de último passe, o time pode ser muito sólido e nada inventivo no terço final.

#### Matchups (boa contra / sofre contra)

`consenso`

Pense sempre em **superioridade numérica por setor** (quem tem mais jogadores em cada faixa) e em **gaps** (zonas que cada formação deixa abertas).

**Contra 4-4-2 — favorável.** O 4-1-4-1 vence o meio-campo por número: 3 centrais de meio (volante + 2 internos) contra 2 do 4-4-2. Essa superioridade central permite girar o jogo e infiltrar entre as linhas. Os 2 atacantes do 4-4-2 também não conseguem pressionar 3 construtores (2 zagueiros + volante). É um dos matchups mais confortáveis do 4-1-4-1. *Gap explorado:* o miolo do 4-4-2.

**Contra 4-2-3-1 — equilibrado, com risco no '10'.** Aqui o perigo é o **camisa 10 adversário** caindo exatamente em cima do volante único: cria um 1v1 que, se ganho pelo 10, fura a formação. O 4-2-3-1 tem 2 volantes contra 1 — leva ligeira vantagem na contenção central. O 4-1-4-1 responde com os internos descendo pra dobrar no 10. Jogo de quem tem melhor disciplina. *Gap a vigiar:* a zona do pivô, atacada pelo 10.

**Contra 4-3-3 — espelhado, decidido nos detalhes.** São quase a mesma formação. O confronto vira um espelho no meio (3v3). Decide quem ganha os duelos individuais e qual time melhor manipula a posição do volante adversário. Frequentemente, ambos alternam entre as duas formas durante o jogo. *Sem gap estrutural claro — decide a qualidade.*

**Contra 3-5-2 / 3-4-2-1 — DESFAVORÁVEL, o pesadelo clássico.** É o matchup que mais incomoda o 4-1-4-1. O 3-5-2 tem **2 atacantes contra 2 zagueiros** (sem o '+1' defensivo) e **3 volantes contra os 3 meios centrais** — empata o meio mas pode sobrecarregá-lo, e com **alas (wing-backs)** que atacam as costas dos laterais. O volante único sofre contra a densidade central do adversário, e os 2 atacantes fixam a dupla de zaga deixando-a sem cobertura. *Gaps explorados:* corredores laterais (pelos alas) e sobrecarga no pivô. Times costumam ajustar para 4-4-2 ou subir um lateral pra compensar.

**Contra 4-5-1 / bloco baixo — favorável na posse, frustrante na criação.** Contra um time que se fecha, o 4-1-4-1 terá toda a bola e o controle, mas esbarra na própria fraqueza ofensiva (centroavante isolado). A superioridade é territorial, não decisiva. Precisa dos laterais e internos chegando em volume para furar — senão é 0 a 0 entediante.

**Regra geral de leitura:** o 4-1-4-1 ganha de formações com **só 2 no meio** (domina o miolo) e sofre contra formações com **3 centrais de meio + 2 atacantes** (que atacam seu único volante e fixam sua zaga sem '+1').

#### Interações e automatismos

`consenso`

**1. Volante único ↔ duplo movimento dos internos (a interação-mãe).** Tudo gira em torno disso. Os 2 box-to-box precisam de uma coreografia: quando um sobe pra atacar, o outro segura ao lado do volante (formando um duplo pivô momentâneo). Nunca os dois sobem juntos sem cobertura. Esse rodízio é o automatismo que mantém a casa em pé. Se você só entende UMA coisa do 4-1-4-1, entenda esta.

**2. Lateral que sobe ↔ ponta invertida que entra.** Clássico do jogo de corredor. O ponta corta pra dentro (no pé invertido, buscando finalização ou passe), e isso **abre o corredor externo** para o lateral subir e dar a largura/cruzamento. São dois jogadores se revezando no mesmo corredor — um por dentro, um por fora. Sem esse entrosamento, o flanco fica congestionado ou vazio.

**3. Lateral invertido ↔ volante único (resolvendo a fraqueza estrutural).** Automatismo moderno (à la Guardiola): na construção, um lateral entra pra dentro e se posiciona ao lado do volante, criando o **duplo pivô** que protege contra a sobrecarga no '1'. Transforma a saída de bola num **3-2** (3 atrás + 2 no meio) muito mais estável, sem precisar de outro jogador.

**4. Centroavante (hold-up) ↔ chegada de segunda linha.** O '9' segura a bola de costas e espera; os internos chegam correndo de trás. É a principal via de gol da formação — gols de **chegada de segunda linha**, não do centroavante. A qualidade de pivô do '9' é o gatilho desse mecanismo.

**5. Centroavante + 2 internos ↔ gatilho de pressão (pressing trigger).** No bloco alto, esses 3 disparam a pressão sobre os 3 construtores adversários com referências de homem, enquanto o volante cobre as costas. É o que permite ao 4-1-4-1 pressionar alto sem se expor.

**6. As duas linhas de 4 ↔ compactação vertical.** A interação invisível mais importante sem a bola: as linhas de defesa e de meio precisam subir e descer JUNTAS, mantendo ~10-15 metros entre elas, para que o espaço onde o volante vive nunca cresça. É treino de bloco, não de indivíduo.

#### Variações por fase (com bola / sem bola / placar)

`consenso`

**Com bola (organização ofensiva) — a forma 'abre'.** O 4-1-4-1 declarado vira, na prática, algo como **3-2-5** ou **2-3-5**. Os laterais sobem (ou um inverte pra dentro), o volante desce entre/ao lado dos zagueiros, os 2 internos avançam, as pontas ficam abertas e o centroavante fixa a zaga. Isso pode colocar **5 jogadores na última linha** (2 pontas + 2 internos + centroavante) — daí a numeração '5' no fim. O objetivo é ocupar todos os corredores (os '5 corredores' do campo) e criar superioridade no terço final. A forma com bola raramente se parece com o desenho do papel.

**Sem bola (organização defensiva) — a forma 'fecha' num 4-5-1.** As duas linhas de 4 baixam e se compactam, as pontas recuam pra tapar os laterais adversários, os internos descem ao lado do volante. Vira um **bloco médio ou baixo de 4-5-1** com 9 homens atrás da bola e o centroavante sozinho lá na frente, pronto pro contra-ataque. É aqui que mora a fama defensiva da formação.

**Transição ofensiva (acabou de recuperar).** A estrutura favorece dois caminhos: (a) **bola direta no centroavante** que segura enquanto os internos disparam, ou (b) **explorar o corredor que o adversário deixou aberto** — frequentemente o flanco, com a ponta rápida. O volante reorganiza se o contra-ataque não sai.

**Transição defensiva (acabou de perder).** Ponto forte: o volante + linha de 4 já estão postados pra frear o contragolpe. A regra é **reação imediata (contrapressing) dos jogadores próximos** OU recuo organizado pro 4-5-1. O risco é se o lateral estava subido — aí o flanco fica aberto e a equipe precisa basculhar rápido.

**Variação por estado de placar (declarada vs real).** Time **vencendo** tende a virar 4-5-1 puro defensivo (joga reativo, segura o resultado, abandona a linha de 4 meias avançada). Time **perdendo / precisando do gol** empurra os 2 internos pra cima e sobe os 2 laterais, virando um 4-3-3 / 3-2-5 agressivo e aceitando o risco nas costas. Por isso: a formação **declarada** (4-1-4-1 no papel) quase nunca é a forma **real** — leia sempre o placar, o minuto e quem precisa do jogo antes de assumir como o time está realmente postado.

#### Exemplos de times e treinadores

`consenso` (exemplos de domínio tático; perfis de uso, não estatística verificada)

- **Pep Guardiola (Manchester City)** — o maior expoente do uso *flexível* do 4-1-4-1 / 4-3-3, com **Rodri** como o volante único definidor (leitura e posse de elite) e o **lateral invertido** (Zinchenko, Cancelo, depois Gvardiol) entrando pra formar o duplo pivô. É o caso-modelo de como mitigar a fraqueza estrutural do '1'.

- **Jürgen Klopp (Liverpool, era de pico ~2018-2020)** — usou o 4-3-3 que vira 4-1-4-1 sem bola, com **Fabinho** de pivô único, internos (Henderson/Wijnaldum) box-to-box incansáveis e o *gegenpressing* (contrapressão imediata) explorando a transição defensiva da formação. Exemplo clássico da fusão pressing alto + bloco compacto.

- **Carlo Ancelotti (Real Madrid)** — frequentemente parte de uma base com pivô único (**Casemiro**, depois **Tchouaméni/Camavinga**) e internos de altíssima qualidade (Kroos, Modric, Valverde) que alternam entre 4-3-3 e 4-1-4-1 conforme a fase, priorizando o controle e as transições verticais.

- **Mikel Arteta (Arsenal)** — herdeiro da escola Guardiola, usa o pivô único (**Partey/Rice**) com laterais invertidos e internos disciplinados, exemplo recente (2023-2025) de 4-1-4-1 / 3-2-5 com forte controle.

- **Uso defensivo/reativo:** muitos times médios e seleções adotam o 4-1-4-1 explicitamente como **4-5-1 disfarçado** para enfrentar adversários superiores — fecham as duas linhas, protegem o centro e apostam na transição. É a face mais conservadora da mesma formação.

`NEI` Datas e elencos exatos de cada temporada não foram verificados via fetch nesta análise; tratar como ilustração de domínio tático.

---

### 3-5-2 / 3-4-1-2 (linha de 3 zagueiros, 5 no meio com 2 alas, e 2 atacantes; a variante 3-4-1-2 troca um volante por um meia-armador/10)

#### Resumo e viés

**O que é (consenso).** O 3-5-2 é uma família de formações construída sobre três pilares: uma **linha de 3 zagueiros centrais** (defesa de 3), **dois alas** (em inglês *wing-backs* — jogadores de corredor que sobem e descem por toda a lateral do campo, fazendo trabalho de lateral + ponta ao mesmo tempo) e **dois centroavantes** (uma dupla de ataque, em vez de um homem só). O miolo do meio-campo é ocupado por **três meias** numa configuração triangular (geralmente um volante mais baixo + dois meias por dentro), o que dá o "5" do nome quando você conta os dois alas junto com os três meias.

A **leitura mais importante para um leigo**: o "5" do 3-5-2 é uma *ilusão de ótica defensiva*. Com a bola, os dois alas viram quase pontas e a equipe parece um 3-4-2-1 ou um 3-2-5 atacante; sem a bola, os dois alas recuam e colam na linha dos zagueiros, virando uma **linha de 5 defensores** (3-5-2 sem bola = 5-3-2). Ou seja: é uma formação **camaleônica por natureza**, que muda de cara conforme quem tem a bola. É essa elasticidade que a tornou popular.

**A variante 3-4-1-2** é o mesmo esqueleto, mas em vez de três meias "horizontais", você tem **dois volantes (duplo pivô) + um meia-armador (o "10", o cérebro criativo) logo atrás dos dois atacantes**. Troca-se solidez e cobertura central (3-5-2 com 3 no miolo) por **criação e ligação direta** entre meio e ataque (3-4-1-2 com um 10 dedicado). O 3-4-1-2 é mais ofensivo e mais "vertical"; o 3-5-2 clássico é mais equilibrado e controlador.

**Filosofia/viés.** É uma formação de **controle e densidade central**. Concentra gente no meio (vence a posse na zona central), gera **superioridade numérica no meio-campo** contra times de 2 volantes, e ataca pelos lados com os alas em vez de pelas pontas fixas. O viés costuma ser **reativo-pragmático** (defender com 5, sair em transição com a dupla de ataque e os alas) ou **controlador-posicional** (dominar o miolo, asfixiar pelo meio). É a formação clássica de quem quer **proteger a área com muitos corpos** sem abrir mão de ter 2 atacantes para a transição.

#### Papel de cada posição nesta formação

**Goleiro**

Num 3-5-2 moderno, o goleiro é o **+1 da construção**. Como a defesa já é de 3 zagueiros, o goleiro raramente precisa virar 'líbero' (zagueiro extra) na saída — os 3 centrais já dão largura suficiente para escapar do primeiro pressing de 2 atacantes adversários (3 contra 2 = superioridade). O papel dele aqui é mais de **distribuição segura e leitura de bola nas costas da linha**: como a defesa de 3 tende a jogar com a linha um pouco mais alta e fechada no centro, o goleiro precisa estar pronto para sair da área e varrer (papel de *sweeper-keeper*, o goleiro-líbero que age como um defensor extra fora da área) quando a bola passa por cima. Em jogo aéreo defensivo (escanteios, cruzamentos), ele comanda uma área já bem povoada por 3+ zagueiros altos.

**Zagueiro central (lado direito da linha de 3 — 'zagueirão de saída direita')**

O trio de zagueiros tem **três funções diferentes**, não três cópias do mesmo jogador. O zagueiro do lado direito é tipicamente um **defensor de relação por dentro/por fora**: ele cobre a região entre o central e o ala direito. Quando o ala direito sobe, é ele que **desliza para a lateral** para tampar o buraco (vira um lateral improvisado por alguns segundos). Precisa ser bom em duelo de corredor (1v1 com o ponta adversário que ataca o gap deixado pelo ala). Com a bola, é uma **fonte de progressão pelo lado** — conduz alguns metros e entrega para o ala ou para o meia daquele lado.

**Zagueiro central (do meio — 'líbero/central puro')**

O zagueiro central do meio é o **chefe da linha** e, idealmente, o mais inteligente taticamente dos três. Ele é o **organizador da profundidade** (manda a linha subir ou cair), o homem que **cobre as costas** dos outros dois quando eles saem para marcar, e o **primeiro responsável pela dupla de atacantes adversária** em jogo direto. Em times de elite, é dele que sai a **bola de quebra de linha** (passe vertical que fura o meio-campo) — é o 'líbero moderno' (defensor central que também inicia o jogo, herança do *libero* italiano). Em jogo aéreo, é o melhor cabeceador. É a posição mais cognitivamente exigente da linha de 3.

**Zagueiro central (lado esquerdo da linha de 3)**

Espelho do zagueiro da direita, mas com uma nuance: como o futebol tem muitos canhotos escassos, frequentemente esse zagueiro é o **canhoto do trio**, o que abre o ângulo de passe e cruzamento pela esquerda e dá um pé natural para a saída por aquele lado. Mesma lógica de **cobrir o gap quando o ala esquerdo sobe** e duelar com o ponta adversário no corredor. Em times que constroem do chão, o zagueiro de pé invertido (canhoto na esquerda) facilita romper a primeira linha de pressão por dentro.

**Ala / wing-back direito**

**A posição que define a formação** (consenso: os alas são o coração do 3-5-2). É o jogador de **maior quilometragem do time** — cobre toda a faixa direita, do escanteio ofensivo ao escanteio defensivo. Com a bola, ele é **a largura ofensiva daquele lado** (vira praticamente um ponta, porque não há ponta fixo nesta formação); sem a bola, recua e vira o **lateral da linha de 5**. O dilema clássico do ala: se ele é mais ofensivo (perfil de ponta), o time ataca melhor mas sofre nas costas dele; se é mais defensivo (perfil de lateral), fecha bem mas perde fôlego ofensivo. Em transição ofensiva, é a primeira opção de escape pelo lado, porque chega com campo aberto à frente. O ala é o gerador de **cruzamentos e da munição de bola parada lateral**.

**Ala / wing-back esquerdo**

Mesma função do ala direito, espelhada. Frequentemente é onde se coloca o **ala mais ofensivo** (o que mais 'pinta' no ataque), criando assimetria: um lado sobe mais, o outro segura. Times de elite usam essa assimetria de propósito — um ala vira ponta-de-lança pelo corredor e o outro fica mais como terceiro central na construção (gerando aquele desenho 3-2-5 com bola). A dependência do 3-5-2 de **dois alas de alto nível** é a sua maior fragilidade de elenco: faltou um ala bom, a formação capenga.

**Volante / pivô (no 3-5-2 clássico)**

O **pivô** (em inglês *holding midfielder*, o volante de proteção que fica na frente da defesa) é o **âncora** do meio. Ele faz a ponte entre os 3 zagueiros e o resto do time: na construção, recua entre/à frente dos centrais e vira o **'+1' que organiza a saída de bola** (transformando a defesa de 3 numa base de 4 momentânea); na defesa, **protege a zona central na frente da linha** — exatamente o espaço que vale ouro contra times que jogam com um 10. É o **regulador do equilíbrio**: enquanto os dois meias à frente avançam, ele segura. Em transição defensiva, é o primeiro a **dar a falta tática ou atrasar o contra-ataque** (o 'foul tático' ou o *fox in the box* defensivo). Tecnicamente, precisa receber sob pressão e girar.

**Meia interior / mezzala (os dois '8' do 3-5-2)**

No 3-5-2 clássico, ao lado/à frente do pivô ficam **dois meias interiores** — o termo italiano é **mezzala** ('meia-asa', o meia que joga nos meios-espaços, entre o ala e o pivô). São os pulmões do time: **box-to-box** (caixa-a-caixa, vai e volta da própria área até a do adversário). Cada mezzala tem três trabalhos: (1) **dar superioridade no meio** ajudando o pivô a ganhar a posse central; (2) **explorar o meio-espaço** (o corredor entre o central e o lateral adversário — a zona mais perigosa do campo moderno) com infiltrações por dentro, chegando como 'terceiro homem' na área para finalizar; (3) **sustentar o ala** do seu lado, fazendo sobreposições ou segurando a posição enquanto o ala sobe. É a engrenagem que liga defesa, lados e ataque. Sem mezzalas de muita energia, o 3-5-2 fica curto entre as linhas.

**Volante / duplo pivô (na variante 3-4-1-2)**

No **3-4-1-2**, em vez de um pivô + dois interiores, você tem um **duplo pivô** (dois volantes lado a lado) — geralmente um mais **destruidor/recuperador** (rouba bola, cobre espaço) e um mais **construtor/lançador** (sai jogando, distribui). Essa dupla protege a frente da defesa de 3 e libera o 10 lá na frente para só criar. O ganho é estabilidade defensiva no centro e melhor cobertura dos meios-espaços; a perda é uma perna a menos chegando à área (os volantes sobem menos que as mezzalas). É a opção de quem quer **um '10' criativo sem ficar exposto no meio**.

**Meia-armador / 10 (exclusivo do 3-4-1-2)**

O **10** (o 'enganche' argentino, o 'trequartista' italiano — o meia ofensivo que joga entre as linhas) é a diferença central da variante 3-4-1-2. Ele atua **no espaço entre o meio-campo e a defesa adversária** ('entre as linhas'), o ponto cego onde o volante adversário não chega e o zagueiro não quer sair. Funções: **receber de frente para o gol e dar o último passe** para os dois atacantes; **flutuar** entre os centros para criar superioridade onde a bola está; e oferecer o **passe de quebra de linha** que liga o duplo pivô à dupla de ataque. É o jogador mais criativo do time. A fragilidade: defensivamente ele dá pouca cobertura, então o time depende ainda mais do duplo pivô atrás dele.

**Centroavante (o '9' fixo / homem de referência)**

Numa dupla de ataque, os dois atacantes quase nunca são iguais — há **divisão de trabalho**. Um deles costuma ser o **9 de referência** (*target man* ou pivô de ataque): segura a bola de costas para o gol, ganha o duelo aéreo, **fixa os dois zagueiros centrais adversários** e abre espaço para o parceiro. Ele é o ponto de apoio para o time subir (a bola chega nele, ele segura e a equipe avança). Em bola parada e cruzamento dos alas, é o finalizador-alvo na área. Contra defesas de 4, a dupla de atacantes do 3-5-2 já cria o problema de **2 atacantes contra 2 zagueiros** (2v2), tirando a sobra do adversário.

**Segundo atacante (o parceiro móvel da dupla)**

O parceiro do 9 é o **segundo atacante** (em inglês *second striker*, às vezes um 'falso 9' ou um atacante de movimento). Ele joga **mais baixo e mais móvel**: cai entre as linhas para receber, arrasta um zagueiro para fora da posição, ataca as costas da linha quando o 9 segura a bola, e faz a **ligação com o meio**. É o que dá imprevisibilidade à dupla: enquanto o 9 fixa, o segundo atacante explora os espaços que a fixação abre. A combinação ideal é **referência + movimento** — um segura, o outro rompe; é exatamente o que torna a dupla de ataque difícil de marcar (o zagueiro não sabe se sobe no que cai ou se fica no que rompe).

#### Forças

**1. Superioridade central no meio-campo (consenso).** Com 3 meias (3-5-2) ou duplo pivô + 10 (3-4-1-2), você quase sempre tem **mais gente no miolo do que um adversário com 2 volantes**. Quem domina o centro domina o ritmo do jogo: recupera mais segundas bolas, encontra mais saídas, e empurra o adversário pra trás. É o argumento número 1 da formação.

**2. Solidez defensiva por densidade — a linha de 5.** Sem a bola, os alas recuam e formam **uma linha de 5 defensores**. Isso significa que, mesmo que um ala suba e perca a bola, ainda sobram 3 zagueiros + o outro ala fechando. Contra times de 2 atacantes ou de 1 atacante + alas, você tem **superioridade numérica defensiva permanente** na sua última linha (3 zagueiros vs 1-2 atacantes). Cobre muito bem a **largura defensiva** e dificulta cruzamento perigoso.

**3. Cobertura natural dos zagueiros que saem.** A grande vantagem mecânica da defesa de 3: quando um zagueiro **sai para marcar** (sobe no atacante que cai entre as linhas, ou avança para cortar um passe), **sempre sobram dois atrás** para cobrir. Numa defesa de 2, fazer isso deixa um buraco; numa de 3, é seguro. Isso permite uma marcação **mais agressiva e adiantada** sem se expor.

**4. Dois atacantes = problema permanente para a defesa adversária.** Ter **dupla de ataque** força os zagueiros adversários a um 2v2 (ou pior). Um time de 4 defensores não tem 'sobra' fácil contra 2 atacantes coordenados (um fixa, outro rompe). É excelente para **transição ofensiva**: ao recuperar, você já tem 2 homens na frente + os alas chegando — sai 2v2 ou 3v3 com campo aberto, o cenário mais letal do futebol.

**5. Ataque pelos corredores via alas, sem custar um 'ponta fixo'.** Você tem largura ofensiva (os alas) E densidade central (os 3 meios) ao mesmo tempo — algo que um 4-3-3 com pontas fixos não consegue (lá, a largura é ponta, mas o meio fica com menos gente). É a formação que melhor **combina centro forte + lados ativos**.

**6. Munição de bola parada.** Com 3 zagueiros altos + 1-2 atacantes de área + os alas cruzando, o 3-5-2 costuma ter **muitos corpos altos** para atacar escanteios e faltas laterais — e, defensivamente, muitos corpos para defender o próprio.

#### Fraquezas

**1. Os meios-espaços e as costas dos alas (consenso: a fraqueza nº 1).** O **meio-espaço** (o corredor entre o zagueiro central e a lateral) é o calcanhar de Aquiles. Quando o ala sobe, a zona atrás dele fica aberta; um adversário com **ponta + lateral pelo mesmo lado** (overload de 2 contra 1 ali) ataca esse buraco. O zagueiro do lado precisa sair para tampar — e aí abre espaço no centro. É o trade-off permanente do 3-5-2: **a largura ofensiva dos alas custa vulnerabilidade nas costas deles**. Times que jogam com pontas abertos e velozes exploram isso impiedosamente.

**2. Sofre contra três atacantes / pontas abertos (3v3 vira problema).** A defesa de 3 brilha contra 1-2 atacantes, mas contra **três atacantes que abrem bem** (um 4-3-3 com pontas grudados na linha), os 3 zagueiros ficam **'colados' 3v3 sem sobra**. Aí qualquer drible ou movimento individual cria superioridade. E os alas ficam num dilema: sobem (e expõem) ou descem para virar laterais (e somem do ataque, virando 5-3-2 passivo).

**3. Distância dos alas até o ataque (a 'transição reversa').** Se o ala está lá em cima atacando e o time **perde a bola**, ele precisa correr 40-60 metros de volta. Durante esses segundos, o time defende com um lado escancarado. Um adversário rápido em **transição pelo lado oposto** (trocar o jogo para o lado do ala que subiu) é veneno. Por isso, 3-5-2 exige alas com **fôlego absurdo** e **disciplina de recuo**.

**4. Falta de largura quando os alas estão cansados ou são contidos.** Toda a largura ofensiva depende de 2 jogadores. Se o adversário **trava os alas** (marcando-os com seus próprios pontas/laterais) ou se eles cansam no 2º tempo, o ataque vira **estreito e previsível** — fica tudo no centro, fácil de fechar. A formação é **dependente de elenco**: precisa de 2 alas de altíssimo nível, raros no mercado.

**5. No 3-4-1-2: pouca cobertura defensiva à frente do duplo pivô.** A variante com 10 ganha criação mas o 10 não defende; se o duplo pivô for superado, **abre-se a zona entre linhas** justamente onde o adversário quer jogar. E como não há pontas, o **bloqueio do meio-campo é estreito**: um adversário paciente que troca o jogo de lado a lado rápido faz a linha de 4 do meio correr de um lado pro outro até abrir uma fresta.

**6. Construção pode ser previsível contra pressing alto bem-feito.** Com 3 zagueiros + 1 pivô, a saída tende a passar muito pelo centro. Um adversário que **pressiona em homem (man-marking) o pivô e fecha os meias** pode obrigar a defesa de 3 a chutões — e aí a posse central, que era a força, vira chutão pra dupla de ataque (jogo direto), o que pode ser plano A ou desespero, dependendo do time."

#### Matchups (boa contra / sofre contra)

**Pensando em superioridade numérica por setor (consenso):**

**É BOA contra (4-4-2 e 4-2-3-1 — formações de 2 volantes):**
- **Meio-campo:** seus 3 meios (ou pivô+2 mezzalas) contra os 2 volantes adversários = **3v2 no centro**. Você domina a posse e a segunda bola. Esse é o matchup-sonho do 3-5-2.
- **Ataque:** sua dupla de atacantes contra os 2 zagueiros = **2v2 sem sobra** para eles. Pressão constante.
- **Defesa:** 3 zagueiros contra 1-2 atacantes = **sobra defensiva** sua. Você defende com gente sobrando e ataca com gente sobrando no meio. Domínio dos dois lados.

**É BOA contra times que atacam com 1 centroavante só (4-3-3 sem segundo homem por dentro, 4-1-4-1):**
- Seus 3 zagueiros engolem o atacante solitário (3v1); o zagueiro central livre vira saída de bola limpa. Você tem o **+1 estrutural** na defesa e na construção.

**SOFRE contra (4-3-3 / 4-2-3-1 com pontas bem abertos e velozes):**
- **Os pontas atacam o meio-espaço e as costas dos alas.** Quando o ponta + lateral adversário dobram pelo seu lado, viram **2v1 contra seu ala** — o gap clássico. Seu zagueiro tem de sair, e isso desorganiza a linha de 3.
- **Defesa 3v3 sem sobra** se eles colocam 3 homens na última linha (2 pontas abertos + 9). Você perde a superioridade defensiva que é sua marca.

**SOFRE / partida equilibrada contra outro 3-5-2 ou 3-4-2-1 (espelho):**
- Vira **jogo de espelho**: alas se anulam (cada ala marca o ala adversário), 3v3 atrás, e a partida decide nos **duelos individuais de ala e no meio-espaço** — quem tem o melhor ala e a melhor mezzala explorando o gap ganha. Tende a ser truncado, com poucas chances claras e muita disputa central → contexto frequentemente associado a **jogo mais fechado/under** (inferência, como vocabulário explicativo, não como edge).

**Contra 4-3-3 'falso 9' / posse (tipo Guardiola):**
- O risco é o **falso 9 e os interiores adversários flutuarem entre suas linhas**, atraindo seus zagueiros para fora e abrindo a defesa de 3 por dentro. Se seu pivô não tampa a zona entre linhas, sofre. Aqui o 3-4-1-2 (com duplo pivô) defende melhor essa zona que o 3-5-2 de pivô único."

#### Interações e automatismos

**As parcerias que fazem o 3-5-2 funcionar (consenso):**

**1. Ala + mezzala do mesmo lado (a dupla de corredor).** É o automatismo mais importante. Quando o **ala sobe**, a **mezzala daquele lado segura por dentro** para cobrir o meio-espaço; quando o ala fica, a mezzala faz a **infiltração nas costas da linha**. Eles fazem **rodízio de altura**: um sobe, outro segura, nunca os dois fora ao mesmo tempo. Sem essa coordenação, o gap atrás do ala vira buraco fixo.

**2. Ala + zagueiro do mesmo lado (o seguro defensivo).** Toda vez que o ala sobe, o **zagueiro daquele lado desliza para a lateral** para cobrir. É uma sincronia de gangorra: ala pra frente, zagueiro pro lado, e o central do meio escorrega para cobrir o central que saiu. Essa **rotação em cadeia** é o que segura a defesa de 3 quando os alas atacam.

**3. Pivô + os 3 zagueiros (a base de saída em '4' ou '3+1').** Na construção, o **pivô recua** entre/à frente dos centrais e vira o **'+1'** que dá rota de passe — transforma a defesa de 3 numa base de 4 momentânea, escapando do pressing. É o que diferencia um 3-5-2 que sai jogando de um que só chuta pra frente.

**4. A dupla de atacantes: fixar + romper.** O **9 de referência** fixa os zagueiros e segura a bola; o **segundo atacante** explora o espaço que a fixação abre, caindo entre linhas ou atacando a profundidade. Um segura, o outro rompe — é o que torna a dupla impossível de marcar com tranquilidade (o zagueiro não sabe quem seguir).

**5. (No 3-4-1-2) Duplo pivô + 10 (o elevador criativo).** O **duplo pivô** dá a base; o **10** flutua à frente entre linhas. A ligação pivô→10→dupla de ataque é a espinha dorsal criativa: o pivô construtor acha o 10, que vira de frente e serve os atacantes. Funciona se um dos volantes for bom de passe vertical (achar o 10) e o outro for o equilíbrio que cobre quando o 10 perde a bola.

**6. Transição ofensiva (o automatismo letal).** Ao recuperar, o padrão é: **bola rápida na dupla de ataque** (que já está adiantada) **enquanto os 2 alas disparam** pelos corredores. Em segundos vira **3v3 ou 4v4 com campo aberto** — o cenário onde o 3-5-2 é mais perigoso. É por isso que muitos times reativos adotam a formação: ela é desenhada para o contra-ataque com muitos corpos chegando."

#### Variações por fase (com bola / sem bola / placar)

**Como a forma realmente muda (consenso — a 'formação declarada' 3-5-2 quase nunca é a 'formação real' em campo):**

**COM A BOLA (organização ofensiva).** O 3-5-2 vira um **3-2-5 ou 3-4-3 atacante**. Os **dois alas sobem até a linha do ataque** (viram pontas), o **pivô** fica entre os zagueiros (ou um pouco à frente) montando a base de 2-3, e as **mezzalas avançam** para os meios-espaços junto da dupla de ataque. Conta-se então **5 jogadores na última linha ofensiva** (2 alas + 2 atacantes + 1 mezzala/10), com 2-3 de base atrás. É um ataque de **muita largura + muita gente na área**.

**SEM A BOLA (organização defensiva).** Vira **5-3-2** (ou 5-4-1, se um atacante recua). Os **alas caem na linha dos zagueiros** = bloco de 5 defensores; os 3 meios formam a linha de contenção à frente; os 2 atacantes ficam de referência para a transição. Dependendo da altura do bloco:
- **Bloco baixo (5-3-2 recuado):** defende a área com 5+3 = 8 corpos atrás da linha da bola. Quase impenetrável pelo centro; convida o adversário a cruzar (e você tem altura para defender).
- **Bloco médio/alto (pressing):** os 2 atacantes pressionam os zagueiros adversários, as mezzalas sobem nos volantes deles, os alas sobem nos laterais — vira marcação quase homem-a-homem no campo de ataque, sustentada pela sobra dos 3 zagueiros atrás.

**TRANSIÇÃO OFENSIVA (acabou de recuperar):** explode pra frente — dupla de ataque + alas disparando (descrito em interações). Cenário mais letal da formação.

**TRANSIÇÃO DEFENSIVA (acabou de perder):** o momento mais frágil. Se os alas estavam altos, há corrida de recomposição de 40-60m. O padrão de elite é **contrapressing imediato** da mezzala + pivô + atacante mais próximo para recuperar na hora (porque a alternativa — esperar — expõe as costas dos alas). Se não recupera em 5-6 segundos, o time **cai todo para o 5-3-2** e absorve.

**POR ESTADO DE PLACAR:**
- **Ganhando:** vira **5-3-2 reativo** — alas presos atrás, dois atacantes guardados para a transição. Formação ideal para 'fechar a loja' segurando resultado (uma das razões clássicas de se mudar PARA o 3-5-2 no 2º tempo defendendo vantagem).
- **Perdendo:** os alas sobem mais e ficam fixos no ataque (vira 3-4-3 / 3-2-5), às vezes sacrificando um meia por um terceiro atacante. Aumenta a vulnerabilidade nas costas, mas joga corpos no ataque.
- **Mudança tática comum:** treinadores migram **de 4 para 3 zagueiros no intervalo** para ou (a) blindar uma vantagem (vira 5-3-2), ou (b) ganhar o meio 3v2 quando estão sendo dominados no miolo. Ver um time mudar para 3-5-2 no 2º tempo é um sinal narrativo forte de mudança de intenção (segurar ou retomar o controle central)."

#### Exemplos de times e treinadores

**Times/treinadores de elite associados ao 3-5-2 / 3-4-1-2 (consenso, com base em conhecimento de domínio até 2024-2025):**

**Antonio Conte — a referência máxima do 3-5-2 / 3-4-3 moderno.** Juventus (título sequencial no início dos anos 2010), Chelsea (campeão da Premier League 2016-17 com o 3-4-3, virando a chave no meio da temporada), Inter de Milão (campeã italiana 2020-21 com 3-5-2, dupla Lukaku + Lautaro como o arquétipo do '9 referência + segundo atacante móvel'), Tottenham e Napoli. Conte é o nome que se cita para **alas de altíssima intensidade + dupla de ataque complementar + bloco 5-3-2 sólido**.

**Diego Simeone — Atlético de Madrid.** Embora mais conhecido pelo 4-4-2, frequentemente usa **3-5-2 / 5-3-2** como bloco reativo de altíssima compactação. É o arquétipo do uso **defensivo-pragmático** da formação (segurar resultado, transição com a dupla).

**Gian Piero Gasperini — Atalanta.** O grande nome do 3-4-1-2 / 3-4-2-1 **ofensivo e de marcação homem-a-homem agressiva**. Atalanta usa os meios-espaços e as infiltrações dos interiores como poucos; venceu a Europa League 2023-24. É o contraponto ofensivo a Conte/Simeone: 3 atrás para **atacar**, não para se proteger.

**Seleção Italiana (Conte, Euro 2016)** e **Argentina/diversas seleções sul-americanas** historicamente recorreram ao 3-5-2 pela tradição do líbero e da dupla de ataque.

**Thomas Tuchel — Chelsea (campeão da Champions League 2020-21)** com um **3-4-2-1 / 3-5-2** defensivamente blindado, mostrando o lado 'controle e solidez' da família de 3 zagueiros no mais alto nível.

**Nota de confiança:** os títulos e clubes citados são `consenso` de domínio futebolístico amplamente conhecido; para datas/escalações exatas de temporadas muito recentes (2025-26), trate como `inferência` e confirme via fonte se o produto for exibir o fato literal ao usuário."

---

### 3-4-3 / 3-4-2-1 (linha de 3 zagueiros, 4 no meio com 2 alas + 2 pivôs, e 3 no ataque — seja como tridente aberto 3-4-3 ou como 3-4-2-1 com dois "homens entre linhas" atrás de um centroavante)

#### Resumo e viés

**O que é.** O 3-4-3 (e sua prima 3-4-2-1) é uma família de formações construída sobre **três zagueiros centrais** e **dois alas (wing-backs)** que ocupam toda a extensão das laterais sozinhos. O número "4" do meio são, na verdade, **2 alas + 2 pivôs centrais** (`pivô` = volante de construção/proteção, o jogador que fica à frente da defesa organizando a saída). A diferença entre as duas variantes está na frente:

- **3-4-3 "puro"**: tridente ofensivo aberto — dois extremos (`extremo`/`ponta` = atacante de beirada que ataca pela linha de fundo) e um centroavante. É mais largo, mais vertical, busca isolar o atacante no 1x1.
- **3-4-2-1**: troca os dois extremos por dois **meias entre linhas** (chamados de "10s duplos", `segundo atacante` ou `interiores ofensivos`) que jogam por dentro, atrás de um único centroavante. É mais conectado, mais de combinação, mais de controle de bola no meio-campo central.

**Filosofia e viés.** A intenção-mãe dessas formações é **garantir superioridade numérica na primeira fase** (3 zagueiros + 1 ou 2 pivôs contra 1 ou 2 atacantes adversários = sobra de homem para sair jogando) e, ao mesmo tempo, **ocupar a largura máxima do campo com apenas 2 jogadores** (os alas), liberando todos os outros para povoarem o meio e o centro. É uma estrutura de **controle**, mas com uma ambiguidade importante: pode ser usada de forma **ofensiva e dominante** (Antonio Conte no Chelsea campeão, Bielsa) ou de forma **reativa e de bloqueio** (vira 5-4-1 ou 5-2-3 sem bola, defendendo com 5 atrás). Essa elasticidade — 3 vira 5, 3 na frente vira 1 com 2 apoios — é a alma da formação. O viés "declarado" no papel parece ofensivo (3 na frente), mas o viés "real" depende muito de quão alto os alas sobem e de quão agressivo é o pressing.

#### Papel de cada posição nesta formação

**Goleiro**

**Goleiro-líbero / primeiro construtor.** Em sistemas de 3 zagueiros que saem jogando, o goleiro vira o 'quarto homem' da linha de saída: recebe entre os zagueiros e cria superioridade numérica diante do(s) atacante(s) adversário(s). Precisa de pé bom para o passe curto sob pressão e para a bola longa por cima quando o pressing aperta. Defensivamente, como a linha de 3 costuma defender mais recuada e compacta (vira 5), ele cobre menos espaço nas costas do que num sistema de linha alta com 4 — mas tem de estar atento às bolas em profundidade quando os alas estão subidos e a defesa fica exposta em transição.

**Zagueiro central (3 deles)**

**O coração estrutural — e cada um dos 3 tem função diferente.** 

- **Zagueiro central do meio (o 'líbero'/'sweeper'):** é o cérebro da defesa. Joga atrás dos outros dois, lê o jogo, faz coberturas e frequentemente é quem **conduz a bola para o meio-campo** (sair driblando a primeira linha de pressão), porque tem campo livre à frente. Costuma ser o melhor com a bola dos três. 
- **Zagueiros dos lados (esquerdo e direito), os 'half-backs' ou zagueiros laterais:** são responsáveis por **cobrir o corredor lateral quando o ala sobe**, e por sair em condução pelo lado para puxar marcação. Quando o ala vira ponta no ataque, esse zagueiro lateral é quem segura o flanco — é a peça que evita que o time fique aberto na transição defensiva. Em fase ofensiva, frequentemente esse zagueiro avança alguns metros e quase joga como um 'lateral' improvisado para dar largura inferior. 

O grande requisito dos 3 é **defender em campo aberto, 1x1, com espaço atrás** (porque a linha de 3, quando os alas sobem, deixa muito gramado), e ser confortável com a bola — sem isso, o sistema não sai jogando e perde sua razão de existir.

**Ala / wing-back (2 deles, um por lado)**

**A posição que define o sistema — o motor de ida-e-volta.** O `ala` (também `wing-back`) é o jogador mais físico e de maior quilometragem do time: ele é **o único responsável por toda a largura do seu lado**, do escanteio defensivo ao escanteio ofensivo. 

- **Com bola:** sobe como um ponta/lateral muito avançado, dá largura, cruza, faz overlap (ultrapassagem por fora) e sustenta a largura para os de dentro jogarem por dentro. No 3-4-2-1 ele é ainda mais vital, porque os dois '10s' jogam por dentro — então **a largura inteira do ataque depende dos dois alas**. 
- **Sem bola:** recua e vira o 4º/5º defensor — a linha de 3 vira **linha de 5**. É por isso que se diz que o 3-4-3 'é um 5-4-1 disfarçado'. 

O ala é simultaneamente a maior força ofensiva (largura e profundidade grátis) e a maior vulnerabilidade do sistema: **se ele está subido e a bola é perdida, o corredor inteiro nas suas costas fica aberto** — esse é o gap clássico do sistema. Exige um perfil raro: resistência de maratonista, defender 1x1 contra ponta rápido e atacar com qualidade de cruzamento.

**Pivô / volante (2 deles — o 'duplo pivô')**

**O duplo pivô — a articulação entre defesa e ataque e o seguro contra contra-ataques.** São os dois jogadores centrais à frente da linha de 3. Tipicamente um é mais **defensivo/posicional** (`volante` de proteção, fica fixo na frente dos zagueiros, intercepta, é o 'âncora') e o outro mais **de progressão** (mais `box-to-box` ou meia construtor, recebe entre linhas, gira o jogo e às vezes chega na área). 

Funções centrais: 
- **Na construção:** oferecem linha de passe entre a defesa e o ataque; com os 3 zagueiros já dando superioridade atrás, frequentemente um pivô **desce entre/ao lado dos zagueiros** (formando uma saída em 4) enquanto o outro sobe — isso se chama 'pivô assimétrico'. 
- **Na proteção (o ponto crítico):** como os alas estão lá na frente, **os 2 pivôs são quem cobre todo o meio-campo central na transição defensiva.** Se o adversário tem 3 meias e o time tem só 2 pivôs, o sistema pode ficar em **inferioridade numérica no miolo** — esse é o calcanhar de Aquiles do 3-4-3 contra formações de losango/3 meias. 

A qualidade do duplo pivô (um saber quando subir sem o outro também subir) é o que separa um 3-4-3 dominante de um 3-4-3 que sofre buracos no meio.

**Extremo / ponta (2 deles — APENAS no 3-4-3 'puro')**

**Os atacantes abertos do tridente.** No 3-4-3 aberto, os dois extremos jogam altos e largos (ou em meia-largura). Diferente dos alas, eles **não têm grande obrigação defensiva de recompor a linha de fundo** — defendem mais 'à frente', fechando linhas de passe e pressionando a saída adversária. 

- Podem ser **pontas clássicos** (driblador 1x1, fundo e cruzamento) ou **pontas invertidos** (`extremo invertido` = canhoto pela direita / destro pela esquerda, que corta para dentro e finaliza/cria). 
- Como os alas já dão a largura, os extremos frequentemente jogam **mais por dentro, em meia-largura**, criando dois 'quartos' atacados ao mesmo tempo no mesmo lado (ala por fora + extremo por dentro = superioridade no flanco). 

O trade-off: dois extremos altos e largos significam **menos ajuda no meio** — reforça a inferioridade dos 2 pivôs no miolo se o adversário sobrecarregar o centro.

**Meia entre linhas / segundo atacante (2 deles — APENAS no 3-4-2-1, os '10s duplos')**

**Os dois cérebros criativos entre linhas — a marca registrada do 3-4-2-1.** Substituem os extremos do 3-4-3 puro. Jogam **por dentro, no espaço entre a defesa e o meio adversários** (a 'zona 14', o terreno mais perigoso do campo), atrás do centroavante. 

- São `meia-armador`/`10` por função (criar) mas com mobilidade de `segundo atacante` (chegar na área, fazer gols). 
- **Resolvem a inferioridade do meio:** como descem para receber, somam-se aos 2 pivôs e frequentemente criam um **4x3 ou 4x2 central** — é por isso que o 3-4-2-1 é mais 'de controle' e conexão que o 3-4-3, que é mais 'de largura e profundidade'. 
- Dependem TOTALMENTE dos alas para a largura: se os alas não sobem, o 3-4-2-1 fica estreito demais e fácil de defender (todo mundo amontoado no centro). 

Sem bola, costumam recuar para formar o **5-4-1 / 5-2-3**, ou pressionam a primeira saída adversária junto do centroavante.

**Centroavante (1 — referência única na frente)**

**A referência de área e o gatilho do pressing.** Na maioria das versões (e em todas do 3-4-2-1), há **um único centroavante**. Funções: 

- **Fixar os zagueiros centrais adversários** e atacar a profundidade/área, finalizando cruzamentos dos alas e jogadas dos 10s. 
- **Jogar de costas (pivô de ataque/`target`):** segurar a bola para os dois meias entre linhas chegarem — fundamental no 3-4-2-1, onde ele costas e os 10s aparecem. 
- **Iniciar a pressão:** como há só 1 atacante central, ele tem que **orientar o pressing** sozinho, cobrindo dois zagueiros — por isso o 3-4-2-1 frequentemente sobe um dos 10s para virar pressão em 'dois homens' na frente. 

No 3-4-3 com tridente, o centroavante tem mais companhia (os 2 extremos), mas em compensação recebe menos apoio curto entre linhas do que no 3-4-2-1.

#### Forças

**1. Superioridade numérica na primeira fase (saída de bola).** Três zagueiros + goleiro + um pivô que desce = quase sempre **um homem a mais** contra o primeiro bloco de pressão adversário (que costuma ter 1 ou 2 atacantes). Isso torna o time muito difícil de pressionar alto e facilita sair jogando limpo. (`consenso`)

**2. Largura máxima com gasto mínimo de jogadores.** Apenas 2 alas cobrem toda a extensão das laterais, liberando 8 jogadores para o miolo e o centro. Permite **sobrecarregar o centro** sem abrir mão da amplitude. (`consenso`)

**3. Sobrecargas (overloads) nos flancos.** Ala + zagueiro lateral + (extremo ou pivô) podem criar **3x2 ou 3x1 no corredor lateral**, dificílimo de defender para laterais isolados do adversário. (`consenso`)

**4. Elasticidade defensiva — vira 5 atrás na hora.** Sem bola, a linha de 3 + os 2 alas = **linha de 5**, que tapa toda a largura e neutraliza pontas e cruzamentos. Ótima base de bloqueio médio/baixo. É por isso que muitos times reativos adotam o sistema. (`consenso`)

**5. Defesa central robusta contra um 9 isolado.** Três zagueiros contra um único centroavante = **dois marcadores 'livres'** que podem fazer cobertura e dobra, enquanto um marca de perto. Mata o jogo de referência única adversária. (`consenso`)

**6. Transições ofensivas perigosas (no 3-4-2-1).** Os dois meias entre linhas, posicionados na zona 14 ao recuperar a bola, são **rampa de lançamento imediata** para o contra-ataque com 3 homens à frente (os 2 dez + o 9). (`consenso`)

**7. Difícil de marcar individualmente.** Os alas e os 10s entre linhas criam **dúvidas de marcação** para o adversário: quem pega o ala, o lateral ou o ponta? Quem pega o 10 que cai entre linhas, o volante ou o zagueiro? Essa ambiguidade gera os espaços. (`consenso`)

#### Fraquezas

**1. O grande gap: as costas dos alas (corredores laterais na transição).** Quando o ala está subido e a bola é perdida, **o corredor lateral inteiro nas suas costas fica vazio**. O zagueiro lateral tem de sair para cobrir, e ao fazê-lo **abre o espaço entre ele e o zagueiro do meio** (o 'meio-espaço'/half-space). É a vulnerabilidade número um do sistema: contra-ataque rápido pelos lados. (`consenso`)

**2. Inferioridade potencial no meio-campo central.** São só **2 pivôs** no centro. Contra um adversário com 3 meias (4-3-3, losango 4-4-2, 4-1-2-3), o time pode ficar **2x3 no miolo** e perder o controle da bola e da segunda bola. No 3-4-2-1, os 10s precisam descer para resolver isso — mas se não descem, o buraco existe. (`consenso`)

**3. Dependência física e técnica dos alas.** O sistema **morre se os alas não rendem**: ou não dão largura (e o ataque fica estreito), ou não recompõem (e a defesa fica aberta). É a posição mais difícil de preencher do futebol — perfil de atacante + de lateral + fôlego de maratonista. Sem dois alas de alto nível, o 3-4-3 não funciona. (`consenso`)

**4. Vulnerabilidade à largura adversária / pontas largos e rápidos.** Quando o sistema NÃO recua para 5 a tempo, **um zagueiro lateral fica exposto 1x1 contra ponta rápido** em campo aberto — ou pior, o ala é arrastado para dentro e o flanco fica desguarnecido. Times com pontas velozes pelos dois lados estressam o sistema. (`consenso`)

**5. Transição defensiva caótica se o time todo subiu.** Como a estrutura empurra muitos jogadores para frente (alas + pivô de progressão + frente), uma perda de bola no meio do ataque pega o time **com poucos homens atrás e em campo aberto** — exige pressing pós-perda (`gegenpressing`) impecável para não virar festival de contra-ataque. (`consenso`)

**6. Pode ficar estreito e estéril sem bola e sem os alas subindo (no 3-4-2-1).** Se os alas recuam por medo e os 10s não recebem, o time vira um **5-2-3 passivo**, amontoado no centro, sem largura ofensiva, fácil de defender — o ataque trava. (`consenso`)

**7. Bolas paradas e cruzamentos podem encontrar a área povoada mas mal-organizada.** Com 5 atrás, há corpo na área, mas a marcação por zona em sistemas de 3 pode gerar confusão de responsabilidades nas costas dos alas em escanteios/faltas laterais. (`inferência`)

#### Matchups (boa contra / sofre contra)

Pensando em **superioridade numérica por setor** (defesa / meio / ataque) e nos **gaps por zona**:

**É BOA contra:**

- **4-3-3 / 4-2-3-1 com um único centroavante:** seus **3 zagueiros x 1 atacante** = sobra de 2 defensores, e seus 2 alas neutralizam os pontas adversários recuando para linha de 5. Você domina o setor defensivo e ainda sai jogando com superioridade. (`consenso`)
- **4-4-2 clássico (2 linhas de 4):** o 4-4-2 tem só 2 meias centrais; seu duplo pivô + 10s descendo cria **superioridade central**, e os alas atacam os corredores que os laterais do 4-4-2 não conseguem cobrir sozinhos (porque os meias do 4-4-2 são poucos para dobrar). (`consenso`)
- **Times de 2 atacantes em geral:** a linha de 3 foi historicamente reinventada (por Conte, por exemplo) justamente para ter **um a mais contra 2 atacantes** — 3x2 atrás é o casamento perfeito. (`consenso`)

**SOFRE contra:**

- **4-3-3 / 4-1-2-3 com 3 meias e pontas largos:** aqui o adversário ataca seus **dois pontos fracos ao mesmo tempo** — ganha o **meio (3x2 contra seu duplo pivô)** E estica seus zagueiros laterais com pontas largos, abrindo o meio-espaço nas costas dos alas. É o matchup mais incômodo. (`consenso`)
- **Losango 4-4-2 (diamond) com 2 atacantes:** o losango **lota o centro com 3-4 jogadores** e seus 2 pivôs ficam em inferioridade no miolo; em compensação, o losango não tem largura — então é uma troca: você ganha os flancos (alas livres) mas pode perder o controle do centro. Jogo de quem explora melhor seu trunfo. (`consenso`)
- **Times que atacam diretamente o corredor do ala subido (transição rápida pelos lados):** qualquer adversário com um ponta veloz + bom passe vertical vai mirar **as costas do seu ala** assim que você perder a bola no campo de ataque. (`consenso`)
- **Bloco baixo + contra-ataque que te obriga a ter posse:** se o adversário fecha com 5-4-1 e te dá a bola, seu 3-4-2-1 pode ficar **estreito e estéril** se os alas não desequilibram — você tem a posse mas não fura. (`consenso`)

**Resumo dos gaps por zona:** o sistema **vence o centro defensivo e a primeira saída**, **vence os flancos no ataque** (alas livres), mas **arrisca perder o meio-campo central** (só 2 pivôs) e **deixa as costas dos alas** como zona de morte na transição. Adversários inteligentes atacam exatamente essas duas zonas: o miolo (com 3 meias) e o corredor atrás do ala (com ponta + verticalização).

#### Interações e automatismos

**1. Duplo pivô + linha de 3 (a saída de bola).** O automatismo-base: na construção, **um dos dois pivôs desce** para ao lado/entre os zagueiros (saída em '4' ou em '2-3'), enquanto o outro segura a posição de articulação. Isso garante linhas de passe escalonadas e a tal superioridade contra o pressing. A regra de ouro: **os dois pivôs nunca sobem juntos** — sempre há um de proteção. (`consenso`)

**2. Ala sobe ↔ zagueiro lateral cobre (o balancim do flanco).** Quando o ala avança para dar largura/cruzar, o **zagueiro lateral correspondente desliza para tampar o corredor**, e os outros dois zagueiros deslizam junto para não abrir buracos. Esse 'basculamento' (deslocamento coordenado da linha para o lado da bola) é o que mantém o time inteiro sem rasgos. Quando falha, nasce o contra-ataque pelo lado. (`consenso`)

**3. Ala + extremo/10 no mesmo flanco (a sobrecarga lateral).** No 3-4-3, ala por fora + extremo por dentro = **2x1 contra o lateral adversário**. No 3-4-2-1, ala por fora + 10 caindo no meio-espaço = mesma lógica. Cria-se o 'terço' (combinação de 3 jogadores num triângulo) que desmonta a defesa lateral por excesso de homens. (`consenso`)

**4. Os 2 meias entre linhas + centroavante (o trio de combinação do 3-4-2-1).** O 9 segura de costas, os dois 10s aparecem entre linhas, e os alas dão a largura — esse **triângulo central + 2 amplitudes** é o coração criativo do 3-4-2-1. Quando flui, gera o jogo de aproximação e tabela mais bonito da formação. (`consenso`)

**5. Pivô de proteção + zagueiro do meio (o seguro anti-contra-ataque).** Enquanto o time ataca, o **pivô posicional fica plantado à frente do zagueiro central**, formando uma 'primeira barreira' dupla no eixo. É a apólice de seguro contra a transição: esses dois precisam estar sempre escalonados, prontos para a falta tática ou a cobertura. (`consenso`)

**6. Gatilho de pressing: centroavante + um 10/extremo sobem juntos.** Para pressionar a saída adversária sem ficar 1x2, o sistema **sobe um segundo homem da frente** (um 10 no 3-4-2-1, um extremo no 3-4-3) para igualar a linha de pressão contra os dois zagueiros adversários. Sem esse gatilho coordenado, o pressing alto vazaria fácil. (`consenso`)

#### Variações por fase (com bola / sem bola / placar)

**Com bola (organização ofensiva):** A linha de 3 frequentemente **'abre' e um pivô desce**, transformando a estrutura numa saída de 4 (ou 2-3). Os **alas sobem alto** e o sistema, no campo de ataque, vira na prática um **3-2-5 ou 2-3-5** (3/2 atrás, 2/3 no meio, 5 na frente: 2 alas + 2 extremos/10s + 1 centroavante ocupando os cinco corredores). Essa ocupação dos 5 corredores ('ocupação racional do campo') é o ideal moderno — cada zona da largura tem um dono. No 3-4-2-1, fica mais 3-2-2-3 ou 3-2-4-1, com os 10s ligando o meio à frente.

**Sem bola (organização defensiva):** A transformação clássica: **3-4-3 vira 5-4-1 / 5-2-3** e **3-4-2-1 vira 5-4-1 ou 5-2-3**. Os alas recuam para a linha de fundo (vira **linha de 5**, tapando toda a largura), e a frente recua para formar bloco. O bloco pode ser **alto** (pressing, com a frente subindo nos zagueiros) ou **médio/baixo** (esperando, compactando os 30 metros finais). A altura da linha define o caráter: linha alta = controle agressivo (Bielsa); linha de 5 baixa = bloqueio reativo (muitos times de copa).

**Transição ofensiva (acabou de recuperar):** Bola recuperada → procura imediata pelos **alas em profundidade** (que estão largos e livres) ou pelos **10s entre linhas** (no 3-4-2-1) que viram rampa de contra-ataque. É um sistema com boa saída para o ataque rápido **se** os homens da frente estiverem posicionados.

**Transição defensiva (acabou de perder):** O momento mais perigoso. Duas respostas possíveis: **(a) gegenpressing** — pressão imediata pós-perda para recuperar antes que o adversário acesse as costas dos alas; **(b) recuo rápido** — o pivô de proteção e os zagueiros laterais correm para fechar o corredor do ala que subiu. Se nenhum dos dois funciona, é gol-contra-ataque pelo flanco.

**Por estado de placar (declarada vs real):** Um técnico pode **declarar** um '3-4-3 ofensivo' mas, ganhando o jogo, **na prática** os alas param de subir e o time vira um **5-4-1 reativo** que só defende — a forma 'real' diverge da 'declarada'. Inversamente, perdendo, um '3-4-2-1 de controle' vira **3-2-5 lançado**, com os zagueiros laterais virando quase laterais ofensivos e o time todo empurrado. **Sempre desconfie do número no papel: a altura dos alas e a agressividade do pressing revelam a forma real muito mais que a formação anunciada.** (`consenso`)

#### Exemplos de times e treinadores

**Antonio Conte** — o grande popularizador moderno da linha de 3 ofensiva: **Juventus** (2011-2014, hegemonia italiana com 3-5-2/3-4-3), **Chelsea campeão da Premier League 2016/17** (virou para o 3-4-3 no meio da temporada e deslanchou — Marcos Alonso e Victor Moses como alas o caso de estudo clássico do papel do wing-back), **Inter de Milão** (campeã italiana 2020/21) e **Tottenham**. Conte é a referência número 1 para o 3-4-3/3-4-2-1 de controle ofensivo. (`consenso`)

**Thomas Tuchel** — **Chelsea campeão da Champions League 2020/21** com um **3-4-2-1 / 3-4-3** de imensa solidez defensiva (linha de 3 com Rüdiger/Thiago Silva/Christensen, alas James e Chilwell, duplo pivô Jorginho-Kanté, 10s Mount/Havertz/Ziyech). Exemplo de como o 3-4-2-1 pode ser primariamente uma estrutura de controle e robustez. (`consenso`)

**Gian Piero Gasperini** — **Atalanta**, o caso mais radical e ofensivo do 3-4-2-1/3-4-3, com marcação individual agressiva e alas altíssimos; transformou um time médio numa máquina de gols e presença europeia constante. Referência para a versão mais vertical e de pressing. (`consenso`)

**Marcelo Bielsa** — usou variações de 3-3-1-3 / 3-4-3 com **linha alta, pressing homem-a-homem e verticalidade extrema** (Chile, Athletic Bilbao, e influência sobre o Leeds). Referência para o 3-4-3 mais arriscado e dominante. (`consenso`)

**Outros marcos:** o **Barcelona de Cruyff/Guardiola** transitando para 3 atrás na construção; **Conte/Mancini na seleção italiana**; e o uso amplo de **3-4-2-1/3-4-3 em seleções de Copa do Mundo** (formato que protege contra a falta de tempo de treino, por dar solidez de 5 atrás com ataque de 3). (`consenso`)

---

### 5-3-2 / 5-4-1 (bloco de 5 / linha de 5 defensores)

#### Resumo e viés

**O que é** (`consenso`): O "bloco de 5" é qualquer formação que defende com **cinco jogadores na última linha** — três zagueiros centrais mais dois jogadores de corredor lateral chamados **alas** (ou *wing-backs*: defensores-laterais com função ofensiva de ponta, daí o nome híbrido). Os dois desenhos mais comuns são o **5-3-2** (cinco defensores, três meias, dois atacantes) e o **5-4-1** (cinco, quatro meias, um centroavante isolado). Eles são primos próximos: muitas vezes o mesmo time alterna entre os dois conforme o estado do jogo — sai um atacante, entra um meia, e o 5-3-2 vira 5-4-1 sem trocar a espinha de cinco atrás.

**Filosofia / viés** (`consenso`): É uma família de formações de **viés reativo e de controle defensivo**. A premissa central é **densidade na largura defensiva**: cobrir os dois corredores laterais (as faixas próximas às linhas de fundo, por onde 80% dos cruzamentos nascem) sem desfalcar o miolo, porque você tem três zagueiros para cobrir a área e dois alas para os flancos. É a formação por excelência do time que aceita ter menos a bola, quer proteger uma vantagem, ou que tem inferioridade técnica e troca espaço por segurança. Mas atenção a um equívoco comum do iniciante: **5 atrás não é necessariamente defensivo**. Versões modernas (Conte, Gasperini, Bielsa em fases) usam o bloco de 5 de forma agressiva — com a bola, os dois alas sobem virando pontas e o time vira praticamente um 3-4-3 ou 3-5-2 ofensivo. A linha de 5 é uma estrutura de *base*, não uma sentença de "estacionar o ônibus". O que define se é ofensivo ou defensivo é a **altura da linha** (quão perto do gol adversário o time defende) e o comportamento dos alas, não o número 5 em si.

**Distinção 5-3-2 vs 5-4-1** (`consenso`): No **5-3-2** você mantém **dois atacantes** — referência ofensiva mais forte, melhor para transições rápidas (dois alvos para o contra-ataque) e para pressionar a saída de bola adversária em dupla. Custo: o meio com três pode ser superado numericamente por um meio adversário de quatro. No **5-4-1** você sacrifica um atacante por **um meia a mais**, fechando o meio com quatro — bloco mais compacto e difícil de penetrar, ao custo de deixar o centroavante isolado e depender muito mais de bola longa e bola parada para gerar perigo. Regra prática: 5-3-2 quando você ainda quer ameaçar e contra-atacar; 5-4-1 quando você decidiu se trancar e segurar o resultado.

#### Papel de cada posição nesta formação

**Goleiro**

**Pilar de bola parada defensiva e válvula de pressão** (`consenso`). Num bloco de 5, o goleiro defende geralmente atrás de uma área já super povoada — com 5 defensores, a área fica cheia, o que reduz a frequência de chutes limpos de dentro. Seu trabalho muda de natureza: menos defesas de cara a cara em campo aberto, mais **organização da barreira humana** em cruzamentos e escanteios (comandar quem marca quem). Na saída de bola, em times mais conservadores ele é a válvula de escape para a bola longa quando os três zagueiros estão pressionados; em times mais modernos com 5 atrás (Conte, por exemplo), o goleiro participa como **+1 na construção**, virando um sexto jogador de saída para criar superioridade contra o primeiro pressing. A precisão de passe longo importa quando o time busca o(s) atacante(s) direto.

**Zagueiro central — o do meio (líbero/cobertura)**

**O cérebro e a cobertura da linha de três** (`consenso`). Numa linha de três zagueiros, o central do meio é o organizador. Seu papel-chave é **cobertura** (*sweeper*/líbero moderno): quando um dos zagueiros laterais sai para acompanhar um atacante, é ele quem desce atrás para tapar o buraco. Ele raramente é arrastado para fora da posição — fica como o último seguro. Em times que constroem do fundo, costuma ser o melhor de pé entre os três, puxando a bola para frente (*ball-carrying*) e quebrando linhas com passe vertical, porque tem dois companheiros do lado para cobrir o risco. Pense nele como um volante-zagueiro: lê o jogo, distribui, cobre.

**Zagueiros centrais — os dois laterais da linha de três (marcadores)**

**Marcadores de profundidade com licença para sair da linha** (`consenso`). Os dois zagueiros que ladeiam o central do meio são tipicamente mais agressivos na marcação. Como têm cobertura garantida pelo líbero, eles podem **sair da linha para 'pegar' o atacante adversário** que vem receber entre as linhas — antecipar, dar o bote, anular a recepção. Esse é o mecanismo defensivo mais potente do bloco de 5: você marca o atacante por trás com um zagueiro extra sem desorganizar a linha, porque os outros dois cobrem. O zagueiro do lado do ala que subiu precisa ainda 'estender' para cobrir o corredor temporariamente vago. Exige leitura de quando seguir e quando segurar — sair na hora errada abre o gap que o adversário quer.

**Alas / wing-backs (lado direito e esquerdo)**

**A posição que define a formação — o motor dos dois flancos** (`consenso`). O ala (*wing-back*) é um híbrido entre lateral e ponta, e é a peça mais exigente fisicamente de todo o futebol: ele cobre o corredor inteiro, da linha de fundo defensiva à linha de fundo ofensiva, os 90 minutos. **Sem bola**, ele recua e forma a linha de cinco — vira praticamente um quinto defensor, fechando o flanco e a marcação do ponta/lateral adversário. **Com bola**, ele dispara para frente e vira a **largura ofensiva do time** — é ele quem dá amplitude, cruza e sustenta o ataque pelos lados, já que os três meias tendem a jogar mais por dentro. É o que permite o truque do bloco de 5 ser ofensivo: quando os dois alas sobem, o time ataca com 7 e defende com 3+2. O custo é brutal: se o time perde a bola com os dois alas adiantados, os **corredores ficam abertos** e o adversário ataca o espaço nas costas deles — o calcanhar de Aquiles clássico. Requer alas de motor inesgotável (consenso de elite: Achraf Hakimi, Theo Hernández, Reece James são os arquétipos modernos; `verificado-fetch` recomendável para confirmar clube/temporada atual).

**Volante / pivô (no 5-3-2 e no 5-4-1)**

**O escudo na frente dos três zagueiros** (`consenso`). No miolo dos três (ou quatro) meias, há quase sempre um jogador mais defensivo posicionado logo à frente da linha de zaga — o **pivô** (do inglês *pivot*: o eixo em torno do qual o meio gira) ou volante de contenção. Função: **proteger a zona 14** (a área logo à frente da grande área, de onde saem os passes mais perigosos e os chutes de fora), filtrar os passes que tentam chegar entre as linhas, e fazer a primeira cobertura quando um ala sobe. Ele é a ponte entre a defesa de 5 e o ataque. No 5-4-1 com duplo volante, são dois desses lado a lado (duplo pivô), tornando o meio quase impenetrável centralmente. É o jogador que 'segura a casa' enquanto os mais ofensivos se soltam.

**Meias box-to-box / interiores (os dois ao lado do volante no 5-3-2)**

**Os pulmões do meio de três** (`consenso`). Num 5-3-2 clássico, ao lado do pivô há dois **box-to-box** (literalmente 'de área a área': meias que correm o campo inteiro, defendem na própria área e chegam para finalizar na adversária). Eles fazem o trabalho que num 4-3-3 seria dividido por mais gente: ajudam o ala na marcação do flanco quando ele é puxado, cobrem o pivô quando ele é arrastado, e na fase com bola são eles que dão suporte aos atacantes e chegam de segunda linha. São a razão de o meio-de-três do 5-3-2 não ser tão facilmente superado: eles compensam o número correndo muito. Quando um deles tem mais qualidade técnica, joga como **mezzala** (interior 'meia-asa', do italiano: o interior que abre para o corredor entre o ala e a defesa, criando triângulos no lado) — a arma para furar bloco baixo pelos meios-espaços (os corredores intermediários entre o centro e a lateral).

**Meias laterais / quarto homem do meio (no 5-4-1)**

**Os fechadores do flanco no bloco de quatro** (`consenso`). Quando o desenho vira 5-4-1, a linha de meio ganha um quarto jogador e se espalha mais para os lados, virando dois meias mais por dentro e dois mais abertos (ou um meio de quatro em linha). A função dominante aqui é **defensiva e de compactação**: esses meias laterais dobram a marcação no flanco junto com o ala, criando 2v1 contra o ponta adversário, e diminuem ainda mais o espaço entre as linhas. O 5-4-1 é, em essência, dez jogadores formando dois muros de cinco e quatro à frente do gol. O preço é a quase ausência de saída para o contra-ataque, já que o único atacante fica longe e sem apoio imediato.

**Segundo atacante (no 5-3-2)**

**O parceiro de transição e o homem entre as linhas** (`consenso`). No 5-3-2 a dupla de ataque tem papéis complementares. O segundo atacante costuma ser o mais móvel — flutua entre a linha de zaga e o meio adversário, recebe de costas ou nas costas dos volantes deles, e é o **principal destino da transição rápida**: quando o time recupera a bola, é nele que se busca a tabela ou o passe para correr. Em times que pressionam, ele e o centroavante formam a **dupla de primeiro pressing**, fechando a saída pelos dois zagueiros centrais adversários. É o que dá ao 5-3-2 a veia ofensiva que o 5-4-1 não tem.

**Centroavante (no 5-3-2 ao lado do parceiro; no 5-4-1 isolado)**

**A referência fixa — âncora do ataque** (`consenso`). O centroavante (*number 9*) é o ponto de fixação ofensivo. No **5-3-2** ele divide a carga: segura a bola de costas (*hold-up play*) para o time subir, ataca a profundidade, e é o alvo principal dos cruzamentos dos alas — frequentemente um '9' mais forte de jogo aéreo. No **5-4-1**, isolado, seu trabalho fica heroico e ingrato: ele precisa **segurar a bola sozinho** contra dois ou três zagueiros para dar tempo de o time subir, sem quase nenhum apoio próximo. Por isso o 5-4-1 pede um '9' forte fisicamente, bom de proteger a bola e de ganhar bola aérea — porque grande parte do perigo ofensivo virá de bola longa nele e de bola parada. É um papel de sacrifício.

#### Forças

**1. Superioridade numérica e densidade na largura defensiva** (`consenso`). Com cinco na última linha, o time tem **três zagueiros para a área e dois alas para os flancos**, o que significa que defender os cruzamentos não custa abrir o miolo — você não precisa puxar um zagueiro para o corredor e expor o centro. É a melhor estrutura existente para **anular ataques pelos lados e bombardeio de cruzamento**, porque há sempre gente de sobra na área e os flancos estão cobertos por padrão.

**2. Marcação do homem entre linhas sem desorganizar** (`consenso`). O mecanismo do zagueiro lateral que **sobe da linha de três para 'pegar' o meia/atacante** adversário que recebe entre as linhas — com cobertura garantida pelo líbero — neutraliza o tipo de jogador que mais machuca blocos de quatro: o meia-armador (10) que recebe de frente para o gol. O bloco de 5 mata essa recepção na origem.

**3. Plataforma ideal para contra-ataque (especialmente o 5-3-2)** (`consenso`). Com dois atacantes já posicionados à frente e dois alas que disparam pelos corredores na recuperação, o 5-3-2 transita com **4-5 jogadores em onda** quase imediatamente. Aceita-se ter pouca bola justamente porque cada recuperação vira ameaça direta. É a formação clássica do time que mata o jogo no contra-ataque.

**4. Flexibilidade de placar embutida** (`consenso`). A mesma estrutura permite ataque (alas sobem, vira 3-4-3 ofensivo) e defesa (alas descem, vira 5-4-1 fechado) **sem trocar peças** — só mudando a altura da linha e o comportamento dos alas. O treinador 'aperta ou afrouxa' o bloco conforme o jogo pede, gerenciando o resultado com um único desenho.

**5. Robustez contra dois atacantes e contra times de muito cruzamento** (`consenso`). Contra ataques de duas referências, a linha de três sempre tem **3v2 na área** (sobra um zagueiro livre para cobrir/sobrar). É a resposta natural a adversários que jogam com dupla de ataque forte.

#### Fraquezas

**1. Inferioridade ou paridade no meio-campo** (`consenso`). Este é o calcanhar de Aquiles estrutural. No **5-3-2**, três meias enfrentam frequentemente um meio adversário de quatro (do 4-3-3, 4-2-3-1, 4-4-2 losango). O adversário ganha **3v3 ou 3 contra 2 efetivo** no centro, controla a posse, e o time de 5 vira espectador — cede o **controle do jogo** e fica preso atrás. É por isso que times com 5-3-2 costumam ter PPDA alto (poucas ações de pressão por posse adversária — ou seja, pressionam pouco) e PPDA é a métrica de quão agressivo é o pressing: PPDA baixo = pressiona muito; alto = espera.

**2. Os corredores nas costas dos alas** (`consenso`). Quando os alas sobem para atacar, os **flancos ficam expostos**. Se o time perde a bola com os alas adiantados, o adversário ataca o espaço atrás deles — e como os três zagueiros precisam cobrir muita largura, abre-se o **canal entre o zagueiro lateral e o ala que ficou para trás**. É o gap clássico que times com pontas rápidos e laterais ofensivos exploram com diagonais e bola nas costas.

**3. Dependência física brutal dos alas** (`consenso`). A formação só funciona se os dois alas tiverem motor para cobrir o corredor inteiro os 90 minutos. Se um ala cansa, se machuca, ou não tem o perfil, **um lado inteiro do campo desaba** — ou a defesa abre, ou o ataque perde toda a largura. É a posição mais difícil de preencher e a primeira a comprometer o sistema.

**4. Pobreza ofensiva no 5-4-1 e isolamento do centroavante** (`consenso`). Quando vira 5-4-1, o time fica **reativo demais**: o único atacante fica isolado, sem apoio, e a criação ofensiva quase some — sobra bola longa e bola parada. Contra um bloco baixo de 5-4-1, o jogo pode 'morrer' em zero a zero ou under, e o time de 5 raramente vira o jogo se sair atrás no placar.

**5. Vulnerabilidade a sobrecarga (overload) de um lado** (`consenso`). Times espertos puxam o bloco de 5 inteiro para um lado com circulação rápida e depois **invertem o jogo** (*switch*) para o lado oposto, onde o ala está sozinho contra ponta + lateral que chega. O tempo que a linha de cinco leva para deslizar de um corredor ao outro é maior do que o de uma linha de quatro, e a inversão rápida explora exatamente isso.

**6. Convite à posse e ao cerco** (`consenso`). Ao ceder a bola por desenho, contra um adversário paciente e tecnicamente superior o time pode passar 70-80% do jogo defendendo — e bloco que defende muito tempo eventualmente erra, comete falta perigosa, ou cede o gol de bola parada. A 'muralha' tem prazo de validade dentro de um jogo.

#### Matchups (boa contra / sofre contra)

**Análise por superioridade numérica setorial (defesa / meio / ataque) e gaps por zona** (`consenso`).

**É BOA contra (vantagem por setor):**

- **Contra 4-3-3 e 4-2-3-1 com pontas abertos**: o bloco de 5 ganha **3v1 ou 3v2 no flanco** (ala + zagueiro lateral contra o ponta; às vezes com box-to-box dobrando). Anula a principal arma desses sistemas — a largura e o cruzamento — e fecha o canal do ponta. Os pontas ficam 'comidos' no corredor.
- **Contra 4-4-2 com dois atacantes fixos**: a linha de três tem **3v2 garantido na área** — sempre sobra um zagueiro de cobertura. Os atacantes adversários não acham espaço entre os zagueiros. É um matchup confortável.
- **Contra times de muito cruzamento e bola aérea ofensiva**: cinco defensores + três zagueiros normalmente altos vencem o duelo aéreo na área por peso numérico.
- **Contra times que dependem do meia-armador (10) entre linhas**: o zagueiro lateral sobe e mata a recepção, como descrito. O '10' clássico sofre muito contra bloco de 5.

**SOFRE contra (desvantagem por setor / gap explorado):**

- **Contra 4-3-3 / 4-2-3-1 que sobrecarregam o MEIO**: aqui o adversário ganha o setor que mais importa. Quatro meias contra três = **superioridade central**, posse, e o time de 5 cede o controle. A zona 14 (à frente da área) fica disputada em desvantagem.
- **Contra 3-5-2 / 3-4-3 espelhado, mas com meio de cinco**: quando o adversário também tem 5 atrás mas **cinco no meio**, ele ganha o miolo. O confronto vira batalha de alas (1v1 nos dois corredores) e quem tiver os melhores alas leva.
- **Contra times de inversão rápida (switch) e amplitude por dentro**: como dito, puxar o bloco para um lado e inverter explora a lentidão de deslize da linha de cinco. O ala isolado do lado fraco vira **1v2** (ponta + lateral chegando).
- **Contra falsos-9 e meio que joga 'entre as linhas' por dentro, sem pontas fixos** (estilo Guardiola): isso **paralisa os alas** — eles não têm quem marcar no corredor (não há ponta), ficam em dúvida entre subir e segurar, e o adversário ataca os **meios-espaços** (os canais entre o zagueiro lateral e o ala), justamente as zonas mais difíceis de cobrir num bloco de 5. É o antídoto teórico clássico ao bloco de 5.
- **Gap por zona resumido**: as zonas mais frágeis são **os meios-espaços (entre zagueiro lateral e ala)** e **as costas dos alas quando sobem**. As zonas mais fortes são **a área central** (3 zagueiros) e **os corredores em fase puramente defensiva** (ala recuado fecha).

#### Interações e automatismos

**1. Tripé zagueiro-lateral + líbero + ala (a engrenagem da defesa)** (`consenso`). O automatismo fundador: quando o **ala sobe**, o **zagueiro lateral 'estende'** para cobrir parte do corredor, e o **líbero (central do meio) desliza** para tapar o buraco que o zagueiro lateral deixou. É uma reação em cadeia de três peças que mantém a área sempre coberta. Se uma falha (o líbero não desliza, ou o ala não volta a tempo), abre-se o gap. Esse rodízio ensaiado é o que separa um bloco de 5 competente de uma linha de cinco que só 'estaciona'.

**2. Ala + box-to-box (ou meia lateral): o 2v1 do corredor** (`consenso`). No flanco, o ala raramente está sozinho na fase defensiva: o box-to-box (no 5-3-2) ou o meia lateral (no 5-4-1) **dobra a marcação** contra o ponta adversário, criando 2v1. Na fase ofensiva, esse mesmo par faz **sobreposição** (*overlap*: um corre por fora enquanto o outro tem a bola por dentro) ou tabela para furar o flanco. É a parceria que sustenta o lado inteiro.

**3. Pivô + dupla de zagueiros como 'caixa' de proteção** (`consenso`). O volante de contenção se posiciona à frente do líbero formando uma mini-estrutura que protege a zona 14 e filtra os passes verticais. Quando o time tem **duplo pivô** (5-4-1), essa proteção dobra e o centro fica quase intransponível — ao custo de criatividade.

**4. Dupla de ataque do 5-3-2 como unidade de pressing e de transição** (`consenso`). Os dois atacantes trabalham em par: fecham a saída pelos dois zagueiros centrais adversários no pressing (cada um marca um), e na transição um segura a bola enquanto o outro corre na profundidade. Sem essa coordenação, o 5-3-2 perde tanto a capacidade de pressionar quanto a de contra-atacar.

**5. Os dois alas como 'tesoura' ofensiva sincronizada** (`consenso`). O segredo do bloco de 5 ofensivo é os **dois alas subirem juntos** para dar largura simultânea nos dois lados, alargando a defesa adversária e abrindo os meios para os interiores/atacantes infiltrarem. Quando funciona, vira o 3-4-3 ofensivo de Conte. Quando dessincroniza (um sobe, o outro fica), perde-se a amplitude e a transição vira risco.

#### Variações por fase (com bola / sem bola / placar)

**COM BOLA (organização ofensiva)** (`consenso`): A 'declarada' linha de 5 raramente permanece como 5 na posse. O desenho **respira para frente**: os dois alas avançam até a linha do meio-campo ou além, e a forma real vira **3-4-3 / 3-5-2 / 3-4-2-1** — só três atrás na construção, com largura máxima pelos alas e os meias por dentro. Em times mais conservadores, um ou ambos alas ficam mais contidos e a construção é mais direta (bola longa no centroavante). O líbero frequentemente sobe alguns metros conduzindo a bola, virando um quase-volante na saída.

**SEM BOLA (organização defensiva)** (`consenso`): Os alas recuam e a forma real vira o **5-3-2 / 5-4-1 'de verdade'** — duas linhas compactas (5 + 3, ou 5 + 4) à frente do gol. A **altura da linha** é o regulador-mestre: bloco **alto** (Conte/Gasperini) pressiona a saída adversária com a dupla/quarteto e sobe a linha de cinco, aceitando o risco nas costas; bloco **médio-baixo** espera no próprio campo, compactando os 30 metros finais e cedendo a bola — o uso mais comum, defensivo. O espaço entre as linhas (zaga e meio) é mantido curto (15-20m) para não dar a zona 14 ao adversário.

**POR ESTADO DE PLACAR (declarada vs real)** (`consenso`): Aqui mora a maior 'mentira' do desenho declarado. Um time pode entrar **declarado 5-3-2 ofensivo** (alas altos, bloco alto, pressionando) e, ao abrir o placar, **virar 5-4-1 reativo** sem trocar ninguém — sacrifica um atacante por um meia (ou só baixa a linha e segura os alas) e se transforma numa muralha de gerenciamento. O inverso também: time que começou 5-4-1 fechado, atrás no placar, **solta os dois alas e o líbero** e vira um 3-4-3 que joga tudo no ataque, deixando os flancos abertos. **Implicação para leitura de jogo**: a formação 'declarada' no papel diz pouco sobre o que o time fará — o comportamento dos **alas** (sobem ou seguram?) e a **altura da linha** são os dois sinais que revelam a intenção real, e ambos mudam dinamicamente com o relógio e o placar. Um bloco de 5 protegendo 1-0 no segundo tempo é o cenário clássico de jogo travado / poucos chutes limpos.

#### Exemplos de times e treinadores

**Antonio Conte** (`consenso`) — o grande modernizador do bloco de 5 ofensivo. Campeão com Juventus, Chelsea (3-4-3 que defende em 5-4-1, Premier 2016/17), Internazionale (Scudetto 2020/21 com 3-5-2 e a dupla Lukaku-Lautaro) e Tottenham. Seu 3-5-2/5-3-2 é o arquétipo do uso agressivo: alas-motor obrigatórios, dois box-to-box correndo, pressing alto. (`verificado-fetch` recomendável para clube/temporada exata atual.)

**Gian Piero Gasperini** (`consenso`) — Atalanta. Levou o bloco de 3/5 atrás ao extremo do jogo agressivo, com marcação individual em todo o campo (*man-marking*) e alas altíssimos — provavelmente o time mais ofensivo já montado sobre uma base de três zagueiros, frequentemente o melhor ataque da Serie A apesar de jogar com 3 zagueiros.

**Diego Simeone** (`consenso`) — Atlético de Madrid. O outro polo: o 5-3-2 / 5-4-1 como instrumento de controle, bloco médio-baixo, compactação obsessiva e letalidade em transição e bola parada. O arquétipo do bloco de 5 *reativo* e gestor de resultado.

**Seleção Italiana (Conte, Euro 2016) e Seleção Belga / vários combinados internacionais** (`consenso`) — o 3-5-2/5-3-2 é recorrente em copas por exigir menos automatismos de posse e oferecer solidez rápida.

**Antonio Conte / Thomas Tuchel no Chelsea, e diversos times de Premier League em jogos contra os 'big six'** (`consenso`) — o 5-4-1 / 5-3-2 é a escolha-padrão do time inferior que visita um grande: fecha os corredores, aceita a posse e aposta no contra-ataque e na bola parada. É, no futebol de clubes europeu recente, a formação 'do azarão organizado' por excelência.

---

### 4-3-1-2 (sem pontas) — também chamada de "diamante estreito" ou "midfield diamond"

#### Resumo e viés

O **4-3-1-2** é um sistema de **quatro defensores, um meio-campo em losango (diamante) de quatro homens e dois atacantes**. A leitura de "três no meio + um 10" (4-3-1-2) e a leitura de "losango" (4-1-2-1-2) descrevem a MESMA estrutura vista de ângulos diferentes: há um **volante na base** (vértice de baixo do losango), **dois interiores nos lados** (as quinas), e um **meia-armador/10 na ponta** (vértice de cima), com **dois atacantes** na frente.

A identidade central — e o viés filosófico — é a **renúncia consciente à largura natural**. Não há pontas (jargão: *ponta/extremo* = atacante aberto que joga colado à linha lateral). Por isso a formação é **densa e estreita no eixo central (corredor central do campo)**, comprando uma **superioridade numérica brutal no meio** ao custo de **deixar as laterais descobertas**. É um sistema de **controle e domínio central**: quer ter a bola, criar superioridade no miolo e atacar por dentro, sufocando o relógio do jogo no centro.

O viés é **ofensivo-controlador**, não reativo. Times que escolhem o diamante normalmente querem ditar o ritmo, ter posse alta e gerar combinações curtas entre 10, interiores e os dois homens de frente. A largura, que nesse sistema **não vem dos atacantes**, precisa obrigatoriamente ser **fabricada pelos laterais** — esse é o trade-off estrutural que define tudo: a formação **terceiriza a largura para a defesa**, e isso vira a sua maior força e sua maior fragilidade ao mesmo tempo.

#### Papel de cada posição nesta formação

**Goleiro**

Goleiro-líbero participativo. Como o diamante puxa todo o time para o centro e exige laterais muito altos, o goleiro vira o **homem extra na construção** (jargão: *construir/sair jogando* = iniciar a jogada com passes curtos a partir do fundo). Ele dá a opção de passe que o time perde por não ter ponta para virar o jogo. Precisa de bom jogo de pés e de cobertura de profundidade, porque os dois laterais sobem juntos e deixam espaço nas costas da linha — em transição defensiva, o goleiro é a primeira linha de varredura para bolas longas lançadas no espaço.

**Zagueiro central (x2)**

Dupla de zaga em linha de dois. No diamante eles têm **mais proteção central** que em quase qualquer sistema (o volante senta na frente deles), mas pagam isso defendendo uma **base mais larga do que conseguem cobrir**: quando os dois laterais sobem, a defesa efetiva vira praticamente uma dupla de zaga responsável por toda a largura do campo. Por isso o par ideal combina **um zagueiro de saída** (bom de passe, inicia a construção) com um **zagueiro de cobertura/velocidade** que defende o espaço aberto pelas costas dos laterais. A função de **defender em arrastão lateral** (deslocar para cobrir a faixa que o lateral abandonou) é constante.

**Lateral (x2)**

**A posição mais importante e mais sobrecarregada do sistema.** Como não há pontas, os laterais são os **únicos provedores de largura** — eles são, na prática, ala/wing-back disfarçados de lateral. Com a bola, sobem altíssimo para dar amplitude (jargão: *amplitude/largura* = esticar o campo na horizontal para afastar os marcadores e abrir o meio), viram quase pontas e são a principal fonte de **cruzamento** (bola lançada da lateral para a área) e de **sobreposição** (jargão: *overlap* = o lateral ultrapassa por fora o companheiro de dentro). Sem bola, precisam fazer o caminho de volta inteiro — é o trabalho físico mais brutal do time. A formação **vive ou morre pela qualidade física e técnica dos laterais**: se eles não dão a largura, o ataque vira um aglomerado sem ângulo; se eles não voltam, o flanco fica escancarado.

**Volante / pivô (base do losango)**

O **'1' da leitura 4-1-2-1-2** — o vértice de baixo. Joga como **pivô único de contenção** (jargão: *pivô/volante de marcação* = o meio-campista mais recuado, que protege a zaga e organiza a saída). Suas funções: blindar o espaço entre as linhas, ser o **pêndulo de cobertura lateral** que escorrega para tapar o buraco quando um lateral está subido, e ser o **metrônomo da posse** que recebe da zaga e distribui. É a peça mais exposta da formação: como joga **sozinho na base** de um sistema sem largura, fica isolado contra times que atacam por dentro com dois homens entre linhas. A escolha entre um volante mais destruidor (rouba bola) ou mais regista (organiza) muda toda a cara do time. É o ponto onde o diamante mais sofre — um único pivô para cobrir um meio teoricamente lotado.

**Interior / mezzala (x2 — as quinas do losango)**

Os **dois interiores** (jargão: *mezzala* = 'meia-ala' em italiano, o interior que joga nos meios-espaços, inclinado para um lado) são o **motor box-to-box do diamante** (jargão: *box-to-box* = meia que cobre as duas áreas, ataca e defende). Eles ocupam os **meios-espaços** (jargão: *meio-espaço/half-space* = os corredores entre o centro e a lateral, zonas douradas de criação). Funções: dar opção interna de passe, fazer **terceiro-homem** com o 10 e os atacantes, chegar à área em segunda onda, e — crucialmente — **cobrir a largura defensiva quando o lateral do seu lado está subido ou foi superado**. São eles que pagam a conta defensiva da ausência de pontas: precisam sair do centro e fechar a lateral, o que estica o losango e abre o miolo. Volume de corrida é inegociável.

**Meia-armador / 10 (ponta do losango)**

O **vértice de cima do losango**, o cérebro criativo. Joga **entre as linhas** do adversário (jargão: *entrelinhas* = o espaço entre o meio-campo e a zaga do rival, onde o marcador não sabe quem te pega), na zona mais valiosa do campo. Recebe de costas para a defesa, gira e **alimenta os dois atacantes**. Como a formação é estreita, o 10 tem **dois homens de frente sempre próximos** para combinar — o diamante é desenhado para maximizar essa relação 10+2. Defensivamente, o 10 costuma ser o **gatilho do pressing** (joga junto dos atacantes para pressionar a saída do rival) ou simplesmente o homem que o time 'esconde' do trabalho defensivo. A formação só funciona se o 10 for de altíssimo nível: ele é o tradutor entre o meio lotado e o ataque.

**Segundo atacante / centroavante (x2)**

**Dupla de ataque**, e a chave é a complementaridade. O modelo clássico é **um '9' de referência** (jargão: *centroavante/'9'* = atacante de área, fixa os zagueiros, segura a bola de costas, finaliza dentro) **+ um '9 e meio'/segundo atacante** (joga mais solto, cai entre linhas, associa com o 10, ataca o espaço nas costas da zaga). Como não há pontas para cruzar de fora com volume, os dois atacantes precisam se **mover bem por dentro**, atacar a profundidade e combinar em espaço curto. A proximidade entre eles é o coração ofensivo do sistema: paredes, tabelas e diagonais cruzadas (um arrasta o marcador, o outro ataca o espaço criado). Em times sem largura, esses dois também precisam **atacar a bola dos laterais** (cabecear e finalizar cruzamentos), já que são os únicos alvos na área.

#### Forças

**1. Superioridade numérica esmagadora no meio-campo.** Com quatro homens em losango no eixo central, o diamante quase sempre cria **superioridade no miolo** (jargão: *superioridade numérica* = ter mais jogadores que o adversário numa zona). Contra um meio de dois (ex.: 4-4-2) é 4 contra 2; contra um meio de três (4-3-3) é 4 contra 3. Isso permite **dominar a posse no centro**, achar sempre o homem livre e controlar o ritmo.

**2. Densidade central e proximidade entre as peças ofensivas.** 10 + 2 atacantes muito próximos geram **combinações curtas de alta qualidade** (tabelas, paredes, terceiro-homem). É o sistema ideal para um trio criativo que se entende.

**3. Anula o jogo central do adversário sem bola.** O bloco estreito **fecha o corredor central** e força o rival a jogar por fora, onde, em tese, se machuca menos. Contra times que querem construir por dentro, o diamante sufoca.

**4. Dois atacantes fixando a zaga.** Manter dois homens de frente **ocupa permanentemente os dois zagueiros centrais** do adversário, dificultando que eles saiam para o jogo e dando referência constante para transições.

**5. Largura agressiva por fora gera sobrecarga lateral.** Quando o lateral sobe e o interior do mesmo lado o acompanha, cria-se **superioridade momentânea na lateral** (2v1 ou 3v2 contra o lateral adversário isolado), justamente porque o rival não espera ataque pelo flanco de quem não tem ponta.

#### Fraquezas

**1. Vulnerabilidade crônica às laterais (o calcanhar de Aquiles).** Sem pontas, **ninguém nasce defendendo a faixa lateral**. Quando o lateral sobe, o flanco fica vazio até o interior ou o volante escorregarem para tapar. Contra times com pontas rápidas e bons cruzadores, o diamante **sofre cronicamente pelos lados** — é a fragilidade que define o sistema.

**2. O volante único fica isolado e exposto.** Um só pivô na base tem que cobrir um espaço imenso. Times que jogam com **dois homens entre linhas** ou um 4-3-3 com pontas que vêm por dentro conseguem **puxar e superar o volante**, abrindo o caminho direto para a zaga.

**3. Exige laterais de elite e fôlego inesgotável.** A formação **terceiriza toda a largura para os laterais**. Se eles não têm motor para subir e voltar 90 minutos, ou o ataque perde amplitude (vira aglomerado sem ângulo) ou a defesa fica aberta. É uma dependência estrutural perigosa.

**4. Em transição defensiva, os flancos são autoestradas.** No momento em que o time perde a bola (jargão: *transição defensiva* = os segundos imediatos após perder a posse) com os dois laterais subidos, o adversário tem **corredores laterais inteiros livres** para correr. É quando o diamante mais sangra — contra-ataques pelas pontas.

**5. Pouca variabilidade de cruzamento.** Como o cruzamento depende quase só dos laterais, um adversário que **dobra a marcação no lateral** (jargão: *dobra* = dois marcadores sobre o homem da bola) corta a única fonte de bola na área para os dois atacantes.

#### Matchups (boa contra / sofre contra)

**A favor — contra quem o diamante brilha:**

- **Contra 4-4-2 (meio de 2):** matchup ideal. **4 contra 2 no meio** = superioridade central total. O diamante domina a posse, atrai os dois volantes do rival e usa o 10 livre entre linhas. O 4-4-2 quase não consegue tirar a bola do diamante no centro.
- **Contra 4-2-3-1 / times que constroem por dentro:** o bloco estreito **fecha o corredor central** e estrangula a saída de bola do adversário, empurrando-o para fora onde ele é menos perigoso.
- **Contra times sem pontas verticais e velozes:** se o rival não tem quem ataque a faixa lateral livre, a maior fraqueza do diamante **simplesmente não é explorada** — e aí só sobram as forças.

**Contra — onde o diamante sofre:**

- **Contra 4-3-3 com pontas abertas e rápidas:** o pior matchup. Os **dois pontos abertos do 4-3-3 atacam exatamente a faixa que o diamante deixa livre** (a lateral). Cada ponta isola o lateral do diamante em 1v1, e quando o lateral do diamante está subido, é gap total. Além disso, o 4-3-3 tem **três no meio contra os quatro do diamante** — não é inferioridade gritante, e os pontas puxam os laterais do diamante, esvaziando o apoio central.
- **Contra 3-4-3 / 3-5-2 com alas (wing-backs):** os **alas** (jargão: *ala/wing-back* = homem de lateral que joga altíssimo, função quase de ponta num time de 3 zagueiros) atacam a largura que o diamante não cobre, e o trio de zaga do rival neutraliza os dois atacantes (3 contra 2 na defesa). É um choque de **largura (deles) contra centro (do diamante)** — e a largura costuma vencer em campo aberto.
- **Contra 4-5-1 / blocos baixos e largos:** se o adversário **recua, fecha o centro e renuncia à posse**, ele anula a superioridade central do diamante (não adianta ter 4v2 num meio sem espaço) e **convida o diamante a atacar pelas laterais**, justamente onde o diamante é mais pobre de recursos.

**Resumo por setor:** o diamante **ganha o setor do meio** quase sempre, **empata/fica em desvantagem no ataque** (2 atacantes contra 2 ou 3 zagueiros) e **perde por construção o setor da largura defensiva**. Quem souber atacar a lateral o derruba; quem insistir no centro, alimenta a força dele.

#### Interações e automatismos

**1. Lateral + interior do mesmo lado (a sociedade que fabrica a largura).** Como não há ponta, a amplitude nasce da **dupla lateral-interior**: o lateral sobe e abre, o interior (mezzala) ocupa o **meio-espaço** ao lado dele dando a opção interna. Eles trocam de altura constantemente (um sobe, o outro cobre) — é o **rodízio** que sustenta o flanco com e sem bola. Sem esse automatismo, o diamante não tem como atacar e defender os lados ao mesmo tempo.

**2. Volante + dupla de zaga (o triângulo de blindagem central).** O volante senta na frente dos dois zagueiros formando um **triângulo de saída** (recebe, gira, distribui) e, defensivamente, fecha o espaço entre linhas. Esse trio é o **pilar de equilíbrio**: enquanto os laterais e interiores atacam, ele segura a casa.

**3. 10 + os dois atacantes (o motor criativo).** O coração ofensivo. O 10 recebe entrelinhas e os dois homens de frente **se movem em referência a ele**: um cai para combinar (parede), o outro ataca a profundidade no espaço criado. Tabelas curtas no último terço dependem inteiramente dessa proximidade tripla — é por ela que o diamante existe.

**4. Os dois interiores como pêndulo defensivo.** Quando um lado ataca, o interior do **lado oposto** desliza para o centro para não deixar o volante sozinho. Esse **balanço dos interiores** (um vai, o outro compensa) é o que evita que o time se parta no meio quando ataca por um flanco.

#### Variações por fase (com bola / sem bola / placar)

**Com bola (organização ofensiva):** o losango **se alarga**. Os laterais sobem altíssimo (viram quase pontas), o time ganha uma forma próxima de **2-1-2-2** ou até **2-3-2-3** com a bola: zaga de 2 + volante, interiores e laterais formando a linha do meio larga, e 10+2 na frente. A largura é toda dos laterais; o centro é todo do losango. O objetivo é **superioridade central + bola na lateral pelo lateral subido**.

**Sem bola (organização defensiva):** o diamante **se comprime e fica estreito** num bloco central. Vira frequentemente um **bloco médio/baixo** fechando o corredor central, com os interiores escorregando para as laterais quando a bola vai pra fora. Aqui mora a tensão: defender estreito **convida o cruzamento**, então o time aposta em **encurtar o centro e disputar a bola aérea na área** com os dois zagueiros + volante recuado.

**Transição ofensiva (acabou de recuperar):** momento de ouro do diamante. Com 10 + 2 atacantes já no centro e próximos, a recuperação no meio-campo encontra **três homens prontos para verticalizar** num espaço pequeno — contra-ataque curto e letal por dentro.

**Transição defensiva (acabou de perder):** momento de **maior perigo**. Se a bola é perdida com os dois laterais subidos, os **flancos estão escancarados** e o time precisa de **falta tática** (jargão: *falta tática* = falta proposital para parar o contra-ataque) ou de recuo desesperado do interior/volante. A altura dos laterais define o risco: quanto mais ousado o ataque, mais aberta a transição.

**Por estado de placar (declarada vs real — jargão: *declarada* = o desenho no papel; *real* = a forma que o time de fato assume em campo):** ganhando, o diamante **abaixa os laterais** e vira um 4-3-1-2 mais conservador, quase um 4-5-1 ao defender (o 10 ou um atacante recua), protegendo os flancos. Perdendo, **empurra tudo para frente**: laterais coladíssimos na linha, interiores virando quase atacantes, aceitando o risco total nas costas em troca de afogar o adversário no campo de ataque. Ou seja: a formação 'declarada' 4-3-1-2 pode virar, na prática, **4-5-1 defensivo** ou **2-4-4 desesperado** dependendo do placar.

#### Exemplos de times e treinadores

**Carlo Ancelotti** é a referência histórica do diamante: campeão da Champions com o **Milan (2003-2007)** usando o famoso losango com Pirlo de **regista** (volante-organizador) na base, Gattuso e Seedorf como interiores, Kaká de 10 e dupla de ataque. É o modelo canônico de como o diamante maximiza um meio-campo de elite com a posse central.

**Diego Simeone (Atlético de Madrid)** usou variações do losango/4-4-2 estreito para **estrangular o centro** e forçar o jogo para as laterais — o lado mais reativo e defensivo da mesma ideia de densidade central.

**Mauricio Pochettino** explorou o diamante em momentos do Tottenham e do PSG para gerar superioridade central e empacotar dois atacantes de qualidade ao mesmo tempo.

**Antonio Conte e Massimiliano Allegri** transitam entre o diamante e os sistemas de três zagueiros justamente porque entendem o trade-off da largura — quando querem dominar o centro vão de losango, quando querem cobrir os flancos vão de 3-5-2 com alas.

**Maurizio Sarri** e correntes da escola italiana mantêm o losango vivo como exercício de **controle de posse pelo centro** (verificado-fetch recomendado para temporadas 2023-2026 específicas — `inferencia` de que o uso do diamante puro segue minoritário no futebol de elite atual, mais comum como variação situacional do que como sistema-base, NEI sobre clubes específicos da temporada corrente sem WebSearch).

---

## Lacunas, incertezas e pontos a validar

**O que ficou faltando, incerto ou merece validação — em ordem de impacto.**

**1. Agrupamento de colunas perde nuance intra-família (viés da própria síntese).** Para caber numa tabela legível, agrupei formações (ex.: 3-5-2 com 3-4-2-1; 4-2-3-1 com 4-1-4-1). Mas dentro de cada grupo há diferenças reais que as células suavizam: o 10 é templo no 3-4-1-2 mas diluído no 3-5-2 puro; o box-to-box é freado no 4-2-3-1 mas liberado no 4-1-4-1; o segundo atacante é dupla solta no 5-3-2 mas extinto no 5-4-1. **Sempre consulte o dossiê de posição individual** quando a célula tiver duas leituras (sinalizei com "/"). A matriz é índice, não substituto.

**2. Assimetria de lado não cabe na tabela.** Times de elite montam flancos assimétricos (um lateral sobe / o outro segura; um ala ofensivo / o outro defensivo; um ponta aberto / outro invertido). A matriz trata cada posição como simétrica por linha — perde essa textura, que é justamente onde mora muita da narrativa de "por que o perigo vem por um lado só". Validar caso a caso na escalação real.

**3. Fase sem bola sub-representada.** Cada célula prioriza a fase com bola do esquema-base. As transformações defensivas (4-2-3-1 → 4-4-2; 3-4-3 → 5-4-1; 4-1-4-1 → 4-5-1) estão sinalizadas com setas, mas não detalhadas posição a posição. Para a camada EXPLICAR de jogos reativos/blocos baixos, a leitura sem-bola pode importar mais que a com-bola.

**4. Fonte 100% `consenso` de domínio (sem fetch nesta síntese).** Todo o material é conhecimento tático qualitativo consolidado dos dossiês — não rodei WebSearch para confirmar exemplos atuais (2023-2026) nesta etapa de reconciliação. Os dossiês de posição já traziam alguns `verificado-fetch` (Bellingham, Valverde, Salah, Kane, Haaland etc.), mas a MATRIZ em si não foi cruzada com fontes externas. Se o produto quiser ancorar células em exemplos de elite correntes, é um passo seguinte opcional.

**5. Risco residual de leitura-como-edge.** Apesar das travas repetidas, o formato tabela "posição x formação com V/X" pode visualmente *parecer* uma grade de recomendação. Vale reforçar no produto, na superfície de UI que consumir isto, o carimbo de que é vocabulário explicativo — o formato é sedutor o suficiente pra ser mal-lido como sinal. Esta é a lacuna mais perigosa do ponto de vista de governança do produto.

**6. Posições híbridas/emergentes não têm linha própria.** Falso-9, lateral invertido e "dez duplo" (mezze-punte) aparecem dentro de células de outras posições, mas são papéis suficientemente distintos que mereceriam tratamento próprio numa versão expandida — especialmente o lateral invertido, que é o mecanismo central de vários times de posse modernos e atravessa três linhas da matriz (lateral, volante, sua própria coisa).
