import React, { useState } from 'react'
import { Plus, ArrowRight } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Table from '../../components/tables/Table.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Button from '../../components/common/Button.jsx'
import { useToast } from '../../components/common/Toast.jsx'
import SimpleFormModal from '../../components/modals/SimpleFormModal.jsx'
import ConfirmDialog from '../../components/modals/ConfirmDialog.jsx'
import { trips as initialTrips } from '../../constants/dummyData.js'

const TRIP_FIELDS = [
  { name: 'origin', label: 'Origin', required: true, placeholder: 'Chennai' },
  { name: 'destination', label: 'Destination', required: true, placeholder: 'Bengaluru' },
  { name: 'vehicle', label: 'Vehicle', required: true, placeholder: 'VH-1042' },
  { name: 'driver', label: 'Driver', required: true, placeholder: 'Arun Kumar' },
  { name: 'distance', label: 'Distance', placeholder: '346 km' },
  { name: 'eta', label: 'ETA', placeholder: 'Today, 6:40 PM' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'scheduled',
    options: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'in-transit', label: 'In Transit' },
      { value: 'delayed', label: 'Delayed' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
]

let nextId = initialTrips.length + 1

export default function Trips() {
  const { showToast } = useToast()
  const [trips, setTrips] = useState(initialTrips)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const columns = [
    { key: 'id', header: 'Trip ID' },
    {
      key: 'route',
      header: 'Route',
      render: (t) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-ink-900">
          {t.origin} <ArrowRight className="h-3.5 w-3.5 text-ink-400" /> {t.destination}
        </span>
      ),
    },
    { key: 'vehicle', header: 'Vehicle' },
    { key: 'driver', header: 'Driver' },
    { key: 'distance', header: 'Distance' },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
    { key: 'eta', header: 'ETA', align: 'right' },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (t) => <Button variant="ghost" size="sm" onClick={() => setDeleting(t)}>Cancel</Button>,
    },
  ]

  const handleSubmit = (values) => {
    setTrips((prev) => [{
      id: `TR-${8800 + nextId++}`,
      startedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ...values,
    }, ...prev])
    showToast('Trip created', 'success')
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Trips</h1>
          <p className="text-sm text-ink-500">Track every trip from dispatch to delivery.</p>
        </div>
        <Button icon={Plus} onClick={() => setFormOpen(true)}>New Trip</Button>
      </div>

      <Card>
        <Table columns={columns} data={trips} />
      </Card>

      <SimpleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        title="Create New Trip"
        description="Dispatch a new trip across your fleet."
        fields={TRIP_FIELDS}
        submitLabel="Create Trip"
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          setTrips((prev) => prev.map((t) => t.id === deleting.id ? { ...t, status: 'cancelled', eta: '—' } : t))
          showToast('Trip cancelled', 'success')
          setDeleting(null)
        }}
        title="Cancel Trip"
        description={deleting ? `Cancel trip ${deleting.id} (${deleting.origin} → ${deleting.destination})?` : ''}
        confirmLabel="Cancel Trip"
      />
    </div>
  )
}
