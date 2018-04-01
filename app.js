require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');//social auth
var social = require('./back-end/auth/passport')(passport);
var expressValidator = require('express-validator');
var pg = require('pg');
var session = require('express-session');
var pgStore = require('connect-pg-simple')(session);
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const cors = require('cors');
const fileupload = require('express-fileupload');

// var index = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '/front-end/app/views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

/*app.use(fileupload({
  limits:{ fileSize:50*100*100 }
}));*/
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'front-end')));

/*-------Passport Configuration------*/

app.use(expressValidator());
app.use(session({
		saveUninitialized:false,
    secret: process.env.FOO_COOKIE_SECRET,
    store: new pgStore({ conString: process.env.DATABASE_URL,ttl:(1*60*60),tableName:'user_sessions'}),
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

app.use(function(req, res, next) {
res.locals.session = req.session;
next();
});

var index = express.Router();
require('./back-end/routes/index')(index, passport);
app.use('/', index);

var auth = express.Router();
require('./back-end/routes/auth')(auth, passport);
app.use('/auth', auth);

var users = express.Router();
require('./back-end/routes/users')(users, passport);
app.use('/users', users);

var account = express.Router();
require('./back-end/routes/account')(account, passport);
app.use('/account', account);


/*-------Passport Configuration------*/

// app.use('/', index);


/*-------api Configuration------*/

var api = express.Router();
require('./api/v1/index')(api, passport);
app.use('/api/v1', api);


/*-------api Configuration------*/





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
