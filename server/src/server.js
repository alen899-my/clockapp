const app = require('./app');
const config = require('./config/env');
const { testConnection } = require('./config/db');
const { runMigrations } = require('./db/migrate');

// Start server and initialize DB (for standalone local development)
async function startServer() {
  try {
    console.log('🚀 Initializing Clock Server...');
    await testConnection();
    await runMigrations();

    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`✨ Server running on http://0.0.0.0:${config.port} (All network interfaces)`);
      console.log(`📱 For mobile development, access via your PC LAN IP: http://<YOUR_LOCAL_IP>:${config.port}`);
      console.log(`🩺 Health check: http://localhost:${config.port}/api/health`);
    });

    // Graceful shutdown
    const shutdown = () => {
      console.log('\n🛑 Shutting down server...');
      server.close(() => {
        console.log('Server shut down cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
