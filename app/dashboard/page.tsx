import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { TopBar } from "@/components/dashboard/top-bar"
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
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePage="League Table" />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={userDisplay} />

        <div className="flex min-w-0 flex-1">
          <DashboardMain>
            <LeagueTable />
          </DashboardMain>

          <RightRail />
        </div>
      </div>
    </div>
  )
}
