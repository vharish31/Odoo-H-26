import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { CHART_PALETTE } from '../../../data/analyticsData.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-xs shadow-pop">
      <p className="font-semibold text-ink-900">{label}</p>
      <p className="text-ink-500">{payload[0].value} service{payload[0].value === 1 ? '' : 's'} logged</p>
    </div>
  )
}

export default function ServiceHistoryChart({ data }) {
  if (!data.length) {
    return <div className="flex h-64 items-center justify-center text-sm text-ink-400">No service history for this period</div>
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#334155', fontSize: 12 }}
            width={72}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={16}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
