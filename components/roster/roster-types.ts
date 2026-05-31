export type PlayerStatus = "Active" | "Reserve" | "Free Agent" | "Ghosted" | "Removed"

export type RelationshipStatus =
  | "Potential Partner"
  | "Situationship"
  | "Casual"
  | "FWB"
  | "Breadcrumber"
  | "Orbiter"

export interface Player {
  id: string
  nickname: string
  description: string
  emoji: string
  status: PlayerStatus
  relationshipStatus: RelationshipStatus | null
  addedDate: string
  lastUpdated: string
  notes?: string
  photoUrl?: string
}

export const PLAYER_STATUSES: PlayerStatus[] = [
  "Active",
  "Reserve",
  "Free Agent",
  "Ghosted",
  "Removed",
]

export const RELATIONSHIP_STATUSES: {
  value: RelationshipStatus
  emoji: string
  description: string
}[] = [
  { value: "Potential Partner", emoji: "💕", description: "Relationship candidate" },
  { value: "Situationship", emoji: "😏", description: "Uncommited relationship-vibes" },
  { value: "Casual", emoji: "🍿", description: "Seeing each other casually" },
  { value: "FWB", emoji: "🔥", description: "Friends with benefits" },
  { value: "Breadcrumber", emoji: "🧵", description: "Gives minimal attention to stay relevant" },
  { value: "Orbiter", emoji: "🪃", description: "Hovers on social, never messages" },
]

export const EMOJI_OPTIONS = [
  // Faces & vibes
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "😉", "😌", "😍", "🥰", "😘",
  "😋", "😎", "🤓", "🧐", "🥸", "😏", "😒", "🙄", "😬", "😑", "😶", "🫥", "😶‍🌫️", "🤨",
  "🤔", "🫣", "🫢", "🤭", "🫠", "🥹", "😭", "💀", "☠️", "🤡", "👹", "😈", "👿", "👻",
  "👽", "🤖", "🎃",
  // Love
  "💕", "❤️", "💖", "💘", "💝", "💞", "💓", "💗", "💔", "❤️‍🔥", "❤️‍🩹", "💌",
  // Energy & wins
  "🔥", "💥", "⚡", "✨", "🌟", "⭐", "💎", "🏆", "🥇", "🎯", "🚀",
  // Red flags
  "🚩", "⚠️", "☢️", "💣", "🧨", "🌪️",
  // Roster archetypes
  "🪃", "🧵", "🍿", "🎭", "🎪",
  // Tea & vibes
  "👀", "💅", "🍵", "🫖", "📸", "🎤", "🪩",
  // Fitness
  "💪", "🏋️", "🏃", "🚴", "🤸",
  // Money
  "💰", "💸", "💳", "📈", "📉", "🏦",
  // Tech
  "👨‍💻", "💾",
  // Night out
  "🍻", "🍷", "🍸", "🥂", "🎉", "🎲", "🎰",
  // Food
  "🍕", "🍔", "🍟", "🌮", "🌯", "🍣", "🍩", "🥐", "🥑", "🌶️",
  // Spicy
  "🍆", "🍑", "💦", "🥵",
  // Animals
  "🐶", "🐱", "🦊", "🐺", "🐸", "🐼", "🦄", "🦖", "🦕", "🦝", "🐀", "🐍", "🦈", "🐙",
  "🦐", "🦧", "🦥", "🪿", "🦤", "🦚",
  // Nature
  "🌱", "🍀", "🌿", "🌻", "🌞", "🌈", "🌊", "🌙", "☀️",
  // Misc
  "🗿", "🙃", "🫡", "🧎", "🚶",
  // Hobbies
  "🎸", "🎨", "🎬", "📚", "🎮", "🎧", "🎹",
  // Travel & fun
  "🏡", "✈️", "🚗", "🚲", "🛥️", "🎡", "🎢",
] as const
