import type { ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"
import { AppBottomNav } from "./app-bottom-nav"
import { TopBar } from "./top-bar"
import type { SidebarActivePage } from "./app-nav-items"
import type { UserDisplay } from "@/lib/auth/user-display"

type DashboardShellProps = {
  activePage: SidebarActivePage
  user: UserDisplay | null
  children: ReactNode
}

export function DashboardShell({ activePage, user, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activePage={activePage} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={user} />

        <div className="flex min-w-0 flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          <div className="flex min-w-0 flex-1">{children}</div>
        </div>
      </div>

      <AppBottomNav />
    </div>
  )
}
