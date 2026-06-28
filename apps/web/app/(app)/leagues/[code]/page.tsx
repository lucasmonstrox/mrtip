import { LeagueDetail } from "@/features/leagues"
import { PageContainer } from "@/shared/ui/page-container"

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return (
    <PageContainer>
      <LeagueDetail code={code} />
    </PageContainer>
  )
}
