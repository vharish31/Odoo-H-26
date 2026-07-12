/*validateCargoWeight(vehicle, cargoWeight)

validateTrip(driver, vehicle, cargoWeight)

dispatchTrip(trip)

completeTrip(trip)

cancelTrip(trip)

validateStatusTransition(currentStatus, nextStatus)
*/
/**
 * server/services/tripService.js
 * ----------------------------------------
 * Business Logic Layer for Trip management in TransitOps.
 *
 * Responsibilities:
 *  - Validate trip creation (cargo, driver, vehicle eligibility)
 *  - Enforce trip status flow (Draft -> Dispatched -> Completed/Cancelled)
 *  - Coordinate Vehicle and Driver status updates on dispatch,
 *    completion, and cancellation
 *
 * NOTE: Trip, Vehicle, and Driver Mongoose models are assumed
 * to already exist. This service assumes that when a `trip`
 * object is passed in, its `vehicle` and `driver` fields are
 * populated Mongoose documents (not just ObjectIds), since their
 * status fields need to be read and updated.
 * ----------------------------------------
 */

const Trip = require("../models/Trip");
const Vehicle = require("../models/Vehicle");
const Driver = require("../models/Driver");
const { isEmpty, isPositiveNumber } = require("../utils/validator");

/**
 * Defines the only valid forward transitions in the trip lifecycle.
 * Draft -> Dispatched
 * Dispatched -> Completed
 * Dispatched -> Cancelled
 */
const VALID_TRANSITIONS = {
  Draft: ["Dispatched"],
  Dispatched: ["Completed", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

/**
 * Validates that the cargo weight for a trip does not exceed
 * the assigned vehicle's capacity.
 * Business Rule: Cargo weight cannot exceed vehicle capacity.
 */
function validateCargoWeight(vehicle, cargoWeight) {
  if (isEmpty(vehicle)) {
    return {
      success: false,
      message: "Vehicle data is required.",
    };
  }

  if (!isPositiveNumber(cargoWeight)) {
    return {
      success: false,
      message: "Cargo weight must be a positive number.",
    };
  }

  if (cargoWeight > vehicle.capacity) {
    return {
      success: false,
      message: "Cargo weight exceeds vehicle capacity.",
    };
  }

  return {
    success: true,
    message: "Cargo weight is within vehicle capacity.",
    data: cargoWeight,
  };
}

/**
 * Validates that a trip can be created with the given driver,
 * vehicle, and cargo weight.
 * Business Rules:
 *  - Driver must be available.
 *  - Driver license must be valid (not expired).
 *  - Vehicle must be available.
 *  - Vehicle cannot be retired.
 *  - Vehicle cannot be under maintenance (In Shop).
 *  - Vehicle cannot already be on another trip.
 *  - Cargo weight cannot exceed vehicle capacity.
 */
function validateTrip(driver, vehicle, cargoWeight) {
  if (isEmpty(driver)) {
    return {
      success: false,
      message: "Driver data is required.",
    };
  }

  if (isEmpty(vehicle)) {
    return {
      success: false,
      message: "Vehicle data is required.",
    };
  }

  // Driver checks
  if (driver.status === "Suspended") {
    return {
      success: false,
      message: "Driver cannot be assigned because they are Suspended.",
    };
  }

  if (driver.status !== "Available") {
    return {
      success: false,
      message: `Driver is not available (current status: '${driver.status}').`,
    };
  }

  if (!isEmpty(driver.licenseExpiry)) {
    const expired = new Date(driver.licenseExpiry).getTime() < Date.now();
    if (expired) {
      return {
        success: false,
        message: "Driver cannot be assigned because their license has expired.",
      };
    }
  }

  // Vehicle checks
  if (vehicle.status === "Retired") {
    return {
      success: false,
      message: "Vehicle cannot be assigned because it is Retired.",
    };
  }

  if (vehicle.status === "In Shop") {
    return {
      success: false,
      message: "Vehicle cannot be assigned because it is under maintenance.",
    };
  }

  if (vehicle.status === "On Trip") {
    return {
      success: false,
      message: "Vehicle cannot be assigned because it is already On Trip.",
    };
  }

  if (vehicle.status !== "Available") {
    return {
      success: false,
      message: `Vehicle is not available (current status: '${vehicle.status}').`,
    };
  }

  // Cargo weight check
  const cargoCheck = validateCargoWeight(vehicle, cargoWeight);
  if (!cargoCheck.success) {
    return cargoCheck;
  }

  return {
    success: true,
    message: "Trip is valid and ready for creation.",
    data: { driver, vehicle, cargoWeight },
  };
}

/**
 * Validates whether a trip status transition is allowed.
 * Business Rule: Only Draft -> Dispatched, Dispatched -> Completed,
 * and Dispatched -> Cancelled transitions are valid. All others
 * are rejected.
 */
function validateStatusTransition(currentStatus, nextStatus) {
  if (isEmpty(currentStatus) || isEmpty(nextStatus)) {
    return {
      success: false,
      message: "Both current and next status are required.",
    };
  }

  const allowedNextStatuses = VALID_TRANSITIONS[currentStatus];

  if (!allowedNextStatuses) {
    return {
      success: false,
      message: `Unknown current status: '${currentStatus}'.`,
    };
  }

  if (!allowedNextStatuses.includes(nextStatus)) {
    return {
      success: false,
      message: `Invalid status transition from '${currentStatus}' to '${nextStatus}'.`,
    };
  }

  return {
    success: true,
    message: `Transition from '${currentStatus}' to '${nextStatus}' is valid.`,
    data: nextStatus,
  };
}

/**
 * Dispatches a trip: Draft -> Dispatched.
 * Marks the assigned vehicle and driver as "On Trip".
 */
async function dispatchTrip(trip) {
  try {
    if (isEmpty(trip) || isEmpty(trip.vehicle) || isEmpty(trip.driver)) {
      return {
        success: false,
        message: "Trip with populated vehicle and driver data is required.",
      };
    }

    const transitionCheck = validateStatusTransition(trip.status, "Dispatched");
    if (!transitionCheck.success) {
      return transitionCheck;
    }

    const tripValidation = validateTrip(
      trip.driver,
      trip.vehicle,
      trip.cargoWeight
    );
    if (!tripValidation.success) {
      return tripValidation;
    }

    trip.vehicle.status = "On Trip";
    trip.driver.status = "On Trip";
    trip.status = "Dispatched";

    await trip.vehicle.save();
    await trip.driver.save();
    await trip.save();

    return {
      success: true,
      message: "Trip has been dispatched.",
      data: trip,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error dispatching trip: ${error.message}`,
    };
  }
}

/**
 * Completes a trip: Dispatched -> Completed.
 * Restores the vehicle and driver to "Available".
 */
async function completeTrip(trip) {
  try {
    if (isEmpty(trip) || isEmpty(trip.vehicle) || isEmpty(trip.driver)) {
      return {
        success: false,
        message: "Trip with populated vehicle and driver data is required.",
      };
    }

    const transitionCheck = validateStatusTransition(trip.status, "Completed");
    if (!transitionCheck.success) {
      return transitionCheck;
    }

    trip.vehicle.status = "Available";
    trip.driver.status = "Available";
    trip.status = "Completed";

    await trip.vehicle.save();
    await trip.driver.save();
    await trip.save();

    return {
      success: true,
      message: "Trip has been completed.",
      data: trip,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error completing trip: ${error.message}`,
    };
  }
}

/**
 * Cancels a trip: Dispatched -> Cancelled.
 * Restores the vehicle and driver to "Available".
 */
async function cancelTrip(trip) {
  try {
    if (isEmpty(trip) || isEmpty(trip.vehicle) || isEmpty(trip.driver)) {
      return {
        success: false,
        message: "Trip with populated vehicle and driver data is required.",
      };
    }

    const transitionCheck = validateStatusTransition(trip.status, "Cancelled");
    if (!transitionCheck.success) {
      return transitionCheck;
    }

    trip.vehicle.status = "Available";
    trip.driver.status = "Available";
    trip.status = "Cancelled";

    await trip.vehicle.save();
    await trip.driver.save();
    await trip.save();

    return {
      success: true,
      message: "Trip has been cancelled.",
      data: trip,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error cancelling trip: ${error.message}`,
    };
  }
}

module.exports = {
  validateCargoWeight,
  validateTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  validateStatusTransition,
};