import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CHART_PALETTE, formatINR } from '../../../data/analyticsData.js'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-xs shadow-pop">
      <p className="font-semibold text-ink-900">{item.name}</p>
      <p className="text-ink-500">{formatINR(item.value)}</p>
    </div>
  )
}

export default function ExpenseCategoriesChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)

  if (!total) {
    return <div className="flex h-44 items-center justify-center text-sm text-ink-400">No expenses for this period</div>
  }

  const sorted = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sorted}
              dataKey="value"
              nameKey="name"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={3}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {sorted.map((entry, i) => (
                <Cell key={entry.name} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-ink-900">{formatINR(total)}</span>
          <span className="text-[11px] text-ink-500">Total</span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {sorted.map((entry, i) => (
          <div key={entry.name} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-ink-700">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }} />
              {entry.name}
            </div>
            <span className="font-semibold text-ink-900">{formatINR(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
