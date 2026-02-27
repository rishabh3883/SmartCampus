const mongoose = require('mongoose');

const digitalResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['PDF', 'eBook', 'Notes', 'Video', 'Other'], required: true },
    category: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    downloadCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DigitalResource', digitalResourceSchema);
