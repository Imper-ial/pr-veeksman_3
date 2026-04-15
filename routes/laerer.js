const express = require("express");
const Placement = require("../models/Placement");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/elever", isAuthenticated, authorizeRole(["lærer"]), async (req, res) => {
  const placements = await Placement.find()
    .populate("student")
    .populate("praksisbedrift")
    .populate("laerebedrift")
    .sort({ startDato: -1 });

  res.render("laerer/elever", {
    title: "Lærer - elevoversikt",
    placements
  });
});

module.exports = router;
