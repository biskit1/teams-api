const mongoose = require('mongoose');
let Schema = mongoose.Schema;

// create the userSchema
let userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    fullName: String,
    role: String
});

// make this schema available to the Node application
module.exports = userSchema;