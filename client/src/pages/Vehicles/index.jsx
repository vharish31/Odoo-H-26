import React, { useState, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import { useToast } from '../../components/common/Toast.jsx'
import { vehicleAPI } from '../../services/api.js'
import { apiVehicleToUi, uiVehicleToApi } from '../../utils/vehicleMapper.js'
import SearchInput from '../../components/tables/SearchInput.jsx'
import FilterSelect from '../../components/tables/FilterSelect.jsx'
import Pagination from '../../components/tables/Pagination.jsx'
import VehicleTable from '../../components/tables/VehicleTable.jsx'
import VehicleFormModal from '../../components/modals/VehicleFormModal.jsx'
import VehicleDetailsModal from '../../components/modals/VehicleDetailsModal.jsx'
import ConfirmDialog from '../../components/modals/ConfirmDialog.jsx'
import {
  vehicles as initialVehicles,
  VEHICLE_TYPES,
  VEHICLE_STATUSES,
} from '../../constants/vehicleManagementData.js'

const PAGE_SIZE = 6
let nextIdCounter = initialVehicles.length + 1

export default function Vehicles() {
  const { showToast } = useToast()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [viewingVehicle, setViewingVehicle] = useState(null)
  const [deletingVehicle, setDeletingVehicle] = useState(null)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await vehicleAPI.getAll()
      const apiVehicles = response.data.data.vehicles || []
      const transformed = apiVehicles.map(apiVehicleToUi)
      setVehicles(transformed.length > 0 ? transformed : initialVehicles)
    } catch {
      setVehicles(initialVehicles)
      showToast('Showing demo data — log in as Fleet Manager for live API sync', 'info')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return vehicles.filter((v) => {
      const matchesSearch =
        !q ||
        v.vehicleNumber?.toLowerCase().includes(q) ||
        v.model?.toLowerCase().includes(q) ||
        String(v.id).toLowerCase().includes(q)
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

  const saveLocally = (values, isEdit) => {
    if (isEdit) {
      setVehicles((prev) => prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...values } : v)))
      showToast('Vehicle updated locally', 'success')
    } else {
      const id = `VH-${1000 + nextIdCounter++}`
      setVehicles((prev) => [{ id, ...values }, ...prev])
      setPage(1)
      showToast('Vehicle added locally', 'success')
    }
  }

  const handleFormSubmit = async (values) => {
    const payload = uiVehicleToApi(values)

    try {
      if (editingVehicle) {
        await vehicleAPI.update(editingVehicle.id, payload)
        setVehicles((prev) =>
          prev.map((v) => (v.id === editingVehicle.id ? { ...v, ...values } : v))
        )
        showToast('Vehicle updated successfully', 'success')
      } else {
        const response = await vehicleAPI.create(payload)
        setVehicles((prev) => [apiVehicleToUi(response.data.data.vehicle), ...prev])
        setPage(1)
        showToast('Vehicle created successfully', 'success')
      }
    } catch {
      saveLocally(values, Boolean(editingVehicle))
    }

    setFormOpen(false)
    setEditingVehicle(null)
  }

  const handleDeleteConfirm = async () => {
    const target = deletingVehicle
    try {
      await vehicleAPI.delete(target.id)
      setVehicles((prev) => prev.filter((v) => v.id !== target.id))
      showToast('Vehicle deleted successfully', 'success')
    } catch {
      setVehicles((prev) => prev.filter((v) => v.id !== target.id))
      showToast('Vehicle removed locally', 'success')
    }
    setDeletingVehicle(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-ink-500">Loading vehicles...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink-900">Vehicle Management</h1>
          <p className="text-sm text-ink-500">{vehicles.length} vehicles registered in your fleet.</p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>Add Vehicle</Button>
      </div>

      <Card padded={false}>
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <SearchInput value={search} onChange={updateFilters(setSearch)} placeholder="Search by vehicle number, model or ID..." className="sm:w-80" />
          <FilterSelect label="All Types" value={typeFilter} onChange={updateFilters(setTypeFilter)} options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))} className="sm:w-44" />
          <FilterSelect label="All Statuses" value={statusFilter} onChange={updateFilters(setStatusFilter)} options={VEHICLE_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))} className="sm:w-44" />
        </div>

        <VehicleTable data={paged} onView={setViewingVehicle} onEdit={openEditModal} onDelete={setDeletingVehicle} />

        <Pagination page={currentPage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Card>

      <VehicleFormModal open={formOpen} vehicle={editingVehicle} onClose={() => { setFormOpen(false); setEditingVehicle(null) }} onSubmit={handleFormSubmit} />
      <VehicleDetailsModal open={Boolean(viewingVehicle)} vehicle={viewingVehicle} onClose={() => setViewingVehicle(null)} />
      <ConfirmDialog
        open={Boolean(deletingVehicle)}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        description={deletingVehicle ? `Remove ${deletingVehicle.vehicleNumber} (${deletingVehicle.model}) from the fleet? This cannot be undone.` : ''}
        confirmLabel="Delete"
      />
    </div>
  )
}

function formatStatus(status) {
  return status.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}
