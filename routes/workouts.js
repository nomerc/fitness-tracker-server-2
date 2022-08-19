const express = require("express"),
  router = express.Router(),
  authenticate = require("../middleware/auth");

const {
  createWorkout,
  updateWorkout,
  getSingleWorkout,
  getWorkouts,
  deleteWorkout,
} = require("../controllers/workoutController");

router.use(authenticate);

router.route("/").get(getWorkouts);
router.route("/").post(createWorkout);
router.route("/:date").get(getSingleWorkout);
router.route("/:date").post(updateWorkout);
router.route("/:date").delete(deleteWorkout);

module.exports = router;
