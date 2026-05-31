"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { CalendarDays, Heart, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HeartDoodle } from "@/components/doodles"
import { FormChart } from "@/components/dashboard/form-chart"
import { PageHeader } from "@/components/dashboard/page-header"
import { RecentActivityLog } from "@/components/dashboard/recent-activity-log"
import { createClient } from "@/lib/supabase/client"
import { getErrorMessage } from "@/lib/supabase/errors"
import { fetchRosterPlayers } from "@/lib/roster/players"
import type { Player } from "@/components/roster/roster-types"
import { getBehaviorIcon } from "@/lib/stats/behavior-icons"
import {
  deleteStatEntry,
  fetchPlayerEntryPointsForDate,
  fetchPlayerWeeklyForm,
  fetchRecentStatEntries,
  fetchScoringBehaviors,
  saveStatEntry,
  type FormChartPoint,
  type RecentStatEntry,
  type ScoringBehaviorRow,
} from "@/lib/stats/stat-entries"

function todayIsoDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const emptyWeek: FormChartPoint[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - 6 + i)
  return {
    day: date.toLocaleDateString("en-US", { weekday: "narrow" }),
    value: 0,
  }
})

export function DailyStatInput() {
  const notesRef = useRef<HTMLTextAreaElement>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [behaviors, setBehaviors] = useState<ScoringBehaviorRow[]>([])
  const [selectedPlayerId, setSelectedPlayerId] = useState("")
  const [entryDate, setEntryDate] = useState(todayIsoDate)
  const [selectedBehaviorIds, setSelectedBehaviorIds] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [weeklyForm, setWeeklyForm] = useState<FormChartPoint[]>(emptyWeek)
  const [recentEntries, setRecentEntries] = useState<RecentStatEntry[]>([])
  const [recentTotalCount, setRecentTotalCount] = useState(0)
  const [isLoadingRecent, setIsLoadingRecent] = useState(true)
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null)
  const [savedDayPoints, setSavedDayPoints] = useState(0)
  const [isLoadingDayPoints, setIsLoadingDayPoints] = useState(false)

  const loadSavedDayPoints = useCallback(async (playerId: string, date: string) => {
    if (!playerId) {
      setSavedDayPoints(0)
      return
    }

    setIsLoadingDayPoints(true)

    try {
      const supabase = createClient()
      const points = await fetchPlayerEntryPointsForDate(supabase, playerId, date)
      setSavedDayPoints(points)
    } catch {
      setSavedDayPoints(0)
    } finally {
      setIsLoadingDayPoints(false)
    }
  }, [])

  const loadWeeklyForm = useCallback(async (playerId: string) => {
    if (!playerId) {
      setWeeklyForm(emptyWeek)
      return
    }

    try {
      const supabase = createClient()
      const points = await fetchPlayerWeeklyForm(supabase, playerId)
      setWeeklyForm(points)
    } catch {
      setWeeklyForm(emptyWeek)
    }
  }, [])

  const loadRecentEntries = useCallback(async () => {
    setIsLoadingRecent(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setRecentEntries([])
        setRecentTotalCount(0)
        return
      }

      const { entries, totalCount } = await fetchRecentStatEntries(supabase)
      setRecentEntries(entries)
      setRecentTotalCount(totalCount)
    } catch {
      setRecentEntries([])
      setRecentTotalCount(0)
    } finally {
      setIsLoadingRecent(false)
    }
  }, [])

  const loadData = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Sign in to log daily stats.")
        return
      }

      const [playerRows, behaviorRows] = await Promise.all([
        fetchRosterPlayers(supabase),
        fetchScoringBehaviors(supabase),
      ])

      setPlayers(playerRows)
      setBehaviors(behaviorRows)
      setSelectedPlayerId((current) => current || playerRows[0]?.id || "")
      await loadRecentEntries()
    } catch (err) {
      setError(getErrorMessage(err, "Could not load stat input data."))
    } finally {
      setIsLoading(false)
    }
  }, [loadRecentEntries])

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => {
    void loadWeeklyForm(selectedPlayerId)
  }, [selectedPlayerId, loadWeeklyForm])

  useEffect(() => {
    void loadSavedDayPoints(selectedPlayerId, entryDate)
  }, [selectedPlayerId, entryDate, loadSavedDayPoints])

  const selectedPlayer = players.find((p) => p.id === selectedPlayerId)

  const draftPointsImpact = useMemo(() => {
    return selectedBehaviorIds.reduce((sum, id) => {
      const behavior = behaviors.find((b) => b.id === id)
      return sum + (behavior?.points ?? 0)
    }, 0)
  }, [behaviors, selectedBehaviorIds])

  const isDraftingEntry = selectedBehaviorIds.length > 0
  const displayPoints = isDraftingEntry ? draftPointsImpact : savedDayPoints
  const pointsImpactLabel =
    entryDate === todayIsoDate() ? "Today's Points Impact" : "Points Impact"

  const toggleBehavior = (behaviorId: string) => {
    setSelectedBehaviorIds((prev) =>
      prev.includes(behaviorId)
        ? prev.filter((id) => id !== behaviorId)
        : [...prev, behaviorId]
    )
  }

  const focusNotes = () => {
    notesRef.current?.focus()
    notesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const handleSave = async () => {
    setError(null)
    setSuccessMessage(null)

    if (!selectedPlayerId) {
      setError("Select a player first.")
      return
    }

    if (selectedBehaviorIds.length === 0) {
      setError("Select at least one behaviour.")
      return
    }

    setIsSaving(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Sign in to save entries.")
        return
      }

      await saveStatEntry(supabase, user.id, {
        player_id: selectedPlayerId,
        entry_date: entryDate,
        notes: notes.trim() || null,
        behavior_ids: selectedBehaviorIds,
        total_points: draftPointsImpact,
      })

      setSuccessMessage("Entry saved! Your stats are in the league.")
      setSelectedBehaviorIds([])
      setNotes("")
      await Promise.all([
        loadWeeklyForm(selectedPlayerId),
        loadRecentEntries(),
        loadSavedDayPoints(selectedPlayerId, entryDate),
      ])
    } catch (err) {
      setError(getErrorMessage(err, "Could not save entry."))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    setError(null)
    setDeletingEntryId(entryId)

    try {
      const supabase = createClient()
      await deleteStatEntry(supabase, entryId)
      await Promise.all([
        loadRecentEntries(),
        loadWeeklyForm(selectedPlayerId),
        loadSavedDayPoints(selectedPlayerId, entryDate),
      ])
      setSuccessMessage("Entry deleted.")
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete entry."))
    } finally {
      setDeletingEntryId(null)
    }
  }

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading daily stat input...</p>
    )
  }

  return (
    <TooltipProvider>
      <section aria-labelledby="daily-stat-heading" className="space-y-6">
        <PageHeader
          id="daily-stat-heading"
          title="DAILY STAT INPUT"
          subtitle="Log the tea. Earn the points. See the pattern."
          icon={<HeartDoodle className="size-8 text-primary" />}
          action={
            <div className="space-y-1">
              <Label htmlFor="entry-date" className="text-xs font-bold uppercase tracking-wide">
                Entry date
              </Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="entry-date"
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="h-10 rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>
          }
        />

        {successMessage ? (
          <p
            className="rounded-lg border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green"
            role="status"
          >
            {successMessage}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="player-select" className="text-xs font-bold uppercase tracking-wide">
                Player
              </Label>
              <select
                id="player-select"
                value={selectedPlayerId}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              >
                <option value="">Select a player</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.emoji} {player.nickname}
                  </option>
                ))}
              </select>
            </div>

            {selectedPlayer ? (
              <div className="flex items-center gap-4">
                <span className="flex size-16 items-center justify-center rounded-full bg-brand-pink/40 text-3xl">
                  {selectedPlayer.emoji}
                </span>
                <div>
                  <p className="font-serif text-xl font-bold text-foreground">
                    {selectedPlayer.nickname}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedPlayer.description}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-green">
                    {selectedPlayer.status}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 grid gap-6 rounded-xl bg-accent/30 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {pointsImpactLabel}
              </p>
              {isLoadingDayPoints && !isDraftingEntry ? (
                <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
              ) : (
                <>
                  <p
                    className={`mt-1 font-serif text-5xl font-bold ${
                      displayPoints >= 0 ? "text-brand-green" : "text-primary"
                    }`}
                  >
                    {displayPoints >= 0 ? "+" : ""}
                    {displayPoints} <span className="text-lg font-semibold">PTS</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isDraftingEntry
                      ? "Selected behaviours (unsaved)"
                      : savedDayPoints !== 0
                        ? "Saved for this date"
                        : "No entry saved for this date yet"}
                  </p>
                </>
              )}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Form (Last 7 Days)
              </p>
              <FormChart data={weeklyForm} />
            </div>
          </div>
        </div>

        {players.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-accent/20 px-6 py-6">
            <p className="text-sm text-muted-foreground">
              Add roster players first before logging stats.
            </p>
            <Button
              asChild
              className="rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/roster">
                <Heart />
                Add players to roster
              </Link>
            </Button>
          </div>
        ) : null}

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
            What Happened Today?
          </h3>
          <p className="mt-1 text-sm font-semibold text-primary">Select all that apply</p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {behaviors.map((behavior) => {
              const isSelected = selectedBehaviorIds.includes(behavior.id)
              const isNegative = behavior.points < 0
              const Icon = getBehaviorIcon(behavior.category, behavior.behavior)

              return (
                <Tooltip key={behavior.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => toggleBehavior(behavior.id)}
                      aria-pressed={isSelected}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                        isSelected
                          ? "border-foreground/40 bg-accent/60 ring-2 ring-foreground/20"
                          : "border-border hover:border-foreground/30"
                      } ${isNegative ? "bg-brand-pink/25" : "bg-card"}`}
                    >
                      {isSelected ? (
                        <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          ✓
                        </span>
                      ) : null}
                      <Icon
                        className={`size-6 ${isNegative ? "text-primary" : "text-foreground/70"}`}
                      />
                      <span className="text-xs font-bold uppercase leading-tight text-foreground">
                        {behavior.behavior}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          isNegative ? "text-primary" : "text-brand-green"
                        }`}
                      >
                        {behavior.points > 0 ? `+${behavior.points}` : behavior.points} pts
                      </span>
                    </button>
                  </TooltipTrigger>
                  {behavior.description ? (
                    <TooltipContent side="top" className="max-w-xs">
                      {behavior.description}
                    </TooltipContent>
                  ) : null}
                </Tooltip>
              )
            })}

            <button
              type="button"
              onClick={focusNotes}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-4 text-center hover:border-foreground/30"
            >
              <Pencil className="size-6 text-foreground/70" />
              <span className="text-xs font-bold uppercase text-foreground">Other / Notes</span>
              <span className="text-xs text-muted-foreground">Add custom</span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="text-sm font-bold uppercase tracking-wide text-foreground">
            Notes (Optional)
          </label>
          <div className="relative mt-2">
            <textarea
              ref={notesRef}
              id="notes"
              value={notes}
              maxLength={250}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any context... the vibes, the tea, the details."
              className="h-28 w-full resize-none rounded-xl border border-border bg-card p-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
            />
            <span className="absolute bottom-3 right-4 text-xs text-muted-foreground">
              {notes.length}/250
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            className="rounded-full border-primary px-8 text-sm font-semibold text-primary hover:bg-primary/5"
            onClick={() => {
              setSelectedBehaviorIds([])
              setNotes("")
              setSuccessMessage(null)
              setError(null)
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSaving || players.length === 0}
            onClick={() => void handleSave()}
            className="rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? "Saving..." : "Save Entry"}
          </Button>
        </div>

        <RecentActivityLog
          entries={recentEntries}
          totalCount={recentTotalCount}
          isLoading={isLoadingRecent}
          onDelete={handleDeleteEntry}
          deletingEntryId={deletingEntryId}
        />
      </section>
    </TooltipProvider>
  )
}
