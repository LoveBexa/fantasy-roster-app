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
import { RosterLogoLink } from "@/components/roster-logo-link"
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
    <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4 py-3 md:gap-4 md:px-8 md:py-4 lg:static lg:bg-card/40">
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
        <RosterLogoLink
          className="min-w-0 lg:hidden"
          titleClassName="truncate text-2xl leading-none"
          taglineClassName="mt-0.5 truncate text-[0.65rem] tracking-[0.28em] text-primary/55"
        />
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
            className="flex max-w-[45vw] items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted sm:max-w-none sm:px-2 sm:py-1.5"
          >
            <Avatar className="size-10 shrink-0 sm:size-9">
              {!user?.avatarEmoji && user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={`${user.name}'s profile`} />
              ) : null}
              <AvatarFallback
                className={
                  user?.avatarEmoji
                    ? "bg-brand-pink/60 text-xl sm:text-lg"
                    : "bg-primary/10 text-sm font-semibold text-primary"
                }
              >
                {user?.avatarEmoji ?? (user ? getInitials(user.name) : "?")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-semibold text-foreground sm:text-sm">
              {greeting}
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
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
