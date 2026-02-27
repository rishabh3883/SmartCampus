const Conversation = require('../models/Conversation');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({ participants: userId })
            .populate('participants', 'name userImage role')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
};

exports.getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await ChatMessage.find({ conversationId })
            .populate('senderId', 'name userImage role')
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

exports.createConversation = async (req, res) => {
    try {
        const { participantIds, isGroup, groupName } = req.body;
        const userId = req.user.id;

        const allParticipants = [...new Set([userId, ...participantIds])];

        if (!isGroup && allParticipants.length === 2) {
            // Check if 1-to-1 conversation already exists
            const existing = await Conversation.findOne({
                isGroup: false,
                participants: { $all: allParticipants, $size: 2 }
            });

            if (existing) {
                return res.status(200).json(existing);
            }
        }

        const newConversation = new Conversation({
            participants: allParticipants,
            isGroup: isGroup || false,
            groupName: isGroup ? groupName : null
        });

        await newConversation.save();
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating conversation', error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        const senderId = req.user.id;

        const newMessage = new ChatMessage({
            conversationId,
            senderId,
            content
        });

        await newMessage.save();

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, { lastMessage: newMessage._id });

        // Populate sender details for the socket emit
        const populatedMessage = await newMessage.populate('senderId', 'name userImage role');

        // Emit through socket
        const io = req.app.get('socketio');
        io.to(conversationId).emit('receive-message', populatedMessage);

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

exports.getUsersForChat = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id }, role: { $nin: ['Pending', 'Rejected'] } }).select('name role userImage');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
