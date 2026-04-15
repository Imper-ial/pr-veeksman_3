function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      return res.redirect("/auth/login");
    }

    // Admin skal ha tilgang til alle sider.
    if (user.rolle === "admin") {
      return next();
    }

    if (!allowedRoles.includes(user.rolle)) {
      return res.status(403).render("access-denied", { title: "Ingen tilgang" });
    }

    next();
  };
}

module.exports = authorizeRole;
