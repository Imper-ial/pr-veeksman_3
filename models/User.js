const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  navn: {
    type: String,
    required: true,
    trim: true
  },
  epost: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  passord: {
    type: String,
    required: true
  },
  rolle: {
    type: String,
    enum: ["admin", "lærer", "bedrift", "elev"],
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
