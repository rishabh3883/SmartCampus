const express = require('express');
const router = express.Router();
const { generateTimetable, getTimetableByClass, updateSlot } = require('../controllers/timetableController');

router.post('/generate', generateTimetable);
router.get('/class/:classId', getTimetableByClass);
router.put('/update-slot', updateSlot);
router.delete('/class/:classId', require('../controllers/timetableController').deleteTimetable);

module.exports = router;
