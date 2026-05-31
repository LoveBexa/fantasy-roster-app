import { SiteNavbar } from "@/components/site-navbar"
import { EditorialBlock } from "@/components/editorial-block"
import { SignupForm } from "@/components/signup-form"

export const metadata = {
  title: "Sign Up — The Roster",
  description: "Create your Roster Fantasy League account.",
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar ctaHref="/signup" ctaLabel="JOIN THE LEAGUE" />

      <section className="mx-auto flex max-w-md justify-center px-6 py-12 lg:py-16">
        <SignupForm />
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-12">
        <EditorialBlock className="mt-0" />
      </div>
    </main>
  )
}
