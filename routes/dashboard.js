const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
  const role = req.session.user.rolle;

  if (role === "admin") return res.redirect("/admin");
  if (role === "lærer") return res.redirect("/laerer/elever");
  if (role === "bedrift") return res.redirect("/bedrift");
  if (role === "elev") return res.redirect("/elev/min-side");

  res.redirect("/");
});

module.exports = router;
