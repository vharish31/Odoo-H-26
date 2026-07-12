import React, { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { CARGO_TYPES } from '../../data/tripManagementData.js'

const EMPTY_FORM = {
  vehicle: '',
  driver: '',
  origin: '',
  destination: '',
  distance: '',
  cargo: CARGO_TYPES[0],
}

/**
 * TripFormModal — Create Trip form.
 * `vehicleOptions` / `driverOptions` are [{ value, label }] pairs.
 */
export default function TripFormModal({ open, onClose, onSubmit, vehicleOptions = [], driverOptions = [] }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setErrors({})
    setForm(EMPTY_FORM)
  }, [open])

  const update = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((err) => ({ ...err, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.vehicle) next.vehicle = 'Select a vehicle'
    if (!form.driver) next.driver = 'Select a driver'
    if (!form.origin.trim()) next.origin = 'Origin is required'
    if (!form.destination.trim()) next.destination = 'Destination is required'
    if (!form.distance || Number(form.distance) <= 0) next.distance = 'Enter a valid distance'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      distance: Number(form.distance),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Trip"
      description="Dispatch a new trip and assign a vehicle and driver."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="trip-form">
            Create Trip
          </Button>
        </>
      }
    >
      <form id="trip-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Vehicle"
          value={form.vehicle}
          onChange={update('vehicle')}
          options={[{ value: '', label: 'Select vehicle' }, ...vehicleOptions]}
          error={errors.vehicle}
        />
        <SelectField
          label="Driver"
          value={form.driver}
          onChange={update('driver')}
          options={[{ value: '', label: 'Select driver' }, ...driverOptions]}
          error={errors.driver}
        />
        <Field
          label="Origin"
          placeholder="e.g. Chennai"
          value={form.origin}
          onChange={update('origin')}
          error={errors.origin}
        />
        <Field
          label="Destination"
          placeholder="e.g. Bengaluru"
          value={form.destination}
          onChange={update('destination')}
          error={errors.destination}
        />
        <Field
          label="Distance (km)"
          type="number"
          min="1"
          placeholder="e.g. 346"
          value={form.distance}
          onChange={update('distance')}
          error={errors.distance}
        />
        <SelectField
          label="Cargo"
          value={form.cargo}
          onChange={update('cargo')}
          options={CARGO_TYPES.map((c) => ({ value: c, label: c }))}
        />
      </form>
    </Modal>
  )
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
