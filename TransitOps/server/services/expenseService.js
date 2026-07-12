/*startMaintenance(vehicle)

completeMaintenance(vehicle)
*/
/**
 * server/services/expenseService.js
 * ----------------------------------------
 * Business Logic Layer for Expense management in TransitOps.
 *
 * Responsibilities:
 *  - Validate expense data before persistence
 *  - Calculate fuel-related expense totals
 *
 * NOTE: Expense Mongoose model is assumed to already exist.
 * ----------------------------------------
 */

const Expense = require("../models/Expense");
const { isEmpty, isPositiveNumber } = require("../utils/validator");

/**
 * Validates core expense fields before creation.
 * Business Rule: Expense amount must be greater than zero.
 */
function validateExpense(expense) {
  if (isEmpty(expense)) {
    return {
      success: false,
      message: "Expense data is required.",
    };
  }

  if (!isPositiveNumber(expense.amount)) {
    return {
      success: false,
      message: "Expense amount must be a positive number.",
    };
  }

  return {
    success: true,
    message: "Expense data is valid.",
    data: expense,
  };
}

/**
 * Calculates the total fuel expense.
 * Business Rule: Fuel cost = litres × pricePerLitre.
 */
function calculateFuelExpense(litres, pricePerLitre) {
  if (!isPositiveNumber(litres)) {
    return {
      success: false,
      message: "Litres must be a positive number.",
    };
  }

  if (!isPositiveNumber(pricePerLitre)) {
    return {
      success: false,
      message: "Price per litre must be a positive number.",
    };
  }

  const total = litres * pricePerLitre;

  return {
    success: true,
    message: "Fuel expense calculated successfully.",
    data: total,
  };
}

module.exports = {
  validateExpense,
  calculateFuelExpense,
};