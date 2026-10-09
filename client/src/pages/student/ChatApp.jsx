import React, { useState, useEffect, useRef } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import { SERVER_URL } from '../../config';
import { Search, Send, Users, MessageSquare, Phone, Video, MoreVertical, Plus, X } from 'lucide-react';
import moment from 'moment';

const ChatApp = ({ isEmbedded }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const messagesEndRef = useRef(null);

    // Modal state
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [searchUser, setSearchUser] = useState('');

    // Initial Fetch & Socket Setup
    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        fetchConversations();

        return () => newSocket.close();
    }, []);

    // Socket Event Listeners
    useEffect(() => {
        if (!socket || !selectedConv) return;

        socket.emit('join-chat', selectedConv._id);

        const receiveHandler = (msg) => {
            if (msg.conversationId === selectedConv._id) {
                setMessages(prev => [...prev, msg]);
                scrollToBottom();
            }
        };

        const typingHandler = (name) => {
            setTypingUser(name);
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000); // clear after 3s
        };

        const stopTypingHandler = () => {
            setIsTyping(false);
        };

        socket.on('receive-message', receiveHandler);
        socket.on('user-typing', typingHandler);
        socket.on('user-stop-typing', stopTypingHandler);

        return () => {
            socket.off('receive-message', receiveHandler);
            socket.off('user-typing', typingHandler);
            socket.off('user-stop-typing', stopTypingHandler);
        };
    }, [socket, selectedConv]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const fetchConversations = async () => {
        try {
            const { data } = await API.get('/chat/conversations');
            setConversations(data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/chat/users');
            setUsersList(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const selectConversation = async (conv) => {
        setSelectedConv(conv);
        try {
            const { data } = await API.get(`/chat/messages/${conv._id}`);
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConv) return;

        try {
            await API.post('/chat/messages', {
                conversationId: selectedConv._id,
                content: newMessage
            });
            // Result is emitted via socket, so we don't manually append it here unless we disable socket echo
            setNewMessage('');
            socket.emit('stop-typing', selectedConv._id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (socket && selectedConv) {
            socket.emit('typing', { conversationId: selectedConv._id, userName: user.name });
        }
    };

    const showNewChat = () => {
        fetchUsers();
        setShowNewChatModal(true);
    };

    const startNewChat = async (id) => {
        try {
            const { data } = await API.post('/chat/conversations', { participantIds: [id], isGroup: false });
            fetchConversations();
            selectConversation(data);
            setShowNewChatModal(false);
        } catch (error) {
            alert('Failed to create chat. Make sure User ID is valid.');
        }
    };

    // Helpers
    const getChatName = (conv) => {
        if (conv.isGroup) return conv.groupName;
        const otherUser = conv.participants.find(p => p._id !== user.id);
        return otherUser ? otherUser.name : 'Unknown User';
    };

    const getChatIcon = (conv) => {
        if (conv.isGroup) return <Users className="text-white" size={20} />;
        const otherUser = conv.participants.find(p => p._id !== user.id);
        const initial = otherUser ? otherUser.name.charAt(0) : 'U';
        return <span className="font-bold text-white text-lg">{initial}</span>;
    };

    const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()));

    return (
        <div className={`w-full max-w-6xl mx-auto flex h-[calc(100vh-[120px])] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden ${isEmbedded ? '' : 'm-6'}`}>

            {/* Sidebar List */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50 relative">
                {/* Search & Header */}
                <div className="p-4 border-b border-slate-200 bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-800">Messages</h2>
                        <button onClick={showNewChat} className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors title='New Chat'">
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-shadow"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 p-6 text-center">
                            <MessageSquare opacity={0.5} size={32} />
                            <p className="text-sm">No conversations yet.</p>
                            <button onClick={showNewChat} className="text-indigo-600 font-medium text-sm hover:underline">Start a new chat</button>
                        </div>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv._id}
                                onClick={() => selectConversation(conv)}
                                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-slate-100/50
                                    ${selectedConv?._id === conv._id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-100/50 border-l-4 border-l-transparent'}
                                `}
                            >
                                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm
                                    ${conv.isGroup ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-400 to-cyan-500'}
                                `}>
                                    {getChatIcon(conv)}
                                    {/* Mock online status for 1on1 */}
                                    {!conv.isGroup && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-bold text-slate-800 text-sm truncate">{getChatName(conv)}</h3>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {conv.lastMessage ? moment(conv.lastMessage.createdAt).format('LT') : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">
                                        {conv.lastMessage?.content || 'Say hi! 👋'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* New Chat Modal */}
                {showNewChatModal && (
                    <div className="absolute inset-0 bg-white z-20 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800">New Chat</h3>
                            <button onClick={() => setShowNewChatModal(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="relative border-b border-slate-100 pb-4 mb-2">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search users by name..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                            {filteredUsers.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm py-4">No users found.</p>
                            ) : (
                                filteredUsers.map(u => (
                                    <div
                                        key={u._id}
                                        onClick={() => startNewChat(u._id)}
                                        className="flex items-center gap-3 p-2 hover:bg-indigo-50 rounded-xl cursor-pointer transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm shrink-0">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm leading-none">{u.name}</p>
                                            <p className="text-xs text-slate-500 mt-1">{u.role}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Area */}
            {selectedConv ? (
                <div className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/30">
                    {/* Chat Header */}
                    <div className="h-[76px] px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0
                                ${selectedConv.isGroup ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-400 to-cyan-500'}`}>
                                {getChatIcon(selectedConv)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 leading-tight">{getChatName(selectedConv)}</h3>
                                <p className="text-xs text-emerald-500 font-medium">{selectedConv.isGroup ? `${selectedConv.participants.length} members` : 'Online'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <button className="hover:text-indigo-600 transition-colors"><Phone size={20} /></button>
                            <button className="hover:text-indigo-600 transition-colors"><Video size={20} /></button>
                            <div className="w-px h-6 bg-slate-200"></div>
                            <button className="hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <MessageSquare size={48} className="mb-4 text-slate-400" />
                                <p className="text-slate-500">No messages here yet.</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isMe = msg.senderId?._id === user.id || msg.senderId === user.id; // handle populate variations
                                const showAvatar = !isMe && selectedConv.isGroup && (index === 0 || messages[index - 1].senderId?._id !== msg.senderId?._id);

                                return (
                                    <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-end gap-2 max-w-[75%]">
                                            {showAvatar && (
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-[10px] shrink-0 mb-1">
                                                    {msg.senderId?.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                            {!showAvatar && !isMe && selectedConv.isGroup && <div className="w-6 shrink-0"></div>}

                                            <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-[15px]
                                                ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'}
                                            `}>
                                                {showAvatar && <div className="text-[10px] font-bold text-indigo-400 mb-0.5">{msg.senderId?.name}</div>}
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                    {moment(msg.createdAt).format('LT')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs italic opacity-70 animate-pulse w-fit px-4 py-2 bg-white rounded-2xl rounded-bl-sm shadow-sm border border-slate-100">
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                </span>
                                {typingUser} is typing
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-200 m-4 rounded-2xl shadow-sm">
                        <form onSubmit={handleSendMessage} className="flex gap-3 items-end">
                            <textarea
                                className="flex-1 max-h-32 min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-shadow"
                                placeholder="Type a message..."
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
                                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-200 active:scale-95 shrink-0"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <MessageSquare className="text-indigo-400" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Campus Chat</h2>
                    <p className="text-slate-500 mt-2 max-w-sm text-center text-sm">Select a conversation or start a new one to connect with students, faculty, and clubs instantly.</p>
                    <button onClick={showNewChat} className="mt-8 bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
                        Start Messaging
                    </button>
                </div>
            )}

        </div>
    );
};

export default ChatApp;
