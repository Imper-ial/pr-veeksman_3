const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Forside", user: req.session.user || null });
});

router.get("/gdpr", (req, res) => {
  res.render("gdpr", { title: "GDPR og sikkerhet" });
});

router.get("/faq", (req, res) => {
  res.render("faq", { title: "FAQ" });
});

module.exports = router;
