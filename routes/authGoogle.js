const express = require("express"),
  passport = require("passport"),
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const router = express.Router();
const { verify } = require("../controllers/authController");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    verify
  )
);

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failWithError: true,
  }),

  function (req, res) {
    var responseHTML =
      '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
    responseHTML = responseHTML.replace(
      "%value%",
      JSON.stringify({
        user: {
          _id: req.user._id,
          username: req.user.username,
          providerName: req.user.providerName,
        },
      })
    );
    res.status(200).send(responseHTML);
  },
  (err, req, res, next) => {
    next(err);
  }
);

module.exports = router;
