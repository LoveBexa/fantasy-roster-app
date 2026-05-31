"use client"

import Link from "next/link"
import { Search, ChevronDown, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    <header className="flex items-center justify-between gap-3 border-b border-border bg-card/40 px-4 py-3 md:gap-4 md:px-8 md:py-4">
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
        <div className="min-w-0 lg:hidden">
          <p className="truncate font-serif text-lg font-bold leading-tight text-primary">
            THE ROSTER
          </p>
          <p className="truncate text-[0.6rem] font-semibold tracking-[0.35em] text-primary/50">
            FANTASY LEAGUE
          </p>
        </div>
        <div className="relative hidden w-full max-w-sm lg:block">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search people..."
            aria-label="Search people"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
          />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
          >
            <Avatar className="size-9">
              {!user?.avatarEmoji && user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={`${user.name}'s profile`} />
              ) : null}
              <AvatarFallback
                className={
                  user?.avatarEmoji
                    ? "bg-brand-pink/60 text-lg"
                    : "bg-primary/10 text-xs font-semibold text-primary"
                }
              >
                {user?.avatarEmoji ?? (user ? getInitials(user.name) : "?")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-semibold text-foreground sm:inline">{greeting}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <User />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
