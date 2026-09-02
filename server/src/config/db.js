const { Pool } = require('pg');
const config = require('./env');

const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  keepAlive: true,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (config.nodeEnv === 'development') {
    // optional query log
  }
  return res;
}

async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    client.release();
    console.log('✅ Connected to Neon PostgreSQL successfully at:', res.rows[0].current_time);
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to Neon PostgreSQL:', err.message);
    throw err;
  }
}

module.exports = {
  pool,
  query,
  testConnection,
};
