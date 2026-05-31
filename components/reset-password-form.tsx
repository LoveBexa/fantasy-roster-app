"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { StarDoodle } from "@/components/doodles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)

    if (password !== confirmPassword) {
      setAuthError("Passwords don't match.")
      return
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

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
        Set a new password
      </h1>
      <p className="mt-2 font-script text-2xl text-primary">
        Pick something you&apos;ll remember.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handlePasswordReset}>
        <div className="space-y-2">
          <Label htmlFor="new-password" className="sr-only">
            New password
          </Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
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
          <Label htmlFor="confirm-new-password" className="sr-only">
            Confirm new password
          </Label>
          <Input
            id="confirm-new-password"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
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

        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-primary text-sm font-bold tracking-widest text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "UPDATE PASSWORD"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm font-semibold text-foreground">
        Link expired?{" "}
        <Link href="/forgot-password" className="font-script text-xl text-primary hover:underline">
          Request a new one
        </Link>
        <span aria-hidden className="ml-1 text-primary">
          ↗
        </span>
      </p>
    </div>
  )
}
