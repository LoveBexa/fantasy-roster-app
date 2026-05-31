"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { StarDoodle } from "@/components/doodles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { getAuthCallbackUrl } from "@/lib/auth/callback-url"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)
    setSuccessMessage(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthCallbackUrl("/reset-password", window.location.origin),
    })

    if (error) {
      setAuthError(error.message)
      setLoading(false)
      return
    }

    setSuccessMessage("Check your email for a password reset link.")
    setLoading(false)
  }

  return (
    <div className="relative mx-auto w-full max-w-md py-4">
      <StarDoodle className="absolute -top-2 right-0 size-12 text-muted-foreground/50" />

      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance">
        Forgot your password?
      </h1>
      <p className="mt-2 font-script text-2xl text-primary">
        We&apos;ll email you a reset link.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        This only applies to email and password accounts. If you signed up with Google,
        reset your password through your Google account instead.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleResetRequest}>
        <div className="space-y-2">
          <Label htmlFor="reset-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="reset-email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded-lg border-border bg-card px-4 text-base"
          />
        </div>

        {authError ? (
          <p className="text-sm text-destructive" role="alert">
            {authError}
          </p>
        ) : null}

        {successMessage ? (
          <p className="text-sm text-primary" role="status">
            {successMessage}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-primary text-sm font-bold tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "SEND RESET LINK"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm font-semibold text-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-script text-xl text-primary hover:underline">
          Log in
        </Link>
        <span aria-hidden className="ml-1 text-primary">
          ↗
        </span>
      </p>
    </div>
  )
}
