var credentials = require('./credentials');
var db = require('./db');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var BearerStrategy   = require('passport-http-bearer').Strategy;
var bcrypt = require('./bcrypt');


module.exports = function(passport){

	
	passport.serializeUser(function(user, done){
		console.log('user: ' + user);
		done(null, user);
	});

	passport.deserializeUser(function(id, done){
		console.log('id: ' + id);
		done(null, id);
	});




	var fbopt = {
		clientID: credentials.facebookAuth.clientID,
		clientSecret: credentials.facebookAuth.clientSecret,
		callbackURL: credentials.facebookAuth.callbackURL,
		profileFields:['email','name'],
		passReqToCallback: true
	}
	var fbCallback = (req,accessToken,refreshToken, profile, callback)=>{

		var profile_id  = profile.id;
		var token = accessToken;
		var name  = profile.name.givenName + ' ' + profile.name.familyName; 
		var email = profile.emails[0].value; 
		var account_type = profile.provider;
		
		var reply;
		process.nextTick(function(cb) {

			var myObject = {
				users:[{
					name:name,
					email:email,
					password:token,
					account_type:account_type,
					profile_id:profile_id,
					token:token

				}]
			}
			

			db.check_ifExistsInDB(myObject,'email',(err,pos)=>{

				var result = {}
				var rdup = db.removes_duplicatesJSON(pos);
				var newArray = db.filter_JSON(rdup,'exists','0');
				db.rem_attrFromJSON(newArray,'exists');

				var count = newArray.length.toString();

				if (Number(count) > 0){
					result['users'] = newArray;
					console.log(newArray);
					
					db.insert_multirows_json(result).then(pos=>{
						req.login({name:name,email:email} , function(err) {

							callback(null, {name:name,email:email});
						});
						
						
					}).catch(error=>{
						callback(null, false);
					});

				}else{
					req.login({name:name,email:email} , function(err) {

						callback(null, {name:name,email:email});
					});
				}

			});

		});



	}

	var Gopt = {
		clientID: credentials.googleAuth.clientID,
		clientSecret: credentials.googleAuth.clientSecret,
		callbackURL: credentials.googleAuth.callbackURL,
		profileFields:['email'],
		passReqToCallback: true
	}
	var GoCallback = (req,accessToken,refreshToken, profile, callback)=>{


		var profile_id  = profile.id;
		var token = accessToken;
		var name  = profile.name.givenName + ' ' + profile.name.familyName; 
		var email = profile.emails[0].value; 
		var account_type = profile.provider;
		
		var reply;
		process.nextTick(function(cb) {

			var myObject = {
				users:[{
					name:name,
					email:email,
					password:token,
					account_type:account_type,
					profile_id:profile_id,
					token:token

				}]
			}
			

			db.check_ifExistsInDB(myObject,'email',(err,pos)=>{

				var result = {}
				var rdup = db.removes_duplicatesJSON(pos);
				var newArray = db.filter_JSON(rdup,'exists','0');
				db.rem_attrFromJSON(newArray,'exists');

				var count = newArray.length.toString();

				if (Number(count) > 0){
					result['users'] = newArray;
					
					db.insert_multirows_json(result).then(pis=>{
						
						
						req.login({email: email,name:name} , function(err) {

							callback(null, {name:name,email:email});
						});
						
						
					}).catch(error=>{
						callback(null, false);
					});

				}else{
					req.login({email: email,name:name} , function(err) {

						callback(null, {name:name,email:email});
					});
				}

			});

		});


	}


	var localCallback =	(username, password, done)=>{

		
		var myObject = {
			users:[{
				email:username,
				password:password
			}]
		}

		db.check_ifExistsInDB(myObject,'email',(err,pos)=>{

			


			if (Number(pos[0].exists) === 1 && pos[0].active === true){

				bcrypt.compareRawPwdToHash(password,pos[0].password).then(reply=>{
					var mail = pos[0].email;
					var name = pos[0].name;
					return done(null,{email:mail,name:name});
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


