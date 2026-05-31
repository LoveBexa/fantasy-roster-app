import { redirect } from "next/navigation"
import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RightRail } from "@/components/dashboard/right-rail"
import { DailyStatInput } from "@/components/dashboard/daily-stat-input"
import { createClient } from "@/lib/supabase/server"
import { getSessionUserContext } from "@/lib/auth/get-session-user"

export const metadata = {
  title: "Daily Stats — The Roster",
  description: "Log daily behaviours and points for your roster players.",
}

export default async function DailyStatsPage() {
  const supabase = await createClient()
  const session = await getSessionUserContext(supabase)

  if (!session) {
    redirect("/login")
  }

  return (
    <DashboardShell activePage="Daily Stats" user={session.display}>
      <DashboardMain>
        <DailyStatInput />
      </DashboardMain>

      <RightRail />
    </DashboardShell>
  )
}
