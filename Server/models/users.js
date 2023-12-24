// User Schema:
// - Defines the MongoDB schema for a user, including user type, first name, last name,
//   username, password, email, and image.

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    usertype: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    email: String,
    image: String,
});

// User Model:
// - Creates a MongoDB model named 'users' using the defined schema.

const User = mongoose.model('users', userSchema);

module.exports.User = User;
