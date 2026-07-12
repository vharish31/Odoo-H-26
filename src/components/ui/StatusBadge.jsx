import React from 'react'
import { Circle } from 'lucide-react'

// Central status → style map. Extend as new statuses appear across modules.
const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'on-trip': 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  'in-transit': 'bg-accent-50 text-accent-700 ring-accent-600/20',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  available: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  scheduled: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  idle: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'in-progress': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  maintenance: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'on-leave': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  delayed: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  overdue: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  inactive: 'bg-slate-100 text-slate-500 ring-slate-500/20',
}

function formatLabel(status) {
  return status
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

export default function StatusBadge({ status, label, dot = true, className = '' }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-slate-500/20'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style} ${className}`}
    >
      {dot && <Circle className="h-1.5 w-1.5 fill-current stroke-none" />}
      {label || formatLabel(status)}
    </span>
  )
}
