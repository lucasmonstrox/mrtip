/**
 * Catálogo de ligas disponíveis. Adicionar uma liga/temporada = só acrescentar
 * uma entrada aqui e colocar o JSON correspondente em `data/openfootball/`.
 */
export interface LigaCatalogo {
  code: string
  nome: string
  pais: string
  temporada: string
  arquivo: string
}

export const CATALOGO = [
  {
    code: "PL",
    nome: "Premier League",
    pais: "Inglaterra",
    temporada: "2025/26",
    arquivo: "en.1.2025-26.json",
  },
] as const satisfies readonly LigaCatalogo[]

export type LigaCode = (typeof CATALOGO)[number]["code"]
