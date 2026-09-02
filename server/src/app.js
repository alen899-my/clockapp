const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Feature routes
const timelineRoutes = require('./features/timeline/timeline.routes');
const authRoutes = require('./features/auth/auth.routes');

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow mobile apps, curl, or requests with no origin
    if (!origin || config.corsOrigin === '*') return callback(null, true);
    const allowed = config.corsOrigin.split(',').map((s) => s.trim());
    if (allowed.includes(origin) || allowed.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Clock App API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      timeline: '/api/timeline',
    },
  });
});

// Health check endpoint (for Vercel deployment, monitoring & previews)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    service: 'clock-api',
  });
});

// Feature APIs
app.use('/api/auth', authRoutes);
app.use('/api/timeline', timelineRoutes);

// Catch-all 404 & error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
