const Library = require('../models/Library');
const LibraryBooking = require('../models/LibraryBooking');
const LibrarySeat = require('../models/LibrarySeat');

// --- Helper: Seed seats dynamically for a library if none exist ---
const ensureSeatsExist = async (library) => {
    const seatCount = await LibrarySeat.countDocuments({ library: library._id });
    if (seatCount === 0) {
        const seatsToCreate = [];
        const numSeats = library.totalSeats || 12;
        const libPrefix = library.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase() || 'LIB';

        for (let i = 1; i <= numSeats; i++) {
            const seatNum = `Seat ${String.fromCharCode(65 + Math.floor((i - 1) / 10))}-${(i - 1) % 10 + 1}`;
            const seatCode = `${libPrefix}-SEAT-${i}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
            seatsToCreate.push({
                library: library._id,
                seatNumber: seatNum,
                seatCode,
                status: 'Vacant'
            });
        }
        await LibrarySeat.insertMany(seatsToCreate);
    }
};

// --- Admin: Create Library ---
exports.createLibrary = async (req, res) => {
    try {
        const { name, totalSeats } = req.body;
        const library = new Library({ name, totalSeats });
        await library.save();
        await ensureSeatsExist(library);
        res.status(201).json(library);
    } catch (err) {
        res.status(500).json({ message: "Failed to create library", error: err.message });
    }
};

// --- Admin: Delete Library ---
exports.deleteLibrary = async (req, res) => {
    try {
        const { id } = req.params;
        await Library.findByIdAndDelete(id);
        await LibraryBooking.updateMany({ library: id, status: 'Active' }, { status: 'Cancelled' });
        await LibrarySeat.deleteMany({ library: id });
        res.json({ message: "Library and associated seats deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete library", error: err.message });
    }
};

// --- Public: Get All Libraries ---
exports.getAllLibraries = async (req, res) => {
    try {
        const libraries = await Library.find();
        for (const lib of libraries) {
            await ensureSeatsExist(lib);
        }
        res.json(libraries);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch libraries", error: err.message });
    }
};

// --- Get Seats for a Library ---
exports.getLibrarySeats = async (req, res) => {
    try {
        const { libraryId } = req.params;
        const library = await Library.findById(libraryId);
        if (!library) return res.status(404).json({ message: "Library not found" });

        await ensureSeatsExist(library);
        const seats = await LibrarySeat.find({ library: libraryId }).sort({ seatNumber: 1 });
        res.json({ library, seats });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch seats", error: err.message });
    }
};

// --- Get Single Seat info by Code (Public) ---
exports.getSeatByCode = async (req, res) => {
    try {
        const { seatCode } = req.params;
        const seat = await LibrarySeat.findOne({ seatCode }).populate('library');
        if (!seat) {
            return res.status(404).json({ message: "Invalid QR Code: Seat not found." });
        }
        res.json({ seat, library: seat.library });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch seat details", error: err.message });
    }
};

// --- QR Scan Seat Toggle (Occupied <-> Vacant) ---
exports.scanSeat = async (req, res) => {
    try {
        const { seatCode, seatId, studentName, enrollmentNumber, actionType } = req.body;
        const userId = req.user?.id || null;
        let userName = req.user?.name || req.user?.email || studentName || (enrollmentNumber ? `Student (${enrollmentNumber})` : 'Campus Student');

        let query = {};
        if (seatId) query._id = seatId;
        else if (seatCode) query.seatCode = seatCode;
        else return res.status(400).json({ message: "Seat ID or QR Seat Code is required." });

        const seat = await LibrarySeat.findOne(query).populate('library');
        if (!seat) return res.status(404).json({ message: "Invalid QR Code! Seat not found." });

        const library = await Library.findById(seat.library);

        let action = '';
        let message = '';

        if (seat.status === 'Vacant' || actionType === 'OCCUPY') {
            // Mark Seat as Occupied
            seat.status = 'Occupied';
            seat.occupiedBy = userId;
            seat.occupiedByName = userName;
            seat.occupiedAt = new Date();
            await seat.save();

            // Update Library Occupied Count
            const currentOccupied = await LibrarySeat.countDocuments({ library: seat.library._id, status: 'Occupied' });
            if (library) {
                library.bookedSeats = currentOccupied;
                await library.save();
            }

            action = 'OCCUPIED';
            message = `🎉 You have successfully occupied ${seat.seatNumber} (${library?.name || 'Library'})! Enjoy your study session!`;
        } else {
            // Mark Seat as Vacant
            seat.status = 'Vacant';
            seat.occupiedBy = null;
            seat.occupiedByName = null;
            seat.occupiedAt = null;
            await seat.save();

            // Update Library Occupied Count
            const currentOccupied = await LibrarySeat.countDocuments({ library: seat.library._id, status: 'Occupied' });
            if (library) {
                library.bookedSeats = Math.max(0, currentOccupied);
                await library.save();
            }

            action = 'VACATED';
            message = `✅ ${seat.seatNumber} is now VACANT! Thank you for leaving the seat clean!`;
        }

        // Notify via Socket.io if available
        const io = req.app.get('socketio');
        if (io) {
            io.emit('seat-status-changed', {
                libraryId: seat.library._id,
                seatId: seat._id,
                seatNumber: seat.seatNumber,
                status: seat.status,
                occupiedByName: seat.occupiedByName
            });
        }

        res.json({ success: true, action, message, seat, library });
    } catch (err) {
        res.status(500).json({ message: "Failed to process QR seat scan", error: err.message });
    }
};

// --- Student: Get My Active Booking ---
exports.getMyBooking = async (req, res) => {
    try {
        const booking = await LibraryBooking.findOne({ user: req.user.id, status: 'Active' }).populate('library');
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch booking", error: err.message });
    }
};

// --- Student: Book Slot ---
exports.bookSlot = async (req, res) => {
    try {
        const { libraryId, duration = 2 } = req.body;
        const userId = req.user.id;

        const existingBooking = await LibraryBooking.findOne({ user: userId, status: 'Active' });
        if (existingBooking) {
            return res.status(400).json({ message: "You already have an active study slot booked." });
        }

        const library = await Library.findById(libraryId);
        if (!library) return res.status(404).json({ message: "Library not found" });

        if (library.bookedSeats >= library.totalSeats) {
            return res.status(400).json({ message: "Library is full." });
        }

        const startTime = new Date();
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);

        const booking = new LibraryBooking({
            user: userId,
            library: libraryId,
            status: 'Active',
            startTime,
            endTime
        });
        await booking.save();

        library.bookedSeats += 1;
        await library.save();

        res.status(201).json({ message: `Slot booked for ${duration} hours!`, booking });
    } catch (err) {
        res.status(500).json({ message: "Booking failed", error: err.message });
    }
};

// --- Student: Cancel Slot ---
exports.cancelSlot = async (req, res) => {
    try {
        const userId = req.user.id;
        const booking = await LibraryBooking.findOne({ user: userId, status: 'Active' });

        if (!booking) return res.status(404).json({ message: "No active booking found." });

        booking.status = 'Cancelled';
        booking.endTime = Date.now();
        await booking.save();

        const library = await Library.findById(booking.library);
        if (library) {
            library.bookedSeats = Math.max(0, library.bookedSeats - 1);
            await library.save();
        }

        res.json({ message: "Slot cancelled successfully." });
    } catch (err) {
        res.status(500).json({ message: "Cancellation failed", error: err.message });
    }
};

// --- Background Job: Check Expired Bookings ---
exports.checkExpiredBookings = async () => {
    try {
        const now = new Date();
        const expiredBookings = await LibraryBooking.find({ status: 'Active', endTime: { $lt: now } });

        for (const booking of expiredBookings) {
            booking.status = 'Completed';
            await booking.save();

            const library = await Library.findById(booking.library);
            if (library) {
                library.bookedSeats = Math.max(0, library.bookedSeats - 1);
                await library.save();
            }
        }

        if (expiredBookings.length > 0) {
            console.log(`Expired ${expiredBookings.length} bookings.`);
        }
    } catch (err) {
        console.error("Error checking expired bookings:", err);
    }
};
