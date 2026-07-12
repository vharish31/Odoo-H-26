import React from 'react'
import { Search, X } from 'lucide-react'

/**
 * SearchInput — reusable debounced-free search box.
 * Fully controlled; parent owns the value.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-surface-border bg-surface pl-9 pr-8 text-sm placeholder:text-ink-400 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-100"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-400 hover:text-ink-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
