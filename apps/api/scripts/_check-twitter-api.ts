/** Prova da camada de API do SIN-022: getTeam devolve twitterUsername, e null não quebra. */
import { getTeam } from "../src/modules/leagues/get-team/get-team.service"

for (const slug of ["flamengo", "vitoria", "bragantino", "arsenal"]) {
  const t = (await getTeam(slug)) as { name: string; twitterUsername: string | null }
  console.log(`${t.name.padEnd(20)} → ${t.twitterUsername === null ? "null (esperado fora do BRA)" : "@" + t.twitterUsername}`)
}
process.exit(0)
