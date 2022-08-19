const ExerciseName = require("../models/ExerciseName");

exports.getExerciseNames = (req, res) => {
  ExerciseName.find()
    .then((ExerciseNames) => {
      res.send(ExerciseNames);
    })
    .catch((e) => res.send(e));
};

exports.createExerciseName = (req, res) => {
  ExerciseName.create(req.body)
    .then((ExerciseName) => res.send(ExerciseName))
    .catch((e) => res.send(e));
};
