import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  Truck,
  Route,
  CircleCheck,
  Users,
  Wallet,
  Gauge,
} from 'lucide-react'

const ICONS = {
  Truck,
  Route,
  CircleCheck,
  Users,
  Wallet,
  Gauge,
}

/**
 * KpiCard — compact metric tile for the dashboard's top-line KPI grid.
 * Mirrors the visual language of the base Card component but is tuned
 * for dense, glanceable stats with a trend indicator.
 */
export default function KpiCard({ label, value, delta, trend = 'up', icon }) {
  const Icon = ICONS[icon] || Gauge
  const isUp = trend === 'up'

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-4 shadow-card transition-shadow hover:shadow-pop sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink-900">{value}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
      <div
        className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
          isUp ? 'text-emerald-600' : 'text-rose-600'
        }`}
      >
        {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        <span>{delta}</span>
      </div>
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent-500/5 transition-transform duration-300 group-hover:scale-125" />
    </div>
  )
}
