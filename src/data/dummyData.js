// Dummy data for TransitOps UI development.
// Replace with real API calls when the backend is wired up.

export const vehicles = [
  { id: 'VH-1042', name: 'Freightliner Cascadia', type: 'Truck', plate: 'TN 09 AB 4521', status: 'active', driver: 'Arun Kumar', mileage: 128450, fuel: 'Diesel', lastService: '2026-05-14' },
  { id: 'VH-1043', name: 'Volvo FH16', type: 'Truck', plate: 'TN 22 CJ 7710', status: 'active', driver: 'Meena Raghavan', mileage: 96210, fuel: 'Diesel', lastService: '2026-06-02' },
  { id: 'VH-1044', name: 'Tata Ace Gold', type: 'Van', plate: 'TN 11 GT 3391', status: 'maintenance', driver: 'Unassigned', mileage: 54120, fuel: 'Diesel', lastService: '2026-07-01' },
  { id: 'VH-1045', name: 'Mahindra Bolero Pickup', type: 'Pickup', plate: 'TN 07 FZ 1187', status: 'active', driver: 'Suresh Babu', mileage: 71880, fuel: 'Diesel', lastService: '2026-04-28' },
  { id: 'VH-1046', name: 'Ashok Leyland Dost', type: 'Van', plate: 'TN 45 KL 9042', status: 'idle', driver: 'Unassigned', mileage: 32410, fuel: 'CNG', lastService: '2026-06-19' },
  { id: 'VH-1047', name: 'BharatBenz 1617', type: 'Truck', plate: 'TN 19 MN 2266', status: 'active', driver: 'Divya Prakash', mileage: 104330, fuel: 'Diesel', lastService: '2026-05-30' },
  { id: 'VH-1048', name: 'Eicher Pro 2049', type: 'Truck', plate: 'TN 33 QW 5518', status: 'inactive', driver: 'Unassigned', mileage: 142900, fuel: 'Diesel', lastService: '2026-03-11' },
  { id: 'VH-1049', name: 'Force Traveller', type: 'Van', plate: 'TN 14 RS 8809', status: 'active', driver: 'Kavitha Iyer', mileage: 41780, fuel: 'Diesel', lastService: '2026-06-25' },
]

export const drivers = [
  { id: 'DR-201', name: 'Arun Kumar', license: 'TN0120230004521', phone: '+91 98765 43210', status: 'on-trip', rating: 4.8, vehicle: 'VH-1042', trips: 214, joined: '2023-02-11' },
  { id: 'DR-202', name: 'Meena Raghavan', license: 'TN0120220018832', phone: '+91 98450 11223', status: 'on-trip', rating: 4.9, vehicle: 'VH-1043', trips: 341, joined: '2022-08-04' },
  { id: 'DR-203', name: 'Suresh Babu', license: 'TN0120210027741', phone: '+91 90031 55678', status: 'available', rating: 4.6, vehicle: 'VH-1045', trips: 178, joined: '2023-11-19' },
  { id: 'DR-204', name: 'Divya Prakash', license: 'TN0120240003398', phone: '+91 99400 22110', status: 'on-trip', rating: 4.7, vehicle: 'VH-1047', trips: 96, joined: '2024-01-22' },
  { id: 'DR-205', name: 'Kavitha Iyer', license: 'TN0120230015567', phone: '+91 96290 87654', status: 'on-leave', rating: 4.5, vehicle: 'VH-1049', trips: 152, joined: '2023-05-30' },
  { id: 'DR-206', name: 'Ramesh Chandran', license: 'TN0120190009284', phone: '+91 94870 33421', status: 'available', rating: 4.4, vehicle: 'Unassigned', trips: 402, joined: '2019-09-15' },
]

export const trips = [
  { id: 'TR-8841', vehicle: 'VH-1042', driver: 'Arun Kumar', origin: 'Chennai', destination: 'Bengaluru', distance: '346 km', status: 'in-transit', eta: 'Today, 6:40 PM', startedAt: '2026-07-12 08:15' },
  { id: 'TR-8842', vehicle: 'VH-1043', driver: 'Meena Raghavan', origin: 'Coimbatore', destination: 'Chennai', distance: '502 km', status: 'in-transit', eta: 'Today, 9:10 PM', startedAt: '2026-07-12 06:30' },
  { id: 'TR-8843', vehicle: 'VH-1047', driver: 'Divya Prakash', origin: 'Chennai', destination: 'Madurai', distance: '462 km', status: 'delayed', eta: 'Today, 11:50 PM', startedAt: '2026-07-12 05:45' },
  { id: 'TR-8844', vehicle: 'VH-1049', driver: 'Kavitha Iyer', origin: 'Chennai', destination: 'Pondicherry', distance: '162 km', status: 'completed', eta: 'Completed 1:20 PM', startedAt: '2026-07-12 10:00' },
  { id: 'TR-8845', vehicle: 'VH-1045', driver: 'Suresh Babu', origin: 'Trichy', destination: 'Chennai', distance: '331 km', status: 'scheduled', eta: 'Tomorrow, 8:00 AM', startedAt: '2026-07-13 08:00' },
  { id: 'TR-8846', vehicle: 'VH-1046', driver: 'Ramesh Chandran', origin: 'Chennai', destination: 'Vellore', distance: '138 km', status: 'cancelled', eta: '—', startedAt: '2026-07-11 09:00' },
]

export const expenses = [
  { id: 'EX-3301', category: 'Fuel', vehicle: 'VH-1042', amount: 18450, date: '2026-07-10', paidBy: 'Company Card', status: 'approved' },
  { id: 'EX-3302', category: 'Toll', vehicle: 'VH-1043', amount: 1240, date: '2026-07-10', paidBy: 'FASTag', status: 'approved' },
  { id: 'EX-3303', category: 'Maintenance', vehicle: 'VH-1044', amount: 32600, date: '2026-07-09', paidBy: 'Company Card', status: 'pending' },
  { id: 'EX-3304', category: 'Fuel', vehicle: 'VH-1047', amount: 21980, date: '2026-07-08', paidBy: 'Company Card', status: 'approved' },
  { id: 'EX-3305', category: 'Driver Allowance', vehicle: 'VH-1045', amount: 2500, date: '2026-07-08', paidBy: 'Cash', status: 'pending' },
  { id: 'EX-3306', category: 'Fine', vehicle: 'VH-1048', amount: 1500, date: '2026-07-05', paidBy: 'Company Card', status: 'rejected' },
  { id: 'EX-3307', category: 'Fuel', vehicle: 'VH-1049', amount: 9870, date: '2026-07-04', paidBy: 'Company Card', status: 'approved' },
]

export const maintenance = [
  { id: 'MT-5501', vehicle: 'VH-1044', type: 'Brake Service', dueDate: '2026-07-01', status: 'in-progress', cost: 8400, workshop: 'CityDrive Service Center' },
  { id: 'MT-5502', vehicle: 'VH-1042', type: 'Oil Change', dueDate: '2026-07-20', status: 'scheduled', cost: 3200, workshop: 'Highway Truck Care' },
  { id: 'MT-5503', vehicle: 'VH-1048', type: 'Engine Overhaul', dueDate: '2026-06-28', status: 'overdue', cost: 68500, workshop: 'BharatBenz Authorized Service' },
  { id: 'MT-5504', vehicle: 'VH-1046', type: 'Tyre Replacement', dueDate: '2026-07-15', status: 'scheduled', cost: 15200, workshop: 'CityDrive Service Center' },
  { id: 'MT-5505', vehicle: 'VH-1043', type: 'AC Repair', dueDate: '2026-06-30', status: 'completed', cost: 4600, workshop: 'Volvo Service Point' },
  { id: 'MT-5506', vehicle: 'VH-1049', type: 'Battery Replacement', dueDate: '2026-07-08', status: 'completed', cost: 6800, workshop: 'Force Motors Service' },
]

export const kpis = [
  { label: 'Active Vehicles', value: '24', delta: '+3 this month', trend: 'up' },
  { label: 'On-Trip Drivers', value: '18', delta: '+2 today', trend: 'up' },
  { label: 'Trips In Transit', value: '12', delta: '-1 vs yesterday', trend: 'down' },
  { label: 'Monthly Expenses', value: '₹4.82L', delta: '+6.1% vs last month', trend: 'up' },
]

// ---------------------------------------------------------------------------
// Dashboard-specific data
// ---------------------------------------------------------------------------

export const dashboardKpis = [
  {
    key: 'total-vehicles',
    label: 'Total Vehicles',
    value: '48',
    delta: '+4 this quarter',
    trend: 'up',
    icon: 'Truck',
  },
  {
    key: 'active-trips',
    label: 'Active Trips',
    value: '12',
    delta: '+3 vs yesterday',
    trend: 'up',
    icon: 'Route',
  },
  {
    key: 'available-vehicles',
    label: 'Available Vehicles',
    value: '9',
    delta: '-2 vs yesterday',
    trend: 'down',
    icon: 'CircleCheck',
  },
  {
    key: 'drivers',
    label: 'Drivers',
    value: '36',
    delta: '+1 this month',
    trend: 'up',
    icon: 'Users',
  },
  {
    key: 'monthly-expense',
    label: 'Monthly Expense',
    value: '₹4.82L',
    delta: '+6.1% vs last month',
    trend: 'up',
    icon: 'Wallet',
  },
  {
    key: 'fleet-utilization',
    label: 'Fleet Utilization',
    value: '76%',
    delta: '+4.2% vs last month',
    trend: 'up',
    icon: 'Gauge',
  },
]

export const fleetUtilizationBreakdown = [
  { name: 'In Use', value: 76, colorVar: '--chart-inuse' },
  { name: 'Idle', value: 14, colorVar: '--chart-idle' },
  { name: 'Maintenance', value: 10, colorVar: '--chart-maint' },
]

export const monthlyExpenseTrend = [
  { month: 'Jan', amount: 398000 },
  { month: 'Feb', amount: 412000 },
  { month: 'Mar', amount: 375000 },
  { month: 'Apr', amount: 431000 },
  { month: 'May', amount: 456000 },
  { month: 'Jun', amount: 447000 },
  { month: 'Jul', amount: 482000 },
]

export const fuelConsumptionTrend = [
  { month: 'Feb', diesel: 5120, cng: 460 },
  { month: 'Mar', diesel: 4870, cng: 510 },
  { month: 'Apr', diesel: 5340, cng: 495 },
  { month: 'May', diesel: 5580, cng: 540 },
  { month: 'Jun', diesel: 5205, cng: 575 },
  { month: 'Jul', diesel: 5460, cng: 610 },
]

export const recentTrips = trips.slice(0, 5)

export const upcomingMaintenance = maintenance
  .filter((m) => m.status !== 'completed')
  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

export const smartAlerts = [
  {
    id: 'AL-001',
    type: 'service-due',
    severity: 'critical',
    title: 'Vehicle service overdue',
    message: 'VH-1048 (Eicher Pro 2049) — Engine Overhaul was due Jun 28, 2026.',
    time: '2 hours ago',
  },
  {
    id: 'AL-002',
    type: 'license-expiry',
    severity: 'warning',
    title: 'Driver license expiring soon',
    message: "Suresh Babu's driving license expires in 9 days (Jul 21, 2026).",
    time: '5 hours ago',
  },
  {
    id: 'AL-003',
    type: 'fuel-budget',
    severity: 'warning',
    title: 'Fuel budget exceeded',
    message: 'Diesel spend for July is 14% over the ₹4.2L monthly budget.',
    time: 'Yesterday',
  },
  {
    id: 'AL-004',
    type: 'service-due',
    severity: 'info',
    title: 'Service reminder',
    message: 'VH-1042 (Freightliner Cascadia) is due for an oil change on Jul 20, 2026.',
    time: 'Yesterday',
  },
  {
    id: 'AL-005',
    type: 'license-expiry',
    severity: 'info',
    title: 'License renewal window open',
    message: "Ramesh Chandran's license renewal window opens next week.",
    time: '2 days ago',
  },
]

export const aiFleetInsights = {
  headline: 'Vehicle TN09AB1234 may require maintenance within 14 days based on mileage.',
  confidence: 87,
  vehicle: 'VH-1042',
  supportingPoints: [
    'Mileage since last service is 9,340 km, above the 8,000 km service interval.',
    'Engine load telemetry trending 6% higher than fleet average over 30 days.',
    'Similar mileage patterns preceded service events in 3 comparable vehicles.',
  ],
  secondaryPredictions: [
    { vehicle: 'VH-1048', message: 'High risk of unplanned downtime — overdue engine overhaul.' },
    { vehicle: 'VH-1044', message: 'Brake wear pattern suggests re-inspection after current service.' },
  ],
}
