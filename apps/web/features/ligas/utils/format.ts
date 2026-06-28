import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"

/**
 * Formata a data (yyyy-MM-dd) + hora opcional de uma partida pra exibição.
 *
 * `data` é tipada como string no contrato, mas o Eden Treaty REVIVE strings ISO em `Date`
 * no cliente — então aceitamos os dois. Normalizamos pro dia (yyyy-MM-dd) e parseamos como
 * data LOCAL (parse do date-fns, sem shift de fuso que um `new Date(iso)` UTC causaria).
 */
export function formatData(data: string | Date, hora: string | null): string {
  const dia = (typeof data === "string" ? data : data.toISOString()).slice(0, 10)
  const label = format(parse(dia, "yyyy-MM-dd", new Date()), "dd 'de' MMM, yyyy", { locale: ptBR })
  return hora ? `${label} · ${hora}` : label
}
