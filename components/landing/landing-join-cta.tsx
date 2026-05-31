import Link from "next/link"
import { HeartDoodle, StarDoodle } from "@/components/doodles"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { landingHero, landingMidCta } from "@/lib/landing/landing-content"

type TestimonialNoteProps = {
  quote: string
  rotation: string
  className?: string
}

function TestimonialNote({ quote, rotation, className }: TestimonialNoteProps) {
  return (
    <figure
      className={cn(
        "relative w-44 rounded-sm border border-primary/10 bg-brand-pink px-4 py-4 shadow-md sm:w-48",
        className
      )}
      style={{ transform: `rotate(${rotation})` }}
    >
      <div
        className="absolute left-1/2 top-0 h-5 w-12 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white/90 shadow-sm ring-1 ring-black/[0.04]"
        aria-hidden
      />
      <blockquote className="font-script text-lg leading-snug text-primary">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-2 text-sm tracking-widest text-primary/75" aria-label="5 out of 5 stars">
        ★★★★★
      </figcaption>
    </figure>
  )
}

const floatingPositions = [
  "absolute -left-4 top-6 z-10 hidden md:block lg:-left-20 lg:top-4",
  "absolute -right-4 top-10 z-10 hidden md:block lg:-right-20 lg:top-8",
  "absolute -bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block lg:-bottom-2 lg:left-auto lg:right-0 lg:translate-x-0 xl:-right-24",
] as const

export function LandingJoinCta() {
  const { testimonials } = landingMidCta

  return (
    <section aria-label="Join the league" className="bg-[#F9F4EB]">
      <div className="mx-auto max-w-7xl border-t border-border/60 px-6 pt-12 pb-16 lg:pt-14 lg:pb-20">
        <div className="relative mx-auto max-w-2xl pb-4 lg:max-w-3xl lg:pb-16">
          {testimonials.map((item, index) => (
            <TestimonialNote
              key={item.quote}
              quote={item.quote}
              rotation={item.rotation}
              className={floatingPositions[index]}
            />
          ))}

          <div className="relative rounded-2xl border border-border/70 bg-background px-8 py-12 text-center shadow-sm sm:px-12 sm:py-14">
            <StarDoodle className="absolute right-6 top-6 size-10 text-primary/15" />
            <HeartDoodle className="absolute bottom-6 left-6 size-8 text-primary/20" />

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {landingMidCta.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {landingMidCta.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {landingMidCta.subtext}
            </p>

            <Button
              asChild
              className="mt-8 h-12 rounded-full bg-primary px-10 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/login">{landingMidCta.cta || landingHero.primaryCta}</Link>
            </Button>

            <p className="mt-5 font-script text-lg text-primary/80">
              good dates · better vibes · higher stats ♡
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
