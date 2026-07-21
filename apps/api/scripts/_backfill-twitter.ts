/**
 * Backfill do handle de X/Twitter dos clubes do Brasileirão 2025 + 2026 (24 clubes distintos).
 *
 * Por que à mão: a SportMonks não entrega social em nenhum endpoint do nosso tier (inventário
 * completo confirma), então o handle foi pesquisado clube a clube cruzando o site oficial do
 * próprio clube com Wikipédia/Wikidata — duas fontes independentes concordando.
 *
 * Chaveado por sportmonks_team_id (não por nome: acento e variante de grafia vazam erro no join).
 * `confianca` NÃO vai pro banco — fica aqui como registro de quão firme foi a verificação.
 */
import { db } from "../src/db/client"
import { sql } from "drizzle-orm"

type Handle = { id: number; nome: string; username: string; confianca: "alta" | "media" }

const HANDLES: Handle[] = [
  { id: 1024, nome: "Flamengo", username: "Flamengo", confianca: "alta" },
  { id: 3422, nome: "Palmeiras", username: "Palmeiras", confianca: "alta" },
  { id: 303, nome: "Corinthians", username: "Corinthians", confianca: "alta" },
  { id: 3496, nome: "São Paulo", username: "SaoPauloFC", confianca: "alta" },
  { id: 3684, nome: "Santos", username: "SantosFC", confianca: "alta" },
  // média: vasco.com.br devolveu 403; fechou por Wikipédia + 2 reportagens do anúncio oficial.
  { id: 696, nome: "Vasco da Gama", username: "VascodaGama", confianca: "media" },
  { id: 1095, nome: "Fluminense", username: "FluminenseFC", confianca: "alta" },
  { id: 2864, nome: "Botafogo", username: "Botafogo", confianca: "alta" },
  { id: 2925, nome: "Grêmio", username: "Gremio", confianca: "alta" },
  { id: 2696, nome: "Internacional", username: "SCInternacional", confianca: "alta" },
  { id: 3371, nome: "Cruzeiro", username: "Cruzeiro", confianca: "alta" },
  { id: 3427, nome: "Atlético Mineiro", username: "Atletico", confianca: "alta" },
  // média: site oficial confirma no header+footer, mas Wikipédia e Wikidata não têm o campo.
  { id: 11126, nome: "Mirassol", username: "mirassolfc", confianca: "media" },
  { id: 12220, nome: "Ceará", username: "CearaSC", confianca: "alta" },
  { id: 3621, nome: "Fortaleza", username: "FortalezaEC", confianca: "alta" },
  { id: 48, nome: "Juventude", username: "ECJuventude", confianca: "alta" },
  { id: 2352, nome: "Sport Recife", username: "sportrecife", confianca: "alta" },
  { id: 3432, nome: "Athletico PR", username: "AthleticoPR", confianca: "alta" },
  { id: 710, nome: "Chapecoense", username: "ChapecoenseReal", confianca: "alta" },
  { id: 6285, nome: "Coritiba", username: "Coritiba", confianca: "alta" },
  { id: 11550, nome: "Remo", username: "ClubeDoRemo", confianca: "alta" },
  // Os 3 abaixo saíram de DOIS agentes independentes que chegaram no mesmo handle — o site oficial
  // dos três só entrega o link depois de renderizar JS, então a leitura foi via navegador real.
  { id: 692, nome: "Bahia", username: "ecbahia", confianca: "alta" },
  { id: 3440, nome: "Vitória", username: "ECVitoria", confianca: "alta" },
  // Rebrand Red Bull deixou @Bragantino/@ClubeBragantino órfãs e vivas: este é o handle do site atual.
  { id: 7808, nome: "Red Bull Bragantino", username: "RedBullBraga", confianca: "alta" },
]

let atualizados = 0
const ausentes: string[] = []

for (const h of HANDLES) {
  const res = await db.execute(
    sql`update team set twitter_username = ${h.username} where sportmonks_team_id = ${h.id} returning name`,
  )
  const row = res.rows?.[0] as { name: string } | undefined
  if (!row) ausentes.push(`${h.nome} (${h.id})`)
  else atualizados++
}

console.log(`✅ ${atualizados}/${HANDLES.length} clubes atualizados`)
if (ausentes.length) console.log(`⚠️  sem linha em team: ${ausentes.join(", ")}`)

const semHandle = await db.execute(sql`
  select distinct t.name, t.sportmonks_team_id
  from season s
  join match m on m.season_id = s.id
  join team t on t.id in (m.home_team_id, m.away_team_id)
  where s.league_code = 'BRA' and t.twitter_username is null
  order by t.name`)
console.log(`\nClubes do Brasileirão ainda sem handle: ${semHandle.rows.length}`)
if (semHandle.rows.length) console.log(JSON.stringify(semHandle.rows, null, 1))

process.exit(0)
