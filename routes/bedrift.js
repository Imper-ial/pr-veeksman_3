const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/uttalelse", isAuthenticated, authorizeRole(["bedrift"]), (req, res) => {
  res.redirect("/uttalelser/ny");
});

module.exports = router;
