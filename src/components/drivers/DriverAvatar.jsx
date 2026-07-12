import React, { useState } from 'react'

const SIZES = {
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-base',
}

/**
 * DriverAvatar — shows a driver's photo, falling back to their initials
 * on a tinted circle if no photo is set or the image fails to load.
 */
export default function DriverAvatar({ name = '', photo, size = 'md', className = '' }) {
  const [errored, setErrored] = useState(false)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (photo && !errored) {
    return (
      <img
        src={photo}
        alt={name}
        onError={() => setErrored(true)}
        className={`${SIZES[size]} shrink-0 rounded-full object-cover ring-1 ring-surface-border ${className}`}
      />
    )
  }

  return (
    <div
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-accent-50 font-semibold text-accent-700 ring-1 ring-surface-border ${className}`}
    >
      {initials || '?'}
    </div>
  )
}
