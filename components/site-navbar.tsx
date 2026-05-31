"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HOME_HREF, RosterLogoLink } from "@/components/roster-logo-link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "ABOUT", href: "/about" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
]

/** Bottom padding for pages with the mobile marketing CTA bar. */
export const marketingPageMainClass =
  "min-h-screen bg-background pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:pb-0"

type SiteNavbarProps = {
  ctaHref?: string
  ctaLabel?: string
  loginHref?: string
  sticky?: boolean
}

export function SiteNavbar({
  ctaHref = "/signup",
  ctaLabel = "JOIN THE LEAGUE",
  loginHref = "/login",
  sticky = true,
}: SiteNavbarProps) {
  const pathname = usePathname()

  return (
    <>
      <header
        className={cn(
          "border-b border-background/15 bg-primary text-background",
          sticky && "sticky top-0 z-50"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-center px-6 py-4 md:justify-between md:py-5">
          <RosterLogoLink
            href={HOME_HREF}
            tone="inverted"
            className="items-center text-center md:items-start md:text-left"
            titleClassName="text-[1.75rem] md:text-4xl"
            taglineClassName="text-[0.7rem] font-medium tracking-[0.28em] md:text-xs md:tracking-[0.5em]"
          />

          <div className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-semibold tracking-wide text-background/85 transition-colors hover:text-background"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Button
            asChild
            className="hidden h-12 rounded-full bg-background px-8 text-sm font-bold tracking-wide text-primary hover:bg-background/90 md:inline-flex"
          >
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </nav>

        <div className="border-t border-border/50 bg-accent md:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-2.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-xs font-semibold tracking-wide transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] md:hidden"
        aria-label="Get started"
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Button
            asChild
            className="h-11 min-w-0 flex-1 rounded-full bg-primary text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
          >
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
          <Link
            href={loginHref}
            className={cn(
              "shrink-0 px-2 text-sm font-bold uppercase tracking-wide transition-colors",
              pathname === loginHref
                ? "text-primary"
                : "text-foreground hover:text-primary"
            )}
          >
            LOGIN
          </Link>
        </div>
      </div>
    </>
  )
}
