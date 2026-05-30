"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppleIcon, GoogleIcon, StarDoodle } from "@/components/doodles"
import { createClient } from "@/lib/supabase/client"

const emailPasswordDisabled = true

export function LoginForm() {
  const [googleLoading, setGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setAuthError(null)
    setGoogleLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setAuthError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-md py-4">
      <StarDoodle className="absolute -top-2 right-0 size-12 text-muted-foreground/50" />

      <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground text-balance">
        Welcome back, Roster Boss.
      </h1>
      <p className="mt-2 font-script text-2xl text-primary">
        Log in to check your league.
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            disabled={emailPasswordDisabled}
            className="h-12 rounded-lg border-border bg-card px-4 text-base disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              disabled={emailPasswordDisabled}
              className="h-12 rounded-lg border-border bg-card px-4 pr-12 text-base disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              disabled={emailPasswordDisabled}
              aria-label="Show password"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Eye className="size-5" />
            </button>
          </div>
        </div>

        <span
          className="inline-block text-sm font-semibold text-muted-foreground/60 cursor-not-allowed"
          aria-disabled="true"
        >
          Forgot your password?
        </span>

        <Button
          type="button"
          disabled={emailPasswordDisabled}
          className="h-12 w-full rounded-full bg-primary text-sm font-bold tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          LOG IN
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {authError ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {authError}
        </p>
      ) : null}

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          disabled={googleLoading}
          onClick={handleGoogleLogin}
          className="h-12 w-full justify-center gap-3 rounded-lg border-border bg-card font-semibold text-foreground hover:bg-muted"
        >
          <GoogleIcon className="size-5" />
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled
          className="h-12 w-full justify-center gap-3 rounded-lg border-border bg-card font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AppleIcon className="size-5" />
          Continue with Apple
        </Button>
      </div>

      <p className="mt-8 text-center text-sm font-semibold text-foreground">
        Don&apos;t have an account?{" "}
        <Link href="#" className="font-script text-xl text-primary hover:underline">
          Sign up
        </Link>
        <span aria-hidden className="ml-1 text-primary">↗</span>
      </p>
    </div>
  )
}
