const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    try {
        const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus';
        console.log(`Attempting to connect to MongoDB... (Source: ${process.env.MONGO_URI ? 'ENV' : 'Fallback'})`);
        const conn = await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 8000,
        });
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Do not crash serverless process on transient network hiccups
    }
};

module.exports = connectDB;
