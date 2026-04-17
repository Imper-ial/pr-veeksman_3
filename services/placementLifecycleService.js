const Placement = require("../models/Placement");

function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function daysAgo(days, fromDate = new Date()) {
  const result = new Date(fromDate);
  result.setDate(result.getDate() - days);
  result.setHours(23, 59, 59, 999);
  return result;
}

async function findEndedPlacements(referenceDate = new Date()) {
  return Placement.find({
    sluttDato: { $lte: endOfDay(referenceDate) }
  })
    .populate("student")
    .sort({ sluttDato: 1 });
}

async function findPlacementsReadyForDeletion(referenceDate = new Date()) {
  const deleteLimit = daysAgo(30, referenceDate);

  return Placement.find({
    sluttDato: { $lte: deleteLimit }
  })
    .populate("student")
    .sort({ sluttDato: 1 });
}

module.exports = {
  findEndedPlacements,
  findPlacementsReadyForDeletion
};
