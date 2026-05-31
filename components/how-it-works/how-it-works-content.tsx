import Link from "next/link"
import Image from "next/image"
import {
  Check,
  ChevronRight,
  ClipboardList,
  Heart,
  Shield,
  TrendingUp,
  Trophy,
  UserPlus,
} from "lucide-react"
import { StarDoodle } from "@/components/doodles"
import { Button } from "@/components/ui/button"

const steps = [
  {
    number: 1,
    title: "Add players to your roster",
    icon: UserPlus,
    body: "Add the people you're dating. Give them a nickname, status, and emoji.",
    example: "Hammer Toe Tom. 🦶",
  },
  {
    number: 2,
    title: "Log daily behaviour",
    icon: ClipboardList,
    body: "Each day, log what happened — good or bad. Select behaviours and track the facts.",
    example: "Great communication +10",
  },
  {
    number: 3,
    title: "Earn & lose points",
    icon: TrendingUp,
    body: "Positive actions add points. Red flags subtract them. Good intentions don't earn points — actions do.",
    example: "Planned a date +15 · Ghosted -20",
  },
  {
    number: 4,
    title: "Rank your roster",
    icon: Trophy,
    body: "See who consistently shows up and who falls behind.",
    example: "Standings update as you log",
  },
  {
    number: 5,
    title: "Find your MVP",
    icon: Trophy,
    body: "The data reveals who's really performing — so you can stop over-investing in people who aren't showing up.",
    example: "Choose smarter, not harder",
  },
] as const

const proTips = [
  "Be honest. The data doesn't lie.",
  "Log consistently. Patterns appear.",
  "Compare players side by side. Stats don't.",
  "Track form over time, not just big moments.",
  "Stay strategic. Emotion still matters — clarity helps you decide.",
] as const

const fantasyComparison = [
  { fantasy: "Draft players", roster: "Add players to your roster" },
  { fantasy: "Pick starters", roster: "Log daily behaviour" },
  { fantasy: "Score on stats", roster: "Earn & lose points" },
  { fantasy: "Climb rankings", roster: "Rank your roster" },
  { fantasy: "Find your starter", roster: "Find your MVP" },
] as const

function StepPodiumIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 20h16" />
      <path d="M8 20V12H4v8" />
      <path d="M16 20V8h4v12" />
      <path d="M12 20V14H8v6" />
      <text x="7" y="11" fontSize="5" fill="currentColor" stroke="none" fontWeight="bold">
        2
      </text>
      <text x="11" y="13" fontSize="5" fill="currentColor" stroke="none" fontWeight="bold">
        1
      </text>
      <text x="17" y="7" fontSize="5" fill="currentColor" stroke="none" fontWeight="bold">
        3
      </text>
    </svg>
  )
}

export function HowItWorksContent() {
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="how-heading"
        className="overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="border-b border-border px-8 py-8">
          <div className="flex items-center gap-3">
            <h1
              id="how-heading"
              className="font-serif text-4xl font-bold tracking-tight text-primary"
            >
              HOW THE ROSTER WORKS
            </h1>
            <StarDoodle className="size-8 text-primary" />
          </div>
          <p className="mt-2 font-script text-xl text-muted-foreground">
            Your dating life. Organized. Tracked. Ranked.
          </p>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-10 lg:px-10">
            <p className="font-serif text-2xl font-bold leading-snug text-foreground">
              The Roster is your Dating-esque Fantasy League.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A dating roster (or "roster dating") is the modern practice of actively dating multiple people at the same time. Instead of putting all your "eggs in one basket" and focusing on a single person right away,
             you keep a casual rotation of suitors while you figure out who is the best long term match
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This tool will help you draft. Help you track. And let your rosters score points. It will rank your roster in order to help you find your highest performer. 
            It&apos;s
              strategic dating that's backed by data, not drama.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-background px-5 py-4">
              <div className="flex items-start gap-3">
                <Trophy className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">You&apos;re the GM.</span>{" "}
                  Build your roster. Read the patterns. Protect your energy.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button
                asChild
                className="h-12 rounded-full bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/signup">Sign up free</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-h-72 bg-accent/40 lg:min-h-full">
            <Image
              src="/images/women-looking-phone.png"
              alt="Women reviewing their roster on a phone"
              width={700}
              height={520}
              className="h-full min-h-72 w-full object-cover lg:min-h-full"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="steps-heading">
        <h2
          id="steps-heading"
          className="text-sm font-bold uppercase tracking-wide text-primary"
        >
          How it works (step by step)
        </h2>

        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-stretch">
          {steps.map((step, index) => {
            const Icon =
              step.number === 4 ? StepPodiumIcon : step.icon

            return (
              <div key={step.number} className="flex min-w-0 flex-1 items-center gap-2">
                <article className="relative flex h-full min-w-0 flex-1 flex-col rounded-2xl border border-border bg-card px-5 pb-5 pt-8">
                  <span className="absolute left-4 top-4 flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {step.number}
                  </span>
                  <Icon className="mx-auto size-8 text-foreground/70" strokeWidth={1.5} />
                  <h3 className="mt-4 text-center text-xs font-bold uppercase leading-snug tracking-wide text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 flex-1 text-center text-xs leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                  <div className="mt-4 text-center">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                      Example:
                    </p>
                    <span className="mt-1 inline-block rounded-full border border-border bg-accent/40 px-3 py-1 text-xs font-medium text-foreground">
                      {step.example}
                    </span>
                  </div>
                </article>

                {index < steps.length - 1 ? (
                  <ChevronRight
                    className="hidden size-5 shrink-0 text-muted-foreground xl:block"
                    aria-hidden
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card px-8 py-10 lg:grid lg:grid-cols-2 lg:gap-12">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Pro tips</h2>
          <ul className="mt-6 space-y-4">
            {proTips.map((tip) => (
              <li key={tip} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {tip}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-border bg-accent/30 px-5 py-4">
            <div className="flex items-start gap-3">
              <StarDoodle className="size-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
              It's not about winning. It's about choosing better.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
            Think fantasy sports, but make it dating
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Fantasy football
              </p>
              <ul className="mt-3 space-y-3">
                {fantasyComparison.map((row) => (
                  <li
                    key={row.fantasy}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    {row.fantasy}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                The Roster
              </p>
              <ul className="mt-3 space-y-3">
                {fantasyComparison.map((row) => (
                  <li
                    key={row.roster}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-2.5" strokeWidth={3} />
                    </span>
                    {row.roster}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-3">
            <Trophy className="mt-0.5 size-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Different game. Same clarity.{" "}
              <span className="font-semibold text-primary">Better decisions.</span>
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-accent/30 px-6 py-5">
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <span className="relative flex size-6 shrink-0 items-center justify-center">
            <Shield className="size-6 text-primary" aria-hidden />
            <Heart
              className="absolute bottom-0 right-0 size-2.5 fill-primary text-primary"
              aria-hidden
            />
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The Roster gives you clarity, confidence and control in the game of dating.{" "}
            <span className="font-semibold text-primary">
              Track smarter. Date better. Choose wisely.
            </span>
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center gap-3 pb-4 pt-2">
        <Button
          asChild
          className="rounded-full bg-primary px-10 py-6 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/signup">Sign up — it&apos;s free</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          Continue with Google. Start building your roster in minutes.
        </p>
      </div>
    </div>
  )
}
