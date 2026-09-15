const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public / Authenticated JSON Summary & Excel Export
router.get('/sections', attendanceController.getSectionAttendanceSummary);
router.get('/export/excel', attendanceController.exportAttendanceExcel);

// Protected Mark Attendance
router.post('/mark', authMiddleware(['Admin', 'Employee']), attendanceController.markSectionAttendance);

module.exports = router;
