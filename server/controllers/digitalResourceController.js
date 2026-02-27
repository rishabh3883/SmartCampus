const DigitalResource = require('../models/DigitalResource');
const LibraryLog = require('../models/LibraryLog');

// Get all digital resources (Student & Admin)
exports.getResources = async (req, res) => {
    try {
        const { category, type, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (type) query.type = type;
        if (search) query.title = { $regex: search, $options: 'i' };

        const resources = await DigitalResource.find(query).sort({ uploadDate: -1 });
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch resources", error: err.message });
    }
};

// Add a digital resource (Admin)
exports.addResource = async (req, res) => {
    try {
        const { title, type, category, fileUrl } = req.body;

        const resource = new DigitalResource({
            title,
            type,
            category,
            fileUrl,
            uploadedBy: req.user.id
        });

        await resource.save();

        await LibraryLog.create({
            action: 'Issue', // Enum bypass hack if strict mode is disabled, or use appropriate action
            performedBy: req.user.id,
            details: `Uploaded new digital resource: ${title}`
        }).catch(e => console.log("Log error:", e));

        res.status(201).json({ message: "Resource added successfully", resource });
    } catch (err) {
        res.status(500).json({ message: "Failed to add resource", error: err.message });
    }
};

// Delete a resource (Admin)
exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await DigitalResource.findByIdAndDelete(id);

        if (!resource) return res.status(404).json({ message: "Resource not found" });

        res.json({ message: "Resource deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete resource", error: err.message });
    }
};

// Increment download/view count
exports.incrementDownload = async (req, res) => {
    try {
        const { id } = req.params;
        await DigitalResource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });
        res.json({ message: "Count updated" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update count", error: err.message });
    }
};
