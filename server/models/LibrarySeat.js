const mongoose = require('mongoose');

const librarySeatSchema = new mongoose.Schema({
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    seatNumber: { type: String, required: true }, // e.g. "Seat A-01"
    seatCode: { type: String, required: true, unique: true }, // e.g. "LIB-SEAT-A01-CSE"
    status: { type: String, enum: ['Vacant', 'Occupied'], default: 'Vacant' },
    occupiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    occupiedByName: { type: String, default: null },
    occupiedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('LibrarySeat', librarySeatSchema);
