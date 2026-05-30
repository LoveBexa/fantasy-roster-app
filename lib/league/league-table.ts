import type { SupabaseClient } from "@supabase/supabase-js"
import { toError } from "@/lib/supabase/errors"
import {
  LEAGUE_PLAYER_SNAPSHOTS,
  ROSTER_PLAYERS,
  SCORING_BEHAVIORS,
  STAT_ENTRIES,
  STAT_ENTRY_BEHAVIORS,
  TABLES,
} from "@/lib/db/columns"
import type { RosterPlayerRow } from "@/lib/roster/players"

export type LeaguePeriod = "Overall" | "This Season" | "This Month" | "This Week"

export type LeagueTableRow = {
  playerId: string
  rank: number
  nickname: string
  emoji: string
  tint: string
  points: number
  delta: number
  form: ("up" | "down")[]
  consistency: number
}

type StatEntryRow = {
  player_id: string
  entry_date: string
  total_points: number
}

type BehaviorPointsRow = {
  player_id: string
  points: number
}

const PLAYER_TINTS = [
  "bg-brand-pink/50",
  "bg-accent/50",
  "bg-brand-green/40",
  "bg-muted",
  "bg-brand-pink/30",
] as const

export function formatLocalIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getPeriodStart(period: LeaguePeriod): string | null {
  const now = new Date()

  if (period === "Overall") return null

  if (period === "This Week") {
    const start = new Date(now)
    start.setDate(now.getDate() - 6)
    return formatLocalIsoDate(start)
  }

  if (period === "This Month") {
    return formatLocalIsoDate(new Date(now.getFullYear(), now.getMonth(), 1))
  }

  return formatLocalIsoDate(new Date(now.getFullYear(), 0, 1))
}

function filterEntriesByPeriod(entries: StatEntryRow[], period: LeaguePeriod) {
  const start = getPeriodStart(period)
  if (!start) return entries
  return entries.filter((entry) => entry.entry_date >= start)
}

function sumPointsByPlayer(entries: StatEntryRow[]) {
  const totals = new Map<string, number>()
  for (const entry of entries) {
    totals.set(entry.player_id, (totals.get(entry.player_id) ?? 0) + entry.total_points)
  }
  return totals
}

function computeDelta(playerEntries: StatEntryRow[]) {
  const sorted = [...playerEntries].sort((a, b) => b.entry_date.localeCompare(a.entry_date))
  if (sorted.length === 0) return 0
  if (sorted.length === 1) return sorted[0].total_points
  return sorted[0].total_points - sorted[1].total_points
}

function rankPlayersByTotals(
  playerIds: string[],
  totals: Map<string, number>,
  nicknames: Map<string, string>
) {
  return [...playerIds]
    .map((playerId) => ({
      playerId,
      total: totals.get(playerId) ?? 0,
      nickname: nicknames.get(playerId) ?? "",
    }))
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total
      return a.nickname.localeCompare(b.nickname)
    })
    .map((row, index) => ({
      playerId: row.playerId,
      rank: index + 1,
      total: row.total,
    }))
}

function buildCumulativeRankHistory(
  playerIds: string[],
  allEntries: StatEntryRow[],
  nicknames: Map<string, string>
) {
  const dates = [...new Set(allEntries.map((entry) => entry.entry_date))].sort()
  const history = new Map<string, Map<string, number>>()

  for (const date of dates) {
    const entriesUpToDate = allEntries.filter((entry) => entry.entry_date <= date)
    const totals = sumPointsByPlayer(entriesUpToDate)
    const ranked = rankPlayersByTotals(playerIds, totals, nicknames)
    const ranksForDate = new Map<string, number>()
    for (const row of ranked) {
      ranksForDate.set(row.playerId, row.rank)
    }
    history.set(date, ranksForDate)
  }

  return history
}

function computeForm(
  playerId: string,
  rankHistory: Map<string, Map<string, number>>
): ("up" | "down")[] {
  const dates = [...rankHistory.keys()].sort().reverse()
  const form: ("up" | "down")[] = []

  for (let i = 0; i < dates.length - 1 && form.length < 3; i++) {
    const currentRank = rankHistory.get(dates[i])?.get(playerId)
    const previousRank = rankHistory.get(dates[i + 1])?.get(playerId)

    if (currentRank == null || previousRank == null) continue
    if (currentRank === previousRank) continue

    form.push(currentRank < previousRank ? "up" : "down")
  }

  return form.reverse()
}

function computeConsistency(positivePoints: number, totalInteractionPoints: number) {
  if (totalInteractionPoints <= 0) return 0
  return Math.min(100, Math.round((positivePoints / totalInteractionPoints) * 100))
}

async function fetchBehaviorPointsLast30Days(supabase: SupabaseClient, userId: string) {
  return fetchBehaviorPointsFallback(supabase, userId)
}

async function fetchBehaviorPointsFallback(
  supabase: SupabaseClient,
  userId: string
) {
  const since = formatLocalIsoDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

  const { data: entries, error: entriesError } = await supabase
    .from(TABLES.statEntries)
    .select(`${STAT_ENTRIES.id}, ${STAT_ENTRIES.playerId}`)
    .eq(STAT_ENTRIES.userId, userId)
    .gte(STAT_ENTRIES.entryDate, since)

  if (entriesError) throw toError(entriesError, "Could not load consistency data.")

  const entryIds = (entries ?? []).map((row) => (row as Record<string, string>).id)
  if (entryIds.length === 0) return new Map<string, { positive: number; total: number }>()

  const { data: links, error: linksError } = await supabase
    .from(TABLES.statEntryBehaviors)
    .select(`${STAT_ENTRY_BEHAVIORS.entryId}, ${STAT_ENTRY_BEHAVIORS.behaviorId}`)
    .in(STAT_ENTRY_BEHAVIORS.entryId, entryIds)

  if (linksError) throw toError(linksError, "Could not load consistency data.")

  const behaviorIds = [
    ...new Set(
      (links ?? []).map((row) => (row as Record<string, string>)[STAT_ENTRY_BEHAVIORS.behaviorId])
    ),
  ]

  if (behaviorIds.length === 0) return new Map<string, { positive: number; total: number }>()

  const { data: behaviors, error: behaviorsError } = await supabase
    .from(TABLES.scoringBehaviors)
    .select(`${SCORING_BEHAVIORS.id}, ${SCORING_BEHAVIORS.points}`)
    .in(SCORING_BEHAVIORS.id, behaviorIds)

  if (behaviorsError) throw toError(behaviorsError, "Could not load consistency data.")

  const pointsByBehaviorId = new Map<string, number>()
  for (const row of behaviors ?? []) {
    const record = row as Record<string, number | string>
    pointsByBehaviorId.set(String(record[SCORING_BEHAVIORS.id]), Number(record[SCORING_BEHAVIORS.points]))
  }

  const playerByEntryId = new Map<string, string>()
  for (const row of entries ?? []) {
    const record = row as Record<string, string>
    playerByEntryId.set(record[STAT_ENTRIES.id], record[STAT_ENTRIES.playerId])
  }

  const byPlayer = new Map<string, { positive: number; total: number }>()

  for (const row of links ?? []) {
    const record = row as Record<string, string>
    const playerId = playerByEntryId.get(record[STAT_ENTRY_BEHAVIORS.entryId])
    if (!playerId) continue
    const points = pointsByBehaviorId.get(record[STAT_ENTRY_BEHAVIORS.behaviorId]) ?? 0
    const existing = byPlayer.get(playerId) ?? { positive: 0, total: 0 }
    if (points > 0) existing.positive += points
    existing.total += Math.abs(points)
    byPlayer.set(playerId, existing)
  }

  return byPlayer
}

export async function syncLeagueSnapshots(supabase: SupabaseClient, userId: string) {
  const today = formatLocalIsoDate(new Date())

  const [{ data: players, error: playersError }, { data: entries, error: entriesError }] =
    await Promise.all([
      supabase
        .from(TABLES.rosterPlayers)
        .select(`${ROSTER_PLAYERS.id}, ${ROSTER_PLAYERS.nickname}`)
        .eq(ROSTER_PLAYERS.userId, userId),
      supabase
        .from(TABLES.statEntries)
        .select(`${STAT_ENTRIES.playerId}, ${STAT_ENTRIES.entryDate}, ${STAT_ENTRIES.totalPoints}`)
        .eq(STAT_ENTRIES.userId, userId),
    ])

  if (playersError) throw toError(playersError, "Could not sync league snapshots.")
  if (entriesError) throw toError(entriesError, "Could not sync league snapshots.")

  const playerRows = (players ?? []) as Pick<RosterPlayerRow, "id" | "nickname">[]
  const entryRows = (entries ?? []) as StatEntryRow[]
  const nicknames = new Map(playerRows.map((player) => [player.id, player.nickname]))
  const cumulativeTotals = sumPointsByPlayer(entryRows)
  const ranked = rankPlayersByTotals(
    playerRows.map((player) => player.id),
    cumulativeTotals,
    nicknames
  )

  const snapshotRows = ranked.map((row) => ({
    [LEAGUE_PLAYER_SNAPSHOTS.userId]: userId,
    [LEAGUE_PLAYER_SNAPSHOTS.playerId]: row.playerId,
    [LEAGUE_PLAYER_SNAPSHOTS.snapshotDate]: today,
    [LEAGUE_PLAYER_SNAPSHOTS.rank]: row.rank,
    [LEAGUE_PLAYER_SNAPSHOTS.totalPoints]: row.total,
  }))

  if (snapshotRows.length === 0) return

  const { error } = await supabase
    .from(TABLES.leaguePlayerSnapshots)
    .upsert(snapshotRows, {
      onConflict: `${LEAGUE_PLAYER_SNAPSHOTS.userId},${LEAGUE_PLAYER_SNAPSHOTS.playerId},${LEAGUE_PLAYER_SNAPSHOTS.snapshotDate}`,
    })

  if (error) throw toError(error, "Could not sync league snapshots.")
}

export async function fetchLeagueTable(
  supabase: SupabaseClient,
  userId: string,
  period: LeaguePeriod
): Promise<LeagueTableRow[]> {
  const [{ data: players, error: playersError }, { data: entries, error: entriesError }] =
    await Promise.all([
      supabase
        .from(TABLES.rosterPlayers)
        .select(`${ROSTER_PLAYERS.id}, ${ROSTER_PLAYERS.nickname}, ${ROSTER_PLAYERS.emoji}`)
        .eq(ROSTER_PLAYERS.userId, userId)
        .order(ROSTER_PLAYERS.nickname, { ascending: true }),
      supabase
        .from(TABLES.statEntries)
        .select(`${STAT_ENTRIES.playerId}, ${STAT_ENTRIES.entryDate}, ${STAT_ENTRIES.totalPoints}`)
        .eq(STAT_ENTRIES.userId, userId)
        .order(STAT_ENTRIES.entryDate, { ascending: true }),
    ])

  if (playersError) throw toError(playersError, "Could not load league table.")
  if (entriesError) throw toError(entriesError, "Could not load league table.")

  const playerRows = (players ?? []) as Pick<RosterPlayerRow, "id" | "nickname" | "emoji">[]
  const allEntries = (entries ?? []) as StatEntryRow[]
  const periodEntries = filterEntriesByPeriod(allEntries, period)
  const periodTotals = sumPointsByPlayer(periodEntries)
  const nicknames = new Map(playerRows.map((player) => [player.id, player.nickname]))
  const ranked = rankPlayersByTotals(
    playerRows.map((player) => player.id),
    periodTotals,
    nicknames
  )

  let consistencyByPlayer = await fetchBehaviorPointsLast30Days(supabase, userId)

  const rankHistory = buildCumulativeRankHistory(
    playerRows.map((player) => player.id),
    allEntries,
    nicknames
  )

  try {
    await syncLeagueSnapshots(supabase, userId)
  } catch {
    // Snapshots are optional until migration 007 is applied.
  }

  return ranked.map((row, index) => {
    const player = playerRows.find((p) => p.id === row.playerId)
    const playerPeriodEntries = periodEntries.filter((entry) => entry.player_id === row.playerId)
    const consistencyStats = consistencyByPlayer.get(row.playerId)

    return {
      playerId: row.playerId,
      rank: row.rank,
      nickname: player?.nickname ?? "Unknown",
      emoji: player?.emoji ?? "😎",
      tint: PLAYER_TINTS[index % PLAYER_TINTS.length],
      points: row.total,
      delta: computeDelta(playerPeriodEntries),
      form: computeForm(row.playerId, rankHistory),
      consistency: computeConsistency(
        consistencyStats?.positive ?? 0,
        consistencyStats?.total ?? 0
      ),
    }
  })
}
