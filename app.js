// Created by Sarah Hason, Wade Grimm and Hamish Harrison
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const monk = require('monk');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = monk('localhost:27017/travelexperts');
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/travelexperts";

console.log("./>------------------<\\\n<<>> Server Running <<>>\n.\\>------------------</");
console.log("Listening on port: 3000");

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/scripts')));

console.log("public folders loaded");
app.use('/', indexRouter);
//app.use('/users', usersRouter);
console.log("router set");

app.post("/post_form", (req, res) => {
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
      //console.log("Plain pwd: " + myPlaintextPassword);
      //console.log("Hashed pwd: " + hash);
      formData[10] = hash;
    });
  });

});

// Sarah Hanson -> I have no idea what this was used for
function sort_by_key(array, key) {
  return array.sort(function (a, b) {
    var x = a[key]; var y = b[key];
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
});

module.exports = app;