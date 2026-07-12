import React, { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import Button from '../common/Button.jsx'
import { VEHICLE_TYPES, VEHICLE_STATUSES, FUEL_TYPES } from '../../constants/vehicleManagementData.js'

const EMPTY_FORM = {
  vehicleNumber: '',
  manufacturer: '',
  modelName: '',
  type: VEHICLE_TYPES[0],
  capacity: '',
  fuelType: FUEL_TYPES[0],
  year: new Date().getFullYear(),
  insurance: '',
  registrationDate: '',
  status: 'available',
  mileage: '',
}

export default function VehicleFormModal({ open, onClose, onSubmit, vehicle }) {
  const isEdit = Boolean(vehicle)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setErrors({})
    setForm(
      vehicle
        ? {
            vehicleNumber: vehicle.vehicleNumber ?? '',
            manufacturer: vehicle.manufacturer ?? '',
            modelName: vehicle.modelName ?? vehicle.model?.split(' ').slice(1).join(' ') ?? '',
            type: vehicle.type ?? VEHICLE_TYPES[0],
            capacity: vehicle.capacity ?? '',
            fuelType: vehicle.fuelType ?? FUEL_TYPES[0],
            year: vehicle.year ?? new Date().getFullYear(),
            insurance: vehicle.insurance ?? '',
            registrationDate: vehicle.registrationDate ?? '',
            status: vehicle.status ?? 'available',
            mileage: vehicle.mileage ?? '',
          }
        : EMPTY_FORM
    )
  }, [open, vehicle])

  const update = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.vehicleNumber.trim()) next.vehicleNumber = 'Vehicle number is required'
    if (!form.manufacturer.trim()) next.manufacturer = 'Manufacturer is required'
    if (!form.modelName.trim()) next.modelName = 'Model is required'
    if (!form.capacity || Number(form.capacity) <= 0) next.capacity = 'Enter a valid capacity'
    if (!form.year || Number(form.year) < 1900) next.year = 'Enter a valid year'
    if (!form.fuelType.trim()) next.fuelType = 'Fuel type is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      model: `${form.manufacturer} ${form.modelName}`.trim(),
      capacity: Number(form.capacity),
      year: Number(form.year),
      mileage: Number(form.mileage) || 0,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
      description={isEdit ? 'Update the details for this vehicle.' : 'Register a new vehicle to your fleet.'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="vehicle-form">
            {isEdit ? 'Save Changes' : 'Save Vehicle'}
          </Button>
        </>
      }
    >
      <form id="vehicle-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Registration Number" placeholder="e.g. TN 09 AB 4521" value={form.vehicleNumber} onChange={update('vehicleNumber')} error={errors.vehicleNumber} />
        <Field label="Manufacturer" placeholder="e.g. Tata" value={form.manufacturer} onChange={update('manufacturer')} error={errors.manufacturer} />
        <Field label="Model" placeholder="e.g. Starbus" value={form.modelName} onChange={update('modelName')} error={errors.modelName} />
        <SelectField label="Type" value={form.type} onChange={update('type')} options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))} />
        <Field label="Year" type="number" min="1900" value={form.year} onChange={update('year')} error={errors.year} />
        <Field label="Capacity" type="number" min="1" placeholder="Seats / units" value={form.capacity} onChange={update('capacity')} error={errors.capacity} />
        <SelectField label="Fuel Type" value={form.fuelType} onChange={update('fuelType')} options={FUEL_TYPES.map((t) => ({ value: t, label: t }))} />
        <Field label="Mileage (km)" type="number" min="0" value={form.mileage} onChange={update('mileage')} />
        <Field label="Insurance" placeholder="e.g. HDFC Ergo · Exp 2027-06-01" value={form.insurance} onChange={update('insurance')} className="sm:col-span-2" />
        <Field label="Registration Date" type="date" value={form.registrationDate} onChange={update('registrationDate')} />
        <SelectField label="Status" value={form.status} onChange={update('status')} options={VEHICLE_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))} />
      </form>
    </Modal>
  )
}

function formatStatus(status) {
  return status.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}

function Field({ label, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-ink-700">{label}</span>
      <input
        {...props}
        className={`h-9 w-full rounded-lg border bg-surface px-3 text-sm placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-2 ${
          error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : 'border-surface-border focus:border-accent-400 focus:ring-accent-100'
        }`}
      />
      {error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </label>
  )
}

function SelectField({ label, error, className = '', options, ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-ink-700">{label}</span>
      <select
        {...props}
        className={`h-9 w-full rounded-lg border bg-surface px-3 text-sm focus:bg-white focus:outline-none focus:ring-2 ${
          error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : 'border-surface-border focus:border-accent-400 focus:ring-accent-100'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </label>
  )
}
