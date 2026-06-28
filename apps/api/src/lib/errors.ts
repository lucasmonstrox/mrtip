import { StatusCodes } from "http-status-codes"

// Erro de domínio com status HTTP. O onError global (app.ts) mapeia para a resposta
// { error: code } — erro de domínio NUNCA vira 500.
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(code)
    this.name = "AppError"
  }
}

export const notFound = (code = "nao_encontrado") => new AppError(StatusCodes.NOT_FOUND, code)
export const badRequest = (code: string) => new AppError(StatusCodes.BAD_REQUEST, code)
export const conflict = (code: string) => new AppError(StatusCodes.CONFLICT, code)
