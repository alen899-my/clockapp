const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5005', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'clock_app_jwt_super_secret_key_2026_neon',
};

if (!config.databaseUrl) {
  console.warn('⚠️ WARNING: DATABASE_URL is not defined in environment variables.');
}

module.exports = config;
