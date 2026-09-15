const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    studentName: { type: String, required: true },
    enrollmentNumber: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    className: { type: String, default: 'General Section' },
    section: { type: String, required: true, default: 'Section A' },
    course: { type: String, default: 'Computer Science' },
    date: { type: Date, default: Date.now },
    subject: { type: String, default: 'General Class' },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
    markedBy: { type: String, default: 'System' }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
