const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const socialController = require('../controllers/socialController');

router.post('/posts', authMiddleware(), upload.array('images', 5), socialController.createPost);
router.get('/feed', authMiddleware(), socialController.getFeed);
router.post('/like', authMiddleware(), socialController.likeTarget);
router.post('/comments', authMiddleware(), socialController.addComment);
router.get('/comments/:postId', authMiddleware(), socialController.getComments);
router.post('/report', authMiddleware(), socialController.reportContent);
router.get('/notifications', authMiddleware(), socialController.getNotifications);
router.put('/notifications/:notificationId', authMiddleware(), socialController.markNotificationRead);

// Post Edit and Delete
router.delete('/posts/:postId', authMiddleware(), socialController.deletePost);
router.put('/posts/:postId', authMiddleware(), upload.array('images', 5), socialController.editPost);

module.exports = router;
