// Main contributors Sarah, Hamish and Wade

var express = require('express');
const session = require('express-session');
var router = express.Router();
const bcrypt = require('bcrypt'); // password encryption module
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/travelexperts";

var mySession = {
	secret: "xkcdbatstaple",
	cookie: {}
}

router.use(session(mySession));

//login submission
router.post("/login_form", (req, res) => {

});

//Logout button
router.post("/logout_form", (req, res) => {
	req.session.destroy();
	res.redirect('back');
});

// Hamish
router.get('/incorrectpass', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Incorrect Password', popText: 'USerId or Password incorrect', dest: 'index' });
});

// Hamish
router.get('/noemail', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Invalid Email', popText: 'Not a valid email, please register first', dest: "registration" });
});

// Hamish
router.get('/index', function (req, res, next) {
	res.render('index.ejs', {
		title: 'Sarah Hanson',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});

// Sarah
router.get('/', function (req, res, next) {
	res.render('index.ejs', {
		title: 'Sarah Hanson',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});

module.exports = router;