import { DashboardMain } from "@/components/dashboard/dashboard-main"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { RightRail } from "@/components/dashboard/right-rail"
import { RosterTable } from "@/components/roster/roster-table"
import { createClient } from "@/lib/supabase/server"
import { getSessionUserContext } from "@/lib/auth/get-session-user"

export const metadata = {
  title: "My Roster — Level Up Roster",
  description: "Manage your dating prospects. Track the potential.",
}

export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>
}) {
  const supabase = await createClient()
  const session = await getSessionUserContext(supabase)
  const params = await searchParams
  const initialShowAddForm = params.add === "1" || params.add === "true"

  return (
    <DashboardShell activePage="My Roster" user={session?.display ?? null}>
      <DashboardMain>
        <RosterTable initialShowAddForm={initialShowAddForm} />
      </DashboardMain>

      <RightRail />
    </DashboardShell>
  )
}
