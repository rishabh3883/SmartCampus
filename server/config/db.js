const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!cachedPromise) {
        const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus';
        console.log("Attempting MongoDB connection, URI present:", Boolean(process.env.MONGO_URI));
        cachedPromise = mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        }).then((conn) => {
            console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
            return conn;
        }).catch((err) => {
            cachedPromise = null;
            console.error(`MongoDB connection error: ${err.message}`);
            throw err;
        });
    }

    return cachedPromise;
};

module.exports = connectDB;
