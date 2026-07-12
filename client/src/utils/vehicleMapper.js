import { VEHICLE_STATUSES } from '../constants/vehicleManagementData.js'

const STATUS_TO_API = {
  available: 'Available',
  'on-trip': 'On Trip',
  maintenance: 'In Shop',
  retired: 'Retired',
}

const STATUS_FROM_API = Object.fromEntries(
  Object.entries(STATUS_TO_API).map(([k, v]) => [v, k])
)

export function uiVehicleToApi(form) {
  const [manufacturer = '', ...modelParts] = (form.model || '').trim().split(' ')
  return {
    registrationNumber: form.vehicleNumber?.trim(),
    vehicleType: form.type,
    manufacturer: form.manufacturer || manufacturer || 'Unknown',
    model: form.modelName || modelParts.join(' ') || form.model || 'Unknown',
    year: Number(form.year) || new Date(form.registrationDate || Date.now()).getFullYear(),
    capacity: Number(form.capacity),
    fuelType: form.fuelType || 'Diesel',
    status: STATUS_TO_API[form.status] || form.status || 'Available',
  }
}

export function apiVehicleToUi(v) {
  return {
    id: v.id,
    vehicleNumber: v.registrationNumber || v.vehicleNumber,
    manufacturer: v.manufacturer,
    modelName: v.model,
    model: v.manufacturer ? `${v.manufacturer} ${v.model}` : v.model,
    type: v.vehicleType || v.type,
    capacity: v.capacity ?? 0,
    fuelType: v.fuelType || 'Diesel',
    year: v.year,
    mileage: v.mileage ?? 0,
    status: STATUS_FROM_API[v.status] || v.status || VEHICLE_STATUSES[0],
    insurance: v.insurance || '—',
    registrationDate: v.registrationDate || '',
  }
}
