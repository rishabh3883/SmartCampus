const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    maxLoadPerDay: { type: Number, default: 4 },
    maxLoadPerWeek: { type: Number, default: 20 },
    availability: {
        type: Map,
        of: [Boolean], // Map of day (e.g., "Mon") to array of booleans representing slots
        default: {}
    }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
