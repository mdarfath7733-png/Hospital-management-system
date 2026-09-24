require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const patientRoutes = require('./routes/patientRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Models & Seeder for auto-seed if empty
const User = require('./models/User');
const { seedDatabase } = require('./seed');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Hospital Management System API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start Server after connecting to Database
const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('⚡ Empty database detected. Running initial data seeder...');
      await seedDatabase();
    } else {
      console.log(`ℹ️ Database already contains ${userCount} registered user(s).`);
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Hospital Management Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Graceful shutdown handling
    const shutdown = () => {
      console.log('Shutting down server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
