// backend/src/config/db.js
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'ai_project_folio',
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDB;
