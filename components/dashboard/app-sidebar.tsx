import {
  Trophy,
  Heart,
  Swords,
  ClipboardList,
  Sparkles,
  History,
  Award,
  LineChart,
  Settings,
} from "lucide-react"
import { HeartDoodle } from "@/components/doodles"

const navItems = [
  { label: "League Table", icon: Trophy, active: false },
  { label: "My Roster", icon: Heart, active: false },
  { label: "Matches", icon: Swords, active: false },
  { label: "Daily Stats", icon: ClipboardList, active: true },
  { label: "Scoring System", icon: Sparkles, active: false },
  { label: "History", icon: History, active: false },
  { label: "Awards", icon: Award, active: false },
  { label: "Insights", icon: LineChart, active: false },
  { label: "Settings", icon: Settings, active: false },
]

export function AppSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/60 px-4 py-6">
      <div className="px-2">
        <h2 className="font-serif text-2xl font-bold leading-none tracking-tight text-primary">
          LEVEL UP
        </h2>
        <p className="mt-1 text-xs font-semibold tracking-[0.3em] text-muted-foreground">
          ROSTER
        </p>
      </div>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              item.active
                ? "bg-accent/60 text-primary"
                : "text-foreground/80 hover:bg-muted"
            }`}
          >
            <item.icon className="size-5 shrink-0" />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto space-y-4 pt-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Today&apos;s Vibe
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            We track. We learn. We level up.
          </p>
          <HeartDoodle className="mt-1 size-5 text-primary" />
        </div>

        <div className="relative rotate-[-3deg] rounded-sm bg-brand-pink/70 p-4 shadow-sm">
          <span className="absolute -top-2 left-6 h-4 w-16 rotate-2 bg-amber-200/70" aria-hidden />
          <p className="font-script text-xl leading-tight text-primary">
            REMEMBER: NOT PERSONAL, JUST DATA.
          </p>
        </div>
      </div>
    </aside>
  )
}
