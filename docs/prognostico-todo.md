# Prognóstico — sinais (TODO de trabalho)

Inventário do que o prompt compara + o que dá pra plugar. `[x]` = já no prognóstico · `[ ]` = a implementar.
Detalhe e críticas em [analise-prompt-prognostico.md](investigacoes/analise-prompt-prognostico.md).

## Âncora numérica (ponto de partida)
- [x] λ Poisson gols puros (Rota A) — ataque×defesa por mando
- [x] λ Poisson SoT×conversão (Rota B) — rota principal, volume→gol
- [x] Probs de mercado (O/U, BTTS, 1x2) — âncora de saída

## Ataque / finalização
- [x] Gols feitos/sofridos (geral + mando) — base do λ
- [x] SoT feito/sofrido — volume primário (3× + denso)
- [x] Conversão gols/SoT (s/ pênalti) — eficiência
- [x] Chutes total / na área / big chances — volume + qualidade
- [x] Key passes — criação
- [x] Posse de bola — contexto
- [x] Remates pra fora / bloqueados — decompõe o chute (feito/sofrido · season + últimos 5)
- [ ] Cantos — já no banco; mercado próprio
- [x] Ataques perigosos (dangerous attacks) — proxy de pressão (feito/sofrido · season + últimos 5)
- [x] Chutes de fora da área (feito/sofrido · season + últimos 5)
- [ ] Livres — já no banco

## Contexto / narrativa
- [x] Motivação / stakes de tabela — quem precisa atacar vs. afrouxa
- [x] Mando de campo — já embutido nos λ
- [x] Desfalques — with/without + % do ataque
- [x] Forma / momento (últ. 5) — tendência vs. season
- [x] Descanso (rest days) — fadiga
- [x] Viagem do visitante (km)
- [x] Estádio / piso
- [ ] Técnico novo / troca recente de comando — "new manager bounce": muda tática e motivação (precisa da data de início do treinador; temos tabela `coach`, falta o histórico de quando assumiu)

## Timing
- [x] Split 1ºT / 2ºT — quando marca/sofre
- [x] Gols por faixa de 15 min — ruidoso (amostra pequena)
- [x] Cruzamento ataque×defesa por faixa

## Oportunidades (dado novo — não temos)
- [ ] xG real (add-on SportMonks 5304) — melhor preditor de gol
- [ ] Trends por minuto (SoT/xG no tempo) — timing real, não ruído
- [ ] Odds de mercado — sem isso, "valor" é chute
- [x] Clima — chuva/vento (temp, vento, umidade, nuvens, descrição via `weatherreport`; tabela `weather`, SIN-006)
- [ ] Toques na área adversária — SportMonks não tem
