const Workout = require("../models/Workout");
// const CustomError = require("../utilities/CustomError");
// const asyncMiddleware = require('../middlewares/asyncMiddleware');

exports.getSingleWorkout = async (req, res) => {
  const workoutDate = req.params.date;

  // if (req.user) {
  //     Product.find({ user_id: req.user._id }, (err, products) => {
  //       if (err) {
  //         next(err);
  //       }
  //       res.status(200).send({ products });
  //       // SSR
  //       // res.render("pages/success", { user: req.user, products });
  //     });
  //   } else next({ err: "User not defined" });

  const workout =
    (await Workout.findOne({ _userId: req.user._id, date: workoutDate })) ||
    (await Workout.findOne({ _userId: req.user._id, date: 0 }));

  if (workout) {
    res.json(workout);
  } else {
    res.json({ message: "Workout not found" });
  }
};

exports.getWorkouts = (req, res) => {
  //return an array of workouts that belong to authenticated user
  Workout.find({ _userId: req.user._id })
    .then((workout) => {
      res.send(workout);
    })
    .catch((e) => res.send(e));
};

exports.createWorkout = (req, res) => {
  Workout.create({ _userId: req.user._id, ...req.body })
    .then((workout) => res.send(workout))
    .catch((e) => res.send(e));
};

exports.updateWorkout = (req, res) => {
  // const workoutDate = req.params.date;
  const workout = {
    _userId: req.user._id,
    date: req.body.date,
    exercises: req.body.exercises,
  };

  Workout.findOneAndUpdate(
    { _userId: req.user._id, date: req.body.date },
    workout,
    { upsert: true }
  )
    .then(() => res.send(workout))
    .catch((e) => res.send(e));
};

exports.deleteWorkout = (req, res) => {
  Workout.findOneAndRemove({ _userId: req.user._id, date: req.params.date })
    .then((workout) => res.send(workout))
    .catch((e) => res.send(e));
};
