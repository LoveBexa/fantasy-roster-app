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
import { StarDoodle } from "@/components/doodles"
import { PageHeader } from "@/components/dashboard/page-header"

const pillars = [
  {
    title: "The Concept",
    icon: BarChart3,
    body: "We treat dating like a fantasy league — because patterns matter more than promises.",
  },
  {
    title: "The Metrics",
    icon: ClipboardList,
    body: "Every interaction gets a score. Effort, consistency, communication — all tracked.",
  },
  {
    title: "The Roster",
    icon: Heart,
    body: "You're the coach. You decide who's starting, who's benched, and who's cut.",
  },
  {
    title: "The Insights",
    icon: TrendingUp,
    body: "Over time, patterns become visible. You stop guessing. You start knowing.",
  },
  {
    title: "The Game",
    icon: Trophy,
    body: "You're not settling. You're strategising. And you're winning your own league.",
  },
] as const

const manifestoItems = [
  "No more \"vibes-only\" thinking.",
  "No more ignoring red flags.",
  "No more chasing inconsistent effort.",
  "Just data, patterns, and informed decisions.",
] as const

export function AboutPageContent() {
  return (
    <div className="space-y-6">
      <PageHeader
        id="about-heading"
        title="ABOUT LEVEL UP"
        subtitle="Track the patterns. See the red flags. Know who's actually winning."
        icon={<StarDoodle className="size-8 text-primary" />}
      />

      <section
        aria-labelledby="why-heading"
        className="overflow-hidden rounded-2xl border border-border bg-card"
      >
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-10 text-center lg:px-10 lg:text-left">
            <h2
              id="why-heading"
              className="text-sm font-bold uppercase tracking-wide text-primary"
            >
              Why We Built This
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Dating shouldn&apos;t feel like guesswork. Level Up Roster turns your love life
              into a league you can actually read — with stats, patterns, and clarity instead
              of confusion.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              We built this for women who want to date smarter, not harder. Track effort.
              Spot inconsistency. Make decisions based on data — not drama.
            </p>
          </div>

          <div className="relative min-h-64 bg-accent/40 lg:min-h-full">
            <Image
              src="/images/three-women.png"
              alt="Three confident women seated together"
              width={700}
              height={520}
              className="h-full w-full object-cover"
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
        className="rounded-2xl border border-border bg-card px-8 py-10 lg:grid lg:grid-cols-2 lg:gap-12"
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

        <div className="mt-10 flex flex-col justify-center lg:mt-0">
          <p className="font-serif text-4xl font-bold leading-tight text-foreground">
            Data over drama.
          </p>
          <p className="mt-6 text-sm font-bold uppercase tracking-wide text-primary">
            Remember:
          </p>
          <p className="mt-2 font-serif text-3xl font-bold leading-tight text-foreground">
            Not personal. Just data.
          </p>
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
