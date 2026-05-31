import { SiteNavbar, marketingPageMainClass } from "@/components/site-navbar"
import { EditorialBlock } from "@/components/editorial-block"
import { LoginHero } from "@/components/login-hero"
import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Log In — The Roster",
  description: "Log in to your Roster Fantasy League account.",
}

export default function LoginPage() {
  return (
    <main className={marketingPageMainClass}>
      <SiteNavbar />

      <section className="mx-auto grid max-w-7xl items-stretch gap-8 px-6 py-6 lg:grid-cols-2 lg:gap-12 lg:py-8">
        <LoginHero />
        <div className="flex items-center justify-center lg:justify-start">
          <LoginForm />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-12">
        <EditorialBlock className="mt-0" />
      </div>
    </main>
  )
}
