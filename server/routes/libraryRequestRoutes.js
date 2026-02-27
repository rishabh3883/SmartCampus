const express = require('express');
const router = express.Router();
const requestController = require('../controllers/libraryRequestController');
const authMiddleware = require('../middlewares/authMiddleware');

// Student Routes
router.post('/', authMiddleware(['Student', 'Employee', 'Faculty']), requestController.createRequest);
router.get('/my-requests', authMiddleware(['Student', 'Employee', 'Faculty']), requestController.getMyRequests);

// Admin Routes
router.get('/all', authMiddleware(['Admin', 'Librarian']), requestController.getAllRequests);
router.put('/:id', authMiddleware(['Admin', 'Librarian']), requestController.updateRequestStatus);
router.delete('/:id', authMiddleware(['Admin']), requestController.deleteRequest);

module.exports = router;
