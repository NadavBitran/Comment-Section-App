// Email Router:
// - Defines an Express router for handling email-related API endpoint.
// - Imports the controller for sending emails.
// - Exposes a single POST endpoint for sending emails.

const express = require('express');
const { sendEmail } = require('../controllers/emails');

const router = express.Router();

// Route:
// - POST: Endpoint for sending emails using the 'sendEmail' controller.

router.route("/").post(sendEmail);

module.exports.router = router;
