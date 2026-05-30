import Image from "next/image"
import { HeartDoodle } from "@/components/doodles"

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

      {/* circular badge */}
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

      {/* doodle hearts */}
      <HeartDoodle className="absolute right-10 top-16 size-9 text-white/90" />
      <HeartDoodle className="absolute left-8 top-1/2 size-7 text-white/80" />

      {/* sticky note */}
      <div className="absolute bottom-8 left-8 w-52 -rotate-3 rounded-sm bg-brand-pink px-6 py-5 shadow-lg">
        <p className="font-script text-2xl leading-snug text-primary">
          good dates
          <br />
          better vibes
          <br />
          higher stats
        </p>
        <HeartDoodle className="mt-1 size-5 text-primary" />
      </div>
    </div>
  )
}
