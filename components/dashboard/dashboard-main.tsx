import type { ReactNode } from "react"

type DashboardMainProps = {
  children: ReactNode
}

export function DashboardMain({ children }: DashboardMainProps) {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-8 py-8">
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </main>
  )
}
