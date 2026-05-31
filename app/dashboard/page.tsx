import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LeagueTable } from "@/components/dashboard/league-table"
import { RightRail } from "@/components/dashboard/right-rail"
import { createClient } from "@/lib/supabase/server"
import { getSessionUserContext } from "@/lib/auth/get-session-user"

export default async function DashboardPage() {
  const supabase = await createClient()
  const session = await getSessionUserContext(supabase)

  return (
    <DashboardShell activePage="League Table" user={session?.display ?? null}>
      <DashboardMain>
        <LeagueTable />
      </DashboardMain>

      <RightRail />
    </DashboardShell>
  )
}
