const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  DOB: Date,
  Role: String,
  location: String,
  password: String,
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
