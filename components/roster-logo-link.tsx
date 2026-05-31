import Link from "next/link"
import { cn } from "@/lib/utils"

/** League table route — logo taps always return here. */
export const LEAGUE_TABLE_HREF = "/dashboard"

type RosterLogoLinkProps = {
  className?: string
  titleClassName?: string
  taglineClassName?: string
}

export function RosterLogoLink({
  className,
  titleClassName,
  taglineClassName,
}: RosterLogoLinkProps) {
  return (
    <Link
      href={LEAGUE_TABLE_HREF}
      className={cn(
        "flex flex-col leading-none transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:rounded-sm",
        className
      )}
      aria-label="The Roster Fantasy League — go to League Table"
    >
      <span
        className={cn(
          "font-serif font-bold leading-tight tracking-tight text-primary",
          titleClassName
        )}
      >
        THE ROSTER
      </span>
      <span
        className={cn(
          "font-semibold text-primary/50",
          taglineClassName
        )}
      >
        FANTASY LEAGUE
      </span>
    </Link>
  )
}
