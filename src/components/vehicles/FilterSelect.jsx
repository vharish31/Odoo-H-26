import React from 'react'
import { ChevronDown, Filter } from 'lucide-react'

/**
 * FilterSelect — reusable labeled dropdown filter.
 * options: [{ value, label }]. value === '' means "All".
 */
export default function FilterSelect({
  label,
  value,
  onChange,
  options,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="h-9 w-full appearance-none rounded-lg border border-surface-border bg-surface pl-9 pr-8 text-sm text-ink-700 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-100"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
    </div>
  )
}
