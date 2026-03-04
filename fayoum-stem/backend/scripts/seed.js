require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const { pool, initializeDatabase } = require('../models/db');

const seedAdmin = async () => {
  try {
    await initializeDatabase();

    const email = 'kwael6774@gmail.com';
    const plainPassword = '612009KH-e';
    const saltRounds = 12;

    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    const result = await pool.query(`
      INSERT INTO admins (email, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET password_hash = $2
      RETURNING id, email;
    `, [email, passwordHash]);

    console.log('✅ Admin seeded successfully:', result.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedAdmin();
