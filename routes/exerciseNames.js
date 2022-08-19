const express = require("express");
const router = express.Router();
const {
  getExerciseNames,
  createExerciseName,
} = require("../controllers/exerciseNameController");

router.route("/").get(getExerciseNames);
router.route("/").post(createExerciseName);

module.exports = router;
