import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LeagueTable } from "@/components/dashboard/league-table"
import { RightRail } from "@/components/dashboard/right-rail"
import { createClient } from "@/lib/supabase/server"
import { getUserDisplay } from "@/lib/auth/user-display"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userDisplay = getUserDisplay(user)

  return (
    <DashboardShell activePage="League Table" user={userDisplay}>
      <DashboardMain>
        <LeagueTable />
      </DashboardMain>

      <RightRail />
    </DashboardShell>
  )
}
