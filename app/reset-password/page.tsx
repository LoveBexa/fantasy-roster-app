import { SiteNavbar } from "@/components/site-navbar"
import { EditorialBlock } from "@/components/editorial-block"
import { ResetPasswordForm } from "@/components/reset-password-form"

export const metadata = {
  title: "Reset Password — The Roster",
  description: "Set a new password for your Roster Fantasy League account.",
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNavbar ctaHref="/signup" ctaLabel="JOIN THE LEAGUE" />

      <section className="mx-auto flex max-w-md justify-center px-6 py-12 lg:py-16">
        <ResetPasswordForm />
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-12">
        <EditorialBlock className="mt-0" />
      </div>
    </main>
  )
}
