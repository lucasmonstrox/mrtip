import { ConstructionIcon } from "lucide-react"

import { PageContainer } from "./page-container"

/**
 * Placeholder de página "em construção". Cada tela de produto vira uma feature
 * própria (via /pl → /i) e substitui este stub pelo conteúdo real.
 */
export function PageStub({
  title,
  description,
  feature,
}: {
  title: string
  description: string
  feature?: string
}) {
  return (
    <PageContainer>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-24 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <ConstructionIcon className="size-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        {feature ? (
          <span className="rounded-md bg-accent px-2 py-0.5 font-mono text-xs text-accent-foreground">
            {feature}
          </span>
        ) : null}
      </div>
    </PageContainer>
  )
}
