const Vehicle = require('../models/Vehicle');

const create = (vehicleData) => Vehicle.create(vehicleData);

const findAll = () => Vehicle.find().sort({ createdAt: -1 });

const findById = (id) => Vehicle.findById(id);

const findByRegistrationNumber = (registrationNumber) =>
  Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });

const updateById = (id, updateData) =>
  Vehicle.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

const deleteById = (id) => Vehicle.findByIdAndDelete(id);

const registrationNumberExists = async (registrationNumber, excludeId = null) => {
  const query = { registrationNumber: registrationNumber.toUpperCase() };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const vehicle = await Vehicle.findOne(query).select('_id');
  return Boolean(vehicle);
};

module.exports = {
  create,
  findAll,
  findById,
  findByRegistrationNumber,
  updateById,
  deleteById,
  registrationNumberExists,
};
