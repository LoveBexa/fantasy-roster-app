"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUp, ArrowDown, ClipboardList, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { StarDoodle, CrownDoodle } from "@/components/doodles"
import { createClient } from "@/lib/supabase/client"
import { getErrorMessage } from "@/lib/supabase/errors"
import {
  fetchLeagueTable,
  type LeaguePeriod,
  type LeagueTableRow,
} from "@/lib/league/league-table"
import { cn } from "@/lib/utils"

const tabs: LeaguePeriod[] = ["Overall", "This Season", "This Month", "This Week"]

function LeagueFormArrows({ form }: { form: LeagueTableRow["form"] }) {
  if (form.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <div className="flex items-center gap-0.5">
      {form.map((direction, index) =>
        direction === "up" ? (
          <ArrowUp key={index} className="size-3.5 text-brand-green md:size-4" />
        ) : (
          <ArrowDown key={index} className="size-3.5 text-primary md:size-4" />
        )
      )}
    </div>
  )
}

function ConsistencyPill({ consistency }: { consistency: number }) {
  const isHigh = consistency >= 50

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border border-border bg-card font-semibold text-muted-foreground",
        "px-2.5 py-0.5 text-[10px] md:px-3 md:py-1 md:text-sm"
      )}
    >
      Consistency: {" "}
      <span className={isHigh ? "text-brand-green" : "text-primary"}>
        {consistency}%
      </span>
    </span>
  )
}

export function LeagueTable() {
  const [active, setActive] = useState<LeaguePeriod>("Overall")
  const [rows, setRows] = useState<LeagueTableRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTable = useCallback(async (period: LeaguePeriod) => {
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setRows([])
        setError("Sign in to view your league table.")
        return
      }

      const data = await fetchLeagueTable(supabase, user.id, period)
      setRows(data)
    } catch (err) {
      setError(getErrorMessage(err, "Could not load league table."))
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTable(active)
  }, [active, loadTable])

  return (
    <section aria-labelledby="league-heading" className="space-y-6">
      <PageHeader
        id="league-heading"
        title="LEAGUE TABLE"
        subtitle="Rank your dates. Track the stats. Don't settle. Win the league."
        icon={<StarDoodle className="size-8 text-primary" />}
      />

      <div className="flex flex-wrap gap-1 md:gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase leading-tight tracking-wide transition-colors sm:text-[11px] md:px-4 md:py-1.5 md:text-xs",
              active === tab
                ? "bg-primary text-primary-foreground"
                : "text-primary hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="hidden grid-cols-[4rem_1fr_7rem_7rem_8rem] gap-2 border-b border-border px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground md:grid">
          <span>Rank</span>
          <span>Player (aka Date)</span>
          <span className="text-center">Points</span>
          <span className="text-center">Position</span>
          <span className="text-center">Consistency</span>
        </div>

        {isLoading ? (
          <p className="px-4 py-8 text-sm text-muted-foreground md:px-5">
            Loading league table...
          </p>
        ) : rows.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted-foreground md:px-5">
            No roster players yet.{" "}
            <Link
              href="/roster?add=1"
              className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Add players
            </Link>{" "}
            and log daily stats to populate the league table.
          </p>
        ) : (
          rows.map((player) => (
            <div key={player.playerId}>
              <article
                className={cn(
                  "border-b border-border px-4 py-3 last:border-b-0 md:hidden",
                  player.rank === 1 && "bg-accent/30"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative flex w-7 shrink-0 items-center justify-center">
                    {player.rank === 1 ? (
                      <CrownDoodle className="absolute -left-0.5 -top-3 size-5 text-amber-400" />
                    ) : null}
                    <span className="font-serif text-xl font-bold text-foreground">
                      {player.rank}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-base",
                      player.tint
                    )}
                  >
                    {player.emoji}
                  </span>

                  <p className="min-w-0 flex-1 truncate font-semibold text-foreground">
                    {player.nickname}
                  </p>

                  <div className="shrink-0 text-right">
                    <p className="font-serif text-xl font-bold leading-none text-primary">
                      {player.points}
                    </p>
                    {player.delta !== 0 ? (
                      <p
                        className={cn(
                          "text-[10px] font-semibold",
                          player.delta >= 0 ? "text-brand-green" : "text-primary"
                        )}
                      >
                        {player.delta >= 0 ? `+${player.delta}` : player.delta}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3 pl-[4.25rem]">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Position
                    </span>
                    <LeagueFormArrows form={player.form} />
                  </div>
                  <div className="flex shrink-0 justify-end">
                    <ConsistencyPill consistency={player.consistency} />
                  </div>
                </div>
              </article>

              <div
                className={cn(
                  "hidden grid-cols-[4rem_1fr_7rem_7rem_8rem] items-center gap-2 border-b border-border px-5 py-4 last:border-b-0 md:grid",
                  player.rank === 1 && "bg-accent/30"
                )}
              >
                <div className="relative flex items-center">
                  {player.rank === 1 ? (
                    <CrownDoodle className="absolute -left-1 -top-4 size-6 text-amber-400" />
                  ) : null}
                  <span className="font-serif text-2xl font-bold text-foreground">
                    {player.rank}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-lg",
                      player.tint
                    )}
                  >
                    {player.emoji}
                  </span>
                  <p className="font-semibold text-foreground">{player.nickname}</p>
                </div>

                <div className="text-center">
                  <p className="font-serif text-2xl font-bold text-primary">{player.points}</p>
                  {player.delta !== 0 ? (
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        player.delta >= 0 ? "text-brand-green" : "text-primary"
                      )}
                    >
                      {player.delta >= 0 ? `+${player.delta}` : player.delta}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-center">
                  <LeagueFormArrows form={player.form} />
                </div>

                <div className="flex justify-center">
                  <ConsistencyPill consistency={player.consistency} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-accent/20 px-4 py-6 text-center md:px-6 md:py-8">
        <p className="text-sm text-muted-foreground">
          Log today&apos;s behaviours to update points and form.
        </p>
        <div className="flex w-full max-w-sm flex-col items-stretch gap-2 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
          <Button
            asChild
            className="h-11 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 sm:px-8"
          >
            <Link href="/stats" className="inline-flex items-center justify-center gap-2">
              <ClipboardList className="size-4 shrink-0" />
              Enter daily stats
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-primary px-6 text-sm font-bold text-primary hover:bg-primary/10 sm:px-8"
          >
            <Link href="/roster?add=1" className="inline-flex items-center justify-center gap-2">
              <UserPlus className="size-4 shrink-0" />
              Add new player
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
