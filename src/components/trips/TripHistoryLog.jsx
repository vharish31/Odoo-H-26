import React, { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import Card from '../ui/Card.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import { TRIP_STATUS_LABELS } from '../../data/tripManagementData.js'

/**
 * TripHistoryLog — flattens every trip's timeline into a single
 * chronological activity feed, most recent first.
 */
export default function TripHistoryLog({ trips, resolveVehicle, resolveDriver, limit = 8 }) {
  const events = useMemo(() => {
    const flat = trips.flatMap((t) =>
      (t.timeline || []).map((entry) => ({
        tripId: t.id,
        origin: t.origin,
        destination: t.destination,
        vehicle: t.vehicle,
        driver: t.driver,
        status: entry.status,
        at: entry.at,
      }))
    )
    return flat.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, limit)
  }, [trips, limit])

  return (
    <Card title="Trip History" subtitle="Recent status changes across all trips.">
      {events.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-400">No trip activity yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((e, i) => (
            <li key={`${e.tripId}-${e.status}-${i}`} className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-800">
                  <span className="font-medium text-ink-900">{e.tripId}</span>{' '}
                  moved to <StatusBadge status={e.status} label={TRIP_STATUS_LABELS[e.status]} />
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-ink-400">
                  {resolveVehicle(e.vehicle)} · {resolveDriver(e.driver)} · {e.origin}
                  <ArrowRight className="h-3 w-3" />
                  {e.destination}
                </p>
              </div>
              <span className="shrink-0 whitespace-nowrap text-xs text-ink-400">{e.at}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
