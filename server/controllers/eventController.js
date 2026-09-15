const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const emailService = require('../services/emailService');

// --- Create Event (Admin) ---
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, venue, price, totalSeats, rules, organizer, category } = req.body;
        const newEvent = new Event({ title, description, date, venue, price, totalSeats, rules, organizer, category });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({ message: "Failed to create event", error: err.message });
    }
};

// --- Get All Events (Public) ---
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events", error: err.message });
    }
};

// --- Delete Event (Admin) ---
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        await Booking.deleteMany({ eventId });
        res.json({ message: "Event and associated bookings deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event", error: err.message });
    }
};

// --- Book Event (Student) ---
exports.bookEvent = async (req, res) => {
    try {
        const { eventId, paymentId } = req.body;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.bookedSeats >= event.totalSeats) {
            return res.status(400).json({ message: "Event fully booked" });
        }

        const existingBooking = await Booking.findOne({ userId, eventId, status: 'Confirmed' });
        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this event" });
        }

        // Fetch User Details for Ticket
        const user = await User.findById(userId);
        const attendeeName = user ? user.name : (req.user.name || 'Student');
        const attendeeEmail = user ? user.email : (req.user.email || 'N/A');
        const enrollmentNumber = user ? (user.enrollmentNumber || user.employeeId || 'N/A') : 'N/A';

        // Unique Scannable QR Code Token
        const qrCode = `EVT-TICKET-${userId.toString().slice(-4)}-${eventId.toString().slice(-4)}-${Date.now()}`;

        const booking = new Booking({
            userId,
            eventId,
            paymentId,
            qrCode,
            attendeeName,
            attendeeEmail,
            enrollmentNumber
        });
        await booking.save();

        event.bookedSeats += 1;
        await event.save();

        if (user && user.email) {
            try {
                await emailService.sendBookingConfirmation(user.email, user.name, event, booking);
            } catch (e) {
                console.log("Email notification skipped:", e.message);
            }
        }

        res.status(201).json({ message: "Booking confirmed! Digital pass generated.", booking });
    } catch (err) {
        res.status(500).json({ message: "Booking failed", error: err.message });
    }
};

// --- Get My Bookings (Student) ---
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('eventId')
            .populate('userId', 'name email enrollmentNumber')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
    }
};

// --- Venue Entry Verification via QR Code (Admin / Security / Organizer) ---
exports.verifyEntry = async (req, res) => {
    try {
        const { qrCode } = req.body;
        if (!qrCode) return res.status(400).json({ message: "QR Code payload is required." });

        const booking = await Booking.findOne({ qrCode })
            .populate('eventId')
            .populate('userId', 'name email enrollmentNumber profilePicture');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "❌ INVALID PASS! No booking record found for this QR code."
            });
        }

        if (booking.status !== 'Confirmed') {
            return res.status(400).json({
                success: false,
                message: `❌ ENTRY DENIED! Ticket status is ${booking.status}.`
            });
        }

        if (booking.attended) {
            return res.status(400).json({
                success: false,
                alreadyUsed: true,
                message: `⚠️ ALREADY CHECKED IN! ${booking.attendeeName || 'Attendee'} checked in at ${new Date(booking.attendedAt).toLocaleTimeString()}.`,
                booking
            });
        }

        // Grant Entry & Mark Attended
        booking.attended = true;
        booking.attendedAt = new Date();
        await booking.save();

        res.json({
            success: true,
            message: `🎉 ENTRY GRANTED! Welcome ${booking.attendeeName || 'Attendee'} to ${booking.eventId?.title || 'Event'}!`,
            booking
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to verify entry QR code", error: err.message });
    }
};

// --- Get Event Attendees & Detailed Attendance Report (Admin / Organizer) ---
exports.getEventAttendees = async (req, res) => {
    try {
        const { eventId } = req.params;
        const bookings = await Booking.find({ eventId })
            .populate('userId', 'name email enrollmentNumber profilePicture')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch attendees", error: err.message });
    }
};

// --- Get Detailed Attendance Analytics & Reports (Admin / Organizer) ---
exports.getEventReports = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const bookings = await Booking.find({ eventId })
            .populate('userId', 'name email enrollmentNumber')
            .sort({ attendedAt: -1, createdAt: -1 });

        const totalRegistered = bookings.length;
        const presentCount = bookings.filter(b => b.attended).length;
        const absentCount = totalRegistered - presentCount;
        const attendancePercentage = totalRegistered > 0 ? Math.round((presentCount / totalRegistered) * 100) : 0;

        res.json({
            event,
            summary: {
                capacity: event.totalSeats,
                totalRegistered,
                presentCount,
                absentCount,
                attendancePercentage
            },
            attendees: bookings
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to generate attendance report", error: err.message });
    }
};
