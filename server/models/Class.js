const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    name: { type: String, required: true } // e.g., "BCA 2nd Year - Section A"
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
