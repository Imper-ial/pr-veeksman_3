const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");
const Student = require("../models/Student");
const Placement = require("../models/Placement");
const Statement = require("../models/Statement");

const router = express.Router();

router.get("/min-side", isAuthenticated, authorizeRole(["elev"]), async (req, res) => {
  const student = await Student.findOne({ epost: req.session.user.epost });

  let placement = null;
  let statements = [];

  if (student) {
    placement = await Placement.findOne({ student: student._id })
      .populate("praksisbedrift")
      .populate("laerebedrift");
    statements = await Statement.find({ student: student._id }).sort({ dato: -1 });
  }

  res.render("elev/min-side", {
    title: "Elev - min side",
    user: req.session.user,
    student,
    placement,
    statements
  });
});

module.exports = router;
