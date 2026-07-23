import { notFound } from "next/navigation"

import { LeagueDetail } from "@/features/leagues"
import { isLeaguePageTabValue } from "@/features/leagues/components/league-detail/league-tabs"
import { PageContainer } from "@/shared/ui/page-container"

// Uma página por aba da liga: `/leagues/[code]/[tab]`. Aba inválida → 404.
// @feature LIG-025
export default async function LeagueTabPage({
  params,
}: {
  params: Promise<{ code: string; tab: string }>
}) {
  const { code, tab } = await params
  if (!isLeaguePageTabValue(tab)) notFound()

  return (
    <PageContainer>
      <LeagueDetail code={code} tab={tab} />
    </PageContainer>
  )
}
