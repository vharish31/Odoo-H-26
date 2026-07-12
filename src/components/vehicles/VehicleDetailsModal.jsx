import React from 'react'
import { Truck, Gauge, Users, ShieldCheck, CalendarDays, Hash } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'

/**
 * VehicleDetailsModal — reusable read-only "View" panel for a vehicle record.
 */
export default function VehicleDetailsModal({ open, onClose, vehicle }) {
  if (!vehicle) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Vehicle Details"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900">
          <Truck className="h-5 w-5 text-accent-400" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-900">{vehicle.model}</p>
          <p className="text-xs text-ink-400">{vehicle.id}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={vehicle.status} />
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
        <DetailRow icon={Hash} label="Vehicle Number" value={vehicle.vehicleNumber} />
        <DetailRow icon={Truck} label="Type" value={vehicle.type} />
        <DetailRow icon={Users} label="Capacity" value={`${vehicle.capacity} units`} />
        <DetailRow icon={Gauge} label="Mileage" value={`${vehicle.mileage.toLocaleString()} km`} />
        <DetailRow icon={ShieldCheck} label="Insurance" value={vehicle.insurance} className="sm:col-span-2" />
        <DetailRow icon={CalendarDays} label="Registration Date" value={vehicle.registrationDate} />
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
