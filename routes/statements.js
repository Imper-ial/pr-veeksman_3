const express = require("express");
const Statement = require("../models/Statement");
const Student = require("../models/Student");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/", isAuthenticated, authorizeRole(["lærer", "bedrift"]), async (req, res) => {
  const statements = await Statement.find()
    .populate("student")
    .sort({ dato: -1 });
  res.render("statements/index", { title: "Tjenesteuttalelser", statements });
});

router.get("/ny", isAuthenticated, authorizeRole(["bedrift"]), async (req, res) => {
  const students = await Student.find().sort({ navn: 1 });
  res.render("statements/new", {
    title: "Ny tjenesteuttalelse",
    error: null,
    students,
    formData: {}
  });
});

router.post("/", isAuthenticated, authorizeRole(["bedrift"]), async (req, res) => {
  const { student, tekst } = req.body;

  if (!student || !tekst) {
    const students = await Student.find().sort({ navn: 1 });
    return res.render("statements/new", {
      title: "Ny tjenesteuttalelse",
      error: "Du må velge elev og skrive tekst.",
      students,
      formData: req.body
    });
  }

  await Statement.create({
    student,
    tekst,
    skrevetAv: req.session.user.navn
  });

  res.redirect("/uttalelser");
});

module.exports = router;
