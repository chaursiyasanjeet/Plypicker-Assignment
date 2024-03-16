const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  admin: {
    type: Boolean,
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model("PlyPickerUser", userSchema);
