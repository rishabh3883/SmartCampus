const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const chatController = require('../controllers/chatController');

router.get('/conversations', authMiddleware(), chatController.getConversations);
router.post('/conversations', authMiddleware(), chatController.createConversation);
router.get('/users', authMiddleware(), chatController.getUsersForChat);
router.get('/messages/:conversationId', authMiddleware(), chatController.getConversationMessages);
router.post('/messages', authMiddleware(), chatController.sendMessage);

module.exports = router;
