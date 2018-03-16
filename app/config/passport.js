var credentials = require('./credentials');
var db = require('./db');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var BearerStrategy   = require('passport-http-bearer').Strategy;
var bcrypt = require('./bcrypt');


module.exports = function(passport){

	
	passport.serializeUser(function(user, done){
		// console.log(user);
		done(null, user);
	});

	passport.deserializeUser(function(id, done){
		// console.log(id);
		done(null, id);
	});




	var fbopt = {
		clientID: credentials.facebookAuth.clientID,
		clientSecret: credentials.facebookAuth.clientSecret,
		callbackURL: credentials.facebookAuth.callbackURL,
		profileFields:['email'],
		passReqToCallback: true
	}
	var fbCallback = (req,accessToken,refreshToken, profile, callback)=>{

		if(profile._json.email != 'undefined' || profile._json.email != ''){
			return callback(null, profile);

		}else{
			return callback(null, false);
		}


	}

	var Gopt = {
		clientID: credentials.googleAuth.clientID,
		clientSecret: credentials.googleAuth.clientSecret,
		callbackURL: credentials.googleAuth.callbackURL,
		profileFields:['email'],
		passReqToCallback: true
	}
	var GoCallback = (req,accessToken,refreshToken, profile, callback)=>{

		return callback(null, profile);


	}


	var localCallback =	(username, password, done)=>{

		
		var myObject = {
			users:[{
				email:username,
				password:password
			}]
		}

		db.check_ifExistsInDB(myObject,'email',(err,pos)=>{

			if (Number(pos[0].exists) === 1){

				bcrypt.compareRawPwdToHash(password,pos[0].password).then(reply=>{
					return done(null,{email:pos[0].email});
				}).catch(err=>{
					return done(null,false);
				});

			}else{
				console.log('email is unregistered');return done(null,false);
			}

		});



	}



	passport.use(new FacebookStrategy(fbopt,fbCallback));
	passport.use(new GoogleStrategy(Gopt,GoCallback));
	passport.use('signin',new LocalStrategy(localCallback));











	return passport;
}


