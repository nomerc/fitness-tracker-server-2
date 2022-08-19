// test authentication
const authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // return err();
  // res.status(401).send({ err: "unauthenticated" });
};

module.exports = authenticate;
