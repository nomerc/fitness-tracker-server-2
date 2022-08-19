const express = require("express"),
  passport = require("passport"),
  User = require("../models/User");

LocalStrategy = require("passport-local").Strategy;

const router = express.Router();
const { auth } = require("../controllers/authController");

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }

      if (user.verifyPassword(password)) return done(null, user);
      return done(null, false);
    });
  })
);

router.post(
  "/",
  passport.authenticate("local", {
    failWithError: true,
  }),
  (req, res) => {
    //response for client
    res.status(200).send({
      _id: req.user._id,
      username: req.user.username,
      displayedName: req.user.displayedName,
      providerName: req.user.providerName,
    });
  },
  (err, req, res, next) => {
    next(err);
  }
);

router.post("/register", async (req, res, next) => {
  const user = new User({
    username: req.body.username,
    displayedName: req.body.displayed,
    providerName: "local",
    hashed_password: req.body.password,
  });

  try {
    await user.save({ req, res });
  } catch (err) {
    return next(err);
  }

  res.status(200).send({
    _id: req.user._id,
    username: req.user.username,
    displayedName: req.user.displayedName,
    providerName: req.user.providerName,
  }),
    (err, req, res, next) => {
      return next(err);
    };
});

module.exports = router;
