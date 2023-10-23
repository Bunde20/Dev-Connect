const mongoose = require ('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, // Associate the user by its ID
        ref: 'user' // Reference the user model file for this ID
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: { // Location of the user
        type: String
    },
    status: { // The user's status
        type: String,
        required: true
    },
    skills: { // The user's skills
        type: [String], // An array of strings
        required: true
    },
    bio: { // The user's bio
        type: String
    },
    githubusername: { // The user's github username
        type: String
    },
    experience: [ // An array of objects
        {
            title: { // The title of the experience
                type: String,
                required: true
            },
            company: { // The company of the experience
                type: String,
                required: true
            },
            location: { // The location of the experience
                type: String
            },
            from: { // The start date of the experience
                type: Date,
                required: true
            },
            to: { // The end date of the experience
                type: Date
            },
            current: { // Is the experience current
                type: Boolean,
                default: false
            },
            description: { // The description of the experience
                type: String
            }
        }
    ],
    education: [ // An array of objects
        {
            school: { // The school of the education
                type: String,
                required: true
            },
            degree: { // The degree of the education
                type: String,
                required: true
            },
            fieldofstudy: { // The field of study of the education
                type: String,
                required: true
            },
            from: { // The start date of the education
                type: Date,
                required: true
            },
            to: { // The end date of the education
                type: Date
            },
            current: { // Is the education current
                type: Boolean,
                default: false
            },
            description: { // The description of the education
                type: String
            }
        }
    ],
    social: { // The user's social media links
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: { 
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: { // The date the profile was created
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema); 