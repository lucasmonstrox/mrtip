import { app } from "./app"
import { env } from "./env"

app.listen(env.port)

console.log(`🦊 mrtip API at http://localhost:${app.server?.port} — docs at /openapi`)
if (!env.clerk.secretKey) {
  console.warn("⚠️  CLERK_SECRET_KEY ausente — auth DESLIGADA (todas as rotas abertas). Defina-a para proteger a API.")
}

// Single import point for Eden Treaty (apps/web imports the `App` type from here — type-only,
// does not execute this module). The composition lives in app.ts.
export type { App } from "./app"

// Domain types reused by apps/web (single contract, no duplication).
export type {
  Absence,
  AbsencePlayerImpact,
  CardItem,
  CoachDetail,
  CoachMatch,
  CommentaryItem,
  CommentaryRef,
  Form,
  FormResult,
  GoalItem,
  GoalTimingBucket,
  League,
  LineupPlayer,
  Match,
  MatchAbsenceImpact,
  MatchGoalTiming,
  MatchScorer,
  MatchScorers,
  MatchStats,
  PlayerAppearance,
  PlayerDetail,
  PlayerGoal,
  PlayerMinuteEvent,
  Proportion,
  RecentTeamGame,
  Round,
  StandingRow,
  TeamAbsenceImpact,
  TeamAbsences,
  TeamGoalTiming,
  TeamLineup,
  TeamMatchStats,
  TeamRef,
  TeamRest,
  TeamScorers,
  TeamStanding,
  TeamTrends,
  TeamTrendSplit,
  VenueRecord,
} from "./modules/leagues/shared/shared"

// Search contract (global fuzzy search). @feature CORE-002
export type {
  SearchCoach,
  SearchLeague,
  SearchMatch,
  SearchPlayer,
  SearchResults,
  SearchTeamRef,
} from "./modules/leagues/search/search.service"
