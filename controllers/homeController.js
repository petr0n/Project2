const express = require('express');
const router = express.Router();
const passport = require("passport");

let db = require("../models/");

const Op = db.Sequelize.Op //should this be in the index.js file?


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
	passport.authenticate('google', {
		// successRedirect : '/?success=1',
		failureRedirect: '/error',
		session: true
	}),
	(req, res) => {
		console.log('wooo we authenticated, here is our user object:', req.user);
		// res.json(req.user);
		// req.session.fullName = req.user.fullName;
		// req.session.email = req.user.email;
		// console.log('callback', req.user);
		res.redirect('/?loggedIn=true');
	}
);

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	console.log('req', req.isAuthenticated());
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/auth/google');
}


//Returns up to 5 events for display on the home page
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
		return res.render("index", { events: results });
	});
});

//Get all events with an event date greater than or equal to today 
router.get("/createEvent", function (req, res) {
	let data = { x: "f" };
	// console.log('createEvent res.user:', res.user);

	return res.render("create-event", { data: data });
});


//Get all events with an event date greater than or equal to today 
router.get("/events", function (req, res) {
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
		return res.render("events", { events: results });
	});
});


//Get event by id and include the organizer and helpers
router.get('/event/:id', function (req, res) {
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
	}).then(function (results) {
		// res.json(dbEvent);
		console.log((results));
		return res.render("event", { event: results });
	});
});

//Create User, Event and UsersEvents
router.post("/api/add/event", function (req, res) {
	console.log(req.body);
	db.User.create({
		fullName: req.body.fullName,
		email: req.body.email,
		googleIdToken: req.body.googleIdToken,
	}).then(function (dbUser) {
		console.log(dbUser)
		db.Event.create({
			eventTitle: req.body.eventTitle,  //need the names from the form
			eventLocation: req.body.eventLocation,
			eventDesc: req.body.eventDesc,
			eventDateTime: req.body.eventDateTime,
			byob: req.body.byob
		}).then(function (dbEvent) {
			console.log("#######");
			console.log(dbUser.dataValues.id);
			console.log(dbEvent);
			console.log(dbEvent)
			db.UsersEvents.create({
				UserId: dbUser.dataValues.id,
				eventId: dbEvent.dataValues.id,
				organizer: true
			}).then(function (dbUsersEvents) {
				console.log(dbUsersEvents)
				res.json(dbUsersEvents);
			});
		});
	});
});

//join event
// //TODO -- Parameters or part of the request body????
// router.post("/api/UsersEvents/:eventid/:userid", function (req, res) {
// 	console.log(req.body);
// 	db.UsersEvents.create({
// 		userId: req.param.userid,
// 		eventId: req.param.eventid
// 	}).then(function (dbUsersEvents) {
// 		res.json(dbUsersEvents);
// 	});
// });

// //create user
// router.post("/api/users", function (req, res) {
// 	console.log(req.body);
// 	db.User.create({
// 		fullName: req.body.fullName,
// 		email: req.body.email,
// 		googleIdToken: req.body.googleIdToken,
// 	}).then(function (dbUser) {
// 		res.json(dbUser);
// 	});
// });

module.exports = router;
