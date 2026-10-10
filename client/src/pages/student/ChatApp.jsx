import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import socket from '../../services/socket';
import { Search, Send, Users, MessageSquare, Phone, Video, MoreVertical, Plus, X, Trash2 } from 'lucide-react';
import moment from 'moment';

const ChatApp = ({ isEmbedded }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const [searchConv, setSearchConv] = useState('');
    const messagesEndRef = useRef(null);

    // Modal state
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [searchUser, setSearchUser] = useState('');

    const currentUserId = String(user?.id || user?._id || '');
    const isAdmin = user?.role === 'Admin';

    // Initial Fetch
    useEffect(() => {
        fetchConversations();
        fetchUsers();
    }, []);

    // Socket Event Listeners
    useEffect(() => {
        if (!socket || !selectedConv) return;

        socket.emit('join-chat', selectedConv._id);

        const receiveHandler = (msg) => {
            if (msg.conversationId === selectedConv._id) {
                setMessages(prev => {
                    if (prev.some(m => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });
                scrollToBottom();
            }
            // Update conversation last message in list
            setConversations(prev => prev.map(c => 
                c._id === msg.conversationId ? { ...c, lastMessage: msg } : c
            ));
        };

        const deleteHandler = ({ messageId }) => {
            setMessages(prev => prev.filter(m => String(m._id) !== String(messageId)));
        };

        const typingHandler = (name) => {
            setTypingUser(name);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
        };

        const stopTypingHandler = () => {
            setIsTyping(false);
        };

        socket.on('receive-message', receiveHandler);
        socket.on('delete-message', deleteHandler);
        socket.on('user-typing', typingHandler);
        socket.on('user-stop-typing', stopTypingHandler);

        return () => {
            socket.off('receive-message', receiveHandler);
            socket.off('delete-message', deleteHandler);
            socket.off('user-typing', typingHandler);
            socket.off('user-stop-typing', stopTypingHandler);
        };
    }, [selectedConv]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const fetchConversations = async () => {
        try {
            const { data } = await API.get('/chat/conversations');
            setConversations(data || []);
            if (!selectedConv && data && data.length > 0) {
                // optionally keep unselected or auto-select first
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/chat/users');
            setUsersList(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const selectConversation = async (conv) => {
        setSelectedConv(conv);
        try {
            const { data } = await API.get(`/chat/messages/${conv._id}`);
            setMessages(data || []);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        const messageContent = newMessage.trim();
        setNewMessage('');

        try {
            const { data } = await API.post('/chat/messages', {
                conversationId: selectedConv._id,
                content: messageContent
            });
            setMessages(prev => {
                if (prev.some(m => m._id === data._id)) return prev;
                return [...prev, data];
            });
            setConversations(prev => prev.map(c => 
                c._id === selectedConv._id ? { ...c, lastMessage: data } : c
            ));
            scrollToBottom();
            if (socket) socket.emit('stop-typing', selectedConv._id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (socket && selectedConv) {
            socket.emit('typing', { conversationId: selectedConv._id, userName: user?.name || 'User' });
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await API.delete(`/chat/messages/${messageId}`);
            setMessages(prev => prev.filter(m => String(m._id) !== String(messageId)));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete message');
        }
    };

    const showNewChat = () => {
        fetchUsers();
        setShowNewChatModal(true);
    };

    const startNewChat = async (id) => {
        try {
            const { data } = await API.post('/chat/conversations', { participantIds: [id], isGroup: false });
            await fetchConversations();
            selectConversation(data);
            setShowNewChatModal(false);
        } catch (error) {
            alert('Failed to start chat.');
        }
    };

    // Helpers
    const getChatName = (conv) => {
        if (!conv) return '';
        if (conv.isGroup) return conv.groupName || 'Group Chat';
        const otherUser = conv.participants?.find(p => String(p?._id || p?.id || p) !== currentUserId);
        return otherUser?.name || 'Campus Member';
    };

    const getChatRole = (conv) => {
        if (!conv || conv.isGroup) return 'Group';
        const otherUser = conv.participants?.find(p => String(p?._id || p?.id || p) !== currentUserId);
        return otherUser?.role || 'Student';
    };

    const getChatIcon = (conv) => {
        if (!conv) return null;
        if (conv.isGroup) return <Users className="text-white" size={20} />;
        const otherUser = conv.participants?.find(p => String(p?._id || p?.id || p) !== currentUserId);
        const initial = otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : 'U';
        return <span className="font-bold text-white text-lg">{initial}</span>;
    };

    const filteredUsers = usersList.filter(u => 
        u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchUser.toLowerCase())
    );

    const filteredConversations = conversations.filter(conv => {
        const name = getChatName(conv);
        return name.toLowerCase().includes(searchConv.toLowerCase());
    });

    return (
        <div className={`w-full max-w-6xl mx-auto flex h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden ${isEmbedded ? '' : 'm-4'}`}>

            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50 relative shrink-0">
                {/* Search & Header */}
                <div className="p-4 border-b border-slate-200 bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                <MessageSquare size={18} />
                            </div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-800">Messages</h2>
                        </div>
                        <button 
                            onClick={showNewChat} 
                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                            title="New Chat"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchConv}
                            onChange={(e) => setSearchConv(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow text-slate-700"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 p-6 text-center">
                            <MessageSquare opacity={0.4} size={36} />
                            <p className="text-xs font-medium">No conversations found</p>
                            <button onClick={showNewChat} className="text-indigo-600 font-bold text-xs hover:underline mt-2">
                                + Start a new chat
                            </button>
                        </div>
                    ) : (
                        filteredConversations.map(conv => {
                            const isSelected = selectedConv?._id === conv._id;
                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => selectConversation(conv)}
                                    className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors border-b border-slate-100/70
                                        ${isSelected ? 'bg-indigo-50/80 border-l-4 border-l-indigo-600' : 'hover:bg-slate-100/70 border-l-4 border-l-transparent'}
                                    `}
                                >
                                    <div className={`relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm
                                        ${conv.isGroup ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-violet-600'}
                                    `}>
                                        {getChatIcon(conv)}
                                        {!conv.isGroup && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-bold text-slate-800 text-sm truncate">{getChatName(conv)}</h3>
                                            <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                                                {conv.lastMessage ? moment(conv.lastMessage.createdAt).format('LT') : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-xs text-slate-500 truncate">
                                                {conv.lastMessage?.content || 'Say hi! 👋'}
                                            </p>
                                            <span className="text-[9px] font-semibold px-1.5 py-0.2 bg-slate-200/60 text-slate-600 rounded">
                                                {getChatRole(conv)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* New Chat Modal */}
                {showNewChatModal && (
                    <div className="absolute inset-0 bg-white z-20 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-slate-800 text-sm">Start New Conversation</h3>
                            <button onClick={() => setShowNewChatModal(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search students & staff..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                            {filteredUsers.length === 0 ? (
                                <p className="text-center text-slate-400 text-xs py-6">No users found</p>
                            ) : (
                                filteredUsers.map(u => (
                                    <div
                                        key={u._id}
                                        onClick={() => startNewChat(u._id)}
                                        className="flex items-center gap-3 p-2.5 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-indigo-100"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                                            {u.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 text-xs truncate leading-none">{u.name}</p>
                                            <p className="text-[10px] text-slate-500 mt-1 capitalize">{u.role}</p>
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Chat</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            {selectedConv ? (
                <div className="flex-1 flex flex-col bg-slate-50/50 min-w-0">
                    {/* Chat Header */}
                    <div className="h-16 px-6 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0
                                ${selectedConv.isGroup ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-violet-600'}`}>
                                {getChatIcon(selectedConv)}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">{getChatName(selectedConv)}</h3>
                                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    {selectedConv.isGroup ? `${selectedConv.participants?.length || 0} members` : getChatRole(selectedConv)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <button className="p-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Phone size={18} /></button>
                            <button className="p-2 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Video size={18} /></button>
                            <div className="w-px h-5 bg-slate-200"></div>
                            <button className="p-2 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical size={18} /></button>
                        </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-60 text-center">
                                <MessageSquare size={40} className="mb-2 text-slate-400" />
                                <p className="text-sm font-semibold text-slate-600">No messages yet</p>
                                <p className="text-xs text-slate-400 mt-1">Send a message below to start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const senderId = String(msg.senderId?._id || msg.senderId?.id || msg.senderId || '');
                                const isMe = senderId === currentUserId;
                                const canDelete = isMe || isAdmin;
                                const showAvatar = !isMe && selectedConv.isGroup && (index === 0 || String(messages[index - 1].senderId?._id || messages[index - 1].senderId) !== senderId);

                                return (
                                    <div key={msg._id || index} className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-end gap-2 max-w-[80%] md:max-w-[70%]">
                                            {showAvatar && (
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-[10px] shrink-0 mb-1">
                                                    {msg.senderId?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            {!showAvatar && !isMe && selectedConv.isGroup && <div className="w-6 shrink-0"></div>}

                                            <div className={`relative px-4 py-2.5 rounded-2xl shadow-xs text-sm group/msg
                                                ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-sm'}
                                            `}>
                                                {showAvatar && <div className="text-[10px] font-bold text-indigo-500 mb-0.5">{msg.senderId?.name}</div>}
                                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                
                                                <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-black/5">
                                                    {canDelete ? (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteMessage(msg._id);
                                                            }}
                                                            className={`p-1 rounded transition-colors flex items-center gap-1 text-[10px] font-medium ${
                                                                isMe 
                                                                    ? 'text-indigo-200 hover:text-rose-200 hover:bg-indigo-700/60' 
                                                                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                                            }`}
                                                            title={isAdmin && !isMe ? "Delete as Admin" : "Delete your message"}
                                                        >
                                                            <Trash2 size={12} />
                                                            <span className="text-[9px]">Delete</span>
                                                        </button>
                                                    ) : <span />}
                                                    
                                                    <div className={`text-[9px] font-medium ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                        {moment(msg.createdAt).format('LT')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs italic px-3 py-1.5 bg-white rounded-xl shadow-xs border border-slate-100 w-fit">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                </span>
                                {typingUser} is typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-200 m-3 rounded-2xl shadow-xs">
                        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                            <textarea
                                className="flex-1 max-h-28 min-h-[42px] bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-shadow text-slate-800"
                                placeholder="Type a message... (Press Enter to send)"
                                value={newMessage}
                                onChange={handleTyping}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-sm shadow-indigo-200 active:scale-95 shrink-0"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-6">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4 text-indigo-600 shadow-sm">
                        <MessageSquare size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Campus Messenger</h2>
                    <p className="text-slate-500 mt-2 max-w-sm text-center text-xs leading-relaxed">
                        Connect with peers, faculty, and project groups in real-time. Select a chat or create a new one to begin.
                    </p>
                    <button 
                        onClick={showNewChat} 
                        className="mt-6 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={16} /> Start New Chat
                    </button>
                </div>
            )}

        </div>
    );
};

export default ChatApp;

