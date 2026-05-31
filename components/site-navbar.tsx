import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "ABOUT", href: "/about" },
  { label: "HOW IT WORKS", href: "/how-it-works" },
]

type SiteNavbarProps = {
  ctaHref?: string
  ctaLabel?: string
  sticky?: boolean
}

export function SiteNavbar({
  ctaHref = "/login",
  ctaLabel = "JOIN THE LEAGUE",
  sticky = false,
}: SiteNavbarProps) {
  return (
    <header
      className={cn(
        "border-b border-border/60",
        sticky && "sticky top-0 z-50 bg-background"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-3xl font-bold leading-tight tracking-tight text-primary">
            THE ROSTER
          </span>
          <span className="text-[0.65rem] font-medium tracking-[0.5em] text-primary/50">
            FANTASY LEAGUE
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold tracking-wide text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button
          asChild
          className="h-12 rounded-full bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </nav>
    </header>
  )
}
