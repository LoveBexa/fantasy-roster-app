import Link from "next/link"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "ABOUT", href: "#" },
  { label: "HOW IT WORKS", href: "#" },
  { label: "BLOG", href: "#" },
]

export function SiteNavbar() {
  return (
    <header className="border-b border-border/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
        <Link href="#" className="flex flex-col leading-none">
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
          className="rounded-full bg-pink-200 px-6 text-sm font-bold tracking-wide text-secondary-foreground hover:bg-secondary/80"
        >
          JOIN THE LEAGUE
        </Button>
      </nav>
    </header>
  )
}
