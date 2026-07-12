import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Plus } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import StatusBadge from '../../components/common/StatusBadge.jsx'
import Table from '../../components/tables/Table.jsx'
import Button from '../../components/common/Button.jsx'
import { useToast } from '../../components/common/Toast.jsx'
import { downloadJson } from '../../utils/exportData.js'
import { vehicleAPI } from '../../services/api.js'
import KpiCard from '../../components/cards/KpiCard.jsx'
import FleetUtilizationChart from '../../components/charts/FleetUtilizationChart.jsx'
import MonthlyExpenseChart from '../../components/charts/MonthlyExpenseChart.jsx'
import FuelConsumptionChart from '../../components/charts/FuelConsumptionChart.jsx'
import AlertCenter from '../../components/cards/AlertCenter.jsx'
import MaintenanceTimeline from '../../components/cards/MaintenanceTimeline.jsx'
import AIAssistantCard from '../../components/cards/AIAssistantCard.jsx'
import {
  dashboardKpis,
  fleetUtilizationBreakdown,
  monthlyExpenseTrend,
  fuelConsumptionTrend,
  recentTrips,
  upcomingMaintenance,
  smartAlerts,
  aiFleetInsights,
} from '../../constants/dummyData.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [vehicleCount, setVehicleCount] = useState(null)

  useEffect(() => {
    vehicleAPI.getAll()
      .then((res) => setVehicleCount(res.data.data.count || 0))
      .catch(() => setVehicleCount(null))
  }, [])

  const updatedDashboardKpis = dashboardKpis.map((kpi) => {
    if (kpi.key === 'total-vehicles' && vehicleCount !== null) {
      return { ...kpi, value: String(vehicleCount) }
    }
    return kpi
  })

  const handleExport = () => {
    downloadJson('transitops-dashboard-export.json', {
      kpis: updatedDashboardKpis,
      trips: recentTrips,
      maintenance: upcomingMaintenance,
      alerts: smartAlerts,
    })
    showToast('Dashboard report exported', 'success')
  }

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
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Fleet Overview</h1>
          <p className="text-sm text-ink-500">Live status across your vehicles, drivers and trips.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" icon={Download} onClick={handleExport}>Export</Button>
          <Button variant="primary" size="md" icon={Plus} onClick={() => navigate('/trips')}>New Trip</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {updatedDashboardKpis.map(({ key, ...kpi }) => (
          <KpiCard key={key} {...kpi} />
        ))}
      </div>

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Recent Trips"
          subtitle="Latest activity across the fleet"
          action={<Button variant="outline" size="sm" onClick={() => navigate('/trips')}>View all</Button>}
        >
          <Table columns={tripColumns} data={recentTrips} />
        </Card>
        <AIAssistantCard insight={aiFleetInsights} onAsk={() => showToast('AI assistant coming soon', 'info')} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card
          title="Upcoming Maintenance"
          subtitle="Scheduled and overdue service events"
          action={<Button variant="outline" size="sm" onClick={() => navigate('/maintenance')}>View schedule</Button>}
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
