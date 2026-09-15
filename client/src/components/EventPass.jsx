import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, MapPin, User, Hash, CheckCircle, ShieldCheck, Ticket } from 'lucide-react';

const EventPass = ({ booking }) => {
    if (!booking) return null;

    const { eventId, userId, qrCode, createdAt, attended, attendedAt, attendeeName, attendeeEmail, enrollmentNumber } = booking;
    const event = eventId || {};
    const user = userId || {};

    const displayName = attendeeName || user.name || 'Student Attendee';
    const displayEnrollment = enrollmentNumber || user.enrollmentNumber || user.employeeId || 'N/A';
    const displayEmail = attendeeEmail || user.email || 'N/A';

    // Construct detailed QR payload
    const qrPayload = JSON.stringify({
        ticketId: qrCode,
        event: event.title || 'Campus Event',
        venue: event.venue || 'Campus Auditorium',
        date: event.date ? new Date(event.date).toLocaleDateString() : '',
        student: displayName,
        enrollment: displayEnrollment,
        email: displayEmail,
        valid: true
    });

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-sm w-full mx-auto border border-slate-200 relative animate-in zoom-in-95 duration-300">
            {/* Pass Header */}
            <div className={`p-6 text-white text-center relative overflow-hidden transition-colors ${
                attended ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900'
            }`}>
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 blur-2xl pointer-events-none"></div>
                <div className="relative z-10 flex items-center justify-center gap-2 mb-1">
                    <Ticket size={20} />
                    <h2 className="text-lg font-black uppercase tracking-widest">Official Entry Pass</h2>
                </div>
                <div className="text-xs font-mono opacity-90 relative z-10 bg-black/20 py-1 px-3 rounded-full inline-block mt-1">
                    {qrCode}
                </div>
                
                {/* Entry Badge */}
                <div className="mt-3 relative z-10">
                    {attended ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md">
                            <CheckCircle size={14} /> CHECKED IN AT VENUE
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs">
                            <ShieldCheck size={14} /> VALID FOR ENTRY
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 relative space-y-6">
                {/* Event Details */}
                <div className="text-center">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{event.title || 'Campus Event'}</h3>
                    <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-indigo-500" /> {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-indigo-500" /> {event.venue || 'Campus Venue'}</span>
                    </div>
                </div>

                {/* Real SVG QR Code Container */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center shadow-inner relative group">
                    <QRCodeSVG
                        value={qrCode || qrPayload}
                        size={160}
                        level="H"
                        includeMargin={true}
                    />
                    <p className="text-[11px] font-bold text-slate-600 mt-3 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-600" /> Scan QR at Entry Gate
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 select-all">{qrCode}</p>
                </div>

                {/* Attendee Details Card */}
                <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5"><User size={14} className="text-indigo-500" /> Name</span>
                        <span className="text-slate-900 font-bold">{displayName}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5"><Hash size={14} className="text-indigo-500" /> ID / Roll No</span>
                        <span className="text-slate-900 font-bold font-mono">{displayEnrollment}</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5"><Clock size={14} className="text-indigo-500" /> Booked On</span>
                        <span className="text-slate-900 font-bold">{createdAt ? new Date(createdAt).toLocaleDateString() : 'Today'}</span>
                    </div>
                    {attended && (
                        <div className="flex items-center justify-between pt-1">
                            <span className="text-emerald-700 font-bold flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-600" /> Checked In At</span>
                            <span className="text-emerald-800 font-black font-mono">{new Date(attendedAt).toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Pass Footer */}
            <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-semibold">Smart Campus QR Pass • Show at Venue Entrance</p>
            </div>
        </div>
    );
};

export default EventPass;
