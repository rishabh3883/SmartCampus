const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true, sparse: true },
    publisher: { type: String },
    category: { type: String, required: true },
    edition: { type: String },
    totalCopies: { type: Number, required: true, default: 1 },
    availableCopies: { type: Number, required: true, default: 1 },
    coverImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
