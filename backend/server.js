require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB, getDatabaseStatus } = require('./config/database');

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req, res) => {
  const db = getDatabaseStatus();

  const payload = {
    status: db.isConnected ? 'ok' : 'degraded',
    service: 'transport-management-api',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    database: db,
  };

  res.status(db.isConnected ? 200 : 503).json(payload);
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: isProduction ? 'Internal server error' : err.message,
  });
});

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (!server) {
    process.exit(0);
    return;
  }

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

startServer();

module.exports = app;
