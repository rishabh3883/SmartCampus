import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import { AlertTriangle, X } from 'lucide-react';

const EmergencyModal = () => {
    const [alertData, setAlertData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        socket.on('emergency-alert', (data) => {
            console.log("EMERGENCY RECEIVED:", data);
            setAlertData(data);
            setIsVisible(true);

            // Optional: Play sound or vibrate
            if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
        });

        return () => {
            socket.off('emergency-alert');
        };
    }, []);

    if (!isVisible || !alertData) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-900/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-4 border-red-600 text-center relative overflow-hidden">
                {/* Background Pulse Animation */}
                <div className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-10 animate-pulse"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <AlertTriangle size={48} />
                    </div>

                    <h2 className="text-4xl font-black text-red-600 mb-2 tracking-tighter uppercase">Emergency Alert</h2>
                    <p className="text-2xl font-bold text-slate-100 mb-6">{alertData.title || "Security Violation Detected"}</p>

                    <div className="bg-red-50 border border-red-200 p-6 rounded-2xl w-full mb-8 text-left">
                        <p className="text-red-800 text-lg font-medium">{alertData.description || "An emergency has been reported. Please follow safety protocols immediately."}</p>
                        {alertData.location && (
                            <div className="mt-4 pt-4 border-t border-red-200 text-sm font-bold text-red-700">
                                📍 Reported at: {alertData.location}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-900 transition-colors flex items-center gap-2"
                    >
                        <X size={20} /> Acknowledge & Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyModal;
