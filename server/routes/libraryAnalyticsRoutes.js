const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/libraryAnalyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/dashboard', authMiddleware(['Admin', 'Librarian']), analyticsController.getDashboardStats);

module.exports = router;
