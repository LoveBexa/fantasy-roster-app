import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { TopBar } from "@/components/dashboard/top-bar"
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
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePage="Daily Stats" />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={userDisplay} />

        <div className="flex min-w-0 flex-1">
          <DashboardMain>
            <DailyStatInput />
          </DashboardMain>

          <RightRail />
        </div>
      </div>
    </div>
  )
}
