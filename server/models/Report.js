const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['Post', 'User', 'Comment'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
    adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
