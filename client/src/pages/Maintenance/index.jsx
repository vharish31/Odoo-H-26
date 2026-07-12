import React, { useState } from 'react'
import { Plus, Wrench } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Table from '../../components/tables/Table.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Button from '../../components/common/Button.jsx'
import { useToast } from '../../components/common/Toast.jsx'
import SimpleFormModal from '../../components/modals/SimpleFormModal.jsx'
import { maintenance as initialMaintenance } from '../../constants/dummyData.js'

const MAINTENANCE_FIELDS = [
  { name: 'type', label: 'Service Type', required: true, placeholder: 'Oil Change' },
  { name: 'vehicle', label: 'Vehicle', required: true, placeholder: 'VH-1044' },
  { name: 'workshop', label: 'Workshop', required: true, placeholder: 'Chennai Central Workshop' },
  { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
  { name: 'cost', label: 'Estimated Cost (₹)', type: 'number', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'scheduled',
    options: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'overdue', label: 'Overdue' },
    ],
  },
]

let nextId = initialMaintenance.length + 1

export default function Maintenance() {
  const { showToast } = useToast()
  const [records, setRecords] = useState(initialMaintenance)
  const [formOpen, setFormOpen] = useState(false)

  const columns = [
    {
      key: 'type',
      header: 'Service',
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
            <Wrench className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-ink-900">{m.type}</p>
            <p className="text-xs text-ink-400">{m.id}</p>
          </div>
        </div>
      ),
    },
    { key: 'vehicle', header: 'Vehicle' },
    { key: 'workshop', header: 'Workshop' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'cost', header: 'Est. Cost', render: (m) => `₹${Number(m.cost).toLocaleString()}`, align: 'right' },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (m) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setRecords((prev) => prev.map((r) => r.id === m.id ? { ...r, status: 'completed' } : r))
            showToast(`${m.type} marked complete`, 'success')
          }}
        >
          Complete
        </Button>
      ),
    },
  ]

  const handleSubmit = (values) => {
    setRecords((prev) => [{
      id: `MN-${300 + nextId++}`,
      ...values,
      cost: Number(values.cost),
    }, ...prev])
    showToast('Service scheduled', 'success')
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Maintenance</h1>
          <p className="text-sm text-ink-500">Scheduled services and repair history.</p>
        </div>
        <Button icon={Plus} onClick={() => setFormOpen(true)}>Schedule Service</Button>
      </div>

      <Card>
        <Table columns={columns} data={records} />
      </Card>

      <SimpleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        title="Schedule Maintenance"
        description="Book a new service for a fleet vehicle."
        fields={MAINTENANCE_FIELDS}
        submitLabel="Schedule"
      />
    </div>
  )
}
