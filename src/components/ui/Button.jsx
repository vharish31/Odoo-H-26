import React from 'react'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 shadow-sm shadow-accent-500/20',
  secondary:
    'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-700',
  outline:
    'bg-white text-ink-700 border border-surface-border hover:bg-surface hover:border-ink-400/40',
  ghost:
    'bg-transparent text-ink-700 hover:bg-surface',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9 justify-center',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center rounded-lg font-medium transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="h-3.5 w-3.5" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="h-3.5 w-3.5" />}
    </button>
  )
}
