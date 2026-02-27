const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const SocialNotification = require('../models/SocialNotification');
const Report = require('../models/Report');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    try {
        const { content, visibility, isImportant, tags, isAnonymous } = req.body;

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        const newPost = new Post({
            authorId: req.user.id,
            content,
            images: imageUrls,
            visibility: visibility || 'Campus',
            isImportant: isImportant === 'true' || isImportant === true,
            tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
            isAnonymous: isAnonymous === 'true' || isAnonymous === true
        });

        await newPost.save();

        if (newPost.isImportant) {
            // Optional: send global notification for important posts
            // This is a simple logic. In production, we'd batch this or do it via websockets directly.
        }

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Fetch posts visible to everyone or from the same department
        // Assuming visibility works like this, we fetch based on user role/department if that existed,
        // for now just simple fetch: Campus wide or Important first!
        const posts = await Post.find({})
            .populate(req.query.loadAuthor ? 'authorId' : { path: 'authorId', select: 'name userImage role' })
            .sort({ isImportant: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feed', error: error.message });
    }
};

exports.likeTarget = async (req, res) => {
    try {
        const { targetId, targetType } = req.body;
        const userId = req.user.id;

        const existingLike = await Like.findOne({ userId, targetId, targetType });

        if (existingLike) {
            // Unlike
            await Like.deleteOne({ _id: existingLike._id });
            if (targetType === 'Post') {
                await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
            } else {
                await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: -1 } });
            }
            res.status(200).json({ message: 'Unliked successfully' });
        } else {
            // Like
            const newLike = new Like({ userId, targetId, targetType });
            await newLike.save();

            let targetDoc = null;
            if (targetType === 'Post') {
                targetDoc = await Post.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
            } else {
                targetDoc = await Comment.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
            }

            // Create notification if target has an author
            if (targetDoc && targetDoc.authorId.toString() !== userId) {
                await SocialNotification.create({
                    userId: targetDoc.authorId,
                    actorId: userId,
                    type: 'Like',
                    dataId: targetId,
                    message: `Someone liked your ${targetType.toLowerCase()}.`
                });
            }

            res.status(200).json({ message: 'Liked successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating like', error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { postId, content } = req.body;
        const userId = req.user.id;

        const newComment = new Comment({
            postId,
            authorId: userId,
            content
        });

        await newComment.save();
        const post = await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

        if (post && post.authorId.toString() !== userId) {
            await SocialNotification.create({
                userId: post.authorId,
                actorId: userId,
                type: 'Comment',
                dataId: postId,
                message: `Someone commented on your post.`
            });
        }

        res.status(201).json({ message: 'Comment added', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId })
            .populate('authorId', 'name userImage role')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

exports.reportContent = async (req, res) => {
    try {
        const { targetId, targetType, reason } = req.body;

        const report = new Report({
            reporterId: req.user.id,
            targetId,
            targetType,
            reason
        });

        await report.save();
        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting report', error: error.message });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await SocialNotification.find({ userId: req.user.id })
            .populate('actorId', 'name userImage')
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

exports.markNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        await SocialNotification.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notification read', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ensure user owns post (or is admin)
        if (post.authorId.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(postId);

        // Delete associated comments and likes
        await Comment.deleteMany({ postId });
        await Like.deleteMany({ targetId: postId, targetType: 'Post' });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};

exports.editPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, visibility, isImportant, tags, isAnonymous } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ensure user owns post
        if (post.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }

        let imageUrls = post.images;
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        }

        post.content = content || post.content;
        if (req.files && req.files.length > 0) {
            post.images = imageUrls;
        }
        if (visibility) post.visibility = visibility;
        if (isImportant !== undefined) post.isImportant = isImportant === 'true' || isImportant === true;
        if (tags) post.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
        if (isAnonymous !== undefined) post.isAnonymous = isAnonymous === 'true' || isAnonymous === true;

        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Error editing post', error: error.message });
    }
};
