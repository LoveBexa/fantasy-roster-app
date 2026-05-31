"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { APP_MOBILE_NAV_ITEMS, type MobileNavItem } from "./app-nav-items"

function getPathHref(href: string) {
  return href.split("#")[0] || href
}

function isMobileNavActive(
  pathname: string,
  hash: string,
  item: MobileNavItem
) {
  const path = getPathHref(item.href)

  if (item.matchHash) {
    return pathname === path && hash === item.matchHash
  }

  if (item.isAddEntry) {
    return pathname === path && hash !== "#recent-activity-log"
  }

  if (path === "/dashboard") {
    return pathname === "/dashboard"
  }

  return pathname === path || pathname.startsWith(`${path}/`)
}

export function AppBottomNav() {
  const pathname = usePathname()
  const [hash, setHash] = useState("")

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash)
    updateHash()
    window.addEventListener("hashchange", updateHash)
    return () => window.removeEventListener("hashchange", updateHash)
  }, [pathname])

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background lg:hidden"
      aria-label="Main navigation"
    >
      <div className="flex items-end justify-around px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {APP_MOBILE_NAV_ITEMS.map((item) => {
          const active = isMobileNavActive(pathname, hash, item)

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 py-1"
            >
              {item.isAddEntry ? (
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-full border-2 transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-foreground/80 bg-background text-foreground"
                  )}
                >
                  <item.icon className="size-5" strokeWidth={2.25} />
                </span>
              ) : (
                <item.icon
                  className={cn(
                    "size-6 shrink-0 transition-colors",
                    active ? "text-primary" : "text-foreground"
                  )}
                  strokeWidth={active ? 2.25 : 1.75}
                />
              )}
              <span
                className={cn(
                  "max-w-full truncate text-[10px] leading-tight",
                  active
                    ? "font-bold text-primary"
                    : "font-medium text-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
