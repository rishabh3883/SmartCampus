const mongoose = require('mongoose');

const SocialNotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the notification
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The user causing the notification
    type: { type: String, enum: ['Like', 'Comment', 'Mention', 'Important', 'NewMessage'], required: true },
    dataId: { type: mongoose.Schema.Types.ObjectId }, // ID of the relevant post, comment, or conversation
    message: { type: String },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SocialNotification', SocialNotificationSchema);
