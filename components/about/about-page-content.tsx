import Link from "next/link"
import {
  BarChart3,
  Check,
  ClipboardList,
  Heart,
  Mail,
  MapPin,
  TrendingUp,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import { HeartDoodle, StarDoodle } from "@/components/doodles"
import { HeroStickyNote } from "@/components/hero-sticky-note"
import { Button } from "@/components/ui/button"

const pillars = [
  {
    title: "The Concept",
    icon: BarChart3,
    body: "It came from literally a Whatsapp chat. Hearing all the stories of women who were fed up with dating multiple half-assed people over and over again.",
  },
  {
    title: "The Metrics",
    icon: ClipboardList,
    body: "Tracking the data data provides patterns and insights that help you make better decisions.",
  },
  {
    title: "The Roster",
    icon: Heart,
    body: "A dating roster is just a list of people you're dating. Everyone on dating apps is on a roster. If you're app dating you're probably on someone else's roster already.",
  },
  {
    title: "The Insights",
    icon: TrendingUp,
    body: "Over time, patterns become visible. Everyone tracks their dates in their own ways. We just made it easier to log to analyse this data.",
  },
  {
    title: "The Decision",
    icon: Trophy,
    body: "You're not settling. You're strategising. And you're making informed decisions based on the data.",
  },
] as const

const manifestoItems = [
  "Helping smart women trust their instincts.",
  "No more ignoring red flags.",
  "No more chasing inconsistent effort.",
  "Choose people who choose you.",
] as const

export function AboutPageContent() {
  return (
    <div className="space-y-6">
      <section
        aria-labelledby="about-heading"
        className="overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="border-b border-border px-8 py-8">
          <div className="flex items-center gap-3">
            <h1
              id="about-heading"
              className="font-serif text-4xl font-bold tracking-tight text-primary"
            >
              ABOUT THE ROSTER
            </h1>
            <StarDoodle className="size-8 text-primary" />
          </div>
          <p className="mt-2 font-script text-xl text-muted-foreground">
            Track the patterns. See the red flags. Know who&apos;s actually winning.
          </p>
        </div>

        <div className="grid lg:grid-cols-2">
          <div
            id="why-heading"
            className="flex flex-col justify-center px-8 py-10 lg:px-10"
          >
            <p className="font-serif text-2xl font-bold leading-snug text-foreground">
              Why We Built This
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Dating shouldn&apos;t feel like guesswork. Why sit in ambiguity when you can take action? The Roster [Fantasy League] turns your love life
              into a league you can actually use to make decisions. Log stats, check patterns, and gain clarity instead
              of confusion.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We built this for women who want to date smarter, not harder. Track effort.
              Spot inconsistency. Make decisions based on data, not drama.
            </p>

            <div className="mt-6">
              <Button
                asChild
                className="h-12 rounded-full bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/signup">Sign up free</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-[700/520] w-full overflow-hidden bg-accent/40">
            <Image
              src="/images/four-women.png"
              alt="Four confident women posing together"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section aria-label="How it works" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-8 text-center"
          >
            <pillar.icon className="size-8 text-foreground/70" strokeWidth={1.5} />
            <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-primary">
              {pillar.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
          </article>
        ))}
      </section>

      <section
        aria-labelledby="manifesto-heading"
        className="rounded-2xl border border-border bg-card px-8 py-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12"
      >
        <div>
          <h2
            id="manifesto-heading"
            className="text-sm font-bold uppercase tracking-wide text-primary"
          >
            Our Manifesto
          </h2>
          <ul className="mt-6 space-y-4">
            {manifestoItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex justify-center lg:mt-0">
          <HeroStickyNote className="w-64 px-7 py-6 sm:w-72 -rotate-2">
            <p className="font-script text-[1.65rem] leading-snug text-primary sm:text-[1.85rem]">
              Data over drama.
              <br />
              Remember:
              <br />
              Not personal. Just data.
            </p>
            <HeartDoodle className="mt-2 size-6 text-primary" />
          </HeroStickyNote>
        </div>
      </section>

      <section
        aria-labelledby="about-us-heading"
        className="rounded-2xl border border-border bg-card px-8 py-10 lg:grid lg:grid-cols-2 lg:gap-12"
      >
        <div>
          <h2
            id="about-us-heading"
            className="text-sm font-bold uppercase tracking-wide text-primary"
          >
            A Little About Us
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Level Up Roster was built by women who got tired of confusing dating patterns
            and wanted a smarter way to track what was actually happening.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            We&apos;re here to help you date with clarity, confidence, and a little bit of
            competitive energy.
          </p>
        </div>

        <div className="mt-8 space-y-5 lg:mt-0">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 shrink-0 text-foreground/70" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Email
              </p>
              <a
                href="mailto:support@leveluproster.com"
                className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
              >
                support@leveluproster.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <StarDoodle className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Instagram
              </p>
              <a
                href="https://instagram.com/leveluproster"
                className="mt-1 inline-block text-sm font-semibold text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @leveluproster
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-foreground/70" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Based in
              </p>
              <p className="mt-1 text-sm text-muted-foreground">London, United Kingdom</p>
              <p className="text-sm text-muted-foreground">New York, USA</p>
            </div>
          </div>
        </div>
      </section>

      <p className="flex items-center justify-center gap-2 pb-4 text-center font-script text-2xl text-muted-foreground">
        Thanks for being here.
        <StarDoodle className="size-5 text-primary" />
      </p>
    </div>
  )
}
