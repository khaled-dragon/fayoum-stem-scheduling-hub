const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        class_name TEXT,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        class_name TEXT UNIQUE NOT NULL,
        image_url TEXT,
        updated_by UUID,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed schedule rows for all classes if not exists
    const classes = ['G10 A', 'G10 B', 'G10 C', 'G11 A', 'G11 B', 'G11 C', 'G12 A', 'G12 B'];
    for (const cls of classes) {
      await client.query(`
        INSERT INTO schedules (class_name)
        VALUES ($1)
        ON CONFLICT (class_name) DO NOTHING;
      `, [cls]);
    }

    await client.query('COMMIT');
    console.log('✅ Database initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };
