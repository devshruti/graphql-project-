const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Please enter the Email"],
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: [true, "select role"]
    }
});

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel
};
