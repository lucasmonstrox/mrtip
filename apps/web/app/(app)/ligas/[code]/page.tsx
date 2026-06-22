import { LigaDetalhe } from "@/features/ligas"
import { PageContainer } from "@/shared/ui/page-container"

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return (
    <PageContainer>
      <LigaDetalhe code={code} />
    </PageContainer>
  )
}
