import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-xs shadow-pop">
      <p className="mb-1 font-semibold text-ink-900">{label} 2026</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString('en-IN')} {p.dataKey === 'diesel' ? 'L' : 'kg'}
        </p>
      ))}
    </div>
  )
}

function CustomLegend({ payload }) {
  return (
    <div className="mt-1 flex items-center justify-center gap-5 text-xs text-ink-500">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </div>
      ))}
    </div>
  )
}

export default function FuelConsumptionChart({ data }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barGap={6}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} width={40} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <Legend content={<CustomLegend />} />
          <Bar dataKey="diesel" name="Diesel (L)" fill="#182B47" radius={[4, 4, 0, 0]} maxBarSize={22} />
          <Bar dataKey="cng" name="CNG (kg)" fill="#3AB8F8" radius={[4, 4, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
