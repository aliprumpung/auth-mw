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
							
							db.insert_multirows_json(result).then(pos=>{
								req.login(email , function(err) {

									callback(null, {email:profile.emails[0].value});
								});
								
								
							}).catch(error=>{
								callback(null, false);
							});

						}else{
							callback(null, {email:profile.emails[0].value});
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
							
							db.insert_multirows_json(result).then(pos=>{
								req.login(email , function(err) {

									callback(null, {email:profile.emails[0].value});
								});
								
								
							}).catch(error=>{
								callback(null, false);
							});

						}else{
							callback(null, {email:profile.emails[0].value});
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

			console.log(pos);
			



			if (Number(pos[0].exists) === 1 && pos[0].active === true){

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


/*

// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
            // pull in our app id and secret from our auth.js file
            clientID        : '813365472032554',
            clientSecret    : 'f32ed4d4b39008a290686ae744f88c8f',
            callbackURL     : 'http://clouie.ca/auth/facebook/callback'

        },

        // facebook will send back the token and profile
        function(req, token, refreshToken, profile, done) {
            console.log('facebook login is starting');
            //console.log(profile);

            var id  = profile.id; // set the users facebook id
            var token = token; // we will save the token that facebook provides to the user
            var name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            var email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first


            console.log(name, email, id);
            // asynchronous
            process.nextTick(function(callback) {

                // find the user in the database based on their facebook id
                User.snfindOne(id, function(err, returningUser, data, user) {
                    console.log(data);

                    user = data;
                    console.log(data +'is found');

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (returningUser === true) {
                        //console.log(data);
                        console.log(returningUser);

                        console.log('already a fb member '+ data);
                        return done(null, user); // user found, return that user
                    } else {
                        //if there is no user found with that facebook id, create them

                        // set all of the facebook information in our user model

                        var account_type = profile.provider;
                        var id  = (profile.id); // set the users facebook id
                        var token = token; // we will save the token that facebook provides to the user
                        var name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        var email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                        console.log(token, name, email, id);

                        data = [
                            name,
                            email,
                            token,
                            account_type,
                            null,
                            id

                        ];


                        // save our user to the database
                        User.fbsave(data, req, function(userData){
                            console.log('the user is being saved', userData);

                            return done(null, userData);
                        });


                    }

                });
            });

        }));


*/




	return passport;
}


