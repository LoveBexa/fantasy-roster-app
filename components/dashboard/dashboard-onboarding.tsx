"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  ClipboardList,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { HeartDoodle, StarDoodle } from "@/components/doodles"
import { createClient } from "@/lib/supabase/client"
import {
  completeDashboardOnboarding,
  fetchUserProfileRow,
} from "@/lib/auth/user-profile-db"
import {
  isOnboardingDismissedLocally,
  setOnboardingDismissedLocally,
} from "@/lib/auth/onboarding-storage"
import { cn } from "@/lib/utils"

const PRIMARY_CTA_CLASS =
  "h-12 rounded-full bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90"

const STEPS = [
  {
    number: 1,
    title: "Add Your Players",
    description:
      "Create your roster using nicknames and emojis. Add anyone you're currently dating, talking to, or assessing.",
    icon: UserPlus,
    aside: {
      title: "EXAMPLES",
      items: ["👸 Princess", "🍝 Italiano", "🦶 Stinky Simon", "🌟 Star Tattoo"],
    },
  },
  {
    number: 2,
    title: "Log What Happened",
    description:
      "Come back whenever something happens. Did they plan a date? Reply consistently? Communicate well? Ghost for 3 days? Log it.",
    icon: ClipboardList,
    highlight: "Log it.",
  },
  {
    number: 3,
    title: "League Table Updates",
    description:
      "Every action changes a player's score. The more data you collect, the more useful the rankings become.",
    icon: BarChart3,
    aside: {
      title: "LEAGUE INSIGHTS",
      items: ["🏆 MVPs", "📈 Consistency leaders", "🚩 Red flags", "📉 Players dropping"],
    },
  },
] as const

export function DashboardOnboarding() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(true)
  const [isChecking, setIsChecking] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkShouldShow() {
      if (isOnboardingDismissedLocally()) {
        if (!cancelled) setIsChecking(false)
        return
      }

      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user || cancelled) {
        if (!cancelled) setIsChecking(false)
        return
      }

      const profile = await fetchUserProfileRow(supabase, user.id)
      const completed = profile?.onboarding_completed_at

      if (!cancelled) {
        setOpen(!completed)
        setIsChecking(false)
      }
    }

    void checkShouldShow()

    return () => {
      cancelled = true
    }
  }, [])

  const persistDismissal = useCallback(async (permanent: boolean) => {
    if (permanent) {
      setIsSaving(true)
      const supabase = createClient()
      const { error } = await completeDashboardOnboarding(supabase)
      setIsSaving(false)
      if (error) {
        setOnboardingDismissedLocally()
      }
    }
  }, [])

  const handleClose = useCallback(
    async (options: { navigateToRoster?: boolean; permanent: boolean }) => {
      if (options.permanent || dontShowAgain) {
        await persistDismissal(true)
        setOnboardingDismissedLocally()
      }
      setOpen(false)
      if (options.navigateToRoster) {
        router.push("/roster?add=1")
      }
    },
    [dontShowAgain, persistDismissal, router]
  )

  if (isChecking) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && open) {
          void handleClose({ permanent: dontShowAgain })
        }
      }}
    >
      <DialogContent
        showCloseButton
        className="max-h-[min(92vh,900px)] w-[calc(100%-1.5rem)] max-w-3xl gap-0 overflow-y-auto rounded-2xl border-border p-0 sm:w-full"
      >
        <DialogTitle className="sr-only">Welcome to The Roster</DialogTitle>

        <div className="px-5 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
          <header className="text-center">
            <StarDoodle className="mx-auto size-7 text-primary/80" />
            <h2 className="mt-3 font-serif text-2xl font-bold text-primary sm:text-3xl">
              Welcome to The Roster 👋
            </h2>
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-border" aria-hidden />
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary sm:text-xs">
                Your dating fantasy league
              </p>
              <span className="h-px w-10 bg-border" aria-hidden />
            </div>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Read this guide to learn how to use The Roster.
            </p>
          </header>

          <ol className="mt-8 space-y-4">
            {STEPS.map((step) => {
              const Icon = step.icon

              return (
                <li
                  key={step.number}
                  className="rounded-xl border border-border/80 bg-card/50 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
                    <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                        aria-hidden
                      >
                        {step.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <Icon
                            className="mt-0.5 size-5 shrink-0 text-primary"
                            aria-hidden
                          />
                          <h3 className="font-serif text-lg font-bold text-foreground sm:text-xl">
                            {step.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {"highlight" in step && step.highlight ? (
                            <>
                              {step.description.split(step.highlight)[0]}
                              <span className="font-semibold text-foreground">
                                {step.highlight}
                              </span>
                              {step.description.split(step.highlight)[1]}
                            </>
                          ) : (
                            step.description
                          )}
                        </p>
                      </div>
                    </div>

                    {"aside" in step && step.aside ? (
                      <div className="shrink-0 rounded-lg border border-dashed border-border bg-background/80 px-4 py-3 lg:max-w-[11rem] lg:border-solid">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                          {step.aside.title}
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-foreground">
                          {step.aside.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="mt-6 rounded-xl border border-brand-pink/40 bg-brand-pink/25 px-4 py-4 text-center sm:px-6">
            <HeartDoodle className="mx-auto size-5 text-primary" />
            <p className="mt-2 font-serif text-base font-bold text-primary sm:text-lg">
              Actions &gt; Words · Data &gt; Delusion
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The goal isn&apos;t to collect players. It&apos;s to spot who consistently
              shows up.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <Button
              asChild
              className={cn("w-full max-w-md", PRIMARY_CTA_CLASS)}
              disabled={isSaving}
            >
              <Link
                href="/roster?add=1"
                onClick={(event) => {
                  event.preventDefault()
                  void handleClose({ navigateToRoster: true, permanent: true })
                }}
              >
                Let&apos;s Build My Roster
              </Link>
            </Button>

            <button
              type="button"
              className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80 disabled:opacity-50"
              disabled={isSaving}
              onClick={() => void handleClose({ permanent: dontShowAgain })}
            >
              Skip for now
            </button>

            <div className="flex items-center gap-2">
              <Checkbox
                id="onboarding-dont-show"
                checked={dontShowAgain}
                onCheckedChange={(checked) =>
                  setDontShowAgain(checked === true)
                }
              />
              <Label
                htmlFor="onboarding-dont-show"
                className="cursor-pointer text-sm font-normal text-muted-foreground"
              >
                Don&apos;t show this again
              </Label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
