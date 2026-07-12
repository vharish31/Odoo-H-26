const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
