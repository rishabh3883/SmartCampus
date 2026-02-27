const LibraryLog = require('../models/LibraryLog');

// Get all logs (Admin Only)
exports.getLogs = async (req, res) => {
    try {
        const { action, limit = 50 } = req.query;
        let query = {};
        if (action) query.action = action;

        const logs = await LibraryLog.find(query)
            .populate('performedBy', 'name email role')
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch logs", error: err.message });
    }
};
