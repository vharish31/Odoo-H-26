const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const vehicleRepository = require('../repositories/vehicleRepository');

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

const createVehicle = async (vehicleData) => {
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
};
