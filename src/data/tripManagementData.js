// Dummy data for the Trip Management module.
// Trip workflow: created -> assigned -> started -> completed.
// Each trip carries a `timeline`: an ordered log of { status, at } entries
// recording when it moved through each stage of the workflow.
// Replace with real API calls when the backend is wired up.

export const TRIP_STATUSES = ['created', 'assigned', 'started', 'completed']

export const TRIP_STATUS_LABELS = {
  created: 'Created',
  assigned: 'Assigned',
  started: 'Started',
  completed: 'Completed',
}

export const CARGO_TYPES = [
  'General Freight',
  'Perishables',
  'Electronics',
  'Construction Materials',
  'Furniture',
  'Textiles',
  'Automotive Parts',
  'Documents & Parcels',
]

export const trips = [
  {
    id: 'TR-8841',
    vehicle: 'VH-1042',
    driver: 'DR-201',
    origin: 'Chennai',
    destination: 'Bengaluru',
    distance: 346,
    cargo: 'Electronics',
    status: 'started',
    timeline: [
      { status: 'created', at: '2026-07-12 06:30' },
      { status: 'assigned', at: '2026-07-12 07:05' },
      { status: 'started', at: '2026-07-12 08:15' },
    ],
  },
  {
    id: 'TR-8842',
    vehicle: 'VH-1043',
    driver: 'DR-202',
    origin: 'Coimbatore',
    destination: 'Chennai',
    distance: 502,
    cargo: 'Textiles',
    status: 'started',
    timeline: [
      { status: 'created', at: '2026-07-12 05:10' },
      { status: 'assigned', at: '2026-07-12 05:40' },
      { status: 'started', at: '2026-07-12 06:30' },
    ],
  },
  {
    id: 'TR-8843',
    vehicle: 'VH-1047',
    driver: 'DR-204',
    origin: 'Chennai',
    destination: 'Madurai',
    distance: 462,
    cargo: 'Construction Materials',
    status: 'started',
    timeline: [
      { status: 'created', at: '2026-07-12 04:50' },
      { status: 'assigned', at: '2026-07-12 05:15' },
      { status: 'started', at: '2026-07-12 05:45' },
    ],
  },
  {
    id: 'TR-8844',
    vehicle: 'VH-1049',
    driver: 'DR-207',
    origin: 'Chennai',
    destination: 'Pondicherry',
    distance: 162,
    cargo: 'Documents & Parcels',
    status: 'completed',
    timeline: [
      { status: 'created', at: '2026-07-12 09:00' },
      { status: 'assigned', at: '2026-07-12 09:20' },
      { status: 'started', at: '2026-07-12 10:00' },
      { status: 'completed', at: '2026-07-12 13:20' },
    ],
  },
  {
    id: 'TR-8845',
    vehicle: 'VH-1045',
    driver: 'DR-203',
    origin: 'Trichy',
    destination: 'Chennai',
    distance: 331,
    cargo: 'General Freight',
    status: 'assigned',
    timeline: [
      { status: 'created', at: '2026-07-12 18:00' },
      { status: 'assigned', at: '2026-07-12 18:30' },
    ],
  },
  {
    id: 'TR-8846',
    vehicle: 'VH-1051',
    driver: 'DR-209',
    origin: 'Chennai',
    destination: 'Vellore',
    distance: 138,
    cargo: 'Furniture',
    status: 'created',
    timeline: [{ status: 'created', at: '2026-07-11 09:00' }],
  },
  {
    id: 'TR-8847',
    vehicle: 'VH-1050',
    driver: 'DR-207',
    origin: 'Chennai',
    destination: 'Tirupati',
    distance: 154,
    cargo: 'Automotive Parts',
    status: 'completed',
    timeline: [
      { status: 'created', at: '2026-07-10 07:00' },
      { status: 'assigned', at: '2026-07-10 07:25' },
      { status: 'started', at: '2026-07-10 08:00' },
      { status: 'completed', at: '2026-07-10 11:40' },
    ],
  },
]
