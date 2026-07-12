require('dotenv').config();

const connectDB = require('./src/config/env');
const app = require('./src/app');

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`TransitOps server running on port ${PORT}`);
  });
};

startServer();
