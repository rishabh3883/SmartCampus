import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import API from '../services/api';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your Green Campus Assistant. 🌿\n\nI can help you report issues like:\n- 🍔 Food Quality / Hygiene\n- 🧹 Hostel Cleanliness\n- 💧 Water/Food Wastage\n- ⚡ Electricity Issues\n\nJust type what's wrong!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [reportStep, setReportStep] = useState(0); // 0: Idle, 1: Category, 2: Location, 3: Description, 4: Submitting
    const [reportData, setReportData] = useState({ type: '', title: '', description: '' });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const addBotMessage = (text) => {
        setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot' }]);
    };

    const handleReportFlow = async (text) => {
        const lower = text.toLowerCase();

        // Step 1: Detect Intent or Ask Category
        if (reportStep === 0) {
            if (lower.includes('food') || lower.includes('hygiene') || lower.includes('mess')) {
                setReportData({ ...reportData, type: 'Food/Hygiene' });
                setReportStep(2);
                return "Got it. 🍔 Reporting a Food/Hygiene issue. \n\nWhere is this? (e.g., Mess Hall A, Canteen)";
            }
            if (lower.includes('clean') || lower.includes('dust') || lower.includes('garbage')) {
                setReportData({ ...reportData, type: 'Cleanliness' });
                setReportStep(2);
                return "Understood. 🧹 Reporting a Cleanliness issue. \n\nWhich room or area? (e.g., Room 301, Corridor 2)";
            }
            if (lower.includes('water') || lower.includes('leak')) {
                setReportData({ ...reportData, type: 'Water' });
                setReportStep(2);
                return "Noted. 💧 Reporting a Water issue. \n\nWhere is the leakage/wastage? (e.g., Bathroom 2nd Floor)";
            }
            if (lower.includes('electric') || lower.includes('light') || lower.includes('fan')) {
                setReportData({ ...reportData, type: 'Electricity' });
                setReportStep(2);
                return "Okay. ⚡ Reporting an Electricity issue. \n\nLocation? (e.g., Room 102, Common Room)";
            }

            // General "Report" intent
            if (lower.includes('report') || lower.includes('complain') || lower.includes('issue')) {
                setReportStep(1);
                return "I can help file a report. What kind of issue is it?\n(Food, Cleanliness, Water, Electricity, Other)";
            }

            // Standard Query Responses (Fallback)
            if (lower.includes('hello') || lower.includes('hi')) return "Hello! 👋 Type an issue to report it instantly.";
            if (lower.includes('streak')) return "🔥 Keep your streak alive by reporting valid issues daily!";

            return "I didn't quite catch that. Try saying 'Report Food Issue' or 'Water Leakage'.";
        }

        // Step 1: Manual Category Selection
        if (reportStep === 1) {
            let type = 'Other';
            if (lower.includes('food')) type = 'Food/Hygiene';
            else if (lower.includes('clean')) type = 'Cleanliness';
            else if (lower.includes('water')) type = 'Water';
            else if (lower.includes('elec')) type = 'Electricity';

            setReportData({ ...reportData, type });
            setReportStep(2);
            return `Okay, reporting: ${type}. \n\nWhere is this happening? (Location)`;
        }

        // Step 2: Location (Title)
        if (reportStep === 2) {
            setReportData({ ...reportData, title: text });
            setReportStep(3);
            return "Got the location. \n\nPlease describe the issue briefly (e.g., 'Tap broken', 'Stale food served').";
        }

        // Step 3: Description & Submit
        if (reportStep === 3) {
            const finalData = { ...reportData, description: text };
            setReportData(finalData);
            setReportStep(4);

            addBotMessage("Submitting your report... ⏳");

            try {
                // API Call
                await API.post('/complaints', {
                    type: finalData.type,
                    title: finalData.title,
                    description: finalData.description
                });

                setReportStep(0); // Reset
                setReportData({ type: '', title: '', description: '' });
                return `✅ **Complaint Registered!**\n\nThe staff has been notified about the ${finalData.type} issue at ${finalData.title}.\n\nThank you for keeping the campus green! 🌿`;
            } catch (err) {
                setReportStep(0);
                return "❌ Oops! Something went wrong submitting the report. Please try again later.";
            }
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate typing delay
        setTimeout(async () => {
            const responseText = await handleReportFlow(userMsg.text);
            addBotMessage(responseText);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col transition-all animate-enter origin-bottom-right ring-1 ring-emerald-50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot size={24} className="text-emerald-50" />
                            <div>
                                <h3 className="font-bold text-sm">Green Assistant</h3>
                                <p className="text-[10px] text-emerald-100 opacity-90 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> {reportStep > 0 ? 'Reporting Mode' : 'Online'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-80 bg-emerald-50/30 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'user'
                                        ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                                        : 'bg-white text-slate-700 border border-emerald-100 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-emerald-100 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-slate-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all text-slate-800 placeholder:text-slate-400"
                            placeholder={reportStep > 0 ? "Type answer..." : "Report an issue..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!input.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${isOpen ? 'bg-slate-200 text-slate-600 rotate-90' : 'bg-emerald-600 text-white hover:bg-emerald-700 ring-4 ring-emerald-100'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} fill="currentColor" />}
            </button>
        </div>
    );
};

export default ChatbotWidget;
