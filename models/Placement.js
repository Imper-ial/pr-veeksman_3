const mongoose = require("mongoose");

function defaultSluttDato() {
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, 5, 19);
}

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
  },
  sluttDato: {
    type: Date,
    required: true,
    default: defaultSluttDato
  }
});

module.exports = mongoose.model("Placement", placementSchema);
