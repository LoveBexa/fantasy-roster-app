import type { SupabaseClient } from "@supabase/supabase-js"
import { toError } from "@/lib/supabase/errors"
import { ROSTER_PLAYERS, TABLES } from "@/lib/db/columns"
import type {
  Player,
  PlayerStatus,
  RelationshipStatus,
} from "@/components/roster/roster-types"

export type RosterPlayerRow = {
  id: string
  user_id: string
  nickname: string
  description?: string | null
  emoji?: string | null
  status: string
  relationship_status?: string | null
  notes?: string | null
  photo_url?: string | null
  created_at: string
  updated_at?: string | null
}

export type PlayerInput = Omit<Player, "id" | "addedDate" | "lastUpdated">

function formatDisplayDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function rowToPlayer(row: RosterPlayerRow): Player {
  return {
    id: row.id,
    nickname: row.nickname,
    description: row.description ?? "",
    emoji: row.emoji ?? "😎",
    status: row.status as PlayerStatus,
    relationshipStatus: (row.relationship_status ?? null) as RelationshipStatus | null,
    notes: row.notes ?? undefined,
    photoUrl: row.photo_url ?? undefined,
    addedDate: formatDisplayDate(row.created_at),
    lastUpdated: formatDisplayDate(row.updated_at ?? row.created_at),
  }
}

function playerToRow(player: PlayerInput) {
  return {
    nickname: player.nickname,
    description: player.description,
    emoji: player.emoji,
    status: player.status,
    relationship_status: player.relationshipStatus,
    notes: player.notes ?? null,
    photo_url: player.photoUrl ?? null,
  }
}

export async function fetchRosterPlayers(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from(TABLES.rosterPlayers)
    .select("*")
    .order(ROSTER_PLAYERS.createdAt, { ascending: false })

  if (error) throw toError(error, "Could not load roster players.")
  return (data as RosterPlayerRow[]).map(rowToPlayer)
}

export async function createRosterPlayer(
  supabase: SupabaseClient,
  userId: string,
  player: PlayerInput
) {
  const { data, error } = await supabase
    .from(TABLES.rosterPlayers)
    .insert({
      [ROSTER_PLAYERS.userId]: userId,
      ...playerToRow(player),
    })
    .select("*")
    .single()

  if (error) throw toError(error, "Could not create roster player.")
  return rowToPlayer(data as RosterPlayerRow)
}

export async function updateRosterPlayer(
  supabase: SupabaseClient,
  player: Player
) {
  const { data, error } = await supabase
    .from(TABLES.rosterPlayers)
    .update({
      [ROSTER_PLAYERS.nickname]: player.nickname,
      [ROSTER_PLAYERS.description]: player.description,
      [ROSTER_PLAYERS.emoji]: player.emoji,
      [ROSTER_PLAYERS.status]: player.status,
      [ROSTER_PLAYERS.relationshipStatus]: player.relationshipStatus,
      [ROSTER_PLAYERS.notes]: player.notes ?? null,
      [ROSTER_PLAYERS.photoUrl]: player.photoUrl ?? null,
    })
    .eq(ROSTER_PLAYERS.id, player.id)
    .select("*")
    .single()

  if (error) throw toError(error, "Could not update roster player.")
  return rowToPlayer(data as RosterPlayerRow)
}

export async function deleteRosterPlayer(supabase: SupabaseClient, id: string) {
  const { error } = await supabase
    .from(TABLES.rosterPlayers)
    .delete()
    .eq(ROSTER_PLAYERS.id, id)
  if (error) throw toError(error, "Could not delete roster player.")
}
