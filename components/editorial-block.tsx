import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { HeartDoodle } from "@/components/doodles"
import { cn } from "@/lib/utils"

const STICKY_NOTE_BG = "#FCF7E9"
const FEATURE_BAR_BG = "#F9F5EB"
/** Matches trophy.png — slight counter-clockwise tilt */
const STICKY_NOTE_ROTATION = "15deg"

function WavyUnderline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 280 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M2 8C40 2 80 10 120 6C160 2 200 10 240 5C260 3 275 4 278 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StickyNoteIllustration() {
  return (
    <div
      className="relative mx-auto w-full max-w-[240px] lg:mx-0"
      style={{ transform: `rotate(${STICKY_NOTE_ROTATION})` }}
    >
      <div
        className="absolute left-1/2 top-0 z-10 h-7 w-16 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white/90 shadow-sm ring-1 ring-black/[0.04]"
        aria-hidden
      />
      <div
        className="relative rounded-sm border border-border/30 px-4 pb-5 pt-4 shadow-md"
        style={{ backgroundColor: STICKY_NOTE_BG }}
      >
        <Image
          src="/images/trophy.png"
          alt=""
          width={200}
          height={180}
          className="mx-auto h-auto w-[69%] object-contain"
        />

        <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 px-1 font-script text-[1.05rem] leading-snug text-primary">
          <p>Problem ✓</p>
          <p>Solution  ✓</p>
          <p>AI tools ✓</p>
          <p>3 days ✓</p>
        </div>

        <p className="mx-auto mt-3 w-fit rounded-full border border-primary px-4 py-0.5 font-script text-[1.05rem] text-primary">
          App Live. ♡
        </p>
      </div>
    </div>
  )
}

function FeatureIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center text-primary">
      {children}
    </span>
  )
}

const featureItems = [
  {
    title: "ONE IDEA",
    subtitle: "All good ideas starts with a problem.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8">
        <path d="M4 20l4-8 4 4 4-10 4 14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 4l2 2M7 3l1 2M11 5l2-1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "MODERN TECH",
    subtitle: "AI tools to ship faster.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8">
        <rect x="3" y="5" width="18" height="12" rx="1.5" />
        <path d="M8 21h8" strokeLinecap="round" />
        <path d="M12 17v4" />
        <path
          d="M12 11c0-1.5 1-2.5 2-2.5s2 1 2 2.5c0 1.2-.8 2-2 2.5-.8.4-1 .8-1 1.5v.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "A LOT OF CURIOSITY",
    subtitle: "The most important ingredient.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8">
        <path d="M6 10h12v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8Z" />
        <path d="M9 6h6l1 4H8l1-4Z" strokeLinejoin="round" />
        <path d="M8 14c1 2 2.5 3 4 3s3-1 4-3" strokeLinecap="round" />
        <path d="M10 3c0 1 .5 2 2 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "YOUR TURN",
    subtitle: "What will you build in 3 days?",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-8">
        <path d="M12 15V5" strokeLinecap="round" />
        <path d="M9 8l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 15h8l-1 4H9l-1-4Z" strokeLinejoin="round" />
        <path d="M7 19l-1 2M17 19l1 2" strokeLinecap="round" />
      </svg>
    ),
  },
] as const

export function EditorialBlock({ className }: { className?: string }) {
  return (
    <aside aria-label="Built with AI" className={cn("mt-16", className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {/* Main editorial area */}
        <div className="grid gap-8 bg-background px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_auto] lg:gap-0 lg:py-12">
          {/* Left — headline */}
          <div className="lg:pr-8">
            <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-primary">
              The Roster was
              <HeartDoodle className="size-3.5 text-primary" />
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Built with AI
              <br />
              in <i>3 Days</i>
            </h2>
            <WavyUnderline className="mt-4 h-3 w-48 text-primary sm:w-56" />
          </div>

          {/* Middle — story + CTA */}
          <div className="lg:border-l lg:border-border/80 lg:px-8">
            <div className="space-y-4 text-sm leading-relaxed text-foreground/85 sm:text-[0.95rem]">
              <p>The Roster wasn&apos;t built by a startup team.</p>
              <p>
                It was built by one person seeing a real problem, and solving it using AI tools to build a ridiculous solution on 3 days of no sleep.
              </p>
            </div>

            <blockquote className="mt-6 font-script text-2xl leading-snug text-primary sm:text-[1.65rem]">
              &ldquo;I wish I could design and build
              my own web app...&rdquo;
            </blockquote>

            <p className="mt-4 font-serif text-xl font-bold text-foreground sm:text-2xl">
              Well, you can.
            </p>

            <Link
              href="/workshop"
              className="mt-5 inline-block border-b-2 border-primary pb-0.5 text-sm font-bold tracking-wide text-primary transition-colors hover:text-primary/80"
            >
              Join The Workshop Waitlist →
            </Link>
          </div>

          {/* Right — sticky note (desktop only) */}
          <div className="hidden items-center justify-center py-2 lg:flex lg:pl-6">
            <StickyNoteIllustration />
          </div>
        </div>

        {/* Bottom feature bar */}
        <div
          className="border-t border-border/80 px-4 py-5 md:px-8"
          style={{ backgroundColor: FEATURE_BAR_BG }}
        >
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {featureItems.map((item, index) => (
              <div
                key={item.title}
                className={`flex items-start gap-3 ${
                  index > 0 ? "xl:border-l xl:border-dotted xl:border-border xl:pl-6" : ""
                }`}
              >
                <FeatureIcon>{item.icon}</FeatureIcon>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
