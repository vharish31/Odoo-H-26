const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const vehicleRepository = require('../repositories/vehicleRepository');
const { VEHICLE_STATUS } = require('../utils/constants');

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid vehicle ID', 400);
  }
};

const getVehicleOrThrow = async (id) => {
  assertValidId(id);

  const vehicle = await vehicleRepository.findById(id);

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  return vehicle;
};

// Business Logic Functions from TransitOps
const checkDuplicateRegistration = async (registrationNo, excludeId = null) => {
  return await vehicleRepository.registrationNumberExists(registrationNo, excludeId);
};

const validateVehicle = (vehicleData) => {
  const { registrationNumber, vehicleType, manufacturer, model, year, capacity, fuelType } = vehicleData;
  
  if (!registrationNumber || registrationNumber.trim().length === 0) {
    throw new AppError('Registration number is required', 400);
  }
  if (!vehicleType || vehicleType.trim().length === 0) {
    throw new AppError('Vehicle type is required', 400);
  }
  if (!manufacturer || manufacturer.trim().length === 0) {
    throw new AppError('Manufacturer is required', 400);
  }
  if (!model || model.trim().length === 0) {
    throw new AppError('Model is required', 400);
  }
  if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
    throw new AppError('Invalid year', 400);
  }
  if (!capacity || capacity < 1) {
    throw new AppError('Capacity must be at least 1', 400);
  }
  if (!fuelType || fuelType.trim().length === 0) {
    throw new AppError('Fuel type is required', 400);
  }
  
  return true;
};

const canDispatchVehicle = (vehicle) => {
  return vehicle.status === VEHICLE_STATUS.AVAILABLE;
};

const markVehicleOnTrip = async (vehicleId) => {
  const vehicle = await getVehicleOrThrow(vehicleId);
  if (!canDispatchVehicle(vehicle)) {
    throw new AppError('Vehicle is not available for dispatch', 400);
  }
  return await vehicleRepository.updateById(vehicleId, { status: VEHICLE_STATUS.ON_TRIP });
};

const restoreVehicle = async (vehicleId) => {
  const vehicle = await getVehicleOrThrow(vehicleId);
  return await vehicleRepository.updateById(vehicleId, { status: VEHICLE_STATUS.AVAILABLE });
};

const retireVehicle = async (vehicleId) => {
  const vehicle = await getVehicleOrThrow(vehicleId);
  return await vehicleRepository.updateById(vehicleId, { status: VEHICLE_STATUS.RETIRED });
};

// CRUD Operations
const createVehicle = async (vehicleData) => {
  validateVehicle(vehicleData);
  
  const { registrationNumber } = vehicleData;

  const duplicate = await vehicleRepository.registrationNumberExists(registrationNumber);

  if (duplicate) {
    throw new AppError('Registration number already exists', 409);
  }

  const vehicle = await vehicleRepository.create({
    ...vehicleData,
    registrationNumber: registrationNumber.toUpperCase(),
  });

  return vehicle.toPublicJSON();
};

const getAllVehicles = async () => {
  const vehicles = await vehicleRepository.findAll();
  return vehicles.map((vehicle) => vehicle.toPublicJSON());
};

const getVehicleById = async (id) => {
  const vehicle = await getVehicleOrThrow(id);
  return vehicle.toPublicJSON();
};

const updateVehicle = async (id, updateData) => {
  await getVehicleOrThrow(id);

  if (updateData.registrationNumber) {
    const duplicate = await vehicleRepository.registrationNumberExists(
      updateData.registrationNumber,
      id
    );

    if (duplicate) {
      throw new AppError('Registration number already exists', 409);
    }

    updateData.registrationNumber = updateData.registrationNumber.toUpperCase();
  }

  const updatedVehicle = await vehicleRepository.updateById(id, updateData);

  if (!updatedVehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  return updatedVehicle.toPublicJSON();
};

const deleteVehicle = async (id) => {
  await getVehicleOrThrow(id);

  const deletedVehicle = await vehicleRepository.deleteById(id);

  if (!deletedVehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  return deletedVehicle.toPublicJSON();
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  // Business Logic Functions
  checkDuplicateRegistration,
  validateVehicle,
  canDispatchVehicle,
  markVehicleOnTrip,
  restoreVehicle,
  retireVehicle,
};
