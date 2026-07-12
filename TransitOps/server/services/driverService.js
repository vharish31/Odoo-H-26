/*validateDriver(driver)

isLicenseExpired(driver)

canAssignDriver(driver)

markDriverOnTrip(driver)

restoreDriver(driver)
*/
/**
 * server/services/driverService.js
 * ----------------------------------------
 * Business Logic Layer for Driver management in TransitOps.
 *
 * Responsibilities:
 *  - Enforce driver-related business rules
 *  - Validate driver data before persistence
 *  - Handle driver lifecycle state transitions
 *
 * NOTE: Driver Mongoose model is assumed to already exist.
 * ----------------------------------------
 */

const Driver = require("../models/Driver");
const { isEmpty, isValidDriverStatus } = require("../utils/validator");

/**
 * Validates core driver fields before creation/update.
 * Business Rules:
 *  - Name must not be empty.
 *  - License number must not be empty.
 *  - License expiry date must be provided.
 *  - Status (if provided) must be a valid driver status.
 */
function validateDriver(driver) {
  if (isEmpty(driver)) {
    return {
      success: false,
      message: "Driver data is required.",
    };
  }

  if (isEmpty(driver.name)) {
    return {
      success: false,
      message: "Driver name is required.",
    };
  }

  if (isEmpty(driver.licenseNo)) {
    return {
      success: false,
      message: "License number is required.",
    };
  }

  if (isEmpty(driver.licenseExpiry)) {
    return {
      success: false,
      message: "License expiry date is required.",
    };
  }

  if (!isEmpty(driver.status) && !isValidDriverStatus(driver.status)) {
    return {
      success: false,
      message: "Invalid driver status provided.",
    };
  }

  return {
    success: true,
    message: "Driver data is valid.",
    data: driver,
  };
}

/**
 * Checks whether a driver's license has expired.
 * Business Rule: License cannot be expired for the driver to operate.
 */
function isLicenseExpired(driver) {
  if (isEmpty(driver) || isEmpty(driver.licenseExpiry)) {
    return {
      success: false,
      message: "Driver license expiry information is missing.",
    };
  }

  const expiryDate = new Date(driver.licenseExpiry);
  const today = new Date();

  const expired = expiryDate.getTime() < today.getTime();

  return {
    success: true,
    message: expired ? "Driver license has expired." : "Driver license is valid.",
    data: expired,
  };
}

/**
 * Determines whether a driver is eligible to be assigned to a trip.
 * Business Rules:
 *  - License cannot be expired.
 *  - Driver must be Available.
 *  - Driver cannot already be On Trip.
 *  - Driver cannot be Suspended.
 */
function canAssignDriver(driver) {
  if (isEmpty(driver)) {
    return {
      success: false,
      message: "Driver data is required.",
    };
  }

  const licenseCheck = isLicenseExpired(driver);

  if (!licenseCheck.success) {
    return licenseCheck;
  }

  if (licenseCheck.data === true) {
    return {
      success: false,
      message: "Driver cannot be assigned because their license has expired.",
    };
  }

  if (driver.status === "Suspended") {
    return {
      success: false,
      message: "Driver cannot be assigned because they are Suspended.",
    };
  }

  if (driver.status === "On Trip") {
    return {
      success: false,
      message: "Driver cannot be assigned because they are already On Trip.",
    };
  }

  if (driver.status !== "Available") {
    return {
      success: false,
      message: `Driver cannot be assigned while status is '${driver.status}'.`,
    };
  }

  return {
    success: true,
    message: "Driver is eligible for assignment.",
    data: driver,
  };
}

/**
 * Marks a driver as "On Trip" once dispatched.
 * Business Rule: Available → On Trip after dispatch.
 */
async function markDriverOnTrip(driver) {
  try {
    if (isEmpty(driver)) {
      return {
        success: false,
        message: "Driver data is required.",
      };
    }

    const eligibility = canAssignDriver(driver);

    if (!eligibility.success) {
      return eligibility;
    }

    driver.status = "On Trip";
    await driver.save();

    return {
      success: true,
      message: "Driver marked as On Trip.",
      data: driver,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error updating driver status: ${error.message}`,
    };
  }
}

/**
 * Restores a driver to "Available" status after trip completion.
 * Business Rule: On Trip → Available after trip completion.
 */
async function restoreDriver(driver) {
  try {
    if (isEmpty(driver)) {
      return {
        success: false,
        message: "Driver data is required.",
      };
    }

    if (driver.status === "Suspended") {
      return {
        success: false,
        message: "Suspended drivers cannot be restored to Available status.",
      };
    }

    driver.status = "Available";
    await driver.save();

    return {
      success: true,
      message: "Driver restored to Available status.",
      data: driver,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error restoring driver: ${error.message}`,
    };
  }
}

module.exports = {
  validateDriver,
  isLicenseExpired,
  canAssignDriver,
  markDriverOnTrip,
  restoreDriver,
};