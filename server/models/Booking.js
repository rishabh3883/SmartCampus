const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    paymentId: { type: String, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
    qrCode: { type: String, required: true, unique: true },
    attended: { type: Boolean, default: false },
    attendedAt: { type: Date, default: null },
    attendeeName: { type: String },
    attendeeEmail: { type: String },
    enrollmentNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
