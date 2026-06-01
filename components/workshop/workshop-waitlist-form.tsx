"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WorkshopWaitlistForm() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/workshop/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) {
        setError(data.error || "Could not join the waitlist.")
        return
      }

      setSuccessMessage(data.message || "You're on the waitlist.")
      setEmail("")
    } catch {
      setError("Could not join the waitlist. Try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <div>
        <Label htmlFor="workshop-email" className="text-xs font-bold uppercase tracking-wide">
          Email
        </Label>
        <Input
          id="workshop-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 h-11 rounded-lg border-border bg-background"
        />
      </div>

      {successMessage ? (
        <p
          className="rounded-lg border border-brand-green/30 bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green"
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-full bg-primary px-8 text-sm font-bold tracking-wide text-primary-foreground hover:bg-primary/90 sm:w-auto"
      >
        {isSubmitting ? "Joining..." : "Join the waitlist"}
      </Button>
    </form>
  )
}
