import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Receipt,
  FileBarChart2,
  Navigation,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/vehicles', label: 'Vehicles', icon: Truck },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/trips', label: 'Trips', icon: Route },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 },
]

export default function Sidebar({ open = true, onNavigate }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-900 shadow-nav transition-transform duration-200
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500">
          <Navigation className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-bold tracking-tight text-white">
          Transit<span className="text-accent-400">Ops</span>
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-none px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-navy-600">
          Fleet Operations
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-navy-800 text-white'
                  : 'text-slate-400 hover:bg-navy-800/60 hover:text-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent-500" />
                )}
                <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / plan info */}
      <div className="border-t border-navy-800 p-4">
        <div className="rounded-xl bg-navy-850 border border-navy-700 p-3.5">
          <p className="text-xs font-semibold text-white">Enterprise Plan</p>
          <p className="mt-0.5 text-[11px] text-slate-400">32 / 50 vehicles tracked</p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-navy-700">
            <div className="h-full w-[64%] rounded-full bg-accent-500" />
          </div>
        </div>
      </div>
    </aside>
  )
}
