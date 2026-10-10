const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { content, receiverRole } = req.body;
        const message = new Message({
            senderId: req.user.id,
            receiverRole: receiverRole || 'All',
            content
        });
        await message.save();
        const populatedMessage = await Message.findById(message._id).populate('senderId', 'name role');

        const io = req.app.get('socketio');
        if (io) {
            io.emit('new-broadcast', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        // Admin gets all messages; students/staff get targeted messages
        let query = {};
        if (req.user.role !== 'Admin') {
            const role = req.user.role === 'Employee' ? 'Staff' : req.user.role;
            query = { receiverRole: { $in: ['All', role] } };
        }

        const messages = await Message.find(query)
            .sort({ date: -1 })
            .limit(100)
            .populate('senderId', 'name role');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, receiverRole } = req.body;

        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: 'Broadcast not found' });
        }

        if (content !== undefined) message.content = content;
        if (receiverRole !== undefined) message.receiverRole = receiverRole;

        await message.save();
        const populatedMessage = await Message.findById(message._id).populate('senderId', 'name role');

        const io = req.app.get('socketio');
        if (io) {
            io.emit('update-broadcast', populatedMessage);
        }

        res.json(populatedMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: 'Broadcast not found' });
        }

        await Message.findByIdAndDelete(id);

        const io = req.app.get('socketio');
        if (io) {
            io.emit('delete-broadcast', { id });
        }

        res.json({ message: 'Broadcast deleted successfully', id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
