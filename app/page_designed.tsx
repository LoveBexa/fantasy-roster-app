import { SiteNavbar } from "@/components/site-navbar"
import { LoginHero } from "@/components/login-hero"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar />

      <section className="mx-auto grid max-w-7xl items-stretch gap-8 px-6 py-8 lg:grid-cols-2 lg:gap-12">
        <LoginHero />
        <div className="flex items-center">
          <LoginForm />
        </div>
      </section>
    </main>
  )
}
