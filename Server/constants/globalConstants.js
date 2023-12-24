const APP_VARIABLES = {
    SOCKET_IO : "socketio",
    EMAIL_TRANSPORTER : "emailTransporter",
    EMAIL_OPTIONS : "emailOptions"
}
const MAIN_ROUTES = {
    CONVERSATION : "/api/conversation",
    USER : "/api/user",
    REPLY : "/api/reply",
    TOKEN : "/api/token",
    EMAIL : "/api/email"
}
const CLIENT_DEV_URL = `http://localhost:${process.env.CLIENT_DEV_PORT}`
const CLIENT_PRODUCTION_URL = 'https://commentsection.onrender.com'



module.exports = {
    APP_VARIABLES,
    MAIN_ROUTES,
    CLIENT_DEV_URL,
    CLIENT_PRODUCTION_URL
}