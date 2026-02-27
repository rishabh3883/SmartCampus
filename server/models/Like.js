const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['Post', 'Comment'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

// Prevent duplicate likes
LikeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Like', LikeSchema);
