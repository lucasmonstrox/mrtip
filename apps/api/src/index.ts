import { app } from "./app"
import { env } from "./env"

app.listen(env.port)

console.log(`🦊 mrtip API at http://localhost:${app.server?.port} — docs at /openapi`)

// Single import point for Eden Treaty (apps/web imports the `App` type from here — type-only,
// does not execute this module). The composition lives in app.ts.
export type { App } from "./app"

// Domain types reused by apps/web (single contract, no duplication).
export type {
  Absence,
  CardItem,
  CoachDetail,
  CoachMatch,
  Form,
  FormResult,
  GoalItem,
  GoalTimingBucket,
  League,
  LineupPlayer,
  Match,
  MatchGoalTiming,
  PlayerDetail,
  PlayerGoal,
  Proportion,
  Round,
  StandingRow,
  TeamAbsences,
  TeamGoalTiming,
  TeamLineup,
  TeamRef,
  TeamStanding,
  TeamTrends,
  TeamTrendSplit,
  VenueRecord,
} from "./modules/leagues/shared/shared"
