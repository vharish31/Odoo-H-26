import React, { useState } from 'react'
import { Plus, MoreHorizontal, Truck } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Table from '../components/ui/Table.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Button from '../components/ui/Button.jsx'
import Modal from '../components/ui/Modal.jsx'
import { vehicles } from '../data/dummyData.js'

export default function Vehicles() {
  const [modalOpen, setModalOpen] = useState(false)

  const columns = [
    {
      key: 'name',
      header: 'Vehicle',
      render: (v) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900">
            <Truck className="h-4 w-4 text-accent-400" />
          </div>
          <div>
            <p className="font-medium text-ink-900">{v.name}</p>
            <p className="text-xs text-ink-400">{v.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'type', header: 'Type' },
    { key: 'plate', header: 'Plate No.' },
    { key: 'driver', header: 'Assigned Driver' },
    { key: 'mileage', header: 'Mileage', render: (v) => `${v.mileage.toLocaleString()} km` },
    { key: 'status', header: 'Status', render: (v) => <StatusBadge status={v.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: () => (
        <button className="rounded-lg p-1.5 text-ink-400 hover:bg-surface hover:text-ink-700">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Vehicles</h1>
          <p className="text-sm text-ink-500">{vehicles.length} vehicles registered in your fleet.</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Add Vehicle
        </Button>
      </div>

      <Card>
        <Table columns={columns} data={vehicles} />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Vehicle"
        description="Register a new vehicle to your fleet."
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Save Vehicle
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Vehicle Name" placeholder="e.g. Volvo FH16" />
          <Field label="Registration Plate" placeholder="e.g. TN 09 AB 4521" />
          <Field label="Vehicle Type" placeholder="Truck / Van / Pickup" />
          <Field label="Fuel Type" placeholder="Diesel / CNG / Electric" />
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-700">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-surface-border bg-surface px-3 text-sm placeholder:text-ink-400 focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-100"
      />
    </label>
  )
}
