import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CHART_PALETTE, formatINR } from '../../../data/analyticsData.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-xs shadow-pop">
      <p className="font-semibold text-ink-900">{label}</p>
      <p className="text-ink-500">{formatINR(payload[0].value)}</p>
    </div>
  )
}

export default function ExpenseBreakdownChart({ data }) {
  const sorted = [...data].sort((a, b) => b.value - a.value)

  if (!sorted.length || !sorted.some((d) => d.value)) {
    return <div className="flex h-64 items-center justify-center text-sm text-ink-400">No expenses for this period</div>
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={formatINR} />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#334155', fontSize: 12 }} width={96} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={16}>
            {sorted.map((entry, i) => (
              <Cell key={entry.name} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
