# Prognóstico V2 — tática, setores, jogadores e janelas de 15 minutos

> Investigação fechada em 2026-07-20 para o experimento MOD-014. O objetivo é aumentar a
> profundidade do prognóstico sem transformar narrativa tática em ajuste probabilístico arbitrário.

## 1. Pergunta

Como cruzar, antes do jogo:

- o plano e o antiplano dos treinadores;
- formações, fases e setores;
- jogadores ofensivos contra defensores do corredor correspondente;
- as seis janelas de 15 minutos;

sem vazar o jogo-alvo, duplicar evidência ou pedir que a LLM invente precisão?

## 2. Conclusão executiva

O melhor desenho disponível com os dados atuais é:

1. **Formação como índice, não como tática.** O rótulo 4-3-3 não revela altura do bloco, shape com
   bola, shape sem bola, encaixe de pressão ou rotações. Sem tracking/360, essas partes ficam como
   hipóteses explicitamente marcadas.
2. **Confronto por função e setor.** Projetar o XI apenas de jogos anteriores; normalizar as métricas
   por 90 e por posição; cruzar esquerda×direita, direita×esquerda e centro×centro.
3. **Métricas em famílias, sem subtração de percentis.** Ameaça/criação/progressão/retenção do
   atacante contra defesa/aéreo/erro do defensor. O matchup só seria estimável como habilidade com
   shrinkage × exposição provável × probabilidade do evento; o dado atual não localiza a ação.
4. **Hazard global antes do perfil do time.** As faixas partem da curva da competição. Desvios
   equipe×janela são fortemente encolhidos e servem apenas para cenários até demonstrarem ganho em
   ablação walk-forward.
5. **Uma síntese LLM, vários estágios determinísticos.** O CLI monta dossiês em código, indexa as
   evidências e faz uma chamada tipada primária. Uma segunda chamada só é permitida para corrigir
   violações explícitas do validador; multiagente livre adicionaria divergência e custo.
6. **Toda conclusão cita evidência.** IDs inexistentes invalidam a run; somas probabilísticas,
   bands, cenários e consistência da recomendação são verificadas pelo runtime.

O V2 não afirma que “formação X vence formação Y”. A literatura encontra associações contextuais,
mas o efeito isolado da formação em gols é pequeno, sensível a força dos times, mando, estado do
jogo e seleção do treinador.

## 3. O que a literatura permite afirmar

### 3.1 Formação é dinâmica e dependente da fase

A revisão sistemática sobre identificação de formações separa dois caminhos: classificação da
equipe inteira e atribuição de papéis por jogador. Ela também mostra por que um rótulo único é
insuficiente: é necessário segmentar posse, não-posse, transição e, em alguns trabalhos, bola
parada; dentro dessas fases, os estudos ainda dividem o campo por linhas quebradas ou terços/zonas.

**Implicação:** o V2 pode usar a formação declarada para projetar ocupação, mas deve chamar o shape
com/sem bola de hipótese quando só tem eventos e grid de lineup.

Fonte primária:

- Chawla et al., *The principles of tactical formation identification in association football
  (soccer) — a survey*:
  https://pmc.ncbi.nlm.nih.gov/articles/PMC11836022/

### 3.2 Formação tem sinal, mas não autoriza regra universal

Um modelo de riscos competitivos encontrou diferenças de tempo até o gol entre algumas formações,
com 4-3-3 e 4-2-3-1 associadas a maior eficiência ofensiva na amostra. Isso não é uma matriz causal
universal: a escolha de formação depende do elenco, adversário, mando e estratégia; o próprio
estudo modela covariáveis e competição entre o gol de cada lado.

**Implicação:** o histórico “time contra a formação provável do rival” entra como amostra-espelho,
com `n`, gols, pontos e SoT. Se `n` é pequeno, ele sugere uma pergunta; não move xG sozinho.

Fonte:

- Bilek et al., *A competing risk survival analysis of the impacts of team formation on goals in
  professional football*:
  https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2024.1323930/full

### 3.3 Mudança após derrota é comportamento, não prova de melhora

O estudo “win-stay, lose-shift” encontrou que equipes e treinadores mudavam mais a formação depois
de perder e mantinham depois de vencer. A mudança não melhorou estatisticamente o resultado
seguinte.

**Implicação:** o V2 mede `mudou após vitória/derrota` para descrever flexibilidade/instabilidade.
É proibido concluir “o treinador reage bem” apenas porque mudou.

Fonte:

- Tamura e Masuda, *Win-stay lose-shift strategy in formation changes in football*:
  https://doi.org/10.1140/epjds/s13688-015-0045-1

### 3.4 O antiplano precisa de mecanismos, não só números de linhas

O FIFA Training Centre descreve overloads, uso do goleiro como homem livre, largura, altura dos
laterais, overlaps/underlaps e o custo de expor a transição. A leitura é mecanística: criar um 2v1,
fixar um defensor, achar o homem livre; não “4-3-3 ganha de 4-4-2”.

**Implicação:** o prompt força seis mecanismos:

1. saída de bola × atividade defensiva;
2. esquerda ofensiva × direita defensiva;
3. direita ofensiva × esquerda defensiva;
4. entrelinhas/miolo × proteção central;
5. transição após perda × retenção/turnover;
6. jogo aéreo, segunda bola e bola parada.

Fonte:

- FIFA Training Centre, *Creating and exploiting overloads*:
  https://www.fifatrainingcentre.com/en/practice/elite-sessions/in-possession/creating-and-exploiting-overloads.php

### 3.5 Sem localização, atividade defensiva não é pressão alta

PPDA divide passes permitidos por ações defensivas numa zona do campo; a definição clássica usa
ações além de x=40. O banco atual tem passes, tackles e interceptações agregados por jogo, mas não a
coordenada das ações.

**Implicação:** o V2 emite “atividade defensiva proxy por 100 passes rivais” e carrega no próprio
texto a trava “não chame de pressão alta”. O dado não pode receber o rótulo PPDA.

Fonte:

- StatsBomb, *Defensive Metrics: Measuring the Intensity of a High Press*:
  https://statsbomb.com/articles/soccer/defensive-metrics-measuring-the-intensity-of-a-high-press/

### 3.6 Setores sérios exigem localização e sequência

Trabalho com eventos + 360 divide o campo em zonas e extrai sequências de ações/zonas para avaliar
como a posse progride. A aplicação prática de “match phases” usa tracking/TV para classificar
bloco, pressão e fases; frames incompletos continuam sendo uma limitação.

**Implicação:** o grid do lineup localiza o papel nominal do jogador, não cada ação. O V2 pode
comparar “jogadores que habitam o corredor”, mas não afirmar que toda criação ocorreu ali. O digest
atual, que usa grid + criação, continua como segunda lente; não conta como evidência independente.

Fontes:

- StatsBomb Conference 2023, *An Events and 360 Data-Driven Approach for Extracting Team Tactics
  and Evaluating Performance in Football*:
  https://blogarchive.statsbomb.com/uploads/2023/10/An-Events-and-360-Data-Driven-Approach-for-Extracting-Team-Tactics-and-Evaluating-Performance-in-Football.pdf
- StatsBomb Conference 2024, *Match Phases in Practice*:
  https://blogarchive.statsbomb.com/uploads/2024/10/Match-Phases-In-Practice-Ghezzi-and-Sotudeh.pdf

### 3.7 Jogador deve ser comparado dentro da função

As definições e produtos da Opta tratam ações por posição e por 90; quando um jogador atua em mais
de uma função, a avaliação ideal atribui ações ao papel ocupado no momento. Métricas de progressão
e valor da posse dependem do contexto inicial/final e do risco da ação.

**Implicação:** com o feed atual:

- o papel modal vem de `lineup_player.role`/grid;
- taxas são por 90, com minutos expostos;
- percentis são calculados contra jogadores do mesmo grupo G/D/M/F;
- amostra abaixo de 450 minutos é baixa;
- não se chama passe no terço final de “progressivo” — o feed não mede a distância/ângulo exigidos
  pela definição da Opta.

Fontes:

- Opta, *Football Stats Definitions*:
  https://theanalyst.com/articles/opta-football-stats-definitions
- Opta, *What Is Possession Value (PV)?*:
  https://theanalyst.com/articles/what-is-possession-value

### 3.8 Quinze minutos é resolução útil, mas esparsa

Um modelo bayesiano de criação de chances usa blocos de 15 minutos como compromisso entre
granularidade e redundância, estimando efeitos por time e mando. Estudos temporais maiores mostram
taxa de gol crescente ao longo do jogo e menos gols no início de cada tempo. Isso não prova que o
“momentum” recente de cinco jogos seja estável.

**Implicação revisada:** o V2:

- reconstrói deltas dos trends cumulativos;
- parte do hazard global da liga;
- encolhe o desvio de ataque com prior equivalente a 120 jogos e gols sofridos com 60 gols;
- mantém os índices equipe×faixa com confiabilidade baixa e uso apenas narrativo;
- deriva `P(marca na faixa)=1-exp(-xg_band)`, mas não deixa TIME-01..06 mover xG sozinho.

Fontes:

- Whitaker et al., *Modeling goal chances in soccer: a Bayesian inference approach*:
  https://arxiv.org/pdf/1802.08664
- Mendes et al., *Temporal dynamics of goal scoring in soccer*:
  https://arxiv.org/html/2501.18606

### 3.9 Estado do jogo e acréscimos são caminhos futuros

O placar altera o hazard e cartões vermelhos produzem choque relevante, mas nenhum dos dois é
conhecido no pré-jogo. Acréscimos também têm exposição variável: substituições, lesões, VAR e
comemorações impedem tratar `45+`/`90+` como parte de bins exatamente iguais.

**Implicação:** placar, cartão, substituição e acréscimos entram como ramos de cenário/simulação, não
como covariáveis observadas. A curva temporal não deve fabricar “momentum” pré-jogo.

Fontes:

- Dixon e Robinson, modelo de taxa dependente do tempo e placar:
  https://doi.org/10.1111/1467-9884.00152
- Maia et al., gols, cartões e acréscimos em processos de Cox:
  https://arxiv.org/abs/2312.04338
- IFAB, Lei 7:
  https://www.theifab.com/laws/latest/the-duration-of-the-match/

### 3.10 Percentil não estima confronto individual

Um ranking por posição controla parcialmente a função, mas ainda mistura qualidade, estilo,
adversários e volume de eventos. Um duelo pré-jogo exige integrar habilidade regularizada,
probabilidade de ambos jogarem, exposição no mesmo setor e chance de o mecanismo ocorrer.

**Implicação:** os compostos atuais são instrumentos de busca e explicação. Sem localização das
ações e modelo de exposição, duelos e setores ficam em confiabilidade baixa/média e não ajustam xG.

### 3.11 Treinador contra treinador não tem efeito fixo defensável

Head-to-head bruto por técnico tem amostra pequena, elencos mutáveis e seleção endógena. Estudos de
mudança de formação mostram comportamento de adaptação, mas não ganho estatístico garantido.

**Implicação:** treinador representa uma política hierárquica de resposta, com forte shrinkage. No
banco atual, `coach_id` ainda não é preenchido de forma confiável; nome/formação recente servem
somente para levantar hipóteses.

## 4. Dados disponíveis no mrtip

### Usados

- `lineup`: formação e treinador (o nome está nulo em parte da base);
- `lineup_player`: grid, papel, titularidade, minutos e métricas ofensivas/defensivas novas;
- `match_team_stats`: posse, passe, SoT, bolas longas, cruzamentos, tackles/interceptações;
- `match_trend`: séries cumulativas por minuto;
- `goal`: gol e minuto;
- `injury`: exclusão do XI projetado;
- `match_prognosis.prompt_text`: snapshot do briefing atual, somente leitura.

### Ausentes ou insuficientes

- tracking/360;
- coordenada das ações individuais;
- PPDA real;
- shape com e sem bola;
- pressão recebida por jogador;
- progressive pass/carry na definição estrita;
- xG real do provider;
- técnico preenchido em todos os lineups;
- odds de mercado.

## 5. Desenho implementado

```text
snapshot atual persistido (read-only)
        +
evidence-crossings atual (read-only)
        +
dossiê V2 determinístico
  ├─ cutoff anti-leak
  ├─ repertório de formação
  ├─ XI projetado sem jogo-alvo
  ├─ percentis por posição
  ├─ setores espelhados
  └─ hazard 15min com shrinkage
        ↓
um super prompt V2
        ↓
objeto JSON tipado
        ↓
validador de probabilidades + evidências
        ├─ válido → artefatos
        └─ inválido → uma correção restrita → revalidação
        ↓
result.json + dump.json + report.html
```

O V2 não escreve no banco, não persiste run, não abre rota e não toca a UI. A única dependência do
pipeline atual é o snapshot do prompt já persistido; se ele não existe, o CLI para e pede que o
motor atual seja executado. Isso evita chamar ou modificar os scripts legados por baixo dos panos.

## 6. Guardrails contra apofenia

- Dados do próprio jogo-alvo são excluídos por `date < cutoff`.
- O XI é projetado por starts/minutos anteriores e remove lesionados do alvo.
- Percentis são por posição e carregam minutos.
- Setor sem atacante ou defensor mapeado fica “sem veredito”.
- Formação isolada tem orçamento zero de ajuste.
- Formação, treinador, setor, jogador e TIME não movem xG sem ganho incremental fora da amostra.
- O mesmo fato no digest atual e no V2 não é contado duas vezes.
- Toda conclusão cita IDs; ID inventado invalida a saída.
- 1x2, cenários, totals, bands e ameaça temporal são validados no runtime.
- O total não pode mover mais de 0,45 xG do prior determinístico.
- Over 2.5/BTTS não podem mover mais de 10 pp; cada resultado 1x2, mais de 12 pp.
- Saída inválida recebe no máximo uma correção; a run falha se continuar inconsistente.
- Sem odds, a saída se chama “previsão recomendada”, não “value bet”.

## 7. O que decide se melhorou

Uma run bonita não prova melhora. O próximo teste válido é pareado:

1. congelar os mesmos jogos e o mesmo cutoff;
2. rodar atual e V2;
3. comparar log-loss 1x2, Brier, RPS, calibração, MAE do total/xG e acerto da seleção;
4. separar por liga e por confiabilidade do dossiê;
5. manter o V2 apenas se ganhar fora da amostra e não só nos jogos usados para desenhá-lo.

Até isso existir, o relatório HTML serve para inspeção qualitativa e descoberta de bugs, não para
declarar superioridade estatística.

## 8. Piloto de engenharia

Quatro partidas já liquidadas foram executadas em paralelo para validar o encadeamento, o contrato
e o scorer. O resultado descritivo foi:

- atual: log-loss 1x2 0,9025; Brier 0,1757; RPS 0,1756; MAE total 2,100; acerto da previsão 75%;
- V2: log-loss 1x2 0,8644; Brier 0,1676; RPS 0,1519; MAE total 1,913; acerto da previsão 25%.

O V2 produziu probabilidades 1x2 ligeiramente melhores e menor erro do total nessa amostra, mas a
recomendação final foi muito pior. Três das quatro primeiras saídas escolheram `under 2.5`; os jogos
terminaram 4, 2, 6 e 4 gols. O validador novo recusou drift excessivo e jogador fora do XI, porém o
prior budget não resolve sozinho a escolha enviesada do mercado.

Não se deve ajustar o prompt repetidamente nesses mesmos quatro jogos: isso transformaria o piloto
em treino e inflaria o resultado. A próxima evidência válida precisa vir de uma coorte nova,
congelada antes das execuções.

Após o piloto, a pesquisa complementar gerou o contrato `2.2-evidence-guardrails`: perfis táticos
não validados passaram a explicar/distribuir cenários sem mover xG, e confiança `high` nesses blocos
passou a ser rejeitada. As métricas acima pertencem ao contrato 2.1 e não avaliam a revisão 2.2.
