"use client"

import { Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { day: "M", value: -8 },
  { day: "T", value: -4 },
  { day: "W", value: 2 },
  { day: "T", value: -2 },
  { day: "F", value: 6 },
  { day: "S", value: 12 },
  { day: "S", value: 20 },
]

export function FormChart() {
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
            domain={[-20, 20]}
            ticks={[-20, 0, 20]}
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
