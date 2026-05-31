import type { SupabaseClient } from "@supabase/supabase-js"
import { toError } from "@/lib/supabase/errors"
import {
  ROSTER_PLAYERS,
  SCORING_BEHAVIORS,
  STAT_ENTRIES,
  STAT_ENTRY_BEHAVIORS,
  TABLES,
} from "@/lib/db/columns"

export type ScoringBehaviorRow = {
  id: string
  category: string
  behavior: string
  points: number
  description: string | null
}

export function groupBehaviorsByCategory(behaviors: ScoringBehaviorRow[]) {
  const groups = new Map<string, ScoringBehaviorRow[]>()

  for (const row of behaviors) {
    const existing = groups.get(row.category) ?? []
    existing.push(row)
    groups.set(row.category, existing)
  }

  return Array.from(groups.entries())
}

export async function fetchScoringBehaviors(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from(TABLES.scoringBehaviors)
    .select(
      `${SCORING_BEHAVIORS.id}, ${SCORING_BEHAVIORS.category}, ${SCORING_BEHAVIORS.behavior}, ${SCORING_BEHAVIORS.points}, ${SCORING_BEHAVIORS.description}`
    )
    .order(SCORING_BEHAVIORS.category, { ascending: true })
    .order(SCORING_BEHAVIORS.points, { ascending: false })

  if (error) throw toError(error, "Could not load scoring behaviors.")
  return (data ?? []) as ScoringBehaviorRow[]
}

export type SaveStatEntryInput = {
  player_id: string
  entry_date: string
  notes: string | null
  behavior_ids: string[]
  total_points: number
}

export type FormChartPoint = {
  day: string
  value: number
}

export type RecentStatEntryBehavior = {
  behavior: string
  points: number
}

export type RecentStatEntry = {
  id: string
  entryDate: string
  entryDateShort: string
  notes: string | null
  totalPoints: number
  playerId: string
  playerNickname: string
  playerEmoji: string
  behaviors: RecentStatEntryBehavior[]
}

export type RecentStatEntriesResult = {
  entries: RecentStatEntry[]
  totalCount: number
}

const RECENT_ENTRIES_LIMIT = 10

type StatEntryBehaviorLink = {
  scoring_behaviors:
    | { behavior: string; points: number }
    | { behavior: string; points: number }[]
    | null
}

type StatEntryRowRaw = {
  id: string
  entry_date: string
  notes: string | null
  total_points: number
  player_id: string
  roster_players:
    | { nickname: string; emoji: string }
    | { nickname: string; emoji: string }[]
    | null
  stat_entry_behaviors: StatEntryBehaviorLink[] | null
}

function normalizePlayer(
  roster: StatEntryRowRaw["roster_players"]
): { nickname: string; emoji: string } | null {
  if (!roster) return null
  return Array.isArray(roster) ? (roster[0] ?? null) : roster
}

function normalizeBehavior(
  link: StatEntryBehaviorLink
): { behavior: string; points: number } | null {
  const raw = link.scoring_behaviors
  if (!raw) return null
  return Array.isArray(raw) ? (raw[0] ?? null) : raw
}

function formatEntryDisplayDate(isoDate: string) {
  const parsed = new Date(`${isoDate}T12:00:00`)
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatEntryShortDate(isoDate: string) {
  const parsed = new Date(`${isoDate}T12:00:00`)
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function getRecentEntryLabel(entry: RecentStatEntry) {
  if (entry.behaviors.length > 0) return entry.behaviors[0].behavior
  if (entry.notes?.trim()) return entry.notes.trim()
  return "Entry logged"
}

function rowToRecentEntry(row: StatEntryRowRaw): RecentStatEntry {
  const player = normalizePlayer(row.roster_players)
  const behaviors =
    row.stat_entry_behaviors
      ?.map(normalizeBehavior)
      .filter((b): b is { behavior: string; points: number } => b != null) ?? []

  return {
    id: row.id,
    entryDate: formatEntryDisplayDate(row.entry_date),
    entryDateShort: formatEntryShortDate(row.entry_date),
    notes: row.notes,
    totalPoints: row.total_points,
    playerId: row.player_id,
    playerNickname: player?.nickname ?? "Unknown",
    playerEmoji: player?.emoji ?? "😎",
    behaviors,
  }
}

function formatLocalIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export async function fetchPlayerEntryPointsForDate(
  supabase: SupabaseClient,
  playerId: string,
  entryDate: string
): Promise<number> {
  if (!playerId) return 0

  const { data, error } = await supabase
    .from(TABLES.statEntries)
    .select(STAT_ENTRIES.totalPoints)
    .eq(STAT_ENTRIES.playerId, playerId)
    .eq(STAT_ENTRIES.entryDate, entryDate)
    .maybeSingle()

  if (error) throw toError(error, "Could not load entry points for this date.")

  if (!data) return 0
  return Number((data as Record<string, number>)[STAT_ENTRIES.totalPoints])
}

export async function fetchPlayerWeeklyForm(
  supabase: SupabaseClient,
  playerId: string
): Promise<FormChartPoint[]> {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 6)

  const { data, error } = await supabase
    .from(TABLES.statEntries)
    .select(`${STAT_ENTRIES.entryDate}, ${STAT_ENTRIES.totalPoints}`)
    .eq(STAT_ENTRIES.playerId, playerId)
    .gte(STAT_ENTRIES.entryDate, formatLocalIsoDate(start))
    .lte(STAT_ENTRIES.entryDate, formatLocalIsoDate(end))
    .order(STAT_ENTRIES.entryDate, { ascending: true })

  if (error) throw toError(error, "Could not load form chart.")

  const pointsByDate = new Map<string, number>()
  for (const row of data ?? []) {
    const entry = row as Record<string, string | number>
    pointsByDate.set(String(entry[STAT_ENTRIES.entryDate]), Number(entry[STAT_ENTRIES.totalPoints]))
  }

  const chart: FormChartPoint[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const iso = formatLocalIsoDate(date)
    chart.push({
      day: date.toLocaleDateString("en-US", { weekday: "narrow" }),
      value: pointsByDate.get(iso) ?? 0,
    })
  }

  return chart
}

export async function saveStatEntry(
  supabase: SupabaseClient,
  userId: string,
  input: SaveStatEntryInput
) {
  const { data: entry, error: entryError } = await supabase
    .from(TABLES.statEntries)
    .insert({
      [STAT_ENTRIES.userId]: userId,
      [STAT_ENTRIES.playerId]: input.player_id,
      [STAT_ENTRIES.entryDate]: input.entry_date,
      [STAT_ENTRIES.notes]: input.notes,
      [STAT_ENTRIES.totalPoints]: input.total_points,
    })
    .select(STAT_ENTRIES.id)
    .single()

  if (entryError) throw toError(entryError, "Could not save stat entry.")

  const entryId = entry.id as string

  const { error: insertError } = await supabase
    .from(TABLES.statEntryBehaviors)
    .insert(
      input.behavior_ids.map((behavior_id) => ({
        [STAT_ENTRY_BEHAVIORS.entryId]: entryId,
        [STAT_ENTRY_BEHAVIORS.behaviorId]: behavior_id,
      }))
    )

  if (insertError) throw toError(insertError, "Could not save stat entry behaviors.")

  try {
    const { syncLeagueSnapshots } = await import("@/lib/league/league-table")
    await syncLeagueSnapshots(supabase, userId)
  } catch {
    // Optional until league_player_snapshots migration is applied.
  }

  return entryId
}

export async function fetchWeeklyPointsTotal(supabase: SupabaseClient): Promise<number> {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 6)

  const { data, error } = await supabase
    .from(TABLES.statEntries)
    .select(STAT_ENTRIES.totalPoints)
    .gte(STAT_ENTRIES.entryDate, formatLocalIsoDate(start))
    .lte(STAT_ENTRIES.entryDate, formatLocalIsoDate(end))

  if (error) throw toError(error, "Could not load weekly summary.")

  return (data ?? []).reduce(
    (sum, row) => sum + Number((row as Record<string, number>)[STAT_ENTRIES.totalPoints]),
    0
  )
}

export async function fetchRecentStatEntries(
  supabase: SupabaseClient,
  limit = RECENT_ENTRIES_LIMIT
): Promise<RecentStatEntriesResult> {
  const [{ data, error }, { count, error: countError }] = await Promise.all([
    supabase
      .from(TABLES.statEntries)
      .select(
        `
        ${STAT_ENTRIES.id},
        ${STAT_ENTRIES.entryDate},
        ${STAT_ENTRIES.notes},
        ${STAT_ENTRIES.totalPoints},
        ${STAT_ENTRIES.playerId},
        roster_players (
          ${ROSTER_PLAYERS.nickname},
          ${ROSTER_PLAYERS.emoji}
        ),
        stat_entry_behaviors (
          scoring_behaviors (
            ${SCORING_BEHAVIORS.behavior},
            ${SCORING_BEHAVIORS.points}
          )
        )
      `
      )
      .order(STAT_ENTRIES.createdAt, { ascending: false })
      .limit(limit),
    supabase
      .from(TABLES.statEntries)
      .select("*", { count: "exact", head: true }),
  ])

  if (error) throw toError(error, "Could not load recent entries.")
  if (countError) throw toError(countError, "Could not count stat entries.")

  return {
    entries: ((data ?? []) as StatEntryRowRaw[]).map(rowToRecentEntry),
    totalCount: count ?? 0,
  }
}

export async function deleteStatEntry(supabase: SupabaseClient, entryId: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("Sign in to delete entries.")
  }

  const { error } = await supabase
    .from(TABLES.statEntries)
    .delete()
    .eq(STAT_ENTRIES.id, entryId)

  if (error) throw toError(error, "Could not delete entry.")

  try {
    const { syncLeagueSnapshots } = await import("@/lib/league/league-table")
    await syncLeagueSnapshots(supabase, user.id)
  } catch {
    // Optional until league_player_snapshots migration is applied.
  }
}
