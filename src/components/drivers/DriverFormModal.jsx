import React, { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import DriverAvatar from './DriverAvatar.jsx'
import { DRIVER_STATUSES } from '../../data/driverManagementData.js'

const EMPTY_FORM = {
  name: '',
  photo: '',
  license: '',
  phone: '',
  rating: '',
  vehicle: '',
  status: 'available',
}

/**
 * DriverFormModal — reusable Add/Edit form.
 * Pass `driver` to edit; omit (or null) to add a new driver.
 * `vehicleOptions` is the list of assignable vehicle numbers.
 */
export default function DriverFormModal({ open, onClose, onSubmit, driver, vehicleOptions = [] }) {
  const isEdit = Boolean(driver)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setErrors({})
    setForm(
      driver
        ? {
            name: driver.name ?? '',
            photo: driver.photo ?? '',
            license: driver.license ?? '',
            phone: driver.phone ?? '',
            rating: driver.rating ?? '',
            vehicle: driver.vehicle ?? '',
            status: driver.status ?? 'available',
          }
        : EMPTY_FORM
    )
  }, [open, driver])

  const update = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.license.trim()) next.license = 'License number is required'
    if (!form.phone.trim()) next.phone = 'Phone number is required'
    if (form.rating === '' || Number(form.rating) < 0 || Number(form.rating) > 5)
      next.rating = 'Enter a rating between 0 and 5'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      rating: Number(form.rating),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Driver' : 'Add New Driver'}
      description={
        isEdit ? 'Update the details for this driver.' : 'Add a new driver to your roster.'
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="driver-form">
            {isEdit ? 'Save Changes' : 'Save Driver'}
          </Button>
        </>
      }
    >
      <form id="driver-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <DriverAvatar name={form.name || 'New Driver'} photo={form.photo} size="lg" />
          <div className="flex-1">
            <Field
              label="Photo URL"
              placeholder="https://... (optional)"
              value={form.photo}
              onChange={update('photo')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            placeholder="e.g. Arun Kumar"
            value={form.name}
            onChange={update('name')}
            error={errors.name}
          />
          <Field
            label="License Number"
            placeholder="e.g. TN0120230004521"
            value={form.license}
            onChange={update('license')}
            error={errors.license}
          />
          <Field
            label="Phone"
            placeholder="e.g. +91 98765 43210"
            value={form.phone}
            onChange={update('phone')}
            error={errors.phone}
          />
          <Field
            label="Rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="0.0 – 5.0"
            value={form.rating}
            onChange={update('rating')}
            error={errors.rating}
          />
          <SelectField
            label="Assigned Vehicle"
            value={form.vehicle}
            onChange={update('vehicle')}
            options={[
              { value: '', label: 'Unassigned' },
              ...vehicleOptions.map((v) => ({ value: v, label: v })),
            ]}
          />
          <SelectField
            label="Status"
            value={form.status}
            onChange={update('status')}
            options={DRIVER_STATUSES.map((s) => ({ value: s, label: formatStatus(s) }))}
          />
        </div>
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
