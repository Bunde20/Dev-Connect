const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // associate the user by id
        ref: 'user' // reference the users collection
    },
    text: {
        type: String,
        required: true
    },
    name: { // name of the user
        type: String
    },
    avatar: { // avatar of the user
        type: String
    },
    likes: [ // array of likes
        {
            user: {
                type: Schema.Types.ObjectId, // associate the user by id
                ref: 'users' // reference the users collection
            }
        }
    ],
    comments: [ // array of comments
        {
            user: {
                type: Schema.Types.ObjectId, // associate the user by id
                ref: 'users' // reference the users collection
            },
            text: {
                type: String,
                required: true
            },
            name: { // name of the user
                type: String
            },
            avatar: { // avatar of the user
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: { // date of the post
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema); 

