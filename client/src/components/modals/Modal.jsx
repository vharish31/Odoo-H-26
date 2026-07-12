import React, { useEffect } from 'react'
import { X } from 'lucide-react'

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  footer,
  children,
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${SIZES[size]} rounded-2xl bg-surface-card shadow-pop border border-surface-border`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-surface-border">
          <div>
            <h2 id="modal-title" className="text-base font-semibold text-ink-900">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-ink-400 hover:bg-surface hover:text-ink-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-surface-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
