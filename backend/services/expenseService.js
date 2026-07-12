const mongoose = require('mongoose');
const AppError = require('../utils/AppError');
const expenseRepository = require('../repositories/expenseRepository');

const assertValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid expense ID', 400);
  }
};

const getExpenseOrThrow = async (id) => {
  assertValidId(id);

  const expense = await expenseRepository.findById(id);

  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  return expense;
};

// Business Logic Functions from TransitOps
const validateExpense = (expenseData) => {
  const { type, amount, vehicleId, description } = expenseData;
  
  if (!type || type.trim().length === 0) {
    throw new AppError('Expense type is required', 400);
  }
  if (!amount || amount <= 0) {
    throw new AppError('Amount must be greater than 0', 400);
  }
  if (!vehicleId) {
    throw new AppError('Vehicle ID is required', 400);
  }
  if (!description || description.trim().length === 0) {
    throw new AppError('Description is required', 400);
  }
  
  return true;
};

const calculateFuelExpense = (litres, pricePerLitre) => {
  if (!litres || litres <= 0) {
    throw new AppError('Litres must be greater than 0', 400);
  }
  if (!pricePerLitre || pricePerLitre <= 0) {
    throw new AppError('Price per litre must be greater than 0', 400);
  }
  
  return litres * pricePerLitre;
};

// CRUD Operations
const createExpense = async (expenseData) => {
  validateExpense(expenseData);
  
  // If it's a fuel expense, calculate the amount if not provided
  if (expenseData.type === 'fuel' && expenseData.litres && expenseData.pricePerLitre && !expenseData.amount) {
    expenseData.amount = calculateFuelExpense(expenseData.litres, expenseData.pricePerLitre);
  }
  
  const expense = await expenseRepository.create({
    ...expenseData,
    date: expenseData.date || new Date(),
  });

  return expense.toPublicJSON();
};

const getAllExpenses = async () => {
  const expenses = await expenseRepository.findAll();
  return expenses.map((expense) => expense.toPublicJSON());
};

const getExpenseById = async (id) => {
  const expense = await getExpenseOrThrow(id);
  return expense.toPublicJSON();
};

const getExpensesByVehicle = async (vehicleId) => {
  assertValidId(vehicleId);
  const expenses = await expenseRepository.findByVehicleId(vehicleId);
  return expenses.map((expense) => expense.toPublicJSON());
};

const getExpensesByDateRange = async (startDate, endDate) => {
  const expenses = await expenseRepository.findByDateRange(startDate, endDate);
  return expenses.map((expense) => expense.toPublicJSON());
};

const updateExpense = async (id, updateData) => {
  await getExpenseOrThrow(id);

  // If updating fuel-related fields, recalculate amount
  if (updateData.type === 'fuel' && updateData.litres && updateData.pricePerLitre) {
    updateData.amount = calculateFuelExpense(updateData.litres, updateData.pricePerLitre);
  }

  const updatedExpense = await expenseRepository.updateById(id, updateData);

  if (!updatedExpense) {
    throw new AppError('Expense not found', 404);
  }

  return updatedExpense.toPublicJSON();
};

const deleteExpense = async (id) => {
  await getExpenseOrThrow(id);

  const deletedExpense = await expenseRepository.deleteById(id);

  if (!deletedExpense) {
    throw new AppError('Expense not found', 404);
  }

  return deletedExpense.toPublicJSON();
};

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  getExpensesByVehicle,
  getExpensesByDateRange,
  updateExpense,
  deleteExpense,
  // Business Logic Functions
  validateExpense,
  calculateFuelExpense,
};
