# Investigação — Sinal: mood / estado emocional do jogador (SIN-003)

> `/rs` · tema intangível · as-of 2026-06-18 · repo greenfield (sem camada de dados) · alimenta o dossiê por partida (DOS-001)

## TL;DR + recomendação cravada

**Veredito: DESCARTAR como sinal preditivo no MVP. Reclassificar como, no máximo, "cor narrativa" opcional de fase posterior — nunca como feature quantitativa que mexe na probabilidade/odd.**

Três muros independentes, e qualquer um deles já bastaria:

1. **O efeito existe, mas é fraco, genérico e medido no lugar errado.** A melhor evidência (meta-análise POMS, 2021) mostra que mood *autorrelatado pelo atleta antes da prova* prediz desempenho com efeitos pequenos por subescala (Hedges' g ~0,08 a 0,43) e heterogeneidade altíssima e não explicada. Isso é mood **medido por questionário do próprio atleta** — nada que o mrtip consiga capturar de fora.
2. **Os proxies observáveis externamente são não confiáveis a ponto de serem cientificamente desaconselhados.** Reconhecimento de emoção por expressão facial/linguagem corporal é refutado pela ciência base (Feldman Barrett et al., 2019: pessoa franze a testa só ~30% das vezes em que está com raiva). Sentimento de rede social mede o *torcedor*, não o estado interno do jogador. Não existe feed comercial de "mood do jogador" (Opta/Stats Perform/Genius não vendem isso).
3. **O risco jurídico é central, não secundário.** Inferir estado emocional/psicológico de um indivíduo identificado é, na prática brasileira, criar **dado pessoal sensível** (saúde/saúde mental, art. 5º II e art. 11 da LGPD). Dado sensível **mesmo por inferência** é barreira absoluta ao legítimo interesse (orientação ANPD) — restaria consentimento específico do jogador, que não temos. Para a Premier League, o EU AI Act classifica reconhecimento de emoção como **alto risco** (Anexo III) mesmo fora de trabalho/educação.

O custo de construir isso (pipeline de inferência frágil) compra um sinal de baixíssimo valor preditivo e altíssimo passivo regulatório. Não é paridade de mercado (ninguém entrega isso), não é diferencial defensável (é ruído), e é exatamente o tipo de tratamento de dado que atrai a ANPD. Descartar.

---

## Contexto

mrtip é copiloto de prognósticos (Premier League + Brasileirão), mercado BR, sob a Lei 14.790/2023. O princípio de domínio (`docs/visao-geral.md` §5) é **mostrar o porquê e as fontes** e separar **estimar** (quant) de **explicar** (LLM). SIN-003 propõe um sinal intangível — o estado emocional do jogador (confiança, fase ruim, momento pessoal) — para entrar no dossiê por partida (DOS-001). A pergunta de fundo é se mood é um *sinal mensurável e fonteável* ou uma *narrativa pós-fato*.

Estado interno: repo greenfield, sem ingestão/schema. Logo, toda a decisão é de pesquisa externa — não há código a auditar. (Justificativa de não usar SocratiCode: não há símbolo nem fluxo a explorar; o sinal não existe no código.)

---

## Estado da arte / evidência

Escada de fontes priorizada: acadêmico (meta-análises, papers) > análise jurídica especializada > jornalismo sério. Listicles de apostas banidos.

### A) O efeito psicológico: real, porém pequeno e ruidoso

- **[verificado-fetch · as-of 2026-06-18]** Meta-análise POMS × desempenho atlético (Lochbaum et al., 2021; 25 estudos, 1.497 participantes, 1975–2011), **mood medido ANTES da prova**. Efeitos por subescala (Hedges' g): tensão −0,21 (n.s.), depressão −0,43 (p=0,018), raiva 0,08 (n.s.), vigor 0,38 (p=0,001), fadiga −0,13 (n.s.), confusão −0,41 (p=0,035); TMD (perturbação total de humor) −0,53 (IC cruza zero → n.s. antes de ajuste). Após correção de viés de publicação (trim-and-fill): depressão −0,64, TMD −0,84. **Caveats dos próprios autores**: I² de 75,8–85,1 (heterogeneidade altíssima e não explicada pelos moderadores), "falta consistente de relato de confiabilidade do POMS" nos estudos, amostras pequenas nas análises de moderador. Conclusão deles: o "perfil iceberg menos raiva" de Morgan segue um modelo *viável* — mas isso é sobre **autorrelato do atleta**, não sobre observação externa. https://pmc.ncbi.nlm.nih.gov/articles/PMC8314345/ — **confiança alta** (meta-análise revisada por pares, fetch da página real).

- **[snippet · as-of 2026-06-18]** Fatores psicológicos em jogadores de elite: um modelo de regressão explicou ~90% da variabilidade de desempenho, mas os autores concluem que **fatores psicológicos isolados não determinam** o desempenho do jogador de elite. http://efsupit.ro/images/stories/nr1.2016/art%2027.pdf — confiança média (paper, lido via snippet de busca; o 90% é de modelo multifatorial, não de mood sozinho).

- **[snippet · as-of 2026-06-18]** "Momentum"/hot hand no futebol: evidência mista-a-fraca. Estudos da Premier League **não** acham momentum de gols dentro do jogo; há até reversão de desempenho após sequências de vitórias (regressão à média). Momentum descrito como "rótulo pós-hoc de desempenho" mais do que fenômeno causal robusto. https://en.wikipedia.org/wiki/Hot_hand e https://ideas.repec.org/p/gri/epaper/economics201403.html — confiança média. Reforça que mesmo o *constructo* "fase boa/ruim" é instável antes de qualquer problema de medição.

**Síntese A:** existe um sinal psicológico real, mas (i) é pequeno e específico de constructo, (ii) é mais forte em esportes individuais/curtos do que em time/longos (futebol é o caso *menos* favorável — vigor em individuais 0,51 vs time 0,23), e (iii) **só foi medido por autorrelato do atleta antes da prova**, canal que o mrtip não tem.

### B) Os proxies observáveis: não confiáveis

- **[snippet · as-of 2026-06-18]** Feldman Barrett, Adolphs, Marsella, Martinez & Pollak (2019), revisão seminal: não é possível inferir com confiança emoção a partir de movimentos faciais — baixa confiabilidade, baixa especificidade (não há mapeamento único emoção↔expressão) e baixa generalização (cultura/contexto). Pessoas franzem a testa apenas ~30% das vezes em que estão com raiva. https://journals.sagepub.com/doi/abs/10.1177/1529100619832930 — **confiança alta** (consenso científico amplamente citado). Mata "linguagem corporal/expressão facial" como proxy.

- **[snippet · as-of 2026-06-18]** Reconhecimento de emoção por IA descrito como indústria "pseudocientífica" bilionária; cientistas afirmam que a tecnologia "não consegue ler emoções". https://www.aaas.org/news/facial-recognition-technology-cannot-read-emotions-scientists-say — confiança média-alta (cobertura AAAS de consenso científico).

- **[snippet · as-of 2026-06-18]** Análise de sentimento em redes sociais no esporte: ~56% de acurácia só com texto, subindo a ~71% **combinada com dados de desempenho** — e mede majoritariamente o **sentimento do torcedor** sobre o time, não o estado interno do jogador. Fonte chega a citar que clube usa "gráfico de sentimento de torcida por jogador". https://injuriesandsuspensions.com/all-news/the-role-of-social-media-sentiment-analysis-in-predictions/ — confiança baixa-média (fonte de nicho de apostas; usar só como indicação de prática, não de eficácia). O sinal útil ali é o *fan sentiment*, que é um proxy de notícia/lesão/forma já capturado por outros sinais, não "mood do jogador".

- **[verificado-fetch · as-of 2026-06-18]** Não existe feed comercial de mood do jogador. Stats Perform/Opta vendem XY de 22 jogadores, forma recente, tendências históricas, monitoramento de atleta — **nada psicológico/de humor**. https://www.statsperform.com/opta/ — confiança média-alta (catálogo do líder de mercado; ausência confirmada por busca dedicada).

**Síntese B:** os três proxies externos imagináveis falham. Expressão facial/corpo → cientificamente desaconselhado. Sentimento de rede social → mede torcedor, não jogador; e quando mede algo do jogador, é notícia/forma já coberta. Declarações/entrevistas → escassas, performáticas, sem cadência por partida. Nenhum fornecedor faz o trabalho por nós.

### C) Risco jurídico — LGPD (BR) e EU AI Act/GDPR (PL)

- **[verificado-fetch · as-of 2026-06-18]** ANPD (Guia do Legítimo Interesse, via Data Privacy Brasil): legítimo interesse autoriza apenas dado **não sensível**; dado sensível "**mesmo por inferência**" é **barreira absoluta** ao legítimo interesse. Dado sensível exige base do art. 11 da LGPD (na prática: consentimento específico e destacado). Art. 12 §2º: dado usado para formar **perfil comportamental** de pessoa identificada pode ser pessoal. https://www.dataprivacybr.org/guia-do-legitimo-interesse-orientacoes-da-anpd/ — **confiança alta** (organização de referência em proteção de dados, reportando orientação ANPD).

- **[snippet · as-of 2026-06-18]** Saúde mental/estado psicológico tende a ser tratado como **dado de saúde = sensível** (art. 5º II LGPD); a Agenda Regulatória ANPD 2025–2026 inclui dados sensíveis com ênfase em saúde. Logo, inferir "estado emocional" de um jogador identificado se aproxima perigosamente de inferir dado de saúde. https://idec.org.br/dicas-e-direitos/dados-sensiveis-pela-lgpd-como-eles-sao-usados-na-area-da-saude — confiança média.

- **[verificado-fetch · as-of 2026-06-18]** EU AI Act (para a Premier League): sistema de reconhecimento de emoção = IA que infere emoções de pessoas naturais **a partir de dados biométricos** (art. 3(39)). **Proibido** (art. 5(1)(f)) só em trabalho/educação; fora desses contextos é **alto risco** (Anexo III). Importante: **análise de sentimento por texto NÃO entra na proibição** (não é biométrico) — então rede social em texto é o caminho de *menor* risco no eixo UE, mas continua alto risco se inferir emoção via imagem/vídeo. GDPR art. 9 trata biométrico para identificação como categoria especial. https://fpf.org/blog/red-lines-under-eu-ai-act-unpacking-the-prohibition-of-emotion-recognition-in-the-workplace-and-education-institutions/ — **confiança alta** (Future of Privacy Forum, análise especializada, fetch da página).

**Síntese C:** no eixo BR (o principal do mrtip), inferir + armazenar estado emocional de jogador identificado cai no regime de dado sensível, que **fecha o legítimo interesse** e exige consentimento que não temos. No eixo PL/UE, vídeo/foto-emoção é alto risco; texto escapa da proibição mas não do GDPR. É um passivo desproporcional ao valor do sinal.

---

## Opções de sourcing / viabilidade

| Opção | O que seria | Valor preditivo | Confiabilidade do proxy | Risco LGPD/UE | Veredito |
|---|---|---|---|---|---|
| Expressão facial / linguagem corporal (vídeo) | CV em imagens de jogo/entrevista | ~nulo (cientificamente refuta-do) | muito baixa | **alto** (biométrico, alto risco UE; sensível/inferência BR) | descartar |
| Sentimento de rede social do jogador | NLP em posts do atleta | baixo; mede público, não estado interno | baixa | médio-alto (perfil de pessoa identificada; sensível se inferir saúde mental) | descartar |
| Sentimento da torcida sobre o jogador | NLP em menções | baixo e **redundante** com sinais de notícia/forma/lesão | média | baixo-médio (dado de terceiros, não do jogador) | já coberto por outros sinais; não rotular como "mood" |
| Declarações/entrevistas (NLP de citações) | extrair tom de falas públicas | muito baixo; performático e esparso | baixa | médio (texto público, mas inferência de estado psicológico) | descartar como sinal; talvez insumo narrativo manual |
| Feed comercial de mood | comprar pronto | — | — | — | **não existe** |

Nenhuma linha justifica construção. A única coisa aproveitável (sentimento de torcida) **não é "mood do jogador"** e já seria capturada por sinais de notícia/lesão/forma — rotulá-la como mood seria enganoso para o usuário e contra o princípio "mostre o porquê e as fontes".

---

## Nota de modelo de dados

Não criar tabela/coluna de "mood" no schema. Se um dia entrar como cor narrativa de fase posterior, deve ser: (a) **derivado on-the-fly de fontes públicas factuais já ingeridas** (ex.: nota de imprensa "jogador relatou pressão") e exibido como *citação com fonte*, **não** como score psicológico persistido; (b) jamais um número que entre no motor de probabilidade; (c) sem persistência de inferência emocional ligada a indivíduo identificado (evita criar dado sensível). Em termos de DOS-001: mood, se aparecer, é texto-com-fonte no campo de contexto, não um sinal quantitativo.

---

## Riscos LGPD / ética (DESTAQUE)

1. **Criação de dado sensível por inferência.** Inferir "estado emocional/psicológico" de jogador identificado materializa dado de saúde/saúde mental (art. 5º II, art. 11 LGPD). Isso **elimina o legítimo interesse** como base legal (orientação ANPD) — sobraria consentimento específico do jogador, inviável na prática.
2. **Perfilamento de pessoa identificada** (art. 12 §2º LGPD): manter um "perfil de humor" por atleta é exatamente o tipo de profiling que a ANPD vigia.
3. **EU AI Act (Premier League):** inferência de emoção por dado biométrico (vídeo/foto) é alto risco (Anexo III), com obrigações de transparência (art. 50(3)) e GDPR art. 9. Texto escapa da *proibição*, mas não do regime de dados pessoais.
4. **Risco reputacional e de produto:** vender "lemos o estado emocional dos jogadores" é (a) cientificamente indefensável e (b) facilmente enquadrável como prática enganosa — colide com o princípio do mrtip de fontes verificáveis e com o tom de jogo responsável da Lei 14.790/2023.
5. **Vetor de discriminação:** estado emocional inferido pode embasar decisões/odds que estigmatizam o jogador — o dano que o art. 5º II busca evitar.

---

## Refutado

- **"Mood do jogador é um sinal preditivo forte que dá vantagem."** Refutado: efeitos POMS pequenos, heterogêneos, e medidos por autorrelato pré-prova — não por observação externa. Em time/longo (futebol) é o cenário menos favorável. (PMC8314345)
- **"Dá pra ler o mood pela linguagem corporal / expressão facial."** Refutado pela ciência base (Feldman Barrett et al., 2019): inferência facial de emoção é não confiável, não específica, não generalizável.
- **"Sentimento de rede social captura o estado emocional do jogador."** Refutado/realocado: mede sentimento do torcedor; quando toca o jogador, é notícia/forma já coberta. ~56% de acurácia só com texto.
- **"É só comprar o feed."** Refutado: nenhum provedor (Opta/Stats Perform/Genius) vende mood/estado psicológico.
- **"Sob legítimo interesse a gente processa e segue."** Refutado: dado sensível, mesmo inferido, barra o legítimo interesse (ANPD).

---

## Perguntas abertas

1. Vale capturar **fan sentiment** como sinal *próprio* (não rotulado "mood"), só se provar incremento sobre os sinais de notícia/forma/lesão já planejados? (Hipótese atual: redundante; testar só se sobrar capacidade.)
2. Citações públicas de jogador/técnico sobre pressão/confiança têm lugar como **insumo narrativo manual e fonteado** no dossiê (DOS-001) sem virar sinal quantitativo nem dado sensível persistido? Definir guard-rail editorial.
3. Caso o produto evolua para conteúdo, qual o parecer formal do DPO/jurídico sobre exibir citações emocionais de jogadores (pessoas públicas) sem inferência/scoring — provavelmente OK, mas precisa de carimbo.
