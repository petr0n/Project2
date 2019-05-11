const express = require('express');
const router = express.Router();

let db = require("../models/");

const Op = db.Sequelize.Op //should this be in the index.js file?


var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
		clientID: "234723525029-c4timr4uknpgqe25c7m3votrsdq7ikau.apps.googleusercontent.com",
		clientSecret: "sF7P_qX_Z-MeyFcv4i3PZoIR",
		callbackURL: "https://trashtaggers.herokuapp.com/auth/google/join"
	},
  function(accessToken, refreshToken, profile, done) {
		console.log('profile', profile.displayName, profile.emails[0].value);
		db.User.findOrCreate({ 
			where: {
        email: profile.emails[0].value
			}, 
			defaults: {
				googleIdToken: profile.id,
				fullName: profile.displayName,
				email: profile.emails[0].value
			}
		},
		function(err, user) {
			// console.log('findorCreate user: ', user);
			return done(user.fullName);
		});
	}
));



// GET /auth/google
router.get('/auth/google',
	passport.authenticate('google', { 
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		] 
	})
);

router.get('/auth/google/join', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});


router.get('/', function (req, res) {
	db.Event.findAll({
		where: {
			eventDateTime: {
				[Op.gte]: new Date() // or maybe moment().toDate(); 
			}
		},
		order: [['eventDateTime', 'ASC']],
		limit: 5
	}).then(function (results) {
		// res.json(results); //TODO return html instead of json
		return res.render("index", {events: results});
	});
});

//Get all events with an event date greater than or equal to today 
router.get("/api/events", function (req, res) {
	db.Event.findAll({
		where: {
			eventDateTime: {
				[Op.gte]: new Date() // or maybe moment().toDate(); 
			}
		},
		order: [['eventDateTime', 'ASC']]
	}).then(function (results) {
		// res.json(dbEvent);
		// console.log(res.json(dbEvent)); 
		return res.render("events", {events: results});
	}); 
});

//Get event by id and include the organizer and helpers
router.get('/api/events/:id', function (req, res) {
	db.Event.findAll({
		where: {
			id: req.params.id
		},
		include: [{
			model: db.UsersEvents,
			include: [{
				model: db.User
			}]
		}]
	}).then(function (dbEvent) {
		res.json(dbEvent);
	});
});

//Create Event and UsersEvents
router.post("/api/add/events", function (req, res) {
	console.log(req.body);
	db.Event.create({
		eventTitle: req.body.eventTitle,  //need the names from the form
		eventLocation: req.body.eventLocation,
		eventDesc: req.body.eventDesc,
		eventDateTime: req.body.eventDateTime,
		byob: req.body.byob
	}).then(function (dbEvent) {
		db.UsersEvents.create({
			userId: req.param.userid,
			eventId: dbEvent.event_id,
			organizer: 'true'
		}).then(function (dbUsersEvents) {
			res.json(dbUsersEvents);
		});
	});

});

//join event
//TODO -- Parameters or part of the request body????
router.post("/api/UsersEvents/:eventid/:userid", function (req, res) {
	console.log(req.body);
	db.UsersEvents.create({
		userId: req.param.userid,
		eventId: req.param.eventid
	}).then(function (dbUsersEvents) {
		res.json(dbUsersEvents);
	});
});

//create user
router.post("/api/users", function (req, res) {
	console.log(req.body);
	db.User.create({
		fullName: req.body.fullName,
		email: req.body.email,
		googleIdToken: req.body.googleIdToken,
	}).then(function (dbUser) {
		res.json(dbUser);
	});
});

module.exports = router;
