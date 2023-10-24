const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

// @route:   GET api/profile/me
// @desc:    Get current users profile
// @access:  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', 
        ['name', 'avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile); 
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route:   POST api/profile
// @desc:    Create or update a user profile
// @access:  Private

// Because this route has two middleware functions (auth and check), we pass them in as an array 
router.post('/', 
    [auth, 
        [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills are required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company, 
            website, 
            location, 
            bio, 
            status, 
            githubusername, 
            skills, 
            youtube, 
            facebook, 
            twitter, 
            instagram, 
            linkedin
        } = req.body;

        // Build profile object
        const profileFields = {};
        // Get the user id from the request
        profileFields.user = req.user.id;
        if(company) profileFields.company = company; // If there is a company, website, etc. add it to the profileFields object
        if(website) profileFields.website = website; 
        if(location) profileFields.location = location; 
        if(bio) profileFields.bio = bio; 
        if(status) profileFields.status = status; 
        if(githubusername) profileFields.githubusername = githubusername; 
        if(skills) {
            //.split() turns a string into an array
            // .map() maps through the array 
            // .trim() removes any whitespace added by the user
            profileFields.skills = skills.split(',').map(skill => skill.trim()); 
        }
        // Build social object
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(facebook) profileFields.social.facebook = facebook;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(linkedin) profileFields.social.linkedin = linkedin;
        
        try{
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                // Update the profile if one exists
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields }, 
                    { new: true }
                );
            
                return res.json(profile);
            }

            // Create a new profile if one does not exist
            profile = new Profile(profileFields);

            await profile.save();
        } 
        catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);
module.exports = router;