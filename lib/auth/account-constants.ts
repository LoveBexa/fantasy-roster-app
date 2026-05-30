export const ACCOUNT_EMOJI_OPTIONS = [
  "😎", "🤩", "🔥", "🥺", "🤠",
  "🍿", "🌶️", "🧵", "🪃", "🤖",
  "🎸", "🎯", "💅", "🐻", "🦋",
] as const

export type AccountEmoji = (typeof ACCOUNT_EMOJI_OPTIONS)[number]
