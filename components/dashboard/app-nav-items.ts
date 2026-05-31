import {
  Trophy,
  Heart,
  Settings,
  ClipboardList,
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
  { label: "Daily Stats", shortLabel: "Stats", icon: ClipboardList, href: "/stats" },
  { label: "My Roster", shortLabel: "Roster", icon: Heart, href: "/roster" },
  { label: "Account", shortLabel: "Account", icon: Settings, href: "/account" },
]

export type SidebarActivePage = AppNavLabel
