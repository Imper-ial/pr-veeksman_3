const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");
const { isValidEmail, isValidPhone, hasText } = require("../middleware/validation");

// Vis alle elever
router.get("/", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const students = await Student.find().sort({ navn: 1 });
  res.render("students/index", { title: "Elever", students, error: null });
});

// Vis skjema for ny elev
router.get("/ny", isAuthenticated, authorizeRole(["lærer"]), (req, res) => {
  res.render("students/new", { title: "Ny elev", error: null, formData: {} });
});

// Lagre ny elev
router.post("/", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const { navn, epost, telefon } = req.body;
  const cleanEmail = String(epost || "").trim().toLowerCase();

  if (!hasText(navn, 2) || !isValidEmail(cleanEmail)) {
    return res.render("students/new", {
      title: "Ny elev",
      error: "Skriv gyldig navn og e-post.",
      formData: req.body
    });
  }

  if (!isValidPhone(telefon)) {
    return res.render("students/new", {
      title: "Ny elev",
      error: "Telefon har ugyldig format.",
      formData: req.body
    });
  }

  try {
    await Student.create({ navn: navn.trim(), epost: cleanEmail, telefon: String(telefon || "").trim() });
  } catch (error) {
    return res.render("students/new", {
      title: "Ny elev",
      error: "Kunne ikke lagre elev. Sjekk om e-post allerede finnes.",
      formData: req.body
    });
  }

  res.redirect("/elever");
});

module.exports = router;
