"use client"

import { Badge } from "@workspace/ui/components/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { ExternalLink, Newspaper } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

import type { MatchNewsArticle } from "../../types"
import { useMatchNewsQuery } from "../../hooks/data/queries/use-match-news-query"

const EVENT_LABEL: Record<string, string> = {
  availability: "Disponibilidade",
  xi_quality: "Escalação",
  institutional: "Institucional",
  stake_form: "Forma",
  player_flag: "Jogador",
  venue: "Local",
  preview: "Preview",
}

function ArticleRow({ a }: { a: MatchNewsArticle }) {
  // Eden Treaty revive ISO → Date no client; parseISO só aceita string.
  const published =
    typeof a.publishedAt === "string" ? parseISO(a.publishedAt) : new Date(a.publishedAt)
  const day = format(published, "dd MMM yyyy", { locale: ptBR })
  const dateTime =
    typeof a.publishedAt === "string" ? a.publishedAt : published.toISOString()
  return (
    <li className="flex flex-col gap-1.5 border-b border-border/60 py-3 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
        <a
          href={a.provider.homeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:underline"
        >
          {a.provider.name}
        </a>
        <span aria-hidden>·</span>
        <time dateTime={dateTime}>{day}</time>
        {a.teams.length > 0 ? (
          <>
            <span aria-hidden>·</span>
            <span>{a.teams.map((t) => t.name).join(" · ")}</span>
          </>
        ) : null}
      </div>
      <a
        href={a.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-start gap-1.5 text-sm font-medium leading-snug hover:underline"
      >
        <span>{a.title}</span>
        <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-60 group-hover:opacity-100" />
      </a>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-[10px] font-normal">
          {EVENT_LABEL[a.eventType] ?? a.eventType}
        </Badge>
        <Badge variant="outline" className="text-[10px] font-normal capitalize">
          {a.severity}
        </Badge>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
    </li>
  )
}

export function MatchNews({ id }: { id: string }) {
  const { data, isPending, isError } = useMatchNewsQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando notícias…</p>
  if (isError) return <p className="text-sm text-destructive">Não foi possível carregar as notícias.</p>
  if (!data?.articles.length) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Newspaper />
          </EmptyMedia>
          <EmptyTitle>Sem notícias</EmptyTitle>
          <EmptyDescription>
            Ainda não há matérias vinculadas a esta partida.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col">
      {data.articles.map((a) => (
        <ArticleRow key={a.id} a={a} />
      ))}
    </ul>
  )
}
