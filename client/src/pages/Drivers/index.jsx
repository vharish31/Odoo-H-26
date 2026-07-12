import React, { useState } from 'react'
import { Plus, Star, Phone } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Table from '../../components/tables/Table.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Button from '../../components/common/Button.jsx'
import { useToast } from '../../components/common/Toast.jsx'
import SimpleFormModal from '../../components/modals/SimpleFormModal.jsx'
import ConfirmDialog from '../../components/modals/ConfirmDialog.jsx'
import { drivers as initialDrivers } from '../../constants/dummyData.js'

const DRIVER_FIELDS = [
  { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Arun Kumar' },
  { name: 'license', label: 'License No.', required: true },
  { name: 'phone', label: 'Phone', required: true, placeholder: '+91 98765 43210' },
  { name: 'vehicle', label: 'Assigned Vehicle', placeholder: 'VH-1042 or Unassigned' },
  { name: 'rating', label: 'Rating', type: 'number', defaultValue: '4.5' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'available',
    options: [
      { value: 'available', label: 'Available' },
      { value: 'on-trip', label: 'On Trip' },
      { value: 'on-leave', label: 'Off Duty' },
      { value: 'suspended', label: 'Suspended' },
    ],
  },
]

let nextId = initialDrivers.length + 1

export default function Drivers() {
  const { showToast } = useToast()
  const [drivers, setDrivers] = useState(initialDrivers)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const columns = [
    {
      key: 'name',
      header: 'Driver',
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-50 text-xs font-semibold text-accent-700">
            {d.name.split(' ').map((n) => n[0]).join('')}
          </div>
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
      header: 'Contact',
      render: (d) => (
        <span className="inline-flex items-center gap-1.5 text-ink-700">
          <Phone className="h-3.5 w-3.5 text-ink-400" /> {d.phone}
        </span>
      ),
    },
    { key: 'vehicle', header: 'Assigned Vehicle' },
    {
      key: 'rating',
      header: 'Rating',
      render: (d) => (
        <span className="inline-flex items-center gap-1 text-ink-700">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {d.rating}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (d) => <StatusBadge status={d.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (d) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setEditing(d); setFormOpen(true) }}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleting(d)}>Delete</Button>
        </div>
      ),
    },
  ]

  const handleSubmit = (values) => {
    if (editing) {
      setDrivers((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...values, rating: Number(values.rating) } : d)))
      showToast('Driver updated', 'success')
    } else {
      setDrivers((prev) => [{ id: `DR-${200 + nextId++}`, trips: 0, joined: new Date().toISOString().slice(0, 10), ...values, rating: Number(values.rating) }, ...prev])
      showToast('Driver added', 'success')
    }
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Drivers</h1>
          <p className="text-sm text-ink-500">{drivers.length} drivers on your roster.</p>
        </div>
        <Button icon={Plus} onClick={() => { setEditing(null); setFormOpen(true) }}>Add Driver</Button>
      </div>

      <Card>
        <Table columns={columns} data={drivers} />
      </Card>

      <SimpleFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        onSubmit={handleSubmit}
        title={editing ? 'Edit Driver' : 'Add Driver'}
        fields={DRIVER_FIELDS}
        initialValues={editing || {}}
        submitLabel={editing ? 'Save Changes' : 'Add Driver'}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          setDrivers((prev) => prev.filter((d) => d.id !== deleting.id))
          showToast('Driver removed', 'success')
          setDeleting(null)
        }}
        title="Remove Driver"
        description={deleting ? `Remove ${deleting.name} from the roster?` : ''}
        confirmLabel="Remove"
      />
    </div>
  )
}
