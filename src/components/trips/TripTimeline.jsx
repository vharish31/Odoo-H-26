import React from 'react'
import { Check, Circle, XCircle } from 'lucide-react'
import { TRIP_STATUSES, TRIP_STATUS_LABELS } from '../../data/tripManagementData.js'

/**
 * TripTimeline — horizontal stepper for the trip workflow:
 * Created -> Assigned -> Started -> Completed.
 * `timeline` is the ordered [{status, at}] log; `status` is the trip's
 * current status (may be 'cancelled', which renders as a halted timeline).
 */
export default function TripTimeline({ status, timeline = [] }) {
  const cancelled = status === 'cancelled'
  const currentIndex = TRIP_STATUSES.indexOf(status)
  const findAt = (s) => timeline.find((t) => t.status === s)?.at

  return (
    <div className="w-full">
      <div className="flex items-start">
        {TRIP_STATUSES.map((stage, i) => {
          const at = findAt(stage)
          const isDone = !cancelled && (i < currentIndex || (i === currentIndex && Boolean(at)))
          const isCurrent = !cancelled && i === currentIndex
          const isLast = i === TRIP_STATUSES.length - 1

          return (
            <React.Fragment key={stage}>
              <div className="flex flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ${
                    isDone
                      ? 'bg-accent-500 text-white ring-accent-100'
                      : isCurrent
                      ? 'bg-accent-500 text-white ring-accent-100'
                      : 'bg-surface text-ink-400 ring-surface-border'
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Circle className="h-2.5 w-2.5 fill-current" />}
                </div>
                <p
                  className={`mt-2 text-xs font-semibold ${
                    isDone || isCurrent ? 'text-ink-900' : 'text-ink-400'
                  }`}
                >
                  {TRIP_STATUS_LABELS[stage]}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-400">{at || 'Pending'}</p>
              </div>
              {!isLast && (
                <div
                  className={`mt-4 h-0.5 flex-1 rounded-full ${
                    !cancelled && i < currentIndex ? 'bg-accent-500' : 'bg-surface-border'
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {cancelled && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
          <XCircle className="h-3.5 w-3.5" />
          This trip was cancelled before completion.
        </div>
      )}
    </div>
  )
}
