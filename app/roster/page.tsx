import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { TopBar } from "@/components/dashboard/top-bar"
import { RightRail } from "@/components/dashboard/right-rail"
import { RosterTable } from "@/components/roster/roster-table"
import { createClient } from "@/lib/supabase/server"
import { getUserDisplay } from "@/lib/auth/user-display"

export const metadata = {
  title: "My Roster — Level Up Roster",
  description: "Manage your dating prospects. Track the potential.",
}

export default async function RosterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userDisplay = getUserDisplay(user)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePage="My Roster" />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={userDisplay} />

        <div className="flex min-w-0 flex-1">
          <DashboardMain>
            <RosterTable />
          </DashboardMain>

          <RightRail />
        </div>
      </div>
    </div>
  )
}
