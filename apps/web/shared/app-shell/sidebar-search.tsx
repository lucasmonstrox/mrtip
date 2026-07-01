"use client"

import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarDaysIcon,
  ClipboardListIcon,
  SearchIcon,
  ShieldIcon,
  TrophyIcon,
  UserRoundIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

import { NAV_SECTIONS } from "./nav"
import { useDebouncedValue, useSearch } from "./use-search"
import { useLeaguesNav } from "./use-leagues-nav"

// Data do jogo no resultado, sem o shift de fuso que `new Date(iso)` causaria; o Eden pode reviver a
// string ISO em Date, então aceita os dois ([[eden-revive-datas-em-date]]).
function matchDateLabel(d: string | Date): string {
  const date = d instanceof Date ? d : parse(d, "yyyy-MM-dd", new Date())
  return format(date, "dd MMM yy", { locale: ptBR })
}

// Logo (time/liga) ou foto (jogador) com fallback pra um ícone quando não há imagem.
function ResultThumb({ src, fallback }: { src: string | null; fallback: React.ReactNode }) {
  if (!src) return <>{fallback}</>
  return (
    <img
      src={src}
      alt=""
      className="size-4 shrink-0 rounded-[3px] bg-white object-contain p-px"
      loading="lazy"
    />
  )
}

// Larguras fixas (não Math.random, que daria hydration mismatch) pras barras do skeleton.
const SKELETON_WIDTHS = ["58%", "72%", "45%", "64%", "51%"]

// Placeholder enquanto a PRIMEIRA busca de um termo está em voo (ainda sem resultado): linhas que
// imitam um item (thumb + nome) pra dar percepção de carregamento, em vez de um vazio ou texto seco.
function ResultsSkeleton() {
  return (
    <div className="p-1" aria-hidden>
      {SKELETON_WIDTHS.map((w, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1.5">
          <Skeleton className="size-4 shrink-0 rounded-[3px]" />
          <Skeleton className="h-3.5" style={{ width: w }} />
        </div>
      ))}
    </div>
  )
}

/**
 * Busca global da sidebar: paleta de comandos ⌘K (shadcn/cmdk) que, ao digitar, faz busca
 * server-side (trigram, tolerante a typo/acento) de ligas, times, jogadores, jogos e treinadores e
 * agrupa os resultados por entidade; selecionar navega pra página da entidade. Vazia, lista a
 * navegação do app + as ligas. Atalho global ⌘K (Mac) / Ctrl+K (Windows/Linux). @feature CORE-002
 */
export function SidebarSearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter()
  const { data: leagues } = useLeaguesNav()

  const debounced = useDebouncedValue(value, 200)
  const { data: results, isFetching } = useSearch(debounced)

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Navega e fecha a paleta, limpando o termo pra próxima abertura começar do zero.
  function go(href: string) {
    setOpen(false)
    setValue("")
    router.push(href)
  }

  // Limpa o termo ao fechar (Esc / clique fora) pra não reabrir com a busca antiga.
  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setValue("")
  }

  const trimmed = value.trim()
  const searching = trimmed.length >= 2
  const navItems = NAV_SECTIONS.flatMap((section) => section.items)
  // shouldFilter está desligado (a busca é server-side) → filtramos a navegação local na mão.
  const matchedNav = searching
    ? navItems.filter((item) => item.title.toLowerCase().includes(trimmed.toLowerCase()))
    : navItems

  const loading = searching && isFetching && results == null
  const empty = searching && !isFetching && results != null && results.total === 0 && matchedNav.length === 0

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setOpen(true)}
            tooltip="Pesquisar"
            className="text-sidebar-foreground/70"
          >
            <SearchIcon />
            <span>Pesquisar</span>
            <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-sidebar-border bg-sidebar px-1.5 font-mono text-[10px] text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <CommandDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Pesquisar"
        description="Busque ligas, times, jogadores e jogos, ou navegue pelo app"
        // Busca é server-side (trigram): o cmdk NÃO deve re-filtrar pelo texto, senão esconde achados
        // por similaridade/typo cujo nome não contém o termo exato.
        commandProps={{ shouldFilter: false }}
      >
        <CommandInput
          placeholder="Buscar ligas, times, jogadores, jogos…"
          value={value}
          onValueChange={setValue}
          loading={searching && isFetching}
        />
        {/* No refetch com resultado anterior em tela, escurece a lista (sinaliza "atualizando" sem o
            conteúdo sumir); no primeiro carregamento de um termo, mostra o skeleton no lugar. */}
        <CommandList
          className={cn(
            "transition-opacity duration-150",
            searching && isFetching && results != null && "opacity-50",
          )}
        >
          {loading ? <ResultsSkeleton /> : null}
          {empty ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Nenhum resultado para “{trimmed}”.
            </div>
          ) : null}

          {/* Navegação: completa quando vazio, filtrada localmente quando há termo. */}
          {matchedNav.length > 0 ? (
            <CommandGroup heading={searching ? "Páginas" : "Navegação"}>
              {matchedNav.map((item) => {
                const Icon = item.icon
                return (
                  <CommandItem key={item.href} value={`nav:${item.href}`} onSelect={() => go(item.href)}>
                    <Icon />
                    <span>{item.title}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          ) : null}

          {/* Vazio: atalho pras ligas da sidebar (sem custo de rede). */}
          {!searching && leagues && leagues.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Ligas">
                {leagues.map((league) => (
                  <CommandItem
                    key={league.code}
                    value={`leaguenav:${league.code}`}
                    onSelect={() => go(`/leagues/${league.code}`)}
                  >
                    <ResultThumb src={league.logoUrl} fallback={<TrophyIcon />} />
                    <span>{league.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}

          {/* Resultados server-side, agrupados por entidade (ordem: ligas → times → jogadores → jogos → técnicos). */}
          {searching && results ? (
            <>
              {results.leagues.length > 0 ? (
                <>
                  {matchedNav.length > 0 ? <CommandSeparator /> : null}
                  <CommandGroup heading="Ligas">
                    {results.leagues.map((l) => (
                      <CommandItem key={l.code} value={`league:${l.code}`} onSelect={() => go(`/leagues/${l.code}`)}>
                        <ResultThumb src={l.logoUrl} fallback={<TrophyIcon />} />
                        <span>{l.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{l.country}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              ) : null}

              {results.teams.length > 0 ? (
                <CommandGroup heading="Times">
                  {results.teams.map((t) => (
                    <CommandItem key={t.id} value={`team:${t.id}`} onSelect={() => go(`/teams/${t.slug}`)}>
                      <ResultThumb src={t.logoUrl} fallback={<ShieldIcon />} />
                      <span>{t.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {results.players.length > 0 ? (
                <CommandGroup heading="Jogadores">
                  {results.players.map((p) => (
                    <CommandItem key={p.id} value={`player:${p.id}`} onSelect={() => go(`/players/${p.id}`)}>
                      <ResultThumb src={p.imageUrl} fallback={<UserRoundIcon />} />
                      <span className="truncate">{p.name}</span>
                      {p.team ? (
                        <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          {p.team.logoUrl ? (
                            <img
                              src={p.team.logoUrl}
                              alt=""
                              className="size-3.5 shrink-0 object-contain"
                              loading="lazy"
                            />
                          ) : null}
                          {p.team.name}
                        </span>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {results.matches.length > 0 ? (
                <CommandGroup heading="Jogos">
                  {results.matches.map((m) => (
                    <CommandItem key={m.id} value={`match:${m.id}`} onSelect={() => go(`/matches/${m.slug}`)}>
                      <CalendarDaysIcon />
                      <span className="truncate">
                        {m.home.name} <span className="text-muted-foreground">×</span> {m.away.name}
                      </span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {matchDateLabel(m.date)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {results.coaches.length > 0 ? (
                <CommandGroup heading="Técnicos">
                  {results.coaches.map((c) => (
                    <CommandItem key={c.id} value={`coach:${c.id}`} onSelect={() => go(`/coaches/${c.id}`)}>
                      <ClipboardListIcon />
                      <span>{c.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  )
}
