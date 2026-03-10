const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Get the token from the header
    // Headers usually look like: { Authorization: "Bearer <token>" }
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }

    // Extract the token (remove "Bearer " text)
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach the user data to the request object
        // So the next function knows who is logged in
        req.user = decoded; 
        
        // 4. Let the request continue to the controller
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid Token' });
    }
};

module.exports = verifyToken;