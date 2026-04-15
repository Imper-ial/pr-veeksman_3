const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
  res.render("dashboard/index", {
    title: "Dashboard",
    user: req.session.user
  });
});

module.exports = router;
