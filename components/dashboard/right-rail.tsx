import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarDoodle } from "@/components/doodles"

const entries = [
  { date: "May 17", label: "Great communication", pts: 10, positive: true },
  { date: "May 16", label: "Planned something", pts: 15, positive: true },
  { date: "May 15", label: "Late reply", pts: -5, positive: false },
  { date: "May 14", label: "Made me laugh", pts: 3, positive: true },
]

export function RightRail() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 border-l border-border bg-card/40 px-5 py-6 xl:flex">
      {/* Weekly summary */}
      <div className="rounded-2xl bg-accent/30 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Weekly Summary
        </p>
        <p className="mt-2 font-serif text-4xl font-bold text-primary">+18</p>
        <p className="text-sm text-muted-foreground">points</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">rank change</span>
          <span className="flex items-center font-semibold text-brand-green">
            <ArrowUp className="size-4" />2
          </span>
        </div>
      </div>

      {/* Recent entries */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Recent Entries
        </p>
        <ul className="mt-3 space-y-3">
          {entries.map((e) => (
            <li key={e.date} className="flex items-start gap-2">
              <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${e.positive ? "bg-brand-green" : "bg-primary"}`}
                aria-hidden
              />
              <div>
                <p className="text-xs text-muted-foreground">{e.date}</p>
                <p className="text-sm font-medium text-foreground">{e.label}</p>
                <p className={`text-xs font-semibold ${e.positive ? "text-brand-green" : "text-primary"}`}>
                  {e.pts > 0 ? `+${e.pts}` : e.pts} pts
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-4 w-full rounded-full border-border text-xs font-semibold">
          View History
        </Button>
      </div>

      {/* Pro tip */}
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
