import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Table from '../../components/tables/Table.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Button from '../../components/common/Button.jsx'
import { useToast } from '../../components/common/Toast.jsx'
import SimpleFormModal from '../../components/modals/SimpleFormModal.jsx'
import { expenses as initialExpenses } from '../../constants/dummyData.js'

const EXPENSE_FIELDS = [
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    defaultValue: 'Fuel',
    options: [
      { value: 'Fuel', label: 'Fuel' },
      { value: 'Toll', label: 'Toll' },
      { value: 'Maintenance', label: 'Maintenance' },
      { value: 'Driver Allowance', label: 'Driver Allowance' },
      { value: 'Fine', label: 'Fine' },
    ],
  },
  { name: 'vehicle', label: 'Vehicle', required: true, placeholder: 'VH-1042' },
  { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'paidBy', label: 'Paid Via', placeholder: 'Company Card' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'pending',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
]

let nextId = initialExpenses.length + 1

export default function Expenses() {
  const { showToast } = useToast()
  const [expenses, setExpenses] = useState(initialExpenses)
  const [formOpen, setFormOpen] = useState(false)

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const columns = [
    { key: 'id', header: 'Expense ID' },
    { key: 'category', header: 'Category' },
    { key: 'vehicle', header: 'Vehicle' },
    { key: 'paidBy', header: 'Paid Via' },
    { key: 'date', header: 'Date' },
    { key: 'amount', header: 'Amount', render: (e) => `₹${e.amount.toLocaleString()}`, align: 'right' },
    { key: 'status', header: 'Status', render: (e) => <StatusBadge status={e.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (e) => (
        e.status === 'pending' ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setExpenses((prev) => prev.map((x) => x.id === e.id ? { ...x, status: 'approved' } : x))
              showToast('Expense approved', 'success')
            }}
          >
            Approve
          </Button>
        ) : null
      ),
    },
  ]

  const handleSubmit = (values) => {
    setExpenses((prev) => [{
      id: `EX-${3300 + nextId++}`,
      ...values,
      amount: Number(values.amount),
      paidBy: values.paidBy || 'Company Card',
    }, ...prev])
    showToast('Expense recorded', 'success')
    setFormOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Expenses</h1>
          <p className="text-sm text-ink-500">
            Total this period: <span className="font-semibold text-ink-900">₹{total.toLocaleString()}</span>
          </p>
        </div>
        <Button icon={Plus} onClick={() => setFormOpen(true)}>Add Expense</Button>
      </div>

      <Card>
        <Table columns={columns} data={expenses} />
      </Card>

      <SimpleFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        title="Add Expense"
        description="Record a new fleet expense."
        fields={EXPENSE_FIELDS}
        submitLabel="Add Expense"
      />
    </div>
  )
}
