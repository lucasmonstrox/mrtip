import { redirect } from "next/navigation"

import { DEFAULT_MATCH_TAB } from "@/features/leagues/components/match-detail/match-tabs"

// Entrada sem aba → Fatos (default histórico). Links legados `/matches/:slug` continuam válidos.
// @feature LIG-024
export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/matches/${slug}/${DEFAULT_MATCH_TAB}`)
}
