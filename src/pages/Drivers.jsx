import React from 'react'
import { Plus, Star, Phone } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Table from '../components/ui/Table.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Button from '../components/ui/Button.jsx'
import { drivers } from '../data/dummyData.js'

export default function Drivers() {
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Drivers</h1>
          <p className="text-sm text-ink-500">{drivers.length} drivers on your roster.</p>
        </div>
        <Button icon={Plus}>Add Driver</Button>
      </div>

      <Card>
        <Table columns={columns} data={drivers} />
      </Card>
    </div>
  )
}
