import React from 'react'
import { ArrowRight, Eye, ArrowRightCircle, Trash2, Package } from 'lucide-react'
import Table from '../ui/Table.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import { TRIP_STATUSES } from '../../data/tripManagementData.js'

/**
 * TripTable — reusable table for trip records.
 * View/Advance/Delete callbacks are supplied by the parent page.
 * `resolveVehicle` / `resolveDriver` map an id to a display label.
 */
export default function TripTable({ data, resolveVehicle, resolveDriver, onView, onAdvance, onDelete }) {
  const columns = [
    {
      key: 'id',
      header: 'Trip ID',
      render: (t) => <span className="font-medium text-ink-900">{t.id}</span>,
    },
    {
      key: 'route',
      header: 'Route',
      render: (t) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-ink-900">
          {t.origin} <ArrowRight className="h-3.5 w-3.5 text-ink-400" /> {t.destination}
        </span>
      ),
    },
    { key: 'vehicle', header: 'Vehicle', render: (t) => resolveVehicle(t.vehicle) },
    { key: 'driver', header: 'Driver', render: (t) => resolveDriver(t.driver) },
    {
      key: 'cargo',
      header: 'Cargo',
      render: (t) => (
        <span className="inline-flex items-center gap-1.5 text-ink-700">
          <Package className="h-3.5 w-3.5 text-ink-400" /> {t.cargo}
        </span>
      ),
    },
    { key: 'distance', header: 'Distance', render: (t) => `${t.distance} km` },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (t) => {
        const isFinal = t.status === 'completed' || t.status === 'cancelled'
        return (
          <div className="flex items-center justify-end gap-1">
            <ActionButton label="View timeline" onClick={() => onView(t)} icon={Eye} />
            {!isFinal && (
              <ActionButton
                label={`Advance to ${nextLabel(t.status)}`}
                onClick={() => onAdvance(t)}
                icon={ArrowRightCircle}
              />
            )}
            <ActionButton label="Delete trip" onClick={() => onDelete(t)} icon={Trash2} danger />
          </div>
        )
      },
    },
  ]

  return <Table columns={columns} data={data} emptyLabel="No trips match your search." />
}

function nextLabel(status) {
  const idx = TRIP_STATUSES.indexOf(status)
  const next = TRIP_STATUSES[idx + 1]
  return next ? next[0].toUpperCase() + next.slice(1) : ''
}

function ActionButton({ label, icon: Icon, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={label}
      title={label}
      className={`rounded-lg p-1.5 transition-colors ${
        danger
          ? 'text-ink-400 hover:bg-rose-50 hover:text-rose-600'
          : 'text-ink-400 hover:bg-surface hover:text-ink-700'
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
