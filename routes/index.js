const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Forside", user: req.session.user || null });
});

router.get("/gdpr", (req, res) => {
  res.render("gdpr", { title: "GDPR og sikkerhet" });
});

module.exports = router;
