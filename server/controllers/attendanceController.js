const XLSX = require('xlsx');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Class = require('../models/Class');
const Booking = require('../models/Booking');
const LibrarySeat = require('../models/LibrarySeat');

// --- Helper: Ensure Sample Attendance Data Exists for All Sections ---
const ensureSampleAttendance = async () => {
    const count = await Attendance.countDocuments();
    if (count === 0) {
        const sections = ['Section A', 'Section B', 'Section C', 'Section D'];
        const courses = ['B.Tech CSE', 'BCA', 'B.Tech IT', 'MCA'];
        const subjects = ['Data Structures', 'Database Systems', 'Computer Networks', 'AI & ML', 'Web Dev'];

        const students = await User.find({ role: 'Student' });
        const mockRecords = [];

        // Sample student names if user DB is small
        const defaultStudents = [
            { name: 'Rishabh Gupta', enrollment: 'EN2024001' },
            { name: 'Aarav Sharma', enrollment: 'EN2024002' },
            { name: 'Priya Verma', enrollment: 'EN2024003' },
            { name: 'Rohan Patel', enrollment: 'EN2024004' },
            { name: 'Sneha Reddy', enrollment: 'EN2024005' },
            { name: 'Vikram Singh', enrollment: 'EN2024006' },
            { name: 'Ananya Roy', enrollment: 'EN2024007' },
            { name: 'Kabir Mehta', enrollment: 'EN2024008' },
            { name: 'Ishita Joshi', enrollment: 'EN2024009' },
            { name: 'Aditya Nair', enrollment: 'EN2024010' }
        ];

        const listToUse = students.length > 0
            ? students.map(s => ({ name: s.name, enrollment: s.enrollmentNumber || 'EN' + s._id.toString().slice(-6), id: s._id }))
            : defaultStudents;

        const dates = [
            new Date(Date.now() - 3 * 86400000),
            new Date(Date.now() - 2 * 86400000),
            new Date(Date.now() - 1 * 86400000),
            new Date()
        ];

        for (const sec of sections) {
            const crs = courses[sections.indexOf(sec) % courses.length];
            for (const d of dates) {
                for (const sub of subjects.slice(0, 3)) {
                    for (const st of listToUse) {
                        const statuses = ['Present', 'Present', 'Present', 'Absent', 'Late'];
                        const status = statuses[Math.floor(Math.random() * statuses.length)];

                        mockRecords.push({
                            student: st.id || null,
                            studentName: st.name,
                            enrollmentNumber: st.enrollment,
                            className: `${crs} - ${sec}`,
                            section: sec,
                            course: crs,
                            date: d,
                            subject: sub,
                            status,
                            markedBy: 'Faculty Coordinator'
                        });
                    }
                }
            }
        }

        await Attendance.insertMany(mockRecords);
    }
};

// --- GET Section-wise Attendance Summary JSON ---
exports.getSectionAttendanceSummary = async (req, res) => {
    try {
        await ensureSampleAttendance();

        const allRecords = await Attendance.find().sort({ date: -1 });

        // Group by Section
        const sectionMap = {};

        allRecords.forEach(rec => {
            const secKey = `${rec.course} (${rec.section})`;
            if (!sectionMap[secKey]) {
                sectionMap[secKey] = {
                    sectionName: rec.section,
                    course: rec.course,
                    className: rec.className,
                    totalRecords: 0,
                    presentCount: 0,
                    absentCount: 0,
                    lateCount: 0,
                    records: []
                };
            }

            sectionMap[secKey].totalRecords += 1;
            if (rec.status === 'Present') sectionMap[secKey].presentCount += 1;
            else if (rec.status === 'Absent') sectionMap[secKey].absentCount += 1;
            else if (rec.status === 'Late') sectionMap[secKey].lateCount += 1;

            sectionMap[secKey].records.push(rec);
        });

        // Calculate attendance rate %
        Object.keys(sectionMap).forEach(k => {
            const sec = sectionMap[k];
            sec.attendanceRate = sec.totalRecords > 0
                ? Math.round(((sec.presentCount + sec.lateCount) / sec.totalRecords) * 100)
                : 0;
        });

        res.json({
            success: true,
            totalAttendanceRecords: allRecords.length,
            sections: sectionMap,
            rawRecords: allRecords
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch attendance summary", error: err.message });
    }
};

// --- Export All Section Attendance to Excel (.xlsx) ---
exports.exportAttendanceExcel = async (req, res) => {
    try {
        await ensureSampleAttendance();

        const workbook = XLSX.utils.book_new();

        // 1. Fetch All Attendance Records
        const attendanceRecords = await Attendance.find().sort({ section: 1, date: -1 });

        // Build Master Summary Data Sheet
        const sectionSummaryData = [];
        const sectionsGrouped = {};

        attendanceRecords.forEach(rec => {
            const secName = `${rec.course} - ${rec.section}`;
            if (!sectionsGrouped[secName]) {
                sectionsGrouped[secName] = {
                    'Course': rec.course,
                    'Section': rec.section,
                    'Total Classes Marked': 0,
                    'Present Count': 0,
                    'Absent Count': 0,
                    'Late Count': 0
                };
            }
            sectionsGrouped[secName]['Total Classes Marked'] += 1;
            if (rec.status === 'Present') sectionsGrouped[secName]['Present Count'] += 1;
            else if (rec.status === 'Absent') sectionsGrouped[secName]['Absent Count'] += 1;
            else if (rec.status === 'Late') sectionsGrouped[secName]['Late Count'] += 1;
        });

        Object.keys(sectionsGrouped).forEach(secKey => {
            const item = sectionsGrouped[secKey];
            const total = item['Total Classes Marked'];
            const rate = total > 0 ? Math.round(((item['Present Count'] + item['Late Count']) / total) * 100) : 0;

            sectionSummaryData.push({
                'Course & Section': secKey,
                'Course': item['Course'],
                'Section': item['Section'],
                'Total Class Sessions': item['Total Classes Marked'],
                'Present Students': item['Present Count'],
                'Absent Students': item['Absent Count'],
                'Late Students': item['Late Count'],
                'Overall Attendance %': `${rate}%`
            });
        });

        const summarySheet = XLSX.utils.json_to_sheet(sectionSummaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Section Summary');

        // 2. Individual Worksheets for Each Section
        const uniqueSections = [...new Set(attendanceRecords.map(r => r.section))];

        uniqueSections.forEach(secName => {
            const secRecords = attendanceRecords.filter(r => r.section === secName);
            const sheetRows = secRecords.map((r, index) => ({
                'S.No': index + 1,
                'Enrollment No': r.enrollmentNumber,
                'Student Name': r.studentName,
                'Course': r.course,
                'Section': r.section,
                'Subject': r.subject,
                'Date': new Date(r.date).toLocaleDateString(),
                'Attendance Status': r.status,
                'Faculty / Marked By': r.markedBy
            }));

            const sheetName = `Sec ${secName.replace(/[^a-zA-Z0-9]/g, '')}`.substring(0, 30);
            const ws = XLSX.utils.json_to_sheet(sheetRows);
            XLSX.utils.book_append_sheet(workbook, ws, sheetName);
        });

        // 3. Event QR Attendance Sheet
        const eventBookings = await Booking.find().populate('eventId');
        const eventRows = eventBookings.map((b, idx) => ({
            'S.No': idx + 1,
            'Event Title': b.eventId?.title || 'N/A',
            'Venue': b.eventId?.venue || 'N/A',
            'Student Name': b.attendeeName || 'N/A',
            'Enrollment No': b.enrollmentNumber || 'N/A',
            'Ticket QR Code': b.qrCode,
            'Check-In Status': b.attended ? 'PRESENT' : 'ABSENT',
            'Check-In Time': b.attendedAt ? new Date(b.attendedAt).toLocaleString() : 'Not Scanned'
        }));
        const eventSheet = XLSX.utils.json_to_sheet(eventRows);
        XLSX.utils.book_append_sheet(workbook, eventSheet, 'Event QR Attendance');

        // 4. Library Seat QR Attendance Sheet
        const librarySeats = await LibrarySeat.find().populate('library');
        const seatRows = librarySeats.map((s, idx) => ({
            'S.No': idx + 1,
            'Library Name': s.library?.name || 'N/A',
            'Seat Number': s.seatNumber,
            'Seat QR Code': s.seatCode,
            'Current Status': s.status,
            'Occupant Student': s.occupiedByName || 'Vacant',
            'Occupied Since': s.occupiedAt ? new Date(s.occupiedAt).toLocaleString() : 'N/A'
        }));
        const librarySheet = XLSX.utils.json_to_sheet(seatRows);
        XLSX.utils.book_append_sheet(workbook, librarySheet, 'Library QR Seats');

        // Generate Buffer & Stream File
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="Section_Attendance_Report.xlsx"');
        res.send(excelBuffer);
    } catch (err) {
        console.error("Excel generation error:", err);
        res.status(500).json({ message: "Failed to generate Excel report", error: err.message });
    }
};

// --- Mark Section Attendance manually ---
exports.markSectionAttendance = async (req, res) => {
    try {
        const { records, section, course, subject } = req.body;
        if (!records || !Array.isArray(records)) {
            return res.status(400).json({ message: "Records array is required." });
        }

        const newEntries = records.map(item => ({
            student: item.studentId || null,
            studentName: item.studentName,
            enrollmentNumber: item.enrollmentNumber,
            section: section || 'Section A',
            course: course || 'B.Tech CSE',
            subject: subject || 'General',
            date: new Date(),
            status: item.status || 'Present',
            markedBy: req.user ? req.user.name : 'Faculty'
        }));

        await Attendance.insertMany(newEntries);
        res.status(201).json({ message: `Successfully marked attendance for ${newEntries.length} students!`, count: newEntries.length });
    } catch (err) {
        res.status(500).json({ message: "Failed to mark attendance", error: err.message });
    }
};
