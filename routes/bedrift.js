const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");
const Statement = require("../models/Statement");

const router = express.Router();

router.get("/", isAuthenticated, authorizeRole(["bedrift"]), async (req, res) => {
  const statements = await Statement.find({ skrevetAv: req.session.user.navn })
    .populate("student")
    .sort({ dato: -1 })
    .limit(5);

  res.render("bedrift/index", {
    title: "Bedrift-dashboard",
    statements
  });
});

router.get("/uttalelse", isAuthenticated, authorizeRole(["bedrift"]), (req, res) => {
  res.redirect("/uttalelser/ny");
});

module.exports = router;
