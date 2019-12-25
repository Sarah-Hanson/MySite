// Main contributors Sarah, Hamish and Wade

var express = require('express');
const session = require('express-session');
var router = express.Router();
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/travelexperts";

var mySession = {
	secret: "xkcdbatstaple",
	cookie: {}
}

router.use(session(mySession));

//login submission - Hamish, password encryption check - Wade
router.post("/login_form", (req, res) => {
	const bcrypt = require('bcrypt'); // password encryption module
	var userEmail = req.body.CustEmail.toLowerCase();
	var userPass = req.body.CustPassword;
	var pwdHashed = false;

	//connecting to database
	mongo.connect(url, { useUnifiedTopology: true}, (err, client) => {
		if (err) { throw err;
		} else {
			//console.log(userEmail);
			//console.log("Connected to Database");
			//find posted email
			var dbo = client.db("travelexperts");
			dbo.collection("customers").findOne({ CustEmail: userEmail }, (err, result) => {
				if (err) {
					throw err;
				} else {
					//No email
					//console.log(result);
					//console.log()
					if (result == null) {
						res.redirect("/noemail"); //check naming
					}
					else {
						//password checked and correct
						bcrypt.compare(userPass, result.CustPassword, function (err, pwdResult) { // compare hashed password from db to password provided
							if (pwdResult) {
								//console.log("Customer Name pass is correct");
								req.session.loginName = result.CustFirstName;
								req.session.loggedIn = true;
								req.session._id = result._id
								// console.log(req.session.id);
								//console.log("Login Name is: " + loginName);
								//console.log("Logged in: " + loggedIn);
								res.redirect("/index");
							}
							else {  //if passwords do not match
								res.redirect("/incorrectpass");
							};
						});
					}
				}
			});
		}
	});
});

//Logout button - Hamish
router.post("/logout_form", (req, res) => {

	//req.sessionloginName = "";
	req.session.destroy();
	res.redirect("/index");

});

// Sarah Hanson
router.get('/vacation', function (req, res) {
	var db = req.db;

	var collection = db.get('packages');
	collection.find({}, {}, function (e, docs) {
		// Send that array of stuff to the EJS page 'userlist' to make a web page with em all
		res.render('vacayPackages.ejs',
			{
				title: "Vacation Packages",
				pkgList: docs,
				name: req.session.loginName,
				loggedstat: req.session.loggedIn
			});
	});
});

// Sarah Hanson
router.get('/pickapackage', function (req, res, next) {
	if (req.session.loggedIn) {
		var db = req.db;
		var collection = db.get('packages');
		collection.find({}, {}, function (e, docs) {
			res.render('pickapackage.ejs', {
				title: 'Choose your Destination!',
				pkgList: docs,
				pkgArr: JSON.stringify(docs),
				pkgID: req.query.pkgID,
				name: req.session.loginName,
				loggedstat: req.session.loggedIn,
				custID: req.session._id
			});
		});
	}
	else {
		res.redirect("/pickError");
	}
});

// Wade Grimm
router.get('/registration', function (req, res, next) {
	res.render('registration.ejs', {
		title: 'Client Registration',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});

// Wade Grimm
router.get('/thanksReg', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Thanks for your data', popText: 'Thank you for registering', dest: 'index' });
});

// Sarah Hanson
router.get('/thanksBook', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Thanks for booking', popText: 'Thanks you for booking with Travel Experts', dest: 'index' });
});

// Wade Grimm
router.get('/regerror', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Data Exists', popText: 'Registration Error - User or email exists, please check data and resubmit', dest: 'registration' });
});

// Sarah? Hamish?
router.get('/pickError', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Not logged in', popText: 'Please log in before booking a package', dest: 'registration' });
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
		title: 'Travel Experts',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});

// Sarah
router.get('/', function (req, res, next) {
	res.render('index.ejs', {
		title: 'Travel Experts',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});


module.exports = router;