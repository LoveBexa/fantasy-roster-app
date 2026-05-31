"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleIcon, StarDoodle } from "@/components/doodles"
import { createClient } from "@/lib/supabase/client"
import { getOAuthCallbackUrl } from "@/lib/auth/callback-url"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setAuthError(null)
    setGoogleLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthCallbackUrl(),
      },
    })

    if (error) {
      setAuthError(error.message)
      setGoogleLoading(false)
    }
  }

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setAuthError(error.message)
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="relative mx-auto w-full max-w-md py-4">
      <StarDoodle className="absolute -top-2 right-0 size-12 text-muted-foreground/50" />

      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance">
        Welcome back, Roster Queen.
      </h1>
      <p className="mt-2 font-script text-2xl text-primary">
        Log in to check your league.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleEmailLogin}>
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-lg border-border bg-card px-4 pr-12 text-base"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <Link
          href="/forgot-password"
          className="inline-block text-sm font-semibold text-primary hover:underline"
        >
          Forgot your password?
        </Link>

        {authError ? (
          <p className="text-sm text-destructive" role="alert">
            {authError}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading || googleLoading}
          className="h-12 w-full rounded-full bg-primary text-sm font-bold tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "LOG IN"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={googleLoading || loading}
        onClick={handleGoogleLogin}
        className="h-12 w-full justify-center gap-3 rounded-lg border-border bg-card font-semibold text-foreground hover:bg-muted"
      >
        <GoogleIcon className="size-5" />
        {googleLoading ? "Redirecting..." : "Continue with Google"}
      </Button>

      <p className="mt-8 text-center text-sm font-semibold text-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-script text-xl text-primary hover:underline">
          Sign up
        </Link>
        <span aria-hidden className="ml-1 text-primary">
          ↗
        </span>
      </p>
    </div>
  )
}
