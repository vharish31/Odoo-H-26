const authService = require('../services/authService');
const asyncHandler = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user },
  });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { token, user },
  });
});

module.exports = {
  register,
  login,
};
