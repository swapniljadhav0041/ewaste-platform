require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const walletRoutes = require('./routes/walletRoutes');
const offerRoutes = require('./routes/offerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const offerController = require('./controllers/offerController');
const auth = require('./middleware/auth');
const upload = require('./middleware/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Rate limiting for public endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev permissive
    },
    credentials: true,
  })
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'UP',
      timestamp: new Date().toISOString(),
      service: 'VoltCycle E-Waste Platform API',
    },
    error: null,
  });
});

// Upload route for item photos
app.post('/api/uploads', upload.array('photos', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'No files were uploaded',
    });
  }

  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.status(201).json({
    success: true,
    data: {
      urls,
    },
    error: null,
  });
});

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/offers', offerRoutes);
app.get('/api/redemptions/mine', auth, offerController.getMyRedemptions);
app.use('/api/stats', statsRoutes);

// Root API route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Welcome to VoltCycle API',
      version: '1.0.0',
      routes: [
        '/api/health',
        '/api/auth',
        '/api/categories',
        '/api/submissions',
        '/api/wallet',
        '/api/offers',
        '/api/stats',
      ],
    },
    error: null,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server if not imported as module
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`⚡ VoltCycle API Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api`);
  });
}

module.exports = app;
