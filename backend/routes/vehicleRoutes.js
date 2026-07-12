const express = require('express');
const { body, param } = require('express-validator');
const vehicleController = require('../controllers/vehicleController');
const validate = require('../middlewares/validate');
const { protect, authorize } = require('../middlewares/auth');
const { ROLES, VEHICLE_STATUS_VALUES } = require('../utils/constants');

const router = express.Router();

const currentYear = new Date().getFullYear();

// Shared field validators for create and update
const vehicleFieldValidators = [
  body('registrationNumber')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('Registration number cannot be empty')
    .isLength({ max: 20 })
    .withMessage('Registration number cannot exceed 20 characters'),
  body('vehicleType')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('Vehicle type cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Vehicle type cannot exceed 50 characters'),
  body('manufacturer')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('Manufacturer cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Manufacturer cannot exceed 50 characters'),
  body('model')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('Model cannot be empty')
    .isLength({ max: 50 })
    .withMessage('Model cannot exceed 50 characters'),
  body('year')
    .optional({ values: 'null' })
    .isInt({ min: 1900, max: currentYear + 1 })
    .withMessage(`Year must be between 1900 and ${currentYear + 1}`),
  body('capacity')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('fuelType')
    .optional({ values: 'null' })
    .trim()
    .notEmpty()
    .withMessage('Fuel type cannot be empty')
    .isLength({ max: 30 })
    .withMessage('Fuel type cannot exceed 30 characters'),
  body('status')
    .optional({ values: 'null' })
    .isIn(VEHICLE_STATUS_VALUES)
    .withMessage(`Status must be one of: ${VEHICLE_STATUS_VALUES.join(', ')}`),
];

const createVehicleValidation = [
  body('registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required')
    .isLength({ max: 20 })
    .withMessage('Registration number cannot exceed 20 characters'),
  body('vehicleType')
    .trim()
    .notEmpty()
    .withMessage('Vehicle type is required')
    .isLength({ max: 50 })
    .withMessage('Vehicle type cannot exceed 50 characters'),
  body('manufacturer')
    .trim()
    .notEmpty()
    .withMessage('Manufacturer is required')
    .isLength({ max: 50 })
    .withMessage('Manufacturer cannot exceed 50 characters'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required')
    .isLength({ max: 50 })
    .withMessage('Model cannot exceed 50 characters'),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1900, max: currentYear + 1 })
    .withMessage(`Year must be between 1900 and ${currentYear + 1}`),
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('fuelType')
    .trim()
    .notEmpty()
    .withMessage('Fuel type is required')
    .isLength({ max: 30 })
    .withMessage('Fuel type cannot exceed 30 characters'),
  body('status')
    .optional()
    .isIn(VEHICLE_STATUS_VALUES)
    .withMessage(`Status must be one of: ${VEHICLE_STATUS_VALUES.join(', ')}`),
];

const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid vehicle ID'),
];

// Fleet Manager role required for all vehicle management operations
router.use(protect, authorize(ROLES.FLEET_MANAGER));

router.post('/', createVehicleValidation, validate, vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', mongoIdValidation, validate, vehicleController.getVehicleById);
router.put('/:id', mongoIdValidation, vehicleFieldValidators, validate, vehicleController.updateVehicle);
router.delete('/:id', mongoIdValidation, validate, vehicleController.deleteVehicle);

module.exports = router;
