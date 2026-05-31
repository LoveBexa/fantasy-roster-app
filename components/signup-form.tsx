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
import {
  DEFAULT_POST_AUTH_PATH,
  getAuthCallbackUrl,
  getOAuthCallbackUrl,
} from "@/lib/auth/callback-url"
import { saveUserProfile } from "@/lib/auth/user-profile-db"

export function SignupForm() {
  const router = useRouter()
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleGoogleSignup() {
    setAuthError(null)
    setSuccessMessage(null)
    setGoogleLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getOAuthCallbackUrl(window.location.origin),
      },
    })

    if (error) {
      setAuthError(error.message)
      setGoogleLoading(false)
    }
  }

  async function handleEmailSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)
    setSuccessMessage(null)

    if (password !== confirmPassword) {
      setAuthError("Passwords don't match.")
      return
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.")
      return
    }

    const trimmedNickname = nickname.trim()

    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: trimmedNickname ? { nickname: trimmedNickname } : undefined,
        emailRedirectTo: getAuthCallbackUrl(
          window.location.origin,
          DEFAULT_POST_AUTH_PATH
        ),
      },
    })

    if (error) {
      setAuthError(error.message)
      setLoading(false)
      return
    }

    if (data.session && data.user) {
      if (trimmedNickname) {
        await saveUserProfile(supabase, { nickname: trimmedNickname })
      }
      router.push("/dashboard")
      router.refresh()
      return
    }

    setSuccessMessage("Check your email to confirm your account, then log in.")
    setLoading(false)
  }

  return (
    <div className="relative mx-auto w-full max-w-md py-4">
      <StarDoodle className="absolute -top-2 right-0 size-12 text-muted-foreground/50" />

      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground text-balance">
        Join the league, Roster Queen.
      </h1>
      <p className="mt-2 font-script text-2xl text-primary">
        Create your account and start ranking.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleEmailSignup}>
        <div className="space-y-2">
          <Label htmlFor="signup-nickname" className="sr-only">
            Nickname
          </Label>
          <Input
            id="signup-nickname"
            type="text"
            placeholder="Your name / nickname"
            autoComplete="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className="h-12 rounded-lg border-border bg-card px-4 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="signup-email"
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
          <Label htmlFor="signup-password" className="sr-only">
            Password
          </Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              required
              minLength={6}
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

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password" className="sr-only">
            Confirm password
          </Label>
          <Input
            id="signup-confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
          disabled={loading || googleLoading}
          className="h-12 w-full rounded-full bg-primary text-sm font-bold tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "SIGN UP"}
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
        onClick={handleGoogleSignup}
        className="h-12 w-full justify-center gap-3 rounded-lg border-border bg-card font-semibold text-foreground hover:bg-muted"
      >
        <GoogleIcon className="size-5" />
        {googleLoading ? "Redirecting..." : "Continue with Google"}
      </Button>

      <p className="mt-8 text-center text-sm font-semibold text-foreground">
        Already have an account?{" "}
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
