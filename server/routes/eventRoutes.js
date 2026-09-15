const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public
router.get('/', eventController.getAllEvents);

// Protected (Admin / Staff / Security)
router.post('/', authMiddleware(['Admin']), eventController.createEvent);
router.delete('/:eventId', authMiddleware(['Admin']), eventController.deleteEvent);
router.get('/:eventId/attendees', authMiddleware(['Admin', 'Employee', 'Security']), eventController.getEventAttendees);
router.get('/:eventId/reports', authMiddleware(['Admin', 'Employee', 'Security']), eventController.getEventReports);
router.post('/verify-entry', authMiddleware(['Admin', 'Employee', 'Security']), eventController.verifyEntry);

// Protected (Student/Staff)
router.post('/book', authMiddleware(['Student', 'Employee', 'Admin', 'Security']), eventController.bookEvent);
router.get('/my-bookings', authMiddleware(['Student', 'Employee', 'Admin', 'Security']), eventController.getMyBookings);

module.exports = router;
