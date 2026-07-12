import React from 'react'
import { Plus, Wrench } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Table from '../components/ui/Table.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Button from '../components/ui/Button.jsx'
import { maintenance } from '../data/dummyData.js'

export default function Maintenance() {
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
    { key: 'cost', header: 'Est. Cost', render: (m) => `₹${m.cost.toLocaleString()}`, align: 'right' },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Maintenance</h1>
          <p className="text-sm text-ink-500">Scheduled services and repair history.</p>
        </div>
        <Button icon={Plus}>Schedule Service</Button>
      </div>

      <Card>
        <Table columns={columns} data={maintenance} />
      </Card>
    </div>
  )
}
