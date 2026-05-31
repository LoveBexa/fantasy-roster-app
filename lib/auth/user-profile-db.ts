import type { SupabaseClient } from "@supabase/supabase-js"
import { USER_PROFILES, TABLES } from "@/lib/db/columns"
import type { AccountEmoji } from "@/lib/auth/account-constants"
import { ACCOUNT_EMOJI_OPTIONS } from "@/lib/auth/account-constants"

export type UserProfileRow = {
  user_id: string
  nickname: string | null
  avatar_emoji: string | null
  onboarding_completed_at: string | null
}

const MISSING_TABLE_MESSAGE =
  "The user_profiles table is missing. Run supabase/migrations/008_user_profiles.sql in the Supabase SQL Editor."

function parseAvatarEmoji(value: unknown): AccountEmoji | null {
  if (typeof value !== "string") return null
  return ACCOUNT_EMOJI_OPTIONS.includes(value as AccountEmoji)
    ? (value as AccountEmoji)
    : null
}

function isMissingProfileTableError(error: { code?: string; message?: string } | null) {
  if (!error) return false
  return (
    error.code === "PGRST205" ||
    error.message?.includes("user_profiles") ||
    error.message?.includes("schema cache")
  )
}

export async function fetchUserProfileRow(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfileRow | null> {
  const { data, error } = await supabase
    .from(TABLES.userProfiles)
    .select(
      `${USER_PROFILES.userId}, ${USER_PROFILES.nickname}, ${USER_PROFILES.avatarEmoji}, ${USER_PROFILES.onboardingCompletedAt}`
    )
    .eq(USER_PROFILES.userId, userId)
    .maybeSingle()

  if (error) {
    if (isMissingProfileTableError(error)) return null
    return null
  }

  if (!data) return null

  return {
    user_id: data.user_id,
    nickname: data.nickname,
    avatar_emoji: data.avatar_emoji,
    onboarding_completed_at: data.onboarding_completed_at ?? null,
  }
}

export async function ensureUserProfileRow(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfileRow | null> {
  const existing = await fetchUserProfileRow(supabase, userId)
  if (existing) return existing

  const { data, error } = await supabase
    .from(TABLES.userProfiles)
    .upsert({ [USER_PROFILES.userId]: userId }, { onConflict: USER_PROFILES.userId })
    .select(
      `${USER_PROFILES.userId}, ${USER_PROFILES.nickname}, ${USER_PROFILES.avatarEmoji}, ${USER_PROFILES.onboardingCompletedAt}`
    )
    .single()

  if (error) {
    if (isMissingProfileTableError(error)) return null
    return null
  }

  if (!data) return null

  return {
    user_id: data.user_id,
    nickname: data.nickname,
    avatar_emoji: data.avatar_emoji,
    onboarding_completed_at: data.onboarding_completed_at ?? null,
  }
}

export async function completeDashboardOnboarding(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: new Error("Not signed in.") }
  }

  const completedAt = new Date().toISOString()

  const { error } = await supabase
    .from(TABLES.userProfiles)
    .upsert(
      {
        [USER_PROFILES.userId]: user.id,
        [USER_PROFILES.onboardingCompletedAt]: completedAt,
      },
      { onConflict: USER_PROFILES.userId }
    )

  if (error && isMissingProfileTableError(error)) {
    return { error: new Error(MISSING_TABLE_MESSAGE) }
  }

  if (error) {
    return { error: new Error(error.message) }
  }

  return { completedAt, error: null }
}

export async function saveUserProfile(
  supabase: SupabaseClient,
  updates: { nickname?: string; avatarEmoji?: AccountEmoji | null }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: new Error("Not signed in.") }
  }

  const payload: Record<string, string | null> = {}

  if (updates.nickname !== undefined) {
    payload[USER_PROFILES.nickname] = updates.nickname
  }

  if (updates.avatarEmoji !== undefined) {
    payload[USER_PROFILES.avatarEmoji] = updates.avatarEmoji
  }

  const { error } = await supabase
    .from(TABLES.userProfiles)
    .upsert({ [USER_PROFILES.userId]: user.id, ...payload }, { onConflict: USER_PROFILES.userId })

  if (error && isMissingProfileTableError(error)) {
    return { error: new Error(MISSING_TABLE_MESSAGE) }
  }

  return { error }
}

export function getAvatarEmojiFromProfileRow(row: UserProfileRow | null): AccountEmoji | null {
  if (!row?.avatar_emoji) return null
  return parseAvatarEmoji(row.avatar_emoji)
}
