# TransitOps Service Contract

## Overview

This document defines the Business Logic Service API for TransitOps.

Responsibilities:
- Services contain all business rules and validations.
- Controllers call these services.
- Services do NOT send HTTP responses.
- Services do NOT use Express `req` or `res`.
- Services return a standard response object.

---

# Standard Response Format

Every service function should return:

Success

```js
{
    success: true,
    message: "Operation successful",
    data: {}
}
```

Failure

```js
{
    success: false,
    message: "Reason for failure"
}
```

---

# vehicleService.js

## checkDuplicateRegistration(registrationNo)

### Purpose
Ensure vehicle registration number is unique.

### Input

```js
registrationNo : String
```

Example

```js
"TN01AB1234"
```

### Returns

Success

```js
{
    success: true,
    message: "Registration available"
}
```

Failure

```js
{
    success: false,
    message: "Vehicle registration already exists"
}
```

Business Rule

- Registration number cannot be duplicated.

---

## validateVehicle(vehicleData)

### Purpose

Validate vehicle details before creation or update.

### Input

```js
{
    registrationNo,
    capacity,
    status
}
```

### Validation

- Registration required
- Capacity > 0
- Valid status

Returns standard response.

---

## canDispatchVehicle(vehicle)

### Purpose

Check whether vehicle can be assigned to a trip.

### Input

```js
vehicle
```

Checks

- Available
- Not retired
- Not under maintenance

Returns standard response.

---

## markVehicleOnTrip(vehicle)

### Purpose

Update vehicle status after dispatch.

Status

Available

↓

On Trip

Returns updated vehicle.

---

## restoreVehicle(vehicle)

### Purpose

Restore vehicle after trip completion or cancellation.

Status

On Trip

↓

Available

Returns updated vehicle.

---

## retireVehicle(vehicle)

### Purpose

Retire vehicle permanently.

Status

↓

Retired

Retired vehicles cannot

- Dispatch
- Maintenance
- Fuel
- Trips

---

# driverService.js

## validateDriver(driver)

### Purpose

Validate driver information.

Checks

- Required fields
- License expiry
- Status validity

Returns standard response.

---

## isLicenseExpired(driver)

### Purpose

Check driver license validity.

Input

```js
driver.licenseExpiry
```

Returns

Valid

or

Expired

---

## canAssignDriver(driver)

### Purpose

Check whether driver is available.

Conditions

- Available
- License valid
- Not suspended

Returns standard response.

---

## markDriverOnTrip(driver)

### Purpose

After dispatch

Status

Available

↓

On Trip

---

## restoreDriver(driver)

### Purpose

After trip completion/cancellation

Status

On Trip

↓

Available

---

# tripService.js

## validateCargoWeight(vehicle,cargoWeight)

### Purpose

Ensure cargo weight does not exceed vehicle capacity.

Input

```js
vehicle.capacity

cargoWeight
```

Returns standard response.

---

## validateTrip(driver,vehicle,cargoWeight)

### Purpose

Master validation before dispatch.

Checks

- Driver available
- License valid
- Vehicle available
- Vehicle not retired
- Vehicle not under maintenance
- Cargo within capacity

Returns standard response.

---

## dispatchTrip(trip)

### Purpose

Dispatch trip.

Updates

Trip

Draft

↓

Dispatched

Vehicle

Available

↓

On Trip

Driver

Available

↓

On Trip

Returns updated trip.

---

## completeTrip(trip)

### Purpose

Complete trip.

Updates

Trip

Dispatched

↓

Completed

Vehicle

On Trip

↓

Available

Driver

On Trip

↓

Available

Returns updated trip.

---

## cancelTrip(trip)

### Purpose

Cancel trip.

Updates

Trip

Dispatched

↓

Cancelled

Vehicle

On Trip

↓

Available

Driver

On Trip

↓

Available

Returns updated trip.

---

## validateStatusTransition(currentStatus,nextStatus)

### Purpose

Allow only valid status transitions.

Vehicle

Available

↓

On Trip

↓

Available

↓

In Shop

↓

Available

↓

Retired

Driver

Available

↓

On Trip

↓

Available

↓

Off Duty

↓

Available

↓

Suspended

Trip

Draft

↓

Dispatched

↓

Completed

OR

Cancelled

Reject every invalid transition.

---

# maintenanceService.js

## startMaintenance(vehicle)

### Purpose

Move vehicle to maintenance.

Status

Available

↓

In Shop

Vehicle cannot be dispatched.

Returns updated vehicle.

---

## completeMaintenance(vehicle)

### Purpose

Finish maintenance.

Status

In Shop

↓

Available

Returns updated vehicle.

---

# expenseService.js

## validateExpense(expense)

### Purpose

Validate expense entry.

Checks

- Amount > 0
- Expense type exists

Returns standard response.

---

## calculateFuelExpense(litres,pricePerLitre)

### Purpose

Calculate total fuel cost.

Formula

```
Fuel Cost = litres × pricePerLitre
```

Returns

```js
{
    success:true,
    data:{
        totalCost
    }
}
```

---

# validator.js

Reusable helper functions.

## isEmpty(value)

Checks whether value is empty.

Returns

true / false

---

## isPositiveNumber(value)

Checks number greater than zero.

Returns

true / false

---

## isValidVehicleStatus(status)

Allowed values

- Available
- On Trip
- In Shop
- Retired

Returns

true / false

---

## isValidDriverStatus(status)

Allowed values

- Available
- On Trip
- Off Duty
- Suspended

Returns

true / false

---

## isValidTripStatus(status)

Allowed values

- Draft
- Dispatched
- Completed
- Cancelled

Returns

true / false

---

# Integration Notes

Services are called only from Controllers.

```
Route
   ↓
Controller
   ↓
Service
   ↓
Model
```

Controllers should never implement business rules.

Services should never return HTTP responses.

All business rules belong inside the service layer.