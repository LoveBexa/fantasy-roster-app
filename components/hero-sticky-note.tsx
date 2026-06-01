import type { ReactNode } from "react"
import { HeartDoodle } from "@/components/doodles"
import { cn } from "@/lib/utils"

type HeroStickyNoteProps = {
  className?: string
  children?: ReactNode
}

export function HeroStickyNote({ className, children }: HeroStickyNoteProps) {
  return (
    <div
      className={cn(
        "w-52 -rotate-3 rounded-sm bg-brand-pink px-6 py-5 shadow-lg",
        className
      )}
    >
      {children ?? (
        <>
          <p className="font-script text-2xl leading-snug text-primary">
            good dates
            <br />
            better vibes
            <br />
            higher stats
          </p>
          <HeartDoodle className="mt-1 size-5 text-primary" />
        </>
      )}
    </div>
  )
}
