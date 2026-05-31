"use client"

import { useEffect, useState } from "react"
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  X,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { RecentStatEntry } from "@/lib/stats/stat-entries"

type RecentActivityLogProps = {
  entries: RecentStatEntry[]
  totalCount: number
  isLoading: boolean
  onDelete: (entryId: string) => Promise<void>
  deletingEntryId: string | null
}

function behaviorSummary(entry: RecentStatEntry) {
  if (entry.behaviors.length === 0) return "No behaviours recorded"
  return entry.behaviors.map((b) => b.behavior).join(" • ")
}

export function RecentActivityLog({
  entries,
  totalCount,
  isLoading,
  onDelete,
  deletingEntryId,
}: RecentActivityLogProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<RecentStatEntry | null>(null)

  useEffect(() => {
    const scrollToSection = () => {
      if (window.location.hash !== "#recent-activity-log") return
      document
        .getElementById("recent-activity-log")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    scrollToSection()
    const retryTimer = window.setTimeout(scrollToSection, 150)
    window.addEventListener("hashchange", scrollToSection)

    return () => {
      window.clearTimeout(retryTimer)
      window.removeEventListener("hashchange", scrollToSection)
    }
  }, [isLoading])

  const displayedCount = entries.length
  const showingLabel =
    totalCount <= 10
      ? `Showing ${displayedCount} of ${totalCount} ${totalCount === 1 ? "entry" : "entries"}`
      : `Showing ${displayedCount} of ${totalCount} entries`

  return (
    <section
      id="recent-activity-log"
      aria-labelledby="recent-activity-heading"
      className="scroll-mt-8 rounded-2xl border border-border bg-accent/25 p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2
            id="recent-activity-heading"
            className="font-serif text-2xl font-bold tracking-tight text-primary"
          >
            RECENT ACTIVITY LOG
          </h2>
          <p className="mt-1 font-script text-xl text-primary/90">
            The receipts. The evidence. The pattern.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Last 10 entries
          </span>
          <div className="flex gap-1" aria-hidden>
            {entries.map((entry) => (
              <span
                key={entry.id}
                className={`size-2.5 rounded-full ${
                  entry.totalPoints >= 0 ? "bg-brand-green" : "bg-primary"
                }`}
              />
            ))}
            {Array.from({ length: Math.max(0, 10 - entries.length) }).map((_, i) => (
              <span
                key={`empty-${i}`}
                className="size-2.5 rounded-full border border-border bg-card"
              />
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Loading recent entries...
        </p>
      ) : entries.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No stat entries yet. Save your first entry above to see it here.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {entries.map((entry) => {
            const isExpanded = expandedId === entry.id
            const isPositive = entry.totalPoints >= 0
            const isDeleting = deletingEntryId === entry.id

            return (
              <li
                key={entry.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                  className="grid w-full grid-cols-[5.5rem_1fr_auto_auto] items-center gap-3 px-4 py-4 text-left sm:grid-cols-[6rem_1fr_1.5fr_auto] sm:gap-4 sm:px-5"
                  aria-expanded={isExpanded}
                >
                  <div>
                    <p
                      className={`font-serif text-2xl font-bold sm:text-3xl ${
                        isPositive ? "text-brand-green" : "text-primary"
                      }`}
                    >
                      {entry.totalPoints >= 0 ? "+" : ""}
                      {entry.totalPoints} pts
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isPositive
                          ? "border-brand-green/40 text-brand-green"
                          : "border-primary/40 text-primary"
                      }`}
                    >
                      {isPositive ? "Positive" : "Negative"}
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-pink/40 text-2xl sm:size-12">
                      {entry.playerEmoji}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {entry.playerNickname}
                      </p>
                      <p className="text-sm text-muted-foreground">{entry.entryDate}</p>
                    </div>
                  </div>

                  <p className="hidden truncate text-sm text-muted-foreground sm:block">
                    {behaviorSummary(entry)}
                  </p>

                  <span className="flex size-8 items-center justify-center text-muted-foreground">
                    {isExpanded ? (
                      <ChevronUp className="size-5" />
                    ) : (
                      <ChevronDown className="size-5" />
                    )}
                  </span>
                </button>

                {isExpanded ? (
                  <div className="border-t border-border/60 bg-accent/15 px-4 py-5 sm:px-5">
                    <p className="mb-4 truncate text-sm text-muted-foreground sm:hidden">
                      {behaviorSummary(entry)}
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Selected behaviours
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {entry.behaviors.map((behavior) => {
                            const isNegative = behavior.points < 0

                            return (
                              <li
                                key={`${entry.id}-${behavior.behavior}`}
                                className="flex items-start gap-2 text-sm text-foreground"
                              >
                                {isNegative ? (
                                  <X className="mt-0.5 size-4 shrink-0 text-primary" />
                                ) : (
                                  <Check className="mt-0.5 size-4 shrink-0 text-brand-green" />
                                )}
                                <span>{behavior.behavior}</span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Notes
                        </h3>
                        <p className="mt-3 min-h-[4rem] rounded-lg border border-border bg-card/80 p-4 font-script text-lg leading-snug text-foreground">
                          {entry.notes?.trim() ? entry.notes : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end border-t border-border/40 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isDeleting}
                        className="rounded-full border-destructive/40 text-destructive hover:bg-destructive/10"
                        onClick={() => setPendingDelete(entry)}
                      >
                        <Trash2 className="size-4" />
                        {isDeleting ? "Deleting..." : "Delete entry"}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4 shrink-0" />
          {showingLabel}
        </p>
        <span
          className="text-xs font-bold uppercase tracking-wide text-muted-foreground/50"
          aria-disabled="true"
          title="Full history coming soon"
        >
          View full history (only available for paid users) →
        </span>
      </div>

      {pendingDelete ? (
        <AlertDialog open onOpenChange={(open) => !open && setPendingDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-xl text-primary">
                Delete this entry?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This removes the stat entry for{" "}
                <span className="font-medium text-foreground">
                  {pendingDelete.playerEmoji} {pendingDelete.playerNickname}
                </span>{" "}
                on {pendingDelete.entryDate}. Points and league rankings will update.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button
                variant="outline"
                onClick={() => setPendingDelete(null)}
                disabled={deletingEntryId === pendingDelete.id}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deletingEntryId === pendingDelete.id}
                onClick={() => {
                  void onDelete(pendingDelete.id).then(() => {
                    setPendingDelete(null)
                    if (expandedId === pendingDelete.id) {
                      setExpandedId(null)
                    }
                  })
                }}
              >
                {deletingEntryId === pendingDelete.id ? "Deleting..." : "Delete entry"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </section>
  )
}
