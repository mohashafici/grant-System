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
app.use(cors());
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
// Future: app.use('/api/reviews', require('./routes/reviewRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;
