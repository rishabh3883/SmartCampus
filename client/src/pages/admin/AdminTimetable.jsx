import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Calendar, Clock, BookOpen, User, MapPin, PlusCircle, LayoutGrid, CheckCircle, AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

const AdminTimetable = () => {
    const [view, setView] = useState('generate'); // 'generate' or 'master'
    const [masterTab, setMasterTab] = useState('courses');

    // Master Data State
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);

    // Timetable State
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form inputs state
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        try {
            const [crs, cls, sub, tch, rm] = await Promise.all([
                API.get('/master-data/courses'),
                API.get('/master-data/classes'),
                API.get('/master-data/subjects'),
                API.get('/master-data/teachers'),
                API.get('/master-data/rooms')
            ]);
            setCourses(crs.data.data);
            setClasses(cls.data.data);
            setSubjects(sub.data.data);
            setTeachers(tch.data.data);
            setRooms(rm.data.data);
        } catch (err) {
            console.error('Failed to fetch master data', err);
        }
    };

    const handleGenerate = async () => {
        if (!selectedClass) return alert("Please select a class");
        setLoading(true);
        setError(null);
        setTimetable(null);
        try {
            const { data } = await API.post('/timetable/generate', { classId: selectedClass, semester: "1" });
            if (data.success) {
                // Fetch the populated timetable to show names instead of IDs
                await fetchTimetable(selectedClass);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimetable = async (classId) => {
        try {
            const { data } = await API.get(`/timetable/class/${classId}`);
            if (data.success) {
                setTimetable(data.data);
            }
        } catch (err) {
            setTimetable(null);
        }
    };

    useEffect(() => {
        if (selectedClass && view === 'generate') {
            fetchTimetable(selectedClass);
        }
    }, [selectedClass, view]);


    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMultiSelectChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, [e.target.name]: values });
    };

    const submitMasterData = async (e, endpoint) => {
        e.preventDefault();
        try {
            await API.post(`/master-data/${endpoint}`, formData);
            setFormData({});
            fetchMasterData();
            alert(`Added to ${endpoint} successfully!`);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDeleteTimetable = async () => {
        if (!selectedClass) return;
        if (!window.confirm("Are you sure you want to delete this class timetable?")) return;
        setLoading(true);
        try {
            const { data } = await API.delete(`/timetable/class/${selectedClass}`);
            if (data.success) {
                setTimetable(null);
                alert("Timetable deleted successfully!");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMasterData = async (id, endpoint) => {
        if (!window.confirm(`Are you sure you want to delete this from ${endpoint}?`)) return;
        try {
            await API.delete(`/master-data/${endpoint}/${id}`);
            fetchMasterData(); // Refresh the list
            alert(`Deleted from ${endpoint} successfully!`);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete item.");
        }
    };

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const DAYS_FULL = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const TIMES = [
        "09:30 - 10:25", "10:25 - 11:20", "11:20 - 12:20",
        "12:20 - 01:15", "01:15 - 02:10",
        "02:30 - 03:25", "03:25 - 04:20"
    ];

    const getUniqueSubjects = (timetableData) => {
        if (!timetableData || !timetableData.schedule) return [];
        const unique = [];
        const seen = new Set();
        timetableData.schedule.forEach(day => {
            day.slots.forEach(slot => {
                if (slot && slot.subject && slot.teacher) {
                    const key = `${slot.subject._id}_${slot.teacher._id}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        unique.push({ subject: slot.subject, teacher: slot.teacher });
                    }
                }
            });
        });
        return unique;
    };

    const renderSlotCell = (slot, timeIdx, dayShort) => {
        if (!slot || !slot.subject) {
            return (
                <td key={`${dayShort}-${timeIdx}`} className="border border-slate-400 p-2 uppercase text-slate-100">
                    PROJECT/SELF-STUDY
                </td>
            );
        }

        const classNameDisplay = classes.find(c => c._id === timetable.classId)?.name || 'CLASS';
        const subjShort = slot.subject.name.substring(0, 5).toUpperCase();
        const teacherShort = slot.teacher.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const roomName = slot.room.name.toUpperCase();

        const isLab = slot.subject.type === 'Lab';
        const bgColor = isLab ? 'bg-amber-300' : 'bg-slate-900';

        return (
            <td key={`${dayShort}-${timeIdx}`} className={`border border-slate-400 p-2 uppercase ${bgColor} text-black font-semibold tracking-wide leading-relaxed`}>
                {classNameDisplay}:{subjShort}:{teacherShort}:{roomName}
            </td>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-slate-800/40 font-sans">
            <Navbar />

            {/* Header Tabs */}
            <div className="bg-slate-900 border-b border-slate-700 px-8 py-4 flex gap-6 sticky top-0 z-20 shadow-md shadow-black/20">
                <button
                    onClick={() => setView('generate')}
                    className={`font-semibold pb-2 border-b-2 px-2 transition-colors ${view === 'generate' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-100'}`}
                >
                    <div className="flex items-center gap-2"><LayoutGrid size={18} /> Schedule Generator</div>
                </button>
                <button
                    onClick={() => setView('master')}
                    className={`font-semibold pb-2 border-b-2 px-2 transition-colors ${view === 'master' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-100'}`}
                >
                    <div className="flex items-center gap-2"><BookOpen size={18} /> Master Data</div>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 relative">
                <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* ===== GENERATE VIEW ===== */}
                    {view === 'generate' && (
                        <>
                            <div className="card bg-slate-900 p-6 shadow-md shadow-black/20 border border-slate-700">
                                <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                                    <Calendar className="text-indigo-600" /> Class Timetables
                                </h3>

                                <div className="flex gap-4 items-end bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                                    <div className="flex-1">
                                        <label className="block text-sm font-bold text-slate-300 mb-1">Select Class</label>
                                        <select
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                        >
                                            <option value="">-- Select a Class --</option>
                                            {classes.map(c => (
                                                <option key={c._id} value={c._id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleGenerate}
                                            disabled={loading || !selectedClass}
                                            className="btn btn-primary py-2.5 px-6 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md disabled:opacity-50"
                                        >
                                            {loading ? <RefreshCw className="animate-spin inline mr-2" size={18} /> : <CheckCircle className="inline mr-2" size={18} />}
                                            Auto-Generate
                                        </button>
                                        <button
                                            onClick={handleDeleteTimetable}
                                            disabled={loading || !selectedClass}
                                            className="btn py-2.5 px-4 whitespace-nowrap bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-lg shadow-md shadow-black/20 disabled:opacity-50 flex items-center gap-2"
                                            title="Delete Timetable"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-4 p-4 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 flex items-start gap-2">
                                        <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-bold">Generation Failed</h4>
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* TIMETABLE GRID */}
                            {timetable && timetable.schedule && (
                                <div className="mt-8 bg-slate-900 overflow-hidden shadow border border-slate-400">
                                    {/* Header matching Parul Univ */}
                                    <div className="p-2 text-xs">
                                        <div className="text-center font-bold pb-2 uppercase text-black text-sm border-b border-black">FACULTY NAME: FACULTY OF ENGINEERING & TECHNOLOGY</div>
                                        <div className="text-center font-bold py-2 uppercase text-black text-xs border-b border-black">INSTITUTE NAME: PARUL INSTITUTE OF ENGINEERING & TECHNOLOGY</div>
                                        <div className="flex bg-slate-900 text-[10px] text-black border-b border-black">
                                            <div className="flex-1 font-bold border-r border-black px-2 py-1 leading-[18px]">
                                                ACADEMIC YEAR: 2025-26<br />
                                                SEMESTER: {timetable.semester === '1' ? '1ST' : (timetable.semester || '6TH')}<br />
                                                PROGRAM NAME: {classes.find(c => c._id === timetable.classId)?.course?.name || 'B.TECH CSE'}
                                            </div>
                                            <div className="flex-1 font-bold px-2 py-1 leading-[18px] flex justify-between items-start">
                                                <div>
                                                    YEAR: {classes.find(c => c._id === timetable.classId)?.year || '3rd'} YEAR<br />
                                                    LEVEL: UG<br />
                                                    DIVISION: {classes.find(c => c._id === timetable.classId)?.name || '6QUICK1'}
                                                </div>
                                                <div className="text-[9px] font-normal pt-4">EFFECTIVE FROM: 24-11-2025</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto p-2 pt-0 text-black">
                                        <table className="w-full border-collapse text-[11px] text-center border border-slate-400">
                                            <thead>
                                                <tr>
                                                    <th className="border border-slate-400 p-2 font-bold uppercase w-28 bg-slate-900 text-[10px]">TIME</th>
                                                    {DAYS_FULL.map(day => (
                                                        <th key={day} className="border border-slate-400 p-2 font-bold uppercase bg-slate-900 text-[10px]">
                                                            {day}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {TIMES.map((time, timeIdx) => {
                                                    if (timeIdx === 5) {
                                                        return (
                                                            <React.Fragment key={`recess-${timeIdx}`}>
                                                                <tr>
                                                                    <td className="border border-slate-400 p-1.5 font-bold whitespace-nowrap bg-slate-900">02:10 - 02:30</td>
                                                                    <td colSpan={6} className="border border-slate-400 bg-slate-900 font-bold tracking-[1em] text-slate-100 text-[10px]">RECREATION / BREAK</td>
                                                                </tr>
                                                                <tr key={time}>
                                                                    <td className="border border-slate-400 p-1.5 font-bold whitespace-nowrap bg-slate-900">{time}</td>
                                                                    {DAYS.map(dayShort => {
                                                                        const daySch = timetable.schedule.find(d => d.day === dayShort);
                                                                        const slot = daySch?.slots[timeIdx];
                                                                        return renderSlotCell(slot, timeIdx, dayShort);
                                                                    })}
                                                                </tr>
                                                            </React.Fragment>
                                                        );
                                                    }

                                                    return (
                                                        <tr key={time}>
                                                            <td className="border border-slate-400 p-1.5 font-bold whitespace-nowrap bg-slate-900">{time}</td>
                                                            {DAYS.map(dayShort => {
                                                                const daySch = timetable.schedule.find(d => d.day === dayShort);
                                                                const slot = daySch?.slots[timeIdx];
                                                                return renderSlotCell(slot, timeIdx, dayShort);
                                                            })}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>

                                        {/* Legend below timetable */}
                                        <table className="w-full border-collapse text-[9px] text-center border border-slate-400 mt-2 bg-slate-900 text-black">
                                            <thead className="font-bold uppercase">
                                                <tr>
                                                    <th className="border border-slate-400 p-1.5 w-24">SUBJECT_CODE</th>
                                                    <th className="border border-slate-400 p-1.5">SUBJECT_NAME</th>
                                                    <th className="border border-slate-400 p-1.5">SHORT_NAME</th>
                                                    <th className="border border-slate-400 p-1.5">FACULTY FULL_NAME</th>
                                                    <th className="border border-slate-400 p-1.5">FACULTY SHORT NAME</th>
                                                    <th className="border border-slate-400 p-1.5">EMAIL ID</th>
                                                    <th className="border border-slate-400 p-1.5 w-20">MIS ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getUniqueSubjects(timetable).map((s, i) => (
                                                    <tr key={i}>
                                                        <td className="border border-slate-400 p-1.5 uppercase font-medium">{s.subject.code}</td>
                                                        <td className="border border-slate-400 p-1.5 text-left font-medium">{s.subject.name}</td>
                                                        <td className="border border-slate-400 p-1.5 uppercase font-medium">{s.subject.name.substring(0, 5)}</td>
                                                        <td className="border border-slate-400 p-1.5 uppercase font-medium">{s.teacher.name}</td>
                                                        <td className="border border-slate-400 p-1.5 uppercase font-medium">{s.teacher.name.split(' ').map(n => n[0]).join('')}</td>
                                                        <td className="border border-slate-400 p-1.5 lowercase">{s.teacher.employeeId.toLowerCase()}@paruluniversity.ac.in</td>
                                                        <td className="border border-slate-400 p-1.5 font-medium">{s.teacher.employeeId.slice(-5)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Meta lines */}
                                        <div className="flex border border-slate-400 border-t-0 mt-0 text-[8px] uppercase bg-slate-900 text-black">
                                            <div className="flex-[0.3] border-r border-slate-400 p-1 font-bold">CLASSROOM NO:</div>
                                            <div className="flex-1 border-r border-slate-400 p-1">{getUniqueSubjects(timetable).filter(s => s.subject.type !== 'Lab').map(s => `D-${s.teacher.employeeId.slice(-3)}`).join(',')}</div>
                                            <div className="flex-[0.5] border-r border-slate-400 p-1 font-bold">M/F / FACULTY REPRESENTATIVE</div>
                                            <div className="flex-[1.5] p-1">{getUniqueSubjects(timetable)[0]?.teacher.name.toUpperCase()}</div>
                                        </div>

                                        {/* Footer signature area */}
                                        <div className="flex border border-slate-400 mt-2 text-[10px] uppercase font-bold text-center bg-slate-900 text-black h-24">
                                            <div className="flex-1 border-r border-slate-400 flex flex-col justify-between p-2">
                                                <span>SIGN</span>
                                                <span>Time Table Coordinator</span>
                                            </div>
                                            <div className="flex-1 border-r border-slate-400 flex flex-col justify-between p-2">
                                                <span>SIGN & SEAL</span>
                                                <div className="text-[14px] handwritten tracking-widest font-normal opacity-70">Dr. Gandhi</div>
                                                <span>Head of Department</span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between p-2">
                                                <span>SIGN & SEAL</span>
                                                <span>Principal / Dean</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!timetable && !loading && (
                                <div className="text-center py-20 bg-slate-900 rounded-xl shadow-md shadow-black/20 border border-slate-700">
                                    <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h4 className="text-lg font-bold text-slate-300">No Timetable Selected</h4>
                                    <p className="text-slate-500 text-sm mt-1">Select a class from the dropdown to view or generate its schedule.</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* ===== MASTER DATA VIEW ===== */}
                    {view === 'master' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                            {/* Master Data Sidebar */}
                            <div className="card bg-slate-900 p-4 space-y-2 border border-slate-700 shadow-md shadow-black/20 md:col-span-1 h-fit sticky top-24">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-4">Entities</h3>
                                {[
                                    { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
                                    { id: 'classes', label: 'Classes', icon: LayoutGrid, count: classes.length },
                                    { id: 'subjects', label: 'Subjects', icon: BookOpen, count: subjects.length },
                                    { id: 'teachers', label: 'Teachers', icon: User, count: teachers.length },
                                    { id: 'rooms', label: 'Rooms', icon: MapPin, count: rooms.length }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setMasterTab(t.id)}
                                        className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-colors ${masterTab === t.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-300 hover:bg-slate-800/40'}`}
                                    >
                                        <div className="flex items-center gap-3"><t.icon size={18} className={masterTab === t.id ? 'text-indigo-500' : 'text-slate-500'} /> {t.label}</div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${masterTab === t.id ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-800 text-slate-500'}`}>{t.count}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Master Data Content */}
                            <div className="md:col-span-3 space-y-6">

                                {/* Form Panel */}
                                <div className="card bg-slate-900 p-6 shadow-md shadow-black/20 border border-slate-700">
                                    <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
                                        <PlusCircle className="text-emerald-500" size={20} /> Add New {masterTab.slice(0, -1)}
                                    </h3>

                                    {/* Courses Form */}
                                    {masterTab === 'courses' && (
                                        <form onSubmit={(e) => submitMasterData(e, 'courses')} className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Course Name</label><input required name="name" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. BCA" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Course Code</label><input required name="code" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. CS101" /></div>
                                            <button type="submit" className="btn btn-primary col-span-2">Save Course</button>
                                        </form>
                                    )}

                                    {/* Classes Form */}
                                    {masterTab === 'classes' && (
                                        <form onSubmit={(e) => submitMasterData(e, 'classes')} className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Class Name</label><input required name="name" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. BCA 2nd Yr Sec A" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Course</label>
                                                <select required name="course" onChange={handleFormChange} className="w-full input-field bg-slate-900">
                                                    <option value="">Select Course</option>
                                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Year</label><input required type="number" name="year" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. 2" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Section</label><input required name="section" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. A" /></div>
                                            <button type="submit" className="btn btn-primary col-span-2">Save Class</button>
                                        </form>
                                    )}

                                    {/* Subjects Form */}
                                    {masterTab === 'subjects' && (
                                        <form onSubmit={(e) => submitMasterData(e, 'subjects')} className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Subject Name</label><input required name="name" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. Data Structures" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Subject Code</label><input required name="code" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. DS201" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Credits (Hrs/Week)</label><input required type="number" name="credits" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. 4" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Type</label>
                                                <select required name="type" onChange={handleFormChange} className="w-full input-field bg-slate-900">
                                                    <option value="">Select Type</option>
                                                    <option value="Lecture">Lecture (Theory)</option>
                                                    <option value="Lab">Lab (Practical)</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2"><label className="text-sm font-bold text-slate-300 mb-1 block">Course</label>
                                                <select required name="course" onChange={handleFormChange} className="w-full input-field bg-slate-900">
                                                    <option value="">Select Course</option>
                                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-primary col-span-2">Save Subject</button>
                                        </form>
                                    )}

                                    {/* Teachers Form */}
                                    {masterTab === 'teachers' && (
                                        <form onSubmit={(e) => submitMasterData(e, 'teachers')} className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Teacher Name</label><input required name="name" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. Prof. Sharma" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Employee ID</label><input required name="employeeId" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. EMP123" /></div>
                                            <div className="col-span-2">
                                                <label className="text-sm font-bold text-slate-300 mb-1 block">Subjects (Hold Ctrl/Cmd to select multiple)</label>
                                                <select multiple name="subjects" onChange={handleMultiSelectChange} className="w-full input-field bg-slate-900 h-24">
                                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-primary col-span-2">Save Teacher</button>
                                        </form>
                                    )}

                                    {/* Rooms Form */}
                                    {masterTab === 'rooms' && (
                                        <form onSubmit={(e) => submitMasterData(e, 'rooms')} className="grid grid-cols-2 gap-4">
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Room Name/Number</label><input required name="name" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. Room 101" /></div>
                                            <div><label className="text-sm font-bold text-slate-300 mb-1 block">Capacity</label><input required type="number" name="capacity" onChange={handleFormChange} className="w-full input-field" placeholder="e.g. 60" /></div>
                                            <div className="col-span-2"><label className="text-sm font-bold text-slate-300 mb-1 block">Type</label>
                                                <select required name="type" onChange={handleFormChange} className="w-full input-field bg-slate-900">
                                                    <option value="">Select Type</option>
                                                    <option value="Classroom">Classroom</option>
                                                    <option value="Lab">Lab</option>
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-primary col-span-2">Save Room</button>
                                        </form>
                                    )}
                                </div>

                                {/* List Panel */}
                                <div className="card bg-slate-900 p-6 shadow-md shadow-black/20 border border-slate-700">
                                    <h3 className="text-lg font-bold text-slate-100 mb-4 border-b border-slate-800 pb-3">Existing {masterTab}</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-300">
                                            {masterTab === 'courses' && (
                                                <>
                                                    <thead className="bg-slate-800/40 text-slate-500 font-bold"><tr><th className="p-3 rounded-tl-lg">Name</th><th className="p-3">Code</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                    <tbody>{courses.map(c => <tr key={c._id} className="border-b border-slate-50"><td className="p-3">{c.name}</td><td className="p-3">{c.code}</td>
                                                        <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'courses')} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                                                    </tr>)}</tbody>
                                                </>
                                            )}
                                            {masterTab === 'classes' && (
                                                <>
                                                    <thead className="bg-slate-800/40 text-slate-500 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Course</th><th className="p-3">Year</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                    <tbody>{classes.map(c => <tr key={c._id} className="border-b border-slate-50"><td className="p-3">{c.name}</td><td className="p-3">{c.course?.name}</td><td className="p-3">{c.year}</td>
                                                        <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'classes')} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                                                    </tr>)}</tbody>
                                                </>
                                            )}
                                            {masterTab === 'subjects' && (
                                                <>
                                                    <thead className="bg-slate-800/40 text-slate-500 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Credits</th><th className="p-3">Type</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                    <tbody>{subjects.map(c => <tr key={c._id} className="border-b border-slate-50"><td className="p-3 font-medium text-slate-200">{c.name}</td><td className="p-3">{c.credits}</td><td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${c.type === 'Lab' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>{c.type}</span></td>
                                                        <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'subjects')} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                                                    </tr>)}</tbody>
                                                </>
                                            )}
                                            {masterTab === 'teachers' && (
                                                <>
                                                    <thead className="bg-slate-800/40 text-slate-500 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Emp ID</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                    <tbody>{teachers.map(c => <tr key={c._id} className="border-b border-slate-50"><td className="p-3">{c.name}</td><td className="p-3">{c.employeeId}</td>
                                                        <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'teachers')} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                                                    </tr>)}</tbody>
                                                </>
                                            )}
                                            {masterTab === 'rooms' && (
                                                <>
                                                    <thead className="bg-slate-800/40 text-slate-500 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Capacity</th><th className="p-3">Type</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                    <tbody>{rooms.map(c => <tr key={c._id} className="border-b border-slate-50"><td className="p-3">{c.name}</td><td className="p-3">{c.capacity}</td><td className="p-3"><span className={`px-2 py-1 rounded text-xs font-bold ${c.type === 'Lab' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>{c.type}</span></td>
                                                        <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'rooms')} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 size={16} /></button></td>
                                                    </tr>)}</tbody>
                                                </>
                                            )}
                                        </table>
                                        {eval(masterTab).length === 0 && <p className="text-center text-slate-500 py-6 text-sm">No records found.</p>}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTimetable;
