import React from 'react'
import { Download, FileBarChart2, Fuel, Wrench, Route } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import { useToast } from '../../components/common/Toast.jsx'
import { downloadJson } from '../../utils/exportData.js'
import { dashboardKpis, trips, expenses, maintenance } from '../../constants/dummyData.js'

const REPORTS = [
  {
    title: 'Fleet Utilization Report',
    desc: 'Vehicle uptime, idle time, and route efficiency across the fleet.',
    icon: Route,
    updated: 'Updated 2 hours ago',
    dataKey: 'utilization',
  },
  {
    title: 'Fuel & Cost Analysis',
    desc: 'Fuel consumption trends and cost-per-kilometer breakdown.',
    icon: Fuel,
    updated: 'Updated today',
    dataKey: 'fuel',
  },
  {
    title: 'Maintenance Summary',
    desc: 'Service history, upcoming due dates, and workshop spend.',
    icon: Wrench,
    updated: 'Updated yesterday',
    dataKey: 'maintenance',
  },
  {
    title: 'Monthly Operations Report',
    desc: 'Full operational summary for stakeholders and finance.',
    icon: FileBarChart2,
    updated: 'Updated 3 days ago',
    dataKey: 'operations',
  },
]

const REPORT_DATA = {
  utilization: { kpis: dashboardKpis, trips },
  fuel: { expenses: expenses.filter((e) => e.category === 'Fuel') },
  maintenance: { maintenance },
  operations: { kpis: dashboardKpis, trips, expenses, maintenance },
}

export default function Reports() {
  const { showToast } = useToast()

  const handleExport = (report) => {
    const slug = report.title.toLowerCase().replace(/\s+/g, '-')
    downloadJson(`transitops-${slug}.json`, {
      report: report.title,
      generatedAt: new Date().toISOString(),
      data: REPORT_DATA[report.dataKey],
    })
    showToast(`${report.title} exported`, 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink-900">Reports</h1>
        <p className="text-sm text-ink-500">Generate and export insights across your fleet operations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {REPORTS.map((r) => (
          <Card key={r.title}>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900">
                <r.icon className="h-5 w-5 text-accent-400" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-ink-900">{r.title}</h3>
                <p className="mt-1 text-xs text-ink-500">{r.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-ink-400">{r.updated}</span>
                  <Button variant="outline" size="sm" icon={Download} onClick={() => handleExport(r)}>
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
