const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists safely
const isVercel = Boolean(process.env.VERCEL);
const uploadDir = isVercel ? '/tmp/uploads' : 'uploads/';

try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
} catch (e) {
    console.warn("Could not create uploads dir:", e.message);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
