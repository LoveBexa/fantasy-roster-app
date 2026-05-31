import Link from "next/link"
import { cn } from "@/lib/utils"

export const HOME_HREF = "/"
export const LEAGUE_TABLE_HREF = "/dashboard"

type RosterLogoLinkProps = {
  href?: string
  /** Cream text on burgundy surfaces (e.g. marketing nav). */
  tone?: "default" | "inverted"
  className?: string
  titleClassName?: string
  taglineClassName?: string
}

export function RosterLogoLink({
  href = LEAGUE_TABLE_HREF,
  tone = "default",
  className,
  titleClassName,
  taglineClassName,
}: RosterLogoLinkProps) {
  const ariaLabel =
    href === HOME_HREF
      ? "The Roster Fantasy League — go to Home"
      : "The Roster Fantasy League — go to League Table"

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col leading-none transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:rounded-sm",
        tone === "inverted"
          ? "focus-visible:ring-background/50"
          : "focus-visible:ring-ring/40",
        className
      )}
      aria-label={ariaLabel}
    >
      <span
        className={cn(
          "font-serif font-bold leading-tight tracking-tight",
          tone === "inverted" ? "text-background" : "text-primary",
          titleClassName
        )}
      >
        THE ROSTER
      </span>
      <span
        className={cn(
          "font-semibold",
          tone === "inverted" ? "text-background/70" : "text-primary/50",
          taglineClassName
        )}
      >
        FANTASY LEAGUE
      </span>
    </Link>
  )
}
