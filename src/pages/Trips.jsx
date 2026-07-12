import React from 'react'
import { Plus, ArrowRight } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Table from '../components/ui/Table.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Button from '../components/ui/Button.jsx'
import { trips } from '../data/dummyData.js'

export default function Trips() {
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Trips</h1>
          <p className="text-sm text-ink-500">Track every trip from dispatch to delivery.</p>
        </div>
        <Button icon={Plus}>New Trip</Button>
      </div>

      <Card>
        <Table columns={columns} data={trips} />
      </Card>
    </div>
  )
}
