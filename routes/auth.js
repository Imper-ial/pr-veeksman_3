const express = require("express");
const argon2 = require("argon2");
const User = require("../models/User");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Registrering", error: null });
});

router.post("/register", async (req, res) => {
  try {
    const { navn, epost, passord, rolle } = req.body;

    const finnesFraFor = await User.findOne({ epost: epost.toLowerCase() });
    if (finnesFraFor) {
      return res.render("auth/register", {
        title: "Registrering",
        error: "E-post finnes allerede."
      });
    }

    // Hasher passordet før det lagres i databasen.
    const hashedPassword = await argon2.hash(passord);

    await User.create({
      navn,
      epost,
      passord: hashedPassword,
      rolle
    });

    res.redirect("/auth/login");
  } catch (error) {
    res.render("auth/register", {
      title: "Registrering",
      error: "Noe gikk galt. Prøv igjen."
    });
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Logg inn", error: null });
});

router.post("/login", async (req, res) => {
  try {
    const { epost, passord } = req.body;
    const user = await User.findOne({ epost: epost.toLowerCase() });

    if (!user) {
      return res.render("auth/login", {
        title: "Logg inn",
        error: "Feil e-post eller passord."
      });
    }

    const erGyldig = await argon2.verify(user.passord, passord);
    if (!erGyldig) {
      return res.render("auth/login", {
        title: "Logg inn",
        error: "Feil e-post eller passord."
      });
    }

    // Lagrer enkel brukerinfo i session ved innlogging.
    req.session.user = {
      id: user._id,
      navn: user.navn,
      epost: user.epost,
      rolle: user.rolle
    };

    res.redirect("/dashboard");
  } catch (error) {
    res.render("auth/login", {
      title: "Logg inn",
      error: "Noe gikk galt. Prøv igjen."
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
