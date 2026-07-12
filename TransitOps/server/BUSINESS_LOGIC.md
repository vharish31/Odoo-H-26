# TransitOps Business Logic API

## vehicleService.js

- checkDuplicateRegistration(registrationNo)
- validateVehicle(vehicleData)
- canDispatchVehicle(vehicle)
- markVehicleOnTrip(vehicle)
- restoreVehicle(vehicle)
- retireVehicle(vehicle)

## driverService.js

- validateDriver(driver)
- isLicenseExpired(driver)
- canAssignDriver(driver)
- markDriverOnTrip(driver)
- restoreDriver(driver)

## tripService.js

- validateCargoWeight(vehicle, cargoWeight)
- validateTrip(driver, vehicle, cargoWeight)
- dispatchTrip(trip)
- completeTrip(trip)
- cancelTrip(trip)
- validateStatusTransition(currentStatus, nextStatus)

## maintenanceService.js

- startMaintenance(vehicle)
- completeMaintenance(vehicle)

## expenseService.js

- validateExpense(expense)
- calculateFuelExpense(litres, pricePerLitre)

## validator.js

- isEmpty(value)
- isPositiveNumber(value)
- isValidVehicleStatus(status)
- isValidDriverStatus(status)
- isValidTripStatus(status)