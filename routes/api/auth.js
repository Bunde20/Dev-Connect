const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

// @route:   GET api/auth
// @desc:    Test route
// @access:  Public
router.get('/', auth, async (req, res) => {
    try {
        // Get the user from the database and exclude the password
        // req.user.id is set in the auth middleware to the user id in the token
        const user = await User.findById(req.user.id).select('-password'); 
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route:   POST api/auth
// @desc:    Authenticate user and get token
// @access:  Public
router.post('/',
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        let user = await User.findOne({ email });
  
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        // Check if the password matches the encrypted password in the database
        const isMatch = await bcrypt.compare(password, user.password); 
        // If the passwords don't match return an error
        if(!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
  
        const payload = {
          user: {
            id: user.id, // mongoose uses an abstraction so you don't need to use _id
          },
        };

        jwt.sign(
          payload, 
          config.get('jwtSecret'),
          { expiresIn: 360000 },
          (err, token) => {
              if(err) throw err;
              res.json({ token });
          }
          ); 
  
        console.log(req.body); 
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    }
  );
  

module.exports = router;