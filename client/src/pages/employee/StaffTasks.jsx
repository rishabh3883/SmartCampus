import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { CheckCircle, Clock } from 'lucide-react';

const StaffTasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/environment/tasks?role=Employee');
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    const markComplete = async (id) => {
        if (!window.confirm("Mark this task as complete?")) return;
        try {
            await API.put(`/environment/tasks/${id}`, { status: 'Completed' });
            fetchTasks();
        } catch (err) {
            alert("Update Failed");
        }
    };

    const pendingTasks = tasks.filter(t => t.status === 'Published' || t.status === 'In Progress');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    return (
        <div className="min-h-screen pb-10">
            <Navbar />

            <div className="page-container max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Sustainability Tasks</h1>
                    <p className="text-slate-400">Execute campus protocols assigned by the Environmental Observer.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pending Tasks */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-amber-400 flex items-center mb-4">
                            <Clock className="mr-2" size={20} /> Pending Actions
                        </h2>
                        {pendingTasks.length === 0 && (
                            <div className="p-8 text-center border-2 border-dashed border-slate-700 rounded-xl">
                                <p className="text-slate-500">No pending tasks.</p>
                            </div>
                        )}
                        {pendingTasks.map(task => (
                            <div key={task._id} className="card border-l-4 border-l-amber-500">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded uppercase border border-amber-500/20">{task.priority} Priority</span>
                                    <span className="text-[10px] text-slate-500">{new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{task.description}</p>
                                <button
                                    onClick={() => markComplete(task._id)}
                                    className="btn btn-primary w-full bg-emerald-600 hover:bg-emerald-700 border-none"
                                >
                                    <CheckCircle className="mr-2" size={18} /> Mark as Complete
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Completed Tasks */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-emerald-400 flex items-center mb-4">
                            <CheckCircle className="mr-2" size={20} /> Completed History
                        </h2>
                        {completedTasks.length === 0 && <p className="text-slate-500">No completed tasks history.</p>}
                        {completedTasks.map(task => (
                            <div key={task._id} className="card opacity-75 hover:opacity-100 transition-opacity bg-slate-800/50">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded uppercase border border-emerald-500/20">DONE</span>
                                </div>
                                <h3 className="text-md font-bold text-slate-300 mb-1">{task.title}</h3>
                                <p className="text-slate-500 text-xs">{task.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffTasks;
