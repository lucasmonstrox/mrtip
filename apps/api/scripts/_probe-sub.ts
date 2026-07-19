// O envelope da SportMonks traz `subscription` e `rate_limit` — mostra o PLANO VIGENTE hoje.
import { env } from "../src/env"
const r = await (await fetch(`https://api.sportmonks.com/v3/football/leagues?api_token=${env.sportmonksApiKey}`)).json() as any
console.log("subscription:", JSON.stringify(r.subscription, null, 2))
console.log("rate_limit:", JSON.stringify(r.rate_limit, null, 2))
process.exit(0)
