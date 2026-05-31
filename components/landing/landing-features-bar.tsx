import { Fragment } from "react"
import {
  BarChart3,
  Flag,
  Heart,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { landingFeatures } from "@/lib/landing/landing-content"

const iconMap: Record<(typeof landingFeatures)[number]["icon"], LucideIcon> = {
  trophy: Trophy,
  chart: BarChart3,
  heart: Heart,
  flag: Flag,
  trend: TrendingUp,
}

export function LandingFeaturesBar() {
  return (
    <section
      aria-label="Features"
      className="border-y border-border/60 bg-background py-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:flex-row sm:items-stretch sm:gap-0">
        {landingFeatures.map((feature, index) => {
          const Icon = iconMap[feature.icon]

          return (
            <Fragment key={feature.label}>
              {index > 0 ? (
                <div
                  className="hidden w-px shrink-0 self-stretch bg-border sm:block"
                  aria-hidden
                />
              ) : null}

              <div className="flex flex-1 items-start gap-3 sm:px-5 sm:first:pl-0 sm:last:pr-0">
                <Icon className="size-8 shrink-0 text-primary" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary">
                    {feature.label}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {feature.subtext}
                  </p>
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
