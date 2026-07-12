const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const tripRepository = require('../repositories/tripRepository');
const vehicleService = require('./vehicleService');
const driverService = require('./driverService');
const { TRIP_STATUS, VEHICLE_STATUS, DRIVER_STATUS } = require('../utils/constants');

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid ID', 400);
  }
};

// Business Logic Functions from TransitOps
const validateCargoWeight = (vehicle, cargoWeight) => {
  if (!vehicle || !vehicle.capacity) {
    throw new AppError('Vehicle capacity not found', 400);
  }
  if (cargoWeight > vehicle.capacity) {
    throw new AppError(`Cargo weight (${cargoWeight} tons) exceeds vehicle capacity (${vehicle.capacity} tons)`, 400);
  }
  return true;
};

const validateTrip = async (driverId, vehicleId, cargoWeight) => {
  const driver = await driverService.getDriverById(driverId);
  const vehicle = await vehicleService.getVehicleById(vehicleId);
  
  if (!driverService.canAssignDriver(driver)) {
    throw new AppError('Driver is not available for assignment', 400);
  }
  
  if (!vehicleService.canDispatchVehicle(vehicle)) {
    throw new AppError('Vehicle is not available for dispatch', 400);
  }
  
  validateCargoWeight(vehicle, cargoWeight);
  
  return true;
};

const validateStatusTransition = (currentStatus, nextStatus) => {
  const validTransitions = {
    [TRIP_STATUS.PENDING]: [TRIP_STATUS.IN_PROGRESS, TRIP_STATUS.CANCELLED],
    [TRIP_STATUS.IN_PROGRESS]: [TRIP_STATUS.COMPLETED, TRIP_STATUS.CANCELLED],
    [TRIP_STATUS.COMPLETED]: [],
    [TRIP_STATUS.CANCELLED]: [],
  };
  
  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new AppError(`Cannot transition from ${currentStatus} to ${nextStatus}`, 400);
  }
  
  return true;
};

const dispatchTrip = async (tripId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }
  
  validateStatusTransition(trip.status, TRIP_STATUS.IN_PROGRESS);
  
  // Mark vehicle and driver as on trip
  await vehicleService.markVehicleOnTrip(trip.vehicleId);
  await driverService.markDriverOnTrip(trip.driverId);
  
  return await tripRepository.updateById(tripId, { 
    status: TRIP_STATUS.IN_PROGRESS,
    startTime: new Date()
  });
};

const completeTrip = async (tripId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }
  
  validateStatusTransition(trip.status, TRIP_STATUS.COMPLETED);
  
  // Restore vehicle and driver availability
  await vehicleService.restoreVehicle(trip.vehicleId);
  await driverService.restoreDriver(trip.driverId);
  
  return await tripRepository.updateById(tripId, { 
    status: TRIP_STATUS.COMPLETED,
    endTime: new Date()
  });
};

const cancelTrip = async (tripId) => {
  const trip = await tripRepository.findById(tripId);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }
  
  validateStatusTransition(trip.status, TRIP_STATUS.CANCELLED);
  
  // Restore vehicle and driver availability if they were marked on trip
  if (trip.status === TRIP_STATUS.IN_PROGRESS) {
    await vehicleService.restoreVehicle(trip.vehicleId);
    await driverService.restoreDriver(trip.driverId);
  }
  
  return await tripRepository.updateById(tripId, { 
    status: TRIP_STATUS.CANCELLED,
    endTime: new Date()
  });
};

// CRUD Operations
const createTrip = async (tripData) => {
  const { driverId, vehicleId, cargoWeight } = tripData;
  
  await validateTrip(driverId, vehicleId, cargoWeight);
  
  const trip = await tripRepository.create({
    ...tripData,
    status: TRIP_STATUS.PENDING,
  });

  return trip.toPublicJSON();
};

const getAllTrips = async () => {
  const trips = await tripRepository.findAll();
  return trips.map((trip) => trip.toPublicJSON());
};

const getTripById = async (id) => {
  assertValidId(id);
  const trip = await tripRepository.findById(id);
  
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }
  
  return trip.toPublicJSON();
};

const updateTrip = async (id, updateData) => {
  assertValidId(id);
  
  const trip = await tripRepository.findById(id);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }
  
  if (updateData.status) {
    validateStatusTransition(trip.status, updateData.status);
  }
  
  const updatedTrip = await tripRepository.updateById(id, updateData);

  if (!updatedTrip) {
    throw new AppError('Trip not found', 404);
  }

  return updatedTrip.toPublicJSON();
};

const deleteTrip = async (id) => {
  assertValidId(id);
  
  const trip = await tripRepository.findById(id);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }
  
  // Restore resources if trip was in progress
  if (trip.status === TRIP_STATUS.IN_PROGRESS) {
    await vehicleService.restoreVehicle(trip.vehicleId);
    await driverService.restoreDriver(trip.driverId);
  }

  const deletedTrip = await tripRepository.deleteById(id);

  if (!deletedTrip) {
    throw new AppError('Trip not found', 404);
  }

  return deletedTrip.toPublicJSON();
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  // Business Logic Functions
  validateCargoWeight,
  validateTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  validateStatusTransition,
};
