import type { LucideIcon } from "lucide-react"
import {
  CalendarCheck,
  CircleCheck,
  CircleX,
  Clock,
  CloudFog,
  Ghost,
  Heart,
  MessageCircleDashed,
  MessageCircleHeart,
  MessagesSquare,
  Pencil,
  Send,
  Shield,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  Thermometer,
  Trophy,
  Users,
} from "lucide-react"

const categoryIcons: Record<string, LucideIcon> = {
  "Effort & Planning": CalendarCheck,
  Communication: MessageCircleHeart,
  "Emotional Safety": Shield,
  "Attraction & Chemistry": Sparkles,
  "Lifestyle Compatibility": Users,
  "Dating Intentions": Target,
  "Social & Personality": Smile,
  "Roster Dynamics": Trophy,
}

const behaviorIconRules: { pattern: RegExp; icon: LucideIcon }[] = [
  { pattern: /plan|date|forward|transport|arriv/i, icon: CalendarCheck },
  { pattern: /reply|question|conversation|transparent|lovebomb/i, icon: MessageCircleHeart },
  { pattern: /factual|dry/i, icon: MessageCircleDashed },
  { pattern: /conflict|disappear/i, icon: CloudFog },
  { pattern: /detail|remember/i, icon: Star },
  { pattern: /follow|reliab|team|support/i, icon: CircleCheck },
  { pattern: /laugh|playful|flirty/i, icon: Smile },
  { pattern: /morning|text|check.?in/i, icon: Sun },
  { pattern: /initiat|send/i, icon: Send },
  { pattern: /late|bail|cancel|overbook|unavailable|absent/i, icon: Clock },
  { pattern: /ghost|benchwarmer|orbit/i, icon: Ghost },
  { pattern: /hot|cold|immature|codependent/i, icon: Thermometer },
  { pattern: /distant|avoidant|drain/i, icon: CloudFog },
  { pattern: /cancel|disrespect|lead/i, icon: CircleX },
  { pattern: /safe|feel/i, icon: Heart },
  { pattern: /consistent|main player/i, icon: Trophy },
  { pattern: /group|social|interest|hobby|busy/i, icon: MessagesSquare },
]

export function getBehaviorIcon(category: string, behavior: string): LucideIcon {
  for (const rule of behaviorIconRules) {
    if (rule.pattern.test(behavior)) return rule.icon
  }

  return categoryIcons[category] ?? Pencil
}
