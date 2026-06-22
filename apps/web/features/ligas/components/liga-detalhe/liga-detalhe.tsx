"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import Link from "next/link"

import { useLigaQuery } from "../../hooks/data/queries/use-liga-query"
import { ClassificacaoTable } from "./classificacao-table"
import { RoundsList } from "./rounds-list"

export function LigaDetalhe({ code }: { code: string }) {
  const { data: liga } = useLigaQuery(code)

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link href="/ligas" className="text-sm text-muted-foreground hover:text-foreground">
          ← Ligas
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{liga?.nome ?? code}</h1>
          <Badge variant="outline">{code}</Badge>
        </div>
        {liga ? (
          <p className="text-sm text-muted-foreground">
            {liga.pais} · {liga.temporada} · {liga.rounds} rodadas · {liga.partidas} jogos
          </p>
        ) : null}
      </header>

      <Tabs defaultValue="classificacao">
        <TabsList>
          <TabsTrigger value="classificacao">Classificação</TabsTrigger>
          <TabsTrigger value="rounds">Rounds</TabsTrigger>
        </TabsList>
        <TabsContent value="classificacao" className="pt-2">
          <ClassificacaoTable code={code} />
        </TabsContent>
        <TabsContent value="rounds" className="pt-2">
          <RoundsList code={code} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
