import React from 'react'
import { CalendarRange, RotateCcw, Truck } from 'lucide-react'
import { ANALYTICS_VEHICLES } from '../../data/analyticsData.js'

const PRESETS = [
  { label: 'Last 30 days', start: '2026-06-12', end: '2026-07-12' },
  { label: 'Last 90 days', start: '2026-04-13', end: '2026-07-12' },
  { label: 'This year', start: '2026-01-01', end: '2026-07-12' },
]

/**
 * AnalyticsFilterBar — shared date range + vehicle filter used across
 * Maintenance, Expenses, and Reports analytics pages.
 */
export default function AnalyticsFilterBar({ filters, onChange, onReset }) {
  const { startDate, endDate, vehicle } = filters
  const isDirty = startDate || endDate || vehicle

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface-card p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
        <CalendarRange className="h-3.5 w-3.5" />
        Filters
      </div>

      {/* Date range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          aria-label="Start date"
          value={startDate}
          max={endDate || undefined}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
          className="h-9 rounded-lg border border-surface-border bg-surface px-3 text-sm text-ink-700 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
        <span className="text-xs text-ink-400">to</span>
        <input
          type="date"
          aria-label="End date"
          value={endDate}
          min={startDate || undefined}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
          className="h-9 rounded-lg border border-surface-border bg-surface px-3 text-sm text-ink-700 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-100"
        />
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange({ ...filters, startDate: p.start, endDate: p.end })}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              startDate === p.start && endDate === p.end
                ? 'border-accent-400 bg-accent-50 text-accent-700'
                : 'border-surface-border bg-white text-ink-500 hover:border-ink-400/40 hover:text-ink-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="hidden h-6 w-px bg-surface-border sm:block" />

      {/* Vehicle filter */}
      <div className="relative w-full sm:w-56">
        <Truck className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
        <select
          value={vehicle}
          onChange={(e) => onChange({ ...filters, vehicle: e.target.value })}
          aria-label="Vehicle"
          className="h-9 w-full appearance-none rounded-lg border border-surface-border bg-surface pl-9 pr-8 text-sm text-ink-700 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-100"
        >
          <option value="">All Vehicles</option>
          {ANALYTICS_VEHICLES.map((v) => (
            <option key={v.id} value={v.id}>
              {v.id} · {v.name}
            </option>
          ))}
        </select>
      </div>

      {isDirty && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-500 hover:bg-surface hover:text-ink-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      )}
    </div>
  )
}
