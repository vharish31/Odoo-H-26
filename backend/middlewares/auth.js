const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const userRepository = require('../repositories/userRepository');

const protect = asyncHandler(async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Access denied. No token provided', 401);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError('JWT configuration error', 500);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, secret);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await userRepository.findById(decoded.id);

  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new AppError('Access denied', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }

  next();
};

module.exports = { protect, authorize };
