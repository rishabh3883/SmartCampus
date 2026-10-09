const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const authMiddleware = require('../middlewares/authMiddleware');

const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');

// Public / General
router.get('/', libraryController.getAllLibraries);
router.get('/seats/:libraryId', libraryController.getLibrarySeats);
router.get('/seat-info/:seatCode', libraryController.getSeatByCode);
router.post('/seats/scan', optionalAuthMiddleware, libraryController.scanSeat);

// Student Slot Booking Routes
router.get('/my-booking', authMiddleware(['Student']), libraryController.getMyBooking);
router.post('/book', authMiddleware(['Student']), libraryController.bookSlot);
router.post('/cancel', authMiddleware(['Student']), libraryController.cancelSlot);

// Admin Only
router.post('/', authMiddleware(['Admin']), libraryController.createLibrary);
router.delete('/:id', authMiddleware(['Admin']), libraryController.deleteLibrary);

module.exports = router;
