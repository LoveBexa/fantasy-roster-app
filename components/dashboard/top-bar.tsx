"use client"

import { Search, Bell, ChevronDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLogout } from "@/lib/auth/use-logout"
import type { UserDisplay } from "@/lib/auth/user-display"

type TopBarProps = {
  user: UserDisplay | null
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function TopBar({ user }: TopBarProps) {
  const logout = useLogout()
  const greeting = user ? `Hi, ${user.firstName}` : "Hi there"

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card/40 px-8 py-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search people..."
          aria-label="Search people"
          className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-foreground/70 transition-colors hover:text-foreground"
        >
          <Bell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" aria-hidden />
        </button>

        <div className="flex items-center gap-2">
          <button type="button" className="flex items-center gap-2">
            <Avatar className="size-9">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={`${user.name}'s profile`} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">{greeting}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>

          <button
            type="button"
            onClick={() => logout()}
            aria-label="Log out"
            title="Log out"
            className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
