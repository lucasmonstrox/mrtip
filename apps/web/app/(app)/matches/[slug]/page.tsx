import { MatchDetail } from "@/features/leagues"
import { PageContainer } from "@/shared/ui/page-container"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <PageContainer>
      <MatchDetail slug={slug} />
    </PageContainer>
  )
}
