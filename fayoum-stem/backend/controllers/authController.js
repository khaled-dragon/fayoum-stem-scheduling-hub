const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../models/db');

const SALT_ROUNDS = 12;

const VALID_CLASSES = ['G10 A', 'G10 B', 'G10 C', 'G11 A', 'G11 B', 'G11 C', 'G12 A', 'G12 B'];

const signUp = async (req, res) => {
  try {
    const { name, email, phone, class_name, password } = req.body;

    // Validation
    if (!name || !email || !password || !class_name) {
      return res.status(400).json({ error: 'Name, email, class, and password are required.' });
    }

    if (!VALID_CLASSES.includes(class_name)) {
      return res.status(400).json({ error: 'Invalid class selection.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists in users or admins
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const existingAdmin = await pool.query('SELECT id FROM admins WHERE email = $1', [email.toLowerCase()]);
    if (existingAdmin.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(`
      INSERT INTO users (name, email, phone, class_name, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, class_name, created_at
    `, [name.trim(), email.toLowerCase().trim(), phone?.trim() || null, class_name, passwordHash]);

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        class_name: user.class_name,
        role: 'student',
      },
    });
  } catch (err) {
    console.error('SignUp error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check admins table first
    const adminResult = await pool.query('SELECT * FROM admins WHERE email = $1', [normalizedEmail]);

    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      const isValid = await bcrypt.compare(password, admin.password_hash);

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { userId: admin.id, email: admin.email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.status(200).json({
        message: 'Signed in successfully.',
        token,
        user: {
          id: admin.id,
          email: admin.email,
          role: 'admin',
          name: 'Administrator',
        },
      });
    }

    // Check users table
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = userResult.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        class_name: user.class_name,
        role: 'student',
      },
    });
  } catch (err) {
    console.error('SignIn error:', err);
    return res.status(500).json({ error: 'Internal server error. Please try again.' });
  }
};

const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query('SELECT id, email FROM admins WHERE id = $1', [req.user.userId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.json({ ...result.rows[0], role: 'admin', name: 'Administrator' });
    }

    const result = await pool.query(
      'SELECT id, name, email, phone, class_name, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ ...result.rows[0], role: 'student' });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { signUp, signIn, getMe };
