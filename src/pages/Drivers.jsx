import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SearchInput from '../components/vehicles/SearchInput.jsx'
import FilterSelect from '../components/vehicles/FilterSelect.jsx'
import Pagination from '../components/vehicles/Pagination.jsx'
import ConfirmDialog from '../components/vehicles/ConfirmDialog.jsx'
import DriverTable from '../components/drivers/DriverTable.jsx'
import DriverFormModal from '../components/drivers/DriverFormModal.jsx'
import DriverDetailsModal from '../components/drivers/DriverDetailsModal.jsx'
import { drivers as initialDrivers, DRIVER_STATUSES } from '../data/driverManagementData.js'
import { vehicles as allVehicles } from '../data/vehicleManagementData.js'

const PAGE_SIZE = 6

let nextIdCounter = initialDrivers.length + 1

export default function Drivers() {
  const [drivers, setDrivers] = useState(initialDrivers)

  // Search / filter / pagination state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  // Modal state
  const [formOpen, setFormOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [viewingDriver, setViewingDriver] = useState(null)
  const [deletingDriver, setDeletingDriver] = useState(null)

  const vehicleOptions = useMemo(() => allVehicles.map((v) => v.vehicleNumber), [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return drivers.filter((d) => {
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.license.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || d.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [drivers, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const updateFilters = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const openAddModal = () => {
    setEditingDriver(null)
    setFormOpen(true)
  }

  const openEditModal = (driver) => {
    setEditingDriver(driver)
    setFormOpen(true)
  }

  const handleFormSubmit = (values) => {
    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === editingDriver.id ? { ...d, ...values } : d))
      )
    } else {
      const id = `DR-${200 + nextIdCounter++}`
      setDrivers((prev) => [{ id, ...values }, ...prev])
      setPage(1)
    }
    setFormOpen(false)
    setEditingDriver(null)
  }

  const handleDeleteConfirm = () => {
    setDrivers((prev) => prev.filter((d) => d.id !== deletingDriver.id))
    setDeletingDriver(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Driver Management</h1>
          <p className="text-sm text-ink-500">{drivers.length} drivers on your roster.</p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>
          Add Driver
        </Button>
      </div>

      <Card padded={false}>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <SearchInput
            value={search}
            onChange={updateFilters(setSearch)}
            placeholder="Search by name, license or phone..."
            className="sm:w-80"
          />
          <FilterSelect
            label="All Statuses"
            value={statusFilter}
            onChange={updateFilters(setStatusFilter)}
            options={DRIVER_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))}
            className="sm:w-44"
          />
        </div>

        <DriverTable
          data={paged}
          onView={setViewingDriver}
          onEdit={openEditModal}
          onDelete={setDeletingDriver}
        />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </Card>

      <DriverFormModal
        open={formOpen}
        driver={editingDriver}
        vehicleOptions={vehicleOptions}
        onClose={() => {
          setFormOpen(false)
          setEditingDriver(null)
        }}
        onSubmit={handleFormSubmit}
      />

      <DriverDetailsModal
        open={Boolean(viewingDriver)}
        driver={viewingDriver}
        onClose={() => setViewingDriver(null)}
      />

      <ConfirmDialog
        open={Boolean(deletingDriver)}
        onClose={() => setDeletingDriver(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        description={
          deletingDriver
            ? `Remove ${deletingDriver.name} (${deletingDriver.id}) from your roster? This cannot be undone.`
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
