/** Free tier cap — replace with plan-based limits when subscriptions ship. */
export const FREE_TIER_MAX_PLAYERS = 3

export const FREE_TIER_LIMIT_REACHED_TITLE = "Free Tier Limit Reached"

export const FREE_TIER_LIMIT_REACHED_MESSAGE = `You can have up to ${FREE_TIER_MAX_PLAYERS} players in your roster.

More roster slots will be available in a future Pro version.`

export function canAddRosterPlayer(currentCount: number) {
  return currentCount < FREE_TIER_MAX_PLAYERS
}

export function formatRosterLimitLabel(currentCount: number) {
  return `Roster Limit: ${currentCount} / ${FREE_TIER_MAX_PLAYERS} Players`
}

export function formatRosterSlotsUsed(currentCount: number) {
  return `${currentCount} / ${FREE_TIER_MAX_PLAYERS} roster slots used`
}

export function isRosterLimitReached(currentCount: number) {
  return currentCount >= FREE_TIER_MAX_PLAYERS
}
