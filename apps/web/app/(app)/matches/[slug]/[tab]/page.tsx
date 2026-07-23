import { notFound } from "next/navigation"

import { MatchDetail } from "@/features/leagues"
import { isMatchTabValue } from "@/features/leagues/components/match-detail/match-tabs"
import { PageContainer } from "@/shared/ui/page-container"

// Uma página por aba do dossiê: `/matches/[slug]/[tab]`. Aba inválida → 404.
// @feature LIG-024
export default async function MatchTabPage({
  params,
}: {
  params: Promise<{ slug: string; tab: string }>
}) {
  const { slug, tab } = await params
  if (!isMatchTabValue(tab)) notFound()

  return (
    <PageContainer>
      <MatchDetail slug={slug} tab={tab} />
    </PageContainer>
  )
}
