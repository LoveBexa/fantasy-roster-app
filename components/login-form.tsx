"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AppleIcon, GoogleIcon, StarDoodle } from "@/components/doodles"
import { createClient } from "@/lib/supabase/client"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
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
        Welcome back, Boss Babe.
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
            className="h-12 rounded-lg border-border bg-card px-4 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              className="h-12 rounded-lg border-border bg-card px-4 pr-12 text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <Link
          href="#"
          className="inline-block text-sm font-semibold text-foreground hover:text-primary"
        >
          Forgot your password?
        </Link>

        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-primary text-sm font-bold tracking-widest text-primary-foreground hover:bg-primary/90"
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
          variant="outline"
          className="h-12 w-full justify-center gap-3 rounded-lg border-border bg-card font-semibold text-foreground hover:bg-muted"
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
