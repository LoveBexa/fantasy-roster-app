import { redirect } from "next/navigation"
import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RightRail } from "@/components/dashboard/right-rail"
import { AccountPageContent } from "@/components/account/account-page-content"
import { createClient } from "@/lib/supabase/server"
import { getSessionUserContext } from "@/lib/auth/get-session-user"

export const metadata = {
  title: "My Account — Level Up Roster",
  description: "Manage your account, nickname, and connected sign-in.",
}

export default async function AccountPage() {
  const supabase = await createClient()
  const session = await getSessionUserContext(supabase)

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardShell activePage="Account" user={session.display}>
      <DashboardMain>
        <AccountPageContent initialProfile={session.profile} />
      </DashboardMain>

      <RightRail />
    </DashboardShell>
  )
}
