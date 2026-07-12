const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const driverRepository = require('../repositories/driverRepository');
const { DRIVER_STATUS } = require('../utils/constants');

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid driver ID', 400);
  }
};

const getDriverOrThrow = async (id) => {
  assertValidId(id);

  const driver = await driverRepository.findById(id);

  if (!driver) {
    throw new AppError('Driver not found', 404);
  }

  return driver;
};

// Business Logic Functions from TransitOps
const validateDriver = (driverData) => {
  const { name, email, licenseNumber, phone } = driverData;
  
  if (!name || name.trim().length === 0) {
    throw new AppError('Driver name is required', 400);
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError('Valid email is required', 400);
  }
  if (!licenseNumber || licenseNumber.trim().length === 0) {
    throw new AppError('License number is required', 400);
  }
  if (!phone || phone.trim().length === 0) {
    throw new AppError('Phone number is required', 400);
  }
  
  return true;
};

const isLicenseExpired = (driver) => {
  if (!driver.licenseExpiry) return false;
  return new Date(driver.licenseExpiry) < new Date();
};

const canAssignDriver = (driver) => {
  if (isLicenseExpired(driver)) {
    throw new AppError('Driver license has expired', 400);
  }
  return driver.status === DRIVER_STATUS.AVAILABLE;
};

const markDriverOnTrip = async (driverId) => {
  const driver = await getDriverOrThrow(driverId);
  if (!canAssignDriver(driver)) {
    throw new AppError('Driver is not available for assignment', 400);
  }
  return await driverRepository.updateById(driverId, { status: DRIVER_STATUS.ON_TRIP });
};

const restoreDriver = async (driverId) => {
  const driver = await getDriverOrThrow(driverId);
  return await driverRepository.updateById(driverId, { status: DRIVER_STATUS.AVAILABLE });
};

// CRUD Operations
const createDriver = async (driverData) => {
  validateDriver(driverData);
  
  const { email, licenseNumber } = driverData;

  const emailExists = await driverRepository.emailExists(email);
  if (emailExists) {
    throw new AppError('Email already exists', 409);
  }

  const licenseExists = await driverRepository.licenseExists(licenseNumber);
  if (licenseExists) {
    throw new AppError('License number already exists', 409);
  }

  const driver = await driverRepository.create(driverData);

  return driver.toPublicJSON();
};

const getAllDrivers = async () => {
  const drivers = await driverRepository.findAll();
  return drivers.map((driver) => driver.toPublicJSON());
};

const getDriverById = async (id) => {
  const driver = await getDriverOrThrow(id);
  return driver.toPublicJSON();
};

const updateDriver = async (id, updateData) => {
  await getDriverOrThrow(id);

  if (updateData.email) {
    const emailExists = await driverRepository.emailExists(updateData.email, id);
    if (emailExists) {
      throw new AppError('Email already exists', 409);
    }
  }

  if (updateData.licenseNumber) {
    const licenseExists = await driverRepository.licenseExists(updateData.licenseNumber, id);
    if (licenseExists) {
      throw new AppError('License number already exists', 409);
    }
  }

  const updatedDriver = await driverRepository.updateById(id, updateData);

  if (!updatedDriver) {
    throw new AppError('Driver not found', 404);
  }

  return updatedDriver.toPublicJSON();
};

const deleteDriver = async (id) => {
  await getDriverOrThrow(id);

  const deletedDriver = await driverRepository.deleteById(id);

  if (!deletedDriver) {
    throw new AppError('Driver not found', 404);
  }

  return deletedDriver.toPublicJSON();
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  // Business Logic Functions
  validateDriver,
  isLicenseExpired,
  canAssignDriver,
  markDriverOnTrip,
  restoreDriver,
};
