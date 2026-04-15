const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  navn: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["praksisbedrift", "laerebedrift"],
    required: true
  },
  kontaktperson: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model("Company", companySchema);
