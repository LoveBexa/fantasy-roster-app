"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUp, ArrowDown, ClipboardList } from "lucide-react"
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

const tabs: LeaguePeriod[] = ["Overall", "This Season", "This Month", "This Week"]

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

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
              active === tab
                ? "bg-primary text-primary-foreground"
                : "text-primary hover:bg-muted"
            }`}
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
        <div className="grid grid-cols-[3rem_1fr_5rem_5rem_6rem] gap-2 border-b border-border px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:grid-cols-[4rem_1fr_7rem_7rem_8rem]">
          <span>Rank</span>
          <span>Player (aka Date)</span>
          <span className="text-center">Points</span>
          <span className="text-center">Form</span>
          <span className="text-center">Consistency</span>
        </div>

        {isLoading ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">Loading league table...</p>
        ) : rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            No roster players yet. Add players and log daily stats to populate the league table.
          </p>
        ) : (
          rows.map((player) => (
            <div
              key={player.playerId}
              className={`grid grid-cols-[3rem_1fr_5rem_5rem_6rem] items-center gap-2 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[4rem_1fr_7rem_7rem_8rem] ${
                player.rank === 1 ? "bg-accent/30" : ""
              }`}
            >
              <div className="relative flex items-center">
                {player.rank === 1 ? (
                  <CrownDoodle className="absolute -left-1 -top-4 size-6 text-amber-400" />
                ) : null}
                <span className="font-serif text-2xl font-bold text-foreground">{player.rank}</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-lg ${player.tint}`}
                >
                  {player.emoji}
                </span>
                <p className="font-semibold text-foreground">{player.nickname}</p>
              </div>

              <div className="text-center">
                <p className="font-serif text-2xl font-bold text-primary">{player.points}</p>
                {player.delta !== 0 ? (
                  <p
                    className={`text-xs font-semibold ${
                      player.delta >= 0 ? "text-brand-green" : "text-primary"
                    }`}
                  >
                    {player.delta >= 0 ? `+${player.delta}` : player.delta}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-center gap-0.5">
                {player.form.length === 0 ? (
                  <span className="text-xs text-muted-foreground">—</span>
                ) : (
                  player.form.map((direction, index) =>
                    direction === "up" ? (
                      <ArrowUp key={index} className="size-4 text-brand-green" />
                    ) : (
                      <ArrowDown key={index} className="size-4 text-primary" />
                    )
                  )
                )}
              </div>

              <div className="flex justify-center">
                <span
                  className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                    player.consistency >= 50
                      ? "border-brand-green text-brand-green"
                      : "border-primary text-primary"
                  }`}
                >
                  {player.consistency}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-accent/20 px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Log today&apos;s behaviours to update points and form.
        </p>
        <Button
          asChild
          className="rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/stats">
            <ClipboardList />
            Enter daily stats
          </Link>
        </Button>
      </div>
    </section>
  )
}
