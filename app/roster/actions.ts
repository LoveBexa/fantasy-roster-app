"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import {
  createRosterPlayer,
  deleteRosterPlayer,
  fetchRosterPlayerCount,
  updateRosterPlayer,
  type PlayerInput,
} from "@/lib/roster/players"
import {
  canAddRosterPlayer,
  FREE_TIER_LIMIT_REACHED_TITLE,
} from "@/lib/roster/tier-limits"
import type { Player } from "@/components/roster/roster-types"
import { toError } from "@/lib/supabase/errors"

function rlsHint(message: string) {
  if (!message.includes("row-level security")) return message
  return `${message} Try logging out and back in. If it persists, run migration 011 in Supabase SQL Editor.`
}

export async function createRosterPlayerAction(input: PlayerInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Sign in to add players." }
  }

  const currentCount = await fetchRosterPlayerCount(supabase)
  if (!canAddRosterPlayer(currentCount)) {
    return { error: FREE_TIER_LIMIT_REACHED_TITLE }
  }

  try {
    await createRosterPlayer(supabase, input)
    revalidatePath("/roster")
    revalidatePath("/dashboard")
    return { success: true as const }
  } catch (err) {
    return { error: rlsHint(toError(err, "Could not add player.").message) }
  }
}

export async function updateRosterPlayerAction(player: Player) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Sign in to edit players." }
  }

  try {
    await updateRosterPlayer(supabase, player)
    revalidatePath("/roster")
    revalidatePath("/dashboard")
    return { success: true as const }
  } catch (err) {
    return { error: rlsHint(toError(err, "Could not update player.").message) }
  }
}

export async function deleteRosterPlayerAction(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Sign in to delete players." }
  }

  try {
    await deleteRosterPlayer(supabase, id)
    revalidatePath("/roster")
    revalidatePath("/dashboard")
    return { success: true as const }
  } catch (err) {
    return { error: rlsHint(toError(err, "Could not delete player.").message) }
  }
}
