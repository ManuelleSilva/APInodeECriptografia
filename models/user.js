const mongoose = require("mongoose");

const User = mongoose.model("User", {
    email: String,
    pass: String, 
});

module.exports = User;