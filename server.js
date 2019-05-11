require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const passport = require("passport");
const auth = require('./auth')
const db = require("./models");

// const Sequelize = require("sequelize");
// const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// auth
auth(passport);
app.use(passport.initialize());


// Configure the session and session storage.
const sessionConfig = {
  resave: false,
  saveUninitialized: false,
  secret: "d3fu0djqefnoasidjfJPFH#9342",
  //cookie: { maxAge: 60000 }
  // store: new SequelizeStore({
  //   db: sequelize,
  //   table: 'Session'
  // }),
};

app.use(passport.session(sessionConfig));


// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

let routes = require('./controllers/homeController.js');
app.use(routes);

var syncOptions = { force: true };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}


// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
