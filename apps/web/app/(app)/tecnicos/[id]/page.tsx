import { TecnicoDetalhe } from "@/features/ligas"
import { PageContainer } from "@/shared/ui/page-container"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <PageContainer>
      <TecnicoDetalhe id={id} />
    </PageContainer>
  )
}
