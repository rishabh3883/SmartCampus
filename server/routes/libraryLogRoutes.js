const express = require('express');
const router = express.Router();
const logController = require('../controllers/libraryLogController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['Admin']), logController.getLogs);

module.exports = router;
