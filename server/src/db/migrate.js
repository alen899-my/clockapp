const fs = require('fs');
const path = require('path');
const { query } = require('../config/db');

async function runMigrations() {
  try {
    // 1. Ensure user_id column exists on existing timeline_items table if it was created before
    await query(`
      ALTER TABLE timeline_items 
      ADD COLUMN IF NOT EXISTS user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE;
    `).catch(() => {
      // Ignore if table doesn't exist yet (schema.sql will create it)
    });

    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await query(sql);

    console.log('✅ Database schema and tables verified/migrated successfully.');
  } catch (err) {
    console.error('❌ Failed to run database migrations:', err.message);
    throw err;
  }
}

module.exports = {
  runMigrations,
};
