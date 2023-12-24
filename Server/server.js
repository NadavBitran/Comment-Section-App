// @BREIF: Server Setup
// - Configures an Express.js server with MongoDB, Socket.io, and Nodemailer.
// - Defines routes for conversations, users, replies, tokens, and email.
// - Sets up CORS, JSON parsing, and cookie middleware.

const dovenv = require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socket = require('socket.io');
const cookieParser = require('cookie-parser');
const nodeMailer = require("nodemailer");

const {APP_VARIABLES , MAIN_ROUTES , CLIENT_DEV_URL , CLIENT_PRODUCTION_URL} = require("./constants/globalConstants")

// Import Route Modules:
const conversationsRoutes = require('./routes/conversations').router;
const usersRoutes = require("./routes/users").router;
const repliesRoutes = require("./routes/replies").router;
const tokensRoutes = require("./routes/tokens").router;
const emailRoutes = require("./routes/email").router;

// Create Server & Socket:
const app = express();
const server = http.createServer(app);
const io = socket(server, { cors: { origin: [CLIENT_PRODUCTION_URL] } });

// Create NodeMailer Transport:
const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: { user: process.env.CONTACT_TEAM_EMAIL, pass: process.env.CONTACT_TEAM_PASS }
});
const mailOptions = { from: process.env.CONTACT_TEAM_EMAIL, to: process.env.CONTACT_TEAM_EMAIL };

// Middleware Setup:
app.use(cors({ origin: [CLIENT_PRODUCTION_URL], credentials: true }));
app.use(express.json());
app.use(cookieParser());

// App Variables Setup:
app.set(APP_VARIABLES.SOCKET_IO, io);
app.set(APP_VARIABLES.EMAIL_TRANSPORTER, transporter);
app.set(APP_VARIABLES.EMAIL_OPTIONS, mailOptions);

// Link to Routes:
app.use(MAIN_ROUTES.CONVERSATION, conversationsRoutes);
app.use(MAIN_ROUTES.USER, usersRoutes);
app.use(MAIN_ROUTES.REPLY, repliesRoutes);
app.use(MAIN_ROUTES.TOKEN, tokensRoutes);
app.use(MAIN_ROUTES.EMAIL, emailRoutes);

// MongoDB & Server Setup:
const PORT = process.env.SERVER_DEV_PORT;
const CONNECTION_URL = process.env.MONGO_CONNECTION_URL;

mongoose
    .connect(CONNECTION_URL)
    .then(() => server.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); }))
    .catch((error) => console.log(error.message));
