/*isEmpty(value)

isPositiveNumber(value)

isValidVehicleStatus(status)

isValidDriverStatus(status)

isValidTripStatus(status) 
*/
/**
 * server/utils/validator.js
 * ----------------------------------------
 * Reusable validation helper functions used across the
 * Business Logic (Services) layer of TransitOps.
 *
 * These are pure functions:
 *  - No database access
 *  - No req/res access
 *  - Just input validation logic
 * ----------------------------------------
 */

// Allowed status values for each entity (kept centralized for easy maintenance)
const VEHICLE_STATUSES = ["Available", "On Trip", "In Shop", "Retired"];
const DRIVER_STATUSES = ["Available", "On Trip", "Off Duty", "Suspended"];
const TRIP_STATUSES = ["Draft", "Dispatched", "Completed", "Cancelled"];

/**
 * Checks whether a value is empty.
 * Covers: undefined, null, empty string, whitespace-only string.
 * Note: 0 and false are NOT considered empty (valid falsy values).
 */
function isEmpty(value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string" && value.trim().length === 0) {
    return true;
  }

  return false;
}

/**
 * Checks whether a value is a valid positive number (> 0).
 * Rejects NaN, negative numbers, zero, and non-numeric types.
 */
function isPositiveNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return false;
  }

  return value > 0;
}

/**
 * Validates that the given status is an allowed Vehicle status.
 */
function isValidVehicleStatus(status) {
  return VEHICLE_STATUSES.includes(status);
}

/**
 * Validates that the given status is an allowed Driver status.
 */
function isValidDriverStatus(status) {
  return DRIVER_STATUSES.includes(status);
}

/**
 * Validates that the given status is an allowed Trip status.
 */
function isValidTripStatus(status) {
  return TRIP_STATUSES.includes(status);
}

module.exports = {
  isEmpty,
  isPositiveNumber,
  isValidVehicleStatus,
  isValidDriverStatus,
  isValidTripStatus,
};