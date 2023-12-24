// Reply Schema:
// - Defines the MongoDB schema for a reply, including content, creation timestamp,
//   score, user details, and a reference to the original comment being replied to.

const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
    content: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    score: {
        type: Number,
        default: 0,
    },
    user: {
        username: String,
        image: String,
    },
    replyingTo: String,
});

// Reply Model:
// - Creates a MongoDB model named 'reply' using the defined schema.

const Reply = mongoose.model('reply', replySchema);

module.exports.Reply = Reply;
