const Placement = require("../models/Placement");
const Statement = require("../models/Statement");

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

async function deleteExpiredPlacementData(referenceDate = new Date()) {
  const placementsToDelete = await findPlacementsReadyForDeletion(referenceDate);

  if (placementsToDelete.length === 0) {
    return { deletedPlacements: 0, deletedStatements: 0 };
  }

  const placementIds = placementsToDelete.map((placement) => placement._id);
  const studentIds = [
    ...new Set(
      placementsToDelete
        .map((placement) => String(placement.student?._id || placement.student))
        .filter(Boolean)
    )
  ];

  const placementDeleteResult = await Placement.deleteMany({
    _id: { $in: placementIds }
  });

  let deletedStatements = 0;
  if (studentIds.length > 0) {
    const statementDeleteResult = await Statement.deleteMany({
      student: { $in: studentIds }
    });
    deletedStatements = statementDeleteResult.deletedCount || 0;
  }

  return {
    deletedPlacements: placementDeleteResult.deletedCount || 0,
    deletedStatements
  };
}

module.exports = {
  findEndedPlacements,
  findPlacementsReadyForDeletion,
  deleteExpiredPlacementData
};
