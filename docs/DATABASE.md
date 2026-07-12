# TransitOps Database Schema

## MongoDB Database: `transitops`

## Collections

### Users

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'manager', 'driver']),
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicles

```javascript
{
  _id: ObjectId,
  registrationNumber: String (unique, uppercase),
  vehicleType: String,
  manufacturer: String,
  model: String,
  year: Number,
  capacity: Number (tons),
  fuelType: String,
  status: String (enum: ['available', 'on-trip', 'under-maintenance', 'requires-maintenance', 'retired']),
  createdAt: Date,
  updatedAt: Date
}
```

### Drivers

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  licenseNumber: String (unique),
  licenseExpiry: Date,
  status: String (enum: ['available', 'on-trip', 'unavailable']),
  rating: Number (1-5),
  createdAt: Date,
  updatedAt: Date
}
```

### Trips

```javascript
{
  _id: ObjectId,
  vehicleId: ObjectId (ref: Vehicle),
  driverId: ObjectId (ref: Driver),
  origin: String,
  destination: String,
  cargoWeight: Number,
  status: String (enum: ['pending', 'in-progress', 'completed', 'cancelled']),
  startTime: Date,
  endTime: Date,
  distance: Number (km),
  createdAt: Date,
  updatedAt: Date
}
```

### Maintenance

```javascript
{
  _id: ObjectId,
  vehicleId: ObjectId (ref: Vehicle),
  type: String,
  workshop: String,
  dueDate: Date,
  cost: Number,
  status: String (enum: ['scheduled', 'in-progress', 'completed', 'overdue']),
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Expenses

```javascript
{
  _id: ObjectId,
  vehicleId: ObjectId (ref: Vehicle),
  category: String,
  amount: Number,
  paidBy: String,
  date: Date,
  description: String,
  status: String (enum: ['pending', 'approved', 'rejected']),
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

- Users: `email` (unique)
- Vehicles: `registrationNumber` (unique)
- Drivers: `email` (unique), `licenseNumber` (unique)
- Trips: `vehicleId`, `driverId`, `status`
- Maintenance: `vehicleId`, `status`, `dueDate`
- Expenses: `vehicleId`, `date`, `category`
