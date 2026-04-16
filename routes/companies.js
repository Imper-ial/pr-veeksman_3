const express = require("express");
const Company = require("../models/Company");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");
const { hasText } = require("../middleware/validation");

const router = express.Router();

router.get("/", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const companies = await Company.find().sort({ navn: 1 });
  res.render("companies/index", { title: "Bedrifter", companies, error: null });
});

router.get("/ny", isAuthenticated, authorizeRole(["lærer"]), (req, res) => {
  res.render("companies/new", { title: "Ny bedrift", error: null, formData: {} });
});

router.post("/", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const { navn, type, kontaktperson } = req.body;
  const allowedTypes = ["praksisbedrift", "laerebedrift"];

  if (!hasText(navn, 2) || !allowedTypes.includes(type)) {
    return res.render("companies/new", {
      title: "Ny bedrift",
      error: "Skriv gyldig navn og velg en gyldig type.",
      formData: req.body
    });
  }

  await Company.create({
    navn: navn.trim(),
    type,
    kontaktperson: String(kontaktperson || "").trim()
  });
  res.redirect("/bedrifter");
});

module.exports = router;
