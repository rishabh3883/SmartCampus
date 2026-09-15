import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { FileSpreadsheet, Download, Users, CheckCircle, XCircle, Clock, Search, RefreshCw, Sparkles, Filter } from 'lucide-react';

const SectionAttendanceReports = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const res = await API.get('/attendance/sections');
            setSummary(res.data);
        } catch (err) {
            console.error("Failed to fetch section attendance summary", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadExcel = async () => {
        setExporting(true);
        try {
            const response = await API.get('/attendance/export/excel', { responseType: 'blob' });
            
            // Trigger Browser File Download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Section_Attendance_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download Excel report.");
        } finally {
            setExporting(false);
        }
    };

    const sectionsList = summary ? Object.keys(summary.sections) : [];

    // Filtered records for selected section
    const getFilteredRecords = () => {
        if (!summary || !summary.rawRecords) return [];
        let list = summary.rawRecords;

        if (selectedSection !== 'ALL') {
            list = list.filter(r => `${r.course} (${r.section})` === selectedSection || r.section === selectedSection);
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            list = list.filter(r =>
                r.studentName.toLowerCase().includes(term) ||
                r.enrollmentNumber.toLowerCase().includes(term) ||
                r.subject.toLowerCase().includes(term) ||
                r.section.toLowerCase().includes(term)
            );
        }

        return list;
    };

    const recordsToDisplay = getFilteredRecords();

    return (
        <div className="min-h-screen pb-12 bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="page-container max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
                
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <FileSpreadsheet size={240} className="text-white" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles size={14} /> Master Attendance & Excel Reporting System
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Section Attendance Excel Reports
                        </h1>
                        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                            Generate and download multi-sheet <span className="text-emerald-400 font-bold">.XLSX Excel Workbooks</span> for every section, course, event QR check-in, and library seat occupancy!
                        </p>
                    </div>

                    <div className="relative z-10">
                        <button
                            onClick={handleDownloadExcel}
                            disabled={exporting}
                            className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-emerald-400/20 flex items-center gap-2 text-sm hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {exporting ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
                            Download All Sections Excel (.xlsx)
                        </button>
                    </div>
                </div>

                {/* Section Overview Cards */}
                {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {sectionsList.map(secKey => {
                            const secData = summary.sections[secKey];
                            return (
                                <div
                                    key={secKey}
                                    onClick={() => setSelectedSection(secKey)}
                                    className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 ${
                                        selectedSection === secKey
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-[1.02]'
                                            : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase ${
                                            selectedSection === secKey ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {secData.sectionName}
                                        </span>
                                        <span className="text-xs font-mono font-bold opacity-80">{secData.attendanceRate}% Rate</span>
                                    </div>

                                    <h3 className="font-bold text-base truncate">{secData.course}</h3>
                                    <p className={`text-xs mt-1 ${selectedSection === secKey ? 'text-slate-300' : 'text-slate-500'}`}>
                                        Total Sessions: <span className="font-bold">{secData.totalRecords}</span>
                                    </p>

                                    <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs pt-3 border-t border-slate-200/40">
                                        <div>
                                            <span className="block text-[10px] opacity-70">Present</span>
                                            <span className="font-black text-emerald-400">{secData.presentCount}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] opacity-70">Absent</span>
                                            <span className="font-black text-rose-400">{secData.absentCount}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] opacity-70">Late</span>
                                            <span className="font-black text-amber-400">{secData.lateCount}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Filter Controls & Search */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        {/* Section Selector Tabs */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            <button
                                onClick={() => setSelectedSection('ALL')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                    selectedSection === 'ALL'
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                All Sections ({summary?.rawRecords?.length || 0})
                            </button>
                            {sectionsList.map(secKey => (
                                <button
                                    key={secKey}
                                    onClick={() => setSelectedSection(secKey)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                        selectedSection === secKey
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {secKey}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[260px]">
                            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by Student or Roll No..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Attendance Records Table */}
                    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-900 text-white font-bold">
                                <tr>
                                    <th className="p-3.5">#</th>
                                    <th className="p-3.5">Student Name</th>
                                    <th className="p-3.5">Enrollment No</th>
                                    <th className="p-3.5">Course & Section</th>
                                    <th className="p-3.5">Subject</th>
                                    <th className="p-3.5">Date</th>
                                    <th className="p-3.5">Status</th>
                                    <th className="p-3.5">Faculty / Marked By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {recordsToDisplay.map((rec, index) => (
                                    <tr key={rec._id || index} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-3.5 font-mono text-slate-400">{index + 1}</td>
                                        <td className="p-3.5 font-bold text-slate-900">{rec.studentName}</td>
                                        <td className="p-3.5 font-mono text-slate-600 font-bold">{rec.enrollmentNumber}</td>
                                        <td className="p-3.5 font-medium text-slate-700">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                                                {rec.course} - {rec.section}
                                            </span>
                                        </td>
                                        <td className="p-3.5 font-medium text-slate-700">{rec.subject}</td>
                                        <td className="p-3.5 font-mono text-slate-500">{new Date(rec.date).toLocaleDateString()}</td>
                                        <td className="p-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                                rec.status === 'Present'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : rec.status === 'Absent'
                                                        ? 'bg-rose-100 text-rose-800'
                                                        : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td className="p-3.5 text-slate-500">{rec.markedBy || 'Faculty'}</td>
                                    </tr>
                                ))}
                                {recordsToDisplay.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="p-8 text-center text-slate-400 font-medium">
                                            No attendance records found matching filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionAttendanceReports;
