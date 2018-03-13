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


var localCallback =	(username, password, done)=>{


/*
  	pg_.query('select id, pwd from users where uname=$1', [ username ],(err,res)=>{

	if(err){ 
		done(err) 
	}else{

  		if(res.rows.length === 0){
  			done(null,false);
  		}else{
  		const hash = res.rows[0].pwd.toString();
  		bcrypt.compare(password,hash, (err,resp)=>{

  			if(resp === true){
  				
      		return done(null,{userid:res.rows[0].pwd.toString()});

  			}else{
  				
  				return done(null, false);

  			};

  		});

  		}

  	}
  		

  	});*/
   
}

passport.use(new FacebookStrategy(fbopt,fbCallback));
passport.use(new GoogleStrategy(Gopt,GoCallback));
passport.use('local.signin',new LocalStrategy(localCallback));

  			



		





	return passport;
}


