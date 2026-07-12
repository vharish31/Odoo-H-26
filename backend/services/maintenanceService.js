const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const maintenanceRepository = require('../repositories/maintenanceRepository');
const vehicleService = require('./vehicleService');
const { VEHICLE_STATUS, MAINTENANCE_STATUS } = require('../utils/constants');

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid maintenance ID', 400);
  }
};

const getMaintenanceOrThrow = async (id) => {
  assertValidId(id);

  const maintenance = await maintenanceRepository.findById(id);

  if (!maintenance) {
    throw new AppError('Maintenance record not found', 404);
  }

  return maintenance;
};

// Business Logic Functions from TransitOps
const startMaintenance = async (vehicleId, maintenanceData) => {
  const vehicle = await vehicleService.getVehicleById(vehicleId);
  
  if (vehicle.status !== VEHICLE_STATUS.AVAILABLE && vehicle.status !== VEHICLE_STATUS.REQUIRES_MAINTENANCE) {
    throw new AppError('Vehicle must be available or marked for maintenance', 400);
  }
  
  // Mark vehicle as under maintenance
  await vehicleService.updateById(vehicleId, { status: VEHICLE_STATUS.UNDER_MAINTENANCE });
  
  const maintenance = await maintenanceRepository.create({
    ...maintenanceData,
    vehicleId,
    status: MAINTENANCE_STATUS.IN_PROGRESS,
    startDate: new Date(),
  });
  
  return maintenance.toPublicJSON();
};

const completeMaintenance = async (maintenanceId) => {
  const maintenance = await getMaintenanceOrThrow(maintenanceId);
  
  if (maintenance.status !== MAINTENANCE_STATUS.IN_PROGRESS) {
    throw new AppError('Maintenance is not in progress', 400);
  }
  
  // Restore vehicle to available status
  await vehicleService.updateById(maintenance.vehicleId, { status: VEHICLE_STATUS.AVAILABLE });
  
  const updatedMaintenance = await maintenanceRepository.updateById(maintenanceId, {
    status: MAINTENANCE_STATUS.COMPLETED,
    endDate: new Date(),
  });
  
  return updatedMaintenance.toPublicJSON();
};

// CRUD Operations
const createMaintenance = async (maintenanceData) => {
  const { vehicleId } = maintenanceData;
  
  const vehicle = await vehicleService.getVehicleById(vehicleId);
  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }
  
  const maintenance = await maintenanceRepository.create({
    ...maintenanceData,
    status: MAINTENANCE_STATUS.PENDING,
  });

  return maintenance.toPublicJSON();
};

const getAllMaintenance = async () => {
  const maintenanceRecords = await maintenanceRepository.findAll();
  return maintenanceRecords.map((record) => record.toPublicJSON());
};

const getMaintenanceById = async (id) => {
  const maintenance = await getMaintenanceOrThrow(id);
  return maintenance.toPublicJSON();
};

const updateMaintenance = async (id, updateData) => {
  await getMaintenanceOrThrow(id);

  const updatedMaintenance = await maintenanceRepository.updateById(id, updateData);

  if (!updatedMaintenance) {
    throw new AppError('Maintenance record not found', 404);
  }

  return updatedMaintenance.toPublicJSON();
};

const deleteMaintenance = async (id) => {
  await getMaintenanceOrThrow(id);

  const deletedMaintenance = await maintenanceRepository.deleteById(id);

  if (!deletedMaintenance) {
    throw new AppError('Maintenance record not found', 404);
  }

  return deletedMaintenance.toPublicJSON();
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  // Business Logic Functions
  startMaintenance,
  completeMaintenance,
};
