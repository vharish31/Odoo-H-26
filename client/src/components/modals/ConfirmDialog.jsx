import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal.jsx'
import Button from '../common/Button.jsx'

/**
 * ConfirmDialog — reusable confirmation modal for destructive/blocking actions.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
        </div>
        <p className="pt-1.5 text-sm text-ink-500">{description}</p>
      </div>
    </Modal>
  )
}
