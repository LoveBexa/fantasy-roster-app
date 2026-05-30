"use client"

import Link from "next/link"
import {
  Trophy,
  Heart,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react"
import { HeartDoodle } from "@/components/doodles"
import { useLogout } from "@/lib/auth/use-logout"

type NavItem = {
  label: string
  icon: LucideIcon
  href: string
}

const navItems: NavItem[] = [
  { label: "League Table", icon: Trophy, href: "/dashboard" },
  { label: "My Roster", icon: Heart, href: "/roster" },
  { label: "Settings", icon: Settings, href: "#" },
]

export type SidebarActivePage = NavItem["label"]

type AppSidebarProps = {
  activePage?: SidebarActivePage
}

const logoutItem = {
  label: "Log out",
  icon: LogOut,
} as const

export function AppSidebar({ activePage }: AppSidebarProps) {
  const logout = useLogout()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/60 px-4 py-6">
      <div className="px-2">
        <h2 className="font-serif text-2xl font-bold leading-none tracking-tight text-primary">
          LEVEL UP
        </h2>
        <p className="mt-1 text-xs font-semibold tracking-[0.3em] text-muted-foreground">
          ROSTER
        </p>
      </div>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = item.label === activePage

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent/60 text-primary"
                  : "text-foreground/80 hover:bg-muted"
              }`}
            >
              <item.icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted"
        >
          <logoutItem.icon className="size-5 shrink-0" />
          {logoutItem.label}
        </button>
      </nav>

      <div className="mt-auto space-y-4 pt-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Today&apos;s Vibe
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            We track. We learn. We level up.
          </p>
          <HeartDoodle className="mt-1 size-5 text-primary" />
        </div>

        <div className="relative rotate-[-3deg] rounded-sm bg-brand-pink/70 p-4 shadow-sm">
          <span className="absolute -top-2 left-6 h-4 w-16 rotate-2 bg-amber-200/70" aria-hidden />
          <p className="font-script text-xl leading-tight text-primary">
            REMEMBER: NOT PERSONAL, JUST DATA.
          </p>
        </div>
      </div>
    </aside>
  )
}
