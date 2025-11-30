// backend/src/models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ['REGISTER', 'RESET'], required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Otp', otpSchema);
