const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
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
  telefon: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model("Student", studentSchema);
