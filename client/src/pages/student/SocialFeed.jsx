import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Heart, Share2, Upload, MoreHorizontal, Send, Bell, Image as ImageIcon, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import moment from 'moment';

const SocialFeed = ({ isEmbedded }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState({ content: '', image: null, isAnonymous: false, isImportant: false });
    const [editingPost, setEditingPost] = useState(null);

    const [commentingOn, setCommentingOn] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState({}); // postId -> comments array

    // Notifications state
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        fetchFeed();
        fetchNotifications();
    }, []);

    const fetchFeed = async () => {
        try {
            const { data } = await API.get('/social/feed');
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching feed:", error);
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const { data } = await API.get('/social/notifications');
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.content.trim()) return;

        const formData = new FormData();
        formData.append('content', newPost.content);
        formData.append('isAnonymous', newPost.isAnonymous);
        if (newPost.image) formData.append('images', newPost.image);
        if (user.role !== 'Student') {
            formData.append('isImportant', newPost.isImportant);
        }

        try {
            await API.post('/social/posts', formData);
            setNewPost({ content: '', image: null, isAnonymous: false, isImportant: false });
            fetchFeed();
        } catch (error) {
            alert("Failed to create post");
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await API.delete(`/social/posts/${postId}`);
            fetchFeed();
        } catch (error) {
            alert("Failed to delete post");
        }
    };

    const handleUpdatePost = async (e, postId) => {
        e.preventDefault();
        if (!editingPost.content.trim()) return;

        try {
            await API.put(`/social/posts/${postId}`, {
                content: editingPost.content,
            });
            setEditingPost(null);
            fetchFeed();
        } catch (error) {
            alert("Failed to update post");
        }
    };

    const toggleLike = async (postId) => {
        try {
            await API.post('/social/like', { targetId: postId, targetType: 'Post' });
            fetchFeed(); // In production, optimally update state instead of re-fetching
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const loadComments = async (postId) => {
        if (commentingOn === postId) {
            setCommentingOn(null);
            return;
        }
        setCommentingOn(postId);
        try {
            const { data } = await API.get(`/social/comments/${postId}`);
            setComments(prev => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const { data } = await API.post('/social/comments', { postId, content: commentText });
            setCommentText('');
            // reload comments
            const res = await API.get(`/social/comments/${postId}`);
            setComments(prev => ({ ...prev, [postId]: res.data }));
            fetchFeed(); // to update comment count
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const markNotificationRead = async (id) => {
        try {
            await API.put(`/social/notifications/${id}`);
            fetchNotifications();
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };

    const reportPost = async (postId) => {
        const reason = prompt("Enter reason for reporting this post:");
        if (!reason) return;
        try {
            await API.post('/social/report', { targetId: postId, targetType: 'Post', reason });
            alert("Report submitted to Admin.");
        } catch (error) {
            alert("Failed to report");
        }
    };

    return (
        <div className={`w-full max-w-5xl mx-auto flex gap-6 ${isEmbedded ? '' : 'p-6'}`}>

            {/* Main Feed Section */}
            <div className="flex-1 space-y-6">
                {/* Header (if not embedded) */}
                {!isEmbedded && (
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Campus Social</h1>
                    </div>
                )}

                {/* Create Post Box */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-5 transition-all hover:shadow-md">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-inner">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <form onSubmit={handlePostSubmit} className="flex-1">
                            <textarea
                                className="w-full bg-transparent resize-none outline-none text-slate-700 placeholder:text-slate-400 text-lg min-h-[60px]"
                                placeholder="What's happening on campus?"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            />

                            {newPost.image && (
                                <div className="relative mb-3 inline-block">
                                    <img src={URL.createObjectURL(newPost.image)} alt="Preview" className="h-32 rounded-xl object-cover border border-slate-200" />
                                    <button type="button" onClick={() => setNewPost({ ...newPost, image: null })} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                                        <XCircle size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-full transition-colors flex items-center gap-1">
                                        <ImageIcon size={20} />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setNewPost({ ...newPost, image: e.target.files[0] });
                                            }
                                        }} />
                                    </label>

                                    <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                                        <input type="checkbox" className="accent-indigo-600 rounded" checked={newPost.isAnonymous} onChange={e => setNewPost({ ...newPost, isAnonymous: e.target.checked })} />
                                        <span>Anonymous</span>
                                    </label>

                                    {user?.role !== 'Student' && (
                                        <label className="flex items-center gap-2 text-sm text-rose-500 font-medium cursor-pointer ml-4">
                                            <input type="checkbox" className="accent-rose-600 rounded" checked={newPost.isImportant} onChange={e => setNewPost({ ...newPost, isImportant: e.target.checked })} />
                                            <span>Mark Important</span>
                                        </label>
                                    )}
                                </div>
                                <button type="submit" disabled={!newPost.content.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold shadow-md shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2">
                                    Post <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Posts Feed */}
                <div className="space-y-6 pb-20">
                    {loading ? (
                        <div className="text-center py-10 text-slate-500">Loading feed...</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">No posts yet. Be the first to start a conversation!</div>
                    ) : (
                        posts.map(post => (
                            <div key={post._id} className={`bg-white rounded-2xl shadow-sm border ${post.isImportant ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200/60'} overflow-hidden`}>
                                {/* Important Header */}
                                {post.isImportant && (
                                    <div className="bg-rose-50 text-rose-700 text-xs font-bold px-4 py-2 flex items-center gap-2 border-b border-rose-100">
                                        <AlertTriangle size={14} /> IMPORTANT CAMPUS ANNOUNCEMENT
                                    </div>
                                )}

                                <div className="p-5">
                                    {/* Author Info */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                                                ${post.isAnonymous ? 'bg-slate-400' : 'bg-gradient-to-br from-indigo-400 to-cyan-500'}`}>
                                                {post.isAnonymous ? 'A' : (post.authorId?.name?.charAt(0) || 'U')}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 flex items-center gap-1">
                                                    {post.isAnonymous ? 'Anonymous Tiger' : post.authorId?.name}
                                                    {!post.isAnonymous && post.authorId?.role !== 'Student' && (
                                                        <CheckCircle size={14} className="text-blue-500 ml-1" />
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {!post.isAnonymous && post.authorId?.role} • {moment(post.createdAt).fromNow()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative group perspective">
                                            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><MoreHorizontal size={20} /></button>
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                                                {((post.authorId?._id === user?._id || post.authorId === user?._id) || user?.role === 'Admin') && (
                                                    <button onClick={() => handleDeletePost(post._id)} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium">Delete</button>
                                                )}
                                                {(post.authorId?._id === user?._id || post.authorId === user?._id) && (
                                                    <button onClick={() => setEditingPost(post)} className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium">Edit</button>
                                                )}
                                                <button onClick={() => reportPost(post._id)} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium border-t border-slate-100">Report</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    {editingPost?._id === post._id ? (
                                        <form onSubmit={(e) => handleUpdatePost(e, post._id)} className="mb-4">
                                            <textarea
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none text-slate-700 min-h-[80px]"
                                                value={editingPost.content}
                                                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button type="button" onClick={() => setEditingPost(null)} className="px-4 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-full font-medium">Cancel</button>
                                                <button type="submit" className="px-4 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-full font-medium">Save</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p className="text-slate-700 text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                                    )}

                                    {/* Images */}
                                    {post.images && post.images.length > 0 && (
                                        <div className="mb-4 rounded-xl overflow-hidden border border-slate-100">
                                            {post.images.map((img, i) => (
                                                <img key={i} src={`http://localhost:5000${img}`} alt="Post content" className="w-full h-auto max-h-96 object-cover" />
                                            ))}
                                        </div>
                                    )}

                                    {/* Interaction Bar */}
                                    <div className="flex items-center gap-6 pt-3 border-t border-slate-100/60 mt-2">
                                        <button onClick={() => toggleLike(post._id)} className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors group">
                                            <div className="p-1.5 rounded-full group-hover:bg-rose-50 transition-colors">
                                                <Heart size={20} className="group-active:scale-75 transition-transform" />
                                            </div>
                                            <span className="font-medium text-sm">{post.likesCount}</span>
                                        </button>
                                        <button onClick={() => loadComments(post._id)} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-500 transition-colors group">
                                            <div className="p-1.5 rounded-full group-hover:bg-indigo-50 transition-colors">
                                                <MessageSquare size={20} className="group-active:scale-75 transition-transform" />
                                            </div>
                                            <span className="font-medium text-sm">{post.commentsCount}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors group ml-auto">
                                            <div className="p-1.5 rounded-full group-hover:bg-blue-50 transition-colors">
                                                <Share2 size={20} />
                                            </div>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {commentingOn === post._id && (
                                        <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                                {comments[post._id]?.map(c => (
                                                    <div key={c._id} className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
                                                            {c.authorId?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-2 flex-1">
                                                            <div className="flex justify-between items-baseline mb-0.5">
                                                                <span className="font-bold text-slate-800 text-sm">{c.authorId?.name}</span>
                                                                <span className="text-[10px] text-slate-400">{moment(c.createdAt).fromNow()}</span>
                                                            </div>
                                                            <p className="text-slate-600 text-sm">{c.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {comments[post._id]?.length === 0 && <p className="text-slate-400 text-sm text-center">No comments yet.</p>}
                                            </div>
                                            <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="flex gap-2 items-center">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                                                    {user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-indigo-300 transition-colors"
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                />
                                                <button type="submit" disabled={!commentText.trim()} className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-full disabled:opacity-50 transition-colors">
                                                    <Send size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Sidebar - Notifications & Trending */}
            <div className="w-80 hidden lg:flex flex-col gap-6">

                {/* Notifications Widget */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden sticky top-24">
                    <div className="bg-indigo-600 px-5 py-4 flex justify-between items-center text-white">
                        <h3 className="font-bold flex items-center gap-2"><Bell size={18} /> Notifications</h3>
                        <span className="bg-indigo-500 px-2 py-0.5 rounded-full text-xs font-bold">{notifications.filter(n => !n.isRead).length} New</span>
                    </div>
                    <div className="p-0 max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-6">All caught up!</p>
                        ) : (
                            notifications.map(noti => (
                                <div key={noti._id}
                                    className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${!noti.isRead ? 'bg-indigo-50/30' : ''}`}
                                    onClick={() => markNotificationRead(noti._id)}>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center shrink-0">
                                            {noti.type === 'Like' ? <Heart size={14} className="text-rose-500" /> :
                                                noti.type === 'Comment' ? <MessageSquare size={14} /> :
                                                    noti.type === 'Important' ? <AlertTriangle size={14} className="text-amber-500" /> : <Bell size={14} />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-700 leading-tight">
                                                <span className="font-bold">{noti.actorId?.name}</span> {noti.message.replace(noti.actorId?.name, '')}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1">{moment(noti.createdAt).fromNow()}</p>
                                        </div>
                                        {!noti.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Trending Tags (Static Mock) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 sticky top-[500px]">
                    <h3 className="font-bold text-slate-800 mb-4 tracking-tight">Trending on Campus</h3>
                    <div className="space-y-4">
                        {[
                            { tag: '#TechFest2026', posts: '1.2k' },
                            { tag: '#Exams', posts: '856' },
                            { tag: '#LostAndFound', posts: '432' },
                            { tag: '#Cafeteria', posts: '219' }
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center group cursor-pointer">
                                <div>
                                    <p className="text-slate-500 text-xs font-medium">Trending</p>
                                    <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.tag}</p>
                                </div>
                                <span className="text-xs text-slate-400">{item.posts} posts</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SocialFeed;
