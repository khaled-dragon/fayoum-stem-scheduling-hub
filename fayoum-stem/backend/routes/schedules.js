const express = require('express');
const router = express.Router();
const { getAllSchedules, getScheduleByClass, uploadSchedule } = require('../controllers/scheduleController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public read routes (require authentication)
router.get('/', authenticate, getAllSchedules);
router.get('/:className', authenticate, getScheduleByClass);

// Admin only upload route
router.post('/upload', authenticate, requireAdmin, upload.single('schedule_image'), uploadSchedule);

module.exports = router;
