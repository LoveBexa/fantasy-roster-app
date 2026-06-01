import { NextResponse } from "next/server"
import { addEmailToMailchimpAudience } from "@/lib/mailchimp/client"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  let body: { email?: string }

  try {
    body = (await request.json()) as { email?: string }
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase() ?? ""

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  }

  const result = await addEmailToMailchimpAudience(email)

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 500 })
  }

  return NextResponse.json({
    message: result.alreadySubscribed
      ? "You're already on the waitlist."
      : "You're on the waitlist. We'll be in touch.",
  })
}
