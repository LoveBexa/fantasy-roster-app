import type { User } from "@supabase/supabase-js"
import { parseAvatarEmojiFromMeta } from "@/lib/auth/user-profile"

export type UserDisplay = {
  name: string
  firstName: string
  email: string | null
  avatarUrl: string | null
  avatarEmoji: string | null
}

export function getUserDisplay(user: User | null): UserDisplay | null {
  if (!user) return null

  const meta = user.user_metadata ?? {}

  const nickname = typeof meta.nickname === "string" ? meta.nickname : null

  const name =
    nickname ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    user.email?.split("@")[0] ||
    "there"

  const avatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null

  const avatarEmoji = parseAvatarEmojiFromMeta(meta.avatar_emoji)

  return {
    name,
    firstName: name.split(/\s+/)[0] ?? name,
    email: user.email ?? null,
    avatarUrl,
    avatarEmoji,
  }
}
