// Users Router:
// - Defines an Express router for managing user-related API endpoints.
// - Imports middleware for authorization and controllers for user operations.
// - Exposes routes for user sign-in, sign-up, sign-out, and retrieving user details.
// - Includes authentication for certain routes.

const express = require('express');
const { auth } = require("../middleware/authorization");
const { signin, signup, signout, getUser } = require("../controllers/users");

const router = express.Router();

// Routes:
// - POST: User sign-in
// - POST: User sign-up
// - GET: User sign-out
// - GET: Retrieve user details (requires authentication)

router.route("/signin").post(signin);
router.route("/signup").post(signup);
router.route("/signout").get(signout);
router.route("/:id").get(auth, getUser);

module.exports.router = router;
