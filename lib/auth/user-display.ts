import type { User } from "@supabase/supabase-js"
import type { UserProfileRow } from "@/lib/auth/user-profile-db"
import { getAvatarEmojiFromProfileRow } from "@/lib/auth/user-profile-db"

export type UserDisplay = {
  name: string
  firstName: string
  email: string | null
  avatarUrl: string | null
  avatarEmoji: string | null
}

export function getUserDisplay(
  user: User | null,
  profileRow?: UserProfileRow | null
): UserDisplay | null {
  if (!user) return null

  const meta = user.user_metadata ?? {}
  const dbNickname = profileRow?.nickname?.trim() || null

  const name = dbNickname || user.email?.split("@")[0] || "there"

  const avatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null

  const avatarEmoji = getAvatarEmojiFromProfileRow(profileRow ?? null)

  return {
    name,
    firstName: name.split(/\s+/)[0] ?? name,
    email: user.email ?? null,
    avatarUrl,
    avatarEmoji,
  }
}
