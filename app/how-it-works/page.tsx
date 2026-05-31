import { SiteNavbar, marketingPageMainClass } from "@/components/site-navbar"
import { HowItWorksContent } from "@/components/how-it-works/how-it-works-content"
import { EditorialBlock } from "@/components/editorial-block"

export const metadata = {
  title: "How It Works — The Roster",
  description:
    "Your dating life. Organized. Tracked. Ranked. Learn how The Roster works step by step.",
}

export default function HowItWorksPage() {
  return (
    <main className={marketingPageMainClass}>
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <HowItWorksContent />
        <EditorialBlock />
      </div>
    </main>
  )
}
