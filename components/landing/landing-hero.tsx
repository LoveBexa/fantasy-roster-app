import Image from "next/image"
import Link from "next/link"
import { StarDoodle } from "@/components/doodles"
import { HeroStickyNote } from "@/components/hero-sticky-note"
import { Button } from "@/components/ui/button"
import { landingHero } from "@/lib/landing/landing-content"

export function LandingHero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
      <div>
        <div className="flex items-start gap-3">
          <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-[3.4rem]">
            {landingHero.title}
          </h1>
          <StarDoodle className="mt-2 size-8 shrink-0 text-primary/70 sm:size-10" />
        </div>

        <p className="mt-5 text-lg font-medium text-foreground sm:text-xl">
          {landingHero.subtitle}
        </p>
        <p className="mt-3 max-w-lg text-base text-muted-foreground">{landingHero.body}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            className="h-12 rounded-full bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/login">{landingHero.primaryCta}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-primary px-8 text-sm font-bold tracking-wide text-primary hover:bg-primary/5"
          >
            <Link href="/how-it-works">{landingHero.secondaryCta}</Link>
          </Button>
        </div>

        <p className="relative mt-10 max-w-md font-script text-xl leading-snug text-primary/90">
          <span className="absolute -left-4 top-1 text-2xl" aria-hidden>
            ↳
          </span>
          {landingHero.annotation}
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-lg">
          <Image
            src={landingHero.heroImage}
            alt="Two women on a couch reviewing their roster on a phone"
            width={800}
            height={600}
            priority
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <HeroStickyNote className="absolute -right-2 top-6 z-10 hidden sm:block sm:-right-4 sm:top-8 lg:-right-8" />
      </div>
    </section>
  )
}
