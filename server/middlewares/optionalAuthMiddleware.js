const jwt = require('jsonwebtoken');

const optionalAuthMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
            req.user = decoded;
        }
    } catch (error) {
        // Continue even if token is invalid
        req.user = null;
    }
    next();
};

module.exports = optionalAuthMiddleware;
