import { TimeDetalhe } from "@/features/ligas"
import { PageContainer } from "@/shared/ui/page-container"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <PageContainer>
      <TimeDetalhe slug={slug} />
    </PageContainer>
  )
}
