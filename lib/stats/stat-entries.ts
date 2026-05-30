import type { SupabaseClient } from "@supabase/supabase-js"
import { toError } from "@/lib/supabase/errors"
import {
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

function formatLocalIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
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
