

const mw = require('../mw/index');
const path = require('path');
const fs = require('fs');
var bcrypt = require('../auth/bcrypt');
var upload = require('../functions/uploads');
const nodemailer = require('nodemailer');
var db = require('../functions/db');
var randtoken = require('rand-token');
const saltRounds = 10;

module.exports =  function(router, passport){

	router.get("/profile/:id", function(req, res) {

		res.render('account',{title:'User\'s profile'});


	});
	router.post("/profile/:id", function(req, res) {

		var id = req.params.id;

		db.findOneById('users',`U_id=\'${id}\'`).then(pos=>{

			res.json({title:'User\'s profile',data:pos,errorMsg:''});
		}).catch(err=>{

			res.json({title:'User\'s profile',data:'',errorMsg:'error occured..'});
		});
	});

	router.post("/profile/:id/update",upload.imgWithMulter.any(),  function(req, res) {
		
		var rem_img = req.body.state;
		var id =  req.body.u_id;
		var photo_url='none.png';
		var name = req.body.name;
		
		
		
		var last_login = timestamp();
		var myObject;

		if (req.files[0] !== undefined ){
			photo_url = req.files[0].filename;
		}

		if(rem_img === 'true'){

			myObject ={users: {
							name:name,
							photo_url:photo_url,
							last_login:timestamp(),
							where_AND:{
								u_id:id
							}
						}
						};	


		}else{

			myObject ={users: {
							name:name,
							last_login:timestamp(),
							where_AND:{
								u_id:id
							}
						}
						};	


		}

		var run_user_update = db.exec_query(3,myObject);
		run_user_update.then(res=>{

			var exist = statPath(req.body.old_photo_url);

			if(exist && exist.isFile() && req.body.old_photo_url !== 'none.png'){
					
					if(rem_img === 'true'){
						fs.unlinkSync(img_path(req.body.old_photo_url));
						console.log('file deleted..');
					}else{
						console.log('file not deleted..');
					}

			}

		res.json({title:'User\'s profile',data:res,errorMsg:''});
		}).catch(err=>{
		res.json({title:'User\'s profile',data:'',errorMsg:'error occured..'});
		});
	
	});


	router.get("/images/:img_name", function(req, res) {
		res.header("Access-Control-Allow-Origin", "http://localhost:3000");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		var img_name = req.params.img_name;

		var exist = statPath(img_name);
		if(exist && exist.isFile()){
			res.sendFile(img_path(img_name));
		}else{
			res.json({error:'no such file or directory'});
		}

	});

	function statPath(url){
		var a = path.join(__dirname ,'../media/uploads',url);
		
		try{
			return fs.statSync(a);
		}catch (ex) {}
		return false;
	}
	function img_path(url){
		var a = path.join(__dirname ,'../media/uploads',url);
		return a;
	}

	router.get('/',mw.isAuthenticated, function(req, res, next) {

		var myObject = {

			users:[{
				u_id:req.user.id
			}]
		}

		db.check_ifExistsInDB(myObject,'u_id','local',(err,pos)=>{
			var userData ={
				users:pos
			}
			console.log(userData.users[0]);
			res.render('upload', { title: 'Home from index', user:userData.users[0]});

		});





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
		res.render('account', { title: 'Registration form'});
	});

	router.post('/signup', (req, res, next)=> {

		// console.log(req.body);
		req.session.username = req.body.username;
		req.checkBody('email','The email you entered is invalid, please try again.').isEmail();
		req.checkBody('email','Email address must be between 4-100 characters long, please try again.').len(4,100);
		req.checkBody('username','username cannot be empty').notEmpty();
		req.checkBody('password','password is invalid').len(4,15);
		req.check('password','password must include one lowercase character, one uppercase character, a number, and a special character.').matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/);
		req.checkBody('passwordMatch','password do not match, please try again.').equals(req.body.password);

		var errors = req.validationErrors();

		if(errors){
			
			// console.log(`errors: ${JSON.stringify(errors)}`)
			req.session.errors = errors;
			req.session.success = false;
			
			// res.render('signup', { title: 'Registration Error.',errors: errors,username:req.session.username});
			res.json({success:false,message:errors});



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




						db.check_ifExistsInDB(myObject,'email','local',(err,pos)=>{

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
									//res.render('signup', { title: 'Registration success',sent: [{msg:'We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrived.'}],links:[{msg:link}]});
									res.status(200).json({success:true,message:'We have sent an email with a confirmation link to your email address. Please allow 5-10 minutes for this message to arrived.',u_id:pos.rows[0].u_id});

								}).catch(error=>{
									res.status(409).json({success:false,message:error.message});
									//res.render('signup', { title: 'Registration Error.',errors: [{msg:error.message}],username:req.session.username});
								});

							}else{
								// res.status(500).json({errMsg:'Email already existed.'});
								res.status(409).json({success:false,message:'Email already existed.'});
								//res.render('signup', { title: 'Registration Error.',errors: [{msg:'Email already existed.'}],username:req.session.username});
							}

						});




					}else{
						db.check_sKEY('shared_k','users', sKey);
					}

				}).catch(err=>{
					// console.log(err);
					//res.render('signup', { title: 'Registration Error.',errors: [{msg:err.message}],username:req.session.username});
					res.status(500).json({success:false,message:'error occured..'});
				});





			}).catch(err=>{ 
				// res.status(500).json({errMsg:err}); 
				//res.render('signup', { title: 'Registration Error.',errors: [{msg:err.message}],username:req.session.username});
				res.status(500).json({success:false,message:'error occured...'});
			});



		}

	});

	router.get('/signup/verify',function(req,res){
		var rand = Math.floor((Math.random() * 100) + 54);
		var host = req.get('host');

		if((req.protocol+"://"+req.get('host'))==("http://"+host)){

		//console.log(req.query.id + ' - ' + rand);


		let email = new Buffer(req.query._s, 'base64').toString('ascii');




		var myObject = {users:[{email:email}]}

		db.check_ifExistsInDB(myObject,'email','local',(err,pos)=>{
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
					var u_id = pos[0].u_id;
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
						req.login({id:u_id}, function(err) {

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

