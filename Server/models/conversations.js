// Conversation Schema:
// - Defines the MongoDB schema for a conversation, including key, content, creation timestamp,
//   score, likes, dislikes, user details, and an array of replies.
// - Each reply includes key, content, creation timestamp, replyingTo reference,
//   score, user details, likes, and dislikes.

const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    key: String,
    content: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    score: {
        type: Number,
        default: 0,
    },
    likes: [String],
    dislikes: [String],
    user: {
        username: String,
        image: String,
        usertype: String,
        email: String,
        _id: String,
    },
    replies: [{
        key: String,
        content: String,
        createdAt: {
            type: Date,
            default: new Date(),
        },
        replyingTo: String,
        score: {
            type: Number,
            default: 0,
        },
        user: {
            username: String,
            image: String,
            usertype: String,
            email: String,
            _id: String,
        },
        likes: [String],
        dislikes: [String],
    }],
});

// Conversation Model:
// - Creates a MongoDB model named 'conversations' using the defined schema.

const Conversation = mongoose.model('conversations', conversationSchema);

module.exports.Conversation = Conversation;
