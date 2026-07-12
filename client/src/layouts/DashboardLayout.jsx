import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { ToastProvider } from '../components/common/Toast.jsx'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Navbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
      </div>
    </ToastProvider>
  )
}
