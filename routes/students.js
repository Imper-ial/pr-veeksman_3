const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// Vis alle elever
router.get("/", async (req, res) => {
  const students = await Student.find().sort({ startDato: -1 });
  res.render("students/index", { title: "Elever", students });
});

// Vis skjema for ny elev
router.get("/ny", (req, res) => {
  res.render("students/new", { title: "Ny elev" });
});

// Lagre ny elev
router.post("/", async (req, res) => {
  const { navn, bedriftType, bedriftNavn, startDato } = req.body;

  await Student.create({
    navn,
    bedriftType,
    bedriftNavn,
    startDato
  });

  res.redirect("/elever");
});

module.exports = router;
