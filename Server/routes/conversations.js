// Comments Router:
// - Defines Express router for comment-related API endpoints.
// - Imports controllers for handling comment operations.
// - Utilizes authorization middleware for certain routes.

const express = require('express');
const { getComments, getComment, deleteComment, updateComment, addComment, updateCommentLikes } = require('../controllers/conversations');
const { auth } = require('../middleware/authorization');

const router = express.Router();

// Routes:
// - GET: Retrieve all comments with search parameters, page, quantity, written by a certain user
// - POST: Add a new comment (requires authentication)
// - GET/PUT/DELETE: Operations on a specific comment by key (requires authentication)
// - PUT: Update comment likes by key (requires authentication)

router.get('/', getComments);
router.post('/', auth, addComment);

router.route('/:key')
    .get(getComment)
    .put(auth, updateComment)
    .delete(auth, deleteComment);

router.route('/like/:key')
    .put(auth, updateCommentLikes);

module.exports.router = router;
