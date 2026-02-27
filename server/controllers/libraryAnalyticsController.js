const LibraryIssue = require('../models/LibraryIssue');
const Book = require('../models/Book');
const LibraryBooking = require('../models/LibraryBooking');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Quick Stats
        const totalBooks = await Book.countDocuments();
        const activeIssues = await LibraryIssue.countDocuments({ status: { $in: ['Active', 'Overdue'] } });

        // Fines Collected
        const fineAggregation = await LibraryIssue.aggregate([
            { $match: { finePaid: true } },
            { $group: { _id: null, totalFines: { $sum: "$fineAmount" } } }
        ]);
        const totalFinesCollected = fineAggregation.length > 0 ? fineAggregation[0].totalFines : 0;

        // Current Library Occupancy
        const activeBookings = await LibraryBooking.countDocuments({ status: 'Active' });

        // 2. High Level Summaries (for Charts)

        // Books Issued by Day (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const issuesByDay = await LibraryIssue.aggregate([
            { $match: { issueDate: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$issueDate" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Most Popular Books
        const popularBooks = await LibraryIssue.aggregate([
            { $group: { _id: "$book", issueCount: { $sum: 1 } } },
            { $sort: { issueCount: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'bookData' } },
            { $unwind: "$bookData" },
            { $project: { title: "$bookData.title", author: "$bookData.author", issueCount: 1 } }
        ]);

        res.json({
            quickStats: {
                totalBooks,
                activeIssues,
                totalFinesCollected,
                currentOccupancy: activeBookings
            },
            charts: {
                issuesByDay,
                popularBooks
            }
        });

    } catch (err) {
        res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
    }
};
