# Regra de prognóstico — Clima

> Como o **clima** entra na pipeline de prognósticos do mrtip: que sinais extrair, como obtê-los (jogo futuro e histórico) e como aplicá-los — sempre como **heurística calibrável**, nunca como verdade absoluta.

- **Status:** rascunho inicial (v0)
- **Última atualização:** 2026-06-18
- **Dimensão no dossiê:** adiciona "Clima/condições de campo" às dimensões já previstas no [overview](../visao-geral.md#6-como-a-ia-entende-um-jogo) (forma, H2H, lesões, social, mercado).
- **Itens `[A confirmar]`** dependem de decisão de domínio/calibração — ver [Decisões em aberto](#decisões-em-aberto).

---

## 1. Por que o clima importa

O clima altera as **condições de campo** e, com isso, o ritmo e o volume de finalizações de uma partida. É um sinal barato de coletar (lat/long do estádio + data) e que o mercado de odds nem sempre precifica bem em ligas/jogos de menor cobertura — ou seja, pode gerar **valor (EV+)**, exatamente o que o produto busca.

> **Regra-base (a do dia a dia):** em **dias de chuva forte, sair gols fica mais difícil** — campo encharcado, bola que "morre" em poças, jogo truncado. Logo, chuva forte empurra o jogo para o **under** (menos gols / under 2.5).

**Importante — isto é uma hipótese, não um dogma.** O efeito do clima é real, mas:

- O tamanho do efeito varia por liga, estádio e tipo de chuva.
- Chuva **leve** não é igual a chuva **forte** (ver §2).
- A regra só vale o que valer a **calibração com dados reais** (ver §4 e §5). Coerente com o princípio do produto: *estimar* (modelo quant) é separado de *explicar* (LLM), e probabilidade só conta se for calibrada.

---

## 2. Sinais e heurísticas

Cada condição vira um ajuste **qualitativo** na probabilidade de gols. Os limiares abaixo são **pontos de partida** — devem ser recalibrados com o histórico da liga do MVP (ver §5).

| Condição | Métrica (fonte: Open-Meteo) | Efeito esperado nos gols | Direção do pick |
|---|---|---|---|
| **Chuva forte / temporal** | `precipitation` ≥ ~4 mm/h, ou `rain` acumulada alta nas horas do jogo | Campo encharcado, jogo truncado → **menos gols** | ↓ **Under** |
| **Chuva leve / garoa / campo só molhado** | `precipitation` ~0,1–2 mm/h | Ambíguo: bola desliza mais rápido e defensores escorregam → pode até **aumentar** erros/gols | ⚠️ Neutro / sinal fraco — **não** tratar como under |
| **Vento forte** | `wind_speed_10m` alto / `wind_gusts_10m` | Atrapalha passe, cruzamento e bola aérea → jogo mais impreciso | ↓ Leve viés a **under** |
| **Calor extremo + umidade** | `temperature_2m` alta / `apparent_temperature` | Ritmo cai, mais pausas → tende a **menos** gols | ↓ Leve viés a **under** |
| **Frio extremo / neve** | `temperature_2m` baixa / `snowfall`, `snow_depth` | Imprevisível; bola e piso irregulares | ⚠️ Alta incerteza — **alargar** a banda de confiança |
| **Tempo bom / seco** | sem precipitação relevante | Condição "neutra" de referência | — baseline |

> ⚠️ **Cuidado com a chuva leve.** O senso comum diz "choveu logo sai pouco gol", mas gramado **apenas molhado** costuma deixar o jogo mais **rápido** (bola desliza) e gera erros defensivos. O viés de under forte é específico de **chuva forte / campo encharcado**. Tratar tudo como under é o tipo de achismo que o mrtip quer evitar.

---

## 3. Como obter o clima

São **dois casos de uso distintos**, com fontes diferentes:

### 3.1 Jogo futuro (previsão) — para gerar o pick antes da partida

Precisamos da previsão para a **data e hora do jogo**, no **local do estádio** (lat/long).

- **Open-Meteo Forecast API** — `https://api.open-meteo.com/v1/forecast` — gratuita, sem chave para uso não comercial, retorna previsão horária (incl. `precipitation`, `wind_speed_10m`, `temperature_2m`). Boa primeira opção.
- **Alternativas:** OpenWeatherMap (One Call, free tier com chave), HG Weather / Climatempo (Brasil, foco PT-BR, planos pagos para mais recursos).

### 3.2 Jogo passado (histórico) — para backtesting e histórico de acerto

Para **validar a regra** e enriquecer o dossiê de jogos antigos, precisamos do clima **real daquele dia** no estádio.

- **Open-Meteo Historical (Archive) API** — **fonte recomendada**:
  - Endpoint: `https://archive-api.open-meteo.com/v1/archive`
  - Parâmetros obrigatórios: `latitude`, `longitude`, `start_date`, `end_date` (ISO-8601, ex.: `2024-08-31`).
  - Variáveis úteis (horárias): `precipitation`, `rain`, `snowfall`, `temperature_2m`, `apparent_temperature`, `wind_speed_10m`, `wind_gusts_10m`. Agregados diários: `precipitation_sum`, `wind_speed_10m_max`, etc.
  - Fonte: reanálise **ERA5** (0,25°, desde **1940**) — cobre praticamente qualquer histórico de liga que vamos usar.
  - **Licença CC BY 4.0** — livre para uso, inclusive comercial (com atribuição). Ideal para o produto.

Exemplo de chamada (chuva no horário do jogo, estádio em São Paulo):

```
https://archive-api.open-meteo.com/v1/archive
  ?latitude=-23.5455&longitude=-46.4736
  &start_date=2024-08-31&end_date=2024-08-31
  &hourly=precipitation,rain,wind_speed_10m,temperature_2m
  &timezone=America/Sao_Paulo
```

> **Por que histórico importa aqui:** sem o clima passado, "chuva diminui gols" é só palpite. Com a Archive API dá pra cruzar **cada jogo da liga × precipitação real** e medir o efeito — é o que torna a regra **auditável**, no espírito do histórico de acerto do produto.

### 3.3 Comparativo rápido de fontes

| Fonte | Histórico | Custo | Cobertura | Observação |
|---|---|---|---|---|
| **Open-Meteo Archive** | desde 1940 (ERA5) | **Grátis (CC BY 4.0)** | Global | **Recomendada** p/ histórico/backtesting |
| **Open-Meteo Forecast** | — (previsão) | Grátis (não comercial) | Global | **Recomendada** p/ jogo futuro |
| OpenWeatherMap | desde 1979 | Histórico é pago | Global | Requer chave |
| HG Weather | até ~3 anos | Pago p/ histórico | Brasil | PT-BR |
| Climatempo Advisor | sim | Pago | Brasil | PT-BR, atualização diária |
| INMET (gov BR) | sim | Grátis | Brasil (estações) | Dados de estação, não por coordenada arbitrária |

---

## 4. Como aplicar no pick

1. **Coletar** o clima no local + horário do jogo (§3.1 futuro, §3.2 histórico).
2. **Classificar** a condição pela tabela da §2 (chuva forte / leve / vento / calor / neve / seco).
3. **Ajustar** a estimativa de gols: o modelo quantitativo dá a probabilidade base de over/under 2.5; o sinal de clima a **desloca** (ex.: chuva forte → puxa para under) e/ou **alarga a incerteza** (neve, frio extremo).
4. **Explicar** (camada LLM): o pick **sempre mostra o porquê** — "under 2.5 reforçado: previsão de chuva forte (≈6 mm/h) no horário do jogo".

> **Não dupla-contar com o mercado.** Se as odds **já** se moveram por causa da chuva (notícia de temporal), o valor (EV+) pode já ter sumido. O clima gera valor justamente quando o mercado **ainda não** o precificou.

---

## 5. Calibração (transformar heurística em número)

Antes de o clima virar peso fixo no modelo, validar com o histórico da liga do MVP:

1. Puxar, via Archive API, a precipitação no horário de cada jogo das últimas N temporadas.
2. Separar os jogos em faixas (seco / chuva leve / chuva forte).
3. Comparar **média de gols** e **taxa de over 2.5** por faixa.
4. Só então definir os limiares (mm/h) e a magnitude do ajuste — substituindo os valores "de partida" da §2.

> Esse passo é o que diferencia uma regra **calibrada** de um "achismo de clima". Enquanto não houver calibração, o clima entra como sinal **qualitativo e de baixo peso**, e o pick deve deixar isso explícito.

---

## 6. Limitações e cuidados

- **Estádios cobertos / com teto retrátil** (e gramado sintético) anulam grande parte do efeito — não aplicar a regra cegamente; marcar o estádio.
- **Lat/long do estádio**, não da cidade: o clima pode variar dentro da mesma cidade. Manter um cadastro de coordenadas por estádio.
- **Horário e fuso:** usar a hora real do jogo no fuso da partida (`timezone` na API) — clima de manhã ≠ clima à noite.
- **Reanálise vs. medição:** ERA5 é modelo de reanálise (ótimo e consistente), não a estação dentro do estádio; suficiente para o sinal que queremos.
- **Não é determinístico:** chuva forte *reduz a tendência* de gols; não garante under. Posicionar como probabilidade, nunca como "bilhete certo" (ver riscos de jogo responsável no overview).

---

## Decisões em aberto

1. **Limiares de chuva** (mm/h) para "leve" vs. "forte" — fixar só após a calibração da §5. `[A confirmar]`
2. **Magnitude do ajuste** na probabilidade de over/under por faixa de clima. `[A confirmar]`
3. **Fonte de produção:** Open-Meteo (grátis) como única, ou redundância com OpenWeatherMap/Climatempo? `[A confirmar]`
4. **Cadastro de estádios** (lat/long + coberto/retrátil/sintético) — onde mora esse dado. `[A confirmar]`
5. **Peso relativo** do clima frente às demais dimensões (forma, lesões, mercado) no modelo. `[A confirmar]`

---

## Referências

- [Open-Meteo — Historical Weather (Archive) API](https://open-meteo.com/en/docs/historical-weather-api) — ERA5 desde 1940, CC BY 4.0.
- [Open-Meteo — site/forecast](https://open-meteo.com/)
- [OpenWeatherMap — API](https://openweathermap.org/api)
- [HG Weather (Brasil)](https://hgbrasil.com/weather/)
- [Climatempo Advisor](https://advisor.climatempo.com.br/)
- [INMET — Dados Históricos](https://portal.inmet.gov.br/dadoshistoricos)
- [WeatherSpark — histórico visual por data/local](https://weatherspark.com/history)
