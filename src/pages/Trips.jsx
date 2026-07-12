import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SearchInput from '../components/vehicles/SearchInput.jsx'
import FilterSelect from '../components/vehicles/FilterSelect.jsx'
import Pagination from '../components/vehicles/Pagination.jsx'
import ConfirmDialog from '../components/vehicles/ConfirmDialog.jsx'
import TripTable from '../components/trips/TripTable.jsx'
import TripFormModal from '../components/trips/TripFormModal.jsx'
import TripDetailsModal from '../components/trips/TripDetailsModal.jsx'
import TripHistoryLog from '../components/trips/TripHistoryLog.jsx'
import { trips as initialTrips, TRIP_STATUSES, TRIP_STATUS_LABELS } from '../data/tripManagementData.js'
import { vehicles as allVehicles } from '../data/vehicleManagementData.js'
import { drivers as allDrivers } from '../data/driverManagementData.js'

const PAGE_SIZE = 6

let nextIdCounter = initialTrips.length + 1

function nowStamp() {
  const d = new Date()
  const date = d.toLocaleDateString('en-CA') // YYYY-MM-DD
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
}

export default function Trips() {
  const [trips, setTrips] = useState(initialTrips)

  // Search / filter / pagination state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  // Modal state
  const [formOpen, setFormOpen] = useState(false)
  const [viewingTrip, setViewingTrip] = useState(null)
  const [deletingTrip, setDeletingTrip] = useState(null)

  const vehicleById = useMemo(() => Object.fromEntries(allVehicles.map((v) => [v.id, v])), [])
  const driverById = useMemo(() => Object.fromEntries(allDrivers.map((d) => [d.id, d])), [])

  const resolveVehicle = (id) => vehicleById[id]?.vehicleNumber || id || '—'
  const resolveDriver = (id) => driverById[id]?.name || id || '—'

  const vehicleOptions = useMemo(
    () => allVehicles.map((v) => ({ value: v.id, label: `${v.vehicleNumber} · ${v.model}` })),
    []
  )
  const driverOptions = useMemo(
    () => allDrivers.map((d) => ({ value: d.id, label: d.name })),
    []
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return trips.filter((t) => {
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        resolveVehicle(t.vehicle).toLowerCase().includes(q) ||
        resolveDriver(t.driver).toLowerCase().includes(q)
      const matchesStatus = !statusFilter || t.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [trips, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateFilters = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const handleCreateTrip = (values) => {
    const id = `TR-${8900 + nextIdCounter++}`
    const trip = {
      id,
      ...values,
      status: 'created',
      timeline: [{ status: 'created', at: nowStamp() }],
    }
    setTrips((prev) => [trip, ...prev])
    setFormOpen(false)
    setPage(1)
  }

  const handleAdvance = (trip) => {
    const idx = TRIP_STATUSES.indexOf(trip.status)
    const next = TRIP_STATUSES[idx + 1]
    if (!next) return
    setTrips((prev) =>
      prev.map((t) =>
        t.id === trip.id
          ? { ...t, status: next, timeline: [...t.timeline, { status: next, at: nowStamp() }] }
          : t
      )
    )
  }

  const handleDeleteConfirm = () => {
    setTrips((prev) => prev.filter((t) => t.id !== deletingTrip.id))
    setDeletingTrip(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Trip Management</h1>
          <p className="text-sm text-ink-500">Track every trip from dispatch to delivery.</p>
        </div>
        <Button icon={Plus} onClick={() => setFormOpen(true)}>
          Create Trip
        </Button>
      </div>

      <Card padded={false}>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={updateFilters(setSearch)}
            placeholder="Search by trip ID, route, vehicle or driver..."
            className="sm:w-80"
          />
          <FilterSelect
            label="All Statuses"
            value={statusFilter}
            onChange={updateFilters(setStatusFilter)}
            options={TRIP_STATUSES.map((s) => ({ value: s, label: TRIP_STATUS_LABELS[s] }))}
            className="sm:w-44"
          />
        </div>

        <TripTable
          data={paged}
          resolveVehicle={resolveVehicle}
          resolveDriver={resolveDriver}
          onView={setViewingTrip}
          onAdvance={handleAdvance}
          onDelete={setDeletingTrip}
        />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>

      <TripHistoryLog trips={trips} resolveVehicle={resolveVehicle} resolveDriver={resolveDriver} />

      <TripFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateTrip}
        vehicleOptions={vehicleOptions}
        driverOptions={driverOptions}
      />

      <TripDetailsModal
        open={Boolean(viewingTrip)}
        trip={viewingTrip}
        resolveVehicle={resolveVehicle}
        resolveDriver={resolveDriver}
        onClose={() => setViewingTrip(null)}
        onAdvance={handleAdvance}
      />

      <ConfirmDialog
        open={Boolean(deletingTrip)}
        onClose={() => setDeletingTrip(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Trip"
        description={
          deletingTrip
            ? `Remove trip ${deletingTrip.id} (${deletingTrip.origin} → ${deletingTrip.destination})? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  )
}
