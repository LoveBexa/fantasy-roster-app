import type { ReactNode } from "react"

type PageHeaderProps = {
  id?: string
  title: string
  subtitle: string
  icon?: ReactNode
  action?: ReactNode
}

export function PageHeader({ id, title, subtitle, icon, action }: PageHeaderProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <h1
            id={id}
            className="min-w-0 font-serif text-2xl font-bold tracking-tight text-primary sm:text-3xl md:text-4xl"
          >
            {title}
          </h1>
          {icon ? <span className="shrink-0">{icon}</span> : null}
        </div>
        <p className="mt-2 max-w-full font-script text-base leading-snug text-muted-foreground sm:text-lg md:text-xl">
          {subtitle}
        </p>
      </div>
      {action ? (
        <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
          {action}
        </div>
      ) : null}
    </div>
  )
}
