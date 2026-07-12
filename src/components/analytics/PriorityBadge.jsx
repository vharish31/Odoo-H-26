import React from 'react'
import { Circle } from 'lucide-react'
import { PRIORITY_STYLES } from '../../data/analyticsData.js'

export default function PriorityBadge({ priority, className = '' }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.low
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.bg} ${style.text} ${style.ring} ${className}`}
    >
      <Circle className="h-1.5 w-1.5 fill-current stroke-none" />
      {priority[0].toUpperCase() + priority.slice(1)}
    </span>
  )
}
