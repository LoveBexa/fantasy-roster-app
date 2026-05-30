import type { SVGProps } from "react"

export function HeartDoodle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 44" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M24 40C8 29 3 20 3 13 3 7 7 3 12 3c5 0 9 4 12 9 3-5 7-9 12-9 5 0 9 4 9 10 0 7-5 16-21 27Z" />
    </svg>
  )
}

export function StarDoodle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M32 4C34 22 42 30 60 32 42 34 34 42 32 60 30 42 22 34 4 32 22 30 30 22 32 4Z" />
    </svg>
  )
}


export function CrownDoodle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 48" fill="currentColor" aria-hidden {...props}>
      <path d="M6 14l10 10 16-18 16 18 10-10-4 30H10L6 14Z" />
    </svg>
  )
}

export function ArrowDoodle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 40" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M4 30C18 26 30 18 40 6" />
      <path d="M30 6h12v12" />
    </svg>
  )
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.8c2.2-2 3.6-5 3.6-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-3l-3.8-3a7.2 7.2 0 0 1-10.7-3.8H1.5v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.5 14.2a7.1 7.1 0 0 1 0-4.5V6.6H1.5a12 12 0 0 0 0 10.8l4-3.2Z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.5 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z" />
    </svg>
  )
}

export function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3-.8-1.6 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.2 0 2-1.1 2.8-2.2.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.8ZM14.1 5.2c.6-.8 1-1.9.9-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3Z" />
    </svg>
  )
}
