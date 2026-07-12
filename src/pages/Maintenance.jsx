import React, { useMemo, useState } from 'react'
import { Plus, Wrench, IndianRupee, AlertTriangle, CalendarClock, ClipboardList } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Table from '../components/ui/Table.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import Button from '../components/ui/Button.jsx'
import AnalyticsFilterBar from '../components/analytics/AnalyticsFilterBar.jsx'
import StatCard from '../components/analytics/StatCard.jsx'
import PriorityBadge from '../components/analytics/PriorityBadge.jsx'
import ServiceCostTrendChart from '../components/analytics/charts/ServiceCostTrendChart.jsx'
import PriorityBreakdownChart from '../components/analytics/charts/PriorityBreakdownChart.jsx'
import ServiceHistoryChart from '../components/analytics/charts/ServiceHistoryChart.jsx'
import {
  allMaintenance,
  upcomingServiceRecords,
  ANALYTICS_VEHICLES,
  applyFilters,
  sumBy,
  groupCount,
  groupByMonth,
  formatINR,
} from '../data/analyticsData.js'

const vehicleNameMap = Object.fromEntries(ANALYTICS_VEHICLES.map((v) => [v.id, v.name]))

export default function Maintenance() {
  const [filters, setFilters] = useState({ startDate: '', endDate: '', vehicle: '' })
  const resetFilters = () => setFilters({ startDate: '', endDate: '', vehicle: '' })

  const filtered = useMemo(() => applyFilters(allMaintenance, filters), [filters])
  const upcomingFiltered = useMemo(() => applyFilters(upcomingServiceRecords, filters), [filters])

  const totalCost = sumBy(filtered, 'cost')
  const avgCost = filtered.length ? Math.round(totalCost / filtered.length) : 0
  const overdueCount = upcomingFiltered.filter((m) => m.status === 'overdue').length

  const priorityData = useMemo(() => groupCount(filtered, 'priority'), [filtered])
  const costTrend = useMemo(() => groupByMonth(filtered, ['cost']).map((d) => ({ month: d.month, cost: d.cost })), [filtered])
  const historyByVehicle = useMemo(
    () =>
      groupCount(filtered, 'vehicle')
        .map((d) => ({ name: d.name, value: d.value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8),
    [filtered]
  )

  const upcomingSorted = useMemo(
    () => [...upcomingFiltered].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [upcomingFiltered]
  )

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
    { key: 'vehicle', header: 'Vehicle', render: (m) => vehicleNameMap[m.vehicle] || m.vehicle },
    { key: 'workshop', header: 'Workshop' },
    { key: 'date', header: 'Date' },
    { key: 'priority', header: 'Priority', render: (m) => <PriorityBadge priority={m.priority} /> },
    { key: 'cost', header: 'Cost', render: (m) => formatINR(m.cost), align: 'right' },
    { key: 'status', header: 'Status', render: (m) => <StatusBadge status={m.status} /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Maintenance Analytics</h1>
          <p className="text-sm text-ink-500">Service history, upcoming work, cost, and priority across the fleet.</p>
        </div>
        <Button icon={Plus}>Schedule Service</Button>
      </div>

      <AnalyticsFilterBar filters={filters} onChange={setFilters} onReset={resetFilters} />

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Services in Period" value={filtered.length} icon={ClipboardList} tone="accent" />
        <StatCard label="Total Service Cost" value={formatINR(totalCost)} icon={IndianRupee} tone="amber" />
        <StatCard label="Avg. Cost / Service" value={formatINR(avgCost)} icon={Wrench} tone="navy" />
        <StatCard label="Overdue Services" value={overdueCount} icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Service Cost Trend" subtitle="Total service spend by month">
          <ServiceCostTrendChart data={costTrend} />
        </Card>
        <Card title="Priority Breakdown" subtitle="Services by urgency">
          <PriorityBreakdownChart data={priorityData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Vehicle Service History" subtitle="Number of services logged per vehicle">
          <ServiceHistoryChart data={historyByVehicle} />
        </Card>

        <Card title="Upcoming Service" subtitle="Next scheduled and overdue work" action={<CalendarClock className="h-4 w-4 text-ink-400" />}>
          {upcomingSorted.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-400">No upcoming services for this filter</p>
          ) : (
            <ul className="space-y-3">
              {upcomingSorted.slice(0, 5).map((m) => (
                <li key={m.id} className="rounded-xl border border-surface-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{vehicleNameMap[m.vehicle] || m.vehicle}</p>
                      <p className="text-xs text-ink-500">{m.type} · {m.date}</p>
                    </div>
                    <PriorityBadge priority={m.priority} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Maintenance Log" subtitle={`${filtered.length} record${filtered.length === 1 ? '' : 's'} matching current filters`}>
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  )
}
