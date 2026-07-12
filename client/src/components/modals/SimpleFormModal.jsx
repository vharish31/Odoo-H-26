import React, { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import Button from '../common/Button.jsx'

export default function SimpleFormModal({
  open,
  onClose,
  onSubmit,
  title,
  description,
  fields,
  initialValues = {},
  submitLabel = 'Save',
}) {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    const next = {}
    fields.forEach((f) => {
      next[f.name] = initialValues[f.name] ?? f.defaultValue ?? ''
    })
    setForm(next)
    setErrors({})
  }, [open, initialValues, fields])

  const update = (name) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    fields.forEach((f) => {
      if (f.required && !String(form[f.name] ?? '').trim()) {
        next[f.name] = `${f.label} is required`
      }
    })
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit(form)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" form="simple-form">{submitLabel}</Button>
        </>
      }
    >
      <form id="simple-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.fullWidth ? 'sm:col-span-2' : ''}>
            <span className="mb-1.5 block text-xs font-medium text-ink-700">{field.label}</span>
            {field.type === 'select' ? (
              <select
                value={form[field.name] ?? ''}
                onChange={update(field.name)}
                className="h-9 w-full rounded-lg border border-surface-border bg-surface px-3 text-sm focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-100"
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={form[field.name] ?? ''}
                onChange={update(field.name)}
                placeholder={field.placeholder}
                className={`h-9 w-full rounded-lg border bg-surface px-3 text-sm focus:outline-none focus:ring-2 ${
                  errors[field.name]
                    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                    : 'border-surface-border focus:border-accent-400 focus:ring-accent-100'
                }`}
              />
            )}
            {errors[field.name] && <span className="mt-1 block text-[11px] text-rose-600">{errors[field.name]}</span>}
          </label>
        ))}
      </form>
    </Modal>
  )
}
