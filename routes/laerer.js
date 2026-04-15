const express = require("express");
const Student = require("../models/Student");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/elever", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const students = await Student.find().sort({ startDato: -1 });
  res.render("laerer/elever", {
    title: "Lærer - elevoversikt",
    students
  });
});

module.exports = router;
