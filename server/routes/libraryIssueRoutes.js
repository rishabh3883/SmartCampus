const express = require('express');
const router = express.Router();
const libraryIssueController = require('../controllers/libraryIssueController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all issues (Admin)
router.get('/all', authMiddleware(['Admin', 'Librarian']), libraryIssueController.getAllIssues);

// Get my issues (Student/Employee)
router.get('/my-issues', authMiddleware(['Admin', 'Student', 'Employee']), libraryIssueController.getMyIssues);

// Issue a book (Admin)
router.post('/issue', authMiddleware(['Admin', 'Librarian']), libraryIssueController.issueBook);

// Return a book (Admin)
router.post('/:id/return', authMiddleware(['Admin', 'Librarian']), libraryIssueController.returnBook);

// Mark fine as paid
router.put('/:id/pay-fine', authMiddleware(['Admin', 'Librarian']), libraryIssueController.payFine);

module.exports = router;
