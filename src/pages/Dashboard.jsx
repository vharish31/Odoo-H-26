<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { Download, Plus } from 'lucide-react'
=======
import React from 'react'
import { TrendingUp, TrendingDown, Truck, Users, Route, Wrench } from 'lucide-react'
>>>>>>> a82fcfc3513dafcc58330ed3feb20add89a911f5
import Card from '../components/ui/Card.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Table from '../components/ui/Table.jsx'
import Button from '../components/ui/Button.jsx'
<<<<<<< HEAD
import { vehicleAPI } from '../services/api.js'
import KpiCard from '../components/dashboard/KpiCard.jsx'
import FleetUtilizationChart from '../components/dashboard/FleetUtilizationChart.jsx'
import MonthlyExpenseChart from '../components/dashboard/MonthlyExpenseChart.jsx'
import FuelConsumptionChart from '../components/dashboard/FuelConsumptionChart.jsx'
import AlertCenter from '../components/dashboard/AlertCenter.jsx'
import MaintenanceTimeline from '../components/dashboard/MaintenanceTimeline.jsx'
import AIAssistantCard from '../components/dashboard/AIAssistantCard.jsx'
import {
  dashboardKpis,
  fleetUtilizationBreakdown,
  monthlyExpenseTrend,
  fuelConsumptionTrend,
  recentTrips,
  upcomingMaintenance,
  smartAlerts,
  aiFleetInsights,
} from '../data/dummyData.js'
=======
import { kpis, trips, maintenance } from '../data/dummyData.js'

const KPI_ICONS = [Truck, Users, Route, Wrench]
>>>>>>> a82fcfc3513dafcc58330ed3feb20add89a911f5

export default function Dashboard() {
  const [vehicleCount, setVehicleCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVehicleCount()
  }, [])

  const fetchVehicleCount = async () => {
    try {
      const response = await vehicleAPI.getAll()
      setVehicleCount(response.data.data.count || 0)
    } catch (err) {
      console.error('Error fetching vehicle count:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update vehicle KPI with real data
  const updatedDashboardKpis = dashboardKpis.map((kpi) => {
    if (kpi.key === 'vehicles') {
      return { ...kpi, value: loading ? '...' : vehicleCount }
    }
    return kpi
  })

  const tripColumns = [
    { key: 'id', header: 'Trip ID' },
    { key: 'route', header: 'Route', render: (r) => `${r.origin} → ${r.destination}` },
    { key: 'driver', header: 'Driver' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'eta', header: 'ETA', align: 'right' },
  ]

  const upcomingMaintenance = maintenance
    .filter((m) => m.status !== 'completed')
    .slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Fleet Overview</h1>
          <p className="text-sm text-ink-500">Live status across your vehicles, drivers and trips.</p>
        </div>
        <Button variant="primary" size="md">New Trip</Button>
      </div>

      {/* KPI grid */}
<<<<<<< HEAD
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {updatedDashboardKpis.map((kpi) => (
          <KpiCard key={kpi.key} {...kpi} />
        ))}
=======
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = KPI_ICONS[i]
          const isUp = kpi.trend === 'up'
          return (
            <Card key={kpi.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-ink-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-bold text-ink-900">{kpi.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
                  <Icon className="h-5 w-5 text-accent-600" strokeWidth={1.75} />
                </div>
              </div>
              <div
                className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
                  isUp ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {kpi.delta}
              </div>
            </Card>
          )
        })}
>>>>>>> a82fcfc3513dafcc58330ed3feb20add89a911f5
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Active trips table */}
        <Card
          className="xl:col-span-2"
          title="Active & Upcoming Trips"
          subtitle="Real-time trip status across the fleet"
          action={
            <Button variant="outline" size="sm">View all</Button>
          }
        >
          <Table columns={tripColumns} data={trips} />
        </Card>

        {/* Maintenance widget */}
        <Card title="Maintenance Alerts" subtitle="Vehicles needing attention">
          <ul className="space-y-3">
            {upcomingMaintenance.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-surface-border p-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink-900">{m.vehicle}</p>
                  <p className="text-xs text-ink-500">{m.type}</p>
                </div>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="sm" className="mt-4 w-full justify-center">
            View maintenance schedule
          </Button>
        </Card>
      </div>
    </div>
  )
}
