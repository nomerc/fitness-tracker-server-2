const mongoose = require("mongoose"),
  crypto = require("crypto"),
  validator = require("validator");

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"],
    unique: true,
    // validate: [
    //   validator.isAlphanumeric,
    //   "Usernames may only have letters and numbers.",
    // ],
    minlength: 1,
    trim: true,
  },
  displayedName: {
    type: String,
    required: false,
    trim: true,
  },
  providerName: {
    type: String,
    required: true,
  },
  providerId: {
    type: String,
    required: false,
  },
  hashed_password: {
    type: Buffer,
    required: [
      function () {
        return this.providerName === "local";
      },
      "Password required",
    ],
    minlength: 8,
  },
  salt: {
    type: Buffer,
    required: false,
  },
});

UserSchema.methods.verifyPassword = function (password) {
  const user = this;

  return crypto.timingSafeEqual(
    user.hashed_password,
    crypto.pbkdf2Sync(password, user.salt, 310000, 32, "sha256")
  );
};

//Middleware executes before save
UserSchema.pre("save", function (next, req_res) {
  const { req, res } = { ...req_res },
    user = this,
    salt = crypto.randomBytes(16);

  //logged with social no password attached
  if (!user.hashed_password) next();

  crypto.pbkdf2(
    user.hashed_password,
    salt,
    310000,
    32,
    "sha256",
    function (err, hashedPassword) {
      if (err) {
        next(err);
      }

      //saving hashed password
      user.hashed_password = hashedPassword;
      user.salt = salt;

      //Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
      req.login(user, function (err) {
        if (err) {
          next(err);
        }
        next();
      });
    }
  );
});

module.exports = mongoose.model("User", UserSchema);
