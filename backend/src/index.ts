// ========================================
// E-petitpas AI School - Main Application
// ========================================

import express from 'express';
import dotenv from 'dotenv';
import { configureMiddleware, errorHandler, notFoundHandler } from './middleware';
import { testDatabaseConnection } from './database';
import { ResponseUtil } from './utils/response';

// Import routes
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ===============================
// MIDDLEWARE CONFIGURATION
// ===============================

configureMiddleware(app);

// ===============================
// HEALTH CHECK ROUTES
// ===============================

/**
 * GET /
 * Basic health check
 */
app.get('/', (req, res) => {
  ResponseUtil.success(res, {
    service: 'E-petitpas AI School API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  }, 'API is running');
});

/**
 * GET /health
 * Detailed health check
 */
app.get('/health', async (req, res) => {
  const healthCheck = {
    service: 'E-petitpas AI School API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'checking...',
      memory: process.memoryUsage(),
      uptime: process.uptime()
    }
  };

  try {
    const dbConnected = await testDatabaseConnection();
    healthCheck.checks.database = dbConnected ? 'connected' : 'disconnected';
    
    const statusCode = dbConnected ? 200 : 503;
    const message = dbConnected ? 'All systems operational' : 'Database connection failed';
    
    res.status(statusCode).json({
      success: dbConnected,
      data: healthCheck,
      message
    });
  } catch (error) {
    healthCheck.checks.database = 'error';
    ResponseUtil.error(res, 'Health check failed', 503);
  }
});

// ===============================
// API ROUTES
// ===============================

// API version prefix
const API_PREFIX = '/api/v1';

// User management routes
app.use(`${API_PREFIX}/users`, userRoutes);

// TODO: Add more routes
// app.use(`${API_PREFIX}/questions`, questionRoutes);
// app.use(`${API_PREFIX}/subscriptions`, subscriptionRoutes);
// app.use(`${API_PREFIX}/admin`, adminRoutes);

// ===============================
// ERROR HANDLING
// ===============================

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ===============================
// SERVER STARTUP
// ===============================

async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log('\n🚀 E-petitpas AI School API Started Successfully!');
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🔍 Health: http://localhost:${PORT}/health`);
      console.log(`📚 API: http://localhost:${PORT}${API_PREFIX}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('─'.repeat(50));
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n📴 Received ${signal}, shutting down gracefully...`);
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Close database connection
        import('./database').then(({ disconnectDatabase }) => {
          disconnectDatabase().then(() => {
            console.log('✅ Database connection closed');
            process.exit(0);
          });
        });
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export default app;