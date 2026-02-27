const Course = require('../models/Course');
const ClassModel = require('../models/Class');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Room = require('../models/Room');

exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createClass = async (req, res) => {
    try {
        const newClass = await ClassModel.create(req.body);
        res.status(201).json({ success: true, data: newClass });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
exports.getClasses = async (req, res) => {
    try {
        const classes = await ClassModel.find().populate('course');
        res.status(200).json({ success: true, count: classes.length, data: classes });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json({ success: true, data: subject });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('course');
        res.status(200).json({ success: true, count: subjects.length, data: subjects });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.create(req.body);
        res.status(201).json({ success: true, data: teacher });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('subjects');
        res.status(200).json({ success: true, count: teachers.length, data: teachers });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json({ success: true, data: room });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (error) { res.status(400).json({ success: false, error: error.message }); }
};

exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
exports.deleteClass = async (req, res) => {
    try {
        await ClassModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
exports.deleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
exports.deleteRoom = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
