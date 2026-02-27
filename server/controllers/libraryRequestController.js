const LibraryRequest = require('../models/LibraryRequest');

// --- Student: Submit Request ---
exports.createRequest = async (req, res) => {
    try {
        const { requestType, description, priority } = req.body;

        const request = new LibraryRequest({
            user: req.user.id,
            requestType,
            description,
            priority: priority || 'Medium'
        });

        await request.save();
        res.status(201).json({ message: "Request submitted successfully", request });
    } catch (err) {
        res.status(500).json({ message: "Failed to submit request", error: err.message });
    }
};

// --- Student: Get My Requests ---
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await LibraryRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch requests", error: err.message });
    }
};

// --- Admin: Get All Requests ---
exports.getAllRequests = async (req, res) => {
    try {
        const { status, type } = req.query;
        let query = {};
        if (status) query.status = status;
        if (type) query.requestType = type;

        const requests = await LibraryRequest.find(query)
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch requests", error: err.message });
    }
};

// --- Admin: Update Request Status ---
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const request = await LibraryRequest.findByIdAndUpdate(
            id,
            { status, adminNotes },
            { new: true }
        );

        if (!request) return res.status(404).json({ message: "Request not found" });

        res.json({ message: "Request updated", request });
    } catch (err) {
        res.status(500).json({ message: "Failed to update request", error: err.message });
    }
};

// --- Admin: Delete Request ---
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await LibraryRequest.findByIdAndDelete(id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        res.json({ message: "Request deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete request", error: err.message });
    }
};
