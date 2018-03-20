require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');//social auth
var expressValidator = require('express-validator');
var pg = require('pg');
var session = require('express-session');
var pgStore = require('connect-pg-simple')(session);
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


// var index = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());





app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*-------Passport Configuration------*/

app.use(expressValidator());
app.use(session({
		saveUninitialized:false,
    secret: process.env.FOO_COOKIE_SECRET,
    store: new pgStore({ conString: process.env.DATABASE_URL,ttl:(1*5*5),tableName:'user_sessions'}),
    resave: false ,
    // cookie: { maxAge: 180 * 60 * 1000 },
    name: "id"
	}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{ //local
res.locals.isAuthenticated = req.isAuthenticated();
next();
});

// app.use(function(req, res, next) {
// res.locals.session = req.session;
// next();
// });

var auth = express.Router();
require('./app/routes/auth')(auth, passport);
app.use('/auth', auth);

var users = express.Router();
require('./app/routes/users')(users, passport);
app.use('/users', users);

var index = express.Router();
require('./routes/index')(index, passport);
app.use('/', index);


/*-------Passport Configuration------*/

// app.use('/', index);








// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
