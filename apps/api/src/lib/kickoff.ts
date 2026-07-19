import { formatInTimeZone, fromZonedTime } from "date-fns-tz"

/**
 * Converte o horário de início de uma partida (kickoff) do UTC cru da SportMonks para a hora de
 * parede do fuso da liga, devolvendo `date`/`time` prontos para gravar em `match`. Ponto único de
 * conversão de fuso da ingestão. @feature LIG-012
 *
 * A SportMonks entrega `starting_at` como `"YYYY-MM-DD HH:mm:ss"` em UTC — com **espaço** no lugar
 * do `T` e **sem** sufixo `Z`. Passar essa string crua para `new Date()` dá `Invalid Date` ou a hora
 * local do runner, então o separador é normalizado e o instante é ancorado em UTC explicitamente.
 */
export type Kickoff = { date: string; time: string }

const SPORTMONKS_UTC = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/

export function kickoffInTimeZone(startingAtUtc: string, timeZone: string): Kickoff {
  if (!SPORTMONKS_UTC.test(startingAtUtc)) {
    throw new Error(`kickoffInTimeZone: unexpected starting_at format ${JSON.stringify(startingAtUtc)}`)
  }
  // A string é hora de parede em UTC: ancora nesse fuso para obter o instante, depois projeta no fuso da liga.
  const instant = fromZonedTime(startingAtUtc.replace(" ", "T"), "UTC")
  if (Number.isNaN(instant.getTime())) {
    throw new Error(`kickoffInTimeZone: unparseable starting_at ${JSON.stringify(startingAtUtc)}`)
  }
  return {
    date: formatInTimeZone(instant, timeZone, "yyyy-MM-dd"),
    time: formatInTimeZone(instant, timeZone, "HH:mm"),
  }
}
