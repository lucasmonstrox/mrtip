import { and, desc, eq, inArray, lte } from "drizzle-orm"

import { db } from "../../../db/client"
import { newsArticle, newsArticleLeague, newsArticleTeam, newsProvider } from "../../../db/schemas/news"
import { team } from "../../../db/schemas/leagues"
import { notFound } from "../../../lib/errors"
import { getMatchRow } from "../shared/shared"

// Provider normalizado (veículo/site) embutido no artigo — a aba Notícias e o filtro futuro (W-077)
// precisam de entidade, não string solta.
export type MatchNewsProvider = {
  id: string
  slug: string
  name: string
  domain: string
  homeUrl: string
  tier: string
  kind: string
}

export type MatchNewsTeam = {
  id: string
  name: string
  role: string
}

export type MatchNewsArticle = {
  id: string
  url: string
  title: string
  publishedAt: string
  summary: string
  eventType: string
  severity: string
  provider: MatchNewsProvider
  teams: MatchNewsTeam[]
}

export type MatchNews = { articles: MatchNewsArticle[] }

// Artigos da partida: match_id direto OU (times do jogo ∩ liga do jogo ∩ published_at ≤ kickoff).
// Ordenado do mais recente pro mais antigo. Usado pela API e pelo bloco do super-prognosis.
export async function loadMatchNews(matchId: string): Promise<MatchNewsArticle[]> {
  const row = await getMatchRow(matchId)
  if (!row) return []

  const kickoff = row.m.date // yyyy-MM-dd (hora de parede da liga)
  // published_at ≤ fim do dia do kickoff (timestamptz) — cobre matérias do dia do jogo pré-bola
  const cutoff = `${kickoff}T23:59:59.999-03:00`

  const teamIds = [row.m.homeTeamId, row.m.awayTeamId]
  const leagueCode = row.m.leagueCode

  // IDs candidatos: ligados ao match OU (time + liga + janela).
  const byMatch = await db
    .select({ id: newsArticle.id })
    .from(newsArticle)
    .where(and(eq(newsArticle.matchId, matchId), lte(newsArticle.publishedAt, new Date(cutoff))))

  const byTeamLeague = await db
    .selectDistinct({ id: newsArticle.id })
    .from(newsArticle)
    .innerJoin(newsArticleTeam, eq(newsArticleTeam.articleId, newsArticle.id))
    .innerJoin(newsArticleLeague, eq(newsArticleLeague.articleId, newsArticle.id))
    .where(
      and(
        inArray(newsArticleTeam.teamId, teamIds),
        eq(newsArticleLeague.leagueCode, leagueCode),
        lte(newsArticle.publishedAt, new Date(cutoff)),
      ),
    )

  const idSet = new Set<string>([...byMatch.map((r) => r.id), ...byTeamLeague.map((r) => r.id)])
  if (idSet.size === 0) return []
  const ids = [...idSet]

  const articles = await db
    .select({
      id: newsArticle.id,
      url: newsArticle.url,
      title: newsArticle.title,
      publishedAt: newsArticle.publishedAt,
      summary: newsArticle.summary,
      eventType: newsArticle.eventType,
      severity: newsArticle.severity,
      providerId: newsProvider.id,
      providerSlug: newsProvider.slug,
      providerName: newsProvider.name,
      providerDomain: newsProvider.domain,
      providerHomeUrl: newsProvider.homeUrl,
      providerTier: newsProvider.tier,
      providerKind: newsProvider.kind,
    })
    .from(newsArticle)
    .innerJoin(newsProvider, eq(newsProvider.id, newsArticle.providerId))
    .where(inArray(newsArticle.id, ids))
    .orderBy(desc(newsArticle.publishedAt))

  const teamRows = await db
    .select({
      articleId: newsArticleTeam.articleId,
      teamId: team.id,
      teamName: team.name,
      role: newsArticleTeam.role,
    })
    .from(newsArticleTeam)
    .innerJoin(team, eq(team.id, newsArticleTeam.teamId))
    .where(inArray(newsArticleTeam.articleId, ids))

  const teamsByArticle = new Map<string, MatchNewsTeam[]>()
  for (const t of teamRows) {
    const list = teamsByArticle.get(t.articleId) ?? []
    list.push({ id: t.teamId, name: t.teamName, role: t.role })
    teamsByArticle.set(t.articleId, list)
  }

  return articles.map((a) => ({
    id: a.id,
    url: a.url,
    title: a.title,
    publishedAt: a.publishedAt.toISOString(),
    summary: a.summary,
    eventType: a.eventType,
    severity: a.severity,
    provider: {
      id: a.providerId,
      slug: a.providerSlug,
      name: a.providerName,
      domain: a.providerDomain,
      homeUrl: a.providerHomeUrl,
      tier: a.providerTier,
      kind: a.providerKind,
    },
    teams: teamsByArticle.get(a.id) ?? [],
  }))
}

// GET /v1/matches/:id/news — feed tipado da partida (URL canônica + provider). 404 se a partida não existe.
export async function matchNews(id: string): Promise<MatchNews> {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const articles = await loadMatchNews(id)
  return { articles }
}

// Markdown do bloco `noticias` pro super-prognosis (EXPLICAR — não move λ). Agrupa por time.
export function formatNewsBlockMd(
  articles: MatchNewsArticle[],
  homeName: string,
  awayName: string,
  homeTeamId: string,
  awayTeamId: string,
): string {
  if (articles.length === 0) {
    return "- nenhuma notícia pré-jogo ingerida pra esta partida — declare o bloco em `blocos_sem_sinal`"
  }

  const bySide = { home: [] as MatchNewsArticle[], away: [] as MatchNewsArticle[], both: [] as MatchNewsArticle[] }
  for (const a of articles) {
    const ids = new Set(a.teams.map((t) => t.id))
    const hasH = ids.has(homeTeamId)
    const hasA = ids.has(awayTeamId)
    if (hasH && hasA) bySide.both.push(a)
    else if (hasH) bySide.home.push(a)
    else if (hasA) bySide.away.push(a)
    else bySide.both.push(a)
  }

  const line = (a: MatchNewsArticle) => {
    const day = a.publishedAt.slice(0, 10)
    return [
      `- [${day} · ${a.provider.name} · ${a.eventType} · ${a.severity}] ${a.title}`,
      `  ${a.summary}`,
      `  fonte: ${a.url}`,
    ].join("\n")
  }

  const parts: string[] = []
  if (bySide.home.length) {
    parts.push(`#### ${homeName}`, ...bySide.home.map(line))
  }
  if (bySide.away.length) {
    parts.push(`#### ${awayName}`, ...bySide.away.map(line))
  }
  if (bySide.both.length) {
    parts.push(`#### Ambos / preview`, ...bySide.both.map(line))
  }
  return parts.join("\n")
}
