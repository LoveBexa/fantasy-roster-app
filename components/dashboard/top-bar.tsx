import Image from "next/image"
import { Search, Bell, ChevronDown } from "lucide-react"

export function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card/40 px-8 py-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search people..."
          aria-label="Search people"
          className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
        />
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-foreground/70 transition-colors hover:text-foreground"
        >
          <Bell className="size-5" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-primary" aria-hidden />
        </button>

        <button type="button" className="flex items-center gap-2">
          <Image
            src="/images/jackie-avatar.png"
            alt="Jackie's profile"
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
          <span className="text-sm font-semibold text-foreground">Hi, Jackie</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}
