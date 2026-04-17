const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const authorizeRole = require("../middleware/authorizeRole");
const Student = require("../models/Student");
const Company = require("../models/Company");
const {
  findEndedPlacements,
  deleteExpiredPlacementData
} = require("../services/placementLifecycleService");

const router = express.Router();

router.get("/", isAuthenticated, authorizeRole(["admin"]), async (req, res) => {
  const studentCount = await Student.countDocuments();
  const companyCount = await Company.countDocuments();
  const cleanupResult = await deleteExpiredPlacementData();
  const finishedPlacements = await findEndedPlacements();

  res.render("admin/index", {
    title: "Admin",
    user: req.session.user,
    studentCount,
    companyCount,
    cleanupResult,
    finishedPlacements
  });
});

module.exports = router;
