---
id: SIN-004
titulo: Sinal — relação jogador–treinador
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [DOS-001]
impacta: []
ancoras:
  tabelas: []
docs: [docs/investigacoes/sinal-relacao-jogador-treinador.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal — relação jogador–treinador

## Descrição

Sinal intangível: qualidade da relação entre jogador e treinador (prestígio, banco/titularidade, atritos públicos, troca recente de técnico) e efeito no desempenho individual e do time. **Investigado:** o "new manager bounce" como efeito causal é **majoritariamente regressão à média** (achado robusto, 4 estudos NL/ENG/4-países/BR); o caso Brasileirão é o mais cético (efeito só no 7º jogo; mando de campo domina). É o sinal **mais observável e barato** do conjunto (troca de técnico/minutagem são públicos, já vêm nas APIs do DOS-001). **Recomendação: ADIAR (não-MVP)**; quando entrar, usar como **flag de contexto + insumo de explicação do LLM e redutor de confiança**, NUNCA como termo aditivo no estimador. Confiança/atritos é narrativa não-observável em escala; sobra titularidade como proxy de disponibilidade.

## Tarefas

- [ ] dados — (adiado) coletar técnico atual + histórico/troca (API-Football career history ou timeline de lineups) + minutagem/titularidade; derivar `games_under_current_coach`. Custo marginal ~0 sobre DOS-001.
- [ ] ia — (adiado) SIN-004 como flag/contexto + redutor de confiança quando amostra do técnico é curta; LLM só afirma o observável. Proibido peso positivo de "bounce" no quant.

## Evidências

- [doc] docs/investigacoes/sinal-relacao-jogador-treinador.md — investigação completa + recomendação.
- [web] premierleague.com (Opta/Hopkins) — PL 2021/22+: 0,90→1,27 PPG bruto (+41%) com ressalva de viés de seleção. [verificado-fetch]
- [web] link.springer.com 10.1007/s10645-016-9277-0 (De Economist 2016) — EPL 61 trocas, contrafactual, F-test não-significativo → regressão à média. [verificado-fetch]
- [web] universidadedofutebol.com.br — Brasileirão 2003–2018: efeito só no 7º jogo, mando +261,8%, "ritual do bode expiatório". [verificado-fetch]
- [web] Ter Weel, Dutch Soccer 1986–2004 (De Economist 10.1007/s10645-010-9157-y) — 184 trocas, sem melhora além de curtíssimo prazo. [snippet]
- [web] Bryson et al. "Special Ones?" (IZA DP14104 / SJPE 2024) — efeito pequeno e condicional a reter o técnico. [snippet]
- [web] docs.sportmonks.com (Coach entity) — coach disponível; datas de tenure não confirmadas na doc. [verificado-fetch]
