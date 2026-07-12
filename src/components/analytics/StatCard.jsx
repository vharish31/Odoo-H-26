import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

/**
 * StatCard — compact KPI tile used at the top of analytics pages.
 * trend: 'up' | 'down' | undefined (omit the delta row entirely if undefined)
 */
export default function StatCard({ label, value, delta, trend, icon: Icon, tone = 'accent' }) {
  const toneStyles = {
    accent: 'bg-accent-50 text-accent-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    navy: 'bg-navy-900 text-accent-400',
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink-900">{value}</p>
        </div>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneStyles[tone]}`}>
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
        )}
      </div>
      {delta && (
        <div
          className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
            trend === 'down' ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {trend === 'down' ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
          {delta}
        </div>
      )}
    </div>
  )
}
