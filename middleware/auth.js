const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get the token from the header
    const token = req.header('x-auth-token'); // The key to the token in the header is 'x-auth-token'

    // Check if no token
    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' }); // 401 is not authorized
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // Decode the token

        req.user = decoded.user; // Set the user in the request object to the decoded user
        next(); // Call the next middleware
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};