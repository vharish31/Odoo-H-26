import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SearchInput from '../components/vehicles/SearchInput.jsx'
import FilterSelect from '../components/vehicles/FilterSelect.jsx'
import Pagination from '../components/vehicles/Pagination.jsx'
import VehicleTable from '../components/vehicles/VehicleTable.jsx'
import VehicleFormModal from '../components/vehicles/VehicleFormModal.jsx'
import VehicleDetailsModal from '../components/vehicles/VehicleDetailsModal.jsx'
import ConfirmDialog from '../components/vehicles/ConfirmDialog.jsx'
import {
  vehicles as initialVehicles,
  VEHICLE_TYPES,
  VEHICLE_STATUSES,
} from '../data/vehicleManagementData.js'

const PAGE_SIZE = 6

let nextIdCounter = initialVehicles.length + 1

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles)

  // Search / filter / pagination state
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  // Modal state
  const [formOpen, setFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [viewingVehicle, setViewingVehicle] = useState(null)
  const [deletingVehicle, setDeletingVehicle] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return vehicles.filter((v) => {
      const matchesSearch =
        !q ||
        v.vehicleNumber.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q)
      const matchesType = !typeFilter || v.type === typeFilter
      const matchesStatus = !statusFilter || v.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [vehicles, search, typeFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateFilters = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const openAddModal = () => {
    setEditingVehicle(null)
    setFormOpen(true)
  }

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle)
    setFormOpen(true)
  }

  const handleFormSubmit = (values) => {
    if (editingVehicle) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...values } : v))
      )
    } else {
      const id = `VH-${1000 + nextIdCounter++}`
      setVehicles((prev) => [{ id, ...values }, ...prev])
      setPage(1)
    }
    setFormOpen(false)
    setEditingVehicle(null)
  }

  const handleDeleteConfirm = () => {
    setVehicles((prev) => prev.filter((v) => v.id !== deletingVehicle.id))
    setDeletingVehicle(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Vehicle Management</h1>
          <p className="text-sm text-ink-500">
            {vehicles.length} vehicles registered in your fleet.
          </p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>
          Add Vehicle
        </Button>
      </div>

      <Card padded={false}>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={updateFilters(setSearch)}
            placeholder="Search by vehicle number, model or ID..."
            className="sm:w-80"
          />
          <FilterSelect
            label="All Types"
            value={typeFilter}
            onChange={updateFilters(setTypeFilter)}
            options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))}
            className="sm:w-44"
          />
          <FilterSelect
            label="All Statuses"
            value={statusFilter}
            onChange={updateFilters(setStatusFilter)}
            options={VEHICLE_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))}
            className="sm:w-44"
          />
        </div>

        <VehicleTable
          data={paged}
          onView={setViewingVehicle}
          onEdit={openEditModal}
          onDelete={setDeletingVehicle}
        />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>

      <VehicleFormModal
        open={formOpen}
        vehicle={editingVehicle}
        onClose={() => {
          setFormOpen(false)
          setEditingVehicle(null)
        }}
        onSubmit={handleFormSubmit}
      />

      <VehicleDetailsModal
        open={Boolean(viewingVehicle)}
        vehicle={viewingVehicle}
        onClose={() => setViewingVehicle(null)}
      />

      <ConfirmDialog
        open={Boolean(deletingVehicle)}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        description={
          deletingVehicle
            ? `Remove ${deletingVehicle.vehicleNumber} (${deletingVehicle.model}) from the fleet? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
      />
    </div>
  )
}

function formatStatus(status) {
  return status
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}
