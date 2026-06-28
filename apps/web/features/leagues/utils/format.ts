import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"

/**
 * Formats a match's date (yyyy-MM-dd) + optional time for display.
 *
 * `date` is typed as a string in the contract, but Eden Treaty REVIVES ISO strings into `Date`
 * on the client — so we accept both. We normalize to the day (yyyy-MM-dd) and parse it as a
 * LOCAL date (date-fns parse, without the timezone shift a UTC `new Date(iso)` would cause).
 */
export function formatDate(date: string | Date, time: string | null): string {
  const day = (typeof date === "string" ? date : date.toISOString()).slice(0, 10)
  const label = format(parse(day, "yyyy-MM-dd", new Date()), "dd 'de' MMM, yyyy", { locale: ptBR })
  return time ? `${label} · ${time}` : label
}
