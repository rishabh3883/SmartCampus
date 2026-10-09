const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Hostel = require('./models/Hostel');
const LibraryStatus = require('./models/LibraryStatus');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
    try {
        await connectDB();
        // Clear old data
        await User.deleteMany();
        await Hostel.deleteMany();
        await LibraryStatus.deleteMany();

        // Create Hostels
        const hostels = await Hostel.insertMany([
            { name: 'Block A (Boys)', capacity: 200, warden: 'Mr. Sharma' },
            { name: 'Block B (Girls)', capacity: 150, warden: 'Mrs. Verma' },
            { name: 'Block C (Freshers)', capacity: 100, warden: 'Mr. Singh' }
        ]);
        console.log('Hostels Seeded');

        // Create Users
        const commonPassword = await bcrypt.hash('password123', 10);
        const securityPassword = await bcrypt.hash('security123', 10);

        // Delete any existing demo users first
        await User.deleteMany({
            email: { $in: ['admin@college.edu', 'rishabh@student.edu', 'staff@college.edu', 'security@campus.com', 'reserved@college.edu'] }
        });

        await User.create([
            {
                name: 'Admin Officer',
                email: 'admin@college.edu',
                password: commonPassword,
                role: 'Admin'
            },
            {
                name: 'Rishabh Gupta',
                email: 'rishabh@student.edu',
                password: commonPassword,
                role: 'Student',
                enrollmentNumber: 'PU2024CS001',
                hostelId: hostels[0]._id
            },
            {
                name: 'Campus Staff / Employee',
                email: 'staff@college.edu',
                password: commonPassword,
                role: 'Employee'
            },
            {
                name: 'Chief Security Officer',
                email: 'security@campus.com',
                password: securityPassword,
                role: 'Security',
                badges: ['Security']
            }
        ]);
        console.log('Demo Users Seeded Successfully');

        // Init Library
        await LibraryStatus.create({ totalSeats: 50, occupiedSeats: 12 });
        console.log('Library Seeded');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
