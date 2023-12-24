// Replies Router:
// - Defines an Express router for managing reply-related API endpoints.
// - Imports middleware for authorization and controllers for reply operations.
// - Exposes routes for retrieving, adding, updating, and deleting replies.
// - Includes a route for updating reply likes with authentication.

const express = require('express');
const { auth } = require("../middleware/authorization");
const { getReplies, addReply, deleteReply, updateReply, updateReplyLikes } = require("../controllers/replies");

const router = express.Router();

// Routes:
// - GET: Retrieve all replies
// - POST: Add a new reply (requires authentication)
// - PUT/DELETE: Operations on a specific reply by key (requires authentication)
// - PUT: Update reply likes by key (requires authentication)

router.route('/').get(getReplies);

router.route('/:key')
    .post(auth, addReply)
    .put(auth, updateReply)
    .delete(auth, deleteReply);

router.route('/like/:key')
    .put(auth, updateReplyLikes);

module.exports.router = router;
