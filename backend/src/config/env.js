// backend/src/config/env.js
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '.env'),
});

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  MONGODB_URI: process.env.MONGODB_URI,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};
