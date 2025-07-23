const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const announcementRoutes = require('./routes/announcementRoutes');
const communityRoutes = require('./routes/communityRoutes');

dotenv.config();

const app = express();

// Middleware
// Production-ready CORS configuration
const allowedOrigins = [
  'http://localhost:3000', // For local development
  process.env.FRONTEND_URL, // Your deployed frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/grants', require('./routes/grantRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/announcements', announcementRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/contact', require('./routes/contactRoutes'));
// Future: app.use('/api/reviews', require('./routes/reviewRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;
