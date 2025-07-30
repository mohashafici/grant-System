const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/grant-system';
    
    await mongoose.connect(mongoURI);
    
    console.log('Database connected');
    
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    return false;
  }
};

module.exports = connectDB;


