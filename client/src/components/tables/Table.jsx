import React from 'react'
import { Inbox } from 'lucide-react'

/**
 * Table — generic data table.
 *
 * columns: [{ key, header, render?(row), width?, align? }]
 * data: array of row objects (must include a stable `id` or pass rowKey)
 */
export default function Table({
  columns,
  data = [],
  rowKey = 'id',
  onRowClick,
  emptyLabel = 'No records found',
}) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-ink-400">
        <Inbox className="h-8 w-8" strokeWidth={1.5} />
        <p className="text-sm">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-5">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-surface-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500 ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-surface-border last:border-0 transition-colors ${
                onRowClick ? 'cursor-pointer hover:bg-surface' : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap px-5 py-3.5 text-ink-700 ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
