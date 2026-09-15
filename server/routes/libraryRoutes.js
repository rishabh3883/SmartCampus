const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public / General
router.get('/', libraryController.getAllLibraries);
router.get('/seats/:libraryId', libraryController.getLibrarySeats);

// Protected (Student / Any Authenticated User)
router.get('/my-booking', authMiddleware(['Student']), libraryController.getMyBooking);
router.post('/book', authMiddleware(['Student']), libraryController.bookSlot);
router.post('/cancel', authMiddleware(['Student']), libraryController.cancelSlot);
router.post('/seats/scan', authMiddleware(['Student', 'Employee', 'Admin']), libraryController.scanSeat);

// Admin Only
router.post('/', authMiddleware(['Admin']), libraryController.createLibrary);
router.delete('/:id', authMiddleware(['Admin']), libraryController.deleteLibrary);

module.exports = router;
