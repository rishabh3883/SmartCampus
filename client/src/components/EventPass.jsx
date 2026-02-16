import React from 'react';
import { QrCode, Calendar, Clock, MapPin, User, Hash } from 'lucide-react';

const EventPass = ({ booking }) => {
    if (!booking) return null;

    const { eventId, userId, qrCode, createdAt } = booking;
    const event = eventId;
    const user = userId;

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full mx-auto border border-slate-200 relative">
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-indigo-500 opacity-50 blur-3xl"></div>
                <h2 className="text-xl font-black uppercase tracking-widest relative z-10">Digital Pass</h2>
                <div className="text-xs font-mono opacity-80 mt-1 relative z-10">{qrCode}</div>
            </div>

            {/* Content */}
            <div className="p-6 relative">
                {/* Event Details */}
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-2">{event.title}</h3>
                    <div className="flex justify-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(event.date).toLocaleDateString()}</span>
                        <span className="flex items-center"><MapPin size={14} className="mr-1" /> {event.venue}</span>
                    </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 mb-6 flex flex-col items-center justify-center">
                    <QrCode size={128} className="text-slate-800" />
                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">Scan for Entry</p>
                </div>

                {/* Attendee Details */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center text-slate-600 text-sm font-medium">
                            <User size={16} className="mr-2 text-indigo-500" /> Attendee
                        </div>
                        <div className="text-slate-800 font-bold text-sm">{user.name || 'Student'}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center text-slate-600 text-sm font-medium">
                            <Hash size={16} className="mr-2 text-indigo-500" /> Enrollment
                        </div>
                        <div className="text-slate-800 font-bold text-sm">{user.enrollmentNumber || 'N/A'}</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center text-slate-600 text-sm font-medium">
                            <Clock size={16} className="mr-2 text-indigo-500" /> Booked On
                        </div>
                        <div className="text-slate-800 font-bold text-sm">{new Date(createdAt).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Rules */}
                {event.rules && event.rules.length > 0 && (
                    <div className="mt-6 border-t border-slate-100 pt-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Entry Rules</h4>
                        <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
                            {event.rules.map((rule, idx) => (
                                <li key={idx}>{rule}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400">This is a system generated pass. Valid ID required.</p>
            </div>
        </div>
    );
};

export default EventPass;
