import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination — reusable page control with condensed page-number list.
 */
export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalItems === 0) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const pages = getPageList(page, totalPages)

  return (
    <div className="flex flex-col gap-3 border-t border-surface-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-ink-500">
        Showing <span className="font-medium text-ink-700">{start}–{end}</span> of{' '}
        <span className="font-medium text-ink-700">{totalItems}</span> vehicles
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-surface disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-ink-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-accent-500 text-white'
                  : 'text-ink-600 hover:bg-surface'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-surface disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function getPageList(page, totalPages) {
  const delta = 1
  const range = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      range.push(i)
    }
  }
  const withEllipses = []
  let prev
  for (const i of range) {
    if (prev !== undefined && i - prev > 1) withEllipses.push('...')
    withEllipses.push(i)
    prev = i
  }
  return withEllipses
}
