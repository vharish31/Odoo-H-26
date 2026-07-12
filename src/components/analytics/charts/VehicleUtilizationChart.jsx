import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-xs shadow-pop">
      <p className="font-semibold text-ink-900">{label}</p>
      <p className="text-accent-600">{payload[0].value}% utilized</p>
    </div>
  )
}

function colorFor(value) {
  if (value >= 70) return '#10B981'
  if (value >= 40) return '#0EA5E9'
  return '#F59E0B'
}

export default function VehicleUtilizationChart({ data }) {
  if (!data.length) {
    return <div className="flex h-64 items-center justify-center text-sm text-ink-400">No trip activity for this period</div>
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} width={36} unit="%" />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <ReferenceLine y={70} stroke="#CBD5E1" strokeDasharray="4 4" />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={28}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={colorFor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
