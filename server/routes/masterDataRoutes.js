const express = require('express');
const router = express.Router();
const {
    createCourse, getCourses, deleteCourse,
    createClass, getClasses, deleteClass,
    createSubject, getSubjects, deleteSubject,
    createTeacher, getTeachers, deleteTeacher,
    createRoom, getRooms, deleteRoom
} = require('../controllers/masterDataController');

router.route('/courses').get(getCourses).post(createCourse);
router.route('/classes').get(getClasses).post(createClass);
router.route('/subjects').get(getSubjects).post(createSubject);
router.route('/teachers').get(getTeachers).post(createTeacher);
router.route('/rooms').get(getRooms).post(createRoom);

router.delete('/courses/:id', deleteCourse);
router.delete('/classes/:id', deleteClass);
router.delete('/subjects/:id', deleteSubject);
router.delete('/teachers/:id', deleteTeacher);
router.delete('/rooms/:id', deleteRoom);

module.exports = router;
