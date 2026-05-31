/** Exact Supabase table names (American spelling per project schema). */
export const TABLES = {
  rosterPlayers: "roster_players",
  scoringBehaviors: "scoring_behaviors",
  statEntries: "stat_entries",
  statEntryBehaviors: "stat_entry_behaviors",
  leaguePlayerSnapshots: "league_player_snapshots",
  userProfiles: "user_profiles",
} as const

/** roster_players */
export const ROSTER_PLAYERS = {
  id: "id",
  userId: "user_id",
  nickname: "nickname",
  description: "description",
  emoji: "emoji",
  status: "status",
  relationshipStatus: "relationship_status",
  notes: "notes",
  photoUrl: "photo_url",
  createdAt: "created_at",
  updatedAt: "updated_at",
} as const

/** scoring_behaviors */
export const SCORING_BEHAVIORS = {
  id: "id",
  category: "category",
  behavior: "behavior",
  points: "points",
  description: "description",
  createdAt: "created_at",
} as const

/** stat_entries */
export const STAT_ENTRIES = {
  id: "id",
  userId: "user_id",
  playerId: "player_id",
  entryDate: "entry_date",
  notes: "notes",
  totalPoints: "total_points",
  createdAt: "created_at",
} as const

/** stat_entry_behaviors */
export const STAT_ENTRY_BEHAVIORS = {
  id: "id",
  entryId: "entry_id",
  behaviorId: "behavior_id",
  createdAt: "created_at",
} as const

/** league_player_snapshots */
export const LEAGUE_PLAYER_SNAPSHOTS = {
  id: "id",
  userId: "user_id",
  playerId: "player_id",
  snapshotDate: "snapshot_date",
  rank: "rank",
  totalPoints: "total_points",
  createdAt: "created_at",
} as const

/** user_profiles */
export const USER_PROFILES = {
  userId: "user_id",
  nickname: "nickname",
  avatarEmoji: "avatar_emoji",
  createdAt: "created_at",
  updatedAt: "updated_at",
} as const
