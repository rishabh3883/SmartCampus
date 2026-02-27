const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String }, // Only if isGroup is true
    groupDepartment: { type: String }, // For department-wide groups
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
