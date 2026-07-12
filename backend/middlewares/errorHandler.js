const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0];

    const duplicateMessages = {
      email: 'Email is already registered',
      registrationNumber: 'Registration number already exists',
    };

    return res.status(409).json({
      success: false,
      message: duplicateMessages[duplicateField] || 'Duplicate field value',
    });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
    });
  }

  if (statusCode >= 500) {
    console.error('Unhandled error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode >= 500 ? 'Internal server error' : err.message,
  });
};

module.exports = errorHandler;
