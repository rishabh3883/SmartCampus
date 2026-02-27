const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true }, // Total weekly hours
    type: { type: String, enum: ['Lecture', 'Lab'], required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
