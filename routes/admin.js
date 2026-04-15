const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/", isAuthenticated, authorizeRole(["admin"]), (req, res) => {
  res.render("admin/index", {
    title: "Admin",
    user: req.session.user
  });
});

module.exports = router;
