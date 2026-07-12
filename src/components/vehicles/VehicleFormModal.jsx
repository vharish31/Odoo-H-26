import React, { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { VEHICLE_TYPES, VEHICLE_STATUSES } from '../../data/vehicleManagementData.js'

const EMPTY_FORM = {
  vehicleNumber: '',
  model: '',
  type: VEHICLE_TYPES[0],
  capacity: '',
  insurance: '',
  registrationDate: '',
  status: 'available',
  mileage: '',
}

/**
 * VehicleFormModal — reusable Add/Edit form.
 * Pass `vehicle` to edit; omit (or null) to add a new vehicle.
 */
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
            model: vehicle.model ?? '',
            type: vehicle.type ?? VEHICLE_TYPES[0],
            capacity: vehicle.capacity ?? '',
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
    if (!form.model.trim()) next.model = 'Model is required'
    if (!form.capacity || Number(form.capacity) <= 0) next.capacity = 'Enter a valid capacity'
    if (!form.insurance.trim()) next.insurance = 'Insurance details are required'
    if (!form.registrationDate) next.registrationDate = 'Registration date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      capacity: Number(form.capacity),
      mileage: Number(form.mileage) || 0,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
      description={
        isEdit
          ? 'Update the details for this vehicle.'
          : 'Register a new vehicle to your fleet.'
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="vehicle-form">
            {isEdit ? 'Save Changes' : 'Save Vehicle'}
          </Button>
        </>
      }
    >
      <form id="vehicle-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Vehicle Number"
          placeholder="e.g. TN 09 AB 4521"
          value={form.vehicleNumber}
          onChange={update('vehicleNumber')}
          error={errors.vehicleNumber}
        />
        <Field
          label="Model"
          placeholder="e.g. Volvo FH16"
          value={form.model}
          onChange={update('model')}
          error={errors.model}
        />
        <SelectField
          label="Type"
          value={form.type}
          onChange={update('type')}
          options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))}
        />
        <Field
          label="Capacity"
          type="number"
          min="1"
          placeholder="Seats / units"
          value={form.capacity}
          onChange={update('capacity')}
          error={errors.capacity}
        />
        <Field
          label="Insurance"
          placeholder="e.g. HDFC Ergo · Exp 2027-06-01"
          value={form.insurance}
          onChange={update('insurance')}
          error={errors.insurance}
          className="sm:col-span-2"
        />
        <Field
          label="Registration Date"
          type="date"
          value={form.registrationDate}
          onChange={update('registrationDate')}
          error={errors.registrationDate}
        />
        <SelectField
          label="Status"
          value={form.status}
          onChange={update('status')}
          options={VEHICLE_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))}
        />
      </form>
    </Modal>
  )
}

function formatStatus(status) {
  return status
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

function Field({ label, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-ink-700">{label}</span>
      <input
        {...props}
        className={`h-9 w-full rounded-lg border bg-surface px-3 text-sm placeholder:text-ink-400 focus:bg-white focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-surface-border focus:border-accent-400 focus:ring-accent-100'
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
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
            : 'border-surface-border focus:border-accent-400 focus:ring-accent-100'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </label>
  )
}
