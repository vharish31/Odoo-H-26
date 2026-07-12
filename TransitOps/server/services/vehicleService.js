/*checkDuplicateRegistration(registrationNo)

validateVehicle(vehicleData)

canDispatchVehicle(vehicle)

markVehicleOnTrip(vehicle)

restoreVehicle(vehicle)

retireVehicle(vehicle)
*/
/**
 * server/services/vehicleService.js
 * ----------------------------------------
 * Business Logic Layer for Vehicle management in TransitOps.
 *
 * Responsibilities:
 *  - Enforce vehicle-related business rules
 *  - Validate vehicle data before persistence
 *  - Handle vehicle lifecycle state transitions
 *
 * NOTE: Vehicle Mongoose model is assumed to already exist.
 * ----------------------------------------
 */

const Vehicle = require("../models/Vehicle");
const {
  isEmpty,
  isPositiveNumber,
  isValidVehicleStatus,
} = require("../utils/validator");

/**
 * Checks whether a vehicle with the given registration number
 * already exists in the system.
 * Business Rule: Registration number cannot be duplicated.
 */
async function checkDuplicateRegistration(registrationNo) {
  try {
    if (isEmpty(registrationNo)) {
      return {
        success: false,
        message: "Registration number is required.",
      };
    }

    const existingVehicle = await Vehicle.findOne({ registrationNo });

    if (existingVehicle) {
      return {
        success: false,
        message: "A vehicle with this registration number already exists.",
      };
    }

    return {
      success: true,
      message: "Registration number is available.",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error checking duplicate registration: ${error.message}`,
    };
  }
}

/**
 * Validates core vehicle fields before creation/update.
 * Business Rules:
 *  - Registration number must not be empty.
 *  - Capacity must be greater than zero.
 *  - Status (if provided) must be a valid vehicle status.
 */
function validateVehicle(vehicleData) {
  if (isEmpty(vehicleData)) {
    return {
      success: false,
      message: "Vehicle data is required.",
    };
  }

  if (isEmpty(vehicleData.registrationNo)) {
    return {
      success: false,
      message: "Registration number is required.",
    };
  }

  if (!isPositiveNumber(vehicleData.capacity)) {
    return {
      success: false,
      message: "Vehicle capacity must be a positive number.",
    };
  }

  // Status is optional at creation time, but if provided, must be valid
  if (
    !isEmpty(vehicleData.status) &&
    !isValidVehicleStatus(vehicleData.status)
  ) {
    return {
      success: false,
      message: "Invalid vehicle status provided.",
    };
  }

  return {
    success: true,
    message: "Vehicle data is valid.",
    data: vehicleData,
  };
}

/**
 * Determines whether a vehicle is eligible for dispatch.
 * Business Rule: Vehicle cannot dispatch if it is already
 * On Trip, In Shop, or Retired.
 */
function canDispatchVehicle(vehicle) {
  if (isEmpty(vehicle)) {
    return {
      success: false,
      message: "Vehicle data is required.",
    };
  }

  const blockedStatuses = ["On Trip", "In Shop", "Retired"];

  if (blockedStatuses.includes(vehicle.status)) {
    return {
      success: false,
      message: `Vehicle cannot be dispatched while status is '${vehicle.status}'.`,
    };
  }

  return {
    success: true,
    message: "Vehicle is eligible for dispatch.",
    data: vehicle,
  };
}

/**
 * Marks a vehicle as "On Trip" once it has been dispatched.
 * Business Rule: Retired vehicles can never be assigned to trips.
 */
async function markVehicleOnTrip(vehicle) {
  try {
    if (isEmpty(vehicle)) {
      return {
        success: false,
        message: "Vehicle data is required.",
      };
    }

    if (vehicle.status === "Retired") {
      return {
        success: false,
        message: "Retired vehicles cannot be assigned to trips.",
      };
    }

    vehicle.status = "On Trip";
    await vehicle.save();

    return {
      success: true,
      message: "Vehicle marked as On Trip.",
      data: vehicle,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating vehicle status: ${error.message}`,
    };
  }
}

/**
 * Restores a vehicle to "Available" status after trip completion.
 * Business Rule: After trip completion, vehicle becomes Available
 * (unless it has been retired in the meantime).
 */
async function restoreVehicle(vehicle) {
  try {
    if (isEmpty(vehicle)) {
      return {
        success: false,
        message: "Vehicle data is required.",
      };
    }

    if (vehicle.status === "Retired") {
      return {
        success: false,
        message: "Retired vehicles cannot be restored to Available status.",
      };
    }

    vehicle.status = "Available";
    await vehicle.save();

    return {
      success: true,
      message: "Vehicle restored to Available status.",
      data: vehicle,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error restoring vehicle: ${error.message}`,
    };
  }
}

/**
 * Retires a vehicle permanently.
 * Business Rule: Retired vehicles cannot dispatch, undergo
 * maintenance, add fuel, or be assigned to trips.
 */
async function retireVehicle(vehicle) {
  try {
    if (isEmpty(vehicle)) {
      return {
        success: false,
        message: "Vehicle data is required.",
      };
    }

    if (vehicle.status === "On Trip") {
      return {
        success: false,
        message: "Vehicle currently on a trip cannot be retired.",
      };
    }

    if (vehicle.status === "Retired") {
      return {
        success: false,
        message: "Vehicle is already retired.",
      };
    }

    vehicle.status = "Retired";
    await vehicle.save();

    return {
      success: true,
      message: "Vehicle has been retired.",
      data: vehicle,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error retiring vehicle: ${error.message}`,
    };
  }
}

module.exports = {
  checkDuplicateRegistration,
  validateVehicle,
  canDispatchVehicle,
  markVehicleOnTrip,
  restoreVehicle,
  retireVehicle,
};