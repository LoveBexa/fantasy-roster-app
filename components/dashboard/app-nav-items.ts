import {
  BarChart3,
  Heart,
  Plus,
  Settings,
  ClipboardList,
  TrendingUp,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react"

export type AppNavLabel = "League Table" | "Daily Stats" | "My Roster" | "Account"

export type AppNavItem = {
  label: AppNavLabel
  shortLabel: string
  icon: LucideIcon
  href: string
}

export const APP_NAV_ITEMS: AppNavItem[] = [
  { label: "League Table", shortLabel: "League", icon: Trophy, href: "/dashboard" },
  { label: "Add Daily Stats", shortLabel: "Stats", icon: ClipboardList, href: "/stats" },
  { label: "My Roster", shortLabel: "Roster", icon: Heart, href: "/roster" },
  { label: "Account", shortLabel: "Account", icon: Settings, href: "/account" },
]

export type MobileNavItem = {
  label: string
  href: string
  icon: LucideIcon
  isAddEntry?: boolean
  /** When set, item is active only if the URL hash matches (e.g. History → activity log). */
  matchHash?: string
}

export const APP_MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { label: "League", href: "/dashboard", icon: BarChart3 },
  { label: "Roster", href: "/roster", icon: Heart },
  { label: "Add Entry", href: "/stats", icon: Plus, isAddEntry: true },
  {
    label: "History",
    href: "/stats#recent-activity-log",
    icon: TrendingUp,
    matchHash: "#recent-activity-log",
  },
  { label: "Account", href: "/account", icon: User },
]

export type SidebarActivePage = AppNavLabel
