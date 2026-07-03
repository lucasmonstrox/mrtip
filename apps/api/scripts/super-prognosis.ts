/**
 * EXPERIMENTO MOD-004 — "super prompt" V1: mesma chamada única do run-deepseek, mas com protocolo de
 * cobertura total (conclusão obrigatória por bloco + jogador a jogador + arestas com IDs + board completo
 * de mercados + refutação embutida + confiança por regra). NÃO toca no prompt vivo: reusa a PARTE 2 (dados)
 * do último prompt persistido em match_prognosis e troca só o método (Parte 1) e o schema de saída (Parte 3).
 * Não persiste no banco — grava dumps + um report.html consolidado comparando real × prompt atual × super.
 *
 * Run:  bun run scripts/super-prognosis.ts [matchId ...]   (default: os 3 da rodada 38)
 * Out:  scripts/output/super/<stamp>/{report.html, <matchId>.dump.json}
 */
import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText, jsonSchema, Output } from "ai"
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { evidenceDigestMd } from "./evidence-crossings"

const MODEL = "deepseek-v4-pro"
const EFFORT = "xhigh"
const BANDS = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"] as const

const DEFAULT_MATCHES = [
  "77a4255a-3e44-4fd9-a133-b13ca0898a91", // West Ham x Leeds
  "60a3d183-588a-47b8-985c-322ce5436927", // Sunderland x Chelsea
  "f0c7743f-3eaf-42ed-805b-d745dc4c4fb9", // Tottenham x Everton
]
const MATCH_IDS = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_MATCHES

const apiKey = process.env.DEEPSEEP_API_KEY ?? process.env.DEEPSEEK_API_KEY
if (!apiKey) throw new Error("DEEPSEEP_API_KEY ausente em apps/api/.env")
const deepseek = createDeepSeek({ apiKey })
const providerOptions = { deepseek: { thinking: { type: "enabled" }, reasoningEffort: EFFORT } }

// ---------------------------------------------------------------------------
// Tipos da saída "super"
// ---------------------------------------------------------------------------
const BLOCOS = [
  "contexto", "tabela_motivacao",
  "home_gols", "home_estilo", "home_goleiro", "home_qualidade", "home_forma", "home_momentum", "home_faixas", "home_fisico", "home_desfalques",
  "away_gols", "away_estilo", "away_goleiro", "away_qualidade", "away_forma", "away_momentum", "away_faixas", "away_fisico", "away_desfalques",
  "cruzamento_faixa", "base_rate", "probs_mercado", "cruzamentos_computados",
] as const
type Bloco = (typeof BLOCOS)[number]

type Bands = Record<(typeof BANDS)[number], number>
type OneXTwo = { home: number; draw: number; away: number }
type Conclusao = { id: string; bloco: Bloco; fato: string; dado: string; direcao: string; forca: "alta" | "media" | "baixa" }
type Aresta = { id: string; liga: string[]; leitura: string; efeito: string }
type Roteiro = { nome: string; prob: number; filme: string; arestas: string[] }
type Jogador = { nome: string; time: "home" | "away"; leitura: string }
type MercadoRow = {
  market: "1x2" | "over_under" | "btts" | "handicap" | "team_total" | "double_chance" | "draw_no_bet" | "odd_even"
  selection: "home" | "draw" | "away" | "over" | "under" | "yes" | "no" | "home_draw" | "draw_away" | "home_away" | "odd" | "even"
  team: "home" | "away" | null
  line: number | null
  prob: number
  variancia: number // 1 (mais segura) .. 5 (mais arriscada)
  valor: "alto" | "medio" | "baixo" | "nenhum"
  nota: string
}
type Ataque = { alvo: string; argumento: string; ids: string[]; veredito: "derruba" | "enfraquece" | "nao_sustenta" }
// CoVe (Chain-of-Verification): pergunta FECHADA sobre uma afirmação que carrega o veredito, respondida
// relendo o briefing (citação literal em `resposta_do_dado`) — nunca de memória do rascunho.
type Verificacao = {
  id: string // "V1", "V2", …
  alvo: string // a afirmação verificada (driver, best_bet, xg, aresta, janela)
  pergunta: string // fechada e checável no briefing
  resposta_do_dado: string // citação literal da Parte 2 que responde
  veredito: "confirma" | "contradiz" | "parcial"
  ajuste: string // o que mudou por causa desta checagem ("nada" só se confirma)
}
type Janela = { faixa: (typeof BANDS)[number]; leitura: string; prob_gol: number; lado: "home" | "away" | "equilibrado" }
type Tempo = { analise: string; prob_gol: number }
type Marcador = { nome: string; prob: number; motivo: string }
type PrevisaoJogador = {
  nome: string; time: "home" | "away"
  x_sot: number; x_gols: number; prob_marca: number; prob_sot1: number; x_kp: number
  leitura: string
}
type SuperPrognosis = {
  home: { xg: number; xg_1t: number; xg_2t: number; xg_bands: Bands; summary: string }
  away: { xg: number; xg_1t: number; xg_2t: number; xg_bands: Bands; summary: string }
  general: {
    total: number; total_1t: number; total_2t: number
    over25_prob: number; btts_prob: number
    one_x_two: OneXTwo; one_x_two_1t: OneXTwo; one_x_two_2t: OneXTwo
    confidence: "low" | "medium" | "high"
    confidence_regra: string
    summary: string
  }
  conclusoes: Conclusao[]
  blocos_sem_sinal: { bloco: Bloco; motivo: string }[]
  descartadas: { id: string; motivo: string }[]
  jogadores: Jogador[]
  arestas: Aresta[]
  roteiros: Roteiro[]
  janelas: Janela[]
  tempos: { primeiro: Tempo; segundo: Tempo }
  previsoes_jogadores: PrevisaoJogador[]
  marcadores: { home: Marcador[]; away: Marcador[] }
  mercados: MercadoRow[]
  best_bet: {
    market: MercadoRow["market"]; selection: MercadoRow["selection"]
    team: "home" | "away" | null; line: number | null
    confidence: "low" | "medium" | "high"; probability: number
    evidence_for: string[]; evidence_against: string[]
    analysis: string
  }
  refutacao: { ataques: Ataque[]; conclusao: string }
  verificacao: { checks: Verificacao[]; revisoes: string }
  drivers: string[]
}

// ---------------------------------------------------------------------------
// JSON Schema (mesmo padrão do run-deepseek: Output.object + jsonSchema)
// ---------------------------------------------------------------------------
const num = { type: "number" as const }
const str = { type: "string" as const }
const strArr = { type: "array" as const, items: str }
const oxt = { type: "object" as const, properties: { home: num, draw: num, away: num }, required: ["home", "draw", "away"], additionalProperties: false }
const bandsSchema = {
  type: "object" as const,
  properties: Object.fromEntries(BANDS.map((b) => [b, num])),
  required: [...BANDS] as string[],
  additionalProperties: false,
}
const conf = { type: "string" as const, enum: ["low", "medium", "high"] }
const teamSchema = {
  type: "object" as const,
  properties: { xg: num, xg_1t: num, xg_2t: num, xg_bands: bandsSchema, summary: str },
  required: ["xg", "xg_1t", "xg_2t", "xg_bands", "summary"],
  additionalProperties: false,
}
const marketEnum = { type: "string" as const, enum: ["1x2", "over_under", "btts", "handicap", "team_total", "double_chance", "draw_no_bet", "odd_even"] }
const selectionEnum = { type: "string" as const, enum: ["home", "draw", "away", "over", "under", "yes", "no", "home_draw", "draw_away", "home_away", "odd", "even"] }
const teamNull = { type: ["string", "null"] as ("string" | "null")[], enum: ["home", "away", null] }
const lineNull = { type: ["number", "null"] as ("number" | "null")[] }
const superSchema = jsonSchema<SuperPrognosis>({
  type: "object",
  properties: {
    home: teamSchema,
    away: teamSchema,
    general: {
      type: "object",
      properties: {
        total: num, total_1t: num, total_2t: num, over25_prob: num, btts_prob: num,
        one_x_two: oxt, one_x_two_1t: oxt, one_x_two_2t: oxt,
        confidence: conf, confidence_regra: str, summary: str,
      },
      required: ["total", "total_1t", "total_2t", "over25_prob", "btts_prob", "one_x_two", "one_x_two_1t", "one_x_two_2t", "confidence", "confidence_regra", "summary"],
      additionalProperties: false,
    },
    conclusoes: {
      type: "array",
      items: {
        type: "object",
        properties: { id: str, bloco: { type: "string", enum: [...BLOCOS] }, fato: str, dado: str, direcao: str, forca: { type: "string", enum: ["alta", "media", "baixa"] } },
        required: ["id", "bloco", "fato", "dado", "direcao", "forca"],
        additionalProperties: false,
      },
    },
    blocos_sem_sinal: {
      type: "array",
      items: { type: "object", properties: { bloco: { type: "string", enum: [...BLOCOS] }, motivo: str }, required: ["bloco", "motivo"], additionalProperties: false },
    },
    descartadas: {
      type: "array",
      items: { type: "object", properties: { id: str, motivo: str }, required: ["id", "motivo"], additionalProperties: false },
    },
    jogadores: {
      type: "array",
      items: { type: "object", properties: { nome: str, time: { type: "string", enum: ["home", "away"] }, leitura: str }, required: ["nome", "time", "leitura"], additionalProperties: false },
    },
    arestas: {
      type: "array",
      items: { type: "object", properties: { id: str, liga: strArr, leitura: str, efeito: str }, required: ["id", "liga", "leitura", "efeito"], additionalProperties: false },
    },
    roteiros: {
      type: "array",
      items: { type: "object", properties: { nome: str, prob: num, filme: str, arestas: strArr }, required: ["nome", "prob", "filme", "arestas"], additionalProperties: false },
    },
    janelas: {
      type: "array",
      items: {
        type: "object",
        properties: { faixa: { type: "string", enum: [...BANDS] }, leitura: str, prob_gol: num, lado: { type: "string", enum: ["home", "away", "equilibrado"] } },
        required: ["faixa", "leitura", "prob_gol", "lado"],
        additionalProperties: false,
      },
    },
    tempos: {
      type: "object",
      properties: {
        primeiro: { type: "object", properties: { analise: str, prob_gol: num }, required: ["analise", "prob_gol"], additionalProperties: false },
        segundo: { type: "object", properties: { analise: str, prob_gol: num }, required: ["analise", "prob_gol"], additionalProperties: false },
      },
      required: ["primeiro", "segundo"],
      additionalProperties: false,
    },
    previsoes_jogadores: {
      type: "array",
      items: {
        type: "object",
        properties: {
          nome: str, time: { type: "string", enum: ["home", "away"] },
          x_sot: num, x_gols: num, prob_marca: num, prob_sot1: num, x_kp: num,
          leitura: str,
        },
        required: ["nome", "time", "x_sot", "x_gols", "prob_marca", "prob_sot1", "x_kp", "leitura"],
        additionalProperties: false,
      },
    },
    marcadores: {
      type: "object",
      properties: {
        home: { type: "array", items: { type: "object", properties: { nome: str, prob: num, motivo: str }, required: ["nome", "prob", "motivo"], additionalProperties: false } },
        away: { type: "array", items: { type: "object", properties: { nome: str, prob: num, motivo: str }, required: ["nome", "prob", "motivo"], additionalProperties: false } },
      },
      required: ["home", "away"],
      additionalProperties: false,
    },
    mercados: {
      type: "array",
      items: {
        type: "object",
        properties: { market: marketEnum, selection: selectionEnum, team: teamNull, line: lineNull, prob: num, variancia: num, valor: { type: "string", enum: ["alto", "medio", "baixo", "nenhum"] }, nota: str },
        required: ["market", "selection", "team", "line", "prob", "variancia", "valor", "nota"],
        additionalProperties: false,
      },
    },
    best_bet: {
      type: "object",
      properties: {
        market: marketEnum, selection: selectionEnum, team: teamNull, line: lineNull,
        confidence: conf, probability: num, evidence_for: strArr, evidence_against: strArr, analysis: str,
      },
      required: ["market", "selection", "team", "line", "confidence", "probability", "evidence_for", "evidence_against", "analysis"],
      additionalProperties: false,
    },
    refutacao: {
      type: "object",
      properties: {
        ataques: {
          type: "array",
          items: { type: "object", properties: { alvo: str, argumento: str, ids: strArr, veredito: { type: "string", enum: ["derruba", "enfraquece", "nao_sustenta"] } }, required: ["alvo", "argumento", "ids", "veredito"], additionalProperties: false },
        },
        conclusao: str,
      },
      required: ["ataques", "conclusao"],
      additionalProperties: false,
    },
    verificacao: {
      type: "object",
      properties: {
        checks: {
          type: "array",
          minItems: 10, // enforcement duro — o Forest x Bournemouth entregou 7 onde a instrução pedia ≥10
          items: {
            type: "object",
            properties: { id: str, alvo: str, pergunta: str, resposta_do_dado: str, veredito: { type: "string", enum: ["confirma", "contradiz", "parcial"] }, ajuste: str },
            required: ["id", "alvo", "pergunta", "resposta_do_dado", "veredito", "ajuste"],
            additionalProperties: false,
          },
        },
        revisoes: str,
      },
      required: ["checks", "revisoes"],
      additionalProperties: false,
    },
    drivers: strArr,
  },
  required: ["home", "away", "general", "conclusoes", "blocos_sem_sinal", "descartadas", "jogadores", "arestas", "roteiros", "janelas", "tempos", "previsoes_jogadores", "marcadores", "mercados", "best_bet", "refutacao", "verificacao", "drivers"],
  additionalProperties: false,
})

// ---------------------------------------------------------------------------
// Super prompt — Parte 1 (método) e Parte 3 (saída); a Parte 2 (dados) vem do banco
// ---------------------------------------------------------------------------
function buildSuperPrompt(homeName: string, awayName: string, dataSection: string, digest: string): string {
  return `# Prognóstico TOTAL — ${homeName} x ${awayName}

**IMPORTANTE: raciocine E responda inteiramente EM PORTUGUÊS do Brasil**, desde a primeira palavra do seu raciocínio interno (thinking).

---

**PARTE 1 · COMO RACIOCINAR** — o protocolo abaixo é COMO você pensa. Os dados vêm na Parte 2; a saída exigida, na Parte 3.

## Você
O **melhor apostador de futebol do mundo** — um **sharp**, não um palpiteiro. Seu edge é método, frieza e **EVIDÊNCIA**: estatística é PREVISÃO, não destino — o Poisson e o λ são a taxa-base, cegos ao roteiro que o jogo vai virar; a sua leitura (intenção, assimetria, filme do jogo) é o que ATUALIZA o número, e cada passo dela é amarrado a um dado do briefing. Você busca valor, dimensiona risco e sempre crava o melhor mercado — nunca "passa".

## PROTOCOLO DE ANÁLISE TOTAL — 7 passos, NESTA ordem

### Passo 1 — VARREDURA: conclusões por bloco (nada fica sem ler)
O briefing da Parte 2 se divide nos blocos listados abaixo. De CADA bloco extraia **1 a 3 conclusões** — cada uma com **ID sequencial** ("C1", "C2", …), o **dado copiado do briefing** (número/frase literal) e a **direção** (o que implica pra ESTE jogo). Bloco que não rende sinal entra em \`blocos_sem_sinal\` com o motivo — nenhum bloco pode simplesmente sumir da análise.
Chaves de bloco (use exatamente estas no campo \`bloco\`): **contexto** (data/local/clima/descanso/viagem) · **tabela_motivacao** (posições, linhas, intenção, veredito de intenção) · **home_gols** / **away_gols** (gols & finalização season+mando) · **home_estilo** / **away_estilo** (feito×sofrido: ataques perigosos, chutes fora, bloqueados) · **home_goleiro** / **away_goleiro** (seção "Goleiro": defesas/j, % dentro da área, save%, erros→chute — a trava da conversão defensiva: cruze o save% do titular com o VOLUME de SoT do adversário) · **home_qualidade** / **away_qualidade** (notas, MOTM, forma individual, perfil por jogador: pontaria, big chances cria/perde, aéreo, faltas, erros) · **home_forma** / **away_forma** (últimos 5 qualificados + consistência) · **home_momentum** / **away_momentum** (curvas minuto a minuto: padrão de pressão, reação a gol feito/sofrido, casa vs fora) · **home_faixas** / **away_faixas** (distribuição de gols por faixa de 15min) · **home_fisico** / **away_fisico** (seção "Jogo físico": cabeceios feito/sofrido, líderes de aéreo, quem cava/comete faltas, erros→chute do time — cruze aéreo × bola parada do rival e cavador × faltoso) · **home_desfalques** / **away_desfalques** · **cruzamento_faixa** (tabelas ataque×defesa por faixa) · **base_rate** (rotas A e B) · **probs_mercado** (priors Poisson) · **cruzamentos_computados** (o bloco final da Parte 2: arquétipo/mecanismo/dinâmica JÁ cruzados pelo código — os sinais mais fortes do briefing; trate cada linha como uma conclusão pronta e CRUZE-A com a intenção da tabela: o arquétipo diz o cenário técnico, a tabela diz se o time vai honrá-lo). Se o briefing não tiver uma seção (prompt gerado antes dela existir), declare o bloco em \`blocos_sem_sinal\` com motivo "seção ausente no briefing".

### Passo 2 — JOGADOR POR JOGADOR (ninguém passa em branco)
TODO jogador NOMEADO no briefing (blocos de qualidade individual E de desfalques, dos DOIS times) recebe uma leitura de 1 frase no campo \`jogadores\`: o que a forma/presença/ausência DELE muda **neste confronto específico** — estrela em queda, lateral em alta, zagueiro-pilar fora, desfalque que já estava precificado na média. Leitura genérica ("é um bom jogador") não vale; irrelevância declarada ("0% dos gols, sem volume — irrelevante") vale.

### Passo 2b — PREVISÃO POR JOGADOR (a linha estatística de cada um NESTE jogo)
O bloco **Expectativa por jogador** dos cruzamentos pré-computados traz, pra cada jogador do XI provável dos DOIS times, a previsão quant (xSoT, xG, P(marca), P(1+ SoT), xKP) com os fatores já cruzados (arquétipo do rival, mando, forma, canal, desfalque defensivo do rival). Em \`previsoes_jogadores\`, produza a previsão FINAL de cada um desses jogadores:
- **PARTA do número computado** (copie-o como âncora) e só o mova com evidência NOMEADA que o quant não viu — principalmente o SEU roteiro (time que vai se lançar atrás do resultado → mais volume pros atacantes dele; time que vai administrar → menos) e a intenção de tabela. Sem fator novo, mantenha o número.
- \`leitura\` = 1-2 frases do que ESPERAR dele neste jogo (onde aparece, em que janela do relógio ameaça, de que jeito) — amarrada aos fatores e ao roteiro, nunca genérica.
- Jogador do XI sem ameaça ofensiva declara isso ("volante de contenção: xG ~0, papel é anular o 10 deles").
Coerência dura: a SOMA dos \`x_gols\` de cada lado deve conversar com o \`xg\` do time (Passo 5/saída) — se você subiu o xG do time no roteiro, suba dos jogadores certos; e os \`marcadores\` do Passo 4c saem DESTA lista (os maiores \`prob_marca\`).

### Passo 3 — ARESTAS: o cruzamento (o coração da análise)
Número isolado não prevê nada; o CONFRONTO prevê. Construa **no mínimo 8 arestas**, cada uma com ID ("A1", "A2", …), ligando **≥2 conclusões pelo ID** (campo \`liga\`), com leitura E efeito (direção + tamanho no xG/mercado). Cruzamentos OBRIGATÓRIOS quando houver dado:
- **ataque home × defesa away** e o inverso (SoT feito × concedido, estilo × estilo);
- **intenção de tabela × estilo/forma** de cada lado (quem precisa consegue? quem administra segura?);
- **desfalque × volume** do próprio time E **desfalque defensivo × janela em que o adversário pressiona**;
- **forma recente × qualidade dos adversários enfrentados** (forma real ou inflada?);
- **momentum home × momentum away** (a janela onde um costuma surtar e o outro costuma afundar);
- **fadiga/descanso × intenção**;
- **qualidade individual × desfalques** (quem carrega o time está disponível e em que forma?);
- **SoT criado por um × save% do goleiro do outro** (volume × trava: muito volume contra goleiro em alta = under disfarçado; contra goleiro de save% baixo/com erros = over barato);
- **bola parada/escanteios de um × aéreo do outro** (quem cruza e quem falha no alto) e **cavador de faltas × time faltoso** (pênalti/bola parada perigosa).
**REGRA DE HIGIENE:** toda conclusão do Passo 1 é usada em ≥1 aresta OU vai para \`descartadas\` com motivo. Conclusão órfã = análise desperdiçada — o runtime confere.

### Passo 4 — ROTEIROS: o filme, com ramificação
2 a 3 roteiros prováveis (probs somando ~1.0), cada um com a **cascata condicional** (quem marca primeiro → o que o outro é obrigado a fazer → o que isso faz com o total/handicap) e citando os **IDs das arestas** que o sustentam. Ramifique pros dois lados: roteiros que ABREM e roteiros que FECHAM o jogo. O placar muda as taxas e o Poisson é cego a isso — você não.

### Passo 4b — LINHA DO TEMPO: o jogo previsto NO RELÓGIO (3 camadas)
Transforme o roteiro vencedor numa previsão temporal completa, amarrada aos dados (momentum por faixa, gols por faixa, cruzamento de faixa, fadiga, dinâmica pós-gol):
- **\`tempos.primeiro\`**: análise COMPLETA do 1º tempo (quem impõe o ritmo, onde o jogo trava, quando o gol ameaça sair, o que o intervalo muda) + \`prob_gol\` = P(≥1 gol no 1ºT).
- **\`janelas\`** (as 6 faixas de 15min, TODAS): pra cada janela, a leitura do que acontece ALI (quem pressiona, o que o placar provável já fez com o jogo — as janelas do 2ºT devem refletir o game-state do roteiro, não o jogo zerado) + \`prob_gol\` da janela + \`lado\` mais provável de marcar nela. As 6 janelas contam UMA história contínua — não 6 leituras soltas.
- **\`tempos.segundo\`**: análise completa do 2º tempo (efeito do placar provável do intervalo, fadiga/descanso, quem cresce, onde o jogo se decide) + \`prob_gol\`.
Coerência: as \`prob_gol\` das janelas devem casar com as \`xg_bands\` e os totais por tempo.
**ANCORAGEM DURA DAS JANELAS (quant-first):** a distribuição-base das \`prob_gol\` vem dos **índices do bloco "Cruzamento ataque × defesa por faixa"** (as duas tabelas — some os índices dos dois lados por faixa e normalize): janela de índice maior COMEÇA mais quente, a de índice menor começa mais fria. O cruzamento de MOMENTUM e o seu roteiro apenas MODULAM essa base com evidência nomeada — nunca a substituem (momentum é fluxo dos últimos 5; o índice é onde os GOLS deste confronto historicamente nascem). A coluna **"sofre/j" do rival é sinal POR SI SÓ**: a janela onde o rival mais sangra é quente mesmo que o seu ataque não pontue alto ali — o time que precisa de gol ataca onde dói, e fadiga/desespero amplificam isso no fim. **PROIBIDO** dar a menor prob do jogo pra janela de maior índice (ou vice-versa) sem citar o dado que justifica a inversão. Cada \`leitura\` de janela cita o índice da faixa.

### Passo 4c — MARCADORES (análise SEPARADA — depois da linha do tempo, antes dos mercados)
Das suas \`previsoes_jogadores\` (Passo 2b) + o bloco **Artilharia**: preveja **2-3 prováveis marcadores POR TIME** (\`marcadores\`) — os maiores \`prob_marca\` da sua lista, com \`prob\` coerente com eles e \`motivo\` amarrado a dado (gols na temporada, forma últ.5, SoT/j, cobrança de pênalti, desfalque que abre a vaga/espaço). **Exclua desfalcados confirmados**; jogador em dúvida entra com prob descontada e a dúvida no motivo. Esta análise é independente da best_bet — não precisa apostar nela.
**ÂNCORA DURA (2ª auditoria): a linha "🎯 Candidatos a marcador (COMPUTADO)" do bloco Expectativa é o seu ponto de partida** — ela já vem com o top do XI por P(marca), os ⚑estruturais (defesa/meio com gols de bola parada/2ª bola — NÃO os rebaixe pelo xG por chute; foi assim que o volante decisivo ficou de fora) e o 🔁banco com P estimada de sub. Seus \`marcadores\` SAEM dela: copie as probs como âncora e só as mova com evidência nomeada (forma, desfalque que abre vaga, canal quente). Complemente com:
- **Jogador do canal quente**: se uma conclusão/aresta sua nomeou o CANAL onde o gol tende a nascer (corredor em queda, matchup favorável), os jogadores NOMEADOS nesse canal sobem na lista — não deixe o seu próprio cruzamento apontar quem marca e a lista ignorá-lo.
- Descartar um candidato computado (estrutural ou banco) exige motivo explícito no campo \`motivo\` de quem entrou no lugar.

### Passo 5 — BOARD COMPLETO DE MERCADOS
Preencha \`mercados\` com TODAS estas linhas (uma entrada por linha; probs coerentes com seus xG, 1x2 e roteiros):
1. \`1x2\` home · 2. \`1x2\` draw · 3. \`1x2\` away
4. \`double_chance\` home_draw · 5. \`double_chance\` draw_away · 6. \`double_chance\` home_away
7. \`draw_no_bet\` home · 8. \`draw_no_bet\` away
9. \`over_under\` over 1.5 · 10. \`over_under\` over 2.5 · 11. \`over_under\` over 3.5
12. \`btts\` yes
13. \`team_total\` home over 0.5 · 14. \`team_total\` home over 1.5
15. \`team_total\` away over 0.5 · 16. \`team_total\` away over 1.5
17. \`handicap\` home -1 · 18. \`handicap\` away -1
19. \`odd_even\` odd
Para cada linha: \`variancia\` de 1 (mais segura) a 5 (mais arriscada), \`valor\` (alto/medio/baixo/nenhum — distância entre a SUA prob e o prior Poisson do briefing quando existir, + robustez ao roteiro) e \`nota\` de 1 frase.

### Passo 6 — REFUTAÇÃO (advogado do diabo) e confiança por REGRA
**DISCIPLINA DE VARIÂNCIA (aplique ANTES de escolher a candidata — valor NÃO desempata sozinho):** entre apostas de valor parecido, crave SEMPRE a de MENOR variância. Escada, da mais segura à mais arriscada: **(1)** team_total over 0.5 do lado forte → **(2)** team_total 1.5 / handicap de favorito claro / dupla chance / DNB → **(3)** over_under (a LINHA é a alavanca: escolha linha com margem ≥0.3 do SEU total; linha colada no xG é cara-ou-coroa — afaste a linha ou troque de mercado. Linhas INTEIRAS também valem na best_bet — under/over 2, 3 ou 4 — e têm PUSH de proteção quando o total cai exato: under 3.0 num jogo que você lê como "2 gols, risco de 3" domina o under 2.5, porque o cenário-limite devolve a aposta em vez de perder) → **(4)** 1x2 → **(5)** btts. **PROIBIDO** cravar 1x2 com a sua própria prob < 0.45 (e NUNCA o empate como best_bet) enquanto existir dupla chance/DNB/team_total com valor: prob baixa + "valor" é ticket de longshot, não leitura sharp. Em jogo com veredito de intenção ⚠️ (um lado administra), prefira under com margem ou team_total do lado que precisa. A anti-timidez vale pro TAMANHO do xG, não pra escolher mercado arriscado: convicção no número, disciplina no mercado.
**A escada NÃO é lexicográfica (fix da auditoria 2026-07-03):** o degrau só desempata entre apostas de valor PARECIDO. Se no seu próprio board um mercado de variância ≤3 tem \`valor\` estritamente MAIOR que o do degrau abaixo (ex.: dupla chance "alto" vs team_total 0.5 "medio"), **o valor vence o degrau** — escolher o piso de retorno com o seu board gritando valor um degrau acima é jogar fora o edge que você mesmo mediu. Só desça ao degrau mais conservador quando o valor empata ou o roteiro é frágil (confidence low).
Escolha a aposta candidata (maior valor × menor variância compatível com o roteiro). ANTES de cravar, **ataque-a**: 2-3 ataques em \`refutacao.ataques\`, cada um citando os IDs (conclusão/aresta) que jogam CONTRA, com veredito: **derruba** / **enfraquece** / **nao_sustenta**. Se um ataque DERRUBA, troque de aposta e refaça este passo. Então aplique a **REGRA DE CONFIANÇA** (não é feeling — escreva a regra aplicada em \`confidence_regra\`):
- **high** = ≥3 arestas independentes convergem pra aposta E nenhum ataque ficou em "derruba"/"enfraquece" com dado forte E as rotas A e B do base rate apontam na mesma direção.
- **low** = arestas em conflito direto sem vencedor claro, OU um ataque "enfraquece" sustentado por dado forte.
- **medium** = o resto.

### Passo 7 — VERIFICAÇÃO ENCADEADA (CoVe): o rascunho NÃO é o veredito
Tudo o que você produziu até aqui é RASCUNHO. Antes de emitir a saída, rode a **Chain-of-Verification** — ela pega o erro que a refutação não pega: a refutação ataca a APOSTA com dados contrários; a CoVe verifica se as suas AFIRMAÇÕES leram o dado certo E se as suas INFERÊNCIAS sobrevivem ao dado.
**REGRA DE COMPOSIÇÃO (dura): checar só o que você copiou é teatro — "o briefing diz X?" nunca falha. Dos ≥10 checks, no MÍNIMO metade tem que poder dar \`contradiz\`:**
1. **≥2 checks ADVERSARIAIS sobre a condição de pagamento da best_bet**, no formato de FREQUÊNCIA RECENTE: "em quantos dos últimos 5 jogos o [time] fez o que esta aposta precisa (marcou ≥ linha+1 / o jogo passou da linha / o resultado bateu)?" — responda CONTANDO nos blocos de forma/consistência. Se a frequência recente contraria a aposta, isso é \`contradiz\`, não nota de rodapé.
2. **≥1 check de DIREÇÃO (1x2), VINCULANTE SOBRE O BOARD**: "em quantos dos últimos 5 o favorito do meu 1x2 VENCEU (e no mando deste jogo)?" — se a frequência contraria o favoritismo (ex.: venceu ≤1/5), a probabilidade dele no \`one_x_two\` e nas linhas 1x2/DC/DNB do board TEM que descer na revisão — matar só a *aposta* e deixar o número intacto no board é o erro exato da run que deu 52% pro time que perdeu.
3. **≥1 check de COERÊNCIA INTERNA**: "existe número no MEU próprio output que contradiz a best_bet?" (ex.: prob_gol 0.50 numa janela + tese de desmoronamento pós-gol vs under; 'goleiros seguros' com um save% abaixo da média; xG do time acima de AMBAS as âncoras). **Com consequência**: se o cenário de falha que este check descreve COINCIDE com um roteiro seu de prob ≥0.30 (ex.: "se o mandante marca primeiro o visitante desmorona" e o seu roteiro provável é exatamente o mandante abrindo), isso NÃO é "enfraquece mas não invalida" — rebaixe a \`confidence\` pra low OU troque pra um mercado que SOBREVIVA a esse cenário, e diga qual das duas fez.
4. **≥1 check de IDENTIDADE DE TITULAR**: "o goleiro/jogador que esta aposta pressupõe em campo é o titular REAL?" — cruze o XI provável com as ausências da trajetória ("faltou X/5" no perfil) e com os desfalques. Goleiro: o que importa pra aposta é o do time que DEFENDE o evento apostado.
5. **≥1 check de COBERTURA**: "algum bloco ficou sem conclusão E sem registro em blocos_sem_sinal? alguma conclusão de força alta ficou órfã (fora de toda aresta)? os \`marcadores\` cobrem os candidatos COMPUTADOS (🎯 do bloco Expectativa — estrutural e banco incluídos)?" — se não, conserte antes de sair.
6. Os demais cobrem os alvos obrigatórios: cada um dos 3 \`drivers\`, o \`xg\` de cada time (os 2 — inclusive o TAMANHO do desvio vs prior: "por que N% e não o prior?"), o roteiro vencedor e a aresta de maior efeito.
**TRAVA ANTI-ARREDONDAMENTO (dura)**: a probabilidade publicada é a DERIVADA, sem cosmética — se o Poisson/grid dá 0.48, o campo é 0.48. É PROIBIDO arredondar para cruzar um limiar de elegibilidade ("vou usar 0.50 para permitir a aposta" é fraude de si mesmo): uma aposta que só existe porque 48 virou 50 NÃO existe — escolha outro mercado. Invocar Dixon-Coles ou outro ajuste exige o NÚMERO real do ajuste citado, não "pode ajustar".
**Como responder**: RELENDO a Parte 2 do zero — \`resposta_do_dado\` = citação LITERAL (número/frase copiada do bloco). PROIBIDO responder de memória do rascunho.
**Consequência (dura)**: um \`contradiz\` em check ligado a driver/best_bet OBRIGA revisão NUMÉRICA (re-derive a prob/xG afetado, ou troque a aposta e volte ao Passo 6) — **"mantive porque a perda é qualitativa" é PROIBIDO** sem um dado citado que sustente a manutenção. \`parcial\` rebaixa a força do fator; se era decisivo, rebaixa a \`confidence\`. **Se os seus checks derem TODOS \`confirma\` com ajuste "nenhum", trate como red flag de complacência**: refaça os 2 adversariais com mais dente antes de aceitar.
**\`verificacao.revisoes\`** = o resumo do que mudou entre o rascunho e a saída final ("nada mudou" só é aceitável se TODOS confirmaram APÓS a refeita adversarial). A saída final (xG, mercados, best_bet, summaries) é a REVISADA, nunca o rascunho.

## Calibragem numérica (regras duras)
- **PARTA da Rota B** (prior) e MOVA com evidência nomeada — direção E tamanho. Sem fator nem roteiro, fique no prior; nunca regrida pro meio por covardia.
- **ANTI-TIMIDEZ COM REGRA:** quando ≥3 fatores independentes convergem a favor de um lado (ex.: precisa vencer + rival desengajado + rival desfalcado na defesa), o xG desse lado DEVE fugir da média — 30-60% acima do prior é o intervalo esperado nesse cenário, não exceção. Timidez em cenário unilateral é erro tão grave quanto over por inércia. **E a cauda engorda junto**: motivação assimétrica extrema + rival perdendo >20% do volume defensivo por desfalque é a receita da GOLEADA — o placar do roteiro não pode parar reflexivamente em 1-0/2-0; deixe os placares 3-0/3-1 com massa real nos \`topScores\`/roteiros quando essa receita está posta.
- **RECONCILIE AS ÂNCORAS antes de fixar o xG:** quando a forma RECENTE (últ.5) contradiz o split de arquétipo/season (ex.: time faz 2.0 g/j contra bloco baixo na season mas 0.8 g/j nos últimos 5, com força alta), NÃO escolha a âncora que agrada a sua tese — encolha na direção do base rate ponderando a recência, e escreva a reconciliação numa conclusão. Saltar ACIMA de ambas as âncoras (base rate E bottom-up) exige fator nomeado extraordinário.
- **SoT é o volume primário** (3× mais denso que gols); gols dão a conversão. Onde as rotas divergem, confie na B.
- Desconto de desfalque age no **VOLUME**, não na conversão. **NÃO double-conte** desfalque que já estava fora nos últimos 5 (já está na média). With/without com ⚠️: ignore o de gols, olhe o de SoT. Desfalque DEFENSIVO (alto % das interceptações do time) sobe o λ do ADVERSÁRIO.
- Vantagem de casa já está embutida nos λ — não some de novo.
- O **VEREDITO DE INTENÇÃO** do briefing (banner no bloco de motivação) é o filtro que mais separou acerto de erro: processe-o como conclusão de \`tabela_motivacao\` e cruze-o com estilo e desfalques antes de escolher o mercado.
- **NÃO gaste raciocínio conferindo somas** (bands × xg): o runtime normaliza. Gaste em análise e cruzamento.

---

**PARTE 2 · OS DADOS DO JOGO** — é daqui que saem as conclusões do Passo 1. Percorra bloco a bloco.

${dataSection}

## Cruzamentos pré-computados (bloco \`cruzamentos_computados\` — o código JÁ cruzou; são os sinais mais fortes do briefing)
${digest}

---

**PARTE 3 · SUA SAÍDA** (objeto tipado, validado pelo runtime — campos em inglês/português conforme o schema; TODOS os textos em PT-BR)

- \`home\` / \`away\`: \`xg\`, \`xg_1t\`, \`xg_2t\`, \`xg_bands\` (6 faixas — distribuição aproximada; o runtime normaliza a soma) e \`summary\` (leitura curta do time).
- \`general\`: \`total\`, \`total_1t\`, \`total_2t\`, \`over25_prob\`, \`btts_prob\`, \`one_x_two\` / \`one_x_two_1t\` / \`one_x_two_2t\`, \`confidence\` + \`confidence_regra\` (a regra do Passo 6 aplicada, por extenso) e \`summary\`.
- \`conclusoes\`: TODAS as conclusões do Passo 1 (id, bloco, fato, dado copiado, direção, força).
- \`blocos_sem_sinal\`: blocos que não renderam conclusão, com motivo.
- \`descartadas\`: conclusões não usadas em nenhuma aresta, com motivo.
- \`jogadores\`: a leitura de CADA jogador nomeado no briefing (Passo 2).
- \`previsoes_jogadores\`: a previsão de CADA jogador do XI provável dos dois times (Passo 2b) — nome, time, \`x_sot\`, \`x_gols\`, \`prob_marca\`, \`prob_sot1\`, \`x_kp\` (ancorados no bloco Expectativa; mova só com evidência nomeada) e \`leitura\` (o que esperar dele neste jogo).
- \`arestas\`: os cruzamentos do Passo 3 (id, liga=[IDs], leitura, efeito).
- \`roteiros\`: os filmes do Passo 4 (nome, prob, filme, arestas=[IDs]).
- \`janelas\`: as 6 faixas do Passo 4b (faixa, leitura, prob_gol, lado) — uma entrada POR faixa, na ordem.
- \`tempos\`: \`primeiro\` e \`segundo\` (analise completa + prob_gol de cada tempo).
- \`marcadores\`: \`home\` e \`away\` com 2-3 prováveis marcadores cada (nome, prob, motivo) — Passo 4c.
- \`mercados\`: o board COMPLETO do Passo 5 (as 19 linhas).
- \`best_bet\`: a decisão — market/selection/team/line/confidence/probability + \`evidence_for\` e \`evidence_against\` (IDs de conclusões/arestas) + \`analysis\` (análise completa: roteiro esperado, o que sustenta, o risco). NUNCA "passar".
- \`refutacao\`: os ataques do Passo 6 e a conclusão (o que sobreviveu e por quê).
- \`verificacao\`: os checks CoVe do Passo 7 (id, alvo, pergunta, resposta_do_dado com citação literal, veredito, ajuste) + \`revisoes\` (o que mudou do rascunho pra saída final).
- \`drivers\`: os 3 fatores que mais moveram o número.

⚠️ LEMBRETE FINAL: raciocínio interno (thinking) e resposta 100% em PORTUGUÊS do Brasil, desde a primeira palavra. Comece o raciocínio com "Vou analisar…".`
}

// ---------------------------------------------------------------------------
// Dados: partida + resultado real + prompt/prognóstico atuais (banco)
// ---------------------------------------------------------------------------
type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

async function loadMatch(matchId: string) {
  const [m] = rowsOf(await db.execute(sql`
    select m.id, m.home_team_id, m.away_team_id, m.ft_home, m.ft_away, m.ht_home, m.ht_away, th.name as home_name, ta.name as away_name
    from match m join team th on th.id = m.home_team_id join team ta on ta.id = m.away_team_id
    where m.id = ${matchId}`))
  if (!m) throw new Error(`match ${matchId} não encontrado`)
  const [prog] = rowsOf(await db.execute(sql`
    select prompt_text, xg_home, xg_away, total, over25_prob, btts_prob, one_x_two, confianca,
           best_bet_market, best_bet_selection, best_bet_team, best_bet_line, best_bet_confidence, best_bet_probability, reasoning_tokens
    from match_prognosis where match_id = ${matchId} order by run_at desc limit 1`))
  if (!prog?.prompt_text) throw new Error(`match ${matchId} sem prompt_text em match_prognosis — rode o pipeline atual antes`)
  const txt = String(prog.prompt_text)
  const start = txt.indexOf("## Contexto")
  const end = txt.indexOf("**PARTE 3")
  if (start < 0 || end < 0) throw new Error(`match ${matchId}: não achei os marcadores da PARTE 2 no prompt_text`)
  const dataSection = txt.slice(start, end).replace(/---\s*$/, "").trim()
  // Gols reais (minuto + autor) — SÓ pro report validar janelas/marcadores; nunca entra no prompt.
  const gs = rowsOf(await db.execute(sql`
    select g.minute, g.team_id, g.type, p.name as scorer from goal g
    left join player p on p.id = g.player_id
    where g.match_id = ${matchId} order by g.minute`))
  const realGoals = gs.map((g) => ({
    minute: Number(g.minute),
    side: (String(g.team_id) === String(m.home_team_id) ? "home" : "away") as "home" | "away",
    scorer: g.scorer ? String(g.scorer) : null,
    type: String(g.type ?? "goal"),
  }))
  return { m, prog, dataSection, realGoals }
}
type RealGoal = { minute: number; side: "home" | "away"; scorer: string | null; type: string }

// ---------------------------------------------------------------------------
// Liquidação de mercados contra o placar real
// ---------------------------------------------------------------------------
type Settle = "win" | "lose" | "push" | null
function settle(mkt: { market: string; selection: string; team?: string | null; line?: number | null }, ftH: number, ftA: number): Settle {
  const total = ftH + ftA
  const sel = mkt.selection
  switch (mkt.market) {
    case "1x2": {
      const res = ftH > ftA ? "home" : ftH < ftA ? "away" : "draw"
      return sel === res ? "win" : "lose"
    }
    case "double_chance": {
      const res = ftH > ftA ? "home" : ftH < ftA ? "away" : "draw"
      const ok = (sel === "home_draw" && res !== "away") || (sel === "draw_away" && res !== "home") || (sel === "home_away" && res !== "draw")
      return ok ? "win" : "lose"
    }
    case "draw_no_bet": {
      if (ftH === ftA) return "push"
      return (sel === "home") === (ftH > ftA) ? "win" : "lose"
    }
    case "over_under": {
      if (mkt.line == null) return null
      if (total === mkt.line) return "push"
      const over = total > mkt.line
      return (sel === "over") === over ? "win" : "lose"
    }
    case "btts": {
      const both = ftH > 0 && ftA > 0
      return (sel === "yes") === both ? "win" : "lose"
    }
    case "team_total": {
      if (mkt.line == null || !mkt.team) return null
      const g = mkt.team === "home" ? ftH : ftA
      if (g === mkt.line) return "push"
      return (sel === "over") === (g > mkt.line) ? "win" : "lose"
    }
    case "handicap": {
      if (mkt.line == null) return null
      const side = sel === "home" || sel === "away" ? sel : mkt.team
      if (!side) return null
      const adj = side === "home" ? ftH + mkt.line - ftA : ftA + mkt.line - ftH
      return adj > 0 ? "win" : adj === 0 ? "push" : "lose"
    }
    case "odd_even":
      return (sel === "odd") === (total % 2 === 1) ? "win" : "lose"
    default:
      return null
  }
}

// ---------------------------------------------------------------------------
// Cobertura (o check determinístico: o que o modelo leu, cruzou, descartou)
// ---------------------------------------------------------------------------
function coverage(o: SuperPrognosis) {
  const blocosComConclusao = new Set(o.conclusoes.map((c) => c.bloco))
  const semSinal = new Set(o.blocos_sem_sinal.map((b) => b.bloco))
  const faltando = BLOCOS.filter((b) => !blocosComConclusao.has(b) && !semSinal.has(b))
  const usados = new Set<string>()
  for (const a of o.arestas ?? []) for (const id of a.liga ?? []) usados.add(id)
  for (const id of [...(o.best_bet.evidence_for ?? []), ...(o.best_bet.evidence_against ?? [])]) usados.add(id)
  for (const at of o.refutacao?.ataques ?? []) for (const id of at.ids ?? []) usados.add(id)
  const descartadas = new Set((o.descartadas ?? []).map((d) => d.id))
  const orfas = o.conclusoes.filter((c) => !usados.has(c.id) && !descartadas.has(c.id)).map((c) => c.id)
  const checks = o.verificacao?.checks ?? []
  return {
    blocosCobertos: blocosComConclusao.size,
    blocosSemSinal: semSinal.size,
    blocosFaltando: faltando,
    conclusoes: o.conclusoes.length,
    arestas: o.arestas.length,
    jogadores: o.jogadores.length,
    mercados: o.mercados.length,
    orfas,
    // CoVe: quantos checks rodou e quantos derrubaram/enfraqueceram algo (contradiz+parcial = a CoVe trabalhou).
    verificacoes: checks.length,
    contradicoes: checks.filter((c) => c.veredito !== "confirma").length,
  }
}

// ---------------------------------------------------------------------------
// Run de 1 jogo
// ---------------------------------------------------------------------------
type RunResult = {
  matchId: string
  homeName: string
  awayName: string
  actual: string
  ftH: number | null
  ftA: number | null
  current: Row
  digest: string
  realGoals: RealGoal[]
  output: SuperPrognosis | null
  cov: ReturnType<typeof coverage> | null
  reasoningText: string | null
  reasoningTokens: number | null
  elapsedMs: number
  promptChars: number
  error: string | null
}

async function runOne(matchId: string): Promise<RunResult> {
  const { m, prog, dataSection, realGoals } = await loadMatch(matchId)
  const homeName = String(m.home_name)
  const awayName = String(m.away_name)
  const ftH = m.ft_home as number | null
  const ftA = m.ft_away as number | null
  const actual = ftH != null ? `${homeName} ${ftH}-${ftA} ${awayName} (HT ${m.ht_home ?? "?"}-${m.ht_away ?? "?"})` : "não disputado"
  console.error(`[super] ${homeName} x ${awayName} — computando cruzamentos (estágio 0)…`)
  const digest = await evidenceDigestMd(matchId)
  const prompt = buildSuperPrompt(homeName, awayName, dataSection, digest)

  console.error(`[super] ${homeName} x ${awayName} — chamando ${MODEL} (${EFFORT}, ${prompt.length} chars)…`)
  const started = Date.now()
  let output: SuperPrognosis | null = null
  let reasoningText: string | null = null
  let reasoningTokens: number | null = null
  let error: string | null = null
  try {
    let result: Awaited<ReturnType<typeof generateText>>
    try {
      result = await generateText({ model: deepseek(MODEL), prompt, providerOptions, output: Output.object({ schema: superSchema }) })
      output = (result as { output?: SuperPrognosis }).output ?? null
    } catch (e) {
      console.error(`[super] ${homeName}: output tipado falhou (${(e as Error).message}); fallback sem schema`)
      result = await generateText({ model: deepseek(MODEL), prompt, providerOptions })
      const jsonMatch = result.text.match(/```json\s*([\s\S]*?)```/) ?? result.text.match(/\{[\s\S]*\}/)
      if (jsonMatch) output = JSON.parse(jsonMatch[1] ?? jsonMatch[0]) as SuperPrognosis
    }
    reasoningText = result.reasoningText ?? null
    const u = result.usage as Record<string, unknown> & { outputTokenDetails?: { reasoningTokens?: number } }
    reasoningTokens = (u?.outputTokenDetails?.reasoningTokens ?? u?.reasoningTokens ?? null) as number | null
  } catch (e) {
    error = (e as Error).message
  }
  const elapsedMs = Date.now() - started

  // Normaliza bands pra somar o xg (mesma trava do run-deepseek).
  const normBands = (t?: { xg: number; xg_bands: Bands }) => {
    if (!t?.xg_bands) return
    const sum = BANDS.reduce((s, k) => s + (t.xg_bands[k] ?? 0), 0)
    if (sum > 0) for (const k of BANDS) t.xg_bands[k] = +((t.xg_bands[k] ?? 0) * (t.xg / sum)).toFixed(3)
  }
  if (output) {
    normBands(output.home)
    normBands(output.away)
  }

  console.error(`[super] ${homeName} x ${awayName} — ${output ? "ok" : "FALHOU"} em ${(elapsedMs / 1000).toFixed(0)}s (${reasoningTokens ?? "?"} reasoning tokens)`)
  return {
    matchId, homeName, awayName, actual, ftH, ftA,
    current: prog, digest, realGoals, output, cov: output ? coverage(output) : null,
    reasoningText, reasoningTokens, elapsedMs, promptChars: prompt.length, error,
  }
}

// ---------------------------------------------------------------------------
// HTML consolidado
// ---------------------------------------------------------------------------
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const pct = (x: unknown) => (typeof x === "number" ? `${(x * 100).toFixed(0)}%` : "—")
const fx2 = (x: unknown) => (typeof x === "number" ? x.toFixed(2) : "—")
const settleBadge = (s: Settle) =>
  s === "win" ? `<span class="ok">✓ ganhou</span>` : s === "lose" ? `<span class="bad">✗ perdeu</span>` : s === "push" ? `<span class="push">◦ push</span>` : ""

function betLabel(b: { market: string; selection: string; team?: string | null; line?: number | null }, homeName: string, awayName: string): string {
  const side = b.selection === "home" ? homeName : b.selection === "away" ? awayName : null
  const tname = b.team === "home" ? homeName : b.team === "away" ? awayName : null
  switch (b.market) {
    case "1x2": return b.selection === "draw" ? "Empate" : `Vitória ${side}`
    case "double_chance": return b.selection === "home_draw" ? `${homeName} ou empate` : b.selection === "draw_away" ? `Empate ou ${awayName}` : `${homeName} ou ${awayName}`
    case "draw_no_bet": return `DNB ${side}`
    case "over_under": return `${b.selection === "over" ? "Over" : "Under"} ${b.line} gols`
    case "btts": return `Ambos marcam: ${b.selection === "yes" ? "sim" : "não"}`
    case "team_total": return `${tname} ${b.selection === "over" ? "over" : "under"} ${b.line}`
    case "handicap": return `${side ?? tname} ${b.line != null && b.line > 0 ? "+" : ""}${b.line}`
    case "odd_even": return `Total ${b.selection === "odd" ? "ímpar" : "par"}`
    default: return "—"
  }
}

function gameSection(r: RunResult): string {
  const title = `${r.homeName} x ${r.awayName}`
  if (!r.output) {
    return `<section class="game"><h2>${esc(title)}</h2><p class="bad">Run falhou: ${esc(r.error ?? "sem output tipado")}</p></section>`
  }
  const o = r.output
  const cov = r.cov!
  const cur = r.current
  const settled = r.ftH != null
  const sBet = settled ? settle(o.best_bet, r.ftH!, r.ftA!) : null
  const curBet = cur.best_bet_market
    ? { market: String(cur.best_bet_market), selection: String(cur.best_bet_selection), team: (cur.best_bet_team as string | null) ?? null, line: cur.best_bet_line == null ? null : Number(cur.best_bet_line) }
    : null
  const sCurBet = settled && curBet ? settle(curBet, r.ftH!, r.ftA!) : null
  const curOxt = (typeof cur.one_x_two === "string" ? JSON.parse(cur.one_x_two as string) : cur.one_x_two) as OneXTwo | null

  const conclusoesByBloco = new Map<string, Conclusao[]>()
  for (const c of o.conclusoes) {
    const arr = conclusoesByBloco.get(c.bloco) ?? []
    arr.push(c)
    conclusoesByBloco.set(c.bloco, arr)
  }
  const conclusoesRows = [...conclusoesByBloco.entries()]
    .map(([bloco, cs]) => cs.map((c, i) => `<tr>${i === 0 ? `<td rowspan="${cs.length}" class="bloco">${esc(bloco)}</td>` : ""}<td class="cid">${esc(c.id)}</td><td>${esc(c.fato)}</td><td class="dado">${esc(c.dado)}</td><td>${esc(c.direcao)}</td><td class="f-${esc(c.forca)}">${esc(c.forca)}</td></tr>`).join(""))
    .join("")
  const semSinalRows = o.blocos_sem_sinal.map((b) => `<tr><td class="bloco">${esc(b.bloco)}</td><td colspan="5" class="mut">${esc(b.motivo)}</td></tr>`).join("")
  const jogadoresRows = o.jogadores.map((j) => `<tr><td>${esc(j.nome)}</td><td class="mut">${esc(j.time === "home" ? r.homeName : r.awayName)}</td><td>${esc(j.leitura)}</td></tr>`).join("")
  const arestasRows = o.arestas.map((a) => `<tr><td class="cid">${esc(a.id)}</td><td class="cid">${esc(a.liga.join(" + "))}</td><td>${esc(a.leitura)}</td><td>${esc(a.efeito)}</td></tr>`).join("")
  const roteirosHtml = o.roteiros.map((rt) => `<div class="roteiro"><b>${esc(rt.nome)}</b> <span class="badge">prob ${pct(rt.prob)}</span> <span class="cid">${esc(rt.arestas.join(", "))}</span><p>${esc(rt.filme)}</p></div>`).join("")
  const mercadosRows = o.mercados.map((mk) => {
    const s = settled ? settle(mk, r.ftH!, r.ftA!) : null
    return `<tr><td>${esc(betLabel(mk, r.homeName, r.awayName))}</td><td>${pct(mk.prob)}</td><td>${"▪".repeat(Math.max(1, Math.min(5, Math.round(mk.variancia))))}</td><td class="v-${esc(mk.valor)}">${esc(mk.valor)}</td><td class="mut">${esc(mk.nota)}</td><td>${settleBadge(s)}</td></tr>`
  }).join("")
  const ataquesHtml = (o.refutacao?.ataques ?? []).map((a) => `<div class="ataque"><span class="badge v-${a.veredito === "nao_sustenta" ? "alto" : a.veredito === "enfraquece" ? "medio" : "nenhum"}">${esc(a.veredito)}</span> <b>${esc(a.alvo)}</b> <span class="cid">${esc((a.ids ?? []).join(", "))}</span><p>${esc(a.argumento)}</p></div>`).join("")
  const descartadasHtml = o.descartadas.length
    ? `<p class="mut" style="margin-top:10px"><b>Descartadas:</b> ${o.descartadas.map((d) => `${esc(d.id)} (${esc(d.motivo)})`).join(" · ")}</p>` : ""
  const orfasHtml = cov.orfas.length
    ? `<span class="bad">órfãs: ${esc(cov.orfas.join(", "))}</span>` : `<span class="ok">0 órfãs</span>`
  const faltandoHtml = cov.blocosFaltando.length
    ? `<span class="bad">faltou: ${esc(cov.blocosFaltando.join(", "))}</span>` : `<span class="ok">todos os blocos lidos</span>`
  const evFor = o.best_bet.evidence_for.join(", ")
  const evAg = o.best_bet.evidence_against.join(", ")
  const reasoningHtml = r.reasoningText
    ? esc(r.reasoningText).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")
    : "<p>(sem reasoning)</p>"

  return `<section class="game">
  <h2>${esc(title)} <span class="real">real: ${esc(r.actual)}</span></h2>
  <div class="badges">
    <span class="badge">latência <b>${(r.elapsedMs / 1000).toFixed(0)}s</b></span>
    <span class="badge">reasoning <b>${esc(r.reasoningTokens ?? "?")}</b> tokens</span>
    <span class="badge">prompt <b>${esc(Math.round(r.promptChars / 1000))}K</b> chars</span>
    <span class="badge">cobertura <b>${cov.blocosCobertos + cov.blocosSemSinal}/${BLOCOS.length}</b> blocos</span>
    <span class="badge"><b>${cov.conclusoes}</b> conclusões · <b>${cov.arestas}</b> arestas · <b>${cov.jogadores}</b> jogadores · <b>${cov.verificacoes}</b> checks CoVe (${cov.contradicoes} ✗/~)</span>
    <span class="badge">${faltandoHtml}</span>
    <span class="badge">${orfasHtml}</span>
  </div>

  <div class="duel">
    <div class="col">
      <h3>Prompt atual (última run)</h3>
      <div class="kpis">
        <div class="kpi"><b>${fx2(Number(cur.xg_home))} × ${fx2(Number(cur.xg_away))}</b><span>xG</span></div>
        <div class="kpi"><b>${pct(Number(cur.over25_prob))}</b><span>over 2.5</span></div>
        <div class="kpi"><b>${pct(Number(cur.btts_prob))}</b><span>BTTS</span></div>
        <div class="kpi"><b>${curOxt ? `${pct(curOxt.home)}/${pct(curOxt.draw)}/${pct(curOxt.away)}` : "—"}</b><span>1x2</span></div>
      </div>
      ${curBet ? `<p class="bet">🎯 ${esc(betLabel(curBet, r.homeName, r.awayName))} <span class="badge">prob ${pct(Number(cur.best_bet_probability))}</span> <span class="badge">conf ${esc(cur.best_bet_confidence)}</span> ${settleBadge(sCurBet)}</p>` : "<p class='mut'>(sem best_bet)</p>"}
    </div>
    <div class="col super">
      <h3>SUPER prompt</h3>
      <div class="kpis">
        <div class="kpi"><b>${fx2(o.home.xg)} × ${fx2(o.away.xg)}</b><span>xG</span></div>
        <div class="kpi"><b>${pct(o.general.over25_prob)}</b><span>over 2.5</span></div>
        <div class="kpi"><b>${pct(o.general.btts_prob)}</b><span>BTTS</span></div>
        <div class="kpi"><b>${pct(o.general.one_x_two.home)}/${pct(o.general.one_x_two.draw)}/${pct(o.general.one_x_two.away)}</b><span>1x2</span></div>
      </div>
      <p class="bet">🎯 ${esc(betLabel(o.best_bet, r.homeName, r.awayName))} <span class="badge">prob ${pct(o.best_bet.probability)}</span> <span class="badge">conf ${esc(o.best_bet.confidence)}</span> ${settleBadge(sBet)}</p>
      <p class="mut" style="font-size:12.5px">evidência a favor: <span class="cid">${esc(evFor)}</span> · contra: <span class="cid">${esc(evAg || "—")}</span></p>
    </div>
  </div>

  <details open><summary>🧬 Cruzamentos pré-computados <span class="hint">estágio 0 — arquétipo · mecanismo · dinâmica (injetados no prompt)</span></summary><div class="body"><pre style="white-space:pre-wrap;font-size:12.5px;color:#a5f3fc;background:#081418;border:1px solid #164e63;border-radius:10px;padding:12px">${esc(r.digest)}</pre></div></details>

  <details open><summary>🧩 Conclusões por bloco <span class="hint">Passo 1 — nada fica sem ler</span></summary><div class="body">
    <table><thead><tr><th>bloco</th><th>ID</th><th>fato</th><th>dado (citado)</th><th>direção</th><th>força</th></tr></thead><tbody>${conclusoesRows}${semSinalRows}</tbody></table>
    ${descartadasHtml}
  </div></details>

  <details open><summary>👤 Jogador por jogador <span class="hint">Passo 2 — ${cov.jogadores} lidos</span></summary><div class="body">
    <table><thead><tr><th>jogador</th><th>time</th><th>leitura pro confronto</th></tr></thead><tbody>${jogadoresRows}</tbody></table>
  </div></details>

  <details open><summary>🔗 Arestas <span class="hint">Passo 3 — o cruzamento (${cov.arestas})</span></summary><div class="body">
    <table><thead><tr><th>ID</th><th>liga</th><th>leitura</th><th>efeito</th></tr></thead><tbody>${arestasRows}</tbody></table>
  </div></details>

  <details open><summary>🎬 Roteiros <span class="hint">Passo 4 — o filme</span></summary><div class="body">${roteirosHtml}</div></details>

  <details open><summary>⏱️ Linha do tempo <span class="hint">Passo 4b — 1ºT → 6 janelas → 2ºT · validada contra os gols reais</span></summary><div class="body">
    ${(() => {
      const bandOf = (min: number) => (min <= 15 ? 0 : min <= 30 ? 1 : min <= 45 ? 2 : min <= 60 ? 3 : min <= 75 ? 4 : 5)
      const golsFaixa = (i: number, side?: "home" | "away") =>
        r.realGoals.filter((g) => bandOf(g.minute) === i && (!side || g.side === side))
      // ---- régua visual: mandante pra cima, visitante pra baixo; altura = xG da janela; ⚽ = gol real
      const maxBand = Math.max(0.01, ...BANDS.map((b) => Math.max(o.home.xg_bands[b] ?? 0, o.away.xg_bands[b] ?? 0)))
      const cols = BANDS.map((b, i) => {
        const xh = o.home.xg_bands[b] ?? 0
        const xa = o.away.xg_bands[b] ?? 0
        const j = o.janelas.find((x) => x.faixa === b)
        const gh = golsFaixa(i, "home").map((g) => `<span class="tl-goal" title="${g.minute}' ${esc(g.scorer ?? "")}">⚽${g.minute}'</span>`).join("")
        const ga = golsFaixa(i, "away").map((g) => `<span class="tl-goal" title="${g.minute}' ${esc(g.scorer ?? "")}">⚽${g.minute}'</span>`).join("")
        const hot = j && j.prob_gol >= 0.45
        return `<div class="tl-col${hot ? " tl-hot" : ""}${i === 2 ? " tl-ht" : ""}" title="${esc(j?.leitura ?? "")}">
          <div class="tl-goals">${gh || "&nbsp;"}</div>
          <div class="tl-up"><div class="tl-bar tl-home" style="height:${Math.round((xh / maxBand) * 44)}px" title="xG ${xh.toFixed(2)}"></div></div>
          <div class="tl-axis"><b>${b}</b><span>${j ? pct(j.prob_gol) : "—"}</span></div>
          <div class="tl-down"><div class="tl-bar tl-away" style="height:${Math.round((xa / maxBand) * 44)}px" title="xG ${xa.toFixed(2)}"></div></div>
          <div class="tl-goals">${ga || "&nbsp;"}</div>
        </div>`
      }).join("")
      const regua = `<div class="tl">
        <div class="tl-team"><span class="tl-dot tl-home"></span>${esc(r.homeName)} <span class="mut">(xG por janela ↑ · P(gol) no eixo · passe o mouse pra leitura)</span></div>
        <div class="tl-grid">${cols}</div>
        <div class="tl-team"><span class="tl-dot tl-away"></span>${esc(r.awayName)}</div>
      </div>`
      const janelasRows = BANDS.map((b, i) => {
        const j = o.janelas.find((x) => x.faixa === b)
        if (!j) return `<tr><td>${b}</td><td colspan="4" class="mut">(faixa não veio na resposta)</td></tr>`
        const reais = golsFaixa(i)
        const reaisStr = reais.map((g) => `⚽ ${g.minute}' ${esc(g.side === "home" ? r.homeName : r.awayName)}`).join("<br>")
        const ladoNome = j.lado === "home" ? r.homeName : j.lado === "away" ? r.awayName : "equilibrado"
        return `<tr${reais.length ? ' style="background:#101b12"' : ""}><td><b>${b}</b></td><td>${pct(j.prob_gol)}</td><td class="mut">${esc(ladoNome)}</td><td>${esc(j.leitura)}</td><td>${reaisStr || '<span class="mut">—</span>'}</td></tr>`
      }).join("")
      const gols1t = r.realGoals.filter((g) => g.minute <= 45).length
      const gols2t = r.realGoals.length - gols1t
      const tempoBloco = (t: Tempo, nome: string, reais: number) =>
        `<div class="panel-team" style="margin-bottom:10px"><h4>${nome} <span class="badge">P(gol) ${pct(t.prob_gol)}</span> ${r.ftH != null ? `<span class="badge">real: ${reais} gol${reais === 1 ? "" : "s"}</span>` : ""}</h4><p style="margin:4px 0 0;font-size:13px">${esc(t.analise)}</p></div>`
      return tempoBloco(o.tempos.primeiro, "1º tempo", gols1t)
        + regua
        + `<table style="margin:10px 0"><thead><tr><th>janela</th><th>P(gol)</th><th>lado</th><th>leitura</th><th>gols reais</th></tr></thead><tbody>${janelasRows}</tbody></table>`
        + tempoBloco(o.tempos.segundo, "2º tempo", gols2t)
    })()}
  </div></details>

  <details open><summary>🔮 Previsão por jogador <span class="hint">Passo 2b — linha estatística do XI provável · ✓ = marcou de verdade</span></summary><div class="body">
    ${(() => {
      const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      const marcouReal = (jog: string, side: "home" | "away") => r.realGoals.some((g) => g.side === side && g.type !== "own" && g.scorer
        && norm(jog).split(/\s+/).filter((w) => w.length > 2).some((w) => norm(g.scorer!).split(/\s+/).includes(w)))
      const rows = [...(o.previsoes_jogadores ?? [])]
        .sort((a, b) => (a.time === b.time ? b.x_gols - a.x_gols : a.time === "home" ? -1 : 1))
        .map((p) => `<tr${marcouReal(p.nome, p.time) ? ' style="background:#101b12"' : ""}><td>${marcouReal(p.nome, p.time) ? '<span class="ok">✓</span> ' : ""}<b>${esc(p.nome)}</b></td><td class="mut">${esc(p.time === "home" ? r.homeName : r.awayName)}</td><td>${fx2(p.x_sot)}</td><td><b>${fx2(p.x_gols)}</b></td><td><b>${pct(p.prob_marca)}</b></td><td>${pct(p.prob_sot1)}</td><td>${fx2(p.x_kp)}</td><td style="font-size:12.5px">${esc(p.leitura)}</td></tr>`)
        .join("")
      return `<table><thead><tr><th>jogador</th><th>time</th><th>xSoT</th><th>xG</th><th>P(marca)</th><th>P(1+ SoT)</th><th>xKP</th><th>leitura pro jogo</th></tr></thead><tbody>${rows || '<tr><td colspan="8" class="mut">(sem previsões na resposta)</td></tr>'}</tbody></table>`
    })()}
  </div></details>

  <details open><summary>⚽ Marcadores prováveis <span class="hint">Passo 4c — análise separada · validada contra os autores reais</span></summary><div class="body duo" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    ${(["home", "away"] as const).map((side) => {
      const nome = side === "home" ? r.homeName : r.awayName
      const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      const marcou = (jog: string) => r.realGoals.some((g) => g.side === side && g.type !== "own" && g.scorer
        && norm(jog).split(/\s+/).filter((w) => w.length > 2).some((w) => norm(g.scorer!).split(/\s+/).includes(w)))
      const reaisDoLado = r.realGoals.filter((g) => g.side === side).map((g) => `${g.minute}' ${esc(g.scorer ?? "?")}${g.type === "own" ? " (contra)" : ""}`).join(" · ")
      const lis = (o.marcadores[side] ?? []).map((mk) => `<li>${marcou(mk.nome) ? '<span class="ok">✓</span> ' : ""}<b>${esc(mk.nome)}</b> <span class="badge">prob ${pct(mk.prob)}</span><br><span class="mut" style="font-size:12px">${esc(mk.motivo)}</span></li>`).join("")
      return `<div class="panel-team"><h4>${esc(nome)}</h4><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">${lis}</ul>${r.ftH != null ? `<p class="mut" style="font-size:12px;margin:10px 0 0">quem marcou de verdade: ${reaisDoLado || "ninguém"}</p>` : ""}</div>`
    }).join("")}
  </div></details>

  <details open><summary>📋 Board de mercados <span class="hint">Passo 5 — ${cov.mercados} linhas · liquidado contra o placar real</span></summary><div class="body">
    <table><thead><tr><th>mercado</th><th>prob</th><th>var</th><th>valor</th><th>nota</th><th>real</th></tr></thead><tbody>${mercadosRows}</tbody></table>
  </div></details>

  <details open><summary>⚔️ Refutação <span class="hint">Passo 6 — advogado do diabo</span></summary><div class="body">
    ${ataquesHtml}
    <p><b>Conclusão:</b> ${esc(o.refutacao.conclusao)}</p>
    <p class="mut"><b>Regra de confiança aplicada:</b> ${esc(o.general.confidence_regra)}</p>
  </div></details>

  <details open><summary>🔍 Verificação encadeada (CoVe) <span class="hint">Passo 7 — ${cov.verificacoes} checks · ${cov.contradicoes} não confirmaram</span></summary><div class="body">
    <table><thead><tr><th>ID</th><th>alvo</th><th>pergunta</th><th>resposta do dado (citação)</th><th>veredito</th><th>ajuste</th></tr></thead><tbody>
    ${(o.verificacao?.checks ?? []).map((v) => `<tr><td class="cid">${esc(v.id)}</td><td>${esc(v.alvo)}</td><td>${esc(v.pergunta)}</td><td class="dado">${esc(v.resposta_do_dado)}</td><td class="${v.veredito === "confirma" ? "ok" : v.veredito === "contradiz" ? "bad" : "push"}">${esc(v.veredito)}</td><td class="mut">${esc(v.ajuste)}</td></tr>`).join("")}
    </tbody></table>
    <p><b>Revisões (rascunho → final):</b> ${esc(o.verificacao?.revisoes ?? "—")}</p>
  </div></details>

  <details open><summary>🧾 Análise da aposta</summary><div class="body"><p>${esc(o.best_bet.analysis)}</p>
    <p class="mut"><b>Drivers:</b></p><ul>${o.drivers.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
    <p class="mut"><b>Resumo:</b> ${esc(o.general.summary)}</p>
  </div></details>

  <details><summary>🧠 Reasoning <span class="hint">${esc(r.reasoningTokens ?? "?")} tokens</span></summary><div class="body"><div class="reasoning-md">${reasoningHtml}</div></div></details>
</section>`
}

function buildHtml(results: RunResult[], stamp: string): string {
  return `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Super prompt · rodada 38</title>
<style>
:root { color-scheme: dark; }
* { box-sizing: border-box; }
body { margin:0; font:15px/1.6 ui-sans-serif,system-ui,sans-serif; background:#0b0e14; color:#d7dce5; }
.wrap { max-width: 1180px; margin:0 auto; padding:32px 20px 80px; }
h1 { font-size:22px; margin:0 0 4px; }
h2 { font-size:18px; margin:0 0 10px; }
h3 { font-size:14px; margin:0 0 8px; color:#8b93a7; text-transform:uppercase; letter-spacing:.4px; }
.sub { color:#8b93a7; margin-bottom:24px; }
.real { color:#fbbf24; font-size:14px; font-weight:400; margin-left:10px; }
.badges { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 16px; }
.badge { background:#161b27; border:1px solid #232a3a; border-radius:999px; padding:3px 11px; font-size:12.5px; color:#aeb6c8; }
.badge b { color:#7dd3fc; }
section.game { background:#11151f; border:1px solid #1e2533; border-radius:14px; margin:22px 0; padding:20px; }
details { background:#0d1119; border:1px solid #1a2230; border-radius:12px; margin:12px 0; overflow:hidden; }
summary { cursor:pointer; padding:12px 16px; font-weight:600; font-size:14.5px; list-style:none; }
summary::-webkit-details-marker { display:none; }
summary .hint { color:#677089; font-weight:400; font-size:12px; margin-left:8px; }
.body { padding:0 16px 16px; }
table { width:100%; border-collapse:collapse; font-size:13px; }
th, td { padding:6px 9px; border-bottom:1px solid #1a2230; text-align:left; vertical-align:top; }
th { color:#8b93a7; font-weight:600; }
.bloco { color:#7dd3fc; white-space:nowrap; font-size:12px; }
.cid { color:#c084fc; font-family:ui-monospace,monospace; font-size:12px; white-space:nowrap; }
.dado { color:#93c5fd; font-size:12.5px; }
.mut { color:#8b93a7; }
.ok { color:#34d399; font-weight:600; }
.bad { color:#f87171; font-weight:600; }
.push { color:#9ca3af; font-weight:600; }
.f-alta { color:#34d399; } .f-media { color:#fbbf24; } .f-baixa { color:#9ca3af; }
.v-alto { color:#34d399; font-weight:600; } .v-medio { color:#fbbf24; } .v-baixo { color:#9ca3af; } .v-nenhum { color:#677089; }
.duel { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:6px 0 14px; }
.col { background:#0d1119; border:1px solid #1a2230; border-radius:12px; padding:14px; }
.col.super { border-color:#3b2a5c; background:#120e1d; }
.kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); gap:8px; }
.kpi { background:#0b0e14; border:1px solid #1e2533; border-radius:10px; padding:9px; text-align:center; }
.kpi b { display:block; font-size:15px; color:#7dd3fc; }
.kpi span { font-size:11px; color:#8b93a7; }
.bet { font-size:15px; font-weight:600; margin:12px 0 4px; }
.panel-team { background:#0b0e14; border:1px solid #1a2230; border-radius:10px; padding:12px; }
.panel-team h4 { font-size:13.5px; margin:0 0 6px; color:#c9d1e0; }
.tl { background:#0b0e14; border:1px solid #1a2230; border-radius:12px; padding:12px 14px; margin:12px 0; }
.tl-team { font-size:12.5px; color:#aeb6c8; margin:4px 0; display:flex; align-items:center; gap:6px; }
.tl-dot { width:10px; height:10px; border-radius:3px; display:inline-block; }
.tl-dot.tl-home { background:#3b82f6; } .tl-dot.tl-away { background:#f59e0b; }
.tl-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:6px; margin:6px 0; }
.tl-col { border-radius:8px; padding:4px 2px; text-align:center; border:1px solid transparent; }
.tl-col:hover { border-color:#334155; background:#0f1522; }
.tl-hot { background:#14110a; border-color:#3a2a10; }
.tl-ht { border-right:2px dashed #334155; border-radius:8px 0 0 8px; }
.tl-up, .tl-down { height:46px; display:flex; align-items:flex-end; justify-content:center; }
.tl-down { align-items:flex-start; }
.tl-bar { width:60%; border-radius:4px 4px 0 0; min-height:2px; }
.tl-bar.tl-home { background:linear-gradient(180deg,#60a5fa,#1d4ed8); }
.tl-bar.tl-away { background:linear-gradient(0deg,#fbbf24,#b45309); border-radius:0 0 4px 4px; }
.tl-axis { border-top:1px solid #1e2533; border-bottom:1px solid #1e2533; padding:2px 0; font-size:10.5px; color:#8b93a7; display:flex; flex-direction:column; line-height:1.3; }
.tl-axis b { color:#c9d1e0; } .tl-axis span { color:#7dd3fc; font-weight:700; }
.tl-hot .tl-axis span { color:#fbbf24; }
.tl-goals { font-size:10.5px; color:#34d399; min-height:15px; }
.tl-goal { margin:0 2px; white-space:nowrap; }
.roteiro { border-left:3px solid #3b2a5c; padding:6px 12px; margin:10px 0; }
.roteiro p { margin:6px 0 0; color:#aeb6c8; }
.ataque { border-left:3px solid #7f1d1d; padding:6px 12px; margin:10px 0; }
.ataque p { margin:6px 0 0; color:#aeb6c8; }
.reasoning-md { color:#cabce8; font-size:13.5px; background:#100c1a; border:1px solid #2a2140; border-radius:10px; padding:14px 16px; }
.reasoning-md p { margin:0 0 12px; }
@media (max-width: 860px) { .duel { grid-template-columns:1fr; } }
</style></head><body><div class="wrap">
<h1>Super prompt — experimento MOD-004 <span class="real">rodada 38 · liquidado contra o placar real</span></h1>
<div class="sub">${esc(MODEL)} · thinking on · effort ${esc(EFFORT)} · run ${esc(stamp)} · protocolo: varredura por bloco → jogador a jogador → arestas → roteiros → board de mercados → refutação → verificação CoVe</div>
${results.map(gameSection).join("\n")}
</div></body></html>`
}

// Reuso pelo harness de backtest (MOD-004 P2): roda 1 jogo e liquida mercados sem disparar o CLI.
export { runOne, settle, betLabel, loadMatch, buildSuperPrompt }
export type { RunResult, SuperPrognosis, Settle }

// ---------------------------------------------------------------------------
// Main (só quando executado direto; como módulo, exporta runOne/settle)
// ---------------------------------------------------------------------------
if (import.meta.main) {
// Modo --report-only <pasta>: reconstrói o report.html a partir dos dumps salvos (zero chamada de API).
if (process.argv[2] === "--report-only") {
  const dir = process.argv[3]
  if (!dir) throw new Error("uso: bun run scripts/super-prognosis.ts --report-only <pasta da run>")
  const only: RunResult[] = []
  for await (const f of new Bun.Glob("*.dump.json").scan(dir)) {
    only.push(JSON.parse(await Bun.file(`${dir}/${f}`).text()) as RunResult)
  }
  if (!only.length) throw new Error(`nenhum dump em ${dir}`)
  const p = `${dir}/report.html`
  await Bun.write(p, buildHtml(only, dir.split(/[\\/]/).pop() ?? ""))
  console.log(p)
  process.exit(0)
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
const results = await Promise.all(MATCH_IDS.map((id) => runOne(id).catch((e) => {
  console.error(`[super] ${id} ERRO: ${(e as Error).message}`)
  return {
    matchId: id, homeName: id.slice(0, 8), awayName: "?", actual: "?", ftH: null, ftA: null,
    current: {}, digest: "", realGoals: [], output: null, cov: null, reasoningText: null, reasoningTokens: null,
    elapsedMs: 0, promptChars: 0, error: (e as Error).message,
  } satisfies RunResult
})))

const outDir = new URL(`./output/super/${stamp}/`, import.meta.url)
for (const r of results) {
  await Bun.write(new URL(`${r.matchId}.dump.json`, outDir), JSON.stringify(r, null, 2))
}
const htmlPath = new URL("report.html", outDir)
await Bun.write(htmlPath, buildHtml(results, stamp))

console.log(`\n[ok] ${results.filter((r) => r.output).length}/${results.length} runs ok`)
for (const r of results) {
  if (!r.output) { console.log(`  ✗ ${r.homeName} x ${r.awayName}: ${r.error}`); continue }
  const s = r.ftH != null ? settle(r.output.best_bet, r.ftH, r.ftA!) : null
  console.log(`  ✓ ${r.homeName} x ${r.awayName} — bet: ${r.output.best_bet.market}/${r.output.best_bet.selection}${r.output.best_bet.line != null ? " " + r.output.best_bet.line : ""} (${r.output.best_bet.confidence}) → ${s ?? "?"} · cobertura ${r.cov!.blocosCobertos + r.cov!.blocosSemSinal}/${BLOCOS.length} blocos, ${r.cov!.arestas} arestas, ${r.cov!.jogadores} jogadores, ${r.cov!.verificacoes} checks CoVe (${r.cov!.contradicoes} ✗/~)`)
}
console.log(`\n[report] ${Bun.fileURLToPath(htmlPath)}`)
process.exit(0)
}
