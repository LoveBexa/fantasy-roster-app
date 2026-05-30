import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { DailyStatInput } from "@/components/dashboard/daily-stat-input"
import { LeagueTable } from "@/components/dashboard/league-table"
import { RightRail } from "@/components/dashboard/right-rail"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <div className="flex min-w-0 flex-1">
          <main className="min-w-0 flex-1 px-8 py-8">
            <DailyStatInput />

            <div className="my-10 border-t border-dashed border-border" />

            <LeagueTable />
          </main>

          <RightRail />
        </div>
      </div>
    </div>
  )
}
