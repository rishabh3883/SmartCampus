const LibraryIssue = require('../models/LibraryIssue');
const Book = require('../models/Book');
const User = require('../models/User');
const LibraryLog = require('../models/LibraryLog');

const FINE_PER_DAY = 10; // e.g., ₹10 per day late fine

// Issue a book to a user
exports.issueBook = async (req, res) => {
    try {
        const { bookId, userId, dueDays = 14 } = req.body;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });

        if (book.availableCopies <= 0) {
            return res.status(400).json({ message: "No copies currently available for this book" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if user already has 3 active issues (example limit)
        const activeIssues = await LibraryIssue.countDocuments({ user: userId, status: 'Active' });
        if (activeIssues >= 3) {
            return res.status(400).json({ message: "User has reached the maximum limit of 3 issued books." });
        }

        // Check if user already has THIS specific book active
        const existingIssue = await LibraryIssue.findOne({ book: bookId, user: userId, status: 'Active' });
        if (existingIssue) {
            return res.status(400).json({ message: "User already has an active issue for this book." });
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + parseInt(dueDays));

        const issue = new LibraryIssue({
            book: bookId,
            user: userId,
            dueDate,
            issuedBy: req.user.id
        });

        await issue.save();

        // Decrease available copies
        book.availableCopies -= 1;
        await book.save();

        // Log
        await LibraryLog.create({
            action: 'Issue',
            performedBy: req.user.id,
            targetId: issue._id,
            details: `Issued book '${book.title}' to user ${user.name} (Due: ${dueDate.toDateString()})`
        });

        res.status(201).json({ message: "Book issued successfully", issue });
    } catch (err) {
        res.status(500).json({ message: "Failed to issue book", error: err.message });
    }
};

// Return a book
exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await LibraryIssue.findById(id).populate('book');

        if (!issue) return res.status(404).json({ message: "Issue record not found" });
        if (issue.status === 'Returned') return res.status(400).json({ message: "Book is already marked as returned" });

        const returnDate = new Date();
        issue.returnDate = returnDate;
        issue.status = 'Returned';

        // Fine Calculation
        if (returnDate > issue.dueDate) {
            const diffTime = Math.abs(returnDate - issue.dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            issue.fineAmount = diffDays * FINE_PER_DAY;
        }

        await issue.save();

        // Increase available copies
        if (issue.book) {
            issue.book.availableCopies += 1;
            await issue.book.save();
        }

        // Log
        await LibraryLog.create({
            action: 'Return',
            performedBy: req.user.id,
            targetId: issue._id,
            details: `Returned book '${issue.book?.title}' (Fine: ₹${issue.fineAmount})`
        });

        res.json({ message: "Book returned successfully", issue });
    } catch (err) {
        res.status(500).json({ message: "Failed to return book", error: err.message });
    }
};

// Get all active issues (For Admin)
exports.getAllIssues = async (req, res) => {
    try {
        const issues = await LibraryIssue.find()
            .populate('book', 'title author isbn')
            .populate('user', 'name email uniqueId')
            .sort({ issueDate: -1 });

        // Dynamic status check for Overdue
        const now = new Date();
        const updatedIssues = issues.map(iss => {
            const doc = iss.toObject();
            if (doc.status === 'Active' && doc.dueDate < now) {
                doc.status = 'Overdue';
                const diffTime = Math.abs(now - doc.dueDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                doc.currentFineEstimate = diffDays * FINE_PER_DAY;
            }
            return doc;
        });

        res.json(updatedIssues);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch issues", error: err.message });
    }
};

// Get my issues (For Student)
exports.getMyIssues = async (req, res) => {
    try {
        const issues = await LibraryIssue.find({ user: req.user.id })
            .populate('book', 'title author coverImage')
            .sort({ issueDate: -1 });

        // Dynamic status check for Overdue
        const now = new Date();
        const updatedIssues = issues.map(iss => {
            const doc = iss.toObject();
            if (doc.status === 'Active' && doc.dueDate < now) {
                doc.status = 'Overdue';
                const diffTime = Math.abs(now - doc.dueDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                doc.currentFineEstimate = diffDays * FINE_PER_DAY;
            }
            return doc;
        });

        res.json(updatedIssues);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your issued books", error: err.message });
    }
};

// Admin pay fine
exports.payFine = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await LibraryIssue.findById(id);
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        issue.finePaid = true;
        await issue.save();

        res.json({ message: "Fine marked as paid", issue });
    } catch (err) {
        res.status(500).json({ message: "Failed to pay fine", error: err.message });
    }
};
