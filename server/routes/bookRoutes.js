const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public / Authenticated Routes
router.get('/', authMiddleware(['Admin', 'Student', 'Employee', 'Security']), bookController.getAllBooks);

// Protected Admin Routes
router.post('/', authMiddleware(['Admin']), bookController.addBook);
router.put('/:id', authMiddleware(['Admin']), bookController.updateBook);
router.delete('/:id', authMiddleware(['Admin']), bookController.deleteBook);

module.exports = router;
