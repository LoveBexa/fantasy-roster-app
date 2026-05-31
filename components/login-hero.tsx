import Image from "next/image"
import { HeartDoodle } from "@/components/doodles"
import { HeroStickyNote } from "@/components/hero-sticky-note"

export function LoginHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary">
      <Image
        src="/images/three-women.png"
        alt="Three confident women seated together in tailored blazers"
        width={700}
        height={820}
        priority
        className="h-full w-full object-cover"
      />

      <div className="absolute left-6 top-6 flex size-24 items-center justify-center rounded-full border border-white/80 text-center">
        <span className="font-script text-base font-bold leading-tight text-white">
          DATE
          <br />
          SMARTER
          <br />
          NOT
          <br />
          HARDER
        </span>
      </div>

      <HeartDoodle className="absolute right-10 top-16 size-9 text-white/90" />
      <HeartDoodle className="absolute left-8 top-1/2 size-7 text-white/80" />

      <HeroStickyNote className="absolute bottom-8 left-8" />
    </div>
  )
}
