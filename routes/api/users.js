const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt'); // Used to encrypt passwords
const jwt = require('jsonwebtoken'); // Used to generate a JSON web token
const config = require('config'); // Used to get the secret for the JSON web token
// Import express-validator/check to validate user input is valid
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// @route:   POST api/users
// @desc:    Register user
// @access:  Public
router.post(
  '/',
  [
    // Check that the name field is not empty
    check('name', 'Name is required').not().isEmpty(),
    // Check that the email field is a valid email
    check('email', 'Please include a valid email').isEmail(),
    // Check that the password field is at least 6 characters long
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Get the errors from the request
    const errors = validationResult(req);
    // If there is input and there are errors
    if (!errors.isEmpty()) {
      // Return the errors as a JSON object
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200', // size of avatar in pixels
        r: 'pg', // rating of avatar
        d: 'mm', // default avatar if user doesn't have one
      });

      // Create an instance of a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // ANYTHING THAT RETURNS A PROMISE MUST BE PRECEDED BY THE AWAIT KEYWORD //

      const salt = await bcrypt.genSalt(10); // Generate a salt to hash the password

      user.password = await bcrypt.hash(password, salt); // Hash the password

      await user.save(); // Save the user to the database

      const payload = {
        user: {
          id: user.id, // Get the id of the user from the database
        },
      };

    // This is the payload that is sent to the client
      jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
            if(err) throw err;
            res.json({ token });
        }
        ); 

      console.log(req.body); // req.body is the object of data that is sent to this route
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
