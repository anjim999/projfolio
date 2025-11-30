// backend/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { generateOtp, getExpiry } = require('../utils/otp');
const { JWT_SECRET, GOOGLE_CLIENT_ID } = require('../config/env');
const { sendOtpEmail } = require('../utils/mailer');
const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');
const Otp = require('../models/Otp');

const router = express.Router();

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation error:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const normalizeEmail = (email) => email.trim().toLowerCase();

router.post('/register-request-otp', async (req, res) => {
  try {
    const rawEmail = req.body.email || '';
    const email = normalizeEmail(rawEmail);

    const code = generateOtp();
    const expiresAt = getExpiry(10); 
    await Otp.create({
      email,
      code,
      purpose: 'REGISTER',
      expiresAt,
      used: false,
    });

    const mailResult = await sendOtpEmail({
      to: email,
      otp: code,
      purpose: 'REGISTER',
    });

    if (!mailResult.success) {
      console.warn('OTP email not delivered (Brevo issue). OTP is logged on server only.');
    }

    return res.json({
      message:
        "OTP generated. If email doesn't arrive, use the OTP from server logs.",
      devOtp: process.env.NODE_ENV !== 'production' ? code : undefined,
    });
  } catch (err) {
    console.error('Error in /register-request-otp:', err);
    return res.status(500).json({ message: 'Failed to generate OTP' });
  }
});

router.post(
  '/register-verify',
  validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail(),
    body('otp').isLength({ min: 4 }),
    body('password').isLength({ min: 6 }),
  ]),
  async (req, res) => {
    try {
      const { name, email: rawEmail, otp, password } = req.body;
      const email = normalizeEmail(rawEmail);

      const otpRow = await Otp.findOne({
        email,
        code: otp,
        purpose: 'REGISTER',
        used: false,
      });

      if (!otpRow) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (otpRow.expiresAt < new Date()) {
        return res.status(400).json({ message: 'OTP expired' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const hashed = bcrypt.hashSync(password, 10);

      const userDoc = await User.create({
        name,
        email,
        password: hashed,
        role: 'user',
        isVerified: true,
      });

      otpRow.used = true;
      await otpRow.save();

      const token = jwt.sign(
        {
          userId: userDoc._id.toString(),
          email: userDoc.email,
          name: userDoc.name,
          role: userDoc.role,
        },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({
        message: 'Registration successful',
        token,
        user: { id: userDoc._id, name: userDoc.name, email: userDoc.email, role: userDoc.role },
      });
    } catch (err) {
      console.error('Error in /register-verify:', err);
      return res.status(500).json({ message: 'DB error' });
    }
  }
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  async (req, res) => {
    try {
      const rawEmail = req.body.email || '';
      const email = normalizeEmail(rawEmail);
      const { password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        console.warn('Login failed: user not found for', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const ok = bcrypt.compareSync(password, user.password);
      if (!ok) {
        console.warn('Login failed: wrong password for', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      console.log('Login successful for', email);
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
        },
      });
    } catch (err) {
      console.error('Error in /login:', err);
      return res.status(500).json({ message: 'DB error' });
    }
  }
);

router.post(
  '/forgot-password-request',
  validate([body('email').isEmail()]),
  async (req, res) => {
    try {
      const rawEmail = req.body.email || '';
      const email = normalizeEmail(rawEmail);

      const user = await User.findOne({ email });
      if (!user) {
        console.warn('Forgot password requested for non-existing email:', email);
        return res.json({
          message:
            'If the email exists, an OTP has been sent to reset the password',
        });
      }

      const code = generateOtp();
      const expiresAt = getExpiry(10);

      await Otp.create({
        email,
        code,
        purpose: 'RESET',
        expiresAt,
        used: false,
      });

      await sendOtpEmail({ to: email, otp: code, purpose: 'RESET' });
      console.log('Reset OTP for', email, '=>', code);

      return res.json({
        message:
          'If the email exists, an OTP has been sent to reset the password',
      });
    } catch (err) {
      console.error('Error in /forgot-password-request:', err);
      return res.status(500).json({ message: 'DB error' });
    }
  }
);

router.post(
  '/forgot-password-verify',
  validate([
    body('email').isEmail(),
    body('otp').isLength({ min: 4 }),
    body('newPassword').isLength({ min: 6 }),
  ]),
  async (req, res) => {
    try {
      const { email: rawEmail, otp, newPassword } = req.body;
      const email = normalizeEmail(rawEmail);

      const otpRow = await Otp.findOne({
        email,
        code: otp,
        purpose: 'RESET',
        used: false,
      });

      if (!otpRow) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (otpRow.expiresAt < new Date()) {
        return res.status(400).json({ message: 'OTP expired' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        console.warn('Password reset attempted for non-existing email:', email);
        return res.status(400).json({ message: 'User not found for this email' });
      }

      const hashed = bcrypt.hashSync(newPassword, 10);
      user.password = hashed;
      await user.save();

      otpRow.used = true;
      await otpRow.save();

      console.log('Password reset successful for', email);
      return res.json({ message: 'Password reset successful' });
    } catch (err) {
      console.error('Error in /forgot-password-verify:', err);
      return res.status(500).json({ message: 'DB error' });
    }
  }
);

router.post('/google', async (req, res) => {
  try {
    const { idToken, credential } = req.body || {};
    const token = idToken || credential;

    if (!token) {
      return res.status(400).json({ message: 'idToken (or credential) is required' });
    }

    if (!googleClient || !GOOGLE_CLIENT_ID) {
      console.error('Google auth not configured on server.');
      return res
        .status(500)
        .json({ message: 'Google login is not configured on server.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const rawEmail = payload.email || '';
    const email = normalizeEmail(rawEmail);
    const name = payload.name || email;
    const avatar = payload.picture || null;

    if (!email) {
      return res
        .status(400)
        .json({ message: 'Google account does not have a valid email.' });
    }

    let user = await User.findOne({ email });

    if (user) {
      const role = user.role || 'user';

      const jwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role,
      };

      const jwtToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '1d' });

      console.log('Google login successful for existing user:', email);

      return res.json({
        message: 'Login successful',
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role,
          avatar: user.avatar || avatar || null,
        },
      });
    }

    const role = 'user';

    const dummyPassword = bcrypt.hashSync(googleId + JWT_SECRET, 10);

    user = await User.create({
      name,
      email,
      password: dummyPassword,
      role,
      isVerified: true,
      googleId,
      avatar,
    });

    const jwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role,
    };

    const jwtToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '1d' });

    console.log('Google login created new user:', email);

    return res.json({
      message: 'Login successful',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
        avatar,
      },
    });
  } catch (err) {
    console.error('Error in /api/auth/google:', err);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
});

module.exports = router;
