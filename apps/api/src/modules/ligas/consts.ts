/**
 * Catálogo de ligas disponíveis. Fonte = API-Football (api-sports.io).
 * Adicionar uma liga/temporada = acrescentar uma entrada aqui (leagueId + season) e rodar o seed.
 * `season` é o ano de início (2024 = 2024/25). Plano Free cobre 2022–2024.
 */
export type LigaCatalogo = {
  code: string
  nome: string
  pais: string
  temporada: string
  leagueId: number // id da competição na API-Football (PL = 39)
  season: number // ano de início (2024 = 2024/25)
}

export const CATALOGO = [
  {
    code: "PL",
    nome: "Premier League",
    pais: "Inglaterra",
    temporada: "2024/25",
    leagueId: 39,
    season: 2024,
  },
] as const satisfies readonly LigaCatalogo[]

export type LigaCode = (typeof CATALOGO)[number]["code"]
