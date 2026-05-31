import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSiteOrigin, sanitizeAuthNextPath } from "@/lib/auth/callback-url"

function getRedirectOrigin(request: NextRequest) {
  const configured = getSiteOrigin()
  if (configured) return configured

  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = forwardedHost ?? request.headers.get("host")

  if (host) {
    const protocol =
      request.headers.get("x-forwarded-proto") ??
      (host.startsWith("localhost") ? "http" : "https")
    return `${protocol}://${host}`
  }

  return new URL(request.url).origin
}

export async function GET(request: NextRequest) {
  const origin = getRedirectOrigin(request)
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = sanitizeAuthNextPath(searchParams.get("next"))

  if (code) {
    const redirectUrl = `${origin}${next}`
    let supabaseResponse = NextResponse.redirect(redirectUrl)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            supabaseResponse = NextResponse.redirect(redirectUrl)
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return supabaseResponse
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
