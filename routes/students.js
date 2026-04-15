const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

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

  if (!navn || !epost) {
    return res.render("students/new", {
      title: "Ny elev",
      error: "Navn og e-post må fylles ut.",
      formData: req.body
    });
  }

  try {
    await Student.create({ navn, epost, telefon });
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
