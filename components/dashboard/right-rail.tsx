"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StarDoodle } from "@/components/doodles"
import { createClient } from "@/lib/supabase/client"
import {
  fetchRecentStatEntries,
  fetchWeeklyPointsTotal,
  type RecentStatEntry,
} from "@/lib/stats/stat-entries"

const RIGHT_RAIL_RECENT_LIMIT = 4

export function RightRail() {
  const [weeklyPoints, setWeeklyPoints] = useState<number | null>(null)
  const [recentEntries, setRecentEntries] = useState<RecentStatEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadRailData = useCallback(async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setWeeklyPoints(0)
        setRecentEntries([])
        return
      }

      const [weeklyTotal, { entries }] = await Promise.all([
        fetchWeeklyPointsTotal(supabase),
        fetchRecentStatEntries(supabase, RIGHT_RAIL_RECENT_LIMIT),
      ])

      setWeeklyPoints(weeklyTotal)
      setRecentEntries(entries)
    } catch {
      setWeeklyPoints(0)
      setRecentEntries([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadRailData()
  }, [loadRailData])

  const weeklyDisplay =
    weeklyPoints === null
      ? "—"
      : weeklyPoints >= 0
        ? `+${weeklyPoints}`
        : String(weeklyPoints)

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 border-l border-border bg-card/40 px-5 py-6 xl:flex">
      <div className="rounded-2xl bg-accent/30 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Weekly Summary
        </p>
        {isLoading ? (
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        ) : (
          <>
            <p
              className={`mt-2 font-serif text-4xl font-bold ${
                (weeklyPoints ?? 0) >= 0 ? "text-brand-green" : "text-primary"
              }`}
            >
              {weeklyDisplay}
            </p>
            <p className="text-sm text-muted-foreground">points this week</p>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Recent Entries
        </p>

        {isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
        ) : recentEntries.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No entries yet. Log stats to see activity here.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {recentEntries.map((entry) => {
              const isPositive = entry.totalPoints >= 0

              return (
                <li key={entry.id} className="flex items-start gap-2">
                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${
                      isPositive ? "bg-brand-green" : "bg-primary"
                    }`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{entry.entryDateShort}</p>
                    <p className="text-sm font-semibold text-foreground">
                      {entry.playerEmoji} {entry.playerNickname}
                    </p>
                    <p
                      className={`text-xs font-semibold ${
                        isPositive ? "text-brand-green" : "text-primary"
                      }`}
                    >
                      {entry.totalPoints >= 0 ? `+${entry.totalPoints}` : entry.totalPoints} pts
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <Button
          variant="outline"
          asChild
          className="mt-4 w-full rounded-full border-border text-xs font-semibold"
        >
          <Link href="/stats">View on Daily Stats</Link>
        </Button>
      </div>

      <div className="rounded-2xl bg-brand-pink/30 p-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Pro Tip</p>
          <StarDoodle className="size-4 text-primary" />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          Be honest with your data, not your delusions.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The numbers don&apos;t lie (he might).
        </p>
      </div>
    </aside>
  )
}
