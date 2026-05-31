import type { User } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getUserDisplay } from "@/lib/auth/user-display"
import { buildUserProfile } from "@/lib/auth/user-profile"
import {
  ensureUserProfileRow,
  type UserProfileRow,
} from "@/lib/auth/user-profile-db"

export async function getSessionUserContext(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const profileRow = await ensureUserProfileRow(supabase, user.id)

  return {
    user,
    profileRow,
    display: getUserDisplay(user, profileRow),
    profile: buildUserProfile(user, profileRow),
  }
}

export type SessionUserContext = NonNullable<Awaited<ReturnType<typeof getSessionUserContext>>>

export type { UserProfileRow }
