/**
 * Checks `pickCurrentRound` against the cases that decided the rule (LIG-015 dossier §Testes).
 * There is no unit runner in this repo — this script IS the test. Run it from apps/web:
 *
 *   bun run scripts/check-current-round.ts
 *
 * `today` is hardcoded per case and NEVER read from the clock, or the cases rot with the calendar.
 */
import { pickCurrentRound } from "../features/leagues/utils/rounds"

const TODAY = "2026-07-19"

type Case = {
  name: string
  rounds: { round: number; matches: { date: string | Date }[] }[]
  today: string
  expected: number | null
}

/** Builds a round fixture out of a round number and the days its matches are played on. */
function r(round: number, ...dates: (string | Date)[]) {
  return { round, matches: dates.map((date) => ({ date })) }
}

const cases: Case[] = [
  {
    // Round under way with a split weekend: Saturday played, Sunday still pending.
    name: "1 · round under way (split weekend) -> stays, does not jump to 21",
    rounds: [r(19, "2026-07-11"), r(20, "2026-07-18", "2026-07-19"), r(21, "2026-07-25")],
    today: TODAY,
    expected: 20,
  },
  {
    // Between rounds: the current one is over, the next hasn't started (D3 = show what's coming).
    name: "2 · between rounds -> advances to the next one",
    rounds: [r(19, "2026-07-18", "2026-07-18"), r(20, "2026-07-25", "2026-07-26")],
    today: TODAY,
    expected: 20,
  },
  {
    // THE DISCRIMINATOR: a postponed match of round 18 sits CLOSER than round 20. Deciding by
    // nearest future date (or by missing score) answers 18 here — the regression this rule exists
    // to prevent.
    name: "3 · straggler closer than the current round -> 20, never 18",
    rounds: [r(18, "2026-07-22"), r(19, "2026-07-18"), r(20, "2026-07-25", "2026-07-26")],
    today: TODAY,
    expected: 20,
  },
  {
    name: "4 · finished season -> last round (no regression vs today's behaviour)",
    rounds: [r(36, "2026-05-10"), r(37, "2026-05-17"), r(38, "2026-05-24")],
    today: TODAY,
    expected: 38,
  },
  {
    name: "5 · season not started -> first round, never null nor last",
    rounds: [r(1, "2026-08-15"), r(2, "2026-08-22"), r(3, "2026-08-29")],
    today: TODAY,
    expected: 1,
  },
  {
    name: "6 · empty list -> null",
    rounds: [],
    today: TODAY,
    expected: null,
  },
  {
    // Eden Treaty revives ISO strings into Date on the client: same fixture as case 1, same answer.
    name: "7 · Eden-revived Date objects -> same as case 1",
    rounds: [
      r(19, new Date("2026-07-11T00:00:00.000Z")),
      r(20, new Date("2026-07-18T00:00:00.000Z"), new Date("2026-07-19T00:00:00.000Z")),
      r(21, new Date("2026-07-25T00:00:00.000Z")),
    ],
    today: TODAY,
    expected: 20,
  },
]

let failed = 0
for (const c of cases) {
  const got = pickCurrentRound(c.rounds, c.today)
  if (got === c.expected) {
    console.log(`ok   ${c.name}`)
  } else {
    failed++
    console.log(`fail ${c.name} — expected ${c.expected}, got ${got}`)
  }
}

if (failed > 0) {
  console.log(`\n${failed}/${cases.length} failed`)
  process.exit(1)
}
console.log(`\n${cases.length}/${cases.length} ok`)
