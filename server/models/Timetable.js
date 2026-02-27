const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    isLocked: { type: Boolean, default: false }
});

const dayScheduleSchema = new mongoose.Schema({
    day: { type: String, required: true }, // Mon, Tue, Wed...
    slots: [slotSchema]
});

const timetableSchema = new mongoose.Schema({
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    semester: { type: String },
    schedule: [dayScheduleSchema]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
