const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    visibility: { type: String, enum: ['Campus', 'Department'], default: 'Campus' },
    isImportant: { type: Boolean, default: false },
    tags: [{ type: String }], // e.g., #event, #announcement
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
