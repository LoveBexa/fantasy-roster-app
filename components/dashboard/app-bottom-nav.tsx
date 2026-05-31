"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { APP_NAV_ITEMS } from "./app-nav-items"

function isNavItemActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AppBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-lg rounded-t-3xl border border-b-0 border-border bg-card/95 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-card/90">
        <div className="flex items-end justify-around px-1 pt-3 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          {APP_NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item.href)

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1"
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full transition-all duration-200",
                    active
                      ? "-translate-y-3 bg-primary text-primary-foreground shadow-lg ring-[3px] ring-background"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                </span>
                <span
                  className={cn(
                    "max-w-full truncate text-[10px] leading-none tracking-wide",
                    active
                      ? "font-bold text-primary"
                      : "font-medium text-muted-foreground"
                  )}
                >
                  {item.shortLabel}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
