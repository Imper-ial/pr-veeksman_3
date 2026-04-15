const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/min-side", isAuthenticated, authorizeRole(["elev"]), (req, res) => {
  res.render("elev/min-side", {
    title: "Elev - min side",
    user: req.session.user
  });
});

module.exports = router;
