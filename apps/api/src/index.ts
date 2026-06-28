import { app } from "./app"
import { env } from "./env"

app.listen(env.port)

console.log(`🦊 mrtip API em http://localhost:${app.server?.port} — doc em /openapi`)

// Ponto de import único pro Eden Treaty (o apps/web importa o tipo `App` daqui — type-only,
// não executa este módulo). A composição vive em app.ts.
export type { App } from "./app"

// Tipos de domínio reaproveitados pelo apps/web (contrato único, sem duplicação).
export type {
  Desfalque,
  DesfalquesTime,
  EscalacaoTime,
  Forma,
  GolItem,
  JogadorDetalhe,
  JogadorEscalado,
  JogadorGol,
  Liga,
  LinhaClassificacao,
  Partida,
  ResultadoForma,
  Round,
  TecnicoDetalhe,
  TecnicoJogo,
  TimeRef,
} from "./modules/ligas/shared/shared"
