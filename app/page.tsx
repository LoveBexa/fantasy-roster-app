import { SiteNavbar } from "@/components/site-navbar"
import { LandingPageContent } from "@/components/landing/landing-page-content"

export const metadata = {
  title: "The Roster — Fantasy League for Modern Dating",
  description:
    "Track behaviour. Spot patterns. Rank your roster. Fantasy league for modern dating.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar sticky />
      <LandingPageContent />
    </main>
  )
}
