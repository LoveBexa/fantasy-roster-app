/** Edit landing page copy and mock dashboard data here. */

export const landingHero = {
  title: "Fantasy League for Modern Dating",
  subtitle: "Track behaviour. Spot patterns. Rank your roster.",
  body: "Stop guessing who likes you. Start looking at the stats.",
  primaryCta: "JOIN THE LEAGUE",
  secondaryCta: "HOW IT WORKS",
  annotation:
    "Built for the people with 27 tabs open, three situationships, and a spreadsheet somewhere.",
  heroImage: "/images/women-looking-phone.png",
} as const

export const landingFeatures = [
  { label: "MVP TRACKING", subtext: "Crown your top performers.", icon: "trophy" as const },
  { label: "LEAGUE TABLES", subtext: "See how your roster ranks.", icon: "chart" as const },
  { label: "DATING ANALYTICS", subtext: "Data over delusion.", icon: "heart" as const },
  {
    label: "RED FLAG DETECTION",
    subtext: "Spot the patterns before it's too late.",
    icon: "flag" as const,
  },
  { label: "CONSISTENCY SCORES", subtext: "Track what really matters.", icon: "trend" as const },
] as const

export const landingDashboard = {
  label: "WHAT IS THE ROSTER? ✦",
  heading: "Dating is already a game.",
  body: "You're already keeping track — who texted back, who planned the date, who disappeared for three days. The Roster just makes it official. Add your players, log the behaviour, and let the standings tell you who's actually showing up.",
  checklist: [
    "Track interactions.",
    "Award points.",
    "See who consistently shows up.",
  ],
  tableTitle: "MY ROSTERS",
  tableColumns: ["Rank", "Player", "Status", "Points", "Trend", "Last Updated"] as const,
  players: [
    {
      rank: 1,
      name: "Sunshine",
      emoji: "😎",
      status: "Active",
      points: 245,
      trend: "up" as const,
      lastUpdated: "2 hrs ago",
    },
    {
      rank: 2,
      name: "Heatwave",
      emoji: "🔥",
      status: "Active",
      points: 228,
      trend: "up" as const,
      lastUpdated: "Yesterday",
    },
    {
      rank: 3,
      name: "Echo",
      emoji: "🪓",
      status: "Reserve",
      points: 196,
      trend: "down" as const,
      lastUpdated: "3 days ago",
    },
    {
      rank: 4,
      name: "Casper",
      emoji: "👻",
      status: "Ghosted",
      points: 42,
      trend: "down" as const,
      lastUpdated: "2 weeks ago",
    },
  ],
  mvpCard: {
    title: "MVP OF THE MONTH",
    player: "Sunshine",
    points: 245,
    note: "Planned a surprise date · Great communication",
  },
  consistencyCard: {
    title: "CONSISTENCY SCORE",
    score: 82,
    label: "Showing up is winning.",
  },
  redFlagsCard: {
    title: "RED FLAGS SPOTTED",
    count: 3,
    period: "This month",
    items: ["Inconsistent communication", "Last minute cancels", "Mixed signals"],
  },
} as const

export const landingHowItWorks = {
  steps: [
    {
      number: 1,
      title: "Add Your Players",
      players: [
        { emoji: "😎", name: "Sunshine" },
        { emoji: "🪓", name: "Echo" },
        { emoji: "🔥", name: "Heatwave" },
        { emoji: "👻", name: "Casper" },
      ],
    },
    {
      number: 2,
      title: "Log What Happened",
      annotation: "Log it.",
      behaviors: [
        { emoji: "💕", label: "Date Planned" },
        { emoji: "💬", label: "Great Vibes" },
        { emoji: "⏰", label: "Slow Replies" },
        { emoji: "👻", label: "Ghosted" },
      ],
    },
    {
      number: 3,
      title: "Watch The Standings Change",
      standings: [
        { rank: 1, emoji: "😎", name: "Sunshine", points: 245, isMvp: true },
        { rank: 2, emoji: "🔥", name: "Heatwave", points: 228, isMvp: false },
        { rank: 3, emoji: "🪓", name: "Echo", points: 196, isMvp: false },
      ],
    },
  ],
} as const

export const landingMidCta = {
  eyebrow: "Three steps. One league.",
  heading: "Ready to join?",
  subtext:
    "Add your players, log the behaviour, and let the standings do the talking.",
  cta: "JOIN THE LEAGUE",
  testimonials: [
    { quote: "Stopped texting 3 ghosters at once", rotation: "-7deg" },
    { quote: "Wish I'd had this years ago", rotation: "5deg" },
    { quote: "Turns out the leaderboard never lies", rotation: "-4deg" },
  ],
} as const
