const mongoose = require('mongoose');

const libraryLogSchema = new mongoose.Schema({
    action: { type: String, enum: ['Issue', 'Return', 'AddBook', 'UpdateBook', 'DeleteBook', 'AddResource', 'DeleteResource', 'UpdateSettings'], required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId }, // Can be bookId, issueId, or resourceId
    details: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('LibraryLog', libraryLogSchema);
