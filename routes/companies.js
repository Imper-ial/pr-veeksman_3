const express = require("express");
const Company = require("../models/Company");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

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

  if (!navn || !type) {
    return res.render("companies/new", {
      title: "Ny bedrift",
      error: "Navn og type må fylles ut.",
      formData: req.body
    });
  }

  await Company.create({ navn, type, kontaktperson });
  res.redirect("/bedrifter");
});

module.exports = router;
