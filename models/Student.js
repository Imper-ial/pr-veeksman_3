const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  navn: {
    type: String,
    required: true,
    trim: true
  },
  bedriftType: {
    type: String,
    enum: ["Praksisbedrift", "Lærebedrift"],
    required: true
  },
  bedriftNavn: {
    type: String,
    required: true,
    trim: true
  },
  startDato: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Student", studentSchema);
