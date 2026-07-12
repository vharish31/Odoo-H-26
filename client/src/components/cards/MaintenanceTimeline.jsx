import React from 'react'
import { Wrench } from 'lucide-react'
import StatusBadge from '../common/StatusBadge.jsx'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date('2026-07-12')) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  return `in ${diff}d`
}

const STATUS_DOT = {
  overdue: 'bg-rose-500',
  'in-progress': 'bg-amber-500',
  scheduled: 'bg-sky-500',
}

export default function MaintenanceTimeline({ items }) {
  return (
    <ol className="relative flex flex-col gap-5 pl-6">
      <div className="absolute bottom-1 left-[7px] top-1 w-px bg-surface-border" />
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-surface-card ${
              STATUS_DOT[item.status] || 'bg-slate-400'
            }`}
          />
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
                <Wrench className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.75} />
                {item.type}
              </p>
              <p className="mt-0.5 text-xs text-ink-500">
                {item.vehicle} &middot; {item.workshop}
              </p>
            </div>
            <div className="text-right">
              <StatusBadge status={item.status} />
              <p className="mt-1 text-xs font-medium text-ink-500">
                {formatDate(item.dueDate)} &middot; {daysUntil(item.dueDate)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
