// Analytics data + helpers for the Maintenance, Expenses, and Reports modules.
// Deterministic pseudo-random generation keeps mock history stable across reloads.
// Replace with real API calls when the backend is wired up.

// ---------------------------------------------------------------------------
// Seeded RNG (mulberry32) — deterministic so charts don't jitter on re-render.
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20260712)
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const between = (min, max) => Math.round(min + rand() * (max - min))

// ---------------------------------------------------------------------------
// Reference data
// ---------------------------------------------------------------------------
export const ANALYTICS_VEHICLES = [
  { id: 'VH-1042', name: 'Freightliner Cascadia', type: 'Truck' },
  { id: 'VH-1043', name: 'Volvo FH16', type: 'Truck' },
  { id: 'VH-1044', name: 'Tata Ace Gold', type: 'Van' },
  { id: 'VH-1045', name: 'Mahindra Bolero Pickup', type: 'Pickup' },
  { id: 'VH-1046', name: 'Ashok Leyland Dost', type: 'Van' },
  { id: 'VH-1047', name: 'BharatBenz 1617', type: 'Truck' },
  { id: 'VH-1048', name: 'Eicher Pro 2049', type: 'Truck' },
  { id: 'VH-1049', name: 'Force Traveller', type: 'Van' },
]

export const PRIORITIES = ['low', 'medium', 'high', 'critical']

export const PRIORITY_STYLES = {
  critical: { dot: '#E11D48', bg: 'bg-rose-50', text: 'text-rose-700', ring: 'ring-rose-600/20' },
  high: { dot: '#F97316', bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-600/20' },
  medium: { dot: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-600/20' },
  low: { dot: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-600/20' },
}

export const CHART_PALETTE = ['#0EA5E9', '#182B47', '#F59E0B', '#10B981', '#8B5CF6', '#F43F5E', '#3AB8F8', '#64748B']

const SERVICE_TYPES = ['Oil Change', 'Brake Service', 'Tyre Replacement', 'AC Repair', 'Engine Overhaul', 'Battery Replacement', 'General Inspection', 'Suspension Repair']
const WORKSHOPS = ['CityDrive Service Center', 'Highway Truck Care', 'BharatBenz Authorized Service', 'Volvo Service Point', 'Force Motors Service', 'FleetCare Garage']
const EXPENSE_CATEGORIES = ['Fuel', 'Toll', 'Maintenance', 'Driver Allowance', 'Fine', 'Insurance', 'Parking']
const PAID_VIA = ['Company Card', 'FASTag', 'Cash', 'UPI']

// Last 6 full months, chronological, ending with the current month (Jul 2026).
export const MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
const MONTH_NUM = { Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7 }
const DAYS_IN_MONTH = { Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30, Jul: 12 } // Jul truncated at "today"

function randomDateInMonth(month, year = 2026) {
  const day = between(1, DAYS_IN_MONTH[month])
  return `${year}-${String(MONTH_NUM[month]).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function monthLabel(dateStr) {
  const idx = Number(dateStr.slice(5, 7))
  return Object.keys(MONTH_NUM).find((k) => MONTH_NUM[k] === idx) || dateStr.slice(5, 7)
}

// ---------------------------------------------------------------------------
// Maintenance: service history, upcoming service, cost, priority
// ---------------------------------------------------------------------------
let mtCounter = 5510
export const maintenanceRecords = []

// Historical completed services (6 months, ~4-5 per vehicle)
ANALYTICS_VEHICLES.forEach((v) => {
  const count = between(4, 6)
  for (let i = 0; i < count; i++) {
    const month = pick(MONTHS)
    maintenanceRecords.push({
      id: `MT-${mtCounter++}`,
      vehicle: v.id,
      vehicleName: v.name,
      type: pick(SERVICE_TYPES),
      workshop: pick(WORKSHOPS),
      date: randomDateInMonth(month),
      cost: between(1800, 42000),
      status: 'completed',
      priority: pick(PRIORITIES),
    })
  }
})

// Current / upcoming services (not yet completed) — drives "Upcoming Service"
export const upcomingServiceRecords = [
  { id: 'MT-5501', vehicle: 'VH-1044', vehicleName: 'Tata Ace Gold', type: 'Brake Service', workshop: 'CityDrive Service Center', date: '2026-07-16', cost: 8400, status: 'in-progress', priority: 'high' },
  { id: 'MT-5502', vehicle: 'VH-1042', vehicleName: 'Freightliner Cascadia', type: 'Oil Change', workshop: 'Highway Truck Care', date: '2026-07-20', cost: 3200, status: 'scheduled', priority: 'low' },
  { id: 'MT-5503', vehicle: 'VH-1048', vehicleName: 'Eicher Pro 2049', type: 'Engine Overhaul', workshop: 'BharatBenz Authorized Service', date: '2026-06-28', cost: 68500, status: 'overdue', priority: 'critical' },
  { id: 'MT-5504', vehicle: 'VH-1046', vehicleName: 'Ashok Leyland Dost', type: 'Tyre Replacement', workshop: 'CityDrive Service Center', date: '2026-07-15', cost: 15200, status: 'scheduled', priority: 'medium' },
  { id: 'MT-5507', vehicle: 'VH-1047', vehicleName: 'BharatBenz 1617', type: 'Suspension Repair', workshop: 'FleetCare Garage', date: '2026-07-09', cost: 22400, status: 'overdue', priority: 'critical' },
  { id: 'MT-5508', vehicle: 'VH-1045', vehicleName: 'Mahindra Bolero Pickup', type: 'General Inspection', workshop: 'FleetCare Garage', date: '2026-07-22', cost: 1500, status: 'scheduled', priority: 'low' },
  { id: 'MT-5509', vehicle: 'VH-1049', vehicleName: 'Force Traveller', type: 'AC Repair', workshop: 'Force Motors Service', date: '2026-07-18', cost: 5600, status: 'scheduled', priority: 'medium' },
]

export const allMaintenance = [...maintenanceRecords, ...upcomingServiceRecords]

// ---------------------------------------------------------------------------
// Expenses: fuel logs, categories, monthly spending
// ---------------------------------------------------------------------------
let fuelCounter = 9001
export const fuelLogs = []

ANALYTICS_VEHICLES.forEach((v) => {
  const count = between(6, 9)
  for (let i = 0; i < count; i++) {
    const month = pick(MONTHS)
    const liters = between(35, 180)
    const pricePerLiter = between(94, 104)
    const distance = liters * between(3, 6) // implied km covered on this tank
    fuelLogs.push({
      id: `FL-${fuelCounter++}`,
      vehicle: v.id,
      vehicleName: v.name,
      date: randomDateInMonth(month),
      liters,
      cost: liters * pricePerLiter,
      distance,
      efficiency: +(distance / liters).toFixed(2),
    })
  }
})
fuelLogs.sort((a, b) => (a.date < b.date ? 1 : -1))

let exCounter = 3308
export const expenseRecords = [
  { id: 'EX-3301', category: 'Fuel', vehicle: 'VH-1042', amount: 18450, date: '2026-07-10', paidBy: 'Company Card', status: 'approved' },
  { id: 'EX-3302', category: 'Toll', vehicle: 'VH-1043', amount: 1240, date: '2026-07-10', paidBy: 'FASTag', status: 'approved' },
  { id: 'EX-3303', category: 'Maintenance', vehicle: 'VH-1044', amount: 32600, date: '2026-07-09', paidBy: 'Company Card', status: 'pending' },
  { id: 'EX-3304', category: 'Fuel', vehicle: 'VH-1047', amount: 21980, date: '2026-07-08', paidBy: 'Company Card', status: 'approved' },
  { id: 'EX-3305', category: 'Driver Allowance', vehicle: 'VH-1045', amount: 2500, date: '2026-07-08', paidBy: 'Cash', status: 'pending' },
  { id: 'EX-3306', category: 'Fine', vehicle: 'VH-1048', amount: 1500, date: '2026-07-05', paidBy: 'Company Card', status: 'rejected' },
  { id: 'EX-3307', category: 'Fuel', vehicle: 'VH-1049', amount: 9870, date: '2026-07-04', paidBy: 'Company Card', status: 'approved' },
]

MONTHS.forEach((month) => {
  const count = between(9, 13)
  for (let i = 0; i < count; i++) {
    const category = pick(EXPENSE_CATEGORIES)
    const vehicle = pick(ANALYTICS_VEHICLES)
    const amountByCat = {
      Fuel: between(6000, 24000),
      Toll: between(400, 2200),
      Maintenance: between(2000, 45000),
      'Driver Allowance': between(1200, 4000),
      Fine: between(500, 3500),
      Insurance: between(8000, 22000),
      Parking: between(150, 900),
    }
    expenseRecords.push({
      id: `EX-${exCounter++}`,
      category,
      vehicle: vehicle.id,
      vehicleName: vehicle.name,
      amount: amountByCat[category],
      date: randomDateInMonth(month),
      paidBy: pick(PAID_VIA),
      status: pick(['approved', 'approved', 'approved', 'pending', 'rejected']),
    })
  }
})
expenseRecords.sort((a, b) => (a.date < b.date ? 1 : -1))

// ---------------------------------------------------------------------------
// Trips: utilization + trip analytics (extends the live trips list with history)
// ---------------------------------------------------------------------------
let trCounter = 8847
export const tripLogs = []

MONTHS.forEach((month) => {
  ANALYTICS_VEHICLES.forEach((v) => {
    const tripsThisMonth = between(2, 7)
    for (let i = 0; i < tripsThisMonth; i++) {
      tripLogs.push({
        id: `TR-${trCounter++}`,
        vehicle: v.id,
        vehicleName: v.name,
        date: randomDateInMonth(month),
        distance: between(60, 520),
        durationHrs: +(between(15, 95) / 10).toFixed(1),
        status: pick(['completed', 'completed', 'completed', 'delayed', 'cancelled']),
      })
    }
  })
})
tripLogs.sort((a, b) => (a.date < b.date ? 1 : -1))

// ---------------------------------------------------------------------------
// Filter helpers — shared by Maintenance / Expenses / Reports pages
// ---------------------------------------------------------------------------
export function inRange(dateStr, start, end) {
  if (start && dateStr < start) return false
  if (end && dateStr > end) return false
  return true
}

export function applyFilters(records, { startDate, endDate, vehicle }, dateKey = 'date', vehicleKey = 'vehicle') {
  return records.filter((r) => {
    if (vehicle && r[vehicleKey] !== vehicle) return false
    if (!inRange(r[dateKey], startDate, endDate)) return false
    return true
  })
}

export function sumBy(records, key) {
  return records.reduce((sum, r) => sum + (Number(r[key]) || 0), 0)
}

export function groupSum(records, groupKey, valueKey) {
  const map = new Map()
  records.forEach((r) => {
    const k = r[groupKey]
    map.set(k, (map.get(k) || 0) + (Number(r[valueKey]) || 0))
  })
  return Array.from(map, ([name, value]) => ({ name, value }))
}

export function groupCount(records, groupKey) {
  const map = new Map()
  records.forEach((r) => {
    const k = r[groupKey]
    map.set(k, (map.get(k) || 0) + 1)
  })
  return Array.from(map, ([name, value]) => ({ name, value }))
}

export function groupByMonth(records, valueKeys, dateKey = 'date') {
  const map = new Map(MONTHS.map((m) => [m, Object.fromEntries(valueKeys.map((k) => [k, 0]))]))
  records.forEach((r) => {
    const m = monthLabel(r[dateKey])
    if (!map.has(m)) return
    const entry = map.get(m)
    valueKeys.forEach((k) => {
      entry[k] += k === '__count' ? 1 : Number(r[k]) || 0
    })
  })
  return MONTHS.map((m) => ({ month: m, ...map.get(m) }))
}

export function formatINR(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${Math.round(value)}`
}
