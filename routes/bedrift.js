const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");

const router = express.Router();

router.get("/uttalelse", isAuthenticated, authorizeRole(["bedrift"]), (req, res) => {
  res.render("bedrift/uttalelse", {
    title: "Bedrift - tjenesteuttalelse",
    saved: false
  });
});

router.post("/uttalelse", isAuthenticated, authorizeRole(["bedrift"]), (req, res) => {
  const { elevNavn, tekst } = req.body;

  // Midlertidig løsning: viser bare tilbake det som ble skrevet.
  res.render("bedrift/uttalelse", {
    title: "Bedrift - tjenesteuttalelse",
    saved: true,
    elevNavn,
    tekst
  });
});

module.exports = router;
