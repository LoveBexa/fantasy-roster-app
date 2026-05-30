import Link from "next/link"
import { SiteNavbar } from "@/components/site-navbar"
import { AboutPageContent } from "@/components/about/about-page-content"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About — The Roster",
  description: "Track the patterns. See the red flags. Know who's actually winning.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <AboutPageContent />

        <div className="mt-8 flex justify-center border-t border-dashed border-border pt-8">
          <Button
            asChild
            className="rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Link href="/">Join the league</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
