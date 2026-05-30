"use client"

import { useMemo } from "react"
import { Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { FormChartPoint } from "@/lib/stats/stat-entries"

type FormChartProps = {
  data: FormChartPoint[]
}

export function FormChart({ data }: FormChartProps) {
  const yBound = useMemo(() => {
    const maxAbs = Math.max(20, ...data.map((point) => Math.abs(point.value)))
    return Math.ceil(maxAbs / 5) * 5
  }, [data])

  return (
    <div className="mt-2 h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <ReferenceLine y={0} stroke="var(--color-primary)" strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
          />
          <YAxis
            domain={[-yBound, yBound]}
            ticks={[-yBound, 0, yBound]}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            width={32}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-brand-green)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--color-brand-green)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
