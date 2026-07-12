import React from 'react'
import { Download, Plus } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Table from '../components/ui/Table.jsx'
import Button from '../components/ui/Button.jsx'
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

export default function Dashboard() {
  const tripColumns = [
    { key: 'id', header: 'Trip ID' },
    { key: 'vehicle', header: 'Vehicle' },
    { key: 'route', header: 'Route', render: (r) => `${r.origin} → ${r.destination}` },
    { key: 'driver', header: 'Driver' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'eta', header: 'ETA', align: 'right' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Fleet Overview</h1>
          <p className="text-sm text-ink-500">Live status across your vehicles, drivers and trips.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" icon={Download}>
            Export
          </Button>
          <Button variant="primary" size="md" icon={Plus}>
            New Trip
          </Button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {dashboardKpis.map((kpi) => (
          <KpiCard key={kpi.key} {...kpi} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card title="Fleet Utilization" subtitle="Current deployment status">
          <FleetUtilizationChart data={fleetUtilizationBreakdown} />
        </Card>

        <Card title="Monthly Expense" subtitle="Total fleet spend, last 7 months">
          <MonthlyExpenseChart data={monthlyExpenseTrend} />
        </Card>

        <Card title="Fuel Consumption" subtitle="Diesel vs. CNG usage by month">
          <FuelConsumptionChart data={fuelConsumptionTrend} />
        </Card>
      </div>

      {/* Trips + AI assistant */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Recent Trips"
          subtitle="Latest activity across the fleet"
          action={
            <Button variant="outline" size="sm">
              View all
            </Button>
          }
        >
          <Table columns={tripColumns} data={recentTrips} />
        </Card>

        <AIAssistantCard insight={aiFleetInsights} />
      </div>

      {/* Maintenance + Alerts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title="Upcoming Maintenance"
          subtitle="Scheduled and overdue service events"
          action={
            <Button variant="outline" size="sm">
              View schedule
            </Button>
          }
        >
          <MaintenanceTimeline items={upcomingMaintenance} />
        </Card>

        <Card title="Smart Alert Center" subtitle="Auto-generated alerts needing attention">
          <AlertCenter alerts={smartAlerts} />
        </Card>
      </div>
    </div>
  )
}
