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
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1
            id={id}
            className="font-serif text-4xl font-bold tracking-tight text-primary"
          >
            {title}
          </h1>
          {icon}
        </div>
        <p className="mt-2 font-script text-xl text-muted-foreground">{subtitle}</p>
      </div>
      {action ? <div className="flex shrink-0 flex-col gap-3 sm:items-end">{action}</div> : null}
    </div>
  )
}
