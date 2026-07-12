const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);

  return conn;
};

const getDatabaseStatus = () => {
  const state = mongoose.connection.readyState;

  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    status: states[state] || 'unknown',
    readyState: state,
    isConnected: state === 1,
  };
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

module.exports = { connectDB, getDatabaseStatus };
