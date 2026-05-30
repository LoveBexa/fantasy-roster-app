"use client"

import { useState } from "react"
import Image from "next/image"
import {
  CalendarDays,
  ChevronDown,
  CalendarCheck,
  MessageCircleHeart,
  Star,
  CircleCheck,
  Smile,
  Sun,
  MessagesSquare,
  Send,
  Clock,
  MessageCircleDashed,
  CircleX,
  CloudFog,
  Thermometer,
  Ghost,
  Pencil,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeartDoodle, ArrowDoodle } from "@/components/doodles"
import { FormChart } from "@/components/dashboard/form-chart"

type Stat = {
  id: string
  label: string
  pts: number
  icon: React.ComponentType<{ className?: string }>
  sub?: string
}

const positives: Stat[] = [
  { id: "planned", label: "Planned Something", pts: 15, icon: CalendarCheck },
  { id: "great-comm", label: "Great Communication", pts: 10, icon: MessageCircleHeart },
  { id: "detail", label: "Remembered Little Detail", pts: 5, icon: Star },
  { id: "followed", label: "Followed Through", pts: 5, icon: CircleCheck },
  { id: "laugh", label: "Made Me Laugh", pts: 3, icon: Smile },
  { id: "morning", label: "Good Morning Text", pts: 2, icon: Sun },
  { id: "checkin", label: "Consistent Check-ins", pts: 3, icon: MessagesSquare },
  { id: "initiated", label: "Initiated Plans", pts: 5, icon: Send },
]

const negatives: Stat[] = [
  { id: "late", label: "Late Reply", sub: "(> 6 HRS)", pts: -5, icon: Clock },
  { id: "dry", label: "Dry Conversation", pts: -5, icon: MessageCircleDashed },
  { id: "cancelled", label: "Cancelled Last Minute", pts: -15, icon: CircleX },
  { id: "distant", label: "Felt Distant", pts: -10, icon: CloudFog },
  { id: "hotcold", label: "Hot & Cold Behaviour", pts: -10, icon: Thermometer },
  { id: "ghosted", label: "Ghosted", pts: -20, icon: Ghost },
]

const allStats = [...positives, ...negatives]

export function DailyStatInput() {
  const [selected, setSelected] = useState<string[]>(["planned"])
  const [notes, setNotes] = useState("")

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )

  return (
    <section aria-labelledby="daily-stat-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1
              id="daily-stat-heading"
              className="font-serif text-4xl font-bold tracking-tight text-primary"
            >
              DAILY STAT INPUT
            </h1>
            <HeartDoodle className="size-8 text-primary" />
          </div>
          <p className="mt-2 font-script text-xl text-muted-foreground">
            Log the tea. Earn the points. See the pattern.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button className="gap-2 rounded-full bg-brand-green text-xs font-bold uppercase tracking-wide text-primary-foreground hover:bg-brand-green/90">
            Select Date
            <CalendarDays className="size-4" />
          </Button>
          <button className="flex items-center gap-1 text-sm text-foreground">
            May 18, 2026 <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Profile card */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex items-start gap-4">
            <Image
              src="/images/alex-avatar.png"
              alt="Alex M. profile"
              width={88}
              height={88}
              className="size-20 rounded-full object-cover"
            />
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Alex M.</h2>
              <p className="text-sm text-muted-foreground">@coffeeandconvos</p>
              <p className="mt-1 text-sm text-muted-foreground">Last date: May 16, 2026</p>
              <span className="mt-2 inline-block rounded-full bg-brand-green px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                Active
              </span>
              <div className="mt-3 flex items-center gap-1 text-muted-foreground">
                <span className="font-script text-base">he&apos;s cute but inconsistent</span>
                <ArrowDoodle className="size-6" />
              </div>
            </div>
            <Button variant="outline" className="ml-2 rounded-full border-border bg-card text-xs font-semibold">
              View Profile
            </Button>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-6 rounded-xl bg-accent/30 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Today&apos;s Points Impact
              </p>
              <p className="mt-1 font-serif text-5xl font-bold text-primary">
                +12 <span className="text-lg font-semibold">PTS</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">This week: +18 pts</p>
              <p className="text-sm text-muted-foreground">Season total: 228 pts</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Form (Last 7 Days)
              </p>
              <FormChart />
            </div>
          </div>
        </div>
      </div>

      {/* What happened today */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          What Happened Today?
        </h3>
        <p className="mt-1 text-sm font-semibold text-primary">Select all that apply</p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {allStats.map((stat) => {
            const isSelected = selected.includes(stat.id)
            const isNegative = stat.pts < 0
            return (
              <button
                key={stat.id}
                type="button"
                onClick={() => toggle(stat.id)}
                aria-pressed={isSelected}
                className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all ${
                  isSelected
                    ? "border-foreground/40 ring-2 ring-foreground/20"
                    : "border-border hover:border-foreground/30"
                } ${isNegative ? "bg-brand-pink/25" : "bg-card"}`}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-brand-green text-[10px] text-primary-foreground">
                    ✓
                  </span>
                )}
                <stat.icon
                  className={`size-6 ${isNegative ? "text-primary" : "text-foreground/70"}`}
                />
                <span className="text-xs font-bold uppercase leading-tight text-foreground">
                  {stat.label}
                  {stat.sub && <span className="block font-medium normal-case">{stat.sub}</span>}
                </span>
                <span
                  className={`text-xs font-semibold ${isNegative ? "text-primary" : "text-brand-green"}`}
                >
                  {stat.pts > 0 ? `+${stat.pts}` : stat.pts} pts
                </span>
              </button>
            )
          })}
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-4 text-center hover:border-foreground/30"
          >
            <Pencil className="size-6 text-foreground/70" />
            <span className="text-xs font-bold uppercase text-foreground">Other / Notes</span>
            <span className="text-xs text-muted-foreground">Add custom</span>
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-8">
        <label htmlFor="notes" className="text-sm font-bold uppercase tracking-wide text-foreground">
          Notes (Optional)
        </label>
        <div className="relative mt-2">
          <textarea
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

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" className="rounded-full border-primary px-8 text-sm font-semibold text-primary hover:bg-primary/5">
          Cancel
        </Button>
        <Button className="rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90">
          Save Entry
        </Button>
      </div>
    </section>
  )
}
