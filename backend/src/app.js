const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const analyzerRoutes = require('./routes/analyzerRoutes');

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
  })
);

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Routes
app.use('/api', analyzerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

module.exports = app;
