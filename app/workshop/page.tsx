import Link from "next/link"
import { StarDoodle } from "@/components/doodles"
import { SiteNavbar, marketingPageMainClass } from "@/components/site-navbar"
import { WorkshopWaitlistForm } from "@/components/workshop/workshop-waitlist-form"

export const metadata = {
  title: "The Workshop — Waitlist",
  description: "Sign up to the waitlist for The Workshop.",
}

export default function WorkshopPage() {
  return (
    <main className={marketingPageMainClass}>
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
        <section className="mx-auto max-w-xl">
          <div className="flex items-start gap-3">
            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-primary sm:text-5xl">
              The Workshop
            </h1>
            <StarDoodle className="mt-2 size-8 shrink-0 text-primary/70 sm:size-10" />
          </div>

          <p className="mt-5 text-lg font-medium text-foreground sm:text-xl">
            Sign up to the waitlist for The Workshop.
          </p>
          <p className="mt-3 text-base text-muted-foreground">
            Learn to design and build your own web app — the same way The Roster was built in
            3 days with AI tools.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <WorkshopWaitlistForm />
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already playing the league?{" "}
            <Link href="/" className="font-semibold text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
