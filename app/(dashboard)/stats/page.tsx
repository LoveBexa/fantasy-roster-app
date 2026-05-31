import { redirect } from "next/navigation"
import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RightRail } from "@/components/dashboard/right-rail"
import { DailyStatInput } from "@/components/dashboard/daily-stat-input"
import { createClient } from "@/lib/supabase/server"
import { getUserDisplay } from "@/lib/auth/user-display"

export const metadata = {
  title: "Daily Stats — The Roster",
  description: "Log daily behaviours and points for your roster players.",
}

export default async function DailyStatsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const userDisplay = getUserDisplay(user)

  return (
    <DashboardShell activePage="Daily Stats" user={userDisplay}>
      <DashboardMain>
        <DailyStatInput />
      </DashboardMain>

      <RightRail />
    </DashboardShell>
  )
}
