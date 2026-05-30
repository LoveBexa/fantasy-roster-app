import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
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

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-5xl">
            <RosterTable />
          </div>
        </main>
      </div>
    </div>
  )
}
