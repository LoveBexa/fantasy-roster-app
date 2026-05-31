"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, LogOut, Pencil, Trash2 } from "lucide-react"
import { GoogleIcon, HeartDoodle, StarDoodle } from "@/components/doodles"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/dashboard/page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ACCOUNT_EMOJI_OPTIONS, type AccountEmoji } from "@/lib/auth/account-constants"
import { saveUserProfile } from "@/lib/auth/user-profile-db"
import { createClient } from "@/lib/supabase/client"
import type { UserProfile } from "@/lib/auth/user-profile"
import { deleteAccountAction } from "@/app/account/actions"
import { useLogout } from "@/lib/auth/use-logout"

type AccountPageContentProps = {
  initialProfile: UserProfile
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div>
      <h2 className="text-sm font-bold uppercase tracking-wide text-primary">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

export function AccountPageContent({ initialProfile }: AccountPageContentProps) {
  const router = useRouter()
  const logout = useLogout()
  const [nickname, setNickname] = useState(initialProfile.nickname ?? "")
  const [selectedEmoji, setSelectedEmoji] = useState<AccountEmoji | null>(
    initialProfile.avatarEmoji
  )
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null)
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isSavingNickname, setIsSavingNickname] = useState(false)
  const [isSavingAvatar, setIsSavingAvatar] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const displayEmoji = selectedEmoji ?? "😎"

  async function saveNickname() {
    setNicknameMessage(null)
    setIsSavingNickname(true)

    const trimmed = nickname.trim()
    if (!trimmed) {
      setNicknameMessage("Enter a nickname to save.")
      setIsSavingNickname(false)
      return
    }

    const supabase = createClient()
    const { error } = await saveUserProfile(supabase, { nickname: trimmed })

    setIsSavingNickname(false)

    if (error) {
      setNicknameMessage(error.message)
      return
    }

    setNicknameMessage("Nickname saved.")
    router.refresh()
  }

  async function saveAvatar(emoji: AccountEmoji) {
    setAvatarMessage(null)
    setSelectedEmoji(emoji)
    setIsSavingAvatar(true)

    const supabase = createClient()
    const { error } = await saveUserProfile(supabase, { avatarEmoji: emoji })

    setIsSavingAvatar(false)

    if (error) {
      setAvatarMessage(error.message)
      return
    }

    setAvatarMessage("Avatar updated.")
    router.refresh()
  }

  async function handleDeleteAccount() {
    setDeleteError(null)
    setIsDeleting(true)

    const result = await deleteAccountAction()

    if (result?.error) {
      setDeleteError(result.error)
      setIsDeleting(false)
    }
  }

  return (
    <section aria-labelledby="account-heading" className="space-y-6">
      <PageHeader
        id="account-heading"
        title="MY ACCOUNT"
        subtitle="Your account, your data, your roster."
        icon={<HeartDoodle className="size-8 text-primary" />}
      />

      {/* Avatar */}
      <section className="space-y-5">
        <SectionHeading title="Avatar" subtitle="This is your vibe." />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-start gap-3">
            <div className="relative">
              <div className="flex size-28 items-center justify-center rounded-full bg-white text-5xl">
                {displayEmoji}
              </div>
              <span className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <Pencil className="size-3.5 text-muted-foreground" aria-hidden />
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {initialProfile.googleAvatarUrl
                ? "Emoji saved in your profile. Google photo stays linked below."
                : "Pick an emoji for your league profile."}
            </p>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
              {ACCOUNT_EMOJI_OPTIONS.map((emoji) => {
                const isSelected = selectedEmoji === emoji

                return (
                  <button
                    key={emoji}
                    type="button"
                    disabled={isSavingAvatar}
                    onClick={() => saveAvatar(emoji)}
                    className={`relative flex size-12 items-center justify-center rounded-full text-2xl transition-colors ${
                      isSelected
                        ? "bg-brand-pink/60 ring-2 ring-primary/30"
                        : "bg-card hover:bg-muted"
                    }`}
                    aria-label={`Select ${emoji} as avatar`}
                    aria-pressed={isSelected}
                  >
                    {emoji}
                    {isSelected ? (
                      <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-2.5" />
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
            {avatarMessage ? (
              <p className="mt-3 text-sm text-muted-foreground">{avatarMessage}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Nickname */}
      <section className="space-y-4">
        <SectionHeading
          title="Nickname"
          subtitle="This is how you'll show up in the league."
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="nickname" className="text-xs font-bold uppercase tracking-wide">
              Your nickname
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname"
              className="h-12 rounded-lg border-border bg-card"
            />
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <p className="font-script text-xl text-primary">keep it cute ♡</p>
            <Button
              type="button"
              disabled={isSavingNickname}
              onClick={saveNickname}
              className="h-11 rounded-full bg-primary px-6 font-bold tracking-wide text-primary-foreground hover:bg-primary/90"
            >
              {isSavingNickname ? "Saving..." : "Save nickname"}
            </Button>
          </div>
        </div>
        {nicknameMessage ? (
          <p className="text-sm text-muted-foreground">{nicknameMessage}</p>
        ) : null}
      </section>

      {/* Connected account */}
      <section className="space-y-4">
        <SectionHeading
          title="Connected account"
          subtitle="You're all signed in and secure."
        />

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {initialProfile.isGoogleConnected ? (
                <GoogleIcon className="size-8 shrink-0" />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  ?
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {initialProfile.providerLabel}
                </p>
                <p className="text-sm text-muted-foreground">
                  {initialProfile.email ?? "No email on file"}
                </p>
                {initialProfile.googleName ? (
                  <p className="text-xs text-muted-foreground">
                    Signed in as {initialProfile.googleName}
                  </p>
                ) : null}
              </div>
            </div>

            {initialProfile.isGoogleConnected ? (
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-green/15 px-3 py-1.5 text-xs font-semibold text-brand-green">
                <Check className="size-3.5" />
                Connected with Google
              </span>
            ) : (
              <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                Not connected with Google
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl bg-brand-pink/25 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-primary">Danger zone</h2>
        <p className="mt-2 font-semibold text-primary">Delete your account</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/80">
          This will permanently delete your account, roster, league history, points and notes.
        </p>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-primary/30 bg-card text-primary hover:bg-primary/5"
              >
                <Trash2 className="size-4" />
                Delete my account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent. All roster players, stat entries, and account data
                  will be removed and cannot be recovered.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.preventDefault()
                    void handleDeleteAccount()
                  }}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <p className="font-script text-lg text-primary/80">
            once it&apos;s gone, it&apos;s gone 👻 ♡
          </p>
        </div>

        {deleteError ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {deleteError}
          </p>
        ) : null}
      </section>

      {/* Support */}
      <div className="rounded-xl border border-border bg-card px-5 py-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <StarDoodle className="size-4 shrink-0 text-primary" />
          Need help? Email us at{" "}
          <a
            href="mailto:support@leveluproster.com"
            className="font-medium text-foreground underline underline-offset-2"
          >
            support@leveluproster.com
          </a>
        </p>
      </div>

      <div className="flex justify-center border-t border-dashed border-border pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => logout()}
          className="h-11 rounded-full border-border px-8 font-bold tracking-wide text-foreground hover:bg-muted"
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </section>
  )
}
