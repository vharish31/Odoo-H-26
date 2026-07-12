import React from 'react'
import { ArrowRight, Truck, User, Package, Gauge } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import TripTimeline from './TripTimeline.jsx'

/**
 * TripDetailsModal — read-only "View" panel for a trip, including its
 * workflow timeline and an optional "advance status" action.
 */
export default function TripDetailsModal({ open, onClose, trip, resolveVehicle, resolveDriver, onAdvance }) {
  if (!trip) return null

  const isFinal = trip.status === 'completed' || trip.status === 'cancelled'

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Trip Details"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!isFinal && (
            <Button
              variant="primary"
              onClick={() => {
                onAdvance(trip)
                onClose()
              }}
            >
              Advance Status
            </Button>
          )}
        </>
      }
    >
      <div className="flex items-center gap-3 border-b border-surface-border pb-4">
        <div>
          <p className="flex items-center gap-1.5 font-semibold text-ink-900">
            {trip.origin} <ArrowRight className="h-3.5 w-3.5 text-ink-400" /> {trip.destination}
          </p>
          <p className="text-xs text-ink-400">{trip.id}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={trip.status} />
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
        <DetailRow icon={Truck} label="Vehicle" value={resolveVehicle(trip.vehicle)} />
        <DetailRow icon={User} label="Driver" value={resolveDriver(trip.driver)} />
        <DetailRow icon={Gauge} label="Distance" value={`${trip.distance} km`} />
        <DetailRow icon={Package} label="Cargo" value={trip.cargo} />
      </dl>

      <div className="border-t border-surface-border pt-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
          Trip Timeline
        </p>
        <TripTimeline status={trip.status} timeline={trip.timeline} />
      </div>
    </Modal>
  )
}

function DetailRow({ icon: Icon, label, value, className = '' }) {
  return (
    <div className={className}>
      <dt className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="text-sm text-ink-800">{value}</dd>
    </div>
  )
}
