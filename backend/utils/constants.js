const ROLES = Object.freeze({
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
});

const VEHICLE_STATUS = Object.freeze({
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
});

const ROLE_VALUES = Object.values(ROLES);
const VEHICLE_STATUS_VALUES = Object.values(VEHICLE_STATUS);

module.exports = { ROLES, ROLE_VALUES, VEHICLE_STATUS, VEHICLE_STATUS_VALUES };
