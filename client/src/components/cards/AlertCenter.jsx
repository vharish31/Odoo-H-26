import React from 'react'
import { Wrench, CreditCard, Fuel, AlertTriangle, Info, AlertCircle } from 'lucide-react'

const TYPE_ICON = {
  'service-due': Wrench,
  'license-expiry': CreditCard,
  'fuel-budget': Fuel,
}

const SEVERITY_STYLES = {
  critical: {
    ring: 'ring-rose-600/20',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    Icon: AlertCircle,
  },
  warning: {
    ring: 'ring-amber-600/20',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    Icon: AlertTriangle,
  },
  info: {
    ring: 'ring-sky-600/20',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
    Icon: Info,
  },
}

export default function AlertCenter({ alerts }) {
  const criticalCount = alerts.filter((a) => a.severity === 'critical').length
  const warningCount = alerts.filter((a) => a.severity === 'warning').length

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center gap-2 text-xs">
        {criticalCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
            {criticalCount} critical
          </span>
        )}
        {warningCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            {warningCount} warning
          </span>
        )}
      </div>

      <ul className="flex max-h-[22rem] flex-col gap-2.5 overflow-y-auto pr-1">
        {alerts.map((alert) => {
          const TypeIcon = TYPE_ICON[alert.type] || Info
          const sev = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info
          return (
            <li
              key={alert.id}
              className={`flex gap-3 rounded-xl border border-surface-border p-3 transition-colors hover:bg-surface`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${sev.bg} ${sev.text}`}>
                <TypeIcon className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink-900">{alert.title}</p>
                  <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${sev.dot}`} />
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{alert.message}</p>
                <p className="mt-1 text-[11px] text-ink-400">{alert.time}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
