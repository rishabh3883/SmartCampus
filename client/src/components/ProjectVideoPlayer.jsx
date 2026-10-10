import React from 'react';
import { Play, ExternalLink, Sparkles, Video } from 'lucide-react';

const ProjectVideoPlayer = ({
    title = "Smart Campus - Project Overview & Demo",
    subtitle = "Watch the comprehensive walkthrough of our Next-Gen Campus Management System",
    showCredits = true,
    className = ""
}) => {
    return (
        <div className={`bg-slate-900/95 backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-800 shadow-2xl relative overflow-hidden text-white ${className}`}>
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header / Badges */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Sparkles size={14} className="animate-pulse" />
                        <span>Official Project Video</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <a
                        href="https://canva.link/zm7qr9rvdgez86l"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all hover:scale-105 active:scale-95 shadow-md group"
                    >
                        <ExternalLink size={14} className="group-hover:text-emerald-400 transition-colors" />
                        <span>Open on Canva</span>
                    </a>
                </div>
            </div>

            {/* Video Container (Responsive 16:9 with sleek border) */}
            <div className="relative z-10 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 0,
                    paddingTop: '56.25%',
                    overflow: 'hidden',
                    borderRadius: '12px'
                }}>
                    <iframe
                        loading="lazy"
                        title="Smart Campus by DEEPAK JAT"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            border: 'none',
                            padding: 0,
                            margin: 0
                        }}
                        src="https://www.canva.com/design/DAHXkqiO5fg/JLZWfaHWyckFXZ-PSK6xPg/watch?embed"
                        allowFullScreen
                        allow="fullscreen; autoplay"
                    />
                </div>
            </div>

            {/* Footer / Author Credits */}
            {showCredits && (
                <div className="relative z-10 mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                            SC
                        </div>
                        <span>
                            Project Presentation: <a
                                href="https://www.canva.com/design/DAHXkqiO5fg/JLZWfaHWyckFXZ-PSK6xPg/watch?utm_content=DAHXkqiO5fg&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 font-bold hover:underline"
                            >
                                Smart Campus
                            </a> by <strong className="text-slate-200">DEEPAK JAT</strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Video size={13} className="text-emerald-400" />
                        <span>HD Video Walkthrough</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectVideoPlayer;
