import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatINR } from '../../../data/analyticsData.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-surface-border bg-surface-card px-3 py-2 text-xs shadow-pop">
      <p className="font-semibold text-ink-900">{label} 2026</p>
      <p className="text-accent-600">{formatINR(payload[0].value)}</p>
    </div>
  )
}

export default function MonthlySpendingChart({ data }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={formatINR} width={52} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <Bar dataKey="amount" name="Spending" fill="#0EA5E9" radius={[6, 6, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
