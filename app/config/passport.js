var credentials = require('./credentials');

var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var BearerStrategy   = require('passport-http-bearer').Strategy;



module.exports = function(passport){

	
passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
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



passport.use(new FacebookStrategy(fbopt,fbCallback));
passport.use(new GoogleStrategy(Gopt,GoCallback));

	
	




	
	



	return passport;
}


