
const mw = require('../mw/index');
var bcrypt = require('../config/bcrypt');
const nodemailer = require('nodemailer');
var db = require('../config/db');
var randtoken = require('rand-token');
const saltRounds = 10;
module.exports =  function(router, passport){


	router.get('/',mw.isAuthenticated, function(req, res, next) {
		
	res.render('index', { title: 'Hello from users', username:req.user.name});
	});

	router.get('/login',mw.middleWareAuth, function(req, res, next) {
		res.render('login', { title: 'express'});
	});


	router.post('/login',passport.authenticate('signin',{
		successRedirect:'/',
		failureRedirect:'/users/login'
	}));

	router.get('/logout', function(req, res){
		if(req.session){
			req.logout();
			req.session.destroy(err=>{
				if (err){
					return next(err);
				}else{
					return res.redirect('/users/login');
				}
			});

		}
	});

	router.get('/signup', function(req, res, next) {
		res.render('signup', { title: 'Registration form'});
	});

	router.post('/signup', (req, res, next)=> {


		req.session.username = req.body.username;
		req.checkBody('email','The email you entered is invalid, please try again.').isEmail();
		req.checkBody('email','Email address must be between 4-100 characters long, please try again.').len(4,100);
		req.checkBody('username','username cannot be empty').notEmpty();
		req.checkBody('password','password is invalid').len(4,15);
		req.check('password','password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/);
		req.checkBody('passwordMatch','password do not match, please try again.').equals(req.body.password);

		var errors = req.validationErrors();

		if(errors){
			console.log(`errors: ${JSON.stringify(errors)}`)
			req.session.errors = errors;
			req.session.success = false;
			res.render('signup', { title: 'Registration Error.',errors: errors,username:req.session.username});


		}else{
			req.session.success = true;




			var email = req.body.email;
			var username = req.body.username;
			var password = req.body.password;
			var rand = Math.floor((Math.random() * 100) + 54);
			var sKey = randtoken.generate(32).toString();

			

			bcrypt.hashingPwd(password,saltRounds).then(hash=>{

				var sKeygen = db.check_sKEY('shared_k','users', sKey);
				sKeygen.then(skey=>{

					if(skey.rows.length === 0){



						var myObject = {
							users:[{
								name:username,
								email:email,
								password:hash,
								account_type:'local',
								rand:rand,
								shared_k:sKey,
								created_at:timestamp()
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
									var mail = newArray[0].email;
									var name = newArray[0].name;
									var host = req.get('host');
									let encodedMail = new Buffer(mail).toString('base64');
									let link="http://"+host+"/users/signup/verify?_s="+encodedMail+"&id="+rand;
									mailOptions={
										from: "ALI PRUMPUNG <no-reply@aliprumpung.id>", 
										to : mail,
										subject : "Please confirm your Email account",
										html : "Hello " + name + ",<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
									}
									
									nodemailer.mail(mailOptions);
									 res.render('signup', { title: 'Registration success',sent: [{msg:'We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrived.'}],links:[{msg:link}]});
									 // res.status(200).json({msg:'We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrive.'});
									// res.send('<a href='+link+'>Click here to verify</a>');
									/*req.login(username , function(err) {

										res.redirect('/users');
									});*/

								}).catch(error=>{
									// res.status(500).json({errMsg:error});
									res.render('signup', { title: 'Registration Error.',errors: [{msg:error.message}],username:req.session.username});
								});

							}else{
								// res.status(500).json({errMsg:'Email already existed.'});
								
								res.render('signup', { title: 'Registration Error.',errors: [{msg:'Email already existed.'}],username:req.session.username});
							}

						});




					}else{
						db.check_sKEY('shared_k','users', sKey);
					}

				}).catch(err=>{
					console.log(err);
					res.render('signup', { title: 'Registration Error.',errors: [{msg:err.message}],username:req.session.username});
				});





			}).catch(err=>{ 
				// res.status(500).json({errMsg:err}); 
				res.render('signup', { title: 'Registration Error.',errors: [{msg:err.message}],username:req.session.username});
		});



		}

	});

	router.get('/signup/verify',function(req,res){
		var rand = Math.floor((Math.random() * 100) + 54);
		var host = req.get('host');

		if((req.protocol+"://"+req.get('host'))==("http://"+host)){

			console.log(req.query.id + ' - ' + rand);


			let email = new Buffer(req.query._s, 'base64').toString('ascii');




			var myObject = {users:[{email:email}]}

			db.check_ifExistsInDB(myObject,'email',(err,pos)=>{
				if ( pos[0].exists=== '1' && pos[0].rand === req.query.id){

					var myObject1 ={
						users: {
							active: true,
							where_AND:{
								email:pos[0].email
							}
						}

					}

					var str_Results = db.exec_query(3,myObject1);

					str_Results.then(rep=>{
									var mail = pos[0].email;
									var name = pos[0].name;
									var host = req.get('host');
									
									mailOptions={
										from: "ALI PRUMPUNG <no-reply@aliprumpung.id>", 
										to : mail,
										subject : "Registration success.",
										html : "Dear " + name + " , Thank you for registering" 
									}
									
									nodemailer.mail(mailOptions);
						// res.end("Email "+name+" is been Successfully verified");
						req.login({email: email,name:name}, function(err) {

										res.redirect('/');
									});
					}).catch(err=>{res.send({errMsg:err})});



				}else{
					res.end("<h3>Bad Request</h3>");
				}


			});

			console.log("email is verified");


		}
		else
		{
			res.end("Request is from unknown source");
		}
	});




	function timestamp(){
		function pad(n) {return n<10 ? "0"+n : n}
		d=new Date()
		dash="-"
		colon=":"
		return d.getFullYear()+dash+
		pad(d.getMonth()+1)+dash+
		pad(d.getDate())+" "+
		pad(d.getHours())+colon+
		pad(d.getMinutes())+colon+
		pad(d.getSeconds())
	}

}

