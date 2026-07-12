import React from 'react'
import { Truck, Eye, Pencil, Trash2 } from 'lucide-react'
import Table from '../ui/Table.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'

/**
 * VehicleTable — reusable table for vehicle records.
 * View/Edit/Delete callbacks are supplied by the parent page.
 */
export default function VehicleTable({ data, onView, onEdit, onDelete }) {
  const columns = [
    {
      key: 'vehicleNumber',
      header: 'Vehicle Number',
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900">
            <Truck className="h-4 w-4 text-accent-400" />
          </div>
          <div>
            <p className="font-medium text-ink-900">{v.vehicleNumber}</p>
            <p className="text-xs text-ink-400">{v.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'model', header: 'Model' },
    { key: 'type', header: 'Type' },
    { key: 'capacity', header: 'Capacity', render: (v) => `${v.capacity} units` },
    { key: 'mileage', header: 'Mileage', render: (v) => `${v.mileage.toLocaleString()} km` },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (v) => (
        <div className="flex items-center justify-end gap-1">
          <ActionButton label="View vehicle" onClick={() => onView(v)} icon={Eye} />
          <ActionButton label="Edit vehicle" onClick={() => onEdit(v)} icon={Pencil} />
          <ActionButton
            label="Delete vehicle"
            onClick={() => onDelete(v)}
            icon={Trash2}
            danger
          />
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={data} emptyLabel="No vehicles match your search." />
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
