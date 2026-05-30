import type { User } from "@supabase/supabase-js"
import { ACCOUNT_EMOJI_OPTIONS, type AccountEmoji } from "@/lib/auth/account-constants"

export type UserProfile = {
  email: string | null
  googleName: string | null
  nickname: string | null
  avatarEmoji: AccountEmoji | null
  googleAvatarUrl: string | null
  isGoogleConnected: boolean
  providerLabel: string
}

function parseAvatarEmoji(value: unknown): AccountEmoji | null {
  if (typeof value !== "string") return null
  return ACCOUNT_EMOJI_OPTIONS.includes(value as AccountEmoji)
    ? (value as AccountEmoji)
    : null
}

export function parseAvatarEmojiFromMeta(value: unknown): AccountEmoji | null {
  return parseAvatarEmoji(value)
}

export function getUserProfile(user: User | null): UserProfile | null {
  if (!user) return null

  const meta = user.user_metadata ?? {}
  const googleIdentity = user.identities?.find((identity) => identity.provider === "google")

  const googleName =
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.name === "string" && meta.name) ||
    null

  const googleAvatarUrl =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    null

  return {
    email: user.email ?? null,
    googleName,
    nickname: typeof meta.nickname === "string" ? meta.nickname : null,
    avatarEmoji: parseAvatarEmoji(meta.avatar_emoji),
    googleAvatarUrl,
    isGoogleConnected: Boolean(googleIdentity),
    providerLabel: googleIdentity ? "Google Account" : "Account",
  }
}
