import React, { useMemo, useState } from 'react'
import { Plus, IndianRupee, Fuel, TrendingUp, Layers } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Table from '../components/ui/Table.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Button from '../components/ui/Button.jsx'
import AnalyticsFilterBar from '../components/analytics/AnalyticsFilterBar.jsx'
import StatCard from '../components/analytics/StatCard.jsx'
import FuelLogsChart from '../components/analytics/charts/FuelLogsChart.jsx'
import ExpenseCategoriesChart from '../components/analytics/charts/ExpenseCategoriesChart.jsx'
import MonthlySpendingChart from '../components/analytics/charts/MonthlySpendingChart.jsx'
import {
  expenseRecords,
  fuelLogs,
  ANALYTICS_VEHICLES,
  applyFilters,
  sumBy,
  groupSum,
  groupByMonth,
  formatINR,
} from '../data/analyticsData.js'

const vehicleNameMap = Object.fromEntries(ANALYTICS_VEHICLES.map((v) => [v.id, v.name]))

export default function Expenses() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', vehicle: '' })
  const resetFilters = () => setFilters({ startDate: '', endDate: '', vehicle: '' })

  const filteredExpenses = useMemo(() => applyFilters(expenseRecords, filters), [filters])
  const filteredFuel = useMemo(() => applyFilters(fuelLogs, filters), [filters])

  const total = sumBy(filteredExpenses, 'amount')
  const fuelSpend = sumBy(filteredExpenses.filter((e) => e.category === 'Fuel'), 'amount')
  const avgFuelPrice = filteredFuel.length
    ? Math.round(sumBy(filteredFuel, 'cost') / Math.max(sumBy(filteredFuel, 'liters'), 1))
    : 0
  const categoryCount = new Set(filteredExpenses.map((e) => e.category)).size

  const categoryData = useMemo(() => groupSum(filteredExpenses, 'category', 'amount'), [filteredExpenses])
  const monthlySpend = useMemo(() => groupByMonth(filteredExpenses, ['amount']), [filteredExpenses])
  const fuelTrend = useMemo(() => groupByMonth(filteredFuel, ['liters', 'cost']), [filteredFuel])

  const expenseColumns = [
    { key: 'id', header: 'Expense ID' },
    { key: 'category', header: 'Category' },
    { key: 'vehicle', header: 'Vehicle', render: (e) => vehicleNameMap[e.vehicle] || e.vehicle },
    { key: 'paidBy', header: 'Paid Via' },
    { key: 'date', header: 'Date' },
    { key: 'amount', header: 'Amount', render: (e) => formatINR(e.amount), align: 'right' },
    { key: 'status', header: 'Status', render: (e) => <StatusBadge status={e.status} /> },
  ]

  const fuelColumns = [
    { key: 'id', header: 'Log ID' },
    { key: 'vehicle', header: 'Vehicle', render: (f) => vehicleNameMap[f.vehicle] || f.vehicle },
    { key: 'date', header: 'Date' },
    { key: 'liters', header: 'Liters', render: (f) => `${f.liters} L`, align: 'right' },
    { key: 'cost', header: 'Cost', render: (f) => formatINR(f.cost), align: 'right' },
    { key: 'efficiency', header: 'Efficiency', render: (f) => `${f.efficiency} km/L`, align: 'right' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Expense Analytics</h1>
          <p className="text-sm text-ink-500">Fuel logs, spending categories, and monthly trends.</p>
        </div>
        <Button icon={Plus}>Add Expense</Button>
      </div>

      <AnalyticsFilterBar filters={filters} onChange={setFilters} onReset={resetFilters} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Spend" value={formatINR(total)} icon={IndianRupee} tone="accent" />
        <StatCard label="Fuel Spend" value={formatINR(fuelSpend)} icon={Fuel} tone="amber" />
        <StatCard label="Avg. Fuel Price" value={`₹${avgFuelPrice}/L`} icon={TrendingUp} tone="emerald" />
        <StatCard label="Active Categories" value={categoryCount} icon={Layers} tone="navy" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Fuel Logs" subtitle="Fuel volume and cost by month">
          <FuelLogsChart data={fuelTrend} />
        </Card>
        <Card title="Expense Categories" subtitle="Share of total spend">
          <ExpenseCategoriesChart data={categoryData} />
        </Card>
      </div>

      <Card title="Monthly Spending" subtitle="Total expenses recorded by month">
        <MonthlySpendingChart data={monthlySpend} />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Fuel Log Detail" subtitle={`${filteredFuel.length} fill-up${filteredFuel.length === 1 ? '' : 's'} matching current filters`}>
          <Table columns={fuelColumns} data={filteredFuel.slice(0, 8)} />
        </Card>
        <Card
          title="Expense Log"
          subtitle={`${filteredExpenses.length} record${filteredExpenses.length === 1 ? '' : 's'} matching current filters`}
        >
          <Table columns={expenseColumns} data={filteredExpenses.slice(0, 8)} />
        </Card>
      </div>
    </div>
  )
}
