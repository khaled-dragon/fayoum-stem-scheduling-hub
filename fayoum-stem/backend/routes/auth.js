const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { signUp, signIn, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const signUpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { error: 'Too many sign up attempts. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', signUpLimiter, signUp);
router.post('/signin', authLimiter, signIn);
router.get('/me', authenticate, getMe);

module.exports = router;
