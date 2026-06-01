type MailchimpConfig = {
  apiKey: string
  audienceId: string
  baseUrl: string
}

export function getMailchimpConfig(): MailchimpConfig | null {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

  if (!apiKey || !audienceId) {
    return null
  }

  const dataCenter = apiKey.split("-").pop()
  if (!dataCenter) {
    return null
  }

  return {
    apiKey,
    audienceId,
    baseUrl: `https://${dataCenter}.api.mailchimp.com/3.0`,
  }
}

type AddToAudienceResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; message: string }

export async function addEmailToMailchimpAudience(
  email: string
): Promise<AddToAudienceResult> {
  const config = getMailchimpConfig()

  if (!config) {
    return { ok: false, message: "Waitlist is not configured yet." }
  }

  const response = await fetch(
    `${config.baseUrl}/lists/${config.audienceId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    }
  )

  if (response.ok) {
    return { ok: true, alreadySubscribed: false }
  }

  let payload: { title?: string; detail?: string } | null = null

  try {
    payload = (await response.json()) as { title?: string; detail?: string }
  } catch {
    payload = null
  }

  if (payload?.title === "Member Exists") {
    return { ok: true, alreadySubscribed: true }
  }

  return {
    ok: false,
    message: payload?.detail || payload?.title || "Could not join the waitlist.",
  }
}
