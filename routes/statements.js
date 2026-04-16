const express = require("express");
const Statement = require("../models/Statement");
const Student = require("../models/Student");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");
const { hasText } = require("../middleware/validation");

const router = express.Router();

router.get("/", isAuthenticated, authorizeRole(["lærer", "bedrift"]), async (req, res) => {
  let query = {};
  if (req.session.user.rolle === "bedrift") {
    // Bedrift skal bare se egne uttalelser.
    query = { skrevetAv: req.session.user.navn };
  }

  const statements = await Statement.find(query).populate("student").sort({ dato: -1 });
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

  if (!student || !hasText(tekst, 10)) {
    const students = await Student.find().sort({ navn: 1 });
    return res.render("statements/new", {
      title: "Ny tjenesteuttalelse",
      error: "Velg elev og skriv minst 10 tegn.",
      students,
      formData: req.body
    });
  }

  const foundStudent = await Student.findById(student);
  if (!foundStudent) {
    const students = await Student.find().sort({ navn: 1 });
    return res.render("statements/new", {
      title: "Ny tjenesteuttalelse",
      error: "Elev finnes ikke.",
      students,
      formData: req.body
    });
  }

  await Statement.create({
    student,
    tekst: tekst.trim(),
    skrevetAv: req.session.user.navn
  });

  res.redirect("/uttalelser");
});

module.exports = router;
