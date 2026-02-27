const express = require('express');
const router = express.Router();
const digitalResourceController = require('../controllers/digitalResourceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all resources
router.get('/', authMiddleware(['Admin', 'Student', 'Employee']), digitalResourceController.getResources);

// Add a new resource
router.post('/', authMiddleware(['Admin', 'Librarian']), digitalResourceController.addResource);

// Delete a resource
router.delete('/:id', authMiddleware(['Admin', 'Librarian']), digitalResourceController.deleteResource);

// Increment downloads
router.post('/:id/download', authMiddleware(['Admin', 'Student', 'Employee']), digitalResourceController.incrementDownload);

module.exports = router;
