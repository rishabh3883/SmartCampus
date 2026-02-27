const Timetable = require('../models/Timetable');
const ClassModel = require('../models/Class');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Room = require('../models/Room');

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOTS_PER_DAY = 7;
const TIMES = [
    "09:30 - 10:25", "10:25 - 11:20", "11:20 - 12:20",
    "12:20 - 01:15", "01:15 - 02:10",
    "02:30 - 03:25", "03:25 - 04:20"
];

const getEmptySchedule = () => DAYS.map(day => ({ day, slots: [] }));

exports.generateTimetable = async (req, res) => {
    try {
        const { classId, semester } = req.body;

        // 1. Fetch Master Data
        const targetClass = await ClassModel.findById(classId);
        if (!targetClass) return res.status(404).json({ success: false, message: 'Class not found' });

        const subjects = await Subject.find({ course: targetClass.course });
        const teachers = await Teacher.find({ subjects: { $in: subjects.map(s => s._id) } });
        const rooms = await Room.find();

        if (subjects.length === 0 || teachers.length === 0 || rooms.length === 0) {
            return res.status(400).json({ success: false, message: 'Insufficient master data (Subjects/Teachers/Rooms)' });
        }

        const timetable = new Timetable({
            classId: targetClass._id,
            semester: semester || '1',
            schedule: getEmptySchedule()
        });

        const teacherAvail = {};
        const roomAvail = {};
        const classAvail = {};

        // Fetch existing timetables to prevent cross-class conflicts
        const allExistingTimetables = await Timetable.find();
        allExistingTimetables.forEach(existing => {
            if (existing.classId.toString() === targetClass._id.toString()) return; // skip target we are replacing
            existing.schedule.forEach(daySch => {
                daySch.slots.forEach((s, idx) => {
                    const daySlotIdx = Array.from(daySch.slots).indexOf(s);
                    const slotKey = `${daySch.day}_${daySlotIdx}`;
                    if (s.teacher) teacherAvail[`${s.teacher}_${slotKey}`] = true;
                    if (s.room) roomAvail[`${s.room}_${slotKey}`] = true;
                });
            });
        });

        let lectureQueue = [];
        subjects.forEach(sub => {
            // Give subjects more weight if they don't have credits specified properly
            const timesToSchedule = sub.credits > 0 ? sub.credits : 4;
            for (let i = 0; i < timesToSchedule; i++) {
                lectureQueue.push(sub);
            }
        });

        // Add padding to ensure the timetable gets fully populated with free slots filled later
        while (lectureQueue.length < (DAYS.length * SLOTS_PER_DAY)) {
            lectureQueue.push(subjects[Math.floor(Math.random() * subjects.length)]);
        }

        lectureQueue.sort((a, b) => a.type === 'Lab' ? -1 : Math.random() - 0.5);

        // Track how many times a subject is scheduled in a day to prevent clustering
        const dailySubjCount = {};

        for (let sub of lectureQueue) {
            const possibleTeachers = teachers.filter(t => t.subjects.includes(sub._id));
            if (possibleTeachers.length === 0) continue;

            const teacher = possibleTeachers[0];
            const possibleRooms = rooms.filter(r => r.type === sub.type);
            if (possibleRooms.length === 0) continue;

            let placed = false;

            // Try to place the subject
            for (let d = 0; d < DAYS.length && !placed; d++) {
                const dayKey = `${DAYS[d]}_${sub._id}`;
                if (dailySubjCount[dayKey] >= 2 && sub.type !== 'Lab') continue; // Max 2 of same theory per day

                for (let s = 0; s < SLOTS_PER_DAY && !placed; s++) {
                    // Skip slot 5 (Lunch break) for generation
                    if (s === 5) continue;

                    const slotKey = `${DAYS[d]}_${s}`;
                    const currentRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)]; // randomize rooms

                    if (!teacherAvail[`${teacher._id}_${slotKey}`] &&
                        !roomAvail[`${currentRoom._id}_${slotKey}`] &&
                        !classAvail[`${targetClass._id}_${slotKey}`]) {

                        teacherAvail[`${teacher._id}_${slotKey}`] = true;
                        roomAvail[`${currentRoom._id}_${slotKey}`] = true;
                        classAvail[`${targetClass._id}_${slotKey}`] = true;
                        dailySubjCount[dayKey] = (dailySubjCount[dayKey] || 0) + 1;

                        const daySchedule = timetable.schedule.find(sch => sch.day === DAYS[d]);
                        daySchedule.slots.push({
                            startTime: TIMES[s].split(" - ")[0],
                            endTime: TIMES[s].split(" - ")[1],
                            subject: sub._id,
                            teacher: teacher._id,
                            room: currentRoom._id,
                            isLocked: false
                        });

                        placed = true;
                    }
                }
            }
        }

        await Timetable.deleteMany({ classId: targetClass._id });
        await timetable.save();

        res.status(200).json({ success: true, data: timetable });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getTimetableByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const timetable = await Timetable.findOne({ classId })
            .populate('schedule.slots.subject')
            .populate('schedule.slots.teacher')
            .populate('schedule.slots.room');

        if (!timetable) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: timetable });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.updateSlot = async (req, res) => {
    try {
        const { timetableId, day, slotId, newTeacherId, newRoomId } = req.body;

        const timetable = await Timetable.findById(timetableId);
        if (!timetable) return res.status(404).json({ success: false, message: 'Timetable not found' });

        const daySch = timetable.schedule.find(d => d.day === day);
        if (!daySch) return res.status(404).json({ success: false, message: 'Day not found' });

        const slot = daySch.slots.id(slotId);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

        if (newTeacherId) slot.teacher = newTeacherId;
        if (newRoomId) slot.room = newRoomId;
        slot.isLocked = true;

        await timetable.save();

        res.status(200).json({ success: true, message: 'Slot updated' });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const { classId } = req.params;
        const result = await Timetable.deleteMany({ classId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'No timetable found to delete' });
        }
        res.status(200).json({ success: true, message: 'Timetable deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
