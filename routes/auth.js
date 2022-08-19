const express = require("express");
const router = express.Router();

//Routes
const authGoogleRoute = require("./authGoogle");
const authFacebookRoute = require("./authFacebook");
const authTwitterRoute = require("./authTwitter");
const authInstagramRoute = require("./authInstagram");
const authGithubRoute = require("./authGithub");
const authLocalRoute = require("./authLocal");

router.use("/google", authGoogleRoute);
router.use("/facebook", authFacebookRoute);
router.use("/twitter", authTwitterRoute);
router.use("/instagram", authInstagramRoute);
router.use("/github", authGithubRoute);
router.use("/local", authLocalRoute);

router.post("/isAuthenticated", function (req, res) {
  res.send(req.isAuthenticated());
});

router.post("/signout", function (req, res) {
  req.session.destroy(function (err) {
    res.clearCookie("connect.sid");
    res.status(200).send({ message: "Signed out" });
  });
});

module.exports = router;
