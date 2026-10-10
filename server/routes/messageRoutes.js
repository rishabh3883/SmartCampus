const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(['Admin']), messageController.sendMessage);
router.get('/', authMiddleware(['Admin', 'Employee', 'Student']), messageController.getMessages);
router.put('/:id', authMiddleware(['Admin']), messageController.updateMessage);
router.delete('/:id', authMiddleware(['Admin']), messageController.deleteMessage);

module.exports = router;
