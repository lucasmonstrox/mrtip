import { differenceInYears, format, parse } from "date-fns"
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

/** Current age in whole years from a date of birth (yyyy-MM-dd or an Eden-revived Date). */
export function age(dob: string | Date | null): number | null {
  if (!dob) return null
  const day = (typeof dob === "string" ? dob : dob.toISOString()).slice(0, 10)
  return differenceInYears(new Date(), parse(day, "yyyy-MM-dd", new Date()))
}

/** Rating (0-10) → Tailwind text color: green good, neutral average, red poor. Shared by the match
 * lineup and the player page so the colour scale reads the same everywhere. */
export function ratingColor(r: number): string {
  if (r >= 7.5) return "text-emerald-600 dark:text-emerald-400"
  if (r >= 6.5) return "text-foreground"
  return "text-red-600 dark:text-red-400"
}
