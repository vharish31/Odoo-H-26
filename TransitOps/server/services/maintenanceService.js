/*startMaintenance(vehicle)

completeMaintenance(vehicle)
*/
/**
 * server/services/maintenanceService.js
 * ----------------------------------------
 * Business Logic Layer for Vehicle Maintenance management in TransitOps.
 *
 * Responsibilities:
 *  - Handle vehicle maintenance lifecycle transitions
 *  - Enforce maintenance-related business rules
 *
 * NOTE: Vehicle Mongoose model is assumed to already exist.
 * ----------------------------------------
 */

const Vehicle = require("../models/Vehicle");
const { isEmpty } = require("../utils/validator");

/**
 * Starts maintenance on a vehicle: Available -> In Shop.
 * Business Rules:
 *  - Only an Available vehicle can enter maintenance.
 *  - Retired vehicles can never enter maintenance.
 *  - A vehicle in maintenance cannot be dispatched (enforced by
 *    setting status to "In Shop", which vehicleService/tripService
 *    already treat as non-dispatchable).
 */
async function startMaintenance(vehicle) {
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
        message: "Retired vehicles cannot enter maintenance.",
      };
    }

    if (vehicle.status === "On Trip") {
      return {
        success: false,
        message: "Vehicle currently on a trip cannot enter maintenance.",
      };
    }

    if (vehicle.status === "In Shop") {
      return {
        success: false,
        message: "Vehicle is already in maintenance.",
      };
    }

    if (vehicle.status !== "Available") {
      return {
        success: false,
        message: `Vehicle cannot enter maintenance while status is '${vehicle.status}'.`,
      };
    }

    vehicle.status = "In Shop";
    await vehicle.save();

    return {
      success: true,
      message: "Vehicle has entered maintenance.",
      data: vehicle,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error starting maintenance: ${error.message}`,
    };
  }
}

/**
 * Completes maintenance on a vehicle: In Shop -> Available.
 * Business Rule: Only a vehicle currently In Shop can be
 * restored to Available through this flow.
 */
async function completeMaintenance(vehicle) {
  try {
    if (isEmpty(vehicle)) {
      return {
        success: false,
        message: "Vehicle data is required.",
      };
    }

    if (vehicle.status !== "In Shop") {
      return {
        success: false,
        message: `Vehicle cannot complete maintenance while status is '${vehicle.status}'.`,
      };
    }

    vehicle.status = "Available";
    await vehicle.save();

    return {
      success: true,
      message: "Vehicle maintenance completed. Vehicle is now Available.",
      data: vehicle,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error completing maintenance: ${error.message}`,
    };
  }
}

module.exports = {
  startMaintenance,
  completeMaintenance,
};