/**
 * Seed de notícias pré-jogo São Paulo × Athletico-PR (slug brasileirao-2026-sao-paulo-vs-athletico-pr).
 *
 * Upsert idempotente por URL / slug do provider. Classificação de liga = BRA (manual).
 * Resumos = evidência tipada lida das matérias (sem body) — alimenta aba Notícias + bloco do super.
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

const MATCH_SLUG = "brasileirao-2026-sao-paulo-vs-athletico-pr"
const LEAGUE_CODE = "BRA"

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

type TeamRole = "subject" | "opponent" | "mentioned"
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
  publishedAt: string // ISO
  summary: string
  eventType: EventType
  severity: Severity
  /** "sp" | "cap" | "both" */
  teams: "sp" | "cap" | "both"
  teamRole?: TeamRole
  linkMatch: boolean
}

const ARTICLES: SeedArticle[] = [
  {
    url: "https://ge.globo.com/futebol/times/sao-paulo/noticia/2026/07/21/rafinha-diz-que-elenco-do-sao-paulo-cobrou-arboleda-e-defende-volta-dele-vamos-crucificar.ghtml",
    title: "Rafinha diz que elenco cobrou Arboleda e defende a volta: 'Vamos crucificar?'",
    providerSlug: "ge",
    publishedAt: "2026-07-21T18:00:00-03:00",
    summary:
      "Arboleda reintegrado após afastamento por indisciplina; elenco teria confrontado o zagueiro. Rafinha defende a volta e critica linchamento. Relato de crise depressiva + ódio de torcida nas redes. Sinal: player_flag / ruído institucional, não disponibilidade pura.",
    eventType: "player_flag",
    severity: "confirmado",
    teams: "sp",
    linkMatch: true,
  },
  {
    url: "https://www.lance.com.br/sao-paulo/sao-paulo-e-arboleda-como-a-historia-mudou-e-o-zagueiro-foi-reintegrado.html",
    title: "São Paulo e Arboleda: como a história mudou e o zagueiro foi reintegrado",
    providerSlug: "lance",
    publishedAt: "2026-07-21T12:00:00-03:00",
    summary:
      "Retrospectiva da crise Arboleda → reintegração às vésperas do retorno ao Brasileirão. Reforça o mesmo arco da peça do GE: zagueiro de volta ao grupo sob clima tenso.",
    eventType: "player_flag",
    severity: "confirmado",
    teams: "sp",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/futebol/times/sao-paulo/noticia/2026/07/21/sao-paulo-e-punido-pela-fifa-com-transfer-ban-por-divida-na-compra-de-marcos-antonio.ghtml",
    title: "São Paulo é punido pela FIFA com transfer ban por dívida na compra de Marcos Antônio",
    providerSlug: "ge",
    publishedAt: "2026-07-21T15:00:00-03:00",
    summary:
      "Banimento de transferências por atraso ~€1,05M da compra de Marcos Antônio (Lazio). Bloqueia reforços no mercado até quitar. Sinal institucional/EXPLAIN — não move λ direto, mas trava plano de reforço e gera ruído de vestiário.",
    eventType: "institutional",
    severity: "confirmado",
    teams: "sp",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/futebol/times/sao-paulo/noticia/2026/07/21/escalacao-do-sao-paulo-sabino-e-duvida-e-dorival-fara-mudancas-na-defesa-contra-o-athletico.ghtml",
    title: "Escalação do São Paulo: Sabino é dúvida e Dorival fará mudanças na defesa",
    providerSlug: "ge",
    publishedAt: "2026-07-21T20:00:00-03:00",
    summary:
      "Sabino preservado/dúvida; Dorival planeja mudanças na zaga contra o Athletico. Victor Sá / Buta / Newton citados no entorno do BID/disponibilidade. Sinal: availability + xi_quality da defesa.",
    eventType: "availability",
    severity: "confirmado",
    teams: "sp",
    linkMatch: true,
  },
  {
    url: "https://www.lance.com.br/sao-paulo/dorival-jr-define-escalacao-do-sao-paulo-contra-o-athletico-pr-veja-os-nomes.html",
    title: "Dorival Jr define escalação do São Paulo contra o Athletico-PR; veja os nomes",
    providerSlug: "lance",
    publishedAt: "2026-07-22T18:00:00-03:00",
    summary:
      "Provável XI do São Paulo para o duelo em Bragança. Peça de escalação pré-kickoff — base pra ler qualidade do XI e quem fica de fora.",
    eventType: "xi_quality",
    severity: "confirmado",
    teams: "sp",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/futebol/times/sao-paulo/noticia/2026/07/22/calleri-atraso-nos-salarios-saidas-e-reforcos-rafinha-planeja-futuro-do-sao-paulo-em-nova-funcao.ghtml",
    title: "Calleri, atraso nos salários, saídas e reforços: Rafinha planeja futuro do São Paulo",
    providerSlug: "ge",
    publishedAt: "2026-07-22T10:00:00-03:00",
    summary:
      "Rafinha: image rights ~1 mês atrasadas; renovação de Calleri vista com otimismo; Alan Franco teria pedido pra sair (Tigres). Ruído salarial/institucional pré-jogo — EXPLAIN, não λ.",
    eventType: "institutional",
    severity: "confirmado",
    teams: "sp",
    linkMatch: true,
  },
  {
    url: "https://www.uol.com.br/esporte/futebol/ultimas-noticias/2026/07/06/com-shows-no-morumbis-sao-paulo-joga-contra-o-athletico-pr-em-baganca.ghtm",
    title: "Com shows no Morumbis, São Paulo joga contra o Athletico-PR em Bragança",
    providerSlug: "uol",
    publishedAt: "2026-07-06T12:00:00-03:00",
    summary:
      "Mando diluído: Morumbis ocupado por shows (Harry Styles) → jogo no Cícero de Souza Marques (Bragança Paulista). Casa fraca / mando neutro-ish — venue quality.",
    eventType: "venue",
    severity: "confirmado",
    teams: "sp",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/pr/futebol/times/athletico-pr/noticia/2026/07/21/escalacao-athletico-tem-desfalques-e-reforcos-contra-o-sao-paulo-na-volta-ao-brasileirao.ghtml",
    title: "Escalação Athletico: desfalques e reforços contra o São Paulo na volta ao Brasileirão",
    providerSlug: "ge",
    publishedAt: "2026-07-21T19:00:00-03:00",
    summary:
      "Zapelli, Benavídez, Felipinho e Mycael fora; Gilberto cotado pra começar. Desfalques ofensivos/meio relevantes no retorno da pausa da Copa.",
    eventType: "availability",
    severity: "confirmado",
    teams: "cap",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/pr/futebol/times/athletico-pr/noticia/2026/07/20/athletico-tem-duvidas-na-defesa-e-desfalque-contra-o-sao-paulo-veja-provavel-escalacao.ghtml",
    title: "Athletico tem dúvidas na defesa e desfalque contra o São Paulo; veja a escalação",
    providerSlug: "ge",
    publishedAt: "2026-07-20T18:00:00-03:00",
    summary:
      "Dúvidas na zaga + desfalques listados pra visita a Bragança. Complementa o quadro de availability/xi do Athletico.",
    eventType: "xi_quality",
    severity: "confirmado",
    teams: "cap",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/pr/futebol/times/athletico-pr/noticia/2026/07/18/athletico-recupera-viveros-e-benavidez-volta-aos-treinos-de-olho-no-sao-paulo-veja-situacao.ghtml",
    title: "Athletico recupera Viveros e Benavídez volta aos treinos de olho no São Paulo",
    providerSlug: "ge",
    publishedAt: "2026-07-18T16:00:00-03:00",
    summary:
      "Viveros de volta ao grupo após joelho crônico; Benavídez retoma treinos (depois listado como dúvida/fora na semana). Situação fluida de availability ofensiva.",
    eventType: "availability",
    severity: "confirmado",
    teams: "cap",
    linkMatch: true,
  },
  {
    url: "https://ge.globo.com/pr/futebol/times/athletico-pr/noticia/2026/07/09/odair-hellmann-avalia-desempenho-do-athletico-contra-o-boca-e-explica-ausencia-de-viveros.ghtml",
    title: "Odair explica ausência de Viveros e avalia Athletico após Boca",
    providerSlug: "ge",
    publishedAt: "2026-07-09T14:00:00-03:00",
    summary:
      "Odair sobre joelho crônico de Viveros e gestão de carga. Contexto do player_flag / disponibilidade do atacante chave antes da semana do São Paulo.",
    eventType: "player_flag",
    severity: "confirmado",
    teams: "cap",
    linkMatch: false,
  },
  {
    url: "https://ge.globo.com/sp/futebol/brasileirao-serie-a/noticia/2026/07/22/sao-paulo-x-athletico-onde-assistir-ao-vivo-horario-e-escalacoes.ghtml",
    title: "São Paulo x Athletico: onde assistir, horário e escalações",
    providerSlug: "ge",
    publishedAt: "2026-07-22T04:00:00-03:00",
    summary:
      "Preview do confronto: horário 21h30, Cícero de Souza Marques (Bragança), encerra 1º turno. SP 8º/25 pts (5 jogos sem vencer); Athletico 5º/30 pts. Escalacões e TV.",
    eventType: "preview",
    severity: "confirmado",
    teams: "both",
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

  const [sp] = await db.select().from(team).where(eq(team.sportmonksTeamId, 3496)).limit(1)
  const [cap] = await db.select().from(team).where(eq(team.sportmonksTeamId, 3432)).limit(1)
  if (!sp || !cap) throw new Error("times SP/CAP não encontrados (sportmonks 3496 / 3432)")

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

    const [article] = await db
      .insert(newsArticle)
      .values({
        url: a.url,
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
    if (!article) throw new Error(`falha upsert artigo: ${a.url}`)

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
      a.teams === "both" ? [sp.id, cap.id] : a.teams === "sp" ? [sp.id] : [cap.id]
    for (const teamId of teamIds) {
      await db
        .insert(newsArticleTeam)
        .values({
          articleId: article.id,
          teamId,
          role: a.teamRole ?? "subject",
        })
        .onConflictDoNothing()
    }
    upserted++
    console.log(`✓ ${a.providerSlug} · ${a.eventType} · ${a.title.slice(0, 60)}…`)
  }

  const count = await db.execute(sql`
    select count(*)::int as n from news_article where match_id = ${m.id}`)
  console.log(`\n✅ ${upserted} artigos upsertados; ${count.rows[0]?.n ?? "?"} com match_id=${m.id}`)
  process.exit(0)
}

await main()
