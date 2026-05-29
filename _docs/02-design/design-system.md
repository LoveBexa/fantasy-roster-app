# 02 — Design System & Brand Identity

## Brand Identity

**Name**: Level Up Roster  
**Tagline**: "Track the patterns. Protect your energy. Win the league."  
**Tone**: Empowered, playful, analytical. Sports-metaphor meets self-aware dating culture.  
**Personality**: Your sharp, supportive best friend who also has a spreadsheet.

---

## Colour Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Cream** | `#FAF6F1` | Primary background |
| **Crimson** | `#8B1A1A` | Primary brand colour, CTAs, headings |
| **Olive** | `#5C6B3A` | Secondary accent, active nav, badges |
| **Blush Pink** | `#F9E4E4` | Card backgrounds, positive highlights |
| **Light Pink** | `#FDE8E8` | Hover states, soft accents |
| **Warm White** | `#FFFFFF` | Cards, modals |
| **Dark Text** | `#1A1A1A` | Body text |
| **Muted Text** | `#6B6B6B` | Subtitles, placeholders |
| **Negative Red** | `#DC2626` | Negative point values, red flags |
| **Positive Green** | `#5C6B3A` | Positive point values (uses olive) |

### CSS Variables (add to `globals.css`)

```css
:root {
  --cream: #FAF6F1;
  --crimson: #8B1A1A;
  --crimson-hover: #6B1414;
  --olive: #5C6B3A;
  --olive-light: #7A8F4E;
  --blush: #F9E4E4;
  --light-pink: #FDE8E8;
  --dark-text: #1A1A1A;
  --muted: #6B6B6B;
  --border: #E8DDD5;
  --negative: #DC2626;
}
```

---

## Typography

### Font Pairings
- **Display / Headings**: Serif with character (e.g. `Playfair Display`, `Cormorant Garamond`)
- **Body**: Clean sans-serif (e.g. `DM Sans`, `Plus Jakarta Sans`)
- **Handwritten accents**: Script font for "vibe" labels (e.g. `Dancing Script`, `Caveat`)

### Type Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Page title (e.g. "LEAGUE TABLE") | `4xl–6xl` | 900 | Display serif |
| Section heading | `2xl` | 700 | Display serif |
| Card title | `lg` | 600 | Body sans |
| Body text | `sm–base` | 400 | Body sans |
| Points / stats | `2xl–4xl` | 700 | Body sans |
| Handwritten accent | `sm–base` | 400 | Script |

---

## Spacing & Layout

- **Max content width**: `1280px`
- **Sidebar width**: `180px` (desktop)
- **Card border radius**: `12px` (standard), `16px` (large cards)
- **Page padding**: `px-6 py-8` (desktop), `px-4 py-6` (mobile)
- **Card shadow**: `shadow-sm` with subtle border `border border-[#E8DDD5]`

---

## Iconography

- Use **line icons** throughout — consistent with the editorial feel
- Suggested library: `lucide-react` (already available in v0/shadcn stack)
- Key icons in use:
  - Trophy `<Trophy />` — league, rankings
  - Heart `<Heart />` — roster, likes
  - Calendar `<Calendar />` — matches, dates
  - Star `<Star />` — scoring, awards
  - TrendingUp/Down `<TrendingUp />` / `<TrendingDown />` — form arrows
  - Ghost `<Ghost />` — ghosted list
  - Flag `<Flag />` — red flag alerts
  - Crown — MVP (custom SVG or emoji `👑`)

---

## Component Aesthetic Guidelines

### Cards
```
bg-white rounded-xl border border-[#E8DDD5] p-5 shadow-sm
```

### Primary Button (CTA)
```
bg-[#8B1A1A] hover:bg-[#6B1414] text-white rounded-lg px-6 py-3 font-semibold
```

### Secondary Button
```
border border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#F9E4E4] rounded-lg px-6 py-3
```

### Positive Points Badge
```
text-[#5C6B3A] font-bold  (e.g. "+32")
```

### Negative Points Badge
```
text-[#DC2626] font-bold  (e.g. "-12")
```

### Active Nav Item
```
bg-[#5C6B3A] text-white rounded-lg
```

---

## Decorative Elements

From the mockups, these hand-drawn / editorial details add character:
- **Dashed divider lines** under page titles
- **Small handwritten annotations** in script font (e.g. "he's cute but inconsistent", "keep it up, king")
- **Sticky note aesthetic** on sidebar bottom (cream/pink with slight rotation, `rotate-1`)
- **Red star / asterisk** graphic accents near headings
- **Dotted borders** on certain highlight cards

---

## Screen Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | `< 768px` | Single column, bottom nav |
| Tablet | `768px–1024px` | Collapsible sidebar |
| Desktop | `> 1024px` | Fixed sidebar + main content |

---

## Dark Mode

Not in scope for MVP. Cream/warm palette is the single theme. Do not add dark mode classes until explicitly planned.
