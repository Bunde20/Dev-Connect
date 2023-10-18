const mongoose = require('mongoose');

// Mongoose schema that defines the fields for a user
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // No two users can have the same email
    },
    password: {
        type: String,
        required: true
    },
    avatar: { // A profile picture for the user
        type: String // Will be a URL to an image
    },
    date: {
        type: Date, // The date the user was created
        default: Date.now // The current date
    }
});

module.exports = User = mongoose.model('user', UserSchema); // Export the model