// Tokens Router:
// - Defines an Express router for handling token-related API endpoint.
// - Imports the controller for refreshing tokens.
// - Exposes a single GET endpoint for token refresh.

const express = require('express');
const { refresh } = require("../controllers/tokens");

const router = express.Router();

// Route:
// - GET: Endpoint for refreshing tokens using the 'refresh' controller.

router.route("/refresh").get(refresh);

module.exports.router = router;
