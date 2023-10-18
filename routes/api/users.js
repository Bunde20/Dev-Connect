const express = require('express');
const router = express.Router();
// Import express-validator/check to validate user input is valid
const { check, validationResult } = require('express-validator');

// @route:   POST api/users
// @desc:    Register user
// @access:  Public
router.post('/', 
[
    // Check that the name field is not empty
    check('name', 'Name is required')
        .not()
        .isEmpty(), 
    // Check that the email field is a valid email
    check('email', 'Please include a valid email').isEmail(),
    // Check that the password field is at least 6 characters long
    check(
        'password', 
        'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
],
(req, res) => {
    // Get the errors from the request
    const errors = validationResult(req);
    // If there is input and there are errors
    if (!errors.isEmpty()) { 
        // Return the errors as a JSON object
        return res.status(400).json({ errors: errors.array() }); 
    }
    console.log(req.body); // req.body is the object of data that is sent to this route
    res.send('User route')
});

module.exports = router;
