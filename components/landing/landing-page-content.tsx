import { EditorialBlock } from "@/components/editorial-block"
import { LandingDashboardPreview } from "./landing-dashboard-preview"
import { LandingFeaturesBar } from "./landing-features-bar"
import { LandingHero } from "./landing-hero"
import { LandingHowItWorksPreview } from "./landing-how-it-works-preview"
import { LandingJoinCta } from "./landing-join-cta"

export function LandingPageContent() {
  return (
    <>
      <LandingHero />
      <LandingFeaturesBar />
      <LandingDashboardPreview />
      <LandingHowItWorksPreview />
      <LandingJoinCta />
      <div className="mx-auto max-w-7xl bg-background px-6 pb-12 pt-4 lg:pt-8">
        <EditorialBlock className="mt-0" />
      </div>
    </>
  )
}
