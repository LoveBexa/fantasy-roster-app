import type { ReactNode } from "react"
import { EditorialBlock } from "@/components/editorial-block"

type DashboardMainProps = {
  children: ReactNode
}

export function DashboardMain({ children }: DashboardMainProps) {
  return (
    <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto w-full min-w-0 max-w-5xl">
        {children}
        <EditorialBlock />
      </div>
    </main>
  )
}
