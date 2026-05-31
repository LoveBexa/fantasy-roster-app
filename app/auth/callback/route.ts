import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { sanitizeAuthNextPath } from "@/lib/auth/callback-url"

function getRedirectOrigin(request: NextRequest) {
  const { origin } = new URL(request.url)
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocalEnv = process.env.NODE_ENV === "development"

  if (isLocalEnv || !forwardedHost) {
    return origin
  }

  const protocol = request.headers.get("x-forwarded-proto") ?? "https"
  return `${protocol}://${forwardedHost}`
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
