const mongoose = require('mongoose');

const libraryIssueSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Admin who issued it
}, { timestamps: true });

module.exports = mongoose.model('LibraryIssue', libraryIssueSchema);
