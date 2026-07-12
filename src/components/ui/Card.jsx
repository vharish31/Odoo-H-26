import React from 'react'

/**
 * Card — the base surface for all dashboard content.
 * White background, hairline border, soft shadow, generous radius.
 */
export default function Card({
  as: Tag = 'div',
  title,
  subtitle,
  action,
  padded = true,
  className = '',
  children,
  ...props
}) {
  const hasHeader = title || subtitle || action

  return (
    <Tag
      className={`bg-surface-card border border-surface-border rounded-2xl shadow-card ${className}`}
      {...props}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-ink-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={padded ? (hasHeader ? 'px-5 pb-5' : 'p-5') : ''}>{children}</div>
    </Tag>
  )
}
