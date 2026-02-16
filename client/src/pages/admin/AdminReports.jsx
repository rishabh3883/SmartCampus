import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { FileText, Download, ArrowLeft, Filter, Search, Calendar } from 'lucide-react';

const AdminReports = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]); // Default to Today
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        filterData();
    }, [logs, filterDate, searchTerm]);

    const fetchReports = async () => {
        try {
            const { data } = await API.get('/resources/analytics');
            setLogs(data.history || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch reports", err);
            setLoading(false);
        }
    };

    const filterData = () => {
        let temp = [...logs];

        // Date Filter
        if (filterDate) {
            temp = temp.filter(log => new Date(log.date).toISOString().split('T')[0] === filterDate);
        }

        // Search Filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            temp = temp.filter(log =>
                log.hostelId?.name?.toLowerCase().includes(lower) ||
                log.sourceFile?.toLowerCase().includes(lower)
            );
        }

        setFilteredLogs(temp);
    };

    const downloadExcel = async () => {
        try {
            const response = await API.get('/resources/report', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Campus_Resource_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download report");
        }
    };

    return (
        <div className="min-h-screen pb-10 bg-slate-50 font-sans">
            <Navbar />

            <div className="page-container max-w-7xl px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="text-indigo-600" /> Daily Resource Reports
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">View and download daily consumption logs filed by staff.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.location.href = '/admin'}
                            className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <ArrowLeft size={18} className="mr-2" /> Back
                        </button>
                        <button
                            onClick={downloadExcel}
                            className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 text-white"
                        >
                            <Download size={18} className="mr-2" /> Download All Data
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">Filter By:</span>
                    </div>

                    <div className="relative flex-1 w-full md:w-auto">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            className="input-field pl-9 py-2 text-sm bg-slate-50 border-slate-200 w-full"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>

                    <div className="relative flex-1 w-full md:w-auto">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            className="input-field pl-9 py-2 text-sm bg-slate-50 border-slate-200 w-full"
                            placeholder="Search Hostel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => { setFilterDate(''); setSearchTerm(''); }}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Hostel Name</th>
                                    <th className="p-4 text-right">Water (L)</th>
                                    <th className="p-4 text-right">Electricity (kWh)</th>
                                    <th className="p-4 text-right">Food Waste (kg)</th>
                                    <th className="p-4 text-center">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">Loading reports...</td>
                                    </tr>
                                ) : filteredLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-slate-500">
                                            No logs found for this date.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <tr key={log._id} className="hover:bg-slate-50 transition-colors text-sm text-slate-700">
                                            <td className="p-4 font-medium">{new Date(log.date).toLocaleDateString()}</td>
                                            <td className="p-4 font-bold text-indigo-700">{log.hostelId?.name || 'Unknown'}</td>
                                            <td className="p-4 text-right font-mono">{log.water.toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono">{log.electricity.toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono">{log.foodWaste}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${log.sourceFile === 'Manual Entry'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                    {log.sourceFile === 'Manual Entry' ? 'Manual' : 'Excel'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                        <span>Showing {filteredLogs.length} records</span>
                        {filteredLogs.length > 0 && (
                            <span className="font-bold text-slate-700">
                                Total Water: {filteredLogs.reduce((sum, l) => sum + l.water, 0).toLocaleString()} L
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
