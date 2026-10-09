const mongoose = require('mongoose');

let cachedPromise = null;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!cachedPromise) {
        const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-campus';
        cachedPromise = mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 5000,
        }).then((conn) => {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
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
