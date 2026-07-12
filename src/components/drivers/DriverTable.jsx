import React from 'react'
import { Star, Phone, Eye, Pencil, Trash2 } from 'lucide-react'
import Table from '../ui/Table.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import DriverAvatar from './DriverAvatar.jsx'

/**
 * DriverTable — reusable table for driver records.
 * View/Edit/Delete callbacks are supplied by the parent page.
 */
export default function DriverTable({ data, onView, onEdit, onDelete }) {
  const columns = [
    {
      key: 'name',
      header: 'Driver',
      render: (d) => (
        <div className="flex items-center gap-3">
          <DriverAvatar name={d.name} photo={d.photo} />
          <div>
            <p className="font-medium text-ink-900">{d.name}</p>
            <p className="text-xs text-ink-400">{d.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'license', header: 'License No.' },
    {
      key: 'phone',
      header: 'Phone',
      render: (d) => (
        <span className="inline-flex items-center gap-1.5 text-ink-700">
          <Phone className="h-3.5 w-3.5 text-ink-400" /> {d.phone}
        </span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (d) => (
        <span className="inline-flex items-center gap-1 text-ink-700">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {d.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'vehicle',
      header: 'Assigned Vehicle',
      render: (d) => (d.vehicle ? d.vehicle : <span className="text-ink-400">Unassigned</span>),
    },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (d) => (
        <div className="flex items-center justify-end gap-1">
          <ActionButton label="View driver" onClick={() => onView(d)} icon={Eye} />
          <ActionButton label="Edit driver" onClick={() => onEdit(d)} icon={Pencil} />
          <ActionButton label="Delete driver" onClick={() => onDelete(d)} icon={Trash2} danger />
        </div>
      ),
    },
  ]

  return <Table columns={columns} data={data} emptyLabel="No drivers match your search." />
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
