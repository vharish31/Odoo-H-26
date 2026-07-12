const vehicleService = require('../services/vehicleService');
const asyncHandler = require('../utils/response');

const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: { vehicle },
  });
});

const getAllVehicles = asyncHandler(async (_req, res) => {
  const vehicles = await vehicleService.getAllVehicles();

  res.status(200).json({
    success: true,
    message: 'Vehicles retrieved successfully',
    data: { vehicles, count: vehicles.length },
  });
});

const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Vehicle retrieved successfully',
    data: { vehicle },
  });
});

const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Vehicle updated successfully',
    data: { vehicle },
  });
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.deleteVehicle(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Vehicle deleted successfully',
    data: { vehicle },
  });
});

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
