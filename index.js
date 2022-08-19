/*  EXPRESS */
const express = require("express"),
  db = require("./config/db"),
  errorController = require("./controllers/errController"),
  User = require("./models/User"),
  morgan = require("morgan"),
  path = require("path"),
  cors = require("cors"),
  passport = require("passport"),
  session = require("express-session"),
  bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

// Express App
const app = express();

//body parser middleware
app.use(bodyParser.json());

// Load Config File
require("dotenv").config({ path: "./config/config.env" });

// Connect To Database
db().then();

// Enable cors
app.use(cors({ origin: "http://localhost:4200", credentials: true }));

//logger
app.use(morgan("dev"));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

//session middleware configuration
app.use(
  session({
    resave: false, //if true - forces the session to be saved back to the session store

    saveUninitialized: false, //if true - forces a session that is “uninitialized” to be saved to the store

    secret: "JK4FFD2EK8JF_fdfer",
  })
);

//initialize passport
app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  // done(null, id);

  //   //If using Mongoose with MongoDB; if other you will need JS specific to that schema.
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Load Routes
const workoutsRoute = require("./routes/workouts");
const exerciseNamesRoute = require("./routes/exerciseNames");
const usersRoute = require("./routes/users");

// Use Routes
app.get("/", (req, res) => res.render("pages/signIn"));
app.use("/auth", require("./routes/auth"));

app.use("/workouts", workoutsRoute);
app.use("/exercise_names", exerciseNamesRoute);
app.use("/users", usersRoute);

app.use(errorController);
// Define Port Number
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
