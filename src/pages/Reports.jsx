import React, { useMemo, useState } from 'react'
import { Download, Gauge, Fuel, IndianRupee, Route } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import AnalyticsFilterBar from '../components/analytics/AnalyticsFilterBar.jsx'
import StatCard from '../components/analytics/StatCard.jsx'
import VehicleUtilizationChart from '../components/analytics/charts/VehicleUtilizationChart.jsx'
import FuelEfficiencyChart from '../components/analytics/charts/FuelEfficiencyChart.jsx'
import ExpenseBreakdownChart from '../components/analytics/charts/ExpenseBreakdownChart.jsx'
import TripAnalyticsChart from '../components/analytics/charts/TripAnalyticsChart.jsx'
import {
  tripLogs,
  fuelLogs,
  expenseRecords,
  ANALYTICS_VEHICLES,
  applyFilters,
  sumBy,
  groupSum,
  groupByMonth,
  formatINR,
} from '../data/analyticsData.js'

const DAY_MS = 24 * 60 * 60 * 1000
const WORK_HOURS_PER_DAY = 10

function daySpan(records, filters) {
  if (filters.startDate && filters.endDate) {
    return Math.max(1, Math.round((new Date(filters.endDate) - new Date(filters.startDate)) / DAY_MS) + 1)
  }
  if (!records.length) return 1
  const dates = records.map((r) => r.date).sort()
  return Math.max(1, Math.round((new Date(dates[dates.length - 1]) - new Date(dates[0])) / DAY_MS) + 1)
}

export default function Reports() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', vehicle: '' })
  const resetFilters = () => setFilters({ startDate: '', endDate: '', vehicle: '' })

  const filteredTrips = useMemo(() => applyFilters(tripLogs, filters), [filters])
  const filteredFuel = useMemo(() => applyFilters(fuelLogs, filters), [filters])
  const filteredExpenses = useMemo(() => applyFilters(expenseRecords, filters), [filters])

  const days = daySpan(filteredTrips, filters)
  const availableHours = days * WORK_HOURS_PER_DAY

  const utilizationData = useMemo(() => {
    const byVehicle = new Map()
    filteredTrips.forEach((t) => {
      byVehicle.set(t.vehicle, (byVehicle.get(t.vehicle) || 0) + t.durationHrs)
    })
    return ANALYTICS_VEHICLES.filter((v) => !filters.vehicle || v.id === filters.vehicle)
      .map((v) => ({
        name: v.id,
        value: Math.min(100, Math.round(((byVehicle.get(v.id) || 0) / availableHours) * 100)),
      }))
      .sort((a, b) => b.value - a.value)
  }, [filteredTrips, filters.vehicle, availableHours])

  const fuelEfficiencyData = useMemo(() => {
    const byVehicle = new Map()
    filteredFuel.forEach((f) => {
      if (!byVehicle.has(f.vehicle)) byVehicle.set(f.vehicle, [])
      byVehicle.get(f.vehicle).push(f.efficiency)
    })
    return Array.from(byVehicle, ([vehicle, vals]) => ({
      name: vehicle,
      value: +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1),
    })).sort((a, b) => b.value - a.value)
  }, [filteredFuel])

  const expenseBreakdownData = useMemo(() => groupSum(filteredExpenses, 'category', 'amount'), [filteredExpenses])

  const tripAnalyticsData = useMemo(
    () => groupByMonth(filteredTrips, ['__count', 'distance']).map((d) => ({ month: d.month, trips: d.__count, distance: d.distance })),
    [filteredTrips]
  )

  const avgUtilization = utilizationData.length
    ? Math.round(utilizationData.reduce((s, d) => s + d.value, 0) / utilizationData.length)
    : 0
  const avgEfficiency = fuelEfficiencyData.length
    ? +(fuelEfficiencyData.reduce((s, d) => s + d.value, 0) / fuelEfficiencyData.length).toFixed(1)
    : 0
  const totalTrips = filteredTrips.length
  const totalExpense = sumBy(filteredExpenses, 'amount')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Reports</h1>
          <p className="text-sm text-ink-500">Fleet-wide utilization, efficiency, spend, and trip performance.</p>
        </div>
        <Button variant="outline" icon={Download}>Export</Button>
      </div>

      <AnalyticsFilterBar filters={filters} onChange={setFilters} onReset={resetFilters} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Avg. Fleet Utilization" value={`${avgUtilization}%`} icon={Gauge} tone="accent" />
        <StatCard label="Avg. Fuel Efficiency" value={`${avgEfficiency} km/L`} icon={Fuel} tone="emerald" />
        <StatCard label="Total Trips" value={totalTrips} icon={Route} tone="navy" />
        <StatCard label="Total Expenses" value={formatINR(totalExpense)} icon={IndianRupee} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Vehicle Utilization" subtitle={`Active hours vs. ${WORK_HOURS_PER_DAY}h/day capacity over ${days} day${days === 1 ? '' : 's'}`}>
          <VehicleUtilizationChart data={utilizationData} />
        </Card>
        <Card title="Fuel Efficiency" subtitle="Average km/L by vehicle">
          <FuelEfficiencyChart data={fuelEfficiencyData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card title="Expense Breakdown" subtitle="Total spend by category">
          <ExpenseBreakdownChart data={expenseBreakdownData} />
        </Card>
        <Card title="Trip Analytics" subtitle="Trip count and distance covered by month">
          <TripAnalyticsChart data={tripAnalyticsData} />
        </Card>
      </div>
    </div>
  )
}
