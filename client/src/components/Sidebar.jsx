import React from 'react';
import { LayoutDashboard, Zap, Trash2, Settings, LifeBuoy } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="h-screen w-64 bg-slate-900/95 backdrop-blur-md text-white fixed left-0 top-0 flex flex-col border-r border-slate-800 z-50">
            <div className="p-6 flex items-center justify-center border-b border-slate-800/50">
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-wide">
                    EcoCampus
                </div>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                <NavItem icon={<Zap size={20} />} label="Energy Monitor" />
                <NavItem icon={<Trash2 size={20} />} label="Waste Mgmt" />
                <div className="pt-4 border-t border-slate-800 mt-4">
                    <NavItem icon={<Settings size={20} />} label="Settings" />
                    <NavItem icon={<LifeBuoy size={20} />} label="Help" />
                </div>
            </nav>

            <div className="p-4 bg-slate-800/50 m-4 rounded-xl border border-slate-700/50 text-xs text-slate-400">
                <div className="flex justify-between items-center mb-1">
                    <span>Status</span>
                    <span className="flex items-center text-emerald-400 font-semibold"><div className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></div> Online</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Mode</span>
                    <span className="text-blue-400 font-medium">AI Active</span>
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active }) => (
    <button className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-all duration-200 
    ${active ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30' : 'hover:bg-slate-800 text-slate-300'}`}>
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
);

export default Sidebar;
