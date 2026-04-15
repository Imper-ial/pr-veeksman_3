const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  praksisbedrift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  laerebedrift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  startDato: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Placement", placementSchema);
