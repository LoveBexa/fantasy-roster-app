import { SiteNavbar } from "@/components/site-navbar"
import { EditorialBlock } from "@/components/editorial-block"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export const metadata = {
  title: "Forgot Password — The Roster",
  description: "Reset your Roster Fantasy League password.",
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar ctaHref="/signup" ctaLabel="JOIN THE LEAGUE" />

      <section className="mx-auto flex max-w-md justify-center px-6 py-12 lg:py-16">
        <ForgotPasswordForm />
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-12">
        <EditorialBlock className="mt-0" />
      </div>
    </main>
  )
}
