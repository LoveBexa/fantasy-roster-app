import { redirect } from "next/navigation"
import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RightRail } from "@/components/dashboard/right-rail"
import { AccountPageContent } from "@/components/account/account-page-content"
import { createClient } from "@/lib/supabase/server"
import { getUserDisplay } from "@/lib/auth/user-display"
import { getUserProfile } from "@/lib/auth/user-profile"

export const metadata = {
  title: "My Account — Level Up Roster",
  description: "Manage your account, nickname, and connected sign-in.",
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const userDisplay = getUserDisplay(user)
  const profile = getUserProfile(user)

  if (!profile) {
    redirect("/")
  }

  return (
    <DashboardShell activePage="Account" user={userDisplay}>
      <DashboardMain>
        <AccountPageContent initialProfile={profile} />
      </DashboardMain>

      <RightRail />
    </DashboardShell>
  )
}
