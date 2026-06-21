---
id: SIN-003
titulo: Sinal — mood / estado emocional do jogador
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: ideia
  ia: ideia
testada: nao
testes: []
depende_de: [DOS-001]
impacta: []
ancoras:
  tabelas: []
docs: [docs/investigacoes/sinal-mood-jogador.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal — mood / estado emocional do jogador

## Descrição

Sinal intangível: estado emocional/mood do jogador (confiança, fase ruim, momento pessoal) e seu efeito no desempenho. Investigar evidência (psicologia esportiva), como proxies observáveis poderiam capturar (declarações, redes sociais, linguagem corporal) e a viabilidade/risco (LGPD, dados sensíveis).

## Tarefas

- [x] dados — investigar fonte e viabilidade do sinal → ver `docs/investigacoes/sinal-mood-jogador.md`

## Evidências

> Investigação `/rs` em 2026-06-18. Recomendação: **descartar como sinal preditivo**; no máximo cor narrativa fonteada em fase posterior, nunca sinal quantitativo. Três muros: efeito fraco, proxies não confiáveis, risco LGPD/UE alto.

- **Efeito real porém pequeno e no lugar errado** — Meta-análise POMS × desempenho (Lochbaum et al., 2021; 25 estudos, 1.497 part.): efeitos por subescala Hedges' g ~0,08–0,43, TMD −0,53 (IC cruza zero antes de ajuste), I² 75–85% (heterogeneidade não explicada), confiabilidade do POMS mal reportada. **Mood medido por autorrelato do atleta antes da prova** — canal que não temos. Futebol (time/longo) é o caso menos favorável. https://pmc.ncbi.nlm.nih.gov/articles/PMC8314345/ [confiança alta]
- **Proxy facial/corporal refutado** — Feldman Barrett et al. (2019): inferência de emoção por expressão facial é não confiável, não específica, não generalizável (raiva → testa franzida só ~30%). https://journals.sagepub.com/doi/abs/10.1177/1529100619832930 [confiança alta]
- **Sentimento de rede social mede o torcedor, não o jogador** — ~56% acurácia só texto, ~71% combinado com desempenho; quando toca o jogador é notícia/forma já coberta por outros sinais. https://injuriesandsuspensions.com/all-news/the-role-of-social-media-sentiment-analysis-in-predictions/ [confiança baixa-média]
- **Não existe feed comercial de mood** — Opta/Stats Perform vendem XY, forma, monitoramento de atleta; nada psicológico. https://www.statsperform.com/opta/ [confiança média-alta]
- **LGPD: inferência de estado emocional = dado sensível** — dado sensível mesmo por inferência barra o legítimo interesse (orientação ANPD); exige art. 11 (consentimento específico, inviável). Perfil comportamental de pessoa identificada: art. 12 §2º. https://www.dataprivacybr.org/guia-do-legitimo-interesse-orientacoes-da-anpd/ [confiança alta]
- **EU AI Act (Premier League): emoção por biométrico é alto risco** — art. 3(39)/Anexo III; proibido só em trabalho/educação; análise de sentimento por **texto** escapa da proibição mas não do GDPR. https://fpf.org/blog/red-lines-under-eu-ai-act-unpacking-the-prohibition-of-emotion-recognition-in-the-workplace-and-education-institutions/ [confiança alta]
