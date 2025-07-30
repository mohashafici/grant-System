const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-secret-key-here-for-development';
}

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();