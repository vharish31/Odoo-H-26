import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLOR_MAP = {
  '--chart-inuse': '#0EA5E9',
  '--chart-idle': '#CBD5E1',
  '--chart-maint': '#F59E0B',
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-xs shadow-pop">
      <p className="font-semibold text-ink-900">{item.name}</p>
      <p className="text-ink-500">{item.value}% of fleet</p>
    </div>
  )
}

export default function FleetUtilizationChart({ data }) {
  const primary = data[0]

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="72%"
              outerRadius="100%"
              paddingAngle={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLOR_MAP[entry.colorVar] || '#94A3B8'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-ink-900">{primary.value}%</span>
          <span className="text-[11px] text-ink-500">{primary.name}</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-ink-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLOR_MAP[entry.colorVar] || '#94A3B8' }}
              />
              {entry.name}
            </div>
            <span className="font-semibold text-ink-900">{entry.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
