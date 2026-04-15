const mongoose = require("mongoose");

const statementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  tekst: {
    type: String,
    required: true,
    trim: true
  },
  skrevetAv: {
    type: String,
    required: true
  },
  dato: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Statement", statementSchema);
