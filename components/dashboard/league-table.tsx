"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUp, ArrowDown, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarDoodle, CrownDoodle } from "@/components/doodles"

type Player = {
  rank: number
  name: string
  lastDate: string
  points: number
  delta: number
  form: ("up" | "down")[]
  consistency: number
  emoji: string
  tint: string
}

const players: Player[] = [
  { rank: 1, name: "Ben S.", lastDate: "2 days ago", points: 245, delta: 32, form: ["up", "up", "up"], consistency: 82, emoji: "😎", tint: "bg-brand-pink/50" },
  { rank: 2, name: "Alex M.", lastDate: "5 days ago", points: 228, delta: 18, form: ["up", "up"], consistency: 74, emoji: "🫠", tint: "bg-accent/50" },
  { rank: 3, name: "Chris W.", lastDate: "1 week ago", points: 189, delta: 10, form: ["up"], consistency: 65, emoji: "🍀", tint: "bg-brand-green/40" },
  { rank: 4, name: "Tom H.", lastDate: "3 days ago", points: 151, delta: -5, form: ["down"], consistency: 48, emoji: "👻", tint: "bg-muted" },
  { rank: 5, name: "Jack R.", lastDate: "10 days ago", points: 120, delta: -12, form: ["down", "down"], consistency: 35, emoji: "🚩", tint: "bg-brand-pink/50" },
]

const tabs = ["Overall", "This Season", "This Month", "This Week"]

export function LeagueTable() {
  const [active, setActive] = useState("Overall")

  return (
    <section aria-labelledby="league-heading">
      <div className="flex items-center gap-3">
        <h2 id="league-heading" className="font-serif text-4xl font-bold tracking-tight text-primary">
          LEAGUE TABLE
        </h2>
        <StarDoodle className="size-9 text-brand-green" />
      </div>
      <p className="mt-2 font-script text-xl text-muted-foreground">
        Rank your dates. Track the stats. Don&apos;t settle. Win the league.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
              active === tab
                ? "bg-brand-green text-primary-foreground"
                : "text-primary hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        {/* header row */}
        <div className="grid grid-cols-[3rem_1fr_5rem_5rem_6rem] gap-2 border-b border-border px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground sm:grid-cols-[4rem_1fr_7rem_7rem_8rem]">
          <span>Rank</span>
          <span>Player (aka Date)</span>
          <span className="text-center">Points</span>
          <span className="text-center">Form</span>
          <span className="text-center">Consistency</span>
        </div>

        {players.map((p) => (
          <div
            key={p.rank}
            className={`grid grid-cols-[3rem_1fr_5rem_5rem_6rem] items-center gap-2 border-b border-border px-5 py-4 last:border-b-0 sm:grid-cols-[4rem_1fr_7rem_7rem_8rem] ${
              p.rank === 1 ? "bg-accent/30" : ""
            }`}
          >
            <div className="relative flex items-center">
              {p.rank === 1 && (
                <CrownDoodle className="absolute -left-1 -top-4 size-6 text-amber-400" />
              )}
              <span className="font-serif text-2xl font-bold text-foreground">{p.rank}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`flex size-10 items-center justify-center rounded-full text-lg ${p.tint}`}>
                {p.emoji}
              </span>
              <div>
                <p className="font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">Last date: {p.lastDate}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-primary">{p.points}</p>
              <p className={`text-xs font-semibold ${p.delta >= 0 ? "text-brand-green" : "text-primary"}`}>
                {p.delta >= 0 ? `+${p.delta}` : p.delta}
              </p>
            </div>

            <div className="flex items-center justify-center gap-0.5">
              {p.form.map((f, i) =>
                f === "up" ? (
                  <ArrowUp key={i} className="size-4 text-brand-green" />
                ) : (
                  <ArrowDown key={i} className="size-4 text-primary" />
                ),
              )}
            </div>

            <div className="flex justify-center">
              <span
                className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                  p.consistency >= 50
                    ? "border-brand-green text-brand-green"
                    : "border-primary text-primary"
                }`}
              >
                {p.consistency}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-accent/20 px-6 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Log today&apos;s behaviours to update points and form.
        </p>
        <Button
          asChild
          className="rounded-full bg-brand-green px-8 text-sm font-bold text-primary-foreground hover:bg-brand-green/90"
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
