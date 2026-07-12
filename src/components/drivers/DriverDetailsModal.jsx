import React from 'react'
import { Phone, Star, Truck, IdCard } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import DriverAvatar from './DriverAvatar.jsx'

/**
 * DriverDetailsModal — reusable read-only "View" panel for a driver record.
 */
export default function DriverDetailsModal({ open, onClose, driver }) {
  if (!driver) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Driver Details"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex items-center gap-3 border-b border-surface-border pb-4">
        <DriverAvatar name={driver.name} photo={driver.photo} size="lg" />
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-900">{driver.name}</p>
          <p className="text-xs text-ink-400">{driver.id}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={driver.status} />
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
        <DetailRow icon={IdCard} label="License Number" value={driver.license} />
        <DetailRow icon={Phone} label="Phone" value={driver.phone} />
        <DetailRow
          icon={Star}
          label="Rating"
          value={`${driver.rating.toFixed(1)} / 5.0`}
        />
        <DetailRow
          icon={Truck}
          label="Assigned Vehicle"
          value={driver.vehicle || 'Unassigned'}
        />
      </dl>
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
