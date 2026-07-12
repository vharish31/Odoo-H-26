import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard/index.jsx'
import Vehicles from './pages/Vehicles/index.jsx'
import Drivers from './pages/Drivers/index.jsx'
import Trips from './pages/Trips/index.jsx'
import Maintenance from './pages/Maintenance/index.jsx'
import Expenses from './pages/Expenses/index.jsx'
import Reports from './pages/Reports/index.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}
