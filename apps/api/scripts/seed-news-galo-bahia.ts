/**
 * Seed de notícias pré-jogo Atlético-MG × Bahia (slug brasileirao-2026-atletico-mineiro-vs-bahia).
 * Corte: published_at antes do kickoff 2026-07-21 19:30 — sem pós-jogo.
 */
import { eq, sql } from "drizzle-orm"

import { db } from "../src/db/client"
import {
  newsArticle,
  newsArticleLeague,
  newsArticleTeam,
  newsProvider,
} from "../src/db/schemas/news"
import { match, team } from "../src/db/schemas/leagues"

const MATCH_SLUG = "brasileirao-2026-atletico-mineiro-vs-bahia"
const LEAGUE_CODE = "BRA"
const MATCH_ID_FALLBACK = "dd109402-f7cd-4029-b3da-14e9044fb1c4"

const PROVIDERS = [
  {
    slug: "ge",
    name: "GE",
    domain: "ge.globo.com",
    homeUrl: "https://ge.globo.com",
    tier: "established",
    kind: "press",
  },
  {
    slug: "lance",
    name: "Lance!",
    domain: "www.lance.com.br",
    homeUrl: "https://www.lance.com.br",
    tier: "established",
    kind: "press",
  },
  {
    slug: "uol",
    name: "UOL Esporte",
    domain: "www.uol.com.br",
    homeUrl: "https://www.uol.com.br/esporte",
    tier: "established",
    kind: "press",
  },
] as const

type EventType =
  | "availability"
  | "xi_quality"
  | "institutional"
  | "stake_form"
  | "player_flag"
  | "venue"
  | "preview"
type Severity = "rumor" | "confirmado"

type SeedArticle = {
  url: string
  title: string
  providerSlug: (typeof PROVIDERS)[number]["slug"]
  publishedAt: string
  summary: string
  eventType: EventType
  severity: Severity
  teams: "cam" | "bahia" | "both"
  linkMatch: boolean
}

const ARTICLES: SeedArticle[] = [
  {
    url: "https://ge.globo.com/mg/futebol/noticia/2026/07/21/atletico-mg-x-bahia-onde-assistir-ao-vivo-horario-e-escalacoes.ghtml",
    title: "Atlético-MG x Bahia: onde assistir ao vivo, horário e escalações",
    providerSlug: "ge",
    publishedAt: "2026-07-21T10:00:00-03:00",
    summary:
      "Preview Arena MRV · 19h30 · fecha 1º turno. CAM: Lyanco no lugar de Alonso (negociado); Alan Franco fora (problemas particulares); Preciado/Alan Minda dúvidas pós-Copa. Desfalques: Iván Román (suspenso), Léo Duarte/Patrick/Índio (lesão). Bahia: base da vitória vs Chape; Guido Herrera único reforço regularizado; Juba suspenso; Véliz/Moreno aguardam BID.",
    eventType: "preview",
    severity: "confirmado",
    teams: "both",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/futebol/times/atletico-mg/noticia/2026/07/20/escalacao-do-atletico-mg-veja-o-provavel-time-para-o-retorno-do-brasileirao.ghtml",
    title: "Escalação do Atlético-MG: veja o provável time para o retorno do Brasileirão",
    providerSlug: "ge",
    publishedAt: "2026-07-20T18:00:00-03:00",
    summary:
      "Retorno pós-Copa na Arena MRV. Alan Franco principal ausência (Equador + assuntos familiares — só treina quarta). Preciado e Alan Minda em recondicionamento. Scarpa liberado após artroscopia no joelho, improvável titular. Léo Duarte (único reforço) com lesão muscular na coxa → Lyanco deve ser titular. DM: Patrick, Índio (ligamento).",
    eventType: "availability",
    severity: "confirmado",
    teams: "cam",
    linkMatch: true,
  },
  {
    url: "https://www.lance.com.br/atletico-mineiro/primeiro-desafio-no-retorno-as-opcoes-de-dominguez-para-escalar-o-atletico-contra-o-bahia.html",
    title: "Primeiro desafio no retorno: opções de Domínguez para escalar o Atlético contra o Bahia",
    providerSlug: "lance",
    publishedAt: "2026-07-21T12:00:00-03:00",
    summary:
      "Reestreia após ~2 meses sem oficiais. Trio da Copa (Equador) fora/dúvida: Franco, Preciado, Minda. Scarpa liberado como opção de banco. Lista de fora: Preciado, Alan Minda, Alan Franco, Iván Román, Léo Duarte, Patrick, Índio. Sinal: xi_quality do meio/ataque enxuto no retorno.",
    eventType: "xi_quality",
    severity: "confirmado",
    teams: "cam",
    linkMatch: true,
  },
  {
    url: "https://www.uol.com.br/esporte/ultimas-noticias/agencia/2026/07/21/atletico-mg-retorna-ao-brasileirao-diante-do-bahia-para-recuperar-posicoes-na-tabela.htm",
    title: "Atlético-MG retorna ao Brasileirão diante do Bahia para recuperar posições na tabela",
    providerSlug: "uol",
    publishedAt: "2026-07-21T08:00:00-03:00",
    summary:
      "CAM 11º/24 pts busca subir; Bahia 6º/29 pts vem de 2-0 na Chape (jogo atrasado). Scarpa liberado, opção de banco; Victor Hugo cotado no meio com Bernard/Cuello/Cassierra. Ceni alerta sequência dura (CAM fora, Corinthians casa, Flu fora) e bola aérea/cruzada.",
    eventType: "stake_form",
    severity: "confirmado",
    teams: "both",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/ba/futebol/times/bahia/noticia/2026/07/21/relacionados-caio-alexandre-kike-olivera-e-dois-reforcos-desfalcam-o-bahia-contra-o-atletico-mg.ghtml",
    title: "Relacionados: Caio Alexandre, Kike Olivera e dois reforços desfalcam o Bahia contra o Atlético-MG",
    providerSlug: "ge",
    publishedAt: "2026-07-21T15:00:00-03:00",
    summary:
      "Seis desfalques confirmados: Alejo Véliz (sem BID), Marco Moreno (sem BID / nem viajou), Caio Alexandre (lesão muscular coxa), Kike Olivera (tornozelo), Léo Vieira (joelho), Luciano Juba (suspenso). Guido Herrera único reforço no BID; suspensão argentina resolvida no STJD. Availability ofensiva/meio relevante fora.",
    eventType: "availability",
    severity: "confirmado",
    teams: "bahia",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/ba/futebol/times/bahia/noticia/2026/07/20/escalacao-do-bahia-contra-o-atletico-mg-veja-time-provavel-duvidas-e-desfalques.ghtml",
    title: "Escalação do Bahia: reforço é dúvida para o jogo contra o Atlético-MG",
    providerSlug: "ge",
    publishedAt: "2026-07-20T19:34:00-03:00",
    summary:
      "Base da vitória vs Chape; dúvidas nas laterais (Marcos Victor / Iago). Guido Herrera no BID mas com suspensão da AFA — clube aciona STJD. Véliz viajou sem BID; Moreno em recondicionamento. Bahia 6º/29 pts × CAM 11º/24.",
    eventType: "availability",
    severity: "confirmado",
    teams: "bahia",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/ba/futebol/times/bahia/noticia/2026/07/21/bahia-visita-o-atletico-mg-para-fechar-o-primeiro-turno-no-g-4-do-campeonato-brasileiro.ghtml",
    title: "Bahia visita o Atlético-MG para fechar o 1º turno no G-4",
    providerSlug: "ge",
    publishedAt: "2026-07-21T11:00:00-03:00",
    summary:
      "Tricolor só depende de si para terminar o turno no G-4 (Liberta direta): precisa vencer na Arena MRV. Empate ou derrota não sobe. Stake alta visitante — motivação assimétrica vs CAM recuperando posição.",
    eventType: "stake_form",
    severity: "confirmado",
    teams: "bahia",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/futebol/times/atletico-mg/noticia/2026/07/09/atletico-mg-oficializa-rescisao-com-zagueiro-da-copa-do-mundo.ghtml",
    title: "Atlético-MG oficializa rescisão com Júnior Alonso (Atlanta United)",
    providerSlug: "ge",
    publishedAt: "2026-07-09T12:15:00-03:00",
    summary:
      "Rescisão do xerife Alonso (241 jogos, 6 títulos) → Atlanta United. Abre lado esquerdo da zaga; clube anunciou Léo Duarte (destro) como reposição. Contexto institucional/xi da defesa antes do retorno.",
    eventType: "institutional",
    severity: "confirmado",
    teams: "cam",
    linkMatch: false,
  },
  {
    url: "https://ge.globo.com/futebol/times/atletico-mg/noticia/2026/07/18/lyanco-assume-vaga-de-alonso-no-atletico-mg-e-se-ve-pronto-apos-pausa-pior-lesao-do-futebol.ghtml",
    title: "Lyanco assume vaga de Alonso e se vê pronto após pausa: 'pior lesão do futebol'",
    providerSlug: "ge",
    publishedAt: "2026-07-18T16:00:00-03:00",
    summary:
      "Lyanco cotado titular à esquerda com Ruan Tressoldi vs Bahia. Volta de ruptura de ligamento; pausa da Copa deu confiança. Sem Alonso + Léo Duarte lesionado, ele herdou minutos nos jogos-treino. Defesa vazada em 29/37 jogos; bola aérea/parada é problema declarado.",
    eventType: "player_flag",
    severity: "confirmado",
    teams: "cam",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/futebol/times/atletico-mg/noticia/2026/07/17/veja-tudo-o-que-aconteceu-no-atletico-mg-durante-a-copa-do-mundo.ghtml",
    title: "Veja tudo o que aconteceu no Atlético-MG durante a Copa do Mundo",
    providerSlug: "ge",
    publishedAt: "2026-07-17T12:00:00-03:00",
    summary:
      "Pausa: saída Alonso + Iseppe; Hulk já havia deixado o clube. Único reforço Léo Duarte. Elenco incompleto (trio Equador + Alonso). Diretoria: reposição pontual, sem grandes investimentos. Stake/contexto de elenco enxuto no retorno.",
    eventType: "stake_form",
    severity: "confirmado",
    teams: "cam",
    linkMatch: true,
  },
]

async function upsertProvider(p: (typeof PROVIDERS)[number]) {
  const [row] = await db
    .insert(newsProvider)
    .values({
      slug: p.slug,
      name: p.name,
      domain: p.domain,
      homeUrl: p.homeUrl,
      tier: p.tier,
      kind: p.kind,
    })
    .onConflictDoUpdate({
      target: newsProvider.slug,
      set: {
        name: p.name,
        domain: p.domain,
        homeUrl: p.homeUrl,
        tier: p.tier,
        kind: p.kind,
      },
    })
    .returning()
  return row!
}

async function main() {
  const [m] = await db.select().from(match).where(eq(match.slug, MATCH_SLUG)).limit(1)
  if (!m) throw new Error(`partida não encontrada: ${MATCH_SLUG}`)
  if (m.id !== MATCH_ID_FALLBACK) console.warn(`id diferente do esperado: ${m.id}`)

  // sportmonks: Atlético-MG 3427, Bahia 692
  const [cam] = await db.select().from(team).where(eq(team.sportmonksTeamId, 3427)).limit(1)
  const [bahia] = await db.select().from(team).where(eq(team.sportmonksTeamId, 692)).limit(1)
  if (!cam || !bahia) throw new Error("times CAM/Bahia não encontrados (3427 / 692)")

  const providerBySlug = new Map<string, string>()
  for (const p of PROVIDERS) {
    const row = await upsertProvider(p)
    providerBySlug.set(p.slug, row.id)
    console.log(`provider ${p.slug} → ${row.id}`)
  }

  let upserted = 0
  for (const a of ARTICLES) {
    const providerId = providerBySlug.get(a.providerSlug)
    if (!providerId) throw new Error(`provider ausente: ${a.providerSlug}`)

    // URLs com fragmento (#) — normaliza pra unique sem hash
    const url = a.url.replace(/#.*$/, "")

    const [article] = await db
      .insert(newsArticle)
      .values({
        url,
        title: a.title,
        providerId,
        publishedAt: new Date(a.publishedAt),
        summary: a.summary,
        eventType: a.eventType,
        severity: a.severity,
        matchId: a.linkMatch ? m.id : null,
      })
      .onConflictDoUpdate({
        target: newsArticle.url,
        set: {
          title: a.title,
          providerId,
          publishedAt: new Date(a.publishedAt),
          summary: a.summary,
          eventType: a.eventType,
          severity: a.severity,
          matchId: a.linkMatch ? m.id : null,
        },
      })
      .returning()
    if (!article) throw new Error(`falha upsert: ${url}`)

    await db
      .insert(newsArticleLeague)
      .values({
        articleId: article.id,
        leagueCode: LEAGUE_CODE,
        linkRole: "primary",
        confidence: "manual",
      })
      .onConflictDoNothing()

    const teamIds =
      a.teams === "both" ? [cam.id, bahia.id] : a.teams === "cam" ? [cam.id] : [bahia.id]
    for (const teamId of teamIds) {
      await db
        .insert(newsArticleTeam)
        .values({ articleId: article.id, teamId, role: "subject" })
        .onConflictDoNothing()
    }
    upserted++
    console.log(`✓ ${a.providerSlug} · ${a.eventType} · ${a.title.slice(0, 65)}…`)
  }

  // Remove o artigo duplicado se a URL sem # colidiu com o preview (mesmo URL base)
  const count = await db.execute(sql`
    select count(*)::int as n from news_article where match_id = ${m.id}`)
  console.log(`\n✅ ${upserted} upserts; ${count.rows[0]?.n ?? "?"} com match_id=${m.id}`)
  process.exit(0)
}

await main()
