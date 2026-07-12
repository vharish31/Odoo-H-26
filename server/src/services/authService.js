const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/helpers');
const userRepository = require('../repositories/userRepository');

const SALT_ROUNDS = 12;

const register = async ({ name, email, password, role }) => {
  const duplicate = await userRepository.emailExists(email);

  if (duplicate) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user.toPublicJSON();
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email, true);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  return {
    token,
    user: user.toPublicJSON(),
  };
};

module.exports = {
  register,
  login,
};
