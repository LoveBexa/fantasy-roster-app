import Image from "next/image"
import { ArrowDown, ArrowUp, Check } from "lucide-react"
import { CrownDoodle } from "@/components/doodles"
import { landingDashboard } from "@/lib/landing/landing-content"

function WavyUnderline({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 10" fill="none" aria-hidden className={className}>
      <path
        d="M2 7C30 2 60 9 100 5C140 2 170 8 198 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function statusClass(status: string) {
  if (status === "Active") return "bg-brand-green/20 text-brand-green"
  if (status === "Ghosted") return "bg-muted text-muted-foreground"
  return "bg-accent/40 text-foreground/80"
}

export function LandingDashboardPreview() {
  const { mvpCard, consistencyCard, redFlagsCard } = landingDashboard

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="lg:pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {landingDashboard.label}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {landingDashboard.heading}
          </h2>
          <WavyUnderline className="mt-3 h-2 w-40 text-primary" />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {landingDashboard.body}
          </p>
          <ul className="mt-6 space-y-3">
            {landingDashboard.checklist.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-medium text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[520px]">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl sm:p-5">
            <h3 className="font-serif text-xl font-bold text-primary">
              {landingDashboard.tableTitle}
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[0.6rem] font-bold uppercase tracking-wide text-muted-foreground">
                    {landingDashboard.tableColumns.map((col) => (
                      <th key={col} className="px-2 py-2 font-bold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {landingDashboard.players.map((player) => (
                    <tr key={player.name} className="border-b border-border/60 last:border-0">
                      <td className="px-2 py-3 font-serif text-lg font-bold">{player.rank}</td>
                      <td className="px-2 py-3">
                        <span className="flex items-center gap-2 font-medium text-foreground">
                          <span>{player.emoji}</span>
                          {player.name}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase ${statusClass(player.status)}`}
                        >
                          {player.status}
                        </span>
                      </td>
                      <td className="px-2 py-3 font-serif text-base font-bold text-primary">
                        {player.points}
                      </td>
                      <td className="px-2 py-3">
                        {player.trend === "up" ? (
                          <ArrowUp className="size-4 text-brand-green" />
                        ) : (
                          <ArrowDown className="size-4 text-destructive" />
                        )}
                      </td>
                      <td className="px-2 py-3 text-muted-foreground">{player.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="absolute -right-2 top-8 z-10 w-52 rounded-2xl border border-border bg-card p-4 shadow-lg sm:-right-6 sm:w-56">
            <p className="text-[0.6rem] font-bold uppercase tracking-wide text-muted-foreground">
              {mvpCard.title}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <CrownDoodle className="size-5 text-amber-400" />
              <span className="font-serif text-lg font-bold text-foreground">{mvpCard.player}</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-bold text-primary">+{mvpCard.points} pts</p>
            <p className="mt-2 text-[0.65rem] leading-snug text-muted-foreground">{mvpCard.note}</p>
            <Image
              src="/images/trophy.png"
              alt=""
              width={48}
              height={48}
              className="absolute -bottom-2 -right-2 size-12 object-contain opacity-90"
            />
          </div>

          <div className="absolute -left-2 bottom-16 z-10 w-48 rounded-2xl border border-border bg-accent/30 p-4 shadow-lg sm:-left-6 sm:w-52">
            <p className="text-[0.6rem] font-bold uppercase tracking-wide text-muted-foreground">
              {consistencyCard.title}
            </p>
            <p className="mt-2 font-serif text-4xl font-bold text-primary">{consistencyCard.score}%</p>
            <div className="mt-2 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`h-2 flex-1 rounded-full ${i < 4 ? "bg-primary" : "bg-primary/25"}`}
                />
              ))}
            </div>
            <p className="mt-2 text-[0.65rem] text-muted-foreground">{consistencyCard.label}</p>
          </div>

          <div className="absolute -right-1 bottom-0 z-10 w-52 rounded-2xl border border-border bg-brand-pink/30 p-4 shadow-lg sm:-right-4 sm:w-56">
            <p className="text-[0.6rem] font-bold uppercase tracking-wide text-muted-foreground">
              {redFlagsCard.title}
            </p>
            <p className="mt-1 font-serif text-3xl font-bold text-primary">
              {redFlagsCard.count}{" "}
              <span className="text-sm font-sans font-normal text-muted-foreground">
                {redFlagsCard.period}
              </span>
            </p>
            <ul className="mt-3 space-y-1.5">
              {redFlagsCard.items.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-[0.65rem] text-foreground/80">
                  <span className="mt-1 size-1 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
