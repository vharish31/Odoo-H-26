import React from 'react'
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Table from '../components/ui/Table.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Button from '../components/ui/Button.jsx'
import { expenses } from '../data/dummyData.js'

export default function Expenses() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const columns = [
    { key: 'id', header: 'Expense ID' },
    { key: 'category', header: 'Category' },
    { key: 'vehicle', header: 'Vehicle' },
    { key: 'paidBy', header: 'Paid Via' },
    { key: 'date', header: 'Date' },
    { key: 'amount', header: 'Amount', render: (e) => `₹${e.amount.toLocaleString()}`, align: 'right' },
    { key: 'status', header: 'Status', render: (e) => <StatusBadge status={e.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Expenses</h1>
          <p className="text-sm text-ink-500">
            Total this period: <span className="font-semibold text-ink-900">₹{total.toLocaleString()}</span>
          </p>
        </div>
        <Button icon={Plus}>Add Expense</Button>
      </div>

      <Card>
        <Table columns={columns} data={expenses} />
      </Card>
    </div>
  )
}
