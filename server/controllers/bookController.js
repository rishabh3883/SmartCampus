const Book = require('../models/Book');
const LibraryLog = require('../models/LibraryLog');

// Get all books with optional search & filter
exports.getAllBooks = async (req, res) => {
    try {
        const { search, category } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } }
            ];
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        const books = await Book.find(query).sort({ title: 1 });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books", error: err.message });
    }
};

// Add a new book (Admin)
exports.addBook = async (req, res) => {
    try {
        const { title, author, isbn, publisher, category, edition, totalCopies } = req.body;

        const newBook = new Book({
            title, author, isbn, publisher, category, edition,
            totalCopies: parseInt(totalCopies) || 1,
            availableCopies: parseInt(totalCopies) || 1
        });

        await newBook.save();

        // Log the action
        await LibraryLog.create({
            action: 'AddBook',
            performedBy: req.user.id,
            targetId: newBook._id,
            details: `Added new book: ${title}`
        });

        res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "A book with this ISBN already exists" });
        res.status(500).json({ message: "Failed to add book", error: err.message });
    }
};

// Update a book (Admin)
exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // If total copies are updated, we need to adjust available copies carefully
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (updates.totalCopies) {
            const difference = parseInt(updates.totalCopies) - book.totalCopies;
            updates.availableCopies = book.availableCopies + difference;
            if (updates.availableCopies < 0) return res.status(400).json({ message: "Cannot reduce total copies below currently issued copies." });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, updates, { new: true });

        // Log the action
        await LibraryLog.create({
            action: 'UpdateBook',
            performedBy: req.user.id,
            targetId: updatedBook._id,
            details: `Updated book: ${book.title}`
        });

        res.json({ message: "Book updated successfully", book: updatedBook });
    } catch (err) {
        res.status(500).json({ message: "Failed to update book", error: err.message });
    }
};

// Delete a book (Admin)
exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.availableCopies < book.totalCopies) {
            return res.status(400).json({ message: "Cannot delete book while copies are currently issued." });
        }

        await Book.findByIdAndDelete(id);

        // Log the action
        await LibraryLog.create({
            action: 'DeleteBook',
            performedBy: req.user.id,
            targetId: id,
            details: `Deleted book: ${book.title}`
        });

        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete book", error: err.message });
    }
};
