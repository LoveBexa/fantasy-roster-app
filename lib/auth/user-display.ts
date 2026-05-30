import type { User } from "@supabase/supabase-js"

export type UserDisplay = {
  name: string
  firstName: string
  email: string | null
  avatarUrl: string | null
}

export function getUserDisplay(user: User | null): UserDisplay | null {
  if (!user) return null

  const meta = user.user_metadata ?? {}

  const name =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    user.email?.split("@")[0] ||
    "there"

  const avatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null

  return {
    name,
    firstName: name.split(/\s+/)[0] ?? name,
    email: user.email ?? null,
    avatarUrl,
  }
}
