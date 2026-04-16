const express = require("express");
const Placement = require("../models/Placement");
const Student = require("../models/Student");
const Company = require("../models/Company");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const placements = await Placement.find()
    .populate("student")
    .populate("praksisbedrift")
    .populate("laerebedrift")
    .sort({ startDato: -1 });

  res.render("placements/index", { title: "Plasseringer", placements });
});

router.get("/ny", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const students = await Student.find().sort({ navn: 1 });
  const praksisbedrifter = await Company.find({ type: "praksisbedrift" }).sort({ navn: 1 });
  const laerebedrifter = await Company.find({ type: "laerebedrift" }).sort({ navn: 1 });

  res.render("placements/new", {
    title: "Ny plassering",
    error: null,
    students,
    praksisbedrifter,
    laerebedrifter,
    formData: {}
  });
});

router.post("/", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const { student, praksisbedrift, laerebedrift, startDato } = req.body;

  if (!student || !praksisbedrift || !laerebedrift || !startDato) {
    const students = await Student.find().sort({ navn: 1 });
    const praksisbedrifter = await Company.find({ type: "praksisbedrift" }).sort({ navn: 1 });
    const laerebedrifter = await Company.find({ type: "laerebedrift" }).sort({ navn: 1 });

    return res.render("placements/new", {
      title: "Ny plassering",
      error: "Alle felt må fylles ut.",
      students,
      praksisbedrifter,
      laerebedrifter,
      formData: req.body
    });
  }

  const foundStudent = await Student.findById(student);
  const foundPraksis = await Company.findOne({ _id: praksisbedrift, type: "praksisbedrift" });
  const foundLaere = await Company.findOne({ _id: laerebedrift, type: "laerebedrift" });

  if (!foundStudent || !foundPraksis || !foundLaere) {
    const students = await Student.find().sort({ navn: 1 });
    const praksisbedrifter = await Company.find({ type: "praksisbedrift" }).sort({ navn: 1 });
    const laerebedrifter = await Company.find({ type: "laerebedrift" }).sort({ navn: 1 });

    return res.render("placements/new", {
      title: "Ny plassering",
      error: "Ugyldig elev eller bedriftvalg.",
      students,
      praksisbedrifter,
      laerebedrifter,
      formData: req.body
    });
  }

  await Placement.create({ student, praksisbedrift, laerebedrift, startDato });
  res.redirect("/plasseringer");
});

module.exports = router;
