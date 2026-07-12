const mongoose = require('mongoose');
const { VEHICLE_STATUS, VEHICLE_STATUS_VALUES } = require('../utils/constants');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Registration number cannot exceed 20 characters'],
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      trim: true,
      maxlength: [50, 'Vehicle type cannot exceed 50 characters'],
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
      maxlength: [50, 'Manufacturer cannot exceed 50 characters'],
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
      maxlength: [50, 'Model cannot exceed 50 characters'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be 1900 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      trim: true,
      maxlength: [30, 'Fuel type cannot exceed 30 characters'],
    },
    status: {
      type: String,
      enum: {
        values: VEHICLE_STATUS_VALUES,
        message: 'Status must be one of: {VALUE}',
      },
      default: VEHICLE_STATUS.AVAILABLE,
    },
  },
  {
    timestamps: true,
  }
);

// Normalize API responses and hide internal MongoDB fields
vehicleSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    registrationNumber: this.registrationNumber,
    vehicleType: this.vehicleType,
    manufacturer: this.manufacturer,
    model: this.model,
    year: this.year,
    capacity: this.capacity,
    fuelType: this.fuelType,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
