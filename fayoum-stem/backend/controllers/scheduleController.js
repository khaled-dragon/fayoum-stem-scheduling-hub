const { pool } = require('../models/db');
const path = require('path');
const fs = require('fs');

const VALID_CLASSES = ['G10 A', 'G10 B', 'G10 C', 'G11 A', 'G11 B', 'G11 C', 'G12 A', 'G12 B'];

const getAllSchedules = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, class_name, image_url, updated_at
      FROM schedules
      ORDER BY class_name ASC
    `);

    const schedules = result.rows.map(s => ({
      ...s,
      image_url: s.image_url ? `/uploads/${path.basename(s.image_url)}` : null,
    }));

    return res.json({ schedules });
  } catch (err) {
    console.error('GetAllSchedules error:', err);
    return res.status(500).json({ error: 'Failed to fetch schedules.' });
  }
};

const getScheduleByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const decodedClass = decodeURIComponent(className);

    if (!VALID_CLASSES.includes(decodedClass)) {
      return res.status(400).json({ error: 'Invalid class name.' });
    }

    const result = await pool.query(`
      SELECT id, class_name, image_url, updated_by, updated_at
      FROM schedules
      WHERE class_name = $1
    `, [decodedClass]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule not found.' });
    }

    const schedule = result.rows[0];
    return res.json({
      schedule: {
        ...schedule,
        image_url: schedule.image_url ? `/uploads/${path.basename(schedule.image_url)}` : null,
      },
    });
  } catch (err) {
    console.error('GetScheduleByClass error:', err);
    return res.status(500).json({ error: 'Failed to fetch schedule.' });
  }
};

const uploadSchedule = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const { class_name } = req.body;

    if (!class_name || !VALID_CLASSES.includes(class_name)) {
      // Delete uploaded file if class is invalid
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Invalid or missing class name.' });
    }

    // Get old schedule to delete old file
    const oldSchedule = await pool.query(
      'SELECT image_url FROM schedules WHERE class_name = $1',
      [class_name]
    );

    if (oldSchedule.rows.length > 0 && oldSchedule.rows[0].image_url) {
      const oldPath = oldSchedule.rows[0].image_url;
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('Could not delete old file:', e.message);
        }
      }
    }

    const result = await pool.query(`
      UPDATE schedules
      SET image_url = $1, updated_by = $2, updated_at = NOW()
      WHERE class_name = $3
      RETURNING id, class_name, updated_at
    `, [req.file.path, req.user.userId, class_name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule record not found.' });
    }

    const schedule = result.rows[0];
    return res.status(200).json({
      message: 'Schedule uploaded successfully.',
      schedule: {
        ...schedule,
        image_url: `/uploads/${path.basename(req.file.path)}`,
      },
    });
  } catch (err) {
    console.error('UploadSchedule error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: 'Failed to upload schedule.' });
  }
};

module.exports = { getAllSchedules, getScheduleByClass, uploadSchedule };
